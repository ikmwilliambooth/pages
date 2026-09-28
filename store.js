const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const scrypt = require('node:util').promisify(crypto.scrypt);

const MAX_IMAGE = 3 * 1024 * 1024;
const MAX_ATTACHMENT = 5 * 1024 * 1024;
const SUPPORTED_IMAGE_MIME = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };
const SUPPORTED_ATTACHMENT_MIME = { 'application/pdf': 'pdf', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' };

function fail(status, message) { throw Object.assign(new Error(message), { status }); }
function save(file, value) { fs.writeFileSync(file + '.tmp', JSON.stringify(value), { mode: 0o600 }); fs.renameSync(file + '.tmp', file); }
function readJson(file, fallback) { return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback; }

class FileStore {
  constructor(options = {}) {
    this.type = 'file';
    this.dataDir = options.dataDir || process.env.IKM_DATA_DIR || path.join(process.cwd(), 'data');
    this.adminFile = path.join(this.dataDir, 'admin.json');
    this.albumFile = path.join(this.dataDir, 'albums.json');
    this.informationFile = path.join(this.dataDir, 'information.json');
  }
  async initialize() {
    fs.mkdirSync(this.dataDir, { recursive: true, mode: 0o700 });
    if (!fs.existsSync(this.adminFile)) {
      const password = crypto.randomBytes(18).toString('base64url');
      const salt = crypto.randomBytes(16).toString('hex');
      save(this.adminFile, { username: 'admin', salt, hash: (await scrypt(password, salt, 64)).toString('hex') });
      fs.writeFileSync(path.join(this.dataDir, 'initial-admin.txt'), `Username: admin\nPassword: ${password}\n\nSimpan kredensial ini secara pribadi. File ini tidak dilayani oleh website.\n`, { mode: 0o600 });
    }
    if (!fs.existsSync(this.albumFile)) save(this.albumFile, []);
    if (!fs.existsSync(this.informationFile)) save(this.informationFile, []);
  }
  async authenticate({ username, password }) {
    const admin = readJson(this.adminFile, null);
    if (!admin || typeof password !== 'string' || password.length > 256) return null;
    const derived = await scrypt(password, admin.salt, 64);
    if (username !== admin.username || !crypto.timingSafeEqual(derived, Buffer.from(admin.hash, 'hex'))) return null;
    return { username: admin.username };
  }
  async getAlbums() { return readJson(this.albumFile, []); }
  async addAlbum(input) {
    const album = toAlbum(input, `data:${input.thumbnail.mediaType};base64,${input.thumbnail.base64}`);
    const albums = readJson(this.albumFile, []);
    albums.unshift(album);
    save(this.albumFile, albums);
    return album;
  }
  async deleteAlbum(id) {
    const albums = readJson(this.albumFile, []);
    const next = albums.filter(a => a.id !== id);
    if (next.length === albums.length) return false;
    save(this.albumFile, next);
    return true;
  }
  async getInformation() { return readJson(this.informationFile, []).map(item => stripInternal(item)); }
  async addInformation(input) {
    const item = input.attachment
      ? { id: input.id, title: input.title, content: input.content, createdAt: input.createdAt, attachment: { name: input.attachment.name, type: input.attachment.mediaType, size: input.attachment.size, data: input.attachment.base64 } }
      : { id: input.id, title: input.title, content: input.content, createdAt: input.createdAt, attachment: null };
    const items = readJson(this.informationFile, []);
    items.unshift(item);
    save(this.informationFile, items);
    return stripInternal(item);
  }
  async getAttachment(id) {
    const items = readJson(this.informationFile, []);
    const item = items.find(i => i.id === id);
    if (!item || !item.attachment) return null;
    const att = item.attachment;
    return { name: att.name, type: att.type, size: att.size, data: Buffer.from(att.data, 'base64') };
  }
  async deleteInformation(id) {
    const items = readJson(this.informationFile, []);
    const next = items.filter(i => i.id !== id);
    if (next.length === items.length) return false;
    save(this.informationFile, next);
    return true;
  }
}

class SupabaseStore {
  constructor(options = {}) {
    this.type = 'supabase';
    const { createClient } = require('@supabase/supabase-js');
    this.supabase = options.client || createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      db: { schema: 'public' },
    });
    this.bucket = options.bucket || 'ikm';
  }
  async initialize() {
    await this.supabase.storage.createBucket(`${this.bucket}-thumbnails`, { public: true });
    await this.supabase.storage.createBucket(`${this.bucket}-attachments`, { public: false });
  }
  async authenticate({ username, password }) {
    const { data: { user }, error } = await this.supabase.auth.signInWithPassword({ email: username, password });
    if (error || !user) return null;
    return { username: user.email, email: user.email };
  }
  async getAlbums() {
    const { data, error } = await this.supabase.from('albums').select('*').order('created_at', { ascending: false });
    if (error) throw Object.assign(new Error(error.message), { status: 500 });
    return data.map(row => ({
      id: row.id, title: row.title, category: row.category,
      date: row.date, driveUrl: row.drive_url,
      thumbnail: row.thumbnail_path ? this.supabase.storage.from(`${this.bucket}-thumbnails`).getPublicUrl(row.thumbnail_path).data.publicUrl : null,
      createdAt: row.created_at,
    }));
  }
  async addAlbum(input) {
    const ext = SUPPORTED_IMAGE_MIME[input.thumbnail.mediaType];
    const fileName = `${input.id}.${ext}`;
    const bytes = Buffer.from(input.thumbnail.base64, 'base64');
    const { error: uploadError } = await this.supabase.storage.from(`${this.bucket}-thumbnails`).upload(`thumbnails/${fileName}`, bytes, { contentType: input.thumbnail.mediaType, upsert: true });
    if (uploadError) throw Object.assign(new Error(uploadError.message), { status: 500 });
    const thumbnail_path = `thumbnails/${fileName}`;
    const { data, error } = await this.supabase.from('albums').insert({
      id: input.id, title: input.title, category: input.category,
      date: input.date, drive_url: input.driveUrl, thumbnail_path,
    }).select().single();
    if (error) throw Object.assign(new Error(error.message), { status: 500 });
    return { id: data.id, title: data.title, category: data.category, date: data.date, driveUrl: data.drive_url, thumbnail: this.supabase.storage.from(`${this.bucket}-thumbnails`).getPublicUrl(data.thumbnail_path).data.publicUrl, createdAt: data.created_at };
  }
  async deleteAlbum(id) {
    const { data: row, error: fetchError } = await this.supabase.from('albums').select('thumbnail_path').eq('id', id).single();
    if (fetchError) { if (fetchError.code === 'PGRST116') return false; throw Object.assign(new Error(fetchError.message), { status: 500 }); }
    await this.supabase.storage.from(`${this.bucket}-thumbnails`).remove([row.thumbnail_path]);
    const { error } = await this.supabase.from('albums').delete().eq('id', id);
    if (error) throw Object.assign(new Error(error.message), { status: 500 });
    return true;
  }
  async getInformation() {
    const { data, error } = await this.supabase.from('information').select('*').order('created_at', { ascending: false });
    if (error) throw Object.assign(new Error(error.message), { status: 500 });
    return data.map(row => stripInternal(row));
  }
  async addInformation(input) {
    let attachment = null;
    if (input.attachment) {
      const ext = SUPPORTED_ATTACHMENT_MIME[input.attachment.mediaType];
      const fileName = `${input.id}-${input.attachment.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '_').slice(-80)}`;
      const finalName = fileName.endsWith(`.${ext}`) ? fileName : `${fileName}.${ext}`;
      const bytes = Buffer.from(input.attachment.base64, 'base64');
      const { error: uploadError } = await this.supabase.storage.from(`${this.bucket}-attachments`).upload(`attachments/${finalName}`, bytes, { contentType: input.attachment.mediaType, upsert: true });
      if (uploadError) throw Object.assign(new Error(uploadError.message), { status: 500 });
      attachment = { attachment_name: input.attachment.name, attachment_type: input.attachment.mediaType, attachment_size: input.attachment.size, attachment_path: `attachments/${finalName}` };
    }
    const { data, error } = await this.supabase.from('information').insert({
      id: input.id, title: input.title, content: input.content,
      ...attachment,
    }).select().single();
    if (error) throw Object.assign(new Error(error.message), { status: 500 });
    return stripInternal(data);
  }
  async getAttachment(id) {
    const { data: row, error } = await this.supabase.from('information').select('attachment_name,attachment_type,attachment_size,attachment_path').eq('id', id).single();
    if (error) { if (error.code === 'PGRST116') return null; throw Object.assign(new Error(error.message), { status: 500 }); }
    if (!row || !row.attachment_path) return null;
    const { data: blob, error: dlError } = await this.supabase.storage.from(`${this.bucket}-attachments`).download(row.attachment_path);
    if (dlError) throw Object.assign(new Error(dlError.message), { status: 500 });
    const buffer = Buffer.from(await blob.arrayBuffer());
    return { name: row.attachment_name, type: row.attachment_type, size: Number(row.attachment_size), data: buffer };
  }
  async deleteInformation(id) {
    const { data: row, error: fetchError } = await this.supabase.from('information').select('attachment_path').eq('id', id).single();
    if (fetchError) { if (fetchError.code === 'PGRST116') return false; throw Object.assign(new Error(fetchError.message), { status: 500 }); }
    if (row && row.attachment_path) {
      const { error: rmError } = await this.supabase.storage.from(`${this.bucket}-attachments`).remove([row.attachment_path]);
      if (rmError) throw Object.assign(new Error(rmError.message), { status: 500 });
    }
    const { error } = await this.supabase.from('information').delete().eq('id', id);
    if (error) throw Object.assign(new Error(error.message), { status: 500 });
    return true;
  }
}

function toAlbum(input, thumbnailUrl) {
  return { id: input.id, title: input.title, category: input.category, date: input.date, driveUrl: input.driveUrl, thumbnail: thumbnailUrl, createdAt: input.createdAt };
}
function stripInternal(item) {
  if (!item) return item;
  const attachment = item.attachment
    ? { name: item.attachment.name, type: item.attachment.type, size: item.attachment.size }
    : item.attachment_name
      ? { name: item.attachment_name, type: item.attachment_type, size: Number(item.attachment_size) }
      : null;
  return { id: item.id, title: item.title, content: item.content, createdAt: item.createdAt, attachment };
}

function createStore(options = {}) {
  if (options.store) return options.store;
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return new SupabaseStore(options);
  return new FileStore(options);
}

module.exports = { FileStore, SupabaseStore, createStore, MAX_IMAGE, MAX_ATTACHMENT, SUPPORTED_IMAGE_MIME, SUPPORTED_ATTACHMENT_MIME, fail };

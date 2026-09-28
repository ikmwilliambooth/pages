const { test } = require('node:test');
const assert = require('node:assert/strict');
const { SupabaseStore } = require('./store');

function makeMock({ authUser = { email: 'admin@ikm.local' }, authError = null, albums = [], information = [] } = {}) {
  const db = { albums: albums.slice(), information: information.slice() };
  const recorded = { auth: [], createBucket: [], upload: [], remove: [], download: [], getPublicUrl: [] };
  const bucketObjects = {};

  function tableApi(table) {
    let mode = 'select', insertVal = null, wantSingle = false, eqs = [];
    const api = {
      select(_q) { if (mode === 'insert') { mode = 'postInsert'; } else { mode = 'select'; insertVal = null; wantSingle = false; eqs = []; } return api; },
      insert(v) { mode = 'insert'; insertVal = v; wantSingle = false; eqs = []; return api; },
      delete() { mode = 'delete'; insertVal = null; wantSingle = false; eqs = []; return api; },
      eq(col, val) { eqs.push([col, val]); return api; },
      order() { return api; },
      single() { wantSingle = true; return api; },
    };
    api.then = (resolve) => {
      if (mode === 'postInsert' || mode === 'insert') {
        const row = { ...insertVal, created_at: insertVal.created_at || new Date().toISOString() };
        db[table].push(row);
        return resolve({ data: wantSingle ? row : [row], error: null });
      }
      if (mode === 'select') {
        let rows = db[table].filter(r => eqs.every(([c, v]) => r[c] === v));
        if (wantSingle) {
          if (rows.length === 0) return resolve({ data: null, error: { code: 'PGRST116', message: 'Not found' } });
          return resolve({ data: rows[0], error: null });
        }
        return resolve({ data: rows, error: null });
      }
      if (mode === 'delete') {
        const matching = db[table].filter(r => eqs.every(([c, v]) => r[c] === v));
        db[table] = db[table].filter(r => !matching.includes(r));
        return resolve({ data: matching, error: null });
      }
      return resolve({ data: null, error: null });
    };
    return api;
  }

  const storage = {
    createBucket: (id, opts) => { recorded.createBucket.push({ id, opts }); return Promise.resolve({ data: { id }, error: bucketObjects[id] ? { message: 'already exists' } : null }); },
    from: (name) => ({
      upload: (filePath, bytes, opts) => { recorded.upload.push({ name, filePath, bytes, opts }); return Promise.resolve({ data: { path: filePath }, error: null }); },
      remove: (paths) => { recorded.remove.push({ name, paths }); return Promise.resolve({ data: {}, error: null }); },
      download: (filePath) => { recorded.download.push({ name, filePath }); const blob = bucketObjects[`${name}:${filePath}`]; return Promise.resolve({ data: blob || null, error: blob ? null : { message: 'not found' } }); },
      getPublicUrl: (filePath) => { recorded.getPublicUrl.push({ name, filePath }); return { data: { publicUrl: `https://pub/${name}/${filePath}` }, error: null }; },
    }),
  };
  const supabase = {
    auth: { signInWithPassword: (creds) => Promise.resolve((recorded.auth.push(creds), { data: authError ? { user: null } : { user: authUser }, error: authError })) },
    storage,
    from: (table) => tableApi(table),
  };
  return { supabase, recorded, bucketObjects };
}

test('SupabaseStore.authenticate ok / fail', async () => {
  const fail = new SupabaseStore({ client: makeMock({ authError: { message: 'invalid' } }).supabase });
  assert.equal(await fail.authenticate({ username: 'admin@ikm.local', password: 'x' }), null);
  const ok = new SupabaseStore({ client: makeMock({ authUser: { email: 'admin@ikm.local' } }).supabase });
  assert.deepEqual(await ok.authenticate({ username: 'admin@ikm.local', password: 'p' }), { username: 'admin@ikm.local', email: 'admin@ikm.local' });
});

test('SupabaseStore.getAlbums maps rows to public thumbnail URLs', async () => {
  const albums = [{ id: '1', title: 'PKKMB', category: 'PKKMB', date: '2026-08-24', drive_url: 'https://drive.google.com/drive/folders/x', thumbnail_path: 'thumbnails/1.png', created_at: '2026-08-24T00:00:00Z' }];
  const store = new SupabaseStore({ client: makeMock({ albums }).supabase });
  const rows = await store.getAlbums();
  assert.equal(rows[0].title, 'PKKMB');
  assert.equal(rows[0].driveUrl, 'https://drive.google.com/drive/folders/x');
  assert.equal(rows[0].thumbnail, 'https://pub/ikm-thumbnails/thumbnails/1.png');
  assert.equal(rows[0].createdAt, '2026-08-24T00:00:00Z');
});

test('SupabaseStore.addAlbum uploads thumbnail and inserts row', async () => {
  const { supabase, recorded } = makeMock();
  const store = new SupabaseStore({ client: supabase });
  const input = { id: 'a1', title: 'T', category: 'Seminar', date: '2026-09-17', driveUrl: 'https://drive.google.com/drive/folders/x', createdAt: '2026-09-17T00:00:00Z', thumbnail: { mediaType: 'image/png', base64: 'iVBORw==' } };
  const album = await store.addAlbum(input);
  assert.equal(album.thumbnail, 'https://pub/ikm-thumbnails/thumbnails/a1.png');
  assert.equal(recorded.upload[0].name, 'ikm-thumbnails');
  assert.equal(recorded.upload[0].filePath, 'thumbnails/a1.png');
  assert.deepEqual(Array.from(recorded.upload[0].bytes), Array.from(Buffer.from('iVBORw==', 'base64')));
  assert.equal(recorded.upload[0].opts.contentType, 'image/png');
  assert.equal(album.driveUrl, 'https://drive.google.com/drive/folders/x');
});

test('SupabaseStore.deleteAlbum false when not found, removes storage + row otherwise', async () => {
  const { supabase, recorded } = makeMock();
  const store = new SupabaseStore({ client: supabase });
  assert.equal(await store.deleteAlbum('missing'), false);
  assert.deepEqual(recorded.remove, []);
  const { supabase: s2, recorded: r2 } = makeMock({ albums: [{ id: 'd1', thumbnail_path: 'thumbnails/d1.png' }] });
  const store2 = new SupabaseStore({ client: s2 });
  assert.equal(await store2.deleteAlbum('d1'), true);
  assert.equal(r2.remove[0].name, 'ikm-thumbnails');
  assert.deepEqual(r2.remove[0].paths, ['thumbnails/d1.png']);
});

test('SupabaseStore.addInformation uploads attachment and inserts row', async () => {
  const { supabase, recorded } = makeMock();
  const store = new SupabaseStore({ client: supabase });
  const input = { id: 'i1', title: 'T', content: 'C', createdAt: '2026-09-17T00:00:00Z', attachment: { name: 'pengumuman.pdf', mediaType: 'application/pdf', size: 9, base64: Buffer.from('%PDF-1.4').toString('base64') } };
  const item = await store.addInformation(input);
  assert.equal(item.attachment.name, 'pengumuman.pdf');
  assert.equal(item.attachment.type, 'application/pdf');
  assert.equal(recorded.upload[0].name, 'ikm-attachments');
  assert.match(recorded.upload[0].filePath, /^attachments\/i1-.*\.pdf$/);
  assert.equal(recorded.upload[0].bytes.length, 8);
});

test('SupabaseStore.getAttachment downloads bytes; null when not found', async () => {
  const blob = { arrayBuffer: async () => Buffer.from('%PDF-1.4') };
  const { supabase, bucketObjects } = makeMock({ information: [{ id: 'i1', attachment_name: 'pengumuman.pdf', attachment_type: 'application/pdf', attachment_size: 6, attachment_path: 'attachments/i1-pengumuman.pdf' }] });
  bucketObjects['ikm-attachments:attachments/i1-pengumuman.pdf'] = blob;
  const store = new SupabaseStore({ client: supabase });
  const file = await store.getAttachment('i1');
  assert.equal(file.type, 'application/pdf');
  assert.equal(file.name, 'pengumuman.pdf');
  assert.equal(file.data.toString(), '%PDF-1.4');
  assert.equal(await store.getAttachment('nope'), null);
});

test('SupabaseStore.deleteInformation false when not found', async () => {
  const store = new SupabaseStore({ client: makeMock().supabase });
  assert.equal(await store.deleteInformation('missing'), false);
});

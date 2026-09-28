-- Skema Supabase untuk backend dokumentasi/informasi/login IKM.
-- Jalankan di SQL editor Supabase (Reference > SQL editor).
-- Backend (server.js) memakai service_role key, sehingga RLS
-- tidak wajib; di sini tetap didefinisikan supaya aman bila
-- dostreeng ke klien anon.

-- Bucket penyimpanan untuk thumbnail album (publik, dilihat pengunjung).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('ikm-thumbnails', 'ikm-thumbnails', true, 3145728,
        array['image/png','image/jpeg','image/webp'])
on conflict do nothing;

-- Bucket penyimpanan untuk lampiran informasi (privat, ditunggu via proxy server).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('ikm-attachments', 'ikm-attachments', false, 5242880,
        array['application/pdf','image/png','image/jpeg','image/webp'])
on conflict do nothing;

-- Album dokumentasi kegiatan.
create table if not exists albums (
  id uuid primary key default gen_random_uuid(),
  title         text      not null check (char_length(title) between 1 and 120),
  category      text      not null,
  date          date      not null,
  drive_url     text      not null check (drive_url like 'https://drive.google.com/drive/folders/%'),
  thumbnail_path text     not null,
  created_at    timestamptz not null default now()
);

-- Informasi dan pengumuman.
create table if not exists information (
  id              uuid primary key default gen_random_uuid(),
  title           text      not null check (char_length(title) between 1 and 120),
  content         text      not null check (char_length(content) between 1 and 10000),
  attachment_name text,
  attachment_type text,
  attachment_size bigint,
  attachment_path text,
  created_at      timestamptz not null default now()
);

-- Contoh kriteria validasi tambahan (opsional, dilengkapi di aplikasi).
-- category dikontrol di aplikasi; drive_url divalidasi di aplikasi juga.

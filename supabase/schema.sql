-- Supabase is the complete backend. The browser uses only the publishable/anon key;
-- row-level security keeps all writes limited to users listed in ikm_admins.

create table if not exists public.ikm_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  category text not null,
  date date not null,
  drive_url text not null check (drive_url like 'https://drive.google.com/drive/folders/%'),
  thumbnail_path text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.information (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  content text not null check (char_length(content) between 1 and 10000),
  attachment_name text,
  attachment_type text,
  attachment_size bigint,
  attachment_path text,
  created_at timestamptz not null default now(),
  constraint information_attachment_complete check (
    (attachment_path is null and attachment_name is null and attachment_type is null and attachment_size is null)
    or (attachment_path is not null and attachment_name is not null and attachment_type is not null and attachment_size between 1 and 5242880)
  )
);

alter table public.ikm_admins enable row level security;
alter table public.albums enable row level security;
alter table public.information enable row level security;

create or replace function public.is_ikm_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.ikm_admins where user_id = auth.uid()); $$;
revoke all on function public.is_ikm_admin() from public, anon;
grant execute on function public.is_ikm_admin() to authenticated;

grant select on public.albums, public.information to anon, authenticated;
grant insert, delete on public.albums, public.information to authenticated;
grant select on public.ikm_admins to authenticated;

drop policy if exists "Public can view albums" on public.albums;
create policy "Public can view albums" on public.albums for select to anon, authenticated using (true);
drop policy if exists "IKM admins can add albums" on public.albums;
create policy "IKM admins can add albums" on public.albums for insert to authenticated with check (public.is_ikm_admin());
drop policy if exists "IKM admins can delete albums" on public.albums;
create policy "IKM admins can delete albums" on public.albums for delete to authenticated using (public.is_ikm_admin());

drop policy if exists "Public can view information" on public.information;
create policy "Public can view information" on public.information for select to anon, authenticated using (true);
drop policy if exists "IKM admins can publish information" on public.information;
create policy "IKM admins can publish information" on public.information for insert to authenticated with check (public.is_ikm_admin());
drop policy if exists "IKM admins can delete information" on public.information;
create policy "IKM admins can delete information" on public.information for delete to authenticated using (public.is_ikm_admin());

drop policy if exists "Admins can read their own admin record" on public.ikm_admins;
create policy "Admins can read their own admin record" on public.ikm_admins for select to authenticated using (user_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('ikm-thumbnails', 'ikm-thumbnails', true, 3145728, array['image/png','image/jpeg','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- Pengumuman beserta lampirannya memang dipublikasikan untuk semua pengunjung.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('ikm-attachments', 'ikm-attachments', true, 5242880, array['application/pdf','image/png','image/jpeg','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "IKM admins can read managed files" on storage.objects;
create policy "IKM admins can read managed files" on storage.objects for select to authenticated
using (bucket_id in ('ikm-thumbnails','ikm-attachments') and public.is_ikm_admin());
drop policy if exists "IKM admins can upload files" on storage.objects;
create policy "IKM admins can upload files" on storage.objects for insert to authenticated
with check (bucket_id in ('ikm-thumbnails','ikm-attachments') and public.is_ikm_admin());
drop policy if exists "IKM admins can delete files" on storage.objects;
create policy "IKM admins can delete files" on storage.objects for delete to authenticated
using (bucket_id in ('ikm-thumbnails','ikm-attachments') and public.is_ikm_admin());

-- Setelah membuat user melalui Authentication > Users, jalankan query ini
-- dengan email admin yang benar untuk memberikan akses admin:
-- insert into public.ikm_admins (user_id)
-- select id from auth.users where email = 'admin@example.org'
-- on conflict do nothing;

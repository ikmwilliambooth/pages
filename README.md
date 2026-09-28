# Website IKM

Website statis dengan Supabase sebagai backend penuh melalui `supabase-js` di browser. Tidak perlu server Node.js atau service role key. Pengunjung membaca album dan informasi langsung dari Supabase; administrator login dengan Supabase Auth dan menulis ke Database/Storage melalui kebijakan RLS.

## Siapkan Supabase

1. Buka Supabase **Project Settings → API**. Salin Project URL dan **publishable key** (atau `anon` key lama) ke `supabase-config.js`. Kedua nilai tersebut memang digunakan oleh browser dan aman berada di repository publik selama kebijakan RLS di bawah sudah diterapkan. Jangan pernah menaruh `service_role`/secret key di frontend atau GitHub.
2. Buka **SQL Editor** dan jalankan seluruh `supabase/schema.sql`.
3. Di **Authentication → Users**, buat pengguna admin dengan email dan password yang kuat. Pendaftaran publik harus dimatikan di pengaturan Auth.
4. Di SQL Editor, beri hak admin pada email yang baru dibuat. Ganti email contoh ini:

   ```sql
   insert into public.ikm_admins (user_id)
   select id from auth.users where email = 'admin@example.org'
   on conflict do nothing;
   ```

5. Commit dan push `supabase-config.js` yang sudah berisi Project URL serta publishable/anon key ke GitHub.

`schema.sql` membuat tabel, bucket Storage, dan kebijakan RLS. Semua orang dapat membaca album/pengumuman. Hanya akun yang terdaftar di `ikm_admins` dapat menambah atau menghapus data dan berkas.

## Publikasikan

Karena aplikasi tidak lagi membutuhkan backend Node.js, repository bisa dipublikasikan sebagai situs statis, termasuk dengan GitHub Pages. Pilih branch dan folder repository di **Settings → Pages**. Pastikan `index.html`, `app.js`, `supabase-config.js`, `styles.css`, dan folder `assets` ikut dipublikasikan.

Untuk login email/password, tambahkan domain situs ke daftar URL yang diizinkan pada pengaturan Supabase Auth. Pengunjung membuka situs tersebut, lalu administrator memilih **Login admin** dan masuk dengan email serta password Auth.

## Isi situs

- Data struktur pengurus dan contoh kegiatan berada di `app.js`.
- Album resmi, thumbnail, pengumuman, dan lampiran dikelola lewat panel admin dan disimpan di Supabase.
- Lampiran informasi dan thumbnail memakai bucket publik karena kontennya ditampilkan kepada seluruh pengunjung.

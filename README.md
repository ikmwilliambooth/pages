# Panduan mengubah website IKM

Panduan ini menunjukkan file yang perlu diedit untuk mengganti isi dan tampilan situs. File utama adalah `index.html`, `app.js`, `styles.css`, folder `assets`, `supabase-config.js`, dan `supabase/schema.sql`.

## Cara kerja perubahan

1. Unduh/clone repository GitHub ke komputer dan buat cadangan sebelum mengedit.
2. Buka proyek dengan editor seperti Visual Studio Code.
3. Edit file atau kelola data melalui panel admin, sesuai panduan di bawah.
4. Pratinjau perubahan di browser, termasuk ukuran layar ponsel.
5. Commit dan push ke GitHub agar GitHub Pages menerbitkan versi baru.

## Peta file

| Yang diubah | Lokasi |
| --- | --- |
| Judul tab, deskripsi situs, logo institusi, menu, footer | `index.html` |
| Beranda, struktur pengurus, anggota sie, kategori, contoh dokumentasi | `app.js` |
| Warna, font, jarak, layout, versi ponsel | `styles.css` |
| Foto, logo, avatar, ilustrasi | folder `assets/` |
| URL project dan publishable/anon key Supabase | `supabase-config.js` |
| Tabel, bucket, dan keamanan data | `supabase/schema.sql` |

## Nama, logo, menu, dan footer

Edit `index.html`:

- `<title>` mengatur judul tab browser; `meta name="description"` mengatur ringkasan situs.
- Nama/teks logo ada pada elemen `.brand` dan `.brand-caption`.
- Logo institusi berada pada elemen `<img>` dengan kelas `.commitment-logo` dan `.diktisaintek-logo`. Ganti `src` dengan file di `assets/` dan sesuaikan `alt`.
- Menu situs ada di elemen `<nav>`. Tujuannya menggunakan hash seperti `#home` dan `#struktur`. Jika mengganti hash, sesuaikan daftar rute di `app.js`.
- Teks footer dan tombol sosial juga berada di `index.html`.

Tombol Instagram/TikTok/Email sekarang hanya menampilkan pemberitahuan. Untuk menjadikannya tautan, ganti `<button>` sosial di footer dengan `<a href="...">`. Gunakan `https://...` untuk media sosial dan `mailto:alamat@example.org` untuk email. Setelah itu, hapus handler `data-social` pada listener klik di `app.js` agar pemberitahuan lama tidak berjalan.

## Beranda

Fungsi `home()` di `app.js` berisi judul, sambutan, tombol, fakta IKM, teks tentang organisasi, dan ajakan di bagian bawah. Ubah teks di sana tanpa menghapus tag HTML atau tanda kutip.

- Foto hero sekarang `assets/pelantikan-ikm-2026.jpg`. Ganti file atau ubah path `src` pada fungsi `home()`. Ubah juga teks `alt` agar sesuai foto baru.
- Contoh kartu dokumentasi berada dalam array `sampleActivities` di bagian awal `app.js`. Ini hanya data contoh untuk galeri yang belum memiliki album Supabase. Ubah judul, kategori, tanggal, atau `image` di sana.
- Nilai `image` contoh adalah ID foto Unsplash. Foto resmi sebaiknya ditambahkan melalui panel admin. Jika ingin memakai file lokal untuk contoh, ubah fungsi `galleryCard()` agar memakai path gambar di `assets/`.

## Struktur organisasi

Di fungsi `structure()` dalam `app.js`, kartu pimpinan dan pengurus utama dibuat dari pemanggilan `person(nama, jabatan, ..., 'assets/foto.png')`. Ganti nama, jabatan, dan path foto pada kartu yang sesuai.

Daftar sie ada di array `divisions` pada bagian awal `app.js`. Setiap entri menyimpan `name`, `icon`, `description`, `color`, `ink`, `members`, dan `images`. Contoh:

```js
{
  name: 'Humas',
  icon: 'megaphone',
  description: 'Membangun relasi dan menyampaikan cerita baik.',
  color: '#edf0f5',
  ink: '#10264d',
  members: ['Nama Anggota 1', 'Nama Anggota 2'],
  images: ['assets/humas-1.jpg', 'assets/humas-2.jpg']
}
```

`icon` harus memakai salah satu nama ikon pada objek `icons`: `code`, `book`, `heart`, `megaphone`, `ball`, `bag`, `people`, atau `grow`. Susun `images` sesuai urutan `members` supaya foto cocok dengan nama. Untuk menambah sie, tambahkan objek dengan format serupa ke array dan pisahkan tiap objek dengan koma.

## Dokumentasi dan informasi

Album dan pengumuman resmi dikelola di website, bukan dengan mengedit contoh di `app.js`:

- **Dokumentasi → Login admin → Tambah dokumentasi**: isi judul, kategori, tanggal, tautan folder Google Drive, dan thumbnail. Pastikan folder Drive dapat dibuka oleh pengunjung yang memiliki link.
- **Informasi → Login admin → Tambah informasi**: isi judul dan pengumuman; lampiran PDF/JPG/PNG/WebP maksimal 5 MB bersifat opsional.
- Admin dapat menghapus album atau informasi melalui halaman terkait.

Data resmi, thumbnail, dan lampiran tersimpan di Supabase. Array `sampleActivities` hanya contoh yang muncul bila belum ada album. Filter dokumentasi menggunakan array `categories` di `app.js`; jika menambahkan kategori, tambahkan nama yang sama ke array tersebut.

## Foto dan aset

Simpan foto/logo baru di `assets/`, lalu ubah path pada `index.html` atau `app.js`. Gunakan nama sederhana tanpa spasi, misalnya `ketua-ikm-2026.jpg`. Nama dan kapitalisasi file harus sama persis dengan path—GitHub Pages membedakan huruf besar dan kecil. JPG cocok untuk foto, PNG untuk logo transparan, dan SVG untuk ikon/ilustrasi vektor. Perbarui teks `alt` gambar.

## Warna, layout, dan animasi

Edit `styles.css`. Variabel tema ada di selector `:root` di baris awal, termasuk `--blue`, `--ink`, `--muted`, `--paper`, `--line`, dan `--lime`. `--blue` adalah warna utama, sedangkan `--lime` adalah aksen emas. Selector seperti `.hero`, `.header`, `.gallery`, `.person-card`, dan `footer` mengatur bagian tertentu. Aturan responsif untuk tablet/ponsel ada dalam blok `@media` di bagian bawah; pertahankan saat mengubah layout. Efek animasi berada di `motion.js` dan mengikuti preferensi reduced motion.

## Supabase dan admin

Di `supabase-config.js`, isi Project URL dan **publishable key** (atau `anon` key lama) dari Supabase → Project Settings → API. Keduanya memang digunakan secara publik di browser. **Jangan pernah menaruh `service_role`/secret key pada file frontend atau repository.**

Jalankan `supabase/schema.sql` di Supabase → SQL Editor. Buat akun admin di Authentication → Users, lalu beri hak admin pada satu atau beberapa email yang sudah dibuat:

```sql
insert into public.ikm_admins (user_id)
select id from auth.users
where email in ('admin1@example.org', 'admin2@example.org')
on conflict do nothing;
```

Matikan pendaftaran pengguna publik di pengaturan Auth. Hanya akun yang tercatat dalam `ikm_admins` boleh menambah/menghapus data. Jangan melonggarkan kebijakan RLS dalam `schema.sql` tanpa meninjau dampak keamanannya.

## Terbitkan lewat GitHub Pages

1. Pastikan `index.html`, `app.js`, `styles.css`, `motion.js`, `supabase-config.js`, dan seluruh folder `assets/` ikut masuk ke repository.
2. Commit dan push perubahan.
3. Di repository GitHub buka **Settings → Pages**, pilih branch dan folder sumber, lalu simpan.
4. Tunggu publikasi, kemudian buka URL Pages. Tambahkan URL situs ke daftar URL yang diizinkan pada pengaturan Supabase Auth.
5. Jika versi lama masih tampak, muat ulang paksa browser dengan Ctrl+F5 dan cek bahwa Pages memakai branch/folder yang benar.

Jika gambar hilang, periksa path, kapitalisasi, dan apakah file sudah di-commit. Jika data Supabase gagal dimuat, periksa `supabase-config.js`, jalankan skema SQL, dan baca pesan error yang tampil di situs.

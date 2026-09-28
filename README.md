# Website IKM

Website responsif dengan empat menu: Home, Struktur Organisasi (termasuk enam sie dengan daftar anggota masing-masing), Dokumentasi, serta Informasi. Palet biru tua, merah, putih, emas, dan hitam. Backend Node.js tanpa dependency runtime menyimpan album dan melayani login admin. Penyimpanan dan otentikasi dapat beralih ke **Supabase** (Auth + Database + Storage) cukup dengan mengonfigurasi variabel lingkungan; jika tidak dikonfigurasi, server kembali ke penyimpanan berkas JSON lokal di folder `data`.

## Backend: file lokal vs Supabase

Server memakai "store" plug-in (lihat `store.js`). Pilihannya ditentukan otomatis:

- **Supabase** — dipilih ketika `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` disediakan.
- **File lokal** — fallback default; menyimpan kredensial admin, album, dan informasi di folder `data` (sebagaimana sebelumnya).

## Menjalankan

Gunakan Node.js 20 atau lebih baru. Jalankan `npm start`, kemudian buka http://localhost:3000. Pada PowerShell yang membatasi skrip, gunakan `npm.cmd start`. Website harus dijalankan melalui server agar login dan penyimpanan dokumentasi berfungsi.

Jalankan `npm run check` untuk pemeriksaan sintaks dan `npm test` untuk pengujian autentikasi, proteksi endpoint, validasi unggahan, penyimpanan setelah restart, dan logout.

## Admin dokumentasi

1. Saat pertama dijalankan (mode **file lokal**), server membuat akun `admin` dengan password acak. Buka file lokal `data/initial-admin.txt` untuk melihat kredensial. File ini tidak tersedia melalui URL website dan folder `data` diabaikan Git. Simpan password dalam password manager; salinan awal ini boleh dihapus setelah disimpan. Pada mode **Supabase**, lewati langkah ini dan buat akun admin di Supabase (lihat [Migrasi ke Supabase](#migrasi-ke-supabase)).
2. Buka menu **Dokumentasi → Login admin**.
3. Pilih **Tambah dokumentasi**. Isi nama, kategori, tanggal, link folder Google Drive, dan unggah thumbnail JPG/PNG/WebP maksimal 3 MB. Pratinjau tampil sebelum disimpan.
4. Atur izin folder Google Drive agar pengunjung dengan link dapat melihat isinya. Website menyimpan tautan; website tidak mengubah izin atau mengunggah foto lengkap ke Drive.
5. Album langsung tampil di galeri dan cuplikan Home. Klik thumbnail untuk membuka detail dan tombol **Buka folder Google Drive**.
6. Untuk menghapus album dari website, buka detail album saat login lalu pilih **Hapus album**. Penghapusan tidak memengaruhi folder Google Drive.

Password diverifikasi dengan scrypt (mode file lokal) atau melalui Supabase Auth (mode Supabase). Sesi menggunakan cookie HttpOnly, SameSite=Strict, masa berlaku delapan jam, dan berakhir jika server direstart. Percobaan login dibatasi. Semua perubahan album memerlukan sesi admin dan permintaan dari origin website.

Album beserta thumbnail disimpan di `data/albums.json`, dan hash password di `data/admin.json` (mode **file lokal**). Penyimpanan tetap ada setelah browser atau server ditutup. Cadangkan folder `data` secara pribadi. Pada mode **Supabase**, album dan informasi disimpan di tabel database dan thumbnail/lampiran di bucket Storage; tidak ada berkas `data` yang diperlukan. Jika galeri belum memiliki album, contoh dokumentasi ditampilkan dan diberi label.

## Mengganti konten

- Data pengurus, anggota setiap sie, dan contoh kegiatan ada di `app.js`. Dokumentasi resmi ditambahkan melalui panel admin.
- Logo tipografi sementara ada di `index.html`. Avatar SVG ada di folder `assets`.
- Foto kegiatan adalah foto ilustrasi dari Unsplash, bukan dokumentasi resmi IKM. Ganti sumber foto dengan aset milik organisasi sebelum publikasi. Jika gambar gagal dimuat, ilustrasi SVG lokal otomatis ditampilkan.
- Google Fonts dan foto Unsplash memerlukan internet; font sistem dan gambar lokal menjadi fallback.
- Tombol sosial menampilkan pemberitahuan sampai kontak resmi tersedia. Ganti tombol di footer dengan tautan Instagram, TikTok, dan `mailto:` resmi, lalu hapus handler `data-social` jika tidak diperlukan.
- Warna dan breakpoint ada di `styles.css`. `motion.js` mengatur transisi halaman/popup, gerakan mengikuti pointer, ripple tombol, dan progres scroll. Kartu muncul berurutan saat scroll; dekorasi hero bergerak hanya saat terlihat. Preferensi reduced motion dihormati, termasuk bila diubah saat website terbuka. Efek pointer hanya aktif pada perangkat dengan mouse.

## Publikasi

Gunakan hosting Node.js dengan disk persisten, jalankan satu proses `node server.js`, dan simpan folder `data` pada volume persisten. Hosting statis saja tidak menjalankan login atau penyimpanan album. Navigasi menggunakan hash dan tidak memerlukan aturan rewrite.

Variabel lingkungan:

- `PORT`: port aplikasi (default `3000`).
- `HOST`: alamat bind (default `127.0.0.1`; gunakan `0.0.0.0` bila diperlukan hosting).
- `PUBLIC_ORIGIN`: alamat publik lengkap tanpa trailing slash, misalnya `https://ikm.example.org`. Gunakan HTTPS pada deployment; origin HTTPS mengaktifkan cookie Secure.
- `IKM_DATA_DIR`: lokasi penyimpanan persisten (default folder `data` pada proyek). Berlaku pada mode **file lokal**.
- `SUPABASE_URL`: URL project Supabase. Jika ini dan `SUPABASE_SERVICE_ROLE_KEY` ada, server memakai SupabaseStore.
- `SUPABASE_SERVICE_ROLE_KEY`: service_role key project Supabase (rahasia; jangan kirim ke browser).

### Migrasi ke Supabase

Untuk memakai Supabase sebagai backend login, dokumentasi (album), dan informasi:

1. Buat project Supabase, lalu buka **Project Settings → API**. Salin `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` (kunci ini bersifat rahasia — jalankan backend Anda pada server, jangan pernah kirim ke browser).
2. Salin `.env.example` ke `.env` dan isi kunci di atas.
3. Buat skema database: buka **SQL editor** dan jalankan berkas `supabase/schema.sql`. Skema membuat tabel `albums` dan `information` serta dua bucket penyimpanan (`thumbnails` publik, `attachments` privat).
4. Buat akun admin di **Authentication → Users → Add user**: gunakan alamat email (mis. `admin@ikm.local`) dan password kuat. Email ini dipakai sebagai "Username" pada formulir login.
5. Jalankan `node server.js`. Server kini memverifikasi kredensial melalui Supabase Auth; sesi tetap dikelola server lewat cookie HttpOnly, SameSite=Strict (8 jam, berakhir saat restart).
6. Login admin, lalu tambahkan dokumentasi/informasi seperti biasa. Thumbnail otomatis diunggah ke bucket `thumbnails` (publik), lampiran ke bucket `attachments` (ditunggu kembali melalui `/api/information/:id/attachment`).

> Tanpa variabel `SUPABASE_*`-nya, server memakai FileStore (berkas JSON) dan perilaku serta tes tetap seperti semula. `npm test` menjalankan pengujian untuk kedua store (FileStore via integrasi HTTP, dan `SupabaseStore` via klien palsu).

Implementasi ini sebelumnya menggunakan file JSON untuk organisasi berskala kecil dan satu proses server. Untuk beberapa instance server atau koleksi album besar, gunakan database dan object storage bersama (Supabase justru menyediakannya).

## Informasi dan pengumuman

Buka **Informasi → Login admin** dengan akun admin yang sama, lalu pilih **Tambah informasi**. Isi judul dan isi pengumuman; lampiran PDF, JPG, PNG, atau WebP bersifat opsional (maksimal 5 MB). Klik **Terbitkan informasi** untuk menampilkannya kepada semua pengunjung. Lampiran dapat diunduh tanpa login. Admin dapat menghapus informasi beserta lampirannya setelah konfirmasi.

Informasi dan lampiran tersimpan dalam `data/information.json` (mode **file lokal**) dan tetap ada setelah server dimulai ulang. Pada mode **Supabase**, informasi disimpan di tabel `information` dan lampiran di bucket Storage privat, ditunggu kembali melalui endpoint `/api/information/:id/attachment`. Sertakan file `data` dalam cadangan bila memakai mode file lokal.

// Seluruh pengurus menggunakan nama dan foto yang diberikan; contoh kegiatan masih berupa placeholder.
const icons = {
  code: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"/>',
  book: '<path d="M12 6c-3-3-7-3-10-2v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 2Zm0 0v15"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  megaphone: '<path d="m3 10 16-6v16L3 14v-4Zm5 6 1 5h4l-2-4M22 9v6"/>',
  ball: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-7 5-7 13 0 18m0-18c7 5 7 13 0 18"/>',
  bag: '<rect x="4" y="7" width="16" height="14" rx="3"/><path d="M8 9V6a4 4 0 0 1 8 0v3m-4 4v4m-2-2h4"/>',
  people: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m2-17a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v3"/>',
  grow: '<path d="M12 22V12m0 4C3 16 2 12 2 6c7 0 10 3 10 10Zm0-4C12 5 16 2 22 2c0 7-3 10-10 10Z"/>'
};
const icon = name => `<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.people}</svg></span>`;
const portrait = i => `assets/person-${i % 4}.svg`;
const divisions = [
  { name: 'IT', icon: 'code', description: 'Menghubungkan ide dan teknologi untuk IKM yang lebih inovatif.', color: '#edf0f5', ink: '#10264d', members: ['M. Fariz Dikri Robby Izzati', 'Sevena Gabriela Putri Yohanis', 'Susilo Aji Husodo', 'Natalia Wahyu Permatasari'], images: ['assets/it-fariz.png', 'assets/it-sevena.png', 'assets/it-susilo.png', 'assets/it-natalia.png'] },
  { name: 'Pendidikan', icon: 'book', description: 'Membuka ruang belajar, berbagi ilmu, dan berkembang bersama.', color: '#faf3e4', ink: '#937027', members: ['Nazwa Putri Maharani', 'Cindy Christina Putri', 'Hanna Edinnia'], images: ['assets/pendidikan-nazwa.png', 'assets/pendidikan-cindy.png', 'assets/pendidikan-hanna.png'] },
  { name: 'Rohani', icon: 'heart', description: 'Merawat nilai spiritual dan kebersamaan dalam setiap langkah.', color: '#fbebed', ink: '#bd263a', members: ['Julia Ripka Permata Sari', 'Meilan', 'Seravie Juditha Ribowo', 'Nathanael Chrisna Joda'], images: ['assets/rohani-julia.png', 'assets/rohani-meilan.png', 'assets/rohani-seravie.png', 'assets/rohani-nathanael.png'] },
  { name: 'Humas', icon: 'megaphone', description: 'Membangun relasi dan menyampaikan cerita baik dari keluarga IKM.', color: '#edf0f5', ink: '#10264d', members: ['Racheal Victoria Ida Susanto', 'Beatrix Angela Amahorseja'], images: ['assets/humas-racheal.png', 'assets/humas-beatrix.png'] },
  { name: 'Orkes', icon: 'ball', description: 'Mewadahi semangat olahraga, kreativitas, dan ekspresi seni.', color: '#fbebed', ink: '#bd263a', members: ['Enrique Yusan Andrianto', 'Adrianta Pradita Sitepu', 'Firmansyah Ananda Putra'], images: ['assets/orkes-enrique.png', 'assets/orkes-adrianta.png', 'assets/orkes-firmansyah.png'] },
  { name: 'Danus', icon: 'bag', description: 'Mengembangkan jiwa wirausaha untuk mendukung kegiatan IKM.', color: '#faf3e4', ink: '#937027', members: ['Marcia Christiandra Yunarto', 'Lailatul Mukharomah'], images: ['assets/danus-marcia.png', 'assets/danus-lailatul.png'] }
];
const sampleActivities = [
  { title: 'Langkah pertama, cerita bersama', category: 'PKKMB', date: '2026-08-24', image: 'photo-1523580494863-6f3031224c94', position: 'center' },
  { title: 'Satu meja, banyak gagasan', category: 'Rapat Kerja', date: '2026-08-15', image: 'photo-1522071820081-009f0129c71c', position: 'center' },
  { title: 'Berbagi ilmu, membuka peluang', category: 'Seminar', date: '2026-07-28', image: 'photo-1517486808906-6ca8b3f04846', position: 'center' },
  { title: 'Merayakan perjalanan keluarga IKM', category: 'Dies Natalis', date: '2026-07-18', image: 'photo-1511632765486-a01980e01a18', position: 'center' },
  { title: 'Bertumbuh dalam iman dan kasih', category: 'Kegiatan Rohani', date: '2026-07-10', image: 'photo-1511895426328-dc8714191300', position: 'center' },
  { title: 'Semangat sportif, prestasi bersama', category: 'Perlombaan', date: '2026-06-21', image: 'photo-1546519638-68e109498ffc', position: 'center' },
  { title: 'Aksi kecil untuk senyum yang besar', category: 'Kegiatan Sosial', date: '2026-06-14', image: 'photo-1559027615-cd4628902d4a', position: 'center' },
  { title: 'Kenal lebih dekat, jadi lebih hangat', category: 'Kegiatan Internal IKM', date: '2026-06-07', image: 'photo-1529156069898-49953e39b3ac', position: 'center' }
];
const categories = ['PKKMB','Dies Natalis','Seminar','Rapat Kerja','Kegiatan Rohani','Perlombaan','Kegiatan Sosial','Kegiatan Internal IKM'];
let activities = sampleActivities;
let authenticated = false;
let catalogError = '';
let informationItems = [];
let informationError = '';
let informationLoaded = false;
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateLabel = date => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
const photo = (id, width = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
const imageTag = (url, alt, extra = '') => `<img src="${escapeHTML(url)}" alt="${escapeHTML(alt)}" loading="lazy" ${extra}>`;
const galleryCard = (a) => `<button class="gallery-card reveal" data-photo="${activities.indexOf(a)}" aria-label="Lihat dokumentasi ${escapeHTML(a.title)}"><div class="gallery-image">${imageTag(a.thumbnail || photo(a.image), a.id ? `Thumbnail ${a.title}` : `Foto ilustrasi ${a.category}`)}<span class="category">${escapeHTML(a.category)}</span><span class="expand" aria-hidden="true">↗</span></div><h3>${escapeHTML(a.title)}</h3><time datetime="${a.date}">${dateLabel(a.date)}</time><span class="album-label">${a.id ? "Album Google Drive ↗" : "Contoh dokumentasi"}</span></button>`;
const pageHead = (eyebrow, title, description, placeholder = true) => `<section class="page-head"><div class="container"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${description}</p>${placeholder ? '<span class="placeholder-note">Pratinjau konten contoh</span>' : ''}</div></section>`;
const person = (name, role, i, heading = 'h3', memberImage = '') => `<article class="person-card reveal${memberImage ? ' member-poster' : ''}"><div class="person-image">${imageTag(memberImage || portrait(i), memberImage ? `Foto ${name}, ${role}` : `Avatar placeholder ${name}`)}</div><div class="person-info"><${heading}>${escapeHTML(name)}</${heading}><p>${escapeHTML(role)}</p></div></article>`;
function home() {
  return `<section class="hero"><div class="container hero-grid"><div class="hero-copy"><div class="eyebrow">Satu ikatan. Sejuta kemungkinan.</div><h1>Bukan sekadar<br>organisasi.<br>Ini <em>rumah kita.</em></h1><p class="hero-description"><strong>IKM – Ikatan Keluarga Mahasiswa</strong><br>Ruang untuk bertemu, bertumbuh, dan berdampak.<br>Bersama, kita buat masa kuliah lebih bermakna.</p><div class="actions"><a class="btn" href="#struktur">Lihat Struktur Organisasi <span>↗</span></a><a class="btn secondary" href="#dokumentasi">Dokumentasi Kegiatan <span>↗</span></a></div><div class="hero-community"><div class="avatars">${[0,1,2,3].map(i => imageTag(portrait(i), '')).join('')}</div><p><strong>Beragam cerita. Satu keluarga.</strong><br>Temukan tempatmu di IKM.</p></div></div><div class="hero-art"><span class="spark" aria-hidden="true">✳</span><div class="hero-photo"><img src="assets/pelantikan-ikm-2026.jpg" alt="Foto bersama pelantikan pengurus IKM periode 2026?2027" width="1280" height="720" fetchpriority="high"></div><span class="photo-label">MOMEN KECIL, KENANGAN BESAR.</span><div class="floating-note">Good people.<br>Great memories. ✦</div><div class="floating-card"><div class="icon">${icon('people')}</div><div><strong>Bersama jadi lebih berarti.</strong><span>Saling mendukung, saling menginspirasi.</span></div></div><span class="orbit" aria-hidden="true">✺</span></div></div></section>
  <section class="facts" aria-label="Semangat IKM"><div class="container facts-grid"><div class="fact"><strong>01</strong><span>Ikatan yang menyatukan</span></div><div class="fact"><strong>06</strong><span>Sie, banyak ruang berkarya</span></div><div class="fact"><strong>∞</strong><span>Cerita dan kemungkinan</span></div></div></section>
  <section class="section"><div class="container about-grid"><div class="about-heading reveal"><div class="eyebrow">Kenalan dengan IKM</div><h2>Tempat ide bertemu.<br>Tempat kita bertumbuh.</h2><p>IKM adalah keluarga bagi mahasiswa untuk saling terhubung, mengembangkan potensi, dan menghadirkan kontribusi nyata. Kami percaya, hal baik selalu dimulai dari kebersamaan.</p></div><div class="values"><article class="value reveal">${icon('people')}<h3>Dekat sebagai keluarga</h3><p>Membangun lingkungan yang hangat, terbuka, dan saling mendukung.</p></article><article class="value reveal">${icon('grow')}<h3>Tumbuh bersama</h3><p>Belajar, berkolaborasi, dan memberi dampak lewat pengalaman nyata.</p></article></div></div></section>
  <section class="section"><div class="container"><div class="section-heading reveal"><div><div class="eyebrow">Cerita dalam lensa</div><h2>Momen yang menyatukan.</h2><p class="section-intro">Sedikit cuplikan dari banyak cerita yang kita buat bersama.</p></div><a class="text-link" href="#dokumentasi">Semua dokumentasi <span>↗</span></a></div><div class="gallery home-gallery">${activities.slice(0,3).map(galleryCard).join('')}</div><p class="gallery-count" style="margin-top:20px;margin-bottom:0">${activities.some(a => a.id) ? "Buka album untuk melihat dokumentasi lengkap di Google Drive." : "Foto ilustrasi dan data kegiatan contoh."}</p></div></section>
  <section class="cta"><div class="container"><div class="cta-box reveal"><div><h2>Setiap cerita dimulai dari kita.</h2><p>Kenali orang-orang di balik langkah dan semangat IKM.</p></div><a class="btn" href="#struktur">Kenali keluarga IKM <span>↗</span></a></div></div></section>`;
}
function divisionGroup(d, i) {
  return `<section class="division-group" aria-labelledby="division-${i}" style="--icon-bg:${d.color};--icon-color:${d.ink}"><div class="division-heading reveal"><div class="sie-icon">${icon(d.icon)}</div><div><h3 id="division-${i}">Sie ${d.name}</h3><p>${d.description}</p></div><span class="division-count">${d.members.length} anggota</span></div><div class="division-members">${d.members.map((name, index) => person(name, `Anggota Sie ${d.name}`, index, 'h4', d.images?.[index])).join('')}</div></section>`;
}
function structure() {
  return `${pageHead('Orang-orang di balik IKM', 'Satu tim. Satu semangat.', 'Kenali pengurus yang menyatukan ide dan menggerakkan langkah keluarga IKM.', false)}<section class="section"><div class="container org-content"><div class="people-row">${person('Sendy Firza N. T, S.ST.,M.Tr.Keb','Kepala Bagian Kemahasiswaan',0,'h3','assets/kemahasiswaan-sendy-firza.jpeg')}</div><div class="org-line"></div><div class="people-row">${person('Nur Rahmad Hidayattulloh','Ketua IKM',0,'h3','assets/ketua-nur-rahmad.png')}</div><div class="org-line"></div><div class="people-row">${person('Dheyl Lady Clara Tombarigi','Wakil Ketua IKM',1,'h3','assets/wakil-dheyl-lady.png')}</div><div class="org-line"></div><div class="people-row">${person('Meryana Urbanus','Sekretaris',3,'h3','assets/sekretaris-meryana.png')}${person('Esa Rahmat Putri','Sekretaris',0,'h3','assets/sekretaris-esa.png')}</div><div class="people-row">${person('Eunike Beatriz Inggrid','Bendahara',2,'h3','assets/bendahara-eunike.png')}${person('Grayvhany Zhyeriel Chrizhara Banu','Bendahara',3,'h3','assets/bendahara-grayvhany.png')}</div></div></section><section class="section tinted"><div class="container"><div class="section-heading"><div><div class="eyebrow">Sie dalam keluarga IKM</div><h2>Beda peran, satu tujuan.</h2><p class="section-intro">Enam sie dengan anggota yang berkarya bersama.</p></div></div><div class="division-groups">${divisions.map(divisionGroup).join('')}</div></div></section>`;
}
let currentFilter = 'Semua';
function documentation() {
  return `${pageHead('Dokumentasi kegiatan', 'Banyak momen. Satu keluarga.', 'Temukan cerita kegiatan IKM. Buka album untuk melihat foto lengkap di Google Drive.', false)}<section class="section"><div class="container"><div class="documentation-toolbar"><div><h2>Album kegiatan</h2><p>Kenangan bersama, tersimpan dalam satu tempat.</p></div><div class="actions">${authenticated ? '<button class="btn" data-add-album>+ Tambah dokumentasi</button><button class="btn secondary" data-logout>Logout</button>' : '<button class="btn secondary" data-login>Login admin ↗</button>'}</div></div><div id="catalog-message">${catalogError ? '<p class="form-error" role="alert">Dokumentasi belum dapat dimuat. <button class="inline-button" data-retry>Coba lagi</button></p>' : ''}</div><div class="filters" role="group" aria-label="Filter kategori kegiatan">${['Semua', ...categories].map(c => `<button class="filter ${c === currentFilter ? 'active' : ''}" data-filter="${c}" aria-pressed="${c === currentFilter}">${c}</button>`).join('')}</div><p class="gallery-count" id="gallery-count" aria-live="polite"></p><div class="gallery" id="activity-gallery"></div></div></section>`;
}
function informationPage() {
  return `${pageHead('Kabar dari keluarga IKM', 'Informasi & pengumuman.', 'Ikuti kabar terbaru, pengumuman, dan informasi resmi dari pengurus IKM.', false)}<section class="section"><div class="container"><div class="documentation-toolbar"><div><h2>Informasi terbaru</h2><p>Semua kabar penting dalam satu tempat.</p></div><div class="actions">${authenticated ? '<button class="btn" data-add-information>+ Tambah informasi</button><button class="btn secondary" data-logout>Logout</button>' : '<button class="btn secondary" data-login>Login admin ↗</button>'}</div></div>${informationError ? '<p class="form-error" role="alert">Informasi belum dapat dimuat. <button class="inline-button" data-retry-information>Coba lagi</button></p>' : ''}<div class="information-list">${informationItems.map(item => `<article class="information-card reveal"><time datetime="${escapeHTML(item.createdAt)}">${dateLabel(item.createdAt.slice(0,10))}</time><h2>${escapeHTML(item.title)}</h2><p class="information-content">${escapeHTML(item.content)}</p><div class="album-actions">${item.attachment ? `<a class="btn secondary" href="${escapeHTML(item.attachment.url)}" download>Unduh ${escapeHTML(item.attachment.name)} (${(item.attachment.size / 1024 / 1024).toFixed(2)} MB)</a>` : ''}${authenticated ? `<button class="delete-button" data-delete-information="${item.id}">Hapus informasi</button>` : ''}</div></article>`).join('') || (informationLoaded && !informationError ? '<p class="empty-state">Belum ada informasi yang diterbitkan.</p>' : '')}</div></div></section>`;
}
async function loadInformation() {
  try { const result = await api('/api/information'); informationItems = result.information; informationLoaded = true; informationError = ''; }
  catch (error) { informationError = error.message; }
}
function informationModal() {
  showModal(`<div class="admin-modal"><div class="eyebrow">Kabar baru</div><h2 id="modal-title">Tambah informasi</h2><p>Informasi yang diterbitkan dapat dibaca semua pengunjung.</p><form id="information-form"><label>Judul informasi<input name="title" required maxlength="120" placeholder="Contoh: Pendaftaran anggota baru"></label><label>Isi informasi<textarea name="content" required maxlength="10000" rows="7" placeholder="Tulis pengumuman lengkap di sini"></textarea></label><label class="upload-field">Lampiran (opsional)<input type="file" name="attachment" accept="application/pdf,image/jpeg,image/png,image/webp" aria-describedby="attachment-help"><span id="attachment-help">PDF, JPG, PNG, atau WebP · Maksimal 5 MB</span></label><p class="form-error" role="alert"></p><button class="btn" type="submit">Terbitkan informasi</button></form></div>`);
  const form = document.querySelector('#information-form');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const error = form.querySelector('[role=alert]'); const button = form.querySelector('[type=submit]');
    error.textContent = ''; button.disabled = true; button.textContent = 'Mengunggah…';
    try {
      const values = new FormData(form); const file = form.elements.attachment.files[0]; let attachment = null;
      if (file) {
        if (!['application/pdf','image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024 || !file.size) throw new Error('Pilih PDF, JPG, PNG, atau WebP maksimal 5 MB yang tidak kosong.');
        const data = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('Lampiran tidak dapat dibaca.')); reader.readAsDataURL(file); });
        attachment = { name:file.name, data };
      }
      const result = await api('/api/information', { method:'POST', body:JSON.stringify({ title:values.get('title'), content:values.get('content'), attachment }) });
      informationItems = [result.information, ...informationItems]; informationLoaded = true; informationError = ''; render(); notifyUser('Informasi berhasil diterbitkan.');
    } catch (err) { error.textContent = err.message; if (!authenticated) error.insertAdjacentHTML('beforeend', ' <button type="button" class="inline-button" data-login>Login kembali</button>'); }
    finally { button.disabled = false; button.textContent = 'Terbitkan informasi'; }
  });
}
document.addEventListener('click', async event => {
  if (event.target.closest('[data-add-information]')) informationModal();
  const retry = event.target.closest('[data-retry-information]');
  if (retry) { retry.disabled = true; await loadInformation(); render(); }
  const remove = event.target.closest('[data-delete-information]');
  if (remove) {
    const item = informationItems.find(item => item.id === remove.dataset.deleteInformation);
    if (!item) return;
    showModal(`<div class="admin-modal"><h2 id="modal-title">Hapus informasi?</h2><p>Informasi <strong>${escapeHTML(item.title)}</strong> beserta lampirannya akan dihapus dari website.</p><p class="form-error" role="alert" id="information-delete-error"></p><div class="actions"><button class="btn danger" id="confirm-information-delete">Hapus informasi</button><button class="btn secondary" id="cancel-information-delete">Batal</button></div></div>`);
    document.querySelector('#cancel-information-delete').onclick = closeModal;
    document.querySelector('#confirm-information-delete').onclick = async e => {
      e.target.disabled = true;
      try { await api('/api/information/' + item.id, { method:'DELETE' }); informationItems = informationItems.filter(value => value.id !== item.id); render(); notifyUser('Informasi berhasil dihapus.'); }
      catch (error) { document.querySelector('#information-delete-error').textContent = error.message; e.target.disabled = false; }
    };
  }
});
const main = document.querySelector('main');
const modal = document.querySelector('#modal');
let observer;
function observe() {
  window.IKMMotion?.prepare(main);
  observer?.disconnect();
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('visible')); return; }
  observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: 0.08 });
  items.forEach(el => observer.observe(el));
}
function renderGallery() {
  const filtered = currentFilter === 'Semua' ? activities : activities.filter(a => a.category === currentFilter);
  document.querySelector('#activity-gallery').innerHTML = filtered.map(galleryCard).join('') || '<p class="empty-state">Belum ada album dalam kategori ini.</p>'; 
  document.querySelector('#gallery-count').textContent = `${filtered.length} momen${currentFilter !== 'Semua' ? ` · ${currentFilter}` : ' kebersamaan'}`;
  document.querySelectorAll('[data-filter]').forEach(b => { const active = b.dataset.filter === currentFilter; b.classList.toggle('active', active); b.setAttribute('aria-pressed', active); });
  observe();
}
function closeMenu() { document.querySelector('nav').classList.remove('open'); const button = document.querySelector('.menu-toggle'); button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-label','Buka menu'); }
function render(moveFocus = false) {
  let route = location.hash.slice(1) || 'home';
  if (route === 'main') { main.focus(); return; }
  if (route === 'sie') { location.replace('#struktur'); return; }
  if (!['home','struktur','dokumentasi','informasi'].includes(route)) route = 'home';
  if (modal.open) modal.close();
  main.innerHTML = ({ home, struktur: structure, dokumentasi: documentation, informasi: informationPage })[route]();
  document.querySelectorAll('[data-route]').forEach(link => { const active = link.dataset.route === route; link.classList.toggle('active', active); if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); });
  document.title = `${({home:'Home',struktur:'Struktur Organisasi',dokumentasi:'Dokumentasi',informasi:'Informasi'})[route]} — IKM Ikatan Keluarga Mahasiswa`;
  closeMenu();
  if (route === 'dokumentasi') renderGallery(); else observe();
  if (moveFocus) { window.scrollTo({top:0,behavior:'instant'}); main.focus({preventScroll:true}); }
  window.IKMMotion?.enterPage(main);
}
function showModal(content) {
  document.querySelector('#modal-content').innerHTML = content;
  modal.showModal();
  document.body.style.overflow = 'hidden';
  window.IKMMotion?.openDialog(modal);
}
function closeModal() { if (window.IKMMotion) window.IKMMotion.closeDialog(modal); else modal.close(); }
modal.addEventListener('cancel', event => { event.preventDefault(); closeModal(); });
modal.addEventListener('close', () => { if (!modal.open) document.body.style.overflow = ''; });
document.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) { const r = modal.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeModal(); } });
let toastTimer;
document.addEventListener('click', e => {
  const activity = e.target.closest('[data-photo]');
  const filter = e.target.closest('[data-filter]');
  const social = e.target.closest('[data-social]');
  if (activity) {
    const a = activities[Number(activity.dataset.photo)];
    showModal(`${imageTag(a.thumbnail || photo(a.image,1600), a.id ? a.title : 'Foto ilustrasi ' + a.category, 'class="modal-photo"')}<div class="modal-caption"><div class="eyebrow">${escapeHTML(a.category)}</div><h2 id="modal-title">${escapeHTML(a.title)}</h2><p>${dateLabel(a.date)}${a.id ? '' : ' · Foto ilustrasi dan data kegiatan contoh'}</p>${a.driveUrl ? `<div class="album-actions"><a class="btn" href="${escapeHTML(a.driveUrl)}" target="_blank" rel="noopener noreferrer">Buka folder Google Drive ↗</a>${authenticated ? `<button class="delete-button" data-delete-album="${a.id}">Hapus album</button>` : ''}</div>` : ''}</div>`);
  }
  if (filter) { currentFilter = filter.dataset.filter; renderGallery(); }
  if (social) { const toast = document.querySelector('#toast'); toast.textContent = `${social.dataset.social} resmi IKM belum ditambahkan.`; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 3500); }
});
// Jika foto eksternal tidak tersedia, tampilkan ilustrasi lokal.
document.addEventListener('error', e => { if (e.target.tagName === 'IMG' && !e.target.src.endsWith('/assets/activity-placeholder.svg')) e.target.src = 'assets/activity-placeholder.svg'; }, true);
document.querySelector('.menu-toggle').addEventListener('click', () => { const nav = document.querySelector('nav'); const open = nav.classList.toggle('open'); const button = document.querySelector('.menu-toggle'); button.setAttribute('aria-expanded',open); button.setAttribute('aria-label',open ? 'Tutup menu' : 'Buka menu'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); if (e.target.closest('nav a')) closeMenu(); });
window.addEventListener('hashchange', () => render(true));
document.querySelector('#year').textContent = new Date().getFullYear();
initialize();

async function api(url, options = {}) {
  let response;
  try { response = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', 'X-IKM-Request': '1' }, signal: AbortSignal.timeout(15000) }); }
  catch { throw new Error('Server tidak dapat dihubungi. Pastikan website dijalankan melalui server, lalu coba lagi.'); }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { if (response.status === 401) authenticated = false; throw new Error(data.error || 'Permintaan gagal. Silakan coba lagi.'); }
  return data;
}
async function loadAlbums() {
  try { const result = await api('/api/albums'); activities = result.albums.length ? result.albums : sampleActivities; catalogError = ''; }
  catch (error) { catalogError = error.message; }
}
async function initialize() {
  main.innerHTML = '<div class="container section"><p role="status">Memuat cerita IKM…</p></div>';
  await Promise.all([loadAlbums(), loadInformation(), api('/api/session').then(session => { authenticated = session.authenticated; }).catch(() => {})]);
  render();
}
function notifyUser(message) {
  const toast = document.querySelector('#toast'); toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 4500);
}
function loginModal() {
  showModal(`<div class="admin-modal"><div class="eyebrow">Ruang pengelola</div><h2 id="modal-title">Login admin</h2><p>Masuk untuk mengelola dokumentasi dan informasi IKM.</p><form id="login-form"><label>Username<input name="username" autocomplete="username" required maxlength="80" placeholder="Username admin"></label><label>Password<input name="password" type="password" autocomplete="current-password" required maxlength="256" placeholder="Masukkan password"></label><p class="form-error" role="alert" id="login-error"></p><button class="btn" type="submit">Masuk sebagai admin ↗</button></form></div>`);
  document.querySelector('#login-form').addEventListener('submit', async e => {
    e.preventDefault(); const form = e.currentTarget; const button = form.querySelector('[type=submit]'); const error = form.querySelector('[role=alert]');
    button.disabled = true; button.textContent = 'Memeriksa…'; error.textContent = '';
    try { await api('/api/login', { method:'POST', body:JSON.stringify(Object.fromEntries(new FormData(form))) }); authenticated = true; render(); notifyUser('Berhasil login. Konten siap dikelola.'); }
    catch (err) { error.textContent = err.message; }
    finally { button.disabled = false; button.textContent = 'Masuk sebagai admin ↗'; }
  });
}
function albumModal() {
  showModal(`<div class="admin-modal"><div class="eyebrow">Cerita baru</div><h2 id="modal-title">Tambah dokumentasi</h2><p>Satu thumbnail untuk satu album kegiatan.</p><form id="album-form"><label>Nama kegiatan<input name="title" required maxlength="120" placeholder="Contoh: PKKMB IKM 2026"></label><div class="form-row"><label>Kategori<select name="category" required>${categories.map(c => `<option>${c}</option>`).join('')}</select></label><label>Tanggal kegiatan<input type="date" name="date" required></label></div><label>Link folder Google Drive<input type="url" name="driveUrl" required placeholder="https://drive.google.com/drive/folders/…" aria-describedby="drive-help"></label><p class="form-help" id="drive-help">Pastikan akses folder diatur agar pengunjung yang memiliki link dapat melihat foto.</p><label class="upload-field">Thumbnail kegiatan<input type="file" name="thumbnail" accept="image/jpeg,image/png,image/webp" required aria-describedby="thumbnail-help"><span id="thumbnail-help">JPG, PNG, atau WebP · Maksimal 3 MB</span><img id="thumbnail-preview" alt="Pratinjau thumbnail kegiatan" hidden></label><p class="form-error" role="alert" id="album-error"></p><button class="btn" type="submit">Simpan dokumentasi ↗</button></form></div>`);
  const form = document.querySelector('#album-form'); const error = form.querySelector('[role=alert]'); const input = form.elements.thumbnail; const preview = document.querySelector('#thumbnail-preview');
  let thumbnail = ''; let reading = false; let version = 0;
  input.addEventListener('change', async () => {
    const attempt = ++version; thumbnail = ''; preview.hidden = true; preview.removeAttribute('src'); error.textContent = ''; input.setCustomValidity('');
    const file = input.files[0]; if (!file) { reading = false; return; }
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 3 * 1024 * 1024) { input.setCustomValidity('Pilih gambar JPG, PNG, atau WebP maksimal 3 MB.'); error.textContent = input.validationMessage; return; }
    reading = true;
    try {
      const data = await new Promise((resolve,reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); });
      const image = new Image(); image.src = data; await image.decode();
      if (attempt === version) { thumbnail = data; preview.src = data; preview.hidden = false; }
    } catch { if (attempt === version) { error.textContent = 'Gambar tidak dapat dibaca. Pilih file gambar lain.'; input.setCustomValidity(error.textContent); } }
    finally { if (attempt === version) reading = false; }
  });
  form.addEventListener('submit', async e => {
    e.preventDefault(); error.textContent = '';
    if (reading || !thumbnail) { error.textContent = 'Tunggu thumbnail selesai dimuat atau pilih gambar yang valid.'; return; }
    const button = form.querySelector('[type=submit]'); button.disabled = true; button.textContent = 'Menyimpan…';
    try {
      const values = Object.fromEntries(new FormData(form)); values.thumbnail = thumbnail;
      const result = await api('/api/albums', { method:'POST', body:JSON.stringify(values) });
      activities = [result.album, ...activities.filter(a => a.id)]; catalogError = ''; currentFilter = 'Semua'; render(); notifyUser('Dokumentasi berhasil ditambahkan.');
    } catch (err) { error.textContent = err.message; if (!authenticated) error.insertAdjacentHTML('beforeend', ' <button type="button" class="inline-button" data-login>Login kembali</button>'); }
    finally { button.disabled = false; button.textContent = 'Simpan dokumentasi ↗'; }
  });
}
document.addEventListener('click', async e => {
  if (e.target.closest('[data-login]')) { if (modal.open) modal.close(); loginModal(); }
  if (e.target.closest('[data-add-album]')) albumModal();
  const logout = e.target.closest('[data-logout]');
  if (logout) {
    logout.disabled = true;
    try { await api('/api/logout', { method:'POST' }); authenticated = false; render(); notifyUser('Anda sudah logout.'); }
    catch (error) { notifyUser(error.message); logout.disabled = false; }
  }
  const retry = e.target.closest('[data-retry]');
  if (retry) { retry.disabled = true; await loadAlbums(); render(); }
  const remove = e.target.closest('[data-delete-album]');
  if (remove) {
    const album = activities.find(a => a.id === remove.dataset.deleteAlbum);
    if (!album) return;
    modal.close();
    showModal(`<div class="admin-modal"><div class="eyebrow">Kelola dokumentasi</div><h2 id="modal-title">Hapus album?</h2><p>Album <strong>${escapeHTML(album.title)}</strong> akan dihapus dari website. Folder dan foto di Google Drive tetap tersimpan.</p><p class="form-error" role="alert" id="delete-error"></p><div class="actions"><button class="btn danger" id="confirm-delete">Hapus dari website</button><button class="btn secondary" id="cancel-delete">Batal</button></div></div>`);
    document.querySelector('#cancel-delete').onclick = closeModal;
    document.querySelector('#confirm-delete').onclick = async event => {
      event.target.disabled = true;
      try { await api('/api/albums/' + album.id, { method:'DELETE' }); activities = activities.filter(a => a.id !== album.id); if (!activities.length) activities = sampleActivities; render(); notifyUser('Album dihapus dari website.'); }
      catch (error) { document.querySelector('#delete-error').textContent = error.message; event.target.disabled = false; }
    };
  }
});

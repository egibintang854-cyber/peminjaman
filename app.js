'use strict';

const katalog = [
  { id: '1', nama: 'Proyektor', kategori: 'Elektronik', stok: 4 },
  { id: '2', nama: 'Laptop', kategori: 'Elektronik', stok: 8 },
  { id: '3', nama: 'Kamera', kategori: 'Elektronik', stok: 3 },
  { id: '4', nama: 'Tripod', kategori: 'Alat', stok: 6 }
];
const kunci = 'pinjam-demo-v1';
let pinjaman = [];
const elemen = id => document.getElementById(id);

function pesan(teks) {
  elemen('pesan').textContent = teks;
  elemen('pesan').hidden = false;
}

function tersedia(id) {
  const alat = katalog.find(item => item.id === id);
  return alat.stok - pinjaman.filter(item => item.alat === id && !item.kembali)
    .reduce((total, item) => total + item.jumlah, 0);
}

try {
  const data = JSON.parse(localStorage.getItem(kunci) || '[]');
  if (!Array.isArray(data) || !data.every(item => item &&
    katalog.some(alat => alat.id === item.alat) && typeof item.nama === 'string' &&
    item.nama.length <= 80 && Number.isInteger(item.jumlah) && item.jumlah > 0 &&
    typeof item.tanggal === 'string' && typeof item.kembali === 'string')) {
    throw new Error('Data demo tidak valid');
  }
  pinjaman = data;
  if (katalog.some(alat => tersedia(alat.id) < 0)) throw new Error('Stok tidak valid');
} catch {
  pinjaman = [];
  pesan('Data tersimpan tidak tersedia. Demo dimulai dengan data kosong.');
}

function simpan() {
  try { localStorage.setItem(kunci, JSON.stringify(pinjaman)); }
  catch { pesan('Penyimpanan browser tidak tersedia. Perubahan hanya bertahan selama halaman ini terbuka.'); }
  tampil();
}

// Gunakan textContent agar nama yang diketik tidak diproses sebagai HTML.
function baris(target, nilai, tombol) {
  const tr = document.createElement('tr');
  nilai.forEach(teks => {
    const td = document.createElement('td');
    td.textContent = teks;
    tr.append(td);
  });
  if (tombol) tr.lastElementChild.append(tombol);
  target.append(tr);
}

function tampil() {
  ['data-alat', 'data-pinjam', 'data-laporan', 'pilih-alat'].forEach(id => elemen(id).replaceChildren());
  katalog.forEach(alat => {
    const stok = tersedia(alat.id);
    baris(elemen('data-alat'), [alat.nama, alat.kategori, stok]);
    const option = document.createElement('option');
    option.value = alat.id;
    option.textContent = `${alat.nama} (stok: ${stok})`;
    option.disabled = stok === 0;
    elemen('pilih-alat').append(option);
  });
  pinjaman.forEach((item, index) => {
    const alat = katalog.find(alat => alat.id === item.alat);
    const status = item.kembali ? 'Dikembalikan' : 'Dipinjam';
    let tombol;
    if (!item.kembali) {
      tombol = document.createElement('button');
      tombol.type = 'button';
      tombol.textContent = 'Kembalikan';
      tombol.addEventListener('click', () => {
        if (pinjaman[index].kembali) return;
        pinjaman[index].kembali = new Date().toLocaleDateString('id-ID');
        pesan('Alat berhasil dikembalikan.');
        simpan();
      });
    }
    baris(elemen('data-pinjam'), [item.nama, alat.nama, item.jumlah, status, ''], tombol);
    baris(elemen('data-laporan'), [item.nama, alat.nama, item.jumlah, item.tanggal, item.kembali || '—', status]);
  });
  if (!pinjaman.length) {
    for (const id of ['data-pinjam', 'data-laporan']) baris(elemen(id), ['Belum ada peminjaman contoh.']);
  }
  elemen('jumlah-alat').textContent = katalog.length;
  elemen('stok').textContent = katalog.reduce((total, alat) => total + tersedia(alat.id), 0);
  elemen('aktif').textContent = pinjaman.filter(item => !item.kembali).length;
}

elemen('form-pinjam').addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(event.target);
  const nama = String(form.get('nama') || '').trim();
  const alat = form.get('alat');
  const jumlah = Number(form.get('jumlah'));
  if (!nama || nama.length > 80 || !katalog.some(item => item.id === alat) ||
      !Number.isInteger(jumlah) || jumlah < 1 || jumlah > tersedia(alat)) {
    pesan('Isi nama contoh dan jumlah sesuai stok tersedia.');
    return;
  }
  pinjaman.push({ nama, alat, jumlah, tanggal: new Date().toLocaleDateString('id-ID'), kembali: '' });
  event.target.reset();
  pesan('Peminjaman contoh berhasil ditambahkan.');
  simpan();
});

function navigasi() {
  const tujuan = location.hash.slice(1);
  const aktif = ['dashboard', 'alat', 'peminjaman', 'laporan'].includes(tujuan) ? tujuan : 'dashboard';
  document.querySelectorAll('main section').forEach(section => { section.hidden = section.id !== aktif; });
  document.querySelectorAll('nav a').forEach(link => {
    if (link.hash === '#' + aktif) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

elemen('cetak').addEventListener('click', () => window.print());
elemen('reset').addEventListener('click', () => {
  if (!confirm('Hapus semua peminjaman contoh di browser ini?')) return;
  pinjaman = [];
  pesan('Data demo sudah direset.');
  simpan();
});
window.addEventListener('hashchange', navigasi);
tampil();
navigasi();

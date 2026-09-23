# Publikasi ke GitHub Pages

Folder ini adalah demo mandiri HTML/CSS/JavaScript. Aplikasi PHP asli tetap
berada di luar folder ini. Demo tidak memiliki autentikasi, database bersama,
atau persetujuan petugas. Gunakan hanya data contoh.

## Cara termudah tanpa Git

1. Buat repository publik baru di GitHub, misalnya `pinjam-demo`.
2. Pilih **Add file → Upload files**.
3. Unggah isi folder `docs`: `index.html`, `app.js`, `style.css`, dan `.nojekyll`
   ke bagian paling atas repository. Jangan unggah folder PHP atau database.
4. Simpan dengan **Commit changes**.
5. Buka **Settings → Pages**.
6. Pilih **Deploy from a branch**, branch **main**, folder **/(root)**, lalu **Save**.
7. Setelah deployment selesai, buka alamat yang ditampilkan di halaman Pages.
   Bentuk umumnya `https://NAMA-AKUN.github.io/pinjam-demo/`.

## Jika seluruh proyek diunggah memakai Git

Pertahankan `.gitignore` agar SQL dan konfigurasi koneksi lokal tidak ikut
diunggah. Pada Settings → Pages pilih branch `main` dan folder `/docs`.
GitHub hanya menerbitkan folder demo. Jangan memilih root untuk proyek PHP.

`.gitignore` tidak melindungi file yang diunggah manual atau sudah dilacak Git.
Periksa daftar file sebelum publikasi. Konfigurasi PHP lokal tidak diperlukan
untuk menjalankan demo ini.

Perubahan demo disimpan di localStorage browser. Reset data tersedia pada
menu Laporan. Data tidak dibagikan antarperangkat atau pengguna.

# Deskripsi Flow Project PolsriJasa

## 1. Gambaran Umum

PolsriJasa adalah marketplace jasa mahasiswa berbasis HTML, CSS, dan JavaScript vanilla. Project ini tidak menggunakan backend. Data user, jasa, kategori, dan sebagian informasi tampilan disimpan di `localStorage` browser.

File JavaScript utama adalah `main.js`. File tersebut digunakan oleh beberapa halaman dan menentukan perilaku halaman melalui atribut `data-page` pada elemen `<body>`.

Halaman utama yang terhubung dengan alur aplikasi:

- `login.html`: halaman login akun demo.
- `index.html`: beranda marketplace dan daftar jasa.
- `post-service.html`: form untuk menambahkan jasa.
- `detail.html`: detail satu jasa, ulasan, kontak WhatsApp, dan hapus jasa.

## 2. Titik Masuk Aplikasi

Saat DOM selesai dimuat, `main.js` membaca nilai `document.body.dataset.page`.

- Jika nilainya `login`, aplikasi menjalankan pemeriksaan login lalu `initializeLoginPage()`.
- Jika nilainya bukan `login`, aplikasi memeriksa apakah user sudah login melalui `redirectToLoginIfNeeded()`.
- Jika user belum login, halaman apa pun selain login diarahkan ke `login.html`.
- Jika user sudah login, `initializeAuthControls()` dijalankan untuk menampilkan identitas user dan mengaktifkan tombol keluar.
- Setelah itu, fungsi halaman dijalankan sesuai nilai `data-page`: `initializeHomePage()`, `initializeDetailPage()`, atau `initializeFormPage()`.

## 3. Alur Autentikasi

Login bersifat lokal dan hanya mendukung akun demo yang didefinisikan di `DEMO_ACCOUNT`.

Akun demo yang tersedia:

- Email: `demo@polsrijasa.com`
- Password: `demo123`

Urutan login:

1. Pengguna membuka `login.html`.
2. `initializeLoginPage()` mengisi email demo secara otomatis.
3. Pengguna mengirim form login.
4. `FormData` membaca email dan password, lalu nilainya dinormalisasi.
5. Jika kredensial salah, pesan error ditampilkan dan pengguna tetap berada di halaman login.
6. Jika kredensial benar, `saveCurrentUser()` menyimpan data user ke key `polsrijasa_auth`.
7. Pengguna diarahkan ke `index.html`.

Saat tombol `Keluar` digunakan:

1. `clearCurrentUser()` menghapus key `polsrijasa_auth`.
2. Browser diarahkan kembali ke `login.html`.

## 4. Alur Beranda dan Daftar Jasa

Beranda berada di `index.html` dan menggunakan `data-page="home"`.

Saat halaman dimuat:

1. `initializeHomePage()` mencari input pencarian dan container daftar jasa.
2. `readServices()` membaca `campus_services_data`.
3. Jika data belum ada, rusak, atau array kosong, `sampleServices` disimpan sebagai data awal.
4. `renderCategories()` membaca daftar kategori melalui `readCategories()`.
5. Jika kategori belum ada, `defaultCategories` disimpan ke `campus_service_categories`.
6. Tombol filter kategori dihubungkan melalui `bindCategoryFilters()`.
7. `initializeCategoryManager()` menyiapkan tambah dan hapus kategori.
8. `renderList()` menampilkan kartu jasa yang sesuai dengan filter.

Pencarian bekerja secara real-time. Setiap perubahan input memperbarui `pageState.query`, kemudian `renderList()` menyaring jasa berdasarkan gabungan judul, nama penyedia, dan deskripsi.

Filter kategori bekerja dengan memperbarui `pageState.category`. Nilai `semua` menampilkan semua jasa, sedangkan nilai kategori tertentu hanya menampilkan jasa dengan kategori yang sama.

Jika tidak ada jasa yang cocok, grid dikosongkan dan elemen pesan kosong ditampilkan.

## 5. Alur Kelola Kategori

Kategori disimpan pada key `campus_service_categories`.

### Menambah kategori

1. Pengguna memasukkan nama kategori.
2. `categoryValue()` mengubah nama tersebut menjadi value yang aman untuk identifier.
3. Jika value kosong atau sudah ada, aplikasi menampilkan peringatan.
4. Jika valid, kategori baru ditambahkan ke array.
5. `saveCategories()` menyimpan array ke `localStorage`.
6. Filter, daftar kategori, dan select kategori dirender ulang.

### Menghapus kategori

1. Pengguna menekan tombol hapus pada kategori.
2. Aplikasi memeriksa apakah ada jasa yang masih memakai kategori tersebut.
3. Jika masih digunakan, penghapusan dibatalkan dan peringatan ditampilkan.
4. Jika tidak digunakan, kategori dihapus dan daftar kategori disimpan ulang.
5. Minimal satu set `defaultCategories` dipertahankan agar pilihan kategori tidak kosong seluruhnya.

## 6. Alur Menambahkan Jasa

Halaman tambah jasa berada di `post-service.html` dan menggunakan `data-page="form"`.

1. `initializeFormPage()` menjalankan `renderCategories()` untuk mengisi pilihan kategori.
2. Pengguna mengisi judul, kategori, nama, nomor WhatsApp, harga, satuan, URL gambar, dan deskripsi.
3. Saat form dikirim, `FormData` membaca seluruh input.
4. Nomor WhatsApp dibersihkan dari karakter non-digit.
5. Aplikasi memeriksa field wajib.
6. Nomor WhatsApp harus cocok dengan pola `628` diikuti 8 sampai 12 digit.
7. Harga harus berupa angka lebih besar dari nol.
8. Jika validasi gagal, peringatan ditampilkan dan data tidak disimpan.
9. Jika valid, aplikasi membuat object jasa baru dengan ID berbasis timestamp.
10. Object baru dimasukkan ke awal array hasil `readServices()`.
11. Array disimpan ke `campus_services_data`.
12. Notifikasi sukses ditampilkan.
13. Pengguna diarahkan ke `index.html`.

## 7. Alur Melihat Detail Jasa

Detail jasa berada di `detail.html` dan menggunakan `data-page="detail"`.

1. Pengguna membuka link `detail.html?id=...` dari kartu jasa.
2. `initializeDetailPage()` membaca query parameter `id` menggunakan `URLSearchParams`.
3. `readServices()` mengambil seluruh jasa dari `localStorage`.
4. Aplikasi mencari object dengan ID yang sama.
5. Jika object tidak ditemukan, halaman menampilkan pesan `Jasa tidak ditemukan` dan link kembali ke beranda.
6. Jika ditemukan, detail jasa dirender ke dalam elemen `#app`.
7. Data yang ditampilkan meliputi gambar, kategori, judul, penyedia, rating, harga, satuan, deskripsi, dan catatan pengerjaan.
8. Ulasan diambil dari `service.reviews` jika tersedia. Jika tidak tersedia, aplikasi memakai `fallbackReviews`.

## 8. Alur Kontak WhatsApp

Pada detail jasa, aplikasi membuat pesan otomatis menggunakan nama penyedia dan judul jasa.

1. Pesan dibentuk dalam JavaScript.
2. `encodeURIComponent()` digunakan agar spasi dan karakter khusus aman di URL.
3. URL dibentuk sebagai `https://wa.me/{nomor}?text={pesan}`.
4. Tombol `Hubungi via WhatsApp` membuka URL tersebut pada tab baru.

## 9. Alur Menghapus Jasa

Penghapusan dapat dilakukan dari kartu di beranda atau dari halaman detail.

### Dari beranda

1. Pengguna menekan tombol `Hapus` pada kartu.
2. Object dengan ID tersebut dikeluarkan dari array.
3. Array baru disimpan ke `campus_services_data`.
4. Daftar jasa dirender ulang.

### Dari halaman detail

1. Pengguna menekan `Hapus Jasa`.
2. Browser menampilkan konfirmasi.
3. Jika dibatalkan, detail tetap ditampilkan.
4. Jika disetujui, jasa dihapus dari array dan disimpan ulang.
5. Browser diarahkan ke `index.html`.

## 10. Hubungan Antar Data

| Key / Data | Fungsi |
| --- | --- |
| `campus_services_data` | Menyimpan array jasa marketplace. |
| `campus_service_categories` | Menyimpan kategori filter dan pilihan form. |
| `polsrijasa_auth` | Menyimpan user demo yang sedang login. |
| `sampleServices` | Data jasa awal ketika storage belum berisi data valid. |
| `defaultCategories` | Kategori awal dan fallback saat kategori kosong. |
| `fallbackReviews` | Ulasan tampilan ketika jasa tidak memiliki array `reviews`. |
| `pageState` | State sementara untuk kategori aktif dan kata pencarian. |

## 11. Catatan Implementasi Aktual

- Aplikasi bersifat client-side; tidak ada API atau database server.
- Validasi login hanya membandingkan dengan akun demo yang hard-coded.
- Semua halaman selain login memerlukan data login pada `localStorage`.
- Ulasan dapat ditampilkan, tetapi pada flow yang tersedia tidak ada form untuk menambah ulasan baru.
- Penghapusan jasa tidak memerlukan role khusus selama user sudah login.
- `style.css` mengatur tampilan, tetapi tidak mengubah alur data utama.
- `gabungan.html` merupakan halaman HTML mandiri dengan CSS inline dan tidak memakai pola `data-page` utama seperti empat halaman aplikasi di atas.
- Flowchart dan deskripsi ini menjelaskan implementasi aktual, sehingga beberapa detail pada PRD dapat berbeda dari perilaku kode saat ini.

## 12. Cara Membaca Flowchart

Buka `project-flowchart.md` pada VS Code atau GitHub yang mendukung Mermaid. Diagram dibagi menjadi beberapa subgraph agar alur autentikasi, beranda, form jasa, dan detail jasa dapat dibaca terpisah tetapi tetap terlihat hubungan antarhalamannya.

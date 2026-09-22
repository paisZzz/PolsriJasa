# Flowchart Alur Project PolsriJasa

Diagram berikut menggambarkan alur aktual project berdasarkan `main.js` dan halaman HTML yang memiliki `data-page`.

```mermaid
flowchart TD
    A([Pengguna membuka halaman]) --> B[DOMContentLoaded]
    B --> C{Halaman memiliki data-page?}
    C -->|login| D[redirectToLoginIfNeeded]
    C -->|home, detail, atau form| E[redirectToLoginIfNeeded]
    C -->|tidak ada / halaman lain| Z([Tidak ada inisialisasi khusus])

    subgraph AUTH[Autentikasi]
        D --> D1{Sudah login?}
        D1 -->|Ya| D2[Redirect ke index.html]
        D1 -->|Tidak| D3[initializeLoginPage]
        D3 --> D4[Form login dengan akun demo]
        D4 --> D5{Email dan password benar?}
        D5 -->|Tidak| D6[Tampilkan pesan error]
        D6 --> D4
        D5 -->|Ya| D7[saveCurrentUser ke localStorage]
        D7 --> D2

        E --> E1{Sudah login?}
        E1 -->|Tidak| E2[Redirect ke login.html]
        E1 -->|Ya| E3[initializeAuthControls]
        E3 --> E4[Tampilkan nama user dan siapkan tombol Keluar]
        E4 --> E5{Pengguna menekan Keluar?}
        E5 -->|Ya| E6[clearCurrentUser]
        E6 --> E2
        E5 -->|Tidak| F{Jenis halaman}
    end

    subgraph HOME[Beranda - index.html]
        F -->|home| H1[initializeHomePage]
        H1 --> H2[readServices dari localStorage]
        H2 --> H3{Data jasa tersedia?}
        H3 -->|Tidak ada atau rusak| H4[Simpan sampleServices]
        H3 -->|Ada| H5[Gunakan data jasa tersimpan]
        H4 --> H5
        H5 --> H6[renderCategories]
        H6 --> H7[readCategories dari localStorage]
        H7 --> H8{Kategori tersedia?}
        H8 -->|Tidak ada| H9[Simpan defaultCategories]
        H8 -->|Ada| H10[Gunakan kategori tersimpan]
        H9 --> H10
        H10 --> H11[bindCategoryFilters dan initializeCategoryManager]
        H11 --> H12[renderList]
        H12 --> H13[Filter berdasarkan kategori dan kata pencarian]
        H13 --> H14[Tampilkan kartu jasa dan jumlah hasil]
        H14 --> H15{Aksi pengguna}
        H15 -->|Ketik pencarian| H12
        H15 -->|Pilih kategori| H16[Ubah pageState.category]
        H16 --> H12
        H15 -->|Hapus jasa dari kartu| H17[Hapus item lalu simpan ke localStorage]
        H17 --> H12
        H15 -->|Klik Detail| I[detail.html?id=serviceId]
        H15 -->|Klik Pasang Jasa| J[post-service.html]
        H15 -->|Tambah kategori| H18[categoryValue lalu simpan kategori]
        H18 --> H6
        H15 -->|Hapus kategori| H19{Kategori sedang dipakai?}
        H19 -->|Ya| H20[Tampilkan peringatan]
        H19 -->|Tidak| H21[Simpan daftar kategori baru]
        H21 --> H6
    end

    subgraph FORM[Pasang Jasa - post-service.html]
        F -->|form| J1[initializeFormPage]
        J1 --> J2[renderCategories ke select]
        J2 --> J3[Pengguna mengisi form]
        J3 --> J4[Normalisasi nomor WhatsApp dan baca FormData]
        J4 --> J5{Semua field wajib terisi?}
        J5 -->|Tidak| J6[Tampilkan peringatan]
        J6 --> J3
        J5 -->|Ya| J7{Nomor diawali 628 dan harga valid?}
        J7 -->|Tidak| J8[Tampilkan peringatan validasi]
        J8 --> J3
        J7 -->|Ya| J9[Buat object jasa baru]
        J9 --> J10[Tambahkan ke array services]
        J10 --> J11[Simpan ke campus_services_data]
        J11 --> J12[Tampilkan notifikasi berhasil]
        J12 --> H1
    end

    subgraph DETAIL[Detail Jasa - detail.html]
        F -->|detail| I1[initializeDetailPage]
        I1 --> I2[Baca query parameter id]
        I2 --> I3[readServices dan cari service berdasarkan id]
        I3 --> I4{Jasa ditemukan?}
        I4 -->|Tidak| I5[Tampilkan Jasa tidak ditemukan]
        I5 --> H1
        I4 -->|Ya| I6[Ambil reviews atau gunakan fallbackReviews]
        I6 --> I7[Buat link WhatsApp dengan encodeURIComponent]
        I7 --> I8[Tampilkan detail, harga, deskripsi, rating, dan ulasan]
        I8 --> I9{Aksi pengguna}
        I9 -->|Hubungi WhatsApp| I10[Buka wa.me dengan pesan otomatis]
        I9 -->|Hapus Jasa| I11{Konfirmasi penghapusan?}
        I11 -->|Tidak| I8
        I11 -->|Ya| I12[Hapus jasa dan simpan localStorage]
        I12 --> H1
    end
```

## Titik Penyimpanan Data

- `campus_services_data`: daftar jasa, termasuk jasa bawaan dan jasa baru.
- `campus_service_categories`: daftar kategori bawaan dan kategori tambahan.
- `polsrijasa_auth`: user demo yang sedang login.

## Catatan Pembacaan

- `main.js` memilih inisialisasi berdasarkan `document.body.dataset.page`.
- Halaman `index.html`, `post-service.html`, dan `detail.html` membutuhkan user yang sudah login.
- Flowchart ini mendokumentasikan perilaku kode saat ini, bukan rancangan fitur ideal dari PRD.

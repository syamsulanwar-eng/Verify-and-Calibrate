# CalibraTrack UPKS

> **Sistem Pengurusan Kalibrasi & Verifikasi Peralatan Makmal Berpusat**  
> Dibangunkan untuk Unit Pengujian & Kalibrasi Standard (UPKS), Lembaga Getah Malaysia (LGM) bagi pematuhan standard **ISO/IEC 17025**.

---

## A. Nama Projek & Penerangan Ringkas

**CalibraTrack UPKS** ialah aplikasi web papan pemuka (*dashboard*) untuk memantau status kalibrasi vendor luaran (MeTCaL Malaysia), rekod verifikasi bulanan kendiri (selang 30 hari), dan logistik pergerakan 104 peralatan makmal secara berpusat.

---

## B. Masalah yang Diselesaikan

Di makmal saintifik dan ujian industri, setiap peralatan pengukuran wajib ditentukur (*calibrate*) dan disahkan (*verify*) mengikut jadual ketat bagi mengelakkan data ujian terbatal semasa audit akreditasi.

Sebelum sistem ini wujud:
* Maklumat disimpan dalam beberapa fail hamparan elektronik (*spreadsheet*) berasingan dan buku log fizikal.
* Sukar mengetahui alatan mana yang sedang dihantar ke makmal vendor luaran (*out for calibration*).
* Sukar mengesan alatan yang hampir luput tempoh verifikasi 30 hari atau kebuk wasap (*fume hood*) yang mengalami penurunan halaju angin ekzos (*face velocity*).

**CalibraTrack** menyelesaikan masalah ini dengan menyediakan satu skrin utama yang memaparkan baki hari, status warna segera, amaran awal 30 hari, dan templat mesej peringatan untuk dihantar kepada pegawai bertanggungjawab (*Person In Charge / PIC*).

---

## C. Untuk Siapa?

Aplikasi ini direka khas untuk 3 kelompok pengguna di makmal:

1. **Akses Awam / Warga Makmal (*Guest / Read-Only*):**
   Penyelidik, juruteknik, atau staf yang ingin menyemak sama ada sesuatu alatan sah dan selamat digunakan sebelum memulakan eksperimen.
2. **Pegawai Pengendali & PIC Alatan (*PIC Mode*):**
   Pegawai yang bertanggungjawab merekod bacaan ujian verifikasi bulanan (Option B) dan mengurus pergerakan alatan ke makmal vendor.
3. **Pentadbir Makmal & Pengurus Kualiti QA (*Admin Mode*):**
   Pegawai kualiti yang mendaftar alatan baharu, menetapkan piawaian, dan mengurus sandaran data ke Google Sheets.

---

## D. Apa yang Boleh Dibuat? (Fungsi Utama)

Berdasarkan aplikasi sebenar yang telah dibina:

* **Papan Pemuka 104 Alatan Makmal:**
  Paparan senarai lengkap merangkumi **Batch 1 (57 alatan)**, **Batch 2 (22 alatan)**, **19 Kebuk Wasap (*Fume Hood*)**, dan **11 Ketuhar Makmal (*Oven Master List*)**.
* **Penapis Pantas 1-Klik (*Quick Segment Filter*):**
  Mengasingkan alatan mengikut kumpulan: *Semua*, *Batch 1*, *Batch 2*, *Kebuk Wasap*, atau *Ketuhar / Oven*, serta mengikut premis makmal (Bangunan 260 / Stesen Sungai Buloh).
* **Verifikasi Bulanan 30-Hari (FR-002 Option B):**
  Borang merekod tarikh ujian, nama pelaksana, nilai bacaan sebenar (contoh: berat standard gram, halaju muka fpm), dan muat naik lampiran bukti (gambar/PDF). Tarikh seterusnya dikira secara automatik (+30 hari).
* **Penjejakan Pergerakan Vendor MeTCaL (FR-003):**
  Merekod status keluar alatan bersama nombor Nota Penghantaran (*Delivery Order / DO*), tarikh jangka kembali, dan mendaftar penerimaan alatan beserta nombor sijil kalibrasi baharu.
* **Pelekat Kod QR Fizikal (FR-005):**
  Menjana pelekat kod QR sedia cetak mengikut saiz label standard untuk ditampal pada instrumen di lantai makmal. Imbasan kod QR membuka kad profil alatan secara langsung.
* **Pusat Peringatan & Dispatcher Amaran (FR-004):**
  Menjana templat emel rasmi dan pautan pantas WhatsApp kepada PIC alatan yang hampir tamat tempoh ($\le 30$ hari) atau telah tamat tempoh (*Overdue*).
* **Kawalan Akses Berasaskan PIN (FR-006):**
  Akses awam boleh melihat status tanpa kata laluan. Tindakan sensitif dilindungi dengan PIN ringkas (PIN PIC: `1234`, PIN Admin: `9999`).
* **Penyegerakan Google Sheets Tanpa Kos Pelayan (FR-007):**
  Menyokong penyegerakan ke Google Sheets pengguna melalui Google Apps Script Web App dengan sokongan antrian luar talian (*offline queue*).

---

## E. Contoh Cara Penggunaan

Berikut ialah contoh aliran kerja biasa seorang juruteknik makmal:

1. **Buka Aplikasi:** Buka CalibraTrack melalui pelayar web (*browser*).
2. **Cari Alatan:** Taip kod alatan pada bar carian, contohnya `FC-12` (Kebuk Wasap Makmal Serbuk B048) atau `B03` (Neraca Analitikal Mettler Toledo).
3. **Buka Tindakan Verifikasi:** Klik butang **Verifikasi**. Sistem meminta pengesahan PIN PIC (`1234`).
4. **Isi Bacaan Ujian:** Masukkan bacaan ujian sebenar, contohnya:  
   `Halaju Muka Purata: 140.70 fpm (Piawai DOSH >= 100 fpm)`.
5. **Hantar Rekod:** Klik **Simpan Log Verifikasi**.
6. **Hasil:** Tarikh verifikasi seterusnya dikemas kini secara automatik kepada 30 hari dari tarikh ujian, rekod disimpan ke sejarah alatan, dan status instrumen disahkan kekal **Aktif**.

---

## F. Cara Mencuba

Aplikasi ini boleh diuji terus melalui pelayar web tanpa sebarang pemasangan perisian tambahan:

* **Pautan Aplikasi (Pratonton Langsung):**  
  [https://ais-pre-6hpeikt2z2qoar3v6ugfkm-998641659851.asia-east1.run.app](https://ais-pre-6hpeikt2z2qoar3v6ugfkm-998641659851.asia-east1.run.app)
* **Pautan Pembangunan (*Development URL*):**  
  [https://ais-dev-6hpeikt2z2qoar3v6ugfkm-998641659851.asia-east1.run.app](https://ais-dev-6hpeikt2z2qoar3v6ugfkm-998641659851.asia-east1.run.app)

---

## G. Status Projek

| Perkara | Status Semasa | Catatan |
|---|---|---|
| **Papan Pemuka & Inventori (104 Alatan)** | **Sudah Dibina & Telah Diuji** | Data lengkap berasaskan fail dokumen makmal MeTCaL, Kebuk Wasap & Ketuhar. |
| **Log Verifikasi 30-Hari & Bukti Lampiran** | **Sudah Dibina & Telah Diuji** | Mengira tarikh seterusnya (+30 hari) dan menukar status instrumen secara automatik. |
| **Logistik Vendor Keluar/Masuk & No. Sijil** | **Sudah Dibina & Telah Diuji** | Status alatan bertukar ke *Out for Calibration* dan kembali ke *Active* selepas pendaftaran sijil. |
| **Pusat Amaran Notifikasi WhatsApp & Emel** | **Sudah Dibina & Telah Diuji** | Menjana teks berformat dengan pautan *click-to-chat* WhatsApp dan pautan *mailto*. |
| **Penjanaan Pelekat Kod QR & Cetakan** | **Sudah Dibina & Telah Diuji** | Kod QR SVG berfungsi dan mod cetakan CSS dioptimumkan untuk label instrumen. |
| **Penyimpanan Data Tempatan (*LocalStorage*)** | **Sudah Dibina & Telah Diuji** | Data kekal dalam storan peranti pengguna walaupun laman dimuat semula. |
| **Penyegerakan Google Sheets (Apps Script)** | **Sudah Dibina (Belum Disahkan)** | Logik penghantaran webhook siap dibina; memerlukan URL Apps Script sebenar daripada pentadbir makmal untuk pengesahan langsung di pelayan luar. |
| **Pangkalan Data Awan Berpusat (Cloud SQL/Postgres)** | **Belum Dibina (Perancangan Masa Depan)** | Pada fasa MVP ini, aplikasi beroperasi sepenuhnya secara *client-side* tanpa pelayan pangkalan data berbayar. |

---

## H. Panduan Lanjut

Untuk dokumentasi terperinci, sila rujuk fail-fail berikut:

* [📘 Panduan Pengguna Langkah demi Langkah](docs/PANDUAN-PENGGUNA.md) — Arahan terperinci cara menggunakan setiap fungsi app dan maksud status alatan.
* [📋 Keperluan Produk & Skop Spesifikasi](docs/KEPERLUAN-PRODUK.md) — Huraian keperluan sistem berasaskan dokumen PRD makmal UPKS.
* [🗺️ Status Semasa & Pelan Masa Depan](docs/STATUS-DAN-ROADMAP.md) — Perincian fungsi yang telah dibina, diuji, dan pelan pembangunan seterusnya.
* [🔒 Data, Keselamatan & Privasi](docs/DATA-DAN-PRIVASI.md) — Penerangan telus mengenai lokasi penyimpanan data dan tahap kawalan akses.
* [⚙️ Panduan Pemasangan & Penyelenggaraan](docs/SETUP-DAN-PENYELENGGARAAN.md) — Arahan teknikal untuk pembangun menjalankan kod sumber secara setempat.
* [📝 Rekod Perubahan (Changelog)](CHANGELOG.md) — Sejarah versi dan penambahbaikan aplikasi dari mula hingga kini.

---

## I. Ringkasan Teknologi

Aplikasi ini dibina dengan susunan teknologi moden yang ringan dan pantas:

* **React 19:** Digunakan untuk membina struktur paparan antaramuka dan interaksi pengguna yang responsif.
* **Vite:** Alat pembina (*bundler*) generasi baharu yang memastikan masa muat pantas dan saiz fail yang kecil.
* **Tailwind CSS v4:** Digunakan untuk susun atur visual yang kemas, moden, dan mesra peranti mudah alih.
* **TypeScript:** Memastikan kestabilan kod serta mengurangkan ralat pengaturcaraan melalui semakan jenis data (*static typing*).
* **Lucide React:** Koleksi ikon antaramuka berkualiti tinggi yang konsisten.
* **Web Storage API (LocalStorage):** Digunakan untuk menyimpan inventori dan log terus di dalam pelayar pengguna tanpa memerlukan akaun pelayan luaran.
* **Google Apps Script (Pilihan):** Skrip perantara tanpa kos untuk menyegerakkan data terus ke fail Google Sheets pentadbir.

---

## J. Maklum Balas & Bantuan

Sekiranya anda menemui pepijat (*bug*) atau mempunyai cadangan penambahbaikan:
* Laporkan melalui tab **Issues** pada repository GitHub ini (jika repositori telah disambungkan).
* Atau hubungi pegawai penyelaras sistem makmal bertugas di Unit Pengujian & Kalibrasi Standard (UPKS), Lembaga Getah Malaysia.

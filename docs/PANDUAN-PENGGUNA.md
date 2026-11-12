# Panduan Pengguna CalibraTrack UPKS

Panduan ini menerangkan cara menggunakan aplikasi **CalibraTrack UPKS** langkah demi langkah dalam bahasa harian yang mudah difahami, tanpa memerlukan pengetahuan teknikal pengaturcaraan.

---

## 1. Maksud Peranan Pengguna & Kata Laluan PIN

Aplikasi ini membahagikan tindakan kepada 3 mod capaian bagi mengelakkan data dipinda secara tidak sengaja:

| Peranan | Mod Capaian | Akses & Kebenaran | PIN Lalai (*Default*) |
|---|---|---|---|
| **Akses Awam** | *Guest / Read-Only* | Boleh mencari alatan, menyemak status operasi, melihat sejarah verifikasi, dan mencetak pelekat kod QR. Tidak boleh mengubah data. | Tiada (Buka terus) |
| **Pegawai PIC / QA** | *PIC Mode* | Boleh merekod verifikasi bulanan (Option B), merekod pergerakan alatan keluar/masuk vendor MeTCaL, dan menghantar notifikasi peringatan. | **`1234`** |
| **Pentadbir Makmal** | *Admin Mode* | Boleh menambah alatan baharu, mengedit profil peralatan, menetapkan URL penyambung Google Sheets, dan menetapkan semula pangkalan data. | **`9999`** |

> **Cara Menukar Peranan:**  
> Klik pada butang status peranan di bahagian atas kanan skrin (contoh: "Akses Awam"). Pilih peranan yang diingini dan masukkan nombor PIN apabila diminta.

---

## 2. Maksud Status & Warna Peralatan

Setiap alatan ditandai dengan lencana warna untuk memudahkan staf makmal mengenal pasti kesahan alatan secara sepintas lalu:

| Status Lencana | Warna | Maksud Operasi Makmal | Tindakan Diperlukan |
|---|---|---|---|
| **Aktif (Sah)** | 🟢 Hijau | Instrumen berada dalam had kalibrasi dan verifikasi bulanan sah. | Selamat digunakan untuk pengujian makmal. |
| **Jadual Semula** | 🟡 Kuning / Jingga | Tarikh kalibrasi atau verifikasi berbaki $\le 30$ hari dari tarikh hari ini. | Rancang sesi verifikasi bulanan atau sediakan alatan untuk dihantar ke vendor. |
| **Di MeTCaL** | 🔵 Biru Gelap | Alatan sedang berada di makmal penentukuran luaran (MeTCaL). | Alatan tiada di makmal. Tunggu penghantaran kembali beserta sijil. |
| **Luput Had** | 🔴 Merah | Tarikh luput telah terlepas ($< 0$ hari). | **DILARANG DIGUNAKAN.** Data eksperimen boleh terbatal jika menggunakan alatan ini. |
| **Hilang / Rosak** | 🔴 Merah Gelap | Alatan gagal ujian verifikasi, rosak fizikal, atau dilaporkan hilang (contoh: instrumen MP3 & OV11). | Unit dialihkan ke status *Out of Service* sehingga dibaiki atau dilupuskan. |

---

## 3. Cara Menggunakan Fungsi Utama

### A. Mencari & Menapis Alatan
1. Pada skrin utama, gunakan bar carian untuk menaip:
   * **Kod Alatan:** Contohnya `B03`, `DTL1`, `FC-12`, `OV11`.
   * **Nama Alatan:** Contohnya `Balance`, `Oven`, `Micropipette`, `Kebuk Wasap`.
   * **Nama Pegawai:** Contohnya `Syamsul`, `Noorhisham`, `Iswardi`, `Mahfudzuh`.
   * **Lokasi Makmal:** Contohnya `B159`, `B048`, `B033`, `Sg Buloh`.
2. Gunakan **Butang Segmen Pantas** di atas jadual:
   * **Semua (104):** Memaparkan keseluruhan inventori.
   * **Batch 1 (57):** Alatan penentukuran MeTCaL fasa pertama.
   * **Batch 2 (22):** Alatan penentukuran MeTCaL fasa kedua (termasuk unit di vendor).
   * **Kebuk Wasap (19):** Unit kebuk wasap (*fume hood*) makmal UPKS.
   * **Ketuhar / Oven (11):** Semua ketuhar Memmert UPKS (Master List).

---

### B. Merekod Verifikasi Bulanan (Selang 30 Hari)
Setiap 30 hari, pegawai PIC perlu melaksanakan verifikasi kendiri di makmal.

1. Cari instrumen yang ingin disahkan dalam jadual.
2. Klik butang **Verifikasi** pada baris alatan tersebut.
3. Masukkan PIN PIC (`1234`) sekiranya anda belum log masuk sebagai PIC.
4. Pada tetingkap timbul:
   * **Tarikh Ujian:** Tarikh ujian dilakukan (lalai: tarikh semasa).
   * **Nama Pelaksana:** Nama juruteknik atau pegawai yang menjalankan ujian.
   * **Keputusan:** Pilih **LULUS (PASS)** atau **GAGAL (FAIL)**.
   * **Nilai Bacaan Ukuran Standard:** Masukkan nilai sebenar.
     * *Contoh Neraca:* `Pemberat Standard 100g -> Bacaan: 100.0002g`.
     * *Contoh Kebuk Wasap:* `Halaju Muka Purata: 156.50 fpm (Piawai DOSH >= 100 fpm)`.
     * *Contoh Ketuhar:* `Suhu Seting 105C -> Sensor: 104.8C (Sisihan 0.2C)`.
   * **Catatan Ringkas:** Catat sebarang pemerhatian fizikal atau pembersihan.
   * **Lampiran Bukti (Pilihan):** Boleh muat naik gambar bacaan alat atau slip ujian.
5. Klik **Simpan Log Verifikasi**.
6. **Hasil:** Sistem akan merekodkan log ke dalam tab sejarah dan mengira tarikh verifikasi baharu (+30 hari dari tarikh ujian).

---

### C. Merekod Pergerakan Alatan ke Vendor MeTCaL (Keluar & Masuk)

#### 1. Menghantar Alatan Keluar ke Vendor:
1. Klik butang **Hantar Vendor** pada baris alatan.
2. Masukkan:
   * **Tarikh Hantar Keluar.**
   * **Nama Vendor:** (Lalai: *MeTCaL Malaysia Sdn Bhd*).
   * **No. Rujukan DO:** Contoh: `DO/LGM/UPKS/2026/B2-099`.
   * **Jangkaan Tarikh Kembali.**
3. Klik **Sahkan Penghantaran Keluar**.
4. Status alatan automatik bertukar menjadi **Di MeTCaL** (*Out for Calibration*).

#### 2. Mendaftar Alatan Kembali dari Vendor:
1. Klik butang **Terima dari Vendor** pada baris alatan yang sedang berada di vendor.
2. Masukkan:
   * **Tarikh Alatan Diterima Semula.**
   * **Keputusan Sijil:** Pilih *Lulus (Pass)*, *Gagal (Fail)*, atau *Out of Tolerance*.
   * **Nombor Sijil Kalibrasi:** Contoh: `METCAL-CAL-2026-B03-9912`.
   * **Tarikh Kalibrasi Baharu:** Tarikh luput seterusnya (biasanya +1 tahun mengikut jadual makmal).
3. Klik **Simpan Penerimaan**.
4. Status alatan bertukar semula menjadi **Aktif (Sah)**.

---

### D. Mencetak Pelekat Kod QR Fizikal
1. Klik pada nama alatan atau butang ikon **Kod QR**.
2. Tetingkap **Pelekat Kalibrasi Fizikal** akan dipaparkan dengan maklumat:
   * Kod ID Alatan, Model & Nombor Siri.
   * Nama Pegawai PIC & Lokasi.
   * Tarikh Kalibrasi & Tarikh Luput.
   * Kod QR resolusi tinggi.
3. Klik **Cetak Pelekat (Ctrl+P)**.
4. Tetapkan saiz cetakan pada kertas label pelekat untuk ditampal pada badan instrumen di makmal.

---

### E. Menghantar Amaran Peringatan kepada PIC (WhatsApp & Emel)
1. Klik pada butang **Amaran** di bar navigasi atas.
2. Senarai alatan yang hampir luput ($\le 30$ hari) atau telah tamat tempoh akan dipaparkan.
3. Pilih alatan yang berkenaan.
4. Sistem menyediakan dua saluran mesej siap tulis:
   * **WhatsApp:** Klik butang **Buka WhatsApp** untuk menghantar mesej segera kepada nombor telefon pegawai bertugas.
   * **Emel Rasmi:** Klik butang **Buka Emel Rasmi** untuk membuka aplikasi emel komputer anda dengan subjek dan teks rasmi ISO 17025 yang lengkap.

---

## 4. Penyelesaian Masalah Biasa (*Troubleshooting*)

### 1. Saya terlupa PIN PIC atau Admin.
* **PIN Lalai PIC:** `1234`
* **PIN Lalai Admin:** `9999`
* Sekiranya anda menukar peranan ke "Akses Awam", anda masih boleh melihat semua alatan dan menyemak tarikh tanpa sebarang PIN.

### 2. Adakah data saya hilang jika saya memuat semula (*refresh*) pelayar?
* **Tidak.** Semua data disimpan secara automatik di dalam storan pelayar (*Web LocalStorage*). Apabila anda membuka semula laman web ini pada peranti yang sama, data terkini akan dipaparkan.

### 3. Bagaimanakah cara mengembalikan data kepada asal jika berlaku kesilapan?
* Klik ikon **Google Sheets / Tetapan Data** di bar atas.
* Pilih tab **Pengurusan Data**.
* Klik butang **Tetapkan Semula Data (Reset to Default)**.
* Sistem akan memuatkan semula data lengkap 104 instrumen rasmi makmal UPKS.

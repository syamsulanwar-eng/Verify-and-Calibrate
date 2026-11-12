# Dokumen Keperluan Produk (Product Requirements Document - PRD)

> **Rujukan Dokumen Asal Makmal:**  
> Fail PRD asal makmal disimpan dalam projek di:  
> `public/assets/aistudio/Equipment_Calibration___Verification_PRD_38d8d1cd.pdf`  
> Dokumen ini merumuskan dan memperincikan keperluan sistem CalibraTrack UPKS berdasarkan aplikasi sebenar yang telah dibina.

---

## 1. Tujuan & Latar Belakang

Unit Pengujian & Kalibrasi Standard (UPKS), Lembaga Getah Malaysia (LGM) beroperasi di bawah piawaian sistem pengurusan kualiti makmal antarabangsa **ISO/IEC 17025 (SAMM)**. Di bawah piawaian ini:
1. Setiap peralatan pengukuran mestilah ditentukur secara berkala oleh makmal bertauliah (contohnya *MeTCaL Malaysia Sdn Bhd*).
2. Setiap peralatan kritikal perlu menjalani **verifikasi prestasi dalaman secara bulanan** (setiap 30 hari) bagi memastikan tiada hanyutan (*drift*) atau ralat pengukuran sebelum eksperimen dijalankan.
3. Kebuk wasap (*fume hood*) perlu dipantau secara bulanan bagi memastikan halaju muka (*face velocity*) mematuhi standard keselamatan pekerja Jabatan Keselamatan dan Kesihatan Pekerjaan (**JKKP / DOSH**) dan **ASHRAE 110** ($\ge 100\text{ fpm} / 0.5\text{ m/s}$).

Aplikasi **CalibraTrack UPKS** dibangunkan sebagai sistem pengurusan maklumat kalibrasi dan verifikasi digital berpusat untuk menggantikan rekod kertas manual dan fail hamparan berpecah.

---

## 2. Kelompok Pengguna Sasaran (*Target Users*)

1. **Pengguna Makmal Umum (*Lab Researchers / Guest*):**
   * Perlu menyemak status alatan dengan pantas sebelum menggunakan mesin.
   * Mod baca sahaja (*read-only*), tiada kata laluan diperlukan.
2. **Pegawai Pengendali / Juruteknik Makmal (*Lab PIC / QA Officers*):**
   * Menjalankan ujian verifikasi bulanan kendiri.
   * Merekod nombor DO, pergerakan keluar-masuk alatan vendor MeTCaL, dan nombor sijil baharu.
3. **Pengurus Kualiti & Pentadbir Makmal (*Lab Admin / Quality Manager*):**
   * Mengurus penambahan instrumen baharu ke dalam senarai induk (*masterlist*).
   * Memantau amaran ketidakpatuhan (*non-compliance risk*).
   * Mengkonfigurasi sandaran pangkalan data ke Google Sheets.

---

## 3. Skop Produk Fasa Semasa (MVP)

Aplikasi meliputi skop inventori instrumen di dua premis utama LGM:
* **Bangunan 260:** Makmal UPKS 1 (B159), Makmal UPKS 2/TLC (B158), Makmal Kromatografi & Permeasi (B033), Makmal Serbuk & Nitrosamine (B048/B050), Makmal Spektroskopi (B039), Bilik Staf UPKS (B123), dan Makmal Terma (B042).
* **Stesen Penyelidikan Sungai Buloh:** Makmal B035, Bilik NMR, dan Bilik Ujian GF/R001.

### Kategori Peralatan yang Diliputi (104 Alatan):
1. **Jisim & Penimbangan:** Neraca analitikal (Mettler Toledo, Sartorius).
2. **Volumetrik & Pipet:** Mikropipet pelbagai kapasiti (Brand, Sartorius, Finnpipette).
3. **Suhu & Persekitaran:** Perakam data suhu bilik (*data logger* Testo, Comet).
4. **Terma & Pemanas:** Ketuhar makmal Memmert (*Oven Master List*), pemanas blok Stuart (*block heater*), relau Carbolite (*furnace*), dan plat panas (*hot plate*).
5. **Elektrokimia & pH:** Meter pH (Seven Compact, Five Easy).
6. **Kebuk Wasap & Keselamatan Makmal:** 19 unit kebuk wasap (*fume hood*) dengan rekod halaju muka.
7. **Emparan & Penggoncang:** Mesin emparan (*centrifuge*), penggoncang IKA (*shaker*).
8. **Dimensi & Ukuran:** Tolok ketebalan (*thickness gauge* Mitutoyo).
9. **Pemberat Standard:** Set pemberat standard kelas E2 dan F1.

---

## 4. Keperluan Fungsian & Peraturan Operasi (*Business Rules*)

### FR-001: Papan Pemuka Inventori & Carian Pintar
* **Peraturan:** Sistem mesti memaparkan senarai lengkap alatan berserta nombor ID, nama, model, nombor siri, nama pegawai PIC, lokasi, dan status operasi.
* **Kriteria Terima:**
  * Pengguna boleh menapis mengikut butang pantas: *Semua*, *Batch 1*, *Batch 2*, *Kebuk Wasap*, dan *Ketuhar / Oven*.
  * Carian teks menyokong carian kata kunci merentasi ID, nombor siri aset LGM, nama alatan, lokasi, dan parameter kalibrasi.
  * Memaparkan lencana status warna: Hijau (Aktif), Biru (Di MeTCaL), Kuning (Jadual Semula $\le 30$ hari), Merah (Luput / Hilang / Rosak).

### FR-002: Log Verifikasi Bulanan (Option B: Nilai Bacaan & Bukti)
* **Peraturan Operasi:**
  1. Selang masa verifikasi dalaman ialah **30 hari**.
  2. Apabila pengguna merekodkan log verifikasi pada tarikh $T$:
     $$\text{Tarikh Verifikasi Seterusnya} = T + 30\text{ hari}$$
  3. Jika keputusan ialah **LULUS (Pass)**: Status alatan ditetapkan kepada **Aktif** (jika tarikh kalibrasi vendor masih sah).
  4. Jika keputusan ialah **GAGAL (Fail)**: Status alatan automatik bertukar menjadi **Out of Service (Hilang / Rosak)** bagi menghalang penggunaan alatan bermasalah.
  5. Pengguna wajib memasukkan nilai bacaan ukuran rujukan standard (contohnya bacaan jisim atau halaju muka).

### FR-003: Logistik & Pergerakan Vendor MeTCaL
* **Peraturan Operasi:**
  1. Penghantaran keluar (*Outward*): Memerlukan tarikh hantar, nama vendor (*MeTCaL Malaysia Sdn Bhd*), nombor DO, dan jangkaan tarikh kembali. Status alatan bertukar ke **Di MeTCaL** (*Out for Calibration*).
  2. Penerimaan masuk (*Inward*): Memerlukan tarikh alatan diterima, keputusan sijil (*Pass / Fail / Out of Tolerance*), nombor sijil penentukuran, dan tarikh kalibrasi baharu. Status alatan kembali kepada **Aktif**.

### FR-004: Pusat Amaran Tarikh Luput & Dispatcher Notifikasi
* **Peraturan Operasi:**
  * Mana-mana alatan yang mempunyai baki hari $\le 30$ hari atau telah terlepas tarikh luput ($< 0$ hari) dimasukkan ke dalam senarai pengawasan kualiti (*Urgent Equipment*).
  * Sistem menjana teks berformat rasmi untuk dihantar terus melalui WhatsApp (*click-to-chat*) dan Emel kepada pegawai PIC alatan tersebut.

### FR-005: Pelekat Kod QR Fizikal
* **Peraturan Operasi:**
  * Setiap instrumen mempunyai kod QR unik yang merujuk terus kepada ID peralatannya.
  * Tetingkap cetakan pelekat dioptimumkan melalui arahan CSS `@media print` untuk mencetak label fizikal tanpa elemen antaramuka laman web.

### FR-006: Kawalan Akses & Keselamatan Berasaskan PIN
* **Peraturan Operasi:**
  * Mod Baca Sahaja terbuka kepada semua tanpa sebarang kata laluan.
  * Log verifikasi dan logistik vendor memerlukan pengesahan PIN PIC (`1234`).
  * Penambahan alatan baharu dan konfigurasi sandaran memerlukan pengesahan PIN Admin (`9999`).

### FR-007: Integrasi Sandaran Google Sheets (Pilihan Tanpa Kos)
* **Peraturan Operasi:**
  * Sistem menyediakan templat kod Google Apps Script yang boleh ditampal oleh pentadbir ke Google Sheets mereka sendiri.
  * Apabila transaksi berlaku, data dihantar secara tak segerak (*asynchronous*). Jika capaian internet terputus, transaksi disimpan dalam antrian setempat (*offline queue*) dan disegerakkan apabila talian pulih.

---

## 5. Ringkasan Aliran Pengguna (*User Flows*)

```
[Mula: Buka CalibraTrack]
       │
       ├───> [Lihat Papan Pemuka & Semak Status Alatan] (Akses Awam)
       │
       ├───> [Imbas / Klik Pelekat Kod QR Fizikal] ────> [Papar Kad Profil Alatan]
       │
       ├───> [Klik Butang 'Verifikasi']
       │        └──> Masukkan PIN PIC (1234)
       │        └──> Isi Bacaan Ujian + Bukti
       │        └──> Simpan ──> Tarikh baharu (+30 hari) dijana
       │
       ├───> [Klik Butang 'Hantar Vendor']
       │        └──> Masukkan PIN PIC (1234)
       │        └──> Isi No. DO & Tarikh Jangka Kembali
       │        └──> Status bertukar ke 'Di MeTCaL'
       │
       └───> [Klik Butang 'Amaran']
                └──> Pilih Alatan Luput / Hampir Luput
                └──> Hantar Notifikasi Peringatan via WhatsApp / Emel
```

---

## 6. Kriteria Penerimaan (*Acceptance Criteria*)

1. **Integriti Data:** Semua 104 alatan makmal (Batch 1, Batch 2, Fume Hood, dan Ketuhar) dimuatkan dengan tepat mengikut dokumen asal makmal.
2. **Kesesuaian Paparan:** Sistem boleh digunakan dengan lancar pada skrin komputer meja makmal, tablet pemeriksaan, dan telefon pintar staf.
3. **Ketepatan Pengiraan Tarikh:** Formula pengiraan baki hari sentiasa tepat berbanding tarikh rujukan sistem.
4. **Keselamatan Alatan Gagal:** Alatan yang ditandai *Fail* dalam verifikasi atau berstatus *BAD* (contohnya OV11) tidak boleh dilabelkan sebagai *Aktif*.

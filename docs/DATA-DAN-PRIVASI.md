# Polisi Data & Privasi (Data & Privacy)

Dokumen ini menerangkan pengendalian data peribadi dan rekod inventori makmal di dalam aplikasi **CalibraTrack UPKS**. Penerangan ini adalah berdasarkan pelaksanaan kod sebenar aplikasi.

---

## 1. Data yang Dikumpulkan & Diproses

Aplikasi ini memproses maklumat berkaitan operasi dan pengurusan aset makmal:

1. **Maklumat Peralatan Makmal:**
   * Kod ID Peralatan (contoh: `B03`, `FC-12`, `OV11`).
   * Nama instrumen, jenama pengeluar, model, dan nombor siri/nombor aset LGM.
   * Lokasi fizikal bilik makmal (contoh: *B159*, *B048*, *B035*).
   * Tarikh kalibrasi vendor dan tarikh verifikasi dalaman.
   * Spesifikasi metrologi dan titik penentukuran.

2. **Maklumat Pegawai Pengendali (*Person In Charge / PIC*):**
   * Nama pegawai bertugas.
   * Alamat emel rasmi agensi (domain `@lgm.gov.my`).
   * Nombor telefon bimbit untuk tujuan perhubungan amaran notifikasi WhatsApp.

3. **Rekod Transaksi & Ujian Verifikasi:**
   * Tarikh ujian verifikasi dijalankan.
   * Nama juruteknik atau staf pelaksana.
   * Nilai ukuran sebenar instrumen (contoh: gram, suhu darjah Celsius, atau halaju muka fpm).
   * Catatan pemerhatian fizikal dan lampiran fail bukti (format gambar/PDF).

4. **Rekod Logistik Vendor:**
   * Tarikh alatan dihantar keluar ke makmal penentukuran.
   * Nombor rujukan Nota Penghantaran (*Delivery Order / DO*).
   * Nombor sijil kalibrasi dan tarikh tamat tempoh baharu yang disahkan oleh vendor.

---

## 2. Di Mana Data Disimpan?

### Storan Utama: Pelayar Klien Tempatan (*Browser LocalStorage*)
* Secara lalai, **semua data disimpan secara setempat pada peranti pengguna** menggunakan teknologi *Web Storage API (LocalStorage)* pelayar.
* Data tidak dihantar ke mana-mana pelayan pangkalan data pusat milik pihak ketiga tanpa kebenaran pengguna.
* Data kekal di dalam memori pelayar peranti yang sama walaupun sambungan internet dimatikan.

### Storan Pilihan: Google Sheets Milik Pengguna (*User-Configured Storage*)
* Sekiranya pentadbir makmal memasukkan URL *Google Apps Script Web App* pada panel tetapan:
  * Salinan setiap transaksi (log verifikasi, pendaftaran alatan, atau pergerakan vendor) akan dihantar terus ke fail *Google Spreadsheet* dalam akaun Google agensi pentadbir sendiri.
  * Penghantaran berlaku secara terus dari pelayar pengguna ke skrip Google Apps Script menggunakan protokol selamat HTTPS.

---

## 3. Adakah Data Dihantar kepada Model AI atau Perkhidmatan Luar?

* **Tiada Panggilan Model AI Automatik ke atas Data Rutin:**
  Operasi harian CalibraTrack (carian, pengiraan tarikh baki, penapisan alatan, penjanaan pelekat kod QR, dan penyimpanan log) dilaksanakan sepenuhnya oleh logik kod JavaScript pada pelayar peranti anda. Tiada rekod alatan dihantar kepada mana-mana penyedia perkhidmatan kecerdasan buatan (*AI Provider*) secara automatik.
* **Tiada Sistem Penjejak Iklan (*No Trackers / Telemetry*):**
  Aplikasi ini tidak mengandungi kod penjejak pengiklanan pihak ketiga, analitik komersial, atau kuki penjejakan aktiviti peribadi.
* **Pautan Notifikasi WhatsApp:**
  Apabila pengguna menekan butang *Buka WhatsApp*, aplikasi hanya menjana pautan format piawai `https://wa.me/...`. Mesej hanya dihantar apabila pengguna sendiri menekan butang hantar di dalam aplikasi WhatsApp mereka.

---

## 4. Kawalan Akses & Keselamatan Data

* **Kawalan Akses Semasa:**
  * Mod Akses Awam membenarkan paparan maklumat sahaja (*read-only*).
  * Pengubahsuaian data dilindungi menggunakan kata laluan PIN ringkas (PIN PIC: `1234`, PIN Admin: `9999`).
* **Batasan Keselamatan:**
  * Kawalan PIN ini merupakan perlindungan peringkat antaramuka pengguna (*UI-level gatekeeper*) untuk mengelakkan kesilapan klik oleh pelawat awam.
  * Sesiapa yang mempunyai akses fizikal penuh ke komputer makmal dan membuka alat pembangunan pelayar (*Browser Developer Tools*) secara teori boleh melihat data yang tersimpan di dalam LocalStorage komputer tersebut.
  * Untuk premis yang berkongsi komputer awam, pengguna disarankan mengunci komputer meja makmal apabila ditinggalkan tanpa pengawasan.

---

## 5. Cara Memadam Data & Sandaran

* **Menetapkan Semula ke Data Asal (*Reset to Default*):**
  Pengguna boleh memadam sebarang data tambahan atau ujian dengan mengklik ikon **Google Sheets / Tetapan Data** $\rightarrow$ tab **Pengurusan Data** $\rightarrow$ klik **Tetapkan Semula Data**. Tindakan ini akan mengosongkan storan pelayar dan memuatkan semula 104 alatan standard makmal UPKS.
* **Pembersihan Manual Pelayar:**
  Pengguna juga boleh memadam keseluruhan data pada bila-bila masa melalui tetapan pelayar web: *Settings* $\rightarrow$ *Privacy and Security* $\rightarrow$ *Clear Browsing Data (Cookies and other site data)*.

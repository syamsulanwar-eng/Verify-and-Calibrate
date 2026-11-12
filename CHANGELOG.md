# Rekod Perubahan (Changelog)

Semua perubahan dan penambahbaikan pada projek **CalibraTrack UPKS** direkodkan dalam dokumen ini mengikut susunan versi.

---

## [1.3.0] - 2026-11-12

### Ditambah:
* **Integrasi Master List of Oven Calibration (Ketuhar Memmert):**
  * Menambah 6 unit ketuhar baharu daripada dokumen rasmi UPKS:
    * `OV03 (LGM/OV3)`: Memmert ULM-600 (B037 Mainlab, PIC: En. Fandi).
    * `OV05 (LGM/OV5)`: Memmert UFE-500 (B048 Nitrosamine, PIC: En. Syamsul Anwar).
    * `OV06 (LGM/OV6)`: Memmert UM-100 (B048 Nitrosamine, PIC: En. Syamsul Anwar).
    * `OV07 (LGM/OV7)`: Memmert ULM-400 (B048 Nitrosamine, PIC: En. Iswardi).
    * `OV09 (LGM/OV9)`: Memmert UM-100 (GF/R001 Sg Buloh, PIC: En. Zaidi).
    * `OV11 (LGM/OV11)`: Memmert UFE-500 (B039 Spectroscopy, PIC: En. Noorhisham).
  * Menandakan `OV11` dengan status amaran **BAD / ROSAK** (*Out of Service*) mengikut penandaan warna merah dokumen asal berserta log kegagalan suhu.
* **Penapis Tab Segmen Baharu:**
  * Menambah butang penapis terus **Ketuhar / Oven (11)** pada bar carian utama.
* **Pautan Dokumen Asal PDF:**
  * Menambah pautan terus untuk membuka fail dokumen rasmi `2026_Oven_Periodic_Verification1_5ccc33c2.pdf` yang disediakan oleh En. Mohd Fandi Bin Mohd Sukri.

### Dikemas Kini:
* Menyelaraskan tarikh penentukuran vendor MeTCaL 2026 sebenar bagi unit ketuhar aktif (`OV01`, `OV02`, `OV04`, `OV08`, `OV10`) dengan tempoh sah sehingga Oktober/November 2027.
* Menaik taraf jumlah inventori keseluruhan sistem kepada **104 peralatan**.
* Menaik taraf skema storan pelayar ke versi `v5` bagi memastikan data ketuhar dimuatkan secara automatik.

---

## [1.2.0] - 2026-11-12

### Ditambah:
* **Integrasi 19 Kebuk Wasap (Fume Hood / Fume Cupboard):**
  * Menambah unit `FC-01` hingga `FC-20` (FH/01 hingga FH/18 serta FC-19 dan FC-20) daripada dokumen *2026 Fumehood - Periodic Verification*.
  * Menambah pemetaan makmal UPKS 1 (B159), Makmal Kromatografi (B033), Makmal Serbuk & Nitrosamine (B048/B050), BKPT Prep Room, dan Bilik Staf UPKS (B123).
* **Rekod Halaju Muka Ekzos (*Face Velocity*):**
  * Menambah log verifikasi bulanan berasaskan piawaian JKKP/DOSH & ASHRAE 110 ($\ge 100\text{ fpm}$).
  * Catatan amaran pemantauan khas pada unit `FC-04` dan `FC-18` yang pernah mengalami isu aliran angin blower.
* **Penyelarasan Antaramuka:**
  * Butang penapis segmen pantas **Kebuk Wasap (19)**.
  * Pautan terus ke fail dokumen asal `2026_Fumehood_-_Periodic_Verification_101020251_b28c60f6.pdf`.

---

## [1.1.0] - 2026-11-11

### Ditambah:
* **Penjejakan Inventori Lengkap MeTCaL 2026 (79 Alatan):**
  * 57 alatan Fasa 1 (*Batch 1*) merangkumi neraca analitikal, mikropipet, relau, dan perakam suhu bilik.
  * 22 alatan Fasa 2 (*Batch 2*) termasuk alatan yang sedang berada di makmal MeTCaL Malaysia Sdn Bhd.
* **Log Verifikasi Bulanan 30-Hari (FR-002 Option B):**
  * Borang merekod nilai bacaan sebenar, status lulus/gagal, dan muat naik lampiran bukti gambar/PDF.
* **Modul Logistik Vendor (FR-003):**
  * Merekod nombor rujukan DO, tarikh jangka kembali, dan pendaftaran nombor sijil kalibrasi baharu.
* **Pusat Amaran WhatsApp & Emel Rasmi (FR-004):**
  * Templat notifikasi siap tulis mengikut format ISO/IEC 17025.
* **Pelekat Kod QR Fizikal (FR-005):**
  * Penjanaan pelekat sedia cetak untuk ditampal pada instrumen di lantai makmal.
* **Kawalan Akses Keselamatan Berasaskan PIN (FR-006):**
  * PIN `1234` untuk tindakan pegawai PIC dan PIN `9999` untuk pentadbir makmal.
* **Integrasi Google Apps Script (FR-007):**
  * Penyegerakan webhook ke fail Google Sheets dengan sokongan antrian luar talian (*offline queue*).

---

## [1.0.0] - 2026-11-10

### Ditambah:
* Struktur asas aplikasi CalibraTrack berasaskan React 19, Vite, Tailwind CSS, dan TypeScript.
* Papan pemuka asas inventori makmal berasaskan keperluan PRD asal `Equipment_Calibration___Verification_PRD_38d8d1cd.pdf`.

# Status Semasa & Pelan Hala Tuju (Status & Roadmap)

Dokumen ini merekodkan status sebenar ciri-ciri aplikasi CalibraTrack UPKS secara telus dan objektif. Status dibahagikan dengan jelas antara perkara yang telah diuji, perkara yang belum disahkan di luar persekitaran setempat, dan perancangan masa depan tanpa mereka-reka tarikh siap (*no fabricated deadlines*).

---

## 1. Ringkasan Status Mengikut Ciri

| Ciri / Komponen | Status Pembangunan | Status Ujian | Catatan Operasi |
|---|---|---|---|
| **Papan Pemuka 104 Alatan Makmal** | Sudah Dibina | **Telah Diuji** | Disahkan berfungsi dengan 104 alatan (Batch 1, Batch 2, 19 Kebuk Wasap, 11 Ketuhar Memmert). |
| **Carian Teks & Penapis Segmen Pantas** | Sudah Dibina | **Telah Diuji** | Penapis *Semua*, *Batch 1*, *Batch 2*, *Kebuk Wasap*, dan *Ketuhar / Oven* diuji dan menapis data dengan tepat. |
| **Log Verifikasi Bulanan (Option B)** | Sudah Dibina | **Telah Diuji** | Mengira tarikh seterusnya (+30 hari), mengemaskini status Aktif/Gagal, dan menyimpan sejarah log. |
| **Penjejakan Vendor MeTCaL Keluar/Masuk** | Sudah Dibina | **Telah Diuji** | Menukar status instrumen kepada *Out for Calibration* dan mengembalikan status ke *Active* apabila sijil didaftarkan. |
| **Penjanaan Pelekat Kod QR & Cetakan** | Sudah Dibina | **Telah Diuji** | Kod QR berasaskan SVG dijana tepat mengikut ID alatan dan reka letak cetakan berfungsi tanpa butang web. |
| **Pusat Amaran WhatsApp & Emel** | Sudah Dibina | **Telah Diuji** | Pautan *click-to-chat* WhatsApp dan pautan *mailto* emel menjana format mesej yang lengkap. |
| **Kawalan Keselamatan PIN (PIC & Admin)** | Sudah Dibina | **Telah Diuji** | PIN `1234` (PIC) dan `9999` (Admin) menyekat tindakan edit tanpa kebenaran. |
| **Penyimpanan Tempatan (*LocalStorage*)** | Sudah Dibina | **Telah Diuji** | Data kekal dalam pelayar selepas muat semula laman dan menyokong fungsi *Reset to Default*. |
| **Penyegerakan Google Sheets (Apps Script)** | Sudah Dibina | **Belum Disahkan** | Logik pengaturcaraan dan fungsi penghantaran data webhook sedia ada, namun memerlukan URL sebenar daripada akaun Google Sheets pengguna untuk mengesahkan sambungan luaran. |
| **Sistem Log Masuk Pengguna Sebenar (SSO)** | Belum Dibina | Belum Diuji | Buat masa ini menggunakan kawalan PIN setempat (*client-side gatekeeper*), bukan pengesyoran log masuk akaun korporat atau Active Directory. |
| **Pangkalan Data Awan Berpusat (PostgreSQL/SQL)** | Belum Dibina | Belum Diuji | Penyimpanan utama berasaskan storan pelayar peranti pengguna (*browser-local*). |

---

## 2. Isu Diketahui & Batasan Semasa (*Known Limitations*)

1. **Penyimpanan Berasaskan Pelayar (*Client-Side LocalStorage*):**
   * Sekiranya staf makmal menggunakan komputer atau pelayar berbeza, perubahan yang dibuat pada komputer A tidak akan terpapar secara automatik pada komputer B melainkan penyegerakan Google Sheets dikonfigurasikan.
2. **Pembersihan Data Pelayar (*Cache Clear*):**
   * Sekiranya pengguna membersihkan storan pelayar (*Clear All Browsing Data*), data alatan yang ditambah secara manual akan terpadam dan kembali kepada data sampel asal (104 instrumen). Pengguna disarankan menggunakan Google Sheets sebagai sandaran luar.
3. **Kawalan PIN Bersifat Antaramuka (*UI-Level Gatekeeper*):**
   * Pengesahan PIN direka untuk mengelakkan kesilapan staf awam menekan butang edit. Ia bukan sistem keselamatan tahap ketenteraan (*enterprise-grade authentication*).

---

## 3. Pelan Hala Tuju Pembangunan (*Roadmap*)

Berikut ialah perancangan penambahbaikan yang dikenal pasti untuk pertimbangan fasa seterusnya mengikut keutamaan fungsi:

### Fasa A: Pengukuhan Integrasi Google Sheets (Keutamaan Terdekat)
* [ ] Membantu pentadbir menguji penyambungan langsung (*live test*) Google Apps Script Web App dengan fail spreadsheet sebenar LGM.
* [ ] Menambah paparan status petunjuk penyegerakan yang lebih jelas (contoh: masa kali terakhir data disegerakkan).

### Fasa B: Sokongan Luar Talian & Aplikasi Mudah Alih (PWA)
* [ ] Menambah sokongan *Progressive Web App (PWA)* supaya aplikasi boleh dipasang seperti aplikasi natif pada telefon pintar juruteknik makmal semasa rondaan lantai ujian.
* [ ] Mengimbas kod QR fizikal secara langsung menggunakan kamera peranti (*camera scanner*).

### Fasa C: Pengesahan & Pangkalan Data Berpusat (Pilihan Jangka Panjang)
* [ ] Pilihan menyambungkan sistem ke pangkalan data terpusat (contohnya PostgreSQL / Cloud SQL) bagi makmal yang memerlukan perkongsian data langsung antara berbilang komputer tanpa bergantung kepada Google Sheets.
* [ ] Integrasi log masuk akaun emel rasmi agensi (Single Sign-On / SSO) bagi menggantikan kata laluan PIN ringkas.

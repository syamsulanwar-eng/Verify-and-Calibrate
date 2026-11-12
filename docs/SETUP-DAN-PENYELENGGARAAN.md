# Panduan Pemasangan & Penyelenggaraan (Setup & Maintenance)

Dokumen ini disediakan untuk pembangun perisian, pentadbir sistem maklumat (IT), atau sesiapa sahaja yang ingin menjalankan kod sumber **CalibraTrack UPKS** pada komputer tempatan (*local machine*) atau pelayan agensi.

---

## 1. Keperluan Sistem (*Prerequisites*)

Sebelum memulakan, pastikan persekitaran komputer anda mempunyai perisian asas berikut:

* **Node.js:** Versi **20.x atau 22.x LTS** ke atas ([Muat turun Node.js](https://nodejs.org/)).
* **npm:** Versi 10.x ke atas (didatangkan bersama pemasangan Node.js).
* **Git:** Untuk memuat turun kod sumber dari repositori ([Muat turun Git](https://git-scm.com/)).
* **Pelayar Web Moden:** Google Chrome, Microsoft Edge, Mozilla Firefox, atau Safari versi terkini.

---

## 2. Langkah Menjalankan Projek Secara Tempatan

### Langkah 1: Muat Turun Kod Sumber
Klon repositori ini atau ekstrak fail ZIP projek ke dalam komputer anda:
```bash
git clone <URL_REPOSITORY_ANDA>
cd calibratrack-upks
```

### Langkah 2: Memasang Pakej Kebergantungan (*Dependencies*)
Jalankan arahan berikut di dalam terminal untuk memuat turun semua pustaka yang diperlukan:
```bash
npm install
```
*Tujuan:* Arahan ini membaca fail `package.json` dan memasang pustaka teras seperti React, Vite, Tailwind CSS, dan Lucide Icons ke dalam direktori `node_modules`.

### Langkah 3: Konfigurasi Pemboleh Ubah Persekitaran (*Environment Variables*)
Salin fail contoh persekitaran:
```bash
cp .env.example .env
```
Kandungan fail `.env.example`:
```ini
# GEMINI_API_KEY: Kunci API Gemini (Pilihan sekiranya modul analisis pintar diaktifkan)
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: Alamat URL hos aplikasi (Digunakan untuk pautan kendiri dan pratonton)
APP_URL="http://localhost:3000"
```
*Nota:* Untuk operasi inventori harian, aplikasi ini berfungsi sepenuhnya walaupun tanpa kunci API luaran.

### Langkah 4: Memulakan Pelayan Pembangunan (*Dev Server*)
Jalankan arahan pembangunan:
```bash
npm run dev
```
Terminal akan memaparkan output seperti berikut:
```text
  VITE v8.3.0  ready in 250 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://0.0.0.0:3000/
```
Buka pelayar web anda dan layari: `http://localhost:3000`.

---

## 3. Senarai Arahan Skrip (*Available Scripts*)

Di dalam fail `package.json`, beberapa arahan tersedia untuk penyelenggaraan kod:

| Arahan Terminal | Tujuan & Kegunaan |
|---|---|
| `npm run dev` | Menjalankan pelayan pembangunan tempatan pada port `3000` dengan sokongan kemas kini pantas. |
| `npm run build` | Mengompilasi dan mengoptimumkan kod sumber TypeScript kepada fail statik HTML/JS/CSS di dalam folder `dist/` untuk kegunaan pengeluaran (*production*). |
| `npm run preview` | Menguji paparan fail binaan `dist/` secara setempat sebelum dimuat naik ke pelayan sebenar. |
| `npm run lint` | Menjalankan semakan sintaks dan ketepatan jenis data TypeScript (`tsc --noEmit`) bagi memastikan tiada ralat kod tersembunyi. |
| `npm run clean` | Memadamkan direktori `dist/` untuk memastikan proses binaan baharu bermula daripada keadaan bersih. |

---

## 4. Konfigurasi Google Apps Script (Integrasi Sandaran Google Sheets)

CalibraTrack menyediakan sokongan penyegerakan dua hala ke Google Sheets tanpa kos pelayan:

1. Buka fail **Google Spreadsheet** baharu di akaun Google agensi anda.
2. Di menu atas Google Sheets, klik **Extensions** $\rightarrow$ **Apps Script**.
3. Di dalam editor Apps Script, padam sebarang kod sedia ada dan tampal templat kod rasmi CalibraTrack (templat sedia salin boleh didapati di dalam aplikasi melalui butang **Google Sheets** $\rightarrow$ tab **Skrip Google Sheets** atau daripada fail `src/services/storageService.ts`).
4. Klik butang **Deploy** $\rightarrow$ **New deployment**.
5. Pilih jenis **Web app**:
   * *Description:* `CalibraTrack Web App Sync`
   * *Execute as:* **Me (emel anda)**
   * *Who has access:* **Anyone**
6. Klik **Deploy** dan berikan kebenaran capaian (*Authorize access*).
7. Salin **Web App URL** yang terhasil (bermula dengan `https://script.google.com/macros/s/.../exec`).
8. Di dalam aplikasi CalibraTrack, klik butang **Google Sheets**, masukkan URL tersebut pada medan yang disediakan, dan aktifkan **Auto-Segerak**.

---

## 5. Kaedah Penggunaan untuk Pengeluaran (*Production Deployment*)

Kerana CalibraTrack dibina sebagai aplikasi satu halaman (*Single Page Application - SPA*) statik berasaskan React:
1. Jalankan `npm run build`.
2. Folder `dist/` yang terhasil mengandungi fail statik lengkap.
3. Folder `dist/` boleh dihoskan pada mana-mana pelayan web seperti:
   * **Nginx / Apache** di pelayan dalaman agensi (Intranet LGM).
   * **Cloud Run / Google Cloud Storage** dengan mod HTTPS selamat.
   * **GitHub Pages** atau **Vercel / Netlify**.

---

## 6. Penyelesaian Masalah Pemasangan (*Installation Troubleshooting*)

* **Ralat `port 3000 already in use`:**  
  Port 3000 sedang digunakan oleh aplikasi lain. Anda boleh menukar port pada fail `vite.config.ts` atau menghentikan proses terdahulu.
* **Ralat `tsc: command not found`:**  
  Pastikan anda telah menjalankan `npm install` terlebih dahulu untuk memuat turun pakej TypeScript ke dalam direktori projek.
* **Penyegerakan Google Sheets memaparkan status "Ralat Rangkaian / Offline":**  
  Pastikan tetapan *Who has access* di Apps Script ditetapkan kepada **Anyone** (bukan *Only myself*), kerana pelayar klien menghantar data terus ke titik akhir (*endpoint*) tersebut.

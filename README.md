# PKK VOKASI USU

**Portal Pendidikan, Kemahasiswaan, dan Kealumnian (PKK) Fakultas Vokasi Universitas Sumatera Utara**

Website resmi pelayanan kemahasiswaan terpadu Fakultas Vokasi USU yang mencakup pengunduhan template surat permohonan mahasiswa (.docx), direktori penerima beasiswa, rekapitulasi prestasi mahasiswa, serta pelacakan alumni (*tracer study*) terintegrasi portal universitas.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Turbopack)
- **UI & Logic**: React 18
- **Styling**: Vanilla CSS (Custom Design System, USU Corporate Color Palette: Pine Green `#005A36` & Amber Gold `#F59E0B`)
- **Animation**: [GSAP](https://greensock.com/gsap/) & [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Upstash Redis](https://upstash.com/) (Serverless REST API)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Session & Role Management)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🌟 Fitur Utama

1. **Surat Permohonan Mahasiswa (`/surat`)**
   - Koleksi 10 berkas template surat permohonan mahasiswa dalam format Microsoft Word (`.docx`).
   - Panduan berkas dan dokumen persyaratan lengkap sebelum pengajuan.

2. **Data Penerima Beasiswa (`/beasiswa`)**
   - Direktori mahasiswa penerima beasiswa terverifikasi: KIP-Kuliah, Bank Indonesia, Djarum Plus, Pemprov Sumut, dan Mitra Industri.
   - Filter cepat berdasarkan program studi dan skema beasiswa.
   - Ekspor data direktori ke format CSV.
   - Mode *read-only* untuk publik, fungsi CRUD eksklusif untuk operator admin.

3. **Direktori Mahasiswa Berprestasi (`/prestasi`)**
   - *Hall of Fame* capaian medali dan penghargaan mahasiswa vokasi tingkat Wilayah, Nasional, hingga Internasional.
   - Rincian inovasi, dosen pembimbing, dan dokumentasi kejuaraan.

4. **Rekapitulasi Tracer Study (`/tracer-study`)**
   - Rekapitulasi 5 kategori status baku lulusan:
     - Bekerja
     - Belum Memungkinkan Bekerja
     - Wiraswasta
     - Melanjutkan Pendidikan
     - Tidak Kerja Tetapi Sedang Mencari Pekerjaan
   - Visualisasi bilah proporsi komparatif dan tabel rekapitulasi resmi.
   - Integrasi pengisian kuesioner pelacakan terpusat melalui portal resmi [SATU USU](https://satu.usu.ac.id/alumni/tracer-study).

5. **Portal Operator & Admin (`/admin/login` & `/kelola`)**
   - Halaman login terpisah dengan otentikasi aman NextAuth.
   - Dashboard kelola data (CRUD) multi-modul untuk Beasiswa, Prestasi, dan Tracer Study.

---

## 🛠️ Instalasi & Menjalankan Aplikasi

1. **Clone repositori**:
   ```bash
   git clone https://github.com/wandacodex/pkkvokasiusu.git
   cd pkkvokasiusu
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**:
   Salin berkas `.env.example` menjadi `.env.local` dan lengkapi konfigurasi database Upstash Redis:
   ```bash
   cp .env.example .env.local
   ```

4. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) pada peramban Anda.

---

## 🏛️ Program Studi Fakultas Vokasi USU (21 Prodi)

### Program Diploma Tiga (D3):
- D3 Akuntansi
- D3 Kesekretariatan
- D3 Keuangan
- D3 Analis Farmasi dan Makanan
- D3 Perpajakan
- D3 Bahasa Inggris
- D3 Bahasa Jepang
- D3 Perpustakaan
- D3 Perjalanan Wisata
- D3 Fisika
- D3 Kimia
- D3 Teknik Informatika
- D3 Metrologi dan Instrumentasi
- D3 Statistika

### Program Sarjana Terapan (D4):
- D4 Perbankan dan Keuangan
- D4 Administrasi Perkantoran Digital
- D4 Akuntansi Sektor Publik
- D4 Statistika
- D4 Kimia Terapan
- D4 Manajemen Bisnis Pariwisata
- D4 Teknologi Rekayasa dan Instrumentasi

---

## 📄 Lisensi
Hak Cipta © 2026 Pendidikan, Kemahasiswaan, dan Kealumnian (PKK) Fakultas Vokasi Universitas Sumatera Utara.

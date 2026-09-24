# Validasi paket desain

Tanggal pemeriksaan: 24 September 2026.

## Ruang lingkup

Pengujian berikut memeriksa **konsistensi dokumen dan CSS pada halaman uji lokal**. Halaman uji bukan situs Vokasi USU dan bukan website tujuan pengguna. Public Sans tidak dimuat pada halaman uji; browser menggunakan fallback. Hasil ini tidak membuktikan kesamaan visual dengan situs sumber, kesiapan seluruh aplikasi, atau kepatuhan WCAG menyeluruh.

## Pemeriksaan statis

| Pemeriksaan | Hasil |
|---|---|
| Dokumen memiliki 32 bagian bernomor 00-31 | Lulus. |
| Satu heading utama dan code fence seimbang | Lulus. |
| Referensi Markdown mempunyai definisi | Lulus; 23 sumber. |
| Blok CSS dalam DESIGN.md sama dengan tokens.css | Lulus. |
| Parsing stylesheet dan deklarasi CSS | Lulus; tidak ditemukan error sintaks oleh parser. |
| Referensi variabel CSS | Lulus; variabel focal point menggunakan fallback per aset. |
| Sintaks JavaScript audit melalui Node | Lulus. |
| Kedua JSON valid | Lulus. |
| Enam kandidat aset memiliki status izin dan readiness yang jujur | Lulus; semuanya belum ditandai siap produksi. |
| Berkas foto atau font dalam paket | Tidak disertakan. |

## Pengujian browser pada fixture lokal

Chromium lokal digunakan untuk menguji token, layout dasar, tautan, tombol, input, panel, dan footer. Fixture tidak memuat API, CMS, foto resmi, atau dropdown produksi.

| Viewport CSS px | Lebar container terukur | Overflow horizontal halaman |
|---|---|---|
| 320 | 288 px | Tidak ditemukan pada fixture. |
| 375 | 343 px | Tidak ditemukan pada fixture. |
| 390 | 358 px | Tidak ditemukan pada fixture. |
| 430 | 398 px | Tidak ditemukan pada fixture. |
| 768 | 720 px | Tidak ditemukan pada fixture. |
| 1024 | 976 px | Tidak ditemukan pada fixture. |
| 1280 | 1216 px | Tidak ditemukan pada fixture. |
| 1440 | 1280 px | Tidak ditemukan pada fixture. |
| 1920 | 1280 px | Tidak ditemukan pada fixture. |

Tinggi tombol pada fixture sekitar 45,17 px, melampaui baseline 44 px. Fokus input menghasilkan outline solid 3 px. Teks tombol kuning tetap gelap ketika ditempatkan di footer inverse, sehingga aturan tautan footer tidak menimpa warna label tombol. Emulasi reduced motion menghasilkan durasi transisi tombol 0 detik.

`inspect-reference.js` dijalankan pada fixture lokal dan berhasil mengembalikan viewport, elemen, dan token. Ini **bukan bukti bahwa script sudah dijalankan pada situs Vokasi USU**. Tangkapan fixture desktop dan mobile juga diperiksa; tidak digunakan sebagai screenshot rujukan desain asli.

## Pemeriksaan kontras token

Rasio berikut dihitung dari warna sRGB solid. Transparansi, foto, shadow, anti-aliasing, dan state lain pada implementasi nyata perlu diperiksa tersendiri.

| Foreground | Background | Rasio |
|---|---|---|
| #FFFFFF | #006937 | 6,83:1 |
| #18251E | #FFFFFF | 15,88:1 |
| #536157 | #FFFFFF | 6,53:1 |
| #18251E | #FFC600 | 10,08:1 |
| #FFFFFF | #FFC600 | 1,58:1 - tidak dipakai untuk teks. |
| #006937 | #F2F6F3 | 6,26:1 |
| #FFFFFF | #0C3B2A | 12,54:1 |
| #748579 | #FFFFFF | 3,91:1 - digunakan untuk border kontrol, bukan body text. |

Acuan ambang ada pada WCAG 2.2: https://www.w3.org/TR/WCAG22/. Rasio warna bukan sertifikasi website.

## Belum diuji atau belum terverifikasi

CSS computed, screenshot penuh, font runtime, breakpoint, ukuran elemen, dan state interaksi pada situs Vokasi live **belum diaudit melalui browser**. Halaman serta panduan resmi dibaca sebagai sumber, bukan diukur sebagai rekonstruksi piksel.

Belum ada verifikasi penggunaan ulang foto/logo, ukuran asli berkas aset, kinerja jaringan, lintas-browser penuh, screen reader, alur formulir produksi, autentikasi, integrasi API, skor Lighthouse, ataupun data lapangan. Checklist website dalam DESIGN.md tetap terbuka sampai implementasi nyata diuji.

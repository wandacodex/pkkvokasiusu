# Vokasi USU Reference-Informed Design Kit

Panduan berbahasa Indonesia untuk menggunakan identitas dan pola informasi Vokasi USU sebagai acuan website lain. Tanggal peninjauan sumber: 24 September 2026.

## Isi paket

| Berkas | Penggunaan |
|---|---|
| `DESIGN.md` | Dokumen utama dengan 32 bagian, sumber, kontrak komponen, token CSS, responsive, fotografi, dan checklist. |
| `tokens.css` | Token dan fondasi opsional yang sama dengan blok CSS dalam dokumen utama. Bukan CSS asli situs. |
| `asset-manifest.json` | Enam kandidat aset resmi beserta sumber, konteks, dan pemeriksaan yang masih dibutuhkan. Tidak berisi gambar. |
| `sources.json` | Registri 23 sumber untuk memudahkan penelusuran. |
| `inspect-reference.js` | Script audit computed styles yang dapat dijalankan manual pada halaman publik. Belum digunakan mengukur situs live dalam paket ini. |
| `VALIDATION.md` | Pemeriksaan konsistensi paket dan batas pengujian. Bukan sertifikat website. |

## Mulai menggunakan

Letakkan `DESIGN.md` di root proyek. Tentukan apakah website tujuan merupakan unit USU yang berwenang, proyek mahasiswa, atau organisasi lain. Untuk organisasi lain, gunakan pola dan disiplin desainnya tanpa menyiratkan afiliasi USU.

Baca bagian 00 tentang penanda bukti: `[WEB]`, `[BRAND]`, `[ASSET]`, `[ADAPT]`, dan `[CHECK]`. **Ukuran layout, breakpoint, radius, dan timing merupakan baseline adaptasi, bukan hasil pengukuran CSS asli.** Pedoman warna memuat beberapa nilai RGB dan HEX yang berbeda; keputusan baseline dijelaskan pada bagian 04.

Gunakan `tokens.css` secara selektif, terutama bila proyek sudah memiliki reset atau design system. CSS memakai prefix `usu` untuk menghindari nama komponen yang terlalu umum, tetapi aturan `body`, heading, serta `:root` tetap global. Scope aturan atau petakan variabel ke sistem yang sudah ada bila diperlukan. Memasukkan file CSS saja tidak mengimplementasikan navigasi, validasi, API, atau galeri.

Public Sans dideklarasikan sebagai keluarga font, tetapi tidak dimuat oleh kit. Gunakan sumber font yang disetujui pengelola proyek. **Tidak ada berkas font yang disertakan.** Gambar juga belum disalin ke folder lokal; path di manifest hanyalah saran. Periksa konteks, izin, dimensi asli, dan crop sebelum publikasi.

## Prompt untuk AI coding agent

```text
Baca DESIGN.md sebagai acuan desain proyek ini. Audit frontend yang ada,
kemudian refactor UI/UX secara bertahap tanpa merusak rute, API, autentikasi,
validasi, atau fitur yang sudah berfungsi.

Terapkan identitas, token, tipografi, hierarki editorial, komponen, dan
responsive dari dokumen. Sesuaikan logo, nama, menu, dan isi dengan website
ini; jangan menganggap website ini resmi milik USU tanpa dasar.

Hormati penanda [WEB], [BRAND], [ASSET], [ADAPT], dan [CHECK]. Jangan menyebut
ukuran adaptasi sebagai hasil pengukuran situs sumber. Gunakan anti-slop
sebagai filter kualitas, bukan alasan mengganti desain menjadi template
SaaS atau melarang setiap kartu/gradien secara membabi buta.

Gunakan foto nyata yang sumber, konteks, dan izin pemakaiannya sudah
terverifikasi. Jangan membuat angka, akreditasi, testimoni, foto kampus,
atau klaim afiliasi. Jangan menganggap kandidat dalam asset-manifest.json
sudah siap dipublikasikan.

Implementasikan state, fungsi tombol, navigasi keyboard, dan responsive.
Uji viewport yang ditentukan pada DESIGN.md. Laporkan perubahan,
perbedaan yang disengaja, hasil tes nyata, dan hal yang belum diuji.
```

## Meningkatkan kemiripan terhadap website sumber

Ikuti bagian 27 bila proyek membutuhkan kesetiaan lebih dekat ke tampilan live. Ambil screenshot dan computed styles pada viewport serta state yang sama, kemudian perbarui token berdasarkan pengukuran nyata. `inspect-reference.js` adalah alat bantu opsional; baca kodenya sebelum menjalankan di console. Tidak memerlukan login, tidak membaca cookie atau storage, dan tidak mengirim hasil ke layanan lain.

Audit tersebut belum dilakukan pada situs live dalam paket ini. Keberadaan script tidak berarti screenshot atau CSS asli sudah dikumpulkan.

## Status sumber

Rujukan utama adalah halaman publik Vokasi USU, lembar pedoman identitas visual USU, foto pada host konten resmi, WCAG 2.2, dan repositori anti-slop. Detail URL tercantum dalam `DESIGN.md` serta `sources.json`. Keberadaan aset di server resmi tidak menyatakan hak penggunaan ulang secara otomatis.

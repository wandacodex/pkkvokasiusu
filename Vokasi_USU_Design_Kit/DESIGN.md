# DESIGN.md - Sistem Desain Web Berbasis Referensi Fakultas Vokasi USU

Versi: 1.0.0  
Tanggal peninjauan sumber: 24 September 2026  
Referensi utama: https://vokasi.usu.ac.id/id  
Bahasa antarmuka utama: Bahasa Indonesia  
Tujuan: acuan desain yang dapat digunakan kembali pada website lain, bukan salinan konten institusi tanpa penyesuaian.

> **Status akurasi:** dokumen ini menggabungkan struktur konten situs yang berhasil dibaca, pedoman identitas visual resmi USU, gambar resmi yang berhasil dibuka, dan spesifikasi implementasi baru. Ini **bukan hasil ekstraksi CSS lengkap atau rekonstruksi pixel-perfect** situs Vokasi USU. Ukuran komponen, breakpoint, radius, timing animasi, dan penempatan warna semantik di bawah merupakan keputusan implementasi, kecuali ditandai lain. Belum ada pemeriksaan visual browser terhadap seluruh halaman sumber pada desktop dan mobile.

## Peta isi

| Kebutuhan | Bagian |
|---|---|
| Memahami bukti dan konteks pemakaian | [00. Panduan pembacaan](#00-cara-membaca-dan-menggunakan-dokumen), [02. Temuan](#02-temuan-yang-benar-benar-terverifikasi), [03. Merek](#03-batas-penerapan-merek-dan-tingkat-kemiripan) |
| Identitas visual | [04. Warna](#04-warna-sumber-dan-disiplin-konversi), bagian 05-09: font, grid, bentuk, logo, dan fotografi |
| Halaman dan komponen | Bagian 10-19: navigasi, hero, editorial, berita, agenda, program, fasilitas, profil, dan footer |
| Formulir dan kualitas interaksi | Bagian 20-24: state, dashboard, responsive, aksesibilitas, motion, dan performa |
| Acuan implementasi | [25. Kontrak data](#25-kontrak-konten-dan-pemisahan-identitas-adapt), [26. CSS](#26-token-css-dan-fondasi-implementasi-adapt) |
| Pengukuran dan penerimaan | Bagian 27-30: audit browser, anti-slop, checklist, dan komposisi halaman |
| Menelusuri sumber | [31. Referensi](#31-catatan-sumber-dan-batas-bukti) |

## 00. Cara membaca dan menggunakan dokumen

Dokumen ini adalah sumber arah visual, kontrak komponen, dan kriteria penerimaan desain. Dokumen tidak menetapkan framework, tidak mengubah kebutuhan bisnis, dan tidak menyatakan website tujuan berafiliasi dengan USU.

| Penanda | Makna | Cara memperlakukannya |
|---|---|---|
| **[WEB]** | Informasi yang terbaca pada halaman resmi | Cocok untuk struktur informasi; bukan bukti ukuran atau posisi piksel. |
| **[BRAND]** | Ketentuan yang terlihat pada pedoman identitas visual resmi | Menjadi referensi identitas; tetap periksa versi panduan yang disetujui pemilik merek. |
| **[ASSET]** | Gambar resmi berhasil dibuka dalam peninjauan ini | Asal gambar terverifikasi; hak penggunaan ulang dan ukuran file asli belum otomatis terverifikasi. |
| **[ADAPT]** | Keputusan desain yang disusun untuk website tujuan | Bisa langsung menjadi baseline implementasi, tetapi tidak boleh disebut CSS asli Vokasi USU. |
| **[CHECK]** | Masih perlu diukur atau dikonfirmasi | Tidak boleh diubah menjadi klaim pasti tanpa bukti baru. |

**Aturan default:** semua angka teknis dalam dokumen ini berstatus **[ADAPT]**, kecuali secara eksplisit diberi sumber **[BRAND]** atau bukti pengukuran baru. Referensi [S01] dan seterusnya tersedia pada bagian sumber.

Untuk proyek yang sudah berjalan, pertahankan rute, API, autentikasi, validasi, konten sah, dan proses bisnis. Penerapan sistem desain tidak berarti mengganti semuanya dari nol. Untuk proyek baru, gunakan hanya modul yang diperlukan pengguna; jangan membuat modul kosong agar halaman terlihat panjang.

## 01. Arah desain dalam satu halaman

**Karakter:** institusional, akademik, berorientasi informasi, modern tetapi tidak bergaya startup teknologi. Identitas dibangun melalui tipografi yang jelas, keluarga warna hijau, aksen kuning yang terkontrol, fotografi kegiatan nyata, dan modul informasi yang mudah dibaca.

**Tujuan pengalaman:** pengunjung cepat memahami identitas pengelola, menemukan informasi yang dicari, membedakan berita dari pengumuman atau agenda, dan menyelesaikan tindakan tanpa menebak fungsi kontrol.

| Bidang | Arah yang ditetapkan |
|---|---|
| Identitas | Mengikuti konteks pemilik website; tidak mengganti nama institusi tujuan dengan nama Vokasi USU. |
| Tipografi | Public Sans sebagai pilihan berbasis pedoman USU; fallback sistem yang netral. |
| Warna | Hijau sebagai identitas utama, putih sebagai ruang baca, kuning sebagai aksen terbatas. |
| Komposisi | Editorial dan modular; informasi tidak semuanya dibungkus kartu. |
| Fotografi | Dokumenter, sesuai isi, memiliki sumber, dan tidak diganti foto kampus rekaan. |
| Detail | Border tipis, radius kecil pada kontrol, bayangan hanya untuk lapisan yang benar-benar mengambang. |
| Interaksi | Stabil dan dapat diprediksi; tidak ada animasi dekoratif yang mengganggu pembacaan. |
| Adaptasi | Layout mengikuti kebutuhan halaman tujuan, bukan memaksakan seluruh struktur fakultas. |

**Dial [ADAPT]: ENERGY 2 / RHYTHM 2 / MOTION 1.** Energi berasal dari foto dan identitas warna; ritme berasal dari pergantian berita, daftar, direktori, dan panel informasi; gerak dibatasi pada feedback interaksi. Penamaan dial mengikuti mekanisme anti-slop, sementara nilainya merupakan keputusan desain dokumen ini. [S15]

## 02. Temuan yang benar-benar terverifikasi

**[WEB]** Beranda memuat navigasi institusi, pilihan bahasa, pencarian, berita, pengumuman, agenda, sambutan, profil, program pendidikan, aktivitas, fasilitas, media sosial, dan footer. Dua kelompok navigasi dibedakan secara semantik: akses berdasarkan audiens dan navigasi berdasarkan topik. Urutan tampilan dan ukuran setiap blok belum diukur. [S01]

**[WEB]** Halaman pendidikan mengelompokkan program Diploma dan Sarjana Terapan. Halaman berita menyediakan pencarian, tahun rilis, dan pagination. Direktori fasilitas menyediakan pencarian serta filter program studi. Ini menjadi referensi pola direktori dan penemuan informasi, bukan bukti tata letak CSS. [S02] [S03] [S04]

**[BRAND]** Pedoman identitas USU menetapkan Public Sans, menyediakan palet formal dan kasual, serta mengatur penggunaan logo dan elemen grafis. Pedoman tidak otomatis membuktikan font yang sedang dirender pada setiap elemen situs Vokasi. [S06] [S07] [S08] [S09]

**[ASSET]** Foto CodeStudio, gedung aula, beberapa dokumentasi kegiatan, dan aset logo putih berhasil dibuka dari domain konten resmi. Aset kegiatan dalam daftar bukan klaim bahwa gambar tersebut merupakan hero beranda saat ini. [S16] [S17] [S18] [S19] [S20] [S21]

## 03. Batas penerapan merek dan tingkat kemiripan

Pilih salah satu konteks sebelum implementasi. Ini keputusan pemilik proyek, bukan sesuatu yang boleh diasumsikan dari pilihan warna.

| Konteks website tujuan | Yang dipertahankan | Yang disesuaikan |
|---|---|---|
| Website unit USU dengan kewenangan penggunaan merek | Aset resmi yang disetujui, Public Sans, identitas warna, aturan logo | Nama unit, menu, layanan, data, foto, kontak, dan modul sesuai unit. |
| Website mahasiswa atau proyek terkait USU | Bahasa visual yang relevan dan informasi sumber | Status proyek dijelaskan; tidak menyiratkan sebagai portal resmi. |
| Website organisasi lain | Hierarki, keterbacaan, pola direktori, ritme konten, dan disiplin komponen | Logo, nama, foto institusi, kontak, serta palet jika merek tujuan sudah punya panduan. |
| Aplikasi layanan atau dashboard | Token warna, font, bentuk kontrol, feedback, dan kepadatan yang konsisten | Hero besar, sambutan pimpinan, berita kampus, dan footer institusi tidak dipaksakan masuk. |

**Tidak ada jaminan pixel-perfect.** Untuk pekerjaan yang mengharuskan kesamaan langsung dengan situs sumber, tambahkan audit browser pada bagian 27 sebelum membekukan token. Implementasi tidak boleh menggunakan kata "100% sama" hanya karena font dan keluarga warnanya mirip.

## 04. Warna sumber dan disiplin konversi

### 04.1 Palet identitas yang menjadi referensi

Tabel berikut mencatat **nilai RGB yang tercetak pada pedoman**, lalu mengonversinya secara aritmetis ke HEX untuk web. Hasil konversi bukan hasil sampling screenshot dan bukan hasil pembacaan stylesheet. [S07] [S08]

| Kelompok | Nama warna dalam pedoman | RGB tercetak | HEX hasil konversi RGB |
|---|---|---|---|
| Kasual | Hijau, Pantone 349 C | 0, 105, 55 | `#006937` |
| Kasual | Hijau terang, Pantone 361 C | 61, 174, 43 | `#3DAE2B` |
| Kasual | Pantone 583 C | 184, 190, 20 | `#B8BE14` |
| Kasual | Pantone 381 C | 205, 219, 0 | `#CDDB00` |
| Kasual | Jingga, Pantone 137 C | 255, 164, 0 | `#FFA400` |
| Kasual | Kuning, Pantone 7548 C | 255, 198, 0 | `#FFC600` |
| Formal | Hijau, Pantone 364 C | 66, 116, 53 | `#427435` |
| Formal | Emas, Pantone 7406 C | 229, 188, 44 | `#E5BC2C` |
| Formal | Kuning, Pantone 106 C | 255, 242, 85 | `#FFF255` |
| Formal | Hitam | 0, 0, 0 | `#000000` |
| Formal | Merah, Pantone 485 C | 229, 51, 44 | `#E5332C` |

**[CHECK] Ketidaksesuaian pada materi sumber:** beberapa pasangan RGB dan HEX yang dicetak pada halaman panduan tidak ekuivalen. Contohnya, RGB `0,105,55` menghasilkan `#006937`, sedangkan kolom HEX pada lembar kasual terbaca `#006973`. Dokumen ini memakai hasil konversi RGB secara konsisten sebagai **baseline adaptasi**, bukan menyatakan bahwa perbedaan sumber sudah diselesaikan oleh USU. Untuk kesetiaan warna produksi, dahulukan stylesheet yang benar-benar terukur atau token yang disetujui pemilik merek, dan catat alasan perubahan. [S08]

**Logo resmi tidak direkonstruksi dari tabel ini.** Gunakan berkas logo yang benar; jangan mewarnai ulang lambang dengan token UI.

### 04.2 Palet semantik implementasi [ADAPT]

| Token | Nilai | Peran yang dibatasi |
|---|---|---|
| `--usu-brand` | `#006937` | Link utama, tombol primer, aksen heading, identitas antarmuka. |
| `--usu-brand-hover` | `#00562D` | Hover tombol primer. |
| `--usu-brand-active` | `#004423` | Kondisi tombol primer ditekan. |
| `--usu-brand-deep` | `#0C3B2A` | Footer atau bidang institusional gelap. |
| `--usu-brand-bright` | `#3DAE2B` | Ornamen atau highlight sekunder; bukan teks kecil di atas putih. |
| `--usu-accent` | `#FFC600` | Satu penekanan penting, penanda tanggal, atau detail identitas. |
| `--usu-canvas` | `#FFFFFF` | Area baca utama. |
| `--usu-surface` | `#F2F6F3` | Pergantian bagian atau panel informasi ringan. |
| `--usu-surface-muted` | `#F7F8F7` | Area administratif atau tabel yang tenang. |
| `--usu-text` | `#18251E` | Teks utama. |
| `--usu-text-secondary` | `#536157` | Metadata, caption, bantuan formulir. |
| `--usu-border` | `#D7E0D9` | Divider dekoratif dan pemisah kelompok. |
| `--usu-border-strong` | `#748579` | Batas input dan kontrol yang perlu terlihat jelas. |
| `--usu-danger` | `#B42318` | Error nyata atau tindakan destruktif. |
| `--usu-warning` | `#7A4B00` | Peringatan dengan teks penjelas. |
| `--usu-info` | `#315E91` | Informasi sistem jika kategori semantik diperlukan. |

Proporsi awal halaman publik: sekitar 70% permukaan terang, 20% bidang/foto dominan, dan 10% gabungan warna identitas serta aksen. Ini bukan formula luas piksel dan bukan hasil pengukuran situs. Pada dashboard, gunakan lebih sedikit bidang warna penuh agar tabel tetap mudah dibaca.

Warna hijau terang, kuning, dan jingga tidak dipakai bergantian untuk setiap kartu. Status tidak bergantung pada warna saja. Link dalam paragraf memiliki underline atau pembeda nonwarna yang jelas.

### 04.3 Pasangan kontras yang sudah dihitung

Perhitungan memakai luminans relatif sRGB pada pasangan warna solid. Nilai ini tidak mencakup transparansi, foto, hover, seluruh UI, atau kualitas aksesibilitas aplikasi secara keseluruhan.

| Teks | Latar | Rasio sekitar | Pemakaian |
|---|---|---|---|
| `#FFFFFF` | `#006937` | 6.83:1 | Tombol primer. |
| `#18251E` | `#FFFFFF` | 15.88:1 | Teks utama. |
| `#536157` | `#FFFFFF` | 6.53:1 | Metadata. |
| `#18251E` | `#FFC600` | 10.08:1 | Tombol atau label beraksen kuning. |
| `#FFFFFF` | `#FFC600` | 1.58:1 | Tidak dipakai untuk teks. |
| `#006937` | `#F2F6F3` | 6.26:1 | Link pada permukaan lembut. |
| `#FFFFFF` | `#0C3B2A` | 12.54:1 | Teks footer gelap. |

Acuan teks normal minimum 4.5:1, teks besar 3:1, dan batas visual kontrol relevan 3:1 mengikuti WCAG 2.2. Target tidak sama dengan sertifikasi. [S14]

## 05. Tipografi

**[BRAND] Public Sans** digunakan sebagai referensi tipografi institusional dari pedoman USU. [S06] **[CHECK]** Belum diverifikasi melalui computed style atau panel rendered fonts pada website Vokasi yang aktif.

**[ADAPT]** Seluruh UI menggunakan satu keluarga font utama. Hindari menambahkan serif, monospace dekoratif, atau display font lain hanya untuk terlihat lebih unik. Kontras hierarki dibangun dengan ukuran, bobot, panjang baris, dan jarak.

| Peran | Rentang ukuran | Bobot | Line-height | Catatan |
|---|---|---|---|---|
| Display untuk satu hero penting | 32-56 px | 600 | 1.10-1.15 | Bukan default untuk semua halaman. |
| H1 halaman | 32-48 px | 600 | 1.15 | Umumnya satu judul utama yang jelas. |
| H2 bagian | 28-36 px | 600 | 1.20 | Rata kiri pada modul editorial. |
| H3 item atau subbagian | 20-24 px | 600 | 1.25-1.35 | Cukup untuk judul berita dan fasilitas. |
| Lead | 18-20 px | 400 | 1.55 | Satu paragraf pembuka singkat. |
| Body | 16 px | 400 | 1.65 | Tidak diperkecil untuk memaksa layout muat. |
| Navigasi dan label kontrol | 14-16 px | 500-600 | 1.40-1.50 | Tombol tetap memiliki area klik besar. |
| Metadata dan caption | 14 px | 400-500 | 1.50 | Hindari abu-abu terlalu pucat. |

Lebar paragraf panjang dibatasi sekitar `68ch`. Hindari justified text pada artikel web. Judul yang panjang turun baris secara alami, bukan dipotong di halaman detail. Pada daftar ringkas, pemotongan maksimal tiga baris hanya diperbolehkan ketika pengguna tetap dapat membuka judul lengkap dengan mudah.

Letter-spacing body adalah normal. Nama institusi pada lockup mengikuti aset resmi, bukan disalin sebagai heading dengan tracking ekstrem. Penulisan huruf besar penuh dibatasi pada nama atau label yang memang memerlukannya.

File font tidak disertakan dalam paket. Pemuatan Public Sans harus memakai sumber dan konfigurasi font yang disetujui proyek. CSS yang hanya menyebut nama font tidak otomatis mengunduhnya; verifikasi hasil rendering sebelum finalisasi.

## 06. Grid, container, dan skala ruang

### 06.1 Ukuran layout [ADAPT]

| Parameter | Baseline |
|---|---|
| Lebar konten maksimum | `80rem` / 1280 px pada root 16 px. |
| Gutter kiri-kanan, layar kurang dari 768 px | 16 px. |
| Gutter pada 768-1279 px | 24 px. |
| Gutter pada 1280 px ke atas | 32 px sebelum batas max-width. |
| Gap antarblok | 16 px mobile, 24 px tablet, 32 px desktop lebar. |
| Grid konseptual | 4 kolom mobile, 8 tablet, 12 desktop; implementasi dapat memakai fraction grid sederhana. |
| Komposisi editorial | 7:5 atau 1:1 untuk dua blok yang memang berbeda peran. |
| Lebar artikel | `68ch`, satuan berdasarkan lebar glyph angka nol; bukan hitungan karakter literal. |

Pada viewport 1440 px, container 1280 px menghasilkan margin sekitar 80 px per sisi. Pada viewport 390 px dengan gutter 16 px, area isi menjadi 358 px. Ini konsekuensi rumus implementasi, bukan ukuran yang diklaim ditemukan di situs sumber.

### 06.2 Jarak dan ritme [ADAPT]

Gunakan skala dasar `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96` px. Jarak berdekatan memiliki hubungan: label ke input 8 px; judul item ke metadata 8-12 px; judul bagian ke konten 24-32 px; antarseksi 40-80 px.

Tidak semua bagian memakai padding identik. Direktori atau pengumuman lebih rapat; foto utama dan pembuka bagian boleh lebih lega. Pertahankan sumbu kiri yang konsisten walaupun komposisi berubah.

Ruang kosong bukan alasan untuk menambahkan statistik, logo partner, atau blok promosi rekaan. Bila konten sedikit, gunakan halaman lebih pendek dengan struktur yang tuntas.

## 07. Bentuk, border, elevasi, dan ikon

Radius default foto editorial adalah 0 px. Tombol dan input menggunakan 4 px. Panel menggunakan 0-4 px sesuai struktur. Dialog boleh memakai 8 px. Lingkaran hanya untuk kontrol yang memang berbentuk lingkaran, bukan agar seluruh UI tampak membulat.

Divider memakai 1 px. Border ringan membagi konten, sedangkan input memakai border yang lebih kuat. Bayangan kartu statis tidak menjadi default. Dropdown atau dialog dapat memakai bayangan `0 8px 24px rgb(12 59 42 / 12%)` karena benar-benar berada di lapisan lain.

Ikon antarmuka hanya membantu fungsi: cari, menu, tutup, panah, waktu, lokasi, unduh, dan status. Tetapkan ukuran visual 18-24 px serta area klik minimal 44 px untuk tombol ikon. Tidak perlu ikon di setiap menu atau kartu.

Ikon dekoratif diberi `aria-hidden="true"`. Ikon tanpa teks pada kontrol harus memiliki accessible name. Jangan membiarkan nama glyph seperti `arrow_forward_ios` muncul sebagai teks ketika font ikon gagal dimuat. Penggunaan SVG lokal yang telah disetujui merupakan pilihan implementasi, bukan klaim tentang library situs sumber.

## 08. Logo dan elemen grafis identitas

**[BRAND]** Panduan logo memuat larangan mengubah proporsi, komposisi, warna, rotasi, serta menambahkan efek pada logo. Panduan juga menetapkan ruang bebas minimum sebesar seperempat tinggi lambang. Gunakan ukuran ruang bebas berdasarkan aset logo yang benar, bukan seperempat tinggi seluruh header. [S10] [S11]

**[ADAPT]** Tinggi visual lockup pada header dapat dimulai dari 44-56 px mobile dan 56-72 px desktop, kemudian disesuaikan dengan panjang nama unit. Biarkan lebar mengikuti rasio asli. Pakai varian putih pada permukaan gelap dan varian resmi berwarna pada permukaan terang sesuai persetujuan pemilik merek. Jangan melakukan CSS filter untuk membuat varian logo palsu.

**[BRAND]** Pedoman elemen grafis menjelaskan sumber motif dari pengajaran, penelitian, pengabdian, Danau Toba, Ulos, dan Melayu; palet serta contoh penerapan grafis juga tersedia. [S09] [S12] [S13]

**[ADAPT]** Untuk website tujuan yang berwenang memakai identitas ini, gunakan maksimal satu keluarga motif per konteks bagian. Contoh penempatan: ornamen kecil di samping heading atau pola pada satu bidang promosi. Hindari pola padat di belakang paragraf panjang. Motif tidak menggantikan gambar kegiatan nyata.

Gradien tidak otomatis dilarang: pedoman grafis USU juga menampilkan gradien. Yang tidak digunakan adalah gradien acak sebagai latar hampir semua bagian. Gradien dapat dipakai pada aset identitas yang disetujui atau overlay kontras foto dengan tujuan yang jelas. [S12]

## 09. Fotografi dan tata kelola aset

### 09.1 Arah fotografi [ADAPT]

Utamakan kegiatan belajar, praktik, fasilitas, interaksi mahasiswa, dan dokumentasi kampus nyata. Foto menjadi bukti konteks, bukan aksesori untuk mengisi kotak. Pada website non-USU, foto kampus USU bukan pengganti foto organisasi tujuan.

Hindari foto mahasiswa stok yang tidak terkait, bangunan hasil generasi AI yang diberi label kampus nyata, edit yang menambahkan fasilitas tidak ada, serta foto kegiatan lama yang diklaim sebagai peristiwa baru. Jangan membuat identitas orang berdasarkan penampilan foto.

Penyuntingan dibatasi pada crop, koreksi pencahayaan yang wajar, ukuran, kompresi, dan penajaman ringan. Jangan mengubah wajah, logo, seragam, tulisan penghargaan, atau konteks acara.

### 09.2 Katalog awal yang berhasil dibuka

| ID aset | Isi yang dapat dijelaskan dari gambar | Pemakaian yang disarankan | Catatan |
|---|---|---|---|
| `usu-logo-white` | Lambang putih dari host konten USU | Footer/header gelap yang berwenang memakai merek | Bukan paket lengkap logo fakultas. [S21] |
| `codestudio-learning` | Aktivitas di ruang komputer yang dirujuk halaman CodeStudio | Fasilitas atau pembelajaran praktik | Hubungan halaman dan gambar terverifikasi. [S05] [S16] |
| `vokasi-aula-exterior` | Tampak luar bangunan bertuliskan Aula Vokasi | Fasilitas atau profil kampus | Bukan disebut sebagai seluruh gedung fakultas. [S17] |
| `vokasi-student-group` | Foto kelompok berjaket hijau di aula | Kehidupan kampus, setelah konteks acara diperiksa | Tanggal dan nama acara belum ditetapkan. [S18] |
| `vokasi-achievement-group` | Kelompok membawa papan penghargaan | Dokumentasi prestasi setelah verifikasi caption | Jangan mengambil angka penghargaan untuk statistik website. [S19] |
| `vokasi-campus-gathering` | Dokumentasi kelompok besar dalam ruangan | Aktivitas kampus | Nama acara dan tanggal perlu konfirmasi. [S20] |

Daftar URL berada pada sumber dan `asset-manifest.json`. **Berkas foto tidak disertakan** dalam paket. Keberhasilan membuka gambar tidak berarti lisensinya bebas digunakan. Kolom izin harus diperiksa pengelola sebelum publikasi; simpan sumber, kredit, dan konteks. Ini aturan tata kelola proyek, bukan pendapat hukum.

### 09.3 Rasio dan pemotongan [ADAPT]

| Penggunaan | Rasio awal | Aturan crop |
|---|---|---|
| Foto hero lebar | 16:9 atau 16:7 jika sumber mendukung | Jangan memangkas kepala, teks gedung, atau subjek penting. |
| Foto berita utama | 4:3 atau 3:2 | Tetapkan focal point berdasarkan subjek. |
| Thumbnail berita | 4:3 | Seragam dalam satu daftar, bukan semua halaman. |
| Foto fasilitas | 4:3 atau 16:9 | Peralatan dan konteks ruangan tetap terlihat. |
| Portrait profil | 3:4 | Hanya untuk orang dan peran yang benar-benar dibutuhkan. |
| Logo | Rasio intrinsik | Gunakan contain; tidak boleh di-crop. |

Setiap foto memiliki `alt` sesuai isi dan fungsinya. Contoh untuk aset CodeStudio: "Aktivitas belajar di ruang komputer CodeStudio Fakultas Vokasi USU." Foto dekoratif murni memakai alt kosong. Caption informasi tidak digantikan alt yang panjang.

`object-position` disimpan per aset. Default 50% 50% bukan hasil audit crop. Pada foto kelompok, sering lebih aman mempertahankan rasio asli daripada memaksa semua subjek masuk ke crop hero yang sangat lebar.

### 09.4 Kontrak pengiriman media [ADAPT]

Simpan dimensi intrinsik saat aset benar-benar diunduh agar ruang dapat dipesan sebelum gambar selesai dimuat. Pilih ukuran responsif sesuai slot dengan `srcset` dan `sizes`. Gambar utama di atas lipatan halaman tidak di-lazy-load; gambar di bawahnya dapat memakai lazy loading. Jangan memuat tiga versi gambar hero sekaligus.

Target awal mengikuti bagian 24: hero desktop di bawah 300 KB, varian mobile di bawah 180 KB, thumbnail sekitar 40-120 KB, selama detail tetap cukup. Foto editorial non-hero dapat ditargetkan sekitar 100-200 KB. Ini anggaran proyek, bukan ukuran file sumber yang sudah diperiksa. Jangan mengganti file dengan kualitas buruk hanya demi angka.

## 10. Arsitektur informasi dan navigasi

**[WEB]** Menu topik sumber mencakup Tentang, Pendidikan, Penelitian, Pengabdian, Berita, PPID Pelaksana, Arsip, SDGs, dan Kepegawaian. Menu audiens mencakup calon mahasiswa, mahasiswa, alumni, dosen/staf, pengunjung internasional, media/mitra, dan layanan. [S01]

**[ADAPT]** Gunakan pemisahan audiens dan topik jika website tujuan memang melayani kedua jenis akses. Untuk website kecil, tiga sampai enam menu yang jelas lebih baik daripada menyalin seluruh menu fakultas.

| Prinsip | Kontrak |
|---|---|
| Rute nyata | Item menu harus menuju halaman atau section yang tersedia. |
| Label jelas | Gunakan istilah tugas/konten; jangan label pemasaran yang tidak menjelaskan tujuan. |
| Aktif | Tunjukkan halaman aktif dengan bentuk/garis dan `aria-current="page"`, bukan warna saja. |
| Submenu | Perbedaan link induk dan tombol buka submenu terlihat serta dapat dioperasikan keyboard. |
| Kedalaman | Hindari lebih dari dua tingkat pada navigasi utama; struktur kompleks memakai halaman indeks. |
| Bahasa | Pilihan bahasa hanya muncul jika versi padanan tersedia atau statusnya dijelaskan. |
| Link keluar | Tujuan eksternal dapat dikenali; perilaku tab baru tidak disembunyikan. |

Jangan menyalin kontak, nama pimpinan, atau tahun akademik sumber ke website lain sebagai data default. Informasi institusi ditempatkan dalam konfigurasi konten, bukan di-hardcode di komponen.

## 11. Header, menu desktop, dan menu mobile

### 11.1 Header institusional [ADAPT]

Komposisi awal terdiri dari utility navigation yang ringan, area identitas, dan navigasi utama. Ini **resep implementasi**, bukan pernyataan jumlah baris header asli. Pada ruang cukup lebar, identitas dan menu dapat berbagi baris; pada menu panjang, gunakan baris navigasi tersendiri atau kelompok sekunder yang jelas.

Utility bar dapat dimulai pada tinggi minimum 32-40 px. Area identitas minimum 72-88 px desktop dan 64-72 px mobile. Tinggi sebenarnya harus bertambah bila isi membungkus, terutama saat zoom. Tidak boleh memaksa sembilan menu, logo, pencarian, dan bahasa masuk dengan font terlalu kecil.

Header tidak dibuat sebagai pil besar mengambang. Pilihan permukaan dasar adalah putih dengan identitas hijau dan divider. Bidang hijau untuk utility bar atau navigasi diperbolehkan jika kontras terjaga. Header transparan di atas foto bukan default.

### 11.2 Dropdown dan penggabungan menu [ADAPT]

Buka submenu dengan tombol, bukan hover-only. Hover boleh membantu pointer desktop tetapi tidak menjadi satu-satunya mekanisme. Tombol memakai `aria-expanded`; Escape menutup submenu dan mengembalikan fokus secara masuk akal. Posisi panel dijaga agar tidak keluar viewport.

Jika ruang tidak cukup, pindahkan kelompok sekunder ke menu yang diberi nama jelas atau ubah ke navigasi mobile. Jangan menyembunyikan menu penting melalui CSS tanpa jalur alternatif. Keputusan breakpoint menu didasarkan pada lebar konten nyata, bukan asumsi semua desktop dimulai pada 768 px.

### 11.3 Menu mobile [ADAPT]

Logo, tombol cari, dan tombol menu tetap terlihat. Menu dibuka sebagai panel penuh atau drawer yang mudah dibaca. Jika modal, trap focus, lock scroll, tutup dengan Escape, dan kembalikan fokus ke tombol pemicu. Jika bukan modal, jangan menambahkan perilaku modal secara setengah-setengah.

Daftar topik tampil vertikal. Submenu memakai disclosure/accordion dengan area tekan minimal 44 px. Utility link diletakkan setelah menu utama, bukan dihilangkan. Panel yang tertutup tidak boleh meninggalkan link tak terlihat di urutan Tab.

Sticky header hanya dipakai bila membantu. Tingginya harus diperhitungkan pada anchor, fokus, dan heading yang dituju. Jangan menutup setengah layar mobile dengan tiga bar navigasi sticky.

## 12. Hero dan pembuka halaman

**[CHECK]** Komposisi, tinggi, perilaku slideshow, dan foto hero aktif situs sumber belum diverifikasi melalui screenshot browser. Dua pola berikut adalah baseline adaptasi, bukan rekonstruksi hero sumber.

### 12.1 Hero fotografi institusional [ADAPT]

Cocok untuk profil unit atau landing page publik. Gunakan satu foto autentik yang cukup kuat, identitas singkat, satu H1, paragraf pendek, dan paling banyak satu tindakan utama dengan satu link sekunder yang memang relevan. Teks dapat ditempatkan di bidang terpisah dari foto agar mudah dibaca.

Desktop dapat memakai kolom 5:7 untuk teks dan gambar, atau foto lebar dengan panel teks yang tidak menutupi subjek. Pada mobile, teks dan foto ditumpuk; jangan menempelkan judul panjang di foto kecil. Hindari tinggi terkunci 100vh yang mendorong informasi penting terlalu jauh.

### 12.2 Pembuka editorial [ADAPT]

Cocok untuk beranda yang sering memperbarui berita. Gunakan satu berita prioritas dan dua atau tiga item pendukung. Prioritas terlihat melalui ukuran foto dan judul, bukan melalui bayangan besar pada setiap item.

Untuk halaman direktori, cukup breadcrumb, H1, deskripsi pendek, lalu pencarian atau filter. Tidak diperlukan hero gambar besar di setiap halaman. Untuk dashboard, pembuka cukup nama halaman dan tindakan relevan.

### 12.3 Larangan struktur semu [ADAPT]

Tidak ada badge "terbaik" tanpa dasar, headline gradien, logo partner yang tidak berhubungan, mockup dashboard palsu, atau angka pengguna rekaan. Overlay foto hanya untuk kontras. Jangan menggunakan tiga CTA yang bersaing dalam satu hero.

## 13. Heading bagian dan daftar editorial

`SectionHeading` memuat judul, ornamen opsional yang sah, dan link menuju koleksi lengkap bila rutenya ada. Judul rata kiri menjadi default. Link koleksi bisa sejajar pada desktop dan turun baris pada mobile tanpa merusak urutan baca.

`EditorialList` memisahkan item dengan ruang atau divider, bukan selalu dengan panel. Setiap item memiliki hierarki judul, metadata, dan ringkasan. Foto bersifat opsional bila tidak memberi informasi tambahan. Item tanpa foto tidak diberi ilustrasi generik otomatis.

Dalam satu kelompok, jenis metadata harus konsisten. Tanggal tidak dicampur dengan angka statistik, kategori tidak didandani seperti tombol jika tidak interaktif, dan ikon panah tidak muncul sebagai satu-satunya nama link.

## 14. Komponen berita dan artikel

**[WEB]** Listing berita sumber memiliki kontrol pencarian, tahun rilis, dan navigasi halaman. [S03]

**[ADAPT]** Beranda memakai satu item unggulan dengan dua sampai empat item ringkas. Listing arsip memakai grid atau daftar yang lebih konsisten untuk memudahkan perbandingan; tidak perlu membuat semua halaman asimetris.

| Elemen | Kontrak desain |
|---|---|
| Gambar | Rasio 4:3 atau 3:2, tidak ditambah frame tebal, sumber sesuai artikel. |
| Kategori | Metadata singkat; link hanya bila memang menuju filter kategori. |
| Judul | H3 pada koleksi, H1 di detail, tidak all-caps. |
| Tanggal | Tanggal publikasi yang nyata, bukan tanggal saat halaman dibuka. |
| Ringkasan | Satu atau dua kalimat yang menambah informasi, bukan mengulang judul. |
| Aksi | Judul atau satu link deskriptif; hindari tiga link identik berurutan. |
| Hover | Underline atau perubahan warna; bukan pembesaran kartu. |

Halaman detail artikel menggunakan lebar baca, metadata, foto utama, isi, caption bila diperlukan, dan artikel terkait yang benar-benar relevan. Galeri, tabel, atau kutipan hanya ditampilkan jika kontennya ada. Konten HTML dari CMS disanitasi sebelum dirender.

Pagination mempertahankan filter aktif. Hasil kosong dibedakan dari kegagalan jaringan. Hasil pencarian tidak langsung berubah menjadi error hanya karena tidak ditemukan berita.

## 15. Pengumuman dan agenda [ADAPT]

`AnnouncementList` mengutamakan judul, tanggal terbit, kategori, dan tenggat bila ada. Tampilan awal berupa daftar ber-divider dengan jarak 20-24 px; foto tidak diwajibkan. Label "Penting" hanya digunakan apabila prioritas telah ditetapkan editor, bukan pada semua item.

`EventList` memisahkan tanggal acara dari tanggal publikasi. Blok tanggal boleh memakai aksen kuning dengan teks gelap; judul, waktu, lokasi atau platform, dan status tetap berupa teks yang bisa dibaca tanpa mengandalkan warna. Daftar acara mendatang disusun berdasarkan waktu mulai, sedangkan arsip mempunyai urutan tersendiri.

| Status acara | Syarat data | Perilaku UI |
|---|---|---|
| Akan datang | Waktu mulai berada di masa depan | Tampilkan tanggal dan tindakan yang memang tersedia. |
| Berlangsung | Waktu mulai sudah lewat, waktu selesai belum lewat | Tampilkan status tekstual; jangan berkedip. |
| Selesai | Waktu selesai terlewati | Masuk arsip; nonaktifkan pendaftaran yang telah ditutup. |
| Ditunda | Ditetapkan editor | Pertahankan informasi perubahan, jangan mengarang tanggal baru. |
| Dibatalkan | Ditetapkan editor | Nyatakan pembatalan; tindakan pendaftaran dihapus. |
| Waktu belum lengkap | Data tidak mencukupi | Jangan menghitung status otomatis dari asumsi. |

Simpan waktu dengan offset atau zona waktu yang jelas. Untuk acara lokal Medan, formatter dapat menggunakan `Asia/Jakarta`; untuk acara lintas negara, tampilkan zona acara dan konversi secara eksplisit. Contoh format UI: `24 September 2026`, `09.00-12.00 WIB`. Contoh ini menjelaskan format, bukan agenda resmi.

Lampiran pengumuman memiliki nama yang deskriptif, tipe berkas, dan ukuran bila metadata tersedia. Tautan dokumen tidak diberi ikon unduh jika sebenarnya membuka halaman detail. Jangan menampilkan "0 KB" saat ukuran belum diketahui.

## 16. Direktori program dan katalog layanan [ADAPT]

Pengelompokan program Diploma dan Sarjana Terapan pada situs pendidikan menjadi acuan klasifikasi. Daftar aktual harus berasal dari data yang disetujui, bukan diketik ulang dari contoh desain. [S02]

Untuk direktori kecil, gunakan heading kelompok dan daftar tautan dua kolom pada desktop. Untuk direktori besar, tambahkan pencarian, filter jenjang, dan ringkasan jumlah hasil. Hindari membagi program berdasarkan warna-warni tanpa arti.

Setiap item terdiri atas nama resmi, jenjang, ringkasan singkat opsional, dan satu tujuan detail. Akreditasi, gelar lulusan, durasi, serta jumlah mahasiswa adalah data terpisah yang hanya ditampilkan jika terverifikasi. Jangan membuat semua judul berukuran kecil agar satu baris; biarkan nama panjang membungkus.

Halaman detail mengutamakan informasi yang benar-benar dimiliki: gambaran program, kompetensi, kurikulum, fasilitas terkait, dan kontak. Tab hanya dipakai jika konten layak dikelompokkan. Pada mobile, navigasi bagian dapat menjadi daftar anchor; hindari tab horizontal yang menyembunyikan label penting.

Pada website non-akademik, pola ini bisa menjadi direktori layanan, kategori produk, atau unit organisasi. Ganti struktur datanya, bukan hanya mengganti teks "Program Studi" menjadi "Produk" sementara seluruh informasi akademik dibiarkan.

## 17. Fasilitas dan galeri [ADAPT]

Direktori fasilitas sumber mendukung pencarian dan penyaringan. Halaman CodeStudio memiliki deskripsi, lokasi, dan galeri; ketiga jenis informasi ini dapat menjadi dasar template detail. [S04] [S05]

| Komponen | Isi dan perilaku |
|---|---|
| `FacilityIndex` | Heading, pencarian, filter kategori atau program bila relevan, hasil, pagination. |
| `FacilityItem` | Foto dokumenter, nama, kategori, ringkasan faktual, link detail. |
| `FacilityDetail` | Nama fasilitas, foto utama, fungsi, lokasi, ketentuan penggunaan jika diketahui. |
| `ImageGallery` | Thumbnail dengan rasio konsisten; foto penuh tidak di-crop ketika dibuka. |
| `ContactBlock` | Kontak terverifikasi; sembunyikan field kosong, jangan mengisi nomor contoh. |

Galeri sederhana boleh berupa grid tanpa lightbox. Jika lightbox diperlukan, implementasikan dialog berlabel, tombol tutup, Escape, navigasi foto yang terbaca, fokus terkunci di dialog, dan pengembalian fokus ke thumbnail pemicu. Jangan mewajibkan gesture swipe sebagai satu-satunya cara berpindah.

Teks tentang kondisi atau ketersediaan fasilitas tidak disimpulkan hanya dari foto. Foto ruang komputer tidak membuktikan jumlah komputer operasional, jam buka, akses publik, ataupun merek peralatan yang disediakan saat ini.

## 18. Profil, sambutan, angka, dan penerimaan [ADAPT]

Blok profil memakai komposisi teks dan foto yang seimbang; jangan menambahkan paragraf panjang semata untuk mengisi ruang. Sambutan ditempatkan setelah informasi yang paling diperlukan pengunjung, kecuali tujuan halaman memang memperkenalkan pimpinan. Foto, nama, jabatan, dan masa berlaku harus berasal dari pengelola konten.

**[WEB]** Pada saat peninjauan, beberapa blok sumber menampilkan angka mahasiswa yang berbeda, dan bagian penerimaan masih menyebut tahun akademik 2024/2025. Karena itu, angka dan periode sumber tidak dijadikan nilai tetap di sistem desain ini. Perbedaan dapat berasal dari periode atau definisi berbeda; penyebabnya belum terkonfirmasi. [S01]

Statistik memiliki kontrak: `label`, `value`, `unit`, `period`, `source`, dan `verifiedAt`. Angka tanpa periode tidak otomatis dianggap terbaru. Jika nilai belum tersedia, sembunyikan blok atau tampilkan keterangan jujur, bukan `0`, `99%`, atau angka pengisi. Tidak ada animasi penghitung angka secara default.

`AdmissionCallout` atau padanannya pada website lain berisi satu tujuan jelas, ringkasan syarat atau periode yang valid, dan tombol menuju alur resmi. Status pendaftaran berasal dari data, bukan tanggal yang ditanam di komponen. Setelah pendaftaran ditutup, ganti pesan dan tindakan secara sengaja; jangan mempertahankan tombol "Daftar sekarang" yang buntu.

## 19. Footer [ADAPT]

Footer mengakhiri perjalanan informasi, bukan tempat menaruh seluruh menu sekaligus. Gunakan bidang hijau gelap, teks terang, dan tiga kelompok isi: identitas pengelola; akses penting; kontak serta tautan kebijakan yang memang ada.

Desktop dapat memakai 3-4 kolom. Tablet memakai dua kolom, mobile satu kolom dengan judul kelompok yang jelas. Logo mempertahankan rasio dan clear space. Gunakan versi putih resmi hanya ketika organisasi tujuan berwenang memakainya; jangan membalik warna logo berwarna dengan CSS filter.

Alamat, surel, nomor telepon, akun sosial, serta kredit mengikuti organisasi tujuan. Link sosial diberi nama aksesibel; jangan memakai tombol ikon yang semuanya bernama "Link". Tahun hak cipta tidak menyatakan seluruh konten telah diperbarui pada tahun tersebut. Kebijakan privasi atau aturan penggunaan tidak boleh diarahkan ke kebijakan USU untuk website yang tidak berkaitan.

## 20. Kontrol, formulir, dan feedback [ADAPT]

### 20.1 Kontrak interaksi dasar

Tombol menjalankan tindakan; tautan berpindah ke tujuan. Komponen visual tombol boleh berupa tautan bila fungsinya navigasi, tetapi semantiknya tetap tautan. Ukuran target proyek minimal 44 x 44 px untuk kontrol utama; panjang teks dapat membuat tombol lebih tinggi. Tombol ikon memiliki nama aksesibel, bukan tooltip saja.

| State | Tombol | Input atau filter |
|---|---|---|
| Default | Kontras jelas, label tindakan spesifik | Label tetap terlihat, nilai atau hint terbaca. |
| Hover | Perubahan warna atau underline terkontrol | Border atau permukaan berubah tipis bila berguna. |
| Focus-visible | Ring yang kontras pada latar terang dan gelap | Fokus tidak hanya ditunjukkan oleh placeholder. |
| Active | Penekanan warna singkat | Pilihan terlihat sekaligus terbaca. |
| Disabled | Tidak dapat dieksekusi, penyebab dijelaskan jika perlu | Nilai tetap terbaca; bukan sekadar opacity sangat rendah. |
| Loading | Label seperti "Menyimpan...", ukuran tidak meloncat | Pertahankan nilai, cegah submit ganda. |
| Success | Konfirmasi sesuai hasil nyata | Nilai tetap tersedia atau reset setelah tindakan jelas. |
| Error | Pesan dekat konteks, tindakan ulang bila tersedia | `aria-invalid`, pesan dihubungkan dengan field. |

`aria-disabled="true"` tidak menghentikan klik dengan sendirinya. Komponen harus mencegah aktivasi melalui pointer dan keyboard. Saat proses berjalan, gunakan state bisnis yang nyata; jangan mengubah UI menjadi sukses berdasarkan timer saja.

### 20.2 Formulir

Label berada di atas input dengan jarak 6-8 px. Kelompok field berjarak sekitar 20-24 px. Helper text dan error berada setelah field, berukuran 14 px atau lebih pada baseline ini. Placeholder hanya contoh format; bukan pengganti label.

Gunakan jenis input yang sesuai, `autocomplete` jika relevan, dan penjelasan wajib/opsional yang konsisten. Validasi tidak menghapus nilai pengguna. Error submit menampilkan ringkasan jika banyak field gagal, kemudian mengarahkan fokus secara wajar ke ringkasan atau field pertama yang bermasalah. Validasi server tetap otoritatif.

Untuk pencarian sederhana, sediakan tombol Cari dan dukung Enter. Pencarian langsung dapat memakai debounce 250-400 ms sebagai keputusan implementasi, bukan angka sumber. Batalkan atau abaikan respons lama agar hasil untuk kata kunci sebelumnya tidak menimpa hasil terbaru.

### 20.3 State halaman dan pengumpulan data

- **Memuat:** skeleton mengikuti bentuk konten dan diberi status yang sesuai; tidak ada angka fiktif sebagai pengisi.
- **Kosong:** jelaskan bahwa belum ada data, bukan menyalahkan pengguna; beri tindakan hanya jika berguna.
- **Gagal:** sebutkan bahwa pemuatan gagal dan sediakan coba lagi jika operasi aman diulang.
- **Akses ditolak:** bedakan kebutuhan login dari ketiadaan izin; jangan membuka data yang disembunyikan hanya lewat CSS.
- **Tidak ditemukan:** 404 memiliki jalan kembali ke area relevan, bukan otomatis diarahkan ke beranda tanpa penjelasan.

## 21. Tabel dan adaptasi dashboard [ADAPT]

Bagian ini adalah perluasan untuk website tujuan, **bukan klaim bahwa dashboard berikut terdapat pada sumber**.

Gunakan permukaan terang, sidebar atau navigasi ringkas, heading halaman, tindakan utama, filter, lalu data. Jangan membawa hero foto kampus ke setiap halaman administrasi. Foto hanya muncul jika merupakan bagian dari data atau konteks tugas.

Tabel memakai header yang jelas, padding sel 12-16 px, divider horizontal, alignment sesuai isi, dan metadata yang tidak terlalu kecil. Angka yang dibandingkan rata kanan dan boleh memakai `font-variant-numeric: tabular-nums`. Nama atau judul utama tetap mendapat ruang yang cukup.

Sorting diwakili kontrol dengan status yang terkomunikasikan. Checkbox seleksi massal menjelaskan cakupan, misalnya hanya halaman aktif atau seluruh hasil. Tindakan destruktif penting meminta konfirmasi dengan nama objek, bukan hanya pertanyaan umum.

Pada mobile, tabel yang memang memerlukan dua dimensi boleh digulir dalam wilayah berlabel. Jangan menyembunyikan overflow seluruh halaman. Alternatif tampilan kartu hanya dibuat jika relasi antarkolom masih jelas. Kolom penting tidak hilang tanpa akses pengganti.

## 22. Responsive, reflow, dan kepadatan [ADAPT]

Ukuran berikut adalah baseline proyek; bukan breakpoint situs sumber yang telah terukur. Uji isi terpanjang, bukan hanya contoh pendek.

| Rentang atau titik uji | Komposisi yang diharapkan |
|---|---|
| 320 px | Satu kolom, gutter 16 px, menu ringkas, kontrol tidak terpotong. |
| 375, 390, 430 px | Satu kolom yang disengaja; gambar dan teks memiliki urutan baca yang benar. |
| 768 px | Gutter 24 px; daftar tertentu dapat menjadi dua kolom jika isi muat. |
| 1024 px | Editorial dua kolom 7:5 atau 1:1 bila konten sesuai; navigasi tetap bisa ringkas. |
| 1280 px | Gutter 32 px; evaluasi kecukupan ruang menu desktop. |
| 1440 px | Container maksimal 1280 px; hierarki foto, judul, dan daftar tidak terlalu renggang. |
| 1920 px | Container tetap terkendali; jangan memperbesar teks otomatis mengikuti monitor. |

Pergantian navbar desktop ditentukan oleh muatnya isi, bukan semata label perangkat. Jika seluruh menu tidak muat pada 1024 px, pertahankan mode ringkas sampai lebar yang memadai. Jangan mengecilkan font navigasi menjadi 10-11 px untuk memaksa muat.

Urutan DOM mengikuti urutan baca. CSS visual reorder tidak boleh membuat fokus melompat secara membingungkan. Foto bisa pindah posisi hanya jika hubungan teks-foto tetap jelas. Jangan menggunakan fixed height pada kartu berteks panjang.

Uji zoom 200% dan reflow setara viewport 320 CSS px; ukuran device pixel tidak sama dengan CSS pixel. Header sticky tidak menutup heading anchor atau fokus. `--usu-header-offset` wajib disesuaikan dengan tinggi header yang benar-benar dirender.

## 23. Aksesibilitas dan penggunaan inklusif

**Acuan [S14]:** WCAG 2.2 AA mencakup kontras teks normal 4,5:1, teks besar 3:1, kebutuhan kontras non-teks tertentu 3:1, serta target minimum 24 x 24 CSS px dengan pengecualian yang ditentukan standar. Target **44 x 44 px dalam dokumen ini adalah keputusan proyek yang lebih lapang**, bukan klaim bahwa semua kontrol AA harus 44 px. Memenuhi satu rasio atau ukuran tidak cukup untuk menyatakan seluruh website memenuhi WCAG. [S14]

**Kontrak implementasi [ADAPT]:** gunakan landmark, satu H1 deskriptif per halaman, heading bertingkat, skip link, nama kontrol yang bermakna, fokus terlihat, alternatif teks sesuai fungsi, dan urutan baca yang tetap masuk akal tanpa CSS.

Pada dropdown navigasi website biasa, utamakan daftar tautan dan tombol disclosure; jangan otomatis menambahkan peran ARIA `menu` yang menuntut pola keyboard aplikasi. Dialog modal mempunyai nama, penanganan fokus, Escape, dan pengembalian fokus. Pesan async memakai live region seperlunya agar tidak membacakan setiap perubahan kecil.

Pemeriksaan wajib: seluruh alur dengan Tab/Shift+Tab/Enter/Escape; fokus pada footer gelap; kontras di setiap crop foto; label form dan error; tautan yang bermakna saat dibaca di luar konteks; zoom dan teks panjang; preferensi reduced motion. Jangan menonaktifkan zoom melalui meta viewport.

## 24. Motion, media, dan anggaran performa [ADAPT]

Motion default rendah. Feedback warna sekitar 140 ms, panel transisi maksimal sekitar 200 ms. Perubahan tidak menggeser layout utama. Motion dimatikan atau dikurangi saat pengguna meminta `prefers-reduced-motion: reduce`.

Tidak ada parallax default, kartu mengambang terus-menerus, penghitung angka otomatis, cursor khusus, atau animasi scroll pada setiap paragraf. Komponen carousel hanya dibuat bila kebutuhan kontennya jelas; versi awal memilih navigasi manual dan tidak autoplay. Jika autoplay ditambahkan, siapkan pause serta pengujian aksesibilitas terpisah.

| Anggaran awal proyek | Target, bukan hasil pengukuran sumber |
|---|---|
| Foto hero desktop | Usahakan di bawah 300 KB pada varian yang ditampilkan; evaluasi kualitas visual. |
| Foto hero mobile | Usahakan di bawah 180 KB; gunakan sumber responsif. |
| Thumbnail | Sekitar 40-120 KB sesuai ukuran dan detail. |
| Font | Satu keluarga, hanya bobot yang dipakai; tidak melampirkan berkas font dalam kit ini. |
| Gambar awal | Prioritaskan hanya gambar penting di atas lipatan; sisanya lazy bila tepat. |
| JavaScript | Jangan menambah library untuk ikon, animasi, atau carousel yang tidak dibutuhkan. |

Anggaran bisa disesuaikan setelah pengukuran. Tidak ada jaminan skor Lighthouse, Core Web Vitals, atau performa lapangan dalam dokumen ini. Optimasi gambar tidak boleh merusak wajah, tulisan gedung, atau detail yang diperlukan.

## 25. Kontrak konten dan pemisahan identitas [ADAPT]

Sistem desain mengatur presentasi, sementara konfigurasi proyek mengatur identitas, menu, halaman, dan konten. Hindari string USU yang tersebar di komponen umum. Nama prefix `usu` pada CSS adalah namespace contoh, bukan penanda afiliasi website tujuan.

Contoh kontrak TypeScript berikut **bukan data produksi** dan tidak membuat klaim tentang institusi mana pun:

```ts
export type PermissionStatus = "pending" | "approved" | "rejected";

export interface SiteIdentity {
  siteName: string;
  parentOrganization?: string;
  affiliation: "authorized-usu" | "student-project" | "independent";
  locale: "id-ID" | "en-US";
  logo: { src: string; alt: string; width: number; height: number };
  footerContact: { email?: string; phone?: string; address?: string };
}

export interface NavItem {
  id: string;
  label: string;
  href?: string;
  children?: NavItem[];
  external?: boolean;
}

export interface EditorialImage {
  id: string;
  src: string;               // Sumber yang sudah diproses untuk produksi.
  alt: string;
  width: number;             // Ukuran intrinsik nyata, bukan ukuran preview.
  height: number;
  sourceUrl: string;
  sourcePage?: string;
  credit?: string;
  permission: PermissionStatus;
  focalPoint?: { x: number; y: number }; // Nilai 0..1 setelah crop diperiksa.
}

export interface VerifiedMetric {
  label: string;
  value: number;
  unit?: string;
  period: string;
  sourceUrl: string;
  verifiedAt: string;
}

export interface NewsEntry {
  id: string;
  title: string;
  summary?: string;
  slug: string;
  publishedAt: string;
  category?: string;
  image?: EditorialImage;
  sourceUrl?: string;
}
```

Validasi konfigurasi sebelum produksi: `siteName` tidak kosong, setiap navigasi memiliki tujuan atau children yang sah, gambar memiliki dimensi nyata, izin aset disetujui, dan metrik mempunyai periode serta sumber. File `asset-manifest.json` pada kit adalah **inventaris kandidat**, bukan daftar gambar yang otomatis siap produksi.

Copy mengikuti Bahasa Indonesia yang wajar. Contoh label: "Lihat program studi", "Cari berita", "Hapus filter", "Unduh panduan", "Hubungi pengelola". Hindari kata yang menjanjikan hasil tanpa dasar, testimoni buatan, dan angka statistik untuk dekorasi. Jangan mengganti nama file menjadi tanggal kejadian tanpa bukti.

## 26. Token CSS dan fondasi implementasi [ADAPT]

Blok berikut identik dengan `tokens.css` dalam kit. Ini fondasi opsional, bukan stylesheet asli situs sumber dan bukan implementasi lengkap navbar, galeri, formulir, atau CMS. Import aturan secara selektif pada proyek yang sudah punya reset atau design system.

Nama font sudah ditetapkan, tetapi berkas font **tidak disediakan atau dimuat oleh CSS ini**. Pengembang perlu mengatur pemuatan font dari sumber yang disetujui proyek. Jangan menyatakan font tampil benar hanya karena `font-family` memuat nama Public Sans.

<!-- TOKENS_CSS_START -->

```css
/*
 * Vokasi USU reference-informed design tokens, 2026-09-24.
 * NOT an extraction of the live website's CSS.
 * Primary green is converted from RGB (0, 105, 55) in the USU guide.
 * Other semantic assignments, geometry and component styles are adaptations.
 * Public Sans must be loaded separately from an approved source.
 * Import selectively or scope the rules when integrating an existing app.
 */
:root {
  color-scheme: light;
  --usu-brand: #006937;
  --usu-brand-hover: #00562d;
  --usu-brand-active: #004423;
  --usu-brand-deep: #0c3b2a;
  --usu-brand-bright: #3dae2b;
  --usu-accent: #ffc600;
  --usu-accent-hover: #edb800;
  --usu-canvas: #ffffff;
  --usu-surface: #f2f6f3;
  --usu-surface-muted: #f7f8f7;
  --usu-text: #18251e;
  --usu-text-secondary: #536157;
  --usu-on-brand: #ffffff;
  --usu-on-accent: #18251e;
  --usu-border: #d7e0d9;
  --usu-border-strong: #748579;
  --usu-danger: #b42318;
  --usu-danger-surface: #fff1f0;
  --usu-warning: #7a4b00;
  --usu-warning-surface: #fff5d6;
  --usu-info: #315e91;
  --usu-info-surface: #edf3fa;
  --usu-success: #006937;
  --usu-focus: #006937;
  --usu-disabled-surface: #e7ece8;
  --usu-disabled-text: #536157;

  --usu-font: "Public Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
  --usu-text-meta: 0.875rem;
  --usu-text-body: 1rem;
  --usu-text-lead: clamp(1.125rem, 1rem + 0.35vw, 1.25rem);
  --usu-text-h3: clamp(1.25rem, 1.1rem + 0.5vw, 1.5rem);
  --usu-text-h2: clamp(1.75rem, 1.35rem + 1.1vw, 2.25rem);
  --usu-text-h1: clamp(2rem, 1.4rem + 1.8vw, 3rem);
  --usu-text-display: clamp(2rem, 1.25rem + 2.7vw, 3.5rem);
  --usu-leading-heading: 1.15;
  --usu-leading-body: 1.65;

  --usu-space-1: 0.25rem;
  --usu-space-2: 0.5rem;
  --usu-space-3: 0.75rem;
  --usu-space-4: 1rem;
  --usu-space-5: 1.25rem;
  --usu-space-6: 1.5rem;
  --usu-space-8: 2rem;
  --usu-space-10: 2.5rem;
  --usu-space-12: 3rem;
  --usu-space-16: 4rem;
  --usu-space-20: 5rem;
  --usu-space-24: 6rem;

  --usu-container: 80rem;
  --usu-reading-width: 68ch;
  --usu-gutter: 1rem;
  --usu-grid-gap: 1rem;
  --usu-section-space: clamp(2.5rem, 1.8rem + 2.5vw, 5rem);
  --usu-header-offset: 6rem;
  --usu-radius-flat: 0;
  --usu-radius-sm: 0.125rem;
  --usu-radius-control: 0.25rem;
  --usu-radius-dialog: 0.5rem;
  --usu-shadow-menu: 0 8px 24px rgb(12 59 42 / 12%);
  --usu-duration-fast: 140ms;
  --usu-duration-normal: 200ms;
  --usu-ease: ease-out;
  --usu-z-sticky: 20;
  --usu-z-dropdown: 40;
  --usu-z-backdrop: 60;
  --usu-z-dialog: 70;
  --usu-z-toast: 80;
}

@media (min-width: 48rem) {
  :root { --usu-gutter: 1.5rem; --usu-grid-gap: 1.5rem; }
}
@media (min-width: 80rem) {
  :root { --usu-gutter: 2rem; --usu-grid-gap: 2rem; }
}

/* Optional foundation. Do not overwrite an existing reset blindly. */
*, *::before, *::after { box-sizing: border-box; }
html { scroll-padding-top: var(--usu-header-offset); }
body {
  margin: 0;
  background: var(--usu-canvas);
  color: var(--usu-text);
  font-family: var(--usu-font);
  font-size: var(--usu-text-body);
  line-height: var(--usu-leading-body);
}
img, video { display: block; max-inline-size: 100%; block-size: auto; }
button, input, select, textarea { font: inherit; }
button, a, input, select, textarea { -webkit-tap-highlight-color: transparent; }
button, a { touch-action: manipulation; }
h1, h2, h3 { line-height: var(--usu-leading-heading); font-weight: 600; }
h1 { font-size: var(--usu-text-h1); }
h2 { font-size: var(--usu-text-h2); line-height: 1.2; }
h3 { font-size: var(--usu-text-h3); line-height: 1.3; }
.usu-display { font-size: var(--usu-text-display); line-height: 1.1; }
.usu-lead { font-size: var(--usu-text-lead); line-height: 1.55; }
p, li, h1, h2, h3 { overflow-wrap: anywhere; }
a { color: var(--usu-brand); text-underline-offset: 0.2em; }
a:hover { text-decoration-thickness: 2px; }
:focus-visible {
  outline: 3px solid var(--usu-focus);
  outline-offset: 3px;
  box-shadow: 0 0 0 3px #fff;
}
.usu-container {
  inline-size: min(calc(100% - 2 * var(--usu-gutter)), var(--usu-container));
  margin-inline: auto;
}
.usu-prose { max-inline-size: var(--usu-reading-width); }
.usu-section { padding-block: var(--usu-section-space); }
.usu-section--compact { padding-block: clamp(2rem, 3vw, 3rem); }
.usu-section--soft { background: var(--usu-surface); }
.usu-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--usu-grid-gap); }
.usu-grid > * { min-inline-size: 0; }
.usu-section-heading {
  display: flex; flex-wrap: wrap; align-items: baseline;
  justify-content: space-between; gap: 1rem 2rem; margin-block-end: 2rem;
}
.usu-section-heading h2 { margin: 0; }
.usu-meta { color: var(--usu-text-secondary); font-size: var(--usu-text-meta); line-height: 1.5; }
.usu-media { margin: 0; overflow: hidden; border-radius: var(--usu-radius-flat); }
.usu-media img {
  inline-size: 100%; block-size: 100%; object-fit: cover;
  object-position: var(--usu-focal-point, 50% 50%);
}
.usu-media--landscape { aspect-ratio: 4 / 3; }
.usu-media--wide { aspect-ratio: 16 / 9; }
.usu-panel { border: 1px solid var(--usu-border); padding: 1.5rem; border-radius: var(--usu-radius-control); }
.usu-list { margin: 0; padding: 0; list-style: none; }
.usu-list > li { padding-block: 1.25rem; border-block-end: 1px solid var(--usu-border); }
.usu-button {
  display: inline-flex; align-items: center; justify-content: center;
  gap: 0.5rem; min-block-size: 2.75rem; padding: 0.65rem 1.15rem;
  border: 1px solid transparent; border-radius: var(--usu-radius-control);
  font-weight: 600; line-height: 1.4; text-align: center;
  text-decoration: none; cursor: pointer;
  transition: background-color var(--usu-duration-fast) var(--usu-ease),
              border-color var(--usu-duration-fast) var(--usu-ease),
              color var(--usu-duration-fast) var(--usu-ease);
}
.usu-button--primary { color: var(--usu-on-brand); background: var(--usu-brand); }
.usu-button--primary:hover { background: var(--usu-brand-hover); }
.usu-button--primary:active { background: var(--usu-brand-active); }
.usu-button--secondary { color: var(--usu-brand); background: #fff; border-color: var(--usu-brand); }
.usu-button--secondary:hover { background: var(--usu-surface); }
.usu-button--accent { color: var(--usu-on-accent); background: var(--usu-accent); }
.usu-button--accent:hover { background: var(--usu-accent-hover); }
.usu-button:disabled, .usu-button[aria-disabled="true"] {
  color: var(--usu-disabled-text); background: var(--usu-disabled-surface);
  border-color: var(--usu-border); cursor: not-allowed;
}
/* aria-disabled does NOT prevent activation; implement that in the component. */
.usu-input {
  inline-size: 100%; min-block-size: 2.75rem; padding: 0.65rem 0.875rem;
  border: 1px solid var(--usu-border-strong); border-radius: var(--usu-radius-control);
  color: var(--usu-text); background: #fff;
}
.usu-input::placeholder { color: var(--usu-text-secondary); }
.usu-input[aria-invalid="true"] { border-color: var(--usu-danger); }
.usu-error { color: var(--usu-danger); font-size: var(--usu-text-meta); }
.usu-table-scroll { overflow-x: auto; }
.usu-table { inline-size: 100%; border-collapse: collapse; text-align: start; }
.usu-table th, .usu-table td { padding: 0.875rem 1rem; border-block-end: 1px solid var(--usu-border); }
.usu-table th { font-weight: 600; background: var(--usu-surface); }
.usu-inverse { color: #fff; background: var(--usu-brand-deep); }
.usu-inverse a:not(.usu-button) { color: #fff; }
.usu-inverse .usu-meta { color: #e0ebe4; }
.usu-skip-link {
  position: fixed; top: 0.5rem; left: 0.5rem; z-index: 100;
  transform: translateY(-200%); padding: 0.75rem 1rem;
  color: #fff; background: var(--usu-brand-deep);
}
.usu-skip-link:focus { transform: translateY(0); }
@media (min-width: 64rem) {
  .usu-grid--editorial { grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); }
  .usu-grid--equal { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (prefers-reduced-motion: reduce) {
  .usu-button { transition: none; }
  html { scroll-behavior: auto; }
}

```
<!-- TOKENS_CSS_END -->

## 27. Audit browser untuk meningkatkan kesetiaan sumber [CHECK]

Bagian ini menjelaskan pekerjaan pengukuran berikutnya. **Pekerjaan ini belum dilakukan pada situs live dalam paket ini.** Pembacaan HTML dan pedoman merek tidak cukup untuk menyatakan ukuran font, grid, dan warna computed situs telah diketahui.

### 27.1 Matriks pengambilan bukti

Ambil beranda, satu listing berita, satu artikel, direktori pendidikan, dan satu fasilitas. Catat URL lengkap, waktu, browser, viewport dalam CSS px, DPR, zoom, posisi scroll, status login, dan kondisi menu. Gunakan halaman publik tanpa memasukkan kredensial ke alat audit.

Untuk setiap halaman, tangkap desktop 1440 px, tablet 768 px, serta mobile 390 px sebagai baseline. Tambahkan 320 px untuk uji reflow. Simpan screenshot penuh dan detail header/hero/footer. Foto responsif, font yang belum selesai dimuat, banner, atau data dinamis dapat mengubah tampilan; catat kondisinya.

### 27.2 Nilai yang wajib diukur

| Kelompok | Data yang perlu dicatat |
|---|---|
| Tipografi | Font yang benar-benar dirender, bobot, size, line-height, letter-spacing. |
| Grid | Lebar container, margin sisi, gap, jumlah kolom, rasio kolom. |
| Header | Tinggi nyata, logo bounds, posisi menu, mode sticky, kondisi dropdown. |
| Warna | Computed text/background/border; bedakan dari warna dalam foto. |
| Bentuk | Radius, border, shadow, outline, ukuran target kontrol. |
| Gambar | currentSrc, dimensi intrinsik, aspect ratio, object-fit, focal point. |
| Interaksi | Hover, focus, active, open, disabled, error, reduced motion. |
| Responsive | Titik perubahan layout yang diamati, bukan menebak dari framework. |

`inspect-reference.js` dapat dibaca lalu dijalankan secara manual melalui console browser pada halaman publik yang hendak diaudit. Script mencatat subset computed styles, dimensi elemen, gambar, viewport, dan nama stylesheet, lalu mengunduh JSON. Script tidak membaca cookie, storage, atau nilai input; tidak mengirim data ke layanan luar. Tetap tinjau kode sebelum menjalankannya.

Script bukan pengganti screenshot atau DevTools. Nilai `fontFamily` tidak membuktikan font aktual setiap glyph; elemen dalam iframe dan shadow tree tidak ditelusuri; isi dropdown tertutup tidak diuji; pseudo-element hanya dicatat secara terbatas; dan selector yang tersimpan tidak dijamin stabil setelah situs diperbarui.

### 27.3 Prosedur perubahan token

Bandingkan implementasi tujuan dan sumber pada viewport serta state yang sama. Pisahkan perbedaan karena konten dari perbedaan desain. Perbaiki secara berurutan: struktur halaman, container, tipografi, foto/crop, jarak, warna, lalu detail border dan shadow. Jangan menutupi masalah struktur dengan tambahan dekorasi.

Jika computed color sumber berbeda dari baseline RGB pedoman, catat keduanya dan keputusan pemilik proyek. Jangan menimpa logo untuk memaksakan kecocokan UI. Jika aksesibilitas membutuhkan perubahan dari sumber, tandai perubahan sebagai adaptasi yang disengaja, bukan salah salin.

Format catatan perubahan:

```text
Element: header.primary
Evidence URL: [URL yang benar-benar diaudit]
Viewport/state: 1440 x 900 CSS px, menu tertutup, zoom 100%
Observed property: [nama properti]
Observed value: [hasil ukur, bukan contoh tebakan]
Previous token: [nilai sebelumnya]
Decision: [ikuti sumber / adaptasi dengan alasan]
Checked by/date: [penanggung jawab dan waktu]
```

## 28. Filter anti-slop dan alasan penggunaan elemen

Anti-slop menjadi pemeriksaan kualitas, bukan pengganti identitas atau kebutuhan pengguna. Repositori sumber menempatkan prinsipnya sebagai filter desain. Kontrak dalam tabel berikut adalah penerapannya pada proyek ini, bukan kutipan aturan resmi USU. [S15]

| Pola | Gunakan ketika | Hindari ketika |
|---|---|---|
| Kartu | Item memang merupakan objek terpisah dan perlu batas yang jelas | Semua paragraf, heading, atau angka dimasukkan kotak. |
| Grid berita | Pengguna perlu memindai banyak entri sejenis | Setiap section dipaksa menjadi tiga kartu identik. |
| Asimetri | Mendukung satu berita/foto prioritas | Mengacaukan urutan baca, bentuk form, atau perbandingan data. |
| Gradien | Ada aset motif resmi atau kebutuhan kontras yang masuk akal | Dipakai pada semua headline dan tombol agar terlihat modern. |
| Pill | Menjelaskan pilihan filter aktif atau tag yang memang perlu dibedakan | Semua tombol, navbar, foto, dan panel berbentuk kapsul. |
| Bayangan | Menjelaskan layer dropdown, popover, atau dialog | Setiap blok terlihat mengambang tanpa fungsi. |
| Ikon | Memperjelas tindakan yang sudah diberi nama | Sekadar mengisi ruang atau mengganti informasi penting. |
| Animasi | Memberi feedback perubahan yang nyata | Semua konten muncul berulang saat scroll atau terus bergerak. |
| Foto | Menjelaskan kegiatan, fasilitas, atau orang yang relevan | Gambar kampus asing, AI, atau stock diperlakukan sebagai dokumentasi USU. |
| Statistik | Ada nilai, definisi, periode, dan sumber yang jelas | Angka dibuat agar halaman tampak meyakinkan. |

Motif identitas resmi memang memiliki contoh penggunaan warna dan gradien; karena itu dokumen ini tidak melarang semua gradien secara buta. Elemen resmi tetap digunakan dalam konteks dan proporsi yang sesuai, bukan menjadi latar bising di belakang semua teks. [S12] [S13]

Pertanyaan review: apakah halaman menjelaskan pemilik dan layanannya, atau hanya template generik dengan logo baru? Apakah tiap blok punya tujuan informasi? Apakah tombol berfungsi? Apakah foto dan angka bisa ditelusuri? Apakah perbedaan ukuran dan posisi membantu prioritas, bukan hanya membuat tampilan sibuk?

## 29. Rencana implementasi dan kriteria penerimaan [ADAPT]

### 29.1 Urutan pengerjaan

1. Inventaris halaman, komponen, alur penting, serta data dan rute yang tidak boleh rusak.
2. Tentukan konteks merek pada bagian 03 dan kumpulkan aset yang penggunaannya disetujui.
3. Pasang token secara selektif; verifikasi font, kontras, container, dan spacing pada satu halaman representatif.
4. Refactor header, footer, heading, link, tombol, serta input agar dipakai bersama.
5. Terapkan template editorial, direktori, detail, atau dashboard sesuai kebutuhan nyata.
6. Hubungkan data, state loading/empty/error, filter, pagination, dan formulir ke fungsi yang benar.
7. Jalankan pengujian responsive, keyboard, visual, dan regresi proses bisnis.
8. Catat perbedaan dari sumber beserta alasan, lalu minta persetujuan desain dan konten.

### 29.2 Checklist penerimaan website tujuan

Semua checkbox di bawah **belum menandakan pekerjaan selesai**. Paket desain bukan website yang sudah diimplementasikan.

- [ ] Nama, logo, dan status afiliasi sesuai pemilik website tujuan.
- [ ] Sumber dan izin semua aset yang dipublikasikan telah diperiksa.
- [ ] Public Sans benar-benar dimuat, atau substitusi yang disetujui didokumentasikan.
- [ ] Warna primer produksi mempunyai dasar yang dicatat; perbedaan RGB/HEX sumber tidak disembunyikan.
- [ ] Tidak ada foto kampus AI yang ditampilkan sebagai dokumentasi nyata.
- [ ] Tidak ada angka, testimoni, akreditasi, jabatan, atau periode rekaan.
- [ ] Navbar desktop/mobile, search, dropdown, filter, dan pagination benar-benar berfungsi.
- [ ] Setiap CTA mempunyai tujuan; tidak ada `href="#"` sebagai pengganti implementasi.
- [ ] Formulir menampilkan label, loading, success, error, dan validasi yang konsisten.
- [ ] Galeri atau dialog mempunyai kontrol keyboard dan penanganan fokus bila digunakan.
- [ ] Tidak ada overflow halaman yang tidak disengaja pada seluruh titik uji.
- [ ] Foto utama mempertahankan subjek penting pada desktop maupun mobile.
- [ ] Fokus terlihat pada latar terang, gelap, dan foto.
- [ ] Kontras diperiksa pada pasangan warna dan state yang benar-benar dipakai.
- [ ] Konten tetap dapat dibaca pada zoom dan reflow; scroll tabel dibatasi pada wilayahnya.
- [ ] Font, foto, dan konten async tidak menyebabkan lonjakan layout yang mengganggu.
- [ ] Tidak ada regressi API, autentikasi, validasi, atau proses bisnis.
- [ ] Tidak ada klaim pixel-perfect atau lulus audit otomatis tanpa bukti pengujian.

### 29.3 Laporan akhir implementasi

Laporkan halaman yang diubah, komponen bersama, sumber aset, keputusan adaptasi, hasil pengujian dengan viewport/state, kegagalan yang belum selesai, serta dampak pada fungsi lama. Pisahkan "sudah diperiksa" dari "belum diperiksa". Screenshot mockup tidak membuktikan seluruh tombol dan alur berfungsi.

## 30. Komposisi halaman contoh [ADAPT]

Skema di bawah adalah susunan yang disarankan untuk website berorientasi informasi, **bukan gambar ulang layout live**. Sesuaikan jumlah dan urutan modul menurut kebutuhan. Jangan membuat modul kosong demi mengikuti skema.

### A. Beranda institusi

```text
Utility links untuk audiens
Header: identitas + navigasi + pencarian/bahasa
Hero editorial: identitas ringkas + dokumentasi autentik
Berita prioritas: satu item utama + item ringkas
Pengumuman dan agenda: dua jenis informasi yang dibedakan
Profil ringkas / program / layanan utama
Fasilitas atau aktivitas berbasis fotografi
Satu callout tindakan yang valid
Footer: identitas, akses penting, kontak
```

### B. Halaman arsip atau direktori

```text
Header konsisten
Breadcrumb
H1 + deskripsi konteks singkat
Pencarian + filter yang relevan
Jumlah hasil dan filter aktif
Daftar atau grid yang mudah dibandingkan
Pagination yang mempertahankan state
Footer
```

### C. Halaman detail

```text
Header konsisten
Breadcrumb
H1 + metadata faktual
Foto utama jika relevan
Isi pada lebar baca + informasi pendukung
Dokumen / galeri / kontak sesuai data
Tautan terkait yang benar-benar relevan
Footer
```

### D. Aplikasi layanan

```text
Header aplikasi dan navigasi tugas
Nama halaman + deskripsi pendek + satu tindakan utama
Ringkasan yang membantu tugas, bukan statistik dekoratif
Filter / formulir / tabel / daftar kerja
Feedback dan tindakan lanjutan
Footer minimal bila diperlukan
```

## 31. Catatan sumber dan batas bukti

Tanggal akses untuk sumber berikut: **24 September 2026**. Halaman, konten, dan URL aset dapat berubah. Sumber situs adalah bukti struktur dan konten yang berhasil dibaca; sumber lembar identitas adalah bukti panduan visual yang terlihat; sumber gambar adalah bukti asal dan isi visual yang berhasil dibuka. Tidak satu pun menggantikan pengukuran browser terhadap CSS live.

| ID | Sumber dan kegunaan | Batas bukti |
|---|---|---|
| [S01] | Beranda Vokasi USU: kategori navigasi, jenis modul, contoh data yang perlu direview | Bukan screenshot penuh atau ekstraksi stylesheet. |
| [S02] | Pendidikan: pengelompokan jenjang program | Daftar dan statistik harus diverifikasi ulang sebelum publikasi. |
| [S03] | Berita Fakultas: pola pencarian, tahun, dan pagination | Ukuran atau layout computed tidak diukur. |
| [S04] | Direktori fasilitas: pencarian dan filter | Tidak membuktikan state interaksi sudah diuji. |
| [S05] | Detail CodeStudio: konteks fasilitas dan gambar | Deskripsi tidak otomatis berlaku bagi website tujuan. |
| [S06] | Pedoman identitas, halaman tercetak 29: Public Sans | Panduan, bukan bukti font runtime situs. |
| [S07] | Pedoman identitas, halaman tercetak 30: warna formal | Beberapa pasangan RGB/HEX tercetak berbeda. |
| [S08] | Pedoman identitas, halaman tercetak 31: warna kasual | Baseline web menggunakan konversi RGB secara eksplisit. |
| [S09] | Pedoman identitas, halaman tercetak 33: elemen grafis | Bukan izin membuat ulang motif secara sembarang. |
| [S10] | Pedoman identitas, halaman tercetak 25: larangan modifikasi logo | Gunakan master aset yang disetujui. |
| [S11] | Pedoman identitas, halaman tercetak 23: clear space | Proporsi tidak sama dengan tinggi navbar. |
| [S12] | Pedoman identitas, halaman tercetak 34: contoh warna/gradien elemen | Bukan kewajiban memakai gradien di UI. |
| [S13] | Pedoman identitas, halaman tercetak 35: kombinasi elemen | Tidak menyatakan seluruh motif digunakan situs Vokasi saat ini. |
| [S14] | W3C: WCAG 2.2 | Referensi standar, bukan sertifikasi hasil implementasi. |
| [S15] | Repositori anti-slop: filter kualitas desain | Bukan pedoman merek resmi USU. |
| [S16] | Foto ruang CodeStudio pada host konten resmi | Dimensi/ukuran asli dan izin penggunaan ulang belum diperiksa. |
| [S17] | Foto tampak luar Aula Vokasi | Konteks halaman pendukung ada pada [S23]. |
| [S18] | Foto kelompok mahasiswa pada host konten resmi | Nama acara dan tanggal belum dikonfirmasi. |
| [S19] | Foto dokumentasi kelompok dengan penghargaan | Nama acara, tanggal, serta caption perlu verifikasi. |
| [S20] | Foto kelompok besar dalam ruangan | Jangan otomatis disebut dokumentasi acara tertentu. |
| [S21] | Logo putih dari host konten resmi USU | Bukan paket master lockup fakultas lengkap. |
| [S22] | Indeks identitas resmi USU, penghubung ke panduan visual | Periksa pembaruan yang disetujui pengelola merek. |
| [S23] | Halaman Aula Fakultas Vokasi USU | Mendukung konteks foto bangunan, bukan klaim fungsi semua gedung. |

[S01]: https://vokasi.usu.ac.id/id "Beranda Fakultas Vokasi USU"
[S02]: https://vokasi.usu.ac.id/id/pendidikan "Pendidikan Vokasi USU"
[S03]: https://vokasi.usu.ac.id/id/berita/berita-fakultas "Berita Fakultas Vokasi USU"
[S04]: https://vokasi.usu.ac.id/id/tentang/fasilitas "Direktori fasilitas Vokasi USU"
[S05]: https://vokasi.usu.ac.id/id/fasilitas/codestudio "Fasilitas CodeStudio"
[S06]: https://www.usu.ac.id/images/compressed/identitas-usu/pedoman-identitas/pedoman_identitas-31.webp?q=75&w=992 "Panduan USU - Tipografi Public Sans"
[S07]: https://www.usu.ac.id/images/compressed/identitas-usu/pedoman-identitas/pedoman_identitas-32.webp?q=75&w=992 "Panduan USU - Warna formal"
[S08]: https://www.usu.ac.id/images/compressed/identitas-usu/pedoman-identitas/pedoman_identitas-33.webp?q=75&w=992 "Panduan USU - Warna kasual"
[S09]: https://www.usu.ac.id/images/compressed/identitas-usu/pedoman-identitas/pedoman_identitas-35.webp?q=75&w=992 "Panduan USU - Elemen grafis"
[S10]: https://www.usu.ac.id/images/compressed/identitas-usu/pedoman-identitas/pedoman_identitas-27.webp?q=75&w=992 "Panduan USU - Larangan penggunaan logo"
[S11]: https://www.usu.ac.id/images/compressed/identitas-usu/pedoman-identitas/pedoman_identitas-25.webp?q=75&w=992 "Panduan USU - Clear space logo"
[S12]: https://www.usu.ac.id/images/compressed/identitas-usu/pedoman-identitas/pedoman_identitas-36.webp?q=75&w=992 "Panduan USU - Warna dan gradien elemen"
[S13]: https://www.usu.ac.id/images/compressed/identitas-usu/pedoman-identitas/pedoman_identitas-37.webp?q=75&w=992 "Panduan USU - Kombinasi elemen"
[S14]: https://www.w3.org/TR/WCAG22/ "W3C Web Content Accessibility Guidelines 2.2"
[S15]: https://github.com/miqdadbadjuber/anti-slop/blob/main/antislop.md "Anti-slop design quality filter"
[S16]: https://konten.usu.ac.id/storage/year/2025-01/satker/885/statis/fasilitas/IMG_1208.webp "Foto aktivitas ruang CodeStudio"
[S17]: https://konten.usu.ac.id/storage/year/2025-03/satker/885/statis/fasilitas/IMG_1522.webp "Foto eksterior Aula Vokasi"
[S18]: https://konten.usu.ac.id/storage/posts/30624/IMG_7348%20%281%29.webp "Foto kelompok mahasiswa"
[S19]: https://konten.usu.ac.id/storage/posts/Jun-2025/50851/WhatsApp%20Image%202025-06-30%20at%2010.31.26.webp "Foto kelompok dengan penghargaan"
[S20]: https://konten.usu.ac.id/storage/posts/Aug-2025/53178/DSC04989.webp "Foto kegiatan kelompok besar"
[S21]: https://konten.usu.ac.id/storage/satker/44/logos/usu-logo.png "Aset logo putih USU"
[S22]: https://www.usu.ac.id/id/tentang/identitas "Identitas resmi USU"
[S23]: https://vokasi.usu.ac.id/id/fasilitas/aula-fakultas-vokasi-usu "Aula Fakultas Vokasi USU"

---

**Ringkasan keputusan:** gunakan identitas yang sah, Public Sans berbasis panduan, warna hijau-putih dengan aksen kuning terkontrol, fotografi dokumenter, hierarki editorial, direktori yang mudah dipindai, dan komponen fungsional. Bedakan sumber terverifikasi dari adaptasi. Kualitas hasil ditentukan oleh implementasi dan pengujiannya, bukan banyaknya dekorasi atau klaim kemiripan tanpa pengukuran.

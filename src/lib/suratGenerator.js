'use client';

import JSZip from 'jszip';

// 21 Program Studi Fakultas Vokasi USU
export const PRODI_OPTIONS = [
  'D3 Akuntansi',
  'D3 Kesekretariatan',
  'D3 Keuangan',
  'D3 Analis Farmasi dan Makanan',
  'D3 Perpajakan',
  'D3 Bahasa Inggris',
  'D3 Bahasa Jepang',
  'D3 Perpustakaan',
  'D3 Perjalanan Wisata',
  'D3 Fisika',
  'D3 Kimia',
  'D3 Teknik Informatika',
  'D3 Metrologi dan Instrumentasi',
  'D3 Statistika',
  'D4 Perbankan dan Keuangan',
  'D4 Administrasi Perkantoran Digital',
  'D4 Akuntansi Sektor Publik',
  'D4 Statistika',
  'D4 Kimia Terapan',
  'D4 Manajemen Bisnis Pariwisata',
  'D4 Teknologi Rekayasa dan Instrumentasi'
];

// Definition of all 10 templates with their specific fields and demo initial values
export const TEMPLATES_CONFIG = [
  {
    id: 'surat-izin-tidak-ikut-kuliah',
    title: 'Surat Izin Tidak Mengikuti Perkuliahan',
    filename: 'SURAT IZIN TIDAK MENGIKUTI PERKULIAHAN.docx',
    category: 'Akademik & Perkuliahan',
    fileUrl: '/assets/templatesurat/SURAT IZIN TIDAK MENGIKUTI PERKULIAHAN.docx',
    description: 'Permohonan izin dispensasi ketidakhadiran perkuliahan/praktikum karena sakit atau kegiatan resmi.',
    defaultProdi: 'D3 Teknik Informatika',
    fields: [
      { name: 'prodiTujuan', label: 'Program Studi Tujuan', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika' },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Contoh: Wanda Annisa Lubis', required: true },
      { name: 'nim', label: 'Nomor Induk Mahasiswa (NIM)', type: 'text', placeholder: 'Contoh: 220501001', required: true },
      { name: 'prodi', label: 'Program Studi Mahasiswa', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika', required: true },
      { name: 'fakultas', label: 'Fakultas', type: 'text', defaultValue: 'Vokasi' },
      { name: 'alasan', label: 'Alasan Tidak Mengikuti Perkuliahan', type: 'textarea', placeholder: 'Contoh: Sakit demam tinggi dan disarankan dokter untuk istirahat rawat jalan selama 3 hari.', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat (Format: Tanggal Bulan Tahun)', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    sampleDemo: {
      prodiTujuan: 'D3 Teknik Informatika',
      nama: 'Muhammad Farhan',
      nim: '220501019',
      prodi: 'D3 Teknik Informatika',
      fakultas: 'Vokasi',
      alasan: 'mengikuti karantina dan seleksi final Pekan Olahraga Mahasiswa Nasional (POMNAS) mewakili Universitas Sumatera Utara.',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  },
  {
    id: 'surat-permohonan-izin-penelitian',
    title: 'Surat Permohonan Izin Penelitian',
    filename: 'SURAT PERMOHONAN IZIN PENELITIAN.docx',
    category: 'Penelitian & Tugas Akhir',
    fileUrl: '/assets/templatesurat/SURAT PERMOHONAN IZIN PENELITIAN.docx',
    description: 'Surat pengantar permohonan izin pengambilan data / survei untuk tugas akhir/proposal penelitian.',
    fields: [
      { name: 'prodiTujuan', label: 'Program Studi Tujuan', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D4 Manajemen Bisnis Pariwisata' },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Contoh: Aulia Rahma', required: true },
      { name: 'nim', label: 'NIM', type: 'text', placeholder: 'Contoh: 210504012', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D4 Manajemen Bisnis Pariwisata' },
      { name: 'semester', label: 'Semester Saat Ini', type: 'text', placeholder: 'Contoh: VI (Enam)', defaultValue: 'VI (Enam)' },
      { name: 'alamat', label: 'Alamat Tempat Tinggal Mahasiswa', type: 'text', placeholder: 'Contoh: Jl. Dr. Mansur No. 45 Medan' },
      { name: 'judulProposal', label: 'Judul Proposal Penelitian', type: 'textarea', placeholder: 'Contoh: Strategi Pengembangan Desa Wisata Berbasis Kearifan Lokal di Kabupaten Karo', required: true },
      { name: 'lokasiPenelitian', label: 'Lokasi / Objek Penelitian', type: 'text', placeholder: 'Contoh: Dinas Kebudayaan dan Pariwisata Provinsi Sumatera Utara' },
      { name: 'dosenPembimbing', label: 'Nama Dosen Pembimbing', type: 'text', placeholder: 'Contoh: Dr. Ir. Siti Nurhaliza, M.Si.' },
      { name: 'ditujukanKepada', label: 'Ditujukan Kepada (Nama Instansi/Pimpinan)', type: 'text', placeholder: 'Contoh: Kepala Dinas Pariwisata Kota Medan' },
      { name: 'tanggalPenelitian', label: 'Tanggal / Periode Penelitian', type: 'text', placeholder: 'Contoh: 1 Oktober 2026 s/d 10 November 2026' },
      { name: 'tanggalSurat', label: 'Tanggal Surat', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    sampleDemo: {
      prodiTujuan: 'D4 Manajemen Bisnis Pariwisata',
      nama: 'Siti Sarah Siregar',
      nim: '210504028',
      prodi: 'D4 Manajemen Bisnis Pariwisata',
      semester: 'VI (Enam)',
      alamat: 'Jl. Jamin Ginting Padang Bulan Medan No. 128',
      judulProposal: 'Analisis Dampak Digital Marketing Pariwisata Terhadap Kunjungan Wisatawan Mancanegara di Danau Toba',
      lokasiPenelitian: 'Badan Pelaksana Otorita Danau Toba (BPODT) & Dinas Pariwisata Sumut',
      dosenPembimbing: 'Prof. Dr. Drs. Budiman Sinaga, M.M.',
      ditujukanKepada: 'Direktur Utama Badan Pelaksana Otorita Danau Toba (BPODT)',
      tanggalPenelitian: '15 Oktober 2026 s/d 15 November 2026',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  },
  {
    id: 'surat-kehilangan-dokumen',
    title: 'Surat Permohonan Kehilangan KRS / KHS / KTM / Transkrip',
    filename: 'SURAT PERMOHONAN KEHILANGAN KRS, KHS, KTM, TRANSKRIP.docx',
    category: 'Administrasi Akademik',
    fileUrl: '/assets/templatesurat/SURAT PERMOHONAN KEHILANGAN KRS, KHS, KTM, TRANSKRIP.docx',
    description: 'Permohonan penggantian dokumen perkuliahan (KRS, KHS, KTM, atau Transkrip Nilai) yang hilang.',
    fields: [
      { name: 'prodiTujuan', label: 'Program Studi Tujuan', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Akuntansi' },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Akuntansi' },
      { name: 'semester', label: 'Semester', type: 'text', defaultValue: 'IV (Empat)' },
      { name: 'tahunAkademik', label: 'Tahun Akademik', type: 'text', defaultValue: '2025/2026' },
      { name: 'dokumenHilang', label: 'Dokumen yang Hilang', type: 'select', options: ['Kartu Tanda Mahasiswa (KTM)', 'Kartu Rencana Studi (KRS)', 'Kartu Hasil Studi (KHS)', 'Transkrip Nilai Sementara'], defaultValue: 'Kartu Tanda Mahasiswa (KTM)' },
      { name: 'tanggalSurat', label: 'Tanggal Surat', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    sampleDemo: {
      prodiTujuan: 'D3 Akuntansi',
      nama: 'Alif Pratama Lubis',
      nim: '220502011',
      prodi: 'D3 Akuntansi',
      semester: 'IV (Empat)',
      tahunAkademik: '2025/2026',
      dokumenHilang: 'Kartu Tanda Mahasiswa (KTM)',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  },
  {
    id: 'surat-keterangan-aktif-kuliah',
    title: 'Surat Permohonan Keterangan Aktif Kuliah Mahasiswa',
    filename: 'SURAT PERMOHONAN KETERANGAN AKTIF KULIAH MAHASISWA.docx',
    category: 'Administrasi Kemahasiswaan',
    fileUrl: '/assets/templatesurat/SURAT PERMOHONAN KETERANGAN AKTIF KULIAH MAHASISWA.docx',
    description: 'Surat keterangan resmi aktif kuliah untuk berbagai keperluan umum, beasiswa, bank, atau dinas.',
    fields: [
      { name: 'prodiTujuan', label: 'Program Studi Tujuan', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika' },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika' },
      { name: 'semester', label: 'Semester', type: 'text', defaultValue: 'IV (Empat)' },
      { name: 'tahunAkademik', label: 'Tahun Akademik', type: 'text', defaultValue: '2025/2026' },
      { name: 'ttl', label: 'Tempat, Tanggal Lahir', type: 'text', placeholder: 'Contoh: Medan, 14 Mei 2004' },
      { name: 'noHp', label: 'Nomor Telepon / WhatsApp', type: 'text', placeholder: 'Contoh: 081234567890' },
      { name: 'keperluan', label: 'Untuk Keperluan', type: 'text', placeholder: 'Contoh: Pengurusan Pembukaan Rekening Bank BNI & Pengajuan Beasiswa', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    sampleDemo: {
      prodiTujuan: 'D3 Teknik Informatika',
      nama: 'Bagas Wahyudi',
      nim: '220501034',
      prodi: 'D3 Teknik Informatika',
      semester: 'IV (Empat)',
      tahunAkademik: '2025/2026',
      ttl: 'Medan, 22 Agustus 2004',
      noHp: '0821-6543-9871',
      keperluan: 'Kelengkapan Berkas Pendaftaran Magang Bersama BUMN 2026',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  },
  {
    id: 'surat-magang-kelompok',
    title: 'Surat Permohonan Magang Kelompok',
    filename: 'SURAT PERMOHONAN MAGANG KELOMPOK.docx',
    category: 'Karir & Magang Industri',
    fileUrl: '/assets/templatesurat/SURAT PERMOHONAN MAGANG KELOMPOK.docx',
    description: 'Surat pengantar permohonan magang industri untuk kelompok mahasiswa pada perusahaan mitra.',
    isGroup: true,
    fields: [
      { name: 'prodiTujuan', label: 'Program Studi Tujuan', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika' },
      { name: 'nama', label: 'Nama Ketua / Pemohon', type: 'text', placeholder: 'Nama Ketua Kelompok', required: true },
      { name: 'nim', label: 'NIM Ketua', type: 'text', placeholder: 'NIM Ketua', required: true },
      { name: 'prodi', label: 'Program Studi Ketua', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika' },
      { name: 'perusahaan', label: 'Nama Perusahaan / Instansi', type: 'text', placeholder: 'Contoh: PT Telekomunikasi Indonesia Tbk (Telkom Medan)', required: true },
      { name: 'alamatPerusahaan', label: 'Alamat Perusahaan / Instansi', type: 'text', placeholder: 'Contoh: Jl. Putri Hijau No. 1 Medan' },
      { name: 'kotaTujuan', label: 'Kota Tujuan', type: 'text', defaultValue: 'Medan' },
      { name: 'tanggalMagang', label: 'Tanggal / Durasi Magang', type: 'text', placeholder: 'Contoh: 1 Juli 2026 s/d 31 Agustus 2026' },
      { name: 'tanggalSurat', label: 'Tanggal Surat', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    defaultMembers: [
      { nama: 'Dinda Permata', nim: '220501005', prodi: 'D3 Teknik Informatika' },
      { nama: 'Rian Syahputra', nim: '220501014', prodi: 'D3 Teknik Informatika' }
    ],
    sampleDemo: {
      prodiTujuan: 'D3 Teknik Informatika',
      nama: 'Wanda Annisa Lubis',
      nim: '220501001',
      prodi: 'D3 Teknik Informatika',
      perusahaan: 'PT Bank Mandiri (Persero) Tbk Regional I Medan',
      alamatPerusahaan: 'Jl. Pulau Pinang No. 1 Kesawan Medan',
      kotaTujuan: 'Medan',
      tanggalMagang: '1 Juli 2026 s/d 31 Agustus 2026',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  },
  {
    id: 'surat-magang-pribadi',
    title: 'Surat Permohonan Magang Pribadi',
    filename: 'SURAT PERMOHONAN MAGANG PRIBADI.docx',
    category: 'Karir & Magang Industri',
    fileUrl: '/assets/templatesurat/SURAT PERMOHONAN MAGANG PRIBADI.docx',
    description: 'Surat pengantar permohonan magang industri perorangan / mandiri ke instansi/perusahaan.',
    fields: [
      { name: 'prodiTujuan', label: 'Program Studi Tujuan', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D4 Administrasi Perkantoran Digital' },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D4 Administrasi Perkantoran Digital' },
      { name: 'perusahaan', label: 'Nama Perusahaan / Instansi', type: 'text', placeholder: 'Contoh: PT Pelindo Multi Terminal', required: true },
      { name: 'alamatPerusahaan', label: 'Alamat Perusahaan', type: 'text', placeholder: 'Contoh: Jl. Krakatau No. 100 Medan' },
      { name: 'kotaTujuan', label: 'Kota Tujuan', type: 'text', defaultValue: 'Medan' },
      { name: 'tanggalMagang', label: 'Tanggal / Durasi Magang', type: 'text', placeholder: 'Contoh: 15 Juli 2026 s/d 15 September 2026' },
      { name: 'tanggalSurat', label: 'Tanggal Surat', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    sampleDemo: {
      prodiTujuan: 'D4 Administrasi Perkantoran Digital',
      nama: 'Nabila Azzahra',
      nim: '210502044',
      prodi: 'D4 Administrasi Perkantoran Digital',
      perusahaan: 'Kantor Wilayah Ditjen Pajak Sumatera Utara I',
      alamatPerusahaan: 'Jl. Suka Mulia No. 17A Medan',
      kotaTujuan: 'Medan',
      tanggalMagang: '1 Agustus 2026 s/d 30 September 2026',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  },
  {
    id: 'surat-pernyataan-aktif-tunjangan-ortu',
    title: 'Surat Pernyataan Aktif Kuliah Untuk Tunjangan Orang Tua',
    filename: 'SURAT PERMOHONAN PERNYATAAN AKTIF KULIAH UNTUK BIAYA TANGGUNGAN ORANG TUA.docx',
    category: 'Tunjangan & Kedinasan',
    fileUrl: '/assets/templatesurat/SURAT PERMOHONAN PERNYATAAN AKTIF KULIAH UNTUK BIAYA TANGGUNGAN ORANG TUA.docx',
    description: 'Surat pernyataan resmi tanggungan orang tua untuk pencairan tunjangan anak (PNS/TNI/Polri/BUMN).',
    fields: [
      { name: 'prodiTujuan', label: 'Program Studi Tujuan', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Perpajakan' },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Perpajakan' },
      { name: 'semester', label: 'Semester', type: 'text', defaultValue: 'IV (Empat)' },
      { name: 'ttl', label: 'Tempat, Tanggal Lahir Mahasiswa', type: 'text', placeholder: 'Contoh: Tebing Tinggi, 10 Januari 2004' },
      { name: 'alamat', label: 'Alamat Mahasiswa', type: 'text', placeholder: 'Alamat Lengkap Mahasiswa' },
      { name: 'noHp', label: 'No. HP Mahasiswa', type: 'text', placeholder: '0812-xxxx-xxxx' },
      { name: 'namaOrangTua', label: 'Nama Orang Tua (Ayah / Ibu)', type: 'text', placeholder: 'Contoh: Drs. Suhendra Lubis', required: true },
      { name: 'nipOrangTua', label: 'NIP / NRP / NIK / No. Pensiun', type: 'text', placeholder: 'Contoh: 19700512 199603 1 002', required: true },
      { name: 'instansiOrangTua', label: 'Instansi Tempat Bekerja Orang Tua', type: 'text', placeholder: 'Contoh: Dinas Pendidikan Provinsi Sumatera Utara', required: true },
      { name: 'alamatOrangTua', label: 'Alamat Orang Tua', type: 'text', placeholder: 'Contoh: Jl. Kolonel Sugiono No. 24 Tebing Tinggi' },
      { name: 'tahunAkademik', label: 'Tahun Akademik Aktif', type: 'text', defaultValue: '2025/2026' },
      { name: 'tanggalSurat', label: 'Tanggal Surat', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    sampleDemo: {
      prodiTujuan: 'D3 Perpajakan',
      nama: 'Wanda Annisa Lubis',
      nim: '220501001',
      prodi: 'D3 Perpajakan',
      semester: 'IV (Empat)',
      ttl: 'Medan, 15 Juli 2004',
      alamat: 'Jl. Karya Bakti No. 12 Medan',
      noHp: '0812-6000-8654',
      namaOrangTua: 'Drs. H. M. Lubis, M.Pd.',
      nipOrangTua: '19680315 199303 1 004',
      instansiOrangTua: 'Pemerintah Provinsi Sumatera Utara',
      alamatOrangTua: 'Jl. Karya Bakti No. 12 Medan',
      tahunAkademik: '2025/2026',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  },
  {
    id: 'surat-pkl-kelompok',
    title: 'Surat Permohonan Praktik Kerja Lapangan (PKL) Kelompok',
    filename: 'SURAT PERMOHONAN PRAKTEK KERJA LAPANGAN KELOMPOK.docx',
    category: 'Praktik Kerja Lapangan (PKL)',
    fileUrl: '/assets/templatesurat/SURAT PERMOHONAN PRAKTEK KERJA LAPANGAN KELOMPOK.docx',
    description: 'Surat pengantar permohonan PKL bersama secara kelompok ke institusi atau dunia industri.',
    isGroup: true,
    fields: [
      { name: 'prodiTujuan', label: 'Program Studi Tujuan', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Metrologi dan Instrumentasi' },
      { name: 'nama', label: 'Nama Ketua / Pemohon', type: 'text', placeholder: 'Nama Ketua', required: true },
      { name: 'nim', label: 'NIM Ketua', type: 'text', placeholder: 'NIM Ketua', required: true },
      { name: 'prodi', label: 'Program Studi Ketua', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Metrologi dan Instrumentasi' },
      { name: 'perusahaan', label: 'Nama Perusahaan / Industri', type: 'text', placeholder: 'Contoh: PT Pertamina Gas (Pertagas) Northern Sumatra Area', required: true },
      { name: 'alamatPerusahaan', label: 'Alamat Perusahaan', type: 'text', placeholder: 'Alamat Perusahaan' },
      { name: 'kotaTujuan', label: 'Kota Tujuan', type: 'text', defaultValue: 'Medan' },
      { name: 'tanggalPKL', label: 'Tanggal / Periode PKL', type: 'text', placeholder: 'Contoh: 1 Agustus 2026 s/d 30 September 2026' },
      { name: 'tanggalSurat', label: 'Tanggal Surat', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    defaultMembers: [
      { nama: 'Fajar Hidayat', nim: '220501021', prodi: 'D3 Metrologi dan Instrumentasi' },
      { nama: 'Teguh Prasetyo', nim: '220501035', prodi: 'D3 Metrologi dan Instrumentasi' }
    ],
    sampleDemo: {
      prodiTujuan: 'D3 Metrologi dan Instrumentasi',
      nama: 'Indra Pratama',
      nim: '220501015',
      prodi: 'D3 Metrologi dan Instrumentasi',
      perusahaan: 'Balai Standardisasi dan Pelayanan Jasa Industri (BSPJI) Medan',
      alamatPerusahaan: 'Jl. Sisingamangaraja No. 24 Medan',
      kotaTujuan: 'Medan',
      tanggalPKL: '1 Agustus 2026 s/d 30 September 2026',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  },
  {
    id: 'surat-pkl-pribadi',
    title: 'Surat Permohonan Praktik Kerja Lapangan (PKL) Pribadi',
    filename: 'SURAT PERMOHONAN PRAKTEK KERJA LAPANGAN PRIBADI.docx',
    category: 'Praktik Kerja Lapangan (PKL)',
    fileUrl: '/assets/templatesurat/SURAT PERMOHONAN PRAKTEK KERJA LAPANGAN PRIBADI.docx',
    description: 'Surat pengantar permohonan pelaksanaan PKL individu pada instansi industri.',
    fields: [
      { name: 'prodiTujuan', label: 'Program Studi Tujuan', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D4 Kimia Terapan' },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D4 Kimia Terapan' },
      { name: 'perusahaan', label: 'Nama Perusahaan / Lab Industri', type: 'text', placeholder: 'Contoh: PT Socfin Indonesia (Socfindo)', required: true },
      { name: 'alamatPerusahaan', label: 'Alamat Perusahaan', type: 'text', placeholder: 'Contoh: Jl. K.L. Yos Sudarso No. 106 Medan' },
      { name: 'kotaTujuan', label: 'Kota Tujuan', type: 'text', defaultValue: 'Medan' },
      { name: 'tanggalPKL', label: 'Tanggal / Periode PKL', type: 'text', placeholder: 'Contoh: 1 Juli 2026 s/d 31 Agustus 2026' },
      { name: 'tanggalSurat', label: 'Tanggal Surat', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    sampleDemo: {
      prodiTujuan: 'D4 Kimia Terapan',
      nama: 'Cut Meutia',
      nim: '210503017',
      prodi: 'D4 Kimia Terapan',
      perusahaan: 'Pusat Penelitian Kelapa Sawit (PPKS) Medan',
      alamatPerusahaan: 'Jl. Brigjen Katamso No. 51 Medan',
      kotaTujuan: 'Medan',
      tanggalPKL: '1 Juli 2026 s/d 31 Agustus 2026',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  },
  {
    id: 'surat-rekomendasi-beasiswa',
    title: 'Surat Permohonan Rekomendasi Beasiswa',
    filename: 'SURAT PERMOHONAN REKOMENDASI BEASISWA.docx',
    category: 'Beasiswa & Prestasi',
    fileUrl: '/assets/templatesurat/SURAT PERMOHONAN REKOMENDASI BEASISWA.docx',
    description: 'Surat rekomendasi resmi dari pimpinan fakultas sebagai syarat mendaftar beasiswa.',
    fields: [
      { name: 'prodiTujuan', label: 'Program Studi Tujuan', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika' },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika' },
      { name: 'semester', label: 'Semester', type: 'text', defaultValue: 'IV (Empat)' },
      { name: 'ipk', label: 'Indeks Prestasi Kumulatif (IPK)', type: 'text', placeholder: 'Contoh: 3.85', defaultValue: '3.85', required: true },
      { name: 'ttl', label: 'Tempat, Tanggal Lahir', type: 'text', placeholder: 'Contoh: Medan, 10 Januari 2004' },
      { name: 'alamat', label: 'Alamat Mahasiswa', type: 'text', placeholder: 'Alamat Lengkap Mahasiswa' },
      { name: 'noHp', label: 'No. HP / WhatsApp', type: 'text', placeholder: '0812-xxxx-xxxx' },
      { name: 'namaBeasiswa', label: 'Nama Program Beasiswa yang Diajukan', type: 'text', placeholder: 'Contoh: Beasiswa Bank Indonesia Tahun 2026', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    sampleDemo: {
      prodiTujuan: 'D3 Teknik Informatika',
      nama: 'Wanda Annisa Lubis',
      nim: '220501001',
      prodi: 'D3 Teknik Informatika',
      semester: 'IV (Empat)',
      ipk: '3.92',
      ttl: 'Medan, 15 Juli 2004',
      alamat: 'Jl. Karya Bakti No. 12 Medan',
      noHp: '0812-6000-8654',
      namaBeasiswa: 'Beasiswa Bank Indonesia (GenBI) Tahun 2026',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  },
  {
    id: 'surat-keterangan-lulus',
    title: 'Permohonan Surat Keterangan Lulus (SKL)',
    filename: 'Permohonan Surat Keterangan Lulus.docx',
    category: 'Kelulusan & Alumni',
    fileUrl: '/assets/templatesurat/Permohonan Surat Keterangan Lulus.docx',
    description: 'Surat permohonan penerbitan SKL dari Dekan Fakultas Vokasi USU bagi lulusan yudisium.',
    fields: [
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Contoh: Wanda Annisa Lubis', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'Contoh: 220501001', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika', required: true },
      { name: 'ttl', label: 'Tempat, Tanggal Lahir', type: 'text', placeholder: 'Contoh: Medan, 10 Januari 2004' },
      { name: 'alamat', label: 'Alamat Tempat Tinggal', type: 'text', placeholder: 'Contoh: Jl. Dr. Mansur No. 45 Medan' },
      { name: 'tanggalLulus', label: 'Hari / Tanggal Lulus Sidang', type: 'text', placeholder: 'Contoh: Senin, 15 Juli 2026' },
      { name: 'judulTA', label: 'Judul Tugas Akhir', type: 'textarea', placeholder: 'Contoh: Rancang Bangun Sistem Informasi...' },
      { name: 'ipk', label: 'Indeks Prestasi Kumulatif (IPK)', type: 'text', placeholder: 'Contoh: 3.85', defaultValue: '3.85' },
      { name: 'noHp', label: 'Nomor Handphone / WA', type: 'text', placeholder: '0812-xxxx-xxxx' },
      { name: 'tanggalSurat', label: 'Tanggal Surat', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    sampleDemo: {
      nama: 'Aulia Rahma',
      nim: '210504012',
      prodi: 'D4 Manajemen Bisnis Pariwisata',
      ttl: 'Medan, 12 Agustus 2003',
      alamat: 'Jl. Padang Bulan No. 88 Medan',
      tanggalLulus: 'Jumat, 10 Juli 2026',
      judulTA: 'Strategi Promosi Ekowisata Berkelanjutan di Kawasan Geopark Kaldera Toba',
      ipk: '3.88',
      noHp: '0812-6543-2109',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  },
  {
    id: 'surat-penyerahan-tugas-akhir',
    title: 'Surat Penyerahan Tugas Akhir',
    filename: 'Surat Penyerahan Tugas Akhir.docx',
    category: 'Penelitian & Tugas Akhir',
    fileUrl: '/assets/templatesurat/Surat Penyerahan Tugas Akhir.docx',
    description: 'Bukti penyerahan berkas Tugas Akhir sebagai syarat bebas administrasi wisuda.',
    fields: [
      { name: 'nama', label: 'Nama Mahasiswa', type: 'text', placeholder: 'Contoh: Rizky Pratama', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'Contoh: 210501044', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika', required: true },
      { name: 'judulTA', label: 'Judul Tugas Akhir', type: 'textarea', placeholder: 'Contoh: Implementasi Artificial Intelligence...', required: true },
      { name: 'dosenPembimbing', label: 'Nama Dosen Pembimbing', type: 'text', placeholder: 'Contoh: Dr. Ir. Solahuddin Nasution' },
      { name: 'dosenPenguji', label: 'Nama Dosen Penguji', type: 'text', placeholder: 'Contoh: Prof. Dr. Budiman Sinaga' },
      { name: 'kaprodi', label: 'Nama Ketua Program Studi', type: 'text', placeholder: 'Nama Kaprodi' },
      { name: 'tanggalSurat', label: 'Tanggal Penyerahan', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    sampleDemo: {
      nama: 'Rizky Pratama',
      nim: '210501044',
      prodi: 'D3 Teknik Informatika',
      judulTA: 'Pengembangan Portal Penjaminan Mutu dan Kemahasiswaan Fakultas Vokasi Universitas Sumatera Utara',
      dosenPembimbing: 'Dr. Solahuddin Nasution, S.E., M.SP.',
      dosenPenguji: 'Prof. Dr. Budiman Sinaga, M.M.',
      kaprodi: 'Ketua Program Studi D3 Teknik Informatika',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  },
  {
    id: 'surat-keterlambatan-spp',
    title: 'Surat Permohonan Keterlambatan Pembayaran SPP (Pembukaan VA)',
    filename: 'Surat Permohonan Keterlambatan Pembayaran SPP.docx',
    category: 'Administrasi & Keuangan',
    fileUrl: '/assets/templatesurat/Surat Permohonan Keterlambatan Pembayaran SPP.docx',
    description: 'Permohonan pembukaan kembali Virtual Account pembayaran SPP/UKT.',
    fields: [
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Akuntansi', required: true },
      { name: 'semester', label: 'Semester', type: 'text', defaultValue: 'V (Lima)' },
      { name: 'tahunAkademik', label: 'Tahun Akademik', type: 'text', defaultValue: '2026/2027' },
      { name: 'alasan', label: 'Alasan Keterlambatan Pembayaran SPP', type: 'textarea', placeholder: 'Jelaskan kendala keterlambatan pembayaran SPP/UKT...', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    sampleDemo: {
      nama: 'Nurul Hidayah',
      nim: '220502015',
      prodi: 'D3 Akuntansi',
      semester: 'V (Lima)',
      tahunAkademik: '2026/2027',
      alasan: 'kendala teknis sistem perbankan saat transfer serta menunggu pencairan dana talangan keluarga',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  },
  {
    id: 'surat-pengunduran-diri',
    title: 'Surat Permohonan Pengunduran Diri',
    filename: 'Surat Permohonan Pengunduran Diri.docx',
    category: 'Administrasi Akademik',
    fileUrl: '/assets/templatesurat/Surat Permohonan Pengunduran Diri.docx',
    description: 'Permohonan pengunduran diri resmi sebagai mahasiswa Program Studi Fakultas Vokasi USU.',
    fields: [
      { name: 'prodiTujuan', label: 'Program Studi Anda', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Keuangan' },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Keuangan' },
      { name: 'alasan', label: 'Alasan Pengunduran Diri', type: 'textarea', placeholder: 'Jelaskan secara singkat alasan Anda (pribadi / kesehatan / pekerjaan)...', required: true },
      { name: 'namaOrangTua', label: 'Nama Orang Tua / Wali', type: 'text', placeholder: 'Nama Orang Tua', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    sampleDemo: {
      prodiTujuan: 'D3 Keuangan',
      nama: 'Bagus Setiawan',
      nim: '220503022',
      prodi: 'D3 Keuangan',
      alasan: 'diterima bekerja purnawaktu sebagai staf operasional perbankan di luar kota',
      namaOrangTua: 'H. Sudirman, S.E.',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  },
  {
    id: 'surat-undangan-ujian-ta',
    title: 'Surat Permohonan Undangan Ujian Tugas Akhir',
    filename: 'Surat Permohonan Undangan Ujian Tugas Akhir.docx',
    category: 'Penelitian & Tugas Akhir',
    fileUrl: '/assets/templatesurat/Surat Permohonan Undangan Ujian Tugas Akhir.docx',
    description: 'Permohonan kepada Ketua Program Studi untuk penerbitan Undangan Ujian Tugas Akhir.',
    fields: [
      { name: 'prodiTujuan', label: 'Program Studi Anda', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D4 Akuntansi Sektor Publik' },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D4 Akuntansi Sektor Publik' },
      { name: 'hariTanggal', label: 'Hari, Tanggal Ujian', type: 'text', placeholder: 'Contoh: Rabu, 20 Oktober 2026' },
      { name: 'pukul', label: 'Pukul / Jam Ujian', type: 'text', placeholder: 'Contoh: 09.00 - 11.00 WIB' },
      { name: 'tempat', label: 'Tempat / Ruang Ujian', type: 'text', placeholder: 'Contoh: Ruang Sidang Vokasi Gd. B Lt. 2' },
      { name: 'dosenPembimbing', label: 'Dosen Pembimbing', type: 'text', placeholder: 'Nama Dosen Pembimbing' },
      { name: 'dosenPenguji', label: 'Dosen Penguji', type: 'text', placeholder: 'Nama Dosen Penguji' },
      { name: 'judulTA', label: 'Judul Tugas Akhir (Bahasa Indonesia)', type: 'textarea', placeholder: 'Judul Tugas Akhir Bahasa Indonesia', required: true },
      { name: 'judulTAEn', label: 'Judul Tugas Akhir (Bahasa Inggris)', type: 'textarea', placeholder: 'Judul Tugas Akhir Bahasa Inggris' },
      { name: 'tanggalSurat', label: 'Tanggal Surat', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    sampleDemo: {
      prodiTujuan: 'D4 Akuntansi Sektor Publik',
      nama: 'Indah Permatasari',
      nim: '210502088',
      prodi: 'D4 Akuntansi Sektor Publik',
      hariTanggal: 'Kamis, 15 Oktober 2026',
      pukul: '09.30 - 11.30 WIB',
      tempat: 'Ruang Sidang Utama Fakultas Vokasi Lt. 2',
      dosenPembimbing: 'Dr. Solahuddin Nasution, S.E., M.SP.',
      dosenPenguji: 'Dra. Hj. Nurminah Lubis, M.Si., Ak.',
      judulTA: 'Analisis Akuntabilitas Pengelolaan Alokasi Dana Desa pada Pemerintah Kabupaten Deli Serdang',
      judulTAEn: 'Accountability Analysis of Village Fund Allocation Management in Deli Serdang Regency Government',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  },
  {
    id: 'surat-bebas-administrasi',
    title: 'Surat Pernyataan Bebas Administrasi (Ijazah dan Transkrip)',
    filename: 'Surat Pernyataan Bebas Administrasi (Ijazah dan Transkrip).docx',
    category: 'Kelulusan & Alumni',
    fileUrl: '/assets/templatesurat/Surat Pernyataan Bebas Administrasi (Ijazah dan Transkrip).docx',
    description: 'Pernyataan bebas administrasi akademik, keuangan, perpustakaan, dan toga untuk ijazah.',
    fields: [
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika', required: true },
      { name: 'periodeWisuda', label: 'Periode Wisuda', type: 'text', placeholder: 'Contoh: Periode I TA 2026/2027 (November 2026)' },
      { name: 'noHp', label: 'Nomor Telepon / HP', type: 'text', placeholder: '0812-xxxx-xxxx' },
      { name: 'kaprodi', label: 'Nama Ketua Program Studi', type: 'text', placeholder: 'Nama Kaprodi' },
      { name: 'tanggalSurat', label: 'Tanggal Pernyataan', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    sampleDemo: {
      nama: 'Wanda Annisa Lubis',
      nim: '220501001',
      prodi: 'D3 Teknik Informatika',
      periodeWisuda: 'Periode I TA 2026/2027 (November 2026)',
      noHp: '0812-6000-8654',
      kaprodi: 'Ketua Program Studi D3 Teknik Informatika',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  },
  {
    id: 'surat-rekomendasi-akk',
    title: 'Surat Rekomendasi dan Permohonan Aktif Kuliah Kembali (AKK)',
    filename: 'Surat Rekomendasi dan Permohonan AKK.docx',
    category: 'Administrasi Akademik',
    fileUrl: '/assets/templatesurat/Surat Rekomendasi dan Permohonan AKK.docx',
    description: 'Permohonan aktif kuliah kembali setelah cuti akademik/PKA kepada Dekan Fakultas Vokasi.',
    fields: [
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Analis Farmasi dan Makanan', required: true },
      { name: 'semester', label: 'Semester Akan Aktif', type: 'text', defaultValue: 'V (Ganjil)' },
      { name: 'tahunAkademik', label: 'Tahun Akademik', type: 'text', defaultValue: '2026/2027' },
      { name: 'alasan', label: 'Alasan Tidak Aktif Sebelumnya', type: 'text', placeholder: 'Contoh: Cuti Akademik karena kondisi kesehatan' },
      { name: 'noHp', label: 'Nomor HP / WhatsApp', type: 'text', placeholder: '0812-xxxx-xxxx' },
      { name: 'alamat', label: 'Alamat Tinggal Mahasiswa', type: 'text', placeholder: 'Alamat Lengkap Mahasiswa' },
      { name: 'tanggalSurat', label: 'Tanggal Surat', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    sampleDemo: {
      nama: 'Faisal Akbar',
      nim: '220504018',
      prodi: 'D3 Analis Farmasi dan Makanan',
      semester: 'V (Ganjil)',
      tahunAkademik: '2026/2027',
      alasan: 'Cuti Akademik karena pemulihan pasca operasi kesehatan',
      noHp: '0813-7788-9900',
      alamat: 'Jl. Jamin Ginting Km 8 Medan',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  },
  {
    id: 'surat-rekomendasi-pka',
    title: 'Surat Rekomendasi dan Permohonan Penundaan Kegiatan Akademik (PKA)',
    filename: 'Surat Rekomendasi dan Permohonan PKA.docx',
    category: 'Administrasi Akademik',
    fileUrl: '/assets/templatesurat/Surat Rekomendasi dan Permohonan PKA.docx',
    description: 'Permohonan penundaan kegiatan akademik / cuti perkuliahan resmi mahasiswa vokasi.',
    fields: [
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika', required: true },
      { name: 'semester', label: 'Semester yang Diajukan PKA', type: 'text', defaultValue: 'III (Ganjil)' },
      { name: 'tahunAkademik', label: 'Tahun Akademik PKA', type: 'text', defaultValue: '2026/2027' },
      { name: 'alasan', label: 'Alasan Penundaan Kegiatan Akademik', type: 'textarea', placeholder: 'Jelaskan alasan pengajuan cuti/PKA...', required: true },
      { name: 'namaOrangTua', label: 'Nama Orang Tua / Wali', type: 'text', placeholder: 'Nama Orang Tua / Wali', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    sampleDemo: {
      nama: 'Dimas Anggara',
      nim: '230501055',
      prodi: 'D3 Teknik Informatika',
      semester: 'III (Ganjil)',
      tahunAkademik: '2026/2027',
      alasan: 'fokus menjalani perawatan medis dan pendampingan keluarga',
      namaOrangTua: 'Bambang Kusumo',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  },
  {
    id: 'surat-perubahan-data-pddikti',
    title: 'Surat Permohonan Perubahan Data Mahasiswa (PDM) Pada PDDIKTI',
    filename: 'Surat Permohonan Perubahan Data Mahasiswa (Pdm) Pada Pddikti.docx',
    category: 'Administrasi Akademik',
    fileUrl: '/assets/templatesurat/Surat Permohonan Perubahan Data Mahasiswa (Pdm) Pada Pddikti.docx',
    description: 'Permohonan perubahan atau perbaikan biodata mahasiswa pada Pangkalan Data Pendidikan Tinggi (PDDIKTI).',
    fields: [
      { name: 'prodiTujuan', label: 'Program Studi Tujuan (Kaprodi)', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika' },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika', required: true },
      { name: 'tempatLahir', label: 'Tempat Lahir', type: 'text', placeholder: 'Contoh: Medan', required: true },
      { name: 'tanggalLahir', label: 'Tanggal Lahir', type: 'text', placeholder: 'Contoh: 14 Mei 2004', required: true },
      { name: 'namaIbuKandung', label: 'Nama Ibu Kandung', type: 'text', placeholder: 'Nama Ibu Kandung', required: true },
      { name: 'nomorIjazahNasional', label: 'Nomor Ijazah Nasional', type: 'text', placeholder: 'Contoh: 12345/D3/2026 atau - (belum lulus)', defaultValue: '-' },
      { name: 'nomorTranskripNilai', label: 'Nomor Transkrip Nilai', type: 'text', placeholder: 'Contoh: TR-2026-0012 atau -', defaultValue: '-' },
      { name: 'noHpEmail', label: 'Nomor HP & Email Mahasiswa', type: 'text', placeholder: '0812-xxxx-xxxx / mhs@students.usu.ac.id', required: true },
      { name: 'dataTercatat', label: 'Data yang Tercatat pada PDDIKTI', type: 'text', placeholder: 'Contoh: Wanda Anisa (Data keliru di PDDIKTI)', required: true },
      { name: 'dataSeharusnya', label: 'Data yang Seharusnya (Benar)', type: 'text', placeholder: 'Contoh: Wanda Annisa Lubis (Sesuai Ijazah/Akta)', required: true },
      { name: 'alasanPerubahan', label: 'Alasan Perubahan Data', type: 'textarea', placeholder: 'Contoh: Penyesuaian ejaan nama lengkap agar sesuai dengan Akta Kelahiran dan Ijazah SMA.', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat', type: 'text', defaultValue: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }
    ],
    sampleDemo: {
      prodiTujuan: 'D3 Teknik Informatika',
      nama: 'Wanda Annisa Lubis',
      nim: '220501001',
      prodi: 'D3 Teknik Informatika',
      tempatLahir: 'Medan',
      tanggalLahir: '14 Mei 2004',
      namaIbuKandung: 'Nurhalimah',
      nomorIjazahNasional: '-',
      nomorTranskripNilai: 'TR-2026-0012',
      noHpEmail: '0812-6000-8654 / wanda@students.usu.ac.id',
      dataTercatat: 'Wanda Anisa',
      dataSeharusnya: 'Wanda Annisa Lubis',
      alasanPerubahan: 'Penyesuaian ejaan nama lengkap agar sinkron dengan Akta Kelahiran, Kartu Keluarga, dan Ijazah SMA.',
      tanggalSurat: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    }
  }
];

// Helper to escape XML characters
function escapeXml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate Word .docx Document by injecting form values into the original template XML
 */
export async function generateWordDocument(templateConfig, formData, membersList = []) {
  try {
    // 1. Fetch original .docx template buffer
    const response = await fetch(templateConfig.fileUrl);
    if (!response.ok) {
      throw new Error(`Gagal memuat berkas template: ${templateConfig.filename}`);
    }
    const templateBuffer = await response.arrayBuffer();

    // 2. Open zip with JSZip
    const zip = await JSZip.loadAsync(templateBuffer);
    let docXml = await zip.file('word/document.xml').async('string');

    // 3. Extract and parse paragraphs
    const paragraphs = docXml.match(/<w:p[\s\S]*?<\/w:p>/g) || [];

    // Helper: update text of a specific paragraph while retaining properties
    function setParagraphText(pXml, newText, isBold = false) {
      // Find or retain w:pPr
      const pPrMatch = pXml.match(/<w:pPr[\s\S]*?<\/w:pPr>/);
      const pPr = pPrMatch ? pPrMatch[0] : '';
      const escaped = escapeXml(newText);
      const boldTag = isBold ? '<w:b/>' : '';
      return `<w:p>${pPr}<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>${boldTag}</w:rPr><w:t xml:space="preserve">${escaped}</w:t></w:r></w:p>`;
    }

    // Helper: build standard line "Label <tab>: <tab> Value"
    function buildLabelLine(label, value) {
      const escLabel = escapeXml(label);
      const escValue = escapeXml(value);
      return `<w:p><w:pPr><w:tabs><w:tab w:val="left" w:pos="2400"/></w:tabs><w:spacing w:after="0" w:line="276" w:lineRule="auto"/><w:jc w:val="both"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/></w:rPr><w:t xml:space="preserve">${escLabel} </w:t></w:r><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/></w:rPr><w:tab/></w:r><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/></w:rPr><w:t xml:space="preserve">: </w:t></w:r><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/><w:b/></w:rPr><w:t xml:space="preserve">${escValue}</w:t></w:r></w:p>`;
    }

    // 4. Transform XML based on template ID
    // Replace Header Program Studi Tujuan
    const prodiTujuan = formData.prodiTujuan || formData.prodi || 'Fakultas Vokasi';
    paragraphs.forEach((pXml) => {
      const plainText = (pXml.match(/<w:t[\s\S]*?>([\s\S]*?)<\/w:t>/g) || []).map(t => t.replace(/<[^>]+>/g, '')).join('');

      // Header prodi target replacement
      if (plainText.includes('Manajemen Bisnis Pariwisata') || plainText.includes('D4 – Manajemen') || plainText.includes('D4 - Manajemen')) {
        docXml = docXml.replace(pXml, setParagraphText(pXml, prodiTujuan, false));
      }

      // Fields replacements
      if (plainText.startsWith('Nama :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Nama', formData.nama || ''));
      }
      if (plainText.startsWith('NIM :')) {
        docXml = docXml.replace(pXml, buildLabelLine('NIM', formData.nim || ''));
      }
      if (plainText.startsWith('Program Studi :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Program Studi', formData.prodi || ''));
      }
      if (plainText.startsWith('Fakultas:') || plainText.startsWith('Fakultas :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Fakultas', formData.fakultas || 'Vokasi'));
      }
      if (plainText.startsWith('Semester:') || plainText.startsWith('Semester :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Semester', formData.semester || ''));
      }
      if (plainText.startsWith('Tahun Akademik:') || plainText.startsWith('Tahun Akademik :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Tahun Akademik', formData.tahunAkademik || '2025/2026'));
      }
      if (plainText.startsWith('Tempat, Tanggal Lahir:') || plainText.startsWith('Tempat, Tanggal Lahir :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Tempat, Tanggal Lahir', formData.ttl || ''));
      }
      if (plainText.startsWith('No. Telepon/HP:') || plainText.startsWith('No. Telepon/HP :')) {
        docXml = docXml.replace(pXml, buildLabelLine('No. Telepon/HP', formData.noHp || ''));
      }
      if (plainText.startsWith('Alamat Mahasiswa:') || plainText.startsWith('Alamat Mahasiswa :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Alamat Mahasiswa', formData.alamat || ''));
      }
      if (plainText.startsWith('IPK:') || plainText.startsWith('IPK :')) {
        docXml = docXml.replace(pXml, buildLabelLine('IPK', formData.ipk || ''));
      }
      if (plainText.startsWith('Judul Proposal:') || plainText.startsWith('Judul Proposal :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Judul Proposal', formData.judulProposal || ''));
      }
      if (plainText.startsWith('Lokasi Penelitian:') || plainText.startsWith('Lokasi Penelitian :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Lokasi Penelitian', formData.lokasiPenelitian || ''));
      }
      if (plainText.startsWith('Dosen Pembimbing:') || plainText.startsWith('Dosen Pembimbing :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Dosen Pembimbing', formData.dosenPembimbing || ''));
      }
      if (plainText.startsWith('Ditujukan Kepada:') || plainText.startsWith('Ditujukan Kepada :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Ditujukan Kepada', formData.ditujukanKepada || ''));
      }
      if (plainText.startsWith('Tanggal Penelitian:') || plainText.startsWith('Tanggal Penelitian :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Tanggal Penelitian', formData.tanggalPenelitian || ''));
      }
      if (plainText.startsWith('Perusahaan/Instansi:') || plainText.startsWith('Perusahaan/Instansi :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Perusahaan/Instansi', formData.perusahaan || ''));
      }
      if (plainText.startsWith('Alamat:') && !plainText.includes('Mahasiswa') && !plainText.includes('Orang Tua')) {
        docXml = docXml.replace(pXml, buildLabelLine('Alamat', formData.alamatPerusahaan || formData.alamat || ''));
      }
      if (plainText.startsWith('Kota Tujuan :') || plainText.startsWith('Kota Tujuan:')) {
        docXml = docXml.replace(pXml, buildLabelLine('Kota Tujuan', formData.kotaTujuan || 'Medan'));
      }
      if (plainText.startsWith('Tanggal Magang:') || plainText.startsWith('Tanggal Magang :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Tanggal Magang', formData.tanggalMagang || ''));
      }
      if (plainText.startsWith('Tanggal PKL:') || plainText.startsWith('Tanggal PKL :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Tanggal PKL', formData.tanggalPKL || ''));
      }

      // Orang Tua
      if (plainText.startsWith('Nama Orang Tua:')) {
        docXml = docXml.replace(pXml, buildLabelLine('Nama Orang Tua', formData.namaOrangTua || ''));
      }
      if (plainText.startsWith('NIP/NRP/NIK/No. Pensiun:')) {
        docXml = docXml.replace(pXml, buildLabelLine('NIP/NRP/NIK/No. Pensiun', formData.nipOrangTua || ''));
      }
      if (plainText.startsWith('Instansi:') && plainText.length < 30) {
        docXml = docXml.replace(pXml, buildLabelLine('Instansi', formData.instansiOrangTua || ''));
      }
      if (plainText.startsWith('Alamat Orang Tua:')) {
        docXml = docXml.replace(pXml, buildLabelLine('Alamat Orang Tua', formData.alamatOrangTua || ''));
      }

      // Custom sentences
      if (plainText.includes('dikarenakan .') || plainText.includes('dikarenakan.')) {
        const alasanText = formData.alasan ? `dikarenakan ${formData.alasan}.` : 'dikarenakan keperluan mendesak.';
        docXml = docXml.replace(pXml, setParagraphText(pXml, `Mengajukan Surat Permohonan Izin Tidak Mengikuti Perkuliahan ${alasanText}`));
      }
      if (plainText.includes('untuk keperluan .') || plainText.includes('untuk keperluan.')) {
        const keperluanText = formData.keperluan ? `untuk keperluan ${formData.keperluan}.` : 'untuk keperluan administrasi.';
        docXml = docXml.replace(pXml, setParagraphText(pXml, `Mengajukan Surat Permohonan Aktif Kuliah Mahasiswa ${keperluanText}`));
      }
      if (plainText.includes('kelengkapan berkas administrasi Beasiswa.')) {
        const beaText = formData.namaBeasiswa ? `kelengkapan berkas administrasi ${formData.namaBeasiswa}.` : 'kelengkapan berkas administrasi Beasiswa.';
        docXml = docXml.replace(pXml, setParagraphText(pXml, `Mengajukan Surat Permohonan Rekomendasi untuk ${beaText}`));
      }
      if (plainText.includes('aktif kuliah pada Tahun Akademik      .')) {
        const thn = formData.tahunAkademik || '2025/2026';
        docXml = docXml.replace(pXml, setParagraphText(pXml, `Agar dapat kiranya surat keterangan yang menyatakan bahwa saya adalah benar mahasiswa Fakultas Vokasi, Universitas Sumatera Utara, dan aktif kuliah pada Tahun Akademik ${thn}. Hal ini diperlukan untuk memperoleh Tunjangan Keluarga dari instansi tempat orang tua saya bekerja.`));
      }

      // Kehilangan Document selection
      if (plainText.includes('Mengajukan Surat Permohonan Kehilangan KRS / KHS / KTM / Transkrip Mahasiswa')) {
        const dok = formData.dokumenHilang || 'KRS / KHS / KTM / Transkrip';
        docXml = docXml.replace(pXml, setParagraphText(pXml, `Mengajukan Surat Permohonan Kehilangan ${dok} Mahasiswa yang dikarenakan hilang.`));
      }

      // Signature Medan, [Tanggal]
      if (plainText.trim() === 'Medan,' || plainText.trim() === 'Medan ,' || plainText.trim() === 'Medan,') {
        const tgl = formData.tanggalSurat || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        docXml = docXml.replace(pXml, setParagraphText(pXml, `Medan, ${tgl}`));
      }

      // Name & NIM at signature
      if (plainText.trim() === 'Nama' || plainText.trim() === 'Nama Mahasiswa') {
        docXml = docXml.replace(pXml, setParagraphText(pXml, formData.nama || 'Nama Mahasiswa', true));
      }
      if (plainText.startsWith('NIM.') || plainText.startsWith('NIM :') && plainText.length < 15) {
        docXml = docXml.replace(pXml, setParagraphText(pXml, `NIM. ${formData.nim || ''}`));
      }

      // New template placeholders
      if (plainText.includes('[Nama Program Studi Anda]')) {
        const prd = formData.prodi || 'Fakultas Vokasi';
        docXml = docXml.replace(pXml, pXml.replace(/\[Nama Program Studi Anda\]/g, escapeXml(prd)));
      }
      if (plainText.includes('[tulis alasan keterlambatan pembayaran]')) {
        const als = formData.alasan || 'kendala teknis dan administrasi keuangan keluarga';
        docXml = docXml.replace(pXml, pXml.replace(/\[tulis alasan keterlambatan pembayaran\]/g, escapeXml(als)));
      }
      if (plainText.includes('[tanggal efektif pengunduran diri]')) {
        const tglEf = formData.tanggalEfektif || formData.tanggalSurat || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        docXml = docXml.replace(pXml, pXml.replace(/\[tanggal efektif pengunduran diri\]/g, escapeXml(tglEf)));
      }
      if (plainText.includes('[jelaskan secara singkat alasan Anda, misalnya: alasan pribadi, kesehatan, atau kondisi ekonomi]')) {
        const als = formData.alasan || 'alasan pribadi dan kondisi keluarga';
        docXml = docXml.replace(pXml, pXml.replace(/\[jelaskan secara singkat alasan Anda, misalnya: alasan pribadi, kesehatan, atau kondisi ekonomi\]/g, escapeXml(als)));
      }
      if (plainText.startsWith('Hari, Tanggal Ujian:')) {
        docXml = docXml.replace(pXml, buildLabelLine('Hari, Tanggal Ujian', formData.hariTanggalUjian || ''));
      }
      if (plainText.startsWith('Pukul:') || plainText.startsWith('Pukul :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Pukul', formData.pukul || '09.00 WIB s/d Selesai'));
      }
      if (plainText.startsWith('Tempat:') || plainText.startsWith('Tempat :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Tempat', formData.tempat || 'Ruang Sidang Fakultas Vokasi USU'));
      }
      if (plainText.startsWith('Judul Tugas Akhir:') || plainText.startsWith('Judul Tugas Akhir :') || plainText.startsWith('Judul Skripsi/Tugas Akhir:')) {
        docXml = docXml.replace(pXml, buildLabelLine('Judul Tugas Akhir', formData.judulTA || formData.judulProposal || ''));
      }

      // PDM PDDIKTI Fields
      if (plainText.includes('D3/D4 (Nama Program Studi Anda)')) {
        const prd = formData.prodiTujuan || formData.prodi || 'Fakultas Vokasi';
        docXml = docXml.replace(pXml, pXml.replace(/D3\/D4 \(Nama Program Studi Anda\)/g, escapeXml(prd)));
      }
      if (plainText.startsWith('Tempat Lahir:') || plainText.startsWith('Tempat Lahir :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Tempat Lahir', formData.tempatLahir || formData.ttl || ''));
      }
      if (plainText.startsWith('Tanggal Lahir:') || plainText.startsWith('Tanggal Lahir :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Tanggal Lahir', formData.tanggalLahir || ''));
      }
      if (plainText.startsWith('Nama Ibu Kandung:') || plainText.startsWith('Nama Ibu Kandung :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Nama Ibu Kandung', formData.namaIbuKandung || ''));
      }
      if (plainText.startsWith('Nomor Ijazah Nasional:') || plainText.startsWith('Nomor Ijazah Nasional :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Nomor Ijazah Nasional', formData.nomorIjazahNasional || '-'));
      }
      if (plainText.startsWith('Nomor Transkrip Nilai:') || plainText.startsWith('Nomor Transkrip Nilai :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Nomor Transkrip Nilai', formData.nomorTranskripNilai || '-'));
      }
      if (plainText.startsWith('Nomor HP/Email:') || plainText.startsWith('Nomor HP/Email :')) {
        docXml = docXml.replace(pXml, buildLabelLine('Nomor HP/Email', formData.noHpEmail || formData.noHp || ''));
      }
      if (plainText.trim() === 'Nama Pemohon') {
        docXml = docXml.replace(pXml, setParagraphText(pXml, formData.nama || 'Nama Pemohon', true));
      }
    });

    // 4b. Handle 3-column table rows (e.g. Permohonan SKL, Ujian Tugas Akhir)
    docXml = docXml.replace(/<w:tr[\s\S]*?<\/w:tr>/g, (rowXml) => {
      const cells = rowXml.match(/<w:tc[\s\S]*?<\/w:tc>/g) || [];
      if (cells.length >= 3) {
        const labelText = (cells[0].match(/<w:t[\s\S]*?>([\s\S]*?)<\/w:t>/g) || []).map(t => t.replace(/<[^>]+>/g, '')).join('').trim();
        let val = null;
        if (/^nama/i.test(labelText)) val = formData.nama;
        else if (/^nim/i.test(labelText)) val = formData.nim;
        else if (/^program studi/i.test(labelText)) val = formData.prodi;
        else if (/^tempat.*lahir/i.test(labelText)) val = formData.ttl;
        else if (/^alamat/i.test(labelText)) val = formData.alamat;
        else if (/^hari.*lulus/i.test(labelText)) val = formData.tanggalLulus || formData.hariTanggalUjian;
        else if (/^judul.*tugas akhir/i.test(labelText)) val = formData.judulTA || formData.judulProposal;
        else if (/^ipk/i.test(labelText)) val = formData.ipk;
        else if (/^nomor.*handphone/i.test(labelText) || /^no.*hp/i.test(labelText)) val = formData.noHp;
        else if (/^bahasa indonesia/i.test(labelText)) val = formData.judulTA || formData.judulProposal;
        else if (/^bahasa inggris/i.test(labelText)) val = formData.judulTAEng || formData.judulProposal;

        if (val) {
          const lastCell = cells[2];
          const esc = escapeXml(val);
          const existingText = (lastCell.match(/<w:t[\s\S]*?>([\s\S]*?)<\/w:t>/g) || []).map(t => t.replace(/<[^>]+>/g, '')).join('').trim();
          if (!existingText) {
            const injected = lastCell.replace('</w:p>', `<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="24"/></w:rPr><w:t xml:space="preserve">${esc}</w:t></w:r></w:p>`);
            return rowXml.replace(lastCell, injected);
          }
        }
      }
      return rowXml;
    });

    // 5. Handle Table rows for Kelompok (Magang Kelompok / PKL Kelompok)
    if (templateConfig.isGroup && membersList && membersList.length > 0) {
      // Build replacement table rows
      function buildTableRow(no, mNama, mNim, mProdi) {
        return `<w:tr><w:tc><w:tcPr><w:tcW w:w="720" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>${escapeXml(no)}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3600" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${escapeXml(mNama)}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2160" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${escapeXml(mNim)}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3120" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${escapeXml(mProdi)}</w:t></w:r></w:p></w:tc></w:tr>`;
      }

      // Find the existing table
      const tableMatch = docXml.match(/<w:tbl[\s\S]*?<\/w:tbl>/);
      if (tableMatch) {
        const oldTable = tableMatch[0];
        const headerRowMatch = oldTable.match(/<w:tr[\s\S]*?<\/w:tr>/);
        if (headerRowMatch) {
          const headerRow = headerRowMatch[0];
          let newRows = headerRow;
          membersList.forEach((m, idx) => {
            newRows += buildTableRow(String(idx + 1), m.nama, m.nim, m.prodi);
          });
          const newTable = oldTable.replace(/<w:tr[\s\S]*?<\/w:tbl>/, `${newRows}</w:tbl>`);
          docXml = docXml.replace(oldTable, newTable);
        }
      }
    }

    // 5b. Handle PDM 4-column Table row 2
    if (templateConfig.id === 'surat-perubahan-data-pddikti' && formData.dataTercatat) {
      const tableMatch = docXml.match(/<w:tbl[\s\S]*?<\/w:tbl>/);
      if (tableMatch) {
        const rows = tableMatch[0].match(/<w:tr[\s\S]*?<\/w:tr>/g) || [];
        if (rows.length >= 2) {
          const row2 = rows[1];
          const newRow2 = `<w:tr><w:trPr><w:trHeight w:val="720"/></w:trPr>` +
            `<w:tc><w:tcPr><w:tcW w:w="511" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:spacing w:line="276" w:lineRule="auto"/><w:jc w:val="center"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr><w:t>1</w:t></w:r></w:p></w:tc>` +
            `<w:tc><w:tcPr><w:tcW w:w="3084" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:spacing w:line="276" w:lineRule="auto"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr><w:t xml:space="preserve">${escapeXml(formData.dataTercatat)}</w:t></w:r></w:p></w:tc>` +
            `<w:tc><w:tcPr><w:tcW w:w="2880" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:spacing w:line="276" w:lineRule="auto"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr><w:t xml:space="preserve">${escapeXml(formData.dataSeharusnya)}</w:t></w:r></w:p></w:tc>` +
            `<w:tc><w:tcPr><w:tcW w:w="2541" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:spacing w:line="276" w:lineRule="auto"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr><w:t xml:space="preserve">${escapeXml(formData.alasanPerubahan)}</w:t></w:r></w:p></w:tc></w:tr>`;
          docXml = docXml.replace(row2, newRow2);
        }
      }
    }

    // 6. Save modified XML back to zip
    zip.file('word/document.xml', docXml);

    // 7. Generate output Blob
    const outputBlob = await zip.generateAsync({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      compression: 'DEFLATE'
    });

    // 8. Trigger download
    const cleanNama = (formData.nama || 'MAHASISWA').replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
    const cleanNim = (formData.nim || 'NIM').replace(/[^a-zA-Z0-9]/g, '');
    const cleanCode = (templateConfig.id || 'SURAT').replace(/-/g, '_').toUpperCase();
    const finalFilename = `${cleanCode}_${cleanNim}_${cleanNama}.docx`;

    const downloadUrl = URL.createObjectURL(outputBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    return {
      success: true,
      filename: finalFilename
    };
  } catch (error) {
    console.error('Error generating Word document:', error);
    throw error;
  }
}

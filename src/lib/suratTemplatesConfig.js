// Helper: Format tanggal Indonesia hari ini secara otomatis (permanen)
export function getTodayDateIndo() {
  return new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

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

// Definisi konfigurasi seluruh 19 template surat Vokasi USU
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
      { name: 'prodiTujuan', label: 'Program Studi Tujuan (Kaprodi)', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika', required: true },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Contoh: Wanda Annisa Lubis', required: true },
      { name: 'nim', label: 'Nomor Induk Mahasiswa (NIM)', type: 'text', placeholder: 'Contoh: 220501001', required: true },
      { name: 'prodi', label: 'Program Studi Mahasiswa', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika', required: true },
      { name: 'fakultas', label: 'Fakultas', type: 'text', defaultValue: 'Vokasi', required: true },
      { name: 'alasan', label: 'Alasan Tidak Mengikuti Perkuliahan', type: 'textarea', placeholder: 'Contoh: Sakit demam tinggi dan disarankan dokter untuk istirahat rawat jalan selama 3 hari.', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
    ],
    sampleDemo: {
      prodiTujuan: 'D3 Teknik Informatika',
      nama: 'Muhammad Farhan',
      nim: '220501019',
      prodi: 'D3 Teknik Informatika',
      fakultas: 'Vokasi',
      alasan: 'mengikuti karantina dan seleksi final Pekan Olahraga Mahasiswa Nasional (POMNAS) mewakili Universitas Sumatera Utara.',
      tanggalSurat: getTodayDateIndo()
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
      { name: 'prodiTujuan', label: 'Program Studi Tujuan (Kaprodi)', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D4 Manajemen Bisnis Pariwisata', required: true },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Contoh: Aulia Rahma', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'Contoh: 210504012', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D4 Manajemen Bisnis Pariwisata', required: true },
      { name: 'semester', label: 'Semester Saat Ini', type: 'text', placeholder: 'Contoh: VI (Enam)', defaultValue: 'VI (Enam)' },
      { name: 'alamat', label: 'Alamat Tempat Tinggal Mahasiswa', type: 'text', placeholder: 'Contoh: Jl. Dr. Mansur No. 45 Medan' },
      { name: 'judulProposal', label: 'Judul Proposal Penelitian', type: 'textarea', placeholder: 'Contoh: Strategi Pengembangan Desa Wisata Berbasis Kearifan Lokal di Kabupaten Karo', required: true },
      { name: 'lokasiPenelitian', label: 'Lokasi / Objek Penelitian', type: 'text', placeholder: 'Contoh: Dinas Kebudayaan dan Pariwisata Provinsi Sumatera Utara', required: true },
      { name: 'dosenPembimbing', label: 'Nama Dosen Pembimbing', type: 'text', placeholder: 'Contoh: Dr. Ir. Siti Nurhaliza, M.Si.' },
      { name: 'ditujukanKepada', label: 'Ditujukan Kepada (Nama Instansi/Pimpinan)', type: 'text', placeholder: 'Contoh: Kepala Dinas Kebudayaan dan Pariwisata Provinsi Sumut', required: true },
      { name: 'tanggalPenelitian', label: 'Tanggal / Periode Penelitian', type: 'text', placeholder: 'Contoh: 1 Oktober 2026 s/d 10 November 2026' },
      { name: 'tanggalSurat', label: 'Tanggal Surat (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
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
      tanggalSurat: getTodayDateIndo()
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
      { name: 'prodiTujuan', label: 'Program Studi Tujuan', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Akuntansi', required: true },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Akuntansi', required: true },
      { name: 'semester', label: 'Semester', type: 'text', defaultValue: 'IV (Empat)' },
      { name: 'tahunAkademik', label: 'Tahun Akademik', type: 'text', defaultValue: '2026/2027' },
      { name: 'dokumenHilang', label: 'Dokumen yang Hilang', type: 'select', options: ['Kartu Tanda Mahasiswa (KTM)', 'Kartu Rencana Studi (KRS)', 'Kartu Hasil Studi (KHS)', 'Transkrip Nilai Sementara'], defaultValue: 'Kartu Tanda Mahasiswa (KTM)', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
    ],
    sampleDemo: {
      prodiTujuan: 'D3 Akuntansi',
      nama: 'Alif Pratama Lubis',
      nim: '220502011',
      prodi: 'D3 Akuntansi',
      semester: 'IV (Empat)',
      tahunAkademik: '2026/2027',
      dokumenHilang: 'Kartu Tanda Mahasiswa (KTM)',
      tanggalSurat: getTodayDateIndo()
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
      { name: 'prodiTujuan', label: 'Program Studi Tujuan', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika', required: true },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika', required: true },
      { name: 'semester', label: 'Semester Saat Ini', type: 'text', defaultValue: 'IV (Empat)' },
      { name: 'tahunAkademik', label: 'Tahun Akademik', type: 'text', defaultValue: '2026/2027' },
      { name: 'ttl', label: 'Tempat, Tanggal Lahir', type: 'text', placeholder: 'Contoh: Medan, 14 Mei 2004' },
      { name: 'noHp', label: 'Nomor Telepon / WhatsApp', type: 'text', placeholder: 'Contoh: 081234567890' },
      { name: 'keperluan', label: 'Untuk Keperluan', type: 'text', placeholder: 'Contoh: Pengurusan Rekening Bank & Administrasi Beasiswa', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
    ],
    sampleDemo: {
      prodiTujuan: 'D3 Teknik Informatika',
      nama: 'Bagas Wahyudi',
      nim: '220501034',
      prodi: 'D3 Teknik Informatika',
      semester: 'IV (Empat)',
      tahunAkademik: '2026/2027',
      ttl: 'Medan, 22 Agustus 2004',
      noHp: '0821-6543-9871',
      keperluan: 'Kelengkapan Berkas Pendaftaran Program Magang Bersama BUMN 2026',
      tanggalSurat: getTodayDateIndo()
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
      { name: 'prodiTujuan', label: 'Program Studi Tujuan', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika', required: true },
      { name: 'nama', label: 'Nama Ketua Kelompok', type: 'text', placeholder: 'Nama Ketua Kelompok', required: true },
      { name: 'nim', label: 'NIM Ketua', type: 'text', placeholder: 'NIM Ketua', required: true },
      { name: 'prodi', label: 'Program Studi Ketua', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika', required: true },
      { name: 'perusahaan', label: 'Nama Perusahaan / Instansi', type: 'text', placeholder: 'Contoh: PT Telekomunikasi Indonesia Tbk (Telkom Medan)', required: true },
      { name: 'alamatPerusahaan', label: 'Alamat Perusahaan / Instansi', type: 'text', placeholder: 'Contoh: Jl. Putri Hijau No. 1 Medan', required: true },
      { name: 'kotaTujuan', label: 'Kota Tujuan', type: 'text', defaultValue: 'Medan', required: true },
      { name: 'tanggalMagang', label: 'Tanggal / Durasi Magang', type: 'text', placeholder: 'Contoh: 1 Juli 2026 s/d 31 Agustus 2026', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
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
      tanggalSurat: getTodayDateIndo()
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
      { name: 'prodiTujuan', label: 'Program Studi Tujuan', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D4 Administrasi Perkantoran Digital', required: true },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D4 Administrasi Perkantoran Digital', required: true },
      { name: 'perusahaan', label: 'Nama Perusahaan / Instansi', type: 'text', placeholder: 'Contoh: PT Pelindo Multi Terminal', required: true },
      { name: 'alamatPerusahaan', label: 'Alamat Perusahaan', type: 'text', placeholder: 'Contoh: Jl. Krakatau No. 100 Medan', required: true },
      { name: 'kotaTujuan', label: 'Kota Tujuan', type: 'text', defaultValue: 'Medan', required: true },
      { name: 'tanggalMagang', label: 'Tanggal / Durasi Magang', type: 'text', placeholder: 'Contoh: 15 Juli 2026 s/d 15 September 2026', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
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
      tanggalSurat: getTodayDateIndo()
    }
  },
  {
    id: 'surat-pernyataan-aktif-tunjangan-ortu',
    title: 'Surat Permohonan Pernyataan Aktif Kuliah Untuk Biaya Tanggungan Orang Tua',
    filename: 'SURAT PERMOHONAN PERNYATAAN AKTIF KULIAH UNTUK BIAYA TANGGUNGAN ORANG TUA.docx',
    category: 'Tunjangan & Kedinasan',
    fileUrl: '/assets/templatesurat/SURAT PERMOHONAN PERNYATAAN AKTIF KULIAH UNTUK BIAYA TANGGUNGAN ORANG TUA.docx',
    description: 'Surat pernyataan resmi tanggungan orang tua untuk pencairan tunjangan anak (PNS/TNI/Polri/BUMN/Swasta).',
    fields: [
      { name: 'prodiTujuan', label: 'Program Studi Tujuan', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Perpajakan', required: true },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Perpajakan', required: true },
      { name: 'semester', label: 'Semester Saat Ini', type: 'text', defaultValue: 'IV (Empat)', required: true },
      { name: 'ttl', label: 'Tempat, Tanggal Lahir Mahasiswa', type: 'text', placeholder: 'Contoh: Tebing Tinggi, 10 Januari 2004' },
      { name: 'alamat', label: 'Alamat Tempat Tinggal Mahasiswa', type: 'text', placeholder: 'Alamat Lengkap Mahasiswa' },
      { name: 'noHp', label: 'Nomor HP Mahasiswa', type: 'text', placeholder: '0812-xxxx-xxxx' },
      { name: 'namaOrangTua', label: 'Nama Orang Tua (Ayah / Ibu)', type: 'text', placeholder: 'Contoh: Drs. Suhendra Lubis', required: true },
      { name: 'nipOrangTua', label: 'NIP / NRP / NIK / No. Pensiun', type: 'text', placeholder: 'Contoh: 19700512 199603 1 002', required: true },
      { name: 'instansiOrangTua', label: 'Instansi Tempat Bekerja Orang Tua', type: 'text', placeholder: 'Contoh: Dinas Pendidikan Provinsi Sumatera Utara', required: true },
      { name: 'alamatOrangTua', label: 'Alamat Kantor/Rumah Orang Tua', type: 'text', placeholder: 'Contoh: Jl. Kolonel Sugiono No. 24 Tebing Tinggi' },
      { name: 'tahunAkademik', label: 'Tahun Akademik Aktif', type: 'text', defaultValue: '2026/2027', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
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
      tahunAkademik: '2026/2027',
      tanggalSurat: getTodayDateIndo()
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
      { name: 'prodiTujuan', label: 'Program Studi Tujuan', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Metrologi dan Instrumentasi', required: true },
      { name: 'nama', label: 'Nama Ketua Kelompok', type: 'text', placeholder: 'Nama Ketua', required: true },
      { name: 'nim', label: 'NIM Ketua', type: 'text', placeholder: 'NIM Ketua', required: true },
      { name: 'prodi', label: 'Program Studi Ketua', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Metrologi dan Instrumentasi', required: true },
      { name: 'perusahaan', label: 'Nama Perusahaan / Industri Mitra', type: 'text', placeholder: 'Contoh: PT Pertamina Gas (Pertagas) Northern Sumatra', required: true },
      { name: 'alamatPerusahaan', label: 'Alamat Perusahaan', type: 'text', placeholder: 'Alamat Perusahaan', required: true },
      { name: 'kotaTujuan', label: 'Kota Tujuan', type: 'text', defaultValue: 'Medan', required: true },
      { name: 'tanggalPKL', label: 'Tanggal / Periode Pelaksanaan PKL', type: 'text', placeholder: 'Contoh: 1 Agustus 2026 s/d 30 September 2026', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
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
      tanggalSurat: getTodayDateIndo()
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
      { name: 'prodiTujuan', label: 'Program Studi Tujuan', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D4 Kimia Terapan', required: true },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D4 Kimia Terapan', required: true },
      { name: 'perusahaan', label: 'Nama Perusahaan / Lab Industri', type: 'text', placeholder: 'Contoh: PT Socfin Indonesia (Socfindo)', required: true },
      { name: 'alamatPerusahaan', label: 'Alamat Perusahaan', type: 'text', placeholder: 'Contoh: Jl. K.L. Yos Sudarso No. 106 Medan', required: true },
      { name: 'kotaTujuan', label: 'Kota Tujuan', type: 'text', defaultValue: 'Medan', required: true },
      { name: 'tanggalPKL', label: 'Tanggal / Periode PKL', type: 'text', placeholder: 'Contoh: 1 Juli 2026 s/d 31 Agustus 2026', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
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
      tanggalSurat: getTodayDateIndo()
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
      { name: 'prodiTujuan', label: 'Program Studi Tujuan', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika', required: true },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika', required: true },
      { name: 'semester', label: 'Semester', type: 'text', defaultValue: 'IV (Empat)', required: true },
      { name: 'ipk', label: 'Indeks Prestasi Kumulatif (IPK)', type: 'text', placeholder: 'Contoh: 3.85', defaultValue: '3.85', required: true },
      { name: 'ttl', label: 'Tempat, Tanggal Lahir', type: 'text', placeholder: 'Contoh: Medan, 10 Januari 2004' },
      { name: 'alamat', label: 'Alamat Mahasiswa', type: 'text', placeholder: 'Alamat Lengkap Mahasiswa' },
      { name: 'noHp', label: 'No. HP / WhatsApp', type: 'text', placeholder: '0812-xxxx-xxxx' },
      { name: 'namaBeasiswa', label: 'Nama Program Beasiswa yang Diajukan', type: 'text', placeholder: 'Contoh: Beasiswa Bank Indonesia (GenBI) Tahun 2026', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
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
      tanggalSurat: getTodayDateIndo()
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
      { name: 'ttl', label: 'Tempat, Tanggal Lahir', type: 'text', placeholder: 'Contoh: Medan, 10 Januari 2004', required: true },
      { name: 'alamat', label: 'Alamat Tempat Tinggal', type: 'text', placeholder: 'Contoh: Jl. Dr. Mansur No. 45 Medan', required: true },
      { name: 'tanggalLulus', label: 'Hari/Tanggal Lulus Sidang', type: 'text', placeholder: 'Contoh: Senin, 15 Juli 2026', required: true },
      { name: 'judulTA', label: 'Judul Tugas Akhir', type: 'textarea', placeholder: 'Contoh: Rancang Bangun Portal Monitoring...', required: true },
      { name: 'ipk', label: 'Indeks Prestasi Kumulatif (IPK)', type: 'text', placeholder: 'Contoh: 3.85', defaultValue: '3.85', required: true },
      { name: 'noHp', label: 'Nomor Handphone / WA', type: 'text', placeholder: '0812-xxxx-xxxx', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
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
      tanggalSurat: getTodayDateIndo()
    }
  },
  {
    id: 'surat-penyerahan-tugas-akhir',
    title: 'Surat Penyerahan Tugas Akhir',
    filename: 'Surat Penyerahan Tugas Akhir.docx',
    category: 'Penelitian & Tugas Akhir',
    fileUrl: '/assets/templatesurat/Surat Penyerahan Tugas Akhir.docx',
    description: 'Bukti penyerahan berkas Tugas Akhir sebagai syarat bebas administrasi wisuda ke 4 pihak terkait.',
    fields: [
      { name: 'nama', label: 'Nama Mahasiswa', type: 'text', placeholder: 'Contoh: Rizky Pratama', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'Contoh: 210501044', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika', required: true },
      { name: 'judulTA', label: 'Judul Tugas Akhir', type: 'textarea', placeholder: 'Contoh: Implementasi Artificial Intelligence...', required: true },
      { name: 'dosenPembimbing', label: 'Nama Dosen Pembimbing', type: 'text', placeholder: 'Contoh: Dr. Ir. Siti Nurhaliza, M.Si.', required: true },
      { name: 'dosenPenguji', label: 'Nama Dosen Penguji', type: 'text', placeholder: 'Contoh: Prof. Dr. Budiman Sinaga, M.M.', required: true },
      { name: 'kaprodi', label: 'Nama Ketua Program Studi', type: 'text', placeholder: 'Contoh: Ketua Program Studi D3 Teknik Informatika', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Penyerahan (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
    ],
    sampleDemo: {
      nama: 'Rizky Pratama',
      nim: '210501044',
      prodi: 'D3 Teknik Informatika',
      judulTA: 'Pengembangan Portal Penjaminan Mutu dan Kemahasiswaan Fakultas Vokasi Universitas Sumatera Utara',
      dosenPembimbing: 'Dr. Ir. Siti Nurhaliza, M.Si.',
      dosenPenguji: 'Prof. Dr. Budiman Sinaga, M.M.',
      kaprodi: 'Ketua Program Studi D3 Teknik Informatika',
      tanggalSurat: getTodayDateIndo()
    }
  },
  {
    id: 'surat-keterlambatan-spp',
    title: 'Surat Permohonan Keterlambatan Pembayaran SPP (Pembukaan VA)',
    filename: 'Surat Permohonan Keterlambatan Pembayaran SPP.docx',
    category: 'Administrasi & Keuangan',
    fileUrl: '/assets/templatesurat/Surat Permohonan Keterlambatan Pembayaran SPP.docx',
    description: 'Permohonan pembukaan kembali Virtual Account pembayaran SPP/UKT kepada Dekan Fakultas Vokasi.',
    fields: [
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Akuntansi', required: true },
      { name: 'semester', label: 'Semester Saat Ini', type: 'text', defaultValue: 'V (Lima)', required: true },
      { name: 'tahunAkademik', label: 'Tahun Akademik', type: 'text', defaultValue: '2026/2027', required: true },
      { name: 'alasan', label: 'Alasan Keterlambatan Pembayaran SPP', type: 'textarea', placeholder: 'Jelaskan kendala teknis atau ekonomi keterlambatan pembayaran SPP/UKT...', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
    ],
    sampleDemo: {
      nama: 'Nurul Hidayah',
      nim: '220502015',
      prodi: 'D3 Akuntansi',
      semester: 'V (Lima)',
      tahunAkademik: '2026/2027',
      alasan: 'kendala teknis sistem perbankan saat transfer serta menunggu pencairan dana talangan keluarga',
      tanggalSurat: getTodayDateIndo()
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
      { name: 'prodi', label: 'Program Studi Anda', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Keuangan', required: true },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'semester', label: 'Semester Terakhir', type: 'text', defaultValue: 'IV (Empat)' },
      { name: 'tanggalEfektif', label: 'Tanggal Efektif Pengunduran Diri', type: 'text', defaultValue: getTodayDateIndo() },
      { name: 'alasan', label: 'Alasan Pengunduran Diri', type: 'textarea', placeholder: 'Jelaskan secara singkat alasan Anda (pribadi / kesehatan / pekerjaan)...', required: true },
      { name: 'namaOrangTua', label: 'Nama Orang Tua / Wali', type: 'text', placeholder: 'Nama Orang Tua', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
    ],
    sampleDemo: {
      prodi: 'D3 Keuangan',
      nama: 'Bagus Setiawan',
      nim: '220503022',
      semester: 'IV (Empat)',
      tanggalEfektif: getTodayDateIndo(),
      alasan: 'diterima bekerja purnawaktu sebagai staf operasional perbankan di luar kota',
      namaOrangTua: 'H. Sudirman, S.E.',
      tanggalSurat: getTodayDateIndo()
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
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D4 Akuntansi Sektor Publik', required: true },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'program', label: 'Jenjang Program', type: 'text', defaultValue: 'Sarjana Terapan' },
      { name: 'hariTanggalUjian', label: 'Hari, Tanggal Ujian', type: 'text', placeholder: 'Contoh: Kamis, 15 Oktober 2026', required: true },
      { name: 'pukul', label: 'Pukul / Jam Ujian', type: 'text', placeholder: 'Contoh: 09.30 - 11.30 WIB', required: true },
      { name: 'tempat', label: 'Tempat / Ruang Ujian', type: 'text', placeholder: 'Contoh: Ruang Sidang Utama Gedung Vokasi Lt. 2', required: true },
      { name: 'dosenPembimbing', label: 'Dosen Pembimbing', type: 'text', placeholder: 'Nama Dosen Pembimbing', required: true },
      { name: 'dosenPenguji', label: 'Dosen Penguji', type: 'text', placeholder: 'Nama Dosen Penguji', required: true },
      { name: 'judulTA', label: 'Judul Tugas Akhir (Bahasa Indonesia)', type: 'textarea', placeholder: 'Judul Tugas Akhir Bahasa Indonesia', required: true },
      { name: 'judulTAEn', label: 'Judul Tugas Akhir (Bahasa Inggris)', type: 'textarea', placeholder: 'Judul Tugas Akhir Bahasa Inggris' },
      { name: 'tanggalSurat', label: 'Tanggal Surat (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
    ],
    sampleDemo: {
      prodi: 'D4 Akuntansi Sektor Publik',
      nama: 'Indah Permatasari',
      nim: '210502088',
      program: 'Sarjana Terapan',
      hariTanggalUjian: 'Kamis, 15 Oktober 2026',
      pukul: '09.30 - 11.30 WIB',
      tempat: 'Ruang Sidang Utama Fakultas Vokasi Lt. 2',
      dosenPembimbing: 'Dr. Solahuddin Nasution, S.E., M.SP.',
      dosenPenguji: 'Dra. Hj. Nurminah Lubis, M.Si., Ak.',
      judulTA: 'Analisis Akuntabilitas Pengelolaan Alokasi Dana Desa pada Pemerintah Kabupaten Deli Serdang',
      judulTAEn: 'Accountability Analysis of Village Fund Allocation Management in Deli Serdang Regency Government',
      tanggalSurat: getTodayDateIndo()
    }
  },
  {
    id: 'surat-bebas-administrasi',
    title: 'Surat Pernyataan Bebas Administrasi (Ijazah dan Transkrip)',
    filename: 'Surat Pernyataan Bebas Administrasi (Ijazah dan Transkrip).docx',
    category: 'Kelulusan & Alumni',
    fileUrl: '/assets/templatesurat/Surat Pernyataan Bebas Administrasi (Ijazah dan Transkrip).docx',
    description: 'Pernyataan bebas administrasi akademik, keuangan, perpustakaan, dan toga untuk pengambilan ijazah.',
    fields: [
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika', required: true },
      { name: 'periodeWisuda', label: 'Periode Wisuda', type: 'text', placeholder: 'Contoh: Periode I TA 2026/2027 (November 2026)', required: true },
      { name: 'noHp', label: 'Nomor Telepon / HP', type: 'text', placeholder: '0812-xxxx-xxxx', required: true },
      { name: 'kaprodi', label: 'Nama Ketua Program Studi', type: 'text', placeholder: 'Nama Ketua Program Studi', required: true },
      { name: 'nipKaprodi', label: 'NIP Ketua Program Studi', type: 'text', placeholder: 'Contoh: 197505102005011002' },
      { name: 'tanggalSurat', label: 'Tanggal Pernyataan (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
    ],
    sampleDemo: {
      nama: 'Wanda Annisa Lubis',
      nim: '220501001',
      prodi: 'D3 Teknik Informatika',
      periodeWisuda: 'Periode I TA 2026/2027 (November 2026)',
      noHp: '0812-6000-8654',
      kaprodi: 'Ketua Program Studi D3 Teknik Informatika',
      nipKaprodi: '197505102005011002',
      tanggalSurat: getTodayDateIndo()
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
      { name: 'semester', label: 'Semester Akan Aktif Kembali', type: 'text', defaultValue: 'V (Ganjil)', required: true },
      { name: 'tahunAkademik', label: 'Tahun Akademik', type: 'text', defaultValue: '2026/2027', required: true },
      { name: 'alasan', label: 'Alasan Tidak Aktif Sebelumnya', type: 'textarea', placeholder: 'Contoh: Cuti Akademik karena masa pemulihan pasca operasi kesehatan', required: true },
      { name: 'tahunMasuk', label: 'Masuk Pertama Studi Tahun', type: 'text', placeholder: 'Contoh: 2023', defaultValue: '2023' },
      { name: 'masaStudiDijalani', label: 'Masa Studi yang Telah Dijalani', type: 'text', placeholder: 'Contoh: 4 Semester', defaultValue: '4 Semester' },
      { name: 'sksLulus', label: 'Beban SKS yang Berhasil Diselesaikan', type: 'text', placeholder: 'Contoh: 76 SKS', defaultValue: '76 SKS' },
      { name: 'noHp', label: 'Nomor HP / WhatsApp', type: 'text', placeholder: '0812-xxxx-xxxx', required: true },
      { name: 'alamat', label: 'Alamat Tinggal Mahasiswa', type: 'text', placeholder: 'Alamat Lengkap Mahasiswa' },
      { name: 'tanggalSurat', label: 'Tanggal Surat (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
    ],
    sampleDemo: {
      nama: 'Faisal Akbar',
      nim: '220504018',
      prodi: 'D3 Analis Farmasi dan Makanan',
      semester: 'V (Ganjil)',
      tahunAkademik: '2026/2027',
      alasan: 'Cuti Akademik karena masa pemulihan pasca operasi kesehatan',
      tahunMasuk: '2023',
      masaStudiDijalani: '4 Semester',
      sksLulus: '76 SKS',
      noHp: '0813-7788-9900',
      alamat: 'Jl. Jamin Ginting Km 8 Medan',
      tanggalSurat: getTodayDateIndo()
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
      { name: 'semester', label: 'Semester yang Diajukan PKA/Cuti', type: 'text', defaultValue: 'III (Ganjil)', required: true },
      { name: 'tahunAkademik', label: 'Tahun Akademik PKA', type: 'text', defaultValue: '2026/2027', required: true },
      { name: 'alasan', label: 'Alasan Penundaan Kegiatan Akademik', type: 'textarea', placeholder: 'Jelaskan alasan pengajuan cuti/PKA...', required: true },
      { name: 'tahunMasuk', label: 'Masuk Pertama Studi Tahun', type: 'text', placeholder: 'Contoh: 2024', defaultValue: '2024' },
      { name: 'masaStudiDijalani', label: 'Masa Studi yang Telah Dijalani', type: 'text', placeholder: 'Contoh: 2 Semester', defaultValue: '2 Semester' },
      { name: 'sksLulus', label: 'Beban SKS yang Berhasil Diselesaikan', type: 'text', placeholder: 'Contoh: 40 SKS', defaultValue: '40 SKS' },
      { name: 'namaOrangTua', label: 'Nama Orang Tua / Wali', type: 'text', placeholder: 'Nama Orang Tua / Wali', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
    ],
    sampleDemo: {
      nama: 'Dimas Anggara',
      nim: '230501055',
      prodi: 'D3 Teknik Informatika',
      semester: 'III (Ganjil)',
      tahunAkademik: '2026/2027',
      alasan: 'fokus menjalani perawatan medis dan pendampingan keluarga',
      tahunMasuk: '2024',
      masaStudiDijalani: '2 Semester',
      sksLulus: '40 SKS',
      namaOrangTua: 'Bambang Kusumo',
      tanggalSurat: getTodayDateIndo()
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
      { name: 'prodiTujuan', label: 'Program Studi Tujuan (Kaprodi)', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika', required: true },
      { name: 'nama', label: 'Nama Lengkap Mahasiswa', type: 'text', placeholder: 'Nama Mahasiswa', required: true },
      { name: 'nim', label: 'NIM Mahasiswa', type: 'text', placeholder: 'NIM Mahasiswa', required: true },
      { name: 'prodi', label: 'Program Studi', type: 'select', options: PRODI_OPTIONS, defaultValue: 'D3 Teknik Informatika', required: true },
      { name: 'tempatLahir', label: 'Tempat Lahir', type: 'text', placeholder: 'Contoh: Medan', required: true },
      { name: 'tanggalLahir', label: 'Tanggal Lahir', type: 'text', placeholder: 'Contoh: 14 Mei 2004', required: true },
      { name: 'namaIbuKandung', label: 'Nama Ibu Kandung', type: 'text', placeholder: 'Nama Ibu Kandung', required: true },
      { name: 'nomorIjazahNasional', label: 'Nomor Ijazah Nasional', type: 'text', placeholder: 'Contoh: 12345/D3/2026 atau - (belum lulus)', defaultValue: '-' },
      { name: 'nomorTranskripNilai', label: 'Nomor Transkrip Nilai', type: 'text', placeholder: 'Contoh: TR-2026-0012 atau -', defaultValue: '-' },
      { name: 'noHpEmail', label: 'Nomor HP & Email Mahasiswa', type: 'text', placeholder: '0812-xxxx-xxxx / mhs@students.usu.ac.id', required: true },
      { name: 'dataTercatat', label: 'Data yang Tercatat pada PDDIKTI (Keliru)', type: 'text', placeholder: 'Contoh: Wanda Anisa (Data keliru di PDDIKTI)', required: true },
      { name: 'dataSeharusnya', label: 'Data yang Seharusnya (Benar)', type: 'text', placeholder: 'Contoh: Wanda Annisa Lubis (Sesuai Ijazah/Akta)', required: true },
      { name: 'alasanPerubahan', label: 'Alasan Perubahan Data', type: 'textarea', placeholder: 'Contoh: Penyesuaian ejaan nama lengkap agar sesuai dengan Akta Kelahiran dan Ijazah SMA.', required: true },
      { name: 'tanggalSurat', label: 'Tanggal Surat (Terkunci Permanen Hari Ini)', type: 'text', defaultValue: getTodayDateIndo(), readOnly: true, disabled: true, permanent: true }
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
      tanggalSurat: getTodayDateIndo()
    }
  }
];
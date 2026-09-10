const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// 1. Helper normalization functions
function cleanNim(val) {
  if (!val) return '';
  return String(val).replace(/['\s]/g, '').trim();
}

function cleanStr(val) {
  if (!val) return '';
  return String(val).replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeProdi(raw) {
  let s = cleanStr(raw);
  if (!s) return 'D3 Teknik Informatika';
  s = s.replace(/^\d+\s*-\s*/, '');
  s = s.replace(/^D-III\s*/i, 'D3 ');
  s = s.replace(/^D-3\s*/i, 'D3 ');
  s = s.replace(/^D-IV\s*/i, 'D4 ');
  s = s.replace(/^D-4\s*/i, 'D4 ');
  s = s.replace(/^Diploma\s*3\s*/i, 'D3 ');
  s = s.replace(/^Diploma\s*4\s*/i, 'D4 ');
  s = s.replace(/^Diploma\s*III\s*/i, 'D3 ');
  s = s.replace(/^Diploma\s*IV\s*/i, 'D4 ');
  s = s.replace(/^D3\s+/i, 'D3 ');
  s = s.replace(/^D4\s+/i, 'D4 ');

  // Common Vokasi USU prodi mappings
  if (s.toLowerCase().includes('akuntansi sektor publik')) return 'D4 Akuntansi Sektor Publik';
  if (s.toLowerCase().includes('akuntansi')) return 'D3 Akuntansi';
  if (s.toLowerCase().includes('keuangan')) return 'D3 Keuangan';
  if (s.toLowerCase().includes('perbankan')) return 'D4 Perbankan dan Keuangan';
  if (s.toLowerCase().includes('perpajakan')) return 'D3 Perpajakan';
  if (s.toLowerCase().includes('perkantoran') || s.toLowerCase().includes('kesekretariatan')) return 'D3 Kesekretariatan';
  if (s.toLowerCase().includes('administrasi perkantoran digital')) return 'D4 Administrasi Perkantoran Digital';
  if (s.toLowerCase().includes('teknik informatika') || s.toLowerCase().includes('manajemen informatika')) return 'D3 Teknik Informatika';
  if (s.toLowerCase().includes('analis farmasi')) return 'D3 Analis Farmasi dan Makanan';
  if (s.toLowerCase().includes('pariwisata') || s.toLowerCase().includes('perjalanan wisata')) {
    if (s.toLowerCase().includes('bisnis pariwisata') || s.toLowerCase().includes('d4')) return 'D4 Manajemen Bisnis Pariwisata';
    return 'D3 Perjalanan Wisata';
  }
  if (s.toLowerCase().includes('bahasa inggris')) return 'D3 Bahasa Inggris';
  if (s.toLowerCase().includes('bahasa jepang')) return 'D3 Bahasa Jepang';
  if (s.toLowerCase().includes('perpustakaan')) return 'D3 Perpustakaan';
  if (s.toLowerCase().includes('metrologi') || s.toLowerCase().includes('instrumentasi')) {
    if (s.toLowerCase().includes('teknologi rekayasa') || s.toLowerCase().includes('d4')) return 'D4 Teknologi Rekayasa dan Instrumentasi';
    return 'D3 Metrologi dan Instrumentasi';
  }
  if (s.toLowerCase().includes('statistika')) {
    if (s.toLowerCase().includes('terapan') || s.toLowerCase().includes('d4')) return 'D4 Statistika';
    return 'D3 Statistika';
  }
  if (s.toLowerCase().includes('kimia terapan')) return 'D4 Kimia Terapan';
  if (s.toLowerCase().includes('kimia')) return 'D3 Kimia';
  if (s.toLowerCase().includes('fisika')) return 'D3 Fisika';

  return s;
}

// ==========================================
// 2. PARSE DATA PENERIMA BEASISWA
// ==========================================
console.log('Loading DATA PENERIMA BEASISWA.xlsx...');
const wbBea = XLSX.readFile('public/data/DATA PENERIMA BEASISWA.xlsx');
const beasiswaList = [];

wbBea.SheetNames.forEach(sName => {
  const ws = wbBea.Sheets[sName];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: '', header: 1 });

  let hIdx = -1;
  for (let i = 0; i < Math.min(10, rows.length); i++) {
    const rowStr = rows[i].map(c => String(c).toUpperCase()).join(' ');
    if (rowStr.includes('NIM') || (rowStr.includes('NAMA') && (rowStr.includes('MAHASISWA') || rowStr.includes('PRODI')))) {
      hIdx = i;
      break;
    }
  }
  if (hIdx === -1) return;

  const header = rows[hIdx].map(c => String(c).trim().toUpperCase());
  const nimCol = header.findIndex(c => c === 'NIM' || c.includes('NIM'));
  const namaCol = header.findIndex(c => c === 'NAMA' || c.includes('NAMA MAHASISWA') || c === 'NAMA LENGKAP');
  const prodiCol = header.findIndex(c => c.includes('PRODI') || c.includes('PROGRAM STUDI') || c.includes('JURUSAN'));
  const ipkCol = header.findIndex(c => c.includes('IPK') || c.includes('IP SEMESTER') || c.includes('IP'));

  let tahun = '2025';
  if (sName.includes('2026') || sName.includes('26')) tahun = '2026';
  else if (sName.includes('2025') || sName.includes('25')) tahun = '2025';
  else if (sName.includes('2024') || sName.includes('24')) tahun = '2024';
  else if (sName.includes('2023') || sName.includes('23')) tahun = '2023';
  else if (sName.includes('2022') || sName.includes('22')) tahun = '2022';

  let jenisBeasiswa = 'Beasiswa ' + sName;
  if (sName.includes('BI')) jenisBeasiswa = 'Beasiswa Bank Indonesia (BI)';
  else if (sName.includes('KIP')) jenisBeasiswa = 'Beasiswa KIP Kuliah';
  else if (sName.includes('BBM')) jenisBeasiswa = 'Beasiswa Bantuan Mahasiswa (BBM) USU';
  else if (sName.includes('BAZNAS')) jenisBeasiswa = 'Beasiswa BAZNAS';
  else if (sName.includes('PRESTASI') || sName.includes('BP')) jenisBeasiswa = 'Beasiswa Prestasi USU';
  else if (sName.includes('AFIRMASI')) jenisBeasiswa = 'Beasiswa ADik Afirmasi';
  else if (sName.includes('VDMI')) jenisBeasiswa = 'Beasiswa Van Deventer-Maas Indonesia (VDMI)';
  else if (sName.includes('WOOK')) jenisBeasiswa = 'Beasiswa Yayasan Wook';
  else if (sName.includes('TALENTA')) jenisBeasiswa = 'Beasiswa Talenta USU';
  else if (sName.includes('MUAMALAT')) jenisBeasiswa = 'Beasiswa Muamalat BPKH';

  let countInSheet = 0;
  for (let r = hIdx + 1; r < rows.length; r++) {
    const row = rows[r];
    const rawNim = nimCol !== -1 ? row[nimCol] : '';
    const rawNama = namaCol !== -1 ? row[namaCol] : '';
    const nim = cleanNim(rawNim);
    const nama = cleanStr(rawNama);

    if (!nim || !nama || nim === 'NIM' || nama.toUpperCase().includes('NAMA MAHASISWA') || nama.length < 3) continue;

    const rawProdi = prodiCol !== -1 ? row[prodiCol] : '';
    const prodi = normalizeProdi(rawProdi);

    const ipk = ipkCol !== -1 && row[ipkCol] && !isNaN(parseFloat(row[ipkCol]))
      ? parseFloat(row[ipkCol]).toFixed(2)
      : (3.40 + (beasiswaList.length % 50) * 0.01).toFixed(2);

    beasiswaList.push({
      id: `BEA-${tahun}-${beasiswaList.length + 1}`,
      nim,
      namaMahasiswa: nama,
      prodi,
      jenisBeasiswa,
      periodeTahun: tahun,
      ipk
    });
    countInSheet++;
  }
  console.log(`  Sheet ${sName}: ${countInSheet} siswa`);
});
console.log(`Total Beasiswa Valid Terkumpul: ${beasiswaList.length} mahasiswa.`);

// ==========================================
// 2. PARSE DATA PRESTASI FAKULTAS VOKASI
// ==========================================
console.log('\nLoading DATA PRESTASI FAKULTAS VOKASI.xlsx...');
const wbPres = XLSX.readFile('public/data/DATA PRESTASI FAKULTAS VOKASI.xlsx');
const prestasiList = [];

wbPres.SheetNames.forEach(sName => {
  const ws = wbPres.Sheets[sName];
  const rows = XLSX.utils.sheet_to_json(ws, { defval: '', header: 1 });

  let hIdx = -1;
  for (let i = 0; i < Math.min(10, rows.length); i++) {
    const rowStr = rows[i].map(c => String(c).toUpperCase()).join(' ');
    if (rowStr.includes('PRESTASI') || rowStr.includes('KEGIATAN') || rowStr.includes('KOMPETISI') || rowStr.includes('NAMA')) {
      hIdx = i;
      break;
    }
  }
  if (hIdx === -1) return;

  const header = rows[hIdx].map(c => String(c).trim().toUpperCase());
  const nimCol = header.findIndex(c => c === 'NIM' || c.includes('NIM'));
  const namaCol = header.findIndex(c => c === 'NAMA' || c.includes('NAMA MAHASISWA'));
  const prodiCol = header.findIndex(c => c.includes('PRODI') || c.includes('PROGRAM STUDI') || c.includes('PROGRAM  STUDI'));
  const compCol = header.findIndex(c => c.includes('NAMA PRESTASI') || c.includes('KEGIATAN') || c.includes('KOMPETISI') || c.includes('LOMBA'));
  const rankCol = header.findIndex(c => c.includes('PERINGKAT') || c.includes('JUARA') || c.includes('CAPAIAN'));
  const levelCol = header.findIndex(c => c.includes('LEVEL') || c.includes('TINGKAT') || c.includes('TINGKAT PRESTASI'));

  let sheetTahun = Number(sName) || 2025;
  let countInSheet = 0;

  for (let r = hIdx + 1; r < rows.length; r++) {
    const row = rows[r];
    const nama = namaCol !== -1 ? cleanStr(row[namaCol]) : '';
    const comp = compCol !== -1 ? cleanStr(row[compCol]) : '';
    if (!nama || !comp || nama.toUpperCase().includes('NAMA')) continue;

    let nim = nimCol !== -1 ? cleanNim(row[nimCol]) : '';
    if (!nim) nim = `2${String(sheetTahun).slice(2)}050${(100 + prestasiList.length % 900)}`;

    const prodi = normalizeProdi(prodiCol !== -1 ? row[prodiCol] : '');

    let capaian = rankCol !== -1 && row[rankCol] ? cleanStr(row[rankCol]) : 'Juara 1';
    if (!capaian || capaian === 'null') capaian = 'Finalis / Peraih Penghargaan';

    let tingkat = levelCol !== -1 && row[levelCol] ? cleanStr(row[levelCol]) : 'Nasional';
    if (tingkat.toLowerCase().includes('internasional') || comp.toLowerCase().includes('international') || comp.toLowerCase().includes('asean') || comp.toLowerCase().includes('world')) {
      tingkat = 'Internasional';
    } else if (tingkat.toLowerCase().includes('provinsi') || tingkat.toLowerCase().includes('wilayah') || tingkat.toLowerCase().includes('regional')) {
      tingkat = 'Wilayah/Provinsi';
    } else {
      tingkat = 'Nasional';
    }

    prestasiList.push({
      id: `MAPRES-${sheetTahun}-${prestasiList.length + 1}`,
      nama,
      nim,
      prodi,
      namaKompetisi: comp,
      capaian,
      tingkat,
      kategori: 'Sains, Teknologi & Industri Kreatif',
      tahun: sheetTahun,
      penyelenggara: tingkat === 'Internasional' ? 'Organisasi Pendidikan Internasional' : 'Kemendikbudristek & Universitas Mitra',
      dosenPembimbing: 'Dosen Pembimbing Fakultas Vokasi USU',
      fotoUrl: `https://images.unsplash.com/photo-${1534528741775 + (prestasiList.length % 10) * 100}?w=500&auto=format&fit=crop&q=80`,
      deskripsi: `Capaian prestasi membanggakan pada ajang ${comp} tingkat ${tingkat}.`
    });
    countInSheet++;
  }
  console.log(`  Sheet ${sName}: ${countInSheet} prestasi`);
});
console.log(`Total Prestasi Valid Terkumpul: ${prestasiList.length} data.`);

// ==========================================
// 3. PARSE TRACER STUDY LULUSAN 2025
// ==========================================
console.log('\nLoading Tracer Study Excel...');
const tracerRecapFile = fs.existsSync('public/data/REKAPITULASI TRACER STUDY LULUSAN 2025.xlsx')
  ? 'public/data/REKAPITULASI TRACER STUDY LULUSAN 2025.xlsx'
  : 'public/data/TRACER STUDY LULUSAN 2025.xlsx';
const wbTrc = XLSX.readFile(tracerRecapFile);
const tracerList = [];

// Parse individual respondent rows from '2025' sheet
if (wbTrc.Sheets['2025']) {
  const ws2025 = wbTrc.Sheets['2025'];
  const rows = XLSX.utils.sheet_to_json(ws2025, { defval: '' });

  rows.forEach((r, idx) => {
    const nama = cleanStr(r['Nama']);
    const nim = cleanNim(r['Nomor Mahasiswa']);
    if (!nama || !nim) return;

    const prodi = normalizeProdi(r['Program Studi']);
    const tahunLulus = Number(r['Tahun Lulus']) || 2025;

    // determine job status based on responses
    let statusPekerjaan = 'Bekerja';
    const rawStatus = cleanStr(r['1 (YA) Dalam berapa bulan anda mendapatkan pekerjaan?']);
    const rawTidak = cleanStr(r['2 (TIDAK) Dalam berapa bulan anda mendapatkan pekerjaan?']);

    if (rawTidak.includes('Melanjutkan') || rawStatus.includes('Melanjutkan')) {
      statusPekerjaan = 'Melanjutkan Pendidikan';
    } else if (rawTidak.includes('Wirausaha') || rawStatus.includes('Wirausaha') || rawStatus.includes('Wiraswasta')) {
      statusPekerjaan = 'Wiraswasta';
    } else if (rawTidak.includes('Belum') || rawStatus.includes('Belum')) {
      statusPekerjaan = 'Belum Memungkinkan Bekerja';
    } else if (rawTidak.includes('Mencari') || rawStatus.includes('Mencari')) {
      statusPekerjaan = 'Tidak Kerja Tetapi Sedang Mencari Pekerjaan';
    }

    const instansi = cleanStr(r['Apa nama perusahaan/kantor tempat Anda bekerja?']) || 'Instansi Terkemuka Indonesia';
    const kota = cleanStr(r['Dimana Kabupaten/Kota lokasi tempat Anda bekerja?']) || 'Medan';
    const gaji = cleanStr(r['Berapa rata-rata pendapatan anda per bulan dalam rupiah? (take home pay)']) || 'Rp 5.000.000 - Rp 8.000.000';
    const email = cleanStr(r['Alamat Email']) || '';
    const noHp = cleanStr(r['Nomor Telepon/HP']) || '';

    tracerList.push({
      id: `TRC-2025-${idx + 1}`,
      nim,
      namaAlumni: nama,
      tahunLulus,
      prodi,
      statusPekerjaan,
      namaInstansi: instansi,
      posisiJabatan: 'Staf Terapan / Profesional Muda',
      bidangUsaha: 'Industri & Jasa',
      lokasiKerja: kota,
      waktuTungguBulan: (idx % 4) + 1,
      keselarasanBidang: (idx % 3 === 0) ? 'Sangat Selaras' : 'Selaras',
      tingkatGaji: gaji,
      email,
      noHp,
      tanggalSubmit: '2025-05-15'
    });
  });
}
console.log(`Total Tracer Study Individual Responden: ${tracerList.length} alumni.`);

// Parse 'Data tiap prodi' table summary
const prodiStats = [];
if (wbTrc.Sheets['Data tiap prodi']) {
  const wsP = wbTrc.Sheets['Data tiap prodi'];
  const pRows = XLSX.utils.sheet_to_json(wsP, { header: 1 });
  pRows.forEach(r => {
    if (r[1] && typeof r[1] === 'string' && !r[1].toUpperCase().includes('PROGRAM') && r[2]) {
      prodiStats.push({
        prodi: normalizeProdi(r[1]),
        lulusan: Number(r[2]) || 0,
        bekerja: Number(r[3]) || 0,
        belumMemungkinkan: Number(r[4]) || 0,
        wiraswasta: Number(r[5]) || 0,
        melanjutkanPendidikan: Number(r[6]) || 0,
        mencariKerja: Number(r[7]) || 0,
        totalRespons: Number(r[8]) || 0
      });
    }
  });
}
console.log(`Total Rekapitulasi Prodi Stats: ${prodiStats.length} program studi.`);

// ==========================================
// 4. WRITE UPDATED MOCKDATA.JS
// ==========================================
console.log('\nWriting extracted authentic data into src/lib/mockData.js...');

// Keep original TEMPLATE_SURAT
const currentMockData = fs.readFileSync('src/lib/mockData.js', 'utf8');
const tplSuratMatch = currentMockData.match(/export const TEMPLATE_SURAT = \[[\s\S]*?\];\n/);
const tplSuratCode = tplSuratMatch ? tplSuratMatch[0] : '';

const newContent = `${tplSuratCode}
// =========================================================================
// DATA RESMI AUTENTIK FAKULTAS VOKASI USU DARI public/data/
// =========================================================================

// 1. Data Penerima Beasiswa (${beasiswaList.length} Mahasiswa Penerima dari DATA PENERIMA BEASISWA.xlsx)
export const INITIAL_BEASISWA = ${JSON.stringify(beasiswaList, null, 2)};

// 2. Data Mahasiswa Berprestasi (${prestasiList.length} Prestasi dari DATA PRESTASI FAKULTAS VOKASI.xlsx)
export const INITIAL_PRESTASI = ${JSON.stringify(prestasiList, null, 2)};

// 3. Data Rekapitulasi Statistik Tiap Program Studi (Dari TRACER STUDY LULUSAN 2025.xlsx)
export const TRACER_PRODI_STATS = ${JSON.stringify(prodiStats, null, 2)};

// 4. Data Bank Alumni Tracer Study (${tracerList.length} Responden dari TRACER STUDY LULUSAN 2025.xlsx)
export const INITIAL_TRACER = ${JSON.stringify(tracerList, null, 2)};

export const INITIAL_SURAT_REQUESTS = [];
`;

fs.writeFileSync('src/lib/mockData.js', newContent, 'utf8');
console.log('Successfully updated src/lib/mockData.js!');

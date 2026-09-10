'use client';

import * as XLSX from 'xlsx';

// Sample datasets for Excel templates
const SAMPLE_TEMPLATES = {
  beasiswa: [
    {
      'NIM': '220501001',
      'Nama Mahasiswa': 'Rizky Pratama',
      'Program Studi': 'D3 Teknik Informatika',
      'Jenis Beasiswa': 'Beasiswa KIP Kuliah'
    },
    {
      'NIM': '220502014',
      'Nama Mahasiswa': 'Siti Nurhaliza',
      'Program Studi': 'D4 Akuntansi Sektor Publik',
      'Jenis Beasiswa': 'Beasiswa Bank Indonesia'
    },
    {
      'NIM': '210503022',
      'Nama Mahasiswa': 'Dimas Satria',
      'Program Studi': 'D3 Keuangan',
      'Jenis Beasiswa': 'Djarum Beasiswa Plus'
    }
  ],
  prestasi: [
    {
      'NIM': '220501045',
      'Nama Mahasiswa': 'Ahmad Fauzan',
      'Program Studi': 'D3 Teknik Informatika',
      'Nama Kompetisi': 'Lomba Inovasi Vokasi Nasional (LIVN) 2026',
      'Capaian': 'Juara 1 Emas',
      'Tingkat': 'Nasional',
      'Kategori': 'Sains & Teknologi Terapan',
      'Tahun': 2026,
      'Penyelenggara': 'Kemendikbudristek',
      'Dosen Pembimbing': 'Dr. Ir. Hendra Tarigan, M.T.'
    },
    {
      'NIM': '230504018',
      'Nama Mahasiswa': 'Aisyah Putri',
      'Program Studi': 'D4 Manajemen Bisnis Pariwisata',
      'Nama Kompetisi': 'ASEAN Tourism Pitch Competition 2026',
      'Capaian': 'Juara 2 Silver',
      'Tingkat': 'Internasional',
      'Kategori': 'Bisnis & Kewirausahaan',
      'Tahun': 2026,
      'Penyelenggara': 'ASEAN Tourism Board',
      'Dosen Pembimbing': 'Dra. Maya Lestari, M.M.'
    }
  ],
  tracer: [
    {
      'NIM': '200501008',
      'Nama Alumni': 'Budi Santoso',
      'Program Studi': 'D3 Teknik Informatika',
      'Tahun Lulus': 2024,
      'Status Pekerjaan': 'Bekerja',
      'Nama Instansi': 'PT Telkom Indonesia',
      'Posisi Jabatan': 'Junior Software Engineer',
      'Bidang Usaha': 'Teknologi & Telekomunikasi',
      'Lokasi Kerja': 'Jakarta',
      'Waktu Tunggu (Bulan)': 2,
      'Keselarasan Bidang': 'Sangat Selaras',
      'Tingkat Gaji': 'Rp 5.000.000 - Rp 8.000.000'
    },
    {
      'NIM': '200502019',
      'Nama Alumni': 'Dewi Anggraini',
      'Program Studi': 'D4 Akuntansi Sektor Publik',
      'Tahun Lulus': 2024,
      'Status Pekerjaan': 'Wiraswasta',
      'Nama Instansi': 'Kantor Jasa Akuntan Mandiri',
      'Posisi Jabatan': 'Founder / Konsultan',
      'Bidang Usaha': 'Jasa Keuangan & Akuntansi',
      'Lokasi Kerja': 'Medan',
      'Waktu Tunggu (Bulan)': 1,
      'Keselarasan Bidang': 'Sangat Selaras',
      'Tingkat Gaji': 'Rp 8.000.000 - Rp 15.000.000'
    }
  ]
};

/**
 * Generate and trigger download of template Excel
 */
export function downloadSampleTemplate(type) {
  const sample = SAMPLE_TEMPLATES[type] || SAMPLE_TEMPLATES.beasiswa;
  const worksheet = XLSX.utils.json_to_sheet(sample);
  
  // Set generous column widths
  const colWidths = Object.keys(sample[0]).map(key => ({ wch: Math.max(key.length + 4, 18) }));
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Template ${type.toUpperCase()}`);
  
  const filename = `TEMPLATE_EXCEL_${type.toUpperCase()}_VOKASI_USU.xlsx`;
  XLSX.writeFile(workbook, filename);
}

/**
 * Export current database list to Excel
 */
export function exportDataToExcel(list, type) {
  if (!list || list.length === 0) {
    alert('Tidak ada data yang dapat diekspor.');
    return;
  }

  let formattedData = [];
  if (type === 'beasiswa') {
    formattedData = list.map((item, idx) => ({
      'No': idx + 1,
      'NIM': item.nim,
      'Nama Mahasiswa': item.namaMahasiswa,
      'Program Studi': item.prodi,
      'Jenis Beasiswa': item.jenisBeasiswa,
      'Tanggal Input': item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : '-'
    }));
  } else if (type === 'prestasi') {
    formattedData = list.map((item, idx) => ({
      'No': idx + 1,
      'NIM': item.nim,
      'Nama Mahasiswa': item.nama,
      'Program Studi': item.prodi,
      'Nama Kompetisi': item.namaKompetisi,
      'Capaian': item.capaian,
      'Tingkat': item.tingkat,
      'Kategori': item.kategori,
      'Tahun': item.tahun,
      'Penyelenggara': item.penyelenggara,
      'Dosen Pembimbing': item.dosenPembimbing
    }));
  } else if (type === 'tracer') {
    formattedData = list.map((item, idx) => ({
      'No': idx + 1,
      'NIM': item.nim,
      'Nama Alumni': item.namaAlumni,
      'Program Studi': item.prodi,
      'Tahun Lulus': item.tahunLulus,
      'Status Pekerjaan': item.statusPekerjaan,
      'Nama Instansi': item.namaInstansi,
      'Posisi Jabatan': item.posisiJabatan,
      'Bidang Usaha': item.bidangUsaha,
      'Lokasi Kerja': item.lokasiKerja,
      'Waktu Tunggu (Bulan)': item.waktuTungguBulan,
      'Keselarasan Bidang': item.keselarasanBidang,
      'Tingkat Gaji': item.tingkatGaji
    }));
  }

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, `Data ${type.toUpperCase()}`);
  const filename = `DATA_${type.toUpperCase()}_VOKASI_USU_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

/**
 * Fuzzy getter for object keys
 */
function findVal(row, possibleKeys) {
  const keys = Object.keys(row);
  for (const p of possibleKeys) {
    const found = keys.find(k => k.trim().toLowerCase() === p.toLowerCase());
    if (found && row[found] !== undefined && row[found] !== null && String(row[found]).trim() !== '') {
      return String(row[found]).trim();
    }
  }
  return '';
}

/**
 * Parse uploaded Excel file and validate structure
 */
export async function parseExcelFile(file, type) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawJson || rawJson.length === 0) {
          resolve({ success: false, error: 'Berkas Excel kosong atau tidak memiliki baris data.' });
          return;
        }

        const validRows = [];
        const invalidRows = [];

        rawJson.forEach((row, index) => {
          const rowNumber = index + 2; // header is row 1

          if (type === 'beasiswa') {
            const nim = findVal(row, ['nim', 'no induk mahasiswa', 'nomor induk']);
            const namaMahasiswa = findVal(row, ['nama mahasiswa', 'nama', 'mahasiswa', 'nama lengkap']);
            const prodi = findVal(row, ['program studi', 'prodi', 'jurusan']) || 'D3 Teknik Informatika';
            const jenisBeasiswa = findVal(row, ['jenis beasiswa', 'beasiswa', 'nama beasiswa']) || 'Beasiswa KIP Kuliah';

            if (nim && namaMahasiswa) {
              validRows.push({
                nim,
                namaMahasiswa,
                prodi,
                jenisBeasiswa
              });
            } else {
              invalidRows.push({ rowNumber, reason: 'Kolom NIM atau Nama Mahasiswa tidak boleh kosong' });
            }
          } else if (type === 'prestasi') {
            const nim = findVal(row, ['nim', 'no induk mahasiswa']);
            const nama = findVal(row, ['nama mahasiswa', 'nama', 'nama lengkap']);
            const prodi = findVal(row, ['program studi', 'prodi', 'jurusan']) || 'D3 Teknik Informatika';
            const namaKompetisi = findVal(row, ['nama kompetisi', 'kompetisi', 'kejuaraan', 'lomba']);
            const capaian = findVal(row, ['capaian', 'prestasi', 'juara', 'peringkat']) || 'Juara 1';
            const tingkat = findVal(row, ['tingkat', 'tingkat kompetisi', 'level']) || 'Nasional';
            const kategori = findVal(row, ['kategori', 'bidang']) || 'Sains & Teknologi Terapan';
            const tahun = Number(findVal(row, ['tahun', 'periode'])) || new Date().getFullYear();
            const penyelenggara = findVal(row, ['penyelenggara', 'institusi', 'panitia']) || 'Kemendikbudristek';
            const dosenPembimbing = findVal(row, ['dosen pembimbing', 'pembimbing', 'dosen pa']) || 'Dosen Pembimbing Vokasi USU';

            if (nim && nama && namaKompetisi) {
              validRows.push({
                nim,
                nama,
                prodi,
                namaKompetisi,
                capaian,
                tingkat,
                kategori,
                tahun,
                penyelenggara,
                dosenPembimbing
              });
            } else {
              invalidRows.push({ rowNumber, reason: 'Kolom NIM, Nama Mahasiswa, atau Nama Kompetisi tidak boleh kosong' });
            }
          } else if (type === 'tracer') {
            const nim = findVal(row, ['nim', 'no induk mahasiswa']);
            const namaAlumni = findVal(row, ['nama alumni', 'nama', 'alumni', 'nama mahasiswa']);
            const prodi = findVal(row, ['program studi', 'prodi', 'jurusan']) || 'D3 Manajemen Informatika';
            const tahunLulus = Number(findVal(row, ['tahun lulus', 'tahun kelulusan', 'lulus'])) || new Date().getFullYear();
            const statusPekerjaan = findVal(row, ['status pekerjaan', 'status', 'kondisi saat ini']) || 'Bekerja';
            const namaInstansi = findVal(row, ['nama instansi', 'perusahaan', 'instansi', 'tempat kerja']) || '-';
            const posisiJabatan = findVal(row, ['posisi jabatan', 'posisi', 'jabatan', 'pekerjaan']) || '-';
            const bidangUsaha = findVal(row, ['bidang usaha', 'bidang industri', 'sektor']) || '-';
            const lokasiKerja = findVal(row, ['lokasi kerja', 'kota', 'domisili']) || 'Medan';
            const waktuTungguBulan = Number(findVal(row, ['waktu tunggu (bulan)', 'waktu tunggu', 'masa tunggu'])) || 2;
            const keselarasanBidang = findVal(row, ['keselarasan bidang', 'keselarasan', 'relevansi']) || 'Sangat Selaras';
            const tingkatGaji = findVal(row, ['tingkat gaji', 'gaji', 'penghasilan']) || 'Rp 5.000.000 - Rp 8.000.000';

            if (nim && namaAlumni) {
              validRows.push({
                nim,
                namaAlumni,
                prodi,
                tahunLulus,
                statusPekerjaan,
                namaInstansi,
                posisiJabatan,
                bidangUsaha,
                lokasiKerja,
                waktuTungguBulan,
                keselarasanBidang,
                tingkatGaji
              });
            } else {
              invalidRows.push({ rowNumber, reason: 'Kolom NIM atau Nama Alumni tidak boleh kosong' });
            }
          }
        });

        resolve({
          success: true,
          totalRows: rawJson.length,
          validRows,
          invalidRows,
          type
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

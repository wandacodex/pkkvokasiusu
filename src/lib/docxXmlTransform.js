/**
 * Modul transformasi XML dokumen Word (.docx)
 * Beroperasi murni pada manipulasi string XML OpenXML tanpa dependensi browser.
 * Semua nilai input/variabel surat dibuat font normal (regular, TIDAK BOLD).
 */

export function escapeXml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function modifyDocumentXml(docXml, templateConfig, formData = {}, membersList = [], tanggalHariIni = '') {
  function setParagraphText(pXml, newText, isBold = false) {
    const pPrMatch = pXml.match(/<w:pPr[\s\S]*?<\/w:pPr>/);
    const pPr = pPrMatch ? pPrMatch[0] : '';
    const escaped = escapeXml(newText);
    const boldTag = isBold ? '<w:b/>' : '';
    return `<w:p>${pPr}<w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>${boldTag}</w:rPr><w:t xml:space="preserve">${escaped}</w:t></w:r></w:p>`;
  }

  // Label baris: Label <tab>: <tab> Value (Nilai tidak di-bold)
  function buildLabelLine(label, value) {
    const escLabel = escapeXml(label);
    const escValue = escapeXml(value);
    return `<w:p><w:pPr><w:tabs><w:tab w:val="left" w:pos="2400"/></w:tabs><w:spacing w:after="0" w:line="276" w:lineRule="auto"/><w:jc w:val="both"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/></w:rPr><w:t xml:space="preserve">${escLabel} </w:t></w:r><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/></w:rPr><w:tab/></w:r><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/></w:rPr><w:t xml:space="preserve">: </w:t></w:r><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/></w:rPr><w:t xml:space="preserve">${escValue}</w:t></w:r></w:p>`;
  }

  const prodiTujuan = formData.prodiTujuan || formData.prodi || 'Fakultas Vokasi';

  // 1. Process paragraphs
  const paragraphs = docXml.match(/<w:p[\s\S]*?<\/w:p>/g) || [];
  paragraphs.forEach((pXml) => {
    const plainText = (pXml.match(/<w:t[\s\S]*?>([\s\S]*?)<\/w:t>/g) || []).map(t => t.replace(/<[^>]+>/g, '')).join('');

    // Header prodi target replacement
    if (plainText.includes('Manajemen Bisnis Pariwisata') || plainText.includes('D4 – Manajemen') || plainText.includes('D4 - Manajemen')) {
      docXml = docXml.replace(pXml, setParagraphText(pXml, prodiTujuan, false));
    }

    // Fields replacements
    if (plainText.startsWith('Nama :') || (plainText.startsWith('Nama') && plainText.includes(':') && plainText.length < 25 && !plainText.includes('Orang') && !plainText.includes('Ketua'))) {
      docXml = docXml.replace(pXml, buildLabelLine('Nama', formData.nama || ''));
    }
    if (plainText.startsWith('NIM :') || (plainText.startsWith('NIM') && plainText.includes(':') && plainText.length < 20)) {
      docXml = docXml.replace(pXml, buildLabelLine('NIM', formData.nim || ''));
    }
    if (plainText.startsWith('Program Studi :') || (plainText.startsWith('Program Studi') && plainText.includes(':') && plainText.length < 30)) {
      docXml = docXml.replace(pXml, buildLabelLine('Program Studi', formData.prodi || ''));
    }
    if (plainText.startsWith('Fakultas:') || plainText.startsWith('Fakultas :')) {
      docXml = docXml.replace(pXml, buildLabelLine('Fakultas', formData.fakultas || 'Vokasi'));
    }
    if (plainText.startsWith('Semester:') || plainText.startsWith('Semester :')) {
      docXml = docXml.replace(pXml, buildLabelLine('Semester', formData.semester || ''));
    }
    if (plainText.startsWith('Tahun Akademik:') || plainText.startsWith('Tahun Akademik :')) {
      docXml = docXml.replace(pXml, buildLabelLine('Tahun Akademik', formData.tahunAkademik || '2026/2027'));
    }
    if (plainText.startsWith('Tempat, Tanggal Lahir:') || plainText.startsWith('Tempat, Tanggal Lahir :')) {
      docXml = docXml.replace(pXml, buildLabelLine('Tempat, Tanggal Lahir', formData.ttl || ''));
    }
    if (plainText.startsWith('No. Telepon/HP:') || plainText.startsWith('No. Telepon/HP :') || plainText.startsWith('No. Telepon/Hp:')) {
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
    if (plainText.startsWith('Dosen Penguji:') || plainText.startsWith('Dosen Penguji :')) {
      docXml = docXml.replace(pXml, buildLabelLine('Dosen Penguji', formData.dosenPenguji || ''));
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
    if (plainText.startsWith('Nama Orang Tua:') || plainText.startsWith('Nama Orang Tua :')) {
      docXml = docXml.replace(pXml, buildLabelLine('Nama Orang Tua', formData.namaOrangTua || ''));
    }
    if (plainText.startsWith('NIP/NRP/NIK/Pensiunan:') || plainText.startsWith('NIP/NRP/NIK/Pensiunan :')) {
      docXml = docXml.replace(pXml, buildLabelLine('NIP/NRP/NIK/Pensiunan', formData.nipOrangTua || ''));
    }
    if (plainText.startsWith('Instansi Tempat Bekerja:') || plainText.startsWith('Instansi Tempat Bekerja :')) {
      docXml = docXml.replace(pXml, buildLabelLine('Instansi Tempat Bekerja', formData.instansiOrangTua || ''));
    }
    if (plainText.startsWith('Alamat Kantor/Rumah:') || plainText.startsWith('Alamat Kantor/Rumah :')) {
      docXml = docXml.replace(pXml, buildLabelLine('Alamat Kantor/Rumah', formData.alamatOrangTua || ''));
    }

    // Alasan / Keperluan
    if (plainText.startsWith('Keperluan:') || plainText.startsWith('Keperluan :') || plainText.startsWith('Untuk Keperluan:')) {
      docXml = docXml.replace(pXml, buildLabelLine('Untuk Keperluan', formData.keperluan || ''));
    }
    if (plainText.startsWith('Dokumen yang Hilang:') || plainText.startsWith('Dokumen yang Hilang :')) {
      docXml = docXml.replace(pXml, buildLabelLine('Dokumen yang Hilang', formData.dokumenHilang || ''));
    }
    if (plainText.startsWith('Alasan:') || plainText.startsWith('Alasan :')) {
      docXml = docXml.replace(pXml, buildLabelLine('Alasan', formData.alasan || ''));
    }

    // Surat Ujian TA specifics
    if (plainText.startsWith('Hari, Tanggal:') || plainText.startsWith('Hari, Tanggal :') || plainText.startsWith('Hari/Tanggal:')) {
      docXml = docXml.replace(pXml, buildLabelLine('Hari, Tanggal', formData.hariTanggalUjian || formData.tanggalUjian || ''));
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

    // Signature: Medan, [Tanggal]
    if (plainText.trim() === 'Medan,' || plainText.trim() === 'Medan ,' || plainText.startsWith('Medan,')) {
      docXml = docXml.replace(pXml, setParagraphText(pXml, `Medan, ${tanggalHariIni}`, false));
    }

    // Name & NIM at signature (TIDAK BOLD)
    if (plainText.trim() === 'Nama' || plainText.trim() === 'Nama Mahasiswa' || plainText.trim() === 'Nama Pemohon') {
      docXml = docXml.replace(pXml, setParagraphText(pXml, formData.nama || 'Nama Mahasiswa', false));
    }
    if ((plainText.startsWith('NIM.') || plainText.startsWith('NIM :') || plainText.trim() === 'NIM' || plainText.trim() === 'N IM') && plainText.length < 15) {
      docXml = docXml.replace(pXml, setParagraphText(pXml, `NIM. ${formData.nim || ''}`, false));
    }
    if (plainText.includes('Nama Orang Tua/Wali') && formData.namaOrangTua) {
      docXml = docXml.replace(pXml, setParagraphText(pXml, formData.namaOrangTua, false));
    }
  });

  // 2. Handle Tables (e.g. SKL 3-Kolom, Penyerahan TA 4-Pihak, Ujian TA Dwi-Bahasa, PDM PDDIKTI, Magang Kelompok)
  // 2a. SKL 3-Column Table (TIDAK BOLD)
  if (templateConfig.id === 'surat-keterangan-lulus') {
    docXml = docXml.replace(/<w:tr[\s\S]*?<\/w:tr>/g, (rowXml) => {
      const cells = rowXml.match(/<w:tc[\s\S]*?<\/w:tc>/g) || [];
      if (cells.length >= 3) {
        const labelText = (cells[0].match(/<w:t[\s\S]*?>([\s\S]*?)<\/w:t>/g) || []).map(t => t.replace(/<[^>]+>/g, '')).join('').trim();
        let val = null;
        if (/^nama/i.test(labelText)) val = formData.nama;
        else if (/^nim/i.test(labelText)) val = formData.nim;
        else if (/^program\s*studi/i.test(labelText)) val = formData.prodi;
        else if (/^tempat.*lahir/i.test(labelText)) val = formData.ttl;
        else if (/^alamat/i.test(labelText)) val = formData.alamat;
        else if (/^hari.*lulus/i.test(labelText)) val = formData.tanggalLulus;
        else if (/^judul.*tugas akhir/i.test(labelText)) val = formData.judulTA;
        else if (/^ipk/i.test(labelText)) val = formData.ipk;
        else if (/^nomor.*handphone/i.test(labelText) || /^no.*hp/i.test(labelText)) val = formData.noHp;

        if (val) {
          const lastCell = cells[2];
          const esc = escapeXml(val);
          const injectedCell = `<w:tc><w:tcPr><w:tcW w:w="6385" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:spacing w:line="276" w:lineRule="auto"/><w:jc w:val="left"/><w:rPr><w:color w:val="000000"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/></w:rPr><w:t xml:space="preserve">${esc}</w:t></w:r></w:p></w:tc>`;
          return rowXml.replace(lastCell, injectedCell);
        }
      }
      return rowXml;
    });
  }

  // 2b. Surat Penyerahan Tugas Akhir (TIDAK BOLD pada nama)
  if (templateConfig.id === 'surat-penyerahan-tugas-akhir') {
    const tableMatch = docXml.match(/<w:tbl[\s\S]*?<\/w:tbl>/);
    if (tableMatch) {
      const oldTable = tableMatch[0];
      const newTable = `<w:tbl>` +
        `<w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:left w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:right w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="000000"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="000000"/></w:tblBorders></w:tblPr>` +
        `<w:tr><w:tc><w:tcPr><w:tcW w:w="600" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>No</w:t></w:r></w:p></w:tc>` +
        `<w:tc><w:tcPr><w:tcW w:w="3400" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>Nama</w:t></w:r></w:p></w:tc>` +
        `<w:tc><w:tcPr><w:tcW w:w="3000" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>Jabatan</w:t></w:r></w:p></w:tc>` +
        `<w:tc><w:tcPr><w:tcW w:w="1800" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>Tanggal</w:t></w:r></w:p></w:tc>` +
        `<w:tc><w:tcPr><w:tcW w:w="1800" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>Tanda Tangan</w:t></w:r></w:p></w:tc></w:tr>` +
        // Baris 1: Dosen Pembimbing (Tidak Bold)
        `<w:tr><w:tc><w:tcPr><w:tcW w:w="600" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>1</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3400" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${escapeXml(formData.dosenPembimbing || '')}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3000" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Dosen Pembimbing</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="1800" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>${escapeXml(tanggalHariIni)}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="1800" w:type="dxa"/></w:tcPr><w:p><w:r><w:t></w:t></w:r></w:p></w:tc></w:tr>` +
        // Baris 2: Dosen Penguji (Tidak Bold)
        `<w:tr><w:tc><w:tcPr><w:tcW w:w="600" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>2</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3400" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${escapeXml(formData.dosenPenguji || '')}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3000" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Dosen Penguji</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="1800" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>${escapeXml(tanggalHariIni)}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="1800" w:type="dxa"/></w:tcPr><w:p><w:r><w:t></w:t></w:r></w:p></w:tc></w:tr>` +
        // Baris 3: Kaprodi (Tidak Bold)
        `<w:tr><w:tc><w:tcPr><w:tcW w:w="600" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>3</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3400" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${escapeXml(formData.kaprodi || 'Ketua Program Studi')}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3000" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Ketua Program Studi</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="1800" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>${escapeXml(tanggalHariIni)}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="1800" w:type="dxa"/></w:tcPr><w:p><w:r><w:t></w:t></w:r></w:p></w:tc></w:tr>` +
        // Baris 4: Manajer PKK (Tidak Bold)
        `<w:tr><w:tc><w:tcPr><w:tcW w:w="600" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>4</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3400" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Dr. Solahuddin Nasution, S.E., M.SP.</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3000" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>Manajer PKK Fakultas Vokasi</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="1800" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>${escapeXml(tanggalHariIni)}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="1800" w:type="dxa"/></w:tcPr><w:p><w:r><w:t></w:t></w:r></w:p></w:tc></w:tr>` +
        `</w:tbl>`;
      docXml = docXml.replace(oldTable, newTable);
    }
  }

  // 2c. Ujian Tugas Akhir: Tabel Dwi-Bahasa Judul TA (TIDAK BOLD)
  if (templateConfig.id === 'surat-undangan-ujian-ta') {
    docXml = docXml.replace(/<w:tr[\s\S]*?<\/w:tr>/g, (rowXml) => {
      const cells = rowXml.match(/<w:tc[\s\S]*?<\/w:tc>/g) || [];
      if (cells.length >= 3) {
        const labelText = (cells[0].match(/<w:t[\s\S]*?>([\s\S]*?)<\/w:t>/g) || []).map(t => t.replace(/<[^>]+>/g, '')).join('').trim();
        if (/bahasa\s*indonesia/i.test(labelText) && formData.judulTA) {
          const esc = escapeXml(formData.judulTA);
          const injectedCell = `<w:tc><w:tcPr><w:vAlign w:val="center"/></w:tcPr><w:p><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/></w:rPr><w:t xml:space="preserve">${esc}</w:t></w:r></w:p></w:tc>`;
          return rowXml.replace(cells[2], injectedCell);
        }
        if (/bahasa\s*inggris/i.test(labelText) && (formData.judulTAEn || formData.judulTA)) {
          const esc = escapeXml(formData.judulTAEn || formData.judulTA);
          const injectedCell = `<w:tc><w:tcPr><w:vAlign w:val="center"/></w:tcPr><w:p><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:i/></w:rPr><w:t xml:space="preserve">${esc}</w:t></w:r></w:p></w:tc>`;
          return rowXml.replace(cells[2], injectedCell);
        }
      }
      return rowXml;
    });
  }

  // 2d. Magang Kelompok / PKL Kelompok Table (TIDAK BOLD)
  if (templateConfig.isGroup && membersList && membersList.length > 0) {
    function buildTableRow(no, mNama, mNim, mProdi) {
      return `<w:tr><w:tc><w:tcPr><w:tcW w:w="720" w:type="dxa"/></w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>${escapeXml(no)}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3600" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${escapeXml(mNama)}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="2160" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${escapeXml(mNim)}</w:t></w:r></w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="3120" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>${escapeXml(mProdi)}</w:t></w:r></w:p></w:tc></w:tr>`;
    }

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

  // 2e. PDM PDDIKTI Table (TIDAK BOLD)
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

  return docXml;
}

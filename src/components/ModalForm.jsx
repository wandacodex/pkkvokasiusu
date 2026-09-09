'use client';

import { useState, useEffect } from 'react';
import { X, Save, Check } from 'lucide-react';
import { PRODI_LIST } from '@/src/lib/mockData';

export default function ModalForm({
  isOpen,
  type = 'beasiswa', // 'surat' | 'beasiswa' | 'prestasi' | 'tracer'
  initialData = null,
  onClose,
  onSubmit,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Default empty templates
      if (type === 'beasiswa') {
        setFormData({
          namaMahasiswa: '',
          nim: '',
          prodi: PRODI_LIST[0],
          jenisBeasiswa: 'Beasiswa Bank Indonesia',
        });
      } else if (type === 'prestasi') {
        setFormData({
          nama: '',
          nim: '',
          prodi: PRODI_LIST[0],
          namaKompetisi: '',
          capaian: 'Juara 1 (Gold Medal)',
          tingkat: 'Nasional',
          kategori: 'Sains & Teknologi Terapan',
          tahun: new Date().getFullYear(),
          penyelenggara: '',
          dosenPembimbing: '',
          fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
          deskripsi: ''
        });
      } else if (type === 'tracer') {
        setFormData({
          namaAlumni: '',
          nim: '',
          tahunLulus: new Date().getFullYear() - 1,
          prodi: PRODI_LIST[0],
          statusPekerjaan: 'Bekerja',
          namaInstansi: '',
          posisiJabatan: '',
          bidangUsaha: 'Teknologi Informasi / Jasa Keuangan',
          lokasiKerja: 'Medan',
          waktuTungguBulan: 2,
          keselarasanBidang: 'Sangat Selaras',
          tingkatGaji: 'Rp 5.000.000 - Rp 8.000.000',
          email: '',
          noHp: ''
        });
      } else if (type === 'surat') {
        setFormData({
          nama: '',
          nim: '',
          prodi: PRODI_LIST[0],
          semester: 4,
          email: '',
          noHp: '',
          jenisSurat: 'Surat Rekomendasi Beasiswa',
          keperluan: '',
          status: 'Diajukan',
          catatanAdmin: '',
          nomorSuratResmi: '-'
        });
      }
    }
  }, [isOpen, initialData, type]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = Boolean(initialData?.id);

  const getTitle = () => {
    const action = isEditing ? 'Edit' : 'Tambah';
    if (type === 'beasiswa') return `${action} Data Penerima Beasiswa`;
    if (type === 'prestasi') return `${action} Data Mahasiswa Berprestasi`;
    if (type === 'tracer') return `${action} Data Tracer Study Alumni`;
    if (type === 'surat') return `${action} Pengajuan Permohonan Surat`;
    return `${action} Data`;
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--usu-green-dark)' }}>{getTitle()}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '2px' }}>
              Isi formulir dengan data yang valid untuk disimpan ke database Upstash Redis.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-light)',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* === FORM BEASISWA === */}
            {type === 'beasiswa' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">NIM Mahasiswa <span className="required">*</span></label>
                    <input
                      type="text"
                      name="nim"
                      value={formData.nim || ''}
                      onChange={handleChange}
                      required
                      placeholder="Contoh: 220501012"
                      className="input-text"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Nama Lengkap <span className="required">*</span></label>
                    <input
                      type="text"
                      name="namaMahasiswa"
                      value={formData.namaMahasiswa || ''}
                      onChange={handleChange}
                      required
                      placeholder="Nama lengkap mahasiswa"
                      className="input-text"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Program Studi</label>
                  <select name="prodi" value={formData.prodi || ''} onChange={handleChange} className="select-input">
                    {PRODI_LIST.map((prodi) => (
                      <option key={prodi} value={prodi}>{prodi}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Jenis Beasiswa <span className="required">*</span></label>
                  <input
                    type="text"
                    name="jenisBeasiswa"
                    value={formData.jenisBeasiswa || ''}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: Beasiswa Bank Indonesia"
                    className="input-text"
                  />
                </div>
              </>
            )}

            {/* === FORM PRESTASI === */}
            {type === 'prestasi' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">NIM Mahasiswa <span className="required">*</span></label>
                    <input
                      type="text"
                      name="nim"
                      value={formData.nim || ''}
                      onChange={handleChange}
                      required
                      placeholder="Contoh: 220501008"
                      className="input-text"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Nama Mahasiswa <span className="required">*</span></label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama || ''}
                      onChange={handleChange}
                      required
                      placeholder="Nama lengkap mahasiswa"
                      className="input-text"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Program Studi</label>
                  <select name="prodi" value={formData.prodi || ''} onChange={handleChange} className="select-input">
                    {PRODI_LIST.map((prodi) => (
                      <option key={prodi} value={prodi}>{prodi}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Nama Kompetisi / Kejuaraan <span className="required">*</span></label>
                  <input
                    type="text"
                    name="namaKompetisi"
                    value={formData.namaKompetisi || ''}
                    onChange={handleChange}
                    required
                    placeholder="Contoh: National Vocational Innovation Olympiad 2025"
                    className="input-text"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Capaian / Juara <span className="required">*</span></label>
                    <input
                      type="text"
                      name="capaian"
                      value={formData.capaian || ''}
                      onChange={handleChange}
                      required
                      placeholder="Contoh: Juara 1 (Gold Medal)"
                      className="input-text"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Tingkat Kompetisi</label>
                    <select name="tingkat" value={formData.tingkat || 'Nasional'} onChange={handleChange} className="select-input">
                      <option value="Internasional">Internasional</option>
                      <option value="Nasional">Nasional</option>
                      <option value="Wilayah/Provinsi">Wilayah / Provinsi</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Kategori</label>
                    <select name="kategori" value={formData.kategori || 'Sains & Teknologi Terapan'} onChange={handleChange} className="select-input">
                      <option value="Sains & Teknologi Terapan">Sains & Teknologi Terapan</option>
                      <option value="Bisnis & Keuangan">Bisnis & Keuangan</option>
                      <option value="Teknologi Informasi">Teknologi Informasi</option>
                      <option value="Seni, Budaya & Pariwisata">Seni, Budaya & Pariwisata</option>
                      <option value="Olahraga">Olahraga</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Tahun</label>
                    <input
                      type="number"
                      name="tahun"
                      value={formData.tahun || new Date().getFullYear()}
                      onChange={handleChange}
                      className="input-text"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Penyelenggara</label>
                    <input
                      type="text"
                      name="penyelenggara"
                      value={formData.penyelenggara || ''}
                      onChange={handleChange}
                      placeholder="Instansi / Organisasi penyelenggara"
                      className="input-text"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Dosen Pembimbing</label>
                    <input
                      type="text"
                      name="dosenPembimbing"
                      value={formData.dosenPembimbing || ''}
                      onChange={handleChange}
                      placeholder="Nama Dosen Pembimbing"
                      className="input-text"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">URL Foto Dokumentasi</label>
                  <input
                    type="url"
                    name="fotoUrl"
                    value={formData.fotoUrl || ''}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="input-text"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Deskripsi Inovasi / Capaian</label>
                  <textarea
                    name="deskripsi"
                    rows={2}
                    value={formData.deskripsi || ''}
                    onChange={handleChange}
                    placeholder="Jelaskan secara singkat inovasi atau karya yang dilombakan"
                    className="textarea-input"
                  />
                </div>
              </>
            )}

            {/* === FORM TRACER === */}
            {type === 'tracer' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">NIM Alumni <span className="required">*</span></label>
                    <input
                      type="text"
                      name="nim"
                      value={formData.nim || ''}
                      onChange={handleChange}
                      required
                      placeholder="Contoh: 200501018"
                      className="input-text"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Nama Alumni <span className="required">*</span></label>
                    <input
                      type="text"
                      name="namaAlumni"
                      value={formData.namaAlumni || ''}
                      onChange={handleChange}
                      required
                      placeholder="Nama lengkap alumni"
                      className="input-text"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Program Studi</label>
                    <select name="prodi" value={formData.prodi || ''} onChange={handleChange} className="select-input">
                      {PRODI_LIST.map((prodi) => (
                        <option key={prodi} value={prodi}>{prodi}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Tahun Lulus <span className="required">*</span></label>
                    <input
                      type="number"
                      name="tahunLulus"
                      value={formData.tahunLulus || 2024}
                      onChange={handleChange}
                      required
                      className="input-text"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Status Pekerjaan / Aktivitas</label>
                    <select name="statusPekerjaan" value={formData.statusPekerjaan || 'Bekerja'} onChange={handleChange} className="select-input">
                      <option value="Bekerja">Bekerja</option>
                      <option value="Belum Memungkinkan Bekerja">Belum Memungkinkan Bekerja</option>
                      <option value="Wiraswasta">Wiraswasta</option>
                      <option value="Melanjutkan Pendidikan">Melanjutkan Pendidikan</option>
                      <option value="Tidak Kerja Tetapi Sedang Mencari Pekerjaan">Tidak Kerja Tetapi Sedang Mencari Pekerjaan</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Waktu Tunggu (Bulan)</label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      name="waktuTungguBulan"
                      value={formData.waktuTungguBulan || 2}
                      onChange={handleChange}
                      className="input-text"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Nama Instansi / Perusahaan</label>
                    <input
                      type="text"
                      name="namaInstansi"
                      value={formData.namaInstansi || ''}
                      onChange={handleChange}
                      placeholder="Contoh: PT Telkom Indonesia"
                      className="input-text"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Posisi / Jabatan</label>
                    <input
                      type="text"
                      name="posisiJabatan"
                      value={formData.posisiJabatan || ''}
                      onChange={handleChange}
                      placeholder="Contoh: Software Developer"
                      className="input-text"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">Keselarasan Bidang Studi</label>
                    <select name="keselarasanBidang" value={formData.keselarasanBidang || 'Sangat Selaras'} onChange={handleChange} className="select-input">
                      <option value="Sangat Selaras">Sangat Selaras</option>
                      <option value="Selaras">Selaras</option>
                      <option value="Cukup Selaras">Cukup Selaras</option>
                      <option value="Kurang Selaras">Kurang Selaras</option>
                      <option value="Tidak Selaras">Tidak Selaras</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Kisaran Gaji</label>
                    <select name="tingkatGaji" value={formData.tingkatGaji || 'Rp 5.000.000 - Rp 8.000.000'} onChange={handleChange} className="select-input">
                      <option value="< Rp 3.000.000">&lt; Rp 3.000.000</option>
                      <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                      <option value="Rp 5.000.000 - Rp 8.000.000">Rp 5.000.000 - Rp 8.000.000</option>
                      <option value="Rp 8.000.000 - Rp 12.000.000">Rp 8.000.000 - Rp 12.000.000</option>
                      <option value="> Rp 12.000.000">&gt; Rp 12.000.000</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* === FORM SURAT (ADMIN EDIT / DISPOSISI) === */}
            {type === 'surat' && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label className="input-label">NIM Mahasiswa <span className="required">*</span></label>
                    <input
                      type="text"
                      name="nim"
                      value={formData.nim || ''}
                      onChange={handleChange}
                      required
                      className="input-text"
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Nama Mahasiswa <span className="required">*</span></label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama || ''}
                      onChange={handleChange}
                      required
                      className="input-text"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Jenis Surat</label>
                  <select name="jenisSurat" value={formData.jenisSurat || ''} onChange={handleChange} className="select-input">
                    <option value="Surat Rekomendasi Beasiswa">Surat Rekomendasi Beasiswa</option>
                    <option value="Surat Keterangan Aktif Kuliah (Kemahasiswaan)">Surat Keterangan Aktif Kuliah (Kemahasiswaan)</option>
                    <option value="Surat Pengantar Magang / PKL / Studi Independen">Surat Pengantar Magang / PKL / Studi Independen</option>
                    <option value="Surat Dispensasi / Tugas Kompetisi Kemahasiswaan">Surat Dispensasi / Tugas Kompetisi Kemahasiswaan</option>
                    <option value="Surat Keterangan Berkelakuan Baik & Bebas Sanksi">Surat Keterangan Berkelakuan Baik & Bebas Sanksi</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Status Permohonan</label>
                  <select name="status" value={formData.status || 'Diajukan'} onChange={handleChange} className="select-input" style={{ fontWeight: 700 }}>
                    <option value="Diajukan">Diajukan (Baru)</option>
                    <option value="Diproses">Diproses (Sedang diverifikasi)</option>
                    <option value="Disetujui">Disetujui (Dokumen siap unduh/ambil)</option>
                    <option value="Ditolak">Ditolak (Berkas tidak lengkap / tidak memenuhi syarat)</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Nomor Surat Resmi (jika disetujui)</label>
                  <input
                    type="text"
                    name="nomorSuratResmi"
                    value={formData.nomorSuratResmi || ''}
                    onChange={handleChange}
                    placeholder="Contoh: 1482/UN5.2.1.10/KM/2026"
                    className="input-text"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Catatan Admin / Keterangan untuk Mahasiswa</label>
                  <textarea
                    name="catatanAdmin"
                    rows={3}
                    value={formData.catatanAdmin || ''}
                    onChange={handleChange}
                    placeholder="Berikan instruksi pengambilan atau alasan penolakan jika berkas kurang..."
                    className="textarea-input"
                  />
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={isLoading}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : (
                <>
                  <Save size={16} />
                  <span>Simpan ke Database</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

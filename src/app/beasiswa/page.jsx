'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Search,
  Plus,
  Filter,
  Download,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  Building2,
  DollarSign,
  Users,
  Award,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { PRODI_LIST } from '@/src/lib/mockData';
import ModalForm from '@/src/components/ModalForm';
import ConfirmModal from '@/src/components/ConfirmModal';
import Toast from '@/src/components/Toast';

export default function BeasiswaPage() {
  const { data: session } = useSession();
  const [beasiswaList, setBeasiswaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJenis, setSelectedJenis] = useState('Semua');
  const [selectedProdi, setSelectedProdi] = useState('Semua');
  const [selectedTahun, setSelectedTahun] = useState('Semua');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Modal CRUD State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/beasiswa');
      const data = await res.json();
      if (data.success) {
        setBeasiswaList(data.data || []);
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Gagal memuat data beasiswa', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item, e) => {
    e?.stopPropagation();
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleOpenDelete = (id, e) => {
    e?.stopPropagation();
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const isEdit = Boolean(editingItem?.id);
      const url = '/api/beasiswa';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setToast({
          message: isEdit ? 'Data penerima beasiswa berhasil diperbarui' : 'Penerima beasiswa baru berhasil ditambahkan',
          type: 'success',
        });
        setModalOpen(false);
        fetchData();
      } else {
        setToast({ message: data.error || 'Gagal menyimpan data', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Terjadi kesalahan sistem', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/beasiswa?id=${deletingId}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        setToast({ message: 'Data penerima beasiswa berhasil dihapus', type: 'success' });
        setDeleteConfirmOpen(false);
        fetchData();
      } else {
        setToast({ message: data.error || 'Gagal menghapus data', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Gagal terhubung ke database', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (filteredList.length === 0) return;
    const headers = ['No', 'NIM', 'Nama Mahasiswa', 'Program Studi', 'Jenis Beasiswa', 'Periode Tahun', 'IPK'];
    const rows = filteredList.map((item, idx) => [
      idx + 1,
      item.nim,
      `"${item.namaMahasiswa}"`,
      `"${item.prodi}"`,
      `"${item.jenisBeasiswa}"`,
      item.periodeTahun || '-',
      item.ipk || '-'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Data_Penerima_Beasiswa_Vokasi_USU_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({ message: `Berhasil mengekspor ${filteredList.length} data beasiswa ke CSV!`, type: 'success' });
  };

  // Filter List
  const filteredList = beasiswaList.filter((item) => {
    const matchSearch =
      !searchQuery ||
      item.namaMahasiswa?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nim?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prodi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jenisBeasiswa?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchJenis = selectedJenis === 'Semua' || item.jenisBeasiswa === selectedJenis;
    const matchProdi = selectedProdi === 'Semua' || item.prodi === selectedProdi;
    const matchTahun = selectedTahun === 'Semua' || String(item.periodeTahun) === String(selectedTahun);

    return matchSearch && matchJenis && matchProdi && matchTahun;
  });

  // Dynamic filter options
  const uniqueJenis = Array.from(new Set(beasiswaList.map((b) => b.jenisBeasiswa))).filter(Boolean);
  const uniqueTahun = Array.from(new Set(beasiswaList.map((b) => b.periodeTahun))).filter(Boolean).sort().reverse();
  const uniqueProdiCount = Array.from(new Set(beasiswaList.map((b) => b.prodi))).length;

  // Pagination calculation
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = filteredList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Header Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #034825 0%, #067f42 65%, #022b16 100%)',
          color: '#ffffff',
          padding: '3.75rem 0 4.25rem',
          borderBottom: '4px solid var(--usu-gold)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Static Official Corner Watermark */}
        <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', width: '280px', height: '280px', opacity: 0.08, pointerEvents: 'none' }}>
          <img src="/ornament/circular-tra.svg" alt="" style={{ width: '100%', height: '100%' }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ maxWidth: '750px' }}>
              <div className="title-fill title-fill--dark" style={{ marginBottom: '0.75rem' }}>
                <div className="title-fill__icon">
                  <img src="/ornament/flower-ora.svg" alt="" />
                </div>
                <span className="title-fill__text" style={{ color: '#fef08a' }}>Kesejahteraan & Finansial Mahasiswa</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', color: '#ffffff', fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: '0.75rem' }}>
                Data Penerima Beasiswa Fakultas Vokasi USU
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6 }}>
                Direktori resmi basis data 3.645+ penerima beasiswa Fakultas Vokasi Universitas Sumatera Utara
                (KIP Kuliah, Bank Indonesia, Beasiswa Prestasi, BBM, ADik Afirmasi, Yayasan Wook, BAZNAS, VDMI).
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={handleExportCSV} className="btn btn-outline-white">
                <Download size={16} />
                <span>Ekspor CSV ({filteredList.length})</span>
              </button>
              {session && (
                <button onClick={handleOpenAdd} className="btn btn-gold">
                  <Plus size={18} />
                  <span>Tambah Penerima</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* KPI Cards Bar */}
      <div className="container" style={{ marginTop: '-1.75rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--usu-green-soft)', color: 'var(--usu-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--usu-green-dark)' }}>{beasiswaList.length} Mahasiswa</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-light)' }}>Total Mahasiswa Penerima Terdata</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0369a1' }}>{uniqueJenis.length} Skema</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-light)' }}>Mitra & Program Beasiswa</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b45309' }}>2023 - 2026</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-light)' }}>Rentang Periode Terdata</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#065f46' }}>{uniqueProdiCount || 14} Program Studi</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-light)' }}>Sebaran Mahasiswa Vokasi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="container" style={{ marginTop: '2.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Cari nama mahasiswa, NIM, beasiswa..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="input-text"
                style={{ paddingLeft: '2.4rem' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>

            <div>
              <select
                value={selectedJenis}
                onChange={(e) => { setSelectedJenis(e.target.value); setCurrentPage(1); }}
                className="select-input"
              >
                <option value="Semua">Semua Jenis Beasiswa</option>
                {uniqueJenis.map((j) => (
                  <option key={j} value={j}>{j}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedTahun}
                onChange={(e) => { setSelectedTahun(e.target.value); setCurrentPage(1); }}
                className="select-input"
              >
                <option value="Semua">Semua Periode Tahun</option>
                {uniqueTahun.map((t) => (
                  <option key={t} value={t}>Tahun {t}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedProdi}
                onChange={(e) => { setSelectedProdi(e.target.value); setCurrentPage(1); }}
                className="select-input"
              >
                <option value="Semua">Semua Program Studi</option>
                {PRODI_LIST.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <div>
            Menemukan <strong>{filteredList.length}</strong> penerima beasiswa
            {selectedTahun !== 'Semua' && ` pada periode tahun ${selectedTahun}`}
            {selectedJenis !== 'Semua' && ` skema ${selectedJenis}`}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
            Halaman {currentPage} dari {totalPages}
          </div>
        </div>

        {/* Data Table */}
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>No</th>
                <th style={{ width: '140px' }}>NIM</th>
                <th>Nama Mahasiswa</th>
                <th>Program Studi</th>
                <th>Jenis Beasiswa</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Periode</th>
                <th style={{ width: '80px', textAlign: 'center' }}>IPK</th>
                {session && <th style={{ textAlign: 'right', width: '110px' }}>Aksi Kelola</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={session ? 8 : 7} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ color: 'var(--usu-green)', fontWeight: 600 }}>Memuat data direktori beasiswa...</div>
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={session ? 8 : 7} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Tidak ada data beasiswa yang sesuai dengan kriteria pencarian.</div>
                  </td>
                </tr>
              ) : (
                paginatedList.map((item, idx) => {
                  const absoluteIdx = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedDetail(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td style={{ color: 'var(--text-light)', fontWeight: 600 }}>{absoluteIdx}</td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--usu-green-dark)' }}>
                          {item.nim}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.namaMahasiswa}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.prodi}</div>
                      </td>
                      <td>
                        <span
                          className="badge badge-green"
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            backgroundColor:
                              item.jenisBeasiswa?.includes('BI') ? '#ecfdf5' :
                              item.jenisBeasiswa?.includes('KIP') ? '#eff6ff' :
                              item.jenisBeasiswa?.includes('Prestasi') ? '#fef3c7' : '#f8fafc',
                            color:
                              item.jenisBeasiswa?.includes('BI') ? '#059669' :
                              item.jenisBeasiswa?.includes('KIP') ? '#1d4ed8' :
                              item.jenisBeasiswa?.includes('Prestasi') ? '#b45309' : 'var(--text-main)',
                            border: '1px solid var(--border-subtle)'
                          }}
                        >
                          {item.jenisBeasiswa}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: 700, color: 'var(--usu-green-dark)', fontSize: '0.85rem' }}>
                          {item.periodeTahun || '-'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ fontWeight: 700, color: item.ipk ? '#059669' : 'var(--text-light)', fontSize: '0.85rem' }}>
                          {item.ipk || '-'}
                        </span>
                      </td>
                      {session && (
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              onClick={(e) => handleOpenEdit(item, e)}
                              title="Edit Data"
                              style={{
                                padding: '6px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-subtle)',
                                background: '#ffffff',
                                color: '#0284c7',
                                cursor: 'pointer',
                              }}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={(e) => handleOpenDelete(item.id, e)}
                              title="Hapus Data"
                              style={{
                                padding: '6px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-subtle)',
                                background: '#ffffff',
                                color: '#dc2626',
                                cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Menampilkan data ke-<strong>{(currentPage - 1) * pageSize + 1}</strong> sampai <strong>{Math.min(currentPage * pageSize, filteredList.length)}</strong> dari total <strong>{filteredList.length}</strong> mahasiswa
            </div>

            <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-outline btn-sm"
                style={{ padding: '0.4rem 0.75rem', opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                <ChevronLeft size={16} />
                <span>Sebelumnya</span>
              </button>

              <span style={{ fontSize: '0.85rem', fontWeight: 600, padding: '0 0.5rem', color: 'var(--usu-green-dark)' }}>
                Halaman {currentPage} dari {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-outline btn-sm"
                style={{ padding: '0.4rem 0.75rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                <span>Selanjutnya</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="modal-backdrop" onClick={() => setSelectedDetail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--usu-green-dark)' }}>Detail Penerima Beasiswa</h3>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-light)' }}>ID: {selectedDetail.id}</span>
              </div>
              <button onClick={() => setSelectedDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.9rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Nama Mahasiswa</div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>{selectedDetail.namaMahasiswa}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>NIM</div>
                <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '1rem', color: 'var(--usu-green-dark)' }}>{selectedDetail.nim}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Program Studi</div>
                <div style={{ fontWeight: 600 }}>{selectedDetail.prodi}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Jenis Beasiswa</div>
                <div style={{ fontWeight: 700, color: 'var(--usu-green)' }}>{selectedDetail.jenisBeasiswa}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Periode Tahun</div>
                <div style={{ fontWeight: 700 }}>{selectedDetail.periodeTahun || '-'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Indeks Prestasi Kumulatif (IPK)</div>
                <div style={{ fontWeight: 700, color: '#059669' }}>{selectedDetail.ipk || '-'}</div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelectedDetail(null)}
              >
                Tutup
              </button>
              {session && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    const toEdit = selectedDetail;
                    setSelectedDetail(null);
                    handleOpenEdit(toEdit);
                  }}
                >
                  <Edit2 size={16} />
                  <span>Edit Data Ini</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Form Modal (Create / Update) */}
      <ModalForm
        isOpen={modalOpen}
        type="beasiswa"
        initialData={editingItem}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Hapus Data Beasiswa"
        message="Apakah Anda yakin ingin menghapus data penerima beasiswa ini dari sistem basis data?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
        isLoading={isSubmitting}
      />
    </div>
  );
}

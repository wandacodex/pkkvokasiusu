'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Award,
  Search,
  Plus,
  Filter,
  Download,
  Edit2,
  Trash2,
  Globe,
  Flag,
  MapPin,
  Sparkles,
  LayoutGrid,
  List,
  User,
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

export default function PrestasiPage() {
  const { data: session } = useSession();
  const [prestasiList, setPrestasiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTingkat, setSelectedTingkat] = useState('Semua');
  const [selectedTahun, setSelectedTahun] = useState('Semua');
  const [selectedProdi, setSelectedProdi] = useState('Semua');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = viewMode === 'grid' ? 18 : 25;

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
      const res = await fetch('/api/prestasi');
      const data = await res.json();
      if (data.success) {
        setPrestasiList(data.data || []);
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Gagal memuat data prestasi', type: 'error' });
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
      const url = '/api/prestasi';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setToast({
          message: isEdit ? 'Data prestasi berhasil diperbarui' : 'Data mahasiswa berprestasi baru berhasil disimpan',
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
      const res = await fetch(`/api/prestasi?id=${deletingId}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        setToast({ message: 'Data prestasi berhasil dihapus', type: 'success' });
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

  const handleExportCSV = () => {
    if (filteredList.length === 0) return;
    const headers = ['No', 'NIM', 'Nama Mahasiswa', 'Program Studi', 'Nama Kompetisi', 'Capaian', 'Tingkat', 'Tahun', 'Penyelenggara', 'Dosen Pembimbing'];
    const rows = filteredList.map((item, idx) => [
      idx + 1,
      item.nim,
      `"${item.nama}"`,
      `"${item.prodi}"`,
      `"${item.namaKompetisi}"`,
      `"${item.capaian}"`,
      `"${item.tingkat}"`,
      item.tahun,
      `"${item.penyelenggara || '-'}"`,
      `"${item.dosenPembimbing || '-'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Data_Mahasiswa_Berprestasi_Vokasi_USU_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({ message: `Data ${filteredList.length} prestasi berhasil diekspor ke CSV!`, type: 'success' });
  };

  // Filter list
  const filteredList = prestasiList.filter((item) => {
    const matchSearch =
      !searchQuery ||
      item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nim?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaKompetisi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.capaian?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.penyelenggara?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prodi?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchTingkat = selectedTingkat === 'Semua' || item.tingkat === selectedTingkat;
    const matchTahun = selectedTahun === 'Semua' || String(item.tahun) === String(selectedTahun);
    const matchProdi = selectedProdi === 'Semua' || item.prodi === selectedProdi;

    return matchSearch && matchTingkat && matchTahun && matchProdi;
  });

  // Calculate stats from actual list
  const countInternasional = prestasiList.filter(p => p.tingkat === 'Internasional').length;
  const countNasional = prestasiList.filter(p => p.tingkat === 'Nasional').length;
  const countWilayah = prestasiList.filter(p => p.tingkat === 'Wilayah/Provinsi' || p.tingkat === 'Regional').length;
  const uniqueTahun = Array.from(new Set(prestasiList.map(p => p.tahun))).filter(Boolean).sort().reverse();

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
          background: 'linear-gradient(135deg, #003620 0%, #005A36 65%, #002213 100%)',
          color: '#ffffff',
          padding: '3.5rem 0 4rem',
          borderBottom: '4px solid var(--usu-gold)',
          position: 'relative',
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ maxWidth: '780px' }}>
              <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
                Hall of Fame & Prestasi Mahasiswa
              </span>
              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', color: '#ffffff', fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: '0.75rem' }}>
                Data Mahasiswa Berprestasi Fakultas Vokasi USU
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6 }}>
                Rekam jejak 227+ torehan prestasi autentik mahasiswa Fakultas Vokasi Universitas Sumatera Utara
                dalam ajang kompetisi kejuaraan Wilayah, Nasional, hingga Internasional (Periode 2023 - 2026).
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
                  <span>Tambah Prestasi</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Summary Bar */}
      <div className="container" style={{ marginTop: '-1.75rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--usu-gold-light)', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--usu-green-dark)' }}>{prestasiList.length} Prestasi</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Total Prestasi Terdata</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0369a1' }}>{countInternasional} Ajang</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Tingkat Internasional / ASEAN</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flag size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#065f46' }}>{countNasional} Ajang</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Tingkat Nasional</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#92400e' }}>2023 - 2026</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Arsip 4 Periode Resmi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and View Toggles */}
      <div className="container" style={{ marginTop: '2.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Cari mahasiswa, lomba, capaian..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="input-text"
                style={{ paddingLeft: '2.4rem' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>

            <div>
              <select
                value={selectedTingkat}
                onChange={(e) => { setSelectedTingkat(e.target.value); setCurrentPage(1); }}
                className="select-input"
              >
                <option value="Semua">Semua Tingkat Kejuaraan</option>
                <option value="Internasional">Internasional</option>
                <option value="Nasional">Nasional</option>
                <option value="Wilayah/Provinsi">Wilayah / Provinsi</option>
              </select>
            </div>

            <div>
              <select
                value={selectedTahun}
                onChange={(e) => { setSelectedTahun(e.target.value); setCurrentPage(1); }}
                className="select-input"
              >
                <option value="Semua">Semua Tahun</option>
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

            {/* View Mode Switcher */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
              <button
                onClick={() => setViewMode('grid')}
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
                title="Tampilan Kartu"
              >
                <LayoutGrid size={16} />
                <span>Kartu</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-outline'}`}
                title="Tampilan Tabel"
              >
                <List size={16} />
                <span>Tabel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <div>
            Menemukan <strong>{filteredList.length}</strong> capaian prestasi mahasiswa
            {selectedTahun !== 'Semua' && ` pada tahun ${selectedTahun}`}
            {selectedTingkat !== 'Semua' && ` tingkat ${selectedTingkat}`}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
            Halaman {currentPage} dari {totalPages}
          </div>
        </div>

        {/* Content Views */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--usu-green)', fontWeight: 600 }}>
            Memuat data mahasiswa berprestasi dari Upstash Redis...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Tidak ada data prestasi yang cocok dengan kriteria pencarian Anda.
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View Cards */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {paginatedList.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${
                    item.tingkat === 'Internasional' ? '#0284c7' :
                    item.tingkat === 'Nasional' ? 'var(--usu-gold)' : 'var(--usu-green)'
                  }`
                }}
                onClick={() => setSelectedDetail(item)}
              >
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        backgroundColor:
                          item.tingkat === 'Internasional' ? '#e0f2fe' :
                          item.tingkat === 'Nasional' ? '#fef3c7' : '#ecfdf5',
                        color:
                          item.tingkat === 'Internasional' ? '#0369a1' :
                          item.tingkat === 'Nasional' ? '#b45309' : '#059669',
                      }}
                    >
                      {item.tingkat} • Tahun {item.tahun}
                    </span>

                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontFamily: 'monospace' }}>
                      {item.nim}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--usu-green-dark)', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                    {item.namaKompetisi}
                  </h3>

                  <div style={{ display: 'inline-block', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.35rem 0.75rem', borderRadius: '8px', color: 'var(--usu-green)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '1rem' }}>
                    🏆 {item.capaian}
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                    <User size={15} style={{ color: 'var(--usu-green)' }} />
                    <span>{item.nama}</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <BookOpen size={14} />
                    <span>{item.prodi}</span>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    {item.penyelenggara || 'Kemahasiswaan Vokasi USU'}
                  </span>

                  {session && (
                    <div style={{ display: 'inline-flex', gap: '0.3rem' }}>
                      <button
                        onClick={(e) => handleOpenEdit(item, e)}
                        style={{ padding: '4px', background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer' }}
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => handleOpenDelete(item.id, e)}
                        style={{ padding: '4px', background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="table-wrapper">
            <table className="custom-table" style={{ fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  <th style={{ width: '55px' }}>No</th>
                  <th style={{ width: '130px' }}>NIM</th>
                  <th>Nama Mahasiswa</th>
                  <th>Program Studi</th>
                  <th>Kompetisi / Kejuaraan</th>
                  <th>Capaian Prestasi</th>
                  <th style={{ width: '110px', textAlign: 'center' }}>Tingkat</th>
                  <th style={{ width: '75px', textAlign: 'center' }}>Tahun</th>
                  {session && <th style={{ textAlign: 'right', width: '90px' }}>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {paginatedList.map((item, idx) => {
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
                        <strong style={{ color: 'var(--text-main)' }}>{item.nama}</strong>
                      </td>
                      <td>{item.prodi}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--usu-green-dark)' }}>{item.namaKompetisi}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{item.penyelenggara}</div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: '#b45309' }}>{item.capaian}</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span
                          className="badge"
                          style={{
                            fontSize: '0.75rem',
                            backgroundColor:
                              item.tingkat === 'Internasional' ? '#e0f2fe' :
                              item.tingkat === 'Nasional' ? '#fef3c7' : '#ecfdf5',
                            color:
                              item.tingkat === 'Internasional' ? '#0369a1' :
                              item.tingkat === 'Nasional' ? '#b45309' : '#059669',
                          }}
                        >
                          {item.tingkat}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700 }}>
                        {item.tahun}
                      </td>
                      {session && (
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                            <button
                              onClick={(e) => handleOpenEdit(item, e)}
                              style={{ padding: '5px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: '#ffffff', color: '#0284c7', cursor: 'pointer' }}
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={(e) => handleOpenDelete(item.id, e)}
                              style={{ padding: '5px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: '#ffffff', color: '#dc2626', cursor: 'pointer' }}
                              title="Hapus"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Menampilkan prestasi ke-<strong>{(currentPage - 1) * pageSize + 1}</strong> sampai <strong>{Math.min(currentPage * pageSize, filteredList.length)}</strong> dari total <strong>{filteredList.length}</strong> capaian
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--usu-green-dark)' }}>Detail Mahasiswa Berprestasi</h3>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-light)' }}>ID: {selectedDetail.id}</span>
              </div>
              <button onClick={() => setSelectedDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.9rem' }}>
              <div style={{ gridColumn: 'span 2', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Nama Kompetisi / Kejuaraan</div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--usu-green-dark)', lineHeight: 1.35 }}>{selectedDetail.namaKompetisi}</div>
                <div style={{ display: 'inline-block', marginTop: '0.5rem', backgroundColor: '#fef3c7', color: '#b45309', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '6px' }}>
                  🏆 {selectedDetail.capaian}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Nama Mahasiswa</div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>{selectedDetail.nama}</div>
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
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Tingkat & Tahun</div>
                <div style={{ fontWeight: 700, color: 'var(--usu-green)' }}>{selectedDetail.tingkat} • {selectedDetail.tahun}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Penyelenggara</div>
                <div style={{ fontWeight: 600 }}>{selectedDetail.penyelenggara || '-'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.2rem' }}>Dosen Pembimbing</div>
                <div style={{ fontWeight: 600 }}>{selectedDetail.dosenPembimbing || '-'}</div>
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
        type="prestasi"
        initialData={editingItem}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Hapus Data Prestasi"
        message="Apakah Anda yakin ingin menghapus data prestasi mahasiswa ini dari database Upstash Redis?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
        isLoading={isSubmitting}
      />
    </div>
  );
}

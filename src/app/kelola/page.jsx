'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import {
  Database,
  GraduationCap,
  Award,
  Briefcase,
  Plus,
  Search,
  Edit2,
  Trash2,
  RotateCcw,
  Download,
  Lock,
  LogIn,
  LogOut,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  FileSpreadsheet,
  FileText,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { PRODI_LIST } from '@/src/lib/mockData';
import ModalForm from '@/src/components/ModalForm';
import ConfirmModal from '@/src/components/ConfirmModal';
import Toast from '@/src/components/Toast';
import ExcelImportModal from '@/src/components/ExcelImportModal';
import SuratGeneratorModal from '@/src/components/SuratGeneratorModal';
import { downloadSampleTemplate, exportDataToExcel } from '@/src/lib/excelHelper';

export default function KelolaDataPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('beasiswa'); // 'beasiswa' | 'prestasi' | 'tracer'
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 25;
  const [excelImportOpen, setExcelImportOpen] = useState(false);
  const [suratGeneratorOpen, setSuratGeneratorOpen] = useState(false);

  // Search & Filter States
  // 1. Beasiswa
  const [beasiswaJenisFilter, setBeasiswaJenisFilter] = useState('Semua');
  const [beasiswaTahunFilter, setBeasiswaTahunFilter] = useState('Semua');
  const [beasiswaProdiFilter, setBeasiswaProdiFilter] = useState('Semua');

  // 2. Mahasiswa Berprestasi
  const [prestasiProdiFilter, setPrestasiProdiFilter] = useState('Semua');
  const [prestasiTingkatFilter, setPrestasiTingkatFilter] = useState('Semua');
  const [prestasiTahunFilter, setPrestasiTahunFilter] = useState('Semua');

  // 3. Tracer Study
  const [tracerProdiFilter, setTracerProdiFilter] = useState('Semua');
  const [tracerStatusFilter, setTracerStatusFilter] = useState('Semua');

  // Collections
  const [beasiswaList, setBeasiswaList] = useState([]);
  const [prestasiList, setPrestasiList] = useState([]);
  const [tracerList, setTracerList] = useState([]);
  const [loading, setLoading] = useState(true);

  // CRUD Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('beasiswa');
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingTarget, setDeletingTarget] = useState({ id: null, type: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [resBea, resPres, resTrc] = await Promise.all([
        fetch('/api/beasiswa').then(r => r.json()),
        fetch('/api/prestasi').then(r => r.json()),
        fetch('/api/tracer').then(r => r.json()),
      ]);

      if (resBea.success) setBeasiswaList(resBea.data || []);
      if (resPres.success) setPrestasiList(resPres.data || []);
      if (resTrc.success) setTracerList(resTrc.data || []);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Gagal memuat data dari Upstash Redis', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAllData();
    }
  }, [status]);

  const handleOpenAdd = (type) => {
    setModalType(type);
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleOpenDelete = (type, id) => {
    setDeletingTarget({ type, id });
    setDeleteConfirmOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const isEdit = Boolean(editingItem?.id);
      const endpoint = `/api/${modalType}`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setToast({
          message: isEdit ? `Data ${modalType} berhasil diperbarui` : `Data ${modalType} baru berhasil ditambahkan`,
          type: 'success',
        });
        setModalOpen(false);
        fetchAllData();
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
    if (!deletingTarget.id || !deletingTarget.type) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/${deletingTarget.type}?id=${deletingTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        setToast({ message: 'Data berhasil dihapus dari database', type: 'success' });
        setDeleteConfirmOpen(false);
        fetchAllData();
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

  const handleResetDatabase = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/seed?force=true');
      const data = await res.json();
      if (data.success) {
        setToast({
          message: 'Database Upstash Redis berhasil di-reset & diisi ulang dengan data autentik Vokasi USU!',
          type: 'success',
        });
        setResetConfirmOpen(false);
        fetchAllData();
      } else {
        setToast({ message: data.error || 'Gagal mereset database', type: 'error' });
      }
    } catch (err) {
      console.error(err);
      setToast({ message: 'Gagal terhubung ke Upstash Redis', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Loading State
  if (status === 'loading') {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--usu-green)' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Memeriksa Sesi Login...</div>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Menghubungkan ke NextAuth Provider</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State: Access Protected
  if (status === 'unauthenticated' || !session) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.25rem' }}>
        <div
          style={{
            maxWidth: '500px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '2.5rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#fef3c7',
              color: '#b45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <Lock size={32} />
          </div>

          <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
            Akses Dibatasi
          </span>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--usu-green-dark)', marginBottom: '0.5rem' }}>
            Otentikasi Pengelola Diperlukan
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Halaman Panel Kelola Data (CRUD) hanya dapat diakses oleh operator dan pimpinan resmi Fakultas Vokasi USU.
            Silakan masuk terlebih dahulu melalui halaman login admin.
          </p>

          <Link href="/admin/login" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
            <LogIn size={18} />
            <span>Menuju Halaman Login Admin (/admin/login)</span>
          </Link>
        </div>
      </div>
    );
  }

  // Dynamic filter options
  const uniqueBeasiswaJenis = Array.from(new Set(beasiswaList.map(b => b.jenisBeasiswa))).filter(Boolean);
  const uniqueBeasiswaTahun = Array.from(new Set(beasiswaList.map(b => b.periodeTahun))).filter(Boolean).sort().reverse();
  const uniquePrestasiTahun = Array.from(new Set(prestasiList.map(p => p.tahun))).filter(Boolean).sort().reverse();

  // Reset Filters Function
  const handleResetFilters = () => {
    setSearchQuery('');
    setBeasiswaJenisFilter('Semua');
    setBeasiswaTahunFilter('Semua');
    setBeasiswaProdiFilter('Semua');
    setPrestasiProdiFilter('Semua');
    setPrestasiTingkatFilter('Semua');
    setPrestasiTahunFilter('Semua');
    setTracerProdiFilter('Semua');
    setTracerStatusFilter('Semua');
    setPage(1);
  };

  const isFilterActive =
    Boolean(searchQuery) ||
    (activeTab === 'beasiswa' && (beasiswaJenisFilter !== 'Semua' || beasiswaTahunFilter !== 'Semua' || beasiswaProdiFilter !== 'Semua')) ||
    (activeTab === 'prestasi' && (prestasiProdiFilter !== 'Semua' || prestasiTingkatFilter !== 'Semua' || prestasiTahunFilter !== 'Semua')) ||
    (activeTab === 'tracer' && (tracerProdiFilter !== 'Semua' || tracerStatusFilter !== 'Semua'));

  // Filtered lists for each tab
  const filteredBeasiswa = beasiswaList.filter(i => {
    const matchSearch =
      !searchQuery ||
      i.namaMahasiswa?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.nim?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.jenisBeasiswa?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.prodi?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchJenis = beasiswaJenisFilter === 'Semua' || i.jenisBeasiswa === beasiswaJenisFilter;
    const matchTahun = beasiswaTahunFilter === 'Semua' || String(i.periodeTahun) === String(beasiswaTahunFilter);
    const matchProdi = beasiswaProdiFilter === 'Semua' || i.prodi === beasiswaProdiFilter;

    return matchSearch && matchJenis && matchTahun && matchProdi;
  });

  const filteredPrestasi = prestasiList.filter(i => {
    const matchSearch =
      !searchQuery ||
      i.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.nim?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.namaKompetisi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.capaian?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.penyelenggara?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.prodi?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchProdi = prestasiProdiFilter === 'Semua' || i.prodi === prestasiProdiFilter;
    const matchTingkat = prestasiTingkatFilter === 'Semua' || i.tingkat === prestasiTingkatFilter;
    const matchTahun = prestasiTahunFilter === 'Semua' || String(i.tahun) === String(prestasiTahunFilter);

    return matchSearch && matchProdi && matchTingkat && matchTahun;
  });

  const filteredTracer = tracerList.filter(i => {
    const matchSearch =
      !searchQuery ||
      i.namaAlumni?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.nim?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.statusPekerjaan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.namaInstansi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.prodi?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchProdi = tracerProdiFilter === 'Semua' || i.prodi === tracerProdiFilter;
    const matchStatus = tracerStatusFilter === 'Semua' || i.statusPekerjaan === tracerStatusFilter;

    return matchSearch && matchProdi && matchStatus;
  });

  const activeList = activeTab === 'beasiswa' ? filteredBeasiswa : activeTab === 'prestasi' ? filteredPrestasi : filteredTracer;
  const totalPages = Math.ceil(activeList.length / pageSize) || 1;
  const paginatedRows = activeList.slice((page - 1) * pageSize, page * pageSize);

  // 3. Authenticated State: Full Master Panel
  return (
    <div style={{ paddingBottom: '5rem' }}>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Header Banner */}
      <section style={{ backgroundColor: 'var(--usu-green-dark)', color: '#ffffff', padding: '3rem 0', borderBottom: '4px solid var(--usu-gold)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-gold">Operator Console</span>
                <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                  Upstash Redis Live
                </span>
                <span style={{ fontSize: '0.75rem', backgroundColor: 'rgba(74, 222, 128, 0.2)', color: '#86efac', padding: '0.2rem 0.6rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <UserCheck size={12} />
                  <span>{session?.user?.name || 'Administrator'}</span>
                </span>
                <Link
                  href="/security"
                  style={{
                    fontSize: '0.75rem',
                    backgroundColor: 'rgba(16, 185, 129, 0.25)',
                    color: '#6ee7b7',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    textDecoration: 'none',
                    fontWeight: 700,
                  }}
                  title="Lihat Audit & Security Check Sistem"
                >
                  <ShieldCheck size={12} />
                  <span>Security Check (A+)</span>
                </Link>
              </div>

              <h1 style={{ fontSize: '2.4rem', color: '#ffffff', marginBottom: '0.5rem' }}>
                Pusat Kelola Data Terpadu (CRUD)
              </h1>
              <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                Manajemen data penerima beasiswa, rekapitulasi mahasiswa berprestasi, dan bank data tracer study alumni.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => setSuratGeneratorOpen(true)}
                className="btn btn-gold btn-sm"
                title="Buka Generator Surat Mahasiswa Resmi"
              >
                <FileText size={15} />
                <span>Generator Surat (.docx)</span>
              </button>

              <button
                onClick={() => setResetConfirmOpen(true)}
                className="btn btn-outline-white btn-sm"
                title="Reset dan isi ulang data bawaan"
              >
                <RotateCcw size={15} />
                <span>Reset & Seed Data</span>
              </button>

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn btn-sm btn-danger"
                style={{ padding: '0.5rem 0.9rem' }}
              >
                <LogOut size={15} />
                <span>Keluar Sesi</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tabs Container */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'beasiswa' ? 'active' : ''}`}
            onClick={() => { setActiveTab('beasiswa'); setSearchQuery(''); setPage(1); }}
          >
            <GraduationCap size={18} />
            <span>Penerima Beasiswa ({beasiswaList.length})</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'prestasi' ? 'active' : ''}`}
            onClick={() => { setActiveTab('prestasi'); setSearchQuery(''); setPage(1); }}
          >
            <Award size={18} />
            <span>Mahasiswa Berprestasi ({prestasiList.length})</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'tracer' ? 'active' : ''}`}
            onClick={() => { setActiveTab('tracer'); setSearchQuery(''); setPage(1); }}
          >
            <Briefcase size={18} />
            <span>Bank Data Tracer Study ({tracerList.length})</span>
          </button>
        </div>

        {/* Actions & Filters Console */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Top Bar: Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="badge badge-green" style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                <Filter size={14} style={{ marginRight: '4px' }} />
                Filter & Manajemen Data {activeTab === 'beasiswa' ? 'Penerimaan Beasiswa' : activeTab === 'prestasi' ? 'Mahasiswa Berprestasi' : 'Bank Data Tracer Study'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => downloadSampleTemplate(activeTab)}
                className="btn btn-outline btn-sm"
                title="Unduh Format Excel Standar agar siap diisi"
              >
                <Download size={14} />
                <span>Unduh Format Excel</span>
              </button>

              <button
                type="button"
                onClick={() => setExcelImportOpen(true)}
                className="btn btn-sm"
                style={{
                  backgroundColor: '#ecfdf5',
                  color: 'var(--usu-green-dark)',
                  border: '1px solid #a7f3d0',
                  fontWeight: 600
                }}
                title="Unggah berkas Excel untuk import data massal"
              >
                <FileSpreadsheet size={15} />
                <span>Import Excel</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const list = activeTab === 'beasiswa' ? beasiswaList : activeTab === 'prestasi' ? prestasiList : tracerList;
                  exportDataToExcel(list, activeTab);
                }}
                className="btn btn-outline btn-sm"
                title="Ekspor data tabel saat ini ke file Excel .xlsx"
              >
                <Download size={14} />
                <span>Export Excel</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenAdd(activeTab)}
                className="btn btn-primary btn-sm"
              >
                <Plus size={15} />
                <span>Tambah {activeTab === 'beasiswa' ? 'Beasiswa' : activeTab === 'prestasi' ? 'Prestasi' : 'Alumni'}</span>
              </button>
            </div>
          </div>

          {/* Module-Specific Search & Filter Toolbar */}
          {activeTab === 'beasiswa' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Cari nama, NIM, beasiswa..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  className="input-text"
                  style={{ paddingLeft: '2.4rem', height: '42px' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              </div>

              <div>
                <select
                  value={beasiswaJenisFilter}
                  onChange={(e) => { setBeasiswaJenisFilter(e.target.value); setPage(1); }}
                  className="select-input"
                  style={{ height: '42px', width: '100%' }}
                >
                  <option value="Semua">Semua Jenis Beasiswa</option>
                  {uniqueBeasiswaJenis.map((jenis) => (
                    <option key={jenis} value={jenis}>{jenis}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={beasiswaTahunFilter}
                  onChange={(e) => { setBeasiswaTahunFilter(e.target.value); setPage(1); }}
                  className="select-input"
                  style={{ height: '42px', width: '100%' }}
                >
                  <option value="Semua">Semua Periode Tahun</option>
                  {uniqueBeasiswaTahun.map((thn) => (
                    <option key={thn} value={thn}>Tahun {thn}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={beasiswaProdiFilter}
                  onChange={(e) => { setBeasiswaProdiFilter(e.target.value); setPage(1); }}
                  className="select-input"
                  style={{ height: '42px', width: '100%' }}
                >
                  <option value="Semua">Semua Program Studi</option>
                  {PRODI_LIST.map((prodi) => (
                    <option key={prodi} value={prodi}>{prodi}</option>
                  ))}
                </select>
              </div>

              {isFilterActive && (
                <div>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="btn btn-outline btn-sm"
                    style={{ height: '42px', width: '100%', borderColor: '#fca5a5', color: '#b91c1c', backgroundColor: '#fef2f2' }}
                  >
                    <RotateCcw size={14} />
                    <span>Reset Filter</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'prestasi' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Cari nama, NIM, lomba, capaian..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  className="input-text"
                  style={{ paddingLeft: '2.4rem', height: '42px' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              </div>

              <div>
                <select
                  value={prestasiProdiFilter}
                  onChange={(e) => { setPrestasiProdiFilter(e.target.value); setPage(1); }}
                  className="select-input"
                  style={{ height: '42px', width: '100%', fontWeight: prestasiProdiFilter !== 'Semua' ? 700 : 400, borderColor: prestasiProdiFilter !== 'Semua' ? 'var(--usu-green)' : 'var(--border-subtle)' }}
                >
                  <option value="Semua">Semua Program Studi</option>
                  {PRODI_LIST.map((prodi) => (
                    <option key={prodi} value={prodi}>{prodi}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={prestasiTingkatFilter}
                  onChange={(e) => { setPrestasiTingkatFilter(e.target.value); setPage(1); }}
                  className="select-input"
                  style={{ height: '42px', width: '100%' }}
                >
                  <option value="Semua">Semua Tingkat</option>
                  <option value="Internasional">Internasional</option>
                  <option value="Nasional">Nasional</option>
                  <option value="Wilayah">Wilayah</option>
                  <option value="Provinsi">Provinsi</option>
                  <option value="Universitas">Universitas</option>
                </select>
              </div>

              <div>
                <select
                  value={prestasiTahunFilter}
                  onChange={(e) => { setPrestasiTahunFilter(e.target.value); setPage(1); }}
                  className="select-input"
                  style={{ height: '42px', width: '100%' }}
                >
                  <option value="Semua">Semua Tahun</option>
                  {uniquePrestasiTahun.map((thn) => (
                    <option key={thn} value={thn}>Tahun {thn}</option>
                  ))}
                </select>
              </div>

              {isFilterActive && (
                <div>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="btn btn-outline btn-sm"
                    style={{ height: '42px', width: '100%', borderColor: '#fca5a5', color: '#b91c1c', backgroundColor: '#fef2f2' }}
                  >
                    <RotateCcw size={14} />
                    <span>Reset Filter</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tracer' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Cari nama alumni, NIM, instansi..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                  className="input-text"
                  style={{ paddingLeft: '2.4rem', height: '42px' }}
                />
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              </div>

              <div>
                <select
                  value={tracerProdiFilter}
                  onChange={(e) => { setTracerProdiFilter(e.target.value); setPage(1); }}
                  className="select-input"
                  style={{ height: '42px', width: '100%' }}
                >
                  <option value="Semua">Semua Program Studi</option>
                  {PRODI_LIST.map((prodi) => (
                    <option key={prodi} value={prodi}>{prodi}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={tracerStatusFilter}
                  onChange={(e) => { setTracerStatusFilter(e.target.value); setPage(1); }}
                  className="select-input"
                  style={{ height: '42px', width: '100%' }}
                >
                  <option value="Semua">Semua Status Karir</option>
                  <option value="Bekerja">Bekerja</option>
                  <option value="Wiraswasta">Wiraswasta</option>
                  <option value="Melanjutkan Pendidikan">Melanjutkan Pendidikan</option>
                  <option value="Belum Memungkinkan Bekerja">Belum Memungkinkan Bekerja</option>
                  <option value="Tidak Kerja Tetapi Sedang Mencari Pekerjaan">Mencari Kerja</option>
                </select>
              </div>

              {isFilterActive && (
                <div>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="btn btn-outline btn-sm"
                    style={{ height: '42px', width: '100%', borderColor: '#fca5a5', color: '#b91c1c', backgroundColor: '#fef2f2' }}
                  >
                    <RotateCcw size={14} />
                    <span>Reset Filter</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Filter Status Badge */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px dashed var(--border-subtle)', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            <div>
              Menampilkan <strong style={{ color: 'var(--usu-green-dark)' }}>{activeList.length}</strong> data{' '}
              {isFilterActive ? (
                <span>(hasil penyaringan filter dari total {activeTab === 'beasiswa' ? beasiswaList.length : activeTab === 'prestasi' ? prestasiList.length : tracerList.length} data)</span>
              ) : (
                <span>(total data keseluruhan)</span>
              )}
            </div>
            {isFilterActive && (
              <span style={{ color: '#b45309', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                Filter aktif
              </span>
            )}
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--usu-green)', fontWeight: 600 }}>
            Memuat dan menyinkronkan data dengan database Upstash Redis...
          </div>
        ) : (
          <div>
            {/* === TAB 1: BEASISWA CRUD === */}
            {activeTab === 'beasiswa' && (
              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>No</th>
                      <th style={{ width: '150px' }}>NIM</th>
                      <th>Nama Mahasiswa</th>
                      <th>Program Studi</th>
                      <th>Jenis Beasiswa</th>
                      <th style={{ width: '90px', textAlign: 'center' }}>Periode</th>
                      <th style={{ textAlign: 'right' }}>Aksi Kelola</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRows.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                          Tidak ada data beasiswa yang sesuai dengan filter pencarian.
                        </td>
                      </tr>
                    ) : (
                      paginatedRows.map((item, idx) => (
                        <tr key={item.id}>
                          <td style={{ color: 'var(--text-light)', fontWeight: 600 }}>{(page - 1) * pageSize + idx + 1}</td>
                          <td>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--usu-green-dark)' }}>{item.nim}</span>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700 }}>{item.namaMahasiswa}</div>
                          </td>
                          <td>{item.prodi}</td>
                          <td>
                            <span className="badge badge-green" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{item.jenisBeasiswa}</span>
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                            {item.periodeTahun || '-'}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                              <button
                                onClick={() => handleOpenEdit('beasiswa', item)}
                                style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: '#ffffff', color: '#0284c7', cursor: 'pointer' }}
                                title="Edit"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() => handleOpenDelete('beasiswa', item.id)}
                                style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: '#ffffff', color: '#dc2626', cursor: 'pointer' }}
                                title="Hapus"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* === TAB 2: PRESTASI CRUD === */}
            {activeTab === 'prestasi' && (
              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>No</th>
                      <th>Mahasiswa</th>
                      <th>Program Studi</th>
                      <th>Kompetisi / Kejuaraan</th>
                      <th>Capaian & Tingkat</th>
                      <th>Tahun</th>
                      <th>Dosen Pembimbing</th>
                      <th style={{ textAlign: 'right' }}>Aksi Kelola</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRows.length === 0 ? (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                          Tidak ada data prestasi yang sesuai dengan filter pencarian.
                        </td>
                      </tr>
                    ) : (
                      paginatedRows.map((item, idx) => (
                        <tr key={item.id}>
                          <td style={{ color: 'var(--text-light)', fontWeight: 600 }}>{(page - 1) * pageSize + idx + 1}</td>
                          <td>
                            <div style={{ fontWeight: 700 }}>{item.nama}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontFamily: 'monospace' }}>{item.nim}</div>
                          </td>
                          <td>{item.prodi}</td>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--usu-green-dark)' }}>{item.namaKompetisi}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{item.penyelenggara}</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, color: '#b45309' }}>{item.capaian}</div>
                            <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>{item.tingkat}</span>
                          </td>
                          <td style={{ fontWeight: 700 }}>{item.tahun}</td>
                          <td style={{ fontSize: '0.825rem' }}>{item.dosenPembimbing || '-'}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                              <button
                                onClick={() => handleOpenEdit('prestasi', item)}
                                style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: '#ffffff', color: '#0284c7', cursor: 'pointer' }}
                                title="Edit"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() => handleOpenDelete('prestasi', item.id)}
                                style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: '#ffffff', color: '#dc2626', cursor: 'pointer' }}
                                title="Hapus"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* === TAB 3: TRACER CRUD (ADMIN ONLY BANK DATA) === */}
            {activeTab === 'tracer' && (
              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>No</th>
                      <th>Alumni (Nama & NIM)</th>
                      <th>Program Studi & Angkatan</th>
                      <th>Status Tracer Study</th>
                      <th>Instansi / Posisi / Keterangan</th>
                      <th style={{ textAlign: 'right' }}>Aksi Kelola</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                          Tidak ada data tracer study yang sesuai dengan filter pencarian.
                        </td>
                      </tr>
                    ) : (
                      paginatedRows.map((item, idx) => (
                        <tr key={item.id}>
                          <td style={{ color: 'var(--text-light)', fontWeight: 600 }}>{(page - 1) * pageSize + idx + 1}</td>
                          <td>
                            <div style={{ fontWeight: 700 }}>{item.namaAlumni}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontFamily: 'monospace' }}>{item.nim}</div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.prodi}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Lulus Tahun {item.tahunLulus}</div>
                          </td>
                          <td>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '0.25rem 0.6rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                backgroundColor:
                                  item.statusPekerjaan === 'Bekerja' ? '#ecfdf5' :
                                  item.statusPekerjaan === 'Wiraswasta' ? '#fffbeb' :
                                  item.statusPekerjaan === 'Melanjutkan Pendidikan' ? '#f0f9ff' :
                                  item.statusPekerjaan === 'Belum Memungkinkan Bekerja' ? '#f1f5f9' : '#f5f3ff',
                                color:
                                  item.statusPekerjaan === 'Bekerja' ? '#059669' :
                                  item.statusPekerjaan === 'Wiraswasta' ? '#b45309' :
                                  item.statusPekerjaan === 'Melanjutkan Pendidikan' ? '#0284c7' :
                                  item.statusPekerjaan === 'Belum Memungkinkan Bekerja' ? '#475569' : '#7c3aed',
                                border: '1px solid currentColor',
                              }}
                            >
                              {item.statusPekerjaan}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.namaInstansi || '-'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{item.posisiJabatan || '-'}</div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                              <button
                                onClick={() => handleOpenEdit('tracer', item)}
                                style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: '#ffffff', color: '#0284c7', cursor: 'pointer' }}
                                title="Edit"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() => handleOpenDelete('tracer', item.id)}
                                style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: '#ffffff', color: '#dc2626', cursor: 'pointer' }}
                                title="Hapus"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Menampilkan baris ke-<strong>{(page - 1) * pageSize + 1}</strong> sampai <strong>{Math.min(page * pageSize, activeList.length)}</strong> dari total <strong>{activeList.length}</strong> data
                </div>

                <div style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.4rem 0.75rem', opacity: page === 1 ? 0.5 : 1 }}
                  >
                    <ChevronLeft size={16} />
                    <span>Sebelumnya</span>
                  </button>

                  <span style={{ fontSize: '0.85rem', fontWeight: 600, padding: '0 0.5rem', color: 'var(--usu-green-dark)' }}>
                    Halaman {page} dari {totalPages}
                  </span>

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.4rem 0.75rem', opacity: page === totalPages ? 0.5 : 1 }}
                  >
                    <span>Selanjutnya</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Universal Dynamic Form Modal (Create / Edit) */}
      <ModalForm
        isOpen={modalOpen}
        type={modalType}
        initialData={editingItem}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Hapus Data"
        message="Apakah Anda yakin ingin menghapus data ini dari database Upstash Redis? Tindakan ini tidak dapat dibatalkan."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
        isLoading={isSubmitting}
      />

      {/* Reset & Reseed Database Confirmation */}
      <ConfirmModal
        isOpen={resetConfirmOpen}
        title="Reset & Seed Data Upstash Redis"
        message="Tindakan ini akan mengembalikan data ke dataset autentik Fakultas Vokasi USU (contoh beasiswa, prestasi mapres, dan tracer study). Lanjutkan?"
        confirmText="Reset Database Sekarang"
        onConfirm={handleResetDatabase}
        onCancel={() => setResetConfirmOpen(false)}
        isLoading={isSubmitting}
      />

      {/* Excel Bulk Import Modal */}
      <ExcelImportModal
        isOpen={excelImportOpen}
        type={activeTab}
        onClose={() => setExcelImportOpen(false)}
        onSuccess={(msg) => {
          setToast({ message: msg, type: 'success' });
          fetchAllData();
        }}
      />

      {/* Surat Generator Modal (10 Word Templates) */}
      <SuratGeneratorModal
        isOpen={suratGeneratorOpen}
        onClose={() => setSuratGeneratorOpen(false)}
      />
    </div>
  );
}

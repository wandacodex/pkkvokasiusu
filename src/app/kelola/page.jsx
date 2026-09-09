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
  AlertTriangle
} from 'lucide-react';
import ModalForm from '@/src/components/ModalForm';
import ConfirmModal from '@/src/components/ConfirmModal';
import Toast from '@/src/components/Toast';

export default function KelolaDataPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('beasiswa'); // 'beasiswa' | 'prestasi' | 'tracer'
  const [searchQuery, setSearchQuery] = useState('');

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
            onClick={() => { setActiveTab('beasiswa'); setSearchQuery(''); }}
          >
            <GraduationCap size={18} />
            <span>Penerima Beasiswa ({beasiswaList.length})</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'prestasi' ? 'active' : ''}`}
            onClick={() => { setActiveTab('prestasi'); setSearchQuery(''); }}
          >
            <Award size={18} />
            <span>Mahasiswa Berprestasi ({prestasiList.length})</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'tracer' ? 'active' : ''}`}
            onClick={() => { setActiveTab('tracer'); setSearchQuery(''); }}
          >
            <Briefcase size={18} />
            <span>Bank Data Tracer Study ({tracerList.length})</span>
          </button>
        </div>

        {/* Action & Search Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px', maxWidth: '450px' }}>
              <input
                type="text"
                placeholder={`Cari data dalam modul ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-text"
                style={{ paddingLeft: '2.4rem' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => handleOpenAdd(activeTab)}
                className="btn btn-primary"
              >
                <Plus size={16} />
                <span>Tambah {activeTab === 'beasiswa' ? 'Beasiswa' : activeTab === 'prestasi' ? 'Prestasi' : 'Alumni'}</span>
              </button>
            </div>
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
                      <th style={{ textAlign: 'right' }}>Aksi Kelola</th>
                    </tr>
                  </thead>
                  <tbody>
                    {beasiswaList
                      .filter(i =>
                        !searchQuery ||
                        i.namaMahasiswa?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        i.nim?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        i.jenisBeasiswa?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((item, idx) => (
                        <tr key={item.id}>
                          <td style={{ color: 'var(--text-light)', fontWeight: 600 }}>{idx + 1}</td>
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
                      ))}
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
                      <th>Mahasiswa</th>
                      <th>Program Studi</th>
                      <th>Kompetisi / Kejuaraan</th>
                      <th>Capaian & Tingkat</th>
                      <th>Kategori</th>
                      <th>Tahun</th>
                      <th>Dosen Pembimbing</th>
                      <th style={{ textAlign: 'right' }}>Aksi Kelola</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prestasiList
                      .filter(i =>
                        !searchQuery ||
                        i.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        i.nim?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        i.namaKompetisi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        i.capaian?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((item) => (
                        <tr key={item.id}>
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
                          <td style={{ fontSize: '0.825rem' }}>{item.kategori}</td>
                          <td>{item.tahun}</td>
                          <td style={{ fontSize: '0.825rem' }}>{item.dosenPembimbing}</td>
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
                      ))}
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
                    {tracerList
                      .filter(i =>
                        !searchQuery ||
                        i.namaAlumni?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        i.nim?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        i.statusPekerjaan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        i.namaInstansi?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((item, idx) => (
                        <tr key={item.id}>
                          <td style={{ color: 'var(--text-light)', fontWeight: 600 }}>{idx + 1}</td>
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
                      ))}
                  </tbody>
                </table>
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
    </div>
  );
}

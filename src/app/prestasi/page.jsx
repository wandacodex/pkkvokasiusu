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
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [selectedProdi, setSelectedProdi] = useState('Semua');
  const [stats, setStats] = useState({ totalPrestasi: 0, countInternasional: 0, countNasional: 0, countWilayah: 0 });

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
        setStats(data.stats || { totalPrestasi: 0, countInternasional: 0, countNasional: 0, countWilayah: 0 });
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
    if (prestasiList.length === 0) return;
    const headers = ['NIM', 'Nama Mahasiswa', 'Program Studi', 'Nama Kompetisi', 'Capaian', 'Tingkat', 'Kategori', 'Tahun', 'Penyelenggara', 'Dosen Pembimbing'];
    const rows = filteredList.map(item => [
      item.nim,
      `"${item.nama}"`,
      `"${item.prodi}"`,
      `"${item.namaKompetisi}"`,
      `"${item.capaian}"`,
      `"${item.tingkat}"`,
      `"${item.kategori}"`,
      item.tahun,
      `"${item.penyelenggara}"`,
      `"${item.dosenPembimbing}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Data_Mahasiswa_Berprestasi_Vokasi_USU_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({ message: 'Data prestasi berhasil diekspor ke CSV!', type: 'success' });
  };

  const filteredList = prestasiList.filter((item) => {
    const matchSearch =
      !searchQuery ||
      item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nim?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaKompetisi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.capaian?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prodi?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchTingkat = selectedTingkat === 'Semua' || item.tingkat === selectedTingkat;
    const matchKategori = selectedKategori === 'Semua' || item.kategori === selectedKategori;
    const matchProdi = selectedProdi === 'Semua' || item.prodi === selectedProdi;

    return matchSearch && matchTingkat && matchKategori && matchProdi;
  });

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Header Banner */}
      <section style={{ backgroundColor: 'var(--usu-green-dark)', color: '#ffffff', padding: '3.5rem 0', borderBottom: '4px solid var(--usu-gold)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ maxWidth: '750px' }}>
              <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
                Hall of Fame & Prestasi Mahasiswa
              </span>
              <h1 style={{ fontSize: '2.5rem', color: '#ffffff', marginBottom: '0.75rem' }}>
                Data Mahasiswa Berprestasi Fakultas Vokasi USU
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.6 }}>
                Apresiasi dan rekam jejak torehan prestasi akademik, inovasi terapan, kompetisi kejuruan,
                serta kejuaraan non-akademik mahasiswa di panggung Wilayah, Nasional, dan Internasional.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={handleExportCSV} className="btn btn-outline-white">
                <Download size={16} />
                <span>Ekspor CSV</span>
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
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--usu-green-dark)' }}>{prestasiList.length} Prestasi</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Total Penghargaan Terdata</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0369a1' }}>{stats.countInternasional || 1} Ajang</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Tingkat Internasional / ASEAN</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flag size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#065f46' }}>{stats.countNasional || 4} Ajang</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Tingkat Nasional (Kemendikbud)</div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#92400e' }}>100%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Tervalidasi Kemahasiswaan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and View Toggles */}
      <div className="container" style={{ marginTop: '2.5rem' }}>
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Cari nama, NIM, atau lomba..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-text"
                style={{ paddingLeft: '2.4rem' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>

            <div>
              <select
                value={selectedTingkat}
                onChange={(e) => setSelectedTingkat(e.target.value)}
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
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
                className="select-input"
              >
                <option value="Semua">Semua Bidang / Kategori</option>
                <option value="Sains & Teknologi Terapan">Sains & Teknologi Terapan</option>
                <option value="Bisnis & Keuangan">Bisnis & Keuangan</option>
                <option value="Teknologi Informasi">Teknologi Informasi</option>
                <option value="Seni, Budaya & Pariwisata">Seni, Budaya & Pariwisata</option>
                <option value="Olahraga">Olahraga</option>
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

        {/* Content Views */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--usu-green)', fontWeight: 600 }}>
            Memuat data mahasiswa berprestasi dari Upstash Redis...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Tidak ada data prestasi yang cocok dengan pencarian Anda.
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View Cards */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {filteredList.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                className="card"
                onClick={() => setSelectedDetail(item)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  padding: 0,
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'relative', height: '200px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={item.fotoUrl}
                    alt={item.nama}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)' }} />

                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '0.4rem' }}>
                    <span className="badge badge-green" style={{ backgroundColor: 'rgba(0, 90, 54, 0.95)', color: '#ffffff', border: 'none' }}>
                      {item.tingkat}
                    </span>
                    <span className="badge badge-gold" style={{ backgroundColor: 'rgba(245, 158, 11, 0.95)', color: '#1a1a1a', border: 'none' }}>
                      {item.tahun}
                    </span>
                  </div>

                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px' }}>
                    <div style={{ fontSize: '0.785rem', color: '#fde047', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {item.kategori}
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                      {item.capaian}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      {item.nama}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
                      {item.nim} • {item.prodi}
                    </div>

                    <div style={{ fontSize: '0.885rem', fontWeight: 600, color: 'var(--usu-green)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                      {item.namaKompetisi}
                    </div>

                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {item.deskripsi?.length > 120 ? `${item.deskripsi.substring(0, 120)}...` : item.deskripsi}
                    </p>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.785rem', color: 'var(--text-light)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginBottom: '0.75rem' }}>
                      Pembimbing: <strong>{item.dosenPembimbing}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                        {item.penyelenggara}
                      </span>
                      {session && (
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            onClick={(e) => handleOpenEdit(item, e)}
                            title="Edit"
                            style={{ padding: '5px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: '#ffffff', color: '#0284c7', cursor: 'pointer' }}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={(e) => handleOpenDelete(item.id, e)}
                            title="Hapus"
                            style={{ padding: '5px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: '#ffffff', color: '#dc2626', cursor: 'pointer' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Mahasiswa</th>
                  <th>Program Studi</th>
                  <th>Kompetisi / Kejuaraan</th>
                  <th>Capaian & Tingkat</th>
                  <th>Tahun</th>
                  <th>Pembimbing</th>
                  {session && <th style={{ textAlign: 'right' }}>Aksi (CRUD)</th>}
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item) => (
                  <tr key={item.id} onClick={() => setSelectedDetail(item)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{item.nama}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontFamily: 'monospace' }}>{item.nim}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{item.prodi}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--usu-green-dark)' }}>{item.namaKompetisi}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{item.penyelenggara}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#b45309' }}>{item.capaian}</div>
                      <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>{item.tingkat}</span>
                    </td>
                    <td>{item.tahun}</td>
                    <td style={{ fontSize: '0.825rem' }}>{item.dosenPembimbing}</td>
                    {session && (
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                          <button
                            onClick={(e) => handleOpenEdit(item, e)}
                            style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: '#ffffff', color: '#0284c7', cursor: 'pointer' }}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={(e) => handleOpenDelete(item.id, e)}
                            style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border-subtle)', background: '#ffffff', color: '#dc2626', cursor: 'pointer' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="modal-backdrop" onClick={() => setSelectedDetail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden', borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)' }}>
              <img
                src={selectedDetail.fotoUrl}
                alt={selectedDetail.nama}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%)' }} />
              <button
                onClick={() => setSelectedDetail(null)}
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.6)', color: '#ffffff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Tutup Dialog"
              >
                <X size={18} />
              </button>
              <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px', color: '#ffffff' }}>
                <span className="badge badge-gold" style={{ marginBottom: '0.35rem' }}>{selectedDetail.capaian}</span>
                <h2 style={{ fontSize: '1.4rem', color: '#ffffff' }}>{selectedDetail.nama}</h2>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{selectedDetail.nim} • {selectedDetail.prodi}</div>
              </div>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Nama Kejuaraan / Kompetisi</div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--usu-green-dark)' }}>
                  {selectedDetail.namaKompetisi}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Tingkat & Kategori</div>
                  <div style={{ fontWeight: 600 }}>{selectedDetail.tingkat} • {selectedDetail.kategori}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Tahun Pelaksanaan</div>
                  <div style={{ fontWeight: 600 }}>Tahun {selectedDetail.tahun}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Penyelenggara</div>
                  <div>{selectedDetail.penyelenggara}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Dosen Pembimbing</div>
                  <div style={{ fontWeight: 600 }}>{selectedDetail.dosenPembimbing}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Deskripsi Inovasi / Karya</div>
                <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', lineHeight: 1.6, color: 'var(--text-main)' }}>
                  {selectedDetail.deskripsi}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelectedDetail(null)}>
                Tutup
              </button>
              {session && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const toEdit = selectedDetail;
                    setSelectedDetail(null);
                    handleOpenEdit(toEdit);
                  }}
                >
                  <Edit2 size={16} />
                  <span>Edit Prestasi</span>
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
        message="Apakah Anda yakin ingin menghapus data torehan mahasiswa berprestasi ini dari database?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
        isLoading={isSubmitting}
      />
    </div>
  );
}

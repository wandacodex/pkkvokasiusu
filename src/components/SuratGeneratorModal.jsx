'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  Layers,
  ChevronRight,
  Info,
  Calendar,
  X
} from 'lucide-react';
import { TEMPLATES_CONFIG, generateWordDocument, PRODI_OPTIONS } from '@/src/lib/suratGenerator';

export default function SuratGeneratorModal({ isOpen, onClose, initialTemplateId = null }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId || TEMPLATES_CONFIG[0].id);
  const activeTemplate = TEMPLATES_CONFIG.find(t => t.id === selectedTemplateId) || TEMPLATES_CONFIG[0];

  // Initialize form state
  const [formData, setFormData] = useState(() => {
    const init = {};
    activeTemplate.fields.forEach(f => {
      init[f.name] = f.defaultValue || '';
    });
    return init;
  });

  // Group members state (for Magang Kelompok / PKL Kelompok)
  const [members, setMembers] = useState(activeTemplate.defaultMembers || [
    { nama: '', nim: '', prodi: 'D3 Teknik Informatika' }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState(null);

  // Sync template if initialTemplateId changes when modal opens
  useEffect(() => {
    if (initialTemplateId && isOpen) {
      handleTemplateChange(initialTemplateId);
    }
  }, [initialTemplateId, isOpen]);

  // Keyboard navigation: close modal on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTemplateChange = (templateId) => {
    const nextTpl = TEMPLATES_CONFIG.find(t => t.id === templateId);
    if (!nextTpl) return;
    setSelectedTemplateId(templateId);

    // reset form data to template defaults
    const nextForm = {};
    nextTpl.fields.forEach(f => {
      nextForm[f.name] = f.defaultValue || '';
    });
    setFormData(nextForm);
    setMembers(nextTpl.defaultMembers || [{ nama: '', nim: '', prodi: 'D3 Teknik Informatika' }]);
    setNotification(null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAutofillDemo = () => {
    if (activeTemplate.sampleDemo) {
      setFormData({ ...activeTemplate.sampleDemo });
      if (activeTemplate.isGroup) {
        setMembers([
          { nama: 'Dinda Permata', nim: '220501005', prodi: activeTemplate.sampleDemo.prodi || 'D3 Teknik Informatika' },
          { nama: 'Rian Syahputra', nim: '220501014', prodi: activeTemplate.sampleDemo.prodi || 'D3 Teknik Informatika' }
        ]);
      }
      setNotification({ type: 'info', message: 'Data contoh otomatis berhasil dimuat ke formulir!' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleAddMember = () => {
    setMembers(prev => [...prev, { nama: '', nim: '', prodi: formData.prodi || 'D3 Teknik Informatika' }]);
  };

  const handleMemberChange = (idx, field, value) => {
    setMembers(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const handleRemoveMember = (idx) => {
    setMembers(prev => prev.filter((_, i) => i !== idx));
  };

  const handleGenerateDocx = async () => {
    // Validate required fields
    if (!formData.nama || !formData.nim) {
      setNotification({ type: 'error', message: 'Nama Mahasiswa dan NIM wajib diisi!' });
      return;
    }

    setIsGenerating(true);
    setNotification(null);

    try {
      const result = await generateWordDocument(activeTemplate, formData, members);
      setNotification({
        type: 'success',
        message: `Berkas "${result.filename}" berhasil dibuat dan diunduh!`
      });
    } catch (err) {
      console.error(err);
      setNotification({ type: 'error', message: 'Gagal membuat berkas Word: ' + err.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="generator-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '1200px',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Modal Top Header */}
        <div
          style={{
            padding: '1.25rem 2rem',
            backgroundColor: 'var(--usu-green-dark)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '3px solid var(--usu-gold)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fef08a'
              }}
            >
              <FileText size={24} />
            </div>
            <div>
              <h2
                id="generator-modal-title"
                style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}
              >
                Generator Surat Permohonan Mahasiswa
              </h2>
              <p style={{ margin: 0, fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                Isi variabel surat langsung ter-generate ke berkas Microsoft Word (.docx) resmi Fakultas Vokasi USU
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleAutofillDemo}
              className="btn btn-gold btn-sm"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
              title="Isi form dengan data simulasi cepat"
            >
              <Sparkles size={14} />
              <span>Isi Contoh Cepat</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Tutup jendela generator surat"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex'
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Modal Main Body: 2 Columns (Formulir & Live Preview) */}
        <div style={{ display: 'grid', gridTemplateColumns: '460px 1fr', flex: 1, overflow: 'hidden' }}>
          
          {/* Kolom Kiri: Pilih Template & Form Input */}
          <div
            style={{
              padding: '1.5rem',
              overflowY: 'auto',
              borderRight: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            {/* Template Selector Dropdown */}
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                Pilih Jenis Surat ({TEMPLATES_CONFIG.length} Template Resmi)
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--usu-green-dark)',
                  cursor: 'pointer'
                }}
              >
                {TEMPLATES_CONFIG.map((tpl, idx) => (
                  <option key={tpl.id} value={tpl.id}>
                    {idx + 1}. {tpl.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Notification alert */}
            {notification && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  backgroundColor: notification.type === 'success' ? '#ecfdf5' : notification.type === 'info' ? '#eff6ff' : '#fef2f2',
                  color: notification.type === 'success' ? '#047857' : notification.type === 'info' ? '#1d4ed8' : '#b91c1c',
                  border: `1px solid ${notification.type === 'success' ? '#a7f3d0' : notification.type === 'info' ? '#bfdbfe' : '#fecaca'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                <span>{notification.message}</span>
              </div>
            )}

            {/* Dynamic Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--usu-green-dark)', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '0.4rem' }}>
                Data Isian Surat
              </div>

              {activeTemplate.fields.map((f) => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                    {f.label} {f.required && <span style={{ color: '#dc2626' }}>*</span>}
                  </label>

                  {f.type === 'select' ? (
                    <select
                      value={formData[f.name] || ''}
                      onChange={(e) => handleInputChange(f.name, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        fontSize: '0.85rem'
                      }}
                    >
                      {f.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={formData[f.name] || ''}
                      onChange={(e) => handleInputChange(f.name, e.target.value)}
                      placeholder={f.placeholder}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        fontSize: '0.85rem',
                        resize: 'vertical'
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData[f.name] || ''}
                      onChange={(e) => handleInputChange(f.name, e.target.value)}
                      placeholder={f.placeholder}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        fontSize: '0.85rem'
                      }}
                    />
                  )}
                </div>
              ))}

              {/* Group Members Section (Magang / PKL Kelompok) */}
              {activeTemplate.isGroup && (
                <div style={{ marginTop: '0.5rem', backgroundColor: '#ffffff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--usu-green-dark)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Users size={15} />
                      <span>Daftar Anggota Kelompok</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddMember}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                    >
                      <Plus size={13} />
                      <span>Tambah Anggota</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {members.map((m, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '24px 1fr 1fr 1fr 28px',
                          gap: '0.5rem',
                          alignItems: 'center',
                          backgroundColor: '#f8fafc',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          border: '1px solid #f1f5f9'
                        }}
                      >
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textAlign: 'center' }}>
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          placeholder="Nama Anggota"
                          value={m.nama}
                          onChange={(e) => handleMemberChange(idx, 'nama', e.target.value)}
                          style={{ padding: '0.35rem 0.5rem', fontSize: '0.78rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        />
                        <input
                          type="text"
                          placeholder="NIM"
                          value={m.nim}
                          onChange={(e) => handleMemberChange(idx, 'nim', e.target.value)}
                          style={{ padding: '0.35rem 0.5rem', fontSize: '0.78rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        />
                        <input
                          type="text"
                          placeholder="Prodi"
                          value={m.prodi}
                          onChange={(e) => handleMemberChange(idx, 'prodi', e.target.value)}
                          style={{ padding: '0.35rem 0.5rem', fontSize: '0.78rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(idx)}
                          style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer', padding: '2px' }}
                          title="Hapus"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Kolom Kanan: Pratinjau Surat Dokumen Resmi */}
          <div
            style={{
              padding: '2rem',
              overflowY: 'auto',
              backgroundColor: '#e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            {/* Kertas Dokumen Formal */}
            <div
              className="printable-doc"
              style={{
                width: '100%',
                maxWidth: '680px',
                backgroundColor: '#ffffff',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                borderRadius: '4px',
                padding: '3rem 3.25rem',
                fontFamily: '"Times New Roman", Times, serif',
                fontSize: '11.5pt',
                color: '#000000',
                lineHeight: 1.45,
                minHeight: '850px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Judul Surat */}
                <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13pt', textTransform: 'uppercase', marginBottom: '2rem', letterSpacing: '0.02em' }}>
                  {activeTemplate.title}
                </div>

                {/* Surat Tujuan */}
                <div style={{ marginBottom: '1.5rem', lineHeight: 1.35 }}>
                  <div>Yth. Ketua Program Studi</div>
                  <div style={{ fontWeight: 'bold' }}>{formData.prodiTujuan || formData.prodi || 'D4 - Manajemen Bisnis Pariwisata'}</div>
                  <div>Fakultas Vokasi</div>
                  <div>Universitas Sumatera Utara</div>
                  <div>Medan</div>
                </div>

                {/* Paragraf Pembuka */}
                <div style={{ marginBottom: '1rem' }}>
                  Dengan hormat, saya yang bertanda tangan di bawah ini :
                </div>

                {/* Identitas Mahasiswa Tabel / Rata Tab */}
                <table style={{ width: '100%', marginBottom: '1.25rem', borderCollapse: 'collapse', fontSize: '11.5pt' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '190px', padding: '2px 0' }}>Nama</td>
                      <td style={{ width: '15px' }}>:</td>
                      <td style={{ fontWeight: 'bold' }}>{formData.nama || '...................................................'}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '2px 0' }}>NIM</td>
                      <td>:</td>
                      <td style={{ fontWeight: 'bold' }}>{formData.nim || '...................................................'}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '2px 0' }}>Program Studi</td>
                      <td>:</td>
                      <td>{formData.prodi || '...................................................'}</td>
                    </tr>
                    {formData.semester && (
                      <tr>
                        <td style={{ padding: '2px 0' }}>Semester</td>
                        <td>:</td>
                        <td>{formData.semester}</td>
                      </tr>
                    )}
                    {formData.ipk && (
                      <tr>
                        <td style={{ padding: '2px 0' }}>IPK</td>
                        <td>:</td>
                        <td style={{ fontWeight: 'bold' }}>{formData.ipk}</td>
                      </tr>
                    )}
                    {formData.tahunAkademik && (
                      <tr>
                        <td style={{ padding: '2px 0' }}>Tahun Akademik</td>
                        <td>:</td>
                        <td>{formData.tahunAkademik}</td>
                      </tr>
                    )}
                    {formData.ttl && (
                      <tr>
                        <td style={{ padding: '2px 0' }}>Tempat, Tanggal Lahir</td>
                        <td>:</td>
                        <td>{formData.ttl}</td>
                      </tr>
                    )}
                    {formData.noHp && (
                      <tr>
                        <td style={{ padding: '2px 0' }}>No. Telepon/HP</td>
                        <td>:</td>
                        <td>{formData.noHp}</td>
                      </tr>
                    )}
                    {formData.alamat && (
                      <tr>
                        <td style={{ padding: '2px 0' }}>Alamat Mahasiswa</td>
                        <td>:</td>
                        <td>{formData.alamat}</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Tabel Anggota jika Kelompok */}
                {activeTemplate.isGroup && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ marginBottom: '0.4rem' }}>Dengan anggota kelompok :</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '10.5pt', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '1px solid #000' }}>
                          <th style={{ padding: '4px 8px', borderRight: '1px solid #000', width: '35px', textAlign: 'center' }}>No</th>
                          <th style={{ padding: '4px 8px', borderRight: '1px solid #000' }}>Nama Mahasiswa</th>
                          <th style={{ padding: '4px 8px', borderRight: '1px solid #000', width: '120px' }}>NIM</th>
                          <th style={{ padding: '4px 8px' }}>Program Studi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((m, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #000' }}>
                            <td style={{ padding: '4px 8px', borderRight: '1px solid #000', textAlign: 'center' }}>{idx + 1}</td>
                            <td style={{ padding: '4px 8px', borderRight: '1px solid #000', fontWeight: 'bold' }}>{m.nama || '-'}</td>
                            <td style={{ padding: '4px 8px', borderRight: '1px solid #000' }}>{m.nim || '-'}</td>
                            <td style={{ padding: '4px 8px' }}>{m.prodi || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Data Khusus Perusahaan / Instansi */}
                {formData.perusahaan && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ marginBottom: '0.4rem' }}>
                      Dengan ini mengajukan surat permohonan {activeTemplate.title.includes('PKL') ? 'Praktek Kerja Lapangan' : 'Magang'} di :
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5pt' }}>
                      <tbody>
                        <tr>
                          <td style={{ width: '190px', padding: '2px 0' }}>Perusahaan/Instansi</td>
                          <td style={{ width: '15px' }}>:</td>
                          <td style={{ fontWeight: 'bold' }}>{formData.perusahaan}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '2px 0' }}>Alamat</td>
                          <td>:</td>
                          <td>{formData.alamatPerusahaan || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '2px 0' }}>Kota Tujuan</td>
                          <td>:</td>
                          <td>{formData.kotaTujuan || 'Medan'}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '2px 0' }}>Tanggal Pelaksanaan</td>
                          <td>:</td>
                          <td>{formData.tanggalMagang || formData.tanggalPKL || '-'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Data Orang Tua jika Surat Tunjangan */}
                {formData.namaOrangTua && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ marginBottom: '0.4rem' }}>
                      Menyatakan dengan sesungguhnya bahwa saya adalah benar tanggungan dari orang tua saya:
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5pt' }}>
                      <tbody>
                        <tr>
                          <td style={{ width: '190px', padding: '2px 0' }}>Nama Orang Tua</td>
                          <td style={{ width: '15px' }}>:</td>
                          <td style={{ fontWeight: 'bold' }}>{formData.namaOrangTua}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '2px 0' }}>NIP/NRP/NIK/No. Pensiun</td>
                          <td>:</td>
                          <td>{formData.nipOrangTua || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '2px 0' }}>Instansi</td>
                          <td>:</td>
                          <td>{formData.instansiOrangTua || '-'}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '2px 0' }}>Alamat Orang Tua</td>
                          <td>:</td>
                          <td>{formData.alamatOrangTua || '-'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Paragraf Isi Pokok Berdasarkan Jenis Surat */}
                <div style={{ textAlign: 'justify', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  {activeTemplate.id === 'surat-izin-tidak-ikut-kuliah' && (
                    <span>
                      Mengajukan Surat Permohonan Izin Tidak Mengikuti Perkuliahan dikarenakan{' '}
                      <strong>{formData.alasan || '...................................................'}</strong>.
                    </span>
                  )}
                  {activeTemplate.id === 'surat-permohonan-izin-penelitian' && (
                    <span>
                      Dengan ini mengajukan Surat Izin Penelitian untuk menyelesaikan proposal penelitian dengan judul{' '}
                      <strong>&quot;{formData.judulProposal || '...................................................'}&quot;</strong> pada lokasi{' '}
                      <strong>{formData.lokasiPenelitian || '...................................................'}</strong>.
                    </span>
                  )}
                  {activeTemplate.id === 'surat-kehilangan-dokumen' && (
                    <span>
                      Mengajukan Surat Permohonan Kehilangan{' '}
                      <strong>{formData.dokumenHilang || 'KRS / KHS / KTM / Transkrip'}</strong> Mahasiswa yang dikarenakan hilang.
                    </span>
                  )}
                  {activeTemplate.id === 'surat-keterangan-aktif-kuliah' && (
                    <span>
                      Mengajukan Surat Permohonan Aktif Kuliah Mahasiswa untuk keperluan{' '}
                      <strong>{formData.keperluan || '...................................................'}</strong>.
                    </span>
                  )}
                  {activeTemplate.id === 'surat-rekomendasi-beasiswa' && (
                    <span>
                      Mengajukan Surat Permohonan Rekomendasi untuk kelengkapan berkas administrasi{' '}
                      <strong>{formData.namaBeasiswa || 'Beasiswa'}</strong>.
                    </span>
                  )}
                  {activeTemplate.id === 'surat-pernyataan-aktif-tunjangan-ortu' && (
                    <span>
                      Agar dapat kiranya surat keterangan yang menyatakan bahwa saya adalah benar mahasiswa Fakultas Vokasi, Universitas Sumatera Utara, dan aktif kuliah pada Tahun Akademik {formData.tahunAkademik || '2025/2026'}. Hal ini diperlukan untuk memperoleh Tunjangan Keluarga dari instansi tempat orang tua saya bekerja.
                    </span>
                  )}
                </div>

                {/* Penutup */}
                <div style={{ marginBottom: '2.5rem' }}>
                  Demikian surat permohonan ini disampaikan, atas perhatian Bapak/Ibu diucapkan terima kasih.
                </div>
              </div>

              {/* Bagian Tanda Tangan */}
              <div style={{ alignSelf: 'flex-end', width: '240px', textAlign: 'left', lineHeight: 1.4 }}>
                <div>Medan, {formData.tanggalSurat || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div style={{ marginBottom: '4.5rem' }}>Hormat Saya,</div>
                <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{formData.nama || 'Nama Mahasiswa'}</div>
                <div>NIM. {formData.nim || '...........................'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div
          style={{
            padding: '1.25rem 2rem',
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={15} style={{ color: 'var(--usu-green)' }} />
            <span>Format berkas Word (.docx) langsung mempertahankan kop surat, margin, dan gaya huruf asli Vokasi USU.</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-outline btn-sm"
              title="Cetak pratinjau surat ini ke printer atau PDF"
            >
              <Printer size={15} />
              <span>Cetak / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleGenerateDocx}
              disabled={isGenerating}
              className="btn btn-primary btn-sm"
              style={{ minWidth: '220px', padding: '0.6rem 1.25rem' }}
            >
              {isGenerating ? (
                <span>Sedang Mengisi Dokumen Word...</span>
              ) : (
                <>
                  <Download size={16} />
                  <span>Unduh Berkas Word (.docx)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

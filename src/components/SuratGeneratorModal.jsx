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
  Lock,
  X
} from 'lucide-react';
import {
  TEMPLATES_CONFIG,
  generateWordDocument,
  PRODI_OPTIONS,
  getTodayDateIndo
} from '@/src/lib/suratGenerator';

export default function SuratGeneratorModal({ isOpen, onClose, initialTemplateId = null }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId || TEMPLATES_CONFIG[0].id);
  const activeTemplate = TEMPLATES_CONFIG.find(t => t.id === selectedTemplateId) || TEMPLATES_CONFIG[0];

  // Initialize form state with locked today's date
  const [formData, setFormData] = useState(() => {
    const init = {};
    activeTemplate.fields.forEach(f => {
      init[f.name] = f.defaultValue || '';
    });
    init.tanggalSurat = getTodayDateIndo();
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

    const nextForm = {};
    nextTpl.fields.forEach(f => {
      nextForm[f.name] = f.defaultValue || '';
    });
    // Tanggal surat permanen hari ini
    nextForm.tanggalSurat = getTodayDateIndo();
    setFormData(nextForm);
    setMembers(nextTpl.defaultMembers || [{ nama: '', nim: '', prodi: 'D3 Teknik Informatika' }]);
    setNotification(null);
  };

  const handleInputChange = (field, value) => {
    // Tanggal surat permanen tidak dapat diubah
    if (field === 'tanggalSurat') return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAutofillDemo = () => {
    if (activeTemplate.sampleDemo) {
      setFormData({
        ...activeTemplate.sampleDemo,
        tanggalSurat: getTodayDateIndo()
      });
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
    if (!formData.nama || !formData.nim) {
      setNotification({ type: 'error', message: 'Nama Mahasiswa dan NIM wajib diisi!' });
      return;
    }

    setIsGenerating(true);
    setNotification(null);

    try {
      const result = await generateWordDocument(activeTemplate, {
        ...formData,
        tanggalSurat: getTodayDateIndo()
      }, members);
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

  // Fitur Cetak Langsung / PDF terisolasi (hanya mencetak dokumen A4 resmi)
  const handlePrint = () => {
    const printableElem = document.querySelector('.printable-doc');
    if (!printableElem) {
      window.print();
      return;
    }

    let printFrame = document.getElementById('print-isolation-frame');
    if (!printFrame) {
      printFrame = document.createElement('iframe');
      printFrame.id = 'print-isolation-frame';
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = '0';
      document.body.appendChild(printFrame);
    }

    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${activeTemplate.title} - ${formData.nim || 'Mahasiswa'}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 20mm 20mm 20mm 25mm;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: "Times New Roman", Times, serif;
              font-size: 11.5pt;
              line-height: 1.45;
              color: #000000;
              background-color: #ffffff;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              font-size: inherit;
            }
            td, th {
              vertical-align: top;
            }
            * {
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          ${printableElem.innerHTML}
        </body>
      </html>
    `);
    frameDoc.close();

    setTimeout(() => {
      try {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
      } catch (e) {
        console.error('Print iframe error, fallback to window.print():', e);
        window.print();
      }
    }, 400);
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
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem'
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '1240px',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}
      >
        {/* Modal Top Header */}
        <div
          style={{
            padding: '1.25rem 2rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: '#ecfdf5',
                color: 'var(--usu-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileText size={22} />
            </div>
            <div>
              <h2 id="generator-modal-title" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Generator Surat Otomatis (.docx)
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                Fakultas Vokasi Universitas Sumatera Utara • Template Dokumen Resmi
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="btn btn-outline btn-sm"
              title="Isi form dengan data simulasi cepat"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            >
              <Sparkles size={14} />
              <span>Isi Contoh Cepat</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup jendela pembuatan surat"
              style={{
                border: 'none',
                background: '#f1f5f9',
                borderRadius: '8px',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Notifikasi Status */}
        {notification && (
          <div
            style={{
              padding: '0.65rem 2rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: notification.type === 'error' ? '#fef2f2' : notification.type === 'success' ? '#f0fdf4' : '#eff6ff',
              color: notification.type === 'error' ? '#dc2626' : notification.type === 'success' ? '#16a34a' : '#2563eb',
              borderBottom: '1px solid #e2e8f0'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{notification.message}</span>
          </div>
        )}

        {/* Modal Main Body (Split Two Columns) */}
        <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', flex: 1, minHeight: 0 }}>
          {/* Kolom Kiri: Formulir Kebutuhan Persyaratan Surat */}
          <div
            style={{
              borderRight: '1px solid #e2e8f0',
              overflowY: 'auto',
              padding: '1.5rem',
              backgroundColor: '#fafbfc',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}
          >
            {/* Pemilihan Jenis Template Surat */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Pilih Format Template Surat ({TEMPLATES_CONFIG.length} Dokumen Tersedia):
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontWeight: 600,
                  color: '#0f172a'
                }}
              >
                {TEMPLATES_CONFIG.map(tpl => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.title}
                  </option>
                ))}
              </select>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem', lineHeight: 1.4 }}>
                {activeTemplate.description}
              </p>
            </div>

            <div style={{ height: '1px', backgroundColor: '#e2e8f0' }} />

            {/* Field-field Form Sesuai Kebutuhan Template Ini */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Formulir Persyaratan Surat
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  {activeTemplate.fields.length} Kolom
                </span>
              </div>

              {activeTemplate.fields.map((field) => {
                const isLockedDate = field.name === 'tanggalSurat';

                return (
                  <div key={field.name}>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 600, color: '#334155', marginBottom: '0.3rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {field.label}
                        {field.required && <span style={{ color: '#dc2626' }}>*</span>}
                      </span>
                      {isLockedDate && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem', backgroundColor: '#ecfdf5', color: '#047857', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          <Lock size={10} /> Otomatis & Permanen
                        </span>
                      )}
                    </label>

                    {isLockedDate ? (
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            padding: '0.55rem 0.75rem'
                          }}
                        >
                          <Lock size={15} style={{ color: '#64748b' }} />
                          <input
                            type="text"
                            value={getTodayDateIndo()}
                            readOnly
                            disabled
                            style={{
                              width: '100%',
                              background: 'transparent',
                              border: 'none',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              color: '#334155',
                              cursor: 'not-allowed',
                              outline: 'none'
                            }}
                          />
                        </div>
                        <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '3px', margin: '3px 0 0 0' }}>
                          Tanggal surat ditetapkan permanen hari ini ({getTodayDateIndo()}) dan tidak dapat diubah.
                        </p>
                      </div>
                    ) : field.type === 'select' ? (
                      <select
                        value={formData[field.name] || field.defaultValue || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.75rem',
                          fontSize: '0.82rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff'
                        }}
                      >
                        {field.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        placeholder={field.placeholder || ''}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.75rem',
                          fontSize: '0.82rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          resize: 'vertical',
                          fontFamily: 'inherit'
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder={field.placeholder || ''}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.75rem',
                          fontSize: '0.82rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1'
                        }}
                      />
                    )}
                  </div>
                );
              })}

              {/* Tambahan Manajemen Anggota jika Surat Kelompok */}
              {activeTemplate.isGroup && (
                <div style={{ marginTop: '0.5rem', paddingTop: '0.85rem', borderTop: '1px dashed #cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                      Daftar Anggota Kelompok ({members.length})
                    </label>
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

          {/* Kolom Kanan: Pratinjau Surat Dokumen Resmi 1:1 Dengan Word */}
          <div
            style={{
              padding: '2rem',
              overflowY: 'auto',
              backgroundColor: '#cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            {/* Kertas Dokumen Formal Format A4 */}
            <div
              className="printable-doc"
              style={{
                width: '100%',
                maxWidth: '680px',
                backgroundColor: '#ffffff',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                borderRadius: '4px',
                padding: '3rem 3.25rem',
                fontFamily: '"Times New Roman", Times, serif',
                fontSize: '11.5pt',
                color: '#000000',
                lineHeight: 1.45,
                minHeight: '880px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* 1. SKL (Permohonan Surat Keterangan Lulus) */}
                {activeTemplate.id === 'surat-keterangan-lulus' && (
                  <div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13pt', marginBottom: '2rem' }}>
                      Permohonan Surat Keterangan Lulus (SKL)
                    </div>
                    <div style={{ marginBottom: '1.5rem', lineHeight: 1.35 }}>
                      <div>Kepada Yth.</div>
                      <div style={{ fontWeight: 'bold' }}>Dekan</div>
                      <div>Fakultas Vokasi</div>
                      <div>Universitas Sumatera Utara</div>
                      <div>Medan</div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      Dengan hormat, saya yang bertanda tangan di bawah ini :
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.25rem', fontSize: '11.5pt' }}>
                      <tbody>
                        <tr><td style={{ width: '200px', padding: '2px 0' }}>Nama</td><td style={{ width: '15px' }}>:</td><td>{formData.nama || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>NIM</td><td>:</td><td>{formData.nim || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Program Studi</td><td>:</td><td>{formData.prodi || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Tempat, Tanggal Lahir</td><td>:</td><td>{formData.ttl || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Alamat</td><td>:</td><td>{formData.alamat || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Hari/Tanggal Lulus</td><td>:</td><td>{formData.tanggalLulus || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Judul Tugas Akhir</td><td>:</td><td>{formData.judulTA || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>IPK</td><td>:</td><td>{formData.ipk || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Nomor Handphone</td><td>:</td><td>{formData.noHp || '...................................................'}</td></tr>
                      </tbody>
                    </table>
                    <div style={{ textAlign: 'justify', marginBottom: '1rem', lineHeight: 1.5 }}>
                      bermaksud untuk mendapatkan Surat Keterangan Lulus (SKL) dikarenakan belum terbitnya Penomoran Ijazah Nasional (PIN) pada ijazah saya, bersama surat ini turut saya lampirkan :
                    </div>
                    <ol style={{ margin: '0 0 1.25rem 1.5rem', padding: 0 }}>
                      <li>Berita Acara Sidang</li>
                      <li>Kartu Kemajuan Mahasiswa (KKM)</li>
                    </ol>
                    <div style={{ marginBottom: '2rem' }}>
                      Demikian surat permohonan ini disampaikan, atas perhatian Ibu saya ucapkan terima kasih.
                    </div>
                  </div>
                )}

                {/* 2. Surat Penyerahan Tugas Akhir */}
                {activeTemplate.id === 'surat-penyerahan-tugas-akhir' && (
                  <div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13pt', marginBottom: '1.75rem' }}>
                      SURAT PENYERAHAN TUGAS AKHIR
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.25rem', fontSize: '11.5pt' }}>
                      <tbody>
                        <tr><td style={{ width: '180px', padding: '2px 0' }}>Nama</td><td style={{ width: '15px' }}>:</td><td>{formData.nama || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>NIM</td><td>:</td><td>{formData.nim || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Program Studi</td><td>:</td><td>{formData.prodi || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Judul Tugas Akhir</td><td>:</td><td>{formData.judulTA || '...................................................'}</td></tr>
                      </tbody>
                    </table>
                    <div style={{ marginBottom: '0.75rem' }}>
                      Saya telah menyerahkan Tugas Akhir dalam bentuk Hard Copy/Soft Copy kepada :
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '10.5pt', marginBottom: '1.25rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #000' }}>
                          <th style={{ padding: '6px 8px', borderRight: '1px solid #000', width: '35px', textAlign: 'center' }}>No</th>
                          <th style={{ padding: '6px 8px', borderRight: '1px solid #000' }}>Nama</th>
                          <th style={{ padding: '6px 8px', borderRight: '1px solid #000' }}>Jabatan</th>
                          <th style={{ padding: '6px 8px', borderRight: '1px solid #000', width: '110px' }}>Tanggal</th>
                          <th style={{ padding: '6px 8px', width: '90px' }}>Tanda Tangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid #000' }}>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000', textAlign: 'center' }}>1</td>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000' }}>{formData.dosenPembimbing || 'Dosen Pembimbing'}</td>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000' }}>Dosen Pembimbing</td>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000' }}>{getTodayDateIndo()}</td>
                          <td style={{ padding: '6px 8px' }}></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #000' }}>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000', textAlign: 'center' }}>2</td>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000' }}>{formData.dosenPenguji || 'Dosen Penguji'}</td>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000' }}>Dosen Penguji</td>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000' }}>{getTodayDateIndo()}</td>
                          <td style={{ padding: '6px 8px' }}></td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid #000' }}>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000', textAlign: 'center' }}>3</td>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000' }}>{formData.kaprodi || 'Ketua Program Studi'}</td>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000' }}>Ketua Program Studi</td>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000' }}>{getTodayDateIndo()}</td>
                          <td style={{ padding: '6px 8px' }}></td>
                        </tr>
                        <tr>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000', textAlign: 'center' }}>4</td>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000' }}>Dr. Solahuddin Nasution, S.E., M.SP.</td>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000' }}>Manajer PKK Fakultas Vokasi</td>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000' }}>{getTodayDateIndo()}</td>
                          <td style={{ padding: '6px 8px' }}></td>
                        </tr>
                      </tbody>
                    </table>
                    <div style={{ textAlign: 'justify', marginBottom: '2rem', lineHeight: 1.5 }}>
                      Surat Penyerahan Tugas Akhir ini dipergunakan sebagai bukti bahwa Tugas Akhir saya sudah disebarkan dan digunakan sebagai syarat bebas administrasi wisuda dan pengambilan ijazah pada Fakultas Vokasi Universitas Sumatera Utara.
                    </div>
                  </div>
                )}

                {/* 3. Surat Permohonan Keterlambatan Pembayaran SPP (Pembukaan VA) */}
                {activeTemplate.id === 'surat-keterlambatan-spp' && (
                  <div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13pt', marginBottom: '1.75rem' }}>
                      Surat Permohonan Pembukaan Virtual Account (VA) Pembayaran SPP
                    </div>
                    <div style={{ marginBottom: '1.5rem', lineHeight: 1.35 }}>
                      <div>Kepada Yth.</div>
                      <div style={{ fontWeight: 'bold' }}>Dekan</div>
                      <div>Fakultas Vokasi</div>
                      <div>Universitas Sumatera Utara</div>
                      <div>Medan</div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      Saya yang bertanda tangan dibawah ini :
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.25rem', fontSize: '11.5pt' }}>
                      <tbody>
                        <tr><td style={{ width: '190px', padding: '2px 0' }}>Nama</td><td style={{ width: '15px' }}>:</td><td>{formData.nama || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>NIM</td><td>:</td><td>{formData.nim || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Semester</td><td>:</td><td>{formData.semester || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Program</td><td>:</td><td>Diploma Tiga / Sarjana Terapan</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Program Studi</td><td>:</td><td>{formData.prodi || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Fakultas</td><td>:</td><td>Vokasi</td></tr>
                      </tbody>
                    </table>
                    <div style={{ textAlign: 'justify', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                      Dengan ini mengajukan Surat Permohonan Pembukaan Virtual Account (VA) untuk pembayaran SPP, dikarenakan {formData.alasan || '...................................................'}. Virtual Account tersebut diperlukan untuk memenuhi kewajiban pembayaran akademik/administrasi pada:
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.25rem', fontSize: '11.5pt', marginLeft: '1rem' }}>
                      <tbody>
                        <tr><td style={{ width: '180px', padding: '2px 0' }}>Semester</td><td style={{ width: '15px' }}>:</td><td>{formData.semester || 'V (Lima)'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Tahun Akademik</td><td>:</td><td>{formData.tahunAkademik || '2026/2027'}</td></tr>
                      </tbody>
                    </table>
                    <div style={{ marginBottom: '1.25rem' }}>
                      Demikian surat permohonan ini saya sampaikan. Besar harapan saya agar permohonan ini dapat diproses sebagaimana mestinya. Atas perhatian dan bantuan Bapak/Ibu, saya ucapkan terima kasih.
                    </div>
                  </div>
                )}

                {/* 4. Surat Permohonan Pengunduran Diri */}
                {activeTemplate.id === 'surat-pengunduran-diri' && (
                  <div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13pt', marginBottom: '1.75rem' }}>
                      Surat Permohonan Pengunduran Diri
                    </div>
                    <div style={{ marginBottom: '1.5rem', lineHeight: 1.35 }}>
                      <div>Kepada Yth.</div>
                      <div>Ketua Program Studi {formData.prodi || 'Fakultas Vokasi'}</div>
                      <div>Fakultas Vokasi</div>
                      <div>Universitas Sumatera Utara</div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      Saya yang bertanda tangan di bawah ini:
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.25rem', fontSize: '11.5pt' }}>
                      <tbody>
                        <tr><td style={{ width: '190px', padding: '2px 0' }}>Nama</td><td style={{ width: '15px' }}>:</td><td>{formData.nama || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>NIM</td><td>:</td><td>{formData.nim || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Program</td><td>:</td><td>Diploma / Sarjana Terapan</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Program Studi</td><td>:</td><td>{formData.prodi || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Fakultas</td><td>:</td><td>Vokasi</td></tr>
                      </tbody>
                    </table>
                    <div style={{ textAlign: 'justify', marginBottom: '1rem', lineHeight: 1.5 }}>
                      Dengan ini mengajukan permohonan pengunduran diri sebagai mahasiswa Program Studi {formData.prodi || 'Fakultas Vokasi'} Universitas Sumatera Utara, terhitung mulai {formData.tanggalEfektif || getTodayDateIndo()}.
                    </div>
                    <div style={{ textAlign: 'justify', marginBottom: '1rem', lineHeight: 1.5 }}>
                      Adapun alasan pengunduran diri ini adalah {formData.alasan || '...................................................'}. Keputusan ini telah saya pertimbangkan dengan matang, dan saya menyampaikan permohonan maaf jika keputusan ini menimbulkan ketidaknyamanan.
                    </div>
                    <div style={{ textAlign: 'justify', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                      Demikian surat permohonan ini saya sampaikan. Besar harapan saya agar permohonan ini dapat diproses sebagaimana mestinya. Atas perhatian dan bantuan Bapak/Ibu, saya ucapkan terima kasih.
                    </div>
                  </div>
                )}

                {/* 5. Surat Permohonan Undangan Ujian Tugas Akhir */}
                {activeTemplate.id === 'surat-undangan-ujian-ta' && (
                  <div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13pt', marginBottom: '1.75rem' }}>
                      SURAT PERMOHONAN UNDANGAN UJIAN TUGAS AKHIR
                    </div>
                    <div style={{ marginBottom: '1.5rem', lineHeight: 1.35 }}>
                      <div>Kepada Yth.</div>
                      <div>Ketua Program Studi {formData.prodi || 'Fakultas Vokasi'}</div>
                      <div>Fakultas Vokasi</div>
                      <div>Universitas Sumatera Utara</div>
                      <div>Medan</div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      Saya yang bertanda tangan di bawah ini:
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem', fontSize: '11.5pt' }}>
                      <tbody>
                        <tr><td style={{ width: '190px', padding: '2px 0' }}>Nama</td><td style={{ width: '15px' }}>:</td><td>{formData.nama || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>NIM</td><td>:</td><td>{formData.nim || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Program</td><td>:</td><td>{formData.program || 'Sarjana Terapan'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Program Studi</td><td>:</td><td>{formData.prodi || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Hari, Tanggal Ujian</td><td>:</td><td>{formData.hariTanggalUjian || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Pukul</td><td>:</td><td>{formData.pukul || '09.30 - 11.30 WIB'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Tempat</td><td>:</td><td>{formData.tempat || 'Ruang Sidang Fakultas Vokasi'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Dosen Pembimbing</td><td>:</td><td>{formData.dosenPembimbing || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Dosen Penguji</td><td>:</td><td>{formData.dosenPenguji || '...................................................'}</td></tr>
                      </tbody>
                    </table>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.4rem' }}>Judul Skripsi/Tugas Akhir:</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.25rem', fontSize: '11pt' }}>
                      <tbody>
                        <tr><td style={{ width: '150px', padding: '3px 0' }}>Bahasa Indonesia</td><td style={{ width: '15px' }}>:</td><td>{formData.judulTA || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '3px 0' }}>Bahasa Inggris</td><td>:</td><td style={{ fontStyle: 'italic' }}>{formData.judulTAEn || formData.judulTA || '...................................................'}</td></tr>
                      </tbody>
                    </table>
                    <div style={{ textAlign: 'justify', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                      Dengan ini mengajukan permohonan kepada Bapak/Ibu untuk dapat diterbitkan Undangan Ujian Tugas Akhir bagi saya, sebagai salah satu tahapan dalam penyelesaian pendidikan pada Program Studi {formData.prodi || 'Fakultas Vokasi'} Fakultas Vokasi Universitas Sumatera Utara.
                    </div>
                  </div>
                )}

                {/* 6. Surat Pernyataan Bebas Administrasi */}
                {activeTemplate.id === 'surat-bebas-administrasi' && (
                  <div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13pt', marginBottom: '1.75rem' }}>
                      SURAT PERNYATAAN BEBAS ADMINISTRASI
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      Yang bertanda tangan di bawah ini:
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.25rem', fontSize: '11.5pt' }}>
                      <tbody>
                        <tr><td style={{ width: '180px', padding: '2px 0' }}>Nama</td><td style={{ width: '15px' }}>:</td><td>{formData.nama || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>NIM</td><td>:</td><td>{formData.nim || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Program Studi</td><td>:</td><td>{formData.prodi || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Periode Wisuda</td><td>:</td><td>{formData.periodeWisuda || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>No. Telepon/Hp</td><td>:</td><td>{formData.noHp || '...................................................'}</td></tr>
                      </tbody>
                    </table>
                    <div style={{ marginBottom: '0.75rem' }}>Dengan ini saya menyatakan bahwa:</div>
                    <ol style={{ margin: '0 0 1.25rem 1.25rem', padding: 0, textAlign: 'justify', lineHeight: 1.5 }}>
                      <li style={{ marginBottom: '0.5rem' }}>Seluruh data diri yang tercantum dalam Ijazah dan Transkrip Nilai beserta dokumen yang saya serahkan kepada Fakultas Vokasi Universitas Sumatera Utara adalah benar, sah, dan dapat dipertanggungjawabkan.</li>
                      <li style={{ marginBottom: '0.5rem' }}>Saya telah menyelesaikan seluruh kewajiban administrasi yang menjadi tanggung jawab saya, baik administrasi akademik, administrasi keuangan, administrasi perpustakaan, dan pengembalian toga sesuai dengan ketentuan yang berlaku di Fakultas Vokasi Universitas Sumatera Utara.</li>
                      <li style={{ marginBottom: '0.5rem' }}>Apabila di kemudian hari terbukti terdapat data yang tidak benar atau masih terdapat kewajiban administrasi yang belum saya selesaikan, maka saya bersedia menerima konsekuensi dan sanksi sesuai dengan peraturan yang berlaku.</li>
                    </ol>
                    <div style={{ textAlign: 'justify', marginBottom: '2rem', lineHeight: 1.5 }}>
                      Demikian surat pernyataan ini saya buat dengan sebenar-benarnya, dalam keadaan sadar, tanpa adanya paksaan dari pihak mana pun, untuk dipergunakan sebagai salah satu persyaratan pengambilan Ijazah dan Transkrip Nilai Digital.
                    </div>
                  </div>
                )}

                {/* 7. Surat Permohonan Perubahan Data Mahasiswa (PDM) PDDIKTI */}
                {activeTemplate.id === 'surat-perubahan-data-pddikti' && (
                  <div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13pt', marginBottom: '1.75rem' }}>
                      SURAT PERMOHONAN PERUBAHAN DATA MAHASISWA (PDM) PADA PDDIKTI
                    </div>
                    <div style={{ marginBottom: '1.5rem', lineHeight: 1.35 }}>
                      <div>Kepada Yth.</div>
                      <div>Ketua Program Studi {formData.prodiTujuan || formData.prodi || 'Fakultas Vokasi'}</div>
                      <div>Universitas Sumatera Utara</div>
                      <div>Medan</div>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>Saya yang bertanda tangan di bawah ini:</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.25rem', fontSize: '11pt' }}>
                      <tbody>
                        <tr><td style={{ width: '190px', padding: '2px 0' }}>Nama</td><td style={{ width: '15px' }}>:</td><td>{formData.nama || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>NIM</td><td>:</td><td>{formData.nim || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Program Studi</td><td>:</td><td>{formData.prodi || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Tempat Lahir</td><td>:</td><td>{formData.tempatLahir || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Tanggal Lahir</td><td>:</td><td>{formData.tanggalLahir || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Nama Ibu Kandung</td><td>:</td><td>{formData.namaIbuKandung || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Nomor Ijazah Nasional</td><td>:</td><td>{formData.nomorIjazahNasional || '-'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Nomor Transkrip Nilai</td><td>:</td><td>{formData.nomorTranskripNilai || '-'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Nomor HP/Email</td><td>:</td><td>{formData.noHpEmail || '...................................................'}</td></tr>
                      </tbody>
                    </table>
                    <div style={{ textAlign: 'justify', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                      Dengan ini mengajukan permohonan perubahan/perbaikan data mahasiswa pada Pangkalan Data Pendidikan Tinggi (PDDIKTI). Adapun data yang perlu dilakukan perubahan adalah sebagai berikut:
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '10pt', marginBottom: '1.25rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #000' }}>
                          <th style={{ padding: '6px 8px', borderRight: '1px solid #000', width: '35px', textAlign: 'center' }}>No</th>
                          <th style={{ padding: '6px 8px', borderRight: '1px solid #000' }}>Data yang Tercatat pada PDDIKTI</th>
                          <th style={{ padding: '6px 8px', borderRight: '1px solid #000' }}>Data yang Seharusnya</th>
                          <th style={{ padding: '6px 8px' }}>Alasan Perubahan Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000', textAlign: 'center' }}>1</td>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000', color: '#dc2626' }}>{formData.dataTercatat || 'Data keliru...'}</td>
                          <td style={{ padding: '6px 8px', borderRight: '1px solid #000', fontWeight: 'bold', color: '#16a34a' }}>{formData.dataSeharusnya || 'Data benar...'}</td>
                          <td style={{ padding: '6px 8px' }}>{formData.alasanPerubahan || 'Alasan perbaikan...'}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div style={{ textAlign: 'justify', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                      Sebagai bahan pertimbangan dan kelengkapan administrasi, bersama ini saya melampirkan dokumen pendukung perubahan data yang sesuai.
                    </div>
                  </div>
                )}

                {/* 8. Surat Rekomendasi AKK / PKA */}
                {(activeTemplate.id === 'surat-rekomendasi-akk' || activeTemplate.id === 'surat-rekomendasi-pka') && (
                  <div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13pt', marginBottom: '1.75rem' }}>
                      {activeTemplate.id === 'surat-rekomendasi-akk' ? 'SURAT REKOMENDASI AKTIF KULIAH KEMBALI (AKK)' : 'REKOMENDASI PENUNDAAN KEGIATAN AKADEMIK (PKA)'}
                    </div>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.4rem' }}>A. Pemohon</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem', fontSize: '11pt' }}>
                      <tbody>
                        <tr><td style={{ width: '190px', padding: '2px 0' }}>Nama Lengkap</td><td style={{ width: '15px' }}>:</td><td>{formData.nama || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>NIM</td><td>:</td><td>{formData.nim || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Program Studi</td><td>:</td><td>{formData.prodi || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Semester Diajukan</td><td>:</td><td>{formData.semester || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Tahun Akademik</td><td>:</td><td>{formData.tahunAkademik || '2026/2027'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Alasan</td><td>:</td><td>{formData.alasan || '...................................................'}</td></tr>
                      </tbody>
                    </table>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.4rem' }}>B. Data Pemohon</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.25rem', fontSize: '11pt' }}>
                      <tbody>
                        <tr><td style={{ width: '260px', padding: '2px 0' }}>Masuk pertama studi tahun</td><td style={{ width: '15px' }}>=</td><td>{formData.tahunMasuk || '2024'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Masa studi yang telah dijalani</td><td>=</td><td>{formData.masaStudiDijalani || '2 Semester'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Beban studi yang berhasil diselesaikan</td><td>=</td><td>{formData.sksLulus || '40 SKS'}</td></tr>
                      </tbody>
                    </table>
                    <div style={{ textAlign: 'justify', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                      Demikian permohonan ini saya ajukan dengan sebenar-benarnya untuk dapat dipertimbangkan dan diproses sesuai dengan ketentuan yang berlaku di Universitas Sumatera Utara.
                    </div>
                  </div>
                )}

                {/* 9. Template Standar (Izin Tidak Kuliah, Izin Penelitian, Kehilangan, Aktif Kuliah, Magang, PKL, Beasiswa, Tunjangan) */}
                {![
                  'surat-keterangan-lulus',
                  'surat-penyerahan-tugas-akhir',
                  'surat-keterlambatan-spp',
                  'surat-pengunduran-diri',
                  'surat-undangan-ujian-ta',
                  'surat-bebas-administrasi',
                  'surat-perubahan-data-pddikti',
                  'surat-rekomendasi-akk',
                  'surat-rekomendasi-pka'
                ].includes(activeTemplate.id) && (
                  <div>
                    {/* Judul Surat */}
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13pt', textTransform: 'uppercase', marginBottom: '2rem', letterSpacing: '0.02em' }}>
                      {activeTemplate.title}
                    </div>

                    {/* Surat Tujuan */}
                    <div style={{ marginBottom: '1.5rem', lineHeight: 1.35 }}>
                      <div>Yth. Ketua Program Studi</div>
                      <div style={{ fontWeight: 'bold' }}>{formData.prodiTujuan || formData.prodi || 'D3 Teknik Informatika'}</div>
                      <div>Fakultas Vokasi</div>
                      <div>Universitas Sumatera Utara</div>
                      <div>Medan</div>
                    </div>

                    {/* Paragraf Pembuka */}
                    <div style={{ marginBottom: '1rem' }}>
                      Dengan hormat, saya yang bertanda tangan di bawah ini :
                    </div>

                    {/* Identitas Mahasiswa */}
                    <table style={{ width: '100%', marginBottom: '1.25rem', borderCollapse: 'collapse', fontSize: '11.5pt' }}>
                      <tbody>
                        <tr><td style={{ width: '190px', padding: '2px 0' }}>Nama</td><td style={{ width: '15px' }}>:</td><td>{formData.nama || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>NIM</td><td>:</td><td>{formData.nim || '...................................................'}</td></tr>
                        <tr><td style={{ padding: '2px 0' }}>Program Studi</td><td>:</td><td>{formData.prodi || '...................................................'}</td></tr>
                        {formData.fakultas && <tr><td style={{ padding: '2px 0' }}>Fakultas</td><td>:</td><td>{formData.fakultas}</td></tr>}
                        {formData.semester && <tr><td style={{ padding: '2px 0' }}>Semester</td><td>:</td><td>{formData.semester}</td></tr>}
                        {formData.ipk && <tr><td style={{ padding: '2px 0' }}>IPK</td><td>:</td><td>{formData.ipk}</td></tr>}
                        {formData.tahunAkademik && <tr><td style={{ padding: '2px 0' }}>Tahun Akademik</td><td>:</td><td>{formData.tahunAkademik}</td></tr>}
                        {formData.ttl && <tr><td style={{ padding: '2px 0' }}>Tempat, Tanggal Lahir</td><td>:</td><td>{formData.ttl}</td></tr>}
                        {formData.noHp && <tr><td style={{ padding: '2px 0' }}>No. Telepon/HP</td><td>:</td><td>{formData.noHp}</td></tr>}
                        {formData.alamat && <tr><td style={{ padding: '2px 0' }}>Alamat Mahasiswa</td><td>:</td><td>{formData.alamat}</td></tr>}
                        {formData.judulProposal && <tr><td style={{ padding: '2px 0' }}>Judul Proposal</td><td>:</td><td>{formData.judulProposal}</td></tr>}
                        {formData.lokasiPenelitian && <tr><td style={{ padding: '2px 0' }}>Lokasi Penelitian</td><td>:</td><td>{formData.lokasiPenelitian}</td></tr>}
                        {formData.dosenPembimbing && <tr><td style={{ padding: '2px 0' }}>Dosen Pembimbing</td><td>:</td><td>{formData.dosenPembimbing}</td></tr>}
                        {formData.ditujukanKepada && <tr><td style={{ padding: '2px 0' }}>Ditujukan Kepada</td><td>:</td><td>{formData.ditujukanKepada}</td></tr>}
                        {formData.tanggalPenelitian && <tr><td style={{ padding: '2px 0' }}>Tanggal Penelitian</td><td>:</td><td>{formData.tanggalPenelitian}</td></tr>}
                      </tbody>
                    </table>

                    {/* Tabel Anggota jika Kelompok */}
                    {activeTemplate.isGroup && (
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ marginBottom: '0.4rem' }}>Dengan anggota kelompok :</div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '10.5pt', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #000' }}>
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
                                <td style={{ padding: '4px 8px', borderRight: '1px solid #000' }}>{m.nama || '-'}</td>
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
                            <tr><td style={{ width: '190px', padding: '2px 0' }}>Perusahaan/Instansi</td><td style={{ width: '15px' }}>:</td><td>{formData.perusahaan}</td></tr>
                            <tr><td style={{ padding: '2px 0' }}>Alamat</td><td>:</td><td>{formData.alamatPerusahaan || '-'}</td></tr>
                            <tr><td style={{ padding: '2px 0' }}>Kota Tujuan</td><td>:</td><td>{formData.kotaTujuan || 'Medan'}</td></tr>
                            <tr><td style={{ padding: '2px 0' }}>Tanggal Pelaksanaan</td><td>:</td><td>{formData.tanggalMagang || formData.tanggalPKL || '-'}</td></tr>
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
                            <tr><td style={{ width: '190px', padding: '2px 0' }}>Nama Orang Tua</td><td style={{ width: '15px' }}>:</td><td>{formData.namaOrangTua}</td></tr>
                            <tr><td style={{ padding: '2px 0' }}>NIP/NRP/NIK/No. Pensiun</td><td>:</td><td>{formData.nipOrangTua || '-'}</td></tr>
                            <tr><td style={{ padding: '2px 0' }}>Instansi</td><td>:</td><td>{formData.instansiOrangTua || '-'}</td></tr>
                            <tr><td style={{ padding: '2px 0' }}>Alamat Orang Tua</td><td>:</td><td>{formData.alamatOrangTua || '-'}</td></tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Paragraf Pokok */}
                    <div style={{ textAlign: 'justify', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                      {activeTemplate.id === 'surat-izin-tidak-ikut-kuliah' && (
                        <span>
                          Mengajukan Surat Permohonan Izin Tidak Mengikuti Perkuliahan dikarenakan{' '}
                          {formData.alasan || '...................................................'}.
                        </span>
                      )}
                      {activeTemplate.id === 'surat-permohonan-izin-penelitian' && (
                        <span>
                          Dengan ini mengajukan Surat Izin Penelitian untuk menyelesaikan proposal penelitian.
                        </span>
                      )}
                      {activeTemplate.id === 'surat-kehilangan-dokumen' && (
                        <span>
                          Mengajukan Surat Permohonan Kehilangan{' '}
                          {formData.dokumenHilang || 'KRS / KHS / KTM / Transkrip'} Mahasiswa yang dikarenakan hilang.
                        </span>
                      )}
                      {activeTemplate.id === 'surat-keterangan-aktif-kuliah' && (
                        <span>
                          Mengajukan Surat Permohonan Aktif Kuliah Mahasiswa untuk keperluan{' '}
                          {formData.keperluan || '...................................................'}.
                        </span>
                      )}
                      {activeTemplate.id === 'surat-rekomendasi-beasiswa' && (
                        <span>
                          Mengajukan Surat Permohonan Rekomendasi untuk kelengkapan berkas administrasi{' '}
                          {formData.namaBeasiswa || 'Beasiswa'}.
                        </span>
                      )}
                      {activeTemplate.id === 'surat-pernyataan-aktif-tunjangan-ortu' && (
                        <span>
                          Agar dapat kiranya surat keterangan yang menyatakan bahwa saya adalah benar mahasiswa Fakultas Vokasi, Universitas Sumatera Utara, dan aktif kuliah pada Tahun Akademik {formData.tahunAkademik || '2026/2027'}. Hal ini diperlukan untuk memperoleh Tunjangan Keluarga dari instansi tempat orang tua saya bekerja.
                        </span>
                      )}
                    </div>

                    {/* Penutup */}
                    <div style={{ marginBottom: '2.5rem' }}>
                      Demikian surat permohonan ini disampaikan, atas perhatian Bapak/Ibu diucapkan terima kasih.
                    </div>
                  </div>
                )}
              </div>

              {/* Bagian Tanda Tangan Sesuai Format Surat */}
              {activeTemplate.id === 'surat-pengunduran-diri' ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                  <div style={{ width: '220px', textAlign: 'left', lineHeight: 1.4 }}>
                    <div style={{ height: '1.4em' }}></div>
                    <div>Hormat saya,</div>
                    <div style={{ height: '4.5rem' }}></div>
                    <div style={{ textDecoration: 'underline' }}>{formData.nama || 'Nama Mahasiswa'}</div>
                    <div>NIM. {formData.nim || '...........................'}</div>
                  </div>
                  <div style={{ width: '240px', textAlign: 'left', lineHeight: 1.4 }}>
                    <div>Medan, {getTodayDateIndo()}</div>
                    <div>Mengetahui Orang Tua/Wali,</div>
                    <div style={{ height: '1.5rem' }}></div>
                    <div style={{ fontSize: '9pt', color: '#64748b', border: '1px dashed #cbd5e1', padding: '2px 6px', width: 'fit-content', borderRadius: '3px', marginBottom: '1rem' }}>
                      Materai Rp10.000
                    </div>
                    <div style={{ textDecoration: 'underline' }}>{formData.namaOrangTua || 'Nama Orang Tua'}</div>
                    <div>Orang Tua / Wali</div>
                  </div>
                </div>
              ) : activeTemplate.id === 'surat-bebas-administrasi' ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                  <div style={{ width: '220px', textAlign: 'left', lineHeight: 1.4 }}>
                    <div style={{ height: '1.4em' }}></div>
                    <div>Hormat Saya,</div>
                    <div style={{ height: '1.5rem' }}></div>
                    <div style={{ fontSize: '9pt', color: '#64748b', border: '1px dashed #cbd5e1', padding: '2px 6px', width: 'fit-content', borderRadius: '3px', marginBottom: '1rem' }}>
                      Materai Rp10.000
                    </div>
                    <div style={{ textDecoration: 'underline' }}>{formData.nama || 'Nama Mahasiswa'}</div>
                    <div>NIM. {formData.nim || '...........................'}</div>
                  </div>
                  <div style={{ width: '240px', textAlign: 'left', lineHeight: 1.4 }}>
                    <div>Medan, {getTodayDateIndo()}</div>
                    <div>Ketua Program Studi,</div>
                    <div style={{ height: '4.5rem' }}></div>
                    <div style={{ textDecoration: 'underline' }}>{formData.kaprodi || 'Nama Kaprodi'}</div>
                    <div>NIP. {formData.nipKaprodi || '...........................'}</div>
                  </div>
                </div>
              ) : activeTemplate.id === 'surat-penyerahan-tugas-akhir' ? (
                <div style={{ alignSelf: 'flex-end', width: '240px', textAlign: 'left', lineHeight: 1.4, marginTop: '1.5rem' }}>
                  <div>Medan, {getTodayDateIndo()}</div>
                  <div style={{ marginBottom: '4.5rem' }}>Mahasiswa yang menyerahkan,</div>
                  <div style={{ textDecoration: 'underline' }}>{formData.nama || 'Nama Mahasiswa'}</div>
                  <div>NIM. {formData.nim || '...........................'}</div>
                </div>
              ) : activeTemplate.id === 'surat-perubahan-data-pddikti' ? (
                <div style={{ alignSelf: 'flex-end', width: '240px', textAlign: 'left', lineHeight: 1.4, marginTop: '1.5rem' }}>
                  <div>Medan, {getTodayDateIndo()}</div>
                  <div>Pemohon,</div>
                  <div style={{ height: '1.5rem' }}></div>
                  <div style={{ fontSize: '9pt', color: '#64748b', border: '1px dashed #cbd5e1', padding: '2px 6px', width: 'fit-content', borderRadius: '3px', marginBottom: '1rem' }}>
                    Materai Rp10.000
                  </div>
                  <div style={{ textDecoration: 'underline' }}>{formData.nama || 'Nama Pemohon'}</div>
                  <div>NIM. {formData.nim || '...........................'}</div>
                </div>
              ) : (
                <div style={{ alignSelf: 'flex-end', width: '240px', textAlign: 'left', lineHeight: 1.4, marginTop: '1.5rem' }}>
                  <div>Medan, {getTodayDateIndo()}</div>
                  <div style={{ marginBottom: '4.5rem' }}>Hormat Saya,</div>
                  <div style={{ textDecoration: 'underline' }}>{formData.nama || 'Nama Mahasiswa'}</div>
                  <div>NIM. {formData.nim || '...........................'}</div>
                </div>
              )}
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
            <span>Format berkas Word (.docx) & Pratinjau langsung mempertahankan format baku Vokasi USU. Tanggal surat otomatis terkunci hari ini ({getTodayDateIndo()}).</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-outline btn-sm"
              title="Cetak khusus lembar surat resmi ke printer atau PDF"
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

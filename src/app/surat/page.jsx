'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Download,
  Search,
  CheckCircle2,
  FileCheck,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  X,
  Layers,
  GraduationCap,
  Briefcase,
  BookOpen,
  Users
} from 'lucide-react';
import { TEMPLATE_SURAT } from '@/src/lib/mockData';
import Toast from '@/src/components/Toast';
import dynamic from 'next/dynamic';

const SuratGeneratorModal = dynamic(() => import('@/src/components/SuratGeneratorModal'), {
  ssr: false,
});

export default function SuratPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [activeModalTemplate, setActiveModalTemplate] = useState(null);
  const [generatorModalOpen, setGeneratorModalOpen] = useState(false);
  const [selectedGeneratorTemplateId, setSelectedGeneratorTemplateId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const categories = [
    'Semua',
    'Magang & PKL',
    'Akademik & Perkuliahan',
    'Beasiswa',
    'Tunjangan Orang Tua',
    'Penelitian & Tugas Akhir',
    'Kehilangan Dokumen'
  ];

  const filteredTemplates = TEMPLATE_SURAT.filter((item) => {
    const matchSearch =
      !searchQuery ||
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kategori.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory =
      selectedCategory === 'Semua' ||
      (selectedCategory === 'Magang & PKL' && (item.kategori.includes('Magang') || item.kategori.includes('PKL') || item.kategori.includes('Praktek'))) ||
      (selectedCategory === 'Beasiswa' && item.kategori.includes('Beasiswa')) ||
      (selectedCategory === 'Akademik & Perkuliahan' && (item.kategori.includes('Akademik') && !item.kategori.includes('Kehilangan'))) ||
      (selectedCategory === 'Tunjangan Orang Tua' && item.kategori.includes('Tunjangan')) ||
      (selectedCategory === 'Penelitian & Tugas Akhir' && item.kategori.includes('Penelitian')) ||
      (selectedCategory === 'Kehilangan Dokumen' && (item.kategori.includes('Kehilangan') || item.nama.includes('Kehilangan')));

    return matchSearch && matchCategory;
  });

  const handleDownload = (template) => {
    const link = document.createElement('a');
    link.href = template.fileUrl;
    link.download = template.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToast({
      message: `Template "${template.nama}" (.docx) berhasil diunduh.`,
      type: 'success',
    });
  };

  return (
    <div style={{ paddingBottom: '6rem' }}>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* Header Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #034825 0%, #067f42 65%, #022b16 100%)',
          color: '#ffffff',
          padding: '4rem 0 4.5rem',
          borderBottom: '3px solid var(--usu-gold)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-100px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Static Official Corner Watermark */}
        <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', width: '280px', height: '280px', opacity: 0.08, pointerEvents: 'none' }}>
          <img src="/ornament/circular-tra.svg" alt="" style={{ width: '100%', height: '100%' }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '820px' }}>
            <div className="title-fill title-fill--dark" style={{ marginBottom: '1rem' }}>
              <div className="title-fill__icon">
                <img src="/ornament/flower-ora.svg" alt="" />
              </div>
              <span className="title-fill__text" style={{ color: '#fef08a' }}>
                Layanan Administrasi Mahasiswa • Fakultas Vokasi USU
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.1rem, 4vw, 3rem)',
                color: '#ffffff',
                fontWeight: 800,
                fontFamily: 'Outfit, sans-serif',
                lineHeight: 1.2,
                marginBottom: '1rem',
                letterSpacing: '-0.02em',
              }}
            >
              Template Surat Permohonan Mahasiswa
            </h1>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1.65,
                fontWeight: 400,
              }}
            >
              Unduh berkas template format Microsoft Word (<code>.docx</code>) yang telah disesuaikan dengan ketentuan tata kelola administrasi Fakultas Vokasi Universitas Sumatera Utara. Pastikan kelengkapan berkas persyaratan sebelum diajukan.
            </p>

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setSelectedGeneratorTemplateId(null);
                  setGeneratorModalOpen(true);
                }}
                className="btn btn-gold"
                style={{ padding: '0.75rem 1.4rem', fontSize: '0.92rem', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)' }}
              >
                <Sparkles size={17} />
                <span>Buka Generator Surat Instan (Isi & Unduh Word .docx)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ marginTop: '-2rem', position: 'relative', zIndex: 20 }}>
        {/* Filter & Search Bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(0, 54, 32, 0.06)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '280px', maxWidth: '480px' }}>
              <input
                type="text"
                placeholder="Cari surat, kode, atau kata kunci (magang, beasiswa, pkl)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-text"
                style={{ paddingLeft: '2.6rem', backgroundColor: '#f8fafc', fontSize: '0.9rem' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>

            {/* Quick Count Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <Layers size={16} style={{ color: 'var(--usu-green)' }} />
              <span>Menampilkan: <strong style={{ color: 'var(--usu-green-dark)' }}>{filteredTemplates.length} dari 10 Template Dokumen</strong></span>
            </div>
          </div>

          {/* Category Filter Pills (Touch-Friendly & Horizontally Scrollable on Mobile) */}
          <div
            className="hide-scrollbar"
            style={{
              display: 'flex',
              gap: '0.45rem',
              marginTop: '1.25rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              paddingBottom: '0.35rem',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: '9999px',
                  fontSize: '0.825rem',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  cursor: 'pointer',
                  border: selectedCategory === cat ? '1.5px solid var(--usu-green)' : '1px solid var(--border-subtle)',
                  backgroundColor: selectedCategory === cat ? 'var(--usu-green-soft)' : '#ffffff',
                  color: selectedCategory === cat ? 'var(--usu-green-dark)' : 'var(--text-muted)',
                  transition: 'all 0.18s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Super Premium Cards Grid (100% Fluid on Mobile) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 330px), 1fr))', gap: '1.5rem' }}>
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="template-card"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Top Accent Strip */}
              <div style={{ height: '4px', background: 'linear-gradient(90deg, #067f42 0%, #08a355 100%)' }} />

              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header: Icon Word, Kode & Kategori */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.15rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Word Document Icon Container */}
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #1b5299 0%, #0d3b75 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        boxShadow: '0 3px 8px rgba(27, 82, 153, 0.25)',
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={22} />
                    </div>

                    <div>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: 'var(--usu-green)',
                          backgroundColor: 'var(--usu-green-soft)',
                          padding: '0.12rem 0.5rem',
                          borderRadius: '4px',
                        }}
                      >
                        {template.kode}
                      </span>
                      <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px', fontWeight: 500 }}>
                        DOCX • {template.fileSize}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: '#475569',
                      backgroundColor: '#f1f5f9',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                    }}
                  >
                    {template.kategori}
                  </span>
                </div>

                {/* Judul Surat */}
                <h3
                  style={{
                    fontSize: '1.1rem',
                    color: 'var(--text-main)',
                    marginBottom: '0.5rem',
                    lineHeight: 1.4,
                    fontWeight: 700,
                  }}
                >
                  {template.nama}
                </h3>

                {/* Deskripsi Penggunaan */}
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '1.25rem', flex: 1 }}>
                  {template.deskripsi}
                </p>

                {/* Kotak Pratinjau Persyaratan */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '10px',
                    padding: '0.9rem',
                    border: '1px solid #edf2f7',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--usu-green-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Syarat Berkas ({template.syarat.length}):
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveModalTemplate(template)}
                      style={{ background: 'none', border: 'none', color: 'var(--usu-green)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                    >
                      <span>Lihat Semua</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {template.syarat.slice(0, 2).map((s, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.785rem', color: '#475569' }}>
                        <CheckCircle2 size={13} style={{ color: 'var(--usu-green)', flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s}</span>
                      </div>
                    ))}
                    {template.syarat.length > 2 && (
                      <div style={{ fontSize: '0.74rem', color: '#94a3b8', paddingLeft: '1.15rem' }}>
                        + {template.syarat.length - 2} berkas persyaratan lainnya...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  padding: '1rem 1.25rem 1.25rem',
                  borderTop: '1px solid var(--border-subtle)',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGeneratorTemplateId(template.id);
                    setGeneratorModalOpen(true);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', padding: '0.65rem 0.8rem', fontSize: '0.84rem' }}
                >
                  <Sparkles size={14} />
                  <span>Isi & Generate Surat Ini</span>
                </button>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setActiveModalTemplate(template)}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1, padding: '0.5rem 0.6rem', fontSize: '0.78rem' }}
                  >
                    <FileCheck size={13} />
                    <span>Syarat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownload(template)}
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1.25, padding: '0.5rem 0.6rem', fontSize: '0.78rem' }}
                    title="Unduh template blanko mentah (.docx)"
                  >
                    <Download size={13} />
                    <span>Unduh Blanko</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Detail Persyaratan Dokumen Lengkap */}
      {activeModalTemplate && (
        <div className="modal-backdrop" onClick={() => setActiveModalTemplate(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #1b5299 0%, #0d3b75 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                  }}
                >
                  <FileText size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--usu-green-dark)', margin: 0, fontWeight: 700 }}>
                    {activeModalTemplate.nama}
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '2px' }}>
                    Kode: {activeModalTemplate.kode} • Format: {activeModalTemplate.formatDokumen} ({activeModalTemplate.fileSize})
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalTemplate(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', padding: '4px' }}
                aria-label="Tutup Dialog"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
                  Kegunaan Dokumen:
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.6, margin: 0 }}>
                  {activeModalTemplate.deskripsi}
                </p>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--usu-green-dark)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', letterSpacing: '0.04em' }}>
                  <FileCheck size={15} />
                  <span>Kelengkapan Berkas yang Wajib Disiapkan:</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {activeModalTemplate.syarat.map((req, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.65rem',
                        padding: '0.7rem 0.85rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <CheckCircle2 size={15} style={{ color: 'var(--usu-green)', flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                        {req}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setActiveModalTemplate(null)}
              >
                Tutup
              </button>
              <button
                type="button"
                className="btn btn-gold"
                onClick={() => {
                  handleDownload(activeModalTemplate);
                  setActiveModalTemplate(null);
                }}
              >
                <Download size={15} />
                <span>Unduh File .DOCX</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Surat Generator Modal */}
      <SuratGeneratorModal
        isOpen={generatorModalOpen}
        initialTemplateId={selectedGeneratorTemplateId}
        onClose={() => setGeneratorModalOpen(false)}
      />
    </div>
  );
}

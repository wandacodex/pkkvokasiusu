'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  Download,
  Eye,
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  Award,
  Layers,
  GraduationCap,
  Sparkles,
  ExternalLink,
  X,
  SlidersHorizontal,
  FileCheck2,
  RotateCcw
} from 'lucide-react';
import { AKREDITASI_DATA } from '@/src/lib/akreditasiData';

export default function AkreditasiPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJenjang, setSelectedJenjang] = useState('Semua'); // 'Semua' | 'D3' | 'D4'
  const [selectedPeringkat, setSelectedPeringkat] = useState('Semua'); // 'Semua' | 'Unggul' | 'Baik Sekali' | 'Baik' | 'B'
  const [selectedLembaga, setSelectedLembaga] = useState('Semua');
  const [activePdfPreview, setActivePdfPreview] = useState(null);

  // Close PDF modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActivePdfPreview(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lembaga options
  const lembagaList = ['Semua', 'BAN-PT', 'LAMEMBA', 'LAMSAMA', 'LAM INFOKOM', 'LAM-PTKes', 'LAM Teknik'];

  // Filtered dataset
  const filteredData = useMemo(() => {
    return AKREDITASI_DATA.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.prodi.toLowerCase().includes(q) ||
        item.noSk.toLowerCase().includes(q) ||
        item.lembaga.toLowerCase().includes(q) ||
        item.peringkat.toLowerCase().includes(q) ||
        item.masaBerlaku.toLowerCase().includes(q);

      const matchJenjang = selectedJenjang === 'Semua' || item.jenjang === selectedJenjang;
      const matchLembaga = selectedLembaga === 'Semua' || item.lembaga === selectedLembaga;
      const matchPeringkat =
        selectedPeringkat === 'Semua' ||
        (selectedPeringkat === 'Unggul' && item.peringkat.toLowerCase().includes('unggul')) ||
        (selectedPeringkat === 'Baik Sekali' && item.peringkat.toLowerCase().includes('baik sekali')) ||
        (selectedPeringkat === 'Baik' && (item.peringkat === 'Baik' || item.peringkat === 'B'));

      return matchSearch && matchJenjang && matchLembaga && matchPeringkat;
    });
  }, [searchQuery, selectedJenjang, selectedLembaga, selectedPeringkat]);

  // Summary counts
  const totalD3 = AKREDITASI_DATA.filter((d) => d.jenjang === 'D3').length;
  const totalD4 = AKREDITASI_DATA.filter((d) => d.jenjang === 'D4').length;
  const totalUnggul = AKREDITASI_DATA.filter((d) => d.peringkat.toLowerCase().includes('unggul')).length;
  const totalBaikSekali = AKREDITASI_DATA.filter((d) => d.peringkat.toLowerCase().includes('baik sekali')).length;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedJenjang('Semua');
    setSelectedPeringkat('Semua');
    setSelectedLembaga('Semua');
  };

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Header Banner Resmi Vokasi USU */}
      <section
        style={{
          background: 'linear-gradient(135deg, #022b16 0%, #034825 45%, #067f42 100%)',
          color: '#ffffff',
          padding: '3.8rem 0 4.2rem',
          borderBottom: '4px solid var(--usu-gold)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Static Official Corner Watermark */}
        <div
          style={{
            position: 'absolute',
            right: '-35px',
            bottom: '-35px',
            width: '290px',
            height: '290px',
            opacity: 0.08,
            pointerEvents: 'none',
          }}
        >
          <img src="/ornament/circular-tra.svg" alt="" style={{ width: '100%', height: '100%' }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '820px' }}>
            {/* Signature Title Fill Badge (Matching vokasi.usu.ac.id) */}
            <div className="title-fill title-fill--dark" style={{ marginBottom: '1rem' }}>
              <div className="title-fill__icon">
                <img src="/ornament/flower-ora.svg" alt="" />
              </div>
              <span className="title-fill__text" style={{ color: '#fef08a' }}>
                Penjaminan Mutu Akademik • Fakultas Vokasi USU
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.1rem, 4vw, 3rem)',
                color: '#ffffff',
                fontWeight: 800,
                fontFamily: 'Outfit, sans-serif',
                lineHeight: 1.2,
                marginBottom: '0.9rem',
                letterSpacing: '-0.02em',
              }}
            >
              Sertifikat & SK Akreditasi Program Studi
            </h1>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.65,
                marginBottom: '1.75rem',
              }}
            >
              Direktori resmi salinan Surat Keputusan (SK) dan Sertifikat Akreditasi 21 Program Studi Fakultas Vokasi Universitas Sumatera Utara yang diterbitkan oleh BAN-PT dan Lembaga Akreditasi Mandiri (LAM).
            </p>

            {/* Quick Metrics Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
              >
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}>
                  21 Prodi
                </div>
                <div style={{ fontSize: '0.75rem', color: '#fef08a', fontWeight: 600 }}>
                  100% Terakreditasi
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
              >
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}>
                  14 Prodi
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600 }}>
                  Diploma Tiga (D3)
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
              >
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}>
                  7 Prodi
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600 }}>
                  Sarjana Terapan (D4)
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
              >
                <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit, sans-serif' }}>
                  BAN-PT & LAM
                </div>
                <div style={{ fontSize: '0.75rem', color: '#fef08a', fontWeight: 600 }}>
                  Standar Mutu Nasional
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ marginTop: '-1.5rem', position: 'relative', zIndex: 20 }}>
        {/* Search & Filter Control Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '1.75rem',
            boxShadow: '0 15px 35px -5px rgba(6, 127, 66, 0.08)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '2rem',
          }}
        >
          {/* Top Search Input */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative', flex: '1 1 320px' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)',
                }}
              />
              <input
                type="text"
                className="input-field"
                placeholder="Cari nama program studi, nomor SK, atau lembaga akreditasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.8rem', height: '48px', fontSize: '0.925rem' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-light)',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {(searchQuery || selectedJenjang !== 'Semua' || selectedPeringkat !== 'Semua' || selectedLembaga !== 'Semua') && (
              <button
                type="button"
                onClick={resetFilters}
                className="btn btn-outline"
                style={{ height: '48px', gap: '0.4rem', fontSize: '0.85rem' }}
              >
                <RotateCcw size={15} />
                <span>Reset Filter</span>
              </button>
            )}
          </div>

          {/* Filter Pills Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Filter Jenjang */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', minWidth: '80px' }}>
                Jenjang:
              </span>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                {[
                  { key: 'Semua', label: `Semua Jenjang (${AKREDITASI_DATA.length})` },
                  { key: 'D3', label: `Diploma Tiga / D3 (${totalD3})` },
                  { key: 'D4', label: `Sarjana Terapan / D4 (${totalD4})` },
                ].map((j) => (
                  <button
                    key={j.key}
                    type="button"
                    onClick={() => setSelectedJenjang(j.key)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.825rem',
                      fontWeight: selectedJenjang === j.key ? 700 : 500,
                      backgroundColor: selectedJenjang === j.key ? 'var(--usu-green)' : '#f8fafc',
                      color: selectedJenjang === j.key ? '#ffffff' : '#334155',
                      border: selectedJenjang === j.key ? '1px solid var(--usu-green)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    {j.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Peringkat Akreditasi */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', minWidth: '80px' }}>
                Peringkat:
              </span>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                {['Semua', 'Unggul', 'Baik Sekali', 'Baik'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPeringkat(p)}
                    style={{
                      padding: '0.35rem 0.8rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: selectedPeringkat === p ? 700 : 500,
                      backgroundColor: selectedPeringkat === p ? 'var(--usu-green-dark)' : '#f8fafc',
                      color: selectedPeringkat === p ? '#ffffff' : '#475569',
                      border: selectedPeringkat === p ? '1px solid var(--usu-green-dark)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    {p === 'Semua' ? 'Semua Peringkat' : p}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Lembaga Akreditasi */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', minWidth: '80px' }}>
                Lembaga:
              </span>
              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                {lembagaList.map((lem) => (
                  <button
                    key={lem}
                    type="button"
                    onClick={() => setSelectedLembaga(lem)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.775rem',
                      fontWeight: selectedLembaga === lem ? 700 : 500,
                      backgroundColor: selectedLembaga === lem ? '#034825' : '#f1f5f9',
                      color: selectedLembaga === lem ? '#ffffff' : '#475569',
                      border: selectedLembaga === lem ? '1px solid #034825' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                    }}
                  >
                    {lem}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Counter & Info Bar */}
        <div
          aria-live="polite"
          aria-atomic="true"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ fontSize: '0.925rem', color: 'var(--text-muted)' }}>
            Menampilkan <strong style={{ color: 'var(--usu-green-dark)' }}>{filteredData.length}</strong> dari{' '}
            <strong>{AKREDITASI_DATA.length}</strong> program studi terakreditasi
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={15} style={{ color: 'var(--usu-green)' }} />
            <span>Dokumen PDF resmi dapat langsung diunduh atau dipratinjau</span>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredData.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '1.35rem',
            }}
          >
            {filteredData.map((item) => {
              const isUnggul = item.peringkat.toLowerCase().includes('unggul');
              const isBaikSekali = item.peringkat.toLowerCase().includes('baik sekali');

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '1.45rem',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  className="template-card"
                >
                  <div>
                    {/* Header Badges */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.85rem',
                        gap: '0.5rem',
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: item.jenjang === 'D4' ? '#e0f2fe' : '#ecfdf3',
                          color: item.jenjang === 'D4' ? '#0369a1' : 'var(--usu-green-dark)',
                          border: item.jenjang === 'D4' ? '1px solid #bae6fd' : '1px solid rgba(6, 127, 66, 0.2)',
                          padding: '0.2rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.725rem',
                          fontWeight: 800,
                          letterSpacing: '0.03em',
                        }}
                      >
                        {item.jenjang === 'D4' ? 'SARJANA TERAPAN (D4)' : 'DIPLOMA TIGA (D3)'}
                      </span>

                      <span
                        style={{
                          backgroundColor: isUnggul
                            ? '#fef3c7'
                            : isBaikSekali
                            ? 'var(--usu-green-soft)'
                            : '#f1f5f9',
                          color: isUnggul
                            ? '#92400e'
                            : isBaikSekali
                            ? 'var(--usu-green-dark)'
                            : '#334155',
                          border: isUnggul
                            ? '1px solid #fde68a'
                            : isBaikSekali
                            ? '1px solid rgba(6, 127, 66, 0.25)'
                            : '1px solid #cbd5e1',
                          padding: '0.2rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.725rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <Award size={12} />
                        <span>{item.peringkat}</span>
                      </span>
                    </div>

                    {/* Program Studi Title */}
                    <h3
                      style={{
                        fontSize: '1.15rem',
                        color: 'var(--text-main)',
                        fontWeight: 800,
                        fontFamily: 'Outfit, sans-serif',
                        marginBottom: '0.65rem',
                        lineHeight: 1.35,
                      }}
                    >
                      {item.prodi}
                    </h3>

                    {/* Details List */}
                    <div
                      style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '10px',
                        padding: '0.85rem 1rem',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                        marginBottom: '1.25rem',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Lembaga Akreditasi:</span>
                        <strong style={{ color: 'var(--usu-green-dark)' }}>{item.lembaga}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <span>No. SK:</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)', textAlign: 'right', wordBreak: 'break-all' }}>
                          {item.noSk}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Masa Berlaku:</span>
                        <strong style={{ color: 'var(--text-main)' }}>{item.masaBerlaku}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem' }}>
                    <button
                      type="button"
                      onClick={() => setActivePdfPreview(item)}
                      className="btn btn-outline"
                      style={{
                        fontSize: '0.8rem',
                        padding: '0.55rem 0.75rem',
                        justifyContent: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <Eye size={14} />
                      <span>Pratinjau</span>
                    </button>

                    <a
                      href={item.fileUrl}
                      download={item.fileName}
                      className="btn btn-primary"
                      style={{
                        fontSize: '0.8rem',
                        padding: '0.55rem 0.75rem',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        textDecoration: 'none',
                      }}
                    >
                      <Download size={14} />
                      <span>Unduh PDF</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '3rem 2rem',
              textAlign: 'center',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <ShieldCheck size={48} style={{ color: 'var(--text-light)', margin: '0 auto 1rem' }} />
            <h4 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: '0.5rem' }}>
              Program Studi Tidak Ditemukan
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Tidak ada data akreditasi yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
            </p>
            <button type="button" onClick={resetFilters} className="btn btn-outline" style={{ margin: '0 auto' }}>
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* PDF PREVIEW MODAL */}
      {activePdfPreview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdf-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActivePdfPreview(null);
          }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '960px',
              height: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.15rem 1.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--usu-green-dark)',
                      backgroundColor: 'var(--usu-green-soft)',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                    }}
                  >
                    {activePdfPreview.lembaga}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Peringkat: {activePdfPreview.peringkat}
                  </span>
                </div>
                <h3
                  id="pdf-modal-title"
                  style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--usu-green-dark)', margin: 0 }}
                >
                  {activePdfPreview.prodi}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <a
                  href={activePdfPreview.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem', gap: '0.35rem' }}
                  title="Buka dokumen PDF di tab baru peramban"
                >
                  <ExternalLink size={14} />
                  <span>Tab Baru</span>
                </a>

                <a
                  href={activePdfPreview.fileUrl}
                  download={activePdfPreview.fileName}
                  className="btn btn-primary"
                  style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', gap: '0.35rem' }}
                >
                  <Download size={14} />
                  <span>Unduh (.pdf)</span>
                </a>

                <button
                  type="button"
                  onClick={() => setActivePdfPreview(null)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                  }}
                  aria-label="Tutup pratinjau"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal PDF Viewer Body */}
            <div style={{ flex: 1, backgroundColor: '#334155', position: 'relative' }}>
              <iframe
                src={`${activePdfPreview.fileUrl}#toolbar=1`}
                title={`Sertifikat Akreditasi ${activePdfPreview.prodi}`}
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

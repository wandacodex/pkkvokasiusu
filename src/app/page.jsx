'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText,
  GraduationCap,
  Award,
  Briefcase,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  Building2,
  TrendingUp,
  FileCheck,
  ChevronRight,
  Trophy,
  Medal,
  BookOpen,
  Calendar,
  ExternalLink
} from 'lucide-react';
import HeroBanner from '@/src/components/HeroBanner';
import { TEMPLATE_SURAT, INITIAL_PRESTASI } from '@/src/lib/mockData';

export default function HomePage() {
  const [stats, setStats] = useState({
    beasiswaCount: 3645,
    prestasiCount: 227,
    tracerCount: 520,
  });

  // Initial state uses latest authentic achievements (sorted by year descending)
  const initialLatestPrestasi = [...(INITIAL_PRESTASI || [])]
    .sort((a, b) => (b.tahun || 0) - (a.tahun || 0))
    .slice(0, 3);

  const [featuredPrestasi, setFeaturedPrestasi] = useState(initialLatestPrestasi);

  useEffect(() => {
    async function loadData() {
      try {
        await fetch('/api/seed');
        const [resBea, resPres, resTrc] = await Promise.all([
          fetch('/api/beasiswa').then(r => r.json()),
          fetch('/api/prestasi').then(r => r.json()),
          fetch('/api/tracer').then(r => r.json()),
        ]);

        if (resBea.success) {
          setStats(prev => ({ ...prev, beasiswaCount: resBea.total || prev.beasiswaCount }));
        }
        if (resPres.success && resPres.data) {
          setStats(prev => ({ ...prev, prestasiCount: resPres.total || prev.prestasiCount }));
          // Ensure synced with latest data: sort by year descending
          const sorted = [...resPres.data].sort((a, b) => (b.tahun || 0) - (a.tahun || 0));
          setFeaturedPrestasi(sorted.slice(0, 3));
        }
        if (resTrc.success) {
          setStats(prev => ({ ...prev, tracerCount: resTrc.total || prev.tracerCount }));
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    }

    loadData();
  }, []);

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      {/* Hero Banner GSAP with Institutional Highlights */}
      <HeroBanner />

      {/* SECTION 1: Koleksi Template Surat Permohonan Mahasiswa (Direct Redirect ke /surat) */}
      <section style={{ marginTop: '-2.5rem', position: 'relative', zIndex: 20 }}>
        <div className="container">
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '2.25rem',
              boxShadow: '0 20px 35px -10px rgba(6, 127, 66, 0.12)',
              border: '1px solid var(--border-subtle)',
              position: 'relative',
              overflow: 'hidden',
            }}
            className="ornament-card-gold-accent"
          >
            {/* Background Corner Static Watermark */}
            <div style={{ position: 'absolute', top: '-25px', right: '-25px', width: '150px', height: '150px', opacity: 0.07, pointerEvents: 'none' }}>
              <img src="/ornament/circular-tra.svg" alt="" style={{ width: '100%', height: '100%' }} />
            </div>

            {/* Header Showcase */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1.25rem',
                marginBottom: '1.75rem',
                paddingBottom: '1.35rem',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <div className="title-fill title-fill--gold" style={{ marginBottom: '0.4rem' }}>
                  <div className="title-fill__icon">
                    <img src="/ornament/flower-ora.svg" alt="" />
                  </div>
                  <span className="title-fill__text">Format Word (.docx) • 18 Berkas Resmi</span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.6rem)', color: 'var(--usu-green-dark)', fontWeight: 800, marginBottom: '0.25rem' }}>
                  Koleksi Template Surat Permohonan Mahasiswa
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Pilih keperluan administrasi akademik atau magang Anda untuk melihat persyaratan berkas dan mengunduh format surat resmi di halaman layanan surat.
                </p>
              </div>

              {/* Redirect Button ke /surat */}
              <Link
                href="/surat"
                className="btn btn-primary"
                style={{ fontSize: '0.875rem', padding: '0.65rem 1.25rem' }}
              >
                <span>Buka Layanan Surat</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Grid 4 Popular Templates (All redirect to /surat without download) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {TEMPLATE_SURAT.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    padding: '1.35rem',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'all 0.22s ease',
                  }}
                  className="template-card"
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                      <span className="badge badge-green" style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                        {item.kode}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>
                        {item.formatDokumen || '.DOCX'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1.25rem', lineHeight: 1.45, fontWeight: 700 }}>
                      {item.nama}
                    </h3>
                  </div>

                  {/* Redirect directly to /surat without direct download */}
                  <Link
                    href="/surat"
                    className="btn btn-outline"
                    style={{
                      width: '100%',
                      fontSize: '0.825rem',
                      padding: '0.6rem 0.85rem',
                      justifyContent: 'space-between',
                      backgroundColor: '#ffffff',
                      borderColor: 'rgba(6, 127, 66, 0.3)',
                      color: 'var(--usu-green-dark)',
                      fontWeight: 700,
                    }}
                  >
                    <span>Format & Persyaratan</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>

            {/* Subtle bottom redirect note */}
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px dashed var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                fontSize: '0.825rem',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} style={{ color: 'var(--usu-green)' }} />
                <span>Seluruh dokumen telah disesuaikan dengan format tata naskah dinas Fakultas Vokasi USU.</span>
              </div>
              <Link href="/surat" style={{ color: 'var(--usu-green)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>Lihat Seluruh 19 Template</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 4 Layanan Utama Kemahasiswaan PKK Vokasi USU */}
      <section className="section-padding" style={{ position: 'relative' }}>
        {/* Background Ornament Texture */}
        <div
          className="ornament-dot-grid"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.6,
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <div className="title-fill" style={{ marginBottom: '0.65rem' }}>
              <div className="title-fill__icon">
                <img src="/ornament/flower-sec2.svg" alt="" />
              </div>
              <span className="title-fill__text">Pilar Layanan Kemahasiswaan</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.35rem)', color: 'var(--usu-green-dark)', marginBottom: '0.85rem', fontWeight: 800 }}>
              Layanan Utama Mahasiswa & Alumni
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem', lineHeight: 1.65 }}>
              Akses cepat dan terintegrasi untuk kebutuhan administrasi akademik, beasiswa, rekognisi mahasiswa berprestasi, dan evaluasi capaian karir lulusan.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {/* Card 1: Surat Permohonan */}
            <div className="card ornament-card-gold-accent" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--usu-green-soft)',
                    color: 'var(--usu-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                    border: '1px solid rgba(6, 127, 66, 0.2)',
                  }}
                >
                  <FileText size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.55rem', color: 'var(--usu-green-dark)', fontWeight: 800 }}>
                  Surat Permohonan Mahasiswa
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Akses 10 format resmi template surat permohonan (.docx), verifikasi syarat dokumen, dan panduan pengajuan surat ke pimpinan fakultas.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-green)', flexShrink: 0 }} />
                    <span>Surat Izin Kuliah & Sakit</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-green)', flexShrink: 0 }} />
                    <span>Surat Magang & PKL Industri</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-green)', flexShrink: 0 }} />
                    <span>Rekomendasi Beasiswa & Penelitian</span>
                  </div>
                </div>
              </div>
              <Link href="/surat" className="btn btn-outline" style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>Buka Layanan Surat</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 2: Data Penerima Beasiswa */}
            <div className="card ornament-card-gold-accent" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--usu-gold-light)',
                    color: '#b45309',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                  }}
                >
                  <GraduationCap size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.55rem', color: 'var(--usu-green-dark)', fontWeight: 800 }}>
                  Data Penerima Beasiswa
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Direktori penerima beasiswa KIP Kuliah, Bank Indonesia, Yayasan Wook, ADik Afirmasi, BAZNAS, dan mitra beasiswa lainnya.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-green)', flexShrink: 0 }} />
                    <span>Filter 21 Program Studi & Skema</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-green)', flexShrink: 0 }} />
                    <span>Pencarian Cepat NIM & Mahasiswa</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-green)', flexShrink: 0 }} />
                    <span>Ekspor Data ke Format CSV</span>
                  </div>
                </div>
              </div>
              <Link href="/beasiswa" className="btn btn-outline" style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>Lihat Data Beasiswa</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 3: Mahasiswa Berprestasi */}
            <div className="card ornament-card-gold-accent" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: '#e6f7ee',
                    color: 'var(--usu-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                    border: '1px solid rgba(6, 127, 66, 0.25)',
                  }}
                >
                  <Award size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.55rem', color: 'var(--usu-green-dark)', fontWeight: 800 }}>
                  Mahasiswa Berprestasi
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Hall of Fame rekognisi capaian juara, medali, dan penghargaan mahasiswa vokasi di ajang Wilayah, Nasional, dan Internasional.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-green)', flexShrink: 0 }} />
                    <span>Showcase Capaian Juara & Medali</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-green)', flexShrink: 0 }} />
                    <span>Dosen Pembimbing & Penyelenggara</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-green)', flexShrink: 0 }} />
                    <span>Tampilan Fleksibel Kartu & Tabel</span>
                  </div>
                </div>
              </div>
              <Link href="/prestasi" className="btn btn-outline" style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>Jelajahi Prestasi</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 4: Tracer Study Alumni */}
            <div className="card ornament-card-gold-accent" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: '#e0f2fe',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                    border: '1px solid rgba(2, 132, 199, 0.25)',
                  }}
                >
                  <Briefcase size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.55rem', color: 'var(--usu-green-dark)', fontWeight: 800 }}>
                  Rekapitulasi Tracer Study
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Visualisasi analitik diagram garis penelusuran lulusan berdasarkan 5 kategori status baku untuk evaluasi relevansi kurikulum.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-green)', flexShrink: 0 }} />
                    <span>Diagram Garis Multi-Metrik Interaktif</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-green)', flexShrink: 0 }} />
                    <span>5 Kategori Baku Status Kelulusan</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-green)', flexShrink: 0 }} />
                    <span>Terhubung Survei SATU USU</span>
                  </div>
                </div>
              </div>
              <Link href="/tracer-study" className="btn btn-outline" style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>Analitik Tracer Study</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Torehan Prestasi Mahasiswa Vokasi (Tersync dengan Data Prestasi Terbaru 2025/2026) */}
      <section style={{ backgroundColor: '#f1f5f9', padding: '4.5rem 0', position: 'relative', borderTop: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
        {/* Static Background Watermark */}
        <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '220px', height: '220px', opacity: 0.05, pointerEvents: 'none' }}>
          <img src="/ornament/circular-tra.svg" alt="" style={{ width: '100%', height: '100%' }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2.5rem',
              gap: '1.25rem',
            }}
          >
            <div>
              <div className="title-fill title-fill--gold" style={{ marginBottom: '0.4rem' }}>
                <div className="title-fill__icon">
                  <img src="/ornament/flower-ora.svg" alt="" />
                </div>
                <span className="title-fill__text">Hall of Fame • Prestasi Mahasiswa Vokasi</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.2rem)', color: 'var(--usu-green-dark)', fontWeight: 800 }}>
                Torehan Prestasi Mahasiswa Vokasi
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Dedikasi dan rekam jejak capaian membanggakan mahasiswa Fakultas Vokasi USU dalam kompetisi terapan Wilayah, Nasional, dan Internasional.
              </p>
            </div>

            <Link href="/prestasi" className="btn btn-primary btn-sm">
              <span>Lihat Semua Prestasi</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Cards Showcase Prestasi Terbaru */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {featuredPrestasi.map((item) => (
              <div
                key={item.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  padding: 0,
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {/* Header Card Image with Overlay Badges */}
                <div style={{ position: 'relative', height: '190px', width: '100%', overflow: 'hidden', backgroundColor: 'var(--usu-green-deep)' }}>
                  <img
                    src={item.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                    alt={item.nama}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(6, 127, 66, 0.92)',
                      color: '#ffffff',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backdropFilter: 'blur(6px)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    }}
                  >
                    Tingkat {item.tingkat}
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(245, 158, 11, 0.95)',
                      color: '#1a1a1a',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      backdropFilter: 'blur(6px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    <Trophy size={14} style={{ color: '#034825' }} />
                    <span>{item.capaian}</span>
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      color: '#ffffff',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    Tahun {item.tahun}
                  </div>
                </div>

                {/* Body Content */}
                <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <BookOpen size={13} style={{ color: 'var(--usu-green)' }} />
                      <span>{item.prodi}</span>
                    </div>

                    <h3 style={{ fontSize: '1.075rem', marginBottom: '0.45rem', color: 'var(--text-main)', fontWeight: 800, lineHeight: 1.35 }}>
                      {item.nama}
                    </h3>

                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--usu-green)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                      {item.namaKompetisi}
                    </p>

                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                      {item.deskripsi?.length > 105 ? `${item.deskripsi.substring(0, 105)}...` : item.deskripsi}
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: '1.25rem',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: '0.775rem',
                      color: 'var(--text-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Pembimbing: <strong>{item.dosenPembimbing || 'Fakultas Vokasi USU'}</strong></span>
                    <Link href="/prestasi" style={{ color: 'var(--usu-green)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      <span>Detail</span>
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: 21 Program Studi Vokasi USU Enterprise Institutional Banner */}
      <section style={{ backgroundColor: 'var(--usu-green-deep)', color: '#ffffff', padding: '3.75rem 0', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.5,
            pointerEvents: 'none',
          }}
        />

        {/* Static Edge Watermark */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '240px', height: '240px', opacity: 0.08, pointerEvents: 'none' }}>
          <img src="/ornament/circular-tra.svg" alt="" style={{ width: '100%', height: '100%' }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ maxWidth: '680px' }}>
              <div className="title-fill title-fill--dark" style={{ marginBottom: '0.75rem' }}>
                <div className="title-fill__icon">
                  <img src="/ornament/circle-pri.svg" alt="" />
                </div>
                <span className="title-fill__text" style={{ color: '#fef08a' }}>Pendidikan Vokasi Unggul & Berdaya Saing</span>
              </div>

              <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.1rem)', color: '#ffffff', fontWeight: 800, fontFamily: 'Outfit, sans-serif', marginBottom: '0.5rem' }}>
                21 Program Studi Terapan Fakultas Vokasi USU
              </h2>

              <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.925rem', lineHeight: 1.65 }}>
                Terdiri dari 14 Program Diploma Tiga (D3) dan 7 Program Sarjana Terapan (D4) yang siap mencetak lulusan kompeten, tersertifikasi, dan adaptif terhadap industri modern.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href="https://vokasi.usu.ac.id/id"
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold"
                style={{ fontSize: '0.85rem' }}
              >
                <span>Portal Resmi Vokasi</span>
                <ExternalLink size={14} />
              </a>
              <Link
                href="/tracer-study"
                className="btn btn-outline-white"
                style={{ fontSize: '0.85rem' }}
              >
                <Briefcase size={14} />
                <span>Lihat Tracer Alumni</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

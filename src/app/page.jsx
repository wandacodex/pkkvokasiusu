'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  ExternalLink,
  Bell,
  Clock,
  MapPin,
  Layers,
  Download
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

  // Factual Announcements and Academic Agenda (from DESIGN.md Section 15 & Kalender Akademik)
  const announcements = [
    {
      id: 'ann-1',
      kategori: 'Administrasi',
      tanggal: '18 September 2026',
      judul: 'Penerbitan Surat Rekomendasi Bebas Pustaka & Toga Wisuda Periode I T.A. 2026/2027',
      ringkasan: 'Mahasiswa calon wisudawan diharapkan mengunggah berkas bebas pinjaman perpustakaan dan bukti serah terima Tugas Akhir melalui portal layanan persuratan.',
      link: '/surat'
    },
    {
      id: 'ann-2',
      kategori: 'Beasiswa',
      tanggal: '12 September 2026',
      judul: 'Verifikasi Berkas Mahasiswa Penerima Beasiswa Bank Indonesia & KIP Kuliah',
      ringkasan: 'Pemeriksaan berkas administrasi dan pelaporan IPK semester berjalan bagi seluruh mahasiswa penerima beasiswa aktif di lingkungan Fakultas Vokasi.',
      link: '/beasiswa'
    },
    {
      id: 'ann-3',
      kategori: 'Tracer Study',
      tanggal: '05 September 2026',
      judul: 'Sosialisasi Pengisian Kuesioner Penelusuran Lulusan (Tracer Study) Alumni 2025',
      ringkasan: 'Seluruh lulusan tahun 2025 diimbau berpartisipasi dalam pemutakhiran data transisi karir untuk mendukung rekognisi akreditasi program studi.',
      link: '/tracer-study'
    }
  ];

  const academicAgenda = [
    {
      id: 'ev-1',
      hari: '28',
      bulan: 'SEP',
      tahun: '2026',
      judul: 'Batas Akhir Pengajuan Surat Cuti Akademik (PKA) Semester Ganjil',
      waktu: '08.00 - 15.00 WIB',
      tempat: 'Subbagian PKK Gedung Vokasi USU',
      status: 'Akan Datang'
    },
    {
      id: 'ev-2',
      hari: '05',
      bulan: 'OKT',
      tahun: '2026',
      judul: 'Pelaksanaan Ujian Tengah Semester (UTS) Gasal T.A. 2026/2027',
      waktu: 'Sesuai Jadwal Perkuliahan',
      tempat: 'Ruang Kuliah & Lab Komputer',
      status: 'Akan Datang'
    },
    {
      id: 'ev-3',
      hari: '14',
      bulan: 'OKT',
      tahun: '2026',
      judul: 'Sidang Yudisium & Verifikasi Naskah Tugas Akhir Gelombang II',
      waktu: '09.00 - 16.00 WIB',
      tempat: 'Aula Fakultas Vokasi USU',
      status: 'Akan Datang'
    }
  ];

  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      {/* Hero Banner GSAP with Institutional Highlights & Authentic Photos */}
      <HeroBanner />

      {/* SECTION 1: Koleksi Format Baku Surat Permohonan Mahasiswa (DESIGN.md Section 12 & 30 A) */}
      <section style={{ marginTop: '-2.5rem', position: 'relative', zIndex: 20 }}>
        <div className="container">
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--usu-radius-control)',
              padding: '2.25rem',
              boxShadow: 'var(--usu-shadow-menu)',
              border: '1px solid var(--usu-border)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background Corner Subtle Watermark */}
            <div style={{ position: 'absolute', top: '-25px', right: '-25px', width: '150px', height: '150px', opacity: 0.05, pointerEvents: 'none' }}>
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
                paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--usu-border)',
              }}
            >
              <div>
                <div className="title-fill title-fill--gold" style={{ marginBottom: '0.4rem' }}>
                  <div className="title-fill__icon">
                    <img src="/ornament/flower-ora.svg" alt="" />
                  </div>
                  <span className="title-fill__text">Format Baku Word (.docx) • 19 Berkas Resmi</span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)', color: 'var(--usu-brand)', fontWeight: 700, marginBottom: '0.35rem' }}>
                  Koleksi Template Surat Permohonan Mahasiswa
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--usu-text-secondary)', margin: 0, maxWidth: '68ch' }}>
                  Pilih keperluan administrasi akademik atau magang Anda untuk mengisi formulir daring terstruktur dan mengunduh format surat resmi langsung di halaman layanan surat.
                </p>
              </div>

              {/* Redirect Button ke /surat */}
              <Link
                href="/surat"
                className="usu-button usu-button--primary"
                style={{ fontSize: '0.85rem', textDecoration: 'none' }}
              >
                <span>Buka Layanan Surat</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Grid 4 Popular Templates */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
              {TEMPLATE_SURAT.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: 'var(--usu-surface-muted)',
                    borderRadius: 'var(--usu-radius-control)',
                    padding: '1.35rem',
                    border: '1px solid var(--usu-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          backgroundColor: 'var(--usu-surface)',
                          color: 'var(--usu-brand)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--usu-radius-control)',
                          border: '1px solid var(--usu-border)'
                        }}
                      >
                        {item.kode}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--usu-text-secondary)', fontWeight: 600 }}>
                        {item.formatDokumen || '.DOCX'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '0.95rem', color: 'var(--usu-text)', marginBottom: '1.25rem', lineHeight: 1.45, fontWeight: 700 }}>
                      {item.nama}
                    </h3>
                  </div>

                  <Link
                    href="/surat"
                    className="usu-button usu-button--secondary"
                    style={{
                      width: '100%',
                      fontSize: '0.82rem',
                      padding: '0.55rem 0.85rem',
                      justifyContent: 'space-between',
                      textDecoration: 'none',
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
                borderTop: '1px dashed var(--usu-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                fontSize: '0.825rem',
                color: 'var(--usu-text-secondary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} style={{ color: 'var(--usu-brand)' }} />
                <span>Seluruh dokumen telah disesuaikan dengan format tata naskah dinas baku Fakultas Vokasi USU.</span>
              </div>
              <Link href="/surat" style={{ color: 'var(--usu-brand)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>Lihat Seluruh 19 Template</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 4 Pilar Layanan Mahasiswa & Alumni (DESIGN.md Section 10 & 16) */}
      <section className="section-padding" style={{ position: 'relative' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
            <div className="title-fill" style={{ marginBottom: '0.65rem' }}>
              <div className="title-fill__icon">
                <img src="/ornament/flower-sec2.svg" alt="" />
              </div>
              <span className="title-fill__text">Pilar Layanan Terpadu</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', color: 'var(--usu-brand)', marginBottom: '0.85rem', fontWeight: 700 }}>
              Layanan Utama Mahasiswa & Alumni
            </h2>
            <p style={{ color: 'var(--usu-text-secondary)', fontSize: '0.95rem', lineHeight: 1.65 }}>
              Akses cepat dan terintegrasi untuk kebutuhan administrasi akademik, direktori beasiswa, rekognisi mahasiswa berprestasi, dan evaluasi capaian karir lulusan.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {/* Card 1: Surat Permohonan */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--usu-border)',
                borderRadius: 'var(--usu-radius-control)',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--usu-radius-control)',
                    backgroundColor: 'var(--usu-surface)',
                    color: 'var(--usu-brand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                    border: '1px solid var(--usu-border)',
                  }}
                >
                  <FileText size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.55rem', color: 'var(--usu-brand)', fontWeight: 700 }}>
                  Surat Permohonan Mahasiswa
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--usu-text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Akses 19 format resmi template surat permohonan (.docx), verifikasi syarat dokumen, dan panduan pengajuan surat ke pimpinan fakultas.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--usu-text)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-brand)', flexShrink: 0 }} />
                    <span>Surat Izin Kuliah & Magang Industri</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-brand)', flexShrink: 0 }} />
                    <span>Surat Bebas Administrasi & Ujian TA</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-brand)', flexShrink: 0 }} />
                    <span>Rekomendasi Beasiswa & Penelitian</span>
                  </div>
                </div>
              </div>
              <Link href="/surat" className="usu-button usu-button--secondary" style={{ width: '100%', justifyContent: 'space-between', textDecoration: 'none' }}>
                <span>Buka Layanan Surat</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Card 2: Data Penerima Beasiswa */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--usu-border)',
                borderRadius: 'var(--usu-radius-control)',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--usu-radius-control)',
                    backgroundColor: 'var(--usu-warning-surface)',
                    color: 'var(--usu-warning)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                    border: '1px solid rgba(255, 198, 0, 0.4)',
                  }}
                >
                  <GraduationCap size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.55rem', color: 'var(--usu-brand)', fontWeight: 700 }}>
                  Data Penerima Beasiswa
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--usu-text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Direktori penerima beasiswa KIP Kuliah, Bank Indonesia, Yayasan Wook, ADik Afirmasi, BAZNAS, dan mitra beasiswa terverifikasi.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--usu-text)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-brand)', flexShrink: 0 }} />
                    <span>Filter 21 Program Studi & Skema</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-brand)', flexShrink: 0 }} />
                    <span>Pencarian Cepat NIM & Mahasiswa</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-brand)', flexShrink: 0 }} />
                    <span>Ekspor Data ke Format CSV & Excel</span>
                  </div>
                </div>
              </div>
              <Link href="/beasiswa" className="usu-button usu-button--secondary" style={{ width: '100%', justifyContent: 'space-between', textDecoration: 'none' }}>
                <span>Lihat Data Beasiswa</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Card 3: Mahasiswa Berprestasi */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--usu-border)',
                borderRadius: 'var(--usu-radius-control)',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--usu-radius-control)',
                    backgroundColor: 'var(--usu-surface)',
                    color: 'var(--usu-brand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                    border: '1px solid var(--usu-border)',
                  }}
                >
                  <Award size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.55rem', color: 'var(--usu-brand)', fontWeight: 700 }}>
                  Mahasiswa Berprestasi
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--usu-text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Hall of Fame rekognisi capaian juara, medali, dan penghargaan mahasiswa vokasi di ajang Wilayah, Nasional, dan Internasional.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--usu-text)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-brand)', flexShrink: 0 }} />
                    <span>Showcase Capaian Juara & Medali</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-brand)', flexShrink: 0 }} />
                    <span>Dosen Pembimbing & Penyelenggara</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-brand)', flexShrink: 0 }} />
                    <span>Tampilan Fleksibel Kartu & Tabel</span>
                  </div>
                </div>
              </div>
              <Link href="/prestasi" className="usu-button usu-button--secondary" style={{ width: '100%', justifyContent: 'space-between', textDecoration: 'none' }}>
                <span>Jelajahi Prestasi</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Card 4: Tracer Study Alumni */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--usu-border)',
                borderRadius: 'var(--usu-radius-control)',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--usu-radius-control)',
                    backgroundColor: 'var(--usu-info-surface)',
                    color: 'var(--usu-info)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                    border: '1px solid var(--usu-border)',
                  }}
                >
                  <Briefcase size={22} />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.55rem', color: 'var(--usu-brand)', fontWeight: 700 }}>
                  Rekapitulasi Tracer Study
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--usu-text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Visualisasi analitik diagram garis penelusuran lulusan berdasarkan 5 kategori status baku untuk evaluasi relevansi kurikulum.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--usu-text)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-brand)', flexShrink: 0 }} />
                    <span>Diagram Garis Multi-Metrik Interaktif</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-brand)', flexShrink: 0 }} />
                    <span>5 Kategori Baku Status Kelulusan</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--usu-brand)', flexShrink: 0 }} />
                    <span>Terhubung Survei SATU USU</span>
                  </div>
                </div>
              </div>
              <Link href="/tracer-study" className="usu-button usu-button--secondary" style={{ width: '100%', justifyContent: 'space-between', textDecoration: 'none' }}>
                <span>Analitik Tracer Study</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Pengumuman Terkini & Agenda Akademik (DESIGN.md Section 15 & 30 A) */}
      <section style={{ backgroundColor: 'var(--usu-surface)', padding: '4rem 0', borderTop: '1px solid var(--usu-border)', borderBottom: '1px solid var(--usu-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            
            {/* Kolom Kiri: Pengumuman Terkini PKK */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Bell size={18} style={{ color: 'var(--usu-brand)' }} />
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--usu-brand)', margin: 0 }}>
                      Pengumuman Terkini
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--usu-text-secondary)', margin: 0 }}>
                    Informasi resmi administrasi persuratan dan beasiswa mahasiswa
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--usu-border)',
                      borderRadius: 'var(--usu-radius-control)',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                      <span
                        style={{
                          backgroundColor: 'var(--usu-surface)',
                          color: 'var(--usu-brand)',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--usu-radius-control)',
                          border: '1px solid var(--usu-border)',
                        }}
                      >
                        {ann.kategori}
                      </span>
                      <span style={{ color: 'var(--usu-text-secondary)' }}>{ann.tanggal}</span>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--usu-text)', lineHeight: 1.4, margin: 0 }}>
                      {ann.judul}
                    </h4>

                    <p style={{ fontSize: '0.825rem', color: 'var(--usu-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      {ann.ringkasan}
                    </p>

                    <div style={{ marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--usu-border)' }}>
                      <Link
                        href={ann.link}
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--usu-brand)',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          textDecoration: 'none',
                        }}
                      >
                        <span>Lihat Petunjuk Berkas</span>
                        <ChevronRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kolom Kanan: Agenda & Kalender Akademik */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <Calendar size={18} style={{ color: 'var(--usu-brand)' }} />
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--usu-brand)', margin: 0 }}>
                      Agenda & Kalender Akademik
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--usu-text-secondary)', margin: 0 }}>
                    Jadwal kegiatan akademik resmi Fakultas Vokasi USU
                  </p>
                </div>
                <Link
                  href="/kalender-akademik"
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--usu-brand)',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    textDecoration: 'none',
                  }}
                >
                  <span>Selengkapnya</span>
                  <ChevronRight size={14} />
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {academicAgenda.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--usu-border)',
                      borderRadius: 'var(--usu-radius-control)',
                      padding: '1.15rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                    }}
                  >
                    {/* Date Block with Accent Yellow (from DESIGN.md Section 15) */}
                    <div
                      style={{
                        backgroundColor: 'var(--usu-accent)',
                        color: 'var(--usu-on-accent)',
                        borderRadius: 'var(--usu-radius-control)',
                        padding: '0.65rem 0.75rem',
                        textAlign: 'center',
                        minWidth: '58px',
                        flexShrink: 0,
                        border: '1px solid rgba(122, 75, 0, 0.2)',
                      }}
                    >
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, lineHeight: 1 }}>{ev.hari}</div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px' }}>
                        {ev.bulan}
                      </div>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: 'var(--usu-brand)',
                            backgroundColor: 'var(--usu-surface)',
                            padding: '0.15rem 0.45rem',
                            borderRadius: 'var(--usu-radius-control)',
                            border: '1px solid var(--usu-border)',
                          }}
                        >
                          {ev.status}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--usu-text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={12} />
                          {ev.waktu}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--usu-text)', lineHeight: 1.4, margin: '0 0 0.35rem' }}>
                        {ev.judul}
                      </h4>

                      <div style={{ fontSize: '0.78rem', color: 'var(--usu-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} style={{ color: 'var(--usu-brand)' }} />
                        <span>{ev.tempat}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Callout box towards full calendar */}
              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.85rem 1rem',
                  backgroundColor: '#ffffff',
                  border: '1px dashed var(--usu-border)',
                  borderRadius: 'var(--usu-radius-control)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.825rem',
                }}
              >
                <span style={{ color: 'var(--usu-text-secondary)' }}>
                  Memerlukan jadwal lengkap semester gasal/genap?
                </span>
                <Link
                  href="/kalender-akademik"
                  style={{ color: 'var(--usu-brand)', fontWeight: 700, textDecoration: 'none' }}
                >
                  Buka Kalender Akademik →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: Torehan Prestasi Mahasiswa Vokasi (DESIGN.md Section 13 & 30 A) */}
      <section style={{ backgroundColor: '#ffffff', padding: '4.5rem 0', position: 'relative' }}>
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
              <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', color: 'var(--usu-brand)', fontWeight: 700 }}>
                Torehan Prestasi Mahasiswa Vokasi
              </h2>
              <p style={{ color: 'var(--usu-text-secondary)', fontSize: '0.95rem', margin: 0, maxWidth: '68ch' }}>
                Dedikasi dan rekam jejak capaian membanggakan mahasiswa Fakultas Vokasi USU dalam kompetisi terapan Wilayah, Nasional, dan Internasional.
              </p>
            </div>

            <Link href="/prestasi" className="usu-button usu-button--primary" style={{ fontSize: '0.85rem', textDecoration: 'none' }}>
              <span>Lihat Semua Prestasi</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Cards Showcase Prestasi Terbaru */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {featuredPrestasi.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  borderRadius: 'var(--usu-radius-control)',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--usu-border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {/* Header Card Image with Overlay Badges */}
                <div style={{ position: 'relative', height: '190px', width: '100%', overflow: 'hidden', backgroundColor: 'var(--usu-brand-deep)' }}>
                  <img
                    src={item.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                    alt={item.nama}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(0, 105, 55, 0.95)',
                      color: '#ffffff',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--usu-radius-control)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    Tingkat {item.tingkat}
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      backgroundColor: 'var(--usu-accent)',
                      color: 'var(--usu-on-accent)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--usu-radius-control)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    }}
                  >
                    <Trophy size={13} style={{ color: 'var(--usu-on-accent)' }} />
                    <span>{item.capaian}</span>
                  </div>

                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(24, 37, 30, 0.85)',
                      color: '#ffffff',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--usu-radius-control)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                    }}
                  >
                    Tahun {item.tahun}
                  </div>
                </div>

                {/* Body Content */}
                <div style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--usu-text-secondary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <BookOpen size={13} style={{ color: 'var(--usu-brand)' }} />
                      <span>{item.prodi}</span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.45rem', color: 'var(--usu-text)', fontWeight: 700, lineHeight: 1.35 }}>
                      {item.nama}
                    </h3>

                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--usu-brand)', marginBottom: '0.5rem', lineHeight: 1.4 }}>
                      {item.namaKompetisi}
                    </p>

                    <p style={{ fontSize: '0.825rem', color: 'var(--usu-text-secondary)', lineHeight: 1.55 }}>
                      {item.deskripsi?.length > 105 ? `${item.deskripsi.substring(0, 105)}...` : item.deskripsi}
                    </p>
                  </div>

                  <div
                    style={{
                      marginTop: '1.25rem',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid var(--usu-border)',
                      fontSize: '0.775rem',
                      color: 'var(--usu-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>Pembimbing: <strong>{item.dosenPembimbing || 'Fakultas Vokasi USU'}</strong></span>
                    <Link href="/prestasi" style={{ color: 'var(--usu-brand)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '2px', textDecoration: 'none' }}>
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

      {/* SECTION 5: 21 Program Studi Vokasi & Fasilitas Terapan (DESIGN.md Section 16 & 17) */}
      <section style={{ backgroundColor: 'var(--usu-brand-deep)', color: '#ffffff', padding: '3.75rem 0', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255, 198, 0, 0.1) 1px, transparent 1px)',
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
                <span className="title-fill__text" style={{ color: '#fff5d6' }}>Pendidikan Vokasi Unggul & Berdaya Saing</span>
              </div>

              <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.1rem)', color: '#ffffff', fontWeight: 700, marginBottom: '0.5rem' }}>
                21 Program Studi Terapan Fakultas Vokasi USU
              </h2>

              <p style={{ color: '#e0ebe4', fontSize: '0.925rem', lineHeight: 1.65 }}>
                Terdiri dari 14 Program Diploma Tiga (D3) dan 7 Program Sarjana Terapan (D4) yang siap mencetak lulusan kompeten, tersertifikasi, dan adaptif terhadap industri modern dengan fasilitas CodeStudio, laboratorium komputer, dan gedung aula terpadu.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href="https://vokasi.usu.ac.id/id"
                target="_blank"
                rel="noreferrer"
                className="usu-button usu-button--accent"
                style={{ fontSize: '0.85rem', textDecoration: 'none' }}
              >
                <span>Portal Resmi Vokasi</span>
                <ExternalLink size={14} />
              </a>
              <Link
                href="/tracer-study"
                className="usu-button usu-button--secondary"
                style={{ fontSize: '0.85rem', textDecoration: 'none' }}
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

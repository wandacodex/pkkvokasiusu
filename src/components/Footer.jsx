'use client';

import Link from 'next/link';
import {
  MapPin,
  Mail,
  ExternalLink,
  GraduationCap,
  FileText,
  Award,
  Briefcase,
  BookOpen,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function Footer() {
  const d3Prodi = [
    'D3 Akuntansi',
    'D3 Kesekretariatan',
    'D3 Keuangan',
    'D3 Analis Farmasi dan Makanan',
    'D3 Perpajakan',
    'D3 Bahasa Inggris',
    'D3 Bahasa Jepang',
    'D3 Perpustakaan',
    'D3 Perjalanan Wisata',
    'D3 Fisika',
    'D3 Kimia',
    'D3 Teknik Informatika',
    'D3 Metrologi dan Instrumentasi',
    'D3 Statistika',
  ];

  const d4Prodi = [
    'D4 Perbankan dan Keuangan',
    'D4 Administrasi Perkantoran Digital',
    'D4 Akuntansi Sektor Publik',
    'D4 Statistika',
    'D4 Kimia Terapan',
    'D4 Manajemen Bisnis Pariwisata',
    'D4 Teknologi Rekayasa dan Instrumentasi',
  ];

  return (
    <footer style={{ backgroundColor: 'var(--usu-green-deep)', color: '#ffffff', borderTop: '3px solid var(--usu-gold)', position: 'relative', overflow: 'hidden' }}>
      {/* Top Banner Quick Bar */}
      <div style={{ backgroundColor: 'var(--usu-green-dark)', padding: '1.75rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle Static Watermark */}
        <div style={{ position: 'absolute', right: '-20px', top: '-25px', pointerEvents: 'none', opacity: 0.08, zIndex: 1 }}>
          <img src="/ornament/flower-ora.svg" alt="" style={{ width: '120px', height: '120px' }} />
        </div>

        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Sparkles size={16} style={{ color: 'var(--usu-gold)' }} />
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800, margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                Pendidikan, Kemahasiswaan, dan Kealumnian (PKK)
              </h3>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.85rem', margin: 0 }}>
              Fakultas Vokasi Universitas Sumatera Utara • Layanan Administrasi Terpadu Mahasiswa & Alumni
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href="/surat" className="btn btn-gold btn-sm">
              <FileText size={14} />
              <span>Surat Permohonan Mahasiswa</span>
            </Link>
            <Link href="/beasiswa" className="btn btn-outline-white btn-sm">
              <GraduationCap size={14} />
              <span>Data Penerima Beasiswa</span>
            </Link>
            <Link href="/tracer-study" className="btn btn-outline-white btn-sm">
              <Briefcase size={14} />
              <span>Rekapitulasi Tracer Study</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content: 3 Primary Balanced Columns */}
      <div className="container" style={{ padding: '3.5rem 1.25rem 2.5rem', position: 'relative' }}>
        {/* Subtle Static Watermark in background of footer */}
        <div style={{ position: 'absolute', right: '-20px', bottom: '20px', pointerEvents: 'none', opacity: 0.04, zIndex: 1 }}>
          <img src="/ornament/circular-tra.svg" alt="" style={{ width: '260px', height: '260px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'start', position: 'relative', zIndex: 2 }}>
          
          {/* Kolom 1: Profil & Informasi Kontak */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  padding: '5px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  border: '1.5px solid #F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                }}
              >
                <img
                  src="/assets/mainlogo.webp"
                  alt="Logo USU"
                  style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
                />
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#fde047', fontWeight: 700, letterSpacing: '0.06em' }}>
                  UNIVERSITAS SUMATERA UTARA
                </div>
                <h4 style={{ color: '#ffffff', fontSize: '1.15rem', fontWeight: 800, margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                  FAKULTAS VOKASI
                </h4>
              </div>
            </div>

            <p style={{ color: 'rgba(255, 255, 255, 0.78)', fontSize: '0.85rem', lineHeight: '1.65', marginBottom: '1.5rem' }}>
              Unit Layanan Pendidikan, Kemahasiswaan, dan Kealumnian (PKK) Fakultas Vokasi USU memfasilitasi kebutuhan administrasi surat-menyurat mahasiswa, publikasi beasiswa, capaian prestasi, serta rekapitulasi penelusuran lulusan.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <MapPin size={17} style={{ color: 'var(--usu-gold)', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ lineHeight: 1.5 }}>
                  Jalan Bioteknologi No.2, Kampus USU Medan, 20155
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Mail size={16} style={{ color: 'var(--usu-gold)', flexShrink: 0 }} />
                <span>vokasi@usu.ac.id</span>
              </div>
            </div>
          </div>

          {/* Kolom 2: Layanan Kemahasiswaan Terpadu */}
          <div>
            <h4 style={{ color: 'var(--usu-gold)', fontSize: '0.95rem', fontWeight: 800, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Layanan Kemahasiswaan
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', padding: 0, margin: 0 }}>
              <li>
                <Link href="/surat" style={{ color: 'rgba(255, 255, 255, 0.82)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }} className="footer-link">
                  <FileText size={15} style={{ color: 'var(--usu-gold)', flexShrink: 0 }} />
                  <span>Surat Permohonan Mahasiswa</span>
                </Link>
              </li>
              <li>
                <Link href="/beasiswa" style={{ color: 'rgba(255, 255, 255, 0.82)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }} className="footer-link">
                  <GraduationCap size={15} style={{ color: 'var(--usu-gold)', flexShrink: 0 }} />
                  <span>Informasi & Data Penerima Beasiswa</span>
                </Link>
              </li>
              <li>
                <Link href="/prestasi" style={{ color: 'rgba(255, 255, 255, 0.82)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }} className="footer-link">
                  <Award size={15} style={{ color: 'var(--usu-gold)', flexShrink: 0 }} />
                  <span>Direktori Mahasiswa Berprestasi</span>
                </Link>
              </li>
              <li>
                <Link href="/tracer-study" style={{ color: 'rgba(255, 255, 255, 0.82)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }} className="footer-link">
                  <Briefcase size={15} style={{ color: 'var(--usu-gold)', flexShrink: 0 }} />
                  <span>Rekapitulasi Tracer Study</span>
                </Link>
              </li>
              <li>
                <Link href="/akreditasi" style={{ color: 'rgba(255, 255, 255, 0.82)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }} className="footer-link">
                  <ShieldCheck size={15} style={{ color: 'var(--usu-gold)', flexShrink: 0 }} />
                  <span>Sertifikat Akreditasi 21 Prodi</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Ekosistem USU */}
          <div>
            <h4 style={{ color: 'var(--usu-gold)', fontSize: '0.95rem', fontWeight: 800, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Portal Ekosistem USU
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', padding: 0, margin: 0 }}>
              <li>
                <a href="https://vokasi.usu.ac.id/id" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255, 255, 255, 0.82)' }} className="footer-link">
                  <span>Website Fakultas Vokasi USU</span>
                  <ExternalLink size={13} style={{ color: 'var(--usu-gold)' }} />
                </a>
              </li>
              <li>
                <a href="https://usu.ac.id/id" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255, 255, 255, 0.82)' }} className="footer-link">
                  <span>Universitas Sumatera Utara</span>
                  <ExternalLink size={13} style={{ color: 'var(--usu-gold)' }} />
                </a>
              </li>
              <li>
                <a href="https://satu.usu.ac.id" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255, 255, 255, 0.82)' }} className="footer-link">
                  <span>Portal SATU USU</span>
                  <ExternalLink size={13} style={{ color: 'var(--usu-gold)' }} />
                </a>
              </li>
              <li>
                <a href="https://library.usu.ac.id" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255, 255, 255, 0.82)' }} className="footer-link">
                  <span>Perpustakaan USU</span>
                  <ExternalLink size={13} style={{ color: 'var(--usu-gold)' }} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Dedicated Structured Section: 21 Program Studi Fakultas Vokasi USU */}
        <div
          style={{
            marginTop: '3.5rem',
            paddingTop: '2.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <BookOpen size={18} style={{ color: 'var(--usu-gold)' }} />
              <h4 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 800, margin: 0, letterSpacing: '0.02em', fontFamily: 'Outfit, sans-serif' }}>
                Program Studi Fakultas Vokasi USU
              </h4>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#fef08a',
                backgroundColor: 'rgba(245, 158, 11, 0.18)',
                padding: '0.3rem 0.75rem',
                borderRadius: '999px',
                border: '1px solid rgba(245, 158, 11, 0.35)',
              }}
            >
              21 Program Studi Terdaftar
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* Sub-panel D3: Program Diploma Tiga (14 Prodi) */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: '1.5rem',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.65rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h5 style={{ color: 'var(--usu-gold)', fontSize: '0.9rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Program Diploma Tiga (D3)
                </h5>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>14 Program Studi</span>
              </div>

              <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.55rem 1rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)', padding: 0, margin: 0 }}>
                {d3Prodi.map((prodi, idx) => (
                  <li key={idx} style={{ lineHeight: 1.35, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--usu-gold)', flexShrink: 0 }} />
                    <span style={{ transition: 'color 0.2s' }}>{prodi}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sub-panel D4: Program Sarjana Terapan (7 Prodi) */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                padding: '1.5rem',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.65rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h5 style={{ color: 'var(--usu-gold)', fontSize: '0.9rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Program Sarjana Terapan (D4)
                </h5>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>7 Program Studi</span>
              </div>

              <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.65rem 1rem', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)', padding: 0, margin: 0 }}>
                {d4Prodi.map((prodi, idx) => (
                  <li key={idx} style={{ lineHeight: 1.35, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--usu-gold)', flexShrink: 0 }} />
                    <span style={{ transition: 'color 0.2s' }}>{prodi}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip by Wanda Codex */}
      <div style={{ backgroundColor: '#022212', padding: '1.35rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.7)' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            © {new Date().getFullYear()} PKK Fakultas Vokasi Universitas Sumatera Utara. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <span>Portal Resmi Vokasi USU • Crafted & Engineered by</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#fef08a',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px',
                fontWeight: 800,
                letterSpacing: '0.04em',
              }}
            >
              <Sparkles size={12} style={{ color: 'var(--usu-gold)' }} />
              <span>Wanda Codex</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

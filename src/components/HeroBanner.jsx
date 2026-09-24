'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import {
  FileText,
  GraduationCap,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function HeroBanner() {
  const heroRef = useRef(null);
  const leftColRef = useRef(null);
  const bentoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(leftColRef.current, {
        x: -30,
        opacity: 0,
        duration: 0.8,
      });

      if (bentoRef.current && typeof window !== 'undefined' && window.innerWidth >= 992) {
        tl.from(bentoRef.current, {
          x: 30,
          opacity: 0,
          duration: 0.8,
        }, '-=0.5');
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const institutionalHighlights = [
    { label: '19 Format Baku', desc: 'Word (.docx) Resmi', icon: FileText },
    { label: '3.645+ Penerima', desc: 'Direktori Beasiswa', icon: GraduationCap },
    { label: '227+ Prestasi', desc: 'Kompetisi Terverifikasi', icon: Award },
    { label: '21 Program Studi', desc: '14 D3 & 7 D4 Terapan', icon: BookOpen },
  ];

  return (
    <section
      ref={heroRef}
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, var(--usu-brand-deep) 0%, #004423 45%, var(--usu-brand) 100%)',
        color: '#ffffff',
        overflow: 'hidden',
        paddingTop: '3.5rem',
        paddingBottom: '4.5rem',
        borderBottom: '4px solid var(--usu-accent)'
      }}
    >
      {/* Background Subtle Institutional Grid Watermark */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.65,
          pointerEvents: 'none',
        }}
      />

      {/* Static Authentic Bottom Wave Watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: '-30px',
          left: 0,
          right: 0,
          height: '140px',
          backgroundImage: 'url(/ornament/circular-tra.svg)',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom center',
          backgroundSize: '240px 240px',
          opacity: 0.07,
          pointerEvents: 'none',
        }}
      />

      {/* Official USU Seal Watermark */}
      <div className="hero-seal-watermark">
        <img
          src="/assets/mainlogo.webp"
          alt="Lambang Universitas Sumatera Utara"
        />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="hero-grid-layout">
          {/* LEFT COLUMN: Brand Identity, Title, Motto & Highlights */}
          <div ref={leftColRef} className="hero-left-column">
            {/* Signature Title Fill Badge (Matching vokasi.usu.ac.id) */}
            <div className="title-fill title-fill--dark" style={{ marginBottom: '1.25rem' }}>
              <div className="title-fill__icon">
                <img src="/ornament/flower-ora.svg" alt="Vokasi USU" />
              </div>
              <span className="title-fill__text" style={{ color: '#fff5d6', fontWeight: 600 }}>
                Fakultas Vokasi • Universitas Sumatera Utara
              </span>
            </div>

            {/* Main Portal Title */}
            <h1
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                lineHeight: 'var(--usu-leading-heading)',
                fontWeight: 700,
                fontFamily: 'var(--usu-font)',
                marginBottom: '0.85rem',
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              Pendidikan, Kemahasiswaan, & Kealumnian
            </h1>

            {/* Official Vokasi Motto Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255, 198, 0, 0.15)',
                border: '1px solid rgba(255, 198, 0, 0.4)',
                color: '#ffc600',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--usu-radius-control)',
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
                fontStyle: 'italic',
              }}
            >
              <span>&ldquo;Ahli Berkarya, Siap Menginspirasi&rdquo;</span>
            </div>

            {/* Slogan & Description */}
            <p
              style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 'var(--usu-leading-body)',
                marginBottom: '1.75rem',
                fontWeight: 400,
                maxWidth: '62ch',
              }}
            >
              Portal layanan resmi terpadu Fakultas Vokasi USU untuk pengunduhan template surat permohonan mahasiswa, penelusuran direktori beasiswa, rekognisi torehan prestasi mahasiswa, serta diagram penelusuran lulusan (tracer study).
            </p>

            {/* Call To Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '2.25rem' }}>
              <Link
                href="/surat"
                className="usu-button usu-button--accent"
                style={{ fontWeight: 700, textDecoration: 'none' }}
              >
                <span>Ajukan Surat Permohonan</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/beasiswa"
                className="usu-button usu-button--secondary"
                style={{ textDecoration: 'none' }}
              >
                <GraduationCap size={16} />
                <span>Direktori Beasiswa & Prestasi</span>
              </Link>
            </div>

            {/* Executive Institutional Metrics Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {institutionalHighlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'rgba(12, 59, 42, 0.45)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      borderRadius: 'var(--usu-radius-control)',
                      padding: '0.85rem 0.65rem',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--usu-radius-control)',
                        backgroundColor: 'rgba(255, 198, 0, 0.2)',
                        color: 'var(--usu-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.4rem',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.1rem' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#e0ebe4', fontWeight: 500 }}>
                      {item.desc}
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#e0ebe4',
                marginTop: '0.85rem',
                opacity: 0.8,
              }}
            >
              * Data terverifikasi per Tahun Akademik 2025/2026 • Subbagian PKK Fakultas Vokasi USU
            </div>
          </div>

          {/* RIGHT COLUMN: Authentic Vokasi USU Bento Showcase Grid (DESKTOP ONLY) */}
          <div ref={bentoRef} className="hero-bento-desktop-only">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gridTemplateRows: 'repeat(7, 56px)',
                gap: '12px',
                width: '100%',
                maxWidth: '520px',
              }}
            >
              {/* Tile 1: Authentic CodeStudio Facility Photo from konten.usu.ac.id */}
              <div
                style={{
                  gridColumn: '1 / 8',
                  gridRow: '1 / 5',
                  borderRadius: 'var(--usu-radius-control)',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backgroundColor: '#0c3b2a',
                }}
              >
                <img
                  src="https://konten.usu.ac.id/storage/year/2025-01/satker/885/statis/fasilitas/IMG_1208.webp"
                  alt="Aktivitas belajar di ruang CodeStudio Fakultas Vokasi USU"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '8px 12px',
                    background: 'linear-gradient(to top, rgba(12, 59, 42, 0.95) 0%, transparent 100%)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#ffffff',
                  }}
                >
                  Laboratorium CodeStudio Vokasi USU
                </div>
              </div>

              {/* Tile 2: Authentic Vokasi Aula Exterior from konten.usu.ac.id */}
              <div
                style={{
                  gridColumn: '8 / 13',
                  gridRow: '1 / 4',
                  borderRadius: 'var(--usu-radius-control)',
                  overflow: 'hidden',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: '#0c3b2a',
                  position: 'relative',
                }}
              >
                <img
                  src="https://konten.usu.ac.id/storage/year/2025-03/satker/885/statis/fasilitas/IMG_1522.webp"
                  alt="Tampak Luar Aula Fakultas Vokasi USU"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '6px 8px',
                    background: 'linear-gradient(to top, rgba(12, 59, 42, 0.9) 0%, transparent 100%)',
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    color: '#ffffff',
                  }}
                >
                  Aula Fakultas Vokasi
                </div>
              </div>

              {/* Tile 3: Official Stripe & Pixel Ornament Tile (Green) */}
              <div
                style={{
                  gridColumn: '8 / 13',
                  gridRow: '4 / 6',
                  borderRadius: 'var(--usu-radius-control)',
                  background: 'linear-gradient(135deg, var(--usu-brand) 0%, var(--usu-brand-deep) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.15)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/ornament/stripe-pri.svg"
                  alt="Stripe Ornament"
                  style={{ width: '48%', height: 'auto', objectFit: 'contain' }}
                />
                <img
                  src="/ornament/pixel-sec2.svg"
                  alt="Pixel Ornament"
                  style={{ width: '38%', height: 'auto', objectFit: 'contain' }}
                />
              </div>

              {/* Tile 4: Official Flower Ornament Tile (White Card) */}
              <div
                style={{
                  gridColumn: '1 / 4',
                  gridRow: '5 / 8',
                  borderRadius: 'var(--usu-radius-control)',
                  background: '#ffffff',
                  border: '1.5px solid var(--usu-accent)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                }}
              >
                <img
                  src="/ornament/flower-ora.svg"
                  alt="Flower Gold"
                  style={{ width: '40px', height: '40px', objectFit: 'contain', marginBottom: '4px' }}
                />
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#7a4b00', textTransform: 'uppercase', textAlign: 'center' }}>
                  Unggul
                </span>
              </div>

              {/* Tile 5: Official PlusX / Pixel Ornament Tile (Lime Gradient) */}
              <div
                style={{
                  gridColumn: '4 / 8',
                  gridRow: '5 / 8',
                  borderRadius: 'var(--usu-radius-control)',
                  background: 'linear-gradient(135deg, #b8be14 0%, #3dae2b 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                }}
              >
                <img
                  src="/ornament/plusx-sec2.svg"
                  alt="PlusX Ornament"
                  style={{ width: '38px', height: '38px', objectFit: 'contain', marginBottom: '4px' }}
                />
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0c3b2a', textTransform: 'uppercase' }}>
                  Inspiratif
                </span>
              </div>

              {/* Tile 6: USU Identity Pill Card */}
              <div
                style={{
                  gridColumn: '8 / 13',
                  gridRow: '6 / 8',
                  borderRadius: 'var(--usu-radius-control)',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '0 14px',
                }}
              >
                <img
                  src="/ornament/circle-pri.svg"
                  alt="Circle Ornament"
                  style={{ width: '28px', height: '28px' }}
                />
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
                    Fakultas Vokasi
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#ffc600' }}>
                    Universitas Sumatera Utara
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  FileText,
  GraduationCap,
  Award,
  BookOpen,
  Sparkles,
  CheckCircle2
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
    { label: '10 Template Resmi', desc: 'Format Word .docx', icon: FileText },
    { label: '3.645+ Penerima', desc: 'Basis Data Beasiswa', icon: GraduationCap },
    { label: '227+ Prestasi', desc: 'Wilayah s.d. Internasional', icon: Award },
    { label: '21 Program Studi', desc: '14 D3 & 7 D4 Terapan', icon: BookOpen },
  ];

  return (
    <section
      ref={heroRef}
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #022b16 0%, #034825 35%, #067f42 100%)',
        color: '#ffffff',
        overflow: 'hidden',
        paddingTop: '3.75rem',
        paddingBottom: '4.5rem',
        borderBottom: '4px solid var(--usu-gold)'
      }}
    >
      {/* Background Subtle Grid & Wave Watermark */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.75,
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
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      />

      {/* Official USU Seal Watermark (Center on Mobile via hero-seal-watermark) */}
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
              <span className="title-fill__text" style={{ color: '#fef08a' }}>
                Fakultas Vokasi • Universitas Sumatera Utara
              </span>
            </div>

            {/* Main Portal Title */}
            <h1
              style={{
                fontSize: 'clamp(2.2rem, 4.2vw, 3.2rem)',
                lineHeight: 1.15,
                fontWeight: 800,
                fontFamily: 'Outfit, sans-serif',
                marginBottom: '0.75rem',
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              Pendidikan, Kemahasiswaan, & Kealumnian
            </h1>

            {/* Official Vokasi Motto Pill */}
            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(213, 216, 0, 0.2)',
                border: '1px solid rgba(213, 216, 0, 0.45)',
                color: '#fef08a',
                padding: '0.35rem 0.95rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                marginBottom: '1.25rem',
                fontStyle: 'italic',
              }}
            >
              &ldquo;Ahli Berkarya, Siap Menginspirasi&rdquo;
            </div>

            {/* Slogan & Description */}
            <p
              style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.65,
                marginBottom: '2rem',
                fontWeight: 400,
              }}
            >
              Portal layanan resmi terpadu Fakultas Vokasi USU untuk pengunduhan template surat permohonan mahasiswa, penelusuran direktori beasiswa, rekognisi torehan prestasi mahasiswa, serta diagram penelusuran lulusan (tracer study).
            </p>

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
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.16)',
                      borderRadius: '12px',
                      padding: '0.85rem 0.65rem',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
                        color: 'var(--usu-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.4rem',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.1rem' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
                      {item.desc}
                    </div>
                  </div>
                );
              })}
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
              {/* Tile 1: Main Campus Life Photo */}
              <div
                style={{
                  gridColumn: '1 / 8',
                  gridRow: '1 / 5',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80"
                  alt="Mahasiswa Vokasi USU"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '10px 14px',
                    background: 'linear-gradient(to top, rgba(3, 72, 37, 0.9) 0%, transparent 100%)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#ffffff',
                  }}
                >
                  Kolaborasi & Riset Terapan
                </div>
              </div>

              {/* Tile 2: Secondary Photo */}
              <div
                style={{
                  gridColumn: '8 / 13',
                  gridRow: '1 / 4',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80"
                  alt="Gedung Vokasi USU"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Tile 3: Official Stripe & Pixel Ornament Tile (Green) */}
              <div
                style={{
                  gridColumn: '8 / 13',
                  gridRow: '4 / 6',
                  borderRadius: '18px',
                  background: 'linear-gradient(135deg, #067f42 0%, #034825 100%)',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
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

              {/* Tile 4: Official Flower Ora Ornament Tile (White Card) */}
              <div
                style={{
                  gridColumn: '1 / 4',
                  gridRow: '5 / 8',
                  borderRadius: '20px',
                  background: '#ffffff',
                  border: '2px solid var(--usu-gold)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.18)',
                }}
              >
                <img
                  src="/ornament/flower-ora.svg"
                  alt="Flower Gold"
                  style={{ width: '48px', height: '48px', objectFit: 'contain', marginBottom: '4px' }}
                />
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', textAlign: 'center' }}>
                  Unggul
                </span>
              </div>

              {/* Tile 5: Official PlusX / Pixel Ornament Tile (Lime Gradient) */}
              <div
                style={{
                  gridColumn: '4 / 8',
                  gridRow: '5 / 8',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #d5d800 0%, #39a935 100%)',
                  border: '1.5px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.18)',
                }}
              >
                <img
                  src="/ornament/plusx-sec2.svg"
                  alt="PlusX Ornament"
                  style={{ width: '44px', height: '44px', objectFit: 'contain', marginBottom: '4px' }}
                />
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#034825', textTransform: 'uppercase' }}>
                  Inspiratif
                </span>
              </div>

              {/* Tile 6: USU Identity Pill Card */}
              <div
                style={{
                  gridColumn: '8 / 13',
                  gridRow: '6 / 8',
                  borderRadius: '18px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1.5px solid rgba(255, 255, 255, 0.22)',
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
                  style={{ width: '32px', height: '32px' }}
                />
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff' }}>
                    Fakultas Vokasi
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#fef08a' }}>
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

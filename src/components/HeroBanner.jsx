'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import {
  GraduationCap,
  Briefcase,
  Sparkles,
  Download
} from 'lucide-react';

export default function HeroBanner() {
  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from(badgeRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.6,
      })
      .from(titleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
      }, '-=0.3')
      .from(descRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.7,
      }, '-=0.4')
      .from(buttonsRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
      }, '-=0.4');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      style={{
        position: 'relative',
        background: 'linear-gradient(145deg, #003822 0%, #005A36 60%, #002213 100%)',
        color: '#ffffff',
        overflow: 'hidden',
        paddingTop: '4.5rem',
        paddingBottom: '4.5rem',
        borderBottom: '4px solid var(--usu-gold)'
      }}
    >
      {/* Decorative Ornaments & Glows */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          right: '-150px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 118, 71, 0.35) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
          {/* Kicker */}
          <div ref={badgeRef} style={{ display: 'inline-block', marginBottom: '1.25rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(245, 158, 11, 0.18)',
                border: '1px solid rgba(245, 158, 11, 0.45)',
                color: '#fef08a',
                padding: '0.4rem 1.1rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Sparkles size={16} style={{ color: 'var(--usu-gold)' }} />
              <span>PENDIDIKAN, KEMAHASISWAAN, DAN KEALUMNIAN • FAKULTAS VOKASI USU</span>
            </div>
          </div>

          {/* Title with GSAP reveal */}
          <h1
            ref={titleRef}
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              lineHeight: 1.15,
              fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              marginBottom: '1.25rem',
              color: '#ffffff',
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            }}
          >
            Pendidikan, Kemahasiswaan, dan Kealumnian Fakultas Vokasi USU
          </h1>

          {/* Slogan & Description */}
          <p
            ref={descRef}
            style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.88)',
              lineHeight: 1.65,
              marginBottom: '2.25rem',
              fontWeight: 400,
            }}
          >
            Layanan pengunduhan 10 template surat permohonan mahasiswa & dokumen persyaratan,
            direktori penerima beasiswa, rekapitulasi capaian mahasiswa berprestasi,
            serta analitik tracer study alumni Fakultas Vokasi USU.
          </p>

          {/* CTA Buttons */}
          <div
            ref={buttonsRef}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.9rem',
              justifyContent: 'center',
              marginBottom: '0',
            }}
          >
            <Link href="/surat" className="btn btn-gold" style={{ fontSize: '1rem', padding: '0.85rem 1.6rem' }}>
              <Download size={18} />
              <span>Surat Permohonan Mahasiswa</span>
            </Link>

            <Link href="/beasiswa" className="btn btn-outline-white" style={{ fontSize: '1rem', padding: '0.85rem 1.5rem' }}>
              <GraduationCap size={18} />
              <span>Data Penerima Beasiswa</span>
            </Link>

            <Link href="/tracer-study" className="btn btn-outline-white" style={{ fontSize: '1rem', padding: '0.85rem 1.5rem' }}>
              <Briefcase size={18} />
              <span>Tracer Study Alumni</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

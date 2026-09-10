'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Search,
  ArrowLeft,
  FileText,
  GraduationCap,
  Award,
  Briefcase,
  ShieldCheck,
  Compass,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.toLowerCase();
    if (q.includes('surat') || q.includes('rekomendasi') || q.includes('aktif') || q.includes('template')) {
      router.push('/surat');
    } else if (q.includes('beasiswa') || q.includes('kip') || q.includes('bi') || q.includes('bbm')) {
      router.push('/beasiswa');
    } else if (q.includes('prestasi') || q.includes('lomba') || q.includes('juara')) {
      router.push('/prestasi');
    } else if (q.includes('tracer') || q.includes('alumni') || q.includes('kerja') || q.includes('karir')) {
      router.push('/tracer-study');
    } else if (q.includes('admin') || q.includes('login') || q.includes('kelola')) {
      router.push('/kelola');
    } else if (q.includes('security') || q.includes('keamanan') || q.includes('check')) {
      router.push('/security');
    } else {
      router.push(`/beasiswa?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const quickLinks = [
    {
      title: 'Layanan Surat Permohonan',
      desc: 'Unduh template & generator surat permohonan resmi mahasiswa.',
      href: '/surat',
      icon: FileText,
      color: '#059669',
      bgColor: '#ecfdf5',
    },
    {
      title: 'Direktori Beasiswa Vokasi',
      desc: 'Daftar 3.645 penerima beasiswa KIP-K, BI, BBM, Prestasi USU.',
      href: '/beasiswa',
      icon: GraduationCap,
      color: '#d97706',
      bgColor: '#fffbeb',
    },
    {
      title: 'Mahasiswa Berprestasi',
      desc: 'Rekapitulasi 227 juara tingkat Internasional, Nasional & Wilayah.',
      href: '/prestasi',
      icon: Award,
      color: '#0284c7',
      bgColor: '#f0f9ff',
    },
    {
      title: 'Diagram Tracer Study 2025',
      desc: 'Visualisasi diagram garis penelusuran karir 14 Program Studi.',
      href: '/tracer-study',
      icon: Briefcase,
      color: '#7c3aed',
      bgColor: '#f5f3ff',
    },
  ];

  return (
    <div
      style={{
        minHeight: '85vh',
        background: 'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.08) 0%, rgba(248, 250, 252, 1) 60%)',
        padding: '3.5rem 1.25rem 5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating Animated Background Particles */}
      <motion.div
        animate={{
          y: [-15, 15, -15],
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          top: '12%',
          left: '8%',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          border: '2px dashed rgba(16, 185, 129, 0.2)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        animate={{
          y: [20, -20, 20],
          rotate: [360, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '7%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          border: '2px dashed rgba(245, 158, 11, 0.25)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '820px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        {/* Animated Badge Status */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#fee2e2',
            border: '1.5px solid #fca5a5',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            color: '#b91c1c',
            fontSize: '0.85rem',
            fontWeight: 800,
            marginBottom: '1.5rem',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.12)',
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}
          />
          <span>ERROR 404 • HALAMAN TIDAK DITEMUKAN</span>
        </motion.div>

        {/* Animated Big 404 Visual Display */}
        <div style={{ position: 'relative', margin: '0 auto 1.5rem', width: 'fit-content' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, type: 'spring' }}
            style={{
              fontSize: 'clamp(5.5rem, 14vw, 10.5rem)',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(135deg, #003620 0%, #005A36 40%, #D97706 80%, #F59E0B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 10px 30px rgba(0, 54, 32, 0.12)',
              userSelect: 'none',
            }}
          >
            404
          </motion.div>

          {/* Floating Orbiting Radar Compass Icon */}
          <motion.div
            animate={{
              y: [-8, 8, -8],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              top: '15%',
              right: '-25px',
              backgroundColor: '#ffffff',
              padding: '12px',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0, 54, 32, 0.15)',
              border: '2px solid var(--usu-gold)',
              color: 'var(--usu-green)',
            }}
          >
            <Compass size={32} />
          </motion.div>

          {/* Floating Shield Icon */}
          <motion.div
            animate={{
              y: [8, -8, 8],
              rotate: [0, -12, 12, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '-25px',
              backgroundColor: '#ffffff',
              padding: '10px',
              borderRadius: '14px',
              boxShadow: '0 10px 25px rgba(0, 54, 32, 0.15)',
              border: '2px solid #10b981',
              color: '#059669',
            }}
          >
            <ShieldCheck size={28} />
          </motion.div>
        </div>

        {/* Informative Explanation */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
            color: 'var(--usu-green-dark)',
            fontWeight: 800,
            marginBottom: '0.75rem',
            fontFamily: 'Outfit, sans-serif',
          }}
        >
          Oops! Halaman Yang Kamu Tuju Sedang Berpindah Jalur
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            lineHeight: 1.65,
            maxWidth: '620px',
            margin: '0 auto 2rem',
          }}
        >
          Tautan URL yang kamu akses mungkin telah diperbarui, berganti jalur navigasi, atau sedang dalam proses
          pemeliharaan portal resmi <strong>PKK Fakultas Vokasi USU</strong>. Silakan cari layanan di bawah ini atau kembali ke menu utama.
        </motion.p>

        {/* Interactive Search Bar on 404 */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onSubmit={handleSearchSubmit}
          style={{
            maxWidth: '560px',
            margin: '0 auto 2.5rem',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '0.45rem',
            boxShadow: '0 10px 28px rgba(0, 54, 32, 0.09)',
            border: '2px solid rgba(0, 90, 54, 0.2)',
          }}
        >
          <div style={{ padding: '0 0.85rem', color: 'var(--usu-green)' }}>
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Ketik layanan yang kamu cari (misal: beasiswa, surat, tracer)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '0.95rem',
              backgroundColor: 'transparent',
              color: 'var(--text-main)',
            }}
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            style={{ padding: '0.7rem 1.4rem', borderRadius: '12px' }}
          >
            <span>Cari</span>
          </button>
        </motion.form>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            display: 'flex',
            gap: '0.85rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3.5rem',
          }}
        >
          <Link
            href="/"
            className="btn btn-primary"
            style={{
              padding: '0.85rem 1.65rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              boxShadow: '0 6px 20px rgba(0, 90, 54, 0.25)',
            }}
          >
            <Home size={18} />
            <span>Kembali ke Beranda Utama</span>
          </Link>

          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-outline"
            style={{
              padding: '0.85rem 1.4rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              backgroundColor: '#ffffff',
            }}
          >
            <ArrowLeft size={18} />
            <span>Halaman Sebelumnya</span>
          </button>

          <Link
            href="/security"
            className="btn btn-outline"
            style={{
              padding: '0.85rem 1.4rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              backgroundColor: '#ecfdf5',
              borderColor: '#a7f3d0',
              color: '#065f46',
            }}
          >
            <ShieldCheck size={18} />
            <span>Security Check (Audit Keamanan)</span>
          </Link>
        </motion.div>

        {/* Helpful Destinations Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ textAlign: 'left' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', justifyContent: 'center' }}>
            <Sparkles size={16} style={{ color: 'var(--usu-gold)' }} />
            <h3 style={{ fontSize: '1.05rem', color: 'var(--usu-green-dark)', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Destinasi Layanan Utama PKK Vokasi USU
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
            }}
          >
            {quickLinks.map((item) => {
              const IconComp = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    textDecoration: 'none',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '1.5px solid var(--border-subtle)',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = item.color;
                    e.currentTarget.style.boxShadow = `0 10px 24px ${item.bgColor}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.03)';
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: item.bgColor,
                        color: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.85rem',
                      }}
                    >
                      <IconComp size={22} />
                    </div>

                    <h4 style={{ fontSize: '1rem', color: 'var(--usu-green-dark)', fontWeight: 800, marginBottom: '0.35rem' }}>
                      {item.title}
                    </h4>

                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: item.color,
                      fontSize: '0.825rem',
                      fontWeight: 700,
                      marginTop: '1rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #f1f5f9',
                    }}
                  >
                    <span>Buka Layanan</span>
                    <ChevronRight size={15} />
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

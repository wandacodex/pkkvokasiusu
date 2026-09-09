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
  Download,
  Users,
  Building2,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  ChevronRight,
  Eye
} from 'lucide-react';
import HeroBanner from '@/src/components/HeroBanner';
import { TEMPLATE_SURAT } from '@/src/lib/mockData';

export default function HomePage() {
  const [stats, setStats] = useState({
    beasiswaCount: 6,
    prestasiCount: 5,
    tracerCount: 6,
  });
  const [featuredPrestasi, setFeaturedPrestasi] = useState([]);

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
        if (resPres.success) {
          setStats(prev => ({ ...prev, prestasiCount: resPres.total || prev.prestasiCount }));
          setFeaturedPrestasi(resPres.data?.slice(0, 3) || []);
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
    <div>
      {/* Hero Banner GSAP */}
      <HeroBanner />

      {/* Showcase 10 Template Dokumen Resmi Siap Unduh */}
      <section style={{ marginTop: '2.5rem', position: 'relative', zIndex: 20 }}>
        <div className="container">
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '2rem 2.25rem',
              boxShadow: '0 20px 30px -10px rgba(0, 90, 54, 0.12)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-gold">Format Microsoft Word (.docx)</span>
                  <span className="badge badge-green">10 Berkas Tersedia</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--usu-green-dark)', fontWeight: 800 }}>
                  Koleksi Template Surat Permohonan Mahasiswa
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Unduh langsung berkas template berformat Microsoft Word (.docx) sesuai keperluan akademik, magang, atau beasiswa Anda.
                </p>
              </div>

              <Link href="/surat" className="btn btn-primary btn-sm">
                <span>Surat Permohonan Mahasiswa</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Quick Grid of Popular Templates */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {TEMPLATE_SURAT.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  className="shortcut-card"
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span className="badge badge-gold" style={{ fontSize: '0.685rem' }}>{item.kode}</span>
                      <span style={{ fontSize: '0.725rem', color: 'var(--text-light)', fontWeight: 600 }}>{item.fileSize}</span>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.4rem', lineHeight: 1.4 }}>
                      {item.nama}
                    </h4>
                    <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {item.kategori}
                    </p>
                  </div>

                  <a
                    href={item.fileUrl}
                    download={item.fileName}
                    className="btn btn-gold btn-sm"
                    style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem' }}
                  >
                    <Download size={14} />
                    <span>Unduh .DOCX</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 Layanan Utama Kemahasiswaan PKK Vokasi USU */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
            <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>Fasilitas & Layanan Terpadu</span>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--usu-green-dark)', marginBottom: '0.75rem' }}>
              Layanan Utama Mahasiswa & Alumni
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Pusat layanan satu pintu pembinaan karir, beasiswa, prestasi, dan evaluasi alumni Fakultas Vokasi Universitas Sumatera Utara.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {/* Card 1: Template Surat */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'var(--usu-green-soft)', color: 'var(--usu-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <FileText size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--usu-green-dark)' }}>
                  Surat Permohonan Mahasiswa
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Akses 10 format template surat permohonan mahasiswa (.docx), cek berkas persyaratan lengkap, dan unduh dokumen siap pakai.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                    <span>Surat Izin Tidak Ikut Kuliah</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                    <span>Surat Magang & PKL (Pribadi & Kelompok)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                    <span>Surat Izin Penelitian & Rekomendasi Beasiswa</span>
                  </div>
                </div>
              </div>
              <Link href="/surat" className="btn btn-outline" style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>Surat Permohonan Mahasiswa</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 2: Beasiswa */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'var(--usu-gold-light)', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <GraduationCap size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--usu-green-dark)' }}>
                  Data Penerima Beasiswa
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Direktori penerima beasiswa KIP Kuliah, Bank Indonesia, Djarum, Pemprov Sumut, dan Yayasan Alumni dengan filter program studi.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                    <span>Filter Program Studi & Jenis Beasiswa</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                    <span>Pencarian Cepat NIM & Nama</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
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
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Award size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--usu-green-dark)' }}>
                  Mahasiswa Berprestasi
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Hall of Fame apresiasi mahasiswa peraih medali & juara tingkat Internasional, Nasional, dan Wilayah di berbagai bidang terapan.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                    <span>Showcase Medali Emas & Prestasi</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                    <span>Profil & Dosen Pembimbing</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                    <span>Katalog Inovasi Teknologi Terapan</span>
                  </div>
                </div>
              </div>
              <Link href="/prestasi" className="btn btn-outline" style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>Jelajahi Prestasi</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Card 4: Tracer Study */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <Briefcase size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--usu-green-dark)' }}>
                  Rekapitulasi Tracer Study
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  Rekapitulasi tracer study alumni vokasi USU berdasarkan 5 status kelulusan baku dan survei pelacakan terpadu SATU USU.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                    <span>Rekapitulasi Capaian Karir Alumni</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                    <span>5 Kategori Baku Status Lulusan</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                    <span>Terintegrasi Portal SATU USU</span>
                  </div>
                </div>
              </div>
              <Link href="/tracer-study" className="btn btn-outline" style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>Rekapitulasi Tracer Study</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Mahasiswa Berprestasi */}
      <section style={{ backgroundColor: '#f1f5f9', padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', gap: '1rem' }}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>Hall of Fame</span>
              <h2 style={{ fontSize: '2rem', color: 'var(--usu-green-dark)' }}>
                Torehan Prestasi Mahasiswa Vokasi
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Dedikasi mahasiswa Fakultas Vokasi USU mengharumkan almamater di kancah nasional dan internasional.
              </p>
            </div>
            <Link href="/prestasi" className="btn btn-primary btn-sm">
              <span>Lihat Semua Prestasi</span>
              <ArrowRight size={16} />
            </Link>
          </div>

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
                }}
              >
                <div style={{ position: 'relative', height: '190px', width: '100%', overflow: 'hidden' }}>
                  <img
                    src={item.fotoUrl}
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
                      backgroundColor: 'rgba(0, 90, 54, 0.9)',
                      color: '#ffffff',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backdropFilter: 'blur(4px)',
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
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.785rem',
                      fontWeight: 800,
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {item.capaian}
                  </div>
                </div>

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.785rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                      {item.prodi} • {item.tahun}
                    </div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                      {item.nama}
                    </h4>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--usu-green)', marginBottom: '0.5rem' }}>
                      {item.namaKompetisi}
                    </p>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {item.deskripsi?.length > 110 ? `${item.deskripsi.substring(0, 110)}...` : item.deskripsi}
                    </p>
                  </div>

                  <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.775rem', color: 'var(--text-light)' }}>
                    Pembimbing: <strong>{item.dosenPembimbing}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

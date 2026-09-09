'use client';

import { useState, useEffect } from 'react';
import {
  Briefcase,
  TrendingUp,
  Clock,
  GraduationCap,
  Search,
  ExternalLink,
  ShieldCheck,
  Users,
  BarChart3
} from 'lucide-react';

export default function TracerStudyPage() {
  const [analytics, setAnalytics] = useState({
    totalMahasiswa: 50,
    countBekerja: 35,
    countBelumMemungkinkanBekerja: 2,
    countWiraswasta: 7,
    countMelanjutkanPendidikan: 4,
    countMencariKerja: 2,
    percentBekerja: 70.0,
    percentBelumMemungkinkanBekerja: 4.0,
    percentWiraswasta: 14.0,
    percentMelanjutkanPendidikan: 8.0,
    percentMencariKerja: 4.0,
  });

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch('/api/tracer');
        const data = await res.json();
        if (data.success && data.analytics) {
          setAnalytics(data.analytics);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchAnalytics();
  }, []);

  const categoryData = [
    {
      id: 'bekerja',
      title: 'Bekerja',
      count: analytics.countBekerja || 0,
      percent: analytics.percentBekerja || 0,
      color: '#059669',
      bgColor: '#ecfdf5',
      borderColor: 'rgba(5, 150, 105, 0.3)',
      icon: Briefcase,
      desc: 'Bekerja di instansi pemerintah, BUMN, swasta nasional, multinasional, atau organisasi nirlaba.',
    },
    {
      id: 'belum_memungkinkan_bekerja',
      title: 'Belum Memungkinkan Bekerja',
      count: analytics.countBelumMemungkinkanBekerja || 0,
      percent: analytics.percentBelumMemungkinkanBekerja || 0,
      color: '#64748b',
      bgColor: '#f1f5f9',
      borderColor: 'rgba(100, 116, 139, 0.3)',
      icon: Clock,
      desc: 'Belum memungkinkan untuk bekerja karena mengurus keluarga, pemulihan kesehatan, atau pertimbangan personal.',
    },
    {
      id: 'wiraswasta',
      title: 'Wiraswasta',
      count: analytics.countWiraswasta || 0,
      percent: analytics.percentWiraswasta || 0,
      color: '#d97706',
      bgColor: '#fffbeb',
      borderColor: 'rgba(217, 119, 6, 0.3)',
      icon: TrendingUp,
      desc: 'Mendirikan atau mengelola usaha mandiri, UMKM terapan, perintisan bisnis, atau pekerja lepas profesional.',
    },
    {
      id: 'melanjutkan_pendidikan',
      title: 'Melanjutkan Pendidikan',
      count: analytics.countMelanjutkanPendidikan || 0,
      percent: analytics.percentMelanjutkanPendidikan || 0,
      color: '#0284c7',
      bgColor: '#f0f9ff',
      borderColor: 'rgba(2, 132, 199, 0.3)',
      icon: GraduationCap,
      desc: 'Melanjutkan studi ke jenjang Sarjana Terapan (D4 lanjutan), Sarjana (S1), atau pendidikan profesi.',
    },
    {
      id: 'mencari_kerja',
      title: 'Tidak Kerja Tetapi Sedang Mencari Pekerjaan',
      count: analytics.countMencariKerja || 0,
      percent: analytics.percentMencariKerja || 0,
      color: '#7c3aed',
      bgColor: '#f5f3ff',
      borderColor: 'rgba(124, 58, 237, 0.3)',
      icon: Search,
      desc: 'Sedang aktif melamar pekerjaan, mengikuti tahapan seleksi rekrutmen, tes kompetensi, atau wawancara kerja.',
    },
  ];

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Header Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #003620 0%, #005A36 65%, #002213 100%)',
          color: '#ffffff',
          padding: '4rem 0 4.5rem',
          borderBottom: '3px solid var(--usu-gold)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '820px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                marginBottom: '1rem',
                color: '#fef08a',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              <Briefcase size={15} style={{ color: 'var(--usu-gold)' }} />
              <span>Pendidikan, Kemahasiswaan, dan Kealumnian • Fakultas Vokasi USU</span>
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
              Rekapitulasi Tracer Study Fakultas Vokasi USU
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.65 }}>
              Rekapitulasi data penelusuran lulusan dan status karir alumni Fakultas Vokasi Universitas Sumatera Utara
              sesuai 5 kategori baku instrumen tracer study nasional.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container" style={{ marginTop: '-2rem', position: 'relative', zIndex: 20 }}>
        {/* Callout Pengisian Kuesioner Resmi (Redirect ke SATU USU) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.75rem 2rem',
            boxShadow: '0 8px 24px rgba(0, 54, 32, 0.08)',
            border: '1.5px solid rgba(245, 158, 11, 0.35)',
            marginBottom: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #fffdf5 100%)',
          }}
        >
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#b45309', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              <ExternalLink size={14} />
              <span>Pengisian Kuesioner Terpusat SATU USU</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--usu-green-dark)', fontWeight: 800, marginBottom: '0.4rem' }}>
              Partisipasi Kuesioner Tracer Study Alumni
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Pengisian instrumen survei pelacakan alumni Universitas Sumatera Utara dilaksanakan secara terpadu melalui portal resmi SATU USU. Silakan klik tombol di samping untuk langsung mengisi kuesioner.
            </p>
          </div>

          <div>
            <a
              href="https://satu.usu.ac.id/alumni/tracer-study"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
              style={{
                padding: '0.85rem 1.65rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                borderRadius: '10px',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
                textDecoration: 'none',
              }}
            >
              <span>Isi Kuesioner di SATU USU</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Section Heading: Rekapitulasi Tracer Study */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>
              Rekapitulasi 5 Kategori Status Alumni
            </span>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--usu-green-dark)', fontWeight: 800, margin: 0 }}>
              Jumlah Mahasiswa Berdasarkan Status
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Data rekapitulasi jumlah mahasiswa lulusan Fakultas Vokasi USU pada setiap kategori status aktivitas pascakampus.
            </p>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ffffff', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <Users size={18} style={{ color: 'var(--usu-green)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Total Responden:</span>
            <strong style={{ fontSize: '1rem', color: 'var(--usu-green-dark)' }}>{analytics.totalMahasiswa || 0} Mahasiswa</strong>
          </div>
        </div>

        {/* 5 Cards for the 5 Exact Categories */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {categoryData.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="card"
                style={{
                  padding: '1.4rem',
                  borderTop: `4px solid ${item.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: item.bgColor,
                        color: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComponent size={22} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: item.color,
                        backgroundColor: item.bgColor,
                        padding: '0.25rem 0.6rem',
                        borderRadius: '999px',
                        border: `1px solid ${item.borderColor}`,
                      }}
                    >
                      {item.percent}%
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--usu-green-dark)', lineHeight: 1.35, minHeight: '2.7rem', marginBottom: '0.75rem' }}>
                    {item.title}
                  </h3>

                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: item.color, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>
                    {item.count}
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-light)', marginLeft: '0.4rem' }}>
                      Mahasiswa
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Visual Proportion & Comparison Breakdown Card */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--usu-green-dark)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 size={20} style={{ color: 'var(--usu-gold)' }} />
                <span>Distribusi Proporsi Status Lulusan</span>
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                Perbandingan persentase dan jumlah mahasiswa pada masing-masing status pelacakan.
              </p>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
              Total Basis Data: <strong style={{ color: 'var(--text-main)' }}>{analytics.totalMahasiswa} Mahasiswa</strong>
            </div>
          </div>

          {/* Stacked Proportion Bar */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ width: '100%', height: '18px', backgroundColor: '#e2e8f0', borderRadius: '999px', overflow: 'hidden', display: 'flex', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>
              {categoryData.map((item) => {
                if (!item.percent || item.percent <= 0) return null;
                return (
                  <div
                    key={item.id}
                    title={`${item.title}: ${item.count} Mahasiswa (${item.percent}%)`}
                    style={{
                      width: `${item.percent}%`,
                      height: '100%',
                      backgroundColor: item.color,
                      transition: 'width 0.6s ease',
                    }}
                  />
                );
              })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 1.5rem', marginTop: '0.75rem', fontSize: '0.78rem' }}>
              {categoryData.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{item.title}</span>
                  <span style={{ color: 'var(--text-light)' }}>({item.percent}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bars for Each of the 5 Categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {categoryData.map((item) => (
              <div key={item.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{item.title}</span>
                  <span style={{ fontWeight: 700, color: item.color }}>
                    {item.count} Mahasiswa ({item.percent}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${item.percent}%`,
                      height: '100%',
                      backgroundColor: item.color,
                      borderRadius: '999px',
                      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabel Rekapitulasi Resmi (5 Kategori Baku) */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--usu-green-dark)', fontWeight: 800 }}>
              Tabel Rekapitulasi Data Tracer Study
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Rincian tabel jumlah mahasiswa dan persentase berdasarkan 5 kategori baku status keterserapan alumni.
            </p>
          </div>

          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>No</th>
                  <th>Kategori Status Mahasiswa</th>
                  <th style={{ width: '200px', textAlign: 'center' }}>Jumlah Mahasiswa</th>
                  <th style={{ width: '160px', textAlign: 'center' }}>Persentase (%)</th>
                  <th>Keterangan Indikator</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((item, idx) => (
                  <tr key={item.id}>
                    <td style={{ color: 'var(--text-light)', fontWeight: 600 }}>{idx + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
                        <strong style={{ color: 'var(--text-main)' }}>{item.title}</strong>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '1rem',
                          fontWeight: 800,
                          color: item.color,
                          backgroundColor: item.bgColor,
                          padding: '0.25rem 0.85rem',
                          borderRadius: '8px',
                          display: 'inline-block',
                          minWidth: '80px',
                        }}
                      >
                        {item.count} Orang
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        {item.percent}%
                      </span>
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                      {item.desc}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#f8fafc', fontWeight: 800, borderTop: '2px solid var(--border-subtle)' }}>
                  <td colSpan={2} style={{ textAlign: 'right', color: 'var(--usu-green-dark)' }}>
                    Total Mahasiswa Responden:
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--usu-green-dark)', fontSize: '1.05rem' }}>
                    {analytics.totalMahasiswa} Orang
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--usu-green-dark)', fontSize: '1.05rem' }}>
                    100.0%
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                    Data terverifikasi unit PKK Fakultas Vokasi USU
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Privacy & Governance Notice */}
        <div
          style={{
            backgroundColor: '#eff6ff',
            border: '1.5px solid #bfdbfe',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <ShieldCheck size={28} style={{ color: '#2563eb', flexShrink: 0 }} />
          <div>
            <h4 style={{ color: '#1e40af', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem' }}>
              Kerahasiaan & Standar Tata Kelola Data Alumni
            </h4>
            <p style={{ color: '#1e3a8a', fontSize: '0.825rem', lineHeight: 1.55, margin: 0 }}>
              Data rekapitulasi tracer study ini dihimpun secara terpusat untuk pemenuhan instrumen akreditasi LAM-PT / BAN-PT
              serta penyempurnaan kurikulum vokasi berbasis link and match. Identitas personal responden dijaga kerahasiaannya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

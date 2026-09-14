'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Briefcase,
  Clock,
  GraduationCap,
  Search,
  ExternalLink,
  ShieldCheck,
  Users,
  LineChart as LineChartIcon,
  Layers,
  Lock,
  ArrowUpRight,
  Activity,
  SlidersHorizontal,
  Check,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { TRACER_PRODI_STATS } from '@/src/lib/mockData';

// Helper to make buttery-smooth curved line path in SVG
function makeSmoothPath(points) {
  if (!points || points.length === 0) return '';
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x},${p2.y}`;
  }
  return d;
}

export default function TracerStudyPage() {
  const [prodiStats, setProdiStats] = useState(TRACER_PRODI_STATS || []);
  const [loading, setLoading] = useState(true);
  const [hoveredProdiIndex, setHoveredProdiIndex] = useState(null);
  const [prodiFilterSearch, setProdiFilterSearch] = useState('');

  // Series visibility toggles for Line Chart 1
  const [visibleSeries, setVisibleSeries] = useState({
    mencariKerja: true,
    bekerja: true,
    wiraswasta: true,
    melanjutkanPendidikan: true,
    belumMemungkinkan: true,
    totalRespons: false,
  });

  const seriesMeta = [
    {
      id: 'mencariKerja',
      label: 'Masih Mencari Kerja',
      color: '#8b5cf6',
      strokeWidth: 3.5,
      dotColor: '#7c3aed',
      bgColor: '#f5f3ff',
      icon: Search,
    },
    {
      id: 'bekerja',
      label: 'Bekerja',
      color: '#10b981',
      strokeWidth: 3.5,
      dotColor: '#059669',
      bgColor: '#ecfdf5',
      icon: Briefcase,
    },
    {
      id: 'wiraswasta',
      label: 'Wiraswasta',
      color: '#f59e0b',
      strokeWidth: 3.5,
      dotColor: '#d97706',
      bgColor: '#fffbeb',
      icon: TrendingUp,
    },
    {
      id: 'melanjutkanPendidikan',
      label: 'Melanjutkan Studi',
      color: '#0284c7',
      strokeWidth: 3.5,
      dotColor: '#0369a1',
      bgColor: '#f0f9ff',
      icon: GraduationCap,
    },
    {
      id: 'belumMemungkinkan',
      label: 'Belum Memungkinkan',
      color: '#64748b',
      strokeWidth: 3.5,
      dotColor: '#475569',
      bgColor: '#f1f5f9',
      icon: Clock,
    },
    {
      id: 'totalRespons',
      label: 'Total Responden (Akumulasi)',
      color: '#067f42',
      strokeWidth: 2.5,
      dotColor: '#067f42',
      bgColor: '#e6f7ee',
      isDashed: true,
      icon: Users,
    },
  ];

  useEffect(() => {
    async function fetchTracer() {
      try {
        setLoading(true);
        const res = await fetch('/api/tracer');
        const data = await res.json();
        if (data.success && data.prodiStats && data.prodiStats.length > 0) {
          setProdiStats(data.prodiStats);
        }
      } catch (err) {
        console.error('Error fetching tracer study:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTracer();
  }, []);

  // Aggregated totals across all 14 Prodis
  const totals = useMemo(() => {
    return prodiStats.reduce(
      (acc, curr) => ({
        lulusan: acc.lulusan + (curr.lulusan || 0),
        bekerja: acc.bekerja + (curr.bekerja || 0),
        belumMemungkinkan: acc.belumMemungkinkan + (curr.belumMemungkinkan || 0),
        wiraswasta: acc.wiraswasta + (curr.wiraswasta || 0),
        melanjutkanPendidikan: acc.melanjutkanPendidikan + (curr.melanjutkanPendidikan || 0),
        mencariKerja: acc.mencariKerja + (curr.mencariKerja || 0),
        totalRespons: acc.totalRespons + (curr.totalRespons || 0),
      }),
      { lulusan: 0, bekerja: 0, belumMemungkinkan: 0, wiraswasta: 0, melanjutkanPendidikan: 0, mencariKerja: 0, totalRespons: 0 }
    );
  }, [prodiStats]);

  const overallResponseRate = totals.lulusan ? ((totals.totalRespons / totals.lulusan) * 100).toFixed(1) : '98.7';

  // KPI Categories Data
  const categoriesKpi = [
    {
      id: 'bekerja',
      title: 'Bekerja',
      count: totals.bekerja,
      percent: totals.totalRespons ? ((totals.bekerja / totals.totalRespons) * 100).toFixed(1) : '15.1',
      color: '#10b981',
      bgColor: '#ecfdf5',
      borderColor: 'rgba(16, 185, 129, 0.3)',
      icon: Briefcase,
      desc: 'Bekerja di instansi pemerintah, BUMN, swasta nasional, multinasional, atau nirlaba.',
    },
    {
      id: 'belum_memungkinkan_bekerja',
      title: 'Belum Memungkinkan Bekerja',
      count: totals.belumMemungkinkan,
      percent: totals.totalRespons ? ((totals.belumMemungkinkan / totals.totalRespons) * 100).toFixed(1) : '4.5',
      color: '#64748b',
      bgColor: '#f1f5f9',
      borderColor: 'rgba(100, 116, 139, 0.3)',
      icon: Clock,
      desc: 'Belum memungkinkan bekerja karena keluarga, pemulihan kesehatan, atau personal.',
    },
    {
      id: 'wiraswasta',
      title: 'Wiraswasta',
      count: totals.wiraswasta,
      percent: totals.totalRespons ? ((totals.wiraswasta / totals.totalRespons) * 100).toFixed(1) : '5.7',
      color: '#f59e0b',
      bgColor: '#fffbeb',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      icon: TrendingUp,
      desc: 'Mendirikan bisnis mandiri, rintisan usaha, UMKM terapan, atau profesional lepas.',
    },
    {
      id: 'melanjutkan_pendidikan',
      title: 'Melanjutkan Pendidikan',
      count: totals.melanjutkanPendidikan,
      percent: totals.totalRespons ? ((totals.melanjutkanPendidikan / totals.totalRespons) * 100).toFixed(1) : '4.5',
      color: '#0284c7',
      bgColor: '#f0f9ff',
      borderColor: 'rgba(2, 132, 199, 0.3)',
      icon: GraduationCap,
      desc: 'Melanjutkan studi ke Sarjana Terapan (D4 lanjutan), Sarjana (S1), atau sertifikasi profesi.',
    },
    {
      id: 'mencari_kerja',
      title: 'Masih Mencari Pekerjaan',
      count: totals.mencariKerja,
      percent: totals.totalRespons ? ((totals.mencariKerja / totals.totalRespons) * 100).toFixed(1) : '70.2',
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
      borderColor: 'rgba(139, 92, 246, 0.3)',
      icon: Search,
      desc: 'Aktif melamar kerja, mengikuti seleksi rekrutmen BUMN/swasta, atau tes kompetensi.',
    },
  ];

  // SVG Chart Geometry Constants
  const chartW = 1000;
  const chartH = 430;
  const padL = 60;
  const padR = 40;
  const padT = 35;
  const padB = 95;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  // X Coordinate for each Prodi
  const getX = (i) => padL + (i / Math.max(1, prodiStats.length - 1)) * plotW;

  // Max Y value for Count Line Chart
  const yCountMax = 50; // max value in prodi status is 49 (D3 Perpajakan mencari kerja)
  const getYCount = (val) => padT + (1 - Math.min(yCountMax, Math.max(0, val)) / yCountMax) * plotH;

  // Compute points and SVG paths for each series
  const seriesPaths = useMemo(() => {
    const res = {};
    seriesMeta.forEach((s) => {
      const pts = prodiStats.map((p, i) => ({
        x: getX(i),
        y: getYCount(p[s.id] || 0),
        val: p[s.id] || 0,
        prodi: p.prodi,
      }));
      res[s.id] = {
        points: pts,
        path: makeSmoothPath(pts),
      };
    });
    return res;
  }, [prodiStats]);

  // Rate Chart Geometry
  const rateH = 300;
  const ratePadB = 85;
  const ratePlotH = rateH - padT - ratePadB;
  const rateMin = 75;
  const rateMax = 105;
  const getYRate = (pct) => padT + (1 - (Math.min(rateMax, Math.max(rateMin, pct)) - rateMin) / (rateMax - rateMin)) * ratePlotH;

  const ratePoints = useMemo(() => {
    return prodiStats.map((p, i) => {
      const rateVal = parseFloat(p.responRatePct || (p.lulusan ? ((p.totalRespons / p.lulusan) * 100).toFixed(1) : 0));
      return {
        x: getX(i),
        y: getYRate(rateVal),
        val: rateVal,
        prodi: p.prodi,
        lulusan: p.lulusan,
        respon: p.totalRespons,
      };
    });
  }, [prodiStats]);

  const rateLinePath = makeSmoothPath(ratePoints);
  const rateAreaPath = ratePoints.length > 0
    ? `${rateLinePath} L ${ratePoints[ratePoints.length - 1].x},${padT + ratePlotH} L ${ratePoints[0].x},${padT + ratePlotH} Z`
    : '';

  // Filtered prodi for data table
  const filteredProdi = prodiStats.filter(p => !prodiFilterSearch || p.prodi.toLowerCase().includes(prodiFilterSearch.toLowerCase()));

  const activeHoveredProdi = hoveredProdiIndex !== null ? prodiStats[hoveredProdiIndex] : null;

  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Header Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #034825 0%, #067f42 65%, #022b16 100%)',
          color: '#ffffff',
          padding: '4rem 0 4.5rem',
          borderBottom: '3px solid var(--usu-gold)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Static Official Corner Watermark */}
        <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', width: '280px', height: '280px', opacity: 0.08, pointerEvents: 'none' }}>
          <img src="/ornament/circular-tra.svg" alt="" style={{ width: '100%', height: '100%' }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ maxWidth: '880px' }}>
            <div className="title-fill title-fill--dark" style={{ marginBottom: '1rem' }}>
              <div className="title-fill__icon">
                <img src="/ornament/flower-ora.svg" alt="" />
              </div>
              <span className="title-fill__text" style={{ color: '#fef08a' }}>
                Rekapitulasi Tracer Study • Lulusan 2025
              </span>
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
              Diagram Garis Rekapitulasi Tracer Study Lulusan 2025
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.65 }}>
              Visualisasi resmi kurva tren penelusuran lulusan dan sebaran status karir alumni Fakultas Vokasi USU
              (Lulusan 2024 / Survei Tahun 2025) yang disinkronkan langsung dari data autentik 14 Program Studi.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container" style={{ marginTop: '-2rem', position: 'relative', zIndex: 20 }}>
        {/* Banner SATU USU */}
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
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#b45309', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
              <ExternalLink size={14} />
              <span>Portal Terpadu Alumni SATU USU</span>
            </div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--usu-green-dark)', fontWeight: 800, marginBottom: '0.4rem' }}>
              Partisipasi Instrumen Kuesioner Tracer Study
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Pengisian kuesioner pelacakan alumni dilaksanakan terpadu melalui sistem satu pintu Universitas Sumatera Utara.
              Silakan login akun SATU USU untuk mengisi kuesioner.
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

        {/* Section Heading: KPI Cards */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', marginBottom: '1.75rem' }}>
          <div>
            <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>
              Sinkronisasi Berkas: REKAPITULASI TRACER STUDY LULUSAN 2025.xlsx
            </span>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--usu-green-dark)', fontWeight: 800, margin: 0 }}>
              Ringkasan Capaian Tracer Study Fakultas Vokasi
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Akumulasi 617 responden terlacak dari 625 lulusan tahun 2024 pada seluruh 14 Program Studi Diploma III (D3).
            </p>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#ffffff', padding: '0.6rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <Activity size={22} style={{ color: 'var(--usu-green)' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', lineHeight: 1.2 }}>Respon Rate Fakultas</div>
              <strong style={{ fontSize: '1.15rem', color: 'var(--usu-green-dark)' }}>{totals.totalRespons} / {totals.lulusan} Mahasiswa ({overallResponseRate}%)</strong>
            </div>
          </div>
        </div>

        {/* 5 KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          {categoriesKpi.map((item) => {
            const IconComp = item.icon;
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
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: item.bgColor,
                        color: item.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComp size={20} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: item.color,
                        backgroundColor: item.bgColor,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '999px',
                        border: `1px solid ${item.borderColor}`,
                      }}
                    >
                      {item.percent}%
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--usu-green-dark)', lineHeight: 1.35, minHeight: '2.6rem', marginBottom: '0.6rem' }}>
                    {item.title}
                  </h3>

                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: item.color, fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>
                    {item.count}
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-light)', marginLeft: '0.35rem' }}>
                      Mahasiswa
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.45, marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid #f1f5f9', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* DIAGRAM GARIS 1: MULTI-SERIES LINE CHART TREN SEBARAN KARIR PER PRODI     */}
        {/* ========================================================================= */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--usu-green)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
                <LineChartIcon size={16} />
                <span>Diagram Garis Utama (Line Chart)</span>
              </div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--usu-green-dark)', fontWeight: 800, margin: 0 }}>
                Diagram Garis Sebaran Status Karir Antar Program Studi
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                Visualisasi garis lengkung interaktif membandingkan status karir lulusan pada seluruh 14 Program Studi Vokasi.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setVisibleSeries({
                    mencariKerja: true,
                    bekerja: true,
                    wiraswasta: true,
                    melanjutkanPendidikan: true,
                    belumMemungkinkan: true,
                    totalRespons: false,
                  });
                }}
                className="btn btn-outline btn-sm"
                title="Tampilkan semua garis"
              >
                <RotateCcw size={13} />
                <span>Reset Garis</span>
              </button>
            </div>
          </div>

          {/* Interactive Line Series Toggles (Legends) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '0.5rem' }}>
              Filter Garis (Klik untuk tampilkan/sembunyikan):
            </span>
            {seriesMeta.map((s) => {
              const isVisible = visibleSeries[s.id];
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setVisibleSeries(prev => ({ ...prev, [s.id]: !prev[s.id] }))}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '999px',
                    border: `1.5px solid ${isVisible ? s.color : '#e2e8f0'}`,
                    backgroundColor: isVisible ? s.bgColor : '#ffffff',
                    color: isVisible ? s.color : 'var(--text-light)',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: isVisible ? 1 : 0.55,
                  }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: isVisible ? s.color : '#cbd5e1',
                      border: s.isDashed ? '2px dashed #ffffff' : 'none',
                    }}
                  />
                  <span>{s.label}</span>
                  {isVisible && <Check size={13} />}
                </button>
              );
            })}
          </div>

          {/* SVG Multi-Line Chart */}
          <div style={{ position: 'relative', width: '100%', overflowX: 'auto', backgroundColor: '#fafbfc', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border-subtle)' }}>
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              style={{ width: '100%', height: 'auto', minWidth: '850px', display: 'block' }}
              onMouseLeave={() => setHoveredProdiIndex(null)}
            >
              <defs>
                <linearGradient id="gridGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Chart Plot Background */}
              <rect x={padL} y={padT} width={plotW} height={plotH} fill="url(#gridGrad)" rx="6" />

              {/* Y-Axis Grid Lines & Numbers (0, 10, 20, 30, 40, 50) */}
              {[0, 10, 20, 30, 40, 50].map((val) => {
                const y = getYCount(val);
                return (
                  <g key={val}>
                    <line
                      x1={padL}
                      y1={y}
                      x2={padL + plotW}
                      y2={y}
                      stroke={val === 0 ? '#cbd5e1' : '#e2e8f0'}
                      strokeWidth={val === 0 ? '1.5' : '1'}
                      strokeDasharray={val === 0 ? 'none' : '4 4'}
                    />
                    <text
                      x={padL - 10}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="11"
                      fill="#64748b"
                      fontWeight="600"
                      fontFamily="sans-serif"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Y-Axis Label */}
              <text
                x={padL - 25}
                y={padT - 15}
                textAnchor="start"
                fontSize="11"
                fill="#475569"
                fontWeight="700"
              >
                Jumlah (Orang)
              </text>

              {/* Vertical Grid Lines & X-Axis Ticks */}
              {prodiStats.map((p, i) => {
                const x = getX(i);
                const isHovered = hoveredProdiIndex === i;
                return (
                  <g key={p.prodi}>
                    <line
                      x1={x}
                      y1={padT}
                      x2={x}
                      y2={padT + plotH}
                      stroke={isHovered ? 'var(--usu-green)' : '#f1f5f9'}
                      strokeWidth={isHovered ? '2' : '1'}
                      strokeDasharray={isHovered ? 'none' : '2 2'}
                      style={{ transition: 'stroke 0.2s ease' }}
                    />
                    <line x1={x} y1={padT + plotH} x2={x} y2={padT + plotH + 6} stroke="#cbd5e1" strokeWidth="1.5" />

                    {/* Number Badge Index */}
                    <circle
                      cx={x}
                      y={padT + plotH + 20}
                      r="10"
                      fill={isHovered ? 'var(--usu-green)' : '#ffffff'}
                      stroke={isHovered ? 'var(--usu-green-dark)' : '#cbd5e1'}
                      strokeWidth="1.5"
                    />
                    <text
                      x={x}
                      y={padT + plotH + 24}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="800"
                      fill={isHovered ? '#ffffff' : 'var(--usu-green-dark)'}
                    >
                      {i + 1}
                    </text>

                    {/* Prodi Label (Angled) */}
                    <text
                      x={x}
                      y={padT + plotH + 42}
                      textAnchor="end"
                      transform={`rotate(-35, ${x}, ${padT + plotH + 42})`}
                      fontSize="10.5"
                      fontWeight={isHovered ? '800' : '600'}
                      fill={isHovered ? 'var(--usu-green-dark)' : '#334155'}
                      style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
                      onClick={() => setHoveredProdiIndex(i)}
                    >
                      {p.prodi.replace('D3 ', '')}
                    </text>
                  </g>
                );
              })}

              {/* Render Series Lines */}
              {seriesMeta.map((s) => {
                if (!visibleSeries[s.id]) return null;
                const pathData = seriesPaths[s.id];
                if (!pathData) return null;

                return (
                  <g key={s.id}>
                    {/* Drop shadow glow */}
                    <path
                      d={pathData.path}
                      fill="none"
                      stroke={s.color}
                      strokeWidth={s.strokeWidth + 2}
                      strokeOpacity="0.15"
                      strokeLinecap="round"
                    />
                    {/* Main Line */}
                    <path
                      d={pathData.path}
                      fill="none"
                      stroke={s.color}
                      strokeWidth={s.strokeWidth}
                      strokeDasharray={s.isDashed ? '6 4' : 'none'}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Data Points on Line */}
                    {pathData.points.map((pt, idx) => {
                      const isHovered = hoveredProdiIndex === idx;
                      return (
                        <g
                          key={idx}
                          onMouseEnter={() => setHoveredProdiIndex(idx)}
                          style={{ cursor: 'pointer' }}
                        >
                          <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
                          {isHovered && (
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="10"
                              fill={s.color}
                              fillOpacity="0.25"
                            />
                          )}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isHovered ? '6' : '4.5'}
                            fill="#ffffff"
                            stroke={s.color}
                            strokeWidth={isHovered ? '3.5' : '2.5'}
                            style={{ transition: 'r 0.2s ease' }}
                          />
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* Hover Crosshair Overlay Line */}
              {hoveredProdiIndex !== null && (
                <line
                  x1={getX(hoveredProdiIndex)}
                  y1={padT}
                  x2={getX(hoveredProdiIndex)}
                  y2={padT + plotH}
                  stroke="var(--usu-green)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  pointerEvents="none"
                />
              )}
            </svg>

            {/* Hover Tooltip Card */}
            {activeHoveredProdi && (
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  left: `${Math.min(75, Math.max(15, (hoveredProdiIndex / 13) * 100))}%`,
                  transform: 'translateX(-50%)',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid var(--usu-green)',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  boxShadow: '0 10px 30px rgba(0, 54, 32, 0.15)',
                  zIndex: 30,
                  minWidth: '270px',
                  pointerEvents: 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--usu-green-dark)' }}>
                    #{hoveredProdiIndex + 1} {activeHoveredProdi.prodi}
                  </strong>
                  <span className="badge badge-green" style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem' }}>
                    Respon: {activeHoveredProdi.responRatePct || '100'}%
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '0.6rem' }}>
                  Lulusan: <strong>{activeHoveredProdi.lulusan}</strong> mhs • Total Respon: <strong>{activeHoveredProdi.totalRespons}</strong> responden
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.825rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#8b5cf6', fontWeight: 700 }}>● Masih Mencari Kerja:</span>
                    <strong>{activeHoveredProdi.mencariKerja} org</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>● Bekerja:</span>
                    <strong>{activeHoveredProdi.bekerja} org</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#f59e0b', fontWeight: 700 }}>● Wiraswasta:</span>
                    <strong>{activeHoveredProdi.wiraswasta} org</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#0284c7', fontWeight: 700 }}>● Melanjutkan Studi:</span>
                    <strong>{activeHoveredProdi.melanjutkanPendidikan} org</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontWeight: 700 }}>● Belum Memungkinkan:</span>
                    <strong>{activeHoveredProdi.belumMemungkinkan} org</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', fontSize: '0.8rem', color: 'var(--text-light)', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
            <div>* Arahkan kursor / klik titik diagram garis untuk melihat rincian persis tiap Program Studi.</div>
            <div>Sumber Data: File Resmi REKAPITULASI TRACER STUDY LULUSAN 2025.xlsx</div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DIAGRAM GARIS 2: DIAGRAM GARIS RESPON RATE TIAP PROGRAM STUDI (%)         */}
        {/* ========================================================================= */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.25rem' }}>
                <TrendingUp size={16} />
                <span>Diagram Garis Capaian Respon (Area Line Chart)</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--usu-green-dark)', fontWeight: 800, margin: 0 }}>
                Diagram Garis Capaian Respon Rate (%) Tiap Program Studi
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                Kurva persentase tingkat partisipasi alumni menyelesaikan kuesioner pelacakan karir (Target Rata-rata: 98.7%).
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '12px', height: '3px', backgroundColor: '#f59e0b', display: 'inline-block' }} />
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Rata-rata Vokasi (98.7%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '12px', height: '3px', backgroundColor: '#ef4444', display: 'inline-block' }} />
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Batas Standar Min (80.0%)</span>
              </div>
            </div>
          </div>

          {/* SVG Respon Rate Line Chart */}
          <div style={{ width: '100%', overflowX: 'auto', backgroundColor: '#fafbfc', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border-subtle)' }}>
            <svg
              viewBox={`0 0 ${chartW} ${rateH}`}
              style={{ width: '100%', height: 'auto', minWidth: '850px', display: 'block' }}
            >
              <defs>
                <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y Grid lines for 80%, 90%, 100% */}
              {[80, 90, 100].map((val) => {
                const y = getYRate(val);
                return (
                  <g key={val}>
                    <line x1={padL} y1={y} x2={padL + plotW} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                    <text x={padL - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#64748b" fontWeight="600">
                      {val}%
                    </text>
                  </g>
                );
              })}

              {/* Benchmark Reference Lines */}
              <line
                x1={padL}
                y1={getYRate(98.7)}
                x2={padL + plotW}
                y2={getYRate(98.7)}
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="6 3"
              />
              <text x={padL + plotW + 5} y={getYRate(98.7) + 3} fontSize="10" fill="#d97706" fontWeight="700">
                98.7%
              </text>

              <line
                x1={padL}
                y1={getYRate(80.0)}
                x2={padL + plotW}
                y2={getYRate(80.0)}
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text x={padL + plotW + 5} y={getYRate(80.0) + 3} fontSize="10" fill="#dc2626" fontWeight="700">
                80%
              </text>

              {/* Area Fill Under Curve */}
              {rateAreaPath && (
                <path d={rateAreaPath} fill="url(#rateGrad)" />
              )}

              {/* Main Smooth Line */}
              {rateLinePath && (
                <path
                  d={rateLinePath}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data Points and Labels */}
              {ratePoints.map((pt, i) => (
                <g key={i}>
                  <line x1={pt.x} y1={pt.y} x2={pt.x} y2={padT + ratePlotH} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />

                  {/* Percentage badge */}
                  <rect
                    x={pt.x - 20}
                    y={pt.y - 24}
                    width="40"
                    height="18"
                    rx="4"
                    fill={pt.val >= 95 ? '#ecfdf5' : '#fef3c7'}
                    stroke={pt.val >= 95 ? '#10b981' : '#f59e0b'}
                    strokeWidth="1"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 11}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="800"
                    fill={pt.val >= 95 ? '#059669' : '#b45309'}
                  >
                    {pt.val}%
                  </text>

                  {/* Point circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#ffffff"
                    stroke="#10b981"
                    strokeWidth="3"
                  />

                  {/* X-axis Prodi Label */}
                  <text
                    x={pt.x}
                    y={padT + ratePlotH + 28}
                    textAnchor="end"
                    transform={`rotate(-35, ${pt.x}, ${padT + ratePlotH + 28})`}
                    fontSize="10"
                    fontWeight="600"
                    fill="#334155"
                  >
                    {pt.prodi.replace('D3 ', '')}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TABEL DATA REKAPITULASI RESMI (SESUAI FILE EXCEL REKAPITULASI)           */}
        {/* ========================================================================= */}
        <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>
                Sumber: public/data/REKAPITULASI TRACER STUDY LULUSAN 2025.xlsx
              </span>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--usu-green-dark)', fontWeight: 800, margin: 0 }}>
                Tabel Rekapitulasi Data Tiap Program Studi
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Rincian resmi data sheet <em>&quot;Data tiap prodi&quot;</em> mencakup 14 Program Studi Diploma III (D3).
              </p>
            </div>

            <div style={{ position: 'relative', width: '280px' }}>
              <input
                type="text"
                placeholder="Cari program studi..."
                value={prodiFilterSearch}
                onChange={(e) => setProdiFilterSearch(e.target.value)}
                className="input-text"
                style={{ paddingLeft: '2.4rem', height: '40px', fontSize: '0.875rem' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            </div>
          </div>

          <div className="table-wrapper">
            <table className="custom-table" style={{ fontSize: '0.875rem' }}>
              <thead>
                <tr>
                  <th style={{ width: '45px', textAlign: 'center' }}>No</th>
                  <th style={{ minWidth: '220px' }}>Program Studi</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>Lulusan 2024</th>
                  <th style={{ width: '90px', textAlign: 'center', color: '#059669' }}>Bekerja</th>
                  <th style={{ width: '95px', textAlign: 'center', color: '#64748b' }}>Belum Bekerja</th>
                  <th style={{ width: '95px', textAlign: 'center', color: '#d97706' }}>Wiraswasta</th>
                  <th style={{ width: '95px', textAlign: 'center', color: '#0284c7' }}>Melanjutkan</th>
                  <th style={{ width: '105px', textAlign: 'center', color: '#7c3aed' }}>Masih Mencari</th>
                  <th style={{ width: '105px', textAlign: 'center' }}>Total Respons</th>
                  <th style={{ width: '110px', textAlign: 'center' }}>Respon Rate</th>
                </tr>
              </thead>
              <tbody>
                {filteredProdi.map((p, idx) => {
                  const rate = p.responRatePct || (p.lulusan ? ((p.totalRespons / p.lulusan) * 100).toFixed(1) : '0.0');
                  return (
                    <tr key={p.prodi}>
                      <td style={{ textAlign: 'center', color: 'var(--text-light)', fontWeight: 600 }}>{p.no || idx + 1}</td>
                      <td>
                        <strong style={{ color: 'var(--usu-green-dark)' }}>{p.prodi}</strong>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, backgroundColor: '#fafafa' }}>
                        {p.lulusan}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ padding: '0.2rem 0.55rem', borderRadius: '6px', backgroundColor: '#ecfdf5', color: '#059669', fontWeight: 700 }}>
                          {p.bekerja}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ padding: '0.2rem 0.55rem', borderRadius: '6px', backgroundColor: '#f1f5f9', color: '#64748b', fontWeight: 600 }}>
                          {p.belumMemungkinkan}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ padding: '0.2rem 0.55rem', borderRadius: '6px', backgroundColor: '#fffbeb', color: '#d97706', fontWeight: 700 }}>
                          {p.wiraswasta}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ padding: '0.2rem 0.55rem', borderRadius: '6px', backgroundColor: '#f0f9ff', color: '#0284c7', fontWeight: 700 }}>
                          {p.melanjutkanPendidikan}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span style={{ padding: '0.2rem 0.55rem', borderRadius: '6px', backgroundColor: '#f5f3ff', color: '#7c3aed', fontWeight: 700 }}>
                          {p.mencariKerja}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 800, color: 'var(--usu-green-dark)' }}>
                        {p.totalRespons}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: '999px',
                            fontSize: '0.775rem',
                            fontWeight: 800,
                            backgroundColor: Number(rate) >= 95 ? '#dcfce7' : '#fef3c7',
                            color: Number(rate) >= 95 ? '#15803d' : '#b45309',
                          }}
                        >
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#f8fafc', fontWeight: 800, borderTop: '2px solid var(--usu-green)', fontSize: '0.925rem' }}>
                  <td colSpan={2} style={{ textAlign: 'right', color: 'var(--usu-green-dark)', padding: '1rem' }}>
                    TOTAL FAKULTAS VOKASI USU:
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--usu-green-dark)', backgroundColor: '#f1f5f9' }}>
                    {totals.lulusan} Orang
                  </td>
                  <td style={{ textAlign: 'center', color: '#059669' }}>
                    {totals.bekerja}
                  </td>
                  <td style={{ textAlign: 'center', color: '#64748b' }}>
                    {totals.belumMemungkinkan}
                  </td>
                  <td style={{ textAlign: 'center', color: '#d97706' }}>
                    {totals.wiraswasta}
                  </td>
                  <td style={{ textAlign: 'center', color: '#0284c7' }}>
                    {totals.melanjutkanPendidikan}
                  </td>
                  <td style={{ textAlign: 'center', color: '#7c3aed' }}>
                    {totals.mencariKerja}
                  </td>
                  <td style={{ textAlign: 'center', color: 'var(--usu-green-dark)', fontSize: '1rem' }}>
                    {totals.totalRespons}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="badge badge-green" style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                      {overallResponseRate}%
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* PRIVACY & DATA GOVERNANCE CALLOUT */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '2px solid #3b82f6',
            borderRadius: '16px',
            padding: '1.75rem 2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            boxShadow: '0 6px 20px rgba(59, 130, 246, 0.08)',
          }}
        >
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', maxWidth: '750px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Lock size={26} />
            </div>
            <div>
              <h4 style={{ color: '#1e40af', fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                Kerahasiaan Data Responden (Data Pribadi Bersifat Privat)
              </h4>
              <p style={{ color: '#1e3a8a', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                Sesuai dengan <strong>Undang-Undang Perlindungan Data Pribadi (UU No. 27 Tahun 2022)</strong> dan etika penelitian,
                seluruh data individual responden alumni (Nama Lengkap, NIM, Nomor Kontak, Detail Tempat Kerja, dan Riwayat Penghasilan)
                <strong> bersifat rahasia/private</strong>. Halaman publik ini hanya mempublikasikan visualisasi diagram garis dan rekapitulasi data agregat.
              </p>
            </div>
          </div>

          <div>
            <Link
              href="/admin/login"
              className="btn btn-outline"
              style={{
                borderColor: '#2563eb',
                color: '#1d4ed8',
                backgroundColor: '#eff6ff',
                fontWeight: 700,
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1.25rem',
              }}
            >
              <ShieldCheck size={16} />
              <span>Login Admin / Kelola Data</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

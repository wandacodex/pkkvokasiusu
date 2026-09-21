'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  ExternalLink,
  Search,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  CheckCircle2,
  X,
  Clock,
  Tag,
  ShieldCheck,
  AlertCircle,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import {
  ACADEMIC_CALENDARS,
  LEGEND_ITEMS,
  CATEGORY_NAMES_MAP,
  MONTH_NAMES_INDO,
  formatIndoDate,
  formatIndoDateRange
} from '@/src/lib/kalenderData';

const DAYS_OF_WEEK = [
  { name: 'Senin', isWeekend: false },
  { name: 'Selasa', isWeekend: false },
  { name: 'Rabu', isWeekend: false },
  { name: 'Kamis', isWeekend: false },
  { name: 'Jumat', isWeekend: false },
  { name: 'Sabtu', isWeekend: true },
  { name: 'Minggu', isWeekend: true },
];

const CATEGORY_OPTIONS = [
  { value: 'registrasi', label: 'Registrasi Akademik' },
  { value: 'perkuliahan', label: 'Kegiatan Akademik Perkuliahan' },
  { value: 'mbkm', label: 'PLPS (Praktik Lapangan Persekolahan / MBKM)' },
  { value: 'mkwu', label: 'Mata Kuliah Wajib Umum' },
  { value: 'evaluasi-masa-studi', label: 'Evaluasi Masa Studi' },
  { value: 'dies-wisuda', label: 'Dies Natalis dan Wisuda' },
  { value: 'semester-antara', label: 'Semester Antara' },
  { value: 'libur', label: 'Hari Libur Nasional & Cuti Bersama' },
];

export default function KalenderAkademikPage() {
  const { data: session } = useSession();
  const isAdmin = Boolean(session?.user);

  // 1. Academic Calendars State (loaded from API with local fallback)
  const [calendars, setCalendars] = useState(ACADEMIC_CALENDARS);
  const [loading, setLoading] = useState(true);
  const [selectedYearKey, setSelectedYearKey] = useState('2026/2027');

  // Toast feedback
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // Fetch from API
  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/kalender');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setCalendars(json.data);
      }
    } catch (err) {
      console.error('Failed to load live calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const currentCalendar = useMemo(() => {
    return calendars.find(c => c.year === selectedYearKey) || calendars[0] || ACADEMIC_CALENDARS[0];
  }, [calendars, selectedYearKey]);

  // 2. Monthly Calendar state: start with September 2026 for 2026/2027, or September 2025 for 2025/2026
  const [viewDate, setViewDate] = useState(() => {
    return selectedYearKey === '2026/2027' ? new Date(2026, 8, 1) : new Date(2025, 8, 1);
  });

  // 3. Detailed Schedule Filters
  const [activeTab, setActiveTab] = useState('semua'); // 'semua' | 'ganjil' | 'genap'
  const [searchQuery, setSearchQuery] = useState('');
  const [modalEvent, setModalEvent] = useState(null);

  // 4. Admin CRUD Modals
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminModalMode, setAdminModalMode] = useState('add'); // 'add' | 'edit'
  const [adminForm, setAdminForm] = useState({
    id: '',
    title: '',
    category: 'perkuliahan',
    semester: 'ganjil',
    startDate: '',
    endDate: '',
    type: 'tidak-libur',
    description: '',
    link: '',
    time: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, title: '' });
  const [resetConfirm, setResetConfirm] = useState(false);

  // When year changes, update viewDate to September of that academic year
  const handleYearChange = (e) => {
    const newYear = e.target.value;
    setSelectedYearKey(newYear);
    if (newYear === '2026/2027') {
      setViewDate(new Date(2026, 8, 1));
    } else {
      setViewDate(new Date(2025, 8, 1));
    }
  };

  // Month navigation
  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const jumpToToday = () => {
    setViewDate(new Date());
  };

  // Compute Calendar Days grid for the current month
  const calendarGrid = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1);
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    // Previous month trailing days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const iso = prevDate.toISOString().slice(0, 10);
      cells.push({
        dayNumber: dayNum,
        isoString: iso,
        isCurrentMonth: false,
        isWeekend: prevDate.getDay() === 0 || prevDate.getDay() === 6,
        events: []
      });
    }

    const pad = (n) => String(n).padStart(2, '0');

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${year}-${pad(month + 1)}-${pad(d)}`;
      const dayDate = new Date(year, month, d);
      const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;

      const dayEvents = (currentCalendar.events || []).filter(ev => {
        return iso >= ev.startDate && iso <= ev.endDate;
      });

      let periodType = null;
      const typesOdd = currentCalendar.sectionTypesOdd;
      const typesEven = currentCalendar.sectionTypesEven;

      const inRange = (range) => range && range.length === 2 && iso >= range[0] && iso <= range[1];

      if (inRange(typesOdd?.uts) || inRange(typesEven?.uts)) {
        periodType = 'uts';
      } else if (inRange(typesOdd?.uas) || inRange(typesEven?.uas)) {
        periodType = 'uas';
      } else if (inRange(typesEven?.shortSemester)) {
        periodType = 'semester-antara';
      } else if (inRange(typesOdd?.registration) || inRange(typesEven?.registration)) {
        periodType = 'registrasi';
      } else if (inRange(typesOdd?.lecturePeriods) || inRange(typesEven?.lecturePeriods)) {
        periodType = 'perkuliahan';
      }

      const allGrads = [...(typesOdd?.graduations || []), ...(typesEven?.graduations || [])];
      const isGraduationDay = allGrads.some(g => inRange(g));

      cells.push({
        dayNumber: d,
        isoString: iso,
        isCurrentMonth: true,
        isWeekend,
        isToday: iso === new Date().toISOString().slice(0, 10),
        periodType,
        isGraduationDay,
        events: dayEvents
      });
    }

    // Next month leading days to complete grid
    const totalCells = cells.length;
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      const iso = nextDate.toISOString().slice(0, 10);
      cells.push({
        dayNumber: i,
        isoString: iso,
        isCurrentMonth: false,
        isWeekend: nextDate.getDay() === 0 || nextDate.getDay() === 6,
        events: []
      });
    }

    return cells;
  }, [viewDate, currentCalendar]);

  const getEventDotColor = (ev) => {
    if (ev.type === 'libur' || ev.type === 'cuti-bersama') return '#e11d48';
    if (ev.category === 'perkuliahan') return '#33875f';
    if (ev.category === 'mbkm') return '#f9a63a';
    if (ev.category === 'registrasi') return '#059669';
    if (ev.category === 'dies-wisuda') return '#18181b';
    if (ev.category === 'semester-antara') return '#dc2626';
    if (ev.category === 'mkwu') return '#2563eb';
    return '#6b7280';
  };

  // Group events by Semester and Category for Detailed Tables
  const ganjilTables = useMemo(() => {
    const list = (currentCalendar.events || []).filter(e => e.semester === 'ganjil');

    const groups = [
      {
        id: 'awal-akhir-ganjil',
        category: `Awal dan Akhir Semester T.A. ${currentCalendar.year}`,
        rows: (currentCalendar.oddStartEnd || []).map((item, idx) => ({
          no: idx + 1,
          id: `static_odd_${idx}`,
          isStatic: true,
          title: item.title,
          date: item.dateFormatted,
          description: item.description,
          link: item.link
        }))
      },
      {
        id: 'registrasi-ganjil',
        category: 'Registrasi Akademik',
        categoryKey: 'registrasi',
        rows: list.filter(e => e.category === 'registrasi').map((e, idx) => ({
          no: idx + 1,
          ...e,
          date: e.dateFormatted
        }))
      },
      {
        id: 'perkuliahan-ganjil',
        category: 'Kegiatan Akademik Perkuliahan',
        categoryKey: 'perkuliahan',
        rows: list.filter(e => e.category === 'perkuliahan').map((e, idx) => ({
          no: idx + 1,
          ...e,
          date: e.dateFormatted
        }))
      },
      {
        id: 'plps-ganjil',
        category: 'PLPS (Praktik Lapangan Persekolahan / MBKM)',
        categoryKey: 'mbkm',
        rows: list.filter(e => e.category === 'mbkm').map((e, idx) => ({
          no: idx + 1,
          ...e,
          date: e.dateFormatted
        }))
      },
      {
        id: 'mkwu-ganjil',
        category: 'Mata Kuliah Wajib Umum',
        categoryKey: 'mkwu',
        rows: list.filter(e => e.category === 'mkwu').map((e, idx) => ({
          no: idx + 1,
          ...e,
          date: e.dateFormatted
        }))
      },
      {
        id: 'evaluasi-ganjil',
        category: 'Evaluasi Masa Studi',
        categoryKey: 'evaluasi-masa-studi',
        rows: list.filter(e => e.category === 'evaluasi-masa-studi').map((e, idx) => ({
          no: idx + 1,
          ...e,
          date: e.dateFormatted
        }))
      },
      {
        id: 'wisuda-ganjil',
        category: 'Dies Natalis dan Wisuda',
        categoryKey: 'dies-wisuda',
        rows: list.filter(e => e.category === 'dies-wisuda').map((e, idx) => ({
          no: idx + 1,
          ...e,
          date: e.dateFormatted
        }))
      }
    ];

    return groups.filter(g => g.rows.length > 0);
  }, [currentCalendar]);

  const genapTables = useMemo(() => {
    const list = (currentCalendar.events || []).filter(e => e.semester === 'genap');

    const groups = [
      {
        id: 'awal-akhir-genap',
        category: `Awal dan Akhir Semester T.A. ${currentCalendar.year}`,
        rows: (currentCalendar.evenStartEnd || []).map((item, idx) => ({
          no: idx + 1,
          id: `static_even_${idx}`,
          isStatic: true,
          title: item.title,
          date: item.dateFormatted,
          description: item.description,
          link: item.link
        }))
      },
      {
        id: 'registrasi-genap',
        category: 'Registrasi Akademik',
        categoryKey: 'registrasi',
        rows: list.filter(e => e.category === 'registrasi').map((e, idx) => ({
          no: idx + 1,
          ...e,
          date: e.dateFormatted
        }))
      },
      {
        id: 'perkuliahan-genap',
        category: 'Kegiatan Akademik Perkuliahan',
        categoryKey: 'perkuliahan',
        rows: list.filter(e => e.category === 'perkuliahan').map((e, idx) => ({
          no: idx + 1,
          ...e,
          date: e.dateFormatted
        }))
      },
      {
        id: 'semester-antara-genap',
        category: 'Semester Antara',
        categoryKey: 'semester-antara',
        rows: list.filter(e => e.category === 'semester-antara').map((e, idx) => ({
          no: idx + 1,
          ...e,
          date: e.dateFormatted
        }))
      },
      {
        id: 'plps-genap',
        category: 'PLPS (Praktik Lapangan Persekolahan / MBKM)',
        categoryKey: 'mbkm',
        rows: list.filter(e => e.category === 'mbkm').map((e, idx) => ({
          no: idx + 1,
          ...e,
          date: e.dateFormatted
        }))
      },
      {
        id: 'mkwu-genap',
        category: 'Mata Kuliah Wajib Umum',
        categoryKey: 'mkwu',
        rows: list.filter(e => e.category === 'mkwu').map((e, idx) => ({
          no: idx + 1,
          ...e,
          date: e.dateFormatted
        }))
      },
      {
        id: 'evaluasi-genap',
        category: 'Evaluasi Masa Studi',
        categoryKey: 'evaluasi-masa-studi',
        rows: list.filter(e => e.category === 'evaluasi-masa-studi').map((e, idx) => ({
          no: idx + 1,
          ...e,
          date: e.dateFormatted
        }))
      },
      {
        id: 'wisuda-genap',
        category: 'Dies Natalis dan Wisuda',
        categoryKey: 'dies-wisuda',
        rows: list.filter(e => e.category === 'dies-wisuda').map((e, idx) => ({
          no: idx + 1,
          ...e,
          date: e.dateFormatted
        }))
      },
      {
        id: 'libur-genap',
        category: 'Libur (Hari Libur Nasional & Cuti Bersama)',
        categoryKey: 'libur',
        rows: list.filter(e => e.category === 'libur').map((e, idx) => ({
          no: idx + 1,
          ...e,
          date: e.dateFormatted
        }))
      }
    ];

    return groups.filter(g => g.rows.length > 0);
  }, [currentCalendar]);

  const filterTableGroup = (tables) => {
    if (!searchQuery) return tables;

    return tables
      .map(table => {
        const filteredRows = table.rows.filter(r => {
          const matchTitle = r.title.toLowerCase().includes(searchQuery.toLowerCase());
          const matchDate = (r.date || '').toLowerCase().includes(searchQuery.toLowerCase());
          const matchDesc = (r.description || '').toLowerCase().includes(searchQuery.toLowerCase());
          return matchTitle || matchDate || matchDesc;
        });

        if (filteredRows.length === 0) return null;
        return { ...table, rows: filteredRows };
      })
      .filter(Boolean);
  };

  const filteredGanjilTables = useMemo(() => filterTableGroup(ganjilTables), [ganjilTables, searchQuery]);
  const filteredGenapTables = useMemo(() => filterTableGroup(genapTables), [genapTables, searchQuery]);

  // Admin CRUD Handlers
  const handleOpenAdd = (defaultCategory = 'perkuliahan', defaultSemester = 'ganjil', defaultDate = '') => {
    const todayIso = new Date().toISOString().slice(0, 10);
    const targetDate = defaultDate || todayIso;
    setAdminModalMode('add');
    setAdminForm({
      id: '',
      title: '',
      category: defaultCategory,
      semester: defaultSemester,
      startDate: targetDate,
      endDate: targetDate,
      type: 'tidak-libur',
      description: '',
      link: '',
      time: ''
    });
    setAdminModalOpen(true);
  };

  const handleOpenEdit = (event) => {
    if (event.isStatic) {
      alert('Jadwal awal dan akhir semester merupakan batas patokan baku sistem akademik.');
      return;
    }
    setAdminModalMode('edit');
    setAdminForm({
      id: event.id,
      title: event.title || '',
      category: event.category || 'perkuliahan',
      semester: event.semester || 'ganjil',
      startDate: event.startDate || '',
      endDate: event.endDate || event.startDate || '',
      type: event.type || 'tidak-libur',
      description: event.description || '',
      link: event.link || '',
      time: event.time || ''
    });
    setAdminModalOpen(true);
  };

  const handleAdminFormSubmit = async (e) => {
    e.preventDefault();
    if (!adminForm.title.trim() || !adminForm.startDate) {
      alert('Judul kegiatan dan tanggal mulai wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      const isEdit = adminModalMode === 'edit';
      const method = isEdit ? 'PUT' : 'POST';
      const payload = {
        year: selectedYearKey,
        ...adminForm
      };

      const res = await fetch('/api/kalender', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        showToast(
          isEdit ? 'Kegiatan akademik berhasil diperbarui!' : 'Kegiatan akademik baru berhasil ditambahkan!',
          'success'
        );
        setAdminModalOpen(false);
        await fetchCalendarData();
      } else {
        alert(json.error || 'Gagal menyimpan kegiatan.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan saat menyimpan data.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.id) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/kalender?year=${encodeURIComponent(selectedYearKey)}&id=${encodeURIComponent(deleteConfirm.id)}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        showToast('Kegiatan akademik berhasil dihapus.', 'success');
        setDeleteConfirm({ open: false, id: null, title: '' });
        await fetchCalendarData();
      } else {
        alert(json.error || 'Gagal menghapus kegiatan.');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal terhubung ke server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetToDefault = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/kalender?reset=true', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        showToast('Data kalender akademik berhasil direset ke standar resmi USU!', 'success');
        setResetConfirm(false);
        await fetchCalendarData();
      } else {
        alert(json.error || 'Gagal mereset kalender.');
      }
    } catch (err) {
      console.error(err);
      alert('Gagal mereset kalender.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* Toast Notification */}
      {toast.show && (
        <div
          style={{
            position: 'fixed',
            top: '5rem',
            right: '1.5rem',
            backgroundColor: toast.type === 'success' ? '#006535' : '#b91c1c',
            color: '#ffffff',
            padding: '0.85rem 1.4rem',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* 1. Headline Hero Banner Section */}
      <section
        style={{
          position: 'relative',
          minHeight: '260px',
          overflow: 'hidden',
          paddingTop: '3.5rem',
          paddingBottom: '6rem',
          backgroundColor: '#005028',
        }}
      >
        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #006535 15.94%, #038A47 33.07%, #43AD35 50.77%, rgba(161, 197, 23, 0) 72.6%)',
            zIndex: 1,
          }}
        />

        {/* USU Ornament Motif on Left */}
        <div
          style={{
            position: 'absolute',
            left: '2%',
            bottom: '-15%',
            width: '280px',
            height: '280px',
            opacity: 0.12,
            backgroundImage: 'url(/ornament/flower-ora.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Right Campus Building Background Image */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '55%',
            height: '100%',
            zIndex: 0,
            opacity: 0.28,
            backgroundImage: 'url(https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1400)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 10, maxWidth: '1240px', margin: '0 auto' }}>
          {/* Breadcrumb Bar */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
            <ol style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem' }}>
              <li>
                <Link href="/" style={{ color: 'rgba(255, 255, 255, 0.85)', display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
                  <span>Beranda</span>
                </Link>
              </li>
              <li style={{ color: 'rgba(255, 255, 255, 0.5)' }}>/</li>
              <li>
                <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Pendidikan</span>
              </li>
              <li style={{ color: 'rgba(255, 255, 255, 0.5)' }}>/</li>
              <li>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>Kalender Akademik</span>
              </li>
            </ol>
          </nav>

          {/* Titles */}
          <div style={{ maxWidth: '650px' }}>
            <h1
              style={{
                color: '#ffffff',
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '0.5rem',
                fontFamily: 'Outfit, sans-serif',
                letterSpacing: '-0.02em',
              }}
            >
              Kalender Akademik
            </h1>
            <p
              style={{
                color: '#fab300',
                fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                fontWeight: 700,
                margin: 0,
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              Universitas Sumatera Utara
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Academic Calendar Section Card (Symmetrical & Centered) */}
      <div className="container" style={{ position: 'relative', zIndex: 20, maxWidth: '1240px', margin: '0 auto', paddingLeft: '1rem', paddingRight: '1rem', boxSizing: 'border-box' }}>
        <div
          id="academic-calendar"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
            padding: 'clamp(1rem, 2.5vw, 2.25rem)',
            marginTop: 'clamp(-3.5rem, -5vw, -2.5rem)',
            border: '1px solid #edf2f7',
            boxSizing: 'border-box',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Admin Mode Bar if Logged In */}
          {isAdmin && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                backgroundColor: '#f0fdf4',
                border: '1.5px solid #86efac',
                padding: '0.85rem 1.25rem',
                borderRadius: '12px',
                marginBottom: '1.75rem',
                boxSizing: 'border-box',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#006535',
                    color: '#ffffff',
                    flexShrink: 0,
                  }}
                >
                  <ShieldCheck size={16} />
                </span>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#006535' }}>
                    Mode Pengelola Kalender Akademik Aktif
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#166534' }}>
                    Anda memiliki hak akses untuk menambah, mengubah, dan menghapus jadwal akademik resmi.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleOpenAdd('perkuliahan', 'ganjil')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#006535',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0, 101, 53, 0.2)',
                  }}
                  className="hover:bg-[#005028]"
                >
                  <Plus size={16} />
                  <span>Tambah Kegiatan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setResetConfirm(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    color: '#b91c1c',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    border: '1px solid #fca5a5',
                    cursor: 'pointer',
                  }}
                  className="hover:bg-red-50"
                  title="Kembalikan data ke kalender resmi standar USU"
                >
                  <RotateCcw size={14} />
                  <span>Reset Standar USU</span>
                </button>
              </div>
            </div>
          )}

          {/* Top Control Bar: Academic Year Selector + Download PDF Button */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.25rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid #f0f0f0',
              marginBottom: '2rem',
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            {/* Year Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#18181b' }}>
                Pilih Tahun Akademik:
              </span>
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedYearKey}
                  onChange={handleYearChange}
                  style={{
                    appearance: 'none',
                    backgroundColor: '#F5F5F5',
                    border: '1.5px solid #DEDEDE',
                    borderRadius: '10px',
                    padding: '0.55rem 2.5rem 0.55rem 1rem',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  className="hover:border-[#006535] focus:border-[#006535]"
                >
                  <option value="2026/2027">Tahun Akademik 2026/2027 (Aktif)</option>
                  <option value="2025/2026">Tahun Akademik 2025/2026</option>
                </select>
                <div
                  style={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#4b5563',
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Official SK PDF Download Button */}
            <a
              href={currentCalendar.pdfUrl}
              target="_blank"
              rel="noreferrer noopener"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.65rem 1.15rem',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              className="hover:shadow-md hover:border-[#006535]"
              title="Unduh Salinan Resmi SK Kalender Akademik USU"
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                  flexShrink: 0,
                }}
              >
                <FileText size={20} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1f2937', lineHeight: 1.2 }}>
                  Unduh Kalender Akademik
                </div>
                <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>
                  Salinan Resmi PDF
                </div>
              </div>
              <Download size={16} style={{ color: '#006535', marginLeft: '0.25rem' }} />
            </a>
          </div>

          {/* 3. Interactive Monthly Calendar Grid (Sama Persis seperti Web Resmi USU) */}
          <div className="calendar-container" style={{ marginBottom: '2.5rem', width: '100%' }}>
            {/* Symmetrical Month Header */}
            <div
              className="kalender-month-header"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
                gap: '1rem',
              }}
            >
              {/* Left Column: Navigation Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={prevMonth}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    color: '#0f172a',
                    padding: '0.35rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    transition: 'all 0.15s',
                  }}
                  className="hover:bg-slate-200"
                  title="Bulan Sebelumnya"
                  aria-label="Bulan Sebelumnya"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    color: '#0f172a',
                    padding: '0.35rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    transition: 'all 0.15s',
                  }}
                  className="hover:bg-slate-200"
                  title="Bulan Berikutnya"
                  aria-label="Bulan Berikutnya"
                >
                  <ChevronRight size={20} />
                </button>
                <button
                  type="button"
                  onClick={jumpToToday}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #DEDEDE',
                    borderRadius: '6px',
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#4b5563',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  className="hover:border-black hover:text-black"
                >
                  Bulan Ini
                </button>
              </div>

              {/* Center: Month & Year Title */}
              <h2
                style={{
                  fontSize: 'clamp(1.2rem, 2.2vw, 1.5rem)',
                  fontWeight: 700,
                  color: '#0f172a',
                  textAlign: 'center',
                  margin: 0,
                  fontFamily: 'Outfit, sans-serif',
                  letterSpacing: '-0.01em',
                }}
              >
                {MONTH_NAMES_INDO[viewDate.getMonth()]} {viewDate.getFullYear()}
              </h2>

              {/* Right Column: Academic Year Label */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#006535',
                    backgroundColor: '#f0fdf4',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    border: '1px solid #bbf7d0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <CalendarDays size={14} />
                  <span>T.A. {currentCalendar.year}</span>
                </span>
              </div>
            </div>

            {/* Calendar Table Grid Containment: Mengamankan agar TIDAK PERNAH KELUAR OUTLINE */}
            <div
              style={{
                width: '100%',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                borderRadius: '12px',
                border: '1px solid #DEDEDE',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  minWidth: '770px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                  backgroundColor: '#ffffff',
                }}
              >
                {/* Row 1: The 7 Day Headers */}
                {DAYS_OF_WEEK.map((day, idx) => (
                  <div
                    key={`day-header-${idx}`}
                    style={{
                      padding: '0.75rem',
                      textAlign: 'right',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      lineHeight: '1.25rem',
                      color: day.isWeekend ? '#dc2626' : '#0f172a',
                      backgroundColor: '#fbfcfd',
                      borderRight: idx % 7 === 6 ? 'none' : '1px solid #DEDEDE',
                      borderBottom: '1px solid #DEDEDE',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span>{day.name}</span>
                  </div>
                ))}

                {/* Rows 2..N: Calendar Day Cells */}
                {calendarGrid.map((cell, idx) => {
                  let bg = '#ffffff';
                  if (!cell.isCurrentMonth) {
                    bg = '#F8FAFC';
                  } else if (cell.periodType === 'perkuliahan') {
                    bg = '#edf7ed'; // bg-light-green-50
                  } else if (cell.periodType === 'uts') {
                    bg = '#fff3e0'; // bg-light-orange-50
                  } else if (cell.periodType === 'uas') {
                    bg = '#e3f2fd'; // bg-blue-50
                  } else if (cell.periodType === 'semester-antara') {
                    bg = '#ffebee'; // bg-error-50
                  } else if (cell.periodType === 'registrasi') {
                    bg = '#fefce8'; // bg-tetiary-100
                  }

                  const isLastColumn = idx % 7 === 6;

                  return (
                    <div
                      key={`day-cell-${idx}`}
                      onClick={() => {
                        if (isAdmin && cell.isCurrentMonth) {
                          const sem = (viewDate.getMonth() >= 7 || viewDate.getMonth() === 0) ? 'ganjil' : 'genap';
                          handleOpenAdd('perkuliahan', sem, cell.isoString);
                        }
                      }}
                      style={{
                        minHeight: '120px',
                        height: '100%',
                        padding: '0.65rem 0.5rem',
                        backgroundColor: bg,
                        borderRight: isLastColumn ? 'none' : '1px solid #DEDEDE',
                        borderBottom: '1px solid #DEDEDE',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                        position: 'relative',
                        textAlign: 'right',
                        cursor: isAdmin && cell.isCurrentMonth ? 'pointer' : 'default',
                        boxSizing: 'border-box',
                        minWidth: 0,
                        overflow: 'hidden',
                      }}
                      className={cell.isCurrentMonth ? 'hover:brightness-95' : ''}
                      title={isAdmin && cell.isCurrentMonth ? 'Klik untuk tambah kegiatan pada tanggal ini' : undefined}
                    >
                      {/* Day Number Header: flex justify-end */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '24px' }}>
                        {cell.isGraduationDay && (
                          <span
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: '2px solid #000000',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: 'auto',
                            }}
                            title="Hari Wisuda Universitas"
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000' }} />
                          </span>
                        )}
                        <div
                          style={{
                            fontSize: '0.875rem',
                            fontWeight: cell.isToday ? 700 : 500,
                            color: !cell.isCurrentMonth
                              ? '#94a3b8'
                              : cell.isWeekend
                              ? '#dc2626'
                              : '#0f172a',
                            width: cell.isToday ? '26px' : 'auto',
                            height: cell.isToday ? '26px' : 'auto',
                            borderRadius: cell.isToday ? '50%' : 'none',
                            backgroundColor: cell.isToday ? '#006535' : 'transparent',
                            color: cell.isToday ? '#ffffff' : undefined,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {cell.dayNumber}
                        </div>
                      </div>

                      {/* Event Chips List: SAMA PERSIS SEPERTI WEB USU dengan Proteksi Overflow */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.15rem',
                          overflowY: 'auto',
                          flex: 1,
                          minHeight: 0,
                          width: '100%',
                        }}
                        className="no-scrollbar"
                      >
                        {cell.events.slice(0, 3).map((ev, evIdx) => (
                          <div
                            key={evIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isAdmin) {
                                handleOpenEdit(ev);
                              } else {
                                setModalEvent(ev);
                              }
                            }}
                            style={{
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              padding: '0.2rem 0.35rem',
                              borderRadius: '4px',
                              transition: 'background-color 0.2s ease',
                              width: '100%',
                              minWidth: 0,
                              boxSizing: 'border-box',
                            }}
                            className="hover:bg-[rgba(100,100,100,0.1)]"
                            title={`${ev.title} (${ev.dateFormatted})${isAdmin ? ' - Klik untuk edit' : ''}`}
                          >
                            <div
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                backgroundColor: getEventDotColor(ev),
                                flexShrink: 0,
                              }}
                            />
                            <div
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                textAlign: 'left',
                                fontSize: '0.78rem',
                                lineHeight: '1.2rem',
                                color: '#1e293b',
                                fontWeight: 500,
                                minWidth: 0,
                                flex: 1,
                              }}
                            >
                              {ev.title}
                            </div>
                          </div>
                        ))}

                        {cell.events.length > 3 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setModalEvent(cell.events[0]);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '0.1rem 0.35rem',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: '#006535',
                              cursor: 'pointer',
                              textAlign: 'left',
                              marginTop: 'auto',
                            }}
                          >
                            +{cell.events.length - 3} lainnya
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Legend / Keterangan: SAMA PERSIS SEPERTI WEB RESMI USU */}
          <div style={{ marginTop: '2.5rem', marginBottom: '3rem', width: '100%' }}>
            <p
              style={{
                fontSize: 'clamp(0.88rem, 1.2vw, 1rem)',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '0.85rem',
              }}
            >
              Keterangan Warna Kalender:
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: '0.75rem 1.25rem',
                backgroundColor: '#f8fafc',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ width: '36px', height: '22px', border: '1px solid #DEDEDE', backgroundColor: '#fefce8', borderRadius: '4px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 500 }}>Registrasi Akademik</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ width: '36px', height: '22px', border: '1px solid #DEDEDE', backgroundColor: '#edf7ed', borderRadius: '4px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 500 }}>Kegiatan Perkuliahan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ width: '36px', height: '22px', border: '1px solid #DEDEDE', backgroundColor: '#fff3e0', borderRadius: '4px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 500 }}>Ujian Tengah Semester (UTS)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ width: '36px', height: '22px', border: '1px solid #DEDEDE', backgroundColor: '#e3f2fd', borderRadius: '4px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 500 }}>Ujian Akhir Semester (UAS)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ width: '36px', height: '22px', border: '1px solid #DEDEDE', backgroundColor: '#ffebee', borderRadius: '4px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 500 }}>Semester Antara</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span
                  style={{
                    width: '22px',
                    height: '22px',
                    margin: '0 7px',
                    border: '2px solid #000000',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#000000' }} />
                </span>
                <span style={{ fontSize: '0.84rem', color: '#1e293b', fontWeight: 500 }}>Wisuda Universitas</span>
              </div>
            </div>
          </div>

          {/* 5. Detailed Schedule Tables & Filters Section (Symmetrical Fixed-Width Columns) */}
          <div style={{ width: '100%' }}>
            {/* Filter & Search Controls Bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '2rem',
                paddingBottom: '1.25rem',
                borderBottom: '1.5px solid #f1f5f9',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              {/* Semester Tabs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('semua')}
                  style={{
                    padding: '0.55rem 1.2rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: activeTab === 'semua' ? '#006535' : '#f1f5f9',
                    color: activeTab === 'semua' ? '#ffffff' : '#475569',
                    transition: 'all 0.2s',
                    boxShadow: activeTab === 'semua' ? '0 2px 4px rgba(0,101,53,0.2)' : 'none',
                  }}
                >
                  Semua Semester
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ganjil')}
                  style={{
                    padding: '0.55rem 1.2rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: activeTab === 'ganjil' ? '#006535' : '#f1f5f9',
                    color: activeTab === 'ganjil' ? '#ffffff' : '#475569',
                    transition: 'all 0.2s',
                    boxShadow: activeTab === 'ganjil' ? '0 2px 4px rgba(0,101,53,0.2)' : 'none',
                  }}
                >
                  Semester Ganjil
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('genap')}
                  style={{
                    padding: '0.55rem 1.2rem',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: activeTab === 'genap' ? '#006535' : '#f1f5f9',
                    color: activeTab === 'genap' ? '#ffffff' : '#475569',
                    transition: 'all 0.2s',
                    boxShadow: activeTab === 'genap' ? '0 2px 4px rgba(0,101,53,0.2)' : 'none',
                  }}
                >
                  Semester Genap
                </button>
              </div>

              {/* Instant Search Box */}
              <div style={{ position: 'relative', width: '100%', maxWidth: '340px', minWidth: '220px', flex: '1 1 240px', boxSizing: 'border-box' }}>
                <input
                  type="text"
                  placeholder="Cari kegiatan (mis: KRS, UTS, Wisuda)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 1rem 0.55rem 2.25rem',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.85rem',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s',
                  }}
                  className="focus:border-[#006535]"
                />
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '0.65rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Reusable Symmetrical Schedule Table Component */}
            {/* --- SEMESTER GANJIL TABLES --- */}
            {(activeTab === 'semua' || activeTab === 'ganjil') && (
              <div style={{ marginBottom: '3.5rem', width: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '2px solid #f1f5f9',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)',
                        fontWeight: 800,
                        color: '#0f172a',
                        margin: 0,
                        fontFamily: 'Outfit, sans-serif',
                        textTransform: 'uppercase',
                        letterSpacing: '0.01em',
                      }}
                    >
                      KALENDER AKADEMIK UNIVERSITAS SUMATERA UTARA SEMESTER GANJIL T.A. {currentCalendar.year}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem' }}>
                      Rincian agenda dan kegiatan akademik operasional perkuliahan semester ganjil
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleOpenAdd('perkuliahan', 'ganjil')}
                      style={{
                        padding: '0.45rem 0.95rem',
                        borderRadius: '8px',
                        backgroundColor: '#006535',
                        color: '#ffffff',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 2px 4px rgba(0,101,53,0.15)',
                        flexShrink: 0,
                      }}
                      className="hover:bg-[#005028]"
                    >
                      <Plus size={15} />
                      <span>Tambah Kegiatan Ganjil</span>
                    </button>
                  )}
                </div>

                {filteredGanjilTables.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    Tidak ada kegiatan yang sesuai dengan kata kunci pencarian pada Semester Ganjil.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
                    {filteredGanjilTables.map((table) => (
                      <div
                        key={table.id}
                        style={{
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                          backgroundColor: '#ffffff',
                          width: '100%',
                          boxSizing: 'border-box',
                        }}
                      >
                        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
                          {/* Fixed Column Widths across ALL tables ensuring 100% vertical alignment symmetry */}
                          <table style={{ width: '100%', minWidth: '720px', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                            <colgroup>
                              <col style={{ width: '50px' }} />
                              <col style={{ width: '35%' }} />
                              <col style={{ width: '27%' }} />
                              <col style={{ width: 'auto' }} />
                              <col style={{ width: isAdmin ? '105px' : '75px' }} />
                            </colgroup>
                            <thead>
                              <tr style={{ backgroundColor: '#FEEBC8', color: '#18181b', borderBottom: '1.5px solid #FBD38D' }}>
                                <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                                  No.
                                </th>
                                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700 }}>
                                  {table.category}
                                </th>
                                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700 }}>
                                  Jadwal
                                </th>
                                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700 }}>
                                  Keterangan
                                </th>
                                <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                                  {isAdmin ? 'Aksi / Link' : 'Link'}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {table.rows.map((row, rIdx) => (
                                <tr
                                  key={row.id || rIdx}
                                  style={{
                                    backgroundColor: rIdx % 2 === 0 ? '#ffffff' : '#f8fafc',
                                    borderBottom: '1px solid #edf2f7',
                                    transition: 'background 0.15s',
                                  }}
                                  className="hover:bg-[#f1f5f9]"
                                >
                                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
                                    {row.no}
                                  </td>
                                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', wordBreak: 'break-word', lineHeight: 1.4 }}>
                                    {row.title}
                                  </td>
                                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#006535', fontWeight: 700, whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.4 }}>
                                    {row.date}
                                  </td>
                                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#475569', lineHeight: 1.45, wordBreak: 'break-word' }}>
                                    {row.description || '-'}
                                  </td>
                                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}>
                                      {row.link && (
                                        <a
                                          href={row.link}
                                          target="_blank"
                                          rel="noreferrer noopener"
                                          style={{ color: '#006535', display: 'inline-flex', alignItems: 'center' }}
                                          title="Buka Tautan Resmi"
                                        >
                                          <ExternalLink size={15} />
                                        </a>
                                      )}

                                      {isAdmin && !row.isStatic && (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => handleOpenEdit(row)}
                                            style={{
                                              padding: '4px',
                                              borderRadius: '4px',
                                              border: '1px solid #cbd5e1',
                                              backgroundColor: '#ffffff',
                                              color: '#0284c7',
                                              cursor: 'pointer',
                                            }}
                                            className="hover:bg-sky-50"
                                            title="Edit Kegiatan Ini"
                                          >
                                            <Pencil size={13} />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setDeleteConfirm({ open: true, id: row.id, title: row.title })}
                                            style={{
                                              padding: '4px',
                                              borderRadius: '4px',
                                              border: '1px solid #fca5a5',
                                              backgroundColor: '#ffffff',
                                              color: '#dc2626',
                                              cursor: 'pointer',
                                            }}
                                            className="hover:bg-red-50"
                                            title="Hapus Kegiatan Ini"
                                          >
                                            <Trash2 size={13} />
                                          </button>
                                        </>
                                      )}

                                      {!row.link && !isAdmin && (
                                        <span style={{ color: '#cbd5e1' }}>-</span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- SEMESTER GENAP TABLES --- */}
            {(activeTab === 'semua' || activeTab === 'genap') && (
              <div style={{ width: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '2px solid #f1f5f9',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)',
                        fontWeight: 800,
                        color: '#0f172a',
                        margin: 0,
                        fontFamily: 'Outfit, sans-serif',
                        textTransform: 'uppercase',
                        letterSpacing: '0.01em',
                      }}
                    >
                      KALENDER AKADEMIK UNIVERSITAS SUMATERA UTARA SEMESTER GENAP T.A. {currentCalendar.year}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem' }}>
                      Rincian agenda dan kegiatan akademik operasional perkuliahan semester genap
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleOpenAdd('perkuliahan', 'genap')}
                      style={{
                        padding: '0.45rem 0.95rem',
                        borderRadius: '8px',
                        backgroundColor: '#006535',
                        color: '#ffffff',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        boxShadow: '0 2px 4px rgba(0,101,53,0.15)',
                        flexShrink: 0,
                      }}
                      className="hover:bg-[#005028]"
                    >
                      <Plus size={15} />
                      <span>Tambah Kegiatan Genap</span>
                    </button>
                  )}
                </div>

                {filteredGenapTables.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    Tidak ada kegiatan yang sesuai dengan kata kunci pencarian pada Semester Genap.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
                    {filteredGenapTables.map((table) => (
                      <div
                        key={table.id}
                        style={{
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                          backgroundColor: '#ffffff',
                          width: '100%',
                          boxSizing: 'border-box',
                        }}
                      >
                        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
                          {/* Fixed Column Widths across ALL tables ensuring 100% vertical alignment symmetry */}
                          <table style={{ width: '100%', minWidth: '720px', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                            <colgroup>
                              <col style={{ width: '50px' }} />
                              <col style={{ width: '35%' }} />
                              <col style={{ width: '27%' }} />
                              <col style={{ width: 'auto' }} />
                              <col style={{ width: isAdmin ? '105px' : '75px' }} />
                            </colgroup>
                            <thead>
                              <tr style={{ backgroundColor: '#FEEBC8', color: '#18181b', borderBottom: '1.5px solid #FBD38D' }}>
                                <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                                  No.
                                </th>
                                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700 }}>
                                  {table.category}
                                </th>
                                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700 }}>
                                  Jadwal
                                </th>
                                <th style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 700 }}>
                                  Keterangan
                                </th>
                                <th style={{ padding: '0.85rem 0.75rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700 }}>
                                  {isAdmin ? 'Aksi / Link' : 'Link'}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {table.rows.map((row, rIdx) => (
                                <tr
                                  key={row.id || rIdx}
                                  style={{
                                    backgroundColor: rIdx % 2 === 0 ? '#ffffff' : '#f8fafc',
                                    borderBottom: '1px solid #edf2f7',
                                    transition: 'background 0.15s',
                                  }}
                                  className="hover:bg-[#f1f5f9]"
                                >
                                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
                                    {row.no}
                                  </td>
                                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', wordBreak: 'break-word', lineHeight: 1.4 }}>
                                    {row.title}
                                  </td>
                                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#006535', fontWeight: 700, whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.4 }}>
                                    {row.date}
                                  </td>
                                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#475569', lineHeight: 1.45, wordBreak: 'break-word' }}>
                                    {row.description || '-'}
                                  </td>
                                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}>
                                      {row.link && (
                                        <a
                                          href={row.link}
                                          target="_blank"
                                          rel="noreferrer noopener"
                                          style={{ color: '#006535', display: 'inline-flex', alignItems: 'center' }}
                                          title="Buka Tautan Resmi"
                                        >
                                          <ExternalLink size={15} />
                                        </a>
                                      )}

                                      {isAdmin && !row.isStatic && (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => handleOpenEdit(row)}
                                            style={{
                                              padding: '4px',
                                              borderRadius: '4px',
                                              border: '1px solid #cbd5e1',
                                              backgroundColor: '#ffffff',
                                              color: '#0284c7',
                                              cursor: 'pointer',
                                            }}
                                            className="hover:bg-sky-50"
                                            title="Edit Kegiatan Ini"
                                          >
                                            <Pencil size={13} />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => setDeleteConfirm({ open: true, id: row.id, title: row.title })}
                                            style={{
                                              padding: '4px',
                                              borderRadius: '4px',
                                              border: '1px solid #fca5a5',
                                              backgroundColor: '#ffffff',
                                              color: '#dc2626',
                                              cursor: 'pointer',
                                            }}
                                            className="hover:bg-red-50"
                                            title="Hapus Kegiatan Ini"
                                          >
                                            <Trash2 size={13} />
                                          </button>
                                        </>
                                      )}

                                      {!row.link && !isAdmin && (
                                        <span style={{ color: '#cbd5e1' }}>-</span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 6. Public Event Detail Popover Modal */}
      {modalEvent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 100,
          }}
          onClick={() => setModalEvent(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalEvent(null)}
              style={{
                position: 'absolute',
                right: '1.25rem',
                top: '1.25rem',
                backgroundColor: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
              }}
              className="hover:bg-slate-200"
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  backgroundColor: '#f0fdf4',
                  color: '#006535',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                <Tag size={12} />
                {modalEvent.categoryLabel || modalEvent.category}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  backgroundColor: '#eff6ff',
                  color: '#1d4ed8',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                Semester {modalEvent.semester}
              </span>
            </div>

            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#0f172a',
                lineHeight: 1.35,
                marginBottom: '1rem',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              {modalEvent.title}
            </h3>

            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '10px',
                padding: '1rem',
                border: '1px solid #e2e8f0',
                marginBottom: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: '#1e293b' }}>
                <CalendarIcon size={16} style={{ color: '#006535', flexShrink: 0 }} />
                <span style={{ fontWeight: 600 }}>Tanggal:</span>
                <span style={{ color: '#006535', fontWeight: 700 }}>{modalEvent.dateFormatted || modalEvent.date}</span>
              </div>
              {modalEvent.time && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: '#1e293b' }}>
                  <Clock size={16} style={{ color: '#006535', flexShrink: 0 }} />
                  <span style={{ fontWeight: 600 }}>Waktu:</span>
                  <span>{modalEvent.time}</span>
                </div>
              )}
            </div>

            {modalEvent.description && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                  Catatan / Keterangan:
                </div>
                <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                  {modalEvent.description}
                </p>
              </div>
            )}

            {modalEvent.link && (
              <div style={{ marginBottom: '1.25rem' }}>
                <a
                  href={modalEvent.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#006535',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                  }}
                >
                  <span>Kunjungi tautan resmi</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              {isAdmin && !modalEvent.isStatic ? (
                <button
                  type="button"
                  onClick={() => {
                    setModalEvent(null);
                    handleOpenEdit(modalEvent);
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Pencil size={14} />
                  <span>Edit Kegiatan Ini</span>
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={() => setModalEvent(null)}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  backgroundColor: '#006535',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
                className="hover:bg-[#005028]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Admin Add / Edit Event Modal Dialog */}
      {adminModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 200,
          }}
          onClick={() => !submitting && setAdminModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '0.85rem', borderBottom: '1.5px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: adminModalMode === 'edit' ? '#e0f2fe' : '#dcfce7',
                    color: adminModalMode === 'edit' ? '#0284c7' : '#006535',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {adminModalMode === 'edit' ? <Pencil size={17} /> : <Plus size={18} />}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                  {adminModalMode === 'edit' ? 'Edit Kegiatan Akademik' : 'Tambah Kegiatan Akademik Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAdminModalOpen(false)}
                disabled={submitting}
                style={{
                  backgroundColor: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAdminFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                  Judul Kegiatan <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  value={adminForm.title}
                  onChange={(e) => setAdminForm({ ...adminForm, title: e.target.value })}
                  placeholder="Contoh: Pengisian KRS Mahasiswa Tahap II"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                  className="focus:border-[#006535]"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                    Kategori <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    value={adminForm.category}
                    onChange={(e) => setAdminForm({ ...adminForm, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.85rem',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                    Semester <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    value={adminForm.semester}
                    onChange={(e) => setAdminForm({ ...adminForm, semester: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.85rem',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="ganjil">Semester Ganjil</option>
                    <option value="genap">Semester Genap</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                    Tanggal Mulai <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={adminForm.startDate}
                    onChange={(e) => setAdminForm({ ...adminForm, startDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                    Tanggal Selesai (Opsional)
                  </label>
                  <input
                    type="date"
                    value={adminForm.endDate}
                    onChange={(e) => setAdminForm({ ...adminForm, endDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                    Tipe Hari
                  </label>
                  <select
                    value={adminForm.type}
                    onChange={(e) => setAdminForm({ ...adminForm, type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.85rem',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="tidak-libur">Hari Kerja / Perkuliahan Normal</option>
                    <option value="libur">Hari Libur Nasional</option>
                    <option value="cuti-bersama">Cuti Bersama Resmi</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                    Waktu / Jam (Opsional)
                  </label>
                  <input
                    type="text"
                    value={adminForm.time}
                    onChange={(e) => setAdminForm({ ...adminForm, time: e.target.value })}
                    placeholder="Contoh: 08:00 - 16:00 WIB"
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.85rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                  Keterangan / Deskripsi
                </label>
                <textarea
                  rows={3}
                  value={adminForm.description}
                  onChange={(e) => setAdminForm({ ...adminForm, description: e.target.value })}
                  placeholder="Tambahkan catatan persyaratan atau tata cara kegiatan..."
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.85rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                  Tautan / Link Berkas (Opsional)
                </label>
                <input
                  type="url"
                  value={adminForm.link}
                  onChange={(e) => setAdminForm({ ...adminForm, link: e.target.value })}
                  placeholder="https://vokasi.usu.ac.id/panduan.pdf"
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.85rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(false)}
                  disabled={submitting}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '0.6rem 1.5rem',
                    borderRadius: '8px',
                    backgroundColor: '#006535',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  className="hover:bg-[#005028]"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Admin Delete Confirmation Modal */}
      {deleteConfirm.open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 250,
          }}
          onClick={() => !submitting && setDeleteConfirm({ open: false, id: null, title: '' })}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '440px',
              width: '100%',
              padding: '1.75rem',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
              }}
            >
              <Trash2 size={24} />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Hapus Kegiatan Akademik?
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Apakah Anda yakin ingin menghapus kegiatan <strong>"{deleteConfirm.title}"</strong> dari kalender akademik tahun {selectedYearKey}?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirm({ open: false, id: null, title: '' })}
                disabled={submitting}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={submitting}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {submitting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Reset to Official Default Confirmation Modal */}
      {resetConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 250,
          }}
          onClick={() => !submitting && setResetConfirm(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              padding: '1.75rem',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
              }}
            >
              <RotateCcw size={24} />
            </div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Reset Kalender ke Standar USU?
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Tindakan ini akan mengembalikan seluruh jadwal akademik ke data awal resmi SK Rektor USU tanpa menyimpan perubahan kustom yang telah dibuat.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                disabled={submitting}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetToDefault}
                disabled={submitting}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  backgroundColor: '#d97706',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {submitting ? 'Memproses...' : 'Ya, Reset Sekarang'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Responsive Styles for Month Header Symmetry */}
      <style jsx>{`
        @media (max-width: 640px) {
          .kalender-month-header {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 0.75rem !important;
            text-align: center !important;
          }
          .kalender-month-header > div {
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}

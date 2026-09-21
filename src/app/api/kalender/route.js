import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { redis, KEYS } from '@/src/lib/redis';
import {
  ACADEMIC_CALENDARS,
  CATEGORY_NAMES_MAP,
  formatIndoDateRange
} from '@/src/lib/kalenderData';

export const dynamic = 'force-dynamic';

async function getStoredCalendars() {
  try {
    const raw = await redis.get(KEYS.KALENDER);
    if (!raw) {
      await redis.set(KEYS.KALENDER, JSON.stringify(ACADEMIC_CALENDARS));
      return ACADEMIC_CALENDARS;
    }
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(data) || data.length === 0) {
      await redis.set(KEYS.KALENDER, JSON.stringify(ACADEMIC_CALENDARS));
      return ACADEMIC_CALENDARS;
    }
    return data;
  } catch (err) {
    console.error('Error reading KALENDER from Redis:', err);
    return ACADEMIC_CALENDARS;
  }
}

async function saveCalendars(calendars) {
  await redis.set(KEYS.KALENDER, JSON.stringify(calendars));
}

// 1. GET: Ambil seluruh data kalender (atau spesifik tahun tertentu)
export async function GET(request) {
  try {
    const calendars = await getStoredCalendars();
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    if (year) {
      const found = calendars.find(c => c.year === year);
      if (found) {
        return NextResponse.json({ success: true, data: found });
      }
    }

    return NextResponse.json({ success: true, data: calendars });
  } catch (error) {
    console.error('[API_KALENDER_GET_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memuat data kalender akademik.' },
      { status: 500 }
    );
  }
}

// 2. POST: Tambah kegiatan baru ATAU Reset ke data resmi USU (Khusus Admin)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Sesi administrator diperlukan.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const isReset = searchParams.get('reset') === 'true';

    // Reset ke data default resmi USU
    if (isReset) {
      await saveCalendars(ACADEMIC_CALENDARS);
      return NextResponse.json({
        success: true,
        data: ACADEMIC_CALENDARS,
        message: 'Kalender akademik berhasil direset ke data resmi USU.'
      });
    }

    const body = await request.json();
    const { year, title, category, semester, startDate, endDate, type, description, link, time } = body;

    if (!year || !title || !startDate) {
      return NextResponse.json(
        { success: false, error: 'Tahun Akademik, Judul Kegiatan, dan Tanggal Mulai wajib diisi.' },
        { status: 400 }
      );
    }

    const calendars = await getStoredCalendars();
    const targetCalendarIndex = calendars.findIndex(c => c.year === year);
    if (targetCalendarIndex === -1) {
      return NextResponse.json(
        { success: false, error: `Tahun Akademik ${year} tidak ditemukan.` },
        { status: 404 }
      );
    }

    const cleanStartDate = String(startDate).trim();
    const cleanEndDate = endDate ? String(endDate).trim() : cleanStartDate;
    const cleanCategory = String(category || 'perkuliahan').trim();

    const newEvent = {
      id: `evt_${year.replace('/', '_')}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: String(title).trim(),
      type: type || 'tidak-libur',
      category: cleanCategory,
      categoryLabel: CATEGORY_NAMES_MAP[cleanCategory] || cleanCategory,
      startDate: cleanStartDate,
      endDate: cleanEndDate,
      dateFormatted: formatIndoDateRange(cleanStartDate, cleanEndDate),
      semester: semester === 'genap' ? 'genap' : 'ganjil',
      description: description ? String(description).trim() : '',
      link: link ? String(link).trim() : '',
      time: time ? String(time).trim() : ''
    };

    calendars[targetCalendarIndex].events.push(newEvent);
    await saveCalendars(calendars);

    return NextResponse.json({
      success: true,
      data: newEvent,
      message: 'Kegiatan baru berhasil ditambahkan ke kalender akademik.'
    });
  } catch (error) {
    console.error('[API_KALENDER_POST_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat menyimpan kegiatan baru.' },
      { status: 500 }
    );
  }
}

// 3. PUT: Edit kegiatan yang sudah ada (Khusus Admin)
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Sesi administrator diperlukan.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { year, id, title, category, semester, startDate, endDate, type, description, link, time } = body;

    if (!year || !id || !title || !startDate) {
      return NextResponse.json(
        { success: false, error: 'ID, Tahun Akademik, Judul Kegiatan, dan Tanggal Mulai wajib diisi.' },
        { status: 400 }
      );
    }

    const calendars = await getStoredCalendars();
    const targetCal = calendars.find(c => c.year === year);
    if (!targetCal) {
      return NextResponse.json(
        { success: false, error: `Tahun Akademik ${year} tidak ditemukan.` },
        { status: 404 }
      );
    }

    const eventIndex = targetCal.events.findIndex(e => e.id === id);
    if (eventIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Kegiatan tidak ditemukan.' },
        { status: 404 }
      );
    }

    const cleanStartDate = String(startDate).trim();
    const cleanEndDate = endDate ? String(endDate).trim() : cleanStartDate;
    const cleanCategory = String(category || targetCal.events[eventIndex].category).trim();

    const updatedEvent = {
      ...targetCal.events[eventIndex],
      title: String(title).trim(),
      type: type || targetCal.events[eventIndex].type || 'tidak-libur',
      category: cleanCategory,
      categoryLabel: CATEGORY_NAMES_MAP[cleanCategory] || cleanCategory,
      startDate: cleanStartDate,
      endDate: cleanEndDate,
      dateFormatted: formatIndoDateRange(cleanStartDate, cleanEndDate),
      semester: semester === 'genap' ? 'genap' : 'ganjil',
      description: description !== undefined ? String(description).trim() : targetCal.events[eventIndex].description,
      link: link !== undefined ? String(link).trim() : targetCal.events[eventIndex].link,
      time: time !== undefined ? String(time).trim() : targetCal.events[eventIndex].time
    };

    targetCal.events[eventIndex] = updatedEvent;
    await saveCalendars(calendars);

    return NextResponse.json({
      success: true,
      data: updatedEvent,
      message: 'Kegiatan kalender akademik berhasil diperbarui.'
    });
  } catch (error) {
    console.error('[API_KALENDER_PUT_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat memperbarui kegiatan.' },
      { status: 500 }
    );
  }
}

// 4. DELETE: Hapus kegiatan dari kalender (Khusus Admin)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Akses ditolak. Sesi administrator diperlukan.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    let year = searchParams.get('year');
    let id = searchParams.get('id');

    if (!id) {
      const body = await request.json().catch(() => ({}));
      year = year || body.year;
      id = id || body.id;
    }

    if (!year || !id) {
      return NextResponse.json(
        { success: false, error: 'Parameter year dan id wajib disertakan.' },
        { status: 400 }
      );
    }

    const calendars = await getStoredCalendars();
    const targetCal = calendars.find(c => c.year === year);
    if (!targetCal) {
      return NextResponse.json(
        { success: false, error: `Tahun Akademik ${year} tidak ditemukan.` },
        { status: 404 }
      );
    }

    const initialLength = targetCal.events.length;
    targetCal.events = targetCal.events.filter(e => e.id !== id);

    if (targetCal.events.length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Kegiatan tidak ditemukan di tahun akademik ini.' },
        { status: 404 }
      );
    }

    await saveCalendars(calendars);

    return NextResponse.json({
      success: true,
      message: 'Kegiatan berhasil dihapus dari kalender akademik.'
    });
  } catch (error) {
    console.error('[API_KALENDER_DELETE_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat menghapus kegiatan.' },
      { status: 500 }
    );
  }
}

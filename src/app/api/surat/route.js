import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { getCollection, addItem, updateItem, deleteItem, setCollection, KEYS } from '@/src/lib/redis';
import { INITIAL_SURAT_REQUESTS } from '@/src/lib/mockData';

// Helper to ensure initial data exists
async function ensureSuratData() {
  const data = await getCollection(KEYS.SURAT);
  if (!data || data.length === 0) {
    await setCollection(KEYS.SURAT, INITIAL_SURAT_REQUESTS);
    return INITIAL_SURAT_REQUESTS;
  }
  return data;
}

// Helper: validate HTTP/HTTPS url safely
function sanitizeUrl(rawUrl, fallback = 'https://vokasi.usu.ac.id/dokumen/lampiran_mahasiswa.pdf') {
  if (!rawUrl || typeof rawUrl !== 'string') return fallback;
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
    return fallback;
  } catch (_) {
    return fallback;
  }
}

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const list = await ensureSuratData();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q')?.toLowerCase();
    const status = searchParams.get('status');
    const nim = searchParams.get('nim')?.trim();
    const tiket = searchParams.get('tiket')?.trim();

    // 1. Jika BUKAN ADMIN: Hanya izinkan pelacakan tiket atau NIM spesifik dengan data PII tersanitasi
    if (!session) {
      if (!tiket && !nim) {
        return NextResponse.json(
          {
            success: false,
            error: 'Nomor Tiket atau NIM diperlukan untuk melacak status permohonan surat.',
            data: [],
          },
          { status: 400 }
        );
      }

      let matches = [...list];
      if (tiket) {
        matches = matches.filter(item => item.nomorTiket?.toLowerCase() === tiket.toLowerCase());
      } else if (nim) {
        matches = matches.filter(item => item.nim?.toLowerCase() === nim.toLowerCase());
      }

      // Sensor data sensitif (PII Protection / UU PDP No. 27/2022)
      const masked = matches.map(item => ({
        id: item.id,
        nomorTiket: item.nomorTiket,
        nama: item.nama ? (item.nama.slice(0, 3) + '***') : 'Mahasiswa***',
        nim: item.nim ? (item.nim.slice(0, 4) + '****') : '****',
        prodi: item.prodi,
        jenisSurat: item.jenisSurat,
        status: item.status,
        tanggalPengajuan: item.tanggalPengajuan,
        catatanAdmin: item.catatanAdmin,
        nomorSuratResmi: item.nomorSuratResmi,
      }));

      return NextResponse.json({ success: true, data: masked, total: masked.length });
    }

    // 2. Jika ADMIN TERVERIFIKASI: Berikan akses data penuh untuk pengelolaan
    let result = [...list];

    if (tiket) {
      result = result.filter(item => 
        item.nomorTiket?.toLowerCase() === tiket.toLowerCase()
      );
    } else if (nim) {
      result = result.filter(item => 
        item.nim?.toLowerCase().includes(nim.toLowerCase())
      );
    }

    if (status && status !== 'Semua') {
      result = result.filter(item => item.status === status);
    }

    if (search) {
      result = result.filter(item =>
        item.nama?.toLowerCase().includes(search) ||
        item.nim?.toLowerCase().includes(search) ||
        item.nomorTiket?.toLowerCase().includes(search) ||
        item.jenisSurat?.toLowerCase().includes(search) ||
        item.prodi?.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ success: true, data: result, total: result.length });
  } catch (error) {
    console.error('[API_SURAT_GET_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan sistem saat memuat data surat.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.nama || !body.nim || !body.jenisSurat) {
      return NextResponse.json(
        { success: false, error: 'Nama, NIM, dan Jenis Surat wajib diisi' },
        { status: 400 }
      );
    }

    // Validasi panjang input mencegah buffer / payload abuse
    const cleanNama = String(body.nama).trim().slice(0, 150);
    const cleanNim = String(body.nim).trim().slice(0, 30);
    const cleanJenis = String(body.jenisSurat).trim().slice(0, 150);
    const cleanProdi = String(body.prodi || 'D3 Teknik Informatika').trim().slice(0, 100);
    const cleanKeperluan = String(body.keperluan || '').trim().slice(0, 1000);
    const cleanEmail = String(body.email || '').trim().slice(0, 100);
    const cleanNoHp = String(body.noHp || '').trim().slice(0, 30);

    const counter = Math.floor(100 + Math.random() * 900);
    const dateStr = new Date().toISOString().slice(0, 10);
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();

    const newItem = {
      id: `SRT-${Date.now()}`,
      nomorTiket: `TKT-VOK-${new Date().getFullYear()}-${counter}-${randomCode}`,
      nama: cleanNama,
      nim: cleanNim,
      prodi: cleanProdi,
      semester: Math.min(Math.max(Number(body.semester) || 1, 1), 14),
      email: cleanEmail,
      noHp: cleanNoHp,
      jenisSurat: cleanJenis,
      keperluan: cleanKeperluan,
      status: 'Diajukan',
      catatanAdmin: 'Permohonan baru telah diterima. Menunggu verifikasi berkas oleh admin.',
      nomorSuratResmi: '-',
      tanggalPengajuan: dateStr,
      fileLampiranUrl: sanitizeUrl(body.fileLampiranUrl)
    };

    const saved = await addItem(KEYS.SURAT, newItem);
    return NextResponse.json({ success: true, data: saved, message: 'Permohonan surat berhasil dikirim!' });
  } catch (error) {
    console.error('[API_SURAT_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan sistem saat menyimpan permohonan surat.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Akses ditolak. Sesi admin terautentikasi diperlukan.' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'ID Surat diperlukan' }, { status: 400 });
    }

    // Whitelist field yang diizinkan untuk diubah admin
    const allowedUpdates = {};
    if (body.status !== undefined) allowedUpdates.status = String(body.status).slice(0, 50);
    if (body.catatanAdmin !== undefined) allowedUpdates.catatanAdmin = String(body.catatanAdmin).slice(0, 500);
    if (body.nomorSuratResmi !== undefined) allowedUpdates.nomorSuratResmi = String(body.nomorSuratResmi).slice(0, 100);

    const updated = await updateItem(KEYS.SURAT, body.id, allowedUpdates);
    return NextResponse.json({ success: true, data: updated, message: 'Data surat berhasil diperbarui' });
  } catch (error) {
    console.error('[API_SURAT_PUT_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan sistem saat memperbarui data surat.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Akses ditolak. Sesi admin terautentikasi diperlukan.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Parameter ID diperlukan' }, { status: 400 });
    }

    await deleteItem(KEYS.SURAT, id);
    return NextResponse.json({ success: true, message: 'Surat berhasil dihapus' });
  } catch (error) {
    console.error('[API_SURAT_DELETE_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan sistem saat menghapus surat.' }, { status: 500 });
  }
}

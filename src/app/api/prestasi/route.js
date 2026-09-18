import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { getCollection, addItem, addItems, updateItem, deleteItem, setCollection, KEYS } from '@/src/lib/redis';
import { INITIAL_PRESTASI } from '@/src/lib/mockData';

async function ensurePrestasiData() {
  const data = await getCollection(KEYS.PRESTASI);
  if (!data || data.length === 0) {
    await setCollection(KEYS.PRESTASI, INITIAL_PRESTASI);
    return INITIAL_PRESTASI;
  }
  return data;
}

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const list = await ensurePrestasiData();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q')?.toLowerCase();
    const tingkat = searchParams.get('tingkat');
    const prodi = searchParams.get('prodi');
    const tahun = searchParams.get('tahun');

    let result = [...list];

    if (tingkat && tingkat !== 'Semua') {
      result = result.filter(item => item.tingkat === tingkat);
    }
    if (prodi && prodi !== 'Semua') {
      result = result.filter(item => item.prodi === prodi);
    }
    if (tahun && tahun !== 'Semua') {
      result = result.filter(item => String(item.tahun) === String(tahun));
    }

    if (search) {
      result = result.filter(item =>
        item.nama?.toLowerCase().includes(search) ||
        item.nim?.toLowerCase().includes(search) ||
        item.namaKompetisi?.toLowerCase().includes(search) ||
        item.capaian?.toLowerCase().includes(search) ||
        item.prodi?.toLowerCase().includes(search)
      );
    }

    // Prestasi Stats
    const totalPrestasi = result.length;
    const countInternasional = list.filter(p => p.tingkat === 'Internasional').length;
    const countNasional = list.filter(p => p.tingkat === 'Nasional').length;
    const countWilayah = list.filter(p => p.tingkat === 'Wilayah/Provinsi' || p.tingkat === 'Regional').length;

    return NextResponse.json({
      success: true,
      data: result,
      total: result.length,
      stats: {
        totalPrestasi,
        countInternasional,
        countNasional,
        countWilayah,
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Helper: validate HTTP/HTTPS url safely
function sanitizeImageUrl(rawUrl, fallback = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80') {
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

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Akses ditolak. Silakan login sebagai admin.' }, { status: 401 });
    }

    const body = await request.json();

    // Support bulk insertion for Excel import
    const items = Array.isArray(body) ? body : body.items;
    if (Array.isArray(items)) {
      if (items.length > 1000) {
        return NextResponse.json({ success: false, error: 'Jumlah data impor melebihi batas maksimal (1.000 baris per unggahan)' }, { status: 400 });
      }

      const validItems = items
        .filter(item => item.nama && item.nim && item.namaKompetisi && item.capaian)
        .map(item => ({
          id: `MAPRES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          nim: String(item.nim).trim().slice(0, 30),
          nama: String(item.nama).trim().slice(0, 150),
          prodi: String(item.prodi || 'D3 Teknik Informatika').slice(0, 100),
          namaKompetisi: String(item.namaKompetisi).trim().slice(0, 200),
          capaian: String(item.capaian).trim().slice(0, 100),
          tingkat: String(item.tingkat || 'Nasional').slice(0, 50),
          kategori: String(item.kategori || 'Sains & Teknologi Terapan').slice(0, 100),
          tahun: Number(item.tahun) || new Date().getFullYear(),
          penyelenggara: String(item.penyelenggara || 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi').slice(0, 200),
          dosenPembimbing: String(item.dosenPembimbing || 'Dosen Pembimbing Vokasi USU').slice(0, 150),
          fotoUrl: sanitizeImageUrl(item.fotoUrl),
          deskripsi: String(item.deskripsi || 'Prestasi membanggakan mahasiswa Fakultas Vokasi Universitas Sumatera Utara.').slice(0, 1000)
        }));

      if (validItems.length === 0) {
        return NextResponse.json({ success: false, error: 'Tidak ada data prestasi valid yang dapat diimpor' }, { status: 400 });
      }

      const savedList = await addItems(KEYS.PRESTASI, validItems);
      return NextResponse.json({
        success: true,
        count: savedList.length,
        message: `Berhasil mengimpor ${savedList.length} data prestasi mahasiswa ke Upstash Redis`
      });
    }

    if (!body.nama || !body.nim || !body.namaKompetisi || !body.capaian) {
      return NextResponse.json(
        { success: false, error: 'Nama, NIM, Kompetisi, dan Capaian wajib diisi' },
        { status: 400 }
      );
    }

    const newItem = {
      id: `MAPRES-${Date.now()}`,
      nim: String(body.nim).trim().slice(0, 30),
      nama: String(body.nama).trim().slice(0, 150),
      prodi: String(body.prodi || 'D3 Manajemen Informatika').slice(0, 100),
      namaKompetisi: String(body.namaKompetisi).trim().slice(0, 200),
      capaian: String(body.capaian).trim().slice(0, 100),
      tingkat: String(body.tingkat || 'Nasional').slice(0, 50),
      kategori: String(body.kategori || 'Sains & Teknologi Terapan').slice(0, 100),
      tahun: Number(body.tahun) || new Date().getFullYear(),
      penyelenggara: String(body.penyelenggara || 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi').slice(0, 200),
      dosenPembimbing: String(body.dosenPembimbing || 'Dosen Pembimbing Vokasi USU').slice(0, 150),
      fotoUrl: sanitizeImageUrl(body.fotoUrl),
      deskripsi: String(body.deskripsi || 'Prestasi membanggakan mahasiswa Fakultas Vokasi Universitas Sumatera Utara.').slice(0, 1000)
    };

    const saved = await addItem(KEYS.PRESTASI, newItem);
    return NextResponse.json({ success: true, data: saved, message: 'Data prestasi mahasiswa berhasil ditambahkan!' });
  } catch (error) {
    console.error('[API_PRESTASI_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan sistem saat menyimpan data prestasi.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Akses ditolak. Silakan login sebagai admin.' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'ID Prestasi diperlukan' }, { status: 400 });
    }

    // Whitelist field yang diizinkan untuk diubah
    const allowedUpdates = {};
    if (body.nim !== undefined) allowedUpdates.nim = String(body.nim).trim().slice(0, 30);
    if (body.nama !== undefined) allowedUpdates.nama = String(body.nama).trim().slice(0, 150);
    if (body.prodi !== undefined) allowedUpdates.prodi = String(body.prodi).slice(0, 100);
    if (body.namaKompetisi !== undefined) allowedUpdates.namaKompetisi = String(body.namaKompetisi).trim().slice(0, 200);
    if (body.capaian !== undefined) allowedUpdates.capaian = String(body.capaian).trim().slice(0, 100);
    if (body.tingkat !== undefined) allowedUpdates.tingkat = String(body.tingkat).slice(0, 50);
    if (body.kategori !== undefined) allowedUpdates.kategori = String(body.kategori).slice(0, 100);
    if (body.tahun !== undefined) allowedUpdates.tahun = Number(body.tahun) || new Date().getFullYear();
    if (body.penyelenggara !== undefined) allowedUpdates.penyelenggara = String(body.penyelenggara).slice(0, 200);
    if (body.dosenPembimbing !== undefined) allowedUpdates.dosenPembimbing = String(body.dosenPembimbing).slice(0, 150);
    if (body.fotoUrl !== undefined) allowedUpdates.fotoUrl = sanitizeImageUrl(body.fotoUrl);
    if (body.deskripsi !== undefined) allowedUpdates.deskripsi = String(body.deskripsi).slice(0, 1000);

    const updated = await updateItem(KEYS.PRESTASI, body.id, allowedUpdates);
    return NextResponse.json({ success: true, data: updated, message: 'Data prestasi berhasil diperbarui' });
  } catch (error) {
    console.error('[API_PRESTASI_PUT_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan sistem saat memperbarui data prestasi.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Akses ditolak. Silakan login sebagai admin.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Parameter ID diperlukan' }, { status: 400 });
    }

    await deleteItem(KEYS.PRESTASI, id);
    return NextResponse.json({ success: true, message: 'Data prestasi berhasil dihapus' });
  } catch (error) {
    console.error('[API_PRESTASI_DELETE_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan sistem saat menghapus data prestasi.' }, { status: 500 });
  }
}

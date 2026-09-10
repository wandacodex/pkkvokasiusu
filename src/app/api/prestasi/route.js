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
      const validItems = items
        .filter(item => item.nama && item.nim && item.namaKompetisi && item.capaian)
        .map(item => ({
          id: `MAPRES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          nim: String(item.nim).trim(),
          nama: String(item.nama).trim(),
          prodi: item.prodi || 'D3 Teknik Informatika',
          namaKompetisi: String(item.namaKompetisi).trim(),
          capaian: String(item.capaian).trim(),
          tingkat: item.tingkat || 'Nasional',
          kategori: item.kategori || 'Sains & Teknologi Terapan',
          tahun: Number(item.tahun) || new Date().getFullYear(),
          penyelenggara: item.penyelenggara || 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
          dosenPembimbing: item.dosenPembimbing || 'Dosen Pembimbing Vokasi USU',
          fotoUrl: item.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
          deskripsi: item.deskripsi || 'Prestasi membanggakan mahasiswa Fakultas Vokasi Universitas Sumatera Utara.'
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
      nim: body.nim,
      nama: body.nama,
      prodi: body.prodi || 'D3 Manajemen Informatika',
      namaKompetisi: body.namaKompetisi,
      capaian: body.capaian,
      tingkat: body.tingkat || 'Nasional',
      kategori: body.kategori || 'Sains & Teknologi Terapan',
      tahun: Number(body.tahun) || new Date().getFullYear(),
      penyelenggara: body.penyelenggara || 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi',
      dosenPembimbing: body.dosenPembimbing || 'Dosen Pembimbing Vokasi USU',
      fotoUrl: body.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      deskripsi: body.deskripsi || 'Prestasi membanggakan mahasiswa Fakultas Vokasi Universitas Sumatera Utara.'
    };

    const saved = await addItem(KEYS.PRESTASI, newItem);
    return NextResponse.json({ success: true, data: saved, message: 'Data prestasi mahasiswa berhasil ditambahkan!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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

    const updated = await updateItem(KEYS.PRESTASI, body.id, body);
    return NextResponse.json({ success: true, data: updated, message: 'Data prestasi berhasil diperbarui' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

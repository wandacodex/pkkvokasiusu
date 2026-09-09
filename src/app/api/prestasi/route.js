import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { getCollection, addItem, updateItem, deleteItem, setCollection, KEYS } from '@/src/lib/redis';
import { INITIAL_PRESTASI } from '@/src/lib/mockData';

async function ensurePrestasiData() {
  const data = await getCollection(KEYS.PRESTASI);
  if (!data || data.length === 0) {
    await setCollection(KEYS.PRESTASI, INITIAL_PRESTASI);
    return INITIAL_PRESTASI;
  }
  return data;
}

export async function GET(request) {
  try {
    const list = await ensurePrestasiData();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q')?.toLowerCase();
    const tingkat = searchParams.get('tingkat');
    const kategori = searchParams.get('kategori');
    const tahun = searchParams.get('tahun');
    const prodi = searchParams.get('prodi');

    let result = [...list];

    if (tingkat && tingkat !== 'Semua') {
      result = result.filter(item => item.tingkat === tingkat);
    }
    if (kategori && kategori !== 'Semua') {
      result = result.filter(item => item.kategori === kategori);
    }
    if (tahun && tahun !== 'Semua') {
      result = result.filter(item => String(item.tahun) === String(tahun));
    }
    if (prodi && prodi !== 'Semua') {
      result = result.filter(item => item.prodi === prodi);
    }

    if (search) {
      result = result.filter(item =>
        item.nama?.toLowerCase().includes(search) ||
        item.nim?.toLowerCase().includes(search) ||
        item.namaKompetisi?.toLowerCase().includes(search) ||
        item.capaian?.toLowerCase().includes(search) ||
        item.penyelenggara?.toLowerCase().includes(search) ||
        item.prodi?.toLowerCase().includes(search)
      );
    }

    // Stats
    const totalPrestasi = list.length;
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

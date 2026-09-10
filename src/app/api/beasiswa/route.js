import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { getCollection, addItem, addItems, updateItem, deleteItem, setCollection, KEYS } from '@/src/lib/redis';
import { INITIAL_BEASISWA } from '@/src/lib/mockData';

async function ensureBeasiswaData() {
  const data = await getCollection(KEYS.BEASISWA);
  if (!data || data.length === 0) {
    await setCollection(KEYS.BEASISWA, INITIAL_BEASISWA);
    return INITIAL_BEASISWA;
  }
  return data;
}

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const list = await ensureBeasiswaData();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q')?.toLowerCase();
    const jenis = searchParams.get('jenis');
    const prodi = searchParams.get('prodi');
    const tahun = searchParams.get('tahun');

    let result = [...list];

    if (jenis && jenis !== 'Semua') {
      result = result.filter(item => item.jenisBeasiswa === jenis);
    }
    if (prodi && prodi !== 'Semua') {
      result = result.filter(item => item.prodi === prodi);
    }
    if (tahun && tahun !== 'Semua') {
      result = result.filter(item => item.periodeTahun === tahun);
    }

    if (search) {
      result = result.filter(item =>
        item.namaMahasiswa?.toLowerCase().includes(search) ||
        item.nim?.toLowerCase().includes(search) ||
        item.prodi?.toLowerCase().includes(search) ||
        item.jenisBeasiswa?.toLowerCase().includes(search)
      );
    }

    // Calculate summary statistics
    const totalMahasiswa = result.length;
    const beasiswaTypes = Array.from(new Set(list.map(i => i.jenisBeasiswa).filter(Boolean)));

    return NextResponse.json({
      success: true,
      data: result,
      total: totalMahasiswa,
      summary: {
        totalMahasiswa,
        beasiswaTypes,
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
        .filter(item => item.namaMahasiswa && item.nim && item.jenisBeasiswa)
        .map(item => ({
          nim: String(item.nim).trim(),
          namaMahasiswa: String(item.namaMahasiswa).trim(),
          prodi: item.prodi || 'D3 Teknik Informatika',
          jenisBeasiswa: item.jenisBeasiswa || 'Beasiswa KIP Kuliah',
        }));

      if (validItems.length === 0) {
        return NextResponse.json({ success: false, error: 'Tidak ada data beasiswa valid yang dapat diimpor' }, { status: 400 });
      }

      const savedList = await addItems(KEYS.BEASISWA, validItems);
      return NextResponse.json({
        success: true,
        count: savedList.length,
        message: `Berhasil mengimpor ${savedList.length} data beasiswa ke Upstash Redis`
      });
    }

    if (!body.namaMahasiswa || !body.nim || !body.jenisBeasiswa) {
      return NextResponse.json(
        { success: false, error: 'Nama Mahasiswa, NIM, dan Jenis Beasiswa wajib diisi' },
        { status: 400 }
      );
    }

    const newItem = {
      id: `BEA-${Date.now()}`,
      nim: body.nim,
      namaMahasiswa: body.namaMahasiswa,
      prodi: body.prodi || 'D3 Teknik Informatika',
      jenisBeasiswa: body.jenisBeasiswa,
    };

    const saved = await addItem(KEYS.BEASISWA, newItem);
    return NextResponse.json({ success: true, data: saved, message: 'Data penerima beasiswa berhasil ditambahkan' });
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
      return NextResponse.json({ success: false, error: 'ID Beasiswa diperlukan' }, { status: 400 });
    }

    const updated = await updateItem(KEYS.BEASISWA, body.id, body);
    return NextResponse.json({ success: true, data: updated, message: 'Data beasiswa berhasil diperbarui' });
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

    await deleteItem(KEYS.BEASISWA, id);
    return NextResponse.json({ success: true, message: 'Data beasiswa berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

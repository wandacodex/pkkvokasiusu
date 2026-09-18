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
      if (items.length > 1000) {
        return NextResponse.json({ success: false, error: 'Jumlah data impor melebihi batas maksimal (1.000 baris per unggahan)' }, { status: 400 });
      }

      const validItems = items
        .filter(item => item.namaMahasiswa && item.nim && item.jenisBeasiswa)
        .map(item => ({
          nim: String(item.nim).trim().slice(0, 30),
          namaMahasiswa: String(item.namaMahasiswa).trim().slice(0, 150),
          prodi: String(item.prodi || 'D3 Teknik Informatika').slice(0, 100),
          jenisBeasiswa: String(item.jenisBeasiswa || 'Beasiswa KIP Kuliah').slice(0, 150),
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
      nim: String(body.nim).trim().slice(0, 30),
      namaMahasiswa: String(body.namaMahasiswa).trim().slice(0, 150),
      prodi: String(body.prodi || 'D3 Teknik Informatika').slice(0, 100),
      jenisBeasiswa: String(body.jenisBeasiswa).slice(0, 150),
    };

    const saved = await addItem(KEYS.BEASISWA, newItem);
    return NextResponse.json({ success: true, data: saved, message: 'Data penerima beasiswa berhasil ditambahkan' });
  } catch (error) {
    console.error('[API_BEASISWA_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan sistem saat menyimpan data beasiswa.' }, { status: 500 });
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

    // Whitelist field yang diizinkan untuk diubah
    const allowedUpdates = {};
    if (body.nim !== undefined) allowedUpdates.nim = String(body.nim).trim().slice(0, 30);
    if (body.namaMahasiswa !== undefined) allowedUpdates.namaMahasiswa = String(body.namaMahasiswa).trim().slice(0, 150);
    if (body.prodi !== undefined) allowedUpdates.prodi = String(body.prodi).slice(0, 100);
    if (body.jenisBeasiswa !== undefined) allowedUpdates.jenisBeasiswa = String(body.jenisBeasiswa).slice(0, 150);

    const updated = await updateItem(KEYS.BEASISWA, body.id, allowedUpdates);
    return NextResponse.json({ success: true, data: updated, message: 'Data beasiswa berhasil diperbarui' });
  } catch (error) {
    console.error('[API_BEASISWA_PUT_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan sistem saat memperbarui data beasiswa.' }, { status: 500 });
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
    console.error('[API_BEASISWA_DELETE_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan sistem saat menghapus data beasiswa.' }, { status: 500 });
  }
}

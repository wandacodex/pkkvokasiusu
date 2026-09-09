import { NextResponse } from 'next/server';
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

export async function GET(request) {
  try {
    const list = await ensureSuratData();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q')?.toLowerCase();
    const status = searchParams.get('status');
    const nim = searchParams.get('nim');
    const tiket = searchParams.get('tiket');

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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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

    const counter = Math.floor(100 + Math.random() * 900);
    const dateStr = new Date().toISOString().slice(0, 10);
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();

    const newItem = {
      id: `SRT-${Date.now()}`,
      nomorTiket: `TKT-VOK-${new Date().getFullYear()}-${counter}-${randomCode}`,
      nama: body.nama,
      nim: body.nim,
      prodi: body.prodi || 'D3 Manajemen Informatika',
      semester: Number(body.semester) || 1,
      email: body.email || '',
      noHp: body.noHp || '',
      jenisSurat: body.jenisSurat,
      keperluan: body.keperluan || '',
      status: 'Diajukan',
      catatanAdmin: 'Permohonan baru telah diterima. Menunggu verifikasi berkas oleh admin.',
      nomorSuratResmi: '-',
      tanggalPengajuan: dateStr,
      fileLampiranUrl: body.fileLampiranUrl || 'https://vokasi.usu.ac.id/dokumen/lampiran_mahasiswa.pdf'
    };

    const saved = await addItem(KEYS.SURAT, newItem);
    return NextResponse.json({ success: true, data: saved, message: 'Permohonan surat berhasil dikirim!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'ID Surat diperlukan' }, { status: 400 });
    }

    const updated = await updateItem(KEYS.SURAT, body.id, body);
    return NextResponse.json({ success: true, data: updated, message: 'Data surat berhasil diperbarui' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Parameter ID diperlukan' }, { status: 400 });
    }

    await deleteItem(KEYS.SURAT, id);
    return NextResponse.json({ success: true, message: 'Surat berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

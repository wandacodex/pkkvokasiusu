import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { getCollection, addItem, updateItem, deleteItem, setCollection, KEYS } from '@/src/lib/redis';
import { INITIAL_TRACER } from '@/src/lib/mockData';

async function ensureTracerData() {
  const data = await getCollection(KEYS.TRACER);
  if (!data || data.length === 0) {
    await setCollection(KEYS.TRACER, INITIAL_TRACER);
    return INITIAL_TRACER;
  }
  return data;
}

export async function GET(request) {
  try {
    const list = await ensureTracerData();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q')?.toLowerCase();
    const status = searchParams.get('status');
    const tahun = searchParams.get('tahun');
    const prodi = searchParams.get('prodi');

    let result = [...list];

    if (status && status !== 'Semua') {
      result = result.filter(item => item.statusPekerjaan === status);
    }
    if (tahun && tahun !== 'Semua') {
      result = result.filter(item => String(item.tahunLulus) === String(tahun));
    }
    if (prodi && prodi !== 'Semua') {
      result = result.filter(item => item.prodi === prodi);
    }

    if (search) {
      result = result.filter(item =>
        item.namaAlumni?.toLowerCase().includes(search) ||
        item.nim?.toLowerCase().includes(search) ||
        item.namaInstansi?.toLowerCase().includes(search) ||
        item.posisiJabatan?.toLowerCase().includes(search) ||
        item.prodi?.toLowerCase().includes(search)
      );
    }

    // Analytics calculations: Hanya 5 Kategori Status Tracer Study
    const totalMahasiswa = list.length;
    const countBekerja = list.filter(i => i.statusPekerjaan === 'Bekerja' || i.statusPekerjaan?.toLowerCase().includes('bekerja')).length;
    const countBelumMemungkinkanBekerja = list.filter(i => i.statusPekerjaan === 'Belum Memungkinkan Bekerja' || i.statusPekerjaan?.toLowerCase().includes('belum memungkinkan')).length;
    const countWiraswasta = list.filter(i => i.statusPekerjaan === 'Wiraswasta' || i.statusPekerjaan?.toLowerCase().includes('wirausaha') || i.statusPekerjaan?.toLowerCase().includes('wiraswasta')).length;
    const countMelanjutkanPendidikan = list.filter(i => i.statusPekerjaan === 'Melanjutkan Pendidikan' || i.statusPekerjaan?.toLowerCase().includes('melanjutkan') || i.statusPekerjaan?.toLowerCase().includes('studi')).length;
    const countMencariKerja = list.filter(i => i.statusPekerjaan === 'Tidak Kerja Tetapi Sedang Mencari Pekerjaan' || i.statusPekerjaan?.toLowerCase().includes('mencari kerja') || i.statusPekerjaan?.toLowerCase().includes('rekrutmen')).length;

    const percentBekerja = totalMahasiswa > 0 ? Number(((countBekerja / totalMahasiswa) * 100).toFixed(1)) : 0;
    const percentBelumMemungkinkanBekerja = totalMahasiswa > 0 ? Number(((countBelumMemungkinkanBekerja / totalMahasiswa) * 100).toFixed(1)) : 0;
    const percentWiraswasta = totalMahasiswa > 0 ? Number(((countWiraswasta / totalMahasiswa) * 100).toFixed(1)) : 0;
    const percentMelanjutkanPendidikan = totalMahasiswa > 0 ? Number(((countMelanjutkanPendidikan / totalMahasiswa) * 100).toFixed(1)) : 0;
    const percentMencariKerja = totalMahasiswa > 0 ? Number(((countMencariKerja / totalMahasiswa) * 100).toFixed(1)) : 0;

    return NextResponse.json({
      success: true,
      data: result,
      total: result.length,
      analytics: {
        totalMahasiswa,
        countBekerja,
        countBelumMemungkinkanBekerja,
        countWiraswasta,
        countMelanjutkanPendidikan,
        countMencariKerja,
        percentBekerja,
        percentBelumMemungkinkanBekerja,
        percentWiraswasta,
        percentMelanjutkanPendidikan,
        percentMencariKerja,
        categories: [
          {
            key: 'bekerja',
            label: 'Bekerja',
            count: countBekerja,
            percent: percentBekerja,
          },
          {
            key: 'belum_memungkinkan_bekerja',
            label: 'Belum Memungkinkan Bekerja',
            count: countBelumMemungkinkanBekerja,
            percent: percentBelumMemungkinkanBekerja,
          },
          {
            key: 'wiraswasta',
            label: 'Wiraswasta',
            count: countWiraswasta,
            percent: percentWiraswasta,
          },
          {
            key: 'melanjutkan_pendidikan',
            label: 'Melanjutkan Pendidikan',
            count: countMelanjutkanPendidikan,
            percent: percentMelanjutkanPendidikan,
          },
          {
            key: 'mencari_kerja',
            label: 'Tidak Kerja Tetapi Sedang Mencari Pekerjaan',
            count: countMencariKerja,
            percent: percentMencariKerja,
          }
        ]
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
    if (!body.namaAlumni || !body.nim || !body.tahunLulus) {
      return NextResponse.json(
        { success: false, error: 'Nama Alumni, NIM, dan Tahun Lulus wajib diisi' },
        { status: 400 }
      );
    }

    const newItem = {
      id: `TRC-${Date.now()}`,
      nim: body.nim,
      namaAlumni: body.namaAlumni,
      tahunLulus: Number(body.tahunLulus),
      prodi: body.prodi || 'D3 Manajemen Informatika',
      statusPekerjaan: body.statusPekerjaan || 'Bekerja Penuh Waktu',
      namaInstansi: body.namaInstansi || '-',
      posisiJabatan: body.posisiJabatan || '-',
      bidangUsaha: body.bidangUsaha || '-',
      lokasiKerja: body.lokasiKerja || 'Indonesia',
      waktuTungguBulan: Number(body.waktuTungguBulan) || 2,
      keselarasanBidang: body.keselarasanBidang || 'Sangat Selaras',
      tingkatGaji: body.tingkatGaji || 'Rp 5.000.000 - Rp 8.000.000',
      email: body.email || '',
      noHp: body.noHp || '',
      tanggalSubmit: new Date().toISOString().slice(0, 10)
    };

    const saved = await addItem(KEYS.TRACER, newItem);
    return NextResponse.json({ success: true, data: saved, message: 'Data Tracer Study berhasil disimpan.' });
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
      return NextResponse.json({ success: false, error: 'ID Tracer diperlukan' }, { status: 400 });
    }

    const updated = await updateItem(KEYS.TRACER, body.id, body);
    return NextResponse.json({ success: true, data: updated, message: 'Data tracer study berhasil diperbarui' });
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

    await deleteItem(KEYS.TRACER, id);
    return NextResponse.json({ success: true, message: 'Data alumni tracer study berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

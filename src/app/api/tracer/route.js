import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { getCollection, addItem, addItems, updateItem, deleteItem, setCollection, KEYS } from '@/src/lib/redis';
import { INITIAL_TRACER, TRACER_PRODI_STATS } from '@/src/lib/mockData';

async function ensureTracerData() {
  const data = await getCollection(KEYS.TRACER);
  if (!data || data.length === 0) {
    await setCollection(KEYS.TRACER, INITIAL_TRACER);
    return INITIAL_TRACER;
  }
  return data;
}

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const list = await ensureTracerData();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q')?.toLowerCase();
    const statusKerja = searchParams.get('status');
    const prodi = searchParams.get('prodi');
    const tahun = searchParams.get('tahun');

    let result = [...list];

    if (statusKerja && statusKerja !== 'Semua') {
      result = result.filter(item => item.statusPekerjaan === statusKerja);
    }
    if (prodi && prodi !== 'Semua') {
      result = result.filter(item => item.prodi === prodi);
    }
    if (tahun && tahun !== 'Semua') {
      result = result.filter(item => String(item.tahunLulus) === String(tahun));
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

    // Tracer Stats Calculation
    const totalMahasiswa = list.length;
    const countBekerja = list.filter(t => t.statusPekerjaan === 'Bekerja' || t.statusPekerjaan === 'Bekerja Penuh Waktu' || t.statusPekerjaan === 'Bekerja Paruh Waktu').length;
    const countBelumMemungkinkanBekerja = list.filter(t => t.statusPekerjaan === 'Belum Memungkinkan Bekerja').length;
    const countWiraswasta = list.filter(t => t.statusPekerjaan === 'Wiraswasta').length;
    const countMelanjutkanPendidikan = list.filter(t => t.statusPekerjaan === 'Melanjutkan Pendidikan').length;
    const countMencariKerja = list.filter(t => t.statusPekerjaan === 'Tidak Kerja Tetapi Sedang Mencari Pekerjaan' || t.statusPekerjaan === 'Mencari Kerja').length;

    const percentBekerja = totalMahasiswa ? Number(((countBekerja / totalMahasiswa) * 100).toFixed(1)) : 0;
    const percentBelumMemungkinkanBekerja = totalMahasiswa ? Number(((countBelumMemungkinkanBekerja / totalMahasiswa) * 100).toFixed(1)) : 0;
    const percentWiraswasta = totalMahasiswa ? Number(((countWiraswasta / totalMahasiswa) * 100).toFixed(1)) : 0;
    const percentMelanjutkanPendidikan = totalMahasiswa ? Number(((countMelanjutkanPendidikan / totalMahasiswa) * 100).toFixed(1)) : 0;
    const percentMencariKerja = totalMahasiswa ? Number(((countMencariKerja / totalMahasiswa) * 100).toFixed(1)) : 0;

    const analyticsData = {
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
      percentMencariKerja
    };

    const session = await getServerSession(authOptions);

    return NextResponse.json({
      success: true,
      data: session ? result : [], // Data individual responden bersifat privat (hanya dapat diakses admin terverifikasi)
      total: result.length,
      analytics: analyticsData,
      stats: analyticsData,
      prodiStats: TRACER_PRODI_STATS || []
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
        .filter(item => item.namaAlumni && item.nim && item.tahunLulus)
        .map(item => ({
          id: `TRC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          nim: String(item.nim).trim(),
          namaAlumni: String(item.namaAlumni).trim(),
          tahunLulus: Number(item.tahunLulus) || new Date().getFullYear(),
          prodi: item.prodi || 'D3 Manajemen Informatika',
          statusPekerjaan: item.statusPekerjaan || 'Bekerja',
          namaInstansi: item.namaInstansi || '-',
          posisiJabatan: item.posisiJabatan || '-',
          bidangUsaha: item.bidangUsaha || '-',
          lokasiKerja: item.lokasiKerja || 'Indonesia',
          waktuTungguBulan: Number(item.waktuTungguBulan) || 2,
          keselarasanBidang: item.keselarasanBidang || 'Sangat Selaras',
          tingkatGaji: item.tingkatGaji || 'Rp 5.000.000 - Rp 8.000.000',
          email: item.email || '',
          noHp: item.noHp || '',
          tanggalSubmit: item.tanggalSubmit || new Date().toISOString().slice(0, 10)
        }));

      if (validItems.length === 0) {
        return NextResponse.json({ success: false, error: 'Tidak ada data alumni valid yang dapat diimpor' }, { status: 400 });
      }

      const savedList = await addItems(KEYS.TRACER, validItems);
      return NextResponse.json({
        success: true,
        count: savedList.length,
        message: `Berhasil mengimpor ${savedList.length} data tracer study alumni ke Upstash Redis`
      });
    }

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
      statusPekerjaan: body.statusPekerjaan || 'Bekerja',
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

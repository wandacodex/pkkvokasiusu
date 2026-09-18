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
      if (items.length > 1000) {
        return NextResponse.json({ success: false, error: 'Jumlah data impor melebihi batas maksimal (1.000 baris per unggahan)' }, { status: 400 });
      }

      const validItems = items
        .filter(item => item.namaAlumni && item.nim && item.tahunLulus)
        .map(item => ({
          id: `TRC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          nim: String(item.nim).trim().slice(0, 30),
          namaAlumni: String(item.namaAlumni).trim().slice(0, 150),
          tahunLulus: Number(item.tahunLulus) || new Date().getFullYear(),
          prodi: String(item.prodi || 'D3 Manajemen Informatika').slice(0, 100),
          statusPekerjaan: String(item.statusPekerjaan || 'Bekerja').slice(0, 50),
          namaInstansi: String(item.namaInstansi || '-').slice(0, 150),
          posisiJabatan: String(item.posisiJabatan || '-').slice(0, 100),
          bidangUsaha: String(item.bidangUsaha || '-').slice(0, 100),
          lokasiKerja: String(item.lokasiKerja || 'Indonesia').slice(0, 100),
          waktuTungguBulan: Number(item.waktuTungguBulan) || 2,
          keselarasanBidang: String(item.keselarasanBidang || 'Sangat Selaras').slice(0, 50),
          tingkatGaji: String(item.tingkatGaji || 'Rp 5.000.000 - Rp 8.000.000').slice(0, 50),
          email: String(item.email || '').slice(0, 100),
          noHp: String(item.noHp || '').slice(0, 30),
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
      nim: String(body.nim).trim().slice(0, 30),
      namaAlumni: String(body.namaAlumni).trim().slice(0, 150),
      tahunLulus: Number(body.tahunLulus),
      prodi: String(body.prodi || 'D3 Manajemen Informatika').slice(0, 100),
      statusPekerjaan: String(body.statusPekerjaan || 'Bekerja').slice(0, 50),
      namaInstansi: String(body.namaInstansi || '-').slice(0, 150),
      posisiJabatan: String(body.posisiJabatan || '-').slice(0, 100),
      bidangUsaha: String(body.bidangUsaha || '-').slice(0, 100),
      lokasiKerja: String(body.lokasiKerja || 'Indonesia').slice(0, 100),
      waktuTungguBulan: Number(body.waktuTungguBulan) || 2,
      keselarasanBidang: String(body.keselarasanBidang || 'Sangat Selaras').slice(0, 50),
      tingkatGaji: String(body.tingkatGaji || 'Rp 5.000.000 - Rp 8.000.000').slice(0, 50),
      email: String(body.email || '').slice(0, 100),
      noHp: String(body.noHp || '').slice(0, 30),
      tanggalSubmit: new Date().toISOString().slice(0, 10)
    };

    const saved = await addItem(KEYS.TRACER, newItem);
    return NextResponse.json({ success: true, data: saved, message: 'Data Tracer Study berhasil disimpan.' });
  } catch (error) {
    console.error('[API_TRACER_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan sistem saat menyimpan data tracer study.' }, { status: 500 });
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

    // Whitelist field yang diizinkan untuk diubah
    const allowedUpdates = {};
    if (body.nim !== undefined) allowedUpdates.nim = String(body.nim).trim().slice(0, 30);
    if (body.namaAlumni !== undefined) allowedUpdates.namaAlumni = String(body.namaAlumni).trim().slice(0, 150);
    if (body.tahunLulus !== undefined) allowedUpdates.tahunLulus = Number(body.tahunLulus) || new Date().getFullYear();
    if (body.prodi !== undefined) allowedUpdates.prodi = String(body.prodi).slice(0, 100);
    if (body.statusPekerjaan !== undefined) allowedUpdates.statusPekerjaan = String(body.statusPekerjaan).slice(0, 50);
    if (body.namaInstansi !== undefined) allowedUpdates.namaInstansi = String(body.namaInstansi).slice(0, 150);
    if (body.posisiJabatan !== undefined) allowedUpdates.posisiJabatan = String(body.posisiJabatan).slice(0, 100);
    if (body.bidangUsaha !== undefined) allowedUpdates.bidangUsaha = String(body.bidangUsaha).slice(0, 100);
    if (body.lokasiKerja !== undefined) allowedUpdates.lokasiKerja = String(body.lokasiKerja).slice(0, 100);
    if (body.waktuTungguBulan !== undefined) allowedUpdates.waktuTungguBulan = Number(body.waktuTungguBulan) || 0;
    if (body.keselarasanBidang !== undefined) allowedUpdates.keselarasanBidang = String(body.keselarasanBidang).slice(0, 50);
    if (body.tingkatGaji !== undefined) allowedUpdates.tingkatGaji = String(body.tingkatGaji).slice(0, 50);
    if (body.email !== undefined) allowedUpdates.email = String(body.email).slice(0, 100);
    if (body.noHp !== undefined) allowedUpdates.noHp = String(body.noHp).slice(0, 30);

    const updated = await updateItem(KEYS.TRACER, body.id, allowedUpdates);
    return NextResponse.json({ success: true, data: updated, message: 'Data tracer study berhasil diperbarui' });
  } catch (error) {
    console.error('[API_TRACER_PUT_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan sistem saat memperbarui data tracer study.' }, { status: 500 });
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
    console.error('[API_TRACER_DELETE_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Terjadi kesalahan sistem saat menghapus data tracer study.' }, { status: 500 });
  }
}

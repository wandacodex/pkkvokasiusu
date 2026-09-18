import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { getCollection, setCollection, KEYS } from '@/src/lib/redis';
import {
  INITIAL_SURAT_REQUESTS,
  INITIAL_BEASISWA,
  INITIAL_PRESTASI,
  INITIAL_TRACER
} from '@/src/lib/mockData';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    // Jika parameter force=true (reset database), wajibkan sesi SUPERADMIN
    if (force) {
      const session = await getServerSession(authOptions);
      if (!session || (session.user?.role !== 'SUPERADMIN' && session.user?.role !== 'ADMIN')) {
        return NextResponse.json(
          { success: false, error: 'Akses ditolak: Hanya Administrator terautentikasi yang diizinkan mereset basis data.' },
          { status: 401 }
        );
      }
    }

    // Check existing data
    const existingSurat = await getCollection(KEYS.SURAT);
    const existingBeasiswa = await getCollection(KEYS.BEASISWA);
    const existingPrestasi = await getCollection(KEYS.PRESTASI);
    const existingTracer = await getCollection(KEYS.TRACER);

    const seeded = {
      surat: false,
      beasiswa: false,
      prestasi: false,
      tracer: false,
    };

    if (force || existingSurat.length === 0) {
      await setCollection(KEYS.SURAT, INITIAL_SURAT_REQUESTS);
      seeded.surat = true;
    }

    if (force || existingBeasiswa.length === 0) {
      await setCollection(KEYS.BEASISWA, INITIAL_BEASISWA);
      seeded.beasiswa = true;
    }

    if (force || existingPrestasi.length === 0) {
      await setCollection(KEYS.PRESTASI, INITIAL_PRESTASI);
      seeded.prestasi = true;
    }

    if (force || existingTracer.length === 0) {
      await setCollection(KEYS.TRACER, INITIAL_TRACER);
      seeded.tracer = true;
    }

    return NextResponse.json({
      success: true,
      message: 'Sinkronisasi basis data berhasil dijalankan.',
      seeded,
      counts: {
        surat: (await getCollection(KEYS.SURAT)).length,
        beasiswa: (await getCollection(KEYS.BEASISWA)).length,
        prestasi: (await getCollection(KEYS.PRESTASI)).length,
        tracer: (await getCollection(KEYS.TRACER)).length,
      }
    });
  } catch (error) {
    console.error('[SEED_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat memproses basis data.' },
      { status: 500 }
    );
  }
}

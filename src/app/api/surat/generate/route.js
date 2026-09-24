import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const JSZip = require('jszip');
import { modifyDocumentXml } from '@/src/lib/docxXmlTransform';
import { TEMPLATES_CONFIG, getTodayDateIndo } from '@/src/lib/suratTemplatesConfig';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { templateId, formData = {}, membersList = [] } = body;

    const templateConfig = TEMPLATES_CONFIG.find(t => t.id === templateId);
    if (!templateConfig) {
      return NextResponse.json(
        { success: false, error: `Template surat dengan ID '${templateId}' tidak ditemukan.` },
        { status: 404 }
      );
    }

    // Resolve template file path on disk
    const cleanRelPath = templateConfig.fileUrl.replace(/^\/+/, '');
    const fullFilePath = path.join(process.cwd(), 'public', cleanRelPath);

    if (!fs.existsSync(fullFilePath)) {
      return NextResponse.json(
        { success: false, error: `Berkas fisik template '${templateConfig.filename}' tidak ditemukan di server.` },
        { status: 404 }
      );
    }

    const templateBuffer = await fs.promises.readFile(fullFilePath);
    const zip = await JSZip.loadAsync(templateBuffer);

    let docXml = await zip.file('word/document.xml').async('string');
    const tanggalHariIni = formData.tanggalSurat || getTodayDateIndo();

    docXml = modifyDocumentXml(docXml, templateConfig, formData, membersList, tanggalHariIni);

    zip.file('word/document.xml', docXml);

    const outputBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE'
    });

    const cleanNama = (formData.nama || 'MAHASISWA').replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
    const cleanNim = (formData.nim || 'NIM').replace(/[^a-zA-Z0-9]/g, '');
    const cleanCode = (templateConfig.id || 'SURAT').replace(/-/g, '_').toUpperCase();
    const finalFilename = `${cleanCode}_${cleanNim}_${cleanNama}.docx`;

    return new Response(outputBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(finalFilename)}"`
      }
    });
  } catch (error) {
    console.error('Error generating document in API route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal membuat dokumen di server.' },
      { status: 500 }
    );
  }
}

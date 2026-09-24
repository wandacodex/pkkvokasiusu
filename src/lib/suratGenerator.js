'use client';

export * from './suratTemplatesConfig';

/**
 * Generate Word .docx Document by calling the server API route
 * Menghindari bug Turbopack client 'uncompressed data size mismatch' pada JSZip DataWorker
 */
export async function generateWordDocument(templateConfig, formData, membersList = []) {
  try {
    const response = await fetch('/api/surat/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        templateId: templateConfig.id,
        formData,
        membersList
      })
    });

    if (!response.ok) {
      let errMsg = 'Gagal membuat berkas Word di server';
      try {
        const errJson = await response.json();
        if (errJson.error) errMsg = errJson.error;
      } catch (_) {}
      throw new Error(errMsg);
    }

    const outputBlob = await response.blob();

    // Tentukan nama file yang rapi
    const cleanNama = (formData.nama || 'MAHASISWA').replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
    const cleanNim = (formData.nim || 'NIM').replace(/[^a-zA-Z0-9]/g, '');
    const cleanCode = (templateConfig.id || 'SURAT').replace(/-/g, '_').toUpperCase();
    let finalFilename = `${cleanCode}_${cleanNim}_${cleanNama}.docx`;

    const contentDisp = response.headers.get('content-disposition');
    if (contentDisp && contentDisp.includes('filename=')) {
      const match = contentDisp.match(/filename="?([^";]+)"?/);
      if (match && match[1]) {
        try {
          finalFilename = decodeURIComponent(match[1]);
        } catch (_) {
          finalFilename = match[1];
        }
      }
    }

    // Trigger unduhan otomatis di browser
    const downloadUrl = URL.createObjectURL(outputBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    return {
      success: true,
      filename: finalFilename
    };
  } catch (error) {
    console.error('Error generating Word document:', error);
    throw error;
  }
}

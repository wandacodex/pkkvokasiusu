'use client';

import { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Download,
  X,
  RefreshCw,
  Eye,
  FileText
} from 'lucide-react';
import { parseExcelFile, downloadSampleTemplate } from '@/src/lib/excelHelper';

export default function ExcelImportModal({
  isOpen,
  type, // 'beasiswa' | 'prestasi' | 'tracer'
  onClose,
  onSuccess
}) {
  const [file, setFile] = useState(null);
  const [parseResult, setParseResult] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const typeLabels = {
    beasiswa: 'Penerima Beasiswa',
    prestasi: 'Mahasiswa Berprestasi',
    tracer: 'Data Tracer Study Alumni'
  };

  const handleFileChange = async (selectedFile) => {
    if (!selectedFile) return;

    // Check extension
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const hasValidExt = validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setErrorMessage('Format berkas tidak didukung. Harap pilih berkas berekstensi .xlsx, .xls, atau .csv');
      return;
    }

    setFile(selectedFile);
    setErrorMessage('');
    setIsParsing(true);

    try {
      const result = await parseExcelFile(selectedFile, type);
      if (result.success) {
        setParseResult(result);
        if (result.validRows.length === 0) {
          setErrorMessage('Tidak ditemukan baris data yang valid pada berkas Excel.');
        }
      } else {
        setErrorMessage(result.error || 'Gagal membaca berkas Excel.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Terjadi kesalahan saat memproses berkas Excel.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParseResult(null);
    setErrorMessage('');
    setShowPreview(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmImport = async () => {
    if (!parseResult || parseResult.validRows.length === 0) return;

    setIsUploading(true);
    setErrorMessage('');

    try {
      const endpoint = `/api/${type}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: parseResult.validRows })
      });

      const data = await res.json();
      if (data.success) {
        onSuccess(data.message || `Berhasil mengimpor ${parseResult.validRows.length} data ke Upstash Redis!`);
        handleReset();
        onClose();
      } else {
        setErrorMessage(data.error || 'Gagal menyimpan data ke database Upstash Redis.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Terjadi kesalahan jaringan saat mengirim data ke server.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            backgroundColor: 'var(--usu-green-dark)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '3px solid var(--usu-gold)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fef08a'
              }}
            >
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                Import Data {typeLabels[type]}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                Unggah berkas Microsoft Excel (.xlsx / .xls / .csv) untuk input massal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          {/* Download Template Strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={20} style={{ color: 'var(--usu-green)' }} />
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--usu-green-dark)' }}>
                  Gunakan Format Standar Kolom
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Unduh template resmi agar penamaan kolom sesuai sistem
                </div>
              </div>
            </div>

            <button
              onClick={() => downloadSampleTemplate(type)}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', flexShrink: 0 }}
            >
              <Download size={14} />
              <span>Unduh Template Excel</span>
            </button>
          </div>

          {/* Upload Area */}
          {!file ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '16px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: '#fafafa',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--usu-green)';
                e.currentTarget.style.backgroundColor = 'rgba(0, 103, 56, 0.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.backgroundColor = '#fafafa';
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".xlsx, .xls, .csv"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />

              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: '#ecfdf5',
                  color: 'var(--usu-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}
              >
                <UploadCloud size={28} />
              </div>

              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
                Klik untuk memilih berkas Excel atau tarik & lepaskan ke sini
              </div>
              <div style={{ fontSize: '0.825rem', color: '#64748b' }}>
                Mendukung format file <strong>.XLSX</strong>, <strong>.XLS</strong>, dan <strong>.CSV</strong>
              </div>
            </div>
          ) : (
            <div>
              {/* File Info Card */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px',
                  marginBottom: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileSpreadsheet size={24} style={{ color: 'var(--usu-green)' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#14532d' }}>
                      {file.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#15803d' }}>
                      {(file.size / 1024).toFixed(1)} KB • Siap diproses
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#dc2626',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RefreshCw size={13} />
                  <span>Ganti Berkas</span>
                </button>
              </div>

              {/* Parsing Indicator */}
              {isParsing && (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--usu-green)', fontSize: '0.875rem' }}>
                  Sedang membaca dan menganalisis baris tabel berkas Excel...
                </div>
              )}

              {/* Parse Results Overview */}
              {parseResult && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Baris Terbaca</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b' }}>
                        {parseResult.totalRows}
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#ecfdf5', padding: '0.85rem', borderRadius: '10px', border: '1px solid #a7f3d0', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', color: '#047857' }}>Baris Valid</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#065f46' }}>
                        {parseResult.validRows.length}
                      </div>
                    </div>
                    <div style={{ backgroundColor: parseResult.invalidRows.length ? '#fef2f2' : '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.75rem', color: parseResult.invalidRows.length ? '#b91c1c' : '#64748b' }}>Baris Gagal/Kosong</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: parseResult.invalidRows.length ? '#dc2626' : '#64748b' }}>
                        {parseResult.invalidRows.length}
                      </div>
                    </div>
                  </div>

                  {/* Toggle Preview Button */}
                  {parseResult.validRows.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      style={{
                        alignSelf: 'flex-start',
                        background: 'none',
                        border: 'none',
                        color: 'var(--usu-green)',
                        fontWeight: 600,
                        fontSize: '0.825rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: 0
                      }}
                    >
                      <Eye size={15} />
                      <span>{showPreview ? 'Sembunyikan Pratinjau Tabel' : `Lihat Pratinjau (${parseResult.validRows.length} Baris)`}</span>
                    </button>
                  )}

                  {/* Preview Table */}
                  {showPreview && (
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f1f5f9', position: 'sticky', top: 0 }}>
                          <tr>
                            <th style={{ padding: '6px 10px', borderBottom: '1px solid #cbd5e1' }}>No</th>
                            <th style={{ padding: '6px 10px', borderBottom: '1px solid #cbd5e1' }}>NIM</th>
                            <th style={{ padding: '6px 10px', borderBottom: '1px solid #cbd5e1' }}>
                              {type === 'tracer' ? 'Nama Alumni' : 'Nama Mahasiswa'}
                            </th>
                            <th style={{ padding: '6px 10px', borderBottom: '1px solid #cbd5e1' }}>Program Studi</th>
                            <th style={{ padding: '6px 10px', borderBottom: '1px solid #cbd5e1' }}>
                              {type === 'beasiswa' ? 'Jenis Beasiswa' : type === 'prestasi' ? 'Kompetisi' : 'Status Kerja'}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {parseResult.validRows.slice(0, 15).map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '6px 10px', color: '#64748b' }}>{idx + 1}</td>
                              <td style={{ padding: '6px 10px', fontFamily: 'monospace', fontWeight: 600 }}>{row.nim}</td>
                              <td style={{ padding: '6px 10px', fontWeight: 600 }}>{row.namaMahasiswa || row.nama || row.namaAlumni}</td>
                              <td style={{ padding: '6px 10px' }}>{row.prodi}</td>
                              <td style={{ padding: '6px 10px' }}>{row.jenisBeasiswa || row.namaKompetisi || row.statusPekerjaan}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {parseResult.validRows.length > 15 && (
                        <div style={{ padding: '6px 10px', fontSize: '0.72rem', color: '#64748b', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                          Menampilkan 15 dari {parseResult.validRows.length} data.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Error Notice */}
          {errorMessage && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.85rem 1rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                color: '#b91c1c',
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <AlertCircle size={17} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline btn-sm"
            disabled={isUploading}
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleConfirmImport}
            disabled={!parseResult || parseResult.validRows.length === 0 || isUploading}
            className="btn btn-primary btn-sm"
            style={{ minWidth: '170px' }}
          >
            {isUploading ? (
              <span>Menyimpan ke Upstash...</span>
            ) : (
              <>
                <CheckCircle2 size={16} />
                <span>Simpan {parseResult?.validRows?.length ? `(${parseResult.validRows.length} Data)` : ''}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

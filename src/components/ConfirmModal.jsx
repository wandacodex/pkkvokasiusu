'use client';

import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Hapus Data", isLoading = false }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div style={{ padding: '1.75rem 1.5rem', textAlign: 'center' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <AlertTriangle size={28} />
          </div>

          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{title || 'Konfirmasi Tindakan'}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            {message || 'Apakah Anda yakin ingin melanjutkan tindakan ini? Data yang dihapus tidak dapat dipulihkan.'}
          </p>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

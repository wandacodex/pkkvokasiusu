'use client';

import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const config = {
    success: {
      bg: '#ecfdf5',
      border: '#a7f3d0',
      text: '#065f46',
      icon: CheckCircle2,
      iconColor: '#059669',
    },
    error: {
      bg: '#fef2f2',
      border: '#fecaca',
      text: '#991b1b',
      icon: AlertCircle,
      iconColor: '#dc2626',
    },
    info: {
      bg: '#eff6ff',
      border: '#bfdbfe',
      text: '#1e40af',
      icon: Info,
      iconColor: '#2563eb',
    }
  }[type] || {
    bg: '#ecfdf5',
    border: '#a7f3d0',
    text: '#065f46',
    icon: CheckCircle2,
    iconColor: '#059669',
  };

  const Icon = config.icon;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.9rem 1.25rem',
        borderRadius: '12px',
        backgroundColor: config.bg,
        border: `1.5px solid ${config.border}`,
        color: config.text,
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
        minWidth: '280px',
        maxWidth: '420px',
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <Icon size={22} style={{ color: config.iconColor, flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: '0.885rem', fontWeight: 600 }}>{message}</div>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: config.text,
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.7,
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

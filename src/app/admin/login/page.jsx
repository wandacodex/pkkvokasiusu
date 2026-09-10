'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  ArrowLeft,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Jika sudah terautentikasi, langsung arahkan ke /kelola
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/kelola');
    }
  }, [status, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await signIn('credentials', {
        username: username.trim(),
        password: password.trim(),
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg('Email/Username atau kata sandi tidak cocok. Silakan periksa kembali akun admin Anda.');
      } else {
        router.push('/kelola');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Terjadi kendala koneksi ke server otentikasi. Silakan coba sesaat lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.25rem',
        background: 'radial-gradient(circle at 50% 15%, rgba(0, 90, 54, 0.08) 0%, rgba(248, 250, 252, 1) 70%)',
      }}
    >
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Back Link */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--usu-green)',
            marginBottom: '1.25rem',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Beranda Utama</span>
        </Link>

        {/* Clean Login Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '2.5rem 2.25rem',
            boxShadow: '0 20px 45px -12px rgba(0, 54, 32, 0.12)',
            border: '1.5px solid rgba(0, 90, 54, 0.12)',
          }}
        >
          {/* Brand Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '18px',
                background: '#ffffff',
                border: '2px solid rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                boxShadow: '0 6px 20px rgba(0, 54, 32, 0.1)',
                padding: '6px',
              }}
            >
              <img
                src="/assets/mainlogo.webp"
                alt="Logo USU"
                style={{ height: '48px', width: 'auto', objectFit: 'contain' }}
              />
            </div>

            <span
              style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: 'var(--usu-green)',
                backgroundColor: 'var(--usu-green-soft)',
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                border: '1px solid rgba(0, 90, 54, 0.2)',
                marginBottom: '0.4rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Portal Administrator
            </span>

            <h1
              style={{
                fontSize: '1.65rem',
                color: 'var(--usu-green-dark)',
                fontWeight: 800,
                fontFamily: 'Outfit, sans-serif',
                margin: '0 0 0.35rem',
              }}
            >
              Masuk Akun Pengelola
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Pendidikan, Kemahasiswaan, dan Kealumnian (PKK) • Fakultas Vokasi USU
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                color: '#991b1b',
                fontSize: '0.825rem',
                lineHeight: 1.45,
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Clean Login Form */}
          <form onSubmit={handleLogin}>
            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
              <label
                className="input-label"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#334155',
                  marginBottom: '0.45rem',
                }}
              >
                <Mail size={15} style={{ color: 'var(--usu-green)' }} />
                <span>Email atau Username Admin</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="nama@admin.vokasi.usu.ac.id"
                className="input-text"
                style={{
                  padding: '0.8rem 1rem',
                  fontSize: '0.9rem',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-subtle)',
                }}
              />
            </div>

            <div className="input-group" style={{ marginBottom: '1.25rem' }}>
              <label
                className="input-label"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#334155',
                  marginBottom: '0.45rem',
                }}
              >
                <Lock size={15} style={{ color: 'var(--usu-green)' }} />
                <span>Kata Sandi (Password)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Masukkan kata sandi..."
                  className="input-text"
                  style={{
                    padding: '0.8rem 2.8rem 0.8rem 1rem',
                    fontSize: '0.9rem',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border-subtle)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-light)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                  }}
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Help Option */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.825rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--usu-green)', width: '15px', height: '15px' }}
                />
                <span>Ingat saya di perangkat ini</span>
              </label>

              <Link
                href="/security"
                style={{ color: 'var(--usu-green)', fontWeight: 600, textDecoration: 'none', fontSize: '0.8rem' }}
                title="Pemeriksaan Keamanan"
              >
                Security Check
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                borderRadius: '12px',
                boxShadow: '0 6px 18px rgba(0, 90, 54, 0.25)',
              }}
            >
              {isLoading ? (
                <span>Memverifikasi Akun...</span>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Masuk ke Panel Kelola</span>
                </>
              )}
            </button>
          </form>

          {/* Trust & Security Verification Footnote */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              fontSize: '0.78rem',
              color: 'var(--text-light)',
            }}
          >
            <ShieldCheck size={14} style={{ color: '#059669' }} />
            <span>Koneksi Terenkripsi TLS 1.3 • Dilindungi Kebijakan Keamanan USU</span>
          </div>
        </div>
      </div>
    </div>
  );
}

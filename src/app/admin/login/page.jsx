'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  KeyRound
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [username, setUsername] = useState('admin@vokasi.usu.ac.id');
  const [password, setPassword] = useState('adminvokasi2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Jika sudah login, langsung alihkan ke /kelola
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
        setErrorMsg('Username atau password yang Anda masukkan salah. Silakan periksa kembali kredensial Anda.');
      } else {
        // Berhasil login, arahkan ke panel kelola CRUD
        router.push('/kelola');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Terjadi gangguan koneksi pada server otentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.25rem', backgroundColor: '#f1f5f9' }}>
      <div style={{ maxWidth: '460px', width: '100%' }}>
        {/* Back Link */}
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--usu-green)',
            marginBottom: '1.25rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Login Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '2.5rem 2rem',
            boxShadow: '0 20px 35px -10px rgba(0, 90, 54, 0.15)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {/* Brand Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '20px',
                background: '#ffffff',
                border: '2px solid rgba(0, 90, 54, 0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: '0 8px 24px rgba(0, 90, 54, 0.15)',
                padding: '6px',
              }}
            >
              <img
                src="/assets/mainlogo.webp"
                alt="Logo Resmi USU"
                style={{ height: '56px', width: 'auto', objectFit: 'contain' }}
              />
            </div>

            <h1 style={{ fontSize: '1.6rem', color: 'var(--usu-green-dark)', marginTop: '0.2rem', marginBottom: '0.35rem', fontWeight: 800 }}>
              Portal Pengelola Data
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Akses khusus staf dan pengelola kemahasiswaan Fakultas Vokasi USU.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                color: '#991b1b',
                fontSize: '0.85rem',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={15} style={{ color: 'var(--usu-green)' }} />
                <span>Username atau Email Admin</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="admin@vokasi.usu.ac.id"
                className="input-text"
                style={{ padding: '0.8rem 1rem' }}
              />
            </div>

            <div className="input-group">
              <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lock size={15} style={{ color: 'var(--usu-green)' }} />
                <span>Kata Sandi (Password)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="input-text"
                  style={{ padding: '0.8rem 2.8rem 0.8rem 1rem' }}
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
                  }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              {isLoading ? 'Memverifikasi Sesi...' : (
                <>
                  <LogIn size={18} />
                  <span>Masuk ke Panel CRUD</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Info Box */}
          <div
            style={{
              marginTop: '1.75rem',
              padding: '1rem',
              borderRadius: '12px',
              backgroundColor: 'var(--usu-green-soft)',
              border: '1px solid rgba(0, 90, 54, 0.2)',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--usu-green-dark)', marginBottom: '0.35rem' }}>
              <KeyRound size={15} />
              <span>Kredensial Akses Pengelola:</span>
            </div>
            <div style={{ color: 'var(--text-main)', lineHeight: 1.6 }}>
              <div>• <strong>Username:</strong> <code>admin@vokasi.usu.ac.id</code> atau <code>admin</code></div>
              <div>• <strong>Password:</strong> <code>adminvokasi2026</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Home,
  FileText,
  Award,
  GraduationCap,
  Briefcase,
  Database,
  Menu,
  X,
  LogOut,
  ChevronRight,
  User
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Surat Permohonan', href: '/surat', icon: FileText },
    { name: 'Beasiswa', href: '/beasiswa', icon: GraduationCap },
    { name: 'Prestasi Mahasiswa', href: '/prestasi', icon: Award },
    { name: 'Tracer Study', href: '/tracer-study', icon: Briefcase },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Main Glassmorphic Navbar */}
      <nav
        style={{
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 90, 54, 0.12)',
          boxShadow: '0 2px 14px rgba(0, 54, 32, 0.05)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.65rem 1.25rem',
            gap: '1.5rem',
          }}
        >
          {/* Logo & Identitas Bersih */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <img
              src="/assets/mainlogo.webp"
              alt="Logo USU"
              style={{
                height: '42px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />

            <div>
              <div
                style={{
                  fontSize: '1.18rem',
                  fontWeight: 800,
                  fontFamily: 'Outfit, sans-serif',
                  letterSpacing: '-0.02em',
                  color: 'var(--usu-green)',
                  lineHeight: 1.15,
                }}
              >
                PKK Vokasi USU
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: '#64748b',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                  lineHeight: 1.2,
                  marginTop: '1px',
                }}
              >
                Pendidikan, Kemahasiswaan, dan Kealumnian
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div style={{ display: 'none', alignItems: 'center', gap: '0.35rem' }} className="desktop-menu">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 0.95rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--usu-green)' : '#334155',
                    backgroundColor: isActive ? 'var(--usu-green-soft)' : 'transparent',
                    transition: 'all 0.18s ease',
                    textDecoration: 'none',
                    border: isActive ? '1px solid rgba(0, 90, 54, 0.15)' : '1px solid transparent',
                  }}
                  className="nav-link-hover"
                >
                  {Icon && <Icon size={16} style={{ color: isActive ? 'var(--usu-green)' : '#64748b' }} />}
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Jika sesi admin login aktif: tampilkan link ke Kelola Data */}
            {session && (
              <Link
                href="/kelola"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 0.95rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: pathname === '/kelola' ? 700 : 600,
                  color: '#7e22ce',
                  backgroundColor: pathname === '/kelola' ? '#f3e8ff' : '#faf5ff',
                  border: '1px solid rgba(147, 51, 234, 0.3)',
                  textDecoration: 'none',
                  marginLeft: '0.5rem',
                }}
              >
                <Database size={15} />
                <span>Kelola Data</span>
              </Link>
            )}
          </div>

          {/* Sisi Kanan: Hanya Tampil Jika Sedang Login Admin (Sesi Aktif) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {session ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--usu-green-soft)',
                    color: 'var(--usu-green-dark)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  <User size={14} />
                  <span>Admin</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.4rem 0.65rem',
                    borderRadius: '8px',
                    backgroundColor: '#fff1f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  title="Keluar dari sesi admin"
                >
                  <LogOut size={14} />
                  <span>Keluar</span>
                </button>
              </div>
            ) : null}

            {/* Mobile Menu Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                border: '1.5px solid var(--border-subtle)',
                background: '#ffffff',
                color: 'var(--usu-green)',
                cursor: 'pointer',
              }}
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer: Bersih, Rapi, Touch-Friendly */}
        {mobileMenuOpen && (
          <div
            style={{
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: '#ffffff',
              padding: '0.75rem 1rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.45rem',
              boxShadow: '0 12px 30px rgba(0, 54, 32, 0.1)',
            }}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--usu-green)' : '#334155',
                    backgroundColor: isActive ? 'var(--usu-green-soft)' : '#f8fafc',
                    border: isActive ? '1px solid rgba(0, 90, 54, 0.2)' : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    {Icon && <Icon size={18} style={{ color: isActive ? 'var(--usu-green)' : '#64748b' }} />}
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight size={16} style={{ color: isActive ? 'var(--usu-green)' : '#94a3b8' }} />
                </Link>
              );
            })}

            {session && (
              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                <Link
                  href="/kelola"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: '#7e22ce',
                    backgroundColor: '#faf5ff',
                    textDecoration: 'none',
                  }}
                >
                  <Database size={18} />
                  <span>Panel Kelola Data</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#dc2626',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                  }}
                >
                  <LogOut size={16} />
                  <span>Keluar dari Akun Admin</span>
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

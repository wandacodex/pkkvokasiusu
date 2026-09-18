'use client';

import { useState, useEffect } from 'react';
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
  User,
  ShieldCheck,
  Lock,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Surat Permohonan', href: '/surat', icon: FileText },
    { name: 'Beasiswa', href: '/beasiswa', icon: GraduationCap },
    { name: 'Prestasi', href: '/prestasi', icon: Award },
    { name: 'Tracer Study', href: '/tracer-study', icon: Briefcase },
    { name: 'Sertifikat Akreditasi', href: '/akreditasi', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Main Glassmorphic Clean Navbar */}
      <nav
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1.5px solid rgba(6, 127, 66, 0.12)',
          boxShadow: '0 4px 20px rgba(6, 127, 66, 0.04)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.65rem 1.25rem',
            gap: '1rem',
          }}
        >
          {/* Logo & Brand Identity */}
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
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#ffffff',
                border: '1.5px solid rgba(245, 158, 11, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3px',
                boxShadow: '0 2px 8px rgba(0, 54, 32, 0.08)',
              }}
            >
              <img
                src="/assets/mainlogo.webp"
                alt="Logo USU"
                style={{
                  height: '34px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </div>

            <div>
              <div
                style={{
                  fontSize: '1.15rem',
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
                  fontSize: '0.7rem',
                  color: '#64748b',
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  lineHeight: 1.2,
                  marginTop: '1px',
                }}
              >
                Pendidikan, Kemahasiswaan, dan Kealumnian
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links (Clean & Center-Aligned) */}
          <div className="nav-desktop-container">
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
                    gap: '0.4rem',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? 'var(--usu-green)' : '#334155',
                    backgroundColor: isActive ? 'var(--usu-green-soft)' : 'transparent',
                    border: isActive ? '1px solid rgba(6, 127, 66, 0.22)' : '1px solid transparent',
                    transition: 'all 0.18s ease',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                  className="nav-link-hover"
                >
                  {Icon && <Icon size={15} style={{ color: isActive ? 'var(--usu-green)' : '#64748b' }} />}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Bar (Sleek, Clean, No Security Check or Admin Login Buttons) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }}>
            {/* If authenticated session exists, show sleek user management */}
            {session && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Link
                  href="/kelola"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--usu-green-dark)',
                    backgroundColor: 'var(--usu-green-soft)',
                    border: '1px solid rgba(6, 127, 66, 0.25)',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                  title="Panel Pengelolaan Data"
                >
                  <Database size={13} />
                  <span>Panel Data</span>
                </Link>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.65rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--usu-green-soft)',
                    color: 'var(--usu-green-dark)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                  title={`Login sebagai ${session?.user?.name || 'Admin'}`}
                >
                  <User size={13} />
                  <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {session?.user?.name?.split(' ')[0] || 'Admin'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  title="Keluar dari sesi admin"
                  aria-label="Logout"
                >
                  <LogOut size={14} />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nav-mobile-toggle-btn"
              aria-label="Buka Menu Navigasi"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Down Drawer Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-nav-drawer"
            role="region"
            aria-label="Menu Navigasi Mobile"
            style={{
              backgroundColor: '#ffffff',
              borderTop: '1px solid var(--border-subtle)',
              padding: '1rem 1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              boxShadow: '0 14px 30px rgba(0, 54, 32, 0.08)',
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
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? 'var(--usu-green)' : '#334155',
                    backgroundColor: isActive ? 'var(--usu-green-soft)' : '#f8fafc',
                    border: isActive ? '1px solid rgba(6, 127, 66, 0.22)' : '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {Icon && <Icon size={16} style={{ color: isActive ? 'var(--usu-green)' : '#64748b' }} />}
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight size={15} style={{ color: isActive ? 'var(--usu-green)' : '#94a3b8' }} />
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
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    color: 'var(--usu-green-dark)',
                    backgroundColor: 'var(--usu-green-soft)',
                    border: '1px solid rgba(6, 127, 66, 0.25)',
                    textDecoration: 'none',
                    marginBottom: '0.5rem',
                  }}
                >
                  <Database size={16} />
                  <span>Panel Pengelolaan Data</span>
                </Link>
                <button
                  type="button"
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
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#dc2626',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={15} />
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

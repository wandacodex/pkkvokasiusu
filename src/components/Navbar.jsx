'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Home,
  Building2,
  BookOpen,
  FileText,
  Calendar,
  ShieldCheck,
  GraduationCap,
  Award,
  Briefcase,
  Users,
  Database,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ChevronDown,
  User,
  Sparkles,
  Clock,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Desktop dropdown state
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);
  const navContainerRef = useRef(null);

  // Mobile accordion state
  const [mobileExpanded, setMobileExpanded] = useState({
    pendidikan: false,
    kemahasiswaan: false,
    kealumnian: false,
  });

  // Navigation Items with Categories & Sub-Categories
  const navItems = [
    {
      type: 'link',
      name: 'Tentang PKK',
      href: '/',
      icon: Building2,
      exactMatch: true,
    },
    {
      type: 'dropdown',
      id: 'pendidikan',
      name: 'Pendidikan',
      icon: BookOpen,
      matchPrefixes: ['/surat', '/kalender-akademik', '/akreditasi'],
      items: [
        {
          name: 'Surat Permohonan',
          href: '/surat',
          icon: FileText,
          description: '19 template surat permohonan resmi format Word (.docx)',
        },
        {
          name: 'Kalender Akademik',
          href: '/kalender-akademik',
          icon: Calendar,
          description: 'Jadwal operasional, perkuliahan, dan agenda resmi USU',
        },
        {
          name: 'Sertifikat Akreditasi',
          href: '/akreditasi',
          icon: ShieldCheck,
          description: 'Status & salinan SK akreditasi resmi 21 prodi Vokasi',
        },
      ],
    },
    {
      type: 'dropdown',
      id: 'kemahasiswaan',
      name: 'Kemahasiswaan',
      icon: GraduationCap,
      matchPrefixes: ['/beasiswa', '/prestasi'],
      items: [
        {
          name: 'Data Beasiswa',
          href: '/beasiswa',
          icon: GraduationCap,
          description: 'Direktori & rekapitulasi data 3.645+ penerima beasiswa',
        },
        {
          name: 'Data Prestasi',
          href: '/prestasi',
          icon: Award,
          description: 'Koleksi torehan prestasi mahasiswa terverifikasi',
        },
      ],
    },
    {
      type: 'dropdown',
      id: 'kealumnian',
      name: 'Kealumnian',
      icon: Briefcase,
      matchPrefixes: ['/tracer-study', '/alumni'],
      items: [
        {
          name: 'Tracer Study',
          href: '/tracer-study',
          icon: Briefcase,
          description: 'Visualisasi grafik status transisi karir lulusan vokasi',
        },
        {
          name: 'Jumlah Alumni',
          href: '/tracer-study#jumlah-alumni',
          icon: Users,
          description: 'Data resmi 3.017 wisudawan & alumni per prodi (2022-2026)',
        },
      ],
    },
  ];

  const isCategoryActive = (category) => {
    if (category.type === 'link') {
      return pathname === category.href;
    }
    return category.matchPrefixes?.some((prefix) => pathname.startsWith(prefix));
  };

  // Hover handlers with debounce to prevent menu flickering
  const handleMouseEnter = (id) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(id);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 160);
  };

  const toggleDropdown = (id) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const toggleMobileAccordion = (id) => {
    setMobileExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Close desktop dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close all menus on pathname change
  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Expand the active mobile accordion automatically
  useEffect(() => {
    if (['/surat', '/kalender-akademik', '/akreditasi'].includes(pathname)) {
      setMobileExpanded((prev) => ({ ...prev, pendidikan: true }));
    } else if (['/beasiswa', '/prestasi'].includes(pathname)) {
      setMobileExpanded((prev) => ({ ...prev, kemahasiswaan: true }));
    } else if (['/tracer-study', '/alumni'].includes(pathname)) {
      setMobileExpanded((prev) => ({ ...prev, kealumnian: true }));
    }
  }, [pathname]);

  // Close mobile drawer on Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setOpenDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header
      className="site-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        backgroundColor: '#ffffff',
        transition: 'all 0.25s ease',
      }}
    >
      {/* Top Utility Bar (Institutional Quick Access from DESIGN.md Section 10 & 11) */}
      <div
        style={{
          backgroundColor: 'var(--usu-brand-deep)',
          color: '#ffffff',
          fontSize: '0.78rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0.35rem 0',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#e0ebe4' }}>
            <span style={{ fontWeight: 600, color: 'var(--usu-accent)' }}>
              Portal Layanan PKK Vokasi USU
            </span>
            <span style={{ opacity: 0.5 }}>|</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={12} style={{ color: 'var(--usu-accent)' }} />
              <span>Senin - Jumat (08.00 - 16.00 WIB)</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <a
              href="https://vokasi.usu.ac.id"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#e0ebe4', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Fakultas Vokasi</span>
              <ExternalLink size={11} style={{ opacity: 0.7 }} />
            </a>
            <a
              href="https://sia.usu.ac.id"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#e0ebe4', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>SIA USU</span>
              <ExternalLink size={11} style={{ opacity: 0.7 }} />
            </a>
            <a
              href="https://satudata.usu.ac.id"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#e0ebe4', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Satu Data</span>
              <ExternalLink size={11} style={{ opacity: 0.7 }} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Clean Institutional Navbar */}
      <nav
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--usu-border)',
          boxShadow: '0 2px 8px rgba(12, 59, 42, 0.04)',
          position: 'relative',
          zIndex: 1000,
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
              gap: '0.85rem',
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--usu-radius-control)',
                background: '#ffffff',
                border: '1.5px solid var(--usu-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
              }}
            >
              <img
                src="/assets/mainlogo.webp"
                alt="Logo USU"
                style={{
                  height: '36px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
            </div>

            <div>
              <div
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: 'var(--usu-brand)',
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                  marginBottom: '2px',
                }}
              >
                Universitas Sumatera Utara
              </div>
              <div
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  fontFamily: 'var(--usu-font)',
                  letterSpacing: '-0.01em',
                  color: 'var(--usu-brand)',
                  lineHeight: 1.15,
                }}
              >
                Fakultas Vokasi
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--usu-text-secondary)',
                  fontWeight: 500,
                  lineHeight: 1.2,
                  marginTop: '1px',
                }}
              >
                Pendidikan, Kemahasiswaan & Kealumnian (PKK)
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links with Category Dropdowns */}
          <div ref={navContainerRef} className="nav-desktop-container">
            {navItems.map((item) => {
              if (item.type === 'link') {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem 0.85rem',
                      borderRadius: 'var(--usu-radius-control)',
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--usu-brand)' : 'var(--usu-text)',
                      backgroundColor: isActive ? 'var(--usu-surface)' : 'transparent',
                      border: isActive ? '1px solid var(--usu-border)' : '1px solid transparent',
                      transition: 'all 0.18s ease',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                    className="nav-link-hover"
                  >
                    {Icon && <Icon size={15} style={{ color: isActive ? 'var(--usu-brand)' : 'var(--usu-text-secondary)' }} />}
                    <span>{item.name}</span>
                  </Link>
                );
              }

              // Dropdown Category Component
              const isActive = isCategoryActive(item);
              const isOpen = openDropdown === item.id;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() => toggleDropdown(item.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.5rem 0.85rem',
                      borderRadius: 'var(--usu-radius-control)',
                      fontSize: '0.875rem',
                      fontWeight: isActive || isOpen ? 600 : 500,
                      color: isActive || isOpen ? 'var(--usu-brand)' : 'var(--usu-text)',
                      backgroundColor: isActive || isOpen ? 'var(--usu-surface)' : 'transparent',
                      border: isActive || isOpen ? '1px solid var(--usu-border)' : '1px solid transparent',
                      transition: 'all 0.18s ease',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      background: 'none',
                    }}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    aria-label={`Menu ${item.name}`}
                  >
                    {Icon && <Icon size={15} style={{ color: isActive || isOpen ? 'var(--usu-brand)' : 'var(--usu-text-secondary)' }} />}
                    <span>{item.name}</span>
                    <ChevronDown
                      size={14}
                      style={{
                        color: isActive || isOpen ? 'var(--usu-brand)' : 'var(--usu-text-secondary)',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </button>

                  {/* Floating Dropdown Menu Panel (DESIGN.md Section 11 & tokens.css) */}
                  {isOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        left: '0',
                        minWidth: '320px',
                        backgroundColor: '#ffffff',
                        borderRadius: 'var(--usu-radius-control)',
                        border: '1px solid var(--usu-border)',
                        boxShadow: 'var(--usu-shadow-menu)',
                        padding: '0.4rem',
                        zIndex: 1100,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.2rem',
                        animation: 'fadeInSlide 0.18s ease forwards',
                      }}
                      role="menu"
                    >
                      {item.items.map((subItem) => {
                        const isSubActive =
                          pathname === subItem.href ||
                          (subItem.href.includes('#jumlah-alumni') && pathname === '/tracer-study');
                        const SubIcon = subItem.icon;

                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => {
                              setOpenDropdown(null);
                              if (pathname === '/tracer-study' && subItem.href.includes('#jumlah-alumni')) {
                                const el = document.getElementById('jumlah-alumni');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              padding: '0.65rem 0.75rem',
                              borderRadius: 'var(--usu-radius-control)',
                              textDecoration: 'none',
                              backgroundColor: isSubActive ? 'var(--usu-surface)' : 'transparent',
                              transition: 'all 0.15s ease',
                            }}
                            className="dropdown-item-hover"
                            role="menuitem"
                          >
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: 'var(--usu-radius-control)',
                                backgroundColor: isSubActive ? 'rgba(0, 105, 55, 0.12)' : 'var(--usu-surface)',
                                color: isSubActive ? 'var(--usu-brand)' : 'var(--usu-brand)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <SubIcon size={16} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: '0.85rem',
                                  fontWeight: isSubActive ? 700 : 600,
                                  color: isSubActive ? 'var(--usu-brand)' : 'var(--usu-text)',
                                  lineHeight: 1.25,
                                }}
                              >
                                {subItem.name}
                              </div>
                              {subItem.description && (
                                <div
                                  style={{
                                    fontSize: '0.72rem',
                                    color: 'var(--usu-text-secondary)',
                                    lineHeight: 1.2,
                                    marginTop: '2px',
                                    whiteSpace: 'normal',
                                  }}
                                >
                                  {subItem.description}
                                </div>
                              )}
                            </div>
                            {isSubActive && (
                              <span
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  backgroundColor: 'var(--usu-brand)',
                                  flexShrink: 0,
                                }}
                              />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Action Bar (Session Status / Quick Action / Mobile Toggle) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }}>
            {/* Quick Action: Ajukan Surat Permohonan */}
            <Link
              href="/surat"
              className="usu-button usu-button--primary nav-action-btn-desktop"
              style={{
                minBlockSize: '2.35rem',
                padding: '0.45rem 0.95rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <FileText size={14} />
              <span>Ajukan Surat</span>
            </Link>

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
                    borderRadius: 'var(--usu-radius-control)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--usu-brand-deep)',
                    backgroundColor: 'var(--usu-surface)',
                    border: '1px solid var(--usu-border)',
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
                    borderRadius: 'var(--usu-radius-control)',
                    backgroundColor: 'var(--usu-surface)',
                    color: 'var(--usu-text)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
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

        {/* Mobile Slide-Down Drawer Menu with Accordions */}
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
              gap: '0.5rem',
              boxShadow: '0 16px 36px rgba(0, 54, 32, 0.12)',
              maxHeight: '85vh',
              overflowY: 'auto',
              position: 'relative',
              zIndex: 1050,
            }}
          >
            {navItems.map((item) => {
              if (item.type === 'link') {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
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
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight size={15} style={{ color: isActive ? 'var(--usu-green)' : '#94a3b8' }} />
                  </Link>
                );
              }

              // Dropdown Category in Mobile (Accordion)
              const isCatActive = isCategoryActive(item);
              const isExpanded = mobileExpanded[item.id];
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  style={{
                    borderRadius: 'var(--usu-radius-control)',
                    border: isCatActive ? '1px solid var(--usu-border-strong)' : '1px solid var(--usu-border)',
                    backgroundColor: isCatActive ? 'var(--usu-surface)' : '#ffffff',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleMobileAccordion(item.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      backgroundColor: isCatActive ? 'var(--usu-surface)' : '#f8fafc',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: isCatActive ? 'var(--usu-brand)' : 'var(--usu-text)',
                    }}
                    aria-expanded={isExpanded}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {Icon && <Icon size={16} style={{ color: isCatActive ? 'var(--usu-brand)' : 'var(--usu-text-secondary)' }} />}
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown
                      size={15}
                      style={{
                        color: isCatActive ? 'var(--usu-brand)' : 'var(--usu-text-secondary)',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </button>

                  {isExpanded && (
                    <div
                      style={{
                        padding: '0.35rem 0.5rem 0.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      {item.items.map((subItem) => {
                        const isSubActive =
                          pathname === subItem.href ||
                          (subItem.href.includes('#jumlah-alumni') && pathname === '/tracer-study');
                        const SubIcon = subItem.icon;

                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              if (pathname === '/tracer-study' && subItem.href.includes('#jumlah-alumni')) {
                                const el = document.getElementById('jumlah-alumni');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.65rem',
                              padding: '0.6rem 0.75rem',
                              borderRadius: 'var(--usu-radius-control)',
                              textDecoration: 'none',
                              fontSize: '0.85rem',
                              fontWeight: isSubActive ? 600 : 500,
                              color: isSubActive ? 'var(--usu-brand)' : 'var(--usu-text)',
                              backgroundColor: isSubActive ? 'var(--usu-surface)' : 'transparent',
                            }}
                          >
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: 'var(--usu-radius-control)',
                                backgroundColor: isSubActive ? 'rgba(0, 105, 55, 0.12)' : 'var(--usu-surface)',
                                color: 'var(--usu-brand)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <SubIcon size={14} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{subItem.name}</div>
                              {subItem.description && (
                                <div style={{ fontSize: '0.7rem', color: 'var(--usu-text-secondary)', lineHeight: 1.2 }}>
                                  {subItem.description}
                                </div>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Admin Session Controls */}
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

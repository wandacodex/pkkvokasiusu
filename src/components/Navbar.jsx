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
  Sparkles
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
      {/* Main Glassmorphic Clean Navbar */}
      <nav
        style={{
          backgroundColor: '#ffffff',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1.5px solid rgba(6, 127, 66, 0.12)',
          boxShadow: '0 4px 20px rgba(6, 127, 66, 0.05)',
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
                      borderRadius: '8px',
                      fontSize: '0.88rem',
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
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: isActive || isOpen ? 700 : 600,
                      color: isActive || isOpen ? 'var(--usu-green)' : '#334155',
                      backgroundColor: isActive || isOpen ? 'var(--usu-green-soft)' : 'transparent',
                      border: isActive || isOpen ? '1px solid rgba(6, 127, 66, 0.22)' : '1px solid transparent',
                      transition: 'all 0.18s ease',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      background: 'none',
                    }}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    aria-label={`Menu ${item.name}`}
                  >
                    {Icon && <Icon size={15} style={{ color: isActive || isOpen ? 'var(--usu-green)' : '#64748b' }} />}
                    <span>{item.name}</span>
                    <ChevronDown
                      size={14}
                      style={{
                        color: isActive || isOpen ? 'var(--usu-green)' : '#94a3b8',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </button>

                  {/* Floating Glassmorphic Dropdown Menu Panel */}
                  {isOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        left: '0',
                        minWidth: '320px',
                        backgroundColor: '#ffffff',
                        borderRadius: '14px',
                        border: '1.5px solid rgba(6, 127, 66, 0.16)',
                        boxShadow: '0 20px 45px -8px rgba(0, 54, 32, 0.2), 0 0 1px 1px rgba(0, 54, 32, 0.08)',
                        padding: '0.5rem',
                        zIndex: 1100,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
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
                              borderRadius: '10px',
                              textDecoration: 'none',
                              backgroundColor: isSubActive ? 'var(--usu-green-soft)' : 'transparent',
                              transition: 'all 0.15s ease',
                            }}
                            className="dropdown-item-hover"
                            role="menuitem"
                          >
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                backgroundColor: isSubActive ? 'rgba(6, 127, 66, 0.18)' : '#f1f5f9',
                                color: isSubActive ? 'var(--usu-green-dark)' : 'var(--usu-green)',
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
                                  color: isSubActive ? 'var(--usu-green-dark)' : '#1e293b',
                                  lineHeight: 1.25,
                                }}
                              >
                                {subItem.name}
                              </div>
                              {subItem.description && (
                                <div
                                  style={{
                                    fontSize: '0.72rem',
                                    color: '#64748b',
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
                                  backgroundColor: 'var(--usu-green)',
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

          {/* Right Action Bar (Session Status / Mobile Toggle) */}
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
                    borderRadius: '10px',
                    border: isCatActive ? '1.5px solid rgba(6, 127, 66, 0.3)' : '1px solid #e2e8f0',
                    backgroundColor: isCatActive ? 'rgba(6, 127, 66, 0.02)' : '#ffffff',
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
                      backgroundColor: isCatActive ? 'var(--usu-green-soft)' : '#f8fafc',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: isCatActive ? 'var(--usu-green)' : '#1e293b',
                    }}
                    aria-expanded={isExpanded}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {Icon && <Icon size={16} style={{ color: isCatActive ? 'var(--usu-green)' : '#64748b' }} />}
                      <span>{item.name}</span>
                    </div>
                    <ChevronDown
                      size={15}
                      style={{
                        color: isCatActive ? 'var(--usu-green)' : '#94a3b8',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </button>

                  {isExpanded && (
                    <div
                      style={{
                        padding: '0.4rem 0.5rem 0.5rem',
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
                              borderRadius: '8px',
                              textDecoration: 'none',
                              fontSize: '0.85rem',
                              fontWeight: isSubActive ? 700 : 500,
                              color: isSubActive ? 'var(--usu-green)' : '#334155',
                              backgroundColor: isSubActive ? 'var(--usu-green-soft)' : 'transparent',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <div
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                backgroundColor: isSubActive ? 'rgba(6, 127, 66, 0.18)' : '#f1f5f9',
                                color: isSubActive ? 'var(--usu-green-dark)' : 'var(--usu-green)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <SubIcon size={14} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div>{subItem.name}</div>
                            </div>
                            {isSubActive && (
                              <span
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  borderRadius: '50%',
                                  backgroundColor: 'var(--usu-green)',
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

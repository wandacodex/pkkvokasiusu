import './globals.css';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import AuthProvider from '@/src/components/AuthProvider';

export const metadata = {
  title: 'PKK VOKASI USU | Pendidikan, Kemahasiswaan, dan Kealumnian Fakultas Vokasi Universitas Sumatera Utara',
  description: 'Portal Pendidikan, Kemahasiswaan, dan Kealumnian Fakultas Vokasi Universitas Sumatera Utara. Layanan unduh template surat permohonan mahasiswa, direktori penerima beasiswa, prestasi mahasiswa, dan tracer study terintegrasi.',
  keywords: 'PKK Vokasi USU, Fakultas Vokasi USU, Pendidikan Kemahasiswaan Kealumnian, Beasiswa Vokasi, Mahasiswa Berprestasi Vokasi, Tracer Study Vokasi, Surat Permohonan Mahasiswa',
  icons: {
    icon: '/assets/mainlogo.webp',
    shortcut: '/assets/mainlogo.webp',
    apple: '/assets/mainlogo.webp',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" type="image/webp" href="/assets/mainlogo.webp" />
        <link rel="apple-touch-icon" href="/assets/mainlogo.webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main-content" className="usu-skip-link">
          Lewati ke konten utama
        </a>
        <AuthProvider>
          <Navbar />
          <main id="main-content" style={{ minHeight: 'calc(100vh - 450px)' }}>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

import CredentialsProvider from 'next-auth/providers/credentials';
import crypto from 'crypto';

// Helper for constant-time comparison to prevent timing attacks
function timingSafeCompare(a, b) {
  if (!a || !b) return false;
  const strA = String(a).trim();
  const strB = String(b).trim();
  const bufA = Buffer.from(strA);
  const bufB = Buffer.from(strB);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Vokasi USU',
      credentials: {
        username: { label: 'Username / Email', type: 'text', placeholder: 'admin@vokasi.usu.ac.id' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { username, password } = credentials || {};
        if (!username || !password) return null;

        const normalizedUser = String(username).trim().toLowerCase();
        const rawPass = String(password).trim();

        // 1. Akun Wanda Codex (Superadmin)
        const wandaUser = (process.env.ADMIN_WANDA_USER || 'wanda@admin.vokasi.usu.ac.id').toLowerCase();
        const wandaPass = process.env.ADMIN_WANDA_PASS || '';
        const isWandaUser = normalizedUser === wandaUser || normalizedUser === 'wanda';
        const isWandaPass = wandaPass ? timingSafeCompare(rawPass, wandaPass) : false;

        if (isWandaUser && isWandaPass) {
          return {
            id: 'admin-wanda',
            name: 'Wanda Codex (Admin)',
            email: 'wanda@admin.vokasi.usu.ac.id',
            role: 'SUPERADMIN',
            fakultas: 'Fakultas Vokasi Universitas Sumatera Utara',
          };
        }

        // 2. Akun Administrator Resmi Fakultas Vokasi USU
        const officialUser = (process.env.ADMIN_OFFICIAL_USER || 'admin@vokasi.usu.ac.id').toLowerCase();
        const officialPass = process.env.ADMIN_OFFICIAL_PASS || '';
        const isOfficialUser = normalizedUser === officialUser || normalizedUser === 'admin';
        const isOfficialPass = officialPass ? timingSafeCompare(rawPass, officialPass) : false;

        if (isOfficialUser && isOfficialPass) {
          return {
            id: 'admin-01',
            name: 'Administrator PKK Vokasi',
            email: 'admin@vokasi.usu.ac.id',
            role: 'ADMIN',
            fakultas: 'Fakultas Vokasi Universitas Sumatera Utara',
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 jam batas sesi kerja aman (OWASP recommended)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.fakultas = user.fakultas;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.fakultas = token.fakultas;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

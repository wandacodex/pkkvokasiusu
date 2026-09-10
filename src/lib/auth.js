import CredentialsProvider from 'next-auth/providers/credentials';

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

        // Verifikasi akun admin resmi Fakultas Vokasi USU
        const normalizedUser = String(username || '').trim().toLowerCase();
        const rawPass = String(password || '').trim();

        const isWandaAdmin =
          (normalizedUser === 'wanda@admin.vokasi.usu.ac.id' || normalizedUser === 'wanda') &&
          rawPass === 'wanda123';

        const isLegacyAdmin =
          (normalizedUser === 'admin@vokasi.usu.ac.id' || normalizedUser === 'admin') &&
          (rawPass === 'adminvokasi2026' || rawPass === 'admin123');

        if (isWandaAdmin) {
          return {
            id: 'admin-wanda',
            name: 'Wanda Codex (Admin)',
            email: 'wanda@admin.vokasi.usu.ac.id',
            role: 'SUPERADMIN',
            fakultas: 'Fakultas Vokasi Universitas Sumatera Utara',
          };
        }

        if (isLegacyAdmin) {
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
  secret: process.env.NEXTAUTH_SECRET || 'vokasi-usu-pkk-secret-key-2026-super-secure-token',
};

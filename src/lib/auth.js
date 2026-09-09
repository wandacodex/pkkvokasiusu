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
        const isValidUsername =
          username === 'admin@vokasi.usu.ac.id' ||
          username === 'admin' ||
          username === 'pkkvokasi';

        const isValidPassword =
          password === 'adminvokasi2026' ||
          password === 'admin123' ||
          password === 'vokasiusu';

        if (isValidUsername && isValidPassword) {
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

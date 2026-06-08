import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        idKaryawan: { label: "ID Karyawan", type: "text" },
        password:   { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.idKaryawan || !credentials?.password) return null;

        await connectDB();

        const user = await User.findOne({
          idKaryawan: credentials.idKaryawan.trim(),
        });

        if (!user) return null;
        if (!user.approved) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id:          user._id.toString(),
          idKaryawan:  user.idKaryawan,
          name:        user.nama,
          jabatan:     user.jabatan,
          departemen:  user.departemen,
          role:        user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id          = user.id;
        token.idKaryawan  = user.idKaryawan;
        token.jabatan     = user.jabatan;
        token.departemen  = user.departemen;
        token.role        = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id          = token.id;
        session.user.idKaryawan  = token.idKaryawan;
        session.user.jabatan     = token.jabatan;
        session.user.departemen  = token.departemen;
        session.user.role        = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" as const },
};
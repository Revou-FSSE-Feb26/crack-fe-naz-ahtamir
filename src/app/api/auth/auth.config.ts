import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        idKaryawan: { label: "ID Karyawan", type: "text" },
        password:   { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.idKaryawan || !credentials?.password) {
            return null;
          }

          await connectDB();

          const user = await User.findOne({
            idKaryawan: credentials.idKaryawan.trim(),
          });

          if (!user) {
            console.log("User not found:", credentials.idKaryawan);
            return null;
          }

          if (!user.approved) {
            console.log("User not approved:", credentials.idKaryawan);
            throw new Error("Account not approved yet");
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.log("Invalid password for:", credentials.idKaryawan);
            return null;
          }

          return {
            id:          user._id.toString(),
            idKaryawan:  user.idKaryawan,
            name:        user.nama,
            jabatan:     user.jabatan,
            departemen:  user.departemen,
            role:        user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
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
        token.name        = user.name;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id          = token.id;
        session.user.idKaryawan  = token.idKaryawan;
        session.user.jabatan     = token.jabatan;
        session.user.departemen  = token.departemen;
        session.user.role        = token.role;
        session.user.name        = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";

import authConfig from "@/auth.config";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "BRAND" | "CREATOR";
}) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.creator.create({
  data: {
    userId: user.id,
    tier: "NANO",
    niches: [],
    profileComplete: false,
  },
});

  if (data.role === "CREATOR") {
    await prisma.creator.create({
      data: {
        userId: user.id,
        displayName: data.name,
        tier: "NANO",
        niches: [],
        profileComplete: false,
      },
    });
  }

  if (data.role === "BRAND") {
    await prisma.brand.create({
      data: {
        userId: user.id,
        companyName: data.name,
        industry: "General",
        companySize: "SMALL",
      },
    });
  }

  if (data.role === "ADMIN") {
    await prisma.admin.create({
      data: {
        userId: user.id,
        permissions: ["all"],
      },
    });
  }

  return user;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret:
        process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user?.password) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }

      if (token.email && !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});

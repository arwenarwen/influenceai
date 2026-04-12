import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!passwordMatch) return null;
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      if (trigger === 'update' && session?.role) {
        token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    async signIn({ user, account }) {
      // For OAuth sign-ins, create role-based profile if not exists
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        if (!existingUser) {
          // Will be redirected to role selection
          return '/sign-up?step=role';
        }
      }
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      // Triggered when new user is created via OAuth
      await prisma.notification.create({
        data: {
          userId: user.id!,
          title: 'Welcome to InfluenceHub!',
          body: 'Your account has been created. Complete your profile to get started.',
          type: 'system',
          link: '/onboarding',
        },
      });
    },
  },
});

// ─── Helper: Register new user ────────────────────────────────────────────────

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
  });

  // Create role-based profile
  if (data.role === 'CREATOR') {
    await prisma.creator.create({ data: { userId: user.id } });
  } else if (data.role === 'BRAND') {
    await prisma.brand.create({
      data: { userId: user.id, companyName: data.name, industry: 'Other' },
    });
  } else if (data.role === 'ADMIN') {
    await prisma.admin.create({ data: { userId: user.id, permissions: ['all'] } });
  }

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: 'Welcome to InfluenceHub!',
      body: 'Complete your profile to get started.',
      type: 'system',
      link: '/onboarding',
    },
  });

  return user;
}

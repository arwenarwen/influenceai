import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/', '/sign-in', '/sign-up', '/api/auth', '/api/register'];

const ROLE_ROUTES: Record<string, string[]> = {
  CREATOR: ['/creator'],
  BRAND: ['/brand'],
  ADMIN: ['/admin'],
};

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const path = nextUrl.pathname;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to sign-in
  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', nextUrl));
  }

  const role = session.user?.role;

  // Admin can access everything
  if (role === 'ADMIN') return NextResponse.next();

  // Role-based route protection
  for (const [requiredRole, routes] of Object.entries(ROLE_ROUTES)) {
    if (routes.some((r) => path.startsWith(r)) && role !== requiredRole) {
      const defaultDash = role === 'CREATOR' ? '/creator' : role === 'BRAND' ? '/brand' : '/admin';
      return NextResponse.redirect(new URL(defaultDash, nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};

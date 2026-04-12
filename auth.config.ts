import type { NextAuthConfig } from "next-auth";

const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const isAuthPage =
        pathname === "/sign-in" || pathname === "/sign-up";

      const isProtectedRoute =
        pathname.startsWith("/admin") ||
        pathname.startsWith("/brand") ||
        pathname.startsWith("/creator");

      if (isAuthPage) return true;
      if (isProtectedRoute && !isLoggedIn) return false;

      return true;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;

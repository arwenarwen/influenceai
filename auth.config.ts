import type { NextAuthConfig } from "next-auth";

const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const isAuthPage =
        pathname === "/sign-in" || pathname === "/sign-up";

      const isAdminRoute = pathname.startsWith("/admin");
      const isBrandRoute = pathname.startsWith("/brand");
      const isCreatorRoute = pathname.startsWith("/creator");

      if (isAuthPage) {
        return true;
      }

      if (!isLoggedIn && (isAdminRoute || isBrandRoute || isCreatorRoute)) {
        return false;
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

export default authConfig;

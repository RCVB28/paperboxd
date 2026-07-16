import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize() {
        // We'll implement this in the next step.
        return null;
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token }) {
      return token;
    },

    async session({ session }) {
      return session;
    },

    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;

      const protectedRoutes = [
        "/dashboard",
        "/admin",
        "/favorites",
        "/profile",
      ];

      const pathname = request.nextUrl.pathname;

      if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        return isLoggedIn;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

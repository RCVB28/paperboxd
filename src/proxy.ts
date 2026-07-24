import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "@/lib/auth.config";

// Edge-safe — authConfig has no Prisma adapter or bcrypt.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const role = req.auth?.user?.role;

  const isOnAdmin = nextUrl.pathname.startsWith("/admin");
  const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

  // Not logged in at all → send to login, remembering where they were headed.
  if ((isOnAdmin || isOnDashboard) && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in, but not an admin → send somewhere useful, not back to login.
  if (isOnAdmin && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/books", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Skip static files, images, and Next internals
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

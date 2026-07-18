import { auth } from "@/auth";

export default auth((req) => {
  // Your authorized() callback in auth.config.ts
  // will be evaluated automatically.

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

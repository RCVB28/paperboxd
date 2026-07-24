import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Shown in the Navbar's right slot when no user is signed in.
// Extracted from what was previously duplicated inline in
// app/books/page.tsx and app/search/page.tsx.

export function AuthActions() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/login">
        <Button variant="ghost" size="sm">
          Log in
        </Button>
      </Link>
      <Link href="/register">
        <Button variant="primary" size="sm">
          Sign up
        </Button>
      </Link>
    </div>
  );
}

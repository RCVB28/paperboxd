import Link from "next/link";
import { redirect } from "next/navigation";
import { Library, Tag, PenSquare, Import } from "lucide-react";

import { auth } from "@/lib/auth";
import {
  getAdminBooks,
  getAdminBooksStats,
} from "@/features/books/actions/admin-get-books";
import { AdminBookList } from "@/features/books/components/AdminBookList";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthActions } from "@/features/auth/components/AuthActions";
import { UserMenu } from "@/features/auth/components/UserMenu";

// Not marked with `revalidate` — this is an admin tool over live data
// (search, edits, deletes), not a cached content listing.
//
// admin/books/* sits outside the app/admin/(sidebar)/ route group, so
// AdminShell does NOT wrap this page. Navbar/Footer are this page's only
// chrome, wired to real session data below — matching the same pattern
// as app/books/page.tsx.

export default async function AdminManageBooksPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/books");
  }

  const user = session.user;
  const [books, stats] = await Promise.all([
    getAdminBooks(),
    getAdminBooksStats(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        user={{
          name: user.name ?? "Admin",
          avatarUrl: user.image,
          role: user.role,
        }}
        authActions={<AuthActions />}
        userMenu={<UserMenu name={user.name ?? "Admin"} />}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
        <div className="flex flex-col gap-8">
          {/* ── Header ── */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Manage Books
              </h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                View, update, and delete books imported into the PaperBoxd
                library.
              </p>
            </div>

            <Link href="/admin/books/import">
              <Button type="button" variant="primary">
                <Import className="mr-2 h-4 w-4" aria-hidden="true" />
                Import Books
              </Button>
            </Link>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="bg-zinc-50 dark:bg-zinc-900/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Total books
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {stats.totalBooks}
                  </p>
                </div>
                <Library
                  className="h-6 w-6 text-amber-700 dark:text-amber-500"
                  aria-hidden="true"
                />
              </div>
            </Card>

            <Card className="bg-zinc-50 dark:bg-zinc-900/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Total genres
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {stats.totalGenres}
                  </p>
                </div>
                <Tag
                  className="h-6 w-6 text-amber-700 dark:text-amber-500"
                  aria-hidden="true"
                />
              </div>
            </Card>

            <Card className="bg-zinc-50 dark:bg-zinc-900/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Total authors
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {stats.totalAuthors}
                  </p>
                </div>
                <PenSquare
                  className="h-6 w-6 text-amber-700 dark:text-amber-500"
                  aria-hidden="true"
                />
              </div>
            </Card>
          </div>

          {/* ── Search + list (client component) ── */}
          <AdminBookList initialBooks={books} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

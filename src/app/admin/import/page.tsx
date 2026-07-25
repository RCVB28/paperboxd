import { SearchBooks } from "@/features/books/components/AdminSearchBooks";
import { AuthActions } from "@/features/auth/components/AuthActions";
import { UserMenu } from "@/features/auth/components/UserMenu";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { auth } from "@/lib/auth";

// Not marked with `revalidate` — this is an interactive admin tool
// (live Open Library search + import), not a cached content listing.

export default async function AdminBooksPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        user={
          user
            ? {
                name: user.name ?? "Admin",
                avatarUrl: user.image,
                role: user.role,
              }
            : null
        }
        authActions={<AuthActions />}
        userMenu={user ? <UserMenu name={user.name ?? "Admin"} /> : null}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
        {/* ── Page Header ── */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-500">
            Admin
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Import Books
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Search Open Library and add new titles to the shared catalog.
          </p>
        </div>

        <SearchBooks mode="admin" />
      </main>

      <Footer />
    </div>
  );
}

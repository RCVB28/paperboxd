import { SearchBooks } from "@/features/books/components/AdminSearchBooks";
import { AuthActions } from "@/features/auth/components/AuthActions";
import { UserMenu } from "@/features/auth/components/UserMenu";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { auth } from "@/lib/auth";

// ─── Page ─────────────────────────────────────────────────────────────────────
// Not exported as `revalidate` — search results are live/interactive per
// query, so this page renders dynamically rather than on a fixed interval.

export default async function SearchPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        user={
          user
            ? {
                name: user.name ?? "Reader",
                avatarUrl: user.image,
                role: user.role,
              }
            : null
        }
        authActions={<AuthActions />}
        userMenu={user ? <UserMenu name={user.name ?? "Reader"} /> : null}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
        <SearchBooks mode={user?.role === "ADMIN" ? "admin" : "user"} />
      </main>

      <Footer />
    </div>
  );
}

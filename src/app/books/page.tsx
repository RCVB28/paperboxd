export const dynamic = "force-dynamic";

import { getBooks } from "@/features/books/actions/get-books";
import { getFavoritedBookIds } from "@/features/favorites/actions/get-favorited-book-ids";
import { SearchBooks } from "@/features/books/components/SearchBooks";
import { AuthActions } from "@/features/auth/components/AuthActions";
import { UserMenu } from "@/features/auth/components/UserMenu";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { auth } from "@/lib/auth";

export default async function BooksPage() {
  const [books, session] = await Promise.all([getBooks(), auth()]);

  const user = session?.user;

  const favoritedBookIds = await getFavoritedBookIds(
    books.map((book) => book.id),
  );

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

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Library
          </h1>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Browse your complete collection of books and comics.
          </p>
        </div>

        <SearchBooks initialBooks={books} favoritedBookIds={favoritedBookIds} />
      </main>

      <Footer />
    </div>
  );
}

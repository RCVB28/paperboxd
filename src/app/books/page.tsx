export const revalidate = 60;

import Link from "next/link";
import { Library } from "lucide-react";

import { getBooks } from "@/features/books/actions/get-books";
import { getFavoritedBookIds } from "@/features/favorites/actions/get-favorited-book-ids";
import { getAverageRating } from "@/features/reviews/utils/get-average-rating";
import { SearchBooks } from "@/features/books/components/SearchBooks";
import { BookCard } from "@/features/books/components/BookCard";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";
import { ReviewButton } from "@/features/reviews/components/ReviewButton";
import { AuthActions } from "@/features/auth/components/AuthActions";
import { UserMenu } from "@/features/auth/components/UserMenu";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { auth } from "@/lib/auth";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BooksPage() {
  const [books, session] = await Promise.all([getBooks(), auth()]);
  const user = session?.user;

  // Needs the book ids first, so this runs after getBooks() rather than
  // inside the same Promise.all above — cheap second query, only ever
  // scoped to the books actually being rendered.
  const favoritedBookIds = await getFavoritedBookIds(books.map((b) => b.id));

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
        {/* ── Page Header & Search ── */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Library
              </h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Browse your complete collection of books and comics.
              </p>
            </div>
          </div>

          {/* ── Search Bar Component ── */}
          <SearchBooks
            initialBooks={books}
            favoritedBookIds={favoritedBookIds}
          />
        </div>

        {/* ── Empty State ── */}
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-24 text-center dark:border-zinc-800">
            <Library
              className="mb-4 h-12 w-12 text-zinc-400 dark:text-zinc-600"
              aria-hidden="true"
            />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Your library is empty
            </h2>
            <p className="mt-1 mb-6 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
              You haven&apos;t added any books to your collection yet. Head over
              to the search page to start building your library.
            </p>
            <Link href="/search" tabIndex={-1}>
              <Button variant="primary">Find Books</Button>
            </Link>
          </div>
        ) : (
          /* ── Books Grid ── */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {books.map((book) => {
              const averageRating = getAverageRating(book.reviews) ?? 0;

              return (
                <BookCard
                  key={book.id}
                  href={`/books/${book.id}`}
                  title={book.title}
                  author={book.author.name}
                  coverUrl={book.coverUrl ?? undefined}
                  publishedYear={book.publishedYear}
                  type={book.type}
                  rating={averageRating}
                  action={
                    <div className="flex flex-wrap gap-2">
                      <FavoriteButton
                        bookId={book.id}
                        initialFavorited={favoritedBookIds.has(book.id)}
                      />

                      <ReviewButton bookId={book.id} />
                    </div>
                  }
                />
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

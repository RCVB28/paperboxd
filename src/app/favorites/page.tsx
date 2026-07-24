import Link from "next/link";
import { Heart } from "lucide-react";

import { getFavorites } from "@/features/favorites/actions/get-favorites";
import { getAverageRating } from "@/features/reviews/utils/get-average-rating";
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

export default async function FavoritesPage() {
  // Fetch favorites and session in parallel for better performance
  const [favorites, session] = await Promise.all([getFavorites(), auth()]);
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
        {/* ── Page Header ── */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              My Favorites
            </h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Books and comics you've marked as favorites.
            </p>
          </div>
        </div>

        {/* ── Empty State ── */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-24 text-center dark:border-zinc-800">
            <Heart
              className="mb-4 h-12 w-12 text-zinc-400 dark:text-zinc-600"
              aria-hidden="true"
            />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              No favorites yet
            </h2>
            <p className="mt-1 mb-6 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
              You haven't favorited any books yet. Head over to your library to
              start saving the ones you love.
            </p>
            <Link href="/books" tabIndex={-1}>
              <Button variant="primary">View Library</Button>
            </Link>
          </div>
        ) : (
          /* ── Books Grid ── */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {favorites.map(({ book }) => {
              const averageRating = getAverageRating(book.reviews);

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
                      {/* Starts as favorited because this page only loads favorites */}
                      <FavoriteButton
                        bookId={book.id}
                        initialFavorited={true}
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

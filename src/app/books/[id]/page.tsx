import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Book as BookIcon, Calendar, Tag, ArrowRight } from "lucide-react";

import { getBookById } from "@/features/books/actions/get-books";
import { getFavoritedBookIds } from "@/features/favorites/actions/get-favorited-book-ids";
import { getAverageRating } from "@/features/reviews/utils/get-average-rating";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";
import { ReviewButton } from "@/features/reviews/components/ReviewButton";
import { ReviewList } from "@/features/reviews/components/ReviewList";
import { StarRating } from "@/features/reviews/components/StarRating";
import { AuthActions } from "@/features/auth/components/AuthActions";
import { UserMenu } from "@/features/auth/components/UserMenu";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { auth } from "@/lib/auth";

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [book, session, favoritedBookIds] = await Promise.all([
    getBookById(id),
    auth(),
    getFavoritedBookIds([id]),
  ]);

  if (!book) {
    notFound();
  }

  const user = session?.user;
  const isFavorited = favoritedBookIds.has(book.id);

  const averageRating = getAverageRating(book.reviews) ?? 0;

  const recentReviews = book.reviews.slice(0, 3);
  const totalReviewsCount = book.reviews.length;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        user={
          user
            ? {
                name: user.name ?? "Reader",
                avatarUrl: user.image ?? null,
                role: user.role,
              }
            : null
        }
        authActions={<AuthActions />}
        userMenu={user ? <UserMenu name={user.name ?? "Reader"} /> : null}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* ── Book Overview ── */}
        <div className="grid gap-8 md:grid-cols-12 lg:gap-12">
          {/* Cover */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              {book.coverUrl ? (
                <Image
                  src={book.coverUrl}
                  alt={`Cover of ${book.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-4 text-center text-zinc-400 dark:text-zinc-600">
                  <BookIcon className="mb-2 h-16 w-16" aria-hidden="true" />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    No Cover
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-col justify-between md:col-span-8 lg:col-span-9">
            <div className="space-y-4">
              {/* Genre */}
              {book.genre?.name && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-400">
                  <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                  {book.genre.name}
                </div>
              )}

              {/* Title and Author */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
                  {book.title}
                </h1>

                <p className="mt-2 text-lg font-medium text-zinc-600 dark:text-zinc-400">
                  By{" "}
                  <span className="text-zinc-900 dark:text-zinc-200">
                    {book.author.name}
                  </span>
                </p>
              </div>

              {/* Rating and Published Year */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <StarRating value={averageRating} readonly size="sm" />

                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {averageRating > 0 ? averageRating.toFixed(1) : "Unrated"}
                  </span>

                  <span>
                    ({totalReviewsCount}{" "}
                    {totalReviewsCount === 1 ? "review" : "reviews"})
                  </span>
                </div>

                {book.publishedYear && (
                  <>
                    <span>•</span>

                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      <span>Published {book.publishedYear}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-wrap gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
              <FavoriteButton bookId={book.id} initialFavorited={isFavorited} />

              <ReviewButton bookId={book.id} />
            </div>
          </div>
        </div>

        {/* ── Description ── */}
        <section className="mt-16 border-t border-zinc-200 pt-12 dark:border-zinc-800">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            About This Book
          </h2>

          {book.description ? (
            <p className="mt-4 max-w-4xl whitespace-pre-line text-base leading-8 text-zinc-600 dark:text-zinc-400">
              {book.description}
            </p>
          ) : (
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              No description is available for this book.
            </p>
          )}
        </section>

        {/* ── Reviews Preview ── */}
        <section className="mt-16 border-t border-zinc-200 pt-12 dark:border-zinc-800">
          <ReviewList reviews={recentReviews} />

          {totalReviewsCount > 0 && (
            <div className="mt-8 flex items-center justify-start">
              <Link href={`/reviews/${book.id}`}>
                <Button
                  variant="secondary"
                  className="group flex items-center gap-2"
                >
                  <span>View All Reviews ({totalReviewsCount})</span>

                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Button>
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

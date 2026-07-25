import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  Heart,
  MessageSquare,
  BookOpen,
  ArrowRight,
} from "lucide-react";

import { getUserProfile } from "@/features/profile/actions/get-profile";
import { getAverageRating } from "@/features/reviews/utils/get-average-rating";
import { StarRating } from "@/features/reviews/components/StarRating";
import { BookCard } from "@/features/books/components/BookCard";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";
import { ReviewButton } from "@/features/reviews/components/ReviewButton";
import { AuthActions } from "@/features/auth/components/AuthActions";
import { UserMenu } from "@/features/auth/components/UserMenu";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  // 1. Authenticate user
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // 2. Fetch authenticated profile data
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/login");
  }

  const user = session.user;
  const reviewCount = profile._count.reviews;
  const favoriteCount = profile._count.favorites;

  const formattedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        user={{
          name: user.name ?? "Reader",
          avatarUrl: user.image ?? null,
          role: user.role,
        }}
        authActions={<AuthActions />}
        userMenu={<UserMenu name={user.name ?? "Reader"} />}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* ── User Profile Header Card ── */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              {/* Avatar */}
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
                <UserIcon className="h-10 w-10 text-zinc-400 dark:text-zinc-500" />
              </div>
              {/* Identity & Badges */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
                    {profile.name ?? "Reader"}
                  </h1>

                  {profile.role && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-amber-800 dark:bg-amber-950/80 dark:text-amber-400">
                      <Shield className="h-3 w-3" aria-hidden="true" />
                      {profile.role.toLowerCase()}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-zinc-500 dark:text-zinc-400">
                  {profile.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      <span>{profile.email}</span>
                    </div>
                  )}

                  {formattedDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      <span>Member since {formattedDate}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Summary Badges */}
            <div className="flex w-full items-center gap-4 border-t border-zinc-100 pt-4 sm:w-auto sm:border-0 sm:pt-0 dark:border-zinc-800">
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-zinc-50 px-5 py-3 text-center sm:flex-initial dark:bg-zinc-800/50">
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {reviewCount}
                </span>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {reviewCount === 1 ? "Review" : "Reviews"}
                </span>
              </div>

              <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-zinc-50 px-5 py-3 text-center sm:flex-initial dark:bg-zinc-800/50">
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {favoriteCount}
                </span>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {favoriteCount === 1 ? "Favorite" : "Favorites"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Favorite Books Section ── */}
        <section className="mt-12 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
            <Heart className="h-5 w-5 text-amber-500" aria-hidden="true" />
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Favorite Books
            </h2>
          </div>

          {profile.favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-12 text-center dark:border-zinc-800">
              <BookOpen
                className="mb-3 h-10 w-10 text-zinc-400 dark:text-zinc-600"
                aria-hidden="true"
              />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                No favorite books yet
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Explore the library and click the heart icon on books you love.
              </p>
              <Link
                href="/library"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:underline dark:text-amber-500"
              >
                <span>Browse Library</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {profile.favorites.map((fav) => {
                const book = fav.book;
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
        </section>

        {/* ── Recent Reviews Section ── */}
        <section className="mt-16 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
            <MessageSquare
              className="h-5 w-5 text-amber-500"
              aria-hidden="true"
            />
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Your Reviews
            </h2>
          </div>

          {profile.reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-12 text-center dark:border-zinc-800">
              <MessageSquare
                className="mb-3 h-10 w-10 text-zinc-400 dark:text-zinc-600"
                aria-hidden="true"
              />
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                No reviews written yet
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Share your thoughts on books you have read.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {profile.reviews.map((review) => {
                const book = review.book;
                const reviewDate = review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : null;

                return (
                  <div
                    key={review.id}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900/60 sm:flex-row sm:items-center"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href={`/books/${book.id}`}
                          className="font-bold text-zinc-900 hover:underline dark:text-zinc-100"
                        >
                          {book.title}
                        </Link>
                        <span className="text-xs text-zinc-400">•</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          By {book.author.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <StarRating value={review.rating} readonly size="sm" />
                        {reviewDate && (
                          <span className="text-xs text-zinc-400 dark:text-zinc-500">
                            Reviewed on {reviewDate}
                          </span>
                        )}
                      </div>

                      {review.comment && (
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                          {review.comment}
                        </p>
                      )}
                    </div>

                    <Link
                      href={`/books/${book.id}`}
                      className="shrink-0 text-xs font-semibold text-amber-600 hover:underline dark:text-amber-500"
                    >
                      View Book →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

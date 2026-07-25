import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpen,
  Heart,
  MessageSquare,
  Users,
  Search,
  Shield,
  ArrowRight,
  Library,
  User,
  Sparkles,
  Layers,
  Star,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { getUserDashboard } from "@/features/dashboard/actions/get-user-dashboard";
import { getAdminDashboard } from "@/features/dashboard/actions/get-admin-dashboard";
import { getAverageRating } from "@/features/reviews/utils/get-average-rating";
import { StarRating } from "@/features/reviews/components/StarRating";
import { BookCard } from "@/features/books/components/BookCard";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";
import { ReviewButton } from "@/features/reviews/components/ReviewButton";
import { AuthActions } from "@/features/auth/components/AuthActions";
import { UserMenu } from "@/features/auth/components/UserMenu";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default async function DashboardPage() {
  // 1. Authenticate user
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const isAdmin = user.role === "ADMIN";

  // 2. Fetch role-specific dashboard data
  const userData = !isAdmin ? await getUserDashboard() : null;
  const adminData = isAdmin ? await getAdminDashboard() : null;

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
        {isAdmin && adminData ? (
          /* ════════════════════════════════════════════════════════════════
             ADMIN DASHBOARD
             ════════════════════════════════════════════════════════════════ */
          <div className="space-y-10">
            {/* Header */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/80 dark:text-amber-400">
                      <Shield className="h-3 w-3" aria-hidden="true" />
                      Administrator
                    </span>
                  </div>
                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
                    Admin Overview
                  </h1>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Monitor catalog metrics, database counts, and manage
                    imported books.
                  </p>
                </div>

                {/* Quick Actions for Admin */}
                <div className="flex flex-wrap gap-2.5">
                  <Link
                    href="/admin/import"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-zinc-950"
                  >
                    <Search className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Import Books</span>
                  </Link>
                  <Link
                    href="/admin/books"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                  >
                    <Library className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Manage Books</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Total Books
                  </span>
                  <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                </div>
                <p className="mt-3 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {adminData.stats.totalBooks}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Registered Users
                  </span>
                  <Users className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                </div>
                <p className="mt-3 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {adminData.stats.totalUsers}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Total Reviews
                  </span>
                  <MessageSquare className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                </div>
                <p className="mt-3 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {adminData.stats.totalReviews}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Total Favorites
                  </span>
                  <Heart className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                </div>
                <p className="mt-3 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                  {adminData.stats.totalFavorites}
                </p>
              </div>
            </div>

            {/* Recently Added Books */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Recently Added Books
                </h2>
                <Link
                  href="/books"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:underline dark:text-amber-500"
                >
                  <span>View All Catalog</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>

              {adminData.recentlyAddedBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-12 text-center dark:border-zinc-800">
                  <BookOpen
                    className="mb-3 h-10 w-10 text-zinc-400 dark:text-zinc-600"
                    aria-hidden="true"
                  />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    No books in database
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Import books from the Open Library API to populate the
                    catalog.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {adminData.recentlyAddedBooks.map((book) => {
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
                              initialFavorited={adminData.favoritedBookIds.has(
                                book.id,
                              )}
                            />
                            <ReviewButton bookId={book.id} />
                          </div>
                        }
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : userData ? (
          /* ════════════════════════════════════════════════════════════════
             REGULAR USER DASHBOARD
             ════════════════════════════════════════════════════════════════ */
          <div className="space-y-10">
            {/* Welcome Header */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
                    Welcome back, {user.name ?? "Reader"}!
                  </h1>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Discover new books, share your thoughts, and keep track of
                    your favorites.
                  </p>
                </div>

                {/* User Quick Actions */}
                <div className="flex flex-wrap gap-2.5">
                  <Link
                    href="/books"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-zinc-950"
                  >
                    <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Browse Books</span>
                  </Link>
                  <Link
                    href="/favorites"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                  >
                    <Heart
                      className="h-3.5 w-3.5 text-amber-500"
                      aria-hidden="true"
                    />
                    <span>My Favorites</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                  >
                    <User className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>My Profile</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                <div>
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Favorite Books
                  </span>
                  <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    {userData.favoriteCount}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400">
                  <Heart className="h-6 w-6" aria-hidden="true" />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                <div>
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    Reviews Written
                  </span>
                  <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    {userData.reviewCount}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400">
                  <MessageSquare className="h-6 w-6" aria-hidden="true" />
                </div>
              </div>
            </div>

            {/* Recent Favorites */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Heart
                    className="h-5 w-5 text-amber-500"
                    aria-hidden="true"
                  />
                  <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Recent Favorites
                  </h2>
                </div>
                {userData.recentFavorites.length > 0 && (
                  <Link
                    href="/favorites"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:underline dark:text-amber-500"
                  >
                    <span>View All</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
              </div>

              {userData.recentFavorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-12 text-center dark:border-zinc-800">
                  <Heart
                    className="mb-3 h-10 w-10 text-zinc-400 dark:text-zinc-600"
                    aria-hidden="true"
                  />
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    No favorite books yet
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Browse the library and save books you love to see them here.
                  </p>
                  <Link
                    href="/books"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:underline dark:text-amber-500"
                  >
                    <span>Explore Library</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {userData.recentFavorites.map((fav) => {
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
            </div>

            {/* Recent Reviews */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <MessageSquare
                    className="h-5 w-5 text-amber-500"
                    aria-hidden="true"
                  />
                  <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Recent Reviews
                  </h2>
                </div>
                {userData.recentReviews.length > 0 && (
                  <Link
                    href="/profile"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:underline dark:text-amber-500"
                  >
                    <span>View All Reviews</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                )}
              </div>

              {userData.recentReviews.length === 0 ? (
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
                  {userData.recentReviews.map((review) => {
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
                        className="flex flex-col justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 sm:flex-row sm:items-center"
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
                            <StarRating
                              value={review.rating}
                              readonly
                              size="sm"
                            />
                            {reviewDate && (
                              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                {reviewDate}
                              </span>
                            )}
                          </div>

                          {review.comment && (
                            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
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
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}

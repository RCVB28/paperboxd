import Link from "next/link";
import {
  BookOpen,
  User,
  Heart,
  MessageSquare,
  Search,
  ArrowRight,
  Star,
  Sparkles,
  Library,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthActions } from "@/features/auth/components/AuthActions";
import { UserMenu } from "@/features/auth/components/UserMenu";

export default async function LandingPage() {
  // 1. Retrieve session server-side
  const session = await auth();
  const user = session?.user;

  // 2. If logged in, fetch quick user statistics
  let userStats = null;
  if (user?.id) {
    userStats = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
    });
  }

  const reviewCount = userStats?._count?.reviews ?? 0;
  const favoriteCount = userStats?._count?.favorites ?? 0;

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
        {user ? (
          /* ════════════════════════════════════════════════════════════════
             LOGGED-IN USER VIEW
             ════════════════════════════════════════════════════════════════ */
          <div className="space-y-12">
            {/* Welcome Banner */}
            <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-b from-amber-50/60 via-white to-white p-8 shadow-sm dark:border-zinc-800 dark:from-amber-950/20 dark:via-zinc-900/60 dark:to-zinc-900/60 sm:p-12">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/80 dark:text-amber-400">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Welcome Back</span>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-zinc-100">
                  Welcome back, {user.name ?? "Reader"}!
                </h1>

                <p className="text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-300">
                  Continue exploring your library, discover new books, and share
                  your thoughts with the community.
                </p>

                {/* Primary Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/books"
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-zinc-950"
                  >
                    <BookOpen className="h-4 w-4" aria-hidden="true" />
                    <span>Browse Library</span>
                  </Link>

                  <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    <span>View Profile</span>
                  </Link>

                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                  >
                    <LayoutDashboardIcon
                      className="h-4 w-4 text-amber-500"
                      aria-hidden="true"
                    />
                    <span>Dashboard</span>
                  </Link>
                </div>
              </div>
            </section>

            {/* Quick Activity Summary */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Your Reading Activity
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Books Reviewed
                    </span>
                    <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                      {reviewCount}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400">
                    <MessageSquare className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      Favorite Books
                    </span>
                    <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                      {favoriteCount}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400">
                    <Heart className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-amber-50/50 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 sm:col-span-2 lg:col-span-1">
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      Ready for something new?
                    </h3>
                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                      Discover new releases, search by author or genre, and
                      build your collection.
                    </p>
                  </div>
                  <Link
                    href="/books"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:underline dark:text-amber-500"
                  >
                    <span>Search Catalog</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* ════════════════════════════════════════════════════════════════
             LOGGED-OUT GUEST VIEW
             ════════════════════════════════════════════════════════════════ */
          <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-b from-amber-50/70 via-white to-white px-6 py-16 text-center shadow-sm dark:border-zinc-800 dark:from-amber-950/20 dark:via-zinc-900/60 dark:to-zinc-900/60 sm:px-12 sm:py-24">
              <div className="mx-auto max-w-3xl space-y-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/80 dark:text-amber-400">
                  <GraduationCap className="h-4 w-4" aria-hidden="true" />
                  Academic Project • Hybrid Programming
                </span>

                <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-zinc-100">
                  Your personal space for books, reviews, and discovery.
                </h1>

                <p className="mx-auto max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-300">
                  Discover books, share your opinions, and build your personal
                  reading collection with PaperBoxd.
                </p>

                {/* Authentication Call-to-Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-zinc-950"
                  >
                    Sign Up
                  </Link>

                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                  >
                    Sign In
                  </Link>
                </div>

                {/* Secondary CTA */}
                <div className="pt-4">
                  <Link
                    href="/books"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:underline dark:text-amber-500"
                  >
                    <span>Explore the Library without signing in</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </section>

            {/* Feature Highlights */}
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400">
                  <Search className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Discover Books & Comics
                </h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Search across an expansive library catalog. Filter by title,
                  author, genres, and publication dates.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400">
                  <Star className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Rate & Review
                </h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Share your ratings and detailed reviews with other community
                  members to express your thoughts.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 sm:col-span-2 lg:col-span-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400">
                  <Heart className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Save Favorites
                </h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Keep track of books you love or plan to read by adding them to
                  your personal favorites list.
                </p>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Small helper icon component for LayoutDashboard
function LayoutDashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}

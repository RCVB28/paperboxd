import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Search,
  Star,
  Heart,
  Database,
  Layers,
  Code2,
  ArrowRight,
  ShieldAlert,
  Server,
  CloudDownload,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

import { AuthActions } from "@/features/auth/components/AuthActions";
import { UserMenu } from "@/features/auth/components/UserMenu";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { auth } from "@/lib/auth";

export default async function AboutPage() {
  const session = await auth();
  const user = session?.user;

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
        {/* ── 1. Hero Section ── */}
        <section className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-b from-amber-50/50 via-white to-white p-8 dark:border-zinc-800 dark:from-amber-950/10 dark:via-zinc-900/60 dark:to-zinc-900/60 sm:p-12 lg:p-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-950/80 dark:text-amber-400">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
              Hybrid Programming Academic Project
            </span>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100">
              About Paperboxd
            </h1>

            <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-300">
              Paperboxd is a digital library platform designed to help readers
              discover books, share their opinions, and keep track of the books
              they love.
            </p>

            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-sm font-medium text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
              Paperboxd is a student project developed for the{" "}
              <strong className="font-semibold underline decoration-amber-500 underline-offset-2">
                Hybrid Programming
              </strong>{" "}
              course.
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/books"
                className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-zinc-950"
              >
                <span>Explore Library</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── 2. What is Paperboxd? ── */}
        <section className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
              What is Paperboxd?
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              A streamlined platform built for book lovers and comic
              enthusiasts.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400">
                <Search className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Browse & Search
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Explore a catalog of books and comics, search by title or
                author, and view detailed metadata.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Book Details
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Access author details, publication years, genre tags, covers,
                and aggregated ratings.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400">
                <Star className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Ratings & Reviews
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Submit star ratings and written reviews to share feedback with
                other readers.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400">
                <Heart className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Personal Favorites
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Save titles to your personal collection for quick access and
                tracking from your profile.
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. Academic Project Section ── */}
        <section className="mt-16 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Academic Purpose
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Built for Learning & Demonstration
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              Paperboxd was developed as a student project for the Hybrid
              Programming course. The project demonstrates how modern web
              technologies can be combined to create a complete full-stack
              application.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Component-based UI development",
              "Client and Server Components",
              "Server-side data fetching",
              "Server Actions for mutations",
              "Authentication and authorization",
              "Database integration using Prisma",
              "API integration with Open Library",
              "Form validation & state management",
              "User reviews and ratings systems",
              "Relational database design",
              "Responsive web design",
            ].map((concept, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 rounded-xl border border-zinc-100 bg-zinc-50/80 p-3.5 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-300"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-500" />
                <span>{concept}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. How Paperboxd Works (Visual Flow) ── */}
        <section className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
              How Paperboxd Works
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Understanding the user journey and data architecture.
            </p>
          </div>

          {/* User Journey Workflow */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-5 text-center dark:border-zinc-800 dark:bg-zinc-900/60">
              <UserCheck className="h-8 w-8 text-amber-600 dark:text-amber-500" />
              <span className="mt-3 text-xs font-bold uppercase tracking-wide text-zinc-400">
                Step 1
              </span>
              <h3 className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                User
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Sign in or browse as guest
              </p>
            </div>

            <div className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-5 text-center dark:border-zinc-800 dark:bg-zinc-900/60">
              <Search className="h-8 w-8 text-amber-600 dark:text-amber-500" />
              <span className="mt-3 text-xs font-bold uppercase tracking-wide text-zinc-400">
                Step 2
              </span>
              <h3 className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Browse or Search
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Find books & comics
              </p>
            </div>

            <div className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-5 text-center dark:border-zinc-800 dark:bg-zinc-900/60">
              <BookOpen className="h-8 w-8 text-amber-600 dark:text-amber-500" />
              <span className="mt-3 text-xs font-bold uppercase tracking-wide text-zinc-400">
                Step 3
              </span>
              <h3 className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                View Details
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Read metadata & reviews
              </p>
            </div>

            <div className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-5 text-center dark:border-zinc-800 dark:bg-zinc-900/60">
              <Heart className="h-8 w-8 text-amber-600 dark:text-amber-500" />
              <span className="mt-3 text-xs font-bold uppercase tracking-wide text-zinc-400">
                Step 4
              </span>
              <h3 className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Favorite Books
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Bookmark to profile
              </p>
            </div>

            <div className="flex flex-col items-center rounded-xl border border-zinc-200 bg-white p-5 text-center dark:border-zinc-800 dark:bg-zinc-900/60 sm:col-span-2 lg:col-span-1">
              <Star className="h-8 w-8 text-amber-600 dark:text-amber-500" />
              <span className="mt-3 text-xs font-bold uppercase tracking-wide text-zinc-400">
                Step 5
              </span>
              <h3 className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Write Reviews
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Share ratings & comments
              </p>
            </div>
          </div>

          {/* Admin Open Library Import Note */}
          <div className="flex flex-col gap-4 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-6 dark:border-amber-900/40 dark:bg-amber-950/20 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400">
              <CloudDownload className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Admin Integration with Open Library API
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                Administrators can search and import external book data from the
                Open Library API. Imported books are persisted into
                Paperboxd&apos;s own relational database, making them available
                across the entire application catalog.
              </p>
            </div>
          </div>
        </section>

        {/* ── 5. Technology Stack ── */}
        <section className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
              Technology Stack
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Built with modern web development tools and frameworks.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
              <Server className="h-6 w-6 text-amber-600 dark:text-amber-500" />
              <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Next.js (App Router)
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                React framework powering client and server routing, Server
                Components, and Server Actions.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
              <Code2 className="h-6 w-6 text-amber-600 dark:text-amber-500" />
              <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                React & TypeScript
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                Type-safe component architecture for building reliable UI
                layouts and interactive client features.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
              <Layers className="h-6 w-6 text-amber-600 dark:text-amber-500" />
              <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Tailwind CSS
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                Utility-first styling system enabling modern, accessible, and
                dark-mode-ready visual components.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
              <Database className="h-6 w-6 text-amber-600 dark:text-amber-500" />
              <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Prisma ORM
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                Next-generation ORM for type-safe relational database querying,
                migrations, and schema modeling.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
              <UserCheck className="h-6 w-6 text-amber-600 dark:text-amber-500" />
              <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Auth.js / NextAuth
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                Authentication solution managing user sessions, security, and
                role-based authorization.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
              <CloudDownload className="h-6 w-6 text-amber-600 dark:text-amber-500" />
              <h3 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Open Library API
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                External catalog API used for fetching, searching, and importing
                rich book metadata into the local database.
              </p>
            </div>
          </div>
        </section>

        {/* ── 6. Disclaimer ── */}
        <section className="mt-16 rounded-2xl border border-amber-300/70 bg-amber-50 p-6 dark:border-amber-900/60 dark:bg-amber-950/20 sm:p-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-300">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-bold text-amber-950 dark:text-amber-200">
                Academic Project Disclaimer
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-amber-900/90 dark:text-amber-300/80">
                Paperboxd is a student project created for educational purposes
                as part of the Hybrid Programming course. It is not intended to
                function as a commercial service.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

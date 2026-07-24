import { notFound } from "next/navigation";

import { getBookById } from "@/features/books/actions/get-books";
import { ReviewList } from "@/features/reviews/components/ReviewList";
import { ReviewButton } from "@/features/reviews/components/ReviewButton";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { auth } from "@/lib/auth";

export default async function BookReviewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [book, session] = await Promise.all([getBookById(id), auth()]);

  if (!book) {
    notFound();
  }

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
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Book Header */}
        <section className="mb-10">
          <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
            Reviews for
          </p>

          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {book.title}
          </h1>

          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            by {book.author.name}
          </p>

          {session?.user && (
            <div className="mt-6">
              <ReviewButton bookId={book.id} />
            </div>
          )}
        </section>

        {/* Reviews */}
        <ReviewList reviews={book.reviews} />
      </main>

      <Footer />
    </div>
  );
}

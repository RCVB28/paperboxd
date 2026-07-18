export const revalidate = 60;

import { getBooks } from "@/features/books/actions/get-books";
import { BookCard } from "@/features/books/components/BookCard";
import { Library } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FavoriteButton } from "@/features/books/components/FavoriteButton";

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 sm:py-12">
      {/* ── Page Header ── */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Library
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Browse your complete collection of books and comics.
          </p>
        </div>
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
            You haven't added any books to your collection yet. Head over to the
            search page to start building your library.
          </p>
          <Link href="/search" tabIndex={-1}>
            <Button variant="primary">Find Books</Button>
          </Link>
        </div>
      ) : (
        /* ── Books Grid ── */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <BookCard
              key={book.id}
              title={book.title}
              author={book.author.name}
              coverUrl={book.coverUrl ?? undefined}
              publishedYear={book.publishedYear}
              type={book.type}
              action={<FavoriteButton bookId={book.id} />}
            />
          ))}
        </div>
      )}
    </main>
  );
}

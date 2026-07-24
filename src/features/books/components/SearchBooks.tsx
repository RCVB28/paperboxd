"use client";

import * as React from "react";
import { BookOpen, Search } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { BookCard } from "./BookCard";

import { searchBooks } from "../actions/get-books";
import type { BookWithRelations } from "../actions/get-books";

import { getAverageRating } from "@/features/reviews/utils/get-average-rating";
import { FavoriteButton } from "@/features/favorites/components/FavoriteButton";
import { ReviewButton } from "@/features/reviews/components/ReviewButton";

interface SearchBooksProps {
  initialBooks: BookWithRelations[];
  favoritedBookIds: Set<string>;
}

export function SearchBooks({
  initialBooks,
  favoritedBookIds,
}: SearchBooksProps) {
  const [query, setQuery] = React.useState("");

  // Always guarantee that books is an array.
  const [books, setBooks] = React.useState<BookWithRelations[]>(
    initialBooks ?? [],
  );

  const [isSearching, setIsSearching] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);

  async function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    // Reset to the complete library when the search is cleared.
    if (!trimmedQuery) {
      setBooks(initialBooks ?? []);
      setHasSearched(false);
      setError(null);
      return;
    }

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const searchResults = await searchBooks(trimmedQuery);

      // Always store an array, even if the action returns undefined.
      setBooks(searchResults ?? []);
    } catch (error) {
      console.error("Book search failed:", error);

      setError("Unable to search books. Please try again.");
      setBooks([]);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <section className="space-y-8">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex w-full max-w-2xl gap-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title, author, or genre..."
          disabled={isSearching}
          aria-label="Search books"
        />

        <Button
          type="submit"
          isLoading={isSearching}
          disabled={isSearching || !query.trim()}
        >
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>

      {/* Error */}
      {error && (
        <Alert variant="error" aria-live="assertive">
          {error}
        </Alert>
      )}

      {/* Empty Search Results */}
      {!isSearching && hasSearched && books.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-800">
          <BookOpen
            className="mb-4 h-10 w-10 text-zinc-400"
            aria-hidden="true"
          />

          <h2 className="font-semibold">No books found</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Try searching for a different title, author, or genre.
          </p>
        </div>
      )}

      {/* Search Results */}
      {books.length > 0 && (
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
    </section>
  );
}

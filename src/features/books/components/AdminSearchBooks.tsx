"use client";

import * as React from "react";
import { Search, BookX, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { BookCard } from "./BookCard";
import { ImportBookButton } from "./ImportButton";

import type { OpenLibraryBook } from "../types/open-library";
import { searchOpenLibraryBooks } from "../actions/admin-search-books";

interface SearchBooksProps {
  mode?: "admin" | "user" | "readonly";
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
// Matches BookCard's proportions (aspect-[2/3] cover + text lines) so the
// grid doesn't visibly jump in size once real results replace it.

function SkeletonCard() {
  return (
    <div
      className="flex animate-pulse gap-4 rounded-xl border border-zinc-200 p-4 sm:flex-row dark:border-zinc-800"
      aria-hidden="true"
    >
      <div className="aspect-[2/3] w-full shrink-0 rounded-lg bg-zinc-100 sm:w-28 dark:bg-zinc-800" />
      <div className="flex flex-1 flex-col gap-2 pt-1">
        <div className="h-4 w-3/4 rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-3 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-3 w-1/4 rounded bg-zinc-100 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

export function SearchBooks({ mode = "readonly" }: SearchBooksProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<OpenLibraryBook[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Track if a search has been executed to properly show the "Empty State"
  const [hasSearched, setHasSearched] = React.useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setError(null);
    setIsSearching(true);
    setHasSearched(true);

    try {
      const books = await searchOpenLibraryBooks(trimmedQuery);
      setResults(books || []);
    } catch {
      setError(
        "Unable to search books. Please check your connection and try again.",
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Header & Search Bar ── */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Search Books
        </h1>

        {/* Wrapped in a form so users can hit the "Enter" key to submit */}
        <form onSubmit={handleSearch} className="flex w-full max-w-2xl gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Open Library by title or author..."
            disabled={isSearching}
            className="flex-1"
            aria-label="Search books query"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={isSearching || !query.trim()}
          >
            {isSearching ? (
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Search className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Search
          </Button>
        </form>
      </div>

      {/* ── Error State ── */}
      {error && (
        <Alert variant="error" aria-live="assertive">
          {error}
        </Alert>
      )}

      {/* ── Loading Skeleton ── */}
      {isSearching && (
        <div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
          aria-live="polite"
          aria-busy="true"
        >
          <span className="sr-only">Searching for books…</span>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {!isSearching && hasSearched && results.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-800">
          <BookX
            className="mb-4 h-12 w-12 text-zinc-400 dark:text-zinc-600"
            aria-hidden="true"
          />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            No books found
          </h3>
          <p className="mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
            We couldn't find any results for "{query}". Try adjusting your
            search terms or checking for typos.
          </p>
        </div>
      )}

      {/* ── Results Grid ── */}
      {!isSearching && results.length > 0 && (
        <div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
          aria-live="polite"
        >
          {results.map((book) => {
            const coverUrl = book.coverId
              ? `https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`
              : undefined;

            return (
              <BookCard
                key={book.key}
                title={book.title}
                author={book.author}
                publishedYear={book.firstPublishYear}
                coverUrl={coverUrl}
                type="BOOK"
                action={
                  mode === "admin" ? (
                    <ImportBookButton
                      book={{
                        openLibraryKey: book.key,
                        title: book.title,
                        author: book.author,
                        coverUrl,
                        publishedYear: book.firstPublishYear ?? undefined,
                        type: "BOOK",
                      }}
                    />
                  ) : null
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

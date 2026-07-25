"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, BookX } from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AdminBookCard } from "./AdminBookCard";

interface AdminBookListProps {
  initialBooks: Array<{
    id: string;
    title: string;
    description?: string | null;
    coverUrl?: string | null;
    publishedYear?: number | null;
    bookType?: string | null;
    createdAt: Date | string;
    author: { name: string };
    genre: { name: string };
  }>;
}

export function AdminBookList({ initialBooks }: AdminBookListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = React.useState(
    searchParams.get("q") || "",
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    } else {
      params.delete("q");
    }
    router.push(`/admin/books?${params.toString()}`);
  };

  const handleClear = () => {
    setSearchQuery("");
    router.push("/admin/books");
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search by title, author, or genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" variant="primary">
          Search
        </Button>
      </form>

      {/* Book List / Empty State */}
      {initialBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-800">
          <BookX className="mb-3 h-10 w-10 text-zinc-400" />
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            No books found
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {searchParams.get("q")
              ? "Try searching with a different keyword."
              : "No books imported into the library yet."}
          </p>
          {searchParams.get("q") && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClear}
              className="mt-4"
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {initialBooks.map((book) => (
            <AdminBookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

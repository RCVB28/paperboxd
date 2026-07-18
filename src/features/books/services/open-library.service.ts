import type { OpenLibraryBook } from "../types/open-library";

interface OpenLibrarySearchResponse {
  docs: Array<{
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    cover_i?: number;
  }>;
}

export async function searchBooks(query: string) {
  if (!query.trim()) {
    return [];
  }

  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch books.");
  }

  const data: OpenLibrarySearchResponse = await response.json();

  return data.docs.map((book) => ({
    key: book.key,
    title: book.title,
    author: book.author_name?.[0] ?? "Unknown Author",
    firstPublishYear: book.first_publish_year ?? null,
    coverId: book.cover_i ?? null,
  }));
}

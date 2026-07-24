"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import type { ImportBookInput } from "../types/import-books";

interface OpenLibraryWork {
  description?: string | { value: string };
  subjects?: string[];
}

const COMMON_GENRES = [
  "Fantasy",
  "Science Fiction",
  "Romance",
  "Mystery",
  "Thriller",
  "Horror",
  "Historical Fiction",
  "Adventure",
  "Biography",
  "History",
  "Philosophy",
  "Poetry",
  "Drama",
  "Comedy",
  "Crime",
  "Young Adult",
  "Children",
];

function getGenreFromSubjects(subjects?: string[]): string {
  if (!subjects || subjects.length === 0) {
    return "Unknown";
  }

  const normalizedSubjects = subjects.map((subject) => subject.toLowerCase());

  const matchedGenre = COMMON_GENRES.find((genre) =>
    normalizedSubjects.some((subject) => subject.includes(genre.toLowerCase())),
  );

  return matchedGenre ?? "Unknown";
}

export async function importBook(book: ImportBookInput) {
  // 1. Get current session
  const session = await auth();

  // 2. Make sure the user is logged in
  if (!session?.user) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  // 3. Make sure the user is an admin
  if (session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Only administrators can import books.",
    };
  }

  // 4. Check if the book already exists
  const existingBook = await prisma.book.findUnique({
    where: {
      openLibraryKey: book.openLibraryKey,
    },
  });

  if (existingBook) {
    return {
      success: false,
      message: "Book already exists.",
    };
  }

  // 5. Fetch full book details from Open Library
  let description: string | null = null;
  let genreName = "Unknown";

  try {
    const workId = book.openLibraryKey.split("/").pop();

    if (workId) {
      const response = await fetch(
        `https://openlibrary.org/works/${workId}.json`,
        {
          next: {
            revalidate: 3600,
          },
        },
      );

      if (response.ok) {
        const work: OpenLibraryWork = await response.json();

        // Extract description
        if (typeof work.description === "string") {
          description = work.description;
        } else if (work.description?.value) {
          description = work.description.value;
        }

        // Extract genre
        genreName = getGenreFromSubjects(work.subjects);
      }
    }
  } catch {
    // Description and genre are optional.
    // The book can still be imported if Open Library details fail.
  }

  // 6. Create or find author
  const author = await prisma.author.upsert({
    where: {
      name: book.author,
    },
    update: {},
    create: {
      name: book.author,
    },
  });

  // 7. Create or find genre
  const genre = await prisma.genre.upsert({
    where: {
      name: genreName,
    },
    update: {},
    create: {
      name: genreName,
    },
  });

  // 8. Create book
  await prisma.book.create({
    data: {
      openLibraryKey: book.openLibraryKey,
      title: book.title,
      description,
      coverUrl: book.coverUrl,
      publishedYear: book.publishedYear,
      type: book.type,
      authorId: author.id,
      genreId: genre.id,
      createdBy: session.user.id,
    },
  });

  // 9. Refresh book-related pages
  revalidatePath("/books");
  revalidatePath("/admin/books");

  return {
    success: true,
    message: "Book imported successfully.",
  };
}

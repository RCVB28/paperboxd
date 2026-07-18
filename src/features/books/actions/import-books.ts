"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ImportBookInput } from "../types/import-books";

export async function importBook(book: ImportBookInput) {
  // 1. Get the current session
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

  const author = await prisma.author.upsert({
    where: {
      name: book.author,
    },
    update: {},
    create: {
      name: book.author,
    },
  });

  const genre = await prisma.genre.upsert({
    where: {
      name: "Unknown",
    },
    update: {},
    create: {
      name: "Unknown",
    },
  });

  const createdBook = await prisma.book.create({
    data: {
      openLibraryKey: book.openLibraryKey,

      title: book.title,

      coverUrl: book.coverUrl,

      publishedYear: book.publishedYear,

      type: book.type,

      authorId: author.id,

      genreId: genre.id,

      createdBy: session.user.id,
    },
  });

  revalidatePath("/books");

  return {
    success: true,
    message: "Book imported successfully.",
  };
}

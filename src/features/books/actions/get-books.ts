"use server";

import { prisma } from "@/lib/prisma";

export async function getBooks() {
  const books = await prisma.book.findMany({
    include: {
      author: true,
      genre: true,
      reviews: true,
      favorites: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return books;
}

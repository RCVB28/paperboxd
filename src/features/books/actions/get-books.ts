"use server";

import { prisma } from "@/lib/prisma";

export async function getBooks() {
  return prisma.book.findMany({
    include: {
      author: true,
      genre: true,
      reviews: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getBookById(id?: string) {
  if (!id) {
    return null;
  }

  return prisma.book.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
      genre: true,
      reviews: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export type BookWithRelations = Awaited<ReturnType<typeof getBooks>>[number];

export async function searchBooks(query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return getBooks();
  }

  const books = await prisma.book.findMany({
    where: {
      OR: [
        {
          title: {
            contains: trimmedQuery,
            mode: "insensitive",
          },
        },
        {
          author: {
            name: {
              contains: trimmedQuery,
              mode: "insensitive",
            },
          },
        },
        {
          genre: {
            name: {
              contains: trimmedQuery,
              mode: "insensitive",
            },
          },
        },
      ],
    },
    include: {
      author: true,
      genre: true,
      reviews: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return books;
}

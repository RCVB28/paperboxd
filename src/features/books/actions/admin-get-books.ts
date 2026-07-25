"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getAdminBooksStats() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized access.");
  }

  const [totalBooks, totalGenres, totalAuthors] = await Promise.all([
    prisma.book.count(),
    prisma.genre.count(),
    prisma.author.count(),
  ]);

  return { totalBooks, totalGenres, totalAuthors };
}

export async function getAdminBooks(query?: string) {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized access.");
  }

  const trimmedQuery = query?.trim();

  const books = await prisma.book.findMany({
    where: trimmedQuery
      ? {
          OR: [
            { title: { contains: trimmedQuery, mode: "insensitive" } },
            {
              author: { name: { contains: trimmedQuery, mode: "insensitive" } },
            },
            {
              genre: { name: { contains: trimmedQuery, mode: "insensitive" } },
            },
          ],
        }
      : undefined,
    include: {
      author: true,
      genre: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return books;
}

export async function getAdminBookById(id?: string) {
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

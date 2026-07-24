"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getFavorites() {
  const session = await auth();

  if (!session?.user) {
    return [];
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      book: {
        include: {
          author: true,
          genre: true,
          reviews: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return favorites;
}

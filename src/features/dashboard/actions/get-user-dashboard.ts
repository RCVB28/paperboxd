"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getUserDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  const [favoriteCount, reviewCount, recentFavorites, recentReviews] =
    await Promise.all([
      prisma.favorite.count({
        where: { userId },
      }),
      prisma.review.count({
        where: { userId },
      }),
      prisma.favorite.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          book: {
            include: {
              author: true,
              genre: true,
              reviews: true,
            },
          },
        },
      }),
      prisma.review.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          book: {
            include: {
              author: true,
            },
          },
        },
      }),
    ]);

  const favoritedBookIds = new Set(recentFavorites.map((f) => f.bookId));

  return {
    favoriteCount,
    reviewCount,
    recentFavorites,
    recentReviews,
    favoritedBookIds,
  };
}

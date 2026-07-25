"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getAdminDashboard() {
  const session = await auth();

  // Guard: Ensure user is authenticated and possesses the ADMIN role
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  const [
    totalBooks,
    totalUsers,
    totalReviews,
    totalFavorites,
    recentlyAddedBooks,
  ] = await Promise.all([
    prisma.book.count(),
    prisma.user.count(),
    prisma.review.count(),
    prisma.favorite.count(),
    prisma.book.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        author: true,
        genre: true,
        reviews: true,
      },
    }),
  ]);

  const adminFavorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    select: { bookId: true },
  });
  const favoritedBookIds = new Set(adminFavorites.map((f) => f.bookId));

  return {
    stats: {
      totalBooks,
      totalUsers,
      totalReviews,
      totalFavorites,
    },
    recentlyAddedBooks,
    favoritedBookIds,
  };
}

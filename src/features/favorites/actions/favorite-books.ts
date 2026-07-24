"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function toggleFavorite(bookId: string) {
  // Get current user
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      favorited: false,
      message: "Please log in first.",
    };
  }

  // Check if the favorite already exists
  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      bookId_userId: {
        bookId,
        userId: session.user.id,
      },
    },
  });

  // Remove favorite
  if (existingFavorite) {
    await prisma.favorite.delete({
      where: {
        id: existingFavorite.id,
      },
    });

    revalidatePath("/favorites");

    return {
      success: true,
      favorited: false,
      message: "Removed from favorites.",
    };
  }

  // Add favorite
  await prisma.favorite.create({
    data: {
      bookId,
      userId: session.user.id,
    },
  });

  revalidatePath("/favorites");

  return {
    success: true,
    favorited: true,
    message: "Added to favorites.",
  };
}

"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getUserProfile() {
  const session = await auth();

  // Guard: Return null if no authenticated user session exists
  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  // Fetch the current user with their reviews and favorites
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          reviews: true,
          favorites: true,
        },
      },
      reviews: {
        orderBy: {
          createdAt: "desc",
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
      },
      favorites: {
        orderBy: {
          createdAt: "desc",
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
      },
    },
  });

  return user;
}

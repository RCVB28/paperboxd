"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface UpdateReviewInput {
  reviewId: string;
  rating: number;
  comment: string | null;
}

export async function updateReview(data: UpdateReviewInput) {
  // 1. Check authentication
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "You must be logged in to update a review.",
    };
  }

  // 2. Find the review
  const review = await prisma.review.findUnique({
    where: {
      id: data.reviewId,
    },
  });

  if (!review) {
    return {
      error: "Review not found.",
    };
  }

  // 3. Make sure the review belongs to the current user
  if (review.userId !== session.user.id) {
    return {
      error: "You can only update your own reviews.",
    };
  }

  // 4. Update the review
  await prisma.review.update({
    where: {
      id: data.reviewId,
    },
    data: {
      rating: data.rating,
      comment: data.comment?.trim() || null,
    },
  });

  return {
    success: true,
  };
}

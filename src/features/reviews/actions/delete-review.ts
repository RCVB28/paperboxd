"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type DeleteReviewInput = string | { reviewId: string };

/**
 * Deletes a single review.
 * Can be called with either a review ID string or an object containing `{ reviewId }`.
 */
export async function deleteReview(input: DeleteReviewInput) {
  const reviewId = typeof input === "string" ? input : input?.reviewId;

  if (!reviewId) {
    return {
      success: false,
      error: "Invalid review ID provided.",
      message: "Invalid review ID provided.",
    };
  }

  // 1. Check authentication
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "You must be logged in to delete a review.",
      message: "You must be logged in to delete a review.",
    };
  }

  // 2. Find the review
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    return {
      success: false,
      error: "Review not found.",
      message: "Review not found.",
    };
  }

  // 3. Allow the owner or an admin to delete it
  const isOwner = review.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return {
      success: false,
      error: "You are not authorized to delete this review.",
      message: "You are not authorized to delete this review.",
    };
  }

  // 4. Delete the review
  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

  // 5. Refresh relevant pages
  revalidatePath("/books");
  revalidatePath(`/books/${review.bookId}`);

  return {
    success: true,
    message: "Review deleted successfully.",
  };
}

/**
 * Deletes ALL reviews for a specific book.
 * Restricted strictly to ADMIN users.
 */
export async function deleteAllReviews(bookId: string) {
  if (!bookId) {
    return {
      success: false,
      error: "Book ID is required.",
      message: "Book ID is required.",
    };
  }

  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      error: "You must be logged in to perform this action.",
      message: "You must be logged in to perform this action.",
    };
  }

  const isAdmin = session.user.role === "ADMIN";

  if (!isAdmin) {
    return {
      success: false,
      error: "Only administrators are authorized to delete all reviews.",
      message: "Only administrators are authorized to delete all reviews.",
    };
  }

  await prisma.review.deleteMany({
    where: {
      bookId,
    },
  });

  revalidatePath("/books");
  revalidatePath(`/books/${bookId}`);

  return {
    success: true,
    message: "All reviews deleted successfully.",
  };
}

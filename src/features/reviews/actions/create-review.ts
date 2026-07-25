"use server";

import { revalidatePath } from "next/cache"; // 1. Import this
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { CreateReviewInput } from "../schemas/review.schema";

export async function createReview(data: CreateReviewInput) {
  // 1. Check authentication
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "You must be logged in to submit a review.",
    };
  }

  // 2. Validate the book
  const book = await prisma.book.findUnique({
    where: {
      id: data.bookId,
    },
  });

  if (!book) {
    return {
      error: "Book not found.",
    };
  }

  // 3. Check if the user has already reviewed this book
  const existingReview = await prisma.review.findUnique({
    where: {
      bookId_userId: {
        bookId: data.bookId,
        userId: session.user.id,
      },
    },
  });

  if (existingReview) {
    return {
      error: "You have already reviewed this book.",
    };
  }

  // 4. Create the review
  await prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment,
      bookId: data.bookId,
      userId: session.user.id,
    },
  });

  // 5. IMPORTANT: Tell Next.js to refresh the data on these pages
  revalidatePath("/books");
  revalidatePath(`/books/${data.bookId}`); // If you have an individual book page

  return {
    success: true,
  };
}

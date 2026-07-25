"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function deleteBook(bookId: string) {
  if (!bookId) {
    return {
      success: false,
      message: "Book ID is required.",
    };
  }

  // 1. Authentication & Authorization Check
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in to perform this action.",
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized. Admin permissions required.",
    };
  }

  try {
    // 2. Confirm book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return {
        success: false,
        message: "Book not found.",
      };
    }

    // 3. Delete Book (Related reviews and favorites will cascade based on Prisma relations)
    await prisma.book.delete({
      where: { id: bookId },
    });

    // 4. Revalidate pages
    revalidatePath("/admin/books");
    revalidatePath("/books");

    return {
      success: true,
      message: "Book deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting book:", error);
    return {
      success: false,
      message: "Failed to delete book. Please try again.",
    };
  }
}

"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateBookSchema, type UpdateBookInput } from "../schemas/book.schema";

export async function updateBook(data: UpdateBookInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in to update a book.",
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized. Admin permissions required.",
    };
  }

  const validated = UpdateBookSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      message: validated.error.issues.at(0)?.message ?? "Invalid input data.",
    };
  }

  const {
    id,
    title,
    description,
    coverUrl,
    publishedYear,
    authorName,
    genreName,
    bookType,
  } = validated.data;

  try {
    const existingBook = await prisma.book.findUnique({
      where: { id },
    });

    if (!existingBook) {
      return {
        success: false,
        message: "Book not found.",
      };
    }

    const author = await prisma.author.upsert({
      where: {
        name: authorName.trim(),
      },
      update: {},
      create: {
        name: authorName.trim(),
      },
    });

    const genre = await prisma.genre.upsert({
      where: {
        name: genreName.trim(),
      },
      update: {},
      create: {
        name: genreName.trim(),
      },
    });

    await prisma.book.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        coverUrl: coverUrl?.trim() || null,
        publishedYear: publishedYear ?? null,

        // Prisma field is called `type`
        type: bookType,

        authorId: author.id,
        genreId: genre.id,
      },
    });

    revalidatePath("/admin/books");
    revalidatePath("/books");
    revalidatePath(`/books/${id}`);

    return {
      success: true,
      message: "Book updated successfully.",
    };
  } catch (error) {
    console.error("Error updating book:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update book. Please try again.",
    };
  }
}

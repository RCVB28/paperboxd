import { z } from "zod";

export const ReviewSchema = z.object({
  bookId: z.string().min(1, "Book ID is required."),

  rating: z
    .number()
    .min(1, "Please select a rating.")
    .max(5, "Rating cannot exceed 5."),

  comment: z
    .string()
    .trim()
    .min(5, "Review must be at least 5 characters.")
    .max(1000, "Review cannot exceed 1000 characters."),
});

export type CreateReviewInput = z.infer<typeof ReviewSchema>;

import { z } from "zod";

export const UpdateBookSchema = z.object({
  id: z.string().min(1, "Book ID is required"),

  title: z.string().min(1, "Title is required"),

  description: z.string().optional().nullable(),

  coverUrl: z
    .string()
    .url("Must be a valid URL")
    .or(z.literal(""))
    .optional()
    .nullable(),

  publishedYear: z.coerce
    .number()
    .int("Must be a valid year")
    .min(1000, "Year must be 1000 or later")
    .max(new Date().getFullYear() + 5, "Year cannot be in the far future")
    .optional()
    .nullable(),

  authorName: z.string().min(1, "Author name is required"),

  genreName: z.string().min(1, "Genre name is required"),

  bookType: z.enum(["BOOK", "COMIC"]).default("BOOK"),
});

export type UpdateBookInput = z.input<typeof UpdateBookSchema>;
export type UpdateBookOutput = z.output<typeof UpdateBookSchema>;

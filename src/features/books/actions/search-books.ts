"use server";

import { searchBooks } from "../services/open-library.service";

export async function searchOpenLibraryBooks(query: string) {
  return await searchBooks(query);
}

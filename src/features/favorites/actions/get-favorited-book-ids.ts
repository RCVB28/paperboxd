import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Returns the set of bookIds the *currently logged-in* user has favorited,
 * scoped to the given bookIds (so it stays cheap on a paginated/filtered
 * list rather than pulling every favorite the user has ever made).
 *
 * Returns an empty Set when logged out — callers don't need to branch on
 * auth state themselves, every book will just correctly render as
 * "not favorited".
 */
export async function getFavoritedBookIds(
  bookIds: string[],
): Promise<Set<string>> {
  const session = await auth();
  if (!session?.user || bookIds.length === 0) {
    return new Set();
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: session.user.id,
      bookId: { in: bookIds },
    },
    select: { bookId: true },
  });

  return new Set(favorites.map((f) => f.bookId));
}

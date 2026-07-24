/**
 * Average of `rating` across a list of reviews, or `undefined` when there
 * are none — matches BookCard's `rating?: number` contract, which only
 * renders stars when a number is actually provided.
 *
 * Accepts anything with a `rating` field (not the full Review shape), so
 * it works whether the caller fetched full Review rows or a narrower
 * `select: { rating: true }` projection.
 */
export function getAverageRating(
  reviews: { rating: number }[],
): number | undefined {
  if (reviews.length === 0) return undefined;

  const sum = reviews.reduce((total, review) => total + review.rating, 0);

  return sum / reviews.length;
}

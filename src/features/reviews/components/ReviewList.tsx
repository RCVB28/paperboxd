import * as React from "react";
import { MessageSquareOff } from "lucide-react";
import { StarRating } from "./StarRating"; // Reusing your existing component

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ReviewListProps {
  reviews: Array<{
    id: string;
    rating: number;
    // Allowing nulls as Prisma string/relation fields are often optional
    comment: string | null;
    createdAt: Date | string;
    user: {
      name: string | null;
    };
  }>;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <section aria-labelledby="reviews-heading" className="space-y-6">
      <h2
        id="reviews-heading"
        className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
      >
        Reviews
      </h2>

      {/* ── Empty State ── */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-800">
          <MessageSquareOff
            className="mb-4 h-10 w-10 text-zinc-400 dark:text-zinc-600"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            No reviews yet. Be the first to review this book!
          </p>
        </div>
      ) : (
        /* ── Reviews List ── */
        <ul className="space-y-4">
          {reviews.map((review) => {
            // Safely parse the date regardless of whether it's passed as a Date object or string
            const dateObj = new Date(review.createdAt);

            return (
              <li
                key={review.id}
                className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950/50"
              >
                <article className="flex flex-col gap-4">
                  {/* Header: User & Date */}
                  <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {review.user.name || "Anonymous Reader"}
                    </span>
                    <time
                      dateTime={dateObj.toISOString()}
                      className="text-xs text-zinc-500 dark:text-zinc-400"
                    >
                      {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }).format(dateObj)}
                    </time>
                  </header>

                  {/* Rating */}
                  <div aria-label={`Rating: ${review.rating} out of 5 stars`}>
                    <StarRating value={review.rating} readonly />
                  </div>

                  {/* Comment (Optional) */}
                  {review.comment && (
                    <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {review.comment}
                    </p>
                  )}
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

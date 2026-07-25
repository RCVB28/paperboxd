"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquareOff, Pencil, Trash2 } from "lucide-react";

import { StarRating } from "./StarRating";
import { ReviewForm } from "./ReviewForm";
import { Button } from "@/components/ui/Button";

// Import your server actions directly
import {
  deleteReview,
  deleteAllReviews,
} from "@/features/reviews/actions/delete-review";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReviewListProps {
  bookId?: string;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date | string;
    user: {
      id: string;
      name: string | null;
    };
  }>;

  currentUserId?: string;
  currentUserRole?: "USER" | "ADMIN";
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ReviewList({
  bookId,
  reviews,
  currentUserId,
  currentUserRole,
}: ReviewListProps) {
  const router = useRouter();
  const [editingReviewId, setEditingReviewId] = React.useState<string | null>(
    null,
  );
  const [deletingReviewId, setDeletingReviewId] = React.useState<string | null>(
    null,
  );
  const [isDeletingAll, setIsDeletingAll] = React.useState<boolean>(false);

  const isAdmin = currentUserRole === "ADMIN";

  // ─── Delete Single Review (Server Action) ──────────────────────────────────
  const handleDelete = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setDeletingReviewId(reviewId);

    try {
      const result = await deleteReview(reviewId);

      if (!result.success) {
        throw new Error(
          result.error || result.message || "Failed to delete review",
        );
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert(
        error instanceof Error ? error.message : "Failed to delete review.",
      );
    } finally {
      setDeletingReviewId(null);
    }
  };

  // ─── Delete ALL Reviews (Server Action) ─────────────────────────────────────
  const handleDeleteAll = async () => {
    if (!bookId) return;

    if (
      !window.confirm(
        "Are you sure you want to delete ALL reviews for this book? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsDeletingAll(true);

    try {
      const result = await deleteAllReviews(bookId);

      if (!result.success) {
        throw new Error(
          result.error || result.message || "Failed to delete all reviews",
        );
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting all reviews:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete all reviews.",
      );
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <section aria-labelledby="reviews-heading" className="space-y-6">
      {/* Header with Admin "Delete All" option */}
      <div className="flex items-center justify-between">
        <h2
          id="reviews-heading"
          className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          Reviews ({reviews.length})
        </h2>

        {/* Bulk Delete Button - Only visible to Admins when reviews exist */}
        {isAdmin && reviews.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDeleteAll}
            disabled={isDeletingAll || deletingReviewId !== null}
            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
          >
            {isDeletingAll ? (
              <Loader2
                className="mr-1.5 h-3.5 w-3.5 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            )}
            Delete All Reviews
          </Button>
        )}
      </div>

      {/* Empty State */}
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
        <ul className="space-y-4">
          {reviews.map((review) => {
            const dateObj = new Date(review.createdAt);
            const isEditing = editingReviewId === review.id;
            const isDeleting = deletingReviewId === review.id;
            const isOwnReview =
              currentUserId !== undefined && currentUserId === review.user.id;

            // Admin can delete EVERY review; Regular User can ONLY delete OWN review
            const canDelete = isAdmin || isOwnReview;

            return (
              <li
                key={review.id}
                className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950/50"
              >
                {isEditing ? (
                  <ReviewForm
                    bookId={bookId}
                    review={review}
                    onCancel={() => setEditingReviewId(null)}
                    onSuccess={() => setEditingReviewId(null)}
                  />
                ) : (
                  <article className="flex flex-col gap-4">
                    {/* Review Header */}
                    <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {review.user.name || "Anonymous Reader"}
                      </span>

                      <div className="flex items-center gap-2">
                        <time
                          dateTime={dateObj.toISOString()}
                          className="mr-2 text-xs text-zinc-500 dark:text-zinc-400"
                        >
                          {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }).format(dateObj)}
                        </time>

                        {/* Edit Button (Only author can edit) */}
                        {isOwnReview && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingReviewId(review.id)}
                            disabled={isDeleting || isDeletingAll}
                          >
                            <Pencil
                              className="mr-1.5 h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            Edit
                          </Button>
                        )}

                        {/* Delete Button (Admin OR Author) */}
                        {canDelete && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(review.id)}
                            disabled={isDeleting || isDeletingAll}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
                          >
                            {isDeleting ? (
                              <Loader2
                                className="mr-1.5 h-3.5 w-3.5 animate-spin"
                                aria-hidden="true"
                              />
                            ) : (
                              <Trash2
                                className="mr-1.5 h-3.5 w-3.5"
                                aria-hidden="true"
                              />
                            )}
                            Delete
                          </Button>
                        )}
                      </div>
                    </header>

                    {/* Rating */}
                    <div aria-label={`Rating: ${review.rating} out of 5 stars`}>
                      <StarRating value={review.rating} readonly />
                    </div>

                    {/* Comment */}
                    {review.comment && (
                      <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {review.comment}
                      </p>
                    )}
                  </article>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

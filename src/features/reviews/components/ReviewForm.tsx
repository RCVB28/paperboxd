"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Textarea } from "@/components/ui/Textarea";
import { StarRating } from "@/features/reviews/components/StarRating";
//test
import {
  ReviewSchema,
  type CreateReviewInput,
} from "@/features/reviews/schemas/review.schema";

import { createReview } from "@/features/reviews/actions/create-review";
import { updateReview } from "@/features/reviews/actions/update-review";
import { deleteReview } from "@/features/reviews/actions/delete-review";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReviewFormProps {
  bookId?: string;
  review?: {
    id: string;
    rating: number;
    comment: string | null;
  };
  onCancel?: () => void;
  onSuccess?: () => void;
}

type SubmitStatus =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

// ─── Component ────────────────────────────────────────────────────────────────

export function ReviewForm({
  bookId,
  review,
  onCancel,
  onSuccess,
}: ReviewFormProps) {
  const router = useRouter();
  const [status, setStatus] = React.useState<SubmitStatus>({
    type: "idle",
  });
  const [isDeleting, setIsDeleting] = React.useState(false);

  const isEditing = Boolean(review);

  // Use RHF `values` prop instead of useEffect + reset to handle dynamic defaults safely
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateReviewInput>({
    resolver: zodResolver(ReviewSchema),
    values: {
      bookId: bookId ?? "placeholder-book-id", // Ensure bookId is never empty string if schema requires min length
      rating: review?.rating ?? 0,
      comment: review?.comment ?? "",
    },
    resetOptions: {
      keepDefaultValues: true,
    },
  });

  // ── DELETE REVIEW HANDLER ──
  async function handleDelete() {
    if (!review) return;

    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setIsDeleting(true);
    setStatus({ type: "idle" });

    try {
      const result = await deleteReview({ reviewId: review.id });

      if (result?.error) {
        setStatus({
          type: "error",
          message: result.error,
        });
        setIsDeleting(false);
        return;
      }

      setStatus({
        type: "success",
        message: "Your review has been deleted.",
      });

      router.refresh();
      onSuccess?.();
    } catch (err) {
      console.error("Delete review error:", err);
      setStatus({
        type: "error",
        message:
          "Something went wrong while deleting your review. Please try again.",
      });
      setIsDeleting(false);
    }
  }

  async function onSubmit(data: CreateReviewInput) {
    setStatus({ type: "idle" });

    try {
      // ── UPDATE EXISTING REVIEW ──
      if (review) {
        const result = await updateReview({
          reviewId: review.id,
          rating: Number(data.rating),
          comment: data.comment ? data.comment.trim() : null,
        });

        if (result?.error) {
          setStatus({
            type: "error",
            message: result.error,
          });
          return;
        }

        setStatus({
          type: "success",
          message: "Your review has been updated.",
        });

        router.refresh();
        onSuccess?.();
        return;
      }

      // ── CREATE NEW REVIEW ──
      const result = await createReview(data);

      if (result?.error) {
        setStatus({
          type: "error",
          message: result.error,
        });
        return;
      }

      setStatus({
        type: "success",
        message: "Your review has been posted.",
      });

      reset();
      router.refresh();
      onSuccess?.();
    } catch (err) {
      console.error("Review submission error:", err);
      setStatus({
        type: "error",
        message: isEditing
          ? "Something went wrong while updating your review. Please try again."
          : "Something went wrong while submitting your review. Please try again.",
      });
    }
  }

  // Debug callback to expose schema validation errors on form submit
  function onError(formErrors: unknown) {
    console.warn("Form validation errors preventing submit:", formErrors);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      noValidate
      className="flex flex-col gap-5"
    >
      {/* Result feedback */}
      {status.type === "success" && (
        <Alert variant="success">{status.message}</Alert>
      )}

      {status.type === "error" && (
        <Alert variant="error" aria-live="assertive">
          {status.message}
        </Alert>
      )}

      {/* Hidden input to guarantee bookId is in form payload */}
      <input type="hidden" {...register("bookId")} />

      {/* Rating */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Your rating
        </span>

        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <StarRating
              value={field.value}
              onChange={field.onChange}
              readonly={isSubmitting || isDeleting}
              size="lg"
            />
          )}
        />

        {errors.rating && (
          <p className="text-xs text-red-500" role="alert">
            {errors.rating.message}
          </p>
        )}
      </div>

      {/* Comment */}
      <Textarea
        {...register("comment")}
        id="comment"
        placeholder="What did you think of this book?"
        disabled={isSubmitting || isDeleting}
        error={errors.comment?.message}
        showCount
        maxLength={1000}
        rows={5}
      />

      {/* Form-level schema validation errors (e.g. bookId error) */}
      {errors.bookId && (
        <p className="text-xs text-red-500" role="alert">
          {errors.bookId.message}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        {/* Delete Button (Only shown when editing an existing review) */}
        {isEditing && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleDelete}
            disabled={isSubmitting || isDeleting}
            isLoading={isDeleting}
            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
          >
            <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Delete
          </Button>
        )}

        <div className="flex gap-3 ml-auto">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting || isDeleting}
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isDeleting}
          >
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Submitting..."
              : isEditing
                ? "Update Review"
                : "Submit Review"}
          </Button>
        </div>
      </div>
    </form>
  );
}

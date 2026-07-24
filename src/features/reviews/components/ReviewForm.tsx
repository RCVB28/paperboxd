"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Textarea } from "@/components/ui/TextArea";
import { StarRating } from "@/features/reviews/components/StarRating";

import {
  ReviewSchema,
  type CreateReviewInput,
} from "@/features/reviews/schemas/review.schema";
import { createReview } from "@/features/reviews/actions/create-review";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReviewFormProps {
  bookId: string;
  onCancel?: () => void;
  /** Called after the review is successfully created (e.g. to close a dialog). */
  onSuccess?: () => void;
}

// Local submission-result state, separate from RHF's own isSubmitting/errors —
// this tracks the *outcome* of calling the server action, not client-side
// validation, so it can hold a success message too.
type SubmitStatus =
  | { type: "idle" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

// ─── Component ───────────────────────────────────────────────────────────────

export function ReviewForm({ bookId, onSuccess }: ReviewFormProps) {
  const [status, setStatus] = React.useState<SubmitStatus>({ type: "idle" });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateReviewInput>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      bookId,
      rating: 0,
      comment: "",
    },
  });

  async function onSubmit(data: CreateReviewInput) {
    // Clear any previous result so a retry doesn't show a stale error
    // alongside a new one.
    setStatus({ type: "idle" });

    try {
      const result = await createReview(data);

      // Server actions in this project return { error } on failure rather
      // than throwing, for expected/validated failures (e.g. duplicate
      // review). Unexpected failures fall through to the catch block below.
      if (result?.error) {
        setStatus({ type: "error", message: result.error });
        return;
      }

      setStatus({ type: "success", message: "Your review has been posted." });
      reset({ bookId, rating: 0, comment: "" });
      onSuccess?.();
    } catch {
      setStatus({
        type: "error",
        message:
          "Something went wrong while submitting your review. Please try again.",
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      {/* ── Result feedback ── */}
      {status.type === "success" && (
        <Alert variant="success">{status.message}</Alert>
      )}
      {status.type === "error" && (
        <Alert variant="error" aria-live="assertive">
          {status.message}
        </Alert>
      )}

      {/* ── Rating ── */}
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
              readonly={isSubmitting}
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

      {/* ── Comment ── */}
      <Textarea
        {...register("comment")}
        id="comment"
        placeholder="What did you think of this book?"
        disabled={isSubmitting}
        error={errors.comment?.message}
        showCount
        maxLength={1000}
        rows={5}
      />

      {/* ── Submit ── */}
      <Button
        type="submit"
        variant="primary"
        isLoading={isSubmitting}
        fullWidth
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}

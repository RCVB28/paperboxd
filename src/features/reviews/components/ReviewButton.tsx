"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { ReviewDialog } from "@/features/reviews/components/ReviewDialog";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReviewButtonProps {
  bookId: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
//
// Owns exactly one thing: whether the dialog is open. Everything about the
// review itself (form, validation, submission) lives in ReviewForm, reached
// through ReviewDialog — this component never touches any of that.

export function ReviewButton({ bookId }: ReviewButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        Review
      </Button>

      <ReviewDialog bookId={bookId} open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}

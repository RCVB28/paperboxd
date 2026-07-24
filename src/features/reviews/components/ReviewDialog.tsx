import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReviewDialogProps {
  bookId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
//
// Pure composition layer: Dialog owns open/close mechanics (backdrop, Escape,
// focus trap, animation), ReviewForm owns everything about the review itself
// (validation, submission, loading/success/error state). This component just
// wires the two together and reacts to ReviewForm's onSuccess by closing.

export function ReviewDialog({
  bookId,
  open,
  onOpenChange,
}: ReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Book</DialogTitle>
          <DialogDescription>
            Share your thoughts and rating for this book.
          </DialogDescription>
        </DialogHeader>

        {/*
          `key={bookId}` forces a fresh ReviewForm instance (and therefore
          fresh internal form state) if this dialog is ever reused for a
          different book without fully unmounting in between — e.g. a
          parent that keeps the same <ReviewDialog> mounted and just swaps
          `bookId` and re-opens it. Dialog also unmounts ReviewForm entirely
          on close (see Dialog.tsx's `shouldRender`), so state is already
          reset on every normal open/close cycle; this just covers the
          edge case above too.
        */}
        <ReviewForm
          key={bookId}
          bookId={bookId}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

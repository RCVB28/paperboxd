"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { deleteBook } from "../actions/delete-books";

interface DeleteBookButtonProps {
  bookId: string;
  bookTitle: string;
  onSuccess?: () => void;
}

export function DeleteBookButton({
  bookId,
  bookTitle,
  onSuccess,
}: DeleteBookButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const result = await deleteBook(bookId);

      if (!result.success) {
        setErrorMessage(result.message);
        setIsDeleting(false);
        return;
      }

      setIsOpen(false);
      router.refresh();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      setErrorMessage("An unexpected error occurred.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
      >
        <Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
        Delete
      </Button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3
                id="delete-dialog-title"
                className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
              >
                Delete Book
              </h3>
            </div>

            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-zinc-900 dark:text-zinc-100">
                &quot;{bookTitle}&quot;
              </strong>
              ? This will permanently remove the book, its user reviews, and
              favorite entries from the library.
            </p>

            {errorMessage && (
              <p className="mt-2 text-xs font-medium text-red-500">
                {errorMessage}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white border-none"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

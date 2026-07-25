"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button"; // Adjust if needed
import { updateBook } from "@/features/books/actions/update-books";
import type { UpdateBookInput } from "@/features/books/schemas/book.schema"; // Adjust path

interface BookProps {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  publishedYear: number | null;
  type: "BOOK" | "COMIC";
  author: {
    name: string;
  };
  genre: {
    name: string;
  };
}

export function EditBookForm({ book }: { book: BookProps }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const payload: UpdateBookInput = {
      id: book.id,
      title: formData.get("title") as string,
      authorName: formData.get("authorName") as string,
      genreName: formData.get("genreName") as string,
      description: (formData.get("description") as string) || undefined,
      coverUrl: (formData.get("coverUrl") as string) || undefined,
      publishedYear: formData.get("publishedYear")
        ? Number(formData.get("publishedYear"))
        : undefined,
      bookType: (formData.get("bookType") as "BOOK" | "COMIC") || "BOOK",
    };

    const result = await updateBook(payload);

    if (!result.success) {
      setError(result.message);
      setIsPending(false);
    } else {
      // Redirect back to the admin table on success
      router.push("/admin/books");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="title"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={book.title}
          required
          className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:text-zinc-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="authorName"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Author
          </label>
          <input
            id="authorName"
            name="authorName"
            defaultValue={book.author?.name}
            required
            className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:text-zinc-100"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="genreName"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Genre
          </label>
          <input
            id="genreName"
            name="genreName"
            defaultValue={book.genre?.name}
            required
            className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:text-zinc-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="publishedYear"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Published Year
          </label>
          <input
            id="publishedYear"
            name="publishedYear"
            type="number"
            defaultValue={book.publishedYear || ""}
            className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:text-zinc-100"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="bookType"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Book Type
          </label>
          <select
            id="bookType"
            name="bookType"
            defaultValue={book.type}
            className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:text-zinc-100"
          >
            <option value="BOOK">Book</option>
            <option value="COMIC">Comic</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="coverUrl"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Cover URL
        </label>
        <input
          id="coverUrl"
          name="coverUrl"
          type="url"
          defaultValue={book.coverUrl || ""}
          className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:text-zinc-100"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={book.description || ""}
          rows={6}
          className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-700 dark:text-zinc-100"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/books")}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}

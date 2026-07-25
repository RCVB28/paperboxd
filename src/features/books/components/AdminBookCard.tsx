import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Book, Calendar, Pencil, Tag, User } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { DeleteBookButton } from "./DeleteBookButton";

export interface AdminBookCardProps {
  book: {
    id: string;
    title: string;
    description?: string | null;
    coverUrl?: string | null;
    publishedYear?: number | null;
    bookType?: string | null;
    createdAt: Date | string;
    author: { name: string };
    genre: { name: string };
  };
}

export function AdminBookCard({ book }: AdminBookCardProps) {
  const importedDate = new Date(book.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="flex flex-col sm:flex-row gap-5 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60">
      {/* Cover Image */}
      <div className="relative h-44 w-32 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 self-center sm:self-start">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={`Cover for ${book.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 128px, 128px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400">
            <Book className="h-10 w-10 stroke-1" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                {book.bookType || "BOOK"}
              </span>
              <h3 className="mt-1 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                <Link
                  href={`/books/${book.id}`}
                  className="hover:underline hover:text-amber-600 dark:hover:text-amber-400"
                >
                  {book.title}
                </Link>
              </h3>
            </div>
            <span className="text-xs text-zinc-400 shrink-0">
              Imported {importedDate}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-zinc-400" />
              {book.author.name}
            </span>
            <span className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-zinc-400" />
              {book.genre.name}
            </span>
            {book.publishedYear && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                {book.publishedYear}
              </span>
            )}
          </div>

          {book.description && (
            <p className="line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {book.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <Link href={`/admin/books/${book.id}/edit`}>
            <Button type="button" variant="ghost" size="sm">
              <Pencil className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
              Edit
            </Button>
          </Link>

          <DeleteBookButton bookId={book.id} bookTitle={book.title} />
        </div>
      </div>
    </article>
  );
}

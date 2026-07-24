import Image from "next/image";
import Link from "next/link";
import { BookOpen, Star } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BookCardProps {
  title: string;
  author: string;
  coverUrl?: string;
  publishedYear?: number | null;
  type?: "BOOK" | "COMIC";
  /** 0–5. Only rendered when provided. */
  rating?: number;
  /** Optional link to the book details page. */
  href?: string;
  /** Slot for any trailing control — Import, Favorite, Edit, Delete, etc. */
  action?: React.ReactNode;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function BookCard({
  title,
  author,
  coverUrl,
  publishedYear,
  type = "BOOK",
  rating,
  href,
  action,
  className,
}: BookCardProps) {
  const cover = (
    <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-lg bg-zinc-100 sm:w-36 dark:bg-zinc-800">
      {coverUrl ? (
        <Image
          src={coverUrl}
          alt={`Cover of ${title} by ${author}`}
          fill
          sizes="(max-width: 640px) 100vw, 144px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <BookOpen
            className="h-10 w-10 text-amber-700/40 dark:text-amber-500/40"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );

  const titleContent = (
    <h3 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100">
      {title}
    </h3>
  );

  return (
    <Card
      noPadding
      hoverable
      className={cn("flex flex-col gap-5 p-5 sm:flex-row", className)}
    >
      {/* Cover */}
      {href ? (
        <Link
          href={href}
          aria-label={`View details for ${title}`}
          className="shrink-0"
        >
          {cover}
        </Link>
      ) : (
        cover
      )}

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {href ? (
              <Link href={href} className="transition-opacity hover:opacity-75">
                {titleContent}
              </Link>
            ) : (
              titleContent
            )}

            <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
              {author}
            </p>
          </div>

          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
              type === "COMIC"
                ? "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                : "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
            )}
          >
            {type === "COMIC" ? "Comic" : "Book"}
          </span>
        </div>

        {publishedYear && (
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            Published • {publishedYear}
          </p>
        )}

        {typeof rating === "number" && (
          <div
            className="mt-2 flex items-center gap-0.5"
            role="img"
            aria-label={`Rated ${rating} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                aria-hidden="true"
                className={cn(
                  "h-3.5 w-3.5",
                  i < Math.round(rating)
                    ? "fill-amber-500 text-amber-500"
                    : "fill-none text-zinc-300 dark:text-zinc-600",
                )}
              />
            ))}
          </div>
        )}

        {action && (
          <div className="mt-auto flex justify-end pt-3">{action}</div>
        )}
      </div>
    </Card>
  );
}

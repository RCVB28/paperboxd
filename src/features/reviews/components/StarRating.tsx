"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
} as const;

const STAR_VALUES = [1, 2, 3, 4, 5] as const;

// ─── Component ───────────────────────────────────────────────────────────────
//
// Editable mode is built on real <input type="radio"> elements (visually
// hidden, one per star) rather than a custom keydown handler. Native radio
// groups already give you, for free:
//   - Arrow keys move selection between stars
//   - Tab enters/exits the group as a single stop (only the checked star,
//     or the first one if none checked, is in the tab order)
//   - Screen readers announce "star N of 5, selected" automatically
// A hand-rolled button+keydown version would just be re-implementing this.

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
  className,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  const groupName = React.useId();

  // ── Read-only: static stars, no interaction ──
  if (readonly) {
    const rounded = Math.round(value);
    return (
      <div
        role="img"
        aria-label={`Rated ${value} out of 5 stars`}
        className={cn("flex items-center gap-0.5", className)}
      >
        {STAR_VALUES.map((star) => (
          <Star
            key={star}
            aria-hidden="true"
            className={cn(
              SIZE_CLASSES[size],
              star <= rounded
                ? "fill-amber-500 text-amber-500"
                : "fill-none text-zinc-300 dark:text-zinc-600",
            )}
          />
        ))}
      </div>
    );
  }

  // ── Editable: radio group styled as stars ──
  const displayValue = hoverValue ?? value;

  return (
    <fieldset
      className={cn("m-0 flex items-center gap-0.5 border-0 p-0", className)}
      onMouseLeave={() => setHoverValue(null)}
    >
      <legend className="sr-only">Rating out of 5 stars</legend>

      {STAR_VALUES.map((star) => {
        const inputId = `${groupName}-star-${star}`;
        const isFilled = star <= displayValue;

        return (
          <label
            key={star}
            htmlFor={inputId}
            onMouseEnter={() => setHoverValue(star)}
            className="cursor-pointer rounded-sm p-0.5"
          >
            <input
              type="radio"
              id={inputId}
              name={groupName}
              value={star}
              checked={value === star}
              onChange={() => onChange?.(star)}
              className="peer sr-only"
            />
            <Star
              aria-hidden="true"
              className={cn(
                SIZE_CLASSES[size],
                "rounded-sm transition-colors",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-amber-700 peer-focus-visible:ring-offset-1",
                isFilled
                  ? "fill-amber-500 text-amber-500"
                  : "fill-none text-zinc-300 hover:text-amber-400 dark:text-zinc-600",
              )}
            />
            <span className="sr-only">
              {star} star{star > 1 ? "s" : ""}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-[3px]",
  xl: "h-14 w-14 border-4",
} as const;

export interface SpinnerProps {
  size?: keyof typeof sizeClasses;
  /** Optional accessible label — defaults to "Loading…" */
  label?: string;
  /** Center inside its parent container */
  centered?: boolean;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Spinner({
  size = "md",
  label = "Loading…",
  centered = false,
  className,
}: SpinnerProps) {
  const spinner = (
    <span role="status" aria-label={label} className="inline-flex">
      <span
        className={cn(
          "rounded-full border-zinc-200 border-t-amber-700 animate-spin",
          "dark:border-zinc-700 dark:border-t-amber-500",
          sizeClasses[size],
          className
        )}
      />
      {/* Visually hidden text for screen readers */}
      <span className="sr-only">{label}</span>
    </span>
  );

  if (centered) {
    return (
      <div className="flex w-full items-center justify-center py-12">
        {spinner}
      </div>
    );
  }

  return spinner;
}

Spinner.displayName = "Spinner";

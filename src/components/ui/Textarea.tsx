"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error message — also sets aria-invalid and a red border */
  error?: string;
  /** Show character count (requires maxLength to be set) */
  showCount?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, error, showCount, id, maxLength, value, onChange, ...props },
    ref,
  ) => {
    const [count, setCount] = React.useState(
      typeof value === "string" ? value.length : 0,
    );
    const errorId = error && id ? `${id}-error` : undefined;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="flex flex-col gap-1 w-full">
        <textarea
          ref={ref}
          id={id}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(
            // Base
            "w-full rounded-md border bg-white text-sm text-zinc-900",
            "placeholder:text-zinc-400",
            "transition-colors duration-150",
            // Sizing
            "min-h-[100px] px-3 py-2",
            // Border & focus
            "border-zinc-300 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700/20",
            // Dark mode
            "dark:bg-zinc-900 dark:border-zinc-600 dark:text-zinc-100 dark:placeholder:text-zinc-500",
            "dark:focus:border-amber-600 dark:focus:ring-amber-600/20",
            // Resize
            "resize-y",
            // Disabled
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Error
            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className,
          )}
          {...props}
        />

        {/* Footer row: error left, count right */}
        {(error || (showCount && maxLength)) && (
          <div className="flex items-center justify-between">
            {error ? (
              <p id={errorId} className="text-xs text-red-500" role="alert">
                {error}
              </p>
            ) : (
              <span />
            )}
            {showCount && maxLength && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 tabular-nums">
                {count}/{maxLength}
              </p>
            )}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

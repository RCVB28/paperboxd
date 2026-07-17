import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Icon or element rendered on the left inside the input */
  leftAddon?: React.ReactNode;
  /** Icon or element rendered on the right inside the input */
  rightAddon?: React.ReactNode;
  /** Error message — also sets aria-invalid and red border */
  error?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftAddon, rightAddon, error, id, ...props }, ref) => {
    const errorId = error && id ? `${id}-error` : undefined;

    return (
      <div className="relative flex flex-col gap-1 w-full">
        {/* Addon wrapper */}
        <div className="relative flex items-center">
          {leftAddon && (
            <span className="pointer-events-none absolute left-3 flex items-center text-zinc-400 dark:text-zinc-500">
              {leftAddon}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            aria-invalid={!!error}
            aria-describedby={errorId}
            className={cn(
              // Base
              "w-full rounded-md border bg-white text-sm text-zinc-900",
              "placeholder:text-zinc-400",
              "transition-colors duration-150",
              // Sizing
              "h-10 px-3 py-2",
              // Border & focus
              "border-zinc-300 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700/20",
              // Dark mode
              "dark:bg-zinc-900 dark:border-zinc-600 dark:text-zinc-100 dark:placeholder:text-zinc-500",
              "dark:focus:border-amber-600 dark:focus:ring-amber-600/20",
              // Disabled
              "disabled:cursor-not-allowed disabled:opacity-50",
              // Error state
              error &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              // Addon padding
              leftAddon && "pl-9",
              rightAddon && "pr-9",
              className
            )}
            {...props}
          />

          {rightAddon && (
            <span className="pointer-events-none absolute right-3 flex items-center text-zinc-400 dark:text-zinc-500">
              {rightAddon}
            </span>
          )}
        </div>

        {/* Inline error */}
        {error && (
          <p id={errorId} className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Stacked label rendered above the textarea */
  label?: string;
  /** Error message — takes priority over helperText, sets aria-invalid + red border */
  error?: string;
  /** Muted helper text shown below the textarea when there's no error */
  helperText?: string;
  /** Adds a red asterisk after the label */
  required?: boolean;
  /** Makes the textarea (and its wrapper) span the full width of its container */
  fullWidth?: boolean;
  /**
   * Optional character counter, shown alongside helper/error text.
   * Not part of the original spec, but kept since ReviewForm already
   * depends on it — pass `maxLength` alongside this to enable it.
   */
  showCount?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      required,
      fullWidth = true,
      showCount,
      className,
      id,
      maxLength,
      value,
      onChange,
      disabled,
      readOnly,
      ...props
    },
    ref,
  ) => {
    // Generate a stable id when the caller doesn't provide one, so
    // label/aria-describedby association always works without the
    // consumer having to manage ids by hand.
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;
    const helperId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;

    // Local char count, only tracked when showCount is requested.
    const [count, setCount] = React.useState(
      typeof value === "string" ? value.length : 0,
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (showCount) setCount(e.target.value.length);
      onChange?.(e);
    };

    // error takes priority; helperText only shows when there's no error.
    const describedBy = error ? errorId : helperText ? helperId : undefined;

    return (
      <div
        className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "w-fit")}
      >
        {/* ── Label ── */}
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "text-sm font-medium text-zinc-700 dark:text-zinc-300",
              disabled && "opacity-50",
            )}
          >
            {label}
            {required && (
              <span
                className="ml-1 text-red-500"
                aria-hidden="true"
                title="Required"
              >
                *
              </span>
            )}
          </label>
        )}

        {/* ── Textarea ── */}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          aria-required={required}
          className={cn(
            // Base
            "rounded-xl border bg-white text-sm text-zinc-900 shadow-sm",
            "placeholder:text-zinc-400",
            // Sizing & resize — vertical only, so layout width stays stable
            "min-h-[100px] w-full resize-y px-3.5 py-2.5",
            // Smooth focus transition
            "transition-colors duration-150",
            // Border & focus ring — amber accent
            "border-zinc-300 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700/20",
            // Dark mode
            "dark:bg-zinc-900 dark:border-zinc-600 dark:text-zinc-100 dark:placeholder:text-zinc-500",
            "dark:focus:border-amber-600 dark:focus:ring-amber-600/20",
            // Disabled
            "disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400 disabled:opacity-70",
            "dark:disabled:bg-zinc-800/50",
            // Readonly — visually distinct from a normal editable state
            readOnly && "bg-zinc-50 focus:ring-0 dark:bg-zinc-900/40",
            // Error state overrides the default border/focus colors
            error &&
              "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className,
          )}
          {...props}
        />

        {/* ── Helper / error row (+ optional count) ── */}
        {(error || helperText || (showCount && maxLength)) && (
          <div className="flex items-start justify-between gap-2">
            {error ? (
              <p id={errorId} className="text-xs text-red-500" role="alert">
                {error}
              </p>
            ) : helperText ? (
              <p
                id={helperId}
                className="text-xs text-zinc-500 dark:text-zinc-400"
              >
                {helperText}
              </p>
            ) : (
              <span />
            )}

            {showCount && maxLength && (
              <p className="shrink-0 text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
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

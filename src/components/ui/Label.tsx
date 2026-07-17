import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Renders a red asterisk after the label text */
  required?: boolean;
  /** Muted hint text displayed below the label */
  hint?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, hint, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-0.5">
        <label
          ref={ref}
          className={cn(
            "text-sm font-medium leading-none text-zinc-700",
            "dark:text-zinc-300",
            // Greyed out when associated input is disabled
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            className
          )}
          {...props}
        >
          {children}
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

        {hint && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">{hint}</p>
        )}
      </div>
    );
  }
);

Label.displayName = "Label";

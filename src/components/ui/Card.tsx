import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Root ────────────────────────────────────────────────────────────────────

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Removes the default padding — useful when the card contains a full-bleed image header */
  noPadding?: boolean;
  /** Makes the card visually interactive (hover lift + pointer cursor) */
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, noPadding, hoverable, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-zinc-200 bg-white shadow-sm",
        "dark:border-zinc-700 dark:bg-zinc-900",
        !noPadding && "p-6",
        hoverable &&
          "cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

// ─── Header ──────────────────────────────────────────────────────────────────

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// ─── Title ───────────────────────────────────────────────────────────────────

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-tight text-zinc-900 dark:text-zinc-100",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// ─── Description ─────────────────────────────────────────────────────────────

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-zinc-500 dark:text-zinc-400", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// ─── Content ─────────────────────────────────────────────────────────────────

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm text-zinc-700 dark:text-zinc-300", className)} {...props} />
));
CardContent.displayName = "CardContent";

// ─── Footer ──────────────────────────────────────────────────────────────────

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-3 pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

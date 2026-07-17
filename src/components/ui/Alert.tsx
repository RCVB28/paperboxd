import * as React from "react";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export type AlertVariant = "success" | "error" | "warning" | "info";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
}

// ─── Styles & Icons ──────────────────────────────────────────────────────────

const baseStyles =
  "flex w-full gap-3 rounded-lg border p-4 text-sm transition-colors";

const variantIcons: Record<AlertVariant, React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const variantStyles: Record<AlertVariant, string> = {
  success:
    "border-green-200 bg-green-50 text-green-800 dark:border-green-900/50 dark:bg-green-950/30 dark:text-green-400",

  error:
    "border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400",

  warning:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400",

  info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-400",
};

// ─── Component ───────────────────────────────────────────────────────────────

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "info", title, children, ...props }, ref) => {
    const Icon = variantIcons[variant];

    const role =
      variant === "error" || variant === "warning" ? "alert" : "status";

    const ariaLive = variant === "error" ? "assertive" : "polite";

    return (
      <div
        ref={ref}
        role={role}
        aria-live={ariaLive}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {/* Icon */}
        <div className="flex shrink-0 items-start pt-0.5">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-1">
          {title && <p className="font-semibold leading-none">{title}</p>}

          <div className="leading-relaxed opacity-90">{children}</div>
        </div>
      </div>
    );
  },
);

Alert.displayName = "Alert";

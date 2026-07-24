"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

// ─── Context ──────────────────────────────────────────────────────────────────
// Dialog itself renders nothing visual — it just provides open state and
// stable label/description ids down to DialogContent (and its children),
// so aria-labelledby/aria-describedby can be wired up automatically without
// the consumer having to manage ids by hand.

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext(component: string) {
  const ctx = React.useContext(DialogContext);
  if (!ctx) {
    throw new Error(`<${component}> must be used within a <Dialog>.`);
  }
  return ctx;
}

// ─── Dialog (root) ────────────────────────────────────────────────────────────

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const titleId = React.useId();
  const descriptionId = React.useId();

  return (
    <DialogContext.Provider
      value={{ open, onOpenChange, titleId, descriptionId }}
    >
      {children}
    </DialogContext.Provider>
  );
}

// ─── DialogContent ────────────────────────────────────────────────────────────

const FOCUSABLE =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';
const TRANSITION_MS = 200;

export interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogContent({ children, className }: DialogContentProps) {
  const { open, onOpenChange, titleId, descriptionId } =
    useDialogContext("DialogContent");

  const contentRef = React.useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = React.useState(false); // portal target only exists client-side
  const [shouldRender, setShouldRender] = React.useState(open); // stays true during exit animation
  const [isVisible, setIsVisible] = React.useState(false); // drives the actual transition classes

  React.useEffect(() => setHasMounted(true), []);

  // Drive enter/exit animation without any animation library:
  // opening mounts immediately then flips to "visible" on the next frame
  // (so the transition has a starting point to animate from); closing flips
  // "visible" off immediately, then unmounts after the transition duration.
  React.useEffect(() => {
    if (open) {
      setShouldRender(true);
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    setIsVisible(false);
    const timeout = setTimeout(() => setShouldRender(false), TRANSITION_MS);
    return () => clearTimeout(timeout);
  }, [open]);

  // Lock body scroll while open.
  React.useEffect(() => {
    if (!shouldRender) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [shouldRender]);

  // Focus management: move focus in on open, trap Tab within the dialog,
  // close on Escape, and restore focus to whatever triggered the dialog
  // once it closes.
  React.useEffect(() => {
    if (!shouldRender) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusables =
      contentRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    focusables?.[0]?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onOpenChange(false);
        return;
      }
      if (e.key !== "Tab" || !focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [shouldRender, onOpenChange]);

  if (!hasMounted || !shouldRender) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — click to close */}
      <div
        aria-hidden="true"
        onClick={() => onOpenChange(false)}
        className={cn(
          "fixed inset-0 bg-black/50 transition-opacity duration-200 ease-out",
          isVisible ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Panel */}
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={cn(
          "relative w-full max-w-[500px] rounded-xl border border-zinc-200 bg-white p-6 shadow-lg",
          "dark:border-zinc-800 dark:bg-zinc-900",
          "transition-all duration-200 ease-out",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

// ─── DialogHeader ─────────────────────────────────────────────────────────────

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4 flex flex-col gap-1.5", className)} {...props} />
  );
}

// ─── DialogTitle ──────────────────────────────────────────────────────────────

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const { titleId } = useDialogContext("DialogTitle");
  return (
    <h2
      id={titleId}
      className={cn(
        "text-lg font-semibold leading-tight text-zinc-900 dark:text-zinc-100",
        className,
      )}
      {...props}
    />
  );
}

// ─── DialogDescription ────────────────────────────────────────────────────────

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { descriptionId } = useDialogContext("DialogDescription");
  return (
    <p
      id={descriptionId}
      className={cn("text-sm text-zinc-500 dark:text-zinc-400", className)}
      {...props}
    />
  );
}

// ─── DialogFooter ─────────────────────────────────────────────────────────────

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

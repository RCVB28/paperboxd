"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/branding/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// ─── Nav links ────────────────────────────────────────────────────────────────
// Not exposed as a prop — this is layout structure, not session/business data.

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/books", label: "Books" },
  { href: "/reviews", label: "Reviews" },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavbarProps {
  user?: {
    name: string;
    avatarUrl?: string | null;
    role: "USER" | "ADMIN";
  } | null;
  authActions?: React.ReactNode;
  userMenu?: React.ReactNode;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Navbar({ user, authActions, userMenu }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800",
        "bg-white/80 backdrop-blur-md dark:bg-zinc-950/80"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
        >
          <Logo />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors",
                  "hover:text-amber-700 dark:text-zinc-300 dark:hover:text-amber-500",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side: auth state (desktop) */}
        <div className="hidden items-center md:flex">
          {user ? userMenu : authActions}
        </div>

        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Mobile panel */}
      {isOpen && (
        <div className="border-t border-zinc-200 px-4 pb-4 pt-2 md:hidden dark:border-zinc-800">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors",
                    "hover:bg-zinc-50 hover:text-amber-700 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-amber-500",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
            {user ? userMenu : authActions}
          </div>
        </div>
      )}
    </nav>
  );
}

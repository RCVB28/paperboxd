"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Heart,
  ChevronDown,
  LogOut,
  User,
  Library,
  Download,
} from "lucide-react";

import { AuthLogo } from "@/components/branding/Logo";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import { logout } from "@/features/auth/actions/logout";

// ─── Nav links ────────────────────────────────────────────────────────────────

interface NavLink {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

const BASE_NAV_LINKS: NavLink[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/books", label: "Books" },
];

const FAVORITES_LINK: NavLink = {
  href: "/favorites",
  label: "Favorites",
  icon: <Heart className="h-4 w-4" aria-hidden="true" />,
};

const ADMIN_BOOKS_LINK: NavLink = {
  href: "/admin/books",
  label: "Manage Books",
  icon: <Library className="h-4 w-4" aria-hidden="true" />,
};

const ADMIN_IMPORT_LINK: NavLink = {
  href: "/admin/import",
  label: "Import Books",
  icon: <Download className="h-4 w-4" aria-hidden="true" />,
};

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

// ─── Component ────────────────────────────────────────────────────────────────

export function Navbar({ user, authActions }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Construct nav links based on login state & role
  const navLinks = [
    ...BASE_NAV_LINKS,
    ...(user ? [FAVORITES_LINK] : []),
    ...(user?.role === "ADMIN" ? [ADMIN_BOOKS_LINK, ADMIN_IMPORT_LINK] : []),
  ];

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800",
        "bg-white/80 backdrop-blur-md dark:bg-zinc-950/80",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
        >
          <AuthLogo />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors",
                  "hover:text-amber-700 dark:text-zinc-300 dark:hover:text-amber-500",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2",
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop right side */}
        <div className="hidden items-center md:flex">
          {user ? (
            <div ref={profileMenuRef} className="relative">
              {/* Profile trigger */}
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                aria-expanded={isProfileOpen}
                aria-haspopup="menu"
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5",
                  "text-sm font-medium text-zinc-700 transition-colors",
                  "hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-amber-700",
                )}
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={`${user.name}'s profile`}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="max-w-32 truncate">{user.name}</span>

                {user.role === "ADMIN" && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                    ADMIN
                  </span>
                )}

                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isProfileOpen && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>

              {/* Dropdown */}
              {isProfileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <Link
                    href="/profile"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    <User className="h-4 w-4" aria-hidden="true" />
                    Profile
                  </Link>

                  <Link
                    href="/favorites"
                    role="menuitem"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  >
                    <Heart className="h-4 w-4" aria-hidden="true" />
                    Favorites
                  </Link>

                  {/* Admin Tools Section */}
                  {user.role === "ADMIN" && (
                    <>
                      <div className="my-1 border-t border-zinc-200 dark:border-zinc-800" />
                      <div className="px-3 py-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        Admin Tools
                      </div>

                      <Link
                        href="/admin/books"
                        role="menuitem"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
                      >
                        <Library className="h-4 w-4" aria-hidden="true" />
                        Manage Books
                      </Link>

                      <Link
                        href="/admin/import"
                        role="menuitem"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
                      >
                        <Download className="h-4 w-4" aria-hidden="true" />
                        Import Books
                      </Link>
                    </>
                  )}

                  <div className="my-1 border-t border-zinc-200 dark:border-zinc-800" />

                  <button
                    type="button"
                    role="menuitem"
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            authActions
          )}
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
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors",
                    "hover:bg-zinc-50 hover:text-amber-700 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-amber-500",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700",
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
            {user ? (
              <div className="space-y-1">
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>

                {/* Admin Tools Section (Mobile) */}
                {user.role === "ADMIN" && (
                  <>
                    <div className="my-2 border-t border-zinc-100 dark:border-zinc-800" />
                    <div className="px-3 py-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      Admin Tools
                    </div>
                    <Link
                      href="/admin/books"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
                    >
                      <Library className="h-4 w-4" />
                      Manage Books
                    </Link>
                    <Link
                      href="/admin/import"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
                    >
                      <Download className="h-4 w-4" />
                      Import Books
                    </Link>
                  </>
                )}

                <div className="my-2 border-t border-zinc-100 dark:border-zinc-800" />

                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            ) : (
              authActions
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

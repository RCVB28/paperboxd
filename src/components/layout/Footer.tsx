import Link from "next/link";
import { Github, Instagram, Twitter } from "lucide-react";
import { Logo } from "@/components/branding/Logo";
import { cn } from "@/lib/utils";

// ─── Link groups ─────────────────────────────────────────────────────────────
// Static layout content, not session/business data — kept internal.

const NAVIGATION_LINKS = [
  { href: "/", label: "Home" },
  { href: "/books", label: "Browse Books" },
  { href: "/about", label: "About" },
];

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
];

const SOCIAL_LINKS = [
  { href: "https://twitter.com", label: "Twitter", icon: Twitter },
  { href: "https://github.com", label: "GitHub", icon: Github },
  { href: "https://instagram.com", label: "Instagram", icon: Instagram },
];

const linkClasses = cn(
  "text-sm text-zinc-500 transition-colors hover:text-amber-700",
  "dark:text-zinc-400 dark:hover:text-amber-500",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 rounded-sm"
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

// ─── Component ───────────────────────────────────────────────────────────────

export function Footer({ className, ...props }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950",
        className
      )}
      {...props}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
              Track your reading, write reviews, and discover your next
              favourite book or comic.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Navigation
            </h3>
            <ul className="flex flex-col gap-2">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal">
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Legal
            </h3>
            <ul className="flex flex-col gap-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Follow us
            </h3>
            <ul className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 transition-colors",
                      "hover:bg-zinc-100 hover:text-amber-700 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-amber-500",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="mt-10 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            © {year} Paperboxd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

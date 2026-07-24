import Link from "next/link";

// Shown in the Navbar's right slot when a user is signed in.
// Placeholder implementation (links to /dashboard) — swap for a real
// dropdown (profile / settings / sign out) when that's built, in this
// one file, so every page picks up the change automatically.

export interface UserMenuProps {
  name: string;
}

export function UserMenu({ name }: UserMenuProps) {
  return (
    <Link
      href="/dashboard"
      className="flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-xs font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
        {name.charAt(0).toUpperCase()}
      </span>
      <span className="hidden sm:inline">{name}</span>
    </Link>
  );
}

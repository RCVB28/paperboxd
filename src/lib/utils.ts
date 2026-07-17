import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn() — class name utility.
 *
 * Combines clsx (conditional class joining) with tailwind-merge
 * (conflict resolution). Without tailwind-merge, passing both
 * "p-2" and "p-4" would leave both in the string and the browser
 * would apply whichever came last in the stylesheet — unpredictable.
 * twMerge deduplicates Tailwind utilities by category so the last
 * intentional value always wins.
 *
 * Usage:
 *   cn("px-4 py-2", isLarge && "text-lg", className)
 *   cn("bg-white", isDark && "bg-zinc-900") // → "bg-zinc-900" if isDark
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

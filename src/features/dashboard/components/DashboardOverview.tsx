import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStat {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export interface DashboardOverviewProps {
  userName: string;
  role: "USER" | "ADMIN";
  stats: DashboardStat[];
  recentActivity?: React.ReactNode;
  quickActions?: React.ReactNode;
}

// ─── Stat card ───────────────────────────────────────────────────────────────

function StatCard({ title, value, icon, trend }: DashboardStat) {
  return (
    <Card className="bg-zinc-50 dark:bg-zinc-900/60">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {value}
          </p>
        </div>
        <span
          className="shrink-0 text-amber-700 dark:text-amber-500"
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>

      {trend && (
        <p
          className={cn(
            "mt-3 flex items-center gap-1 text-xs font-medium",
            trend.isPositive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400",
          )}
        >
          {trend.isPositive ? (
            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>{trend.value}</span>
        </p>
      )}
    </Card>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DashboardOverview({
  userName,
  role,
  stats,
  recentActivity,
  quickActions,
}: DashboardOverviewProps) {
  return (
    <section
      aria-labelledby="dashboard-heading"
      className="flex flex-col gap-6"
    >
      {/* Welcome header */}
      <header className="flex items-center gap-2.5">
        <h1
          id="dashboard-heading"
          className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100"
        >
          Welcome back, {userName}!
        </h1>
        {role === "ADMIN" && (
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
            Admin
          </span>
        )}
      </header>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main split: activity + quick actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Recent activity
          </h2>
          {recentActivity ?? (
            <Card className="text-sm text-zinc-500 dark:text-zinc-400">
              No recent activity yet.
            </Card>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Quick actions
          </h2>
          {quickActions ?? (
            <Card className="text-sm text-zinc-500 dark:text-zinc-400">
              No actions available.
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}

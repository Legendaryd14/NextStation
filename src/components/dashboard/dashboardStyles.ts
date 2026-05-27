import { cn } from "@/lib/utils";

export const dashboardPageClass = (className?: string) =>
  cn(
    "h-full w-full overflow-y-auto px-4 py-6 md:px-8 md:py-10",
    "bg-slate-100 text-slate-950 dark:bg-[#020308] dark:text-white",
    className,
  );

export const dashboardPanelClass = (className?: string) =>
  cn(
    "overflow-hidden rounded-lg border bg-white shadow-sm shadow-slate-200/70",
    "border-slate-200 dark:border-white/[0.07] dark:bg-[#05070d] dark:shadow-black/30",
    className,
  );

export const dashboardTableHeadClass = (className?: string) =>
  cn(
    "border-b border-slate-200 bg-slate-50/90 text-slate-600",
    "dark:border-white/[0.07] dark:bg-white/[0.03] dark:text-zinc-400",
    className,
  );

export const dashboardTableRowClass = (className?: string) =>
  cn(
    "border-b border-slate-200 transition-colors hover:bg-slate-50",
    "dark:border-white/[0.07] dark:hover:bg-white/[0.04]",
    className,
  );

export const dashboardButtonClass = (className?: string) =>
  cn(
    "rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800",
    "transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50",
    "dark:border-white/10 dark:bg-[#05070d] dark:text-zinc-200 dark:hover:bg-white/[0.06]",
    className,
  );

export const dashboardTitleClass = (className?: string) =>
  cn("text-2xl font-semibold text-slate-950 dark:text-white", className);

export const dashboardMutedTextClass = (className?: string) =>
  cn("text-slate-500 dark:text-zinc-400", className);

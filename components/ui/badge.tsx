import { cn } from "@/lib/utils";

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200",
        className
      )}
    >
      {children}
    </span>
  );
}

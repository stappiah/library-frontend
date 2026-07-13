import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: { label: string; href: string };
}) {
  return (
    <div className="rounded-[30px] border border-dashed border-zinc-300 bg-white px-8 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
      <p className="text-lg font-semibold text-zinc-950 dark:text-white">{title}</p>
      <p className="mt-3 text-sm text-zinc-500">{description}</p>
      <Link href={action.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white">
        {action.label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

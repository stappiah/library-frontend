import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div className="border-b border-zinc-200 bg-zinc-950 text-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-sm sm:px-6">
        <div className="flex items-center gap-2 text-zinc-200">
          <ShieldCheck className="h-4 w-4" />
          <span>Free shipping on orders over $150 • Secure checkout • 30-day returns</span>
        </div>
        <Link
          href="/shop"
          className="hidden items-center gap-1 font-semibold text-white/90 sm:flex"
        >
          Explore collections
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

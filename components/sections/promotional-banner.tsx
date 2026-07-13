import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PromotionalBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="rounded-[30px] bg-[linear-gradient(135deg,#111827_0%,#0f172a_45%,#1d4ed8_100%)] px-6 py-8 text-white sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-white/80">Occasion ready</p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Design-forward gifting bundles built to impress.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">
              Pair the best-selling essentials with free wrapping and curated recommendations for birthdays, housewarmings, and thoughtful thank-yous.
            </p>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-zinc-950">
            Build a gift set
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

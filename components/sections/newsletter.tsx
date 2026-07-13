import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="rounded-[30px] border border-zinc-200 bg-white px-6 py-8 dark:border-zinc-800 dark:bg-zinc-900 sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Stay in the loop</p>
            <h2 className="mt-3 text-2xl font-bold text-zinc-950 dark:text-white">Get weekly drops, exclusive previews, and member pricing.</h2>
          </div>
          <form className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <Input placeholder="Email address" className="flex-1" />
            <Button type="submit">
              Subscribe
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

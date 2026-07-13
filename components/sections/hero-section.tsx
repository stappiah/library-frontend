"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.22),transparent_55%)]" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-20">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            <Sparkles className="h-4 w-4" />
            Curated for the modern collector
          </p>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl dark:text-white">
            Premium objects for high-touch spaces and everyday rituals.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            Discover elevated essentials with refined materials, fast delivery, and a storefront experience built to feel as premium as the products themselves.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop">
              <Button size="lg">Shop now <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link href="/categories">
              <Button variant="secondary" size="lg">Explore categories</Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-zinc-600 dark:text-zinc-300">
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Safe, insured shipping</span>
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> 48-hour order support</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="rounded-4xl border border-zinc-200 bg-white p-4 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] dark:border-zinc-800 dark:bg-zinc-900">
            <div className="rounded-3xl bg-[linear-gradient(135deg,#0f172a_0%,#1d4ed8_50%,#38bdf8_100%)] p-6 text-white">
              <p className="text-sm uppercase tracking-[0.2em] text-white/80">Spring edit</p>
              <h2 className="mt-3 text-2xl font-bold">Calm, elevated essentials for the season ahead</h2>
              <p className="mt-3 max-w-md text-sm text-white/85">
                Curated bundles, premium finishes, and immersive storytelling designed for modern homes and workspaces.
              </p>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                { label: "New arrivals", value: "24" },
                { label: "Average rating", value: "4.9/5" },
                { label: "Fast dispatch", value: "48h" },
                { label: "Repeat buyers", value: "89%" },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-zinc-50 px-4 py-4 dark:bg-zinc-950">
                  <p className="text-sm text-zinc-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-zinc-950 dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

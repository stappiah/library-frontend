"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types/ecommerce";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.28)] dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Digital resources</p>
          <h3 className="mt-3 text-xl font-semibold text-zinc-950 dark:text-white">{category.name}</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{category.description}</p>
        </div>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold dark:bg-zinc-800">📚</span>
      </div>
      <Link
        href={`/categories/${category.slug}`}
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white"
      >
        Browse {category.name}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.article>
  );
}

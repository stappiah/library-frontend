"use client";

import { motion } from "framer-motion";
import type { Testimonial } from "@/types/ecommerce";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="rounded-[28px] border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <p className="text-base leading-7 text-zinc-700 dark:text-zinc-200">“{testimonial.quote}”</p>
      <div className="mt-6 flex items-center gap-3">
        <img src={testimonial.avatar} alt={testimonial.name} className="h-11 w-11 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-zinc-950 dark:text-white">{testimonial.name}</p>
          <p className="text-sm text-zinc-500">{testimonial.role}</p>
        </div>
      </div>
    </motion.article>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, GraduationCap, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVendors } from "@/lib/services/catalog-service";
import type { VendorProfile } from "@/types/ecommerce";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<VendorProfile[]>([]);

  useEffect(() => {
    getVendors().then(setVendors).catch(() => setVendors([]));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
      <div className="rounded-[32px] border border-zinc-200 bg-white/80 p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.3)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
              <GraduationCap className="h-4 w-4" />
              Lecturer Portal
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-zinc-950 dark:text-white">
              Upload and manage your e-books for tertiary students.
            </h1>
            <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              Lecturers can upload e-books in PDF/Word format, set prices in Ghana Cedis, and reach students across various faculties.
            </p>
          </div>
          <Link href="/vendors/new">
            <Button size="lg"><Upload className="h-4 w-4" /> Upload E-book <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Lecturers</p>
          <h2 className="mt-2 text-2xl font-bold text-zinc-950 dark:text-white">Browse lecturer storefronts</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <Link key={vendor.id} href={`/vendors/${vendor.slug}`} className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.22)] transition hover:-translate-y-1 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">{vendor.specialties[0] || "Lecturer"}</p>
                  <h2 className="mt-2 text-xl font-bold text-zinc-950 dark:text-white">{vendor.name}</h2>
                </div>
                <div className="rounded-full bg-zinc-100 p-2 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                  <BookOpen className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">{vendor.bio}</p>
              <div className="mt-5 flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">{vendor.rating.toFixed(1)} ★</span>
                <span>{vendor.productsCount} e-books</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

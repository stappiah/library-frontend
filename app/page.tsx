import Link from "next/link";
import { ArrowRight, Globe2, ShieldCheck, Sparkles, Star } from "lucide-react";
import { AnnouncementBar } from "@/components/sections/announcement-bar";
import { CategoryCard } from "@/components/sections/category-card";
import { HeroSection } from "@/components/sections/hero-section";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromotionalBanner } from "@/components/sections/promotional-banner";
import { TestimonialCard } from "@/components/sections/testimonial-card";
import { brandLogos } from "@/data/mock";
import { getCategories, getFeaturedProducts, getTestimonials } from "@/lib/services/catalog-service";

export default async function Home() {
  const [featuredProducts, categories, testimonials] = await Promise.all([
    getFeaturedProducts(3),
    getCategories(),
    getTestimonials(),
  ]);

  return (
    <div>
      <AnnouncementBar />
      <HeroSection />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Featured e-books</p>
            <h2 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">Recommended reading materials for tertiary students</h2>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white">
            Browse all e-books
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6">
          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="rounded-[32px] border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Why students choose us</p>
              <h2 className="mt-3 text-2xl font-bold text-zinc-950 dark:text-white">Quality education resources at your fingertips.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Expert-reviewed books", icon: Sparkles },
                { label: "Instant e-book delivery", icon: Globe2 },
                { label: "Mobile Money checkout", icon: ShieldCheck },
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] bg-zinc-50 px-4 py-3 dark:bg-zinc-950">
                  <item.icon className="h-5 w-5 text-zinc-950 dark:text-white" />
                  <p className="mt-3 text-sm font-semibold text-zinc-950 dark:text-white">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Faculties</p>
            <h2 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">Browse e-books by faculty</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <PromotionalBanner />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">What customers say</p>
            <h2 className="mt-3 text-3xl font-bold text-zinc-950 dark:text-white">Loved by modern shoppers and growing teams</h2>
          </div>
          <div className="hidden items-center gap-2 text-sm font-semibold text-amber-500 sm:flex">
            <Star className="h-4 w-4 fill-current" />
            Rated 4.9/5 across every collection
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="rounded-[30px] border border-zinc-200 bg-white px-6 py-8 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Trusted by design-led brands</p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {brandLogos.map((brand) => (
              <div key={brand} className="rounded-[24px] bg-zinc-50 px-4 py-5 text-center text-sm font-semibold text-zinc-700 dark:bg-zinc-950 dark:text-zinc-200">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}

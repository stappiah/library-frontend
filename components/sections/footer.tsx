import Link from "next/link";
import { BookOpen, Mail, MapPin, Phone, Sparkles } from "lucide-react";

const footerLinks = [
  { label: "Shop E-books", href: "/shop" },
  { label: "Faculties", href: "/categories" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Professor / Vendors", href: "/vendors" },
  { label: "Account", href: "/account" },
];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold">
            <BookOpen className="h-5 w-5" />
            KTU E-bookshop
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            Your premier online bookshop for tertiary education e-books in Ghana. Quality reading materials for university students.
          </p>
          <div className="mt-6 flex gap-3 text-zinc-500">
            <span className="rounded-full border border-zinc-200 p-2 dark:border-zinc-800"><Mail className="h-4 w-4" /></span>
            <span className="rounded-full border border-zinc-200 p-2 dark:border-zinc-800"><BookOpen className="h-4 w-4" /></span>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Explore</p>
          <div className="mt-4 space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block hover:text-zinc-950 dark:hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Contact</p>
          <div className="mt-4 space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
            <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +233 50 000 0000</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> info@ktuebookshop.edu.gh</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Accra, Ghana</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

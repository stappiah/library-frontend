'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ShoppingBag } from 'lucide-react';
import { sanitizeInput, cn } from './utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const safeSearch = sanitizeInput(search);
    console.log("Searching for:", safeSearch);
    // Navigation logic here
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-lg border-zinc-200 dark:border-zinc-800 py-3" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">
        <Link href="/" className="text-2xl font-black tracking-tighter text-blue-600">
          NEXTRADE
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          <Link href="/categories" className="hover:text-blue-600 transition-colors">Categories</Link>
          <Link href="/vendors" className="hover:text-blue-600 transition-colors">Vendors</Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors">About</Link>
        </nav>

        <form 
          onSubmit={handleSearch}
          className="hidden md:flex flex-grow max-w-md relative"
        >
          <input 
            type="text"
            placeholder="Search templates, UI kits..."
            className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        </form>

        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-sm font-bold hover:text-blue-600">Login</button>
          <button className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
            Register
          </button>
          <button className="p-2 lg:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
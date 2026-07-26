'use client';

import Image from 'next/image';
import { Product } from './components/types';
import { Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
          {product.category.replace('-', ' ')}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg leading-tight text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
          <span className="font-bold text-xl text-zinc-900 dark:text-white">
            ₵{product.price}
          </span>
        </div>
        
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          by <span className="font-medium text-zinc-700 dark:text-zinc-300">{product.vendorName}</span>
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{product.rating}</span>
            <span className="text-xs text-zinc-400">({product.reviewsCount})</span>
          </div>
          
          <button className="p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-blue-600 hover:text-white transition-colors">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
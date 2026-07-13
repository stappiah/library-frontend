import { Product, Vendor, Category, Testimonial } from "./components/types";

export const CATEGORIES: Category[] = [
  { id: '1', name: 'UI Kits', slug: 'ui-kit', iconName: 'Layout', count: 124 },
  { id: '2', name: 'E-Books', slug: 'ebook', iconName: 'BookOpen', count: 85 },
  { id: '3', name: 'Software', slug: 'software', iconName: 'Code', count: 42 },
  { id: '4', name: 'Templates', slug: 'template', iconName: 'FileText', count: 210 },
  { id: '5', name: 'Courses', slug: 'course', iconName: 'GraduationCap', count: 67 },
  { id: '6', name: 'Plugins', slug: 'plugin', iconName: 'Cpu', count: 38 },
];

export const VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'PixelForge',
    avatar: 'https://i.pravatar.cc/150?u=v1',
    specialty: 'UI/UX Design',
    rating: 4.9,
    productsCount: 15,
    bio: 'Crafting premium design assets for modern startups.'
  },
  {
    id: 'v2',
    name: 'CodeStack',
    avatar: 'https://i.pravatar.cc/150?u=v2',
    specialty: 'SaaS Templates',
    rating: 4.8,
    productsCount: 22,
    bio: 'High-performance React and Next.js boilerplates.'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Modern Dashboard UI Kit',
    price: 49,
    rating: 4.8,
    reviewsCount: 124,
    category: 'ui-kit',
    vendorId: 'v1',
    vendorName: 'PixelForge',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
    description: 'A comprehensive UI kit for admin dashboards.'
  },
  {
    id: 2,
    title: 'Next.js SaaS Boilerplate',
    price: 129,
    rating: 5.0,
    reviewsCount: 89,
    category: 'software',
    vendorId: 'v2',
    vendorName: 'CodeStack',
    image: 'https://images.unsplash.com/photo-1618401471353-b98aadebc25a?q=80&w=600&auto=format&fit=crop',
    description: 'The ultimate starter for your next big idea.'
  },
  {
    id: 3,
    title: 'Mastering TypeScript E-Book',
    price: 29,
    rating: 4.7,
    reviewsCount: 210,
    category: 'ebook',
    vendorId: 'v1',
    vendorName: 'PixelForge',
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=600&auto=format&fit=crop',
    description: 'Go from zero to hero in TypeScript.'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah Jenkins',
    role: 'Product Manager',
    avatar: 'https://i.pravatar.cc/150?u=t1',
    quote: 'The quality of templates on this marketplace is unmatched. Saved us weeks of development.',
    rating: 5,
  }
];
export type CategoryType = 'ebook' | 'template' | 'software' | 'ui-kit' | 'course' | 'plugin';

export interface Product {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviewsCount: number;
  category: CategoryType;
  vendorId: string;
  vendorName: string;
  image: string;
  description: string;
}

export interface Vendor {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  productsCount: number;
  bio: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface Category {
  id: string;
  name: string;
  slug: CategoryType;
  iconName: string;
  count: number;
}
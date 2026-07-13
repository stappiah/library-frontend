export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  reviewsCount: number;
  category: string;
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

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  count: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  rating: number;
}
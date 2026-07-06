export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  title: string;
  text: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  keyBenefits: string[];
  potencyExplanation: string;
  idealFor: string[];
  howToUse: string;
  ingredients: string;
  concern?: string;
  variants: string[];
  selectedVariant?: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  stock_quantity?: number;
  reviewsList: Review[];
  size?: string;
  gallery_images?: string[];
  reviews_count?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant: string;
}

export interface ReviewSubmission {
  productName: string;
  author: string;
  city: string;
  rating: number;
  title: string;
  text: string;
}

export type PageRoute = 'home' | 'shop' | 'best-sellers' | 'about' | 'contact' | 'product' | 'wishlist' | 'track-order' | 'checkout' | 'checkout-success' | 'sign-in' | 'sign-up' | 'account' | 'admin' | 'admin-sign-in' | 'order-details' | 'privacy-policy' | 'terms-conditions' | 'shipping-policy' | 'return-policy';

export interface SavedAddress {
  id: string;
  user_id?: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postal_code?: string;
  special_instructions: string;
  is_primary: boolean;
  created_at?: string;
}

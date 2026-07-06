export interface DbProfile {
  id: string; // UUID primary key linked to auth.users
  clerk_id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  role: 'customer' | 'admin';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbCategory {
  id: string; // UUID primary key
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbProduct {
  id: string; // UUID primary key
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_price: number | null;
  category_id: string | null; // UUID reference
  images: string[];
  stock_quantity: number;
  is_bestseller: boolean;
  is_featured: boolean;
  rating: number;
  reviews_count: number;
  ingredients: string[];
  how_to_use: string | null;
  benefits: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbCartItem {
  id: string; // UUID primary key
  user_id: string; // UUID reference
  product_id: string; // UUID reference
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface DbOrder {
  id: string; // UUID primary key
  order_number: string;
  user_id: string | null; // UUID reference
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: string;
  city: string;
  phone: string;
  payment_method: string;
  tracking_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbOrderItem {
  id: string; // UUID primary key
  order_id: string; // UUID reference
  product_id: string | null; // UUID reference
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface DbMessage {
  id: string; // UUID primary key
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  replied: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbReview {
  id: string; // UUID primary key
  product_id: string; // UUID reference
  user_id: string | null; // UUID reference
  rating: number; // 1-5
  comment: string | null;
  video_url: string | null;
  before_image: string | null;
  after_image: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

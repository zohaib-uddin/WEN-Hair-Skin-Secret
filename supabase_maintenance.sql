-- =========================================================================
-- WEN HAIR & SKIN SECRET - DATABASE MAINTENANCE & SCHEMA EXTENSIONS
-- Run this script inside the Supabase SQL Editor to configure cascading deletes,
-- database constraints, and the new Wishlist structural schemas.
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. ADD NEW 'wishlist' CORE STRUCT TABLE
-- -------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Prevent multiple entries of the same product in a single user's wishlist
  CONSTRAINT unique_user_product_wishlist UNIQUE (user_id, product_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Create secure, declarative access policies
DROP POLICY IF EXISTS "Users can read their own wishlist items" ON public.wishlist;
CREATE POLICY "Users can read their own wishlist items" 
  ON public.wishlist FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own wishlist entries" ON public.wishlist;
CREATE POLICY "Users can insert their own wishlist entries" 
  ON public.wishlist FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can remove their own wishlist entries" ON public.wishlist;
CREATE POLICY "Users can remove their own wishlist entries" 
  ON public.wishlist FOR DELETE 
  TO authenticated 
  USING (user_id = auth.uid());

-- Performance Indexes for Wishlist Lookups
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON public.wishlist (user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product_id ON public.wishlist (product_id);


-- -------------------------------------------------------------------------
-- 2. CASCADE DELETES HARDENING (SAFEGUARD RELATIONS ON PRODUCT DELETIONS)
-- -------------------------------------------------------------------------

-- Hardening reviews relation cascading
ALTER TABLE public.reviews 
  DROP CONSTRAINT IF EXISTS reviews_product_id_fkey,
  ADD CONSTRAINT reviews_product_id_fkey 
  FOREIGN KEY (product_id) 
  REFERENCES public.products(id) 
  ON DELETE CASCADE;

-- Hardening cart items relation cascading
ALTER TABLE public.cart_items 
  DROP CONSTRAINT IF EXISTS cart_items_product_id_fkey,
  ADD CONSTRAINT cart_items_product_id_fkey 
  FOREIGN KEY (product_id) 
  REFERENCES public.products(id) 
  ON DELETE CASCADE;


-- -------------------------------------------------------------------------
-- 3. STOCK INVENTORY SAFEGUARD (CONSTRAINTS PROTECTION)
-- -------------------------------------------------------------------------

-- Prevent products stock inventory levels from ever falling below zero (0)
ALTER TABLE public.products 
  DROP CONSTRAINT IF EXISTS check_products_stock_quantity,
  ADD CONSTRAINT check_products_stock_quantity CHECK (stock_quantity >= 0);

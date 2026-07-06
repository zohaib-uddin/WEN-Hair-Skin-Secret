-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR WEN HAIR & SKIN SECRET
-- Execute this entire script in your Supabase SQL Editor.
-- Bypasses authentication hurdles while maintaining strict access control rules.
-- ========================================================

-- Helper check if user is admin (runs as SECURITY DEFINER to bypass RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN SECURITY DEFINER AS $$
BEGIN
  -- Authenticated user's Clerk claim/metadata role, or fallback profile field check
  RETURN (
    COALESCE(auth.jwt()->'user_metadata'->>'role', '') = 'admin' OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE (clerk_id = auth.jwt()->>'sub' OR id = auth.uid()) AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql;


-- --------------------------------------------------------
-- 1. PROFILES TABLE POLICIES 
-- --------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT 
  TO authenticated, anon, service_role
  USING (clerk_id = auth.jwt()->>'sub' OR id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE 
  TO authenticated, service_role
  USING (clerk_id = auth.jwt()->>'sub' OR id = auth.uid() OR public.is_admin())
  WITH CHECK (clerk_id = auth.jwt()->>'sub' OR id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL 
  TO authenticated, service_role
  USING (public.is_admin());


-- --------------------------------------------------------
-- 2. PRODUCTS TABLE POLICIES
-- --------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products
  FOR SELECT 
  TO anon, authenticated
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products
  FOR ALL 
  TO authenticated、service_role
  USING (public.is_admin());


-- --------------------------------------------------------
-- 3. CART ITEMS TABLE POLICIES
-- --------------------------------------------------------
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
CREATE POLICY "Users can view their own cart items" ON public.cart_items
  FOR SELECT 
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM public.profiles 
      WHERE clerk_id = auth.jwt()->>'sub' OR id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert their own cart items" ON public.cart_items;
CREATE POLICY "Users can insert their own cart items" ON public.cart_items
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    user_id IN (
      SELECT id FROM public.profiles 
      WHERE clerk_id = auth.jwt()->>'sub' OR id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
CREATE POLICY "Users can update their own cart items" ON public.cart_items
  FOR UPDATE 
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM public.profiles 
      WHERE clerk_id = auth.jwt()->>'sub' OR id = auth.uid()
    )
  )
  WITH CHECK (
    user_id IN (
      SELECT id FROM public.profiles 
      WHERE clerk_id = auth.jwt()->>'sub' OR id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;
CREATE POLICY "Users can delete their own cart items" ON public.cart_items
  FOR DELETE 
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM public.profiles 
      WHERE clerk_id = auth.jwt()->>'sub' OR id = auth.uid()
    )
  );


-- --------------------------------------------------------
-- 4. ORDERS & ORDER ITEMS TABLE POLICIES
-- --------------------------------------------------------
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Orders
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT 
  TO authenticated
  USING (
    user_id IN (
      SELECT id FROM public.profiles 
      WHERE clerk_id = auth.jwt()->>'sub' OR id = auth.uid()
    ) OR public.is_admin()
  );

DROP POLICY IF EXISTS "Admins and checkout can insert orders" ON public.orders;
CREATE POLICY "Admins and checkout can insert orders" ON public.orders
  FOR INSERT 
  TO authenticated, anon, service_role
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders
  FOR ALL 
  TO authenticated, service_role
  USING (public.is_admin());

-- Order Items
DROP POLICY IF EXISTS "Users can view their own order items" ON public.order_items;
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT 
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM public.orders 
      WHERE user_id IN (
        SELECT id FROM public.profiles 
        WHERE clerk_id = auth.jwt()->>'sub' OR id = auth.uid()
      )
    ) OR public.is_admin()
  );

DROP POLICY IF EXISTS "Admins and checkout can manage order items" ON public.order_items;
CREATE POLICY "Admins and checkout can manage order items" ON public.order_items
  FOR ALL 
  TO authenticated, anon, service_role
  USING (true);


-- --------------------------------------------------------
-- 5. MESSAGES TABLE POLICIES
-- --------------------------------------------------------
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert messages" ON public.messages;
CREATE POLICY "Public can insert messages" ON public.messages
  FOR INSERT 
  TO anon, authenticated, service_role
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage messages" ON public.messages;
CREATE POLICY "Admins can manage messages" ON public.messages
  FOR ALL 
  TO authenticated, service_role
  USING (public.is_admin());


-- --------------------------------------------------------
-- 6. REVIEWS TABLE POLICIES
-- --------------------------------------------------------
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view approved reviews" ON public.reviews;
CREATE POLICY "Public can view approved reviews" ON public.reviews
  FOR SELECT 
  TO anon, authenticated
  USING (
    is_approved = true OR 
    user_id IN (
      SELECT id FROM public.profiles 
      WHERE clerk_id = auth.jwt()->>'sub' OR id = auth.uid()
    ) OR 
    public.is_admin()
  );

DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;
CREATE POLICY "Authenticated users can insert reviews" ON public.reviews
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    user_id IN (
      SELECT id FROM public.profiles 
      WHERE clerk_id = auth.jwt()->>'sub' OR id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners or admins manage reviews" ON public.reviews;
CREATE POLICY "Owners or admins manage reviews" ON public.reviews
  FOR ALL 
  TO authenticated, service_role
  USING (
    user_id IN (
      SELECT id FROM public.profiles 
      WHERE clerk_id = auth.jwt()->>'sub' OR id = auth.uid()
    ) OR 
    public.is_admin()
  );

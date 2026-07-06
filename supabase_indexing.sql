-- =========================================================================
-- WEN HAIR & SKIN SECRET - PRODUCTION DATABASE SPEED & INTELLIGENCE PACK
-- Run this script inside the Supabase SQL Editor to make the database fast
-- and initialize the secure SQL functions for our Admin Analytics charts.
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. DATABASE INDEXING FOR SPEED (CRITICAL FOR FAST LOAD & PAGINATION)
-- -------------------------------------------------------------------------

-- Unique index on products slug (perfect for SEO pages load)
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products (slug);

-- Index on category IDs (crucial for filtering products by category)
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);

-- Index on is_active status (filters active/inactive formulations efficiently)
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products (is_active);

-- Index on orders table user_id (massively speeds up User Account -> My Orders page)
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);

-- Index on order status column (for quick logistics / admin dashboards filtering)
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);

-- Index on cart_items user_id (loads customer cart instantly on header hover)
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items (user_id);

-- Index on reviews matching product_id (speeds up Product Details page reviews listing)
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews (product_id);

-- Unique index on clerk_id (essential for instant profile syncing check)
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_clerk_id ON profiles (clerk_id);


-- -------------------------------------------------------------------------
-- 2. HIGH-PERFORMANCE ANALYTICS RPC FUNCTIONS (DOES NOT LOAD ALL ROWS TRICK)
-- -------------------------------------------------------------------------

-- A. get_revenue_stats() -> Groups active sales by 7-day, 30-day, all-time and last 30 daily days
CREATE OR REPLACE FUNCTION get_revenue_stats()
RETURNS json AS $$
DECLARE
  all_time_rev numeric;
  last_7_days_rev numeric;
  last_30_days_rev numeric;
  daily_chart json;
BEGIN
  SELECT COALESCE(SUM(total_amount), 0) INTO all_time_rev FROM orders WHERE status != 'cancelled';
  SELECT COALESCE(SUM(total_amount), 0) INTO last_7_days_rev FROM orders WHERE status != 'cancelled' AND created_at >= NOW() - INTERVAL '7 days';
  SELECT COALESCE(SUM(total_amount), 0) INTO last_30_days_rev FROM orders WHERE status != 'cancelled' AND created_at >= NOW() - INTERVAL '30 days';
  
  SELECT json_agg(t) INTO daily_chart FROM (
    SELECT 
      date_trunc('day', created_at)::date::text AS day,
      SUM(total_amount)::numeric AS revenue
    FROM orders
    WHERE status != 'cancelled' AND created_at >= NOW() - INTERVAL '30 days'
    GROUP BY day
    ORDER BY day ASC
  ) t;

  RETURN json_build_object(
    'all_time', all_time_rev,
    'last_7_days', last_7_days_rev,
    'last_30_days', last_30_days_rev,
    'daily_revenue', COALESCE(daily_chart, '[]'::json)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- B. get_top_products() -> Aggregates best selling 5 formulas, calculating sales totals
CREATE OR REPLACE FUNCTION get_top_products()
RETURNS json AS $$
DECLARE
  res json;
BEGIN
  SELECT json_agg(t) INTO res FROM (
    SELECT 
      p.id,
      p.name,
      SUM(oi.quantity)::int AS total_sold,
      SUM(oi.quantity * oi.price)::numeric AS total_revenue
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    JOIN orders o ON o.id = oi.order_id
    WHERE o.status != 'cancelled'
    GROUP BY p.id, p.name
    ORDER BY total_sold DESC
    LIMIT 5
  ) t;
  RETURN COALESCE(res, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- C. get_category_distribution() -> Distributes formulation orders mapped across active categories
CREATE OR REPLACE FUNCTION get_category_distribution()
RETURNS json AS $$
DECLARE
  res json;
BEGIN
  SELECT json_agg(t) INTO res FROM (
    SELECT 
      c.id,
      c.name,
      COUNT(DISTINCT oi.order_id)::int AS order_count,
      SUM(oi.quantity)::int AS item_count
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    JOIN categories c ON c.id = p.category_id
    JOIN orders o ON o.id = oi.order_id
    WHERE o.status != 'cancelled'
    GROUP BY c.id, c.name
    ORDER BY order_count DESC
  ) t;
  RETURN COALESCE(res, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- D. get_recent_activity() -> Tracks recent 24h client triggers
CREATE OR REPLACE FUNCTION get_recent_activity()
RETURNS json AS $$
DECLARE
  new_orders int;
  new_messages int;
BEGIN
  SELECT COUNT(*)::int INTO new_orders FROM orders WHERE created_at >= NOW() - INTERVAL '24 hours';
  SELECT COUNT(*)::int INTO new_messages FROM messages WHERE created_at >= NOW() - INTERVAL '24 hours';
  
  RETURN json_build_object(
    'new_orders_24h', new_orders,
    'new_messages_24h', new_messages
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

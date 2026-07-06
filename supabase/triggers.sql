-- ==========================================
-- 1. TRIGGER 1: AUTOMATIC PRODUCT RATINGS RECALCULATION
-- Recalculates average rating and increment reviews_count automatically
-- when a review status changes (Insert, Update status, Delete).
-- ==========================================

CREATE OR REPLACE FUNCTION public.recalculate_product_ratings()
RETURNS TRIGGER SECURITY DEFINER AS $$
DECLARE
  target_product_id UUID;
  computed_avg_rating DECIMAL(2,1);
  computed_reviews_count INTEGER;
BEGIN
  -- Identify the product-id based on the DML action
  IF (TG_OP = 'DELETE') THEN
    target_product_id := OLD.product_id;
  ELSE
    target_product_id := NEW.product_id;
  END IF;

  -- Compute the average rating and review status count for APPROVED reviews
  SELECT 
    COALESCE(ROUND(AVG(rating)::numeric, 1), 0.0),
    COUNT(id)
  INTO computed_avg_rating, computed_reviews_count
  FROM public.reviews
  WHERE product_id = target_product_id AND is_approved = true;

  -- Synchronize parent product specifications in the catalog
  UPDATE public.products
  SET 
    rating = computed_avg_rating,
    reviews_count = computed_reviews_count,
    updated_at = NOW()
  WHERE id = target_product_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Bind Trigger to the Reviews Table
DROP TRIGGER IF EXISTS trigger_sync_product_reviews ON public.reviews;
CREATE TRIGGER trigger_sync_product_reviews
AFTER INSERT OR UPDATE OF is_approved, rating OR DELETE
ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.recalculate_product_ratings();


-- ==========================================
-- 2. TRIGGER 2: AUTOMATIC UPDATED_AT AUTO-TIMESTAMP
-- Automatically updates updated_at whenever a column changes.
-- ==========================================

-- Standard generic timestamp helper routine
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER SECURITY DEFINER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Bind update_at automatic trigger resets
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at 
BEFORE UPDATE ON public.profiles 
FOR EACH ROW 
EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at 
BEFORE UPDATE ON public.products 
FOR EACH ROW 
EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at 
BEFORE UPDATE ON public.orders 
FOR EACH ROW 
EXECUTE FUNCTION public.handle_updated_at();

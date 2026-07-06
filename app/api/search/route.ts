import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "../../../src/lib/supabase/server";
import { successResponse, errorResponse } from "../../../src/lib/utils/apiResponse";

/**
 * GET: Advanced search & filtering on botanical formulations.
 * Supports fuzzy search, category filter, price bracket filters, sorting modes, and custom pagination.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    
    // Extract & sanitize query parameters
    const q = (searchParams.get("q") || "").trim().replace(/[^\w\s\-\.\u0600-\u06FF]/gi, ""); // support Eng/Urdu alphanumeric characters safely
    const categoryId = searchParams.get("category_id");
    const minPriceStr = searchParams.get("min_price");
    const maxPriceStr = searchParams.get("max_price");
    const sort = searchParams.get("sort") || "newest";

    // Pagination attributes
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "12", 10)));
    const offset = (page - 1) * limit;

    const supabase = await createSupabaseServerClient();

    // Compile select query indicating exact hit counters
    let query = supabase
      .from("products")
      .select("*, categories(id, name, slug)", { count: "exact" });

    // Always exclude inactive/out-of-season products
    query = query.eq("is_active", true);

    // Apply exact category match if applicable
    if (categoryId && categoryId !== "all" && categoryId !== "null" && categoryId.trim() !== "") {
      query = query.eq("category_id", categoryId);
    }

    // Apply pricing bounds validations
    if (minPriceStr) {
      const minVal = parseFloat(minPriceStr);
      if (!isNaN(minVal) && minVal >= 0) {
        query = query.gte("price", minVal);
      }
    }

    if (maxPriceStr) {
      const maxVal = parseFloat(maxPriceStr);
      if (!isNaN(maxVal) && maxVal >= 0) {
        query = query.lte("price", maxVal);
      }
    }

    // Apply fuzzy matching via `ilike` or Full-Text search query vectors
    if (q.length > 0) {
      query = query.or(`name.ilike.%${q}%,short_description.ilike.%${q}%`);
    }

    // Apply sorting parameter mapping
    switch (sort) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "newest":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    // Apply page bounds slice
    query = query.range(offset, offset + limit - 1);

    const { data: products, count, error } = await query;

    if (error) {
      console.error("[Search Service Database Error]:", error);
      return errorResponse(error.message, 500);
    }

    return successResponse({
      products: products || [],
      totalCount: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
      limit
    });

  } catch (err: any) {
    console.error("[Search Service Critical System Error]:", err);
    return errorResponse(`Search execution exception: ${err.message}`, 500);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient, getSupabaseAdminClient } from "../../../src/lib/supabase/server";
import { getUserRole } from "../../../src/lib/utils/getUserRole";
import { ProductInputSchema } from "../../../src/lib/validation";

// Public: GET products list with dynamic pagination, search, sorting and category filtering
export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const searchParams = req.nextUrl.searchParams;

    // 1. Pagination Parameters
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "12", 10)));
    const offset = (page - 1) * limit;

    // 2. Query Filters
    const categoryId = searchParams.get("category_id");
    const sortBy = searchParams.get("sort_by") || "newest";
    const searchQuery = searchParams.get("q");

    // Initiate Supabase query targeting products table
    let query = supabase
      .from("products")
      .select("*, categories(id, name, slug)", { count: "exact" });

    // Filter by active status (public only views is_active = true)
    query = query.eq("is_active", true);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (searchQuery) {
      query = query.ilike("name", `%${searchQuery}%`);
    }

    // 3. Sorting Strategies
    switch (sortBy) {
      case "price_asc":
        query = query.order("price", { ascending: true });
        break;
      case "price_desc":
        query = query.order("price", { ascending: false });
        break;
      case "rating":
        query = query.order("rating", { ascending: false });
        break;
      case "bestseller":
        query = query.eq("is_bestseller", true).order("created_at", { ascending: false });
        break;
      case "newest":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    // Apply pagination range selection
    query = query.range(offset, offset + limit - 1);

    const { data: products, error, count } = await query;

    if (error) {
      console.error("GET Products Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const totalPages = typeof count === "number" ? Math.ceil(count / limit) : 1;

    return NextResponse.json({
      success: true,
      data: products || [],
      pagination: {
        totalItems: count || 0,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (err: any) {
    console.error("GET Products Catch Block Error:", err);
    return NextResponse.json(
      { error: `Internal server failure: ${err.message}` },
      { status: 500 }
    );
  }
}

// Admin only: POST a new product. Uses getSupabaseAdminClient to bypass writing limitations
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate with Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access: Please sign in to verify identity" },
        { status: 401 }
      );
    }

    // 2. Perform Role Authorization
    const role = await getUserRole(userId);
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges are required to perform this action" },
        { status: 403 }
      );
    }

    // 3. Parse and Validate Request Payload
    const bodyResult = await req.json().catch(() => ({}));
    const parseResult = ProductInputSchema.safeParse(bodyResult);

    if (!parseResult.success) {
      console.error("POST Product Validation Failure:", parseResult.error.format());
      return NextResponse.json(
        { 
          error: "Validation failure: Please check submitted product specifications", 
          details: parseResult.error.format() 
        },
        { status: 400 }
      );
    }

    const validatedData = parseResult.data;
    
    // 4. Use Service-Role Super-Client to write successfully past RLS policies
    const adminSupabaseClient = getSupabaseAdminClient();

    const { data: insertedProduct, error } = await adminSupabaseClient
      .from("products")
      .insert({
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description || null,
        short_description: validatedData.short_description || null,
        price: validatedData.price,
        compare_price: validatedData.compare_price || null,
        category_id: validatedData.category_id || null,
        images: validatedData.images || [],
        stock_quantity: validatedData.stock_quantity ?? 0,
        is_bestseller: validatedData.is_bestseller ?? false,
        is_featured: validatedData.is_featured ?? false,
        ingredients: validatedData.ingredients || [],
        how_to_use: validatedData.how_to_use || null,
        benefits: validatedData.benefits || [],
        is_active: validatedData.is_active ?? true,
      })
      .select("*, categories(name, slug)")
      .single();

    if (error) {
      console.error("Supabase Database Insert Product Failure Error:", error);
      return NextResponse.json(
        { error: `Database write operation failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Product created successfully", 
        data: insertedProduct 
      }, 
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST Product Catch Block Failure Exception:", err);
    return NextResponse.json(
      { error: `Internal server crash: ${err.message}` },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { checkUser } from "../../../src/lib/auth-helpers";

export const dynamic = "force-dynamic";

/**
 * GET: Retrieve current user's wishlist joined with product info.
 */
export async function GET(req: NextRequest) {
  try {
    const checkResult = await checkUser();
    if (!checkResult.authenticated) {
      return NextResponse.json(
        { error: checkResult.error || "Unauthenticated" },
        { status: checkResult.status || 401 }
      );
    }

    const { profileId, supabase } = checkResult;

    const { data: wishlistItems, error } = await supabase
      .from("wishlist")
      .select(`
        id,
        product_id,
        created_at,
        products (
          id,
          name,
          slug,
          price,
          compare_price,
          images,
          stock_quantity,
          is_active
        )
      `)
      .eq("user_id", profileId);

    if (error) {
      console.error("[Wishlist GET Error]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Adapt format to clean structures
    const formattedWishlist = (wishlistItems || []).map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      created_at: item.created_at,
      product: item.products,
    }));

    return NextResponse.json({ success: true, wishlist: formattedWishlist });
  } catch (err: any) {
    console.error("[Wishlist GET System Error]:", err);
    return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
  }
}

/**
 * POST: Add product to current user's wishlist.
 */
export async function POST(req: NextRequest) {
  try {
    const checkResult = await checkUser();
    if (!checkResult.authenticated) {
      return NextResponse.json(
        { error: checkResult.error || "Unauthenticated" },
        { status: checkResult.status || 401 }
      );
    }

    const { profileId, supabase } = checkResult;
    const body = await req.json().catch(() => ({}));
    const { product_id } = body;

    if (!product_id) {
      return NextResponse.json({ error: "Product ID (product_id) is required" }, { status: 400 });
    }

    // Check if it already exists to avoid duplicates
    const { data: existing, error: checkErr } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", profileId)
      .eq("product_id", product_id)
      .maybeSingle();

    if (checkErr) {
      console.error("[Wishlist Duplicate Check Error]:", checkErr);
      return NextResponse.json({ error: checkErr.message }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json(
        { success: true, message: "Product is already in your wishlist", item: existing },
        { status: 200 }
      );
    }

    const { data: inserted, error: insertErr } = await supabase
      .from("wishlist")
      .insert({
        user_id: profileId,
        product_id,
      })
      .select()
      .single();

    if (insertErr) {
      console.error("[Wishlist Insert Error]:", insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Product added to wishlist", item: inserted }, { status: 201 });
  } catch (err: any) {
    console.error("[Wishlist POST System Error]:", err);
    return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
  }
}

/**
 * DELETE: Remove product from current user's wishlist.
 */
export async function DELETE(req: NextRequest) {
  try {
    const checkResult = await checkUser();
    if (!checkResult.authenticated) {
      return NextResponse.json(
        { error: checkResult.error || "Unauthenticated" },
        { status: checkResult.status || 401 }
      );
    }

    const { profileId, supabase } = checkResult;

    // Retrieve product_id either from query searchParams or JSON body
    let productId = req.nextUrl.searchParams.get("product_id");
    if (!productId) {
      const body = await req.json().catch(() => ({}));
      productId = body.product_id;
    }

    if (!productId) {
      return NextResponse.json({ error: "Product ID (product_id) is required" }, { status: 400 });
    }

    const { data: deleted, error: deleteErr } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", profileId)
      .eq("product_id", productId)
      .select()
      .maybeSingle();

    if (deleteErr) {
      console.error("[Wishlist DELETE Error]:", deleteErr);
      return NextResponse.json({ error: deleteErr.message }, { status: 500 });
    }

    if (!deleted) {
      return NextResponse.json({ error: "Item not found in wishlist or not deleted" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product removed from wishlist", item: deleted });
  } catch (err: any) {
    console.error("[Wishlist DELETE System Error]:", err);
    return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
  }
}

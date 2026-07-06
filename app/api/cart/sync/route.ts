import { NextRequest, NextResponse } from "next/server";
import { checkUser } from "../../../../src/lib/auth-helpers";

export const dynamic = "force-dynamic";

interface LocalCartItem {
  product_id: string;
  quantity: number;
}

/**
 * POST: Sync guest cart (from localStorage) into the authenticated user's cart.
 */
export async function POST(req: NextRequest) {
  try {
    const checkResult = await checkUser();
    if (!checkResult.authenticated) {
      return NextResponse.json(
        { error: checkResult.error || "Unauthenticated: Sign-in required to merge cart." },
        { status: checkResult.status || 401 }
      );
    }

    const { profileId, supabase } = checkResult;
    const body = await req.json().catch(() => ({}));
    const { items } = body;

    if (items === undefined || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid payload: 'items' must be a valid array of items { product_id, quantity }" },
        { status: 400 }
      );
    }

    // Process synchronous lookup and upsert sequence
    for (const item of items as LocalCartItem[]) {
      const { product_id, quantity } = item;
      
      // Basic item property validation
      if (!product_id || typeof quantity !== "number" || quantity <= 0) {
        continue;
      }

      // Check if product actually exists to avoid foreign key violations
      const { data: productExists, error: productErr } = await supabase
        .from("products")
        .select("id")
        .eq("id", product_id)
        .maybeSingle();

      if (productErr || !productExists) {
        continue; // Skip invalid products
      }

      // Check if item already exists in the user's DB cart
      const { data: existingCartItem, error: checkErr } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", profileId)
        .eq("product_id", product_id)
        .maybeSingle();

      if (checkErr) {
        console.error("[Cart Sync Check Item Failure]:", checkErr);
        continue;
      }

      if (existingCartItem) {
        // Compound the quantities from both states
        const aggregatedQuantity = existingCartItem.quantity + quantity;
        const { error: updateErr } = await supabase
          .from("cart_items")
          .update({ quantity: aggregatedQuantity })
          .eq("id", existingCartItem.id);

        if (updateErr) {
          console.error("[Cart Sync Update Failure]:", updateErr);
        }
      } else {
        // Insert new cart line record
        const { error: insertErr } = await supabase
          .from("cart_items")
          .insert({
            user_id: profileId,
            product_id,
            quantity,
          });

        if (insertErr) {
          console.error("[Cart Sync Insert Failure]:", insertErr);
        }
      }
    }

    // Retrieve the fully compiled, unified cart representation from DB to sync UI state
    const { data: unifiedCart, error: fetchErr } = await supabase
      .from("cart_items")
      .select(`
        id,
        product_id,
        quantity,
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

    if (fetchErr) {
      console.error("[Cart Sync Unified Fetch Error]:", fetchErr);
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Guest cart merged with your database cart.",
      unified_cart: unifiedCart || [],
    });
  } catch (err: any) {
    console.error("[Cart Sync Critical Exception]:", err);
    return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { checkUser } from "../../../../src/lib/auth-helpers";
import { getSupabaseAdminClient } from "../../../../src/lib/supabase/server";

// GET current logged-in user's orders history
export async function GET() {
  try {
    const userCheck = await checkUser();
    if (!userCheck.authenticated) {
      return NextResponse.json({ error: userCheck.error }, { status: userCheck.status });
    }

    const { profileId } = userCheck;
    const adminSupabase = getSupabaseAdminClient();

    // Query past secure orders filtered by actual profile database ID
    const { data: userOrders, error } = await adminSupabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          quantity,
          price,
          product_id,
          products (
            id,
            name,
            slug,
            images,
            short_description
          )
        )
      `)
      .eq("user_id", profileId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("User orders history retrieval DB error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orders: userOrders || []
    });
  } catch (err: any) {
    console.error("User orders history general GET exception:", err);
    return NextResponse.json({ error: `Internal server error: ${err.message}` }, { status: 500 });
  }
}

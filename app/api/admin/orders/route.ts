import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "../../../../src/lib/auth-helpers";
import { getSupabaseAdminClient } from "../../../../src/lib/supabase/server";

// GET all orders for admin management
export async function GET(req: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const adminSupabase = getSupabaseAdminClient();

    // Fetch all orders with user profile and order items details
    const { data: orders, error } = await adminSupabase
      .from("orders")
      .select(`
        *,
        profiles:user_id ( id, name, phone, email ),
        order_items (
          id,
          quantity,
          price,
          product_id,
          products (
            id,
            name,
            slug,
            images
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin orders retrieval error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, orders: orders || [] });
  } catch (err: any) {
    console.error("Admin order GET system exception:", err);
    return NextResponse.json({ error: `Internal server error: ${err.message}` }, { status: 500 });
  }
}

// PATCH - update order status and/or tracking ID
export async function PATCH(req: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const body = await req.json().catch(() => ({}));
    const { order_id, new_status, tracking_id } = body;

    if (!order_id) {
      return NextResponse.json({ error: "Missing required parameter: order_id" }, { status: 400 });
    }

    const adminSupabase = getSupabaseAdminClient();

    // Construct update data
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (new_status) {
      const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
      if (!validStatuses.includes(new_status)) {
        return NextResponse.json({ error: `Invalid order status. Must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
      }
      updateData.status = new_status;
    }

    if (tracking_id !== undefined) {
      updateData.tracking_id = tracking_id || null;
    }

    const { data: updatedOrder, error } = await adminSupabase
      .from("orders")
      .update(updateData)
      .eq("id", order_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating order status in database:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder
    });
  } catch (err: any) {
    console.error("Admin order PATCH system exception:", err);
    return NextResponse.json({ error: `Internal server failure: ${err.message}` }, { status: 500 });
  }
}

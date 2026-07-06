import { NextRequest, NextResponse } from "next/server";
import { checkUser } from "../../../src/lib/auth-helpers";
import { getSupabaseAdminClient } from "../../../src/lib/supabase/server";
import { OrderPlaceSchema } from "../../../src/lib/validation";
import { sendOrderConfirmationEmail } from "../../../src/lib/email";

// User Route: GET current user's order history
export async function GET() {
  try {
    const userCheck = await checkUser();
    if (!userCheck.authenticated) {
      return NextResponse.json({ error: userCheck.error }, { status: userCheck.status });
    }

    const { profileId } = userCheck;
    
    // Utilize the secure admin service client to query past RLS restrictions
    const adminSupabase = getSupabaseAdminClient();

    // Get order history sorted newest first
    const { data: orders, error: ordersErr } = await adminSupabase
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
            images
          )
        )
      `)
      .eq("user_id", profileId)
      .order("created_at", { ascending: false });

    if (ordersErr) {
      console.error("GET Orders database retrieval error:", ordersErr);
      return NextResponse.json({ error: ordersErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orders: orders || [],
    });
  } catch (err: any) {
    console.error("GET Orders catch Exception:", err);
    return NextResponse.json(
      { error: `Internal server failure: ${err.message}` },
      { status: 500 }
    );
  }
}

// User Route: POST Place a new checkout transaction order (Uses Service Role Client to avoid RLS locks)
export async function POST(req: NextRequest) {
  try {
    const userCheck = await checkUser();
    if (!userCheck.authenticated) {
      return NextResponse.json({ error: userCheck.error }, { status: userCheck.status });
    }

    const { profileId } = userCheck;

    // Validate request JSON body
    const bodyResult = await req.json().catch(() => ({}));
    const parseResult = OrderPlaceSchema.safeParse(bodyResult);

    if (!parseResult.success) {
      console.error("Checkout validation failed:", parseResult.error.format());
      return NextResponse.json(
        { error: "Validation failure", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const validatedData = parseResult.data;
    
    // Instantiate Admin Super-client to safely sequence multiple reads and writes
    const adminSupabase = getSupabaseAdminClient();

    // 1. Rate Limiting Check: Prevent identical order creations within 10 seconds (accidental double-click)
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000).toISOString();
    const { data: recentOrders, error: recentOrderErr } = await adminSupabase
      .from("orders")
      .select("id")
      .eq("user_id", profileId)
      .gte("created_at", tenSecondsAgo)
      .limit(1);

    if (recentOrderErr) {
      console.error("[Checkout Prevention Router Alert]: Recent order lookup failure", recentOrderErr);
    }

    if (recentOrders && recentOrders.length > 0) {
      return NextResponse.json(
        { error: "RateLimitError: Please wait 10 seconds before placing another order. Your elixirs packing is already in transit process." },
        { status: 429 }
      );
    }

    // 1b. Spam Protection: A user cannot place more than 3 orders in 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { count: spamOrderCount, error: spamCheckErr } = await adminSupabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profileId)
      .gte("created_at", fiveMinutesAgo);

    if (spamCheckErr) {
      console.error("[Checkout Prevention Router Alert]: 5-min spam order count query error", spamCheckErr);
    }

    if (spamOrderCount !== null && spamOrderCount >= 3) {
      return NextResponse.json(
        { error: "RateLimitError: You cannot place more than 3 orders in 5 minutes. Please wait before attempting further checkouts." },
        { status: 429 }
      );
    }

    // 2. Input Sanitization: Clean Address and notes fields to prevent XSS payloads
    const sanitizeStr = (text: string) => {
      if (!text) return text;
      return text
        .replace(/<script[^>]*>([\S\s]*?)<\/script>/gi, "")
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/javascript:/gi, "")
        .trim();
    };

    if (validatedData.shipping_address) {
      validatedData.shipping_address = sanitizeStr(validatedData.shipping_address);
    }
    if (validatedData.city) {
      validatedData.city = sanitizeStr(validatedData.city);
    }
    if (validatedData.notes) {
      validatedData.notes = sanitizeStr(validatedData.notes);
    }

    // 3. Fetch user's cart items
    const { data: cartItems, error: cartErr } = await adminSupabase
      .from("cart_items")
      .select(`
        id,
        quantity,
        product_id,
        products (
          id,
          name,
          price,
          stock_quantity,
          is_active
        )
      `)
      .eq("user_id", profileId);

    if (cartErr) {
      console.error("Checkout: failed to retrieve cart items", cartErr);
      return NextResponse.json({ error: `Cart access failure: ${cartErr.message}` }, { status: 500 });
    }

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Empty Cart: Please select items first" }, { status: 400 });
    }

    // 2. Validate current stock levels and prepare updates
    let totalSum = 0;
    const inventoryUpdates: Array<{ id: string; name: string; targetStock: number }> = [];
    const itemsToInsert: Array<{ product_id: string; quantity: number; price: number }> = [];

    for (const item of cartItems) {
      const product = item.products as any;
      if (!product) {
        return NextResponse.json({ error: "Product in basket is invalid or out of sync" }, { status: 404 });
      }

      if (!product.is_active) {
        return NextResponse.json({ error: `Product '${product.name}' is no longer active` }, { status: 400 });
      }

      if (item.quantity > product.stock_quantity) {
        return NextResponse.json({
          error: "OutOfStock: Insufficient product catalog inventory",
          details: `Product: '${product.name}', Requested: ${item.quantity}, Stock Remaining: ${product.stock_quantity}`,
        }, { status: 400 });
      }

      totalSum += product.price * item.quantity;
      inventoryUpdates.push({
        id: product.id,
        name: product.name,
        targetStock: product.stock_quantity - item.quantity,
      });

      itemsToInsert.push({
        product_id: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // 3. Generate a clean unique order number: e.g. WEN-987123
    const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
    const uniqueOrderNumber = `WEN-${randomSuffix}`;

    // 4. Create Order row entry using Service Role Client
    const { data: insertedOrder, error: orderCreateErr } = await adminSupabase
      .from("orders")
      .insert({
        order_number: uniqueOrderNumber,
        user_id: profileId,
        status: "pending",
        total_amount: totalSum,
        shipping_address: validatedData.shipping_address,
        city: validatedData.city,
        phone: validatedData.phone,
        payment_method: validatedData.payment_method,
        notes: validatedData.notes || null,
      })
      .select()
      .single();

    if (orderCreateErr || !insertedOrder) {
      console.error("Checkout: failed to insert order record", orderCreateErr);
      return NextResponse.json({ error: `Transaction registration failure: ${orderCreateErr?.message}` }, { status: 500 });
    }

    const createdOrderId = insertedOrder.id;

    // 5. Create Order Items breakdown specification
    const finalItemsToInsert = itemsToInsert.map((item) => ({
      order_id: createdOrderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsCreateErr } = await adminSupabase
      .from("order_items")
      .insert(finalItemsToInsert);

    if (itemsCreateErr) {
      console.error("Checkout: failed to insert order items details", itemsCreateErr);
      // Clean rollback root order to avoid dangling records
      await adminSupabase.from("orders").delete().eq("id", createdOrderId);
      return NextResponse.json({ error: `Fulfillment breakdown failure: ${itemsCreateErr.message}` }, { status: 500 });
    }

    // 6. Decrement product inventories
    for (const update of inventoryUpdates) {
      const { error: stockUpdateErr } = await adminSupabase
        .from("products")
        .update({ stock_quantity: update.targetStock, updated_at: new Date().toISOString() })
        .eq("id", update.id);

      if (stockUpdateErr) {
        console.error(`Inventory mismatch logging dynamic failure for Product ID: ${update.id}. Error:`, stockUpdateErr);
      }
    }

    // 7. Empty user's cart records
    const { error: cartFlushErr } = await adminSupabase
      .from("cart_items")
      .delete()
      .eq("user_id", profileId);

    if (cartFlushErr) {
      console.warn("Failed to automatically flush Cart rows for user. Handled gracefully.", cartFlushErr);
    }

    try {
      // Fetch user profile coordinates for Resend email trigger
      const { data: customerProfile } = await adminSupabase
        .from("profiles")
        .select("id, email, full_name")
        .eq("id", profileId)
        .maybeSingle();

      // Fetch full order entries with nested products for complete itemization in confirmation email
      const { data: completeOrderWithItems } = await adminSupabase
        .from("orders")
        .select(`
          id,
          order_number,
          total_amount,
          shipping_address,
          city,
          phone,
          payment_method,
          created_at,
          order_items (
            id,
            quantity,
            price,
            products (
              id,
              name
            )
          )
        `)
        .eq("id", createdOrderId)
        .maybeSingle();

      if (customerProfile && customerProfile.email && completeOrderWithItems) {
        // Trigger confirmation email transmission in background to preserve prompt checkout API speed
        sendOrderConfirmationEmail(completeOrderWithItems as any, {
          email: customerProfile.email,
          fullName: customerProfile.full_name,
        }).catch((e) => {
          console.error("[Email Trigger Error Background]:", e);
        });
      }
    } catch (emailTriggerErr) {
      console.error("[Email Service Trigger Exception]:", emailTriggerErr);
    }

    // Returns structural confirmation details
    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order: {
        id: insertedOrder.id,
        order_number: insertedOrder.order_number,
        total_amount: insertedOrder.total_amount,
        status: insertedOrder.status,
        created_at: insertedOrder.created_at,
        shipping_address: insertedOrder.shipping_address,
        city: insertedOrder.city,
        phone: insertedOrder.phone,
        payment_method: insertedOrder.payment_method,
        itemsCount: finalItemsToInsert.length,
      },
    }, { status: 201 });

  } catch (err: any) {
    console.error("Order POST checkout exception:", err);
    return NextResponse.json(
      { error: `Internal server failure during checkout: ${err.message}` },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { checkUser } from "../../../src/lib/auth-helpers";
import { CartItemAddSchema, CartItemUpdateSchema } from "../../../src/lib/validation";

// User Route: GET current user's basket items
export async function GET() {
  try {
    const userCheck = await checkUser();
    if (!userCheck.authenticated) {
      return NextResponse.json({ error: userCheck.error }, { status: userCheck.status });
    }

    const { profileId, supabase } = userCheck;

    // Join with products table to fetch core dimensions
    const { data: cartItems, error } = await supabase
      .from("cart_items")
      .select(`
        id,
        quantity,
        product_id,
        products (
          id,
          name,
          slug,
          price,
          images,
          stock_quantity
        )
      `)
      .eq("user_id", profileId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Process and safe-cast join elements
    const processedItems = (cartItems || []).map((item: any) => {
      const product = item.products;
      const subtotal = product ? item.quantity * product.price : 0;
      return {
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product: product ? {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          images: product.images,
          stock_quantity: product.stock_quantity,
        } : null,
        subtotal,
      };
    }).filter(item => item.product !== null);

    const totalAmount = processedItems.reduce((acc, curr) => acc + curr.subtotal, 0);

    return NextResponse.json({
      success: true,
      items: processedItems,
      subtotal: totalAmount,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Internal server failure: ${err.message}` },
      { status: 500 }
    );
  }
}

// User Route: POST (add item to cart or increment)
export async function POST(req: NextRequest) {
  try {
    const userCheck = await checkUser();
    if (!userCheck.authenticated) {
      return NextResponse.json({ error: userCheck.error }, { status: userCheck.status });
    }

    const { profileId, supabase } = userCheck;
    const bodyResult = await req.json().catch(() => ({}));
    const parseResult = CartItemAddSchema.safeParse(bodyResult);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failure", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { product_id, quantity } = parseResult.data;

    // 1. Fetch current product details to verify stock limit
    const { data: product, error: prodError } = await supabase
      .from("products")
      .select("id, name, stock_quantity, is_active")
      .eq("id", product_id)
      .maybeSingle();

    if (prodError || !product) {
      return NextResponse.json({ error: "Product not found or unavailable" }, { status: 404 });
    }

    if (!product.is_active) {
      return NextResponse.json({ error: "This product is currently inactive" }, { status: 400 });
    }

    // 2. Fetch existing quantity of this product in user's cart
    const { data: existingCartItem, error: cartError } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", profileId)
      .eq("product_id", product_id)
      .maybeSingle();

    if (cartError) {
      return NextResponse.json({ error: cartError.message }, { status: 500 });
    }

    const currentCartQty = existingCartItem ? existingCartItem.quantity : 0;
    const prospectiveQty = currentCartQty + quantity;

    // Check inventory ceiling limits
    if (prospectiveQty > product.stock_quantity) {
      return NextResponse.json(
        { 
          error: "Insufficient inventory stock", 
          details: `Requested: ${prospectiveQty}, Remaining Stock: ${product.stock_quantity}` 
        },
        { status: 400 }
      );
    }

    let resultCartItem;
    if (existingCartItem) {
      // Upsert increment
      const { data: updatedItem, error: updateErr } = await supabase
        .from("cart_items")
        .update({ quantity: prospectiveQty, updated_at: new Date().toISOString() })
        .eq("id", existingCartItem.id)
        .select()
        .single();

      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }
      resultCartItem = updatedItem;
    } else {
      // Create fresh item
      const { data: newItem, error: createErr } = await supabase
        .from("cart_items")
        .insert({
          user_id: profileId,
          product_id,
          quantity,
        })
        .select()
        .single();

      if (createErr) {
        return NextResponse.json({ error: createErr.message }, { status: 500 });
      }
      resultCartItem = newItem;
    }

    return NextResponse.json({
      success: true,
      message: `${product.name} successfully updated inside cart`,
      item: resultCartItem,
    }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json(
      { error: `Internal server failure: ${err.message}` },
      { status: 500 }
    );
  }
}

// User Route: PUT (modify precise quantity)
export async function PUT(req: NextRequest) {
  try {
    const userCheck = await checkUser();
    if (!userCheck.authenticated) {
      return NextResponse.json({ error: userCheck.error }, { status: userCheck.status });
    }

    const { profileId, supabase } = userCheck;
    const bodyResult = await req.json().catch(() => ({}));
    const parseResult = CartItemUpdateSchema.safeParse(bodyResult);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failure", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { product_id, quantity } = parseResult.data;

    // 1. If target quantity is zero, interpret as removal
    if (quantity === 0) {
      const { data: deletedItem, error: delErr } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", profileId)
        .eq("product_id", product_id)
        .select()
        .maybeSingle();

      if (delErr) {
        return NextResponse.json({ error: delErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Cart item removed completely (quantity requested 0)",
        item: deletedItem,
      });
    }

    // 2. Query stock of the product first for safety
    const { data: product, error: prodErr } = await supabase
      .from("products")
      .select("stock_quantity")
      .eq("id", product_id)
      .maybeSingle();

    if (prodErr || !product) {
      return NextResponse.json({ error: "Product not found or unavailable" }, { status: 404 });
    }

    if (quantity > product.stock_quantity) {
      return NextResponse.json(
        { 
          error: "Insufficient inventory stock", 
          details: `Requested: ${quantity}, Remaining Stock: ${product.stock_quantity}` 
        },
        { status: 400 }
      );
    }

    // 3. Perform update execution
    const { data: updatedItem, error: updateErr } = await supabase
      .from("cart_items")
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq("user_id", profileId)
      .eq("product_id", product_id)
      .select()
      .maybeSingle();

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    if (!updatedItem) {
      return NextResponse.json({ error: "Cart item record not found in your shopping basket" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Cart quantity updated successfully",
      item: updatedItem,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Internal server failure: ${err.message}` },
      { status: 500 }
    );
  }
}

// User Route: DELETE (remove item completely)
export async function DELETE(req: NextRequest) {
  try {
    const userCheck = await checkUser();
    if (!userCheck.authenticated) {
      return NextResponse.json({ error: userCheck.error }, { status: userCheck.status });
    }

    const { profileId, supabase } = userCheck;
    const bodyResult = await req.json().catch(() => ({}));
    const productId = bodyResult.product_id;

    if (!productId) {
      return NextResponse.json({ error: "product_id is required in request body" }, { status: 400 });
    }

    const { data: deletedItem, error: delErr } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", profileId)
      .eq("product_id", productId)
      .select()
      .maybeSingle();

    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 500 });
    }

    if (!deletedItem) {
      return NextResponse.json({ error: "No matching product found in your basket" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Item was deleted from shopping cart successfully",
      item: deletedItem,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Internal server failure: ${err.message}` },
      { status: 500 }
    );
  }
}

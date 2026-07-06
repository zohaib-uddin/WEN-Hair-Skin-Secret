import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient, getSupabaseAdminClient } from "../../../../src/lib/supabase/server";
import { getUserRole } from "../../../../src/lib/utils/getUserRole";
import { ProductUpdateSchema } from "../../../../src/lib/validation";

interface RouteContext {
  params: {
    slug: string; // matches product identifier: slug or UUID-id
  };
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Public: GET a single product details by slug or UUID-id
export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const slugOrId = params.slug;
    const isId = UUID_REGEX.test(slugOrId);
    
    const supabase = await createSupabaseServerClient();
    
    let query = supabase
      .from("products")
      .select("*, categories(id, name, slug)");

    if (isId) {
      query = query.eq("id", slugOrId);
    } else {
      query = query.eq("slug", slugOrId);
    }

    const { data: product, error } = await query.maybeSingle();

    if (error) {
      console.error("GET Single Product Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!product) {
      return NextResponse.json({ error: "Product specification not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err: any) {
    console.error("GET Single Product Catch Error:", err);
    return NextResponse.json(
      { error: `Internal server failure: ${err.message}` },
      { status: 500 }
    );
  }
}

// Admin only: PUT update a product specs using Super-Client to bypass write RLS
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    // 1. Authenticate with Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized: Please login first" }, { status: 401 });
    }

    // 2. Authorize via User Role Checks
    const role = await getUserRole(userId);
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    const slugOrId = params.slug;
    const isId = UUID_REGEX.test(slugOrId);
    
    // 3. Body Parsing and Validation
    const bodyResult = await req.json().catch(() => ({}));
    const parseResult = ProductUpdateSchema.safeParse(bodyResult);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failure", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const validatedData = parseResult.data;
    
    // 4. Update utilizing Super-Client to route paste normal RLS restraints
    const adminSupabaseClient = getSupabaseAdminClient();

    let updateQuery = adminSupabaseClient
      .from("products")
      .update(validatedData);

    if (isId) {
      updateQuery = updateQuery.eq("id", slugOrId);
    } else {
      updateQuery = updateQuery.eq("slug", slugOrId);
    }

    const { data: updatedProduct, error } = await updateQuery
      .select("*, categories(id, name, slug)")
      .maybeSingle();

    if (error) {
      console.error("PUT Product Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found or was deleted" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product specifications updated successfully",
      data: updatedProduct
    });
  } catch (err: any) {
    console.error("PUT Product Catch block Exception:", err);
    return NextResponse.json(
      { error: `Internal server crash: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  return PUT(req, context);
}

// Admin only: DELETE a product inside catalogue
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    // 1. Authenticate with Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized: Please login first" }, { status: 401 });
    }

    // 2. Authorize via User Role checks
    const role = await getUserRole(userId);
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    const slugOrId = params.slug;
    const isId = UUID_REGEX.test(slugOrId);
    
    // 3. Delete utilizing Admin/Service Client directly to avoid RLS limitations
    const adminSupabaseClient = getSupabaseAdminClient();

    let deleteQuery = adminSupabaseClient.from("products").delete();

    if (isId) {
      deleteQuery = deleteQuery.eq("id", slugOrId);
    } else {
      deleteQuery = deleteQuery.eq("slug", slugOrId);
    }

    const { data: deletedProduct, error } = await deleteQuery
      .select()
      .maybeSingle();

    if (error) {
      console.error("DELETE Product Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product specifications not found or already deleted" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Product '${deletedProduct.name}' has been purged from catalog successfully.`,
      product: deletedProduct,
    });
  } catch (err: any) {
    console.error("DELETE Product Catch Block Exception:", err);
    return NextResponse.json(
      { error: `Internal server failure: ${err.message}` },
      { status: 500 }
    );
  }
}

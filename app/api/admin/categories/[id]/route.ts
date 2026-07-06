import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "../../../../../src/lib/auth-helpers";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: {
    id: string;
  };
}

/**
 * Generate a clean standard URL-safe slug from input text.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * PUT/PATCH: Update category attributes by category ID.
 * Secured only to administrators.
 */
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Admin privilege required" },
        { status: adminCheck.status || 403 }
      );
    }

    const categoryId = params.id;
    const { supabase } = adminCheck;
    const body = await req.json().catch(() => ({}));

    // Find if category exists first
    const { data: existingCat, error: findError } = await supabase
      .from("categories")
      .select("id")
      .eq("id", categoryId)
      .maybeSingle();

    if (findError) {
      console.error("[Admin Category Update Check Error]:", findError);
      return NextResponse.json({ error: findError.message }, { status: 500 });
    }

    if (!existingCat) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Build the update map
    const updates: Record<string, any> = {};

    if (body.name !== undefined) {
      updates.name = body.name.trim();
    }
    
    if (body.slug !== undefined) {
      updates.slug = body.slug ? slugify(body.slug) : slugify(body.name || "");
    }

    if (body.description !== undefined) {
      updates.description = body.description ? body.description.trim() : null;
    }

    if (body.image_url !== undefined) {
      updates.image_url = body.image_url ? body.image_url.trim() : null;
    }

    if (body.display_order !== undefined) {
      updates.display_order = typeof body.display_order === "number" ? body.display_order : 0;
    }

    // Attempt the update
    const { data: updatedCategory, error: updateErr } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", categoryId)
      .select()
      .single();

    if (updateErr) {
      console.error("[Admin Category Update Error]:", updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, category: updatedCategory });
  } catch (err: any) {
    console.error("[Admin Category Update System Error]:", err);
    return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  return PUT(req, context);
}

/**
 * DELETE: Delete a category by ID.
 * CRITICAL BUSINESS RULE: Before deleting, check if any products are assigned to this category.
 * If yes, return an error: "Cannot delete category with active products."
 */
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Admin privilege required" },
        { status: adminCheck.status || 403 }
      );
    }

    const categoryId = params.id;
    const { supabase } = adminCheck;

    // 1. Verify if the category exists
    const { data: category, error: categoryCheckErr } = await supabase
      .from("categories")
      .select("id, name")
      .eq("id", categoryId)
      .maybeSingle();

    if (categoryCheckErr) {
      console.error("[Admin Category Delete Check Error]:", categoryCheckErr);
      return NextResponse.json({ error: categoryCheckErr.message }, { status: 500 });
    }

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // 2. CRITICAL PRE-FLIGHT CHECK: Count products assigned to this category
    const { count, error: productsCountErr } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", categoryId);

    if (productsCountErr) {
      console.error("[Admin Category Products Precheck Error]:", productsCountErr);
      return NextResponse.json({ error: productsCountErr.message }, { status: 500 });
    }

    if (count && count > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with active products." },
        { status: 400 }
      );
    }

    // 3. Execution of delete statement
    const { data: deleted, error: deleteErr } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId)
      .select()
      .single();

    if (deleteErr) {
      console.error("[Admin Category Delete Execution Error]:", deleteErr);
      return NextResponse.json({ error: deleteErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Category '${deleted.name}' was purged successfully from botanical databases.`,
      category: deleted,
    });
  } catch (err: any) {
    console.error("[Admin Category DELETE System Error]:", err);
    return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
  }
}

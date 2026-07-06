import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "../../../../src/lib/auth-helpers";

export const dynamic = "force-dynamic";

/**
 * Generate a clean standard URL-safe slug from input text.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove all non-word chars except spaces and dashes
    .replace(/[\s_]+/g, "-")  // Replace spaces and underscores with a single dash
    .replace(/-+/g, "-")      // Replace multiple dashes with a single one
    .replace(/^-+|-+$/g, ""); // Trim dashes from start and end
}

/**
 * GET: Retrieves all categories, ordered by display_order.
 * Secured only to administrators.
 */
export async function GET(req: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Admin privilege required" },
        { status: adminCheck.status || 403 }
      );
    }

    const { supabase } = adminCheck;

    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[Admin Categories GET Error]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, categories });
  } catch (err: any) {
    console.error("[Admin Categories GET System Error]:", err);
    return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
  }
}

/**
 * POST: Register a new category.
 * Secured only to administrators.
 */
export async function POST(req: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Admin privilege required" },
        { status: adminCheck.status || 403 }
      );
    }

    const { supabase } = adminCheck;
    const body = await req.json().catch(() => ({}));

    const { name, description, image_url, display_order } = body;
    let { slug } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    // Auto-generate slug if not specified or empty
    if (!slug || slug.trim() === "") {
      slug = slugify(name);
    } else {
      slug = slugify(slug);
    }

    // Ensure slug is not empty after validation
    if (slug === "") {
      slug = `category-${Date.now()}`;
    }

    // Check for duplicate slug
    const { data: existing, error: checkErr } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (checkErr) {
      console.error("[Admin Categories Duplicate Check Error]:", checkErr);
      return NextResponse.json({ error: checkErr.message }, { status: 500 });
    }

    if (existing) {
      // If slug matches, append custom random suffix to enable smooth creation
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const { data: category, error: insertErr } = await supabase
      .from("categories")
      .insert({
        name: name.trim(),
        slug,
        description: description ? description.trim() : null,
        image_url: image_url ? image_url.trim() : null,
        display_order: typeof display_order === "number" ? display_order : 0,
      })
      .select()
      .single();

    if (insertErr) {
      console.error("[Admin Categories Insert Error]:", insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (err: any) {
    console.error("[Admin Categories POST System Error]:", err);
    return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
  }
}

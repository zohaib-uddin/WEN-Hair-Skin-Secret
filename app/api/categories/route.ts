import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "../../../src/lib/auth-helpers";
import { createSupabaseServerClient } from "../../../src/lib/supabase/server"; // Use server client
import { CategoryInputSchema } from "../../../src/lib/validation";

// Public: GET all categories (ordered by display_order)
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(categories);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Internal server failure: ${err.message}` },
      { status: 500 }
    );
  }
}

// Admin only: POST a new category
export async function POST(req: NextRequest) {
  try {
    const authCheck = await checkAdmin();
    if (!authCheck.isAdmin) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const bodyResult = await req.json().catch(() => ({}));
    const parseResult = CategoryInputSchema.safeParse(bodyResult);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failure", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const validatedData = parseResult.data;
    const { supabase } = authCheck;

    const { data: insertedCategory, error } = await supabase
      .from("categories")
      .insert({
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description || null,
        image_url: validatedData.image_url || null,
        display_order: validatedData.display_order ?? 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(insertedCategory, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Internal server failure: ${err.message}` },
      { status: 500 }
    );
  }
}

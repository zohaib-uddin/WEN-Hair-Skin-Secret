import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "../../../../src/lib/auth-helpers";
import { CategoryUpdateSchema } from "../../../../src/lib/validation";

interface RouteContext {
  params: {
    id: string;
  };
}

// Admin only: PUT/PATCH update category
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const authCheck = await checkAdmin();
    if (!authCheck.isAdmin) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const categoryId = params.id;
    const bodyResult = await req.json().catch(() => ({}));
    const parseResult = CategoryUpdateSchema.safeParse(bodyResult);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Validation failure", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const validatedData = parseResult.data;
    const { supabase } = authCheck;

    const { data: updatedCategory, error } = await supabase
      .from("categories")
      .update(validatedData)
      .eq("id", categoryId)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!updatedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCategory);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Internal server failure: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  return PUT(req, context);
}

// Admin only: DELETE category
export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const authCheck = await checkAdmin();
    if (!authCheck.isAdmin) {
      return NextResponse.json({ error: authCheck.error }, { status: authCheck.status });
    }

    const categoryId = params.id;
    const { supabase } = authCheck;

    const { data: deletedCategory, error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!deletedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Category '${deletedCategory.name}' deleted successfully`,
      category: deletedCategory,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Internal server failure: ${err.message}` },
      { status: 500 }
    );
  }
}

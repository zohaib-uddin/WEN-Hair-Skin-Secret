import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "../../../../src/lib/auth-helpers";
import { createSupabaseServerClient } from "../../../../src/lib/supabase/server";

// PATCH: Approve / Reject review (Admin only)
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { success: false, error: adminCheck.error || "Admin credentials required" },
        { status: adminCheck.status || 403 }
      );
    }

    // Handle both Sync and Async params in Next.js 14/15 envs gracefully
    const resolvedParams = "then" in context.params ? await context.params : context.params;
    const { id: reviewId } = resolvedParams;

    const body = await req.json();
    const { is_approved } = body;

    if (typeof is_approved !== "boolean") {
      return NextResponse.json(
        { success: false, error: "is_approved field is required and must be a boolean" },
        { status: 400 }
      );
    }

    const supabase = adminCheck.supabase || (await createSupabaseServerClient());

    // 1. Fetch current review details to retrieve product_id
    const { data: currentReview, error: fetchErr } = await supabase
      .from("reviews")
      .select("product_id")
      .eq("id", reviewId)
      .maybeSingle();

    if (fetchErr || !currentReview) {
      return NextResponse.json(
        { success: false, error: fetchErr?.message || "Review not found" },
        { status: 404 }
      );
    }

    const productId = currentReview.product_id;

    // 2. Update reviews status
    const { error: updateErr } = await supabase
      .from("reviews")
      .update({ is_approved })
      .eq("id", reviewId);

    if (updateErr) {
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
    }

    // 3. Recalculate average rating and review status count for the parent product
    const { data: approvedReviews, error: reviewsErr } = await supabase
      .from("reviews")
      .select("rating")
      .eq("product_id", productId)
      .eq("is_approved", true);

    if (reviewsErr) {
      return NextResponse.json({ success: false, error: reviewsErr.message }, { status: 500 });
    }

    const count = approvedReviews?.length || 0;
    let avgRating = 0;

    if (count > 0) {
      const sum = approvedReviews.reduce((sumVal, rev) => sumVal + (Number(rev.rating) || 0), 0);
      avgRating = Number((sum / count).toFixed(1));
    }

    // 4. Update the products table
    const { error: prodUpdateErr } = await supabase
      .from("products")
      .update({
        rating: avgRating,
        reviews_count: count
      })
      .eq("id", productId);

    if (prodUpdateErr) {
      return NextResponse.json({ success: false, error: prodUpdateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Review status toggled to ${is_approved ? "APPROVED" : "REJECTED"} and product metrics synchronized.`,
      productId,
      recalculatedRating: avgRating,
      recalculatedCount: count
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

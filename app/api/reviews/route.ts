import { NextRequest, NextResponse } from "next/server";
import { checkUser } from "../../../src/lib/auth-helpers";
import { getSupabaseAdminClient } from "../../../src/lib/supabase/server";

// GET approved reviews for a specific product
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("product_id");

    if (!productId) {
      return NextResponse.json({ error: "Missing required parameter: product_id" }, { status: 400 });
    }

    const adminSupabase = getSupabaseAdminClient();

    // Query all reviews for this product that are approved for public sight
    const { data: reviews, error } = await adminSupabase
      .from("reviews")
      .select(`
        *,
        profiles:user_id ( name )
      `)
      .eq("product_id", productId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Reviews retrieval DB issue:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      reviews: reviews || []
    });
  } catch (err: any) {
    console.error("Reviews GET system exception:", err);
    return NextResponse.json({ error: `Internal server failure: ${err.message}` }, { status: 500 });
  }
}

// POST - allow logged-in user to write a formulation review
export async function POST(req: NextRequest) {
  try {
    const userCheck = await checkUser();
    if (!userCheck.authenticated) {
      return NextResponse.json({ error: userCheck.error }, { status: userCheck.status });
    }

    const { profileId } = userCheck;

    const body = await req.json().catch(() => ({}));
    const { product_id, rating, comment, video_url, before_image, after_image } = body;

    if (!product_id || !rating) {
      return NextResponse.json({ error: "Missing product_id or rating values" }, { status: 400 });
    }

    const score = Number(rating);
    if (isNaN(score) || score < 1 || score > 5) {
      return NextResponse.json({ error: "Rating score must be an integer between 1 and 5" }, { status: 400 });
    }

    const adminSupabase = getSupabaseAdminClient();

    // Sanitize comment to prevent any XSS injection
    const sanitizeStr = (text: string) => {
      if (!text) return text;
      return text
        .replace(/<script[^>]*>([\S\s]*?)<\/script>/gi, "")
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/javascript:/gi, "")
        .trim();
    };

    const sanitizedComment = sanitizeStr(comment || "");

    // Insert review specification with is_approved defaulted to false (requires admin moderation)
    const { data: newReview, error } = await adminSupabase
      .from("reviews")
      .insert({
        product_id,
        user_id: profileId,
        rating: score,
        comment: sanitizedComment,
        video_url: video_url || null,
        before_image: before_image || null,
        after_image: after_image || null,
        is_approved: false
      })
      .select()
      .single();

    if (error) {
      console.error("Reviews inserting database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully! It will be visible once approved by moderators.",
      review: newReview
    }, { status: 201 });
  } catch (err: any) {
    console.error("Reviews POST database insertion exception:", err);
    return NextResponse.json({ error: `Internal server failure: ${err.message}` }, { status: 500 });
  }
}

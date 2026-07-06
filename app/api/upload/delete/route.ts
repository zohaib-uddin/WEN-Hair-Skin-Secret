import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "../../../../src/lib/supabase/server";
import { cloudinary } from "../../../../src/lib/cloudinary/config";

export async function DELETE(req: NextRequest) {
  try {
    // 1. Authenticate with Clerk & query Supabase profiles
    const authSession = await auth();
    const clerkUserId = authSession.userId;

    if (!clerkUserId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized access: Please sign-in first" }), {
        status: 410,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Initialize authenticated Supabase client
    const supabase = await createSupabaseServerClient();
    
    // Check user's role in the database profile
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("role")
      .eq("clerk_id", clerkUserId)
      .maybeSingle();

    if (profileErr || !profile || profile.role !== "admin") {
      return new NextResponse(JSON.stringify({ error: "Forbidden: Only e-commerce Administrators can delete assets" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Extract publicIds from request body
    const body = await req.json();
    const publicIds = body.publicIds as string[];

    if (!publicIds || !Array.isArray(publicIds) || publicIds.length === 0) {
      return new NextResponse(JSON.stringify({ error: "Bad Request: No publicIds array provided in request payload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const deletionReport: Record<string, "ok" | "not_found" | "failed" | string> = {};

    // 3. Process each deletion request asynchronously and securely
    for (const publicId of publicIds) {
      try {
        const destroyResult = await cloudinary.uploader.destroy(publicId);
        deletionReport[publicId] = destroyResult.result; // "ok", "not_found", etc.
      } catch (err: any) {
        console.error(`Error deleting image with publicId ${publicId}:`, err);
        deletionReport[publicId] = `failed: ${err.message || err}`;
      }
    }

    return NextResponse.json({
      success: true,
      results: deletionReport,
    });
  } catch (err: any) {
    console.error("Critical fault inside Cloudinary Delete handler route:", err);
    return new NextResponse(JSON.stringify({ error: `Internal server failure: ${err.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

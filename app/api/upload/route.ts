import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "../../../src/lib/supabase/server";
import { cloudinary } from "../../../src/lib/cloudinary/config";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate with Clerk & query Supabase profiles
    const authSession = await auth();
    const clerkUserId = authSession.userId;

    if (!clerkUserId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized access: Please sign in first" }), {
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
      return new NextResponse(JSON.stringify({ error: "Forbidden: Only e-commerce Administrators can upload assets" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Extract FormData and Files
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return new NextResponse(JSON.stringify({ error: "Bad Request: No files detected in submission payload ('files')" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const uploadResults: Array<{
      secure_url: string;
      public_id: string;
      width: number;
      height: number;
    }> = [];

    // Helper promise function to pipe image Buffer stream securely to Cloudinary
    const streamUpload = (fileBuffer: Buffer): Promise<any> => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "wen-hair-skin/products",
            resource_type: "image",
            transformation: [
              { width: 800, height: 800, crop: "limit", quality: "auto", fetch_format: "auto" }
            ],
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(fileBuffer);
      });
    };

    // 3. Process uploads sequentially
    for (const file of files) {
      if (!file.name) continue;

      // Convert Next.js File object to dynamic binary buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Cloudinary stream
      const result = await streamUpload(buffer);

      uploadResults.push({
        secure_url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
      });
    }

    return NextResponse.json({
      success: true,
      images: uploadResults,
    });
  } catch (err: any) {
    console.error("Critical fault inside Cloudinary Upload handler route:", err);
    return new NextResponse(JSON.stringify({ error: `Internal server failure: ${err.message}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

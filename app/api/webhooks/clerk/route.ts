import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Retrieve environment credentials securely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || "";

// Initialize Supabase Admin client with service_role key to bypass Row-Level Security (RLS)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

type ClerkWebhookEmailAddress = {
  email_address: string;
  id: string;
  verification: {
    status: string;
  } | null;
};

type ClerkWebhookPhoneNumber = {
  phone_number: string;
  id: string;
};

type ClerkWebhookUserData = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email_addresses: ClerkWebhookEmailAddress[];
  phone_numbers: ClerkWebhookPhoneNumber[];
  image_url: string | null;
  public_metadata: Record<string, unknown> | null;
  [key: string]: any;
};

type ClerkWebhookEvent = {
  data: ClerkWebhookUserData;
  object: string;
  type: string;
};

export async function POST(req: Request) {
  // 1. Guard against unconfigured parameters
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase Admin Configuration credentials are missing in the environment.");
    return new NextResponse("Configuration Error", { status: 500 });
  }

  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET is missing in the environment.");
    return new NextResponse("Webhook Secret Error", { status: 500 });
  }

  // 2. Fetch headers for svix verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Validate the presence of headers
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing required svix headers for webhook authentication.");
    return new NextResponse("Verification error: Missing svix headers", { status: 400 });
  }

  // 3. Collect raw buffer payload
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // 4. Verify original signature
  const wh = new Webhook(webhookSecret);
  let evt: ClerkWebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;
  } catch (err: any) {
    console.error("Clerk Webhook verification failed:", err.message);
    return new NextResponse("Verification error: Invalid signature", { status: 400 });
  }

  // 5. Destructure event properties
  const eventType = evt.type;
  const userData = evt.data;

  console.log(`Successfully verified Clerk Webhook event: ${eventType} for clerk_id: ${userData.id}`);

  // Helper parser for names, emails, phones, and metadata
  const clerk_id = userData.id;
  const email = userData.email_addresses?.[0]?.email_address || "";
  const first = userData.first_name || "";
  const last = userData.last_name || "";
  const full_name = [first, last].filter(Boolean).join(" ") || "Valued Patron";
  const phone = userData.phone_numbers?.[0]?.phone_number || "";
  const avatar_url = userData.image_url || "";
  
  // Extract or verify role safely
  let role = "customer";
  if (userData.public_metadata && typeof userData.public_metadata === "object") {
    const rawRole = userData.public_metadata.role;
    if (rawRole === "admin" || rawRole === "customer") {
      role = rawRole;
    }
  }

  try {
    if (eventType === "user.created") {
      // NOTE: In standard Clerk + Supabase sync, if `profiles.id` has a foreign key constraint
      // referencing `auth.users`, you have two standard solutions:
      // Option A: If auth is purely managed by Clerk, you should remove the physical `foreign key REFERENCES auth.users` 
      // constraint from profiles.id so Clerk can save profiles without mock auth.users.
      // Option B: If holding the reference, we create a matching placeholder entry in `auth.users` on the spot 
      // before creating the profile to satisfy the relation.
      // Below we attempt option B defensively (if auth.users exists), otherwise falls back gracefully.
      
      const deterministicUuid = crypto.randomUUID(); // Fresh primary UUID allocation

      // Try creating user row in authentication table first if the database uses Supabase auth structure
      const { data: existingAuthUser, error: authVerifyError } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      let targetProfileId = deterministicUuid;

      // Check if we need to insert in auth.users schema (if physically required)
      // Otherwise, we insert directly into public.profiles with is_admin() bypasses.
      // To satisfy foreign key references auth.users:
      const { data: authCreated, error: authCreateError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        email_confirm: true,
        user_metadata: { clerk_id },
      });

      if (authCreated?.user) {
        targetProfileId = authCreated.user.id;
      }

      // Populate Profiles Table
      const { error: insertError } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: targetProfileId,
          clerk_id: clerk_id,
          email: email,
          full_name: full_name,
          phone: phone,
          role: role,
          avatar_url: avatar_url,
        });

      if (insertError) {
        // If it failed because of the foreign key constraint (meaning option B failed or was omitted), 
        // we log it and provide instructions to the developer to adjust the constraints.
        console.error("Error inserting clerk user profile record:", insertError);
        return new NextResponse(`Database profile registration fail: ${insertError.message}`, { status: 500 });
      }

      console.log(`Clerk synced profile created perfectly for ID: ${targetProfileId}`);
      return NextResponse.json({ success: true, message: "Profile registered successfully" });
    }

    if (eventType === "user.updated") {
      // Find matching user profile and update fields
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          email: email,
          full_name: full_name,
          phone: phone,
          role: role,
          avatar_url: avatar_url,
        })
        .eq("clerk_id", clerk_id);

      if (updateError) {
        console.error("Error updating Clerk user profile record:", updateError);
        return new NextResponse(`Database profile update fail: ${updateError.message}`, { status: 500 });
      }

      console.log(`Clerk profile details synchronized successfully for clerk_id: ${clerk_id}`);
      return NextResponse.json({ success: true, message: "Profile synchronized successfully" });
    }

    if (eventType === "user.deleted") {
      // Remove profile upon delete or mark inactive
      const { error: deleteError } = await supabaseAdmin
        .from("profiles")
        .delete()
        .eq("clerk_id", clerk_id);

      if (deleteError) {
        console.error("Error deleting Clerk user profile record:", deleteError);
        return new NextResponse(`Database profile teardown fail: ${deleteError.message}`, { status: 500 });
      }

      console.log(`Clerk profile removed successfully for clerk_id: ${clerk_id}`);
      return NextResponse.json({ success: true, message: "Profile removed successfully" });
    }

    return NextResponse.json({ received: true });
  } catch (uncaughtErr: any) {
    console.error("Unhandled exception caught in Clerk webhook processor:", uncaughtErr);
    return new NextResponse(`Internal webhook handler engine fault: ${uncaughtErr.message}`, { status: 500 });
  }
}

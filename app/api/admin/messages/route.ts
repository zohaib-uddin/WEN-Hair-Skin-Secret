import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "../../../../src/lib/auth-helpers";
import { getSupabaseAdminClient } from "../../../../src/lib/supabase/server";

// GET all contact inquiries messages for admin feed
export async function GET(req: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const adminSupabase = getSupabaseAdminClient();

    const { data: messages, error } = await adminSupabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin messages retrieval database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, messages: messages || [] });
  } catch (err: any) {
    console.error("Admin messages GET server exception:", err);
    return NextResponse.json({ error: `Internal server failure: ${err.message}` }, { status: 500 });
  }
}

// PATCH - update message status, e.g. mark as read or marked as replied
export async function PATCH(req: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const body = await req.json().catch(() => ({}));
    const { message_id, is_read, replied } = body;

    if (!message_id) {
      return NextResponse.json({ error: "Missing required parameter: message_id" }, { status: 400 });
    }

    const adminSupabase = getSupabaseAdminClient();

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (is_read !== undefined) {
      updateData.is_read = !!is_read;
    }

    if (replied !== undefined) {
      updateData.replied = !!replied;
    }

    const { data: updatedMessage, error } = await adminSupabase
      .from("messages")
      .update(updateData)
      .eq("id", message_id)
      .select()
      .single();

    if (error) {
      console.error("Error updating message in database:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Message updated successfully",
      data: updatedMessage
    });
  } catch (err: any) {
    console.error("Admin messages PATCH server exception:", err);
    return NextResponse.json({ error: `Internal server failure: ${err.message}` }, { status: 500 });
  }
}

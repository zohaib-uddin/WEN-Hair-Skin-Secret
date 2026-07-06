import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "../../../../src/lib/auth-helpers";

export const dynamic = "force-dynamic";

/**
 * GET: Fetch all profiles combined with aggregate transaction statistics.
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

    // Fetch profiles and join on nested orders
    const { data: profiles, error: dbError } = await supabase
      .from("profiles")
      .select(`
        id,
        clerk_id,
        email,
        full_name,
        phone,
        address,
        city,
        role,
        avatar_url,
        created_at,
        orders (
          id,
          total_amount,
          status
        )
      `)
      .order("created_at", { ascending: false });

    if (dbError) {
      console.error("[Admin Users GET Error]:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Map profiles into aggregated metrics
    const formattedUsers = (profiles || []).map((prof: any) => {
      const orders = prof.orders || [];
      // Calculate total order count and total spent from non-cancelled orders
      const totalOrderCount = orders.length;
      const totalSpent = orders
        .filter((o: any) => o.status !== "cancelled")
        .reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0);

      return {
        id: prof.id,
        clerk_id: prof.clerk_id,
        email: prof.email,
        full_name: prof.full_name,
        phone: prof.phone,
        address: prof.address,
        city: prof.city,
        role: prof.role,
        avatar_url: prof.avatar_url,
        created_at: prof.created_at,
        totalOrderCount,
        totalSpent,
      };
    });

    return NextResponse.json({ success: true, users: formattedUsers });
  } catch (err: any) {
    console.error("[Admin Users GET System Error]:", err);
    return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
  }
}

/**
 * PATCH: Update user's role.
 * Secured only to administrators. Enforces self-demotion prevention rules.
 */
export async function PATCH(req: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: adminCheck.error || "Admin privilege required" },
        { status: adminCheck.status || 403 }
      );
    }

    const { supabase, profileId: loggedInAdminProfileId } = adminCheck;
    const body = await req.json().catch(() => ({}));
    const { profile_id, new_role } = body;

    // 1. Inputs Check
    if (!profile_id) {
      return NextResponse.json({ error: "Profile ID (profile_id) is required" }, { status: 400 });
    }

    if (!new_role || !["customer", "admin"].includes(new_role)) {
      return NextResponse.json(
        { error: "Invalid role specified. Role must be 'customer' or 'admin'" },
        { status: 400 }
      );
    }

    // 2. SELF-DEMOTION PREVENTION: Prevent admin from demoting themselves
    if (profile_id === loggedInAdminProfileId && new_role !== "admin") {
      return NextResponse.json(
        { error: "Security Error: You cannot demote yourself. Self-demotion is prevented." },
        { status: 400 }
      );
    }

    // 3. User Existence Check
    const { data: targetUser, error: findError } = await supabase
      .from("profiles")
      .select("id, role, email")
      .eq("id", profile_id)
      .maybeSingle();

    if (findError) {
      console.error("[Admin Users PATCH Fetch Error]:", findError);
      return NextResponse.json({ error: findError.message }, { status: 500 });
    }

    if (!targetUser) {
      return NextResponse.json({ error: "Target user profile not found" }, { status: 404 });
    }

    // 4. Update Statement Execution
    const { data: updatedUser, error: updateErr } = await supabase
      .from("profiles")
      .update({ role: new_role })
      .eq("id", profile_id)
      .select("id, email, role, full_name")
      .single();

    if (updateErr) {
      console.error("[Admin Users PATCH Update Error]:", updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Role for user '${updatedUser.email}' updated successfully to '${updatedUser.role}'`,
      user: updatedUser,
    });
  } catch (err: any) {
    console.error("[Admin Users PATCH System Error]:", err);
    return NextResponse.json({ error: `Internal Server Error: ${err.message}` }, { status: 500 });
  }
}

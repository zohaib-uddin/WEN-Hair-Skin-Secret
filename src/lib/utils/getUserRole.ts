import { getSupabaseAdminClient } from "../supabase/server";

/**
 * Server-side utility to fetch a user's role from the Supabase profiles database.
 * Matches Clerk user IDs with stored profiles.
 * 
 * @param userId - The unique Clerk User Identification String
 * @returns A promise resolving to 'admin', 'customer', or null if not found
 */
export async function getUserRole(userId: string | null | undefined): Promise<"admin" | "customer" | null> {
  if (!userId) return null;

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("clerk_id", userId)
      .maybeSingle();

    if (error || !data) {
      console.warn(`Could not resolve user role for Clerk ID: ${userId}`, error);
      return null;
    }

    return data.role as "admin" | "customer";
  } catch (err) {
    console.error("Failed to query user role from database:", err);
    return null;
  }
}

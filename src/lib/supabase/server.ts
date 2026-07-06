import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";

// Retrieve configuration variables from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "";

/**
 * Creates an authenticated Supabase client for Server Components and Next.js Route Handlers.
 * Employs `@supabase/ssr` and matches standard Next.js App Router cookie paradigms,
 * while automatically attaching the Clerk session JWT for Row-Level Security checks.
 */
export async function createSupabaseServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase server client credentials (URL/Anon Key) are missing in environment context.");
  }

  // Handle cookies store safely (can be dynamic or chunked inside next headers)
  let cookieStore;
  try {
    cookieStore = await cookies();
  } catch (e) {
    // Fallback if accessed in build-time / static page context
  }

  let token = "";
  try {
    const authSession = await auth();
    token = (await authSession.getToken({ template: "supabase" })) || "";
  } catch (e) {
    // If Clerk auth is not accessible in this context
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore?.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore?.set({ name, value, ...options });
        } catch (error) {
          // Can be ignored if called inside Server Components or middleware
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore?.set({ name, value: "", ...options });
        } catch (error) {
          // Can be ignored if called inside Server Components or middleware
        }
      },
    },
    global: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
  });
}

/**
 * Creates an admin-override Supabase client using the secure service_role credentials key.
 * This client completely bypasses Row-Level Security (RLS) policies.
 */
export function getSupabaseAdminClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase Admin secret credentials (URL/Service Key) are missing in secure environment context.");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

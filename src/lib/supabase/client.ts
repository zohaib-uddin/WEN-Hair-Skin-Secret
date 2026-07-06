import { createBrowserClient } from "@supabase/ssr";

// Retrieve configuration variables from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || (import.meta as any).env?.VITE_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase Client Setup Warning: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing."
  );
}

/**
 * Standard, ready-to-use Supabase client for general public queries (anon access).
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

/**
 * Dynamic Browser-side Supabase client with Clerk integration support.
 */
export function getSupabaseBrowserClient(clerkToken?: string) {
  if (!clerkToken) return supabase;
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${clerkToken}`,
      },
    },
  });
}

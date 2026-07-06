import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "./supabase/server";

export async function checkAdmin() {
  const authSession = await auth();
  const userId = authSession.userId;
  if (!userId) {
    return { 
      id: null, 
      isAdmin: false, 
      error: "Unauthorized access: Please sign-in first", 
      status: 401 
    };
  }
  
  try {
    const supabase = await createSupabaseServerClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("clerk_id", userId)
      .maybeSingle();
      
    if (error || !profile || profile.role !== "admin") {
      return { 
        id: userId, 
        isAdmin: false, 
        error: "Forbidden: Admin privilege required", 
        status: 403 
      };
    }
    
    return { id: userId, profileId: profile.id, isAdmin: true, supabase };
  } catch (err: any) {
    return { 
      id: userId, 
      isAdmin: false, 
      error: `Auth check failed: ${err.message}`, 
      status: 500 
    };
  }
}

export async function checkUser() {
  const authSession = await auth();
  const userId = authSession.userId;
  if (!userId) {
    return { 
      id: null, 
      authenticated: false, 
      error: "Unauthorized access: Please sign-in first", 
      status: 401 
    };
  }
  
  try {
    const supabase = await createSupabaseServerClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("clerk_id", userId)
      .maybeSingle();
      
    if (error || !profile) {
      return { 
        id: userId, 
        authenticated: false, 
        error: "Profile not found: Has your profile synced yet?", 
        status: 404 
      };
    }
    
    return { 
      id: userId, 
      profileId: profile.id, 
      role: profile.role, 
      authenticated: true, 
      supabase 
    };
  } catch (err: any) {
    return { 
      id: userId, 
      authenticated: false, 
      error: `User check failed: ${err.message}`, 
      status: 500 
    };
  }
}

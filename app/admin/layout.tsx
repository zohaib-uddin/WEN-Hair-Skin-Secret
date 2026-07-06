import { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserRole } from "../../src/lib/utils/getUserRole";
import AdminLayoutClient from "../../components/admin/AdminLayoutClient";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const { userId } = await auth();

  // 1. If not authenticated, redirect to Sign In
  if (!userId) {
    redirect("/sign-in");
  }

  // 2. Fetch role from database profiles table
  const role = await getUserRole(userId);

  // 3. Reject non-admin profiles with standard server redirect
  if (role !== "admin") {
    redirect("/?error=Admin privileges required");
  }

  // 4. Authorized admins may pass to access components
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}


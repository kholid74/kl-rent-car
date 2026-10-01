import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/admin-auth";
import LoginForm from "./login-form";
import { getDemoSession } from "@/lib/demo-session";

export default async function AdminLoginPage() {
  const session = await getDemoSession();
  if (session?.role === "owner") redirect("/pemilik");
  if (session?.role === "admin" || await getAdminSession()) redirect("/admin");
  return <LoginForm />;
}

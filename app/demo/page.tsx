import { notFound } from "next/navigation";
import { DEMO_MODE } from "@/lib/site";
import LoginForm from "@/app/admin/login/login-form";
import "../admin/admin.css";

export default function DemoPage() {
  if (!DEMO_MODE) notFound();
  return <LoginForm />;
}

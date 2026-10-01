import { redirect } from "next/navigation";

import AdminShell from "@/components/admin/AdminShell";
import { adminWorkspace } from "@/app/demo/actions";
import { readDemo, revision } from "@/lib/demo-store";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let id: string;
  try { id = await adminWorkspace(); } catch { redirect("/demo"); }
  const data = await readDemo(id);
  return <AdminShell initialData={data} initialRevision={revision(data)}>{children}</AdminShell>;
}

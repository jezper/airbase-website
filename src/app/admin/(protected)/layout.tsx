import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await isAuthenticated();

  if (!auth) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

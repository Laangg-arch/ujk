import { ReactNode } from "react";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </AuthGuard>
  );
}

"use client";

import { Bell, Search, UserCircle2, Menu } from "lucide-react";

interface DashboardNavbarProps {
  title?: string;
  subtitle?: string;
}

export default function DashboardNavbar({
  title = "Dashboard",
  subtitle = "Selamat datang di sistem gudang spare part",
}: DashboardNavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <button className="rounded-lg border border-slate-200 p-2 text-slate-700 lg:hidden">
            <Menu size={20} />
          </button>

          <div>
            <h2 className="text-lg font-bold text-slate-900 md:text-xl">
              {title}
            </h2>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
          <UserCircle2 size={22} className="text-slate-700" />
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-slate-800">Admin</p>
            <p className="text-xs text-slate-500">Gudang Spare Part</p>
          </div>
        </div>
      </div>
    </header>
  );
}

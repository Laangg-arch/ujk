// components/Navbar.tsx
"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <Link href="/" className="text-xl font-bold text-slate-800">
            Gudang Spare Part
          </Link>
          <p className="text-sm text-slate-500">
            Sistem pengelolaan stok spare part
          </p>
        </div>

        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}

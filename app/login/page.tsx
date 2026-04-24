// app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/invalid-credential") {
        setError("Email atau password tidak valid.");
      } else if (err.code === "auth/user-not-found") {
        setError("User tidak ditemukan.");
      } else if (err.code === "auth/wrong-password") {
        setError("Password salah.");
      } else {
        setError("Terjadi kesalahan saat login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
          <div className="hidden bg-slate-900 p-10 text-white md:flex md:flex-col md:justify-between">
            <div>
              <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm">
                Gudang Spare Part
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight">
                Selamat datang kembali
              </h1>
              <p className="mt-4 text-slate-300">
                Masuk ke sistem untuk mengelola stok spare part, data barang,
                dan aktivitas gudang dengan lebih efisien.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-300">
                Sistem modern berbasis Next.js, Tailwind CSS, TypeScript, dan
                Firebase.
              </p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="mx-auto w-full max-w-md">
              <h2 className="text-3xl font-bold text-slate-900">Login</h2>
              <p className="mt-2 text-sm text-slate-500">
                Silakan masuk menggunakan akun yang sudah terdaftar.
              </p>

              <form onSubmit={handleLogin} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Masukkan email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-24 text-sm outline-none transition focus:border-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
                    >
                      {showPassword ? "Tutup" : "Lihat"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Sedang login..." : "Login"}
                </button>
              </form>

              <p className="mt-6 text-sm text-slate-500">
                Belum punya akun?{" "}
                <Link
                  href="#"
                  className="font-semibold text-slate-900 hover:underline"
                >
                  Daftar
                </Link>
              </p>

              <div className="mt-8">
                <Link
                  href="/"
                  className="text-sm font-medium text-slate-700 hover:underline"
                >
                  ← Kembali ke halaman utama
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

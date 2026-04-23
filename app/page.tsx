import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Navbar />

      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-xl md:p-14">
          <span className="inline-block rounded-full bg-slate-200 px-4 py-1 text-sm font-medium text-slate-700">
            Welcome
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 md:text-6xl">
            Selamat Datang di <br />
            GALANG SPAREPART
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Sistem sederhana untuk mengelola data spare part dengan lebih rapi,
            cepat, dan mudah digunakan.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-slate-700"
            >
              Login
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

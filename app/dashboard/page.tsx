"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardNavbar from "@/components/NavbarDashboard";
import { AlertTriangle, Package, ShieldCheck, XCircle } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type SparePart = {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  stok: number;
  harga: number;
  status: "Tersedia" | "Menipis" | "Habis";
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardPage() {
  const [spareparts, setSpareparts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSpareparts = async () => {
    setLoading(true);
    setError("");

    try {
      const snapshot = await getDocs(collection(db, "spareparts"));

      const result: SparePart[] = snapshot.docs.map((item) => {
        const data = item.data();

        return {
          id: item.id,
          kode: data.kode ?? "",
          nama: data.nama ?? "",
          kategori: data.kategori ?? "",
          stok: Number(data.stok ?? 0),
          harga: Number(data.harga ?? 0),
          status: data.status ?? "Tersedia",
        };
      });

      setSpareparts(result);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data spare part.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpareparts();
  }, []);

  const totalSparepart = spareparts.length;
  const stokAman = spareparts.filter(
    (item) => item.status === "Tersedia",
  ).length;
  const stokMenipis = spareparts.filter(
    (item) => item.status === "Menipis",
  ).length;
  const stokHabis = spareparts.filter((item) => item.status === "Habis").length;

  const lowStockItems = useMemo(() => {
    return spareparts
      .filter((item) => item.status === "Menipis" || item.status === "Habis")
      .sort((a, b) => a.stok - b.stok);
  }, [spareparts]);

  const latestItems = useMemo(() => {
    return [...spareparts].slice(0, 5);
  }, [spareparts]);

  return (
    <>
      <DashboardNavbar
        title="Dashboard"
        subtitle="Ringkasan data spare part gudang"
      />

      <section className="p-4 md:p-6">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Spare Part</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {loading ? "..." : totalSparepart}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Jumlah seluruh item spare part
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                <Package size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Stok Aman</p>
                <h3 className="mt-2 text-3xl font-bold text-green-600">
                  {loading ? "..." : stokAman}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Spare part dengan stok aman
                </p>
              </div>

              <div className="rounded-xl bg-green-100 p-3 text-green-700">
                <ShieldCheck size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Stok Menipis</p>
                <h3 className="mt-2 text-3xl font-bold text-yellow-600">
                  {loading ? "..." : stokMenipis}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Spare part yang perlu diperhatikan
                </p>
              </div>

              <div className="rounded-xl bg-yellow-100 p-3 text-yellow-700">
                <AlertTriangle size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Stok Habis</p>
                <h3 className="mt-2 text-3xl font-bold text-red-600">
                  {loading ? "..." : stokHabis}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Spare part yang perlu segera restok
                </p>
              </div>

              <div className="rounded-xl bg-red-100 p-3 text-red-700">
                <XCircle size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              Spare Part Perlu Restok
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Daftar spare part dengan stok menipis atau habis
            </p>

            <div className="mt-6 space-y-4">
              {loading ? (
                <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-500">
                  Memuat data...
                </div>
              ) : lowStockItems.length === 0 ? (
                <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-500">
                  Tidak ada spare part dengan stok menipis atau habis.
                </div>
              ) : (
                lowStockItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          {item.nama}
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                          Kode: {item.kode}
                        </p>
                        <p className="text-sm text-slate-500">
                          Kategori: {item.kategori}
                        </p>
                        <p className="text-sm text-slate-500">
                          Harga: {formatRupiah(item.harga)}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          item.status === "Habis"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        Stok: {item.stok}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              Data Spare Part Terbaru
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Ringkasan item spare part yang tersedia di sistem
            </p>

            <div className="mt-6 space-y-4">
              {loading ? (
                <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-500">
                  Memuat data...
                </div>
              ) : latestItems.length === 0 ? (
                <div className="rounded-xl border border-slate-200 p-4 text-sm text-slate-500">
                  Belum ada data spare part.
                </div>
              ) : (
                latestItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          {item.nama}
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                          Kode: {item.kode}
                        </p>
                        <p className="text-sm text-slate-500">
                          Kategori: {item.kategori}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-800">
                          {formatRupiah(item.harga)}
                        </p>
                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === "Tersedia"
                              ? "bg-green-100 text-green-700"
                              : item.status === "Menipis"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

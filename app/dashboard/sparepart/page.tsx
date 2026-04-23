"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardNavbar from "@/components/NavbarDashboard";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type SparePart = {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  stok: number;
  harga: number;
  status: "Tersedia" | "Menipis" | "Habis";
  createdAt?: Timestamp;
};

type FormState = {
  kode: string;
  nama: string;
  kategori: string;
  stok: string;
  harga: string;
};

const initialForm: FormState = {
  kode: "",
  nama: "",
  kategori: "",
  stok: "",
  harga: "",
};

function getStatusFromStock(stock: number): "Tersedia" | "Menipis" | "Habis" {
  if (stock <= 0) return "Habis";
  if (stock <= 5) return "Menipis";
  return "Tersedia";
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SparePartPage() {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SparePart | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sparepartCollection = collection(db, "spareparts");

  const fetchSpareParts = async () => {
    setLoading(true);
    setError("");

    try {
      const q = query(sparepartCollection, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

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
          createdAt: data.createdAt,
        };
      });

      setSpareParts(result);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data spare part.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();

    return spareParts.filter((item) => {
      return (
        item.kode.toLowerCase().includes(keyword) ||
        item.nama.toLowerCase().includes(keyword) ||
        item.kategori.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword)
      );
    });
  }, [spareParts, search]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingItem(null);
    setError("");
  };

  const openAddModal = () => {
    resetForm();
    setSuccess("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: SparePart) => {
    setEditingItem(item);
    setForm({
      kode: item.kode,
      nama: item.nama,
      kategori: item.kategori,
      stok: String(item.stok),
      harga: String(item.harga),
    });
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (
      !form.kode.trim() ||
      !form.nama.trim() ||
      !form.kategori.trim() ||
      !form.stok.trim() ||
      !form.harga.trim()
    ) {
      return "Semua field wajib diisi.";
    }

    const stokNumber = Number(form.stok);
    const hargaNumber = Number(form.harga);

    if (Number.isNaN(stokNumber) || stokNumber < 0) {
      return "Stok harus berupa angka 0 atau lebih.";
    }

    if (Number.isNaN(hargaNumber) || hargaNumber < 0) {
      return "Harga harus berupa angka 0 atau lebih.";
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSaving(true);

    try {
      const stokNumber = Number(form.stok);
      const hargaNumber = Number(form.harga);
      const payload = {
        kode: form.kode.trim(),
        nama: form.nama.trim(),
        kategori: form.kategori.trim(),
        stok: stokNumber,
        harga: hargaNumber,
        status: getStatusFromStock(stokNumber),
      };

      if (editingItem) {
        const docRef = doc(db, "spareparts", editingItem.id);
        await updateDoc(docRef, payload);
        setSuccess("Data spare part berhasil diperbarui.");
      } else {
        await addDoc(sparepartCollection, {
          ...payload,
          createdAt: Timestamp.now(),
        });
        setSuccess("Data spare part berhasil ditambahkan.");
      }

      await fetchSpareParts();
      closeModal();
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan data spare part.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Apakah kamu yakin ingin menghapus spare part ini?",
    );

    if (!confirmDelete) return;

    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      const docRef = doc(db, "spareparts", id);
      await deleteDoc(docRef);
      setSuccess("Data spare part berhasil dihapus.");
      await fetchSpareParts();
    } catch (err) {
      console.error(err);
      setError("Gagal menghapus data spare part.");
    } finally {
      setDeletingId(null);
    }
  };

  const totalItem = spareParts.length;
  const stokAman = spareParts.filter(
    (item) => item.status === "Tersedia",
  ).length;
  const stokMenipis = spareParts.filter(
    (item) => item.status === "Menipis" || item.status === "Habis",
  ).length;

  return (
    <>
      <DashboardNavbar
        title="Data Spare Part"
        subtitle="Kelola seluruh data spare part gudang"
      />

      <section className="p-4 md:p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Daftar Spare Part
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Data item spare part yang tersimpan di Firestore
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                <Search size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari spare part..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-sm outline-none"
                />
              </div>

              <button
                type="button"
                onClick={openAddModal}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
              >
                <Plus size={18} />
                Tambah Spare Part
              </button>
            </div>
          </div>

          {(error || success) && (
            <div className="mt-4 space-y-3">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}
            </div>
          )}

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                    Kode
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                    Nama Spare Part
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                    Kategori
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                    Stok
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                    Harga
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-slate-600">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
                    >
                      Memuat data spare part...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500"
                    >
                      Belum ada data spare part.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="bg-slate-50">
                      <td className="rounded-l-xl px-4 py-4 text-sm text-slate-700">
                        {item.kode}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-800">
                        {item.nama}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {item.kategori}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {item.stok}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {formatRupiah(item.harga)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === "Tersedia"
                              ? "bg-green-100 text-green-700"
                              : item.status === "Menipis"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="rounded-r-xl px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="rounded-lg bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="rounded-lg bg-red-100 p-2 text-red-700 hover:bg-red-200 disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-100 p-4">
              <p className="text-sm text-slate-500">Total Item</p>
              <h4 className="mt-2 text-2xl font-bold text-slate-900">
                {totalItem}
              </h4>
            </div>
            <div className="rounded-xl bg-slate-100 p-4">
              <p className="text-sm text-slate-500">Stok Aman</p>
              <h4 className="mt-2 text-2xl font-bold text-green-600">
                {stokAman}
              </h4>
            </div>
            <div className="rounded-xl bg-slate-100 p-4">
              <p className="text-sm text-slate-500">Stok Menipis / Habis</p>
              <h4 className="mt-2 text-2xl font-bold text-yellow-600">
                {stokMenipis}
              </h4>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingItem ? "Edit Spare Part" : "Tambah Spare Part"}
                </h3>
                <p className="text-sm text-slate-500">
                  Isi data spare part dengan lengkap
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Kode Spare Part
                  </label>
                  <input
                    type="text"
                    value={form.kode}
                    onChange={(e) => handleChange("kode", e.target.value)}
                    placeholder="Contoh: SP-001"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Nama Spare Part
                  </label>
                  <input
                    type="text"
                    value={form.nama}
                    onChange={(e) => handleChange("nama", e.target.value)}
                    placeholder="Masukkan nama spare part"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={form.kategori}
                    onChange={(e) => handleChange("kategori", e.target.value)}
                    placeholder="Contoh: Mesin"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Stok
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.stok}
                    onChange={(e) => handleChange("stok", e.target.value)}
                    placeholder="Masukkan jumlah stok"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Harga
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.harga}
                    onChange={(e) => handleChange("harga", e.target.value)}
                    placeholder="Masukkan harga"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
                >
                  {saving
                    ? "Menyimpan..."
                    : editingItem
                      ? "Update Spare Part"
                      : "Simpan Spare Part"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

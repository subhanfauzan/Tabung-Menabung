import React, { useState, useEffect, useCallback } from "react";
import { transactionService } from "../../services/transactionService";
import { categoryService } from "../../services/categoryService";
import { accountService } from "../../services/accountService";
import { Category, Account } from "../../types";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState(""); // raw numeric string (no dots)
  const [displayAmount, setDisplayAmount] = useState(""); // formatted with dots
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    if (!isOpen) return;
    setIsLoading(true);
    try {
      const [catData, accData] = await Promise.all([
        categoryService.getCategories(),
        accountService.getAccounts(),
      ]);
      setCategories(catData);
      setAccounts(accData);
      // Pre-select first account
      if (accData.length > 0 && !accountId) {
        setAccountId(accData[0].id);
      }
    } catch (err) {
      console.error("Error loading form data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter categories by type
  const filteredCategories = categories.filter((c) => c.type === type);

  // Reset categoryId when type changes
  useEffect(() => {
    setCategoryId("");
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!amount || parseFloat(amount) <= 0) {
      setError("Jumlah harus lebih dari 0");
      return;
    }
    if (!categoryId) {
      setError("Pilih kategori terlebih dahulu");
      return;
    }
    if (!accountId) {
      setError("Pilih akun terlebih dahulu");
      return;
    }

    setIsSubmitting(true);
    try {
      // Combine selected date with current time so relative timestamps are accurate
      const now = new Date();
      const [year, month, day] = date.split("-").map(Number);
      const dateWithTime = new Date(year, month - 1, day, now.getHours(), now.getMinutes(), now.getSeconds());

      await transactionService.createTransaction({
        amount: parseFloat(amount),
        type,
        categoryId,
        accountId,
        date: dateWithTime.toISOString(),
        note: note || undefined,
      });
      // Reset form
      setAmount("");
      setDisplayAmount("");
      setCategoryId("");
      setNote("");
      setDate(new Date().toISOString().split("T")[0]);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal menyimpan transaksi");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center font-display">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Tambah Transaksi
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="material-symbols-outlined animate-spin text-primary text-3xl">
              refresh
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Type Selector */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl gap-1">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  type === "expense"
                    ? "bg-white dark:bg-slate-900 text-rose-500 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                }`}
              >
                <span className="material-symbols-outlined text-sm align-middle mr-1">
                  arrow_upward
                </span>
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  type === "income"
                    ? "bg-white dark:bg-slate-900 text-emerald-500 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                }`}
              >
                <span className="material-symbols-outlined text-sm align-middle mr-1">
                  arrow_downward
                </span>
                Pemasukan
              </button>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Jumlah (Rp)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={displayAmount}
                  onChange={(e) => {
                    // Strip everything except digits
                    const raw = e.target.value.replace(/\D/g, "");
                    setAmount(raw);
                    // Format with dots as thousand separator
                    setDisplayAmount(raw ? Number(raw).toLocaleString("id-ID") : "");
                  }}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-right text-xl font-bold placeholder:text-slate-300 placeholder:font-normal"
                />
              </div>
              {displayAmount && (
                <p className="text-xs text-slate-400 mt-1 text-right">
                  {Number(amount).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Kategori
              </label>
              {filteredCategories.length === 0 ? (
                <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm rounded-xl">
                  Belum ada kategori untuk{" "}
                  {type === "expense" ? "pengeluaran" : "pemasukan"}. Tambahkan
                  dulu di pengaturan.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                  {filteredCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryId(cat.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all gap-1 ${
                        categoryId === cat.id
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/40"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {cat.icon || "category"}
                      </span>
                      <span className="truncate w-full text-center">
                        {cat.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Account */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Dari Akun
              </label>
              {accounts.length === 0 ? (
                <div className="p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm rounded-xl">
                  Belum ada akun. Tambahkan akun terlebih dahulu.
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {accounts.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => setAccountId(acc.id)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                        accountId === acc.id
                          ? "bg-primary text-white border-primary"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/40"
                      }`}
                    >
                      {acc.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Tanggal
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Catatan (Opsional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Tambahkan catatan..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-400"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || filteredCategories.length === 0 || accounts.length === 0}
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${
                type === "expense"
                  ? "bg-rose-500 shadow-rose-200 dark:shadow-rose-900/30 hover:bg-rose-600"
                  : "bg-emerald-500 shadow-emerald-200 dark:shadow-emerald-900/30 hover:bg-emerald-600"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-xl">
                    refresh
                  </span>
                  Menyimpan...
                </span>
              ) : (
                `Simpan ${type === "expense" ? "Pengeluaran" : "Pemasukan"}`
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

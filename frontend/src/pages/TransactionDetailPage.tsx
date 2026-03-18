import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { transactionService } from "../services/transactionService";
import { categoryService } from "../services/categoryService";
import { accountService } from "../services/accountService";
import { Transaction, Category, Account } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";

export const TransactionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Edit form state
  const [editAmount, setEditAmount] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editAccountId, setEditAccountId] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editNote, setEditNote] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [tx, catData, accData] = await Promise.all([
          transactionService.getTransaction(id),
          categoryService.getCategories(),
          accountService.getAccounts(),
        ]);
        setTransaction(tx);
        setCategories(catData);
        setAccounts(accData);
        // Pre-populate edit form
        setEditAmount(String(tx.amount));
        setEditCategoryId(tx.categoryId);
        setEditAccountId(tx.accountId);
        setEditDate(tx.date.split("T")[0]);
        setEditNote(tx.note || "");
      } catch (err) {
        console.error("Error fetching transaction:", err);
        setError("Transaksi tidak ditemukan.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!id || !transaction) return;
    setError("");
    if (!editAmount || parseFloat(editAmount) <= 0) {
      setError("Jumlah harus lebih dari 0");
      return;
    }
    setIsSaving(true);
    try {
      await transactionService.updateTransaction(id, {
        amount: parseFloat(editAmount),
        categoryId: editCategoryId,
        accountId: editAccountId,
        date: editDate,
        note: editNote || undefined,
      });
      navigate("/transactions");
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal menyimpan perubahan");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Hapus transaksi ini? Tindakan tidak dapat dibatalkan.")) return;
    setIsDeleting(true);
    try {
      await transactionService.deleteTransaction(id);
      navigate("/transactions");
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal menghapus transaksi");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
      </div>
    );
  }

  if (!transaction || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-6">
        <span className="material-symbols-outlined text-5xl text-slate-300">error</span>
        <p className="text-slate-500 text-center">{error || "Transaksi tidak ditemukan."}</p>
        <button onClick={() => navigate("/transactions")} className="text-primary font-bold hover:underline">
          Kembali ke Daftar Transaksi
        </button>
      </div>
    );
  }

  const isIncome = transaction.type === "income";
  const filteredCategories = categories.filter((c) => c.type === transaction.type);
  const categoryName = transaction.category?.name || categories.find((c) => c.id === transaction.categoryId)?.name || "Lainnya";
  const accountName = transaction.account?.name || accounts.find((a) => a.id === transaction.accountId)?.name || "Tunai";

  return (
    <div className="w-full relative pb-8 font-display antialiased">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex gap-3 items-center">
            <button
              onClick={() => navigate("/transactions")}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Detail Transaksi
            </h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                isEditing
                  ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              <span className="material-symbols-outlined">{isEditing ? "close" : "edit"}</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Amount Card */}
        <div className={`rounded-3xl p-6 text-white relative overflow-hidden ${isIncome ? "bg-emerald-500" : "bg-rose-500"}`}>
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-10 rounded-full blur-xl"></div>
          <p className="text-white/80 text-sm font-medium mb-2">
            {isIncome ? "Total Pemasukan" : "Total Pengeluaran"}
          </p>
          <p className="text-white text-4xl font-black tracking-tight">
            {isIncome ? "+" : "-"}{formatCurrency(transaction.amount, "IDR")}
          </p>
          <div className="mt-4 flex items-center gap-2 text-white/80 text-sm">
            <span className="material-symbols-outlined text-base">calendar_today</span>
            {formatDate(transaction.date)}
          </div>
        </div>

        {/* Detail Info */}
        {!isEditing ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Kategori</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold text-sm">{categoryName}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Akun</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold text-sm">{accountName}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Tipe</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${isIncome ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"}`}>
                {isIncome ? "Pemasukan" : "Pengeluaran"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Catatan</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold text-sm text-right max-w-[60%]">{transaction.note || "-"}</span>
            </div>
          </div>
        ) : (
          /* Edit Form */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 space-y-5">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Edit Transaksi</h3>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Jumlah (Rp)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">Rp</span>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-right text-xl font-bold"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Kategori</label>
              <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setEditCategoryId(cat.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all gap-1 ${
                      editCategoryId === cat.id
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{cat.icon || "category"}</span>
                    <span className="truncate w-full text-center">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Account */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Akun</label>
              <div className="flex gap-2 flex-wrap">
                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setEditAccountId(acc.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                      editAccountId === acc.id
                        ? "bg-primary text-white border-primary"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {acc.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tanggal</label>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Catatan (Opsional)</label>
              <textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                rows={2}
                placeholder="Tambahkan catatan..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none placeholder:text-slate-400"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-4 rounded-2xl font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 active:scale-[0.98] disabled:opacity-60"
            >
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

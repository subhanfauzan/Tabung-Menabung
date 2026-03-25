import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { accountService } from "../services/accountService";
import { transactionService } from "../services/transactionService";
import { Account, AccountFormData, Transaction } from "../types";
import { formatCurrency, formatDate, formatRelativeTime } from "../utils/formatters";

export const AccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [incomeHistory, setIncomeHistory] = useState<Record<string, Transaction[]>>({});
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);
  const [selectedAccountForHistory, setSelectedAccountForHistory] = useState<Account | null>(null);
  const [formData, setFormData] = useState<AccountFormData>({
    name: "",
    type: "cash",
    currency: "IDR",
  });

  // Transfer modal state
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferForm, setTransferForm] = useState({
    fromAccountId: "",
    toAccountId: "",
    amount: "",
    note: "",
  });
  const [transferError, setTransferError] = useState<string | null>(null);
  const [isTransferLoading, setIsTransferLoading] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const [data, incomes] = await Promise.all([
        accountService.getAccounts(),
        transactionService.getTransactions({ type: "income" }),
      ]);
      setAccounts(data);

      const historyMap: Record<string, Transaction[]> = {};
      incomes.forEach((tx) => {
        if (!historyMap[tx.accountId]) historyMap[tx.accountId] = [];
        historyMap[tx.accountId].push(tx);
      });
      setIncomeHistory(historyMap);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await accountService.createAccount(formData);
      setFormData({ name: "", type: "cash", currency: "IDR" });
      setIsFormVisible(false);
      fetchAccounts();
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  const confirmDelete = async () => {
    if (accountToDelete) {
      try {
        await accountService.deleteAccount(accountToDelete);
        setAccountToDelete(null);
        fetchAccounts();
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  const openTransferModal = () => {
    setTransferForm({
      fromAccountId: accounts.length > 0 ? accounts[0].id : "",
      toAccountId: accounts.length > 1 ? accounts[1].id : "",
      amount: "",
      note: "",
    });
    setTransferError(null);
    setTransferSuccess(null);
    setIsTransferModalOpen(true);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError(null);

    const amount = Number(transferForm.amount);
    if (!transferForm.fromAccountId || !transferForm.toAccountId) {
      setTransferError("Pilih akun asal dan tujuan.");
      return;
    }
    if (transferForm.fromAccountId === transferForm.toAccountId) {
      setTransferError("Akun asal dan tujuan tidak boleh sama.");
      return;
    }
    if (!amount || amount <= 0) {
      setTransferError("Jumlah transfer harus lebih dari 0.");
      return;
    }

    const fromAcc = accounts.find((a) => a.id === transferForm.fromAccountId);
    if (fromAcc && fromAcc.balance < amount) {
      setTransferError(`Saldo ${fromAcc.name} tidak mencukupi (${formatCurrency(fromAcc.balance, "IDR")}).`);
      return;
    }

    try {
      setIsTransferLoading(true);
      const result = await accountService.transfer({
        fromAccountId: transferForm.fromAccountId,
        toAccountId: transferForm.toAccountId,
        amount,
        note: transferForm.note || undefined,
      });
      setTransferSuccess(
        `Berhasil transfer ${formatCurrency(result.amount, "IDR")} dari ${result.fromAccount} ke ${result.toAccount}!`,
      );
      fetchAccounts();
      setTimeout(() => {
        setIsTransferModalOpen(false);
        setTransferSuccess(null);
      }, 2000);
    } catch (err: any) {
      setTransferError(err?.response?.data?.error || "Terjadi kesalahan saat transfer.");
    } finally {
      setIsTransferLoading(false);
    }
  };

  // ── helpers ──────────────────────────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const getGroupLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === today.getTime()) return "Hari ini";
    if (d.getTime() === yesterday.getTime()) return "Kemarin";
    return formatDate(dateStr);
  };

  const groupTransactions = (txs: Transaction[]) =>
    txs.reduce((groups, tx) => {
      const dateStr = tx.date.split("T")[0];
      const label = getGroupLabel(dateStr);
      if (!groups[label]) groups[label] = [];
      groups[label].push(tx);
      return groups;
    }, {} as Record<string, Transaction[]>);

  const getAccountIconInfo = (type: string) => {
    switch (type) {
      case "bank":
        return { icon: "account_balance", color: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" };
      case "ewallet":
        return { icon: "account_balance_wallet", color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" };
      default:
        return { icon: "payments", color: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" };
    }
  };

  const totalKekayaan = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // ─────────────────────────────────────────────────────────

  return (
    <div className="w-full relative pb-8 font-display antialiased">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex gap-3 items-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Daftar Akun</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Transfer Button */}
            {accounts.length >= 2 && (
              <button
                onClick={openTransferModal}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20 transition-colors"
                title="Transfer Antar Akun"
              >
                <span className="material-symbols-outlined">swap_horiz</span>
              </button>
            )}
            {/* Add Account Button */}
            <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                isFormVisible
                  ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              <span className="material-symbols-outlined">{isFormVisible ? "close" : "add"}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto relative z-20 px-4 mt-6">
        {/* Total Kekayaan Card */}
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-6 shadow-xl shadow-primary/20 mb-6 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <p className="text-white/80 text-sm font-medium mb-1">Total Kekayaan</p>
          <h2 className="text-3xl font-black tracking-tight">{formatCurrency(totalKekayaan, "IDR")}</h2>
          {accounts.length >= 2 && (
            <button
              onClick={openTransferModal}
              className="mt-4 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors text-white text-xs font-bold rounded-full px-4 py-2"
            >
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
              Transfer Antar Akun
            </button>
          )}
        </div>

        {/* Form Add Account */}
        {isFormVisible && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 mb-6 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">add_card</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Tambah Akun Baru</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nama Akun</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Mis. BCA, OVO, Dompet"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Jenis Akun</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  >
                    <option value="cash">Tunai (Cash)</option>
                    <option value="bank">Bank</option>
                    <option value="ewallet">E-Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Mata Uang</label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    placeholder="IDR"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-lg shadow-primary/30 active:scale-[0.98]"
              >
                Simpan Akun
              </button>
            </form>
          </div>
        )}

        {/* Account Cards */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
          </div>
        ) : accounts.length === 0 && !isFormVisible ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">account_balance_wallet</span>
            <p className="text-slate-500 font-medium">Belum ada akun terdaftar</p>
            <button
              onClick={() => setIsFormVisible(true)}
              className="mt-4 text-primary font-bold hover:underline"
            >
              Tambah Akun Pertama
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => {
              const info = getAccountIconInfo(account.type);
              return (
                <div
                  key={account.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group hover:border-primary/30 transition-all"
                >
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors"></div>

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${info.color}`}>
                        <span className="material-symbols-outlined text-2xl">{info.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-slate-900 dark:text-slate-100 font-bold text-base">{account.name}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">{account.type}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setAccountToDelete(account.id)}
                      className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center justify-center transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-500/20"
                      title="Hapus Akun"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>

                  <div className="relative z-10 flex justify-between items-end">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Total Saldo</p>
                      <p className="text-slate-900 dark:text-slate-100 font-black text-2xl tracking-tight">
                        {formatCurrency(account.balance, account.currency || "IDR")}
                      </p>
                    </div>
                    <button
                      onClick={() => setExpandedAccountId(expandedAccountId === account.id ? null : account.id)}
                      className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                    >
                      Riwayat Pemasukan
                      <span className="material-symbols-outlined text-[16px]">
                        {expandedAccountId === account.id ? "expand_less" : "expand_more"}
                      </span>
                    </button>
                  </div>

                  {expandedAccountId === account.id && (
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10 animate-fade-in-up">
                      <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4">Pemasukan Terakhir</h4>

                      {!incomeHistory[account.id] || incomeHistory[account.id].length === 0 ? (
                        <p className="text-sm text-slate-400 italic text-center py-2">Belum ada riwayat pemasukan</p>
                      ) : (
                        <div className="space-y-2.5">
                          {incomeHistory[account.id].slice(0, 3).map((tx) => {
                            const dateObj = new Date(tx.date);
                            const formattedDate = dateObj.toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            });
                            return (
                              <div
                                key={tx.id}
                                className="flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 -mx-2 rounded-xl transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[18px]">south_east</span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{tx.note || "Pemasukan"}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                      {formattedDate} • <span className="text-slate-400">{formatRelativeTime(tx.date)}</span>
                                    </p>
                                  </div>
                                </div>
                                <p className="text-sm font-black text-emerald-500">+{formatCurrency(tx.amount, "IDR")}</p>
                              </div>
                            );
                          })}

                          <button
                            onClick={() => setSelectedAccountForHistory(account)}
                            className="block w-full py-2.5 mt-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold text-center rounded-xl transition-colors"
                          >
                            Lihat Semua Pemasukan
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Transfer Modal ─────────────────────────────────── */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !isTransferLoading && setIsTransferModalOpen(false)}
          />
          <div className="bg-white dark:bg-slate-900 rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-md max-h-[90vh] flex flex-col relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-slide-up-bottom sm:animate-fade-in-up">
            {/* Modal header */}
            <div className="px-6 pt-6 pb-0 flex items-center justify-between mb-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
                  <span className="material-symbols-outlined">swap_horiz</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Transfer Antar Akun</h3>
                  <p className="text-xs text-slate-500">Pindahkan saldo secara instan</p>
                </div>
              </div>
              <button
                onClick={() => !isTransferLoading && setIsTransferModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Success state */}
            {transferSuccess ? (
              <div className="px-6 pb-8 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-emerald-500">check_circle</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 font-semibold">{transferSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleTransfer} className="px-6 pb-8 space-y-4 overflow-y-auto flex-1 min-h-0 outline-none overscroll-contain">
                {/* From Account */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Dari Akun
                  </label>
                  <select
                    value={transferForm.fromAccountId}
                    onChange={(e) => setTransferForm({ ...transferForm, fromAccountId: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} — {formatCurrency(a.balance, "IDR")}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Arrow Icon */}
                <div className="flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-violet-500/10 text-violet-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                  </div>
                </div>

                {/* To Account */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Ke Akun
                  </label>
                  <select
                    value={transferForm.toAccountId}
                    onChange={(e) => setTransferForm({ ...transferForm, toAccountId: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                  >
                    {accounts
                      .filter((a) => a.id !== transferForm.fromAccountId)
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} — {formatCurrency(a.balance, "IDR")}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Jumlah Transfer
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={transferForm.amount ? Number(transferForm.amount).toLocaleString('id-ID') : ''}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\./g, '');
                        if (/^\d*$/.test(rawValue)) {
                          setTransferForm({ ...transferForm, amount: rawValue });
                        }
                      }}
                      placeholder="0"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Catatan <span className="text-slate-400 font-normal">(opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={transferForm.note}
                    onChange={(e) => setTransferForm({ ...transferForm, note: e.target.value })}
                    placeholder="Mis. bayar cicilan, tabungan, dll."
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                {/* Error */}
                {transferError && (
                  <div className="flex items-start gap-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-3">
                    <span className="material-symbols-outlined text-red-500 text-[18px] shrink-0 mt-0.5">error</span>
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">{transferError}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isTransferLoading}
                  className="w-full bg-violet-500 hover:bg-violet-600 disabled:opacity-60 text-white font-bold rounded-xl py-3.5 mt-2 transition-all shadow-lg shadow-violet-500/30 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isTransferLoading ? (
                    <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                  )}
                  {isTransferLoading ? "Memproses..." : "Transfer Sekarang"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {accountToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setAccountToDelete(null)}
          />
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-fade-in-up">
            <div className="p-6 pb-0">
              <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-slate-900 shadow-sm">
                <span className="material-symbols-outlined text-rose-500 text-3xl">delete_sweep</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 text-center mb-2">Hapus Akun?</h3>
              <p className="text-sm text-slate-500 text-center px-2">Tindakan ini tidak dapat dibatalkan. Menghapus akun ini juga akan menghapus data yang terkait.</p>
            </div>

            <div className="p-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setAccountToDelete(null)}
                className="flex-1 py-3.5 px-4 rounded-xl font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3.5 px-4 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/30"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Income History Modal */}
      {selectedAccountForHistory && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedAccountForHistory(null)}
          />
          <div className="bg-white dark:bg-slate-900 rounded-t-[2rem] sm:rounded-[2rem] w-full max-w-md max-h-[85vh] sm:max-h-[80vh] relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden animate-slide-up-bottom sm:animate-fade-in-up">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-20">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getAccountIconInfo(selectedAccountForHistory.type).color}`}>
                  <span className="material-symbols-outlined">{getAccountIconInfo(selectedAccountForHistory.type).icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Semua Pemasukan</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Akun: {selectedAccountForHistory.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAccountForHistory(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-5 overflow-y-auto min-h-[300px] flex-1 bg-slate-50/50 dark:bg-slate-900/50">
              {!incomeHistory[selectedAccountForHistory.id] || incomeHistory[selectedAccountForHistory.id].length === 0 ? (
                <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm mt-4">
                  <div className="w-16 h-16 mx-auto bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-slate-300 text-3xl">receipt_long</span>
                  </div>
                  <p className="text-slate-500 font-medium text-sm">Belum ada riwayat pemasukan</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupTransactions(incomeHistory[selectedAccountForHistory.id])).map(([dateLabel, dateTransactions]) => (
                    <div key={dateLabel}>
                      <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 px-2">{dateLabel}</h3>
                      <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
                        {dateTransactions.map((tx, idx) => {
                          const isLast = idx === dateTransactions.length - 1;
                          return (
                            <React.Fragment key={tx.id}>
                              <div className="flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 p-3 rounded-xl transition-colors">
                                <div className="flex items-center gap-3.5">
                                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-0.5">{tx.note || "Pemasukan"}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{formatRelativeTime(tx.date)}</p>
                                  </div>
                                </div>
                                <p className="text-sm font-black text-emerald-500 shrink-0">+{formatCurrency(tx.amount, "IDR")}</p>
                              </div>
                              {!isLast && <div className="h-px bg-slate-100 dark:bg-slate-800 mx-3 my-1" />}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

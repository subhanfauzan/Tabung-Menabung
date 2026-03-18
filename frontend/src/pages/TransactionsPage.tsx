import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { transactionService } from "../services/transactionService";
import { categoryService } from "../services/categoryService";
import { accountService } from "../services/accountService";
import { Transaction, Category, Account } from "../types";
import { formatCurrency, formatDate, formatRelativeTime } from "../utils/formatters";
import { useNow } from "../hooks/useNow";

export const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  useNow(); // tick every 60s to keep relative timestamps fresh
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: "",
    categoryId: "",
    accountId: "",
  });
  const [showFilter, setShowFilter] = useState(false);

  const hasActiveFilter = !!(filter.type || filter.categoryId || filter.accountId);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [transData, catData, accData] = await Promise.all([
        transactionService.getTransactions({
          type: filter.type || undefined,
          categoryId: filter.categoryId || undefined,
          accountId: filter.accountId || undefined,
        }),
        categoryService.getCategories(),
        accountService.getAccounts(),
      ]);

      // Sort globally by date descending
      const sorted = transData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setTransactions(sorted);
      setCategories(catData);
      setAccounts(accData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Group by formatted date with relative labels
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

  const groupedTransactions = transactions.reduce((groups, tx) => {
    const dateStr = tx.date.split("T")[0];
    const label = getGroupLabel(dateStr);
    if (!groups[label]) groups[label] = [];
    groups[label].push(tx);
    return groups;
  }, {} as Record<string, Transaction[]>);

  // Helper icons and colors (consistent with Dashboard)
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('makan') || name.includes('food')) return 'fastfood';
    if (name.includes('transport')) return 'directions_car';
    if (name.includes('belanja') || name.includes('shop')) return 'shopping_bag';
    if (name.includes('tagihan') || name.includes('bill')) return 'receipt_long';
    if (name.includes('hiburan') || name.includes('entertain')) return 'sports_esports';
    return 'category';
  };

  const getCategoryLightColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400', 
      'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400', 
      'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400', 
      'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
      'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="w-full relative pb-8 font-display antialiased">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex gap-3 items-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Riwayat Transaksi</h1>
          </div>
          <button
            onClick={() => setShowFilter((v) => !v)}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors relative ${
              showFilter || hasActiveFilter
                ? "bg-primary text-white"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
            }`}
          >
            <span className="material-symbols-outlined">
              {showFilter ? "filter_list_off" : "filter_list"}
            </span>
            {hasActiveFilter && !showFilter && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full" />
            )}
          </button>
        </div>
      </header>

      {/* Selectors — collapsible */}
      {showFilter && (
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-[64px] z-30">
          <div className="max-w-md mx-auto px-4 py-3 space-y-2.5">

          {/* Row 1: Type toggle chips */}
          <div className="flex gap-2">
            {[
              { value: "", label: "Semua", icon: "receipt_long" },
              { value: "income", label: "Pemasukan", icon: "arrow_downward" },
              { value: "expense", label: "Pengeluaran", icon: "arrow_upward" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter({ ...filter, type: opt.value })}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  filter.type === opt.value
                    ? opt.value === "income"
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200 dark:shadow-none"
                      : opt.value === "expense"
                      ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200 dark:shadow-none"
                      : "bg-primary text-white border-primary shadow-md shadow-primary/20 dark:shadow-none"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>

          {/* Row 2: Category + Account dropdowns */}
          <div className="flex gap-2">
            {/* Category dropdown */}
            <div className="relative flex-1 min-w-0">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="material-symbols-outlined text-[16px] text-slate-400">category</span>
              </span>
              <select
                value={filter.categoryId}
                onChange={(e) => setFilter({ ...filter, categoryId: e.target.value })}
                className={`w-full pl-8 pr-7 py-2 text-xs font-semibold rounded-xl border appearance-none cursor-pointer focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all truncate ${
                  filter.categoryId
                    ? "bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:border-primary/40"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {cat.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="material-symbols-outlined text-[14px] text-slate-400">expand_more</span>
              </span>
            </div>

            {/* Account dropdown */}
            <div className="relative flex-1 min-w-0">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="material-symbols-outlined text-[16px] text-slate-400">account_balance_wallet</span>
              </span>
              <select
                value={filter.accountId}
                onChange={(e) => setFilter({ ...filter, accountId: e.target.value })}
                className={`w-full pl-8 pr-7 py-2 text-xs font-semibold rounded-xl border appearance-none cursor-pointer focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all truncate ${
                  filter.accountId
                    ? "bg-primary/10 text-primary border-primary/30 dark:bg-primary/20 dark:border-primary/40"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Semua Akun</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {acc.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="material-symbols-outlined text-[14px] text-slate-400">expand_more</span>
              </span>
            </div>

            {/* Reset filter (only visible if any active) */}
            {hasActiveFilter && (
              <button
                onClick={() => {
                  setFilter({ type: "", categoryId: "", accountId: "" });
                  setShowFilter(false);
                }}
                className="shrink-0 w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all"
                title="Reset filter"
              >
                <span className="material-symbols-outlined text-[16px]">filter_list_off</span>
              </button>
            )}
          </div>
          </div>

        </div>
      )}

      <div className="max-w-md mx-auto relative z-20">
        {/* Summary Cards */}
        <div className="px-4 mt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-3 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl"></div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <span className="material-symbols-outlined text-xl font-bold">arrow_downward</span>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-0.5">Pemasukan</p>
                <p className="text-slate-900 dark:text-slate-100 font-bold text-sm tracking-tight">{formatCurrency(totalIncome, "IDR")}</p>
              </div>
            </div>
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-3 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-rose-500/5 rounded-full blur-xl"></div>
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <span className="material-symbols-outlined text-xl font-bold">arrow_upward</span>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-0.5">Pengeluaran</p>
                <p className="text-slate-900 dark:text-slate-100 font-bold text-sm tracking-tight">{formatCurrency(totalExpense, "IDR")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="px-4 mt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
            </div>
          ) : Object.keys(groupedTransactions).length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">receipt_long</span>
              <p className="text-slate-500 text-sm">Belum ada transaksi</p>
            </div>
          ) : (
            Object.entries(groupedTransactions).map(([dateLabel, dateTransactions]) => (
              <div key={dateLabel} className="mb-6">
                <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 px-2">
                  {dateLabel}
                </h3>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
                  {dateTransactions.map((tx, idx) => {
                    const isIncome = tx.type === "income";
                    const categoryName = tx.category?.name || "Lainnya";
                    const isLast = idx === dateTransactions.length - 1;

                    return (
                      <React.Fragment key={tx.id}>
                        <Link to={`/transactions/${tx.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              isIncome 
                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' 
                                : getCategoryLightColor(categoryName.length % 5)
                            }`}>
                              <span className="material-symbols-outlined">
                                {isIncome ? 'account_balance_wallet' : getCategoryIcon(categoryName)}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-slate-900 dark:text-slate-100 font-bold text-sm mb-0.5">{categoryName}</h4>
                              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">{tx.note || (isIncome ? "Pemasukan" : "Pengeluaran")} • {tx.account?.name || "Tunai"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className={`font-black text-sm ${isIncome ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'}`}>
                                {isIncome ? '+' : '-'}{formatCurrency(tx.amount, "IDR")}
                              </p>
                              <p className="text-slate-400 text-xs mt-0.5 font-medium">{formatRelativeTime(tx.date)}</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-lg group-hover:text-primary transition-colors">chevron_right</span>
                          </div>
                        </Link>
                        {!isLast && (
                          <div className="h-px bg-slate-100 dark:bg-slate-800 mx-3 my-1"></div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

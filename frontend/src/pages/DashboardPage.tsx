import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNow } from "../hooks/useNow";
import { analyticsService } from "../services/analyticsService";
import { transactionService } from "../services/transactionService";
import { authService } from "../services/authService";
import { formatCurrency, formatRelativeTime } from "../utils/formatters";
import { DashboardSummary, CategoryBreakdown, Transaction, SalaryCycleSummary } from "../types";
import { CHART_COLORS } from "../utils/constants";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine,
} from "recharts";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  useNow(); // tick every 60s to keep relative timestamps fresh
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [salaryCycle, setSalaryCycle] = useState<SalaryCycleSummary | null>(null);
  const [expenseData, setExpenseData] = useState<CategoryBreakdown[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [dailyTrend, setDailyTrend] = useState<{ day: string; pengeluaran: number; pemasukan: number }[]>([]);
  const [consistency, setConsistency] = useState<any>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [tempBudget, setTempBudget] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, expenseBreakdown, allTransactions, consistencyData, cycleData] = await Promise.all([
          analyticsService.getDashboardSummary(),
          analyticsService.getExpenseCategoryBreakdown(),
          transactionService.getTransactions(),
          analyticsService.getDailyConsistency(),
          analyticsService.getSalaryCycleSummary(),
        ]);

        setConsistency(consistencyData);
        setSalaryCycle(cycleData);
        if (consistencyData?.budget) {
          setTempBudget(String(consistencyData.budget));
        }

        setSummary(summaryData);
        // Sort by amount descending, then take top 5
        const sortedExpenses = [...expenseBreakdown].sort((a, b) => b.amount - a.amount);
        setExpenseData(sortedExpenses.slice(0, 5));
        
        // Sort and slice top 5 recent transactions
        const sorted = allTransactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRecentTransactions(sorted.slice(0, 5));

        // Build daily trend for current week (Mon-Sun)
        const now = new Date();
        const startOfWeek = new Date(now);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const trendMap: Record<string, { pengeluaran: number; pemasukan: number; label: string }> = {};
        const daysLabel = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
        for (let i = 0; i < 7; i++) {
          const d = new Date(startOfWeek);
          d.setDate(d.getDate() + i);
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const dt = String(d.getDate()).padStart(2, '0');
          const dateStr = `${y}-${m}-${dt}`;
          trendMap[dateStr] = { pengeluaran: 0, pemasukan: 0, label: daysLabel[i] };
        }

        allTransactions.forEach((tx) => {
          const txDate = new Date(tx.date);
          if (txDate >= startOfWeek && txDate <= endOfWeek) {
            // Local date string to match map keys
            const y = txDate.getFullYear();
            const m = String(txDate.getMonth() + 1).padStart(2, '0');
            const dt = String(txDate.getDate()).padStart(2, '0');
            const dateStr = `${y}-${m}-${dt}`;
            if (trendMap[dateStr]) {
              if (tx.type === "expense") trendMap[dateStr].pengeluaran += tx.amount;
              else trendMap[dateStr].pemasukan += tx.amount;
            }
          }
        });
        
        const trend = Object.values(trendMap).map(({ label, pengeluaran, pemasukan }) => ({ day: label, pengeluaran, pemasukan }));
        setDailyTrend(trend);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-primary">
        <span className="material-symbols-outlined animate-spin text-4xl">refresh</span>
      </div>
    );
  }


  // Helper icons
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
    <div className="w-full relative pb-8">
      {/* Header Area */}
      <header className="bg-primary pt-12 pb-24 px-6 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-white opacity-5 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random`} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white/80 text-xs font-medium mb-0.5">Selamat Datang kembali,</p>
              <h2 className="text-white text-lg font-bold flex items-center gap-2">
                {user?.name || "Pengguna"}
              </h2>
              {/* Streak info */}
              {consistency && consistency.budget > 0 && (
                <div 
                  className="inline-flex items-center gap-1.5 mt-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md px-3 py-1.5 rounded-full cursor-pointer transition-all"
                  onClick={() => setIsBudgetModalOpen(true)}
                  title="Target Harian Aktif"
                >
                  <span className={`material-symbols-outlined text-[16px] ${consistency.streak > 0 ? 'text-orange-400 animate-pulse drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]' : 'text-slate-300'}`}>
                    local_fire_department
                  </span>
                  <span className="text-white text-xs font-bold">Streak: {consistency.streak} Hari</span>
                </div>
              )}
            </div>
          </div>
          <button className="relative w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center backdrop-blur-md transition-colors text-white">
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-primary"></span>
          </button>
        </div>
      </header>

      {/* Main Content (Overlapping) */}
      <div className="relative z-20 px-6 -mt-[4.5rem]">
        
        {/* Banner if budget is 0 */}
        {consistency && consistency.budget === 0 && (
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/15 to-orange-500/15 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-500/20 rounded-3xl p-5 sm:p-6 mb-6 flex flex-col sm:flex-row items-center gap-5 sm:gap-6 shadow-sm backdrop-blur-xl">
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30 text-white relative z-10">
              <span className="material-symbols-outlined text-3xl">local_fire_department</span>
            </div>
            
            <div className="flex-1 min-w-0 text-center sm:text-left z-10">
              <h4 className="text-slate-900 dark:text-slate-100 font-extrabold text-base mb-1.5 tracking-tight">Aktifkan Fitur Streak Harian! 🚀</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-xl mx-auto sm:mx-0">
                Atur target maksimal pengeluaran harian. Kumpulkan <strong className="text-slate-800 dark:text-slate-200">streak api</strong> setiap hari Anda berhasil berhemat di bawah target!
              </p>
            </div>
            
            <div className="shrink-0 w-full sm:w-auto z-10 mt-2 sm:mt-0">
              <button 
                onClick={() => setIsBudgetModalOpen(true)}
                className="w-full sm:w-auto bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold py-3 px-6 rounded-xl shadow-lg shadow-slate-900/20 dark:shadow-white/20 transition-all active:scale-95 flex items-center justify-center gap-2 group"
              >
                <span>Atur Target</span>
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Total Balance Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Saldo</p>
              <h1 className="text-slate-900 dark:text-slate-100 text-3xl sm:text-4xl font-black tracking-tight">{formatCurrency(summary?.balance || 0, "IDR")}</h1>
              {salaryCycle && (
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="material-symbols-outlined text-[14px] text-emerald-500">calendar_month</span>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Periode: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{salaryCycle.periodLabel}</span>
                  </p>
                </div>
              )}
            </div>
            <Link to="/accounts" className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors border border-slate-100 dark:border-slate-700">
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
            </Link>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <span className="material-symbols-outlined text-[14px] font-bold">arrow_downward</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Pemasukan</p>
              </div>
              <p className="text-slate-900 dark:text-slate-100 text-sm font-bold truncate">{formatCurrency(salaryCycle?.income ?? summary?.monthlyIncome ?? 0, "IDR")}</p>
            </div>
            
            <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                  <span className="material-symbols-outlined text-[14px] font-bold">arrow_upward</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Pengeluaran</p>
              </div>
              <p className="text-slate-900 dark:text-slate-100 text-sm font-bold truncate">{formatCurrency(salaryCycle?.expenses ?? summary?.monthlyExpenses ?? 0, "IDR")}</p>
            </div>
          </div>

          <Link to="/transactions" className="w-full py-3.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-200 dark:border-slate-700">
            <span className="material-symbols-outlined text-lg">monitoring</span>
            Lihat Laporan Detail
          </Link>
        </div>

        {/* Quick Actions
        <div className="grid grid-cols-4 gap-4 mt-6">
          <button className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-primary/30 transition-all">
              <span className="material-symbols-outlined text-blue-500 text-2xl group-hover:scale-110 transition-transform">swap_horiz</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Transfer</span>
          </button>
          <button className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-primary/30 transition-all">
              <span className="material-symbols-outlined text-emerald-500 text-2xl group-hover:scale-110 transition-transform">add_card</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Top Up</span>
          </button>
          <button className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-primary/30 transition-all">
              <span className="material-symbols-outlined text-orange-500 text-2xl group-hover:scale-110 transition-transform">receipt</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Tagihan</span>
          </button>
          <button className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-primary/30 transition-all">
              <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-2xl group-hover:scale-110 transition-transform">more_horiz</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Lainnya</span>
          </button>
        </div> */}

        {/* Category Donut Chart */}
        <div className="mt-8 mb-4 flex justify-between items-center">
          <div>
            <h3 className="text-slate-900 dark:text-slate-100 font-bold text-lg">Pengeluaran Periode Ini</h3>
            {salaryCycle && (
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{salaryCycle.periodLabel}</p>
            )}
          </div>
          <Link to="/statistics" className="text-primary text-sm font-semibold hover:underline">Detail</Link>
        </div>

        {/* Salary Date Banner */}
        {salaryCycle && !salaryCycle.salaryDate && (
          <div className="mb-4 flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl">
            <span className="material-symbols-outlined text-emerald-500 text-2xl shrink-0">payments</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Atur Tanggal Gajian</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Aktifkan periode keuangan berbasis siklus gaji Anda</p>
            </div>
            <Link to="/profile" className="shrink-0 text-xs font-bold text-primary hover:underline">Atur →</Link>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
          {expenseData.length === 0 ? (
            <div className="flex flex-col items-center py-8 gap-2">
              <span className="material-symbols-outlined text-4xl text-slate-200 dark:text-slate-700">pie_chart</span>
              <p className="text-sm text-slate-500">Belum ada data pengeluaran bulan ini.</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-4">
              {/* Donut chart */}
              <div className="shrink-0 relative" style={{ width: 160, height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="amount"
                      nameKey="category"
                      stroke="none"
                    >
                      {expenseData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={CHART_COLORS[i % CHART_COLORS.length]}
                          stroke="transparent"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => [formatCurrency(val, "IDR"), "Pengeluaran"]}
                      contentStyle={{ background: "#1e293b", border: "none", borderRadius: 12, color: "#f1f5f9", fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center total label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-[10px] text-slate-400 font-medium leading-tight mb-0.5">Total</p>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight">
                    {formatCurrency(expenseData.reduce((s, c) => s + c.amount, 0), "IDR").replace("Rp", "").trim()}
                  </p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 w-full space-y-3 min-w-0 sm:mt-2">
                {expenseData.map((cat, i) => {
                  const total = expenseData.reduce((s, c) => s + c.amount, 0);
                  const pct = total > 0 ? Math.round((cat.amount / total) * 100) : 0;
                  const color = CHART_COLORS[i % CHART_COLORS.length];
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ background: color, boxShadow: `0 2px 4px ${color}40` }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{cat.category}</span>
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0 ml-1">{pct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {/* Daily Trend Chart */}
        <div className="mt-8 mb-4">
          <h3 className="text-slate-900 dark:text-slate-100 font-bold text-lg">Trend Pemasukan & Pengeluaran Harian</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Minggu ini</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
          
          {dailyTrend.length === 0 || dailyTrend.every(d => d.pengeluaran === 0 && d.pemasukan === 0) ? (
            <div className="flex flex-col items-center py-10 gap-3 relative z-10">
              <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-slate-300 dark:text-slate-600">bar_chart</span>
              </div>
              <p className="text-sm font-medium text-slate-500">Belum ada transaksi minggu ini.</p>
            </div>
          ) : (
            <>
              <div className="h-[220px] w-full mt-2 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyTrend} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barGap={2} barCategoryGap="25%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} opacity={0.6} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                      tickMargin={8}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                      tickMargin={8}
                      tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(1)}jt` : v >= 1000 ? `${(v/1000).toFixed(0)}rb` : String(v)}
                    />
                    <Tooltip
                      formatter={(val: number, name: string) => [formatCurrency(val, "IDR"), name === "pemasukan" ? "Pemasukan" : "Pengeluaran"]}
                      contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "16px", color: "#f8fafc", fontSize: "13px", padding: "12px 16px", boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.3)" }}
                      itemStyle={{ color: "#f8fafc", fontWeight: 700, marginTop: "4px" }}
                      labelStyle={{ color: "#94a3b8", fontSize: "12px", marginBottom: "4px", fontWeight: 500 }}
                      cursor={{ fill: '#f1f5f9', opacity: 0.2 }}
                    />
                    {consistency?.budget > 0 && (
                      <ReferenceLine 
                        y={consistency.budget} 
                        stroke="#f59e0b" 
                        strokeDasharray="4 4" 
                        strokeWidth={2}
                        label={{ position: 'top', value: 'Max/Hari', fill: '#f59e0b', fontSize: 10, fontWeight: 700 }} 
                      />
                    )}
                    <Bar dataKey="pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pengeluaran" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center mt-6 relative z-10 gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold tracking-wide uppercase">Pemasukan</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 rounded-full border border-rose-100 dark:border-rose-500/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                  <span className="text-[11px] text-rose-600 dark:text-rose-400 font-bold tracking-wide uppercase">Pengeluaran</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="mt-8 mb-4 flex justify-between items-end">
          <h3 className="text-slate-900 dark:text-slate-100 font-bold text-lg">Transaksi Terbaru</h3>
          <Link to="/transactions" className="text-primary text-sm font-semibold hover:underline">Lihat Semua</Link>
        </div>

        <div className="space-y-3 mb-8">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">receipt_long</span>
              <p className="text-slate-500 text-sm">Belum ada transaksi</p>
            </div>
          ) : (
            recentTransactions.map((tx) => {
              const isIncome = tx.type === "income";
              // We simulate the category text if nested, otherwise raw string
              const categoryName = (tx as any).category?.name || tx.categoryId || "Lainnya";
              
              return (
                <div key={tx.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-3 group hover:border-primary/30 transition-colors">
                  <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isIncome 
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                      : getCategoryLightColor(categoryName.length % 5)
                  }`}>
                    <span className="material-symbols-outlined text-[24px]">
                      {isIncome ? 'arrow_downward' : getCategoryIcon(categoryName)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-slate-900 dark:text-slate-100 font-bold text-sm mb-0.5 truncate">{categoryName}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate">{formatRelativeTime(tx.date)}{tx.note ? ` • ${tx.note}` : ''}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`font-black text-sm ${isIncome ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount, "IDR")}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

        {/* Budget Modal */}
        {isBudgetModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm shadow-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 relative z-10">Target Pengeluaran Harian</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 relative z-10">Set maksimal pengeluaran harian. Jika pengeluaran di bawah target, Anda mendapat bintang kuning dan streak bertambah 🚀.</p>
              
              <div className="mb-6 relative z-10">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nominal Maksimal (Rp)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Contoh: 500.000"
                    value={tempBudget ? Number(tempBudget).toLocaleString("id-ID") : ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setTempBudget(val);
                    }}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 relative z-10">
                <button 
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  onClick={async () => {
                     try {
                        const budget = Number(tempBudget);
                        await authService.updateProfile({ dailyBudget: budget });
                        // Refetch consistency
                        const con = await analyticsService.getDailyConsistency();
                        setConsistency(con);
                        setIsBudgetModalOpen(false);
                     } catch(e) {
                        console.error("Gagal simpan budget", e);
                     }
                  }}
                  className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-primary/30"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

    </div>
  );
};

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyticsService } from "../services/analyticsService";
import { formatCurrency } from "../utils/formatters";
import { MonthlySummary, CategoryBreakdown } from "../types";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CHART_COLORS } from "../utils/constants";

export const StatisticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [expenseData, setExpenseData] = useState<CategoryBreakdown[]>([]);
  const [trendData, setTrendData] = useState<MonthlySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [, expenseBreakdown, trend] = await Promise.all([
          analyticsService.getDashboardSummary(),
          analyticsService.getExpenseCategoryBreakdown(),
          analyticsService.getMonthlySummaryTrend(6),
        ]);

        setExpenseData(expenseBreakdown);
        setTrendData(trend);
      } catch (error) {
        console.error("Error fetching statistics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Laporan Keuangan</h1>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
            <span className="material-symbols-outlined">download</span>
          </button>
        </div>
      </header>

      <div className="max-w-md mx-auto relative z-20 px-4 mt-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="material-symbols-outlined animate-spin text-primary text-3xl">refresh</span>
          </div>
        ) : (
          <div className="space-y-6">

                        {/* Expense Pie Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-slate-900 dark:text-slate-100 font-bold text-base mb-2">Sebaran Pengeluaran</h3>
              <p className="text-slate-500 text-xs mb-6">Bulan ini</p>
              {expenseData.length > 0 ? (
                <>
                  {/* Donut chart */}
                  <div className="h-56 flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="amount"
                        >
                          {expenseData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="transparent" />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number, _name: string, props: any) => [formatCurrency(value, "IDR"), props.payload.category]}
                          contentStyle={{ background: "#1e293b", border: "none", borderRadius: 12, color: "#f1f5f9", fontSize: 12 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Category breakdown list with rupiah */}
                  <div className="mt-4 space-y-3">
                    {(() => {
                      const total = expenseData.reduce((s, c) => s + c.amount, 0);
                      return expenseData
                        .slice()
                        .sort((a, b) => b.amount - a.amount)
                        .map((cat, i) => {
                          const pct = total > 0 ? Math.round((cat.amount / total) * 100) : 0;
                          const color = CHART_COLORS[expenseData.indexOf(cat) % CHART_COLORS.length];
                          return (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{cat.category}</span>
                                  <div className="flex items-center gap-2 shrink-0 ml-2">
                                    <span className="text-xs text-slate-400 font-medium">{pct}%</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatCurrency(cat.amount, "IDR")}</span>
                                  </div>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                                </div>
                              </div>
                            </div>
                          );
                        });
                    })()}
                    {/* Total */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Total Pengeluaran</span>
                      <span className="text-base font-black text-rose-500">{formatCurrency(expenseData.reduce((s, c) => s + c.amount, 0), "IDR")}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-slate-500 text-sm py-8">Belum ada data pengeluaran.</p>
              )}
            </div>

          
            {/* Monthly Trend Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
              <h3 className="text-slate-900 dark:text-slate-100 font-bold text-base mb-6">Tren Arus Kas (6 Bulan)</h3>
              {trendData.length > 0 ? (
                <div className="h-64 -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(value) => `Rp${value/1000}k`} />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value, "IDR"), ""]} 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                      <Line type="monotone" name="Pemasukan" dataKey="income" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" name="Pengeluaran" dataKey="expenses" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center text-slate-500 text-sm py-8">Belum ada data tren.</p>
              )}
            </div>


          </div>
        )}
      </div>
    </div>
  );
};

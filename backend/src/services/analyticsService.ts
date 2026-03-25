import { prisma } from "../config/database";
import { getStartOfMonth, getEndOfMonth, getSalaryPeriod } from "../utils/helpers";

/**
 * Analytics Service
 * Provides financial data for dashboards and charts
 */
export class AnalyticsService {
  /**
   * Get dashboard summary (balance, income, expenses for current period)
   * Uses salary cycle period if salaryDate is set, otherwise falls back to calendar month.
   */
  static async getDashboardSummary(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    let periodStart: Date;
    let periodEnd: Date;

    if (user?.salaryDate) {
      const period = getSalaryPeriod(user.salaryDate);
      periodStart = period.start;
      periodEnd = period.end;
    } else {
      const now = new Date();
      periodStart = getStartOfMonth(now);
      periodEnd = getEndOfMonth(now);
    }

    // Get total balance across all accounts
    const balanceResult = await prisma.account.aggregate({
      where: { userId },
      _sum: { balance: true },
    });

    // Get income this period
    const incomeResult = await prisma.transaction.aggregate({
      where: {
        userId,
        type: "income",
        date: { gte: periodStart, lte: periodEnd },
      },
      _sum: { amount: true },
    });

    // Get expenses this period
    const expenseResult = await prisma.transaction.aggregate({
      where: {
        userId,
        type: "expense",
        date: { gte: periodStart, lte: periodEnd },
      },
      _sum: { amount: true },
    });

    return {
      balance: balanceResult._sum.balance || 0,
      monthlyIncome: incomeResult._sum.amount || 0,
      monthlyExpenses: expenseResult._sum.amount || 0,
    };
  }

  /**
   * Get salary cycle summary for the current active period
   */
  static async getSalaryCycleSummary(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    let periodStart: Date;
    let periodEnd: Date;
    let periodLabel: string;

    if (user.salaryDate) {
      const period = getSalaryPeriod(user.salaryDate);
      periodStart = period.start;
      periodEnd = period.end;
      periodLabel = period.label;
    } else {
      const now = new Date();
      periodStart = getStartOfMonth(now);
      periodEnd = getEndOfMonth(now);
      const monthNames = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
      periodLabel = `1 ${monthNames[now.getMonth()]} – ${periodEnd.getDate()} ${monthNames[now.getMonth()]}`;
    }

    const incomeResult = await prisma.transaction.aggregate({
      where: { userId, type: "income", date: { gte: periodStart, lte: periodEnd } },
      _sum: { amount: true },
    });

    const expenseResult = await prisma.transaction.aggregate({
      where: { userId, type: "expense", date: { gte: periodStart, lte: periodEnd } },
      _sum: { amount: true },
    });

    return {
      salaryDate: user.salaryDate,
      periodStart: periodStart.toISOString(),
      periodEnd: periodEnd.toISOString(),
      periodLabel,
      income: incomeResult._sum.amount || 0,
      expenses: expenseResult._sum.amount || 0,
    };
  }

  /**
   * Get expense breakdown by category for pie chart
   */
  static async getExpenseCategoryBreakdown(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const breakdown = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        type: "expense",
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });

    // Fetch category names
    const result = await Promise.all(
      breakdown.map(async (item) => {
        const category = await prisma.category.findUnique({
          where: { id: item.categoryId },
        });
        return {
          categoryId: item.categoryId,
          category: category?.name || "Unknown",
          amount: item._sum.amount || 0,
          color: category?.color,
        };
      }),
    );

    return result.filter((item) => item.amount > 0);
  }

  /**
   * Get monthly summary trend (income vs expenses)
   */
  static async getMonthlySummaryTrend(userId: string, months: number = 6) {
    const data = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = getEndOfMonth(monthStart);

      const incomeResult = await prisma.transaction.aggregate({
        where: {
          userId,
          type: "income",
          date: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      });

      const expenseResult = await prisma.transaction.aggregate({
        where: {
          userId,
          type: "expense",
          date: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      });

      data.push({
        month: monthStart.toLocaleString("default", {
          month: "short",
          year: "2-digit",
        }),
        income: incomeResult._sum.amount || 0,
        expenses: expenseResult._sum.amount || 0,
      });
    }

    return data;
  }

  /**
   * Get income breakdown by category
   */
  static async getIncomeCategoryBreakdown(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const breakdown = await prisma.transaction.groupBy({
      by: ["categoryId"],
      where: {
        userId,
        type: "income",
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });

    const result = await Promise.all(
      breakdown.map(async (item) => {
        const category = await prisma.category.findUnique({
          where: { id: item.categoryId },
        });
        return {
          categoryId: item.categoryId,
          category: category?.name || "Unknown",
          amount: item._sum.amount || 0,
          color: category?.color,
        };
      }),
    );

    return result.filter((item) => item.amount > 0);
  }

  /**
   * Get summary for specific date range
   */
  static async getSummaryByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const incomeResult = await prisma.transaction.aggregate({
      where: { userId, type: "income", date: { gte: startDate, lte: endDate } },
      _sum: { amount: true },
    });

    const expenseResult = await prisma.transaction.aggregate({
      where: {
        userId,
        type: "expense",
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
    });

    const income = incomeResult._sum.amount || 0;
    const expenses = expenseResult._sum.amount || 0;

    return {
      income,
      expenses,
      net: income - expenses,
    };
  }

  /**
   * Get daily consistency (budget, star status, and streak)
   * Evaluates the last 7 days for stars, and up to 30 days back for streak
   */
  static async getDailyConsistency(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const budget = user.dailyBudget || 0;
    const history = [];
    let currentStreak = 0;
    let streakBroken = false;
    const daysToCheck = 30;

    const now = new Date();

    for (let i = 0; i < daysToCheck; i++) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() - i);
      targetDate.setHours(0, 0, 0, 0);

      const userStartOfDay = new Date(user.createdAt);
      userStartOfDay.setHours(0, 0, 0, 0);

      if (targetDate < userStartOfDay) {
        break; // Stop checking days before the account was created
      }

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const expenseResult = await prisma.transaction.aggregate({
        where: {
          userId,
          type: "expense",
          date: { gte: targetDate, lte: endOfDay },
        },
        _sum: { amount: true },
      });

      const totalExpense = expenseResult._sum.amount || 0;
      const isUnderBudget = budget > 0 && totalExpense <= budget;

      if (i < 7) {
        history.unshift({
          date: targetDate,
          expense: totalExpense,
          budget,
          isUnderBudget,
        });
      }

      if (!streakBroken) {
        if (budget > 0) {
          if (isUnderBudget) {
            currentStreak++;
          } else {
            streakBroken = true;
          }
        } else {
          streakBroken = true; // No streak logic if budget is 0
        }
      }
    }

    return {
      budget,
      streak: currentStreak,
      history,
    };
  }
}

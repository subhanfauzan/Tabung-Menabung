import api from "./api";
import {
  DashboardSummary,
  CategoryBreakdown,
  MonthlySummary,
  DateRangeSummary,
} from "../types";

export const analyticsService = {
  /**
   * Get dashboard summary
   */
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get("/analytics/summary");
    return response.data;
  },

  /**
   * Get expense category breakdown
   */
  getExpenseCategoryBreakdown: async (
    startDate?: string,
    endDate?: string,
  ): Promise<CategoryBreakdown[]> => {
    const response = await api.get("/analytics/expense-breakdown", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  /**
   * Get income category breakdown
   */
  getIncomeCategoryBreakdown: async (
    startDate?: string,
    endDate?: string,
  ): Promise<CategoryBreakdown[]> => {
    const response = await api.get("/analytics/income-breakdown", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  /**
   * Get monthly summary trend
   */
  getMonthlySummaryTrend: async (
    months: number = 6,
  ): Promise<MonthlySummary[]> => {
    const response = await api.get("/analytics/monthly-trend", {
      params: { months },
    });
    return response.data;
  },

  /**
   * Get date range summary
   */
  getDateRangeSummary: async (
    startDate: string,
    endDate: string,
  ): Promise<DateRangeSummary> => {
    const response = await api.get("/analytics/date-range-summary", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  /**
   * Get daily consistency (budget, star status, and streak)
   */
  getDailyConsistency: async (): Promise<any> => {
    const response = await api.get("/analytics/daily-consistency");
    return response.data;
  },
};

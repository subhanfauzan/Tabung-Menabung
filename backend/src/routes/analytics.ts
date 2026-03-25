import { Router } from "express";
import { AnalyticsController } from "../controllers/analyticsController";
import { authMiddleware } from "../middleware/auth";

export const analyticsRouter = Router();

// Apply auth middleware to all analytics routes
analyticsRouter.use(authMiddleware);

// Analytics routes
analyticsRouter.get("/summary", AnalyticsController.getDashboardSummary);
analyticsRouter.get(
  "/expense-breakdown",
  AnalyticsController.getExpenseBreakdown,
);
analyticsRouter.get(
  "/income-breakdown",
  AnalyticsController.getIncomeBreakdown,
);
analyticsRouter.get(
  "/monthly-trend",
  AnalyticsController.getMonthlySummaryTrend,
);
analyticsRouter.get(
  "/date-range-summary",
  AnalyticsController.getDateRangeSummary,
);
analyticsRouter.get(
  "/daily-consistency",
  AnalyticsController.getDailyConsistency,
);
analyticsRouter.get(
  "/salary-cycle-summary",
  AnalyticsController.getSalaryCycleSummary,
);

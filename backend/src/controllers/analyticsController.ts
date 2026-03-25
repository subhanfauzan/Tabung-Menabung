import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { AnalyticsService } from "../services/analyticsService";
import { getStartOfMonth, getEndOfMonth } from "../utils/helpers";

/**
 * Analytics Controller
 * Handles analytics endpoints
 */
export class AnalyticsController {
  /**
   * Get dashboard summary
   * GET /api/analytics/summary
   */
  static async getDashboardSummary(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const summary = await AnalyticsService.getDashboardSummary(req.userId);
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get expense breakdown by category
   * GET /api/analytics/expense-breakdown?startDate=2024-01-01&endDate=2024-01-31
   */
  static async getExpenseBreakdown(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      let startDate = new Date();
      let endDate = new Date();

      if (req.query.startDate && req.query.endDate) {
        startDate = new Date(req.query.startDate as string);
        endDate = new Date(req.query.endDate as string);
      } else {
        startDate = getStartOfMonth();
        endDate = getEndOfMonth();
      }

      const breakdown = await AnalyticsService.getExpenseCategoryBreakdown(
        req.userId,
        startDate,
        endDate,
      );
      res.json(breakdown);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get income breakdown by category
   * GET /api/analytics/income-breakdown?startDate=2024-01-01&endDate=2024-01-31
   */
  static async getIncomeBreakdown(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      let startDate = new Date();
      let endDate = new Date();

      if (req.query.startDate && req.query.endDate) {
        startDate = new Date(req.query.startDate as string);
        endDate = new Date(req.query.endDate as string);
      } else {
        startDate = getStartOfMonth();
        endDate = getEndOfMonth();
      }

      const breakdown = await AnalyticsService.getIncomeCategoryBreakdown(
        req.userId,
        startDate,
        endDate,
      );
      res.json(breakdown);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get monthly trend
   * GET /api/analytics/monthly-trend?months=6
   */
  static async getMonthlySummaryTrend(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const months = req.query.months
        ? parseInt(req.query.months as string)
        : 6;
      const trend = await AnalyticsService.getMonthlySummaryTrend(
        req.userId,
        months,
      );
      res.json(trend);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get summary by date range
   * GET /api/analytics/date-range-summary?startDate=2024-01-01&endDate=2024-01-31
   */
  static async getDateRangeSummary(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      if (!req.query.startDate || !req.query.endDate) {
        res
          .status(400)
          .json({
            error: "Missing required query parameters: startDate, endDate",
          });
        return;
      }

      const startDate = new Date(req.query.startDate as string);
      const endDate = new Date(req.query.endDate as string);

      const summary = await AnalyticsService.getSummaryByDateRange(
        req.userId,
        startDate,
        endDate,
      );
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get daily consistency
   * GET /api/analytics/daily-consistency
   */
  static async getDailyConsistency(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const consistency = await AnalyticsService.getDailyConsistency(req.userId);
      res.json(consistency);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get salary cycle summary
   * GET /api/analytics/salary-cycle-summary
   */
  static async getSalaryCycleSummary(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const summary = await AnalyticsService.getSalaryCycleSummary(req.userId);
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }
}

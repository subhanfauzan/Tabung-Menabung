import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { TransactionService } from "../services/transactionService";

/**
 * Transaction Controller
 * Handles transaction endpoints
 */
export class TransactionController {
  /**
   * Get all transactions with filters
   * GET /api/transactions
   */
  static async getTransactions(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { startDate, endDate, categoryId, type, accountId } = req.query;

      const filters: any = { userId: req.userId };

      if (startDate && endDate) {
        filters.date = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        };
      }

      if (categoryId) filters.categoryId = categoryId;
      if (type) filters.type = type;
      if (accountId) filters.accountId = accountId;

      const transactions = await TransactionService.getTransactions(filters);
      res.json(transactions);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single transaction
   * GET /api/transactions/:id
   */
  static async getTransaction(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { id } = req.params;
      const transaction = await TransactionService.getTransactionById(
        id,
        req.userId,
      );
      res.json(transaction);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create transaction
   * POST /api/transactions
   */
  static async createTransaction(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { amount, type, categoryId, accountId, date, note } = req.body;

      if (!amount || !type || !categoryId || !accountId || !date) {
        res.status(400).json({
          error:
            "Missing required fields: amount, type, categoryId, accountId, date",
        });
        return;
      }

      const transaction = await TransactionService.createTransaction({
        userId: req.userId,
        amount,
        type,
        categoryId,
        accountId,
        date: new Date(date),
        note,
      });

      res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update transaction
   * PUT /api/transactions/:id
   */
  static async updateTransaction(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { id } = req.params;
      const { amount, type, categoryId, accountId, date, note } = req.body;

      const payload: any = {};
      if (amount !== undefined) payload.amount = amount;
      if (type !== undefined) payload.type = type;
      if (categoryId !== undefined) payload.categoryId = categoryId;
      if (accountId !== undefined) payload.accountId = accountId;
      if (date !== undefined) payload.date = new Date(date);
      if (note !== undefined) payload.note = note;

      const transaction = await TransactionService.updateTransaction(
        id,
        req.userId,
        payload,
      );
      res.json(transaction);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete transaction
   * DELETE /api/transactions/:id
   */
  static async deleteTransaction(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { id } = req.params;
      await TransactionService.deleteTransaction(id, req.userId);
      res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

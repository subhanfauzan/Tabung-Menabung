import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { AccountService } from "../services/accountService";

/**
 * Account Controller
 * Handles account endpoints
 */
export class AccountController {
  /**
   * Get all user accounts
   * GET /api/accounts
   */
  static async getAccounts(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const accounts = await AccountService.getAccounts(req.userId);
      res.json(accounts);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single account
   * GET /api/accounts/:id
   */
  static async getAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { id } = req.params;
      const account = await AccountService.getAccountById(id, req.userId);
      res.json(account);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create account
   * POST /api/accounts
   */
  static async createAccount(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { name, type, currency } = req.body;

      if (!name || !type) {
        res.status(400).json({ error: "Missing required fields: name, type" });
        return;
      }

      const account = await AccountService.createAccount({
        userId: req.userId,
        name,
        type,
        currency,
      });

      res.status(201).json(account);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update account
   * PUT /api/accounts/:id
   */
  static async updateAccount(
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
      const payload = req.body;

      const account = await AccountService.updateAccount(
        id,
        req.userId,
        payload,
      );
      res.json(account);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete account
   * DELETE /api/accounts/:id
   */
  static async deleteAccount(
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
      await AccountService.deleteAccount(id, req.userId);
      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Transfer funds between two accounts
   * POST /api/accounts/transfer
   */
  static async transfer(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { fromAccountId, toAccountId, amount, note } = req.body;

      if (!fromAccountId || !toAccountId) {
        res.status(400).json({ error: "fromAccountId dan toAccountId wajib diisi" });
        return;
      }
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        res.status(400).json({ error: "Jumlah transfer tidak valid" });
        return;
      }

      const result = await AccountService.transferFunds(
        req.userId,
        fromAccountId,
        toAccountId,
        Number(amount),
        note,
      );

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}

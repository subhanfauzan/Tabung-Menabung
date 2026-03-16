import { prisma } from "../config/database";

interface CreateAccountPayload {
  userId: string;
  name: string;
  type: "cash" | "bank" | "ewallet";
  currency?: string;
}

/**
 * Account Service
 * Handles user accounts management
 */
export class AccountService {
  /**
   * Get all user accounts
   */
  static async getAccounts(userId: string) {
    const accounts = await prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return accounts;
  }

  /**
   * Get account by ID
   */
  static async getAccountById(id: string, userId: string) {
    const account = await prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      const error = new Error("Account not found") as any;
      error.status = 404;
      throw error;
    }

    return account;
  }

  /**
   * Create new account
   */
  static async createAccount(payload: CreateAccountPayload) {
    // Check if account with same name already exists
    const existing = await prisma.account.findFirst({
      where: {
        userId: payload.userId,
        name: payload.name,
      },
    });

    if (existing) {
      const error = new Error("Account already exists") as any;
      error.status = 400;
      throw error;
    }

    const account = await prisma.account.create({
      data: {
        ...payload,
        currency: payload.currency || "USD",
      },
    });

    return account;
  }

  /**
   * Update account
   */
  static async updateAccount(
    id: string,
    userId: string,
    payload: Partial<CreateAccountPayload>,
  ) {
    const account = await this.getAccountById(id, userId);

    const updated = await prisma.account.update({
      where: { id },
      data: payload,
    });

    return updated;
  }

  /**
   * Delete account
   */
  static async deleteAccount(id: string, userId: string) {
    const account = await this.getAccountById(id, userId);

    // Check if account has transactions
    const transactionCount = await prisma.transaction.count({
      where: { accountId: id },
    });

    if (transactionCount > 0) {
      const error = new Error("Cannot delete account with transactions") as any;
      error.status = 400;
      throw error;
    }

    await prisma.account.delete({ where: { id } });
  }

  /**
   * Get total balance across all accounts
   */
  static async getTotalBalance(userId: string) {
    const result = await prisma.account.aggregate({
      where: { userId },
      _sum: { balance: true },
    });

    return result._sum.balance || 0;
  }
}

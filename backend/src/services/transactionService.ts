import { prisma } from "../config/database";
import { getStartOfMonth, getEndOfMonth } from "../utils/helpers";

interface CreateTransactionPayload {
  userId: string;
  amount: number;
  type: "income" | "expense";
  categoryId: string;
  accountId: string;
  date: Date;
  note?: string;
}

interface UpdateTransactionPayload {
  amount?: number;
  type?: "income" | "expense";
  categoryId?: string;
  accountId?: string;
  date?: Date;
  note?: string;
}

interface TransactionFilter {
  userId: string;
  type?: "income" | "expense";
  categoryId?: string;
  accountId?: string;
  date?: {
    gte?: Date;
    lte?: Date;
  };
}

/**
 * Transaction Service
 * Handles transaction CRUD operations
 */
export class TransactionService {
  /**
   * Get transactions with filters
   */
  static async getTransactions(filters: TransactionFilter) {
    const transactions = await prisma.transaction.findMany({
      where: filters,
      include: {
        category: true,
        account: true,
      },
      orderBy: { date: "desc" },
    });

    return transactions;
  }

  /**
   * Get transaction by ID
   */
  static async getTransactionById(id: string, userId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
      include: { category: true, account: true },
    });

    if (!transaction) {
      const error = new Error("Transaction not found") as any;
      error.status = 404;
      throw error;
    }

    return transaction;
  }

  /**
   * Create new transaction and update account balance
   */
  static async createTransaction(payload: CreateTransactionPayload) {
    // Verify account belongs to user
    const account = await prisma.account.findFirst({
      where: { id: payload.accountId, userId: payload.userId },
    });

    if (!account) {
      const error = new Error("Account not found") as any;
      error.status = 404;
      throw error;
    }

    // Verify category belongs to user
    const category = await prisma.category.findFirst({
      where: {
        id: payload.categoryId,
        OR: [{ userId: payload.userId }, { userId: null }],
      },
    });

    if (!category) {
      const error = new Error("Category not found") as any;
      error.status = 404;
      throw error;
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: payload.userId,
        amount: payload.amount,
        type: payload.type,
        categoryId: payload.categoryId,
        accountId: payload.accountId,
        date: payload.date,
        note: payload.note,
      },
      include: { category: true, account: true },
    });

    // Update account balance
    const balanceChange =
      payload.type === "income" ? payload.amount : -payload.amount;
    await prisma.account.update({
      where: { id: payload.accountId },
      data: { balance: { increment: balanceChange } },
    });

    return transaction;
  }

  /**
   * Update transaction and adjust account balance
   */
  static async updateTransaction(
    id: string,
    userId: string,
    payload: UpdateTransactionPayload,
  ) {
    const transaction = await this.getTransactionById(id, userId);

    // If type or amount changed, adjust account balance
    if (payload.amount !== undefined || payload.type !== undefined) {
      const oldAmount =
        transaction.type === "income"
          ? transaction.amount
          : -transaction.amount;
      const newAmount =
        (payload.type || transaction.type) === "income"
          ? payload.amount || transaction.amount
          : -(payload.amount || transaction.amount);

      await prisma.account.update({
        where: { id: transaction.accountId },
        data: { balance: { increment: newAmount - oldAmount } },
      });
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: payload,
      include: { category: true, account: true },
    });

    return updated;
  }

  /**
   * Delete transaction and adjust account balance
   */
  static async deleteTransaction(id: string, userId: string) {
    const transaction = await this.getTransactionById(id, userId);

    // Reverse balance change
    const balanceReverse =
      transaction.type === "income" ? -transaction.amount : transaction.amount;

    await prisma.account.update({
      where: { id: transaction.accountId },
      data: { balance: { increment: balanceReverse } },
    });

    await prisma.transaction.delete({ where: { id } });
  }

  /**
   * Get recent transactions for dashboard
   */
  static async getRecentTransactions(userId: string, limit: number = 10) {
    return prisma.transaction.findMany({
      where: { userId },
      include: { category: true, account: true },
      orderBy: { date: "desc" },
      take: limit,
    });
  }
}

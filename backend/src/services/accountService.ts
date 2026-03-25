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
    const existing = await prisma.account.findFirst({
      where: { userId: payload.userId, name: payload.name },
    });

    if (existing) {
      const error = new Error("Account already exists") as any;
      error.status = 400;
      throw error;
    }

    const account = await prisma.account.create({
      data: { ...payload, currency: payload.currency || "IDR" },
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
    await this.getAccountById(id, userId);

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
    await this.getAccountById(id, userId);

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

  /**
   * Transfer funds between two accounts (atomic)
   * Creates an expense on the source account and an income on the destination account.
   */
  static async transferFunds(
    userId: string,
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    note?: string,
  ) {
    if (fromAccountId === toAccountId) {
      const error = new Error("Akun asal dan tujuan tidak boleh sama") as any;
      error.status = 400;
      throw error;
    }

    if (amount <= 0) {
      const error = new Error("Jumlah transfer harus lebih dari 0") as any;
      error.status = 400;
      throw error;
    }

    // Verify both accounts belong to user
    const [fromAccount, toAccount] = await Promise.all([
      prisma.account.findFirst({ where: { id: fromAccountId, userId } }),
      prisma.account.findFirst({ where: { id: toAccountId, userId } }),
    ]);

    if (!fromAccount) {
      const error = new Error("Akun asal tidak ditemukan") as any;
      error.status = 404;
      throw error;
    }
    if (!toAccount) {
      const error = new Error("Akun tujuan tidak ditemukan") as any;
      error.status = 404;
      throw error;
    }

    if (fromAccount.balance < amount) {
      const error = new Error("Saldo tidak mencukupi") as any;
      error.status = 400;
      throw error;
    }

    // Get system transfer categories
    const [catOut, catIn] = await Promise.all([
      prisma.category.findFirst({
        where: { userId: null, name: "Transfer Keluar", type: "expense" },
      }),
      prisma.category.findFirst({
        where: { userId: null, name: "Transfer Masuk", type: "income" },
      }),
    ]);

    if (!catOut || !catIn) {
      const error = new Error(
        "Kategori transfer tidak ditemukan. Jalankan prisma db seed.",
      ) as any;
      error.status = 500;
      throw error;
    }

    const now = new Date();
    const noteOut = note ? `${note} (ke ${toAccount.name})` : `Transfer ke ${toAccount.name}`;
    const noteIn = note ? `${note} (dari ${fromAccount.name})` : `Transfer dari ${fromAccount.name}`;

    // Execute all operations atomically
    const [txOut, txIn] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId,
          accountId: fromAccountId,
          categoryId: catOut.id,
          amount,
          type: "expense",
          date: now,
          note: noteOut,
        },
        include: { category: true, account: true },
      }),
      prisma.transaction.create({
        data: {
          userId,
          accountId: toAccountId,
          categoryId: catIn.id,
          amount,
          type: "income",
          date: now,
          note: noteIn,
        },
        include: { category: true, account: true },
      }),
      prisma.account.update({
        where: { id: fromAccountId },
        data: { balance: { decrement: amount } },
      }),
      prisma.account.update({
        where: { id: toAccountId },
        data: { balance: { increment: amount } },
      }),
    ]);

    return {
      fromTransaction: txOut,
      toTransaction: txIn,
      amount,
      fromAccount: fromAccount.name,
      toAccount: toAccount.name,
    };
  }
}

import api from "./api";
import { Transaction, TransactionFormData } from "../types";

export const transactionService = {
  /**
   * Get all transactions with optional filters
   */
  getTransactions: async (filters?: {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
    type?: string;
    accountId?: string;
  }): Promise<Transaction[]> => {
    const response = await api.get("/transactions", { params: filters });
    return response.data;
  },

  /**
   * Get single transaction
   */
  getTransaction: async (id: string): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  /**
   * Create transaction
   */
  createTransaction: async (
    data: TransactionFormData,
  ): Promise<Transaction> => {
    const response = await api.post("/transactions", data);
    return response.data;
  },

  /**
   * Update transaction
   */
  updateTransaction: async (
    id: string,
    data: Partial<TransactionFormData>,
  ): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  /**
   * Delete transaction
   */
  deleteTransaction: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};

import api from "./api";
import { Account, AccountFormData } from "../types";

export const accountService = {
  getAccounts: async (): Promise<Account[]> => {
    const response = await api.get("/accounts");
    return response.data;
  },

  getAccount: async (id: string): Promise<Account> => {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  },

  createAccount: async (data: AccountFormData): Promise<Account> => {
    const response = await api.post("/accounts", data);
    return response.data;
  },

  updateAccount: async (
    id: string,
    data: Partial<AccountFormData>,
  ): Promise<Account> => {
    const response = await api.put(`/accounts/${id}`, data);
    return response.data;
  },

  deleteAccount: async (id: string): Promise<void> => {
    await api.delete(`/accounts/${id}`);
  },

  /**
   * Transfer funds between two accounts
   */
  transfer: async (payload: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    note?: string;
  }): Promise<{
    fromTransaction: any;
    toTransaction: any;
    amount: number;
    fromAccount: string;
    toAccount: string;
  }> => {
    const response = await api.post("/accounts/transfer", payload);
    return response.data;
  },
};

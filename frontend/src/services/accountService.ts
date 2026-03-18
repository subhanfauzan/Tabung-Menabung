import api from "./api";
import { Account, AccountFormData } from "../types";

export const accountService = {
  /**
   * Get all accounts
   */
  getAccounts: async (): Promise<Account[]> => {
    const response = await api.get("/accounts");
    return response.data;
  },

  /**
   * Get single account
   */
  getAccount: async (id: string): Promise<Account> => {
    const response = await api.get(`/accounts/${id}`);
    return response.data;
  },

  /**
   * Create account
   */
  createAccount: async (data: AccountFormData): Promise<Account> => {
    const response = await api.post("/accounts", data);
    return response.data;
  },

  /**
   * Update account
   */
  updateAccount: async (
    id: string,
    data: Partial<AccountFormData>,
  ): Promise<Account> => {
    const response = await api.put(`/accounts/${id}`, data);
    return response.data;
  },

  /**
   * Delete account
   */
  deleteAccount: async (id: string): Promise<void> => {
    await api.delete(`/accounts/${id}`);
  },
};

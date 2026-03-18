import api from "./api";
import { AuthResponse, User } from "../types";

export const authService = {
  /**
   * Register user
   */
  register: async (
    email: string,
    password: string,
    name: string,
  ): Promise<User> => {
    const response = await api.post("/auth/register", {
      email,
      password,
      name,
    });
    return response.data.user;
  },

  /**
   * Login user
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  /**
   * Get user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  /**
   * Update user profile (name and/or email and/or dailyBudget)
   */
  updateProfile: async (data: { name?: string; email?: string; dailyBudget?: number }): Promise<User> => {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.put("/auth/change-password", { currentPassword, newPassword });
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};

import api from "./api";
import { Category, CategoryFormData } from "../types";

export const categoryService = {
  /**
   * Get all categories
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get("/categories");
    return response.data;
  },

  /**
   * Get categories by type
   */
  getCategoriesByType: async (
    type: "income" | "expense",
  ): Promise<Category[]> => {
    const response = await api.get("/categories", { params: { type } });
    return response.data;
  },

  /**
   * Create custom category
   */
  createCategory: async (data: CategoryFormData): Promise<Category> => {
    const response = await api.post("/categories", data);
    return response.data;
  },

  /**
   * Update category
   */
  updateCategory: async (
    id: string,
    data: Partial<CategoryFormData>,
  ): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  /**
   * Delete category
   */
  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

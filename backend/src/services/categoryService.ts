import { prisma } from "../config/database";

interface CreateCategoryPayload {
  userId: string;
  name: string;
  type: "income" | "expense";
  icon?: string;
  color?: string;
}

/**
 * Category Service
 * Handles category CRUD operations
 */
export class CategoryService {
  /**
   * Get all categories (predefined + user's custom)
   */
  static async getCategories(userId: string) {
    const categories = await prisma.category.findMany({
      where: {
        OR: [{ userId }, { userId: null }],
      },
      orderBy: { name: "asc" },
    });

    return categories;
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: string, userId: string) {
    const category = await prisma.category.findFirst({
      where: {
        id,
        OR: [{ userId }, { userId: null }],
      },
    });

    if (!category) {
      const error = new Error("Category not found") as any;
      error.status = 404;
      throw error;
    }

    return category;
  }

  /**
   * Create custom category for user
   */
  static async createCategory(payload: CreateCategoryPayload) {
    // Check if category already exists for user
    const existing = await prisma.category.findFirst({
      where: {
        userId: payload.userId,
        name: payload.name,
      },
    });

    if (existing) {
      const error = new Error("Category already exists") as any;
      error.status = 400;
      throw error;
    }

    const category = await prisma.category.create({
      data: payload,
    });

    return category;
  }

  /**
   * Update category
   */
  static async updateCategory(
    id: string,
    userId: string,
    payload: Partial<CreateCategoryPayload>,
  ) {
    const category = await this.getCategoryById(id, userId);

    if (category.userId !== userId) {
      const error = new Error("Cannot update predefined categories") as any;
      error.status = 403;
      throw error;
    }

    const updated = await prisma.category.update({
      where: { id },
      data: payload,
    });

    return updated;
  }

  /**
   * Delete category (only custom categories)
   */
  static async deleteCategory(id: string, userId: string) {
    const category = await this.getCategoryById(id, userId);

    if (category.userId !== userId) {
      const error = new Error("Cannot delete predefined categories") as any;
      error.status = 403;
      throw error;
    }

    await prisma.category.delete({ where: { id } });
  }

  /**
   * Get categories by type
   */
  static async getCategoriesByType(userId: string, type: "income" | "expense") {
    return prisma.category.findMany({
      where: {
        type,
        OR: [{ userId }, { userId: null }],
      },
      orderBy: { name: "asc" },
    });
  }
}

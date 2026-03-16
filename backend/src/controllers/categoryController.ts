import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import { CategoryService } from "../services/categoryService";

/**
 * Category Controller
 * Handles category endpoints
 */
export class CategoryController {
  /**
   * Get all categories
   * GET /api/categories
   */
  static async getCategories(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const categories = await CategoryService.getCategories(req.userId);
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get categories by type
   * GET /api/categories?type=income
   */
  static async getCategoriesByType(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { type } = req.query;

      if (!type || (type !== "income" && type !== "expense")) {
        res
          .status(400)
          .json({ error: 'Invalid type. Must be "income" or "expense"' });
        return;
      }

      const categories = await CategoryService.getCategoriesByType(
        req.userId,
        type as "income" | "expense",
      );
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create custom category
   * POST /api/categories
   */
  static async createCategory(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const { name, type, icon, color } = req.body;

      if (!name || !type) {
        res.status(400).json({ error: "Missing required fields: name, type" });
        return;
      }

      const category = await CategoryService.createCategory({
        userId: req.userId,
        name,
        type,
        icon,
        color,
      });

      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update category
   * PUT /api/categories/:id
   */
  static async updateCategory(
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

      const category = await CategoryService.updateCategory(
        id,
        req.userId,
        payload,
      );
      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete category
   * DELETE /api/categories/:id
   */
  static async deleteCategory(
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
      await CategoryService.deleteCategory(id, req.userId);
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

import { Router } from "express";
import { CategoryController } from "../controllers/categoryController";
import { authMiddleware } from "../middleware/auth";

export const categoryRouter = Router();

// Apply auth middleware to all category routes
categoryRouter.use(authMiddleware);

// Category routes
categoryRouter.get("/", CategoryController.getCategories);
categoryRouter.post("/", CategoryController.createCategory);
categoryRouter.put("/:id", CategoryController.updateCategory);
categoryRouter.delete("/:id", CategoryController.deleteCategory);

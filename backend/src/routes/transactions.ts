import { Router } from "express";
import { TransactionController } from "../controllers/transactionController";
import { authMiddleware } from "../middleware/auth";

export const transactionRouter = Router();

// Apply auth middleware to all transaction routes
transactionRouter.use(authMiddleware);

// Transaction routes
transactionRouter.get("/", TransactionController.getTransactions);
transactionRouter.get("/:id", TransactionController.getTransaction);
transactionRouter.post("/", TransactionController.createTransaction);
transactionRouter.put("/:id", TransactionController.updateTransaction);
transactionRouter.delete("/:id", TransactionController.deleteTransaction);

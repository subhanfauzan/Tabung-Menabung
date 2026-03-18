import { Router } from "express";
import { AccountController } from "../controllers/accountController";
import { authMiddleware } from "../middleware/auth";

export const accountRouter = Router();

// Apply auth middleware to all account routes
accountRouter.use(authMiddleware);

// Account routes
accountRouter.get("/", AccountController.getAccounts);
accountRouter.get("/:id", AccountController.getAccount);
accountRouter.post("/", AccountController.createAccount);
accountRouter.put("/:id", AccountController.updateAccount);
accountRouter.delete("/:id", AccountController.deleteAccount);

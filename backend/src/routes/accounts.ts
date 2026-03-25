import { Router } from "express";
import { AccountController } from "../controllers/accountController";
import { authMiddleware } from "../middleware/auth";

export const accountRouter = Router();

// Apply auth middleware to all account routes
accountRouter.use(authMiddleware);

// Account routes
accountRouter.get("/", AccountController.getAccounts);
accountRouter.post("/transfer", AccountController.transfer);
accountRouter.post("/", AccountController.createAccount);
accountRouter.get("/:id", AccountController.getAccount);
accountRouter.put("/:id", AccountController.updateAccount);
accountRouter.delete("/:id", AccountController.deleteAccount);

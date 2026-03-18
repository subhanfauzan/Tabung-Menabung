import { Router } from "express";
import { authRouter } from "./auth";
import { transactionRouter } from "./transactions";
import { categoryRouter } from "./categories";
import { accountRouter } from "./accounts";
import { analyticsRouter } from "./analytics";

const router = Router();

// Mount all route handlers
router.use("/auth", authRouter);
router.use("/transactions", transactionRouter);
router.use("/categories", categoryRouter);
router.use("/accounts", accountRouter);
router.use("/analytics", analyticsRouter);

export default router;

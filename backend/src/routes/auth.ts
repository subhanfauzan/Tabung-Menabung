import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

export const authRouter = Router();

// Public routes
authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.post("/logout", AuthController.logout);

// Protected routes
authRouter.get("/profile", authMiddleware, AuthController.getProfile);
authRouter.put("/profile", authMiddleware, AuthController.updateProfile);
authRouter.put("/change-password", authMiddleware, AuthController.changePassword);

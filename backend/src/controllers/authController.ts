import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";
import { AuthRequest } from "../middleware/auth";

/**
 * Authentication Controller
 * Handles auth endpoints
 */
export class AuthController {
  /**
   * Register new user
   * POST /api/auth/register
   */
  static async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        res
          .status(400)
          .json({ error: "Missing required fields: email, password, name" });
        return;
      }

      const user = await AuthService.register({ email, password, name });
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  static async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res
          .status(400)
          .json({ error: "Missing required fields: email, password" });
        return;
      }

      const { accessToken, refreshToken, user } = await AuthService.login({
        email,
        password,
      });

      res.json({
        accessToken,
        refreshToken,
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user profile
   * GET /api/auth/profile
   */
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const profile = await AuthService.getProfile(req.userId);
      res.json(profile);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  static async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Client-side should delete token from localStorage
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update profile (name and/or email)
   * PUT /api/auth/profile
   */
  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const { name, email, dailyBudget, salaryDate } = req.body;
      if (name === undefined && email === undefined && dailyBudget === undefined && salaryDate === undefined) {
        res.status(400).json({ error: "Provide data to update" });
        return;
      }
      const updated = await AuthService.updateProfile(req.userId, { name, email, dailyBudget, salaryDate });
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change password
   * PUT /api/auth/change-password
   */
  static async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        res.status(400).json({ error: "currentPassword and newPassword are required" });
        return;
      }
      if (newPassword.length < 8) {
        res.status(400).json({ error: "Kata sandi baru minimal 8 karakter" });
        return;
      }
      const result = await AuthService.changePassword(req.userId, currentPassword, newPassword);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

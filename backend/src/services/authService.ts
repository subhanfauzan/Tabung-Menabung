import { prisma } from "../config/database";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Authentication Service
 * Handles user registration, login, and token management
 */
export class AuthService {
  /**
   * Register new user and create default categories
   */
  static async register(payload: RegisterPayload) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existingUser) {
      const error = new Error("User already exists") as any;
      error.status = 400;
      throw error;
    }

    // Hash password
    const hashedPassword = await hashPassword(payload.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        name: payload.name,
      },
    });

    // Create predefined categories for user
    await this.createDefaultCategories(user.id);

    // Create default account
    await prisma.account.create({
      data: {
        userId: user.id,
        name: "Cash",
        type: "cash",
        balance: 0,
      },
    });

    return { id: user.id, email: user.email, name: user.name, dailyBudget: user.dailyBudget };
  }

  /**
   * Login user and return JWT tokens
   */
  static async login(payload: LoginPayload) {
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      const error = new Error("Invalid credentials") as any;
      error.status = 401;
      throw error;
    }

    // Verify password
    const isPasswordValid = await comparePassword(
      payload.password,
      user.password,
    );

    if (!isPasswordValid) {
      const error = new Error("Invalid credentials") as any;
      error.status = 401;
      throw error;
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, dailyBudget: user.dailyBudget },
    };
  }

  /**
   * Get user profile by ID
   */
  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, dailyBudget: true, createdAt: true },
    });

    if (!user) {
      const error = new Error("User not found") as any;
      error.status = 404;
      throw error;
    }

    return user;
  }

  /**
   * Update user profile (name and/or email)
   */
  static async updateProfile(userId: string, payload: { name?: string; email?: string, dailyBudget?: number }) {
    if (payload.email) {
      // Check email is not taken by another user
      const existing = await prisma.user.findUnique({ where: { email: payload.email } });
      if (existing && existing.id !== userId) {
        const error = new Error("Email already in use") as any;
        error.status = 400;
        throw error;
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: payload,
      select: { id: true, email: true, name: true, dailyBudget: true, createdAt: true },
    });

    return user;
  }

  /**
   * Change password — verify old password then update
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const error = new Error("User not found") as any;
      error.status = 404;
      throw error;
    }

    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) {
      const error = new Error("Kata sandi lama tidak sesuai") as any;
      error.status = 400;
      throw error;
    }

    const hashed = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    return { message: "Password updated successfully" };
  }
  private static async createDefaultCategories(userId: string) {
    const defaultCategories = [
      { name: "Food", type: "expense", icon: "🍔", color: "#FF6B6B" },
      { name: "Transport", type: "expense", icon: "🚗", color: "#4ECDC4" },
      { name: "Bills", type: "expense", icon: "💳", color: "#FFE66D" },
      { name: "Shopping", type: "expense", icon: "🛍️", color: "#95E1D3" },
      { name: "Entertainment", type: "expense", icon: "🎬", color: "#C9A0DC" },
      { name: "Salary", type: "income", icon: "💰", color: "#38ADA9" },
      { name: "Freelance", type: "income", icon: "👨‍💻", color: "#78FD6C" },
      { name: "Investment", type: "income", icon: "📈", color: "#FFA502" },
    ];

    await Promise.all(
      defaultCategories.map((cat) =>
        prisma.category.create({
          data: {
            userId,
            ...cat,
          },
        }),
      ),
    );
  }
}

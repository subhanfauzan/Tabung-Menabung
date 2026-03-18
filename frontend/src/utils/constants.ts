// API base URL
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3003/api";

// Transaction types
export const TRANSACTION_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;

// Account types
export const ACCOUNT_TYPES = {
  CASH: "cash",
  BANK: "bank",
  EWALLET: "ewallet",
} as const;

// Predefined categories
export const DEFAULT_CATEGORIES = {
  EXPENSE: [
    { name: "Food", type: "expense", icon: "🍔", color: "#FF6B6B" },
    { name: "Transport", type: "expense", icon: "🚗", color: "#4ECDC4" },
    { name: "Bills", type: "expense", icon: "💳", color: "#FFE66D" },
    { name: "Shopping", type: "expense", icon: "🛍️", color: "#95E1D3" },
    { name: "Entertainment", type: "expense", icon: "🎬", color: "#C9A0DC" },
  ],
  INCOME: [
    { name: "Salary", type: "income", icon: "💰", color: "#38ADA9" },
    { name: "Freelance", type: "income", icon: "👨‍💻", color: "#78FD6C" },
    { name: "Investment", type: "income", icon: "📈", color: "#FFA502" },
  ],
};

// Colors for charts
export const CHART_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // amber
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#14b8a6", // teal
];

// Local storage keys
export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
} as const;

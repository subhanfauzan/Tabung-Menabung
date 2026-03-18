// User types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
  account?: Account;
}

// Category types
export interface Category {
  id: string;
  userId?: string | null;
  name: string;
  type: "income" | "expense";
  icon?: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Account types
export interface Account {
  id: string;
  userId: string;
  name: string;
  type: "cash" | "bank" | "ewallet";
  balance: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

// Analytics types
export interface DashboardSummary {
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface CategoryBreakdown {
  categoryId: string;
  category: string;
  amount: number;
  color?: string;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expenses: number;
}

export interface DateRangeSummary {
  income: number;
  expenses: number;
  net: number;
}

// Form types
export interface TransactionFormData {
  amount: number;
  type: "income" | "expense";
  categoryId: string;
  accountId: string;
  date: string;
  note?: string;
}

export interface CategoryFormData {
  name: string;
  type: "income" | "expense";
  icon?: string;
  color?: string;
}

export interface AccountFormData {
  name: string;
  type: "cash" | "bank" | "ewallet";
  currency?: string;
}

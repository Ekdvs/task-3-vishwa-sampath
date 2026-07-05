export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Category {
  _id: string;
  userId: string;
  name: string;
  type: 'income' | 'expense';
  createdAt: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  categoryId: { _id: string; name: string; type: string } | string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  note?: string;
  date: string;
  createdAt: string;
}

export interface Budget {
  budgetId: string;
  categoryId: string;
  categoryName: string;
  budgetAmount: number;
  spent: number;
  remaining: number;
  percentage: number;
  isExceeded: boolean;
  period: "weekly" | "monthly" | "yearly";
}

export interface BudgetProgress {
  budgetId: string;
  categoryName: string;
  budgetAmount: number;
  spent: number;
  remaining: number;
  percentage: number;
  isExceeded: boolean;
}

export interface DashboardSummary {
  income: number;
  expense: number;
  balance: number;
}

export interface MonthlyData {
  _id: string;
  income: number;
  expense: number;
}

export interface CategoryData {
  _id: string;
  name: string;
  totalAmount: number;
}

export interface DashboardChartsData {
  monthlyData: MonthlyData[];
  categoryData: CategoryData[];
  recentTransactions: Transaction[];
}

export interface ApiResponse<T> {
  message: string;
  error: boolean;
  success: boolean;
  data?: T;
}

export interface TransactionFilters {
  type?: 'income' | 'expense' | '';
  categoryId?: string;
  from?: string;
  to?: string;
}

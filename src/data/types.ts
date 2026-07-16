// Shared type definitions for the accountant dashboard's dummy data.
// Replace/extend these once the FMS backend endpoints are wired up.

export interface SummaryStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  pendingReminders: number;
  incomeChangePct: number;
  expenseChangePct: number;
  balanceChangePct: number;
}

export interface MonthlyTrendPoint {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryBreakdownItem {
  category: string;
  value: number;
  color: string;
}

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  category: string;
  date: string;
  amount: number;
  hasAttachment: boolean;
}

export type ReminderPriority = "high" | "medium" | "low";

export interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  priority: ReminderPriority;
}

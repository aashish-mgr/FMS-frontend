

export type format = "pdf" | "excel" | "csv";

export type ReportType =
  | "income"
  | "expense"
  | "profit-loss"
  | "category-income"
  | "category-expense"
  | "monthly-summary"
  | "yearly-summary";

export interface IncomeExpenseReportParams {
  from?: string;
  to?: string;
  categoryId?: string;
  paymentMethod?: string;
  page?: number;
  limit?: number;
}
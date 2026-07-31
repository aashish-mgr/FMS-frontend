

export type format = "pdf" | "excel" | "csv";

export interface IncomeExpenseReportParams {
  from?: string;
  to?: string;
  categoryId?: string;
  paymentMethod?: string;
  page?: number;
  limit?: number;
  format: format
}
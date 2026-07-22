// src/types/ledgerTypes.ts
// Companion to dashboardTypes.ts — types for Income Management (SRS §7) and
// Expense Management (SRS §8). Field names mirror the future API payload.

export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Cheque' | 'eSewa' | 'Khalti' | 'Other'

export const paymentMethods: PaymentMethod[] = ['Cash', 'Bank Transfer', 'Cheque', 'eSewa', 'Khalti', 'Other']

export interface Category {
  id: string
  name: string
  description: string
  group?: string // expense categories are grouped (SRS 8.3); income categories are not (SRS 7.4)
}

export interface Attachment {
  id: string
  file_name: string
  file_size: number
  mime_type: string
  storage_url: string
}

// SRS 7.2 — Income Record Fields
export interface IncomeRecord {
  id: string
  transaction_date: string
  amount: number
  income_category_id: string
  income_source?: string
  client_name?: string
  payment_method: PaymentMethod
  reference_number?: string
  invoice_number?: string
  description?: string
  attachments: Attachment[]
  created_at: string
  updated_at: string
  deleted_at: string | null
}

// SRS 8.2 — Expense Record Fields
export interface ExpenseRecord {
  id: string
  expense_date: string
  amount: number
  expense_category_id: string
  vendor_name?: string
  payment_method: PaymentMethod
  bill_number?: string
  description?: string
  attachments: Attachment[]
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type ExportFormat = 'pdf' | 'excel' | 'csv'

export interface DateRange {
  from: string
  to: string
}

export interface AmountRange {
  min: string
  max: string
}
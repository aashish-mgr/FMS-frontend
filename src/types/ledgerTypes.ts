// src/types/ledgerTypes.ts
// Companion to dashboardTypes.ts — types for Income Management (SRS §7) and
// Expense Management (SRS §8). Field names mirror the future API payload.

export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Cheque' | 'Esewa' | 'Khalti' | 'Other'

export const paymentMethods: PaymentMethod[] = ['Cash', 'Bank Transfer', 'Cheque', 'Esewa', 'Khalti', 'Other']

export interface Category {
  id: string
  categoryName: string
  categoryDescription: string
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
  transactionDate: string
  amount: number
  incomeCategoryId: string
  incomeSource?: string
  clientName?: string
  paymentMethod: PaymentMethod
  referenceNumber?: string
  invoiceNumber?: string
  description?: string
  attachments: Attachment[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

// SRS 8.2 — Expense Record Fields
export interface ExpenseRecord {
  id: string
  transactionDate: string
  amount: number
  expenseCategoryId: string
  vendorName?: string
  paymentMethod: PaymentMethod
  billNumber?: string
  description?: string
  attachments?: Attachment[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
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
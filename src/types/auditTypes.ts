// src/types/auditTypes.ts
// Types for the Audit Trail (SRS §14). Logs are immutable — read-only in the UI.

export type AuditAction =
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_LOGIN_FAILED'
  | 'INCOME_CREATED'
  | 'INCOME_UPDATED'
  | 'INCOME_DELETED'
  | 'EXPENSE_CREATED'
  | 'EXPENSE_UPDATED'
  | 'EXPENSE_DELETED'
  | 'ATTACHMENT_UPLOADED'
  | 'ATTACHMENT_DELETED'
  | 'NOTE_CREATED'
  | 'NOTE_UPDATED'
  | 'NOTE_DELETED'
  | 'REMINDER_CREATED'
  | 'REMINDER_COMPLETED'
  | 'REMINDER_DELETED'

// SRS 14.2 — the full audited action list
export const AUDIT_ACTIONS: AuditAction[] = [
  'USER_LOGIN',
  'USER_LOGOUT',
  'USER_LOGIN_FAILED',
  'INCOME_CREATED',
  'INCOME_UPDATED',
  'INCOME_DELETED',
  'EXPENSE_CREATED',
  'EXPENSE_UPDATED',
  'EXPENSE_DELETED',
  'ATTACHMENT_UPLOADED',
  'ATTACHMENT_DELETED',
  'NOTE_CREATED',
  'NOTE_UPDATED',
  'NOTE_DELETED',
  'REMINDER_CREATED',
  'REMINDER_COMPLETED',
  'REMINDER_DELETED'
]

export type EntityType = 'income' | 'expense' | 'note' | 'reminder' | 'attachment' | 'user'

export const ENTITY_TYPES: EntityType[] = ['income', 'expense', 'note', 'reminder', 'attachment', 'user']

// SRS 14.1 — Audit Log Table Schema
export interface AuditLogRecord {
  id: string
  userId: string | null
  // Display-only convenience field — the real API would join this from the users table.
  userName: string | null
  action: AuditAction
  entityType: EntityType
  entityId: string | null
  oldValues: Record<string, unknown> | null
  newValues: Record<string, unknown> | null
  ipAddress: string | null
  createdAt: string
}

export interface DateRange {
  from: string
  to: string
}

export interface AuditResponse {
  records: AuditLogRecord[],
  meta: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
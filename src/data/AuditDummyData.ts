// src/data/auditDummyData.ts
// Dummy audit log stream, shaped like the future GET /api/audit-logs response
// (SRS §14.1 / §14.2). Read-only — there is no create/edit flow for this data.

import type { AuditLogRecord, AuditAction, EntityType } from '../types/auditTypes'

const USERS = ['Sunita Shrestha', 'Bikash Karki', 'Anjali Gurung', 'Rajan Thapa', null]
const IPS = ['103.90.12.4', '202.79.32.11', '110.44.5.201', '27.34.71.9', null]

const ACTION_ENTITY: { action: AuditAction; entity: EntityType }[] = [
  { action: 'USER_LOGIN', entity: 'user' },
  { action: 'USER_LOGOUT', entity: 'user' },
  { action: 'USER_LOGIN_FAILED', entity: 'user' },
  { action: 'INCOME_CREATED', entity: 'income' },
  { action: 'INCOME_UPDATED', entity: 'income' },
  { action: 'INCOME_DELETED', entity: 'income' },
  { action: 'EXPENSE_CREATED', entity: 'expense' },
  { action: 'EXPENSE_UPDATED', entity: 'expense' },
  { action: 'EXPENSE_DELETED', entity: 'expense' },
  { action: 'ATTACHMENT_UPLOADED', entity: 'attachment' },
  { action: 'ATTACHMENT_DELETED', entity: 'attachment' },
  { action: 'NOTE_CREATED', entity: 'note' },
  { action: 'NOTE_UPDATED', entity: 'note' },
  { action: 'NOTE_DELETED', entity: 'note' },
  { action: 'REMINDER_CREATED', entity: 'reminder' },
  { action: 'REMINDER_COMPLETED', entity: 'reminder' },
  { action: 'REMINDER_DELETED', entity: 'reminder' }
]

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

function timestampOffset(hoursAgo: number): string {
  const d = new Date()
  d.setHours(d.getHours() - hoursAgo)
  return d.toISOString()
}

function sampleValues(entity: EntityType, seed: number): { old: Record<string, unknown> | null; next: Record<string, unknown> | null } {
  if (entity === 'income' || entity === 'expense') {
    const amount = 5000 + ((seed * 3271) % 90000)
    return {
      old: seed % 3 === 0 ? null : { amount: amount - 500, payment_method: 'Cash' },
      next: { amount, payment_method: seed % 2 === 0 ? 'Bank Transfer' : 'Cash' }
    }
  }
  if (entity === 'note') {
    return {
      old: seed % 3 === 0 ? null : { is_pinned: false },
      next: { is_pinned: true, title: 'Updated note title' }
    }
  }
  if (entity === 'reminder') {
    return {
      old: seed % 3 === 0 ? null : { status: 'PENDING' },
      next: { status: 'COMPLETED' }
    }
  }
  return { old: null, next: null }
}

export function generateAuditLogs(count = 120): AuditLogRecord[] {
  const logs: AuditLogRecord[] = []
  for (let i = 0; i < count; i++) {
    const pair = pick(ACTION_ENTITY, i * 5 + 2)
    const hoursAgo = (i * 37) % (24 * 45) // spread across ~45 days
    const { old, next } = sampleValues(pair.entity, i)
    const isDelete = pair.action.endsWith('DELETED')
    const isCreate = pair.action.endsWith('CREATED')

    logs.push({
      id: `audit-${5000 + i}`,
      user_id: `user-${(i % 4) + 1}`,
      user_name: pick(USERS, i * 3 + 1),
      action: pair.action,
      entity_type: pair.entity,
      entity_id: pair.entity === 'user' ? null : `${pair.entity}-${1000 + i}`,
      old_values: isCreate ? null : old,
      new_values: isDelete ? null : next,
      ip_address: pick(IPS, i * 7 + 4),
      created_at: timestampOffset(hoursAgo)
    })
  }
  return logs.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
}
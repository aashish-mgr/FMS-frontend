import type { Attachment } from "./notesTypes";

export interface remainderType {
  id?: string;
 title: string;
 remainderDate: string;
 priority: Priority
 status: ReminderStatus
 repeat?: RepeatCycle | undefined;
 description?: string | undefined;
 createdBy?: string | undefined;
 remainderTime?: string | undefined;
 deletedAt?: string | null
}

export interface CreateReminderInput {
  title: string;
  description?: string;
  remainderDate: string;
  remainderTime?: string;
  priority: Priority;
  repeat?: RepeatCycle
}

export interface UpdateReminderInput {
  title?: string;
  description?: string;
  remainderDate?: string;
  remainderTime?: string
  priority?: Priority;
  repeat?: RepeatCycle;
}

export interface ListReminderResponse {
  records: remainderType[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface ListReminderParams {
  page?: number;
  status?: "PENDING" | "COMPLETED";
  priority?: "LOW" | "MEDIUM" | "HIGH";
}


export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'
export type ReminderStatus = 'PENDING' | 'COMPLETED'
export type RepeatCycle = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'

export const PRIORITIES: Priority[] = ['LOW', 'MEDIUM', 'HIGH']
export const REPEAT_CYCLES: RepeatCycle[] = ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']

// SRS 10.2 — Reminder Fields
export interface ReminderRecord {
  id: string
  title: string
  description?: string
  reminder_date: string
  remainderTime?: string | null
  priority: Priority
  status: ReminderStatus
  repeat: RepeatCycle
  attachments: Attachment[]
  created_by: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface DateRange {
  from: string
  to: string
}
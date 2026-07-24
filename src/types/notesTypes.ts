

export interface Note {
  id: string;
  title: string;
  description: string;
  colorLabel: string | null;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
}

export interface CreateNoteInput {
  title: string;
  description: string;
  colorLabel?: string;
}

export interface ListNoteResponse {
  records: Note[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface ListNoteParams {
  page?: number;
  search?: string;
  is_pinned?: boolean;
  is_archived?: boolean;
}


// src/types/notesReminderTypes.ts
// Types for the Notes Module (SRS §9) and Reminder Module (SRS §10).
// Field names mirror the future API payloads exactly.

export type ColorLabel = 'green' | 'yellow' | 'red' | null

export interface Attachment {
  id: string
  file_name: string
  file_size: number
  mime_type: string
  storage_url: string
}

// SRS 9.1 — Note Fields
export interface NoteRecord {
  id: string
  title: string
  description: string
  color_label: ColorLabel
  is_pinned: boolean
  is_archived: boolean
  created_by: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}


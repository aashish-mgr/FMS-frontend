

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

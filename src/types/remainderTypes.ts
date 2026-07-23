export interface remainderType {
 title: string;
 remainderDate: Date;
 priority: "LOW" | "MEDIUM" | "HIGH";
 status: "PENDING" | "COMPLETED";
 repeat?: "NONE" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | undefined;
 description?: string | undefined;
 createdBy?: string | undefined;
 remainderTime?: string | undefined;
}

export interface CreateReminderInput {
  title: string;
  description?: string;
  reminderDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
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

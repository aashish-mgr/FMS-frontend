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
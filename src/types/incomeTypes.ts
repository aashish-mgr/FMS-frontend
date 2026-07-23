export interface incomeType {
    id: string,
    amount: number,
    incomeCategoryId: string,
    paymentMethod: "Other" | "Cash" | "Bank Transfer" | "Cheque" | "Esewa" | "Khalti",
    incomeSource?: string,
    clientName?: string,
    referenceNumber?: string,
    invoiceNumber?: string,
    description?: string,
    transactionDate: string,
    createdBy?:  string | undefined
    updatedBy?: string | undefined,
    createdAt?: string |undefined,
    updatedAt?: string | undefined,
    deletedAt?: string | undefined
}

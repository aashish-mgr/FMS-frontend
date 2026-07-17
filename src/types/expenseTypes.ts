export interface expenseType  {
    transactionDate: Date,
    amount: number,
    expenseCategoryId: string,
    paymentMethod: "Other" | "Cash" | "Bank Transfer" | "Cheque" | "Esewa" | "Khalti",
    vendorName?: string | undefined,
    billNumber?: string | undefined,
    description?: string | undefined,
    createdBy?: string | undefined,
    updatedBy?: string | undefined
}
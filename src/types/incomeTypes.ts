export interface incomeType {
    id: string
    amount: number,
    incomeCategoryId: string,
    paymentMethod: "Other" | "Cash" | "Bank Transfer" | "Cheque" | "Esewa" | "Khalti",
    incomeSource: string,
    clientName: string,
    referenceNumber?: string,
    invoiceNumber?: string,
    description: string,
    transactionDate: Date
}
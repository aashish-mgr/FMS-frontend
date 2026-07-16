// Dummy data for the accountant dashboard.
// Replace each export with a real API call once the FMS backend endpoints are wired up.

import type {
  SummaryStats,
  MonthlyTrendPoint,
  CategoryBreakdownItem,
  Transaction,
  Reminder,
} from "./types";

export const summaryStats: SummaryStats = {
  totalIncome: 84250.0,
  totalExpense: 52130.75,
  netBalance: 32119.25,
  pendingReminders: 4,
  incomeChangePct: 8.2,
  expenseChangePct: -3.1,
  balanceChangePct: 14.6,
};

// Last 6 months of income vs expense, used by the trend chart
export const monthlyTrend: MonthlyTrendPoint[] = [
  { month: "Feb", income: 11200, expense: 8100 },
  { month: "Mar", income: 12850, expense: 9300 },
  { month: "Apr", income: 10990, expense: 7600 },
  { month: "May", income: 13720, expense: 8950 },
  { month: "Jun", income: 15680, expense: 9720 },
  { month: "Jul", income: 19810, expense: 8460 },
];

// Expense breakdown by category, used by the donut chart
export const categoryBreakdown: CategoryBreakdownItem[] = [
  { category: "Payroll", value: 21200, color: "#0F5132" },
  { category: "Vendors", value: 12850, color: "#3D8361" },
  { category: "Utilities", value: 6400, color: "#7FB69A" },
  { category: "Travel", value: 5680, color: "#B8862B" },
  { category: "Office Supplies", value: 3900, color: "#D8A54B" },
  { category: "Other", value: 2100.75, color: "#C9CBC3" },
];

export const transactions: Transaction[] = [
  {
    id: "TXN-10231",
    type: "income",
    description: "Invoice #4521 - Meridian Logistics",
    category: "Client Payment",
    date: "2026-07-14",
    amount: 6200.0,
    hasAttachment: true,
  },
  {
    id: "TXN-10230",
    type: "expense",
    description: "AWS Infrastructure - July",
    category: "Utilities",
    date: "2026-07-13",
    amount: 1180.4,
    hasAttachment: true,
  },
  {
    id: "TXN-10229",
    type: "expense",
    description: "Payroll - Engineering Team",
    category: "Payroll",
    date: "2026-07-12",
    amount: 14200.0,
    hasAttachment: false,
  },
  {
    id: "TXN-10228",
    type: "income",
    description: "Invoice #4519 - Bluepeak Retail",
    category: "Client Payment",
    date: "2026-07-10",
    amount: 3850.0,
    hasAttachment: true,
  },
  {
    id: "TXN-10227",
    type: "expense",
    description: "Office Supplies - Q3 restock",
    category: "Office Supplies",
    date: "2026-07-09",
    amount: 420.5,
    hasAttachment: false,
  },
  {
    id: "TXN-10226",
    type: "expense",
    description: "Flights - Client site visit",
    category: "Travel",
    date: "2026-07-08",
    amount: 890.0,
    hasAttachment: true,
  },
  {
    id: "TXN-10225",
    type: "income",
    description: "Invoice #4515 - Northgate Partners",
    category: "Client Payment",
    date: "2026-07-05",
    amount: 9100.0,
    hasAttachment: true,
  },
  {
    id: "TXN-10224",
    type: "expense",
    description: "Vendor Payment - Packaging Co",
    category: "Vendors",
    date: "2026-07-03",
    amount: 2340.0,
    hasAttachment: false,
  },
];

export const reminders: Reminder[] = [
  {
    id: "RM-001",
    title: "Vendor invoice due - Packaging Co",
    dueDate: "2026-07-18",
    priority: "high",
  },
  {
    id: "RM-002",
    title: "Quarterly tax filing (Q2)",
    dueDate: "2026-07-20",
    priority: "high",
  },
  {
    id: "RM-003",
    title: "Reconcile payroll ledger",
    dueDate: "2026-07-22",
    priority: "medium",
  },
  {
    id: "RM-004",
    title: "Review pending expense approvals",
    dueDate: "2026-07-25",
    priority: "low",
  },
];

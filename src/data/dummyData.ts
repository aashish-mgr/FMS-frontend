import type {
  CurrentUser,
  Kpis,
  KpiPeriod,
  BarChartData,
  CategoryDatum,
  CashFlowByYear,
  Transaction,
  Reminder
} from '../types/dashboardTypes'

// Dummy data shaped after the FMS SRS v1.0 data model.
// In production this is replaced by calls to /api/v1/dashboard/* per Section 6.4.

export const currentUser: CurrentUser = {
  full_name: 'Aashish Magar',
  email: 'aashish@gmail.com',
  role: 'Accountant'
}

// ---------- 6.1 KPI Cards ----------
export const kpis: Kpis = {
  today: { income: 84500, expense: 31200, profit: 53300 },
  week: { income: 612400, expense: 248900, profit: 363500 },
  month: { income: 2384600, expense: 1462300, profit: 922300 },
  year: { income: 24_186_400, expense: 15_932_800, profit: 8_253_600 }
}

export const kpiPeriods: KpiPeriod[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' }
]

// ---------- 7.4 Income categories (seeded) ----------
export const incomeCategories: string[] = [
  'Software Development',
  'Website Development',
  'Mobile App Development',
  'ERP Development',
  'Government Project',
  'School Training',
  'College Training',
  'Corporate Training',
  'Online Class',
  'Physical Class',
  'Consultancy',
  'AMC / Maintenance',
  'Hosting Services',
  'Domain Services',
  'Other'
]

// ---------- 8.3 Expense categories (seeded, grouped) ----------
export const expenseCategoryGroups: Record<string, string[]> = {
  Employee: ['Salary', 'Bonus', 'Allowance', 'Freelancer Payment'],
  Office: ['Rent', 'Electricity', 'Water', 'Internet', 'Stationery', 'Office Supplies', 'Furniture', 'Maintenance', 'Cleaning'],
  IT: ['Server', 'Hosting', 'Domain', 'SSL', 'Software Subscription', 'API Charges'],
  Marketing: ['Facebook Ads', 'Google Ads', 'Printing', 'Events'],
  Travel: ['Fuel', 'Travel', 'Accommodation'],
  Entertainment: ['Team Celebration', 'Festival Celebration', 'Office Lunch', 'Gifts'],
  Miscellaneous: ['Taxes', 'Bank Charges', 'Miscellaneous']
}

// ---------- 6.2 Income vs Expense bar chart ----------
export const barChartData: BarChartData = {
  daily: [
    { label: 'Mon', income: 62000, expense: 28000 },
    { label: 'Tue', income: 78500, expense: 41200 },
    { label: 'Wed', income: 45300, expense: 19800 },
    { label: 'Thu', income: 91200, expense: 52600 },
    { label: 'Fri', income: 118400, expense: 63100 },
    { label: 'Sat', income: 39800, expense: 22400 },
    { label: 'Sun', income: 84500, expense: 31200 }
  ],
  weekly: [
    { label: 'Wk 1', income: 498200, expense: 312400 },
    { label: 'Wk 2', income: 561800, expense: 289600 },
    { label: 'Wk 3', income: 712300, expense: 411900 },
    { label: 'Wk 4', income: 612400, expense: 248900 }
  ],
  monthly: [
    { label: 'Jan', income: 1842300, expense: 1210400 },
    { label: 'Feb', income: 1963800, expense: 1288600 },
    { label: 'Mar', income: 2104200, expense: 1349100 },
    { label: 'Apr', income: 1786500, expense: 1122800 },
    { label: 'May', income: 2298700, expense: 1401200 },
    { label: 'Jun', income: 2456100, expense: 1589300 },
    { label: 'Jul', income: 2384600, expense: 1462300 },
    { label: 'Aug', income: 2012400, expense: 1276900 },
    { label: 'Sep', income: 1897200, expense: 1198500 },
    { label: 'Oct', income: 2134800, expense: 1345600 },
    { label: 'Nov', income: 2287300, expense: 1421700 },
    { label: 'Dec', income: 2618500, expense: 1665300 }
  ],
  yearly: [
    { label: '2022', income: 16_284_300, expense: 11_402_600 },
    { label: '2023', income: 19_672_800, expense: 13_218_400 },
    { label: '2024', income: 22_403_100, expense: 14_566_900 },
    { label: '2025', income: 24_186_400, expense: 15_932_800 }
  ]
}

// ---------- 6.2 Income by Category (donut) ----------
export const incomeByCategory: CategoryDatum[] = [
  { name: 'Software Development', value: 612400 },
  { name: 'ERP Development', value: 438200 },
  { name: 'Corporate Training', value: 356800 },
  { name: 'Website Development', value: 298500 },
  { name: 'AMC / Maintenance', value: 214300 },
  { name: 'Government Project', value: 186900 },
  { name: 'Mobile App Development', value: 164200 },
  { name: 'Consultancy', value: 112600 }
]

// ---------- 6.2 Expense by Category (donut) ----------
export const expenseByCategory: CategoryDatum[] = [
  { name: 'Salary', value: 782400 },
  { name: 'Rent', value: 186000 },
  { name: 'Freelancer Payment', value: 142800 },
  { name: 'Google Ads', value: 98600 },
  { name: 'Software Subscription', value: 76300 },
  { name: 'Internet', value: 24500 },
  { name: 'Server', value: 68200 },
  { name: 'Miscellaneous', value: 83500 }
]

// ---------- 6.2 Monthly Cash Flow (line chart, year selector) ----------
export const cashFlowByYear: CashFlowByYear = {
  2026: barChartData.monthly.map((m) => ({
    label: m.label,
    income: m.income,
    expense: m.expense,
    profit: m.income - m.expense
  })),
  2025: [
    { label: 'Jan', income: 1620400, expense: 1080200 },
    { label: 'Feb', income: 1712300, expense: 1145600 },
    { label: 'Mar', income: 1893700, expense: 1220300 },
    { label: 'Apr', income: 1654200, expense: 1098700 },
    { label: 'May', income: 2012600, expense: 1287400 },
    { label: 'Jun', income: 2145800, expense: 1356200 },
    { label: 'Jul', income: 1998400, expense: 1289600 },
    { label: 'Aug', income: 1876200, expense: 1198300 },
    { label: 'Sep', income: 1745900, expense: 1122400 },
    { label: 'Oct', income: 1912600, expense: 1234800 },
    { label: 'Nov', income: 2087300, expense: 1298700 },
    { label: 'Dec', income: 2243700, expense: 1434700 }
  ].map((m) => ({ ...m, profit: m.income - m.expense }))
}

// ---------- 6.3 Recent Transactions widget ----------
export const recentTransactions: Transaction[] = [
  { id: 'txn-001', entity_type: 'income', date: '2026-07-14', category: 'Software Development', party: 'Himal Traders Pvt. Ltd.', method: 'Bank Transfer', amount: 84500 },
  { id: 'txn-002', entity_type: 'expense', date: '2026-07-14', category: 'Internet', party: 'WorldLink Communications', method: 'eSewa', amount: 4200 },
  { id: 'txn-003', entity_type: 'expense', date: '2026-07-13', category: 'Freelancer Payment', party: 'Anish Shrestha', method: 'Bank Transfer', amount: 27000 },
  { id: 'txn-004', entity_type: 'income', date: '2026-07-13', category: 'Corporate Training', party: 'Nabil Bank Ltd.', method: 'Cheque', amount: 118400 },
  { id: 'txn-005', entity_type: 'income', date: '2026-07-12', category: 'AMC / Maintenance', party: 'Kathmandu Metropolitan Office', method: 'Bank Transfer', amount: 45300 },
  { id: 'txn-006', entity_type: 'expense', date: '2026-07-12', category: 'Google Ads', party: 'Google Ireland Ltd.', method: 'Khalti', amount: 18600 },
  { id: 'txn-007', entity_type: 'expense', date: '2026-07-11', category: 'Office Supplies', party: 'Bhatbhateni Supermarket', method: 'Cash', amount: 3150 },
  { id: 'txn-008', entity_type: 'income', date: '2026-07-11', category: 'Website Development', party: 'Everest Herbs Pvt. Ltd.', method: 'eSewa', amount: 62000 },
  { id: 'txn-009', entity_type: 'income', date: '2026-07-10', category: 'Online Class', party: 'Batch #DP-114 Students', method: 'Khalti', amount: 39800 },
  { id: 'txn-010', entity_type: 'expense', date: '2026-07-10', category: 'Salary', party: 'Payroll — July (Partial)', method: 'Bank Transfer', amount: 412000 },
  { id: 'txn-011', entity_type: 'expense', date: '2026-07-09', category: 'Server', party: 'DigitalOcean LLC', method: 'Bank Transfer', amount: 15400 },
  { id: 'txn-012', entity_type: 'income', date: '2026-07-09', category: 'Government Project', party: 'Dept. of IT, GoN', method: 'Bank Transfer', amount: 218500 },
  { id: 'txn-013', entity_type: 'expense', date: '2026-07-08', category: 'Rent', party: 'Radisson Business Suites', method: 'Bank Transfer', amount: 95000 },
  { id: 'txn-014', entity_type: 'income', date: '2026-07-08', category: 'Mobile App Development', party: 'Sajilo Yatra Pvt. Ltd.', method: 'Cheque', amount: 156200 },
  { id: 'txn-015', entity_type: 'expense', date: '2026-07-07', category: 'Software Subscription', party: 'Figma Inc.', method: 'Khalti', amount: 8900 },
  { id: 'txn-016', entity_type: 'income', date: '2026-07-07', category: 'Physical Class', party: 'Batch #DP-109 Students', method: 'Cash', amount: 28400 },
  { id: 'txn-017', entity_type: 'expense', date: '2026-07-06', category: 'Fuel', party: 'Nepal Oil Corporation', method: 'Cash', amount: 6200 },
  { id: 'txn-018', entity_type: 'income', date: '2026-07-06', category: 'Consultancy', party: 'Yeti Airlines Domestic', method: 'Bank Transfer', amount: 74600 },
  { id: 'txn-019', entity_type: 'expense', date: '2026-07-05', category: 'Bank Charges', party: 'Nepal Investment Mega Bank', method: 'Bank Transfer', amount: 1250 },
  { id: 'txn-020', entity_type: 'income', date: '2026-07-05', category: 'Hosting Services', party: 'Recurring — 42 clients', method: 'eSewa', amount: 31900 }
]

// ---------- 6.3 Upcoming Reminders widget ----------
export const upcomingReminders: Reminder[] = [
  { id: 'rem-001', title: 'Disburse Employee Salaries', reminder_date: '2026-07-15', priority: 'HIGH', status: 'PENDING', repeat: 'MONTHLY' },
  { id: 'rem-002', title: 'Pay Office Rent — Radisson Business Suites', reminder_date: '2026-07-16', priority: 'HIGH', status: 'PENDING', repeat: 'MONTHLY' },
  { id: 'rem-003', title: 'Renew SSL Certificate — digitalpathshalanepal.com', reminder_date: '2026-07-17', priority: 'MEDIUM', status: 'PENDING', repeat: 'YEARLY' },
  { id: 'rem-004', title: 'File Government Taxes — Q4 Advance Tax', reminder_date: '2026-07-18', priority: 'HIGH', status: 'PENDING', repeat: 'NONE' },
  { id: 'rem-005', title: 'Renew Hosting Plan — DigitalOcean', reminder_date: '2026-07-19', priority: 'MEDIUM', status: 'PENDING', repeat: 'YEARLY' },
  { id: 'rem-006', title: 'Pay Internet Bill — WorldLink', reminder_date: '2026-07-20', priority: 'LOW', status: 'PENDING', repeat: 'MONTHLY' },
  { id: 'rem-007', title: 'Renew Domain — digitalpathshalanepal.com', reminder_date: '2026-07-21', priority: 'LOW', status: 'PENDING', repeat: 'YEARLY' }
]

export const paymentMethods: string[] = ['Cash', 'Bank Transfer', 'Cheque', 'eSewa', 'Khalti', 'Other']

export const npr = (value: number): string =>
  new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 })
    .format(value)
    .replace('NPR', 'Rs.')
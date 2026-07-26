// src/data/ledgerDummyData.ts
// Record-level dummy data for Income/Expense pages. dummyData.ts already holds
// the aggregated incomeByCategory/expenseByCategory used by the dashboard's
// CategoryDonut — this file is the individual-record layer behind it,
// shaped like the future GET /api/income and GET /api/expense responses.

import type { Category, IncomeRecord, ExpenseRecord } from '../types/ledgerTypes'
import { paymentMethods } from '../types/ledgerTypes'

// SRS 7.4 — Default Income Categories (Seeded)
export const incomeCategories: Category[] = [
  { id: 'inc-01', categoryName: 'Software Development', categoryDescription: 'Custom software and web application development revenue.' },
  { id: 'inc-02', categoryName: 'Website Development', categoryDescription: 'Static and dynamic website development projects.' },
  { id: 'inc-03', categoryName: 'Mobile App Development', categoryDescription: 'iOS and Android application development.' },
  { id: 'inc-04', categoryName: 'ERP Development', categoryDescription: 'Enterprise resource planning system development.' },
  { id: 'inc-05', categoryName: 'Government Project', categoryDescription: 'Projects contracted with government entities.' },
  { id: 'inc-06', categoryName: 'School Training', categoryDescription: 'IT training programs delivered to school students.' },
  { id: 'inc-07', categoryName: 'College Training', categoryDescription: 'IT training programs delivered to college students.' },
  { id: 'inc-08', categoryName: 'Corporate Training', categoryDescription: 'IT training delivered to corporate organizations.' },
  { id: 'inc-09', categoryName: 'Online Class', categoryDescription: 'Online / remote training sessions.' },
  { id: 'inc-10', categoryName: 'Physical Class', categoryDescription: 'In-person classroom training sessions.' },
  { id: 'inc-11', categoryName: 'Consultancy', categoryDescription: 'IT consultancy and advisory services.' },
  { id: 'inc-12', categoryName: 'AMC / Maintenance', categoryDescription: 'Annual maintenance contracts and support retainers.' },
  { id: 'inc-13', categoryName: 'Hosting Services', categoryDescription: 'Web hosting service revenue.' },
  { id: 'inc-14', categoryName: 'Domain Services', categoryDescription: 'Domain registration and renewal revenue.' },
  { id: 'inc-15', categoryName: 'Other', categoryDescription: 'Income that does not fit other categories.' }
] 

// SRS 8.3 — Default Expense Categories (Seeded), grouped
export const expenseCategories: Category[] = [
  { id: 'exp-01', group: 'Employee', categoryName: 'Salary', categoryDescription: 'Monthly salary payments to full-time employees.' },
  { id: 'exp-02', group: 'Employee', categoryName: 'Bonus', categoryDescription: 'Performance or festival bonuses.' },
  { id: 'exp-03', group: 'Employee', categoryName: 'Allowance', categoryDescription: 'Transport, meal, or other allowances.' },
  { id: 'exp-04', group: 'Employee', categoryName: 'Freelancer Payment', categoryDescription: 'Payments to freelance contractors.' },
  { id: 'exp-05', group: 'Office', categoryName: 'Rent', categoryDescription: 'Office space rental payments.' },
  { id: 'exp-06', group: 'Office', categoryName: 'Electricity', categoryDescription: 'Electricity utility bills.' },
  { id: 'exp-07', group: 'Office', categoryName: 'Water', categoryDescription: 'Water utility bills.' },
  { id: 'exp-08', group: 'Office', categoryName: 'Internet', categoryDescription: 'Internet/broadband subscription.' },
  { id: 'exp-09', group: 'Office', categoryName: 'Stationery', categoryDescription: 'Paper, pens, and general stationery.' },
  { id: 'exp-10', group: 'Office', categoryName: 'Office Supplies', categoryDescription: 'General office consumables.' },
  { id: 'exp-11', group: 'Office', categoryName: 'Furniture', categoryDescription: 'Office furniture purchases.' },
  { id: 'exp-12', group: 'Office', categoryName: 'Maintenance', categoryDescription: 'Office repairs and maintenance.' },
  { id: 'exp-13', group: 'Office', categoryName: 'Cleaning', categoryDescription: 'Cleaning services and supplies.' },
  { id: 'exp-14', group: 'IT', categoryName: 'Server', categoryDescription: 'Physical or cloud server costs.' },
  { id: 'exp-15', group: 'IT', categoryName: 'Hosting', categoryDescription: 'Web/app hosting subscriptions.' },
  { id: 'exp-16', group: 'IT', categoryName: 'Domain', categoryDescription: 'Domain registration and renewals.' },
  { id: 'exp-17', group: 'IT', categoryName: 'SSL', categoryDescription: 'SSL certificate purchases.' },
  { id: 'exp-18', group: 'IT', categoryName: 'Software Subscription', categoryDescription: 'SaaS tool subscriptions (e.g., Figma, Notion).' },
  { id: 'exp-19', group: 'IT', categoryName: 'API Charges', categoryDescription: 'Third-party API usage fees.' },
  { id: 'exp-20', group: 'Marketing', categoryName: 'Facebook Ads', categoryDescription: 'Meta/Facebook advertising spend.' },
  { id: 'exp-21', group: 'Marketing', categoryName: 'Google Ads', categoryDescription: 'Google advertising spend.' },
  { id: 'exp-22', group: 'Marketing', categoryName: 'Printing', categoryDescription: 'Banners, brochures, printed materials.' },
  { id: 'exp-23', group: 'Marketing', categoryName: 'Events', categoryDescription: 'Event sponsorships and participation costs.' },
  { id: 'exp-24', group: 'Travel', categoryName: 'Fuel', categoryDescription: 'Fuel for company vehicles.' },
  { id: 'exp-25', group: 'Travel', categoryName: 'Travel', categoryDescription: 'Bus, flight, or taxi travel costs.' },
  { id: 'exp-26', group: 'Travel', categoryName: 'Accommodation', categoryDescription: 'Hotel or lodging costs.' },
  { id: 'exp-27', group: 'Entertainment', categoryName: 'Team Celebration', categoryDescription: 'Team outing or party expenses.' },
  { id: 'exp-28', group: 'Entertainment', categoryName: 'Festival Celebration', categoryDescription: 'Dashain, Tihar, and other festival celebrations.' },
  { id: 'exp-29', group: 'Entertainment', categoryName: 'Office Lunch', categoryDescription: 'Team lunch or refreshments.' },
  { id: 'exp-30', group: 'Entertainment', categoryName: 'Gifts', categoryDescription: 'Client or employee gifts.' },
  { id: 'exp-31', group: 'Miscellaneous', categoryName: 'Taxes', categoryDescription: 'Government tax payments.' },
  { id: 'exp-32', group: 'Miscellaneous', categoryName: 'Bank Charges', categoryDescription: 'Bank service fees and transaction charges.' },
  { id: 'exp-33', group: 'Miscellaneous', categoryName: 'Miscellaneous', categoryDescription: 'Expenses that do not fit other categories.' }
]

const clients = [
  'Himalayan Traders Pvt. Ltd.',
  'Everest EduTech',
  'Sagarmatha Government Office',
  'Kathmandu Valley College',
  'Bagmati Retail Group',
  'Pashupati Logistics',
  'Nepal Digital Ventures',
  'Lumbini Hospitality'
]

const vendors = [
  'Nepal Telecom',
  'WorldLink Communications',
  'Bhatbhateni Supermarket',
  'Daraz Nepal',
  'NIC Asia Bank',
  'Prabhu Rent-a-Car',
  'Hamro Furniture House',
  'CloudHost Nepal'
]

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

function dateOffset(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}

function makeAttachments(seed: number) {
  if (seed % 3 !== 0) return []
  return [
    {
      id: `att-${seed}`,
      file_name: seed % 2 === 0 ? 'receipt.pdf' : 'invoice-scan.jpg',
      file_size: 240_000 + seed * 1200,
      mime_type: seed % 2 === 0 ? 'application/pdf' : 'image/jpeg',
      storage_url: '#'
    }
  ]
}

export function generateIncomeRecords(count = 64): IncomeRecord[] {
  const records: IncomeRecord[] = []
  for (let i = 0; i < count; i++) {
    const category = pick(incomeCategories, i * 7 + 3)
    const daysAgo = Math.floor((i * 137) % 365)
    const amount = 4500 + ((i * 3271) % 180000)
    const date = dateOffset(daysAgo)
    records.push({
      id: `inc-${1000 + i}`,
      transactionDate: date,
      amount,
      incomeCategoryId: category.id,
      incomeSource: i % 4 === 0 ? 'Direct Bank Transfer' : i % 4 === 1 ? 'Cheque Deposit' : undefined,
      clientName: pick(clients, i * 5 + 1),
      paymentMethod: pick(paymentMethods, i * 11 + 2),
      referenceNumber: i % 3 === 0 ? `REF-${20000 + i}` : undefined,
      invoiceNumber: i % 2 === 0 ? `INV-${5000 + i}` : undefined,
      description: i % 6 === 0 ? 'Milestone payment for project delivery.' : undefined,
      attachments: makeAttachments(i),
      createdAt: date,
      updatedAt: date,
      deletedAt: null
    })
  }
  return records.sort((a, b) => (a.transactionDate < b.transactionDate ? 1 : -1))
}

export function generateExpenseRecords(count = 64): ExpenseRecord[] {
  const records: ExpenseRecord[] = []
  for (let i = 0; i < count; i++) {
    const category = pick(expenseCategories, i * 9 + 5)
    const daysAgo = Math.floor((i * 113) % 365)
    const amount = 800 + ((i * 2113) % 95000)
    const date = dateOffset(daysAgo)
    records.push({
      id: `exp-${2000 + i}`,
      transactionDate: date,
      amount,
      expenseCategoryId: category.id,
      vendorName: pick(vendors, i * 4 + 2),
      paymentMethod: pick(paymentMethods, i * 13 + 1),
      billNumber: i % 3 === 0 ? `BILL-${9000 + i}` : undefined,
      description: i % 5 === 0 ? 'Recurring monthly operational cost.' : undefined,
      attachments: makeAttachments(i + 1),
      createdAt: date,
      updatedAt: date,
      deletedAt: null
    })
  }
  return records.sort((a, b) => (a.transactionDate < b.transactionDate ? 1 : -1))
}
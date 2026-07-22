// src/data/ledgerDummyData.ts
// Record-level dummy data for Income/Expense pages. dummyData.ts already holds
// the aggregated incomeByCategory/expenseByCategory used by the dashboard's
// CategoryDonut — this file is the individual-record layer behind it,
// shaped like the future GET /api/income and GET /api/expense responses.

import type { Category, IncomeRecord, ExpenseRecord } from '../types/ledgerTypes'
import { paymentMethods } from '../types/ledgerTypes'

// SRS 7.4 — Default Income Categories (Seeded)
export const incomeCategories: Category[] = [
  { id: 'inc-01', name: 'Software Development', description: 'Custom software and web application development revenue.' },
  { id: 'inc-02', name: 'Website Development', description: 'Static and dynamic website development projects.' },
  { id: 'inc-03', name: 'Mobile App Development', description: 'iOS and Android application development.' },
  { id: 'inc-04', name: 'ERP Development', description: 'Enterprise resource planning system development.' },
  { id: 'inc-05', name: 'Government Project', description: 'Projects contracted with government entities.' },
  { id: 'inc-06', name: 'School Training', description: 'IT training programs delivered to school students.' },
  { id: 'inc-07', name: 'College Training', description: 'IT training programs delivered to college students.' },
  { id: 'inc-08', name: 'Corporate Training', description: 'IT training delivered to corporate organizations.' },
  { id: 'inc-09', name: 'Online Class', description: 'Online / remote training sessions.' },
  { id: 'inc-10', name: 'Physical Class', description: 'In-person classroom training sessions.' },
  { id: 'inc-11', name: 'Consultancy', description: 'IT consultancy and advisory services.' },
  { id: 'inc-12', name: 'AMC / Maintenance', description: 'Annual maintenance contracts and support retainers.' },
  { id: 'inc-13', name: 'Hosting Services', description: 'Web hosting service revenue.' },
  { id: 'inc-14', name: 'Domain Services', description: 'Domain registration and renewal revenue.' },
  { id: 'inc-15', name: 'Other', description: 'Income that does not fit other categories.' }
]

// SRS 8.3 — Default Expense Categories (Seeded), grouped
export const expenseCategories: Category[] = [
  { id: 'exp-01', group: 'Employee', name: 'Salary', description: 'Monthly salary payments to full-time employees.' },
  { id: 'exp-02', group: 'Employee', name: 'Bonus', description: 'Performance or festival bonuses.' },
  { id: 'exp-03', group: 'Employee', name: 'Allowance', description: 'Transport, meal, or other allowances.' },
  { id: 'exp-04', group: 'Employee', name: 'Freelancer Payment', description: 'Payments to freelance contractors.' },
  { id: 'exp-05', group: 'Office', name: 'Rent', description: 'Office space rental payments.' },
  { id: 'exp-06', group: 'Office', name: 'Electricity', description: 'Electricity utility bills.' },
  { id: 'exp-07', group: 'Office', name: 'Water', description: 'Water utility bills.' },
  { id: 'exp-08', group: 'Office', name: 'Internet', description: 'Internet/broadband subscription.' },
  { id: 'exp-09', group: 'Office', name: 'Stationery', description: 'Paper, pens, and general stationery.' },
  { id: 'exp-10', group: 'Office', name: 'Office Supplies', description: 'General office consumables.' },
  { id: 'exp-11', group: 'Office', name: 'Furniture', description: 'Office furniture purchases.' },
  { id: 'exp-12', group: 'Office', name: 'Maintenance', description: 'Office repairs and maintenance.' },
  { id: 'exp-13', group: 'Office', name: 'Cleaning', description: 'Cleaning services and supplies.' },
  { id: 'exp-14', group: 'IT', name: 'Server', description: 'Physical or cloud server costs.' },
  { id: 'exp-15', group: 'IT', name: 'Hosting', description: 'Web/app hosting subscriptions.' },
  { id: 'exp-16', group: 'IT', name: 'Domain', description: 'Domain registration and renewals.' },
  { id: 'exp-17', group: 'IT', name: 'SSL', description: 'SSL certificate purchases.' },
  { id: 'exp-18', group: 'IT', name: 'Software Subscription', description: 'SaaS tool subscriptions (e.g., Figma, Notion).' },
  { id: 'exp-19', group: 'IT', name: 'API Charges', description: 'Third-party API usage fees.' },
  { id: 'exp-20', group: 'Marketing', name: 'Facebook Ads', description: 'Meta/Facebook advertising spend.' },
  { id: 'exp-21', group: 'Marketing', name: 'Google Ads', description: 'Google advertising spend.' },
  { id: 'exp-22', group: 'Marketing', name: 'Printing', description: 'Banners, brochures, printed materials.' },
  { id: 'exp-23', group: 'Marketing', name: 'Events', description: 'Event sponsorships and participation costs.' },
  { id: 'exp-24', group: 'Travel', name: 'Fuel', description: 'Fuel for company vehicles.' },
  { id: 'exp-25', group: 'Travel', name: 'Travel', description: 'Bus, flight, or taxi travel costs.' },
  { id: 'exp-26', group: 'Travel', name: 'Accommodation', description: 'Hotel or lodging costs.' },
  { id: 'exp-27', group: 'Entertainment', name: 'Team Celebration', description: 'Team outing or party expenses.' },
  { id: 'exp-28', group: 'Entertainment', name: 'Festival Celebration', description: 'Dashain, Tihar, and other festival celebrations.' },
  { id: 'exp-29', group: 'Entertainment', name: 'Office Lunch', description: 'Team lunch or refreshments.' },
  { id: 'exp-30', group: 'Entertainment', name: 'Gifts', description: 'Client or employee gifts.' },
  { id: 'exp-31', group: 'Miscellaneous', name: 'Taxes', description: 'Government tax payments.' },
  { id: 'exp-32', group: 'Miscellaneous', name: 'Bank Charges', description: 'Bank service fees and transaction charges.' },
  { id: 'exp-33', group: 'Miscellaneous', name: 'Miscellaneous', description: 'Expenses that do not fit other categories.' }
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
      transaction_date: date,
      amount,
      income_category_id: category.id,
      income_source: i % 4 === 0 ? 'Direct Bank Transfer' : i % 4 === 1 ? 'Cheque Deposit' : undefined,
      client_name: pick(clients, i * 5 + 1),
      payment_method: pick(paymentMethods, i * 11 + 2),
      reference_number: i % 3 === 0 ? `REF-${20000 + i}` : undefined,
      invoice_number: i % 2 === 0 ? `INV-${5000 + i}` : undefined,
      description: i % 6 === 0 ? 'Milestone payment for project delivery.' : undefined,
      attachments: makeAttachments(i),
      created_at: date,
      updated_at: date,
      deleted_at: null
    })
  }
  return records.sort((a, b) => (a.transaction_date < b.transaction_date ? 1 : -1))
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
      expense_date: date,
      amount,
      expense_category_id: category.id,
      vendor_name: pick(vendors, i * 4 + 2),
      payment_method: pick(paymentMethods, i * 13 + 1),
      bill_number: i % 3 === 0 ? `BILL-${9000 + i}` : undefined,
      description: i % 5 === 0 ? 'Recurring monthly operational cost.' : undefined,
      attachments: makeAttachments(i + 1),
      created_at: date,
      updated_at: date,
      deleted_at: null
    })
  }
  return records.sort((a, b) => (a.expense_date < b.expense_date ? 1 : -1))
}
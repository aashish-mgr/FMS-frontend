export interface CurrentUser {
  full_name: string
  email: string
  role: 'Accountant'
}

export type PeriodKey = 'today' | 'week' | 'month' | 'year'

export interface KpiValue {
  income: number
  expense: number
  profit: number
}

export type Kpis = Record<PeriodKey, KpiValue>

export interface KpiPeriod {
  key: PeriodKey
  label: string
}

export type BarRange = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface BarDatum {
  bucket: string
  label: string
  income: number
  expense: number
  profit: number
}

export type BarChartData = Record<BarRange, BarDatum[]>

export interface CategoryDatum {
  categoryName: string
  amount: number
}

export interface CashFlowDatum {
  month: number
  label: string
  income: number
  expense: number
  profit: number
}

export type CashFlowByYear = Record<string, CashFlowDatum[]>

export type EntityType = 'income' | 'expense'

export interface Transaction {
  id: string
  type: EntityType
  date: string
  category: string
  party: string
  amount: number
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'
export type ReminderStatus = 'PENDING' | 'COMPLETED'
export type RepeatRule = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'

export interface Reminder {
  id: string
  title: string
  remainderDate: string
  priority: Priority
  status: ReminderStatus
  repeat: RepeatRule
}

export type DonutTone = 'positive' | 'negative'



export interface CategorySlice {
  categoryId: string;
  categoryName: string;
  amount: number;
  percentage: number;
}




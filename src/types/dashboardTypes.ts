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
  label: string
  income: number
  expense: number
}

export type BarChartData = Record<BarRange, BarDatum[]>

export interface CategoryDatum {
  name: string
  value: number
}

export interface CashFlowDatum {
  label: string
  income: number
  expense: number
  profit: number
}

export type CashFlowByYear = Record<string, CashFlowDatum[]>

export type EntityType = 'income' | 'expense'

export interface Transaction {
  id: string
  entity_type: EntityType
  date: string
  category: string
  party: string
  method: string
  amount: number
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'
export type ReminderStatus = 'PENDING' | 'COMPLETED'
export type RepeatRule = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'

export interface Reminder {
  id: string
  title: string
  reminder_date: string
  priority: Priority
  status: ReminderStatus
  repeat: RepeatRule
}

export type DonutTone = 'positive' | 'negative'
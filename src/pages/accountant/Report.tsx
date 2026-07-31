import { useMemo, useState, Fragment } from 'react'
import type { ComponentType, ReactNode } from 'react'
import { Download, ArrowDownRight, ArrowUpRight, TrendingUp, ChevronDown, ChevronRight as ChevronRightIcon } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import { npr } from '../../lib/format'
import { incomeCategories, expenseCategories, generateIncomeRecords, generateExpenseRecords } from '../../data/ledgerDummyData'
import { paymentMethods } from '../../types/ledgerTypes'
import type { PaymentMethod, ExportFormat } from '../../types/ledgerTypes'
import { useGetExpenseCategoryQuery, useGetIncomeCategoryQuery } from '../../store/api/categoryApi'
import { useGetAllQuery  as getIncome} from '../../store/api/incomeApi'
import { useGetAllQuery as getExpense } from '../../store/api/expenseApi'
import type { Category } from '../../types/categoryTypes'
import type { ReportType } from '../../types/reportTypes'
import { useGetIncomeReportQuery, useGetExpenseReportQuery,useGetProfitLossReportQuery, useDownloadReportMutation } from '../../store/api/reportsApi'

type Tone = 'positive' | 'negative' | 'indigo' | 'amber'

const toneMap: Record<Tone, { text: string; bg: string; ring: string }> = {
  positive: { text: 'text-positive', bg: 'bg-positive-soft', ring: 'ring-positive/15' },
  negative: { text: 'text-negative', bg: 'bg-negative-soft', ring: 'ring-negative/15' },
  indigo: { text: 'text-indigo', bg: 'bg-indigo-soft', ring: 'ring-indigo/15' },
  amber: { text: 'text-amber', bg: 'bg-amber-soft', ring: 'ring-amber/15' }
}



const REPORT_TABS: { key: ReportType; label: string }[] = [
  { key: 'income', label: 'Income Report' },
  { key: 'expense', label: 'Expense Report' },
  { key: 'profit-loss', label: 'Profit & Loss' },
  { key: 'category-income', label: 'Category Income' },
  { key: 'category-expense', label: 'Category Expense' },
  { key: 'monthly-summary', label: 'Monthly Summary' },
  { key: 'yearly-summary', label: 'Yearly Summary' }
]

type GroupBy = 'daily' | 'monthly' | 'yearly'

const PAGE_SIZE = 10

/* -------------------------------- Data pool ---------------------------------- */
// A denser, one-year-plus pool so every report type has enough spread to be meaningful.
// In production this becomes GET /api/reports/... (SRS 11.3) — the shapes below
// mirror what those endpoints would return.

// const incomePool = generateIncomeRecords(240)
// const expensePool = generateExpenseRecords(240)

function categoryName(list: Category[], id: string) {
  return list.find((c) => c.id === id)?.categoryName ?? 'Uncategorized'
}

function monthKey(dateStr: string) {
  return dateStr.slice(0, 7) // YYYY-MM
}

function monthLabel(key: string) {
  const [y, m] = key.split('-')
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-NP', { month: 'short', year: 'numeric' })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NP', { day: '2-digit', month: 'short', year: 'numeric' })
}

/* ------------------------------- Summary card ------------------------------- */

interface SummaryCardProps {
  label: string
  value: string
  tone: Tone
  Icon: ComponentType<{ size?: number; className?: string; strokeWidth?: number }>
}

function SummaryCard({ label, value, tone, Icon }: SummaryCardProps) {
  const t = toneMap[tone]
  return (
    <div className="relative flex-1 bg-card rounded-xl border border-line shadow-card p-5 overflow-hidden">
      <div className="ledger-stitch absolute top-0 left-0 right-0" />
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        <div className={`grid place-items-center w-8 h-8 rounded-lg ${t.bg} ring-1 ${t.ring}`}>
          <Icon size={15} className={t.text} strokeWidth={2.2} />
        </div>
      </div>
      <p className={`font-mono tabular text-[28px] font-semibold mt-3 ${t.text}`}>{value}</p>
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink transition-colors'

function FieldLabel({ children }: { children: string }) {
  return <span className="mb-1.5 block text-xs font-medium text-muted">{children}</span>
}

/* ----------------------------------- Page ------------------------------------ */

export default function ReportsPage() {
    const {data: incomeCategories} = useGetIncomeCategoryQuery();
    const {data: expenseCategories} = useGetExpenseCategoryQuery();
    const {data: incomePool} = getIncome();
    const {data: expensePool} = getExpense();


    

  const [reportType, setReportType] = useState<ReportType>('income')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState<'all' | PaymentMethod>('all')
  const [groupBy, setGroupBy] = useState<GroupBy>('monthly')
  const [page, setPage] = useState(1)
  const [exportOpen, setExportOpen] = useState(false)
  const [expandedYear, setExpandedYear] = useState<string | null>(null)

  const showsIncomeExpenseFilters = reportType === 'income' || reportType === 'expense'
  const showsGroupBy = reportType === 'profit-loss'

  const activeCategories = reportType === 'expense' || reportType === 'category-expense' ? expenseCategories : incomeCategories

  // Reset page + category filter cleanly whenever the report type changes.
  function selectReport(type: ReportType) {
    setReportType(type)
    setCategoryFilter('all')
    setPaymentFilter('all')
    setPage(1)
    setExpandedYear(null)
  }

  const inRange = (dateStr: string) => {
    if (dateRange.from && dateStr < dateRange.from) return false
    if (dateRange.to && dateStr > dateRange.to) return false
    return true
  }

  const filteredIncome = useMemo(
    () =>
      incomePool?.filter((r) => {
        if (!inRange(r.transactionDate)) return false
        if (reportType === 'income' && categoryFilter !== 'all' && r.incomeCategoryId !== categoryFilter) return false
        if (reportType === 'income' && paymentFilter !== 'all' && r.paymentMethod !== paymentFilter) return false
        return true
      }),
    [dateRange, categoryFilter, paymentFilter, reportType]
  )

  const filteredExpense = useMemo(
    () =>
      expensePool?.filter((r) => {
        if (!inRange(r.transactionDate)) return false
        if (reportType === 'expense' && categoryFilter !== 'all' && r.expenseCategoryId !== categoryFilter) return false
        if (reportType === 'expense' && paymentFilter !== 'all' && r.paymentMethod !== paymentFilter) return false
        return true
      }),
    [dateRange, categoryFilter, paymentFilter, reportType]
  )

  const totalIncome = filteredIncome?.reduce((s, r) => s + Number(r.amount), 0)
  const totalExpense = filteredExpense?.reduce((s, r) => s + Number(r.amount), 0)
  const netProfit = Number(totalIncome) - Number(totalExpense);

  /* ---- Category Income / Category Expense (SRS: Category, Count, Total, % Share) ---- */
  const categoryRows = useMemo(() => {
    const records = reportType === 'category-income' ? filteredIncome : filteredExpense
    const categories = reportType === 'category-income' ? incomeCategories : expenseCategories
    const catKey = reportType === 'category-income' ? 'incomeCategoryId' : 'expenseCategoryId'
    const totals = new Map<string, { count: number; amount: number }>()

    records?.forEach((r: any) => {
      const id = r[catKey] as string
      const bucket = totals.get(id) ?? { count: 0, amount: 0 }
      bucket.count += 1
      bucket.amount += r.amount
      totals.set(id, bucket)
    })

    const grandTotal = [...totals.values()].reduce((s, v) => s + v.amount, 0)

    return categories
      ?.map((c) => {
        const bucket = totals.get(c.id) ?? { count: 0, amount: 0 }
        return {
          categoryId: c.id,
          name: c.categoryName,
          count: bucket.count,
          amount: bucket.amount,
          share: grandTotal ? (bucket.amount / grandTotal) * 100 : 0
        }
      })
      .filter((r) => r.count > 0)
      .sort((a, b) => b.amount - a.amount)
  }, [reportType, filteredIncome, filteredExpense])

  /* ---------------------- Monthly Summary (Month, Income, Expense, Profit) --------------------- */
  const monthlyRows = useMemo(() => {
    const buckets = new Map<string, { income: number; expense: number }>()
    filteredIncome?.forEach((r) => {
      const key = monthKey(r.transactionDate)
      const b = buckets.get(key) ?? { income: 0, expense: 0 }
      b.income += Number(r.amount)
      buckets.set(key, b)
    })
    filteredExpense?.forEach((r) => {
      const key = monthKey(r.transactionDate)
      const b = buckets.get(key) ?? { income: 0, expense: 0 }
      b.expense += Number(r.amount)
      buckets.set(key, b)
    })
    return [...buckets.entries()]
      .map(([key, v]) => ({ key, label: monthLabel(key), income: v.income, expense: v.expense, profit: v.income - Number(v.expense) }))
      .sort((a, b) => (a.key < b.key ? 1 : -1))
  }, [filteredIncome, filteredExpense])

  /* -------------------------- Yearly Summary (Year, Breakdown, Totals) ------------------------- */
  const yearlyRows = useMemo(() => {
    const years = new Map<string, { income: number; expense: number; months: typeof monthlyRows }>()
    monthlyRows.forEach((m) => {
      const year = m.key.slice(0, 4)
      const y = years.get(year) ?? { income: 0, expense: 0, months: [] }
      y.income += m.income
      y.expense += m.expense
      y.months.push(m)
      years.set(year, y)
    })
    return [...years.entries()]
      .map(([year, v]) => ({
        year,
        income: v.income,
        expense: v.expense,
        profit: v.income - v.expense,
        months: v.months.sort((a, b) => (a.key < b.key ? -1 : 1))
      }))
      .sort((a, b) => (a.year < b.year ? 1 : -1))
  }, [monthlyRows])

  /* ------------------------------- Profit & Loss rows -------------------------------- */
  const pnlRows = useMemo(() => {
    if (groupBy === 'yearly') {
      return yearlyRows.map((y) => ({ period: y.year, income: y.income, expense: y.expense, profit: y.profit }))
    }
    if (groupBy === 'monthly') {
      return monthlyRows.map((m) => ({ period: m.label, income: m.income, expense: m.expense, profit: m.profit }))
    }
    // daily
    const buckets = new Map<string, { income: number; expense: number }>()
    filteredIncome?.forEach((r) => {
      const b = buckets.get(r.transactionDate) ?? { income: 0, expense: 0 }
      b.income += r.amount
      buckets.set(r.transactionDate, b)
    })
    filteredExpense?.forEach((r) => {
      const b = buckets.get(r.transactionDate) ?? { income: 0, expense: 0 }
      b.expense += r.amount
      buckets.set(r.transactionDate, b)
    })
    return [...buckets.entries()]
      .map(([date, v]) => ({ period: formatDate(date), income: v.income, expense: v.expense, profit: v.income - v.expense }))
      .sort((a, b) => (a.period < b.period ? 1 : -1))
  }, [groupBy, yearlyRows, monthlyRows, filteredIncome, filteredExpense])

  const incomeTotalPages = Math.max(1, Math.ceil(Number(filteredIncome?.length) / PAGE_SIZE))
  const expenseTotalPages = Math.max(1, Math.ceil(Number(filteredExpense?.length) / PAGE_SIZE))
  const pagedIncome = filteredIncome?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const pagedExpense = filteredExpense?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const [downloadReport, { isLoading: isDownloading }] =
    useDownloadReportMutation();

  async function handleExport(format: ExportFormat) {
   try {
      await downloadReport({
        reportType: reportType,
        format,
        params: {
          from: dateRange.from,
          to: dateRange.to
        },
      }).unwrap();
      // triggerBrowserDownload already ran inside the mutation's
      // responseHandler — nothing else to do here on success.
      setExportOpen(false)
    } catch (err) {
      console.error("Report download failed:", err);
      // surface a toast/notification here
    }
    
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="px-5 lg:px-8 py-6 space-y-6 max-w-[1400px]">
          {/* Header */}
          <section className="animate-rise flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-display text-base font-semibold text-ink">Reports</h1>
              <p className="text-xs text-muted mt-0.5">Generate, preview, and export financial reports for any date range</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setExportOpen((v) => !v)}
                className="flex items-center gap-1.5 bg-ink text-white rounded-lg px-4 py-2 text-xs font-medium hover:bg-ink/90 transition-colors"
              >
                <Download size={14} /> Export Report
              </button>
              {exportOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-card border border-line rounded-lg shadow-panel py-1 z-[999]">
                  {(['pdf', 'excel', 'csv'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => handleExport(fmt)}
                      className="block w-full text-left px-3 py-1.5 text-xs uppercase tracking-wide text-muted hover:text-ink hover:bg-paper z-20"
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Report type tabs */}
          <div className="flex flex-wrap bg-card border border-line rounded-lg p-1 gap-0.5 ">
            {REPORT_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => selectReport(t.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  reportType === t.key ? 'bg-ink text-white' : 'text-muted hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard label="Total Income" value={npr(totalIncome as number)} tone="positive" Icon={ArrowDownRight} />
            <SummaryCard label="Total Expense" value={npr(totalExpense as number)} tone="negative" Icon={ArrowUpRight} />
            <SummaryCard label="Net Profit / Loss" value={npr(netProfit)} tone={netProfit >= 0 ? 'indigo' : 'negative'} Icon={TrendingUp} />
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl border border-line shadow-card p-4 animate-rise">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <FieldLabel>From Date</FieldLabel>
                <input
                  type="date"
                  className={inputClass}
                  value={dateRange.from}
                  onChange={(e) => {
                    setDateRange((d) => ({ ...d, from: e.target.value }))
                    setPage(1)
                  }}
                />
              </div>
              <div>
                <FieldLabel>To Date</FieldLabel>
                <input
                  type="date"
                  className={inputClass}
                  value={dateRange.to}
                  onChange={(e) => {
                    setDateRange((d) => ({ ...d, to: e.target.value }))
                    setPage(1)
                  }}
                />
              </div>

              {showsIncomeExpenseFilters && (
                <>
                  <div>
                    <FieldLabel>Category</FieldLabel>
                    <select
                      className={inputClass}
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value)
                        setPage(1)
                      }}
                    >
                      <option value="all">All Categories</option>
                      {activeCategories?.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Payment Method</FieldLabel>
                    <select
                      className={inputClass}
                      value={paymentFilter}
                      onChange={(e) => {
                        setPaymentFilter(e.target.value as typeof paymentFilter)
                        setPage(1)
                      }}
                    >
                      <option value="all">All Methods</option>
                      {paymentMethods.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {showsGroupBy && (
                <div>
                  <FieldLabel>Group By</FieldLabel>
                  <select className={inputClass} value={groupBy} onChange={(e) => setGroupBy(e.target.value as GroupBy)}>
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Report table */}
          <div className="bg-card rounded-xl border border-line shadow-card overflow-hidden animate-rise">
            <div className="px-5 py-3 border-b border-line flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                {REPORT_TABS.find((t) => t.key === reportType)?.label}
              </p>
            </div>

            <div className="overflow-x-auto">
              {reportType === 'income' && (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      <Th>Date</Th>
                      <Th>Category</Th>
                      <Th>Client</Th>
                      <Th>Payment Method</Th>
                      <Th align="right">Amount</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedIncome?.length === 0 && <EmptyRow colSpan={5} />}
                    {pagedIncome?.map((r) => (
                      <tr key={r.id} className="border-b border-line last:border-0 hover:bg-paper/60 transition-colors">
                        <Td className="font-mono tabular text-xs text-muted">{formatDate(r.transactionDate)}</Td>
                        <Td>
                          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium bg-positive-soft text-positive">
                            {categoryName(incomeCategories as Category[], r.incomeCategoryId)}
                          </span>
                        </Td>
                        <Td className="text-ink">{r.clientName ?? '—'}</Td>
                        <Td className="font-mono text-xs text-muted">{r.paymentMethod}</Td>
                        <Td align="right" className="font-mono tabular font-medium text-positive">
                          {npr(r.amount)}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {reportType === 'expense' && (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      <Th>Date</Th>
                      <Th>Category</Th>
                      <Th>Vendor</Th>
                      <Th>Payment Method</Th>
                      <Th align="right">Amount</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedExpense?.length === 0 && <EmptyRow colSpan={5} />}
                    {pagedExpense?.map((r) => (
                      <tr key={r.id} className="border-b border-line last:border-0 hover:bg-paper/60 transition-colors">
                        <Td className="font-mono tabular text-xs text-muted">{formatDate(r.transactionDate)}</Td>
                        <Td>
                          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium bg-negative-soft text-negative">
                            {categoryName(expenseCategories as Category[], r.expenseCategoryId)}
                          </span>
                        </Td>
                        <Td className="text-ink">{r.vendorName ?? '—'}</Td>
                        <Td className="font-mono text-xs text-muted">{r.paymentMethod}</Td>
                        <Td align="right" className="font-mono tabular font-medium text-negative">
                          {npr(r.amount)}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {reportType === 'profit-loss' && (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      <Th>Period</Th>
                      <Th align="right">Total Income</Th>
                      <Th align="right">Total Expense</Th>
                      <Th align="right">Net Profit / Loss</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {pnlRows.length === 0 && <EmptyRow colSpan={4} />}
                    {pnlRows.map((row) => (
                      <tr key={row.period} className="border-b border-line last:border-0 hover:bg-paper/60 transition-colors">
                        <Td className="text-ink font-medium">{row.period}</Td>
                        <Td align="right" className="font-mono tabular text-positive">
                          {npr(Number(row.income))}
                        </Td>
                        <Td align="right" className="font-mono tabular text-negative">
                          {npr(Number(row.expense))}
                        </Td>
                        <Td align="right" className={`font-mono tabular font-medium ${row.profit >= 0 ? 'text-indigo' : 'text-negative'}`}>
                          {npr(Number(row.profit))}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {(reportType === 'category-income' || reportType === 'category-expense') && (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      <Th>Category</Th>
                      <Th align="right">Transactions</Th>
                      <Th align="right">Total Amount</Th>
                      <Th align="right">% Share</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryRows?.length === 0 && <EmptyRow colSpan={4} />}
                    {categoryRows?.map((row) => {
                      const tone = reportType === 'category-income' ? 'text-positive' : 'text-negative'
                      return (
                        <tr key={row.categoryId} className="border-b border-line last:border-0 hover:bg-paper/60 transition-colors">
                          <Td className="text-ink">{row.name}</Td>
                          <Td align="right" className="font-mono tabular text-muted">
                            {row.count}
                          </Td>
                          <Td align="right" className={`font-mono tabular font-medium ${tone}`}>
                            {npr(row.amount)}
                          </Td>
                          <Td align="right" className="font-mono tabular text-muted">
                            {row.share.toFixed(1)}%
                          </Td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}

              {reportType === 'monthly-summary' && (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      <Th>Month</Th>
                      <Th align="right">Income</Th>
                      <Th align="right">Expense</Th>
                      <Th align="right">Net Profit</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyRows.length === 0 && <EmptyRow colSpan={4} />}
                    {monthlyRows.map((row) => (
                      <tr key={row.key} className="border-b border-line last:border-0 hover:bg-paper/60 transition-colors">
                        <Td className="text-ink font-medium">{row.label}</Td>
                        <Td align="right" className="font-mono tabular text-positive">
                          {npr(row.income)}
                        </Td>
                        <Td align="right" className="font-mono tabular text-negative">
                          {npr(row.expense)}
                        </Td>
                        <Td align="right" className={`font-mono tabular font-medium ${row.profit >= 0 ? 'text-indigo' : 'text-negative'}`}>
                          {npr(row.profit)}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {reportType === 'yearly-summary' && (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      <Th></Th>
                      <Th>Year</Th>
                      <Th align="right">Total Income</Th>
                      <Th align="right">Total Expense</Th>
                      <Th align="right">Net Profit</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyRows.length === 0 && <EmptyRow colSpan={5} />}
                    {yearlyRows.map((row) => (
                      <Fragment key={row.year}>
                        <tr
                          onClick={() => setExpandedYear((y) => (y === row.year ? null : row.year))}
                          className="border-b border-line cursor-pointer hover:bg-paper/60 transition-colors"
                        >
                          <Td className="w-8 text-muted">
                            {expandedYear === row.year ? <ChevronDown size={14} /> : <ChevronRightIcon size={14} />}
                          </Td>
                          <Td className="text-ink font-medium">{row.year}</Td>
                          <Td align="right" className="font-mono tabular text-positive">
                            {npr(row.income)}
                          </Td>
                          <Td align="right" className="font-mono tabular text-negative">
                            {npr(row.expense)}
                          </Td>
                          <Td align="right" className={`font-mono tabular font-medium ${row.profit >= 0 ? 'text-indigo' : 'text-negative'}`}>
                            {npr(row.profit)}
                          </Td>
                        </tr>
                        {expandedYear === row.year && (
                          <tr className="border-b border-line last:border-0 bg-paper/40">
                            <td colSpan={5} className="px-5 py-3">
                              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                {row.months.map((m) => (
                                  <div key={m.key} className="bg-card border border-line rounded-lg p-3">
                                    <p className="text-[11px] font-medium text-muted uppercase tracking-wide mb-1.5">{m.label}</p>
                                    <div className="flex items-baseline justify-between">
                                      <span className="text-[11px] text-muted">Profit</span>
                                      <span className={`font-mono tabular text-[13px] font-medium ${m.profit >= 0 ? 'text-indigo' : 'text-negative'}`}>
                                        {npr(m.profit)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination — only meaningful for the two record-level reports */}
            {(reportType === 'income' || reportType === 'expense') && (
              <div className="px-5 py-3 border-t border-line flex items-center justify-between">
                <span className="font-mono tabular text-[11px] text-muted">
                  {reportType === 'income'
                    ? `${filteredIncome?.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, Number(filteredIncome?.length))} of ${filteredIncome?.length}`
                    : `${filteredExpense?.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, Number(filteredExpense?.length))} of ${filteredExpense?.length}`}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-2 py-1 rounded-md border border-line text-muted hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                  >
                    Prev
                  </button>
                  <span className="font-mono tabular text-[11px] text-ink px-1">
                    Page {page} / {reportType === 'income' ? incomeTotalPages : expenseTotalPages}
                  </span>
                  <button
                    disabled={page >= (reportType === 'income' ? incomeTotalPages : expenseTotalPages)}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-2 py-1 rounded-md border border-line text-muted hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

/* ------------------------------- Table primitives ----------------------------- */

function Th({ children, align }: { children?: ReactNode; align?: 'left' | 'right' }) {
  return (
    <th className={`px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted ${align === 'right' ? 'text-right' : 'text-left'}`}>
      {children}
    </th>
  )
}

function Td({ children, align, className = '' }: { children?: ReactNode; align?: 'left' | 'right'; className?: string }) {
  return <td className={`px-5 py-3 ${align === 'right' ? 'text-right' : ''} ${className}`}>{children}</td>
}

function EmptyRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-10 text-center text-sm text-muted">
        No data for the selected filters.
      </td>
    </tr>
  )
}
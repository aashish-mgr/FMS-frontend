import { useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  Download,
  ArrowUpRight,
  Receipt
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import { npr } from '../../data/dummyData'
import { expenseCategories, generateExpenseRecords } from '../../data/ledgerDummyData'
import { paymentMethods } from '../../types/ledgerTypes'
import type { ExpenseRecord, PaymentMethod, DateRange, AmountRange, ExportFormat } from '../../types/ledgerTypes'

const PAGE_SIZE = 10
const TODAY = new Date().toISOString().slice(0, 10)

type Tone = 'positive' | 'negative' | 'indigo'

const toneMap: Record<Tone, { text: string; bg: string; ring: string }> = {
  positive: { text: 'text-positive', bg: 'bg-positive-soft', ring: 'ring-positive/15' },
  negative: { text: 'text-negative', bg: 'bg-negative-soft', ring: 'ring-negative/15' },
  indigo: { text: 'text-indigo', bg: 'bg-indigo-soft', ring: 'ring-indigo/15' }
}

// Expense categories are grouped in the SRS (8.3) — render as <optgroup>.
const categoryGroups = expenseCategories.reduce<Record<string, typeof expenseCategories>>((acc, c) => {
  const key = c.group ?? 'Other'
  ;(acc[key] ??= []).push(c)
  return acc
}, {})

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

/* --------------------------------- Form bits --------------------------------- */

function FieldLabel({ children, required }: { children: string; required?: boolean }) {
  return (
    <span className="mb-1.5 block text-xs font-medium text-muted">
      {children} {required && <span className="text-negative">*</span>}
    </span>
  )
}

const inputClass =
  'w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink transition-colors'

type FormState = {
  expense_date: string
  amount: string
  expense_category_id: string
  vendor_name: string
  payment_method: PaymentMethod
  bill_number: string
  description: string
}

const EMPTY_FORM: FormState = {
  expense_date: TODAY,
  amount: '',
  expense_category_id: expenseCategories[0].id,
  vendor_name: '',
  payment_method: 'Cash',
  bill_number: '',
  description: ''
}

function categoryName(id: string) {
  return expenseCategories.find((c) => c.id === id)?.name ?? 'Uncategorized'
}

/* ----------------------------------- Page ------------------------------------ */

export default function ExpensePage() {
  const [records, setRecords] = useState<ExpenseRecord[]>(() => generateExpenseRecords())
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [dateRange, setDateRange] = useState<DateRange>({ from: '', to: '' })
  const [amountRange, setAmountRange] = useState<AmountRange>({ min: '', max: '' })

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [exportOpen, setExportOpen] = useState(false)

  const active = records.filter((r) => !r.deleted_at)

  const filtered = useMemo(() => {
    return active.filter((r) => {
      if (categoryFilter !== 'all' && r.expense_category_id !== categoryFilter) return false
      if (paymentFilter !== 'all' && r.payment_method !== paymentFilter) return false
      if (dateRange.from && r.expense_date < dateRange.from) return false
      if (dateRange.to && r.expense_date > dateRange.to) return false
      if (amountRange.min && r.amount < Number(amountRange.min)) return false
      if (amountRange.max && r.amount > Number(amountRange.max)) return false
      if (search.trim()) {
        const q = search.trim().toLowerCase()
        const haystack = [r.description, r.vendor_name, r.bill_number].filter(Boolean).join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [active, categoryFilter, paymentFilter, dateRange, amountRange, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalExpense = filtered.reduce((sum, r) => sum + r.amount, 0)
  const avgExpense = filtered.length ? totalExpense / filtered.length : 0

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormErrors({})
    setModalOpen(true)
  }

  function openEdit(r: ExpenseRecord) {
    setEditingId(r.id)
    setForm({
      expense_date: r.expense_date,
      amount: String(r.amount),
      expense_category_id: r.expense_category_id,
      vendor_name: r.vendor_name ?? '',
      payment_method: r.payment_method,
      bill_number: r.bill_number ?? '',
      description: r.description ?? ''
    })
    setFormErrors({})
    setModalOpen(true)
  }

  function validate(f: FormState) {
    const errors: Partial<Record<keyof FormState, string>> = {}
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 1)

    if (!f.expense_date) errors.expense_date = 'Date is required.'
    else if (new Date(f.expense_date) > maxDate) errors.expense_date = 'Cannot be more than 1 day in the future.'

    const amountNum = Number(f.amount)
    if (!f.amount || Number.isNaN(amountNum) || amountNum <= 0) errors.amount = 'Amount must be greater than 0.'
    if (!f.expense_category_id) errors.expense_category_id = 'Category is required.'
    if (!f.payment_method) errors.payment_method = 'Payment method is required.'

    return errors
  }

  function handleSubmit() {
    const errors = validate(form)
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    const now = new Date().toISOString()

    if (editingId) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                expense_date: form.expense_date,
                amount: Number(form.amount),
                expense_category_id: form.expense_category_id,
                vendor_name: form.vendor_name || undefined,
                payment_method: form.payment_method,
                bill_number: form.bill_number || undefined,
                description: form.description || undefined,
                updated_at: now
              }
            : r
        )
      )
    } else {
      const newRecord: ExpenseRecord = {
        id: `exp-${Date.now()}`,
        expense_date: form.expense_date,
        amount: Number(form.amount),
        expense_category_id: form.expense_category_id,
        vendor_name: form.vendor_name || undefined,
        payment_method: form.payment_method,
        bill_number: form.bill_number || undefined,
        description: form.description || undefined,
        attachments: [],
        created_at: now,
        updated_at: now,
        deleted_at: null
      }
      setRecords((prev) => [newRecord, ...prev])
    }

    setModalOpen(false)
  }

  function handleSoftDelete() {
    if (!pendingDeleteId) return
    setRecords((prev) => prev.map((r) => (r.id === pendingDeleteId ? { ...r, deleted_at: new Date().toISOString() } : r)))
    setPendingDeleteId(null)
  }

  function handleExport(format: ExportFormat) {
    // Wire to GET /api/expense/export?format=pdf|excel|csv (SRS 8.4) once the API is live.
    console.log(`Exporting ${filtered.length} expense records as ${format}`)
    setExportOpen(false)
  }

  function clearFilters() {
    setSearch('')
    setCategoryFilter('all')
    setPaymentFilter('all')
    setDateRange({ from: '', to: '' })
    setAmountRange({ min: '', max: '' })
    setPage(1)
  }

  const hasActiveFilters =
    search || categoryFilter !== 'all' || paymentFilter !== 'all' || dateRange.from || dateRange.to || amountRange.min || amountRange.max

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="px-5 lg:px-8 py-6 space-y-6 max-w-[1400px]">
          {/* Header */}
          <section className="animate-rise flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-display text-base font-semibold text-ink">Expense Management</h1>
              <p className="text-xs text-muted mt-0.5">Track, filter, and reconcile every expense against its vendor and category</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setExportOpen((v) => !v)}
                  className="flex items-center gap-1.5 bg-card border border-line rounded-lg px-3 py-2 text-xs font-medium text-muted hover:text-ink transition-colors"
                >
                  <Download size={14} /> Export
                </button>
                {exportOpen && (
                  <div className="absolute right-0 mt-1 w-32 bg-card border border-line rounded-lg shadow-panel py-1 z-10">
                    {(['pdf', 'excel', 'csv'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => handleExport(fmt)}
                        className="block w-full text-left px-3 py-1.5 text-xs uppercase tracking-wide text-muted hover:text-ink hover:bg-paper"
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={openCreate}
                className="flex items-center gap-1.5 bg-ink text-white rounded-lg px-4 py-2 text-xs font-medium hover:bg-ink/90 transition-colors"
              >
                <Plus size={14} /> Add Expense
              </button>
            </div>
          </section>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard label="Filtered Total" value={npr(totalExpense)} tone="negative" Icon={ArrowUpRight} />
            <SummaryCard label="Records Matched" value={String(filtered.length)} tone="indigo" Icon={Receipt} />
            <SummaryCard label="Average Entry" value={npr(Math.round(avgExpense))} tone="negative" Icon={ArrowUpRight} />
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl border border-line shadow-card p-4 animate-rise">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative lg:col-span-2">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  className={`${inputClass} pl-9`}
                  placeholder="Search description, vendor, bill number…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                />
              </div>
              <select
                className={inputClass}
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value)
                  setPage(1)
                }}
              >
                <option value="all">All Categories</option>
                {Object.entries(categoryGroups).map(([group, cats]) => (
                  <optgroup key={group} label={group}>
                    {cats.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <select
                className={inputClass}
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value)
                  setPage(1)
                }}
              >
                <option value="all">All Payment Methods</option>
                {paymentMethods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
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
              <div>
                <FieldLabel>Min Amount</FieldLabel>
                <input
                  type="number"
                  placeholder="0"
                  className={inputClass}
                  value={amountRange.min}
                  onChange={(e) => {
                    setAmountRange((a) => ({ ...a, min: e.target.value }))
                    setPage(1)
                  }}
                />
              </div>
              <div>
                <FieldLabel>Max Amount</FieldLabel>
                <input
                  type="number"
                  placeholder="Any"
                  className={inputClass}
                  value={amountRange.max}
                  onChange={(e) => {
                    setAmountRange((a) => ({ ...a, max: e.target.value }))
                    setPage(1)
                  }}
                />
              </div>
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 mt-3 text-xs text-muted hover:text-ink">
                <X size={12} /> Clear filters
              </button>
            )}
          </div>

          {/* Table */}
          <div className="bg-card rounded-xl border border-line shadow-card overflow-hidden animate-rise">
            <div className="px-5 py-3 border-b border-line flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Expense Records · {filtered.length} matched
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted">Date</th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted">Category</th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted">Vendor</th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted">Payment</th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted">Bill No.</th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted text-right">Amount</th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted text-center">Files</th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-5 py-10 text-center text-sm text-muted">
                        No expense records match the current filters.
                      </td>
                    </tr>
                  )}
                  {paged.map((r) => (
                    <tr key={r.id} className="border-b border-line last:border-0 hover:bg-paper/60 transition-colors">
                      <td className="px-5 py-3 font-mono tabular text-xs text-muted">
                        {new Date(r.expense_date).toLocaleDateString('en-NP', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium bg-negative-soft text-negative">
                          {categoryName(r.expense_category_id)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-ink">{r.vendor_name ?? '—'}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
                          {r.payment_method}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-muted">{r.bill_number ?? '—'}</td>
                      <td className="px-5 py-3 text-right font-mono tabular font-medium text-negative">{npr(r.amount)}</td>
                      <td className="px-5 py-3 text-center">
                        {r.attachments.length ? (
                          <span className="inline-flex items-center gap-1 text-xs text-muted">
                            <Paperclip size={12} /> {r.attachments.length}
                          </span>
                        ) : (
                          <span className="text-line">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEdit(r)} className="p-1.5 rounded-md text-muted hover:text-ink hover:bg-paper" title="Edit">
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setPendingDeleteId(r.id)}
                            className="p-1.5 rounded-md text-muted hover:text-negative hover:bg-negative-soft"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 border-t border-line flex items-center justify-between">
              <span className="font-mono tabular text-[11px] text-muted">
                Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
                {filtered.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-1.5 rounded-md border border-line text-muted hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="font-mono tabular text-[11px] text-ink px-1">
                  Page {page} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1.5 rounded-md border border-line text-muted hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add / Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-xl border border-line shadow-panel">
            <div className="px-6 py-4 border-b border-line flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-ink">
                {editingId ? 'Edit Expense Record' : 'Add Expense Record'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-md text-muted hover:text-ink hover:bg-paper">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel required>Expense Date</FieldLabel>
                <input
                  type="date"
                  className={inputClass}
                  value={form.expense_date}
                  onChange={(e) => setForm((f) => ({ ...f, expense_date: e.target.value }))}
                />
                {formErrors.expense_date && <p className="mt-1 text-xs text-negative">{formErrors.expense_date}</p>}
              </div>
              <div>
                <FieldLabel required>Amount (NPR)</FieldLabel>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className={inputClass}
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                />
                {formErrors.amount && <p className="mt-1 text-xs text-negative">{formErrors.amount}</p>}
              </div>
              <div>
                <FieldLabel required>Category</FieldLabel>
                <select
                  className={inputClass}
                  value={form.expense_category_id}
                  onChange={(e) => setForm((f) => ({ ...f, expense_category_id: e.target.value }))}
                >
                  {Object.entries(categoryGroups).map(([group, cats]) => (
                    <optgroup key={group} label={group}>
                      {cats.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel required>Payment Method</FieldLabel>
                <select
                  className={inputClass}
                  value={form.payment_method}
                  onChange={(e) => setForm((f) => ({ ...f, payment_method: e.target.value as PaymentMethod }))}
                >
                  {paymentMethods.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Vendor Name</FieldLabel>
                <input
                  className={inputClass}
                  placeholder="e.g., Nepal Telecom"
                  value={form.vendor_name}
                  onChange={(e) => setForm((f) => ({ ...f, vendor_name: e.target.value }))}
                />
              </div>
              <div>
                <FieldLabel>Bill Number</FieldLabel>
                <input
                  className={inputClass}
                  placeholder="Vendor invoice / bill ref."
                  value={form.bill_number}
                  onChange={(e) => setForm((f) => ({ ...f, bill_number: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Description</FieldLabel>
                <textarea
                  rows={3}
                  className={inputClass}
                  placeholder="Additional context or breakdown notes…"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-line flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-line text-sm font-medium text-muted hover:text-ink transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/90 transition-colors"
              >
                {editingId ? 'Save Changes' : 'Add Expense'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-card rounded-xl border border-line shadow-panel p-6">
            <h2 className="font-display text-base font-semibold text-ink">Delete expense record?</h2>
            <p className="mt-2 text-sm text-muted">
              This soft-deletes the record (sets deleted_at). It can still be recovered from the database if needed.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setPendingDeleteId(null)}
                className="px-4 py-2 rounded-lg border border-line text-sm font-medium text-muted hover:text-ink transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSoftDelete}
                className="px-4 py-2 rounded-lg bg-negative text-white text-sm font-medium hover:bg-negative/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
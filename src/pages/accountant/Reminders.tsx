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
  CheckCircle2,
  Circle,
  AlarmClock,
  AlertTriangle,
  Repeat
} from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import { generateReminders } from '../../data/NoteReminderData'
import { PRIORITIES, REPEAT_CYCLES } from '../../types/remainderTypes'
import type { ReminderRecord, Priority, ReminderStatus, RepeatCycle, DateRange } from '../../types/remainderTypes'

const PAGE_SIZE = 10
const TODAY = new Date().toISOString().slice(0, 10)

type Tone = 'positive' | 'negative' | 'indigo' | 'amber'

const toneMap: Record<Tone, { text: string; bg: string; ring: string }> = {
  positive: { text: 'text-positive', bg: 'bg-positive-soft', ring: 'ring-positive/15' },
  negative: { text: 'text-negative', bg: 'bg-negative-soft', ring: 'ring-negative/15' },
  indigo: { text: 'text-indigo', bg: 'bg-indigo-soft', ring: 'ring-indigo/15' },
  amber: { text: 'text-amber', bg: 'bg-amber-soft', ring: 'ring-amber/15' }
}

const priorityTone: Record<Priority, Tone> = { LOW: 'indigo', MEDIUM: 'amber', HIGH: 'negative' }

function daysUntil(dateStr: string): number {
  const today = new Date(TODAY)
  const target = new Date(dateStr)
  return Math.round((target.getTime() - today.getTime()) / 86_400_000)
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
  title: string
  description: string
  reminder_date: string
  reminder_time: string
  priority: Priority
  repeat: RepeatCycle
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  reminder_date: TODAY,
  reminder_time: '',
  priority: 'MEDIUM',
  repeat: 'NONE'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NP', { day: '2-digit', month: 'short', year: 'numeric' })
}

/* ----------------------------------- Page ------------------------------------ */

export default function RemindersPage() {
  const [reminders, setReminders] = useState<ReminderRecord[]>(() => generateReminders())
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ReminderStatus>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all')
  const [dateRange, setDateRange] = useState<DateRange>({ from: '', to: '' })

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const active = reminders.filter((r) => !r.deleted_at)

  const filtered = useMemo(() => {
    return active.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false
      if (priorityFilter !== 'all' && r.priority !== priorityFilter) return false
      if (dateRange.from && r.reminder_date < dateRange.from) return false
      if (dateRange.to && r.reminder_date > dateRange.to) return false
      if (search.trim()) {
        const q = search.trim().toLowerCase()
        if (!`${r.title} ${r.description ?? ''}`.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [active, statusFilter, priorityFilter, dateRange, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const dueSoonCount = active.filter((r) => r.status === 'PENDING' && daysUntil(r.reminder_date) >= 0 && daysUntil(r.reminder_date) <= 7).length
  const overdueCount = active.filter((r) => r.status === 'PENDING' && daysUntil(r.reminder_date) < 0).length
  const completedCount = active.filter((r) => r.status === 'COMPLETED').length

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormErrors({})
    setModalOpen(true)
  }

  function openEdit(r: ReminderRecord) {
    setEditingId(r.id)
    setForm({
      title: r.title,
      description: r.description ?? '',
      reminder_date: r.reminder_date,
      reminder_time: r.reminder_time ?? '',
      priority: r.priority,
      repeat: r.repeat
    })
    setFormErrors({})
    setModalOpen(true)
  }

  function validate(f: FormState) {
    const errors: Partial<Record<keyof FormState, string>> = {}
    if (!f.title.trim()) errors.title = 'Title is required.'
    if (!f.reminder_date) errors.reminder_date = 'Reminder date is required.'
    if (!f.priority) errors.priority = 'Priority is required.'
    return errors
  }

  function handleSubmit() {
    const errors = validate(form)
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    const now = new Date().toISOString()

    if (editingId) {
      setReminders((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                title: form.title,
                description: form.description || undefined,
                reminder_date: form.reminder_date,
                reminder_time: form.reminder_time || null,
                priority: form.priority,
                repeat: form.repeat,
                updated_at: now
              }
            : r
        )
      )
    } else {
      const newReminder: ReminderRecord = {
        id: `rem-${Date.now()}`,
        title: form.title,
        description: form.description || undefined,
        reminder_date: form.reminder_date,
        reminder_time: form.reminder_time || null,
        priority: form.priority,
        status: 'PENDING',
        repeat: form.repeat,
        attachments: [],
        created_by: 'accountant-01',
        created_at: now,
        updated_at: now,
        deleted_at: null
      }
      setReminders((prev) => [newReminder, ...prev])
    }

    setModalOpen(false)
  }

  function markComplete(id: string) {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: r.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED', updated_at: new Date().toISOString() } : r))
    )
  }

  function handleSoftDelete() {
    if (!pendingDeleteId) return
    setReminders((prev) => prev.map((r) => (r.id === pendingDeleteId ? { ...r, deleted_at: new Date().toISOString() } : r)))
    setPendingDeleteId(null)
  }

  function clearFilters() {
    setSearch('')
    setStatusFilter('all')
    setPriorityFilter('all')
    setDateRange({ from: '', to: '' })
    setPage(1)
  }

  const hasActiveFilters = search || statusFilter !== 'all' || priorityFilter !== 'all' || dateRange.from || dateRange.to

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="px-5 lg:px-8 py-6 space-y-6 max-w-[1400px]">
          {/* Header */}
          <section className="animate-rise flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-display text-base font-semibold text-ink">Reminders</h1>
              <p className="text-xs text-muted mt-0.5">Alerts for upcoming financial obligations — due-soon items surface on the dashboard</p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 bg-ink text-white rounded-lg px-4 py-2 text-xs font-medium hover:bg-ink/90 transition-colors"
            >
              <Plus size={14} /> Add Reminder
            </button>
          </section>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard label="Due Within 7 Days" value={String(dueSoonCount)} tone="amber" Icon={AlarmClock} />
            <SummaryCard label="Overdue" value={String(overdueCount)} tone="negative" Icon={AlertTriangle} />
            <SummaryCard label="Completed" value={String(completedCount)} tone="positive" Icon={CheckCircle2} />
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl border border-line shadow-card p-4 animate-rise">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative lg:col-span-2">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  className={`${inputClass} pl-9`}
                  placeholder="Search title or description…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                />
              </div>
              <select
                className={inputClass}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as typeof statusFilter)
                  setPage(1)
                }}
              >
                <option value="all">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <select
                className={inputClass}
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value as typeof priorityFilter)
                  setPage(1)
                }}
              >
                <option value="all">All Priorities</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
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
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Reminders · {filtered.length} matched</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted w-8"></th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted">Date</th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted">Title</th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted">Priority</th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted">Status</th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted">Repeat</th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted text-center">Files</th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-5 py-10 text-center text-sm text-muted">
                        No reminders match the current filters.
                      </td>
                    </tr>
                  )}
                  {paged.map((r) => {
                    const overdue = r.status === 'PENDING' && daysUntil(r.reminder_date) < 0
                    const pTone = toneMap[priorityTone[r.priority]]
                    return (
                      <tr key={r.id} className="border-b border-line last:border-0 hover:bg-paper/60 transition-colors">
                        <td className="px-5 py-3">
                          <button
                            onClick={() => markComplete(r.id)}
                            className={r.status === 'COMPLETED' ? 'text-positive' : 'text-muted hover:text-ink'}
                            title={r.status === 'COMPLETED' ? 'Mark pending' : 'Mark complete'}
                          >
                            {r.status === 'COMPLETED' ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                          </button>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`font-mono tabular text-xs ${overdue ? 'text-negative font-medium' : 'text-muted'}`}>
                            {formatDate(r.reminder_date)}
                            {r.reminder_time ? ` · ${r.reminder_time}` : ''}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <p className={`text-ink ${r.status === 'COMPLETED' ? 'line-through text-muted' : ''}`}>{r.title}</p>
                          {r.description && <p className="text-xs text-muted mt-0.5 line-clamp-1">{r.description}</p>}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${pTone.bg} ${pTone.text}`}>
                            {r.priority}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${
                              r.status === 'COMPLETED' ? 'bg-positive-soft text-positive' : 'bg-amber-soft text-amber'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {r.repeat === 'NONE' ? (
                            <span className="text-line text-xs">—</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-muted">
                              <Repeat size={11} /> {r.repeat}
                            </span>
                          )}
                        </td>
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
                    )
                  })}
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
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card rounded-xl border border-line shadow-panel">
            <div className="px-6 py-4 border-b border-line flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-ink">{editingId ? 'Edit Reminder' : 'Add Reminder'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-md text-muted hover:text-ink hover:bg-paper">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <FieldLabel required>Title</FieldLabel>
                <input
                  className={inputClass}
                  placeholder="e.g., Pay Office Rent"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
                {formErrors.title && <p className="mt-1 text-xs text-negative">{formErrors.title}</p>}
              </div>
              <div>
                <FieldLabel required>Reminder Date</FieldLabel>
                <input
                  type="date"
                  className={inputClass}
                  value={form.reminder_date}
                  onChange={(e) => setForm((f) => ({ ...f, reminder_date: e.target.value }))}
                />
                {formErrors.reminder_date && <p className="mt-1 text-xs text-negative">{formErrors.reminder_date}</p>}
              </div>
              <div>
                <FieldLabel>Reminder Time</FieldLabel>
                <input
                  type="time"
                  className={inputClass}
                  value={form.reminder_time}
                  onChange={(e) => setForm((f) => ({ ...f, reminder_time: e.target.value }))}
                />
              </div>
              <div>
                <FieldLabel required>Priority</FieldLabel>
                <select
                  className={inputClass}
                  value={form.priority}
                  onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as Priority }))}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel>Repeat</FieldLabel>
                <select
                  className={inputClass}
                  value={form.repeat}
                  onChange={(e) => setForm((f) => ({ ...f, repeat: e.target.value as RepeatCycle }))}
                >
                  {REPEAT_CYCLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Description</FieldLabel>
                <textarea
                  rows={3}
                  className={inputClass}
                  placeholder="Additional context or instructions…"
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
                {editingId ? 'Save Changes' : 'Add Reminder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-card rounded-xl border border-line shadow-panel p-6">
            <h2 className="font-display text-base font-semibold text-ink">Delete reminder?</h2>
            <p className="mt-2 text-sm text-muted">
              This soft-deletes the reminder (sets deleted_at). It can still be recovered from the database if needed.
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
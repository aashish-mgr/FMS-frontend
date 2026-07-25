import { useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import { Search, X, ChevronLeft, ChevronRight, Eye, Activity, ShieldAlert, Trash2 } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import { AUDIT_ACTIONS, ENTITY_TYPES } from '../../types/auditTypes'
import type { AuditLogRecord, AuditAction, EntityType, DateRange } from '../../types/auditTypes'
import { useGetAllQuery } from '../../store/api/auditApi'

const PAGE_SIZE = 15
const TODAY = new Date().toISOString().slice(0, 10)

type Tone = 'positive' | 'negative' | 'indigo' | 'amber'

const toneMap: Record<Tone, { text: string; bg: string; ring: string }> = {
  positive: { text: 'text-positive', bg: 'bg-positive-soft', ring: 'ring-positive/15' },
  negative: { text: 'text-negative', bg: 'bg-negative-soft', ring: 'ring-negative/15' },
  indigo: { text: 'text-indigo', bg: 'bg-indigo-soft', ring: 'ring-indigo/15' },
  amber: { text: 'text-amber', bg: 'bg-amber-soft', ring: 'ring-amber/15' }
}

// Action key -> badge tone. CREATED = positive, UPDATED = amber, DELETED = negative,
// auth events = indigo (failed login is the one exception -> negative).
function actionTone(action: AuditAction): Tone {
  if (action.endsWith('DELETED') || action === 'USER_LOGIN_FAILED') return 'negative'
  if (action.endsWith('UPDATED')) return 'amber'
  if (action.endsWith('CREATED') || action === 'ATTACHMENT_UPLOADED' || action === 'REMINDER_COMPLETED') return 'positive'
  return 'indigo'
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

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString('en-NP', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function JsonBlock({ label, value }: { label: string; value: Record<string, unknown> | null }) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted mb-1.5">{label}</p>
      <pre className="bg-paper border border-line rounded-lg p-3 font-mono text-xs text-ink overflow-auto max-h-56 whitespace-pre-wrap break-words">
        {value ? JSON.stringify(value, null, 2) : '—'}
      </pre>
    </div>
  )
}

/* ----------------------------------- Page ------------------------------------ */

export default function AuditLog() {
  const {data , refetch, isLoading} = useGetAllQuery(undefined,{refetchOnMountOrArgChange: true});
  const logs = data?.records;
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [entityFilter, setEntityFilter] = useState<'all' | EntityType>('all')
  const [actionFilter, setActionFilter] = useState<'all' | AuditAction>('all')
  const [dateRange, setDateRange] = useState<DateRange>({ from: '', to: '' })
  const [viewingLog, setViewingLog] = useState<AuditLogRecord | null>(null)

  const filtered = useMemo(() => {
    return logs?.filter((l) => {
      if (entityFilter !== 'all' && l.entityType !== entityFilter) return false
      if (actionFilter !== 'all' && l.action !== actionFilter) return false
      const logDate = l.createdAt.slice(0, 10)
      if (dateRange.from && logDate < dateRange.from) return false
      if (dateRange.to && logDate > dateRange.to) return false
      if (search.trim()) {
        const q = search.trim().toLowerCase()
        const haystack = [l.userName, l.entityId, l.ipAddress, l.action].filter(Boolean).join(' ').toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    }) ?? []
  }, [logs, entityFilter, actionFilter, dateRange, search])

  const totalPages = Math.max(1, Math.ceil(Number(filtered?.length) / PAGE_SIZE))
  const paged = filtered?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const todaysEventCount = logs?.filter((l) => l.createdAt.slice(0, 10) === TODAY).length
  console.log(logs?.filter((l) => l.createdAt.slice(0, 10) === TODAY))
  const failedLoginCount = logs?.filter((l) => l.action === 'USER_LOGIN_FAILED').length
  const deletionCount = logs?.filter((l) => l.action.endsWith('DELETED')).length

  function clearFilters() {
    setSearch('')
    setEntityFilter('all')
    setActionFilter('all')
    setDateRange({ from: '', to: '' })
    setPage(1)
  }

  const hasActiveFilters = search || entityFilter !== 'all' || actionFilter !== 'all' || dateRange.from || dateRange.to

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="px-5 lg:px-8 py-6 space-y-6 max-w-[1400px]">
          {/* Header */}
          <section className="animate-rise">
            <h1 className="font-display text-base font-semibold text-ink">Audit Trail</h1>
            <p className="text-xs text-muted mt-0.5">
              Immutable record of every significant action across the system — read-only
            </p>
          </section>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard label="Today's Events" value={String(todaysEventCount)} tone="indigo" Icon={Activity} />
            <SummaryCard label="Failed Logins" value={String(failedLoginCount)} tone="negative" Icon={ShieldAlert} />
            <SummaryCard label="Deletions Logged" value={String(deletionCount)} tone="amber" Icon={Trash2} />
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl border border-line shadow-card p-4 animate-rise">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative lg:col-span-2">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  className={`${inputClass} pl-9`}
                  placeholder="Search user, entity ID, IP address…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                />
              </div>
              <select
                className={inputClass}
                value={entityFilter}
                onChange={(e) => {
                  setEntityFilter(e.target.value as typeof entityFilter)
                  setPage(1)
                }}
              >
                <option value="all">All Entities</option>
                {ENTITY_TYPES.map((e: string ) => (
                  <option key={e} value={e}>
                    {e.charAt(0).toUpperCase() + e.slice(1)}
                  </option>
                ))}
              </select>
              <select
                className={inputClass}
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value as typeof actionFilter)
                  setPage(1)
                }}
              >
                <option value="all">All Actions</option>
                {AUDIT_ACTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3 max-w-md">
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
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Audit Log · {filtered?.length} events</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted">Timestamp</th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted">User</th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted">Action</th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted">Entity</th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted">IP Address</th>
                    <th className="px-5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-muted text-right">Details</th>
                  </tr>
                </thead>
                {isLoading ? (<p>Loading...</p>) : (<tbody>
                  {paged?.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-sm text-muted">
                        No audit events match the current filters.
                      </td>
                    </tr>
                  )}
                  {paged?.map((l) => {
                    const t = toneMap[actionTone(l.action)]
                    return (
                      <tr key={l.id} className="border-b border-line last:border-0 hover:bg-paper/60 transition-colors">
                        <td className="px-5 py-3 font-mono tabular text-xs text-muted whitespace-nowrap">{formatTimestamp(l.createdAt)}</td>
                        <td className="px-5 py-3 text-ink">{l.userName ?? <span className="text-muted">System</span>}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium font-mono ${t.bg} ${t.text}`}>
                            {l.action}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-muted">
                          {l.entityType}
                          {l.entityId && <span className="text-xs text-line ml-1">#{l.entityId.split('-').pop()}</span>}
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-muted">{l.ipAddress ?? '—'}</td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => setViewingLog(l)}
                            className="inline-flex items-center gap-1 p-1.5 rounded-md text-muted hover:text-ink hover:bg-paper"
                            title="View details"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>)}
                
              </table>
            </div>

            <div className="px-5 py-3 border-t border-line flex items-center justify-between">
              <span className="font-mono tabular text-[11px] text-muted">
                Showing {filtered?.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, Number(filtered?.length))} of{' '}
                {filtered?.length}
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

      {/* Read-only detail drawer */}
      {viewingLog && (
        <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-card rounded-xl border border-line shadow-panel">
            <div className="px-6 py-4 border-b border-line flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-ink">Event Details</h2>
              <button onClick={() => setViewingLog(null)} className="p-1 rounded-md text-muted hover:text-ink hover:bg-paper">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Action</p>
                  <p className="font-mono text-sm text-ink mt-1">{viewingLog.action}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Timestamp</p>
                  <p className="font-mono tabular text-sm text-ink mt-1">{formatTimestamp(viewingLog.createdAt)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted">User</p>
                  <p className="text-sm text-ink mt-1">{viewingLog.userName ?? 'System'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted">IP Address</p>
                  <p className="font-mono text-sm text-ink mt-1">{viewingLog.ipAddress ?? '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Entity Type</p>
                  <p className="text-sm text-ink mt-1 capitalize">{viewingLog.entityType}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Entity ID</p>
                  <p className="font-mono text-sm text-ink mt-1">{viewingLog.entityId ?? '—'}</p>
                </div>
              </div>

              <div className="ledger-stitch" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <JsonBlock label="Before" value={viewingLog.oldValues} />
                <JsonBlock label="After" value={viewingLog.newValues} />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-line flex justify-end">
              <button
                onClick={() => setViewingLog(null)}
                className="px-4 py-2 rounded-lg border border-line text-sm font-medium text-muted hover:text-ink transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
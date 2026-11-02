import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  Building2,
  Check,
  Clock,
  Globe2,
  RefreshCw,
  Settings,
  ShieldAlert
} from 'lucide-react'
import { useDispatch } from 'react-redux'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import { usePermissions } from '../../lib/usePermissions'
import { getApiErrorMessage } from '../../lib/getApiErrorMessage'
import {
  useGetWorkspaceQuery,
  useUpdateWorkspaceMutation
} from '../../store/api/workspaceApi'
import { setWorkspace } from '../../store/slices/authSlice'

const inputClass =
  'mt-1.5 w-full rounded-lg border border-line bg-card px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-ink/40'

function formatDate(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function statusTone(status: string) {
  if (status === 'ACTIVE') return 'bg-positive-soft text-positive'
  if (status === 'TRIAL') return 'bg-amber-soft text-amber'
  return 'bg-negative-soft text-negative'
}

export default function WorkspaceSettings() {
  const dispatch = useDispatch()
  const { isAdmin } = usePermissions()

  const {
    data: workspace,
    isLoading,
    isError,
    error,
    refetch
  } = useGetWorkspaceQuery(undefined, { skip: !isAdmin })
  const [updateWorkspace, { isLoading: isSaving }] =
    useUpdateWorkspaceMutation()

  const [name, setName] = useState('')
  const [currency, setCurrency] = useState('NPR')
  const [timezone, setTimezone] = useState('Asia/Kathmandu')
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!workspace) return
    setName(workspace.name)
    setCurrency(workspace.settings?.currency ?? 'NPR')
    setTimezone(workspace.settings?.timezone ?? 'Asia/Kathmandu')
  }, [workspace])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    setSuccess(null)

    if (name.trim().length < 2) {
      setFormError('Workspace name must be at least 2 characters.')
      return
    }

    const normalizedCurrency = currency.trim().toUpperCase()

    if (!/^[A-Z]{3}$/.test(normalizedCurrency)) {
      setFormError('Currency must be a 3-letter code, such as NPR.')
      return
    }

    if (!timezone.trim()) {
      setFormError('Timezone is required.')
      return
    }

    try {
      const updated = await updateWorkspace({
        name: name.trim(),
        settings: {
          currency: normalizedCurrency,
          timezone: timezone.trim()
        }
      }).unwrap()

      dispatch(setWorkspace(updated))
      setSuccess('Workspace settings updated.')
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, 'Could not update workspace settings.')
      )
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen bg-paper">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <Topbar />
          <main className="px-5 lg:px-8 py-6">
            <div className="mx-auto max-w-lg rounded-xl border border-line bg-card p-8 text-center shadow-card">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-negative-soft text-negative">
                <ShieldAlert size={22} />
              </div>
              <h1 className="mt-4 font-display text-xl font-semibold text-ink">
                Admin access required
              </h1>
              <p className="mt-2 text-sm text-muted">
                Only workspace admins can view or change workspace settings.
              </p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="px-5 lg:px-8 py-6 space-y-6 max-w-[1200px]">
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wide">
              Workspace
            </p>
            <h1 className="font-display text-2xl font-semibold text-ink mt-1">
              Workspace settings
            </h1>
            <p className="text-sm text-muted mt-1">
              Update the workspace identity and regional defaults used across the
              app.
            </p>
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-line bg-card p-8 text-center text-muted shadow-card">
              <RefreshCw size={18} className="mx-auto animate-spin" />
              <p className="mt-3 text-sm">Loading workspace settings…</p>
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-line bg-card p-8 text-center shadow-card">
              <p className="text-sm text-negative">
                {getApiErrorMessage(
                  error,
                  'Could not load workspace settings.'
                )}
              </p>
              <button
                onClick={() => refetch()}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs font-medium text-muted hover:text-ink transition-colors"
              >
                <RefreshCw size={14} />
                Try again
              </button>
            </div>
          ) : workspace ? (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl border border-line bg-card p-5 shadow-card xl:col-span-2"
              >
                <div className="flex items-center gap-2">
                  <Settings size={17} className="text-muted" />
                  <h2 className="font-display text-base font-semibold text-ink">
                    General
                  </h2>
                </div>

                {formError ? (
                  <div className="rounded-lg border border-line bg-negative-soft px-3 py-2 text-sm text-negative">
                    {formError}
                  </div>
                ) : null}

                {success ? (
                  <div className="flex items-center gap-2 rounded-lg border border-line bg-positive-soft px-3 py-2 text-sm text-positive">
                    <Check size={15} />
                    {success}
                  </div>
                ) : null}

                <div>
                  <label className="text-xs font-medium text-muted">
                    Workspace name
                  </label>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    minLength={2}
                    className={inputClass}
                    placeholder="Your workspace name"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-muted">
                      <Globe2 size={13} />
                      Currency
                    </label>
                    <input
                      value={currency}
                      onChange={(event) =>
                        setCurrency(event.target.value.toUpperCase())
                      }
                      maxLength={3}
                      className={inputClass}
                      placeholder="NPR"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-muted">
                      <Clock size={13} />
                      Timezone
                    </label>
                    <input
                      value={timezone}
                      onChange={(event) => setTimezone(event.target.value)}
                      className={inputClass}
                      placeholder="Asia/Kathmandu"
                    />
                  </div>
                </div>

                <div className="flex justify-end border-t border-line pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90 transition-colors disabled:opacity-60"
                  >
                    {isSaving ? (
                      <RefreshCw size={15} className="animate-spin" />
                    ) : (
                      <Check size={15} />
                    )}
                    Save changes
                  </button>
                </div>
              </form>

              <aside className="space-y-4">
                <div className="rounded-xl border border-line bg-card p-5 shadow-card">
                  <div className="flex items-center gap-2">
                    <Building2 size={17} className="text-muted" />
                    <h2 className="font-display text-base font-semibold text-ink">
                      Workspace
                    </h2>
                  </div>

                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted">Slug</dt>
                      <dd className="font-mono text-xs text-ink">
                        {workspace.slug}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted">Status</dt>
                      <dd>
                        <span
                          className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ${statusTone(
                            workspace.status
                          )}`}
                        >
                          {workspace.status}
                        </span>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted">Plan</dt>
                      <dd className="font-medium capitalize text-ink">
                        {workspace.plan}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-muted">Created</dt>
                      <dd className="font-mono text-xs text-ink">
                        {formatDate(workspace.createdAt)}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-xl border border-line bg-card p-5 text-sm text-muted shadow-card">
                  <p className="font-medium text-ink">About these settings</p>
                  <p className="mt-2">
                    Currency and timezone are stored in workspace settings and
                    are used as defaults for new records and reports.
                  </p>
                </div>
              </aside>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}

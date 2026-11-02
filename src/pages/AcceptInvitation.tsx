import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Clock,
  LogOut,
  Mail,
  RefreshCw,
  ShieldCheck
} from 'lucide-react'
import { useLogoutMutation } from '../store/api/authApi'
import {
  useAcceptInvitationMutation,
  useGetInvitationByTokenQuery
} from '../store/api/workspaceApi'
import {
  clearAuth,
  setAccessToken,
  setAuthCredentials,
  setIsAuthenticated,
  setWorkspace
} from '../store/slices/authSlice'
import type { RootState } from '../store'
import { getApiErrorMessage } from '../lib/getApiErrorMessage'

const inputClass =
  'mt-1.5 w-full rounded-lg border border-line bg-card px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-ink/40'

function formatDateTime(value?: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatRole(role: string) {
  return role === 'superAdmin'
    ? 'Super Admin'
    : role.charAt(0).toUpperCase() + role.slice(1)
}

export default function AcceptInvitation() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const authState = useSelector((state: RootState) => state.auth)

  const {
    data: invitation,
    isLoading,
    isError,
    error
  } = useGetInvitationByTokenQuery(token, { skip: !token })
  const [acceptInvitation, { isLoading: isAccepting }] =
    useAcceptInvitationMutation()
  const [logout] = useLogoutMutation()

  const [userName, setUserName] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    if (userPassword.length < 8) {
      setFormError('Password must be at least 8 characters.')
      return
    }

    try {
      const result = await acceptInvitation({
        token,
        userName: userName.trim(),
        userPassword
      }).unwrap()

      dispatch(setAuthCredentials(result.user))
      dispatch(setWorkspace(result.tenant))
      dispatch(setAccessToken(result.accessToken))
      dispatch(setIsAuthenticated(true))
      navigate('/dashboard')
    } catch (error) {
      setFormError(
        getApiErrorMessage(
          error,
          'Could not accept the invitation. Please try again.'
        )
      )
    }
  }

  async function handleLogout() {
    try {
      await logout().unwrap()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      dispatch(clearAuth())
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-ink text-white">
            <ShieldCheck size={20} />
          </div>
          <h1 className="mt-3 font-display text-xl font-semibold text-ink">
            Join your workspace
          </h1>
          <p className="mt-1 text-sm text-muted">
            Accept the invitation to create your account.
          </p>
        </div>

        {!token ? (
          <div className="rounded-xl border border-line bg-card p-6 text-center shadow-card">
            <AlertTriangle size={22} className="mx-auto text-negative" />
            <h2 className="mt-3 font-display text-base font-semibold text-ink">
              Invitation link missing
            </h2>
            <p className="mt-1 text-sm text-muted">
              This page needs a valid invitation token.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90 transition-colors"
            >
              Go to login
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : isLoading ? (
          <div className="rounded-xl border border-line bg-card p-8 text-center text-muted shadow-card">
            <RefreshCw size={18} className="mx-auto animate-spin" />
            <p className="mt-3 text-sm">Checking your invitation…</p>
          </div>
        ) : isError || !invitation ? (
          <div className="rounded-xl border border-line bg-card p-6 text-center shadow-card">
            <AlertTriangle size={22} className="mx-auto text-negative" />
            <h2 className="mt-3 font-display text-base font-semibold text-ink">
              Invitation unavailable
            </h2>
            <p className="mt-1 text-sm text-muted">
              {getApiErrorMessage(
                error,
                'This invitation is invalid or has expired. Ask a workspace admin to send a new one.'
              )}
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90 transition-colors"
            >
              Go to login
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-line bg-card shadow-panel">
            <div className="border-b border-line px-5 py-4">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-muted" />
                <p className="font-display text-sm font-semibold text-ink">
                  {invitation.workspace.name}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Mail size={13} />
                  {invitation.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={13} />
                  {formatRole(invitation.role)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={13} />
                  Expires {formatDateTime(invitation.expiresAt)}
                </span>
              </div>
            </div>

            {authState.isAuthenticated ? (
              <div className="mx-5 mt-4 flex items-start justify-between gap-3 rounded-lg border border-line bg-amber-soft px-3 py-2.5 text-xs text-amber">
                <p>
                  You are signed in as {authState.user?.userName}. Accepting this
                  invitation will replace your current session.
                </p>
                <button
                  onClick={handleLogout}
                  className="inline-flex shrink-0 items-center gap-1 font-medium underline underline-offset-2"
                >
                  <LogOut size={12} />
                  Log out
                </button>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
              {formError ? (
                <div className="rounded-lg border border-line bg-negative-soft px-3 py-2 text-sm text-negative">
                  {formError}
                </div>
              ) : null}

              <div>
                <label className="text-xs font-medium text-muted">
                  Your name
                </label>
                <input
                  required
                  minLength={2}
                  value={userName}
                  onChange={(event) => setUserName(event.target.value)}
                  placeholder="Aashish Magar"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={userPassword}
                  onChange={(event) => setUserPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={isAccepting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90 transition-colors disabled:opacity-60"
              >
                {isAccepting ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <ArrowRight size={15} />
                )}
                {isAccepting ? 'Joining workspace…' : 'Accept invitation'}
              </button>

              <p className="text-center text-xs text-muted">
                Already have an account?{' '}
                <Link to="/" className="font-medium text-ink hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

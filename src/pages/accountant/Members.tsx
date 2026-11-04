import { useState } from 'react'
import type { ComponentType, FormEvent } from 'react'
import {
  AlertTriangle,
  Check,
  Clock,
  Copy,
  Crown,
  Mail,
  RefreshCw,
  Send,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X
} from 'lucide-react'
import { useSelector } from 'react-redux'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import { usePermissions } from '../../lib/usePermissions'
import { getApiErrorMessage } from '../../lib/getApiErrorMessage'
import {
  useCreateInvitationMutation,
  useGetAssignableRolesQuery,
  useGetInvitationsQuery,
  useGetMembersQuery,
  useRemoveMemberMutation,
  useResendInvitationMutation,
  useRevokeInvitationMutation,
  useUpdateMemberRoleMutation
} from '../../store/api/workspaceApi'
import type {
  AssignableRole,
  CreatedInvitation,
  WorkspaceInvitation,
  WorkspaceMember
} from '../../types/workspaceTypes'
import type { RootState } from '../../store'

const DEFAULT_ASSIGNABLE_ROLES: AssignableRole[] = ['admin', 'accountant']

const roleTone: Record<string, string> = {
  admin: 'bg-amber-soft text-amber',
  superAdmin: 'bg-negative-soft text-negative',
  accountant: 'bg-indigo-soft text-indigo'
}

function formatRole(role: string) {
  return role === 'superAdmin'
    ? 'Super Admin'
    : role.charAt(0).toUpperCase() + role.slice(1)
}

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

function formatExpiryHint(value?: string | null) {
  if (!value) return ''
  const expiresAt = new Date(value).getTime()
  if (Number.isNaN(expiresAt)) return ''

  const remainingMs = expiresAt - Date.now()
  if (remainingMs <= 0) return 'Expired'

  const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000))
  if (remainingDays <= 1) return 'Expires within a day'
  return `Expires in ${remainingDays} days`
}

function isInvitationExpired(invitation: WorkspaceInvitation) {
  return (
    invitation.status === 'EXPIRED' ||
    new Date(invitation.expiresAt).getTime() <= Date.now()
  )
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function SummaryCard({
  label,
  value,
  hint,
  icon: Icon,
  accent
}: {
  label: string
  value: string
  hint: string
  icon: ComponentType<{ size?: number; className?: string }>
  accent: string
}) {
  return (
    <div className="bg-card border border-line rounded-xl p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wide">
            {label}
          </p>
          <p className="font-display text-2xl font-semibold text-ink mt-2">
            {value}
          </p>
          <p className="text-xs text-muted mt-1">{hint}</p>
        </div>
        <div className={`grid place-items-center w-10 h-10 rounded-lg ${accent}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  )
}

export default function Members() {
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const { isAdmin } = usePermissions()

  const {
    data: members = [],
    isLoading: membersLoading,
    isError: membersIsError,
    error: membersError,
    refetch: refetchMembers
  } = useGetMembersQuery()
  const {
    data: invitations = [],
    isLoading: invitationsLoading,
    isError: invitationsIsError,
    error: invitationsError,
    refetch: refetchInvitations
  } = useGetInvitationsQuery(undefined, { skip: !isAdmin })
  const { data: assignableRoles = [] } = useGetAssignableRolesQuery()

  const [createInvitation, { isLoading: isCreatingInvitation }] =
    useCreateInvitationMutation()
  const [resendInvitation, { isLoading: isResendingInvitation }] =
    useResendInvitationMutation()
  const [updateMemberRole, { isLoading: isUpdatingRole }] =
    useUpdateMemberRoleMutation()
  const [removeMember, { isLoading: isRemovingMember }] =
    useRemoveMemberMutation()
  const [revokeInvitation, { isLoading: isRevokingInvitation }] =
    useRevokeInvitationMutation()

  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<AssignableRole>('accountant')
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [createdInvitation, setCreatedInvitation] =
    useState<CreatedInvitation | null>(null)
  const [resendingInvitationId, setResendingInvitationId] = useState<
    string | null
  >(null)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)
  const [pendingRemove, setPendingRemove] = useState<WorkspaceMember | null>(
    null
  )
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  const roleOptions: string[] = assignableRoles.length
    ? assignableRoles
    : DEFAULT_ASSIGNABLE_ROLES
  const adminCount = members.filter(
    (member) =>
      member.roles.includes('admin') || member.roles.includes('superAdmin')
  ).length
  const pendingInvitationCount = invitations.filter(
    (invitation) => !isInvitationExpired(invitation)
  ).length
  const acceptUrl = createdInvitation
    ? createdInvitation.acceptUrl ||
      `${window.location.origin}/accept-invitation?token=${encodeURIComponent(
        createdInvitation.token
      )}`
    : ''

  function openInviteModal() {
    setInviteError(null)
    setInviteOpen(true)
  }

  async function handleInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setInviteError(null)
    setActionError(null)
    setActionMessage(null)

    try {
      const invitation = await createInvitation({
        userEmail: inviteEmail.trim(),
        roleName: inviteRole
      }).unwrap()

      setCreatedInvitation(invitation)
      setInviteOpen(false)
      setInviteEmail('')
      setInviteRole('accountant')
      setCopied(false)
      setCopyError(null)
      setActionMessage(
        invitation.emailSent
          ? `Invitation created and emailed to ${invitation.email}.`
          : `Invitation created for ${invitation.email}. The email could not be sent automatically; copy the link below and share it manually.`
      )
    } catch (error) {
      setInviteError(
        getApiErrorMessage(error, 'Could not create the invitation.')
      )
    }
  }

  async function handleRoleChange(member: WorkspaceMember, roleName: string) {
    setActionError(null)
    setActionMessage(null)

    try {
      await updateMemberRole({
        userId: member.id,
        roleName
      }).unwrap()
      setActionMessage(`Role updated for ${member.userName}.`)
    } catch (error) {
      setActionError(
        getApiErrorMessage(error, 'Could not update the member role.')
      )
    }
  }

  async function handleRemove() {
    if (!pendingRemove) return

    setActionError(null)
    setActionMessage(null)

    try {
      await removeMember(pendingRemove.id).unwrap()
      setActionMessage(`${pendingRemove.userName} was removed from the workspace.`)
      setPendingRemove(null)
    } catch (error) {
      setActionError(
        getApiErrorMessage(error, 'Could not remove the workspace member.')
      )
    }
  }

  async function handleRevoke(invitation: WorkspaceInvitation) {
    setActionError(null)
    setActionMessage(null)

    try {
      await revokeInvitation(invitation.id).unwrap()
      setActionMessage(`Invitation for ${invitation.email} was revoked.`)
    } catch (error) {
      setActionError(
        getApiErrorMessage(error, 'Could not revoke the invitation.')
      )
    }
  }

  async function handleResend(invitation: WorkspaceInvitation) {
    setActionError(null)
    setActionMessage(null)
    setResendingInvitationId(invitation.id)

    try {
      const refreshed = await resendInvitation(invitation.id).unwrap()
      setCreatedInvitation(refreshed)
      setCopied(false)
      setCopyError(null)
      setActionMessage(
        refreshed.emailSent
          ? `Invitation emailed again to ${refreshed.email}.`
          : `New invitation link generated for ${refreshed.email}. The email could not be sent automatically; copy the link below and share it manually.`
      )
    } catch (error) {
      setActionError(
        getApiErrorMessage(error, 'Could not resend the invitation.')
      )
    } finally {
      setResendingInvitationId(null)
    }
  }

  async function copyInvitationLink() {
    if (!acceptUrl) return

    setCopyError(null)

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard unavailable')
      }
      await navigator.clipboard.writeText(acceptUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopyError(
        'Could not copy automatically. Select the invitation link and copy it manually.'
      )
    }
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="px-5 lg:px-8 py-6 space-y-6 max-w-[1400px]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium text-muted uppercase tracking-wide">
                Workspace
              </p>
              <h1 className="font-display text-2xl font-semibold text-ink mt-1">
                Members
              </h1>
              <p className="text-sm text-muted mt-1">
                Manage who can access this workspace and what they are allowed to
                do.
              </p>
            </div>

            {isAdmin ? (
              <button
                onClick={openInviteModal}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:bg-ink/90 transition-colors"
              >
                <UserPlus size={16} />
                Invite member
              </button>
            ) : null}
          </div>

          {!isAdmin ? (
            <div className="rounded-xl border border-line bg-card px-4 py-3 text-sm text-muted">
              You can view workspace members. Only admins can invite people or
              change roles.
            </div>
          ) : null}

          {actionError ? (
            <div className="flex items-start gap-2 rounded-xl border border-line bg-negative-soft px-4 py-3 text-sm text-negative">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>{actionError}</span>
            </div>
          ) : null}

          {actionMessage ? (
            <div className="flex items-start gap-2 rounded-xl border border-line bg-positive-soft px-4 py-3 text-sm text-positive">
              <Check size={16} className="mt-0.5 shrink-0" />
              <span>{actionMessage}</span>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <SummaryCard
              label="Members"
              value={String(members.length)}
              hint="People with workspace access"
              icon={Users}
              accent="bg-indigo-soft text-indigo"
            />
            <SummaryCard
              label="Admins"
              value={String(adminCount)}
              hint="Can manage the workspace"
              icon={Crown}
              accent="bg-amber-soft text-amber"
            />
            {isAdmin ? (
              <SummaryCard
                label="Pending invitations"
                value={String(pendingInvitationCount)}
                hint="Waiting to be accepted"
                icon={Clock}
                accent="bg-positive-soft text-positive"
              />
            ) : null}
          </div>

          <section className="bg-card border border-line rounded-xl shadow-card overflow-hidden">
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line">
              <div>
                <h2 className="font-display text-base font-semibold text-ink">
                  Workspace members
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  {members.length} {members.length === 1 ? 'person' : 'people'}{' '}
                  in this workspace
                </p>
              </div>
              <ShieldCheck size={18} className="text-muted" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-paper text-left text-[11px] uppercase tracking-wide text-muted">
                    <th className="px-5 py-3 font-medium">Member</th>
                    <th className="px-5 py-3 font-medium">Role</th>
                    <th className="px-5 py-3 font-medium">Joined</th>
                    {isAdmin ? (
                      <th className="px-5 py-3 font-medium text-right">
                        Actions
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {membersLoading ? (
                    <tr>
                      <td
                        colSpan={isAdmin ? 4 : 3}
                        className="px-5 py-10 text-center text-muted"
                      >
                        Loading members…
                      </td>
                    </tr>
                  ) : membersIsError ? (
                    <tr>
                      <td colSpan={isAdmin ? 4 : 3} className="px-5 py-10">
                        <div className="flex flex-col items-center gap-3 text-center">
                          <p className="text-sm text-negative">
                            {getApiErrorMessage(
                              membersError,
                              'Could not load workspace members.'
                            )}
                          </p>
                          <button
                            onClick={() => refetchMembers()}
                            className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs font-medium text-muted hover:text-ink transition-colors"
                          >
                            <RefreshCw size={14} />
                            Try again
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : members.length === 0 ? (
                    <tr>
                      <td
                        colSpan={isAdmin ? 4 : 3}
                        className="px-5 py-10 text-center text-muted"
                      >
                        No members found.
                      </td>
                    </tr>
                  ) : (
                    members.map((member) => {
                      const isSelf = member.id === currentUser?.id
                      const isSuperAdmin = member.roles.includes('superAdmin')
                      const canManageMember =
                        isAdmin && !isSelf && !isSuperAdmin

                      return (
                        <tr
                          key={member.id}
                          className="border-b border-line last:border-0"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="grid place-items-center w-9 h-9 shrink-0 rounded-full bg-ink text-white text-[11px] font-semibold font-mono">
                                {getInitials(member.userName)}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-ink truncate">
                                    {member.userName}
                                  </p>
                                  {isSelf ? (
                                    <span className="rounded-full bg-line px-2 py-0.5 text-[10px] font-medium text-muted">
                                      You
                                    </span>
                                  ) : null}
                                </div>
                                <p className="text-xs text-muted truncate">
                                  {member.userEmail}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            {canManageMember ? (
                              <select
                                value={member.roles[0] ?? 'accountant'}
                                onChange={(event) =>
                                  handleRoleChange(member, event.target.value)
                                }
                                disabled={isUpdatingRole}
                                className="rounded-lg border border-line bg-card px-2.5 py-1.5 text-xs text-ink outline-none focus:border-ink/40 disabled:opacity-60"
                              >
                                {roleOptions.map((role) => (
                                  <option key={role} value={role}>
                                    {formatRole(role)}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {member.roles.length ? (
                                  member.roles.map((role) => (
                                    <span
                                      key={role}
                                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${
                                        roleTone[role] ?? 'bg-line text-muted'
                                      }`}
                                    >
                                      {formatRole(role)}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-muted">—</span>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-4 font-mono text-xs text-muted">
                            {formatDate(member.createdAt)}
                          </td>
                          {isAdmin ? (
                            <td className="px-5 py-4 text-right">
                              {canManageMember ? (
                                <button
                                  onClick={() => {
                                    setActionError(null)
                                    setPendingRemove(member)
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-muted hover:bg-negative-soft hover:text-negative transition-colors"
                                >
                                  <Trash2 size={14} />
                                  Remove
                                </button>
                              ) : (
                                <span className="text-xs text-muted">—</span>
                              )}
                            </td>
                          ) : null}
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {isAdmin ? (
            <section className="bg-card border border-line rounded-xl shadow-card overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line">
                <div>
                  <h2 className="font-display text-base font-semibold text-ink">
                    Invitations
                  </h2>
                  <p className="text-xs text-muted mt-0.5">
                    Invitations expire after 7 days. Expired invitations can be
                    resent.
                  </p>
                </div>
                <Mail size={18} className="text-muted" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line bg-paper text-left text-[11px] uppercase tracking-wide text-muted">
                      <th className="px-5 py-3 font-medium">Email</th>
                      <th className="px-5 py-3 font-medium">Role</th>
                      <th className="px-5 py-3 font-medium">Invited by</th>
                      <th className="px-5 py-3 font-medium">Expires</th>
                      <th className="px-5 py-3 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitationsLoading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-10 text-center text-muted"
                        >
                          Loading invitations…
                        </td>
                      </tr>
                    ) : invitationsIsError ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-10">
                          <div className="flex flex-col items-center gap-3 text-center">
                            <p className="text-sm text-negative">
                              {getApiErrorMessage(
                                invitationsError,
                                'Could not load invitations.'
                              )}
                            </p>
                            <button
                              onClick={() => refetchInvitations()}
                              className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs font-medium text-muted hover:text-ink transition-colors"
                            >
                              <RefreshCw size={14} />
                              Try again
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : invitations.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-10 text-center text-muted"
                        >
                          No pending or expired invitations.
                        </td>
                      </tr>
                    ) : (
                      invitations.map((invitation) => {
                        const expired = isInvitationExpired(invitation)

                        return (
                          <tr
                            key={invitation.id}
                            className="border-b border-line last:border-0"
                          >
                            <td className="px-5 py-4">
                              <p className="font-medium text-ink">
                                {invitation.email}
                              </p>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                                <span>
                                  Invited {formatDate(invitation.createdAt)}
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                    expired
                                      ? 'bg-negative-soft text-negative'
                                      : 'bg-positive-soft text-positive'
                                  }`}
                                >
                                  {expired ? 'Expired' : 'Pending'}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${
                                  roleTone[invitation.role] ??
                                  'bg-line text-muted'
                                }`}
                              >
                                {formatRole(invitation.role)}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-sm text-muted">
                              {invitation.invitedBy?.userName ?? '—'}
                            </td>
                            <td className="px-5 py-4 text-muted">
                              <p className="font-mono text-xs">
                                {formatDateTime(invitation.expiresAt)}
                              </p>
                              <p className="mt-0.5 text-[11px]">
                                {formatExpiryHint(invitation.expiresAt)}
                              </p>
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => handleResend(invitation)}
                                  disabled={
                                    isResendingInvitation ||
                                    isRevokingInvitation
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-muted hover:bg-indigo-soft hover:text-indigo transition-colors disabled:opacity-60"
                                >
                                  {resendingInvitationId === invitation.id ? (
                                    <RefreshCw
                                      size={14}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Send size={14} />
                                  )}
                                  Resend
                                </button>
                                {!expired ? (
                                  <button
                                    onClick={() => handleRevoke(invitation)}
                                    disabled={
                                      isRevokingInvitation ||
                                      isResendingInvitation
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-muted hover:bg-negative-soft hover:text-negative transition-colors disabled:opacity-60"
                                  >
                                    <X size={14} />
                                    Revoke
                                  </button>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </main>
      </div>

      {inviteOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-line bg-card shadow-panel">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div>
                <h2 className="font-display text-base font-semibold text-ink">
                  Invite a member
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  They will join this workspace after accepting the invitation.
                </p>
              </div>
              <button
                onClick={() => setInviteOpen(false)}
                className="rounded-md p-1.5 text-muted hover:bg-paper hover:text-ink transition-colors"
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleInvite} className="px-6 py-5 space-y-4">
              {inviteError ? (
                <div className="rounded-lg border border-line bg-negative-soft px-3 py-2 text-sm text-negative">
                  {inviteError}
                </div>
              ) : null}

              <div>
                <label className="text-xs font-medium text-muted">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  placeholder="accountant@example.com"
                  className="mt-1.5 w-full rounded-lg border border-line bg-card px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted/60 focus:border-ink/40"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted">Role</label>
                <select
                  value={inviteRole}
                  onChange={(event) =>
                    setInviteRole(event.target.value as AssignableRole)
                  }
                  className="mt-1.5 w-full rounded-lg border border-line bg-card px-3 py-2.5 text-sm text-ink outline-none focus:border-ink/40"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {formatRole(role)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 border-t border-line pt-4">
                <button
                  type="button"
                  onClick={() => setInviteOpen(false)}
                  className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-muted hover:text-ink transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingInvitation}
                  className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90 transition-colors disabled:opacity-60"
                >
                  {isCreatingInvitation ? (
                    <RefreshCw size={15} className="animate-spin" />
                  ) : (
                    <UserPlus size={15} />
                  )}
                  Create invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {createdInvitation ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="w-full max-w-lg rounded-xl border border-line bg-card shadow-panel">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div>
                <h2 className="font-display text-base font-semibold text-ink">
                  Invitation ready
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Share this link with {createdInvitation.email}.
                </p>
              </div>
              <button
                onClick={() => setCreatedInvitation(null)}
                className="rounded-md p-1.5 text-muted hover:bg-paper hover:text-ink transition-colors"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-4 px-6 py-5">
              {createdInvitation.emailSent ? (
                <div className="flex items-start gap-2 rounded-lg border border-line bg-positive-soft px-3 py-2.5 text-sm text-positive">
                  <Check size={16} className="mt-0.5 shrink-0" />
                  <span>
                    Invitation email sent to {createdInvitation.email}. You can
                    also share the link below.
                  </span>
                </div>
              ) : (
                <div className="flex items-start gap-2 rounded-lg border border-line bg-amber-soft px-3 py-2.5 text-sm text-amber">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <span>
                    The invitation email could not be sent automatically. Copy
                    this link now and share it manually.
                  </span>
                </div>
              )}

              <p className="text-xs text-muted">
                This link is shown only once. Resending creates a new link and
                invalidates the previous one.
              </p>

              <div>
                <label className="text-xs font-medium text-muted">
                  Invitation link
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    readOnly
                    value={acceptUrl}
                    onFocus={(event) => event.currentTarget.select()}
                    className="min-w-0 flex-1 rounded-lg border border-line bg-paper px-3 py-2.5 font-mono text-xs text-ink outline-none"
                  />
                  <button
                    onClick={copyInvitationLink}
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs font-medium text-muted hover:text-ink transition-colors"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                {copyError ? (
                  <p className="mt-2 text-xs text-negative">{copyError}</p>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-line bg-paper px-3 py-2.5">
                  <p className="text-[11px] uppercase tracking-wide text-muted">
                    Role
                  </p>
                  <p className="mt-1 font-medium text-ink">
                    {formatRole(createdInvitation.role)}
                  </p>
                </div>
                <div className="rounded-lg border border-line bg-paper px-3 py-2.5">
                  <p className="text-[11px] uppercase tracking-wide text-muted">
                    Expires
                  </p>
                  <p className="mt-1 font-mono text-xs text-ink">
                    {formatDateTime(createdInvitation.expiresAt)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end border-t border-line pt-4">
                <button
                  onClick={() => setCreatedInvitation(null)}
                  className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {pendingRemove ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="w-full max-w-sm rounded-xl border border-line bg-card p-6 shadow-panel">
            <div className="flex items-start gap-3">
              <div className="grid place-items-center w-10 h-10 shrink-0 rounded-full bg-negative-soft text-negative">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h2 className="font-display text-base font-semibold text-ink">
                  Remove member?
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {pendingRemove.userName} will lose access to this workspace.
                  Their financial records will remain.
                </p>
              </div>
            </div>

            {actionError ? (
              <div className="mt-4 rounded-lg border border-line bg-negative-soft px-3 py-2 text-sm text-negative">
                {actionError}
              </div>
            ) : null}

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setPendingRemove(null)}
                className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-muted hover:text-ink transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                disabled={isRemovingMember}
                className="inline-flex items-center gap-2 rounded-lg bg-negative px-4 py-2 text-sm font-medium text-white hover:bg-negative/90 transition-colors disabled:opacity-60"
              >
                {isRemovingMember ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <Trash2 size={15} />
                )}
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

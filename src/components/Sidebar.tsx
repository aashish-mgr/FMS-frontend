import type { ComponentType } from 'react'
import {
  LayoutGrid,
  ArrowDownCircle,
  ArrowUpCircle,
  FileBarChart2,
  BellRing,
  StickyNote,
  BookOpen,
  LogOut,
  Users,
  Settings,
  ShieldCheck
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLogoutMutation } from '../store/api/authApi'
import { clearAuth } from '../store/slices/authSlice'
import type { RootState } from '../store'
import type { Permission } from '../lib/permissions'
import { usePermissions } from '../lib/usePermissions'

interface NavItem {
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  label: string
  path: string
  badge?: number
  permission?: Permission
}

const navItems: NavItem[] = [
  { icon: LayoutGrid, label: 'Dashboard', path: '/dashboard' },
  { icon: ArrowDownCircle, label: 'Income', path: '/income' },
  { icon: ArrowUpCircle, label: 'Expense', path: '/expense' },
  { icon: FileBarChart2, label: 'Report', path: '/report' },
  { icon: BellRing, label: 'Reminders', path: '/reminders', badge: 7 },
  { icon: StickyNote, label: 'Notes', path: '/notes' },
  { icon: Users, label: 'Members', path: '/members', permission: 'member:read' },
  {
    icon: ShieldCheck,
    label: 'Account Security',
    path: '/account/security'
  },
  {
    icon: Settings,
    label: 'Workspace Settings',
    path: '/workspace-settings',
    permission: 'workspace:update'
  },
  {
    icon: FileBarChart2,
    label: 'Audit',
    path: '/audit',
    permission: 'audit:read'
  }
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [logout] = useLogoutMutation()
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  )
  const workspaceName = useSelector(
    (state: RootState) => state.auth.tenant?.name
  )
  const { can, roles } = usePermissions()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleLogout = async () => {
    try {
      await logout().unwrap()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      dispatch(clearAuth())
      navigate('/')
    }
  }

  const visibleNavItems = navItems.filter(
    (item) => !item.permission || can(item.permission)
  )
  const roleLabel = roles.length
    ? roles
        .map((role) =>
          role === 'superAdmin'
            ? 'Super Admin'
            : role.charAt(0).toUpperCase() + role.slice(1)
        )
        .join(' / ')
    : 'member'
  const displayWorkspaceName = workspaceName?.trim() || 'Workspace'

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-ink text-white/90 min-h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="grid place-items-center w-9 h-9 shrink-0 rounded-md bg-indigo">
          <BookOpen size={18} strokeWidth={2} className="text-white" />
        </div>
        <div className="min-w-0 leading-tight">
          <p
            className="truncate font-display font-semibold text-[15px] text-white"
            title={displayWorkspaceName}
          >
            {displayWorkspaceName}
          </p>
          <p className="text-[11px] tracking-wide text-white/45 uppercase">
            Finance System
          </p>
        </div>
      </div>

      <div className="ledger-stitch mx-6 opacity-20" />

      <nav className="flex-1 px-3 mt-4 space-y-0.5">
        {visibleNavItems.map(({ icon: Icon, label, path, badge }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              location.pathname === path
                ? 'bg-white/10 text-white font-medium'
                : 'text-white/60 hover:bg-white/5 hover:text-white/90'
            }`}
          >
            <Icon size={17} strokeWidth={2} />
            <span className="flex-1 text-left">{label}</span>
            {badge ? (
              <span className="text-[10px] font-mono font-medium bg-amber/90 text-ink rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="px-3 pb-5">
        <div className="ledger-stitch opacity-20 mb-4 mx-3" />
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:bg-white/5 hover:text-white/80 transition-colors"
        >
          <LogOut size={17} strokeWidth={2} />
          <span>Log out</span>
        </button>
        <p className="px-3 pt-3 text-[10px] text-white/25 font-mono">
          v1.0 · {roleLabel}
        </p>
      </div>
    </aside>
  )
}

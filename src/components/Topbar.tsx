import { Search, Menu } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

const today = new Date().toLocaleDateString('en-GB', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric'
})

export default function Topbar() {
  const currentUser = useSelector((state: RootState) => state.auth.user)
  const workspaceName = useSelector((state: RootState) => state.auth.tenant?.name)
  const roleLabel = currentUser?.roles?.length
    ? currentUser.roles
        .map((role) =>
          role === 'superAdmin'
            ? 'Super Admin'
            : role.charAt(0).toUpperCase() + role.slice(1)
        )
        .join(' / ')
    : (currentUser?.role ?? 'member')
  const initials =
    currentUser?.userName
      ?.split(' ')
      .map((n: string) => n[0])
      .join('') ?? ''

  return (
    <header className="sticky top-0 z-10 bg-paper/90 backdrop-blur border-b border-line">
      <div className="flex items-center justify-between gap-4 px-5 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <button className="lg:hidden grid place-items-center w-9 h-9 rounded-lg border border-line bg-card">
            <Menu size={17} />
          </button>
          <div>
            <h1 className="font-display text-lg font-semibold text-ink leading-none">
              Dashboard
            </h1>
            <p className="text-xs text-muted mt-1">{today}</p>
          </div>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-sm bg-card border border-line rounded-lg px-3 py-2">
          <Search size={15} className="text-muted mr-2" />
          <input
            placeholder="Search transactions, clients, vendors…"
            className="bg-transparent outline-none text-sm w-full placeholder:text-muted/70"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-ink leading-none">
              {currentUser?.userName}
            </p>
            <p className="text-[11px] text-muted mt-1">
              {workspaceName
                ? `${workspaceName} · ${roleLabel}`
                : `Logged in as ${roleLabel}`}
            </p>
          </div>
          <div className="grid place-items-center w-9 h-9 rounded-full bg-indigo text-white text-xs font-semibold font-mono">
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}

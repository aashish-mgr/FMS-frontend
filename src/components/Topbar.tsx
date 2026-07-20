import { Search, Menu } from 'lucide-react'
// import { currentUser } from '../data/dummyData'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

const today = new Date('2026-07-14T00:00:00').toLocaleDateString('en-GB', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric'
})

export default function Topbar() {
  const authState = useSelector((state: any)  => state.auth);
  const currentUser= authState?.user;
  const initials = currentUser?.userName
    .split(' ')
    .map((n: any) => n[0])
    .join('')

  return (
    <header className="sticky top-0 z-10 bg-paper/90 backdrop-blur border-b border-line">
      <div className="flex items-center justify-between gap-4 px-5 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <button className="lg:hidden grid place-items-center w-9 h-9 rounded-lg border border-line bg-card">
            <Menu size={17} />
          </button>
          <div>
            <h1 className="font-display text-lg font-semibold text-ink leading-none">Dashboard</h1>
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
            <p className="text-sm font-medium text-ink leading-none">{currentUser?.userName}</p>
            <p className="text-[11px] text-muted mt-1">Logged in as {currentUser?.role}</p>
          </div>
          <div className="grid place-items-center w-9 h-9 rounded-full bg-indigo text-white text-xs font-semibold font-mono">
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}
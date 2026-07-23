import type { ComponentType } from 'react'
import {
  LayoutGrid,
  ArrowDownCircle,
  ArrowUpCircle,
  FileBarChart2,
  BellRing,
  StickyNote,
  BookOpen,
  LogOut
} from 'lucide-react'
import { useNavigate,useLocation } from 'react-router-dom';
interface NavItem {
  icon: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  label: string
  active?: boolean
  badge?: number
}
import { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { useLogoutMutation } from '../store/api/authApi';
import { clearAuth } from '../store/slices/authSlice';

const navItems: NavItem[] = [
  { icon: LayoutGrid, label: 'Dashboard' ,active: false},
  { icon: ArrowDownCircle, label: 'Income' , active: false},
  { icon: ArrowUpCircle, label: 'Expense', active:false},
  { icon: FileBarChart2, label: 'Reports',active: false },
  { icon: BellRing, label: 'Reminders', badge: 7 ,active: false},
  { icon: StickyNote, label: 'Notes' ,active: false}
]


export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const handleLogout =async () => {
    logout();
    dispatch(clearAuth());
    console.log(authState)
}
const authState = useSelector((state: any) => state.auth);
useEffect(() => {
  if(authState.isAuthenticated === false) {
    navigate("/")
  }
 
}, [authState])

const handleNavigate = async (label: string) => {
    const newLabel =label.toLowerCase();
    navigate(`/${newLabel}`);
}

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-ink text-white/90 min-h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <div className="grid place-items-center w-9 h-9 rounded-md bg-indigo/90">
          <BookOpen size={18} strokeWidth={2} className="text-white" />
        </div>
        <div className="leading-tight">
          <p className="font-display font-semibold text-[15px] text-white">Digital Pathshala</p>
          <p className="text-[11px] tracking-wide text-white/45 uppercase">Finance System</p>
        </div>
      </div>

      <div className="ledger-stitch mx-6 opacity-20" />

      <nav className="flex-1 px-3 mt-4 space-y-0.5">
        {navItems.map(({ icon: Icon, label, badge ,active}) => (
          <button
            key={label}
            onClick={() => {handleNavigate(label)
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
               location.pathname === `/${label.toLowerCase()}`
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
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:bg-white/5 hover:text-white/80 transition-colors">
          <LogOut size={17} strokeWidth={2} />
          <span>Log out</span>
        </button>
        <p className="px-3 pt-3 text-[10px] text-white/25 font-mono">v1.0 · Accountant role</p>
      </div>
    </aside>
  )
}
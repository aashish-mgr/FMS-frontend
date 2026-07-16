import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  BellRing,
  StickyNote,
  Paperclip,
  Settings,
  BookOpenText,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: LucideIcon;
  active?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Transactions", icon: ArrowLeftRight },
  { label: "Reports", icon: PieChart },
  { label: "Reminders", icon: BellRing },
  { label: "Notes", icon: StickyNote },
  { label: "Attachments", icon: Paperclip },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col md:w-60 shrink-0 bg-ledger-sidebar text-white min-h-screen py-6 px-4">
      <div className="flex items-center gap-2 px-2 mb-10">
        <div className="h-8 w-8 rounded-md bg-ledger-green flex items-center justify-center">
          <BookOpenText size={17} strokeWidth={2} className="text-white" />
        </div>
        <span className="font-display font-semibold text-lg tracking-tight">
          Ledgerly
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              active
                ? "bg-ledger-green text-white font-medium"
                : "text-white hover:bg-ledger-sidebarhover"
            }`}
          >
            <Icon size={17} strokeWidth={2} />
            {label}
          </button>
        ))}
      </nav>

      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white hover:bg-ledger-sidebarhover transition-colors">
        <Settings size={17} strokeWidth={2} />
        Settings
      </button>
    </aside>
  );
}

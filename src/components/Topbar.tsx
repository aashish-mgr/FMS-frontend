import { Search, Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex items-center justify-between gap-4 px-6 md:px-8 py-5 border-b border-ledger-border bg-ledger-bg backdrop-blur sticky top-0 z-10">
      <div>
        <h1 className="font-display text-xl font-semibold text-ledger-ink">
          Accountant Dashboard
        </h1>
        <p className="text-sm text-ledger-muted mt-0.5">
          Thursday, July 16, 2026
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-white border border-ledger-border rounded-lg px-3 py-2 w-64">
          <Search size={16} className="text-ledger-muted" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="bg-transparent text-sm outline-none w-full placeholder:text-ledger-muted"
          />
        </div>

        <button className="relative h-9 w-9 flex items-center justify-center rounded-lg border border-ledger-border bg-white text-ledger-muted hover:text-ledger-ink transition-colors">
          <Bell size={17} />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-ledger-red text-white text-[10px] flex items-center justify-center">
            4
          </span>
        </button>

        <div className="flex items-center gap-2 pl-2">
          <div className="h-9 w-9 rounded-full bg-ledger-green text-white flex items-center justify-center font-display text-sm font-semibold">
            AS
          </div>
          <div className="hidden lg:block leading-tight">
            <p className="text-sm font-medium text-ledger-ink">Aashish S.</p>
            <p className="text-xs text-ledger-muted">Accountant</p>
          </div>
        </div>
      </div>
    </header>
  );
}

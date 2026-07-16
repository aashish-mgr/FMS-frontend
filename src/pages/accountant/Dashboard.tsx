import { Wallet, TrendingDown, PiggyBank, BellRing } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import StatCard from "../../components/StatCard";
import RevenueChart from "../../components/RevenueChart";
import CategoryDonut from "../../components/CategoryDonut";
import TransactionsTable from "../../components/TransactionsTable";
import RemindersPanel from "../../components/RemindersPanel";
import { summaryStats } from "../../data/dummyData";

export default function Dashboard() {
  return (
    <div className="flex bg-ledger-bg min-h-screen">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="p-6 md:p-8 space-y-6">
          {/* Stat row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              label="Total Income"
              value={summaryStats.totalIncome}
              changePct={summaryStats.incomeChangePct}
              icon={Wallet}
              accent="green"
            />
            <StatCard
              label="Total Expense"
              value={summaryStats.totalExpense}
              changePct={summaryStats.expenseChangePct}
              icon={TrendingDown}
              accent="red"
            />
            <StatCard
              label="Net Balance"
              value={summaryStats.netBalance}
              changePct={summaryStats.balanceChangePct}
              icon={PiggyBank}
              accent="green"
            />
            <StatCard
              label="Pending Reminders"
              value={summaryStats.pendingReminders}
              format="number"
              changePct={null}
              note="require attention this week"
              icon={BellRing}
              accent="gold"
            />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <RevenueChart />
            <CategoryDonut />
          </div>

          {/* Table + Reminders row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <TransactionsTable />
            <RemindersPanel />
          </div>
        </main>
      </div>
    </div>
  );
}

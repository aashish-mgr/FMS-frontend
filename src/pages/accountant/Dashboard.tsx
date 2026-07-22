import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import KpiSection from "../../components/Dashboard Component/KpiSection";
import IncomeExpenseChart from "../../components/Dashboard Component/IncomeExpenseChart";
import CategoryDonut from "../../components/Dashboard Component/CategoryDonut";
import CashFlowChart from "../../components/Dashboard Component/CashFlowChart";
import RecentTransactions from "../../components/Dashboard Component/RecentTransactions";
import UpcomingReminders from "../../components/Dashboard Component/UpcomingReminders";
// import { incomeByCategory, expenseByCategory } from "../../data/dummyData";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="px-5 lg:px-8 py-6 space-y-6 max-w-[1400px]">
          <KpiSection />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2">
              <IncomeExpenseChart />
            </div>
            <CashFlowChart />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <CategoryDonut
              title="Income by Category"
              subtitle="Share of revenue across service lines"
              dataCategory="income"
              tone="positive"
            />
            <CategoryDonut
              title="Expense by Category"
              subtitle="Where operating costs are going"
              dataCategory="expense"
              tone="negative"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 pb-8">
            <div className="xl:col-span-2">
              <RecentTransactions />
            </div>
            <UpcomingReminders />
          </div>
        </main>
      </div>
    </div>
  );
}

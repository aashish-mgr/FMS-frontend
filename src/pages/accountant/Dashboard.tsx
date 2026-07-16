import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import KpiSection from '../../components/KpiSection'
import IncomeExpenseChart from '../../components/IncomeExpenseChart'
import CategoryDonut from '../../components/CategoryDonut'
import CashFlowChart from '../../components/CashFlowChart'
import RecentTransactions from '../../components/RecentTransactions'
import UpcomingReminders from '../../components/UpcomingReminders'
import { incomeByCategory, expenseByCategory } from '../../data/dummyData'

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
              data={incomeByCategory}
              tone="positive"
              dateRange="Jul 01 – Jul 14"
            />
            <CategoryDonut
              title="Expense by Category"
              subtitle="Where operating costs are going"
              data={expenseByCategory}
              tone="negative"
              dateRange="Jul 01 – Jul 14"
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
  )
}
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { recentTransactions, npr } from '../../data/dummyData'
import { formatDate } from '../../lib/format'
import {useGetRecentTransactionsQuery} from '../../store/api/dashboardApi'
import { useEffect, useState } from 'react'
import type { Transaction } from '../../types/dashboardTypes'

export default function RecentTransactions() {
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>();

   const {data: transactionData, refetch: refetchTransaction} = useGetRecentTransactionsQuery();
  const getRecentTransactions = async () => {
     refetchTransaction();
     setRecentTransactions(transactionData);
  }
  useEffect(() => {
    getRecentTransactions();
  }, [])
  
  return (
    <div className="bg-card rounded-xl border border-line shadow-card animate-rise">
      <div className="flex items-center justify-between px-5 py-4 border-b border-line">
        <div>
          <h3 className="font-display text-sm font-semibold text-ink">Recent Transactions</h3>
          <p className="text-xs text-muted mt-0.5">Latest 20 income & expense records, newest first</p>
        </div>
        <button className="text-xs font-medium text-indigo hover:text-indigo-deep">View all</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-muted">
              <th className="px-5 py-2.5 font-medium">Party</th>
              <th className="px-3 py-2.5 font-medium">Category</th>
              <th className="px-3 py-2.5 font-medium">Date</th>
              <th className="px-5 py-2.5 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions?.slice(0, 10).map((t) => {
              const isIncome = t.type === 'income'
              return (
                <tr key={t.id} className="border-t border-line hover:bg-paper/70 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`grid place-items-center w-7 h-7 rounded-full shrink-0 ${
                          isIncome ? 'bg-positive-soft text-positive' : 'bg-negative-soft text-negative'
                        }`}
                      >
                        {isIncome ? <ArrowDownLeft size={13} strokeWidth={2.4} /> : <ArrowUpRight size={13} strokeWidth={2.4} />}
                      </span>
                      <span className="text-ink font-medium truncate max-w-[180px]">{t.party}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted whitespace-nowrap">{t.category}</td>
                  <td className="px-3 py-3 text-muted font-mono tabular whitespace-nowrap">{formatDate(t.date.slice(0,10))}</td>
                  <td className={`px-5 py-3 text-right font-mono tabular font-medium whitespace-nowrap ${isIncome ? 'text-positive' : 'text-negative'}`}>
                    {isIncome ? '+' : '-'}
                    {npr(t.amount)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
import { ArrowUpRight, ArrowDownRight, Paperclip } from "lucide-react";
import { transactions } from "../data/dummyData";

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export default function TransactionsTable() {
  return (
    <div className="bg-ledger-surface border border-ledger-border rounded-xl p-5 col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-ledger-ink">
          Recent Transactions
        </h2>
        <button className="text-xs font-medium text-ledger-green hover:underline">
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ledger-muted text-xs border-b border-ledger-border">
              <th className="font-medium pb-2 pr-4">Description</th>
              <th className="font-medium pb-2 pr-4">Category</th>
              <th className="font-medium pb-2 pr-4">Date</th>
              <th className="font-medium pb-2 pr-4 text-right">Amount</th>
              <th className="font-medium pb-2 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-b border-ledger-border last:border-0">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-6 w-6 shrink-0 rounded-md flex items-center justify-center ${
                        t.type === "income"
                          ? "bg-ledger-greenlight text-ledger-green"
                          : "bg-ledger-redlight text-ledger-red"
                      }`}
                    >
                      {t.type === "income" ? (
                        <ArrowUpRight size={13} />
                      ) : (
                        <ArrowDownRight size={13} />
                      )}
                    </span>
                    <div>
                      <p className="text-ledger-ink font-medium leading-tight">
                        {t.description}
                      </p>
                      <p className="text-xs text-ledger-muted">{t.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4 text-ledger-muted">{t.category}</td>
                <td className="py-3 pr-4 text-ledger-muted whitespace-nowrap">
                  {formatDate(t.date)}
                </td>
                <td
                  className={`py-3 pr-4 text-right figure font-medium whitespace-nowrap ${
                    t.type === "income" ? "text-ledger-green" : "text-ledger-red"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}$
                  {t.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="py-3 text-ledger-muted">
                  {t.hasAttachment && <Paperclip size={14} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

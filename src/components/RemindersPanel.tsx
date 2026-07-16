import { CircleDot } from "lucide-react";
import { reminders } from "../data/dummyData";
import type { ReminderPriority } from "../data/types";

const priorityStyles: Record<ReminderPriority, string> = {
  high: "bg-ledger-redlight text-ledger-red",
  medium: "bg-ledger-goldlight text-ledger-gold",
  low: "bg-ledger-greenlight text-ledger-green",
};

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export default function RemindersPanel() {
  return (
    <div className="bg-ledger-surface border border-ledger-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-ledger-ink">Reminders</h2>
        <span className="text-xs bg-ledger-ink text-white rounded-full px-2 py-0.5 figure">
          {reminders.length}
        </span>
      </div>

      <ul className="space-y-4">
        {reminders.map((r) => (
          <li key={r.id} className="flex items-start gap-3">
            <CircleDot size={15} className="text-ledger-muted mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-ledger-ink font-medium leading-tight truncate">
                {r.title}
              </p>
              <p className="text-xs text-ledger-muted mt-0.5">
                Due {formatDate(r.dueDate)}
              </p>
            </div>
            <span
              className={`text-[10px] uppercase tracking-wide font-medium px-2 py-1 rounded-md shrink-0 ${
                priorityStyles[r.priority]
              }`}
            >
              {r.priority}
            </span>
          </li>
        ))}
      </ul>

      <button className="w-full mt-5 text-sm font-medium text-ledger-green border border-ledger-green rounded-lg py-2 hover:bg-ledger-greenlight transition-colors">
        + Add reminder
      </button>
    </div>
  );
}

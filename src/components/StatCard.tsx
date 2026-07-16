import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";

const formatCurrency = (value: number): string =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

export type StatCardAccent = "green" | "red" | "gold";
export type StatCardFormat = "currency" | "number";

export interface StatCardProps {
  label: string;
  value: number;
  changePct?: number | null;
  icon: LucideIcon;
  accent?: StatCardAccent;
  format?: StatCardFormat;
  note?: string;
}

export default function StatCard({
  label,
  value,
  changePct = null,
  icon: Icon,
  accent = "green",
  format = "currency",
  note = "vs last month",
}: StatCardProps) {
  const isPositive = (changePct ?? 0) >= 0;
  const accentClasses: Record<StatCardAccent, string> = {
    green: "bg-ledger-greenlight text-ledger-green",
    red: "bg-ledger-redlight text-ledger-red",
    gold: "bg-ledger-goldlight text-ledger-gold",
  };

  return (
    <div className="bg-ledger-surface border border-ledger-border rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ledger-muted">{label}</span>
        <div
          className={`h-8 w-8 rounded-lg flex items-center justify-center ${accentClasses[accent]}`}
        >
          <Icon size={16} strokeWidth={2} />
        </div>
      </div>

      <div className="figure text-2xl font-semibold text-ledger-ink">
        {format === "currency" ? formatCurrency(value) : value}
      </div>

      {changePct !== null ? (
        <div className="flex items-center gap-1 text-xs">
          {isPositive ? (
            <ArrowUpRight size={14} className="text-ledger-green" />
          ) : (
            <ArrowDownRight size={14} className="text-ledger-red" />
          )}
          <span
            className={`figure font-medium ${
              isPositive ? "text-ledger-green" : "text-ledger-red"
            }`}
          >
            {Math.abs(changePct)}%
          </span>
          <span className="text-ledger-muted">{note}</span>
        </div>
      ) : (
        <p className="text-xs text-ledger-muted">{note}</p>
      )}
    </div>
  );
}

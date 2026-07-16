import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { monthlyTrend } from "../data/dummyData";

type TooltipPayloadItem = {
  dataKey?: string;
  color?: string;
  value?: number | string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-ledger-sidebar text-white rounded-lg px-4 py-3 text-xs shadow-lg">
      <p className="font-medium mb-2 text-white">{label} 2026</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mb-1 last:mb-0">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="capitalize text-white w-14">{entry.dataKey}</span>
          <span className="figure font-medium">
            ${Number(entry.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function RevenueChart() {
  return (
    <div className="bg-ledger-surface border border-ledger-border rounded-xl p-5 col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-semibold text-ledger-ink">
            Income vs Expense
          </h2>
          <p className="text-xs text-ledger-muted mt-0.5">Last 6 months</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-ledger-green" />
            <span className="text-ledger-muted">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-ledger-red" />
            <span className="text-ledger-muted">Expense</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={monthlyTrend} margin={{ left: -20, right: 10 }}>
          <defs>
            <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F5132" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#0F5132" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B3261E" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#B3261E" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#E3E4DE" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#70766F", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#70766F", fontSize: 12 }}
            tickFormatter={(v: number) => `$${v / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#0F5132"
            strokeWidth={2}
            fill="url(#incomeFill)"
          />
          <Area
            type="monotone"
            dataKey="expense"
            stroke="#B3261E"
            strokeWidth={2}
            fill="url(#expenseFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

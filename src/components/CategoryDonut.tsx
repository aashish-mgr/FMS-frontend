import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { categoryBreakdown } from "../data/dummyData";
import type { CategoryBreakdownItem } from "../data/types";

const total = categoryBreakdown.reduce((sum, c) => sum + c.value, 0);

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: CategoryBreakdownItem }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const { category, value, color } = payload[0].payload;
  return (
    <div className="bg-ledger-sidebar text-white rounded-lg px-3 py-2 text-xs shadow-lg flex items-center gap-2">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-white">{category}</span>
      <span className="figure font-medium">${value.toLocaleString()}</span>
    </div>
  );
}

export default function CategoryDonut() {
  return (
    <div className="bg-ledger-surface border border-ledger-border rounded-xl p-5">
      <h2 className="font-display font-semibold text-ledger-ink">
        Expense by Category
      </h2>
      <p className="text-xs text-ledger-muted mt-0.5 mb-2">This month</p>

      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={categoryBreakdown}
              dataKey="value"
              nameKey="category"
              innerRadius={58}
              outerRadius={80}
              paddingAngle={2}
              stroke="none"
            >
              {categoryBreakdown.map((entry) => (
                <Cell key={entry.category} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="figure text-lg font-semibold text-ledger-ink">
            ${(total / 1000).toFixed(1)}k
          </span>
          <span className="text-[11px] text-ledger-muted">total spent</span>
        </div>
      </div>

      <ul className="mt-3 space-y-2">
        {categoryBreakdown.map((c) => (
          <li key={c.category} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-ledger-muted">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: c.color }}
              />
              {c.category}
            </span>
            <span className="figure text-ledger-ink font-medium">
              ${c.value.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

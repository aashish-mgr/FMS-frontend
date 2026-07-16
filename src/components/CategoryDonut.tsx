import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { TooltipProps } from 'recharts'
import { npr } from '../data/dummyData'
import type { CategoryDatum, DonutTone } from '../types/types'

const positivePalette = ['#1E7F4E', '#3E9D6C', '#5FB98A', '#83CFA8', '#A8E0C4', '#C6ECDA', '#33438D', '#7B8AC9']
const negativePalette = ['#B23A2E', '#C6604C', '#D6836F', '#E3A491', '#EEC3B5', '#F5DAD1', '#B8860B', '#D4AE5C']

interface CustomTooltipProps extends TooltipProps<number, string> {
  total: number,
  payload?: any
}

function CustomTooltip({ active, payload, total }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  const value = p.value as number
  const pct = ((value / total) * 100).toFixed(1)
  return (
    <div className="bg-ink text-white rounded-lg px-3 py-2 text-xs shadow-panel">
      <p className="font-medium text-white/90">{p.name}</p>
      <p className="font-mono tabular text-white/70 mt-0.5">
        {npr(value)} · {pct}%
      </p>
    </div>
  )
}

interface CategoryDonutProps {
  title: string
  subtitle: string
  data: CategoryDatum[]
  tone?: DonutTone
  dateRange: string
}

export default function CategoryDonut({ title, subtitle, data, tone = 'positive', dateRange }: CategoryDonutProps) {
  const palette = tone === 'positive' ? positivePalette : negativePalette
  const total = data.reduce((s, d) => s + d.value, 0)
  const top = [...data].sort((a, b) => b.value - a.value).slice(0, 4)

  return (
    <div className="bg-card rounded-xl border border-line shadow-card p-5 animate-rise">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="font-display text-sm font-semibold text-ink">{title}</h3>
          <p className="text-xs text-muted mt-0.5">{subtitle}</p>
        </div>
        <span className="text-[11px] font-mono text-muted bg-paper border border-line rounded-md px-2 py-1">
          {dateRange}
        </span>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className="w-[140px] h-[140px] shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={44} outerRadius={64} paddingAngle={2} stroke="none">
                {data.map((entry, i) => (
                  <Cell key={entry.name} fill={palette[i % palette.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip total={total} />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 grid place-items-center pointer-events-none">
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-wide text-muted">Total</p>
              <p className="font-mono tabular text-xs font-semibold text-ink">{npr(total)}</p>
            </div>
          </div>
        </div>

        <ul className="flex-1 space-y-2 min-w-0">
          {top.map((d) => {
            const idx = data.findIndex((x) => x.name === d.name)
            const pct = ((d.value / total) * 100).toFixed(0)
            return (
              <li key={d.name} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: palette[idx % palette.length] }} />
                <span className="flex-1 truncate text-ink/80">{d.name}</span>
                <span className="font-mono tabular text-muted shrink-0">{pct}%</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
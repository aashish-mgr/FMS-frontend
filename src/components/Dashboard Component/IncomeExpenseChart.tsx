import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { barChartData, npr } from '../../data/dummyData'
import type { BarDatum,  BarRange } from '../../types/dashboardTypes'
import {useGetIncomeExpenseChartQuery} from '../../store/api/dashboardApi'

const toggles: { key: BarRange; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' }
]
type TooltipPayloadItem = {
  name?: string,
  dataKey?: string;
  color?: string;
  value?: number | string;
};


type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
};


function CustomTooltip({ active, payload, label }:CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-ink text-white rounded-lg px-3 py-2.5 text-xs shadow-panel">
      <p className="font-medium mb-1.5 text-white/70">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey as string} className="flex items-center gap-2 justify-between">
          <span className="flex items-center gap-1.5 text-white/80">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-mono tabular ml-4">{npr(p.value as number)}</span>
        </div>
      ))}
    </div>
  )
}

export default function IncomeExpenseChart() {
  const [range, setRange] = useState<BarRange>('monthly')
  // // const data = barChartData[range];
  // const [data, setData] = useState<BarDatum[]>()
  const {data, refetch: refetchChart, isLoading} = useGetIncomeExpenseChartQuery(range)
  // const getBarData =async () => {
   
  //   refetchChart();
  //   setData(chartData)
  // }

  // useEffect(() => {
  //   refetchChart();
  // }, [range])
  

  return (
    <div className="bg-card rounded-xl border border-line shadow-card p-5 animate-rise">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="font-display text-sm font-semibold text-ink">Income vs Expense</h3>
          <p className="text-xs text-muted mt-0.5">Net profit tracked alongside gross flows</p>
        </div>
        <div className="flex bg-paper border border-line rounded-lg p-1 gap-0.5">
          {toggles.map((t) => (
            <button
              key={t.key}
              onClick={() => setRange(t.key)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                range === t.key ? 'bg-ink text-white' : 'text-muted hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-72 mt-3">
        {isLoading ? (<p>Loading...</p>) : (<ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} margin={{ left: -12, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} stroke="#E3E4DD" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B6F76' }} axisLine={{ stroke: '#E3E4DD' }} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: '#6B6F76' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F4F5F1' }} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
            <Bar dataKey="income" name="Income" fill="#1E7F4E" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="expense" name="Expense" fill="#B23A2E" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>)}
        
      </div>
    </div>
  )
}
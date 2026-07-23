import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { TooltipProps } from 'recharts'
import { cashFlowByYear, npr } from '../../data/dummyData'
import { useGetMonthlyCashFlowQuery } from '../../store/api/dashboardApi'
import type{ CashFlowDatum } from '../../types/dashboardTypes'


const years = ['2026','2025']

interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: Array<{
    dataKey?: string | number
    name?: string
    value?: number
    color?: string
  }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
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

export default function CashFlowChart() {
  const [year, setYear] = useState<string>(years[0])
  // const data = cashFlowByYear[year]
  const [data, setData] = useState<CashFlowDatum[]>()
  const {data: cashFlowData, refetch: refetchCashFlow}=  useGetMonthlyCashFlowQuery(Number(year))

  const getCashFlow = async() => {
    refetchCashFlow();
     setData(cashFlowData);
  }
  
  useEffect(() => {
    getCashFlow();
  }, [year])
  
  return (
    <div className="bg-card rounded-xl border border-line shadow-card p-5 animate-rise">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="font-display text-sm font-semibold text-ink">Monthly Cash Flow</h3>
          <p className="text-xs text-muted mt-0.5">Income, expense, and net profit trend</p>
        </div>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="text-xs font-mono bg-paper border border-line rounded-md px-2.5 py-1.5 outline-none text-ink"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="h-72 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -12, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} stroke="#E3E4DD" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B6F76' }} axisLine={{ stroke: '#E3E4DD' }} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: '#6B6F76' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
            <Line type="monotone" dataKey="income" name="Income" stroke="#1E7F4E" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="expense" name="Expense" stroke="#B23A2E" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="profit" name="Net Profit" stroke="#33438D" strokeWidth={2.5} dot={false} strokeDasharray="4 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
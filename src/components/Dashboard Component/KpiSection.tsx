import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import { ArrowDownRight, ArrowUpRight, TrendingUp } from 'lucide-react'
import {  kpiPeriods, npr } from '../../data/dummyData'
import type { PeriodKey } from '../../types/dashboardTypes'
import dashboardApi from '../../store/api/dashboardApi'
import type { Kpis } from '../../types/dashboardTypes'

type Tone = 'positive' | 'negative' | 'indigo'

interface HeroCardProps {
  label: string
  value: number
  tone: Tone
  Icon: ComponentType<{ size?: number; className?: string; strokeWidth?: number }>
}

function HeroCard({ label, value, tone, Icon }: HeroCardProps) {
  const toneMap: Record<Tone, { text: string; bg: string; ring: string }> = {
    positive: { text: 'text-positive', bg: 'bg-positive-soft', ring: 'ring-positive/15' },
    negative: { text: 'text-negative', bg: 'bg-negative-soft', ring: 'ring-negative/15' },
    indigo: { text: 'text-indigo', bg: 'bg-indigo-soft', ring: 'ring-indigo/15' }
  }
  const t = toneMap[tone]
  return (
    <div className="relative flex-1 bg-card rounded-xl border border-line shadow-card p-5 overflow-hidden">
      <div className="ledger-stitch absolute top-0 left-0 right-0" />
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        <div className={`grid place-items-center w-8 h-8 rounded-lg ${t.bg} ring-1 ${t.ring}`}>
          <Icon size={15} className={t.text} strokeWidth={2.2} />
        </div>
      </div>
      <p className={`font-mono tabular text-[28px] font-semibold mt-3 ${t.text}`}>{npr(value)}</p>
    </div>
  )
}

export default function KpiSection() {
  const [kpis, setKpis] = useState<Kpis>()
  const [period, setPeriod] = useState<PeriodKey>('month')
  const active = kpis?.[period]
  const activeLabel = kpiPeriods.find((p) => p.key === period)!.label
  
  
  const getKpis = async () => {
    const res = await dashboardApi.getKpis();
    console.log(res);
    setKpis(res.data?.data)
  }

  useEffect(() => {
    getKpis();
  
  }, [])
  

  return (
    <section className="animate-rise">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-base font-semibold text-ink">Financial snapshot</h2>
          <p className="text-xs text-muted mt-0.5">Income, expense, and net profit for the selected period</p>
        </div>
        <div className="flex bg-card border border-line rounded-lg p-1 gap-0.5">
          {kpiPeriods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                period === p.key ? 'bg-ink text-white' : 'text-muted hover:text-ink'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <HeroCard label={`${activeLabel} Income`} value={active?.income as number} tone="positive" Icon={ArrowDownRight} />
        <HeroCard label={`${activeLabel} Expense`} value={active?.expense as number} tone="negative" Icon={ArrowUpRight} />
        <HeroCard label={`${activeLabel} Net Profit`} value={active?.profit as number} tone="indigo" Icon={TrendingUp} />
      </div>

      <FullGrid kpis={kpis}/>
    </section>
  )
}

function FullGrid({kpis}: {kpis?: Kpis}){
  return (
    <div className="mt-4 bg-card rounded-xl border border-line shadow-card overflow-hidden">
      <div className="px-5 py-3 border-b border-line flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">All 12 KPI cards · Today / Week / Month / Year</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {kpiPeriods.map((p, idx) => {
          const v = kpis?.[p.key]
          return (
            <div
              key={p.key}
              className={`p-4 ${idx !== kpiPeriods.length - 1 ? 'sm:border-r border-line' : ''} ${
                idx < 2 ? 'border-b sm:border-b-0 lg:border-b-0' : ''
              }`}
            >
              <p className="text-[11px] font-medium text-muted uppercase tracking-wide mb-2.5">{p.label}</p>
              <Row label="Income" value={v?.income as number} tone="text-positive" />
              <Row label="Expense" value={v?.expense as number} tone="text-negative" />
              <Row label="Profit" value={v?.profit as number} tone={v?.profit as number >= 0 ? 'text-indigo' : 'text-negative'} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface RowProps {
  label: string
  value: number
  tone: string
}

function Row({ label, value, tone }: RowProps) {
  return (
    <div className="flex items-baseline justify-between py-1">
      <span className="text-[11px] text-muted">{label}</span>
      <span className={`font-mono tabular text-[13px] font-medium ${tone}`}>{npr(value)}</span>
    </div>
  )
}
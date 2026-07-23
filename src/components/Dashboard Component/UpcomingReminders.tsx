import { Check, Repeat } from 'lucide-react'
import { upcomingReminders } from '../../data/dummyData'
import { formatDate, dueLabel } from '../../lib/format'
import type { Priority } from '../../types/dashboardTypes'
import {useGetRemindersQuery} from '../../store/api/remainderApi'
import { useEffect, useState } from 'react'

import type { remainderType } from '../../types/remainderTypes'

const priorityStyle: Record<Priority, string> = {
  HIGH: 'bg-negative-soft text-negative',
  MEDIUM: 'bg-amber-soft text-amber',
  LOW: 'bg-indigo-soft text-indigo'
}

export default function UpcomingReminders() {
  const [upcomingReminders, setUpcomingReminders] = useState<remainderType[] > ([]);
    const {data: reminderData, refetch: refetchReminder} = useGetRemindersQuery()

  const getRemainders = async () => {
    refetchReminder();
    setUpcomingReminders(reminderData?.records ?? []);

  }
  useEffect(() => {
   getRemainders();
  }, [])
  
  return (
    <div className="bg-card rounded-xl border border-line shadow-card animate-rise">
      <div className="flex items-center justify-between px-5 py-4 border-b border-line">
        <div>
          <h3 className="font-display text-sm font-semibold text-ink">Upcoming Reminders</h3>
          <p className="text-xs text-muted mt-0.5">Due within the next 7 days</p>
        </div>
        <button className="text-xs font-medium text-indigo hover:text-indigo-deep">View all</button>
      </div>

      <ul className="divide-y divide-line">
        {upcomingReminders?.map((r) => (
          <li key={r.id} className="px-5 py-3.5 flex items-start gap-3">
            <button className="mt-0.5 grid place-items-center w-5 h-5 rounded-full border-2 border-line hover:border-positive hover:bg-positive-soft shrink-0 transition-colors">
              <Check size={11} className="opacity-0 hover:opacity-100 text-positive" strokeWidth={3} />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-ink font-medium leading-snug truncate">{r.title}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${priorityStyle[r.priority]}`}>
                  {r.priority}
                </span>
                <span className="text-[11px] text-muted font-mono">{formatDate(r.remainderDate?.slice(0,10))}</span>
                {r.repeat && r.repeat !== 'NONE' && (
                  <span className="flex items-center gap-1 text-[11px] text-muted">
                    <Repeat size={10} />
                    {r.repeat.toLowerCase()}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[11px] font-mono text-muted shrink-0 pt-0.5">{dueLabel(r.remainderDate?.slice(0,10))}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
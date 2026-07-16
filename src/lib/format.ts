export const formatDate = (isoDate: string): string => {
  const d = new Date(isoDate + 'T00:00:00')
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const daysUntil = (isoDate: string): number => {
  const today = new Date('2026-07-14T00:00:00')
  const target = new Date(isoDate + 'T00:00:00')
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export const dueLabel = (isoDate: string): string => {
  const d = daysUntil(isoDate)
  if (d === 0) return 'Due today'
  if (d === 1) return 'Due tomorrow'
  if (d < 0) return `${Math.abs(d)}d overdue`
  return `In ${d} days`
}
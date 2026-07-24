// src/data/notesReminderDummyData.ts
// Dummy records for the Notes and Reminder pages, shaped like the future
// GET /api/notes and GET /api/reminders responses (SRS §9.2 / §10.4).

import type { NoteRecord, ColorLabel } from '../types/notesTypes'
import type { ReminderRecord,Priority,RepeatCycle } from '../types/remainderTypes';

// SRS 10.1 — Common Reminder Use Cases (seeded titles)
const REMINDER_TITLES: { title: string; description: string }[] = [
  { title: 'Pay Internet Bill', description: 'WorldLink monthly broadband invoice for the head office.' },
  { title: 'Renew Hosting Subscription', description: 'CloudHost Nepal annual hosting plan renewal.' },
  { title: 'Renew Domain', description: 'digitalpathshalanepal.com domain renewal.' },
  { title: 'Disburse Employee Salaries', description: 'Monthly payroll disbursement for all staff.' },
  { title: 'Pay Office Rent', description: 'Monthly rent payment to the building owner.' },
  { title: 'File Government Taxes', description: 'Quarterly VAT and income tax filing deadline.' },
  { title: 'Renew SSL Certificate', description: 'SSL certificate renewal for the main domain.' },
  { title: 'Team Bonus Disbursement', description: 'Dashain bonus payout for the training team.' }
]

const NOTE_SEEDS: { title: string; description: string; color: ColorLabel }[] = [
  { title: 'Client follow-up — Everest EduTech', description: 'Waiting on signed contract before releasing invoice #INV-5041.', color: 'yellow' },
  { title: 'Bank reconciliation pending', description: 'NIC Asia statement for last month has two unmatched transactions.', color: 'red' },
  { title: 'New AMC opportunity', description: 'Bagmati Retail Group asked about an annual maintenance contract.', color: 'green' },
  { title: 'Petty cash top-up', description: 'Remember to top up the office petty cash box before Friday.', color: 'yellow' },
  { title: 'Vendor rate change', description: 'CloudHost Nepal increased hosting rates by 8% starting next cycle.', color: 'red' },
  { title: 'Training batch idea', description: 'Consider a weekend corporate training batch for Q3.', color: 'green' },
  { title: 'Reminder: backup exports', description: 'Export monthly ledger backups to the shared drive.', color: null },
  { title: 'Follow up on freelancer invoice', description: 'Confirm freelancer payment was received before closing the books.', color: 'yellow' }
]

function dateOffset(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}

function futureDateOffset(daysAhead: number): string {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  return d.toISOString().slice(0, 10)
}

export function generateNotes(count = 24): NoteRecord[] {
  const notes: NoteRecord[] = []
  for (let i = 0; i < count; i++) {
    const seed = NOTE_SEEDS[i % NOTE_SEEDS.length]
    const created = dateOffset((i * 17) % 120)
    notes.push({
      id: `note-${3000 + i}`,
      title: seed.title,
      description: seed.description,
      color_label: seed.color,
      is_pinned: i % 5 === 0,
      is_archived: i % 9 === 0,
      created_by: 'accountant-01',
      created_at: created,
      updated_at: created,
      deleted_at: null
    })
  }
  return notes.sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned) || (a.created_at < b.created_at ? 1 : -1))
}

export function generateReminders(count = 40): ReminderRecord[] {
  const reminders: ReminderRecord[] = []
  const priorities: Priority[] = ['LOW', 'MEDIUM', 'HIGH']
  const repeats: RepeatCycle[] = ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']

  for (let i = 0; i < count; i++) {
    const seed = REMINDER_TITLES[i % REMINDER_TITLES.length]
    // spread across -20 to +30 days so some are overdue, some due-soon, some future
    const dayOffset = ((i * 7) % 50) - 20
    const date = futureDateOffset(dayOffset)
    const isPast = dayOffset < 0
    const created = dateOffset(30 + i)

    reminders.push({
      id: `rem-${4000 + i}`,
      title: seed.title,
      description: seed.description,
      reminder_date: date,
      reminder_time: i % 3 === 0 ? '10:00' : i % 3 === 1 ? '15:30' : null,
      priority: priorities[i % priorities.length],
      status: isPast && i % 2 === 0 ? 'COMPLETED' : 'PENDING',
      repeat: repeats[i % repeats.length],
      attachments: i % 4 === 0 ? [{ id: `att-r${i}`, file_name: 'notice.pdf', file_size: 180_000, mime_type: 'application/pdf', storage_url: '#' }] : [],
      created_by: 'accountant-01',
      created_at: created,
      updated_at: created,
      deleted_at: null
    })
  }
  return reminders.sort((a, b) => (a.reminder_date < b.reminder_date ? -1 : 1))
}
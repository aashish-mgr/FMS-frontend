import { useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import { Plus, Search, Pencil, Trash2, X, Pin, Archive, ArchiveRestore, StickyNote } from 'lucide-react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import type { ColorLabel, Note, UpdateNoteInput, CreateNoteInput } from '../../types/notesTypes'
import { useCreateNoteMutation, useDeleteNoteMutation, useGetAllQuery, useToggleArchiveMutation, useTogglePinMutation, useUpdateNoteMutation } from '../../store/api/notesApi'

type Tone = 'positive' | 'negative' | 'indigo' | 'amber'

const toneMap: Record<Tone, { text: string; bg: string; ring: string }> = {
  positive: { text: 'text-positive', bg: 'bg-positive-soft', ring: 'ring-positive/15' },
  negative: { text: 'text-negative', bg: 'bg-negative-soft', ring: 'ring-negative/15' },
  indigo: { text: 'text-indigo', bg: 'bg-indigo-soft', ring: 'ring-indigo/15' },
  amber: { text: 'text-amber', bg: 'bg-amber-soft', ring: 'ring-amber/15' }
}

// colorLabel (SRS 9.1) -> visual treatment. null = neutral note.
const colorSwatch: Record<NonNullable<string> | 'none', { bar: string; chip: string }> = {
  green: { bar: 'bg-positive', chip: 'bg-positive-soft text-positive' },
  yellow: { bar: 'bg-amber', chip: 'bg-amber-soft text-amber' },
  red: { bar: 'bg-negative', chip: 'bg-negative-soft text-negative' },
  none: { bar: 'bg-line', chip: 'bg-paper text-muted' }
}

/* ------------------------------- Summary card ------------------------------- */

interface SummaryCardProps {
  label: string
  value: string
  tone: Tone
  Icon: ComponentType<{ size?: number; className?: string; strokeWidth?: number }>
}

function SummaryCard({ label, value, tone, Icon }: SummaryCardProps) {
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
      <p className={`font-mono tabular text-[28px] font-semibold mt-3 ${t.text}`}>{value}</p>
    </div>
  )
}

/* --------------------------------- Form bits --------------------------------- */

function FieldLabel({ children, required }: { children: string; required?: boolean }) {
  return (
    <span className="mb-1.5 block text-xs font-medium text-muted">
      {children} {required && <span className="text-negative">*</span>}
    </span>
  )
}

const inputClass =
  'w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-muted/70 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink transition-colors'

type FormState = {
  title: string
  description: string
  colorLabel:  string | null
}

const EMPTY_FORM: FormState = { title: '', description: '', colorLabel: null }

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NP', { day: '2-digit', month: 'short', year: 'numeric' })
}

/* ----------------------------------- Page ------------------------------------ */

export default function NotesPage() { 
  const {data: notes } = useGetAllQuery()
   const [updateNote] = useUpdateNoteMutation();
   const [createNote] = useCreateNoteMutation();
   const [updatePin] = useTogglePinMutation();
   const [updateArchive] = useToggleArchiveMutation();
   const [deleteNote] = useDeleteNoteMutation();

  const [search, setSearch] = useState('')
  const [pinnedFilter, setPinnedFilter] = useState<'all' | 'pinned' | 'unpinned'>('all')
  const [archivedFilter, setArchivedFilter] = useState<'active' | 'archived' | 'all'>('active')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const notDeleted = notes?.filter((n) => !n.deletedAt)

  const filtered = useMemo(() => {
    return notDeleted?.filter((n) => {
      if (archivedFilter === 'active' && n.isArchived) return false
      if (archivedFilter === 'archived' && !n.isArchived) return false
      if (pinnedFilter === 'pinned' && !n.isPinned) return false
      if (pinnedFilter === 'unpinned' && n.isPinned) return false
      if (search.trim()) {
        const q = search.trim().toLowerCase()
        if (!`${n.title} ${n.description}`.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [notDeleted, archivedFilter, pinnedFilter, search])

  const pinnedCount = notDeleted?.filter((n) => n.isPinned && !n.isArchived).length
  const archivedCount = notDeleted?.filter((n) => n.isArchived).length
  const activeCount = notDeleted?.filter((n) => !n.isArchived).length

  function openCreate() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormErrors({})
    setModalOpen(true)
  }

  function openEdit(n: Note) {
    setEditingId(n.id)
    setForm({ title: n.title, description: n.description, colorLabel: n.colorLabel  })
    setFormErrors({})
    setModalOpen(true)
  }

  function validate(f: FormState) {
    const errors: Partial<Record<keyof FormState, string>> = {}
    if (!f.title.trim()) errors.title = 'Title is required.'
    if (!f.description.trim()) errors.description = 'Description is required.'
    return errors
  }

  function handleSubmit() {
    const errors = validate(form)
    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    if (editingId) {
      updateNote({body: { title: form.title, description: form.description, colorLabel: form.colorLabel} as UpdateNoteInput ,id: editingId})
    } else {
      const newNote: CreateNoteInput = {
        title: form.title,
        description: form.description,
        colorLabel: form.colorLabel as string,
        isPinned: false,
        isArchived: false,
      }
      createNote(newNote as CreateNoteInput);
    }

    setModalOpen(false)
  }

  function togglePin(id: string) {
     const pin = notes?.find((n) => n.id === id)?.isPinned;
     updatePin({id, isPinned: !pin})
  }

  function toggleArchive(id: string) {
    const archive = notes?.find((n) => n.id === id)?.isArchived;
    console.log(!archive);
     updateArchive({id, isArchived: !archive});
  }

  function handleSoftDelete() {
    if (!pendingDeleteId) return
    deleteNote(pendingDeleteId);
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Topbar />

        <main className="px-5 lg:px-8 py-6 space-y-6 max-w-[1400px]">
          {/* Header */}
          <section className="animate-rise flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="font-display text-base font-semibold text-ink">Notes</h1>
              <p className="text-xs text-muted mt-0.5">Personal and office notes kept close to the financial workflow</p>
            </div>
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 bg-ink text-white rounded-lg px-4 py-2 text-xs font-medium hover:bg-ink/90 transition-colors"
            >
              <Plus size={14} /> Add Note
            </button>
          </section>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard label="Active Notes" value={String(activeCount)} tone="indigo" Icon={StickyNote} />
            <SummaryCard label="Pinned" value={String(pinnedCount)} tone="amber" Icon={Pin} />
            <SummaryCard label="Archived" value={String(archivedCount)} tone="positive" Icon={Archive} />
          </div>

          {/* Filters */}
          <div className="bg-card rounded-xl border border-line shadow-card p-4 animate-rise">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative sm:col-span-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  className={`${inputClass} pl-9`}
                  placeholder="Search notes…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select className={inputClass} value={pinnedFilter} onChange={(e) => setPinnedFilter(e.target.value as typeof pinnedFilter)}>
                <option value="all">All Notes</option>
                <option value="pinned">Pinned Only</option>
                <option value="unpinned">Unpinned Only</option>
              </select>
              <select
                className={inputClass}
                value={archivedFilter}
                onChange={(e) => setArchivedFilter(e.target.value as typeof archivedFilter)}
              >
                <option value="active">Active Only</option>
                <option value="archived">Archived Only</option>
                <option value="all">Active + Archived</option>
              </select>
            </div>
          </div>

          {/* Notes grid */}
          <div className="animate-rise">
            {filtered?.length === 0 ? (
              <div className="bg-card rounded-xl border border-line shadow-card p-10 text-center text-sm text-muted">
                No notes match the current filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered?.map((n) => {
                  const swatch = colorSwatch[n.colorLabel ?? 'none']
                  return (
                    <div
                      key={n.id}
                      className="relative bg-card rounded-xl border border-line shadow-card overflow-hidden flex flex-col"
                    >
                      <div className={`h-1.5 ${swatch?.bar}`} />
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display text-sm font-semibold text-ink leading-snug">{n.title}</h3>
                          <button
                            onClick={() => togglePin(n.id)}
                            className={`shrink-0 p-1 rounded-md hover:bg-paper ${n.isPinned ? 'text-amber' : 'text-muted'}`}
                            title={n.isPinned ? 'Unpin' : 'Pin'}
                          >
                            {n.isPinned ? <Pin size={14} fill="currentColor" /> : <Pin size={14} />}
                          </button>
                        </div>
                        <p className="text-xs text-muted mt-1.5 line-clamp-3 flex-1">{n.description}</p>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {n.colorLabel && (
                              <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${swatch?.chip}`}>
                                {n.colorLabel}
                              </span>
                            )}
                            {n.isArchived && (
                              <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium bg-paper text-muted border border-line">
                                Archived
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[10px] text-muted">{formatDate(n.createdAt as string)}</span>
                        </div>
                      </div>

                      <div className="border-t border-line px-3 py-2 flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleArchive(n.id)}
                          className="p-1.5 rounded-md text-muted hover:text-ink hover:bg-paper"
                          title={n.isArchived ? 'Restore' : 'Archive'}
                        >
                          {n.isArchived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                        </button>
                        <button onClick={() => openEdit(n)} className="p-1.5 rounded-md text-muted hover:text-ink hover:bg-paper" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setPendingDeleteId(n.id)}
                          className="p-1.5 rounded-md text-muted hover:text-negative hover:bg-negative-soft"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add / Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card rounded-xl border border-line shadow-panel">
            <div className="px-6 py-4 border-b border-line flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-ink">{editingId ? 'Edit Note' : 'Add Note'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-md text-muted hover:text-ink hover:bg-paper">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <FieldLabel required>Title</FieldLabel>
                <input
                  className={inputClass}
                  placeholder="Short descriptive title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
                {formErrors.title && <p className="mt-1 text-xs text-negative">{formErrors.title}</p>}
              </div>
              <div>
                <FieldLabel required>Description</FieldLabel>
                <textarea
                  rows={4}
                  className={inputClass}
                  placeholder="Full note content…"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
                {formErrors.description && <p className="mt-1 text-xs text-negative">{formErrors.description}</p>}
              </div>
              <div>
                <FieldLabel>Color Label</FieldLabel>
                <div className="flex items-center gap-2">
                  {(['none', 'green', 'yellow', 'red'] as const).map((c) => {
                    const val: ColorLabel = c === 'none' ? null : c
                    const isActive = form.colorLabel === val
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, colorLabel: val }))}
                        className={`w-8 h-8 rounded-lg border-2 ${colorSwatch[c].bar} ${
                          isActive ? 'border-ink' : 'border-transparent'
                        } transition-colors`}
                        title={c}
                      />
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-line flex justify-end gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-line text-sm font-medium text-muted hover:text-ink transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/90 transition-colors"
              >
                {editingId ? 'Save Changes' : 'Add Note'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 bg-ink/40 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-card rounded-xl border border-line shadow-panel p-6">
            <h2 className="font-display text-base font-semibold text-ink">Delete note?</h2>
            <p className="mt-2 text-sm text-muted">
              This soft-deletes the note (sets deleted_at). It can still be recovered from the database if needed.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setPendingDeleteId(null)}
                className="px-4 py-2 rounded-lg border border-line text-sm font-medium text-muted hover:text-ink transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSoftDelete}
                className="px-4 py-2 rounded-lg bg-negative text-white text-sm font-medium hover:bg-negative/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
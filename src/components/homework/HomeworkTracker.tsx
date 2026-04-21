import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useHomeworkStore } from '../../stores/homeworkStore'
import { format, parseISO, isPast, isToday } from 'date-fns'
import type { HomeworkItem } from '../../types'

const CHILDREN = [
  { id: 'wilf' as const, name: 'Wilf', colour: '#f59e0b' },
  { id: 'charlie' as const, name: 'Charlie', colour: '#ec4899' },
]

export default function HomeworkTracker() {
  const { items, addItem, toggleDone, deleteItem } = useHomeworkStore()
  const [showAdd, setShowAdd] = useState(false)
  const [child, setChild] = useState<'wilf' | 'charlie'>('wilf')
  const [subject, setSubject] = useState('')
  const [desc, setDesc] = useState('')
  const [due, setDue] = useState('')

  const submit = async () => {
    if (!subject.trim() || !due) return
    await addItem({ child, subject: subject.trim(), description: desc.trim() || undefined, dueDate: due, done: false })
    setSubject(''); setDesc(''); setDue(''); setShowAdd(false)
  }

  const dueBadge = (dueDate: string, done: boolean) => {
    if (done) return null
    const date = parseISO(dueDate)
    if (isToday(date)) return <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">Due today</span>
    if (isPast(date)) return <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">Overdue</span>
    return <span className="text-[10px] text-slate-400">Due {format(date, 'd MMM')}</span>
  }

  return (
    <div>
      <div className="divide-y divide-slate-200">
        {CHILDREN.map(({ id, name, colour }) => {
          const childItems = items.filter((i) => i.child === id)
          return (
            <div key={id} className="bg-white">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colour }} />
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{name}</span>
                <span className="text-xs text-slate-400">({childItems.filter(i => !i.done).length} to do)</span>
              </div>
              {childItems.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-400">No homework 🎉</p>
              ) : (
                childItems.map((item) => <HomeworkRow key={item.id} item={item} dueBadge={dueBadge} onToggle={toggleDone} onDelete={deleteItem} />)
              )}
            </div>
          )
        })}
      </div>

      {showAdd ? (
        <div className="p-4 bg-white border-t border-slate-200 mt-2">
          <div className="flex gap-2 mb-2">
            {CHILDREN.map((c) => (
              <button
                key={c.id}
                onClick={() => setChild(c.id)}
                style={child === c.id ? { backgroundColor: c.colour } : {}}
                className={`px-3 py-1 rounded-full text-sm font-medium border-2 transition-colors ${child === c.id ? 'text-white border-transparent' : 'border-slate-200 text-slate-600'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <input
            autoFocus
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-2 outline-none focus:border-blue-400"
          />
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-2 outline-none focus:border-blue-400"
          />
          <input
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:border-blue-400"
          />
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(false)} className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-xl text-sm">Cancel</button>
            <button onClick={submit} className="flex-1 bg-slate-900 text-white py-2 rounded-xl font-medium text-sm">Add</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="fixed bottom-20 right-4 w-13 h-13 bg-slate-900 text-white rounded-full shadow-lg flex items-center justify-center z-40 active:scale-95"
        >
          <Plus size={24} />
        </button>
      )}
    </div>
  )
}

function HomeworkRow({
  item,
  dueBadge,
  onToggle,
  onDelete,
}: {
  item: HomeworkItem
  dueBadge: (d: string, done: boolean) => React.ReactNode
  onToggle: (id: string, done: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  return (
    <div className={`flex items-start gap-3 px-4 py-2.5 border-b border-slate-100 ${item.done ? 'opacity-50' : ''}`}>
      <button
        onClick={() => onToggle(item.id, !item.done)}
        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${item.done ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}
      >
        {item.done && <svg viewBox="0 0 10 10" className="w-3 h-3 text-white fill-none stroke-current stroke-2"><polyline points="1,5 4,8 9,2"/></svg>}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium ${item.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>{item.subject}</span>
          {dueBadge(item.dueDate, item.done)}
        </div>
        {item.description && <p className="text-xs text-slate-500 mt-0.5 truncate">{item.description}</p>}
      </div>
      <button onClick={() => onDelete(item.id)} className="text-slate-300 hover:text-red-400 mt-0.5">
        <Trash2 size={14} />
      </button>
    </div>
  )
}

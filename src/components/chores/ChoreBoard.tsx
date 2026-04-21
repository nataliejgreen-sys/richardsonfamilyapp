import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useChoreStore } from '../../stores/choreStore'
import { useMembersStore } from '../../stores/membersStore'
import { format } from 'date-fns'
import type { Chore } from '../../types'

const FREQUENCIES: { value: Chore['frequency']; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'one-off', label: 'One-off' },
]

export default function ChoreBoard() {
  const { chores, addChore, toggleDone, deleteChore } = useChoreStore()
  const members = useMembersStore((s) => s.members)
  const [showAdd, setShowAdd] = useState(false)
  const [title, setTitle] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [frequency, setFrequency] = useState<Chore['frequency']>('weekly')

  const today = format(new Date(), 'yyyy-MM-dd')

  const submit = async () => {
    if (!title.trim() || !assignedTo) return
    await addChore(title.trim(), assignedTo, frequency)
    setTitle(''); setShowAdd(false)
  }

  return (
    <div>
      <div className="divide-y divide-slate-200">
        {members.map((member) => {
          const memberChores = chores.filter((c) => c.assignedTo === member.id)
          return (
            <div key={member.id} className="bg-white">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: member.colour }} />
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{member.name}</span>
                <span className="text-xs text-slate-400">
                  ({memberChores.filter((c) => !c.completedDates.includes(today)).length} to do)
                </span>
              </div>
              {memberChores.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-400">No chores assigned</p>
              ) : (
                memberChores.map((chore) => {
                  const done = chore.completedDates.includes(today)
                  return (
                    <div key={chore.id} className={`flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 ${done ? 'opacity-60' : ''}`}>
                      <button
                        onClick={() => toggleDone(chore.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${done ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}
                      >
                        {done && <svg viewBox="0 0 10 10" className="w-3 h-3 text-white fill-none stroke-current stroke-2"><polyline points="1,5 4,8 9,2"/></svg>}
                      </button>
                      <span className={`flex-1 text-sm ${done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {chore.title}
                      </span>
                      <span className="text-xs text-slate-400 shrink-0">{chore.frequency}</span>
                      <button onClick={() => deleteChore(chore.id)} className="text-slate-300 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          )
        })}
      </div>

      {showAdd ? (
        <div className="p-4 bg-white border-t border-slate-200 mt-2">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Chore title"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-2 outline-none focus:border-blue-400"
          />
          <div className="mb-2">
            <p className="text-xs text-slate-500 mb-1">Assign to</p>
            <div className="flex gap-2 flex-wrap">
              {members.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setAssignedTo(m.id)}
                  style={assignedTo === m.id ? { backgroundColor: m.colour } : {}}
                  className={`px-3 py-1 rounded-full text-sm border-2 font-medium transition-colors ${assignedTo === m.id ? 'text-white border-transparent' : 'border-slate-200 text-slate-600'}`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <p className="text-xs text-slate-500 mb-1">Frequency</p>
            <div className="flex gap-2">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFrequency(f.value)}
                  className={`flex-1 py-1 rounded-lg text-sm border-2 font-medium transition-colors ${frequency === f.value ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(false)} className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-xl text-sm">Cancel</button>
            <button onClick={submit} className="flex-1 bg-slate-900 text-white py-2 rounded-xl font-medium text-sm">Add chore</button>
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

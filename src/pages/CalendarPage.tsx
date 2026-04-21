import { useState } from 'react'
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isSameDay,
  parseISO,
  isToday,
} from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import Header from '../components/layout/Header'
import { useCalendarStore } from '../stores/calendarStore'
import { useMembersStore } from '../stores/membersStore'
import type { CalendarEvent, FamilyMember } from '../types'

const MEMBER_COLOURS = ['#3b82f6', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444']

export default function CalendarPage() {
  const { events, addEvent, deleteEvent } = useCalendarStore()
  const members = useMembersStore((s) => s.members)
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 })
  )
  const [showForm, setShowForm] = useState(false)
  const [formDate, setFormDate] = useState('')

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const eventsForDay = (date: Date) =>
    events.filter((e) => isSameDay(parseISO(e.date), date))

  const openForm = (date: Date) => {
    setFormDate(format(date, 'yyyy-MM-dd'))
    setShowForm(true)
  }

  return (
    <div className="flex flex-col flex-1">
      <Header
        title="Calendar"
        right={
          <button onClick={() => { setFormDate(format(new Date(), 'yyyy-MM-dd')); setShowForm(true) }}>
            <Plus size={20} className="text-white" />
          </button>
        }
      />

      {/* Week navigator */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 text-white">
        <button onClick={() => setWeekStart(subWeeks(weekStart, 1))}>
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-medium">
          {format(weekStart, 'd MMM')} – {format(addDays(weekStart, 6), 'd MMM yyyy')}
        </span>
        <button onClick={() => setWeekStart(addWeeks(weekStart, 1))}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {days.map((day) => {
          const dayEvents = eventsForDay(day)
          return (
            <div key={day.toISOString()} className="border-b border-slate-200">
              <button
                onClick={() => openForm(day)}
                className={`w-full flex items-center gap-2 px-4 py-2 text-left ${
                  isToday(day) ? 'bg-blue-50' : 'bg-white'
                }`}
              >
                <div className={`text-center w-8 ${isToday(day) ? 'text-blue-600' : 'text-slate-500'}`}>
                  <div className="text-[10px] uppercase font-medium">{format(day, 'EEE')}</div>
                  <div className={`text-lg font-bold leading-none ${isToday(day) ? 'bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center mx-auto' : ''}`}>
                    {format(day, 'd')}
                  </div>
                </div>
                <div className="flex-1 min-h-[36px] flex flex-col gap-1">
                  {dayEvents.map((e) => (
                    <div
                      key={e.id}
                      onClick={(ev) => { ev.stopPropagation(); deleteEvent(e.id) }}
                      style={{ backgroundColor: e.colour + '33', borderLeftColor: e.colour }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-xs border-l-2"
                    >
                      <span className="flex-1 font-medium text-slate-800">{e.title}</span>
                      {e.time && <span className="text-slate-500">{e.time}</span>}
                      <Trash2 size={10} className="text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </button>
            </div>
          )
        })}
      </div>

      {showForm && (
        <EventForm
          initialDate={formDate}
          members={members}
          colours={MEMBER_COLOURS}
          onSave={async (e) => { await addEvent(e); setShowForm(false) }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}

function EventForm({
  initialDate,
  members,
  colours,
  onSave,
  onClose,
}: {
  initialDate: string
  members: FamilyMember[]
  colours: string[]
  onSave: (e: Omit<CalendarEvent, 'id'>) => Promise<void>
  onClose: () => void
}) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(initialDate)
  const [time, setTime] = useState('')
  const [colour, setColour] = useState(colours[0])

  const submit = async () => {
    if (!title.trim() || !date) return
    await onSave({ title: title.trim(), date, time, colour })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="w-full bg-white rounded-t-2xl p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-slate-800">Add event</span>
        </div>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event title"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-2 outline-none focus:border-blue-400"
        />
        <div className="flex gap-2 mb-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
        </div>
        <div className="flex gap-2 mb-4">
          {members.map((m) => (
            <button
              key={m.id}
              onClick={() => setColour(m.colour)}
              style={{ backgroundColor: m.colour }}
              className={`px-3 py-1 rounded-full text-white text-xs font-medium border-2 ${colour === m.colour ? 'border-slate-800' : 'border-transparent'}`}
            >
              {m.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm">Cancel</button>
          <button onClick={submit} className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl font-medium text-sm">Add</button>
        </div>
      </div>
    </div>
  )
}

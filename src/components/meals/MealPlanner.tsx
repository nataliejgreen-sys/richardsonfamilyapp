import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react'
import { useMealStore, DAYS, DAY_LABELS, MEAL_SLOTS } from '../../stores/mealStore'
import { format, parseISO } from 'date-fns'

export default function MealPlanner() {
  const { weekKey, meals, setWeekOffset, setMeal, clearMeal } = useMealStore()
  const [offset, setOffset] = useState(0)
  const [editing, setEditing] = useState<{ day: string; slot: string } | null>(null)
  const [value, setValue] = useState('')

  const changeWeek = (dir: number) => {
    const next = offset + dir
    setOffset(next)
    setWeekOffset(next)
  }

  const weekLabel = () => {
    try {
      const d = parseISO(weekKey)
      return `w/c ${format(d, 'd MMM yyyy')}`
    } catch {
      return weekKey
    }
  }

  const startEdit = (day: string, slot: string) => {
    setValue((meals[day] as Record<string, string> | undefined)?.[slot] ?? '')
    setEditing({ day, slot })
  }

  const save = async () => {
    if (!editing) return
    if (value.trim()) {
      await setMeal(editing.day, editing.slot, value.trim())
    } else {
      await clearMeal(editing.day, editing.slot)
    }
    setEditing(null)
  }

  return (
    <div>
      {/* Week nav */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 text-white">
        <button onClick={() => changeWeek(-1)}><ChevronLeft size={20} /></button>
        <span className="text-sm font-medium">{weekLabel()}</span>
        <button onClick={() => changeWeek(1)}><ChevronRight size={20} /></button>
      </div>

      <div className="divide-y divide-slate-200">
        {DAYS.map((day) => (
          <div key={day} className="bg-white">
            <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {DAY_LABELS[day]}
              </span>
            </div>
            {MEAL_SLOTS.map((slot) => {
              const val = (meals[day] as Record<string, string> | undefined)?.[slot]
              const isEditing = editing?.day === day && editing?.slot === slot
              return (
                <div key={slot} className="flex items-center gap-2 px-4 py-2 border-b border-slate-100 last:border-0">
                  <span className="text-xs text-slate-400 w-16 capitalize">{slot}</span>
                  {isEditing ? (
                    <div className="flex-1 flex items-center gap-1">
                      <input
                        autoFocus
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(null) }}
                        className="flex-1 border-b border-blue-400 outline-none text-sm py-0.5 bg-transparent"
                      />
                      <button onClick={() => setEditing(null)}><X size={14} className="text-slate-400" /></button>
                      <button onClick={save}><Check size={14} className="text-green-600" /></button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(day, slot)}
                      className="flex-1 text-left text-sm"
                    >
                      {val ? (
                        <span className="text-slate-800">{val}</span>
                      ) : (
                        <span className="text-slate-300">+ add meal</span>
                      )}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

import { create } from 'zustand'
import { doc, setDoc, onSnapshot, db } from '../services/firebase'
import { FAMILY_ID } from '../services/firebase'
import type { MealWeek } from '../types'

export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
export const DAY_LABELS: Record<string, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu',
  fri: 'Fri', sat: 'Sat', sun: 'Sun',
}
export const MEAL_SLOTS = ['breakfast', 'lunch', 'dinner'] as const

function getWeekKey(date: Date = new Date()): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)) // Monday
  return d.toISOString().split('T')[0]
}

interface MealStore {
  weekKey: string
  meals: MealWeek
  loaded: boolean
  setWeekOffset: (offset: number) => void
  subscribe: () => () => void
  setMeal: (day: string, slot: string, value: string) => Promise<void>
  clearMeal: (day: string, slot: string) => Promise<void>
}

export const useMealStore = create<MealStore>((set, get) => {
  let unsubCurrent: (() => void) | null = null

  const subscribeToWeek = (weekKey: string) => {
    if (unsubCurrent) unsubCurrent()
    const ref = doc(db, 'families', FAMILY_ID, 'meals', weekKey)
    unsubCurrent = onSnapshot(ref, (snap) => {
      set({ meals: (snap.data() as MealWeek) ?? {}, loaded: true })
    })
    return unsubCurrent
  }

  return {
    weekKey: getWeekKey(),
    meals: {},
    loaded: false,

    setWeekOffset: (offset) => {
      const base = new Date()
      base.setDate(base.getDate() + offset * 7)
      const weekKey = getWeekKey(base)
      set({ weekKey, meals: {}, loaded: false })
      subscribeToWeek(weekKey)
    },

    subscribe: () => {
      const { weekKey } = get()
      subscribeToWeek(weekKey)
      return () => { if (unsubCurrent) unsubCurrent() }
    },

    setMeal: async (day, slot, value) => {
      const { weekKey, meals } = get()
      const ref = doc(db, 'families', FAMILY_ID, 'meals', weekKey)
      const updated = {
        ...meals,
        [day]: { ...(meals[day] ?? {}), [slot]: value },
      }
      set({ meals: updated })
      await setDoc(ref, updated)
    },

    clearMeal: async (day, slot) => {
      const { weekKey, meals } = get()
      const ref = doc(db, 'families', FAMILY_ID, 'meals', weekKey)
      const updated = { ...meals, [day]: { ...(meals[day] ?? {}), [slot]: '' } }
      set({ meals: updated })
      await setDoc(ref, updated)
    },
  }
})

export { getWeekKey }

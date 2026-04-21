import { create } from 'zustand'
import { col, addDoc, deleteDoc, updateDoc, onSnapshot, docRef } from '../services/firebase'
import type { CalendarEvent } from '../types'

interface CalendarStore {
  events: CalendarEvent[]
  loaded: boolean
  subscribe: () => () => void
  addEvent: (e: Omit<CalendarEvent, 'id'>) => Promise<void>
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  events: [],
  loaded: false,

  subscribe: () => {
    const unsub = onSnapshot(col('events'), (snap) => {
      const events = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CalendarEvent))
      set({ events, loaded: true })
    })
    return unsub
  },

  addEvent: async (e) => {
    await addDoc(col('events'), e)
  },

  updateEvent: async (id, updates) => {
    await updateDoc(docRef('events', id), updates)
  },

  deleteEvent: async (id) => {
    await deleteDoc(docRef('events', id))
  },
}))

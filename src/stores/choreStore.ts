import { create } from 'zustand'
import { col, addDoc, deleteDoc, updateDoc, onSnapshot, docRef } from '../services/firebase'
import type { Chore } from '../types'
import { format } from 'date-fns'

interface ChoreStore {
  chores: Chore[]
  loaded: boolean
  subscribe: () => () => void
  addChore: (title: string, assignedTo: string, frequency: Chore['frequency']) => Promise<void>
  toggleDone: (id: string) => Promise<void>
  deleteChore: (id: string) => Promise<void>
}

export const useChoreStore = create<ChoreStore>((set, get) => ({
  chores: [],
  loaded: false,

  subscribe: () => {
    const unsub = onSnapshot(col('chores'), (snap) => {
      const chores = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Chore))
      set({ chores, loaded: true })
    })
    return unsub
  },

  addChore: async (title, assignedTo, frequency) => {
    await addDoc(col('chores'), { title, assignedTo, frequency, completedDates: [] })
  },

  toggleDone: async (id) => {
    const chore = get().chores.find((c) => c.id === id)
    if (!chore) return
    const today = format(new Date(), 'yyyy-MM-dd')
    const isDone = chore.completedDates.includes(today)
    const completedDates = isDone
      ? chore.completedDates.filter((d) => d !== today)
      : [...chore.completedDates, today]
    await updateDoc(docRef('chores', id), { completedDates })
  },

  deleteChore: async (id) => {
    await deleteDoc(docRef('chores', id))
  },
}))

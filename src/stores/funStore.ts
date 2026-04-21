import { create } from 'zustand'
import { col, addDoc, deleteDoc, onSnapshot, docRef } from '../services/firebase'
import type { Activity } from '../types'

interface FunStore {
  activities: Activity[]
  loaded: boolean
  generating: boolean
  error: string | null
  subscribe: () => () => void
  setActivities: (activities: Activity[]) => void
  saveActivity: (a: Activity) => Promise<void>
  deleteActivity: (id: string) => Promise<void>
  setGenerating: (v: boolean) => void
  setError: (e: string | null) => void
}

export const useFunStore = create<FunStore>((set) => ({
  activities: [],
  loaded: false,
  generating: false,
  error: null,

  subscribe: () => {
    const unsub = onSnapshot(col('activities'), (snap) => {
      const activities = snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as Activity))
        .filter((a) => a.saved)
        .sort((a, b) => b.generatedAt - a.generatedAt)
      set({ activities, loaded: true })
    })
    return unsub
  },

  setActivities: (activities) => set({ activities }),

  saveActivity: async (a) => {
    await addDoc(col('activities'), { ...a, saved: true })
  },

  deleteActivity: async (id) => {
    await deleteDoc(docRef('activities', id))
  },

  setGenerating: (v) => set({ generating: v }),
  setError: (e) => set({ error: e }),
}))

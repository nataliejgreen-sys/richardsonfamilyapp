import { create } from 'zustand'
import { col, addDoc, deleteDoc, updateDoc, onSnapshot, docRef } from '../services/firebase'
import type { HomeworkItem } from '../types'

interface HomeworkStore {
  items: HomeworkItem[]
  loaded: boolean
  subscribe: () => () => void
  addItem: (item: Omit<HomeworkItem, 'id' | 'createdAt'>) => Promise<void>
  toggleDone: (id: string, done: boolean) => Promise<void>
  deleteItem: (id: string) => Promise<void>
}

export const useHomeworkStore = create<HomeworkStore>((set) => ({
  items: [],
  loaded: false,

  subscribe: () => {
    const unsub = onSnapshot(col('homework'), (snap) => {
      const items = snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as HomeworkItem))
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      set({ items, loaded: true })
    })
    return unsub
  },

  addItem: async (item) => {
    await addDoc(col('homework'), { ...item, createdAt: Date.now() })
  },

  toggleDone: async (id, done) => {
    await updateDoc(docRef('homework', id), { done })
  },

  deleteItem: async (id) => {
    await deleteDoc(docRef('homework', id))
  },
}))

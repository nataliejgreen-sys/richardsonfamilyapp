import { create } from 'zustand'
import { col, addDoc, deleteDoc, updateDoc, onSnapshot, docRef } from '../services/firebase'
import type { ShoppingItem } from '../types'

export const CATEGORIES: { value: ShoppingItem['category']; label: string; emoji: string }[] = [
  { value: 'produce', label: 'Fruit & Veg', emoji: '🥦' },
  { value: 'meat', label: 'Meat & Fish', emoji: '🥩' },
  { value: 'dairy', label: 'Dairy', emoji: '🥛' },
  { value: 'cupboard', label: 'Cupboard', emoji: '🥫' },
  { value: 'other', label: 'Other', emoji: '🛒' },
]

interface ShoppingStore {
  items: ShoppingItem[]
  loaded: boolean
  subscribe: () => () => void
  addItem: (name: string, category: ShoppingItem['category'], quantity?: string) => Promise<void>
  toggleDone: (id: string, done: boolean) => Promise<void>
  deleteItem: (id: string) => Promise<void>
  clearDone: () => Promise<void>
}

export const useShoppingStore = create<ShoppingStore>((set, get) => ({
  items: [],
  loaded: false,

  subscribe: () => {
    const unsub = onSnapshot(col('shopping'), (snap) => {
      const items = snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as ShoppingItem))
        .sort((a, b) => a.createdAt - b.createdAt)
      set({ items, loaded: true })
    })
    return unsub
  },

  addItem: async (name, category, quantity) => {
    await addDoc(col('shopping'), {
      name,
      category,
      quantity: quantity ?? '',
      done: false,
      createdAt: Date.now(),
    })
  },

  toggleDone: async (id, done) => {
    await updateDoc(docRef('shopping', id), { done })
  },

  deleteItem: async (id) => {
    await deleteDoc(docRef('shopping', id))
  },

  clearDone: async () => {
    const done = get().items.filter((i) => i.done)
    await Promise.all(done.map((i) => deleteDoc(docRef('shopping', i.id))))
  },
}))

import { create } from 'zustand'
import { col, addDoc, deleteDoc, updateDoc, onSnapshot, docRef } from '../services/firebase'
import type { Pin } from '../types'

interface BoardStore {
  pins: Pin[]
  loaded: boolean
  subscribe: () => () => void
  addPin: (text: string, colour: string, author: string) => Promise<void>
  updatePin: (id: string, text: string) => Promise<void>
  deletePin: (id: string) => Promise<void>
  reorder: (ids: string[]) => void
}

const PIN_COLOURS = ['#fef08a', '#86efac', '#f9a8d4', '#93c5fd', '#ffffff']

export const PIN_COLOUR_OPTIONS = PIN_COLOURS

export const useBoardStore = create<BoardStore>((set, get) => ({
  pins: [],
  loaded: false,

  subscribe: () => {
    const unsub = onSnapshot(col('pins'), (snap) => {
      const pins = snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as Pin))
        .sort((a, b) => a.order - b.order)
      set({ pins, loaded: true })
    })
    return unsub
  },

  addPin: async (text, colour, author) => {
    const { pins } = get()
    await addDoc(col('pins'), {
      text,
      colour,
      author,
      createdAt: Date.now(),
      order: pins.length,
    })
  },

  updatePin: async (id, text) => {
    await updateDoc(docRef('pins', id), { text })
  },

  deletePin: async (id) => {
    await deleteDoc(docRef('pins', id))
  },

  reorder: (ids) => {
    const { pins } = get()
    const reordered = ids.map((id, order) => {
      const pin = pins.find((p) => p.id === id)!
      return { ...pin, order }
    })
    set({ pins: reordered })
    reordered.forEach((p) => updateDoc(docRef('pins', p.id), { order: p.order }))
  },
}))

import { create } from 'zustand'
import { col, onSnapshot, setDoc, deleteDoc, docRef } from '../services/firebase'
import type { FamilyMember } from '../types'

const DEFAULT_MEMBERS: FamilyMember[] = [
  { id: 'mum', name: 'Mum', colour: '#3b82f6', initial: 'M' },
  { id: 'dad', name: 'Dad', colour: '#22c55e', initial: 'D' },
  { id: 'wilf', name: 'Wilf', colour: '#f59e0b', initial: 'W' },
  { id: 'charlie', name: 'Charlie', colour: '#ec4899', initial: 'C' },
]

interface MembersStore {
  members: FamilyMember[]
  loaded: boolean
  subscribe: () => () => void
  upsert: (m: FamilyMember) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useMembersStore = create<MembersStore>((set) => ({
  members: DEFAULT_MEMBERS,
  loaded: false,

  subscribe: () => {
    const unsub = onSnapshot(col('members'), (snap) => {
      if (snap.empty) {
        // Seed defaults on first load
        DEFAULT_MEMBERS.forEach((m) => setDoc(docRef('members', m.id), m))
        set({ members: DEFAULT_MEMBERS, loaded: true })
      } else {
        set({
          members: snap.docs.map((d) => d.data() as FamilyMember),
          loaded: true,
        })
      }
    })
    return unsub
  },

  upsert: async (m) => {
    await setDoc(docRef('members', m.id), m)
  },

  remove: async (id) => {
    await deleteDoc(docRef('members', id))
  },
}))

export { DEFAULT_MEMBERS }

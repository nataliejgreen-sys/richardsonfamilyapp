import { create } from 'zustand'
import { col, addDoc, deleteDoc, updateDoc, onSnapshot, docRef } from '../services/firebase'
import type { Club, KitItem } from '../types'
import { differenceInWeeks, parseISO, isAfter } from 'date-fns'

interface ClubStore {
  clubs: Club[]
  loaded: boolean
  subscribe: () => () => void
  addClub: (club: Omit<Club, 'id'>) => Promise<void>
  updateClub: (id: string, updates: Partial<Club>) => Promise<void>
  deleteClub: (id: string) => Promise<void>
  toggleKitItem: (clubId: string, itemIndex: number) => Promise<void>
}

export function sessionsRemaining(club: Club): number {
  const now = new Date()
  const end = parseISO(club.termEnd)
  if (isAfter(now, end)) return 0
  const weeksLeft = Math.max(0, differenceInWeeks(end, now))
  return Math.min(weeksLeft + 1, club.totalSessions)
}

export const useClubStore = create<ClubStore>((set, get) => ({
  clubs: [],
  loaded: false,

  subscribe: () => {
    const unsub = onSnapshot(col('clubs'), (snap) => {
      const clubs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Club))
      set({ clubs, loaded: true })
    })
    return unsub
  },

  addClub: async (club) => {
    await addDoc(col('clubs'), club)
  },

  updateClub: async (id, updates) => {
    await updateDoc(docRef('clubs', id), updates)
  },

  deleteClub: async (id) => {
    await deleteDoc(docRef('clubs', id))
  },

  toggleKitItem: async (clubId, itemIndex) => {
    const club = get().clubs.find((c) => c.id === clubId)
    if (!club) return
    const kit: KitItem[] = club.kit.map((k, i) =>
      i === itemIndex ? { ...k, packed: !k.packed } : k
    )
    await updateDoc(docRef('clubs', clubId), { kit })
  },
}))

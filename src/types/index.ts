export interface FamilyMember {
  id: string
  name: string
  colour: string
  initial: string
}

export interface Pin {
  id: string
  text: string
  colour: string
  author: string
  createdAt: number
  order: number
}

export interface CalendarEvent {
  id: string
  title: string
  date: string // ISO date YYYY-MM-DD
  time?: string
  memberId?: string
  colour: string
  notes?: string
}

export interface MealWeek {
  [day: string]: {
    breakfast?: string
    lunch?: string
    dinner?: string
  }
}

export interface ShoppingItem {
  id: string
  name: string
  category: 'produce' | 'meat' | 'dairy' | 'cupboard' | 'other'
  quantity?: string
  done: boolean
  createdAt: number
}

export interface Chore {
  id: string
  title: string
  assignedTo: string // FamilyMember id
  frequency: 'daily' | 'weekly' | 'one-off'
  completedDates: string[] // ISO dates
}

export interface HomeworkItem {
  id: string
  child: 'wilf' | 'charlie'
  subject: string
  description?: string
  dueDate: string // ISO date
  done: boolean
  createdAt: number
}

export interface KitItem {
  item: string
  packed: boolean
}

export interface ClubContact {
  name: string
  phone?: string
  email?: string
  venue?: string
}

export interface Club {
  id: string
  child: 'wilf' | 'charlie'
  name: string
  day: string // 'Monday', 'Tuesday', etc.
  startTime: string // 'HH:MM'
  endTime: string
  termStart: string // ISO date
  termEnd: string // ISO date
  totalSessions: number
  kit: KitItem[]
  contact: ClubContact
  emoji?: string
}

export interface Activity {
  id: string
  title: string
  description: string
  duration?: string
  tags: string[]
  saved: boolean
  generatedAt: number
}

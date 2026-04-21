import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/layout/BottomNav'
import BoardPage from './pages/BoardPage'
import CalendarPage from './pages/CalendarPage'
import FoodPage from './pages/FoodPage'
import KidsPage from './pages/KidsPage'
import HomeTabPage from './pages/HomeTabPage'
import { useMembersStore } from './stores/membersStore'
import { useBoardStore } from './stores/boardStore'
import { useCalendarStore } from './stores/calendarStore'
import { useMealStore } from './stores/mealStore'
import { useShoppingStore } from './stores/shoppingStore'
import { useChoreStore } from './stores/choreStore'
import { useHomeworkStore } from './stores/homeworkStore'
import { useClubStore } from './stores/clubStore'
import { useFunStore } from './stores/funStore'

export default function App() {
  const subscribeMembers = useMembersStore((s) => s.subscribe)
  const subscribeBoard = useBoardStore((s) => s.subscribe)
  const subscribeCalendar = useCalendarStore((s) => s.subscribe)
  const subscribeMeals = useMealStore((s) => s.subscribe)
  const subscribeShopping = useShoppingStore((s) => s.subscribe)
  const subscribeChores = useChoreStore((s) => s.subscribe)
  const subscribeHomework = useHomeworkStore((s) => s.subscribe)
  const subscribeClubs = useClubStore((s) => s.subscribe)
  const subscribeFun = useFunStore((s) => s.subscribe)

  useEffect(() => {
    const unsubs = [
      subscribeMembers(),
      subscribeBoard(),
      subscribeCalendar(),
      subscribeMeals(),
      subscribeShopping(),
      subscribeChores(),
      subscribeHomework(),
      subscribeClubs(),
      subscribeFun(),
    ]
    return () => unsubs.forEach((u) => u())
  }, [])

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-svh pb-16 bg-slate-100">
        <Routes>
          <Route path="/" element={<BoardPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/food" element={<FoodPage />} />
          <Route path="/kids" element={<KidsPage />} />
          <Route path="/home-tab" element={<HomeTabPage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}

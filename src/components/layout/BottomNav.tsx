import { NavLink } from 'react-router-dom'
import { ClipboardList, Calendar, ShoppingCart, Users, Home } from 'lucide-react'

const tabs = [
  { to: '/', icon: ClipboardList, label: 'Board' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/food', icon: ShoppingCart, label: 'Food' },
  { to: '/kids', icon: Users, label: 'Kids' },
  { to: '/home-tab', icon: Home, label: 'Home' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 flex z-50 safe-area-pb">
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors ${
              isActive ? 'text-blue-400' : 'text-slate-400'
            }`
          }
        >
          <Icon size={20} strokeWidth={1.75} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

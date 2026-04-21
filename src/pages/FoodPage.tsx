import { useState } from 'react'
import Header from '../components/layout/Header'
import SubTabs from '../components/layout/SubTabs'
import MealPlanner from '../components/meals/MealPlanner'
import ShoppingList from '../components/shopping/ShoppingList'

const TABS = [
  { key: 'meals', label: 'Meals' },
  { key: 'shopping', label: 'Shopping' },
]

export default function FoodPage() {
  const [tab, setTab] = useState('meals')

  return (
    <div className="flex flex-col flex-1">
      <Header title="Food" />
      <SubTabs tabs={TABS} active={tab} onChange={setTab} />
      <div className="flex-1 overflow-y-auto">
        {tab === 'meals' ? <MealPlanner /> : <ShoppingList />}
      </div>
    </div>
  )
}

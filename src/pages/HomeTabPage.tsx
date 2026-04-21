import { useState } from 'react'
import Header from '../components/layout/Header'
import SubTabs from '../components/layout/SubTabs'
import ChoreBoard from '../components/chores/ChoreBoard'
import FunBoard from '../components/fun/FunBoard'

const TABS = [
  { key: 'chores', label: 'Chores' },
  { key: 'fun', label: 'Fun Ideas' },
]

export default function HomeTabPage() {
  const [tab, setTab] = useState('chores')

  return (
    <div className="flex flex-col flex-1">
      <Header title="Home" />
      <SubTabs tabs={TABS} active={tab} onChange={setTab} />
      <div className="flex-1 overflow-y-auto">
        {tab === 'chores' ? <ChoreBoard /> : <FunBoard />}
      </div>
    </div>
  )
}

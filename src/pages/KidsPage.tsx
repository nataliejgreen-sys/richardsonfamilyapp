import { useState } from 'react'
import Header from '../components/layout/Header'
import SubTabs from '../components/layout/SubTabs'
import HomeworkTracker from '../components/homework/HomeworkTracker'
import ClubsView from '../components/clubs/ClubsView'

const TABS = [
  { key: 'homework', label: 'Homework' },
  { key: 'wilf', label: "Wilf's Clubs" },
  { key: 'charlie', label: "Charlie's Clubs" },
]

export default function KidsPage() {
  const [tab, setTab] = useState('homework')

  return (
    <div className="flex flex-col flex-1">
      <Header title="Kids" />
      <SubTabs tabs={TABS} active={tab} onChange={setTab} />
      <div className="flex-1 overflow-y-auto">
        {tab === 'homework' && <HomeworkTracker />}
        {tab === 'wilf' && <ClubsView child="wilf" />}
        {tab === 'charlie' && <ClubsView child="charlie" />}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Sparkles, Bookmark, BookmarkCheck, RefreshCw } from 'lucide-react'
import { useFunStore } from '../../stores/funStore'
import { generateActivities } from '../../services/claude'
import type { Activity } from '../../types'

const SETTINGS = [
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'indoor', label: 'Indoor' },
  { value: 'either', label: 'Either' },
] as const
const ENERGY = [
  { value: 'active', label: 'Active' },
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'either', label: 'Either' },
] as const
const DURATION = [
  { value: 'short', label: '< 1 hr' },
  { value: 'half-day', label: 'Half day' },
  { value: 'full-day', label: 'Full day' },
] as const

function currentSeason(): string {
  const m = new Date().getMonth()
  if (m < 3) return 'Winter'
  if (m < 6) return 'Spring'
  if (m < 9) return 'Summer'
  return 'Autumn'
}

export default function FunBoard() {
  const { activities, generating, error, saveActivity, setGenerating, setError } = useFunStore()
  const [setting, setSetting] = useState<'outdoor' | 'indoor' | 'either'>('either')
  const [energy, setEnergy] = useState<'active' | 'relaxed' | 'either'>('either')
  const [duration, setDuration] = useState<'short' | 'half-day' | 'full-day'>('half-day')
  const [season] = useState(currentSeason())
  const [generated, setGenerated] = useState<Activity[]>([])

  const generate = async () => {
    setGenerating(true)
    setError(null)
    try {
      const ideas = await generateActivities({ setting, energy, duration, season })
      setGenerated(ideas)
    } catch (e) {
      setError('Could not generate ideas — check your API key')
    } finally {
      setGenerating(false)
    }
  }

  const save = async (a: Activity) => {
    await saveActivity(a)
    setGenerated((prev) => prev.filter((x) => x.id !== a.id))
  }

  const Chip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm border font-medium transition-colors ${
        active ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600 bg-white'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="p-4 space-y-4">
      {/* Filters */}
      <div className="bg-white rounded-xl p-4 space-y-3 shadow-sm">
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-1.5">Setting</p>
          <div className="flex gap-2">{SETTINGS.map((s) => <Chip key={s.value} label={s.label} active={setting === s.value} onClick={() => setSetting(s.value)} />)}</div>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-1.5">Energy</p>
          <div className="flex gap-2">{ENERGY.map((e) => <Chip key={e.value} label={e.label} active={energy === e.value} onClick={() => setEnergy(e.value)} />)}</div>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-1.5">Duration</p>
          <div className="flex gap-2">{DURATION.map((d) => <Chip key={d.value} label={d.label} active={duration === d.value} onClick={() => setDuration(d.value)} />)}</div>
        </div>

        <button
          onClick={generate}
          disabled={generating}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white py-2.5 rounded-xl font-medium text-sm disabled:opacity-60 active:scale-98 transition-transform"
        >
          {generating ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {generating ? 'Generating…' : '✨ Generate ideas'}
        </button>

        {error && <p className="text-xs text-red-500 text-center">{error}</p>}
      </div>

      {/* Generated ideas */}
      {generated.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2">New ideas — tap bookmark to save</p>
          <div className="space-y-2">
            {generated.map((a) => <ActivityCard key={a.id} activity={a} onSave={() => save(a)} saved={false} />)}
          </div>
        </div>
      )}

      {/* Saved activities */}
      {activities.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2">Saved ideas</p>
          <div className="space-y-2">
            {activities.map((a) => <ActivityCard key={a.id} activity={a} saved />)}
          </div>
        </div>
      )}

      {generated.length === 0 && activities.length === 0 && !generating && (
        <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm gap-2">
          <span className="text-3xl">🎉</span>
          <p>Pick your preferences and generate ideas</p>
        </div>
      )}
    </div>
  )
}

function ActivityCard({ activity, onSave, saved }: { activity: Activity; onSave?: () => void; saved: boolean }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="font-semibold text-slate-800 text-sm">{activity.title}</p>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{activity.description}</p>
        </div>
        {onSave && (
          <button onClick={onSave} className="text-slate-400 hover:text-violet-600 transition-colors shrink-0">
            <Bookmark size={18} />
          </button>
        )}
        {saved && <BookmarkCheck size={18} className="text-violet-500 shrink-0" />}
      </div>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {activity.duration && (
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{activity.duration}</span>
        )}
        {activity.tags?.map((tag) => (
          <span key={tag} className="text-[10px] bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>
    </div>
  )
}

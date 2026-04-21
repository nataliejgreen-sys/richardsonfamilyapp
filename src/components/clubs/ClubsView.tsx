import { useState } from 'react'
import { Plus, Trash2, Phone, MapPin, ChevronDown, ChevronUp } from 'lucide-react'
import { useClubStore, sessionsRemaining } from '../../stores/clubStore'
import { format, parseISO } from 'date-fns'
import type { Club, KitItem } from '../../types'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

interface Props {
  child: 'wilf' | 'charlie'
}

export default function ClubsView({ child }: Props) {
  const { clubs, addClub, deleteClub, toggleKitItem } = useClubStore()
  const [showAdd, setShowAdd] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const childClubs = clubs.filter((c) => c.child === child)

  return (
    <div>
      <div className="divide-y divide-slate-200">
        {childClubs.length === 0 && !showAdd && (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm gap-2">
            <span className="text-3xl">🏅</span>
            <p>No clubs yet — tap + to add one</p>
          </div>
        )}

        {childClubs.map((club) => {
          const remaining = sessionsRemaining(club)
          const isExpanded = expanded === club.id
          return (
            <div key={club.id} className="bg-white">
              <button
                onClick={() => setExpanded(isExpanded ? null : club.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <span className="text-2xl">{club.emoji ?? '🏅'}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-sm">{club.name}</div>
                  <div className="text-xs text-slate-500">{club.day} · {club.startTime}–{club.endTime}</div>
                </div>
                <div className="flex items-center gap-2">
                  {remaining > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      {remaining} left
                    </span>
                  )}
                  {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-slate-100 bg-slate-50 space-y-3">
                  {/* Term info */}
                  <div className="text-xs text-slate-600 pt-2">
                    <span className="font-medium">Term: </span>
                    {format(parseISO(club.termStart), 'd MMM')} – {format(parseISO(club.termEnd), 'd MMM yyyy')}
                    {' · '}{remaining} sessions remaining
                  </div>

                  {/* Contact */}
                  {(club.contact.name || club.contact.venue) && (
                    <div className="space-y-1">
                      {club.contact.name && (
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <span className="font-medium">{club.contact.name}</span>
                          {club.contact.phone && (
                            <a href={`tel:${club.contact.phone}`} className="flex items-center gap-1 text-blue-600">
                              <Phone size={11} /> {club.contact.phone}
                            </a>
                          )}
                        </div>
                      )}
                      {club.contact.venue && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin size={11} /> {club.contact.venue}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Kit */}
                  {club.kit.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1">Kit checklist</p>
                      <div className="space-y-1">
                        {club.kit.map((item, i) => (
                          <button
                            key={i}
                            onClick={() => toggleKitItem(club.id, i)}
                            className="flex items-center gap-2 w-full"
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${item.packed ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                              {item.packed && <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-white fill-none stroke-current stroke-2"><polyline points="1,5 4,8 9,2"/></svg>}
                            </div>
                            <span className={`text-xs ${item.packed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{item.item}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => deleteClub(club.id)}
                    className="flex items-center gap-1 text-xs text-red-500 mt-1"
                  >
                    <Trash2 size={12} /> Delete club
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {showAdd ? (
        <AddClubForm child={child} onSave={async (c) => { await addClub(c); setShowAdd(false) }} onClose={() => setShowAdd(false)} />
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="fixed bottom-20 right-4 w-13 h-13 bg-slate-900 text-white rounded-full shadow-lg flex items-center justify-center z-40 active:scale-95"
        >
          <Plus size={24} />
        </button>
      )}
    </div>
  )
}

function AddClubForm({ child, onSave, onClose }: { child: 'wilf' | 'charlie'; onSave: (c: Omit<Club, 'id'>) => Promise<void>; onClose: () => void }) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('🏅')
  const [day, setDay] = useState('Monday')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [termStart, setTermStart] = useState('')
  const [termEnd, setTermEnd] = useState('')
  const [sessions, setSessions] = useState('10')
  const [venue, setVenue] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [kitInput, setKitInput] = useState('')
  const [kitItems, setKitItems] = useState<KitItem[]>([])

  const addKit = () => {
    if (!kitInput.trim()) return
    setKitItems([...kitItems, { item: kitInput.trim(), packed: false }])
    setKitInput('')
  }

  const submit = async () => {
    if (!name.trim() || !start || !end || !termStart || !termEnd) return
    await onSave({
      child, name: name.trim(), emoji, day,
      startTime: start, endTime: end,
      termStart, termEnd,
      totalSessions: parseInt(sessions) || 10,
      kit: kitItems,
      contact: { name: contactName.trim(), phone: phone.trim(), venue: venue.trim() },
    })
  }

  return (
    <div className="p-4 bg-white border-t border-slate-200 space-y-3">
      <div className="font-semibold text-slate-800">Add club</div>
      <div className="flex gap-2">
        <input
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          placeholder="Emoji"
          className="w-14 border border-slate-200 rounded-lg px-2 py-2 text-center text-lg outline-none"
        />
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Club name"
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
      </div>
      <select value={day} onChange={(e) => setDay(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none">
        {DAYS.map((d) => <option key={d}>{d}</option>)}
      </select>
      <div className="flex gap-2">
        <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
        <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
      </div>
      <div className="flex gap-2">
        <input type="date" value={termStart} onChange={(e) => setTermStart(e.target.value)} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
        <input type="date" value={termEnd} onChange={(e) => setTermEnd(e.target.value)} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
      </div>
      <input
        type="number"
        value={sessions}
        onChange={(e) => setSessions(e.target.value)}
        placeholder="Total sessions"
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
      />
      <input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Coach / teacher name" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />
      <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue / location" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none" />

      <div>
        <div className="text-xs font-semibold text-slate-500 mb-1">Kit items</div>
        <div className="flex gap-2 mb-2">
          <input
            value={kitInput}
            onChange={(e) => setKitInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') addKit() }}
            placeholder="e.g. Shin pads"
            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
          />
          <button onClick={addKit} className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm">Add</button>
        </div>
        {kitItems.map((k, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-slate-700 py-0.5">
            <span>•</span> {k.item}
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-xl text-sm">Cancel</button>
        <button onClick={submit} className="flex-1 bg-slate-900 text-white py-2 rounded-xl font-medium text-sm">Save club</button>
      </div>
    </div>
  )
}

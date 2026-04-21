import { useState } from 'react'
import { X } from 'lucide-react'
import { useBoardStore, PIN_COLOUR_OPTIONS } from '../../stores/boardStore'
import { useMembersStore } from '../../stores/membersStore'

interface Props {
  onClose: () => void
}

export default function AddPinModal({ onClose }: Props) {
  const { addPin } = useBoardStore()
  const members = useMembersStore((s) => s.members)
  const [text, setText] = useState('')
  const [colour, setColour] = useState(PIN_COLOUR_OPTIONS[0])
  const [author, setAuthor] = useState(members[0]?.initial ?? 'M')

  const submit = async () => {
    if (!text.trim()) return
    await addPin(text.trim(), colour, author)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-white rounded-t-2xl p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-slate-800">New pin</span>
          <button onClick={onClose}><X size={20} className="text-slate-500" /></button>
        </div>

        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your note…"
          className="w-full border border-slate-200 rounded-lg p-3 text-sm resize-none h-24 outline-none focus:border-blue-400"
        />

        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs text-slate-500">Colour</span>
          <div className="flex gap-2">
            {PIN_COLOUR_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => setColour(c)}
                style={{ backgroundColor: c }}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  colour === c ? 'border-slate-800 scale-110' : 'border-transparent'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-slate-500">From</span>
          <div className="flex gap-2">
            {members.map((m) => (
              <button
                key={m.id}
                onClick={() => setAuthor(m.initial)}
                style={{ backgroundColor: m.colour }}
                className={`w-7 h-7 rounded-full text-white text-xs font-bold border-2 transition-all ${
                  author === m.initial ? 'border-slate-800 scale-110' : 'border-transparent'
                }`}
              >
                {m.initial}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={submit}
          className="mt-4 w-full bg-slate-900 text-white py-2.5 rounded-xl font-medium text-sm"
        >
          Pin it
        </button>
      </div>
    </div>
  )
}

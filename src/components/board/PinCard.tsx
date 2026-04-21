import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Trash2, Pencil, Check, X } from 'lucide-react'
import { useBoardStore } from '../../stores/boardStore'
import type { Pin } from '../../types'

interface Props {
  pin: Pin
}

export default function PinCard({ pin }: Props) {
  const { updatePin, deletePin } = useBoardStore()
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(pin.text)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: pin.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: pin.colour,
    opacity: isDragging ? 0.5 : 1,
  }

  const save = async () => {
    if (text.trim()) await updatePin(pin.id, text.trim())
    setEditing(false)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg p-3 shadow-sm border border-black/5 flex flex-col gap-2 min-h-[100px] relative group"
    >
      {/* drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 right-1 p-1 cursor-grab opacity-0 group-hover:opacity-40 touch-none"
      >
        <div className="w-3 h-3 grid grid-cols-2 gap-px">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-black/50" />
          ))}
        </div>
      </div>

      {/* author badge */}
      <div className="flex items-start justify-between gap-1">
        <span className="w-5 h-5 rounded-full bg-black/20 text-[10px] font-bold flex items-center justify-center shrink-0">
          {pin.author}
        </span>
        {!editing && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => { setText(pin.text); setEditing(true) }} className="p-0.5 hover:bg-black/10 rounded">
              <Pencil size={12} />
            </button>
            <button onClick={() => deletePin(pin.id)} className="p-0.5 hover:bg-black/10 rounded text-red-600">
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <>
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-transparent resize-none text-sm outline-none text-slate-800 leading-snug min-h-[60px]"
            onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) save() }}
          />
          <div className="flex gap-1 justify-end">
            <button onClick={() => setEditing(false)} className="p-1 hover:bg-black/10 rounded"><X size={14} /></button>
            <button onClick={save} className="p-1 hover:bg-black/10 rounded text-green-700"><Check size={14} /></button>
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-800 leading-snug whitespace-pre-wrap break-words">{pin.text}</p>
      )}
    </div>
  )
}

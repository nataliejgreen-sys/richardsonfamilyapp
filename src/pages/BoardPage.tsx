import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import Header from '../components/layout/Header'
import PinCard from '../components/board/PinCard'
import AddPinModal from '../components/board/AddPinModal'
import { useBoardStore } from '../stores/boardStore'

export default function BoardPage() {
  const { pins, reorder } = useBoardStore()
  const [showAdd, setShowAdd] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = pins.findIndex((p) => p.id === active.id)
    const newIndex = pins.findIndex((p) => p.id === over.id)
    const reordered = [...pins]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)
    reorder(reordered.map((p) => p.id))
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Richardson Family Board" />

      <div className="flex-1 p-3 overflow-y-auto">
        {pins.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-sm gap-2">
            <span className="text-3xl">📌</span>
            <p>No pins yet — tap + to add one</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={pins.map((p) => p.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 gap-2">
                {pins.map((pin) => (
                  <PinCard key={pin.id} pin={pin} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-20 right-4 w-13 h-13 bg-slate-900 text-white rounded-full shadow-lg flex items-center justify-center z-40 active:scale-95 transition-transform"
        aria-label="Add pin"
      >
        <Plus size={24} />
      </button>

      {showAdd && <AddPinModal onClose={() => setShowAdd(false)} />}
    </div>
  )
}

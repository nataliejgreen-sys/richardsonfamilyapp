import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useShoppingStore, CATEGORIES } from '../../stores/shoppingStore'
import type { ShoppingItem } from '../../types'

export default function ShoppingList() {
  const { items, addItem, toggleDone, deleteItem, clearDone } = useShoppingStore()
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [qty, setQty] = useState('')
  const [cat, setCat] = useState<ShoppingItem['category']>('other')

  const submit = async () => {
    if (!name.trim()) return
    await addItem(name.trim(), cat, qty.trim() || undefined)
    setName(''); setQty(''); setShowAdd(false)
  }

  const doneCount = items.filter((i) => i.done).length

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 text-white">
        <span className="text-sm">{items.length - doneCount} remaining</span>
        {doneCount > 0 && (
          <button onClick={clearDone} className="text-xs text-slate-300">
            Clear {doneCount} done
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {CATEGORIES.map(({ value, label, emoji }) => {
          const catItems = items.filter((i) => i.category === value)
          if (catItems.length === 0) return null
          return (
            <div key={value} className="bg-white">
              <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <span>{emoji}</span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
              </div>
              {catItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 last:border-0">
                  <button
                    onClick={() => toggleDone(item.id, !item.done)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      item.done ? 'bg-green-500 border-green-500' : 'border-slate-300'
                    }`}
                  >
                    {item.done && <svg viewBox="0 0 10 10" className="w-3 h-3 text-white fill-none stroke-current stroke-2"><polyline points="1,5 4,8 9,2"/></svg>}
                  </button>
                  <span className={`flex-1 text-sm ${item.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {item.name}
                    {item.quantity && <span className="text-slate-400 ml-1">× {item.quantity}</span>}
                  </span>
                  <button onClick={() => deleteItem(item.id)} className="text-slate-300 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {items.length === 0 && !showAdd && (
        <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm gap-2">
          <span className="text-3xl">🛒</span>
          <p>Shopping list is empty</p>
        </div>
      )}

      {showAdd ? (
        <div className="p-4 bg-white border-t border-slate-200">
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
            placeholder="Item name"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-2 outline-none focus:border-blue-400"
          />
          <div className="flex gap-2 mb-3">
            <input
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="Qty (optional)"
              className="w-24 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value as ShoppingItem['category'])}
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(false)} className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-xl text-sm">Cancel</button>
            <button onClick={submit} className="flex-1 bg-slate-900 text-white py-2 rounded-xl font-medium text-sm">Add</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="fixed bottom-20 right-4 w-13 h-13 bg-slate-900 text-white rounded-full shadow-lg flex items-center justify-center z-40 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      )}
    </div>
  )
}

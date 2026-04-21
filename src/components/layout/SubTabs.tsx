interface SubTabsProps {
  tabs: { key: string; label: string }[]
  active: string
  onChange: (key: string) => void
}

export default function SubTabs({ tabs, active, onChange }: SubTabsProps) {
  return (
    <div className="flex gap-2 px-3 py-2 bg-slate-800 overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`shrink-0 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            active === t.key
              ? 'bg-blue-500 text-white'
              : 'bg-slate-700 text-slate-300'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

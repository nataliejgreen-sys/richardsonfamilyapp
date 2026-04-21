interface HeaderProps {
  title: string
  right?: React.ReactNode
}

export default function Header({ title, right }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-md">
      <h1 className="text-base font-semibold tracking-tight">{title}</h1>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </header>
  )
}

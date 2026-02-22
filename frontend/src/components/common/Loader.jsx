export function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12">
      <div className="w-9 h-9 rounded-full border-[3px] border-metro border-t-accent animate-spin" />
      {text && <p className="text-muted text-sm">{text}</p>}
    </div>
  )
}

export function ErrorMsg({ message }) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
      ⚠️ {message}
    </div>
  )
}
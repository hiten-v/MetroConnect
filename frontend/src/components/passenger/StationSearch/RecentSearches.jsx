export default function RecentSearches({ searches, onSelect }) {
  if (!searches || searches.length === 0) return null

  return (
    <div className="mt-4">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-muted mb-2.5">
         Recent Searches
      </p>
      <div className="flex flex-col gap-1.5">
        {searches.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s)}
            className="flex items-center gap-3 px-3.5 py-2.5 bg-surface2 border border-metro rounded-lg text-sm text-left hover:border-accent transition-colors duration-200 group"
          >
            <span className="text-muted text-base group-hover:text-accent transition-colors">🔍</span>
            <span className="font-medium text-[#e8eaf6]">{s.source?.name}</span>
            <span className="text-muted">→</span>
            <span className="font-medium text-[#e8eaf6]">{s.destination?.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
import { useState, useRef, useEffect } from 'react'
import { useAutocomplete } from '../../../hooks/useAutocomplete'

export default function AutocompleteInput({ label, value, stations, onSelect, placeholder, icon }) {
  const { query, setQuery, filtered } = useAutocomplete(stations)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (value) setQuery(value.name)
    else setQuery('')
  }, [value])

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (station) => {
    onSelect(station)
    setQuery(station.name)
    setOpen(false)
  }

  const handleChange = (e) => {
    setQuery(e.target.value)
    setOpen(true)
    if (!e.target.value) onSelect(null)
  }

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      {/* Label */}
      <label className="block text-[10px] font-semibold tracking-widest uppercase text-muted mb-1.5">
        {label}
      </label>

      {/* Input box */}
      <div className={`flex items-center gap-2.5 bg-surface2 rounded-xl px-3.5 py-2.5 border transition-colors duration-200
        ${open ? 'border-accent' : 'border-metro'}`}>
        <span className="text-lg flex-shrink-0">{icon}</span>
        <input
          value={query}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className="bg-transparent border-none outline-none text-[#e8eaf6] text-sm flex-1 min-w-0 placeholder:text-muted"
        />
        {value && (
          <button
            onClick={() => { onSelect(null); setQuery('') }}
            className="text-muted hover:text-[#e8eaf6] text-base transition-colors"
          >✕</button>
        )}
      </div>

      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-surface border border-metro rounded-xl overflow-hidden shadow-2xl">
          {filtered.map((station) => (
            <button
              key={station._id}
              onClick={() => handleSelect(station)}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm border-b border-metro last:border-b-0 hover:bg-surface2 transition-colors duration-150"
            >
              {/* Line color dots */}
              <div className="flex gap-1 flex-shrink-0">
                {station.lineIds?.map((line) => (
                  <div
                    key={line._id || line}
                    className="w-2.5 h-2.5 rounded-full border border-white/20"
                    style={{ background: line.color || '#999' }}
                  />
                ))}
              </div>

              <span className="flex-1 font-medium text-[#e8eaf6]">{station.name}</span>

              <span className="text-[11px] text-muted font-mono bg-surface2 px-1.5 py-0.5 rounded">
                {station.code}
              </span>

              {station.isInterchange && (
                <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-semibold">
                  ⇄ XCHG
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
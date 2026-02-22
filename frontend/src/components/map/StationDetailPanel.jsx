import { motion, AnimatePresence } from 'framer-motion'
import { useBooking } from '../../context/BookingContext'

export default function StationDetailPanel({ station, onClose }) {
  const { setSource, setDestination } = useBooking()

  if (!station) return null

  const fac = station.facilities || {}

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 260, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 260, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="absolute right-0 top-0 bottom-0 w-60 bg-surface border-l border-metro z-20 p-5 overflow-y-auto"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-surface2 text-muted text-sm flex items-center justify-center hover:text-[#e8eaf6] transition-colors"
        >✕</button>

        {/* Station name */}
        <div className="mb-4 pr-6">
          {station.isInterchange && (
            <div className="text-[10px] font-bold tracking-widest text-accent uppercase mb-1.5">
              ⇄ Interchange Station
            </div>
          )}
          <h3 className="text-base font-bold text-[#e8eaf6] mb-1">{station.name}</h3>
          <code className="text-[11px] text-muted bg-surface2 px-1.5 py-0.5 rounded">
            {station.code}
          </code>
        </div>

        {/* Lines */}
        <div className="mb-4">
          <div className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-2">Lines</div>
          {station.lineIds?.map(line => (
            <div
              key={line._id || line}
              className="flex items-center gap-2 mb-1.5 px-2.5 py-1.5 bg-surface2 rounded-lg"
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: line.color || '#999' }} />
              <span className="text-xs text-[#e8eaf6]">{line.name || 'Unknown Line'}</span>
            </div>
          ))}
        </div>

        {/* Facilities */}
        <div className="mb-5">
          <div className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-2">Facilities</div>
          <div className="flex flex-wrap gap-1.5">
            {fac.accessible && <Chip icon="♿" label="Accessible" />}
            {fac.parking    && <Chip icon="🅿️" label="Parking"   />}
            <Chip icon="🚪" label={`${fac.exits || 2} Exits`} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => { setSource(station); onClose() }}
            className="w-full py-2 rounded-lg text-xs font-bold bg-accent text-white hover:bg-accent-h transition-all"
          >
            🟢 Book from here
          </button>
          <button
            onClick={() => { setDestination(station); onClose() }}
            className="w-full py-2 rounded-lg text-xs font-medium border border-metro text-muted hover:bg-surface2 hover:text-[#e8eaf6] transition-all"
          >
            🔴 Book to here
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function Chip({ icon, label }) {
  return (
    <div className="flex items-center gap-1 px-2.5 py-1 bg-surface2 rounded-full text-xs text-muted">
      <span>{icon}</span><span>{label}</span>
    </div>
  )
}
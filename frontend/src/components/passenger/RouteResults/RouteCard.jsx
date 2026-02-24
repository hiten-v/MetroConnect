import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RouteTimeline from './RouteTimeline'

export default function RouteCard({ route, index, isRecommended, onSelect }) {
  const [expanded, setExpanded] = useState(isRecommended)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`rounded-xl overflow-hidden border
        ${isRecommended ? 'bg-accent/5 border-accent' : 'bg-surface border-metro'}`}
    >
      <div className="p-4">
        {isRecommended && (
          <div className="text-[10px] font-bold tracking-widest text-accent uppercase mb-2">
            Recommended
          </div>
        )}

        {/* Line pills */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {route.segments.map((seg, i) => (
            <span key={i}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
              style={{ background: `${seg.lineColor}22`, borderColor: `${seg.lineColor}70`, color: seg.lineColor }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: seg.lineColor }} />
              {seg.line.replace(' Line', '')}
            </span>
          ))}
        </div>

        {/* Stats grid — 2x2 on mobile, row on desktop */}
        <div className="grid grid-cols-2 md:flex md:items-center gap-3 md:gap-5 mb-3">
          <Stat  label="Duration"  value={`${route.totalTime} min`} />
          <Stat  label="Stops"     value={route.totalStops} />
          <Stat  label="Transfers" value={route.transfers} warn={route.transfers > 0} />
          <Stat icon="₹"  label="Fare"      value={`₹${route.fare}`} accent />
        </div>

        {/* Action buttons — full width on mobile */}
        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex-1 py-2 rounded-lg text-xs font-medium border border-metro text-muted
                       hover:bg-surface2 hover:text-[#e8eaf6] transition-all duration-200"
          >
            {expanded ? '▲ Hide' : '▼ Details'}
          </button>
          <button
            onClick={() => onSelect(route)}
            className="flex-1 py-2 rounded-lg text-xs font-bold bg-accent text-white
                       hover:bg-accent-h transition-all duration-200"
          >
            Book →
          </button>
        </div>
      </div>

      {/* Timeline */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-3 border-t border-metro">
              <RouteTimeline segments={route.segments} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Stat({ icon, label, value, warn, accent }) {
  return (
    <div className="flex items-center gap-2 md:flex-col md:items-center md:gap-0">
      <div className={`text-sm font-bold
        ${warn ? 'text-amber-400' : accent ? 'text-accent' : 'text-[#e8eaf6]'}`}>
        {icon} {value}
      </div>
      <div className="text-[10px] text-muted uppercase tracking-wide">{label}</div>
    </div>
  )
}
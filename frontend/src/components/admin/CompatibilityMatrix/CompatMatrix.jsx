// import { useState, useEffect } from 'react'
// import api from '../../../utils/api';
// import { Loader } from '../../common/Loader'
// const API_URL = import.meta.env.VITE_API_URL;
// const STATUS = {
//   direct:       { color: '#22c55e', bg: 'bg-green-500/15',  border: 'border-green-500/40',  label: 'Direct Upgrade',        icon: '✅' },
//   intermediate: { color: '#f59e0b', bg: 'bg-amber-500/15',  border: 'border-amber-500/40',  label: 'Needs Intermediate',    icon: '⚠️' },
//   blocked:      { color: '#ef4444', bg: 'bg-red-500/15',    border: 'border-red-500/40',    label: 'Blocked',               icon: '🚫' },
// }

// export default function CompatMatrix() {
//   const [matrix,  setMatrix]  = useState([])
//   const [loading, setLoading] = useState(true)
//   const [tooltip, setTooltip] = useState(null)

//   useEffect(() => {
//     api.get(`${API_URL}/api/matrix`)
//       .then(r => { setMatrix(r.data.data || []); setLoading(false) })
//       .catch(() => setLoading(false))
//   }, [])

//   if (loading) return <Loader text="Loading compatibility matrix..." />

//   const versions = [...new Set([
//     ...matrix.map(m => m.fromVersion),
//     ...matrix.map(m => m.toVersion),
//   ])].sort()

//   const getCell = (from, to) => matrix.find(m => m.fromVersion === from && m.toVersion === to)

//   if (!versions.length) return (
//     <div className="text-center py-16 text-muted text-sm">No matrix data. Run the seed script first.</div>
//   )

//   return (
//     <div className="relative">
//       <div className="mb-6">
//         <h2 className="text-lg font-bold text-[#e8eaf6]">Version Compatibility Matrix</h2>
//         <p className="text-xs text-muted mt-1">Hover cells for upgrade path details</p>
//       </div>

//       {/* Legend */}
//       <div className="flex gap-4 mb-6 flex-wrap">
//         {Object.entries(STATUS).map(([key, cfg]) => (
//           <div key={key} className="flex items-center gap-2">
//             <div className={`w-5 h-5 rounded ${cfg.bg} border ${cfg.border}`} />
//             <span className="text-xs text-[#e8eaf6]">{cfg.icon} {cfg.label}</span>
//           </div>
//         ))}
//         <div className="flex items-center gap-2">
//           <div className="w-5 h-5 rounded bg-surface2 border border-metro" />
//           <span className="text-xs text-muted">— Same version</span>
//         </div>
//       </div>

//       {/* Grid */}
//       <div className="overflow-x-auto">
//         <table className="border-separate" style={{ borderSpacing: '3px' }}>
//           <thead>
//             <tr>
//               <th className="px-3 py-2 text-[11px] text-muted font-semibold text-left whitespace-nowrap">
//                 FROM ↓ TO →
//               </th>
//               {versions.map(v => (
//                 <th key={v} className="px-4 py-2 text-sm font-semibold text-accent whitespace-nowrap">
//                   {v}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {versions.map(from => (
//               <tr key={from}>
//                 <td className="px-4 py-2 text-sm font-semibold text-accent whitespace-nowrap">{from}</td>
//                 {versions.map(to => {
//                   if (from === to) return (
//                     <td key={to} className="px-5 py-2.5 text-center text-muted bg-surface2 rounded-lg text-sm">—</td>
//                   )
//                   const entry = getCell(from, to)
//                   const cfg   = entry ? STATUS[entry.status] : null
//                   return (
//                     <td
//                       key={to}
//                       onMouseEnter={(e) => {
//                         const rect = e.currentTarget.getBoundingClientRect()
//                         setTooltip({ x: rect.left, y: rect.bottom + 8, entry, from, to })
//                       }}
//                       onMouseLeave={() => setTooltip(null)}
//                       className={`px-5 py-2.5 text-center text-base rounded-lg border cursor-help
//                         transition-transform duration-150 hover:scale-110
//                         ${cfg ? `${cfg.bg} ${cfg.border}` : 'bg-surface border-metro'}`}
//                     >
//                       {cfg ? cfg.icon : '❓'}
//                     </td>
//                   )
//                 })}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Tooltip */}
//       {tooltip && (
//         <div
//           className="fixed z-50 bg-surface border border-metro rounded-xl px-4 py-3 shadow-2xl max-w-[220px] pointer-events-none"
//           style={{ left: tooltip.x, top: tooltip.y }}
//         >
//           <div className="font-bold text-sm text-[#e8eaf6] mb-1.5">
//             {tooltip.from} → {tooltip.to}
//           </div>
//           {tooltip.entry ? (
//             <>
//               <div
//                 className="text-xs font-semibold mb-1.5"
//                 style={{ color: STATUS[tooltip.entry.status]?.color }}
//               >
//                 {STATUS[tooltip.entry.status]?.icon} {STATUS[tooltip.entry.status]?.label}
//               </div>
//               <div className="text-xs text-muted">{tooltip.entry.reason}</div>
//             </>
//           ) : (
//             <div className="text-xs text-muted">No data available</div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }


import { useState, useEffect } from 'react'
import axios from 'axios'
import { Loader } from '../../common/Loader'

const STATUS = {
  direct:       { color: '#22c55e', bg: 'bg-green-500/15',  border: 'border-green-500/40',  label: 'Direct',       icon: '✅' },
  intermediate: { color: '#f59e0b', bg: 'bg-amber-500/15',  border: 'border-amber-500/40',  label: 'Intermediate', icon: '⚠️' },
  blocked:      { color: '#ef4444', bg: 'bg-red-500/15',    border: 'border-red-500/40',    label: 'Blocked',      icon: '🚫' },
}

export default function CompatMatrix() {
  const [matrix,  setMatrix]  = useState([])
  const [loading, setLoading] = useState(true)
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    axios.get('/api/matrix')
      .then(r => { setMatrix(r.data.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <Loader text="Loading compatibility matrix..." />

  const versions = [...new Set([
    ...matrix.map(m => m.fromVersion),
    ...matrix.map(m => m.toVersion),
  ])].sort()

  const getCell = (from, to) => matrix.find(m => m.fromVersion === from && m.toVersion === to)

  if (!versions.length) return (
    <div className="text-center py-16 text-muted text-sm">
      No matrix data. Run the seed script first.
    </div>
  )

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[#e8eaf6]">Version Compatibility Matrix</h2>
        <p className="text-xs text-muted mt-1">Tap cells for upgrade path details</p>
      </div>

      {/* Legend — wraps on mobile */}
      <div className="flex flex-wrap gap-3 mb-5">
        {Object.entries(STATUS).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${cfg.bg} border ${cfg.border} flex-shrink-0`} />
            <span className="text-xs text-[#e8eaf6]">{cfg.icon} {cfg.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-surface2 border border-metro flex-shrink-0" />
          <span className="text-xs text-muted">— Same</span>
        </div>
      </div>

      {/* Matrix — horizontally scrollable on mobile */}
      <div className="overflow-x-auto rounded-xl border border-metro">
        <table className="border-separate min-w-max" style={{ borderSpacing: '3px', padding: '4px' }}>
          <thead>
            <tr>
              <th className="px-2 md:px-3 py-2 text-[10px] md:text-[11px] text-muted font-semibold text-left whitespace-nowrap">
                FROM ↓ TO →
              </th>
              {versions.map(v => (
                <th key={v} className="px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-accent whitespace-nowrap">
                  {v}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {versions.map(from => (
              <tr key={from}>
                <td className="px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-accent whitespace-nowrap">
                  {from}
                </td>
                {versions.map(to => {
                  if (from === to) return (
                    <td key={to}
                      className="px-3 md:px-5 py-2 md:py-2.5 text-center text-muted bg-surface2 rounded-lg text-sm">
                      —
                    </td>
                  )
                  const entry = getCell(from, to)
                  const cfg   = entry ? STATUS[entry.status] : null
                  return (
                    <td key={to}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        setTooltip({ x: rect.left, y: rect.bottom + 8, entry, from, to })
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      onClick={() => setTooltip(t =>
                        t?.from === from && t?.to === to ? null : { x: 0, y: 0, entry, from, to, inline: true }
                      )}
                      className={`px-3 md:px-5 py-2 md:py-2.5 text-center text-base rounded-lg border
                                  cursor-pointer transition-transform duration-150 hover:scale-110
                        ${cfg ? `${cfg.bg} ${cfg.border}` : 'bg-surface border-metro'}`}
                    >
                      {cfg ? cfg.icon : '❓'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inline tooltip for mobile */}
      {tooltip?.inline && (
        <div className="mt-3 bg-surface border border-metro rounded-xl px-4 py-3">
          <div className="font-bold text-sm text-[#e8eaf6] mb-1">
            {tooltip.from} → {tooltip.to}
          </div>
          {tooltip.entry ? (
            <>
              <div className="text-xs font-semibold mb-1"
                style={{ color: STATUS[tooltip.entry.status]?.color }}>
                {STATUS[tooltip.entry.status]?.icon} {STATUS[tooltip.entry.status]?.label}
              </div>
              <div className="text-xs text-muted">{tooltip.entry.reason}</div>
            </>
          ) : (
            <div className="text-xs text-muted">No data available</div>
          )}
        </div>
      )}

      {/* Desktop hover tooltip */}
      {tooltip && !tooltip.inline && (
        <div className="fixed z-50 bg-surface border border-metro rounded-xl px-4 py-3
                        shadow-2xl max-w-[220px] pointer-events-none hidden md:block"
          style={{ left: tooltip.x, top: tooltip.y }}>
          <div className="font-bold text-sm text-[#e8eaf6] mb-1.5">
            {tooltip.from} → {tooltip.to}
          </div>
          {tooltip.entry ? (
            <>
              <div className="text-xs font-semibold mb-1.5"
                style={{ color: STATUS[tooltip.entry.status]?.color }}>
                {STATUS[tooltip.entry.status]?.icon} {STATUS[tooltip.entry.status]?.label}
              </div>
              <div className="text-xs text-muted">{tooltip.entry.reason}</div>
            </>
          ) : (
            <div className="text-xs text-muted">No data available</div>
          )}
        </div>
      )}
    </div>
  )
}
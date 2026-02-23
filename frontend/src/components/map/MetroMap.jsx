import { useState } from 'react'
import { useMetroMap } from '../../hooks/useMetroMap'
import StationDetailPanel from './StationDetailPanel'
import { useBooking } from '../../context/BookingContext'

export default function MetroMap({ lines, stations }) {
  // const { scale, translate, onWheel, onMouseDown, onMouseMove, onMouseUp, zoomIn, zoomOut, reset } = useMetroMap()
  const { containerRef, scale, translate, onMouseDown, onMouseMove, onMouseUp, zoomIn, zoomOut, reset } = useMetroMap()
  const { selectedRoute } = useBooking()
  const [selectedStation, setSelectedStation] = useState(null)
  const [hoveredStation,  setHoveredStation]  = useState(null)

  /* ── Journey highlight sets ── */
  const highlightedNames = new Set()
  const highlightedLines = new Set()
  if (selectedRoute) {
    selectedRoute.segments.forEach(seg => {
      seg.stations.forEach(s => highlightedNames.add(s))
      highlightedLines.add(seg.line)
    })
  }

  const isLineDimmed = (lineName) => selectedRoute && !highlightedLines.has(lineName)
  const isHighlighted = (name)    => !selectedRoute || highlightedNames.has(name)

  /* ── SVG path helpers ── */
  const getLinePath = (line) => {
    const sorted = [...line.stations].sort((a, b) => a.order - b.order)
    const pts = sorted
      .map(s => s.stationId)
      .filter(Boolean)
      .map(st => `${st.coordinates?.x ?? 0},${st.coordinates?.y ?? 0}`)
    return pts.length > 1 ? `M ${pts.join(' L ')}` : ''
  }

  const getHighlightPath = () => {
    if (!selectedRoute) return null
    const names = []
    selectedRoute.segments.forEach(seg => seg.stations.forEach(s => names.push(s)))
    const pts = names.map(name => {
      const st = stations.find(s => s.name === name)
      return st ? `${st.coordinates?.x ?? 0},${st.coordinates?.y ?? 0}` : null
    }).filter(Boolean)
    return pts.length > 1 ? `M ${pts.join(' L ')}` : null
  }

  const highlightPath = getHighlightPath()

  return (
    <div className="relative w-full h-full overflow-hidden bg-app">

      {/* Zoom controls */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {[{ l: '+', fn: zoomIn }, { l: '−', fn: zoomOut }, { l: '⌂', fn: reset }].map(b => (
          <button
            key={b.l}
            onClick={b.fn}
            className="w-8 h-8 rounded-lg bg-surface border border-metro text-[#e8eaf6] text-base font-bold
                       flex items-center justify-center hover:border-accent transition-colors duration-200"
          >
            {b.l}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 bg-surface border border-metro rounded-xl px-3.5 py-2.5">
        <div className="text-[10px] font-semibold text-muted uppercase tracking-widest mb-2">Lines</div>
        {lines.map(line => (
          <div key={line._id} className="flex items-center gap-2 mb-1.5 last:mb-0">
            <div
              className="w-6 h-0.5 rounded-sm transition-opacity duration-500"
              style={{ background: line.color, opacity: isLineDimmed(line.name) ? 0.25 : 1 }}
            />
            <span className={`text-xs transition-colors duration-500 ${isLineDimmed(line.name) ? 'text-muted' : 'text-[#e8eaf6]'}`}>
              {line.name}
            </span>
          </div>
        ))}
      </div>

      {/* SVG pan/zoom container */}
      <div
        ref={containerRef} 
        // onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="w-full h-full cursor-grab select-none"
      >
        <svg
          width="100%" height="100%"
          viewBox="0 0 650 1150"
          style={{
            transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
            transformOrigin: 'center',
            transition: 'transform 0.05s',
          }}
        >
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="650" height="1150" fill="url(#grid)" />

          {/* Metro line paths */}
          {lines.map(line => {
            const d = getLinePath(line)
            if (!d) return null
            return (
              <path
                key={line._id}
                d={d}
                fill="none"
                stroke={line.color}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={isLineDimmed(line.name) ? 0.12 : 0.85}
                style={{ transition: 'opacity 0.5s' }}
              />
            )
          })}

          {/* Animated journey highlight */}
          {highlightPath && (
            <path
              d={highlightPath}
              fill="none"
              stroke="white"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-draw-path"
              opacity={0.9}
            />
          )}

          {/* Stations */}
          {stations.map(station => {
            const x  = station.coordinates?.x ?? 0
            const y  = station.coordinates?.y ?? 0
            const ic = station.isInterchange
            const hv = hoveredStation?._id === station._id
            const sl = selectedStation?._id === station._id
            const hl = isHighlighted(station.name)
            const isPulse = selectedRoute && highlightedNames.has(station.name) && ic

            return (
              <g
                key={station._id}
                className="cursor-pointer"
                onClick={() => setSelectedStation(station)}
                onMouseEnter={() => setHoveredStation(station)}
                onMouseLeave={() => setHoveredStation(null)}
              >
                {/* Pulse ring for interchange on route */}
                {isPulse && (
                  <circle
                    cx={x} cy={y} r={12}
                    fill="none" stroke="white" strokeWidth={2}
                    opacity={0.6}
                    className="animate-pulse-ring"
                  />
                )}

                {/* Interchange line rings */}
                {ic && station.lineIds?.map((line, li) => (
                  <circle
                    key={li}
                    cx={x} cy={y}
                    r={7 + li * 3}
                    fill="none"
                    stroke={line.color || '#999'}
                    strokeWidth={2}
                    opacity={hl ? 0.9 : 0.12}
                    style={{ transition: 'opacity 0.5s' }}
                  />
                ))}

                {/* Main dot */}
                <circle
                  cx={x} cy={y}
                  r={ic ? 5 : hv || sl ? 5 : 3.5}
                  fill={hl ? 'white' : 'rgba(255,255,255,0.12)'}
                  stroke={sl ? '#6c63ff' : hv ? '#fff' : 'rgba(255,255,255,0.25)'}
                  strokeWidth={sl ? 2 : 1}
                  style={{ transition: 'all 0.2s, opacity 0.5s', opacity: hl ? 1 : 0.18 }}
                />

                {/* Hover label */}
                {(hv || sl) && (
                  <foreignObject x={x + 9} y={y - 15} width={150} height={36}>
                    <div className="bg-[rgba(26,29,39,0.96)] border border-[#2e3350] rounded-md px-2 py-1 text-[11px] font-semibold text-white whitespace-nowrap inline-block">
                      {station.name}
                      {ic && <span className="text-accent ml-1">⇄</span>}
                    </div>
                  </foreignObject>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Station detail side panel */}
      {selectedStation && (
        <StationDetailPanel station={selectedStation} onClose={() => setSelectedStation(null)} />
      )}
    </div>
  )
}
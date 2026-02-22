export default function RouteTimeline({ segments }) {
  return (
    <div className="py-1">
      {segments.map((seg, si) => (
        <div key={si}>
          {/* Segment header */}
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full border-2 border-white/20 flex-shrink-0"
              style={{ background: seg.lineColor }}
            />
            <span
              className="text-[11px] font-bold tracking-wide uppercase"
              style={{ color: seg.lineColor }}
            >
              {seg.line}
            </span>
            <span className="text-[11px] text-muted ml-auto">
              {seg.duration} min · {seg.stations.length - 1} stops
            </span>
          </div>

          {/* Stations */}
          <div className="flex flex-col ml-1.5">
            {seg.stations.map((stName, idx) => {
              const isFirst = idx === 0
              const isLast  = idx === seg.stations.length - 1
              const isXchgEnd = isLast && si < segments.length - 1

              return (
                <div key={idx} className="flex items-center gap-2.5 relative">
                  {/* Track column */}
                  <div className="flex flex-col items-center flex-shrink-0 w-4">
                    <div
                      className={`rounded-full z-10 flex-shrink-0 transition-all
                        ${isFirst || isLast ? 'w-2.5 h-2.5' : 'w-1.5 h-1.5'}
                        ${isXchgEnd ? 'border-[2.5px] bg-white' : ''}`}
                      style={{
                        background: isXchgEnd ? 'white' : seg.lineColor,
                        border: isXchgEnd ? `2.5px solid ${seg.lineColor}` : undefined,
                      }}
                    />
                    {!isLast && (
                      <div
                        className="w-0.5 h-5 opacity-50"
                        style={{ background: seg.lineColor }}
                      />
                    )}
                  </div>

                  {/* Station name */}
                  <div className={`pb-2 ${isLast ? 'pb-0' : ''}`}>
                    <span className={`text-sm ${isFirst || isLast ? 'font-semibold text-[#e8eaf6]' : 'text-muted font-normal text-[12px]'}`}>
                      {stName}
                    </span>
                    {isXchgEnd && (
                      <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-semibold">
                        ⇄ Transfer here
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Transfer gap */}
          {si < segments.length - 1 && (
            <div className="my-2 ml-1.5 px-3 py-1.5 bg-amber-500/10 border border-dashed border-amber-500/40 rounded-md text-xs text-amber-400 flex items-center gap-1.5">
              🔄 Change to <strong>{segments[si + 1]?.line}</strong> (+5 min)
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
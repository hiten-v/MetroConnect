import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import api from '../../../utils/api';
const API_URL = import.meta.env.VITE_API_URL;
export default function LineEditor({ line, onUpdate }) {
  const [stations, setStations] = useState(
    [...(line.stations || [])].sort((a, b) => a.order - b.order)
  )
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  const handleDragEnd = (result) => {
    if (!result.destination) return
    const reordered = Array.from(stations)
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    setStations(reordered.map((s, i) => ({ ...s, order: i })))
    setSaved(false)
  }

  const handleRemove = (idx) => {
    setStations(prev => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i })))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put(`${API_URL}/api/lines/${line._id}/stations`, {
        stations: stations.map(s => ({
          stationId: s.stationId?._id || s.stationId,
          order: s.order,
        })),
      })
      setSaved(true)
      if (onUpdate) onUpdate()
    } catch (err) {
      alert('Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mb-6">
      {/* Line header */}
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ background: line.color }} />
        <h3 className="text-sm font-bold text-[#e8eaf6]">{line.name}</h3>
        <code className="text-xs text-muted font-mono bg-surface2 px-2 py-0.5 rounded">
          {line.code}
        </code>
        <span className="text-xs text-muted ml-auto">{stations.length} stations</span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-accent text-white hover:bg-accent-h disabled:opacity-50 transition-all"
        >
          {saving ? '⏳' : saved ? '✅ Saved' : '💾 Save'}
        </button>
      </div>

      {/* DnD list */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={`line-${line._id}`}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col gap-1"
            >
              {stations.map((s, idx) => {
                const stObj = s.stationId
                const name  = stObj?.name || 'Unknown'
                const isXchg = stObj?.isInterchange

                return (
                  <Draggable
                    key={s.stationId?._id || idx}
                    draggableId={String(s.stationId?._id || idx)}
                    index={idx}
                  >
                    {(prov, snap) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        style={prov.draggableProps.style}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm transition-colors
                          ${snap.isDragging
                            ? 'bg-surface2 border-accent'
                            : 'bg-white/[0.02] border-metro hover:border-metro/70'}`}
                      >
                        <span
                          {...prov.dragHandleProps}
                          className="text-muted cursor-grab text-sm select-none"
                        >
                          ⋮⋮
                        </span>

                        {/* Order badge */}
                        <span
                          className="w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold flex-shrink-0"
                          style={{ background: line.color + '30', color: line.color }}
                        >
                          {idx + 1}
                        </span>

                        <span className="flex-1 text-[#e8eaf6] text-xs">{name}</span>

                        {isXchg && (
                          <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-full">⇄</span>
                        )}

                        <button
                          onClick={() => handleRemove(idx)}
                          className="text-muted hover:text-red-400 transition-colors text-xs px-1"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
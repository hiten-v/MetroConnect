import LineEditor from './LineEditor'

export default function LineList({ lines, onUpdate }) {
  if (!lines?.length) return (
    <div className="text-center py-16 text-muted text-sm">
      No metro lines found. Run the seed script first.
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#e8eaf6]">Line & Station Management</h2>
          <p className="text-xs text-muted mt-1">Drag stations to reorder · Click ✕ to remove</p>
        </div>
        <span className="text-xs text-muted">{lines.length} lines</span>
      </div>

      {lines.map(line => (
        <div
          key={line._id}
          className="bg-surface border border-metro rounded-xl p-5 mb-4"
        >
          <LineEditor line={line} onUpdate={onUpdate} />
        </div>
      ))}
    </div>
  )
}
import RouteCard from './RouteCard'
import { Loader } from '../../common/Loader'

export default function RouteResults({ routes, loading, error, searched, onSelectRoute, source, destination }) {
  if (loading) return <Loader text="Finding best routes..." />

  if (error) return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">🚧</div>
      <h3 className="text-red-400 font-semibold mb-2">No Route Found</h3>
      <p className="text-muted text-sm">{error}</p>
    </div>
  )

  if (!searched) return (
    <div className="text-center py-12 text-muted">
      <div className="text-5xl mb-4">🗺️</div>
      <p className="text-sm">Select source &amp; destination to see routes</p>
    </div>
  )

  if (routes.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#e8eaf6]">
          {source?.name} → {destination?.name}
        </h3>
        <span className="text-xs text-muted">{routes.length} route{routes.length > 1 ? 's' : ''} found</span>
      </div>

      <div className="flex flex-col gap-3">
        {routes.map((route, i) => (
          <RouteCard
            key={i}
            route={route}
            index={i}
            isRecommended={i === 0}
            onSelect={onSelectRoute}
          />
        ))}
      </div>
    </div>
  )
}
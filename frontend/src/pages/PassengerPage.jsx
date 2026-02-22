import { useState } from 'react'
import StationSearch from '../components/passenger/StationSearch/StationSearch'
import RouteResults from '../components/passenger/RouteResults/RouteResults'
import BookingConfirmation from '../components/passenger/BookingConfirmation/BookingConfirmation'
import MetroMap from '../components/map/MetroMap'
import { useMetro } from '../context/MetroContext'
import { useBooking } from '../context/BookingContext'
import { useRouteSearch } from '../hooks/useRouteSearch'
import { Loader, ErrorMsg } from '../components/common/Loader'

export default function PassengerPage() {
  const { lines, stations, loading: networkLoading, error: networkError } = useMetro()
  const { source, destination, selectedRoute, setSelectedRoute, reset } = useBooking()
  const { routes, loading, error, searched, search, reset: resetRoutes } = useRouteSearch(lines, stations)
  const [stage, setStage] = useState('search') // 'search' | 'confirm'

  const handleSearch = (sourceId, destId) => {
    setStage('search')
    setSelectedRoute(null)
    search(sourceId, destId)
  }

  const handleSelectRoute = (route) => {
    setSelectedRoute(route)
    setStage('confirm')
  }

  const handleNewBooking = (backOnly) => {
    if (backOnly) { setStage('search'); return }
    reset()
    resetRoutes()
    setStage('search')
  }

  if (networkLoading) return (
    <div className="flex items-center justify-center h-[calc(100vh-60px)]">
      <Loader text="Loading metro network..." />
    </div>
  )

  if (networkError) return (
    <div className="p-8"><ErrorMsg message={networkError} /></div>
  )

  return (
    <div className="grid h-[calc(100vh-60px)]" style={{ gridTemplateColumns: '420px 1fr' }}>

      {/* Left — booking panel */}
      <div className="flex flex-col gap-4 p-5 overflow-y-auto bg-surface border-r border-metro">
        <StationSearch stations={stations} onSearch={handleSearch} />

        {stage === 'confirm' && selectedRoute ? (
          <BookingConfirmation route={selectedRoute} onNewBooking={handleNewBooking} />
        ) : (
          <RouteResults
            routes={routes}
            loading={loading}
            error={error}
            searched={searched}
            onSelectRoute={handleSelectRoute}
            source={source}
            destination={destination}
          />
        )}
      </div>

      {/* Right — metro map */}
      <div className="relative overflow-hidden">
        <MetroMap lines={lines} stations={stations} />
      </div>
    </div>
  )
}
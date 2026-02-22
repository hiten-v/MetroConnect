// import { useState } from 'react'
// import { motion } from 'framer-motion'
// import AutocompleteInput from './AutocompleteInput'
// import RecentSearches from './RecentSearches'
// import { useBooking } from '../../../context/BookingContext'
// import { useLocalStorage } from '../../../hooks/useLocalStorage'

// export default function StationSearch({ stations, onSearch }) {
//   const { source, setSource, destination, setDestination, swapStations } = useBooking()
//   const [swapped, setSwapped] = useState(false)
//   const [recentSearches, setRecentSearches] = useLocalStorage('metro-recent', [])

//   const handleSwap = () => {
//     setSwapped(s => !s)
//     swapStations()
//   }

//   const handleSearch = () => {
//     if (!source || !destination) return
//     const entry = { source, destination }
//     setRecentSearches(prev => {
//       const filtered = prev.filter(
//         s => !(s.source?._id === source._id && s.destination?._id === destination._id)
//       )
//       return [entry, ...filtered].slice(0, 5)
//     })
//     onSearch(source._id, destination._id)
//   }

//   const handleRecentSelect = (s) => {
//     setSource(s.source)
//     setDestination(s.destination)
//     onSearch(s.source._id, s.destination._id)
//   }

//   const canSearch = source && destination && source._id !== destination._id

//   return (
//     <div className="bg-surface border border-metro rounded-xl p-5">
//       <h2 className="text-lg font-bold mb-5 text-[#e8eaf6]">🚇 Plan Your Journey</h2>

//       {/* Search row */}
//       <div className="flex items-end gap-3 flex-wrap">
//         <AutocompleteInput
//           label="From"
//           value={source}
//           stations={stations}
//           onSelect={setSource}
//           placeholder="Search source station..."
//           icon="🟢"
//         />

//         {/* Swap button */}
//         <motion.button
//           onClick={handleSwap}
//           whileTap={{ scale: 0.85 }}
//           animate={{ rotate: swapped ? 180 : 0 }}
//           transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//           className="w-10 h-10 rounded-full bg-surface2 border border-metro text-accent text-lg
//                      flex items-center justify-center flex-shrink-0 mb-0.5
//                      hover:border-accent transition-colors duration-200"
//         >
//           ⇅
//         </motion.button>

//         <AutocompleteInput
//           label="To"
//           value={destination}
//           stations={stations}
//           onSelect={setDestination}
//           placeholder="Search destination station..."
//           icon="🔴"
//         />

//         {/* Search button */}
//         <motion.button
//           onClick={handleSearch}
//           disabled={!canSearch}
//           whileHover={canSearch ? { scale: 1.02 } : {}}
//           whileTap={canSearch ? { scale: 0.97 } : {}}
//           className={`px-7 py-2.5 rounded-xl font-bold text-sm flex-shrink-0 mb-0.5 transition-all duration-200
//             ${canSearch
//               ? 'bg-accent text-white hover:bg-accent-h cursor-pointer'
//               : 'bg-surface2 text-muted cursor-not-allowed'}`}
//         >
//           🔍 Search
//         </motion.button>
//       </div>

//       {/* Same station warning */}
//       {source?._id === destination?._id && source && (
//         <p className="mt-2.5 text-xs text-red-400">Source and destination must be different.</p>
//       )}

//       <RecentSearches searches={recentSearches} onSelect={handleRecentSelect} />
//     </div>
//   )
// }



import { useState } from 'react'
import { motion } from 'framer-motion'
import AutocompleteInput from './AutocompleteInput'
import RecentSearches from './RecentSearches'
import { useBooking } from '../../../context/BookingContext'
import { useLocalStorage } from '../../../hooks/useLocalStorage'

export default function StationSearch({ stations, onSearch }) {
  const { source, setSource, destination, setDestination, swapStations } = useBooking()
  const [swapped, setSwapped] = useState(false)
  const [recentSearches, setRecentSearches] = useLocalStorage('metro-recent', [])

  const handleSwap = () => {
    setSwapped(s => !s)
    swapStations()
  }

  const handleSearch = () => {
    if (!source || !destination) return
    const entry = { source, destination }
    setRecentSearches(prev => {
      const filtered = prev.filter(
        s => !(s.source?._id === source._id && s.destination?._id === destination._id)
      )
      return [entry, ...filtered].slice(0, 5)
    })
    onSearch(source._id, destination._id)
  }

  const handleRecentSelect = (s) => {
    setSource(s.source)
    setDestination(s.destination)
    onSearch(s.source._id, s.destination._id)
  }

  const canSearch = source && destination && source._id !== destination._id

  return (
    <div className="bg-surface border border-metro rounded-xl p-5">
      <h2 className="text-lg font-bold mb-5 text-[#e8eaf6]">🚇 Plan Your Journey</h2>

      {/* FROM input — full width */}
      <div className="mb-2">
        <AutocompleteInput
          label="From"
          value={source}
          stations={stations}
          onSelect={setSource}
          placeholder="Search source station..."
          icon="🟢"
        />
      </div>

      {/* Swap button — centered between inputs */}
      <div className="flex justify-center my-1">
        <motion.button
          onClick={handleSwap}
          whileTap={{ scale: 0.85 }}
          animate={{ rotate: swapped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="w-9 h-9 rounded-full bg-surface2 border border-metro text-accent text-lg
                     flex items-center justify-center hover:border-accent hover:bg-accent/10
                     transition-all duration-200 z-10"
        >
          ⇅
        </motion.button>
      </div>

      {/* TO input — full width */}
      <div className="mb-4">
        <AutocompleteInput
          label="To"
          value={destination}
          stations={stations}
          onSelect={setDestination}
          placeholder="Search destination station..."
          icon="🔴"
        />
      </div>

      {/* Same station warning */}
      {source?._id === destination?._id && source && (
        <p className="text-xs text-red-400 mb-3">
          Source and destination must be different.
        </p>
      )}

      {/* Search button — full width */}
      <motion.button
        onClick={handleSearch}
        disabled={!canSearch}
        whileHover={canSearch ? { scale: 1.01 } : {}}
        whileTap={canSearch ? { scale: 0.98 } : {}}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200
          ${canSearch
            ? 'bg-accent text-white hover:bg-accent-h cursor-pointer shadow-lg shadow-accent/20'
            : 'bg-surface2 text-muted cursor-not-allowed'}`}
      >
        🔍 Search Routes
      </motion.button>

      <RecentSearches searches={recentSearches} onSelect={handleRecentSelect} />
    </div>
  )
}
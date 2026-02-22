import { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [source, setSource] = useState(null);       // { _id, name, code, lineIds }
  const [destination, setDestination] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [booking, setBooking] = useState(null);     // confirmed booking from API
  const [highlightedStationIds, setHighlightedStationIds] = useState([]); // for map

  const reset = () => {
    setSource(null);
    setDestination(null);
    setSelectedRoute(null);
    setBooking(null);
    setHighlightedStationIds([]);
  };

  const swapStations = () => {
    setSource(destination);
    setDestination(source);
  };

  return (
    <BookingContext.Provider value={{
      source, setSource,
      destination, setDestination,
      selectedRoute, setSelectedRoute,
      booking, setBooking,
      highlightedStationIds, setHighlightedStationIds,
      reset, swapStations,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
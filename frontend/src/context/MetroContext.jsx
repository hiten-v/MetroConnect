import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const MetroContext = createContext(null);

export function MetroProvider({ children }) {
  const [lines, setLines] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNetwork = async () => {
    try {
      setLoading(true);
      const [linesRes, stationsRes] = await Promise.all([
        axios.get('/api/lines'),
        axios.get('/api/stations'),
      ]);
      setLines(linesRes.data.data);
      setStations(stationsRes.data.data);
    } catch (err) {
      setError('Failed to load metro network. Is the server running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNetwork(); }, []);

  return (
    <MetroContext.Provider value={{ lines, stations, loading, error, refetch: fetchNetwork, setLines }}>
      {children}
    </MetroContext.Provider>
  );
}

export function useMetro() {
  const ctx = useContext(MetroContext);
  if (!ctx) throw new Error('useMetro must be used within MetroProvider');
  return ctx;
}
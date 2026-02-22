import { useState, useMemo } from 'react';

export function useAutocomplete(stations = []) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim() || query.length < 1) return [];
    const q = query.toLowerCase();
    return stations
      .filter(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, stations]);

  return { query, setQuery, filtered };
}
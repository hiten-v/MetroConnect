import { useState, useCallback } from 'react';
import { buildGraph, findRoutes } from '../utils/routeAlgorithm';
import { calculateFare } from '../utils/fareCalculator';

export function useRouteSearch(lines, stations) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const search = useCallback((sourceId, destId) => {
    if (!sourceId || !destId || !lines?.length || !stations?.length) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const graph = buildGraph(lines);
      const found = findRoutes(graph, sourceId, destId, lines, stations);

      if (found.length === 0) {
        setError('No route found between selected stations.');
        setRoutes([]);
      } else {
        // Attach fare to each route
        const withFare = found.map(r => ({ ...r, fare: calculateFare(r.totalStops, r.transfers) }));
        setRoutes(withFare);
      }
    } catch (err) {
      setError('Route computation failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [lines, stations]);

  const reset = useCallback(() => {
    setRoutes([]);
    setError(null);
    setSearched(false);
  }, []);

  return { routes, loading, error, searched, search, reset };
}
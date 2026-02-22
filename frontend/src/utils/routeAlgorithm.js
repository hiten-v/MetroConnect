/**
 * routeAlgorithm.js
 * BFS-based multi-line metro route finder with transfer penalty.
 * Works on the client using the full network fetched from API.
 */

/**
 * Build adjacency graph from lines data.
 * Node: stationId
 * Edge: { to, line, lineColor, travelTime }
 */
export function buildGraph(lines) {
  const graph = {}; // stationId → [{ to, line, lineColor, travelTime }]

  for (const line of lines) {
    const sorted = [...line.stations].sort((a, b) => a.order - b.order);
    for (let i = 0; i < sorted.length; i++) {
      const curr = sorted[i]?.stationId?._id || sorted[i]?.stationId;
      if (!curr) continue;
      if (!graph[curr]) graph[curr] = [];

      if (i > 0) {
        const prev = sorted[i - 1]?.stationId?._id || sorted[i - 1]?.stationId;
        if (prev) {
          graph[curr].push({ to: prev, line: line.name, lineColor: line.color, travelTime: 2 });
          if (!graph[prev]) graph[prev] = [];
          graph[prev].push({ to: curr, line: line.name, lineColor: line.color, travelTime: 2 });
        }
      }
    }
  }

  // Deduplicate edges
  for (const node in graph) {
    const seen = new Set();
    graph[node] = graph[node].filter(e => {
      const key = `${e.to}-${e.line}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  return graph;
}

/**
 * Find all routes using BFS, return top 3 by score.
 * Score = stops + transfers * 3  (penalises transfers heavily)
 */
export function findRoutes(graph, sourceId, destId, lines, stations) {
  if (!graph[sourceId] || !graph[destId] || sourceId === destId) return [];

  const stationMap = {};
  stations.forEach(s => { stationMap[s._id] = s; });

  // BFS
  const queue = [{ node: sourceId, path: [sourceId], lines: [], transfers: 0, currentLine: null }];
  const visited = new Map(); // node+line → min transfers
  const results = [];
  const MAX_RESULTS = 3;
  const MAX_STOPS = 40;

  while (queue.length > 0 && results.length < 10) {
    queue.sort((a, b) => (a.path.length + a.transfers * 3) - (b.path.length + b.transfers * 3));
    const { node, path, lines: usedLines, transfers, currentLine } = queue.shift();

    if (path.length > MAX_STOPS) continue;

    const visitKey = `${node}|${currentLine}`;
    if (visited.has(visitKey) && visited.get(visitKey) <= transfers) continue;
    visited.set(visitKey, transfers);

    if (node === destId) {
      results.push(buildRouteResult(path, stationMap, lines, usedLines));
      if (results.length >= MAX_RESULTS) break;
      continue;
    }

    for (const edge of (graph[node] || [])) {
      if (path.includes(edge.to)) continue;
      const isTransfer = currentLine && currentLine !== edge.line;
      queue.push({
        node: edge.to,
        path: [...path, edge.to],
        lines: [...usedLines, edge.line],
        transfers: transfers + (isTransfer ? 1 : 0),
        currentLine: edge.line,
      });
    }
  }

  return results.sort((a, b) => a.score - b.score);
}

function buildRouteResult(path, stationMap, lines, lineSequence) {
  // Group consecutive stations by line into segments
  const segments = [];
  let segStations = [path[0]];
  let segLine = lineSequence[0] || '';

  for (let i = 1; i < path.length; i++) {
    const line = lineSequence[i - 1] || segLine;
    if (line !== segLine && segments.length > 0) {
      // push segment
      const lineObj = lines.find(l => l.name === segLine);
      segments.push({
        line: segLine,
        lineColor: lineObj?.color || '#999',
        stations: segStations.map(id => stationMap[id]?.name || id),
        duration: (segStations.length - 1) * 2,
      });
      segStations = [segStations[segStations.length - 1]];
      segLine = line;
    } else {
      segLine = line;
    }
    segStations.push(path[i]);
  }

  // push last segment
  const lastLineObj = lines.find(l => l.name === segLine);
  segments.push({
    line: segLine,
    lineColor: lastLineObj?.color || '#999',
    stations: segStations.map(id => stationMap[id]?.name || id),
    duration: (segStations.length - 1) * 2,
  });

  const totalStops = path.length - 1;
  const transfers = segments.length - 1;
  const totalTime = segments.reduce((sum, s) => sum + s.duration, 0) + transfers * 5; // 5min transfer penalty
  const score = totalStops + transfers * 3;

  return { segments, totalStops, transfers, totalTime, score };
}
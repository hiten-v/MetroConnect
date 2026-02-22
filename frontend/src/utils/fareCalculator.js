/**
 * fareCalculator.js
 * Simple distance-based fare: ₹10 base + ₹2/stop, max ₹60
 */
export function calculateFare(totalStops, transfers = 0) {
  const base = 10;
  const perStop = 2;
  const transferSurcharge = transfers * 5;
  const raw = base + totalStops * perStop + transferSurcharge;
  return Math.min(raw, 60);
}

export function formatFare(amount) {
  return `₹${amount}`;
}
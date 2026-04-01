/* Scoring — Haversine-based, parameterized per country */

const MAX_SCORE_PER_ROUND = 5000;
const ROUNDS_PER_GAME = 10;

/**
 * Haversine distance in km between two lat/lng points
 */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Calculate score for a guess
 * @param {Object} guessed - { lat, lng } of guessed subdivision centroid
 * @param {Object} correct - { lat, lng } of correct subdivision centroid
 * @param {number} maxDistanceKm - max possible distance for this country
 * @param {number} exponent - scoring harshness (higher = harder)
 * @returns {number} score 0-5000
 */
export function calculateScore(guessed, correct, maxDistanceKm, exponent) {
  if (guessed.id && correct.id && guessed.id === correct.id) return MAX_SCORE_PER_ROUND;
  const dist = haversineDistance(guessed.lat, guessed.lng, correct.lat, correct.lng);
  const norm = Math.min(dist / maxDistanceKm, 1);
  return Math.max(0, Math.round(MAX_SCORE_PER_ROUND * Math.pow(1 - norm, exponent)));
}

/**
 * Calculate max distance between all subdivision centroids
 */
export function computeMaxDistance(subdivisions) {
  let max = 0;
  for (let i = 0; i < subdivisions.length; i++) {
    for (let j = i + 1; j < subdivisions.length; j++) {
      const d = haversineDistance(
        subdivisions[i].lat, subdivisions[i].lng,
        subdivisions[j].lat, subdivisions[j].lng
      );
      if (d > max) max = d;
    }
  }
  return max;
}

// Seeded random for daily deterministic round selection
export function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xFFFFFFFF;
    return (s >>> 0) / 0xFFFFFFFF;
  };
}

export function getDailySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function selectDailyRounds(allRounds, count) {
  count = count || ROUNDS_PER_GAME;
  const rand = seededRandom(getDailySeed());
  const shuffled = [...allRounds];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export { MAX_SCORE_PER_ROUND, ROUNDS_PER_GAME };

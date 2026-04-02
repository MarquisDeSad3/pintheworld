/* Scoring — Haversine-based, parameterized per country */

import { getDifficultyMix } from './levels.js';

const MAX_SCORE_PER_ROUND = 5000;
const ROUNDS_PER_GAME = 5;

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

/**
 * Pick `n` random items from `arr` using `randFn`, removing them from `arr`.
 */
function pickRandom(arr, n, randFn) {
  const picked = [];
  for (let i = 0; i < n && arr.length > 0; i++) {
    const idx = Math.floor(randFn() * arr.length);
    picked.push(arr.splice(idx, 1)[0]);
  }
  return picked;
}

/**
 * Select rounds by difficulty mix based on player level.
 * Uses `randFn` for shuffle so it works for both random and seeded selection.
 */
function selectByDifficulty(available, count, totalScore, randFn) {
  const mix = getDifficultyMix(totalScore);

  // Split into difficulty buckets (mutable copies)
  const buckets = { easy: [], normal: [], hard: [] };
  available.forEach(r => {
    const d = r.difficulty || 'normal';
    if (buckets[d]) buckets[d].push(r);
    else buckets.normal.push(r);
  });

  // Pick from each bucket according to mix
  const selected = [];
  for (const diff of ['hard', 'normal', 'easy']) {
    selected.push(...pickRandom(buckets[diff], mix[diff], randFn));
  }

  // If not enough from some bucket, fill with whatever remains
  if (selected.length < count) {
    const remaining = [...buckets.easy, ...buckets.normal, ...buckets.hard];
    selected.push(...pickRandom(remaining, count - selected.length, randFn));
  }

  // Final shuffle so difficulties aren't grouped
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(randFn() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  return selected.slice(0, count);
}

/**
 * Select random rounds that the user hasn't played yet.
 * Distributes difficulty based on player level.
 */
export function selectRandomRounds(allRounds, count, mode, totalScore) {
  count = count || ROUNDS_PER_GAME;
  totalScore = totalScore || 0;

  // Get history of played round IDs for this mode
  const storageKey = `ptw_played_${mode || 'places'}`;
  let playedIds;
  try { playedIds = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]')); }
  catch { playedIds = new Set(); }

  // Filter out already-played rounds
  let available = allRounds.filter(r => !playedIds.has(r.id));

  // If not enough unplayed rounds, reset history
  if (available.length < count) {
    playedIds.clear();
    localStorage.setItem(storageKey, '[]');
    available = [...allRounds];
  }

  const selected = selectByDifficulty(available, count, totalScore, Math.random);

  // Record these rounds as played
  for (const r of selected) playedIds.add(r.id);
  localStorage.setItem(storageKey, JSON.stringify([...playedIds]));

  return selected;
}

/**
 * Seeded random for deterministic daily challenge.
 * Same seed = same sequence for all players.
 */
function seededRandom(seed) {
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

/**
 * Select daily challenge rounds — difficulty-aware, seeded per day + player level.
 * Players at the same level get the same rounds; different levels get different mixes.
 */
export function selectDailyRounds(allRounds, count, totalScore) {
  count = count || ROUNDS_PER_GAME;
  totalScore = totalScore || 0;
  const rand = seededRandom(getDailySeed());
  return selectByDifficulty([...allRounds], count, totalScore, rand);
}

export { MAX_SCORE_PER_ROUND, ROUNDS_PER_GAME };

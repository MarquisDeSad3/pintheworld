/* World-themed level system — 39 levels */

export const LEVELS = [
  { name: 'Tourist',        icon: '🧳', xp: 0 },
  { name: 'Backpacker',     icon: '🎒', xp: 100 },
  { name: 'Wanderer',       icon: '🚶', xp: 300 },
  { name: 'Traveler',       icon: '✈️', xp: 600 },
  { name: 'Hiker',          icon: '🥾', xp: 1000 },
  { name: 'Explorer',       icon: '🧭', xp: 1500 },
  { name: 'Adventurer',     icon: '⛺', xp: 2200 },
  { name: 'Voyager',        icon: '🚢', xp: 3000 },
  { name: 'Navigator',      icon: '🗺️', xp: 4000 },
  { name: 'Pathfinder',     icon: '🔭', xp: 5200 },
  { name: 'Scout',          icon: '🏕️', xp: 6500 },
  { name: 'Trailblazer',    icon: '🌄', xp: 8000 },
  { name: 'Cartographer',   icon: '📍', xp: 10000 },
  { name: 'Geographer',     icon: '🌍', xp: 12500 },
  { name: 'Globetrotter',   icon: '🌐', xp: 15500 },
  { name: 'World Traveler',icon: '🗼', xp: 19000 },
  { name: 'Nomad',          icon: '🐪', xp: 23000 },
  { name: 'Pioneer',        icon: '⭐', xp: 28000 },
  { name: 'Discoverer',     icon: '🔍', xp: 34000 },
  { name: 'Specialist',     icon: '🎯', xp: 41000 },
  { name: 'Expert',         icon: '🏅', xp: 49000 },
  { name: 'Master',         icon: '🥇', xp: 58000 },
  { name: 'Sage',           icon: '📚', xp: 68000 },
  { name: 'Professor',      icon: '🎓', xp: 80000 },
  { name: 'Scholar',        icon: '🏛️', xp: 95000 },
  { name: 'Ambassador',     icon: '🤝', xp: 112000 },
  { name: 'Diplomat',       icon: '🏳️', xp: 132000 },
  { name: 'Commander',      icon: '⚔️', xp: 155000 },
  { name: 'Captain',        icon: '🚀', xp: 180000 },
  { name: 'Admiral',        icon: '⚓', xp: 210000 },
  { name: 'Legend',          icon: '🏆', xp: 245000 },
  { name: 'Titan',           icon: '💪', xp: 285000 },
  { name: 'Champion',       icon: '🎖️', xp: 330000 },
  { name: 'Hero',            icon: '🦸', xp: 380000 },
  { name: 'Mythic',          icon: '🔱', xp: 440000 },
  { name: 'Immortal',        icon: '💎', xp: 510000 },
  { name: 'Overlord',        icon: '👑', xp: 600000 },
  { name: 'World Master',   icon: '🌟', xp: 750000 },
  { name: 'God of Geography',icon: '⚡', xp: 1000000 },
];

const XP_DIVISOR = 10;

export function scoreToXP(totalScore) {
  return Math.floor(totalScore / XP_DIVISOR);
}

export function getLevel(totalScore) {
  const xp = scoreToXP(totalScore);
  let level = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) { level = LEVELS[i]; break; }
  }
  return level;
}

export function getLevelProgress(totalScore) {
  const xp = scoreToXP(totalScore);
  let currentIdx = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) { currentIdx = i; break; }
  }
  if (currentIdx >= LEVELS.length - 1) return { current: LEVELS[currentIdx], next: null, progress: 1 };
  const current = LEVELS[currentIdx];
  const next = LEVELS[currentIdx + 1];
  const progress = (xp - current.xp) / (next.xp - current.xp);
  return { current, next, progress: Math.min(progress, 1) };
}

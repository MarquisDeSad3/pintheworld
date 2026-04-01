/* Achievement system — 60+ world-themed achievements */

import { playSound } from './sounds.js';

const MAX_SCORE_PER_ROUND = 5000;

export const ACHIEVEMENTS = [
  // ===== BASICS (5) =====
  { id: 'first_game',    name: 'First Steps',      icon: '🎮', cat: 'Basics', desc: 'Play your first game', check: s => s.totalGames >= 1 },
  { id: 'first_perfect', name: 'Bullseye!',         icon: '🎯', cat: 'Basics', desc: 'Guess a region exactly right', check: (s, rs) => rs && rs.some(r => r === MAX_SCORE_PER_ROUND) },
  { id: 'perfect_game',  name: 'Perfect Game',      icon: '💎', cat: 'Basics', desc: 'Get all 10 rounds perfect', check: (s, rs) => rs && rs.length >= 10 && rs.every(r => r === MAX_SCORE_PER_ROUND) },
  { id: 'first_submit',  name: 'Creator',           icon: '📸', cat: 'Basics', desc: 'Submit your first level', check: s => (s.totalSubmissions || 0) >= 1 },
  { id: 'first_zero',    name: 'Lost in Space',     icon: '💀', cat: 'Basics', desc: 'Score 0 on a round', check: s => s.hasZeroRound },

  // ===== STREAKS (5) =====
  { id: 'streak_3',   name: 'On Fire',       icon: '🔥',   cat: 'Streaks', desc: '3 days in a row',   check: s => s.streak >= 3 },
  { id: 'streak_7',   name: 'Full Week',     icon: '🔥',   cat: 'Streaks', desc: '7 days in a row',   check: s => s.streak >= 7 },
  { id: 'streak_30',  name: 'Monthly Beast', icon: '🌟',   cat: 'Streaks', desc: '30 days in a row',  check: s => s.streak >= 30 },
  { id: 'streak_60',  name: 'Iron Will',     icon: '💪',   cat: 'Streaks', desc: '60 days in a row',  check: s => s.streak >= 60 },
  { id: 'streak_365', name: 'Year Round',    icon: '🎆',   cat: 'Streaks', desc: '365 days in a row', check: s => s.streak >= 365 },

  // ===== GAMES PLAYED (5) =====
  { id: 'games_10',   name: 'Veteran',     icon: '🎖️', cat: 'Games', desc: 'Play 10 games',   check: s => s.totalGames >= 10 },
  { id: 'games_50',   name: 'Dedicated',   icon: '🏅', cat: 'Games', desc: 'Play 50 games',   check: s => s.totalGames >= 50 },
  { id: 'games_100',  name: 'Centurion',   icon: '💯', cat: 'Games', desc: 'Play 100 games',  check: s => s.totalGames >= 100 },
  { id: 'games_500',  name: 'Obsessed',    icon: '🕹️', cat: 'Games', desc: 'Play 500 games',  check: s => s.totalGames >= 500 },
  { id: 'games_1000', name: 'No Life',     icon: '👾', cat: 'Games', desc: 'Play 1,000 games', check: s => s.totalGames >= 1000 },

  // ===== TOTAL SCORE (5) =====
  { id: 'score_100k',  name: 'Hundred K',    icon: '💰', cat: 'Score', desc: '100,000 total points',   check: s => s.totalScore >= 100000 },
  { id: 'score_500k',  name: 'Half Million',  icon: '💎', cat: 'Score', desc: '500,000 total points',   check: s => s.totalScore >= 500000 },
  { id: 'score_1m',    name: 'Millionaire',   icon: '🤑', cat: 'Score', desc: '1,000,000 total points', check: s => s.totalScore >= 1000000 },
  { id: 'score_5m',    name: 'Multi-Million', icon: '💵', cat: 'Score', desc: '5,000,000 total points', check: s => s.totalScore >= 5000000 },
  { id: 'score_10m',   name: 'Tycoon',        icon: '👑', cat: 'Score', desc: '10,000,000 total pts',   check: s => s.totalScore >= 10000000 },

  // ===== PRECISION (6) =====
  { id: 'perfect_10',   name: 'Sharpshooter',  icon: '⭐',  cat: 'Precision', desc: '10 perfect guesses',   check: s => s.perfectGuesses >= 10 },
  { id: 'perfect_50',   name: 'Sniper',        icon: '🎯',  cat: 'Precision', desc: '50 perfect guesses',   check: s => s.perfectGuesses >= 50 },
  { id: 'perfect_100',  name: 'Eagle Eye',     icon: '🦅',  cat: 'Precision', desc: '100 perfect guesses',  check: s => s.perfectGuesses >= 100 },
  { id: 'perfect_500',  name: 'Human GPS',     icon: '📡',  cat: 'Precision', desc: '500 perfect guesses',  check: s => s.perfectGuesses >= 500 },
  { id: 'high_45k',     name: 'Almost Perfect', icon: '✨', cat: 'Precision', desc: '45,000+ in one game',  check: s => (s.bestScore || 0) >= 45000 },
  { id: 'high_50k',     name: 'Flawless',      icon: '🏆',  cat: 'Precision', desc: '50,000 in one game',   check: s => (s.bestScore || 0) >= 50000 },

  // ===== CONTINENTS (7) =====
  { id: 'cont_americas', name: 'American Dream',  icon: '🌎', cat: 'Continents', desc: 'Play a game in the Americas',  check: s => hasContinent(s, 'Americas') },
  { id: 'cont_europe',   name: 'Eurotrip',        icon: '🌍', cat: 'Continents', desc: 'Play a game in Europe',        check: s => hasContinent(s, 'Europe') },
  { id: 'cont_asia',     name: 'Orient Express',  icon: '🌏', cat: 'Continents', desc: 'Play a game in Asia',          check: s => hasContinent(s, 'Asia') },
  { id: 'cont_africa',   name: 'Safari',           icon: '🦁', cat: 'Continents', desc: 'Play a game in Africa',        check: s => hasContinent(s, 'Africa') },
  { id: 'cont_oceania',  name: 'Down Under',      icon: '🐨', cat: 'Continents', desc: 'Play a game in Oceania',       check: s => hasContinent(s, 'Oceania') },
  { id: 'cont_5',        name: 'Five Continents',  icon: '🌐', cat: 'Continents', desc: 'Play in all 5 continents',     check: s => countContinents(s) >= 5 },
  { id: 'cont_1day',     name: 'World Traveler',   icon: '✈️', cat: 'Continents', desc: '5 continents in one day',      check: s => s.continentsInOneDay >= 5 },

  // ===== COUNTRIES (6) =====
  { id: 'countries_5',   name: 'Explorer',       icon: '🧭', cat: 'Countries', desc: 'Play in 5 countries',   check: s => (s.countriesPlayed || 0) >= 5 },
  { id: 'countries_10',  name: 'Jet Setter',     icon: '✈️', cat: 'Countries', desc: 'Play in 10 countries',  check: s => (s.countriesPlayed || 0) >= 10 },
  { id: 'countries_25',  name: 'Passport Stamps', icon: '🛂', cat: 'Countries', desc: 'Play in 25 countries',  check: s => (s.countriesPlayed || 0) >= 25 },
  { id: 'countries_50',  name: 'World Citizen',   icon: '🌐', cat: 'Countries', desc: 'Play in 50 countries',  check: s => (s.countriesPlayed || 0) >= 50 },
  { id: 'countries_100', name: 'Atlas',           icon: '🗺️', cat: 'Countries', desc: 'Play in 100 countries', check: s => (s.countriesPlayed || 0) >= 100 },
  { id: 'countries_150', name: 'Omniscient',      icon: '👁️', cat: 'Countries', desc: 'Play in 150 countries', check: s => (s.countriesPlayed || 0) >= 150 },

  // ===== MULTIPLAYER (5) =====
  { id: 'duel_win',     name: 'Winner',    icon: '⚔️', cat: 'Multiplayer', desc: 'Win a duel',              check: s => s.duelsWon >= 1 },
  { id: 'duel_5',       name: 'Duelist',   icon: '🗡️', cat: 'Multiplayer', desc: 'Win 5 duels',             check: s => (s.duelsWon || 0) >= 5 },
  { id: 'duel_20',      name: 'Champion',  icon: '🏆', cat: 'Multiplayer', desc: 'Win 20 duels',            check: s => (s.duelsWon || 0) >= 20 },
  { id: 'duel_50',      name: 'Unbeatable', icon: '💀', cat: 'Multiplayer', desc: 'Win 50 duels',           check: s => (s.duelsWon || 0) >= 50 },
  { id: 'duel_comeback', name: 'Comeback',  icon: '🔄', cat: 'Multiplayer', desc: 'Win after being last',   check: s => s.duelComeback },

  // ===== CREATOR (5) =====
  { id: 'submit_1',   name: 'Contributor',    icon: '📸', cat: 'Creator', desc: 'Submit 1 level',   check: s => (s.totalSubmissions || 0) >= 1 },
  { id: 'submit_5',   name: 'Photographer',   icon: '📷', cat: 'Creator', desc: 'Submit 5 levels',  check: s => (s.totalSubmissions || 0) >= 5 },
  { id: 'submit_10',  name: 'Content Creator', icon: '🎬', cat: 'Creator', desc: 'Submit 10 levels', check: s => (s.totalSubmissions || 0) >= 10 },
  { id: 'submit_50',  name: 'Producer',        icon: '🎥', cat: 'Creator', desc: 'Submit 50 levels', check: s => (s.totalSubmissions || 0) >= 50 },
  { id: 'submit_100', name: 'Legend Builder',   icon: '🏛️', cat: 'Creator', desc: 'Submit 100 levels', check: s => (s.totalSubmissions || 0) >= 100 },

  // ===== SECRET (5) =====
  { id: 'midnight',    name: 'Night Owl',    icon: '🦉', cat: 'Secret', desc: 'Play at midnight',                check: s => s.playedAtMidnight },
  { id: 'christmas',   name: 'Santa Guesser', icon: '🎅', cat: 'Secret', desc: 'Play on Christmas Day',          check: s => s.playedOnChristmas },
  { id: 'ten_streak',  name: 'On a Roll',    icon: '🎳', cat: 'Secret', desc: '10 perfect guesses in a row',     check: s => (s.perfectStreak || 0) >= 10 },
  { id: 'speed_demon', name: 'Speed Demon',  icon: '⚡', cat: 'Secret', desc: 'Confirm guess within 3 seconds',  check: s => s.fastGuess },
  { id: 'globe_trotter', name: 'Globe Trotter', icon: '🌍', cat: 'Secret', desc: 'Guess correct in 20 different countries', check: s => (s.countriesCorrect || 0) >= 20 },
];

// ---- Continent helpers ----
function hasContinent(stats, continent) {
  const played = stats.continentsPlayed || [];
  return played.includes(continent);
}

function countContinents(stats) {
  return (stats.continentsPlayed || []).length;
}

// ---- Categories ----
export function getAchievementCategories() {
  const cats = {};
  ACHIEVEMENTS.forEach(a => {
    if (!cats[a.cat]) cats[a.cat] = [];
    cats[a.cat].push(a);
  });
  return cats;
}

// ---- Persistence ----
const LS_KEY = 'ptw_achievements';

export function getUnlockedAchievements() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
}

export function saveUnlockedAchievements(arr) {
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}

export function checkAchievements(stats, roundScores) {
  // Add special time-based checks
  const now = new Date();
  if (now.getHours() === 0) stats.playedAtMidnight = true;
  if (now.getMonth() === 11 && now.getDate() === 25) stats.playedOnChristmas = true;

  // Check for zero round
  if (roundScores && roundScores.some(r => r === 0)) stats.hasZeroRound = true;

  // Save updated stats
  localStorage.setItem('ptw_stats', JSON.stringify(stats));

  const unlocked = getUnlockedAchievements();
  const newlyUnlocked = [];
  ACHIEVEMENTS.forEach(ach => {
    if (unlocked.includes(ach.id)) return;
    try {
      if (ach.check(stats, roundScores)) {
        unlocked.push(ach.id);
        newlyUnlocked.push(ach);
      }
    } catch { /* skip */ }
  });
  if (newlyUnlocked.length > 0) {
    saveUnlockedAchievements(unlocked);
    newlyUnlocked.forEach((ach, i) => {
      setTimeout(() => showAchievementPopup(ach), 800 + i * 1500);
    });
  }
  return newlyUnlocked;
}

function showAchievementPopup(ach) {
  playSound('perfect');
  const el = document.createElement('div');
  el.className = 'achievement-popup';
  el.innerHTML = `<div class="achievement-popup__icon">${ach.icon}</div>
    <div class="achievement-popup__text">
      <div class="achievement-popup__title">Achievement Unlocked!</div>
      <div class="achievement-popup__name">${ach.name}</div>
      <div class="achievement-popup__desc">${ach.desc}</div>
    </div>`;
  document.getElementById('achievement-container').appendChild(el);
  requestAnimationFrame(() => el.classList.add('visible'));
  setTimeout(() => { el.classList.remove('visible'); setTimeout(() => el.remove(), 500); }, 3500);
}

/* Easter Eggs — Hidden interactions & secrets */

import { playSound } from './sounds.js';
import { checkAchievements, getUnlockedAchievements } from './achievements.js';

// ---- Console Art ----
function printConsoleArt() {
  console.log(`
%c  ____  _    _____ _          __        __         _     _
 |  _ \\(_)_ |_   _| |__   ___\\ \\      / /__  _ __| | __| |
 | |_) | | '_ \\| | | '_ \\ / _ \\\\ \\ /\\ / / _ \\| '__| |/ _\` |
 |  __/| | | | | | | | | |  __/ \\ V  V / (_) | |  | | (_| |
 |_|   |_|_| |_|_| |_| |_|\\___|  \\_/\\_/ \\___/|_|  |_|\\__,_|

%c  Looking for secrets? Try the Konami Code...
%c  (hint: arrows + B + A)
`, 'color: #6366f1; font-weight: bold', 'color: #f59e0b', 'color: #666');
}

// ---- Konami Code ----
const KONAMI_SEQUENCE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;

function initKonamiCode() {
  document.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === KONAMI_SEQUENCE[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === KONAMI_SEQUENCE.length) {
        konamiIndex = 0;
        activateKonami();
      }
    } else {
      konamiIndex = 0;
    }
  });
}

function activateKonami() {
  playSound('konami');
  showConfetti();

  // Update stats & trigger achievement
  const stats = JSON.parse(localStorage.getItem('ptw_stats') || '{}');
  stats.konamiActivated = true;
  localStorage.setItem('ptw_stats', JSON.stringify(stats));
  checkAchievements(stats, null);

  showEasterEggToast('You found a secret! Konami Code activated!');
}

// ---- Confetti ----
function showConfetti() {
  const container = document.createElement('div');
  container.className = 'easter-confetti';
  document.body.appendChild(container);

  const emojis = ['🌍','🎮','🎯','🗺️','✨','🏆','🌟','🎉','🔥','💎','🚀','⭐'];
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('span');
    particle.className = 'confetti-particle';
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 0.8 + 's';
    particle.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
    container.appendChild(particle);
  }
  setTimeout(() => container.remove(), 4000);
}

// ---- Title Click (10 fast clicks = retro mode) ----
let titleClicks = 0;
let titleClickTimer = null;

function initTitleClick() {
  const titleEl = document.querySelector('.home-title') || document.querySelector('h1');
  if (!titleEl) return;
  titleEl.style.cursor = 'default';
  titleEl.addEventListener('click', () => {
    titleClicks++;
    clearTimeout(titleClickTimer);
    titleClickTimer = setTimeout(() => { titleClicks = 0; }, 2000);
    if (titleClicks >= 10) {
      titleClicks = 0;
      activateRetroMode();
    }
  });
}

function activateRetroMode() {
  playSound('retro');
  document.body.classList.add('retro-mode');
  showEasterEggToast('Vintage Mode Activated!');
  setTimeout(() => document.body.classList.remove('retro-mode'), 10000);
}

// ---- Press F to Pay Respects ----
let pressFEnabled = false;

export function enablePressF() {
  pressFEnabled = true;
}

export function disablePressF() {
  pressFEnabled = false;
}

function initPressF() {
  document.addEventListener('keydown', (e) => {
    if (!pressFEnabled) return;
    if (e.key === 'f' || e.key === 'F') {
      spawnFloatingF();

      const stats = JSON.parse(localStorage.getItem('ptw_stats') || '{}');
      if (!stats.pressedF) {
        stats.pressedF = true;
        localStorage.setItem('ptw_stats', JSON.stringify(stats));
        checkAchievements(stats, null);
      }
    }
  });
}

function spawnFloatingF() {
  const container = document.getElementById('achievement-container') || document.body;
  const f = document.createElement('div');
  f.className = 'floating-f';
  f.textContent = 'F';
  f.style.left = (20 + Math.random() * 60) + '%';
  container.appendChild(f);
  requestAnimationFrame(() => f.classList.add('visible'));
  setTimeout(() => f.remove(), 2000);
}

// ---- Easter Egg Toast ----
function showEasterEggToast(msg) {
  const existing = document.querySelector('.easter-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'easter-toast';
  toast.innerHTML = `<span class="easter-toast__icon">🥚</span> ${msg}`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 500);
  }, 3500);
}

// ---- Init all easter eggs ----
export function initEasterEggs() {
  printConsoleArt();
  initKonamiCode();
  initPressF();
  // Title click needs DOM to be ready
  setTimeout(initTitleClick, 500);
}

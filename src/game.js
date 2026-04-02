/* PinTheWorld — Game Engine (Drill-down: Country → Subdivision) */

import { playSound } from './sounds.js';
import { haversineDistance, selectRandomRounds, MAX_SCORE_PER_ROUND, ROUNDS_PER_GAME } from './scoring.js';
import { getLevel, getLevelProgress, scoreToXP } from './levels.js';
import { checkAchievements, ACHIEVEMENTS, getAchievementCategories, getUnlockedAchievements, getUnlockedMap, syncAchievements } from './achievements.js';
import { COUNTRIES, getCountry } from './countries/index.js';
import {
  initGameMap, initHomeMap, showCountries, showSubdivisions,
  getSelectedId, getSelectedName, getSubdivisionInfo, getAllSubdivisionData,
  highlightCorrect, highlightWrong, drawDistanceLine, resetForNextRound,
  destroyGameMap, addLabel, fitBoth, getCurrentPhase
} from './map.js';
import { initAuth, onAuthChange, signInWithGoogle, signOut, getCurrentUser, isSignedIn } from './auth.js';
import { isAdmin, verifyAdmin, initAdmin } from './admin.js';
import { initI18n, setLang, t } from './i18n.js';
import { supabase, isDemoMode } from './supabase.js';
import { initSubmitScreen, destroySubmitScreen } from './submissions.js';
import { checkPremium, buyPremium, handlePaymentReturn } from './payments.js';
import { initAds, showRewardedAd } from './ads.js';
import { initEasterEggs, enablePressF, disablePressF } from './easter-eggs.js';
import { SEED_ROUNDS } from './seed-rounds.js';

const PLAYS_GUEST = 1;
const PLAYS_SIGNED_IN = 5;
// Premium = unlimited (check localStorage ptw_premium)
const $ = sel => document.querySelector(sel);

let gameMode = 'places';
let gameState = 'IDLE';
let dailyRounds = [];
let currentRoundIndex = 0;
let totalScore = 0;
let roundScores = [];
let guessedCountryId = null;
let adPlayGranted = false;
let roundTimer = null;
let roundSeconds = 0;
let currentStreak = 0;

// ---- Screens ----
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  $(`#${id}`)?.classList.add('active');
}
function showModal(id) { $(`#${id}`)?.classList.remove('hidden'); }
function hideModal(id) { $(`#${id}`)?.classList.add('hidden'); }
function showToast(msg, dur) {
  const t = $('#toast'); t.textContent = msg; t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), dur || 3000);
}

// ---- Init ----
export async function init() {
  initI18n();
  initAds();
  initEasterEggs();
  await initAuth();
  await verifyAdmin();
  onAuthChange(async (user) => {
    if (user && !user.isGuest) {
      await verifyAdmin();
      syncAchievements();
    }
    updateAuthUI(user);
  });
  syncAchievements();
  updateAuthUI(getCurrentUser());
  bindEvents();

  // Handle Stripe payment return
  const paymentResult = handlePaymentReturn();
  if (paymentResult) {
    if (paymentResult.success) {
      if (paymentResult.type === 'premium') {
        showToast('Welcome to Premium! Unlimited plays unlocked.');
      } else {
        showToast('Payment successful! Your promo is live.');
      }
    } else {
      showToast('Payment was cancelled.');
    }
  }

  // Check hash route
  if (window.location.hash === '#admin') {
    showAdminScreen();
  } else {
    showHomeScreen();
  }

  // Hash change listener
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#admin') showAdminScreen();
  });
}

function updateAuthUI(user) {
  $('#btn-auth').textContent = (user && !user.isGuest) ? user.displayName : 'Sign In';
  const s = getLocalStats(), l = getLevel(s.totalScore || 0);
  $('#level-icon').textContent = l.icon;
  $('#level-name').textContent = l.name;
  $('#level-badge').classList.remove('hidden');
  // Premium badge in header
  const existingPremBadge = document.querySelector('.premium-badge-header');
  if (existingPremBadge) existingPremBadge.remove();
  if (localStorage.getItem('ptw_premium') === 'true') {
    const badge = document.createElement('span');
    badge.className = 'premium-badge-header';
    badge.textContent = 'PRO';
    $('#level-badge').appendChild(badge);
  }

  // Show admin button if admin
  const adminBtn = $('#btn-admin');
  if (adminBtn) {
    if (user && !user.isGuest && isAdmin()) {
      adminBtn.classList.remove('hidden');
    } else {
      adminBtn.classList.add('hidden');
    }
  }
}

function showHomeScreen() {
  showScreen('screen-world');
  $('#btn-back').classList.add('hidden');
  initHomeMap('home-map');
}

function showAdminScreen() {
  const user = getCurrentUser();
  if (!user || user.isGuest || !isAdmin()) {
    showToast('Admin access only');
    showHomeScreen();
    return;
  }
  showScreen('screen-admin');
  $('#btn-back').classList.remove('hidden');
  initAdmin();
}

// ---- Start Game ----
async function startGame(mode) {
  gameMode = mode;
  // Check play limits
  const isPremium = await checkPremium();
  if (!isPremium && !adPlayGranted) {
    const plays = getDailyPlays();
    const limit = isSignedIn() ? PLAYS_SIGNED_IN : PLAYS_GUEST;
    if (plays >= limit) {
      if (!isSignedIn()) {
        showToast(t('signInMore'));
      } else {
        showPremiumModal();
      }
      return;
    }
  }
  adPlayGranted = false;

  const allRounds = await loadRounds(mode);

  // No rounds available — show "building levels" message
  if (!allRounds || allRounds.length === 0) {
    showNoRoundsScreen(mode);
    return;
  }

  dailyRounds = selectRandomRounds(allRounds, Math.min(ROUNDS_PER_GAME, allRounds.length), mode);
  currentRoundIndex = 0;
  totalScore = 0;
  roundScores = [];
  currentStreak = 0;

  // Show first-time tutorial
  if (!localStorage.getItem('ptw_tutorial_done')) {
    showTutorial();
  }

  showScreen('screen-game');
  $('#btn-back').classList.remove('hidden');
  initGameMap('game-map');
  startRound();
}

// ---- Round ----
function startRound() {
  if (currentRoundIndex >= dailyRounds.length) { endGame(); return; }
  const r = dailyRounds[currentRoundIndex];

  $('#round-counter').textContent = `${currentRoundIndex + 1} / ${dailyRounds.length}`;
  $('#score-display').textContent = `${totalScore.toLocaleString()} pts`;
  $('#round-photo').src = r.photoUrl;
  $('#promo-card').classList.add('hidden');

  // Streak indicator
  const streakEl = $('#streak-indicator');
  if (streakEl) {
    if (currentStreak >= 2) {
      streakEl.textContent = `🔥${currentStreak}`;
      streakEl.classList.remove('hidden');
    } else {
      streakEl.classList.add('hidden');
    }
  }

  // Start round timer
  startRoundTimer();

  resetForNextRound();
  guessedCountryId = null;
  gameState = 'PLAYING_COUNTRY';
  $('#btn-confirm').disabled = true;
  $('#btn-confirm').textContent = 'Confirm Region';
  $('#selected-info').classList.add('hidden');
  $('#phase-indicator').textContent = t('selectCountry');
  $('#phase-indicator').classList.remove('hidden');

  showCountries((iso, name) => {
    if (gameState !== 'PLAYING_COUNTRY' && gameState !== 'PLAYING_SUBDIV') return;
    playSound('confirm');
    drillIntoCountry(iso);
  });
}

// ---- Drill into country (immediate on click) ----
function drillIntoCountry(iso) {
  guessedCountryId = iso;
  gameState = 'PLAYING_SUBDIV';
  $('#btn-confirm').disabled = true;
  $('#btn-confirm').textContent = 'Confirm Region';
  $('#selected-info').classList.add('hidden');

  const c = getCountry(iso);
  const cName = c ? `${c.flag} ${c.name}` : iso.toUpperCase();
  $('#phase-indicator').textContent = `Select region in ${cName}`;

  showSubdivisions(iso, (subId, subName, cid) => {
    if (gameState !== 'PLAYING_SUBDIV') return;
    playSound('select');
    $('#selected-name').textContent = subName;
    $('#selected-info').classList.remove('hidden');
    $('#btn-confirm').disabled = false;
  }).then(() => {
    const subs = getAllSubdivisionData();
    const countryRegions = Object.keys(subs).filter(k => subs[k].countryId === iso);
    if (countryRegions.length === 1) {
      const onlyId = countryRegions[0];
      playSound('select');
      $('#selected-name').textContent = subs[onlyId].name;
      $('#selected-info').classList.remove('hidden');
      $('#btn-confirm').disabled = false;
    }
  });
}

// ---- Confirm ----
function confirmGuess() {
  const id = getSelectedId();
  if (!id) return;

  if (gameState === 'PLAYING_SUBDIV') {
    playSound('confirm');
    revealResult();
  }
}

// ---- Reveal ----
function revealResult() {
  gameState = 'RESULT';
  const r = dailyRounds[currentRoundIndex];
  const guessedSubId = getSelectedId();
  const guessedInfo = getSubdivisionInfo(guessedSubId);
  const correctLat = r.lat, correctLng = r.lng;

  // Find closest subdivision to correct location
  let correctSubId = null, minD = Infinity;
  for (const [sid, info] of Object.entries(getAllSubdivisionData())) {
    const d = haversineDistance(info.lat, info.lng, correctLat, correctLng);
    if (d < minD) { minD = d; correctSubId = sid; }
  }
  const correctInfo = getSubdivisionInfo(correctSubId);

  // Distance
  const distKm = guessedInfo ? haversineDistance(guessedInfo.lat, guessedInfo.lng, correctLat, correctLng) : 20000;

  // GeoGuessr-style exponential decay scoring
  // Formula: 5000 * e^(-10 * d / D)
  // D = map diagonal (~20000 km for world map)
  // Perfect (exact region match) = always 5000
  // <150m = 5000, then exponential decay by distance
  const MAP_DIAGONAL = 20000;
  let score = 0;
  if (guessedSubId === correctSubId) {
    score = MAX_SCORE_PER_ROUND;
  } else if (distKm < 0.15) {
    score = MAX_SCORE_PER_ROUND;
  } else {
    score = Math.round(MAX_SCORE_PER_ROUND * Math.exp(-10 * distKm / MAP_DIAGONAL));
  }

  roundScores.push(score);
  totalScore += score;

  // Stop timer
  stopRoundTimer();

  // Track streak (perfect = exact, but keep streak alive for great guesses too)
  if (score === MAX_SCORE_PER_ROUND) currentStreak++;
  else if (score >= 3000) { /* maintain streak but don't increment */ }
  else currentStreak = 0;

  // Track fast guess for achievement
  if (roundSeconds <= 3) {
    const s = getLocalStats();
    s.fastGuess = true;
    saveLocalStats(s);
  }

  // Sound & highlight
  if (score === MAX_SCORE_PER_ROUND) { playSound('perfect'); highlightCorrect(guessedSubId); triggerConfetti(); }
  else if (score > 3000) { playSound('correct'); highlightWrong(guessedSubId); highlightCorrect(correctSubId); }
  else { playSound('wrong'); highlightWrong(guessedSubId); highlightCorrect(correctSubId); }

  if (guessedSubId !== correctSubId && guessedInfo && correctInfo) {
    drawDistanceLine([guessedInfo.lat, guessedInfo.lng], [correctInfo.lat, correctInfo.lng]);
    fitBoth(guessedSubId, correctSubId);
  }
  if (correctInfo) addLabel([correctInfo.lat, correctInfo.lng], correctInfo.name, 'map-label correct-label');
  if (guessedSubId !== correctSubId && guessedInfo) addLabel([guessedInfo.lat, guessedInfo.lng], guessedInfo.name, 'map-label wrong-label');

  let distText = distKm < 1 ? `${Math.round(distKm * 1000)} m` : distKm < 100 ? `${distKm.toFixed(1)} km` : `${Math.round(distKm).toLocaleString()} km`;

  const isPerfect = score === MAX_SCORE_PER_ROUND;
  $('#result-icon').textContent = isPerfect ? '🎯' : score > 4000 ? '🔥' : score > 2500 ? '👍' : score > 1000 ? '😐' : '😬';
  $('#result-score').textContent = `+${score.toLocaleString()} pts`;
  $('#result-score').className = 'result-score ' + (isPerfect ? 'perfect' : score > 4000 ? 'good' : score > 2500 ? 'ok' : 'bad');
  $('#result-detail').textContent = `${r.locationName}, ${r.country}`;

  // Distance with category feedback
  let distLabel = '';
  if (isPerfect) distLabel = 'Exact match!';
  else if (distKm < 50) distLabel = `${distText} — Amazing!`;
  else if (distKm < 200) distLabel = `${distText} — So close!`;
  else if (distKm < 500) distLabel = `${distText} — Close`;
  else if (distKm < 1500) distLabel = `${distText} — Not bad`;
  else if (distKm < 5000) distLabel = `${distText} — Far`;
  else distLabel = `${distText} — Very far`;
  $('#result-distance').textContent = distLabel;
  $('#phase-indicator').classList.add('hidden');

  // Show promo card if this round has promo data
  const promoCard = $('#result-promo-card');
  if (r.isPromo && r.promoData && promoCard) {
    const pd = r.promoData;
    const isPeoplPromo = r.mode === 'people';
    promoCard.className = `result-promo-card ${isPeoplPromo ? 'cupido-card' : ''}`;
    promoCard.innerHTML = `
      <div class="result-promo-photo" style="aspect-ratio:${isPeoplPromo ? '9/16' : '16/9'}">
        <img src="${r.photoUrl}" />
      </div>
      <div class="result-promo-info">
        <div class="result-promo-name">${pd.name || ''}</div>
        <div class="result-promo-bio">${pd.bio || ''}</div>
        <div class="result-promo-links">
          ${pd.instagram ? `<a href="https://instagram.com/${pd.instagram.replace('@','')}" target="_blank">📸 ${pd.instagram}</a>` : ''}
          ${pd.whatsapp ? `<a href="https://wa.me/${pd.whatsapp.replace(/\D/g,'')}" target="_blank">💬 WhatsApp</a>` : ''}
          ${pd.telegram ? `<a href="https://t.me/${pd.telegram.replace('@','')}" target="_blank">✈️ Telegram</a>` : ''}
          ${pd.website ? `<a href="${pd.website}" target="_blank">🌐 Website</a>` : ''}
          ${pd.phone ? `<a href="tel:${pd.phone}">📞 ${pd.phone}</a>` : ''}
        </div>
      </div>`;
    promoCard.classList.remove('hidden');
  } else if (promoCard) {
    promoCard.classList.add('hidden');
  }

  // Enable "Press F" easter egg on bad scores
  if (score < 1000) enablePressF();
  else disablePressF();

  showModal('modal-result');
  $('#score-display').textContent = `${totalScore.toLocaleString()} pts`;
}


function nextRound() {
  hideModal('modal-result');
  disablePressF();
  currentRoundIndex++;
  if (currentRoundIndex >= dailyRounds.length) endGame();
  else startRound();
}

function endGame() {
  gameState = 'OVER';
  playSound('gameover');
  incrementDailyPlays();
  const s = getLocalStats();
  const prevScore = s.totalScore || 0;
  s.totalGames = (s.totalGames || 0) + 1;
  s.totalScore = (s.totalScore || 0) + totalScore;
  s.bestScore = Math.max(s.bestScore || 0, totalScore);
  s.perfectGuesses = (s.perfectGuesses || 0) + roundScores.filter(x => x === MAX_SCORE_PER_ROUND).length;
  const today = new Date().toDateString();
  if (s.lastPlayDate !== today) {
    const y = new Date(Date.now() - 86400000).toDateString();
    s.streak = (s.lastPlayDate === y) ? (s.streak || 0) + 1 : 1;
    s.lastPlayDate = today;
  }

  // Track countries played as list for cultural achievements
  if (!s.countriesPlayedList) s.countriesPlayedList = [];
  const gameCountry = dailyRounds[0]?.countryId;
  if (gameCountry && !s.countriesPlayedList.includes(gameCountry)) {
    s.countriesPlayedList.push(gameCountry);
  }

  // Track countries this week
  const weekKey = getWeekKey();
  if (!s._weekKey || s._weekKey !== weekKey) {
    s._weekKey = weekKey;
    s._weekCountries = [];
  }
  if (gameCountry && !s._weekCountries.includes(gameCountry)) {
    s._weekCountries.push(gameCountry);
  }
  s.countriesThisWeek = s._weekCountries.length;

  // Columbus Day: played in ES then Americas same day
  if (!s._todayKey || s._todayKey !== today) {
    s._todayKey = today;
    s._todayCountries = [];
  }
  if (gameCountry) s._todayCountries.push(gameCountry);
  if (s._todayCountries.includes('es')) {
    const AMERICAS = ['us','ca','mx','cu','br','ar','co','cl','pe','ve','ec','bo','py','uy','cr','pa','do','gt','hn','sv','ni','pr','jm','ht','tt'];
    if (s._todayCountries.some(c => AMERICAS.includes(c))) {
      s.columbusDay = true;
    }
  }

  // Win streak (40k+ games in a row)
  if (totalScore >= 40000) {
    s.winStreak = (s.winStreak || 0) + 1;
  } else {
    s.winStreak = 0;
  }

  // Improving streak (score better than previous game)
  if (s.lastGameScore !== undefined && totalScore > s.lastGameScore) {
    s.improvingStreak = (s.improvingStreak || 0) + 1;
  } else {
    s.improvingStreak = 0;
  }
  s.lastGameScore = totalScore;

  // Fail streak (rounds with < 500 in this game — track max consecutive)
  let maxFail = 0, curFail = 0;
  roundScores.forEach(r => {
    if (r < 500) { curFail++; maxFail = Math.max(maxFail, curFail); }
    else curFail = 0;
  });
  s.failStreak = Math.max(s.failStreak || 0, maxFail);

  // Wrong country streak
  // (tracked per-round in revealResult, stored on stats)

  saveLocalStats(s);
  const prevLevel = getLevel(prevScore);
  const li = getLevelProgress(s.totalScore);
  const newLevel = getLevel(s.totalScore);
  const leveledUp = newLevel.name !== prevLevel.name;

  $('#gameover-score').textContent = `${totalScore.toLocaleString()} pts`;
  $('#gameover-xp').textContent = `+${scoreToXP(totalScore)} XP`;
  $('#gameover-level').innerHTML = `${li.current.icon} ${li.current.name}`;

  // Level up banner
  let levelUpHtml = '';
  if (leveledUp) {
    levelUpHtml = `<div class="level-up-banner"><div class="level-up-title">Level Up!</div><div class="level-up-icon">${newLevel.icon}</div><div class="level-up-name">${newLevel.name}</div></div>`;
    playSound('levelup');
  }

  // XP progress bar
  const xpProgress = li.next ? `
    <div class="xp-progress-container">
      <div class="xp-progress-labels"><span>${li.current.icon} ${li.current.name}</span><span>${li.next.icon} ${li.next.name}</span></div>
      <div class="xp-progress-bar"><div class="xp-progress-fill" id="gameover-xp-fill" style="width:0%"></div></div>
      <div class="xp-next-level">${(li.next.xp - scoreToXP(s.totalScore)).toLocaleString()} XP to next level</div>
    </div>` : '';

  const bestIdx = roundScores.indexOf(Math.max(...roundScores));
  const worstIdx = roundScores.indexOf(Math.min(...roundScores));
  const perfects = roundScores.filter(x => x === MAX_SCORE_PER_ROUND).length;
  const personalBest = totalScore === s.bestScore && s.totalGames > 1;

  let summaryHtml = '';
  if (personalBest) summaryHtml += `<div class="gameover-badge best">New Personal Best!</div>`;
  if (perfects > 0) summaryHtml += `<div class="gameover-badge perfects">🎯 ${perfects} Perfect${perfects > 1 ? 's' : ''}</div>`;

  $('#gameover-breakdown').innerHTML = levelUpHtml + summaryHtml + roundScores.map((x, i) => {
    const cls = x === MAX_SCORE_PER_ROUND ? 'perfect' : x > 4000 ? 'good' : x > 2500 ? 'ok' : 'bad';
    const badge = i === bestIdx ? ' ⭐' : i === worstIdx && roundScores.length > 1 ? '' : '';
    return `<div class="breakdown-row"><span>Round ${i+1}${badge}</span><span class="${cls}">${x.toLocaleString()}</span></div>`;
  }).join('') + xpProgress;

  // Share platform buttons
  const shareArea = document.querySelector('.gameover-actions');
  if (shareArea) {
    const existingPlatforms = shareArea.querySelector('.share-platforms');
    if (existingPlatforms) existingPlatforms.remove();
    const platforms = document.createElement('div');
    platforms.className = 'share-platforms';
    platforms.innerHTML = `<button class="share-btn" id="btn-share-wa">💬 WhatsApp</button><button class="share-btn" id="btn-share-x">𝕏 Twitter</button><button class="share-btn" id="btn-share-copy">📋 Copy</button>`;
    shareArea.appendChild(platforms);
    document.getElementById('btn-share-wa').onclick = shareToWhatsApp;
    document.getElementById('btn-share-x').onclick = shareToTwitter;
    document.getElementById('btn-share-copy').onclick = () => copyAndToast(getShareText());
  }

  showModal('modal-gameover');

  // Animate XP bar after modal shows
  setTimeout(() => {
    const fill = document.getElementById('gameover-xp-fill');
    if (fill) fill.style.width = `${Math.round(li.progress * 100)}%`;
  }, 300);

  checkAchievements(s, roundScores);
  const lv = getLevel(s.totalScore);
  $('#level-icon').textContent = lv.icon;
  $('#level-name').textContent = lv.name;
}

function getShareText() {
  const e = roundScores.map(x => x===MAX_SCORE_PER_ROUND?'🎯':x>4000?'🟢':x>2500?'🟡':'🔴').join('');
  const s = getLocalStats();
  const l = getLevel(s.totalScore || 0);
  const streak = s.streak ? `🔥 ${s.streak} day streak` : '';
  return `PinTheWorld 🌍\n${e}\nScore: ${totalScore.toLocaleString()} / ${(MAX_SCORE_PER_ROUND*dailyRounds.length).toLocaleString()}\n${l.icon} ${l.name}${streak ? ' | ' + streak : ''}\npintheworld.online`;
}

function shareResults() {
  const text = getShareText();
  if (navigator.share) navigator.share({text}).catch(()=>{});
  else copyAndToast(text);
}

function shareToWhatsApp() {
  window.open(`https://wa.me/?text=${encodeURIComponent(getShareText())}`, '_blank');
}

function shareToTwitter() {
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(getShareText())}`, '_blank');
}

function copyAndToast(text) {
  navigator.clipboard.writeText(text).then(()=>showToast('Copied!'));
}

// ---- Load rounds: Supabase + localStorage + demo (places only) ----
async function loadRounds(mode) {
  const seen = new Set();
  const all = [];

  function addRound(r) {
    if (!r.id || seen.has(r.id)) return;
    seen.add(r.id);
    all.push(r);
  }

  // 1) Supabase — user-created rounds filtered by mode
  if (!isDemoMode && supabase) {
    try {
      const { data, error } = await supabase
        .from('rounds')
        .select('*')
        .eq('mode', mode)
        .eq('active', true);
      if (!error && data) {
        data.forEach(r => addRound({
          id: r.id,
          lat: 0, lng: 0,
          locationName: r.subdivision_name || '?',
          country: r.country_name || '?',
          countryId: r.country_id,
          subdivisionId: r.subdivision_id,
          mode: r.mode,
          photoUrl: r.photo_url,
          isPromo: r.is_promo,
          promoData: r.promo_data,
        }));
      }
    } catch (e) { console.error('Error loading rounds:', e); }
  }

  // 2) localStorage (admin-created rounds) — strict mode match
  try {
    const localActive = JSON.parse(localStorage.getItem('ptw_active_rounds') || '[]');
    localActive.filter(r => r.mode === mode).forEach(r => addRound({
      id: r.id, lat: r.lat || 0, lng: r.lng || 0,
      locationName: r.locationName || r.subdivision_name || '?',
      country: r.countryName || r.country_name || '?',
      countryId: r.countryId || r.country_id,
      subdivisionId: r.subdivisionId || r.subdivision_id,
      mode, photoUrl: r.photoUrl || r.photo_url,
      isPromo: r.isPromo || r.is_promo,
      promoData: r.promoData || r.promo_data,
    }));
  } catch { /* ignore */ }

  // 3) Demo / seed rounds — ONLY for 'places' mode
  //    'people' mode has no demo content; it relies on user submissions
  if (mode === 'places') {
    getDemoRounds().forEach(r => addRound(r));
  }

  return all;
}

function getDemoRounds() {
  const mode = 'places';
  const base = [
    {lat:48.8584,lng:2.2945,locationName:'Eiffel Tower',country:'France',countryId:'fr',subdivisionId:'fr___le_de_france',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/600px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg'},
    {lat:41.8902,lng:12.4922,locationName:'Colosseum',country:'Italy',countryId:'it',subdivisionId:'it_lazio',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/600px-Colosseo_2020.jpg'},
    {lat:51.5014,lng:-0.1419,locationName:'Big Ben',country:'United Kingdom',countryId:'gb',subdivisionId:'gb_greater_london',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg/600px-Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg'},
    {lat:40.6892,lng:-74.0445,locationName:'Statue of Liberty',country:'United States',countryId:'us',subdivisionId:'us_new_york',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Statue_of_Liberty_7.jpg/600px-Statue_of_Liberty_7.jpg'},
    {lat:-22.9519,lng:-43.2105,locationName:'Christ the Redeemer',country:'Brazil',countryId:'br',subdivisionId:'br_rio_de_janeiro',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Christ_the_Redeemer_-_Cristo_Redentor.jpg/600px-Christ_the_Redeemer_-_Cristo_Redentor.jpg'},
    {lat:27.1751,lng:78.0421,locationName:'Taj Mahal',country:'India',countryId:'in',subdivisionId:'in_uttar_pradesh',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/600px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg'},
    {lat:35.6762,lng:139.6503,locationName:'Tokyo Tower',country:'Japan',countryId:'jp',subdivisionId:'jp_tokyo',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/TaroTokyo20110213-TokyoTower-01min.jpg/600px-TaroTokyo20110213-TokyoTower-01min.jpg'},
    {lat:29.9792,lng:31.1342,locationName:'Great Pyramid',country:'Egypt',countryId:'eg',subdivisionId:'eg_giza',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/600px-Kheops-Pyramid.jpg'},
    {lat:-33.8568,lng:151.2153,locationName:'Sydney Opera House',country:'Australia',countryId:'au',subdivisionId:'au_new_south_wales',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sydney_Australia._%2821339175489%29.jpg/600px-Sydney_Australia._%2821339175489%29.jpg'},
    {lat:40.4319,lng:-3.6753,locationName:'Santiago Bernabeu',country:'Spain',countryId:'es',subdivisionId:'es_madrid',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Nuevo_Estadio_Santiago_Bernab%C3%A9u_-_2024.jpg/600px-Nuevo_Estadio_Santiago_Bernab%C3%A9u_-_2024.jpg'},
    {lat:52.5163,lng:13.3777,locationName:'Brandenburg Gate',country:'Germany',countryId:'de',subdivisionId:'de_berlin',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Brandenburger_Tor_abends.jpg/600px-Brandenburger_Tor_abends.jpg'},
    {lat:23.1136,lng:-82.3666,locationName:'El Capitolio, Havana',country:'Cuba',countryId:'cu',subdivisionId:'cu_la_habana',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/El_Capitolio_Havana.jpg/600px-El_Capitolio_Havana.jpg'},
    {lat:19.4326,lng:-99.1332,locationName:'Palacio de Bellas Artes',country:'Mexico',countryId:'mx',subdivisionId:'mx_ciudad_de_m_xico',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Palacio_de_Bellas_Artes_-_Ciudad_de_M%C3%A9xico.jpg/600px-Palacio_de_Bellas_Artes_-_Ciudad_de_M%C3%A9xico.jpg'},
    {lat:55.7539,lng:37.6208,locationName:'Red Square',country:'Russia',countryId:'ru',subdivisionId:'ru_moscow',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/RedSquare_SaintBasile_%28pixinn.net%29.jpg/600px-RedSquare_SaintBasile_%28pixinn.net%29.jpg'},
    {lat:-34.6037,lng:-58.3816,locationName:'Obelisco',country:'Argentina',countryId:'ar',subdivisionId:'ar_buenos_aires',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Buenos_Aires_-_Avenida_9_de_Julio.jpg/600px-Buenos_Aires_-_Avenida_9_de_Julio.jpg'},
    {lat:25.1972,lng:55.2744,locationName:'Burj Khalifa',country:'UAE',countryId:'ae',subdivisionId:'ae_dubai',photoUrl:'https://upload.wikimedia.org/wikipedia/en/thumb/9/93/Burj_Khalifa.jpg/600px-Burj_Khalifa.jpg'},
    {lat:-13.1631,lng:-72.5450,locationName:'Machu Picchu',country:'Peru',countryId:'pe',subdivisionId:'pe_cusco',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/600px-Machu_Picchu%2C_Peru.jpg'},
    {lat:37.5665,lng:126.9780,locationName:'Gyeongbokgung',country:'South Korea',countryId:'kr',subdivisionId:'kr_seoul',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/%EA%B2%BD%EB%B3%B5%EA%B6%81_%EA%B7%BC%EC%A0%95%EC%A0%84_%EC%95%9E_%EC%96%B4%EB%8F%84.jpg/600px-%EA%B2%BD%EB%B3%B5%EA%B6%81_%EA%B7%BC%EC%A0%95%EC%A0%84_%EC%95%9E_%EC%96%B4%EB%8F%84.jpg'},
    {lat:13.7563,lng:100.5018,locationName:'Wat Arun',country:'Thailand',countryId:'th',subdivisionId:'th_bangkok',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Wat_Arun_Bangkok.jpg/600px-Wat_Arun_Bangkok.jpg'},
    {lat:59.3293,lng:18.0686,locationName:'Stockholm Old Town',country:'Sweden',countryId:'se',subdivisionId:'se_stockholm',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Stockholms_gamla_stan%2C_2012.jpg/600px-Stockholms_gamla_stan%2C_2012.jpg'},
    {lat:38.7223,lng:-9.1393,locationName:'Belem Tower',country:'Portugal',countryId:'pt',subdivisionId:'pt_lisboa',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Bel%C3%A9m_Tower_Lisbon.jpg/600px-Bel%C3%A9m_Tower_Lisbon.jpg'},
    {lat:-1.2921,lng:36.8219,locationName:'Nairobi',country:'Kenya',countryId:'ke',subdivisionId:'ke_nairobi',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Nairobi_Skyline_from_Nairobi_National_Park.jpg/600px-Nairobi_Skyline_from_Nairobi_National_Park.jpg'},
    {lat:39.9042,lng:116.4074,locationName:'Forbidden City',country:'China',countryId:'cn',subdivisionId:'cn_beijing',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Forbidden_city_07.jpg/600px-Forbidden_city_07.jpg'},
    {lat:-33.9249,lng:18.4241,locationName:'Table Mountain',country:'South Africa',countryId:'za',subdivisionId:'za_western_cape',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Table_Mountain_DavidNewton.jpg/600px-Table_Mountain_DavidNewton.jpg'},
    {lat:48.2082,lng:16.3738,locationName:'Schonbrunn Palace',country:'Austria',countryId:'at',subdivisionId:'at_wien',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Schloss_Sch%C3%B6nbrunn_-_Gartenseite.jpg/600px-Schloss_Sch%C3%B6nbrunn_-_Gartenseite.jpg'},
    {lat:4.7110,lng:-74.0721,locationName:'Monserrate',country:'Colombia',countryId:'co',subdivisionId:'co_bogot_',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Monserrate_Bogot%C3%A1.jpg/600px-Monserrate_Bogot%C3%A1.jpg'},
    {lat:45.4215,lng:-75.6972,locationName:'Parliament Hill',country:'Canada',countryId:'ca',subdivisionId:'ca_ontario',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Ottawa_-_ON_-_Parliament_Hill.jpg/600px-Ottawa_-_ON_-_Parliament_Hill.jpg'},
    {lat:21.4225,lng:-77.9910,locationName:'Trinidad',country:'Cuba',countryId:'cu',subdivisionId:'cu_sancti_sp_ritus',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Trinidad_%28Kuba%29_02.jpg/600px-Trinidad_%28Kuba%29_02.jpg'},
    {lat:31.7683,lng:35.2137,locationName:'Western Wall',country:'Israel',countryId:'il',subdivisionId:'il_jerusalem',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Western_Wall_2.jpg/600px-Western_Wall_2.jpg'},
    {lat:37.9715,lng:23.7257,locationName:'Acropolis',country:'Greece',countryId:'gr',subdivisionId:'gr_attica',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/AthenaeumAcropolis.jpg/600px-AthenaeumAcropolis.jpg'},
  ].map((l,i) => ({...l, id:`d${i}`, mode, isPromo:false}));

  // Merge seed rounds (avoid duplicates by locationName)
  const existing = new Set(base.map(r => r.locationName));
  const extra = SEED_ROUNDS
    .filter(r => !existing.has(r.locationName))
    .map((r, i) => ({
      id: `s${i}`,
      lat: 0, lng: 0,
      locationName: r.locationName,
      country: r.countryName,
      countryId: r.countryId,
      subdivisionId: r.subdivisionId,
      photoUrl: r.photoUrl,
      mode,
      isPromo: false,
    }));

  return [...base, ...extra];
}

// ---- Confetti on perfect score ----
function triggerConfetti() {
  const container = document.createElement('div');
  container.className = 'easter-confetti';
  const emojis = ['🎯', '⭐', '✨', '🔥', '💎', '🏆'];
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('span');
    p.className = 'confetti-particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDelay = `${Math.random() * 0.8}s`;
    p.style.fontSize = `${16 + Math.random() * 16}px`;
    container.appendChild(p);
  }
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 3500);
}

// ---- Round timer ----
function startRoundTimer() {
  roundSeconds = 0;
  stopRoundTimer();
  const timerEl = $('#timer-display');
  if (timerEl) {
    timerEl.classList.remove('hidden', 'timer-warning');
    timerEl.textContent = '0s';
  }
  roundTimer = setInterval(() => {
    roundSeconds++;
    if (timerEl) {
      timerEl.textContent = `${roundSeconds}s`;
      if (roundSeconds >= 25) timerEl.classList.add('timer-warning');
    }
  }, 1000);
}

function stopRoundTimer() {
  if (roundTimer) { clearInterval(roundTimer); roundTimer = null; }
}

// ---- Tutorial (first-time only) ----
function showTutorial() {
  const existing = $('#modal-tutorial');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'modal-tutorial';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content" style="text-align:center;max-width:420px">
      <div style="font-size:48px;margin-bottom:8px">🌍</div>
      <h2 style="margin:0 0 12px">How to Play</h2>
      <div style="text-align:left;color:var(--text-dim);font-size:0.85rem;line-height:1.6">
        <p><strong>1.</strong> You'll see a photo of a real place</p>
        <p><strong>2.</strong> Click a <strong>country</strong> on the map</p>
        <p><strong>3.</strong> Then select the exact <strong>region</strong> within that country</p>
        <p><strong>4.</strong> The closer your guess, the more points you earn!</p>
        <p style="color:var(--accent);margin-top:12px">🎯 <strong>5,000 pts</strong> = exact region match</p>
      </div>
      <button id="btn-tutorial-ok" class="btn-primary" style="width:100%;margin-top:16px;padding:14px;font-size:1rem">
        Got it!
      </button>
    </div>`;
  document.getElementById('app').appendChild(modal);

  $('#btn-tutorial-ok').onclick = () => {
    modal.classList.add('hidden');
    localStorage.setItem('ptw_tutorial_done', 'true');
    setTimeout(() => modal.remove(), 300);
  };
}

// ---- Scoring Help ----
function showScoringHelp() {
  const existing = $('#modal-scoring');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'modal-scoring';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content" style="max-width:400px">
      <div class="modal-header"><h2>How Scoring Works</h2><button class="modal-close" onclick="this.closest('.modal').classList.add('hidden')">&times;</button></div>
      <div style="font-size:0.85rem;line-height:1.7;color:var(--text-dim)">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="font-size:1.2rem">🎯</span><strong style="color:var(--success)">5,000 pts</strong> — Exact match or &lt;150m</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="font-size:1.2rem">🔥</span><strong style="color:var(--primary)">4,000+</strong> — Within ~500 km</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="font-size:1.2rem">👍</span><strong style="color:var(--accent)">2,500+</strong> — Within ~1,500 km</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="font-size:1.2rem">😐</span><strong style="color:var(--text-dim)">1,000+</strong> — Within ~3,000 km</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px"><span style="font-size:1.2rem">😬</span><strong style="color:var(--danger)">0-999</strong> — More than 5,000 km away</div>
        <p style="margin-top:12px;padding-top:12px;border-top:1px solid #2a2a3a">Only distance matters! The closer your pin to the real location, the more points you get. Country borders don't affect scoring.</p>
      </div>
    </div>`;
  document.getElementById('app').appendChild(modal);
  modal.onclick = (e) => { if (e.target === modal) modal.classList.add('hidden'); };
}

function getWeekKey() {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

function showNoRoundsScreen(mode) {
  const modeLabel = mode === 'people' ? 'Cupido' : 'Places';
  const existing = $('#modal-no-rounds');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'modal-no-rounds';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content" style="text-align:center;max-width:400px">
      <div style="font-size:56px;margin-bottom:12px">🏗️</div>
      <h2 style="margin:0 0 8px">Building Levels</h2>
      <p style="color:#9ca3af;margin:0 0 20px">
        No ${modeLabel} rounds available yet. Help us build the game by creating new levels!
      </p>
      <button id="btn-no-rounds-create" class="btn-primary" style="width:100%;padding:14px;font-size:16px;font-weight:700">
        Create a Level
      </button>
      <button id="btn-no-rounds-close" class="btn-secondary" style="width:100%;margin-top:8px;padding:10px;opacity:0.6">
        Back to Home
      </button>
    </div>`;
  document.getElementById('app').appendChild(modal);

  $('#btn-no-rounds-create').onclick = () => {
    modal.classList.add('hidden');
    showScreen('screen-submit');
    $('#btn-back').classList.remove('hidden');
    gameState = 'SUBMITTING';
    initSubmitScreen();
  };
  $('#btn-no-rounds-close').onclick = () => {
    modal.classList.add('hidden');
    showHomeScreen();
  };
  modal.onclick = (e) => { if (e.target === modal) { modal.classList.add('hidden'); showHomeScreen(); } };
}

function getDailyPlays() { try { const d=JSON.parse(localStorage.getItem(`ptw_plays_${gameMode}`)); return d?.date===new Date().toDateString()?d.count:0; } catch{return 0;} }
function incrementDailyPlays() { localStorage.setItem(`ptw_plays_${gameMode}`, JSON.stringify({date:new Date().toDateString(),count:getDailyPlays()+1})); }
function getLocalStats() { try{return JSON.parse(localStorage.getItem('ptw_stats'))||{};}catch{return {};} }
function saveLocalStats(s) { localStorage.setItem('ptw_stats',JSON.stringify(s)); }

function showPremiumModal() {
  const existing = $('#modal-premium');
  if (existing) { existing.classList.remove('hidden'); return; }

  const modal = document.createElement('div');
  modal.id = 'modal-premium';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content" style="text-align:center;max-width:360px">
      <div style="font-size:48px;margin-bottom:12px">🌟</div>
      <h2 style="margin:0 0 8px">Go Premium</h2>
      <p style="color:#9ca3af;margin:0 0 16px">Unlimited plays forever — one-time purchase</p>
      <div style="font-size:32px;font-weight:800;color:#f59e0b;margin:0 0 20px">$3.99</div>
      <button id="btn-buy-premium" class="btn-primary" style="width:100%;padding:14px;font-size:16px;font-weight:700">
        Unlock Unlimited Plays
      </button>
      <div style="display:flex;align-items:center;gap:12px;margin:16px 0 8px">
        <div style="flex:1;height:1px;background:#333"></div>
        <span style="color:#666;font-size:13px">or</span>
        <div style="flex:1;height:1px;background:#333"></div>
      </div>
      <button id="btn-watch-ad" class="btn-secondary" style="width:100%;padding:12px;font-size:14px">
        Watch Ad for +1 Play
      </button>
      <button id="btn-close-premium" class="btn-secondary" style="width:100%;margin-top:8px;padding:10px;opacity:0.6">
        Maybe Later
      </button>
    </div>`;
  document.getElementById('app').appendChild(modal);

  $('#btn-buy-premium').onclick = async () => {
    $('#btn-buy-premium').disabled = true;
    $('#btn-buy-premium').textContent = 'Redirecting to Stripe...';
    const ok = await buyPremium();
    if (!ok) {
      showToast('Could not start checkout. Try again.');
      $('#btn-buy-premium').disabled = false;
      $('#btn-buy-premium').textContent = 'Unlock Unlimited Plays';
    }
  };
  $('#btn-watch-ad').onclick = async () => {
    $('#btn-watch-ad').disabled = true;
    $('#btn-watch-ad').textContent = 'Loading ad...';
    const watched = await showRewardedAd();
    if (watched) {
      modal.classList.add('hidden');
      showToast('+1 play unlocked!');
      adPlayGranted = true;
      startGame(gameMode);
    } else {
      showToast('No ad available right now. Try again later.');
      $('#btn-watch-ad').disabled = false;
      $('#btn-watch-ad').textContent = 'Watch Ad for +1 Play';
    }
  };
  $('#btn-close-premium').onclick = () => modal.classList.add('hidden');
  modal.onclick = (e) => { if (e.target === modal) modal.classList.add('hidden'); };
}

function showAchievementsGallery() {
  const unlockedMap = getUnlockedMap();
  const unlockedIds = Array.isArray(unlockedMap) ? unlockedMap : Object.keys(unlockedMap);
  const cats = getAchievementCategories();
  const catNames = Object.keys(cats);
  const total = ACHIEVEMENTS.length;
  const count = unlockedIds.length;
  const pct = Math.round((count / total) * 100);

  // Progress bar
  $('#ach-progress').innerHTML = `
    <div class="ach-progress-text"><strong>${count}</strong> / ${total} Unlocked</div>
    <div class="ach-progress-bar"><div class="ach-progress-fill" style="width:${pct}%"></div></div>`;

  // Category tabs
  $('#ach-tabs').innerHTML = `<button class="ach-tab active" data-cat="all">All</button>` +
    catNames.map(c => {
      const catCount = cats[c].filter(a => unlockedIds.includes(a.id)).length;
      return `<button class="ach-tab" data-cat="${c}">${c} <span style="opacity:0.5">${catCount}</span></button>`;
    }).join('');

  function renderGrid(filter) {
    const achs = filter === 'all' ? ACHIEVEMENTS : (cats[filter] || []);
    // Sort: unlocked first, then locked
    const sorted = [...achs].sort((a, b) => {
      const aU = unlockedIds.includes(a.id) ? 0 : 1;
      const bU = unlockedIds.includes(b.id) ? 0 : 1;
      return aU - bU;
    });

    $('#ach-grid').innerHTML = sorted.map(ach => {
      const isUnlocked = unlockedIds.includes(ach.id);
      const isSecret = ach.cat === 'Secret';
      const cls = isUnlocked ? 'unlocked' : (isSecret ? 'secret locked' : 'locked');
      const name = (!isUnlocked && isSecret) ? '???' : ach.name;
      const desc = (!isUnlocked && isSecret) ? 'Hidden achievement' : ach.desc;
      const icon = (!isUnlocked && isSecret) ? '❓' : ach.icon;

      let dateHtml = '';
      if (isUnlocked && !Array.isArray(unlockedMap) && unlockedMap[ach.id]) {
        const d = new Date(unlockedMap[ach.id]);
        dateHtml = `<div class="ach-date">${d.toLocaleDateString()}</div>`;
      }

      return `<div class="ach-card ${cls}">
        <div class="ach-icon">${icon}</div>
        <div class="ach-info">
          <div class="ach-name">${name}</div>
          <div class="ach-desc">${desc}</div>
          ${dateHtml}
        </div>
      </div>`;
    }).join('');
  }

  renderGrid('all');

  // Tab click handlers
  document.querySelectorAll('.ach-tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.ach-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderGrid(tab.dataset.cat);
    };
  });

  showModal('modal-achievements');
}

function bindEvents() {
  $('#btn-auth').onclick=()=>{isSignedIn()?signOut():signInWithGoogle();};
  $('#btn-back').onclick=()=>{
    if (gameState === 'PLAYING_SUBDIV') {
      // Back to country selection (same round)
      gameState = 'PLAYING_COUNTRY';
      guessedCountryId = null;
      $('#btn-confirm').disabled = true;
      $('#btn-confirm').textContent = 'Confirm Region';
      $('#selected-info').classList.add('hidden');
      $('#phase-indicator').textContent = t('selectCountry');
      showCountries((iso, name) => {
        if (gameState !== 'PLAYING_COUNTRY' && gameState !== 'PLAYING_SUBDIV') return;
        playSound('confirm');
        drillIntoCountry(iso);
      });
    } else if (gameState === 'SUBMITTING') {
      destroySubmitScreen();
      gameState = 'IDLE';
      showHomeScreen();
    } else {
      destroyGameMap();
      gameState='IDLE';
      window.location.hash = '';
      showHomeScreen();
    }
  };
  $('#btn-play-places').onclick=()=>{gameMode='places';document.querySelectorAll('.play-bar-btn').forEach(b=>b.classList.remove('selected'));$('#btn-play-places').classList.add('selected');};
  $('#btn-play-people').onclick=()=>{gameMode='people';document.querySelectorAll('.play-bar-btn').forEach(b=>b.classList.remove('selected'));$('#btn-play-people').classList.add('selected');};
  $('#btn-play-go').onclick=()=>startGame(gameMode);
  $('#btn-confirm').onclick=confirmGuess;
  $('#btn-next-round').onclick=nextRound;
  $('#btn-share').onclick=shareResults;
  $('#btn-play-again').onclick=()=>{hideModal('modal-gameover');startGame(gameMode);};
  $('#btn-change-country').onclick=()=>{hideModal('modal-gameover');destroyGameMap();gameState='IDLE';showHomeScreen();};
  $('#btn-leaderboard').onclick=()=>showModal('modal-leaderboard');
  $('#btn-admin').onclick=()=>{ window.location.hash='admin'; showAdminScreen(); };
  $('#btn-profile').onclick=()=>{
    const s=getLocalStats(),l=getLevel(s.totalScore||0),li=getLevelProgress(s.totalScore||0),u=getCurrentUser();
    const isPrem = localStorage.getItem('ptw_premium') === 'true';
    const premBadge = isPrem ? '<span class="premium-badge">PREMIUM</span>' : '';
    const xpNow = Math.floor((s.totalScore||0)/10);
    const xpBar = li.next ? `
      <div class="xp-progress-container">
        <div class="xp-progress-labels"><span>${li.current.icon} ${li.current.name}</span><span>${li.next.icon} ${li.next.name}</span></div>
        <div class="xp-progress-bar"><div class="xp-progress-fill" style="width:${Math.round(li.progress*100)}%"></div></div>
        <div class="xp-next-level">${(li.next.xp - xpNow).toLocaleString()} XP to next level</div>
      </div>` : '<div style="color:var(--accent);font-size:0.85rem;margin-bottom:12px">Max level reached!</div>';
    const achCount = getUnlockedAchievements().length;
    const achTotal = ACHIEVEMENTS.length;
    $('#profile-content').innerHTML=`<div class="profile-avatar">${l.icon}</div><h3>${u?.displayName||'Guest'} ${premBadge}</h3><div class="profile-level">${l.icon} ${l.name}</div>${xpBar}<div class="profile-stats"><div><strong>${(s.totalGames||0).toLocaleString()}</strong><br>Games</div><div><strong>${(s.totalScore||0).toLocaleString()}</strong><br>Score</div><div><strong>${s.streak||0}</strong><br>Streak</div><div><strong>${s.perfectGuesses||0}</strong><br>Perfects</div></div><button class="btn-achievements" id="btn-open-achievements">🏆 Achievements <span style="opacity:0.7">${achCount} / ${achTotal}</span></button>`;
    showModal('modal-profile');
    $('#btn-open-achievements').onclick = () => { hideModal('modal-profile'); showAchievementsGallery(); };
  };
  // Create levels
  $('#btn-create-levels').onclick = () => {
    showScreen('screen-submit');
    $('#btn-back').classList.remove('hidden');
    gameState = 'SUBMITTING';
    initSubmitScreen();
  };

  document.querySelectorAll('.modal-close').forEach(b=>{b.onclick=()=>hideModal(b.dataset.close);});
  document.querySelectorAll('.modal').forEach(m=>{m.onclick=e=>{if(e.target===m)m.classList.add('hidden');};});
  // Language selector
  const langSelect = $('#lang-select');
  if (langSelect) {
    langSelect.value = localStorage.getItem('ptw_lang') || 'en';
    langSelect.onchange = () => {
      setLang(langSelect.value);
    };
  }

  gameMode='places';
}

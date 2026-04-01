/* PinTheWorld — Game Engine (Drill-down: Country → Subdivision) */

import { playSound } from './sounds.js';
import { haversineDistance, selectDailyRounds, MAX_SCORE_PER_ROUND, ROUNDS_PER_GAME } from './scoring.js';
import { getLevel, getLevelProgress, scoreToXP } from './levels.js';
import { checkAchievements } from './achievements.js';
import { COUNTRIES, getCountry } from './countries/index.js';
import {
  initGameMap, initHomeMap, showCountries, showSubdivisions,
  getSelectedId, getSelectedName, getSubdivisionInfo, getAllSubdivisionData,
  highlightCorrect, highlightWrong, drawDistanceLine, resetForNextRound,
  destroyGameMap, addLabel, fitBoth, getCurrentPhase
} from './map.js';
import { initAuth, onAuthChange, signInWithGoogle, signOut, getCurrentUser, isSignedIn } from './auth.js';
import { isAdmin, initAdmin } from './admin.js';
import { supabase, isDemoMode } from './supabase.js';
import { initSubmitScreen, destroySubmitScreen } from './submissions.js';

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
  await initAuth();
  onAuthChange(updateAuthUI);
  updateAuthUI(getCurrentUser());
  bindEvents();

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

  // Show admin button if admin
  const adminBtn = $('#btn-admin');
  if (adminBtn) {
    if (user && !user.isGuest && isAdmin(user.email)) {
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
  if (!user || user.isGuest || !isAdmin(user.email)) {
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
  const isPremium = localStorage.getItem('ptw_premium') === 'true';
  if (!isPremium) {
    const plays = getDailyPlays();
    const limit = isSignedIn() ? PLAYS_SIGNED_IN : PLAYS_GUEST;
    if (plays >= limit) {
      if (!isSignedIn()) {
        showToast('Sign in to play up to 5 times daily!');
      } else {
        showToast('Daily limit reached! Get unlimited plays for $1.99');
      }
      return;
    }
  }

  const allRounds = await loadRounds(mode);
  dailyRounds = selectDailyRounds(allRounds, Math.min(ROUNDS_PER_GAME, allRounds.length));
  currentRoundIndex = 0;
  totalScore = 0;
  roundScores = [];

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

  resetForNextRound();
  guessedCountryId = null;
  gameState = 'PLAYING_COUNTRY';
  $('#btn-confirm').disabled = true;
  $('#btn-confirm').textContent = 'Confirm Region';
  $('#selected-info').classList.add('hidden');
  $('#phase-indicator').textContent = 'Select a country';
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

  // Score — BRUTAL scoring system
  // Perfect = exact subdivision match
  // Same country, neighbor region = decent
  // Same country, far region = low
  // Wrong country = almost nothing
  let score = 0;
  if (guessedSubId === correctSubId) {
    score = MAX_SCORE_PER_ROUND; // 5000 — only exact match
  } else {
    const sameCountry = guessedInfo?.countryId === correctInfo?.countryId;
    if (sameCountry) {
      // Same country — score with harsh exponent (12 like CubanGuesser municipalities)
      const cc = getCountry(guessedInfo.countryId);
      const maxD = estimateSize(cc);
      const norm = Math.min(distKm / maxD, 1);
      score = Math.round(MAX_SCORE_PER_ROUND * Math.pow(1 - norm, 12));
      // No minimum — if you're far within the country, you get almost nothing
    } else {
      // Wrong country — practically zero
      // Only get something if very close (border region)
      const norm = Math.min(distKm / 20000, 1);
      score = Math.round(MAX_SCORE_PER_ROUND * 0.05 * Math.pow(1 - norm, 6));
    }
  }

  roundScores.push(score);
  totalScore += score;

  // Sound & highlight
  if (score === MAX_SCORE_PER_ROUND) { playSound('perfect'); highlightCorrect(guessedSubId); }
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
  $('#result-distance').textContent = isPerfect ? 'Nailed it!' : `${distText} away`;
  $('#phase-indicator').classList.add('hidden');

  showModal('modal-result');
  $('#score-display').textContent = `${totalScore.toLocaleString()} pts`;
}

function estimateSize(c) {
  if (!c) return 1500;
  const s = {us:4500,ca:5500,mx:3000,cu:1000,br:4300,ar:3500,co:1600,cl:4300,pe:1800,es:1200,fr:1000,de:900,it:1100,gb:800,jp:1500,kr:500,cn:5000,in:3000,au:4000,ru:9000,tr:1600};
  return s[c.id] || 1500;
}

function nextRound() {
  hideModal('modal-result');
  currentRoundIndex++;
  if (currentRoundIndex >= dailyRounds.length) endGame();
  else startRound();
}

function endGame() {
  gameState = 'OVER';
  playSound('gameover');
  incrementDailyPlays();
  const s = getLocalStats();
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
  saveLocalStats(s);
  const li = getLevelProgress(s.totalScore);
  $('#gameover-score').textContent = `${totalScore.toLocaleString()} pts`;
  $('#gameover-xp').textContent = `+${scoreToXP(totalScore)} XP`;
  $('#gameover-level').innerHTML = `${li.current.icon} ${li.current.name}`;
  $('#gameover-breakdown').innerHTML = roundScores.map((x, i) =>
    `<div class="breakdown-row"><span>Round ${i+1}</span><span class="${x===MAX_SCORE_PER_ROUND?'perfect':x>4000?'good':x>2500?'ok':'bad'}">${x.toLocaleString()}</span></div>`
  ).join('');
  showModal('modal-gameover');
  checkAchievements(s, roundScores);
  const lv = getLevel(s.totalScore);
  $('#level-icon').textContent = lv.icon;
  $('#level-name').textContent = lv.name;
}

function shareResults() {
  const e = roundScores.map(x => x===MAX_SCORE_PER_ROUND?'🎯':x>4000?'🟢':x>2500?'🟡':'🔴').join('');
  const t = `PinTheWorld 🌍\n${e}\nScore: ${totalScore.toLocaleString()} / ${MAX_SCORE_PER_ROUND*dailyRounds.length}\npintheworld.com`;
  if (navigator.share) navigator.share({text:t}).catch(()=>{});
  else navigator.clipboard.writeText(t).then(()=>showToast('Copied!'));
}

// ---- Load rounds from Supabase (fallback to demo) ----
async function loadRounds(mode) {
  // Try Supabase first
  if (!isDemoMode && supabase) {
    try {
      const { data, error } = await supabase
        .from('rounds')
        .select('*')
        .eq('mode', mode)
        .eq('active', true);
      if (!error && data && data.length >= 5) {
        return data.map(r => ({
          id: r.id,
          lat: 0, lng: 0, // We use subdivision centroid for scoring
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

  // Also check localStorage for admin-created rounds
  const localActive = JSON.parse(localStorage.getItem('ptw_active_rounds') || '[]');
  if (localActive.length >= 5) {
    return localActive.filter(r => r.mode === mode || !r.mode).map(r => ({
      id: r.id, lat: r.lat || 0, lng: r.lng || 0,
      locationName: r.locationName || r.subdivision_name || '?',
      country: r.countryName || r.country_name || '?',
      countryId: r.countryId || r.country_id,
      subdivisionId: r.subdivisionId || r.subdivision_id,
      mode: mode, photoUrl: r.photoUrl || r.photo_url,
      isPromo: r.isPromo || r.is_promo,
      promoData: r.promoData || r.promo_data,
    }));
  }

  // Fallback to demo
  return getDemoRounds(mode);
}

function getDemoRounds(mode) {
  return [
    {lat:48.8584,lng:2.2945,locationName:'Eiffel Tower, Paris',country:'France',countryId:'fr'},
    {lat:40.6892,lng:-74.0445,locationName:'Statue of Liberty',country:'USA',countryId:'us'},
    {lat:27.1751,lng:78.0421,locationName:'Taj Mahal',country:'India',countryId:'in'},
    {lat:-22.9519,lng:-43.2105,locationName:'Christ the Redeemer',country:'Brazil',countryId:'br'},
    {lat:41.8902,lng:12.4922,locationName:'Colosseum',country:'Italy',countryId:'it'},
    {lat:51.5014,lng:-0.1419,locationName:'Big Ben',country:'UK',countryId:'gb'},
    {lat:35.6762,lng:139.6503,locationName:'Tokyo Tower',country:'Japan',countryId:'jp'},
    {lat:-33.8568,lng:151.2153,locationName:'Sydney Opera House',country:'Australia',countryId:'au'},
    {lat:29.9792,lng:31.1342,locationName:'Great Pyramid',country:'Egypt',countryId:'eg'},
    {lat:37.9715,lng:23.7257,locationName:'Acropolis',country:'Greece',countryId:'gr'},
    {lat:40.4319,lng:-3.6753,locationName:'Santiago Bernabeu',country:'Spain',countryId:'es'},
    {lat:21.4225,lng:-77.9910,locationName:'Trinidad',country:'Cuba',countryId:'cu'},
    {lat:19.4326,lng:-99.1332,locationName:'Zocalo',country:'Mexico',countryId:'mx'},
    {lat:55.7539,lng:37.6208,locationName:'Red Square',country:'Russia',countryId:'ru'},
    {lat:-34.6037,lng:-58.3816,locationName:'Obelisco',country:'Argentina',countryId:'ar'},
    {lat:25.1972,lng:55.2744,locationName:'Burj Khalifa',country:'UAE',countryId:'ae'},
    {lat:-13.1631,lng:-72.5450,locationName:'Machu Picchu',country:'Peru',countryId:'pe'},
    {lat:52.5200,lng:13.4050,locationName:'Brandenburg Gate',country:'Germany',countryId:'de'},
    {lat:4.7110,lng:-74.0721,locationName:'Bogota',country:'Colombia',countryId:'co'},
    {lat:37.5665,lng:126.9780,locationName:'Seoul',country:'South Korea',countryId:'kr'},
    {lat:23.1136,lng:-82.3666,locationName:'Havana',country:'Cuba',countryId:'cu'},
    {lat:13.7563,lng:100.5018,locationName:'Bangkok',country:'Thailand',countryId:'th'},
    {lat:59.3293,lng:18.0686,locationName:'Stockholm',country:'Sweden',countryId:'se'},
    {lat:38.7223,lng:-9.1393,locationName:'Lisbon',country:'Portugal',countryId:'pt'},
    {lat:-1.2921,lng:36.8219,locationName:'Nairobi',country:'Kenya',countryId:'ke'},
    {lat:39.9042,lng:116.4074,locationName:'Forbidden City',country:'China',countryId:'cn'},
    {lat:43.7230,lng:10.3966,locationName:'Tower of Pisa',country:'Italy',countryId:'it'},
    {lat:48.2082,lng:16.3738,locationName:'Vienna',country:'Austria',countryId:'at'},
    {lat:50.8503,lng:4.3517,locationName:'Brussels',country:'Belgium',countryId:'be'},
    {lat:31.7683,lng:35.2137,locationName:'Jerusalem',country:'Israel',countryId:'il'},
  ].map((l,i) => ({...l, id:`d${i}`, mode, photoUrl:`https://picsum.photos/seed/${l.locationName.replace(/[^a-z]/gi,'')}/600/400`, isPromo:false}));
}

function getDailyPlays() { try { const d=JSON.parse(localStorage.getItem(`ptw_plays_${gameMode}`)); return d?.date===new Date().toDateString()?d.count:0; } catch{return 0;} }
function incrementDailyPlays() { localStorage.setItem(`ptw_plays_${gameMode}`, JSON.stringify({date:new Date().toDateString(),count:getDailyPlays()+1})); }
function getLocalStats() { try{return JSON.parse(localStorage.getItem('ptw_stats'))||{};}catch{return {};} }
function saveLocalStats(s) { localStorage.setItem('ptw_stats',JSON.stringify(s)); }

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
      $('#phase-indicator').textContent = 'Select a country';
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
    const s=getLocalStats(),l=getLevel(s.totalScore||0),u=getCurrentUser();
    $('#profile-content').innerHTML=`<div class="profile-avatar">${l.icon}</div><h3>${u?.displayName||'Guest'}</h3><div class="profile-level">${l.icon} ${l.name}</div><div class="profile-stats"><div><strong>${(s.totalGames||0).toLocaleString()}</strong><br>Games</div><div><strong>${(s.totalScore||0).toLocaleString()}</strong><br>Score</div><div><strong>${s.streak||0}</strong><br>Streak</div><div><strong>${s.perfectGuesses||0}</strong><br>Perfects</div></div>`;
    showModal('modal-profile');
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
      localStorage.setItem('ptw_lang', langSelect.value);
      // TODO: apply translations
    };
  }

  gameMode='places';
}

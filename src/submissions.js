/* Level Creator — Wizard (4 steps) + Promo system */

import L from 'leaflet';
import { getCountry } from './countries/index.js';
import { playSound } from './sounds.js';
import { supabase, isDemoMode } from './supabase.js';
import { getCurrentUser } from './auth.js';
import { payPromo } from './payments.js';

let submitMap = null;
let countriesLayer = null;
let subdivisionsLayer = null;
let selectedCountryId = null;
let selectedSubId = null;
let selectedSubName = null;
let selectedCountryName = null;
let selectedFile = null;
let photoDataUrl = null;
let submitMode = 'places';
let isPromo = false;
let currentWizardStep = 1;

const $ = sel => document.querySelector(sel);
const geoJsonCache = new Map();

// ---- Init ----
export function initSubmitScreen() {
  selectedCountryId = null;
  selectedSubId = null;
  selectedFile = null;
  photoDataUrl = null;
  isPromo = false;
  currentWizardStep = 1;

  goToStep(1);
  bindWizardEvents();
  updateModeTexts();
  updatePromoPrice();
}

// ---- Wizard navigation ----
function goToStep(step) {
  currentWizardStep = step;
  document.querySelectorAll('.wizard-page').forEach(p => p.classList.remove('active'));
  $(`#wizard-step-${step}`)?.classList.add('active');

  // Update progress bar
  document.querySelectorAll('.wizard-step').forEach(s => {
    const n = parseInt(s.dataset.step);
    s.classList.remove('active', 'done');
    if (n === step) s.classList.add('active');
    else if (n < step) s.classList.add('done');
  });

  // Init map on step 2
  if (step === 2 && !submitMap) {
    setTimeout(() => initSubmitMap(), 50);
  } else if (step === 2 && submitMap) {
    setTimeout(() => submitMap.invalidateSize(), 50);
  }

  // Build final preview on step 4
  if (step === 4) buildFinalPreview();
}

function bindWizardEvents() {
  // Photo
  const fileInput = $('#photo-input');
  const photoUpload = $('#photo-upload');
  const preview = $('#photo-preview');

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showStatus('Photo must be under 5MB', 'error'); return; }
    selectedFile = file;
    photoUpload.classList.add('has-file');
    const reader = new FileReader();
    reader.onload = (ev) => {
      preview.src = ev.target.result;
      photoDataUrl = ev.target.result;
      const pp = $('#promo-preview-photo');
      const np = $('#promo-preview-no-photo');
      if (pp) { pp.src = ev.target.result; pp.style.display = 'block'; }
      if (np) np.style.display = 'none';
    };
    reader.readAsDataURL(file);
    checkStep1();
  };

  $('#photo-url').oninput = () => {
    if ($('#photo-url').value.trim()) {
      selectedFile = null;
      photoUpload.classList.remove('has-file');
      photoDataUrl = $('#photo-url').value.trim();
    }
    checkStep1();
  };

  // Mode buttons
  document.querySelectorAll('.submit-mode-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.submit-mode-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      submitMode = btn.dataset.mode;
      updateModeTexts();
      updatePromoPrice();
    };
  });

  // Step navigation
  $('#wizard-next-1').onclick = () => goToStep(2);
  $('#wizard-back-2').onclick = () => goToStep(1);
  $('#wizard-next-2').onclick = () => goToStep(3);
  $('#wizard-back-3').onclick = () => goToStep(2);
  $('#wizard-next-3').onclick = () => goToStep(4);
  $('#wizard-skip-3').onclick = () => {
    isPromo = false;
    $('#promo-toggle').checked = false;
    $('#promo-section').classList.add('hidden');
    goToStep(4);
  };
  $('#wizard-back-4').onclick = () => goToStep(3);

  // Promo toggle
  $('#promo-toggle').checked = false;
  $('#promo-section').classList.add('hidden');
  $('#promo-toggle').onchange = () => {
    isPromo = $('#promo-toggle').checked;
    if (isPromo) {
      $('#promo-section').classList.remove('hidden');
      $('#btn-submit-level').textContent = 'Submit & Pay';
    } else {
      $('#promo-section').classList.add('hidden');
      $('#btn-submit-level').textContent = 'Submit Level (Free)';
    }
  };

  // Promo live preview
  $('#promo-name-input').oninput = () => { $('#promo-preview-name').textContent = $('#promo-name-input').value || 'Your Name'; };
  $('#promo-bio-input').oninput = () => {
    const v = $('#promo-bio-input').value;
    $('#promo-preview-bio').textContent = v || 'Description...';
    $('#promo-bio-count').textContent = `${v.length} / 150`;
  };
  ['promo-instagram', 'promo-whatsapp', 'promo-telegram', 'promo-website', 'promo-phone'].forEach(id => {
    const el = $(`#${id}`);
    if (el) el.oninput = updatePreviewLinks;
  });

  // Submit
  $('#btn-submit-level').onclick = submitLevel;
}

function checkStep1() {
  const hasPhoto = selectedFile || $('#photo-url').value.trim();
  $('#wizard-next-1').disabled = !hasPhoto;
}

// ---- Map (step 2) ----
function initSubmitMap() {
  if (submitMap) { submitMap.remove(); submitMap = null; }

  submitMap = L.map('submit-map', {
    center: [20, 0], zoom: 2, minZoom: 2, maxZoom: 18,
    zoomControl: false, attributionControl: false, worldCopyJump: true,
  });
  L.control.zoom({ position: 'bottomright' }).addTo(submitMap);
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18 }).addTo(submitMap);
  setTimeout(() => submitMap.invalidateSize(), 100);

  loadCountriesForSubmit();
}

async function loadCountriesForSubmit() {
  const data = await loadGeoJSON('/geojson/world-countries.geojson');
  if (!data || !submitMap) return;
  countriesLayer = L.geoJSON(data, {
    style: () => ({ fillColor: 'transparent', fillOpacity: 0, color: 'rgba(255,255,255,0.2)', weight: 0.6 }),
    onEachFeature: (feature, layer) => {
      const name = feature.properties.name || '';
      const iso = (feature.properties.iso_a2 || '').toLowerCase();
      layer.bindTooltip(name, { sticky: true, className: 'country-tooltip', direction: 'top', offset: [0, -8] });
      layer.on('mouseover', () => layer.setStyle({ fillColor: '#f59e0b', fillOpacity: 0.12, weight: 1.2, color: 'rgba(245,158,11,0.5)' }));
      layer.on('mouseout', () => countriesLayer.resetStyle(layer));
      layer.on('click', () => {
        selectedCountryId = iso;
        const c = getCountry(iso);
        selectedCountryName = c ? c.name : name;
        loadSubdivisionsForSubmit(iso);
      });
    },
  }).addTo(submitMap);
}

async function loadSubdivisionsForSubmit(countryId) {
  if (subdivisionsLayer) { submitMap.removeLayer(subdivisionsLayer); subdivisionsLayer = null; }
  selectedSubId = null;
  selectedSubName = null;
  $('#wizard-next-2').disabled = true;

  if (countriesLayer) countriesLayer.setStyle({ fillColor: 'transparent', fillOpacity: 0, color: 'rgba(255,255,255,0.06)', weight: 0.3 });

  const data = await loadGeoJSON(`/geojson/${countryId}-subdivisions.geojson`);
  if (!data || !submitMap) return;

  const cc = getCountry(countryId);
  const cName = cc ? cc.name : countryId.toUpperCase();
  const cFlag = cc ? cc.flag : '';

  subdivisionsLayer = L.geoJSON(data, {
    style: () => ({ fillColor: 'transparent', fillOpacity: 0, color: 'rgba(255,255,255,0.2)', weight: 0.7 }),
    onEachFeature: (feature, layer) => {
      const name = feature.properties.name || '';
      const id = feature.properties.id || name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      layer.bindTooltip(`${name}, ${cFlag} ${cName}`, { sticky: true, className: 'subdivision-tooltip', direction: 'top', offset: [0, -8] });
      layer.on('mouseover', () => { if (selectedSubId !== id) layer.setStyle({ fillColor: '#f59e0b', fillOpacity: 0.1, weight: 1.2, color: 'rgba(245,158,11,0.45)' }); });
      layer.on('mouseout', () => { if (selectedSubId !== id) layer.setStyle({ fillColor: 'transparent', fillOpacity: 0, color: 'rgba(255,255,255,0.2)', weight: 0.7 }); });
      layer.on('click', () => {
        if (subdivisionsLayer) subdivisionsLayer.setStyle({ fillColor: 'transparent', fillOpacity: 0, color: 'rgba(255,255,255,0.2)', weight: 0.7 });
        selectedSubId = id;
        selectedSubName = name;
        layer.setStyle({ fillColor: '#f59e0b', fillOpacity: 0.2, weight: 2, color: 'rgba(245,158,11,0.7)' });
        $('#submit-location-text').textContent = `${name}, ${cFlag} ${cName}`;
        $('#wizard-next-2').disabled = false;
        playSound('select');
      });
    },
  }).addTo(submitMap);
  submitMap.fitBounds(subdivisionsLayer.getBounds(), { padding: [30, 30], animate: true });
  $('#submit-location-text').textContent = `${cFlag} ${cName} — select a region`;
}

// ---- Mode texts ----
function updateModeTexts() {
  const isPeople = submitMode === 'people';
  $('#submit-mode-hint').textContent = isPeople ? 'Find your match — Cupido style' : 'Promote a business or place';
  $('#promo-toggle-text').textContent = isPeople ? 'Promote yourself — Cupido' : 'Promote your business';
  $('#promo-header-text').textContent = isPeople ? 'Your Cupido profile appears when players guess your location' : 'Your business ad appears when players guess this location';
  $('#promo-name-label').textContent = isPeople ? 'Your name *' : 'Business name *';
  $('#promo-name-input').placeholder = isPeople ? 'Your name' : 'Your business name';
  $('#promo-bio-label').textContent = isPeople ? 'About you *' : 'Description *';
  $('#promo-bio-input').placeholder = isPeople ? 'Tell people about yourself...' : 'Tell people about your business...';
  const tg = $('#field-telegram');
  if (tg) tg.classList.toggle('hidden', !isPeople);
  const card = $('#promo-preview-card');
  if (card) card.classList.toggle('cupido-card', isPeople);
  // Update photo upload area shape
  const upload = $('#photo-upload');
  if (upload) upload.classList.toggle('mode-people', isPeople);
}

function updatePromoPrice() {
  const isPeople = submitMode === 'people';
  $('#promo-price').textContent = isPeople ? '$6.99 USD' : '$29.99 USD';
}

function updatePreviewLinks() {
  const links = [];
  const ig = $('#promo-instagram').value.trim();
  const wa = $('#promo-whatsapp').value.trim();
  const tg = $('#promo-telegram')?.value.trim();
  const web = $('#promo-website').value.trim();
  const ph = $('#promo-phone').value.trim();
  if (ig) links.push(`<span>📸 ${ig}</span>`);
  if (wa) links.push(`<span>💬 WhatsApp</span>`);
  if (tg) links.push(`<span>✈️ ${tg}</span>`);
  if (web) links.push(`<span>🌐 Website</span>`);
  if (ph) links.push(`<span>📞 ${ph}</span>`);
  $('#promo-preview-links').innerHTML = links.join('') || '<span style="opacity:0.4">Add social links...</span>';
}

// ---- Final preview (step 4) ----
function buildFinalPreview() {
  const photoSrc = photoDataUrl || $('#photo-url').value.trim() || '';
  $('#final-preview-photo').src = photoSrc;
  const cc = getCountry(selectedCountryId);
  const cFlag = cc ? cc.flag : '';
  const cName = cc ? cc.name : selectedCountryId || '?';
  $('#final-preview-location').textContent = `${selectedSubName || '?'}, ${cFlag} ${cName}`;
  $('#final-preview-mode').textContent = submitMode === 'people' ? 'Person / Cupido' : 'Place / Business';
  $('#final-preview-submitter').textContent = `by ${$('#submit-name').value.trim() || 'Anonymous'}`;

  // Promo preview
  if (isPromo) {
    $('#final-promo-preview').classList.remove('hidden');
    $('#btn-submit-level').textContent = submitMode === 'people' ? 'Submit & Pay $6.99' : 'Submit & Pay $29.99';
  } else {
    $('#final-promo-preview').classList.add('hidden');
    $('#btn-submit-level').textContent = 'Submit Level (Free)';
  }
}

// ---- Submit ----
async function submitLevel() {
  const btn = $('#btn-submit-level');
  btn.disabled = true;
  btn.textContent = 'Uploading...';

  try {
    let photoUrl = '';
    if (selectedFile) {
      photoUrl = await uploadPhoto(selectedFile);
      if (!photoUrl) { showStatus('Failed to upload photo', 'error'); btn.disabled = false; return; }
    } else {
      photoUrl = $('#photo-url').value.trim();
    }

    const user = getCurrentUser();
    const cc = getCountry(selectedCountryId);

    const round = {
      country_id: selectedCountryId,
      country_name: cc ? cc.name : selectedCountryName,
      subdivision_id: `${selectedCountryId}_${selectedSubId}`,
      subdivision_name: selectedSubName,
      mode: submitMode,
      photo_url: photoUrl,
      difficulty: 'medium',
      is_promo: isPromo,
      submitter_name: $('#submit-name').value.trim() || 'Anonymous',
      submitter_id: (user && !user.isGuest) ? user.id : null,
      status: isPromo ? 'pending_payment' : 'pending',
    };

    if (isPromo) {
      round.promo_data = {
        name: $('#promo-name-input').value.trim(),
        bio: $('#promo-bio-input').value.trim(),
        instagram: $('#promo-instagram').value.trim(),
        whatsapp: $('#promo-whatsapp').value.trim(),
        telegram: $('#promo-telegram')?.value.trim() || '',
        website: $('#promo-website').value.trim(),
        phone: $('#promo-phone').value.trim(),
      };
    }

    if (!isDemoMode && supabase) {
      const { data: inserted, error } = await supabase.from('pending_rounds').insert(round).select().single();
      if (error) { showStatus(`Error: ${error.message}`, 'error'); btn.disabled = false; return; }

      // If promo, redirect to Stripe checkout
      if (isPromo && inserted?.id) {
        btn.textContent = 'Redirecting to payment...';
        const paid = await payPromo(submitMode, inserted.id);
        if (!paid) {
          showStatus('Could not start payment. Your submission is saved — you can pay later.', 'error');
          btn.disabled = false;
          btn.textContent = 'Retry Payment';
          return;
        }
        return; // User is redirected to Stripe
      }
    } else {
      const pending = JSON.parse(localStorage.getItem('ptw_pending_rounds') || '[]');
      round.id = `user_${Date.now()}`;
      round.created_at = new Date().toISOString();
      pending.push(round);
      localStorage.setItem('ptw_pending_rounds', JSON.stringify(pending));
    }

    const stats = JSON.parse(localStorage.getItem('ptw_stats') || '{}');
    stats.totalSubmissions = (stats.totalSubmissions || 0) + 1;
    localStorage.setItem('ptw_stats', JSON.stringify(stats));

    playSound('perfect');
    showStatus('Level submitted! Thank you!', 'success');
    btn.textContent = 'Submitted!';

  } catch (e) {
    console.error('Submit error:', e);
    showStatus('Something went wrong. Try again.', 'error');
    btn.disabled = false;
  }
}

async function uploadPhoto(file) {
  if (!supabase || isDemoMode) {
    return new Promise(r => { const fr = new FileReader(); fr.onload = e => r(e.target.result); fr.readAsDataURL(file); });
  }
  const ext = file.name.split('.').pop().toLowerCase();
  const path = `submissions/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('photos').upload(path, file, { contentType: file.type });
  if (error) return null;
  return supabase.storage.from('photos').getPublicUrl(path).data.publicUrl;
}

function showStatus(msg, type) {
  const el = $('#submit-status');
  el.textContent = msg;
  el.className = 'submit-status' + (type ? ' ' + type : '');
}

export function destroySubmitScreen() {
  if (submitMap) { submitMap.remove(); submitMap = null; }
  countriesLayer = null;
  subdivisionsLayer = null;
}

async function loadGeoJSON(url) {
  if (geoJsonCache.has(url)) return geoJsonCache.get(url);
  try { const r = await fetch(url); if (!r.ok) return null; const d = await r.json(); geoJsonCache.set(url, d); return d; } catch { return null; }
}

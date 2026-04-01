/* Level Creator / Submissions — with Promo system + Supabase */

import L from 'leaflet';
import { getCountry } from './countries/index.js';
import { playSound } from './sounds.js';
import { supabase, isDemoMode } from './supabase.js';
import { getCurrentUser } from './auth.js';

let submitMap = null;
let countriesLayer = null;
let subdivisionsLayer = null;
let selectedCountryId = null;
let selectedSubId = null;
let selectedSubName = null;
let selectedCountryName = null;
let selectedFile = null;
let submitMode = 'places';
let isPromo = false;

const $ = sel => document.querySelector(sel);
const geoJsonCache = new Map();

// ---- Init Submit Screen ----
export function initSubmitScreen() {
  if (submitMap) { submitMap.remove(); submitMap = null; }
  selectedCountryId = null;
  selectedSubId = null;
  selectedFile = null;
  isPromo = false;

  // Map
  submitMap = L.map('submit-map', {
    center: [20, 0], zoom: 2, minZoom: 2, maxZoom: 18,
    zoomControl: false, attributionControl: false, worldCopyJump: true,
  });
  L.control.zoom({ position: 'bottomright' }).addTo(submitMap);
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18 }).addTo(submitMap);
  setTimeout(() => submitMap.invalidateSize(), 100);

  loadCountriesForSubmit();

  // Photo upload
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
      // Update promo preview photo
      const promoPhoto = $('#promo-preview-photo');
      const noPhoto = $('#promo-preview-no-photo');
      if (promoPhoto) { promoPhoto.src = ev.target.result; promoPhoto.style.display = 'block'; }
      if (noPhoto) noPhoto.style.display = 'none';
    };
    reader.readAsDataURL(file);
    checkReady();
  };

  $('#photo-url').oninput = () => {
    if ($('#photo-url').value.trim()) { selectedFile = null; photoUpload.classList.remove('has-file'); }
    checkReady();
  };

  // Mode buttons — update promo text based on mode
  document.querySelectorAll('.submit-mode-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.submit-mode-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      submitMode = btn.dataset.mode;
      updateModeTexts();
    };
  });
  updateModeTexts();

  // Promo toggle
  $('#promo-toggle').checked = false;
  $('#promo-section').classList.add('hidden');
  $('#promo-toggle').onchange = () => {
    isPromo = $('#promo-toggle').checked;
    if (isPromo) {
      $('#promo-section').classList.remove('hidden');
      // Set price based on selected country
      updatePromoPrice();
      $('#btn-submit-level').textContent = 'Submit & Pay';
    } else {
      $('#promo-section').classList.add('hidden');
      $('#btn-submit-level').textContent = 'Submit Level (Free)';
    }
    checkReady();
  };

  // Promo live preview
  $('#promo-name-input').oninput = () => {
    $('#promo-preview-name').textContent = $('#promo-name-input').value || 'Your Business';
    checkReady();
  };
  $('#promo-bio-input').oninput = () => {
    const val = $('#promo-bio-input').value;
    $('#promo-preview-bio').textContent = val || 'Your description here...';
    $('#promo-bio-count').textContent = `${val.length} / 150`;
    checkReady();
  };

  // Update preview links on any social input change
  ['promo-instagram', 'promo-whatsapp', 'promo-telegram', 'promo-website', 'promo-phone'].forEach(id => {
    const el = $(`#${id}`);
    if (el) el.oninput = updatePreviewLinks;
  });

  // Submit button
  $('#btn-submit-level').onclick = submitLevel;

  // Set initial price
  updatePromoPrice();
}

function updateModeTexts() {
  const isPeople = submitMode === 'people';
  $('#submit-mode-hint').textContent = isPeople
    ? 'Find your match — Cupido style'
    : 'Promote a business or place';
  $('#promo-toggle-text').textContent = isPeople
    ? 'Promote yourself — Cupido'
    : 'Promote your business';
  $('#promo-header-text').textContent = isPeople
    ? 'Your Cupido profile will appear when players guess your location'
    : 'Your business ad will appear when players guess this location';
  $('#promo-name-label').textContent = isPeople ? 'Your name *' : 'Business name *';
  $('#promo-name-input').placeholder = isPeople ? 'Your name' : 'Your business name';
  $('#promo-bio-label').textContent = isPeople ? 'About you *' : 'Description *';
  $('#promo-bio-input').placeholder = isPeople
    ? 'Tell people about yourself, what you\'re looking for...'
    : 'Tell people about your business...';
  // Show telegram field for people, hide for places
  const tgField = $('#field-telegram');
  if (tgField) tgField.classList.toggle('hidden', !isPeople);
  // Update preview card style
  const card = $('#promo-preview-card');
  if (card) card.classList.toggle('cupido-card', isPeople);
}

function updatePromoPrice() {
  if (!selectedCountryId) {
    $('#promo-price').textContent = '$6.99 USD';
    return;
  }
  const c = getCountry(selectedCountryId);
  if (c) {
    const price = (c.promoPrice / 100).toFixed(2);
    const curr = c.currency.toUpperCase();
    $('#promo-price').textContent = `${price} ${curr}`;
  } else {
    $('#promo-price').textContent = '$6.99 USD';
  }
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

// ---- Load countries on submit map ----
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
        updatePromoPrice();
      });
    },
  }).addTo(submitMap);
}

// ---- Load subdivisions ----
async function loadSubdivisionsForSubmit(countryId) {
  if (subdivisionsLayer) { submitMap.removeLayer(subdivisionsLayer); subdivisionsLayer = null; }
  selectedSubId = null;
  selectedSubName = null;

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

      layer.on('mouseover', () => {
        if (selectedSubId !== id) layer.setStyle({ fillColor: '#f59e0b', fillOpacity: 0.1, weight: 1.2, color: 'rgba(245,158,11,0.45)' });
      });
      layer.on('mouseout', () => {
        if (selectedSubId !== id) layer.setStyle({ fillColor: 'transparent', fillOpacity: 0, color: 'rgba(255,255,255,0.2)', weight: 0.7 });
      });
      layer.on('click', () => {
        if (subdivisionsLayer) subdivisionsLayer.setStyle({ fillColor: 'transparent', fillOpacity: 0, color: 'rgba(255,255,255,0.2)', weight: 0.7 });
        selectedSubId = id;
        selectedSubName = name;
        layer.setStyle({ fillColor: '#f59e0b', fillOpacity: 0.2, weight: 2, color: 'rgba(245,158,11,0.7)' });

        const locEl = $('#submit-location');
        $('#submit-location-text').textContent = `${name}, ${cFlag} ${cName}`;
        locEl.classList.add('has-location');
        playSound('select');
        checkReady();
      });
    },
  }).addTo(submitMap);

  submitMap.fitBounds(subdivisionsLayer.getBounds(), { padding: [30, 30], animate: true });
  $('#submit-location-text').textContent = `${cFlag} ${cName} — select a region`;
}

// ---- Check if ready to submit ----
function checkReady() {
  const hasPhoto = selectedFile || $('#photo-url').value.trim();
  const hasLocation = selectedSubId;

  if (isPromo) {
    const hasName = $('#promo-name-input').value.trim();
    const hasBio = $('#promo-bio-input').value.trim();
    const hasSocial = $('#promo-instagram').value.trim() || $('#promo-whatsapp').value.trim() || $('#promo-website').value.trim() || $('#promo-phone').value.trim();
    $('#btn-submit-level').disabled = !(hasPhoto && hasLocation && hasName && hasBio && hasSocial);
  } else {
    $('#btn-submit-level').disabled = !(hasPhoto && hasLocation);
  }
}

// ---- Submit ----
async function submitLevel() {
  const btn = $('#btn-submit-level');
  btn.disabled = true;
  btn.textContent = 'Uploading...';
  showStatus('', '');

  try {
    // 1. Upload photo
    let photoUrl = '';
    if (selectedFile) {
      photoUrl = await uploadPhoto(selectedFile);
      if (!photoUrl) { showStatus('Failed to upload photo', 'error'); btn.disabled = false; btn.textContent = isPromo ? 'Submit & Pay' : 'Submit Level (Free)'; return; }
    } else {
      photoUrl = $('#photo-url').value.trim();
      if (!photoUrl) { showStatus('Add a photo', 'error'); btn.disabled = false; return; }
    }

    const user = getCurrentUser();
    const submitterName = $('#submit-name').value.trim() || 'Anonymous';
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
      submitter_name: submitterName,
      submitter_id: (user && !user.isGuest) ? user.id : null,
      status: isPromo ? 'pending_payment' : 'pending',
    };

    // Add promo data
    if (isPromo) {
      round.promo_data = {
        name: $('#promo-name-input').value.trim(),
        bio: $('#promo-bio-input').value.trim(),
        instagram: $('#promo-instagram').value.trim(),
        whatsapp: $('#promo-whatsapp').value.trim(),
        website: $('#promo-website').value.trim(),
        phone: $('#promo-phone').value.trim(),
      };
    }

    // 2. Save to Supabase or localStorage
    if (!isDemoMode && supabase) {
      const { error } = await supabase.from('pending_rounds').insert(round);
      if (error) { showStatus(`Error: ${error.message}`, 'error'); btn.disabled = false; return; }
    } else {
      // Fallback localStorage
      const pending = JSON.parse(localStorage.getItem('ptw_pending_rounds') || '[]');
      round.id = `user_${Date.now()}`;
      round.created_at = new Date().toISOString();
      pending.push(round);
      localStorage.setItem('ptw_pending_rounds', JSON.stringify(pending));
    }

    // Update local stats
    const stats = JSON.parse(localStorage.getItem('ptw_stats') || '{}');
    stats.totalSubmissions = (stats.totalSubmissions || 0) + 1;
    localStorage.setItem('ptw_stats', JSON.stringify(stats));

    playSound('perfect');

    if (isPromo) {
      showStatus('Promo submitted! Payment processing coming soon.', 'success');
    } else {
      showStatus('Level submitted! Thank you for contributing!', 'success');
    }

    setTimeout(resetForm, 2500);

  } catch (e) {
    console.error('Submit error:', e);
    showStatus('Something went wrong. Try again.', 'error');
    btn.disabled = false;
    btn.textContent = isPromo ? 'Submit & Pay' : 'Submit Level (Free)';
  }
}

// ---- Upload photo to Supabase Storage ----
async function uploadPhoto(file) {
  if (!supabase || isDemoMode) {
    // Demo mode — return data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  const ext = file.name.split('.').pop().toLowerCase();
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `submissions/${fileName}`;

  const { data, error } = await supabase.storage.from('photos').upload(filePath, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from('photos').getPublicUrl(filePath);
  return urlData.publicUrl;
}

function resetForm() {
  selectedFile = null;
  selectedSubId = null;
  selectedSubName = null;
  isPromo = false;
  $('#photo-upload').classList.remove('has-file');
  $('#photo-preview').src = '';
  $('#photo-url').value = '';
  $('#photo-input').value = '';
  $('#submit-location-text').textContent = 'Click the map to select country, then region';
  $('#submit-location').classList.remove('has-location');
  $('#submit-name').value = '';
  $('#promo-toggle').checked = false;
  $('#promo-section').classList.add('hidden');
  $('#promo-name-input').value = '';
  $('#promo-bio-input').value = '';
  $('#promo-instagram').value = '';
  $('#promo-whatsapp').value = '';
  $('#promo-website').value = '';
  $('#promo-phone').value = '';
  $('#promo-bio-count').textContent = '0 / 150';
  $('#promo-preview-name').textContent = 'Your Business';
  $('#promo-preview-bio').textContent = 'Your description here...';
  $('#promo-preview-links').textContent = '';
  $('#btn-submit-level').disabled = true;
  $('#btn-submit-level').textContent = 'Submit Level (Free)';
  showStatus('', '');
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

// ---- GeoJSON Loader ----
async function loadGeoJSON(url) {
  if (geoJsonCache.has(url)) return geoJsonCache.get(url);
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const d = await r.json();
    geoJsonCache.set(url, d);
    return d;
  } catch { return null; }
}

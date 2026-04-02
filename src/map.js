/* Map module — Drill-down: Click country → click subdivision */

import L from 'leaflet';
import { getCountry } from './countries/index.js';

let gameMap = null;
let homeMap = null;
let countriesLayer = null;
let subdivisionsLayer = null;
let selectedId = null;
let distanceLine = null;
let labelMarkers = [];
let subdivisionData = {};
let currentPhase = 'world'; // 'world' | 'country'

const geoJsonCache = new Map();

// Random interesting locations for cinematic zoom-out on map load
const ZOOM_SPOTS = [
  [48.86, 2.35],    // Paris
  [40.42, -3.70],   // Madrid
  [41.89, 12.49],   // Rome
  [35.68, 139.69],  // Tokyo
  [40.71, -74.01],  // New York
  [-22.91, -43.17], // Rio
  [29.98, 31.13],   // Pyramids
  [-33.86, 151.21], // Sydney
  [37.97, 23.73],   // Athens
  [55.75, 37.62],   // Moscow
  [25.20, 55.27],   // Dubai
  [-13.16, -72.55], // Machu Picchu
  [27.17, 78.04],   // Taj Mahal
  [51.50, -0.13],   // London
  [52.52, 13.40],   // Berlin
  [19.43, -99.13],  // Mexico City
  [-34.60, -58.38], // Buenos Aires
  [1.35, 103.82],   // Singapore
  [59.33, 18.07],   // Stockholm
  [4.71, -74.07],   // Bogota
];

// ---- Styles ----
const S = {
  countryDefault:  { fillColor: 'transparent', fillOpacity: 0, color: 'rgba(255,255,255,0.2)', weight: 0.6 },
  countryHover:    { fillColor: '#f59e0b', fillOpacity: 0.12, weight: 1.2, color: 'rgba(245,158,11,0.5)' },
  countrySelected: { fillColor: '#f59e0b', fillOpacity: 0.2, weight: 2, color: 'rgba(245,158,11,0.7)' },
  subdivDefault:   { fillColor: 'transparent', fillOpacity: 0, color: 'rgba(255,255,255,0.2)', weight: 0.7 },
  subdivHover:     { fillColor: '#f59e0b', fillOpacity: 0.1, weight: 1.2, color: 'rgba(245,158,11,0.45)' },
  subdivSelected:  { fillColor: '#f59e0b', fillOpacity: 0.2, weight: 2, color: 'rgba(245,158,11,0.7)' },
  correct:         { fillColor: '#10b981', fillOpacity: 0.25, weight: 2.5, color: 'rgba(16,185,129,0.8)' },
  wrong:           { fillColor: '#ef4444', fillOpacity: 0.2, weight: 2, color: 'rgba(239,68,68,0.7)' },
};

// ---- Home Map (decorative, with slow pan) ----
export function initHomeMap(containerId) {
  if (homeMap) {
    homeMap.invalidateSize();
    return homeMap;
  }

  // Start at a random interesting location, zoomed in close
  const spot = ZOOM_SPOTS[Math.floor(Math.random() * ZOOM_SPOTS.length)];
  homeMap = L.map(containerId, {
    center: spot, zoom: 8, minZoom: 2, maxZoom: 18,
    zoomControl: false, attributionControl: false, worldCopyJump: true,
    zoomAnimation: true,
  });
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18 }).addTo(homeMap);
  setTimeout(() => homeMap.invalidateSize(), 100);

  // Slow continuous pan to the left (no zoom out)
  let panInterval = setInterval(() => {
    if (!homeMap) { clearInterval(panInterval); return; }
    homeMap.panBy([1, 0], { animate: false });
  }, 50);

  // Store interval so we can clean up later
  homeMap._panInterval = panInterval;

  return homeMap;
}

// ---- Game Map ----
export function initGameMap(containerId) {
  if (gameMap) { gameMap.remove(); gameMap = null; }
  countriesLayer = null;
  subdivisionsLayer = null;
  selectedId = null;
  subdivisionData = {};
  currentPhase = 'world';

  gameMap = L.map(containerId, {
    center: [20, 0], zoom: 2, minZoom: 2, maxZoom: 18,
    zoomControl: false, attributionControl: false, worldCopyJump: true,
    boxZoom: false,
    preferCanvas: true,
  });
  L.control.zoom({ position: 'bottomright' }).addTo(gameMap);
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18 }).addTo(gameMap);
  setTimeout(() => { if (gameMap) gameMap.invalidateSize(); }, 100);
  return gameMap;
}

// ---- Phase 1: Countries ----
export async function showCountries(onCountryClick) {
  currentPhase = 'world';
  selectedId = null;
  clearSubdivisions();
  clearDistanceLine();
  clearLabels();
  if (gameMap) gameMap.setView([20, 0], 2, { animate: true });

  if (countriesLayer) {
    countriesLayer.setStyle(S.countryDefault);
    return;
  }

  const data = await loadGeoJSON('/geojson/world-countries.geojson');
  if (!data || !gameMap) return;

  countriesLayer = L.geoJSON(data, {
    style: () => S.countryDefault,
    onEachFeature: (feature, layer) => {
      const name = feature.properties.name || '';
      const iso = (feature.properties.iso_a2 || '').toLowerCase();
      layer._fid = iso;
      layer._fname = name;

      layer.bindTooltip(name, { sticky: true, className: 'country-tooltip', direction: 'top', offset: [0, -8] });
      layer.on('mouseover', () => { if (selectedId !== iso) layer.setStyle(S.countryHover); });
      layer.on('mouseout', () => { if (selectedId !== iso) layer.setStyle(currentPhase === 'country' ? { fillColor:'transparent',fillOpacity:0,color:'rgba(255,255,255,0.06)',weight:0.3 } : S.countryDefault); });
      layer.on('click', () => {
        select(iso, countriesLayer, S.countryDefault, S.countrySelected);
        if (onCountryClick) onCountryClick(iso, name);
      });
    },
  }).addTo(gameMap);
}

// ---- Phase 2: Subdivisions ----
export async function showSubdivisions(countryId, onSubdivClick) {
  currentPhase = 'country';
  selectedId = null;
  clearSubdivisions();
  clearDistanceLine();
  clearLabels();
  subdivisionData = {};

  // Dim countries
  if (countriesLayer) countriesLayer.setStyle({ fillColor: 'transparent', fillOpacity: 0, color: 'rgba(255,255,255,0.06)', weight: 0.3 });

  const data = await loadGeoJSON(`/geojson/${countryId}-subdivisions.geojson`);
  if (!data || !gameMap) return;

  const cc = getCountry(countryId);
  const cName = cc ? cc.name : countryId.toUpperCase();
  const cFlag = cc ? cc.flag : '';

  subdivisionsLayer = L.geoJSON(data, {
    style: () => S.subdivDefault,
    onEachFeature: (feature, layer) => {
      const props = feature.properties;
      const name = props.name || props.NAME || '';
      const id = `${countryId}_${props.id || name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      layer._fid = id;
      layer._fname = name;

      const center = layer.getBounds().getCenter();
      subdivisionData[id] = { name, countryId, countryName: cName, lat: center.lat, lng: center.lng };

      layer.bindTooltip(`${name}, ${cFlag} ${cName}`, { sticky: true, className: 'subdivision-tooltip', direction: 'top', offset: [0, -8] });
      layer.on('mouseover', () => { if (currentPhase === 'country' && selectedId !== id) layer.setStyle(S.subdivHover); });
      layer.on('mouseout', () => { if (currentPhase === 'country' && selectedId !== id) layer.setStyle(S.subdivDefault); });
      layer.on('click', () => {
        if (currentPhase !== 'country') return;
        select(id, subdivisionsLayer, S.subdivDefault, S.subdivSelected);
        if (onSubdivClick) onSubdivClick(id, name, countryId);
      });
    },
  }).addTo(gameMap);

  gameMap.fitBounds(subdivisionsLayer.getBounds(), { padding: [30, 30], animate: true });
}

// ---- Selection helpers ----
function select(id, layerGroup, defStyle, selStyle) {
  if (selectedId) layerGroup.eachLayer(l => { if (l._fid === selectedId) l.setStyle(defStyle); });
  selectedId = id;
  layerGroup.eachLayer(l => { if (l._fid === id) l.setStyle(selStyle); });
}

export function getSelectedId() { return selectedId; }
export function getSelectedName() {
  const lg = currentPhase === 'world' ? countriesLayer : subdivisionsLayer;
  let n = ''; if (lg) lg.eachLayer(l => { if (l._fid === selectedId) n = l._fname; }); return n;
}
export function getSubdivisionInfo(id) { return subdivisionData[id] || null; }
export function getAllSubdivisionData() { return subdivisionData; }

// ---- Reveal ----
export function highlightCorrect(id) {
  const lg = currentPhase === 'country' ? subdivisionsLayer : countriesLayer;
  if (lg) lg.eachLayer(l => { if (l._fid === id) l.setStyle(S.correct); });
}
export function highlightWrong(id) {
  const lg = currentPhase === 'country' ? subdivisionsLayer : countriesLayer;
  if (lg) lg.eachLayer(l => { if (l._fid === id) l.setStyle(S.wrong); });
}

export function drawDistanceLine(from, to) {
  clearDistanceLine();
  if (gameMap) distanceLine = L.polyline([from, to], { color: '#f59e0b', dashArray: '10,8', weight: 2.5, opacity: 0.8 }).addTo(gameMap);
}
export function clearDistanceLine() { if (distanceLine && gameMap) { gameMap.removeLayer(distanceLine); distanceLine = null; } }

export function addLabel(ll, text, cls) {
  if (!gameMap) return;
  labelMarkers.push(L.marker(ll, { icon: L.divIcon({ className: cls || 'map-label', html: text, iconSize: null }), zIndexOffset: 800 }).addTo(gameMap));
}
export function clearLabels() { labelMarkers.forEach(m => { if (gameMap) gameMap.removeLayer(m); }); labelMarkers = []; }

export function fitBoth(id1, id2) {
  const lg = subdivisionsLayer || countriesLayer;
  if (!lg || !gameMap) return;
  const b = L.latLngBounds([]);
  lg.eachLayer(l => { if ((l._fid === id1 || l._fid === id2) && l.getBounds) b.extend(l.getBounds()); });
  if (b.isValid()) gameMap.fitBounds(b, { padding: [50, 50], maxZoom: 8 });
}

/** Fit map to show two coordinate points with padding */
export function fitPoints(lat1, lng1, lat2, lng2) {
  if (!gameMap) return;
  const b = L.latLngBounds([[lat1, lng1], [lat2, lng2]]);
  if (b.isValid()) gameMap.fitBounds(b, { padding: [60, 60], maxZoom: 8, animate: true });
}

export function getFeatureCentroid(id) {
  const lg = subdivisionsLayer || countriesLayer;
  let c = null;
  if (lg) lg.eachLayer(l => { if (l._fid === id && l.getBounds) { const ct = l.getBounds().getCenter(); c = { lat: ct.lat, lng: ct.lng }; } });
  return c;
}

// ---- Reset ----
export function resetForNextRound() {
  selectedId = null;
  clearDistanceLine();
  clearLabels();
  clearSubdivisions();
  if (countriesLayer) countriesLayer.setStyle(S.countryDefault);
  currentPhase = 'world';
  if (gameMap) gameMap.setView([20, 0], 2, { animate: true });
}

function clearSubdivisions() {
  if (subdivisionsLayer && gameMap) { gameMap.removeLayer(subdivisionsLayer); subdivisionsLayer = null; }
}

/** Disable/enable map interaction (dragging, zoom, click) */
export function setMapInteractive(enabled) {
  if (!gameMap) return;
  if (enabled) {
    gameMap.dragging.enable();
    gameMap.touchZoom.enable();
    gameMap.doubleClickZoom.enable();
    gameMap.scrollWheelZoom.enable();
    gameMap.boxZoom.enable();
    gameMap.keyboard.enable();
  } else {
    gameMap.dragging.disable();
    gameMap.touchZoom.disable();
    gameMap.doubleClickZoom.disable();
    gameMap.scrollWheelZoom.disable();
    gameMap.boxZoom.disable();
    gameMap.keyboard.disable();
  }
}

export function destroyGameMap() {
  if (gameMap) { gameMap.remove(); gameMap = null; }
  countriesLayer = null; subdivisionsLayer = null; selectedId = null; subdivisionData = {};
}
export function getCurrentPhase() { return currentPhase; }

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

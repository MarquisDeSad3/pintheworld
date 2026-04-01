/**
 * Download & split Natural Earth admin-1 (states/provinces) GeoJSON
 * into per-country files for PinTheWorld.
 *
 * Source: Natural Earth 10m admin-1 states/provinces
 * Run: node scripts/download-subdivisions.js
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const OUT_DIR = 'public/geojson';

// Our country list (ISO A2 codes)
const COUNTRIES = [
  'US','CA','MX','CU','BR','AR','CO','CL','PE','VE','EC','BO','PY','UY','CR','PA','DO','GT','HN','SV','NI','PR','JM','HT','TT',
  'ES','FR','DE','IT','GB','PT','NL','BE','SE','NO','DK','FI','PL','CZ','AT','CH','IE','GR','RO','HU','BG','HR','RS','UA','SK','LT','LV','EE','SI','AL',
  'JP','KR','CN','IN','TH','VN','PH','ID','MY','SG','PK','BD','TW','IL','AE','SA','TR','IR',
  'ZA','NG','EG','KE','ET','GH','TZ','MA','DZ','TN',
  'AU','NZ',
  'RU',
];

const RAW_FILE = path.join(OUT_DIR, 'ne_10m_admin1.geojson');
const SOURCE_URL = 'https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_1_states_provinces.geojson';

// Douglas-Peucker simplification
function douglasPeucker(points, epsilon) {
  if (points.length <= 2) return points;
  let maxDist = 0, maxIdx = 0;
  const start = points[0], end = points[points.length - 1];
  for (let i = 1; i < points.length - 1; i++) {
    const dx = end[0] - start[0], dy = end[1] - start[1];
    const lenSq = dx * dx + dy * dy;
    let dist;
    if (lenSq === 0) {
      dist = Math.sqrt((points[i][0] - start[0]) ** 2 + (points[i][1] - start[1]) ** 2);
    } else {
      const t = Math.max(0, Math.min(1, ((points[i][0] - start[0]) * dx + (points[i][1] - start[1]) * dy) / lenSq));
      const px = start[0] + t * dx, py = start[1] + t * dy;
      dist = Math.sqrt((points[i][0] - px) ** 2 + (points[i][1] - py) ** 2);
    }
    if (dist > maxDist) { maxDist = dist; maxIdx = i; }
  }
  if (maxDist > epsilon) {
    const left = douglasPeucker(points.slice(0, maxIdx + 1), epsilon);
    const right = douglasPeucker(points.slice(maxIdx), epsilon);
    return [...left.slice(0, -1), ...right];
  }
  return [start, end];
}

function simplifyGeometry(geometry, tolerance) {
  if (geometry.type === 'Polygon') {
    return {
      type: 'Polygon',
      coordinates: geometry.coordinates.map(ring =>
        ring.length <= 4 ? ring : douglasPeucker(ring, tolerance)
      ),
    };
  } else if (geometry.type === 'MultiPolygon') {
    return {
      type: 'MultiPolygon',
      coordinates: geometry.coordinates.map(poly =>
        poly.map(ring => ring.length <= 4 ? ring : douglasPeucker(ring, tolerance))
      ),
    };
  }
  return geometry;
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  // Download if not cached
  if (!existsSync(RAW_FILE)) {
    console.log('Downloading Natural Earth admin-1 data (~25MB)...');
    console.log('URL:', SOURCE_URL);
    try {
      execSync(`curl -L -o "${RAW_FILE}" "${SOURCE_URL}"`, { stdio: 'inherit', timeout: 120000 });
    } catch (e) {
      console.error('Download failed. Trying alternative...');
      // Alternative: use a smaller topojson source
      const ALT_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson';
      execSync(`curl -L -o "${RAW_FILE}" "${ALT_URL}"`, { stdio: 'inherit', timeout: 120000 });
    }
  }

  console.log('Reading raw data...');
  const raw = JSON.parse(readFileSync(RAW_FILE, 'utf-8'));
  console.log(`Total features: ${raw.features.length}`);

  // Group features by country ISO code
  const byCountry = {};
  raw.features.forEach(f => {
    const props = f.properties;
    // Try multiple property names for ISO code
    let iso = props.iso_a2 || props.ISO_A2 || '';
    if (iso === '-1' || iso === '' || iso === '-99') {
      // Fallback: derive from admin code
      iso = (props.adm0_a3 || props.ADM0_A3 || '').substring(0, 2);
    }
    // Some special mappings
    if (props.adm0_a3 === 'GBR') iso = 'GB';
    if (props.adm0_a3 === 'FRA') iso = 'FR';
    if (props.adm0_a3 === 'NOR') iso = 'NO';

    iso = iso.toUpperCase();
    if (!COUNTRIES.includes(iso)) return;

    if (!byCountry[iso]) byCountry[iso] = [];
    byCountry[iso].push(f);
  });

  console.log(`Countries matched: ${Object.keys(byCountry).length}`);

  // Write per-country GeoJSON files
  let totalWritten = 0;
  const tolerance = 0.02; // ~2km simplification

  for (const [iso, features] of Object.entries(byCountry)) {
    const simplified = features.map(f => {
      const props = f.properties;
      const name = props.name || props.NAME || props.gn_name || props.name_en || '';
      const id = (props.iso_3166_2 || props.code_hasc || name).toLowerCase().replace(/[^a-z0-9]/g, '_');

      return {
        type: 'Feature',
        properties: {
          id: id,
          name: name,
          name_local: props.name_local || props.name_alt || name,
          type: props.type_en || props.type || 'state',
        },
        geometry: simplifyGeometry(f.geometry, tolerance),
      };
    });

    const geojson = {
      type: 'FeatureCollection',
      features: simplified,
    };

    const filename = `${iso.toLowerCase()}-subdivisions.geojson`;
    const filepath = path.join(OUT_DIR, filename);
    const json = JSON.stringify(geojson);
    writeFileSync(filepath, json);

    const sizeKB = (json.length / 1024).toFixed(0);
    console.log(`  ${iso}: ${features.length} subdivisions (${sizeKB} KB) → ${filename}`);
    totalWritten++;
  }

  // Report missing countries
  const missing = COUNTRIES.filter(c => !byCountry[c]);
  if (missing.length > 0) {
    console.log(`\nMissing countries (${missing.length}): ${missing.join(', ')}`);
  }

  console.log(`\nDone! ${totalWritten} country files written to ${OUT_DIR}/`);
}

main().catch(e => { console.error(e); process.exit(1); });

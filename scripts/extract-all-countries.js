/**
 * Extract subdivisions for ALL countries from Natural Earth data
 * Run: node scripts/extract-all-countries.js
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const OUT_DIR = 'public/geojson';
const RAW_FILE = path.join(OUT_DIR, 'ne_10m_admin1.geojson');

// Douglas-Peucker
function douglasPeucker(points, epsilon) {
  if (points.length <= 2) return points;
  let maxDist = 0, maxIdx = 0;
  const s = points[0], e = points[points.length - 1];
  for (let i = 1; i < points.length - 1; i++) {
    const dx = e[0]-s[0], dy = e[1]-s[1], lenSq = dx*dx+dy*dy;
    let d;
    if (lenSq===0) d = Math.sqrt((points[i][0]-s[0])**2+(points[i][1]-s[1])**2);
    else { const t = Math.max(0,Math.min(1,((points[i][0]-s[0])*dx+(points[i][1]-s[1])*dy)/lenSq)); d = Math.sqrt((points[i][0]-s[0]-t*dx)**2+(points[i][1]-s[1]-t*dy)**2); }
    if (d > maxDist) { maxDist = d; maxIdx = i; }
  }
  if (maxDist > epsilon) {
    const l = douglasPeucker(points.slice(0, maxIdx+1), epsilon);
    const r = douglasPeucker(points.slice(maxIdx), epsilon);
    return [...l.slice(0,-1), ...r];
  }
  return [s, e];
}

function simplifyGeometry(geom, tol) {
  if (geom.type === 'Polygon') return { type:'Polygon', coordinates: geom.coordinates.map(r => r.length<=4?r:douglasPeucker(r,tol)) };
  if (geom.type === 'MultiPolygon') return { type:'MultiPolygon', coordinates: geom.coordinates.map(p => p.map(r => r.length<=4?r:douglasPeucker(r,tol))) };
  return geom;
}

console.log('Reading raw data...');
const raw = JSON.parse(readFileSync(RAW_FILE, 'utf-8'));
console.log(`Total features: ${raw.features.length}`);

// Group by country
const byCountry = {};
raw.features.forEach(f => {
  const p = f.properties;
  let iso = p.iso_a2 || '';
  if (iso === '-1' || iso === '' || iso === '-99') {
    const a3 = p.adm0_a3 || '';
    // Map 3-letter to 2-letter for common cases
    const map3to2 = {GBR:'GB',FRA:'FR',NOR:'NO',USA:'US',CAN:'CA',AUS:'AU',NZL:'NZ',BRA:'BR',ARG:'AR',MEX:'MX',CHL:'CL',COL:'CO',PER:'PE',VEN:'VE',ECU:'EC',BOL:'BO',PRY:'PY',URY:'UY',CUB:'CU',
      ESP:'ES',DEU:'DE',ITA:'IT',PRT:'PT',NLD:'NL',BEL:'BE',SWE:'SE',DNK:'DK',FIN:'FI',POL:'PL',CZE:'CZ',AUT:'AT',CHE:'CH',IRL:'IE',GRC:'GR',ROU:'RO',HUN:'HU',BGR:'BG',HRV:'HR',SRB:'RS',UKR:'UA',SVK:'SK',LTU:'LT',LVA:'LV',EST:'EE',SVN:'SI',ALB:'AL',
      JPN:'JP',KOR:'KR',CHN:'CN',IND:'IN',THA:'TH',VNM:'VN',PHL:'PH',IDN:'ID',MYS:'MY',SGP:'SG',PAK:'PK',BGD:'BD',TWN:'TW',ISR:'IL',ARE:'AE',SAU:'SA',TUR:'TR',IRN:'IR',
      ZAF:'ZA',NGA:'NG',EGY:'EG',KEN:'KE',ETH:'ET',GHA:'GH',TZA:'TZ',MAR:'MA',DZA:'DZ',TUN:'TN',RUS:'RU',
      AFG:'AF',AGO:'AO',ARM:'AM',AZE:'AZ',BLR:'BY',BIH:'BA',BWA:'BW',BRN:'BN',BDI:'BI',KHM:'KH',CMR:'CM',TCD:'TD',CIV:'CI',COD:'CD',COG:'CG',CRI:'CR',CYP:'CY',DJI:'DJ',DOM:'DO',SLV:'SV',GNQ:'GQ',ERI:'ER',FJI:'FJ',GAB:'GA',GMB:'GM',GEO:'GE',GTM:'GT',GIN:'GN',GNB:'GW',GUY:'GY',HTI:'HT',HND:'HN',ISL:'IS',IRQ:'IQ',JAM:'JM',JOR:'JO',KAZ:'KZ',KGZ:'KG',LAO:'LA',LBN:'LB',LBR:'LR',LBY:'LY',LSO:'LS',MDG:'MG',MWI:'MW',MLI:'ML',MRT:'MR',MUS:'MU',MDA:'MD',MNG:'MN',MNE:'ME',MOZ:'MZ',MMR:'MM',NAM:'NA',NPL:'NP',NIC:'NI',NER:'NE',MKD:'MK',OMN:'OM',PAN:'PA',PNG:'PG',QAT:'QA',RWA:'RW',SEN:'SN',SLE:'SL',SOM:'SO',LKA:'LK',SDN:'SD',SSD:'SS',SUR:'SR',SWZ:'SZ',SYR:'SY',TJK:'TJ',TGO:'TG',TTO:'TT',TKM:'TM',UGA:'UG',UZB:'UZ',YEM:'YE',ZMB:'ZM',ZWE:'ZW',PRI:'PR',PSE:'PS',TLS:'TL',BLZ:'BZ',BHS:'BS',BRB:'BB',BTN:'BT',CPV:'CV',COM:'KM',GRL:'GL',KWT:'KW',MLT:'MT',MNP:'MP',GUM:'GU'};
    iso = map3to2[a3] || a3.substring(0,2);
  }
  if (p.adm0_a3 === 'GBR') iso = 'GB';
  if (p.adm0_a3 === 'FRA') iso = 'FR';
  if (p.adm0_a3 === 'NOR') iso = 'NO';

  iso = iso.toUpperCase();
  if (!iso || iso.length !== 2) return;
  if (!byCountry[iso]) byCountry[iso] = [];
  byCountry[iso].push(f);
});

console.log(`Countries found: ${Object.keys(byCountry).length}`);

const tolerance = 0.02;
let written = 0, skipped = 0;

for (const [iso, features] of Object.entries(byCountry)) {
  const filename = `${iso.toLowerCase()}-subdivisions.geojson`;
  const filepath = path.join(OUT_DIR, filename);

  // Skip if already exists and has features
  if (existsSync(filepath)) {
    try {
      const existing = JSON.parse(readFileSync(filepath, 'utf-8'));
      if (existing.features && existing.features.length > 0) { skipped++; continue; }
    } catch {}
  }

  const simplified = features.map(f => {
    const p = f.properties;
    const name = p.name || p.NAME || p.gn_name || p.name_en || '';
    const id = (p.iso_3166_2 || p.code_hasc || name).toLowerCase().replace(/[^a-z0-9]/g, '_');
    return {
      type: 'Feature',
      properties: { id, name, name_local: p.name_local || name, type: p.type_en || p.type || 'region' },
      geometry: simplifyGeometry(f.geometry, tolerance),
    };
  });

  const geojson = { type: 'FeatureCollection', features: simplified };
  const json = JSON.stringify(geojson);
  writeFileSync(filepath, json);
  const kb = (json.length / 1024).toFixed(0);
  console.log(`  NEW: ${iso} — ${features.length} subdivisions (${kb} KB)`);
  written++;
}

console.log(`\nDone! New: ${written}, Already existed: ${skipped}`);
console.log(`Total subdivision files: ${written + skipped}`);

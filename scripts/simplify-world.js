/**
 * Simplify world GeoJSON — reduce vertices for faster loading
 * Run: node scripts/simplify-world.js
 */

import { readFileSync, writeFileSync } from 'fs';

const ACTIVE_COUNTRIES = new Set([
  'US','CA','MX','CU','BR','AR','CO','CL','PE','VE','EC','BO','PY','UY','CR','PA','DO','GT','HN','SV','NI','PR','JM','HT','TT',
  'ES','FR','DE','IT','GB','PT','NL','BE','SE','NO','DK','FI','PL','CZ','AT','CH','IE','GR','RO','HU','BG','HR','RS','UA','SK','LT','LV','EE','SI','AL',
  'JP','KR','CN','IN','TH','VN','PH','ID','MY','SG','PK','BD','TW','IL','AE','SA','TR','IR',
  'ZA','NG','EG','KE','ET','GH','TZ','MA','DZ','TN',
  'AU','NZ',
  'RU',
]);

const raw = JSON.parse(readFileSync('public/geojson/world-countries-raw.geojson', 'utf-8'));

function simplifyCoords(coords, tolerance) {
  if (coords.length <= 4) return coords;
  // Douglas-Peucker simplification
  return douglasPeucker(coords, tolerance);
}

function douglasPeucker(points, epsilon) {
  if (points.length <= 2) return points;

  let maxDist = 0;
  let maxIdx = 0;
  const start = points[0];
  const end = points[points.length - 1];

  for (let i = 1; i < points.length - 1; i++) {
    const dist = pointLineDistance(points[i], start, end);
    if (dist > maxDist) { maxDist = dist; maxIdx = i; }
  }

  if (maxDist > epsilon) {
    const left = douglasPeucker(points.slice(0, maxIdx + 1), epsilon);
    const right = douglasPeucker(points.slice(maxIdx), epsilon);
    return [...left.slice(0, -1), ...right];
  }
  return [start, end];
}

function pointLineDistance(point, lineStart, lineEnd) {
  const dx = lineEnd[0] - lineStart[0];
  const dy = lineEnd[1] - lineStart[1];
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.sqrt((point[0] - lineStart[0]) ** 2 + (point[1] - lineStart[1]) ** 2);
  const t = Math.max(0, Math.min(1, ((point[0] - lineStart[0]) * dx + (point[1] - lineStart[1]) * dy) / lenSq));
  const projX = lineStart[0] + t * dx;
  const projY = lineStart[1] + t * dy;
  return Math.sqrt((point[0] - projX) ** 2 + (point[1] - projY) ** 2);
}

function simplifyGeometry(geometry, tolerance) {
  if (geometry.type === 'Polygon') {
    return {
      type: 'Polygon',
      coordinates: geometry.coordinates.map(ring => simplifyCoords(ring, tolerance)),
    };
  } else if (geometry.type === 'MultiPolygon') {
    return {
      type: 'MultiPolygon',
      coordinates: geometry.coordinates.map(poly =>
        poly.map(ring => simplifyCoords(ring, tolerance))
      ),
    };
  }
  return geometry;
}

const tolerance = 0.1; // degrees — aggressive simplification for world view

const simplified = {
  type: 'FeatureCollection',
  features: raw.features.map(f => {
    const iso = f.properties['ISO3166-1-Alpha-2'] || f.properties.ISO_A2 || f.properties.iso_a2 || '';
    return {
      type: 'Feature',
      properties: {
        name: f.properties.name || f.properties.ADMIN || '',
        iso_a2: iso,
        active: ACTIVE_COUNTRIES.has(iso),
      },
      geometry: simplifyGeometry(f.geometry, tolerance),
    };
  }),
};

const output = JSON.stringify(simplified);
writeFileSync('public/geojson/world-countries.geojson', output);
console.log(`Simplified: ${raw.features.length} countries`);
console.log(`Active: ${simplified.features.filter(f => f.properties.active).length}`);
console.log(`Size: ${(output.length / 1024 / 1024).toFixed(2)} MB`);

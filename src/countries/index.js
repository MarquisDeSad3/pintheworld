/* Country registry — all countries with their config */

export const COUNTRIES = [
  // Americas
  { id: 'us', name: 'United States', flag: '🇺🇸', continent: 'Americas', subdivisionType: 'state', scoringExponent: 7, currency: 'usd', center: [39.8, -98.5], zoom: 4, promoPrice: 699 },
  { id: 'ca', name: 'Canada', flag: '🇨🇦', continent: 'Americas', subdivisionType: 'province', scoringExponent: 7, currency: 'cad', center: [56.1, -106.3], zoom: 4, promoPrice: 899 },
  { id: 'mx', name: 'Mexico', flag: '🇲🇽', continent: 'Americas', subdivisionType: 'state', scoringExponent: 8, currency: 'mxn', center: [23.6, -102.5], zoom: 5, promoPrice: 12900 },
  { id: 'cu', name: 'Cuba', flag: '🇨🇺', continent: 'Americas', subdivisionType: 'province', scoringExponent: 10, currency: 'usd', center: [21.5, -77.8], zoom: 7, promoPrice: 699 },
  { id: 'br', name: 'Brazil', flag: '🇧🇷', continent: 'Americas', subdivisionType: 'state', scoringExponent: 8, currency: 'brl', center: [-14.2, -51.9], zoom: 4, promoPrice: 3490 },
  { id: 'ar', name: 'Argentina', flag: '🇦🇷', continent: 'Americas', subdivisionType: 'province', scoringExponent: 8, currency: 'ars', center: [-38.4, -63.6], zoom: 4, promoPrice: 699 },
  { id: 'co', name: 'Colombia', flag: '🇨🇴', continent: 'Americas', subdivisionType: 'department', scoringExponent: 8, currency: 'cop', center: [4.6, -74.1], zoom: 6, promoPrice: 2900000 },
  { id: 'cl', name: 'Chile', flag: '🇨🇱', continent: 'Americas', subdivisionType: 'region', scoringExponent: 7, currency: 'clp', center: [-35.7, -71.5], zoom: 4, promoPrice: 499000 },
  { id: 'pe', name: 'Peru', flag: '🇵🇪', continent: 'Americas', subdivisionType: 'department', scoringExponent: 8, currency: 'pen', center: [-9.2, -75.0], zoom: 5, promoPrice: 2500 },
  { id: 've', name: 'Venezuela', flag: '🇻🇪', continent: 'Americas', subdivisionType: 'state', scoringExponent: 8, currency: 'usd', center: [6.4, -66.6], zoom: 6, promoPrice: 699 },
  { id: 'ec', name: 'Ecuador', flag: '🇪🇨', continent: 'Americas', subdivisionType: 'province', scoringExponent: 9, currency: 'usd', center: [-1.8, -78.2], zoom: 7, promoPrice: 699 },
  { id: 'bo', name: 'Bolivia', flag: '🇧🇴', continent: 'Americas', subdivisionType: 'department', scoringExponent: 8, currency: 'bob', center: [-16.3, -63.6], zoom: 6, promoPrice: 4800 },
  { id: 'py', name: 'Paraguay', flag: '🇵🇾', continent: 'Americas', subdivisionType: 'department', scoringExponent: 8, currency: 'pyg', center: [-23.4, -58.4], zoom: 6, promoPrice: 4800000 },
  { id: 'uy', name: 'Uruguay', flag: '🇺🇾', continent: 'Americas', subdivisionType: 'department', scoringExponent: 9, currency: 'uyu', center: [-32.5, -55.8], zoom: 7, promoPrice: 29900 },
  { id: 'cr', name: 'Costa Rica', flag: '🇨🇷', continent: 'Americas', subdivisionType: 'province', scoringExponent: 9, currency: 'crc', center: [9.7, -83.8], zoom: 8, promoPrice: 350000 },
  { id: 'pa', name: 'Panama', flag: '🇵🇦', continent: 'Americas', subdivisionType: 'province', scoringExponent: 9, currency: 'usd', center: [8.5, -80.8], zoom: 8, promoPrice: 699 },
  { id: 'do', name: 'Dominican Republic', flag: '🇩🇴', continent: 'Americas', subdivisionType: 'province', scoringExponent: 10, currency: 'dop', center: [18.7, -70.2], zoom: 8, promoPrice: 39900 },
  { id: 'gt', name: 'Guatemala', flag: '🇬🇹', continent: 'Americas', subdivisionType: 'department', scoringExponent: 9, currency: 'gtq', center: [15.8, -90.2], zoom: 7, promoPrice: 5400 },
  { id: 'hn', name: 'Honduras', flag: '🇭🇳', continent: 'Americas', subdivisionType: 'department', scoringExponent: 9, currency: 'hnl', center: [15.2, -86.2], zoom: 7, promoPrice: 17000 },
  { id: 'sv', name: 'El Salvador', flag: '🇸🇻', continent: 'Americas', subdivisionType: 'department', scoringExponent: 10, currency: 'usd', center: [13.8, -88.9], zoom: 9, promoPrice: 699 },
  { id: 'ni', name: 'Nicaragua', flag: '🇳🇮', continent: 'Americas', subdivisionType: 'department', scoringExponent: 9, currency: 'nio', center: [12.9, -85.2], zoom: 7, promoPrice: 25000 },
  { id: 'pr', name: 'Puerto Rico', flag: '🇵🇷', continent: 'Americas', subdivisionType: 'municipality', scoringExponent: 10, currency: 'usd', center: [18.2, -66.6], zoom: 9, promoPrice: 699 },
  { id: 'jm', name: 'Jamaica', flag: '🇯🇲', continent: 'Americas', subdivisionType: 'parish', scoringExponent: 10, currency: 'jmd', center: [18.1, -77.3], zoom: 9, promoPrice: 100000 },
  { id: 'ht', name: 'Haiti', flag: '🇭🇹', continent: 'Americas', subdivisionType: 'department', scoringExponent: 10, currency: 'htg', center: [19.0, -72.1], zoom: 8, promoPrice: 699 },
  { id: 'tt', name: 'Trinidad & Tobago', flag: '🇹🇹', continent: 'Americas', subdivisionType: 'region', scoringExponent: 10, currency: 'ttd', center: [10.4, -61.2], zoom: 9, promoPrice: 4700 },

  // Europe
  { id: 'es', name: 'Spain', flag: '🇪🇸', continent: 'Europe', subdivisionType: 'community', scoringExponent: 7, currency: 'eur', center: [40.5, -3.7], zoom: 6, promoPrice: 649 },
  { id: 'fr', name: 'France', flag: '🇫🇷', continent: 'Europe', subdivisionType: 'region', scoringExponent: 7, currency: 'eur', center: [46.2, 2.2], zoom: 6, promoPrice: 649 },
  { id: 'de', name: 'Germany', flag: '🇩🇪', continent: 'Europe', subdivisionType: 'state', scoringExponent: 7, currency: 'eur', center: [51.2, 10.4], zoom: 6, promoPrice: 649 },
  { id: 'it', name: 'Italy', flag: '🇮🇹', continent: 'Europe', subdivisionType: 'region', scoringExponent: 7, currency: 'eur', center: [41.9, 12.6], zoom: 6, promoPrice: 649 },
  { id: 'gb', name: 'United Kingdom', flag: '🇬🇧', continent: 'Europe', subdivisionType: 'region', scoringExponent: 7, currency: 'gbp', center: [55.4, -3.4], zoom: 6, promoPrice: 549 },
  { id: 'pt', name: 'Portugal', flag: '🇵🇹', continent: 'Europe', subdivisionType: 'district', scoringExponent: 8, currency: 'eur', center: [39.4, -8.2], zoom: 7, promoPrice: 649 },
  { id: 'nl', name: 'Netherlands', flag: '🇳🇱', continent: 'Europe', subdivisionType: 'province', scoringExponent: 9, currency: 'eur', center: [52.1, 5.3], zoom: 8, promoPrice: 649 },
  { id: 'be', name: 'Belgium', flag: '🇧🇪', continent: 'Europe', subdivisionType: 'province', scoringExponent: 9, currency: 'eur', center: [50.5, 4.5], zoom: 8, promoPrice: 649 },
  { id: 'se', name: 'Sweden', flag: '🇸🇪', continent: 'Europe', subdivisionType: 'county', scoringExponent: 7, currency: 'sek', center: [60.1, 18.6], zoom: 5, promoPrice: 6900 },
  { id: 'no', name: 'Norway', flag: '🇳🇴', continent: 'Europe', subdivisionType: 'county', scoringExponent: 7, currency: 'nok', center: [60.5, 8.5], zoom: 5, promoPrice: 6900 },
  { id: 'dk', name: 'Denmark', flag: '🇩🇰', continent: 'Europe', subdivisionType: 'region', scoringExponent: 9, currency: 'dkk', center: [56.3, 9.5], zoom: 7, promoPrice: 4900 },
  { id: 'fi', name: 'Finland', flag: '🇫🇮', continent: 'Europe', subdivisionType: 'region', scoringExponent: 7, currency: 'eur', center: [61.9, 25.7], zoom: 5, promoPrice: 649 },
  { id: 'pl', name: 'Poland', flag: '🇵🇱', continent: 'Europe', subdivisionType: 'voivodeship', scoringExponent: 8, currency: 'pln', center: [51.9, 19.1], zoom: 6, promoPrice: 2900 },
  { id: 'cz', name: 'Czech Republic', flag: '🇨🇿', continent: 'Europe', subdivisionType: 'region', scoringExponent: 9, currency: 'czk', center: [49.8, 15.5], zoom: 7, promoPrice: 14900 },
  { id: 'at', name: 'Austria', flag: '🇦🇹', continent: 'Europe', subdivisionType: 'state', scoringExponent: 9, currency: 'eur', center: [47.5, 13.3], zoom: 7, promoPrice: 649 },
  { id: 'ch', name: 'Switzerland', flag: '🇨🇭', continent: 'Europe', subdivisionType: 'canton', scoringExponent: 9, currency: 'chf', center: [46.8, 8.2], zoom: 8, promoPrice: 699 },
  { id: 'ie', name: 'Ireland', flag: '🇮🇪', continent: 'Europe', subdivisionType: 'county', scoringExponent: 9, currency: 'eur', center: [53.1, -7.7], zoom: 7, promoPrice: 649 },
  { id: 'gr', name: 'Greece', flag: '🇬🇷', continent: 'Europe', subdivisionType: 'region', scoringExponent: 8, currency: 'eur', center: [39.1, 21.8], zoom: 6, promoPrice: 649 },
  { id: 'ro', name: 'Romania', flag: '🇷🇴', continent: 'Europe', subdivisionType: 'county', scoringExponent: 8, currency: 'ron', center: [45.9, 24.9], zoom: 7, promoPrice: 3200 },
  { id: 'hu', name: 'Hungary', flag: '🇭🇺', continent: 'Europe', subdivisionType: 'county', scoringExponent: 9, currency: 'huf', center: [47.2, 19.5], zoom: 7, promoPrice: 249000 },
  { id: 'bg', name: 'Bulgaria', flag: '🇧🇬', continent: 'Europe', subdivisionType: 'province', scoringExponent: 9, currency: 'bgn', center: [42.7, 25.5], zoom: 7, promoPrice: 1200 },
  { id: 'hr', name: 'Croatia', flag: '🇭🇷', continent: 'Europe', subdivisionType: 'county', scoringExponent: 9, currency: 'eur', center: [45.1, 15.2], zoom: 7, promoPrice: 649 },
  { id: 'rs', name: 'Serbia', flag: '🇷🇸', continent: 'Europe', subdivisionType: 'district', scoringExponent: 9, currency: 'rsd', center: [44.0, 21.0], zoom: 7, promoPrice: 79900 },
  { id: 'ua', name: 'Ukraine', flag: '🇺🇦', continent: 'Europe', subdivisionType: 'oblast', scoringExponent: 8, currency: 'uah', center: [48.4, 31.2], zoom: 6, promoPrice: 28000 },
  { id: 'sk', name: 'Slovakia', flag: '🇸🇰', continent: 'Europe', subdivisionType: 'region', scoringExponent: 9, currency: 'eur', center: [48.7, 19.7], zoom: 8, promoPrice: 649 },
  { id: 'lt', name: 'Lithuania', flag: '🇱🇹', continent: 'Europe', subdivisionType: 'county', scoringExponent: 9, currency: 'eur', center: [55.2, 23.9], zoom: 7, promoPrice: 649 },
  { id: 'lv', name: 'Latvia', flag: '🇱🇻', continent: 'Europe', subdivisionType: 'region', scoringExponent: 9, currency: 'eur', center: [56.9, 24.1], zoom: 7, promoPrice: 649 },
  { id: 'ee', name: 'Estonia', flag: '🇪🇪', continent: 'Europe', subdivisionType: 'county', scoringExponent: 9, currency: 'eur', center: [58.6, 25.0], zoom: 7, promoPrice: 649 },
  { id: 'si', name: 'Slovenia', flag: '🇸🇮', continent: 'Europe', subdivisionType: 'region', scoringExponent: 10, currency: 'eur', center: [46.2, 14.8], zoom: 8, promoPrice: 649 },
  { id: 'al', name: 'Albania', flag: '🇦🇱', continent: 'Europe', subdivisionType: 'county', scoringExponent: 10, currency: 'all', center: [41.2, 20.2], zoom: 8, promoPrice: 69900 },

  // Asia
  { id: 'jp', name: 'Japan', flag: '🇯🇵', continent: 'Asia', subdivisionType: 'prefecture', scoringExponent: 8, currency: 'jpy', center: [36.2, 138.3], zoom: 5, promoPrice: 100000 },
  { id: 'kr', name: 'South Korea', flag: '🇰🇷', continent: 'Asia', subdivisionType: 'province', scoringExponent: 9, currency: 'krw', center: [35.9, 127.8], zoom: 7, promoPrice: 900000 },
  { id: 'cn', name: 'China', flag: '🇨🇳', continent: 'Asia', subdivisionType: 'province', scoringExponent: 7, currency: 'cny', center: [35.9, 104.2], zoom: 4, promoPrice: 4900 },
  { id: 'in', name: 'India', flag: '🇮🇳', continent: 'Asia', subdivisionType: 'state', scoringExponent: 7, currency: 'inr', center: [20.6, 79.0], zoom: 5, promoPrice: 59900 },
  { id: 'th', name: 'Thailand', flag: '🇹🇭', continent: 'Asia', subdivisionType: 'province', scoringExponent: 8, currency: 'thb', center: [15.9, 101.0], zoom: 6, promoPrice: 24900 },
  { id: 'vn', name: 'Vietnam', flag: '🇻🇳', continent: 'Asia', subdivisionType: 'province', scoringExponent: 8, currency: 'vnd', center: [14.1, 108.3], zoom: 6, promoPrice: 16900000 },
  { id: 'ph', name: 'Philippines', flag: '🇵🇭', continent: 'Asia', subdivisionType: 'region', scoringExponent: 8, currency: 'php', center: [12.9, 121.8], zoom: 6, promoPrice: 39900 },
  { id: 'id', name: 'Indonesia', flag: '🇮🇩', continent: 'Asia', subdivisionType: 'province', scoringExponent: 7, currency: 'idr', center: [-0.8, 113.9], zoom: 5, promoPrice: 10900000 },
  { id: 'my', name: 'Malaysia', flag: '🇲🇾', continent: 'Asia', subdivisionType: 'state', scoringExponent: 8, currency: 'myr', center: [4.2, 101.9], zoom: 6, promoPrice: 3200 },
  { id: 'sg', name: 'Singapore', flag: '🇸🇬', continent: 'Asia', subdivisionType: 'district', scoringExponent: 10, currency: 'sgd', center: [1.35, 103.8], zoom: 11, promoPrice: 999 },
  { id: 'pk', name: 'Pakistan', flag: '🇵🇰', continent: 'Asia', subdivisionType: 'province', scoringExponent: 7, currency: 'pkr', center: [30.4, 69.3], zoom: 5, promoPrice: 199900 },
  { id: 'bd', name: 'Bangladesh', flag: '🇧🇩', continent: 'Asia', subdivisionType: 'division', scoringExponent: 9, currency: 'bdt', center: [23.7, 90.4], zoom: 7, promoPrice: 79900 },
  { id: 'tw', name: 'Taiwan', flag: '🇹🇼', continent: 'Asia', subdivisionType: 'county', scoringExponent: 9, currency: 'twd', center: [23.7, 120.9], zoom: 8, promoPrice: 22900 },
  { id: 'il', name: 'Israel', flag: '🇮🇱', continent: 'Asia', subdivisionType: 'district', scoringExponent: 10, currency: 'ils', center: [31.0, 34.9], zoom: 8, promoPrice: 2500 },
  { id: 'ae', name: 'UAE', flag: '🇦🇪', continent: 'Asia', subdivisionType: 'emirate', scoringExponent: 9, currency: 'aed', center: [23.4, 53.8], zoom: 7, promoPrice: 2600 },
  { id: 'sa', name: 'Saudi Arabia', flag: '🇸🇦', continent: 'Asia', subdivisionType: 'region', scoringExponent: 7, currency: 'sar', center: [23.9, 45.1], zoom: 5, promoPrice: 2600 },
  { id: 'tr', name: 'Turkey', flag: '🇹🇷', continent: 'Asia', subdivisionType: 'province', scoringExponent: 7, currency: 'try', center: [39.0, 35.2], zoom: 6, promoPrice: 24900 },
  { id: 'ir', name: 'Iran', flag: '🇮🇷', continent: 'Asia', subdivisionType: 'province', scoringExponent: 7, currency: 'irr', center: [32.4, 53.7], zoom: 5, promoPrice: 699 },

  // Africa
  { id: 'za', name: 'South Africa', flag: '🇿🇦', continent: 'Africa', subdivisionType: 'province', scoringExponent: 8, currency: 'zar', center: [-30.6, 22.9], zoom: 6, promoPrice: 12900 },
  { id: 'ng', name: 'Nigeria', flag: '🇳🇬', continent: 'Africa', subdivisionType: 'state', scoringExponent: 8, currency: 'ngn', center: [9.1, 8.7], zoom: 6, promoPrice: 1099000 },
  { id: 'eg', name: 'Egypt', flag: '🇪🇬', continent: 'Africa', subdivisionType: 'governorate', scoringExponent: 7, currency: 'egp', center: [26.8, 30.8], zoom: 6, promoPrice: 34900 },
  { id: 'ke', name: 'Kenya', flag: '🇰🇪', continent: 'Africa', subdivisionType: 'county', scoringExponent: 8, currency: 'kes', center: [-0.02, 37.9], zoom: 6, promoPrice: 89900 },
  { id: 'et', name: 'Ethiopia', flag: '🇪🇹', continent: 'Africa', subdivisionType: 'region', scoringExponent: 8, currency: 'etb', center: [9.1, 40.5], zoom: 6, promoPrice: 699 },
  { id: 'gh', name: 'Ghana', flag: '🇬🇭', continent: 'Africa', subdivisionType: 'region', scoringExponent: 9, currency: 'ghs', center: [7.9, -1.0], zoom: 7, promoPrice: 8500 },
  { id: 'tz', name: 'Tanzania', flag: '🇹🇿', continent: 'Africa', subdivisionType: 'region', scoringExponent: 8, currency: 'tzs', center: [-6.4, 34.9], zoom: 6, promoPrice: 1799000 },
  { id: 'ma', name: 'Morocco', flag: '🇲🇦', continent: 'Africa', subdivisionType: 'region', scoringExponent: 8, currency: 'mad', center: [31.8, -7.1], zoom: 6, promoPrice: 6900 },
  { id: 'dz', name: 'Algeria', flag: '🇩🇿', continent: 'Africa', subdivisionType: 'province', scoringExponent: 7, currency: 'dzd', center: [28.0, 1.7], zoom: 5, promoPrice: 94900 },
  { id: 'tn', name: 'Tunisia', flag: '🇹🇳', continent: 'Africa', subdivisionType: 'governorate', scoringExponent: 9, currency: 'tnd', center: [34.0, 9.5], zoom: 7, promoPrice: 2200 },

  // Oceania
  { id: 'au', name: 'Australia', flag: '🇦🇺', continent: 'Oceania', subdivisionType: 'state', scoringExponent: 7, currency: 'aud', center: [-25.3, 133.8], zoom: 4, promoPrice: 999 },
  { id: 'nz', name: 'New Zealand', flag: '🇳🇿', continent: 'Oceania', subdivisionType: 'region', scoringExponent: 8, currency: 'nzd', center: [-40.9, 174.9], zoom: 6, promoPrice: 1099 },

  // Russia & Central Asia
  { id: 'ru', name: 'Russia', flag: '🇷🇺', continent: 'Europe', subdivisionType: 'oblast', scoringExponent: 6, currency: 'rub', center: [61.5, 105.3], zoom: 3, promoPrice: 69900 },
];

// Get all unique continents
export function getContinents() {
  return [...new Set(COUNTRIES.map(c => c.continent))];
}

// Get countries by continent
export function getCountriesByContinent(continent) {
  return COUNTRIES.filter(c => c.continent === continent);
}

// Find country by id
export function getCountry(id) {
  return COUNTRIES.find(c => c.id === id);
}

// Search countries by name
export function searchCountries(query) {
  const q = query.toLowerCase();
  return COUNTRIES.filter(c => c.name.toLowerCase().includes(q));
}

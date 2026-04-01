/**
 * Seed real rounds with Wikimedia Commons photos
 * These are famous landmarks with real coordinates
 * Run: node scripts/seed-rounds.js
 */

const ROUNDS = [
  // Europe
  { lat: 48.8584, lng: 2.2945, name: 'Eiffel Tower', country: 'France', cid: 'fr', sub: 'Île-de-France', sid: 'fr___le_de_france', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/800px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg' },
  { lat: 41.8902, lng: 12.4922, name: 'Colosseum', country: 'Italy', cid: 'it', sub: 'Lazio', sid: 'it_lazio', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/800px-Colosseo_2020.jpg' },
  { lat: 51.5014, lng: -0.1419, name: 'Big Ben', country: 'United Kingdom', cid: 'gb', sub: 'Greater London', sid: 'gb_greater_london', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg/800px-Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg' },
  { lat: 40.4319, lng: -3.6753, name: 'Santiago Bernabeu', country: 'Spain', cid: 'es', sub: 'Madrid', sid: 'es_madrid', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Nuevo_Estadio_Santiago_Bernab%C3%A9u_-_2024.jpg/800px-Nuevo_Estadio_Santiago_Bernab%C3%A9u_-_2024.jpg' },
  { lat: 52.5163, lng: 13.3777, name: 'Brandenburg Gate', country: 'Germany', cid: 'de', sub: 'Berlin', sid: 'de_berlin', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Brandenburger_Tor_abends.jpg/800px-Brandenburger_Tor_abends.jpg' },
  { lat: 38.7223, lng: -9.1393, name: 'Belem Tower', country: 'Portugal', cid: 'pt', sub: 'Lisboa', sid: 'pt_lisboa', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Bel%C3%A9m_Tower_Lisbon.jpg/800px-Bel%C3%A9m_Tower_Lisbon.jpg' },
  { lat: 55.7539, lng: 37.6208, name: 'Red Square', country: 'Russia', cid: 'ru', sub: 'Moscow', sid: 'ru_moscow', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/RedSquare_SaintBasile_%28pixinn.net%29.jpg/800px-RedSquare_SaintBasile_%28pixinn.net%29.jpg' },
  { lat: 37.9715, lng: 23.7257, name: 'Acropolis', country: 'Greece', cid: 'gr', sub: 'Attica', sid: 'gr_attica', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/800px-Camponotus_flavomarginatus_ant.jpg' },
  { lat: 48.2082, lng: 16.3738, name: 'Schonbrunn Palace', country: 'Austria', cid: 'at', sub: 'Wien', sid: 'at_wien', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Schloss_Sch%C3%B6nbrunn_-_Gartenseite.jpg/800px-Schloss_Sch%C3%B6nbrunn_-_Gartenseite.jpg' },
  { lat: 59.3293, lng: 18.0686, name: 'Stockholm Old Town', country: 'Sweden', cid: 'se', sub: 'Stockholm', sid: 'se_stockholm', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Stockholms_gamla_stan%2C_2012.jpg/800px-Stockholms_gamla_stan%2C_2012.jpg' },

  // Americas
  { lat: 40.6892, lng: -74.0445, name: 'Statue of Liberty', country: 'United States', cid: 'us', sub: 'New York', sid: 'us_new_york', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Statue_of_Liberty_7.jpg/800px-Statue_of_Liberty_7.jpg' },
  { lat: -22.9519, lng: -43.2105, name: 'Christ the Redeemer', country: 'Brazil', cid: 'br', sub: 'Rio de Janeiro', sid: 'br_rio_de_janeiro', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Christ_the_Redeemer_-_Cristo_Redentor.jpg/800px-Christ_the_Redeemer_-_Cristo_Redentor.jpg' },
  { lat: 19.4326, lng: -99.1332, name: 'Palacio de Bellas Artes', country: 'Mexico', cid: 'mx', sub: 'Ciudad de Mexico', sid: 'mx_ciudad_de_m_xico', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Palacio_de_Bellas_Artes_-_Ciudad_de_M%C3%A9xico.jpg/800px-Palacio_de_Bellas_Artes_-_Ciudad_de_M%C3%A9xico.jpg' },
  { lat: 23.1136, lng: -82.3666, name: 'El Capitolio, Havana', country: 'Cuba', cid: 'cu', sub: 'La Habana', sid: 'cu_la_habana', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/El_Capitolio_Havana.jpg/800px-El_Capitolio_Havana.jpg' },
  { lat: -34.6037, lng: -58.3816, name: 'Obelisco Buenos Aires', country: 'Argentina', cid: 'ar', sub: 'Buenos Aires', sid: 'ar_buenos_aires', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Buenos_Aires_-_Avenida_9_de_Julio.jpg/800px-Buenos_Aires_-_Avenida_9_de_Julio.jpg' },
  { lat: -13.1631, lng: -72.5450, name: 'Machu Picchu', country: 'Peru', cid: 'pe', sub: 'Cusco', sid: 'pe_cusco', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/800px-Machu_Picchu%2C_Peru.jpg' },
  { lat: 4.7110, lng: -74.0721, name: 'Monserrate', country: 'Colombia', cid: 'co', sub: 'Bogota', sid: 'co_bogot_', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Monserrate_Bogot%C3%A1.jpg/800px-Monserrate_Bogot%C3%A1.jpg' },
  { lat: 45.4215, lng: -75.6972, name: 'Parliament Hill', country: 'Canada', cid: 'ca', sub: 'Ontario', sid: 'ca_ontario', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Ottawa_-_ON_-_Parliament_Hill.jpg/800px-Ottawa_-_ON_-_Parliament_Hill.jpg' },

  // Asia
  { lat: 35.6762, lng: 139.6503, name: 'Tokyo Tower', country: 'Japan', cid: 'jp', sub: 'Tokyo', sid: 'jp_tokyo', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/TaroTokyo20110213-TokyoTower-01min.jpg/800px-TaroTokyo20110213-TokyoTower-01min.jpg' },
  { lat: 27.1751, lng: 78.0421, name: 'Taj Mahal', country: 'India', cid: 'in', sub: 'Uttar Pradesh', sid: 'in_uttar_pradesh', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/800px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg' },
  { lat: 39.9042, lng: 116.4074, name: 'Forbidden City', country: 'China', cid: 'cn', sub: 'Beijing', sid: 'cn_beijing', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Forbidden_city_07.jpg/800px-Forbidden_city_07.jpg' },
  { lat: 37.5665, lng: 126.9780, name: 'Gyeongbokgung', country: 'South Korea', cid: 'kr', sub: 'Seoul', sid: 'kr_seoul', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/%EA%B2%BD%EB%B3%B5%EA%B6%81_%EA%B7%BC%EC%A0%95%EC%A0%84_%EC%95%9E_%EC%96%B4%EB%8F%84.jpg/800px-%EA%B2%BD%EB%B3%B5%EA%B6%81_%EA%B7%BC%EC%A0%95%EC%A0%84_%EC%95%9E_%EC%96%B4%EB%8F%84.jpg' },
  { lat: 13.7563, lng: 100.5018, name: 'Wat Arun', country: 'Thailand', cid: 'th', sub: 'Bangkok', sid: 'th_bangkok', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Wat_Arun_Bangkok.jpg/800px-Wat_Arun_Bangkok.jpg' },
  { lat: 25.1972, lng: 55.2744, name: 'Burj Khalifa', country: 'UAE', cid: 'ae', sub: 'Dubai', sid: 'ae_dubai', photo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/93/Burj_Khalifa.jpg/800px-Burj_Khalifa.jpg' },
  { lat: 31.7683, lng: 35.2137, name: 'Western Wall', country: 'Israel', cid: 'il', sub: 'Jerusalem', sid: 'il_jerusalem', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Western_Wall_2.jpg/800px-Western_Wall_2.jpg' },

  // Africa & Oceania
  { lat: 29.9792, lng: 31.1342, name: 'Great Pyramid of Giza', country: 'Egypt', cid: 'eg', sub: 'Giza', sid: 'eg_giza', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/800px-Kheops-Pyramid.jpg' },
  { lat: -33.8568, lng: 151.2153, name: 'Sydney Opera House', country: 'Australia', cid: 'au', sub: 'New South Wales', sid: 'au_new_south_wales', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sydney_Australia._%2821339175489%29.jpg/800px-Sydney_Australia._%2821339175489%29.jpg' },
  { lat: -1.2921, lng: 36.8219, name: 'Nairobi National Park', country: 'Kenya', cid: 'ke', sub: 'Nairobi', sid: 'ke_nairobi', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Nairobi_Skyline_from_Nairobi_National_Park.jpg/800px-Nairobi_Skyline_from_Nairobi_National_Park.jpg' },
  { lat: -33.9249, lng: 18.4241, name: 'Table Mountain', country: 'South Africa', cid: 'za', sub: 'Western Cape', sid: 'za_western_cape', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Table_Mountain_DavidNewton.jpg/800px-Table_Mountain_DavidNewton.jpg' },
  { lat: 21.4225, lng: -77.9910, name: 'Trinidad', country: 'Cuba', cid: 'cu', sub: 'Sancti Spiritus', sid: 'cu_sancti_sp_ritus', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Trinidad_%28Kuba%29_02.jpg/800px-Trinidad_%28Kuba%29_02.jpg' },
];

// Output as JSON for seeding
console.log(JSON.stringify(ROUNDS, null, 2));
console.log(`\nTotal: ${ROUNDS.length} rounds`);

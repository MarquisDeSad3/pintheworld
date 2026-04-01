/**
 * Seed Rounds Generator
 * Fetches real, validated image URLs from Wikipedia API for landmarks worldwide.
 * Run: node scripts/seed-rounds.mjs
 */

const LANDMARKS = [
  // ===== UNITED STATES (us) =====
  { country: 'us', countryName: 'United States', subdivisionId: 'us_new_york', locationName: 'Statue of Liberty', wiki: 'Statue_of_Liberty' },
  { country: 'us', countryName: 'United States', subdivisionId: 'us_california', locationName: 'Golden Gate Bridge', wiki: 'Golden_Gate_Bridge' },
  { country: 'us', countryName: 'United States', subdivisionId: 'us_arizona', locationName: 'Grand Canyon', wiki: 'Grand_Canyon' },
  { country: 'us', countryName: 'United States', subdivisionId: 'us_south_dakota', locationName: 'Mount Rushmore', wiki: 'Mount_Rushmore' },
  { country: 'us', countryName: 'United States', subdivisionId: 'us_illinois', locationName: 'Cloud Gate, Chicago', wiki: 'Cloud_Gate' },

  // ===== CANADA (ca) =====
  { country: 'ca', countryName: 'Canada', subdivisionId: 'ca_ontario', locationName: 'CN Tower', wiki: 'CN_Tower' },
  { country: 'ca', countryName: 'Canada', subdivisionId: 'ca_alberta', locationName: 'Lake Louise', wiki: 'Lake_Louise_(Alberta)' },
  { country: 'ca', countryName: 'Canada', subdivisionId: 'ca_british_columbia', locationName: 'Stanley Park', wiki: 'Stanley_Park' },
  { country: 'ca', countryName: 'Canada', subdivisionId: 'ca_quebec', locationName: 'Chateau Frontenac', wiki: 'Ch%C3%A2teau_Frontenac' },

  // ===== MEXICO (mx) =====
  { country: 'mx', countryName: 'Mexico', subdivisionId: 'mx_ciudad_de_m_xico', locationName: 'Palacio de Bellas Artes', wiki: 'Palacio_de_Bellas_Artes' },
  { country: 'mx', countryName: 'Mexico', subdivisionId: 'mx_yucat_n', locationName: 'Chichen Itza', wiki: 'Chichen_Itza' },
  { country: 'mx', countryName: 'Mexico', subdivisionId: 'mx_quintana_roo', locationName: 'Tulum', wiki: 'Tulum' },
  { country: 'mx', countryName: 'Mexico', subdivisionId: 'mx_guanajuato', locationName: 'Guanajuato City', wiki: 'Guanajuato' },

  // ===== CUBA (cu) =====
  { country: 'cu', countryName: 'Cuba', subdivisionId: 'cu_la_habana', locationName: 'El Capitolio', wiki: 'El_Capitolio' },
  { country: 'cu', countryName: 'Cuba', subdivisionId: 'cu_sancti_sp_ritus', locationName: 'Trinidad', wiki: 'Trinidad,_Cuba' },
  { country: 'cu', countryName: 'Cuba', subdivisionId: 'cu_santiago_de_cuba', locationName: 'Santiago de Cuba Cathedral', wiki: 'Santiago_de_Cuba' },

  // ===== BRAZIL (br) =====
  { country: 'br', countryName: 'Brazil', subdivisionId: 'br_rio_de_janeiro', locationName: 'Christ the Redeemer', wiki: 'Christ_the_Redeemer_(statue)' },
  { country: 'br', countryName: 'Brazil', subdivisionId: 'br_s_o_paulo', locationName: 'Sao Paulo Cathedral', wiki: 'S%C3%A3o_Paulo_Cathedral' },
  { country: 'br', countryName: 'Brazil', subdivisionId: 'br_amazonas', locationName: 'Amazon Theatre', wiki: 'Amazon_Theatre' },
  { country: 'br', countryName: 'Brazil', subdivisionId: 'br_distrito_federal', locationName: 'Cathedral of Brasilia', wiki: 'Cathedral_of_Bras%C3%ADlia' },

  // ===== ARGENTINA (ar) =====
  { country: 'ar', countryName: 'Argentina', subdivisionId: 'ar_buenos_aires', locationName: 'Obelisco de Buenos Aires', wiki: 'Obelisco_de_Buenos_Aires' },
  { country: 'ar', countryName: 'Argentina', subdivisionId: 'ar_misiones', locationName: 'Iguazu Falls', wiki: 'Iguazu_Falls' },
  { country: 'ar', countryName: 'Argentina', subdivisionId: 'ar_santa_cruz', locationName: 'Perito Moreno Glacier', wiki: 'Perito_Moreno_Glacier' },

  // ===== COLOMBIA (co) =====
  { country: 'co', countryName: 'Colombia', subdivisionId: 'co_bogot_', locationName: 'Monserrate', wiki: 'Monserrate' },
  { country: 'co', countryName: 'Colombia', subdivisionId: 'co_bol_var', locationName: 'Cartagena Old Town', wiki: 'Cartagena,_Colombia' },
  { country: 'co', countryName: 'Colombia', subdivisionId: 'co_antioquia', locationName: 'Plaza Botero, Medellin', wiki: 'Plaza_Botero' },

  // ===== CHILE (cl) =====
  { country: 'cl', countryName: 'Chile', subdivisionId: 'cl_valpara_so', locationName: 'Valparaiso', wiki: 'Valpara%C3%ADso' },
  { country: 'cl', countryName: 'Chile', subdivisionId: 'cl_regi_n_metropolitana_de_santiago', locationName: 'Santiago', wiki: 'Santiago' },
  { country: 'cl', countryName: 'Chile', subdivisionId: 'cl_magallanes', locationName: 'Torres del Paine', wiki: 'Torres_del_Paine_National_Park' },

  // ===== PERU (pe) =====
  { country: 'pe', countryName: 'Peru', subdivisionId: 'pe_cusco', locationName: 'Machu Picchu', wiki: 'Machu_Picchu' },
  { country: 'pe', countryName: 'Peru', subdivisionId: 'pe_lima', locationName: 'Plaza Mayor, Lima', wiki: 'Plaza_Mayor,_Lima' },
  { country: 'pe', countryName: 'Peru', subdivisionId: 'pe_arequipa', locationName: 'Colca Canyon', wiki: 'Colca_Canyon' },

  // ===== VENEZUELA (ve) =====
  { country: 've', countryName: 'Venezuela', subdivisionId: 've_bol_var', locationName: 'Angel Falls', wiki: 'Angel_Falls' },

  // ===== ECUADOR (ec) =====
  { country: 'ec', countryName: 'Ecuador', subdivisionId: 'ec_pichincha', locationName: 'Basilica del Voto Nacional', wiki: 'Bas%C3%ADlica_del_Voto_Nacional' },
  { country: 'ec', countryName: 'Ecuador', subdivisionId: 'ec_gal_pagos', locationName: 'Galapagos Islands', wiki: 'Gal%C3%A1pagos_Islands' },

  // ===== COSTA RICA (cr) =====
  { country: 'cr', countryName: 'Costa Rica', subdivisionId: 'cr_san_jos_', locationName: 'National Theatre of Costa Rica', wiki: 'National_Theatre_of_Costa_Rica' },
  { country: 'cr', countryName: 'Costa Rica', subdivisionId: 'cr_guanacaste', locationName: 'Arenal Volcano', wiki: 'Arenal_Volcano' },

  // ===== PANAMA (pa) =====
  { country: 'pa', countryName: 'Panama', subdivisionId: 'pa_panam_', locationName: 'Panama Canal', wiki: 'Panama_Canal' },
  { country: 'pa', countryName: 'Panama', subdivisionId: 'pa_panam_', locationName: 'Casco Viejo', wiki: 'Casco_Viejo,_Panama' },

  // ===== DOM. REPUBLIC (do) =====
  { country: 'do', countryName: 'Dominican Republic', subdivisionId: 'do_distrito_nacional', locationName: 'Colonial Zone, Santo Domingo', wiki: 'Colonial_City_of_Santo_Domingo' },

  // ===== GUATEMALA (gt) =====
  { country: 'gt', countryName: 'Guatemala', subdivisionId: 'gt_pet_n', locationName: 'Tikal', wiki: 'Tikal' },
  { country: 'gt', countryName: 'Guatemala', subdivisionId: 'gt_sacatep_quez', locationName: 'Antigua Guatemala', wiki: 'Antigua_Guatemala' },

  // ===== JAMAICA (jm) =====
  { country: 'jm', countryName: 'Jamaica', subdivisionId: 'jm_surrey', locationName: 'Blue Mountains', wiki: 'Blue_Mountains_(Jamaica)' },

  // ===== URUGUAY (uy) =====
  { country: 'uy', countryName: 'Uruguay', subdivisionId: 'uy_montevideo', locationName: 'Palacio Salvo', wiki: 'Palacio_Salvo' },

  // ===== BOLIVIA (bo) =====
  { country: 'bo', countryName: 'Bolivia', subdivisionId: 'bo_potos_', locationName: 'Salar de Uyuni', wiki: 'Salar_de_Uyuni' },
  { country: 'bo', countryName: 'Bolivia', subdivisionId: 'bo_la_paz', locationName: 'La Paz', wiki: 'La_Paz' },

  // ===== SPAIN (es) =====
  { country: 'es', countryName: 'Spain', subdivisionId: 'es_madrid', locationName: 'Royal Palace of Madrid', wiki: 'Royal_Palace_of_Madrid' },
  { country: 'es', countryName: 'Spain', subdivisionId: 'es_catalu_a', locationName: 'Sagrada Familia', wiki: 'Sagrada_Fam%C3%ADlia' },
  { country: 'es', countryName: 'Spain', subdivisionId: 'es_andaluc_a', locationName: 'Alhambra', wiki: 'Alhambra' },
  { country: 'es', countryName: 'Spain', subdivisionId: 'es_castilla_la_mancha', locationName: 'Windmills of Consuegra', wiki: 'Consuegra' },
  { country: 'es', countryName: 'Spain', subdivisionId: 'es_pa_s_vasco', locationName: 'Guggenheim Bilbao', wiki: 'Guggenheim_Museum_Bilbao' },

  // ===== FRANCE (fr) =====
  { country: 'fr', countryName: 'France', subdivisionId: 'fr___le_de_france', locationName: 'Eiffel Tower', wiki: 'Eiffel_Tower' },
  { country: 'fr', countryName: 'France', subdivisionId: 'fr_provence_alpes_c_te_d_azur', locationName: 'Palace of the Popes, Avignon', wiki: 'Palais_des_Papes' },
  { country: 'fr', countryName: 'France', subdivisionId: 'fr_normandie', locationName: 'Mont Saint-Michel', wiki: 'Mont-Saint-Michel' },
  { country: 'fr', countryName: 'France', subdivisionId: 'fr_centre_val_de_loire', locationName: 'Chateau de Chambord', wiki: 'Ch%C3%A2teau_de_Chambord' },

  // ===== GERMANY (de) =====
  { country: 'de', countryName: 'Germany', subdivisionId: 'de_berlin', locationName: 'Brandenburg Gate', wiki: 'Brandenburg_Gate' },
  { country: 'de', countryName: 'Germany', subdivisionId: 'de_bavaria', locationName: 'Neuschwanstein Castle', wiki: 'Neuschwanstein_Castle' },
  { country: 'de', countryName: 'Germany', subdivisionId: 'de_north_rhine_westphalia', locationName: 'Cologne Cathedral', wiki: 'Cologne_Cathedral' },
  { country: 'de', countryName: 'Germany', subdivisionId: 'de_saxony', locationName: 'Frauenkirche, Dresden', wiki: 'Dresden_Frauenkirche' },

  // ===== ITALY (it) =====
  { country: 'it', countryName: 'Italy', subdivisionId: 'it_lazio', locationName: 'Colosseum', wiki: 'Colosseum' },
  { country: 'it', countryName: 'Italy', subdivisionId: 'it_tuscany', locationName: 'Leaning Tower of Pisa', wiki: 'Leaning_Tower_of_Pisa' },
  { country: 'it', countryName: 'Italy', subdivisionId: 'it_veneto', locationName: 'Rialto Bridge, Venice', wiki: 'Rialto_Bridge' },
  { country: 'it', countryName: 'Italy', subdivisionId: 'it_lombardy', locationName: 'Milan Cathedral', wiki: 'Milan_Cathedral' },
  { country: 'it', countryName: 'Italy', subdivisionId: 'it_campania', locationName: 'Pompeii', wiki: 'Pompeii' },

  // ===== UNITED KINGDOM (gb) =====
  { country: 'gb', countryName: 'United Kingdom', subdivisionId: 'gb_greater_london', locationName: 'Big Ben', wiki: 'Big_Ben' },
  { country: 'gb', countryName: 'United Kingdom', subdivisionId: 'gb_greater_london', locationName: 'Tower Bridge', wiki: 'Tower_Bridge' },
  { country: 'gb', countryName: 'United Kingdom', subdivisionId: 'gb_south_west_england', locationName: 'Stonehenge', wiki: 'Stonehenge' },
  { country: 'gb', countryName: 'United Kingdom', subdivisionId: 'gb_scotland', locationName: 'Edinburgh Castle', wiki: 'Edinburgh_Castle' },

  // ===== PORTUGAL (pt) =====
  { country: 'pt', countryName: 'Portugal', subdivisionId: 'pt_lisboa', locationName: 'Belem Tower', wiki: 'Bel%C3%A9m_Tower' },
  { country: 'pt', countryName: 'Portugal', subdivisionId: 'pt_porto', locationName: 'Dom Luis I Bridge', wiki: 'Dom_Lu%C3%ADs_I_Bridge' },
  { country: 'pt', countryName: 'Portugal', subdivisionId: 'pt_leiria', locationName: 'Monastery of Batalha', wiki: 'Monastery_of_Batalha' },

  // ===== NETHERLANDS (nl) =====
  { country: 'nl', countryName: 'Netherlands', subdivisionId: 'nl_north_holland', locationName: 'Rijksmuseum', wiki: 'Rijksmuseum' },
  { country: 'nl', countryName: 'Netherlands', subdivisionId: 'nl_south_holland', locationName: 'Kinderdijk Windmills', wiki: 'Kinderdijk' },

  // ===== BELGIUM (be) =====
  { country: 'be', countryName: 'Belgium', subdivisionId: 'be_brussels_capital', locationName: 'Grand Place, Brussels', wiki: 'Grand_Place' },
  { country: 'be', countryName: 'Belgium', subdivisionId: 'be_east_flanders', locationName: 'Gravensteen, Ghent', wiki: 'Gravensteen' },

  // ===== SWEDEN (se) =====
  { country: 'se', countryName: 'Sweden', subdivisionId: 'se_stockholm', locationName: 'Stockholm Old Town', wiki: 'Gamla_stan' },
  { country: 'se', countryName: 'Sweden', subdivisionId: 'se_v_stra_g_taland', locationName: 'Gothenburg', wiki: 'Gothenburg' },

  // ===== NORWAY (no) =====
  { country: 'no', countryName: 'Norway', subdivisionId: 'no_vestland', locationName: 'Bergen Bryggen', wiki: 'Bryggen' },
  { country: 'no', countryName: 'Norway', subdivisionId: 'no_oslo', locationName: 'Oslo Opera House', wiki: 'Oslo_Opera_House' },

  // ===== DENMARK (dk) =====
  { country: 'dk', countryName: 'Denmark', subdivisionId: 'dk_capital_region', locationName: 'Nyhavn, Copenhagen', wiki: 'Nyhavn' },
  { country: 'dk', countryName: 'Denmark', subdivisionId: 'dk_capital_region', locationName: 'Tivoli Gardens', wiki: 'Tivoli_Gardens' },

  // ===== FINLAND (fi) =====
  { country: 'fi', countryName: 'Finland', subdivisionId: 'fi_uusimaa', locationName: 'Helsinki Cathedral', wiki: 'Helsinki_Cathedral' },
  { country: 'fi', countryName: 'Finland', subdivisionId: 'fi_lapland', locationName: 'Rovaniemi, Lapland', wiki: 'Rovaniemi' },

  // ===== POLAND (pl) =====
  { country: 'pl', countryName: 'Poland', subdivisionId: 'pl_lesser_poland', locationName: 'Wawel Castle, Krakow', wiki: 'Wawel_Castle' },
  { country: 'pl', countryName: 'Poland', subdivisionId: 'pl_masovia', locationName: 'Palace of Culture, Warsaw', wiki: 'Palace_of_Culture_and_Science' },

  // ===== CZECH REPUBLIC (cz) =====
  { country: 'cz', countryName: 'Czech Republic', subdivisionId: 'cz_prague', locationName: 'Charles Bridge, Prague', wiki: 'Charles_Bridge' },
  { country: 'cz', countryName: 'Czech Republic', subdivisionId: 'cz_south_moravian', locationName: 'Brno Cathedral', wiki: 'Cathedral_of_St._Peter_and_Paul,_Brno' },

  // ===== AUSTRIA (at) =====
  { country: 'at', countryName: 'Austria', subdivisionId: 'at_wien', locationName: 'Schonbrunn Palace', wiki: 'Sch%C3%B6nbrunn_Palace' },
  { country: 'at', countryName: 'Austria', subdivisionId: 'at_salzburg', locationName: 'Hohensalzburg Fortress', wiki: 'Hohensalzburg_Fortress' },

  // ===== SWITZERLAND (ch) =====
  { country: 'ch', countryName: 'Switzerland', subdivisionId: 'ch_bern', locationName: 'Bern Old City', wiki: 'Old_City_of_Bern' },
  { country: 'ch', countryName: 'Switzerland', subdivisionId: 'ch_lucerne', locationName: 'Chapel Bridge, Lucerne', wiki: 'Chapel_Bridge' },

  // ===== IRELAND (ie) =====
  { country: 'ie', countryName: 'Ireland', subdivisionId: 'ie_dublin', locationName: 'Temple Bar, Dublin', wiki: 'Temple_Bar,_Dublin' },
  { country: 'ie', countryName: 'Ireland', subdivisionId: 'ie_clare', locationName: 'Cliffs of Moher', wiki: 'Cliffs_of_Moher' },

  // ===== GREECE (gr) =====
  { country: 'gr', countryName: 'Greece', subdivisionId: 'gr_attica', locationName: 'Acropolis of Athens', wiki: 'Acropolis_of_Athens' },
  { country: 'gr', countryName: 'Greece', subdivisionId: 'gr_thessaly', locationName: 'Meteora', wiki: 'Meteora' },
  { country: 'gr', countryName: 'Greece', subdivisionId: 'gr_south_aegean', locationName: 'Santorini', wiki: 'Santorini' },

  // ===== ROMANIA (ro) =====
  { country: 'ro', countryName: 'Romania', subdivisionId: 'ro_bra_ov', locationName: 'Bran Castle', wiki: 'Bran_Castle' },
  { country: 'ro', countryName: 'Romania', subdivisionId: 'ro_bucharest', locationName: 'Palace of the Parliament', wiki: 'Palace_of_the_Parliament' },

  // ===== HUNGARY (hu) =====
  { country: 'hu', countryName: 'Hungary', subdivisionId: 'hu_budapest', locationName: 'Hungarian Parliament', wiki: 'Hungarian_Parliament_Building' },
  { country: 'hu', countryName: 'Hungary', subdivisionId: 'hu_budapest', locationName: 'Fishermans Bastion', wiki: 'Fisherman%27s_Bastion' },

  // ===== CROATIA (hr) =====
  { country: 'hr', countryName: 'Croatia', subdivisionId: 'hr_dubrovnik_neretva', locationName: 'Dubrovnik Old Town', wiki: 'Dubrovnik' },
  { country: 'hr', countryName: 'Croatia', subdivisionId: 'hr_split_dalmatia', locationName: 'Diocletians Palace', wiki: 'Diocletian%27s_Palace' },

  // ===== UKRAINE (ua) =====
  { country: 'ua', countryName: 'Ukraine', subdivisionId: 'ua_kyiv', locationName: 'Saint Sophias Cathedral, Kyiv', wiki: "Saint_Sophia's_Cathedral,_Kyiv" },
  { country: 'ua', countryName: 'Ukraine', subdivisionId: 'ua_lviv', locationName: 'Lviv Old Town', wiki: 'Lviv' },

  // ===== SERBIA (rs) =====
  { country: 'rs', countryName: 'Serbia', subdivisionId: 'rs_belgrade', locationName: 'Belgrade Fortress', wiki: 'Belgrade_Fortress' },

  // ===== BULGARIA (bg) =====
  { country: 'bg', countryName: 'Bulgaria', subdivisionId: 'bg_sofia_city', locationName: 'Alexander Nevsky Cathedral', wiki: 'Alexander_Nevsky_Cathedral,_Sofia' },

  // ===== JAPAN (jp) =====
  { country: 'jp', countryName: 'Japan', subdivisionId: 'jp_tokyo', locationName: 'Tokyo Tower', wiki: 'Tokyo_Tower' },
  { country: 'jp', countryName: 'Japan', subdivisionId: 'jp_kyoto', locationName: 'Fushimi Inari Shrine', wiki: 'Fushimi_Inari-taisha' },
  { country: 'jp', countryName: 'Japan', subdivisionId: 'jp_osaka', locationName: 'Osaka Castle', wiki: 'Osaka_Castle' },
  { country: 'jp', countryName: 'Japan', subdivisionId: 'jp_hiroshima', locationName: 'Itsukushima Shrine', wiki: 'Itsukushima_Shrine' },
  { country: 'jp', countryName: 'Japan', subdivisionId: 'jp_nara', locationName: 'Todai-ji Temple', wiki: 'T%C5%8Ddai-ji' },

  // ===== SOUTH KOREA (kr) =====
  { country: 'kr', countryName: 'South Korea', subdivisionId: 'kr_seoul', locationName: 'Gyeongbokgung Palace', wiki: 'Gyeongbokgung' },
  { country: 'kr', countryName: 'South Korea', subdivisionId: 'kr_busan', locationName: 'Gamcheon Culture Village', wiki: 'Gamcheon_Culture_Village' },
  { country: 'kr', countryName: 'South Korea', subdivisionId: 'kr_jeju', locationName: 'Hallasan', wiki: 'Hallasan' },

  // ===== CHINA (cn) =====
  { country: 'cn', countryName: 'China', subdivisionId: 'cn_beijing', locationName: 'Forbidden City', wiki: 'Forbidden_City' },
  { country: 'cn', countryName: 'China', subdivisionId: 'cn_beijing', locationName: 'Great Wall of China', wiki: 'Great_Wall_of_China' },
  { country: 'cn', countryName: 'China', subdivisionId: 'cn_shanghai', locationName: 'The Bund, Shanghai', wiki: 'The_Bund' },
  { country: 'cn', countryName: 'China', subdivisionId: 'cn_shaanxi', locationName: 'Terracotta Army', wiki: 'Terracotta_Army' },

  // ===== INDIA (in) =====
  { country: 'in', countryName: 'India', subdivisionId: 'in_uttar_pradesh', locationName: 'Taj Mahal', wiki: 'Taj_Mahal' },
  { country: 'in', countryName: 'India', subdivisionId: 'in_rajasthan', locationName: 'Hawa Mahal', wiki: 'Hawa_Mahal' },
  { country: 'in', countryName: 'India', subdivisionId: 'in_delhi', locationName: 'Red Fort', wiki: 'Red_Fort' },
  { country: 'in', countryName: 'India', subdivisionId: 'in_goa', locationName: 'Basilica of Bom Jesus', wiki: 'Basilica_of_Bom_Jesus' },

  // ===== THAILAND (th) =====
  { country: 'th', countryName: 'Thailand', subdivisionId: 'th_bangkok', locationName: 'Wat Arun', wiki: 'Wat_Arun' },
  { country: 'th', countryName: 'Thailand', subdivisionId: 'th_chiang_mai', locationName: 'Doi Suthep', wiki: 'Doi_Suthep' },
  { country: 'th', countryName: 'Thailand', subdivisionId: 'th_phuket', locationName: 'Phuket', wiki: 'Phuket_(city)' },

  // ===== VIETNAM (vn) =====
  { country: 'vn', countryName: 'Vietnam', subdivisionId: 'vn_qu_ng_ninh', locationName: 'Ha Long Bay', wiki: 'H%E1%BA%A1_Long_Bay' },
  { country: 'vn', countryName: 'Vietnam', subdivisionId: 'vn_ho_chi_minh_city', locationName: 'Notre-Dame Basilica, Saigon', wiki: 'Notre-Dame_Cathedral_Basilica_of_Saigon' },

  // ===== PHILIPPINES (ph) =====
  { country: 'ph', countryName: 'Philippines', subdivisionId: 'ph_central_visayas', locationName: 'Chocolate Hills', wiki: 'Chocolate_Hills' },
  { country: 'ph', countryName: 'Philippines', subdivisionId: 'ph_national_capital_region', locationName: 'Rizal Park, Manila', wiki: 'Rizal_Park' },

  // ===== INDONESIA (id) =====
  { country: 'id', countryName: 'Indonesia', subdivisionId: 'id_central_java', locationName: 'Borobudur', wiki: 'Borobudur' },
  { country: 'id', countryName: 'Indonesia', subdivisionId: 'id_bali', locationName: 'Tanah Lot Temple', wiki: 'Tanah_Lot' },

  // ===== MALAYSIA (my) =====
  { country: 'my', countryName: 'Malaysia', subdivisionId: 'my_kuala_lumpur', locationName: 'Petronas Towers', wiki: 'Petronas_Towers' },
  { country: 'my', countryName: 'Malaysia', subdivisionId: 'my_selangor', locationName: 'Batu Caves', wiki: 'Batu_Caves' },

  // ===== SINGAPORE (sg) =====
  { country: 'sg', countryName: 'Singapore', subdivisionId: 'sg_central', locationName: 'Marina Bay Sands', wiki: 'Marina_Bay_Sands' },
  { country: 'sg', countryName: 'Singapore', subdivisionId: 'sg_central', locationName: 'Gardens by the Bay', wiki: 'Gardens_by_the_Bay' },

  // ===== TAIWAN (tw) =====
  { country: 'tw', countryName: 'Taiwan', subdivisionId: 'tw_taipei', locationName: 'Taipei 101', wiki: 'Taipei_101' },
  { country: 'tw', countryName: 'Taiwan', subdivisionId: 'tw_new_taipei', locationName: 'Jiufen', wiki: 'Jiufen' },

  // ===== ISRAEL (il) =====
  { country: 'il', countryName: 'Israel', subdivisionId: 'il_jerusalem', locationName: 'Western Wall', wiki: 'Western_Wall' },
  { country: 'il', countryName: 'Israel', subdivisionId: 'il_tel_aviv', locationName: 'Tel Aviv Promenade', wiki: 'Tel_Aviv_Promenade' },

  // ===== UAE (ae) =====
  { country: 'ae', countryName: 'UAE', subdivisionId: 'ae_dubai', locationName: 'Burj Khalifa', wiki: 'Burj_Khalifa' },
  { country: 'ae', countryName: 'UAE', subdivisionId: 'ae_abu_dhabi', locationName: 'Sheikh Zayed Mosque', wiki: 'Sheikh_Zayed_Grand_Mosque' },

  // ===== TURKEY (tr) =====
  { country: 'tr', countryName: 'Turkey', subdivisionId: 'tr_istanbul', locationName: 'Hagia Sophia', wiki: 'Hagia_Sophia' },
  { country: 'tr', countryName: 'Turkey', subdivisionId: 'tr_nev_ehir', locationName: 'Cappadocia', wiki: 'Cappadocia' },
  { country: 'tr', countryName: 'Turkey', subdivisionId: 'tr_denizli', locationName: 'Pamukkale', wiki: 'Pamukkale' },

  // ===== IRAN (ir) =====
  { country: 'ir', countryName: 'Iran', subdivisionId: 'ir_isfahan', locationName: 'Naqsh-e Jahan Square', wiki: 'Naqsh-e_Jahan_Square' },
  { country: 'ir', countryName: 'Iran', subdivisionId: 'ir_fars', locationName: 'Persepolis', wiki: 'Persepolis' },

  // ===== SAUDI ARABIA (sa) =====
  { country: 'sa', countryName: 'Saudi Arabia', subdivisionId: 'sa_makkah', locationName: 'Masjid al-Haram', wiki: 'Masjid_al-Haram' },

  // ===== EGYPT (eg) =====
  { country: 'eg', countryName: 'Egypt', subdivisionId: 'eg_giza', locationName: 'Great Pyramid of Giza', wiki: 'Great_Pyramid_of_Giza' },
  { country: 'eg', countryName: 'Egypt', subdivisionId: 'eg_luxor', locationName: 'Valley of the Kings', wiki: 'Valley_of_the_Kings' },
  { country: 'eg', countryName: 'Egypt', subdivisionId: 'eg_aswan', locationName: 'Abu Simbel', wiki: 'Abu_Simbel' },

  // ===== SOUTH AFRICA (za) =====
  { country: 'za', countryName: 'South Africa', subdivisionId: 'za_western_cape', locationName: 'Table Mountain', wiki: 'Table_Mountain' },
  { country: 'za', countryName: 'South Africa', subdivisionId: 'za_gauteng', locationName: 'Union Buildings, Pretoria', wiki: 'Union_Buildings' },

  // ===== KENYA (ke) =====
  { country: 'ke', countryName: 'Kenya', subdivisionId: 'ke_nairobi', locationName: 'Nairobi National Park', wiki: 'Nairobi_National_Park' },
  { country: 'ke', countryName: 'Kenya', subdivisionId: 'ke_kajiado', locationName: 'Amboseli with Kilimanjaro', wiki: 'Amboseli_National_Park' },

  // ===== MOROCCO (ma) =====
  { country: 'ma', countryName: 'Morocco', subdivisionId: 'ma_marrakech_safi', locationName: 'Jemaa el-Fnaa', wiki: 'Jemaa_el-Fnaa' },
  { country: 'ma', countryName: 'Morocco', subdivisionId: 'ma_f_s_mekn_s', locationName: 'Fes Medina', wiki: 'Fez,_Morocco' },

  // ===== NIGERIA (ng) =====
  { country: 'ng', countryName: 'Nigeria', subdivisionId: 'ng_lagos', locationName: 'Lekki Conservation Centre', wiki: 'Lekki_Conservation_Centre' },

  // ===== TANZANIA (tz) =====
  { country: 'tz', countryName: 'Tanzania', subdivisionId: 'tz_kilimanjaro', locationName: 'Mount Kilimanjaro', wiki: 'Mount_Kilimanjaro' },

  // ===== AUSTRALIA (au) =====
  { country: 'au', countryName: 'Australia', subdivisionId: 'au_new_south_wales', locationName: 'Sydney Opera House', wiki: 'Sydney_Opera_House' },
  { country: 'au', countryName: 'Australia', subdivisionId: 'au_northern_territory', locationName: 'Uluru', wiki: 'Uluru' },
  { country: 'au', countryName: 'Australia', subdivisionId: 'au_queensland', locationName: 'Great Barrier Reef', wiki: 'Great_Barrier_Reef' },
  { country: 'au', countryName: 'Australia', subdivisionId: 'au_victoria', locationName: 'Twelve Apostles', wiki: 'Twelve_Apostles_(Victoria)' },

  // ===== NEW ZEALAND (nz) =====
  { country: 'nz', countryName: 'New Zealand', subdivisionId: 'nz_auckland', locationName: 'Sky Tower, Auckland', wiki: 'Sky_Tower_(Auckland)' },
  { country: 'nz', countryName: 'New Zealand', subdivisionId: 'nz_canterbury', locationName: 'Aoraki / Mount Cook', wiki: 'Aoraki_/_Mount_Cook' },
  { country: 'nz', countryName: 'New Zealand', subdivisionId: 'nz_otago', locationName: 'Milford Sound', wiki: 'Milford_Sound' },

  // ===== RUSSIA (ru) =====
  { country: 'ru', countryName: 'Russia', subdivisionId: 'ru_moscow', locationName: 'Red Square', wiki: 'Red_Square' },
  { country: 'ru', countryName: 'Russia', subdivisionId: 'ru_saint_petersburg', locationName: 'Hermitage Museum', wiki: 'Hermitage_Museum' },
  { country: 'ru', countryName: 'Russia', subdivisionId: 'ru_saint_petersburg', locationName: 'Church of the Savior on Blood', wiki: 'Church_of_the_Savior_on_Blood' },

  // ===== PAKISTAN (pk) =====
  { country: 'pk', countryName: 'Pakistan', subdivisionId: 'pk_punjab', locationName: 'Badshahi Mosque', wiki: 'Badshahi_Mosque' },

  // ===== BANGLADESH (bd) =====
  { country: 'bd', countryName: 'Bangladesh', subdivisionId: 'bd_dhaka', locationName: 'Lalbagh Fort', wiki: 'Lalbagh_Fort' },

  // ===== SLOVENIA (si) =====
  { country: 'si', countryName: 'Slovenia', subdivisionId: 'si_osrednjeslovenska', locationName: 'Ljubljana Castle', wiki: 'Ljubljana_Castle' },
  { country: 'si', countryName: 'Slovenia', subdivisionId: 'si_gorenjska', locationName: 'Lake Bled', wiki: 'Lake_Bled' },

  // ===== SLOVAKIA (sk) =====
  { country: 'sk', countryName: 'Slovakia', subdivisionId: 'sk_bratislava', locationName: 'Bratislava Castle', wiki: 'Bratislava_Castle' },

  // ===== LITHUANIA (lt) =====
  { country: 'lt', countryName: 'Lithuania', subdivisionId: 'lt_vilnius', locationName: 'Vilnius Old Town', wiki: 'Vilnius_Old_Town' },

  // ===== LATVIA (lv) =====
  { country: 'lv', countryName: 'Latvia', subdivisionId: 'lv_riga', locationName: 'House of the Blackheads', wiki: 'House_of_the_Blackheads_(Riga)' },

  // ===== ESTONIA (ee) =====
  { country: 'ee', countryName: 'Estonia', subdivisionId: 'ee_harju', locationName: 'Tallinn Old Town', wiki: 'Tallinn_Old_Town' },

  // ===== ALBANIA (al) =====
  { country: 'al', countryName: 'Albania', subdivisionId: 'al_gjirokast_r', locationName: 'Gjirokaster', wiki: 'Gjirokast%C3%ABr' },

  // ===== ALGERIA (dz) =====
  { country: 'dz', countryName: 'Algeria', subdivisionId: 'dz_algiers', locationName: 'Casbah of Algiers', wiki: 'Casbah_of_Algiers' },

  // ===== TUNISIA (tn) =====
  { country: 'tn', countryName: 'Tunisia', subdivisionId: 'tn_tunis', locationName: 'Bardo National Museum', wiki: 'Bardo_National_Museum_(Tunis)' },

  // ===== GHANA (gh) =====
  { country: 'gh', countryName: 'Ghana', subdivisionId: 'gh_greater_accra', locationName: 'Independence Arch, Accra', wiki: 'Independence_Arch_(Accra)' },

  // ===== ETHIOPIA (et) =====
  { country: 'et', countryName: 'Ethiopia', subdivisionId: 'et_amhara', locationName: 'Rock-Hewn Churches of Lalibela', wiki: 'Rock-Hewn_Churches,_Lalibela' },
];

// ---- Wikimedia Commons API — search for images directly ----
async function fetchCommonsImage(searchTerm) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(searchTerm)}&gsrlimit=5&prop=imageinfo&iiprop=url|mime&iiurlwidth=600&format=json&origin=*`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.query || !data.query.pages) return null;
    const pages = Object.values(data.query.pages).sort((a, b) => (a.index || 0) - (b.index || 0));
    for (const page of pages) {
      if (!page.imageinfo || !page.imageinfo[0]) continue;
      const info = page.imageinfo[0];
      // Skip SVGs, audio, video — only want raster images
      if (info.mime && !info.mime.startsWith('image/')) continue;
      if (info.mime === 'image/svg+xml') continue;
      const thumbUrl = info.thumburl;
      if (thumbUrl) return thumbUrl;
    }
  } catch (e) { /* skip */ }
  return null;
}

// Delay helper to avoid rate limiting
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ---- Main ----
async function main() {
  console.log(`Processing ${LANDMARKS.length} landmarks...\n`);
  const results = [];
  let success = 0, fail = 0;

  for (let i = 0; i < LANDMARKS.length; i++) {
    const lm = LANDMARKS[i];
    process.stdout.write(`[${i + 1}/${LANDMARKS.length}] ${lm.locationName}... `);

    // Rate limit: wait 500ms between requests
    if (i > 0) await delay(500);

    const photoUrl = await fetchCommonsImage(lm.locationName + ' ' + lm.countryName);
    if (!photoUrl) {
      console.log('NO IMAGE');
      fail++;
      continue;
    }

    console.log('OK');
    success++;
    results.push({
      countryId: lm.country,
      countryName: lm.countryName,
      subdivisionId: lm.subdivisionId,
      locationName: lm.locationName,
      photoUrl,
    });
  }

  console.log(`\n=== Results: ${success} valid, ${fail} failed ===\n`);

  // Write JS output
  const jsOutput = `/* Auto-generated seed rounds — ${new Date().toISOString().split('T')[0]} */
/* ${results.length} validated rounds from Wikipedia Commons */

export const SEED_ROUNDS = ${JSON.stringify(results, null, 2)};
`;

  const fs = await import('fs');
  fs.writeFileSync('src/seed-rounds.js', jsOutput);
  console.log(`Written to src/seed-rounds.js (${results.length} rounds)`);

  // Print country coverage
  const countries = {};
  results.forEach(r => { countries[r.countryId] = (countries[r.countryId] || 0) + 1; });
  console.log(`\nCountry coverage (${Object.keys(countries).length} countries):`);
  Object.entries(countries).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => {
    console.log(`  ${c}: ${n} rounds`);
  });
}

main().catch(console.error);

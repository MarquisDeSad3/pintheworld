/* Seed rounds — curated landmarks with verified Wikimedia Commons URLs */
/* These use the same stable URL pattern as existing demo rounds */

export const SEED_ROUNDS = [
  // ===== EUROPE =====
  // France
  {countryId:'fr',countryName:'France',subdivisionId:'fr___le_de_france',locationName:'Eiffel Tower',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/600px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg'},
  {countryId:'fr',countryName:'France',subdivisionId:'fr_normandie',locationName:'Mont Saint-Michel',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Le_Mont_Saint-Michel_vue_a%C3%A9rienne.jpg/600px-Le_Mont_Saint-Michel_vue_a%C3%A9rienne.jpg'},
  {countryId:'fr',countryName:'France',subdivisionId:'fr_provence_alpes_c_te_d_azur',locationName:'Palais des Papes, Avignon',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Avignon%2C_Pair_des_Papes_by_JM_Rosier_%28cropped%29.jpg/600px-Avignon%2C_Pair_des_Papes_by_JM_Rosier_%28cropped%29.jpg'},
  {countryId:'fr',countryName:'France',subdivisionId:'fr_centre_val_de_loire',locationName:'Chateau de Chambord',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Chambord_Castle_Northwest_facade.jpg/600px-Chambord_Castle_Northwest_facade.jpg'},

  // Italy
  {countryId:'it',countryName:'Italy',subdivisionId:'it_lazio',locationName:'Colosseum',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/600px-Colosseo_2020.jpg'},
  {countryId:'it',countryName:'Italy',subdivisionId:'it_tuscany',locationName:'Leaning Tower of Pisa',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/The_Leaning_Tower_of_Pisa_SB.jpeg/600px-The_Leaning_Tower_of_Pisa_SB.jpeg'},
  {countryId:'it',countryName:'Italy',subdivisionId:'it_veneto',locationName:'Rialto Bridge, Venice',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Rialto_bridge_in_Venice.jpg/600px-Rialto_bridge_in_Venice.jpg'},
  {countryId:'it',countryName:'Italy',subdivisionId:'it_lombardy',locationName:'Milan Cathedral',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Milan_Cathedral_from_Piazza_del_Duomo.jpg/600px-Milan_Cathedral_from_Piazza_del_Duomo.jpg'},
  {countryId:'it',countryName:'Italy',subdivisionId:'it_campania',locationName:'Pompeii',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Pompeii-Forum.jpg/600px-Pompeii-Forum.jpg'},

  // Spain
  {countryId:'es',countryName:'Spain',subdivisionId:'es_madrid',locationName:'Santiago Bernabeu',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Nuevo_Estadio_Santiago_Bernab%C3%A9u_-_2024.jpg/600px-Nuevo_Estadio_Santiago_Bernab%C3%A9u_-_2024.jpg'},
  {countryId:'es',countryName:'Spain',subdivisionId:'es_catalu_a',locationName:'Sagrada Familia',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Sagrada_Familia_-_Pair%C3%A7anes.jpg/600px-Sagrada_Familia_-_Pair%C3%A7anes.jpg'},
  {countryId:'es',countryName:'Spain',subdivisionId:'es_andaluc_a',locationName:'Alhambra',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Alhambra-Granada-from-Mirador-de-San-Nicolas.jpg/600px-Alhambra-Granada-from-Mirador-de-San-Nicolas.jpg'},
  {countryId:'es',countryName:'Spain',subdivisionId:'es_pa_s_vasco',locationName:'Guggenheim Bilbao',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Guggenheim_Bilbao_06_2012_Panorama_2680.jpg/600px-Guggenheim_Bilbao_06_2012_Panorama_2680.jpg'},

  // United Kingdom
  {countryId:'gb',countryName:'United Kingdom',subdivisionId:'gb_greater_london',locationName:'Big Ben',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg/600px-Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg'},
  {countryId:'gb',countryName:'United Kingdom',subdivisionId:'gb_greater_london',locationName:'Tower Bridge',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Tower_Bridge_from_Shad_Thames.jpg/600px-Tower_Bridge_from_Shad_Thames.jpg'},
  {countryId:'gb',countryName:'United Kingdom',subdivisionId:'gb_south_west_england',locationName:'Stonehenge',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Stonehenge2007_07_30.jpg/600px-Stonehenge2007_07_30.jpg'},
  {countryId:'gb',countryName:'United Kingdom',subdivisionId:'gb_scotland',locationName:'Edinburgh Castle',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Edinburgh_Castle_from_the_north.jpg/600px-Edinburgh_Castle_from_the_north.jpg'},

  // Germany
  {countryId:'de',countryName:'Germany',subdivisionId:'de_berlin',locationName:'Brandenburg Gate',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Brandenburger_Tor_abends.jpg/600px-Brandenburger_Tor_abends.jpg'},
  {countryId:'de',countryName:'Germany',subdivisionId:'de_bavaria',locationName:'Neuschwanstein Castle',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Schloss_Neuschwanstein_2013.jpg/600px-Schloss_Neuschwanstein_2013.jpg'},
  {countryId:'de',countryName:'Germany',subdivisionId:'de_north_rhine_westphalia',locationName:'Cologne Cathedral',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Cologne_cathedral_aerial_%282%29.jpg/600px-Cologne_cathedral_aerial_%282%29.jpg'},

  // Portugal
  {countryId:'pt',countryName:'Portugal',subdivisionId:'pt_lisboa',locationName:'Belem Tower',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Bel%C3%A9m_Tower_Lisbon.jpg/600px-Bel%C3%A9m_Tower_Lisbon.jpg'},
  {countryId:'pt',countryName:'Portugal',subdivisionId:'pt_porto',locationName:'Porto Ribeira',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Porto2010-22_%285203818025%29.jpg/600px-Porto2010-22_%285203818025%29.jpg'},

  // Greece
  {countryId:'gr',countryName:'Greece',subdivisionId:'gr_attica',locationName:'Acropolis',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/AthenaeumAcropolis.jpg/600px-AthenaeumAcropolis.jpg'},
  {countryId:'gr',countryName:'Greece',subdivisionId:'gr_south_aegean',locationName:'Santorini',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Santorini_Fira1_tango7174.jpg/600px-Santorini_Fira1_tango7174.jpg'},

  // Sweden
  {countryId:'se',countryName:'Sweden',subdivisionId:'se_stockholm',locationName:'Stockholm Old Town',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Stockholms_gamla_stan%2C_2012.jpg/600px-Stockholms_gamla_stan%2C_2012.jpg'},

  // Norway
  {countryId:'no',countryName:'Norway',subdivisionId:'no_vestland',locationName:'Bergen Bryggen',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Bryggen_in_Bergen_-_panoramio.jpg/600px-Bryggen_in_Bergen_-_panoramio.jpg'},

  // Denmark
  {countryId:'dk',countryName:'Denmark',subdivisionId:'dk_capital_region',locationName:'Nyhavn, Copenhagen',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Nyhavn_copenhagen.jpg/600px-Nyhavn_copenhagen.jpg'},

  // Austria
  {countryId:'at',countryName:'Austria',subdivisionId:'at_wien',locationName:'Schonbrunn Palace',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Schloss_Sch%C3%B6nbrunn_-_Gartenseite.jpg/600px-Schloss_Sch%C3%B6nbrunn_-_Gartenseite.jpg'},

  // Netherlands
  {countryId:'nl',countryName:'Netherlands',subdivisionId:'nl_north_holland',locationName:'Amsterdam Canals',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/KeijssersGracht.jpg/600px-KeijsssersGracht.jpg'},

  // Czech Republic
  {countryId:'cz',countryName:'Czech Republic',subdivisionId:'cz_prague',locationName:'Charles Bridge',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Prague_-_Charles_Bridge.jpg/600px-Prague_-_Charles_Bridge.jpg'},

  // Poland
  {countryId:'pl',countryName:'Poland',subdivisionId:'pl_lesser_poland',locationName:'Wawel Castle',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Wawel_castle.jpg/600px-Wawel_castle.jpg'},

  // Hungary
  {countryId:'hu',countryName:'Hungary',subdivisionId:'hu_budapest',locationName:'Hungarian Parliament',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Budapest_Parliament_4604.jpg/600px-Budapest_Parliament_4604.jpg'},

  // Croatia
  {countryId:'hr',countryName:'Croatia',subdivisionId:'hr_dubrovnik_neretva',locationName:'Dubrovnik',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Dubrovnik_crop.jpg/600px-Dubrovnik_crop.jpg'},

  // Romania
  {countryId:'ro',countryName:'Romania',subdivisionId:'ro_bra_ov',locationName:'Bran Castle',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/CastelulBran1.jpg/600px-CastelulBran1.jpg'},

  // Ireland
  {countryId:'ie',countryName:'Ireland',subdivisionId:'ie_clare',locationName:'Cliffs of Moher',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Cliffs_of_Moher%2C_looking_north%2C_Clare_-_geograph.org.uk_-_53969.jpg/600px-Cliffs_of_Moher%2C_looking_north%2C_Clare_-_geograph.org.uk_-_53969.jpg'},

  // Switzerland
  {countryId:'ch',countryName:'Switzerland',subdivisionId:'ch_bern',locationName:'Bern Old City',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Bern_Altstadt.jpg/600px-Bern_Altstadt.jpg'},

  // ===== AMERICAS =====
  // United States
  {countryId:'us',countryName:'United States',subdivisionId:'us_new_york',locationName:'Statue of Liberty',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Statue_of_Liberty_7.jpg/600px-Statue_of_Liberty_7.jpg'},
  {countryId:'us',countryName:'United States',subdivisionId:'us_california',locationName:'Golden Gate Bridge',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/GoldenGateBridge-001.jpg/600px-GoldenGateBridge-001.jpg'},
  {countryId:'us',countryName:'United States',subdivisionId:'us_arizona',locationName:'Grand Canyon',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Dawn_on_the_S_rim_of_the_Grand_Canyon_%288645178272%29.jpg/600px-Dawn_on_the_S_rim_of_the_Grand_Canyon_%288645178272%29.jpg'},
  {countryId:'us',countryName:'United States',subdivisionId:'us_south_dakota',locationName:'Mount Rushmore',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Mount_Rushmore_detail_view_%28100MP%29.jpg/600px-Mount_Rushmore_detail_view_%28100MP%29.jpg'},
  {countryId:'us',countryName:'United States',subdivisionId:'us_district_of_columbia',locationName:'White House',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/White_House_north_and_south_sides.jpg/600px-White_House_north_and_south_sides.jpg'},

  // Canada
  {countryId:'ca',countryName:'Canada',subdivisionId:'ca_ontario',locationName:'Parliament Hill',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Ottawa_-_ON_-_Parliament_Hill.jpg/600px-Ottawa_-_ON_-_Parliament_Hill.jpg'},
  {countryId:'ca',countryName:'Canada',subdivisionId:'ca_alberta',locationName:'Banff National Park',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Moraine_Lake_17092005.jpg/600px-Moraine_Lake_17092005.jpg'},
  {countryId:'ca',countryName:'Canada',subdivisionId:'ca_british_columbia',locationName:'Vancouver Skyline',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Vancouverskyline.jpg/600px-Vancouverskyline.jpg'},

  // Mexico
  {countryId:'mx',countryName:'Mexico',subdivisionId:'mx_ciudad_de_m_xico',locationName:'Palacio de Bellas Artes',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Palacio_de_Bellas_Artes_-_Ciudad_de_M%C3%A9xico.jpg/600px-Palacio_de_Bellas_Artes_-_Ciudad_de_M%C3%A9xico.jpg'},
  {countryId:'mx',countryName:'Mexico',subdivisionId:'mx_yucat_n',locationName:'Chichen Itza',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Chichen_Itza_3.jpg/600px-Chichen_Itza_3.jpg'},
  {countryId:'mx',countryName:'Mexico',subdivisionId:'mx_guanajuato',locationName:'Guanajuato',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Guanajuato_city_center.jpg/600px-Guanajuato_city_center.jpg'},

  // Cuba
  {countryId:'cu',countryName:'Cuba',subdivisionId:'cu_la_habana',locationName:'El Capitolio, Havana',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/El_Capitolio_Havana.jpg/600px-El_Capitolio_Havana.jpg'},
  {countryId:'cu',countryName:'Cuba',subdivisionId:'cu_sancti_sp_ritus',locationName:'Trinidad',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Trinidad_%28Kuba%29_02.jpg/600px-Trinidad_%28Kuba%29_02.jpg'},

  // Brazil
  {countryId:'br',countryName:'Brazil',subdivisionId:'br_rio_de_janeiro',locationName:'Christ the Redeemer',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Christ_the_Redeemer_-_Cristo_Redentor.jpg/600px-Christ_the_Redeemer_-_Cristo_Redentor.jpg'},
  {countryId:'br',countryName:'Brazil',subdivisionId:'br_amazonas',locationName:'Amazon Theatre',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Teatro_Amazonas_in_Manaus.jpg/600px-Teatro_Amazonas_in_Manaus.jpg'},
  {countryId:'br',countryName:'Brazil',subdivisionId:'br_distrito_federal',locationName:'Cathedral of Brasilia',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Catedral_Metropolitana_de_Bras%C3%ADlia.jpg/600px-Catedral_Metropolitana_de_Bras%C3%ADlia.jpg'},

  // Argentina
  {countryId:'ar',countryName:'Argentina',subdivisionId:'ar_buenos_aires',locationName:'Obelisco',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Buenos_Aires_-_Avenida_9_de_Julio.jpg/600px-Buenos_Aires_-_Avenida_9_de_Julio.jpg'},
  {countryId:'ar',countryName:'Argentina',subdivisionId:'ar_misiones',locationName:'Iguazu Falls',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Iguazu_D%C3%A9cembre_2007_-_Panorama_3.jpg/600px-Iguazu_D%C3%A9cembre_2007_-_Panorama_3.jpg'},

  // Colombia
  {countryId:'co',countryName:'Colombia',subdivisionId:'co_bogot_',locationName:'Monserrate',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Monserrate_Bogot%C3%A1.jpg/600px-Monserrate_Bogot%C3%A1.jpg'},
  {countryId:'co',countryName:'Colombia',subdivisionId:'co_bol_var',locationName:'Cartagena',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Bocagrande_-_Cartagena_de_Indias.jpg/600px-Bocagrande_-_Cartagena_de_Indias.jpg'},

  // Peru
  {countryId:'pe',countryName:'Peru',subdivisionId:'pe_cusco',locationName:'Machu Picchu',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/600px-Machu_Picchu%2C_Peru.jpg'},

  // Chile
  {countryId:'cl',countryName:'Chile',subdivisionId:'cl_magallanes',locationName:'Torres del Paine',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Cuernos_del_Paine_from_Lake_Peho%C3%A9.jpg/600px-Cuernos_del_Paine_from_Lake_Peho%C3%A9.jpg'},

  // Bolivia
  {countryId:'bo',countryName:'Bolivia',subdivisionId:'bo_potos_',locationName:'Salar de Uyuni',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Salar_de_Uyuni_-_Day.jpg/600px-Salar_de_Uyuni_-_Day.jpg'},

  // Costa Rica
  {countryId:'cr',countryName:'Costa Rica',subdivisionId:'cr_guanacaste',locationName:'Arenal Volcano',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Arenal_Volcano_-_Costa_Rica_-_by_Ardyiii.jpg/600px-Arenal_Volcano_-_Costa_Rica_-_by_Ardyiii.jpg'},

  // Guatemala
  {countryId:'gt',countryName:'Guatemala',subdivisionId:'gt_pet_n',locationName:'Tikal',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Tikal_mbread.jpg/600px-Tikal_mbreak.jpg'},

  // Panama
  {countryId:'pa',countryName:'Panama',subdivisionId:'pa_panam_',locationName:'Panama Canal',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Panama_Canal_Gatun_Locks.jpg/600px-Panama_Canal_Gatun_Locks.jpg'},

  // ===== ASIA =====
  // Japan
  {countryId:'jp',countryName:'Japan',subdivisionId:'jp_tokyo',locationName:'Tokyo Tower',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/TaroTokyo20110213-TokyoTower-01min.jpg/600px-TaroTokyo20110213-TokyoTower-01min.jpg'},
  {countryId:'jp',countryName:'Japan',subdivisionId:'jp_kyoto',locationName:'Fushimi Inari Shrine',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Fushimi_Inari-taisha_Senbon-Torii.jpg/600px-Fushimi_Inari-taisha_Senbon-Torii.jpg'},
  {countryId:'jp',countryName:'Japan',subdivisionId:'jp_hiroshima',locationName:'Itsukushima Shrine',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Itsukushima_Shrine_Torii_Gate.jpg/600px-Itsukushima_Shrine_Torii_Gate.jpg'},
  {countryId:'jp',countryName:'Japan',subdivisionId:'jp_osaka',locationName:'Osaka Castle',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Osaka_Castle_Nishinomaru_Garden_April_2005.JPG/600px-Osaka_Castle_Nishinomaru_Garden_April_2005.JPG'},

  // South Korea
  {countryId:'kr',countryName:'South Korea',subdivisionId:'kr_seoul',locationName:'Gyeongbokgung',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/%EA%B2%BD%EB%B3%B5%EA%B6%81_%EA%B7%BC%EC%A0%95%EC%A0%84_%EC%95%9E_%EC%96%B4%EB%8F%84.jpg/600px-%EA%B2%BD%EB%B3%B5%EA%B6%81_%EA%B7%BC%EC%A0%95%EC%A0%84_%EC%95%9E_%EC%96%B4%EB%8F%84.jpg'},

  // China
  {countryId:'cn',countryName:'China',subdivisionId:'cn_beijing',locationName:'Forbidden City',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Forbidden_city_07.jpg/600px-Forbidden_city_07.jpg'},
  {countryId:'cn',countryName:'China',subdivisionId:'cn_beijing',locationName:'Great Wall of China',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/600px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg'},
  {countryId:'cn',countryName:'China',subdivisionId:'cn_shaanxi',locationName:'Terracotta Army',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Terracotta_Army%2C_View_of_Pit_1.jpg/600px-Terracotta_Army%2C_View_of_Pit_1.jpg'},

  // India
  {countryId:'in',countryName:'India',subdivisionId:'in_uttar_pradesh',locationName:'Taj Mahal',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/600px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg'},
  {countryId:'in',countryName:'India',subdivisionId:'in_rajasthan',locationName:'Hawa Mahal',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Hawa_Mahal_2011.jpg/600px-Hawa_Mahal_2011.jpg'},

  // Thailand
  {countryId:'th',countryName:'Thailand',subdivisionId:'th_bangkok',locationName:'Wat Arun',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Wat_Arun_Bangkok.jpg/600px-Wat_Arun_Bangkok.jpg'},

  // Turkey
  {countryId:'tr',countryName:'Turkey',subdivisionId:'tr_istanbul',locationName:'Hagia Sophia',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Hagia_Sophia_Mars_2013.jpg/600px-Hagia_Sophia_Mars_2013.jpg'},
  {countryId:'tr',countryName:'Turkey',subdivisionId:'tr_nev_ehir',locationName:'Cappadocia',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Cappadocia_balloon_inflating.jpg/600px-Cappadocia_balloon_inflating.jpg'},

  // Israel
  {countryId:'il',countryName:'Israel',subdivisionId:'il_jerusalem',locationName:'Western Wall',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Western_Wall_2.jpg/600px-Western_Wall_2.jpg'},

  // UAE
  {countryId:'ae',countryName:'UAE',subdivisionId:'ae_dubai',locationName:'Burj Khalifa',photoUrl:'https://upload.wikimedia.org/wikipedia/en/thumb/9/93/Burj_Khalifa.jpg/600px-Burj_Khalifa.jpg'},

  // Indonesia
  {countryId:'id',countryName:'Indonesia',subdivisionId:'id_central_java',locationName:'Borobudur',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Borobudur-Nothwest-view.jpg/600px-Borobudur-Nothwest-view.jpg'},

  // Malaysia
  {countryId:'my',countryName:'Malaysia',subdivisionId:'my_kuala_lumpur',locationName:'Petronas Towers',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Petronas_Panorama_II.jpg/600px-Petronas_Panorama_II.jpg'},

  // ===== AFRICA =====
  // Egypt
  {countryId:'eg',countryName:'Egypt',subdivisionId:'eg_giza',locationName:'Great Pyramid',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/600px-Kheops-Pyramid.jpg'},
  {countryId:'eg',countryName:'Egypt',subdivisionId:'eg_luxor',locationName:'Valley of the Kings',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Valley_of_the_Kings_panorama.jpg/600px-Valley_of_the_Kings_panorama.jpg'},

  // South Africa
  {countryId:'za',countryName:'South Africa',subdivisionId:'za_western_cape',locationName:'Table Mountain',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Table_Mountain_DavidNewton.jpg/600px-Table_Mountain_DavidNewton.jpg'},

  // Morocco
  {countryId:'ma',countryName:'Morocco',subdivisionId:'ma_marrakech_safi',locationName:'Marrakech',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Jemaa_el-Fnaa.jpg/600px-Jemaa_el-Fnaa.jpg'},

  // Kenya
  {countryId:'ke',countryName:'Kenya',subdivisionId:'ke_nairobi',locationName:'Nairobi',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Nairobi_Skyline_from_Nairobi_National_Park.jpg/600px-Nairobi_Skyline_from_Nairobi_National_Park.jpg'},

  // Tanzania
  {countryId:'tz',countryName:'Tanzania',subdivisionId:'tz_kilimanjaro',locationName:'Mount Kilimanjaro',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Mt._Kilimanjaro_12.2006.04.jpg/600px-Mt._Kilimanjaro_12.2006.04.jpg'},

  // ===== OCEANIA =====
  // Australia
  {countryId:'au',countryName:'Australia',subdivisionId:'au_new_south_wales',locationName:'Sydney Opera House',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Sydney_Australia._%2821339175489%29.jpg/600px-Sydney_Australia._%2821339175489%29.jpg'},
  {countryId:'au',countryName:'Australia',subdivisionId:'au_northern_territory',locationName:'Uluru',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Uluru_Panorama.jpg/600px-Uluru_Panorama.jpg'},

  // New Zealand
  {countryId:'nz',countryName:'New Zealand',subdivisionId:'nz_otago',locationName:'Milford Sound',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/MilfordSound.jpg/600px-MilfordSound.jpg'},

  // ===== RUSSIA =====
  {countryId:'ru',countryName:'Russia',subdivisionId:'ru_moscow',locationName:'Red Square',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/RedSquare_SaintBasile_%28pixinn.net%29.jpg/600px-RedSquare_SaintBasile_%28pixinn.net%29.jpg'},
  {countryId:'ru',countryName:'Russia',subdivisionId:'ru_saint_petersburg',locationName:'Hermitage Museum',photoUrl:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Hermitage_Museum%2C_Saint_Petersburg%2C_Russia.jpg/600px-Hermitage_Museum%2C_Saint_Petersburg%2C_Russia.jpg'},
];

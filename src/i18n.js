/* Internationalization — 12 languages */

const TRANSLATIONS = {
  en: {
    // Home
    heroTitle: 'Pin<span style="color:var(--primary)">The</span>World',
    heroDesc: 'Drop a pin. Guess the location. How close can you get?',
    places: 'Places',
    people: 'People',
    play: 'Play',
    createLevels: 'Help us create levels!',
    signIn: 'Sign In',
    terms: 'Terms',
    privacy: 'Privacy',
    // Game
    selectCountry: 'Select a country',
    selectRegion: 'Select region in',
    confirmRegion: 'Confirm Region',
    roundOf: 'of',
    pts: 'pts',
    nailedIt: 'Nailed it!',
    kmAway: 'km away',
    mAway: 'm away',
    nextRound: 'Next Round',
    // Game Over
    gameOver: 'Game Over!',
    share: 'Share',
    playAgain: 'Play Again',
    changeCountry: 'Home',
    // Profile
    profile: 'Profile',
    games: 'Games',
    score: 'Score',
    streak: 'Streak',
    perfects: 'Perfects',
    // Wizard
    wizPhoto: 'Photo',
    wizLocation: 'Location',
    wizDetails: 'Details',
    wizConfirm: 'Confirm',
    uploadPhoto: 'Upload a photo',
    uploadDesc: 'This is what players will see and try to guess the location of',
    placeBusiness: 'Place / Business',
    personCupido: 'Person / Cupido',
    hintPlaces: 'Promote a business or place',
    hintPeople: 'Find your match — Cupido style',
    clickDrag: 'Click or drag a photo',
    maxSize: 'Max 5MB — JPG, PNG, WebP',
    orPasteUrl: 'or paste URL',
    nextLocation: 'Next: Location',
    nextDetails: 'Next: Details',
    nextPreview: 'Next: Preview',
    back: 'Back',
    skipNoPromo: 'Skip — no promo',
    details: 'Details',
    yourName: 'Your name (optional)',
    anonymous: 'Anonymous',
    promoteBusiness: 'Promote your business',
    promoteCupido: 'Promote yourself — Cupido',
    businessName: 'Business name',
    yourNameLabel: 'Your name',
    description: 'Description',
    aboutYou: 'About you',
    tellBusiness: 'Tell people about your business...',
    tellYourself: 'Tell people about yourself...',
    previewSubmit: 'Preview & Submit',
    previewDesc: 'This is how your level will look in the game',
    promoLabel: 'PROMO CARD — Players see this after guessing',
    submitFree: 'Submit Level (Free)',
    submitPay: 'Submit & Pay',
    uploading: 'Uploading...',
    submitted: 'Level submitted! Thank you!',
    promoSubmitted: 'Submitted! Payment processing coming soon.',
    selectCountryRegion: 'Select a country, then a region',
    // Limits
    signInMore: 'Sign in to play up to 5 times daily!',
    dailyLimit: 'Daily limit reached! Get unlimited plays for $3.99',
    // Leaderboard
    leaderboard: 'Leaderboard',
    country: 'Country',
    global: 'Global',
    // Achievement
    achievementUnlocked: 'Achievement Unlocked!',
  },
  es: {
    heroTitle: 'Pin<span style="color:var(--primary)">The</span>World',
    heroDesc: 'Pon un pin. Adivina la ubicacion. ¿Que tan cerca puedes llegar?',
    places: 'Lugares',
    people: 'Personas',
    play: 'Jugar',
    createLevels: '¡Ayudanos a crear niveles!',
    signIn: 'Iniciar sesion',
    terms: 'Terminos',
    privacy: 'Privacidad',
    selectCountry: 'Selecciona un pais',
    selectRegion: 'Selecciona region en',
    confirmRegion: 'Confirmar Region',
    roundOf: 'de',
    pts: 'pts',
    nailedIt: '¡Perfecto!',
    kmAway: 'km de distancia',
    mAway: 'm de distancia',
    nextRound: 'Siguiente Ronda',
    gameOver: '¡Fin del Juego!',
    share: 'Compartir',
    playAgain: 'Jugar de Nuevo',
    changeCountry: 'Inicio',
    profile: 'Perfil',
    games: 'Partidas',
    score: 'Puntos',
    streak: 'Racha',
    perfects: 'Perfectos',
    wizPhoto: 'Foto',
    wizLocation: 'Ubicacion',
    wizDetails: 'Detalles',
    wizConfirm: 'Confirmar',
    uploadPhoto: 'Sube una foto',
    uploadDesc: 'Esto es lo que los jugadores veran e intentaran adivinar la ubicacion',
    placeBusiness: 'Lugar / Negocio',
    personCupido: 'Persona / Cupido',
    hintPlaces: 'Promociona un negocio o lugar',
    hintPeople: 'Encuentra tu pareja — estilo Cupido',
    clickDrag: 'Haz clic o arrastra una foto',
    maxSize: 'Max 5MB — JPG, PNG, WebP',
    orPasteUrl: 'o pega URL',
    nextLocation: 'Siguiente: Ubicacion',
    nextDetails: 'Siguiente: Detalles',
    nextPreview: 'Siguiente: Preview',
    back: 'Atras',
    skipNoPromo: 'Saltar — sin promo',
    details: 'Detalles',
    yourName: 'Tu nombre (opcional)',
    anonymous: 'Anonimo',
    promoteBusiness: 'Promocionar tu negocio',
    promoteCupido: 'Promocionate — Cupido',
    businessName: 'Nombre del negocio',
    yourNameLabel: 'Tu nombre',
    description: 'Descripcion',
    aboutYou: 'Sobre ti',
    tellBusiness: 'Cuenta sobre tu negocio...',
    tellYourself: 'Cuenta sobre ti...',
    previewSubmit: 'Preview y Enviar',
    previewDesc: 'Asi se vera tu nivel en el juego',
    promoLabel: 'TARJETA PROMO — Los jugadores ven esto al adivinar',
    submitFree: 'Enviar Nivel (Gratis)',
    submitPay: 'Enviar y Pagar',
    uploading: 'Subiendo...',
    submitted: '¡Nivel enviado! ¡Gracias!',
    promoSubmitted: '¡Enviado! Pago disponible proximamente.',
    selectCountryRegion: 'Selecciona un pais, luego una region',
    signInMore: '¡Inicia sesion para jugar hasta 5 veces al dia!',
    dailyLimit: '¡Limite diario alcanzado! Juega ilimitado por $3.99',
    leaderboard: 'Clasificacion',
    country: 'Pais',
    global: 'Global',
    achievementUnlocked: '¡Logro Desbloqueado!',
  },
  fr: {
    heroDesc: 'Placez une epingle. Devinez le lieu. A quel point pouvez-vous vous approcher?',
    places: 'Lieux', people: 'Personnes', play: 'Jouer', createLevels: 'Aidez-nous a creer des niveaux!',
    signIn: 'Connexion', terms: 'Conditions', privacy: 'Confidentialite',
    selectCountry: 'Selectionnez un pays', confirmRegion: 'Confirmer la Region',
    nextRound: 'Tour Suivant', gameOver: 'Fin de la Partie!', share: 'Partager', playAgain: 'Rejouer',
    profile: 'Profil', games: 'Parties', score: 'Score', streak: 'Serie', perfects: 'Parfaits',
    uploadPhoto: 'Telecharger une photo', back: 'Retour', submitFree: 'Soumettre (Gratuit)',
    leaderboard: 'Classement', achievementUnlocked: 'Succes Debloque!',
  },
  pt: {
    heroDesc: 'Coloque um pin. Adivinhe a localizacao. Quao perto voce consegue chegar?',
    places: 'Lugares', people: 'Pessoas', play: 'Jogar', createLevels: 'Ajude-nos a criar niveis!',
    signIn: 'Entrar', terms: 'Termos', privacy: 'Privacidade',
    selectCountry: 'Selecione um pais', confirmRegion: 'Confirmar Regiao',
    nextRound: 'Proxima Rodada', gameOver: 'Fim de Jogo!', share: 'Compartilhar', playAgain: 'Jogar Novamente',
    profile: 'Perfil', games: 'Jogos', score: 'Pontos', streak: 'Sequencia', perfects: 'Perfeitos',
    uploadPhoto: 'Envie uma foto', back: 'Voltar', submitFree: 'Enviar (Gratis)',
    leaderboard: 'Classificacao', achievementUnlocked: 'Conquista Desbloqueada!',
  },
  de: {
    heroDesc: 'Setze eine Nadel. Rate den Ort. Wie nah kommst du ran?',
    places: 'Orte', people: 'Personen', play: 'Spielen', createLevels: 'Hilf uns Levels zu erstellen!',
    signIn: 'Anmelden', terms: 'AGB', privacy: 'Datenschutz',
    selectCountry: 'Wahle ein Land', confirmRegion: 'Region bestatigen',
    nextRound: 'Nachste Runde', gameOver: 'Spielende!', share: 'Teilen', playAgain: 'Nochmal',
    profile: 'Profil', games: 'Spiele', score: 'Punkte', streak: 'Serie', perfects: 'Perfekt',
    leaderboard: 'Rangliste', achievementUnlocked: 'Erfolg freigeschaltet!',
  },
  it: {
    heroDesc: 'Metti un pin. Indovina il luogo. Quanto vicino riesci ad arrivare?',
    places: 'Luoghi', people: 'Persone', play: 'Gioca', createLevels: 'Aiutaci a creare livelli!',
    signIn: 'Accedi', terms: 'Termini', privacy: 'Privacy',
    selectCountry: 'Seleziona un paese', confirmRegion: 'Conferma Regione',
    nextRound: 'Prossimo Round', gameOver: 'Fine Partita!', share: 'Condividi', playAgain: 'Gioca Ancora',
    profile: 'Profilo', games: 'Partite', score: 'Punti', streak: 'Serie', perfects: 'Perfetti',
    leaderboard: 'Classifica', achievementUnlocked: 'Obiettivo Sbloccato!',
  },
  ja: {
    heroDesc: 'ピンを置いて、場所を当てよう。どれだけ近づける？',
    places: '場所', people: '人物', play: 'プレイ', createLevels: 'レベル作成に協力！',
    signIn: 'ログイン', terms: '利用規約', privacy: 'プライバシー',
    selectCountry: '国を選択', confirmRegion: '地域を確定',
    nextRound: '次のラウンド', gameOver: 'ゲームオーバー！', share: '共有', playAgain: 'もう一度',
    profile: 'プロフィール', games: 'ゲーム数', score: 'スコア', streak: '連続', perfects: 'パーフェクト',
    leaderboard: 'ランキング', achievementUnlocked: '実績解除！',
  },
  ko: {
    heroDesc: '핀을 놓고, 위치를 맞춰보세요. 얼마나 가까이 갈 수 있나요?',
    places: '장소', people: '사람', play: '플레이', createLevels: '레벨 만들기에 참여하세요!',
    signIn: '로그인', terms: '이용약관', privacy: '개인정보',
    selectCountry: '나라 선택', confirmRegion: '지역 확인',
    nextRound: '다음 라운드', gameOver: '게임 오버!', share: '공유', playAgain: '다시 하기',
    profile: '프로필', games: '게임', score: '점수', streak: '연속', perfects: '퍼펙트',
    leaderboard: '순위', achievementUnlocked: '업적 달성!',
  },
  zh: {
    heroDesc: '放置图钉，猜测位置。你能有多接近？',
    places: '地点', people: '人物', play: '开始', createLevels: '帮我们创建关卡！',
    signIn: '登录', terms: '条款', privacy: '隐私',
    selectCountry: '选择国家', confirmRegion: '确认地区',
    nextRound: '下一轮', gameOver: '游戏结束！', share: '分享', playAgain: '再来一次',
    profile: '个人资料', games: '游戏', score: '分数', streak: '连续', perfects: '完美',
    leaderboard: '排行榜', achievementUnlocked: '成就解锁！',
  },
  ar: {
    heroDesc: 'ضع دبوسا. خمن الموقع. كم يمكنك الاقتراب؟',
    places: 'أماكن', people: 'أشخاص', play: 'العب', createLevels: 'ساعدنا في إنشاء مراحل!',
    signIn: 'تسجيل الدخول', terms: 'الشروط', privacy: 'الخصوصية',
    selectCountry: 'اختر بلدا', confirmRegion: 'تأكيد المنطقة',
    nextRound: 'الجولة التالية', gameOver: 'انتهت اللعبة!', share: 'مشاركة', playAgain: 'العب مجددا',
    profile: 'الملف الشخصي', games: 'ألعاب', score: 'النقاط', streak: 'متتالي', perfects: 'مثالي',
    leaderboard: 'لوحة المتصدرين', achievementUnlocked: 'إنجاز مفتوح!',
  },
  hi: {
    heroDesc: 'पिन लगाओ। स्थान का अनुमान लगाओ। कितने करीब पहुंच सकते हो?',
    places: 'स्थान', people: 'लोग', play: 'खेलें', createLevels: 'लेवल बनाने में मदद करें!',
    signIn: 'साइन इन', terms: 'शर्तें', privacy: 'गोपनीयता',
    selectCountry: 'देश चुनें', confirmRegion: 'क्षेत्र पुष्टि करें',
    nextRound: 'अगला राउंड', gameOver: 'खेल खत्म!', share: 'साझा करें', playAgain: 'फिर से खेलें',
    profile: 'प्रोफ़ाइल', games: 'खेल', score: 'अंक', streak: 'लगातार', perfects: 'परफेक्ट',
    leaderboard: 'लीडरबोर्ड', achievementUnlocked: 'उपलब्धि अनलॉक!',
  },
  ru: {
    heroDesc: 'Поставь булавку. Угадай место. Насколько близко ты можешь попасть?',
    places: 'Места', people: 'Люди', play: 'Играть', createLevels: 'Помоги создать уровни!',
    signIn: 'Войти', terms: 'Условия', privacy: 'Конфиденциальность',
    selectCountry: 'Выбери страну', confirmRegion: 'Подтвердить регион',
    nextRound: 'Следующий раунд', gameOver: 'Игра окончена!', share: 'Поделиться', playAgain: 'Ещё раз',
    profile: 'Профиль', games: 'Игры', score: 'Очки', streak: 'Серия', perfects: 'Идеально',
    leaderboard: 'Рейтинг', achievementUnlocked: 'Достижение разблокировано!',
  },
};

let currentLang = 'en';

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('ptw_lang', lang);
  applyTranslations();
}

export function getLang() {
  return currentLang;
}

export function t(key) {
  return TRANSLATIONS[currentLang]?.[key] || TRANSLATIONS.en[key] || key;
}

export function initI18n() {
  currentLang = localStorage.getItem('ptw_lang') || navigator.language?.slice(0, 2) || 'en';
  if (!TRANSLATIONS[currentLang]) currentLang = 'en';
  applyTranslations();
}

function applyTranslations() {
  // Home screen
  const heroTitle = document.querySelector('.world-hero h2');
  if (heroTitle) heroTitle.innerHTML = t('heroTitle');
  setText('.world-hero p', t('heroDesc'));
  setText('#btn-play-places', t('places'), true);
  setText('#btn-play-people', t('people'), true);
  setText('#btn-play-go', t('play'));
  setText('#btn-create-levels', t('createLevels'), true);
  setText('#btn-auth', document.querySelector('#btn-auth')?.textContent === 'Sign In' ? t('signIn') : null);

  // Footer
  const termsLink = document.querySelector('.footer-links a[href="/terms.html"]');
  const privacyLink = document.querySelector('.footer-links a[href="/privacy.html"]');
  if (termsLink) termsLink.textContent = t('terms');
  if (privacyLink) privacyLink.textContent = t('privacy');

  // Game
  setText('#btn-confirm', t('confirmRegion'));
  setText('#btn-next-round', t('nextRound'));
  setText('#btn-share', t('share'));
  setText('#btn-play-again', t('playAgain'));
  setText('#btn-change-country', t('changeCountry'));

  // Game over
  const goTitle = document.querySelector('.gameover-modal h2');
  if (goTitle) goTitle.textContent = t('gameOver');

  // Wizard
  const steps = document.querySelectorAll('.wizard-step');
  const stepNames = ['wizPhoto', 'wizLocation', 'wizDetails', 'wizConfirm'];
  steps.forEach((s, i) => {
    if (stepNames[i]) {
      const span = s.querySelector('span');
      const num = span ? span.outerHTML : '';
      s.innerHTML = num + ' ' + t(stepNames[i]);
    }
  });

  const wizH2 = document.querySelector('#wizard-step-1 h2');
  if (wizH2) wizH2.textContent = t('uploadPhoto');
  setText('#wizard-step-1 .wizard-desc', t('uploadDesc'));
  setText('#wizard-next-1', t('nextLocation'));
  setText('#wizard-back-2', t('back'));
  setText('#wizard-next-2', t('nextDetails'));
  setText('#wizard-back-3', t('back'));
  setText('#wizard-skip-3', t('skipNoPromo'));
  setText('#wizard-next-3', t('nextPreview'));
  setText('#wizard-back-4', t('back'));

  // Leaderboard
  const lbTitle = document.querySelector('.leaderboard-modal h2');
  if (lbTitle) lbTitle.textContent = t('leaderboard');

  // Profile
  const profTitle = document.querySelector('.profile-modal h2');
  if (profTitle) profTitle.textContent = t('profile');

  // Language select
  const langSelect = document.querySelector('#lang-select');
  if (langSelect) langSelect.value = currentLang;
}

function setText(sel, text, preserveSvg) {
  const el = document.querySelector(sel);
  if (!el || !text) return;
  if (preserveSvg) {
    const svg = el.querySelector('svg');
    if (svg) {
      el.innerHTML = '';
      el.appendChild(svg);
      el.appendChild(document.createTextNode(' ' + text));
    } else {
      el.textContent = text;
    }
  } else {
    el.textContent = text;
  }
}

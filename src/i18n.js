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
    // Daily Challenge
    dailyChallenge: 'Daily Challenge',
    dailyAlreadyPlayed: "You already played today's Daily Challenge!",
    // Building Levels
    buildingLevels: 'Building Levels',
    noRoundsYet: 'No rounds available yet. Help us build the game by creating new levels!',
    createLevel: 'Create a Level',
    backToHome: 'Back to Home',
    // Payments
    welcomePremium: 'Welcome to Premium! Unlimited plays unlocked.',
    paymentSuccess: 'Payment successful! Your promo is live.',
    paymentCancelled: 'Payment was cancelled.',
    // Results
    correctCountry: '✓ Correct country!',
    wrongCountry: '✗ Wrong country',
    exactMatch: 'Exact match!',
    amazing: 'Amazing!',
    soClose: 'So close!',
    close: 'Close',
    notBad: 'Not bad',
    far: 'Far',
    veryFar: 'Very far',
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
    dailyChallenge: 'Desafio Diario',
    dailyAlreadyPlayed: '¡Ya jugaste el Desafio Diario de hoy!',
    buildingLevels: 'Construyendo Niveles',
    noRoundsYet: 'No hay rondas disponibles. ¡Ayudanos a crear niveles!',
    createLevel: 'Crear un Nivel',
    backToHome: 'Volver al Inicio',
    welcomePremium: '¡Bienvenido a Premium! Juega ilimitado.',
    paymentSuccess: '¡Pago exitoso! Tu promo esta activa.',
    paymentCancelled: 'El pago fue cancelado.',
    correctCountry: '✓ ¡Pais correcto!',
    wrongCountry: '✗ Pais incorrecto',
    exactMatch: '¡Exacto!',
    amazing: '¡Increible!',
    soClose: '¡Muy cerca!',
    close: 'Cerca',
    notBad: 'No esta mal',
    far: 'Lejos',
    veryFar: 'Muy lejos',
  },
  fr: {
    heroDesc: 'Placez une epingle. Devinez le lieu. A quel point pouvez-vous vous approcher?',
    places: 'Lieux', people: 'Personnes', play: 'Jouer', createLevels: 'Aidez-nous a creer des niveaux!',
    signIn: 'Connexion', terms: 'Conditions', privacy: 'Confidentialite',
    selectCountry: 'Selectionnez un pays', selectRegion: 'Selectionnez une region dans', confirmRegion: 'Confirmer la Region',
    roundOf: 'de', pts: 'pts', nailedIt: 'En plein dans le mille!', kmAway: 'km', mAway: 'm',
    nextRound: 'Tour Suivant', gameOver: 'Fin de la Partie!', share: 'Partager', playAgain: 'Rejouer', changeCountry: 'Accueil',
    profile: 'Profil', games: 'Parties', score: 'Score', streak: 'Serie', perfects: 'Parfaits',
    wizPhoto: 'Photo', wizLocation: 'Lieu', wizDetails: 'Details', wizConfirm: 'Confirmer',
    uploadPhoto: 'Telecharger une photo', uploadDesc: 'Les joueurs verront ceci et devineront le lieu',
    placeBusiness: 'Lieu / Commerce', personCupido: 'Personne / Cupido',
    hintPlaces: 'Promouvoir un lieu', hintPeople: 'Trouvez votre match — style Cupido',
    clickDrag: 'Cliquez ou glissez une photo', maxSize: 'Max 5Mo — JPG, PNG, WebP', orPasteUrl: 'ou collez URL',
    nextLocation: 'Suivant: Lieu', nextDetails: 'Suivant: Details', nextPreview: 'Suivant: Apercu',
    back: 'Retour', skipNoPromo: 'Passer', yourName: 'Votre nom (optionnel)', anonymous: 'Anonyme',
    submitFree: 'Soumettre (Gratuit)', submitPay: 'Soumettre et Payer',
    uploading: 'Envoi...', submitted: 'Niveau soumis! Merci!', selectCountryRegion: 'Selectionnez un pays, puis une region',
    signInMore: 'Connectez-vous pour jouer 5 fois par jour!', dailyLimit: 'Limite atteinte! Illimite pour 3,99$',
    leaderboard: 'Classement', country: 'Pays', global: 'Mondial', achievementUnlocked: 'Succes Debloque!',
    dailyChallenge: 'Defi du Jour', dailyAlreadyPlayed: 'Vous avez deja joue le Defi du Jour!',
    buildingLevels: 'Niveaux en construction', noRoundsYet: 'Aucun niveau disponible. Aidez-nous a en creer!',
    createLevel: 'Creer un Niveau', backToHome: 'Retour a l\'accueil',
    welcomePremium: 'Bienvenue en Premium! Parties illimitees.', paymentSuccess: 'Paiement reussi!', paymentCancelled: 'Paiement annule.',
    correctCountry: '✓ Bon pays!', wrongCountry: '✗ Mauvais pays',
    exactMatch: 'Exact!', amazing: 'Incroyable!', soClose: 'Si proche!', close: 'Proche', notBad: 'Pas mal', far: 'Loin', veryFar: 'Tres loin',
  },
  pt: {
    heroDesc: 'Coloque um pin. Adivinhe a localizacao. Quao perto voce consegue chegar?',
    places: 'Lugares', people: 'Pessoas', play: 'Jogar', createLevels: 'Ajude-nos a criar niveis!',
    signIn: 'Entrar', terms: 'Termos', privacy: 'Privacidade',
    selectCountry: 'Selecione um pais', selectRegion: 'Selecione uma regiao em', confirmRegion: 'Confirmar Regiao',
    roundOf: 'de', pts: 'pts', nailedIt: 'Acertou em cheio!', kmAway: 'km', mAway: 'm',
    nextRound: 'Proxima Rodada', gameOver: 'Fim de Jogo!', share: 'Compartilhar', playAgain: 'Jogar Novamente', changeCountry: 'Inicio',
    profile: 'Perfil', games: 'Jogos', score: 'Pontos', streak: 'Sequencia', perfects: 'Perfeitos',
    wizPhoto: 'Foto', wizLocation: 'Local', wizDetails: 'Detalhes', wizConfirm: 'Confirmar',
    uploadPhoto: 'Envie uma foto', uploadDesc: 'Jogadores verao isso e tentarao adivinhar',
    placeBusiness: 'Lugar / Negocio', personCupido: 'Pessoa / Cupido',
    hintPlaces: 'Promova um negocio', hintPeople: 'Encontre seu par — estilo Cupido',
    clickDrag: 'Clique ou arraste uma foto', maxSize: 'Max 5MB — JPG, PNG, WebP', orPasteUrl: 'ou cole URL',
    nextLocation: 'Proximo: Local', nextDetails: 'Proximo: Detalhes', nextPreview: 'Proximo: Preview',
    back: 'Voltar', skipNoPromo: 'Pular', yourName: 'Seu nome (opcional)', anonymous: 'Anonimo',
    submitFree: 'Enviar (Gratis)', submitPay: 'Enviar e Pagar',
    uploading: 'Enviando...', submitted: 'Nivel enviado! Obrigado!', selectCountryRegion: 'Selecione um pais, depois uma regiao',
    signInMore: 'Entre para jogar ate 5 vezes por dia!', dailyLimit: 'Limite diario! Ilimitado por $3.99',
    leaderboard: 'Classificacao', country: 'Pais', global: 'Global', achievementUnlocked: 'Conquista Desbloqueada!',
    dailyChallenge: 'Desafio Diario', dailyAlreadyPlayed: 'Voce ja jogou o Desafio Diario de hoje!',
    buildingLevels: 'Construindo Niveis', noRoundsYet: 'Sem niveis disponiveis. Ajude-nos a criar!',
    createLevel: 'Criar um Nivel', backToHome: 'Voltar ao Inicio',
    welcomePremium: 'Bem-vindo ao Premium! Jogadas ilimitadas.', paymentSuccess: 'Pagamento aprovado!', paymentCancelled: 'Pagamento cancelado.',
    correctCountry: '✓ Pais correto!', wrongCountry: '✗ Pais errado',
    exactMatch: 'Exato!', amazing: 'Incrivel!', soClose: 'Tao perto!', close: 'Perto', notBad: 'Nada mal', far: 'Longe', veryFar: 'Muito longe',
  },
  de: {
    heroDesc: 'Setze eine Nadel. Rate den Ort. Wie nah kommst du ran?',
    places: 'Orte', people: 'Personen', play: 'Spielen', createLevels: 'Hilf uns Levels zu erstellen!',
    signIn: 'Anmelden', terms: 'AGB', privacy: 'Datenschutz',
    selectCountry: 'Wahle ein Land', selectRegion: 'Wahle Region in', confirmRegion: 'Region bestatigen',
    roundOf: 'von', pts: 'Pkt', nailedIt: 'Volltreffer!', kmAway: 'km', mAway: 'm',
    nextRound: 'Nachste Runde', gameOver: 'Spielende!', share: 'Teilen', playAgain: 'Nochmal', changeCountry: 'Start',
    profile: 'Profil', games: 'Spiele', score: 'Punkte', streak: 'Serie', perfects: 'Perfekt',
    wizPhoto: 'Foto', wizLocation: 'Ort', wizDetails: 'Details', wizConfirm: 'Bestatigen',
    uploadPhoto: 'Foto hochladen', uploadDesc: 'Spieler sehen dies und raten den Ort',
    placeBusiness: 'Ort / Geschaft', personCupido: 'Person / Cupido',
    hintPlaces: 'Geschaft bewerben', hintPeople: 'Finde dein Match — Cupido-Stil',
    clickDrag: 'Klicke oder ziehe ein Foto', maxSize: 'Max 5MB — JPG, PNG, WebP', orPasteUrl: 'oder URL einfugen',
    nextLocation: 'Weiter: Ort', nextDetails: 'Weiter: Details', nextPreview: 'Weiter: Vorschau',
    back: 'Zuruck', skipNoPromo: 'Uberspringen', yourName: 'Dein Name (optional)', anonymous: 'Anonym',
    submitFree: 'Einreichen (Gratis)', submitPay: 'Einreichen & Bezahlen',
    uploading: 'Hochladen...', submitted: 'Level eingereicht! Danke!', selectCountryRegion: 'Wahle ein Land, dann eine Region',
    signInMore: 'Anmelden fur 5 Spiele pro Tag!', dailyLimit: 'Tageslimit! Unbegrenzt fur 3,99$',
    leaderboard: 'Rangliste', country: 'Land', global: 'Global', achievementUnlocked: 'Erfolg freigeschaltet!',
    dailyChallenge: 'Tagliche Herausforderung', dailyAlreadyPlayed: 'Du hast die heutige Herausforderung schon gespielt!',
    buildingLevels: 'Levels im Aufbau', noRoundsYet: 'Keine Runden verfugbar. Hilf uns welche zu erstellen!',
    createLevel: 'Level erstellen', backToHome: 'Zur Startseite',
    welcomePremium: 'Willkommen bei Premium! Unbegrenzt spielen.', paymentSuccess: 'Zahlung erfolgreich!', paymentCancelled: 'Zahlung abgebrochen.',
    correctCountry: '✓ Richtiges Land!', wrongCountry: '✗ Falsches Land',
    exactMatch: 'Exakt!', amazing: 'Unglaublich!', soClose: 'So nah!', close: 'Nah', notBad: 'Nicht schlecht', far: 'Weit', veryFar: 'Sehr weit',
  },
  it: {
    heroDesc: 'Metti un pin. Indovina il luogo. Quanto vicino riesci ad arrivare?',
    places: 'Luoghi', people: 'Persone', play: 'Gioca', createLevels: 'Aiutaci a creare livelli!',
    signIn: 'Accedi', terms: 'Termini', privacy: 'Privacy',
    selectCountry: 'Seleziona un paese', selectRegion: 'Seleziona regione in', confirmRegion: 'Conferma Regione',
    roundOf: 'di', pts: 'pti', nailedIt: 'Centro!', kmAway: 'km', mAway: 'm',
    nextRound: 'Prossimo Round', gameOver: 'Fine Partita!', share: 'Condividi', playAgain: 'Gioca Ancora', changeCountry: 'Home',
    profile: 'Profilo', games: 'Partite', score: 'Punti', streak: 'Serie', perfects: 'Perfetti',
    wizPhoto: 'Foto', wizLocation: 'Luogo', wizDetails: 'Dettagli', wizConfirm: 'Conferma',
    uploadPhoto: 'Carica una foto', uploadDesc: 'I giocatori vedranno questo e proveranno a indovinare',
    placeBusiness: 'Luogo / Attivita', personCupido: 'Persona / Cupido',
    hintPlaces: 'Promuovi un\'attivita', hintPeople: 'Trova il tuo match — stile Cupido',
    clickDrag: 'Clicca o trascina una foto', maxSize: 'Max 5MB — JPG, PNG, WebP', orPasteUrl: 'o incolla URL',
    nextLocation: 'Avanti: Luogo', nextDetails: 'Avanti: Dettagli', nextPreview: 'Avanti: Anteprima',
    back: 'Indietro', skipNoPromo: 'Salta', yourName: 'Il tuo nome (opzionale)', anonymous: 'Anonimo',
    submitFree: 'Invia (Gratis)', submitPay: 'Invia e Paga',
    uploading: 'Caricamento...', submitted: 'Livello inviato! Grazie!', selectCountryRegion: 'Seleziona un paese, poi una regione',
    signInMore: 'Accedi per giocare 5 volte al giorno!', dailyLimit: 'Limite raggiunto! Illimitato a 3,99$',
    leaderboard: 'Classifica', country: 'Paese', global: 'Globale', achievementUnlocked: 'Obiettivo Sbloccato!',
    dailyChallenge: 'Sfida del Giorno', dailyAlreadyPlayed: 'Hai gia giocato la Sfida del Giorno!',
    buildingLevels: 'Livelli in costruzione', noRoundsYet: 'Nessun livello disponibile. Aiutaci a crearne!',
    createLevel: 'Crea un Livello', backToHome: 'Torna alla Home',
    welcomePremium: 'Benvenuto in Premium! Partite illimitate.', paymentSuccess: 'Pagamento riuscito!', paymentCancelled: 'Pagamento annullato.',
    correctCountry: '✓ Paese corretto!', wrongCountry: '✗ Paese sbagliato',
    exactMatch: 'Esatto!', amazing: 'Incredibile!', soClose: 'Cosi vicino!', close: 'Vicino', notBad: 'Non male', far: 'Lontano', veryFar: 'Molto lontano',
  },
  ja: {
    heroDesc: 'ピンを置いて、場所を当てよう。どれだけ近づける？',
    places: '場所', people: '人物', play: 'プレイ', createLevels: 'レベル作成に協力！',
    signIn: 'ログイン', terms: '利用規約', privacy: 'プライバシー',
    selectCountry: '国を選択', selectRegion: '地域を選択:', confirmRegion: '地域を確定',
    roundOf: '/', pts: 'pts', nailedIt: 'ドンピシャ！', kmAway: 'km', mAway: 'm',
    nextRound: '次のラウンド', gameOver: 'ゲームオーバー！', share: '共有', playAgain: 'もう一度', changeCountry: 'ホーム',
    profile: 'プロフィール', games: 'ゲーム数', score: 'スコア', streak: '連続', perfects: 'パーフェクト',
    wizPhoto: '写真', wizLocation: '場所', wizDetails: '詳細', wizConfirm: '確認',
    uploadPhoto: '写真をアップロード', uploadDesc: 'プレイヤーがこの写真を見て場所を当てます',
    clickDrag: 'クリックまたはドラッグ', maxSize: '最大5MB', orPasteUrl: 'またはURLを貼り付け',
    nextLocation: '次: 場所', nextDetails: '次: 詳細', nextPreview: '次: プレビュー',
    back: '戻る', skipNoPromo: 'スキップ', yourName: '名前（任意）', anonymous: '匿名',
    submitFree: '送信（無料）', submitPay: '送信して支払い',
    uploading: 'アップロード中...', submitted: 'レベル送信完了！', selectCountryRegion: '国を選び、地域を選択',
    signInMore: 'ログインで1日5回プレイ！', dailyLimit: '1日の上限！無制限は$3.99',
    leaderboard: 'ランキング', country: '国', global: 'グローバル', achievementUnlocked: '実績解除！',
    dailyChallenge: 'デイリーチャレンジ', dailyAlreadyPlayed: '今日のチャレンジはプレイ済みです！',
    buildingLevels: 'レベル準備中', noRoundsYet: 'まだレベルがありません。作成にご協力ください！',
    createLevel: 'レベルを作成', backToHome: 'ホームに戻る',
    welcomePremium: 'プレミアムへようこそ！無制限プレイ。', paymentSuccess: '支払い完了！', paymentCancelled: '支払いキャンセル。',
    correctCountry: '✓ 正しい国！', wrongCountry: '✗ 違う国',
    exactMatch: '完全一致！', amazing: '素晴らしい！', soClose: 'もう少し！', close: '近い', notBad: '悪くない', far: '遠い', veryFar: 'とても遠い',
  },
  ko: {
    heroDesc: '핀을 놓고, 위치를 맞춰보세요. 얼마나 가까이 갈 수 있나요?',
    places: '장소', people: '사람', play: '플레이', createLevels: '레벨 만들기에 참여하세요!',
    signIn: '로그인', terms: '이용약관', privacy: '개인정보',
    selectCountry: '나라 선택', selectRegion: '지역 선택:', confirmRegion: '지역 확인',
    roundOf: '/', pts: '점', nailedIt: '정확히 맞췄어요!', kmAway: 'km', mAway: 'm',
    nextRound: '다음 라운드', gameOver: '게임 오버!', share: '공유', playAgain: '다시 하기', changeCountry: '홈',
    profile: '프로필', games: '게임', score: '점수', streak: '연속', perfects: '퍼펙트',
    wizPhoto: '사진', wizLocation: '위치', wizDetails: '상세', wizConfirm: '확인',
    uploadPhoto: '사진 업로드', uploadDesc: '플레이어가 이 사진을 보고 위치를 맞춥니다',
    clickDrag: '클릭 또는 드래그', maxSize: '최대 5MB', orPasteUrl: '또는 URL 붙여넣기',
    nextLocation: '다음: 위치', nextDetails: '다음: 상세', nextPreview: '다음: 미리보기',
    back: '뒤로', skipNoPromo: '건너뛰기', yourName: '이름 (선택)', anonymous: '익명',
    submitFree: '제출 (무료)', submitPay: '제출 및 결제',
    uploading: '업로드 중...', submitted: '레벨 제출 완료!', selectCountryRegion: '나라를 선택하고 지역을 선택하세요',
    signInMore: '로그인하면 하루 5번 플레이!', dailyLimit: '일일 한도! 무제한 $3.99',
    leaderboard: '순위', country: '나라', global: '글로벌', achievementUnlocked: '업적 달성!',
    dailyChallenge: '오늘의 도전', dailyAlreadyPlayed: '오늘의 도전은 이미 플레이했습니다!',
    buildingLevels: '레벨 준비 중', noRoundsYet: '아직 레벨이 없습니다. 만들어주세요!',
    createLevel: '레벨 만들기', backToHome: '홈으로',
    welcomePremium: '프리미엄 환영합니다! 무제한 플레이.', paymentSuccess: '결제 완료!', paymentCancelled: '결제 취소됨.',
    correctCountry: '✓ 정확한 나라!', wrongCountry: '✗ 다른 나라',
    exactMatch: '정확!', amazing: '놀라워요!', soClose: '거의 다!', close: '가까워요', notBad: '나쁘지 않아요', far: '멀어요', veryFar: '매우 멀어요',
  },
  zh: {
    heroDesc: '放置图钉，猜测位置。你能有多接近？',
    places: '地点', people: '人物', play: '开始', createLevels: '帮我们创建关卡！',
    signIn: '登录', terms: '条款', privacy: '隐私',
    selectCountry: '选择国家', selectRegion: '选择地区:', confirmRegion: '确认地区',
    roundOf: '/', pts: '分', nailedIt: '完美命中！', kmAway: '公里', mAway: '米',
    nextRound: '下一轮', gameOver: '游戏结束！', share: '分享', playAgain: '再来一次', changeCountry: '首页',
    profile: '个人资料', games: '游戏', score: '分数', streak: '连续', perfects: '完美',
    wizPhoto: '照片', wizLocation: '位置', wizDetails: '详情', wizConfirm: '确认',
    uploadPhoto: '上传照片', uploadDesc: '玩家将看到这张照片并猜测位置',
    clickDrag: '点击或拖拽照片', maxSize: '最大5MB', orPasteUrl: '或粘贴URL',
    nextLocation: '下一步: 位置', nextDetails: '下一步: 详情', nextPreview: '下一步: 预览',
    back: '返回', skipNoPromo: '跳过', yourName: '你的名字（可选）', anonymous: '匿名',
    submitFree: '提交（免费）', submitPay: '提交并支付',
    uploading: '上传中...', submitted: '关卡已提交！谢谢！', selectCountryRegion: '先选择国家，再选择地区',
    signInMore: '登录后每天可玩5次！', dailyLimit: '每日限制！$3.99无限畅玩',
    leaderboard: '排行榜', country: '国家', global: '全球', achievementUnlocked: '成就解锁！',
    dailyChallenge: '每日挑战', dailyAlreadyPlayed: '你已完成今天的每日挑战！',
    buildingLevels: '关卡建设中', noRoundsYet: '暂无关卡。帮我们创建吧！',
    createLevel: '创建关卡', backToHome: '返回首页',
    welcomePremium: '欢迎加入Premium！无限畅玩。', paymentSuccess: '支付成功！', paymentCancelled: '支付已取消。',
    correctCountry: '✓ 国家正确！', wrongCountry: '✗ 国家错误',
    exactMatch: '精准！', amazing: '太棒了！', soClose: '好近！', close: '接近', notBad: '不错', far: '远', veryFar: '非常远',
  },
  ar: {
    heroDesc: 'ضع دبوسا. خمن الموقع. كم يمكنك الاقتراب؟',
    places: 'أماكن', people: 'أشخاص', play: 'العب', createLevels: 'ساعدنا في إنشاء مراحل!',
    signIn: 'تسجيل الدخول', terms: 'الشروط', privacy: 'الخصوصية',
    selectCountry: 'اختر بلدا', selectRegion: 'اختر منطقة في', confirmRegion: 'تأكيد المنطقة',
    roundOf: 'من', pts: 'نقطة', nailedIt: 'إصابة مباشرة!', kmAway: 'كم', mAway: 'م',
    nextRound: 'الجولة التالية', gameOver: 'انتهت اللعبة!', share: 'مشاركة', playAgain: 'العب مجددا', changeCountry: 'الرئيسية',
    profile: 'الملف الشخصي', games: 'ألعاب', score: 'النقاط', streak: 'متتالي', perfects: 'مثالي',
    wizPhoto: 'صورة', wizLocation: 'موقع', wizDetails: 'تفاصيل', wizConfirm: 'تأكيد',
    uploadPhoto: 'ارفع صورة', uploadDesc: 'سيرى اللاعبون هذا ويحاولون تخمين الموقع',
    clickDrag: 'انقر أو اسحب صورة', maxSize: 'حد أقصى 5 ميجا', orPasteUrl: 'أو الصق رابط',
    nextLocation: 'التالي: الموقع', nextDetails: 'التالي: التفاصيل', nextPreview: 'التالي: معاينة',
    back: 'رجوع', skipNoPromo: 'تخطي', yourName: 'اسمك (اختياري)', anonymous: 'مجهول',
    submitFree: 'إرسال (مجاني)', submitPay: 'إرسال ودفع',
    uploading: 'جاري الرفع...', submitted: 'تم إرسال المرحلة! شكرا!', selectCountryRegion: 'اختر بلدا ثم منطقة',
    signInMore: 'سجل دخولك للعب 5 مرات يوميا!', dailyLimit: 'وصلت الحد! غير محدود بـ 3.99$',
    leaderboard: 'لوحة المتصدرين', country: 'البلد', global: 'عالمي', achievementUnlocked: 'إنجاز مفتوح!',
    dailyChallenge: 'تحدي اليوم', dailyAlreadyPlayed: 'لقد لعبت تحدي اليوم بالفعل!',
    buildingLevels: 'بناء المراحل', noRoundsYet: 'لا توجد مراحل. ساعدنا في إنشائها!',
    createLevel: 'إنشاء مرحلة', backToHome: 'العودة للرئيسية',
    welcomePremium: 'أهلا بك في بريميوم! لعب غير محدود.', paymentSuccess: 'تم الدفع بنجاح!', paymentCancelled: 'تم إلغاء الدفع.',
    correctCountry: '✓ البلد صحيح!', wrongCountry: '✗ بلد خاطئ',
    exactMatch: 'تطابق تام!', amazing: 'مذهل!', soClose: 'قريب جدا!', close: 'قريب', notBad: 'ليس سيئا', far: 'بعيد', veryFar: 'بعيد جدا',
  },
  hi: {
    heroDesc: 'पिन लगाओ। स्थान का अनुमान लगाओ। कितने करीब पहुंच सकते हो?',
    places: 'स्थान', people: 'लोग', play: 'खेलें', createLevels: 'लेवल बनाने में मदद करें!',
    signIn: 'साइन इन', terms: 'शर्तें', privacy: 'गोपनीयता',
    selectCountry: 'देश चुनें', selectRegion: 'क्षेत्र चुनें:', confirmRegion: 'क्षेत्र पुष्टि करें',
    roundOf: '/', pts: 'अंक', nailedIt: 'बिल्कुल सही!', kmAway: 'किमी', mAway: 'मी',
    nextRound: 'अगला राउंड', gameOver: 'खेल खत्म!', share: 'साझा करें', playAgain: 'फिर से खेलें', changeCountry: 'होम',
    profile: 'प्रोफ़ाइल', games: 'खेल', score: 'अंक', streak: 'लगातार', perfects: 'परफेक्ट',
    wizPhoto: 'फोटो', wizLocation: 'स्थान', wizDetails: 'विवरण', wizConfirm: 'पुष्टि',
    uploadPhoto: 'फोटो अपलोड करें', uploadDesc: 'खिलाड़ी यह देखकर स्थान का अनुमान लगाएंगे',
    clickDrag: 'क्लिक करें या खींचें', maxSize: 'अधिकतम 5MB', orPasteUrl: 'या URL पेस्ट करें',
    nextLocation: 'अगला: स्थान', nextDetails: 'अगला: विवरण', nextPreview: 'अगला: प्रीव्यू',
    back: 'पीछे', skipNoPromo: 'छोड़ें', yourName: 'आपका नाम (वैकल्पिक)', anonymous: 'अनाम',
    submitFree: 'सबमिट (मुफ्त)', submitPay: 'सबमिट और भुगतान',
    uploading: 'अपलोड हो रहा है...', submitted: 'लेवल सबमिट! धन्यवाद!', selectCountryRegion: 'देश चुनें, फिर क्षेत्र',
    signInMore: 'साइन इन करें, दिन में 5 बार खेलें!', dailyLimit: 'दैनिक सीमा! $3.99 में असीमित',
    leaderboard: 'लीडरबोर्ड', country: 'देश', global: 'वैश्विक', achievementUnlocked: 'उपलब्धि अनलॉक!',
    dailyChallenge: 'दैनिक चुनौती', dailyAlreadyPlayed: 'आज की चुनौती पहले ही खेल चुके हैं!',
    buildingLevels: 'लेवल बन रहे हैं', noRoundsYet: 'अभी कोई लेवल नहीं। बनाने में मदद करें!',
    createLevel: 'लेवल बनाएं', backToHome: 'होम पर वापस',
    welcomePremium: 'प्रीमियम में स्वागत! असीमित खेल।', paymentSuccess: 'भुगतान सफल!', paymentCancelled: 'भुगतान रद्द।',
    correctCountry: '✓ सही देश!', wrongCountry: '✗ गलत देश',
    exactMatch: 'बिल्कुल सही!', amazing: 'शानदार!', soClose: 'बहुत करीब!', close: 'करीब', notBad: 'बुरा नहीं', far: 'दूर', veryFar: 'बहुत दूर',
  },
  ru: {
    heroDesc: 'Поставь булавку. Угадай место. Насколько близко ты можешь попасть?',
    places: 'Места', people: 'Люди', play: 'Играть', createLevels: 'Помоги создать уровни!',
    signIn: 'Войти', terms: 'Условия', privacy: 'Конфиденциальность',
    selectCountry: 'Выбери страну', selectRegion: 'Выбери регион в', confirmRegion: 'Подтвердить регион',
    roundOf: 'из', pts: 'очк', nailedIt: 'В яблочко!', kmAway: 'км', mAway: 'м',
    nextRound: 'Следующий раунд', gameOver: 'Игра окончена!', share: 'Поделиться', playAgain: 'Ещё раз', changeCountry: 'Домой',
    profile: 'Профиль', games: 'Игры', score: 'Очки', streak: 'Серия', perfects: 'Идеально',
    wizPhoto: 'Фото', wizLocation: 'Место', wizDetails: 'Детали', wizConfirm: 'Подтвердить',
    uploadPhoto: 'Загрузи фото', uploadDesc: 'Игроки увидят это и попробуют угадать место',
    clickDrag: 'Нажми или перетащи фото', maxSize: 'Макс 5МБ', orPasteUrl: 'или вставь URL',
    nextLocation: 'Далее: Место', nextDetails: 'Далее: Детали', nextPreview: 'Далее: Предпросмотр',
    back: 'Назад', skipNoPromo: 'Пропустить', yourName: 'Твоё имя (необязательно)', anonymous: 'Аноним',
    submitFree: 'Отправить (Бесплатно)', submitPay: 'Отправить и оплатить',
    uploading: 'Загрузка...', submitted: 'Уровень отправлен! Спасибо!', selectCountryRegion: 'Выбери страну, затем регион',
    signInMore: 'Войди, чтобы играть 5 раз в день!', dailyLimit: 'Лимит! Безлимит за $3.99',
    leaderboard: 'Рейтинг', country: 'Страна', global: 'Мировой', achievementUnlocked: 'Достижение разблокировано!',
    dailyChallenge: 'Ежедневный вызов', dailyAlreadyPlayed: 'Вы уже сыграли сегодняшний вызов!',
    buildingLevels: 'Уровни создаются', noRoundsYet: 'Пока нет уровней. Помоги создать!',
    createLevel: 'Создать уровень', backToHome: 'На главную',
    welcomePremium: 'Добро пожаловать в Premium! Безлимитная игра.', paymentSuccess: 'Оплата прошла!', paymentCancelled: 'Оплата отменена.',
    correctCountry: '✓ Правильная страна!', wrongCountry: '✗ Неправильная страна',
    exactMatch: 'Точно!', amazing: 'Невероятно!', soClose: 'Так близко!', close: 'Близко', notBad: 'Неплохо', far: 'Далеко', veryFar: 'Очень далеко',
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

/**
 * Bonus Game Modes for K-POP Korean Learning Game
 * Requires: content-data.js (loaded before this file)
 * Uses global functions: getWords, shuffle, addXP, addCombo, resetCombo,
 *   SoundEngine, createConfetti, showToast, saveProgress, gameState,
 *   escapeHtml, speakKorean, collectWord, showPopup, screenShake,
 *   wordDatabase, Haptic (optional)
 */

// ============================================================
// FALLBACK DATA
// ============================================================

var defaultKoreanColors = [
    { korean: "빨간색", romanization: "ppalgansaek", english: "red", hex: "#FF0000" },
    { korean: "파란색", romanization: "paransaek", english: "blue", hex: "#0047A0" },
    { korean: "노란색", romanization: "noransaek", english: "yellow", hex: "#FFD700" },
    { korean: "초록색", romanization: "choroksaek", english: "green", hex: "#228B22" },
    { korean: "검은색", romanization: "geomeunsaek", english: "black", hex: "#222222" },
    { korean: "하얀색", romanization: "hayansaek", english: "white", hex: "#F5F5F5" },
    { korean: "주황색", romanization: "juhwangsaek", english: "orange", hex: "#FF8C00" },
    { korean: "보라색", romanization: "borasaek", english: "purple", hex: "#7B2CBF" },
    { korean: "분홍색", romanization: "bunhongsaek", english: "pink", hex: "#FF69B4" },
    { korean: "갈색", romanization: "galsaek", english: "brown", hex: "#8B4513" }
];

var defaultKoreanBodyParts = [
    { korean: "머리", romanization: "meori", english: "head", svgId: "head" },
    { korean: "눈", romanization: "nun", english: "eye", svgId: "eyes" },
    { korean: "코", romanization: "ko", english: "nose", svgId: "nose" },
    { korean: "입", romanization: "ip", english: "mouth", svgId: "mouth" },
    { korean: "귀", romanization: "gwi", english: "ear", svgId: "ears" },
    { korean: "어깨", romanization: "eokkae", english: "shoulder", svgId: "shoulders" },
    { korean: "팔", romanization: "pal", english: "arm", svgId: "arms" },
    { korean: "손", romanization: "son", english: "hand", svgId: "hands" },
    { korean: "다리", romanization: "dari", english: "leg", svgId: "legs" },
    { korean: "발", romanization: "bal", english: "foot", svgId: "feet" },
    { korean: "배", romanization: "bae", english: "stomach", svgId: "stomach" },
    { korean: "등", romanization: "deung", english: "back", svgId: "back" }
];

var defaultKoreanRegions = [
    { id: "seoul", korean: "서울", english: "Seoul", famous: "Gyeongbokgung Palace, Myeongdong", food: "Tteokbokki, Jjajangmyeon", path: "M 185,95 L 200,85 L 215,92 L 210,108 L 195,112 Z" },
    { id: "gyeonggi", korean: "경기도", english: "Gyeonggi-do", famous: "Suwon Hwaseong, Korean Folk Village", food: "Suwon Galbi", path: "M 155,70 L 185,55 L 230,70 L 235,120 L 195,135 L 155,120 Z" },
    { id: "incheon", korean: "인천", english: "Incheon", famous: "Incheon Airport, Chinatown, Songdo", food: "Jjajangmyeon", path: "M 135,85 L 155,75 L 160,100 L 150,115 L 130,105 Z" },
    { id: "gangwon", korean: "강원도", english: "Gangwon-do", famous: "Seoraksan, Nami Island, Ski Resorts", food: "Makguksu, Dakgalbi", path: "M 230,45 L 290,35 L 310,80 L 280,120 L 235,115 Z" },
    { id: "chungcheong", korean: "충청도", english: "Chungcheong-do", famous: "Daejeon Expo, Gongju, Buyeo", food: "Kalguksu, Sundae", path: "M 140,130 L 230,125 L 240,185 L 175,200 L 125,175 Z" },
    { id: "jeolla", korean: "전라도", english: "Jeolla-do", famous: "Jeonju Hanok Village, Gwangju", food: "Bibimbap, Hongeo", path: "M 120,200 L 185,195 L 195,280 L 145,300 L 105,265 Z" },
    { id: "gyeongsang", korean: "경상도", english: "Gyeongsang-do", famous: "Gyeongju, Busan Haeundae, Andong", food: "Milmyeon, Dwaeji Gukbap", path: "M 235,130 L 305,125 L 320,230 L 270,290 L 200,275 L 195,195 Z" },
    { id: "jeju", korean: "제주도", english: "Jeju-do", famous: "Hallasan, Seongsan Ilchulbong", food: "Black Pork, Hairtail Stew", path: "M 140,340 L 210,335 L 215,365 L 145,370 Z" }
];

var defaultKpopVocabulary = [
    { korean: "컴백", romanization: "keombaek", english: "comeback (new album/song release)", example: "BTS 컴백 언제야?" },
    { korean: "음원", romanization: "eumwon", english: "digital music track", example: "음원 차트 1위 축하해!" },
    { korean: "팬싸", romanization: "paenssa", english: "fan signing event", example: "오늘 팬싸 갔다 왔어!" },
    { korean: "떡밥", romanization: "tteokbap", english: "teaser/clue/bait from idols", example: "새 앨범 떡밥이 나왔어!" },
    { korean: "직캠", romanization: "jikcam", english: "fancam (fan-recorded video)", example: "직캠 조회수 천만 돌파!" },
    { korean: "본방사수", romanization: "bonbangsasu", english: "watching a show live as it airs", example: "오늘 음악방송 본방사수!" },
    { korean: "올킬", romanization: "olkil", english: "all-kill (topping all music charts)", example: "신곡이 음원 올킬 했어!" },
    { korean: "입덕", romanization: "ipdeok", english: "becoming a fan (entering fandom)", example: "이 무대 보고 입덕했어" },
    { korean: "탈덕", romanization: "taldeok", english: "leaving a fandom", example: "절대 탈덕 못 해" },
    { korean: "최애", romanization: "choeae", english: "ultimate bias/favorite member", example: "내 최애는 지민이야!" }
];

var defaultKoreanNetSlang = [
    { abbreviation: "ㄱㅇㄷ", fullForm: "개이득", english: "huge profit/win", meaning: "When something is a big gain" },
    { abbreviation: "ㅇㅈ", fullForm: "인정", english: "acknowledged/agreed", meaning: "Agreeing with someone" },
    { abbreviation: "ㄹㅇ", fullForm: "리얼", english: "for real", meaning: "Emphasizing truth" },
    { abbreviation: "ㅂㅂ", fullForm: "바이바이", english: "bye bye", meaning: "Quick goodbye" },
    { abbreviation: "ㄱㅊ", fullForm: "괜찮아", english: "it's okay", meaning: "Reassurance" },
    { abbreviation: "ㅈㅅ", fullForm: "죄송", english: "sorry", meaning: "Quick apology" },
    { abbreviation: "ㅎㄷㄷ", fullForm: "후덜덜", english: "shaking/trembling", meaning: "Extreme shock" },
    { abbreviation: "ㄱㄱ", fullForm: "고고", english: "go go", meaning: "Let's do it" },
    { abbreviation: "ㅊㅋ", fullForm: "축하", english: "congrats", meaning: "Congratulations" },
    { abbreviation: "ㄴㄴ", fullForm: "노노", english: "no no", meaning: "Disagreement" }
];

var defaultKoreanNumberSystems = {
    native: [
        { number: 1, korean: "하나", romanization: "hana" },
        { number: 2, korean: "둘", romanization: "dul" },
        { number: 3, korean: "셋", romanization: "set" },
        { number: 4, korean: "넷", romanization: "net" },
        { number: 5, korean: "다섯", romanization: "daseot" },
        { number: 6, korean: "여섯", romanization: "yeoseot" },
        { number: 7, korean: "일곱", romanization: "ilgop" },
        { number: 8, korean: "여덟", romanization: "yeodeol" },
        { number: 9, korean: "아홉", romanization: "ahop" },
        { number: 10, korean: "열", romanization: "yeol" },
        { number: 20, korean: "스물", romanization: "seumul" },
        { number: 30, korean: "서른", romanization: "seoreun" },
        { number: 40, korean: "마흔", romanization: "maheun" },
        { number: 50, korean: "쉰", romanization: "swin" },
        { number: 60, korean: "예순", romanization: "yesun" },
        { number: 70, korean: "일흔", romanization: "ilheun" },
        { number: 80, korean: "여든", romanization: "yeodeun" },
        { number: 90, korean: "아흔", romanization: "aheun" }
    ],
    sino: [
        { number: 1, korean: "일", romanization: "il" },
        { number: 2, korean: "이", romanization: "i" },
        { number: 3, korean: "삼", romanization: "sam" },
        { number: 4, korean: "사", romanization: "sa" },
        { number: 5, korean: "오", romanization: "o" },
        { number: 6, korean: "육", romanization: "yuk" },
        { number: 7, korean: "칠", romanization: "chil" },
        { number: 8, korean: "팔", romanization: "pal" },
        { number: 9, korean: "구", romanization: "gu" },
        { number: 10, korean: "십", romanization: "sip" },
        { number: 100, korean: "백", romanization: "baek" }
    ]
};

var defaultKoreanStudyTips = [
    { category: "pronunciation", title: "Master the Double Consonants", content: "Korean has 5 double consonants (ssang): ㄲ ㄸ ㅃ ㅆ ㅉ. They are tensed versions of their single counterparts. Practice by tensing your throat muscles while pronouncing them." },
    { category: "pronunciation", title: "Vowel Harmony Matters", content: "In Korean, bright vowels (ㅏ, ㅗ) pair with bright vowels, and dark vowels (ㅓ, ㅜ) pair with dark vowels. This affects verb conjugation patterns." },
    { category: "grammar", title: "Subject-Object-Verb Order", content: "Korean follows SOV order: I (subject) + apple (object) + eat (verb) = 나는 사과를 먹어요. Think of the verb as always coming last." },
    { category: "grammar", title: "Particles are Your Friends", content: "Particles like 은/는 (topic), 이/가 (subject), 을/를 (object) may seem confusing, but they help clarify meaning. Practice with simple sentences first." },
    { category: "vocabulary", title: "Learn Hanja Roots", content: "About 60% of Korean vocabulary comes from Chinese characters (Hanja). Learning common Hanja roots like 학 (learn), 생 (life), 인 (person) helps you guess meanings of new words." },
    { category: "vocabulary", title: "Use K-Drama for Context", content: "Watch K-dramas with Korean subtitles. Hearing vocabulary in emotional contexts helps your brain form stronger memory connections." },
    { category: "writing", title: "Block Structure of Hangul", content: "Each Hangul syllable fits into a square block: initial consonant + vowel + (optional final consonant). Practice writing blocks rather than individual letters." },
    { category: "writing", title: "Practice with Graph Paper", content: "Use graph paper to practice Hangul. Each character block should fit one square. This helps maintain consistent size and proportion." },
    { category: "culture", title: "Age Matters in Korean", content: "Korean has different speech levels based on the listener's age and social status. When in doubt, use polite form (-요 endings) until told otherwise." },
    { category: "culture", title: "Counting Systems", content: "Korean uses two number systems: native Korean (하나, 둘, 셋) for counting items and age, and Sino-Korean (일, 이, 삼) for dates, money, and phone numbers." }
];

var defaultConversationStarters = [
    { korean: "안녕하세요! 만나서 반갑습니다.", romanization: "annyeonghaseyo! mannaseo bangapseumnida.", english: "Hello! Nice to meet you.", context: "Formal greeting when meeting someone for the first time" },
    { korean: "요즘 어떻게 지내세요?", romanization: "yojeum eotteoke jinaeseyo?", english: "How have you been lately?", context: "Checking in on someone you know" },
    { korean: "이거 얼마예요?", romanization: "igeo eolmayeyo?", english: "How much is this?", context: "Shopping at a market or store" },
    { korean: "화장실이 어디에 있어요?", romanization: "hwajangsiri eodie isseoyo?", english: "Where is the restroom?", context: "Essential travel phrase" },
    { korean: "추천해 주세요.", romanization: "chucheonhae juseyo.", english: "Please recommend something.", context: "At a restaurant or when asking for suggestions" },
    { korean: "한국어를 공부하고 있어요.", romanization: "hangugeoreul gongbuhago isseoyo.", english: "I am studying Korean.", context: "Introducing yourself and your studies" },
    { korean: "천천히 말해 주세요.", romanization: "cheoncheonhi malhae juseyo.", english: "Please speak slowly.", context: "When you cannot follow a conversation" },
    { korean: "다시 한번 말해 주세요.", romanization: "dasi hanbeon malhae juseyo.", english: "Please say it one more time.", context: "Asking someone to repeat" }
];

var defaultDramaVocabulary = [
    { korean: "재벌", romanization: "jaebeol", english: "chaebol (rich conglomerate family)", context: "Rich heir falls in love", dramas: "Boys Over Flowers, The Heirs, Crash Landing on You" },
    { korean: "첫사랑", romanization: "cheossarang", english: "first love", context: "Reuniting with first love", dramas: "Reply 1988, Goblin, Start-Up" },
    { korean: "운명", romanization: "unmyeong", english: "fate/destiny", context: "Destined to meet again", dramas: "My Love from the Star, Goblin, Moon Lovers" },
    { korean: "삼각관계", romanization: "samgakgwangye", english: "love triangle", context: "Two people like the same person", dramas: "Reply 1988, True Beauty, Start-Up" },
    { korean: "기억상실", romanization: "gieoksangsil", english: "amnesia", context: "Character loses their memory", dramas: "18 Again, Angel's Last Mission, Mr. Sunshine" },
    { korean: "복수", romanization: "boksu", english: "revenge", context: "Seeking justice or vengeance", dramas: "Vincenzo, The Glory, Itaewon Class" },
    { korean: "고백", romanization: "gobaek", english: "confession (of love)", context: "Confessing feelings", dramas: "Weightlifting Fairy, True Beauty, Lovely Runner" },
    { korean: "이별", romanization: "ibyeol", english: "farewell/separation", context: "Sad separation scene", dramas: "Crash Landing on You, Goblin, Moon Lovers" },
    { korean: "오해", romanization: "ohae", english: "misunderstanding", context: "Characters misunderstand each other", dramas: "Reply 1988, It's Okay to Not Be Okay" },
    { korean: "해피엔딩", romanization: "haepiendinq", english: "happy ending", context: "Everything works out in the end", dramas: "Crash Landing on You, Hometown Cha-Cha-Cha" }
];


// ============================================================
// 1. COLOR QUIZ (showColorQuiz)
// ============================================================

var colorScore = 0;
var colorRound = 0;
var colorTotal = 10;
var colorCurrent = null;
var colorAnswered = false;

function showColorQuiz(c) {
    colorScore = 0;
    colorRound = 0;
    colorAnswered = false;
    gameState.gamesPlayed++;
    saveProgress();
    nextColorRound(c);
}

function nextColorRound(c) {
    if (colorRound >= colorTotal) {
        renderColorEnd(c);
        return;
    }
    var pool = (typeof koreanColors !== "undefined" && koreanColors.length > 0) ? koreanColors : defaultKoreanColors;
    var available = shuffle(pool);
    colorCurrent = available[colorRound % available.length];
    colorAnswered = false;
    colorRound++;
    var isReverse = (colorRound % 2 === 0);
    renderColorQuestion(c, isReverse);
}

function renderColorQuestion(c, isReverse) {
    var q = colorCurrent;
    var pool = (typeof koreanColors !== "undefined" && koreanColors.length > 0) ? koreanColors : defaultKoreanColors;
    var wrongPool = [];
    for (var i = 0; i < pool.length; i++) {
        if (pool[i].korean !== q.korean) wrongPool.push(pool[i]);
    }
    wrongPool = shuffle(wrongPool).slice(0, 3);

    var h = '<h2 class="game-title">Color Quiz</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += 'Round ' + colorRound + ' / ' + colorTotal + '</p>';
    h += '<div class="level-progress" style="margin-bottom:20px">';
    h += '<div class="level-bar" style="width:' + Math.round((colorRound / colorTotal) * 100) + '%"></div></div>';

    if (!isReverse) {
        // Normal: show colored box, pick Korean name
        h += '<div style="width:150px;height:150px;border-radius:20px;margin:0 auto 20px;border:3px solid rgba(255,255,255,0.3);background:' + escapeHtml(q.hex) + '"></div>';
        h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:15px">What is this color in Korean?</p>';
        var allOptions = shuffle([q].concat(wrongPool));
        h += '<div class="quiz-options">';
        for (var j = 0; j < allOptions.length; j++) {
            h += '<div class="quiz-option" data-answer="' + escapeHtml(allOptions[j].korean) + '">';
            h += escapeHtml(allOptions[j].korean) + '</div>';
        }
        h += '</div>';
    } else {
        // Reverse: show Korean text, pick the color
        h += '<div style="font-size:2.5rem;text-align:center;color:var(--neon-pink);margin-bottom:20px">' + escapeHtml(q.korean) + '</div>';
        h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:15px">Pick the correct color!</p>';
        var allColorOptions = shuffle([q].concat(wrongPool));
        h += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">';
        for (var k = 0; k < allColorOptions.length; k++) {
            h += '<div class="quiz-option" data-answer="' + escapeHtml(allColorOptions[k].korean) + '" style="padding:30px;background:' + escapeHtml(allColorOptions[k].hex) + ';border-radius:15px;cursor:pointer;border:3px solid rgba(255,255,255,0.2)">';
            h += '<span style="background:rgba(0,0,0,0.6);padding:4px 10px;border-radius:8px;font-size:0.8rem">' + escapeHtml(allColorOptions[k].english) + '</span></div>';
        }
        h += '</div>';
    }
    h += '<div style="text-align:center;margin-top:15px;color:var(--gold);font-size:1.2rem">Score: ' + colorScore + '</div>';
    c.innerHTML = h;

    var opts = c.querySelectorAll('.quiz-option');
    for (var m = 0; m < opts.length; m++) {
        opts[m].onclick = function () {
            if (colorAnswered) return;
            colorAnswered = true;
            var selected = this.getAttribute('data-answer');
            var isCorrect = (selected === colorCurrent.korean);
            if (isCorrect) {
                this.classList.add('correct');
                colorScore += 100;
                gameState.correctAnswers++;
                SoundEngine.correct();
                addCombo();
                addXP(15);
                if (typeof Haptic !== "undefined" && Haptic.success) Haptic.success();
            } else {
                this.classList.add('wrong');
                SoundEngine.wrong();
                resetCombo();
                screenShake();
                var all = c.querySelectorAll('.quiz-option');
                for (var n = 0; n < all.length; n++) {
                    if (all[n].getAttribute('data-answer') === colorCurrent.korean) all[n].classList.add('correct');
                }
            }
            var info = document.createElement('div');
            info.style.cssText = 'margin-top:15px;text-align:center;background:var(--glass);padding:15px;border-radius:12px';
            info.innerHTML = '<span style="display:inline-block;width:30px;height:30px;border-radius:50%;background:' + escapeHtml(q.hex) + ';vertical-align:middle;margin-right:8px;border:2px solid rgba(255,255,255,0.3)"></span>' +
                '<strong style="color:var(--neon-pink)">' + escapeHtml(q.korean) + '</strong>' +
                ' <span style="color:var(--neon-cyan)">(' + escapeHtml(q.romanization) + ')</span>' +
                ' = ' + escapeHtml(q.english) +
                ' <span style="color:rgba(255,255,255,0.5)">' + escapeHtml(q.hex) + '</span>';
            c.appendChild(info);
            setTimeout(function () { nextColorRound(c); }, 2200);
        };
    }
}

function renderColorEnd(c) {
    var pct = Math.round((colorScore / (colorTotal * 100)) * 100);
    if (pct >= 80) createConfetti(80);
    addXP(colorScore / 10);
    var h = '<h2 class="game-title">Color Quiz Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#127912;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + colorScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + pct + '% correct</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="colorAgainBtn">Play Again</button>';
    h += '<button class="game-btn secondary" id="colorBackBtn">Back</button>';
    h += '</div></div>';
    c.innerHTML = h;
    document.getElementById('colorAgainBtn').onclick = function () { showColorQuiz(c); };
    document.getElementById('colorBackBtn').onclick = function () { if (typeof showMode === "function") showMode(gameState.currentMode); };
}


// ============================================================
// 2. BODY PARTS QUIZ (showBodyPartsQuiz)
// ============================================================

var bodyScore = 0;
var bodyRound = 0;
var bodyTotal = 10;
var bodyCurrent = null;
var bodyAnswered = false;

function showBodyPartsQuiz(c) {
    bodyScore = 0;
    bodyRound = 0;
    bodyAnswered = false;
    gameState.gamesPlayed++;
    saveProgress();
    nextBodyRound(c);
}

function getBodySvg(highlightId) {
    var hl = highlightId || "";
    var hc = "rgba(255,45,149,0.6)";
    var nc = "rgba(255,255,255,0.15)";
    var svg = '<svg viewBox="0 0 200 400" width="180" height="360" style="display:block;margin:0 auto">';
    // Head
    svg += '<circle cx="100" cy="50" r="30" fill="' + (hl === "head" ? hc : nc) + '" stroke="rgba(255,255,255,0.4)" stroke-width="2">';
    if (hl === "head") svg += '<animate attributeName="r" values="30;33;30" dur="1s" repeatCount="indefinite"/>';
    svg += '</circle>';
    // Eyes
    svg += '<circle cx="88" cy="45" r="4" fill="' + (hl === "eyes" ? hc : "rgba(255,255,255,0.5)") + '"/>';
    svg += '<circle cx="112" cy="45" r="4" fill="' + (hl === "eyes" ? hc : "rgba(255,255,255,0.5)") + '"/>';
    // Nose
    svg += '<line x1="100" y1="48" x2="100" y2="58" stroke="' + (hl === "nose" ? hc : "rgba(255,255,255,0.4)") + '" stroke-width="' + (hl === "nose" ? "4" : "2") + '"/>';
    // Mouth
    svg += '<path d="M 90 65 Q 100 72 110 65" fill="none" stroke="' + (hl === "mouth" ? hc : "rgba(255,255,255,0.4)") + '" stroke-width="' + (hl === "mouth" ? "4" : "2") + '"/>';
    // Ears
    svg += '<ellipse cx="68" cy="50" rx="6" ry="10" fill="' + (hl === "ears" ? hc : nc) + '" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>';
    svg += '<ellipse cx="132" cy="50" rx="6" ry="10" fill="' + (hl === "ears" ? hc : nc) + '" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>';
    // Body/Torso
    svg += '<rect x="75" y="82" width="50" height="80" rx="10" fill="' + (hl === "stomach" || hl === "back" ? hc : nc) + '" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>';
    // Shoulders
    svg += '<line x1="50" y1="95" x2="75" y2="90" stroke="' + (hl === "shoulders" ? hc : "rgba(255,255,255,0.4)") + '" stroke-width="' + (hl === "shoulders" ? "6" : "3") + '" stroke-linecap="round"/>';
    svg += '<line x1="125" y1="90" x2="150" y2="95" stroke="' + (hl === "shoulders" ? hc : "rgba(255,255,255,0.4)") + '" stroke-width="' + (hl === "shoulders" ? "6" : "3") + '" stroke-linecap="round"/>';
    // Arms
    svg += '<line x1="50" y1="95" x2="35" y2="175" stroke="' + (hl === "arms" ? hc : "rgba(255,255,255,0.4)") + '" stroke-width="' + (hl === "arms" ? "8" : "5") + '" stroke-linecap="round"/>';
    svg += '<line x1="150" y1="95" x2="165" y2="175" stroke="' + (hl === "arms" ? hc : "rgba(255,255,255,0.4)") + '" stroke-width="' + (hl === "arms" ? "8" : "5") + '" stroke-linecap="round"/>';
    // Hands
    svg += '<circle cx="35" cy="180" r="8" fill="' + (hl === "hands" ? hc : nc) + '" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>';
    svg += '<circle cx="165" cy="180" r="8" fill="' + (hl === "hands" ? hc : nc) + '" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>';
    // Legs
    svg += '<line x1="85" y1="162" x2="75" y2="290" stroke="' + (hl === "legs" ? hc : "rgba(255,255,255,0.4)") + '" stroke-width="' + (hl === "legs" ? "8" : "5") + '" stroke-linecap="round"/>';
    svg += '<line x1="115" y1="162" x2="125" y2="290" stroke="' + (hl === "legs" ? hc : "rgba(255,255,255,0.4)") + '" stroke-width="' + (hl === "legs" ? "8" : "5") + '" stroke-linecap="round"/>';
    // Feet
    svg += '<ellipse cx="70" cy="298" rx="15" ry="8" fill="' + (hl === "feet" ? hc : nc) + '" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>';
    svg += '<ellipse cx="130" cy="298" rx="15" ry="8" fill="' + (hl === "feet" ? hc : nc) + '" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>';
    svg += '</svg>';
    return svg;
}

function nextBodyRound(c) {
    if (bodyRound >= bodyTotal) {
        renderBodyEnd(c);
        return;
    }
    var pool = (typeof koreanBodyParts !== "undefined" && koreanBodyParts.length > 0) ? koreanBodyParts : defaultKoreanBodyParts;
    var available = shuffle(pool);
    bodyCurrent = available[bodyRound % available.length];
    bodyAnswered = false;
    bodyRound++;
    renderBodyQuestion(c);
}

function renderBodyQuestion(c) {
    var q = bodyCurrent;
    var pool = (typeof koreanBodyParts !== "undefined" && koreanBodyParts.length > 0) ? koreanBodyParts : defaultKoreanBodyParts;
    var wrong = [];
    for (var i = 0; i < pool.length; i++) {
        if (pool[i].korean !== q.korean) wrong.push(pool[i]);
    }
    wrong = shuffle(wrong).slice(0, 3);
    var allOptions = shuffle([q].concat(wrong));

    var h = '<h2 class="game-title">Body Parts Quiz</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += 'Round ' + bodyRound + ' / ' + bodyTotal + '</p>';
    h += '<div class="level-progress" style="margin-bottom:15px">';
    h += '<div class="level-bar" style="width:' + Math.round((bodyRound / bodyTotal) * 100) + '%"></div></div>';
    h += '<div style="text-align:center;margin-bottom:15px">' + getBodySvg(q.svgId) + '</div>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:10px">What is the highlighted body part in Korean?</p>';
    h += '<div class="quiz-options">';
    for (var j = 0; j < allOptions.length; j++) {
        h += '<div class="quiz-option" data-answer="' + escapeHtml(allOptions[j].korean) + '">' + escapeHtml(allOptions[j].korean) + '</div>';
    }
    h += '</div>';
    h += '<div style="text-align:center;margin-top:10px;color:var(--gold)">Score: ' + bodyScore + '</div>';
    c.innerHTML = h;

    var opts = c.querySelectorAll('.quiz-option');
    for (var k = 0; k < opts.length; k++) {
        opts[k].onclick = function () {
            if (bodyAnswered) return;
            bodyAnswered = true;
            var selected = this.getAttribute('data-answer');
            var isCorrect = (selected === bodyCurrent.korean);
            if (isCorrect) {
                this.classList.add('correct');
                bodyScore += 100;
                gameState.correctAnswers++;
                SoundEngine.correct();
                addCombo();
                addXP(15);
            } else {
                this.classList.add('wrong');
                SoundEngine.wrong();
                resetCombo();
                screenShake();
                var all = c.querySelectorAll('.quiz-option');
                for (var m = 0; m < all.length; m++) {
                    if (all[m].getAttribute('data-answer') === bodyCurrent.korean) all[m].classList.add('correct');
                }
            }
            var info = document.createElement('div');
            info.style.cssText = 'margin-top:12px;text-align:center;background:var(--glass);padding:12px;border-radius:12px';
            info.innerHTML = '<strong style="color:var(--neon-pink)">' + escapeHtml(q.korean) + '</strong>' +
                ' <span style="color:var(--neon-cyan)">(' + escapeHtml(q.romanization) + ')</span>' +
                ' = ' + escapeHtml(q.english);
            c.appendChild(info);
            var listenBtn = document.createElement('button');
            listenBtn.className = 'game-btn secondary';
            listenBtn.style.cssText = 'margin:10px auto;display:block;padding:8px 18px;font-size:0.85rem';
            listenBtn.textContent = 'Listen';
            listenBtn.onclick = function () { speakKorean(q.korean); };
            c.appendChild(listenBtn);
            setTimeout(function () { nextBodyRound(c); }, 2500);
        };
    }
}

function renderBodyEnd(c) {
    var pct = Math.round((bodyScore / (bodyTotal * 100)) * 100);
    if (pct >= 80) createConfetti(80);
    addXP(bodyScore / 10);
    var h = '<h2 class="game-title">Body Parts Quiz Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#129507;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + bodyScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + pct + '% correct</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="bodyAgainBtn">Play Again</button>';
    h += '<button class="game-btn secondary" id="bodyBackBtn">Back</button>';
    h += '</div></div>';
    c.innerHTML = h;
    document.getElementById('bodyAgainBtn').onclick = function () { showBodyPartsQuiz(c); };
    document.getElementById('bodyBackBtn').onclick = function () { if (typeof showMode === "function") showMode(gameState.currentMode); };
}


// ============================================================
// 3. KOREA MAP (showKoreaMap)
// ============================================================

var mapQuizMode = false;
var mapQuizTarget = null;
var mapQuizScore = 0;
var mapQuizRound = 0;
var mapQuizTotal = 8;

function showKoreaMap(c) {
    mapQuizMode = false;
    mapQuizScore = 0;
    mapQuizRound = 0;
    gameState.gamesPlayed++;
    saveProgress();
    renderKoreaMap(c);
}

function getRegionPool() {
    return (typeof koreanRegions !== "undefined" && koreanRegions.length > 0) ? koreanRegions : defaultKoreanRegions;
}

function buildMapSvg(highlightId, quizMode) {
    var regions = getRegionPool();
    var svg = '<svg viewBox="80 20 280 370" width="320" height="380" style="display:block;margin:0 auto">';
    for (var i = 0; i < regions.length; i++) {
        var r = regions[i];
        var isHighlight = (highlightId === r.id);
        var fill = isHighlight ? "rgba(255,45,149,0.5)" : "rgba(157,78,221,0.2)";
        var stroke = isHighlight ? "var(--neon-pink)" : "rgba(255,255,255,0.3)";
        var sw = isHighlight ? "3" : "1.5";
        svg += '<path d="' + escapeHtml(r.path) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + sw + '" data-region="' + escapeHtml(r.id) + '" style="cursor:pointer;transition:fill 0.3s" />';
        if (!quizMode) {
            // Calculate rough center for label
            var nums = r.path.match(/[\d.]+/g);
            var cx = 0, cy = 0, cnt = 0;
            if (nums) {
                for (var n = 0; n < nums.length - 1; n += 2) {
                    cx += parseFloat(nums[n]);
                    cy += parseFloat(nums[n + 1]);
                    cnt++;
                }
                if (cnt > 0) { cx /= cnt; cy /= cnt; }
            }
            svg += '<text x="' + cx + '" y="' + cy + '" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="10" style="pointer-events:none">' + escapeHtml(r.korean) + '</text>';
        }
    }
    svg += '</svg>';
    return svg;
}

function renderKoreaMap(c) {
    var h = '<h2 class="game-title">Korea Map Explorer</h2>';
    h += '<div style="display:flex;gap:10px;justify-content:center;margin-bottom:15px">';
    h += '<button class="game-btn' + (!mapQuizMode ? '' : ' secondary') + '" id="mapExploreBtn">Explore</button>';
    h += '<button class="game-btn' + (mapQuizMode ? '' : ' secondary') + '" id="mapQuizBtn">Quiz Mode</button>';
    h += '</div>';
    h += '<div id="mapContainer">' + buildMapSvg(null, false) + '</div>';
    h += '<div id="mapInfo" style="margin-top:15px;background:var(--glass);padding:15px;border-radius:12px;text-align:center;color:rgba(255,255,255,0.6)">Click a region to learn about it!</div>';
    h += '<div class="game-controls" style="margin-top:15px">';
    h += '<button class="game-btn secondary" id="mapBackBtn">Back</button>';
    h += '</div>';
    c.innerHTML = h;

    attachMapListeners(c);
    document.getElementById('mapExploreBtn').onclick = function () { mapQuizMode = false; renderKoreaMap(c); };
    document.getElementById('mapQuizBtn').onclick = function () { mapQuizMode = true; mapQuizScore = 0; mapQuizRound = 0; startMapQuiz(c); };
    document.getElementById('mapBackBtn').onclick = function () { if (typeof showMode === "function") showMode(gameState.currentMode); };
}

function attachMapListeners(c) {
    var paths = c.querySelectorAll('path[data-region]');
    var regions = getRegionPool();
    for (var i = 0; i < paths.length; i++) {
        paths[i].onclick = function () {
            var rid = this.getAttribute('data-region');
            var region = null;
            for (var j = 0; j < regions.length; j++) {
                if (regions[j].id === rid) { region = regions[j]; break; }
            }
            if (!region) return;
            var mc = document.getElementById('mapContainer');
            if (mc) mc.innerHTML = buildMapSvg(rid, false);
            var infoDiv = document.getElementById('mapInfo');
            if (infoDiv) {
                infoDiv.innerHTML = '<div style="font-size:1.5rem;color:var(--neon-pink);margin-bottom:5px">' + escapeHtml(region.korean) + '</div>' +
                    '<div style="color:var(--neon-cyan);margin-bottom:8px">' + escapeHtml(region.english) + '</div>' +
                    '<div style="color:rgba(255,255,255,0.7);margin-bottom:5px"><strong>Famous:</strong> ' + escapeHtml(region.famous) + '</div>' +
                    '<div style="color:rgba(255,255,255,0.7)"><strong>Local Food:</strong> ' + escapeHtml(region.food) + '</div>';
            }
            // Re-attach listeners after SVG rebuild
            attachMapListeners(c);
            SoundEngine.correct();
        };
    }
}

function startMapQuiz(c) {
    if (mapQuizRound >= mapQuizTotal) {
        renderMapQuizEnd(c);
        return;
    }
    var regions = getRegionPool();
    var available = shuffle(regions);
    mapQuizTarget = available[mapQuizRound % available.length];
    mapQuizRound++;

    var h = '<h2 class="game-title">Korea Map Quiz</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:5px">Round ' + mapQuizRound + ' / ' + mapQuizTotal + '</p>';
    h += '<p style="text-align:center;font-size:1.5rem;color:var(--neon-pink);margin-bottom:15px">Where is <strong>' + escapeHtml(mapQuizTarget.korean) + '</strong>?</p>';
    h += '<div id="mapContainer">' + buildMapSvg(null, true) + '</div>';
    h += '<div id="mapInfo" style="margin-top:10px;text-align:center;color:var(--gold)">Score: ' + mapQuizScore + '</div>';
    c.innerHTML = h;

    var paths = c.querySelectorAll('path[data-region]');
    for (var i = 0; i < paths.length; i++) {
        paths[i].onclick = function () {
            var rid = this.getAttribute('data-region');
            var correct = (rid === mapQuizTarget.id);
            if (correct) {
                mapQuizScore += 100;
                gameState.correctAnswers++;
                SoundEngine.correct();
                addCombo();
                addXP(15);
                this.setAttribute('fill', 'rgba(0,245,212,0.5)');
            } else {
                SoundEngine.wrong();
                resetCombo();
                screenShake();
                this.setAttribute('fill', 'rgba(255,71,87,0.5)');
                // Highlight correct
                var allP = c.querySelectorAll('path[data-region]');
                for (var j = 0; j < allP.length; j++) {
                    if (allP[j].getAttribute('data-region') === mapQuizTarget.id) {
                        allP[j].setAttribute('fill', 'rgba(0,245,212,0.5)');
                    }
                }
            }
            setTimeout(function () { startMapQuiz(c); }, 1500);
        };
    }
}

function renderMapQuizEnd(c) {
    var pct = Math.round((mapQuizScore / (mapQuizTotal * 100)) * 100);
    if (pct >= 80) createConfetti(80);
    addXP(mapQuizScore / 10);
    var h = '<h2 class="game-title">Map Quiz Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#127758;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + mapQuizScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + pct + '% correct</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="mapQuizAgainBtn">Quiz Again</button>';
    h += '<button class="game-btn secondary" id="mapExplore2Btn">Explore Map</button>';
    h += '<button class="game-btn secondary" id="mapBack2Btn">Back</button>';
    h += '</div></div>';
    c.innerHTML = h;
    document.getElementById('mapQuizAgainBtn').onclick = function () { mapQuizMode = true; mapQuizScore = 0; mapQuizRound = 0; startMapQuiz(c); };
    document.getElementById('mapExplore2Btn').onclick = function () { mapQuizMode = false; renderKoreaMap(c); };
    document.getElementById('mapBack2Btn').onclick = function () { if (typeof showMode === "function") showMode(gameState.currentMode); };
}


// ============================================================
// 4. K-POP SLANG (showKpopSlang)
// ============================================================

var kpopSlangScore = 0;
var kpopSlangRound = 0;
var kpopSlangTotal = 10;
var kpopSlangCurrent = null;
var kpopSlangAnswered = false;

function showKpopSlang(c) {
    kpopSlangScore = 0;
    kpopSlangRound = 0;
    kpopSlangAnswered = false;
    gameState.gamesPlayed++;
    saveProgress();
    nextKpopSlang(c);
}

function nextKpopSlang(c) {
    if (kpopSlangRound >= kpopSlangTotal) {
        renderKpopSlangEnd(c);
        return;
    }
    var pool = (typeof kpopVocabulary !== "undefined" && kpopVocabulary.length > 0) ? kpopVocabulary : defaultKpopVocabulary;
    var available = shuffle(pool);
    kpopSlangCurrent = available[kpopSlangRound % available.length];
    kpopSlangAnswered = false;
    kpopSlangRound++;
    renderKpopSlangQuestion(c);
}

function renderKpopSlangQuestion(c) {
    var q = kpopSlangCurrent;
    var pool = (typeof kpopVocabulary !== "undefined" && kpopVocabulary.length > 0) ? kpopVocabulary : defaultKpopVocabulary;
    var wrong = [];
    for (var i = 0; i < pool.length; i++) {
        if (pool[i].korean !== q.korean) wrong.push(pool[i]);
    }
    wrong = shuffle(wrong).slice(0, 3);
    var allOptions = shuffle([q].concat(wrong));

    var h = '<h2 class="game-title">K-POP Slang</h2>';
    // Star decorations
    h += '<div style="text-align:center;color:var(--gold);font-size:0.9rem;margin-bottom:5px">';
    h += '&#9733; &#9733; &#9733; Round ' + kpopSlangRound + ' / ' + kpopSlangTotal + ' &#9733; &#9733; &#9733;</div>';
    h += '<div class="level-progress" style="margin-bottom:20px">';
    h += '<div class="level-bar" style="width:' + Math.round((kpopSlangRound / kpopSlangTotal) * 100) + '%"></div></div>';
    h += '<div style="background:linear-gradient(135deg,rgba(157,78,221,0.3),rgba(255,45,149,0.2));padding:25px;border-radius:15px;margin-bottom:20px;text-align:center;border:1px solid rgba(255,215,0,0.3)">';
    h += '<div style="font-size:0.8rem;color:var(--gold);margin-bottom:8px">&#9733; K-POP Term &#9733;</div>';
    h += '<div style="font-size:2rem;color:var(--neon-pink);margin-bottom:5px">' + escapeHtml(q.korean) + '</div>';
    if (q.romanization) {
        h += '<div style="color:var(--neon-cyan);font-size:0.9rem">' + escapeHtml(q.romanization) + '</div>';
    }
    h += '</div>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:15px">What does this term mean?</p>';
    h += '<div class="quiz-options" style="grid-template-columns:1fr">';
    for (var j = 0; j < allOptions.length; j++) {
        h += '<div class="quiz-option" data-answer="' + escapeHtml(allOptions[j].korean) + '" style="font-size:0.95rem;text-align:left">';
        h += escapeHtml(allOptions[j].english) + '</div>';
    }
    h += '</div>';
    h += '<div style="text-align:center;margin-top:10px;color:var(--gold)">&#9733; Score: ' + kpopSlangScore + ' &#9733;</div>';
    c.innerHTML = h;

    var opts = c.querySelectorAll('.quiz-option');
    for (var k = 0; k < opts.length; k++) {
        opts[k].onclick = function () {
            if (kpopSlangAnswered) return;
            kpopSlangAnswered = true;
            var selected = this.getAttribute('data-answer');
            var isCorrect = (selected === kpopSlangCurrent.korean);
            if (isCorrect) {
                this.classList.add('correct');
                kpopSlangScore += 100;
                gameState.correctAnswers++;
                SoundEngine.correct();
                addCombo();
                addXP(15);
            } else {
                this.classList.add('wrong');
                SoundEngine.wrong();
                resetCombo();
                var all = c.querySelectorAll('.quiz-option');
                for (var m = 0; m < all.length; m++) {
                    if (all[m].getAttribute('data-answer') === kpopSlangCurrent.korean) all[m].classList.add('correct');
                }
            }
            if (q.example) {
                var ex = document.createElement('div');
                ex.style.cssText = 'margin-top:12px;background:var(--glass);padding:12px;border-radius:12px;text-align:center';
                ex.innerHTML = '<div style="color:var(--neon-cyan);font-size:0.85rem;margin-bottom:4px">Example:</div>' +
                    '<div style="color:var(--neon-pink)">' + escapeHtml(q.example) + '</div>';
                c.appendChild(ex);
            }
            setTimeout(function () { nextKpopSlang(c); }, 2500);
        };
    }
}

function renderKpopSlangEnd(c) {
    var pct = Math.round((kpopSlangScore / (kpopSlangTotal * 100)) * 100);
    if (pct >= 80) createConfetti(80);
    addXP(kpopSlangScore / 10);
    var h = '<h2 class="game-title">K-POP Slang Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#9733;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + kpopSlangScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + pct + '% correct</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="kpopSlangAgainBtn">Play Again</button>';
    h += '<button class="game-btn secondary" id="kpopSlangBackBtn">Back</button>';
    h += '</div></div>';
    c.innerHTML = h;
    document.getElementById('kpopSlangAgainBtn').onclick = function () { showKpopSlang(c); };
    document.getElementById('kpopSlangBackBtn').onclick = function () { if (typeof showMode === "function") showMode(gameState.currentMode); };
}


// ============================================================
// 5. NET SLANG QUIZ (showNetSlangQuiz)
// ============================================================

var netSlangScore = 0;
var netSlangRound = 0;
var netSlangTotal = 10;
var netSlangCurrent = null;
var netSlangAnswered = false;

function showNetSlangQuiz(c) {
    netSlangScore = 0;
    netSlangRound = 0;
    netSlangAnswered = false;
    gameState.gamesPlayed++;
    saveProgress();
    nextNetSlang(c);
}

function nextNetSlang(c) {
    if (netSlangRound >= netSlangTotal) {
        renderNetSlangEnd(c);
        return;
    }
    var pool = (typeof koreanNetSlang !== "undefined" && koreanNetSlang.length > 0) ? koreanNetSlang : defaultKoreanNetSlang;
    var available = shuffle(pool);
    netSlangCurrent = available[netSlangRound % available.length];
    netSlangAnswered = false;
    netSlangRound++;
    renderNetSlangQuestion(c);
}

function renderNetSlangQuestion(c) {
    var q = netSlangCurrent;
    var pool = (typeof koreanNetSlang !== "undefined" && koreanNetSlang.length > 0) ? koreanNetSlang : defaultKoreanNetSlang;
    var wrong = [];
    for (var i = 0; i < pool.length; i++) {
        if (pool[i].abbreviation !== q.abbreviation) wrong.push(pool[i]);
    }
    wrong = shuffle(wrong).slice(0, 3);
    var allOptions = shuffle([q].concat(wrong));

    var h = '<h2 class="game-title">Korean Net Slang</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += 'Round ' + netSlangRound + ' / ' + netSlangTotal + '</p>';
    h += '<div class="level-progress" style="margin-bottom:20px">';
    h += '<div class="level-bar" style="width:' + Math.round((netSlangRound / netSlangTotal) * 100) + '%"></div></div>';
    // Chat bubble style
    h += '<div style="max-width:280px;margin:0 auto 20px;background:linear-gradient(135deg,rgba(0,212,255,0.15),rgba(157,78,221,0.15));padding:20px 25px;border-radius:20px 20px 20px 5px;border:1px solid rgba(0,212,255,0.3)">';
    h += '<div style="font-size:0.7rem;color:rgba(255,255,255,0.4);margin-bottom:8px">KakaoTalk Message</div>';
    h += '<div style="font-size:3rem;text-align:center;color:var(--neon-pink);letter-spacing:4px">' + escapeHtml(q.abbreviation) + '</div>';
    h += '</div>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:15px">What does this abbreviation stand for?</p>';
    h += '<div class="quiz-options" style="grid-template-columns:1fr">';
    for (var j = 0; j < allOptions.length; j++) {
        h += '<div class="quiz-option" data-answer="' + escapeHtml(allOptions[j].abbreviation) + '" style="text-align:left">';
        h += '<strong>' + escapeHtml(allOptions[j].fullForm) + '</strong>';
        h += ' <span style="color:rgba(255,255,255,0.5)">(' + escapeHtml(allOptions[j].english) + ')</span></div>';
    }
    h += '</div>';
    h += '<div style="text-align:center;margin-top:10px;color:var(--gold)">Score: ' + netSlangScore + '</div>';
    c.innerHTML = h;

    var opts = c.querySelectorAll('.quiz-option');
    for (var k = 0; k < opts.length; k++) {
        opts[k].onclick = function () {
            if (netSlangAnswered) return;
            netSlangAnswered = true;
            var selected = this.getAttribute('data-answer');
            var isCorrect = (selected === netSlangCurrent.abbreviation);
            if (isCorrect) {
                this.classList.add('correct');
                netSlangScore += 100;
                gameState.correctAnswers++;
                SoundEngine.correct();
                addCombo();
                addXP(15);
            } else {
                this.classList.add('wrong');
                SoundEngine.wrong();
                resetCombo();
                var all = c.querySelectorAll('.quiz-option');
                for (var m = 0; m < all.length; m++) {
                    if (all[m].getAttribute('data-answer') === netSlangCurrent.abbreviation) all[m].classList.add('correct');
                }
            }
            var info = document.createElement('div');
            info.style.cssText = 'margin-top:12px;background:var(--glass);padding:12px;border-radius:12px;text-align:center';
            info.innerHTML = '<span style="color:var(--neon-pink);font-size:1.3rem">' + escapeHtml(q.abbreviation) + '</span>' +
                ' = <strong style="color:var(--neon-cyan)">' + escapeHtml(q.fullForm) + '</strong>' +
                '<div style="color:rgba(255,255,255,0.6);margin-top:4px;font-size:0.85rem">' + escapeHtml(q.meaning) + '</div>';
            c.appendChild(info);
            setTimeout(function () { nextNetSlang(c); }, 2500);
        };
    }
}

function renderNetSlangEnd(c) {
    var pct = Math.round((netSlangScore / (netSlangTotal * 100)) * 100);
    if (pct >= 80) createConfetti(80);
    addXP(netSlangScore / 10);
    var h = '<h2 class="game-title">Net Slang Quiz Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#128172;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + netSlangScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + pct + '% correct</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="netSlangAgainBtn">Play Again</button>';
    h += '<button class="game-btn secondary" id="netSlangBackBtn">Back</button>';
    h += '</div></div>';
    c.innerHTML = h;
    document.getElementById('netSlangAgainBtn').onclick = function () { showNetSlangQuiz(c); };
    document.getElementById('netSlangBackBtn').onclick = function () { if (typeof showMode === "function") showMode(gameState.currentMode); };
}


// ============================================================
// 6. NUMBER CONVERTER (showNumberConverter)
// ============================================================

var numSystem = "native";
var numTarget = 0;
var numAnswer = "";
var numScore = 0;
var numRound = 0;
var numTotal = 10;

function showNumberConverter(c) {
    numSystem = "native";
    numScore = 0;
    numRound = 0;
    gameState.gamesPlayed++;
    saveProgress();
    nextNumberRound(c);
}

function getNumberData() {
    return (typeof koreanNumberSystems !== "undefined" && koreanNumberSystems.native) ? koreanNumberSystems : defaultKoreanNumberSystems;
}

function nativeNumberToKorean(n) {
    var data = getNumberData();
    var natives = data.native;
    if (n <= 0 || n > 99) return "";
    var tens = Math.floor(n / 10) * 10;
    var ones = n % 10;
    var result = "";
    if (tens > 0) {
        for (var i = 0; i < natives.length; i++) {
            if (natives[i].number === tens) { result = natives[i].korean; break; }
        }
    }
    if (ones > 0) {
        for (var j = 0; j < natives.length; j++) {
            if (natives[j].number === ones) { result += natives[j].korean; break; }
        }
    }
    return result;
}

function sinoNumberToKorean(n) {
    var data = getNumberData();
    var sinos = data.sino;
    if (n <= 0 || n > 999) return "";
    var hundreds = Math.floor(n / 100);
    var tens = Math.floor((n % 100) / 10);
    var ones = n % 10;
    var result = "";
    var lookup = {};
    for (var i = 0; i < sinos.length; i++) {
        lookup[sinos[i].number] = sinos[i].korean;
    }
    if (hundreds > 0) {
        if (hundreds > 1) result += lookup[hundreds] || "";
        result += lookup[100] || "";
    }
    if (tens > 0) {
        if (tens > 1) result += lookup[tens] || "";
        result += lookup[10] || "";
    }
    if (ones > 0) {
        result += lookup[ones] || "";
    }
    return result;
}

function nextNumberRound(c) {
    if (numRound >= numTotal) {
        renderNumberEnd(c);
        return;
    }
    if (numSystem === "native") {
        numTarget = Math.floor(Math.random() * 99) + 1;
        numAnswer = nativeNumberToKorean(numTarget);
    } else {
        numTarget = Math.floor(Math.random() * 999) + 1;
        numAnswer = sinoNumberToKorean(numTarget);
    }
    numRound++;
    renderNumberQuestion(c);
}

function renderNumberQuestion(c) {
    var systemLabel = numSystem === "native" ? "Native Korean (hana, dul, set...)" : "Sino-Korean (il, i, sam...)";
    var h = '<h2 class="game-title">Number Converter</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += 'Round ' + numRound + ' / ' + numTotal + '</p>';
    h += '<div class="level-progress" style="margin-bottom:15px">';
    h += '<div class="level-bar" style="width:' + Math.round((numRound / numTotal) * 100) + '%"></div></div>';
    h += '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:15px">';
    h += '<button class="game-btn' + (numSystem === "native" ? '' : ' secondary') + '" id="numNativeBtn" style="padding:8px 16px;font-size:0.85rem">Native</button>';
    h += '<button class="game-btn' + (numSystem === "sino" ? '' : ' secondary') + '" id="numSinoBtn" style="padding:8px 16px;font-size:0.85rem">Sino-Korean</button>';
    h += '</div>';
    h += '<p style="text-align:center;color:var(--neon-cyan);font-size:0.85rem;margin-bottom:15px">' + escapeHtml(systemLabel) + '</p>';
    h += '<div style="font-size:5rem;text-align:center;color:var(--neon-pink);margin:15px 0;font-weight:bold">' + numTarget + '</div>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:15px">Type this number in Korean:</p>';
    h += '<input type="text" class="speed-input" id="numInput" placeholder="Type in Korean..." autocomplete="off" />';
    h += '<div style="display:flex;gap:10px;justify-content:center;margin-top:15px">';
    h += '<button class="game-btn" id="numCheckBtn">Check</button>';
    h += '<button class="game-btn secondary" id="numSkipBtn">Skip</button>';
    h += '</div>';
    h += '<div id="numFeedback" style="margin-top:15px;text-align:center"></div>';
    h += '<div style="text-align:center;margin-top:10px;color:var(--gold)">Score: ' + numScore + '</div>';
    c.innerHTML = h;

    document.getElementById('numNativeBtn').onclick = function () {
        numSystem = "native";
        numRound--;
        nextNumberRound(c);
    };
    document.getElementById('numSinoBtn').onclick = function () {
        numSystem = "sino";
        numRound--;
        nextNumberRound(c);
    };
    document.getElementById('numCheckBtn').onclick = function () { checkNumberAnswer(c); };
    document.getElementById('numSkipBtn').onclick = function () { showNumberFeedback(c, false); };
    document.getElementById('numInput').onkeydown = function (e) {
        if (e.key === "Enter") checkNumberAnswer(c);
    };
    document.getElementById('numInput').focus();
}

function checkNumberAnswer(c) {
    var input = document.getElementById('numInput');
    if (!input) return;
    var userVal = input.value.trim();
    if (!userVal) return;
    var isCorrect = (userVal === numAnswer);
    if (isCorrect) {
        numScore += 100;
        gameState.correctAnswers++;
        SoundEngine.correct();
        addCombo();
        addXP(15);
    } else {
        SoundEngine.wrong();
        resetCombo();
    }
    showNumberFeedback(c, isCorrect);
}

function showNumberFeedback(c, isCorrect) {
    var fb = document.getElementById('numFeedback');
    if (!fb) return;
    var nativeStr = nativeNumberToKorean(numTarget <= 99 ? numTarget : 0);
    var sinoStr = sinoNumberToKorean(numTarget);
    var color = isCorrect ? "var(--neon-cyan)" : "var(--neon-pink)";
    var label = isCorrect ? "Correct!" : "Answer:";
    fb.innerHTML = '<div style="color:' + color + ';font-size:1.2rem;margin-bottom:8px">' + label + '</div>' +
        '<div style="background:var(--glass);padding:12px;border-radius:12px;display:inline-block">' +
        '<div style="color:var(--neon-cyan)"><strong>Answer:</strong> ' + escapeHtml(numAnswer) + '</div>' +
        (nativeStr ? '<div style="color:rgba(255,255,255,0.6);font-size:0.85rem;margin-top:4px">Native: ' + escapeHtml(nativeStr) + '</div>' : '') +
        (sinoStr ? '<div style="color:rgba(255,255,255,0.6);font-size:0.85rem">Sino: ' + escapeHtml(sinoStr) + '</div>' : '') +
        '</div>';
    setTimeout(function () { nextNumberRound(c); }, 2500);
}

function renderNumberEnd(c) {
    var pct = Math.round((numScore / (numTotal * 100)) * 100);
    if (pct >= 80) createConfetti(80);
    addXP(numScore / 10);
    var h = '<h2 class="game-title">Number Converter Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#128290;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + numScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + pct + '% correct</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="numAgainBtn">Play Again</button>';
    h += '<button class="game-btn secondary" id="numBackBtn">Back</button>';
    h += '</div></div>';
    c.innerHTML = h;
    document.getElementById('numAgainBtn').onclick = function () { showNumberConverter(c); };
    document.getElementById('numBackBtn').onclick = function () { if (typeof showMode === "function") showMode(gameState.currentMode); };
}


// ============================================================
// 7. STUDY TIPS (showStudyTips)
// ============================================================

var tipIndex = 0;
var tipCategory = "all";
var tipFavorites = [];

function showStudyTips(c) {
    tipIndex = 0;
    tipCategory = "all";
    try {
        var saved = localStorage.getItem('kpop_tip_favorites');
        if (saved) tipFavorites = JSON.parse(saved);
    } catch (e) { tipFavorites = []; }
    renderStudyTips(c);
}

function getFilteredTips() {
    var pool = (typeof koreanStudyTips !== "undefined" && koreanStudyTips.length > 0) ? koreanStudyTips : defaultKoreanStudyTips;
    if (tipCategory === "all") return pool;
    var filtered = [];
    for (var i = 0; i < pool.length; i++) {
        if (pool[i].category === tipCategory) filtered.push(pool[i]);
    }
    return filtered.length > 0 ? filtered : pool;
}

function renderStudyTips(c) {
    var tips = getFilteredTips();
    if (tipIndex >= tips.length) tipIndex = 0;
    if (tipIndex < 0) tipIndex = tips.length - 1;
    var tip = tips[tipIndex];
    var isFav = tipFavorites.indexOf(tip.title) !== -1;
    var categories = ["all", "pronunciation", "grammar", "vocabulary", "writing", "culture"];

    var h = '<h2 class="game-title">Study Tips</h2>';
    h += '<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:15px">';
    for (var i = 0; i < categories.length; i++) {
        var catLabel = categories[i].charAt(0).toUpperCase() + categories[i].slice(1);
        h += '<button class="cat-btn' + (tipCategory === categories[i] ? ' active' : '') + '" data-cat="' + categories[i] + '">' + catLabel + '</button>';
    }
    h += '</div>';
    h += '<div style="text-align:center;color:rgba(255,255,255,0.5);margin-bottom:10px;font-size:0.85rem">' + (tipIndex + 1) + ' / ' + tips.length + '</div>';
    h += '<div style="background:var(--glass);padding:25px;border-radius:15px;border:1px solid rgba(157,78,221,0.3);margin-bottom:15px;min-height:150px">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">';
    h += '<span style="background:rgba(0,212,255,0.2);color:var(--neon-cyan);padding:4px 12px;border-radius:10px;font-size:0.75rem">' + escapeHtml(tip.category) + '</span>';
    h += '<button class="game-btn secondary" id="tipFavBtn" style="padding:4px 12px;font-size:0.85rem">' + (isFav ? '&#9733; Saved' : '&#9734; Save') + '</button>';
    h += '</div>';
    h += '<h3 style="color:var(--neon-pink);margin-bottom:10px;font-size:1.2rem">' + escapeHtml(tip.title) + '</h3>';
    h += '<p style="color:rgba(255,255,255,0.8);line-height:1.6">' + escapeHtml(tip.content) + '</p>';
    h += '</div>';
    h += '<div style="display:flex;gap:10px;justify-content:center">';
    h += '<button class="game-btn secondary" id="tipPrevBtn" style="padding:12px 24px">&#9664; Prev</button>';
    h += '<button class="game-btn secondary" id="tipNextBtn" style="padding:12px 24px">Next &#9654;</button>';
    h += '</div>';
    h += '<div class="game-controls" style="margin-top:15px">';
    h += '<button class="game-btn secondary" id="tipBackBtn">Back</button>';
    h += '</div>';
    c.innerHTML = h;

    document.getElementById('tipPrevBtn').onclick = function () { tipIndex--; renderStudyTips(c); };
    document.getElementById('tipNextBtn').onclick = function () { tipIndex++; renderStudyTips(c); };
    document.getElementById('tipFavBtn').onclick = function () {
        var idx = tipFavorites.indexOf(tip.title);
        if (idx === -1) { tipFavorites.push(tip.title); } else { tipFavorites.splice(idx, 1); }
        try { localStorage.setItem('kpop_tip_favorites', JSON.stringify(tipFavorites)); } catch (e) {}
        renderStudyTips(c);
    };
    document.getElementById('tipBackBtn').onclick = function () { if (typeof showMode === "function") showMode(gameState.currentMode); };
    var catBtns = c.querySelectorAll('.cat-btn');
    for (var j = 0; j < catBtns.length; j++) {
        catBtns[j].onclick = function () {
            tipCategory = this.getAttribute('data-cat');
            tipIndex = 0;
            renderStudyTips(c);
        };
    }
}


// ============================================================
// 8. CONVERSATION PRACTICE (showConversationPractice)
// ============================================================

var convIndex = 0;

function showConversationPractice(c) {
    convIndex = 0;
    gameState.gamesPlayed++;
    saveProgress();
    renderConversation(c);
}

function getConvPool() {
    return (typeof conversationStarters !== "undefined" && conversationStarters.length > 0) ? conversationStarters : defaultConversationStarters;
}

function renderConversation(c) {
    var pool = getConvPool();
    if (convIndex >= pool.length) convIndex = 0;
    if (convIndex < 0) convIndex = pool.length - 1;
    var conv = pool[convIndex];
    var hasSpeechRec = (typeof webkitSpeechRecognition !== "undefined" || typeof SpeechRecognition !== "undefined");

    var h = '<h2 class="game-title">Conversation Practice</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.5);margin-bottom:10px;font-size:0.85rem">' + (convIndex + 1) + ' / ' + pool.length + '</p>';
    h += '<div style="background:linear-gradient(135deg,rgba(157,78,221,0.2),rgba(0,212,255,0.1));padding:25px;border-radius:15px;margin-bottom:20px;border:1px solid rgba(157,78,221,0.3)">';
    h += '<div style="font-size:0.8rem;color:var(--neon-cyan);margin-bottom:10px">' + escapeHtml(conv.context) + '</div>';
    h += '<div style="font-size:1.8rem;color:var(--neon-pink);margin-bottom:8px;line-height:1.4">' + escapeHtml(conv.korean) + '</div>';
    h += '<div style="color:var(--neon-cyan);margin-bottom:5px">' + escapeHtml(conv.romanization) + '</div>';
    h += '<div style="color:rgba(255,255,255,0.7)">' + escapeHtml(conv.english) + '</div>';
    h += '</div>';

    h += '<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:15px">';
    h += '<button class="game-btn" id="convListenBtn" style="padding:12px 24px">&#128266; Listen</button>';
    if (hasSpeechRec) {
        h += '<button class="game-btn secondary" id="convSpeakBtn" style="padding:12px 24px">&#127908; Practice Speaking</button>';
    }
    h += '</div>';
    h += '<div id="convResult" style="margin-bottom:15px;text-align:center"></div>';
    h += '<div style="display:flex;gap:10px;justify-content:center">';
    h += '<button class="game-btn secondary" id="convPrevBtn" style="padding:12px 24px">&#9664; Prev</button>';
    h += '<button class="game-btn secondary" id="convNextBtn" style="padding:12px 24px">Next &#9654;</button>';
    h += '</div>';
    h += '<div class="game-controls" style="margin-top:15px">';
    h += '<button class="game-btn secondary" id="convBackBtn">Back</button>';
    h += '</div>';
    c.innerHTML = h;

    document.getElementById('convListenBtn').onclick = function () { speakKorean(conv.korean); };
    document.getElementById('convPrevBtn').onclick = function () { convIndex--; renderConversation(c); };
    document.getElementById('convNextBtn').onclick = function () { convIndex++; renderConversation(c); };
    document.getElementById('convBackBtn').onclick = function () { if (typeof showMode === "function") showMode(gameState.currentMode); };

    if (hasSpeechRec && document.getElementById('convSpeakBtn')) {
        document.getElementById('convSpeakBtn').onclick = function () {
            var SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
            var rec = new SpeechRec();
            rec.lang = 'ko-KR';
            rec.interimResults = false;
            rec.maxAlternatives = 3;
            var btn = document.getElementById('convSpeakBtn');
            if (btn) { btn.textContent = 'Listening...'; btn.disabled = true; }
            rec.onresult = function (e) {
                var transcript = e.results[0][0].transcript;
                var confidence = Math.round(e.results[0][0].confidence * 100);
                var resultDiv = document.getElementById('convResult');
                if (resultDiv) {
                    var match = (transcript.replace(/\s/g, '') === conv.korean.replace(/\s/g, ''));
                    var matchColor = match ? "var(--neon-cyan)" : "var(--gold)";
                    resultDiv.innerHTML = '<div style="background:var(--glass);padding:15px;border-radius:12px">' +
                        '<div style="color:' + matchColor + ';font-size:1.1rem;margin-bottom:5px">' + (match ? 'Great match!' : 'You said:') + '</div>' +
                        '<div style="color:var(--neon-pink);font-size:1.2rem">' + escapeHtml(transcript) + '</div>' +
                        '<div style="color:rgba(255,255,255,0.5);font-size:0.85rem;margin-top:4px">Confidence: ' + confidence + '%</div></div>';
                    if (match) { SoundEngine.correct(); addXP(20); }
                }
                if (btn) { btn.textContent = 'Practice Speaking'; btn.disabled = false; }
            };
            rec.onerror = function () {
                var resultDiv = document.getElementById('convResult');
                if (resultDiv) {
                    resultDiv.innerHTML = '<div style="color:rgba(255,75,75,0.8)">Could not recognize speech. Try again.</div>';
                }
                if (btn) { btn.textContent = 'Practice Speaking'; btn.disabled = false; }
            };
            rec.onend = function () {
                if (btn) { btn.textContent = 'Practice Speaking'; btn.disabled = false; }
            };
            rec.start();
        };
    }
}


// ============================================================
// 9. DRAMA VOCAB (showDramaVocab)
// ============================================================

var dramaScore = 0;
var dramaRound = 0;
var dramaTotal = 10;
var dramaCurrent = null;
var dramaAnswered = false;

function showDramaVocab(c) {
    dramaScore = 0;
    dramaRound = 0;
    dramaAnswered = false;
    gameState.gamesPlayed++;
    saveProgress();
    nextDramaRound(c);
}

function nextDramaRound(c) {
    if (dramaRound >= dramaTotal) {
        renderDramaEnd(c);
        return;
    }
    var pool = (typeof dramaVocabulary !== "undefined" && dramaVocabulary.length > 0) ? dramaVocabulary : defaultDramaVocabulary;
    var available = shuffle(pool);
    dramaCurrent = available[dramaRound % available.length];
    dramaAnswered = false;
    dramaRound++;
    renderDramaQuestion(c);
}

function renderDramaQuestion(c) {
    var q = dramaCurrent;
    var pool = (typeof dramaVocabulary !== "undefined" && dramaVocabulary.length > 0) ? dramaVocabulary : defaultDramaVocabulary;
    var wrong = [];
    for (var i = 0; i < pool.length; i++) {
        if (pool[i].korean !== q.korean) wrong.push(pool[i]);
    }
    wrong = shuffle(wrong).slice(0, 3);
    var allOptions = shuffle([q].concat(wrong));

    var h = '<h2 class="game-title">K-Drama Vocab</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += 'Round ' + dramaRound + ' / ' + dramaTotal + '</p>';
    h += '<div class="level-progress" style="margin-bottom:20px">';
    h += '<div class="level-bar" style="width:' + Math.round((dramaRound / dramaTotal) * 100) + '%"></div></div>';
    // TV screen frame
    h += '<div style="background:#111;border:4px solid #444;border-radius:15px;padding:25px;margin-bottom:20px;position:relative;box-shadow:0 0 30px rgba(0,0,0,0.5)">';
    h += '<div style="position:absolute;top:8px;left:12px;width:8px;height:8px;border-radius:50%;background:#ff4444"></div>';
    h += '<div style="position:absolute;top:8px;right:12px;font-size:0.65rem;color:rgba(255,255,255,0.3)">LIVE</div>';
    h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:8px;text-align:center">K-Drama Scene</div>';
    h += '<div style="font-size:1rem;color:rgba(255,255,255,0.7);text-align:center;margin-bottom:8px">' + escapeHtml(q.context) + '</div>';
    h += '<div style="font-size:1.1rem;color:var(--neon-cyan);text-align:center">' + escapeHtml(q.english) + '</div>';
    h += '</div>';

    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:15px">Which Korean term matches this?</p>';
    h += '<div class="quiz-options">';
    for (var j = 0; j < allOptions.length; j++) {
        h += '<div class="quiz-option" data-answer="' + escapeHtml(allOptions[j].korean) + '">';
        h += '<div style="font-size:1.3rem;color:var(--neon-pink)">' + escapeHtml(allOptions[j].korean) + '</div>';
        h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.5)">' + escapeHtml(allOptions[j].romanization) + '</div>';
        h += '</div>';
    }
    h += '</div>';
    h += '<div style="text-align:center;margin-top:10px;color:var(--gold)">Score: ' + dramaScore + '</div>';
    c.innerHTML = h;

    var opts = c.querySelectorAll('.quiz-option');
    for (var k = 0; k < opts.length; k++) {
        opts[k].onclick = function () {
            if (dramaAnswered) return;
            dramaAnswered = true;
            var selected = this.getAttribute('data-answer');
            var isCorrect = (selected === dramaCurrent.korean);
            if (isCorrect) {
                this.classList.add('correct');
                dramaScore += 100;
                gameState.correctAnswers++;
                SoundEngine.correct();
                addCombo();
                addXP(15);
            } else {
                this.classList.add('wrong');
                SoundEngine.wrong();
                resetCombo();
                var all = c.querySelectorAll('.quiz-option');
                for (var m = 0; m < all.length; m++) {
                    if (all[m].getAttribute('data-answer') === dramaCurrent.korean) all[m].classList.add('correct');
                }
            }
            if (q.dramas) {
                var info = document.createElement('div');
                info.style.cssText = 'margin-top:12px;background:var(--glass);padding:12px;border-radius:12px;text-align:center';
                info.innerHTML = '<div style="color:var(--neon-cyan);font-size:0.85rem;margin-bottom:4px">Featured in:</div>' +
                    '<div style="color:rgba(255,255,255,0.7)">' + escapeHtml(q.dramas) + '</div>';
                c.appendChild(info);
            }
            setTimeout(function () { nextDramaRound(c); }, 2500);
        };
    }
}

function renderDramaEnd(c) {
    var pct = Math.round((dramaScore / (dramaTotal * 100)) * 100);
    if (pct >= 80) createConfetti(80);
    addXP(dramaScore / 10);
    var h = '<h2 class="game-title">K-Drama Vocab Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#127909;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + dramaScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + pct + '% correct</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="dramaAgainBtn">Play Again</button>';
    h += '<button class="game-btn secondary" id="dramaBackBtn">Back</button>';
    h += '</div></div>';
    c.innerHTML = h;
    document.getElementById('dramaAgainBtn').onclick = function () { showDramaVocab(c); };
    document.getElementById('dramaBackBtn').onclick = function () { if (typeof showMode === "function") showMode(gameState.currentMode); };
}


// ============================================================
// 10. STUDY STATS (showStudyStats)
// ============================================================

function recordStudyStat(mode, score, duration) {
    try {
        var stats = JSON.parse(localStorage.getItem('dailyStudyStats') || '[]');
        stats.push({ date: new Date().toISOString().slice(0, 10), mode: mode, score: score, duration: duration, timestamp: Date.now() });
        // Keep only last 90 days
        var cutoff = Date.now() - (90 * 24 * 60 * 60 * 1000);
        var filtered = [];
        for (var i = 0; i < stats.length; i++) {
            if (stats[i].timestamp > cutoff) filtered.push(stats[i]);
        }
        localStorage.setItem('dailyStudyStats', JSON.stringify(filtered));
    } catch (e) {}
}

function showStudyStats(c) {
    var stats = [];
    try { stats = JSON.parse(localStorage.getItem('dailyStudyStats') || '[]'); } catch (e) {}
    var hasChart = (typeof Chart !== "undefined");

    var h = '<h2 class="game-title">Study Statistics</h2>';

    // Summary cards
    var totalGames = gameState.gamesPlayed || 0;
    var totalCorrect = gameState.correctAnswers || 0;
    var totalWords = gameState.wordsLearned || 0;
    var currentLevel = gameState.level || 1;
    var currentXP = gameState.xp || 0;
    var accuracy = totalGames > 0 ? Math.round((totalCorrect / Math.max(totalGames * 10, totalCorrect)) * 100) : 0;

    h += '<div class="stats-panel" style="margin-bottom:20px">';
    h += '<div class="stats-card"><div class="stats-card-value">' + currentLevel + '</div><div class="stats-card-label">Level</div></div>';
    h += '<div class="stats-card"><div class="stats-card-value">' + currentXP + '</div><div class="stats-card-label">XP</div></div>';
    h += '<div class="stats-card"><div class="stats-card-value">' + totalGames + '</div><div class="stats-card-label">Games</div></div>';
    h += '<div class="stats-card"><div class="stats-card-value">' + totalWords + '</div><div class="stats-card-label">Words</div></div>';
    h += '<div class="stats-card"><div class="stats-card-value">' + totalCorrect + '</div><div class="stats-card-label">Correct</div></div>';
    h += '<div class="stats-card"><div class="stats-card-value">' + accuracy + '%</div><div class="stats-card-label">Accuracy</div></div>';
    h += '</div>';

    if (hasChart) {
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px">';
        h += '<div style="background:var(--glass);padding:15px;border-radius:15px"><canvas id="statsRadar" width="300" height="300"></canvas></div>';
        h += '<div style="background:var(--glass);padding:15px;border-radius:15px"><canvas id="statsBar" width="300" height="300"></canvas></div>';
        h += '</div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px">';
        h += '<div style="background:var(--glass);padding:15px;border-radius:15px"><canvas id="statsDoughnut" width="300" height="300"></canvas></div>';
        h += '<div style="background:var(--glass);padding:15px;border-radius:15px"><canvas id="statsLine" width="300" height="300"></canvas></div>';
        h += '</div>';
    } else {
        // Text-based stats
        h += '<div style="background:var(--glass);padding:20px;border-radius:15px;margin-bottom:15px">';
        h += '<h3 style="color:var(--neon-cyan);margin-bottom:10px">Recent Activity</h3>';
        if (stats.length === 0) {
            h += '<p style="color:rgba(255,255,255,0.5)">No activity data yet. Play some games!</p>';
        } else {
            var last7 = stats.slice(-7);
            for (var i = 0; i < last7.length; i++) {
                h += '<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.1)">';
                h += '<span style="color:rgba(255,255,255,0.7)">' + escapeHtml(last7[i].date) + ' - ' + escapeHtml(last7[i].mode || 'game') + '</span>';
                h += '<span style="color:var(--gold)">' + (last7[i].score || 0) + ' pts</span></div>';
            }
        }
        h += '</div>';

        // Word collection stats
        var collected = gameState.collectedWords || {};
        var rarities = { common: 0, rare: 0, epic: 0, legendary: 0 };
        for (var word in collected) {
            if (collected.hasOwnProperty(word)) {
                var r = collected[word] || "common";
                if (rarities.hasOwnProperty(r)) rarities[r]++;
            }
        }
        h += '<div style="background:var(--glass);padding:20px;border-radius:15px;margin-bottom:15px">';
        h += '<h3 style="color:var(--neon-cyan);margin-bottom:10px">Word Collection</h3>';
        h += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center">';
        h += '<div><div style="color:rgba(255,255,255,0.6);font-size:1.5rem">' + rarities.common + '</div><div style="font-size:0.75rem;color:rgba(255,255,255,0.4)">Common</div></div>';
        h += '<div><div style="color:var(--neon-blue);font-size:1.5rem">' + rarities.rare + '</div><div style="font-size:0.75rem;color:rgba(255,255,255,0.4)">Rare</div></div>';
        h += '<div><div style="color:var(--neon-purple);font-size:1.5rem">' + rarities.epic + '</div><div style="font-size:0.75rem;color:rgba(255,255,255,0.4)">Epic</div></div>';
        h += '<div><div style="color:var(--gold);font-size:1.5rem">' + rarities.legendary + '</div><div style="font-size:0.75rem;color:rgba(255,255,255,0.4)">Legendary</div></div>';
        h += '</div></div>';
    }

    h += '<div class="game-controls"><button class="game-btn secondary" id="statsBackBtn">Back</button></div>';
    c.innerHTML = h;

    document.getElementById('statsBackBtn').onclick = function () { if (typeof showMode === "function") showMode(gameState.currentMode); };

    // Render Chart.js charts if available
    if (hasChart) {
        try { renderStatsCharts(stats); } catch (e) {}
    }
}

function renderStatsCharts(stats) {
    // Radar chart - skill areas
    var radarCtx = document.getElementById('statsRadar');
    if (radarCtx) {
        new Chart(radarCtx.getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Vocabulary', 'Grammar', 'Pronunciation', 'Reading', 'Culture'],
                datasets: [{
                    label: 'Skills',
                    data: [
                        Math.min(100, (gameState.wordsLearned || 0) * 2),
                        Math.min(100, (gameState.correctAnswers || 0)),
                        Math.min(100, (gameState.gamesPlayed || 0) * 5),
                        Math.min(100, (gameState.level || 1) * 10),
                        Math.min(100, Object.keys(gameState.collectedWords || {}).length * 3)
                    ],
                    backgroundColor: 'rgba(255,45,149,0.2)',
                    borderColor: '#ff2d95',
                    pointBackgroundColor: '#ff2d95'
                }]
            },
            options: { scales: { r: { beginAtZero: true, max: 100, ticks: { color: 'rgba(255,255,255,0.5)' }, grid: { color: 'rgba(255,255,255,0.1)' }, pointLabels: { color: 'rgba(255,255,255,0.7)' } } }, plugins: { legend: { display: false } } }
        });
    }

    // Bar chart - daily activity last 7 days
    var barCtx = document.getElementById('statsBar');
    if (barCtx) {
        var days = [];
        var dayCounts = [];
        for (var d = 6; d >= 0; d--) {
            var date = new Date();
            date.setDate(date.getDate() - d);
            var ds = date.toISOString().slice(0, 10);
            days.push(ds.slice(5));
            var count = 0;
            for (var s = 0; s < stats.length; s++) {
                if (stats[s].date === ds) count++;
            }
            dayCounts.push(count);
        }
        new Chart(barCtx.getContext('2d'), {
            type: 'bar',
            data: { labels: days, datasets: [{ label: 'Games Played', data: dayCounts, backgroundColor: 'rgba(0,212,255,0.5)', borderColor: '#00d4ff', borderWidth: 1 }] },
            options: { scales: { y: { beginAtZero: true, ticks: { color: 'rgba(255,255,255,0.5)', stepSize: 1 } }, x: { ticks: { color: 'rgba(255,255,255,0.5)' } } }, plugins: { legend: { labels: { color: 'rgba(255,255,255,0.7)' } } } }
        });
    }

    // Doughnut chart - word rarity
    var doughCtx = document.getElementById('statsDoughnut');
    if (doughCtx) {
        var collected = gameState.collectedWords || {};
        var rarities = { common: 0, rare: 0, epic: 0, legendary: 0 };
        for (var w in collected) {
            if (collected.hasOwnProperty(w)) {
                var r = collected[w] || "common";
                if (rarities.hasOwnProperty(r)) rarities[r]++;
            }
        }
        new Chart(doughCtx.getContext('2d'), {
            type: 'doughnut',
            data: { labels: ['Common', 'Rare', 'Epic', 'Legendary'], datasets: [{ data: [rarities.common, rarities.rare, rarities.epic, rarities.legendary], backgroundColor: ['rgba(255,255,255,0.3)', '#00d4ff', '#9d4edd', '#ffd700'] }] },
            options: { plugins: { legend: { labels: { color: 'rgba(255,255,255,0.7)' } } } }
        });
    }

    // Line chart - XP progress (approximate from stats)
    var lineCtx = document.getElementById('statsLine');
    if (lineCtx) {
        var xpDays = [];
        var xpValues = [];
        var cumXP = 0;
        for (var d2 = 6; d2 >= 0; d2--) {
            var date2 = new Date();
            date2.setDate(date2.getDate() - d2);
            var ds2 = date2.toISOString().slice(0, 10);
            xpDays.push(ds2.slice(5));
            for (var s2 = 0; s2 < stats.length; s2++) {
                if (stats[s2].date === ds2) cumXP += (stats[s2].score || 0);
            }
            xpValues.push(cumXP);
        }
        new Chart(lineCtx.getContext('2d'), {
            type: 'line',
            data: { labels: xpDays, datasets: [{ label: 'Cumulative Score', data: xpValues, borderColor: '#ffd700', backgroundColor: 'rgba(255,215,0,0.1)', fill: true, tension: 0.3 }] },
            options: { scales: { y: { beginAtZero: true, ticks: { color: 'rgba(255,255,255,0.5)' } }, x: { ticks: { color: 'rgba(255,255,255,0.5)' } } }, plugins: { legend: { labels: { color: 'rgba(255,255,255,0.7)' } } } }
        });
    }
}


// ============================================================
// 11. PDF EXPORT (showPDFExport)
// ============================================================

function showPDFExport(c) {
    var hasPDF = (typeof jsPDF !== "undefined" || (typeof window.jspdf !== "undefined" && typeof window.jspdf.jsPDF !== "undefined"));

    var h = '<h2 class="game-title">Export Study Sheet</h2>';
    h += '<div style="text-align:center;margin-bottom:20px">';
    h += '<p style="color:rgba(255,255,255,0.6);margin-bottom:15px">Generate a printable study sheet of your vocabulary.</p>';
    h += '</div>';

    h += '<div style="display:grid;gap:12px;max-width:400px;margin:0 auto 20px">';
    h += '<button class="game-btn" id="pdfCollectedBtn" style="text-align:left;padding:18px 24px">';
    h += '<div style="font-size:1.1rem">My Vocabulary</div>';
    h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.6)">All collected words</div></button>';
    h += '<button class="game-btn secondary" id="pdfWeakBtn" style="text-align:left;padding:18px 24px">';
    h += '<div style="font-size:1.1rem">Weak Words</div>';
    h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.6)">Words you need to practice more</div></button>';
    h += '<button class="game-btn secondary" id="pdfCategoryBtn" style="text-align:left;padding:18px 24px">';
    h += '<div style="font-size:1.1rem">Category Export</div>';
    h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.6)">Export current category words</div></button>';
    h += '</div>';

    if (!hasPDF) {
        h += '<p style="text-align:center;color:rgba(255,255,255,0.4);font-size:0.85rem;margin-bottom:15px">jsPDF not loaded. Will generate printable HTML instead.</p>';
    }

    h += '<div id="pdfPreview" style="margin-bottom:15px"></div>';
    h += '<div class="game-controls"><button class="game-btn secondary" id="pdfBackBtn">Back</button></div>';
    c.innerHTML = h;

    document.getElementById('pdfCollectedBtn').onclick = function () { generateExport(c, 'collected'); };
    document.getElementById('pdfWeakBtn').onclick = function () { generateExport(c, 'weak'); };
    document.getElementById('pdfCategoryBtn').onclick = function () { generateExport(c, 'category'); };
    document.getElementById('pdfBackBtn').onclick = function () { if (typeof showMode === "function") showMode(gameState.currentMode); };
}

function getExportWords(type) {
    var words = [];
    if (type === 'collected') {
        var collected = gameState.collectedWords || {};
        var allWords = [];
        for (var cat in wordDatabase) { allWords = allWords.concat(wordDatabase[cat]); }
        for (var i = 0; i < allWords.length; i++) {
            if (collected[allWords[i].korean]) {
                words.push(allWords[i]);
            }
        }
    } else if (type === 'weak') {
        // Use words that appear least in collectedWords or fallback to first category
        var allW = getWords();
        var coll = gameState.collectedWords || {};
        for (var j = 0; j < allW.length; j++) {
            if (!coll[allW[j].korean]) words.push(allW[j]);
        }
        if (words.length === 0) words = allW.slice(0, 20);
    } else {
        words = getWords();
    }
    return words.slice(0, 50);
}

function generateExport(c, type) {
    var words = getExportWords(type);
    var hasPDF = (typeof jsPDF !== "undefined" || (typeof window.jspdf !== "undefined" && typeof window.jspdf.jsPDF !== "undefined"));

    if (hasPDF && words.length > 0) {
        try {
            var PDF = (typeof jsPDF !== "undefined") ? jsPDF : window.jspdf.jsPDF;
            var doc = new PDF();
            doc.setFontSize(18);
            doc.text('Korean Study Sheet', 20, 20);
            doc.setFontSize(10);
            doc.text('Generated: ' + new Date().toLocaleDateString(), 20, 28);
            var y = 40;
            doc.setFontSize(11);
            for (var i = 0; i < words.length; i++) {
                if (y > 270) { doc.addPage(); y = 20; }
                var w = words[i];
                doc.text((i + 1) + '. ' + (w.korean || '') + ' (' + (w.romanization || '') + ') - ' + (w.english || ''), 20, y);
                y += 8;
            }
            doc.save('korean-study-sheet.pdf');
            if (typeof showToast === "function") showToast('PDF downloaded!');
        } catch (e) {
            generatePrintableHTML(c, words);
        }
    } else {
        generatePrintableHTML(c, words);
    }
}

function generatePrintableHTML(c, words) {
    var preview = document.getElementById('pdfPreview');
    if (!preview) return;
    var h = '<div style="background:#fff;color:#000;padding:20px;border-radius:12px;max-height:400px;overflow-y:auto">';
    h += '<h3 style="margin-bottom:10px;color:#333">Korean Study Sheet</h3>';
    h += '<p style="font-size:0.8rem;color:#666;margin-bottom:15px">Generated: ' + new Date().toLocaleDateString() + '</p>';
    if (words.length === 0) {
        h += '<p style="color:#999">No words to export. Play some games to collect words!</p>';
    } else {
        h += '<table style="width:100%;border-collapse:collapse;font-size:0.85rem">';
        h += '<tr style="background:#f0f0f0"><th style="padding:6px;border:1px solid #ddd;text-align:left">#</th><th style="padding:6px;border:1px solid #ddd;text-align:left">Korean</th><th style="padding:6px;border:1px solid #ddd;text-align:left">Romanization</th><th style="padding:6px;border:1px solid #ddd;text-align:left">English</th></tr>';
        for (var i = 0; i < words.length; i++) {
            var w = words[i];
            h += '<tr><td style="padding:4px 6px;border:1px solid #ddd">' + (i + 1) + '</td>';
            h += '<td style="padding:4px 6px;border:1px solid #ddd">' + escapeHtml(w.korean || '') + '</td>';
            h += '<td style="padding:4px 6px;border:1px solid #ddd">' + escapeHtml(w.romanization || '') + '</td>';
            h += '<td style="padding:4px 6px;border:1px solid #ddd">' + escapeHtml(w.english || '') + '</td></tr>';
        }
        h += '</table>';
    }
    h += '<button onclick="window.print()" style="margin-top:12px;padding:8px 20px;background:#9d4edd;color:#fff;border:none;border-radius:8px;cursor:pointer">Print This Page</button>';
    h += '</div>';
    preview.innerHTML = h;
}


// ============================================================
// 12. SHARE SCREEN (showShareScreen)
// ============================================================

function showShareScreen(c) {
    var appUrl = window.location.href;
    var totalWords = gameState.wordsLearned || 0;
    var level = gameState.level || 1;
    var streak = gameState.streak || 0;
    var games = gameState.gamesPlayed || 0;
    var hasQR = (typeof qrcode !== "undefined");
    var hasShare = (typeof navigator.share === "function");
    var hasCanvas = (typeof html2canvas !== "undefined");

    var shareText = 'I am learning Korean! Level ' + level + ', ' + totalWords + ' words learned, ' + games + ' games played! Try it too: ' + appUrl;

    var h = '<h2 class="game-title">Share</h2>';

    // Stats summary card
    h += '<div style="background:linear-gradient(135deg,rgba(255,45,149,0.2),rgba(157,78,221,0.2));padding:20px;border-radius:15px;margin-bottom:20px;text-align:center;border:1px solid rgba(255,45,149,0.3)" id="shareCard">';
    h += '<div style="font-size:1.5rem;color:var(--neon-pink);margin-bottom:5px">K-POP Korean Learner</div>';
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:15px 0">';
    h += '<div><div style="font-size:2rem;color:var(--gold)">' + level + '</div><div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">Level</div></div>';
    h += '<div><div style="font-size:2rem;color:var(--neon-cyan)">' + totalWords + '</div><div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">Words</div></div>';
    h += '<div><div style="font-size:2rem;color:var(--neon-pink)">' + games + '</div><div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">Games</div></div>';
    h += '</div>';
    if (streak > 0) {
        h += '<div style="color:var(--fire);font-size:0.9rem">&#128293; ' + streak + ' day streak!</div>';
    }
    h += '</div>';

    // QR Code
    if (hasQR) {
        h += '<div style="text-align:center;margin-bottom:20px">';
        h += '<div id="qrContainer" style="background:#fff;display:inline-block;padding:15px;border-radius:12px"></div>';
        h += '<p style="color:rgba(255,255,255,0.5);font-size:0.8rem;margin-top:8px">Scan to open the app</p></div>';
    }

    // Share buttons
    h += '<div style="display:grid;gap:10px;max-width:350px;margin:0 auto 20px">';
    if (hasShare) {
        h += '<button class="game-btn" id="shareWebBtn" style="padding:14px">&#128228; Share Score</button>';
    }
    h += '<button class="game-btn secondary" id="shareCopyBtn" style="padding:14px">&#128203; Copy Link</button>';
    if (hasCanvas) {
        h += '<button class="game-btn secondary" id="shareScreenshotBtn" style="padding:14px">&#128247; Screenshot</button>';
    }
    h += '</div>';

    h += '<div id="shareStatus" style="text-align:center;margin-bottom:15px"></div>';
    h += '<div class="game-controls"><button class="game-btn secondary" id="shareBackBtn">Back</button></div>';
    c.innerHTML = h;

    // Generate QR code
    if (hasQR) {
        try {
            var qr = qrcode(0, 'M');
            qr.addData(appUrl);
            qr.make();
            var qrDiv = document.getElementById('qrContainer');
            if (qrDiv) qrDiv.innerHTML = qr.createImgTag(5);
        } catch (e) {}
    }

    // Web Share API
    if (hasShare && document.getElementById('shareWebBtn')) {
        document.getElementById('shareWebBtn').onclick = function () {
            navigator.share({
                title: 'K-POP Korean Learning',
                text: shareText,
                url: appUrl
            }).catch(function () {});
        };
    }

    // Copy link
    document.getElementById('shareCopyBtn').onclick = function () {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(appUrl).then(function () {
                    var st = document.getElementById('shareStatus');
                    if (st) st.innerHTML = '<span style="color:var(--neon-cyan)">Link copied!</span>';
                });
            } else {
                var ta = document.createElement('textarea');
                ta.value = appUrl;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                var st = document.getElementById('shareStatus');
                if (st) st.innerHTML = '<span style="color:var(--neon-cyan)">Link copied!</span>';
            }
        } catch (e) {}
    };

    // Screenshot
    if (hasCanvas && document.getElementById('shareScreenshotBtn')) {
        document.getElementById('shareScreenshotBtn').onclick = function () {
            var card = document.getElementById('shareCard');
            if (!card) return;
            html2canvas(card).then(function (canvas) {
                var link = document.createElement('a');
                link.download = 'korean-learning-stats.png';
                link.href = canvas.toDataURL();
                link.click();
                if (typeof showToast === "function") showToast('Screenshot saved!');
            }).catch(function () {});
        };
    }

    document.getElementById('shareBackBtn').onclick = function () { if (typeof showMode === "function") showMode(gameState.currentMode); };
}

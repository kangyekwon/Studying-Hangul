/**
 * game-data.js
 * Default data for bonus game modes
 *
 * @module GameData
 * @description Fallback data for Korean learning games
 */

/**
 * Korean colors with hex values
 * @type {Array<Object>}
 */
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

/**
 * Korean body parts with SVG IDs
 * @type {Array<Object>}
 */
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

/**
 * Korean regions with geographic and cultural data
 * @type {Array<Object>}
 */
var defaultKoreanRegions = [
    {
        id: "seoul",
        korean: "서울",
        english: "Seoul",
        famous: "Gyeongbokgung Palace, Myeongdong",
        food: "Tteokbokki, Jjajangmyeon",
        path: "M 185,95 L 200,85 L 215,92 L 210,108 L 195,112 Z"
    },
    {
        id: "gyeonggi",
        korean: "경기도",
        english: "Gyeonggi-do",
        famous: "Suwon Hwaseong, Korean Folk Village",
        food: "Suwon Galbi",
        path: "M 155,70 L 185,55 L 230,70 L 235,120 L 195,135 L 155,120 Z"
    },
    {
        id: "incheon",
        korean: "인천",
        english: "Incheon",
        famous: "Incheon Airport, Chinatown, Songdo",
        food: "Jjajangmyeon",
        path: "M 135,85 L 155,75 L 160,100 L 150,115 L 130,105 Z"
    },
    {
        id: "gangwon",
        korean: "강원도",
        english: "Gangwon-do",
        famous: "Seoraksan, Nami Island, Ski Resorts",
        food: "Makguksu, Dakgalbi",
        path: "M 230,45 L 290,35 L 310,80 L 280,120 L 235,115 Z"
    },
    {
        id: "chungcheong",
        korean: "충청도",
        english: "Chungcheong-do",
        famous: "Daejeon Expo, Gongju, Buyeo",
        food: "Kalguksu, Sundae",
        path: "M 140,130 L 230,125 L 240,185 L 175,200 L 125,175 Z"
    },
    {
        id: "jeolla",
        korean: "전라도",
        english: "Jeolla-do",
        famous: "Jeonju Hanok Village, Gwangju",
        food: "Bibimbap, Hongeo",
        path: "M 120,200 L 185,195 L 195,280 L 145,300 L 105,265 Z"
    },
    {
        id: "gyeongsang",
        korean: "경상도",
        english: "Gyeongsang-do",
        famous: "Gyeongju, Busan Haeundae, Andong",
        food: "Milmyeon, Dwaeji Gukbap",
        path: "M 235,130 L 305,125 L 320,230 L 270,290 L 200,275 L 195,195 Z"
    },
    {
        id: "jeju",
        korean: "제주도",
        english: "Jeju-do",
        famous: "Hallasan, Seongsan Ilchulbong",
        food: "Black Pork, Hairtail Stew",
        path: "M 140,340 L 210,335 L 215,365 L 145,370 Z"
    }
];

/**
 * K-pop vocabulary terms
 * @type {Array<Object>}
 */
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

/**
 * Korean internet slang abbreviations
 * @type {Array<Object>}
 */
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

/**
 * Korean number systems (native and Sino-Korean)
 * @type {Object}
 */
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
        { number: 100, korean: "백", romanization: "baek" },
        { number: 1000, korean: "천", romanization: "cheon" },
        { number: 10000, korean: "만", romanization: "man" }
    ]
};

/**
 * Korean study tips
 * @type {Array<Object>}
 */
var defaultKoreanStudyTips = [
    { category: "listening", tip: "Watch K-dramas with Korean subtitles instead of English", reason: "You'll learn to associate sounds with written words" },
    { category: "vocabulary", tip: "Create a Korean-only day once a week", reason: "Total immersion accelerates learning" },
    { category: "grammar", tip: "Learn grammar patterns through songs", reason: "Music makes patterns memorable" },
    { category: "speaking", tip: "Record yourself speaking and compare to natives", reason: "Self-correction is powerful" },
    { category: "writing", tip: "Keep a daily journal in Korean", reason: "Daily practice builds fluency" },
    { category: "motivation", tip: "Join online Korean learning communities", reason: "Peer support maintains momentum" }
];

/**
 * Conversation starters
 * @type {Array<Object>}
 */
var defaultConversationStarters = [
    { korean: "오늘 날씨가 어때요?", romanization: "oneul nalssiga eottaeyo?", english: "How's the weather today?", context: "casual" },
    { korean: "뭐 하고 있어요?", romanization: "mwo hago isseoyo?", english: "What are you doing?", context: "casual" },
    { korean: "주말에 뭐 했어요?", romanization: "jumare mwo haesseoyo?", english: "What did you do on the weekend?", context: "casual" }
];

/**
 * K-drama vocabulary
 * @type {Array<Object>}
 */
var defaultDramaVocabulary = [
    { korean: "재벌", romanization: "jaebeol", english: "chaebol (rich family/conglomerate)", context: "Common drama trope" },
    { korean: "삼각관계", romanization: "samgak gwangye", english: "love triangle", context: "Romance drama staple" },
    { korean: "기억상실", romanization: "gieok sangshil", english: "amnesia", context: "Plot device" }
];

// ============================================================
// K-POP Korean Learning Game - Bonus Content
// Additional Korean learning data: colors, body parts,
// geography, K-pop vocab, internet slang, tongue twisters,
// study tips, number systems, conversation starters, drama vocab
// All data is globally accessible via var declarations
// ============================================================

// ============================================================
// 1. KOREAN COLORS - 20 entries
// ============================================================
var koreanColors = [
  {korean: "빨간색", english: "red", hex: "#FF0000", romanization: "ppalgansaek"},
  {korean: "주황색", english: "orange", hex: "#FF8C00", romanization: "juhwangsaek"},
  {korean: "노란색", english: "yellow", hex: "#FFD700", romanization: "noransaek"},
  {korean: "초록색", english: "green", hex: "#008000", romanization: "choroksaek"},
  {korean: "파란색", english: "blue", hex: "#0000FF", romanization: "paransaek"},
  {korean: "남색", english: "navy/indigo", hex: "#000080", romanization: "namsaek"},
  {korean: "보라색", english: "purple", hex: "#800080", romanization: "borasaek"},
  {korean: "분홍색", english: "pink", hex: "#FF69B4", romanization: "bunhongsaek"},
  {korean: "흰색", english: "white", hex: "#FFFFFF", romanization: "huinsaek"},
  {korean: "검은색", english: "black", hex: "#000000", romanization: "geomeunsaek"},
  {korean: "회색", english: "gray", hex: "#808080", romanization: "hoesaek"},
  {korean: "갈색", english: "brown", hex: "#8B4513", romanization: "galsaek"},
  {korean: "하늘색", english: "sky blue", hex: "#87CEEB", romanization: "haneulsaek"},
  {korean: "금색", english: "gold", hex: "#FFD700", romanization: "geumsaek"},
  {korean: "은색", english: "silver", hex: "#C0C0C0", romanization: "eunsaek"},
  {korean: "살구색", english: "apricot", hex: "#FBCEB1", romanization: "salgusaek"},
  {korean: "연두색", english: "yellow-green", hex: "#9ACD32", romanization: "yeondusaek"},
  {korean: "자주색", english: "magenta/crimson", hex: "#C71585", romanization: "jajusaek"},
  {korean: "베이지색", english: "beige", hex: "#F5F5DC", romanization: "beijisaek"},
  {korean: "청록색", english: "teal/cyan", hex: "#008080", romanization: "cheongnogsaek"}
];

// ============================================================
// 2. KOREAN BODY PARTS - 25 entries (grouped by region)
// ============================================================
var koreanBodyParts = [
  // Head region
  {korean: "머리", english: "head", romanization: "meori", region: "head"},
  {korean: "눈", english: "eye", romanization: "nun", region: "head"},
  {korean: "코", english: "nose", romanization: "ko", region: "head"},
  {korean: "입", english: "mouth", romanization: "ip", region: "head"},
  {korean: "귀", english: "ear", romanization: "gwi", region: "head"},
  {korean: "이마", english: "forehead", romanization: "ima", region: "head"},
  {korean: "턱", english: "chin/jaw", romanization: "teok", region: "head"},
  {korean: "뺨", english: "cheek", romanization: "ppyam", region: "head"},

  // Torso region
  {korean: "목", english: "neck", romanization: "mok", region: "torso"},
  {korean: "어깨", english: "shoulder", romanization: "eokkae", region: "torso"},
  {korean: "가슴", english: "chest", romanization: "gaseum", region: "torso"},
  {korean: "배", english: "stomach/belly", romanization: "bae", region: "torso"},
  {korean: "등", english: "back", romanization: "deung", region: "torso"},
  {korean: "허리", english: "waist/lower back", romanization: "heori", region: "torso"},

  // Arms region
  {korean: "팔", english: "arm", romanization: "pal", region: "arms"},
  {korean: "팔꿈치", english: "elbow", romanization: "palkkumchi", region: "arms"},
  {korean: "손목", english: "wrist", romanization: "sonmok", region: "arms"},
  {korean: "손", english: "hand", romanization: "son", region: "arms"},
  {korean: "손가락", english: "finger", romanization: "songarak", region: "arms"},

  // Legs region
  {korean: "다리", english: "leg", romanization: "dari", region: "legs"},
  {korean: "허벅지", english: "thigh", romanization: "heobeokji", region: "legs"},
  {korean: "무릎", english: "knee", romanization: "mureup", region: "legs"},
  {korean: "발목", english: "ankle", romanization: "balmok", region: "legs"},
  {korean: "발", english: "foot", romanization: "bal", region: "legs"},
  {korean: "발가락", english: "toe", romanization: "balgarak", region: "legs"}
];

// ============================================================
// 3. KOREAN GEOGRAPHY - 17 entries
// ============================================================
var koreanRegions = [
  {name: "서울", english: "Seoul", type: "capital", population: "9.7M", famous: "경복궁, 남산타워", food: "냉면", romanization: "seoul"},
  {name: "부산", english: "Busan", type: "metropolitan", population: "3.4M", famous: "해운대, 자갈치시장", food: "돼지국밥", romanization: "busan"},
  {name: "인천", english: "Incheon", type: "metropolitan", population: "3.0M", famous: "인천공항, 차이나타운", food: "짜장면", romanization: "incheon"},
  {name: "대구", english: "Daegu", type: "metropolitan", population: "2.4M", famous: "팔공산, 서문시장", food: "막창", romanization: "daegu"},
  {name: "대전", english: "Daejeon", type: "metropolitan", population: "1.5M", famous: "엑스포과학공원, 한밭수목원", food: "칼국수", romanization: "daejeon"},
  {name: "광주", english: "Gwangju", type: "metropolitan", population: "1.5M", famous: "무등산, 국립아시아문화전당", food: "상추튀김", romanization: "gwangju"},
  {name: "울산", english: "Ulsan", type: "metropolitan", population: "1.1M", famous: "현대자동차, 태화강", food: "언양불고기", romanization: "ulsan"},
  {name: "수원", english: "Suwon", type: "city", population: "1.2M", famous: "수원화성, 화성행궁", food: "수원갈비", romanization: "suwon"},
  {name: "제주", english: "Jeju", type: "island/province", population: "0.7M", famous: "한라산, 성산일출봉", food: "흑돼지", romanization: "jeju"},
  {name: "전주", english: "Jeonju", type: "city", population: "0.66M", famous: "한옥마을, 전동성당", food: "비빔밥", romanization: "jeonju"},
  {name: "경주", english: "Gyeongju", type: "city", population: "0.26M", famous: "불국사, 석굴암, 첨성대", food: "황남빵", romanization: "gyeongju"},
  {name: "강릉", english: "Gangneung", type: "city", population: "0.21M", famous: "경포대, 오죽헌", food: "초당순두부", romanization: "gangneung"},
  {name: "춘천", english: "Chuncheon", type: "city", population: "0.28M", famous: "남이섬, 소양강", food: "닭갈비", romanization: "chuncheon"},
  {name: "안동", english: "Andong", type: "city", population: "0.16M", famous: "하회마을, 도산서원", food: "안동찜닭", romanization: "andong"},
  {name: "여수", english: "Yeosu", type: "city", population: "0.28M", famous: "여수밤바다, 오동도", food: "갓김치", romanization: "yeosu"},
  {name: "통영", english: "Tongyeong", type: "city", population: "0.13M", famous: "한려수도, 동피랑벽화마을", food: "충무김밥", romanization: "tongyeong"},
  {name: "속초", english: "Sokcho", type: "city", population: "0.08M", famous: "설악산, 속초해수욕장", food: "오징어순대", romanization: "sokcho"}
];

// ============================================================
// 4. K-POP VOCABULARY - 30 entries
// ============================================================
var kpopVocabulary = [
  {korean: "컴백", english: "comeback", context: "When an artist releases new music after a break", example: "BTS 컴백!", romanization: "keombaek"},
  {korean: "데뷔", english: "debut", context: "An artist's first official release or performance", example: "신인 그룹이 데뷔했어요", romanization: "debwi"},
  {korean: "팬미팅", english: "fan meeting", context: "Event where fans meet their favorite artists", example: "팬미팅 티켓 구했어!", romanization: "paenmiting"},
  {korean: "음원", english: "digital music/track", context: "Music released on streaming platforms", example: "음원 차트 1위!", romanization: "eumwon"},
  {korean: "음방", english: "music show", context: "TV music performance programs like Inkigayo or M Countdown", example: "이번 주 음방 무대 대박", romanization: "eumbang"},
  {korean: "총공", english: "mass streaming", context: "Organized fan effort to stream music simultaneously", example: "12시 총공 시작!", romanization: "chonggong"},
  {korean: "스밍", english: "streaming", context: "Repeatedly playing a song on music platforms", example: "스밍 열심히 하자!", romanization: "seuming"},
  {korean: "올킬", english: "all-kill", context: "Topping all major music charts simultaneously", example: "신곡 올킬 달성!", romanization: "olkil"},
  {korean: "팬덤", english: "fandom", context: "The collective fanbase of an artist", example: "팬덤이 정말 강해요", romanization: "paendeom"},
  {korean: "비주얼", english: "visual", context: "The member known for outstanding looks", example: "비주얼 담당이에요", romanization: "bijueol"},
  {korean: "센터", english: "center", context: "The member positioned in the center during performances", example: "이번 안무 센터는 누구?", romanization: "senteo"},
  {korean: "막내", english: "youngest member (maknae)", context: "The youngest member in a K-pop group", example: "그룹의 막내예요", romanization: "mangnae"},
  {korean: "리더", english: "leader", context: "The designated leader of a K-pop group", example: "리더가 소감을 말했어요", romanization: "rideo"},
  {korean: "안무", english: "choreography", context: "The dance routine for a song", example: "안무 연습 영상 공개!", romanization: "anmu"},
  {korean: "직캠", english: "fancam", context: "Fan-recorded video focused on one specific member", example: "직캠 조회수 천만!", romanization: "jikcam"},
  {korean: "컨셉", english: "concept", context: "The artistic theme or concept for an album or comeback", example: "이번 컨셉 완전 새로워", romanization: "keonsep"},
  {korean: "타이틀곡", english: "title track", context: "The main promoted song from an album", example: "타이틀곡 뮤비 봤어?", romanization: "taiteulgok"},
  {korean: "수록곡", english: "B-side track", context: "Non-title songs included in an album", example: "수록곡이 더 좋아", romanization: "surokgok"},
  {korean: "뮤비", english: "music video (MV)", context: "Short for music video", example: "뮤비 티저 나왔어!", romanization: "myubi"},
  {korean: "예능", english: "variety show", context: "Entertainment TV programs idols appear on", example: "예능에서 완전 웃겼어", romanization: "yeneung"},
  {korean: "연습생", english: "trainee", context: "Aspiring idol training under an entertainment company", example: "연습생 기간이 3년이래", romanization: "yeonseupssaeng"},
  {korean: "아이돌", english: "idol", context: "K-pop artist, usually in a group", example: "최애 아이돌이 누구야?", romanization: "aidol"},
  {korean: "솔로", english: "solo", context: "An artist performing or releasing music individually", example: "솔로 앨범 냈어요", romanization: "sollo"},
  {korean: "콜라보", english: "collaboration", context: "Two or more artists working together on a song", example: "콜라보 무대 미쳤다", romanization: "kollabo"},
  {korean: "떼창", english: "fan chant/singalong", context: "Fans singing along loudly at a concert", example: "떼창 소름 돋았어", romanization: "ttechang"},
  {korean: "응원봉", english: "lightstick", context: "Official fan lightstick used at concerts", example: "응원봉 가져왔어?", romanization: "eungwonbong"},
  {korean: "포카", english: "photocard", context: "Small collectible photo cards included in albums", example: "포카 교환할 사람?", romanization: "poka"},
  {korean: "최애", english: "ultimate bias", context: "Your absolute favorite member across all groups", example: "최애가 바뀌었어", romanization: "choeae"},
  {korean: "입덕", english: "becoming a fan", context: "The moment you fall into a fandom", example: "이 영상 보고 입덕했어", romanization: "ipdeok"},
  {korean: "탈덕", english: "leaving a fandom", context: "Leaving or losing interest in a fandom", example: "탈덕은 못 해...", romanization: "taldeok"}
];

// ============================================================
// 5. KOREAN INTERNET SLANG 2024-2026 - 25 entries
// ============================================================
var koreanNetSlang = [
  {slang: "ㄱㅇㄷ", full: "개이득", english: "huge profit/gain", usage: "When something is really beneficial or a great deal", romanization: "gaeiduk"},
  {slang: "ㅇㅈ", full: "인정", english: "agreed/acknowledged", usage: "Expressing agreement with someone's statement", romanization: "injeong"},
  {slang: "ㄹㅇ", full: "리얼", english: "for real", usage: "Emphasizing that something is genuinely true", romanization: "rieol"},
  {slang: "ㅈㅂㅈㅂ", full: "존버존버", english: "hold on tight", usage: "Encouraging persistence through a tough situation", romanization: "jonbeo"},
  {slang: "ㄱㅂㅈㄱ", full: "갑분싸", english: "sudden mood killer", usage: "When the atmosphere suddenly becomes awkward", romanization: "gapbunssa"},
  {slang: "ㅇㄱㄹㅇ", full: "이거레알", english: "this is real", usage: "Strongly affirming something is undeniably true", romanization: "igeo rieol"},
  {slang: "ㄴㄴ", full: "노노", english: "no no", usage: "Quick way to say no or disagree", romanization: "nono"},
  {slang: "ㅎㅇ", full: "하이", english: "hi", usage: "Casual greeting in chats", romanization: "hai"},
  {slang: "ㅂㅂ", full: "바이바이", english: "bye bye", usage: "Casual farewell in chats", romanization: "baibai"},
  {slang: "ㅋㅋㅋ", full: "크크크", english: "hahaha (lol)", usage: "Expressing laughter, more k's means funnier", romanization: "kkk"},
  {slang: "ㅠㅠ", full: "흑흑", english: "crying/sad face", usage: "Expressing sadness or disappointment", romanization: "yuyu"},
  {slang: "ㅎㄷㄷ", full: "헐덜덜", english: "shocked/shook", usage: "Expressing extreme surprise or disbelief", romanization: "heoldeoldeol"},
  {slang: "갓생", full: "갓생 (God + 생활)", english: "god-life/productive life", usage: "Living a super productive and disciplined lifestyle", romanization: "gatsaeng"},
  {slang: "꿀잼", full: "꿀 + 재미", english: "super fun (honey-fun)", usage: "Something that is extremely entertaining", romanization: "kkuljaem"},
  {slang: "노잼", full: "노 + 재미", english: "not fun (no-fun)", usage: "Something that is boring or not entertaining", romanization: "nojaem"},
  {slang: "혼코노", full: "혼자 코인 노래방", english: "solo coin karaoke", usage: "Going to a coin karaoke booth alone", romanization: "honkono"},
  {slang: "혼밥", full: "혼자 밥", english: "eating alone", usage: "Having a meal by yourself", romanization: "honbap"},
  {slang: "존맛", full: "존나 맛있다", english: "super delicious", usage: "Food that tastes extremely good", romanization: "jonmat"},
  {slang: "인싸", full: "인사이더", english: "insider/popular person", usage: "Someone who is socially popular and outgoing", romanization: "inssa"},
  {slang: "아싸", full: "아웃사이더", english: "outsider/loner", usage: "Someone who prefers being alone or is not socially active", romanization: "assa"},
  {slang: "플렉스", full: "플렉스 (flex)", english: "flex/show off spending", usage: "Spending money lavishly and showing it off", romanization: "peullekseu"},
  {slang: "TMI", full: "Too Much Information", english: "too much info/oversharing", usage: "Sharing unnecessary personal details", romanization: "tiemai"},
  {slang: "갈비", full: "가성비", english: "cost-effectiveness/value", usage: "Abbreviated form of price-performance ratio", romanization: "galbi (gaseonbi)"},
  {slang: "점메추", full: "점심 메뉴 추천", english: "lunch menu recommendation", usage: "Asking friends to recommend what to eat for lunch", romanization: "jeommechu"},
  {slang: "별다줄", full: "별걸 다 줄인다", english: "abbreviating everything", usage: "Meta-slang commenting on how Koreans abbreviate everything", romanization: "byeoldajul"}
];

// ============================================================
// 6. KOREAN TONGUE TWISTERS EXTENDED - 15 entries
// ============================================================
var koreanTongueTwistersExt = [
  {
    korean: "간장 공장 공장장은 장 공장장이고 된장 공장 공장장은 강 공장장이다",
    english: "The soy sauce factory manager is Factory Manager Jang, and the soybean paste factory manager is Factory Manager Gang",
    difficulty: "hard",
    tip: "Focus on the repeating 장 (jang) and 공장 (gongjang) sounds",
    romanization: "ganjang gongjang gongjangjang-eun jang gongjangjang-igo doenjang gongjang gongjangjang-eun gang gongjangjang-ida"
  },
  {
    korean: "저기 저 콩깍지가 깐 콩깍지인가 안 깐 콩깍지인가",
    english: "Is that bean pod over there a peeled bean pod or an unpeeled bean pod?",
    difficulty: "medium",
    tip: "The key challenge is distinguishing 깐 (peeled) from 안 깐 (unpeeled)",
    romanization: "jeogi jeo konggkakjiga kkan konggkakjiinga an kkan konggkakjiinga"
  },
  {
    korean: "내가 그린 기린 그림은 긴 기린 그림이고 네가 그린 기린 그림은 안 긴 기린 그림이다",
    english: "The giraffe picture I drew is a long giraffe picture, and the giraffe picture you drew is a not-long giraffe picture",
    difficulty: "hard",
    tip: "Practice the 그린/기린/그림 (geurin/girin/geurim) distinction",
    romanization: "naega geurin girin geurim-eun gin girin geurim-igo nega geurin girin geurim-eun an gin girin geurim-ida"
  },
  {
    korean: "경찰청 철창살은 외철창살이냐 쌍철창살이냐",
    english: "Are the police station iron bars single iron bars or double iron bars?",
    difficulty: "hard",
    tip: "The 철창살 (cheolchangsal) is the core repeating sound to master",
    romanization: "gyeongchalcheong cheolchangsal-eun oecheolchangsal-inya ssangcheolchangsal-inya"
  },
  {
    korean: "신진 샹숑 가수의 신춘 샹숑 쇼",
    english: "The new chanson singer's new spring chanson show",
    difficulty: "medium",
    tip: "Focus on the 신진/신춘 (sinjin/sinchun) and 샹숑/쇼 (syangsung/syo) pairs",
    romanization: "sinjin syangsung gasuui sinchun syangsung syo"
  },
  {
    korean: "우리집 옆집 앞집 뒷집도 콩깍지 깐 콩깍지인가 안 깐 콩깍지인가",
    english: "Is the bean pod of our house, the next house, the front house, and the back house a peeled or unpeeled bean pod?",
    difficulty: "hard",
    tip: "Say the house directions clearly before tackling the bean pod part",
    romanization: "urijip yeopjip apjip dwitjipdo konggkakji kkan konggkakjiinga an kkan konggkakjiinga"
  },
  {
    korean: "저분은 박 법학박사이고 이분은 백 법학박사이다",
    english: "That person is Dr. Park of law, and this person is Dr. Baek of law",
    difficulty: "medium",
    tip: "Distinguish 박 (Park) from 백 (Baek) and the repeating 법학박사 (beopak baksa)",
    romanization: "jeobun-eun bak beophakbaksa-igo ibun-eun baek beophakbaksa-ida"
  },
  {
    korean: "한양 양장점 옆 한양 양장점",
    english: "The Hanyang tailor shop next to the Hanyang tailor shop",
    difficulty: "easy",
    tip: "Repeat 한양 양장점 (hanyang yangjangjeom) smoothly without stumbling",
    romanization: "hanyang yangjangjeom yeop hanyang yangjangjeom"
  },
  {
    korean: "앞뜰에 있는 말뚝이 말 매는 말뚝이냐 말 못 매는 말뚝이냐",
    english: "Is the stake in the front yard one that ties horses or one that cannot tie horses?",
    difficulty: "medium",
    tip: "The word 말 means both horse and speech; 말뚝 (malttuk) is the key sound",
    romanization: "aptteur-e inneun malttug-i mal maeneun malttug-inya mal mot maeneun malttug-inya"
  },
  {
    korean: "칠월 칠석은 평창 친구의 친정 칠순 잔치날",
    english: "The July 7th festival is the day of a Pyeongchang friend's mother's 70th birthday party",
    difficulty: "medium",
    tip: "The repeating ㅊ (ch) sound in 칠/친/칠순/잔치 is the main challenge",
    romanization: "chirwol chilseok-eun pyeongchang chinguui chinjeong chilsun janchinal"
  },
  {
    korean: "상표 붙인 큰 깡통은 깐 깡통인가 안 깐 깡통인가",
    english: "Is the big labeled can an opened can or an unopened can?",
    difficulty: "medium",
    tip: "Similar pattern to the bean pod twister but with 깡통 (kkangttong)",
    romanization: "sangpyo buchin keun kkangttong-eun kkan kkangttong-inga an kkan kkangttong-inga"
  },
  {
    korean: "육통 통장 적금 통장은 금 통장인가 은 통장인가",
    english: "Is the six-bank savings bankbook a gold bankbook or a silver bankbook?",
    difficulty: "medium",
    tip: "Keep rhythm with the repeating 통장 (tongjang) pattern",
    romanization: "yuktong tongjang jeokgeum tongjang-eun geum tongjang-inga eun tongjang-inga"
  },
  {
    korean: "고려고 교복은 고급 교복이고 고려고 교복은 고급 교복이다",
    english: "Goryeo High School's uniform is a high-quality uniform",
    difficulty: "easy",
    tip: "The ㄱ (g/k) sound repeats throughout; maintain consistent speed",
    romanization: "goryeogo gyobok-eun gogeup gyobok-igo goryeogo gyobok-eun gogeup gyobok-ida"
  },
  {
    korean: "작은 토끼 토끼통 옆 큰 토끼 토끼통",
    english: "The small rabbit's rabbit cage next to the big rabbit's rabbit cage",
    difficulty: "easy",
    tip: "Focus on 토끼 토끼통 (tokki tokkitong) as one rhythm unit",
    romanization: "jageun tokki tokkitong yeop keun tokki tokkitong"
  },
  {
    korean: "목동 로또 노총각이 옆집 로또 노처녀를 놀리다 노총각만 놀림당했다",
    english: "The bachelor in Mokdong who won the lottery teased the spinster next door who also won, but only the bachelor got teased back",
    difficulty: "hard",
    tip: "The ㄴ (n) and ㄹ (r/l) alternation in 노총각/놀리다/놀림 is the challenge",
    romanization: "mokdong rotto nochonggag-i yeopjip rotto nocheonyeoreul nollida nochonggagman nollimdanghaetda"
  }
];

// ============================================================
// 7. KOREAN STUDY TIPS - 20 entries
// ============================================================
var koreanStudyTips = [
  {
    title: "Consonant Pairs",
    tip: "Korean consonants come in groups of three: plain (ㄱ), tense (ㄲ), and aspirated (ㅋ). Practice each group together to hear the subtle differences.",
    category: "pronunciation"
  },
  {
    title: "Vowel Combinations",
    tip: "Master the 10 basic vowels (ㅏ,ㅓ,ㅗ,ㅜ,ㅡ,ㅣ,ㅐ,ㅔ,ㅚ,ㅟ) before moving to complex combinations. They form the foundation of all Korean sounds.",
    category: "pronunciation"
  },
  {
    title: "Batchim Rules",
    tip: "The final consonant (batchim/받침) changes pronunciation depending on the following syllable. Learn the 7 representative sounds: ㄱ,ㄴ,ㄷ,ㄹ,ㅁ,ㅂ,ㅇ.",
    category: "pronunciation"
  },
  {
    title: "Konglish Shortcut",
    tip: "Many Korean words are borrowed from English (Konglish). Words like 컴퓨터 (computer), 버스 (bus), and 텔레비전 (television) are easy wins for building vocabulary.",
    category: "vocabulary"
  },
  {
    title: "Hanja Roots",
    tip: "About 60% of Korean vocabulary comes from Chinese characters (Hanja). Learning common Hanja roots like 학 (study), 생 (life), and 인 (person) helps you guess meanings of new words.",
    category: "vocabulary"
  },
  {
    title: "Word Families",
    tip: "Learn words in families. For example: 학교 (school), 학생 (student), 학습 (study), 학원 (academy) all share the root 학.",
    category: "vocabulary"
  },
  {
    title: "Sentence Endings Matter",
    tip: "Korean sentence endings convey nuance. -요 is polite, -습니다 is formal, -야/-어 is casual. Start with -요 form for everyday conversations.",
    category: "grammar"
  },
  {
    title: "Subject-Object-Verb Order",
    tip: "Korean follows SOV order: I (subject) + rice (object) + eat (verb) = 나는 밥을 먹어요. The verb always comes last.",
    category: "grammar"
  },
  {
    title: "Particles Are Your Friends",
    tip: "Korean particles (은/는, 이/가, 을/를) mark grammatical roles. Focus on 은/는 (topic) and 이/가 (subject) first. They change based on whether the preceding syllable has a final consonant.",
    category: "grammar"
  },
  {
    title: "Drama Immersion Method",
    tip: "Watch K-dramas with Korean subtitles (not English). Even if you understand little at first, your ear will adapt to natural speech patterns and common phrases.",
    category: "listening"
  },
  {
    title: "Shadowing Technique",
    tip: "Listen to Korean audio and repeat immediately after the speaker, mimicking their intonation and rhythm. This builds natural pronunciation and listening skills simultaneously.",
    category: "listening"
  },
  {
    title: "Music Lyric Study",
    tip: "Choose a favorite K-pop song, look up the lyrics, and learn it word by word. Singing helps with pronunciation, vocabulary retention, and makes studying enjoyable.",
    category: "listening"
  },
  {
    title: "Handwriting Practice",
    tip: "Write each Hangul character by hand repeatedly. The physical act of writing helps muscle memory and makes reading faster. Use grid paper (원고지) for proper proportions.",
    category: "writing"
  },
  {
    title: "Daily Diary in Korean",
    tip: "Write 2-3 simple Korean sentences about your day. Start with basic patterns like 오늘 [place]에 갔어요 (Today I went to [place]). Gradually increase complexity.",
    category: "writing"
  },
  {
    title: "Politeness Levels",
    tip: "Korean has 7 speech levels, but focus on 3: formal (합쇼체), polite (해요체), and casual (해체). Use 해요체 as your default - it is polite enough for most situations.",
    category: "culture"
  },
  {
    title: "Age and Hierarchy",
    tip: "Age matters in Korean. Older people are addressed as 형/오빠 (older brother) or 누나/언니 (older sister). Learning these titles early avoids social awkwardness.",
    category: "culture"
  },
  {
    title: "Spaced Repetition",
    tip: "Use spaced repetition (like Anki flashcards) to review vocabulary at increasing intervals. This is scientifically proven to be the most efficient method for long-term retention.",
    category: "study method"
  },
  {
    title: "80/20 Vocabulary Rule",
    tip: "The most common 1000 Korean words cover about 80% of everyday conversation. Focus on high-frequency words first before rare vocabulary.",
    category: "study method"
  },
  {
    title: "Language Exchange Partners",
    tip: "Find a Korean language exchange partner. Apps like HelloTalk or Tandem connect you with native speakers who want to learn your language.",
    category: "study method"
  },
  {
    title: "Think in Korean",
    tip: "Try to think simple thoughts in Korean throughout the day: 배고파 (hungry), 피곤해 (tired), 재밌다 (fun). This builds an internal Korean voice without translation.",
    category: "study method"
  }
];

// ============================================================
// 8. KOREAN NUMBER SYSTEMS
// Native Korean (1-99), Sino-Korean (1-100+), 15 Counters
// ============================================================
var koreanNumberSystems = {
  native: [
    // Basic 1-10
    {number: 1, korean: "하나", romanization: "hana", note: "Becomes 한 before counters"},
    {number: 2, korean: "둘", romanization: "dul", note: "Becomes 두 before counters"},
    {number: 3, korean: "셋", romanization: "set", note: "Becomes 세 before counters"},
    {number: 4, korean: "넷", romanization: "net", note: "Becomes 네 before counters"},
    {number: 5, korean: "다섯", romanization: "daseot", note: ""},
    {number: 6, korean: "여섯", romanization: "yeoseot", note: ""},
    {number: 7, korean: "일곱", romanization: "ilgop", note: ""},
    {number: 8, korean: "여덟", romanization: "yeodeol", note: ""},
    {number: 9, korean: "아홉", romanization: "ahop", note: ""},
    {number: 10, korean: "열", romanization: "yeol", note: ""},
    // 11-19 (열 + ones digit)
    {number: 11, korean: "열하나", romanization: "yeolhana", note: "열 + 하나"},
    {number: 12, korean: "열둘", romanization: "yeoldul", note: "열 + 둘"},
    {number: 13, korean: "열셋", romanization: "yeolset", note: "열 + 셋"},
    {number: 14, korean: "열넷", romanization: "yeolnet", note: "열 + 넷"},
    {number: 15, korean: "열다섯", romanization: "yeoldaseot", note: "열 + 다섯"},
    {number: 16, korean: "열여섯", romanization: "yeolyeoseot", note: "열 + 여섯"},
    {number: 17, korean: "열일곱", romanization: "yeolilgop", note: "열 + 일곱"},
    {number: 18, korean: "열여덟", romanization: "yeolyeodeol", note: "열 + 여덟"},
    {number: 19, korean: "열아홉", romanization: "yeolahop", note: "열 + 아홉"},
    // Tens 20-90
    {number: 20, korean: "스물", romanization: "seumul", note: "Becomes 스무 before counters"},
    {number: 21, korean: "스물하나", romanization: "seumulhana", note: "스물 + 하나"},
    {number: 22, korean: "스물둘", romanization: "seumuldul", note: "스물 + 둘"},
    {number: 23, korean: "스물셋", romanization: "seumulset", note: "스물 + 셋"},
    {number: 24, korean: "스물넷", romanization: "seumulnet", note: "스물 + 넷"},
    {number: 25, korean: "스물다섯", romanization: "seumuldaseot", note: "스물 + 다섯"},
    {number: 26, korean: "스물여섯", romanization: "seumulyeoseot", note: "스물 + 여섯"},
    {number: 27, korean: "스물일곱", romanization: "seumulilgop", note: "스물 + 일곱"},
    {number: 28, korean: "스물여덟", romanization: "seumulyeodeol", note: "스물 + 여덟"},
    {number: 29, korean: "스물아홉", romanization: "seumulahop", note: "스물 + 아홉"},
    {number: 30, korean: "서른", romanization: "seoreun", note: ""},
    {number: 31, korean: "서른하나", romanization: "seoreunhana", note: "서른 + 하나"},
    {number: 32, korean: "서른둘", romanization: "seoreundul", note: "서른 + 둘"},
    {number: 33, korean: "서른셋", romanization: "seoreunset", note: "서른 + 셋"},
    {number: 34, korean: "서른넷", romanization: "seoreunnet", note: "서른 + 넷"},
    {number: 35, korean: "서른다섯", romanization: "seoreundaseot", note: "서른 + 다섯"},
    {number: 36, korean: "서른여섯", romanization: "seoreunyeoseot", note: "서른 + 여섯"},
    {number: 37, korean: "서른일곱", romanization: "seoreunilgop", note: "서른 + 일곱"},
    {number: 38, korean: "서른여덟", romanization: "seoreunyeodeol", note: "서른 + 여덟"},
    {number: 39, korean: "서른아홉", romanization: "seoreunahop", note: "서른 + 아홉"},
    {number: 40, korean: "마흔", romanization: "maheun", note: ""},
    {number: 41, korean: "마흔하나", romanization: "maheunhana", note: "마흔 + 하나"},
    {number: 42, korean: "마흔둘", romanization: "maheundul", note: "마흔 + 둘"},
    {number: 43, korean: "마흔셋", romanization: "maheunset", note: "마흔 + 셋"},
    {number: 44, korean: "마흔넷", romanization: "maheunnet", note: "마흔 + 넷"},
    {number: 45, korean: "마흔다섯", romanization: "maheundaseot", note: "마흔 + 다섯"},
    {number: 46, korean: "마흔여섯", romanization: "maheunyeoseot", note: "마흔 + 여섯"},
    {number: 47, korean: "마흔일곱", romanization: "maheunilgop", note: "마흔 + 일곱"},
    {number: 48, korean: "마흔여덟", romanization: "maheunyeodeol", note: "마흔 + 여덟"},
    {number: 49, korean: "마흔아홉", romanization: "maheunahop", note: "마흔 + 아홉"},
    {number: 50, korean: "쉰", romanization: "swin", note: ""},
    {number: 51, korean: "쉰하나", romanization: "swinhana", note: "쉰 + 하나"},
    {number: 52, korean: "쉰둘", romanization: "swindul", note: "쉰 + 둘"},
    {number: 53, korean: "쉰셋", romanization: "swinset", note: "쉰 + 셋"},
    {number: 54, korean: "쉰넷", romanization: "swinnet", note: "쉰 + 넷"},
    {number: 55, korean: "쉰다섯", romanization: "swindaseot", note: "쉰 + 다섯"},
    {number: 56, korean: "쉰여섯", romanization: "swinyeoseot", note: "쉰 + 여섯"},
    {number: 57, korean: "쉰일곱", romanization: "swinilgop", note: "쉰 + 일곱"},
    {number: 58, korean: "쉰여덟", romanization: "swinyeodeol", note: "쉰 + 여덟"},
    {number: 59, korean: "쉰아홉", romanization: "swinahop", note: "쉰 + 아홉"},
    {number: 60, korean: "예순", romanization: "yesun", note: ""},
    {number: 61, korean: "예순하나", romanization: "yesunhana", note: "예순 + 하나"},
    {number: 62, korean: "예순둘", romanization: "yesundul", note: "예순 + 둘"},
    {number: 63, korean: "예순셋", romanization: "yesunset", note: "예순 + 셋"},
    {number: 64, korean: "예순넷", romanization: "yesunnet", note: "예순 + 넷"},
    {number: 65, korean: "예순다섯", romanization: "yesundaseot", note: "예순 + 다섯"},
    {number: 66, korean: "예순여섯", romanization: "yesunyeoseot", note: "예순 + 여섯"},
    {number: 67, korean: "예순일곱", romanization: "yesunilgop", note: "예순 + 일곱"},
    {number: 68, korean: "예순여덟", romanization: "yesunyeodeol", note: "예순 + 여덟"},
    {number: 69, korean: "예순아홉", romanization: "yesunahop", note: "예순 + 아홉"},
    {number: 70, korean: "일흔", romanization: "ilheun", note: ""},
    {number: 71, korean: "일흔하나", romanization: "ilheunhana", note: "일흔 + 하나"},
    {number: 72, korean: "일흔둘", romanization: "ilheundul", note: "일흔 + 둘"},
    {number: 73, korean: "일흔셋", romanization: "ilheunset", note: "일흔 + 셋"},
    {number: 74, korean: "일흔넷", romanization: "ilheunnet", note: "일흔 + 넷"},
    {number: 75, korean: "일흔다섯", romanization: "ilheundaseot", note: "일흔 + 다섯"},
    {number: 76, korean: "일흔여섯", romanization: "ilheunyeoseot", note: "일흔 + 여섯"},
    {number: 77, korean: "일흔일곱", romanization: "ilheunilgop", note: "일흔 + 일곱"},
    {number: 78, korean: "일흔여덟", romanization: "ilheunyeodeol", note: "일흔 + 여덟"},
    {number: 79, korean: "일흔아홉", romanization: "ilheunahop", note: "일흔 + 아홉"},
    {number: 80, korean: "여든", romanization: "yeodeun", note: ""},
    {number: 81, korean: "여든하나", romanization: "yeodeunhana", note: "여든 + 하나"},
    {number: 82, korean: "여든둘", romanization: "yeodeundul", note: "여든 + 둘"},
    {number: 83, korean: "여든셋", romanization: "yeodeunset", note: "여든 + 셋"},
    {number: 84, korean: "여든넷", romanization: "yeodeunnet", note: "여든 + 넷"},
    {number: 85, korean: "여든다섯", romanization: "yeodeundaseot", note: "여든 + 다섯"},
    {number: 86, korean: "여든여섯", romanization: "yeodeunyeoseot", note: "여든 + 여섯"},
    {number: 87, korean: "여든일곱", romanization: "yeodeunilgop", note: "여든 + 일곱"},
    {number: 88, korean: "여든여덟", romanization: "yeodeunyeodeol", note: "여든 + 여덟"},
    {number: 89, korean: "여든아홉", romanization: "yeodeunahop", note: "여든 + 아홉"},
    {number: 90, korean: "아흔", romanization: "aheun", note: ""},
    {number: 91, korean: "아흔하나", romanization: "aheunhana", note: "아흔 + 하나"},
    {number: 92, korean: "아흔둘", romanization: "aheundul", note: "아흔 + 둘"},
    {number: 93, korean: "아흔셋", romanization: "aheunset", note: "아흔 + 셋"},
    {number: 94, korean: "아흔넷", romanization: "aheunnet", note: "아흔 + 넷"},
    {number: 95, korean: "아흔다섯", romanization: "aheundaseot", note: "아흔 + 다섯"},
    {number: 96, korean: "아흔여섯", romanization: "aheunyeoseot", note: "아흔 + 여섯"},
    {number: 97, korean: "아흔일곱", romanization: "aheunilgop", note: "아흔 + 일곱"},
    {number: 98, korean: "아흔여덟", romanization: "aheunyeodeol", note: "아흔 + 여덟"},
    {number: 99, korean: "아흔아홉", romanization: "aheunahop", note: "아흔 + 아홉"}
  ],

  sino: [
    // Basic 1-10
    {number: 1, korean: "일", romanization: "il"},
    {number: 2, korean: "이", romanization: "i"},
    {number: 3, korean: "삼", romanization: "sam"},
    {number: 4, korean: "사", romanization: "sa"},
    {number: 5, korean: "오", romanization: "o"},
    {number: 6, korean: "육", romanization: "yuk"},
    {number: 7, korean: "칠", romanization: "chil"},
    {number: 8, korean: "팔", romanization: "pal"},
    {number: 9, korean: "구", romanization: "gu"},
    {number: 10, korean: "십", romanization: "sip"},
    // Teens 11-19
    {number: 11, korean: "십일", romanization: "sibil"},
    {number: 12, korean: "십이", romanization: "sibi"},
    {number: 13, korean: "십삼", romanization: "sipsam"},
    {number: 14, korean: "십사", romanization: "sipsa"},
    {number: 15, korean: "십오", romanization: "sibo"},
    {number: 16, korean: "십육", romanization: "simnyuk"},
    {number: 17, korean: "십칠", romanization: "sipchil"},
    {number: 18, korean: "십팔", romanization: "sippal"},
    {number: 19, korean: "십구", romanization: "sipgu"},
    // Tens 20-90
    {number: 20, korean: "이십", romanization: "isip"},
    {number: 21, korean: "이십일", romanization: "isibil"},
    {number: 22, korean: "이십이", romanization: "isibi"},
    {number: 23, korean: "이십삼", romanization: "isipsam"},
    {number: 24, korean: "이십사", romanization: "isipsa"},
    {number: 25, korean: "이십오", romanization: "isibo"},
    {number: 26, korean: "이십육", romanization: "isimnyuk"},
    {number: 27, korean: "이십칠", romanization: "isipchil"},
    {number: 28, korean: "이십팔", romanization: "isippal"},
    {number: 29, korean: "이십구", romanization: "isipgu"},
    {number: 30, korean: "삼십", romanization: "samsip"},
    {number: 31, korean: "삼십일", romanization: "samsibil"},
    {number: 32, korean: "삼십이", romanization: "samsibi"},
    {number: 33, korean: "삼십삼", romanization: "samsipsam"},
    {number: 34, korean: "삼십사", romanization: "samsipsa"},
    {number: 35, korean: "삼십오", romanization: "samsibo"},
    {number: 36, korean: "삼십육", romanization: "samsimnyuk"},
    {number: 37, korean: "삼십칠", romanization: "samsipchil"},
    {number: 38, korean: "삼십팔", romanization: "samsippal"},
    {number: 39, korean: "삼십구", romanization: "samsipgu"},
    {number: 40, korean: "사십", romanization: "sasip"},
    {number: 41, korean: "사십일", romanization: "sasibil"},
    {number: 42, korean: "사십이", romanization: "sasibi"},
    {number: 43, korean: "사십삼", romanization: "sasipsam"},
    {number: 44, korean: "사십사", romanization: "sasipsa"},
    {number: 45, korean: "사십오", romanization: "sasibo"},
    {number: 46, korean: "사십육", romanization: "sasimnyuk"},
    {number: 47, korean: "사십칠", romanization: "sasipchil"},
    {number: 48, korean: "사십팔", romanization: "sasippal"},
    {number: 49, korean: "사십구", romanization: "sasipgu"},
    {number: 50, korean: "오십", romanization: "osip"},
    {number: 51, korean: "오십일", romanization: "osibil"},
    {number: 52, korean: "오십이", romanization: "osibi"},
    {number: 53, korean: "오십삼", romanization: "osipsam"},
    {number: 54, korean: "오십사", romanization: "osipsa"},
    {number: 55, korean: "오십오", romanization: "osibo"},
    {number: 56, korean: "오십육", romanization: "osimnyuk"},
    {number: 57, korean: "오십칠", romanization: "osipchil"},
    {number: 58, korean: "오십팔", romanization: "osippal"},
    {number: 59, korean: "오십구", romanization: "osipgu"},
    {number: 60, korean: "육십", romanization: "yuksip"},
    {number: 61, korean: "육십일", romanization: "yuksibil"},
    {number: 62, korean: "육십이", romanization: "yuksibi"},
    {number: 63, korean: "육십삼", romanization: "yuksipsam"},
    {number: 64, korean: "육십사", romanization: "yuksipsa"},
    {number: 65, korean: "육십오", romanization: "yuksibo"},
    {number: 66, korean: "육십육", romanization: "yuksimnyuk"},
    {number: 67, korean: "육십칠", romanization: "yuksipchil"},
    {number: 68, korean: "육십팔", romanization: "yuksippal"},
    {number: 69, korean: "육십구", romanization: "yuksipgu"},
    {number: 70, korean: "칠십", romanization: "chilsip"},
    {number: 71, korean: "칠십일", romanization: "chilsibil"},
    {number: 72, korean: "칠십이", romanization: "chilsibi"},
    {number: 73, korean: "칠십삼", romanization: "chilsipsam"},
    {number: 74, korean: "칠십사", romanization: "chilsipsa"},
    {number: 75, korean: "칠십오", romanization: "chilsibo"},
    {number: 76, korean: "칠십육", romanization: "chilsimnyuk"},
    {number: 77, korean: "칠십칠", romanization: "chilsipchil"},
    {number: 78, korean: "칠십팔", romanization: "chilsippal"},
    {number: 79, korean: "칠십구", romanization: "chilsipgu"},
    {number: 80, korean: "팔십", romanization: "palsip"},
    {number: 81, korean: "팔십일", romanization: "palsibil"},
    {number: 82, korean: "팔십이", romanization: "palsibi"},
    {number: 83, korean: "팔십삼", romanization: "palsipsam"},
    {number: 84, korean: "팔십사", romanization: "palsipsa"},
    {number: 85, korean: "팔십오", romanization: "palsibo"},
    {number: 86, korean: "팔십육", romanization: "palsimnyuk"},
    {number: 87, korean: "팔십칠", romanization: "palsipchil"},
    {number: 88, korean: "팔십팔", romanization: "palsippal"},
    {number: 89, korean: "팔십구", romanization: "palsipgu"},
    {number: 90, korean: "구십", romanization: "gusip"},
    {number: 91, korean: "구십일", romanization: "gusibil"},
    {number: 92, korean: "구십이", romanization: "gusibi"},
    {number: 93, korean: "구십삼", romanization: "gusipsam"},
    {number: 94, korean: "구십사", romanization: "gusipsa"},
    {number: 95, korean: "구십오", romanization: "gusibo"},
    {number: 96, korean: "구십육", romanization: "gusimnyuk"},
    {number: 97, korean: "구십칠", romanization: "gusipchil"},
    {number: 98, korean: "구십팔", romanization: "gusippal"},
    {number: 99, korean: "구십구", romanization: "gusipgu"},
    // 100 and beyond
    {number: 100, korean: "백", romanization: "baek"},
    {number: 200, korean: "이백", romanization: "ibaek"},
    {number: 300, korean: "삼백", romanization: "sambaek"},
    {number: 500, korean: "오백", romanization: "obaek"},
    {number: 1000, korean: "천", romanization: "cheon"},
    {number: 2000, korean: "이천", romanization: "icheon"},
    {number: 10000, korean: "만", romanization: "man"},
    {number: 100000, korean: "십만", romanization: "simman"},
    {number: 1000000, korean: "백만", romanization: "baengman"},
    {number: 100000000, korean: "억", romanization: "eok"}
  ],

  counters: [
    {counter: "개", usage: "general objects/things", example: "사과 세 개 (three apples)", romanization: "gae", numberSystem: "native"},
    {counter: "명", usage: "people (polite/formal)", example: "학생 다섯 명 (five students)", romanization: "myeong", numberSystem: "native"},
    {counter: "사람", usage: "people (casual)", example: "세 사람 (three people)", romanization: "saram", numberSystem: "native"},
    {counter: "마리", usage: "animals", example: "고양이 두 마리 (two cats)", romanization: "mari", numberSystem: "native"},
    {counter: "권", usage: "books/volumes", example: "책 한 권 (one book)", romanization: "gwon", numberSystem: "native"},
    {counter: "잔", usage: "cups/glasses of drinks", example: "커피 두 잔 (two cups of coffee)", romanization: "jan", numberSystem: "native"},
    {counter: "병", usage: "bottles", example: "물 세 병 (three bottles of water)", romanization: "byeong", numberSystem: "native"},
    {counter: "대", usage: "vehicles/machines", example: "차 한 대 (one car)", romanization: "dae", numberSystem: "native"},
    {counter: "벌", usage: "sets of clothing", example: "옷 한 벌 (one set of clothes)", romanization: "beol", numberSystem: "native"},
    {counter: "장", usage: "flat objects/sheets of paper", example: "종이 세 장 (three sheets of paper)", romanization: "jang", numberSystem: "native"},
    {counter: "그루", usage: "trees", example: "나무 두 그루 (two trees)", romanization: "geuru", numberSystem: "native"},
    {counter: "송이", usage: "flowers/bunches", example: "장미 열 송이 (ten roses)", romanization: "songi", numberSystem: "native"},
    {counter: "켤레", usage: "pairs (shoes/socks/gloves)", example: "신발 한 켤레 (one pair of shoes)", romanization: "kyeolle", numberSystem: "native"},
    {counter: "자루", usage: "long thin objects (pens/pencils)", example: "연필 세 자루 (three pencils)", romanization: "jaru", numberSystem: "native"},
    {counter: "채", usage: "buildings/houses", example: "집 두 채 (two houses)", romanization: "chae", numberSystem: "native"}
  ],

  usage: {
    native: "Used for counting objects with counters, hours (1-12), age (casual), and general counting up to 99",
    sino: "Used for minutes, dates, months, money, phone numbers, addresses, floors, and numbers above 100"
  }
};

// ============================================================
// 9. KOREAN CONVERSATION STARTERS - 20 entries
// ============================================================
var conversationStarters = [
  {korean: "요즘 뭐 하세요?", english: "What are you up to these days?", level: "beginner", context: "casual greeting", romanization: "yojeum mwo haseyo?"},
  {korean: "어디 사세요?", english: "Where do you live?", level: "beginner", context: "getting to know someone", romanization: "eodi saseyo?"},
  {korean: "취미가 뭐예요?", english: "What are your hobbies?", level: "beginner", context: "casual conversation", romanization: "chwimiga mwoyeyo?"},
  {korean: "한국어 공부한 지 얼마나 됐어요?", english: "How long have you been studying Korean?", level: "intermediate", context: "language exchange", romanization: "hangugeo gongbuhan ji eolmana dwaesseoyo?"},
  {korean: "주말에 보통 뭐 해요?", english: "What do you usually do on weekends?", level: "beginner", context: "casual conversation", romanization: "jumar-e botong mwo haeyo?"},
  {korean: "좋아하는 한국 음식 있어요?", english: "Do you have a favorite Korean food?", level: "beginner", context: "food discussion", romanization: "joahaneun hanguk eumsik isseoyo?"},
  {korean: "한국 드라마 보세요?", english: "Do you watch Korean dramas?", level: "beginner", context: "entertainment", romanization: "hanguk deurama boseyo?"},
  {korean: "요즘 무슨 노래 들어요?", english: "What songs are you listening to lately?", level: "beginner", context: "music discussion", romanization: "yojeum museun norae deureoyo?"},
  {korean: "오늘 날씨가 좋네요, 그렇죠?", english: "The weather is nice today, isn't it?", level: "beginner", context: "small talk", romanization: "oneul nalssiga joneyo, geureochyo?"},
  {korean: "여기 자주 오세요?", english: "Do you come here often?", level: "beginner", context: "at a cafe or restaurant", romanization: "yeogi jaju oseyo?"},
  {korean: "어디 출신이에요?", english: "Where are you from?", level: "beginner", context: "first meeting", romanization: "eodi chulshinieyo?"},
  {korean: "무슨 일 하세요?", english: "What do you do for work?", level: "beginner", context: "getting to know someone", romanization: "museun il haseyo?"},
  {korean: "이번 연휴에 어디 가세요?", english: "Where are you going for the holiday?", level: "intermediate", context: "seasonal small talk", romanization: "ibeon yeonhyu-e eodi gaseyo?"},
  {korean: "요즘 재미있는 거 추천해 주세요!", english: "Please recommend something fun these days!", level: "intermediate", context: "asking for recommendations", romanization: "yojeum jaemiinneun geo chucheonhae juseyo!"},
  {korean: "한국에 가 본 적 있어요?", english: "Have you ever been to Korea?", level: "intermediate", context: "travel discussion", romanization: "hanguge ga bon jeok isseoyo?"},
  {korean: "오늘 점심 뭐 드셨어요?", english: "What did you have for lunch today?", level: "beginner", context: "daily conversation", romanization: "oneul jeomsim mwo deusyeosseoyo?"},
  {korean: "혹시 이 근처에 맛집 아세요?", english: "Do you happen to know any good restaurants around here?", level: "intermediate", context: "asking for local tips", romanization: "hoksi i geuncheo-e matjip aseyo?"},
  {korean: "같이 커피 한 잔 할래요?", english: "Want to grab a cup of coffee together?", level: "intermediate", context: "making plans", romanization: "gachi keopi han jan hallaeyo?"},
  {korean: "이번 주 계획 있어요?", english: "Do you have plans this week?", level: "beginner", context: "making plans", romanization: "ibeon ju gyehoek isseoyo?"},
  {korean: "요즘 한국에서 뭐가 유행이에요?", english: "What's trending in Korea these days?", level: "intermediate", context: "cultural discussion", romanization: "yojeum hangukeseo mwoga yuhaengieyo?"}
];

// ============================================================
// 10. KOREAN MOVIE/DRAMA VOCABULARY - 25 entries
// ============================================================
var dramaVocabulary = [
  {korean: "재벌", english: "conglomerate/chaebol", context: "Rich powerful family trope in K-dramas", dramas: ["상속자들", "펜트하우스"], romanization: "jaebeol"},
  {korean: "삼각관계", english: "love triangle", context: "Three people entangled in romantic feelings", dramas: ["응답하라 1988", "도깨비"], romanization: "samgakgwangye"},
  {korean: "기억상실", english: "amnesia", context: "A character loses their memory, a classic trope", dramas: ["킬미힐미", "하이드 지킬, 나"], romanization: "gieoksangsil"},
  {korean: "복수", english: "revenge", context: "Character seeks revenge for past wrongs", dramas: ["더 글로리", "부부의 세계"], romanization: "boksu"},
  {korean: "출생의 비밀", english: "birth secret", context: "Hidden parentage or identity revealed later", dramas: ["별에서 온 그대", "상속자들"], romanization: "chulsaengui bimil"},
  {korean: "첫사랑", english: "first love", context: "Nostalgic first love that returns years later", dramas: ["겨울연가", "응답하라 1997"], romanization: "cheotsarang"},
  {korean: "운명", english: "fate/destiny", context: "Destined lovers who keep crossing paths", dramas: ["도깨비", "사랑의 불시착"], romanization: "unmyeong"},
  {korean: "악역", english: "villain", context: "The antagonist character everyone loves to hate", dramas: ["펜트하우스", "더 글로리"], romanization: "akyeok"},
  {korean: "재회", english: "reunion", context: "Long-separated characters meeting again", dramas: ["봄밤", "눈물의 여왕"], romanization: "jaehoe"},
  {korean: "고백", english: "confession (of love)", context: "Declaring romantic feelings to someone", dramas: ["사랑의 불시착", "이태원 클라쓰"], romanization: "gobaek"},
  {korean: "이별", english: "breakup/farewell", context: "Sad separation scene, often in the rain", dramas: ["가을동화", "미안하다 사랑한다"], romanization: "ibyeol"},
  {korean: "계약결혼", english: "contract marriage", context: "Fake marriage that becomes real love", dramas: ["풀하우스", "결혼작사 이혼작곡"], romanization: "gyeyakgyeolhon"},
  {korean: "시간여행", english: "time travel", context: "Characters traveling between different time periods", dramas: ["시그널", "나의 나라"], romanization: "siganyeohaeng"},
  {korean: "맞선", english: "arranged blind date", context: "Traditional Korean matchmaking meeting", dramas: ["사내맞선", "신사의 품격"], romanization: "matseon"},
  {korean: "회장님", english: "chairman", context: "Powerful corporate leader, often the father figure", dramas: ["상속자들", "재벌집 막내아들"], romanization: "hoejangnim"},
  {korean: "비서", english: "secretary", context: "Personal secretary who falls for the boss", dramas: ["김비서가 왜 그럴까", "미생"], romanization: "biseo"},
  {korean: "선배", english: "senior (at work/school)", context: "Respected senior colleague or upperclassman", dramas: ["치즈인더트랩", "선배 그 립스틱 바르지 마요"], romanization: "seonbae"},
  {korean: "후배", english: "junior (at work/school)", context: "Junior colleague or underclassman", dramas: ["미생", "슬기로운 의사생활"], romanization: "hubae"},
  {korean: "사극", english: "historical drama (sageuk)", context: "Period drama set in Korean history", dramas: ["대장금", "해를 품은 달"], romanization: "sageuk"},
  {korean: "로맨스", english: "romance", context: "Love story genre, the heart of most K-dramas", dramas: ["사랑의 불시착", "도깨비"], romanization: "romaenseu"},
  {korean: "막장", english: "over-the-top/makjang drama", context: "Extreme plotlines with shocking twists", dramas: ["펜트하우스", "천서진"], romanization: "makjang"},
  {korean: "오빠", english: "older brother (from a woman)", context: "Term of endearment for older males, very common in dramas", dramas: ["도깨비", "태양의 후예"], romanization: "oppa"},
  {korean: "대리", english: "assistant manager", context: "Common corporate rank seen in office dramas", dramas: ["미생", "김과장"], romanization: "daeri"},
  {korean: "좀비", english: "zombie", context: "Zombie apocalypse genre gaining popularity", dramas: ["킹덤", "지금 우리 학교는"], romanization: "jombi"},
  {korean: "전생", english: "past life/previous life", context: "Reincarnation stories connecting past and present", dramas: ["도깨비", "달의 연인"], romanization: "jeonsaeng"}
];

// ============================================================
// Helper function to get all bonus content categories
// ============================================================
function getBonusContentCategories() {
  return [
    {id: "colors", name: "Korean Colors", count: koreanColors.length, data: koreanColors},
    {id: "bodyParts", name: "Body Parts", count: koreanBodyParts.length, data: koreanBodyParts},
    {id: "geography", name: "Korean Geography", count: koreanRegions.length, data: koreanRegions},
    {id: "kpop", name: "K-Pop Vocabulary", count: kpopVocabulary.length, data: kpopVocabulary},
    {id: "netSlang", name: "Internet Slang", count: koreanNetSlang.length, data: koreanNetSlang},
    {id: "tongueTwisters", name: "Tongue Twisters", count: koreanTongueTwistersExt.length, data: koreanTongueTwistersExt},
    {id: "studyTips", name: "Study Tips", count: koreanStudyTips.length, data: koreanStudyTips},
    {id: "numbers", name: "Number Systems", count: koreanNumberSystems.native.length + koreanNumberSystems.sino.length + koreanNumberSystems.counters.length, data: koreanNumberSystems},
    {id: "conversation", name: "Conversation Starters", count: conversationStarters.length, data: conversationStarters},
    {id: "drama", name: "Drama Vocabulary", count: dramaVocabulary.length, data: dramaVocabulary}
  ];
}

// Helper function to search across all bonus content
function searchBonusContent(query) {
  var results = [];
  var lowerQuery = query.toLowerCase();

  koreanColors.forEach(function(item) {
    if (item.korean.indexOf(query) !== -1 || item.english.toLowerCase().indexOf(lowerQuery) !== -1) {
      results.push({category: "colors", item: item});
    }
  });

  koreanBodyParts.forEach(function(item) {
    if (item.korean.indexOf(query) !== -1 || item.english.toLowerCase().indexOf(lowerQuery) !== -1) {
      results.push({category: "bodyParts", item: item});
    }
  });

  koreanRegions.forEach(function(item) {
    if (item.name.indexOf(query) !== -1 || item.english.toLowerCase().indexOf(lowerQuery) !== -1) {
      results.push({category: "geography", item: item});
    }
  });

  kpopVocabulary.forEach(function(item) {
    if (item.korean.indexOf(query) !== -1 || item.english.toLowerCase().indexOf(lowerQuery) !== -1) {
      results.push({category: "kpop", item: item});
    }
  });

  koreanNetSlang.forEach(function(item) {
    if (item.slang.indexOf(query) !== -1 || item.full.indexOf(query) !== -1 || item.english.toLowerCase().indexOf(lowerQuery) !== -1) {
      results.push({category: "netSlang", item: item});
    }
  });

  conversationStarters.forEach(function(item) {
    if (item.korean.indexOf(query) !== -1 || item.english.toLowerCase().indexOf(lowerQuery) !== -1) {
      results.push({category: "conversation", item: item});
    }
  });

  dramaVocabulary.forEach(function(item) {
    if (item.korean.indexOf(query) !== -1 || item.english.toLowerCase().indexOf(lowerQuery) !== -1) {
      results.push({category: "drama", item: item});
    }
  });

  return results;
}

// Helper function to get random item from any bonus category
function getRandomBonusItem(category) {
  var data;
  if (category === "colors") data = koreanColors;
  else if (category === "bodyParts") data = koreanBodyParts;
  else if (category === "geography") data = koreanRegions;
  else if (category === "kpop") data = kpopVocabulary;
  else if (category === "netSlang") data = koreanNetSlang;
  else if (category === "tongueTwisters") data = koreanTongueTwistersExt;
  else if (category === "studyTips") data = koreanStudyTips;
  else if (category === "conversation") data = conversationStarters;
  else if (category === "drama") data = dramaVocabulary;
  else return null;

  return data[Math.floor(Math.random() * data.length)];
}

// Helper function to get body parts by region
function getBodyPartsByRegion(region) {
  return koreanBodyParts.filter(function(part) {
    return part.region === region;
  });
}

// Helper function to get native Korean number
function getNativeKoreanNumber(n) {
  if (n < 1 || n > 99) return null;
  var found = koreanNumberSystems.native.filter(function(item) {
    return item.number === n;
  });
  return found.length > 0 ? found[0] : null;
}

// Helper function to get sino-Korean number
function getSinoKoreanNumber(n) {
  var found = koreanNumberSystems.sino.filter(function(item) {
    return item.number === n;
  });
  return found.length > 0 ? found[0] : null;
}

// Helper function to get conversation starters by level
function getConversationsByLevel(level) {
  return conversationStarters.filter(function(item) {
    return item.level === level;
  });
}

// Helper function to get tongue twisters by difficulty
function getTongueTwistersByDifficulty(difficulty) {
  return koreanTongueTwistersExt.filter(function(item) {
    return item.difficulty === difficulty;
  });
}

// Helper function to get study tips by category
function getStudyTipsByCategory(category) {
  return koreanStudyTips.filter(function(item) {
    return item.category === category;
  });
}

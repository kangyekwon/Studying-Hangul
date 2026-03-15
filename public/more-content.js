// more-content.js
// Additional Korean learning content data
// Categories: Proverbs, Honorifics, Particles, Hanja, Minimal Pairs,
//             Onomatopoeia, Sentence Patterns, Cultural Calendar

// ============================================================
// 1. Korean Proverbs (속담) - 40 entries
// ============================================================
var koreanProverbs = [
  {
    korean: "가는 말이 고와야 오는 말이 곱다",
    english: "If the going words are beautiful, the coming words will be beautiful",
    meaning: "If you speak kindly to others, they will speak kindly to you",
    difficulty: "beginner"
  },
  {
    korean: "꿩 대신 닭",
    english: "A chicken instead of a pheasant",
    meaning: "When you cannot get what you want, settle for the next best thing",
    difficulty: "beginner"
  },
  {
    korean: "낮말은 새가 듣고 밤말은 쥐가 듣는다",
    english: "Birds hear daytime words, mice hear nighttime words",
    meaning: "Be careful what you say because someone is always listening",
    difficulty: "beginner"
  },
  {
    korean: "원숭이도 나무에서 떨어진다",
    english: "Even a monkey falls from a tree",
    meaning: "Even experts make mistakes sometimes",
    difficulty: "beginner"
  },
  {
    korean: "세 살 버릇 여든까지 간다",
    english: "A habit from age three lasts until eighty",
    meaning: "Habits formed early in life are hard to break",
    difficulty: "beginner"
  },
  {
    korean: "백지장도 맞들면 낫다",
    english: "Even a sheet of paper is lighter when held together",
    meaning: "Two heads are better than one; teamwork makes things easier",
    difficulty: "beginner"
  },
  {
    korean: "소 잃고 외양간 고친다",
    english: "Fixing the barn after losing the cow",
    meaning: "Taking precautions after the damage is already done; too late to act",
    difficulty: "beginner"
  },
  {
    korean: "누워서 떡 먹기",
    english: "Eating rice cake while lying down",
    meaning: "Something extremely easy to do; a piece of cake",
    difficulty: "beginner"
  },
  {
    korean: "티끌 모아 태산",
    english: "Gather dust to make a great mountain",
    meaning: "Many small amounts can accumulate into something great",
    difficulty: "beginner"
  },
  {
    korean: "고생 끝에 낙이 온다",
    english: "Joy comes at the end of hardship",
    meaning: "After suffering comes happiness; no pain, no gain",
    difficulty: "beginner"
  },
  {
    korean: "콩 심은 데 콩 나고 팥 심은 데 팥 난다",
    english: "Beans grow where beans are planted, red beans grow where red beans are planted",
    meaning: "You reap what you sow",
    difficulty: "intermediate"
  },
  {
    korean: "빈 수레가 요란하다",
    english: "An empty cart makes the most noise",
    meaning: "Those who know the least often talk the most",
    difficulty: "intermediate"
  },
  {
    korean: "아는 길도 물어 가라",
    english: "Ask even about a road you know",
    meaning: "It is always wise to double-check, even when you feel confident",
    difficulty: "intermediate"
  },
  {
    korean: "우물 안 개구리",
    english: "A frog in a well",
    meaning: "A person with a narrow worldview who knows nothing beyond their small world",
    difficulty: "intermediate"
  },
  {
    korean: "하늘의 별 따기",
    english: "Picking stars from the sky",
    meaning: "Something nearly impossible to achieve",
    difficulty: "intermediate"
  },
  {
    korean: "가재는 게 편이다",
    english: "The crayfish sides with the crab",
    meaning: "People tend to side with those who are similar to them",
    difficulty: "intermediate"
  },
  {
    korean: "돌다리도 두들겨 보고 건너라",
    english: "Tap even a stone bridge before crossing",
    meaning: "Always be careful and check things thoroughly before proceeding",
    difficulty: "intermediate"
  },
  {
    korean: "말이 씨가 된다",
    english: "Words become seeds",
    meaning: "What you say can come true, so be careful with your words",
    difficulty: "intermediate"
  },
  {
    korean: "서당 개 삼 년이면 풍월을 읊는다",
    english: "A dog at a village school recites poetry after three years",
    meaning: "Even someone without talent can learn through long exposure",
    difficulty: "intermediate"
  },
  {
    korean: "등잔 밑이 어둡다",
    english: "It is dark under the lamp",
    meaning: "It is hard to see what is right in front of you; problems closest to home are hardest to notice",
    difficulty: "intermediate"
  },
  {
    korean: "가랑비에 옷 젖는 줄 모른다",
    english: "You do not notice your clothes getting wet in a drizzle",
    meaning: "Small, repeated losses can add up without being noticed",
    difficulty: "intermediate"
  },
  {
    korean: "뜻이 있는 곳에 길이 있다",
    english: "Where there is a will, there is a way",
    meaning: "Determination and perseverance lead to success",
    difficulty: "intermediate"
  },
  {
    korean: "김칫국부터 마신다",
    english: "Drinking the kimchi broth first",
    meaning: "Counting your chickens before they hatch; being presumptuous",
    difficulty: "intermediate"
  },
  {
    korean: "까마귀 날자 배 떨어진다",
    english: "A pear falls when a crow flies away",
    meaning: "An unfortunate coincidence that makes someone look guilty",
    difficulty: "intermediate"
  },
  {
    korean: "같은 값이면 다홍치마",
    english: "For the same price, choose the red skirt",
    meaning: "If the cost is the same, choose the better or more attractive option",
    difficulty: "intermediate"
  },
  {
    korean: "남의 떡이 커 보인다",
    english: "Other people's rice cakes look bigger",
    meaning: "The grass is always greener on the other side",
    difficulty: "beginner"
  },
  {
    korean: "작은 고추가 맵다",
    english: "Small peppers are spicy",
    meaning: "Do not underestimate someone because of their small size",
    difficulty: "beginner"
  },
  {
    korean: "될성부른 나무는 떡잎부터 알아본다",
    english: "A tree that will grow well is recognized from its seed leaf",
    meaning: "Future greatness can be seen from an early age",
    difficulty: "advanced"
  },
  {
    korean: "사공이 많으면 배가 산으로 간다",
    english: "With too many boatmen, the boat goes to the mountain",
    meaning: "Too many leaders spoil the project; too many cooks spoil the broth",
    difficulty: "intermediate"
  },
  {
    korean: "호랑이도 제 말 하면 온다",
    english: "Even a tiger comes when you talk about it",
    meaning: "Speak of the devil and the devil appears",
    difficulty: "beginner"
  },
  {
    korean: "하늘이 무너져도 솟아날 구멍이 있다",
    english: "Even if the sky falls, there is a hole to escape through",
    meaning: "There is always a way out, no matter how hopeless the situation seems",
    difficulty: "advanced"
  },
  {
    korean: "개구리 올챙이 적 생각 못 한다",
    english: "The frog does not remember being a tadpole",
    meaning: "People forget their humble beginnings after achieving success",
    difficulty: "intermediate"
  },
  {
    korean: "바늘 도둑이 소 도둑 된다",
    english: "A needle thief becomes a cow thief",
    meaning: "Small bad habits can grow into major wrongdoings",
    difficulty: "intermediate"
  },
  {
    korean: "천 리 길도 한 걸음부터",
    english: "A journey of a thousand ri starts with a single step",
    meaning: "Every great achievement begins with a small first step",
    difficulty: "beginner"
  },
  {
    korean: "입에 쓴 약이 몸에 좋다",
    english: "Bitter medicine is good for the body",
    meaning: "Honest criticism may be hard to hear but is ultimately beneficial",
    difficulty: "intermediate"
  },
  {
    korean: "공든 탑이 무너지랴",
    english: "Would a carefully built tower collapse?",
    meaning: "Hard work and dedication will not go to waste",
    difficulty: "advanced"
  },
  {
    korean: "어물전 망신은 꼴뚜기가 시킨다",
    english: "The cuttlefish brings shame to the fish market",
    meaning: "One bad member can ruin the reputation of the whole group",
    difficulty: "advanced"
  },
  {
    korean: "제 눈에 안경이다",
    english: "Glasses for one's own eyes",
    meaning: "Beauty is in the eye of the beholder",
    difficulty: "intermediate"
  },
  {
    korean: "목마른 놈이 우물 판다",
    english: "The thirsty one digs the well",
    meaning: "The person who needs something the most should take the initiative",
    difficulty: "advanced"
  },
  {
    korean: "열 번 찍어 안 넘어가는 나무 없다",
    english: "No tree can withstand ten strikes of the axe",
    meaning: "Persistence pays off; keep trying and you will succeed",
    difficulty: "advanced"
  }
];

// ============================================================
// 2. Honorific System (존댓말/반말) - 25 pairs
// ============================================================
var honorificPairs = [
  {
    casual: "먹어",
    formal: "드세요",
    polite: "먹어요",
    context: "eating",
    english: "eat"
  },
  {
    casual: "마셔",
    formal: "드세요",
    polite: "마셔요",
    context: "drinking",
    english: "drink"
  },
  {
    casual: "자",
    formal: "주무세요",
    polite: "자요",
    context: "sleeping",
    english: "sleep"
  },
  {
    casual: "있어",
    formal: "계세요",
    polite: "있어요",
    context: "being/staying",
    english: "be / stay"
  },
  {
    casual: "가",
    formal: "가세요",
    polite: "가요",
    context: "going",
    english: "go"
  },
  {
    casual: "와",
    formal: "오세요",
    polite: "와요",
    context: "coming",
    english: "come"
  },
  {
    casual: "봐",
    formal: "보세요",
    polite: "봐요",
    context: "seeing/watching",
    english: "see / look"
  },
  {
    casual: "알아",
    formal: "아세요",
    polite: "알아요",
    context: "knowing",
    english: "know"
  },
  {
    casual: "말해",
    formal: "말씀하세요",
    polite: "말해요",
    context: "speaking",
    english: "speak / say"
  },
  {
    casual: "물어봐",
    formal: "여쭤보세요",
    polite: "물어봐요",
    context: "asking",
    english: "ask"
  },
  {
    casual: "줘",
    formal: "주세요",
    polite: "줘요",
    context: "giving",
    english: "give"
  },
  {
    casual: "해",
    formal: "하세요",
    polite: "해요",
    context: "doing",
    english: "do"
  },
  {
    casual: "앉아",
    formal: "앉으세요",
    polite: "앉아요",
    context: "sitting",
    english: "sit"
  },
  {
    casual: "읽어",
    formal: "읽으세요",
    polite: "읽어요",
    context: "reading",
    english: "read"
  },
  {
    casual: "써",
    formal: "쓰세요",
    polite: "써요",
    context: "writing",
    english: "write"
  },
  {
    casual: "들어",
    formal: "들으세요",
    polite: "들어요",
    context: "listening",
    english: "listen"
  },
  {
    casual: "만나",
    formal: "만나세요",
    polite: "만나요",
    context: "meeting",
    english: "meet"
  },
  {
    casual: "사",
    formal: "사세요",
    polite: "사요",
    context: "buying",
    english: "buy"
  },
  {
    casual: "배워",
    formal: "배우세요",
    polite: "배워요",
    context: "learning",
    english: "learn"
  },
  {
    casual: "기다려",
    formal: "기다리세요",
    polite: "기다려요",
    context: "waiting",
    english: "wait"
  },
  {
    casual: "죽어",
    formal: "돌아가시다",
    polite: "죽어요",
    context: "dying (honorific uses different word)",
    english: "pass away / die"
  },
  {
    casual: "아파",
    formal: "편찮으세요",
    polite: "아파요",
    context: "being sick (honorific uses different word)",
    english: "be sick / ill"
  },
  {
    casual: "밥 먹어",
    formal: "진지 드세요",
    polite: "밥 먹어요",
    context: "having a meal (honorific uses different noun)",
    english: "have a meal"
  },
  {
    casual: "이름이 뭐야?",
    formal: "성함이 어떻게 되세요?",
    polite: "이름이 뭐예요?",
    context: "asking someone's name",
    english: "What is your name?"
  },
  {
    casual: "몇 살이야?",
    formal: "연세가 어떻게 되세요?",
    polite: "몇 살이에요?",
    context: "asking someone's age (honorific uses different noun)",
    english: "How old are you?"
  }
];

// ============================================================
// 3. Korean Particles (조사) - 20 entries
// ============================================================
var koreanParticles = [
  {
    particle: "은/는",
    name: "Topic marker",
    usage: "Marks the topic of a sentence; used to introduce or contrast a subject",
    examples: [
      { korean: "나는 학생이에요", english: "I am a student" },
      { korean: "오늘은 날씨가 좋아요", english: "Today the weather is good" },
      { korean: "고양이는 귀여워요", english: "Cats are cute" }
    ]
  },
  {
    particle: "이/가",
    name: "Subject marker",
    usage: "Marks the grammatical subject of a sentence; emphasizes new information",
    examples: [
      { korean: "비가 와요", english: "It is raining (rain is coming)" },
      { korean: "누가 왔어요?", english: "Who came?" },
      { korean: "꽃이 예뻐요", english: "The flower is pretty" }
    ]
  },
  {
    particle: "을/를",
    name: "Object marker",
    usage: "Marks the direct object of a verb",
    examples: [
      { korean: "밥을 먹어요", english: "I eat rice" },
      { korean: "영화를 봐요", english: "I watch a movie" },
      { korean: "한국어를 공부해요", english: "I study Korean" }
    ]
  },
  {
    particle: "에",
    name: "Location/time marker",
    usage: "Indicates a location (destination or static place) or a point in time",
    examples: [
      { korean: "학교에 가요", english: "I go to school" },
      { korean: "세 시에 만나요", english: "Let's meet at three o'clock" },
      { korean: "서울에 살아요", english: "I live in Seoul" }
    ]
  },
  {
    particle: "에서",
    name: "Location marker (action)",
    usage: "Indicates the location where an action takes place",
    examples: [
      { korean: "도서관에서 공부해요", english: "I study at the library" },
      { korean: "식당에서 밥을 먹어요", english: "I eat at a restaurant" },
      { korean: "공원에서 운동해요", english: "I exercise at the park" }
    ]
  },
  {
    particle: "의",
    name: "Possessive marker",
    usage: "Shows possession or relationship between two nouns, similar to 'of' or apostrophe-s",
    examples: [
      { korean: "나의 책", english: "My book" },
      { korean: "한국의 문화", english: "Korean culture (culture of Korea)" },
      { korean: "선생님의 이름", english: "The teacher's name" }
    ]
  },
  {
    particle: "도",
    name: "Also/too marker",
    usage: "Means 'also', 'too', or 'even'; replaces topic or subject markers",
    examples: [
      { korean: "나도 가고 싶어요", english: "I also want to go" },
      { korean: "이것도 주세요", english: "Please give me this too" },
      { korean: "물도 없어요", english: "There is not even water" }
    ]
  },
  {
    particle: "와/과",
    name: "And/with marker (formal)",
    usage: "Connects nouns meaning 'and' or 'with'; more formal style",
    examples: [
      { korean: "사과와 바나나", english: "Apples and bananas" },
      { korean: "친구와 같이 갔어요", english: "I went with a friend" },
      { korean: "선생님과 이야기했어요", english: "I talked with the teacher" }
    ]
  },
  {
    particle: "하고",
    name: "And/with marker (casual)",
    usage: "Connects nouns meaning 'and' or 'with'; casual spoken style",
    examples: [
      { korean: "빵하고 우유", english: "Bread and milk" },
      { korean: "형하고 놀았어요", english: "I played with my older brother" },
      { korean: "커피하고 케이크 주세요", english: "Coffee and cake, please" }
    ]
  },
  {
    particle: "에게/한테",
    name: "To (a person) marker",
    usage: "Indicates the recipient of an action; 한테 is more casual",
    examples: [
      { korean: "친구에게 선물을 줬어요", english: "I gave a gift to my friend" },
      { korean: "동생한테 말했어요", english: "I told my younger sibling" },
      { korean: "선생님에게 질문했어요", english: "I asked the teacher a question" }
    ]
  },
  {
    particle: "에게서/한테서",
    name: "From (a person) marker",
    usage: "Indicates receiving something from a person; 한테서 is more casual",
    examples: [
      { korean: "엄마에게서 전화가 왔어요", english: "I got a call from Mom" },
      { korean: "친구한테서 들었어요", english: "I heard it from a friend" },
      { korean: "선생님에게서 배웠어요", english: "I learned it from the teacher" }
    ]
  },
  {
    particle: "으로/로",
    name: "Direction/means marker",
    usage: "Indicates direction, means, or method of doing something",
    examples: [
      { korean: "버스로 가요", english: "I go by bus" },
      { korean: "오른쪽으로 가세요", english: "Please go to the right" },
      { korean: "한국어로 말해 주세요", english: "Please speak in Korean" }
    ]
  },
  {
    particle: "부터",
    name: "From (starting point) marker",
    usage: "Indicates the starting point of time or sequence",
    examples: [
      { korean: "아침부터 비가 왔어요", english: "It has been raining since morning" },
      { korean: "월요일부터 금요일까지", english: "From Monday to Friday" },
      { korean: "처음부터 다시 해요", english: "Let's start again from the beginning" }
    ]
  },
  {
    particle: "까지",
    name: "Until/to marker",
    usage: "Indicates the ending point of time, place, or extent; also means 'even'",
    examples: [
      { korean: "서울까지 얼마나 걸려요?", english: "How long does it take to Seoul?" },
      { korean: "다섯 시까지 기다릴게요", english: "I will wait until five o'clock" },
      { korean: "여기까지 오세요", english: "Please come up to here" }
    ]
  },
  {
    particle: "만",
    name: "Only marker",
    usage: "Limits to a specific item meaning 'only' or 'just'",
    examples: [
      { korean: "물만 주세요", english: "Just water, please" },
      { korean: "조금만 기다려 주세요", english: "Please wait just a little" },
      { korean: "나만 몰랐어요", english: "Only I did not know" }
    ]
  },
  {
    particle: "보다",
    name: "Comparison marker",
    usage: "Used for comparing two things, meaning 'more than' or 'compared to'",
    examples: [
      { korean: "여름보다 겨울이 좋아요", english: "I like winter more than summer" },
      { korean: "어제보다 오늘이 더워요", english: "Today is hotter than yesterday" },
      { korean: "커피보다 차를 좋아해요", english: "I prefer tea over coffee" }
    ]
  },
  {
    particle: "처럼/같이",
    name: "Like/as marker",
    usage: "Means 'like' or 'similar to' for comparison or simile",
    examples: [
      { korean: "꽃처럼 예뻐요", english: "Pretty like a flower" },
      { korean: "한국 사람같이 말해요", english: "You speak like a Korean person" },
      { korean: "물처럼 맑아요", english: "Clear like water" }
    ]
  },
  {
    particle: "마다",
    name: "Every/each marker",
    usage: "Means 'every' or 'each' when attached to time or items",
    examples: [
      { korean: "날마다 운동해요", english: "I exercise every day" },
      { korean: "주말마다 영화를 봐요", english: "I watch a movie every weekend" },
      { korean: "사람마다 달라요", english: "Every person is different" }
    ]
  },
  {
    particle: "밖에",
    name: "Nothing but marker",
    usage: "Means 'nothing but' or 'only'; always used with a negative verb",
    examples: [
      { korean: "시간이 없밖에 없어요", english: "There is nothing but no time" },
      { korean: "천 원밖에 없어요", english: "I only have 1,000 won" },
      { korean: "하나밖에 안 남았어요", english: "Only one is left" }
    ]
  },
  {
    particle: "이나/나",
    name: "Or / as many as marker",
    usage: "Means 'or' for choices, or emphasizes a large quantity",
    examples: [
      { korean: "차나 커피 드릴까요?", english: "Shall I bring you tea or coffee?" },
      { korean: "세 시간이나 기다렸어요", english: "I waited as long as three hours" },
      { korean: "영화나 볼까요?", english: "Shall we watch a movie or something?" }
    ]
  }
];

// ============================================================
// 4. Hanja Basics (한자) - 30 entries
// ============================================================
var hanjaBasics = [
  {
    hanja: "人",
    korean: "인",
    meaning: "person",
    words: [
      { word: "한국인", meaning: "Korean person" },
      { word: "인간", meaning: "human being" }
    ]
  },
  {
    hanja: "大",
    korean: "대",
    meaning: "big / great",
    words: [
      { word: "대학", meaning: "university (big learning)" },
      { word: "대통령", meaning: "president" }
    ]
  },
  {
    hanja: "山",
    korean: "산",
    meaning: "mountain",
    words: [
      { word: "등산", meaning: "mountain climbing" },
      { word: "산맥", meaning: "mountain range" }
    ]
  },
  {
    hanja: "水",
    korean: "수",
    meaning: "water",
    words: [
      { word: "수영", meaning: "swimming" },
      { word: "홍수", meaning: "flood" }
    ]
  },
  {
    hanja: "火",
    korean: "화",
    meaning: "fire",
    words: [
      { word: "화요일", meaning: "Tuesday (fire day)" },
      { word: "화재", meaning: "fire disaster" }
    ]
  },
  {
    hanja: "木",
    korean: "목",
    meaning: "tree / wood",
    words: [
      { word: "목요일", meaning: "Thursday (wood day)" },
      { word: "목재", meaning: "lumber / timber" }
    ]
  },
  {
    hanja: "金",
    korean: "금",
    meaning: "gold / metal",
    words: [
      { word: "금요일", meaning: "Friday (gold day)" },
      { word: "금메달", meaning: "gold medal" }
    ]
  },
  {
    hanja: "土",
    korean: "토",
    meaning: "earth / soil",
    words: [
      { word: "토요일", meaning: "Saturday (earth day)" },
      { word: "영토", meaning: "territory" }
    ]
  },
  {
    hanja: "日",
    korean: "일",
    meaning: "day / sun",
    words: [
      { word: "일요일", meaning: "Sunday (sun day)" },
      { word: "생일", meaning: "birthday" }
    ]
  },
  {
    hanja: "月",
    korean: "월",
    meaning: "moon / month",
    words: [
      { word: "월요일", meaning: "Monday (moon day)" },
      { word: "정월", meaning: "January (first month)" }
    ]
  },
  {
    hanja: "學",
    korean: "학",
    meaning: "study / learning",
    words: [
      { word: "학교", meaning: "school" },
      { word: "학생", meaning: "student" }
    ]
  },
  {
    hanja: "生",
    korean: "생",
    meaning: "life / birth",
    words: [
      { word: "학생", meaning: "student" },
      { word: "생활", meaning: "daily life" }
    ]
  },
  {
    hanja: "先",
    korean: "선",
    meaning: "first / before",
    words: [
      { word: "선생님", meaning: "teacher" },
      { word: "선배", meaning: "senior (older colleague)" }
    ]
  },
  {
    hanja: "國",
    korean: "국",
    meaning: "country / nation",
    words: [
      { word: "한국", meaning: "Korea" },
      { word: "외국", meaning: "foreign country" }
    ]
  },
  {
    hanja: "中",
    korean: "중",
    meaning: "middle / center",
    words: [
      { word: "중학교", meaning: "middle school" },
      { word: "중심", meaning: "center / core" }
    ]
  },
  {
    hanja: "食",
    korean: "식",
    meaning: "food / eat",
    words: [
      { word: "식당", meaning: "restaurant" },
      { word: "한식", meaning: "Korean food" }
    ]
  },
  {
    hanja: "心",
    korean: "심",
    meaning: "heart / mind",
    words: [
      { word: "안심", meaning: "peace of mind" },
      { word: "관심", meaning: "interest / concern" }
    ]
  },
  {
    hanja: "力",
    korean: "력/역",
    meaning: "power / strength",
    words: [
      { word: "노력", meaning: "effort" },
      { word: "능력", meaning: "ability / capability" }
    ]
  },
  {
    hanja: "天",
    korean: "천",
    meaning: "sky / heaven",
    words: [
      { word: "천국", meaning: "heaven / paradise" },
      { word: "천재", meaning: "genius (heaven's talent)" }
    ]
  },
  {
    hanja: "地",
    korean: "지",
    meaning: "earth / ground",
    words: [
      { word: "지하철", meaning: "subway (underground iron)" },
      { word: "토지", meaning: "land / terrain" }
    ]
  },
  {
    hanja: "語",
    korean: "어",
    meaning: "language / word",
    words: [
      { word: "한국어", meaning: "Korean language" },
      { word: "영어", meaning: "English language" }
    ]
  },
  {
    hanja: "文",
    korean: "문",
    meaning: "writing / literature",
    words: [
      { word: "문화", meaning: "culture" },
      { word: "문학", meaning: "literature" }
    ]
  },
  {
    hanja: "家",
    korean: "가",
    meaning: "house / family / specialist",
    words: [
      { word: "가족", meaning: "family" },
      { word: "작가", meaning: "writer / author" }
    ]
  },
  {
    hanja: "年",
    korean: "년",
    meaning: "year",
    words: [
      { word: "작년", meaning: "last year" },
      { word: "내년", meaning: "next year" }
    ]
  },
  {
    hanja: "時",
    korean: "시",
    meaning: "time / hour",
    words: [
      { word: "시간", meaning: "time / hour" },
      { word: "시작", meaning: "start / beginning" }
    ]
  },
  {
    hanja: "東",
    korean: "동",
    meaning: "east",
    words: [
      { word: "동쪽", meaning: "east side" },
      { word: "동양", meaning: "the East / Orient" }
    ]
  },
  {
    hanja: "西",
    korean: "서",
    meaning: "west",
    words: [
      { word: "서쪽", meaning: "west side" },
      { word: "서양", meaning: "the West / Occident" }
    ]
  },
  {
    hanja: "南",
    korean: "남",
    meaning: "south",
    words: [
      { word: "남쪽", meaning: "south side" },
      { word: "남자", meaning: "man (south + child)" }
    ]
  },
  {
    hanja: "北",
    korean: "북",
    meaning: "north",
    words: [
      { word: "북쪽", meaning: "north side" },
      { word: "북한", meaning: "North Korea" }
    ]
  },
  {
    hanja: "白",
    korean: "백",
    meaning: "white / hundred",
    words: [
      { word: "백색", meaning: "white color" },
      { word: "백화점", meaning: "department store (hundred goods store)" }
    ]
  }
];

// ============================================================
// 5. Minimal Pairs (최소대립쌍) - 20 pairs
// ============================================================
var minimalPairs = [
  {
    word1: { korean: "불", english: "fire" },
    word2: { korean: "뿔", english: "horn" },
    difference: "ㅂ vs ㅃ (plain vs tense bilabial)"
  },
  {
    word1: { korean: "달", english: "moon" },
    word2: { korean: "딸", english: "daughter" },
    difference: "ㄷ vs ㄸ (plain vs tense alveolar)"
  },
  {
    word1: { korean: "가다", english: "to go" },
    word2: { korean: "까다", english: "to peel" },
    difference: "ㄱ vs ㄲ (plain vs tense velar)"
  },
  {
    word1: { korean: "살", english: "flesh / age" },
    word2: { korean: "쌀", english: "rice (uncooked)" },
    difference: "ㅅ vs ㅆ (plain vs tense fricative)"
  },
  {
    word1: { korean: "자다", english: "to sleep" },
    word2: { korean: "짜다", english: "to be salty / to squeeze" },
    difference: "ㅈ vs ㅉ (plain vs tense affricate)"
  },
  {
    word1: { korean: "발", english: "foot" },
    word2: { korean: "팔", english: "arm / eight" },
    difference: "ㅂ vs ㅍ (plain vs aspirated bilabial)"
  },
  {
    word1: { korean: "달", english: "moon" },
    word2: { korean: "탈", english: "mask" },
    difference: "ㄷ vs ㅌ (plain vs aspirated alveolar)"
  },
  {
    word1: { korean: "기", english: "energy / spirit" },
    word2: { korean: "키", english: "height / key" },
    difference: "ㄱ vs ㅋ (plain vs aspirated velar)"
  },
  {
    word1: { korean: "잠", english: "sleep" },
    word2: { korean: "참", english: "patience / truth" },
    difference: "ㅈ vs ㅊ (plain vs aspirated affricate)"
  },
  {
    word1: { korean: "배", english: "stomach / pear / ship" },
    word2: { korean: "빼", english: "to subtract" },
    difference: "ㅂ vs ㅃ (plain vs tense) in syllable initial"
  },
  {
    word1: { korean: "구", english: "nine" },
    word2: { korean: "그", english: "he / that" },
    difference: "ㅜ vs ㅡ (rounded vs unrounded back vowel)"
  },
  {
    word1: { korean: "가", english: "go" },
    word2: { korean: "거", english: "thing (colloquial)" },
    difference: "ㅏ vs ㅓ (open front vs open-mid back vowel)"
  },
  {
    word1: { korean: "개", english: "dog" },
    word2: { korean: "게", english: "crab" },
    difference: "ㅐ vs ㅔ (ae vs e vowel, merging in modern Korean)"
  },
  {
    word1: { korean: "눈", english: "eye / snow" },
    word2: { korean: "논", english: "rice paddy" },
    difference: "ㅜ vs ㅗ (high back vs mid back rounded vowel)"
  },
  {
    word1: { korean: "밤", english: "night / chestnut" },
    word2: { korean: "밥", english: "rice (cooked)" },
    difference: "ㅁ vs ㅂ final (nasal vs stop coda)"
  },
  {
    word1: { korean: "산", english: "mountain" },
    word2: { korean: "상", english: "table / prize" },
    difference: "ㄴ vs ㅇ final (alveolar nasal vs velar nasal coda)"
  },
  {
    word1: { korean: "말", english: "horse / language" },
    word2: { korean: "만", english: "ten thousand / only" },
    difference: "ㄹ vs ㄴ final (liquid vs nasal coda)"
  },
  {
    word1: { korean: "날", english: "day / blade" },
    word2: { korean: "낳", english: "give birth" },
    difference: "ㄹ vs silent ㅎ final (different coda consonants)"
  },
  {
    word1: { korean: "오", english: "five / come" },
    word2: { korean: "우", english: "ox radical / rain (as prefix)" },
    difference: "ㅗ vs ㅜ (mid vs high rounded back vowel)"
  },
  {
    word1: { korean: "나", english: "I / me" },
    word2: { korean: "너", english: "you" },
    difference: "ㅏ vs ㅓ vowel with different initial meaning"
  }
];

// ============================================================
// 6. Korean Onomatopoeia (의성어/의태어) - 30 entries
// ============================================================
var koreanSoundWords = [
  {
    korean: "멍멍",
    english: "woof woof",
    type: "의성어",
    category: "animal",
    context: "Sound a dog makes"
  },
  {
    korean: "야옹",
    english: "meow",
    type: "의성어",
    category: "animal",
    context: "Sound a cat makes"
  },
  {
    korean: "꼬끼오",
    english: "cock-a-doodle-doo",
    type: "의성어",
    category: "animal",
    context: "Sound a rooster makes"
  },
  {
    korean: "음메",
    english: "moo",
    type: "의성어",
    category: "animal",
    context: "Sound a cow makes"
  },
  {
    korean: "꿀꿀",
    english: "oink oink",
    type: "의성어",
    category: "animal",
    context: "Sound a pig makes"
  },
  {
    korean: "짹짹",
    english: "tweet tweet",
    type: "의성어",
    category: "animal",
    context: "Sound a small bird makes"
  },
  {
    korean: "개굴개굴",
    english: "ribbit ribbit",
    type: "의성어",
    category: "animal",
    context: "Sound a frog makes"
  },
  {
    korean: "두근두근",
    english: "thump thump",
    type: "의성어",
    category: "body",
    context: "Sound of a heartbeat, often used when excited or nervous"
  },
  {
    korean: "쿨쿨",
    english: "zzz (snoring)",
    type: "의성어",
    category: "body",
    context: "Sound of someone sleeping deeply and snoring"
  },
  {
    korean: "콜록콜록",
    english: "cough cough",
    type: "의성어",
    category: "body",
    context: "Sound of coughing"
  },
  {
    korean: "보글보글",
    english: "bubble bubble",
    type: "의성어",
    category: "cooking",
    context: "Sound of liquid boiling or simmering"
  },
  {
    korean: "지글지글",
    english: "sizzle sizzle",
    type: "의성어",
    category: "cooking",
    context: "Sound of something frying in oil"
  },
  {
    korean: "뚝뚝",
    english: "drip drip",
    type: "의성어",
    category: "nature",
    context: "Sound of water dripping"
  },
  {
    korean: "쏴아",
    english: "whoosh / rush",
    type: "의성어",
    category: "nature",
    context: "Sound of water flowing strongly or rain pouring"
  },
  {
    korean: "우르르 쾅쾅",
    english: "rumble crash",
    type: "의성어",
    category: "nature",
    context: "Sound of thunder"
  },
  {
    korean: "반짝반짝",
    english: "twinkle twinkle / sparkle",
    type: "의태어",
    category: "visual",
    context: "Mimics the appearance of something sparkling or twinkling"
  },
  {
    korean: "빙글빙글",
    english: "round and round",
    type: "의태어",
    category: "movement",
    context: "Mimics spinning or rotating movement"
  },
  {
    korean: "살금살금",
    english: "sneakily / stealthily",
    type: "의태어",
    category: "movement",
    context: "Mimics quiet, sneaky movement like tiptoeing"
  },
  {
    korean: "깡충깡충",
    english: "hop hop / bounce bounce",
    type: "의태어",
    category: "movement",
    context: "Mimics hopping or bouncing movement like a rabbit"
  },
  {
    korean: "엉금엉금",
    english: "crawling slowly",
    type: "의태어",
    category: "movement",
    context: "Mimics slow crawling movement like a turtle"
  },
  {
    korean: "흔들흔들",
    english: "wobble wobble / swaying",
    type: "의태어",
    category: "movement",
    context: "Mimics swaying or shaking movement"
  },
  {
    korean: "말랑말랑",
    english: "soft and squishy",
    type: "의태어",
    category: "texture",
    context: "Describes something soft and pliable to the touch"
  },
  {
    korean: "끈적끈적",
    english: "sticky / gooey",
    type: "의태어",
    category: "texture",
    context: "Describes something sticky or adhesive"
  },
  {
    korean: "미끌미끌",
    english: "slippery / slimy",
    type: "의태어",
    category: "texture",
    context: "Describes a slippery or slimy surface"
  },
  {
    korean: "울퉁불퉁",
    english: "bumpy / uneven",
    type: "의태어",
    category: "texture",
    context: "Describes a rough, bumpy, or uneven surface"
  },
  {
    korean: "쫄깃쫄깃",
    english: "chewy / springy",
    type: "의태어",
    category: "food texture",
    context: "Describes a chewy, springy food texture like rice cakes"
  },
  {
    korean: "바삭바삭",
    english: "crispy / crunchy",
    type: "의태어",
    category: "food texture",
    context: "Describes a crispy or crunchy food texture"
  },
  {
    korean: "뚱뚱",
    english: "chubby / plump",
    type: "의태어",
    category: "appearance",
    context: "Describes someone or something that looks round and plump"
  },
  {
    korean: "날씬날씬",
    english: "slim / slender",
    type: "의태어",
    category: "appearance",
    context: "Describes a slim, slender figure"
  },
  {
    korean: "알록달록",
    english: "colorful / multicolored",
    type: "의태어",
    category: "visual",
    context: "Describes something with many bright, varied colors"
  }
];

// ============================================================
// 7. Korean Sentence Patterns - 25 entries
// ============================================================
var sentencePatterns = [
  {
    pattern: "~고 싶다",
    meaning: "want to ~",
    level: "beginner",
    examples: [
      { korean: "먹고 싶어요", english: "I want to eat" },
      { korean: "가고 싶어요", english: "I want to go" },
      { korean: "배우고 싶어요", english: "I want to learn" }
    ]
  },
  {
    pattern: "~아/어서",
    meaning: "because ~ / and then ~",
    level: "beginner",
    examples: [
      { korean: "배가 고파서 밥을 먹었어요", english: "I ate because I was hungry" },
      { korean: "만나서 반갑습니다", english: "Nice to meet you (meeting you, I am glad)" },
      { korean: "피곤해서 일찍 잤어요", english: "I slept early because I was tired" }
    ]
  },
  {
    pattern: "~(으)ㄹ 수 있다/없다",
    meaning: "can / cannot ~",
    level: "beginner",
    examples: [
      { korean: "한국어를 할 수 있어요", english: "I can speak Korean" },
      { korean: "수영할 수 없어요", english: "I cannot swim" },
      { korean: "내일 만날 수 있어요?", english: "Can we meet tomorrow?" }
    ]
  },
  {
    pattern: "~(으)ㄹ 거예요",
    meaning: "will ~ / going to ~",
    level: "beginner",
    examples: [
      { korean: "내일 갈 거예요", english: "I am going to go tomorrow" },
      { korean: "저녁에 요리할 거예요", english: "I will cook in the evening" },
      { korean: "주말에 쉴 거예요", english: "I am going to rest on the weekend" }
    ]
  },
  {
    pattern: "~고 있다",
    meaning: "is ~ing (progressive)",
    level: "beginner",
    examples: [
      { korean: "공부하고 있어요", english: "I am studying" },
      { korean: "비가 오고 있어요", english: "It is raining" },
      { korean: "기다리고 있어요", english: "I am waiting" }
    ]
  },
  {
    pattern: "~(으)면",
    meaning: "if ~",
    level: "beginner",
    examples: [
      { korean: "시간이 있으면 만나요", english: "If you have time, let's meet" },
      { korean: "비가 오면 집에 있을 거예요", english: "If it rains, I will stay home" },
      { korean: "맛있으면 더 주세요", english: "If it is tasty, please give me more" }
    ]
  },
  {
    pattern: "~(으)ㄴ 적이 있다/없다",
    meaning: "have/have not experienced ~",
    level: "intermediate",
    examples: [
      { korean: "한국에 간 적이 있어요", english: "I have been to Korea" },
      { korean: "김치를 만든 적이 없어요", english: "I have never made kimchi" },
      { korean: "스카이다이빙을 한 적이 있어요?", english: "Have you ever gone skydiving?" }
    ]
  },
  {
    pattern: "~기 때문에",
    meaning: "because ~",
    level: "intermediate",
    examples: [
      { korean: "바쁘기 때문에 못 가요", english: "I cannot go because I am busy" },
      { korean: "추웠기 때문에 감기에 걸렸어요", english: "I caught a cold because it was cold" }
    ]
  },
  {
    pattern: "~(으)ㄹ 때",
    meaning: "when ~",
    level: "intermediate",
    examples: [
      { korean: "슬플 때 음악을 들어요", english: "I listen to music when I am sad" },
      { korean: "어릴 때 서울에 살았어요", english: "I lived in Seoul when I was young" },
      { korean: "시간이 있을 때 연락하세요", english: "Contact me when you have time" }
    ]
  },
  {
    pattern: "~아/어 보다",
    meaning: "try ~ing",
    level: "intermediate",
    examples: [
      { korean: "한번 먹어 보세요", english: "Please try eating it once" },
      { korean: "한국어로 말해 보세요", english: "Try speaking in Korean" },
      { korean: "이 옷을 입어 봐도 돼요?", english: "May I try on these clothes?" }
    ]
  },
  {
    pattern: "~(으)ㄹ까요?",
    meaning: "shall we ~? / do you think ~?",
    level: "beginner",
    examples: [
      { korean: "같이 갈까요?", english: "Shall we go together?" },
      { korean: "뭐 먹을까요?", english: "What shall we eat?" },
      { korean: "창문을 열까요?", english: "Shall I open the window?" }
    ]
  },
  {
    pattern: "~지 마세요",
    meaning: "do not ~ (negative command)",
    level: "beginner",
    examples: [
      { korean: "걱정하지 마세요", english: "Do not worry" },
      { korean: "여기에서 사진을 찍지 마세요", english: "Do not take pictures here" },
      { korean: "늦지 마세요", english: "Do not be late" }
    ]
  },
  {
    pattern: "~(으)ㄴ/는 것 같다",
    meaning: "it seems like ~ / I think ~",
    level: "intermediate",
    examples: [
      { korean: "비가 올 것 같아요", english: "It seems like it will rain" },
      { korean: "맛있는 것 같아요", english: "I think it is delicious" },
      { korean: "그 사람이 한국인인 것 같아요", english: "I think that person is Korean" }
    ]
  },
  {
    pattern: "~(으)면 좋겠다",
    meaning: "I wish ~ / it would be nice if ~",
    level: "intermediate",
    examples: [
      { korean: "비가 안 오면 좋겠어요", english: "I wish it would not rain" },
      { korean: "한국어를 잘하면 좋겠어요", english: "I wish I were good at Korean" },
      { korean: "빨리 끝나면 좋겠어요", english: "I hope it finishes quickly" }
    ]
  },
  {
    pattern: "~아/어야 하다",
    meaning: "must ~ / have to ~",
    level: "intermediate",
    examples: [
      { korean: "공부해야 해요", english: "I have to study" },
      { korean: "일찍 일어나야 해요", english: "I have to wake up early" },
      { korean: "약을 먹어야 해요", english: "I have to take medicine" }
    ]
  },
  {
    pattern: "~(으)ㄹ 줄 알다/모르다",
    meaning: "know/do not know how to ~",
    level: "intermediate",
    examples: [
      { korean: "운전할 줄 알아요", english: "I know how to drive" },
      { korean: "요리할 줄 몰라요", english: "I do not know how to cook" },
      { korean: "피아노 칠 줄 알아요?", english: "Do you know how to play the piano?" }
    ]
  },
  {
    pattern: "~(으)ㄴ/는데",
    meaning: "but ~ / and ~ (background/contrast)",
    level: "intermediate",
    examples: [
      { korean: "맛있는데 비싸요", english: "It is delicious, but it is expensive" },
      { korean: "지금 가는데 같이 갈래요?", english: "I am going now; do you want to come along?" },
      { korean: "한국에 갔는데 좋았어요", english: "I went to Korea and it was great" }
    ]
  },
  {
    pattern: "~(으)려고 하다",
    meaning: "intend to ~ / plan to ~",
    level: "intermediate",
    examples: [
      { korean: "여행하려고 해요", english: "I intend to travel" },
      { korean: "한국어를 배우려고 해요", english: "I plan to learn Korean" },
      { korean: "이사하려고 해요", english: "I am planning to move" }
    ]
  },
  {
    pattern: "~(으)ㄴ/는 편이다",
    meaning: "tend to ~ / rather ~",
    level: "advanced",
    examples: [
      { korean: "저는 조용한 편이에요", english: "I tend to be quiet" },
      { korean: "매운 음식을 잘 먹는 편이에요", english: "I am fairly good at eating spicy food" }
    ]
  },
  {
    pattern: "~더라고요",
    meaning: "I noticed that ~ / I found that ~ (firsthand experience)",
    level: "advanced",
    examples: [
      { korean: "한국 음식이 맛있더라고요", english: "I found that Korean food is delicious" },
      { korean: "서울이 생각보다 크더라고요", english: "I noticed that Seoul is bigger than I thought" }
    ]
  },
  {
    pattern: "~(으)ㄹ수록",
    meaning: "the more ~ the more ~",
    level: "advanced",
    examples: [
      { korean: "많이 먹을수록 배가 불러요", english: "The more you eat, the fuller you get" },
      { korean: "연습할수록 잘해요", english: "The more you practice, the better you get" }
    ]
  },
  {
    pattern: "~(으)ㄴ/는 덕분에",
    meaning: "thanks to ~",
    level: "advanced",
    examples: [
      { korean: "선생님 덕분에 한국어를 잘해요", english: "Thanks to the teacher, I am good at Korean" },
      { korean: "운동한 덕분에 건강해졌어요", english: "Thanks to exercising, I became healthy" }
    ]
  },
  {
    pattern: "~(으)ㄹ 뻔하다",
    meaning: "almost ~ / nearly ~",
    level: "advanced",
    examples: [
      { korean: "넘어질 뻔했어요", english: "I almost fell down" },
      { korean: "지각할 뻔했어요", english: "I almost was late" }
    ]
  },
  {
    pattern: "~는 바람에",
    meaning: "because of ~ (unexpected cause)",
    level: "advanced",
    examples: [
      { korean: "비가 오는 바람에 못 갔어요", english: "I could not go because it rained (unexpectedly)" },
      { korean: "늦게 일어나는 바람에 지각했어요", english: "I was late because I overslept (unexpectedly)" }
    ]
  },
  {
    pattern: "~(이)야말로",
    meaning: "~ is truly / ~ is the very one",
    level: "advanced",
    examples: [
      { korean: "이것이야말로 진짜예요", english: "This is truly the real one" },
      { korean: "당신이야말로 최고예요", english: "You are truly the best" }
    ]
  }
];

// ============================================================
// 8. Korean Cultural Calendar - 15 entries
// ============================================================
var koreanCalendar = [
  {
    name: "설날",
    english: "Lunar New Year",
    date: "1st day of 1st lunar month (January or February)",
    description: "The most important Korean holiday. Families gather to perform ancestral rites (charye), eat traditional foods, and play folk games. Children bow to elders (sebae) and receive money (sebaetdon).",
    vocabulary: [
      { korean: "세배", english: "New Year's bow" },
      { korean: "떡국", english: "rice cake soup" },
      { korean: "세뱃돈", english: "New Year's money gift" },
      { korean: "한복", english: "traditional Korean clothing" }
    ]
  },
  {
    name: "정월대보름",
    english: "First Full Moon Festival",
    date: "15th day of 1st lunar month",
    description: "Celebrates the first full moon of the new year. People eat ogobbap (five-grain rice) and crack nuts with their teeth to ward off skin diseases. Bonfires are lit and wishes are made.",
    vocabulary: [
      { korean: "오곡밥", english: "five-grain rice" },
      { korean: "부럼", english: "nut cracking ritual" },
      { korean: "달맞이", english: "moon viewing" },
      { korean: "쥐불놀이", english: "field burning game" }
    ]
  },
  {
    name: "삼일절",
    english: "March 1st Movement Day",
    date: "March 1",
    description: "National holiday commemorating the March 1st Independence Movement of 1919 against Japanese colonial rule. Ceremonies are held nationwide with readings of the Declaration of Independence.",
    vocabulary: [
      { korean: "독립", english: "independence" },
      { korean: "만세", english: "hurray / long live" },
      { korean: "독립선언서", english: "Declaration of Independence" }
    ]
  },
  {
    name: "어린이날",
    english: "Children's Day",
    date: "May 5",
    description: "A national holiday dedicated to children. Parents spend time with their kids, visit amusement parks, and give gifts. Schools and workplaces are closed.",
    vocabulary: [
      { korean: "어린이", english: "children" },
      { korean: "선물", english: "gift / present" },
      { korean: "놀이공원", english: "amusement park" }
    ]
  },
  {
    name: "어버이날",
    english: "Parents' Day",
    date: "May 8",
    description: "A day to honor and show gratitude to parents. Children give carnations and gifts to their parents. It is not a national holiday but is widely celebrated.",
    vocabulary: [
      { korean: "카네이션", english: "carnation" },
      { korean: "효도", english: "filial piety" },
      { korean: "감사", english: "gratitude" },
      { korean: "부모님", english: "parents" }
    ]
  },
  {
    name: "스승의 날",
    english: "Teacher's Day",
    date: "May 15",
    description: "A day to express gratitude to teachers and mentors. Students give carnations and thank-you letters. Schools often hold special ceremonies.",
    vocabulary: [
      { korean: "스승", english: "teacher / mentor" },
      { korean: "제자", english: "student / disciple" },
      { korean: "감사합니다", english: "thank you" }
    ]
  },
  {
    name: "현충일",
    english: "Memorial Day",
    date: "June 6",
    description: "A national holiday honoring soldiers and civilians who died in service to the nation. A national moment of silence is observed at 10:00 AM and flags are flown at half-mast.",
    vocabulary: [
      { korean: "묵념", english: "moment of silence" },
      { korean: "호국영령", english: "patriotic spirits" },
      { korean: "국립묘지", english: "national cemetery" }
    ]
  },
  {
    name: "광복절",
    english: "Liberation Day",
    date: "August 15",
    description: "Celebrates Korea's liberation from Japanese colonial rule in 1945 and the establishment of the Republic of Korea in 1948. National flags are displayed and ceremonies are held.",
    vocabulary: [
      { korean: "광복", english: "restoration of light (liberation)" },
      { korean: "독립", english: "independence" },
      { korean: "태극기", english: "Korean national flag" },
      { korean: "해방", english: "liberation" }
    ]
  },
  {
    name: "추석",
    english: "Korean Thanksgiving (Chuseok)",
    date: "15th day of 8th lunar month (September or October)",
    description: "One of the most important Korean holidays, also known as Hangawi. Families gather to give thanks, perform ancestral rites, eat songpyeon (rice cakes), and enjoy folk games and dances.",
    vocabulary: [
      { korean: "송편", english: "half-moon shaped rice cake" },
      { korean: "차례", english: "ancestral memorial rites" },
      { korean: "성묘", english: "visiting ancestral graves" },
      { korean: "강강술래", english: "traditional circle dance" }
    ]
  },
  {
    name: "한글날",
    english: "Hangul Day (Korean Alphabet Day)",
    date: "October 9",
    description: "Celebrates the creation and proclamation of Hangul, the Korean alphabet, by King Sejong the Great in 1446. Various cultural events and ceremonies take place.",
    vocabulary: [
      { korean: "한글", english: "Korean alphabet" },
      { korean: "세종대왕", english: "King Sejong the Great" },
      { korean: "훈민정음", english: "Hunminjeongeum (original name of Hangul)" },
      { korean: "자음", english: "consonant" },
      { korean: "모음", english: "vowel" }
    ]
  },
  {
    name: "개천절",
    english: "National Foundation Day",
    date: "October 3",
    description: "Commemorates the legendary founding of Gojoseon, the first Korean kingdom, by Dangun in 2333 BC. Ceremonies are held at Chamseongdan altar on Ganghwa Island.",
    vocabulary: [
      { korean: "단군", english: "Dangun (legendary founder)" },
      { korean: "고조선", english: "Gojoseon (ancient Korea)" },
      { korean: "건국", english: "founding of a nation" }
    ]
  },
  {
    name: "동지",
    english: "Winter Solstice",
    date: "Around December 22",
    description: "The shortest day of the year. Koreans traditionally eat patjuk (red bean porridge) to ward off evil spirits. It is considered a 'small New Year' in traditional culture.",
    vocabulary: [
      { korean: "팥죽", english: "red bean porridge" },
      { korean: "새알", english: "rice ball dumplings in porridge" },
      { korean: "액막이", english: "warding off evil spirits" }
    ]
  },
  {
    name: "복날",
    english: "Boknal (Dog Days of Summer)",
    date: "Three hottest days based on lunar calendar (July-August)",
    description: "Three designated hot days: Chobok (beginning), Jungbok (middle), and Malbok (end). Koreans eat hot, nourishing foods like samgyetang to replenish energy during the hottest period.",
    vocabulary: [
      { korean: "삼계탕", english: "ginseng chicken soup" },
      { korean: "초복", english: "first hot day" },
      { korean: "중복", english: "middle hot day" },
      { korean: "말복", english: "last hot day" },
      { korean: "보양식", english: "nourishing food" }
    ]
  },
  {
    name: "빼빼로 데이",
    english: "Pepero Day",
    date: "November 11",
    description: "A popular commercial holiday where people exchange Pepero (chocolate-covered cookie sticks). The date 11/11 resembles Pepero sticks. Especially popular among students and young people.",
    vocabulary: [
      { korean: "빼빼로", english: "Pepero (chocolate stick snack)" },
      { korean: "초콜릿", english: "chocolate" },
      { korean: "선물", english: "gift" }
    ]
  },
  {
    name: "대학수학능력시험",
    english: "College Scholastic Ability Test (Suneung)",
    date: "Third Thursday of November",
    description: "The most important university entrance exam in Korea. The entire nation supports students: flights are grounded during listening tests, police escort late students, and younger students cheer outside test centers.",
    vocabulary: [
      { korean: "수능", english: "Suneung (college entrance exam)" },
      { korean: "수험생", english: "test taker / examinee" },
      { korean: "응원", english: "cheering / support" },
      { korean: "합격", english: "passing (an exam)" },
      { korean: "엿", english: "sticky rice taffy (good luck charm for exams)" }
    ]
  }
];

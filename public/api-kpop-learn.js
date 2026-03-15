/**
 * K-POP Korean Learning Module
 * Built-in K-POP dataset for offline learning: idol profiles,
 * lyrics fill-in-the-blank, idol quiz, K-POP terms dictionary,
 * drama line practice, and fandom roleplay.
 * @requires security-utils.js (escapeHtml)
 * @requires main-app.js (shuffle, addXP, addCombo, resetCombo,
 *   SoundEngine, createConfetti, showToast, saveProgress, gameState,
 *   speakKorean, showPopup, screenShake)
 */

// ============================================================
// 1. K-POP IDOL DATABASE - 32 entries
// ============================================================
var kpopIdols = [
  {name:"김남준",nameEn:"Kim Namjoon",stageName:"RM",group:"BTS",groupKr:"방탄소년단",position:"리더, 메인 래퍼",positionEn:"Leader, Main Rapper",birthday:"1994-09-12"},
  {name:"김석진",nameEn:"Kim Seokjin",stageName:"Jin",group:"BTS",groupKr:"방탄소년단",position:"서브 보컬, 비주얼",positionEn:"Sub Vocal, Visual",birthday:"1992-12-04"},
  {name:"민윤기",nameEn:"Min Yoongi",stageName:"SUGA",group:"BTS",groupKr:"방탄소년단",position:"리드 래퍼",positionEn:"Lead Rapper",birthday:"1993-03-09"},
  {name:"정호석",nameEn:"Jung Hoseok",stageName:"j-hope",group:"BTS",groupKr:"방탄소년단",position:"메인 댄서, 서브 래퍼",positionEn:"Main Dancer, Sub Rapper",birthday:"1994-02-18"},
  {name:"박지민",nameEn:"Park Jimin",stageName:"Jimin",group:"BTS",groupKr:"방탄소년단",position:"메인 댄서, 리드 보컬",positionEn:"Main Dancer, Lead Vocal",birthday:"1995-10-13"},
  {name:"김태형",nameEn:"Kim Taehyung",stageName:"V",group:"BTS",groupKr:"방탄소년단",position:"서브 보컬, 비주얼",positionEn:"Sub Vocal, Visual",birthday:"1995-12-30"},
  {name:"전정국",nameEn:"Jeon Jungkook",stageName:"Jungkook",group:"BTS",groupKr:"방탄소년단",position:"메인 보컬, 리드 댄서",positionEn:"Main Vocal, Lead Dancer",birthday:"1997-09-01"},
  {name:"김제니",nameEn:"Kim Jennie",stageName:"Jennie",group:"BLACKPINK",groupKr:"블랙핑크",position:"메인 래퍼, 리드 보컬",positionEn:"Main Rapper, Lead Vocal",birthday:"1996-01-16"},
  {name:"김지수",nameEn:"Kim Jisoo",stageName:"Jisoo",group:"BLACKPINK",groupKr:"블랙핑크",position:"리드 보컬, 비주얼",positionEn:"Lead Vocal, Visual",birthday:"1995-01-03"},
  {name:"라리사 마노반",nameEn:"Lalisa Manoban",stageName:"Lisa",group:"BLACKPINK",groupKr:"블랙핑크",position:"메인 댄서, 리드 래퍼",positionEn:"Main Dancer, Lead Rapper",birthday:"1997-03-27"},
  {name:"박채영",nameEn:"Park Chaeyoung",stageName:"Rose",group:"BLACKPINK",groupKr:"블랙핑크",position:"메인 보컬, 리드 댄서",positionEn:"Main Vocal, Lead Dancer",birthday:"1997-02-11"},
  {name:"방찬",nameEn:"Bang Chan",stageName:"Bang Chan",group:"Stray Kids",groupKr:"스트레이 키즈",position:"리더, 보컬, 래퍼",positionEn:"Leader, Vocal, Rapper",birthday:"1997-10-03"},
  {name:"황현진",nameEn:"Hwang Hyunjin",stageName:"Hyunjin",group:"Stray Kids",groupKr:"스트레이 키즈",position:"메인 댄서, 서브 래퍼",positionEn:"Main Dancer, Sub Rapper",birthday:"2000-03-20"},
  {name:"임나연",nameEn:"Im Nayeon",stageName:"Nayeon",group:"TWICE",groupKr:"트와이스",position:"리드 보컬, 리드 댄서",positionEn:"Lead Vocal, Lead Dancer",birthday:"1995-09-22"},
  {name:"박지효",nameEn:"Park Jihyo",stageName:"Jihyo",group:"TWICE",groupKr:"트와이스",position:"리더, 메인 보컬",positionEn:"Leader, Main Vocal",birthday:"1997-02-01"},
  {name:"유지민",nameEn:"Yu Jimin",stageName:"Karina",group:"aespa",groupKr:"에스파",position:"리더, 메인 댄서, 리드 래퍼",positionEn:"Leader, Main Dancer, Lead Rapper",birthday:"2000-04-11"},
  {name:"김민정",nameEn:"Kim Minjeong",stageName:"Winter",group:"aespa",groupKr:"에스파",position:"메인 보컬, 리드 댄서",positionEn:"Main Vocal, Lead Dancer",birthday:"2001-01-01"},
  {name:"닝이쯔",nameEn:"Ning Yizhuo",stageName:"Ningning",group:"aespa",groupKr:"에스파",position:"메인 보컬",positionEn:"Main Vocal",birthday:"2002-10-23"},
  {name:"민혜린",nameEn:"Min Hyerin",stageName:"Hyein",group:"NewJeans",groupKr:"뉴진스",position:"서브 보컬, 서브 래퍼",positionEn:"Sub Vocal, Sub Rapper",birthday:"2008-04-21"},
  {name:"김민지",nameEn:"Kim Minji",stageName:"Minji",group:"NewJeans",groupKr:"뉴진스",position:"리더, 리드 댄서",positionEn:"Leader, Lead Dancer",birthday:"2004-05-07"},
  {name:"팜하니",nameEn:"Pham Hanni",stageName:"Hanni",group:"NewJeans",groupKr:"뉴진스",position:"서브 보컬",positionEn:"Sub Vocal",birthday:"2004-10-06"},
  {name:"다니엘",nameEn:"Danielle Marsh",stageName:"Danielle",group:"NewJeans",groupKr:"뉴진스",position:"서브 보컬",positionEn:"Sub Vocal",birthday:"2005-04-11"},
  {name:"장원영",nameEn:"Jang Wonyoung",stageName:"Wonyoung",group:"IVE",groupKr:"아이브",position:"리드 보컬, 비주얼",positionEn:"Lead Vocal, Visual",birthday:"2004-08-31"},
  {name:"안유진",nameEn:"Ahn Yujin",stageName:"Yujin",group:"IVE",groupKr:"아이브",position:"리더, 리드 보컬",positionEn:"Leader, Lead Vocal",birthday:"2003-09-01"},
  {name:"김채원",nameEn:"Kim Chaewon",stageName:"Chaewon",group:"LE SSERAFIM",groupKr:"르세라핌",position:"리더, 리드 보컬",positionEn:"Leader, Lead Vocal",birthday:"2000-08-01"},
  {name:"사쿠라",nameEn:"Miyawaki Sakura",stageName:"Sakura",group:"LE SSERAFIM",groupKr:"르세라핌",position:"리드 댄서, 서브 보컬",positionEn:"Lead Dancer, Sub Vocal",birthday:"1998-03-19"},
  {name:"허윤진",nameEn:"Huh Yunjin",stageName:"Yunjin",group:"LE SSERAFIM",groupKr:"르세라핌",position:"메인 보컬",positionEn:"Main Vocal",birthday:"2001-10-08"},
  {name:"카즈하",nameEn:"Nakamura Kazuha",stageName:"Kazuha",group:"LE SSERAFIM",groupKr:"르세라핌",position:"리드 댄서, 서브 보컬",positionEn:"Lead Dancer, Sub Vocal",birthday:"2003-08-09"},
  {name:"홍은채",nameEn:"Hong Eunchae",stageName:"Eunchae",group:"LE SSERAFIM",groupKr:"르세라핌",position:"서브 보컬, 막내",positionEn:"Sub Vocal, Maknae",birthday:"2006-11-10"},
  {name:"이지은",nameEn:"Lee Ji-eun",stageName:"IU",group:"Solo",groupKr:"솔로",position:"메인 보컬",positionEn:"Main Vocal",birthday:"1993-05-16"},
  {name:"권은비",nameEn:"Kwon Eunbi",stageName:"Eunbi",group:"Solo",groupKr:"솔로 (전 아이즈원)",position:"보컬, 댄서",positionEn:"Vocal, Dancer",birthday:"1995-09-27"},
  {name:"송민호",nameEn:"Song Minho",stageName:"MINO",group:"WINNER",groupKr:"위너",position:"메인 래퍼",positionEn:"Main Rapper",birthday:"1993-03-30"}
];

// ============================================================
// 2. K-POP LYRICS FILL-IN-THE-BLANK - 22 entries
// ============================================================
var kpopLyrics = [
  {song:"Dynamite",artist:"BTS",lyrics:"빛이 나는 _____ 너는 밤을 수놓는 별",answer:"솔로",options:["솔로","사랑","마음","하늘"],fullLyrics:"빛이 나는 솔로 너는 밤을 수놓는 별",romanization:"bichi naneun solo neoneun bameul sunoneun byeol"},
  {song:"Butter",artist:"BTS",lyrics:"차가운 _____ 위에 녹아내리는 너",answer:"심장",options:["심장","바다","세상","꿈"],fullLyrics:"차가운 심장 위에 녹아내리는 너",romanization:"chagaun simjang wie noganaerineun neo"},
  {song:"Spring Day",artist:"BTS",lyrics:"보고 싶다 이렇게 말하니까 더 _____",answer:"보고 싶다",options:["보고 싶다","슬프다","행복하다","아프다"],fullLyrics:"보고 싶다 이렇게 말하니까 더 보고 싶다",romanization:"bogo sipda ireohge malhanikka deo bogo sipda"},
  {song:"Fake Love",artist:"BTS",lyrics:"널 위해서라면 나 _____ 수 있었어",answer:"슬퍼할",options:["슬퍼할","웃을","춤출","노래할"],fullLyrics:"널 위해서라면 나 슬퍼할 수 있었어",romanization:"neol wihaeseoramyeon na seulpeohal su isseosseo"},
  {song:"DDU-DU DDU-DU",artist:"BLACKPINK",lyrics:"이건 _____ 장난 아니야",answer:"예쁜",options:["예쁜","나쁜","큰","작은"],fullLyrics:"이건 예쁜 장난 아니야",romanization:"igeon yeppeun jangnan aniya"},
  {song:"Lovesick Girls",artist:"BLACKPINK",lyrics:"우리는 결국 다시 _____ 걸",answer:"사랑할",options:["사랑할","이별할","만날","헤어질"],fullLyrics:"우리는 결국 다시 사랑할 걸",romanization:"urineun gyeolguk dasi saranghal geol"},
  {song:"How You Like That",artist:"BLACKPINK",lyrics:"_____ 끝까지 가보자",answer:"바닥",options:["바닥","하늘","세상","꿈"],fullLyrics:"바닥 끝까지 가보자",romanization:"badak kkeutkkaji gaboja"},
  {song:"CHEER UP",artist:"TWICE",lyrics:"_____ baby 매일 그대만을 생각해",answer:"좋아",options:["좋아","사랑","미안","고마워"],fullLyrics:"좋아 baby 매일 그대만을 생각해",romanization:"joha baby maeil geudaemaneul saenggakhae"},
  {song:"What is Love?",artist:"TWICE",lyrics:"사랑이 어떤 느낌인지 _____",answer:"알고 싶어",options:["알고 싶어","몰라요","느껴봐","잊고 싶어"],fullLyrics:"사랑이 어떤 느낌인지 알고 싶어",romanization:"sarangi eotteon neukkiminji algo sipeo"},
  {song:"Next Level",artist:"aespa",lyrics:"나의 _____ 위로 레벨 업",answer:"광야",options:["광야","무대","세상","꿈"],fullLyrics:"나의 광야 위로 레벨 업",romanization:"naui gwangya wiro rebel eop"},
  {song:"Supernova",artist:"aespa",lyrics:"_____ 내 안에 우주가 펼쳐져",answer:"수퍼노바",options:["수퍼노바","블랙홀","별빛","은하수"],fullLyrics:"수퍼노바 내 안에 우주가 펼쳐져",romanization:"supernovva nae ane ujuga pyeolchyeojyeo"},
  {song:"Hype Boy",artist:"NewJeans",lyrics:"_____ 때문에 잠이 안 와",answer:"너",options:["너","나","꿈","별"],fullLyrics:"너 때문에 잠이 안 와",romanization:"neo ttaemune jami an wa"},
  {song:"Attention",artist:"NewJeans",lyrics:"You give me _____ 날 바라볼 때",answer:"butterfly",options:["butterfly","sunshine","moonlight","starlight"],fullLyrics:"You give me butterfly 날 바라볼 때",romanization:"nal barabol ttae"},
  {song:"Super Shy",artist:"NewJeans",lyrics:"_____ 눈이 마주치면 고개를 돌려",answer:"수줍어",options:["수줍어","행복해","슬퍼해","설레어"],fullLyrics:"수줍어 눈이 마주chimyeon gogaereul dollyeo",romanization:"sujubeo nuni majuchimyeon gogaereul dollyeo"},
  {song:"ELEVEN",artist:"IVE",lyrics:"_____ 하나만 너 내게로 와",answer:"열하나",options:["열하나","열둘","첫번째","마지막"],fullLyrics:"열하나 하나만 너 내게로 와",romanization:"yeolhana hanaman neo naegero wa"},
  {song:"Love Dive",artist:"IVE",lyrics:"_____ 깊이 빠져들어",answer:"사랑",options:["사랑","바다","꿈","눈"],fullLyrics:"사랑 깊이 빠져들어",romanization:"sarang gipi ppajyeodeureo"},
  {song:"FEARLESS",artist:"LE SSERAFIM",lyrics:"_____ 두려움 없이 날아가",answer:"겁없이",options:["겁없이","조용히","천천히","빠르게"],fullLyrics:"겁없이 두려움 없이 날아가",romanization:"geobeobsi duryeoum eobsi naraga"},
  {song:"ANTIFRAGILE",artist:"LE SSERAFIM",lyrics:"난 더 _____ 돼",answer:"강해져",options:["강해져","예뻐져","커져","밝아져"],fullLyrics:"난 더 강해져 돼",romanization:"nan deo ganghaejyeo dwae"},
  {song:"God's Menu",artist:"Stray Kids",lyrics:"_____ 만들어 줄게 요리",answer:"네가 원하는",options:["네가 원하는","내가 좋아하는","모두가 아는","세상에 없는"],fullLyrics:"네가 원하는 만들어 줄게 요리",romanization:"nega wonhaneun mandeulheo julge yori"},
  {song:"LALALALA",artist:"Stray Kids",lyrics:"_____ 소리를 질러봐",answer:"라라라라",options:["라라라라","하하하하","나나나나","다다다다"],fullLyrics:"라라라라 소리를 질러봐",romanization:"lalalala sorireul jilleobwa"},
  {song:"Blueming",artist:"IU",lyrics:"우리의 _____ 블루밍",answer:"사이는",options:["사이는","마음은","꿈은","별은"],fullLyrics:"우리의 사이는 블루밍",romanization:"uriui saineun beulliming"},
  {song:"Celebrity",artist:"IU",lyrics:"넌 언제든 _____ 같아",answer:"스타",options:["스타","꿈","빛","달"],fullLyrics:"넌 언제든 스타 같아",romanization:"neon eonjedeun seuta gata"}
];

// ============================================================
// 3. K-POP TERMS DICTIONARY - 35 entries
// ============================================================
var kpopTermsDictionary = [
  {term:"컴백",english:"Comeback",desc:"새 앨범/싱글 발매 및 활동 시작",romanization:"keombaek"},
  {term:"음원",english:"Music source",desc:"디지털 음악 파일",romanization:"eumwon"},
  {term:"팬미팅",english:"Fan meeting",desc:"팬들과의 만남 이벤트",romanization:"paenmiting"},
  {term:"응원봉",english:"Light stick",desc:"팬들이 콘서트에서 사용하는 응원 도구",romanization:"eungwonbong"},
  {term:"총공",english:"Mass streaming",desc:"팬들이 조직적으로 음원을 스트리밍하는 행위",romanization:"chonggong"},
  {term:"맞팔",english:"Mutual follow",desc:"서로 소셜미디어 팔로우",romanization:"matpal"},
  {term:"덕질",english:"Fanning",desc:"팬 활동을 열심히 하는 것",romanization:"deokjil"},
  {term:"직캠",english:"Fancam",desc:"팬이 직접 촬영한 영상",romanization:"jikcam"},
  {term:"떡밥",english:"Hint/Teaser",desc:"앞으로 나올 것에 대한 힌트",romanization:"tteokbap"},
  {term:"비주얼",english:"Visual",desc:"그룹에서 가장 잘생긴/예쁜 멤버",romanization:"bijueol"},
  {term:"최애",english:"Ultimate bias",desc:"가장 좋아하는 멤버",romanization:"choeae"},
  {term:"입덕",english:"Joining fandom",desc:"팬이 되는 것",romanization:"ipdeok"},
  {term:"탈덕",english:"Leaving fandom",desc:"팬을 그만두는 것",romanization:"taldeok"},
  {term:"올킬",english:"All-kill",desc:"모든 음원 차트에서 1위를 차지",romanization:"olkil"},
  {term:"본방사수",english:"Watch live",desc:"방송을 실시간으로 시청하는 것",romanization:"bonbangsasu"},
  {term:"팬싸",english:"Fan sign",desc:"팬 사인회",romanization:"paenssa"},
  {term:"멜론",english:"Melon",desc:"한국의 대표적인 음원 스트리밍 서비스",romanization:"mellon"},
  {term:"음방",english:"Music show",desc:"음악 방송 프로그램",romanization:"eumbang"},
  {term:"센터",english:"Center",desc:"그룹 포메이션의 중앙 위치 멤버",romanization:"senteo"},
  {term:"막내",english:"Youngest",desc:"그룹에서 가장 어린 멤버",romanization:"mangnae"},
  {term:"리더",english:"Leader",desc:"그룹의 대표 멤버",romanization:"rideo"},
  {term:"메인 보컬",english:"Main Vocal",desc:"그룹의 주 보컬 담당",romanization:"mein bokeol"},
  {term:"메인 댄서",english:"Main Dancer",desc:"그룹의 주 댄서 담당",romanization:"mein daenseo"},
  {term:"메인 래퍼",english:"Main Rapper",desc:"그룹의 주 래퍼 담당",romanization:"mein raepeo"},
  {term:"안무",english:"Choreography",desc:"춤 동작 구성",romanization:"anmu"},
  {term:"티저",english:"Teaser",desc:"컴백 전 공개되는 예고 영상/이미지",romanization:"tijeo"},
  {term:"뮤비",english:"Music Video",desc:"뮤직비디오의 줄임말",romanization:"myubi"},
  {term:"포토카드",english:"Photo card",desc:"앨범에 포함된 멤버 사진 카드",romanization:"potokadeu"},
  {term:"굿즈",english:"Goods/Merch",desc:"아이돌 관련 상품",romanization:"gutjeu"},
  {term:"세계관",english:"Worldview/Universe",desc:"그룹의 스토리라인과 설정",romanization:"segyegwan"},
  {term:"타이틀곡",english:"Title track",desc:"앨범의 대표곡",romanization:"taiteulgok"},
  {term:"수록곡",english:"B-side track",desc:"앨범에 수록된 타이틀곡 외의 곡",romanization:"surokgok"},
  {term:"실검",english:"Real-time search",desc:"실시간 검색어 순위",romanization:"silgeom"},
  {term:"생카",english:"Birthday cafe",desc:"팬들이 아이돌 생일에 여는 카페 이벤트",romanization:"saengka"},
  {term:"조공",english:"Fan gift",desc:"팬이 아이돌에게 주는 선물",romanization:"jogong"}
];

// ============================================================
// 4. DRAMA LINES - 22 entries
// ============================================================
var kpopDramaLines = [
  {drama:"오징어 게임",dramaEn:"Squid Game",korean:"무궁화 꽃이 피었습니다",english:"The hibiscus flower has bloomed",romanization:"mugunghwa kkochi pieotseumnida",context:"달고나 게임에서 술래가 외치는 말"},
  {drama:"사랑의 불시착",dramaEn:"Crash Landing on You",korean:"사랑한다고 말해줘",english:"Tell me you love me",romanization:"saranghanda-go malhaejwo",context:"리정혁이 세리에게 하는 말"},
  {drama:"도깨비",dramaEn:"Goblin",korean:"오늘 날씨가 좋아서 당신이 보고 싶었습니다",english:"The weather was nice today so I missed you",romanization:"oneul nalssiga johaseo dangsin-i bogo sipeotseumnida",context:"도깨비 명대사"},
  {drama:"별에서 온 그대",dramaEn:"My Love from the Star",korean:"나는 너를 사랑하면 안 되는 사람이야",english:"I am someone who should not love you",romanization:"naneun neoreul saranghamyeon an doeneun saramiya",context:"도민준이 천송이에게 하는 말"},
  {drama:"이태원 클라쓰",dramaEn:"Itaewon Class",korean:"아, 좀 달게 살자",english:"Let's live a sweet life",romanization:"a, jom dalge salja",context:"박새로이의 명대사"},
  {drama:"김비서가 왜 그럴까",dramaEn:"What's Wrong with Secretary Kim",korean:"나한테 왜 이래",english:"Why are you being like this to me",romanization:"nahante wae irae",context:"김미소의 대사"},
  {drama:"호텔 델루나",dramaEn:"Hotel Del Luna",korean:"나 만세를 기다렸어",english:"I was waiting for Man-wol",romanization:"na mansereul gidaryeosseo",context:"구찬성이 장만월에게 하는 말"},
  {drama:"태양의 후예",dramaEn:"Descendants of the Sun",korean:"내가 좋아하는 건 너야",english:"What I like is you",romanization:"naega joahaneun geon neoya",context:"유시진이 강모연에게 고백"},
  {drama:"응답하라 1988",dramaEn:"Reply 1988",korean:"사람은 변하지 않아",english:"People don't change",romanization:"sarameun byeonhaji anha",context:"성덕선의 대사"},
  {drama:"빈센조",dramaEn:"Vincenzo",korean:"나는 이탈리아 마피아 변호사다",english:"I am an Italian mafia lawyer",romanization:"naneun italia mapia byeonhosada",context:"빈센조의 자기소개"},
  {drama:"스물다섯 스물하나",dramaEn:"Twenty-Five Twenty-One",korean:"지금 이 순간이 영원했으면 좋겠다",english:"I wish this moment could last forever",romanization:"jigeum i sun-gani yeongwonhaesseumyeon jokgetda",context:"나희도의 대사"},
  {drama:"더 글로리",dramaEn:"The Glory",korean:"복수는 천천히 해야 맛있어",english:"Revenge tastes better when served slowly",romanization:"boksuneun cheoncheonhi haeya masisseo",context:"문동은의 명대사"},
  {drama:"눈물의 여왕",dramaEn:"Queen of Tears",korean:"울지 마, 내가 있잖아",english:"Don't cry, I'm here for you",romanization:"ulji ma, naega itjanha",context:"백현우가 홍해인에게 하는 말"},
  {drama:"미스터 션샤인",dramaEn:"Mr. Sunshine",korean:"나는 조선 사람이오",english:"I am a person of Joseon",romanization:"naneun joseon saramio",context:"유진 초이의 대사"},
  {drama:"나의 아저씨",dramaEn:"My Mister",korean:"괜찮아, 다 괜찮아",english:"It's okay, everything is okay",romanization:"gwaenchanha, da gwaenchanha",context:"이지안을 위로하는 대사"},
  {drama:"킹덤",dramaEn:"Kingdom",korean:"백성이 굶주리고 있소",english:"The people are starving",romanization:"baekseong-i gumjurigo isso",context:"세자의 대사"},
  {drama:"이상한 변호사 우영우",dramaEn:"Extraordinary Attorney Woo",korean:"제 이름은 우영우입니다. 거꾸로 해도 우영우",english:"My name is Woo Young-woo. Same forward and backward",romanization:"je ireumeun uyeongwu-imnida. geokguro haedo uyeongwu",context:"우영우의 자기소개"},
  {drama:"시그널",dramaEn:"Signal",korean:"과거를 바꾸면 현재도 바뀐다",english:"If you change the past, the present changes too",romanization:"gwageoreul bakkumyeon hyeonjaedo bakkwinda",context:"무전기를 통한 대사"},
  {drama:"알함브라 궁전의 추억",dramaEn:"Memories of the Alhambra",korean:"게임과 현실의 경계가 무너졌다",english:"The boundary between game and reality has collapsed",romanization:"geimgwa hyeonsirui gyeong-gyega muneojyeotda",context:"유진우의 독백"},
  {drama:"갯마을 차차차",dramaEn:"Hometown Cha-Cha-Cha",korean:"여기가 바로 천국이에요",english:"This right here is paradise",romanization:"yeogiga baro cheongugieyo",context:"공진에서의 생활을 표현하는 대사"},
  {drama:"스타트업",dramaEn:"Start-Up",korean:"실패해도 괜찮아, 다시 시작하면 돼",english:"It's okay to fail, just start again",romanization:"silpaehaedo gwaenchanha, dasi sijakhamyeon dwae",context:"남도산의 대사"},
  {drama:"나 혼자만 레벨업",dramaEn:"Solo Leveling",korean:"일어나",english:"Arise",romanization:"irona",context:"성진우의 그림자 소환 대사"}
];

// ============================================================
// 5. FANDOM ROLEPLAY SCENARIOS - 10 entries
// ============================================================
var kpopFandomScenarios = [
  {scenario:"팬미팅 인사",prompt:"아이돌에게 첫 인사를 해보세요!",template:"안녕하세요, 저는 _____이에요. 항상 _____!",hints:["이름","응원하고 있어요"],example:"안녕하세요, 저는 민지예요. 항상 응원하고 있어요!",romanization:"annyeonghaseyo, jeoneun _____ ieyo. hangsang _____!"},
  {scenario:"응원 메시지",prompt:"콘서트에서 응원 메시지를 보내세요!",template:"_____ 오빠/언니, 오늘 무대 정말 _____!",hints:["이름","멋있었어요"],example:"지민 오빠, 오늘 무대 정말 멋있었어요!",romanization:"_____ oppa/eonni, oneul mudae jeongmal _____!"},
  {scenario:"생일 축하",prompt:"좋아하는 아이돌의 생일을 축하해주세요!",template:"_____ 생일 축하해요! _____ 되세요!",hints:["이름","행복한 하루"],example:"정국 생일 축하해요! 행복한 하루 되세요!",romanization:"_____ saengil chukahaeyo! _____ doeseyo!"},
  {scenario:"팬레터",prompt:"짧은 팬레터를 작성해보세요!",template:"_____, 당신의 _____이/가 저에게 큰 힘이 돼요.",hints:["이름","음악/춤/미소"],example:"로제, 당신의 음악이 저에게 큰 힘이 돼요.",romanization:"_____, dangsinui _____i/ga jeoege keun himi dwaeyo."},
  {scenario:"공항 응원",prompt:"공항에서 아이돌을 만났어요! 짧게 말해보세요!",template:"_____! 잘 다녀오세요! _____!",hints:["이름","파이팅"],example:"리사! 잘 다녀오세요! 파이팅!",romanization:"_____! jal danyeoseyo! _____!"},
  {scenario:"팬카페 글쓰기",prompt:"팬카페에 짧은 글을 남겨보세요!",template:"오늘 _____ 봤는데 정말 _____.",hints:["뮤비/무대/브이로그","감동이었어요"],example:"오늘 뮤비 봤는데 정말 감동이었어요.",romanization:"oneul _____ bwanneunde jeongmal _____."},
  {scenario:"콘서트 후기",prompt:"콘서트에 다녀온 후기를 남겨보세요!",template:"오늘 _____ 콘서트 너무 _____! 최고였어요!",hints:["그룹명","재밌었어요"],example:"오늘 BTS 콘서트 너무 재밌었어요! 최고였어요!",romanization:"oneul _____ konseoteu neomu _____! choegoyeosseoyo!"},
  {scenario:"투표 독려",prompt:"팬들에게 투표를 독려하는 메시지를 보내세요!",template:"_____ 투표 잊지 마세요! 우리 _____ 1위 만들자!",hints:["음악방송 이름","그룹명"],example:"엠카운트다운 투표 잊지 마세요! 우리 aespa 1위 만들자!",romanization:"_____ tupyo itji maseyo! uri _____ 1wi mandeulja!"},
  {scenario:"포토카드 교환",prompt:"포토카드 교환 메시지를 작성해보세요!",template:"_____ 포카 있어요! _____ 포카로 교환 가능한가요?",hints:["멤버명","멤버명"],example:"민지 포카 있어요! 하니 포카로 교환 가능한가요?",romanization:"_____ poka isseoyo! _____ pokaro gyohwan ganeunhangayo?"},
  {scenario:"첫 만남 소감",prompt:"처음 아이돌을 만난 소감을 말해보세요!",template:"드디어 만났어요! _____ 진짜 _____!",hints:["이름","멋있어요/예뻐요"],example:"드디어 만났어요! 카리나 진짜 예뻐요!",romanization:"deudieo mannasseoyo! _____ jinjja _____!"}
];

// ============================================================
// STATE VARIABLES
// ============================================================
/** @type {number} */
var kpopLyricsScore = 0;
/** @type {number} */
var kpopLyricsRound = 0;
/** @type {number} */
var kpopLyricsTotal = 10;
/** @type {number} */
var kpopIdolScore = 0;
/** @type {number} */
var kpopIdolRound = 0;
/** @type {number} */
var kpopIdolTotal = 10;
/** @type {number} */
var kpopDramaIdx = 0;
/** @type {number} */
var kpopTermPage = 0;
/** @type {number} */
var kpopScenarioIdx = 0;

// ============================================================
// HELPER: delegated event binding
// ============================================================

/**
 * Bind click events via data-action on a container.
 * @param {HTMLElement} container - Parent element
 * @param {Object<string,function>} actions - Map of action names to handlers
 */
function bindKpopActions(container, actions) {
  container.addEventListener("click", function (e) {
    var el = e.target.closest("[data-action]");
    if (!el || !container.contains(el)) return;
    var fn = actions[el.getAttribute("data-action")];
    if (fn) fn(el, e);
  });
}

// ============================================================
// 6. LYRICS QUIZ (showLyricsQuiz)
// ============================================================

/**
 * Start the K-POP lyrics fill-in-the-blank quiz.
 * @param {HTMLElement} c - Game area container
 */
function showLyricsQuiz(c) {
  kpopLyricsScore = 0;
  kpopLyricsRound = 0;
  if (typeof gameState !== "undefined") gameState.gamesPlayed++;
  if (typeof saveProgress === "function") saveProgress();
  nextLyricsQuestion(c);
}

/**
 * Render next lyrics question or end screen.
 * @param {HTMLElement} c - Game area container
 */
function nextLyricsQuestion(c) {
  if (kpopLyricsRound >= kpopLyricsTotal) {
    renderLyricsEnd(c);
    return;
  }
  var pool = shuffle(kpopLyrics.slice());
  var q = pool[kpopLyricsRound % pool.length];
  kpopLyricsRound++;
  renderLyricsCard(c, q);
}

/**
 * Render a single lyrics question card.
 * @param {HTMLElement} c - Game area container
 * @param {Object} q - Lyrics question data
 */
function renderLyricsCard(c, q) {
  var opts = shuffle(q.options.slice());
  var h = '<h2 class="game-title" style="background:linear-gradient(135deg,#ff2d95,#9d4edd);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Lyrics Quiz</h2>';
  h += '<p style="text-align:center;color:rgba(255,255,255,0.6)">Round ' + kpopLyricsRound + ' / ' + kpopLyricsTotal + '</p>';
  h += '<div class="level-progress" style="margin-bottom:18px"><div class="level-bar" style="width:' + Math.round((kpopLyricsRound / kpopLyricsTotal) * 100) + '%"></div></div>';
  h += '<div style="background:linear-gradient(135deg,rgba(255,45,149,0.15),rgba(157,78,221,0.15));padding:22px;border-radius:15px;text-align:center;margin-bottom:16px;border:1px solid rgba(255,45,149,0.3)">';
  h += '<div style="font-size:0.85rem;color:var(--neon-pink);margin-bottom:8px">' + escapeHtml(q.song) + ' - ' + escapeHtml(q.artist) + '</div>';
  h += '<div style="font-size:1.3rem;color:#fff;line-height:1.8">' + escapeHtml(q.lyrics).replace("_____", '<span style="border-bottom:2px dashed var(--neon-pink);padding:0 12px;color:var(--gold)">?????</span>') + '</div>';
  h += '</div>';
  h += '<div class="quiz-options" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">';
  for (var i = 0; i < opts.length; i++) {
    h += '<div class="quiz-option" data-action="lyrics-answer" data-value="' + escapeHtml(opts[i]) + '" data-correct="' + escapeHtml(q.answer) + '" style="cursor:pointer">' + escapeHtml(opts[i]) + '</div>';
  }
  h += '</div>';
  h += '<div id="kpopLyricsFeedback"></div>';
  h += '<div style="text-align:center;margin-top:12px;color:var(--gold);font-size:1.1rem">Score: ' + kpopLyricsScore + '</div>';
  c.innerHTML = h;

  bindKpopActions(c, {
    "lyrics-answer": function (el) {
      handleLyricsAnswer(c, el, q);
    }
  });
}

/**
 * Handle lyrics answer selection.
 * @param {HTMLElement} c - Game area container
 * @param {HTMLElement} el - Clicked element
 * @param {Object} q - Question data
 */
function handleLyricsAnswer(c, el, q) {
  if (el.classList.contains("disabled")) return;
  var allOpts = c.querySelectorAll(".quiz-option");
  for (var i = 0; i < allOpts.length; i++) allOpts[i].classList.add("disabled");
  var chosen = el.getAttribute("data-value");
  var correct = chosen === q.answer;
  var fb = document.getElementById("kpopLyricsFeedback");
  if (correct) {
    el.style.background = "rgba(0,245,212,0.3)";
    el.style.borderColor = "#00f5d4";
    kpopLyricsScore++;
    if (typeof addXP === "function") addXP(15);
    if (typeof addCombo === "function") addCombo();
    fb.innerHTML = '<div style="text-align:center;margin-top:14px;padding:12px;background:rgba(0,245,212,0.1);border-radius:10px"><p style="color:#00f5d4;font-weight:bold">Correct!</p><p style="color:#fff;margin-top:6px">' + escapeHtml(q.fullLyrics) + '</p><p style="color:rgba(255,255,255,0.5);font-size:0.8rem;margin-top:4px">' + escapeHtml(q.romanization || "") + '</p></div>';
  } else {
    el.style.background = "rgba(255,45,149,0.3)";
    el.style.borderColor = "#ff2d95";
    if (typeof resetCombo === "function") resetCombo();
    fb.innerHTML = '<div style="text-align:center;margin-top:14px;padding:12px;background:rgba(255,45,149,0.1);border-radius:10px"><p style="color:#ff2d95;font-weight:bold">The answer was: ' + escapeHtml(q.answer) + '</p><p style="color:#fff;margin-top:6px">' + escapeHtml(q.fullLyrics) + '</p></div>';
  }
  fb.innerHTML += '<div style="text-align:center;margin-top:10px"><button class="game-btn" data-action="lyrics-next" style="padding:8px 24px">Next</button></div>';
  bindKpopActions(c, {"lyrics-next": function () { nextLyricsQuestion(c); }});
}

/**
 * Render lyrics quiz end screen.
 * @param {HTMLElement} c - Game area container
 */
function renderLyricsEnd(c) {
  var pct = Math.round((kpopLyricsScore / kpopLyricsTotal) * 100);
  var grade = pct >= 80 ? "Amazing!" : pct >= 50 ? "Good job!" : "Keep practicing!";
  var h = '<h2 class="game-title">Lyrics Quiz Complete!</h2>';
  h += '<div style="text-align:center;padding:30px;background:linear-gradient(135deg,rgba(255,45,149,0.15),rgba(157,78,221,0.15));border-radius:15px;margin:20px 0">';
  h += '<div style="font-size:3rem;color:var(--gold);font-weight:bold">' + kpopLyricsScore + ' / ' + kpopLyricsTotal + '</div>';
  h += '<div style="font-size:1.2rem;color:var(--neon-pink);margin-top:8px">' + escapeHtml(grade) + '</div></div>';
  h += '<div style="text-align:center"><button class="game-btn" data-action="lyrics-retry" style="margin:5px">Play Again</button></div>';
  c.innerHTML = h;
  bindKpopActions(c, {"lyrics-retry": function () { showLyricsQuiz(c); }});
  if (pct >= 80 && typeof createConfetti === "function") createConfetti();
}

// ============================================================
// 7. IDOL QUIZ (showIdolQuiz)
// ============================================================

/**
 * Start the K-POP idol quiz.
 * @param {HTMLElement} c - Game area container
 */
function showIdolQuiz(c) {
  kpopIdolScore = 0;
  kpopIdolRound = 0;
  if (typeof gameState !== "undefined") gameState.gamesPlayed++;
  if (typeof saveProgress === "function") saveProgress();
  nextIdolQuestion(c);
}

/**
 * Build and render next idol quiz question.
 * @param {HTMLElement} c - Game area container
 */
function nextIdolQuestion(c) {
  if (kpopIdolRound >= kpopIdolTotal) {
    renderIdolEnd(c);
    return;
  }
  var pool = shuffle(kpopIdols.slice());
  var idol = pool[0];
  var qType = Math.floor(Math.random() * 3);
  kpopIdolRound++;
  renderIdolCard(c, idol, qType);
}

/**
 * Render an idol quiz card with question type.
 * @param {HTMLElement} c - Game area container
 * @param {Object} idol - Idol data
 * @param {number} qType - Question type index (0-2)
 */
function renderIdolCard(c, idol, qType) {
  var question, answer, wrongPool;
  if (qType === 0) {
    question = "Stage name '" + escapeHtml(idol.stageName) + "' (" + escapeHtml(idol.group) + ") - Korean name?";
    answer = idol.name;
    wrongPool = kpopIdols.filter(function (x) { return x.name !== idol.name; }).map(function (x) { return x.name; });
  } else if (qType === 1) {
    question = escapeHtml(idol.name) + " (" + escapeHtml(idol.groupKr) + ") - Position?";
    answer = idol.position;
    wrongPool = kpopIdols.filter(function (x) { return x.position !== idol.position; }).map(function (x) { return x.position; });
  } else {
    question = escapeHtml(idol.stageName) + " belongs to which group (Korean)?";
    answer = idol.groupKr;
    wrongPool = kpopIdols.filter(function (x) { return x.groupKr !== idol.groupKr; }).map(function (x) { return x.groupKr; });
  }
  var uniqueWrong = shuffle(Array.from(new Set(wrongPool))).slice(0, 3);
  var allOpts = shuffle([answer].concat(uniqueWrong));

  var h = '<h2 class="game-title" style="background:linear-gradient(135deg,#9d4edd,#00f5d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Idol Quiz</h2>';
  h += '<p style="text-align:center;color:rgba(255,255,255,0.6)">Round ' + kpopIdolRound + ' / ' + kpopIdolTotal + '</p>';
  h += '<div class="level-progress" style="margin-bottom:18px"><div class="level-bar" style="width:' + Math.round((kpopIdolRound / kpopIdolTotal) * 100) + '%"></div></div>';
  h += '<div style="background:linear-gradient(135deg,rgba(157,78,221,0.2),rgba(0,245,212,0.1));padding:22px;border-radius:15px;text-align:center;margin-bottom:16px;border:1px solid rgba(157,78,221,0.3)">';
  h += '<div style="font-size:1.2rem;color:#fff">' + question + '</div></div>';
  h += '<div class="quiz-options" style="display:grid;grid-template-columns:1fr;gap:10px">';
  for (var i = 0; i < allOpts.length; i++) {
    h += '<div class="quiz-option" data-action="idol-answer" data-value="' + escapeHtml(allOpts[i]) + '" data-correct="' + escapeHtml(answer) + '" style="cursor:pointer;font-size:0.95rem">' + escapeHtml(allOpts[i]) + '</div>';
  }
  h += '</div>';
  h += '<div id="kpopIdolFeedback"></div>';
  h += '<div style="text-align:center;margin-top:12px;color:var(--gold);font-size:1.1rem">Score: ' + kpopIdolScore + '</div>';
  c.innerHTML = h;

  bindKpopActions(c, {
    "idol-answer": function (el) { handleIdolAnswer(c, el, idol); }
  });
}

/**
 * Handle idol answer selection.
 * @param {HTMLElement} c - Game area container
 * @param {HTMLElement} el - Clicked option element
 * @param {Object} idol - Idol data for feedback
 */
function handleIdolAnswer(c, el, idol) {
  if (el.classList.contains("disabled")) return;
  var allOpts = c.querySelectorAll(".quiz-option");
  for (var i = 0; i < allOpts.length; i++) allOpts[i].classList.add("disabled");
  var chosen = el.getAttribute("data-value");
  var correctVal = el.getAttribute("data-correct");
  var correct = chosen === correctVal;
  var fb = document.getElementById("kpopIdolFeedback");
  if (correct) {
    el.style.background = "rgba(0,245,212,0.3)";
    kpopIdolScore++;
    if (typeof addXP === "function") addXP(15);
    if (typeof addCombo === "function") addCombo();
    fb.innerHTML = '<div style="text-align:center;margin-top:14px;padding:12px;background:rgba(0,245,212,0.1);border-radius:10px"><p style="color:#00f5d4;font-weight:bold">Correct!</p><p style="color:rgba(255,255,255,0.7);margin-top:4px">' + escapeHtml(idol.name) + ' (' + escapeHtml(idol.stageName) + ') - ' + escapeHtml(idol.groupKr) + '</p></div>';
  } else {
    el.style.background = "rgba(255,45,149,0.3)";
    if (typeof resetCombo === "function") resetCombo();
    fb.innerHTML = '<div style="text-align:center;margin-top:14px;padding:12px;background:rgba(255,45,149,0.1);border-radius:10px"><p style="color:#ff2d95;font-weight:bold">Answer: ' + escapeHtml(correctVal) + '</p></div>';
  }
  fb.innerHTML += '<div style="text-align:center;margin-top:10px"><button class="game-btn" data-action="idol-next" style="padding:8px 24px">Next</button></div>';
  bindKpopActions(c, {"idol-next": function () { nextIdolQuestion(c); }});
}

/**
 * Render idol quiz end screen.
 * @param {HTMLElement} c - Game area container
 */
function renderIdolEnd(c) {
  var pct = Math.round((kpopIdolScore / kpopIdolTotal) * 100);
  var h = '<h2 class="game-title">Idol Quiz Complete!</h2>';
  h += '<div style="text-align:center;padding:30px;background:linear-gradient(135deg,rgba(157,78,221,0.15),rgba(0,245,212,0.1));border-radius:15px;margin:20px 0">';
  h += '<div style="font-size:3rem;color:var(--gold);font-weight:bold">' + kpopIdolScore + ' / ' + kpopIdolTotal + '</div>';
  h += '<div style="color:var(--neon-pink);margin-top:8px">' + (pct >= 80 ? "K-POP Expert!" : pct >= 50 ? "Rising Fan!" : "Rookie Fan!") + '</div></div>';
  h += '<div style="text-align:center"><button class="game-btn" data-action="idol-retry" style="margin:5px">Play Again</button></div>';
  c.innerHTML = h;
  bindKpopActions(c, {"idol-retry": function () { showIdolQuiz(c); }});
  if (pct >= 80 && typeof createConfetti === "function") createConfetti();
}

// ============================================================
// 8. K-POP TERMS DICTIONARY (showKpopTerms)
// ============================================================

/**
 * Display K-POP terms dictionary with pagination.
 * @param {HTMLElement} c - Game area container
 */
function showKpopTerms(c) {
  kpopTermPage = 0;
  renderKpopTermsPage(c);
}

/**
 * Render a page of K-POP terms.
 * @param {HTMLElement} c - Game area container
 */
function renderKpopTermsPage(c) {
  var perPage = 8;
  var start = kpopTermPage * perPage;
  var pageTerms = kpopTermsDictionary.slice(start, start + perPage);
  var totalPages = Math.ceil(kpopTermsDictionary.length / perPage);

  var h = '<h2 class="game-title" style="background:linear-gradient(135deg,#ff2d95,#ffd700);-webkit-background-clip:text;-webkit-text-fill-color:transparent">K-POP Terms Dictionary</h2>';
  h += '<p style="text-align:center;color:rgba(255,255,255,0.5);margin-bottom:14px">Page ' + (kpopTermPage + 1) + ' / ' + totalPages + '</p>';
  for (var i = 0; i < pageTerms.length; i++) {
    var t = pageTerms[i];
    h += '<div style="background:linear-gradient(135deg,rgba(255,45,149,0.08),rgba(157,78,221,0.08));padding:14px;border-radius:12px;margin-bottom:10px;border:1px solid rgba(255,45,149,0.15)">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center">';
    h += '<span style="font-size:1.15rem;color:var(--neon-pink);font-weight:bold">' + escapeHtml(t.term) + '</span>';
    h += '<span style="color:var(--gold);font-size:0.85rem">' + escapeHtml(t.english) + '</span></div>';
    h += '<div style="color:rgba(255,255,255,0.7);font-size:0.85rem;margin-top:4px">' + escapeHtml(t.desc) + '</div>';
    h += '<div style="color:rgba(255,255,255,0.4);font-size:0.75rem;margin-top:2px">(' + escapeHtml(t.romanization) + ')</div>';
    h += '<button class="game-btn secondary" data-action="term-speak" data-word="' + escapeHtml(t.term) + '" style="margin-top:6px;padding:4px 12px;font-size:0.75rem">Listen</button>';
    h += '</div>';
  }
  h += '<div style="display:flex;justify-content:center;gap:10px;margin-top:16px">';
  if (kpopTermPage > 0) h += '<button class="game-btn" data-action="term-prev" style="padding:8px 20px">Prev</button>';
  if (kpopTermPage < totalPages - 1) h += '<button class="game-btn" data-action="term-next" style="padding:8px 20px">Next</button>';
  h += '</div>';
  c.innerHTML = h;

  bindKpopActions(c, {
    "term-speak": function (el) { if (typeof speakKorean === "function") speakKorean(el.getAttribute("data-word")); },
    "term-prev": function () { kpopTermPage--; renderKpopTermsPage(c); },
    "term-next": function () { kpopTermPage++; renderKpopTermsPage(c); }
  });
}

// ============================================================
// 9. DRAMA LINES PRACTICE (showDramaLines)
// ============================================================

/**
 * Start drama line practice mode.
 * @param {HTMLElement} c - Game area container
 */
function showDramaLines(c) {
  kpopDramaIdx = 0;
  renderDramaLine(c);
}

/**
 * Render a single drama line card.
 * @param {HTMLElement} c - Game area container
 */
function renderDramaLine(c) {
  var line = kpopDramaLines[kpopDramaIdx];
  var h = '<h2 class="game-title" style="background:linear-gradient(135deg,#9d4edd,#ff2d95);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Drama Lines</h2>';
  h += '<p style="text-align:center;color:rgba(255,255,255,0.5)">' + (kpopDramaIdx + 1) + ' / ' + kpopDramaLines.length + '</p>';
  h += '<div style="background:linear-gradient(135deg,rgba(157,78,221,0.15),rgba(255,45,149,0.1));padding:24px;border-radius:15px;margin:16px 0;border:1px solid rgba(157,78,221,0.25);text-align:center">';
  h += '<div style="font-size:0.85rem;color:var(--gold);margin-bottom:10px">' + escapeHtml(line.drama) + ' (' + escapeHtml(line.dramaEn) + ')</div>';
  h += '<div style="font-size:1.5rem;color:#fff;line-height:1.7;margin-bottom:12px">' + escapeHtml(line.korean) + '</div>';
  h += '<button class="game-btn secondary" data-action="drama-speak" style="margin-bottom:14px;padding:6px 16px;font-size:0.85rem">Listen</button>';
  h += '<div style="color:rgba(255,255,255,0.5);font-size:0.85rem;margin-bottom:6px">' + escapeHtml(line.romanization) + '</div>';
  h += '<div style="color:rgba(255,255,255,0.7);font-size:0.95rem;margin-bottom:8px">' + escapeHtml(line.english) + '</div>';
  if (line.context) h += '<div style="color:rgba(255,255,255,0.4);font-size:0.8rem;font-style:italic">' + escapeHtml(line.context) + '</div>';
  h += '</div>';
  h += '<div style="display:flex;justify-content:center;gap:10px">';
  if (kpopDramaIdx > 0) h += '<button class="game-btn" data-action="drama-prev" style="padding:8px 20px">Prev</button>';
  if (kpopDramaIdx < kpopDramaLines.length - 1) h += '<button class="game-btn" data-action="drama-next" style="padding:8px 20px">Next</button>';
  h += '</div>';
  c.innerHTML = h;

  bindKpopActions(c, {
    "drama-speak": function () { if (typeof speakKorean === "function") speakKorean(line.korean); },
    "drama-prev": function () { kpopDramaIdx--; renderDramaLine(c); },
    "drama-next": function () { kpopDramaIdx++; renderDramaLine(c); }
  });
}

// ============================================================
// 10. FANDOM ROLEPLAY (showFandomRoleplay)
// ============================================================

/**
 * Start fandom roleplay practice mode.
 * @param {HTMLElement} c - Game area container
 */
function showFandomRoleplay(c) {
  kpopScenarioIdx = 0;
  renderFandomScenario(c);
}

/**
 * Render a fandom roleplay scenario card.
 * @param {HTMLElement} c - Game area container
 */
function renderFandomScenario(c) {
  var s = kpopFandomScenarios[kpopScenarioIdx];
  var h = '<h2 class="game-title" style="background:linear-gradient(135deg,#ff2d95,#ffd700);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Fandom Roleplay</h2>';
  h += '<p style="text-align:center;color:rgba(255,255,255,0.5)">' + (kpopScenarioIdx + 1) + ' / ' + kpopFandomScenarios.length + '</p>';
  h += '<div style="background:linear-gradient(135deg,rgba(255,45,149,0.12),rgba(255,215,0,0.08));padding:24px;border-radius:15px;margin:16px 0;border:1px solid rgba(255,45,149,0.2)">';
  h += '<div style="font-size:1.1rem;color:var(--neon-pink);font-weight:bold;margin-bottom:8px">' + escapeHtml(s.scenario) + '</div>';
  h += '<div style="color:rgba(255,255,255,0.7);margin-bottom:14px">' + escapeHtml(s.prompt) + '</div>';
  h += '<div style="background:rgba(0,0,0,0.3);padding:14px;border-radius:10px;margin-bottom:12px">';
  h += '<div style="color:var(--gold);font-size:0.8rem;margin-bottom:6px">Template:</div>';
  h += '<div style="color:#fff;font-size:1.1rem">' + escapeHtml(s.template) + '</div>';
  h += '<div style="color:rgba(255,255,255,0.4);font-size:0.75rem;margin-top:4px">(' + escapeHtml(s.romanization) + ')</div>';
  h += '</div>';
  h += '<div style="color:rgba(255,255,255,0.5);font-size:0.8rem;margin-bottom:4px">Hints: ' + s.hints.map(function (x) { return escapeHtml(x); }).join(", ") + '</div>';
  h += '<div style="background:rgba(0,245,212,0.08);padding:10px;border-radius:8px;margin-top:10px">';
  h += '<div style="color:#00f5d4;font-size:0.8rem;margin-bottom:4px">Example:</div>';
  h += '<div style="color:#fff;font-size:0.95rem">' + escapeHtml(s.example) + '</div></div>';
  h += '<button class="game-btn secondary" data-action="roleplay-speak" style="margin-top:10px;padding:5px 14px;font-size:0.8rem">Listen Example</button>';
  h += '</div>';
  h += '<div style="display:flex;justify-content:center;gap:10px">';
  if (kpopScenarioIdx > 0) h += '<button class="game-btn" data-action="roleplay-prev" style="padding:8px 20px">Prev</button>';
  if (kpopScenarioIdx < kpopFandomScenarios.length - 1) h += '<button class="game-btn" data-action="roleplay-next" style="padding:8px 20px">Next</button>';
  h += '</div>';
  c.innerHTML = h;

  bindKpopActions(c, {
    "roleplay-speak": function () { if (typeof speakKorean === "function") speakKorean(s.example); },
    "roleplay-prev": function () { kpopScenarioIdx--; renderFandomScenario(c); },
    "roleplay-next": function () { kpopScenarioIdx++; renderFandomScenario(c); }
  });
}

// ============================================================
// GLOBAL EXPORTS
// ============================================================
window.showLyricsQuiz = showLyricsQuiz;
window.showIdolQuiz = showIdolQuiz;
window.showKpopTerms = showKpopTerms;
window.showDramaLines = showDramaLines;
window.showFandomRoleplay = showFandomRoleplay;
window.kpopIdols = kpopIdols;
window.kpopLyrics = kpopLyrics;
window.kpopTermsDictionary = kpopTermsDictionary;
window.kpopDramaLines = kpopDramaLines;
window.kpopFandomScenarios = kpopFandomScenarios;

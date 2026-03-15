// ============================================================
// K-POP Korean Learning Game - Content Data
// All data is globally accessible via var declarations
// ============================================================

// 1. MBTI Expressions - Korean expressions matched to each personality type
var mbtiExpressions = {
  INTJ: [
    {korean:"계획", romanization:"gyehoek", english:"plan", context:"INTJs love making detailed plans"},
    {korean:"분석", romanization:"bunseok", english:"analysis", context:"INTJs analyze everything deeply"},
    {korean:"효율", romanization:"hyoyul", english:"efficiency", context:"Efficiency is the INTJ motto"},
    {korean:"목표", romanization:"mokpyo", english:"goal", context:"Always goal-oriented and driven"},
    {korean:"전략", romanization:"jeonryak", english:"strategy", context:"Strategic thinkers by nature"}
  ],
  INTP: [
    {korean:"논리", romanization:"nonri", english:"logic", context:"INTPs live by logic"},
    {korean:"호기심", romanization:"hogisim", english:"curiosity", context:"Endlessly curious about everything"},
    {korean:"이론", romanization:"iron", english:"theory", context:"Love building theories"},
    {korean:"가능성", romanization:"ganeungseong", english:"possibility", context:"Always exploring possibilities"},
    {korean:"독립", romanization:"dongnip", english:"independence", context:"Value intellectual independence"}
  ],
  ENTJ: [
    {korean:"리더십", romanization:"rideosip", english:"leadership", context:"Natural-born leaders"},
    {korean:"결단력", romanization:"gyeoldanryeok", english:"decisiveness", context:"Quick and confident decisions"},
    {korean:"도전", romanization:"dojeon", english:"challenge", context:"Love taking on challenges"},
    {korean:"성취", romanization:"seongchwi", english:"achievement", context:"Driven by achievement"},
    {korean:"지휘", romanization:"jihwi", english:"command", context:"Comfortable taking command"}
  ],
  ENTP: [
    {korean:"토론", romanization:"toron", english:"debate", context:"ENTPs love a good debate"},
    {korean:"창의력", romanization:"changuiryeok", english:"creativity", context:"Bursting with creative ideas"},
    {korean:"모험", romanization:"moheom", english:"adventure", context:"Always seeking new adventures"},
    {korean:"재치", romanization:"jaechi", english:"wit", context:"Quick-witted and clever"},
    {korean:"혁신", romanization:"hyeoksin", english:"innovation", context:"Constantly innovating"}
  ],
  INFJ: [
    {korean:"직감", romanization:"jikgam", english:"intuition", context:"Trust their strong intuition"},
    {korean:"이상", romanization:"isang", english:"ideal", context:"Driven by ideals and vision"},
    {korean:"공감", romanization:"gonggam", english:"empathy", context:"Deep empathy for others"},
    {korean:"의미", romanization:"uimi", english:"meaning", context:"Seek meaning in everything"},
    {korean:"헌신", romanization:"heonsin", english:"devotion", context:"Devoted to their cause"}
  ],
  INFP: [
    {korean:"상상", romanization:"sangsang", english:"imagination", context:"Rich inner imagination"},
    {korean:"감성", romanization:"gamseong", english:"sensitivity", context:"Deeply sensitive and emotional"},
    {korean:"진정성", romanization:"jinjeongseong", english:"authenticity", context:"Value being authentic"},
    {korean:"꿈", romanization:"kkum", english:"dream", context:"Always chasing dreams"},
    {korean:"치유", romanization:"chiyu", english:"healing", context:"Natural healers of the soul"}
  ],
  ENFJ: [
    {korean:"배려", romanization:"baeryeo", english:"consideration", context:"Always considerate of others"},
    {korean:"영감", romanization:"yeonggam", english:"inspiration", context:"Inspire people around them"},
    {korean:"조화", romanization:"johwa", english:"harmony", context:"Strive for group harmony"},
    {korean:"소통", romanization:"sotong", english:"communication", context:"Excellent communicators"},
    {korean:"봉사", romanization:"bongsa", english:"service", context:"Love serving their community"}
  ],
  ENFP: [
    {korean:"열정", romanization:"yeoljeong", english:"passion", context:"Passionate about everything"},
    {korean:"자유", romanization:"jayu", english:"freedom", context:"Value freedom above all"},
    {korean:"즐거움", romanization:"jeulgeoun", english:"joy", context:"Spread joy wherever they go"},
    {korean:"영혼", romanization:"yeonghon", english:"soul", context:"Live with their whole soul"},
    {korean:"가슴", romanization:"gaseum", english:"heart", context:"Follow their heart always"}
  ],
  ISTJ: [
    {korean:"책임", romanization:"chaegim", english:"responsibility", context:"Take responsibility seriously"},
    {korean:"규칙", romanization:"gyuchik", english:"rule", context:"Follow rules and structure"},
    {korean:"신뢰", romanization:"sinroe", english:"trust", context:"Build trust through consistency"},
    {korean:"성실", romanization:"seongsil", english:"diligence", context:"Diligent and hardworking"},
    {korean:"전통", romanization:"jeontong", english:"tradition", context:"Respect traditions and customs"}
  ],
  ISFJ: [
    {korean:"보호", romanization:"boho", english:"protection", context:"Protective of loved ones"},
    {korean:"따뜻함", romanization:"ttatteusham", english:"warmth", context:"Warm and caring nature"},
    {korean:"기억", romanization:"gieok", english:"memory", context:"Remember every detail about you"},
    {korean:"충성", romanization:"chungseong", english:"loyalty", context:"Deeply loyal to family and friends"},
    {korean:"안정", romanization:"anjeong", english:"stability", context:"Create stability for everyone"}
  ],
  ESTJ: [
    {korean:"질서", romanization:"jilseo", english:"order", context:"Bring order to chaos"},
    {korean:"관리", romanization:"gwanri", english:"management", context:"Natural managers and organizers"},
    {korean:"실행", romanization:"silhaeng", english:"execution", context:"Get things done efficiently"},
    {korean:"원칙", romanization:"wonchik", english:"principle", context:"Live by strong principles"},
    {korean:"체계", romanization:"chegye", english:"system", context:"Build systematic approaches"}
  ],
  ESFJ: [
    {korean:"친절", romanization:"chinjeol", english:"kindness", context:"Kindness is their superpower"},
    {korean:"사교", romanization:"sagyo", english:"socializing", context:"Love social gatherings"},
    {korean:"돌봄", romanization:"dolbom", english:"care", context:"Natural caregivers"},
    {korean:"화합", romanization:"hwahap", english:"unity", context:"Bring people together"},
    {korean:"예의", romanization:"yeui", english:"manners", context:"Value good manners and etiquette"}
  ],
  ISTP: [
    {korean:"기술", romanization:"gisul", english:"skill/technique", context:"Master technical skills"},
    {korean:"실용", romanization:"siryong", english:"practicality", context:"Practical problem solvers"},
    {korean:"관찰", romanization:"gwanchal", english:"observation", context:"Keen observers of the world"},
    {korean:"도구", romanization:"dogu", english:"tool", context:"Love working with tools"},
    {korean:"탐험", romanization:"tamheom", english:"exploration", context:"Explore how things work"}
  ],
  ISFP: [
    {korean:"예술", romanization:"yesul", english:"art", context:"Artistic and creative souls"},
    {korean:"아름다움", romanization:"areumdaum", english:"beauty", context:"Find beauty everywhere"},
    {korean:"현재", romanization:"hyeonjae", english:"present moment", context:"Live in the present"},
    {korean:"감각", romanization:"gamgak", english:"senses", context:"Experience life through all senses"},
    {korean:"표현", romanization:"pyohyeon", english:"expression", context:"Express through art and action"}
  ],
  ESTP: [
    {korean:"행동", romanization:"haengdong", english:"action", context:"Action-oriented and bold"},
    {korean:"스릴", romanization:"seuril", english:"thrill", context:"Live for the thrill"},
    {korean:"적응", romanization:"jeogeung", english:"adaptation", context:"Adapt quickly to any situation"},
    {korean:"현실", romanization:"hyeonsil", english:"reality", context:"Grounded in reality"},
    {korean:"에너지", romanization:"eneoji", english:"energy", context:"Bring energy to every room"}
  ],
  ESFP: [
    {korean:"무대", romanization:"mudae", english:"stage", context:"Love being on stage"},
    {korean:"웃음", romanization:"useum", english:"laughter", context:"Make everyone laugh"},
    {korean:"축제", romanization:"chukje", english:"festival", context:"Turn life into a festival"},
    {korean:"매력", romanization:"maeryeok", english:"charm", context:"Naturally charming and fun"},
    {korean:"즉흥", romanization:"jeukheung", english:"spontaneity", context:"Live spontaneously"}
  ]
};

// 2. K-Drama Quotes - Famous quotes from popular Korean dramas
var kdramaQuotes = [
  {korean:"첫사랑은 다 그런 거래요. 다 이루어지지 않는대요.", romanization:"cheossarangeun da geureon georaeyo. da irueojiji annneundaeyo.", english:"They say first love is like that. It never works out.", drama:"Goblin", year:2016},
  {korean:"비가 오면 생각나는 사람이 있나요?", romanization:"biga omyeon saenggangnanneun sarami innayo?", english:"Is there someone you think of when it rains?", drama:"Goblin", year:2016},
  {korean:"사랑은 타이밍이래.", romanization:"sarangeun taimingiraeyo.", english:"They say love is all about timing.", drama:"Reply 1988", year:2015},
  {korean:"네가 좋은 게 아니라 네가 없는 게 싫은 거야.", romanization:"nega joeun ge anira nega eomneun ge sireun geoya.", english:"It's not that I like you, it's that I hate being without you.", drama:"Reply 1988", year:2015},
  {korean:"이제 와서 좋아한다고 하면 어떡해?", romanization:"ije waseo joahandago hamyeon eotteokae?", english:"What am I supposed to do if you say you like me now?", drama:"Reply 1988", year:2015},
  {korean:"나는 이 순간도 별처럼 빛나고 있어.", romanization:"naneun i sungando byeolcheoreom binnago isseo.", english:"Even in this moment, I'm shining like a star.", drama:"My Love from the Star", year:2013},
  {korean:"사랑이 어떻게 변하니.", romanization:"sarangi eotteoke byeonhani.", english:"How can love change?", drama:"Stairway to Heaven", year:2003},
  {korean:"포기하지 마. 꿈은 이루어진다.", romanization:"pogihaji ma. kkumeun irueojinda.", english:"Don't give up. Dreams come true.", drama:"Dream High", year:2011},
  {korean:"난 너의 첫사랑은 아니어도 마지막 사랑이 되고 싶어.", romanization:"nan neoui cheossarangeun anieodo majimak sarangi doego sipeo.", english:"Even if I'm not your first love, I want to be your last.", drama:"Crash Landing on You", year:2019},
  {korean:"살아 있어줘서 고마워.", romanization:"sara isseojwoseo gomawo.", english:"Thank you for being alive.", drama:"Crash Landing on You", year:2019},
  {korean:"당신이 이 세상에 태어나줘서 고마워요.", romanization:"dangsini i sesange taeeona jwoseo gomawoyo.", english:"Thank you for being born into this world.", drama:"Crash Landing on You", year:2019},
  {korean:"나한테 이러지 마. 흔들리잖아.", romanization:"nahante ireoji ma. heundeullijana.", english:"Don't do this to me. I'm shaking.", drama:"Itaewon Class", year:2020},
  {korean:"밤이 가장 어두울 때가 새벽이 가장 가까울 때야.", romanization:"bami gajang eodul ttaega saebyeogi gajang gakkaul ttaeya.", english:"The darkest hour of the night is closest to dawn.", drama:"Itaewon Class", year:2020},
  {korean:"세상에서 가장 무서운 건 나 자신이야.", romanization:"sesangeseo gajang museoum geon na jashiniya.", english:"The scariest thing in the world is yourself.", drama:"Itaewon Class", year:2020},
  {korean:"우영우, 기러기, 토마토, 스위스, 인도인, 별똥별.", romanization:"uyeongwu, gireogi, tomato, seuwiseu, indoin, byeolttongbyeol.", english:"Woo Young-woo, goose, tomato, Swiss, Indian, shooting star.", drama:"Extraordinary Attorney Woo", year:2022},
  {korean:"고래가 좋으세요? 저도요. 고래는 참 멋져요.", romanization:"goraega joeusayo? jeodoyo. goraeneun cham meotjyeoyo.", english:"Do you like whales? Me too. Whales are really cool.", drama:"Extraordinary Attorney Woo", year:2022},
  {korean:"사람은 누구나 이기고 싶어 해. 하지만 이기는 것보다 중요한 건 지지 않는 거야.", romanization:"sarameun nuguna igigo sipeo hae. hajiman igineun geotboda jungyohan geon jiji anneun geoya.", english:"Everyone wants to win. But more important than winning is not losing.", drama:"Vincenzo", year:2021},
  {korean:"무궁화꽃이 피었습니다.", romanization:"mugunghwa kkochi pieosseumnida.", english:"The hibiscus flower has bloomed.", drama:"Squid Game", year:2021},
  {korean:"여기서 나가면 밖은 더 지옥이야.", romanization:"yeogiseo nagamyeon bakkeun deo jiogiya.", english:"If you leave here, it's even more of a hell outside.", drama:"Squid Game", year:2021},
  {korean:"사랑은 움직이는 거야.", romanization:"sarangeun umjigineun geoya.", english:"Love is something that moves.", drama:"Full House", year:2004},
  {korean:"잘 가. 더 이상 아프지 마.", romanization:"jal ga. deo isang apeuji ma.", english:"Goodbye. Don't hurt anymore.", drama:"Moon Lovers", year:2016},
  {korean:"오늘부터 1일이야.", romanization:"oneulbuteo iriliya.", english:"Today is Day 1 for us.", drama:"Weightlifting Fairy Kim Bok-joo", year:2016},
  {korean:"넌 내 인생의 봄이야.", romanization:"neon nae insaengui bomiya.", english:"You are the spring of my life.", drama:"Spring Waltz", year:2006},
  {korean:"네가 있어서 내가 웃는 거야.", romanization:"nega isseoseo naega unneun geoya.", english:"I smile because you exist.", drama:"Boys Over Flowers", year:2009},
  {korean:"사랑은 기억보다 강하다.", romanization:"sarangeun gieokboda ganghada.", english:"Love is stronger than memory.", drama:"18 Again", year:2020},
  {korean:"피할 수 없으면 즐겨라.", romanization:"pihal su eobseumyeon jeulgyeora.", english:"If you can't avoid it, enjoy it.", drama:"Please Come Back, Mister", year:2016},
  {korean:"그리움은 사랑의 다른 이름이에요.", romanization:"geuriumeun sarangui dareun ireumeieyo.", english:"Longing is another name for love.", drama:"Guardian: The Lonely and Great God", year:2016},
  {korean:"때로는 슬퍼도 괜찮아.", romanization:"ttaeroneun seulpeodo gwaenchana.", english:"Sometimes it's okay to be sad.", drama:"It's Okay to Not Be Okay", year:2020},
  {korean:"상처받는 것도 사는 거야.", romanization:"sangcheobatneun geotdo saneun geoya.", english:"Getting hurt is part of living too.", drama:"It's Okay to Not Be Okay", year:2020},
  {korean:"한 번 해보는 거야, 되든 안 되든.", romanization:"han beon haeboneun geoya, doedeun an doedeun.", english:"Just try it once, whether it works or not.", drama:"Start-Up", year:2020},
  {korean:"진짜 어른은 참는 게 아니라 견디는 거야.", romanization:"jinjja eoreuneun chamneun ge anira gyeondineun geoya.", english:"A real adult doesn't just endure, they persevere.", drama:"My Mister", year:2018},
  {korean:"아직 끝나지 않았어. 할 수 있어.", romanization:"ajik kkeutnaji anasseo. hal su isseo.", english:"It's not over yet. You can do it.", drama:"All of Us Are Dead", year:2022}
];

// 3. Korean Memes / Internet Slang
var koreanMemes = [
  {korean:"킹받다", romanization:"kingbatda", english:"to be extremely annoyed (king-level anger)", example:"시험 망해서 킹받아", category:"reaction"},
  {korean:"갓생", romanization:"gatsaeng", english:"living like a god (super productive life)", example:"오늘도 갓생 살기!", category:"lifestyle"},
  {korean:"취존", romanization:"chwi-jon", english:"respect each other's tastes/preferences", example:"취존해 주세요", category:"attitude"},
  {korean:"JMT", romanization:"je-em-ti", english:"jeong-mal mat-it-da (really delicious)", example:"이 떡볶이 JMT야!", category:"food"},
  {korean:"레전드", romanization:"rejendeu", english:"legend (something legendary/amazing)", example:"어제 콘서트 레전드였어", category:"reaction"},
  {korean:"팩폭", romanization:"paekpok", english:"fact bomb (harsh truth attack)", example:"친구가 팩폭해서 할 말 없었어", category:"reaction"},
  {korean:"오저치고", romanization:"ojeo-chigo", english:"oh today's outfit is great (complimenting outfit)", example:"오저치고! 완전 멋있다", category:"compliment"},
  {korean:"갑분싸", romanization:"gapbunssa", english:"sudden mood killer (atmosphere suddenly cold)", example:"그 얘기하니까 갑분싸됐어", category:"situation"},
  {korean:"꿀잼", romanization:"kkuljaem", english:"honey-fun (super entertaining)", example:"이 영화 꿀잼이야!", category:"entertainment"},
  {korean:"노잼", romanization:"nojaem", english:"no-fun (boring)", example:"오늘 수업 노잼이었어", category:"entertainment"},
  {korean:"인싸", romanization:"inssa", english:"insider (popular/social person)", example:"그 친구는 완전 인싸야", category:"people"},
  {korean:"아싸", romanization:"assa", english:"outsider (someone who prefers being alone)", example:"나는 아싸가 편해", category:"people"},
  {korean:"존맛", romanization:"jonmat", english:"extremely delicious (respectfully delicious)", example:"이 치킨 존맛이야!", category:"food"},
  {korean:"뇌섹남", romanization:"noeseongnam", english:"brain-sexy man (smart and attractive guy)", example:"교수님 완전 뇌섹남이야", category:"people"},
  {korean:"뇌섹녀", romanization:"noeseongnyeo", english:"brain-sexy woman (smart and attractive woman)", example:"그 변호사 완전 뇌섹녀야", category:"people"},
  {korean:"혼코노", romanization:"honkono", english:"solo karaoke (singing karaoke alone)", example:"오늘 혼코노 하러 가자", category:"lifestyle"},
  {korean:"소확행", romanization:"sohwakhaeng", english:"small but certain happiness", example:"카페에서 커피 마시는 게 소확행이야", category:"lifestyle"},
  {korean:"워라밸", romanization:"worabal", english:"work-life balance", example:"워라밸이 좋은 회사 가고 싶어", category:"lifestyle"},
  {korean:"플렉스", romanization:"peullekseu", english:"flex (show off spending/wealth)", example:"오늘 월급날이니까 플렉스 해야지!", category:"lifestyle"},
  {korean:"가심비", romanization:"gasimbi", english:"emotional cost-effectiveness (worth the feelings)", example:"비싸도 가심비가 좋으면 사!", category:"shopping"},
  {korean:"TMI", romanization:"ti-em-ai", english:"too much information", example:"TMI인데 나 오늘 양말 짝짝이야", category:"conversation"},
  {korean:"MBTI", romanization:"em-bi-ti-ai", english:"MBTI (personality types obsession)", example:"너 MBTI 뭐야?", category:"conversation"},
  {korean:"갓벽", romanization:"gatbyeok", english:"god-perfect (absolutely perfect)", example:"오늘 날씨 갓벽이야", category:"reaction"},
  {korean:"별다줄", romanization:"byeoldajul", english:"abbreviation of everything (shorten all words)", example:"요즘 별다줄이라 이해가 안 돼", category:"language"},
  {korean:"억텐", romanization:"eokten", english:"forcing tension/energy (pretending to be excited)", example:"회식에서 억텐 했어", category:"situation"},
  {korean:"점메추", romanization:"jeommechu", english:"lunch menu recommendation", example:"점메추 좀 해줘!", category:"food"},
  {korean:"저메추", romanization:"jeomechu", english:"dinner menu recommendation", example:"저메추 뭐가 좋을까?", category:"food"},
  {korean:"만반잘부", romanization:"manbanjalboo", english:"nice to meet you, let's get along well (abbreviated)", example:"신입입니다. 만반잘부!", category:"greeting"},
  {korean:"내또출", romanization:"naettochwul", english:"tomorrow I have to go to work again", example:"벌써 일요일 밤이라니... 내또출", category:"work"},
  {korean:"할많하않", romanization:"halmanhahant", english:"I have a lot to say but I won't say it", example:"그 뉴스 보고 할많하않...", category:"reaction"},
  {korean:"중꺾마", romanization:"jungkkeongma", english:"what matters is never giving up (motivational)", example:"중꺾마! 포기하지 마!", category:"motivation"},
  {korean:"커피는 사랑", romanization:"keopineun sarang", english:"coffee is love", example:"아아 없이 못 살아. 커피는 사랑!", category:"lifestyle"}
];

// 4. KakaoTalk / Korean Texting Expressions
var kakaotalkExpressions = [
  {expression:"ㅋㅋㅋ", meaning:"hahaha (laughing)", usage:"Casual laughter. More consonants means funnier. Minimum 3 for genuine laugh.", level:"basic"},
  {expression:"ㅠㅠ", meaning:"crying face", usage:"Expressing sadness, frustration, or being touched", level:"basic"},
  {expression:"ㅎㅎ", meaning:"hehe (gentle laugh)", usage:"Friendly, soft, warm laughter", level:"basic"},
  {expression:"ㄱㅅ", meaning:"gamsa (thanks)", usage:"Abbreviated version of thanks. Very casual.", level:"intermediate"},
  {expression:"ㅇㅇ", meaning:"eung eung (yes yes)", usage:"Casual agreement or acknowledgment", level:"basic"},
  {expression:"ㄴㄴ", meaning:"no no", usage:"Casual way to say no or disagree", level:"basic"},
  {expression:"ㅇㅋ", meaning:"okay", usage:"Quick acknowledgment, like a thumbs up", level:"basic"},
  {expression:"ㄷㄷ", meaning:"deol deol (trembling)", usage:"Expressing shock, surprise, or being scared", level:"intermediate"},
  {expression:"ㅂㅂ", meaning:"bye bye", usage:"Quick goodbye in casual chat", level:"basic"},
  {expression:"ㅈㅅ", meaning:"joesonghamnida (sorry)", usage:"Abbreviated apology. Casual.", level:"intermediate"},
  {expression:"ㅁㄹ", meaning:"molla (I don't know)", usage:"Quick way to say you don't know", level:"intermediate"},
  {expression:"ㅊㅋ", meaning:"chukha (congratulations)", usage:"Abbreviated congratulations", level:"intermediate"},
  {expression:"^^", meaning:"smiling eyes", usage:"Happy, friendly expression. Classic Korean emoticon.", level:"basic"},
  {expression:"-_-", meaning:"annoyed/unamused face", usage:"Expressing annoyance or deadpan reaction", level:"basic"},
  {expression:"헐", meaning:"hul (OMG / no way)", usage:"Expressing disbelief, surprise, or shock", level:"basic"},
  {expression:"앜ㅋㅋ", meaning:"ak-kk (laugh-crying)", usage:"So funny it hurts, laughing uncontrollably", level:"intermediate"},
  {expression:"ㅎㄷㄷ", meaning:"heol-deol-deol (shocked trembling)", usage:"Extreme shock or disbelief", level:"intermediate"},
  {expression:"ㅗㅜㅑ", meaning:"owa (wow)", usage:"Expressing amazement, like wow written with consonants", level:"intermediate"},
  {expression:"ㄹㅇ", meaning:"real (for real)", usage:"Emphasizing something is true or real", level:"intermediate"},
  {expression:"ㅇㄱㄹㅇ", meaning:"this is real (igeo real)", usage:"Strongly confirming something is genuine", level:"advanced"},
  {expression:"ㄱㅊ", meaning:"gwaenchana (it's okay)", usage:"Quick reassurance that things are fine", level:"intermediate"},
  {expression:"ㅇㄷ", meaning:"eodi (where)", usage:"Asking location in the quickest way", level:"intermediate"},
  {expression:"ㄱㄱ", meaning:"go go (let's go)", usage:"Expressing enthusiasm to proceed", level:"basic"},
  {expression:"ㅃ", meaning:"ppai (bye)", usage:"Ultra-short goodbye", level:"basic"},
  {expression:"ㄱㅂ", meaning:"gam-bae (cheers)", usage:"Abbreviated cheers, used for drinks", level:"intermediate"},
  {expression:"넹", meaning:"ne (yes, cute version)", usage:"Cute/soft way to say yes", level:"basic"},
  {expression:"당근이지", meaning:"of course (danggeun = carrot = dang-yeon)", usage:"Wordplay: carrot sounds like 'of course' in Korean", level:"advanced"},
  {expression:"읭?", meaning:"euing? (huh?)", usage:"Cute way to express confusion", level:"basic"},
  {expression:"웅", meaning:"ung (yeah)", usage:"Cute, casual yes/agreement", level:"basic"},
  {expression:"ㅠㅅㅠ", meaning:"cute crying face", usage:"Sad but in a cute way, like puppy eyes", level:"intermediate"}
];

// 5. K-POP Lyrics Fill-in-the-Blank Game
var kpopLyrics = [
  {
    song: "Dynamite",
    artist: "BTS",
    line: "'Cause I-I-I'm in the stars tonight",
    koreanLine: "오늘 밤 나는 ___에 있어",
    answer: "별",
    hint: "They twinkle in the night sky",
    fullKorean: "오늘 밤 나는 별에 있어"
  },
  {
    song: "Spring Day",
    artist: "BTS",
    line: "I miss you, when I say that I miss you more",
    koreanLine: "보고 싶다 이렇게 말하니까 더 ___",
    answer: "보고 싶다",
    hint: "Feeling of wanting to see someone",
    fullKorean: "보고 싶다 이렇게 말하니까 더 보고 싶다"
  },
  {
    song: "Butter",
    artist: "BTS",
    line: "Smooth like butter, like a criminal undercover",
    koreanLine: "___처럼 부드러워",
    answer: "버터",
    hint: "A spread you put on toast",
    fullKorean: "버터처럼 부드러워"
  },
  {
    song: "DDU-DU DDU-DU",
    artist: "BLACKPINK",
    line: "Hit you with that DDU-DU DDU-DU",
    koreanLine: "___로 쏴 뚜두뚜두",
    answer: "총",
    hint: "A weapon that shoots",
    fullKorean: "총으로 쏴 뚜두뚜두"
  },
  {
    song: "How You Like That",
    artist: "BLACKPINK",
    line: "Look at you, now look at me",
    koreanLine: "___를 봐 이제 나를 봐",
    answer: "너",
    hint: "The word for 'you' in Korean",
    fullKorean: "너를 봐 이제 나를 봐"
  },
  {
    song: "Hype Boy",
    artist: "NewJeans",
    line: "I just want you to be my only love",
    koreanLine: "너만이 나의 유일한 ___이길",
    answer: "사랑",
    hint: "The strongest feeling between two people",
    fullKorean: "너만이 나의 유일한 사랑이길"
  },
  {
    song: "Super Shy",
    artist: "NewJeans",
    line: "I'm super shy, super shy",
    koreanLine: "나는 진짜 ___, 진짜 ___",
    answer: "수줍어",
    hint: "Feeling embarrassed or bashful",
    fullKorean: "나는 진짜 수줍어, 진짜 수줍어"
  },
  {
    song: "Next Level",
    artist: "aespa",
    line: "I'm on the next level",
    koreanLine: "나는 다음 ___에 있어",
    answer: "단계",
    hint: "A step or stage in progress",
    fullKorean: "나는 다음 단계에 있어"
  },
  {
    song: "Supernova",
    artist: "aespa",
    line: "I'm like a supernova",
    koreanLine: "나는 ___처럼 빛나",
    answer: "초신성",
    hint: "An exploding star",
    fullKorean: "나는 초신성처럼 빛나"
  },
  {
    song: "God's Menu",
    artist: "Stray Kids",
    line: "We bring the fire to the table",
    koreanLine: "___에 불을 지펴",
    answer: "식탁",
    hint: "Where you eat meals",
    fullKorean: "식탁에 불을 지펴"
  },
  {
    song: "LALALALA",
    artist: "Stray Kids",
    line: "Shout out loud LALALALA",
    koreanLine: "크게 ___쳐 라라라라",
    answer: "소리",
    hint: "What comes from your mouth when you yell",
    fullKorean: "크게 소리쳐 라라라라"
  },
  {
    song: "LOVE DIVE",
    artist: "IVE",
    line: "Narcissistic, my god I love it",
    koreanLine: "___에 빠져드는 기분",
    answer: "사랑",
    hint: "A feeling of deep affection",
    fullKorean: "사랑에 빠져드는 기분"
  },
  {
    song: "TOMBOY",
    artist: "(G)I-DLE",
    line: "I'm not a doll, I'm a tomboy",
    koreanLine: "나는 ___이 아니야",
    answer: "인형",
    hint: "A toy that looks like a person",
    fullKorean: "나는 인형이 아니야"
  },
  {
    song: "Queencard",
    artist: "(G)I-DLE",
    line: "I am the queen card",
    koreanLine: "나는 ___카드야",
    answer: "여왕",
    hint: "The female ruler of a kingdom",
    fullKorean: "나는 여왕카드야"
  },
  {
    song: "Super",
    artist: "SEVENTEEN",
    line: "Going Super, going higher",
    koreanLine: "더 ___이 날아가",
    answer: "높이",
    hint: "The opposite of low",
    fullKorean: "더 높이 날아가"
  },
  {
    song: "Very Nice",
    artist: "SEVENTEEN",
    line: "Oh my! Very nice!",
    koreanLine: "아주 ___!",
    answer: "좋아",
    hint: "Expression for liking something",
    fullKorean: "아주 좋아!"
  },
  {
    song: "Panorama",
    artist: "IZ*ONE",
    line: "All of our memories, like a panorama",
    koreanLine: "우리의 모든 ___이 파노라마처럼",
    answer: "추억",
    hint: "Things you remember from the past",
    fullKorean: "우리의 모든 추억이 파노라마처럼"
  },
  {
    song: "ANTIFRAGILE",
    artist: "LE SSERAFIM",
    line: "I'm antifragile, antifragile",
    koreanLine: "나는 ___하지 않아",
    answer: "깨지지",
    hint: "The opposite of breaking",
    fullKorean: "나는 깨지지 않아"
  },
  {
    song: "After LIKE",
    artist: "IVE",
    line: "After like, after love",
    koreanLine: "좋아함 다음은 ___",
    answer: "사랑",
    hint: "A feeling deeper than liking",
    fullKorean: "좋아함 다음은 사랑"
  },
  {
    song: "FEARLESS",
    artist: "LE SSERAFIM",
    line: "I'm fearless",
    koreanLine: "나는 ___이 없어",
    answer: "두려움",
    hint: "The feeling of being scared",
    fullKorean: "나는 두려움이 없어"
  },
  {
    song: "Magnetic",
    artist: "ILLIT",
    line: "Like a magnet pulling me to you",
    koreanLine: "___처럼 너에게 끌려",
    answer: "자석",
    hint: "An object that attracts metal",
    fullKorean: "자석처럼 너에게 끌려"
  },
  {
    song: "Cupid",
    artist: "FIFTY FIFTY",
    line: "I'm feeling like Cupid",
    koreanLine: "나는 ___같은 기분이야",
    answer: "큐피드",
    hint: "The angel of love with a bow and arrow",
    fullKorean: "나는 큐피드같은 기분이야"
  }
];

// 6. Grammar Patterns
var grammarPatterns = [
  {
    pattern: "-아/어요",
    name: "Polite present tense",
    explanation: "Used to make verbs polite in present tense. Add -아요 after bright vowels (ㅏ, ㅗ), -어요 after dark vowels.",
    examples: [
      {base:"가다", conjugated:"가요", english:"go"},
      {base:"먹다", conjugated:"먹어요", english:"eat"},
      {base:"하다", conjugated:"해요", english:"do"}
    ],
    level: "beginner"
  },
  {
    pattern: "-ㅂ니다/습니다",
    name: "Formal polite ending",
    explanation: "The most formal speech level. Add -ㅂ니다 after vowels, -습니다 after consonants.",
    examples: [
      {base:"가다", conjugated:"갑니다", english:"go (formal)"},
      {base:"먹다", conjugated:"먹습니다", english:"eat (formal)"},
      {base:"있다", conjugated:"있습니다", english:"exist (formal)"}
    ],
    level: "beginner"
  },
  {
    pattern: "-고 싶다",
    name: "Want to do",
    explanation: "Express desire to do something. Attach -고 싶다 to the verb stem.",
    examples: [
      {base:"가다", conjugated:"가고 싶어요", english:"want to go"},
      {base:"먹다", conjugated:"먹고 싶어요", english:"want to eat"},
      {base:"보다", conjugated:"보고 싶어요", english:"want to see / miss someone"}
    ],
    level: "beginner"
  },
  {
    pattern: "-(으)ㄹ 수 있다",
    name: "Can do / Able to",
    explanation: "Express ability or possibility. Add -ㄹ 수 있다 after vowels, -을 수 있다 after consonants.",
    examples: [
      {base:"가다", conjugated:"갈 수 있어요", english:"can go"},
      {base:"먹다", conjugated:"먹을 수 있어요", english:"can eat"},
      {base:"하다", conjugated:"할 수 있어요", english:"can do"}
    ],
    level: "beginner"
  },
  {
    pattern: "-아/어서",
    name: "Because / So (reason)",
    explanation: "Connect two clauses where the first is the reason for the second.",
    examples: [
      {base:"배고프다", conjugated:"배고파서 밥 먹었어요", english:"I was hungry so I ate"},
      {base:"피곤하다", conjugated:"피곤해서 집에 갔어요", english:"I was tired so I went home"},
      {base:"좋다", conjugated:"날씨가 좋아서 산책했어요", english:"The weather was nice so I took a walk"}
    ],
    level: "intermediate"
  },
  {
    pattern: "-지만",
    name: "But / However",
    explanation: "Connect contrasting clauses. Similar to 'but' in English.",
    examples: [
      {base:"비싸다", conjugated:"비싸지만 맛있어요", english:"It's expensive but delicious"},
      {base:"어렵다", conjugated:"어렵지만 재미있어요", english:"It's difficult but fun"},
      {base:"춥다", conjugated:"춥지만 나갈 거예요", english:"It's cold but I'll go out"}
    ],
    level: "intermediate"
  },
  {
    pattern: "-때문에",
    name: "Because of",
    explanation: "Express cause using a noun. Noun + 때문에.",
    examples: [
      {base:"비", conjugated:"비 때문에 못 갔어요", english:"I couldn't go because of rain"},
      {base:"시험", conjugated:"시험 때문에 바빠요", english:"I'm busy because of exams"},
      {base:"너", conjugated:"너 때문에 웃어", english:"I smile because of you"}
    ],
    level: "intermediate"
  },
  {
    pattern: "-고",
    name: "And (connecting actions)",
    explanation: "Connect two actions or descriptions. Similar to 'and then'.",
    examples: [
      {base:"씻다", conjugated:"씻고 자요", english:"I wash and then sleep"},
      {base:"먹다", conjugated:"밥을 먹고 커피를 마셔요", english:"I eat rice and then drink coffee"},
      {base:"크다", conjugated:"크고 넓어요", english:"It's big and wide"}
    ],
    level: "beginner"
  },
  {
    pattern: "-거나",
    name: "Or (alternatives)",
    explanation: "Present alternatives between actions. Similar to 'or' in English.",
    examples: [
      {base:"보다", conjugated:"영화를 보거나 책을 읽어요", english:"I watch movies or read books"},
      {base:"가다", conjugated:"카페에 가거나 집에 있어요", english:"I go to a cafe or stay home"},
      {base:"먹다", conjugated:"밥을 먹거나 빵을 먹어요", english:"I eat rice or eat bread"}
    ],
    level: "intermediate"
  },
  {
    pattern: "-(으)면",
    name: "If / When (conditional)",
    explanation: "Express conditions. Add -면 after vowels, -으면 after consonants.",
    examples: [
      {base:"가다", conjugated:"가면 좋겠어요", english:"It would be nice if I go"},
      {base:"먹다", conjugated:"많이 먹으면 배 아파요", english:"If you eat a lot, your stomach hurts"},
      {base:"시간이 있다", conjugated:"시간이 있으면 만나요", english:"If you have time, let's meet"}
    ],
    level: "intermediate"
  },
  {
    pattern: "-는/은/ㄴ (topic marker)",
    name: "Topic particle",
    explanation: "Mark the topic of a sentence. -은 after consonants, -는 after vowels.",
    examples: [
      {base:"저", conjugated:"저는 학생이에요", english:"I am a student (as for me)"},
      {base:"이것", conjugated:"이것은 책이에요", english:"This is a book (as for this)"},
      {base:"한국어", conjugated:"한국어는 재미있어요", english:"Korean is fun (as for Korean)"}
    ],
    level: "beginner"
  },
  {
    pattern: "-을/를 (object marker)",
    name: "Object particle",
    explanation: "Mark the object of a verb. -을 after consonants, -를 after vowels.",
    examples: [
      {base:"밥", conjugated:"밥을 먹어요", english:"I eat rice"},
      {base:"커피", conjugated:"커피를 마셔요", english:"I drink coffee"},
      {base:"영화", conjugated:"영화를 봐요", english:"I watch a movie"}
    ],
    level: "beginner"
  },
  {
    pattern: "-에서",
    name: "At/In (location of action)",
    explanation: "Indicate where an action takes place. Attached to location nouns.",
    examples: [
      {base:"학교", conjugated:"학교에서 공부해요", english:"I study at school"},
      {base:"집", conjugated:"집에서 쉬어요", english:"I rest at home"},
      {base:"카페", conjugated:"카페에서 만나요", english:"Let's meet at the cafe"}
    ],
    level: "beginner"
  },
  {
    pattern: "-한테/에게",
    name: "To (a person)",
    explanation: "Indicate the recipient. -한테 is casual, -에게 is formal.",
    examples: [
      {base:"친구", conjugated:"친구한테 전화했어요", english:"I called my friend"},
      {base:"선생님", conjugated:"선생님에게 질문했어요", english:"I asked the teacher a question"},
      {base:"엄마", conjugated:"엄마한테 말했어요", english:"I told my mom"}
    ],
    level: "intermediate"
  },
  {
    pattern: "-지 않다",
    name: "Negation (not)",
    explanation: "Negate verbs and adjectives. Verb stem + -지 않다.",
    examples: [
      {base:"가다", conjugated:"가지 않아요", english:"I don't go"},
      {base:"좋다", conjugated:"좋지 않아요", english:"It's not good"},
      {base:"먹다", conjugated:"먹지 않아요", english:"I don't eat"}
    ],
    level: "beginner"
  },
  {
    pattern: "-았/었 (past tense)",
    name: "Past tense",
    explanation: "Express past actions. -았 after bright vowels, -었 after dark vowels.",
    examples: [
      {base:"가다", conjugated:"갔어요", english:"went"},
      {base:"먹다", conjugated:"먹었어요", english:"ate"},
      {base:"하다", conjugated:"했어요", english:"did"}
    ],
    level: "beginner"
  },
  {
    pattern: "-(으)ㄹ 거예요",
    name: "Future tense (will)",
    explanation: "Express future plans or intentions.",
    examples: [
      {base:"가다", conjugated:"갈 거예요", english:"will go"},
      {base:"먹다", conjugated:"먹을 거예요", english:"will eat"},
      {base:"공부하다", conjugated:"공부할 거예요", english:"will study"}
    ],
    level: "intermediate"
  },
  {
    pattern: "-는 중이다",
    name: "In the middle of doing",
    explanation: "Express an action currently in progress.",
    examples: [
      {base:"먹다", conjugated:"먹는 중이에요", english:"I'm in the middle of eating"},
      {base:"공부하다", conjugated:"공부하는 중이에요", english:"I'm in the middle of studying"},
      {base:"일하다", conjugated:"일하는 중이에요", english:"I'm in the middle of working"}
    ],
    level: "intermediate"
  },
  {
    pattern: "-아/어 보다",
    name: "Try doing",
    explanation: "Express trying or experiencing something.",
    examples: [
      {base:"먹다", conjugated:"먹어 봐요", english:"try eating it"},
      {base:"가다", conjugated:"가 봐요", english:"try going"},
      {base:"입다", conjugated:"입어 봐요", english:"try wearing it"}
    ],
    level: "intermediate"
  },
  {
    pattern: "-기 전에",
    name: "Before doing",
    explanation: "Express an action that happens before another.",
    examples: [
      {base:"자다", conjugated:"자기 전에 양치해요", english:"I brush my teeth before sleeping"},
      {base:"먹다", conjugated:"먹기 전에 손 씻어요", english:"I wash hands before eating"},
      {base:"출발하다", conjugated:"출발하기 전에 확인해요", english:"I check before departing"}
    ],
    level: "intermediate"
  },
  {
    pattern: "-(으)ㄴ 후에",
    name: "After doing",
    explanation: "Express an action that happens after another.",
    examples: [
      {base:"먹다", conjugated:"먹은 후에 산책해요", english:"I take a walk after eating"},
      {base:"졸업하다", conjugated:"졸업한 후에 취직할 거예요", english:"I'll get a job after graduating"},
      {base:"끝나다", conjugated:"끝난 후에 만나요", english:"Let's meet after it's over"}
    ],
    level: "intermediate"
  }
];

// 7. Situational Phrases
var situationalPhrases = {
  cafe: {
    name: "At a Cafe",
    icon: "coffee",
    phrases: [
      {korean:"아메리카노 한 잔 주세요", romanization:"amerikano han jan juseyo", english:"One americano please"},
      {korean:"아이스로 주세요", romanization:"aiseuro juseyo", english:"Make it iced please"},
      {korean:"뜨거운 걸로 주세요", romanization:"tteugeoun geollo juseyo", english:"Make it hot please"},
      {korean:"여기서 먹을 거예요", romanization:"yeogiseo meogeul geoyeyo", english:"I'll have it here (for here)"},
      {korean:"포장이요", romanization:"pojangiyo", english:"To go please"},
      {korean:"사이즈 업 해주세요", romanization:"saijeu eop haejuseyo", english:"Size up please"},
      {korean:"샷 추가해 주세요", romanization:"syat chugahae juseyo", english:"Add an extra shot please"},
      {korean:"Wi-Fi 비밀번호가 뭐예요?", romanization:"waipai bimilbeonhoga mwoyeyo?", english:"What's the Wi-Fi password?"},
      {korean:"카드로 결제할게요", romanization:"kadeuro gyeoljehalgeyo", english:"I'll pay by card"},
      {korean:"영수증 필요 없어요", romanization:"yeongsujeung piryo eopseoyo", english:"I don't need a receipt"}
    ]
  },
  restaurant: {
    name: "At a Restaurant",
    icon: "utensils",
    phrases: [
      {korean:"여기요! 주문할게요", romanization:"yeogiyo! jumunhalgeyo", english:"Excuse me! I'd like to order"},
      {korean:"메뉴판 좀 주세요", romanization:"menyupan jom juseyo", english:"Can I have the menu please"},
      {korean:"추천 메뉴가 뭐예요?", romanization:"chucheon menyuga mwoyeyo?", english:"What do you recommend?"},
      {korean:"이거 하나 주세요", romanization:"igeo hana juseyo", english:"One of this please"},
      {korean:"물 좀 더 주세요", romanization:"mul jom deo juseyo", english:"More water please"},
      {korean:"맵지 않게 해주세요", romanization:"maepji anke haejuseyo", english:"Please make it not spicy"},
      {korean:"계산서 주세요", romanization:"gyesanseo juseyo", english:"Check please"},
      {korean:"따로 계산해 주세요", romanization:"ttaro gyesanhae juseyo", english:"Separate checks please"},
      {korean:"잘 먹겠습니다", romanization:"jal meokgesseumnida", english:"I will eat well (said before eating)"},
      {korean:"잘 먹었습니다", romanization:"jal meogeosseumnida", english:"I ate well (said after eating)"}
    ]
  },
  shopping: {
    name: "Shopping",
    icon: "shopping-bag",
    phrases: [
      {korean:"이거 얼마예요?", romanization:"igeo eolmayeyo?", english:"How much is this?"},
      {korean:"좀 더 싼 거 있어요?", romanization:"jom deo ssan geo isseoyo?", english:"Do you have something cheaper?"},
      {korean:"다른 색깔 있어요?", romanization:"dareun saekkkal isseoyo?", english:"Do you have other colors?"},
      {korean:"입어 봐도 돼요?", romanization:"ibeo bwado dwaeyo?", english:"Can I try it on?"},
      {korean:"사이즈가 안 맞아요", romanization:"saizeuga an majayo", english:"The size doesn't fit"},
      {korean:"큰 사이즈 있어요?", romanization:"keun saijeu isseoyo?", english:"Do you have a bigger size?"},
      {korean:"교환할 수 있어요?", romanization:"gyohwanhal su isseoyo?", english:"Can I exchange this?"},
      {korean:"환불해 주세요", romanization:"hwanbulhae juseyo", english:"Please give me a refund"},
      {korean:"봉투 필요 없어요", romanization:"bongtu piryo eopseoyo", english:"I don't need a bag"},
      {korean:"할인되나요?", romanization:"harindoenayo?", english:"Is there a discount?"}
    ]
  },
  airport: {
    name: "At the Airport",
    icon: "plane",
    phrases: [
      {korean:"체크인 카운터가 어디예요?", romanization:"chekeu-in kaunteoga eodiyeyo?", english:"Where is the check-in counter?"},
      {korean:"창가 좌석으로 주세요", romanization:"changga jwaseoguro juseyo", english:"Window seat please"},
      {korean:"통로 좌석으로 주세요", romanization:"tongro jwaseoguro juseyo", english:"Aisle seat please"},
      {korean:"탑승구가 어디예요?", romanization:"tapseungguga eodiyeyo?", english:"Where is the boarding gate?"},
      {korean:"짐을 맡기고 싶어요", romanization:"jimeul matgigo sipeoyo", english:"I'd like to check my luggage"},
      {korean:"면세점이 어디예요?", romanization:"myeonsejeomi eodiyeyo?", english:"Where is the duty-free shop?"},
      {korean:"환전하고 싶어요", romanization:"hwanjeonhago sipeoyo", english:"I'd like to exchange money"},
      {korean:"비행기가 연착됐어요?", romanization:"bihaenggiga yeonchakdwaesseoyo?", english:"Is the flight delayed?"},
      {korean:"입국 심사대가 어디예요?", romanization:"ipguk simsadaega eodiyeyo?", english:"Where is immigration?"},
      {korean:"관광 목적으로 왔어요", romanization:"gwangwang mokjeogeuro wasseoyo", english:"I came for sightseeing"}
    ]
  },
  hotel: {
    name: "At a Hotel",
    icon: "bed",
    phrases: [
      {korean:"예약했어요", romanization:"yeyakhaesseoyo", english:"I have a reservation"},
      {korean:"체크인하고 싶어요", romanization:"chekeuinhago sipeoyo", english:"I'd like to check in"},
      {korean:"체크아웃 몇 시예요?", romanization:"chekeuaus myeot siyeyo?", english:"What time is checkout?"},
      {korean:"방을 바꿀 수 있어요?", romanization:"bangeul bakkul su isseoyo?", english:"Can I change rooms?"},
      {korean:"수건 더 주세요", romanization:"sugeon deo juseyo", english:"More towels please"},
      {korean:"에어컨이 안 돼요", romanization:"eeokoni an dwaeyo", english:"The air conditioning doesn't work"},
      {korean:"조식은 몇 시부터예요?", romanization:"josigeun myeot sibuteo yeyo?", english:"What time does breakfast start?"},
      {korean:"짐을 맡길 수 있어요?", romanization:"jimeul matgil su isseoyo?", english:"Can I leave my luggage?"},
      {korean:"택시 불러 주세요", romanization:"taeksi bulleo juseyo", english:"Please call a taxi for me"},
      {korean:"늦은 체크아웃 가능해요?", romanization:"neujeun chekeuaus ganeunghaeyo?", english:"Is late checkout possible?"}
    ]
  },
  subway: {
    name: "On the Subway",
    icon: "train",
    phrases: [
      {korean:"이 열차는 어디로 가요?", romanization:"i yeolchaneun eodiro gayo?", english:"Where does this train go?"},
      {korean:"몇 호선을 타야 해요?", romanization:"myeot hoseon-eul taya haeyo?", english:"Which line should I take?"},
      {korean:"환승은 어디서 해요?", romanization:"hwanseungeun eodiseo haeyo?", english:"Where do I transfer?"},
      {korean:"다음 역이 어디예요?", romanization:"daeum yeogi eodiyeyo?", english:"What's the next station?"},
      {korean:"교통카드 충전하고 싶어요", romanization:"gyotongkadeu chungjeonhago sipeoyo", english:"I want to recharge my transit card"},
      {korean:"출구가 어디예요?", romanization:"chulguga eodiyeyo?", english:"Where is the exit?"},
      {korean:"몇 번 출구로 나가야 해요?", romanization:"myeot beon chulguro nagaya haeyo?", english:"Which exit should I take?"},
      {korean:"막차가 몇 시예요?", romanization:"makchaga myeot siyeyo?", english:"What time is the last train?"},
      {korean:"이 역에서 내려야 해요", romanization:"i yeogeseo naeryeoya haeyo", english:"I need to get off at this station"},
      {korean:"길 좀 알려주세요", romanization:"gil jom allyeojuseyo", english:"Please help me with directions"}
    ]
  },
  hospital: {
    name: "At the Hospital",
    icon: "hospital",
    phrases: [
      {korean:"아파서 왔어요", romanization:"apaseo wasseoyo", english:"I came because I'm sick"},
      {korean:"머리가 아파요", romanization:"meoriga apayo", english:"I have a headache"},
      {korean:"배가 아파요", romanization:"baega apayo", english:"I have a stomachache"},
      {korean:"열이 나요", romanization:"yeori nayo", english:"I have a fever"},
      {korean:"기침이 나요", romanization:"gichimi nayo", english:"I have a cough"},
      {korean:"알레르기가 있어요", romanization:"allereugi-ga isseoyo", english:"I have allergies"},
      {korean:"약 처방해 주세요", romanization:"yak cheobang hae juseyo", english:"Please prescribe medicine"},
      {korean:"보험 있어요", romanization:"boheom isseoyo", english:"I have insurance"},
      {korean:"언제 다시 와야 해요?", romanization:"eonje dasi waya haeyo?", english:"When should I come back?"},
      {korean:"약국이 어디예요?", romanization:"yakgugi eodiyeyo?", english:"Where is the pharmacy?"}
    ]
  },
  school: {
    name: "At School",
    icon: "book",
    phrases: [
      {korean:"수업이 몇 시에 시작해요?", romanization:"sueopi myeot sie sijakaeyo?", english:"What time does class start?"},
      {korean:"숙제가 뭐예요?", romanization:"sukjega mwoyeyo?", english:"What's the homework?"},
      {korean:"질문 있어요", romanization:"jilmun isseoyo", english:"I have a question"},
      {korean:"다시 한번 설명해 주세요", romanization:"dasi hanbeon seolmyeonghae juseyo", english:"Please explain one more time"},
      {korean:"시험이 언제예요?", romanization:"siheomi eonjeyeyo?", english:"When is the exam?"},
      {korean:"이해가 안 돼요", romanization:"ihaega an dwaeyo", english:"I don't understand"},
      {korean:"같이 공부할래요?", romanization:"gachi gongbuhallaego?", english:"Shall we study together?"},
      {korean:"도서관이 어디예요?", romanization:"doseogwani eodiyeyo?", english:"Where is the library?"},
      {korean:"출석 확인해 주세요", romanization:"chulseok hwaginhae juseyo", english:"Please check attendance"},
      {korean:"결석하겠습니다", romanization:"gyeolseokhagesseumnida", english:"I will be absent"}
    ]
  },
  office: {
    name: "At the Office",
    icon: "briefcase",
    phrases: [
      {korean:"회의가 몇 시예요?", romanization:"hoeiga myeot siyeyo?", english:"What time is the meeting?"},
      {korean:"보고서 제출했어요", romanization:"bogoseo jechulhaesseoyo", english:"I submitted the report"},
      {korean:"오늘 야근해야 해요", romanization:"oneul yageunhaeya haeyo", english:"I have to work overtime today"},
      {korean:"점심 같이 먹을까요?", romanization:"jeomsim gachi meogeulkkayo?", english:"Shall we have lunch together?"},
      {korean:"출장 가야 해요", romanization:"chuljang gaya haeyo", english:"I have to go on a business trip"},
      {korean:"메일 확인해 주세요", romanization:"meil hwaginhae juseyo", english:"Please check your email"},
      {korean:"연차 쓰고 싶어요", romanization:"yeoncha sseugo sipeoyo", english:"I'd like to use my annual leave"},
      {korean:"다음 주에 마감이에요", romanization:"daeum jue magamieyo", english:"The deadline is next week"},
      {korean:"회식이 있어요", romanization:"hoesigi isseoyo", english:"There's a company dinner"},
      {korean:"수고하셨습니다", romanization:"sugohasyeosseumnida", english:"Good work (said when leaving office)"}
    ]
  },
  convenienceStore: {
    name: "At the Convenience Store",
    icon: "store",
    phrases: [
      {korean:"도시락 데워 주세요", romanization:"dosirak dewo juseyo", english:"Please heat up the lunchbox"},
      {korean:"봉투 주세요", romanization:"bongtu juseyo", english:"Bag please"},
      {korean:"젓가락 주세요", romanization:"jeotgarak juseyo", english:"Chopsticks please"},
      {korean:"이거 1+1이에요?", romanization:"igeo wanpeulleoseu wanieyo?", english:"Is this buy one get one free?"},
      {korean:"교통카드 충전해 주세요", romanization:"gyotong kadeu chungjeonhae juseyo", english:"Please recharge my transit card"},
      {korean:"ATM 어디 있어요?", romanization:"eitiemu eodi isseoyo?", english:"Where is the ATM?"},
      {korean:"화장실 있어요?", romanization:"hwajangsil isseoyo?", english:"Is there a restroom?"},
      {korean:"현금으로 할게요", romanization:"hyeongeumneuro halgeyo", english:"I'll pay with cash"},
      {korean:"영수증 주세요", romanization:"yeongsujeung juseyo", english:"Receipt please"},
      {korean:"삼각김밥 추천해 주세요", romanization:"samgakgimbap chucheonhae juseyo", english:"Please recommend a triangle kimbap"}
    ]
  }
};

// 8. Korean Food Recipes with Cooking Vocabulary
var kfoodRecipes = [
  {
    name: "김치찌개",
    nameRoman: "kimchi-jjigae",
    nameEnglish: "Kimchi Stew",
    icon: "pot",
    ingredients: [
      {korean:"김치", romanization:"gimchi", english:"kimchi"},
      {korean:"두부", romanization:"dubu", english:"tofu"},
      {korean:"돼지고기", romanization:"dwaejigogi", english:"pork"},
      {korean:"대파", romanization:"daepa", english:"green onion"},
      {korean:"고춧가루", romanization:"gochutgaru", english:"red pepper flakes"},
      {korean:"참기름", romanization:"chamgireum", english:"sesame oil"}
    ],
    cookingWords: [
      {korean:"끓이다", romanization:"kkeurida", english:"to boil"},
      {korean:"썰다", romanization:"sseolda", english:"to slice"},
      {korean:"볶다", romanization:"bokda", english:"to stir-fry"},
      {korean:"넣다", romanization:"neota", english:"to add/put in"}
    ]
  },
  {
    name: "비빔밥",
    nameRoman: "bibimbap",
    nameEnglish: "Mixed Rice",
    icon: "bowl",
    ingredients: [
      {korean:"밥", romanization:"bap", english:"rice"},
      {korean:"시금치", romanization:"sigeumchi", english:"spinach"},
      {korean:"당근", romanization:"danggeun", english:"carrot"},
      {korean:"콩나물", romanization:"kongnamul", english:"bean sprouts"},
      {korean:"계란", romanization:"gyeran", english:"egg"},
      {korean:"고추장", romanization:"gochujang", english:"red pepper paste"}
    ],
    cookingWords: [
      {korean:"비비다", romanization:"bibida", english:"to mix"},
      {korean:"데치다", romanization:"dechida", english:"to blanch"},
      {korean:"무치다", romanization:"muchida", english:"to season vegetables"},
      {korean:"올리다", romanization:"ollida", english:"to place on top"}
    ]
  },
  {
    name: "불고기",
    nameRoman: "bulgogi",
    nameEnglish: "Fire Meat (Marinated Beef)",
    icon: "meat",
    ingredients: [
      {korean:"소고기", romanization:"sogogi", english:"beef"},
      {korean:"간장", romanization:"ganjang", english:"soy sauce"},
      {korean:"설탕", romanization:"seoltang", english:"sugar"},
      {korean:"배", romanization:"bae", english:"pear"},
      {korean:"마늘", romanization:"maneul", english:"garlic"},
      {korean:"양파", romanization:"yangpa", english:"onion"}
    ],
    cookingWords: [
      {korean:"재우다", romanization:"jaeuda", english:"to marinate"},
      {korean:"굽다", romanization:"gupda", english:"to grill"},
      {korean:"다지다", romanization:"dajida", english:"to mince"},
      {korean:"섞다", romanization:"seokda", english:"to mix together"}
    ]
  },
  {
    name: "떡볶이",
    nameRoman: "tteokbokki",
    nameEnglish: "Spicy Rice Cakes",
    icon: "chili",
    ingredients: [
      {korean:"떡", romanization:"tteok", english:"rice cake"},
      {korean:"고추장", romanization:"gochujang", english:"red pepper paste"},
      {korean:"어묵", romanization:"eomuk", english:"fish cake"},
      {korean:"대파", romanization:"daepa", english:"green onion"},
      {korean:"설탕", romanization:"seoltang", english:"sugar"},
      {korean:"물", romanization:"mul", english:"water"}
    ],
    cookingWords: [
      {korean:"끓이다", romanization:"kkeurida", english:"to boil"},
      {korean:"졸이다", romanization:"jorida", english:"to reduce/simmer"},
      {korean:"저어주다", romanization:"jeoeo-juda", english:"to stir"},
      {korean:"불리다", romanization:"bullida", english:"to soak"}
    ]
  },
  {
    name: "삼겹살",
    nameRoman: "samgyeopsal",
    nameEnglish: "Grilled Pork Belly",
    icon: "fire",
    ingredients: [
      {korean:"삼겹살", romanization:"samgyeopsal", english:"pork belly"},
      {korean:"상추", romanization:"sangchu", english:"lettuce"},
      {korean:"깻잎", romanization:"kkaennip", english:"perilla leaves"},
      {korean:"쌈장", romanization:"ssamjang", english:"dipping paste"},
      {korean:"마늘", romanization:"maneul", english:"garlic"},
      {korean:"소금", romanization:"sogeum", english:"salt"}
    ],
    cookingWords: [
      {korean:"굽다", romanization:"gupda", english:"to grill"},
      {korean:"싸먹다", romanization:"ssameokkda", english:"to wrap and eat"},
      {korean:"자르다", romanization:"jareuda", english:"to cut"},
      {korean:"찍어먹다", romanization:"jjigeo-meokda", english:"to dip and eat"}
    ]
  },
  {
    name: "김밥",
    nameRoman: "gimbap",
    nameEnglish: "Korean Seaweed Rice Roll",
    icon: "roll",
    ingredients: [
      {korean:"김", romanization:"gim", english:"seaweed/laver"},
      {korean:"밥", romanization:"bap", english:"rice"},
      {korean:"단무지", romanization:"danmuji", english:"pickled radish"},
      {korean:"햄", romanization:"haem", english:"ham"},
      {korean:"시금치", romanization:"sigeumchi", english:"spinach"},
      {korean:"계란", romanization:"gyeran", english:"egg"}
    ],
    cookingWords: [
      {korean:"말다", romanization:"malda", english:"to roll"},
      {korean:"펴다", romanization:"pyeoda", english:"to spread"},
      {korean:"썰다", romanization:"sseolda", english:"to slice"},
      {korean:"볶다", romanization:"bokda", english:"to stir-fry"}
    ]
  },
  {
    name: "잡채",
    nameRoman: "japchae",
    nameEnglish: "Glass Noodle Stir-fry",
    icon: "noodles",
    ingredients: [
      {korean:"당면", romanization:"dangmyeon", english:"glass noodles"},
      {korean:"시금치", romanization:"sigeumchi", english:"spinach"},
      {korean:"당근", romanization:"danggeun", english:"carrot"},
      {korean:"버섯", romanization:"beoseot", english:"mushroom"},
      {korean:"소고기", romanization:"sogogi", english:"beef"},
      {korean:"간장", romanization:"ganjang", english:"soy sauce"}
    ],
    cookingWords: [
      {korean:"삶다", romanization:"samda", english:"to boil/cook noodles"},
      {korean:"볶다", romanization:"bokda", english:"to stir-fry"},
      {korean:"채썰다", romanization:"chaesseolda", english:"to julienne"},
      {korean:"버무리다", romanization:"beomurida", english:"to toss/mix together"}
    ]
  },
  {
    name: "된장찌개",
    nameRoman: "doenjang-jjigae",
    nameEnglish: "Soybean Paste Stew",
    icon: "soup",
    ingredients: [
      {korean:"된장", romanization:"doenjang", english:"soybean paste"},
      {korean:"두부", romanization:"dubu", english:"tofu"},
      {korean:"애호박", romanization:"aehobak", english:"zucchini"},
      {korean:"감자", romanization:"gamja", english:"potato"},
      {korean:"양파", romanization:"yangpa", english:"onion"},
      {korean:"고추", romanization:"gochu", english:"chili pepper"}
    ],
    cookingWords: [
      {korean:"끓이다", romanization:"kkeurida", english:"to boil"},
      {korean:"풀다", romanization:"pulda", english:"to dissolve"},
      {korean:"우려내다", romanization:"uryeonaeda", english:"to extract stock/broth"},
      {korean:"넣다", romanization:"neota", english:"to add/put in"}
    ]
  },
  {
    name: "갈비",
    nameRoman: "galbi",
    nameEnglish: "Korean BBQ Short Ribs",
    icon: "ribs",
    ingredients: [
      {korean:"갈비", romanization:"galbi", english:"short ribs"},
      {korean:"간장", romanization:"ganjang", english:"soy sauce"},
      {korean:"배", romanization:"bae", english:"pear"},
      {korean:"설탕", romanization:"seoltang", english:"sugar"},
      {korean:"참기름", romanization:"chamgireum", english:"sesame oil"},
      {korean:"후추", romanization:"huchu", english:"black pepper"}
    ],
    cookingWords: [
      {korean:"재우다", romanization:"jaeuda", english:"to marinate"},
      {korean:"굽다", romanization:"gupda", english:"to grill"},
      {korean:"칼집을 넣다", romanization:"kaljipeul neota", english:"to score (make cuts)"},
      {korean:"핏물을 빼다", romanization:"pinmureul ppaeda", english:"to soak out blood"}
    ]
  },
  {
    name: "냉면",
    nameRoman: "naengmyeon",
    nameEnglish: "Cold Noodles",
    icon: "snowflake",
    ingredients: [
      {korean:"면", romanization:"myeon", english:"noodles"},
      {korean:"육수", romanization:"yuksu", english:"broth"},
      {korean:"오이", romanization:"oi", english:"cucumber"},
      {korean:"삶은 계란", romanization:"salmeun gyeran", english:"boiled egg"},
      {korean:"식초", romanization:"sikcho", english:"vinegar"},
      {korean:"겨자", romanization:"gyeoja", english:"mustard"}
    ],
    cookingWords: [
      {korean:"삶다", romanization:"samda", english:"to boil"},
      {korean:"헹구다", romanization:"hengguda", english:"to rinse"},
      {korean:"채썰다", romanization:"chaesseolda", english:"to julienne"},
      {korean:"차게 하다", romanization:"chage hada", english:"to chill"}
    ]
  },
  {
    name: "파전",
    nameRoman: "pajeon",
    nameEnglish: "Green Onion Pancake",
    icon: "pancake",
    ingredients: [
      {korean:"파", romanization:"pa", english:"green onion"},
      {korean:"밀가루", romanization:"milgaru", english:"flour"},
      {korean:"계란", romanization:"gyeran", english:"egg"},
      {korean:"물", romanization:"mul", english:"water"},
      {korean:"해물", romanization:"haemul", english:"seafood"},
      {korean:"식용유", romanization:"sigyongyu", english:"cooking oil"}
    ],
    cookingWords: [
      {korean:"반죽하다", romanization:"banjukhada", english:"to make batter"},
      {korean:"부치다", romanization:"buchida", english:"to pan-fry"},
      {korean:"뒤집다", romanization:"dwijipda", english:"to flip"},
      {korean:"썰다", romanization:"sseolda", english:"to slice"}
    ]
  }
];

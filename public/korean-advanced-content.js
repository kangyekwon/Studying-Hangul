/**
 * K-POP Korean Learning - Advanced Content Module
 * TOPIK practice, proverbs, grammar patterns, pronunciation rules.
 * Requires: security-utils.js, main-app.js, content-data.js
 */

// ============================================================
// 1. TOPIK I Questions (Beginner, 32 questions)
// ============================================================
var topikIQuestions = [
  {question:"다음 중 '학교'의 뜻은?",questionEn:"What does '학교' mean?",options:["School","Hospital","Library","Store"],answer:0,explanation:"학교(hakgyo) means school.",type:"vocabulary"},
  {question:"'감사합니다'는 영어로?",questionEn:"'감사합니다' in English?",options:["Sorry","Hello","Thank you","Goodbye"],answer:2,explanation:"감사합니다 means 'thank you' (formal).",type:"vocabulary"},
  {question:"'사랑'의 뜻은?",questionEn:"Meaning of '사랑'?",options:["Friend","Love","Family","Time"],answer:1,explanation:"사랑(sarang) means love.",type:"vocabulary"},
  {question:"'음식'은 무엇입니까?",questionEn:"What is '음식'?",options:["Clothing","Music","Food","Weather"],answer:2,explanation:"음식(eumsik) means food.",type:"vocabulary"},
  {question:"'날씨'의 영어 뜻은?",questionEn:"English meaning of '날씨'?",options:["Travel","Weather","Season","News"],answer:1,explanation:"날씨(nalssi) means weather.",type:"vocabulary"},
  {question:"'의사'는 어떤 직업입니까?",questionEn:"What profession is '의사'?",options:["Teacher","Doctor","Driver","Cook"],answer:1,explanation:"의사(uisa) means doctor.",type:"vocabulary"},
  {question:"'공항'은 어디입니까?",questionEn:"What place is '공항'?",options:["Hospital","School","Airport","Market"],answer:2,explanation:"공항(gonghang) means airport.",type:"vocabulary"},
  {question:"'우유'는 무엇입니까?",questionEn:"What is '우유'?",options:["Juice","Water","Milk","Tea"],answer:2,explanation:"우유(uyu) means milk.",type:"vocabulary"},
  {question:"'월요일'은 무슨 요일?",questionEn:"What day is '월요일'?",options:["Monday","Tuesday","Wednesday","Sunday"],answer:0,explanation:"월요일(woryoil) means Monday.",type:"vocabulary"},
  {question:"'행복'의 뜻은?",questionEn:"Meaning of '행복'?",options:["Sadness","Anger","Happiness","Fear"],answer:2,explanation:"행복(haengbok) means happiness.",type:"vocabulary"},
  {question:"나___ 학생이에요. 빈칸에 알맞은 것은?",questionEn:"I ___ a student. Fill the blank.",options:["는","를","에","와"],answer:0,explanation:"는 is the topic marker after a vowel.",type:"grammar"},
  {question:"밥___ 먹어요. 알맞은 조사는?",questionEn:"I eat rice___. Correct particle?",options:["은","을","에","도"],answer:1,explanation:"을 is the object marker after a consonant.",type:"grammar"},
  {question:"학교___ 가요. 빈칸은?",questionEn:"I go ___ school. Fill the blank.",options:["를","에","은","와"],answer:1,explanation:"에 marks destination/direction.",type:"grammar"},
  {question:"'먹고 싶어요'의 뜻은?",questionEn:"Meaning of '먹고 싶어요'?",options:["I ate","I want to eat","I am eating","I will eat"],answer:1,explanation:"-고 싶다 means 'want to'.",type:"grammar"},
  {question:"'갔어요'는 '가다'의 어떤 형태?",questionEn:"'갔어요' is what form of '가다'?",options:["Present","Future","Past","Imperative"],answer:2,explanation:"갔어요 is past tense of 가다(to go).",type:"grammar"},
  {question:"'공부하고 있어요'의 뜻은?",questionEn:"Meaning of '공부하고 있어요'?",options:["I studied","I will study","I am studying","I want to study"],answer:2,explanation:"-고 있다 = progressive/continuous.",type:"grammar"},
  {question:"'같이 갈까요?'는 무슨 뜻?",questionEn:"What does '같이 갈까요?' mean?",options:["Did we go together?","Shall we go together?","We went together","Go together!"],answer:1,explanation:"-(으)ㄹ까요 suggests/proposes.",type:"grammar"},
  {question:"'걱정하지 마세요'의 뜻은?",questionEn:"'걱정하지 마세요' means?",options:["Please worry","Do not worry","I am worried","Are you worried?"],answer:1,explanation:"-지 마세요 = 'do not' (polite).",type:"grammar"},
  {question:"'비가 오면 집에 있을 거예요' - '오면'은?",questionEn:"What does '오면' mean here?",options:["Because it rains","If it rains","When it rained","It will rain"],answer:1,explanation:"-(으)면 = 'if/when' conditional.",type:"grammar"},
  {question:"'한국어를 할 수 있어요'의 뜻은?",questionEn:"Meaning of this sentence?",options:["I must speak Korean","I cannot speak Korean","I can speak Korean","I want to speak Korean"],answer:2,explanation:"-(으)ㄹ 수 있다 = 'can/able to'.",type:"grammar"},
  {question:"[메뉴판] 비빔밥 8,000원 / 김치찌개 7,000원 - 더 비싼 것은?",questionEn:"[Menu] Which is more expensive?",options:["김치찌개","비빔밥","Same price","Cannot tell"],answer:1,explanation:"비빔밥 8,000원 > 김치찌개 7,000원.",type:"reading"},
  {question:"[안내문] '영업시간: 09:00~18:00' - 저녁 7시에 갈 수 있습니까?",questionEn:"Can you go at 7 PM?",options:["Yes","No","Maybe","Only weekends"],answer:1,explanation:"18:00 = 6 PM, so 7 PM is after closing.",type:"reading"},
  {question:"'오늘은 날씨가 좋아서 공원에 갔어요' - 왜 공원에 갔어요?",questionEn:"Why did they go to the park?",options:["It was cold","The weather was nice","They were hungry","A friend called"],answer:1,explanation:"날씨가 좋아서 = because the weather was nice.",type:"reading"},
  {question:"[편지] '보고 싶어요. 빨리 만나요!' - 이 사람의 감정은?",questionEn:"What is the writer feeling?",options:["Angry","Bored","Missing someone","Scared"],answer:2,explanation:"보고 싶어요 = I miss you.",type:"reading"},
  {question:"'저는 매일 아침 7시에 일어나요' - 이 사람은 언제 일어나요?",questionEn:"When does this person wake up?",options:["7 PM","7 AM every day","Sometimes at 7","Only weekdays"],answer:1,explanation:"매일 아침 7시 = every morning at 7.",type:"reading"},
  {question:"[표지판] '금연' - 이것은 무슨 뜻?",questionEn:"What does this sign mean?",options:["No parking","No smoking","No entry","No photos"],answer:1,explanation:"금연(geumyeon) = no smoking.",type:"reading"},
  {question:"'어제 친구하고 영화를 봤어요' - 누구하고 영화를 봤어요?",questionEn:"Who did they watch a movie with?",options:["Alone","Family","Friend","Teacher"],answer:2,explanation:"친구하고 = with a friend.",type:"reading"},
  {question:"'이 가방은 너무 비싸요. 다른 것 보여 주세요.' - 왜요?",questionEn:"Why does the person want to see another bag?",options:["Too small","Too heavy","Too expensive","Too ugly"],answer:2,explanation:"너무 비싸요 = too expensive.",type:"reading"},
  {question:"'선생님'은 누구입니까?",questionEn:"Who is '선생님'?",options:["Student","Teacher","Parent","Doctor"],answer:1,explanation:"선생님(seonsaengnim) = teacher.",type:"vocabulary"},
  {question:"'전화번호'는 무엇입니까?",questionEn:"What is '전화번호'?",options:["Address","Email","Phone number","Name"],answer:2,explanation:"전화번호 = phone number.",type:"vocabulary"},
  {question:"'도서관에서 공부해요' - 어디에서?",questionEn:"Where do they study?",options:["At home","At school","At the library","At a cafe"],answer:2,explanation:"도서관에서 = at the library.",type:"reading"},
  {question:"'내일 비가 올 거예요' - 무슨 뜻?",questionEn:"What does this mean?",options:["It rained yesterday","It is raining now","It will rain tomorrow","It snowed"],answer:2,explanation:"내일 = tomorrow, -(으)ㄹ 거예요 = will.",type:"grammar"}
];

// ============================================================
// 2. TOPIK II Questions (Intermediate, 32 questions)
// ============================================================
var topikIIQuestions = [
  {question:"'무궁무진하다'의 뜻으로 알맞은 것은?",questionEn:"Meaning of '무궁무진하다'?",options:["Limitless","Dangerous","Mysterious","Boring"],answer:0,explanation:"무궁무진 = inexhaustible, limitless.",type:"vocabulary"},
  {question:"'소홀히 하다'의 뜻은?",questionEn:"Meaning of '소홀히 하다'?",options:["To be careful","To neglect","To improve","To celebrate"],answer:1,explanation:"소홀히 하다 = to neglect, be careless about.",type:"vocabulary"},
  {question:"'기여하다'는 무슨 뜻입니까?",questionEn:"What does '기여하다' mean?",options:["To contribute","To complain","To hesitate","To compete"],answer:0,explanation:"기여하다 = to contribute.",type:"vocabulary"},
  {question:"'동경하다'의 뜻은?",questionEn:"Meaning of '동경하다'?",options:["To fear","To admire/yearn for","To ignore","To regret"],answer:1,explanation:"동경하다 = to admire, yearn for, long for.",type:"vocabulary"},
  {question:"'유의하다'와 비슷한 말은?",questionEn:"Synonym of '유의하다'?",options:["주의하다","무시하다","포기하다","비교하다"],answer:0,explanation:"유의하다 = 주의하다 = to pay attention to.",type:"vocabulary"},
  {question:"'불가피하다'의 뜻은?",questionEn:"Meaning of '불가피하다'?",options:["Comfortable","Unavoidable","Simple","Dangerous"],answer:1,explanation:"불가피하다 = unavoidable, inevitable.",type:"vocabulary"},
  {question:"'일석이조'의 뜻으로 알맞은 것은?",questionEn:"Meaning of '일석이조'?",options:["Very difficult","Killing two birds with one stone","Once in a lifetime","A fresh start"],answer:1,explanation:"일석이조 = two gains from one action.",type:"vocabulary"},
  {question:"'취소하다'의 반대말은?",questionEn:"Opposite of '취소하다'?",options:["신청하다","포기하다","거절하다","삭제하다"],answer:0,explanation:"취소(cancel) vs 신청(apply/register).",type:"vocabulary"},
  {question:"'한정되다'의 뜻은?",questionEn:"Meaning of '한정되다'?",options:["To be limited","To be expanded","To be open","To be free"],answer:0,explanation:"한정되다 = to be limited/restricted.",type:"vocabulary"},
  {question:"'양보하다'는 무슨 뜻입니까?",questionEn:"What does '양보하다' mean?",options:["To yield/give way","To fight","To escape","To promise"],answer:0,explanation:"양보하다 = to yield, concede, give way.",type:"vocabulary"},
  {question:"비가 오_____ 우산을 가져가세요. 빈칸은?",questionEn:"It is raining, _____ take an umbrella.",options:["니까","지만","거나","든지"],answer:0,explanation:"-(으)니까 gives reason/cause.",type:"grammar"},
  {question:"아무리 바쁘_____ 건강을 챙기세요. 빈칸은?",questionEn:"No matter how busy, take care of health.",options:["더라도","때문에","거든","느라고"],answer:0,explanation:"-더라도 = even if, no matter how.",type:"grammar"},
  {question:"한국에 온 지 3년이 _____.",questionEn:"It has been 3 years since coming to Korea.",options:["됐어요","했어요","갔어요","왔어요"],answer:0,explanation:"-(으)ㄴ 지 + time + 되다 = has been.",type:"grammar"},
  {question:"공부하_____ 친구 전화가 왔어요. 빈칸은?",questionEn:"While studying, a friend called.",options:["는데","지만","거나","다가"],answer:3,explanation:"-다가 = while doing (interrupted).",type:"grammar"},
  {question:"연습할수록 실력이 _____.",questionEn:"The more you practice, the more skill _____.",options:["늘어요","줄어요","같아요","없어요"],answer:0,explanation:"-(으)ㄹ수록 = the more... the more.",type:"grammar"},
  {question:"시간이 없는 _____에 택시를 탔어요.",questionEn:"I took a taxi because of having no time.",options:["바람","것","데","줄"],answer:0,explanation:"-는 바람에 = because of (unexpected).",type:"grammar"},
  {question:"선생님 _____에 한국어를 잘하게 됐어요.",questionEn:"Thanks to the teacher, I became good at Korean.",options:["덕분","때문","대신","탓"],answer:0,explanation:"덕분에 = thanks to (positive cause).",type:"grammar"},
  {question:"넘어질 _____ 했어요.",questionEn:"I almost fell down.",options:["뻔","적","줄","수"],answer:0,explanation:"-(으)ㄹ 뻔하다 = almost did.",type:"grammar"},
  {question:"맛있는 것 _____요.",questionEn:"It seems delicious.",options:["같아","있어","해","봐"],answer:0,explanation:"-ㄴ/는 것 같다 = seems like.",type:"grammar"},
  {question:"공부해야 _____.",questionEn:"I have to study.",options:["해요","줘요","봐요","가요"],answer:0,explanation:"-아/어야 하다 = must, have to.",type:"grammar"},
  {question:"다음 글의 중심 내용은? '최근 한국어를 배우는 외국인이 크게 늘었다. K-POP과 K-드라마의 인기 때문이다.'",questionEn:"Main idea of this passage?",options:["Korean food is popular","More foreigners learn Korean due to K-culture","Korean economy is growing","Tourism decreased"],answer:1,explanation:"K-POP/드라마 인기로 한국어 학습자 증가.",type:"reading"},
  {question:"'환경 보호를 위해 일회용품 사용을 줄여야 한다' - 주장은?",questionEn:"What is the claim?",options:["Use more disposables","Reduce disposable use for environment","Buy expensive products","Travel less"],answer:1,explanation:"일회용품 사용을 줄여야 = reduce disposable use.",type:"reading"},
  {question:"'그는 실패를 두려워하지 않았다. 오히려 그것을 배움의 기회로 삼았다.' - 그의 태도는?",questionEn:"His attitude toward failure?",options:["Fearful","Indifferent","Positive/learning","Angry"],answer:2,explanation:"실패를 배움의 기회로 = turns failure into learning.",type:"reading"},
  {question:"'사회가 발전할수록 개인의 권리 의식도 높아진다' - 의미는?",questionEn:"Meaning of this sentence?",options:["Society is declining","As society develops, rights awareness grows","People become selfish","Economy worsens"],answer:1,explanation:"발전할수록...높아진다 = as develops, grows.",type:"reading"},
  {question:"'이 식당은 맛도 좋고 가격도 합리적이어서 항상 손님이 많다' - 인기 이유는?",questionEn:"Why is this restaurant popular?",options:["Big portions only","Good taste and reasonable price","Famous chef","Good location only"],answer:1,explanation:"맛도 좋고 가격도 합리적 = good taste + reasonable price.",type:"reading"},
  {question:"'결과보다 과정이 중요하다' - 이 글의 주제는?",questionEn:"Theme of this statement?",options:["Results matter most","The process matters more than results","Speed is key","Money is important"],answer:1,explanation:"과정이 중요하다 = process is important.",type:"reading"},
  {question:"'기술 발전으로 재택근무가 보편화되고 있다' - 무엇이 보편화?",questionEn:"What is becoming common?",options:["Travel","Remote work","Education","Cooking"],answer:1,explanation:"재택근무 = work from home.",type:"reading"},
  {question:"'건강한 식습관을 기르려면 채소와 과일을 충분히 먹어야 한다' - 조언은?",questionEn:"The advice is?",options:["Eat more meat","Skip meals","Eat enough vegetables and fruits","Eat fast food"],answer:2,explanation:"채소와 과일을 충분히 먹어야 = eat enough veggies/fruits.",type:"reading"},
  {question:"'소통'의 뜻으로 알맞은 것은?",questionEn:"Meaning of '소통'?",options:["Communication","Competition","Education","Construction"],answer:0,explanation:"소통 = communication, exchange.",type:"vocabulary"},
  {question:"'세대 차이'란 무엇입니까?",questionEn:"What is '세대 차이'?",options:["Price difference","Generation gap","Time zone","Cultural shock"],answer:1,explanation:"세대 차이 = generation gap.",type:"vocabulary"},
  {question:"직장을 그만두_____ 해요. 빈칸은?",questionEn:"I intend to quit my job.",options:["려고","면서","다가","거나"],answer:0,explanation:"-(으)려고 하다 = intend to.",type:"grammar"},
  {question:"'비록 어렵더라도 포기하지 마세요' - 무슨 뜻?",questionEn:"Even though difficult, do not give up - meaning?",options:["Give up if hard","Keep going despite difficulty","It is easy","Ask for help"],answer:1,explanation:"비록 -더라도 = even though/even if.",type:"grammar"}
];

// ============================================================
// 3. Korean Proverbs (50 entries, enhanced format)
// ============================================================
var advancedProverbs = [
  {korean:"가는 말이 고와야 오는 말이 곱다",romanization:"ganeun mari gowaya oneun mari gopda",english:"Kind words beget kind words",literal:"If going words are pretty, coming words are pretty",meaning:"Speak kindly and others will respond kindly",usage:"Advising someone to be polite"},
  {korean:"낮말은 새가 듣고 밤말은 쥐가 듣는다",romanization:"nanmareun saega deutgo bammareun jwiga deutneunda",english:"Walls have ears",literal:"Day words birds hear, night words mice hear",meaning:"Be careful what you say, someone is always listening",usage:"Warning someone about careless talk"},
  {korean:"원숭이도 나무에서 떨어진다",romanization:"wonsungido namueseo tteoreojinda",english:"Even experts make mistakes",literal:"Even monkeys fall from trees",meaning:"Nobody is perfect; even skilled people fail sometimes",usage:"Comforting someone who made a mistake"},
  {korean:"세 살 버릇 여든까지 간다",romanization:"se sal beoreut yeodeunkkaji ganda",english:"Old habits die hard",literal:"A 3-year-old habit lasts until 80",meaning:"Habits formed early are hard to break",usage:"Stressing importance of early education"},
  {korean:"백지장도 맞들면 낫다",romanization:"baekjijangdo matdeulmyeon natda",english:"Two heads are better than one",literal:"Even a sheet of paper is lighter held together",meaning:"Teamwork makes any task easier",usage:"Encouraging cooperation"},
  {korean:"소 잃고 외양간 고친다",romanization:"so ilko oeyanggan gochinda",english:"Locking the barn after the horse bolts",literal:"Fixing the barn after losing the cow",meaning:"Taking action too late, after damage is done",usage:"Criticizing delayed prevention"},
  {korean:"누워서 떡 먹기",romanization:"nuwoseo tteok meokgi",english:"A piece of cake",literal:"Eating rice cake while lying down",meaning:"Something extremely easy to do",usage:"Describing an effortless task"},
  {korean:"티끌 모아 태산",romanization:"tikkeul moa taesan",english:"Every penny counts",literal:"Gather dust to make a great mountain",meaning:"Small amounts accumulate into something great",usage:"Encouraging saving or small efforts"},
  {korean:"고생 끝에 낙이 온다",romanization:"gosaeng kkeute nagi onda",english:"No pain, no gain",literal:"Joy comes at the end of hardship",meaning:"After suffering comes reward",usage:"Motivating someone going through tough times"},
  {korean:"빈 수레가 요란하다",romanization:"bin surега yoranhada",english:"Empty vessels make the most noise",literal:"An empty cart is noisy",meaning:"Those who know least talk the most",usage:"Criticizing boastful people"},
  {korean:"우물 안 개구리",romanization:"umul an gaeguri",english:"A frog in a well",literal:"A frog inside a well",meaning:"A person with a very narrow worldview",usage:"Describing someone with limited perspective"},
  {korean:"하늘의 별 따기",romanization:"haneurui byeol ttagi",english:"Nearly impossible",literal:"Picking stars from the sky",meaning:"Something extremely hard to achieve",usage:"Describing a nearly impossible goal"},
  {korean:"돌다리도 두들겨 보고 건너라",romanization:"doldarido dudeulgyeo bogo geonneora",english:"Look before you leap",literal:"Tap even a stone bridge before crossing",meaning:"Always check thoroughly before acting",usage:"Advising caution and careful planning"},
  {korean:"말이 씨가 된다",romanization:"mari ssiga doenda",english:"Words can become reality",literal:"Words become seeds",meaning:"What you say may come true, so watch your words",usage:"Warning against negative speech"},
  {korean:"등잔 밑이 어둡다",romanization:"deungjan miti eodupta",english:"Closest problems are hardest to see",literal:"It is dark under the lamp",meaning:"You often miss what is right in front of you",usage:"When overlooking obvious nearby issues"},
  {korean:"콩 심은 데 콩 나고 팥 심은 데 팥 난다",romanization:"kong simeun de kong nago pat simeun de pat nanda",english:"You reap what you sow",literal:"Beans grow where beans planted, red beans where red beans planted",meaning:"Results match your actions and efforts",usage:"Emphasizing cause and effect"},
  {korean:"남의 떡이 커 보인다",romanization:"namui tteogi keo boinda",english:"The grass is greener on the other side",literal:"Others' rice cakes look bigger",meaning:"Other people's things always seem better",usage:"When someone envies others"},
  {korean:"작은 고추가 맵다",romanization:"jageun gochuga maepda",english:"Small but mighty",literal:"Small peppers are spicy",meaning:"Do not underestimate someone because of their size",usage:"Praising someone small but capable"},
  {korean:"호랑이도 제 말 하면 온다",romanization:"horangido je mal hamyeon onda",english:"Speak of the devil",literal:"Even a tiger comes when you talk about it",meaning:"The person you are discussing suddenly appears",usage:"When someone appears right as you mention them"},
  {korean:"천 리 길도 한 걸음부터",romanization:"cheon ri gildo han georeum buteo",english:"A journey begins with a single step",literal:"Even a 1000-ri road starts from one step",meaning:"Every great achievement starts small",usage:"Encouraging someone to take the first step"},
  {korean:"사공이 많으면 배가 산으로 간다",romanization:"sagongi maneumyeon baega saneuro ganda",english:"Too many cooks spoil the broth",literal:"Too many boatmen send the boat to the mountain",meaning:"Too many leaders ruin the project",usage:"When too many opinions cause confusion"},
  {korean:"개구리 올챙이 적 생각 못 한다",romanization:"gaeguri olchaengi jeok saenggak mot handa",english:"Forgetting humble beginnings",literal:"The frog cannot remember being a tadpole",meaning:"People forget where they came from after success",usage:"Criticizing someone who forgot their origins"},
  {korean:"바늘 도둑이 소 도둑 된다",romanization:"baneul doduki so doduk doenda",english:"Small crimes lead to big ones",literal:"A needle thief becomes a cow thief",meaning:"Small bad habits grow into major wrongdoings",usage:"Warning about tolerating small misdeeds"},
  {korean:"입에 쓴 약이 몸에 좋다",romanization:"ibe sseun yagi mome jota",english:"Bitter medicine is good for you",literal:"Bitter medicine to the mouth is good for the body",meaning:"Honest criticism is ultimately beneficial",usage:"Accepting constructive criticism"},
  {korean:"공든 탑이 무너지랴",romanization:"gongdeun tabi muneojirya",english:"Hard work will not be in vain",literal:"Would a carefully built tower collapse?",meaning:"Sincere effort always pays off",usage:"Encouraging persistence"},
  {korean:"제 눈에 안경이다",romanization:"je nune angyeongida",english:"Beauty is in the eye of the beholder",literal:"Glasses for one's own eyes",meaning:"Everyone has their own taste and preference",usage:"When someone loves something others do not see appeal in"},
  {korean:"열 번 찍어 안 넘어가는 나무 없다",romanization:"yeol beon jjigeo an neomeoganeun namu eopda",english:"Persistence pays off",literal:"No tree withstands ten strikes",meaning:"Keep trying and you will succeed",usage:"Encouraging persistent effort"},
  {korean:"하늘이 무너져도 솟아날 구멍이 있다",romanization:"haneuri muneojyeodo sosonal gumeongi itda",english:"There is always a way out",literal:"Even if the sky falls, there is a hole to escape",meaning:"No matter how hopeless, a solution exists",usage:"Encouraging hope in desperate situations"},
  {korean:"김칫국부터 마신다",romanization:"gimchitgukbuteo masinda",english:"Counting chickens before they hatch",literal:"Drinking the kimchi broth first",meaning:"Being presumptuous about a favorable outcome",usage:"When someone assumes things prematurely"},
  {korean:"아는 길도 물어 가라",romanization:"aneun gildo mureo gara",english:"Better safe than sorry",literal:"Ask about a road you already know",meaning:"Always double-check, even when confident",usage:"Advising thoroughness and humility"},
  {korean:"같은 값이면 다홍치마",romanization:"gateun gapsimyeon dahongchima",english:"Get the best bang for your buck",literal:"For the same price, the red skirt",meaning:"If cost is same, choose the better option",usage:"When choosing between equal-cost options"},
  {korean:"뜻이 있는 곳에 길이 있다",romanization:"tteusi inneun gose giri itda",english:"Where there is a will there is a way",literal:"Where there is intention there is a road",meaning:"Determination leads to success",usage:"Motivating someone who doubts themselves"},
  {korean:"가재는 게 편이다",romanization:"gajeneun ge pyeonida",english:"Birds of a feather flock together",literal:"The crayfish sides with the crab",meaning:"People side with those similar to themselves",usage:"Observing people grouping by similarity"},
  {korean:"서당 개 삼 년이면 풍월을 읊는다",romanization:"seodang gae sam nyeonimyeon pungworeul eumneunda",english:"Exposure breeds learning",literal:"A dog at school recites poetry after three years",meaning:"Even without talent, long exposure teaches",usage:"Noting how environment shapes learning"},
  {korean:"가랑비에 옷 젖는 줄 모른다",romanization:"garangbie ot jeonneun jul moreunda",english:"Death by a thousand cuts",literal:"You do not notice clothes getting wet in drizzle",meaning:"Small losses add up unnoticed",usage:"Warning about gradual, unnoticed damage"},
  {korean:"까마귀 날자 배 떨어진다",romanization:"kkamagwi nalja bae tteoreojinda",english:"Unfortunate coincidence",literal:"A pear falls when a crow flies away",meaning:"A coincidence that makes someone look guilty",usage:"When wrongly blamed for coincidence"},
  {korean:"될성부른 나무는 떡잎부터 알아본다",romanization:"doelseongbureun namuneun tteogipbuteo arabonda",english:"Great potential shows early",literal:"A promising tree is known from its sprout",meaning:"Future greatness can be seen from youth",usage:"Recognizing early talent"},
  {korean:"목마른 놈이 우물 판다",romanization:"mongmareun nomi umul panda",english:"Necessity is the mother of invention",literal:"The thirsty one digs the well",meaning:"The person who needs it most takes initiative",usage:"Urging self-reliance"},
  {korean:"어물전 망신은 꼴뚜기가 시킨다",romanization:"eomuleon mangsineun kkolttugi ga sikinda",english:"One bad apple spoils the bunch",literal:"The cuttlefish shames the fish market",meaning:"One bad member ruins the group reputation",usage:"When one person brings shame to a group"},
  {korean:"호랑이 굴에 가야 호랑이를 잡는다",romanization:"horangi gure gaya horangireul jamneunda",english:"Nothing ventured nothing gained",literal:"You must enter the tiger cave to catch the tiger",meaning:"You must take risks to achieve great things",usage:"Encouraging bold action"},
  {korean:"꿩 대신 닭",romanization:"kkwong daesin dak",english:"Any port in a storm",literal:"A chicken instead of a pheasant",meaning:"When you cannot get the best, settle for next best",usage:"Accepting a reasonable alternative"},
  {korean:"시작이 반이다",romanization:"sijagi banida",english:"Well begun is half done",literal:"Starting is half",meaning:"Beginning a task is the hardest part",usage:"Encouraging someone to just start"},
  {korean:"아니 땐 굴뚝에 연기 나랴",romanization:"ani ttaen gulttuge yeongi narya",english:"Where there is smoke there is fire",literal:"Would smoke rise from an unfired chimney?",meaning:"Rumors usually have some basis in truth",usage:"Suggesting a rumor has truth behind it"},
  {korean:"급하면 돌아가라",romanization:"geupamyeon doragara",english:"Haste makes waste",literal:"If in a hurry, go around",meaning:"Rushing leads to mistakes; take the steady path",usage:"Advising patience when tempted to rush"},
  {korean:"고래 싸움에 새우 등 터진다",romanization:"gorae ssaume saeu deung teojinda",english:"Caught in the crossfire",literal:"In a whale fight the shrimp's back breaks",meaning:"The weak suffer when the powerful fight",usage:"When innocent bystanders suffer from others' conflicts"},
  {korean:"발 없는 말이 천 리 간다",romanization:"bal eomneun mari cheon ri ganda",english:"Gossip travels fast",literal:"Words without feet travel a thousand ri",meaning:"Rumors spread incredibly quickly",usage:"Warning about gossip and careless words"},
  {korean:"눈에서 멀어지면 마음에서도 멀어진다",romanization:"nuneseo meoreojimyeon maeumesedo meoreojinda",english:"Out of sight out of mind",literal:"Far from eyes, far from heart",meaning:"Distance weakens relationships",usage:"Noting how absence affects closeness"},
  {korean:"로마는 하루아침에 이루어지지 않았다",romanization:"romaneun haruachime irueojiji anhatda",english:"Rome was not built in a day",literal:"Rome was not achieved in one morning",meaning:"Great things take time and patience",usage:"Encouraging patience for long-term goals"},
  {korean:"웃는 얼굴에 침 못 뱉는다",romanization:"unneun eolgure chim mot baenneunda",english:"You cannot spit in a smiling face",literal:"Cannot spit on a smiling face",meaning:"It is hard to be hostile to someone who is kind",usage:"Advising kindness as a disarming strategy"},
  {korean:"빈대 잡으려다 초가삼간 태운다",romanization:"bindae jabeuryeoda chogasamgan taeunda",english:"Do not throw the baby out with the bathwater",literal:"Burning the thatched house trying to catch a bedbug",meaning:"Causing greater damage while fixing a small problem",usage:"Warning against disproportionate reactions"}
];

// ============================================================
// 4. Grammar Patterns (30 entries)
// ============================================================
var advancedGrammarPatterns = [
  {pattern:"-아/어서",level:"beginner",english:"because / and then",explanation:"Connects cause-result or sequential actions",examples:[{korean:"배고파서 밥을 먹었어요",english:"I ate because I was hungry"},{korean:"만나서 반갑습니다",english:"Nice to meet you"}],quiz:{q:"피곤___서 일찍 잤어요",a:"해"}},
  {pattern:"-(으)ㄹ 수 있다/없다",level:"beginner",english:"can / cannot",explanation:"Expresses ability or possibility",examples:[{korean:"한국어를 할 수 있어요",english:"I can speak Korean"},{korean:"수영할 수 없어요",english:"I cannot swim"}],quiz:{q:"요리___ 수 있어요?",a:"할"}},
  {pattern:"-고 싶다",level:"beginner",english:"want to",explanation:"Expresses desire to do something",examples:[{korean:"먹고 싶어요",english:"I want to eat"},{korean:"한국에 가고 싶어요",english:"I want to go to Korea"}],quiz:{q:"배우___ 싶어요",a:"고"}},
  {pattern:"-(으)ㄹ 거예요",level:"beginner",english:"will / going to",explanation:"Future tense or intention",examples:[{korean:"내일 갈 거예요",english:"I will go tomorrow"},{korean:"저녁에 요리할 거예요",english:"I will cook tonight"}],quiz:{q:"주말에 쉬___ 거예요",a:"ㄹ"}},
  {pattern:"-고 있다",level:"beginner",english:"is doing (progressive)",explanation:"Present progressive action",examples:[{korean:"공부하고 있어요",english:"I am studying"},{korean:"비가 오고 있어요",english:"It is raining"}],quiz:{q:"기다리___ 있어요",a:"고"}},
  {pattern:"-(으)면",level:"beginner",english:"if / when",explanation:"Conditional clause",examples:[{korean:"시간이 있으면 만나요",english:"If you have time, let's meet"},{korean:"비가 오면 집에 있을 거예요",english:"If it rains, I will stay home"}],quiz:{q:"맛있으___ 더 주세요",a:"면"}},
  {pattern:"-지 마세요",level:"beginner",english:"do not (polite negative command)",explanation:"Polite prohibition or negative request",examples:[{korean:"걱정하지 마세요",english:"Do not worry"},{korean:"늦지 마세요",english:"Do not be late"}],quiz:{q:"여기서 사진 찍___ 마세요",a:"지"}},
  {pattern:"-(으)ㄹ까요?",level:"beginner",english:"shall we?",explanation:"Suggestion or proposal",examples:[{korean:"같이 갈까요?",english:"Shall we go together?"},{korean:"뭐 먹을까요?",english:"What shall we eat?"}],quiz:{q:"창문을 열___?",a:"까요"}},
  {pattern:"-아/어야 하다",level:"intermediate",english:"must / have to",explanation:"Obligation or necessity",examples:[{korean:"공부해야 해요",english:"I have to study"},{korean:"약을 먹어야 해요",english:"I must take medicine"}],quiz:{q:"일찍 일어나___ 해요",a:"야"}},
  {pattern:"-기 때문에",level:"intermediate",english:"because (formal reason)",explanation:"Formal expression of cause/reason",examples:[{korean:"바쁘기 때문에 못 가요",english:"I cannot go because I am busy"},{korean:"추웠기 때문에 감기에 걸렸어요",english:"I caught a cold because it was cold"}],quiz:{q:"비가 오___ 때문에 우산을 가져왔어요",a:"기"}},
  {pattern:"-(으)ㄴ/는데",level:"intermediate",english:"but / and (background)",explanation:"Gives background info or soft contrast",examples:[{korean:"맛있는데 비싸요",english:"It is delicious but expensive"},{korean:"지금 가는데 같이 갈래요?",english:"I am going now, want to come?"}],quiz:{q:"한국에 갔___데 좋았어요",a:"는"}},
  {pattern:"-아/어 보다",level:"intermediate",english:"try doing",explanation:"Attempting or trying an action",examples:[{korean:"한번 먹어 보세요",english:"Try eating it"},{korean:"입어 봐도 돼요?",english:"May I try it on?"}],quiz:{q:"한국어로 말___ 보세요",a:"해"}},
  {pattern:"-(으)려고 하다",level:"intermediate",english:"intend to / plan to",explanation:"Expressing intention or plan",examples:[{korean:"여행하려고 해요",english:"I plan to travel"},{korean:"한국어를 배우려고 해요",english:"I intend to learn Korean"}],quiz:{q:"이사하___고 해요",a:"려"}},
  {pattern:"-(으)ㄴ 적이 있다",level:"intermediate",english:"have experienced",explanation:"Past experience expression",examples:[{korean:"한국에 간 적이 있어요",english:"I have been to Korea"},{korean:"김치를 만든 적이 없어요",english:"I have never made kimchi"}],quiz:{q:"스카이다이빙을 한 ___이 있어요?",a:"적"}},
  {pattern:"-(으)ㄹ 때",level:"intermediate",english:"when",explanation:"Time clause for when doing something",examples:[{korean:"슬플 때 음악을 들어요",english:"I listen to music when sad"},{korean:"어릴 때 서울에 살았어요",english:"I lived in Seoul when young"}],quiz:{q:"시간이 있___ 때 연락하세요",a:"을"}},
  {pattern:"-는 것 같다",level:"intermediate",english:"it seems like / I think",explanation:"Expressing guess or conjecture",examples:[{korean:"비가 올 것 같아요",english:"It seems like it will rain"},{korean:"맛있는 것 같아요",english:"I think it is delicious"}],quiz:{q:"그 사람이 한국인인 것 ___아요",a:"같"}},
  {pattern:"-(으)면 좋겠다",level:"intermediate",english:"I wish / it would be nice if",explanation:"Expressing wishes or hopes",examples:[{korean:"비가 안 오면 좋겠어요",english:"I wish it would not rain"},{korean:"빨리 끝나면 좋겠어요",english:"I hope it ends soon"}],quiz:{q:"한국어를 잘하___ 좋겠어요",a:"면"}},
  {pattern:"-(으)ㄹ 줄 알다/모르다",level:"intermediate",english:"know/do not know how to",explanation:"Ability from learned skill",examples:[{korean:"운전할 줄 알아요",english:"I know how to drive"},{korean:"요리할 줄 몰라요",english:"I do not know how to cook"}],quiz:{q:"피아노 칠 ___ 알아요?",a:"줄"}},
  {pattern:"-더라고요",level:"advanced",english:"I noticed/found that (firsthand)",explanation:"Reporting personal observation or discovery",examples:[{korean:"한국 음식이 맛있더라고요",english:"I found Korean food is delicious"},{korean:"서울이 크더라고요",english:"I noticed Seoul is big"}],quiz:{q:"한국 사람들이 친절하___고요",a:"더라"}},
  {pattern:"-(으)ㄹ수록",level:"advanced",english:"the more... the more",explanation:"Proportional increase pattern",examples:[{korean:"연습할수록 잘해요",english:"The more you practice, the better"},{korean:"많이 먹을수록 배불러요",english:"The more you eat, the fuller"}],quiz:{q:"공부할___록 재미있어요",a:"수"}},
  {pattern:"-는 바람에",level:"advanced",english:"because of (unexpected cause)",explanation:"Unexpected cause leading to a result",examples:[{korean:"비가 오는 바람에 못 갔어요",english:"Could not go because it rained"},{korean:"늦게 일어나는 바람에 지각했어요",english:"Was late because I overslept"}],quiz:{q:"전화가 오___ 바람에 집중을 못 했어요",a:"는"}},
  {pattern:"-(으)ㄴ/는 덕분에",level:"advanced",english:"thanks to",explanation:"Positive cause or grateful attribution",examples:[{korean:"선생님 덕분에 잘해요",english:"Thanks to the teacher, I do well"},{korean:"운동한 덕분에 건강해요",english:"Thanks to exercising, I am healthy"}],quiz:{q:"친구 ___분에 한국어를 배웠어요",a:"덕"}},
  {pattern:"-(으)ㄹ 뻔하다",level:"advanced",english:"almost did",explanation:"Nearly happened but did not",examples:[{korean:"넘어질 뻔했어요",english:"I almost fell"},{korean:"지각할 뻔했어요",english:"I almost was late"}],quiz:{q:"잊어버릴 ___했어요",a:"뻔"}},
  {pattern:"-(이)야말로",level:"advanced",english:"is truly / is the very",explanation:"Strong emphasis on the subject",examples:[{korean:"이것이야말로 진짜예요",english:"This is truly the real one"},{korean:"당신이야말로 최고예요",english:"You are truly the best"}],quiz:{q:"이것___말로 최고의 선물이에요",a:"이야"}},
  {pattern:"-는 편이다",level:"advanced",english:"tend to / rather",explanation:"General tendency or inclination",examples:[{korean:"저는 조용한 편이에요",english:"I tend to be quiet"},{korean:"매운 음식을 잘 먹는 편이에요",english:"I am fairly good at spicy food"}],quiz:{q:"저는 아침형 인간인 ___이에요",a:"편"}},
  {pattern:"-거든요",level:"intermediate",english:"you see / because (explanation)",explanation:"Providing background explanation to listener",examples:[{korean:"내일 못 가요. 시험이 있거든요",english:"I cannot go tomorrow. I have an exam, you see"},{korean:"많이 먹었거든요",english:"I ate a lot, you see"}],quiz:{q:"피곤해요. 어제 늦게 잤___요",a:"거든"}},
  {pattern:"-다가",level:"intermediate",english:"while doing / then switched",explanation:"Action interrupted or changed midway",examples:[{korean:"공부하다가 잠들었어요",english:"I fell asleep while studying"},{korean:"걷다가 넘어졌어요",english:"I fell while walking"}],quiz:{q:"TV를 보___가 전화가 왔어요",a:"다"}},
  {pattern:"-잖아요",level:"intermediate",english:"you know / as you know",explanation:"Reminding listener of shared knowledge",examples:[{korean:"제가 말했잖아요",english:"I told you, remember?"},{korean:"내일 시험이잖아요",english:"We have an exam tomorrow, you know"}],quiz:{q:"어제 약속했___아요",a:"잖"}},
  {pattern:"-도록",level:"advanced",english:"so that / in order to / until",explanation:"Purpose or extent of action",examples:[{korean:"늦지 않도록 일찍 출발하세요",english:"Leave early so you are not late"},{korean:"알아들을 수 있도록 천천히 말해 주세요",english:"Please speak slowly so I can understand"}],quiz:{q:"잊지 않___록 메모해 두세요",a:"도"}},
  {pattern:"-(으)ㄴ/는 셈이다",level:"advanced",english:"practically / it amounts to",explanation:"Equivalent or approximation",examples:[{korean:"거의 다 한 셈이에요",english:"It is practically done"},{korean:"공짜나 다름없는 셈이에요",english:"It amounts to being free"}],quiz:{q:"매일 운동하는 ___이에요",a:"셈"}}
];

// ============================================================
// 5. Pronunciation Rules (12 rules)
// ============================================================
var pronunciationRules = [
  {rule:"Liaison (Linking)",ruleKr:"연음법칙",explanation:"Final consonant moves to next syllable starting with vowel",examples:[{written:"음악",spoken:"으막",romanization:"eumak"},{written:"한국어",spoken:"한구거",romanization:"hangugeo"},{written:"읽어요",spoken:"일거요",romanization:"ilgeoyo"}]},
  {rule:"Nasalization",ruleKr:"비음화",explanation:"Stops before nasals become nasals: ㄱ->ㅇ, ㄷ->ㄴ, ㅂ->ㅁ",examples:[{written:"학문",spoken:"항문",romanization:"hangmun"},{written:"받는",spoken:"반는",romanization:"banneun"},{written:"합니다",spoken:"함니다",romanization:"hamnida"}]},
  {rule:"Tensification",ruleKr:"경음화",explanation:"Plain consonants become tense after obstruent codas",examples:[{written:"학교",spoken:"학꾜",romanization:"hakkkyo"},{written:"식당",spoken:"식땅",romanization:"sikttang"},{written:"접시",spoken:"접씨",romanization:"jeopssi"}]},
  {rule:"Palatalization",ruleKr:"구개음화",explanation:"ㄷ/ㅌ before 이 become ㅈ/ㅊ",examples:[{written:"같이",spoken:"가치",romanization:"gachi"},{written:"굳이",spoken:"구지",romanization:"guji"},{written:"해돋이",spoken:"해도지",romanization:"haedoji"}]},
  {rule:"Aspiration",ruleKr:"격음화",explanation:"ㅎ combines with plain stops to form aspirated sounds",examples:[{written:"좋다",spoken:"조타",romanization:"jota"},{written:"놓고",spoken:"노코",romanization:"noko"},{written:"입학",spoken:"이팍",romanization:"ipak"}]},
  {rule:"ㄹ Nasalization",ruleKr:"ㄹ의 비음화",explanation:"ㄹ after nasal becomes ㄴ, then nasal assimilation applies",examples:[{written:"심리",spoken:"심니",romanization:"simni"},{written:"음료",spoken:"음뇨",romanization:"eumnyo"},{written:"종로",spoken:"종노",romanization:"jongno"}]},
  {rule:"ㅎ Deletion",ruleKr:"ㅎ 탈락",explanation:"ㅎ in coda is often silent before vowels or sonorants",examples:[{written:"좋아요",spoken:"조아요",romanization:"joayo"},{written:"놓아",spoken:"노아",romanization:"noa"},{written:"많은",spoken:"마는",romanization:"maneun"}]},
  {rule:"Initial Sound Rule",ruleKr:"두음법칙",explanation:"ㄹ and ㄴ at word start change: ㄹ->ㄴ or zero, ㄴ->zero before 이/야",examples:[{written:"여자 (女子)",spoken:"여자 (not 녀자)",romanization:"yeoja"},{written:"이름 (理)",spoken:"이름 (not 리름)",romanization:"ireum"},{written:"낙원 (樂園)",spoken:"낙원 (not 락원)",romanization:"nagwon"}]},
  {rule:"Sai-siot Effect",ruleKr:"사이시옷",explanation:"ㅅ inserted between compound nouns causes tensification",examples:[{written:"바닷가",spoken:"바닫까",romanization:"badakka"},{written:"냇가",spoken:"낻까",romanization:"naekka"},{written:"깃발",spoken:"긷빨",romanization:"gippal"}]},
  {rule:"Consonant Assimilation",ruleKr:"자음동화",explanation:"Adjacent consonants influence each other in place/manner",examples:[{written:"신라",spoken:"실라",romanization:"silla"},{written:"칼날",spoken:"칼랄",romanization:"kallal"},{written:"난로",spoken:"날로",romanization:"nallo"}]},
  {rule:"Coda Neutralization",ruleKr:"음절 끝소리 규칙",explanation:"Only 7 sounds allowed in coda: ㄱ,ㄴ,ㄷ,ㄹ,ㅁ,ㅂ,ㅇ",examples:[{written:"부엌",spoken:"부억",romanization:"bueok"},{written:"옷",spoken:"옫",romanization:"ot"},{written:"낮",spoken:"낟",romanization:"nat"}]},
  {rule:"Double Consonant Coda",ruleKr:"겹받침",explanation:"Only one of two final consonants is pronounced (context-dependent)",examples:[{written:"읽다",spoken:"익따",romanization:"iktta"},{written:"없다",spoken:"업따",romanization:"eoptta"},{written:"삶",spoken:"삼",romanization:"sam"}]}
];

// ============================================================
// State Variables
// ============================================================
var topikState = {questions:[],idx:0,score:0,answers:[],isExam:false,timer:null,timeLeft:0};
var provState = {pool:[],idx:0,score:0,mode:0};
/** Shuffles array in place. @param {Array} arr @returns {Array} */
function acShuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}

// ============================================================
// TOPIK Practice Functions
// ============================================================

/** Shows TOPIK level selection screen. @param {Element} c */
function showTopikPractice(c) {
  if (typeof gameState !== "undefined") { gameState.gamesPlayed++; if (typeof saveProgress === "function") saveProgress(); }
  var h = '<h2 class="game-title">TOPIK Practice</h2>';
  h += '<div style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:20px">';
  h += '<p>Test your Korean with TOPIK-style questions!</p></div>';
  h += '<div style="display:grid;gap:12px;max-width:400px;margin:0 auto">';
  h += '<button class="game-btn" data-action="topikStart" data-level="1">TOPIK I (Beginner) - ' + topikIQuestions.length + ' Questions</button>';
  h += '<button class="game-btn secondary" data-action="topikStart" data-level="2">TOPIK II (Intermediate) - ' + topikIIQuestions.length + ' Questions</button>';
  h += '<button class="game-btn" data-action="topikExam" style="background:linear-gradient(135deg,var(--neon-pink),var(--neon-purple))">Exam Mode (30 min / 20 Q)</button>';
  h += '</div>';
  c.innerHTML = h;
}

/** Starts TOPIK practice or exam mode. @param {Element} c @param {number} level @param {boolean} exam */
function startTopikMode(c, level, exam) {
  var pool = level === 1 ? topikIQuestions.slice() : topikIIQuestions.slice();
  topikState.questions = acShuffle(pool).slice(0, exam ? 20 : pool.length);
  topikState.idx = 0; topikState.score = 0; topikState.answers = [];
  topikState.isExam = !!exam; topikState.timeLeft = exam ? 1800 : 0;
  if (topikState.timer) clearInterval(topikState.timer);
  topikState.timer = null;
  if (exam) {
    topikState.timer = setInterval(function() {
      topikState.timeLeft--;
      var td = document.getElementById("topikTimer");
      if (td) { var m = Math.floor(topikState.timeLeft / 60); var s = topikState.timeLeft % 60; td.textContent = m + ":" + (s < 10 ? "0" : "") + s; }
      if (topikState.timeLeft <= 0) { clearInterval(topikState.timer); topikState.timer = null; renderTopikResult(c); }
    }, 1000);
  }
  renderTopikQ(c);
}

/** Renders current TOPIK question. @param {Element} c */
function renderTopikQ(c) {
  if (topikState.idx >= topikState.questions.length) { renderTopikResult(c); return; }
  var q = topikState.questions[topikState.idx];
  var pct = Math.round((topikState.idx / topikState.questions.length) * 100);
  var h = '<h2 class="game-title">TOPIK ' + (topikState.questions === topikIQuestions ? "I" : "II") + '</h2>';
  if (topikState.isExam) h += '<div style="text-align:center;font-size:1.5rem;color:var(--neon-cyan)" id="topikTimer">30:00</div>';
  h += '<p style="text-align:center;color:rgba(255,255,255,0.6)">Q' + (topikState.idx + 1) + ' / ' + topikState.questions.length + '</p>';
  h += '<div class="level-progress" style="margin-bottom:15px"><div class="level-bar" style="width:' + pct + '%"></div></div>';
  h += '<div style="background:var(--glass);padding:20px;border-radius:15px;margin-bottom:15px">';
  h += '<p style="font-size:1.1rem;margin-bottom:8px">' + escapeHtml(q.question) + '</p>';
  h += '<p style="color:rgba(255,255,255,0.5);font-size:0.9rem">' + escapeHtml(q.questionEn) + '</p></div>';
  h += '<div style="display:grid;gap:10px">';
  for (var i = 0; i < q.options.length; i++) {
    h += '<button class="game-btn' + (i % 2 === 1 ? " secondary" : "") + '" data-action="topikAnswer" data-idx="' + i + '">' + (i + 1) + '. ' + escapeHtml(q.options[i]) + '</button>';
  }
  h += '</div>';
  c.innerHTML = h;
}

/** Handles TOPIK answer selection. @param {Element} c @param {number} idx */
function handleTopikAns(c, idx) {
  var q = topikState.questions[topikState.idx];
  var correct = idx === q.answer;
  topikState.answers.push(idx);
  if (correct) { topikState.score++; if (typeof addXP === "function") addXP(15); if (typeof SoundEngine !== "undefined") SoundEngine.correct(); }
  else { if (typeof SoundEngine !== "undefined") SoundEngine.wrong(); }
  if (topikState.isExam) { topikState.idx++; renderTopikQ(c); return; }
  var btns = c.querySelectorAll('[data-action="topikAnswer"]');
  for (var i = 0; i < btns.length; i++) {
    btns[i].style.pointerEvents = "none";
    if (i === q.answer) btns[i].style.border = "2px solid #00f5d4";
    if (i === idx && !correct) btns[i].style.border = "2px solid #ff2d95";
  }
  var exp = document.createElement("div");
  exp.style.cssText = "margin-top:15px;padding:15px;background:var(--glass);border-radius:10px";
  exp.innerHTML = '<p style="color:' + (correct ? "#00f5d4" : "#ff2d95") + '">' + (correct ? "Correct!" : "Incorrect") + '</p><p style="color:rgba(255,255,255,0.7);margin-top:8px">' + escapeHtml(q.explanation) + '</p><button class="game-btn" data-action="topikNext" style="margin-top:10px">Next</button>';
  c.appendChild(exp);
}

/** Shows TOPIK results summary. @param {Element} c */
function renderTopikResult(c) {
  if (topikState.timer) { clearInterval(topikState.timer); topikState.timer = null; }
  var total = topikState.questions.length;
  var pct = Math.round((topikState.score / total) * 100);
  var grade = pct >= 80 ? "Excellent!" : pct >= 60 ? "Good!" : pct >= 40 ? "Keep Trying!" : "Study More!";
  var h = '<h2 class="game-title">TOPIK Results</h2>';
  h += '<div style="text-align:center;padding:25px;background:var(--glass);border-radius:15px;margin-bottom:20px">';
  h += '<p style="font-size:3rem;font-weight:900;color:var(--neon-cyan)">' + topikState.score + ' / ' + total + '</p>';
  h += '<p style="font-size:1.3rem;color:var(--neon-pink)">' + pct + '% - ' + grade + '</p></div>';
  h += '<div style="max-height:300px;overflow-y:auto;margin-bottom:15px">';
  for (var i = 0; i < topikState.questions.length; i++) {
    var q = topikState.questions[i]; var ans = topikState.answers[i]; var ok = ans === q.answer;
    h += '<div style="padding:10px;margin-bottom:8px;background:var(--glass);border-radius:8px;border-left:3px solid ' + (ok ? "#00f5d4" : "#ff2d95") + '">';
    h += '<p style="font-size:0.9rem">' + escapeHtml(q.question) + '</p>';
    if (!ok) h += '<p style="color:#ff2d95;font-size:0.8rem">' + escapeHtml(q.explanation) + '</p>';
    h += '</div>';
  }
  h += '</div><button class="game-btn" data-action="topikRestart">Try Again</button>';
  c.innerHTML = h;
  if (pct >= 80 && typeof createConfetti === "function") createConfetti();
}

// ============================================================
// Proverb Quiz Functions (Enhanced)
// ============================================================

/** Shows enhanced proverb quiz with mode selection. @param {Element} c */
function showProverbQuiz(c) {
  if (typeof gameState !== "undefined") { gameState.gamesPlayed++; if (typeof saveProgress === "function") saveProgress(); }
  var h = '<h2 class="game-title">Korean Proverbs Quiz</h2>';
  h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:20px">' + advancedProverbs.length + ' proverbs to master!</p>';
  h += '<div style="display:grid;gap:12px;max-width:400px;margin:0 auto">';
  h += '<button class="game-btn" data-action="proverbMode" data-mode="0">Meaning Match (4 choices)</button>';
  h += '<button class="game-btn secondary" data-action="proverbMode" data-mode="1">Fill in the Blank</button>';
  h += '<button class="game-btn" data-action="proverbMode" data-mode="2">Complete the Proverb</button>';
  h += '</div>';
  c.innerHTML = h;
}

/** Starts a proverb quiz mode. @param {Element} c @param {number} mode */
function startProverbMode(c, mode) {
  provState.pool = acShuffle(advancedProverbs.slice()).slice(0, 10);
  provState.idx = 0; provState.score = 0; provState.mode = mode;
  renderProverbQ(c);
}

/** Renders a proverb question based on current mode. @param {Element} c */
function renderProverbQ(c) {
  if (provState.idx >= provState.pool.length) {
    var pct = Math.round((provState.score / provState.pool.length) * 100);
    var h = '<h2 class="game-title">Proverb Quiz Results</h2>';
    h += '<div style="text-align:center;padding:20px;background:var(--glass);border-radius:15px;margin-bottom:20px">';
    h += '<p style="font-size:2.5rem;color:var(--neon-cyan)">' + provState.score + ' / ' + provState.pool.length + ' (' + pct + '%)</p></div>';
    h += '<button class="game-btn" data-action="proverbRestart">Play Again</button>';
    c.innerHTML = h;
    if (pct >= 80 && typeof createConfetti === "function") createConfetti();
    return;
  }
  var p = provState.pool[provState.idx];
  var h = '<h2 class="game-title">Proverb Quiz</h2>';
  h += '<p style="text-align:center;color:rgba(255,255,255,0.6)">Q' + (provState.idx + 1) + '/' + provState.pool.length + ' | Score: ' + provState.score + '</p>';
  if (provState.mode === 0) {
    h += '<div style="background:var(--glass);padding:20px;border-radius:15px;margin:15px 0"><p style="font-size:1.2rem;text-align:center">' + escapeHtml(p.korean) + '</p>';
    h += '<p style="color:rgba(255,255,255,0.4);text-align:center;font-size:0.85rem;margin-top:5px">' + escapeHtml(p.romanization) + '</p></div>';
    h += '<p style="text-align:center;margin-bottom:12px">What does this proverb mean?</p><div style="display:grid;gap:10px">';
    var opts = [p.meaning]; var others = advancedProverbs.filter(function(x) { return x.korean !== p.korean; });
    others = acShuffle(others); for (var i = 0; i < 3 && i < others.length; i++) opts.push(others[i].meaning);
    opts = acShuffle(opts);
    for (var j = 0; j < opts.length; j++) {
      h += '<button class="game-btn' + (j % 2 === 1 ? " secondary" : "") + '" data-action="proverbAns" data-correct="' + (opts[j] === p.meaning ? "1" : "0") + '">' + escapeHtml(opts[j]) + '</button>';
    }
    h += '</div>';
  } else if (provState.mode === 1) {
    var words = p.korean.split(" "); var blankIdx = Math.floor(words.length / 2);
    var answer = words[blankIdx]; words[blankIdx] = "______";
    h += '<div style="background:var(--glass);padding:20px;border-radius:15px;margin:15px 0"><p style="font-size:1.2rem;text-align:center">' + escapeHtml(words.join(" ")) + '</p></div>';
    h += '<p style="text-align:center;margin-bottom:12px">Fill in the blank:</p><div style="display:grid;gap:10px">';
    var fOpts = [answer]; var allWords = advancedProverbs.reduce(function(a, x) { return a.concat(x.korean.split(" ")); }, []);
    allWords = acShuffle(allWords.filter(function(w) { return w !== answer && w.length > 1; }));
    for (var k = 0; k < 3 && k < allWords.length; k++) fOpts.push(allWords[k]);
    fOpts = acShuffle(fOpts);
    for (var m = 0; m < fOpts.length; m++) {
      h += '<button class="game-btn' + (m % 2 === 1 ? " secondary" : "") + '" data-action="proverbAns" data-correct="' + (fOpts[m] === answer ? "1" : "0") + '">' + escapeHtml(fOpts[m]) + '</button>';
    }
    h += '</div>';
  } else {
    var half = p.korean.split(" "); var mid = Math.ceil(half.length / 2);
    var first = half.slice(0, mid).join(" "); var second = half.slice(mid).join(" ");
    h += '<div style="background:var(--glass);padding:20px;border-radius:15px;margin:15px 0"><p style="font-size:1.2rem;text-align:center">' + escapeHtml(first) + ' ...</p></div>';
    h += '<p style="text-align:center;margin-bottom:12px">Complete the proverb:</p><div style="display:grid;gap:10px">';
    var cOpts = [second]; var otherHalves = advancedProverbs.filter(function(x) { return x.korean !== p.korean; });
    otherHalves = acShuffle(otherHalves);
    for (var n = 0; n < 3 && n < otherHalves.length; n++) { var oh = otherHalves[n].korean.split(" "); cOpts.push(oh.slice(Math.ceil(oh.length / 2)).join(" ")); }
    cOpts = acShuffle(cOpts);
    for (var q = 0; q < cOpts.length; q++) {
      h += '<button class="game-btn' + (q % 2 === 1 ? " secondary" : "") + '" data-action="proverbAns" data-correct="' + (cOpts[q] === second ? "1" : "0") + '">' + escapeHtml(cOpts[q]) + '</button>';
    }
    h += '</div>';
  }
  c.innerHTML = h;
}

/** Handles proverb answer. @param {Element} c @param {boolean} correct */
function handleProverbAns(c, correct) {
  var p = provState.pool[provState.idx];
  if (correct) { provState.score++; if (typeof addXP === "function") addXP(20); if (typeof SoundEngine !== "undefined") SoundEngine.correct(); }
  else { if (typeof SoundEngine !== "undefined") SoundEngine.wrong(); }
  var fb = document.createElement("div");
  fb.style.cssText = "margin-top:15px;padding:15px;background:var(--glass);border-radius:10px";
  fb.innerHTML = '<p style="color:' + (correct ? "#00f5d4" : "#ff2d95") + ';font-weight:bold">' + (correct ? "Correct!" : "Incorrect") + '</p>' +
    '<p style="margin-top:8px;font-size:0.9rem"><strong>' + escapeHtml(p.korean) + '</strong></p>' +
    '<p style="color:rgba(255,255,255,0.6);font-size:0.85rem">' + escapeHtml(p.literal) + '</p>' +
    '<p style="margin-top:5px;font-size:0.9rem">' + escapeHtml(p.meaning) + '</p>' +
    '<p style="color:rgba(255,255,255,0.5);font-size:0.8rem;margin-top:3px">Usage: ' + escapeHtml(p.usage) + '</p>' +
    '<button class="game-btn" data-action="proverbNext" style="margin-top:10px">Next</button>';
  c.querySelectorAll('[data-action="proverbAns"]').forEach(function(b) { b.style.pointerEvents = "none"; });
  c.appendChild(fb);
}

// ============================================================
// Grammar Lesson Functions
// ============================================================

/** Shows grammar patterns list filtered by level. @param {Element} c */
function showGrammarLesson(c) {
  if (typeof gameState !== "undefined") { gameState.gamesPlayed++; if (typeof saveProgress === "function") saveProgress(); }
  var h = '<h2 class="game-title">Grammar Patterns</h2>';
  h += '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:15px;flex-wrap:wrap">';
  h += '<button class="game-btn" data-action="gramFilter" data-level="all" style="padding:8px 16px;font-size:0.85rem">All</button>';
  h += '<button class="game-btn" data-action="gramFilter" data-level="beginner" style="padding:8px 16px;font-size:0.85rem">Beginner</button>';
  h += '<button class="game-btn secondary" data-action="gramFilter" data-level="intermediate" style="padding:8px 16px;font-size:0.85rem">Intermediate</button>';
  h += '<button class="game-btn" data-action="gramFilter" data-level="advanced" style="padding:8px 16px;font-size:0.85rem;background:linear-gradient(135deg,var(--neon-pink),var(--neon-purple))">Advanced</button>';
  h += '</div><div id="gramList">';
  h += buildGramList("all");
  h += '</div>';
  c.innerHTML = h;
}

/** Builds grammar list HTML for a given level filter. @param {string} level @returns {string} */
function buildGramList(level) {
  var h = '<div style="display:grid;gap:8px">';
  for (var i = 0; i < advancedGrammarPatterns.length; i++) {
    var g = advancedGrammarPatterns[i];
    if (level !== "all" && g.level !== level) continue;
    var lc = g.level === "beginner" ? "#00f5d4" : g.level === "advanced" ? "#ff2d95" : "#9d4edd";
    h += '<button class="game-btn" data-action="gramSelect" data-idx="' + i + '" style="text-align:left;padding:12px 16px">';
    h += '<span style="color:' + lc + ';font-size:0.75rem">' + escapeHtml(g.level.toUpperCase()) + '</span> ';
    h += '<strong>' + escapeHtml(g.pattern) + '</strong> - ' + escapeHtml(g.english) + '</button>';
  }
  return h + '</div>';
}

/** Renders grammar pattern detail with examples and quiz. @param {Element} c @param {number} idx */
function renderGrammarDetail(c, idx) {
  var g = advancedGrammarPatterns[idx];
  var h = '<h2 class="game-title">' + escapeHtml(g.pattern) + '</h2>';
  h += '<div style="background:var(--glass);padding:20px;border-radius:15px;margin-bottom:15px">';
  h += '<p style="font-size:1.1rem;color:var(--neon-cyan)">' + escapeHtml(g.english) + '</p>';
  h += '<p style="margin-top:10px;color:rgba(255,255,255,0.8)">' + escapeHtml(g.explanation) + '</p></div>';
  h += '<h3 style="margin-bottom:10px">Examples</h3>';
  for (var i = 0; i < g.examples.length; i++) {
    h += '<div style="background:var(--glass);padding:12px;border-radius:10px;margin-bottom:8px">';
    h += '<p style="font-size:1.05rem">' + escapeHtml(g.examples[i].korean);
    h += ' <button class="game-btn" data-action="gramSpeak" data-text="' + escapeHtml(g.examples[i].korean) + '" style="padding:4px 10px;font-size:0.8rem;display:inline">Listen</button></p>';
    h += '<p style="color:rgba(255,255,255,0.6);font-size:0.9rem">' + escapeHtml(g.examples[i].english) + '</p></div>';
  }
  if (g.quiz) {
    h += '<div style="background:var(--glass);padding:15px;border-radius:15px;margin-top:15px">';
    h += '<p style="margin-bottom:10px">Quiz: ' + escapeHtml(g.quiz.q) + '</p>';
    h += '<input type="text" id="gramQuizInput" placeholder="Type answer..." style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.2);background:rgba(0,0,0,0.3);color:#fff;margin-bottom:10px">';
    h += '<button class="game-btn" data-action="gramQuizCheck" data-answer="' + escapeHtml(g.quiz.a) + '">Check</button></div>';
  }
  h += '<button class="game-btn secondary" data-action="gramBack" style="margin-top:15px">Back to List</button>';
  c.innerHTML = h;
}

// ============================================================
// Pronunciation Rules Functions
// ============================================================

/** Shows pronunciation rules list. @param {Element} c */
function showPronunciationRules(c) {
  if (typeof gameState !== "undefined") { gameState.gamesPlayed++; if (typeof saveProgress === "function") saveProgress(); }
  var h = '<h2 class="game-title">Pronunciation Rules</h2>';
  h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:15px">' + pronunciationRules.length + ' essential rules for natural Korean</p>';
  h += '<div style="display:grid;gap:8px">';
  for (var i = 0; i < pronunciationRules.length; i++) {
    var r = pronunciationRules[i];
    h += '<button class="game-btn" data-action="pronSelect" data-idx="' + i + '" style="text-align:left;padding:12px 16px">';
    h += '<strong>' + escapeHtml(r.ruleKr) + '</strong> <span style="color:rgba(255,255,255,0.6)">(' + escapeHtml(r.rule) + ')</span></button>';
  }
  h += '</div>';
  c.innerHTML = h;
}

/** Renders pronunciation rule detail with TTS comparison. @param {Element} c @param {number} idx */
function renderPronDetail(c, idx) {
  var r = pronunciationRules[idx];
  var h = '<h2 class="game-title">' + escapeHtml(r.ruleKr) + '</h2>';
  h += '<p style="text-align:center;color:var(--neon-cyan);margin-bottom:5px">' + escapeHtml(r.rule) + '</p>';
  h += '<div style="background:var(--glass);padding:20px;border-radius:15px;margin:15px 0">';
  h += '<p style="color:rgba(255,255,255,0.9)">' + escapeHtml(r.explanation) + '</p></div>';
  h += '<h3 style="margin-bottom:10px">Examples</h3>';
  for (var i = 0; i < r.examples.length; i++) {
    var ex = r.examples[i];
    h += '<div style="background:var(--glass);padding:15px;border-radius:10px;margin-bottom:10px;display:grid;grid-template-columns:1fr 1fr;gap:10px;align-items:center">';
    h += '<div><p style="font-size:0.8rem;color:rgba(255,255,255,0.5)">Written</p><p style="font-size:1.2rem">' + escapeHtml(ex.written) + '</p></div>';
    h += '<div><p style="font-size:0.8rem;color:rgba(255,255,255,0.5)">Spoken</p><p style="font-size:1.2rem;color:var(--neon-pink)">' + escapeHtml(ex.spoken) + '</p></div>';
    h += '<div style="grid-column:1/-1;display:flex;gap:8px;align-items:center">';
    h += '<span style="color:rgba(255,255,255,0.5);font-size:0.85rem">[' + escapeHtml(ex.romanization) + ']</span>';
    h += '<button class="game-btn" data-action="pronSpeak" data-text="' + escapeHtml(ex.written) + '" style="padding:4px 12px;font-size:0.8rem">Listen</button>';
    h += '</div></div>';
  }
  h += '<button class="game-btn secondary" data-action="pronBack" style="margin-top:15px">Back to Rules</button>';
  c.innerHTML = h;
}

// ============================================================
// Event Delegation for Advanced Content
// ============================================================
(function() {
  "use strict";
  document.addEventListener("click", function(e) {
    var el = e.target.closest("[data-action]");
    if (!el) return;
    var action = el.getAttribute("data-action");
    var c = document.getElementById("gameArea");
    if (!c) return;
    switch (action) {
      case "topikStart": startTopikMode(c, parseInt(el.getAttribute("data-level"), 10), false); break;
      case "topikExam": startTopikMode(c, Math.random() < 0.5 ? 1 : 2, true); break;
      case "topikAnswer": handleTopikAns(c, parseInt(el.getAttribute("data-idx"), 10)); break;
      case "topikNext": topikState.idx++; renderTopikQ(c); break;
      case "topikRestart": showTopikPractice(c); break;
      case "proverbMode": startProverbMode(c, parseInt(el.getAttribute("data-mode"), 10)); break;
      case "proverbAns": handleProverbAns(c, el.getAttribute("data-correct") === "1"); break;
      case "proverbNext": provState.idx++; renderProverbQ(c); break;
      case "proverbRestart": showProverbQuiz(c); break;
      case "gramFilter": var gl = document.getElementById("gramList"); if (gl) gl.innerHTML = buildGramList(el.getAttribute("data-level")); break;
      case "gramSelect": renderGrammarDetail(c, parseInt(el.getAttribute("data-idx"), 10)); break;
      case "gramSpeak": if (typeof speakKorean === "function") speakKorean(el.getAttribute("data-text")); break;
      case "gramQuizCheck":
        var inp = document.getElementById("gramQuizInput");
        var ans = el.getAttribute("data-answer");
        if (inp && inp.value.trim() === ans) { el.textContent = "Correct!"; el.style.color = "#00f5d4"; if (typeof SoundEngine !== "undefined") SoundEngine.correct(); }
        else { el.textContent = "Answer: " + ans; el.style.color = "#ff2d95"; if (typeof SoundEngine !== "undefined") SoundEngine.wrong(); }
        break;
      case "gramBack": showGrammarLesson(c); break;
      case "pronSelect": renderPronDetail(c, parseInt(el.getAttribute("data-idx"), 10)); break;
      case "pronSpeak": if (typeof speakKorean === "function") speakKorean(el.getAttribute("data-text")); break;
      case "pronBack": showPronunciationRules(c); break;
      default: break;
    }
  });
})();

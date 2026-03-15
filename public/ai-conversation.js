/**
 * ai-conversation.js
 * AI Conversation Simulator for K-POP Korean Learning Game.
 * Pattern-matching dialog engine with Web Speech API (TTS + STT).
 * Requires: main-app.js globals (escapeHtml, speakKorean, addXP,
 *   addCombo, resetCombo, saveProgress, gameState, showToast,
 *   showPopup, createConfetti, SoundEngine)
 */

/** @type {{ scnId: string|null, step: number, score: number, msgs: Array, chatMsgs: Array }} */
var convState = { scnId: null, step: 0, score: 0, msgs: [], chatMsgs: [] };

/** @returns {Object} Completed scenario IDs from localStorage */
function getConvProgress() {
  try { return JSON.parse(localStorage.getItem("convProgress") || "{}"); }
  catch (_e) { return {}; }
}

/** @param {string} id - Scenario ID to mark complete */
function saveConvProgress(id) {
  var p = getConvProgress(); p[id] = true;
  try { localStorage.setItem("convProgress", JSON.stringify(p)); } catch (_e) { /* noop */ }
}

/**
 * Build a dialog turn object.
 * @param {string} r - Role: "n" for NPC, "u" for user
 * @param {string} kr - Korean text
 * @param {string} en - English text
 * @param {string} [rm] - Romanization
 * @param {Array} [opts] - User options array
 * @returns {Object} Dialog step object
 */
function D(r, kr, en, rm, opts) {
  if (r === "n") return { role: "npc", kr: kr, en: en, rm: rm || "" };
  return { role: "user", options: opts };
}

/** @returns {Object} Option: kr, en, ok (boolean), fb (feedback) */
function O(kr, en, ok, fb) { return { kr: kr, en: en, ok: !!ok, fb: fb || "" }; }

/** @type {Object.<string, Object>} All conversation scenarios */
var conversationScenarios = {
  cafe: { title: "카페에서 주문하기", titleEn: "Ordering at a Cafe", difficulty: 1, icon: "☕", npc: "바리스타", dialog: [
    D("n","어서오세요! 주문하시겠어요?","Welcome! Would you like to order?","eoseo oseyo! jumunhasigesseoyo?"),
    D("u","","","",[O("아메리카노 한 잔 주세요","One Americano please",1), O("네, 감사합니다","Yes, thank you",0,"주문을 해야 해요!"), O("안녕하세요","Hello",0,"인사보다 주문을 해보세요!")]),
    D("n","사이즈는 어떤 걸로 하시겠어요?","What size would you like?","saijeuneun eotteon geollo hasigesseoyo?"),
    D("u","","","",[O("톨 사이즈로 주세요","Tall size please",1), O("큰 거요","The big one",0,"사이즈 이름을 말해보세요!"), O("모르겠어요","I don't know",0,"사이즈를 골라보세요!")]),
    D("n","4,500원입니다. 감사합니다!","It's 4,500 won. Thank you!","sacheon obaek won imnida.")
  ]},
  restaurant: { title: "식당에서 주문하기", titleEn: "Ordering at a Restaurant", difficulty: 1, icon: "🍜", npc: "직원", dialog: [
    D("n","몇 분이세요?","How many people?","myeot buniseyo?"),
    D("u","","","",[O("두 명이요","Two people",1), O("밥 주세요","Rice please",0,"먼저 인원수를 말해요!"), O("여기요!","Excuse me!",0,"인원수를 알려주세요!")]),
    D("n","메뉴 보시겠어요? 추천은 비빔밥이에요.","See the menu? Today's pick is bibimbap.","menyu bosigesseoyo?"),
    D("u","","","",[O("비빔밥 두 개 주세요","Two bibimbap please",1), O("뭐가 맛있어요?","What's delicious?",0,"추천 메뉴를 시켜보세요!"), O("물 주세요","Water please",0,"음식을 먼저 주문해요!")]),
    D("n","네, 잠시만 기다려 주세요!","Yes, please wait a moment!","ne, jamsiman gidaryeo juseyo!")
  ]},
  shopping: { title: "쇼핑하기", titleEn: "Shopping", difficulty: 2, icon: "🛒", npc: "점원", dialog: [
    D("n","어서오세요! 뭘 찾으세요?","Welcome! What are you looking for?","eoseo oseyo! mwol chajeuseyo?"),
    D("u","","","",[O("티셔츠를 찾고 있어요","I'm looking for a T-shirt",1), O("그냥 구경이요","Just browsing",0,"뭔가를 찾아보세요!"), O("이거 뭐예요?","What is this?",0,"찾는 물건을 말해보세요!")]),
    D("n","이 색깔 어떠세요? 요즘 인기 많아요.","How about this color? Very popular.","i saekkal eotteoseyo?"),
    D("u","","","",[O("좋아요! 이걸로 할게요","Nice! I'll take this",1), O("다른 색 있어요?","Other colors?",0,"이것도 괜찮아요!"), O("너무 비싸요","Too expensive",0,"가격은 아직 안 물어봤어요!")]),
    D("n","감사합니다! 포장해 드릴게요.","Thank you! I'll wrap it.","gamsahamnida! pojanghae deurilgeyo.")
  ]},
  taxi: { title: "택시 타기", titleEn: "Taking a Taxi", difficulty: 2, icon: "🚕", npc: "택시 기사", dialog: [
    D("n","어디로 가시겠어요?","Where would you like to go?","eodiro gasigesseoyo?"),
    D("u","","","",[O("서울역으로 가주세요","Seoul Station please",1), O("빨리 가주세요","Go fast please",0,"목적지를 먼저 말해요!"), O("얼마예요?","How much?",0,"먼저 어디로 가는지 말해요!")]),
    D("n","네, 30분쯤 걸릴 거예요.","Okay, about 30 minutes.","ne, samsipbunjjeum geollil geoyeyo."),
    D("u","","","",[O("네, 감사합니다","Yes, thank you",1), O("너무 오래 걸려요","Too long",0,"교통 상황이니 기다려요!"), O("다른 길로 가주세요","Another way please",0,"기사님을 믿어보세요!")]),
    D("n","도착했습니다! 15,000원이에요.","We arrived! 15,000 won.","dochakhaetseumnida!")
  ]},
  hospital: { title: "병원 방문", titleEn: "Visiting a Hospital", difficulty: 3, icon: "🏥", npc: "의사", dialog: [
    D("n","어디가 불편하세요?","What seems to be the problem?","eodiga bulpyeonhaseyo?"),
    D("u","","","",[O("머리가 아파요","I have a headache",1), O("감기인 것 같아요","I think I have a cold",0,"증상을 더 구체적으로!"), O("약 주세요","Give me medicine",0,"먼저 증상을 말해요!")]),
    D("n","언제부터 아프셨어요?","Since when?","eonjebuteo apeusyeosseoyo?"),
    D("u","","","",[O("이틀 전부터요","Since two days ago",1), O("오늘이요","Today",0,"좀 더 정확하게!"), O("잘 모르겠어요","Not sure",0,"기억해보세요!")]),
    D("n","약을 처방해 드릴게요. 푹 쉬세요!","I'll prescribe medicine. Rest well!","yageul cheobanghae deurilgeyo.")
  ]},
  hotel: { title: "호텔 체크인", titleEn: "Hotel Check-in", difficulty: 2, icon: "🏨", npc: "프론트 직원", dialog: [
    D("n","안녕하세요! 예약하셨나요?","Hello! Do you have a reservation?","annyeonghaseyo! yeyakasyeonayo?"),
    D("u","","","",[O("네, 예약했어요. 김민수입니다","Yes, reservation. Kim Minsu",1), O("방 있어요?","Any rooms?",0,"예약 여부를 말해보세요!"), O("안녕하세요","Hello",0,"예약 확인을 해보세요!")]),
    D("n","확인됐습니다! 3박, 조식 포함이에요.","Confirmed! 3 nights, breakfast included.","hwagindwaetseumnida!"),
    D("u","","","",[O("네, 맞아요. 감사합니다","Yes, correct. Thanks",1), O("조식은 몇 시예요?","Breakfast time?",0,"먼저 확인해주세요!"), O("방을 바꿀 수 있어요?","Change rooms?",0,"먼저 체크인을 완료해요!")]),
    D("n","열쇠 드릴게요. 좋은 하루 되세요!","Here's your key. Have a nice day!","yeolsoe deurilgeyo.")
  ]},
  school: { title: "학교에서", titleEn: "At School", difficulty: 1, icon: "🏫", npc: "선생님", dialog: [
    D("n","오늘 한국어를 배워볼까요?","Shall we learn Korean today?","oneul hangugeo-reul baewobollkkayo?"),
    D("u","","","",[O("네, 좋아요!","Yes, sounds good!",1), O("숙제가 있어요?","Any homework?",0,"먼저 수업을 시작해요!"), O("쉬고 싶어요","I want to rest",0,"열심히 공부해봐요!")]),
    D("n","잘했어요! 발음이 많이 좋아졌어요.","Well done! Pronunciation improved!","jalhaesseoyo!"),
    D("u","","","",[O("감사합니다, 선생님!","Thank you, teacher!",1), O("정말요?","Really?",0,"감사 인사를 해보세요!"), O("더 어려운 거 해주세요","Something harder",0,"먼저 감사 인사를!")]),
    D("n","다음에도 열심히 합시다! 안녕!","Let's work hard next time! Bye!","daeumedo yeolsimhi hapsida!")
  ]},
  meetFriend: { title: "친구 만나기", titleEn: "Meeting a Friend", difficulty: 1, icon: "👋", npc: "친구", dialog: [
    D("n","오랜만이야! 잘 지냈어?","Long time no see! How've you been?","oraenmaniya! jal jinaesseo?"),
    D("u","","","",[O("응, 잘 지냈어! 너는?","Yeah, good! You?",1), O("안녕!","Hi!",0,"안부를 물어봐야 해!"), O("누구세요?","Who are you?",0,"친구를 알아봐야지!")]),
    D("n","나도! 오늘 뭐 할까? 밥 먹을래?","Me too! What to do? Eat?","nado! oneul mwo halkka?"),
    D("u","","","",[O("좋아! 뭐 먹을까?","Sure! What to eat?",1), O("바빠서 안 돼","Busy, can't",0,"친구랑 놀아봐요!"), O("돈이 없어","No money",0,"친구가 사줄 수도 있어요!")]),
    D("n","떡볶이 먹으러 가자! 내가 살게!","Let's eat tteokbokki! My treat!","tteokbokki meogeureo gaja!")
  ]}
};

/** @type {Array<{kw: Array<string>, kr: string, en: string}>} Free chat keyword responses */
var freeChatKeywords = [
  { kw: ["안녕","하이","hello"], kr: "안녕하세요! 오늘 기분이 어때요?", en: "Hello! How are you feeling today?" },
  { kw: ["이름","name","누구"], kr: "저는 AI 한국어 선생님이에요!", en: "I'm an AI Korean teacher!" },
  { kw: ["감사","고마","thank"], kr: "천만에요! 더 도와줄까요?", en: "You're welcome! Can I help more?" },
  { kw: ["밥","먹","음식","food","eat"], kr: "한국 음식 좋아해요? 뭘 좋아해요?", en: "Like Korean food? What do you like?" },
  { kw: ["좋아","like","love"], kr: "저도 좋아요! 한국어 공부 재미있죠?", en: "Me too! Korean study is fun, right?" },
  { kw: ["어려","hard","difficult"], kr: "괜찮아요! 천천히 하면 돼요. 화이팅!", en: "It's okay! Take it slow. Fighting!" },
  { kw: ["날씨","weather"], kr: "오늘 날씨가 좋죠? 산책하고 싶어요!", en: "Nice weather! I want to take a walk!" },
  { kw: ["한국","korea","서울"], kr: "한국에 가본 적 있어요? 서울은 멋져요!", en: "Been to Korea? Seoul is amazing!" },
  { kw: ["음악","노래","kpop"], kr: "케이팝 좋아해요? 어떤 그룹 좋아해요?", en: "Like K-pop? Which group?" },
  { kw: ["공부","study","배우"], kr: "열심히 공부하고 있네요! 대단해요!", en: "Studying hard! That's great!" },
  { kw: ["bye","잘가","안녕히"], kr: "안녕히 가세요! 또 만나요!", en: "Goodbye! See you again!" }
];

/** @type {Array<{pattern: RegExp, fb: string}>} Grammar feedback rules for free chat */
var grammarFeedback = [
  { pattern: /[a-zA-Z]{3,}/, fb: "Tip: Try using Korean characters!" },
  { pattern: /[\uAC00-\uD7AF].*요$/, fb: "Great polite ending with -요!" },
  { pattern: /[\uAC00-\uD7AF].*주세요/, fb: "Nice use of -주세요 (please)!" },
  { pattern: /[\uAC00-\uD7AF].*해요/, fb: "Good casual polite form -해요!" }
];

/** @type {string[]} Scenario unlock order */
var scenarioOrder = ["cafe","restaurant","meetFriend","school","shopping","taxi","hotel","hospital"];

/**
 * Check if a scenario is unlocked.
 * @param {string} id - Scenario ID
 * @returns {boolean} True if unlocked
 */
function isScenarioUnlocked(id) {
  var i = scenarioOrder.indexOf(id);
  return i <= 0 || !!getConvProgress()[scenarioOrder[i - 1]];
}

/**
 * Show the AI Conversation Simulator entry screen.
 * @param {HTMLElement} c - The game area container
 */
function showConversationSim(c) {
  convState.scnId = null; convState.step = 0; convState.score = 0; convState.msgs = [];
  gameState.gamesPlayed++; saveProgress();
  showScenarioSelect(c);
}

/**
 * Build a single scenario card HTML.
 * @param {string} id - Scenario ID
 * @param {Object} scn - Scenario data
 * @param {boolean} done - Whether completed
 * @param {boolean} locked - Whether locked
 * @returns {string} HTML string
 */
function buildScenarioCard(id, scn, done, locked) {
  var stars = ""; for (var s = 0; s < 3; s++) stars += s < scn.difficulty ? "★" : "☆";
  var st = locked ? "opacity:0.4;pointer-events:none;" : "";
  var act = locked ? "" : 'data-action="convSelectScenario" data-id="' + id + '"';
  var h = '<div style="' + st + 'background:var(--glass);border:1px solid rgba(157,78,221,0.3);';
  h += 'border-radius:15px;padding:18px;text-align:center;cursor:pointer;transition:all 0.3s ease" ' + act + '>';
  h += '<div style="font-size:2.5rem;margin-bottom:8px">' + (locked ? "🔒 " : "") + scn.icon + '</div>';
  h += '<div style="font-weight:bold;margin-bottom:4px">' + escapeHtml(scn.title) + (done ? " ✅" : "") + '</div>';
  h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.6);margin-bottom:4px">' + escapeHtml(scn.titleEn) + '</div>';
  h += '<div style="color:var(--gold);font-size:0.8rem">' + stars + '</div></div>';
  return h;
}

/**
 * Show the scenario selection grid.
 * @param {HTMLElement} c - The game area container
 */
function showScenarioSelect(c) {
  var prog = getConvProgress();
  var h = '<h2 class="game-title">AI Conversation Simulator</h2>';
  h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:20px">Choose a scenario to practice!</p>';
  h += '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px">';
  for (var i = 0; i < scenarioOrder.length; i++) {
    var id = scenarioOrder[i];
    h += buildScenarioCard(id, conversationScenarios[id], !!prog[id], !isScenarioUnlocked(id));
  }
  h += '</div><div style="text-align:center">';
  h += '<button class="game-btn secondary" data-action="showFreeConvChat">Free Chat Mode</button></div>';
  c.innerHTML = h;
}

/**
 * Start a conversation scenario.
 * @param {HTMLElement} c - The game area container
 * @param {string} id - Scenario ID
 */
function startConvScenario(c, id) {
  if (!conversationScenarios[id]) return;
  convState.scnId = id; convState.step = 0; convState.score = 0; convState.msgs = [];
  advanceConvDialog(c);
}

/**
 * Advance the conversation to the next dialog step.
 * @param {HTMLElement} c - The game area container
 */
function advanceConvDialog(c) {
  var scn = conversationScenarios[convState.scnId];
  if (!scn) return;
  if (convState.step >= scn.dialog.length) { showConvComplete(c); return; }
  var dlg = scn.dialog[convState.step];
  if (dlg.role === "npc") {
    convState.msgs.push({ role: "npc", kr: dlg.kr, en: dlg.en, rm: dlg.rm });
    convState.step++;
    renderConversationUI(c, true);
  } else { renderConversationUI(c, false); }
}

/** @returns {string} Conversation header bar HTML */
function buildConvHeader() {
  var scn = conversationScenarios[convState.scnId];
  var pct = Math.round((convState.step / scn.dialog.length) * 100);
  var h = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px">';
  h += '<div><span style="font-size:1.3rem">' + scn.icon + '</span> <strong>' + escapeHtml(scn.npc) + '</strong></div>';
  h += '<div style="color:var(--gold);font-weight:bold">' + convState.score + ' pts</div></div>';
  h += '<div style="background:rgba(255,255,255,0.1);border-radius:10px;height:6px;margin-bottom:15px">';
  h += '<div style="width:' + pct + '%;height:100%;border-radius:10px;';
  h += 'background:linear-gradient(90deg,var(--neon-pink),var(--neon-purple));transition:width 0.3s"></div></div>';
  return h;
}

/**
 * Build a single chat bubble HTML with NPC avatar.
 * @param {{ role: string, kr: string, en: string, rm?: string, fb?: string }} m - Message
 * @param {string} [avatar] - NPC avatar emoji
 * @returns {string} HTML string
 */
function buildChatBubble(m, avatar) {
  var isU = m.role === "user";
  var bg = isU ? "linear-gradient(135deg,var(--neon-pink),var(--neon-purple))" : "rgba(255,255,255,0.1)";
  var h = '<div style="display:flex;justify-content:' + (isU ? "flex-end" : "flex-start") + ';margin-bottom:10px;gap:8px;align-items:flex-end">';
  if (!isU && avatar) {
    h += '<div style="width:36px;height:36px;border-radius:50%;background:var(--glass);';
    h += 'display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">' + avatar + '</div>';
  }
  h += '<div style="max-width:75%;padding:12px 16px;border-radius:18px;background:' + bg + '">';
  h += '<div style="font-size:1.05rem">' + escapeHtml(m.kr) + '</div>';
  h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.6);margin-top:2px">' + escapeHtml(m.en) + '</div>';
  if (m.rm) h += '<div style="font-size:0.7rem;color:rgba(255,255,255,0.4);font-style:italic">' + escapeHtml(m.rm) + '</div>';
  if (m.fb) h += '<div style="font-size:0.75rem;color:var(--gold);margin-top:4px">' + escapeHtml(m.fb) + '</div>';
  h += '<button class="game-btn secondary" data-action="convSpeak" data-text="' + escapeHtml(m.kr) + '" ';
  h += 'style="padding:4px 10px;font-size:0.7rem;margin-top:6px">&#128264; Listen</button></div></div>';
  return h;
}

/** @returns {string} Typing indicator dots HTML */
function buildTypingIndicator() {
  var dot = "display:inline-block;width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.5);margin:0 2px;";
  var h = '<div id="convTyping" style="display:flex;align-items:center;gap:8px;margin-bottom:10px">';
  h += '<div style="padding:10px 16px;border-radius:18px;background:rgba(255,255,255,0.1)">';
  h += '<span style="' + dot + 'animation:convDot 1.4s infinite 0s"></span>';
  h += '<span style="' + dot + 'animation:convDot 1.4s infinite 0.2s"></span>';
  h += '<span style="' + dot + 'animation:convDot 1.4s infinite 0.4s"></span></div></div>';
  return h;
}

/** Inject typing indicator keyframes CSS once */
function ensureConvStyles() {
  if (document.getElementById("convDotStyle")) return;
  var s = document.createElement("style"); s.id = "convDotStyle";
  s.textContent = "@keyframes convDot{0%,80%,100%{opacity:0.3;transform:scale(0.8)}40%{opacity:1;transform:scale(1.2)}}";
  document.head.appendChild(s);
}

/** @returns {string} Options buttons HTML for current user turn */
function buildConvOptions() {
  var scn = conversationScenarios[convState.scnId];
  var dlg = scn.dialog[convState.step];
  if (!dlg || dlg.role !== "user") return "";
  var h = '<div style="display:flex;flex-direction:column;gap:8px">';
  for (var i = 0; i < dlg.options.length; i++) {
    var o = dlg.options[i];
    h += '<button class="game-btn secondary" data-action="convChoice" data-idx="' + i + '" style="text-align:left;padding:12px 16px">';
    h += '<div>' + escapeHtml(o.kr) + '</div>';
    h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">' + escapeHtml(o.en) + '</div></button>';
  }
  return h + '</div>';
}

/**
 * Render the full conversation UI.
 * @param {HTMLElement} c - The game area container
 * @param {boolean} npcJustSpoke - Whether NPC just spoke (shows typing indicator)
 */
function renderConversationUI(c, npcJustSpoke) {
  ensureConvStyles();
  var scn = conversationScenarios[convState.scnId];
  var h = '<h2 class="game-title">AI Conversation</h2>' + buildConvHeader();
  h += '<div id="convMsgArea" style="max-height:280px;overflow-y:auto;padding:10px;margin-bottom:15px;scroll-behavior:smooth">';
  for (var i = 0; i < convState.msgs.length; i++) h += buildChatBubble(convState.msgs[i], scn.icon);
  h += '</div>';
  if (convState.step < scn.dialog.length && scn.dialog[convState.step].role === "user") h += buildConvOptions();
  h += '<div style="text-align:center;margin-top:12px"><button class="game-btn secondary" data-action="showConvSelect" ';
  h += 'style="padding:8px 16px;font-size:0.8rem">Back to Scenarios</button></div>';
  c.innerHTML = h;
  var area = document.getElementById("convMsgArea");
  if (area) area.scrollTop = area.scrollHeight;
  if (npcJustSpoke && convState.msgs.length > 0) {
    speakKorean(convState.msgs[convState.msgs.length - 1].kr);
    setTimeout(function() { advanceConvDialog(c); }, 800);
  }
}

/**
 * Handle user selecting a dialog choice.
 * @param {number} idx - Index of chosen option
 */
function handleConversationChoice(idx) {
  var c = document.getElementById("gameArea");
  var scn = conversationScenarios[convState.scnId];
  if (!scn) return;
  var dlg = scn.dialog[convState.step];
  if (!dlg || dlg.role !== "user") return;
  var opt = dlg.options[idx]; if (!opt) return;
  var msg = { role: "user", kr: opt.kr, en: opt.en };
  if (opt.ok) { convState.score += 10; addXP(10); addCombo(); SoundEngine.correct(); }
  else { msg.fb = opt.fb || ""; resetCombo(); SoundEngine.wrong(); }
  convState.msgs.push(msg); convState.step++;
  advanceConvDialog(c);
}

/**
 * Show the scenario completion screen.
 * @param {HTMLElement} c - The game area container
 */
function showConvComplete(c) {
  var scn = conversationScenarios[convState.scnId];
  saveConvProgress(convState.scnId); createConfetti(60);
  var h = '<h2 class="game-title">Conversation Complete!</h2><div style="text-align:center">';
  h += '<div style="font-size:4rem;margin:15px 0">' + scn.icon + '</div>';
  h += '<div style="font-size:1.3rem;margin-bottom:8px">' + escapeHtml(scn.title) + '</div>';
  h += '<div style="font-size:2rem;color:var(--gold);margin:15px 0">' + convState.score + ' pts</div>';
  h += '<div style="margin-bottom:20px"><button class="game-btn secondary" data-action="convPronounce" data-text="';
  h += escapeHtml(scn.dialog[0].kr) + '" style="margin:5px">Practice Pronunciation</button></div>';
  h += '<button class="game-btn" data-action="showConvSelect">More Scenarios</button></div>';
  c.innerHTML = h;
}

/**
 * Show the free chat mode.
 * @param {HTMLElement} c - The game area container
 */
function showFreeChat(c) {
  convState.chatMsgs = [{ role: "npc", kr: "안녕하세요! 자유롭게 대화해요. 한국어로 말해보세요!", en: "Hello! Let's chat freely. Try Korean!" }];
  renderFreeChat(c);
}

/**
 * Render the free chat UI.
 * @param {HTMLElement} c - The game area container
 */
function renderFreeChat(c) {
  ensureConvStyles();
  var h = '<h2 class="game-title">Free Chat</h2>';
  h += '<div id="freeChatArea" style="max-height:300px;overflow-y:auto;padding:10px;margin-bottom:15px">';
  for (var i = 0; i < convState.chatMsgs.length; i++) h += buildChatBubble(convState.chatMsgs[i], "🤖");
  h += '</div><div style="display:flex;gap:8px;margin-bottom:12px">';
  h += '<input type="text" id="freeChatInput" class="speed-input" placeholder="Type Korean or English..." autocomplete="off" style="flex:1">';
  h += '<button class="game-btn" data-action="convFreeSend" style="padding:10px 18px">Send</button>';
  h += '<button class="game-btn secondary" data-action="convMicInput" style="padding:10px 14px">&#127908;</button></div>';
  h += '<div style="text-align:center"><button class="game-btn secondary" data-action="showConvSelect" style="padding:8px 16px;font-size:0.8rem">Back</button></div>';
  c.innerHTML = h;
  var inp = document.getElementById("freeChatInput");
  if (inp) { inp.addEventListener("keydown", function(e) { if (e.key === "Enter") handleFreeChatSend(); }); inp.focus(); }
}

/** Handle sending a free chat message */
function handleFreeChatSend() {
  var inp = document.getElementById("freeChatInput");
  if (!inp || !inp.value.trim()) return;
  var text = inp.value.trim();
  convState.chatMsgs.push({ role: "user", kr: text, en: "" });
  var resp = getFreeChatResponse(text);
  convState.chatMsgs.push(resp);
  addXP(5); renderFreeChat(document.getElementById("gameArea")); speakKorean(resp.kr);
}

/**
 * Get keyword-matched response with grammar feedback.
 * @param {string} input - User input text
 * @returns {{ role: string, kr: string, en: string, fb: string }} Response
 */
function getFreeChatResponse(input) {
  var lo = input.toLowerCase(), fb = getGrammarFeedback(input);
  for (var i = 0; i < freeChatKeywords.length; i++) {
    for (var k = 0; k < freeChatKeywords[i].kw.length; k++) {
      if (lo.indexOf(freeChatKeywords[i].kw[k]) !== -1) {
        return { role: "npc", kr: freeChatKeywords[i].kr, en: freeChatKeywords[i].en, fb: fb };
      }
    }
  }
  var defs = [{ kr: "재미있네요! 더 말해주세요.", en: "Interesting! Tell me more." },
    { kr: "잘 하고 있어요! 계속 해봐요.", en: "You're doing great! Keep going." },
    { kr: "좋은 표현이에요! 다른 것도 해봐요.", en: "Good expression! Try something else." }];
  var pick = defs[Math.floor(Math.random() * defs.length)];
  return { role: "npc", kr: pick.kr, en: pick.en, fb: fb };
}

/**
 * Analyze input and return grammar feedback string.
 * @param {string} input - User input
 * @returns {string} Feedback or empty string
 */
function getGrammarFeedback(input) {
  for (var i = 0; i < grammarFeedback.length; i++) {
    if (grammarFeedback[i].pattern.test(input)) return grammarFeedback[i].fb;
  }
  return "";
}

/**
 * Speak Korean text using TTS.
 * @param {string} text - Korean text to speak
 */
function convSpeakText(text) {
  if (typeof speakKorean === "function") { speakKorean(text); showToast("Playing audio..."); }
}

/**
 * Start pronunciation practice with Speech Recognition.
 * @param {string} targetText - Target Korean text to match
 */
function convStartPronounce(targetText) {
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showToast("Speech recognition not supported."); return; }
  showToast("Listening... speak now!");
  var rec = new SR(); rec.lang = "ko-KR"; rec.interimResults = false; rec.maxAlternatives = 1;
  rec.onresult = function(e) {
    var sp = e.results[0][0].transcript, cf = Math.round(e.results[0][0].confidence * 100);
    var ok = targetText.replace(/\s/g, "") === sp.replace(/\s/g, "") || cf >= 70;
    if (ok) { showPopup("Great Pronunciation!", sp + " (" + cf + "%)"); addXP(15); createConfetti(30); SoundEngine.correct(); }
    else { showPopup("Try Again!", "You said: " + sp + " / Target: " + targetText); SoundEngine.wrong(); }
  };
  rec.onerror = function() { showToast("Could not recognize. Try again!"); };
  rec.start();
}

/** Start speech-to-text for free chat input field */
function convMicInput() {
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { showToast("Speech recognition not supported."); return; }
  showToast("Listening...");
  var rec = new SR(); rec.lang = "ko-KR"; rec.interimResults = false;
  rec.onresult = function(e) {
    var inp = document.getElementById("freeChatInput");
    if (inp) { inp.value = e.results[0][0].transcript; showToast("Got it! Press Send."); }
  };
  rec.onerror = function() { showToast("Could not hear. Try again!"); };
  rec.start();
}

// Expose functions globally
window.showConversationSim = showConversationSim;
window.showScenarioSelect = showScenarioSelect;
window.startConvScenario = startConvScenario;
window.handleConversationChoice = handleConversationChoice;
window.showFreeChat = showFreeChat;
window.handleFreeChatSend = handleFreeChatSend;
window.convSpeakText = convSpeakText;
window.convStartPronounce = convStartPronounce;
window.convMicInput = convMicInput;

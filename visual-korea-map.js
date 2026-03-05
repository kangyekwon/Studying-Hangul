/**
 * visual-korea-map.js
 * Interactive Korea map learning mode with regional quizzes,
 * dialect comparison, and food tour features.
 * Requires: main-app.js, security-utils.js (loaded before this file)
 * Uses globals: escapeHtml, gameState, speakKorean, showToast, addXP
 */
(function () {
  "use strict";

  /** @type {Object<string, Object>} Korea's 17 administrative divisions */
  var koreaRegions = {
    seoul: { nameKr: "\uc11c\uc6b8", nameEn: "Seoul", x: 48, y: 28,
      famous: ["\uacbd\ubcf5\uad81", "\ub0a8\uc0b0\ud0c0\uc6cc", "\uba85\ub3d9"], food: ["\ub5a1\ubcf6\uc774", "\uc21c\ub300", "\uce7c\uad6d\uc218"],
      dialect: "\ud45c\uc900\uc5b4", dialectEx: null, color: "#ff2d95" },
    busan: { nameKr: "\ubd80\uc0b0", nameEn: "Busan", x: 78, y: 72,
      famous: ["\ud574\uc6b4\ub300", "\uc790\uac08\uce58\uc2dc\uc7a5", "\uad11\uc548\ub9ac"], food: ["\ubc00\uba74", "\ub3fc\uc9c0\uad6d\ubc25", "\uc5b4\ubb35"],
      dialect: "\ubd80\uc0b0 \uc0ac\ud22c\ub9ac", dialectEx: { standard: "\ubb50 \ud574?", dialect: "\ubb50 \ud558\ub178?" }, color: "#00d4ff" },
    daegu: { nameKr: "\ub300\uad6c", nameEn: "Daegu", x: 72, y: 55,
      famous: ["\ud314\uacf5\uc0b0", "\uc11c\ubb38\uc2dc\uc7a5", "\ub3d9\uc131\ub85c"], food: ["\ub0a9\uc791\ub9cc\ub450", "\ub9c9\ucc3d", "\ub530\ub85c\uad6d\ubc25"],
      dialect: "\ub300\uad6c \uc0ac\ud22c\ub9ac", dialectEx: { standard: "\uc815\ub9d0?", dialect: "\uc9c4\uc9dc\ub85c?" }, color: "#ff6b35" },
    incheon: { nameKr: "\uc778\ucc9c", nameEn: "Incheon", x: 38, y: 30,
      famous: ["\uc778\ucc9c\uad6d\uc81c\uacf5\ud56d", "\uc6d4\ubbf8\ub3c4", "\ucc28\uc774\ub098\ud0c0\uc6b4"], food: ["\uc9dc\uc7a5\uba74", "\uc0c8\uc6b0\ubc84\uac70", "\ub0c9\uba74"],
      dialect: "\ud45c\uc900\uc5b4", dialectEx: null, color: "#4361ee" },
    gwangju: { nameKr: "\uad11\uc8fc", nameEn: "Gwangju", x: 35, y: 72,
      famous: ["\ubb34\ub4f1\uc0b0", "\uc591\ub9bc\ub3d9", "5\xb718\ubbfc\uc8fc\uad11\uc7a5"], food: ["\uc0c1\ucd94\ud22c\ubc25", "\uc624\ub9ac\ud0d5", "\uae30\uc0ac\uc218\uad6d"],
      dialect: "\uc804\ub77c\ub3c4 \uc0ac\ud22c\ub9ac", dialectEx: { standard: "\ubc25 \uba39\uc5c8\uc5b4?", dialect: "\ubc25 \ubb3c\uc5c8\uc5b4?" }, color: "#00f5d4" },
    daejeon: { nameKr: "\ub300\uc804", nameEn: "Daejeon", x: 48, y: 50,
      famous: ["\uc5d1\uc2a4\ud3ec\uacfc\ud559\uacf5\uc6d0", "\uc720\uc131\uc628\ucc9c", "\ub300\uc804\uc131"], food: ["\uc131\uc2ec\ub2f9 \ube75", "\uce7c\uad6d\uc218", "\ub450\ubd80\ub450\ub8e8\uce58\uae30"],
      dialect: "\ucda9\uccad\ub3c4 \uc0ac\ud22c\ub9ac", dialectEx: { standard: "\uc65c \uadf8\ub798?", dialect: "\uc65c \uadf8\ub77c\uc720?" }, color: "#9d4edd" },
    ulsan: { nameKr: "\uc6b8\uc0b0", nameEn: "Ulsan", x: 82, y: 62,
      famous: ["\uc6b8\uc0b0\ub300\uacf5\uc6d0", "\uac04\uc808\uacf6", "\ub300\uc655\uc554"], food: ["\uc5b8\uc591\ubd88\uace0\uae30", "\uace0\ub798\uace0\uae30", "\ubb3c\ud68c"],
      dialect: "\uacbd\uc0c1\ub3c4 \uc0ac\ud22c\ub9ac", dialectEx: { standard: "\uc5b4\ub514 \uac00?", dialect: "\uc5b4\ub514 \uac00\ub098?" }, color: "#ffd700" },
    sejong: { nameKr: "\uc138\uc885", nameEn: "Sejong", x: 45, y: 44,
      famous: ["\uc815\ubd80\uc885\ud569\uccad\uc0ac", "\uc138\uc885\ud638\uc218\uacf5\uc6d0"], food: ["\uc870\uce58\uc6d0 \ub5a1\uac08\ube44"],
      dialect: "\ud45c\uc900\uc5b4", dialectEx: null, color: "#e0aaff" },
    gyeonggi: { nameKr: "\uacbd\uae30", nameEn: "Gyeonggi", x: 45, y: 34,
      famous: ["\uc218\uc6d0\ud654\uc131", "\uc5d0\ubc84\ub79c\ub4dc", "\ud30c\uc8fc DMZ"], food: ["\uc218\uc6d0\uac08\ube44", "\uc774\ucc9c \uc308\ubc25", "\ud3c9\ud0dd \ub0c9\uba74"],
      dialect: "\ud45c\uc900\uc5b4", dialectEx: null, color: "#ff85a1" },
    gangwon: { nameKr: "\uac15\uc6d0", nameEn: "Gangwon", x: 68, y: 25,
      famous: ["\uc124\uc545\uc0b0", "\uac15\ub989 \uacbd\ud3ec\ub300", "\ub0a8\uc774\uc12c"], food: ["\uac10\uc790\uc625\uc218\uc218", "\ub2ed\uac08\ube44", "\ub9c9\uad6d\uc218"],
      dialect: "\uac15\uc6d0\ub3c4 \uc0ac\ud22c\ub9ac", dialectEx: { standard: "\uc65c \uc774\ub798?", dialect: "\uc65c \uc774\ub798\uc720?" }, color: "#48bfe3" },
    chungbuk: { nameKr: "\ucda9\ubd81", nameEn: "Chungbuk", x: 58, y: 42,
      famous: ["\uc18d\ub9ac\uc0b0", "\uccad\uc8fc \uc218\uc548\ubcf4", "\ucda9\uc8fc\uc131"], food: ["\uccad\uad6d\uc7a5\ucc0c\uac1c", "\uc62c\ucc45\uc774 \uc21c\ub300"],
      dialect: "\ucda9\uccad\ub3c4 \uc0ac\ud22c\ub9ac", dialectEx: { standard: "\uadf8\ub798?", dialect: "\uadf8\ub77c\uc720?" }, color: "#72efdd" },
    chungnam: { nameKr: "\ucda9\ub0a8", nameEn: "Chungnam", x: 35, y: 48,
      famous: ["\uacf5\uc8fc \uacf5\uc0b0\uc131", "\ubcf4\ub839 \uba38\ub4dc\ud50c\ub7ab"], food: ["\uccad\uc591\uace0\ucd94", "\uad7f\ub3c4\ub9ac"],
      dialect: "\ucda9\uccad\ub3c4 \uc0ac\ud22c\ub9ac", dialectEx: { standard: "\ubc25 \uba39\uc790", dialect: "\ubc25 \uba39\uc790\uc720" }, color: "#b8c0ff" },
    jeonbuk: { nameKr: "\uc804\ubd81", nameEn: "Jeonbuk", x: 38, y: 60,
      famous: ["\uc804\uc8fc \ud55c\uc625\ub9c8\uc744", "\ub0b4\uc7a5\uc0b0"], food: ["\uc804\uc8fc\ube44\ube54\ubc25", "\ucf69\ub098\ubb3c", "\ud55c\uc815\uc2dd"],
      dialect: "\uc804\ub77c\ub3c4 \uc0ac\ud22c\ub9ac", dialectEx: { standard: "\ub098 \ub3c4 \uac00\uc790", dialect: "\ub098\ub3c4 \uac00\uc7a5" }, color: "#ffc6ff" },
    jeonnam: { nameKr: "\uc804\ub0a8", nameEn: "Jeonnam", x: 32, y: 78,
      famous: ["\uc21c\ucc9c\ub9cc", "\uc5ec\uc218 \ubc24\ubc14\ub2e4", "\ub2f4\uc591"], food: ["\ub099\uc9c0\uc644\uc790", "\uc7a5\uc5b4\ud0d5", "\ud64d\uc5b4\ud68c"],
      dialect: "\uc804\ub77c\ub3c4 \uc0ac\ud22c\ub9ac", dialectEx: { standard: "\uace0\ub9c8\uc6cc", dialect: "\uace0\ub9d9\uc5b4\ub77c\uc624" }, color: "#caffbf" },
    gyeongbuk: { nameKr: "\uacbd\ubd81", nameEn: "Gyeongbuk", x: 72, y: 40,
      famous: ["\uacbd\uc8fc \ubd88\uad6d\uc0ac", "\uc548\ub3d9 \ud558\ud68c\ub9c8\uc744"], food: ["\uc548\ub3d9\ucc1c\ub2ed", "\uacbd\uc8fc\ube75", "\uacfc\uba54\uae30"],
      dialect: "\uacbd\uc0c1\ub3c4 \uc0ac\ud22c\ub9ac", dialectEx: { standard: "\uc54c\uaca0\uc5b4", dialect: "\uc54c\uaca0\ub2e4 \uc544\uc774\uac00" }, color: "#a0c4ff" },
    gyeongnam: { nameKr: "\uacbd\ub0a8", nameEn: "Gyeongnam", x: 65, y: 75,
      famous: ["\ud1b5\uc601 \ud55c\uc0b0\ub3c4", "\uc9c4\uc8fc\uc131"], food: ["\ud1b5\uc601 \ucda9\ubb34\uae40\ubc25", "\uc9c4\uc8fc\ube44\ube54\ubc25"],
      dialect: "\uacbd\uc0c1\ub3c4 \uc0ac\ud22c\ub9ac", dialectEx: { standard: "\ub098 \uba3c\uc800 \uac08\uac8c", dialect: "\ub0b4 \uba3c\uc800 \uac08\uaed8" }, color: "#fdffb6" },
    jeju: { nameKr: "\uc81c\uc8fc", nameEn: "Jeju", x: 40, y: 95,
      famous: ["\ud55c\ub77c\uc0b0", "\uc131\uc0b0\uc77c\ucd9c\ubd09", "\uc6b0\ub3c4"], food: ["\ud751\ub3fc\uc9c0", "\ud55c\ub77c\ubd09", "\uc804\ubcf5"],
      dialect: "\uc81c\uc8fc \ubc29\uc5b8", dialectEx: { standard: "\uc548\ub155\ud558\uc138\uc694", dialect: "\ud63c\uc800\uc635\uc11c\uc608" }, color: "#ffc300" }
  };

  /** @type {Array<Array<string>>} Neighbor connections for map lines */
  var regionLinks = [
    ["seoul", "gyeonggi"], ["gyeonggi", "incheon"], ["gyeonggi", "gangwon"],
    ["gyeonggi", "chungbuk"], ["gyeonggi", "chungnam"], ["chungbuk", "chungnam"],
    ["chungbuk", "gyeongbuk"], ["chungbuk", "sejong"], ["chungnam", "sejong"],
    ["chungnam", "daejeon"], ["chungnam", "jeonbuk"], ["daejeon", "sejong"],
    ["jeonbuk", "jeonnam"], ["jeonbuk", "gyeongnam"], ["jeonnam", "gwangju"],
    ["gyeongbuk", "daegu"], ["gyeongbuk", "gyeongnam"], ["gyeongnam", "busan"],
    ["gyeongnam", "ulsan"], ["daegu", "ulsan"], ["daegu", "gyeongnam"],
    ["gangwon", "gyeongbuk"]
  ];

  var selectedRegion = null;
  var mapQuizScore = 0;
  var mapQuizIndex = 0;
  var mapQuizQuestions = [];

  /** @private Inject Korea map CSS styles once. */
  function injectMapCSS() {
    if (document.getElementById("korea-map-style")) return;
    var s = document.createElement("style");
    s.id = "korea-map-style";
    s.textContent =
      ".km-wrap{background:rgba(20,10,40,0.85);border-radius:16px;border:1px solid rgba(255,255,255,0.08);padding:20px;margin-bottom:20px}" +
      ".km-svg{width:100%;max-width:500px;display:block;margin:0 auto}" +
      ".km-node{cursor:pointer;transition:filter 0.3s}" +
      ".km-node:hover .km-circle{filter:drop-shadow(0 0 12px currentColor)}" +
      ".km-panel{background:rgba(15,5,30,0.95);border:1px solid rgba(255,45,149,0.3);border-radius:14px;padding:18px;margin-top:16px;animation:kmFadeIn .3s ease}" +
      ".km-panel h3{margin:0 0 10px;font-size:1.2rem;background:linear-gradient(135deg,#ff2d95,#00d4ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent}" +
      ".km-tag{display:inline-block;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:20px;padding:4px 12px;margin:3px;font-size:.8rem;color:#fff}" +
      ".km-speak{background:linear-gradient(135deg,#ff2d95,#9d4edd);border:none;border-radius:10px;padding:8px 16px;color:#fff;cursor:pointer;font-size:.85rem;margin:4px}" +
      ".km-speak:hover{filter:brightness(1.2)}" +
      ".km-quiz-opt{display:block;width:100%;background:rgba(255,255,255,0.05);border:2px solid rgba(255,255,255,0.15);border-radius:12px;padding:14px;margin:8px 0;color:#fff;font-size:1rem;cursor:pointer;text-align:left;transition:all .3s}" +
      ".km-quiz-opt:hover{border-color:#ff2d95;background:rgba(255,45,149,0.1)}" +
      ".km-quiz-opt.correct{border-color:#00f5d4;background:rgba(0,245,212,0.15)}" +
      ".km-quiz-opt.wrong{border-color:#ff4757;background:rgba(255,71,87,0.15)}" +
      ".km-dialect-row{display:flex;gap:12px;margin:10px 0;flex-wrap:wrap}" +
      ".km-dialect-card{flex:1;min-width:140px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;text-align:center}" +
      ".km-dialect-card h4{margin:0 0 6px;font-size:.75rem;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:1px}" +
      ".km-dialect-card p{margin:0;font-size:1.3rem;color:#fff}" +
      ".km-score{text-align:center;font-size:2rem;font-weight:bold;background:linear-gradient(135deg,#ff2d95,#ffd700);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:12px 0}" +
      ".km-nav{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}" +
      ".km-nav-btn{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);border-radius:10px;padding:8px 16px;color:#fff;font-size:.85rem;cursor:pointer;transition:all .3s}" +
      ".km-nav-btn:hover{border-color:#ff2d95;background:rgba(255,45,149,0.1)}" +
      ".km-nav-btn.active{background:linear-gradient(135deg,#ff2d95,#9d4edd);border-color:transparent}" +
      ".km-food-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;margin-top:12px}" +
      ".km-food-item{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:10px;text-align:center;cursor:pointer;transition:all .3s}" +
      ".km-food-item:hover{border-color:#ffd700;background:rgba(255,215,0,0.08)}" +
      "@keyframes kmFadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}" +
      "@media(max-width:600px){.km-dialect-row{flex-direction:column}}";
    document.head.appendChild(s);
  }

  /**
   * Shuffle array using Fisher-Yates.
   * @param {Array} arr - Input array.
   * @returns {Array} Shuffled copy.
   */
  function shuffleArr(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /** @returns {Array<string>} All region keys. */
  function regionKeys() { return Object.keys(koreaRegions); }

  /**
   * Build sub-navigation bar HTML.
   * @param {string} active - Active view key.
   * @returns {string} Navigation HTML.
   */
  function buildMapNav(active) {
    var views = [
      { key: "map", label: "\ud55c\uad6d \uc9c0\ub3c4" }, { key: "quiz", label: "\uc9c0\uc5ed \ud034\uc988" },
      { key: "dialect", label: "\uc0ac\ud22c\ub9ac \ud559\uc2b5" }, { key: "food", label: "\uc74c\uc2dd \uc5ec\ud589" }
    ];
    var h = '<div class="km-nav" role="tablist" aria-label="Korea map views">';
    for (var i = 0; i < views.length; i++) {
      var cls = views[i].key === active ? " active" : "";
      h += '<button class="km-nav-btn' + cls + '" role="tab" ';
      h += 'aria-selected="' + (views[i].key === active) + '" ';
      h += 'data-km-view="' + escapeHtml(views[i].key) + '">' + escapeHtml(views[i].label) + '</button>';
    }
    return h + '</div>';
  }

  /**
   * Bind navigation button click events.
   * @param {HTMLElement} c - Parent container.
   */
  function bindMapNav(c) {
    var btns = c.querySelectorAll("[data-km-view]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function (e) {
        var view = e.currentTarget.getAttribute("data-km-view");
        var area = document.getElementById("gameArea");
        if (!area) return;
        var viewMap = { map: showInteractiveKoreaMap, quiz: showRegionQuiz, dialect: showDialectLearning, food: showFoodTour };
        if (viewMap[view]) viewMap[view](area);
      });
    }
  }

  /**
   * Bind TTS buttons inside a container.
   * @param {HTMLElement} el - Container element.
   */
  function bindSpeakButtons(el) {
    var btns = el.querySelectorAll("[data-speak]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function (e) {
        var text = e.currentTarget.getAttribute("data-speak");
        if (text && typeof speakKorean === "function") speakKorean(text);
      });
    }
  }

  /**
   * Build SVG map with 17 region nodes and connection lines.
   * @returns {string} SVG markup.
   */
  function buildKoreaSVG() {
    var h = '<svg class="km-svg" viewBox="0 0 100 105" role="img" aria-label="\ud55c\uad6d \uc9c0\ub3c4">';
    h += '<defs><filter id="kmGlow"><feGaussianBlur stdDeviation="1.5" result="b"/>';
    h += '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
    for (var li = 0; li < regionLinks.length; li++) {
      var r1 = koreaRegions[regionLinks[li][0]], r2 = koreaRegions[regionLinks[li][1]];
      if (!r1 || !r2) continue;
      h += '<line x1="' + r1.x + '" y1="' + r1.y + '" x2="' + r2.x + '" y2="' + r2.y + '" stroke="rgba(255,255,255,0.12)" stroke-width="0.3"/>';
    }
    var keys = regionKeys();
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i], r = koreaRegions[k];
      h += '<g class="km-node" data-region="' + escapeHtml(k) + '">';
      h += '<circle class="km-circle" cx="' + r.x + '" cy="' + r.y + '" r="3.5" fill="' + r.color + '" stroke="rgba(255,255,255,0.3)" stroke-width="0.3" style="color:' + r.color + '"/>';
      h += '<text x="' + r.x + '" y="' + (r.y + 6) + '" text-anchor="middle" fill="#fff" font-size="2.2" font-weight="bold">' + escapeHtml(r.nameKr) + '</text></g>';
    }
    return h + '</svg>';
  }

  /**
   * Show SVG-based interactive Korea map with clickable regions.
   * Hover triggers neon glow; click opens region info panel with TTS.
   * @param {HTMLElement} container - DOM element to render into.
   */
  function showInteractiveKoreaMap(container) {
    injectMapCSS();
    selectedRegion = null;
    var h = '<h2 class="game-title">\ud55c\uad6d \uc9c0\ub3c4 \ud559\uc2b5</h2>';
    h += buildMapNav("map");
    h += '<div class="km-wrap">' + buildKoreaSVG() + '</div>';
    h += '<div id="kmRegionPanel"></div>';
    container.innerHTML = h;
    bindMapNav(container);
    var nodes = container.querySelectorAll(".km-node");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].addEventListener("click", function (e) {
        var key = e.currentTarget.getAttribute("data-region");
        if (!key || !koreaRegions[key]) return;
        selectedRegion = key;
        showRegionPanel(key);
        if (typeof speakKorean === "function") speakKorean(koreaRegions[key].nameKr);
      });
    }
  }

  /**
   * Display region info panel (landmarks, food, dialect) below map.
   * @param {string} key - Region key.
   */
  function showRegionPanel(key) {
    var panel = document.getElementById("kmRegionPanel");
    if (!panel) return;
    var r = koreaRegions[key];
    var h = '<div class="km-panel">';
    h += '<h3>' + escapeHtml(r.nameKr) + ' (' + escapeHtml(r.nameEn) + ')</h3>';
    h += '<p style="color:rgba(255,255,255,0.7);font-size:.85rem;margin:0 0 10px">' + escapeHtml(r.dialect) + '</p>';
    h += '<p style="font-size:.8rem;color:rgba(255,255,255,0.5);margin:4px 0">Famous</p>';
    for (var fi = 0; fi < r.famous.length; fi++) h += '<span class="km-tag">' + escapeHtml(r.famous[fi]) + '</span>';
    h += '<p style="font-size:.8rem;color:rgba(255,255,255,0.5);margin:10px 0 4px">Food</p>';
    for (var fo = 0; fo < r.food.length; fo++) h += '<span class="km-tag">' + escapeHtml(r.food[fo]) + '</span>';
    if (r.dialectEx) {
      h += '<div class="km-dialect-row" style="margin-top:12px">';
      h += '<div class="km-dialect-card"><h4>\ud45c\uc900\uc5b4</h4><p>' + escapeHtml(r.dialectEx.standard) + '</p>';
      h += '<button class="km-speak" data-speak="' + escapeHtml(r.dialectEx.standard) + '">\ud45c\uc900\uc5b4 \ub4e3\uae30</button></div>';
      h += '<div class="km-dialect-card"><h4>\uc0ac\ud22c\ub9ac</h4><p>' + escapeHtml(r.dialectEx.dialect) + '</p>';
      h += '<button class="km-speak" data-speak="' + escapeHtml(r.dialectEx.dialect) + '">\uc0ac\ud22c\ub9ac \ub4e3\uae30</button></div></div>';
    }
    h += '<div style="margin-top:12px;text-align:center">';
    h += '<button class="km-speak" data-speak="' + escapeHtml(r.nameKr) + '">' + escapeHtml(r.nameKr) + ' \ubc1c\uc74c \ub4e3\uae30</button></div></div>';
    panel.innerHTML = h;
    bindSpeakButtons(panel);
  }

  /**
   * Show region quiz: food origin and dialect identification, 4 choices.
   * Correct answers glow green; wrong answers show correct region.
   * @param {HTMLElement} container - DOM element to render into.
   */
  function showRegionQuiz(container) {
    injectMapCSS();
    mapQuizScore = 0;
    mapQuizIndex = 0;
    mapQuizQuestions = buildQuizQuestions();
    renderQuizQuestion(container);
  }

  /**
   * Build quiz question pool from region food and dialect data.
   * @returns {Array<Object>} Shuffled array of 10 question objects.
   */
  function buildQuizQuestions() {
    var questions = [], keys = regionKeys();
    for (var i = 0; i < keys.length; i++) {
      var r = koreaRegions[keys[i]];
      for (var fi = 0; fi < r.food.length; fi++) {
        questions.push({ type: "food", prompt: "'" + r.food[fi] + "' \uc740(\ub294) \uc5b4\ub290 \uc9c0\uc5ed\uc758 \uc74c\uc2dd\uc77c\uae4c\uc694?", answer: keys[i], item: r.food[fi] });
      }
      if (r.dialectEx) {
        questions.push({ type: "dialect", prompt: "'" + r.dialectEx.dialect + "' \uc740(\ub294) \uc5b4\ub290 \uc9c0\uc5ed\uc758 \uc0ac\ud22c\ub9ac\uc77c\uae4c\uc694?", answer: keys[i], item: r.dialectEx.dialect });
      }
    }
    return shuffleArr(questions).slice(0, 10);
  }

  /**
   * Render current quiz question or result screen.
   * @param {HTMLElement} container - DOM element to render into.
   */
  function renderQuizQuestion(container) {
    var h = '<h2 class="game-title">\uc9c0\uc5ed \ud034\uc988</h2>' + buildMapNav("quiz");
    if (mapQuizIndex >= mapQuizQuestions.length) {
      var total = mapQuizQuestions.length;
      var pct = total > 0 ? Math.round((mapQuizScore / total) * 100) : 0;
      h += '<div class="km-wrap" style="text-align:center">';
      h += '<p style="font-size:1rem;color:rgba(255,255,255,0.6);margin:0 0 8px">\ud034\uc988 \uc644\ub8cc!</p>';
      h += '<div class="km-score">' + escapeHtml(mapQuizScore + " / " + total) + '</div>';
      h += '<p style="color:rgba(255,255,255,0.5);font-size:.9rem">' + pct + '%</p>';
      h += '<button class="km-speak" style="margin-top:16px" data-km-view="quiz">\ub2e4\uc2dc \ub3c4\uc804</button></div>';
      container.innerHTML = h;
      bindMapNav(container);
      return;
    }
    var q = mapQuizQuestions[mapQuizIndex];
    h += '<div class="km-wrap">';
    h += '<p style="font-size:.8rem;color:rgba(255,255,255,0.4);margin:0 0 6px">' + escapeHtml((mapQuizIndex + 1) + " / " + mapQuizQuestions.length) + '</p>';
    h += '<p style="font-size:1.1rem;color:#fff;margin:0 0 16px">' + escapeHtml(q.prompt) + '</p>';
    var opts = generateOptions(q.answer, 4);
    for (var oi = 0; oi < opts.length; oi++) {
      var region = koreaRegions[opts[oi]];
      h += '<button class="km-quiz-opt" data-quiz-answer="' + escapeHtml(opts[oi]) + '">' + escapeHtml(region.nameKr) + ' (' + escapeHtml(region.nameEn) + ')</button>';
    }
    h += '</div>';
    container.innerHTML = h;
    bindMapNav(container);
    bindQuizOptions(container);
  }

  /**
   * Generate 4 quiz options including the correct answer.
   * @param {string} correct - Correct region key.
   * @param {number} count - Total options count.
   * @returns {Array<string>} Shuffled option keys.
   */
  function generateOptions(correct, count) {
    var keys = regionKeys().filter(function (k) { return k !== correct; });
    var wrong = shuffleArr(keys).slice(0, count - 1);
    wrong.push(correct);
    return shuffleArr(wrong);
  }

  /**
   * Bind click events to quiz option buttons.
   * @param {HTMLElement} container - Parent container.
   */
  function bindQuizOptions(container) {
    var opts = container.querySelectorAll("[data-quiz-answer]");
    for (var i = 0; i < opts.length; i++) {
      opts[i].addEventListener("click", function (e) {
        var chosen = e.currentTarget.getAttribute("data-quiz-answer");
        var q = mapQuizQuestions[mapQuizIndex];
        var allOpts = container.querySelectorAll("[data-quiz-answer]");
        for (var j = 0; j < allOpts.length; j++) {
          allOpts[j].style.pointerEvents = "none";
          if (allOpts[j].getAttribute("data-quiz-answer") === q.answer) allOpts[j].classList.add("correct");
        }
        if (chosen === q.answer) {
          mapQuizScore++;
          e.currentTarget.classList.add("correct");
          if (typeof addXP === "function") addXP(15);
          if (typeof showToast === "function") showToast("\uc815\ub2f5! +15 XP");
        } else {
          e.currentTarget.classList.add("wrong");
          if (typeof showToast === "function") showToast("\uc815\ub2f5: " + koreaRegions[q.answer].nameKr);
        }
        mapQuizIndex++;
        setTimeout(function () {
          var area = document.getElementById("gameArea");
          if (area) renderQuizQuestion(area);
        }, 1200);
      });
    }
  }

  /**
   * Show dialect comparison mode: standard Korean vs regional dialects.
   * Each region card has side-by-side comparison with TTS buttons.
   * @param {HTMLElement} container - DOM element to render into.
   */
  function showDialectLearning(container) {
    injectMapCSS();
    var h = '<h2 class="game-title">\uc0ac\ud22c\ub9ac \ud559\uc2b5</h2>' + buildMapNav("dialect");
    var keys = regionKeys();
    for (var i = 0; i < keys.length; i++) {
      var r = koreaRegions[keys[i]];
      if (!r.dialectEx) continue;
      h += '<div class="km-wrap">';
      h += '<h3 style="margin:0 0 8px;font-size:1rem;color:' + r.color + '">' + escapeHtml(r.nameKr) + ' ' + escapeHtml(r.dialect) + '</h3>';
      h += '<div class="km-dialect-row">';
      h += '<div class="km-dialect-card"><h4>\ud45c\uc900\uc5b4</h4><p>' + escapeHtml(r.dialectEx.standard) + '</p>';
      h += '<button class="km-speak" data-speak="' + escapeHtml(r.dialectEx.standard) + '">\ub4e3\uae30</button></div>';
      h += '<div class="km-dialect-card"><h4>\uc0ac\ud22c\ub9ac</h4><p>' + escapeHtml(r.dialectEx.dialect) + '</p>';
      h += '<button class="km-speak" data-speak="' + escapeHtml(r.dialectEx.dialect) + '">\ub4e3\uae30</button></div>';
      h += '</div></div>';
    }
    container.innerHTML = h;
    bindMapNav(container);
    bindSpeakButtons(container);
  }

  /**
   * Show regional food tour: click regions on map to explore local cuisine.
   * Each food item is clickable for TTS pronunciation.
   * @param {HTMLElement} container - DOM element to render into.
   */
  function showFoodTour(container) {
    injectMapCSS();
    var h = '<h2 class="game-title">\uc9c0\uc5ed \uc74c\uc2dd \uc5ec\ud589</h2>' + buildMapNav("food");
    h += '<div class="km-wrap"><p style="color:rgba(255,255,255,0.6);font-size:.9rem;margin:0 0 12px">';
    h += '\uc9c0\uc5ed\uc744 \uc120\ud0dd\ud558\uba74 \ub300\ud45c \uc74c\uc2dd\uc744 \ud655\uc778\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.</p>';
    h += buildKoreaSVG() + '</div><div id="kmFoodPanel"></div>';
    container.innerHTML = h;
    bindMapNav(container);
    var nodes = container.querySelectorAll(".km-node");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].addEventListener("click", function (e) {
        var key = e.currentTarget.getAttribute("data-region");
        if (!key || !koreaRegions[key]) return;
        showFoodPanel(key);
        if (typeof speakKorean === "function") speakKorean(koreaRegions[key].nameKr);
      });
    }
  }

  /**
   * Display food info panel for a specific region.
   * @param {string} key - Region key.
   */
  function showFoodPanel(key) {
    var panel = document.getElementById("kmFoodPanel");
    if (!panel) return;
    var r = koreaRegions[key];
    var h = '<div class="km-panel"><h3>' + escapeHtml(r.nameKr) + ' \ub300\ud45c \uc74c\uc2dd</h3><div class="km-food-grid">';
    for (var fi = 0; fi < r.food.length; fi++) {
      h += '<div class="km-food-item" data-speak="' + escapeHtml(r.food[fi]) + '">';
      h += '<div style="font-size:1.3rem;margin-bottom:4px">' + escapeHtml(r.food[fi]) + '</div>';
      h += '<div style="font-size:.7rem;color:rgba(255,255,255,0.5)">\ud074\ub9ad\ud558\uc5ec \ubc1c\uc74c \ub4e3\uae30</div></div>';
    }
    h += '</div></div>';
    panel.innerHTML = h;
    var items = panel.querySelectorAll("[data-speak]");
    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener("click", function (e) {
        var text = e.currentTarget.getAttribute("data-speak");
        if (text && typeof speakKorean === "function") speakKorean(text);
        if (typeof showToast === "function") showToast(text);
      });
    }
  }

  // Global exposure
  window.showInteractiveKoreaMap = showInteractiveKoreaMap;
  window.showRegionQuiz = showRegionQuiz;
  window.showDialectLearning = showDialectLearning;
  window.showFoodTour = showFoodTour;
})();

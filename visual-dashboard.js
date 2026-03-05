/**
 * visual-dashboard.js
 * Comprehensive learning dashboard with Chart.js visualizations,
 * word cloud, growth timeline, and RPG-style level map.
 * Requires: main-app.js, security-utils.js (loaded before this file)
 * Uses globals: escapeHtml, gameState, saveProgress, showToast,
 *   getWords, speakKorean, wordDatabase
 */
(function () {
  "use strict";
  /** @type {string} localStorage key for daily history */
  var HK = "kpop_learning_history";
  /** @type {string} localStorage key for milestones */
  var MK = "kpop_milestones";
  /** @type {string} localStorage key for mode usage */
  var UK = "kpop_mode_usage";
  /** @type {string} localStorage key for category accuracy */
  var CK = "kpop_category_accuracy";
  /** @type {string} sessionStorage key for session start */
  var SK = "kpop_session_start";
  /** @type {Object} Neon palette */
  var C = { pk: "#ff2d95", pp: "#9d4edd", cy: "#00d4ff", mt: "#00f5d4", gd: "#ffd700", fi: "#ff6b35", bl: "#4361ee" };
  /** @type {Array} Word cloud hit-boxes */
  var cloudItems = [];
  /** @param {string} k @param {*} fb @returns {*} Parse localStorage JSON. */
  function lg(k, fb) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch (_) { return fb; } }
  /** @param {string} k @param {*} v Save JSON to localStorage. */
  function ls(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) { /* skip */ } }
  /** @returns {string} Today YYYY-MM-DD. */
  function td() { return new Date().toISOString().slice(0, 10); }
  /**
   * Record a learning activity for today.
   * @param {string} type - "word" or "quiz".
   * @param {number} count - Items completed.
   */
  function recordActivity(type, count) {
    var h = lg(HK, {}), d = td();
    if (!h[d]) h[d] = { words: 0, quizzes: 0, xp: 0 };
    if (type === "word") h[d].words += count;
    if (type === "quiz") h[d].quizzes += count;
    h[d].xp = gameState.xp; ls(HK, h);
  }
  /**
   * Record a quiz answer for a category.
   * @param {string} cat - Category name.
   * @param {boolean} ok - Whether correct.
   */
  function recordCategoryAnswer(cat, ok) {
    var d = lg(CK, {}); if (!d[cat]) d[cat] = { correct: 0, total: 0 };
    d[cat].total++; if (ok) d[cat].correct++; ls(CK, d);
  }
  /** @param {string} mode - Increment mode usage count. */
  function trackModeUsage(mode) { var u = lg(UK, {}); u[mode] = (u[mode] || 0) + 1; ls(UK, u); }
  /**
   * Add milestone if not already recorded.
   * @param {string} id - Unique id. @param {string} title - Display title. @param {string} icon - HTML entity.
   */
  function addMilestone(id, title, icon) {
    var list = lg(MK, []);
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) return; }
    list.push({ id: id, title: title, icon: icon, date: td() }); ls(MK, list);
  }
  /** Record session start if not set. */
  function initSess() { if (!sessionStorage.getItem(SK)) sessionStorage.setItem(SK, String(Date.now())); }
  /** @returns {number} Session minutes elapsed. */
  function sessMin() { var s = sessionStorage.getItem(SK); return s ? Math.floor((Date.now() - parseInt(s, 10)) / 60000) : 0; }
  /** @returns {number} Total estimated study minutes. */
  function studyMin() {
    var h = lg(HK, {}), tw = 0, tq = 0;
    for (var k in h) { if (h.hasOwnProperty(k)) { tw += h[k].words || 0; tq += h[k].quizzes || 0; } }
    return Math.max(Math.round(tw * 0.5 + tq * 1.5), sessMin());
  }
  /** @param {number} m @returns {string} Formatted time. */
  function fmtT(m) { return m < 60 ? m + "m" : Math.floor(m / 60) + "h " + (m % 60) + "m"; }
  /**
   * Ensure Chart.js is loaded.
   * @returns {Promise<boolean>} True if available.
   */
  function loadCJ() {
    return new Promise(function (res) {
      if (typeof Chart !== "undefined") { cfgCJ(); return res(true); }
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js";
      s.onload = function () { cfgCJ(); res(true); }; s.onerror = function () { res(false); };
      document.head.appendChild(s);
    });
  }
  /** Configure Chart.js defaults. */
  function cfgCJ() { if (typeof Chart === "undefined") return; Chart.defaults.color = "#ffffff"; Chart.defaults.borderColor = "rgba(255,255,255,0.1)"; Chart.defaults.font.family = "'Noto Sans KR',sans-serif"; }
  /** @returns {Object} Weekly labels, words, quizzes. */
  function wkData() {
    var h = lg(HK, {}), lb = [], w = [], q = [], dn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (var i = 6; i >= 0; i--) { var d = new Date(); d.setDate(d.getDate() - i); lb.push(dn[d.getDay()]); var e = h[d.toISOString().slice(0, 10)] || {}; w.push(e.words || 0); q.push(e.quizzes || 0); }
    return { labels: lb, words: w, quizzes: q };
  }
  /** @returns {Object} 30-day XP trend. */
  function xpData() {
    var h = lg(HK, {}), lb = [], xd = [], cx = 0;
    for (var i = 29; i >= 0; i--) { var d = new Date(); d.setDate(d.getDate() - i); lb.push("D" + (30 - i)); var e = h[d.toISOString().slice(0, 10)]; if (e && e.xp) cx += e.xp; xd.push(cx); }
    if (cx === 0) xd[xd.length - 1] = gameState.xp + (gameState.level - 1) * 100;
    return { labels: lb, data: xd };
  }
  /** @returns {Object} Radar labels and values. */
  function rdData() {
    var cats = ["Greetings", "Food", "Numbers", "Culture", "Grammar", "K-POP"], cm = { Greetings: ["daily", "sentences"], Food: ["kfood"], Numbers: ["numbers", "counters"], Culture: ["kculture", "holidays"], Grammar: ["topik", "sentences"], "K-POP": ["kdrama", "emoticons", "textslang"] };
    var acc = lg(CK, {}), v = [];
    for (var i = 0; i < cats.length; i++) { var m = cm[cats[i]] || [], tc = 0, tt = 0; for (var j = 0; j < m.length; j++) { var a = acc[m[j]]; if (a) { tc += a.correct; tt += a.total; } } v.push(tt > 0 ? Math.round(tc / tt * 100) : 20); }
    return { labels: cats, data: v };
  }
  /** @returns {Object} Doughnut labels, data, colors. */
  function dnData() {
    var u = lg(UK, {}), md = ["Flashcards", "Quiz", "Memory", "AI Features", "Culture", "Other"], mm = { Flashcards: ["flashcards"], Quiz: ["quiz", "speed", "boss"], Memory: ["memory", "match"], "AI Features": ["ai", "conversation", "handwriting"], Culture: ["culture", "kpop", "drama"] };
    var data = [], used = {};
    for (var i = 0; i < md.length - 1; i++) { var ks = mm[md[i]] || [], t = 0; for (var j = 0; j < ks.length; j++) { t += u[ks[j]] || 0; used[ks[j]] = true; } data.push(t || 1); }
    var ot = 0; for (var k in u) { if (u.hasOwnProperty(k) && !used[k]) ot += u[k]; } data.push(ot || 1);
    return { labels: md, data: data, colors: [C.pk, C.pp, C.cy, C.gd, C.mt, C.bl] };
  }
  /** Inject dashboard CSS once. */
  function css() {
    if (document.getElementById("vd-css")) return;
    var s = document.createElement("style"); s.id = "vd-css";
    s.textContent = ".dash-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}.dash-card{background:rgba(20,10,40,.8);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:20px;text-align:center;position:relative;overflow:hidden}.dash-card::before{content:'';position:absolute;inset:0;border-radius:16px;padding:1px;background:linear-gradient(135deg,rgba(255,45,149,.3),rgba(0,212,255,.3));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude}.dash-card-icon{font-size:1.6rem;margin-bottom:8px}.dash-card-value{font-size:2.2rem;font-weight:bold;background:linear-gradient(135deg,#ff2d95,#00d4ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.dash-card-label{font-size:.75rem;color:rgba(255,255,255,.6);margin-top:4px;text-transform:uppercase;letter-spacing:1px}.dash-xp-bar{width:100%;height:6px;background:rgba(255,255,255,.1);border-radius:3px;margin-top:8px;overflow:hidden}.dash-xp-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#ff2d95,#9d4edd);transition:width 1s ease}" +
      ".dash-charts{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-bottom:24px}.dash-chart-box{background:rgba(20,10,40,.8);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:20px}.dash-chart-box canvas{max-height:260px}.dash-chart-title{font-size:.9rem;color:rgba(255,255,255,.8);margin-bottom:12px;font-weight:600}.dash-heatmap{background:rgba(20,10,40,.8);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:20px}.dash-heatmap-title{font-size:.9rem;color:rgba(255,255,255,.8);margin-bottom:12px;font-weight:600}.dash-heatmap-grid{display:flex;gap:3px;overflow-x:auto;padding-bottom:8px}.dash-heatmap-col{display:flex;flex-direction:column;gap:3px}.dash-heatmap-cell{width:14px;height:14px;border-radius:3px;cursor:pointer;transition:transform .2s;position:relative}.dash-heatmap-cell:hover{transform:scale(1.5);z-index:2}" +
      ".dash-heatmap-tooltip{position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:rgba(10,10,26,.95);border:1px solid rgba(255,255,255,.2);border-radius:8px;padding:6px 10px;font-size:.7rem;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .2s;z-index:10;color:#fff}.dash-heatmap-cell:hover .dash-heatmap-tooltip{opacity:1}.dash-nav{display:flex;gap:10px;margin-bottom:24px;flex-wrap:wrap}.dash-nav-btn{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.15);border-radius:12px;padding:10px 18px;color:#fff;font-size:.85rem;cursor:pointer;transition:all .3s}.dash-nav-btn:hover{border-color:#ff2d95;background:rgba(255,45,149,.1)}.dash-nav-btn.active{background:linear-gradient(135deg,#ff2d95,#9d4edd);border-color:transparent}" +
      ".wc-cv{width:100%;height:400px;border-radius:16px;background:rgba(20,10,40,.8);cursor:crosshair}.wc-tip{position:fixed;background:rgba(10,10,26,.95);border:1px solid rgba(0,212,255,.4);border-radius:10px;padding:10px 16px;color:#fff;font-size:.85rem;pointer-events:none;z-index:999;display:none}.tl-wrap{position:relative;padding-left:40px;margin:20px 0}.tl-line{position:absolute;left:18px;top:0;bottom:0;width:3px;background:linear-gradient(180deg,#ff2d95,#9d4edd,#00d4ff)}.tl-item{position:relative;margin-bottom:30px;padding:16px;background:rgba(20,10,40,.8);border:1px solid rgba(255,255,255,.08);border-radius:12px}.tl-dot{position:absolute;left:-30px;top:20px;width:16px;height:16px;border-radius:50%;background:linear-gradient(135deg,#ff2d95,#9d4edd);border:2px solid #0a0a1a;z-index:1}.tl-date{font-size:.7rem;color:rgba(255,255,255,.4);margin-bottom:4px}.tl-title{font-size:1rem;font-weight:bold;color:#fff}.tl-icon{font-size:1.5rem;position:absolute;right:16px;top:16px}" +
      ".lm-node{cursor:pointer;transition:all .3s}.lm-node:hover{filter:brightness(1.3)}.lm-tip{position:fixed;background:rgba(10,10,26,.95);border:1px solid rgba(255,45,149,.4);border-radius:10px;padding:10px 16px;color:#fff;font-size:.85rem;pointer-events:none;z-index:999;display:none}@media(max-width:768px){.dash-grid{grid-template-columns:repeat(2,1fr)}.dash-charts{grid-template-columns:1fr}}@media(max-width:480px){.dash-grid{grid-template-columns:1fr}}";
    document.head.appendChild(s);
  }
  /**
   * Animate counter from 0 to target.
   * @param {HTMLElement} el - Element. @param {number} tgt - Target. @param {number} dur - Duration ms.
   */
  function anim(el, tgt, dur) {
    var t0 = null;
    function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / dur, 1); el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * tgt).toLocaleString(); if (p < 1) requestAnimationFrame(step); else el.textContent = tgt.toLocaleString(); }
    requestAnimationFrame(step);
  }
  /** @param {CanvasRenderingContext2D} x @param {string} t @param {string} b @returns {CanvasGradient} Vertical gradient. */
  function vg(x, t, b) { var g = x.createLinearGradient(0, 0, 0, 400); g.addColorStop(0, t); g.addColorStop(1, b); return g; }
  /** @param {string} id @param {string} t @returns {string} Chart container HTML. */
  function cBox(id, t) { return '<div class="dash-chart-box"><h3 class="dash-chart-title">' + escapeHtml(t) + '</h3><canvas id="' + escapeHtml(id) + '"></canvas></div>'; }
  /** @param {string} act - Active view key. @returns {string} Nav HTML. */
  function nav(act) {
    var it = [["dashboard", "Dashboard"], ["wordcloud", "Word Cloud"], ["timeline", "Timeline"], ["levelmap", "Level Map"]], h = '<div class="dash-nav" role="tablist" aria-label="Dashboard views">';
    for (var i = 0; i < it.length; i++) { var s = it[i][0] === act; h += '<button class="dash-nav-btn' + (s ? " active" : "") + '" role="tab" aria-selected="' + s + '" data-dv="' + escapeHtml(it[i][0]) + '">' + escapeHtml(it[i][1]) + '</button>'; }
    return h + '</div>';
  }
  /** @param {HTMLElement} c - Bind nav via event delegation. */
  function bindNav(c) {
    c.addEventListener("click", function (e) {
      var b = e.target.closest("[data-dv]"); if (!b) return;
      var v = b.getAttribute("data-dv"), a = document.getElementById("gameArea"); if (!a) return;
      var m = { dashboard: showVisualDashboard, wordcloud: showWordCloud, timeline: showGrowthTimeline, levelmap: showLevelMap };
      if (m[v]) m[v](a);
    });
  }
  /** Check and record milestones from gameState. */
  function chkMile() {
    var ms = [[1, "wordsLearned", "first-word", "First Word Learned!", "&#127775;"], [50, "wordsLearned", "50-words", "50 Words Mastered!", "&#128214;"], [100, "wordsLearned", "100-words", "100 Words Conquered!", "&#128640;"], [250, "wordsLearned", "250-words", "250 Words Scholar!", "&#127891;"], [500, "wordsLearned", "500-words", "500 Words Legend!", "&#128142;"], [5, "level", "level-5", "Level 5 Reached!", "&#11088;"], [10, "level", "level-10", "Level 10 Reached!", "&#127942;"], [25, "level", "level-25", "Level 25 Reached!", "&#128081;"], [7, "streak", "7-streak", "7-Day Streak!", "&#128293;"], [30, "streak", "30-streak", "30-Day Streak!", "&#9889;"], [10, "bestCombo", "combo-10", "10x Combo!", "&#128165;"], [50, "gamesPlayed", "50-games", "50 Games Played!", "&#127918;"], [100, "correctAnswers", "100-correct", "100 Correct Answers!", "&#9989;"]];
    for (var i = 0; i < ms.length; i++) { if (gameState[ms[i][1]] >= ms[i][0]) addMilestone(ms[i][2], ms[i][3], ms[i][4]); }
  }
  /**
   * Show comprehensive visual dashboard.
   * @param {HTMLElement} c - Container element.
   */
  function showVisualDashboard(c) {
    css(); initSess(); chkMile();
    var xpP = Math.min(Math.round(gameState.xp / (gameState.level * 100) * 100), 100);
    var h = '<h2 class="game-title">Learning Dashboard</h2>' + nav("dashboard") + '<div class="dash-grid">';
    h += mkCard("&#128218;", "dW", "Words Learned") + mkCard("&#11088;", "dL", "Level", '<div class="dash-xp-bar"><div class="dash-xp-fill" id="dXB" style="width:0%" data-target="' + xpP + '"></div></div>');
    h += mkCard("&#128293;", "dS", "Day Streak") + mkCard("&#9201;", "dT", "Study Time", null, escapeHtml(fmtT(studyMin())));
    h += '</div><div class="dash-charts">' + cBox("cW", "Weekly Activity") + cBox("cR", "Category Skills") + cBox("cX", "XP Progress (30 Days)") + cBox("cM", "Game Modes") + '</div>' + heatmap();
    c.innerHTML = h; bindNav(c);
    var ew = document.getElementById("dW"), el = document.getElementById("dL"), es = document.getElementById("dS"), xb = document.getElementById("dXB");
    if (ew) anim(ew, gameState.wordsLearned, 1200); if (el) anim(el, gameState.level, 800); if (es) anim(es, gameState.streak, 1000);
    if (xb) setTimeout(function () { xb.style.width = xb.getAttribute("data-target") + "%"; }, 300);
    loadCJ().then(function (ok) { ok ? drawCharts() : fbCharts(); });
  }
  /**
   * Build a stat card.
   * @param {string} ico - Icon HTML entity. @param {string} id - Value id.
   * @param {string} lbl - Label. @param {string} [ext] - Extra HTML. @param {string} [pre] - Preset value.
   * @returns {string} Card HTML.
   */
  function mkCard(ico, id, lbl, ext, pre) {
    return '<div class="dash-card"><div class="dash-card-icon" aria-hidden="true">' + ico + '</div><div class="dash-card-value" id="' + escapeHtml(id) + '">' + (pre || "0") + '</div><div class="dash-card-label">' + escapeHtml(lbl) + '</div>' + (ext || "") + '</div>';
  }
  /** Render all Chart.js charts. */
  function drawCharts() { drawBar(); drawRadar(); drawLine(); drawDonut(); }
  /** Render weekly bar chart. */
  function drawBar() {
    var cv = document.getElementById("cW"); if (!cv || typeof Chart === "undefined") return; var x = cv.getContext("2d"), d = wkData();
    new Chart(x, { type: "bar", data: { labels: d.labels, datasets: [{ label: "Words", data: d.words, backgroundColor: vg(x, "rgba(255,45,149,.8)", "rgba(255,45,149,.2)"), borderColor: C.pk, borderWidth: 1, borderRadius: 6 }, { label: "Quizzes", data: d.quizzes, backgroundColor: vg(x, "rgba(0,212,255,.8)", "rgba(0,212,255,.2)"), borderColor: C.cy, borderWidth: 1, borderRadius: 6 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { padding: 16 } } }, scales: { y: { beginAtZero: true, grid: { color: "rgba(255,255,255,.05)" } }, x: { grid: { display: false } } } } });
  }
  /** Render category radar chart. */
  function drawRadar() {
    var cv = document.getElementById("cR"); if (!cv || typeof Chart === "undefined") return; var x = cv.getContext("2d"), d = rdData();
    new Chart(x, { type: "radar", data: { labels: d.labels, datasets: [{ label: "Accuracy %", data: d.data, backgroundColor: "rgba(157,78,221,.25)", borderColor: C.pp, borderWidth: 2, pointBackgroundColor: C.pk, pointBorderColor: "#fff", pointRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { r: { beginAtZero: true, max: 100, ticks: { stepSize: 20, backdropColor: "transparent" }, grid: { color: "rgba(255,255,255,.1)" }, angleLines: { color: "rgba(255,255,255,.1)" } } }, plugins: { legend: { display: false } } } });
  }
  /** Render 30-day XP line chart. */
  function drawLine() {
    var cv = document.getElementById("cX"); if (!cv || typeof Chart === "undefined") return; var x = cv.getContext("2d"), d = xpData();
    new Chart(x, { type: "line", data: { labels: d.labels, datasets: [{ label: "Cumulative XP", data: d.data, borderColor: C.pk, backgroundColor: vg(x, "rgba(255,45,149,.3)", "rgba(255,45,149,0)"), fill: true, borderWidth: 2, tension: 0.4, pointRadius: 0, pointHoverRadius: 5, pointHoverBackgroundColor: C.pk }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: "rgba(255,255,255,.05)" } }, x: { grid: { display: false }, ticks: { maxTicksLimit: 10, maxRotation: 0 } } } } });
  }
  /** Render mode doughnut chart. */
  function drawDonut() {
    var cv = document.getElementById("cM"); if (!cv || typeof Chart === "undefined") return; var x = cv.getContext("2d"), d = dnData();
    new Chart(x, { type: "doughnut", data: { labels: d.labels, datasets: [{ data: d.data, backgroundColor: d.colors, borderColor: "rgba(10,10,26,.8)", borderWidth: 3, hoverOffset: 8 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: "60%", plugins: { legend: { position: "bottom", labels: { padding: 12, usePointStyle: true, pointStyleWidth: 10 } } } } });
  }
  /** Render Canvas fallback when Chart.js unavailable. */
  function fbCharts() {
    var ids = ["cW", "cR", "cX", "cM"];
    for (var i = 0; i < ids.length; i++) { var el = document.getElementById(ids[i]); if (!el) continue; var x = el.getContext("2d"); el.width = el.parentElement.clientWidth - 40; el.height = 200; x.fillStyle = "rgba(255,255,255,.3)"; x.font = "14px 'Noto Sans KR',sans-serif"; x.textAlign = "center"; x.fillText("Chart.js loading failed. Data is still tracked.", el.width / 2, el.height / 2); }
  }
  /**
   * Build 365-day GitHub-style heatmap.
   * @returns {string} Heatmap HTML.
   */
  function heatmap() {
    var hist = lg(HK, {}), h = '<div class="dash-heatmap"><h3 class="dash-heatmap-title">365-Day Activity</h3><div class="dash-heatmap-grid">';
    var now = new Date(), sd = new Date(now); sd.setDate(sd.getDate() - 364);
    if (sd.getDay() !== 0) sd.setDate(sd.getDate() - sd.getDay());
    var ed = new Date(now); ed.setDate(ed.getDate() + 1);
    var cur = new Date(sd), col = "", hc = ["rgba(255,255,255,.06)", "rgba(0,212,255,.2)", "rgba(0,212,255,.4)", "rgba(0,212,255,.65)", "rgba(0,212,255,.9)"];
    while (cur <= ed) {
      if (cur.getDay() === 0) { if (col) h += '<div class="dash-heatmap-col">' + col + '</div>'; col = ""; }
      var dk = cur.toISOString().slice(0, 10), e = hist[dk] || {}, wc = e.words || 0, lv = wc <= 0 ? 0 : wc <= 3 ? 1 : wc <= 8 ? 2 : wc <= 15 ? 3 : 4;
      col += '<div class="dash-heatmap-cell" style="background:' + hc[lv] + '" aria-label="' + escapeHtml(dk) + ': ' + wc + ' words"><div class="dash-heatmap-tooltip">' + escapeHtml(dk) + '<br>' + wc + ' words</div></div>';
      cur.setDate(cur.getDate() + 1);
    }
    if (col) h += '<div class="dash-heatmap-col">' + col + '</div>';
    return h + '</div></div>';
  }
  /**
   * Show Canvas-based word cloud.
   * @param {HTMLElement} c - Container element.
   */
  function showWordCloud(c) {
    css(); cloudItems = [];
    c.innerHTML = '<h2 class="game-title">Word Cloud</h2>' + nav("wordcloud") + '<canvas id="wcCv" class="wc-cv"></canvas><div class="wc-tip" id="wcT"></div>';
    bindNav(c);
    var cv = document.getElementById("wcCv"); if (!cv) return;
    var ctx = cv.getContext("2d"); cv.width = cv.parentElement.clientWidth; cv.height = 400; ctx.clearRect(0, 0, cv.width, cv.height);
    var keys = Object.keys(gameState.collectedWords || {});
    if (!keys.length) { ctx.fillStyle = "rgba(255,255,255,.4)"; ctx.font = "16px 'Noto Sans KR',sans-serif"; ctx.textAlign = "center"; ctx.fillText("Learn some words to see your cloud!", cv.width / 2, cv.height / 2); return; }
    placeW(ctx, cv, keys); bindWC(cv);
  }
  /**
   * Place words on canvas with spiral collision avoidance.
   * @param {CanvasRenderingContext2D} ctx - Context. @param {HTMLCanvasElement} cv - Canvas. @param {Array<string>} keys - Word keys.
   */
  function placeW(ctx, cv, keys) {
    var wm = {}, aw = typeof getWords === "function" ? getWords() : [], rw = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
    for (var i = 0; i < aw.length; i++) wm[aw[i].korean] = aw[i];
    var words = []; for (var j = 0; j < keys.length; j++) { var k = keys[j], info = wm[k] || { korean: k, english: k }, r = gameState.collectedWords[k] || "common"; words.push({ korean: k, english: info.english || k, romanization: info.romanization || "", weight: rw[r] || 1 }); }
    words.sort(function (a, b) { return b.weight - a.weight; }); words = words.slice(0, 80);
    var placed = [], mw = words[0] ? words[0].weight : 1, cx = cv.width / 2, cy = cv.height / 2, cols = [C.cy, C.mt, C.bl, C.pp, C.pk, C.gd];
    for (var wi = 0; wi < words.length; wi++) {
      var w = words[wi], ratio = w.weight / mw, fs = Math.max(12, Math.floor(ratio * 36 + 12));
      ctx.font = "bold " + fs + "px 'Noto Sans KR',sans-serif"; var tw = ctx.measureText(w.korean).width, th = fs, pos = sPlace(cx, cy, tw, th, placed, cv.width, cv.height);
      if (!pos) continue; ctx.fillStyle = cols[Math.min(Math.floor(ratio * cols.length), cols.length - 1)]; ctx.globalAlpha = 0.6 + ratio * 0.4; ctx.fillText(w.korean, pos.x, pos.y + th); ctx.globalAlpha = 1;
      cloudItems.push({ x: pos.x, y: pos.y, w: tw, h: th, word: w }); placed.push({ x: pos.x, y: pos.y, w: tw, h: th });
    }
  }
  /**
   * Spiral placement with collision detection.
   * @param {number} cx @param {number} cy @param {number} tw @param {number} th @param {Array} pl - Placed rects. @param {number} mW @param {number} mH
   * @returns {Object|null} {x,y} or null.
   */
  function sPlace(cx, cy, tw, th, pl, mW, mH) {
    for (var s = 0; s < 500; s++) { var a = s * 0.5, r = s * 2, x = cx + Math.cos(a) * r - tw / 2, y = cy + Math.sin(a) * r - th / 2; if (x < 5 || y < 5 || x + tw > mW - 5 || y + th > mH - 5) continue; var hit = false; for (var p = 0; p < pl.length; p++) { var q = pl[p]; if (!(x + tw + 4 < q.x || q.x + q.w + 4 < x || y + th + 4 < q.y || q.y + q.h + 4 < y)) { hit = true; break; } } if (!hit) return { x: x, y: y }; }
    return null;
  }
  /**
   * Bind mouse and click interaction to word cloud.
   * @param {HTMLCanvasElement} cv - Canvas element.
   */
  function bindWC(cv) {
    var tip = document.getElementById("wcT");
    cv.addEventListener("mousemove", function (e) {
      var rc = cv.getBoundingClientRect(), mx = e.clientX - rc.left, my = e.clientY - rc.top, f = null;
      for (var i = 0; i < cloudItems.length; i++) { var it = cloudItems[i]; if (mx >= it.x && mx <= it.x + it.w && my >= it.y && my <= it.y + it.h) { f = it; break; } }
      if (f && tip) { tip.style.display = "block"; tip.style.left = (e.clientX + 12) + "px"; tip.style.top = (e.clientY - 40) + "px"; tip.innerHTML = '<strong>' + escapeHtml(f.word.korean) + '</strong><br>' + escapeHtml(f.word.english) + (f.word.romanization ? '<br><em>' + escapeHtml(f.word.romanization) + '</em>' : ''); } else if (tip) tip.style.display = "none";
    });
    cv.addEventListener("mouseleave", function () { if (tip) tip.style.display = "none"; });
    cv.addEventListener("click", function (e) {
      var rc = cv.getBoundingClientRect(), mx = e.clientX - rc.left, my = e.clientY - rc.top;
      for (var i = 0; i < cloudItems.length; i++) { var it = cloudItems[i]; if (mx >= it.x && mx <= it.x + it.w && my >= it.y && my <= it.y + it.h) { if (typeof speakKorean === "function") speakKorean(it.word.korean); if (typeof showToast === "function") showToast(it.word.korean + " = " + it.word.english); break; } }
    });
  }
  /**
   * Show growth timeline view.
   * @param {HTMLElement} c - Container element.
   */
  function showGrowthTimeline(c) {
    css(); chkMile(); var ms = lg(MK, []);
    var h = '<h2 class="game-title">Growth Timeline</h2>' + nav("timeline");
    if (!ms.length) { c.innerHTML = h + '<div style="text-align:center;color:rgba(255,255,255,.5);padding:40px">Start learning to build your timeline!</div>'; bindNav(c); return; }
    ms.sort(function (a, b) { return a.date > b.date ? -1 : 1; });
    h += '<div class="tl-wrap"><div class="tl-line"></div>';
    for (var i = 0; i < ms.length; i++) { var m = ms[i]; h += '<div class="tl-item"><div class="tl-dot"></div><div class="tl-date">' + escapeHtml(m.date) + '</div><div class="tl-title">' + escapeHtml(m.title) + '</div><div class="tl-icon" aria-hidden="true">' + m.icon + '</div></div>'; }
    c.innerHTML = h + '</div>'; bindNav(c);
  }
  /**
   * Show RPG-style level map.
   * @param {HTMLElement} c - Container element.
   */
  function showLevelMap(c) {
    css(); var tot = 30, cur = gameState.level, sw = 580, sh = tot * 60 + 60, nodes = [];
    for (var i = 0; i < tot; i++) nodes.push({ x: sw / 2 + Math.sin(i * 0.6) * 120, y: (tot - 1 - i) * 60 + 40, level: i + 1 });
    var rw = { 1: "Welcome! Start your journey", 2: "New category unlocked", 3: "Bonus XP multiplier", 5: "Achievement: Rising Star", 7: "Power-up bonus", 10: "Achievement: Dedicated Learner", 15: "Special word pack unlocked", 20: "Achievement: Korean Expert", 25: "Legendary status approaching", 30: "Ultimate Korean Master!" };
    var h = '<h2 class="game-title">Level Map</h2>' + nav("levelmap") + '<div style="max-height:500px;overflow-y:auto;background:rgba(20,10,40,.8);border-radius:16px;border:1px solid rgba(255,255,255,.08);padding:20px">';
    h += '<svg style="width:100%;max-width:600px;margin:0 auto;display:block" viewBox="0 0 ' + sw + ' ' + sh + '" role="img" aria-label="Level progression map">';
    h += '<defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="' + C.pk + '"/><stop offset="100%" stop-color="' + C.pp + '"/></linearGradient><filter id="ng"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>';
    for (var li = 0; li < nodes.length - 1; li++) { var a = nodes[li], b = nodes[li + 1], dn = a.level < cur; h += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" stroke="' + (dn ? "url(#pg)" : "rgba(255,255,255,.15)") + '" stroke-width="3"' + (dn ? '' : ' stroke-dasharray="6,6"') + '/>'; }
    for (var ni = 0; ni < nodes.length; ni++) {
      var nd = nodes[ni], isC = nd.level === cur, isD = nd.level < cur, r = isC ? 22 : 18, op = isC || isD ? 1 : 0.5;
      var fl = isC ? C.pk : isD ? C.pp : "rgba(255,255,255,.05)", st = isC ? C.gd : isD ? C.pk : "rgba(255,255,255,.2)";
      h += '<g class="lm-node" data-level="' + nd.level + '" data-rw="' + escapeHtml(rw[nd.level] || "Keep going!") + '"><circle cx="' + nd.x + '" cy="' + nd.y + '" r="' + r + '" fill="' + fl + '" stroke="' + st + '" stroke-width="2" opacity="' + op + '"' + (isC ? ' filter="url(#ng)"' : '') + '/>';
      h += '<text x="' + nd.x + '" y="' + (nd.y + 5) + '" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold" opacity="' + op + '">' + nd.level + '</text></g>';
    }
    h += '</svg></div><div class="lm-tip" id="lmT"></div>'; c.innerHTML = h; bindNav(c);
    var tip = document.getElementById("lmT"), nels = document.querySelectorAll(".lm-node");
    for (var bi = 0; bi < nels.length; bi++) {
      nels[bi].addEventListener("mouseenter", function (e) { if (!tip) return; var t = e.currentTarget, rc = t.getBoundingClientRect(); tip.innerHTML = '<strong>Level ' + escapeHtml(t.getAttribute("data-level")) + '</strong><br>' + escapeHtml(t.getAttribute("data-rw")); tip.style.display = "block"; tip.style.left = (rc.right + 10) + "px"; tip.style.top = (rc.top - 10) + "px"; });
      nels[bi].addEventListener("mouseleave", function () { if (tip) tip.style.display = "none"; });
    }
  }
  /** Wrap global functions with automatic tracking. */
  function initTrack() {
    initSess();
    var oc = window.collectWord; if (typeof oc === "function") window.collectWord = function (w) { oc(w); recordActivity("word", 1); };
    var ox = window.addXP; if (typeof ox === "function") window.addXP = function (a) { ox(a); var h = lg(HK, {}), d = td(); if (!h[d]) h[d] = { words: 0, quizzes: 0, xp: 0 }; h[d].xp = gameState.xp + (gameState.level - 1) * 100; ls(HK, h); };
    var om = window.showMode; if (typeof om === "function") window.showMode = function (m) { trackModeUsage(m); om(m); };
  }
  window.showVisualDashboard = showVisualDashboard;
  window.showWordCloud = showWordCloud;
  window.showGrowthTimeline = showGrowthTimeline;
  window.showLevelMap = showLevelMap;
  window.recordActivity = recordActivity;
  window.recordCategoryAnswer = recordCategoryAnswer;
  window.trackModeUsage = trackModeUsage;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initTrack); else initTrack();
})();

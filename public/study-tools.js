/**
 * Study Tools for K-POP Korean Learning Game
 * Pomodoro Timer, Theme Settings, Daily Goals
 * Requires: main-app.js (loaded before this file)
 * Uses globals: escapeHtml, addXP, saveProgress, gameState,
 *   showToast, showPopup, SoundEngine, createConfetti
 */

var POMO_STUDY = 25 * 60;
var POMO_SHORT = 5 * 60;
var POMO_LONG = 15 * 60;
var POMO_CYCLE = 4;
var POMO_KEY = "kpop_pomodoro_stats";
var THEME_KEY = "kpop_theme_settings";
var GOALS_KEY = "kpop_daily_goals";

// -- Pomodoro state --
var pomoInterval = null;
var pomoRemain = POMO_STUDY;
var pomoRunning = false;
var pomoIsBreak = false;
var pomoSessions = 0;

/** @returns {string} Today as YYYY-MM-DD */
function getTodayStr() { return new Date().toISOString().slice(0, 10); }

/** @returns {{ today: number, week: number, lastDate: string }} */
function loadPomoStats() {
    try { var r = localStorage.getItem(POMO_KEY); if (r) return JSON.parse(r); }
    catch (e) { /* ignore */ }
    return { today: 0, week: 0, lastDate: "" };
}

/** @param {{ today: number, week: number, lastDate: string }} s */
function savePomoStats(s) {
    try { localStorage.setItem(POMO_KEY, JSON.stringify(s)); } catch (e) { /* */ }
}

/** @param {number} min - Minutes studied */
function addPomoMinutes(min) {
    var s = loadPomoStats(), today = getTodayStr();
    if (s.lastDate !== today) { s.today = 0; s.lastDate = today; }
    s.today += min; s.week += min;
    savePomoStats(s);
    trackDailyProgress("studyTime", min);
}

/** @param {number} sec @returns {string} MM:SS */
function fmtTime(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}

/** Plays a short beep via Web Audio API */
function playPomoBeep() {
    try {
        var c = new (window.AudioContext || window.webkitAudioContext)();
        var o = c.createOscillator(), g = c.createGain();
        o.connect(g); g.connect(c.destination);
        o.frequency.value = 880; g.gain.value = 0.3;
        o.start(); o.stop(c.currentTime + 0.2);
    } catch (e) { /* unsupported */ }
}

/** @returns {number} Total seconds for current pomodoro phase */
function getPomoTotal() {
    if (!pomoIsBreak) return POMO_STUDY;
    return (pomoSessions % POMO_CYCLE === 0) ? POMO_LONG : POMO_SHORT;
}

/** @param {number} remain @param {number} total @returns {number} */
function pomoDashOffset(remain, total) {
    var circ = 2 * Math.PI * 90;
    return circ * (remain / total);
}

/** Handles timer phase completion */
function onPomoComplete() {
    pomoRunning = false;
    clearInterval(pomoInterval); pomoInterval = null;
    playPomoBeep();
    if (!pomoIsBreak) {
        pomoSessions++; addPomoMinutes(25); addXP(50);
        pomoIsBreak = true;
        pomoRemain = (pomoSessions % POMO_CYCLE === 0) ? POMO_LONG : POMO_SHORT;
    } else { pomoIsBreak = false; pomoRemain = POMO_STUDY; }
    var c = document.getElementById("gameArea");
    if (c) renderPomodoroTimer(c);
}

/** Tick handler called every second */
function tickPomo() {
    if (pomoRemain <= 0) { onPomoComplete(); return; }
    pomoRemain--;
    var t = document.getElementById("pomoTimeText");
    var ci = document.getElementById("pomoCircle");
    if (t) t.textContent = fmtTime(pomoRemain);
    if (ci) ci.setAttribute("stroke-dashoffset", String(pomoDashOffset(pomoRemain, getPomoTotal())));
}

/** @returns {string} SVG markup for circular progress */
function buildPomoSvg() {
    var circ = 2 * Math.PI * 90, off = pomoDashOffset(pomoRemain, getPomoTotal());
    var col = pomoIsBreak ? "var(--neon-cyan)" : "var(--neon-pink)";
    return '<svg viewBox="0 0 200 200" width="220" height="220">' +
        '<circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/>' +
        '<circle id="pomoCircle" cx="100" cy="100" r="90" fill="none" stroke="' + col +
        '" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + circ +
        '" stroke-dashoffset="' + off + '" transform="rotate(-90 100 100)"/>' +
        '<text id="pomoTimeText" x="100" y="105" text-anchor="middle" font-size="36" fill="#fff" font-weight="bold">' +
        escapeHtml(fmtTime(pomoRemain)) + '</text></svg>';
}

/** @returns {string} Stats section HTML */
function buildPomoStats() {
    var s = loadPomoStats();
    if (s.lastDate !== getTodayStr()) s.today = 0;
    var items = [
        { val: s.today, lbl: "Today (min)", col: "var(--neon-cyan)" },
        { val: s.week, lbl: "Week (min)", col: "var(--neon-purple)" },
        { val: pomoSessions, lbl: "Sessions", col: "var(--neon-pink)" }
    ];
    var h = '<div style="display:flex;justify-content:center;gap:20px;margin-top:20px">';
    for (var i = 0; i < items.length; i++) {
        h += '<div style="text-align:center"><div style="font-size:1.4rem;font-weight:bold;color:' +
            items[i].col + '">' + escapeHtml(String(items[i].val)) +
            '</div><div style="font-size:0.75rem;color:rgba(255,255,255,0.6)">' +
            escapeHtml(items[i].lbl) + '</div></div>';
    }
    return h + '</div>';
}

/**
 * Renders the pomodoro timer UI.
 * @param {HTMLElement} c - Container element
 */
function renderPomodoroTimer(c) {
    var phase = pomoIsBreak ? "Break Time" : "Study Time";
    c.innerHTML = '<h2 class="game-title">Pomodoro Timer</h2>' +
        '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:15px">' + escapeHtml(phase) + '</p>' +
        '<div style="text-align:center">' + buildPomoSvg() + '</div>' +
        '<div style="display:flex;justify-content:center;gap:12px;margin-top:20px">' +
        '<button class="game-btn" data-action="pomo-toggle">' + (pomoRunning ? "Pause" : "Start") + '</button>' +
        '<button class="game-btn secondary" data-action="pomo-reset">Reset</button></div>' +
        buildPomoStats();
    var btns = c.querySelectorAll("[data-action]");
    for (var i = 0; i < btns.length; i++) btns[i].addEventListener("click", handlePomoAction);
}

/** @param {Event} e */
function handlePomoAction(e) {
    var a = e.currentTarget.getAttribute("data-action");
    if (a === "pomo-toggle") {
        if (pomoRunning) { pomoRunning = false; clearInterval(pomoInterval); pomoInterval = null; }
        else { pomoRunning = true; pomoInterval = setInterval(tickPomo, 1000); }
    }
    if (a === "pomo-reset") {
        pomoRunning = false; clearInterval(pomoInterval); pomoInterval = null;
        pomoIsBreak = false; pomoRemain = POMO_STUDY;
    }
    var c = document.getElementById("gameArea");
    if (c) renderPomodoroTimer(c);
}

/**
 * Entry point for pomodoro timer mode.
 * @param {HTMLElement} c - Container element
 */
function showPomodoroTimer(c) {
    if (!pomoRunning) pomoRemain = getPomoTotal();
    gameState.gamesPlayed++; saveProgress();
    renderPomodoroTimer(c);
}

// -- Theme Settings --
/** @type {Array<Object>} */
var stThemes = [
    { id: "neon-dark", name: "Neon Dark", nameKr: "Neon Dark", icon: "&#9790;",
      vars: { "--neon-pink":"#ff2d95","--neon-purple":"#9d4edd","--neon-blue":"#00d4ff","--neon-cyan":"#00f5d4",
              "--bg-dark":"#0a0a1a","--bg-card":"rgba(20,10,40,0.8)","--glass":"rgba(255,255,255,0.05)",
              "--gold":"#ffd700","--fire":"#ff6b35" },
      bodyBg: "radial-gradient(ellipse at top,rgba(157,78,221,0.15),transparent 50%),radial-gradient(ellipse at bottom,rgba(0,212,255,0.1),transparent 50%)",
      textColor: "#fff" },
    { id: "light", name: "Light Mode", nameKr: "Light Mode", icon: "&#9788;",
      vars: { "--neon-pink":"#d6006e","--neon-purple":"#7b2cbf","--neon-blue":"#0099cc","--neon-cyan":"#00b09b",
              "--bg-dark":"#f5f5f5","--bg-card":"rgba(255,255,255,0.92)","--glass":"rgba(0,0,0,0.04)",
              "--gold":"#c9a500","--fire":"#e05520" },
      bodyBg: "radial-gradient(ellipse at top,rgba(157,78,221,0.06),transparent 50%),radial-gradient(ellipse at bottom,rgba(0,212,255,0.04),transparent 50%)",
      textColor: "#333" },
    { id: "sakura", name: "Sakura", nameKr: "Sakura", icon: "&#9830;",
      vars: { "--neon-pink":"#f472b6","--neon-purple":"#e879a8","--neon-blue":"#fb7185","--neon-cyan":"#fda4af",
              "--bg-dark":"#1a0a12","--bg-card":"rgba(40,10,25,0.8)","--glass":"rgba(255,255,255,0.06)",
              "--gold":"#fbbf24","--fire":"#f43f5e" },
      bodyBg: "radial-gradient(ellipse at top,rgba(244,114,182,0.15),transparent 50%),radial-gradient(ellipse at bottom,rgba(251,113,133,0.1),transparent 50%)",
      textColor: "#fff" },
    { id: "ocean", name: "Ocean", nameKr: "Ocean", icon: "&#9733;",
      vars: { "--neon-pink":"#0096c7","--neon-purple":"#0077b6","--neon-blue":"#00b4d8","--neon-cyan":"#90e0ef",
              "--bg-dark":"#03071e","--bg-card":"rgba(0,20,50,0.8)","--glass":"rgba(255,255,255,0.05)",
              "--gold":"#f9c74f","--fire":"#f3722c" },
      bodyBg: "radial-gradient(ellipse at top,rgba(0,119,182,0.15),transparent 50%),radial-gradient(ellipse at bottom,rgba(0,180,216,0.1),transparent 50%)",
      textColor: "#fff" },
    { id: "forest", name: "Forest", nameKr: "Forest", icon: "&#9752;",
      vars: { "--neon-pink":"#52b788","--neon-purple":"#2d6a4f","--neon-blue":"#40916c","--neon-cyan":"#95d5b2",
              "--bg-dark":"#0b1a0f","--bg-card":"rgba(10,30,15,0.8)","--glass":"rgba(255,255,255,0.05)",
              "--gold":"#ffd166","--fire":"#ef476f" },
      bodyBg: "radial-gradient(ellipse at top,rgba(45,106,79,0.15),transparent 50%),radial-gradient(ellipse at bottom,rgba(64,145,108,0.1),transparent 50%)",
      textColor: "#fff" }
];

/** @returns {string} Saved theme ID */
function loadSavedThemeId() {
    try { return localStorage.getItem(THEME_KEY) || "neon-dark"; }
    catch (e) { return "neon-dark"; }
}

/** @param {Object} theme - Theme from stThemes */
function applyStTheme(theme) {
    var root = document.documentElement, v = theme.vars;
    for (var k in v) { if (v.hasOwnProperty(k)) root.style.setProperty(k, v[k]); }
    document.body.style.backgroundImage = theme.bodyBg;
    document.body.style.color = theme.textColor;
    localStorage.setItem(THEME_KEY, theme.id);
}

/** @param {string} id @returns {Object|null} */
function findStTheme(id) {
    for (var i = 0; i < stThemes.length; i++) { if (stThemes[i].id === id) return stThemes[i]; }
    return null;
}

/** Initializes theme from saved preference or system preference */
function initStudyToolsTheme() {
    var t = findStTheme(loadSavedThemeId());
    if (!t && window.matchMedia) {
        t = window.matchMedia("(prefers-color-scheme: dark)").matches
            ? findStTheme("neon-dark") : findStTheme("light");
    }
    if (t) applyStTheme(t);
}

/** @param {Object} theme @param {boolean} active @returns {string} */
function buildThemeCard(theme, active) {
    var cls = active ? " st-theme-card-active" : "";
    var h = '<div class="st-theme-card' + cls + '" data-action="select-theme" data-theme-id="' +
        escapeHtml(theme.id) + '" role="button" tabindex="0" aria-label="' + escapeHtml(theme.name) + ' theme">';
    h += '<div style="font-size:1.6rem;margin-bottom:6px">' + theme.icon + '</div>';
    h += '<div style="display:flex;gap:4px;justify-content:center;margin-bottom:8px">';
    var ck = ["--neon-pink", "--neon-purple", "--neon-blue"];
    for (var j = 0; j < ck.length; j++) {
        h += '<span style="width:18px;height:18px;border-radius:50%;display:inline-block;background:' +
            theme.vars[ck[j]] + '"></span>';
    }
    h += '</div><div style="font-weight:700;font-size:0.9rem">' + escapeHtml(theme.name) + '</div>';
    h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">' + escapeHtml(theme.nameKr) + '</div>';
    if (active) {
        h += '<div style="position:absolute;top:6px;right:6px;background:var(--neon-pink);color:#fff;' +
            'width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;' +
            'font-size:0.7rem">&#10003;</div>';
    }
    return h + '</div>';
}

/**
 * Renders theme settings UI.
 * @param {HTMLElement} c - Container element
 */
function renderThemeSettings(c) {
    var cur = loadSavedThemeId();
    var h = '<h2 class="game-title">Theme Settings</h2>' +
        '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:20px">Choose your preferred theme</p>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:14px;max-width:600px;margin:0 auto">';
    for (var i = 0; i < stThemes.length; i++) h += buildThemeCard(stThemes[i], stThemes[i].id === cur);
    c.innerHTML = h + '</div>';
    injectStudyToolsCss();
    var cards = c.querySelectorAll("[data-action='select-theme']");
    for (var j = 0; j < cards.length; j++) {
        cards[j].addEventListener("click", handleThemeSelect);
        cards[j].addEventListener("keydown", function(e) {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleThemeSelect(e); }
        });
    }
}

/** @param {Event} e */
function handleThemeSelect(e) {
    var theme = findStTheme(e.currentTarget.getAttribute("data-theme-id"));
    if (!theme) return;
    applyStTheme(theme);
    if (typeof showToast === "function") showToast(theme.name + " theme applied");
    var c = document.getElementById("gameArea");
    if (c) renderThemeSettings(c);
}

/**
 * Entry point for theme settings mode.
 * @param {HTMLElement} c - Container element
 */
function showThemeSettings(c) { renderThemeSettings(c); }

// -- Daily Goals --
var goalTimeOpts = [15, 30, 60];
var goalWordOpts = [5, 10, 20];
var goalQuizOpts = [3, 5, 10];

/** @returns {Object} Daily goals state */
function loadDailyGoals() {
    try {
        var r = localStorage.getItem(GOALS_KEY);
        if (r) { var g = JSON.parse(r); if (g.date === getTodayStr()) return g; }
    } catch (e) { /* ignore */ }
    return { date: getTodayStr(), timeGoal: 30, wordGoal: 10, quizGoal: 5,
        timeProgress: 0, wordProgress: 0, quizProgress: 0,
        celebrated: { time: false, word: false, quiz: false } };
}

/** @param {Object} g - Goals state */
function saveDailyGoals(g) {
    try { localStorage.setItem(GOALS_KEY, JSON.stringify(g)); } catch (e) { /* */ }
}

/**
 * Tracks progress toward daily goals.
 * @param {string} type - "studyTime", "word", or "quiz"
 * @param {number} amt - Amount to add
 */
function trackDailyProgress(type, amt) {
    var g = loadDailyGoals();
    if (type === "studyTime") g.timeProgress += amt;
    if (type === "word") g.wordProgress += amt;
    if (type === "quiz") g.quizProgress += amt;
    saveDailyGoals(g); checkGoalCompletion(g);
}

/** @param {Object} g */
function checkGoalCompletion(g) {
    var ch = false;
    if (!g.celebrated.time && g.timeProgress >= g.timeGoal) { g.celebrated.time = true; ch = true; celebrateGoal("Study Time"); }
    if (!g.celebrated.word && g.wordProgress >= g.wordGoal) { g.celebrated.word = true; ch = true; celebrateGoal("Words"); }
    if (!g.celebrated.quiz && g.quizProgress >= g.quizGoal) { g.celebrated.quiz = true; ch = true; celebrateGoal("Quizzes"); }
    if (ch) saveDailyGoals(g);
}

/** @param {string} name - Completed goal name */
function celebrateGoal(name) {
    addXP(100);
    if (typeof createConfetti === "function") createConfetti(30);
    if (typeof showPopup === "function") showPopup("Goal Complete!", name + " goal reached! +100 XP");
}

/** @param {number} cur @param {number} tgt @returns {number} */
function goalPct(cur, tgt) {
    if (tgt <= 0) return 100;
    var p = Math.round((cur / tgt) * 100);
    return p > 100 ? 100 : p;
}

/** @param {string} label @param {number} cur @param {number} tgt @param {string} color @returns {string} */
function buildGoalBar(label, cur, tgt, color) {
    var p = goalPct(cur, tgt), d = cur > tgt ? tgt : cur;
    return '<div style="margin-bottom:18px"><div style="display:flex;justify-content:space-between;margin-bottom:6px">' +
        '<span style="font-weight:600">' + escapeHtml(label) + '</span>' +
        '<span style="color:rgba(255,255,255,0.7)">' + escapeHtml(String(d)) + ' / ' + escapeHtml(String(tgt)) + '</span></div>' +
        '<div style="background:rgba(255,255,255,0.1);border-radius:10px;height:14px;overflow:hidden">' +
        '<div style="width:' + p + '%;height:100%;background:' + color + ';border-radius:10px;transition:width 0.4s ease"></div></div></div>';
}

/** @param {string} type @param {Array} opts @param {number} cur @param {string} sfx @returns {string} */
function buildGoalOpts(type, opts, cur, sfx) {
    var h = '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:16px">';
    for (var i = 0; i < opts.length; i++) {
        var cls = opts[i] === cur ? "game-btn" : "game-btn secondary";
        h += '<button class="' + cls + '" data-action="set-goal" data-goal-type="' + escapeHtml(type) +
            '" data-goal-value="' + opts[i] + '" style="padding:8px 14px;font-size:0.85rem">' +
            escapeHtml(String(opts[i])) + escapeHtml(sfx) + '</button>';
    }
    return h + '</div>';
}

/**
 * Renders daily goals UI.
 * @param {HTMLElement} c - Container element
 */
function renderDailyGoals(c) {
    var g = loadDailyGoals();
    var h = '<h2 class="game-title">Daily Goals</h2>' +
        '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:20px">Set and track your daily targets</p>' +
        '<div style="max-width:450px;margin:0 auto">';
    h += '<h3 style="font-size:0.9rem;color:var(--neon-cyan);margin-bottom:8px">Study Time</h3>';
    h += buildGoalOpts("time", goalTimeOpts, g.timeGoal, "min");
    h += buildGoalBar("Study Time", g.timeProgress, g.timeGoal, "linear-gradient(90deg,var(--neon-pink),var(--neon-purple))");
    h += '<h3 style="font-size:0.9rem;color:var(--neon-cyan);margin-bottom:8px">Words Learned</h3>';
    h += buildGoalOpts("word", goalWordOpts, g.wordGoal, "");
    h += buildGoalBar("Words", g.wordProgress, g.wordGoal, "linear-gradient(90deg,var(--neon-blue),var(--neon-cyan))");
    h += '<h3 style="font-size:0.9rem;color:var(--neon-cyan);margin-bottom:8px">Quizzes Completed</h3>';
    h += buildGoalOpts("quiz", goalQuizOpts, g.quizGoal, "");
    h += buildGoalBar("Quizzes", g.quizProgress, g.quizGoal, "linear-gradient(90deg,var(--gold),var(--fire))");
    c.innerHTML = h + '</div>';
    injectStudyToolsCss();
    var btns = c.querySelectorAll("[data-action='set-goal']");
    for (var i = 0; i < btns.length; i++) btns[i].addEventListener("click", handleGoalSet);
}

/** @param {Event} e */
function handleGoalSet(e) {
    var type = e.currentTarget.getAttribute("data-goal-type");
    var val = parseInt(e.currentTarget.getAttribute("data-goal-value"), 10);
    var g = loadDailyGoals();
    if (type === "time") g.timeGoal = val;
    if (type === "word") g.wordGoal = val;
    if (type === "quiz") g.quizGoal = val;
    g.celebrated = { time: false, word: false, quiz: false };
    saveDailyGoals(g); checkGoalCompletion(g);
    var c = document.getElementById("gameArea");
    if (c) renderDailyGoals(c);
}

/**
 * Entry point for daily goals mode.
 * @param {HTMLElement} c - Container element
 */
function showDailyGoals(c) { renderDailyGoals(c); }

// -- CSS Injection --
var stCssInjected = false;
/** Injects CSS styles for study tools components */
function injectStudyToolsCss() {
    if (stCssInjected) return;
    stCssInjected = true;
    var s = document.createElement("style");
    s.id = "study-tools-css";
    s.textContent =
        ".st-theme-card{position:relative;background:var(--glass);backdrop-filter:blur(10px);" +
        "border:2px solid rgba(255,255,255,0.1);border-radius:16px;padding:18px 12px;text-align:center;" +
        "cursor:pointer;transition:all 0.3s ease}" +
        ".st-theme-card:hover{transform:translateY(-4px);border-color:var(--neon-pink);box-shadow:0 8px 25px rgba(0,0,0,0.3)}" +
        ".st-theme-card:focus-visible{outline:2px solid var(--neon-cyan);outline-offset:2px}" +
        ".st-theme-card-active{border-color:var(--neon-pink);box-shadow:0 0 20px rgba(255,45,149,0.3)}";
    document.head.appendChild(s);
}

// -- Mode Registration --
/** Registers study tools modes into global gameModes array */
function registerStudyToolsModes() {
    if (typeof gameModes === "undefined") return;
    var nm = [{ id: "pomodoro", name: "Pomodoro" }, { id: "themesettings", name: "Themes" }, { id: "dailygoals", name: "Goals" }];
    for (var i = 0; i < nm.length; i++) {
        var ex = false;
        for (var j = 0; j < gameModes.length; j++) { if (gameModes[j].id === nm[i].id) { ex = true; break; } }
        if (!ex) gameModes.push(nm[i]);
    }
}

// -- Init --
(function initStudyTools() {
    registerStudyToolsModes();
    initStudyToolsTheme();
})();

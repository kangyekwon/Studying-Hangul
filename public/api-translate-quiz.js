/**
 * api-translate-quiz.js
 * Translation quiz module using MyMemory Translated API.
 * Modes: Translation Quiz, Reverse Translation, Speed Translation Challenge.
 * API: https://api.mymemory.translated.net/get (5,000 chars/day anonymous).
 * @requires security-utils.js (escapeHtml)
 * @requires main-app.js (shuffle, addXP, addCombo, resetCombo,
 *   SoundEngine, createConfetti, showToast, saveProgress, gameState, speakKorean)
 */
(function () {
    "use strict";

    /** @type {string} MyMemory API base URL */
    var API = "https://api.mymemory.translated.net/get";
    /** @type {number} Cache TTL in ms (24h) */
    var CACHE_TTL = 86400000;
    /** @type {string} localStorage key for daily char usage */
    var QUOTA_KEY = "mymemory_quota";
    /** @type {number} Daily character limit */
    var DAILY_LIMIT = 5000;

    /** @type {Array<{en:string,ko:string,cat:string}>} 50 fallback sentence pairs */
    var FB = [
        {en:"Hello",ko:"\uC548\uB155\uD558\uC138\uC694",cat:"greetings"},{en:"Thank you",ko:"\uAC10\uC0AC\uD569\uB2C8\uB2E4",cat:"greetings"},
        {en:"Goodbye",ko:"\uC548\uB155\uD788 \uAC00\uC138\uC694",cat:"greetings"},{en:"Nice to meet you",ko:"\uB9CC\uB098\uC11C \uBC18\uAC11\uC2B5\uB2C8\uB2E4",cat:"greetings"},
        {en:"How are you?",ko:"\uC5B4\uB5BB\uAC8C \uC9C0\uB0B4\uC138\uC694?",cat:"greetings"},{en:"This food is delicious",ko:"\uC774 \uC74C\uC2DD\uC740 \uB9DB\uC788\uC5B4\uC694",cat:"food"},
        {en:"I want to eat kimchi",ko:"\uAE40\uCE58\uB97C \uBA39\uACE0 \uC2F6\uC5B4\uC694",cat:"food"},{en:"Can I have water please?",ko:"\uBB3C \uC8FC\uC138\uC694",cat:"food"},
        {en:"The rice is tasty",ko:"\uBC25\uC774 \uB9DB\uC788\uC5B4\uC694",cat:"food"},{en:"I like Korean food",ko:"\uD55C\uAD6D \uC74C\uC2DD\uC744 \uC88B\uC544\uD574\uC694",cat:"food"},
        {en:"Where is the station?",ko:"\uC5ED\uC774 \uC5B4\uB514\uC5D0 \uC788\uC5B4\uC694?",cat:"travel"},{en:"I want to go to Seoul",ko:"\uC11C\uC6B8\uC5D0 \uAC00\uACE0 \uC2F6\uC5B4\uC694",cat:"travel"},
        {en:"How much is the ticket?",ko:"\uD45C\uAC00 \uC5BC\uB9C8\uC608\uC694?",cat:"travel"},{en:"Where is the airport?",ko:"\uACF5\uD56D\uC774 \uC5B4\uB514\uC5D0 \uC788\uC5B4\uC694?",cat:"travel"},
        {en:"I need a taxi",ko:"\uD0DD\uC2DC\uAC00 \uD544\uC694\uD574\uC694",cat:"travel"},{en:"How much is this?",ko:"\uC774\uAC83\uC740 \uC5BC\uB9C8\uC608\uC694?",cat:"shopping"},
        {en:"It is too expensive",ko:"\uB108\uBB34 \uBE44\uC2F8\uC694",cat:"shopping"},{en:"Can you give me a discount?",ko:"\uAE4C\uAE4C \uC8FC\uC138\uC694",cat:"shopping"},
        {en:"I will buy this",ko:"\uC774\uAC83\uC744 \uC0B4\uAC8C\uC694",cat:"shopping"},{en:"Do you have a larger size?",ko:"\uB354 \uD070 \uC0AC\uC774\uC988 \uC788\uC5B4\uC694?",cat:"shopping"},
        {en:"I am happy",ko:"\uD589\uBCF5\uD574\uC694",cat:"emotions"},{en:"I am sad",ko:"\uC2AC\uD37C\uC694",cat:"emotions"},
        {en:"I love music",ko:"\uC74C\uC545\uC744 \uC0AC\uB791\uD574\uC694",cat:"emotions"},{en:"I am tired",ko:"\uD53C\uACE4\uD574\uC694",cat:"emotions"},
        {en:"I am excited",ko:"\uC2E0\uB098\uC694",cat:"emotions"},{en:"Turn left here",ko:"\uC5EC\uAE30\uC11C \uC67C\uCABD\uC73C\uB85C \uAC00\uC138\uC694",cat:"directions"},
        {en:"Go straight ahead",ko:"\uC9C1\uC9C4\uD558\uC138\uC694",cat:"directions"},{en:"It is on the right side",ko:"\uC624\uB978\uCABD\uC5D0 \uC788\uC5B4\uC694",cat:"directions"},
        {en:"Is it far from here?",ko:"\uC5EC\uAE30\uC11C \uBA40\uC5B4\uC694?",cat:"directions"},{en:"I am lost",ko:"\uAE38\uC744 \uC783\uC5C8\uC5B4\uC694",cat:"directions"},
        {en:"What time is it now?",ko:"\uC9C0\uAE08 \uBA87 \uC2DC\uC608\uC694?",cat:"time"},{en:"See you tomorrow",ko:"\uB0B4\uC77C \uBD10\uC694",cat:"time"},
        {en:"I woke up early today",ko:"\uC624\uB298 \uC77C\uCC0D \uC77C\uC5B4\uB0AC\uC5B4\uC694",cat:"time"},{en:"It is Monday",ko:"\uC6D4\uC694\uC77C\uC774\uC5D0\uC694",cat:"time"},
        {en:"Last week was fun",ko:"\uC9C0\uB09C\uC8FC\uB294 \uC7AC\uBBF8\uC788\uC5C8\uC5B4\uC694",cat:"time"},{en:"The weather is nice today",ko:"\uC624\uB298 \uB0A0\uC528\uAC00 \uC88B\uC544\uC694",cat:"weather"},
        {en:"It is raining outside",ko:"\uBC16\uC5D0 \uBE44\uAC00 \uC640\uC694",cat:"weather"},{en:"It is very cold today",ko:"\uC624\uB298 \uB9E4\uC6B0 \uCDA5\uC6CC\uC694",cat:"weather"},
        {en:"Summer is hot",ko:"\uC5EC\uB984\uC740 \uB354\uC6CC\uC694",cat:"weather"},{en:"I like spring",ko:"\uBD04\uC744 \uC88B\uC544\uD574\uC694",cat:"weather"},
        {en:"My family is big",ko:"\uC6B0\uB9AC \uAC00\uC871\uC740 \uCEE4\uC694",cat:"family"},{en:"I love my mother",ko:"\uC5B4\uBA38\uB2C8\uB97C \uC0AC\uB791\uD574\uC694",cat:"family"},
        {en:"My brother is a student",ko:"\uB0B4 \uD615\uC740 \uD559\uC0DD\uC774\uC5D0\uC694",cat:"family"},{en:"My father works hard",ko:"\uC544\uBC84\uC9C0\uB294 \uC5F4\uC2EC\uD788 \uC77C\uD574\uC694",cat:"family"},
        {en:"I have a younger sister",ko:"\uC5EC\uB3D9\uC0DD\uC774 \uC788\uC5B4\uC694",cat:"family"},{en:"I like to read books",ko:"\uCC45 \uC77D\uB294 \uAC83\uC744 \uC88B\uC544\uD574\uC694",cat:"hobbies"},
        {en:"I play soccer on weekends",ko:"\uC8FC\uB9D0\uC5D0 \uCD95\uAD6C\uB97C \uD574\uC694",cat:"hobbies"},{en:"I enjoy watching movies",ko:"\uC601\uD654 \uBCF4\uB294 \uAC83\uC744 \uC990\uACA8\uC694",cat:"hobbies"},
        {en:"I am learning Korean",ko:"\uD55C\uAD6D\uC5B4\uB97C \uBC30\uC6B0\uACE0 \uC788\uC5B4\uC694",cat:"hobbies"},{en:"I like to travel",ko:"\uC5EC\uD589\uD558\uB294 \uAC83\uC744 \uC88B\uC544\uD574\uC694",cat:"hobbies"}
    ];

    /** @type {{score:number,round:number,total:number}} */
    var tqState = {score:0,round:0,total:10};
    /** @type {{score:number,round:number,total:number}} */
    var rtState = {score:0,round:0,total:10};
    /** @type {{score:number,streak:number,best:number,timer:number,active:boolean,intervalId:number|null}} */
    var speedState = {score:0,streak:0,best:0,timer:60,active:false,intervalId:null};

    // ===== Quota Tracking =====

    /**
     * Get today's API character usage from localStorage.
     * @returns {{date:string,used:number}} Usage record
     */
    function getQuota() {
        try {
            var raw = localStorage.getItem(QUOTA_KEY);
            if (raw) { var obj = JSON.parse(raw); var today = new Date().toISOString().slice(0,10); if (obj.date === today) return obj; }
        } catch (e) { /* ignore */ }
        return {date: new Date().toISOString().slice(0,10), used: 0};
    }

    /** @param {number} chars - Characters used */
    function addQuota(chars) {
        var q = getQuota(); q.used += chars;
        try { localStorage.setItem(QUOTA_KEY, JSON.stringify(q)); } catch (e) { /* ignore */ }
    }

    /** @returns {number} Characters remaining today */
    function getRemaining() { return Math.max(0, DAILY_LIMIT - getQuota().used); }

    // ===== Cache Utilities =====

    /** @param {string} key @returns {string|null} Cached translation or null */
    function getCached(key) {
        try {
            var raw = localStorage.getItem("tr_" + key); if (!raw) return null;
            var obj = JSON.parse(raw); if (Date.now() - obj.ts > CACHE_TTL) return null;
            return obj.data;
        } catch (e) { return null; }
    }

    /** @param {string} key @param {string} data */
    function setCache(key, data) {
        try { localStorage.setItem("tr_" + key, JSON.stringify({ts:Date.now(),data:data})); } catch (e) { /* full */ }
    }

    // ===== API Fetch =====

    /**
     * Translate text using MyMemory API with cache and quota tracking.
     * @param {string} text - Text to translate
     * @param {string} lp - Language pair (e.g. "en|ko")
     * @returns {Promise<string>} Translated text
     */
    async function translate(text, lp) {
        var ck = lp + "_" + text, cached = getCached(ck);
        if (cached) return cached;
        if (getRemaining() < text.length) return findFallback(text, lp) || text;
        try {
            var res = await fetch(API + "?q=" + encodeURIComponent(text) + "&langpair=" + encodeURIComponent(lp));
            if (!res.ok) throw new Error("HTTP " + res.status);
            var json = await res.json();
            if (json.responseStatus !== 200) throw new Error("API " + json.responseStatus);
            var tr = json.responseData.translatedText;
            addQuota(text.length); setCache(ck, tr); return tr;
        } catch (e) { return findFallback(text, lp) || text; }
    }

    /**
     * Find fallback translation from built-in pairs.
     * @param {string} text @param {string} lp @returns {string|null}
     */
    function findFallback(text, lp) {
        var lower = text.toLowerCase().trim();
        for (var i = 0; i < FB.length; i++) {
            if (lp === "en|ko" && FB[i].en.toLowerCase() === lower) return FB[i].ko;
            if (lp === "ko|en" && FB[i].ko === text.trim()) return FB[i].en;
        }
        return null;
    }

    // ===== Utility Helpers =====

    /** @param {Array} arr @returns {Array} Shuffled array (Fisher-Yates) */
    function shuffleArray(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        }
        return arr;
    }

    /** @param {Array} pool @param {string} excludeKo @param {number} n @returns {string[]} */
    function pickWrongKo(pool, excludeKo, n) {
        return shuffleArray(pool.filter(function (p) { return p.ko !== excludeKo; })).slice(0, n).map(function (p) { return p.ko; });
    }

    /**
     * Calculate word overlap similarity (0-100).
     * @param {string} a @param {string} b @returns {number}
     */
    function wordSimilarity(a, b) {
        var wa = a.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(Boolean);
        var wb = b.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(Boolean);
        if (!wa.length || !wb.length) return 0;
        var m = 0;
        for (var i = 0; i < wa.length; i++) { if (wb.indexOf(wa[i]) !== -1) m++; }
        return Math.round((m / Math.max(wa.length, wb.length)) * 100);
    }

    /** @returns {string} Quota indicator HTML */
    function renderQuota() {
        var rem = getRemaining(), pct = Math.round((rem / DAILY_LIMIT) * 100);
        var color = pct > 50 ? "var(--neon-cyan)" : pct > 20 ? "var(--gold)" : "var(--neon-pink)";
        return '<div style="text-align:center;margin:8px 0;font-size:0.75rem;color:rgba(255,255,255,0.5);">' +
            'API Quota: <span style="color:' + color + ';">' + escapeHtml(String(rem)) + '</span> / ' +
            escapeHtml(String(DAILY_LIMIT)) + ' chars remaining</div>';
    }

    /** @returns {string} Loading spinner markup */
    function renderLoading() {
        return '<div style="text-align:center;padding:40px;"><div class="game-loading-spinner"></div>' +
            '<p style="color:rgba(255,255,255,0.5);margin-top:12px;">Loading...</p></div>';
    }

    /**
     * Attach delegated click handlers via data-action.
     * @param {HTMLElement} el @param {Object<string,function>} map
     */
    function bindActions(el, map) {
        el.addEventListener("click", function (e) {
            var btn = e.target.closest("[data-action]"); if (!btn) return;
            var fn = map[btn.getAttribute("data-action")];
            if (fn) fn(btn.getAttribute("data-param") || "", btn);
        });
    }

    /** @param {string} id @param {function} handler */
    function bindEnter(id, handler) {
        var el = document.getElementById(id);
        if (el) el.addEventListener("keydown", function (e) { if (e.key === "Enter") handler(); });
    }

    /** @param {boolean} ok - Correct or not */
    function doFeedback(ok) {
        if (ok) {
            if (typeof addXP === "function") addXP(10);
            if (typeof addCombo === "function") addCombo();
            if (typeof SoundEngine !== "undefined") SoundEngine.correct();
        } else {
            if (typeof resetCombo === "function") resetCombo();
            if (typeof SoundEngine !== "undefined") SoundEngine.wrong();
        }
    }

    // ===== MODE 1: Translation Quiz =====

    /** @param {HTMLElement} [c] - Container (defaults to gameArea) */
    function showTranslationQuiz(c) {
        c = c || document.getElementById("gameArea");
        tqState = {score:0, round:0, total:10}; nextTQRound(c);
    }

    /** @param {HTMLElement} c */
    async function nextTQRound(c) {
        if (tqState.round >= tqState.total) { showTQResult(c); return; }
        tqState.round++; c.innerHTML = renderLoading();
        var pair = FB[Math.floor(Math.random() * FB.length)], correctKo = pair.ko;
        if (getRemaining() > pair.en.length) { try { correctKo = await translate(pair.en, "en|ko"); } catch (e) { /* fb */ } }
        var wrongs = pickWrongKo(FB, pair.ko, 3);
        var opts = shuffleArray([correctKo].concat(wrongs));
        renderTQQuestion(c, pair.en, correctKo, opts);
    }

    /** @param {HTMLElement} c @param {string} en @param {string} correctKo @param {string[]} opts */
    function renderTQQuestion(c, en, correctKo, opts) {
        var h = '<h2 class="game-title">' + escapeHtml("\uBC88\uC5ED \uD034\uC988") + '</h2>';
        h += '<p style="text-align:center;color:var(--neon-cyan);">Translation Quiz</p>';
        h += '<div style="text-align:center;margin:6px 0;color:rgba(255,255,255,0.5);">' + tqState.round + ' / ' + tqState.total + '</div>';
        h += renderQuota();
        h += '<div style="background:var(--glass);border:1px solid rgba(157,78,221,0.3);border-radius:15px;padding:25px;max-width:500px;margin:0 auto 20px;text-align:center;">';
        h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:8px;">Translate to Korean:</div>';
        h += '<div style="font-size:1.3rem;font-weight:700;color:white;">' + escapeHtml(en) + '</div></div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:500px;margin:0 auto;">';
        for (var i = 0; i < opts.length; i++) {
            h += '<button class="game-btn secondary" data-action="tqA" data-param="' + escapeHtml(opts[i]) + '" style="padding:14px;font-size:1rem;">' + escapeHtml(opts[i]) + '</button>';
        }
        h += '</div><div style="text-align:center;margin-top:12px;color:var(--gold);">' + escapeHtml("\uC810\uC218: " + tqState.score) + '</div>';
        c.innerHTML = h;
        bindActions(c, {tqA: function (sel) { checkTQAnswer(c, sel, correctKo, en); }});
    }

    /** @param {HTMLElement} c @param {string} sel @param {string} correct @param {string} en */
    function checkTQAnswer(c, sel, correct, en) {
        var ok = (sel === correct);
        if (ok) tqState.score += 10;
        doFeedback(ok);
        var color = ok ? "var(--neon-cyan)" : "var(--neon-pink)";
        var h = '<h2 class="game-title">' + escapeHtml("\uBC88\uC5ED \uD034\uC988") + '</h2>';
        h += '<div style="text-align:center;margin:20px 0;">';
        h += '<div style="font-size:1.8rem;font-weight:900;color:' + color + ';">' + (ok ? escapeHtml("\uC815\uB2F5!") : escapeHtml("\uC624\uB2F5!")) + '</div>';
        h += '<div style="margin-top:12px;font-size:1rem;color:rgba(255,255,255,0.7);">' + escapeHtml(en) + '</div>';
        h += '<div style="margin-top:8px;font-size:1.2rem;color:var(--neon-cyan);">' + escapeHtml(correct) + '</div></div>';
        h += '<div style="text-align:center;"><button class="game-btn" data-action="next">' + escapeHtml("\uB2E4\uC74C") + '</button></div>';
        c.innerHTML = h;
        bindActions(c, {next: function () { nextTQRound(c); }});
    }

    /** @param {HTMLElement} c */
    function showTQResult(c) {
        if (typeof createConfetti === "function") createConfetti(40);
        var pct = Math.round((tqState.score / (tqState.total * 10)) * 100);
        var h = '<h2 class="game-title">' + escapeHtml("\uBC88\uC5ED \uD034\uC988 \uACB0\uACFC") + '</h2>';
        h += '<div style="text-align:center;"><div style="font-size:3rem;color:var(--gold);margin:20px 0;">' + escapeHtml(tqState.score + "\uC810") + '</div>';
        h += '<div style="color:var(--neon-cyan);margin-bottom:20px;">' + escapeHtml(pct + "% \uC815\uB2F5\uB960") + '</div>';
        h += '<button class="game-btn" data-action="re">' + escapeHtml("\uB2E4\uC2DC \uD558\uAE30") + '</button></div>';
        c.innerHTML = h;
        bindActions(c, {re: function () { showTranslationQuiz(c); }});
    }

    // ===== MODE 2: Reverse Translation =====

    /** @param {HTMLElement} [c] */
    function showReverseTranslation(c) {
        c = c || document.getElementById("gameArea");
        rtState = {score:0, round:0, total:10}; nextRTRound(c);
    }

    /** @param {HTMLElement} c */
    function nextRTRound(c) {
        if (rtState.round >= rtState.total) { showRTResult(c); return; }
        rtState.round++; renderRTQuestion(c, FB[Math.floor(Math.random() * FB.length)]);
    }

    /** @param {HTMLElement} c @param {{en:string,ko:string}} pair */
    function renderRTQuestion(c, pair) {
        var h = '<h2 class="game-title">' + escapeHtml("\uC5ED\uBC88\uC5ED \uC5F0\uC2B5") + '</h2>';
        h += '<p style="text-align:center;color:var(--neon-cyan);">Reverse Translation</p>';
        h += '<div style="text-align:center;margin:6px 0;color:rgba(255,255,255,0.5);">' + rtState.round + ' / ' + rtState.total + '</div>';
        h += renderQuota();
        h += '<div style="background:var(--glass);border:1px solid rgba(0,212,255,0.3);border-radius:15px;padding:25px;max-width:500px;margin:0 auto 20px;text-align:center;">';
        h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:8px;">Translate to English:</div>';
        h += '<div style="font-size:1.4rem;font-weight:700;color:var(--neon-pink);">' + escapeHtml(pair.ko) + '</div></div>';
        h += '<div style="max-width:500px;margin:0 auto;">';
        h += '<input id="rtInput" type="text" placeholder="Type English translation..." style="width:100%;padding:12px 16px;border-radius:10px;border:1px solid rgba(157,78,221,0.3);background:rgba(255,255,255,0.05);color:white;font-size:1rem;box-sizing:border-box;" />';
        h += '<div style="text-align:center;margin-top:12px;"><button class="game-btn" data-action="sub">' + escapeHtml("\uC81C\uCD9C Submit") + '</button></div></div>';
        h += '<div style="text-align:center;margin-top:12px;color:var(--gold);">' + escapeHtml("\uC810\uC218: " + rtState.score) + '</div>';
        c.innerHTML = h;
        bindActions(c, {sub: function () { submitRT(c, pair); }});
        bindEnter("rtInput", function () { submitRT(c, pair); });
        var inp = document.getElementById("rtInput"); if (inp) inp.focus();
    }

    /** @param {HTMLElement} c @param {{en:string,ko:string}} pair */
    async function submitRT(c, pair) {
        var inp = document.getElementById("rtInput"), ua = inp ? inp.value.trim() : "";
        if (!ua) return;
        var apiTr = pair.en;
        if (getRemaining() > pair.ko.length) { try { apiTr = await translate(pair.ko, "ko|en"); } catch (e) { /* fb */ } }
        var sim = Math.max(wordSimilarity(ua, apiTr), wordSimilarity(ua, pair.en));
        var pts = sim >= 70 ? 10 : sim >= 40 ? 5 : 0;
        rtState.score += pts; doFeedback(pts > 0);
        var gc = sim >= 70 ? "var(--neon-cyan)" : sim >= 40 ? "var(--gold)" : "var(--neon-pink)";
        var gt = sim >= 70 ? "\uD6CC\uB96D\uD574\uC694! Excellent!" : sim >= 40 ? "\uAD1C\uCC2E\uC544\uC694! Not bad!" : "\uB2E4\uC2DC \uB3C4\uC804! Try again!";
        var h = '<h2 class="game-title">' + escapeHtml("\uC5ED\uBC88\uC5ED \uACB0\uACFC") + '</h2>';
        h += '<div style="text-align:center;margin:20px 0;">';
        h += '<div style="font-size:1.5rem;font-weight:900;color:' + gc + ';">' + escapeHtml(gt) + '</div>';
        h += '<div style="font-size:2rem;color:var(--gold);margin:10px 0;">' + escapeHtml(sim + "%") + '</div></div>';
        h += '<div style="background:var(--glass);border-radius:12px;padding:20px;max-width:500px;margin:0 auto 15px;">';
        h += '<div style="margin-bottom:10px;"><span style="color:rgba(255,255,255,0.5);">Your answer: </span><span style="color:white;">' + escapeHtml(ua) + '</span></div>';
        h += '<div style="margin-bottom:10px;"><span style="color:rgba(255,255,255,0.5);">API translation: </span><span style="color:var(--neon-cyan);">' + escapeHtml(apiTr) + '</span></div>';
        h += '<div><span style="color:rgba(255,255,255,0.5);">Reference: </span><span style="color:var(--neon-pink);">' + escapeHtml(pair.en) + '</span></div></div>';
        h += '<div style="text-align:center;"><button class="game-btn" data-action="next">' + escapeHtml("\uB2E4\uC74C") + '</button></div>';
        c.innerHTML = h;
        bindActions(c, {next: function () { nextRTRound(c); }});
    }

    /** @param {HTMLElement} c */
    function showRTResult(c) {
        if (typeof createConfetti === "function") createConfetti(40);
        var h = '<h2 class="game-title">' + escapeHtml("\uC5ED\uBC88\uC5ED \uACB0\uACFC") + '</h2>';
        h += '<div style="text-align:center;"><div style="font-size:3rem;color:var(--gold);margin:20px 0;">' + escapeHtml(rtState.score + "\uC810") + '</div>';
        h += '<button class="game-btn" data-action="re">' + escapeHtml("\uB2E4\uC2DC \uD558\uAE30") + '</button></div>';
        c.innerHTML = h;
        bindActions(c, {re: function () { showReverseTranslation(c); }});
    }

    // ===== MODE 3: Translation Challenge (Speed) =====

    /** @param {HTMLElement} [c] */
    function showTranslationChallenge(c) {
        c = c || document.getElementById("gameArea");
        if (speedState.intervalId) clearInterval(speedState.intervalId);
        speedState = {score:0, streak:0, best:0, timer:60, active:true, intervalId:null};
        renderSpeedRound(c);
        speedState.intervalId = setInterval(function () {
            speedState.timer--;
            var el = document.getElementById("speedTimer");
            if (el) el.textContent = speedState.timer + "s";
            if (speedState.timer <= 0) { clearInterval(speedState.intervalId); speedState.active = false; showSpeedResult(c); }
        }, 1000);
    }

    /** @param {HTMLElement} c */
    function renderSpeedRound(c) {
        if (!speedState.active) return;
        var pair = FB[Math.floor(Math.random() * FB.length)];
        var opts = shuffleArray([pair.ko].concat(pickWrongKo(FB, pair.ko, 3)));
        var combo = speedState.streak >= 3 ? ' <span style="color:var(--gold);">x' + speedState.streak + ' COMBO!</span>' : "";
        var h = '<h2 class="game-title">' + escapeHtml("\uC2A4\uD53C\uB4DC \uBC88\uC5ED") + '</h2>';
        h += '<p style="text-align:center;color:var(--neon-cyan);">Speed Translation Challenge</p>';
        h += '<div style="display:flex;justify-content:space-between;max-width:500px;margin:8px auto;padding:0 10px;">';
        h += '<div style="color:var(--gold);font-weight:700;">' + escapeHtml("\uC810\uC218: " + speedState.score) + '</div>';
        h += '<div id="speedTimer" style="color:var(--neon-pink);font-weight:700;font-size:1.2rem;">' + escapeHtml(speedState.timer + "s") + '</div>';
        h += '<div style="color:var(--neon-cyan);font-weight:700;">' + escapeHtml("Best: " + speedState.best) + '</div></div>';
        h += '<div style="text-align:center;min-height:20px;">' + combo + '</div>';
        h += '<div style="background:var(--glass);border:1px solid rgba(255,45,149,0.3);border-radius:15px;padding:25px;max-width:500px;margin:10px auto 15px;text-align:center;">';
        h += '<div style="font-size:1.4rem;font-weight:700;color:white;">' + escapeHtml(pair.en) + '</div></div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:500px;margin:0 auto;">';
        for (var i = 0; i < opts.length; i++) {
            h += '<button class="game-btn secondary" data-action="spA" data-param="' + escapeHtml(opts[i]) + '" style="padding:14px;font-size:1rem;">' + escapeHtml(opts[i]) + '</button>';
        }
        h += '</div>';
        c.innerHTML = h;
        bindActions(c, {spA: function (sel) {
            if (!speedState.active) return;
            if (sel === pair.ko) {
                speedState.streak++;
                speedState.score += 10 + Math.min(speedState.streak, 10) * 2;
                if (speedState.streak > speedState.best) speedState.best = speedState.streak;
                if (typeof addXP === "function") addXP(5);
                if (typeof addCombo === "function") addCombo();
                if (typeof SoundEngine !== "undefined") SoundEngine.correct();
            } else {
                speedState.streak = 0;
                if (typeof resetCombo === "function") resetCombo();
                if (typeof SoundEngine !== "undefined") SoundEngine.wrong();
            }
            renderSpeedRound(c);
        }});
    }

    /** @param {HTMLElement} c */
    function showSpeedResult(c) {
        if (typeof createConfetti === "function") createConfetti(50);
        var h = '<h2 class="game-title">' + escapeHtml("\uC2A4\uD53C\uB4DC \uBC88\uC5ED \uACB0\uACFC") + '</h2>';
        h += '<div style="text-align:center;">';
        h += '<div style="font-size:3.5rem;color:var(--gold);margin:20px 0;">' + escapeHtml(speedState.score + "\uC810") + '</div>';
        h += '<div style="color:var(--neon-cyan);margin-bottom:8px;">' + escapeHtml("Best Streak: " + speedState.best + "x") + '</div>';
        h += '<button class="game-btn" data-action="re">' + escapeHtml("\uB2E4\uC2DC \uD558\uAE30") + '</button></div>';
        c.innerHTML = h;
        bindActions(c, {re: function () { showTranslationChallenge(c); }});
    }

    // ===== CSS Injection =====
    /** Injects module CSS. */
    (function () {
        var s = document.createElement("style");
        s.textContent = "#rtInput:focus{outline:none;border-color:var(--neon-purple);box-shadow:0 0 10px rgba(157,78,221,0.3);}";
        document.head.appendChild(s);
    })();

    // ===== Global Exposure =====
    window.showTranslationQuiz = showTranslationQuiz;
    window.showReverseTranslation = showReverseTranslation;
    window.showTranslationChallenge = showTranslationChallenge;
})();

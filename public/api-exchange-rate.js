/**
 * api-exchange-rate.js
 * Exchange rate Korean learning module using fawazahmed0 currency API.
 * Provides currency quiz, Korean number reading, and shopping simulation.
 * @requires security-utils.js (escapeHtml)
 * @requires main-app.js (addXP, addCombo, resetCombo, SoundEngine,
 *   createConfetti, showToast, saveProgress, gameState, speakKorean, shuffle)
 */
(function () {
    "use strict";

    /** @type {string} Currency API endpoint */
    var RATE_API = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json";

    /** @type {number} Cache TTL: 24 hours in milliseconds */
    var RATE_CACHE_TTL = 86400000;

    /** @type {string} localStorage key for cached rate */
    var RATE_CACHE_KEY = "exrate_usd_krw";

    /** @type {number} Fallback rate when offline */
    var FALLBACK_RATE = 1350;

    /** @type {{score:number, round:number, total:number, rate:number}} */
    var quizState = {score: 0, round: 0, total: 5, rate: FALLBACK_RATE};

    /** @type {Array<{kr:string, en:string, value:string}>} Korean number vocabulary (19 items) */
    var numberVocab = [
        {kr:"\uC601",en:"yeong",value:"0"},{kr:"\uC77C",en:"il",value:"1"},{kr:"\uC774",en:"i",value:"2"},
        {kr:"\uC0BC",en:"sam",value:"3"},{kr:"\uC0AC",en:"sa",value:"4"},{kr:"\uC624",en:"o",value:"5"},
        {kr:"\uC721",en:"yuk",value:"6"},{kr:"\uCE60",en:"chil",value:"7"},{kr:"\uD314",en:"pal",value:"8"},
        {kr:"\uAD6C",en:"gu",value:"9"},{kr:"\uC2ED",en:"sip",value:"10"},{kr:"\uBC31",en:"baek",value:"100"},
        {kr:"\uCC9C",en:"cheon",value:"1,000"},{kr:"\uB9CC",en:"man",value:"10,000"},
        {kr:"\uC2ED\uB9CC",en:"sipman",value:"100,000"},{kr:"\uBC31\uB9CC",en:"baekman",value:"1,000,000"},
        {kr:"\uCC9C\uB9CC",en:"cheonman",value:"10,000,000"},{kr:"\uC5B5",en:"eok",value:"100,000,000"},
        {kr:"\uC6D0",en:"won",value:"currency"}
    ];

    /** @type {Array<string>} Fun facts about Korean won (8 items) */
    var wonFacts = [
        "\uD55C\uAD6D \uD654\uD3D0 '\uC6D0(\u20A9)'\uC740 '\uB465\uADF8\uB780 \uAC83'\uC744 \uC758\uBBF8\uD558\uB294 \uD55C\uC790 '\u5713'\uC5D0\uC11C \uC720\uB798\uD588\uC5B4\uC694.",
        "\uAC00\uC7A5 \uD070 \uC9C0\uD3D0\uB294 50,000\uC6D0\uAD8C! \uC2E0\uC0AC\uC784\uB2F9 \uCD08\uC0C1\uD654\uAC00 \uADF8\uB824\uC838 \uC788\uC5B4\uC694.",
        "\uD55C\uAD6D \uB3D9\uC804: 10\uC6D0, 50\uC6D0, 100\uC6D0, 500\uC6D0\uC774 \uC788\uC5B4\uC694.",
        "10,000\uC6D0\uAD8C\uC5D0\uB294 \uC138\uC885\uB300\uC655 \uCD08\uC0C1\uD654\uAC00 \uC788\uC5B4\uC694!",
        "\uD55C\uAD6D\uC740 \uB9CC(\u4E07) \uB2E8\uC704\uB85C \uC22B\uC790\uB97C \uC138\uC694. \uC601\uC5B4 thousand\uACFC \uB2E4\uB974\uC8E0!",
        "5,000\uC6D0\uAD8C: \uC728\uACE1 \uC774\uC774 | 1,000\uC6D0\uAD8C: \uD1F4\uACC4 \uC774\uD669",
        "\uD55C\uAD6D\uC740 \uCE74\uB4DC \uACB0\uC81C\uAC00 \uB9E4\uC6B0 \uBCF4\uD3B8\uD654\uB418\uC5B4 \uD604\uAE08 \uC5C6\uC774\uB3C4 OK!",
        "500\uC6D0 \uB3D9\uC804\uC5D0\uB294 \uB450\uB8E8\uBBF8\uAC00 \uADF8\uB824\uC838 \uC788\uC5B4\uC694!"
    ];

    /** @type {Array<{name:string, nameKr:string, usd:number, icon:string}>} Shopping items (12) */
    var shopItems = [
        {name:"Coffee",nameKr:"\uCEE4\uD53C",usd:4.5,icon:"\u2615"},{name:"Smartphone",nameKr:"\uC2A4\uB9C8\uD2B8\uD3F0",usd:999,icon:"\uD83D\uDCF1"},
        {name:"Laptop",nameKr:"\uB178\uD2B8\uBD81",usd:1299,icon:"\uD83D\uDCBB"},{name:"Korean Meal",nameKr:"\uD55C\uC2DD",usd:8,icon:"\uD83C\uDF5A"},
        {name:"Taxi Ride",nameKr:"\uD0DD\uC2DC",usd:5,icon:"\uD83D\uDE95"},{name:"Hotel Night",nameKr:"\uD638\uD154 1\uBC15",usd:120,icon:"\uD83C\uDFE8"},
        {name:"Concert Ticket",nameKr:"\uCF58\uC11C\uD2B8 \uD2F0\uCF13",usd:85,icon:"\uD83C\uDFB5"},{name:"K-Beauty Set",nameKr:"\uD55C\uAD6D \uD654\uC7A5\uD488",usd:35,icon:"\uD83D\uDC84"},
        {name:"Soju Bottle",nameKr:"\uC18C\uC8FC",usd:2,icon:"\uD83C\uDF76"},{name:"KTX Ticket",nameKr:"KTX \uD45C",usd:45,icon:"\uD83D\uDE84"},
        {name:"Movie Ticket",nameKr:"\uC601\uD654 \uD2F0\uCF13",usd:10,icon:"\uD83C\uDFAC"},{name:"Hanbok Rental",nameKr:"\uD55C\uBCF5 \uB300\uC5EC",usd:25,icon:"\uD83D\uDC58"}
    ];

    // ===== Cache Utilities =====

    /** @param {string} k @returns {Object|null} Cached rate or null if expired */
    function getCachedRate() {
        try {
            var raw = localStorage.getItem(RATE_CACHE_KEY);
            if (!raw) return null;
            var obj = JSON.parse(raw);
            return (Date.now() - obj.ts > RATE_CACHE_TTL) ? null : obj.data;
        } catch (e) { return null; }
    }

    /** @param {Object} data - Rate data to cache */
    function setCacheRate(data) {
        try { localStorage.setItem(RATE_CACHE_KEY, JSON.stringify({ts: Date.now(), data: data})); }
        catch (e) { /* Storage full */ }
    }

    // ===== Fetch Helpers =====

    /**
     * Fetch USD to KRW exchange rate with cache and fallback.
     * @returns {Promise<{rate:number, date:string, offline:boolean}>}
     */
    async function fetchRate() {
        var cached = getCachedRate();
        if (cached) return cached;
        try {
            var res = await fetch(RATE_API);
            if (!res.ok) throw new Error("HTTP " + res.status);
            var json = await res.json();
            var krw = json.usd && json.usd.krw ? Math.round(json.usd.krw) : FALLBACK_RATE;
            var result = {rate: krw, date: json.date || new Date().toISOString().slice(0, 10), offline: false};
            setCacheRate(result);
            return result;
        } catch (e) {
            return {rate: FALLBACK_RATE, date: new Date().toISOString().slice(0, 10), offline: true};
        }
    }

    // ===== Utility Helpers =====

    /** @param {Array} arr @returns {Array} Shuffled array (Fisher-Yates) */
    function shuffleArray(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        }
        return arr;
    }

    /** @param {number} n @returns {string} Number with comma separators */
    function fmtNum(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

    /**
     * Convert a number to Korean reading (Sino-Korean).
     * @param {number} n - Number to convert
     * @returns {string} Korean reading
     */
    function toKoreanNumber(n) {
        if (n === 0) return "\uC601";
        var units = ["", "\uB9CC", "\uC5B5", "\uC870"];
        var digits = ["", "\uC77C", "\uC774", "\uC0BC", "\uC0AC", "\uC624", "\uC721", "\uCE60", "\uD314", "\uAD6C"];
        var subUnits = ["", "\uC2ED", "\uBC31", "\uCC9C"];
        var parts = [];
        var unitIdx = 0;
        while (n > 0) {
            var chunk = n % 10000;
            if (chunk > 0) {
                var chunkStr = "";
                var pos = 0;
                var c = chunk;
                while (c > 0) {
                    var d = c % 10;
                    if (d > 0) {
                        var prefix = (d === 1 && pos > 0) ? "" : digits[d];
                        chunkStr = prefix + subUnits[pos] + chunkStr;
                    }
                    c = Math.floor(c / 10);
                    pos++;
                }
                parts.unshift(chunkStr + units[unitIdx]);
            }
            n = Math.floor(n / 10000);
            unitIdx++;
        }
        return parts.join(" ");
    }

    /** @returns {string} Random fun fact about Korean won */
    function getWonFact() { return wonFacts[Math.floor(Math.random() * wonFacts.length)]; }

    /** @returns {string} Loading spinner markup */
    function renderLoading() {
        return '<div style="text-align:center;padding:40px;"><div class="game-loading-spinner"></div>' +
            '<p style="color:rgba(255,255,255,0.5);margin-top:12px;">Loading exchange rate...</p></div>';
    }

    /** @param {HTMLElement} el @param {Object<string,function>} map - Action-to-handler */
    function bindActions(el, map) {
        el.addEventListener("click", function (e) {
            var btn = e.target.closest("[data-action]");
            if (!btn) return;
            var fn = map[btn.getAttribute("data-action")];
            if (fn) fn(btn.getAttribute("data-param") || "", btn);
        });
    }

    /** @param {string} date @param {boolean} offline @returns {string} Rate source badge HTML */
    function renderRateBadge(date, offline) {
        var color = offline ? "var(--neon-pink)" : "var(--neon-cyan)";
        var label = offline ? "Offline (fallback)" : "Live rate";
        return '<div style="text-align:center;font-size:0.75rem;color:' + color + ';margin:8px 0;">' +
            escapeHtml(label + " | " + date) + '</div>';
    }

    // ===== MODE 1: Currency Quiz =====

    /**
     * Display the currency conversion quiz with real exchange rates.
     * @param {HTMLElement} c - Game area container element
     */
    async function showCurrencyQuiz(c) {
        c.innerHTML = renderLoading();
        var data = await fetchRate();
        quizState = {score: 0, round: 0, total: 5, rate: data.rate};
        renderCurrencyQuestion(c, data);
    }

    /**
     * Render a single currency conversion question.
     * @param {HTMLElement} c - Container element
     * @param {Object} data - Rate data with rate, date, offline
     */
    function renderCurrencyQuestion(c, data) {
        if (quizState.round >= quizState.total) {
            renderCurrencyResult(c, data);
            return;
        }
        quizState.round++;
        var usd = [5, 10, 15, 20, 25, 30, 50, 75, 100][Math.floor(Math.random() * 9)];
        var correct = usd * data.rate;
        var opts = [correct];
        while (opts.length < 4) {
            var off = correct + (Math.floor(Math.random() * 6) - 3) * Math.round(data.rate * 0.3);
            if (off > 0 && opts.indexOf(off) === -1) opts.push(off);
        }
        opts = shuffleArray(opts);
        var h = '<h2 class="game-title">' + escapeHtml("\uD658\uC728 \uD034\uC988") + '</h2>';
        h += '<p style="text-align:center;color:var(--neon-cyan)">Currency Conversion Quiz</p>';
        h += renderRateBadge(data.date, data.offline);
        h += '<div style="text-align:center;margin:10px 0;color:rgba(255,255,255,0.5);font-size:0.85rem;">' +
            escapeHtml("Round " + quizState.round + " / " + quizState.total + " | Score: " + quizState.score) + '</div>';
        h += '<div style="background:var(--glass);border:1px solid rgba(157,78,221,0.3);border-radius:15px;padding:25px;max-width:500px;margin:0 auto 20px;text-align:center;">';
        h += '<div style="font-size:0.85rem;color:rgba(255,255,255,0.5);">1 USD = ' + escapeHtml(fmtNum(data.rate)) + ' KRW</div>';
        h += '<div style="font-size:2.2rem;font-weight:900;color:var(--neon-pink);margin:15px 0;">$' + escapeHtml(String(usd)) + '</div>';
        h += '<div style="font-size:1.1rem;color:rgba(255,255,255,0.8);">' + escapeHtml("\uC774 \uAE08\uC561\uC740 \uBA87 \uC6D0\uC77C\uAE4C\uC694?") + '</div></div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:500px;margin:0 auto;">';
        for (var i = 0; i < opts.length; i++) {
            h += '<button class="game-btn secondary" data-action="answer" data-param="' + opts[i] + '"' +
                ' style="padding:14px;font-size:1rem;">' + escapeHtml(fmtNum(opts[i]) + "\uC6D0") + '</button>';
        }
        h += '</div>';
        h += '<div style="text-align:center;margin-top:15px;padding:10px;background:rgba(0,245,212,0.08);border-radius:10px;max-width:500px;margin:15px auto 0;">';
        h += '<div style="font-size:0.8rem;color:var(--neon-cyan);">' + escapeHtml(getWonFact()) + '</div></div>';
        c.innerHTML = h;
        bindActions(c, {
            answer: function (val) {
                var ok = (parseInt(val, 10) === correct);
                if (ok) {
                    quizState.score += 20;
                    if (typeof addXP === "function") addXP(15);
                    if (typeof addCombo === "function") addCombo();
                    if (typeof SoundEngine !== "undefined") SoundEngine.correct();
                } else {
                    if (typeof resetCombo === "function") resetCombo();
                    if (typeof SoundEngine !== "undefined") SoundEngine.wrong();
                }
                var msg = ok ? "\uB9DE\uC558\uC5B4\uC694! Correct!" : "\uD2C0\uB838\uC5B4\uC694! $" + usd + " = " + fmtNum(correct) + "\uC6D0";
                if (typeof showToast === "function") showToast(msg);
                renderCurrencyQuestion(c, data);
            }
        });
    }

    /** @param {HTMLElement} c @param {Object} data - Rate data */
    function renderCurrencyResult(c, data) {
        if (typeof createConfetti === "function") createConfetti(30);
        var label = quizState.score >= 80 ? "\uD658\uC728 \uB9C8\uC2A4\uD130!" : "\uB354 \uC5F0\uC2B5\uD574\uBCF4\uC138\uC694!";
        c.innerHTML = '<h2 class="game-title">' + escapeHtml("\uD658\uC728 \uD034\uC988 \uACB0\uACFC") + '</h2>' +
            '<div style="text-align:center;margin:30px 0;"><div style="font-size:3rem;color:var(--gold);">' + escapeHtml(quizState.score + "\uC810") + '</div>' +
            '<div style="font-size:1.1rem;color:rgba(255,255,255,0.7);margin-top:10px;">' + escapeHtml(label) + '</div></div>' +
            '<div style="text-align:center"><button class="game-btn" data-action="retry">' + escapeHtml("\uB2E4\uC2DC \uD558\uAE30") + '</button></div>';
        bindActions(c, {retry: function () { showCurrencyQuiz(c); }});
    }

    // ===== MODE 2: Korean Number Game =====

    /**
     * Display the Korean number reading game for large won amounts.
     * @param {HTMLElement} c - Game area container element
     */
    function showKoreanNumberGame(c) {
        var state = {score: 0, round: 0, total: 6, mode: null};
        renderNumberModeSelect(c, state);
    }

    /**
     * Render mode selection for number game.
     * @param {HTMLElement} c - Container element
     * @param {Object} state - Game state
     */
    function renderNumberModeSelect(c, state) {
        var h = '<h2 class="game-title">' + escapeHtml("\uD55C\uAD6D\uC5B4 \uC22B\uC790 \uC77D\uAE30") + '</h2>';
        h += '<p style="text-align:center;color:var(--neon-cyan)">Korean Number Reading</p>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:400px;margin:20px auto;">';
        h += '<button class="game-btn" data-action="mode" data-param="sino" style="padding:20px;">';
        h += escapeHtml("\uD55C\uAD6D\uC5B4 \uC22B\uC790") + '<br><small style="color:rgba(255,255,255,0.5)">' + escapeHtml("\uC77C, \uC774, \uC0BC...") + '</small></button>';
        h += '<button class="game-btn secondary" data-action="mode" data-param="native" style="padding:20px;">';
        h += escapeHtml("\uACE0\uC720\uC5B4 \uC22B\uC790") + '<br><small style="color:rgba(255,255,255,0.5)">' + escapeHtml("\uD558\uB098, \uB458, \uC14B...") + '</small></button>';
        h += '</div>';
        h += '<div style="margin:20px auto;max-width:500px;"><div style="font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:8px;text-align:center;">Number Vocabulary</div>';
        h += '<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;">';
        for (var i = 0; i < numberVocab.length; i++) {
            var v = numberVocab[i];
            h += '<span style="padding:4px 10px;border-radius:15px;background:rgba(255,45,149,0.15);border:1px solid rgba(255,45,149,0.25);font-size:0.8rem;cursor:pointer;" data-action="speak" data-param="' +
                escapeHtml(v.kr) + '">' + escapeHtml(v.kr) + ' <small style="color:rgba(255,255,255,0.4)">' + escapeHtml(v.value) + '</small></span>';
        }
        h += '</div></div>';
        c.innerHTML = h;
        bindActions(c, {
            mode: function (m) { state.mode = m; renderNumberRound(c, state); },
            speak: function (w) { if (typeof speakKorean === "function") speakKorean(w); }
        });
    }

    /**
     * Render a single round of the number reading game.
     * @param {HTMLElement} c - Container element
     * @param {Object} state - Game state with mode, score, round
     */
    function renderNumberRound(c, state) {
        if (state.round >= state.total) {
            renderNumberResult(c, state);
            return;
        }
        state.round++;
        var amount;
        if (state.mode === "native") {
            amount = (Math.floor(Math.random() * 99) + 1);
        } else {
            var magnitudes = [1000, 5000, 10000, 50000, 100000, 500000, 1000000, 1350000, 5500000, 15000000];
            amount = magnitudes[Math.floor(Math.random() * magnitudes.length)] + Math.floor(Math.random() * 9) * 1000;
        }
        var correctReading = state.mode === "native" ? toNativeKorean(amount) : toKoreanNumber(amount);
        var options = [correctReading];
        var attempts = 0;
        while (options.length < 4 && attempts < 20) {
            var fakeAmt = state.mode === "native"
                ? Math.floor(Math.random() * 99) + 1
                : amount + (Math.floor(Math.random() * 5) - 2) * (state.mode === "sino" ? 10000 : 1000);
            if (fakeAmt > 0) {
                var fake = state.mode === "native" ? toNativeKorean(fakeAmt) : toKoreanNumber(fakeAmt);
                if (options.indexOf(fake) === -1) options.push(fake);
            }
            attempts++;
        }
        options = shuffleArray(options);
        var modeLabel = state.mode === "native" ? "\uACE0\uC720\uC5B4 \uC22B\uC790" : "\uD55C\uAD6D\uC5B4 \uC22B\uC790";
        var h = '<h2 class="game-title">' + escapeHtml(modeLabel) + '</h2>';
        h += '<div style="text-align:center;color:rgba(255,255,255,0.5);font-size:0.85rem;margin-bottom:10px;">' +
            escapeHtml("Round " + state.round + " / " + state.total + " | Score: " + state.score) + '</div>';
        h += '<div style="background:var(--glass);border:2px solid rgba(0,212,255,0.3);border-radius:15px;padding:30px;max-width:500px;margin:0 auto 20px;text-align:center;">';
        h += '<div style="font-size:2.5rem;font-weight:900;color:var(--neon-pink);">' + escapeHtml(fmtNum(amount)) + '</div>';
        if (state.mode === "sino") h += '<div style="font-size:1rem;color:var(--gold);margin-top:5px;">' + escapeHtml(fmtNum(amount) + "\uC6D0") + '</div>';
        h += '<div style="font-size:1rem;color:rgba(255,255,255,0.7);margin-top:10px;">' + escapeHtml("\uC774 \uC22B\uC790\uB97C \uD55C\uAD6D\uC5B4\uB85C \uC77D\uC73C\uC138\uC694") + '</div></div>';
        h += '<div style="display:grid;gap:10px;max-width:500px;margin:0 auto;">';
        for (var i = 0; i < options.length; i++) {
            h += '<button class="game-btn secondary" data-action="numAnswer" data-param="' + escapeHtml(options[i]) + '"' +
                ' style="padding:14px;font-size:1.05rem;">' + escapeHtml(options[i]) + '</button>';
        }
        h += '</div>';
        c.innerHTML = h;
        bindActions(c, {
            numAnswer: function (val) {
                var ok = (val === correctReading);
                if (ok) {
                    state.score += 15;
                    if (typeof addXP === "function") addXP(10);
                    if (typeof addCombo === "function") addCombo();
                    if (typeof SoundEngine !== "undefined") SoundEngine.correct();
                } else {
                    if (typeof resetCombo === "function") resetCombo();
                    if (typeof SoundEngine !== "undefined") SoundEngine.wrong();
                }
                if (typeof showToast === "function") showToast(ok ? "\uC815\uB2F5!" : "\uC815\uB2F5: " + correctReading);
                renderNumberRound(c, state);
            }
        });
    }

    /**
     * Convert a number to native Korean reading (1-99 range).
     * @param {number} n - Number to convert (1-99)
     * @returns {string} Native Korean reading
     */
    function toNativeKorean(n) {
        var ones = ["", "\uD558\uB098", "\uB458", "\uC14B", "\uB137", "\uB2E4\uC12F", "\uC5EC\uC12F", "\uC77C\uACF1", "\uC5EC\uB35F", "\uC544\uD649"];
        var tens = ["", "\uC5F4", "\uC2A4\uBB3C", "\uC11C\uB978", "\uB9C8\uD754", "\uC270", "\uC608\uC21C", "\uC77C\uD754", "\uC5EC\uB4E0", "\uC544\uD754"];
        if (n <= 0 || n > 99) return String(n);
        var t = Math.floor(n / 10);
        var o = n % 10;
        return (tens[t] + (t > 0 && o > 0 ? " " : "") + ones[o]).trim();
    }

    /** @param {HTMLElement} c @param {Object} state */
    function renderNumberResult(c, state) {
        if (typeof createConfetti === "function") createConfetti(25);
        var label = state.score >= 60 ? "\uC22B\uC790 \uB9C8\uC2A4\uD130!" : "\uC870\uAE08 \uB354 \uC5F0\uC2B5\uD574\uBCF4\uC138\uC694!";
        c.innerHTML = '<h2 class="game-title">' + escapeHtml("\uC22B\uC790 \uAC8C\uC784 \uACB0\uACFC") + '</h2>' +
            '<div style="text-align:center;margin:30px 0;"><div style="font-size:3rem;color:var(--gold);">' + escapeHtml(state.score + "\uC810") + '</div>' +
            '<div style="margin-top:8px;color:rgba(255,255,255,0.6)">' + escapeHtml(label) + '</div></div>' +
            '<div style="text-align:center"><button class="game-btn" data-action="retry">' + escapeHtml("\uB2E4\uC2DC \uD558\uAE30") + '</button></div>';
        bindActions(c, {retry: function () { showKoreanNumberGame(c); }});
    }

    // ===== MODE 3: Shopping Game =====

    /**
     * Display the shopping simulation game with real exchange rates.
     * @param {HTMLElement} c - Game area container element
     */
    async function showShoppingGame(c) {
        c.innerHTML = renderLoading();
        var data = await fetchRate();
        var state = {score: 0, round: 0, total: 5, rate: data.rate, cart: 0};
        renderShoppingRound(c, data, state);
    }

    /**
     * Render a shopping round with product cards.
     * @param {HTMLElement} c - Container element
     * @param {Object} data - Rate data
     * @param {Object} state - Shopping game state
     */
    function renderShoppingRound(c, data, state) {
        if (state.round >= state.total) {
            renderShoppingResult(c, state);
            return;
        }
        state.round++;
        var item = shopItems[Math.floor(Math.random() * shopItems.length)];
        var correctKRW = Math.round(item.usd * data.rate);
        var opts = [correctKRW];
        while (opts.length < 4) {
            var off = correctKRW + (Math.floor(Math.random() * 6) - 3) * Math.round(data.rate * 0.4);
            if (off > 0 && opts.indexOf(off) === -1) opts.push(off);
        }
        opts = shuffleArray(opts);
        var h = '<h2 class="game-title">' + escapeHtml("\uD55C\uAD6D \uC1FC\uD551 \uAC8C\uC784") + '</h2>';
        h += '<p style="text-align:center;color:var(--neon-cyan)">Shopping in Korea!</p>';
        h += renderRateBadge(data.date, data.offline);
        h += '<div style="text-align:center;font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:12px;">' +
            escapeHtml("Round " + state.round + " / " + state.total + " | Score: " + state.score) + '</div>';
        h += '<div style="background:linear-gradient(135deg,rgba(255,45,149,0.15),rgba(157,78,221,0.15));border:2px solid rgba(255,45,149,0.3);border-radius:20px;padding:30px;max-width:400px;margin:0 auto 20px;text-align:center;">';
        h += '<div style="font-size:3rem;">' + item.icon + '</div>';
        h += '<div style="font-size:1.3rem;font-weight:bold;color:var(--neon-pink);margin:8px 0;">' + escapeHtml(item.nameKr) + '</div>';
        h += '<div style="font-size:0.9rem;color:rgba(255,255,255,0.5);">' + escapeHtml(item.name) + '</div>';
        h += '<div style="font-size:2rem;font-weight:900;color:var(--gold);margin-top:10px;">$' + escapeHtml(String(item.usd)) + '</div>';
        h += '<div style="font-size:0.9rem;color:rgba(255,255,255,0.7);margin-top:8px;">' + escapeHtml("\uD55C\uAD6D \uC6D0\uC73C\uB85C \uC5BC\uB9C8\uC77C\uAE4C\uC694?") + '</div></div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:450px;margin:0 auto;">';
        for (var i = 0; i < opts.length; i++) {
            h += '<button class="game-btn secondary" data-action="shopAnswer" data-param="' + opts[i] + '"' +
                ' style="padding:14px;font-size:1rem;">' + escapeHtml(fmtNum(opts[i]) + "\uC6D0") + '</button>';
        }
        h += '</div>';
        h += '<div style="text-align:center;margin-top:12px;font-size:0.8rem;color:rgba(0,245,212,0.7);">' + escapeHtml(getWonFact()) + '</div>';
        c.innerHTML = h;
        bindActions(c, {
            shopAnswer: function (val) {
                var ok = (parseInt(val, 10) === correctKRW);
                if (ok) {
                    state.score += 20;
                    state.cart += correctKRW;
                    if (typeof addXP === "function") addXP(15);
                    if (typeof addCombo === "function") addCombo();
                    if (typeof SoundEngine !== "undefined") SoundEngine.correct();
                } else {
                    if (typeof resetCombo === "function") resetCombo();
                    if (typeof SoundEngine !== "undefined") SoundEngine.wrong();
                }
                if (typeof showToast === "function") showToast(ok ? "\uC815\uB2F5!" : escapeHtml(item.nameKr) + " = " + fmtNum(correctKRW) + "\uC6D0");
                renderShoppingRound(c, data, state);
            }
        });
    }

    /** @param {HTMLElement} c @param {Object} state */
    function renderShoppingResult(c, state) {
        if (typeof createConfetti === "function") createConfetti(30);
        var label = state.score >= 80 ? "\uC1FC\uD551 \uB9C8\uC2A4\uD130!" : "\uB354 \uC5F0\uC2B5\uD574\uBCF4\uC138\uC694!";
        c.innerHTML = '<h2 class="game-title">' + escapeHtml("\uC1FC\uD551 \uACB0\uACFC") + '</h2>' +
            '<div style="text-align:center;margin:25px 0;"><div style="font-size:3rem;color:var(--gold);">' + escapeHtml(state.score + "\uC810") + '</div>' +
            '<div style="font-size:1rem;color:rgba(255,255,255,0.6);margin-top:8px;">' + escapeHtml("\uCD1D \uC7A5\uBC14\uAD6C\uB2C8: " + fmtNum(state.cart) + "\uC6D0") + '</div>' +
            '<div style="font-size:1rem;color:rgba(255,255,255,0.6);margin-top:4px;">' + escapeHtml("\uD55C\uAD6D\uC5B4: " + toKoreanNumber(state.cart) + "\uC6D0") + '</div>' +
            '<div style="margin-top:10px;color:rgba(255,255,255,0.5)">' + escapeHtml(label) + '</div></div>' +
            '<div style="text-align:center"><button class="game-btn" data-action="retry">' + escapeHtml("\uB2E4\uC2DC \uD558\uAE30") + '</button></div>';
        bindActions(c, {retry: function () { showShoppingGame(c); }});
    }

    // ===== Global Exposure =====

    window.showCurrencyQuiz = showCurrencyQuiz;
    window.showKoreanNumberGame = showKoreanNumberGame;
    window.showShoppingGame = showShoppingGame;
})();

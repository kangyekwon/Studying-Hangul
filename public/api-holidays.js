/**
 * api-holidays.js
 * Korean holidays learning module using Nager.Date public holidays API.
 * Provides holiday quiz, visual calendar, and cultural deep-dive stories.
 * @requires security-utils.js (escapeHtml)
 * @requires main-app.js (addXP, addCombo, resetCombo, SoundEngine,
 *   createConfetti, showToast, saveProgress, gameState, speakKorean, shuffle)
 */
(function () {
    "use strict";

    /** @type {string} Nager.Date API endpoint for Korean public holidays */
    var HOLIDAY_API = "https://date.nager.at/api/v3/publicholidays/2026/KR";

    /** @type {number} Cache TTL: 7 days in milliseconds */
    var HOLIDAY_CACHE_TTL = 604800000;

    /** @type {string} localStorage key */
    var HOLIDAY_CACHE_KEY = "kr_holidays_2026";

    /** @type {Array<Object>} Comprehensive fallback holiday data */
    var fallbackHolidays = [
        {date: "2026-01-01", koreanName: "\uC2E0\uC815", englishName: "New Year's Day", description: "\uC591\uB825 \uC0C8\uD574 \uCCAB\uB0A0\uC744 \uCD95\uD558\uB294 \uB0A0\uC785\uB2C8\uB2E4.", traditions: ["\uD574\uB3CB\uC774 \uBCF4\uAE30", "\uC0C8\uD574 \uC18C\uC6D0 \uBE4C\uAE30"], food: ["\uB5A1\uAD6D"], greeting: "\uC0C8\uD574 \uBCF5 \uB9CE\uC774 \uBC1B\uC73C\uC138\uC694!"},
        {date: "2026-02-17", koreanName: "\uC124\uB0A0", englishName: "Lunar New Year", description: "\uC74C\uB825 1\uC6D4 1\uC77C, \uD55C\uAD6D \uCD5C\uB300 \uBA85\uC808\uC785\uB2C8\uB2E4.", traditions: ["\uC138\uBC30\uD558\uAE30", "\uC138\uBD1F\uB3C8 \uBC1B\uAE30", "\uC724\uB180\uC774 \uD558\uAE30", "\uD55C\uBCF5 \uC785\uAE30"], food: ["\uB5A1\uAD6D", "\uB9CC\uB450", "\uC804"], greeting: "\uC0C8\uD574 \uBCF5 \uB9CE\uC774 \uBC1B\uC73C\uC138\uC694!"},
        {date: "2026-02-16", koreanName: "\uC124\uB0A0 \uC5F0\uD734", englishName: "Lunar New Year Holiday", description: "\uC124\uB0A0 \uC804\uB0A0 \uC5F0\uD734\uC785\uB2C8\uB2E4.", traditions: ["\uAC00\uC871 \uBAA8\uC784", "\uADC0\uC131"], food: ["\uB5A1\uAD6D"], greeting: "\uC990\uAC70\uC6B4 \uC124\uB0A0 \uBCF4\uB0B4\uC138\uC694!"},
        {date: "2026-02-18", koreanName: "\uC124\uB0A0 \uC5F0\uD734", englishName: "Lunar New Year Holiday", description: "\uC124\uB0A0 \uB2E4\uC74C\uB0A0 \uC5F0\uD734\uC785\uB2C8\uB2E4.", traditions: ["\uC131\uBB18 \uCC38\uBC30", "\uD070\uC808 \uC778\uC0AC"], food: ["\uC2DD\uD61C"], greeting: "\uBCF5 \uB9CE\uC774 \uBC1B\uC73C\uC138\uC694!"},
        {date: "2026-03-01", koreanName: "\uC0BC\uC77C\uC808", englishName: "Independence Movement Day", description: "1919\uB144 3.1 \uB3C5\uB9BD\uC6B4\uB3D9\uC744 \uAE30\uB150\uD558\uB294 \uB0A0\uC785\uB2C8\uB2E4.", traditions: ["\uD0DC\uADF9\uAE30 \uAC8C\uC591", "\uAE30\uB150\uC2DD \uCC38\uC11D", "\uB3C5\uB9BD\uC6B4\uB3D9\uAC00 \uBD80\uB974\uAE30"], food: [], greeting: "\uB300\uD55C\uB3C5\uB9BD \uB9CC\uC138!"},
        {date: "2026-05-05", koreanName: "\uC5B4\uB9B0\uC774\uB0A0", englishName: "Children's Day", description: "\uC5B4\uB9B0\uC774\uB4E4\uC758 \uD589\uBCF5\uACFC \uAD8C\uB9AC\uB97C \uCD95\uD558\uB294 \uB0A0\uC785\uB2C8\uB2E4.", traditions: ["\uB180\uC774\uACF5\uC6D0 \uAC00\uAE30", "\uC120\uBB3C \uC8FC\uAE30", "\uAC00\uC871 \uB098\uB4E4\uC774"], food: ["\uC5B4\uB9B0\uC774 \uC88B\uC544\uD558\uB294 \uC74C\uC2DD"], greeting: "\uC5B4\uB9B0\uC774\uB0A0 \uCD95\uD558\uD574\uC694!"},
        {date: "2026-05-24", koreanName: "\uBD80\uCC98\uB2D8 \uC624\uC2E0 \uB0A0", englishName: "Buddha's Birthday", description: "\uC11D\uAC00\uBAA8\uB2C8\uC758 \uD0C4\uC0DD\uC744 \uAE30\uB150\uD558\uB294 \uB0A0\uC785\uB2C8\uB2E4.", traditions: ["\uC5F0\uB4F1\uD68C", "\uC808 \uBC29\uBB38", "\uBE44\uB85C\uC790\uB098 \uCC28 \uB9C8\uC2DC\uAE30"], food: ["\uC808\uBC25", "\uC57D\uACFC"], greeting: "\uBD80\uCC98\uB2D8 \uC624\uC2E0 \uB0A0 \uCD95\uD558\uD569\uB2C8\uB2E4!"},
        {date: "2026-06-06", koreanName: "\uD604\uCDA9\uC77C", englishName: "Memorial Day", description: "\uB098\uB77C\uB97C \uC704\uD574 \uBAA9\uC228\uC744 \uBC14\uCE5C \uBD84\uB4E4\uC744 \uCD94\uBAA8\uD558\uB294 \uB0A0\uC785\uB2C8\uB2E4.", traditions: ["\uAD6D\uB9BD\uBB18\uC9C0 \uCC38\uBC30", "\uBB35\uB150", "\uD0DC\uADF9\uAE30 \uC870\uAE30 \uAC8C\uC591"], food: [], greeting: "\uD604\uCDA9\uC77C\uC744 \uAE30\uC5B5\uD569\uB2C8\uB2E4."},
        {date: "2026-08-15", koreanName: "\uAD11\uBCF5\uC808", englishName: "Liberation Day", description: "1945\uB144 \uC77C\uBCF8\uC73C\uB85C\uBD80\uD130 \uD574\uBC29\uB41C \uB0A0\uC744 \uAE30\uB150\uD569\uB2C8\uB2E4.", traditions: ["\uAE30\uB150\uC2DD \uCC38\uC11D", "\uD0DC\uADF9\uAE30 \uAC8C\uC591", "\uC560\uAD6D\uAC00 \uBD80\uB974\uAE30"], food: [], greeting: "\uAD11\uBCF5\uC808\uC744 \uCD95\uD558\uD569\uB2C8\uB2E4!"},
        {date: "2026-09-25", koreanName: "\uCD94\uC11D", englishName: "Chuseok", description: "\uC74C\uB825 8\uC6D4 15\uC77C, \uD55C\uAD6D\uC758 \uCD94\uC218\uAC10\uC0AC\uC808\uC785\uB2C8\uB2E4.", traditions: ["\uC131\uBB18 \uCC28\uB840", "\uBC8C\uCD08 \uBC29\uBB38", "\uAC15\uAC15\uC220\uB798", "\uC1A1\uD3B8 \uB9CC\uB4E4\uAE30"], food: ["\uC1A1\uD3B8", "\uC804", "\uAC08\uBE44\uCC1C", "\uC2DD\uD61C", "\uD55C\uACFC"], greeting: "\uCD94\uC11D \uC798 \uBCF4\uB0B4\uC138\uC694!"},
        {date: "2026-09-24", koreanName: "\uCD94\uC11D \uC5F0\uD734", englishName: "Chuseok Holiday", description: "\uCD94\uC11D \uC804\uB0A0 \uC5F0\uD734\uC785\uB2C8\uB2E4.", traditions: ["\uADC0\uC131", "\uC1A1\uD3B8 \uBE4C\uAE30"], food: ["\uC1A1\uD3B8"], greeting: "\uD480\uC694\uB85C\uC6B4 \uCD94\uC11D \uB418\uC138\uC694!"},
        {date: "2026-09-26", koreanName: "\uCD94\uC11D \uC5F0\uD734", englishName: "Chuseok Holiday", description: "\uCD94\uC11D \uB2E4\uC74C\uB0A0 \uC5F0\uD734\uC785\uB2C8\uB2E4.", traditions: ["\uAC00\uC871 \uBAA8\uC784"], food: ["\uC2DD\uD61C", "\uD55C\uACFC"], greeting: "\uCD94\uC11D \uC798 \uBCF4\uB0B4\uC138\uC694!"},
        {date: "2026-10-03", koreanName: "\uAC1C\uCC9C\uC808", englishName: "National Foundation Day", description: "\uB2E8\uAD70\uC758 \uAC74\uAD6D\uC744 \uAE30\uB150\uD558\uB294 \uB0A0\uC785\uB2C8\uB2E4.", traditions: ["\uAC1C\uCC9C\uC808 \uAE30\uB150\uC2DD"], food: [], greeting: "\uAC1C\uCC9C\uC808\uC744 \uCD95\uD558\uD569\uB2C8\uB2E4!"},
        {date: "2026-10-09", koreanName: "\uD55C\uAE00\uB0A0", englishName: "Hangul Day", description: "\uC138\uC885\uB300\uC655\uC774 \uD55C\uAE00\uC744 \uBC18\uD3EC\uD55C \uAC83\uC744 \uAE30\uB150\uD558\uB294 \uB0A0\uC785\uB2C8\uB2E4.", traditions: ["\uD55C\uAE00 \uBC31\uC77C\uC7A5", "\uD55C\uAE00 \uAD00\uB828 \uD589\uC0AC", "\uC678\uAD6D\uC778 \uD55C\uAD6D\uC5B4 \uB9D0\uD558\uAE30 \uB300\uD68C"], food: [], greeting: "\uD55C\uAE00\uB0A0\uC744 \uCD95\uD558\uD569\uB2C8\uB2E4!"},
        {date: "2026-12-25", koreanName: "\uD06C\uB9AC\uC2A4\uB9C8\uC2A4", englishName: "Christmas", description: "\uC608\uC218 \uADF8\uB9AC\uC2A4\uB3C4\uC758 \uD0C4\uC0DD\uC744 \uAE30\uB150\uD558\uB294 \uB0A0\uC785\uB2C8\uB2E4.", traditions: ["\uC120\uBB3C \uAD50\uD658", "\uD06C\uB9AC\uC2A4\uB9C8\uC2A4 \uCF00\uC774\uD06C", "\uCEE4\uD50C \uB370\uC774\uD2B8"], food: ["\uD06C\uB9AC\uC2A4\uB9C8\uC2A4 \uCF00\uC774\uD06C", "\uCE58\uD0A8"], greeting: "\uBA54\uB9AC \uD06C\uB9AC\uC2A4\uB9C8\uC2A4!"}
    ];

    /** @type {Array<{kr:string, en:string, romanization:string}>} Cultural vocabulary (24 items) */
    var cultureVocab = [
        {kr:"\uBA85\uC808",en:"traditional holiday",romanization:"myeongjeol"},{kr:"\uC138\uBC30",en:"New Year's bow",romanization:"sebae"},
        {kr:"\uC138\uBD1F\uB3C8",en:"New Year's money",romanization:"sebitdon"},{kr:"\uB5A1\uAD6D",en:"rice cake soup",romanization:"tteokguk"},
        {kr:"\uC1A1\uD3B8",en:"half-moon rice cake",romanization:"songpyeon"},{kr:"\uD55C\uBCF5",en:"Korean clothes",romanization:"hanbok"},
        {kr:"\uC870\uC0C1",en:"ancestors",romanization:"josang"},{kr:"\uCC28\uB840",en:"ancestral rites",romanization:"charye"},
        {kr:"\uC131\uBB18",en:"grave visit",romanization:"seongmyo"},{kr:"\uADC0\uC131",en:"returning home",romanization:"gwiseong"},
        {kr:"\uBCF5",en:"luck/blessing",romanization:"bok"},{kr:"\uC5F0\uD734",en:"holiday",romanization:"yeonhyu"},
        {kr:"\uAE30\uB150\uC77C",en:"anniversary",romanization:"ginyeomil"},{kr:"\uCD95\uC81C",en:"festival",romanization:"chukje"},
        {kr:"\uC804\uD1B5",en:"tradition",romanization:"jeontong"},{kr:"\uBB38\uD654",en:"culture",romanization:"munhwa"},
        {kr:"\uAC00\uC871",en:"family",romanization:"gajok"},{kr:"\uAC10\uC0AC",en:"gratitude",romanization:"gamsa"},
        {kr:"\uCD94\uC218\uAC10\uC0AC",en:"harvest thanks",romanization:"chusugamsa"},{kr:"\uD0DC\uADF9\uAE30",en:"Korean flag",romanization:"taegeukgi"},
        {kr:"\uB3C5\uB9BD",en:"independence",romanization:"dongnip"},{kr:"\uD574\uBC29",en:"liberation",romanization:"haebang"},
        {kr:"\uD55C\uAE00",en:"Korean alphabet",romanization:"hangeul"},{kr:"\uAC15\uAC15\uC220\uB798",en:"circle dance",romanization:"ganggangsullae"}
    ];

    // ===== Cache Utilities =====

    /** @returns {Array|null} Cached holidays or null if expired */
    function getCachedHolidays() {
        try {
            var raw = localStorage.getItem(HOLIDAY_CACHE_KEY);
            if (!raw) return null;
            var obj = JSON.parse(raw);
            return (Date.now() - obj.ts > HOLIDAY_CACHE_TTL) ? null : obj.data;
        } catch (e) { return null; }
    }

    /** @param {Array} data - Holiday data to cache */
    function setCacheHolidays(data) {
        try { localStorage.setItem(HOLIDAY_CACHE_KEY, JSON.stringify({ts: Date.now(), data: data})); }
        catch (e) { /* Storage full */ }
    }

    // ===== Fetch Helpers =====

    /**
     * Merge API data with fallback enrichment data.
     * @param {Array} apiData - Raw API holiday array
     * @returns {Array} Enriched holiday objects
     */
    function enrichHolidays(apiData) {
        var fbMap = {};
        for (var i = 0; i < fallbackHolidays.length; i++) {
            fbMap[fallbackHolidays[i].date] = fallbackHolidays[i];
        }
        var result = [];
        for (var j = 0; j < apiData.length; j++) {
            var h = apiData[j];
            var fb = fbMap[h.date] || {};
            result.push({
                date: h.date,
                koreanName: h.localName || fb.koreanName || h.name,
                englishName: h.name || fb.englishName || "",
                description: fb.description || h.name + " public holiday",
                traditions: fb.traditions || [],
                food: fb.food || [],
                greeting: fb.greeting || ""
            });
        }
        return result;
    }

    /**
     * Fetch Korean holidays from API with cache and fallback.
     * @returns {Promise<{holidays:Array, offline:boolean}>}
     */
    async function fetchHolidays() {
        var cached = getCachedHolidays();
        if (cached) return {holidays: cached, offline: false};
        try {
            var res = await fetch(HOLIDAY_API);
            if (!res.ok) throw new Error("HTTP " + res.status);
            var data = enrichHolidays(await res.json());
            setCacheHolidays(data);
            return {holidays: data, offline: false};
        } catch (e) {
            return {holidays: fallbackHolidays, offline: true};
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

    /** @param {string} dateStr @returns {number} Days until date (negative if past) */
    function daysUntil(dateStr) {
        var target = new Date(dateStr + "T00:00:00");
        var today = new Date(); today.setHours(0, 0, 0, 0);
        return Math.ceil((target - today) / 86400000);
    }

    /** @returns {string} Loading spinner markup */
    function renderLoading() {
        return '<div style="text-align:center;padding:40px;"><div class="game-loading-spinner"></div>' +
            '<p style="color:rgba(255,255,255,0.5);margin-top:12px;">Loading holidays...</p></div>';
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

    /** @param {Array} holidays @returns {Object|null} Next upcoming holiday */
    function findNextHoliday(holidays) {
        var best = null, bestDays = Infinity;
        for (var i = 0; i < holidays.length; i++) {
            var d = daysUntil(holidays[i].date);
            if (d >= 0 && d < bestDays) { bestDays = d; best = holidays[i]; }
        }
        return best;
    }

    // ===== MODE 1: Holiday Quiz =====

    /**
     * Display the Korean holiday quiz with cultural context.
     * @param {HTMLElement} c - Game area container element
     */
    async function showHolidayQuiz(c) {
        c.innerHTML = renderLoading();
        var result = await fetchHolidays();
        var state = {score: 0, round: 0, total: 5, holidays: result.holidays};
        renderHolidayQuestion(c, state);
    }

    /**
     * Render a single holiday quiz question.
     * @param {HTMLElement} c - Container element
     * @param {Object} state - Quiz state
     */
    function renderHolidayQuestion(c, state) {
        if (state.round >= state.total) {
            renderHolidayResult(c, state);
            return;
        }
        state.round++;
        var pool = state.holidays.filter(function (h) { return h.description && h.description.length > 10; });
        if (pool.length < 4) pool = state.holidays;
        var idx = Math.floor(Math.random() * pool.length);
        var correct = pool[idx];
        var wrongPool = pool.filter(function (h) { return h.koreanName !== correct.koreanName; });
        wrongPool = shuffleArray(wrongPool).slice(0, 3);
        var options = shuffleArray([correct].concat(wrongPool));

        var h = '<h2 class="game-title">' + escapeHtml("\uD55C\uAD6D \uBA85\uC808 \uD034\uC988") + '</h2>';
        h += '<p style="text-align:center;color:var(--neon-cyan)">Korean Holiday Quiz</p>';
        h += '<div style="text-align:center;font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:12px;">' +
            escapeHtml("Round " + state.round + " / " + state.total + " | Score: " + state.score) + '</div>';
        h += '<div style="background:var(--glass);border:2px solid rgba(255,45,149,0.3);border-radius:15px;padding:25px;max-width:550px;margin:0 auto 20px;text-align:center;">';
        h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:8px;">' + escapeHtml(correct.date) + '</div>';
        h += '<div style="font-size:1rem;line-height:1.7;color:rgba(255,255,255,0.9);">' + escapeHtml(correct.description) + '</div>';
        if (correct.traditions && correct.traditions.length > 0) {
            h += '<div style="margin-top:10px;font-size:0.85rem;color:var(--neon-cyan);">' + escapeHtml("\uC804\uD1B5: " + correct.traditions.join(", ")) + '</div>';
        }
        h += '<div style="margin-top:12px;font-size:1rem;color:rgba(255,255,255,0.7);">' + escapeHtml("\uC774 \uBA85\uC808\uC758 \uC774\uB984\uC740?") + '</div></div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:500px;margin:0 auto;">';
        for (var i = 0; i < options.length; i++) {
            h += '<button class="game-btn secondary" data-action="hAnswer" data-param="' + escapeHtml(options[i].koreanName) + '"' +
                ' style="padding:14px;font-size:1rem;">' + escapeHtml(options[i].koreanName) +
                '<br><small style="color:rgba(255,255,255,0.4)">' + escapeHtml(options[i].englishName) + '</small></button>';
        }
        h += '</div>';
        c.innerHTML = h;
        bindActions(c, {
            hAnswer: function (val) {
                var ok = (val === correct.koreanName);
                if (ok) {
                    state.score += 20;
                    if (typeof addXP === "function") addXP(15);
                    if (typeof addCombo === "function") addCombo();
                    if (typeof SoundEngine !== "undefined") SoundEngine.correct();
                } else {
                    if (typeof resetCombo === "function") resetCombo();
                    if (typeof SoundEngine !== "undefined") SoundEngine.wrong();
                }
                var msg = ok ? "\uC815\uB2F5! " + correct.koreanName : "\uC815\uB2F5: " + correct.koreanName;
                if (correct.greeting) msg += " - " + correct.greeting;
                if (typeof showToast === "function") showToast(msg);
                renderHolidayQuestion(c, state);
            }
        });
    }

    /** @param {HTMLElement} c @param {Object} state */
    function renderHolidayResult(c, state) {
        if (typeof createConfetti === "function") createConfetti(30);
        var label = state.score >= 80 ? "\uBA85\uC808 \uB9C8\uC2A4\uD130!" : "\uB354 \uC5F0\uC2B5\uD574\uBCF4\uC138\uC694!";
        c.innerHTML = '<h2 class="game-title">' + escapeHtml("\uBA85\uC808 \uD034\uC988 \uACB0\uACFC") + '</h2>' +
            '<div style="text-align:center;margin:30px 0;"><div style="font-size:3rem;color:var(--gold);">' + escapeHtml(state.score + "\uC810") + '</div>' +
            '<div style="margin-top:8px;color:rgba(255,255,255,0.6)">' + escapeHtml(label) + '</div></div>' +
            '<div style="text-align:center"><button class="game-btn" data-action="retry">' + escapeHtml("\uB2E4\uC2DC \uD558\uAE30") + '</button></div>';
        bindActions(c, {retry: function () { showHolidayQuiz(c); }});
    }

    // ===== MODE 2: Holiday Calendar =====

    /**
     * Display a visual 2026 calendar with Korean holidays.
     * @param {HTMLElement} c - Game area container element
     */
    async function showHolidayCalendar(c) {
        c.innerHTML = renderLoading();
        var result = await fetchHolidays();
        renderCalendar(c, result.holidays, result.offline);
    }

    /**
     * Render the full year calendar grid.
     * @param {HTMLElement} c - Container element
     * @param {Array} holidays - Holiday data
     * @param {boolean} offline - Whether using fallback data
     */
    function renderCalendar(c, holidays, offline) {
        var monthNames = ["\uC6D4", "\uC6D4", "\uC6D4", "\uC6D4", "\uC6D4", "\uC6D4", "\uC6D4", "\uC6D4", "\uC6D4", "\uC6D4", "\uC6D4", "\uC6D4"];
        var hMap = {};
        for (var i = 0; i < holidays.length; i++) {
            hMap[holidays[i].date] = holidays[i];
        }
        var next = findNextHoliday(holidays);
        var h = '<h2 class="game-title">' + escapeHtml("2026 \uD55C\uAD6D \uBA85\uC808 \uB2EC\uB825") + '</h2>';
        h += '<p style="text-align:center;color:var(--neon-cyan)">Korean Holiday Calendar 2026</p>';
        if (offline) h += '<div style="text-align:center;font-size:0.75rem;color:var(--neon-pink);margin:5px 0;">' + escapeHtml("Offline mode") + '</div>';
        if (next) {
            var nd = daysUntil(next.date);
            h += '<div style="text-align:center;background:rgba(255,45,149,0.1);border:1px solid rgba(255,45,149,0.3);border-radius:12px;padding:12px;max-width:400px;margin:10px auto;">';
            h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.5);">' + escapeHtml("\uB2E4\uC74C \uBA85\uC808\uAE4C\uC9C0") + '</div>';
            h += '<div style="font-size:1.2rem;font-weight:bold;color:var(--neon-pink);">' + escapeHtml(next.koreanName) + '</div>';
            h += '<div style="font-size:0.85rem;color:var(--neon-cyan);">' + escapeHtml(nd + "\uC77C \uB0A8\uC74C (" + next.date + ")") + '</div></div>';
        }
        h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:15px;max-width:900px;margin:15px auto;">';
        for (var m = 0; m < 12; m++) {
            h += renderMonth(m, hMap, monthNames);
        }
        h += '</div>';
        h += '<div style="margin:20px auto;max-width:600px;"><div style="font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:8px;text-align:center;">' + escapeHtml("\uBA85\uC808 \uBAA9\uB85D") + '</div>';
        h += '<div style="display:grid;gap:6px;">';
        for (var k = 0; k < holidays.length; k++) {
            var hi = holidays[k];
            var dd = daysUntil(hi.date);
            var badge = dd > 0 ? "D-" + dd : dd === 0 ? "TODAY" : "passed";
            var badgeColor = dd === 0 ? "var(--gold)" : dd > 0 ? "var(--neon-cyan)" : "rgba(255,255,255,0.3)";
            h += '<div style="display:flex;align-items:center;gap:10px;padding:6px 12px;background:var(--glass);border-radius:8px;cursor:pointer;" data-action="detail" data-param="' + k + '">';
            h += '<span style="font-size:0.7rem;color:' + badgeColor + ';min-width:50px;">' + escapeHtml(badge) + '</span>';
            h += '<span style="color:var(--neon-pink);font-weight:600;">' + escapeHtml(hi.koreanName) + '</span>';
            h += '<span style="color:rgba(255,255,255,0.4);font-size:0.8rem;margin-left:auto;">' + escapeHtml(hi.date) + '</span></div>';
        }
        h += '</div></div>';
        c.innerHTML = h;
        bindActions(c, {
            detail: function (idx) {
                var ho = holidays[parseInt(idx, 10)];
                if (ho && typeof showToast === "function") {
                    var msg = ho.koreanName + " (" + ho.englishName + "): " + ho.description;
                    if (ho.greeting) msg += " | " + ho.greeting;
                    showToast(msg);
                }
            }
        });
    }

    /**
     * Render a single month grid for the calendar.
     * @param {number} month - Zero-indexed month number
     * @param {Object} hMap - Date-to-holiday lookup map
     * @param {Array} monthNames - Month name suffixes
     * @returns {string} Month grid HTML
     */
    function renderMonth(month, hMap, monthNames) {
        var days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
        var firstDay = new Date(2026, month, 1).getDay();
        var daysInMonth = new Date(2026, month + 1, 0).getDate();
        var h = '<div style="background:var(--glass);border:1px solid rgba(157,78,221,0.2);border-radius:12px;padding:12px;">';
        h += '<div style="text-align:center;font-weight:bold;color:var(--neon-pink);margin-bottom:8px;">' + escapeHtml((month + 1) + monthNames[month]) + '</div>';
        h += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;text-align:center;font-size:0.7rem;">';
        for (var d = 0; d < 7; d++) {
            var dc = d === 0 ? "var(--neon-pink)" : d === 6 ? "var(--neon-cyan)" : "rgba(255,255,255,0.4)";
            h += '<div style="color:' + dc + ';padding:2px;">' + days[d] + '</div>';
        }
        for (var pad = 0; pad < firstDay; pad++) h += '<div></div>';
        for (var day = 1; day <= daysInMonth; day++) {
            var ds = "2026-" + String(month + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
            var isH = hMap[ds];
            var bg = isH ? "background:rgba(255,45,149,0.3);border-radius:50%;font-weight:bold;color:var(--neon-pink);" : "color:rgba(255,255,255,0.6);";
            var title = isH ? ' title="' + escapeHtml(isH.koreanName) + '"' : "";
            h += '<div style="padding:3px;' + bg + '"' + title + '>' + day + '</div>';
        }
        h += '</div></div>';
        return h;
    }

    // ===== MODE 3: Holiday Culture Story =====

    /**
     * Display deep-dive cultural stories about Korean holidays.
     * @param {HTMLElement} c - Game area container element
     */
    async function showHolidayCultureStory(c) {
        c.innerHTML = renderLoading();
        var result = await fetchHolidays();
        renderStoryMenu(c, result.holidays);
    }

    /**
     * Render the story menu listing major holidays.
     * @param {HTMLElement} c - Container element
     * @param {Array} holidays - Holiday data
     */
    function renderStoryMenu(c, holidays) {
        var major = holidays.filter(function (h) { return h.traditions && h.traditions.length > 0; });
        var h = '<h2 class="game-title">' + escapeHtml("\uD55C\uAD6D \uBA85\uC808 \uC774\uC57C\uAE30") + '</h2>';
        h += '<p style="text-align:center;color:var(--neon-cyan)">Korean Holiday Culture Stories</p>';
        h += '<div style="display:grid;gap:12px;max-width:550px;margin:20px auto;">';
        for (var i = 0; i < major.length; i++) {
            var mi = major[i];
            var dd = daysUntil(mi.date);
            var ddLabel = dd > 0 ? "D-" + dd : dd === 0 ? "TODAY!" : "";
            h += '<button class="game-btn secondary" data-action="story" data-param="' + i + '" style="padding:15px;text-align:left;">';
            h += '<div style="display:flex;justify-content:space-between;align-items:center;">';
            h += '<div><span style="font-size:1.1rem;font-weight:bold;">' + escapeHtml(mi.koreanName) + '</span>';
            h += '<br><small style="color:rgba(255,255,255,0.4);">' + escapeHtml(mi.englishName + " | " + mi.date) + '</small></div>';
            if (ddLabel) h += '<span style="color:var(--neon-cyan);font-size:0.8rem;">' + escapeHtml(ddLabel) + '</span>';
            h += '</div></button>';
        }
        h += '</div>';
        h += '<div style="margin:25px auto;max-width:550px;">';
        h += '<div style="font-size:0.9rem;color:var(--neon-pink);font-weight:bold;margin-bottom:10px;text-align:center;">' + escapeHtml("\uBB38\uD654 \uC5B4\uD718 Cultural Vocabulary") + '</div>';
        h += '<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;">';
        for (var v = 0; v < cultureVocab.length; v++) {
            var cv = cultureVocab[v];
            h += '<span style="padding:4px 10px;border-radius:15px;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.25);font-size:0.8rem;cursor:pointer;" ' +
                'data-action="speak" data-param="' + escapeHtml(cv.kr) + '">' + escapeHtml(cv.kr) +
                ' <small style="color:rgba(255,255,255,0.4)">' + escapeHtml(cv.en) + '</small></span>';
        }
        h += '</div></div>';
        c.innerHTML = h;
        bindActions(c, {
            story: function (idx) { renderStoryDetail(c, holidays, major, parseInt(idx, 10)); },
            speak: function (w) { if (typeof speakKorean === "function") speakKorean(w); }
        });
    }

    /**
     * Render a detailed cultural story for a selected holiday.
     * @param {HTMLElement} c - Container element
     * @param {Array} allHolidays - Full holiday list
     * @param {Array} major - Major holidays with traditions
     * @param {number} idx - Index into major array
     */
    function renderStoryDetail(c, allHolidays, major, idx) {
        var ho = major[idx];
        if (!ho) { renderStoryMenu(c, allHolidays); return; }
        var h = '<h2 class="game-title">' + escapeHtml(ho.koreanName) + '</h2>';
        h += '<p style="text-align:center;color:var(--neon-cyan)">' + escapeHtml(ho.englishName + " | " + ho.date) + '</p>';
        h += '<div style="max-width:550px;margin:15px auto;">';
        h += '<div style="background:var(--glass);border:1px solid rgba(157,78,221,0.3);border-radius:15px;padding:20px;margin-bottom:15px;">';
        h += '<div style="font-size:1.05rem;line-height:1.7;color:rgba(255,255,255,0.9);">' + escapeHtml(ho.description) + '</div></div>';
        if (ho.traditions && ho.traditions.length > 0) {
            h += '<div style="background:rgba(255,45,149,0.08);border:1px solid rgba(255,45,149,0.2);border-radius:12px;padding:15px;margin-bottom:12px;">';
            h += '<div style="font-size:0.85rem;color:var(--neon-pink);font-weight:bold;margin-bottom:8px;">' + escapeHtml("\uC804\uD1B5 Traditions") + '</div>';
            for (var t = 0; t < ho.traditions.length; t++) {
                h += '<div style="padding:4px 0;color:rgba(255,255,255,0.8);cursor:pointer;" data-action="speak" data-param="' + escapeHtml(ho.traditions[t]) + '">' +
                    escapeHtml("- " + ho.traditions[t]) + '</div>';
            }
            h += '</div>';
        }
        if (ho.food && ho.food.length > 0) {
            h += '<div style="background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.2);border-radius:12px;padding:15px;margin-bottom:12px;">';
            h += '<div style="font-size:0.85rem;color:var(--neon-cyan);font-weight:bold;margin-bottom:8px;">' + escapeHtml("\uC804\uD1B5 \uC74C\uC2DD Traditional Food") + '</div>';
            h += '<div style="display:flex;flex-wrap:wrap;gap:8px;">';
            for (var f = 0; f < ho.food.length; f++) {
                h += '<span style="padding:5px 12px;background:rgba(0,212,255,0.15);border-radius:20px;font-size:0.9rem;cursor:pointer;" data-action="speak" data-param="' +
                    escapeHtml(ho.food[f]) + '">' + escapeHtml(ho.food[f]) + '</span>';
            }
            h += '</div></div>';
        }
        if (ho.greeting) {
            h += '<div style="background:rgba(0,245,212,0.08);border:1px solid rgba(0,245,212,0.2);border-radius:12px;padding:15px;margin-bottom:12px;text-align:center;">';
            h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:5px;">' + escapeHtml("Holiday Greeting") + '</div>';
            h += '<div style="font-size:1.3rem;font-weight:bold;color:var(--neon-cyan);cursor:pointer;" data-action="speak" data-param="' + escapeHtml(ho.greeting) + '">' +
                escapeHtml(ho.greeting) + '</div></div>';
        }
        h += '</div>';
        h += '<div style="text-align:center;"><button class="game-btn" data-action="back">' + escapeHtml("\uBAA9\uB85D\uC73C\uB85C Back") + '</button></div>';
        c.innerHTML = h;
        bindActions(c, {
            back: function () { renderStoryMenu(c, allHolidays); },
            speak: function (w) { if (typeof speakKorean === "function") speakKorean(w); }
        });
    }

    // ===== Global Exposure =====

    window.showHolidayQuiz = showHolidayQuiz;
    window.showHolidayCalendar = showHolidayCalendar;
    window.showHolidayCultureStory = showHolidayCultureStory;
})();

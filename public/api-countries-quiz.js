/**
 * api-countries-quiz.js
 * Countries quiz using REST Countries API and flagcdn.com.
 * Modes: Country Name Quiz (flags), Capital Quiz, Country Fact Game.
 * API: https://restcountries.com/v3.1 (free, no auth). Flags: https://flagcdn.com/{code}.svg
 * @requires security-utils.js (escapeHtml)
 * @requires main-app.js (shuffle, addXP, addCombo, resetCombo,
 *   SoundEngine, createConfetti, showToast, saveProgress, gameState, speakKorean)
 */
(function () {
    "use strict";

    /** @type {string} REST Countries API URL */
    var API = "https://restcountries.com/v3.1/all?fields=name,cca2,capital,region,subregion,population,languages,currencies,flags";
    /** @type {number} Cache TTL in ms (24h) */
    var CACHE_TTL = 86400000;
    /** @type {string} localStorage cache key */
    var CACHE_KEY = "countries_cache";

    /**
     * Fallback country data: 33 countries with Korean names, capitals, languages, currencies.
     * @type {Array<{code:string,nameKo:string,nameEn:string,capital:string,capitalKo:string,region:string,population:number,language:string,languageKo:string,currency:string,currencyKo:string}>}
     */
    var FC = [
        {code:"kr",nameKo:"\uD55C\uAD6D",nameEn:"South Korea",capital:"Seoul",capitalKo:"\uC11C\uC6B8",region:"Asia",population:51780000,language:"Korean",languageKo:"\uD55C\uAD6D\uC5B4",currency:"Won",currencyKo:"\uC6D0"},
        {code:"jp",nameKo:"\uC77C\uBCF8",nameEn:"Japan",capital:"Tokyo",capitalKo:"\uB3C4\uCFC4",region:"Asia",population:125800000,language:"Japanese",languageKo:"\uC77C\uBCF8\uC5B4",currency:"Yen",currencyKo:"\uC5D4"},
        {code:"cn",nameKo:"\uC911\uAD6D",nameEn:"China",capital:"Beijing",capitalKo:"\uBCA0\uC774\uC9D5",region:"Asia",population:1412000000,language:"Chinese",languageKo:"\uC911\uAD6D\uC5B4",currency:"Yuan",currencyKo:"\uC704\uC548"},
        {code:"th",nameKo:"\uD0DC\uAD6D",nameEn:"Thailand",capital:"Bangkok",capitalKo:"\uBC29\uCF55",region:"Asia",population:71600000,language:"Thai",languageKo:"\uD0DC\uAD6D\uC5B4",currency:"Baht",currencyKo:"\uBC14\uD2B8"},
        {code:"vn",nameKo:"\uBCA0\uD2B8\uB0A8",nameEn:"Vietnam",capital:"Hanoi",capitalKo:"\uD558\uB178\uC774",region:"Asia",population:98200000,language:"Vietnamese",languageKo:"\uBCA0\uD2B8\uB0A8\uC5B4",currency:"Dong",currencyKo:"\uB3D9"},
        {code:"in",nameKo:"\uC778\uB3C4",nameEn:"India",capital:"New Delhi",capitalKo:"\uB274\uB378\uB9AC",region:"Asia",population:1408000000,language:"Hindi",languageKo:"\uD78C\uB514\uC5B4",currency:"Rupee",currencyKo:"\uB8E8\uD53C"},
        {code:"ph",nameKo:"\uD544\uB9AC\uD540",nameEn:"Philippines",capital:"Manila",capitalKo:"\uB9C8\uB2D0\uB77C",region:"Asia",population:113900000,language:"Filipino",languageKo:"\uD544\uB9AC\uD540\uC5B4",currency:"Peso",currencyKo:"\uD398\uC18C"},
        {code:"id",nameKo:"\uC778\uB3C4\uB124\uC2DC\uC544",nameEn:"Indonesia",capital:"Jakarta",capitalKo:"\uC790\uCE74\uB974\uD0C0",region:"Asia",population:275500000,language:"Indonesian",languageKo:"\uC778\uB3C4\uB124\uC2DC\uC544\uC5B4",currency:"Rupiah",currencyKo:"\uB8E8\uD53C\uC544"},
        {code:"my",nameKo:"\uB9D0\uB808\uC774\uC2DC\uC544",nameEn:"Malaysia",capital:"Kuala Lumpur",capitalKo:"\uCFE0\uC54C\uB77C\uB8F8\uD478\uB974",region:"Asia",population:32800000,language:"Malay",languageKo:"\uB9D0\uB808\uC774\uC5B4",currency:"Ringgit",currencyKo:"\uB9C1\uAE43"},
        {code:"sg",nameKo:"\uC2F1\uAC00\uD3EC\uB974",nameEn:"Singapore",capital:"Singapore",capitalKo:"\uC2F1\uAC00\uD3EC\uB974",region:"Asia",population:5900000,language:"English",languageKo:"\uC601\uC5B4",currency:"Dollar",currencyKo:"\uB2EC\uB7EC"},
        {code:"mn",nameKo:"\uBAAD\uACE8",nameEn:"Mongolia",capital:"Ulaanbaatar",capitalKo:"\uC6B8\uB780\uBC14\uD1A0\uB974",region:"Asia",population:3300000,language:"Mongolian",languageKo:"\uBAAD\uACE8\uC5B4",currency:"Tugrik",currencyKo:"\uD22C\uADF8\uB9AD"},
        {code:"tw",nameKo:"\uB300\uB9CC",nameEn:"Taiwan",capital:"Taipei",capitalKo:"\uD0C0\uC774\uBCA0\uC774",region:"Asia",population:23600000,language:"Chinese",languageKo:"\uC911\uAD6D\uC5B4",currency:"Dollar",currencyKo:"\uB2EC\uB7EC"},
        {code:"mm",nameKo:"\uBBF8\uC580\uB9C8",nameEn:"Myanmar",capital:"Naypyidaw",capitalKo:"\uB124\uD53C\uB3C4",region:"Asia",population:54800000,language:"Burmese",languageKo:"\uBC84\uB9C8\uC5B4",currency:"Kyat",currencyKo:"\uCC28\uD2B8"},
        {code:"kh",nameKo:"\uCE84\uBCF4\uB514\uC544",nameEn:"Cambodia",capital:"Phnom Penh",capitalKo:"\uD504\uB188\uD39C",region:"Asia",population:16900000,language:"Khmer",languageKo:"\uD06C\uBA54\uB974\uC5B4",currency:"Riel",currencyKo:"\uB9AC\uC5D4"},
        {code:"la",nameKo:"\uB77C\uC624\uC2A4",nameEn:"Laos",capital:"Vientiane",capitalKo:"\uBE44\uC5D4\uD2F0\uC548",region:"Asia",population:7400000,language:"Lao",languageKo:"\uB77C\uC624\uC5B4",currency:"Kip",currencyKo:"\uD0A4\uD504"},
        {code:"np",nameKo:"\uB124\uD314",nameEn:"Nepal",capital:"Kathmandu",capitalKo:"\uCE74\uD2B8\uB9CC\uB450",region:"Asia",population:30000000,language:"Nepali",languageKo:"\uB124\uD314\uC5B4",currency:"Rupee",currencyKo:"\uB8E8\uD53C"},
        {code:"bd",nameKo:"\uBC29\uAE00\uB77C\uB370\uC2DC",nameEn:"Bangladesh",capital:"Dhaka",capitalKo:"\uB2E4\uCE74",region:"Asia",population:169400000,language:"Bengali",languageKo:"\uBCB5\uACE8\uC5B4",currency:"Taka",currencyKo:"\uD0C0\uCE74"},
        {code:"lk",nameKo:"\uC2A4\uB9AC\uB791\uCE74",nameEn:"Sri Lanka",capital:"Colombo",capitalKo:"\uCF5C\uB86C\uBCF4",region:"Asia",population:22200000,language:"Sinhala",languageKo:"\uC2F1\uD560\uB77C\uC5B4",currency:"Rupee",currencyKo:"\uB8E8\uD53C"},
        {code:"pk",nameKo:"\uD30C\uD0A4\uC2A4\uD0C4",nameEn:"Pakistan",capital:"Islamabad",capitalKo:"\uC774\uC2AC\uB77C\uB9C8\uBC14\uB4DC",region:"Asia",population:220900000,language:"Urdu",languageKo:"\uC6B0\uB974\uB450\uC5B4",currency:"Rupee",currencyKo:"\uB8E8\uD53C"},
        {code:"uz",nameKo:"\uC6B0\uC988\uBCA0\uD0A4\uC2A4\uD0C4",nameEn:"Uzbekistan",capital:"Tashkent",capitalKo:"\uD0C0\uC288\uCF04\uD2B8",region:"Asia",population:34900000,language:"Uzbek",languageKo:"\uC6B0\uC988\uBCA0\uD06C\uC5B4",currency:"Som",currencyKo:"\uC228"},
        {code:"us",nameKo:"\uBBF8\uAD6D",nameEn:"United States",capital:"Washington D.C.",capitalKo:"\uC6CC\uC2F1\uD134 D.C.",region:"Americas",population:331900000,language:"English",languageKo:"\uC601\uC5B4",currency:"Dollar",currencyKo:"\uB2EC\uB7EC"},
        {code:"gb",nameKo:"\uC601\uAD6D",nameEn:"United Kingdom",capital:"London",capitalKo:"\uB7F0\uB358",region:"Europe",population:67900000,language:"English",languageKo:"\uC601\uC5B4",currency:"Pound",currencyKo:"\uD30C\uC6B4\uB4DC"},
        {code:"fr",nameKo:"\uD504\uB791\uC2A4",nameEn:"France",capital:"Paris",capitalKo:"\uD30C\uB9AC",region:"Europe",population:67750000,language:"French",languageKo:"\uD504\uB791\uC2A4\uC5B4",currency:"Euro",currencyKo:"\uC720\uB85C"},
        {code:"de",nameKo:"\uB3C5\uC77C",nameEn:"Germany",capital:"Berlin",capitalKo:"\uBCA0\uB97C\uB9B0",region:"Europe",population:83200000,language:"German",languageKo:"\uB3C5\uC77C\uC5B4",currency:"Euro",currencyKo:"\uC720\uB85C"},
        {code:"it",nameKo:"\uC774\uD0C8\uB9AC\uC544",nameEn:"Italy",capital:"Rome",capitalKo:"\uB85C\uB9C8",region:"Europe",population:59100000,language:"Italian",languageKo:"\uC774\uD0C8\uB9AC\uC544\uC5B4",currency:"Euro",currencyKo:"\uC720\uB85C"},
        {code:"es",nameKo:"\uC2A4\uD398\uC778",nameEn:"Spain",capital:"Madrid",capitalKo:"\uB9C8\uB4DC\uB9AC\uB4DC",region:"Europe",population:47420000,language:"Spanish",languageKo:"\uC2A4\uD398\uC778\uC5B4",currency:"Euro",currencyKo:"\uC720\uB85C"},
        {code:"br",nameKo:"\uBE0C\uB77C\uC9C8",nameEn:"Brazil",capital:"Brasilia",capitalKo:"\uBE0C\uB77C\uC9C8\uB9AC\uC544",region:"Americas",population:214300000,language:"Portuguese",languageKo:"\uD3EC\uB974\uD22C\uAC08\uC5B4",currency:"Real",currencyKo:"\uD5E4\uC54C"},
        {code:"au",nameKo:"\uD638\uC8FC",nameEn:"Australia",capital:"Canberra",capitalKo:"\uCE94\uBC84\uB77C",region:"Oceania",population:25700000,language:"English",languageKo:"\uC601\uC5B4",currency:"Dollar",currencyKo:"\uB2EC\uB7EC"},
        {code:"ca",nameKo:"\uCE90\uB098\uB2E4",nameEn:"Canada",capital:"Ottawa",capitalKo:"\uC624\uD0C0\uC640",region:"Americas",population:38200000,language:"English",languageKo:"\uC601\uC5B4",currency:"Dollar",currencyKo:"\uB2EC\uB7EC"},
        {code:"ru",nameKo:"\uB7EC\uC2DC\uC544",nameEn:"Russia",capital:"Moscow",capitalKo:"\uBAA8\uC2A4\uD06C\uBC14",region:"Europe",population:144100000,language:"Russian",languageKo:"\uB7EC\uC2DC\uC544\uC5B4",currency:"Ruble",currencyKo:"\uB8E8\uBE14"},
        {code:"mx",nameKo:"\uBA55\uC2DC\uCF54",nameEn:"Mexico",capital:"Mexico City",capitalKo:"\uBA55\uC2DC\uCF54\uC2DC\uD2F0",region:"Americas",population:130300000,language:"Spanish",languageKo:"\uC2A4\uD398\uC778\uC5B4",currency:"Peso",currencyKo:"\uD398\uC18C"},
        {code:"eg",nameKo:"\uC774\uC9D1\uD2B8",nameEn:"Egypt",capital:"Cairo",capitalKo:"\uCE74\uC774\uB85C",region:"Africa",population:104300000,language:"Arabic",languageKo:"\uC544\uB78D\uC5B4",currency:"Pound",currencyKo:"\uD30C\uC6B4\uB4DC"},
        {code:"tr",nameKo:"\uD280\uB974\uD0A4\uC608",nameEn:"Turkey",capital:"Ankara",capitalKo:"\uC559\uCE74\uB77C",region:"Asia",population:85300000,language:"Turkish",languageKo:"\uD280\uB974\uD0A4\uC5B4",currency:"Lira",currencyKo:"\uB9AC\uB77C"}
    ];

    /** @type {{score:number,round:number,total:number}} */
    var cnState = {score:0,round:0,total:10};
    /** @type {{score:number,round:number,total:number}} */
    var capState = {score:0,round:0,total:10};
    /** @type {{score:number,round:number,total:number}} */
    var factState = {score:0,round:0,total:10};
    /** @type {Array|null} API countries data */
    var countriesData = null;

    // ===== Cache =====

    /** @param {string} k @returns {Array|null} */
    function getCached() {
        try {
            var raw = localStorage.getItem(CACHE_KEY); if (!raw) return null;
            var obj = JSON.parse(raw); if (Date.now() - obj.ts > CACHE_TTL) return null;
            return obj.data;
        } catch (e) { return null; }
    }

    /** @param {Array} data */
    function setCache(data) {
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ts:Date.now(),data:data})); } catch (e) { /* full */ }
    }

    // ===== Data Loading =====

    /**
     * Load countries from API/cache, fallback to built-in data.
     * @returns {Promise<Array>}
     */
    async function loadCountries() {
        if (countriesData) return countriesData;
        var cached = getCached();
        if (cached) { countriesData = cached; return cached; }
        try {
            var res = await fetch(API); if (!res.ok) throw new Error("HTTP " + res.status);
            var json = await res.json(); countriesData = json; setCache(json); return json;
        } catch (e) { countriesData = FC; return FC; }
    }

    /** @returns {Array} Always-available fallback list */
    function getList() { return FC; }

    /** @param {string} code @returns {string} Flag SVG URL */
    function flagUrl(code) { return "https://flagcdn.com/" + code.toLowerCase() + ".svg"; }

    // ===== Utilities =====

    /** @param {Array} arr @returns {Array} */
    function shuffleArray(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        }
        return arr;
    }

    /** @param {Array} pool @param {Object} exclude @param {number} n @returns {Array} */
    function pickOthers(pool, exclude, n) {
        return shuffleArray(pool.filter(function (c) { return c.code !== exclude.code; })).slice(0, n);
    }

    /** @param {number} pop @returns {string} Formatted Korean population */
    function formatPop(pop) {
        if (pop >= 100000000) return (pop / 100000000).toFixed(1) + "\uC5B5 \uBA85";
        if (pop >= 10000) return Math.round(pop / 10000).toLocaleString() + "\uB9CC \uBA85";
        return pop.toLocaleString() + "\uBA85";
    }

    /** @returns {string} */
    function renderLoading() {
        return '<div style="text-align:center;padding:40px;"><div class="game-loading-spinner"></div>' +
            '<p style="color:rgba(255,255,255,0.5);margin-top:12px;">Loading countries...</p></div>';
    }

    /** @param {HTMLElement} el @param {Object<string,function>} map */
    function bindActions(el, map) {
        el.addEventListener("click", function (e) {
            var btn = e.target.closest("[data-action]"); if (!btn) return;
            var fn = map[btn.getAttribute("data-action")];
            if (fn) fn(btn.getAttribute("data-param") || "", btn);
        });
    }

    /** @param {string} code @param {string} alt @returns {string} Flag img HTML */
    function renderFlag(code, alt) {
        return '<img src="' + escapeHtml(flagUrl(code)) + '" alt="' + escapeHtml(alt) +
            '" style="width:120px;height:80px;object-fit:cover;border-radius:8px;border:2px solid rgba(255,255,255,0.2);box-shadow:0 0 15px rgba(0,212,255,0.2);" loading="lazy" />';
    }

    /** @param {boolean} ok */
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

    // ===== MODE 1: Country Name Quiz =====

    /** @param {HTMLElement} [c] */
    function showCountryNameQuiz(c) {
        c = c || document.getElementById("gameArea");
        cnState = {score:0,round:0,total:10}; c.innerHTML = renderLoading();
        loadCountries().then(function () { nextCNRound(c); });
    }

    /** @param {HTMLElement} c */
    function nextCNRound(c) {
        if (cnState.round >= cnState.total) { showCNResult(c); return; }
        cnState.round++;
        var list = getList(), correct = list[Math.floor(Math.random() * list.length)];
        var opts = shuffleArray([correct].concat(pickOthers(list, correct, 3)));
        var h = '<h2 class="game-title">' + escapeHtml("\uAD6D\uAE30 \uD034\uC988") + '</h2>';
        h += '<p style="text-align:center;color:var(--neon-cyan);">Country Flag Quiz</p>';
        h += '<div style="text-align:center;margin:6px 0;color:rgba(255,255,255,0.5);">' + cnState.round + ' / ' + cnState.total + '</div>';
        h += '<div style="text-align:center;margin:20px 0;">' + renderFlag(correct.code, "Country flag") + '</div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:500px;margin:0 auto;">';
        for (var i = 0; i < opts.length; i++) {
            h += '<button class="game-btn secondary" data-action="cnA" data-param="' + escapeHtml(opts[i].code) + '" style="padding:14px;font-size:1rem;">';
            h += escapeHtml(opts[i].nameKo) + '<br><small style="color:rgba(255,255,255,0.4);">' + escapeHtml(opts[i].nameEn) + '</small></button>';
        }
        h += '</div><div style="text-align:center;margin-top:12px;color:var(--gold);">' + escapeHtml("\uC810\uC218: " + cnState.score) + '</div>';
        c.innerHTML = h;
        bindActions(c, {cnA: function (sel) {
            var ok = (sel === correct.code); if (ok) cnState.score += 10; doFeedback(ok);
            var color = ok ? "var(--neon-cyan)" : "var(--neon-pink)";
            var r = '<h2 class="game-title">' + escapeHtml("\uAD6D\uAE30 \uD034\uC988") + '</h2><div style="text-align:center;margin:20px 0;">';
            r += '<div style="font-size:1.8rem;font-weight:900;color:' + color + ';">' + (ok ? escapeHtml("\uC815\uB2F5!") : escapeHtml("\uC624\uB2F5!")) + '</div>';
            r += '<div style="margin:15px 0;">' + renderFlag(correct.code, correct.nameEn) + '</div>';
            r += '<div style="font-size:1.3rem;color:var(--neon-pink);">' + escapeHtml(correct.nameKo) + '</div>';
            r += '<div style="font-size:0.9rem;color:rgba(255,255,255,0.5);">' + escapeHtml(correct.nameEn) + '</div>';
            r += '<div style="font-size:0.85rem;color:var(--neon-cyan);margin-top:8px;">' + escapeHtml("\uC218\uB3C4: " + correct.capitalKo + " (" + correct.capital + ")") + '</div></div>';
            r += '<div style="text-align:center;"><button class="game-btn" data-action="next">' + escapeHtml("\uB2E4\uC74C") + '</button></div>';
            c.innerHTML = r;
            bindActions(c, {next: function () { nextCNRound(c); }});
        }});
    }

    /** @param {HTMLElement} c */
    function showCNResult(c) {
        if (typeof createConfetti === "function") createConfetti(40);
        var pct = Math.round((cnState.score / (cnState.total * 10)) * 100);
        var h = '<h2 class="game-title">' + escapeHtml("\uAD6D\uAE30 \uD034\uC988 \uACB0\uACFC") + '</h2>';
        h += '<div style="text-align:center;"><div style="font-size:3rem;color:var(--gold);margin:20px 0;">' + escapeHtml(cnState.score + "\uC810") + '</div>';
        h += '<div style="color:var(--neon-cyan);margin-bottom:20px;">' + escapeHtml(pct + "% \uC815\uB2F5\uB960") + '</div>';
        h += '<button class="game-btn" data-action="re">' + escapeHtml("\uB2E4\uC2DC \uD558\uAE30") + '</button></div>';
        c.innerHTML = h;
        bindActions(c, {re: function () { showCountryNameQuiz(c); }});
    }

    // ===== MODE 2: Capital Quiz =====

    /** @param {HTMLElement} [c] */
    function showCapitalQuiz(c) {
        c = c || document.getElementById("gameArea");
        capState = {score:0,round:0,total:10}; c.innerHTML = renderLoading();
        loadCountries().then(function () { nextCapRound(c); });
    }

    /** @param {HTMLElement} c */
    function nextCapRound(c) {
        if (capState.round >= capState.total) { showCapResult(c); return; }
        capState.round++;
        var list = getList(), correct = list[Math.floor(Math.random() * list.length)];
        var opts = shuffleArray([correct].concat(pickOthers(list, correct, 3)));
        var h = '<h2 class="game-title">' + escapeHtml("\uC218\uB3C4 \uD034\uC988") + '</h2>';
        h += '<p style="text-align:center;color:var(--neon-cyan);">Capital City Quiz</p>';
        h += '<div style="text-align:center;margin:6px 0;color:rgba(255,255,255,0.5);">' + capState.round + ' / ' + capState.total + '</div>';
        h += '<div style="text-align:center;margin:15px 0;">' + renderFlag(correct.code, correct.nameEn) + '</div>';
        h += '<div style="background:var(--glass);border:1px solid rgba(157,78,221,0.3);border-radius:15px;padding:20px;max-width:400px;margin:0 auto 20px;text-align:center;">';
        h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:5px;">' + escapeHtml("\uC774 \uB098\uB77C\uC758 \uC218\uB3C4\uB294?") + '</div>';
        h += '<div style="font-size:1.5rem;font-weight:700;color:var(--neon-pink);">' + escapeHtml(correct.nameKo) + '</div>';
        h += '<div style="font-size:0.85rem;color:rgba(255,255,255,0.5);">' + escapeHtml(correct.nameEn) + '</div></div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:500px;margin:0 auto;">';
        for (var i = 0; i < opts.length; i++) {
            h += '<button class="game-btn secondary" data-action="capA" data-param="' + escapeHtml(opts[i].code) + '" style="padding:14px;font-size:1rem;">';
            h += escapeHtml(opts[i].capitalKo) + '<br><small style="color:rgba(255,255,255,0.4);">' + escapeHtml(opts[i].capital) + '</small></button>';
        }
        h += '</div><div style="text-align:center;margin-top:12px;color:var(--gold);">' + escapeHtml("\uC810\uC218: " + capState.score) + '</div>';
        c.innerHTML = h;
        bindActions(c, {capA: function (sel) {
            var ok = (sel === correct.code); if (ok) capState.score += 10; doFeedback(ok);
            var color = ok ? "var(--neon-cyan)" : "var(--neon-pink)";
            var r = '<h2 class="game-title">' + escapeHtml("\uC218\uB3C4 \uD034\uC988") + '</h2><div style="text-align:center;margin:20px 0;">';
            r += '<div style="font-size:1.8rem;font-weight:900;color:' + color + ';">' + (ok ? escapeHtml("\uC815\uB2F5!") : escapeHtml("\uC624\uB2F5!")) + '</div>';
            r += '<div style="margin-top:12px;font-size:1.2rem;color:var(--neon-pink);">' + escapeHtml(correct.nameKo) + '</div>';
            r += '<div style="font-size:1.4rem;color:var(--neon-cyan);margin-top:8px;">' + escapeHtml("\uC218\uB3C4: " + correct.capitalKo) + '</div>';
            r += '<div style="font-size:0.85rem;color:rgba(255,255,255,0.5);">' + escapeHtml(correct.capital) + '</div></div>';
            r += '<div style="text-align:center;"><button class="game-btn" data-action="next">' + escapeHtml("\uB2E4\uC74C") + '</button></div>';
            c.innerHTML = r;
            bindActions(c, {next: function () { nextCapRound(c); }});
        }});
    }

    /** @param {HTMLElement} c */
    function showCapResult(c) {
        if (typeof createConfetti === "function") createConfetti(40);
        var pct = Math.round((capState.score / (capState.total * 10)) * 100);
        var h = '<h2 class="game-title">' + escapeHtml("\uC218\uB3C4 \uD034\uC988 \uACB0\uACFC") + '</h2>';
        h += '<div style="text-align:center;"><div style="font-size:3rem;color:var(--gold);margin:20px 0;">' + escapeHtml(capState.score + "\uC810") + '</div>';
        h += '<div style="color:var(--neon-cyan);margin-bottom:20px;">' + escapeHtml(pct + "% \uC815\uB2F5\uB960") + '</div>';
        h += '<button class="game-btn" data-action="re">' + escapeHtml("\uB2E4\uC2DC \uD558\uAE30") + '</button></div>';
        c.innerHTML = h;
        bindActions(c, {re: function () { showCapitalQuiz(c); }});
    }

    // ===== MODE 3: Country Fact Game =====

    /** @param {HTMLElement} [c] */
    function showCountryFactGame(c) {
        c = c || document.getElementById("gameArea");
        factState = {score:0,round:0,total:10}; c.innerHTML = renderLoading();
        loadCountries().then(function () { nextFactRound(c); });
    }

    /** @param {HTMLElement} c */
    function nextFactRound(c) {
        if (factState.round >= factState.total) { showFactResult(c); return; }
        factState.round++;
        var list = getList(), correct = list[Math.floor(Math.random() * list.length)];
        var opts = shuffleArray([correct].concat(pickOthers(list, correct, 3)));
        var fact = buildFact(correct);
        var labels = {population:"\uC778\uAD6C Population",language:"\uC5B8\uC5B4 Language",currency:"\uD1B5\uD654 Currency",capital:"\uC218\uB3C4 Capital"};
        var h = '<h2 class="game-title">' + escapeHtml("\uB098\uB77C \uC0C1\uC2DD \uD034\uC988") + '</h2>';
        h += '<p style="text-align:center;color:var(--neon-cyan);">Country Fact Game</p>';
        h += '<div style="text-align:center;margin:6px 0;color:rgba(255,255,255,0.5);">' + factState.round + ' / ' + factState.total + '</div>';
        h += '<div style="background:linear-gradient(135deg,rgba(157,78,221,0.2),rgba(0,212,255,0.1));border:2px solid rgba(157,78,221,0.4);border-radius:15px;padding:25px;max-width:500px;margin:15px auto 20px;text-align:center;">';
        h += '<div style="font-size:0.75rem;color:var(--neon-cyan);margin-bottom:8px;">' + escapeHtml(labels[fact.type] || fact.type) + '</div>';
        h += '<div style="font-size:1.2rem;font-weight:700;color:white;line-height:1.6;">' + escapeHtml(fact.text) + '</div></div>';
        h += '<div style="text-align:center;margin-bottom:15px;font-size:1rem;color:rgba(255,255,255,0.6);">' + escapeHtml("\uC5B4\uB290 \uB098\uB77C\uC77C\uAE4C\uC694?") + '</div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:500px;margin:0 auto;">';
        for (var i = 0; i < opts.length; i++) {
            h += '<button class="game-btn secondary" data-action="fA" data-param="' + escapeHtml(opts[i].code) + '" style="padding:14px;">';
            h += '<img src="' + escapeHtml(flagUrl(opts[i].code)) + '" alt="' + escapeHtml(opts[i].nameEn) + '" style="width:40px;height:27px;object-fit:cover;border-radius:3px;vertical-align:middle;margin-right:8px;" loading="lazy" />';
            h += escapeHtml(opts[i].nameKo) + '</button>';
        }
        h += '</div><div style="text-align:center;margin-top:12px;color:var(--gold);">' + escapeHtml("\uC810\uC218: " + factState.score) + '</div>';
        c.innerHTML = h;
        bindActions(c, {fA: function (sel) {
            var ok = (sel === correct.code); if (ok) factState.score += 10; doFeedback(ok);
            var color = ok ? "var(--neon-cyan)" : "var(--neon-pink)";
            var r = '<h2 class="game-title">' + escapeHtml("\uB098\uB77C \uC0C1\uC2DD \uD034\uC988") + '</h2><div style="text-align:center;margin:20px 0;">';
            r += '<div style="font-size:1.8rem;font-weight:900;color:' + color + ';">' + (ok ? escapeHtml("\uC815\uB2F5!") : escapeHtml("\uC624\uB2F5!")) + '</div>';
            r += '<div style="margin:15px 0;">' + renderFlag(correct.code, correct.nameEn) + '</div>';
            r += '<div style="font-size:1.3rem;color:var(--neon-pink);">' + escapeHtml(correct.nameKo) + '</div>';
            r += '<div style="font-size:0.9rem;color:rgba(255,255,255,0.5);margin-top:5px;">' + escapeHtml(correct.nameEn) + '</div>';
            r += '<div style="margin-top:12px;padding:12px;background:var(--glass);border-radius:10px;max-width:400px;margin-left:auto;margin-right:auto;">';
            r += '<div style="font-size:0.9rem;color:rgba(255,255,255,0.7);">' + escapeHtml(fact.text) + '</div></div></div>';
            r += '<div style="text-align:center;margin-top:15px;"><button class="game-btn" data-action="next">' + escapeHtml("\uB2E4\uC74C") + '</button></div>';
            c.innerHTML = r;
            bindActions(c, {next: function () { nextFactRound(c); }});
        }});
    }

    /**
     * Build a random fact about a country in Korean.
     * @param {Object} country @returns {{text:string,type:string}}
     */
    function buildFact(country) {
        var types = ["population","language","currency","capital"];
        var type = types[Math.floor(Math.random() * types.length)], text;
        if (type === "population") text = "\uC774 \uB098\uB77C\uC758 \uC778\uAD6C\uB294 \uC57D " + formatPop(country.population) + "\uC785\uB2C8\uB2E4.";
        else if (type === "language") text = "\uC774 \uB098\uB77C\uC758 \uACF5\uC6A9\uC5B4\uB294 " + country.languageKo + "(" + country.language + ")\uC785\uB2C8\uB2E4.";
        else if (type === "currency") text = "\uC774 \uB098\uB77C\uC758 \uD1B5\uD654\uB294 " + country.currencyKo + "(" + country.currency + ")\uC785\uB2C8\uB2E4.";
        else text = "\uC774 \uB098\uB77C\uC758 \uC218\uB3C4\uB294 " + country.capitalKo + "(" + country.capital + ")\uC785\uB2C8\uB2E4.";
        return {text:text, type:type};
    }

    /** @param {HTMLElement} c */
    function showFactResult(c) {
        if (typeof createConfetti === "function") createConfetti(40);
        var pct = Math.round((factState.score / (factState.total * 10)) * 100);
        var h = '<h2 class="game-title">' + escapeHtml("\uB098\uB77C \uC0C1\uC2DD \uACB0\uACFC") + '</h2>';
        h += '<div style="text-align:center;"><div style="font-size:3rem;color:var(--gold);margin:20px 0;">' + escapeHtml(factState.score + "\uC810") + '</div>';
        h += '<div style="color:var(--neon-cyan);margin-bottom:20px;">' + escapeHtml(pct + "% \uC815\uB2F5\uB960") + '</div>';
        h += '<button class="game-btn" data-action="re">' + escapeHtml("\uB2E4\uC2DC \uD558\uAE30") + '</button></div>';
        c.innerHTML = h;
        bindActions(c, {re: function () { showCountryFactGame(c); }});
    }

    // ===== CSS Injection =====
    /** Injects module CSS for flag images. */
    (function () {
        var s = document.createElement("style");
        s.textContent = ".country-flag-hover{transition:transform 0.2s;}.country-flag-hover:hover{transform:scale(1.05);}";
        document.head.appendChild(s);
    })();

    // ===== Global Exposure =====
    window.showCountryNameQuiz = showCountryNameQuiz;
    window.showCapitalQuiz = showCapitalQuiz;
    window.showCountryFactGame = showCountryFactGame;
})();

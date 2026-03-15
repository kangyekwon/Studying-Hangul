/**
 * api-wikipedia-quiz.js
 * Wikipedia API Korean culture/history quiz for K-POP Korean Learning.
 * Endpoints: ko.wikipedia.org REST API (CSP pre-approved).
 */
(function () {
    "use strict";

    /** @type {string} Wikipedia REST API base URL */
    var WIKI_API = "https://ko.wikipedia.org/api/rest_v1";

    /** @type {number} Cache time-to-live in milliseconds (24 hours) */
    var CACHE_TTL = 86400000;

    /** @type {Object<string, string[]>} Wikipedia article topics by category */
    var wikiTopics = {
        history: [
            "세종대왕", "한글", "경복궁", "고구려",
            "조선", "삼국시대", "임진왜란", "독립운동"
        ],
        food: [
            "김치", "비빔밥", "불고기", "떡볶이",
            "삼겹살", "냉면", "된장찌개", "갈비"
        ],
        places: [
            "서울", "부산", "제주도", "경주",
            "인사동", "명동", "남산타워", "한강"
        ],
        culture: [
            "한복", "태권도", "사물놀이", "판소리",
            "한옥", "차례", "세배", "추석"
        ],
        people: [
            "BTS", "손흥민", "봉준호", "김연아",
            "이순신", "세종대왕", "안중근", "유관순"
        ]
    };

    /** @type {Object<string, string>} Category display labels */
    var categoryLabels = {
        history: "역사 History",
        food: "음식 Food",
        places: "장소 Places",
        culture: "문화 Culture",
        people: "인물 People"
    };

    /** @type {Object<string, {title:string, extract:string, link:string}>} Offline fallback data */
    var fallbackData = {
        "세종대왕": {title: "세종대왕", extract: "세종대왕은 조선의 제4대 국왕으로, 한글을 창제한 것으로 가장 유명하다. 재위 기간 동안 과학, 문화, 예술 분야에서 큰 업적을 남겼다.", link: "https://ko.wikipedia.org/wiki/%EC%84%B8%EC%A2%85%EB%8C%80%EC%99%95"},
        "한글": {title: "한글", extract: "한글은 한국어를 표기하기 위해 만들어진 문자로, 세종대왕이 1443년에 창제하였다. 과학적이고 체계적인 문자 체계로 평가받는다.", link: "https://ko.wikipedia.org/wiki/%ED%95%9C%EA%B8%80"},
        "경복궁": {title: "경복궁", extract: "경복궁은 조선 왕조의 법궁으로 서울특별시 종로구에 위치해 있다. 1395년에 창건되었으며 조선의 대표적인 궁궐이다.", link: "https://ko.wikipedia.org/wiki/%EA%B2%BD%EB%B3%B5%EA%B6%81"},
        "김치": {title: "김치", extract: "김치는 배추, 무 등의 채소를 소금에 절여 고춧가루, 마늘 등의 양념으로 버무린 한국의 전통 발효 음식이다.", link: "https://ko.wikipedia.org/wiki/%EA%B9%80%EC%B9%98"},
        "비빔밥": {title: "비빔밥", extract: "비빔밥은 밥 위에 여러 가지 나물과 고추장을 넣어 비벼 먹는 한국 요리이다. 전주비빔밥이 특히 유명하다.", link: "https://ko.wikipedia.org/wiki/%EB%B9%84%EB%B9%94%EB%B0%A5"},
        "불고기": {title: "불고기", extract: "불고기는 간장 양념에 재운 쇠고기를 구워 먹는 한국의 전통 요리이다. 달콤한 맛으로 외국인에게도 인기가 많다.", link: "https://ko.wikipedia.org/wiki/%EB%B6%88%EA%B3%A0%EA%B8%B0"},
        "서울": {title: "서울특별시", extract: "서울특별시는 대한민국의 수도이자 최대 도시이다. 한강을 중심으로 발전한 도시로 인구가 약 1000만 명이다.", link: "https://ko.wikipedia.org/wiki/%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C"},
        "부산": {title: "부산광역시", extract: "부산광역시는 대한민국 제2의 도시로 한반도 남동쪽 끝에 위치해 있다. 해운대 해수욕장과 자갈치 시장으로 유명하다.", link: "https://ko.wikipedia.org/wiki/%EB%B6%80%EC%82%B0%EA%B4%91%EC%97%AD%EC%8B%9C"},
        "제주도": {title: "제주도", extract: "제주도는 대한민국 최대의 섬으로, 아름다운 자연경관과 독특한 문화로 유명하다. 유네스코 세계자연유산에 등재되어 있다.", link: "https://ko.wikipedia.org/wiki/%EC%A0%9C%EC%A3%BC%EB%8F%84"},
        "태권도": {title: "태권도", extract: "태권도는 한국의 전통 무예로, 손과 발을 사용한 공격과 방어 기술 체계이다. 2000년부터 올림픽 정식 종목이다.", link: "https://ko.wikipedia.org/wiki/%ED%83%9C%EA%B6%8C%EB%8F%84"},
        "한복": {title: "한복", extract: "한복은 한국의 전통 의복으로 고유한 아름다움과 우아한 선이 특징이다. 명절이나 특별한 날에 입는다.", link: "https://ko.wikipedia.org/wiki/%ED%95%9C%EB%B3%B5"},
        "BTS": {title: "BTS", extract: "BTS(방탄소년단)는 대한민국의 보이 그룹으로, 전 세계적으로 큰 인기를 얻고 있다. 한국 음악의 세계화에 기여하였다.", link: "https://ko.wikipedia.org/wiki/BTS"},
        "이순신": {title: "이순신", extract: "이순신은 조선 시대의 장군으로, 임진왜란에서 거북선을 이용해 왜군을 물리쳤다. 한국의 가장 존경받는 위인 중 한 명이다.", link: "https://ko.wikipedia.org/wiki/%EC%9D%B4%EC%88%9C%EC%8B%A0"},
        "추석": {title: "추석", extract: "추석은 한국의 대표적인 명절로 음력 8월 15일에 가족이 모여 조상에게 감사하는 날이다. 송편을 만들어 먹는 풍습이 있다.", link: "https://ko.wikipedia.org/wiki/%EC%B6%94%EC%84%9D"},
        "손흥민": {title: "손흥민", extract: "손흥민은 대한민국의 축구 선수로 영국 프리미어리그 토트넘 홋스퍼에서 활약하고 있다. 아시아 선수 최초로 프리미어리그 득점왕에 올랐다.", link: "https://ko.wikipedia.org/wiki/%EC%86%90%ED%9D%A5%EB%AF%BC"},
        "봉준호": {title: "봉준호", extract: "봉준호는 대한민국의 영화 감독으로 영화 기생충으로 아카데미상 작품상을 수상하였다. 한국 영화의 위상을 크게 높였다.", link: "https://ko.wikipedia.org/wiki/%EB%B4%89%EC%A4%80%ED%98%B8"}
    };

    /** @type {{score: number, total: number, category: string|null}} */
    var quizState = {score: 0, total: 0, category: null};

    // ===== Cache Utilities =====

    /**
     * Read cached article data from localStorage.
     * @param {string} key - Article title used as cache key
     * @returns {Object|null} Cached data or null if expired
     */
    function getCached(key) {
        try {
            var raw = localStorage.getItem("wiki_" + key);
            if (!raw) return null;
            var obj = JSON.parse(raw);
            if (Date.now() - obj.ts > CACHE_TTL) return null;
            return obj.data;
        } catch (e) {
            return null;
        }
    }

    /**
     * Write article data to localStorage with timestamp.
     * @param {string} key - Article title used as cache key
     * @param {Object} data - Article data to cache
     */
    function setCache(key, data) {
        try {
            var entry = JSON.stringify({ts: Date.now(), data: data});
            localStorage.setItem("wiki_" + key, entry);
        } catch (e) {
            // Storage full or unavailable
        }
    }

    // ===== Fetch Helpers =====

    /**
     * Parse Wikipedia REST API JSON into standard format.
     * @param {Object} json - Raw API response object
     * @param {string} title - Fallback title if missing in response
     * @returns {{title: string, extract: string, link: string}}
     */
    function parseWikiResponse(json, title) {
        var link = "https://ko.wikipedia.org/wiki/" + encodeURIComponent(title);
        if (json.content_urls && json.content_urls.desktop) {
            link = json.content_urls.desktop.page;
        }
        return {title: json.title || title, extract: json.extract || "", link: link};
    }

    /**
     * Fetch article summary from Wikipedia with cache and fallback.
     * @param {string} title - Korean article title to fetch
     * @returns {Promise<{title: string, extract: string, link: string}>}
     */
    async function fetchWikiSummary(title) {
        var cached = getCached(title);
        if (cached) return cached;
        try {
            var url = WIKI_API + "/page/summary/" + encodeURIComponent(title);
            var res = await fetch(url);
            if (!res.ok) throw new Error("HTTP " + res.status);
            var data = parseWikiResponse(await res.json(), title);
            setCache(title, data);
            return data;
        } catch (e) {
            return fallbackData[title] || {title: title, extract: title + " - offline.", link: "#"};
        }
    }

    /**
     * Fetch a random Korean Wikipedia article summary.
     * @returns {Promise<{title: string, extract: string, link: string}>}
     */
    async function fetchRandomWiki() {
        try {
            var res = await fetch(WIKI_API + "/page/random/summary");
            if (!res.ok) throw new Error("HTTP " + res.status);
            return parseWikiResponse(await res.json(), "");
        } catch (e) {
            var topics = getAllTopics();
            return fetchWikiSummary(topics[Math.floor(Math.random() * topics.length)]);
        }
    }

    // ===== Utility Helpers =====

    /**
     * Get all topic names from every category as flat array.
     * @returns {string[]} Combined array of all topics
     */
    function getAllTopics() {
        var all = [];
        for (var cat in wikiTopics) {
            if (wikiTopics.hasOwnProperty(cat)) all = all.concat(wikiTopics[cat]);
        }
        return all;
    }

    /**
     * Shuffle array in place using Fisher-Yates algorithm.
     * @param {Array} arr - Array to shuffle
     * @returns {Array} The same array, now shuffled
     */
    function shuffleArray(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        }
        return arr;
    }

    /**
     * Pick three wrong answers from the same category.
     * @param {string} correct - Correct answer to exclude
     * @param {string} category - Category key for context
     * @returns {string[]} Three wrong answer options
     */
    function pickWrongAnswers(correct, category) {
        var pool = (wikiTopics[category] || getAllTopics()).filter(function (t) {
            return t !== correct;
        });
        return shuffleArray(pool).slice(0, 3);
    }

    /**
     * Generate loading spinner HTML string.
     * @returns {string} Loading spinner markup
     */
    function renderLoading() {
        return '<div style="text-align:center;padding:40px;">' +
            '<div class="game-loading-spinner"></div>' +
            '<p style="color:rgba(255,255,255,0.5);margin-top:12px;">Wikipedia loading...</p></div>';
    }

    /**
     * Extract unique Korean words (2+ chars) from text.
     * @param {string} text - Source text to scan
     * @returns {string[]} Up to 8 unique Korean words
     */
    function extractKoreanWords(text) {
        var matches = text.match(/[\uAC00-\uD7AF]{2,}/g) || [];
        var seen = {}, unique = [];
        for (var i = 0; i < matches.length && unique.length < 8; i++) {
            if (!seen[matches[i]]) { seen[matches[i]] = true; unique.push(matches[i]); }
        }
        return unique;
    }

    /**
     * Build HTML for Korean word badge chips.
     * @param {string[]} words - Words to render as badges
     * @param {string} color - Theme color: "pink" or "cyan"
     * @returns {string} HTML string of clickable badges
     */
    function renderWordBadges(words, color) {
        if (!words.length) return "";
        var bg = color === "pink" ? "rgba(255,45,149,0.2)" : "rgba(0,212,255,0.15)";
        var bd = color === "pink" ? "rgba(255,45,149,0.3)" : "rgba(0,212,255,0.3)";
        var h = '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">';
        for (var i = 0; i < words.length; i++) {
            h += '<span style="padding:4px 12px;border-radius:20px;background:' + bg;
            h += ';border:1px solid ' + bd + ';font-size:0.9rem;cursor:pointer;" ';
            h += 'data-action="speak" data-param="' + escapeHtml(words[i]) + '">';
            h += escapeHtml(words[i]) + '</span>';
        }
        return h + '</div>';
    }

    /**
     * Build HTML for a Wikipedia article link.
     * @param {string} link - Full URL to the article
     * @returns {string} Anchor tag HTML or empty string
     */
    function renderWikiLink(link) {
        if (!link || link === "#") return "";
        return '<a href="' + escapeHtml(link) + '" target="_blank" rel="noopener" ' +
            'style="color:var(--neon-cyan);text-decoration:underline;">Read more on Wikipedia</a>';
    }

    /**
     * Render the quiz score indicator bar.
     * @returns {string} Score bar HTML
     */
    function renderScoreBar() {
        return '<div style="text-align:center;margin-bottom:15px;color:rgba(255,255,255,0.7);">' +
            'Score: <span style="color:var(--neon-cyan);font-weight:700;">' +
            quizState.score + '</span> / ' + quizState.total + '</div>';
    }

    /**
     * Attach delegated click handlers via data-action attributes.
     * @param {HTMLElement} el - Container element for delegation
     * @param {Object<string, function>} map - Action name to handler
     */
    function bindActions(el, map) {
        el.addEventListener("click", function (e) {
            var btn = e.target.closest("[data-action]");
            if (!btn) return;
            var fn = map[btn.getAttribute("data-action")];
            if (fn) fn(btn.getAttribute("data-param") || "", btn);
        });
    }

    /**
     * Load a random topic and pass result to a renderer.
     * @param {HTMLElement} c - Container element
     * @param {function} renderer - Render function to call with data
     */
    function loadRandomTopic(c, renderer) {
        var all = getAllTopics();
        c.innerHTML = renderLoading();
        fetchWikiSummary(all[Math.floor(Math.random() * all.length)]).then(function (d) {
            renderer(c, d);
        });
    }

    // ===== MODE 1: Wiki Culture Quiz =====

    /**
     * Display the Wikipedia culture quiz with category selection.
     * @param {HTMLElement} c - Game area container element
     */
    function showWikiCultureQuiz(c) {
        quizState.score = 0;
        quizState.total = 0;
        quizState.category = null;
        renderCategorySelect(c);
    }

    /**
     * Render category selection grid.
     * @param {HTMLElement} c - Container element
     */
    function renderCategorySelect(c) {
        var h = '<h2 class="game-title">Wiki Culture Quiz</h2>';
        h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:20px;">';
        h += 'Choose a category to test your Korean culture knowledge!</p>';
        h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;max-width:500px;margin:0 auto;">';
        for (var cat in categoryLabels) {
            if (!categoryLabels.hasOwnProperty(cat)) continue;
            h += '<button class="game-btn" data-action="pickCat" data-param="' + cat + '"';
            h += ' style="padding:18px 10px;font-size:1rem;">' + escapeHtml(categoryLabels[cat]) + '</button>';
        }
        h += '</div>';
        c.innerHTML = h;
        bindActions(c, {pickCat: function (cat) { startQuiz(c, cat); }});
    }

    /**
     * Start a quiz round for the selected category.
     * @param {HTMLElement} c - Container element
     * @param {string} cat - Selected category key
     */
    async function startQuiz(c, cat) {
        quizState.category = cat;
        quizState.score = 0;
        quizState.total = 0;
        c.innerHTML = renderLoading();
        await loadQuestion(c);
    }

    /**
     * Pick a random topic and render the next question.
     * @param {HTMLElement} c - Container element
     */
    async function loadQuestion(c) {
        var topics = wikiTopics[quizState.category] || getAllTopics();
        var pick = topics[Math.floor(Math.random() * topics.length)];
        var data = await fetchWikiSummary(pick);
        renderQuestion(c, data, pick);
    }

    /**
     * Build and display a fill-in-the-blank quiz question.
     * @param {HTMLElement} c - Container element
     * @param {Object} data - Wikipedia article data
     * @param {string} answer - Correct answer (topic name)
     */
    function renderQuestion(c, data, answer) {
        var escaped = answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        var blanked = (data.extract || "").replace(new RegExp(escaped, "g"), "_____");
        var options = shuffleArray([answer].concat(pickWrongAnswers(answer, quizState.category)));
        var h = '<h2 class="game-title">Wiki Culture Quiz</h2>' + renderScoreBar();
        h += '<div style="background:var(--glass);border:1px solid rgba(157,78,221,0.3);border-radius:15px;padding:20px;margin:0 auto 20px;max-width:600px;">';
        h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.5);margin-bottom:8px;">' + escapeHtml(categoryLabels[quizState.category] || "") + '</div>';
        h += '<div style="font-size:1.05rem;line-height:1.7;">' + escapeHtml(blanked) + '</div></div>';
        h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:500px;margin:0 auto;">';
        for (var i = 0; i < options.length; i++) {
            h += '<button class="game-btn secondary" data-action="answer" data-param="' + escapeHtml(options[i]) + '"';
            h += ' style="padding:14px;font-size:1rem;">' + escapeHtml(options[i]) + '</button>';
        }
        h += '</div>';
        c.innerHTML = h;
        bindActions(c, {answer: function (sel) { checkAnswer(c, sel, answer, data); }});
    }

    /**
     * Check selected answer, update score, and show result.
     * @param {HTMLElement} c - Container element
     * @param {string} sel - User-selected answer
     * @param {string} correct - Correct answer
     * @param {Object} data - Wikipedia article data
     */
    function checkAnswer(c, sel, correct, data) {
        quizState.total++;
        var ok = (sel === correct);
        if (ok) {
            quizState.score++;
            if (typeof addXP === "function") addXP(15);
            if (typeof ProSound !== "undefined" && ProSound.initialized) ProSound.correct();
        } else {
            if (typeof ProSound !== "undefined" && ProSound.initialized) ProSound.wrong();
        }
        renderResult(c, ok, correct, data);
    }

    /**
     * Render answer result with wiki article summary.
     * @param {HTMLElement} c - Container element
     * @param {boolean} ok - Whether the answer was correct
     * @param {string} answer - Correct answer text
     * @param {Object} data - Wikipedia article data
     */
    function renderResult(c, ok, answer, data) {
        var color = ok ? "var(--neon-cyan)" : "var(--neon-pink)";
        var h = '<h2 class="game-title">Wiki Culture Quiz</h2>' + renderScoreBar();
        h += '<div style="text-align:center;margin-bottom:15px;">';
        h += '<div style="font-size:1.8rem;font-weight:900;color:' + color + ';">' + (ok ? "Correct!" : "Wrong!") + '</div>';
        h += '<div style="font-size:1.2rem;margin-top:8px;">' + escapeHtml(answer) + '</div></div>';
        h += '<div style="background:var(--glass);border:1px solid rgba(157,78,221,0.3);border-radius:15px;padding:20px;margin:0 auto 20px;max-width:600px;">';
        h += '<div style="font-size:0.95rem;line-height:1.7;">' + escapeHtml(data.extract) + '</div>';
        h += '<div style="margin-top:12px;">' + renderWikiLink(data.link) + '</div></div>';
        h += '<div style="display:flex;gap:10px;justify-content:center;">';
        h += '<button class="game-btn" data-action="next">Next Question</button>';
        h += '<button class="game-btn secondary" data-action="cats">Categories</button></div>';
        c.innerHTML = h;
        bindActions(c, {
            next: function () { c.innerHTML = renderLoading(); loadQuestion(c); },
            cats: function () { renderCategorySelect(c); }
        });
    }

    // ===== MODE 2: Daily Korea Fact =====

    /**
     * Display today's Korean knowledge card from Wikipedia.
     * @param {HTMLElement} c - Game area container element
     */
    async function showDailyKoreaFact(c) {
        c.innerHTML = renderLoading();
        var topics = getAllTopics();
        var d = new Date();
        var idx = (d.getFullYear() * 366 + d.getMonth() * 31 + d.getDate()) % topics.length;
        var data = await fetchWikiSummary(topics[idx]);
        renderFact(c, data);
    }

    /**
     * Render the daily fact card with key Korean words.
     * @param {HTMLElement} c - Container element
     * @param {Object} data - Wikipedia article data
     */
    function renderFact(c, data) {
        var words = extractKoreanWords(data.extract);
        var today = new Date().toLocaleDateString("ko-KR", {year: "numeric", month: "long", day: "numeric"});
        var h = '<h2 class="game-title">Today\'s Korean Knowledge</h2>';
        h += '<div style="background:linear-gradient(135deg,rgba(157,78,221,0.2),rgba(0,212,255,0.1));border:2px solid rgba(157,78,221,0.4);border-radius:20px;padding:30px;max-width:600px;margin:0 auto 20px;text-align:center;">';
        h += '<div style="font-size:2rem;font-weight:900;margin-bottom:8px;color:var(--neon-pink);">' + escapeHtml(data.title) + '</div>';
        h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:15px;">' + escapeHtml(today) + '</div>';
        h += '<div style="font-size:1.05rem;line-height:1.8;color:rgba(255,255,255,0.9);margin-bottom:20px;text-align:left;">' + escapeHtml(data.extract) + '</div>';
        if (words.length) {
            h += '<div style="margin-bottom:15px;"><div style="font-size:0.8rem;color:rgba(255,255,255,0.5);margin-bottom:8px;">KEY WORDS</div>';
            h += renderWordBadges(words, "pink") + '</div>';
        }
        h += renderWikiLink(data.link) + '</div>';
        h += '<div style="text-align:center;"><button class="game-btn" data-action="another">Load Another Topic</button></div>';
        c.innerHTML = h;
        bindActions(c, {
            another: function () { loadRandomTopic(c, renderFact); },
            speak: function (w) { if (typeof speakKorean === "function") speakKorean(w); }
        });
    }

    // ===== MODE 3: Wiki Explorer =====

    /**
     * Display the Wikipedia random article explorer.
     * @param {HTMLElement} c - Game area container element
     */
    async function showWikiExplorer(c) {
        c.innerHTML = renderLoading();
        var data = await fetchRandomWiki();
        renderExplorer(c, data);
    }

    /**
     * Render explorer view with article and extracted words.
     * @param {HTMLElement} c - Container element
     * @param {Object} data - Wikipedia article data
     */
    function renderExplorer(c, data) {
        var words = extractKoreanWords(data.extract);
        var h = '<h2 class="game-title">Wiki Explorer</h2>';
        h += '<p style="text-align:center;color:rgba(255,255,255,0.5);margin-bottom:15px;">Discover random Korean Wikipedia articles!</p>';
        h += '<div style="background:var(--glass);border:2px solid rgba(0,212,255,0.3);border-radius:20px;padding:25px;max-width:600px;margin:0 auto 20px;">';
        h += '<div style="font-size:1.5rem;font-weight:900;margin-bottom:12px;color:var(--neon-cyan);">' + escapeHtml(data.title) + '</div>';
        h += '<div style="font-size:1rem;line-height:1.8;color:rgba(255,255,255,0.85);margin-bottom:20px;">' + escapeHtml(data.extract) + '</div>';
        if (words.length) {
            h += '<div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:15px;">';
            h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.5);margin-bottom:8px;">KOREAN WORDS</div>';
            h += renderWordBadges(words, "cyan") + '</div>';
        }
        h += '<div style="margin-top:15px;">' + renderWikiLink(data.link) + '</div></div>';
        h += '<div style="display:flex;gap:10px;justify-content:center;">';
        h += '<button class="game-btn" data-action="random">Random Article</button>';
        h += '<button class="game-btn secondary" data-action="topic">From Topics</button></div>';
        c.innerHTML = h;
        bindActions(c, {
            random: function () { showWikiExplorer(c); },
            topic: function () { loadRandomTopic(c, renderExplorer); },
            speak: function (w) { if (typeof speakKorean === "function") speakKorean(w); }
        });
    }

    // ===== Global Exposure =====

    window.showWikiCultureQuiz = showWikiCultureQuiz;
    window.showDailyKoreaFact = showDailyKoreaFact;
    window.showWikiExplorer = showWikiExplorer;
})();

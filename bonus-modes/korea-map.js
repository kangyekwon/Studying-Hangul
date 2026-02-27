/**
 * korea-map.js
 * Interactive Korea map explorer with explore and quiz modes
 *
 * @module KoreaMap
 * @requires game-data.js (defaultKoreanRegions)
 * @requires game-engine.js (global functions: shuffle, addXP, addCombo, etc.)
 */

/**
 * Map quiz game state
 * @private
 */
var mapQuizMode = false;
var mapQuizTarget = null;
var mapQuizScore = 0;
var mapQuizRound = 0;
var mapQuizTotal = 8;

/**
 * Gets region pool from global data or fallback
 * @private
 * @returns {Array<Object>} Array of region objects
 */
function getRegionPool() {
    return (typeof koreanRegions !== "undefined" && koreanRegions.length > 0)
        ? koreanRegions
        : defaultKoreanRegions;
}

/**
 * Calculates the center point of an SVG path
 * @private
 * @param {string} pathData - SVG path d attribute
 * @returns {Object} Center point { x, y }
 */
function getPathCenter(pathData) {
    var nums = pathData.match(/[\d.]+/g);
    var cx = 0, cy = 0, cnt = 0;
    if (nums) {
        for (var n = 0; n < nums.length - 1; n += 2) {
            cx += parseFloat(nums[n]);
            cy += parseFloat(nums[n + 1]);
            cnt++;
        }
        if (cnt > 0) { cx /= cnt; cy /= cnt; }
    }
    return { x: cx, y: cy };
}

/**
 * Builds the Korea map SVG with optional region highlight
 * @private
 * @param {string|null} highlightId - Region ID to highlight
 * @param {boolean} quizMode - Whether to hide labels
 * @returns {string} SVG markup
 */
function buildMapSvg(highlightId, quizMode) {
    var regions = getRegionPool();
    var svg = '<svg viewBox="80 20 280 370" width="320" height="380" style="display:block;margin:0 auto">';

    for (var i = 0; i < regions.length; i++) {
        var r = regions[i];
        var isHighlight = (highlightId === r.id);
        var fill = isHighlight ? "rgba(255,45,149,0.5)" : "rgba(157,78,221,0.2)";
        var stroke = isHighlight ? "var(--neon-pink)" : "rgba(255,255,255,0.3)";
        var sw = isHighlight ? "3" : "1.5";

        svg += '<path d="' + escapeHtml(r.path) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + sw + '" data-region="' + escapeHtml(r.id) + '" style="cursor:pointer;transition:fill 0.3s" />';

        if (!quizMode) {
            var center = getPathCenter(r.path);
            svg += '<text x="' + center.x + '" y="' + center.y + '" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="10" style="pointer-events:none">' + escapeHtml(r.korean) + '</text>';
        }
    }

    svg += '</svg>';
    return svg;
}

/**
 * Builds region info HTML for display
 * @private
 * @param {Object} region - Region object
 * @returns {string} Region info HTML
 */
function buildRegionInfo(region) {
    return '<div style="font-size:1.5rem;color:var(--neon-pink);margin-bottom:5px">' + escapeHtml(region.korean) + '</div>' +
        '<div style="color:var(--neon-cyan);margin-bottom:8px">' + escapeHtml(region.english) + '</div>' +
        '<div style="color:rgba(255,255,255,0.7);margin-bottom:5px"><strong>Famous:</strong> ' + escapeHtml(region.famous) + '</div>' +
        '<div style="color:rgba(255,255,255,0.7)"><strong>Local Food:</strong> ' + escapeHtml(region.food) + '</div>';
}

/**
 * Attaches click listeners to map region paths
 * @private
 * @param {HTMLElement} container - Container element
 */
function attachMapListeners(container) {
    var paths = container.querySelectorAll('path[data-region]');
    var regions = getRegionPool();

    for (var i = 0; i < paths.length; i++) {
        paths[i].onclick = function () {
            var rid = this.getAttribute('data-region');
            var region = null;
            for (var j = 0; j < regions.length; j++) {
                if (regions[j].id === rid) { region = regions[j]; break; }
            }
            if (!region) return;

            var mc = document.getElementById('mapContainer');
            if (mc) mc.innerHTML = buildMapSvg(rid, false);

            var infoDiv = document.getElementById('mapInfo');
            if (infoDiv) infoDiv.innerHTML = buildRegionInfo(region);

            attachMapListeners(container);
            SoundEngine.correct();
        };
    }
}

/**
 * Initializes and shows the Korea map explorer
 * @public
 * @param {HTMLElement} container - Container element
 * @example
 * showKoreaMap(document.getElementById('gameContainer'));
 */
function showKoreaMap(container) {
    mapQuizMode = false;
    mapQuizScore = 0;
    mapQuizRound = 0;
    gameState.gamesPlayed++;
    saveProgress();
    renderKoreaMap(container);
}

/**
 * Renders the main map view with explore/quiz toggle
 * @private
 * @param {HTMLElement} container - Container element
 */
function renderKoreaMap(container) {
    var h = '<h2 class="game-title">Korea Map Explorer</h2>';
    h += '<div style="display:flex;gap:10px;justify-content:center;margin-bottom:15px">';
    h += '<button class="game-btn' + (!mapQuizMode ? '' : ' secondary') + '" id="mapExploreBtn">Explore</button>';
    h += '<button class="game-btn' + (mapQuizMode ? '' : ' secondary') + '" id="mapQuizBtn">Quiz Mode</button>';
    h += '</div>';
    h += '<div id="mapContainer">' + buildMapSvg(null, false) + '</div>';
    h += '<div id="mapInfo" style="margin-top:15px;background:var(--glass);padding:15px;border-radius:12px;text-align:center;color:rgba(255,255,255,0.6)">Click a region to learn about it!</div>';
    h += '<div class="game-controls" style="margin-top:15px">';
    h += '<button class="game-btn secondary" id="mapBackBtn">Back</button></div>';
    container.innerHTML = h;

    attachMapListeners(container);

    document.getElementById('mapExploreBtn').onclick = function () {
        mapQuizMode = false;
        renderKoreaMap(container);
    };
    document.getElementById('mapQuizBtn').onclick = function () {
        mapQuizMode = true;
        mapQuizScore = 0;
        mapQuizRound = 0;
        startMapQuiz(container);
    };
    document.getElementById('mapBackBtn').onclick = function () {
        if (typeof showMode === "function") showMode(gameState.currentMode);
    };
}

/**
 * Starts or advances the map quiz
 * @private
 * @param {HTMLElement} container - Container element
 */
function startMapQuiz(container) {
    if (mapQuizRound >= mapQuizTotal) {
        renderMapQuizEnd(container);
        return;
    }

    var regions = getRegionPool();
    var available = shuffle(regions);
    mapQuizTarget = available[mapQuizRound % available.length];
    mapQuizRound++;

    var h = '<h2 class="game-title">Korea Map Quiz</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:5px">Round ' + mapQuizRound + ' / ' + mapQuizTotal + '</p>';
    h += '<p style="text-align:center;font-size:1.5rem;color:var(--neon-pink);margin-bottom:15px">Where is <strong>' + escapeHtml(mapQuizTarget.korean) + '</strong>?</p>';
    h += '<div id="mapContainer">' + buildMapSvg(null, true) + '</div>';
    h += '<div id="mapInfo" style="margin-top:10px;text-align:center;color:var(--gold)">Score: ' + mapQuizScore + '</div>';
    container.innerHTML = h;

    attachMapQuizHandlers(container);
}

/**
 * Attaches click handlers for map quiz answers
 * @private
 * @param {HTMLElement} container - Container element
 */
function attachMapQuizHandlers(container) {
    var paths = container.querySelectorAll('path[data-region]');
    for (var i = 0; i < paths.length; i++) {
        paths[i].onclick = function () {
            var rid = this.getAttribute('data-region');
            var correct = (rid === mapQuizTarget.id);

            if (correct) {
                mapQuizScore += 100;
                gameState.correctAnswers++;
                SoundEngine.correct();
                addCombo();
                addXP(15);
                this.setAttribute('fill', 'rgba(0,245,212,0.5)');
            } else {
                SoundEngine.wrong();
                resetCombo();
                screenShake();
                this.setAttribute('fill', 'rgba(255,71,87,0.5)');
                var allP = container.querySelectorAll('path[data-region]');
                for (var j = 0; j < allP.length; j++) {
                    if (allP[j].getAttribute('data-region') === mapQuizTarget.id) {
                        allP[j].setAttribute('fill', 'rgba(0,245,212,0.5)');
                    }
                }
            }
            setTimeout(function () { startMapQuiz(container); }, 1500);
        };
    }
}

/**
 * Renders the map quiz completion screen
 * @private
 * @param {HTMLElement} container - Container element
 */
function renderMapQuizEnd(container) {
    var pct = Math.round((mapQuizScore / (mapQuizTotal * 100)) * 100);
    if (pct >= 80) createConfetti(80);
    addXP(mapQuizScore / 10);

    var h = '<h2 class="game-title">Map Quiz Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#127758;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + mapQuizScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + pct + '% correct</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="mapQuizAgainBtn">Quiz Again</button>';
    h += '<button class="game-btn secondary" id="mapExplore2Btn">Explore Map</button>';
    h += '<button class="game-btn secondary" id="mapBack2Btn">Back</button>';
    h += '</div></div>';
    container.innerHTML = h;

    document.getElementById('mapQuizAgainBtn').onclick = function () {
        mapQuizMode = true;
        mapQuizScore = 0;
        mapQuizRound = 0;
        startMapQuiz(container);
    };
    document.getElementById('mapExplore2Btn').onclick = function () {
        mapQuizMode = false;
        renderKoreaMap(container);
    };
    document.getElementById('mapBack2Btn').onclick = function () {
        if (typeof showMode === "function") showMode(gameState.currentMode);
    };
}

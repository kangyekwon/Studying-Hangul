/**
 * number-converter.js
 * Korean number system converter game with native and sino-Korean numbers
 *
 * @module NumberConverter
 * @requires game-data.js (defaultKoreanNumberSystems)
 * @requires game-engine.js (global functions: shuffle, addXP, addCombo, etc.)
 */

/**
 * Number converter game state
 * @private
 */
var numSystem = "native";
var numTarget = 0;
var numAnswer = "";
var numScore = 0;
var numRound = 0;
var numTotal = 10;

/**
 * Initializes and starts the number converter game
 * @public
 * @param {HTMLElement} container - Container element
 * @example
 * showNumberConverter(document.getElementById('gameContainer'));
 */
function showNumberConverter(container) {
    numSystem = "native";
    numScore = 0;
    numRound = 0;
    gameState.gamesPlayed++;
    saveProgress();
    nextNumberRound(container);
}

/**
 * Gets number data from global data or fallback
 * @private
 * @returns {Object} Korean number systems data
 */
function getNumberData() {
    return (typeof koreanNumberSystems !== "undefined" && koreanNumberSystems.native)
        ? koreanNumberSystems
        : defaultKoreanNumberSystems;
}

/**
 * Converts a number to native Korean (hana, dul, set...)
 * @public
 * @param {number} n - Number to convert (1-99)
 * @returns {string} Korean native number string
 */
function nativeNumberToKorean(n) {
    var data = getNumberData();
    var natives = data.native;
    if (n <= 0 || n > 99) return "";
    var tens = Math.floor(n / 10) * 10;
    var ones = n % 10;
    var result = "";
    if (tens > 0) {
        result = lookupKoreanNumber(natives, tens);
    }
    if (ones > 0) {
        result += lookupKoreanNumber(natives, ones);
    }
    return result;
}

/**
 * Looks up a Korean number string from a number array
 * @private
 * @param {Array<Object>} arr - Number data array
 * @param {number} target - Number to find
 * @returns {string} Korean number string
 */
function lookupKoreanNumber(arr, target) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].number === target) return arr[i].korean;
    }
    return "";
}

/**
 * Builds a lookup map from sino-Korean number array
 * @private
 * @param {Array<Object>} sinos - Sino-Korean number data
 * @returns {Object} Map of number to Korean string
 */
function buildSinoLookup(sinos) {
    var lookup = {};
    for (var i = 0; i < sinos.length; i++) {
        lookup[sinos[i].number] = sinos[i].korean;
    }
    return lookup;
}

/**
 * Converts a number to sino-Korean (il, i, sam...)
 * @public
 * @param {number} n - Number to convert (1-999)
 * @returns {string} Korean sino number string
 */
function sinoNumberToKorean(n) {
    var data = getNumberData();
    var lookup = buildSinoLookup(data.sino);
    if (n <= 0 || n > 999) return "";
    var hundreds = Math.floor(n / 100);
    var tens = Math.floor((n % 100) / 10);
    var ones = n % 10;
    var result = "";
    if (hundreds > 0) {
        if (hundreds > 1) result += lookup[hundreds] || "";
        result += lookup[100] || "";
    }
    if (tens > 0) {
        if (tens > 1) result += lookup[tens] || "";
        result += lookup[10] || "";
    }
    if (ones > 0) {
        result += lookup[ones] || "";
    }
    return result;
}

/**
 * Advances to the next number round or ends the game
 * @private
 * @param {HTMLElement} container - Container element
 */
function nextNumberRound(container) {
    if (numRound >= numTotal) {
        renderNumberEnd(container);
        return;
    }
    if (numSystem === "native") {
        numTarget = Math.floor(Math.random() * 99) + 1;
        numAnswer = nativeNumberToKorean(numTarget);
    } else {
        numTarget = Math.floor(Math.random() * 999) + 1;
        numAnswer = sinoNumberToKorean(numTarget);
    }
    numRound++;
    renderNumberQuestion(container);
}

/**
 * Builds the system toggle buttons HTML
 * @private
 * @returns {string} HTML markup for system toggle
 */
function buildSystemToggle() {
    var h = '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:15px">';
    h += '<button class="game-btn' + (numSystem === "native" ? '' : ' secondary') + '" id="numNativeBtn" style="padding:8px 16px;font-size:0.85rem">Native</button>';
    h += '<button class="game-btn' + (numSystem === "sino" ? '' : ' secondary') + '" id="numSinoBtn" style="padding:8px 16px;font-size:0.85rem">Sino-Korean</button>';
    h += '</div>';
    return h;
}

/**
 * Builds the number display and input HTML
 * @private
 * @returns {string} HTML markup for number display
 */
function buildNumberDisplay() {
    var systemLabel = numSystem === "native"
        ? "Native Korean (hana, dul, set...)"
        : "Sino-Korean (il, i, sam...)";
    var h = '<p style="text-align:center;color:var(--neon-cyan);font-size:0.85rem;margin-bottom:15px">' + escapeHtml(systemLabel) + '</p>';
    h += '<div style="font-size:5rem;text-align:center;color:var(--neon-pink);margin:15px 0;font-weight:bold">' + numTarget + '</div>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:15px">Type this number in Korean:</p>';
    h += '<input type="text" class="speed-input" id="numInput" placeholder="Type in Korean..." autocomplete="off" />';
    h += '<div style="display:flex;gap:10px;justify-content:center;margin-top:15px">';
    h += '<button class="game-btn" id="numCheckBtn">Check</button>';
    h += '<button class="game-btn secondary" id="numSkipBtn">Skip</button>';
    h += '</div>';
    h += '<div id="numFeedback" style="margin-top:15px;text-align:center"></div>';
    h += '<div style="text-align:center;margin-top:10px;color:var(--gold)">Score: ' + numScore + '</div>';
    return h;
}

/**
 * Renders the number converter question UI
 * @private
 * @param {HTMLElement} container - Container element
 */
function renderNumberQuestion(container) {
    var h = '<h2 class="game-title">Number Converter</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">';
    h += 'Round ' + numRound + ' / ' + numTotal + '</p>';
    h += '<div class="level-progress" style="margin-bottom:15px">';
    h += '<div class="level-bar" style="width:' + Math.round((numRound / numTotal) * 100) + '%"></div></div>';
    h += buildSystemToggle();
    h += buildNumberDisplay();
    container.innerHTML = h;

    attachNumberHandlers(container);
}

/**
 * Attaches event handlers to number converter controls
 * @private
 * @param {HTMLElement} container - Container element
 */
function attachNumberHandlers(container) {
    document.getElementById('numNativeBtn').onclick = function () {
        numSystem = "native";
        numRound--;
        nextNumberRound(container);
    };
    document.getElementById('numSinoBtn').onclick = function () {
        numSystem = "sino";
        numRound--;
        nextNumberRound(container);
    };
    document.getElementById('numCheckBtn').onclick = function () {
        checkNumberAnswer(container);
    };
    document.getElementById('numSkipBtn').onclick = function () {
        showNumberFeedback(container, false);
    };
    document.getElementById('numInput').onkeydown = function (e) {
        if (e.key === "Enter") checkNumberAnswer(container);
    };
    document.getElementById('numInput').focus();
}

/**
 * Checks the user's number answer
 * @private
 * @param {HTMLElement} container - Container element
 */
function checkNumberAnswer(container) {
    var input = document.getElementById('numInput');
    if (!input) return;
    var userVal = input.value.trim();
    if (!userVal) return;
    var isCorrect = (userVal === numAnswer);
    if (isCorrect) {
        numScore += 100;
        gameState.correctAnswers++;
        SoundEngine.correct();
        addCombo();
        addXP(15);
    } else {
        SoundEngine.wrong();
        resetCombo();
    }
    showNumberFeedback(container, isCorrect);
}

/**
 * Builds the feedback content HTML
 * @private
 * @param {boolean} isCorrect - Whether answer was correct
 * @returns {string} HTML markup for feedback
 */
function buildFeedbackContent(isCorrect) {
    var nativeStr = nativeNumberToKorean(numTarget <= 99 ? numTarget : 0);
    var sinoStr = sinoNumberToKorean(numTarget);
    var color = isCorrect ? "var(--neon-cyan)" : "var(--neon-pink)";
    var label = isCorrect ? "Correct!" : "Answer:";
    var h = '<div style="color:' + color + ';font-size:1.2rem;margin-bottom:8px">' + label + '</div>';
    h += '<div style="background:var(--glass);padding:12px;border-radius:12px;display:inline-block">';
    h += '<div style="color:var(--neon-cyan)"><strong>Answer:</strong> ' + escapeHtml(numAnswer) + '</div>';
    if (nativeStr) {
        h += '<div style="color:rgba(255,255,255,0.6);font-size:0.85rem;margin-top:4px">Native: ' + escapeHtml(nativeStr) + '</div>';
    }
    if (sinoStr) {
        h += '<div style="color:rgba(255,255,255,0.6);font-size:0.85rem">Sino: ' + escapeHtml(sinoStr) + '</div>';
    }
    h += '</div>';
    return h;
}

/**
 * Shows feedback for the number answer
 * @private
 * @param {HTMLElement} container - Container element
 * @param {boolean} isCorrect - Whether answer was correct
 */
function showNumberFeedback(container, isCorrect) {
    var fb = document.getElementById('numFeedback');
    if (!fb) return;
    fb.innerHTML = buildFeedbackContent(isCorrect);
    setTimeout(function () { nextNumberRound(container); }, 2500);
}

/**
 * Renders the number converter completion screen
 * @private
 * @param {HTMLElement} container - Container element
 */
function renderNumberEnd(container) {
    var pct = Math.round((numScore / (numTotal * 100)) * 100);
    if (pct >= 80) createConfetti(80);
    addXP(numScore / 10);
    var h = '<h2 class="game-title">Number Converter Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:4rem;margin:20px 0">&#128290;</div>';
    h += '<div style="font-size:2.5rem;color:var(--gold);margin:15px 0">' + numScore + ' pts</div>';
    h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:25px">' + pct + '% correct</p>';
    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="numAgainBtn">Play Again</button>';
    h += '<button class="game-btn secondary" id="numBackBtn">Back</button>';
    h += '</div></div>';
    container.innerHTML = h;

    document.getElementById('numAgainBtn').onclick = function () {
        showNumberConverter(container);
    };
    document.getElementById('numBackBtn').onclick = function () {
        if (typeof showMode === "function") showMode(gameState.currentMode);
    };
}

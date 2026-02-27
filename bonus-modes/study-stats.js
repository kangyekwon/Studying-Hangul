/**
 * study-stats.js
 * Study statistics dashboard with Chart.js integration and text fallback
 *
 * @module StudyStats
 * @requires game-engine.js (global functions: gameState, escapeHtml, etc.)
 * @requires Chart.js (optional, for graphical charts)
 */

/**
 * Records a study session statistic to localStorage
 * @public
 * @param {string} mode - Game mode name
 * @param {number} score - Score achieved
 * @param {number} duration - Session duration in seconds
 * @example
 * recordStudyStat('colorQuiz', 800, 120);
 */
function recordStudyStat(mode, score, duration) {
    try {
        var stats = JSON.parse(localStorage.getItem('dailyStudyStats') || '[]');
        stats.push({
            date: new Date().toISOString().slice(0, 10),
            mode: mode,
            score: score,
            duration: duration,
            timestamp: Date.now()
        });
        stats = filterRecentStats(stats, 90);
        localStorage.setItem('dailyStudyStats', JSON.stringify(stats));
    } catch (e) {}
}

/**
 * Filters stats to keep only entries within a given number of days
 * @private
 * @param {Array<Object>} stats - Stats array
 * @param {number} days - Number of days to keep
 * @returns {Array<Object>} Filtered stats array
 */
function filterRecentStats(stats, days) {
    var cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    var filtered = [];
    for (var i = 0; i < stats.length; i++) {
        if (stats[i].timestamp > cutoff) filtered.push(stats[i]);
    }
    return filtered;
}

/**
 * Loads study stats from localStorage
 * @private
 * @returns {Array<Object>} Array of stat entries
 */
function loadStudyStats() {
    try {
        return JSON.parse(localStorage.getItem('dailyStudyStats') || '[]');
    } catch (e) {
        return [];
    }
}

/**
 * Builds summary stat cards HTML
 * @private
 * @returns {string} HTML markup for stat cards
 */
function buildSummaryCards() {
    var totalGames = gameState.gamesPlayed || 0;
    var totalCorrect = gameState.correctAnswers || 0;
    var totalWords = gameState.wordsLearned || 0;
    var currentLevel = gameState.level || 1;
    var currentXP = gameState.xp || 0;
    var accuracy = totalGames > 0
        ? Math.round((totalCorrect / Math.max(totalGames * 10, totalCorrect)) * 100)
        : 0;

    var h = '<div class="stats-panel" style="margin-bottom:20px">';
    h += buildStatCard(currentLevel, 'Level');
    h += buildStatCard(currentXP, 'XP');
    h += buildStatCard(totalGames, 'Games');
    h += buildStatCard(totalWords, 'Words');
    h += buildStatCard(totalCorrect, 'Correct');
    h += buildStatCard(accuracy + '%', 'Accuracy');
    h += '</div>';
    return h;
}

/**
 * Builds a single stat card HTML
 * @private
 * @param {string|number} value - Display value
 * @param {string} label - Display label
 * @returns {string} HTML markup for one stat card
 */
function buildStatCard(value, label) {
    return '<div class="stats-card">' +
        '<div class="stats-card-value">' + value + '</div>' +
        '<div class="stats-card-label">' + label + '</div></div>';
}

/**
 * Builds Chart.js canvas containers HTML
 * @private
 * @returns {string} HTML markup for chart containers
 */
function buildChartContainers() {
    var h = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px">';
    h += '<div style="background:var(--glass);padding:15px;border-radius:15px"><canvas id="statsRadar" width="300" height="300"></canvas></div>';
    h += '<div style="background:var(--glass);padding:15px;border-radius:15px"><canvas id="statsBar" width="300" height="300"></canvas></div>';
    h += '</div>';
    h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:20px">';
    h += '<div style="background:var(--glass);padding:15px;border-radius:15px"><canvas id="statsDoughnut" width="300" height="300"></canvas></div>';
    h += '<div style="background:var(--glass);padding:15px;border-radius:15px"><canvas id="statsLine" width="300" height="300"></canvas></div>';
    h += '</div>';
    return h;
}

/**
 * Builds recent activity list HTML for text fallback
 * @private
 * @param {Array<Object>} stats - Stats data array
 * @returns {string} HTML markup for activity list
 */
function buildRecentActivity(stats) {
    var h = '<div style="background:var(--glass);padding:20px;border-radius:15px;margin-bottom:15px">';
    h += '<h3 style="color:var(--neon-cyan);margin-bottom:10px">Recent Activity</h3>';
    if (stats.length === 0) {
        h += '<p style="color:rgba(255,255,255,0.5)">No activity data yet. Play some games!</p>';
    } else {
        var last7 = stats.slice(-7);
        for (var i = 0; i < last7.length; i++) {
            h += buildActivityRow(last7[i]);
        }
    }
    h += '</div>';
    return h;
}

/**
 * Builds a single activity row HTML
 * @private
 * @param {Object} entry - Stats entry object
 * @returns {string} HTML markup for one row
 */
function buildActivityRow(entry) {
    return '<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.1)">' +
        '<span style="color:rgba(255,255,255,0.7)">' + escapeHtml(entry.date) + ' - ' + escapeHtml(entry.mode || 'game') + '</span>' +
        '<span style="color:var(--gold)">' + (entry.score || 0) + ' pts</span></div>';
}

/**
 * Counts word rarities from collected words
 * @private
 * @returns {Object} Rarity counts { common, rare, epic, legendary }
 */
function countWordRarities() {
    var collected = gameState.collectedWords || {};
    var rarities = { common: 0, rare: 0, epic: 0, legendary: 0 };
    for (var word in collected) {
        if (collected.hasOwnProperty(word)) {
            var r = collected[word] || "common";
            if (rarities.hasOwnProperty(r)) rarities[r]++;
        }
    }
    return rarities;
}

/**
 * Builds word collection stats HTML
 * @private
 * @returns {string} HTML markup for word collection
 */
function buildWordCollection() {
    var rarities = countWordRarities();
    var h = '<div style="background:var(--glass);padding:20px;border-radius:15px;margin-bottom:15px">';
    h += '<h3 style="color:var(--neon-cyan);margin-bottom:10px">Word Collection</h3>';
    h += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center">';
    h += buildRarityItem(rarities.common, 'Common', 'rgba(255,255,255,0.6)');
    h += buildRarityItem(rarities.rare, 'Rare', 'var(--neon-blue)');
    h += buildRarityItem(rarities.epic, 'Epic', 'var(--neon-purple)');
    h += buildRarityItem(rarities.legendary, 'Legendary', 'var(--gold)');
    h += '</div></div>';
    return h;
}

/**
 * Builds a single rarity count display
 * @private
 * @param {number} count - Count value
 * @param {string} label - Rarity label
 * @param {string} color - CSS color string
 * @returns {string} HTML markup
 */
function buildRarityItem(count, label, color) {
    return '<div><div style="color:' + color + ';font-size:1.5rem">' + count + '</div>' +
        '<div style="font-size:0.75rem;color:rgba(255,255,255,0.4)">' + label + '</div></div>';
}

/**
 * Initializes and shows the study statistics screen
 * @public
 * @param {HTMLElement} container - Container element
 * @example
 * showStudyStats(document.getElementById('gameContainer'));
 */
function showStudyStats(container) {
    var stats = loadStudyStats();
    var hasChart = (typeof Chart !== "undefined");

    var h = '<h2 class="game-title">Study Statistics</h2>';
    h += buildSummaryCards();

    if (hasChart) {
        h += buildChartContainers();
    } else {
        h += buildRecentActivity(stats);
        h += buildWordCollection();
    }

    h += '<div class="game-controls"><button class="game-btn secondary" id="statsBackBtn">Back</button></div>';
    container.innerHTML = h;

    document.getElementById('statsBackBtn').onclick = function () {
        if (typeof showMode === "function") showMode(gameState.currentMode);
    };

    if (hasChart) {
        try { renderStatsCharts(stats); } catch (e) {}
    }
}

/**
 * Renders all Chart.js charts
 * @private
 * @param {Array<Object>} stats - Stats data array
 */
function renderStatsCharts(stats) {
    renderRadarChart();
    renderBarChart(stats);
    renderDoughnutChart();
    renderLineChart(stats);
}

/**
 * Builds radar chart skill data from game state
 * @private
 * @returns {Array<number>} Skill data values
 */
function buildRadarData() {
    return [
        Math.min(100, (gameState.wordsLearned || 0) * 2),
        Math.min(100, (gameState.correctAnswers || 0)),
        Math.min(100, (gameState.gamesPlayed || 0) * 5),
        Math.min(100, (gameState.level || 1) * 10),
        Math.min(100, Object.keys(gameState.collectedWords || {}).length * 3)
    ];
}

/**
 * Renders the radar chart for skill areas
 * @private
 */
function renderRadarChart() {
    var radarCtx = document.getElementById('statsRadar');
    if (!radarCtx) return;
    new Chart(radarCtx.getContext('2d'), {
        type: 'radar',
        data: {
            labels: ['Vocabulary', 'Grammar', 'Pronunciation', 'Reading', 'Culture'],
            datasets: [{
                label: 'Skills',
                data: buildRadarData(),
                backgroundColor: 'rgba(255,45,149,0.2)',
                borderColor: '#ff2d95',
                pointBackgroundColor: '#ff2d95'
            }]
        },
        options: {
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: 'rgba(255,255,255,0.5)' },
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    pointLabels: { color: 'rgba(255,255,255,0.7)' }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}

/**
 * Collects daily game counts for the last 7 days
 * @private
 * @param {Array<Object>} stats - Stats data array
 * @returns {Object} { days: string[], counts: number[] }
 */
function collectDailyCounts(stats) {
    var days = [];
    var counts = [];
    for (var d = 6; d >= 0; d--) {
        var date = new Date();
        date.setDate(date.getDate() - d);
        var ds = date.toISOString().slice(0, 10);
        days.push(ds.slice(5));
        var count = 0;
        for (var s = 0; s < stats.length; s++) {
            if (stats[s].date === ds) count++;
        }
        counts.push(count);
    }
    return { days: days, counts: counts };
}

/**
 * Renders the bar chart for daily activity
 * @private
 * @param {Array<Object>} stats - Stats data array
 */
function renderBarChart(stats) {
    var barCtx = document.getElementById('statsBar');
    if (!barCtx) return;
    var daily = collectDailyCounts(stats);
    new Chart(barCtx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: daily.days,
            datasets: [{
                label: 'Games Played',
                data: daily.counts,
                backgroundColor: 'rgba(0,212,255,0.5)',
                borderColor: '#00d4ff',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, ticks: { color: 'rgba(255,255,255,0.5)', stepSize: 1 } },
                x: { ticks: { color: 'rgba(255,255,255,0.5)' } }
            },
            plugins: { legend: { labels: { color: 'rgba(255,255,255,0.7)' } } }
        }
    });
}

/**
 * Renders the doughnut chart for word rarity distribution
 * @private
 */
function renderDoughnutChart() {
    var doughCtx = document.getElementById('statsDoughnut');
    if (!doughCtx) return;
    var rarities = countWordRarities();
    new Chart(doughCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Common', 'Rare', 'Epic', 'Legendary'],
            datasets: [{
                data: [rarities.common, rarities.rare, rarities.epic, rarities.legendary],
                backgroundColor: ['rgba(255,255,255,0.3)', '#00d4ff', '#9d4edd', '#ffd700']
            }]
        },
        options: {
            plugins: { legend: { labels: { color: 'rgba(255,255,255,0.7)' } } }
        }
    });
}

/**
 * Collects cumulative XP data for the last 7 days
 * @private
 * @param {Array<Object>} stats - Stats data array
 * @returns {Object} { days: string[], values: number[] }
 */
function collectCumulativeXP(stats) {
    var days = [];
    var values = [];
    var cumXP = 0;
    for (var d = 6; d >= 0; d--) {
        var date = new Date();
        date.setDate(date.getDate() - d);
        var ds = date.toISOString().slice(0, 10);
        days.push(ds.slice(5));
        for (var s = 0; s < stats.length; s++) {
            if (stats[s].date === ds) cumXP += (stats[s].score || 0);
        }
        values.push(cumXP);
    }
    return { days: days, values: values };
}

/**
 * Renders the line chart for XP progress
 * @private
 * @param {Array<Object>} stats - Stats data array
 */
function renderLineChart(stats) {
    var lineCtx = document.getElementById('statsLine');
    if (!lineCtx) return;
    var xpData = collectCumulativeXP(stats);
    new Chart(lineCtx.getContext('2d'), {
        type: 'line',
        data: {
            labels: xpData.days,
            datasets: [{
                label: 'Cumulative Score',
                data: xpData.values,
                borderColor: '#ffd700',
                backgroundColor: 'rgba(255,215,0,0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, ticks: { color: 'rgba(255,255,255,0.5)' } },
                x: { ticks: { color: 'rgba(255,255,255,0.5)' } }
            },
            plugins: { legend: { labels: { color: 'rgba(255,255,255,0.7)' } } }
        }
    });
}

/**
 * learning-profile.js
 * Learning pattern analysis and user progress tracking
 *
 * @module LearningProfile
 * @requires wordDatabase (global)
 * @requires gameState (global)
 * @requires localStorage (browser API)
 */

/**
 * LearningProfile - Analyzes user's learning patterns and progress
 * @namespace
 */
var LearningProfile = {

    /**
     * Gets total word count for each category
     * @private
     * @returns {Object} Category totals { categoryName: count }
     */
    _getCategoryTotals: function () {
        var totals = {};
        if (typeof wordDatabase === "undefined") return totals;

        for (var cat in wordDatabase) {
            if (wordDatabase.hasOwnProperty(cat)) {
                totals[cat] = wordDatabase[cat].length;
            }
        }
        return totals;
    },

    /**
     * Gets collected word count for each category
     * @private
     * @returns {Object} Category collected counts { categoryName: count }
     */
    _getCategoryCollected: function () {
        var collected = {};
        if (typeof wordDatabase === "undefined") return collected;
        if (typeof gameState === "undefined") return collected;

        var collectedWords = gameState.collectedWords || {};

        for (var cat in wordDatabase) {
            if (!wordDatabase.hasOwnProperty(cat)) continue;
            collected[cat] = 0;

            for (var i = 0; i < wordDatabase[cat].length; i++) {
                if (collectedWords[wordDatabase[cat][i].korean]) {
                    collected[cat]++;
                }
            }
        }
        return collected;
    },

    /**
     * Retrieves daily study statistics from localStorage
     * @private
     * @returns {Array<Object>} Daily stats array
     */
    _getDailyStats: function () {
        try {
            return JSON.parse(localStorage.getItem("dailyStudyStats") || "[]");
        } catch (e) {
            return [];
        }
    },

    /**
     * Calculates category completion percentages (strengths)
     * @public
     * @returns {Array<Object>} Categories sorted by completion percentage (highest first)
     * @example
     * getStrengths() // [{ category: "greetings", collected: 45, total: 50, percentage: 90 }, ...]
     */
    getStrengths: function () {
        var totals = this._getCategoryTotals();
        var collected = this._getCategoryCollected();
        var results = [];

        for (var cat in totals) {
            if (!totals.hasOwnProperty(cat)) continue;

            var total = totals[cat];
            var col = collected[cat] || 0;
            var pct = total > 0 ? Math.round((col / total) * 100) : 0;

            results.push({
                category: cat,
                collected: col,
                total: total,
                percentage: pct
            });
        }

        results.sort(function (a, b) {
            return b.percentage - a.percentage;
        });

        return results;
    },

    /**
     * Identifies categories needing more practice (weaknesses)
     * @public
     * @returns {Array<Object>} Categories sorted by completion percentage (lowest first)
     * @example
     * getWeaknesses() // [{ category: "advanced", collected: 2, total: 50, percentage: 4 }, ...]
     */
    getWeaknesses: function () {
        var strengths = this.getStrengths();
        var weaknesses = strengths.slice();
        weaknesses.sort(function (a, b) {
            return a.percentage - b.percentage;
        });
        return weaknesses;
    },

    /**
     * Calculates learning velocity and trends
     * @public
     * @returns {Object} Velocity metrics including trend analysis
     * @example
     * getLearningVelocity()
     * // { wordsPerDay: 12.5, trend: "accelerating", recent7: 85, previous7: 65 }
     */
    getLearningVelocity: function () {
        var stats = this._getDailyStats();

        if (stats.length === 0) {
            return {
                wordsPerDay: 0,
                trend: "no data",
                recentDays: []
            };
        }

        // Group sessions by date
        var byDate = {};
        for (var i = 0; i < stats.length; i++) {
            var date = stats[i].date;
            if (!byDate[date]) {
                byDate[date] = { count: 0, score: 0 };
            }
            byDate[date].count++;
            byDate[date].score += (stats[i].score || 0);
        }

        // Sort dates
        var dates = [];
        for (var d in byDate) {
            if (byDate.hasOwnProperty(d)) dates.push(d);
        }
        dates.sort();

        // Compare recent 7 days vs previous 7 days
        var recent7 = 0;
        var previous7 = 0;
        var today = new Date().toISOString().slice(0, 10);

        for (var j = 0; j < dates.length; j++) {
            var daysDiff = Math.floor(
                (new Date(today) - new Date(dates[j])) / 86400000
            );

            if (daysDiff >= 0 && daysDiff < 7) {
                recent7 += byDate[dates[j]].count;
            } else if (daysDiff >= 7 && daysDiff < 14) {
                previous7 += byDate[dates[j]].count;
            }
        }

        // Determine trend
        var trend = "steady";
        if (recent7 > previous7 * 1.2) {
            trend = "accelerating";
        } else if (recent7 < previous7 * 0.8) {
            trend = "declining";
        }

        // Calculate average words per day
        var totalDays = dates.length || 1;
        var totalSessions = stats.length;
        var wordsPerDay = Math.round(totalSessions / totalDays * 10) / 10;

        // Get recent days detail
        var recentDays = [];
        for (var r = Math.max(0, dates.length - 7); r < dates.length; r++) {
            recentDays.push({
                date: dates[r],
                sessions: byDate[dates[r]].count,
                score: byDate[dates[r]].score
            });
        }

        return {
            wordsPerDay: wordsPerDay,
            trend: trend,
            totalDays: totalDays,
            totalSessions: totalSessions,
            recent7: recent7,
            previous7: previous7,
            recentDays: recentDays
        };
    },

    /**
     * Generates personalized study plan based on user data
     * @public
     * @returns {Array<Object>} Study plan actions with priorities
     * @example
     * getOptimalStudyPlan()
     * // [{ action: "Review 15 SRS words", reason: "...", priority: "high", mode: "srs" }]
     */
    getOptimalStudyPlan: function () {
        var plan = [];
        var weaknesses = this.getWeaknesses();

        // Check for SRS words due
        var srsCount = 0;
        try {
            var srsData = JSON.parse(localStorage.getItem("srsData") || "{}");
            var now = Date.now();

            for (var k in srsData) {
                if (srsData.hasOwnProperty(k) &&
                    srsData[k].nextReview &&
                    srsData[k].nextReview <= now) {
                    srsCount++;
                }
            }
        } catch (e) {}

        if (srsCount > 0) {
            plan.push({
                action: "Review " + srsCount + " SRS words due today",
                reason: "Spaced repetition words are due - reviewing now maximizes retention",
                priority: "high",
                mode: "srs"
            });
        }

        // Recommend weakest category
        if (weaknesses.length > 0 && weaknesses[0].percentage < 50) {
            var weakCat = weaknesses[0];
            var catName = weakCat.category;

            if (typeof categoryNames !== "undefined" && categoryNames[catName]) {
                catName = categoryNames[catName];
            }

            plan.push({
                action: "Study " + catName + " category (only " + weakCat.percentage + "% collected)",
                reason: "This is your weakest category with the most room for growth",
                priority: "high",
                mode: "flashcards"
            });
        }

        // Recommend weak words review
        var weakWords = [];
        try {
            var weakData = JSON.parse(localStorage.getItem("koreanGame_weakWords") || "{}");
            for (var wk in weakData) {
                if (weakData.hasOwnProperty(wk)) {
                    weakWords.push(weakData[wk]);
                }
            }
        } catch (e) {}

        if (weakWords.length > 0) {
            plan.push({
                action: "Review " + Math.min(10, weakWords.length) + " words you frequently get wrong",
                reason: "Targeting weak words improves overall accuracy",
                priority: "medium",
                mode: "review"
            });
        }

        // Velocity-based suggestion
        var velocity = this.getLearningVelocity();
        if (velocity.trend === "declining") {
            plan.push({
                action: "Try a fun game mode like Memory or Galaxy to boost motivation",
                reason: "Your study frequency is declining - variety keeps learning engaging",
                priority: "medium",
                mode: "memory"
            });
        }

        // Grammar practice
        if (typeof grammarPatterns !== "undefined" && grammarPatterns.length > 0) {
            plan.push({
                action: "Practice grammar patterns with Grammar Drill",
                reason: "Grammar knowledge strengthens sentence building skills",
                priority: "low",
                mode: "grammar"
            });
        }

        // Listening practice
        plan.push({
            action: "Do a listening session to train your ear",
            reason: "Listening skill connects reading knowledge with spoken Korean",
            priority: "low",
            mode: "listening"
        });

        return plan;
    },

    /**
     * Predicts future level based on current learning rate
     * @public
     * @param {number} daysFromNow - Number of days to predict ahead
     * @returns {Object} Level prediction data
     * @example
     * predictLevel(30)
     * // { currentLevel: 5, predictedLevel: 8, xpPerDay: 150 }
     */
    predictLevel: function (daysFromNow) {
        if (typeof gameState === "undefined") {
            return {
                currentLevel: 1,
                predictedLevel: 1,
                predictedXP: 0
            };
        }

        var stats = this._getDailyStats();
        var totalXPEstimate = 0;
        var dayCount = 0;

        // Estimate XP per day from recent sessions
        var byDate = {};
        for (var i = 0; i < stats.length; i++) {
            var date = stats[i].date;
            if (!byDate[date]) byDate[date] = 0;
            // Estimate 5 XP per session if no score
            byDate[date] += (stats[i].score || 5);
        }

        for (var d in byDate) {
            if (byDate.hasOwnProperty(d)) {
                totalXPEstimate += byDate[d];
                dayCount++;
            }
        }

        var xpPerDay = dayCount > 0 ? totalXPEstimate / dayCount : 10;
        var futureXP = gameState.xp + (xpPerDay * daysFromNow);
        var futureLevel = gameState.level;
        var xpNeeded = futureLevel * 100;

        // Calculate future level
        while (futureXP >= xpNeeded) {
            futureXP -= xpNeeded;
            futureLevel++;
            xpNeeded = futureLevel * 100;
        }

        return {
            currentLevel: gameState.level,
            currentXP: gameState.xp,
            xpPerDay: Math.round(xpPerDay),
            predictedLevel: futureLevel,
            predictedXP: Math.round(futureXP),
            daysFromNow: daysFromNow
        };
    },

    /**
     * Analyzes study streak and consistency
     * @public
     * @returns {Object} Streak statistics and active days
     * @example
     * getStudyStreak()
     * // { currentStreak: 7, longestStreak: 15, avgDailyTime: 25, activeDays: [...] }
     */
    getStudyStreak: function () {
        var stats = this._getDailyStats();

        if (stats.length === 0) {
            return {
                currentStreak: 0,
                longestStreak: 0,
                avgDailyTime: 0,
                activeDays: []
            };
        }

        // Get unique dates and total duration
        var dateSet = {};
        var totalDuration = 0;

        for (var i = 0; i < stats.length; i++) {
            dateSet[stats[i].date] = true;
            totalDuration += (stats[i].duration || 0);
        }

        var dates = [];
        for (var d in dateSet) {
            if (dateSet.hasOwnProperty(d)) dates.push(d);
        }
        dates.sort();

        // Calculate current streak (from today backwards)
        var today = new Date().toISOString().slice(0, 10);
        var currentStreak = 0;
        var checkDate = new Date(today);

        for (var cs = 0; cs < 365; cs++) {
            var dateStr = checkDate.toISOString().slice(0, 10);

            if (dateSet[dateStr]) {
                currentStreak++;
            } else {
                // Allow today to be missing (day not over yet) on first check
                if (cs > 0) break;
            }

            checkDate.setDate(checkDate.getDate() - 1);
        }

        // Calculate longest streak
        var longestStreak = 0;
        var tempStreak = 1;

        for (var ls = 1; ls < dates.length; ls++) {
            var prev = new Date(dates[ls - 1]);
            var curr = new Date(dates[ls]);
            var diff = Math.round((curr - prev) / 86400000);

            if (diff === 1) {
                tempStreak++;
            } else {
                if (tempStreak > longestStreak) {
                    longestStreak = tempStreak;
                }
                tempStreak = 1;
            }
        }

        if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
        }

        var avgDailyTime = dates.length > 0 ?
            Math.round(totalDuration / dates.length) : 0;

        return {
            currentStreak: currentStreak,
            longestStreak: longestStreak,
            avgDailyTime: avgDailyTime,
            totalDays: dates.length,
            activeDays: dates.slice(-30)
        };
    }
};

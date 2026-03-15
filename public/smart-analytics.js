// ============================================================
// smart-analytics.js
// Intelligence Layer for K-POP Korean Learning Game
// Analyzes and combines existing data for personalized learning
// ============================================================

// ============================================================
// 1. WordAnalyzer - Cross-reference word database
// ============================================================

var WordAnalyzer = {

    _disassemble: function (text) {
        if (typeof Hangul !== "undefined" && Hangul.disassemble) {
            return Hangul.disassemble(text);
        }
        return text.split("");
    },

    _getInitialConsonant: function (char) {
        var code = char.charCodeAt(0);
        if (code < 0xAC00 || code > 0xD7A3) return null;
        var initials = [
            "ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ",
            "ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"
        ];
        var idx = Math.floor((code - 0xAC00) / 588);
        return initials[idx] || null;
    },

    _getSyllables: function (korean) {
        var syllables = [];
        for (var i = 0; i < korean.length; i++) {
            var code = korean.charCodeAt(i);
            if (code >= 0xAC00 && code <= 0xD7A3) {
                syllables.push(korean[i]);
            }
        }
        return syllables;
    },

    _getAllWords: function () {
        var all = [];
        if (typeof wordDatabase === "undefined") return all;
        for (var cat in wordDatabase) {
            if (wordDatabase.hasOwnProperty(cat)) {
                for (var i = 0; i < wordDatabase[cat].length; i++) {
                    all.push(wordDatabase[cat][i]);
                }
            }
        }
        return all;
    },

    findRelatedWords: function (korean) {
        var results = [];
        var seen = {};
        var allWords = this._getAllWords();
        if (allWords.length === 0 || !korean) return results;

        var targetSyllables = this._getSyllables(korean);
        var targetInitial = targetSyllables.length > 0 ? this._getInitialConsonant(targetSyllables[0]) : null;
        var targetWord = null;

        // Find the target word object
        for (var i = 0; i < allWords.length; i++) {
            if (allWords[i].korean === korean) {
                targetWord = allWords[i];
                break;
            }
        }

        for (var w = 0; w < allWords.length; w++) {
            var word = allWords[w];
            if (word.korean === korean) continue;
            if (seen[word.korean]) continue;

            // Shared syllable check
            var wordSyllables = this._getSyllables(word.korean);
            for (var s = 0; s < targetSyllables.length; s++) {
                for (var ws = 0; ws < wordSyllables.length; ws++) {
                    if (targetSyllables[s] === wordSyllables[ws] && !seen[word.korean]) {
                        seen[word.korean] = true;
                        results.push({
                            word: word,
                            reason: "Shared syllable: " + targetSyllables[s]
                        });
                    }
                }
            }
        }

        // Same initial consonant
        if (targetInitial) {
            for (var ic = 0; ic < allWords.length; ic++) {
                var w2 = allWords[ic];
                if (w2.korean === korean || seen[w2.korean]) continue;
                var s2 = this._getSyllables(w2.korean);
                if (s2.length > 0 && this._getInitialConsonant(s2[0]) === targetInitial) {
                    seen[w2.korean] = true;
                    results.push({
                        word: w2,
                        reason: "Same initial consonant: " + targetInitial
                    });
                }
            }
        }

        // Same category
        if (targetWord && targetWord.category) {
            for (var sc = 0; sc < allWords.length; sc++) {
                if (allWords[sc].korean === korean || seen[allWords[sc].korean]) continue;
                if (allWords[sc].category === targetWord.category) {
                    seen[allWords[sc].korean] = true;
                    results.push({
                        word: allWords[sc],
                        reason: "Same category: " + targetWord.category
                    });
                }
            }
        }

        // Same rarity
        if (targetWord && targetWord.rarity) {
            for (var sr = 0; sr < allWords.length; sr++) {
                if (allWords[sr].korean === korean || seen[allWords[sr].korean]) continue;
                if (allWords[sr].rarity === targetWord.rarity) {
                    seen[allWords[sr].korean] = true;
                    results.push({
                        word: allWords[sr],
                        reason: "Same rarity: " + targetWord.rarity
                    });
                }
            }
        }

        // Sort: shared syllable first, then limit to 10
        results.sort(function (a, b) {
            var aScore = a.reason.indexOf("Shared syllable") === 0 ? 3 :
                         a.reason.indexOf("Same initial") === 0 ? 2 :
                         a.reason.indexOf("Same category") === 0 ? 1 : 0;
            var bScore = b.reason.indexOf("Shared syllable") === 0 ? 3 :
                         b.reason.indexOf("Same initial") === 0 ? 2 :
                         b.reason.indexOf("Same category") === 0 ? 1 : 0;
            return bScore - aScore;
        });

        return results.slice(0, 10);
    },

    findWordFamilies: function () {
        var allWords = this._getAllWords();
        var families = {};

        for (var i = 0; i < allWords.length; i++) {
            var syllables = this._getSyllables(allWords[i].korean);
            for (var s = 0; s < syllables.length; s++) {
                var syl = syllables[s];
                if (!families[syl]) {
                    families[syl] = [];
                }
                var alreadyIn = false;
                for (var k = 0; k < families[syl].length; k++) {
                    if (families[syl][k].korean === allWords[i].korean) {
                        alreadyIn = true;
                        break;
                    }
                }
                if (!alreadyIn) {
                    families[syl].push(allWords[i]);
                }
            }
        }

        // Filter: only families with 2+ members
        var result = {};
        for (var key in families) {
            if (families.hasOwnProperty(key) && families[key].length >= 2) {
                result[key] = families[key];
            }
        }
        return result;
    },

    getWordDifficulty: function (word) {
        if (!word || !word.korean) return 5;
        var score = 0;
        var syllables = this._getSyllables(word.korean);

        // Syllable count: more syllables = harder
        score += Math.min(syllables.length, 5);

        // Double consonants
        var doubles = ["ㅃ","ㄲ","ㄸ","ㅆ","ㅉ"];
        var chars = this._disassemble(word.korean);
        for (var i = 0; i < chars.length; i++) {
            for (var d = 0; d < doubles.length; d++) {
                if (chars[i] === doubles[d]) {
                    score += 1;
                    break;
                }
            }
        }

        // Rarity
        var rarityMap = { common: 0, rare: 1, epic: 2, legendary: 3 };
        var rarity = word.rarity ? word.rarity.toLowerCase() : "common";
        score += rarityMap[rarity] || 0;

        // Category complexity
        var hardCategories = { topik: 1, idioms: 1, slang: 1, tonguetwister: 2 };
        if (word.category && hardCategories[word.category]) {
            score += hardCategories[word.category];
        }

        return Math.max(1, Math.min(10, Math.round(score)));
    },

    findMinimalPairMatches: function (korean) {
        var allWords = this._getAllWords();
        var results = [];
        if (!korean) return results;

        var targetChars = this._disassemble(korean);

        for (var i = 0; i < allWords.length; i++) {
            var w = allWords[i];
            if (w.korean === korean) continue;
            var wChars = this._disassemble(w.korean);

            // Similar length check
            if (Math.abs(targetChars.length - wChars.length) > 1) continue;

            // Count differences
            var diffs = 0;
            var maxLen = Math.max(targetChars.length, wChars.length);
            for (var c = 0; c < maxLen; c++) {
                if (targetChars[c] !== wChars[c]) diffs++;
                if (diffs > 2) break;
            }

            if (diffs >= 1 && diffs <= 2) {
                results.push({
                    word: w,
                    differences: diffs
                });
            }
        }

        results.sort(function (a, b) { return a.differences - b.differences; });
        return results.slice(0, 10);
    },

    getCategoryOverlap: function () {
        var allWords = this._getAllWords();
        var wordMap = {};

        for (var i = 0; i < allWords.length; i++) {
            var w = allWords[i];
            var key = w.korean;
            if (!wordMap[key]) {
                wordMap[key] = { word: w, categories: [] };
            }
            if (w.category && wordMap[key].categories.indexOf(w.category) === -1) {
                wordMap[key].categories.push(w.category);
            }
        }

        var overlaps = [];
        for (var k in wordMap) {
            if (wordMap.hasOwnProperty(k) && wordMap[k].categories.length > 1) {
                overlaps.push(wordMap[k]);
            }
        }
        return overlaps;
    }
};


// ============================================================
// 2. LearningProfile - Analyze user's learning patterns
// ============================================================

var LearningProfile = {

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

    _getCategoryCollected: function () {
        var collected = {};
        if (typeof gameState === "undefined") return collected;
        if (typeof wordDatabase === "undefined") return collected;

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

    _getDailyStats: function () {
        try {
            return JSON.parse(localStorage.getItem("dailyStudyStats") || "[]");
        } catch (e) {
            return [];
        }
    },

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

        results.sort(function (a, b) { return b.percentage - a.percentage; });
        return results;
    },

    getWeaknesses: function () {
        var strengths = this.getStrengths();
        // Reverse: lowest percentage first
        var weaknesses = strengths.slice();
        weaknesses.sort(function (a, b) { return a.percentage - b.percentage; });
        return weaknesses;
    },

    getLearningVelocity: function () {
        var stats = this._getDailyStats();
        if (stats.length === 0) {
            return { wordsPerDay: 0, trend: "no data", recentDays: [] };
        }

        // Group by date
        var byDate = {};
        for (var i = 0; i < stats.length; i++) {
            var date = stats[i].date;
            if (!byDate[date]) byDate[date] = { count: 0, score: 0 };
            byDate[date].count++;
            byDate[date].score += (stats[i].score || 0);
        }

        var dates = [];
        for (var d in byDate) {
            if (byDate.hasOwnProperty(d)) dates.push(d);
        }
        dates.sort();

        // Calculate recent 7 days vs previous 7 days
        var recent7 = 0;
        var previous7 = 0;
        var today = new Date().toISOString().slice(0, 10);

        for (var j = 0; j < dates.length; j++) {
            var daysDiff = Math.floor((new Date(today) - new Date(dates[j])) / 86400000);
            if (daysDiff >= 0 && daysDiff < 7) {
                recent7 += byDate[dates[j]].count;
            } else if (daysDiff >= 7 && daysDiff < 14) {
                previous7 += byDate[dates[j]].count;
            }
        }

        var trend = "steady";
        if (recent7 > previous7 * 1.2) trend = "accelerating";
        else if (recent7 < previous7 * 0.8) trend = "declining";

        var totalDays = dates.length || 1;
        var totalSessions = stats.length;
        var wordsPerDay = Math.round(totalSessions / totalDays * 10) / 10;

        // Recent days detail
        var recentDays = [];
        for (var r = Math.max(0, dates.length - 7); r < dates.length; r++) {
            recentDays.push({ date: dates[r], sessions: byDate[dates[r]].count, score: byDate[dates[r]].score });
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

    getOptimalStudyPlan: function () {
        var plan = [];
        var weaknesses = this.getWeaknesses();

        // SRS words due
        var srsCount = 0;
        try {
            var srsData = JSON.parse(localStorage.getItem("srsData") || "{}");
            var now = Date.now();
            for (var k in srsData) {
                if (srsData.hasOwnProperty(k) && srsData[k].nextReview && srsData[k].nextReview <= now) {
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

        // Weakest category
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

        // Weak words review
        var weakWords = [];
        try {
            var weakData = JSON.parse(localStorage.getItem("koreanGame_weakWords") || "{}");
            for (var wk in weakData) {
                if (weakData.hasOwnProperty(wk)) weakWords.push(weakData[wk]);
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

        // Mode suggestion based on velocity
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

    predictLevel: function (daysFromNow) {
        if (typeof gameState === "undefined") return { currentLevel: 1, predictedLevel: 1, predictedXP: 0 };

        var stats = this._getDailyStats();
        var totalXPEstimate = 0;
        var dayCount = 0;

        // Estimate XP per day from recent sessions
        var byDate = {};
        for (var i = 0; i < stats.length; i++) {
            var date = stats[i].date;
            if (!byDate[date]) byDate[date] = 0;
            byDate[date] += (stats[i].score || 5); // estimate 5 XP per session if no score
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

    getStudyStreak: function () {
        var stats = this._getDailyStats();
        if (stats.length === 0) {
            return { currentStreak: 0, longestStreak: 0, avgDailyTime: 0, activeDays: [] };
        }

        // Get unique dates
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

        // Current streak (from today backwards)
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

        // Longest streak
        var longestStreak = 0;
        var tempStreak = 1;
        for (var ls = 1; ls < dates.length; ls++) {
            var prev = new Date(dates[ls - 1]);
            var curr = new Date(dates[ls]);
            var diff = Math.round((curr - prev) / 86400000);
            if (diff === 1) {
                tempStreak++;
            } else {
                if (tempStreak > longestStreak) longestStreak = tempStreak;
                tempStreak = 1;
            }
        }
        if (tempStreak > longestStreak) longestStreak = tempStreak;

        var avgDailyTime = dates.length > 0 ? Math.round(totalDuration / dates.length) : 0;

        return {
            currentStreak: currentStreak,
            longestStreak: longestStreak,
            avgDailyTime: avgDailyTime,
            totalDays: dates.length,
            activeDays: dates.slice(-30)
        };
    }
};


// ============================================================
// 3. SmartRecommender - Personalized recommendations
// ============================================================

var SmartRecommender = {

    getNextWords: function (count) {
        count = count || 10;
        var results = [];
        var seen = {};
        var now = Date.now();

        // 1. SRS words due today (box 1-2 priority)
        try {
            var srsData = JSON.parse(localStorage.getItem("srsData") || "{}");
            var dueWords = [];
            for (var k in srsData) {
                if (!srsData.hasOwnProperty(k)) continue;
                var entry = srsData[k];
                if (entry.nextReview && entry.nextReview <= now && (entry.box || 1) < 5) {
                    dueWords.push({ key: k, entry: entry });
                }
            }
            // Sort: lower box first
            dueWords.sort(function (a, b) { return (a.entry.box || 1) - (b.entry.box || 1); });
            for (var d = 0; d < dueWords.length && results.length < count; d++) {
                if (dueWords[d].entry.word && !seen[dueWords[d].key]) {
                    seen[dueWords[d].key] = true;
                    results.push({ word: dueWords[d].entry.word, reason: "SRS due (box " + (dueWords[d].entry.box || 1) + ")" });
                }
            }
        } catch (e) {}

        // 2. Words from weakest category
        if (results.length < count) {
            var weaknesses = LearningProfile.getWeaknesses();
            var collectedWords = (typeof gameState !== "undefined") ? (gameState.collectedWords || {}) : {};

            for (var wi = 0; wi < weaknesses.length && results.length < count; wi++) {
                var cat = weaknesses[wi].category;
                if (typeof wordDatabase === "undefined" || !wordDatabase[cat]) continue;
                var catWords = wordDatabase[cat];
                for (var cw = 0; cw < catWords.length && results.length < count; cw++) {
                    if (!collectedWords[catWords[cw].korean] && !seen[catWords[cw].korean]) {
                        seen[catWords[cw].korean] = true;
                        var catLabel = cat;
                        if (typeof categoryNames !== "undefined" && categoryNames[cat]) catLabel = categoryNames[cat];
                        results.push({ word: catWords[cw], reason: "Weak category: " + catLabel });
                    }
                }
            }
        }

        // 3. Related to recently learned words
        if (results.length < count && results.length > 0) {
            var seedWord = results[0].word.korean;
            var related = WordAnalyzer.findRelatedWords(seedWord);
            for (var ri = 0; ri < related.length && results.length < count; ri++) {
                if (!seen[related[ri].word.korean]) {
                    seen[related[ri].word.korean] = true;
                    results.push({ word: related[ri].word, reason: "Related to " + seedWord + " (" + related[ri].reason + ")" });
                }
            }
        }

        return results.slice(0, count);
    },

    getRecommendedMode: function () {
        var stats = [];
        try { stats = JSON.parse(localStorage.getItem("dailyStudyStats") || "[]"); } catch (e) {}

        var modes = ["flashcards","quiz","memory","speed","typing","listening","grammar","situation","survival","chain"];
        var modeLabels = {
            flashcards:"Flashcards", quiz:"Quiz", memory:"Memory Match", speed:"Speed Challenge",
            typing:"Typing Practice", listening:"Listening", grammar:"Grammar Drill",
            situation:"Situational Phrases", survival:"Survival Mode", chain:"Word Chain"
        };

        // Count recent mode usage (last 7 days)
        var recentModes = {};
        var cutoff = Date.now() - 7 * 86400000;
        for (var i = 0; i < stats.length; i++) {
            if (stats[i].timestamp && stats[i].timestamp > cutoff) {
                var m = stats[i].mode || "";
                recentModes[m] = (recentModes[m] || 0) + 1;
            }
        }

        // Find least used mode
        var bestMode = modes[0];
        var bestScore = Infinity;
        for (var mi = 0; mi < modes.length; mi++) {
            var usage = recentModes[modes[mi]] || 0;
            if (usage < bestScore) {
                bestScore = usage;
                bestMode = modes[mi];
            }
        }

        var reason = bestScore === 0
            ? "You haven't tried " + (modeLabels[bestMode] || bestMode) + " recently - give it a go!"
            : (modeLabels[bestMode] || bestMode) + " has the fewest recent sessions - variety helps retention.";

        return {
            mode: bestMode,
            modeLabel: modeLabels[bestMode] || bestMode,
            reason: reason
        };
    },

    getDailyChallenge: function () {
        var challenges = [];
        var gs = (typeof gameState !== "undefined") ? gameState : {};

        // SRS-based challenge
        var srsCount = 0;
        try {
            var srsData = JSON.parse(localStorage.getItem("srsData") || "{}");
            var now = Date.now();
            for (var sk in srsData) {
                if (srsData.hasOwnProperty(sk) && srsData[sk].nextReview && srsData[sk].nextReview <= now) srsCount++;
            }
        } catch (e) {}

        if (srsCount >= 5) {
            challenges.push({
                title: "Review " + Math.min(15, srsCount) + " SRS words",
                description: "You have " + srsCount + " words due for review today",
                type: "review",
                target: Math.min(15, srsCount),
                mode: "srs"
            });
        }

        // Combo challenge
        var currentBest = gs.bestCombo || 0;
        if (currentBest < 20) {
            challenges.push({
                title: "Get a " + (currentBest + 3) + "-combo streak",
                description: "Your best combo is " + currentBest + " - push it further!",
                type: "combo",
                target: currentBest + 3,
                mode: "quiz"
            });
        }

        // Category exploration
        var weaknesses = LearningProfile.getWeaknesses();
        if (weaknesses.length > 0 && weaknesses[0].percentage < 30) {
            var weakCat = weaknesses[0].category;
            var catLabel = weakCat;
            if (typeof categoryNames !== "undefined" && categoryNames[weakCat]) catLabel = categoryNames[weakCat];
            challenges.push({
                title: "Learn 5 new " + catLabel + " words",
                description: "Only " + weaknesses[0].percentage + "% collected in this category",
                type: "learn",
                target: 5,
                mode: "flashcards"
            });
        }

        // Level up challenge
        if (gs.level && gs.xp !== undefined) {
            var xpNeeded = gs.level * 100;
            var remaining = xpNeeded - gs.xp;
            if (remaining > 0 && remaining <= 50) {
                challenges.push({
                    title: "Earn " + remaining + " XP to level up!",
                    description: "You're so close to level " + (gs.level + 1) + "!",
                    type: "xp",
                    target: remaining,
                    mode: "speed"
                });
            }
        }

        // Pick best challenge based on day seed for consistency
        var dayNum = Math.floor(Date.now() / 86400000);
        if (challenges.length === 0) {
            challenges.push({
                title: "Complete 3 study sessions",
                description: "Any mode counts - just keep learning!",
                type: "sessions",
                target: 3,
                mode: "flashcards"
            });
        }

        return challenges[dayNum % challenges.length];
    },

    getWordOfTheDay: function () {
        if (typeof wordDatabase === "undefined") return null;

        var collectedWords = (typeof gameState !== "undefined") ? (gameState.collectedWords || {}) : {};
        var weaknesses = LearningProfile.getWeaknesses();
        var allWords = WordAnalyzer._getAllWords();

        // Filter to uncollected words
        var uncollected = [];
        for (var i = 0; i < allWords.length; i++) {
            if (!collectedWords[allWords[i].korean]) {
                uncollected.push(allWords[i]);
            }
        }

        if (uncollected.length === 0) {
            // All collected, just pick from all
            uncollected = allWords;
        }

        // Prefer weak category words
        var weakCat = (weaknesses.length > 0) ? weaknesses[0].category : null;
        var weakCatWords = [];
        if (weakCat) {
            for (var w = 0; w < uncollected.length; w++) {
                if (uncollected[w].category === weakCat) {
                    weakCatWords.push(uncollected[w]);
                }
            }
        }

        var pool = weakCatWords.length > 0 ? weakCatWords : uncollected;

        // Use day-based seed for consistency within a day
        var dayNum = Math.floor(Date.now() / 86400000);
        var idx = dayNum % pool.length;

        var word = pool[idx];
        var difficulty = WordAnalyzer.getWordDifficulty(word);
        var context = DataCombiner.findWordInContext(word.korean);

        return {
            word: word,
            difficulty: difficulty,
            context: context
        };
    }
};


// ============================================================
// 4. DataCombiner - Cross-reference different data sources
// ============================================================

var DataCombiner = {

    _searchInText: function (text, korean) {
        if (!text || !korean) return false;
        if (text.indexOf(korean) !== -1) return true;
        // Also search individual syllables for partial matches in longer texts
        if (typeof Hangul !== "undefined" && Hangul.search) {
            return Hangul.search(text, korean) >= 0;
        }
        return false;
    },

    findWordInContext: function (korean) {
        var result = { proverbs: [], quotes: [], lyrics: [], patterns: [], situations: [], memes: [], recipes: [] };
        if (!korean) return result;

        // Search proverbs
        if (typeof koreanProverbs !== "undefined") {
            for (var p = 0; p < koreanProverbs.length; p++) {
                if (this._searchInText(koreanProverbs[p].korean, korean)) {
                    result.proverbs.push(koreanProverbs[p]);
                }
            }
        }

        // Search K-drama quotes
        if (typeof kdramaQuotes !== "undefined") {
            for (var q = 0; q < kdramaQuotes.length; q++) {
                if (this._searchInText(kdramaQuotes[q].korean, korean)) {
                    result.quotes.push(kdramaQuotes[q]);
                }
            }
        }

        // Search K-pop lyrics
        if (typeof kpopLyrics !== "undefined") {
            for (var l = 0; l < kpopLyrics.length; l++) {
                var lyric = kpopLyrics[l];
                var lyricText = lyric.korean || lyric.lyric || lyric.line || "";
                if (this._searchInText(lyricText, korean)) {
                    result.lyrics.push(lyric);
                }
            }
        }

        // Search grammar patterns
        if (typeof grammarPatterns !== "undefined") {
            for (var g = 0; g < grammarPatterns.length; g++) {
                var gp = grammarPatterns[g];
                var found = false;
                if (gp.examples) {
                    for (var ge = 0; ge < gp.examples.length; ge++) {
                        if (this._searchInText(gp.examples[ge].base || "", korean) ||
                            this._searchInText(gp.examples[ge].conjugated || "", korean)) {
                            found = true;
                            break;
                        }
                    }
                }
                if (found || this._searchInText(gp.pattern || "", korean)) {
                    result.patterns.push(gp);
                }
            }
        }

        // Search situational phrases
        if (typeof situationalPhrases !== "undefined") {
            for (var sit in situationalPhrases) {
                if (!situationalPhrases.hasOwnProperty(sit)) continue;
                var scene = situationalPhrases[sit];
                var phrases = scene.phrases || [];
                for (var sp = 0; sp < phrases.length; sp++) {
                    if (this._searchInText(phrases[sp].korean, korean)) {
                        result.situations.push({
                            scene: scene.name || sit,
                            phrase: phrases[sp]
                        });
                    }
                }
            }
        }

        // Search memes
        if (typeof koreanMemes !== "undefined") {
            for (var m = 0; m < koreanMemes.length; m++) {
                if (this._searchInText(koreanMemes[m].korean, korean) ||
                    this._searchInText(koreanMemes[m].example || "", korean)) {
                    result.memes.push(koreanMemes[m]);
                }
            }
        }

        // Search recipes
        if (typeof kfoodRecipes !== "undefined") {
            for (var r = 0; r < kfoodRecipes.length; r++) {
                var recipe = kfoodRecipes[r];
                if (this._searchInText(recipe.korean || recipe.name || "", korean)) {
                    result.recipes.push(recipe);
                }
            }
        }

        return result;
    },

    buildLearningPath: function (fromWord, depth) {
        depth = depth || 3;
        var path = [];
        var visited = {};

        var currentWord = fromWord;
        if (typeof currentWord === "string") {
            var allW = WordAnalyzer._getAllWords();
            for (var f = 0; f < allW.length; f++) {
                if (allW[f].korean === fromWord) { currentWord = allW[f]; break; }
            }
        }
        if (!currentWord || !currentWord.korean) return path;

        for (var step = 0; step < depth; step++) {
            if (visited[currentWord.korean]) break;
            visited[currentWord.korean] = true;

            var context = this.findWordInContext(currentWord.korean);
            var related = WordAnalyzer.findRelatedWords(currentWord.korean);
            var difficulty = WordAnalyzer.getWordDifficulty(currentWord);

            path.push({
                step: step + 1,
                word: currentWord,
                difficulty: difficulty,
                contexts: {
                    proverbs: context.proverbs.length,
                    quotes: context.quotes.length,
                    lyrics: context.lyrics.length,
                    patterns: context.patterns.length,
                    situations: context.situations.length
                },
                sampleContext: context.proverbs[0] || context.quotes[0] || context.situations[0] || null,
                relatedWords: related.slice(0, 3)
            });

            // Pick next unvisited related word
            var nextWord = null;
            for (var nr = 0; nr < related.length; nr++) {
                if (!visited[related[nr].word.korean]) {
                    nextWord = related[nr].word;
                    break;
                }
            }
            if (!nextWord) break;
            currentWord = nextWord;
        }

        return path;
    },

    getThematicBundle: function (theme) {
        var bundle = { theme: theme, words: [], phrases: [], patterns: [], proverbs: [], extras: [] };
        if (typeof wordDatabase === "undefined") return bundle;

        var themeLower = theme.toLowerCase();

        // Search words by category or english/korean match
        var allWords = WordAnalyzer._getAllWords();
        for (var w = 0; w < allWords.length; w++) {
            var word = allWords[w];
            if ((word.category && word.category.toLowerCase().indexOf(themeLower) !== -1) ||
                (word.english && word.english.toLowerCase().indexOf(themeLower) !== -1) ||
                (word.korean && word.korean.indexOf(theme) !== -1)) {
                bundle.words.push(word);
            }
        }

        // Search situational phrases
        if (typeof situationalPhrases !== "undefined") {
            for (var sit in situationalPhrases) {
                if (!situationalPhrases.hasOwnProperty(sit)) continue;
                var scene = situationalPhrases[sit];
                if (sit.toLowerCase().indexOf(themeLower) !== -1 ||
                    (scene.name && scene.name.toLowerCase().indexOf(themeLower) !== -1)) {
                    var phrases = scene.phrases || [];
                    for (var sp = 0; sp < phrases.length; sp++) {
                        bundle.phrases.push(phrases[sp]);
                    }
                }
            }
        }

        // Search grammar patterns
        if (typeof grammarPatterns !== "undefined") {
            for (var g = 0; g < grammarPatterns.length; g++) {
                var gp = grammarPatterns[g];
                if ((gp.name && gp.name.toLowerCase().indexOf(themeLower) !== -1) ||
                    (gp.explanation && gp.explanation.toLowerCase().indexOf(themeLower) !== -1)) {
                    bundle.patterns.push(gp);
                }
            }
        }

        // Search proverbs
        if (typeof koreanProverbs !== "undefined") {
            for (var p = 0; p < koreanProverbs.length; p++) {
                if ((koreanProverbs[p].english && koreanProverbs[p].english.toLowerCase().indexOf(themeLower) !== -1) ||
                    (koreanProverbs[p].meaning && koreanProverbs[p].meaning.toLowerCase().indexOf(themeLower) !== -1)) {
                    bundle.proverbs.push(koreanProverbs[p]);
                }
            }
        }

        // Limit results
        bundle.words = bundle.words.slice(0, 20);
        bundle.phrases = bundle.phrases.slice(0, 10);
        bundle.patterns = bundle.patterns.slice(0, 5);
        bundle.proverbs = bundle.proverbs.slice(0, 5);

        return bundle;
    },

    getCrossContentQuiz: function (difficulty) {
        difficulty = difficulty || "medium";
        var questions = [];
        var allWords = WordAnalyzer._getAllWords();

        // Type 1: Which proverb contains this word?
        if (typeof koreanProverbs !== "undefined" && koreanProverbs.length > 0) {
            for (var p = 0; p < Math.min(koreanProverbs.length, 20); p++) {
                var proverb = koreanProverbs[p];
                var syllables = WordAnalyzer._getSyllables(proverb.korean);
                if (syllables.length >= 3) {
                    // Find a word that appears in this proverb
                    for (var w = 0; w < allWords.length; w++) {
                        if (proverb.korean.indexOf(allWords[w].korean) !== -1 && allWords[w].korean.length >= 2) {
                            var wrongProverbs = [];
                            for (var wp = 0; wp < koreanProverbs.length && wrongProverbs.length < 3; wp++) {
                                if (wp !== p && koreanProverbs[wp].korean.indexOf(allWords[w].korean) === -1) {
                                    wrongProverbs.push(koreanProverbs[wp].korean);
                                }
                            }
                            if (wrongProverbs.length >= 3) {
                                questions.push({
                                    question: "Which proverb contains '" + allWords[w].korean + "' (" + allWords[w].english + ")?",
                                    options: [proverb.korean].concat(wrongProverbs),
                                    answer: proverb.korean,
                                    sources: ["wordDatabase", "koreanProverbs"],
                                    type: "proverb-word"
                                });
                            }
                            break;
                        }
                    }
                }
            }
        }

        // Type 2: What does this K-drama quote mean?
        if (typeof kdramaQuotes !== "undefined" && kdramaQuotes.length >= 4) {
            for (var dq = 0; dq < Math.min(kdramaQuotes.length, 15); dq++) {
                var quote = kdramaQuotes[dq];
                var wrongAnswers = [];
                for (var wq = 0; wq < kdramaQuotes.length && wrongAnswers.length < 3; wq++) {
                    if (wq !== dq) wrongAnswers.push(kdramaQuotes[wq].english);
                }
                if (wrongAnswers.length >= 3) {
                    questions.push({
                        question: 'What does this K-drama quote mean?\n"' + quote.korean + '"\n(' + quote.drama + ')',
                        options: [quote.english].concat(wrongAnswers),
                        answer: quote.english,
                        sources: ["kdramaQuotes"],
                        type: "quote-meaning"
                    });
                }
            }
        }

        // Type 3: Grammar pattern identification
        if (typeof grammarPatterns !== "undefined" && grammarPatterns.length >= 4) {
            for (var gi = 0; gi < Math.min(grammarPatterns.length, 10); gi++) {
                var gp = grammarPatterns[gi];
                if (gp.examples && gp.examples.length > 0) {
                    var example = gp.examples[0];
                    var wrongPatterns = [];
                    for (var wg = 0; wg < grammarPatterns.length && wrongPatterns.length < 3; wg++) {
                        if (wg !== gi) wrongPatterns.push(grammarPatterns[wg].pattern + " (" + grammarPatterns[wg].name + ")");
                    }
                    if (wrongPatterns.length >= 3) {
                        questions.push({
                            question: "Which grammar pattern is used in: " + example.conjugated + " (" + example.english + ")?",
                            options: [gp.pattern + " (" + gp.name + ")"].concat(wrongPatterns),
                            answer: gp.pattern + " (" + gp.name + ")",
                            sources: ["grammarPatterns"],
                            type: "grammar-identify"
                        });
                    }
                }
            }
        }

        // Shuffle and return based on difficulty
        var maxQ = difficulty === "easy" ? 5 : difficulty === "hard" ? 15 : 10;

        // Shuffle questions
        for (var si = questions.length - 1; si > 0; si--) {
            var sj = Math.floor(Math.random() * (si + 1));
            var tmp = questions[si];
            questions[si] = questions[sj];
            questions[sj] = tmp;
        }

        // Shuffle each question's options
        for (var qi = 0; qi < questions.length; qi++) {
            var opts = questions[qi].options;
            for (var oi = opts.length - 1; oi > 0; oi--) {
                var oj = Math.floor(Math.random() * (oi + 1));
                var ot = opts[oi];
                opts[oi] = opts[oj];
                opts[oj] = ot;
            }
        }

        return questions.slice(0, maxQ);
    }
};


// ============================================================
// 5. showSmartDashboard - Main analytics UI
// ============================================================

function showSmartDashboard(c) {
    var gs = (typeof gameState !== "undefined") ? gameState : {};
    var velocity = LearningProfile.getLearningVelocity();
    var streak = LearningProfile.getStudyStreak();
    var strengths = LearningProfile.getStrengths();
    var weaknesses = LearningProfile.getWeaknesses();
    var plan = LearningProfile.getOptimalStudyPlan();
    var wotd = SmartRecommender.getWordOfTheDay();
    var challenge = SmartRecommender.getDailyChallenge();
    var recMode = SmartRecommender.getRecommendedMode();

    var h = '<h2 class="game-title">Smart Dashboard</h2>';

    // Profile summary row
    h += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px">';
    h += '<div class="stat-item"><div class="stat-value">' + (gs.level || 1) + '</div><div class="stat-label">LEVEL</div></div>';
    h += '<div class="stat-item"><div class="stat-value">' + (velocity.wordsPerDay || 0) + '</div><div class="stat-label">SESSIONS/DAY</div></div>';
    h += '<div class="stat-item"><div class="stat-value">' + streak.currentStreak + '</div><div class="stat-label">DAY STREAK</div></div>';
    h += '<div class="stat-item"><div class="stat-value">';
    var trendIcon = velocity.trend === "accelerating" ? "^" : velocity.trend === "declining" ? "v" : "-";
    var trendColor = velocity.trend === "accelerating" ? "var(--neon-cyan)" : velocity.trend === "declining" ? "var(--fire)" : "var(--gold)";
    h += '<span style="color:' + trendColor + '">' + trendIcon + '</span>';
    h += '</div><div class="stat-label">' + (velocity.trend || "N/A").toUpperCase() + '</div></div>';
    h += '</div>';

    // Daily challenge banner
    h += '<div style="background:linear-gradient(135deg,rgba(255,107,53,0.2),rgba(255,215,0,0.2));border:1px solid rgba(255,215,0,0.3);padding:15px;border-radius:15px;margin-bottom:20px;cursor:pointer" id="smartChallengeBtn">';
    h += '<div style="display:flex;justify-content:space-between;align-items:center">';
    h += '<div><div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;color:var(--gold);margin-bottom:5px">DAILY CHALLENGE</div>';
    h += '<div style="font-weight:bold">' + escapeHtml(challenge.title) + '</div>';
    h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.6)">' + escapeHtml(challenge.description) + '</div></div>';
    h += '<div style="font-size:2rem;opacity:0.6">!</div></div></div>';

    // Word of the day
    if (wotd && wotd.word) {
        h += '<div style="background:linear-gradient(135deg,rgba(157,78,221,0.2),rgba(0,212,255,0.2));border:1px solid rgba(157,78,221,0.3);padding:20px;border-radius:15px;margin-bottom:20px">';
        h += '<div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;color:var(--neon-purple);margin-bottom:8px">WORD OF THE DAY</div>';
        h += '<div style="display:flex;justify-content:space-between;align-items:center">';
        h += '<div>';
        h += '<div style="font-size:2rem;margin-bottom:5px">' + escapeHtml(wotd.word.korean) + '</div>';
        h += '<div style="color:rgba(255,255,255,0.7)">' + escapeHtml(wotd.word.romanization || "") + '</div>';
        h += '<div style="color:var(--neon-cyan)">' + escapeHtml(wotd.word.english) + '</div>';
        h += '</div>';
        h += '<div style="text-align:right">';
        h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">Difficulty: ' + wotd.difficulty + '/10</div>';
        var ctxCount = 0;
        if (wotd.context) {
            ctxCount = wotd.context.proverbs.length + wotd.context.quotes.length + wotd.context.lyrics.length +
                       wotd.context.patterns.length + wotd.context.situations.length;
        }
        if (ctxCount > 0) {
            h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">Found in ' + ctxCount + ' contexts</div>';
        }
        h += '<button class="game-btn" style="padding:8px 16px;font-size:0.8rem;margin-top:8px" id="smartExploreWotd">Explore</button>';
        h += '</div></div></div>';
    }

    // Top 3 recommendations
    h += '<div style="margin-bottom:20px">';
    h += '<div style="font-size:0.9rem;font-weight:bold;margin-bottom:10px;color:var(--neon-pink)">RECOMMENDATIONS</div>';
    for (var pi = 0; pi < Math.min(plan.length, 3); pi++) {
        var item = plan[pi];
        var prioColor = item.priority === "high" ? "var(--fire)" : item.priority === "medium" ? "var(--gold)" : "var(--neon-cyan)";
        h += '<div style="background:var(--glass);padding:12px 15px;border-radius:12px;margin-bottom:8px;border-left:3px solid ' + prioColor + ';cursor:pointer" class="smartRecItem" data-mode="' + (item.mode || "flashcards") + '">';
        h += '<div style="font-weight:bold;font-size:0.9rem">' + escapeHtml(item.action) + '</div>';
        h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">' + escapeHtml(item.reason) + '</div>';
        h += '</div>';
    }
    h += '</div>';

    // Category progress (CSS radar approximation as horizontal bars)
    h += '<div style="background:var(--glass);padding:20px;border-radius:15px;margin-bottom:20px">';
    h += '<div style="font-size:0.9rem;font-weight:bold;margin-bottom:15px;color:var(--neon-cyan)">CATEGORY PROGRESS</div>';

    var displayCount = Math.min(strengths.length, 10);
    for (var ci = 0; ci < displayCount; ci++) {
        var cat = strengths[ci];
        var catLabel = cat.category;
        if (typeof categoryNames !== "undefined" && categoryNames[cat.category]) catLabel = categoryNames[cat.category];
        var barColor = cat.percentage >= 70 ? "var(--neon-cyan)" : cat.percentage >= 30 ? "var(--neon-purple)" : "var(--fire)";

        h += '<div style="margin-bottom:8px">';
        h += '<div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:3px">';
        h += '<span>' + escapeHtml(catLabel) + '</span>';
        h += '<span style="color:rgba(255,255,255,0.5)">' + cat.collected + '/' + cat.total + ' (' + cat.percentage + '%)</span>';
        h += '</div>';
        h += '<div style="background:rgba(255,255,255,0.1);border-radius:5px;height:8px;overflow:hidden">';
        h += '<div style="height:100%;width:' + Math.max(2, cat.percentage) + '%;background:' + barColor + ';border-radius:5px;transition:width 0.5s"></div>';
        h += '</div></div>';
    }
    h += '</div>';

    // Action buttons
    h += '<div class="game-controls" style="flex-direction:column;gap:10px">';
    h += '<button class="game-btn" id="smartStartSession" style="width:100%">Start Smart Session</button>';
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">';
    h += '<button class="game-btn secondary" id="smartShowExplorer" style="font-size:0.85rem">Word Explorer</button>';
    h += '<button class="game-btn secondary" id="smartShowWeekly" style="font-size:0.85rem">Weekly Report</button>';
    h += '<button class="game-btn secondary" id="smartShowCrossQuiz" style="font-size:0.85rem">Cross Quiz</button>';
    h += '</div></div>';

    c.innerHTML = h;

    // Event bindings
    document.getElementById("smartStartSession").onclick = function () { showSmartSession(c); };
    document.getElementById("smartShowExplorer").onclick = function () { showWordExplorer(c); };
    document.getElementById("smartShowWeekly").onclick = function () { showWeeklyReport(c); };
    document.getElementById("smartShowCrossQuiz").onclick = function () { _showCrossQuizUI(c); };
    document.getElementById("smartChallengeBtn").onclick = function () {
        if (challenge.mode && typeof showMode === "function") showMode(challenge.mode);
    };

    if (document.getElementById("smartExploreWotd") && wotd && wotd.word) {
        document.getElementById("smartExploreWotd").onclick = function () {
            _showWordDetail(c, wotd.word.korean);
        };
    }

    // Recommendation clicks
    var recItems = document.querySelectorAll(".smartRecItem");
    for (var ri = 0; ri < recItems.length; ri++) {
        recItems[ri].onclick = function () {
            var mode = this.getAttribute("data-mode");
            if (mode && typeof showMode === "function") showMode(mode);
        };
    }
}


// ============================================================
// 6. showSmartSession - Personalized study session
// ============================================================

var _smartSessionState = {
    words: [],
    index: 0,
    score: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    phase: "flashcard",
    difficulty: 1,
    startTime: 0,
    answers: []
};

function showSmartSession(c) {
    var recommended = SmartRecommender.getNextWords(10);
    _smartSessionState.words = [];
    for (var i = 0; i < recommended.length; i++) {
        _smartSessionState.words.push(recommended[i].word);
    }

    if (_smartSessionState.words.length === 0) {
        // Fallback to random words
        var allW = WordAnalyzer._getAllWords();
        for (var f = allW.length - 1; f > 0; f--) {
            var j = Math.floor(Math.random() * (f + 1));
            var t = allW[f]; allW[f] = allW[j]; allW[j] = t;
        }
        _smartSessionState.words = allW.slice(0, 10);
    }

    _smartSessionState.index = 0;
    _smartSessionState.score = 0;
    _smartSessionState.correct = 0;
    _smartSessionState.wrong = 0;
    _smartSessionState.streak = 0;
    _smartSessionState.difficulty = 1;
    _smartSessionState.startTime = Date.now();
    _smartSessionState.answers = [];

    _renderSmartStep(c);
}

function _renderSmartStep(c) {
    var ss = _smartSessionState;
    if (ss.index >= ss.words.length) {
        _renderSmartSummary(c);
        return;
    }

    var word = ss.words[ss.index];
    var progress = Math.round((ss.index / ss.words.length) * 100);

    // Determine phase based on difficulty and streak
    var phases = ["flashcard", "quiz", "typing"];
    var phaseIdx = Math.min(ss.difficulty - 1, phases.length - 1);
    ss.phase = phases[phaseIdx];

    var h = '<h2 class="game-title">Smart Session</h2>';
    h += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">';
    h += '<span style="font-size:0.8rem;color:rgba(255,255,255,0.5)">Word ' + (ss.index + 1) + '/' + ss.words.length + '</span>';
    h += '<span style="font-size:0.8rem;color:rgba(255,255,255,0.5)">Score: ' + ss.score + '</span>';
    h += '<span style="font-size:0.8rem;color:' + (ss.streak >= 3 ? 'var(--fire)' : 'rgba(255,255,255,0.5)') + '">Streak: ' + ss.streak + '</span>';
    h += '</div>';
    h += '<div class="level-progress" style="margin-bottom:20px"><div class="level-bar" style="width:' + progress + '%"></div></div>';

    if (ss.phase === "flashcard") {
        h += '<div class="flashcard" id="smartFlashcard" style="cursor:pointer">';
        h += '<div class="flashcard-korean" style="font-size:3rem">' + escapeHtml(word.korean) + '</div>';
        h += '<div id="smartFlashHidden" style="display:none">';
        h += '<div class="flashcard-romanization">' + escapeHtml(word.romanization || "") + '</div>';
        h += '<div class="flashcard-english" style="font-size:1.3rem">' + escapeHtml(word.english) + '</div>';
        h += '</div>';
        h += '<div id="smartFlashPrompt" style="font-size:0.9rem;color:rgba(255,255,255,0.6);margin-top:15px">Tap to reveal</div>';
        h += '</div>';
        h += '<div class="game-controls" id="smartFlashBtns" style="display:none">';
        h += '<button class="game-btn" id="smartKnew">I knew it</button>';
        h += '<button class="game-btn secondary" id="smartDidntKnow">Didn\'t know</button>';
        h += '</div>';

    } else if (ss.phase === "quiz") {
        h += '<div style="text-align:center;font-size:2.5rem;margin:20px 0;padding:30px;background:linear-gradient(135deg,var(--neon-purple),var(--neon-pink));border-radius:20px">';
        h += escapeHtml(word.korean) + '</div>';
        h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:15px">Select the correct meaning:</p>';

        // Generate options
        var options = [word.english];
        var allW = WordAnalyzer._getAllWords();
        for (var o = allW.length - 1; o > 0; o--) {
            var oj = Math.floor(Math.random() * (o + 1));
            var ot = allW[o]; allW[o] = allW[oj]; allW[oj] = ot;
        }
        for (var oi = 0; oi < allW.length && options.length < 4; oi++) {
            if (allW[oi].english !== word.english) {
                var dup = false;
                for (var di = 0; di < options.length; di++) {
                    if (options[di] === allW[oi].english) { dup = true; break; }
                }
                if (!dup) options.push(allW[oi].english);
            }
        }
        // Shuffle options
        for (var si = options.length - 1; si > 0; si--) {
            var sj = Math.floor(Math.random() * (si + 1));
            var st = options[si]; options[si] = options[sj]; options[sj] = st;
        }

        h += '<div class="quiz-options">';
        for (var qi = 0; qi < options.length; qi++) {
            h += '<div class="quiz-option smartQuizOpt" data-answer="' + escapeHtml(options[qi]) + '">' + escapeHtml(options[qi]) + '</div>';
        }
        h += '</div>';

    } else if (ss.phase === "typing") {
        h += '<div style="text-align:center;margin:20px 0">';
        h += '<div style="font-size:1rem;color:rgba(255,255,255,0.6);margin-bottom:10px">Type the English meaning of:</div>';
        h += '<div style="font-size:2.5rem;padding:20px;background:linear-gradient(135deg,var(--neon-purple),var(--neon-pink));border-radius:20px;display:inline-block">' + escapeHtml(word.korean) + '</div>';
        h += '<div style="color:rgba(255,255,255,0.5);margin-top:8px;font-size:0.9rem">' + escapeHtml(word.romanization || "") + '</div>';
        h += '</div>';
        h += '<input type="text" class="speed-input" id="smartTypeInput" placeholder="Type English meaning..." autocomplete="off">';
        h += '<div class="game-controls" style="margin-top:15px"><button class="game-btn" id="smartTypeSubmit">Check</button></div>';
    }

    c.innerHTML = h;

    // Bind events
    if (ss.phase === "flashcard") {
        document.getElementById("smartFlashcard").onclick = function () {
            document.getElementById("smartFlashHidden").style.display = "block";
            document.getElementById("smartFlashPrompt").style.display = "none";
            document.getElementById("smartFlashBtns").style.display = "flex";
            if (typeof speakKorean === "function") speakKorean(word.korean);
        };
        var knewBtn = document.getElementById("smartKnew");
        var didntBtn = document.getElementById("smartDidntKnow");
        if (knewBtn) knewBtn.onclick = function () { _smartAnswer(c, true); };
        if (didntBtn) didntBtn.onclick = function () { _smartAnswer(c, false); };

    } else if (ss.phase === "quiz") {
        var opts = document.querySelectorAll(".smartQuizOpt");
        for (var bo = 0; bo < opts.length; bo++) {
            opts[bo].onclick = function () {
                if (this.classList.contains("correct") || this.classList.contains("wrong")) return;
                var isCorrect = this.getAttribute("data-answer") === word.english;
                this.classList.add(isCorrect ? "correct" : "wrong");
                if (!isCorrect) {
                    // Highlight correct
                    var allOpts = document.querySelectorAll(".smartQuizOpt");
                    for (var ao = 0; ao < allOpts.length; ao++) {
                        if (allOpts[ao].getAttribute("data-answer") === word.english) {
                            allOpts[ao].classList.add("correct");
                        }
                    }
                }
                setTimeout(function () { _smartAnswer(c, isCorrect); }, 800);
            };
        }

    } else if (ss.phase === "typing") {
        var typeInput = document.getElementById("smartTypeInput");
        if (typeInput) typeInput.focus();
        var submitFn = function () {
            var val = (document.getElementById("smartTypeInput").value || "").trim().toLowerCase();
            var correct = word.english.toLowerCase();
            var isCorrect = val === correct || correct.indexOf(val) === 0 && val.length >= 3;
            _smartAnswer(c, isCorrect);
        };
        document.getElementById("smartTypeSubmit").onclick = submitFn;
        if (typeInput) {
            typeInput.onkeydown = function (e) {
                if (e.key === "Enter") submitFn();
            };
        }
    }
}

function _smartAnswer(c, isCorrect) {
    var ss = _smartSessionState;
    var word = ss.words[ss.index];

    ss.answers.push({ word: word, correct: isCorrect, phase: ss.phase });

    if (isCorrect) {
        ss.correct++;
        ss.streak++;
        ss.score += (10 * ss.difficulty);
        if (typeof addXP === "function") addXP(5 * ss.difficulty);
        if (typeof addCombo === "function") addCombo();
        if (typeof collectWord === "function") collectWord(word);
        if (typeof SoundEngine !== "undefined" && SoundEngine.correct) SoundEngine.correct();

        // Difficulty ramp: 3 correct in a row -> increase
        if (ss.streak >= 3 && ss.streak % 3 === 0) {
            ss.difficulty = Math.min(3, ss.difficulty + 1);
        }
    } else {
        ss.wrong++;
        ss.streak = 0;
        ss.difficulty = Math.max(1, ss.difficulty - 1);
        if (typeof resetCombo === "function") resetCombo();
        if (typeof trackWeakWord === "function") trackWeakWord(word);
        if (typeof SoundEngine !== "undefined" && SoundEngine.wrong) SoundEngine.wrong();

        // Show context hint for wrong answers
        var context = DataCombiner.findWordInContext(word.korean);
        if (context.proverbs.length > 0 || context.quotes.length > 0 || context.situations.length > 0) {
            _showContextHint(c, word, context);
            return;
        }
    }

    ss.index++;
    _renderSmartStep(c);
}

function _showContextHint(c, word, context) {
    var h = '<div style="text-align:center;padding:20px">';
    h += '<div style="font-size:1.5rem;color:var(--fire);margin-bottom:15px">Not quite!</div>';
    h += '<div style="font-size:2rem;margin-bottom:5px">' + escapeHtml(word.korean) + '</div>';
    h += '<div style="color:var(--neon-cyan);font-size:1.2rem;margin-bottom:20px">' + escapeHtml(word.english) + '</div>';

    h += '<div class="learning-tip">';
    h += '<div style="font-weight:bold;margin-bottom:8px">Remember it with context:</div>';

    if (context.proverbs.length > 0) {
        h += '<div style="margin-bottom:8px"><span style="color:var(--gold)">Proverb:</span> ' + escapeHtml(context.proverbs[0].korean) + '</div>';
        h += '<div style="font-size:0.85rem;color:rgba(255,255,255,0.6)">' + escapeHtml(context.proverbs[0].meaning || context.proverbs[0].english) + '</div>';
    } else if (context.quotes.length > 0) {
        h += '<div style="margin-bottom:8px"><span style="color:var(--gold)">K-Drama (' + escapeHtml(context.quotes[0].drama) + '):</span></div>';
        h += '<div style="font-size:0.9rem">' + escapeHtml(context.quotes[0].korean) + '</div>';
    } else if (context.situations.length > 0) {
        h += '<div style="margin-bottom:8px"><span style="color:var(--gold)">' + escapeHtml(context.situations[0].scene) + ':</span></div>';
        h += '<div style="font-size:0.9rem">' + escapeHtml(context.situations[0].phrase.korean) + '</div>';
    }
    h += '</div>';

    h += '<button class="game-btn" id="smartHintContinue" style="margin-top:15px">Continue</button>';
    h += '</div>';

    c.innerHTML = h;
    document.getElementById("smartHintContinue").onclick = function () {
        _smartSessionState.index++;
        _renderSmartStep(c);
    };
}

function _renderSmartSummary(c) {
    var ss = _smartSessionState;
    var duration = Math.round((Date.now() - ss.startTime) / 1000);
    var accuracy = ss.words.length > 0 ? Math.round((ss.correct / ss.words.length) * 100) : 0;

    // Record stats
    if (typeof recordStudyStat === "function") {
        recordStudyStat("smartSession", ss.score, duration);
    }

    var h = '<h2 class="game-title">Session Complete!</h2>';
    h += '<div style="text-align:center;margin-bottom:20px">';
    h += '<div style="font-size:3rem;color:var(--gold);margin:15px 0">' + ss.score + ' pts</div>';
    h += '</div>';

    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:25px">';
    h += '<div class="stat-item"><div class="stat-value" style="color:var(--neon-cyan)">' + ss.correct + '</div><div class="stat-label">CORRECT</div></div>';
    h += '<div class="stat-item"><div class="stat-value" style="color:var(--fire)">' + ss.wrong + '</div><div class="stat-label">WRONG</div></div>';
    h += '<div class="stat-item"><div class="stat-value">' + accuracy + '%</div><div class="stat-label">ACCURACY</div></div>';
    h += '</div>';

    // Word-by-word breakdown
    h += '<div style="background:var(--glass);padding:15px;border-radius:15px;margin-bottom:20px">';
    h += '<div style="font-weight:bold;margin-bottom:10px">Word Breakdown</div>';
    for (var i = 0; i < ss.answers.length; i++) {
        var ans = ss.answers[i];
        var icon = ans.correct ? '<span style="color:var(--neon-cyan)">O</span>' : '<span style="color:var(--fire)">X</span>';
        h += '<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.05)">';
        h += '<span>' + icon + ' ' + escapeHtml(ans.word.korean) + '</span>';
        h += '<span style="color:rgba(255,255,255,0.5);font-size:0.85rem">' + escapeHtml(ans.word.english) + '</span>';
        h += '</div>';
    }
    h += '</div>';

    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="smartAgainBtn">New Session</button>';
    h += '<button class="game-btn secondary" id="smartDashBtn">Dashboard</button>';
    h += '</div>';

    c.innerHTML = h;
    if (typeof createConfetti === "function") createConfetti(40);

    document.getElementById("smartAgainBtn").onclick = function () { showSmartSession(c); };
    document.getElementById("smartDashBtn").onclick = function () { showSmartDashboard(c); };
}


// ============================================================
// 7. showWordExplorer - Deep word analysis view
// ============================================================

function showWordExplorer(c) {
    var h = '<h2 class="game-title">Word Explorer</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:20px">Search any word to discover connections and context</p>';

    h += '<div style="display:flex;gap:10px;margin-bottom:20px">';
    h += '<input type="text" class="speed-input" id="explorerSearch" placeholder="Type Korean or English..." style="flex:1;text-align:left">';
    h += '<button class="game-btn" id="explorerSearchBtn">Search</button>';
    h += '</div>';

    // Quick picks from different categories
    h += '<div style="margin-bottom:20px">';
    h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.5);margin-bottom:8px">Quick picks:</div>';
    h += '<div style="display:flex;flex-wrap:wrap;gap:6px">';
    var picks = _getQuickPicks();
    for (var p = 0; p < picks.length; p++) {
        h += '<button class="cat-btn explorerPick" data-word="' + escapeHtml(picks[p].korean) + '">' + escapeHtml(picks[p].korean) + ' (' + escapeHtml(picks[p].english) + ')</button>';
    }
    h += '</div></div>';

    h += '<div id="explorerResults"></div>';

    h += '<div style="margin-top:20px"><button class="game-btn secondary" id="explorerBackBtn" style="width:100%">Back to Dashboard</button></div>';

    c.innerHTML = h;

    var searchFn = function () {
        var query = (document.getElementById("explorerSearch").value || "").trim();
        if (query.length > 0) _doExplorerSearch(query);
    };

    document.getElementById("explorerSearchBtn").onclick = searchFn;
    document.getElementById("explorerSearch").onkeydown = function (e) {
        if (e.key === "Enter") searchFn();
    };
    document.getElementById("explorerBackBtn").onclick = function () { showSmartDashboard(c); };

    var pickBtns = document.querySelectorAll(".explorerPick");
    for (var pb = 0; pb < pickBtns.length; pb++) {
        pickBtns[pb].onclick = function () {
            var word = this.getAttribute("data-word");
            document.getElementById("explorerSearch").value = word;
            _doExplorerSearch(word);
        };
    }
}

function _getQuickPicks() {
    var picks = [];
    var allWords = WordAnalyzer._getAllWords();
    if (allWords.length === 0) return picks;

    // One from each of a few categories
    var seenCats = {};
    var dayNum = Math.floor(Date.now() / 86400000);
    for (var i = 0; i < allWords.length && picks.length < 8; i++) {
        var idx = (i + dayNum) % allWords.length;
        var w = allWords[idx];
        if (w.category && !seenCats[w.category]) {
            seenCats[w.category] = true;
            picks.push(w);
        }
    }
    return picks;
}

function _doExplorerSearch(query) {
    var resultsDiv = document.getElementById("explorerResults");
    if (!resultsDiv) return;

    var allWords = WordAnalyzer._getAllWords();
    var matches = [];

    for (var i = 0; i < allWords.length; i++) {
        var w = allWords[i];
        if (w.korean === query || w.english.toLowerCase() === query.toLowerCase()) {
            matches.unshift(w); // Exact match first
        } else if (w.korean.indexOf(query) !== -1 || w.english.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
            matches.push(w);
        }
    }

    if (matches.length === 0) {
        resultsDiv.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.5)">No words found for "' + escapeHtml(query) + '"</p>';
        return;
    }

    if (matches.length === 1) {
        _renderWordDetail(resultsDiv, matches[0]);
        return;
    }

    // Show list of matches
    var h = '<div style="font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:10px">' + matches.length + ' results found:</div>';
    var showCount = Math.min(matches.length, 20);
    for (var m = 0; m < showCount; m++) {
        h += '<div class="explorerResultItem" data-word="' + escapeHtml(matches[m].korean) + '" style="background:var(--glass);padding:10px 15px;border-radius:10px;margin-bottom:6px;cursor:pointer;display:flex;justify-content:space-between;align-items:center">';
        h += '<span style="font-size:1.1rem">' + escapeHtml(matches[m].korean) + '</span>';
        h += '<span style="color:rgba(255,255,255,0.5);font-size:0.85rem">' + escapeHtml(matches[m].english) + '</span>';
        h += '</div>';
    }
    resultsDiv.innerHTML = h;

    var resultItems = resultsDiv.querySelectorAll(".explorerResultItem");
    for (var ri = 0; ri < resultItems.length; ri++) {
        resultItems[ri].onclick = function () {
            var korean = this.getAttribute("data-word");
            _doExplorerSearch(korean);
        };
    }
}

function _renderWordDetail(container, word) {
    var related = WordAnalyzer.findRelatedWords(word.korean);
    var context = DataCombiner.findWordInContext(word.korean);
    var difficulty = WordAnalyzer.getWordDifficulty(word);
    var minPairs = WordAnalyzer.findMinimalPairMatches(word.korean);
    var path = DataCombiner.buildLearningPath(word, 4);

    var h = '';

    // Main word card
    h += '<div style="background:linear-gradient(135deg,var(--neon-purple),var(--neon-pink));padding:25px;border-radius:20px;text-align:center;margin-bottom:20px">';
    h += '<div style="font-size:3rem;margin-bottom:8px">' + escapeHtml(word.korean) + '</div>';
    h += '<div style="font-size:1rem;color:rgba(255,255,255,0.8)">' + escapeHtml(word.romanization || "") + '</div>';
    h += '<div style="font-size:1.2rem;margin-top:5px">' + escapeHtml(word.english) + '</div>';
    h += '<div style="margin-top:10px;display:flex;justify-content:center;gap:10px">';
    h += '<span class="rarity-' + (word.rarity || "common") + '" style="padding:4px 10px;border-radius:10px;font-size:0.75rem">' + escapeHtml(word.rarity || "common") + '</span>';
    h += '<span style="background:rgba(0,0,0,0.3);padding:4px 10px;border-radius:10px;font-size:0.75rem">Difficulty: ' + difficulty + '/10</span>';
    if (word.category) h += '<span style="background:rgba(0,0,0,0.3);padding:4px 10px;border-radius:10px;font-size:0.75rem">' + escapeHtml(word.category) + '</span>';
    h += '</div>';
    h += '<button class="game-btn" style="margin-top:12px;padding:6px 18px;font-size:0.85rem" onclick="if(typeof speakKorean===\'function\')speakKorean(\'' + escapeHtml(word.korean) + '\')">Listen</button>';
    h += '</div>';

    // Context: where this word appears
    var hasContext = context.proverbs.length + context.quotes.length + context.lyrics.length +
                    context.patterns.length + context.situations.length + context.memes.length;
    if (hasContext > 0) {
        h += '<div style="background:var(--glass);padding:15px;border-radius:15px;margin-bottom:15px">';
        h += '<div style="font-weight:bold;color:var(--neon-cyan);margin-bottom:10px">Found in Context (' + hasContext + ')</div>';

        if (context.proverbs.length > 0) {
            h += '<div style="margin-bottom:10px"><div style="font-size:0.75rem;color:var(--gold);text-transform:uppercase;margin-bottom:5px">Proverbs</div>';
            for (var cp = 0; cp < Math.min(context.proverbs.length, 3); cp++) {
                h += '<div style="padding:8px;background:rgba(255,215,0,0.1);border-radius:8px;margin-bottom:4px;font-size:0.9rem">';
                h += escapeHtml(context.proverbs[cp].korean);
                h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">' + escapeHtml(context.proverbs[cp].meaning || context.proverbs[cp].english) + '</div>';
                h += '</div>';
            }
            h += '</div>';
        }

        if (context.quotes.length > 0) {
            h += '<div style="margin-bottom:10px"><div style="font-size:0.75rem;color:var(--neon-pink);text-transform:uppercase;margin-bottom:5px">K-Drama Quotes</div>';
            for (var cq = 0; cq < Math.min(context.quotes.length, 3); cq++) {
                h += '<div style="padding:8px;background:rgba(255,45,149,0.1);border-radius:8px;margin-bottom:4px;font-size:0.9rem">';
                h += '"' + escapeHtml(context.quotes[cq].korean) + '"';
                h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">- ' + escapeHtml(context.quotes[cq].drama || "") + '</div>';
                h += '</div>';
            }
            h += '</div>';
        }

        if (context.situations.length > 0) {
            h += '<div style="margin-bottom:10px"><div style="font-size:0.75rem;color:var(--neon-blue);text-transform:uppercase;margin-bottom:5px">Situational Phrases</div>';
            for (var cs = 0; cs < Math.min(context.situations.length, 3); cs++) {
                h += '<div style="padding:8px;background:rgba(0,212,255,0.1);border-radius:8px;margin-bottom:4px;font-size:0.9rem">';
                h += escapeHtml(context.situations[cs].phrase.korean);
                h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">' + escapeHtml(context.situations[cs].scene) + ': ' + escapeHtml(context.situations[cs].phrase.english) + '</div>';
                h += '</div>';
            }
            h += '</div>';
        }

        if (context.patterns.length > 0) {
            h += '<div><div style="font-size:0.75rem;color:var(--neon-purple);text-transform:uppercase;margin-bottom:5px">Grammar Patterns</div>';
            for (var cgp = 0; cgp < Math.min(context.patterns.length, 2); cgp++) {
                h += '<div style="padding:8px;background:rgba(157,78,221,0.1);border-radius:8px;margin-bottom:4px;font-size:0.9rem">';
                h += escapeHtml(context.patterns[cgp].pattern) + ' - ' + escapeHtml(context.patterns[cgp].name);
                h += '</div>';
            }
            h += '</div>';
        }
        h += '</div>';
    }

    // Related words
    if (related.length > 0) {
        h += '<div style="background:var(--glass);padding:15px;border-radius:15px;margin-bottom:15px">';
        h += '<div style="font-weight:bold;color:var(--neon-pink);margin-bottom:10px">Related Words (' + related.length + ')</div>';
        h += '<div style="display:flex;flex-wrap:wrap;gap:6px">';
        for (var rw = 0; rw < related.length; rw++) {
            h += '<button class="cat-btn explorerRelated" data-word="' + escapeHtml(related[rw].word.korean) + '" title="' + escapeHtml(related[rw].reason) + '">';
            h += escapeHtml(related[rw].word.korean) + ' <span style="font-size:0.7rem;opacity:0.7">' + escapeHtml(related[rw].word.english) + '</span>';
            h += '</button>';
        }
        h += '</div></div>';
    }

    // Learning path
    if (path.length > 1) {
        h += '<div style="background:var(--glass);padding:15px;border-radius:15px;margin-bottom:15px">';
        h += '<div style="font-weight:bold;color:var(--gold);margin-bottom:10px">Learning Path</div>';
        for (var lp = 0; lp < path.length; lp++) {
            var step = path[lp];
            h += '<div style="display:flex;align-items:center;margin-bottom:8px">';
            h += '<div style="width:24px;height:24px;background:var(--neon-purple);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:bold;flex-shrink:0">' + step.step + '</div>';
            h += '<div style="flex:1;margin-left:10px">';
            h += '<span style="font-weight:bold">' + escapeHtml(step.word.korean) + '</span> - ' + escapeHtml(step.word.english);
            if (step.sampleContext) {
                h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.4);margin-top:2px">' + (step.contexts.proverbs + step.contexts.quotes + step.contexts.situations) + ' contexts found</div>';
            }
            h += '</div></div>';
            if (lp < path.length - 1) {
                h += '<div style="width:2px;height:15px;background:rgba(157,78,221,0.3);margin-left:11px"></div>';
            }
        }
        h += '</div>';
    }

    // Minimal pairs
    if (minPairs.length > 0) {
        h += '<div style="background:var(--glass);padding:15px;border-radius:15px;margin-bottom:15px">';
        h += '<div style="font-weight:bold;color:var(--neon-blue);margin-bottom:10px">Similar Sounding Words</div>';
        for (var mp = 0; mp < Math.min(minPairs.length, 5); mp++) {
            h += '<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.05)">';
            h += '<span class="explorerRelated" data-word="' + escapeHtml(minPairs[mp].word.korean) + '" style="cursor:pointer">' + escapeHtml(minPairs[mp].word.korean) + '</span>';
            h += '<span style="color:rgba(255,255,255,0.5);font-size:0.85rem">' + escapeHtml(minPairs[mp].word.english) + '</span>';
            h += '</div>';
        }
        h += '</div>';
    }

    container.innerHTML = h;

    // Bind related word clicks
    var relBtns = container.querySelectorAll(".explorerRelated");
    for (var rb = 0; rb < relBtns.length; rb++) {
        relBtns[rb].onclick = function () {
            var w = this.getAttribute("data-word");
            document.getElementById("explorerSearch").value = w;
            _doExplorerSearch(w);
        };
    }
}

function _showWordDetail(c, korean) {
    showWordExplorer(c);
    setTimeout(function () {
        var searchInput = document.getElementById("explorerSearch");
        if (searchInput) {
            searchInput.value = korean;
            _doExplorerSearch(korean);
        }
    }, 100);
}


// ============================================================
// 8. showWeeklyReport - Weekly learning report
// ============================================================

function showWeeklyReport(c) {
    var stats = [];
    try { stats = JSON.parse(localStorage.getItem("dailyStudyStats") || "[]"); } catch (e) {}

    var gs = (typeof gameState !== "undefined") ? gameState : {};
    var now = Date.now();
    var oneWeekAgo = now - 7 * 86400000;
    var twoWeeksAgo = now - 14 * 86400000;

    // This week vs last week
    var thisWeek = { sessions: 0, score: 0, duration: 0, modes: {}, dates: {} };
    var lastWeek = { sessions: 0, score: 0, duration: 0, modes: {}, dates: {} };

    for (var i = 0; i < stats.length; i++) {
        var s = stats[i];
        var ts = s.timestamp || new Date(s.date).getTime();
        var target = null;
        if (ts >= oneWeekAgo) {
            target = thisWeek;
        } else if (ts >= twoWeeksAgo) {
            target = lastWeek;
        }
        if (target) {
            target.sessions++;
            target.score += (s.score || 0);
            target.duration += (s.duration || 0);
            target.modes[s.mode || "unknown"] = (target.modes[s.mode || "unknown"] || 0) + 1;
            target.dates[s.date] = (target.dates[s.date] || 0) + 1;
        }
    }

    var h = '<h2 class="game-title">Weekly Report</h2>';

    // Summary comparison
    h += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px">';

    var sessionsDiff = thisWeek.sessions - lastWeek.sessions;
    var scoreDiff = thisWeek.score - lastWeek.score;

    h += '<div class="stat-item"><div class="stat-value">' + thisWeek.sessions + '</div>';
    h += '<div class="stat-label">SESSIONS</div>';
    h += '<div style="font-size:0.7rem;color:' + (sessionsDiff >= 0 ? 'var(--neon-cyan)' : 'var(--fire)') + '">';
    h += (sessionsDiff >= 0 ? '+' : '') + sessionsDiff + ' vs last week</div></div>';

    h += '<div class="stat-item"><div class="stat-value">' + thisWeek.score + '</div>';
    h += '<div class="stat-label">TOTAL SCORE</div>';
    h += '<div style="font-size:0.7rem;color:' + (scoreDiff >= 0 ? 'var(--neon-cyan)' : 'var(--fire)') + '">';
    h += (scoreDiff >= 0 ? '+' : '') + scoreDiff + ' vs last week</div></div>';

    var activeDays = 0;
    for (var dd in thisWeek.dates) { if (thisWeek.dates.hasOwnProperty(dd)) activeDays++; }
    h += '<div class="stat-item"><div class="stat-value">' + activeDays + '/7</div>';
    h += '<div class="stat-label">ACTIVE DAYS</div></div>';
    h += '</div>';

    // Daily activity chart (CSS bars)
    h += '<div style="background:var(--glass);padding:20px;border-radius:15px;margin-bottom:20px">';
    h += '<div style="font-weight:bold;color:var(--neon-cyan);margin-bottom:15px">Daily Activity</div>';
    h += '<div style="display:flex;align-items:flex-end;justify-content:space-between;height:120px;gap:4px">';

    var dayLabels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    var today = new Date();
    var maxSessions = 1;

    // Collect data for each of the last 7 days
    var dailyData = [];
    for (var d = 6; d >= 0; d--) {
        var dayDate = new Date(today);
        dayDate.setDate(dayDate.getDate() - d);
        var dateStr = dayDate.toISOString().slice(0, 10);
        var count = thisWeek.dates[dateStr] || 0;
        if (count > maxSessions) maxSessions = count;
        dailyData.push({ date: dateStr, count: count, dayName: dayLabels[dayDate.getDay() === 0 ? 6 : dayDate.getDay() - 1] });
    }

    for (var bd = 0; bd < dailyData.length; bd++) {
        var barHeight = dailyData[bd].count > 0 ? Math.max(10, Math.round((dailyData[bd].count / maxSessions) * 100)) : 5;
        var barColor = dailyData[bd].count > 0 ? "var(--neon-purple)" : "rgba(255,255,255,0.1)";
        h += '<div style="flex:1;text-align:center">';
        h += '<div style="height:100px;display:flex;align-items:flex-end;justify-content:center">';
        h += '<div style="width:100%;max-width:30px;height:' + barHeight + '%;background:' + barColor + ';border-radius:4px 4px 0 0;position:relative">';
        if (dailyData[bd].count > 0) {
            h += '<div style="position:absolute;top:-18px;width:100%;text-align:center;font-size:0.7rem;color:var(--neon-cyan)">' + dailyData[bd].count + '</div>';
        }
        h += '</div></div>';
        h += '<div style="font-size:0.65rem;color:rgba(255,255,255,0.5);margin-top:5px">' + dailyData[bd].dayName + '</div>';
        h += '</div>';
    }
    h += '</div></div>';

    // Modes played
    var modeKeys = [];
    for (var mk in thisWeek.modes) {
        if (thisWeek.modes.hasOwnProperty(mk)) modeKeys.push({ mode: mk, count: thisWeek.modes[mk] });
    }
    modeKeys.sort(function (a, b) { return b.count - a.count; });

    if (modeKeys.length > 0) {
        h += '<div style="background:var(--glass);padding:15px;border-radius:15px;margin-bottom:20px">';
        h += '<div style="font-weight:bold;color:var(--neon-pink);margin-bottom:10px">Modes Played</div>';
        var totalModeSessions = thisWeek.sessions || 1;
        for (var mi = 0; mi < Math.min(modeKeys.length, 6); mi++) {
            var modePct = Math.round((modeKeys[mi].count / totalModeSessions) * 100);
            h += '<div style="margin-bottom:8px">';
            h += '<div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:3px">';
            h += '<span>' + escapeHtml(modeKeys[mi].mode) + '</span>';
            h += '<span style="color:rgba(255,255,255,0.5)">' + modeKeys[mi].count + ' sessions (' + modePct + '%)</span>';
            h += '</div>';
            h += '<div style="background:rgba(255,255,255,0.1);border-radius:5px;height:6px;overflow:hidden">';
            h += '<div style="height:100%;width:' + modePct + '%;background:var(--neon-pink);border-radius:5px"></div>';
            h += '</div></div>';
        }
        h += '</div>';
    }

    // Recommendations for next week
    h += '<div style="background:var(--glass);padding:15px;border-radius:15px;margin-bottom:20px">';
    h += '<div style="font-weight:bold;color:var(--gold);margin-bottom:10px">Next Week Recommendations</div>';

    var plan = LearningProfile.getOptimalStudyPlan();
    for (var pi = 0; pi < Math.min(plan.length, 3); pi++) {
        h += '<div style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05)">';
        h += '<div style="font-size:0.9rem">' + escapeHtml(plan[pi].action) + '</div>';
        h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.4)">' + escapeHtml(plan[pi].reason) + '</div>';
        h += '</div>';
    }
    h += '</div>';

    // Prediction
    var prediction = LearningProfile.predictLevel(7);
    if (prediction.predictedLevel > prediction.currentLevel) {
        h += '<div style="background:linear-gradient(135deg,rgba(0,245,212,0.15),rgba(0,212,255,0.15));border:1px solid rgba(0,245,212,0.3);padding:15px;border-radius:15px;margin-bottom:20px;text-align:center">';
        h += '<div style="font-size:0.8rem;color:var(--neon-cyan)">At your current pace, you\'ll reach Level ' + prediction.predictedLevel + ' in about a week!</div>';
        h += '</div>';
    }

    h += '<div class="game-controls">';
    h += '<button class="game-btn secondary" id="weeklyBackBtn" style="width:100%">Back to Dashboard</button>';
    h += '</div>';

    c.innerHTML = h;
    document.getElementById("weeklyBackBtn").onclick = function () { showSmartDashboard(c); };
}


// ============================================================
// Cross-Content Quiz UI (helper for dashboard button)
// ============================================================

function _showCrossQuizUI(c) {
    var questions = DataCombiner.getCrossContentQuiz("medium");
    if (questions.length === 0) {
        c.innerHTML = '<h2 class="game-title">Cross-Content Quiz</h2><p style="text-align:center;color:rgba(255,255,255,0.6)">Not enough content data loaded for quiz generation.</p>' +
            '<button class="game-btn secondary" id="crossQuizBack" style="margin-top:20px;display:block;margin-left:auto;margin-right:auto">Back</button>';
        document.getElementById("crossQuizBack").onclick = function () { showSmartDashboard(c); };
        return;
    }

    var state = { index: 0, score: 0, correct: 0, questions: questions };
    _renderCrossQuestion(c, state);
}

function _renderCrossQuestion(c, state) {
    if (state.index >= state.questions.length) {
        _renderCrossResult(c, state);
        return;
    }

    var q = state.questions[state.index];
    var progress = Math.round((state.index / state.questions.length) * 100);

    var h = '<h2 class="game-title">Cross-Content Quiz</h2>';
    h += '<div style="display:flex;justify-content:space-between;font-size:0.8rem;color:rgba(255,255,255,0.5);margin-bottom:8px">';
    h += '<span>Question ' + (state.index + 1) + '/' + state.questions.length + '</span>';
    h += '<span>Score: ' + state.score + '</span></div>';
    h += '<div class="level-progress" style="margin-bottom:20px"><div class="level-bar" style="width:' + progress + '%"></div></div>';

    h += '<div style="background:var(--glass);padding:20px;border-radius:15px;margin-bottom:20px">';
    h += '<div style="font-size:1.1rem;white-space:pre-wrap">' + escapeHtml(q.question) + '</div>';
    h += '<div style="font-size:0.7rem;color:rgba(255,255,255,0.3);margin-top:8px">Sources: ' + (q.sources || []).join(", ") + '</div>';
    h += '</div>';

    h += '<div class="quiz-options">';
    for (var oi = 0; oi < q.options.length; oi++) {
        h += '<div class="quiz-option crossQuizOpt" data-answer="' + escapeHtml(q.options[oi]) + '" style="font-size:0.9rem">' + escapeHtml(q.options[oi]) + '</div>';
    }
    h += '</div>';

    c.innerHTML = h;

    var opts = document.querySelectorAll(".crossQuizOpt");
    for (var bo = 0; bo < opts.length; bo++) {
        opts[bo].onclick = function () {
            if (this.classList.contains("correct") || this.classList.contains("wrong")) return;
            var isCorrect = this.getAttribute("data-answer") === q.answer;
            this.classList.add(isCorrect ? "correct" : "wrong");
            if (isCorrect) {
                state.score += 10;
                state.correct++;
                if (typeof addXP === "function") addXP(5);
            }
            if (!isCorrect) {
                var all = document.querySelectorAll(".crossQuizOpt");
                for (var ao = 0; ao < all.length; ao++) {
                    if (all[ao].getAttribute("data-answer") === q.answer) all[ao].classList.add("correct");
                }
            }
            setTimeout(function () {
                state.index++;
                _renderCrossQuestion(c, state);
            }, 1000);
        };
    }
}

function _renderCrossResult(c, state) {
    var accuracy = state.questions.length > 0 ? Math.round((state.correct / state.questions.length) * 100) : 0;

    var h = '<h2 class="game-title">Quiz Complete!</h2>';
    h += '<div style="text-align:center">';
    h += '<div style="font-size:3rem;color:var(--gold);margin:15px 0">' + state.score + ' pts</div>';
    h += '<div style="font-size:1.2rem;margin-bottom:20px">' + state.correct + '/' + state.questions.length + ' correct (' + accuracy + '%)</div>';
    h += '</div>';

    h += '<div class="game-controls">';
    h += '<button class="game-btn" id="crossQuizAgain">Try Again</button>';
    h += '<button class="game-btn secondary" id="crossQuizDash">Dashboard</button>';
    h += '</div>';

    c.innerHTML = h;
    if (typeof createConfetti === "function" && accuracy >= 70) createConfetti(30);

    document.getElementById("crossQuizAgain").onclick = function () { _showCrossQuizUI(c); };
    document.getElementById("crossQuizDash").onclick = function () { showSmartDashboard(c); };
}

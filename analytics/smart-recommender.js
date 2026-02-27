/**
 * smart-recommender.js
 * Personalized word and mode recommendations based on learning patterns
 *
 * @module SmartRecommender
 * @requires word-analyzer.js (WordAnalyzer)
 * @requires learning-profile.js (LearningProfile)
 * @requires localStorage (browser API)
 */

/**
 * SmartRecommender - Generates personalized learning recommendations
 * @namespace
 */
var SmartRecommender = {

    /**
     * Gets SRS (Spaced Repetition System) words due for review
     * @private
     * @param {number} maxCount - Maximum number of words to return
     * @param {Object} seen - Tracking object for already selected words
     * @returns {Array<Object>} Array of due words with reasons
     */
    _getSRSWords: function (maxCount, seen) {
        var results = [];
        var now = Date.now();

        try {
            var srsData = JSON.parse(localStorage.getItem("srsData") || "{}");
            var dueWords = [];

            // Collect all due words
            for (var k in srsData) {
                if (!srsData.hasOwnProperty(k)) continue;

                var entry = srsData[k];
                var isDue = entry.nextReview && entry.nextReview <= now;
                var notMastered = (entry.box || 1) < 5;

                if (isDue && notMastered) {
                    dueWords.push({ key: k, entry: entry });
                }
            }

            // Sort by box level (lower boxes first)
            dueWords.sort(function (a, b) {
                return (a.entry.box || 1) - (b.entry.box || 1);
            });

            // Add to results
            for (var i = 0; i < dueWords.length && results.length < maxCount; i++) {
                var dueWord = dueWords[i];
                if (dueWord.entry.word && !seen[dueWord.key]) {
                    seen[dueWord.key] = true;
                    results.push({
                        word: dueWord.entry.word,
                        reason: "SRS due (box " + (dueWord.entry.box || 1) + ")"
                    });
                }
            }
        } catch (e) {
            // SRS data unavailable
        }

        return results;
    },

    /**
     * Gets words from user's weakest categories
     * @private
     * @param {number} maxCount - Maximum number of words to return
     * @param {Object} seen - Tracking object for already selected words
     * @returns {Array<Object>} Array of words from weak categories
     */
    _getWeakCategoryWords: function (maxCount, seen) {
        var results = [];
        var weaknesses = LearningProfile.getWeaknesses();
        var collectedWords = (typeof gameState !== "undefined")
            ? (gameState.collectedWords || {})
            : {};

        for (var wi = 0; wi < weaknesses.length && results.length < maxCount; wi++) {
            var cat = weaknesses[wi].category;

            if (typeof wordDatabase === "undefined" || !wordDatabase[cat]) {
                continue;
            }

            var catWords = wordDatabase[cat];
            var catLabel = cat;

            if (typeof categoryNames !== "undefined" && categoryNames[cat]) {
                catLabel = categoryNames[cat];
            }

            for (var cw = 0; cw < catWords.length && results.length < maxCount; cw++) {
                var word = catWords[cw];
                var notCollected = !collectedWords[word.korean];
                var notSeen = !seen[word.korean];

                if (notCollected && notSeen) {
                    seen[word.korean] = true;
                    results.push({
                        word: word,
                        reason: "Weak category: " + catLabel
                    });
                }
            }
        }

        return results;
    },

    /**
     * Gets words related to recently recommended words
     * @private
     * @param {Array<Object>} existingResults - Already selected words
     * @param {number} maxCount - Maximum total words
     * @param {Object} seen - Tracking object for already selected words
     * @returns {Array<Object>} Array of related words
     */
    _getRelatedWords: function (existingResults, maxCount, seen) {
        var results = [];

        if (existingResults.length === 0) {
            return results;
        }

        var seedWord = existingResults[0].word.korean;
        var related = WordAnalyzer.findRelatedWords(seedWord);

        for (var i = 0; i < related.length && existingResults.length + results.length < maxCount; i++) {
            var relatedWord = related[i].word;

            if (!seen[relatedWord.korean]) {
                seen[relatedWord.korean] = true;
                results.push({
                    word: relatedWord,
                    reason: "Related to " + seedWord + " (" + related[i].reason + ")"
                });
            }
        }

        return results;
    },

    /**
     * Gets next recommended words for study
     * @public
     * @param {number} count - Number of words to recommend (default: 10)
     * @returns {Array<Object>} Recommended words with reasons
     * @example
     * getNextWords(15)
     * // [{ word: {...}, reason: "SRS due (box 2)" }, ...]
     */
    getNextWords: function (count) {
        count = count || 10;
        var results = [];
        var seen = {};

        // Priority 1: SRS words due today
        var srsWords = this._getSRSWords(count, seen);
        results = results.concat(srsWords);

        // Priority 2: Words from weakest categories
        if (results.length < count) {
            var weakWords = this._getWeakCategoryWords(count - results.length, seen);
            results = results.concat(weakWords);
        }

        // Priority 3: Related to already selected words
        if (results.length < count && results.length > 0) {
            var relatedWords = this._getRelatedWords(results, count, seen);
            results = results.concat(relatedWords);
        }

        return results.slice(0, count);
    },

    /**
     * Gets mode usage statistics from recent sessions
     * @private
     * @param {number} days - Number of days to analyze
     * @returns {Object} Mode usage counts
     */
    _getRecentModeUsage: function (days) {
        var stats = [];
        try {
            stats = JSON.parse(localStorage.getItem("dailyStudyStats") || "[]");
        } catch (e) {
            return {};
        }

        var recentModes = {};
        var cutoff = Date.now() - days * 86400000;

        for (var i = 0; i < stats.length; i++) {
            if (stats[i].timestamp && stats[i].timestamp > cutoff) {
                var mode = stats[i].mode || "";
                recentModes[mode] = (recentModes[mode] || 0) + 1;
            }
        }

        return recentModes;
    },

    /**
     * Recommends a study mode based on usage patterns
     * @public
     * @returns {Object} Recommended mode with reason
     * @example
     * getRecommendedMode()
     * // { mode: "memory", modeLabel: "Memory Match", reason: "..." }
     */
    getRecommendedMode: function () {
        var modes = [
            "flashcards", "quiz", "memory", "speed", "typing",
            "listening", "grammar", "situation", "survival", "chain"
        ];

        var modeLabels = {
            flashcards: "Flashcards",
            quiz: "Quiz",
            memory: "Memory Match",
            speed: "Speed Challenge",
            typing: "Typing Practice",
            listening: "Listening",
            grammar: "Grammar Drill",
            situation: "Situational Phrases",
            survival: "Survival Mode",
            chain: "Word Chain"
        };

        // Get recent usage (last 7 days)
        var recentModes = this._getRecentModeUsage(7);

        // Find least used mode
        var bestMode = modes[0];
        var bestScore = Infinity;

        for (var i = 0; i < modes.length; i++) {
            var usage = recentModes[modes[i]] || 0;
            if (usage < bestScore) {
                bestScore = usage;
                bestMode = modes[i];
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

    /**
     * Generates a daily challenge based on user's progress
     * @public
     * @returns {Object} Daily challenge with details
     * @example
     * getDailyChallenge()
     * // { title: "Review 10 SRS words", description: "...", type: "review", target: 10 }
     */
    getDailyChallenge: function () {
        var challenges = [];
        var gs = (typeof gameState !== "undefined") ? gameState : {};

        // Challenge 1: SRS review
        var srsCount = this._countDueSRSWords();
        if (srsCount >= 5) {
            challenges.push({
                title: "Review " + Math.min(15, srsCount) + " SRS words",
                description: "You have " + srsCount + " words due for review today",
                type: "review",
                target: Math.min(15, srsCount),
                mode: "srs"
            });
        }

        // Challenge 2: Combo streak
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

        // Challenge 3: Weak category exploration
        var weaknesses = LearningProfile.getWeaknesses();
        if (weaknesses.length > 0 && weaknesses[0].percentage < 30) {
            var weakCat = weaknesses[0].category;
            var catLabel = weakCat;

            if (typeof categoryNames !== "undefined" && categoryNames[weakCat]) {
                catLabel = categoryNames[weakCat];
            }

            challenges.push({
                title: "Learn 5 new " + catLabel + " words",
                description: "Only " + weaknesses[0].percentage + "% collected in this category",
                type: "learn",
                target: 5,
                mode: "flashcards"
            });
        }

        // Challenge 4: Level up
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

        // Default challenge
        if (challenges.length === 0) {
            challenges.push({
                title: "Complete 3 study sessions",
                description: "Any mode counts - just keep learning!",
                type: "sessions",
                target: 3,
                mode: "flashcards"
            });
        }

        // Pick challenge based on day seed for consistency
        var dayNum = Math.floor(Date.now() / 86400000);
        return challenges[dayNum % challenges.length];
    },

    /**
     * Counts SRS words due for review
     * @private
     * @returns {number} Number of due words
     */
    _countDueSRSWords: function () {
        var count = 0;

        try {
            var srsData = JSON.parse(localStorage.getItem("srsData") || "{}");
            var now = Date.now();

            for (var k in srsData) {
                if (srsData.hasOwnProperty(k) &&
                    srsData[k].nextReview &&
                    srsData[k].nextReview <= now) {
                    count++;
                }
            }
        } catch (e) {
            // SRS data unavailable
        }

        return count;
    },

    /**
     * Selects word of the day based on user's learning needs
     * @public
     * @returns {Object|null} Word with difficulty and context, or null if unavailable
     * @example
     * getWordOfTheDay()
     * // { word: {...}, difficulty: 7, context: {...} }
     */
    getWordOfTheDay: function () {
        if (typeof wordDatabase === "undefined") {
            return null;
        }

        var collectedWords = (typeof gameState !== "undefined")
            ? (gameState.collectedWords || {})
            : {};

        var weaknesses = LearningProfile.getWeaknesses();
        var allWords = WordAnalyzer._getAllWords();

        // Filter to uncollected words
        var uncollected = [];
        for (var i = 0; i < allWords.length; i++) {
            if (!collectedWords[allWords[i].korean]) {
                uncollected.push(allWords[i]);
            }
        }

        // If all collected, use all words
        if (uncollected.length === 0) {
            uncollected = allWords;
        }

        // Prefer words from weak category
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
        var context = (typeof DataCombiner !== "undefined")
            ? DataCombiner.findWordInContext(word.korean)
            : null;

        return {
            word: word,
            difficulty: difficulty,
            context: context
        };
    }
};

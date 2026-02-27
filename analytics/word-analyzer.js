/**
 * word-analyzer.js
 * Word analysis and relationship detection for Korean language learning
 *
 * @module WordAnalyzer
 * @requires wordDatabase (global)
 * @requires Hangul (optional, external library)
 */

/**
 * WordAnalyzer - Analyzes Korean words for relationships and patterns
 * @namespace
 */
var WordAnalyzer = {

    /**
     * Disassembles Korean text into individual characters
     * @private
     * @param {string} text - Korean text to disassemble
     * @returns {Array<string>} Array of individual characters
     * @example
     * _disassemble("안녕") // ["ㅇ", "ㅏ", "ㄴ", "ㄴ", "ㅕ", "ㅇ"]
     */
    _disassemble: function (text) {
        if (typeof Hangul !== "undefined" && Hangul.disassemble) {
            return Hangul.disassemble(text);
        }
        return text.split("");
    },

    /**
     * Extracts the initial consonant from a Korean character
     * @private
     * @param {string} char - Single Korean syllable
     * @returns {string|null} Initial consonant or null if not Korean
     * @example
     * _getInitialConsonant("가") // "ㄱ"
     * _getInitialConsonant("a") // null
     */
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

    /**
     * Extracts syllables from Korean text
     * @private
     * @param {string} korean - Korean text
     * @returns {Array<string>} Array of syllables
     * @example
     * _getSyllables("안녕하세요") // ["안", "녕", "하", "세", "요"]
     */
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

    /**
     * Retrieves all words from the global word database
     * @private
     * @returns {Array<Object>} Array of all word objects
     */
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

    /**
     * Finds words with shared syllables
     * @private
     * @param {string} korean - Target word
     * @param {Array} allWords - Word database
     * @param {Object} seen - Tracking object
     * @returns {Array<Object>} Words with shared syllables
     */
    _findSharedSyllables: function (korean, allWords, seen) {
        var results = [];
        var targetSyllables = this._getSyllables(korean);

        for (var w = 0; w < allWords.length; w++) {
            var word = allWords[w];
            if (word.korean === korean || seen[word.korean]) continue;

            var wordSyllables = this._getSyllables(word.korean);
            for (var s = 0; s < targetSyllables.length; s++) {
                for (var ws = 0; ws < wordSyllables.length; ws++) {
                    if (targetSyllables[s] === wordSyllables[ws] && !seen[word.korean]) {
                        seen[word.korean] = true;
                        results.push({
                            word: word,
                            reason: "Shared syllable: " + targetSyllables[s]
                        });
                        break;
                    }
                }
            }
        }
        return results;
    },

    /**
     * Finds words with same initial consonant
     * @private
     * @param {string} targetInitial - Initial consonant
     * @param {Array} allWords - Word database
     * @param {Object} seen - Tracking object
     * @param {string} korean - Word to exclude
     * @returns {Array<Object>} Words with same initial
     */
    _findSameInitial: function (targetInitial, allWords, seen, korean) {
        var results = [];

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
        return results;
    },

    /**
     * Finds related words based on multiple criteria
     * @public
     * @param {string} korean - Target Korean word
     * @returns {Array<Object>} Array of related words with reasons
     * @example
     * findRelatedWords("사랑") // [{ word: {...}, reason: "Shared syllable: 사" }, ...]
     */
    findRelatedWords: function (korean) {
        var results = [];
        var seen = {};
        var allWords = this._getAllWords();

        if (allWords.length === 0 || !korean) return results;

        var targetSyllables = this._getSyllables(korean);
        var targetInitial = targetSyllables.length > 0 ?
            this._getInitialConsonant(targetSyllables[0]) : null;

        // Find the target word object
        var targetWord = null;
        for (var i = 0; i < allWords.length; i++) {
            if (allWords[i].korean === korean) {
                targetWord = allWords[i];
                break;
            }
        }

        // Find shared syllables
        var sharedResults = this._findSharedSyllables(korean, allWords, seen);
        results = results.concat(sharedResults);

        // Find same initial consonant
        if (targetInitial) {
            var initialResults = this._findSameInitial(targetInitial, allWords, seen, korean);
            results = results.concat(initialResults);
        }

        // Find same category
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

        // Find same rarity
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

        // Sort by relevance
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

    /**
     * Groups words by shared syllables
     * @public
     * @returns {Object} Object with syllables as keys and word arrays as values
     * @example
     * findWordFamilies() // { "가": [word1, word2], "나": [word3, word4] }
     */
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

    /**
     * Calculates difficulty score for a word
     * @public
     * @param {Object} word - Word object with korean, rarity, category properties
     * @returns {number} Difficulty score from 1-10
     * @example
     * getWordDifficulty({ korean: "안녕", rarity: "common" }) // 3
     */
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

    /**
     * Finds words with minimal character differences (minimal pairs)
     * @public
     * @param {string} korean - Target Korean word
     * @returns {Array<Object>} Words with 1-2 character differences
     * @example
     * findMinimalPairMatches("밥") // [{ word: {...}, differences: 1 }, ...]
     */
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

        results.sort(function (a, b) {
            return a.differences - b.differences;
        });
        return results.slice(0, 10);
    },

    /**
     * Finds words that appear in multiple categories
     * @public
     * @returns {Array<Object>} Words with multiple category associations
     * @example
     * getCategoryOverlap() // [{ word: {...}, categories: ["food", "slang"] }, ...]
     */
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

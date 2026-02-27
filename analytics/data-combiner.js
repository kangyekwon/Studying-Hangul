/**
 * data-combiner.js
 * Cross-reference data combiner for comprehensive word context analysis
 *
 * @module DataCombiner
 * @requires WordAnalyzer (analytics/word-analyzer.js)
 * @requires wordDatabase, koreanProverbs, kdramaQuotes, kpopLyrics (global content data)
 * @requires grammarPatterns, situationalPhrases, koreanMemes, kfoodRecipes (global)
 * @requires Hangul (optional, external library)
 */

/**
 * DataCombiner - Combines data from multiple sources for rich word context
 * @namespace
 */
var DataCombiner = {

    /**
     * Searches for Korean word in text using various matching strategies
     * @private
     * @param {string} text - Text to search in
     * @param {string} korean - Korean word to find
     * @returns {boolean} True if word found
     * @example
     * _searchInText("사랑해요", "사랑") // true
     */
    _searchInText: function (text, korean) {
        if (!text || !korean) return false;
        if (text.indexOf(korean) !== -1) return true;

        // Syllable-level search with Hangul library
        if (typeof Hangul !== "undefined" && Hangul.search) {
            return Hangul.search(text, korean) >= 0;
        }
        return false;
    },

    /**
     * Searches proverbs containing the target word
     * @private
     * @param {string} korean - Target word
     * @param {Object} result - Result object to populate
     */
    _searchProverbs: function (korean, result) {
        if (typeof koreanProverbs === "undefined") return;

        for (var p = 0; p < koreanProverbs.length; p++) {
            if (this._searchInText(koreanProverbs[p].korean, korean)) {
                result.proverbs.push(koreanProverbs[p]);
            }
        }
    },

    /**
     * Searches K-drama quotes containing the target word
     * @private
     * @param {string} korean - Target word
     * @param {Object} result - Result object to populate
     */
    _searchQuotes: function (korean, result) {
        if (typeof kdramaQuotes === "undefined") return;

        for (var q = 0; q < kdramaQuotes.length; q++) {
            if (this._searchInText(kdramaQuotes[q].korean, korean)) {
                result.quotes.push(kdramaQuotes[q]);
            }
        }
    },

    /**
     * Searches K-pop lyrics containing the target word
     * @private
     * @param {string} korean - Target word
     * @param {Object} result - Result object to populate
     */
    _searchLyrics: function (korean, result) {
        if (typeof kpopLyrics === "undefined") return;

        for (var l = 0; l < kpopLyrics.length; l++) {
            var lyric = kpopLyrics[l];
            var lyricText = lyric.korean || lyric.lyric || lyric.line || "";
            if (this._searchInText(lyricText, korean)) {
                result.lyrics.push(lyric);
            }
        }
    },

    /**
     * Searches grammar patterns containing the target word
     * @private
     * @param {string} korean - Target word
     * @param {Object} result - Result object to populate
     */
    _searchGrammarPatterns: function (korean, result) {
        if (typeof grammarPatterns === "undefined") return;

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
    },

    /**
     * Searches situational phrases containing the target word
     * @private
     * @param {string} korean - Target word
     * @param {Object} result - Result object to populate
     */
    _searchSituations: function (korean, result) {
        if (typeof situationalPhrases === "undefined") return;

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
    },

    /**
     * Searches memes containing the target word
     * @private
     * @param {string} korean - Target word
     * @param {Object} result - Result object to populate
     */
    _searchMemes: function (korean, result) {
        if (typeof koreanMemes === "undefined") return;

        for (var m = 0; m < koreanMemes.length; m++) {
            if (this._searchInText(koreanMemes[m].korean, korean) ||
                this._searchInText(koreanMemes[m].example || "", korean)) {
                result.memes.push(koreanMemes[m]);
            }
        }
    },

    /**
     * Searches recipes containing the target word
     * @private
     * @param {string} korean - Target word
     * @param {Object} result - Result object to populate
     */
    _searchRecipes: function (korean, result) {
        if (typeof kfoodRecipes === "undefined") return;

        for (var r = 0; r < kfoodRecipes.length; r++) {
            var recipe = kfoodRecipes[r];
            if (this._searchInText(recipe.korean || recipe.name || "", korean)) {
                result.recipes.push(recipe);
            }
        }
    },

    /**
     * Finds all contexts where a word appears
     * @public
     * @param {string} korean - Korean word to search
     * @returns {Object} Object with arrays of proverbs, quotes, lyrics, patterns, etc.
     * @example
     * findWordInContext("사랑") // { proverbs: [...], quotes: [...], lyrics: [...] }
     */
    findWordInContext: function (korean) {
        var result = {
            proverbs: [],
            quotes: [],
            lyrics: [],
            patterns: [],
            situations: [],
            memes: [],
            recipes: []
        };

        if (!korean) return result;

        this._searchProverbs(korean, result);
        this._searchQuotes(korean, result);
        this._searchLyrics(korean, result);
        this._searchGrammarPatterns(korean, result);
        this._searchSituations(korean, result);
        this._searchMemes(korean, result);
        this._searchRecipes(korean, result);

        return result;
    },

    /**
     * Builds a learning path starting from a word
     * @public
     * @param {Object|string} fromWord - Starting word object or Korean string
     * @param {number} depth - Number of steps in learning path
     * @returns {Array<Object>} Array of learning path steps with context
     * @example
     * buildLearningPath("사랑", 3) // [{ step: 1, word: {...}, contexts: {...} }, ...]
     */
    buildLearningPath: function (fromWord, depth) {
        depth = depth || 3;
        var path = [];
        var visited = {};

        var currentWord = this._resolveWord(fromWord);
        if (!currentWord || !currentWord.korean) return path;

        for (var step = 0; step < depth; step++) {
            if (visited[currentWord.korean]) break;
            visited[currentWord.korean] = true;

            var pathStep = this._buildPathStep(currentWord, step);
            path.push(pathStep);

            var nextWord = this._findNextWord(currentWord, visited);
            if (!nextWord) break;
            currentWord = nextWord;
        }

        return path;
    },

    /**
     * Resolves word parameter to word object
     * @private
     * @param {Object|string} word - Word object or Korean string
     * @returns {Object|null} Word object or null
     */
    _resolveWord: function (word) {
        var currentWord = word;

        if (typeof currentWord === "string") {
            var allW = WordAnalyzer._getAllWords();
            for (var f = 0; f < allW.length; f++) {
                if (allW[f].korean === word) {
                    currentWord = allW[f];
                    break;
                }
            }
        }

        return currentWord;
    },

    /**
     * Builds a single learning path step
     * @private
     * @param {Object} word - Word object
     * @param {number} step - Step number
     * @returns {Object} Path step with word, contexts, and related words
     */
    _buildPathStep: function (word, step) {
        var context = this.findWordInContext(word.korean);
        var related = WordAnalyzer.findRelatedWords(word.korean);
        var difficulty = WordAnalyzer.getWordDifficulty(word);

        return {
            step: step + 1,
            word: word,
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
        };
    },

    /**
     * Finds next unvisited related word
     * @private
     * @param {Object} word - Current word
     * @param {Object} visited - Visited words tracking
     * @returns {Object|null} Next word or null
     */
    _findNextWord: function (word, visited) {
        var related = WordAnalyzer.findRelatedWords(word.korean);

        for (var nr = 0; nr < related.length; nr++) {
            if (!visited[related[nr].word.korean]) {
                return related[nr].word;
            }
        }

        return null;
    },

    /**
     * Gets a themed bundle of learning content
     * @public
     * @param {string} theme - Theme keyword (e.g., "food", "love")
     * @returns {Object} Bundle with words, phrases, patterns, proverbs
     * @example
     * getThematicBundle("food") // { theme: "food", words: [...], phrases: [...] }
     */
    getThematicBundle: function (theme) {
        var bundle = {
            theme: theme,
            words: [],
            phrases: [],
            patterns: [],
            proverbs: [],
            extras: []
        };

        if (typeof wordDatabase === "undefined") return bundle;

        var themeLower = theme.toLowerCase();

        this._searchThematicWords(themeLower, bundle);
        this._searchThematicPhrases(themeLower, bundle);
        this._searchThematicGrammar(themeLower, bundle);
        this._searchThematicProverbs(themeLower, bundle);
        this._limitBundleResults(bundle);

        return bundle;
    },

    /**
     * Searches words matching theme
     * @private
     * @param {string} themeLower - Lowercase theme
     * @param {Object} bundle - Bundle to populate
     */
    _searchThematicWords: function (themeLower, bundle) {
        var allWords = WordAnalyzer._getAllWords();

        for (var w = 0; w < allWords.length; w++) {
            var word = allWords[w];
            if ((word.category && word.category.toLowerCase().indexOf(themeLower) !== -1) ||
                (word.english && word.english.toLowerCase().indexOf(themeLower) !== -1) ||
                (word.korean && word.korean.indexOf(bundle.theme) !== -1)) {
                bundle.words.push(word);
            }
        }
    },

    /**
     * Searches situational phrases matching theme
     * @private
     * @param {string} themeLower - Lowercase theme
     * @param {Object} bundle - Bundle to populate
     */
    _searchThematicPhrases: function (themeLower, bundle) {
        if (typeof situationalPhrases === "undefined") return;

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
    },

    /**
     * Searches grammar patterns matching theme
     * @private
     * @param {string} themeLower - Lowercase theme
     * @param {Object} bundle - Bundle to populate
     */
    _searchThematicGrammar: function (themeLower, bundle) {
        if (typeof grammarPatterns === "undefined") return;

        for (var g = 0; g < grammarPatterns.length; g++) {
            var gp = grammarPatterns[g];
            if ((gp.name && gp.name.toLowerCase().indexOf(themeLower) !== -1) ||
                (gp.explanation && gp.explanation.toLowerCase().indexOf(themeLower) !== -1)) {
                bundle.patterns.push(gp);
            }
        }
    },

    /**
     * Searches proverbs matching theme
     * @private
     * @param {string} themeLower - Lowercase theme
     * @param {Object} bundle - Bundle to populate
     */
    _searchThematicProverbs: function (themeLower, bundle) {
        if (typeof koreanProverbs === "undefined") return;

        for (var p = 0; p < koreanProverbs.length; p++) {
            if ((koreanProverbs[p].english && koreanProverbs[p].english.toLowerCase().indexOf(themeLower) !== -1) ||
                (koreanProverbs[p].meaning && koreanProverbs[p].meaning.toLowerCase().indexOf(themeLower) !== -1)) {
                bundle.proverbs.push(koreanProverbs[p]);
            }
        }
    },

    /**
     * Limits bundle results to reasonable sizes
     * @private
     * @param {Object} bundle - Bundle to limit
     */
    _limitBundleResults: function (bundle) {
        bundle.words = bundle.words.slice(0, 20);
        bundle.phrases = bundle.phrases.slice(0, 10);
        bundle.patterns = bundle.patterns.slice(0, 5);
        bundle.proverbs = bundle.proverbs.slice(0, 5);
    },

    /**
     * Generates cross-content quiz questions
     * @public
     * @param {string} difficulty - Difficulty level ("easy", "medium", "hard")
     * @returns {Array<Object>} Array of quiz questions
     * @example
     * getCrossContentQuiz("medium") // [{ question: "...", options: [...], answer: "..." }, ...]
     */
    getCrossContentQuiz: function (difficulty) {
        difficulty = difficulty || "medium";
        var questions = [];

        this._generateProverbQuestions(questions);
        this._generateQuoteQuestions(questions);
        this._generateGrammarQuestions(questions);

        this._shuffleQuestions(questions);
        this._shuffleQuestionOptions(questions);

        var maxQ = difficulty === "easy" ? 5 : difficulty === "hard" ? 15 : 10;
        return questions.slice(0, maxQ);
    },

    /**
     * Generates proverb-based quiz questions
     * @private
     * @param {Array} questions - Questions array to populate
     */
    _generateProverbQuestions: function (questions) {
        if (typeof koreanProverbs === "undefined" || koreanProverbs.length === 0) return;

        var allWords = WordAnalyzer._getAllWords();

        for (var p = 0; p < Math.min(koreanProverbs.length, 20); p++) {
            var proverb = koreanProverbs[p];
            var syllables = WordAnalyzer._getSyllables(proverb.korean);

            if (syllables.length >= 3) {
                for (var w = 0; w < allWords.length; w++) {
                    if (proverb.korean.indexOf(allWords[w].korean) !== -1 && allWords[w].korean.length >= 2) {
                        var wrongProverbs = this._getWrongProverbs(p, allWords[w].korean);

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
    },

    /**
     * Gets wrong proverb options for quiz
     * @private
     * @param {number} correctIndex - Index of correct proverb
     * @param {string} targetWord - Word to avoid in wrong answers
     * @returns {Array<string>} Array of wrong proverb texts
     */
    _getWrongProverbs: function (correctIndex, targetWord) {
        var wrongProverbs = [];

        for (var wp = 0; wp < koreanProverbs.length && wrongProverbs.length < 3; wp++) {
            if (wp !== correctIndex && koreanProverbs[wp].korean.indexOf(targetWord) === -1) {
                wrongProverbs.push(koreanProverbs[wp].korean);
            }
        }

        return wrongProverbs;
    },

    /**
     * Generates K-drama quote quiz questions
     * @private
     * @param {Array} questions - Questions array to populate
     */
    _generateQuoteQuestions: function (questions) {
        if (typeof kdramaQuotes === "undefined" || kdramaQuotes.length < 4) return;

        for (var dq = 0; dq < Math.min(kdramaQuotes.length, 15); dq++) {
            var quote = kdramaQuotes[dq];
            var wrongAnswers = this._getWrongQuoteAnswers(dq);

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
    },

    /**
     * Gets wrong answers for quote questions
     * @private
     * @param {number} correctIndex - Index of correct quote
     * @returns {Array<string>} Array of wrong English translations
     */
    _getWrongQuoteAnswers: function (correctIndex) {
        var wrongAnswers = [];

        for (var wq = 0; wq < kdramaQuotes.length && wrongAnswers.length < 3; wq++) {
            if (wq !== correctIndex) {
                wrongAnswers.push(kdramaQuotes[wq].english);
            }
        }

        return wrongAnswers;
    },

    /**
     * Generates grammar pattern quiz questions
     * @private
     * @param {Array} questions - Questions array to populate
     */
    _generateGrammarQuestions: function (questions) {
        if (typeof grammarPatterns === "undefined" || grammarPatterns.length < 4) return;

        for (var gi = 0; gi < Math.min(grammarPatterns.length, 10); gi++) {
            var gp = grammarPatterns[gi];

            if (gp.examples && gp.examples.length > 0) {
                var example = gp.examples[0];
                var wrongPatterns = this._getWrongPatterns(gi);

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
    },

    /**
     * Gets wrong grammar patterns for quiz
     * @private
     * @param {number} correctIndex - Index of correct pattern
     * @returns {Array<string>} Array of wrong pattern descriptions
     */
    _getWrongPatterns: function (correctIndex) {
        var wrongPatterns = [];

        for (var wg = 0; wg < grammarPatterns.length && wrongPatterns.length < 3; wg++) {
            if (wg !== correctIndex) {
                wrongPatterns.push(grammarPatterns[wg].pattern + " (" + grammarPatterns[wg].name + ")");
            }
        }

        return wrongPatterns;
    },

    /**
     * Shuffles questions array
     * @private
     * @param {Array} questions - Questions to shuffle
     */
    _shuffleQuestions: function (questions) {
        for (var si = questions.length - 1; si > 0; si--) {
            var sj = Math.floor(Math.random() * (si + 1));
            var tmp = questions[si];
            questions[si] = questions[sj];
            questions[sj] = tmp;
        }
    },

    /**
     * Shuffles options within each question
     * @private
     * @param {Array} questions - Questions with options to shuffle
     */
    _shuffleQuestionOptions: function (questions) {
        for (var qi = 0; qi < questions.length; qi++) {
            var opts = questions[qi].options;
            for (var oi = opts.length - 1; oi > 0; oi--) {
                var oj = Math.floor(Math.random() * (oi + 1));
                var ot = opts[oi];
                opts[oi] = opts[oj];
                opts[oj] = ot;
            }
        }
    }
};

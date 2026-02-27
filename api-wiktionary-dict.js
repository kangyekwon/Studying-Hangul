/**
 * api-wiktionary-dict.js
 * Korean dictionary powered by Wiktionary REST API.
 * Provides: search, word-of-the-day, word explorer, quiz.
 * Requires: main-app.js, ai-spaced-repetition.js
 */

/** @type {string} */
var WIKT_DEF = "https://en.wiktionary.org/api/rest_v1/page/definition/";
/** @type {string} */
var DICT_HIST_KEY = "wikt_search_history";
/** @type {string} */
var WOTD_KEY = "wikt_wotd";
/** @type {number} */
var DICT_MAX_HIST = 20;
/** @type {Object<string,Object>} Offline fallback: 50 words */
var fallbackDict = (function () {
  var d = {};
  var w = [
    ["\uC548\uB155\uD558\uC138\uC694","annyeonghaseyo","interjection","Hello (formal)","\uC548\uB155+\uD558\uC138\uC694",["\uC548\uB155\uD558\uC138\uC694, \uBC18\uAC11\uC2B5\uB2C8\uB2E4."],["\uC548\uB155","\uC5EC\uBCF4\uC138\uC694"]],
    ["\uAC10\uC0AC\uD569\uB2C8\uB2E4","gamsahamnida","interjection","Thank you (formal)","\uAC10\uC0AC+\uD569\uB2C8\uB2E4",["\uB3C4\uC640\uC8FC\uC154\uC11C \uAC10\uC0AC\uD569\uB2C8\uB2E4."],["\uACE0\uB9C8\uC6CC\uC694"]],
    ["\uC0AC\uB791","sarang","noun","Love","Native Korean",["\uC0AC\uB791\uD574\uC694."],["\uC0AC\uB791\uD574\uC694","\uC0AC\uB791\uD558\uB2E4"]],
    ["\uD559\uC0DD","haksaeng","noun","Student","\uD559(study)+\uC0DD(person)",["\uC800\uB294 \uD559\uC0DD\uC785\uB2C8\uB2E4."],["\uD559\uAD50","\uC120\uC0DD\uB2D8"]],
    ["\uC74C\uC2DD","eumsik","noun","Food","\uC74C(drink)+\uC2DD(eat)",["\uD55C\uAD6D \uC74C\uC2DD\uC744 \uC88B\uC544\uD574\uC694."],["\uBC25","\uC694\uB9AC"]],
    ["\uBB3C","mul","noun","Water","Native Korean",["\uBB3C \uC8FC\uC138\uC694."],["\uC74C\uB8CC\uC218"]],
    ["\uC9D1","jip","noun","House, home","Native Korean",["\uC9D1\uC5D0 \uAC00\uC694."],["\uBC29","\uAC00\uC871"]],
    ["\uCE5C\uAD6C","chingu","noun","Friend","\uCE5C(close)+\uAD6C(companion)",["\uCE5C\uAD6C\uB97C \uB9CC\uB0AC\uC5B4\uC694."],["\uC6B0\uC815"]],
    ["\uD589\uBCF5","haengbok","noun","Happiness","\uD589(fortune)+\uBCF5(blessing)",["\uD589\uBCF5\uD574\uC694!"],["\uAE30\uC068"]],
    ["\uC2DC\uAC04","sigan","noun","Time","\uC2DC(time)+\uAC04(interval)",["\uC2DC\uAC04\uC774 \uC5C6\uC5B4\uC694."],["\uBD84","\uCD08"]],
    ["\uC624\uB298","oneul","noun","Today","Native Korean",["\uC624\uB298 \uB0A0\uC528\uAC00 \uC88B\uC544\uC694."],["\uC5B4\uC81C","\uB0B4\uC77C"]],
    ["\uB0B4\uC77C","naeil","noun","Tomorrow","Native Korean",["\uB0B4\uC77C \uBD10\uC694!"],["\uC624\uB298","\uBAA8\uB808"]],
    ["\uD55C\uAD6D\uC5B4","hangugeo","noun","Korean language","\uD55C\uAD6D+\uC5B4(language)",["\uD55C\uAD6D\uC5B4\uB97C \uBC30\uC6CC\uC694."],["\uD55C\uAE00","\uB9D0"]],
    ["\uC0AC\uB78C","saram","noun","Person","Native Korean",["\uC88B\uC740 \uC0AC\uB78C\uC774\uC5D0\uC694."],["\uC0AC\uB78C\uB4E4"]],
    ["\uB9C8\uC74C","maeum","noun","Heart, mind","Native Korean",["\uB9C8\uC74C\uC774 \uB530\uB73B\uD574\uC694."],["\uAC10\uC815"]],
    ["\uAC00\uC871","gajok","noun","Family","\uAC00(house)+\uC871(clan)",["\uAC00\uC871\uC744 \uC0AC\uB791\uD574\uC694."],["\uBD80\uBAA8\uB2D8"]],
    ["\uD558\uB298","haneul","noun","Sky","Native Korean",["\uD558\uB298\uC774 \uD30C\uB798\uC694."],["\uAD6C\uB984","\uBCC4"]],
    ["\uBC14\uB2E4","bada","noun","Sea, ocean","Native Korean",["\uBC14\uB2E4\uC5D0 \uAC00\uACE0 \uC2F6\uC5B4\uC694."],["\uD30C\uB3C4"]],
    ["\uC0B0","san","noun","Mountain","Sino-Korean",["\uC0B0\uC5D0 \uAC00\uC694."],["\uB4F1\uC0B0"]],
    ["\uAF43","kkot","noun","Flower","Native Korean",["\uAF43\uC774 \uC608\uBBF0\uC694."],["\uBD04","\uC7A5\uBBF8"]],
    ["\uB178\uB798","norae","noun","Song","Native Korean",["\uB178\uB798\uB97C \uBD88\uB7EC\uC694."],["\uC74C\uC545"]],
    ["\uCC45","chaek","noun","Book","Native Korean",["\uCC45\uC744 \uC77D\uC5B4\uC694."],["\uB3C4\uC11C\uAD00"]],
    ["\uB9DB\uC788\uB2E4","masitda","adjective","Delicious","\uB9DB(taste)+\uC788\uB2E4(have)",["\uC774 \uC74C\uC2DD\uC774 \uB9DB\uC788\uC5B4\uC694!"],["\uB9DB\uC5C6\uB2E4"]],
    ["\uC608\uC058\uB2E4","yeppeuda","adjective","Pretty","Native Korean",["\uAF43\uC774 \uC608\uC058\uC694."],["\uC544\uB984\uB2F5\uB2E4"]],
    ["\uD06C\uB2E4","keuda","adjective","Big, large","Native Korean",["\uC774 \uAC74\uBB3C\uC774 \uCEE4\uC694."],["\uC791\uB2E4"]],
    ["\uBA39\uB2E4","meokda","verb","To eat","Native Korean",["\uBC25\uC744 \uBA39\uC5B4\uC694."],["\uC2DD\uC0AC"]],
    ["\uAC00\uB2E4","gada","verb","To go","Native Korean",["\uD559\uAD50\uC5D0 \uAC00\uC694."],["\uC624\uB2E4"]],
    ["\uBCF4\uB2E4","boda","verb","To see, watch","Native Korean",["\uC601\uD654\uB97C \uBD10\uC694."],["\uB4E3\uB2E4"]],
    ["\uD558\uB2E4","hada","verb","To do","Native Korean",["\uACF5\uBD80\uB97C \uD574\uC694."],["\uB418\uB2E4"]],
    ["\uC788\uB2E4","itda","verb","To exist, to have","Native Korean",["\uC2DC\uAC04\uC774 \uC788\uC5B4\uC694."],["\uC5C6\uB2E4"]],
    ["\uC88B\uB2E4","jota","adjective","Good, to like","Native Korean",["\uB0A0\uC528\uAC00 \uC88B\uC544\uC694."],["\uB098\uC058\uB2E4"]],
    ["\uBC30\uC6B0\uB2E4","baeuda","verb","To learn","Native Korean",["\uD55C\uAD6D\uC5B4\uB97C \uBC30\uC6CC\uC694."],["\uACF5\uBD80"]],
    ["\uC4F0\uB2E4","sseuda","verb","To write, to use","Native Korean",["\uD3B8\uC9C0\uB97C \uC368\uC694."],["\uC77D\uB2E4"]],
    ["\uC0AC\uACFC","sagwa","noun","Apple; Apology","Sino-Korean",["\uC0AC\uACFC \uD558\uB098 \uC8FC\uC138\uC694."],["\uACFC\uC77C"]],
    ["\uC6B0\uC720","uyu","noun","Milk","\uC6B0(cow)+\uC720(milk)",["\uC6B0\uC720\uB97C \uB9C8\uC154\uC694."],["\uC74C\uB8CC\uC218"]],
    ["\uBC84\uC2A4","beoseu","noun","Bus","Loanword: English 'bus'",["\uBC84\uC2A4\uB97C \uD0C0\uC694."],["\uC9C0\uD558\uCCA0"]],
    ["\uBCD1\uC6D0","byeongwon","noun","Hospital","\uBCD1(illness)+\uC6D0(institution)",["\uBCD1\uC6D0\uC5D0 \uAC00\uC694."],["\uC758\uC0AC"]],
    ["\uC804\uD654","jeonhwa","noun","Telephone","\uC804(electric)+\uD654(speech)",["\uC804\uD654\uD574 \uC8FC\uC138\uC694."],["\uD578\uB4DC\uD3F0"]],
    ["\uC544\uCE68","achim","noun","Morning","Native Korean",["\uC544\uCE68\uC5D0 \uC77C\uC5B4\uB098\uC694."],["\uC800\uB155","\uBC24"]],
    ["\uC800\uB155","jeonyeok","noun","Evening","Sino-Korean",["\uC800\uB155\uC744 \uBA39\uC5B4\uC694."],["\uC544\uCE68"]],
    ["\uB208","nun","noun","Eye; Snow","Native Korean",["\uB208\uC774 \uC640\uC694."],["\uBE44","\uACA8\uC6B8"]],
    ["\uBC14\uB78C","baram","noun","Wind","Native Korean",["\uBC14\uB78C\uC774 \uBD88\uC5B4\uC694."],["\uB0A0\uC528"]],
    ["\uAE38","gil","noun","Road, way","Native Korean",["\uAE38\uC744 \uAC74\uB108\uC694."],["\uAC70\uB9AC"]],
    ["\uBB38","mun","noun","Door, gate","Sino-Korean",["\uBB38\uC744 \uC5EC\uC138\uC694."],["\uCC3D\uBB38"]],
    ["\uC5B4\uB5BB\uAC8C","eotteoke","adverb","How","\uC5B4\uB5A4+\uD558\uAC8C",["\uC5B4\uB5BB\uAC8C \uD574\uC694?"],["\uC65C"]],
    ["\uC5BC\uB9C8\uB098","eolmana","adverb","How much","Native Korean",["\uC5BC\uB9C8\uB098 \uBA40\uC5B4\uC694?"],["\uBA87"]],
    ["\uBE68\uB9AC","ppalli","adverb","Quickly","Native Korean",["\uBE68\uB9AC \uC640\uC694!"],["\uCC9C\uCC9C\uD788"]],
    ["\uCC9C\uCC9C\uD788","cheoncheonhi","adverb","Slowly","Native Korean",["\uCC9C\uCC9C\uD788 \uB9D0\uD574 \uC8FC\uC138\uC694."],["\uBE68\uB9AC"]],
    ["\uC8C4\uC1A1\uD569\uB2C8\uB2E4","joesonghamnida","interjection","I'm sorry (formal)","\uC8C4\uC1A1+\uD569\uB2C8\uB2E4",["\uB2A6\uC5B4\uC11C \uC8C4\uC1A1\uD569\uB2C8\uB2E4."],["\uBBF8\uC548\uD574\uC694"]],
    ["\uC5EC\uD589","yeohaeng","noun","Travel, trip","\uC5EC(travel)+\uD589(go)",["\uC5EC\uD589\uC744 \uAC00\uC694."],["\uAD00\uAD11"]]
  ];
  for (var i = 0; i < w.length; i++) {
    d[w[i][0]] = { romanization:w[i][1], partOfSpeech:w[i][2], definition:w[i][3], etymology:w[i][4], examples:w[i][5], related:w[i][6] };
  }
  return d;
})();

var wotdPool = Object.keys(fallbackDict);
var dictHistory = [];
var curDictEntry = null;
var explorerCats = {
  "Greetings": ["\uC548\uB155\uD558\uC138\uC694","\uAC10\uC0AC\uD569\uB2C8\uB2E4","\uC8C4\uC1A1\uD569\uB2C8\uB2E4"],
  "Nature": ["\uD558\uB298","\uBC14\uB2E4","\uC0B0","\uAF43","\uBC14\uB78C","\uB208"],
  "Food": ["\uC74C\uC2DD","\uBB3C","\uC6B0\uC720","\uC0AC\uACFC"],
  "People": ["\uC0AC\uB78C","\uCE5C\uAD6C","\uAC00\uC871","\uD559\uC0DD"],
  "Emotions": ["\uC0AC\uB791","\uD589\uBCF5","\uB9C8\uC74C"],
  "Time": ["\uC2DC\uAC04","\uC624\uB298","\uB0B4\uC77C","\uC544\uCE68","\uC800\uB155"],
  "Verbs": ["\uBA39\uB2E4","\uAC00\uB2E4","\uBCF4\uB2E4","\uD558\uB2E4","\uBC30\uC6B0\uB2E4","\uC4F0\uB2E4"],
  "Adjectives": ["\uB9DB\uC788\uB2E4","\uC608\uC058\uB2E4","\uD06C\uB2E4","\uC88B\uB2E4"],
  "Places": ["\uC9D1","\uBCD1\uC6D0","\uBC84\uC2A4","\uAE38","\uBB38"]
};

/** @param {string} s @returns {string} Plain text with HTML stripped */
function dictStrip(s) {
  if (typeof s !== "string") return "";
  var t = document.createElement("div");
  t.innerHTML = s;
  return t.textContent || "";
}

/** @param {string} word @returns {Promise<Object|null>} Wiktionary entry */
function fetchWikt(word) {
  return fetch(WIKT_DEF + encodeURIComponent(word))
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data) return null;
      var e = { word:word, partOfSpeech:"", definitions:[], etymology:"", examples:[], romanization:"" };
      var sec = data.ko || data.Korean || (Array.isArray(data) ? data : null);
      if (!sec) { var ks = Object.keys(data); if (ks.length) sec = data[ks[0]]; }
      if (!sec) return e;
      var parts = Array.isArray(sec) ? sec : [sec];
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].partOfSpeech && !e.partOfSpeech) e.partOfSpeech = parts[i].partOfSpeech;
        var ds = parts[i].definitions || [];
        for (var j = 0; j < ds.length; j++) {
          var c = dictStrip(ds[j].definition || "");
          if (c) e.definitions.push(c);
          var exs = ds[j].examples || [];
          for (var k = 0; k < exs.length; k++) {
            var ex = dictStrip(exs[k].example || exs[k]);
            if (ex) e.examples.push(ex);
          }
        }
      }
      return e;
    })
    .catch(function () { return null; });
}

/** @param {string} word @returns {Promise<Object>} Lookup with fallback */
function dictLookup(word) {
  var fb = fallbackDict[word];
  return fetchWikt(word).then(function (api) {
    if (api && api.definitions.length > 0) {
      if (fb) {
        if (!api.romanization) api.romanization = fb.romanization;
        if (!api.etymology) api.etymology = fb.etymology;
        if (!api.examples.length) api.examples = fb.examples;
      }
      return api;
    }
    if (fb) return { word:word, partOfSpeech:fb.partOfSpeech, definitions:[fb.definition], etymology:fb.etymology, examples:fb.examples, romanization:fb.romanization, related:fb.related };
    return { word:word, partOfSpeech:"", definitions:["Definition not found."], etymology:"", examples:[], romanization:"", related:[] };
  });
}

/** @returns {string[]} Search history from localStorage */
function dictLoadHist() {
  try { return JSON.parse(localStorage.getItem(DICT_HIST_KEY)) || []; }
  catch (e) { return []; }
}

/** @param {string} word Save to search history */
function dictSaveHist(word) {
  var h = dictLoadHist().filter(function (w) { return w !== word; });
  h.unshift(word);
  if (h.length > DICT_MAX_HIST) h = h.slice(0, DICT_MAX_HIST);
  localStorage.setItem(DICT_HIST_KEY, JSON.stringify(h));
  dictHistory = h;
}

/** @param {Object} e @returns {string} Dictionary card HTML */
function buildDictCard(e) {
  var h = '<div class="dict-card"><div class="dict-card-hd">';
  h += '<span class="dict-word">' + escapeHtml(e.word) + '</span>';
  if (e.romanization) h += '<span class="dict-rom">' + escapeHtml(e.romanization) + '</span>';
  h += '</div><div class="dict-acts">';
  h += '<button class="game-btn dict-abtn" id="dictTtsBtn">&#128266; Pronounce</button>';
  h += '<button class="game-btn dict-abtn secondary" id="dictSrsBtn">+ SRS</button></div>';
  if (e.partOfSpeech) h += '<div class="dict-pos">' + escapeHtml(e.partOfSpeech) + '</div>';
  if (e.definitions && e.definitions.length) {
    h += '<div class="dict-sec"><div class="dict-st">Definitions</div><ul class="dict-dl">';
    for (var i = 0; i < e.definitions.length; i++) h += '<li>' + escapeHtml(e.definitions[i]) + '</li>';
    h += '</ul></div>';
  }
  if (e.etymology) h += '<div class="dict-sec"><div class="dict-st">Etymology</div><p class="dict-ety">' + escapeHtml(e.etymology) + '</p></div>';
  if (e.examples && e.examples.length) {
    h += '<div class="dict-sec"><div class="dict-st">Examples</div><ul class="dict-exl">';
    for (var j = 0; j < e.examples.length; j++) h += '<li>' + escapeHtml(e.examples[j]) + '</li>';
    h += '</ul></div>';
  }
  var rel = e.related || (fallbackDict[e.word] ? fallbackDict[e.word].related : []) || [];
  if (rel.length) {
    h += '<div class="dict-sec"><div class="dict-st">Related</div><div class="dict-reltags">';
    for (var r = 0; r < rel.length; r++) h += '<span class="dict-rlink" data-word="' + escapeHtml(rel[r]) + '">' + escapeHtml(rel[r]) + '</span>';
    h += '</div></div>';
  }
  h += '</div>';
  return h;
}

/** @param {HTMLElement} c @param {Object} entry Bind card buttons */
function bindDictCard(c, entry) {
  var tts = document.getElementById("dictTtsBtn");
  if (tts) tts.addEventListener("click", function () { speakKorean(entry.word); });
  var srs = document.getElementById("dictSrsBtn");
  if (srs) srs.addEventListener("click", function () {
    if (typeof srsAddCard !== "function") return;
    var a = srsAddCard({ korean:entry.word, english:(entry.definitions||[])[0]||"", romanization:entry.romanization||"" });
    showToast(a ? "Added to SRS: " + entry.word : "Already in SRS deck");
    if (a) addXP(5);
  });
  var rls = c.querySelectorAll(".dict-rlink");
  for (var i = 0; i < rls.length; i++) {
    rls[i].addEventListener("click", function () {
      var inp = document.getElementById("dictInput");
      if (inp) { inp.value = this.getAttribute("data-word"); triggerDictSearch(c); }
      else renderExplorerDetail(c, this.getAttribute("data-word"), "");
    });
  }
}

/** @param {HTMLElement} c Render Korean Dictionary search */
function showKoreanDictionary(c) {
  dictHistory = dictLoadHist();
  gameState.gamesPlayed++;
  saveProgress();
  renderDictUI(c, null);
}

/** @param {HTMLElement} c @param {Object|null} entry Render search UI */
function renderDictUI(c, entry) {
  var h = '<h2 class="game-title">Korean Dictionary</h2>';
  h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:15px">Search any Korean word</p>';
  h += '<div class="dict-bar"><input type="text" class="dict-inp" id="dictInput" placeholder="Enter Korean word..." autocomplete="off">';
  h += '<button class="game-btn dict-sbtn" id="dictSearchBtn">Search</button></div>';
  h += '<div id="dictLoad" style="display:none;text-align:center;padding:20px"><div class="game-loading-spinner"></div></div>';
  h += '<div id="dictRes">' + (entry ? buildDictCard(entry) : '') + '</div>';
  if (dictHistory.length && !entry) {
    h += '<div class="dict-hist"><h3 style="font-size:0.9rem;color:var(--neon-cyan);margin-bottom:10px">Recent Searches</h3><div class="dict-htags">';
    for (var i = 0; i < dictHistory.length; i++) h += '<span class="dict-htag" data-word="' + escapeHtml(dictHistory[i]) + '">' + escapeHtml(dictHistory[i]) + '</span>';
    h += '</div></div>';
  }
  c.innerHTML = h;
  injectDictCSS();
  var inp = document.getElementById("dictInput");
  if (inp) inp.focus();
  var btn = document.getElementById("dictSearchBtn");
  if (btn) btn.addEventListener("click", function () { triggerDictSearch(c); });
  if (inp) inp.addEventListener("keydown", function (e) { if (e.key === "Enter") triggerDictSearch(c); });
  var tags = c.querySelectorAll(".dict-htag");
  for (var t = 0; t < tags.length; t++) tags[t].addEventListener("click", function () {
    document.getElementById("dictInput").value = this.getAttribute("data-word");
    triggerDictSearch(c);
  });
  if (entry) bindDictCard(c, entry);
}

/** @param {HTMLElement} c Execute search from input */
function triggerDictSearch(c) {
  var inp = document.getElementById("dictInput");
  if (!inp) return;
  var w = inp.value.trim();
  if (!w) return;
  var ld = document.getElementById("dictLoad");
  var rs = document.getElementById("dictRes");
  if (ld) ld.style.display = "block";
  if (rs) rs.innerHTML = "";
  dictSaveHist(w);
  dictLookup(w).then(function (e) { curDictEntry = e; if (ld) ld.style.display = "none"; renderDictUI(c, e); });
}

/** @param {HTMLElement} c Render Word of the Day */
function showWordOfTheDay(c) {
  gameState.gamesPlayed++;
  saveProgress();
  var today = new Date().toISOString().split("T")[0];
  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(WOTD_KEY)); } catch (e) { saved = null; }
  var word, streak;
  if (saved && saved.date === today && saved.word) {
    word = saved.word; streak = saved.streak || 1;
  } else {
    word = wotdPool[Math.floor(Math.random() * wotdPool.length)];
    var prev = saved ? saved.streak || 0 : 0;
    var yd = new Date(); yd.setDate(yd.getDate() - 1);
    streak = (saved && saved.date === yd.toISOString().split("T")[0]) ? prev + 1 : 1;
    localStorage.setItem(WOTD_KEY, JSON.stringify({ date:today, word:word, streak:streak }));
  }
  c.innerHTML = '<h2 class="game-title">Word of the Day</h2><div style="text-align:center;padding:40px"><div class="game-loading-spinner"></div></div>';
  dictLookup(word).then(function (e) {
    var h = '<h2 class="game-title">Word of the Day</h2>';
    h += '<div style="text-align:center;margin-bottom:15px"><span class="dict-streak">&#128293; ' + streak + ' day streak</span></div>';
    h += '<div class="dict-wotd"><div class="dict-wotd-w">' + escapeHtml(e.word) + '</div>';
    if (e.romanization) h += '<div class="dict-wotd-r">' + escapeHtml(e.romanization) + '</div>';
    if (e.partOfSpeech) h += '<div class="dict-pos" style="text-align:center;margin:8px 0">' + escapeHtml(e.partOfSpeech) + '</div>';
    h += '<div class="dict-wotd-d">' + escapeHtml((e.definitions||[])[0]||"") + '</div>';
    if (e.etymology) h += '<div class="dict-wotd-e">' + escapeHtml(e.etymology) + '</div>';
    if (e.examples && e.examples.length) h += '<div class="dict-wotd-ex">' + escapeHtml(e.examples[0]) + '</div>';
    h += '</div><div style="text-align:center;margin-top:15px;display:flex;justify-content:center;gap:10px;flex-wrap:wrap">';
    h += '<button class="game-btn" id="wotdTts">&#128266; Listen</button>';
    h += '<button class="game-btn secondary" id="wotdSrs">+ Add to SRS</button></div>';
    c.innerHTML = h; injectDictCSS();
    var tb = document.getElementById("wotdTts");
    if (tb) tb.addEventListener("click", function () { speakKorean(e.word); addXP(2); });
    var sb = document.getElementById("wotdSrs");
    if (sb) sb.addEventListener("click", function () {
      if (typeof srsAddCard !== "function") return;
      var a = srsAddCard({ korean:e.word, english:(e.definitions||[])[0]||"", romanization:e.romanization||"" });
      showToast(a ? "Added to SRS: " + e.word : "Already in SRS deck");
      if (a) addXP(5);
    });
  });
}

/** @param {HTMLElement} c Render Word Explorer */
function showWordExplorer(c) {
  gameState.gamesPlayed++;
  saveProgress();
  renderExpCats(c);
}

/** @param {HTMLElement} c */
function renderExpCats(c) {
  var h = '<h2 class="game-title">Word Explorer</h2><p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:20px">Explore words by category</p><div class="dict-egrid">';
  var ks = Object.keys(explorerCats);
  for (var i = 0; i < ks.length; i++) h += '<div class="dict-ecat" data-cat="' + escapeHtml(ks[i]) + '"><div class="dict-ecn">' + escapeHtml(ks[i]) + '</div><div class="dict-ecc">' + explorerCats[ks[i]].length + ' words</div></div>';
  h += '</div>';
  c.innerHTML = h; injectDictCSS();
  var cs = c.querySelectorAll(".dict-ecat");
  for (var j = 0; j < cs.length; j++) cs[j].addEventListener("click", function () { renderExpWords(c, this.getAttribute("data-cat")); });
}

/** @param {HTMLElement} c @param {string} cat */
function renderExpWords(c, cat) {
  var ws = explorerCats[cat] || [];
  var h = '<h2 class="game-title">' + escapeHtml(cat) + '</h2><button class="game-btn secondary dict-abtn" id="expBack" style="margin-bottom:15px">Back</button><div class="dict-ews">';
  for (var i = 0; i < ws.length; i++) {
    var fb = fallbackDict[ws[i]];
    h += '<div class="dict-ewc" data-word="' + escapeHtml(ws[i]) + '"><div class="dict-ewk">' + escapeHtml(ws[i]) + '</div>';
    if (fb) h += '<div class="dict-ewr">' + escapeHtml(fb.romanization) + '</div><div class="dict-ewd">' + escapeHtml(fb.definition) + '</div>';
    h += '</div>';
  }
  h += '</div>';
  c.innerHTML = h;
  document.getElementById("expBack").addEventListener("click", function () { renderExpCats(c); });
  var wcs = c.querySelectorAll(".dict-ewc");
  for (var j = 0; j < wcs.length; j++) wcs[j].addEventListener("click", function () { renderExplorerDetail(c, this.getAttribute("data-word"), cat); });
}

/** @param {HTMLElement} c @param {string} word @param {string} cat */
function renderExplorerDetail(c, word, cat) {
  c.innerHTML = '<h2 class="game-title">Word Explorer</h2><div style="text-align:center;padding:30px"><div class="game-loading-spinner"></div></div>';
  dictLookup(word).then(function (e) {
    var h = '<h2 class="game-title">Word Explorer</h2>';
    if (cat) h += '<button class="game-btn secondary dict-abtn" id="expDetBack" style="margin-bottom:15px">Back to ' + escapeHtml(cat) + '</button>';
    h += buildDictCard(e);
    c.innerHTML = h; injectDictCSS(); curDictEntry = e;
    var bb = document.getElementById("expDetBack");
    if (bb) bb.addEventListener("click", function () { renderExpWords(c, cat); });
    bindDictCard(c, e);
  });
}

var dqRound = 0, dqScore = 0, dqTotal = 8;
/** @param {HTMLElement} c Start dictionary quiz */
function showDictQuiz(c) {
  dqRound = 0; dqScore = 0;
  gameState.gamesPlayed++;
  saveProgress();
  runDQRound(c);
}

/** @param {HTMLElement} c Run one quiz round */
function runDQRound(c) {
  if (dqRound >= dqTotal) { renderDQEnd(c); return; }
  var keys = Object.keys(fallbackDict);
  if (keys.length < 4) { c.innerHTML = '<h2 class="game-title">Dict Quiz</h2><p style="text-align:center">Not enough words.</p>'; return; }
  var sh = shuffle(keys), correct = sh[0], fb = fallbackDict[correct];
  var opts = shuffle([{ l:fb.definition, c:true }].concat(sh.slice(1,4).map(function (k) { return { l:fallbackDict[k].definition, c:false }; })));
  var pct = Math.round((dqRound / dqTotal) * 100);
  var h = '<h2 class="game-title">Dictionary Quiz</h2>';
  h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:10px">Round ' + (dqRound+1) + ' / ' + dqTotal + ' | Score: ' + dqScore + '</p>';
  h += '<div class="level-progress" style="margin-bottom:20px"><div class="level-bar" style="width:' + pct + '%"></div></div>';
  h += '<div class="dict-qp"><div class="dict-qw">' + escapeHtml(correct) + '</div>';
  if (fb.romanization) h += '<div class="dict-qr">' + escapeHtml(fb.romanization) + '</div>';
  h += '<p style="color:rgba(255,255,255,0.6);font-size:0.9rem;margin-top:10px">What does this word mean?</p></div>';
  h += '<div class="quiz-options">';
  for (var i = 0; i < opts.length; i++) h += '<button class="quiz-option dqopt" data-correct="' + (opts[i].c?"1":"0") + '">' + escapeHtml(opts[i].l) + '</button>';
  h += '</div>';
  c.innerHTML = h; injectDictCSS();
  var os = c.querySelectorAll(".dqopt");
  for (var j = 0; j < os.length; j++) os[j].addEventListener("click", function () {
    var all = c.querySelectorAll(".dqopt");
    for (var d = 0; d < all.length; d++) { all[d].style.pointerEvents = "none"; if (all[d].getAttribute("data-correct")==="1") all[d].classList.add("correct"); }
    if (this.getAttribute("data-correct")==="1") { dqScore++; addXP(10); if (typeof addCombo==="function") addCombo(); SoundEngine.correct(); speakKorean(correct); collectWord({korean:correct,english:fb.definition,romanization:fb.romanization,rarity:"common"}); }
    else { this.classList.add("wrong"); if (typeof resetCombo==="function") resetCombo(); SoundEngine.wrong(); }
    dqRound++;
    setTimeout(function () { runDQRound(c); }, 1200);
  });
}

/** @param {HTMLElement} c Render quiz end */
function renderDQEnd(c) {
  var pct = Math.round((dqScore/dqTotal)*100), bonus = dqScore*8;
  addXP(bonus);
  if (pct >= 80 && typeof createConfetti==="function") createConfetti(60);
  var h = '<h2 class="game-title">Dictionary Quiz Complete!</h2><div style="text-align:center">';
  h += '<div style="font-size:4rem;margin:15px 0">' + (pct>=80?"&#128214;":"&#128170;") + '</div>';
  h += '<div style="font-size:2.5rem;color:var(--gold);margin:10px 0">' + dqScore + ' / ' + dqTotal + '</div>';
  h += '<p style="color:rgba(255,255,255,0.7);margin-bottom:5px">Accuracy: ' + pct + '%</p>';
  h += '<p style="color:var(--gold);margin-bottom:20px">+' + bonus + ' XP bonus</p>';
  h += '<button class="game-btn" id="dqAgain">Play Again</button></div>';
  c.innerHTML = h;
  document.getElementById("dqAgain").addEventListener("click", function () { showDictQuiz(c); });
}

/** Inject dictionary CSS once */
function injectDictCSS() {
  if (document.getElementById("wikt-dict-css")) return;
  var s = document.createElement("style");
  s.id = "wikt-dict-css";
  s.textContent = [
    ".dict-bar{display:flex;gap:10px;max-width:500px;margin:0 auto 20px;padding:0 10px}",
    ".dict-inp{flex:1;background:var(--glass);border:2px solid rgba(255,255,255,0.15);border-radius:12px;padding:12px 16px;color:#fff;font-size:1rem;outline:none;transition:border-color .3s}",
    ".dict-inp:focus{border-color:var(--neon-cyan)}.dict-inp::placeholder{color:rgba(255,255,255,0.4)}",
    ".dict-sbtn{padding:12px 20px;border-radius:12px;font-size:.95rem;white-space:nowrap}",
    ".dict-card{background:var(--glass);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.1);border-radius:18px;padding:24px;margin:15px auto;max-width:500px}",
    ".dict-card-hd{text-align:center;margin-bottom:12px}",
    ".dict-word{font-size:2.4rem;font-weight:900;display:block;background:linear-gradient(135deg,var(--neon-pink),var(--neon-cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}",
    ".dict-rom{font-size:1rem;color:rgba(255,255,255,0.6);display:block;margin-top:4px}",
    ".dict-acts{display:flex;justify-content:center;gap:10px;margin-bottom:14px;flex-wrap:wrap}",
    ".dict-abtn{padding:8px 16px;font-size:.85rem;border-radius:10px}",
    ".dict-pos{display:inline-block;background:rgba(157,78,221,0.25);color:var(--neon-purple);padding:4px 14px;border-radius:20px;font-size:.8rem;font-weight:600;text-transform:uppercase;letter-spacing:.5px}",
    ".dict-sec{margin-top:16px}.dict-st{font-size:.8rem;color:var(--neon-cyan);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px}",
    ".dict-dl{list-style:decimal inside;padding:0;margin:0}.dict-dl li{padding:4px 0;color:rgba(255,255,255,0.85);font-size:.95rem}",
    ".dict-ety{color:rgba(255,255,255,0.7);font-size:.9rem;font-style:italic}",
    ".dict-exl{list-style:none;padding:0;margin:0}.dict-exl li{padding:6px 12px;margin:4px 0;background:rgba(0,212,255,0.08);border-left:3px solid var(--neon-cyan);border-radius:0 8px 8px 0;font-size:.9rem;color:rgba(255,255,255,0.8)}",
    ".dict-reltags{display:flex;gap:8px;flex-wrap:wrap}.dict-rlink{background:rgba(255,45,149,0.15);color:var(--neon-pink);padding:5px 12px;border-radius:10px;font-size:.85rem;cursor:pointer;transition:all .2s}.dict-rlink:hover{background:rgba(255,45,149,0.3);transform:translateY(-2px)}",
    ".dict-hist{max-width:500px;margin:20px auto 0;padding:0 10px}.dict-htags{display:flex;flex-wrap:wrap;gap:8px}",
    ".dict-htag{background:var(--glass);border:1px solid rgba(255,255,255,0.1);padding:6px 14px;border-radius:10px;font-size:.85rem;cursor:pointer;transition:all .2s;color:rgba(255,255,255,0.7)}.dict-htag:hover{border-color:var(--neon-pink);color:#fff}",
    ".dict-wotd{background:linear-gradient(135deg,rgba(157,78,221,0.2),rgba(0,212,255,0.15));border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:30px;max-width:400px;margin:0 auto;text-align:center}",
    ".dict-wotd-w{font-size:3rem;font-weight:900;background:linear-gradient(135deg,var(--neon-pink),var(--gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}",
    ".dict-wotd-r{font-size:1.1rem;color:rgba(255,255,255,0.6);margin-top:5px}.dict-wotd-d{font-size:1.3rem;color:#fff;margin-top:12px;font-weight:600}",
    ".dict-wotd-e{font-size:.85rem;color:rgba(255,255,255,0.5);margin-top:8px;font-style:italic}",
    ".dict-wotd-ex{font-size:.95rem;color:var(--neon-cyan);margin-top:12px;padding:8px;background:rgba(0,212,255,0.08);border-radius:10px}",
    ".dict-streak{display:inline-block;background:linear-gradient(135deg,rgba(255,107,53,0.3),rgba(255,215,0,0.3));padding:6px 16px;border-radius:20px;font-size:.9rem;font-weight:600;color:var(--gold)}",
    ".dict-egrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;max-width:600px;margin:0 auto}",
    ".dict-ecat{background:var(--glass);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:18px;text-align:center;cursor:pointer;transition:all .3s}.dict-ecat:hover{border-color:var(--neon-pink);transform:translateY(-3px);box-shadow:0 8px 25px rgba(0,0,0,0.3)}",
    ".dict-ecn{font-size:1rem;font-weight:700;margin-bottom:4px}.dict-ecc{font-size:.8rem;color:rgba(255,255,255,0.5)}",
    ".dict-ews{display:grid;gap:10px;max-width:500px;margin:0 auto}",
    ".dict-ewc{background:var(--glass);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px 18px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:14px}.dict-ewc:hover{border-color:var(--neon-cyan);background:rgba(0,212,255,0.08)}",
    ".dict-ewk{font-size:1.3rem;font-weight:700;min-width:70px}.dict-ewr{font-size:.82rem;color:rgba(255,255,255,0.5);min-width:90px}.dict-ewd{font-size:.9rem;color:rgba(255,255,255,0.7);flex:1}",
    ".dict-qp{text-align:center;background:linear-gradient(135deg,rgba(157,78,221,0.2),rgba(0,212,255,0.15));border-radius:18px;padding:25px;margin-bottom:20px}",
    ".dict-qw{font-size:2.5rem;font-weight:900}.dict-qr{font-size:1rem;color:rgba(255,255,255,0.6);margin-top:5px}",
    "@media(max-width:480px){.dict-bar{flex-direction:column}.dict-word{font-size:1.8rem}.dict-wotd-w{font-size:2.2rem}.dict-egrid{grid-template-columns:repeat(auto-fill,minmax(120px,1fr))}}"
  ].join("\n");
  document.head.appendChild(s);
}

window.showKoreanDictionary = showKoreanDictionary;
window.showWordOfTheDay = showWordOfTheDay;
window.showWordExplorer = showWordExplorer;
window.showDictQuiz = showDictQuiz;

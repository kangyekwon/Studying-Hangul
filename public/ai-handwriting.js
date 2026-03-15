/**
 * ai-handwriting.js
 * AI-powered Korean handwriting recognition with pattern matching.
 * Canvas drawing, stroke order animation, and similarity scoring.
 * Requires: main-app.js (escapeHtml, addXP, SoundEngine, gameState, etc.)
 */

/** @type {Object<string,Array<{t:string,f?:number[],o?:number[],c?:number[],r?:number,s?:number,e?:number}>>} */
var aiHwStrokes = {
  "\u3131":[{t:"l",f:[25,20],o:[75,20]},{t:"l",f:[75,20],o:[75,80]}],
  "\u3134":[{t:"l",f:[25,20],o:[25,80]},{t:"l",f:[25,80],o:[75,80]}],
  "\u3137":[{t:"l",f:[25,20],o:[75,20]},{t:"l",f:[25,20],o:[25,80]},{t:"l",f:[25,80],o:[75,80]}],
  "\u3139":[{t:"l",f:[20,20],o:[80,20]},{t:"l",f:[80,20],o:[80,45]},{t:"l",f:[80,45],o:[20,45]},{t:"l",f:[20,45],o:[20,80]}],
  "\u3141":[{t:"l",f:[25,20],o:[25,80]},{t:"l",f:[25,20],o:[75,20]},{t:"l",f:[75,20],o:[75,80]},{t:"l",f:[25,80],o:[75,80]}],
  "\u3142":[{t:"l",f:[30,20],o:[30,80]},{t:"l",f:[70,20],o:[70,80]},{t:"l",f:[30,50],o:[70,50]},{t:"l",f:[30,80],o:[70,80]}],
  "\u3145":[{t:"l",f:[50,15],o:[25,85]},{t:"l",f:[50,15],o:[75,85]}],
  "\u3147":[{t:"a",c:[50,50],r:30,s:0,e:6.28}],
  "\u3148":[{t:"l",f:[25,20],o:[75,20]},{t:"l",f:[50,20],o:[25,85]},{t:"l",f:[50,20],o:[75,85]}],
  "\u314A":[{t:"l",f:[50,10],o:[50,25]},{t:"l",f:[25,30],o:[75,30]},{t:"l",f:[50,30],o:[25,90]},{t:"l",f:[50,30],o:[75,90]}],
  "\u314B":[{t:"l",f:[25,20],o:[75,20]},{t:"l",f:[75,20],o:[75,80]},{t:"l",f:[25,50],o:[75,50]}],
  "\u314C":[{t:"l",f:[25,15],o:[75,15]},{t:"l",f:[25,40],o:[75,40]},{t:"l",f:[25,40],o:[25,85]},{t:"l",f:[25,85],o:[75,85]}],
  "\u314D":[{t:"l",f:[25,20],o:[25,80]},{t:"l",f:[25,20],o:[75,20]},{t:"l",f:[75,20],o:[75,80]},{t:"l",f:[25,50],o:[75,50]},{t:"l",f:[25,80],o:[75,80]}],
  "\u314E":[{t:"l",f:[25,15],o:[75,15]},{t:"a",c:[50,45],r:18,s:0,e:6.28},{t:"l",f:[25,80],o:[75,80]}],
  "\u314F":[{t:"l",f:[40,15],o:[40,85]},{t:"l",f:[40,50],o:[80,50]}],
  "\u3151":[{t:"l",f:[40,15],o:[40,85]},{t:"l",f:[40,35],o:[80,35]},{t:"l",f:[40,65],o:[80,65]}],
  "\u3153":[{t:"l",f:[20,50],o:[60,50]},{t:"l",f:[60,15],o:[60,85]}],
  "\u3155":[{t:"l",f:[20,35],o:[60,35]},{t:"l",f:[20,65],o:[60,65]},{t:"l",f:[60,15],o:[60,85]}],
  "\u3157":[{t:"l",f:[50,60],o:[50,25]},{t:"l",f:[15,60],o:[85,60]}],
  "\u315B":[{t:"l",f:[35,55],o:[35,25]},{t:"l",f:[65,55],o:[65,25]},{t:"l",f:[15,60],o:[85,60]}],
  "\u315C":[{t:"l",f:[15,40],o:[85,40]},{t:"l",f:[50,40],o:[50,75]}],
  "\u3160":[{t:"l",f:[15,40],o:[85,40]},{t:"l",f:[35,40],o:[35,75]},{t:"l",f:[65,40],o:[65,75]}],
  "\u3161":[{t:"l",f:[15,50],o:[85,50]}],
  "\u3163":[{t:"l",f:[50,15],o:[50,85]}]
};
/** @type {string[]} */ var aiHwCon = ["\u3131","\u3134","\u3137","\u3139","\u3141","\u3142","\u3145","\u3147","\u3148","\u314A","\u314B","\u314C","\u314D","\u314E"];
/** @type {string[]} */ var aiHwVow = ["\u314F","\u3151","\u3153","\u3155","\u3157","\u315B","\u315C","\u3160","\u3161","\u3163"];
/** @type {Array<{w:string,c:string[]}>} */
var aiHwWords = [
  {w:"\uD55C",c:["\uD55C"]},{w:"\uAE00",c:["\uAE00"]},{w:"\uD55C\uAE00",c:["\uD55C","\uAE00"]},
  {w:"\uC0AC\uB791",c:["\uC0AC","\uB791"]},{w:"\uD589\uBCF5",c:["\uD589","\uBCF5"]},
  {w:"\uCE5C\uAD6C",c:["\uCE5C","\uAD6C"]},{w:"\uAC00\uC871",c:["\uAC00","\uC871"]},
  {w:"\uD559\uAD50",c:["\uD559","\uAD50"]},{w:"\uBCC4",c:["\uBCC4"]},
  {w:"\uD558\uB298",c:["\uD558","\uB298"]},{w:"\uBC14\uB2E4",c:["\uBC14","\uB2E4"]},
  {w:"\uB300\uD55C\uBBFC\uAD6D",c:["\uB300","\uD55C","\uBBFC","\uAD6D"]}
];
var aiHwChar = "\u3131", aiHwScore = 0, aiHwWordIdx = 0, aiHwCharIdx = 0;
var aiHwDrawing = false, aiHwPressure = 0.5, aiHwAnimating = false, aiHwAnimFrame = 0;
/** @type {Array<Array<{x:number,y:number}>>} */ var aiHwPaths = [];
/** @type {Array<{x:number,y:number}>} */ var aiHwCurPath = [];

/** Launch AI handwriting practice mode. @param {HTMLElement} c */
function showHandwritingPractice(c) {
  aiHwChar = aiHwCon[0]; aiHwScore = 0; aiHwWordIdx = 0; aiHwCharIdx = 0;
  aiHwPaths = []; aiHwCurPath = [];
  gameState.gamesPlayed++; saveProgress(); renderAiHwMenu(c);
}
/** Render mode selection menu. @param {HTMLElement} c */
function renderAiHwMenu(c) {
  var modes = [{id:"jamo",l:"Jamo Practice",d:"Consonants & Vowels"},{id:"word",l:"Word Writing",d:"Write full words"},
    {id:"free",l:"Free Practice",d:"Free drawing mode"},{id:"stroke",l:"Stroke Order",d:"Learn stroke orders"}];
  var h = '<h2 class="game-title">AI Handwriting</h2>';
  h += '<p style="text-align:center;color:rgba(255,255,255,0.7);margin-bottom:25px">Choose a practice mode</p>';
  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;max-width:400px;margin:0 auto">';
  for (var i = 0; i < modes.length; i++) {
    h += '<div class="quiz-option" data-aimode="' + escapeHtml(modes[i].id) + '" style="padding:20px">';
    h += '<div style="font-size:1.2rem;font-weight:bold;margin-bottom:5px">' + escapeHtml(modes[i].l) + '</div>';
    h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.6)">' + escapeHtml(modes[i].d) + '</div></div>';
  }
  h += '</div>'; c.innerHTML = h;
  var btns = c.querySelectorAll("[data-aimode]");
  for (var j = 0; j < btns.length; j++) {
    btns[j].addEventListener("click", function() {
      var m = this.getAttribute("data-aimode");
      if (m === "jamo") showJamoWriting(c); else if (m === "word") showWordWriting(c);
      else if (m === "free") renderAiHwFree(c); else if (m === "stroke") renderAiHwStrokeDemo(c);
    });
  }
}
/** Initialize jamo writing practice. @param {HTMLElement} c */
function showJamoWriting(c) {
  aiHwScore = 0; aiHwChar = aiHwCon[0]; aiHwPaths = [];
  renderAiHwJamo(c, "con");
}
/** Render jamo practice canvas and controls. @param {HTMLElement} c @param {string} tab */
function renderAiHwJamo(c, tab) {
  var chars = tab === "con" ? aiHwCon : aiHwVow;
  var h = '<h2 class="game-title">Jamo Practice</h2>';
  h += '<div style="display:flex;justify-content:center;gap:10px;margin-bottom:15px">';
  h += '<button class="game-btn ' + (tab === "con" ? "" : "secondary") + '" id="aiHwTabCon">Consonants (14)</button>';
  h += '<button class="game-btn ' + (tab === "vow" ? "" : "secondary") + '" id="aiHwTabVow">Vowels (10)</button></div>';
  h += buildCharBtns(chars, "data-aijamo") + buildCanvasHTML(aiHwChar);
  h += '<div style="text-align:center;margin-bottom:10px;color:rgba(255,255,255,0.5);font-size:0.85rem">Score: ' + aiHwScore + '</div>';
  h += '<div class="game-controls"><button class="game-btn secondary" id="aiHwClear">Clear</button>';
  h += '<button class="game-btn" id="aiHwCheck">Check</button><button class="game-btn secondary" id="aiHwNext">Next</button>';
  h += '<button class="game-btn secondary" id="aiHwBackMenu">Menu</button></div>';
  c.innerHTML = h; initAiHwCanvas(c); bindJamoControls(c, tab, chars);
}
/** Bind jamo tab switches and character selectors. @param {HTMLElement} c @param {string} tab @param {string[]} chars */
function bindJamoControls(c, tab, chars) {
  document.getElementById("aiHwTabCon").addEventListener("click", function() {
    aiHwChar = aiHwCon[0]; renderAiHwJamo(c, "con");
  });
  document.getElementById("aiHwTabVow").addEventListener("click", function() {
    aiHwChar = aiHwVow[0]; renderAiHwJamo(c, "vow");
  });
  bindCharSelectors(c, "[data-aijamo]", function() {
    aiHwChar = this.getAttribute("data-aijamo"); renderAiHwJamo(c, tab);
  });
  bindControls(c, function() { renderAiHwJamo(c, tab); }, function() {
    var idx = chars.indexOf(aiHwChar);
    aiHwChar = chars[(idx + 1) % chars.length]; renderAiHwJamo(c, tab);
  });
}
/** Initialize word writing practice. @param {HTMLElement} c */
function showWordWriting(c) {
  aiHwScore = 0; aiHwWordIdx = 0; aiHwCharIdx = 0; aiHwPaths = [];
  renderAiHwWord(c);
}
/** Render word writing canvas and controls. @param {HTMLElement} c */
function renderAiHwWord(c) {
  var ent = aiHwWords[aiHwWordIdx], tgt = ent.c[aiHwCharIdx];
  var h = '<h2 class="game-title">Word Writing</h2>' + buildWordProgress(ent, aiHwCharIdx);
  h += buildCanvasHTML(tgt);
  h += '<div style="text-align:center;margin-bottom:10px;color:rgba(255,255,255,0.5);font-size:0.85rem">Score: ' + aiHwScore + '</div>';
  h += '<div class="game-controls"><button class="game-btn secondary" id="aiHwClear">Clear</button>';
  h += '<button class="game-btn" id="aiHwCheck">Check</button><button class="game-btn secondary" id="aiHwSkipWord">Skip Word</button>';
  h += '<button class="game-btn secondary" id="aiHwBackMenu">Menu</button></div>';
  c.innerHTML = h; aiHwChar = tgt; initAiHwCanvas(c);
  var skip = document.getElementById("aiHwSkipWord");
  if (skip) skip.addEventListener("click", function() {
    aiHwWordIdx = (aiHwWordIdx + 1) % aiHwWords.length; aiHwCharIdx = 0; aiHwPaths = [];
    renderAiHwWord(c);
  });
  bindControls(c, function() { renderAiHwWord(c); }, function() { advanceWordChar(c); });
}
/** Build word character progress HTML. @param {{w:string,c:string[]}} ent @param {number} idx @returns {string} */
function buildWordProgress(ent, idx) {
  var h = '<div style="text-align:center;margin-bottom:15px"><div style="font-size:2rem;margin-bottom:8px">';
  for (var i = 0; i < ent.c.length; i++) {
    var clr = i < idx ? "var(--neon-cyan)" : i === idx ? "var(--neon-pink)" : "rgba(255,255,255,0.3)";
    h += '<span style="color:' + clr + ';margin:0 4px">' + escapeHtml(ent.c[i]) + '</span>';
  }
  h += '</div><div style="color:rgba(255,255,255,0.5);font-size:0.85rem">';
  h += escapeHtml(ent.w) + ' (' + (idx + 1) + '/' + ent.c.length + ')</div></div>';
  return h;
}
/** Advance to next character in current word. @param {HTMLElement} c */
function advanceWordChar(c) {
  var ent = aiHwWords[aiHwWordIdx]; aiHwCharIdx++;
  if (aiHwCharIdx >= ent.c.length) {
    aiHwScore += 20; addXP(20); SoundEngine.levelUp();
    showToast("Word complete! +20 bonus");
    aiHwWordIdx = (aiHwWordIdx + 1) % aiHwWords.length; aiHwCharIdx = 0;
  }
  aiHwPaths = []; renderAiHwWord(c);
}
/** Render free drawing mode. @param {HTMLElement} c */
function renderAiHwFree(c) {
  var h = '<h2 class="game-title">Free Practice</h2>';
  h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:15px">Draw anything freely</p>';
  h += buildCanvasHTML("");
  h += '<div class="game-controls"><button class="game-btn secondary" id="aiHwClear">Clear</button>';
  h += '<button class="game-btn secondary" id="aiHwBackMenu">Menu</button></div>';
  c.innerHTML = h; aiHwChar = ""; initAiHwCanvas(c);
  document.getElementById("aiHwClear").addEventListener("click", function() {
    aiHwPaths = []; aiHwCurPath = []; renderAiHwFree(c);
  });
  document.getElementById("aiHwBackMenu").addEventListener("click", function() { renderAiHwMenu(c); });
}
/** Render stroke order demo mode. @param {HTMLElement} c */
function renderAiHwStrokeDemo(c) {
  var all = aiHwCon.concat(aiHwVow), strokes = aiHwStrokes[aiHwChar], cnt = strokes ? strokes.length : 0;
  var h = '<h2 class="game-title">Stroke Order</h2>' + buildCharBtns(all, "data-aistroke");
  h += '<div style="display:flex;justify-content:center;margin-bottom:15px">';
  h += '<canvas id="aiHwCanvas" width="300" height="300" style="background:rgba(255,255,255,0.05);border:2px solid rgba(157,78,221,0.5);border-radius:15px;touch-action:none"></canvas></div>';
  h += '<div style="text-align:center;margin-bottom:15px"><span style="font-size:3rem;color:var(--neon-pink)">' + escapeHtml(aiHwChar) + '</span>';
  h += '<div style="color:rgba(255,255,255,0.6);font-size:0.85rem">' + cnt + ' stroke' + (cnt !== 1 ? 's' : '') + '</div></div>';
  h += '<div class="game-controls"><button class="game-btn" id="aiHwPlayAnim">Play Animation</button>';
  h += '<button class="game-btn secondary" id="aiHwBackMenu">Menu</button></div>';
  c.innerHTML = h;
  bindCharSelectors(c, "[data-aistroke]", function() {
    aiHwChar = this.getAttribute("data-aistroke"); aiHwAnimating = false;
    if (aiHwAnimFrame) { cancelAnimationFrame(aiHwAnimFrame); aiHwAnimFrame = 0; }
    renderAiHwStrokeDemo(c);
  });
  document.getElementById("aiHwPlayAnim").addEventListener("click", function() { animateStrokeOrder(aiHwChar); });
  document.getElementById("aiHwBackMenu").addEventListener("click", function() { aiHwAnimating = false; renderAiHwMenu(c); });
  drawGuideOnCanvas("aiHwCanvas", aiHwChar, 300);
}
/** Build character selector buttons HTML. @param {string[]} chars @param {string} attr @returns {string} */
function buildCharBtns(chars, attr) {
  var h = '<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:15px">';
  for (var i = 0; i < chars.length; i++) {
    var act = chars[i] === aiHwChar ? 'background:var(--neon-purple);' : '';
    h += '<button class="hangul-key" ' + attr + '="' + chars[i] + '" style="width:40px;height:40px;font-size:1.2rem;' + act + '">' + chars[i] + '</button>';
  }
  return h + '</div>';
}
/** Build canvas section HTML with optional guide. @param {string} ch @returns {string} */
function buildCanvasHTML(ch) {
  var h = '<div style="display:flex;justify-content:center;align-items:center;gap:20px;margin-bottom:15px;flex-wrap:wrap">';
  if (ch) {
    var sk = aiHwStrokes[ch], skn = sk ? sk.length : 0;
    h += '<div style="text-align:center"><div style="font-size:6rem;color:var(--neon-pink);line-height:1;text-shadow:0 0 30px rgba(255,45,149,0.5)">' + escapeHtml(ch) + '</div>';
    if (skn > 0) h += '<div style="color:rgba(255,255,255,0.5);font-size:0.75rem;margin-top:5px">' + skn + ' stroke' + (skn !== 1 ? 's' : '') + '</div>';
    h += '</div>';
  }
  h += '<div style="position:relative"><canvas id="aiHwCanvas" width="300" height="300" style="background:rgba(255,255,255,0.05);border:2px solid rgba(157,78,221,0.5);border-radius:15px;cursor:crosshair;touch-action:none"></canvas>';
  h += '<div id="aiHwResult" style="position:absolute;top:10px;right:10px;font-size:0.85rem;color:var(--gold);display:none"></div></div></div>';
  return h;
}
/** Initialize canvas with pointer events and guide. @param {HTMLElement} c */
function initAiHwCanvas(c) {
  var cv = document.getElementById("aiHwCanvas"); if (!cv) return;
  var ctx = cv.getContext("2d");
  aiHwPaths = []; aiHwCurPath = []; aiHwDrawing = false;
  if (aiHwChar) { renderGuideChar(ctx, aiHwChar, 300); drawStrokeNums(ctx, aiHwChar, 300); }
  drawGrid(ctx, 300);
  cv.addEventListener("pointerdown", function(e) { handleHwDown(e, cv, ctx); });
  cv.addEventListener("pointermove", function(e) { handleHwMove(e, cv, ctx); });
  cv.addEventListener("pointerup", function(e) { handleHwUp(e); });
  cv.addEventListener("pointerleave", function(e) { handleHwUp(e); });
}
/** Handle pointer down to start stroke. @param {PointerEvent} e @param {HTMLCanvasElement} cv @param {CanvasRenderingContext2D} ctx */
function handleHwDown(e, cv, ctx) {
  e.preventDefault(); cv.setPointerCapture(e.pointerId);
  aiHwDrawing = true; aiHwPressure = e.pressure > 0 ? e.pressure : 0.5;
  var p = coordsOf(e, cv); aiHwCurPath = [p];
  ctx.beginPath(); ctx.moveTo(p.x, p.y);
}
/** Handle pointer move for drawing. @param {PointerEvent} e @param {HTMLCanvasElement} cv @param {CanvasRenderingContext2D} ctx */
function handleHwMove(e, cv, ctx) {
  if (!aiHwDrawing) return;
  e.preventDefault(); aiHwPressure = e.pressure > 0 ? e.pressure : 0.5;
  var p = coordsOf(e, cv); aiHwCurPath.push(p);
  drawNeonStroke(ctx, p);
}
/** Handle pointer up/leave to finalize stroke. @param {PointerEvent} e */
function handleHwUp(e) {
  if (!aiHwDrawing) return;
  e.preventDefault(); aiHwDrawing = false;
  if (aiHwCurPath.length > 2) aiHwPaths.push(aiHwCurPath.slice());
  aiHwCurPath = [];
}
/** Draw neon-styled brush stroke segment. @param {CanvasRenderingContext2D} ctx @param {{x:number,y:number}} p */
function drawNeonStroke(ctx, p) {
  ctx.lineWidth = 2 + aiHwPressure * 6; ctx.strokeStyle = "#ff2d95";
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.shadowColor = "rgba(255,45,149,0.6)"; ctx.shadowBlur = 8;
  ctx.lineTo(p.x, p.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.x, p.y);
}
/** Get canvas coordinates from pointer event. @param {PointerEvent} e @param {HTMLCanvasElement} cv @returns {{x:number,y:number}} */
function coordsOf(e, cv) {
  var r = cv.getBoundingClientRect();
  return { x: (e.clientX - r.left) * (cv.width / r.width), y: (e.clientY - r.top) * (cv.height / r.height) };
}
/** Render translucent guide character on canvas. @param {CanvasRenderingContext2D} ctx @param {string} ch @param {number} sz */
function renderGuideChar(ctx, ch, sz) {
  ctx.save(); ctx.font = '200px "Noto Sans KR",sans-serif';
  ctx.fillStyle = "rgba(157,78,221,0.15)"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
  ctx.fillText(ch, sz / 2, sz / 2 + 10); ctx.restore();
}
/** Draw stroke order number labels at each stroke start. @param {CanvasRenderingContext2D} ctx @param {string} ch @param {number} sz */
function drawStrokeNums(ctx, ch, sz) {
  var strokes = aiHwStrokes[ch]; if (!strokes) return;
  var sc = sz / 100; ctx.save();
  for (var i = 0; i < strokes.length; i++) {
    var s = strokes[i];
    var x = s.t === "l" ? s.f[0] * sc : s.c[0] * sc - s.r * sc;
    var y = s.t === "l" ? s.f[1] * sc : s.c[1] * sc - s.r * sc;
    ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,215,0,0.25)"; ctx.fill();
    ctx.fillStyle = "rgba(255,215,0,0.5)"; ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(String(i + 1), x, y);
  }
  ctx.restore();
}
/** Draw cross-hair guide grid on canvas. @param {CanvasRenderingContext2D} ctx @param {number} sz */
function drawGrid(ctx, sz) {
  ctx.save(); ctx.strokeStyle = "rgba(157,78,221,0.15)"; ctx.lineWidth = 1;
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(sz / 2, 0); ctx.lineTo(sz / 2, sz);
  ctx.moveTo(0, sz / 2); ctx.lineTo(sz, sz / 2);
  ctx.stroke(); ctx.setLineDash([]); ctx.restore();
}
/** Draw guide overlay on a named canvas. @param {string} id @param {string} ch @param {number} sz */
function drawGuideOnCanvas(id, ch, sz) {
  var cv = document.getElementById(id); if (!cv) return;
  var ctx = cv.getContext("2d"); ctx.clearRect(0, 0, sz, sz);
  renderGuideChar(ctx, ch, sz); drawStrokeNums(ctx, ch, sz); drawGrid(ctx, sz);
}
/** Compare user drawing against reference via 8x8 grid. @param {HTMLCanvasElement} cv @param {string} ch @returns {number} */
function compareDrawings(cv, ch) {
  var sz = cv.width, gn = 8, cs = sz / gn;
  var uGrid = sampleGrid(cv.getContext("2d"), sz, gn, cs);
  var ref = document.createElement("canvas"); ref.width = sz; ref.height = sz;
  var rc = ref.getContext("2d");
  rc.font = '240px "Noto Sans KR",sans-serif';
  rc.fillStyle = "#000"; rc.textAlign = "center"; rc.textBaseline = "middle";
  rc.fillText(ch, sz / 2, sz / 2 + 10);
  var rGrid = sampleGrid(rc, sz, gn, cs);
  var ov = 0, rf = 0, uf = 0;
  for (var i = 0; i < gn * gn; i++) {
    var rF = rGrid[i] > 0.05, uF = uGrid[i] > 0.02;
    if (rF) rf++; if (uF) uf++; if (rF && uF) ov++;
  }
  if (rf === 0) return 0;
  var cov = ov / rf, prec = uf > 0 ? ov / uf : 0;
  return Math.min(Math.round((cov + prec) / 2 * 100), 100);
}
/** Sample pixel density for NxN grid cells. @param {CanvasRenderingContext2D} ctx @param {number} sz @param {number} gn @param {number} cs @returns {number[]} */
function sampleGrid(ctx, sz, gn, cs) {
  var g = [];
  for (var r = 0; r < gn; r++) {
    for (var cl = 0; cl < gn; cl++) {
      var d = ctx.getImageData(cl * cs, r * cs, cs, cs), f = 0, tt = d.data.length / 4;
      for (var p = 3; p < d.data.length; p += 4) { if (d.data[p] > 30) f++; }
      g.push(f / tt);
    }
  }
  return g;
}
/** Bind character selector buttons. @param {HTMLElement} c @param {string} sel @param {Function} fn */
function bindCharSelectors(c, sel, fn) {
  var btns = c.querySelectorAll(sel);
  for (var i = 0; i < btns.length; i++) btns[i].addEventListener("click", fn);
}
/** Bind common clear/check/next/menu buttons. @param {HTMLElement} c @param {Function} redraw @param {Function} next */
function bindControls(c, redraw, next) {
  var cl = document.getElementById("aiHwClear");
  if (cl) cl.addEventListener("click", function() { aiHwPaths = []; aiHwCurPath = []; redraw(); });
  var ck = document.getElementById("aiHwCheck");
  if (ck) ck.addEventListener("click", function() { performAiHwCheck(c, next); });
  var nx = document.getElementById("aiHwNext");
  if (nx) nx.addEventListener("click", function() { aiHwPaths = []; next(); });
  var mn = document.getElementById("aiHwBackMenu");
  if (mn) mn.addEventListener("click", function() { renderAiHwMenu(c); });
}
/** Perform similarity check and provide feedback. @param {HTMLElement} c @param {Function} next */
function performAiHwCheck(c, next) {
  var cv = document.getElementById("aiHwCanvas");
  if (!cv || !aiHwChar) return;
  if (aiHwPaths.length === 0) { showToast("Draw something first!"); return; }
  var sim = compareDrawings(cv, aiHwChar);
  var res = document.getElementById("aiHwResult");
  if (res) { res.style.display = "block"; res.textContent = sim + "%"; }
  if (sim >= 60) { handleCorrectDraw(sim, next); }
  else { handleWrongDraw(sim, cv); }
}
/** Reward correct drawing with XP and auto-advance. @param {number} sim @param {Function} next */
function handleCorrectDraw(sim, next) {
  var xp = Math.round(sim / 10);
  aiHwScore += sim; addXP(xp); addCombo(); SoundEngine.correct();
  showToast("Similarity: " + sim + "% (+" + xp + " XP)");
  setTimeout(function() { aiHwPaths = []; next(); }, 1200);
}
/** Show feedback and outline hint for wrong drawing. @param {number} sim @param {HTMLCanvasElement} cv */
function handleWrongDraw(sim, cv) {
  SoundEngine.wrong(); resetCombo();
  showToast("Similarity: " + sim + "% - " + (sim >= 30 ? "Try again!" : "Keep practicing!"));
  var ctx = cv.getContext("2d"); ctx.save();
  ctx.font = '220px "Noto Sans KR",sans-serif'; ctx.strokeStyle = "rgba(0,212,255,0.4)";
  ctx.lineWidth = 2; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
  ctx.strokeText(aiHwChar, cv.width / 2, cv.height / 2 + 10); ctx.restore();
}
/** Start stroke order animation for a character. @param {string} ch */
function animateStrokeOrder(ch) {
  var cv = document.getElementById("aiHwCanvas"); if (!cv) return;
  var ctx = cv.getContext("2d"), strokes = aiHwStrokes[ch];
  if (!strokes || !strokes.length) return;
  aiHwAnimating = true; drawGuideOnCanvas("aiHwCanvas", ch, cv.width);
  runStrokeAnim(ctx, strokes, cv.width / 100, 0, 0);
}
/** Run one frame of stroke animation via rAF. @param {CanvasRenderingContext2D} ctx @param {Array} strokes @param {number} sc @param {number} si @param {number} prog */
function runStrokeAnim(ctx, strokes, sc, si, prog) {
  if (!aiHwAnimating || si >= strokes.length) { aiHwAnimating = false; return; }
  prog += 0.03;
  drawAnimStroke(ctx, strokes[si], sc, Math.min(prog, 1));
  if (prog >= 1) { drawStrokeLabel(ctx, strokes[si], sc, si + 1); si++; prog = 0; }
  if (si < strokes.length) {
    aiHwAnimFrame = requestAnimationFrame(function() { runStrokeAnim(ctx, strokes, sc, si, prog); });
  } else { aiHwAnimating = false; }
}
/** Draw one animated stroke segment with cyan glow. @param {CanvasRenderingContext2D} ctx @param {Object} s @param {number} sc @param {number} p */
function drawAnimStroke(ctx, s, sc, p) {
  ctx.save(); ctx.strokeStyle = "#00d4ff"; ctx.lineWidth = 4; ctx.lineCap = "round";
  ctx.shadowColor = "rgba(0,212,255,0.6)"; ctx.shadowBlur = 10;
  if (s.t === "l") {
    ctx.beginPath(); ctx.moveTo(s.f[0] * sc, s.f[1] * sc);
    ctx.lineTo(s.f[0] * sc + (s.o[0] - s.f[0]) * sc * p, s.f[1] * sc + (s.o[1] - s.f[1]) * sc * p);
    ctx.stroke();
  } else if (s.t === "a") {
    ctx.beginPath(); ctx.arc(s.c[0] * sc, s.c[1] * sc, s.r * sc, s.s || 0, s.e * p); ctx.stroke();
  }
  ctx.restore();
}
/** Draw numbered gold label at stroke start. @param {CanvasRenderingContext2D} ctx @param {Object} s @param {number} sc @param {number} num */
function drawStrokeLabel(ctx, s, sc, num) {
  var x = s.t === "l" ? s.f[0] * sc : s.c[0] * sc - s.r * sc;
  var y = s.t === "l" ? s.f[1] * sc : s.c[1] * sc - s.r * sc;
  ctx.save(); ctx.beginPath(); ctx.arc(x - 10, y - 10, 10, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,215,0,0.8)"; ctx.fill();
  ctx.fillStyle = "#000"; ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;
  ctx.fillText(String(num), x - 10, y - 10); ctx.restore();
}

window.showHandwritingPractice = showHandwritingPractice;
window.showJamoWriting = showJamoWriting;
window.showWordWriting = showWordWriting;

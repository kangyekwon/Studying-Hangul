/**
 * Word Connection Map - Interactive Network Graph Visualization
 * A physics-based force-directed graph showing Korean word relationships
 */

(function() {
    "use strict";

    var mapState = {
        nodes: [],
        edges: [],
        canvas: null,
        ctx: null,
        width: 0,
        height: 0,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
        isDragging: false,
        isPanning: false,
        dragNode: null,
        lastMouse: { x: 0, y: 0 },
        hoveredNode: null,
        selectedNodes: [],
        highlightedPath: [],
        activeCategories: {},
        wordOfDay: null,
        animationFrame: null,
        simulation: {
            running: true,
            alpha: 1,
            alphaDecay: 0.02,
            alphaMin: 0.001,
            velocityDecay: 0.4
        },
        physics: {
            repulsion: 800,
            attraction: 0.03,
            centerGravity: 0.01,
            linkDistance: 80,
            linkStrength: { weak: 0.1, medium: 0.3, strong: 0.6 }
        },
        visual: {
            nodeRadius: 28,
            nodeColor: {
                kculture: "#FF6B9D", daily: "#4ECDC4", food: "#FFE66D",
                travel: "#95E1D3", emotions: "#DDA0DD", kpop: "#FF69B4",
                drama: "#BA68C8", topik: "#64B5F6", default: "#9D4EDD"
            },
            edgeColor: {
                weak: "rgba(255,255,255,0.15)",
                medium: "rgba(157,78,221,0.35)",
                strong: "rgba(255,107,157,0.6)"
            },
            edgeWidth: { weak: 1, medium: 2, strong: 3 },
            highlightColor: "#FFD700",
            wotdGlow: "#FFD700",
            newWordPulse: "#00FF88"
        }
    };

    var semanticGroups = {
        greetings: ["안녕", "안녕하세요", "반갑습니다"],
        family: ["오빠", "언니", "누나", "형", "동생", "가족"],
        emotions: ["사랑", "행복", "슬픔", "기쁨"],
        food: ["밥", "음식", "먹다", "맛있다"],
        time: ["오늘", "내일", "어제", "지금"],
        places: ["학교", "집", "회사", "가게"]
    };

    function showConnectionMap(container) {
        initializeMap(container);
        buildGraph();
        setupCanvas(container);
        startSimulation();
        setupInteractions();
        highlightWordOfDay();
    }

    function initializeMap(container) {
        if (mapState.animationFrame) cancelAnimationFrame(mapState.animationFrame);
        mapState.nodes = [];
        mapState.edges = [];
        mapState.scale = 1;
        mapState.offsetX = 0;
        mapState.offsetY = 0;
        mapState.hoveredNode = null;
        mapState.selectedNodes = [];
        mapState.highlightedPath = [];
        mapState.simulation.alpha = 1;
        mapState.simulation.running = true;

        if (typeof wordDatabase !== "undefined") {
            for (var cat in wordDatabase) {
                mapState.activeCategories[cat] = true;
            }
        }
        if (typeof getWordOfDay === "function") {
            mapState.wordOfDay = getWordOfDay();
        }
    }

    function buildGraph() {
        if (typeof wordDatabase === "undefined") return;
        var nodeMap = {};
        var nodeId = 0;

        for (var category in wordDatabase) {
            if (!mapState.activeCategories[category]) continue;
            var words = wordDatabase[category];
            var sampleSize = Math.min(words.length, 15);
            var sampled = shuffleArray(words.slice()).slice(0, sampleSize);

            for (var i = 0; i < sampled.length; i++) {
                var word = sampled[i];
                var key = word.korean;
                if (!nodeMap[key]) {
                    mapState.nodes.push({
                        id: nodeId++,
                        korean: word.korean,
                        romanization: word.romanization,
                        english: word.english,
                        category: category,
                        rarity: word.rarity || "common",
                        x: Math.random() * 600 + 100,
                        y: Math.random() * 400 + 100,
                        vx: 0, vy: 0, fx: null, fy: null,
                        isNew: false,
                        pulsePhase: Math.random() * Math.PI * 2
                    });
                    nodeMap[key] = mapState.nodes[mapState.nodes.length - 1];
                }
            }
        }
        createEdges(nodeMap);
    }

    function createEdges(nodeMap) {
        var nodes = mapState.nodes;
        for (var i = 0; i < nodes.length; i++) {
            for (var j = i + 1; j < nodes.length; j++) {
                var conn = calculateConnection(nodes[i], nodes[j]);
                if (conn.strength !== "none") {
                    mapState.edges.push({
                        source: nodes[i],
                        target: nodes[j],
                        strength: conn.strength,
                        reason: conn.reason
                    });
                }
            }
        }
    }

    function calculateConnection(nodeA, nodeB) {
        var sem = findSemanticRelation(nodeA.korean, nodeB.korean);
        if (sem) return { strength: "strong", reason: "semantic" };
        if (hasRelatedMeaning(nodeA.english, nodeB.english))
            return { strength: "strong", reason: "meaning" };
        if (romanizationSimilarity(nodeA.romanization, nodeB.romanization) > 0.6)
            return { strength: "medium", reason: "romanization" };
        if (hasSharedHangul(nodeA.korean, nodeB.korean))
            return { strength: "medium", reason: "hangul" };
        if (nodeA.category === nodeB.category && Math.random() < 0.3)
            return { strength: "weak", reason: "category" };
        return { strength: "none", reason: null };
    }

    function findSemanticRelation(k1, k2) {
        for (var g in semanticGroups) {
            var w = semanticGroups[g], m1 = false, m2 = false;
            for (var i = 0; i < w.length; i++) {
                if (k1.indexOf(w[i]) !== -1) m1 = true;
                if (k2.indexOf(w[i]) !== -1) m2 = true;
            }
            if (m1 && m2) return g;
        }
        return null;
    }

    function hasRelatedMeaning(e1, e2) {
        if (!e1 || !e2) return false;
        var w1 = e1.toLowerCase().split(/[\s,\/]+/);
        var w2 = e2.toLowerCase().split(/[\s,\/]+/);
        var stop = ["a","an","the","to","of","in","is","it","be","for"];
        for (var i = 0; i < w1.length; i++) {
            if (w1[i].length < 3 || stop.indexOf(w1[i]) !== -1) continue;
            for (var j = 0; j < w2.length; j++) {
                if (w1[i] === w2[j]) return true;
            }
        }
        return false;
    }

    function romanizationSimilarity(r1, r2) {
        if (!r1 || !r2) return 0;
        r1 = r1.toLowerCase(); r2 = r2.toLowerCase();
        var pLen = 0, minL = Math.min(r1.length, r2.length);
        for (var i = 0; i < minL; i++) {
            if (r1[i] === r2[i]) pLen++; else break;
        }
        return pLen / Math.max(r1.length, r2.length);
    }

    function hasSharedHangul(k1, k2) {
        for (var i = 0; i < k1.length; i++) {
            if (k2.indexOf(k1[i]) !== -1) return true;
        }
        return false;
    }

    function setupCanvas(container) {
        var html = [
            '<div class="connection-map-container" style="position:relative;">',
            '<h2 class="game-title" style="text-align:center;margin-bottom:10px;">Word Connection Map</h2>',
            '<p style="text-align:center;color:#aaa;font-size:0.85rem;margin-bottom:10px;">',
            'Drag words to explore. Scroll to zoom. Double-click for pronunciation.</p>',
            '<div id="mapFilters" style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:10px;"></div>',
            '<div id="mapActions" style="display:flex;gap:8px;justify-content:center;margin-bottom:10px;">',
            '<button id="btnReset" class="map-btn">Reset View</button>',
            '<button id="btnPath" class="map-btn">Find Path</button>',
            '<button id="btnWotd" class="map-btn">Word of Day</button>',
            '</div>',
            '<div style="position:relative;border-radius:16px;overflow:hidden;background:radial-gradient(ellipse at center,rgba(30,20,50,1),rgba(10,5,20,1));">',
            '<canvas id="connectionCanvas" style="display:block;cursor:grab;"></canvas>',
            '</div>',
            '<div id="wordTooltip" style="position:absolute;display:none;background:rgba(20,10,40,0.95);',
            'border:2px solid #9D4EDD;border-radius:12px;padding:12px 16px;pointer-events:none;',
            'box-shadow:0 4px 20px rgba(157,78,221,0.4);z-index:100;max-width:250px;"></div>',
            '<div id="pathSelector" style="display:none;position:absolute;top:60px;left:50%;transform:translateX(-50%);',
            'background:rgba(20,10,40,0.95);border:2px solid #9D4EDD;border-radius:12px;padding:16px;z-index:200;">',
            '<p style="margin-bottom:10px;color:#fff;">Select two words to find connection path:</p>',
            '<div style="display:flex;gap:10px;align-items:center;">',
            '<span id="pathWord1" style="padding:6px 12px;background:#333;border-radius:8px;min-width:60px;text-align:center;">?</span>',
            '<span style="color:#9D4EDD;"> to </span>',
            '<span id="pathWord2" style="padding:6px 12px;background:#333;border-radius:8px;min-width:60px;text-align:center;">?</span>',
            '<button id="btnCancelPath" class="map-btn" style="margin-left:10px;">Cancel</button>',
            '</div></div></div>'
        ].join("");
        container.innerHTML = html;
        addStyles();
        mapState.canvas = document.getElementById("connectionCanvas");
        mapState.ctx = mapState.canvas.getContext("2d");
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        setupCategoryFilters();
        setupActionButtons();
    }

    function addStyles() {
        if (document.getElementById("connectionMapStyles")) return;
        var style = document.createElement("style");
        style.id = "connectionMapStyles";
        style.textContent = [
            '.map-btn{padding:8px 16px;background:linear-gradient(135deg,#9D4EDD,#6B3FA0);',
            'border:none;border-radius:8px;color:white;cursor:pointer;font-size:0.85rem;transition:all 0.3s}',
            '.map-btn:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(157,78,221,0.5)}',
            '.map-btn.active{background:linear-gradient(135deg,#FF6B9D,#FF3366)}',
            '.filter-btn{padding:4px 10px;border-radius:12px;font-size:0.75rem;border:2px solid;cursor:pointer;transition:all 0.3s}',
            '.filter-btn.active{opacity:1}',
            '.filter-btn:not(.active){opacity:0.4}'
        ].join('\n');
        document.head.appendChild(style);
    }

    function resizeCanvas() {
        var c = mapState.canvas.parentElement;
        mapState.width = c.clientWidth || 800;
        mapState.height = 450;
        mapState.canvas.width = mapState.width * window.devicePixelRatio;
        mapState.canvas.height = mapState.height * window.devicePixelRatio;
        mapState.canvas.style.width = mapState.width + "px";
        mapState.canvas.style.height = mapState.height + "px";
        mapState.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    function setupCategoryFilters() {
        var f = document.getElementById("mapFilters");
        var html = "";
        for (var cat in mapState.activeCategories) {
            var col = mapState.visual.nodeColor[cat] || mapState.visual.nodeColor.default;
            var act = mapState.activeCategories[cat] ? "active" : "";
            html += '<button class="filter-btn ' + act + '" data-category="' + cat + '" ';
            html += 'style="color:' + col + ';border-color:' + col + ';';
            html += 'background:' + (mapState.activeCategories[cat] ? hexToRgba(col, 0.2) : 'transparent') + ';">';
            html += cat + '</button>';
        }
        f.innerHTML = html;
        var btns = f.querySelectorAll(".filter-btn");
        for (var i = 0; i < btns.length; i++) {
            btns[i].onclick = function() {
                var c = this.getAttribute("data-category");
                mapState.activeCategories[c] = !mapState.activeCategories[c];
                this.classList.toggle("active");
                var col = mapState.visual.nodeColor[c] || mapState.visual.nodeColor.default;
                this.style.background = mapState.activeCategories[c] ? hexToRgba(col, 0.2) : 'transparent';
                rebuildGraph();
            };
        }
    }

    function setupActionButtons() {
        document.getElementById("btnReset").onclick = function() {
            mapState.scale = 1; mapState.offsetX = 0; mapState.offsetY = 0;
            mapState.simulation.alpha = 0.5; mapState.simulation.running = true;
        };
        document.getElementById("btnPath").onclick = function() {
            var ps = document.getElementById("pathSelector");
            ps.style.display = ps.style.display === "none" ? "block" : "none";
            mapState.selectedNodes = []; mapState.highlightedPath = [];
            document.getElementById("pathWord1").textContent = "?";
            document.getElementById("pathWord2").textContent = "?";
            this.classList.toggle("active");
        };
        document.getElementById("btnCancelPath").onclick = function() {
            document.getElementById("pathSelector").style.display = "none";
            document.getElementById("btnPath").classList.remove("active");
            mapState.selectedNodes = []; mapState.highlightedPath = [];
        };
        document.getElementById("btnWotd").onclick = focusOnWordOfDay;
    }

    function rebuildGraph() {
        mapState.nodes = []; mapState.edges = [];
        mapState.simulation.alpha = 1; mapState.simulation.running = true;
        buildGraph();
    }

    function setupInteractions() {
        var c = mapState.canvas;
        c.addEventListener("mousedown", handleMouseDown);
        c.addEventListener("mousemove", handleMouseMove);
        c.addEventListener("mouseup", handleMouseUp);
        c.addEventListener("mouseleave", handleMouseLeave);
        c.addEventListener("wheel", handleWheel, { passive: false });
        c.addEventListener("dblclick", handleDoubleClick);
        c.addEventListener("touchstart", handleTouchStart, { passive: false });
        c.addEventListener("touchmove", handleTouchMove, { passive: false });
        c.addEventListener("touchend", handleTouchEnd);
    }

    function getMousePos(e) {
        var r = mapState.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - r.left - mapState.offsetX) / mapState.scale,
            y: (e.clientY - r.top - mapState.offsetY) / mapState.scale,
            screenX: e.clientX - r.left,
            screenY: e.clientY - r.top
        };
    }

    function findNodeAt(x, y) {
        for (var i = mapState.nodes.length - 1; i >= 0; i--) {
            var n = mapState.nodes[i];
            var dx = n.x - x, dy = n.y - y;
            if (dx*dx + dy*dy < mapState.visual.nodeRadius * mapState.visual.nodeRadius)
                return n;
        }
        return null;
    }

    function handleMouseDown(e) {
        var pos = getMousePos(e);
        var node = findNodeAt(pos.x, pos.y);
        if (node) {
            mapState.dragNode = node;
            node.fx = node.x; node.fy = node.y;
            mapState.canvas.style.cursor = "grabbing";
            if (document.getElementById("pathSelector").style.display !== "none")
                selectNodeForPath(node);
        } else {
            mapState.isPanning = true;
            mapState.canvas.style.cursor = "grabbing";
        }
        mapState.lastMouse = { x: e.clientX, y: e.clientY };
    }

    function handleMouseMove(e) {
        var pos = getMousePos(e);
        if (mapState.dragNode) {
            mapState.dragNode.fx = pos.x; mapState.dragNode.fy = pos.y;
            mapState.dragNode.x = pos.x; mapState.dragNode.y = pos.y;
            mapState.simulation.alpha = Math.max(mapState.simulation.alpha, 0.3);
            mapState.simulation.running = true;
        } else if (mapState.isPanning) {
            mapState.offsetX += e.clientX - mapState.lastMouse.x;
            mapState.offsetY += e.clientY - mapState.lastMouse.y;
            mapState.lastMouse = { x: e.clientX, y: e.clientY };
        } else {
            var node = findNodeAt(pos.x, pos.y);
            if (node !== mapState.hoveredNode) {
                mapState.hoveredNode = node;
                mapState.canvas.style.cursor = node ? "pointer" : "grab";
                showTooltip(node, pos.screenX, pos.screenY);
            }
        }
    }

    function handleMouseUp(e) {
        if (mapState.dragNode) {
            mapState.dragNode.fx = null; mapState.dragNode.fy = null;
            mapState.dragNode = null;
        }
        mapState.isPanning = false;
        mapState.canvas.style.cursor = "grab";
    }

    function handleMouseLeave(e) {
        mapState.hoveredNode = null;
        hideTooltip();
    }

    function handleWheel(e) {
        e.preventDefault();
        var r = mapState.canvas.getBoundingClientRect();
        var mx = e.clientX - r.left, my = e.clientY - r.top;
        var delta = e.deltaY > 0 ? 0.9 : 1.1;
        var newScale = Math.max(0.3, Math.min(3, mapState.scale * delta));
        var sc = newScale / mapState.scale;
        mapState.offsetX = mx - (mx - mapState.offsetX) * sc;
        mapState.offsetY = my - (my - mapState.offsetY) * sc;
        mapState.scale = newScale;
    }

    function handleDoubleClick(e) {
        var pos = getMousePos(e);
        var node = findNodeAt(pos.x, pos.y);
        if (node) playPronunciation(node);
    }

    var lastTouchDist = 0;
    function handleTouchStart(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            handleMouseDown({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
        } else if (e.touches.length === 2) {
            lastTouchDist = getTouchDistance(e.touches);
        }
    }
    function handleTouchMove(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            handleMouseMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY });
        } else if (e.touches.length === 2) {
            var d = getTouchDistance(e.touches);
            mapState.scale = Math.max(0.3, Math.min(3, mapState.scale * d / lastTouchDist));
            lastTouchDist = d;
        }
    }
    function handleTouchEnd(e) { handleMouseUp(e); }
    function getTouchDistance(t) {
        var dx = t[0].clientX - t[1].clientX;
        var dy = t[0].clientY - t[1].clientY;
        return Math.sqrt(dx*dx + dy*dy);
    }

    function showTooltip(node, x, y) {
        var tt = document.getElementById("wordTooltip");
        if (!node) { tt.style.display = "none"; return; }
        var col = mapState.visual.nodeColor[node.category] || mapState.visual.nodeColor.default;
        var isWotd = mapState.wordOfDay && node.korean === mapState.wordOfDay.korean;
        var html = [
            '<div style="font-size:1.5rem;color:' + col + ';margin-bottom:4px;">' + node.korean,
            isWotd ? ' <span style="color:#FFD700;">*</span>' : '',
            '</div>',
            '<div style="color:#aaa;font-size:0.85rem;margin-bottom:4px;">' + node.romanization + '</div>',
            '<div style="color:#fff;">' + node.english + '</div>',
            '<div style="margin-top:8px;font-size:0.75rem;color:#888;">',
            '<span style="color:' + col + ';">' + node.category + '</span> | ' + node.rarity,
            '</div>',
            '<div style="margin-top:6px;font-size:0.7rem;color:#666;">Double-click to hear</div>'
        ].join("");
        tt.innerHTML = html;
        tt.style.display = "block";
        tt.style.borderColor = col;
        var left = Math.min(x + 20, mapState.width - 200);
        var top = y + 60;
        tt.style.left = left + "px";
        tt.style.top = top + "px";
    }

    function hideTooltip() {
        document.getElementById("wordTooltip").style.display = "none";
    }

    function playPronunciation(node) {
        if (typeof SoundEngine !== "undefined" && SoundEngine.speak) {
            SoundEngine.speak(node.korean);
        } else if ("speechSynthesis" in window) {
            var u = new SpeechSynthesisUtterance(node.korean);
            u.lang = "ko-KR"; u.rate = 0.8;
            speechSynthesis.speak(u);
        }
        node.pulsePhase = 0;
    }

    function selectNodeForPath(node) {
        if (mapState.selectedNodes.length < 2 && mapState.selectedNodes.indexOf(node) === -1) {
            mapState.selectedNodes.push(node);
            if (mapState.selectedNodes.length === 1) {
                document.getElementById("pathWord1").textContent = node.korean;
            } else {
                document.getElementById("pathWord2").textContent = node.korean;
                findPath(mapState.selectedNodes[0], mapState.selectedNodes[1]);
            }
        }
    }

    function findPath(start, end) {
        var adj = {};
        for (var i = 0; i < mapState.nodes.length; i++) adj[mapState.nodes[i].id] = [];
        for (var j = 0; j < mapState.edges.length; j++) {
            var e = mapState.edges[j];
            adj[e.source.id].push(e.target);
            adj[e.target.id].push(e.source);
        }
        var queue = [[start]], visited = {};
        visited[start.id] = true;
        while (queue.length > 0) {
            var path = queue.shift();
            var cur = path[path.length - 1];
            if (cur.id === end.id) { mapState.highlightedPath = path; return; }
            var nb = adj[cur.id];
            for (var k = 0; k < nb.length; k++) {
                if (!visited[nb[k].id]) {
                    visited[nb[k].id] = true;
                    queue.push(path.concat([nb[k]]));
                }
            }
        }
        mapState.highlightedPath = [];
    }

    function focusOnWordOfDay() {
        if (!mapState.wordOfDay) return;
        for (var i = 0; i < mapState.nodes.length; i++) {
            var n = mapState.nodes[i];
            if (n.korean === mapState.wordOfDay.korean) {
                mapState.offsetX = mapState.width / 2 - n.x * mapState.scale;
                mapState.offsetY = mapState.height / 2 - n.y * mapState.scale;
                mapState.scale = 1.5;
                break;
            }
        }
    }

    function highlightWordOfDay() {
        if (!mapState.wordOfDay) return;
        for (var i = 0; i < mapState.nodes.length; i++) {
            if (mapState.nodes[i].korean === mapState.wordOfDay.korean) {
                mapState.nodes[i].isWotd = true;
                break;
            }
        }
    }

    function startSimulation() {
        function tick() {
            if (mapState.simulation.running && mapState.simulation.alpha > mapState.simulation.alphaMin) {
                runSimulationStep();
                mapState.simulation.alpha *= (1 - mapState.simulation.alphaDecay);
            }
            render();
            mapState.animationFrame = requestAnimationFrame(tick);
        }
        tick();
    }

    function runSimulationStep() {
        var nodes = mapState.nodes, edges = mapState.edges;
        var phy = mapState.physics, alpha = mapState.simulation.alpha;

        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            if (n.fx !== null) continue;
            n.vx += (mapState.width / 2 - n.x) * phy.centerGravity * alpha;
            n.vy += (mapState.height / 2 - n.y) * phy.centerGravity * alpha;

            for (var j = i + 1; j < nodes.length; j++) {
                var o = nodes[j];
                var dx = o.x - n.x, dy = o.y - n.y;
                var dist = Math.sqrt(dx*dx + dy*dy) || 1;
                var force = phy.repulsion * alpha / (dist * dist);
                var fx = (dx / dist) * force, fy = (dy / dist) * force;
                n.vx -= fx; n.vy -= fy;
                if (o.fx === null) { o.vx += fx; o.vy += fy; }
            }
        }

        for (var k = 0; k < edges.length; k++) {
            var e = edges[k], s = e.source, t = e.target;
            var dx = t.x - s.x, dy = t.y - s.y;
            var dist = Math.sqrt(dx*dx + dy*dy) || 1;
            var str = phy.linkStrength[e.strength] * phy.attraction * alpha;
            var force = (dist - phy.linkDistance) * str;
            var fx = (dx / dist) * force, fy = (dy / dist) * force;
            if (s.fx === null) { s.vx += fx; s.vy += fy; }
            if (t.fx === null) { t.vx -= fx; t.vy -= fy; }
        }

        var pad = mapState.visual.nodeRadius + 10;
        for (var m = 0; m < nodes.length; m++) {
            var n = nodes[m];
            if (n.fx !== null) continue;
            n.vx *= (1 - mapState.simulation.velocityDecay);
            n.vy *= (1 - mapState.simulation.velocityDecay);
            n.x += n.vx; n.y += n.vy;
            n.x = Math.max(pad, Math.min(mapState.width - pad, n.x));
            n.y = Math.max(pad, Math.min(mapState.height - pad, n.y));
        }
    }

    function render() {
        var ctx = mapState.ctx;
        ctx.clearRect(0, 0, mapState.width, mapState.height);
        ctx.save();
        ctx.translate(mapState.offsetX, mapState.offsetY);
        ctx.scale(mapState.scale, mapState.scale);
        drawEdges(ctx);
        if (mapState.highlightedPath.length > 1) drawHighlightedPath(ctx);
        drawNodes(ctx);
        ctx.restore();
    }

    function drawEdges(ctx) {
        for (var i = 0; i < mapState.edges.length; i++) {
            var e = mapState.edges[i];
            ctx.beginPath();
            ctx.moveTo(e.source.x, e.source.y);
            ctx.lineTo(e.target.x, e.target.y);
            ctx.strokeStyle = mapState.visual.edgeColor[e.strength];
            ctx.lineWidth = mapState.visual.edgeWidth[e.strength];
            ctx.stroke();
        }
    }

    function drawHighlightedPath(ctx) {
        var p = mapState.highlightedPath;
        ctx.beginPath();
        ctx.moveTo(p[0].x, p[0].y);
        for (var i = 1; i < p.length; i++) ctx.lineTo(p[i].x, p[i].y);
        ctx.strokeStyle = mapState.visual.highlightColor;
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    function drawNodes(ctx) {
        var time = Date.now() / 1000;
        for (var i = 0; i < mapState.nodes.length; i++) {
            var n = mapState.nodes[i];
            var col = mapState.visual.nodeColor[n.category] || mapState.visual.nodeColor.default;
            var rad = mapState.visual.nodeRadius;
            var isHov = n === mapState.hoveredNode;
            var isSel = mapState.selectedNodes.indexOf(n) !== -1;
            var isPath = mapState.highlightedPath.indexOf(n) !== -1;
            var isWotd = n.isWotd;

            var pulse = 1;
            if (n.isNew) pulse = 1 + 0.1 * Math.sin(time * 3 + n.pulsePhase);

            if (isWotd || isHov || isSel || isPath) {
                var gc = isWotd ? mapState.visual.wotdGlow : (isHov ? col : mapState.visual.highlightColor);
                var gr = rad * 1.5 * pulse;
                var grad = ctx.createRadialGradient(n.x, n.y, rad * pulse, n.x, n.y, gr);
                grad.addColorStop(0, hexToRgba(gc, 0.6));
                grad.addColorStop(1, hexToRgba(gc, 0));
                ctx.beginPath();
                ctx.arc(n.x, n.y, gr, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            }

            if (n.isNew) {
                var pr = rad * (1.3 + 0.2 * Math.sin(time * 4 + n.pulsePhase));
                ctx.beginPath();
                ctx.arc(n.x, n.y, pr, 0, Math.PI * 2);
                ctx.strokeStyle = mapState.visual.newWordPulse;
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.5 + 0.3 * Math.sin(time * 4 + n.pulsePhase);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }

            var dr = rad * pulse * (isHov ? 1.15 : 1);
            ctx.beginPath();
            ctx.arc(n.x, n.y, dr, 0, Math.PI * 2);
            var ng = ctx.createRadialGradient(n.x - dr * 0.3, n.y - dr * 0.3, 0, n.x, n.y, dr);
            ng.addColorStop(0, lightenColor(col, 30));
            ng.addColorStop(1, col);
            ctx.fillStyle = ng;
            ctx.fill();

            ctx.strokeStyle = isSel ? mapState.visual.highlightColor : (isWotd ? mapState.visual.wotdGlow : "rgba(255,255,255,0.3)");
            ctx.lineWidth = (isSel || isWotd) ? 3 : 1.5;
            ctx.stroke();

            ctx.fillStyle = "#fff";
            ctx.font = "bold " + Math.min(14, 10 + dr / 5) + "px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowBlur = 3;
            ctx.fillText(n.korean, n.x, n.y);
            ctx.shadowBlur = 0;

            if (isWotd) drawStar(ctx, n.x + dr * 0.7, n.y - dr * 0.7, 5, 6, 3);
            if (n.isNew) {
                ctx.fillStyle = mapState.visual.newWordPulse;
                ctx.font = "bold 8px sans-serif";
                ctx.fillText("NEW", n.x, n.y + dr + 10);
            }
        }
    }

    function drawStar(ctx, cx, cy, spikes, outerR, innerR) {
        var rot = Math.PI / 2 * 3, step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerR);
        for (var i = 0; i < spikes; i++) {
            ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
            rot += step;
            ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
            rot += step;
        }
        ctx.closePath();
        ctx.fillStyle = mapState.visual.wotdGlow;
        ctx.fill();
    }

    function shuffleArray(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        }
        return arr;
    }

    function hexToRgba(hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
    }

    function lightenColor(hex, pct) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        r = Math.min(255, Math.floor(r + (255 - r) * pct / 100));
        g = Math.min(255, Math.floor(g + (255 - g) * pct / 100));
        b = Math.min(255, Math.floor(b + (255 - b) * pct / 100));
        return "#" + r.toString(16).padStart(2, "0") +
                      g.toString(16).padStart(2, "0") +
                      b.toString(16).padStart(2, "0");
    }

    // Expose to global scope
    window.showConnectionMap = showConnectionMap;
    window.ConnectionMap = {
        show: showConnectionMap,
        rebuild: rebuildGraph,
        focusWordOfDay: focusOnWordOfDay,
        getState: function() { return mapState; }
    };

})();

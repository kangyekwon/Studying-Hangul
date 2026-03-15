// ============================================================
// external-integrations.js
// External API Integrations for K-POP Korean Learning PWA
// Contains: ProSound, ProConfetti, Haptic, PWAFeatures,
//           YouTube Hub, Daily Facts, Stroke Order, Bridge
// ============================================================

// ============================================================
// 1. ENHANCED SOUND SYSTEM (ProSound)
// Richer procedural Web Audio sounds using AudioContext
// ============================================================

var ProSound = {
    ctx: null,
    initialized: false,

    init: function () {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            // Web Audio API not supported
        }
    },

    _createOsc: function (freq, type, startTime, duration, gainValue) {
        if (!this.ctx) return null;
        try {
            var osc = this.ctx.createOscillator();
            var gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(gainValue || 0.2, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            osc.start(startTime);
            osc.stop(startTime + duration);
            return { osc: osc, gain: gain };
        } catch (e) {
            return null;
        }
    },

    correct: function () {
        // Pleasant ascending chime: C5 -> E5 -> G5 arpeggio
        if (!this.ctx) return;
        try {
            var now = this.ctx.currentTime;
            // C5 = 523.25 Hz
            this._createOsc(523.25, 'sine', now, 0.25, 0.2);
            // E5 = 659.25 Hz
            this._createOsc(659.25, 'sine', now + 0.08, 0.25, 0.18);
            // G5 = 783.99 Hz
            this._createOsc(783.99, 'sine', now + 0.16, 0.35, 0.15);
            // Add shimmer with higher octave
            this._createOsc(1567.98, 'sine', now + 0.2, 0.3, 0.05);
        } catch (e) {}
    },

    wrong: function () {
        // Descending buzz
        if (!this.ctx) return;
        try {
            var now = this.ctx.currentTime;
            var osc = this.ctx.createOscillator();
            var gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.4);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
        } catch (e) {}
    },

    click: function () {
        // Soft click
        if (!this.ctx) return;
        try {
            var now = this.ctx.currentTime;
            this._createOsc(800, 'sine', now, 0.04, 0.1);
            this._createOsc(400, 'sine', now, 0.03, 0.05);
        } catch (e) {}
    },

    levelUp: function () {
        // Fanfare: 4-note ascending with harmonics
        if (!this.ctx) return;
        try {
            var now = this.ctx.currentTime;
            var notes = [523.25, 659.25, 783.99, 1046.50];
            for (var i = 0; i < notes.length; i++) {
                (function (idx) {
                    var t = now + idx * 0.12;
                    // Fundamental
                    ProSound._createOsc(notes[idx], 'sine', t, 0.5 - idx * 0.05, 0.2);
                    // Harmonic (octave above, quieter)
                    ProSound._createOsc(notes[idx] * 2, 'sine', t + 0.02, 0.3, 0.06);
                    // Third harmonic
                    ProSound._createOsc(notes[idx] * 1.5, 'sine', t + 0.01, 0.25, 0.04);
                })(i);
            }
            // Final chord sustain
            this._createOsc(523.25, 'sine', now + 0.5, 0.8, 0.1);
            this._createOsc(659.25, 'sine', now + 0.5, 0.8, 0.08);
            this._createOsc(783.99, 'sine', now + 0.5, 0.8, 0.06);
            this._createOsc(1046.50, 'sine', now + 0.5, 0.8, 0.05);
        } catch (e) {}
    },

    combo: function (count) {
        // Pitch increases with combo count
        if (!this.ctx) return;
        try {
            var now = this.ctx.currentTime;
            var baseFreq = 600 + (count || 1) * 40;
            if (baseFreq > 2000) baseFreq = 2000;
            this._createOsc(baseFreq, 'sine', now, 0.12, 0.18);
            this._createOsc(baseFreq * 1.25, 'sine', now + 0.06, 0.15, 0.12);
        } catch (e) {}
    },

    streak: function () {
        // Triumphant chord (C major with added 9th)
        if (!this.ctx) return;
        try {
            var now = this.ctx.currentTime;
            var chord = [261.63, 329.63, 392.00, 523.25, 587.33];
            for (var i = 0; i < chord.length; i++) {
                this._createOsc(chord[i], 'sine', now, 0.8, 0.12);
            }
            // Bright shimmer
            this._createOsc(1046.50, 'triangle', now + 0.1, 0.6, 0.04);
        } catch (e) {}
    },

    swipe: function () {
        // Whoosh sound using filtered noise
        if (!this.ctx) return;
        try {
            var now = this.ctx.currentTime;
            var osc = this.ctx.createOscillator();
            var gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } catch (e) {}
    },

    reveal: function () {
        // Sparkle sound - rapid high notes
        if (!this.ctx) return;
        try {
            var now = this.ctx.currentTime;
            var sparkleNotes = [2093, 2349, 2637, 2793, 3136, 3520];
            for (var i = 0; i < sparkleNotes.length; i++) {
                (function (idx) {
                    ProSound._createOsc(
                        sparkleNotes[idx],
                        'sine',
                        now + idx * 0.04,
                        0.15,
                        0.06 - idx * 0.008
                    );
                })(i);
            }
        } catch (e) {}
    }
};


// ============================================================
// 2. ENHANCED CONFETTI (ProConfetti)
// Uses canvas-confetti CDN when available, falls back gracefully
// ============================================================

var ProConfetti = {
    _hasLib: function () {
        return typeof confetti === 'function';
    },

    _fallback: function (count) {
        // Use existing createConfetti if canvas-confetti is not loaded
        if (typeof createConfetti === 'function') {
            createConfetti(count || 30);
        }
    },

    correct: function () {
        // Small burst of confetti
        if (!this._hasLib()) {
            this._fallback(20);
            return;
        }
        confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#ff2d95', '#9d4edd', '#00d4ff', '#00f5d4', '#ffd700'],
            disableForReducedMotion: true
        });
    },

    levelUp: function () {
        // Fireworks for 3 seconds
        if (!this._hasLib()) {
            this._fallback(80);
            return;
        }
        var duration = 3000;
        var end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff2d95', '#9d4edd', '#00d4ff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#00f5d4', '#ffd700', '#ff6b35']
            });
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    },

    achievement: function () {
        // Star-shaped confetti
        if (!this._hasLib()) {
            this._fallback(50);
            return;
        }
        var defaults = {
            spread: 360,
            ticks: 100,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            colors: ['#ffd700', '#ff2d95', '#00d4ff'],
            shapes: ['star'],
            scalar: 1.2
        };
        confetti(Object.assign({}, defaults, {
            particleCount: 30,
            origin: { x: 0.5, y: 0.5 }
        }));
        setTimeout(function () {
            confetti(Object.assign({}, defaults, {
                particleCount: 20,
                origin: { x: 0.3, y: 0.4 }
            }));
        }, 200);
        setTimeout(function () {
            confetti(Object.assign({}, defaults, {
                particleCount: 20,
                origin: { x: 0.7, y: 0.4 }
            }));
        }, 400);
    },

    korean: function () {
        // Confetti in Korean flag colors
        if (!this._hasLib()) {
            this._fallback(40);
            return;
        }
        var koreanColors = ['#CD2E3A', '#0047A0', '#000000', '#FFFFFF'];
        confetti({
            particleCount: 80,
            spread: 100,
            origin: { y: 0.6 },
            colors: koreanColors,
            disableForReducedMotion: true
        });
    },

    streak: function (count) {
        // Bigger with higher streak
        if (!this._hasLib()) {
            this._fallback(Math.min(count * 10, 100));
            return;
        }
        var particles = Math.min(20 + (count || 1) * 15, 150);
        var spreadVal = Math.min(40 + (count || 1) * 10, 180);
        confetti({
            particleCount: particles,
            spread: spreadVal,
            origin: { y: 0.6 },
            colors: ['#ff2d95', '#9d4edd', '#00d4ff', '#ffd700', '#00f5d4'],
            disableForReducedMotion: true
        });
    }
};


// ============================================================
// 3. HAPTIC FEEDBACK
// Uses navigator.vibrate for tactile feedback on supported devices
// ============================================================

var Haptic = {
    _vibrate: function (pattern) {
        try {
            if (navigator && navigator.vibrate) {
                navigator.vibrate(pattern);
            }
        } catch (e) {
            // Haptic not supported or blocked
        }
    },

    tap: function () {
        this._vibrate(15);
    },

    correct: function () {
        this._vibrate(50);
    },

    wrong: function () {
        this._vibrate([100, 50, 100]);
    },

    levelUp: function () {
        this._vibrate([50, 30, 50, 30, 100]);
    },

    combo: function () {
        this._vibrate(30);
    }
};


// ============================================================
// 4. PWA ENHANCED APIs
// Web Share, App Badge, Wake Lock, Fullscreen
// ============================================================

var PWAFeatures = {
    _wakeLock: null,

    share: function (title, text) {
        if (navigator.share) {
            navigator.share({
                title: title || 'K-POP Korean Learning',
                text: text || 'I am learning Korean with K-POP Korean Learning Game!',
                url: window.location.href
            }).catch(function () {
                // User cancelled or error, try clipboard fallback
                PWAFeatures._clipboardFallback(text || title || '');
            });
        } else {
            // Clipboard fallback
            this._clipboardFallback(text || title || window.location.href);
        }
    },

    _clipboardFallback: function (text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
                if (typeof showPopup === 'function') {
                    showPopup('Copied!', 'Text copied to clipboard.');
                }
            }).catch(function () {
                PWAFeatures._legacyCopy(text);
            });
        } else {
            this._legacyCopy(text);
        }
    },

    _legacyCopy: function (text) {
        try {
            var textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            if (typeof showPopup === 'function') {
                showPopup('Copied!', 'Text copied to clipboard.');
            }
        } catch (e) {
            // Copy not supported
        }
    },

    updateBadge: function (count) {
        try {
            if (navigator.setAppBadge) {
                if (count > 0) {
                    navigator.setAppBadge(count);
                } else {
                    navigator.clearAppBadge();
                }
            }
        } catch (e) {
            // Badge API not supported
        }
    },

    keepScreenOn: function () {
        if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen').then(function (lock) {
                PWAFeatures._wakeLock = lock;
                lock.addEventListener('release', function () {
                    PWAFeatures._wakeLock = null;
                });
            }).catch(function () {
                // Wake Lock request failed
            });
        }
    },

    releaseScreen: function () {
        if (this._wakeLock) {
            this._wakeLock.release().then(function () {
                PWAFeatures._wakeLock = null;
            }).catch(function () {});
        }
    },

    toggleFullscreen: function () {
        try {
            if (!document.fullscreenElement &&
                !document.webkitFullscreenElement &&
                !document.mozFullScreenElement) {
                var el = document.documentElement;
                if (el.requestFullscreen) {
                    el.requestFullscreen();
                } else if (el.webkitRequestFullscreen) {
                    el.webkitRequestFullscreen();
                } else if (el.mozRequestFullScreen) {
                    el.mozRequestFullScreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
            }
        } catch (e) {
            // Fullscreen not supported
        }
    }
};


// ============================================================
// 5. YOUTUBE LEARNING HUB
// Curated Korean learning YouTube videos with category filters
// Video IDs verified from popular Korean learning channels
// ============================================================

var koreanYouTubeVideos = [
    {id:"uNDf0V06m0w",title:"[1 hour] Learn to Read Korean | Full Hangeul Course",channel:"Talk To Me In Korean",category:"hangul",level:"beginner"},
    {id:"s5aobqyEaMQ",title:"Learn Hangul in 90 Minutes - Start to Finish [Complete Series]",channel:"Learn Korean with GO! Billy Korean",category:"hangul",level:"beginner"},
    {id:"KN4mysljHYc",title:"Korean Alphabet - Learn to Read and Write Korean #1 - Hangul Basic Vowels",channel:"KoreanClass101",category:"hangul",level:"beginner"},
    {id:"85qJXvyFrIc",title:"Learn Hangeul (Korean Alphabet) in 30 minutes",channel:"Korean with Miss Vicky",category:"hangul",level:"beginner"},
    {id:"CdiR-6e1h0o",title:"Learn Korean 1: Pronounce the Alphabet",channel:"sweetandtastyTV",category:"hangul",level:"beginner"},
    {id:"tLLmotJ1Gec",title:"Learn Korean 2: Write the Alphabet (Basic Consonants + Vowels)",channel:"sweetandtastyTV",category:"hangul",level:"beginner"},
    {id:"Dpk_8Pc2eE8",title:"The Korean Alphabet Song That Teaches You Hangul Fast (Ga-Na-Da Song + King Sejong Story!)",channel:"Korean Unnie",category:"hangul",level:"beginner"},
    {id:"40ptgkHRTkw",title:"7 Beginner Korean Grammar Points in One Sentence!",channel:"Talk To Me In Korean",category:"grammar",level:"beginner"},
    {id:"fCxLNRLntc0",title:"One-Stop Guide to Korean Particles (Subject & Topic Markers)",channel:"Talk To Me In Korean",category:"grammar",level:"beginner"},
    {id:"zdU2wLkCRRI",title:"[20 Minutes] 80 Basic Korean Verbs in Present, Past and Future Tenses",channel:"Talk To Me In Korean",category:"grammar",level:"beginner"},
    {id:"WCmh1zWUXdE",title:"7 Basics in Korean Grammar (for beginners)",channel:"Korean with Miss Vicky",category:"grammar",level:"beginner"},
    {id:"EGv0-5JCCXY",title:"Korean Grammar for Absolute Beginners | Word Order & Core Particles",channel:"Korean with Miss Vicky",category:"grammar",level:"beginner"},
    {id:"K7dgMVKPTHw",title:"All About Verbs in Korean (Present Tense Conjugation)",channel:"Korean with Miss Vicky",category:"grammar",level:"intermediate"},
    {id:"CScmCj7NJZo",title:"Live Korean Class | [Beginner] Verb Endings",channel:"Learn Korean with GO! Billy Korean",category:"grammar",level:"beginner"},
    {id:"yo8fkdZ-fhc",title:"How to Conjugate Korean Verbs into Past Tense (Beginner-Friendly Guide!)",channel:"Korean Unnie",category:"grammar",level:"beginner"},
    {id:"Agt0mPj56Ug",title:"Grammar Breakdown: Particles, Tenses & Key Sentences | 10 Best Tales of Korea",channel:"Korean Unnie",category:"grammar",level:"intermediate"},
    {id:"HwhQdltnSls",title:"[50 Minutes] 100 Daily Korean Phrases for Beginners",channel:"Talk To Me In Korean",category:"conversation",level:"beginner"},
    {id:"JrACvLMZIXs",title:"30 Daily Korean Phrases for Beginners",channel:"Talk To Me In Korean",category:"conversation",level:"beginner"},
    {id:"6Y7VwFR5cDg",title:"1 HOUR Natural Korean Conversation - Listening Practice",channel:"Talk To Me In Korean",category:"conversation",level:"intermediate"},
    {id:"nsKQigN5p4M",title:"48 Basic Korean Phrases for ALL Situations to Start as a Beginner",channel:"KoreanClass101",category:"conversation",level:"beginner"},
    {id:"iZRkRIxiAXw",title:"100 Phrases Every Korean Beginner Must-Know",channel:"KoreanClass101",category:"conversation",level:"beginner"},
    {id:"ZinAK6n6cWU",title:"Learn Korean in 20 Minutes - ALL the Basics You Need",channel:"KoreanClass101",category:"conversation",level:"beginner"},
    {id:"HGu9C-ECVAY",title:"Korean Speaking Practice for Beginners | At a Convenience Store",channel:"Korean with Miss Vicky",category:"conversation",level:"beginner"},
    {id:"Bod7Oo-t2YU",title:"TOP 10 Must-Know Korean Phrases for SHOPPING!",channel:"Korean Unnie",category:"conversation",level:"beginner"},
    {id:"HMdnQOzF4pU",title:"Top 10 Must-Know Korean Restaurant Phrases",channel:"Korean Unnie",category:"conversation",level:"beginner"},
    {id:"A7qVwQk149w",title:"20 Useful Korean Phrases for Tourists",channel:"sweetandtastyTV",category:"conversation",level:"beginner"},
    {id:"q7wE4v7-HBs",title:"What Korean New Year Is REALLY Like (Not January 1st)",channel:"Korean Unnie",category:"culture",level:"beginner"},
    {id:"JMicJLJN_sU",title:"Why Small Talk is Different in Korea - Understanding the Culture",channel:"Learn Korean with GO! Billy Korean",category:"culture",level:"beginner"},
    {id:"GbhZ0RapV4U",title:"The History of Korea - Learn Korean History in Under 12 Minutes",channel:"Learn Korean with GO! Billy Korean",category:"culture",level:"intermediate"},
    {id:"T3i6JkuN1x0",title:"Why Do Korean People Eat Spicy Food?",channel:"KoreanClass101",category:"culture",level:"beginner"},
    {id:"FfcoBHG4V4Q",title:"25 Polite Korean Phrases for Every Formal Situation!",channel:"Korean Unnie",category:"culture",level:"beginner"},
    {id:"V_X6bLU0BiI",title:"COUNTRIES in Korean - Top 60 Requests! (KWOW#27)",channel:"sweetandtastyTV",category:"culture",level:"beginner"},
    {id:"qCmpU3ssip8",title:"K-pop Demon Hunters explained by a Korean teacher",channel:"Talk To Me In Korean",category:"kpop",level:"intermediate"},
    {id:"FDsthmQq79Q",title:"How did foreign IDOLS learn Korean so FAST?? (feat. Lisa, Minnie, Felix)",channel:"Talk To Me In Korean",category:"kpop",level:"beginner"},
    {id:"wuybAr2Ex48",title:"Learn Korean with BTS Phrases & K-Pop!",channel:"KoreanClass101",category:"kpop",level:"beginner"},
    {id:"U2DBNyIaymE",title:"How to Build K-Pop Sentences in Korean",channel:"KoreanClass101",category:"kpop",level:"beginner"},
    {id:"ET3PaXRNQtg",title:"BEAT IT in Korean - Common K-pop word (KWOW #46)",channel:"sweetandtastyTV",category:"kpop",level:"beginner"},
    {id:"xFnIX_tQa1c",title:"Korean Food Rap | Fun Way to Learn Korean Words! (Official MV)",channel:"Korean Unnie",category:"kpop",level:"beginner"}
];

function showYouTubeHub(c) {
    var activeCategory = 'all';
    var activeLevel = 'all';

    function renderHub() {
        var filtered = [];
        for (var i = 0; i < koreanYouTubeVideos.length; i++) {
            var v = koreanYouTubeVideos[i];
            var catMatch = activeCategory === 'all' || v.category === activeCategory;
            var lvlMatch = activeLevel === 'all' || v.level === activeLevel;
            if (catMatch && lvlMatch) {
                filtered.push(v);
            }
        }

        var h = '<h2 class="game-title">Korean Learning Videos</h2>';

        // Category filters
        h += '<div style="text-align:center;margin-bottom:12px;">';
        h += '<div style="margin-bottom:8px;color:rgba(255,255,255,0.6);font-size:0.8rem;">CATEGORY</div>';
        var categories = [
            { id: 'all', label: 'All' },
            { id: 'grammar', label: 'Grammar' },
            { id: 'conversation', label: 'Conversation' },
            { id: 'culture', label: 'Culture' },
            { id: 'kpop', label: 'K-Pop' }
        ];
        for (var ci = 0; ci < categories.length; ci++) {
            var cat = categories[ci];
            var catActive = activeCategory === cat.id ? ' active' : '';
            h += '<button class="cat-btn' + catActive + '" onclick="youtubeHubFilter(\'' + cat.id + '\', null)" style="margin:3px;">';
            h += escapeHtml(cat.label) + '</button>';
        }
        h += '</div>';

        // Level filters
        h += '<div style="text-align:center;margin-bottom:18px;">';
        h += '<div style="margin-bottom:8px;color:rgba(255,255,255,0.6);font-size:0.8rem;">LEVEL</div>';
        var levels = [
            { id: 'all', label: 'All Levels' },
            { id: 'beginner', label: 'Beginner' },
            { id: 'intermediate', label: 'Intermediate' },
            { id: 'advanced', label: 'Advanced' }
        ];
        for (var li = 0; li < levels.length; li++) {
            var lvl = levels[li];
            var lvlActive = activeLevel === lvl.id ? ' active' : '';
            h += '<button class="cat-btn' + lvlActive + '" onclick="youtubeHubFilter(null, \'' + lvl.id + '\')" style="margin:3px;">';
            h += escapeHtml(lvl.label) + '</button>';
        }
        h += '</div>';

        // Video player area
        h += '<div id="ytPlayerArea"></div>';

        // Video grid
        if (filtered.length === 0) {
            h += '<p style="text-align:center;color:rgba(255,255,255,0.5);padding:30px;">No videos found for this filter.</p>';
        } else {
            h += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:15px;">';
            for (var vi = 0; vi < filtered.length; vi++) {
                var video = filtered[vi];
                var levelColor = '#00d4ff';
                if (video.level === 'intermediate') levelColor = '#ffd700';
                if (video.level === 'advanced') levelColor = '#ff2d95';

                h += '<div style="background:var(--glass);border:1px solid rgba(157,78,221,0.3);border-radius:15px;overflow:hidden;cursor:pointer;transition:all 0.3s ease;" ';
                h += 'onclick="playYouTubeVideo(\'' + escapeHtml(video.id) + '\')" ';
                h += 'onmouseover="this.style.transform=\'translateY(-3px)\';this.style.boxShadow=\'0 10px 30px rgba(157,78,221,0.3)\'" ';
                h += 'onmouseout="this.style.transform=\'none\';this.style.boxShadow=\'none\'">';

                // Thumbnail
                h += '<div style="position:relative;padding-top:56.25%;background:#1a1a3e;">';
                h += '<img src="https://img.youtube.com/vi/' + escapeHtml(video.id) + '/mqdefault.jpg" ';
                h += 'alt="' + escapeHtml(video.title) + '" ';
                h += 'style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;" loading="lazy">';
                // Play button overlay
                h += '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);';
                h += 'width:50px;height:50px;background:rgba(255,45,149,0.9);border-radius:50%;';
                h += 'display:flex;align-items:center;justify-content:center;">';
                h += '<div style="width:0;height:0;border-top:10px solid transparent;border-bottom:10px solid transparent;';
                h += 'border-left:18px solid #fff;margin-left:4px;"></div></div>';
                h += '</div>';

                // Info
                h += '<div style="padding:12px;">';
                h += '<div style="font-size:0.9rem;font-weight:600;margin-bottom:6px;line-height:1.3;">' + escapeHtml(video.title) + '</div>';
                h += '<div style="font-size:0.75rem;color:rgba(255,255,255,0.5);margin-bottom:6px;">' + escapeHtml(video.channel) + '</div>';
                h += '<div style="display:flex;gap:6px;">';
                h += '<span style="font-size:0.7rem;padding:2px 8px;border-radius:10px;background:rgba(157,78,221,0.3);">' + escapeHtml(video.category) + '</span>';
                h += '<span style="font-size:0.7rem;padding:2px 8px;border-radius:10px;background:' + levelColor + ';color:#000;">' + escapeHtml(video.level) + '</span>';
                h += '</div></div></div>';
            }
            h += '</div>';
        }

        c.innerHTML = h;
    }

    // Store filter state and container reference
    window._ytHubContainer = c;
    window._ytHubCat = activeCategory;
    window._ytHubLvl = activeLevel;

    renderHub();

    // Expose filter function
    window.youtubeHubFilter = function (cat, lvl) {
        if (cat !== null) {
            activeCategory = cat;
            window._ytHubCat = cat;
        }
        if (lvl !== null) {
            activeLevel = lvl;
            window._ytHubLvl = lvl;
        }
        renderHub();
    };
}

function playYouTubeVideo(videoId) {
    var area = document.getElementById('ytPlayerArea');
    if (!area) return;

    var h = '<div style="position:relative;padding-top:56.25%;margin-bottom:15px;border-radius:12px;overflow:hidden;';
    h += 'border:2px solid rgba(255,45,149,0.3);">';
    h += '<iframe src="https://www.youtube.com/embed/' + escapeHtml(videoId) + '?autoplay=1&rel=0" ';
    h += 'style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" ';
    h += 'sandbox="allow-scripts allow-same-origin allow-presentation" ';
    h += 'allow="autoplay; encrypted-media" allowfullscreen loading="lazy"></iframe>';
    h += '</div>';
    h += '<div style="text-align:center;margin-bottom:15px;">';
    h += '<button class="game-btn secondary" onclick="closeYouTubePlayer()">Close Video</button>';
    h += '</div>';

    area.innerHTML = h;
    area.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeYouTubePlayer() {
    var area = document.getElementById('ytPlayerArea');
    if (area) {
        area.innerHTML = '';
    }
}


// ============================================================
// 6. DAILY KOREAN FUN FACT
// 35+ fun facts about Korean language and culture
// ============================================================

var koreanFunFacts = [
    {
        fact: 'Hangul was invented by King Sejong the Great in 1443. It was designed so that even common people could easily learn to read and write.',
        category: 'language'
    },
    {
        fact: 'October 9th is Hangul Day (한글날), a national holiday in South Korea celebrating the creation of the Korean alphabet.',
        category: 'culture'
    },
    {
        fact: 'Korean has 7 speech levels of formality. Choosing the right level is essential in Korean social interactions.',
        category: 'language'
    },
    {
        fact: 'The Korean alphabet has 14 basic consonants and 10 basic vowels, making it one of the smallest alphabets in the world.',
        category: 'language'
    },
    {
        fact: 'The shapes of Hangul consonants were designed to represent the shape of the mouth and tongue when pronouncing them.',
        category: 'language'
    },
    {
        fact: 'Korean is spoken by approximately 80 million people worldwide, making it one of the top 20 most spoken languages.',
        category: 'language'
    },
    {
        fact: 'Before Hangul was created, Koreans used Chinese characters (Hanja) to write. Some Hanja are still used today in formal contexts.',
        category: 'language'
    },
    {
        fact: 'Korean sentence structure follows Subject-Object-Verb (SOV) order, unlike English which uses Subject-Verb-Object (SVO).',
        category: 'language'
    },
    {
        fact: 'Korea has a unique age counting system called "Korean age" (한국 나이) where everyone is 1 year old at birth.',
        category: 'culture'
    },
    {
        fact: 'Kimchi (김치) has over 200 varieties and is so important to Korean culture that there is a museum dedicated to it in Seoul.',
        category: 'culture'
    },
    {
        fact: 'South Korea consistently ranks among the countries with the fastest average internet speeds in the world.',
        category: 'culture'
    },
    {
        fact: 'The word "K-POP" was first used in the late 1990s by media to describe Korean popular music, and it has since become a global phenomenon.',
        category: 'culture'
    },
    {
        fact: 'Taekwondo (태권도) originated in Korea and became an official Olympic sport in 2000.',
        category: 'culture'
    },
    {
        fact: 'Soju (소주) is the world\'s best-selling spirit by volume. South Koreans consume an average of 13.7 shots of alcohol per week.',
        category: 'culture'
    },
    {
        fact: 'Korea has a unique underfloor heating system called Ondol (온돌) that has been used for over 2,000 years.',
        category: 'culture'
    },
    {
        fact: 'Linguists often call Hangul one of the most scientific and logical writing systems ever created.',
        category: 'language'
    },
    {
        fact: 'Korean dramas (K-dramas) have contributed to the Korean Wave (Hallyu/한류), spreading Korean culture worldwide.',
        category: 'culture'
    },
    {
        fact: 'Seoul (서울) means "capital" in Korean. It is one of the largest metropolitan areas in the world.',
        category: 'culture'
    },
    {
        fact: 'Korean names typically consist of a one-syllable family name and a two-syllable given name. About 50% of Koreans have the surname Kim, Lee, or Park.',
        category: 'culture'
    },
    {
        fact: '"Oppa" (오빠) means "older brother" (from a female perspective), but it is also commonly used as a term of endearment.',
        category: 'language'
    },
    {
        fact: 'Korean has borrowed many English words, creating "Konglish" (콩글리시). For example, "handphone" means mobile phone.',
        category: 'language'
    },
    {
        fact: 'Bibimbap (비빔밥) literally translates to "mixed rice" - "bibim" means mixing and "bap" means rice.',
        category: 'culture'
    },
    {
        fact: 'Korean uses two number systems simultaneously: native Korean numbers and Sino-Korean (Chinese-origin) numbers, each used in different contexts.',
        category: 'language'
    },
    {
        fact: 'Jeju Island (제주도) has its own distinct Korean dialect that is sometimes considered a separate language because mainland Koreans often cannot understand it.',
        category: 'language'
    },
    {
        fact: 'The Korean flag (태극기) features a red and blue yin-yang symbol surrounded by four trigrams representing heaven, earth, water, and fire.',
        category: 'culture'
    },
    {
        fact: 'Korea is known as the "Land of Morning Calm" (조용한 아침의 나라), a poetic name reflecting its natural beauty.',
        category: 'culture'
    },
    {
        fact: 'The word "Fighting!" (화이팅/파이팅) is used in Korean as a cheer of encouragement, similar to "You can do it!".',
        category: 'language'
    },
    {
        fact: 'Chuseok (추석) is the Korean harvest festival, similar to Thanksgiving. Families gather to honor ancestors and share traditional foods.',
        category: 'culture'
    },
    {
        fact: 'The Korean skincare routine typically involves 10 or more steps and has influenced beauty standards worldwide.',
        category: 'culture'
    },
    {
        fact: 'In Korean, the verb always comes at the end of the sentence. You can change the entire meaning by changing just the ending.',
        category: 'language'
    },
    {
        fact: 'There is no letter "F" or "V" sound in native Korean. Koreans often substitute "P" for "F" and "B" for "V".',
        category: 'language'
    },
    {
        fact: 'Korea has a "blood type personality" belief. Many Koreans believe blood type influences personality, similar to zodiac signs in the West.',
        category: 'culture'
    },
    {
        fact: 'The Korean word "nunchi" (눈치) refers to the art of reading the atmosphere and understanding others\' feelings. It is considered essential in Korean society.',
        category: 'language'
    },
    {
        fact: 'In Korea, slurping noodles loudly is not rude - it actually signals that you are enjoying the meal!',
        category: 'culture'
    },
    {
        fact: 'Korean has a special counting word system called "classifiers" (수분류사). Different objects require different counting words.',
        category: 'language'
    }
];

function showDailyFact(c) {
    // Pick one fact per day based on date
    var today = new Date();
    var dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % koreanFunFacts.length;
    var todayFact = koreanFunFacts[dayIndex];

    var categoryIcon = todayFact.category === 'language' ? 'A' : 'C';
    var categoryLabel = todayFact.category === 'language' ? 'Language' : 'Culture';
    var categoryColor = todayFact.category === 'language' ? 'var(--neon-blue)' : 'var(--neon-pink)';

    var h = '<h2 class="game-title">Daily Korean Fun Fact</h2>';

    // Main fact card
    h += '<div style="background:linear-gradient(135deg,rgba(157,78,221,0.2),rgba(0,212,255,0.1));';
    h += 'border:2px solid rgba(157,78,221,0.4);border-radius:20px;padding:30px;margin:0 auto 20px;max-width:600px;text-align:center;">';

    // Header
    h += '<div style="font-size:1.4rem;font-weight:700;margin-bottom:15px;';
    h += 'background:linear-gradient(135deg,var(--neon-pink),var(--neon-cyan));';
    h += '-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Did you know?</div>';

    // Category badge
    h += '<div style="margin-bottom:15px;">';
    h += '<span style="display:inline-block;padding:4px 14px;border-radius:12px;font-size:0.75rem;';
    h += 'font-weight:600;background:' + categoryColor + ';color:#000;">' + categoryIcon + ' ' + categoryLabel + '</span>';
    h += '</div>';

    // Fact text
    h += '<div style="font-size:1.1rem;line-height:1.7;color:rgba(255,255,255,0.9);margin-bottom:20px;">';
    h += escapeHtml(todayFact.fact);
    h += '</div>';

    // Date
    h += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:15px;">';
    h += escapeHtml(today.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }));
    h += '</div>';

    // Share button
    h += '<button class="game-btn" onclick="shareDailyFact()" style="font-size:0.9rem;padding:10px 24px;">';
    h += 'Share This Fact</button>';

    h += '</div>';

    // Browse all facts
    h += '<div style="text-align:center;margin-bottom:15px;">';
    h += '<button class="game-btn secondary" onclick="showAllFacts()" style="font-size:0.85rem;">Browse All Facts (' + koreanFunFacts.length + ')</button>';
    h += '</div>';

    // All facts area
    h += '<div id="allFactsArea"></div>';

    c.innerHTML = h;
}

function shareDailyFact() {
    var today = new Date();
    var dayIndex = (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) % koreanFunFacts.length;
    var fact = koreanFunFacts[dayIndex];
    PWAFeatures.share(
        'Korean Fun Fact',
        'Did you know? ' + fact.fact + ' - from K-POP Korean Learning'
    );
}

function showAllFacts() {
    var area = document.getElementById('allFactsArea');
    if (!area) return;

    if (area.innerHTML !== '') {
        area.innerHTML = '';
        return;
    }

    var h = '<div style="display:grid;gap:12px;margin-top:15px;">';
    for (var i = 0; i < koreanFunFacts.length; i++) {
        var f = koreanFunFacts[i];
        var catColor = f.category === 'language' ? 'rgba(0,212,255,0.15)' : 'rgba(255,45,149,0.15)';
        var borderColor = f.category === 'language' ? 'rgba(0,212,255,0.3)' : 'rgba(255,45,149,0.3)';
        h += '<div style="background:' + catColor + ';border:1px solid ' + borderColor + ';';
        h += 'border-radius:12px;padding:15px;font-size:0.9rem;line-height:1.5;">';
        h += '<span style="font-weight:700;color:var(--neon-cyan);">#' + (i + 1) + '</span> ';
        h += escapeHtml(f.fact);
        h += '</div>';
    }
    h += '</div>';
    area.innerHTML = h;
}


// ============================================================
// 7. STROKE ORDER ANIMATION
// SVG-based stroke order for basic Hangul consonants and vowels
// ============================================================

var strokeOrderData = {
    // Consonants
    '\u3131': {
        name: 'Giyeok',
        romanization: 'g/k',
        strokes: [
            { d: 'M 20,25 L 75,25', label: '1' },
            { d: 'M 75,25 L 75,80', label: '2' }
        ]
    },
    '\u3134': {
        name: 'Nieun',
        romanization: 'n',
        strokes: [
            { d: 'M 25,20 L 25,75', label: '1' },
            { d: 'M 25,75 L 80,75', label: '2' }
        ]
    },
    '\u3137': {
        name: 'Digeut',
        romanization: 'd/t',
        strokes: [
            { d: 'M 20,20 L 80,20', label: '1' },
            { d: 'M 20,20 L 20,75', label: '2' },
            { d: 'M 20,75 L 80,75', label: '3' }
        ]
    },
    '\u3139': {
        name: 'Rieul',
        romanization: 'r/l',
        strokes: [
            { d: 'M 15,15 L 80,15', label: '1' },
            { d: 'M 80,15 L 80,33', label: '2' },
            { d: 'M 80,33 L 15,33', label: '3' },
            { d: 'M 15,33 L 15,55', label: '4' },
            { d: 'M 15,55 L 85,55 L 85,85', label: '5' }
        ]
    },
    '\u3141': {
        name: 'Mieum',
        romanization: 'm',
        strokes: [
            { d: 'M 20,20 L 20,80', label: '1' },
            { d: 'M 20,20 L 80,20', label: '2' },
            { d: 'M 80,20 L 80,80', label: '3' },
            { d: 'M 20,80 L 80,80', label: '4' }
        ]
    },
    '\u3142': {
        name: 'Bieup',
        romanization: 'b/p',
        strokes: [
            { d: 'M 25,15 L 25,85', label: '1' },
            { d: 'M 75,15 L 75,85', label: '2' },
            { d: 'M 25,50 L 75,50', label: '3' },
            { d: 'M 25,85 L 75,85', label: '4' }
        ]
    },
    '\u3145': {
        name: 'Siot',
        romanization: 's',
        strokes: [
            { d: 'M 50,15 L 20,85', label: '1' },
            { d: 'M 50,15 L 80,85', label: '2' }
        ]
    },
    '\u3147': {
        name: 'Ieung',
        romanization: 'ng (silent)',
        strokes: [
            { d: 'M 50,15 A 35,35 0 1,1 49.9,15', label: '1' }
        ]
    },
    '\u3148': {
        name: 'Jieut',
        romanization: 'j',
        strokes: [
            { d: 'M 20,15 L 80,15', label: '1' },
            { d: 'M 50,30 L 20,85', label: '2' },
            { d: 'M 50,30 L 80,85', label: '3' }
        ]
    },
    // Vowels
    '\u314F': {
        name: 'A',
        romanization: 'a',
        strokes: [
            { d: 'M 35,10 L 35,90', label: '1' },
            { d: 'M 35,45 L 70,45', label: '2' }
        ]
    },
    '\u3153': {
        name: 'Eo',
        romanization: 'eo',
        strokes: [
            { d: 'M 30,45 L 65,45', label: '1' },
            { d: 'M 65,10 L 65,90', label: '2' }
        ]
    },
    '\u3157': {
        name: 'O',
        romanization: 'o',
        strokes: [
            { d: 'M 50,55 L 50,20', label: '1' },
            { d: 'M 10,65 L 90,65', label: '2' }
        ]
    },
    '\u315C': {
        name: 'U',
        romanization: 'u',
        strokes: [
            { d: 'M 10,35 L 90,35', label: '1' },
            { d: 'M 50,45 L 50,80', label: '2' }
        ]
    },
    '\u3161': {
        name: 'Eu',
        romanization: 'eu',
        strokes: [
            { d: 'M 10,50 L 90,50', label: '1' }
        ]
    },
    '\u3163': {
        name: 'I',
        romanization: 'i',
        strokes: [
            { d: 'M 50,10 L 50,90', label: '1' }
        ]
    }
};

function showStrokeOrder(c) {
    var chars = [];
    for (var ch in strokeOrderData) {
        if (strokeOrderData.hasOwnProperty(ch)) {
            chars.push(ch);
        }
    }

    var h = '<h2 class="game-title">Hangul Stroke Order</h2>';
    h += '<p style="text-align:center;color:rgba(255,255,255,0.6);margin-bottom:20px;font-size:0.9rem;">';
    h += 'Learn the correct stroke order for basic Hangul characters. Tap a character to see the animation.</p>';

    // Consonants section
    h += '<div style="margin-bottom:8px;color:rgba(255,255,255,0.5);font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;text-align:center;">Consonants</div>';
    h += '<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:20px;">';
    var consonants = ['\u3131', '\u3134', '\u3137', '\u3139', '\u3141', '\u3142', '\u3145', '\u3147', '\u3148'];
    for (var ci = 0; ci < consonants.length; ci++) {
        var cc = consonants[ci];
        var cd = strokeOrderData[cc];
        h += '<button onclick="animateStrokeChar(\'' + cc + '\')" ';
        h += 'style="width:60px;height:60px;font-size:2rem;background:var(--glass);border:1px solid rgba(157,78,221,0.3);';
        h += 'color:#fff;border-radius:12px;cursor:pointer;transition:all 0.3s ease;" ';
        h += 'onmouseover="this.style.borderColor=\'var(--neon-pink)\';this.style.transform=\'translateY(-2px)\'" ';
        h += 'onmouseout="this.style.borderColor=\'rgba(157,78,221,0.3)\';this.style.transform=\'none\'" ';
        h += 'title="' + escapeHtml(cd.name) + ' (' + escapeHtml(cd.romanization) + ')">';
        h += cc + '</button>';
    }
    h += '</div>';

    // Vowels section
    h += '<div style="margin-bottom:8px;color:rgba(255,255,255,0.5);font-size:0.8rem;text-transform:uppercase;letter-spacing:1px;text-align:center;">Vowels</div>';
    h += '<div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:20px;">';
    var vowels = ['\u314F', '\u3153', '\u3157', '\u315C', '\u3161', '\u3163'];
    for (var vi = 0; vi < vowels.length; vi++) {
        var vc = vowels[vi];
        var vd = strokeOrderData[vc];
        h += '<button onclick="animateStrokeChar(\'' + vc + '\')" ';
        h += 'style="width:60px;height:60px;font-size:2rem;background:var(--glass);border:1px solid rgba(0,212,255,0.3);';
        h += 'color:#fff;border-radius:12px;cursor:pointer;transition:all 0.3s ease;" ';
        h += 'onmouseover="this.style.borderColor=\'var(--neon-cyan)\';this.style.transform=\'translateY(-2px)\'" ';
        h += 'onmouseout="this.style.borderColor=\'rgba(0,212,255,0.3)\';this.style.transform=\'none\'" ';
        h += 'title="' + escapeHtml(vd.name) + ' (' + escapeHtml(vd.romanization) + ')">';
        h += vc + '</button>';
    }
    h += '</div>';

    // Animation area
    h += '<div id="strokeAnimArea" style="text-align:center;"></div>';

    c.innerHTML = h;
}

var _strokeAnimTimer = null;

function animateStrokeChar(ch) {
    var data = strokeOrderData[ch];
    if (!data) return;

    // Clear any existing animation
    if (_strokeAnimTimer) {
        clearInterval(_strokeAnimTimer);
        _strokeAnimTimer = null;
    }

    var area = document.getElementById('strokeAnimArea');
    if (!area) return;

    var h = '<div style="background:var(--glass);border:2px solid rgba(157,78,221,0.4);border-radius:20px;padding:20px;max-width:400px;margin:0 auto;">';

    // Character info
    h += '<div style="text-align:center;margin-bottom:12px;">';
    h += '<span style="font-size:3rem;margin-right:15px;">' + ch + '</span>';
    h += '<span style="font-size:1.2rem;color:rgba(255,255,255,0.7);">' + escapeHtml(data.name) + ' [' + escapeHtml(data.romanization) + ']</span>';
    h += '</div>';

    // SVG canvas
    h += '<div style="display:flex;justify-content:center;margin-bottom:15px;">';
    h += '<svg id="strokeSvg" width="200" height="200" viewBox="0 0 100 100" ';
    h += 'style="background:rgba(0,0,0,0.3);border-radius:15px;border:1px solid rgba(255,255,255,0.1);">';

    // Grid lines for guidance
    h += '<line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" stroke-dasharray="2,2"/>';
    h += '<line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.08)" stroke-width="0.5" stroke-dasharray="2,2"/>';

    // All strokes hidden initially
    for (var i = 0; i < data.strokes.length; i++) {
        var stroke = data.strokes[i];
        h += '<path id="stroke_' + i + '" d="' + stroke.d + '" ';
        h += 'fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';

        // Animated stroke (will overlay)
        h += '<path id="strokeAnim_' + i + '" d="' + stroke.d + '" ';
        h += 'fill="none" stroke="#ff2d95" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" ';
        h += 'style="opacity:0;"/>';

        // Stroke number label (at midpoint approximation)
        var labelX = 0;
        var labelY = 0;
        var pathParts = stroke.d.split(/[ML]\s*/);
        if (pathParts.length >= 2) {
            var coords = [];
            for (var pi = 0; pi < pathParts.length; pi++) {
                var trimmed = pathParts[pi].trim();
                if (trimmed !== '') {
                    var xy = trimmed.split(/[\s,]+/);
                    if (xy.length >= 2) {
                        coords.push({ x: parseFloat(xy[0]), y: parseFloat(xy[1]) });
                    }
                }
            }
            if (coords.length >= 2) {
                labelX = (coords[0].x + coords[coords.length - 1].x) / 2;
                labelY = (coords[0].y + coords[coords.length - 1].y) / 2 - 6;
            }
        }
        h += '<text id="strokeLabel_' + i + '" x="' + labelX + '" y="' + labelY + '" ';
        h += 'fill="rgba(255,215,0,0)" font-size="8" font-weight="bold" text-anchor="middle">';
        h += stroke.label + '</text>';
    }

    h += '</svg></div>';

    // Controls
    h += '<div style="display:flex;justify-content:center;gap:10px;margin-bottom:10px;">';
    h += '<button id="strokePlayBtn" class="game-btn" onclick="playStrokeAnimation(\'' + ch + '\')" ';
    h += 'style="font-size:0.9rem;padding:10px 24px;">Play Animation</button>';
    h += '<button class="game-btn secondary" onclick="resetStrokeAnimation(\'' + ch + '\')" ';
    h += 'style="font-size:0.9rem;padding:10px 24px;">Reset</button>';
    h += '</div>';

    // Stroke count
    h += '<div style="text-align:center;color:rgba(255,255,255,0.5);font-size:0.8rem;">';
    h += data.strokes.length + ' stroke' + (data.strokes.length > 1 ? 's' : '') + '</div>';

    h += '</div>';

    area.innerHTML = h;

    // Also speak the character
    if (typeof speakKorean === 'function') {
        speakKorean(ch);
    }
}

function playStrokeAnimation(ch) {
    var data = strokeOrderData[ch];
    if (!data) return;

    // Clear any existing animation
    if (_strokeAnimTimer) {
        clearInterval(_strokeAnimTimer);
        _strokeAnimTimer = null;
    }

    var currentStroke = 0;
    var totalStrokes = data.strokes.length;

    // Reset all strokes
    for (var r = 0; r < totalStrokes; r++) {
        var animPath = document.getElementById('strokeAnim_' + r);
        var label = document.getElementById('strokeLabel_' + r);
        if (animPath) animPath.style.opacity = '0';
        if (label) label.setAttribute('fill', 'rgba(255,215,0,0)');
    }

    // Disable play button during animation
    var playBtn = document.getElementById('strokePlayBtn');
    if (playBtn) playBtn.disabled = true;

    _strokeAnimTimer = setInterval(function () {
        if (currentStroke >= totalStrokes) {
            clearInterval(_strokeAnimTimer);
            _strokeAnimTimer = null;
            if (playBtn) playBtn.disabled = false;
            return;
        }

        var animPath = document.getElementById('strokeAnim_' + currentStroke);
        var label = document.getElementById('strokeLabel_' + currentStroke);

        if (animPath) {
            // Flash effect
            animPath.style.opacity = '1';
            animPath.setAttribute('stroke', '#ff2d95');

            // Get path length for animation
            try {
                var pathLength = animPath.getTotalLength();
                animPath.style.strokeDasharray = pathLength;
                animPath.style.strokeDashoffset = pathLength;
                animPath.style.transition = 'stroke-dashoffset 0.5s ease-in-out';
                // Force reflow
                animPath.getBoundingClientRect();
                animPath.style.strokeDashoffset = '0';
            } catch (e) {
                // Fallback: just show the stroke
                animPath.style.opacity = '1';
            }

            // Fade to white after drawing
            setTimeout(function (path) {
                if (path) path.setAttribute('stroke', '#ffffff');
            }, 600, animPath);
        }

        if (label) {
            label.setAttribute('fill', 'rgba(255,215,0,0.9)');
        }

        // Play click sound
        if (ProSound.initialized) {
            ProSound.click();
        }

        currentStroke++;
    }, 700);
}

function resetStrokeAnimation(ch) {
    var data = strokeOrderData[ch];
    if (!data) return;

    if (_strokeAnimTimer) {
        clearInterval(_strokeAnimTimer);
        _strokeAnimTimer = null;
    }

    for (var i = 0; i < data.strokes.length; i++) {
        var animPath = document.getElementById('strokeAnim_' + i);
        var label = document.getElementById('strokeLabel_' + i);
        if (animPath) {
            animPath.style.opacity = '0';
            animPath.style.transition = 'none';
            try {
                var len = animPath.getTotalLength();
                animPath.style.strokeDashoffset = len;
            } catch (e) {}
        }
        if (label) {
            label.setAttribute('fill', 'rgba(255,215,0,0)');
        }
    }

    var playBtn = document.getElementById('strokePlayBtn');
    if (playBtn) playBtn.disabled = false;
}


// ============================================================
// 8. INTEGRATION BRIDGE
// Connects enhanced systems with existing app globals
// ============================================================

var _integrationInitialized = false;

function initExternalIntegrations() {
    if (_integrationInitialized) return;
    _integrationInitialized = true;

    // Initialize ProSound on first user interaction
    var initAudioOnce = function () {
        ProSound.init();
        document.removeEventListener('click', initAudioOnce);
        document.removeEventListener('touchstart', initAudioOnce);
        document.removeEventListener('keydown', initAudioOnce);
    };
    document.addEventListener('click', initAudioOnce);
    document.addEventListener('touchstart', initAudioOnce);
    document.addEventListener('keydown', initAudioOnce);

    // Override SoundEngine methods to use ProSound when initialized
    if (typeof SoundEngine !== 'undefined') {
        var _origCorrect = SoundEngine.correct;
        var _origWrong = SoundEngine.wrong;
        var _origLevelUp = SoundEngine.levelUp;
        var _origCombo = SoundEngine.combo;

        SoundEngine.correct = function () {
            if (ProSound.initialized) {
                ProSound.correct();
                Haptic.correct();
            } else {
                _origCorrect.call(SoundEngine);
            }
        };

        SoundEngine.wrong = function () {
            if (ProSound.initialized) {
                ProSound.wrong();
                Haptic.wrong();
            } else {
                _origWrong.call(SoundEngine);
            }
        };

        SoundEngine.levelUp = function () {
            if (ProSound.initialized) {
                ProSound.levelUp();
                Haptic.levelUp();
            } else {
                _origLevelUp.call(SoundEngine);
            }
        };

        SoundEngine.combo = function () {
            var comboCount = 0;
            if (typeof gameState !== 'undefined' && gameState.combo) {
                comboCount = gameState.combo;
            }
            if (ProSound.initialized) {
                ProSound.combo(comboCount);
                Haptic.combo();
            } else {
                _origCombo.call(SoundEngine);
            }
        };
    }

    // Override createConfetti to use ProConfetti when canvas-confetti is available
    if (typeof window.createConfetti === 'function') {
        var _origCreateConfetti = window.createConfetti;
        window.createConfetti = function (count) {
            if (typeof confetti === 'function') {
                // Use ProConfetti for enhanced effects
                if (count >= 60) {
                    ProConfetti.levelUp();
                } else if (count >= 40) {
                    ProConfetti.korean();
                } else {
                    ProConfetti.correct();
                }
            } else {
                // Fall back to original
                _origCreateConfetti(count);
            }
        };
    }

    // Start Wake Lock when studying (if PWA installed)
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        PWAFeatures.keepScreenOn();

        // Release when page is hidden
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                PWAFeatures.releaseScreen();
            } else {
                PWAFeatures.keepScreenOn();
            }
        });
    }

    // Add Haptic tap to all existing game buttons
    document.addEventListener('click', function (e) {
        var target = e.target;
        if (target && (
            target.classList.contains('game-btn') ||
            target.classList.contains('nav-btn') ||
            target.classList.contains('quiz-option') ||
            target.classList.contains('memory-card') ||
            target.classList.contains('cat-btn') ||
            target.classList.contains('power-btn')
        )) {
            Haptic.tap();
        }
    });

    // Update app badge with words learned count
    if (typeof gameState !== 'undefined') {
        PWAFeatures.updateBadge(gameState.wordsLearned || 0);
    }
}


// ============================================================
// AUTO-INITIALIZE
// Run integration bridge when DOM is ready
// ============================================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExternalIntegrations);
} else {
    initExternalIntegrations();
}

/**
 * api-wiki-reader.js
 * Korean Wikipedia Reader for K-POP Korean Learning.
 * Provides reading practice, comprehension, and vocabulary extraction.
 * API: ko.wikipedia.org Action API (CSP pre-approved).
 * @requires security-utils.js (escapeHtml)
 * @requires main-app.js (addXP, speakKorean, showToast)
 */
(function () {
    "use strict";
    /** @type {string} */ var WIKI_API = "https://ko.wikipedia.org/w/api.php";
    /** @type {number} */ var CACHE_TTL = 3600000;
    /** @type {string} */ var CP = "wikiReader_";
    /** @type {number} */ var MAX_CACHED = 10;

    /** @type {Array<{title:string,extract:string,vocabulary:Array<{word:string,meaning:string}>}>} */
    var FB = [
        {title:"\uD55C\uAE00",extract:"\uD55C\uAE00\uC740 \uD55C\uAD6D\uC5B4\uB97C \uD45C\uAE30\uD558\uAE30 \uC704\uD574 \uB9CC\uB4E4\uC5B4\uC9C4 \uBB38\uC790\uB85C, \uC138\uC885\uB300\uC655\uC774 1443\uB144\uC5D0 \uCC3D\uC81C\uD558\uC600\uB2E4. \uACFC\uD559\uC801\uC774\uACE0 \uCCB4\uACC4\uC801\uC778 \uBB38\uC790 \uCCB4\uACC4\uB85C \uD3C9\uAC00\uBC1B\uC73C\uBA70 \uD604\uC7AC \uC804 \uC138\uACC4\uC801\uC73C\uB85C \uC5B8\uC5B4\uD559\uC790\uB4E4\uC758 \uC8FC\uBAA9\uC744 \uBC1B\uACE0 \uC788\uB2E4. \uD55C\uAE00\uC740 \uC790\uC74C\uACFC \uBAA8\uC74C\uC744 \uC870\uD569\uD558\uC5EC \uC74C\uC808\uC744 \uC774\uB8E8\uB294 \uB3C5\uD2B9\uD55C \uAD6C\uC870\uB97C \uAC00\uC9C0\uACE0 \uC788\uB2E4.",vocabulary:[{word:"\uBB38\uC790",meaning:"letter"},{word:"\uCC3D\uC81C",meaning:"creation"},{word:"\uACFC\uD559\uC801",meaning:"scientific"},{word:"\uCCB4\uACC4\uC801",meaning:"systematic"},{word:"\uC5B8\uC5B4\uD559\uC790",meaning:"linguist"}]},
        {title:"\uAE40\uCE58",extract:"\uAE40\uCE58\uB294 \uBC30\uCD94, \uBB34 \uB4F1\uC758 \uCC44\uC18C\uB97C \uC18C\uAE08\uC5D0 \uC808\uC5EC \uACE0\uCD67\uAC00\uB8E8, \uB9C8\uB298 \uB4F1\uC758 \uC591\uB150\uC73C\uB85C \uBC84\uBB34\uB9B0 \uD55C\uAD6D\uC758 \uC804\uD1B5 \uBC1C\uD6A8 \uC74C\uC2DD\uC774\uB2E4. \uAE40\uCE58\uB294 \uD55C\uAD6D \uC74C\uC2DD \uBB38\uD654\uC758 \uD575\uC2EC\uC73C\uB85C \uC720\uB124\uC2A4\uCF54 \uC778\uB958\uBB34\uD615\uBB38\uD654\uC720\uC0B0\uC73C\uB85C \uB4F1\uC7AC\uB418\uC5C8\uB2E4. \uBC1C\uD6A8 \uACFC\uC815\uC5D0\uC11C \uC720\uC0B0\uADE0\uC774 \uC0DD\uC131\uB418\uC5B4 \uAC74\uAC15\uC5D0\uB3C4 \uC88B\uB2E4.",vocabulary:[{word:"\uBC1C\uD6A8",meaning:"fermentation"},{word:"\uC591\uB150",meaning:"seasoning"},{word:"\uC804\uD1B5",meaning:"tradition"},{word:"\uC720\uC0B0\uADE0",meaning:"lactic bacteria"},{word:"\uCC44\uC18C",meaning:"vegetable"}]},
        {title:"\uC11C\uC6B8",extract:"\uC11C\uC6B8\uD2B9\uBCC4\uC2DC\uB294 \uB300\uD55C\uBBFC\uAD6D\uC758 \uC218\uB3C4\uC774\uC790 \uCD5C\uB300 \uB3C4\uC2DC\uC774\uB2E4. \uD55C\uAC15\uC744 \uC911\uC2EC\uC73C\uB85C \uBC1C\uC804\uD55C \uB3C4\uC2DC\uB85C \uC778\uAD6C\uAC00 \uC57D 1000\uB9CC \uBA85\uC774\uB2E4. \uACBD\uBCF5\uAD81, \uBA85\uB3D9, \uAC15\uB0A8 \uB4F1 \uC138\uACC4\uC801\uC73C\uB85C \uC720\uBA85\uD55C \uAD00\uAD11\uC9C0\uAC00 \uB9CE\uC73C\uBA70 \uD604\uB300\uC801\uC778 \uB3C4\uC2DC \uAE30\uBC18\uC2DC\uC124\uACFC \uC804\uD1B5 \uBB38\uD654\uAC00 \uC870\uD654\uB97C \uC774\uB8E8\uACE0 \uC788\uB2E4.",vocabulary:[{word:"\uC218\uB3C4",meaning:"capital"},{word:"\uAD00\uAD11\uC9C0",meaning:"tourist spot"},{word:"\uAE30\uBC18\uC2DC\uC124",meaning:"infrastructure"},{word:"\uC870\uD654",meaning:"harmony"},{word:"\uD604\uB300\uC801",meaning:"modern"}]},
        {title:"BTS",extract:"BTS(\uBC29\uD0C4\uC18C\uB144\uB2E8)\uB294 \uB300\uD55C\uBBFC\uAD6D\uC758 \uBCF4\uC774 \uADF8\uB8F9\uC73C\uB85C \uC804 \uC138\uACC4\uC801\uC73C\uB85C \uD070 \uC778\uAE30\uB97C \uC5BB\uACE0 \uC788\uB2E4. \uD55C\uAD6D \uC74C\uC545\uC758 \uC138\uACC4\uD654\uC5D0 \uD06C\uAC8C \uAE30\uC5EC\uD558\uC600\uC73C\uBA70 \uBE4C\uBCF4\uB4DC \uD2F0\uCC28\uD2B8\uC5D0\uC11C \uC5EC\uB7EC \uCC28\uB840 1\uC704\uB97C \uCC28\uC9C0\uD588\uB2E4. \uC0AC\uD68C\uC801 \uBA54\uC2DC\uC9C0\uB97C \uB2F4\uC740 \uAC00\uC0AC\uC640 \uAC15\uB82C\uD55C \uD37C\uD3EC\uBA3C\uC2A4\uB85C \uC804 \uC138\uACC4 \uD314\uC744 \uC0AC\uB85C\uC7A1\uC558\uB2E4.",vocabulary:[{word:"\uC138\uACC4\uD654",meaning:"globalization"},{word:"\uAE30\uC5EC",meaning:"contribution"},{word:"\uAC00\uC0AC",meaning:"lyrics"},{word:"\uAC15\uB82C\uD55C",meaning:"powerful"},{word:"\uD37C\uD3EC\uBA3C\uC2A4",meaning:"performance"}]},
        {title:"\uD0DC\uAD8C\uB3C4",extract:"\uD0DC\uAD8C\uB3C4\uB294 \uD55C\uAD6D\uC758 \uC804\uD1B5 \uBB34\uC608\uB85C \uC190\uACFC \uBC1C\uC744 \uC0AC\uC6A9\uD55C \uACF5\uACA9\uACFC \uBC29\uC5B4 \uAE30\uC220 \uCCB4\uACC4\uC774\uB2E4. 2000\uB144\uBD80\uD130 \uC62C\uB9BC\uD53D \uC815\uC2DD \uC885\uBAA9\uC774\uBA70 \uC804 \uC138\uACC4 200\uC5EC \uAC1C\uAD6D\uC5D0\uC11C \uC218\uB828\uB418\uACE0 \uC788\uB2E4. \uC608\uC808\uC744 \uC911\uC2DC\uD558\uBA70 \uC815\uC2E0\uC801 \uC218\uC591\uACFC \uC2E0\uCCB4\uC801 \uAC15\uC778\uD568\uC744 \uBAA8\uB450 \uCD94\uAD6C\uD55C\uB2E4.",vocabulary:[{word:"\uBB34\uC608",meaning:"martial art"},{word:"\uBC29\uC5B4",meaning:"defense"},{word:"\uC218\uB828",meaning:"training"},{word:"\uC608\uC808",meaning:"courtesy"},{word:"\uC218\uC591",meaning:"cultivation"}]},
        {title:"\uBE44\uBE54\uBC25",extract:"\uBE44\uBE54\uBC25\uC740 \uBC25 \uC704\uC5D0 \uC5EC\uB7EC \uAC00\uC9C0 \uB098\uBB3C\uACFC \uACE0\uCD94\uC7A5\uC744 \uB123\uC5B4 \uBE44\uBCA8 \uBA39\uB294 \uD55C\uAD6D \uC694\uB9AC\uC774\uB2E4. \uC804\uC8FC\uBE44\uBE54\uBC25\uC774 \uD2B9\uD788 \uC720\uBA85\uD558\uBA70 \uC601\uC591\uC18C\uAC00 \uD48D\uBD80\uD558\uACE0 \uADE0\uD615 \uC7A1\uD78C \uC2DD\uC0AC\uB85C \uC54C\uB824\uC838 \uC788\uB2E4. \uB2E4\uC591\uD55C \uC7AC\uB8CC\uAC00 \uC5B4\uC6B0\uB7EC\uC838 \uC0C9\uAC10\uACFC \uB9DB\uC774 \uD48D\uBD80\uD558\uB2E4.",vocabulary:[{word:"\uB098\uBB3C",meaning:"seasoned veg"},{word:"\uC694\uB9AC",meaning:"dish"},{word:"\uC601\uC591\uC18C",meaning:"nutrients"},{word:"\uADE0\uD615",meaning:"balance"},{word:"\uC7AC\uB8CC",meaning:"ingredients"}]},
        {title:"\uD55C\uBCF5",extract:"\uD55C\uBCF5\uC740 \uD55C\uAD6D\uC758 \uC804\uD1B5 \uC758\uBCF5\uC73C\uB85C \uACE0\uC720\uD55C \uC544\uB984\uB2E4\uC6C0\uACFC \uC6B0\uC544\uD55C \uC120\uC774 \uD2B9\uC9D5\uC774\uB2E4. \uBA85\uC808\uC774\uB098 \uD2B9\uBCC4\uD55C \uB0A0\uC5D0 \uC8FC\uB85C \uC785\uC73C\uBA70 \uC5EC\uC131\uC758 \uD55C\uBCF5\uC740 \uC800\uACE0\uB9AC\uC640 \uCE58\uB9C8, \uB0A8\uC131\uC758 \uD55C\uBCF5\uC740 \uBC14\uC9C0\uC640 \uC800\uACE0\uB9AC\uB85C \uAD6C\uC131\uB41C\uB2E4. \uD604\uB300\uC5D0\uB294 \uD55C\uBCF5\uC758 \uD604\uB300\uD654\uAC00 \uC774\uB8E8\uC5B4\uC9C0\uACE0 \uC788\uB2E4.",vocabulary:[{word:"\uC758\uBCF5",meaning:"clothing"},{word:"\uBA85\uC808",meaning:"holiday"},{word:"\uC800\uACE0\uB9AC",meaning:"jeogori"},{word:"\uCE58\uB9C8",meaning:"chima (skirt)"},{word:"\uD604\uB300\uD654",meaning:"modernization"}]},
        {title:"\uACBD\uBCF5\uAD81",extract:"\uACBD\uBCF5\uAD81\uC740 \uC870\uC120 \uC655\uC870\uC758 \uBC95\uAD81\uC73C\uB85C \uC11C\uC6B8\uD2B9\uBCC4\uC2DC \uC885\uB85C\uAD6C\uC5D0 \uC704\uCE58\uD574 \uC788\uB2E4. 1395\uB144\uC5D0 \uCC3D\uAC74\uB418\uC5C8\uC73C\uBA70 \uC870\uC120\uC758 \uB300\uD45C\uC801\uC778 \uAD81\uAD90\uC774\uB2E4. \uADFC\uC815\uC804, \uACBD\uD68C\uB8E8, \uD5A5\uC6D0\uC815 \uB4F1 \uC544\uB984\uB2E4\uC6B4 \uAC74\uCD95\uBB3C\uB4E4\uC774 \uC788\uC73C\uBA70 \uB9CE\uC740 \uAD00\uAD11\uAC1D\uC774 \uBC29\uBB38\uD55C\uB2E4.",vocabulary:[{word:"\uBC95\uAD81",meaning:"main palace"},{word:"\uCC3D\uAC74",meaning:"founding"},{word:"\uAD81\uAD90",meaning:"palace"},{word:"\uAC74\uCD95\uBB3C",meaning:"building"},{word:"\uAD00\uAD11\uAC1D",meaning:"tourist"}]},
        {title:"\uC81C\uC8FC\uB3C4",extract:"\uC81C\uC8FC\uB3C4\uB294 \uB300\uD55C\uBBFC\uAD6D \uCD5C\uB300\uC758 \uC12C\uC73C\uB85C \uC544\uB984\uB2E4\uC6B4 \uC790\uC5F0\uACBD\uAD00\uACFC \uB3C5\uD2B9\uD55C \uBB38\uD654\uB85C \uC720\uBA85\uD558\uB2E4. \uC720\uB124\uC2A4\uCF54 \uC138\uACC4\uC790\uC5F0\uC720\uC0B0\uC5D0 \uB4F1\uC7AC\uB418\uC5B4 \uC788\uC73C\uBA70 \uD55C\uB77C\uC0B0, \uC131\uC0B0\uC77C\uCD9C\uBD09, \uB9CC\uC7A5\uAD74 \uB4F1 \uBCFC\uAC70\uB9AC\uAC00 \uD48D\uBD80\uD558\uB2E4.",vocabulary:[{word:"\uC12C",meaning:"island"},{word:"\uC790\uC5F0\uACBD\uAD00",meaning:"natural scenery"},{word:"\uB4F1\uC7AC",meaning:"listing"},{word:"\uBCFC\uAC70\uB9AC",meaning:"attraction"},{word:"\uD574\uB140",meaning:"women divers"}]},
        {title:"\uC138\uC885\uB300\uC655",extract:"\uC138\uC885\uB300\uC655\uC740 \uC870\uC120\uC758 \uC81C4\uB300 \uAD6D\uC655\uC73C\uB85C \uD55C\uAE00\uC744 \uCC3D\uC81C\uD55C \uAC83\uC73C\uB85C \uAC00\uC7A5 \uC720\uBA85\uD558\uB2E4. \uC7AC\uC704 \uAE30\uAC04 \uB3D9\uC548 \uACFC\uD559, \uBB38\uD654, \uC608\uC220 \uBD84\uC57C\uC5D0\uC11C \uD070 \uC5C5\uC801\uC744 \uB0A8\uACBC\uB2E4. \uCE21\uC6B0\uAE30, \uD574\uC2DC\uACC4 \uB4F1 \uBC1C\uBA85\uD488\uC744 \uB9CC\uB4E4\uC5C8\uC73C\uBA70 \uBC31\uC131\uC744 \uC704\uD55C \uC815\uCE58\uB97C \uD3BC\uCCE4\uB2E4.",vocabulary:[{word:"\uAD6D\uC655",meaning:"king"},{word:"\uC5C5\uC801",meaning:"achievement"},{word:"\uBC1C\uBA85\uD488",meaning:"invention"},{word:"\uBC31\uC131",meaning:"citizens"},{word:"\uC815\uCE58",meaning:"politics"}]}
    ];

    /** @type {{articlesRead:number,wordFrequency:Object<string,number>,knownWords:string[],learningWords:string[]}} */
    var S = {articlesRead:0, wordFrequency:{}, knownWords:[], learningWords:[]};

    /* ===== Cache ===== */
    /** @param {string} k @returns {Object|null} */
    function getCached(k) {
        try { var r=localStorage.getItem(CP+k); if(!r)return null; var o=JSON.parse(r);
            if(Date.now()-o.ts>CACHE_TTL){localStorage.removeItem(CP+k);return null;} return o.data;
        } catch(e){return null;}
    }
    /** @param {string} k @param {Object} d */
    function setCache(k,d) {
        try { pruneCache(); localStorage.setItem(CP+k,JSON.stringify({ts:Date.now(),data:d}));
        } catch(e){}
    }
    /** Remove oldest cached articles beyond MAX_CACHED */
    function pruneCache() {
        try { var keys=[]; for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);
            if(k&&k.indexOf(CP+"article_")===0){var r=localStorage.getItem(k);
                if(r){var p=JSON.parse(r);keys.push({key:k,ts:p.ts||0});}}}
            keys.sort(function(a,b){return a.ts-b.ts;});
            while(keys.length>=MAX_CACHED)localStorage.removeItem(keys.shift().key);
        } catch(e){}
    }
    /** Load reader state from localStorage */
    function loadState() {
        try { var r=localStorage.getItem(CP+"state"); if(!r)return; var s=JSON.parse(r);
            S.articlesRead=s.articlesRead||0; S.wordFrequency=s.wordFrequency||{};
            S.knownWords=s.knownWords||[]; S.learningWords=s.learningWords||[];
        } catch(e){}
    }
    /** Persist reader state */
    function saveState() { try{localStorage.setItem(CP+"state",JSON.stringify(S));}catch(e){} }

    /* ===== API ===== */
    /** @returns {Promise<{title:string,extract:string}>} */
    async function fetchRandomArticle() {
        var cached=getCached("lastRandom");
        try {
            var url=WIKI_API+"?action=query&generator=random&grnnamespace=0&prop=extracts&exchars=500&exlimit=1&format=json&origin=*";
            var res=await fetch(url); if(!res.ok)throw new Error(res.status);
            var json=await res.json(); var pages=json.query&&json.query.pages; if(!pages)throw new Error("No pages");
            var pid=Object.keys(pages)[0],pg=pages[pid];
            var ext=(pg.extract||"").replace(/<[^>]+>/g,"").trim();
            if(!ext||ext.length<50)throw new Error("Short"); var a={title:pg.title||"",extract:ext};
            setCache("article_"+pg.title,a); return a;
        } catch(e) { if(cached)return cached; var f=FB[Math.floor(Math.random()*FB.length)];
            return {title:f.title,extract:f.extract}; }
    }

    /* ===== Text Analysis ===== */
    /** @param {number} c @returns {boolean} */ function isHangul(c){return c>=0xAC00&&c<=0xD7AF;}
    /** @param {string} t @returns {string[]} */
    function extractWords(t) {
        var m=t.match(/[\uAC00-\uD7AF]{2,}/g)||[],seen={},r=[];
        for(var i=0;i<m.length;i++){if(!seen[m[i]]){seen[m[i]]=true;r.push(m[i]);}} return r;
    }
    /** @param {string} w @returns {number} */
    function sylCount(w){var c=0;for(var i=0;i<w.length;i++)if(isHangul(w.charCodeAt(i)))c++;return c;}
    /** @param {string} t @returns {{level:string,label:string,color:string}} */
    function getDiff(t) {
        var w=extractWords(t); if(!w.length)return{level:"beginner",label:"Beginner",color:"var(--neon-cyan)"};
        var ts=0,cx=0; for(var i=0;i<w.length;i++){var s=sylCount(w[i]);ts+=s;if(s>=3)cx++;}
        var avg=ts/w.length,r=cx/w.length;
        if(avg>3||r>0.5)return{level:"advanced",label:"Advanced",color:"var(--neon-pink)"};
        if(avg>2||r>0.3)return{level:"intermediate",label:"Intermediate",color:"var(--neon-purple)"};
        return{level:"beginner",label:"Beginner",color:"var(--neon-cyan)"};
    }
    /** @param {string} t @returns {number} */
    function readTime(t){return Math.max(1,Math.round(extractWords(t).length/60));}
    /** @param {string[]} w */
    function updateFreq(w){for(var i=0;i<w.length;i++)S.wordFrequency[w[i]]=(S.wordFrequency[w[i]]||0)+1;saveState();}
    /** @param {string} title @returns {Array<{word:string,meaning:string}>} */
    function getVocab(title){for(var i=0;i<FB.length;i++)if(FB[i].title===title)return FB[i].vocabulary;return[];}

    /* ===== UI Helpers ===== */
    /** @returns {string} */ function loading(){return '<div style="text-align:center;padding:40px;"><div class="game-loading-spinner"></div><p style="color:rgba(255,255,255,0.5);margin-top:12px;">Loading article...</p></div>';}
    /** @param {HTMLElement} el @param {Object<string,function>} map */
    function bind(el,map){el.addEventListener("click",function(e){var b=e.target.closest("[data-action]");if(!b||!el.contains(b))return;var fn=map[b.getAttribute("data-action")];if(fn)fn(b.getAttribute("data-param")||"",b);});}
    /** @param {string} t @returns {string} */
    function highlight(t){return escapeHtml(t).replace(/[\uAC00-\uD7AF]{3,}/g,function(m){if(sylCount(m)>=3)return'<span style="background:rgba(255,45,149,0.2);border-bottom:2px solid var(--neon-pink);padding:0 2px;border-radius:3px;cursor:pointer;" data-action="lookupWord" data-param="'+escapeHtml(m)+'">'+escapeHtml(m)+'</span>';return escapeHtml(m);});}
    /** @param {Array} a @returns {Array} */
    function shuf(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
    /** @param {string[]} l @param {string} w */ function addTo(l,w){if(l.indexOf(w)<0)l.push(w);}
    /** @param {string[]} l @param {string} w */ function rmFrom(l,w){var i=l.indexOf(w);if(i>=0)l.splice(i,1);}

    /* ===== MODE 1: Korean Reader ===== */
    /** Display random Korean Wikipedia article with reading aids and word lookup. */
    function showKoreanReader() {
        var ga=document.getElementById("gameArea"); if(!ga)return; loadState();
        ga.innerHTML='<div class="game-container">'+loading()+'</div>';
        fetchRandomArticle().then(function(a){renderReader(ga,a);});
    }
    /** @param {HTMLElement} c @param {{title:string,extract:string}} a */
    function renderReader(c,a) {
        var w=extractWords(a.extract),d=getDiff(a.extract),rt=readTime(a.extract);
        S.articlesRead++; updateFreq(w); if(typeof addXP==="function")addXP(10);
        var h='<div class="game-container"><h2 class="game-title">Korean Wikipedia Reader</h2>';
        h+='<div style="display:flex;justify-content:center;gap:15px;margin-bottom:15px;flex-wrap:wrap;">';
        h+='<span style="color:'+d.color+';font-size:0.85rem;padding:4px 12px;border:1px solid '+d.color+';border-radius:20px;">'+escapeHtml(d.label)+'</span>';
        h+='<span style="color:rgba(255,255,255,0.6);font-size:0.85rem;">'+w.length+' words</span>';
        h+='<span style="color:rgba(255,255,255,0.6);font-size:0.85rem;">~'+rt+' min</span>';
        h+='<span style="color:var(--neon-cyan);font-size:0.85rem;">Read: '+S.articlesRead+'</span></div>';
        h+='<div style="background:var(--glass);border:1px solid rgba(157,78,221,0.3);border-radius:15px;padding:20px;margin-bottom:20px;max-width:650px;margin:0 auto 20px;">';
        h+='<h3 style="color:var(--neon-pink);margin-bottom:12px;text-align:center;">'+escapeHtml(a.title)+'</h3>';
        h+='<div style="font-size:1.05rem;line-height:1.9;color:rgba(255,255,255,0.9);">'+highlight(a.extract)+'</div></div>';
        h+='<p style="text-align:center;color:rgba(255,255,255,0.4);font-size:0.8rem;margin-bottom:15px;">Click highlighted words to look them up</p>';
        h+='<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">';
        h+='<button class="game-btn" data-action="next">Next Article</button>';
        h+='<button class="game-btn secondary" data-action="stats">My Stats</button></div></div>';
        c.innerHTML=h;
        bind(c,{lookupWord:function(word){wordLookup(c,word,a);},next:function(){showKoreanReader();},stats:function(){renderStats(c);}});
    }
    /** @param {HTMLElement} c @param {string} word @param {Object} article */
    function wordLookup(c,word,article) {
        var freq=S.wordFrequency[word]||1,vocab=getVocab(article.title),meaning="";
        for(var i=0;i<vocab.length;i++)if(vocab[i].word===word){meaning=vocab[i].meaning;break;}
        var h='<div class="game-container"><h2 class="game-title">Word Lookup</h2>';
        h+='<div style="background:var(--glass);border:1px solid rgba(0,213,255,0.3);border-radius:15px;padding:25px;max-width:400px;margin:0 auto 20px;text-align:center;">';
        h+='<div style="font-size:2.5rem;margin-bottom:10px;">'+escapeHtml(word)+'</div>';
        h+='<div style="color:rgba(255,255,255,0.5);font-size:0.85rem;margin-bottom:8px;">'+sylCount(word)+' syllables</div>';
        if(meaning)h+='<div style="color:var(--neon-cyan);font-size:1.1rem;margin-bottom:8px;">'+escapeHtml(meaning)+'</div>';
        h+='<div style="color:rgba(255,255,255,0.5);font-size:0.85rem;">Seen '+freq+' time(s)</div></div>';
        h+='<div style="display:flex;gap:10px;justify-content:center;"><button class="game-btn" data-action="speak" data-param="'+escapeHtml(word)+'">Speak</button>';
        h+='<button class="game-btn secondary" data-action="back">Back to Article</button></div></div>';
        c.innerHTML=h;
        bind(c,{speak:function(w){if(typeof speakKorean==="function")speakKorean(w);},back:function(){renderReader(c,article);}});
    }
    /** @param {HTMLElement} c */
    function renderStats(c) {
        var top=Object.keys(S.wordFrequency).map(function(w){return{w:w,c:S.wordFrequency[w]};}).sort(function(a,b){return b.c-a.c;}).slice(0,10);
        var h='<div class="game-container"><h2 class="game-title">Reading Stats</h2>';
        h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;max-width:400px;margin:0 auto 20px;">';
        h+='<div style="background:var(--glass);border-radius:12px;padding:15px;text-align:center;"><div style="font-size:2rem;color:var(--neon-cyan);font-weight:700;">'+S.articlesRead+'</div><div style="color:rgba(255,255,255,0.5);font-size:0.8rem;">Articles Read</div></div>';
        h+='<div style="background:var(--glass);border-radius:12px;padding:15px;text-align:center;"><div style="font-size:2rem;color:var(--neon-pink);font-weight:700;">'+Object.keys(S.wordFrequency).length+'</div><div style="color:rgba(255,255,255,0.5);font-size:0.8rem;">Unique Words</div></div></div>';
        if(top.length){h+='<div style="background:var(--glass);border:1px solid rgba(157,78,221,0.3);border-radius:15px;padding:15px;max-width:400px;margin:0 auto 20px;">';
            h+='<div style="font-size:0.85rem;color:rgba(255,255,255,0.5);margin-bottom:10px;">Most Frequent Words</div>';
            for(var i=0;i<top.length;i++)h+='<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.05);"><span style="color:rgba(255,255,255,0.8);">'+escapeHtml(top[i].w)+'</span><span style="color:var(--neon-cyan);">'+top[i].c+'x</span></div>';
            h+='</div>';}
        h+='<div style="text-align:center;"><button class="game-btn" data-action="back">Continue Reading</button></div></div>';
        c.innerHTML=h; bind(c,{back:function(){showKoreanReader();}});
    }

    /* ===== MODE 2: Reading Comprehension ===== */
    /** Fetch article and auto-generate 5 comprehension questions. */
    function showReadingComprehension() {
        var ga=document.getElementById("gameArea"); if(!ga)return; loadState();
        ga.innerHTML='<div class="game-container">'+loading()+'</div>';
        fetchRandomArticle().then(function(a){renderComp(ga,a,genQs(a),0,0);});
    }
    /** @param {{title:string,extract:string}} a @returns {Array} */
    function genQs(a) {
        var qs=[],w=extractWords(a.extract),ti=a.title;
        var wt=[]; for(var i=0;i<FB.length;i++)if(FB[i].title!==ti)wt.push(FB[i].title); shuf(wt);
        var to=[ti,wt[0]||"\uC74C\uC545",wt[1]||"\uC2A4\uD3EC\uCE20",wt[2]||"\uACFC\uD559"]; shuf(to);
        qs.push({q:"What is this article about?",o:to,a:to.indexOf(ti)});
        qs.push({q:"True or False: This article mentions '"+ti+"'",o:["True","False"],a:0});
        var wc=w.length,cr=wc<20?"Under 20":wc<40?"20-40":"Over 40",ro=["Under 20","20-40","Over 40","Over 100"];
        qs.push({q:"How many unique Korean words are in this article?",o:ro,a:ro.indexOf(cr)});
        qs.push({q:"True or False: This article is about '\uCE58\uD0A8\uB108\uAC8F'",o:["True","False"],a:1});
        if(w.length>=4){var kw=w[0],ko=[kw,"\uD504\uB85C\uADF8\uB798\uBC0D","\uC6B0\uC8FC\uC120","\uD558\uBAA8\uB2C8\uCE74"];shuf(ko);
            qs.push({q:"Which word appears in this article?",o:ko,a:ko.indexOf(kw)});
        } else {var dl=getDiff(a.extract).level;
            qs.push({q:"What difficulty level best describes this?",o:["Beginner","Intermediate","Advanced","Expert"],a:dl==="beginner"?0:dl==="intermediate"?1:2});}
        return qs.slice(0,5);
    }
    /** @param {HTMLElement} c @param {Object} a @param {Array} qs @param {number} idx @param {number} sc */
    function renderComp(c,a,qs,idx,sc) {
        if(idx>=qs.length){renderCompRes(c,a,sc,qs.length);return;}
        var q=qs[idx];
        var h='<div class="game-container"><h2 class="game-title">Reading Comprehension</h2>';
        h+='<div style="text-align:center;color:rgba(255,255,255,0.5);margin-bottom:10px;">Q'+(idx+1)+' / '+qs.length+' | Score: <span style="color:var(--neon-cyan);">'+sc+'</span></div>';
        h+='<div style="background:var(--glass);border:1px solid rgba(157,78,221,0.3);border-radius:15px;padding:15px;margin-bottom:15px;max-width:600px;margin:0 auto;max-height:150px;overflow-y:auto;">';
        h+='<div style="font-size:0.9rem;line-height:1.7;color:rgba(255,255,255,0.7);">'+escapeHtml(a.extract)+'</div></div>';
        h+='<div style="background:var(--glass);border-radius:12px;padding:15px;margin-bottom:15px;max-width:500px;margin:0 auto;text-align:center;">';
        h+='<div style="font-size:1.1rem;color:rgba(255,255,255,0.9);margin-bottom:15px;">'+escapeHtml(q.q)+'</div>';
        h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
        for(var i=0;i<q.o.length;i++)h+='<button class="game-btn secondary" data-action="ans" data-param="'+i+'" style="padding:12px;font-size:0.95rem;">'+escapeHtml(q.o[i])+'</button>';
        h+='</div></div></div>'; c.innerHTML=h;
        bind(c,{ans:function(sel){var ns=sc+(parseInt(sel,10)===q.a?1:0);if(parseInt(sel,10)===q.a&&typeof addXP==="function")addXP(10);renderComp(c,a,qs,idx+1,ns);}});
    }
    /** @param {HTMLElement} c @param {Object} a @param {number} sc @param {number} tot */
    function renderCompRes(c,a,sc,tot) {
        var pct=Math.round((sc/tot)*100),col=pct>=80?"var(--neon-cyan)":pct>=50?"var(--neon-purple)":"var(--neon-pink)";
        var h='<div class="game-container"><h2 class="game-title">Comprehension Results</h2>';
        h+='<div style="text-align:center;margin-bottom:20px;"><div style="font-size:3rem;font-weight:900;color:'+col+';">'+pct+'%</div>';
        h+='<div style="color:rgba(255,255,255,0.6);">'+sc+' / '+tot+' correct</div></div>';
        h+='<div style="text-align:center;color:rgba(255,255,255,0.5);margin-bottom:20px;">Article: '+escapeHtml(a.title)+'</div>';
        h+='<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">';
        h+='<button class="game-btn" data-action="retry">Try Another Article</button>';
        h+='<button class="game-btn secondary" data-action="reader">Back to Reader</button></div></div>';
        c.innerHTML=h; bind(c,{retry:function(){showReadingComprehension();},reader:function(){showKoreanReader();}});
    }

    /* ===== MODE 3: Vocabulary Extractor ===== */
    /** Fetch article, extract Korean words, display as vocabulary cards with known/learning toggle. */
    function showVocabExtractor() {
        var ga=document.getElementById("gameArea"); if(!ga)return; loadState();
        ga.innerHTML='<div class="game-container">'+loading()+'</div>';
        fetchRandomArticle().then(function(a){renderVocab(ga,a);});
    }
    /** @param {HTMLElement} c @param {{title:string,extract:string}} a */
    function renderVocab(c,a) {
        var w=extractWords(a.extract),voc=getVocab(a.title),vm={};
        for(var v=0;v<voc.length;v++)vm[voc[v].word]=voc[v].meaning;
        var h='<div class="game-container"><h2 class="game-title">Vocabulary Extractor</h2>';
        h+='<div style="text-align:center;color:rgba(255,255,255,0.5);margin-bottom:5px;">From: '+escapeHtml(a.title)+'</div>';
        h+='<div style="text-align:center;color:rgba(255,255,255,0.4);font-size:0.8rem;margin-bottom:15px;">'+w.length+' unique words | Known: '+S.knownWords.length+' | Learning: '+S.learningWords.length+'</div>';
        h+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;max-width:600px;margin:0 auto 20px;">';
        for(var i=0;i<Math.min(w.length,20);i++){var wd=w[i],ik=S.knownWords.indexOf(wd)>=0,il=S.learningWords.indexOf(wd)>=0;
            var bc=ik?"var(--neon-cyan)":il?"var(--neon-pink)":"rgba(157,78,221,0.3)",sl=ik?"Known":il?"Learning":"";
            h+='<div style="background:var(--glass);border:1px solid '+bc+';border-radius:12px;padding:12px;text-align:center;">';
            h+='<div style="font-size:1.3rem;margin-bottom:4px;">'+escapeHtml(wd)+'</div>';
            h+='<div style="font-size:0.75rem;color:rgba(255,255,255,0.4);">'+sylCount(wd)+' syl</div>';
            if(vm[wd])h+='<div style="font-size:0.75rem;color:var(--neon-cyan);margin-top:4px;">'+escapeHtml(vm[wd])+'</div>';
            if(sl)h+='<div style="font-size:0.7rem;color:'+bc+';margin-top:4px;">'+sl+'</div>';
            h+='<div style="display:flex;gap:4px;margin-top:6px;justify-content:center;">';
            h+='<button class="game-btn" data-action="known" data-param="'+escapeHtml(wd)+'" style="padding:3px 8px;font-size:0.7rem;min-width:auto;">Known</button>';
            h+='<button class="game-btn secondary" data-action="learn" data-param="'+escapeHtml(wd)+'" style="padding:3px 8px;font-size:0.7rem;min-width:auto;">Learn</button></div></div>';}
        h+='</div><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">';
        h+='<button class="game-btn" data-action="newArt">New Article</button>';
        h+='<button class="game-btn secondary" data-action="myVocab">My Vocabulary</button></div></div>';
        c.innerHTML=h;
        bind(c,{known:function(wd){addTo(S.knownWords,wd);rmFrom(S.learningWords,wd);saveState();if(typeof showToast==="function")showToast("Known: "+wd);renderVocab(c,a);},
            learn:function(wd){addTo(S.learningWords,wd);rmFrom(S.knownWords,wd);saveState();if(typeof showToast==="function")showToast("Learning: "+wd);renderVocab(c,a);},
            newArt:function(){showVocabExtractor();},myVocab:function(){renderMyVocab(c);}});
    }
    /** @param {HTMLElement} c */
    function renderMyVocab(c) {
        var h='<div class="game-container"><h2 class="game-title">My Vocabulary</h2>';
        h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;max-width:500px;margin:0 auto 20px;">';
        h+='<div style="background:var(--glass);border:1px solid var(--neon-cyan);border-radius:12px;padding:15px;">';
        h+='<div style="color:var(--neon-cyan);font-weight:700;margin-bottom:8px;">Known ('+S.knownWords.length+')</div>';
        for(var i=0;i<Math.min(S.knownWords.length,15);i++)h+='<div style="padding:3px 0;color:rgba(255,255,255,0.8);font-size:0.9rem;">'+escapeHtml(S.knownWords[i])+'</div>';
        if(!S.knownWords.length)h+='<div style="color:rgba(255,255,255,0.3);font-size:0.85rem;">None yet</div>';
        h+='</div><div style="background:var(--glass);border:1px solid var(--neon-pink);border-radius:12px;padding:15px;">';
        h+='<div style="color:var(--neon-pink);font-weight:700;margin-bottom:8px;">Learning ('+S.learningWords.length+')</div>';
        for(var j=0;j<Math.min(S.learningWords.length,15);j++)h+='<div style="padding:3px 0;color:rgba(255,255,255,0.8);font-size:0.9rem;">'+escapeHtml(S.learningWords[j])+'</div>';
        if(!S.learningWords.length)h+='<div style="color:rgba(255,255,255,0.3);font-size:0.85rem;">None yet</div>';
        h+='</div></div><div style="text-align:center;"><button class="game-btn" data-action="back">Back to Extractor</button></div></div>';
        c.innerHTML=h; bind(c,{back:function(){showVocabExtractor();}});
    }

    /* ===== Global Exposure ===== */
    window.showKoreanReader = showKoreanReader;
    window.showReadingComprehension = showReadingComprehension;
    window.showVocabExtractor = showVocabExtractor;
})();

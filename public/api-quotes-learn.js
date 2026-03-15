/**
 * api-quotes-learn.js
 * Famous quotes Korean learning module for K-POP Korean Learning.
 * Provides translation practice, dictation, and vocabulary through quotes.
 * API: quoteslate.vercel.app (random quotes).
 * @requires security-utils.js (escapeHtml)
 * @requires main-app.js (addXP, speakKorean, showToast)
 */
(function () {
    "use strict";
    /** @type {string} */ var QUOTES_API = "https://quoteslate.vercel.app/api/quotes/random?count=5&maxLength=100";
    /** @type {number} */ var CACHE_TTL = 3600000;
    /** @type {string} */ var CP = "quotesLearn_";

    /** @type {Array<{english:string,korean:string,author:string,authorKorean:string,keywords:Array<{en:string,ko:string}>}>} */
    var Q = [
        {english:"The unexamined life is not worth living.",korean:"\uC131\uCC30\uD558\uC9C0 \uC54A\uB294 \uC0B6\uC740 \uC0B4 \uAC00\uCE58\uAC00 \uC5C6\uB2E4.",author:"Socrates",authorKorean:"\uC18C\uD06C\uB77C\uD14C\uC2A4",keywords:[{en:"life",ko:"\uC0B6"},{en:"worth",ko:"\uAC00\uCE58"},{en:"examined",ko:"\uC131\uCC30"}]},
        {english:"I think, therefore I am.",korean:"\uB098\uB294 \uC0DD\uAC01\uD55C\uB2E4, \uACE0\uB85C \uB098\uB294 \uC874\uC7AC\uD55C\uB2E4.",author:"Descartes",authorKorean:"\uB370\uCE74\uB974\uD2B8",keywords:[{en:"think",ko:"\uC0DD\uAC01"},{en:"exist",ko:"\uC874\uC7AC"},{en:"therefore",ko:"\uACE0\uB85C"}]},
        {english:"To learn and not to do is really not to learn.",korean:"\uBC30\uC6B0\uACE0 \uC2E4\uCC9C\uD558\uC9C0 \uC54A\uC73C\uBA74 \uC9C4\uC815 \uBC30\uC6B4 \uAC83\uC774 \uC544\uB2C8\uB2E4.",author:"Confucius",authorKorean:"\uACF5\uC790",keywords:[{en:"learn",ko:"\uBC30\uC6B0\uB2E4"},{en:"practice",ko:"\uC2E4\uCC9C"},{en:"truly",ko:"\uC9C4\uC815"}]},
        {english:"Peace comes from within. Do not seek it without.",korean:"\uD3C9\uD654\uB294 \uB0B4\uBA74\uC5D0\uC11C \uC628\uB2E4. \uBC16\uC5D0\uC11C \uCC3E\uC9C0 \uB9C8\uB77C.",author:"Buddha",authorKorean:"\uBD93\uB2E4",keywords:[{en:"peace",ko:"\uD3C9\uD654"},{en:"within",ko:"\uB0B4\uBA74"},{en:"seek",ko:"\uCC3E\uB2E4"}]},
        {english:"Knowing yourself is the beginning of all wisdom.",korean:"\uC790\uC2E0\uC744 \uC544\uB294 \uAC83\uC774 \uBAA8\uB4E0 \uC9C0\uD61C\uC758 \uC2DC\uC791\uC774\uB2E4.",author:"Aristotle",authorKorean:"\uC544\uB9AC\uC2A4\uD1A0\uD154\uB808\uC2A4",keywords:[{en:"wisdom",ko:"\uC9C0\uD61C"},{en:"beginning",ko:"\uC2DC\uC791"},{en:"yourself",ko:"\uC790\uC2E0"}]},
        {english:"He who fears he will suffer already suffers.",korean:"\uACE0\uD1B5\uC744 \uB450\uB824\uC6CC\uD558\uB294 \uC790\uB294 \uC774\uBBF8 \uACE0\uD1B5\uBC1B\uACE0 \uC788\uB2E4.",author:"Montaigne",authorKorean:"\uBABD\uD14C\uB274",keywords:[{en:"suffer",ko:"\uACE0\uD1B5"},{en:"fear",ko:"\uB450\uB824\uC6C0"},{en:"already",ko:"\uC774\uBBF8"}]},
        {english:"Happiness depends upon ourselves.",korean:"\uD589\uBCF5\uC740 \uC6B0\uB9AC \uC790\uC2E0\uC5D0\uAC8C \uB2EC\uB824 \uC788\uB2E4.",author:"Aristotle",authorKorean:"\uC544\uB9AC\uC2A4\uD1A0\uD154\uB808\uC2A4",keywords:[{en:"happiness",ko:"\uD589\uBCF5"},{en:"ourselves",ko:"\uC6B0\uB9AC \uC790\uC2E0"},{en:"depend",ko:"\uB2EC\uB824 \uC788\uB2E4"}]},
        {english:"The only true wisdom is knowing you know nothing.",korean:"\uC720\uC77C\uD55C \uC9C4\uC815\uD55C \uC9C0\uD61C\uB294 \uC790\uC2E0\uC774 \uBAA8\uB978\uB2E4\uB294 \uAC83\uC744 \uC544\uB294 \uAC83\uC774\uB2E4.",author:"Socrates",authorKorean:"\uC18C\uD06C\uB77C\uD14C\uC2A4",keywords:[{en:"true",ko:"\uC9C4\uC815\uD55C"},{en:"wisdom",ko:"\uC9C0\uD61C"},{en:"nothing",ko:"\uBAA8\uB974\uB2E4"}]},
        {english:"Be the change you wish to see in the world.",korean:"\uC138\uC0C1\uC5D0\uC11C \uBCF4\uACE0 \uC2F6\uC740 \uBCC0\uD654\uAC00 \uB418\uC5B4\uB77C.",author:"Gandhi",authorKorean:"\uAC04\uB514",keywords:[{en:"change",ko:"\uBCC0\uD654"},{en:"world",ko:"\uC138\uC0C1"},{en:"wish",ko:"\uBC14\uB77C\uB2E4"}]},
        {english:"Education is the most powerful weapon.",korean:"\uAD50\uC721\uC740 \uAC00\uC7A5 \uAC15\uB825\uD55C \uBB34\uAE30\uC774\uB2E4.",author:"Mandela",authorKorean:"\uB9CC\uB378\uB77C",keywords:[{en:"education",ko:"\uAD50\uC721"},{en:"powerful",ko:"\uAC15\uB825\uD55C"},{en:"weapon",ko:"\uBB34\uAE30"}]},
        {english:"In the middle of difficulty lies opportunity.",korean:"\uC5B4\uB824\uC6C0\uC758 \uD55C\uAC00\uC6B4\uB370\uC5D0 \uAE30\uD68C\uAC00 \uC788\uB2E4.",author:"Einstein",authorKorean:"\uC544\uC778\uC288\uD0C0\uC778",keywords:[{en:"difficulty",ko:"\uC5B4\uB824\uC6C0"},{en:"opportunity",ko:"\uAE30\uD68C"},{en:"middle",ko:"\uD55C\uAC00\uC6B4\uB370"}]},
        {english:"The best way to predict the future is to create it.",korean:"\uBBF8\uB798\uB97C \uC608\uCE21\uD558\uB294 \uAC00\uC7A5 \uC88B\uC740 \uBC29\uBC95\uC740 \uC9C1\uC811 \uB9CC\uB4DC\uB294 \uAC83\uC774\uB2E4.",author:"Lincoln",authorKorean:"\uB9C1\uCEE8",keywords:[{en:"future",ko:"\uBBF8\uB798"},{en:"predict",ko:"\uC608\uCE21"},{en:"create",ko:"\uB9CC\uB4E4\uB2E4"}]},
        {english:"It always seems impossible until it is done.",korean:"\uC774\uB8E8\uC5B4\uC9C0\uAE30 \uC804\uAE4C\uC9C0\uB294 \uD56D\uC0C1 \uBD88\uAC00\uB2A5\uD574 \uBCF4\uC778\uB2E4.",author:"Mandela",authorKorean:"\uB9CC\uB378\uB77C",keywords:[{en:"impossible",ko:"\uBD88\uAC00\uB2A5"},{en:"always",ko:"\uD56D\uC0C1"},{en:"done",ko:"\uC774\uB8E8\uC5B4\uC9C0\uB2E4"}]},
        {english:"Freedom is not given, it is taken.",korean:"\uC790\uC720\uB294 \uC8FC\uC5B4\uC9C0\uB294 \uAC83\uC774 \uC544\uB2C8\uB77C \uC7C1\uCDE8\uD558\uB294 \uAC83\uC774\uB2E4.",author:"Gandhi",authorKorean:"\uAC04\uB514",keywords:[{en:"freedom",ko:"\uC790\uC720"},{en:"given",ko:"\uC8FC\uC5B4\uC9C0\uB2E4"},{en:"taken",ko:"\uC7C1\uCDE8\uD558\uB2E4"}]},
        {english:"Courage is not the absence of fear.",korean:"\uC6A9\uAE30\uB294 \uB450\uB824\uC6C0\uC774 \uC5C6\uB294 \uAC83\uC774 \uC544\uB2C8\uB2E4.",author:"Mandela",authorKorean:"\uB9CC\uB378\uB77C",keywords:[{en:"courage",ko:"\uC6A9\uAE30"},{en:"fear",ko:"\uB450\uB824\uC6C0"},{en:"absence",ko:"\uC5C6\uC74C"}]},
        {english:"Where there is a will, there is a way.",korean:"\uB73B\uC774 \uC788\uB294 \uACF3\uC5D0 \uAE38\uC774 \uC788\uB2E4.",author:"Proverb",authorKorean:"\uC18D\uB2F4",keywords:[{en:"will",ko:"\uB73B"},{en:"way",ko:"\uAE38"},{en:"there is",ko:"\uC788\uB2E4"}]},
        {english:"All that glitters is not gold.",korean:"\uBC18\uC9DD\uC774\uB294 \uAC83\uC774 \uBAA8\uB450 \uAE08\uC740 \uC544\uB2C8\uB2E4.",author:"Shakespeare",authorKorean:"\uC170\uC775\uC2A4\uD53C\uC5B4",keywords:[{en:"glitter",ko:"\uBC18\uC9DD\uC774\uB2E4"},{en:"gold",ko:"\uAE08"},{en:"all",ko:"\uBAA8\uB450"}]},
        {english:"To be or not to be, that is the question.",korean:"\uC0AC\uB290\uB0D0 \uC8FD\uB290\uB0D0, \uADF8\uAC83\uC774 \uBB38\uC81C\uB85C\uB2E4.",author:"Shakespeare",authorKorean:"\uC170\uC775\uC2A4\uD53C\uC5B4",keywords:[{en:"question",ko:"\uBB38\uC81C"},{en:"to be",ko:"\uC0B4\uB2E4"},{en:"or",ko:"\uB610\uB294"}]},
        {english:"Music is the universal language of mankind.",korean:"\uC74C\uC545\uC740 \uC778\uB958\uC758 \uBCF4\uD3B8\uC801\uC778 \uC5B8\uC5B4\uC774\uB2E4.",author:"Longfellow",authorKorean:"\uB871\uD3A0\uB85C\uC6B0",keywords:[{en:"music",ko:"\uC74C\uC545"},{en:"language",ko:"\uC5B8\uC5B4"},{en:"universal",ko:"\uBCF4\uD3B8\uC801"}]},
        {english:"Art is the lie that tells the truth.",korean:"\uC608\uC220\uC740 \uC9C4\uC2E4\uC744 \uB9D0\uD558\uB294 \uAC70\uC9D3\uB9D0\uC774\uB2E4.",author:"Picasso",authorKorean:"\uD53C\uCE74\uC18C",keywords:[{en:"art",ko:"\uC608\uC220"},{en:"truth",ko:"\uC9C4\uC2E4"},{en:"lie",ko:"\uAC70\uC9D3\uB9D0"}]},
        {english:"Every artist was first an amateur.",korean:"\uBAA8\uB4E0 \uC608\uC220\uAC00\uB294 \uCC98\uC74C\uC5D0\uB294 \uC544\uB9C8\uCD94\uC5B4\uC600\uB2E4.",author:"Emerson",authorKorean:"\uC5D0\uBA38\uC2A8",keywords:[{en:"artist",ko:"\uC608\uC220\uAC00"},{en:"first",ko:"\uCC98\uC74C"},{en:"amateur",ko:"\uC544\uB9C8\uCD94\uC5B4"}]},
        {english:"Imagination is more important than knowledge.",korean:"\uC0C1\uC0C1\uB825\uC740 \uC9C0\uC2DD\uBCF4\uB2E4 \uB354 \uC911\uC694\uD558\uB2E4.",author:"Einstein",authorKorean:"\uC544\uC778\uC288\uD0C0\uC778",keywords:[{en:"imagination",ko:"\uC0C1\uC0C1\uB825"},{en:"knowledge",ko:"\uC9C0\uC2DD"},{en:"important",ko:"\uC911\uC694\uD55C"}]},
        {english:"Music gives a soul to the universe.",korean:"\uC74C\uC545\uC740 \uC6B0\uC8FC\uC5D0 \uC601\uD63C\uC744 \uC900\uB2E4.",author:"Plato",authorKorean:"\uD50C\uB77C\uD1A4",keywords:[{en:"music",ko:"\uC74C\uC545"},{en:"soul",ko:"\uC601\uD63C"},{en:"universe",ko:"\uC6B0\uC8FC"}]},
        {english:"Only in the darkness can you see the stars.",korean:"\uC5B4\uB460 \uC18D\uC5D0\uC11C\uB9CC \uBCC4\uC744 \uBCFC \uC218 \uC788\uB2E4.",author:"MLK Jr.",authorKorean:"\uB9C8\uD2F4 \uB8E8\uD130 \uD0B9",keywords:[{en:"darkness",ko:"\uC5B4\uB460"},{en:"stars",ko:"\uBCC4"},{en:"see",ko:"\uBCF4\uB2E4"}]},
        {english:"Stay hungry, stay foolish.",korean:"\uBC30\uACE0\uD504\uACE0 \uC5B4\uB9AC\uC11D\uC5B4\uB77C.",author:"Steve Jobs",authorKorean:"\uC2A4\uD2F0\uBE0C \uC7A1\uC2A4",keywords:[{en:"hungry",ko:"\uBC30\uACE0\uD504\uB2E4"},{en:"foolish",ko:"\uC5B4\uB9AC\uC11D\uB2E4"},{en:"stay",ko:"\uBA38\uBB3C\uB2E4"}]},
        {english:"Innovation distinguishes a leader from a follower.",korean:"\uD601\uC2E0\uC774 \uB9AC\uB354\uC640 \uCD94\uC885\uC790\uB97C \uAD6C\uBCC4\uD55C\uB2E4.",author:"Steve Jobs",authorKorean:"\uC2A4\uD2F0\uBE0C \uC7A1\uC2A4",keywords:[{en:"innovation",ko:"\uD601\uC2E0"},{en:"leader",ko:"\uB9AC\uB354"},{en:"follower",ko:"\uCD94\uC885\uC790"}]},
        {english:"Your time is limited, do not waste it.",korean:"\uC2DC\uAC04\uC740 \uD55C\uC815\uB418\uC5B4 \uC788\uB2E4. \uB0AD\uBE44\uD558\uC9C0 \uB9C8\uB77C.",author:"Steve Jobs",authorKorean:"\uC2A4\uD2F0\uBE0C \uC7A1\uC2A4",keywords:[{en:"time",ko:"\uC2DC\uAC04"},{en:"limited",ko:"\uD55C\uC815\uB41C"},{en:"waste",ko:"\uB0AD\uBE44"}]},
        {english:"Dream big and dare to fail.",korean:"\uD06C\uAC8C \uAFC8\uAFB8\uACE0 \uC2E4\uD328\uD560 \uC6A9\uAE30\uB97C \uAC00\uC838\uB77C.",author:"Norman Vaughan",authorKorean:"\uB178\uBA3C \uBCF4\uC5B8",keywords:[{en:"dream",ko:"\uAFC8"},{en:"dare",ko:"\uC6A9\uAE30"},{en:"fail",ko:"\uC2E4\uD328"}]},
        {english:"Success is not final, failure is not fatal.",korean:"\uC131\uACF5\uC774 \uB05D\uC774 \uC544\uB2C8\uACE0 \uC2E4\uD328\uAC00 \uCE58\uBA85\uC801\uC778 \uAC83\uB3C4 \uC544\uB2C8\uB2E4.",author:"Churchill",authorKorean:"\uCC98\uCE60",keywords:[{en:"success",ko:"\uC131\uACF5"},{en:"failure",ko:"\uC2E4\uD328"},{en:"fatal",ko:"\uCE58\uBA85\uC801"}]},
        {english:"The only way to do great work is to love what you do.",korean:"\uC704\uB300\uD55C \uC77C\uC744 \uD558\uB294 \uC720\uC77C\uD55C \uBC29\uBC95\uC740 \uC0AC\uB791\uD558\uB294 \uAC83\uC774\uB2E4.",author:"Steve Jobs",authorKorean:"\uC2A4\uD2F0\uBE0C \uC7A1\uC2A4",keywords:[{en:"great",ko:"\uC704\uB300\uD55C"},{en:"work",ko:"\uC77C"},{en:"love",ko:"\uC0AC\uB791"}]},
        {english:"Life is what happens when you are making plans.",korean:"\uC0B6\uC740 \uACC4\uD68D\uC744 \uC138\uC6B8 \uB54C \uC77C\uC5B4\uB098\uB294 \uAC83\uC774\uB2E4.",author:"John Lennon",authorKorean:"\uC874 \uB808\uB17C",keywords:[{en:"life",ko:"\uC0B6"},{en:"plans",ko:"\uACC4\uD68D"},{en:"happens",ko:"\uC77C\uC5B4\uB098\uB2E4"}]},
        {english:"Believe you can and you are halfway there.",korean:"\uD560 \uC218 \uC788\uB2E4\uACE0 \uBBFF\uC73C\uBA74 \uC774\uBBF8 \uBC18\uC740 \uC628 \uAC83\uC774\uB2E4.",author:"Roosevelt",authorKorean:"\uB8E8\uC988\uBCA8\uD2B8",keywords:[{en:"believe",ko:"\uBBFF\uB2E4"},{en:"halfway",ko:"\uBC18"},{en:"can",ko:"\uD560 \uC218 \uC788\uB2E4"}]},
        {english:"The journey of a thousand miles begins with one step.",korean:"\uCC9C \uB9AC \uAE38\uB3C4 \uD55C \uAC78\uC74C\uBD80\uD130 \uC2DC\uC791\uB41C\uB2E4.",author:"Lao Tzu",authorKorean:"\uB178\uC790",keywords:[{en:"journey",ko:"\uAE38"},{en:"thousand",ko:"\uCC9C"},{en:"step",ko:"\uAC78\uC74C"}]},
        {english:"Do what you can with what you have.",korean:"\uAC00\uC9C4 \uAC83\uC73C\uB85C \uD560 \uC218 \uC788\uB294 \uAC83\uC744 \uD558\uB77C.",author:"Roosevelt",authorKorean:"\uB8E8\uC988\uBCA8\uD2B8",keywords:[{en:"what",ko:"\uBB34\uC5C7"},{en:"have",ko:"\uAC00\uC9C0\uB2E4"},{en:"can",ko:"\uD560 \uC218 \uC788\uB2E4"}]},
        {english:"Love the life you live. Live the life you love.",korean:"\uC0AC\uB294 \uC0B6\uC744 \uC0AC\uB791\uD558\uACE0, \uC0AC\uB791\uD558\uB294 \uC0B6\uC744 \uC0B4\uC544\uB77C.",author:"Bob Marley",authorKorean:"\uBC25 \uB9D0\uB9AC",keywords:[{en:"love",ko:"\uC0AC\uB791"},{en:"life",ko:"\uC0B6"},{en:"live",ko:"\uC0B4\uB2E4"}]},
        {english:"Knowledge is power.",korean:"\uC544\uB294 \uAC83\uC774 \uD798\uC774\uB2E4.",author:"Francis Bacon",authorKorean:"\uD504\uB79C\uC2DC\uC2A4 \uBCA0\uC774\uCEE8",keywords:[{en:"knowledge",ko:"\uC9C0\uC2DD"},{en:"power",ko:"\uD798"},{en:"is",ko:"\uC774\uB2E4"}]},
        {english:"Time heals all wounds.",korean:"\uC2DC\uAC04\uC774 \uBAA8\uB4E0 \uC0C1\uCC98\uB97C \uCE58\uC720\uD55C\uB2E4.",author:"Proverb",authorKorean:"\uC18D\uB2F4",keywords:[{en:"time",ko:"\uC2DC\uAC04"},{en:"heals",ko:"\uCE58\uC720"},{en:"wounds",ko:"\uC0C1\uCC98"}]},
        {english:"Actions speak louder than words.",korean:"\uD589\uB3D9\uC774 \uB9D0\uBCF4\uB2E4 \uB354 \uD06C\uAC8C \uB9D0\uD55C\uB2E4.",author:"Proverb",authorKorean:"\uC18D\uB2F4",keywords:[{en:"actions",ko:"\uD589\uB3D9"},{en:"words",ko:"\uB9D0"},{en:"louder",ko:"\uB354 \uD06C\uAC8C"}]}
    ];

    /** @type {{quotesCompleted:number,vocabLearned:string[],dictationBest:number}} */
    var ST = {quotesCompleted:0, vocabLearned:[], dictationBest:0};

    /* ===== Cache ===== */
    /** @param {string} k @returns {Object|null} */
    function getCached(k){try{var r=localStorage.getItem(CP+k);if(!r)return null;var o=JSON.parse(r);if(Date.now()-o.ts>CACHE_TTL){localStorage.removeItem(CP+k);return null;}return o.data;}catch(e){return null;}}
    /** @param {string} k @param {Object} d */
    function setCache(k,d){try{localStorage.setItem(CP+k,JSON.stringify({ts:Date.now(),data:d}));}catch(e){}}
    /** Load quotes state from localStorage */
    function loadSt(){try{var r=localStorage.getItem(CP+"state");if(!r)return;var s=JSON.parse(r);ST.quotesCompleted=s.quotesCompleted||0;ST.vocabLearned=s.vocabLearned||[];ST.dictationBest=s.dictationBest||0;}catch(e){}}
    /** Persist quotes state */
    function saveSt(){try{localStorage.setItem(CP+"state",JSON.stringify(ST));}catch(e){}}

    /* ===== API ===== */
    /** @returns {Promise<Array<{quote:string,author:string}>>} */
    async function fetchQuotes(){var c=getCached("apiQuotes");if(c)return c;try{var r=await fetch(QUOTES_API);if(!r.ok)throw new Error(r.status);var d=await r.json(),qs=(Array.isArray(d)?d:[]).map(function(q){return{quote:q.quote||q.content||"",author:q.author||"Unknown"};}).filter(function(q){return q.quote.length>0;});if(qs.length){setCache("apiQuotes",qs);return qs;}throw new Error("empty");}catch(e){return[];}}

    /* ===== Helpers ===== */
    /** @returns {Object} */ function qotd(){return Q[Math.floor(Date.now()/86400000)%Q.length];}
    /** @returns {Object} */ function randQ(){return Q[Math.floor(Math.random()*Q.length)];}
    /** @param {Array} a @returns {Array} */
    function shuf(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
    /** @param {string} u @param {string} ref @returns {{matches:number,total:number,pct:number}} */
    function scoreTrans(u,ref){var rw=ref.match(/[\uAC00-\uD7AF]{2,}/g)||[],tot=rw.length||1,m=0;for(var i=0;i<rw.length;i++)if(u.indexOf(rw[i])>=0)m++;return{matches:m,total:tot,pct:Math.round((m/tot)*100)};}
    /** @param {string} u @param {string} ref @returns {{html:string,correct:number,total:number}} */
    function compareChars(u,ref){var h="",c=0,t=ref.length;for(var i=0;i<t;i++){if(i<u.length&&u[i]===ref[i]){h+='<span style="color:var(--neon-cyan);">'+escapeHtml(ref[i])+'</span>';c++;}else if(i<u.length){h+='<span style="color:var(--neon-pink);text-decoration:underline;">'+escapeHtml(ref[i])+'</span>';}else{h+='<span style="color:rgba(255,255,255,0.3);">'+escapeHtml(ref[i])+'</span>';}}return{html:h,correct:c,total:t};}
    /** @returns {string} */ function loading(){return'<div style="text-align:center;padding:40px;"><div class="game-loading-spinner"></div><p style="color:rgba(255,255,255,0.5);margin-top:12px;">Loading quotes...</p></div>';}
    /** @param {HTMLElement} el @param {Object<string,function>} map */
    function bind(el,map){el.addEventListener("click",function(e){var b=e.target.closest("[data-action]");if(!b||!el.contains(b))return;var fn=map[b.getAttribute("data-action")];if(fn)fn(b.getAttribute("data-param")||"",b);});}

    /* ===== MODE 1: Quote Translation ===== */
    /** Display English quote for user to translate to Korean. Score by keyword matches. */
    function showQuoteTranslation(){var ga=document.getElementById("gameArea");if(!ga)return;loadSt();renderTrans(ga,randQ());}
    /** @param {HTMLElement} c @param {Object} q */
    function renderTrans(c,q) {
        var qd=qotd();
        var h='<div class="game-container"><h2 class="game-title">Quote Translation</h2>';
        h+='<div style="text-align:center;color:rgba(255,255,255,0.5);font-size:0.8rem;margin-bottom:10px;">Completed: '+ST.quotesCompleted+'</div>';
        h+='<div style="background:var(--glass);border:1px solid rgba(157,78,221,0.3);border-radius:15px;padding:20px;max-width:550px;margin:0 auto 15px;text-align:center;">';
        h+='<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:8px;">Translate to Korean:</div>';
        h+='<div style="font-size:1.2rem;color:rgba(255,255,255,0.95);font-style:italic;margin-bottom:10px;">"'+escapeHtml(q.english)+'"</div>';
        h+='<div style="color:var(--neon-purple);font-size:0.9rem;">- '+escapeHtml(q.author)+' ('+escapeHtml(q.authorKorean)+')</div></div>';
        h+='<div style="max-width:550px;margin:0 auto 15px;"><textarea id="quoteTransInput" rows="3" style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(157,78,221,0.3);border-radius:10px;color:white;padding:12px;font-size:1rem;resize:none;outline:none;" placeholder="Write your Korean translation here..."></textarea></div>';
        h+='<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">';
        h+='<button class="game-btn" data-action="check">Check Translation</button>';
        h+='<button class="game-btn secondary" data-action="qotd">Quote of the Day</button></div></div>';
        c.innerHTML=h;
        bind(c,{check:function(){var inp=document.getElementById("quoteTransInput"),ut=inp?inp.value.trim():"";if(!ut){if(typeof showToast==="function")showToast("Please write a translation first!");return;}renderTransRes(c,q,ut);},qotd:function(){renderQotd(c,qd);}});
    }
    /** @param {HTMLElement} c @param {Object} q @param {string} ut */
    function renderTransRes(c,q,ut) {
        var res=scoreTrans(ut,q.korean); ST.quotesCompleted++; saveSt();
        if(res.pct>=50&&typeof addXP==="function")addXP(15);
        var col=res.pct>=80?"var(--neon-cyan)":res.pct>=50?"var(--neon-purple)":"var(--neon-pink)";
        var h='<div class="game-container"><h2 class="game-title">Translation Result</h2>';
        h+='<div style="text-align:center;margin-bottom:15px;"><div style="font-size:2.5rem;font-weight:900;color:'+col+';">'+res.pct+'%</div>';
        h+='<div style="color:rgba(255,255,255,0.5);">'+res.matches+' / '+res.total+' key words matched</div></div>';
        h+='<div style="background:var(--glass);border-radius:12px;padding:15px;max-width:550px;margin:0 auto 15px;">';
        h+='<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:5px;">Your translation:</div>';
        h+='<div style="color:rgba(255,255,255,0.8);margin-bottom:12px;">'+escapeHtml(ut)+'</div>';
        h+='<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:5px;">Reference:</div>';
        h+='<div style="color:var(--neon-cyan);">'+escapeHtml(q.korean)+'</div></div>';
        if(q.keywords&&q.keywords.length){h+='<div style="background:var(--glass);border-radius:12px;padding:15px;max-width:550px;margin:0 auto 15px;">';
            h+='<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:8px;">Key Vocabulary:</div>';
            h+='<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">';
            for(var i=0;i<q.keywords.length;i++){var kw=q.keywords[i];h+='<span style="padding:5px 12px;border-radius:20px;background:rgba(0,213,255,0.1);border:1px solid rgba(0,213,255,0.3);font-size:0.85rem;">'+escapeHtml(kw.en)+' = '+escapeHtml(kw.ko)+'</span>';}
            h+='</div></div>';}
        h+='<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">';
        h+='<button class="game-btn" data-action="next">Next Quote</button>';
        h+='<button class="game-btn secondary" data-action="speak" data-param="'+escapeHtml(q.korean)+'">Hear Korean</button></div></div>';
        c.innerHTML=h; bind(c,{next:function(){showQuoteTranslation();},speak:function(t){if(typeof speakKorean==="function")speakKorean(t);}});
    }
    /** @param {HTMLElement} c @param {Object} q */
    function renderQotd(c,q) {
        var h='<div class="game-container"><h2 class="game-title">Quote of the Day</h2>';
        h+='<div style="background:linear-gradient(135deg,rgba(255,45,149,0.1),rgba(157,78,221,0.1));border:1px solid rgba(255,45,149,0.3);border-radius:15px;padding:25px;max-width:500px;margin:0 auto 20px;text-align:center;">';
        h+='<div style="font-size:1.2rem;font-style:italic;color:rgba(255,255,255,0.95);margin-bottom:10px;">"'+escapeHtml(q.english)+'"</div>';
        h+='<div style="font-size:1.1rem;color:var(--neon-cyan);margin-bottom:10px;">'+escapeHtml(q.korean)+'</div>';
        h+='<div style="color:var(--neon-purple);">- '+escapeHtml(q.author)+' ('+escapeHtml(q.authorKorean)+')</div></div>';
        if(q.keywords&&q.keywords.length){h+='<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:20px;">';
            for(var i=0;i<q.keywords.length;i++){var kw=q.keywords[i];h+='<span style="padding:5px 12px;border-radius:20px;background:rgba(157,78,221,0.15);border:1px solid rgba(157,78,221,0.3);font-size:0.85rem;">'+escapeHtml(kw.en)+' = '+escapeHtml(kw.ko)+'</span>';}h+='</div>';}
        h+='<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">';
        h+='<button class="game-btn" data-action="speak" data-param="'+escapeHtml(q.korean)+'">Hear Korean</button>';
        h+='<button class="game-btn secondary" data-action="back">Back to Translation</button></div></div>';
        c.innerHTML=h; bind(c,{speak:function(t){if(typeof speakKorean==="function")speakKorean(t);},back:function(){showQuoteTranslation();}});
    }

    /* ===== MODE 2: Quote Dictation ===== */
    /** Show Korean quote for 3 seconds, then test user memory character by character. */
    function showQuoteDictation(){var ga=document.getElementById("gameArea");if(!ga)return;loadSt();renderDictPre(ga,randQ());}
    /** @param {HTMLElement} c @param {Object} q */
    function renderDictPre(c,q) {
        var h='<div class="game-container"><h2 class="game-title">Quote Dictation</h2>';
        h+='<div style="text-align:center;color:rgba(255,255,255,0.5);margin-bottom:15px;">Memorize this Korean text! It will disappear in 3 seconds...</div>';
        h+='<div id="dictText" style="background:linear-gradient(135deg,rgba(0,213,255,0.1),rgba(157,78,221,0.1));border:1px solid rgba(0,213,255,0.3);border-radius:15px;padding:25px;max-width:500px;margin:0 auto;text-align:center;">';
        h+='<div style="font-size:1.4rem;line-height:1.8;color:var(--neon-cyan);font-weight:600;">'+escapeHtml(q.korean)+'</div>';
        h+='<div style="color:var(--neon-purple);margin-top:10px;font-size:0.9rem;">- '+escapeHtml(q.authorKorean)+'</div></div>';
        h+='<div style="text-align:center;margin-top:15px;"><div id="dictTimer" style="font-size:2rem;color:var(--neon-pink);font-weight:900;">3</div></div></div>';
        c.innerHTML=h;
        var cd=3,timer=setInterval(function(){cd--;var el=document.getElementById("dictTimer");if(el)el.textContent=String(cd);if(cd<=0){clearInterval(timer);renderDictInput(c,q);}},1000);
    }
    /** @param {HTMLElement} c @param {Object} q */
    function renderDictInput(c,q) {
        var h='<div class="game-container"><h2 class="game-title">Quote Dictation</h2>';
        h+='<div style="text-align:center;color:rgba(255,255,255,0.5);margin-bottom:10px;">Type what you remember!</div>';
        h+='<div style="background:var(--glass);border-radius:12px;padding:15px;max-width:500px;margin:0 auto 10px;text-align:center;">';
        h+='<div style="font-size:0.9rem;color:rgba(255,255,255,0.6);font-style:italic;">"'+escapeHtml(q.english)+'"</div>';
        h+='<div style="color:var(--neon-purple);font-size:0.8rem;margin-top:5px;">- '+escapeHtml(q.author)+'</div></div>';
        h+='<div style="max-width:500px;margin:0 auto 15px;"><textarea id="dictInput" rows="3" style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(157,78,221,0.3);border-radius:10px;color:white;padding:12px;font-size:1.1rem;resize:none;outline:none;" placeholder="Type the Korean text you memorized..."></textarea></div>';
        h+='<div style="text-align:center;"><button class="game-btn" data-action="checkDict">Check Accuracy</button></div></div>';
        c.innerHTML=h; var el=document.getElementById("dictInput"); if(el)el.focus();
        bind(c,{checkDict:function(){var inp=document.getElementById("dictInput");renderDictRes(c,q,inp?inp.value.trim():"");}});
    }
    /** @param {HTMLElement} c @param {Object} q @param {string} ut */
    function renderDictRes(c,q,ut) {
        var cmp=compareChars(ut,q.korean),pct=cmp.total>0?Math.round((cmp.correct/cmp.total)*100):0;
        if(pct>ST.dictationBest)ST.dictationBest=pct; ST.quotesCompleted++; saveSt();
        if(pct>=70&&typeof addXP==="function")addXP(20);
        var col=pct>=80?"var(--neon-cyan)":pct>=50?"var(--neon-purple)":"var(--neon-pink)";
        var h='<div class="game-container"><h2 class="game-title">Dictation Result</h2>';
        h+='<div style="text-align:center;margin-bottom:15px;"><div style="font-size:2.5rem;font-weight:900;color:'+col+';">'+pct+'%</div>';
        h+='<div style="color:rgba(255,255,255,0.5);">'+cmp.correct+' / '+cmp.total+' characters correct</div>';
        h+='<div style="color:rgba(255,255,255,0.4);font-size:0.8rem;margin-top:5px;">Personal best: '+ST.dictationBest+'%</div></div>';
        h+='<div style="background:var(--glass);border-radius:12px;padding:15px;max-width:500px;margin:0 auto 15px;">';
        h+='<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:8px;">Character comparison (green=correct, pink=wrong):</div>';
        h+='<div style="font-size:1.2rem;line-height:2;letter-spacing:2px;">'+cmp.html+'</div></div>';
        h+='<div style="background:var(--glass);border-radius:12px;padding:12px;max-width:500px;margin:0 auto 15px;text-align:center;">';
        h+='<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:5px;">Full answer:</div>';
        h+='<div style="color:var(--neon-cyan);font-size:1.05rem;">'+escapeHtml(q.korean)+'</div></div>';
        h+='<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">';
        h+='<button class="game-btn" data-action="retry">Try Another</button>';
        h+='<button class="game-btn secondary" data-action="speak" data-param="'+escapeHtml(q.korean)+'">Hear Answer</button></div></div>';
        c.innerHTML=h; bind(c,{retry:function(){showQuoteDictation();},speak:function(t){if(typeof speakKorean==="function")speakKorean(t);}});
    }

    /* ===== MODE 3: Quote Vocabulary ===== */
    /** Quiz Korean meanings of key English words from famous quotes. */
    function showQuoteVocab(){var ga=document.getElementById("gameArea");if(!ga)return;loadSt();vocabRound(ga,0,0);}
    /** @param {HTMLElement} c @param {number} rd @param {number} sc */
    function vocabRound(c,rd,sc) {
        if(rd>=5){vocabResult(c,sc);return;}
        var qt=Q[Math.floor(Math.random()*Q.length)];
        while(!qt.keywords||!qt.keywords.length)qt=Q[Math.floor(Math.random()*Q.length)];
        var kw=qt.keywords[Math.floor(Math.random()*qt.keywords.length)];
        var all=[]; for(var i=0;i<Q.length;i++)if(Q[i].keywords)for(var j=0;j<Q[i].keywords.length;j++)all.push(Q[i].keywords[j]);
        var wrong=[]; shuf(all); for(var k=0;k<all.length&&wrong.length<3;k++)if(all[k].ko!==kw.ko)wrong.push(all[k].ko);
        var opts=shuf([kw.ko].concat(wrong.slice(0,3)));
        var h='<div class="game-container"><h2 class="game-title">Quote Vocabulary</h2>';
        h+='<div style="text-align:center;color:rgba(255,255,255,0.5);margin-bottom:10px;">Round '+(rd+1)+' / 5 | Score: <span style="color:var(--neon-cyan);">'+sc+'</span></div>';
        h+='<div style="background:var(--glass);border:1px solid rgba(157,78,221,0.3);border-radius:15px;padding:20px;max-width:500px;margin:0 auto 15px;text-align:center;">';
        h+='<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:5px;">From the quote:</div>';
        h+='<div style="font-size:0.9rem;font-style:italic;color:rgba(255,255,255,0.6);margin-bottom:15px;">"'+escapeHtml(qt.english)+'"</div>';
        h+='<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:5px;">What is the Korean word for:</div>';
        h+='<div style="font-size:2rem;color:var(--neon-pink);font-weight:700;">'+escapeHtml(kw.en)+'</div></div>';
        h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:400px;margin:0 auto;">';
        for(var m=0;m<opts.length;m++)h+='<button class="game-btn secondary" data-action="vocAns" data-param="'+escapeHtml(opts[m])+'" style="padding:14px;font-size:1.1rem;">'+escapeHtml(opts[m])+'</button>';
        h+='</div></div>'; c.innerHTML=h;
        bind(c,{vocAns:function(sel){var ok=sel===kw.ko;if(ok){if(typeof addXP==="function")addXP(10);if(ST.vocabLearned.indexOf(kw.en)<0){ST.vocabLearned.push(kw.en);saveSt();}}
            vocabFeedback(c,ok,kw,qt,rd,sc+(ok?1:0));}});
    }
    /** @param {HTMLElement} c @param {boolean} ok @param {Object} kw @param {Object} qt @param {number} rd @param {number} sc */
    function vocabFeedback(c,ok,kw,qt,rd,sc) {
        var col=ok?"var(--neon-cyan)":"var(--neon-pink)";
        var h='<div class="game-container"><h2 class="game-title">Quote Vocabulary</h2>';
        h+='<div style="text-align:center;margin-bottom:20px;"><div style="font-size:1.8rem;font-weight:900;color:'+col+';">'+(ok?"Correct!":"Wrong!")+'</div>';
        h+='<div style="font-size:1.3rem;margin-top:10px;">'+escapeHtml(kw.en)+' = <span style="color:var(--neon-cyan);">'+escapeHtml(kw.ko)+'</span></div></div>';
        h+='<div style="background:var(--glass);border-radius:12px;padding:12px;max-width:400px;margin:0 auto 20px;text-align:center;">';
        h+='<div style="font-size:0.85rem;font-style:italic;color:rgba(255,255,255,0.6);">"'+escapeHtml(qt.english)+'"</div>';
        h+='<div style="color:var(--neon-cyan);font-size:0.85rem;margin-top:5px;">'+escapeHtml(qt.korean)+'</div></div>';
        h+='<div style="text-align:center;"><button class="game-btn" data-action="next">Next Word</button></div></div>';
        c.innerHTML=h; bind(c,{next:function(){vocabRound(c,rd+1,sc);}});
    }
    /** @param {HTMLElement} c @param {number} sc */
    function vocabResult(c,sc) {
        ST.quotesCompleted++; saveSt();
        var pct=Math.round((sc/5)*100),col=pct>=80?"var(--neon-cyan)":pct>=50?"var(--neon-purple)":"var(--neon-pink)";
        var h='<div class="game-container"><h2 class="game-title">Vocabulary Results</h2>';
        h+='<div style="text-align:center;margin-bottom:20px;"><div style="font-size:3rem;font-weight:900;color:'+col+';">'+sc+' / 5</div>';
        h+='<div style="color:rgba(255,255,255,0.5);margin-top:5px;">Words learned: '+ST.vocabLearned.length+'</div></div>';
        h+='<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">';
        h+='<button class="game-btn" data-action="again">Play Again</button>';
        h+='<button class="game-btn secondary" data-action="trans">Try Translation</button></div></div>';
        c.innerHTML=h; bind(c,{again:function(){showQuoteVocab();},trans:function(){showQuoteTranslation();}});
    }

    /* ===== Global Exposure ===== */
    window.showQuoteTranslation = showQuoteTranslation;
    window.showQuoteDictation = showQuoteDictation;
    window.showQuoteVocab = showQuoteVocab;
})();

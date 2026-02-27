/**
 * api-weather-chat.js
 * Weather API Korean conversation practice using Open-Meteo (free, no auth).
 * Requires: main-app.js globals (escapeHtml, addXP, addCombo, resetCombo,
 *   saveProgress, gameState, showToast, showPopup, createConfetti,
 *   SoundEngine, speakKorean, shuffle, gameModes, modeGroups)
 */

/** @type {string} */
var WEATHER_API = "https://api.open-meteo.com/v1/forecast";
/** @type {Object.<string,{lat:number,lon:number,english:string}>} */
var koreanCities = {
  "\uC11C\uC6B8":{lat:37.5665,lon:126.978,english:"Seoul"},
  "\uBD80\uC0B0":{lat:35.1796,lon:129.0756,english:"Busan"},
  "\uC81C\uC8FC":{lat:33.4996,lon:126.5312,english:"Jeju"},
  "\uC778\uCC9C":{lat:37.4563,lon:126.7052,english:"Incheon"},
  "\uB300\uAD6C":{lat:35.8714,lon:128.6014,english:"Daegu"},
  "\uAD11\uC8FC":{lat:35.1595,lon:126.8526,english:"Gwangju"},
  "\uB300\uC804":{lat:36.3504,lon:127.3845,english:"Daejeon"},
  "\uC6B8\uC0B0":{lat:35.5384,lon:129.3114,english:"Ulsan"}
};
/** @type {Object.<number,{korean:string,english:string,icon:string}>} */
var weatherKorean = {
  0:{korean:"\uB9D1\uC74C",english:"Clear",icon:"\u2600\uFE0F"},
  1:{korean:"\uB300\uCCB4\uB85C \uB9D1\uC74C",english:"Mainly clear",icon:"\uD83C\uDF24\uFE0F"},
  2:{korean:"\uAD6C\uB984 \uC870\uAE08",english:"Partly cloudy",icon:"\u26C5"},
  3:{korean:"\uD750\uB9BC",english:"Overcast",icon:"\u2601\uFE0F"},
  45:{korean:"\uC548\uAC1C",english:"Fog",icon:"\uD83C\uDF2B\uFE0F"},
  51:{korean:"\uC774\uC2AC\uBE44",english:"Drizzle",icon:"\uD83C\uDF26\uFE0F"},
  61:{korean:"\uBE44",english:"Rain",icon:"\uD83C\uDF27\uFE0F"},
  63:{korean:"\uBE44",english:"Rain",icon:"\uD83C\uDF27\uFE0F"},
  65:{korean:"\uD070 \uBE44",english:"Heavy rain",icon:"\uD83C\uDF27\uFE0F"},
  71:{korean:"\uB208",english:"Snow",icon:"\u2744\uFE0F"},
  73:{korean:"\uB208",english:"Snow",icon:"\u2744\uFE0F"},
  80:{korean:"\uC18C\uB098\uAE30",english:"Showers",icon:"\uD83C\uDF27\uFE0F"},
  95:{korean:"\uCC9C\uB465\uBC88\uAC1C",english:"Thunderstorm",icon:"\u26C8\uFE0F"},
  99:{korean:"\uC6B0\uBC15",english:"Hail",icon:"\uD83C\uDF28\uFE0F"}
};
/** @type {Array<{k:string,r:string,e:string,c:string}>} */
var weatherVocab = [
  {k:"\uB0A0\uC528",r:"nalssi",e:"weather",c:"basic"},{k:"\uAE30\uC628",r:"gion",e:"temperature",c:"basic"},
  {k:"\uBC14\uB78C",r:"baram",e:"wind",c:"basic"},{k:"\uAD6C\uB984",r:"gureum",e:"cloud",c:"basic"},
  {k:"\uD558\uB298",r:"haneul",e:"sky",c:"basic"},{k:"\uBE44",r:"bi",e:"rain",c:"phenom"},
  {k:"\uB208",r:"nun",e:"snow",c:"phenom"},{k:"\uC548\uAC1C",r:"angae",e:"fog",c:"phenom"},
  {k:"\uCC9C\uB465",r:"cheondung",e:"thunder",c:"phenom"},{k:"\uBC88\uAC1C",r:"beongae",e:"lightning",c:"phenom"},
  {k:"\uBB34\uC9C0\uAC1C",r:"mujigae",e:"rainbow",c:"phenom"},{k:"\uC6B0\uBC15",r:"ubak",e:"hail",c:"phenom"},
  {k:"\uC774\uC2AC\uBE44",r:"iseulbi",e:"drizzle",c:"phenom"},{k:"\uC18C\uB098\uAE30",r:"sonagi",e:"shower",c:"phenom"},
  {k:"\uBD04",r:"bom",e:"spring",c:"season"},{k:"\uC5EC\uB984",r:"yeoreum",e:"summer",c:"season"},
  {k:"\uAC00\uC744",r:"gaeul",e:"autumn",c:"season"},{k:"\uACA8\uC6B8",r:"gyeoul",e:"winter",c:"season"},
  {k:"\uB355\uB2E4",r:"deopda",e:"hot",c:"feel"},{k:"\uCDA5\uB2E4",r:"chupda",e:"cold",c:"feel"},
  {k:"\uB530\uB73B\uD558\uB2E4",r:"ttatteuthada",e:"warm",c:"feel"},{k:"\uC2DC\uC6D0\uD558\uB2E4",r:"siwonhada",e:"cool",c:"feel"},
  {k:"\uC2B5\uD558\uB2E4",r:"seupada",e:"humid",c:"feel"},{k:"\uAC74\uC870\uD558\uB2E4",r:"geonjohada",e:"dry",c:"feel"},
  {k:"\uC6B0\uC0B0",r:"usan",e:"umbrella",c:"item"},{k:"\uCF54\uD2B8",r:"koteu",e:"coat",c:"item"},
  {k:"\uC7A5\uAC11",r:"janggap",e:"gloves",c:"item"},{k:"\uBAA8\uC790",r:"moja",e:"hat",c:"item"},
  {k:"\uC120\uAE00\uB77C\uC2A4",r:"seonggeullaseu",e:"sunglasses",c:"item"},
  {k:"\uC7A5\uD654",r:"janghwa",e:"rain boots",c:"item"},
  {k:"\uB9C8\uD50C\uB7EC",r:"mapeulleo",e:"scarf",c:"item"},
  {k:"\uBE44\uAC00 \uC624\uB2E4",r:"biga oda",e:"it rains",c:"expr"},
  {k:"\uB208\uC774 \uC624\uB2E4",r:"nuni oda",e:"it snows",c:"expr"},
  {k:"\uD574\uAC00 \uB728\uB2E4",r:"haega tteuda",e:"sun rises",c:"expr"},
  {k:"\uB0A0\uC528\uAC00 \uC88B\uB2E4",r:"nalssiga jota",e:"weather is good",c:"expr"},
  {k:"\uB0A0\uC528\uAC00 \uB098\uC058\uB2E4",r:"nalssiga nappuda",e:"weather is bad",c:"expr"},
  {k:"\uC6B0\uC0B0\uC744 \uAC00\uC838\uAC00\uC138\uC694",r:"usaneul gajyeogaseyo",e:"bring an umbrella",c:"expr"},
  {k:"\uCF54\uD2B8\uB97C \uC785\uC73C\uC138\uC694",r:"koteureul ibeuseyo",e:"wear a coat",c:"expr"},
  {k:"\uC77C\uAE30 \uC608\uBCF4",r:"ilgi yebo",e:"forecast",c:"basic"},
  {k:"\uCD5C\uACE0 \uAE30\uC628",r:"choego gion",e:"high temp",c:"basic"},
  {k:"\uCD5C\uC800 \uAE30\uC628",r:"choejeo gion",e:"low temp",c:"basic"},
  {k:"\uD669\uC0AC",r:"hwangsa",e:"yellow dust",c:"phenom"},
  {k:"\uBBF8\uC138\uBA3C\uC9C0",r:"misemeonji",e:"fine dust",c:"phenom"},
  {k:"\uC7A5\uB9C8",r:"jangma",e:"monsoon",c:"season"},
  {k:"\uD0DC\uD48D",r:"taepung",e:"typhoon",c:"phenom"},
  {k:"\uB354\uC704",r:"deowi",e:"heat wave",c:"phenom"},
  {k:"\uD55C\uD30C",r:"hanpa",e:"cold wave",c:"phenom"},
  {k:"\uCCB4\uAC10 \uC628\uB3C4",r:"chegam ondo",e:"feels like",c:"basic"},
  {k:"\uB9D1\uC740 \uD558\uB298",r:"malgeun haneul",e:"clear sky",c:"expr"},
  {k:"\uD750\uB9B0 \uD558\uB298",r:"heurin haneul",e:"cloudy sky",c:"expr"},
  {k:"\uBC14\uB78C\uC774 \uBD88\uB2E4",r:"barami bulda",e:"wind blows",c:"expr"}
];
/** @type {Object} */
var weatherCache = {};
/** @type {{city:string,step:number,score:number,msgs:Array}} */
var wChatState = {city:"\uC11C\uC6B8",step:0,score:0,msgs:[]};
/** @type {{score:number,round:number,total:number}} */
var wQuizState = {score:0,round:0,total:5};

/* === API UTILITIES === */

/** @param {string} city @param {string} type @returns {string} */
function buildWeatherUrl(city, type) {
  var c = koreanCities[city] || koreanCities["\uC11C\uC6B8"];
  var u = WEATHER_API+"?latitude="+c.lat+"&longitude="+c.lon+"&timezone=Asia/Seoul";
  if (type==="daily") return u+"&daily=temperature_2m_max,temperature_2m_min,weathercode";
  return u+"&current=temperature_2m,weathercode,windspeed_10m";
}
/** @param {string} city @returns {Object} */
function getFallbackWeather(city) {
  var codes=[0,1,2,3,61,71,95],code=codes[Math.floor(Math.random()*codes.length)];
  return {current:{temperature_2m:Math.round(Math.random()*30-5),weathercode:code,windspeed_10m:Math.round(Math.random()*200)/10},_fb:true};
}
/** @param {string} city @param {function} cb */
function fetchWeather(city, cb) {
  var key=city+"_cur",cached=weatherCache[key];
  if(cached&&Date.now()-cached.ts<600000){cb(cached.d,!!cached.d._fb);return}
  fetch(buildWeatherUrl(city,"current")).then(function(r){
    if(!r.ok)throw new Error(r.status);return r.json();
  }).then(function(d){weatherCache[key]={d:d,ts:Date.now()};cb(d,false);
  }).catch(function(){var fb=getFallbackWeather(city);weatherCache[key]={d:fb,ts:Date.now()};cb(fb,true);});
}
/** @param {number} code @returns {{korean:string,english:string,icon:string}} */
function resolveWCode(code) {
  if(weatherKorean[code])return weatherKorean[code];
  if(code>=80)return weatherKorean[80]||weatherKorean[61];
  if(code>=70)return weatherKorean[71];if(code>=60)return weatherKorean[61];
  if(code>=50)return weatherKorean[51];return weatherKorean[0];
}
/** @param {number} t @returns {{korean:string,english:string}} */
function tempFeel(t) {
  if(t>=33)return{korean:"\uB9E4\uC6B0 \uB354\uC6CC\uC694",english:"Very hot"};
  if(t>=26)return{korean:"\uB354\uC6CC\uC694",english:"Hot"};
  if(t>=18)return{korean:"\uB530\uB73B\uD574\uC694",english:"Warm"};
  if(t>=10)return{korean:"\uC2DC\uC6D0\uD574\uC694",english:"Cool"};
  if(t>=0)return{korean:"\uCDA5\uC6CC\uC694",english:"Cold"};
  return{korean:"\uB9E4\uC6B0 \uCDA5\uC6CC\uC694",english:"Very cold"};
}

/* === SECTION: WEATHER DASHBOARD === */

/** @param {HTMLElement} c */
function showWeatherDashboard(c) {
  var h='<h2 class="game-title">'+escapeHtml("\uD55C\uAD6D \uB0A0\uC528 \uB300\uC2DC\uBCF4\uB4DC")+'</h2>';
  h+='<p style="text-align:center;color:var(--neon-cyan)">Korean Weather Dashboard</p>';
  h+=renderKoreaMap();
  h+='<div id="wCards" class="w-cards-grid"><div class="game-loading"><div class="game-loading-spinner"></div></div></div>';
  h+='<div style="text-align:center;margin-top:12px"><button class="game-btn secondary" data-action="weatherRefresh">'+escapeHtml("\uC0C8\uB85C\uACE0\uCE68 Refresh")+'</button></div>';
  c.innerHTML=h;loadAllCityWeather();
}
/** @returns {string} */
function renderKoreaMap() {
  var pos={"\uC11C\uC6B8":{x:95,y:75},"\uC778\uCC9C":{x:75,y:85},"\uB300\uC804":{x:105,y:145},"\uB300\uAD6C":{x:145,y:170},"\uAD11\uC8FC":{x:80,y:210},"\uBD80\uC0B0":{x:160,y:210},"\uC6B8\uC0B0":{x:165,y:185},"\uC81C\uC8FC":{x:90,y:295}};
  var h='<div style="text-align:center;margin:10px 0"><svg viewBox="0 0 220 320" style="max-width:200px;height:auto">';
  h+='<path d="M90,20 L130,10 L160,25 L170,60 L180,100 L175,140 L165,180 L150,220 L130,250 L100,260 L80,240 L60,200 L50,160 L55,120 L65,80 L75,50 Z" fill="rgba(0,212,255,0.1)" stroke="var(--neon-cyan)" stroke-width="2"/>';
  var keys=Object.keys(pos);
  for(var i=0;i<keys.length;i++){var n=keys[i],p=pos[n];
    h+='<circle cx="'+p.x+'" cy="'+p.y+'" r="5" fill="var(--neon-pink)" style="filter:drop-shadow(0 0 4px var(--neon-pink))"/>';
    h+='<text x="'+p.x+'" y="'+(p.y-10)+'" fill="white" font-size="9" text-anchor="middle">'+escapeHtml(n)+'</text>';
    h+='<text x="'+p.x+'" y="'+(p.y+18)+'" id="mapT_'+escapeHtml(n)+'" fill="var(--gold)" font-size="8" text-anchor="middle"></text>';
  }
  return h+'</svg></div>';
}
/** Loads weather for all cities and renders cards. */
function loadAllCityWeather() {
  var names=Object.keys(koreanCities),results={},done=0;
  for(var i=0;i<names.length;i++){(function(n){
    fetchWeather(n,function(d,fb){results[n]={d:d,fb:fb};done++;if(done===names.length)renderWCards(results);});
  })(names[i]);}
}
/** @param {Object} results */
function renderWCards(results) {
  var el=document.getElementById("wCards");if(!el)return;
  var h="",names=Object.keys(koreanCities);
  for(var i=0;i<names.length;i++){var n=names[i],r=results[n],cur=r.d.current||{};
    var w=resolveWCode(cur.weathercode),f=tempFeel(cur.temperature_2m),eng=koreanCities[n].english;
    h+='<div class="w-city-card"><div style="font-size:2.5rem">'+w.icon+'</div>';
    h+='<div style="font-size:1.1rem;font-weight:bold">'+escapeHtml(n)+'</div>';
    h+='<div style="font-size:0.75rem;color:rgba(255,255,255,0.5)">'+escapeHtml(eng)+'</div>';
    h+='<div style="font-size:1.8rem;color:var(--neon-cyan);font-weight:bold">'+escapeHtml(String(cur.temperature_2m))+'\u00B0C</div>';
    h+='<div style="font-size:0.85rem">'+escapeHtml(w.korean)+'</div>';
    h+='<div style="font-size:0.7rem;color:rgba(255,255,255,0.4)">'+escapeHtml(w.english)+'</div>';
    h+='<div style="font-size:0.75rem;color:var(--gold);margin-top:4px">'+escapeHtml(f.korean)+'</div>';
    h+='<div style="font-size:0.65rem;color:rgba(255,255,255,0.4)">'+escapeHtml("\uD48D\uC18D "+cur.windspeed_10m+" km/h")+'</div>';
    if(r.fb)h+='<div style="font-size:0.6rem;color:var(--neon-pink)">'+escapeHtml("(\uC624\uD504\uB77C\uC778)")+'</div>';
    h+='</div>';
    var mt=document.getElementById("mapT_"+n);if(mt)mt.textContent=cur.temperature_2m+"\u00B0";
  }
  el.innerHTML=h;
}

/* === SECTION: WEATHER CHAT === */

/** @param {HTMLElement} c */
function showWeatherChat(c) {
  wChatState={city:"\uC11C\uC6B8",step:0,score:0,msgs:[]};
  var h='<h2 class="game-title">'+escapeHtml("\uB0A0\uC528 \uB300\uD654 \uC5F0\uC2B5")+'</h2>';
  h+='<p style="text-align:center;color:var(--neon-cyan)">Weather Conversation Practice</p>';
  h+='<div style="text-align:center;margin:10px 0">';
  var names=Object.keys(koreanCities);
  for(var i=0;i<names.length;i++){var cn=names[i],sel=cn===wChatState.city?" active":"";
    h+='<button class="cat-btn'+sel+'" data-action="weatherCitySelect" data-city="'+escapeHtml(cn)+'">'+escapeHtml(cn)+'</button> ';}
  h+='</div><div id="wChatBox" class="w-chat-box"><div class="game-loading"><div class="game-loading-spinner"></div></div></div>';
  h+='<div id="wChatOpts"></div><div style="text-align:center;margin-top:8px"><span style="color:var(--gold)" id="wChatScore">'+escapeHtml("\uC810\uC218: 0")+'</span></div>';
  c.innerHTML=h;startWeatherChat(wChatState.city);
}
/** @param {string} city */
function startWeatherChat(city) {
  wChatState={city:city,step:0,score:0,msgs:[]};
  fetchWeather(city,function(d,fb){
    var cur=d.current||{},w=resolveWCode(cur.weathercode),f=tempFeel(cur.temperature_2m);
    addWMsg("npc",w.icon+" "+escapeHtml(city)+"\uC758 \uB0A0\uC528\uB97C \uD655\uC778\uD588\uC5B4\uC694!","Checked "+koreanCities[city].english+"'s weather!");
    addWMsg("npc",escapeHtml("\uC9C0\uAE08 "+city+" \uAE30\uC628\uC740 "+cur.temperature_2m+"\u00B0C\uC774\uACE0, "+w.korean+"\uC774\uC5D0\uC694."),"Temp "+cur.temperature_2m+"\u00B0C, "+w.english);
    renderWChat();showWChatQ(cur,w,f);
  });
}
/** @param {string} role @param {string} kr @param {string} en */
function addWMsg(role,kr,en){wChatState.msgs.push({role:role,kr:kr,en:en});}
/** Renders chat messages. */
function renderWChat() {
  var box=document.getElementById("wChatBox");if(!box)return;var h="";
  for(var i=0;i<wChatState.msgs.length;i++){var m=wChatState.msgs[i],cls=m.role==="npc"?"w-chat-npc":"w-chat-user";
    h+='<div class="'+cls+'"><div>'+m.kr+'</div><div style="font-size:0.7rem;color:rgba(255,255,255,0.4)">'+escapeHtml(m.en)+'</div></div>';}
  box.innerHTML=h;box.scrollTop=box.scrollHeight;
}
/** @param {Object} cur @param {Object} w @param {Object} f */
function showWChatQ(cur,w,f) {
  var opts=document.getElementById("wChatOpts");if(!opts)return;
  var qs=buildWQs(cur,w,f),q=qs[wChatState.step%qs.length];
  addWMsg("npc",escapeHtml(q.q),q.qe);renderWChat();
  var list=typeof shuffle==="function"?shuffle(q.ch.slice()):q.ch.slice(),h="";
  for(var i=0;i<list.length;i++){
    h+='<button class="quiz-option" data-action="weatherChatAnswer" data-correct="'+(list[i].ok?"1":"0")+'" data-kr="'+escapeHtml(list[i].kr)+'" data-en="'+escapeHtml(list[i].en)+'">';
    h+=escapeHtml(list[i].kr)+'<br><small style="color:rgba(255,255,255,0.4)">'+escapeHtml(list[i].en)+'</small></button>';}
  opts.innerHTML=h;
}
/** @param {Object} cur @param {Object} w @param {Object} f @returns {Array} */
function buildWQs(cur,w,f) {
  var t=cur.temperature_2m,rain=cur.weathercode>=51&&cur.weathercode<=67,qs=[];
  qs.push({q:"\uC624\uB298 \uB0A0\uC528\uAC00 \uC5B4\uB54C\uC694?",qe:"How is the weather?",ch:[
    {kr:"\uC624\uB298 "+w.korean+"\uC774\uC5D0\uC694",en:"Today is "+w.english,ok:true},
    {kr:"\uC624\uB298 \uB208\uC774 \uC640\uC694",en:"It's snowing",ok:w.korean==="\uB208"},
    {kr:"\uC624\uB298 \uB9D1\uC544\uC694",en:"It's clear",ok:w.korean==="\uB9D1\uC74C"}]});
  qs.push({q:"\uC9C0\uAE08 "+f.korean+". \uBB50 \uC785\uC5B4\uC694?",qe:f.english+" now. What to wear?",ch:t<10
    ?[{kr:"\uCF54\uD2B8\uB97C \uC785\uC5B4\uC694",en:"Wear a coat",ok:true},{kr:"\uBC18\uD314\uC744 \uC785\uC5B4\uC694",en:"Short sleeves",ok:false},{kr:"\uC218\uC601\uBCF5\uC744 \uC785\uC5B4\uC694",en:"Swimsuit",ok:false}]
    :[{kr:"\uAC00\uBCBC\uC6B4 \uC637\uC744 \uC785\uC5B4\uC694",en:"Light clothes",ok:true},{kr:"\uB450\uAEBC\uC6B4 \uCF54\uD2B8\uB97C \uC785\uC5B4\uC694",en:"Thick coat",ok:false},{kr:"\uC7A5\uAC11\uC744 \uB07C\uC5B4\uC694",en:"Gloves",ok:false}]});
  qs.push({q:"\uBC16\uC5D0 \uB098\uAC08 \uB54C \uBB50 \uAC00\uC838\uAC00\uC694?",qe:"What to bring outside?",ch:rain
    ?[{kr:"\uC6B0\uC0B0\uC744 \uAC00\uC838\uAC00\uC694",en:"Bring umbrella",ok:true},{kr:"\uC120\uAE00\uB77C\uC2A4\uB97C \uAC00\uC838\uAC00\uC694",en:"Sunglasses",ok:false},{kr:"\uC544\uBB34\uAC83\uB3C4 \uD544\uC694 \uC5C6\uC5B4\uC694",en:"Nothing needed",ok:false}]
    :[{kr:"\uBAA8\uC790\uB97C \uC4F0\uC5B4\uC694",en:"Wear a hat",ok:true},{kr:"\uC6B0\uC0B0\uC744 \uAC00\uC838\uAC00\uC694",en:"Bring umbrella",ok:false},{kr:"\uC7A5\uD654\uB97C \uC2E0\uC5B4\uC694",en:"Rain boots",ok:false}]});
  qs.push({q:"\uD48D\uC18D\uC774 "+cur.windspeed_10m+"km/h\uC608\uC694. \uBC14\uB78C\uC774 \uC5B4\uB54C\uC694?",qe:"Wind "+cur.windspeed_10m+"km/h?",ch:cur.windspeed_10m>15
    ?[{kr:"\uBC14\uB78C\uC774 \uB9CE\uC774 \uBD88\uC5B4\uC694",en:"Very windy",ok:true},{kr:"\uBC14\uB78C\uC774 \uC5C6\uC5B4\uC694",en:"No wind",ok:false},{kr:"\uC870\uAE08 \uBD88\uC5B4\uC694",en:"A little breezy",ok:false}]
    :[{kr:"\uBC14\uB78C\uC774 \uC870\uAE08 \uBD88\uC5B4\uC694",en:"A little breezy",ok:true},{kr:"\uD0DC\uD48D\uC774 \uC640\uC694",en:"Typhoon",ok:false},{kr:"\uBC14\uB78C\uC774 \uB9E4\uC6B0 \uAC15\uD574\uC694",en:"Very strong",ok:false}]});
  return qs;
}
/** @param {boolean} correct @param {string} kr @param {string} en */
function handleWeatherChatAnswer(correct,kr,en) {
  addWMsg("user",escapeHtml(kr),en);
  if(correct){wChatState.score+=10;addWMsg("npc",escapeHtml("\uB9DE\uC544\uC694! \uC798\uD588\uC5B4\uC694!"),"Correct!");
    if(typeof addXP==="function")addXP(10);if(typeof addCombo==="function")addCombo();if(typeof SoundEngine!=="undefined")SoundEngine.correct();
  }else{addWMsg("npc",escapeHtml("\uC544\uB2C8\uC5D0\uC694, \uB2E4\uC2DC \uC0DD\uAC01\uD574\uBCF4\uC138\uC694!"),"No, think again!");
    if(typeof resetCombo==="function")resetCombo();if(typeof SoundEngine!=="undefined")SoundEngine.wrong();}
  renderWChat();var sc=document.getElementById("wChatScore");if(sc)sc.textContent="\uC810\uC218: "+wChatState.score;
  wChatState.step++;
  if(wChatState.step>=4){addWMsg("npc",escapeHtml("\uB300\uD654 \uC644\uB8CC! \uC810\uC218: "+wChatState.score),"Done! Score: "+wChatState.score);renderWChat();
    if(typeof createConfetti==="function")createConfetti(30);
    var opts=document.getElementById("wChatOpts");if(opts)opts.innerHTML='<div style="text-align:center;padding:15px"><div style="font-size:2rem;color:var(--gold)">'+escapeHtml(wChatState.score+"\uC810")+'</div><button class="game-btn" data-action="showWeatherChat">'+escapeHtml("\uB2E4\uC2DC \uD558\uAE30")+'</button></div>';
  }else{fetchWeather(wChatState.city,function(d){var cur=d.current||{};showWChatQ(cur,resolveWCode(cur.weathercode),tempFeel(cur.temperature_2m));});}
}

/* === SECTION: WEATHER QUIZ === */

/** @param {HTMLElement} c */
function showWeatherQuiz(c) {
  wQuizState={score:0,round:0,total:5};
  if(typeof gameState!=="undefined"){gameState.gamesPlayed++;if(typeof saveProgress==="function")saveProgress();}
  nextWQuizRound(c);
}
/** @param {HTMLElement} c */
function nextWQuizRound(c) {
  if(wQuizState.round>=wQuizState.total){showWQuizResult(c);return;}
  wQuizState.round++;var type=wQuizState.round%3;
  if(type===1)showTempQuiz(c);else if(type===2)showCodeQuiz(c);else showItemQuiz(c);
}
/** @param {HTMLElement} c */
function showTempQuiz(c) {
  var names=Object.keys(koreanCities),city=names[Math.floor(Math.random()*names.length)];
  fetchWeather(city,function(d){var t=d.current.temperature_2m;
    var ch=[{text:t+"\u00B0C",ok:true},{text:(t+Math.floor(Math.random()*10)+5)+"\u00B0C",ok:false},{text:(t-Math.floor(Math.random()*10)-5)+"\u00B0C",ok:false}];
    if(typeof shuffle==="function")ch=shuffle(ch);
    renderWQuiz(c,escapeHtml(city)+"\uC758 \uD604\uC7AC \uAE30\uC628\uC740?","Temp in "+koreanCities[city].english+"?",ch);});
}
/** @param {HTMLElement} c */
function showCodeQuiz(c) {
  var codes=Object.keys(weatherKorean),idx=Math.floor(Math.random()*codes.length),code=parseInt(codes[idx],10);
  var correct=weatherKorean[code],others=codes.filter(function(k){return parseInt(k,10)!==code;});
  var w1=weatherKorean[parseInt(others[Math.floor(Math.random()*others.length)],10)];
  var w2=weatherKorean[parseInt(others[Math.floor(Math.random()*others.length)],10)];
  var ch=[{text:correct.korean,ok:true},{text:w1.korean,ok:false},{text:w2.korean,ok:false}];
  if(typeof shuffle==="function")ch=shuffle(ch);
  renderWQuiz(c,correct.icon+" \uC774 \uB0A0\uC528\uB97C \uD55C\uAD6D\uC5B4\uB85C?","What is '"+correct.english+"' in Korean?",ch);
}
/** @param {HTMLElement} c */
function showItemQuiz(c) {
  var items=[{q:"\uBE44\uAC00 \uC62C \uB54C \uD544\uC694\uD55C \uAC83\uC740?",qe:"Need when it rains?",a:"\uC6B0\uC0B0",w:["\uC120\uAE00\uB77C\uC2A4","\uBAA8\uC790"]},
    {q:"\uCD94\uC6B8 \uB54C \uC785\uB294 \uAC83\uC740?",qe:"Wear when cold?",a:"\uCF54\uD2B8",w:["\uBC18\uBC14\uC9C0","\uC0CC\uB4E4"]},
    {q:"\uB9D1\uC740 \uB0A0\uC5D0 \uC4F0\uB294 \uAC83\uC740?",qe:"Use on sunny day?",a:"\uC120\uAE00\uB77C\uC2A4",w:["\uC6B0\uC0B0","\uC7A5\uD654"]},
    {q:"\uB208\uC774 \uC62C \uB54C \uC2E0\uB294 \uAC83\uC740?",qe:"Wear when it snows?",a:"\uC7A5\uD654",w:["\uC0CC\uB4E4","\uC120\uAE00\uB77C\uC2A4"]}];
  var it=items[Math.floor(Math.random()*items.length)];
  var ch=[{text:it.a,ok:true},{text:it.w[0],ok:false},{text:it.w[1],ok:false}];
  if(typeof shuffle==="function")ch=shuffle(ch);renderWQuiz(c,it.q,it.qe,ch);
}
/** @param {HTMLElement} c @param {string} q @param {string} qe @param {Array} ch */
function renderWQuiz(c,q,qe,ch) {
  var h='<h2 class="game-title">'+escapeHtml("\uB0A0\uC528 \uD034\uC988")+'</h2>';
  h+='<p style="text-align:center;color:var(--neon-cyan)">Weather Quiz</p>';
  h+='<div style="text-align:center;margin:8px 0;color:rgba(255,255,255,0.5)">'+wQuizState.round+' / '+wQuizState.total+'</div>';
  h+='<div style="text-align:center;font-size:1.4rem;margin:20px 0;color:white">'+q+'</div>';
  h+='<div style="text-align:center;font-size:0.8rem;color:rgba(255,255,255,0.4);margin-bottom:15px">'+escapeHtml(qe)+'</div>';
  for(var i=0;i<ch.length;i++)h+='<button class="quiz-option" data-action="weatherQuizAnswer" data-correct="'+(ch[i].ok?"1":"0")+'">'+escapeHtml(ch[i].text)+'</button>';
  h+='<div style="text-align:center;margin-top:12px;color:var(--gold)">'+escapeHtml("\uC810\uC218: "+wQuizState.score)+'</div>';
  c.innerHTML=h;
}
/** @param {boolean} correct @param {HTMLElement} el */
function handleWeatherQuizAnswer(correct,el) {
  var btns=document.querySelectorAll(".quiz-option");
  for(var i=0;i<btns.length;i++){btns[i].disabled=true;if(btns[i].getAttribute("data-correct")==="1")btns[i].classList.add("correct");}
  if(correct){wQuizState.score+=20;el.classList.add("correct");
    if(typeof addXP==="function")addXP(15);if(typeof addCombo==="function")addCombo();
    if(typeof SoundEngine!=="undefined")SoundEngine.correct();if(typeof showToast==="function")showToast("\uC815\uB2F5! Correct!");
  }else{el.classList.add("wrong");if(typeof resetCombo==="function")resetCombo();if(typeof SoundEngine!=="undefined")SoundEngine.wrong();}
  setTimeout(function(){nextWQuizRound(document.getElementById("gameArea"));},1500);
}
/** @param {HTMLElement} c */
function showWQuizResult(c) {
  if(typeof createConfetti==="function")createConfetti(50);
  var pct=Math.round((wQuizState.score/(wQuizState.total*20))*100);
  var icon=pct>=80?"\u2600\uFE0F":pct>=50?"\u26C5":"\uD83C\uDF27\uFE0F";
  var h='<h2 class="game-title">'+escapeHtml("\uB0A0\uC528 \uD034\uC988 \uACB0\uACFC")+'</h2>';
  h+='<div style="text-align:center"><div style="font-size:4rem;margin:20px 0">'+icon+'</div>';
  h+='<div style="font-size:2.5rem;color:var(--gold)">'+escapeHtml(wQuizState.score+"\uC810")+'</div>';
  h+='<div style="color:var(--neon-cyan);margin:10px 0">'+escapeHtml(pct+"% \uC815\uB2F5\uB960")+'</div>';
  h+='<button class="game-btn" data-action="showWeatherQuiz">'+escapeHtml("\uB2E4\uC2DC \uD558\uAE30")+'</button> ';
  h+='<button class="game-btn secondary" data-action="showWeatherVocab">'+escapeHtml("\uB2E8\uC5B4\uC7A5")+'</button></div>';
  c.innerHTML=h;
}

/* === SECTION: WEATHER VOCABULARY === */

/** @param {HTMLElement} c */
function showWeatherVocab(c) {
  var cats={basic:{l:"\uAE30\uBCF8 Basic",items:[]},phenom:{l:"\uD604\uC0C1 Phenomena",items:[]},season:{l:"\uACC4\uC808 Seasons",items:[]},feel:{l:"\uB290\uB08C Feelings",items:[]},item:{l:"\uBB3C\uAC74 Items",items:[]},expr:{l:"\uD45C\uD604 Expressions",items:[]}};
  for(var i=0;i<weatherVocab.length;i++){var v=weatherVocab[i];if(cats[v.c])cats[v.c].items.push(v);}
  var h='<h2 class="game-title">'+escapeHtml("\uB0A0\uC528 \uB2E8\uC5B4\uC7A5")+'</h2>';
  h+='<p style="text-align:center;color:var(--neon-cyan)">Weather Vocabulary ('+weatherVocab.length+' words)</p>';
  var ck=Object.keys(cats);
  for(var ci=0;ci<ck.length;ci++){var cat=cats[ck[ci]];if(!cat.items.length)continue;
    h+='<div style="margin:15px 0"><h3 style="color:var(--neon-pink);margin-bottom:8px">'+escapeHtml(cat.l)+'</h3><div class="w-vocab-grid">';
    for(var vi=0;vi<cat.items.length;vi++){var w=cat.items[vi];
      h+='<div class="w-vocab-card"><div style="font-size:1.2rem;font-weight:bold">'+escapeHtml(w.k)+'</div>';
      h+='<div style="font-size:0.75rem;color:var(--neon-cyan)">'+escapeHtml(w.r)+'</div>';
      h+='<div style="font-size:0.8rem;color:rgba(255,255,255,0.6)">'+escapeHtml(w.e)+'</div>';
      h+='<button class="w-speak-btn" data-action="speakKorean" data-korean="'+escapeHtml(w.k)+'">\uD83D\uDD0A</button></div>';}
    h+='</div></div>';}
  h+='<div style="text-align:center;margin-top:12px"><button class="game-btn secondary" data-action="showWeatherQuiz">'+escapeHtml("\uD034\uC988 \uD480\uAE30")+'</button></div>';
  c.innerHTML=h;
}

/* === SECTION: REGISTRATION & CSS === */

/** Registers weather modes into game system. */
function registerWeatherModes() {
  if(typeof gameModes==="undefined")return;
  var nm=[{id:"weatherdash",name:"Weather"},{id:"weatherchat",name:"Weather Chat"},{id:"weatherquiz",name:"Weather Quiz"},{id:"weathervocab",name:"Weather Words"}];
  for(var i=0;i<nm.length;i++){var ex=false;for(var j=0;j<gameModes.length;j++){if(gameModes[j].id===nm[i].id){ex=true;break;}}if(!ex)gameModes.push(nm[i]);}
  if(typeof modeGroups!=="undefined"){for(var g=0;g<modeGroups.length;g++){if(modeGroups[g].label==="Learn"){var lm=modeGroups[g].modes;
    if(lm.indexOf("weatherdash")===-1)lm.push("weatherdash","weatherchat","weatherquiz","weathervocab");break;}}}
  patchShowModeContent();if(typeof renderNavTabs==="function")renderNavTabs();
}
/** Patches showModeContent to handle weather modes. */
function patchShowModeContent() {
  if(typeof showModeContent==="undefined")return;var orig=showModeContent;
  showModeContent=function(mode,c){
    if(mode==="weatherdash")showWeatherDashboard(c);else if(mode==="weatherchat")showWeatherChat(c);
    else if(mode==="weatherquiz")showWeatherQuiz(c);else if(mode==="weathervocab")showWeatherVocab(c);
    else orig(mode,c);};
}
registerWeatherModes();
/** Injects weather module CSS styles. */
(function(){var s=document.createElement("style");s.textContent=
".w-cards-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin:10px 0}"+
".w-city-card{background:rgba(255,255,255,0.05);border:1px solid rgba(0,212,255,0.2);border-radius:12px;padding:12px;text-align:center;transition:transform 0.2s,box-shadow 0.2s}"+
".w-city-card:hover{transform:translateY(-2px);box-shadow:0 0 15px rgba(0,212,255,0.3)}"+
".w-chat-box{background:rgba(0,0,0,0.3);border:1px solid rgba(255,45,149,0.2);border-radius:12px;padding:12px;max-height:280px;overflow-y:auto;margin:10px 0}"+
".w-chat-npc{background:rgba(157,78,221,0.2);border-radius:12px 12px 12px 0;padding:10px;margin:6px 0;max-width:85%;border:1px solid rgba(157,78,221,0.3)}"+
".w-chat-user{background:rgba(0,212,255,0.15);border-radius:12px 12px 0 12px;padding:10px;margin:6px 0;max-width:85%;margin-left:auto;text-align:right;border:1px solid rgba(0,212,255,0.3)}"+
".w-vocab-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}"+
".w-vocab-card{background:rgba(255,255,255,0.05);border:1px solid rgba(255,215,0,0.15);border-radius:8px;padding:10px;position:relative;text-align:center}"+
".w-speak-btn{position:absolute;top:5px;right:5px;background:none;border:none;cursor:pointer;font-size:0.9rem;opacity:0.6;padding:2px}"+
".w-speak-btn:hover{opacity:1}";document.head.appendChild(s);})();

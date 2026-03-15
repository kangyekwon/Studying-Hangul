/**
 * visual-word-network.js
 * Interactive word relationship network, mind map, and progress
 * bubble chart for Korean vocabulary learning.
 * Canvas-based with force-directed physics simulation.
 * @requires main-app.js (escapeHtml, speakKorean, showToast, gameState)
 */
(function () {
  "use strict";

  /** @type {Object<string, string[]>} Category-based word relations */
  var REL = {
    "\uAC00\uC871": ["\uC544\uBC84\uC9C0", "\uC5B4\uBA38\uB2C8", "\uD615", "\uB204\uB098", "\uB3D9\uC0DD", "\uD560\uBA38\uB2C8"],
    "\uC74C\uC2DD": ["\uAE40\uCE58", "\uBC25", "\uAD6D", "\uBC18\uCC2C", "\uB5A1\uBCF6\uC774", "\uBE44\uBE54\uBC25"],
    "\uAC10\uC815": ["\uD589\uBCF5", "\uC2AC\uD514", "\uBD84\uB178", "\uC0AC\uB791", "\uB450\uB824\uC6C0"],
    "\uD559\uAD50": ["\uC120\uC0DD\uB2D8", "\uD559\uC0DD", "\uAD50\uC2E4", "\uACF5\uBD80", "\uC2DC\uD5D8"],
    "\uB0A0\uC528": ["\uBE44", "\uB208", "\uBC14\uB78C", "\uAD6C\uB984", "\uD587\uC0B4"],
    "\uC2E0\uCCB4": ["\uBA38\uB9AC", "\uB208", "\uCF54", "\uC785", "\uC190", "\uBC1C"],
    "\uAD50\uD1B5": ["\uBC84\uC2A4", "\uC9C0\uD558\uCCA0", "\uD0DD\uC2DC", "\uC790\uB3D9\uCC28", "\uBE44\uD589\uAE30"],
    "\uC9C1\uC5C5": ["\uC758\uC0AC", "\uC120\uC0DD\uB2D8", "\uACBD\uCC30", "\uC694\uB9AC\uC0AC", "\uAC00\uC218"],
    "\uB3D9\uBB3C": ["\uAC15\uC544\uC9C0", "\uACE0\uC591\uC774", "\uC0C8", "\uBB3C\uACE0\uAE30", "\uD1A0\uB07C"],
    "\uC0C9\uAE54": ["\uBE68\uAC15", "\uD30C\uB791", "\uB178\uB791", "\uCD08\uB85D", "\uBCF4\uB77C"]
  };
  /** @type {Object<string, string>} Korean to English lookup */
  var EN = {
    "\uAC00\uC871":"Family","\uC544\uBC84\uC9C0":"Father","\uC5B4\uBA38\uB2C8":"Mother","\uD615":"Older brother",
    "\uB204\uB098":"Older sister","\uB3D9\uC0DD":"Sibling","\uD560\uBA38\uB2C8":"Grandmother",
    "\uC74C\uC2DD":"Food","\uAE40\uCE58":"Kimchi","\uBC25":"Rice","\uAD6D":"Soup","\uBC18\uCC2C":"Side dish",
    "\uB5A1\uBCF6\uC774":"Tteokbokki","\uBE44\uBE54\uBC25":"Bibimbap",
    "\uAC10\uC815":"Emotion","\uD589\uBCF5":"Happiness","\uC2AC\uD514":"Sadness","\uBD84\uB178":"Anger",
    "\uC0AC\uB791":"Love","\uB450\uB824\uC6C0":"Fear",
    "\uD559\uAD50":"School","\uC120\uC0DD\uB2D8":"Teacher","\uD559\uC0DD":"Student","\uAD50\uC2E4":"Classroom",
    "\uACF5\uBD80":"Study","\uC2DC\uD5D8":"Exam",
    "\uB0A0\uC528":"Weather","\uBE44":"Rain","\uB208":"Snow","\uBC14\uB78C":"Wind","\uAD6C\uB984":"Cloud",
    "\uD587\uC0B4":"Sunshine","\uC2E0\uCCB4":"Body","\uBA38\uB9AC":"Head","\uCF54":"Nose","\uC785":"Mouth",
    "\uC190":"Hand","\uBC1C":"Foot",
    "\uAD50\uD1B5":"Transport","\uBC84\uC2A4":"Bus","\uC9C0\uD558\uCCA0":"Subway","\uD0DD\uC2DC":"Taxi",
    "\uC790\uB3D9\uCC28":"Car","\uBE44\uD589\uAE30":"Airplane",
    "\uC9C1\uC5C5":"Job","\uC758\uC0AC":"Doctor","\uACBD\uCC30":"Police","\uC694\uB9AC\uC0AC":"Chef",
    "\uAC00\uC218":"Singer","\uB3D9\uBB3C":"Animal","\uAC15\uC544\uC9C0":"Puppy","\uACE0\uC591\uC774":"Cat",
    "\uC0C8":"Bird","\uBB3C\uACE0\uAE30":"Fish","\uD1A0\uB07C":"Rabbit",
    "\uC0C9\uAE54":"Color","\uBE68\uAC15":"Red","\uD30C\uB791":"Blue","\uB178\uB791":"Yellow",
    "\uCD08\uB85D":"Green","\uBCF4\uB77C":"Purple"
  };
  var COL = ["#FF6B9D","#4ECDC4","#FFE66D","#95E1D3","#DDA0DD",
             "#FF69B4","#64B5F6","#BA68C8","#F4A460","#00CED1"];
  var CATS = Object.keys(REL);

  /* -- Helpers -------------------------------------------------------- */

  /** @param {HTMLElement} p  @param {number} w  @param {number} h */
  function mkCv(p, w, h) {
    var c = document.createElement("canvas");
    c.width = w; c.height = h;
    c.style.cssText = "width:100%;max-width:"+w+"px;height:auto;display:block;" +
      "margin:0 auto;border-radius:12px;background:#0a0a1a";
    c.setAttribute("role", "img"); p.appendChild(c);
    return { cv: c, ctx: c.getContext("2d") };
  }
  /** @param {PointerEvent} e  @param {HTMLCanvasElement} c */
  function cPt(e, c) {
    var r = c.getBoundingClientRect();
    return { x: (e.clientX - r.left) * c.width / r.width,
             y: (e.clientY - r.top) * c.height / r.height };
  }
  function tts(w) { if (typeof speakKorean === "function") speakKorean(w); }
  function mkEl(tag, css, txt) {
    var e = document.createElement(tag);
    if (css) e.style.cssText = css;
    if (txt) e.textContent = txt;
    return e;
  }
  var PNL = "display:none;text-align:center;margin-top:10px;padding:12px;" +
    "background:rgba(26,26,46,0.9);border-radius:10px;border:1px solid rgba(157,78,221,0.4)";

  /* ====================================================================
   *  1. showWordNetwork(container) - Force-directed word graph
   * ==================================================================== */
  var ns = null;

  /** @returns {{nodes:Object[], edges:Object[]}} */
  function bGraph() {
    var nodes = [], edges = [], id = 0;
    CATS.forEach(function (cat, ci) {
      var cl = COL[ci], a = ci * 2 * Math.PI / CATS.length;
      var cx = 310 + Math.cos(a) * 140, cy = 220 + Math.sin(a) * 130;
      var cn = {id:id++,l:cat,cat:cat,c:cl,x:cx,y:cy,vx:0,vy:0,r:24,hub:1};
      nodes.push(cn);
      (REL[cat]||[]).forEach(function (w, wi) {
        var wa = wi * 2 * Math.PI / REL[cat].length;
        var wn = {id:id++,l:w,cat:cat,c:cl,
          x:cx+Math.cos(wa)*55+(Math.random()-.5)*20,
          y:cy+Math.sin(wa)*55+(Math.random()-.5)*20,
          vx:0,vy:0,r:15,hub:0};
        nodes.push(wn); edges.push({s:cn,t:wn});
      });
    });
    return {nodes:nodes,edges:edges};
  }

  /** @param {Object[]} N  @param {Object[]} E  @param {number} W  @param {number} H */
  function forceTick(N, E, W, H) {
    var i,j,a,b,dx,dy,d,f;
    for (i=0;i<N.length;i++) { a=N[i];
      for (j=i+1;j<N.length;j++) { b=N[j];
        dx=a.x-b.x; dy=a.y-b.y; d=Math.sqrt(dx*dx+dy*dy)||1;
        f=400/(d*d);
        a.vx+=dx/d*f; a.vy+=dy/d*f; b.vx-=dx/d*f; b.vy-=dy/d*f;
    }}
    for (i=0;i<E.length;i++) {
      dx=E[i].t.x-E[i].s.x; dy=E[i].t.y-E[i].s.y;
      d=Math.sqrt(dx*dx+dy*dy)||1; f=(d-75)*0.008;
      E[i].s.vx+=dx/d*f; E[i].s.vy+=dy/d*f;
      E[i].t.vx-=dx/d*f; E[i].t.vy-=dy/d*f;
    }
    for (i=0;i<N.length;i++) { a=N[i];
      a.vx+=(W/2-a.x)*0.0008; a.vy+=(H/2-a.y)*0.0008;
      a.vx*=0.88; a.vy*=0.88; a.x+=a.vx; a.y+=a.vy;
      a.x=Math.max(a.r,Math.min(W-a.r,a.x));
      a.y=Math.max(a.r,Math.min(H-a.r,a.y));
    }
  }

  function drawNet() {
    if (!ns) return;
    var ctx=ns.ctx,W=ns.cv.width,H=ns.cv.height;
    ctx.clearRect(0,0,W,H);
    forceTick(ns.N,ns.E,W,H);
    ns.E.forEach(function(e){
      ctx.beginPath(); ctx.moveTo(e.s.x,e.s.y); ctx.lineTo(e.t.x,e.t.y);
      ctx.strokeStyle="rgba(157,78,221,0.25)"; ctx.lineWidth=1; ctx.stroke();
    });
    ns.N.forEach(function(n){
      var hl=n===ns.sel||n===ns.hov;
      ctx.save(); ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.shadowColor=hl?"#FFD700":n.c; ctx.shadowBlur=hl?25:14;
      ctx.fillStyle=n.c+"40"; ctx.fill();
      ctx.strokeStyle=n.c; ctx.lineWidth=hl?3:1.5; ctx.stroke();
      ctx.shadowBlur=0; ctx.fillStyle="#fff";
      ctx.font=(n.hub?"bold 11px":"10px")+' "Noto Sans KR",sans-serif';
      ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(n.l,n.x,n.y); ctx.restore();
    });
    ns.raf=requestAnimationFrame(drawNet);
  }

  function nHit(px,py) {
    if (!ns) return null;
    for (var i=ns.N.length-1;i>=0;i--) {
      var n=ns.N[i],dx=px-n.x,dy=py-n.y;
      if (dx*dx+dy*dy<=n.r*n.r) return n;
    } return null;
  }

  /** @param {Object} n  @param {HTMLElement} p */
  function nDetail(n, p) {
    p.innerHTML="";
    p.appendChild(mkEl("div","font-size:1.4rem;font-weight:bold",n.l));
    p.appendChild(mkEl("div","font-size:0.85rem;color:#ccc;margin:4px 0",
      (EN[n.l]||"")+" | "+escapeHtml(n.cat)));
    var b=document.createElement("button");
    b.className="game-btn";
    b.style.cssText="font-size:0.75rem;padding:4px 12px;margin-top:4px";
    b.textContent="\uBC1C\uC74C \uB4E3\uAE30";
    b.setAttribute("aria-label",escapeHtml(n.l)+" \uBC1C\uC74C \uB4E3\uAE30");
    b.addEventListener("click",function(){tts(n.l);}); p.appendChild(b);
    p.style.display="block";
  }

  /**
   * Render interactive word relationship network.
   * @param {HTMLElement} container - DOM element to render into
   */
  function showWordNetwork(container) {
    if (ns&&ns.raf) cancelAnimationFrame(ns.raf);
    container.innerHTML="";
    container.appendChild(mkEl("h2","","")).className="game-title";
    container.firstChild.textContent="\uB2E8\uC5B4 \uAD00\uACC4 \uB124\uD2B8\uC6CC\uD06C";
    var o=mkCv(container,620,440);
    o.cv.setAttribute("aria-label","\uB2E8\uC5B4 \uAD00\uACC4 \uB124\uD2B8\uC6CC\uD06C \uADF8\uB798\uD504");
    var pnl=mkEl("div",PNL); container.appendChild(pnl);
    var g=bGraph();
    ns={cv:o.cv,ctx:o.ctx,N:g.nodes,E:g.edges,sel:null,hov:null,drag:null,raf:null};
    o.cv.addEventListener("pointerdown",function(e){
      var pt=cPt(e,o.cv),n=nHit(pt.x,pt.y);
      if(n){ns.drag=n;ns.sel=n;nDetail(n,pnl);tts(n.l);}
      o.cv.setPointerCapture(e.pointerId);
    });
    o.cv.addEventListener("pointermove",function(e){
      var pt=cPt(e,o.cv);
      if(ns.drag){ns.drag.x=pt.x;ns.drag.y=pt.y;ns.drag.vx=0;ns.drag.vy=0;}
      else{ns.hov=nHit(pt.x,pt.y);o.cv.style.cursor=ns.hov?"grab":"default";}
    });
    o.cv.addEventListener("pointerup",function(){ns.drag=null;});
    drawNet();
  }

  /* ====================================================================
   *  2. showMindMap(container) - Radial tree mind map
   * ==================================================================== */
  var mm=null;

  /** @param {string[]} exp  @returns {Object[]} */
  function bTree(exp) {
    var N=[],cx=310,cy=220;
    N.push({id:0,l:"\uD55C\uAD6D\uC5B4",en:"Korean",x:cx,y:cy,r:30,
      c:"#9d4edd",d:0,pid:-1});
    CATS.forEach(function(cat,ci){
      var a=ci*2*Math.PI/CATS.length-Math.PI/2,dist=135,cl=COL[ci];
      var isE=exp.indexOf(cat)>=0,cid=N.length;
      N.push({id:cid,l:cat,en:EN[cat]||"",x:cx+Math.cos(a)*dist,
        y:cy+Math.sin(a)*dist,r:21,c:cl,d:1,pid:0,cat:cat,exp:isE});
      if(isE&&REL[cat]){
        var ws=REL[cat];
        ws.forEach(function(w,wi){
          var wa=a+(wi-(ws.length-1)/2)*0.28;
          N.push({id:N.length,l:w,en:EN[w]||"",
            x:cx+Math.cos(wa)*(dist+82),y:cy+Math.sin(wa)*(dist+82),
            r:14,c:cl,d:2,pid:cid});
        });
      }
    });
    return N;
  }

  function drawMM() {
    if(!mm) return;
    var ctx=mm.ctx,W=mm.cv.width,H=mm.cv.height;
    ctx.clearRect(0,0,W,H); ctx.save();
    ctx.translate(mm.px,mm.py); ctx.scale(mm.zm,mm.zm);
    mm.N.forEach(function(n){
      if(n.pid<0) return;
      var p=mm.N.find(function(nd){return nd.id===n.pid;});
      if(!p) return;
      ctx.beginPath(); ctx.moveTo(p.x,p.y);
      ctx.quadraticCurveTo((p.x+n.x)/2,p.y,n.x,n.y);
      ctx.strokeStyle=n.c+"60"; ctx.lineWidth=n.d===1?2:1; ctx.stroke();
    });
    mm.N.forEach(function(n){
      ctx.save(); ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.shadowColor=n.c; ctx.shadowBlur=12;
      ctx.fillStyle=n.c+"50"; ctx.fill();
      ctx.strokeStyle=n.c; ctx.lineWidth=1.5; ctx.stroke();
      ctx.shadowBlur=0; ctx.fillStyle="#fff";
      ctx.font=(n.d===0?"bold 12px":n.d===1?"bold 10px":"9px")+
        ' "Noto Sans KR",sans-serif';
      ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(n.l,n.x,n.y-(n.en?5:0));
      if(n.en){ctx.font='8px "Noto Sans KR",sans-serif';
        ctx.fillStyle="rgba(255,255,255,0.6)";ctx.fillText(n.en,n.x,n.y+8);}
      ctx.restore();
    });
    ctx.restore();
  }

  /**
   * Render interactive mind map visualization.
   * @param {HTMLElement} container - DOM element to render into
   */
  function showMindMap(container) {
    if(mm&&mm.raf) cancelAnimationFrame(mm.raf);
    container.innerHTML="";
    var h2=mkEl("h2","","\uB2E8\uC5B4 \uB9C8\uC778\uB4DC\uB9F5");
    h2.className="game-title"; container.appendChild(h2);
    container.appendChild(mkEl("p",
      "text-align:center;color:#ccc;font-size:0.8rem;margin-bottom:8px",
      "\uCE74\uD14C\uACE0\uB9AC \uB178\uB4DC\uB97C \uD074\uB9AD\uD558\uBA74 \uD655\uC7A5/\uCD95\uC18C\uB429\uB2C8\uB2E4"));
    var o=mkCv(container,620,440);
    o.cv.setAttribute("aria-label","\uB2E8\uC5B4 \uB9C8\uC778\uB4DC\uB9F5 \uC2DC\uAC01\uD654");
    var exp=[];
    mm={cv:o.cv,ctx:o.ctx,N:bTree(exp),exp:exp,
      zm:1,px:0,py:0,pan:false,lp:null,raf:null};
    o.cv.addEventListener("pointerdown",function(e){
      var pt=cPt(e,o.cv);
      var x=(pt.x-mm.px)/mm.zm,y=(pt.y-mm.py)/mm.zm,hit=null;
      mm.N.forEach(function(n){
        var dx=x-n.x,dy=y-n.y;
        if(dx*dx+dy*dy<=n.r*n.r) hit=n;
      });
      if(hit&&hit.d===1){
        var idx=mm.exp.indexOf(hit.cat);
        if(idx>=0) mm.exp.splice(idx,1); else mm.exp.push(hit.cat);
        mm.N=bTree(mm.exp); drawMM();
      } else if(hit&&hit.d===2){
        tts(hit.l);
        if(typeof showToast==="function") showToast(hit.l+" = "+(EN[hit.l]||""));
      } else { mm.pan=true; mm.lp=pt; o.cv.setPointerCapture(e.pointerId); }
    });
    o.cv.addEventListener("pointermove",function(e){
      if(!mm.pan) return; var pt=cPt(e,o.cv);
      mm.px+=pt.x-mm.lp.x; mm.py+=pt.y-mm.lp.y; mm.lp=pt; drawMM();
    });
    o.cv.addEventListener("pointerup",function(){mm.pan=false;});
    o.cv.addEventListener("wheel",function(e){
      e.preventDefault();
      mm.zm=Math.max(0.3,Math.min(3,mm.zm*(e.deltaY>0?0.9:1.1))); drawMM();
    },{passive:false});
    drawMM();
  }

  /* ====================================================================
   *  3. showProgressBubbles(container) - Floating bubble chart
   * ==================================================================== */
  var bs=null;

  /** @returns {Object[]} */
  function bBubs() {
    var out=[];
    CATS.forEach(function(cat,i){
      var tot=(REL[cat]||[]).length,lrn=Math.floor(Math.random()*(tot+1));
      var acc=Math.random()*0.6+0.4,r=22+lrn*5;
      var g=Math.floor(acc*255),rb=Math.floor((1-acc)*255);
      out.push({l:cat,en:EN[cat]||"",x:60+Math.random()*480,
        y:60+Math.random()*280,vx:(Math.random()-.5)*.5,
        vy:(Math.random()-.5)*.5,r:r,
        color:"rgb("+rb+","+g+",80)",lrn:lrn,tot:tot,acc:acc});
    });
    return out;
  }

  /** @param {Object[]} B  @param {number} W  @param {number} H */
  function simB(B,W,H) {
    var i,j,a,b,dx,dy,d,ov;
    for(i=0;i<B.length;i++){a=B[i];
      for(j=i+1;j<B.length;j++){b=B[j];
        dx=a.x-b.x;dy=a.y-b.y;d=Math.sqrt(dx*dx+dy*dy)||1;
        ov=a.r+b.r-d;
        if(ov>0){var p=ov*0.02;
          a.vx+=dx/d*p;a.vy+=dy/d*p;b.vx-=dx/d*p;b.vy-=dy/d*p;}
    }}
    for(i=0;i<B.length;i++){a=B[i];
      a.vx*=0.98;a.vy*=0.98;a.x+=a.vx;a.y+=a.vy;
      if(a.x-a.r<0){a.x=a.r;a.vx*=-.5;}
      if(a.x+a.r>W){a.x=W-a.r;a.vx*=-.5;}
      if(a.y-a.r<0){a.y=a.r;a.vy*=-.5;}
      if(a.y+a.r>H){a.y=H-a.r;a.vy*=-.5;}
    }
  }

  function drawBub() {
    if(!bs) return;
    var ctx=bs.ctx,W=bs.cv.width,H=bs.cv.height;
    ctx.clearRect(0,0,W,H); simB(bs.B,W,H);
    bs.B.forEach(function(b){
      ctx.save(); ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
      ctx.shadowColor=b.color; ctx.shadowBlur=15;
      ctx.fillStyle=b.color.replace("rgb","rgba").replace(")",",0.35)");
      ctx.fill(); ctx.strokeStyle=b.color; ctx.lineWidth=2; ctx.stroke();
      ctx.shadowBlur=0; ctx.fillStyle="#fff";
      ctx.font='bold 10px "Noto Sans KR",sans-serif';
      ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(b.l,b.x,b.y-6);
      ctx.font='8px "Noto Sans KR",sans-serif';
      ctx.fillStyle="rgba(255,255,255,0.7)";
      ctx.fillText(b.lrn+"/"+b.tot+" ("+Math.round(b.acc*100)+"%)",b.x,b.y+8);
      ctx.restore();
    });
    bs.raf=requestAnimationFrame(drawBub);
  }

  /** @param {Object} b  @param {HTMLElement} p */
  function bubInfo(b,p) {
    p.innerHTML="";
    p.appendChild(mkEl("div","font-size:1.3rem;font-weight:bold;margin-bottom:4px",
      b.l+" ("+escapeHtml(b.en)+")"));
    p.appendChild(mkEl("div","font-size:0.85rem;color:#ccc",
      "\uD559\uC2B5: "+b.lrn+"/"+b.tot+" | \uC815\uB2F5\uB960: "+Math.round(b.acc*100)+"%"));
    var ws=REL[b.l]||[];
    if(ws.length){
      var row=mkEl("div","display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;justify-content:center");
      ws.forEach(function(w){
        row.appendChild(mkEl("span",
          "padding:2px 8px;border-radius:10px;font-size:0.75rem;" +
          "background:rgba(157,78,221,0.3);color:#fff",w));
      });
      p.appendChild(row);
    }
    p.style.display="block";
  }

  /**
   * Render floating progress bubble chart.
   * @param {HTMLElement} container - DOM element to render into
   */
  function showProgressBubbles(container) {
    if(bs&&bs.raf) cancelAnimationFrame(bs.raf);
    container.innerHTML="";
    var h2=mkEl("h2","","\uD559\uC2B5 \uC9C4\uD589 \uBC84\uBE14 \uCC28\uD2B8");
    h2.className="game-title"; container.appendChild(h2);
    container.appendChild(mkEl("p",
      "text-align:center;color:#ccc;font-size:0.75rem;margin-bottom:8px",
      "\uBC84\uBE14 \uD06C\uAE30 = \uD559\uC2B5 \uB2E8\uC5B4 \uC218 | \uC0C9\uC0C1 \uBE68\uAC15\u2192\uCD08\uB85D = \uC815\uB2F5\uB960"));
    var o=mkCv(container,620,400);
    o.cv.setAttribute("aria-label","\uD559\uC2B5 \uC9C4\uD589 \uBC84\uBE14 \uCC28\uD2B8");
    var pnl=mkEl("div",PNL); container.appendChild(pnl);
    bs={cv:o.cv,ctx:o.ctx,B:bBubs(),raf:null};
    o.cv.addEventListener("pointerdown",function(e){
      var pt=cPt(e,o.cv),hit=null;
      bs.B.forEach(function(b){
        var dx=pt.x-b.x,dy=pt.y-b.y;
        if(dx*dx+dy*dy<=b.r*b.r) hit=b;
      });
      if(hit) bubInfo(hit,pnl);
    });
    drawBub();
  }

  /* -- Global exports ------------------------------------------------- */
  window.showWordNetwork = showWordNetwork;
  window.showMindMap = showMindMap;
  window.showProgressBubbles = showProgressBubbles;
})();

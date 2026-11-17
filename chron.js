/* Хроника: год по дорожкам. Одна дорожка на каждого персонажа — люди и цифровые двойники одинаково.
   Закрашенная точка — запись написана этим голосом; кружок — персонаж есть в тексте записи; полоса — от первого появления до последнего (у двойника — до ухода). */
window.Chron=(function(){
"use strict";
const A=()=>window.__APP;
let all=false;
function show(){const app=A(),esc=app.esc,BOOK=app.BOOK;app.clearView();app.setNav("map");
  const ALL=(window.CHRON||[]).filter(l=>(l.a.length+l.s.length)>0||l.life),LN=all?ALL:ALL.filter(l=>l.main);
  let LEFT=200;const LH=24,TOP=40,H=TOP+LN.length*LH+16;
  app.view.innerHTML=`<div class="page-head"><div class="eyebrow">Хроника · ${BOOK.length} записей · ${ALL.length} персонажей</div><h2>Год по дорожкам</h2><div class="sub">У каждого персонажа — своя дорожка, по порядку появления: люди и цифровые двойники вперемешку. Закрашенная точка — запись написана его голосом; кружок — он есть в тексте записи; полоса — от первого появления до последнего. Нажмите на точку — откроется запись; на подчёркнутое имя — разговор.</div></div>
   <div class="chlegend" aria-hidden="true"><span><i class="f"></i>пишет запись</span><span><i class="o"></i>есть в записи</span><span><i class="b"></i>время в книге</span><button type="button" class="chip" id="chAll" aria-pressed="${all}">${all?"Только главные":"Показать всех · "+ALL.length}</button></div>
   <div class="mapbox"><canvas id="chC" style="height:${H}px;touch-action:pan-y" aria-label="Хроника: дорожки ${LN.length} персонажей по 154 записям"></canvas><div class="tip" id="chT" hidden></div></div>`;
  const cv=document.getElementById("chC"),ctx=cv.getContext("2d"),tip=document.getElementById("chT");
  const N=BOOK.length,ORDER=BOOK.map(e=>e.n);let pts=[],labels=[],hover=null,W=0;
  function X(n){const i=ORDER.indexOf(n);return LEFT+(W-LEFT-16)*(i/(N-1))}
  function draw(){const dpr=devicePixelRatio||1;W=cv.clientWidth;LEFT=W<600?120:200;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    const css=getComputedStyle(document.documentElement),col=v=>css.getPropertyValue(v).trim();ctx.clearRect(0,0,W,H);pts=[];labels=[];
    const ink=col("--ink")||"#16191D",mut=col("--muted")||"#5A6570",dot=col("--stamp")||"#2E55B0";
    ctx.font="10px "+col("--f-mono");ctx.fillStyle=mut;ctx.strokeStyle=col("--line-soft");
    const BL=(window.BOOKDATA.stats&&window.BOOKDATA.stats.blocks)||[];
    BL.forEach((b,bi)=>{const f=BOOK.find(e=>e.b===bi);if(!f)return;const x=X(f.n);ctx.beginPath();ctx.moveTo(x,TOP-8);ctx.lineTo(x,H-10);ctx.stroke();if(bi%2===0||bi===BL.length-1){ctx.save();ctx.translate(x+2,TOP-12);ctx.rotate(-.5);ctx.fillText(b,0,0);ctx.restore()}});
    LN.forEach((l,i)=>{const y=TOP+i*LH+LH/2;
      ctx.font="12px "+col("--f-ui");const mx=W<600?15:26;const nm=l.name.length>mx?l.name.slice(0,mx-1)+"…":l.name;ctx.fillStyle=l.chat?dot:ink;ctx.fillText(nm,8,y+4);
      if(l.chat){const w=ctx.measureText(nm).width;ctx.fillRect(8,y+6,w,1);labels.push({x0:8,x1:8+w,y,k:l.chat,name:l.name})}
      ctx.strokeStyle=col("--line-soft");ctx.beginPath();ctx.moveTo(LEFT,y);ctx.lineTo(W-16,y);ctx.stroke();
      const all=[...l.a,...l.s].sort((p,q)=>ORDER.indexOf(p)-ORDER.indexOf(q));
      const a0=l.life?l.life[0]:all[0],a1=l.life?Math.max(l.life[1],all[all.length-1]||0):all[all.length-1];
      if(a0!=null&&a1!=null){ctx.fillStyle=ink;ctx.globalAlpha=.10;ctx.beginPath();ctx.roundRect(X(a0)-4,y-5,Math.max(8,X(a1)-X(a0)+8),10,5);ctx.fill();ctx.globalAlpha=1}
      l.s.forEach(n=>{const e=app.BY[n];if(e)pts.push({x:X(n),y,e,l,f:false})});
      l.a.forEach(n=>{const e=app.BY[n];if(e)pts.push({x:X(n),y,e,l,f:true})})});
    pts.forEach(p=>{const r=p===hover?5.5:3.6;ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);if(p.f){ctx.fillStyle=dot;ctx.fill()}else{ctx.fillStyle=col("--sheet")||"#fff";ctx.fill();ctx.lineWidth=1.4;ctx.strokeStyle=dot;ctx.stroke()}})}
  function pick(ev){const r=cv.getBoundingClientRect(),x=ev.clientX-r.left,y=ev.clientY-r.top;let b=null,bd=90;pts.forEach(p=>{const d=(p.x-x)**2+(p.y-y)**2;if(d<bd){bd=d;b=p}});const lb=labels.find(l=>x>=l.x0&&x<=l.x1&&Math.abs(y-l.y)<9);return {p:b,lb,x,y}}
  cv.addEventListener("pointermove",ev=>{const {p,lb,x,y}=pick(ev);hover=p;cv.style.cursor=p||lb?"pointer":"default";
    if(p){tip.hidden=false;tip.style.left=Math.min(x,W-260)+"px";tip.style.top=y+"px";tip.innerHTML=`<b>${app.lab(p.e.n)} · ${esc(p.e.t)}</b><br>${esc(p.l.name)} — ${p.f?"пишет":"в записи"} · ${esc(p.e.who)}`}
    else if(lb){tip.hidden=false;tip.style.left=x+"px";tip.style.top=y+"px";tip.innerHTML=`Переписка: <b>${esc(lb.name)}</b>`}else tip.hidden=true;draw()});
  cv.addEventListener("pointerleave",()=>{hover=null;tip.hidden=true;draw()});
  cv.addEventListener("click",ev=>{const {p,lb}=pick(ev);if(lb){app.go("msgs:"+lb.k);return}if(p)app.openUnit(p.e.n)});
  document.getElementById("chAll").onclick=()=>{all=!all;show()};
  draw();const ro=new ResizeObserver(draw);ro.observe(cv);app.cleanup().push(()=>ro.disconnect())}
(function(){const s=document.createElement("style");s.textContent=`.chlegend{display:flex;gap:16px;align-items:center;flex-wrap:wrap;font-size:12.5px;color:var(--muted);margin:0 0 10px}.chlegend span{display:inline-flex;align-items:center;gap:6px}
.chlegend i{display:inline-block;width:9px;height:9px;border-radius:50%}.chlegend i.f{background:var(--stamp)}.chlegend i.o{border:1.5px solid var(--stamp)}.chlegend i.b{width:22px;height:8px;border-radius:4px;background:var(--ink);opacity:.12}`;document.head.appendChild(s)})();
return {show};
})();

/* Смыслы: записи, предметы, двойники, музыка и посты в одном пространстве, вокруг тем документа 2. */
window.Meaning=(function(){
"use strict";
const A=()=>window.__APP;
const TYPES=[["e","Записи","#2a78d6"],["o","Предметы","#eb6834"],["c","Двойники и переписка","#1baf7a"],["m","Музыка","#e87ba4"],["p","Посты","#6250d6"]];
const TC=Object.fromEntries(TYPES.map(t=>[t[0],t[2]]));
let on=new Set(TYPES.map(t=>t[0])),focus=-1;
function load(){return new Promise(res=>{if(window.MEANING)return res();const s=document.createElement("script");s.src="data-meaning.js";s.onload=res;s.onerror=res;document.head.appendChild(s)})}
function css(){if(document.getElementById("meaningCss"))return;const s=document.createElement("style");s.id="meaningCss";s.textContent=`
.mn-tools{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 12px}
.mn-chip{all:unset;cursor:pointer;display:inline-flex;gap:6px;align-items:center;border:1px solid var(--line);border-radius:999px;padding:4px 11px;font-size:13px;background:var(--sheet)}
.mn-chip[aria-pressed=false]{opacity:.45}.mn-chip i{width:9px;height:9px;border-radius:50%;display:inline-block}
.mn-chip:focus-visible{outline:2px solid var(--stamp)}
.mn-wrap{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:16px}
.mn-box{position:relative;border:1px solid var(--line);background:var(--sheet);height:min(76vh,760px);border-radius:10px;overflow:hidden;touch-action:none}
.mn-box canvas{width:100%;height:100%;display:block;cursor:grab}
.mn-tip{position:absolute;pointer-events:none;background:var(--ink);color:var(--paper);font-size:12.5px;padding:7px 9px;border-radius:6px;max-width:280px;line-height:1.35;z-index:3}
.mn-tip small{display:block;opacity:.75;font-size:11px;margin-top:2px}
.mn-side{border:1px solid var(--line);background:var(--sheet);padding:12px 14px;max-height:min(76vh,760px);overflow:auto;font-size:14px}
.mn-side h3{margin:0 0 4px;font-family:var(--f-body);font-weight:400;font-size:20px}
.mn-side .grp{margin-top:10px}.mn-side .grp b{font-family:var(--f-mono);font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:3px}
.mn-side button.it{all:unset;cursor:pointer;display:block;padding:3px 0;color:var(--stamp);overflow-wrap:anywhere}.mn-side button.it:focus-visible{outline:2px solid var(--stamp)}
.mn-side .lk{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
@media (max-width:860px){.mn-wrap{grid-template-columns:1fr}}`;document.head.appendChild(s)}
async function show(){const app=A();app.clearView();app.setNav("meaning");css();
  app.view.innerHTML=`<p class="hint loading">Собираем карту смыслов…</p>`;await load();const D=window.MEANING;if(!D){app.view.innerHTML=`<p class="hint">Карта не загрузилась.</p>`;return}
  const esc=app.esc;
  app.view.innerHTML=`<div class="page-head"><div class="eyebrow">Смыслы · ${(D.groups||[]).length} групп · ${D.themes.length} тем · ${D.nodes.length} точек</div><h2>Карта смыслов</h2><div class="sub">Пять групп и девятнадцать тем книги. Вокруг каждой темы — то, что к ней ближе всего по тексту: записи, вещи, двойники, музыка и посты вперемешку. Линии — темы, которые делят одни и те же записи и вещи. Нажмите на тему — откроется её описание, время и содержимое.</div></div>
   <div class="mn-tools" role="group" aria-label="Что показывать">${TYPES.map(([k,t,c])=>`<button type="button" class="mn-chip" data-tp="${k}" aria-pressed="${on.has(k)}"><i style="background:${c}"></i>${t} · ${D.nodes.filter(n=>n.k===k).length}</button>`).join("")}<button type="button" class="mn-chip" id="mnReset">Весь вид</button></div>
   <div class="mn-wrap"><div class="mn-box" id="mnBox"><canvas id="mnC" aria-label="Карта смыслов: точки и темы"></canvas><div class="mn-tip" id="mnTip" hidden></div></div><aside class="mn-side" id="mnSide"></aside></div>`;
  const box=document.getElementById("mnBox"),cv=document.getElementById("mnC"),ctx=cv.getContext("2d"),tip=document.getElementById("mnTip"),side=document.getElementById("mnSide");
  let W=0,H=0,dpr=1,cam={x:0,y:0,z:1},hover=null,drag=null,raf=0,t0=performance.now();
  const ink=getComputedStyle(document.documentElement).getPropertyValue("--ink").trim()||"#14181D",muted=getComputedStyle(document.documentElement).getPropertyValue("--muted").trim()||"#5A6570";
  const P=(x,y)=>[(x*W-W/2)*cam.z+W/2+cam.x,(y*H-H/2)*cam.z+H/2+cam.y];
  const linked=j=>new Set(D.links.filter(l=>l.a===j||l.b===j).map(l=>l.a===j?l.b:l.a));
  /* раскладка: на широком экране — пять полос-групп, темы в ряд; на узком — список тем, у каждой своя горсть точек справа */
  D.themes.forEach(t=>{if(t.ox==null){t.ox=t.x;t.oy=t.y}});D.nodes.forEach(n=>{if(n.dx==null){const t=D.themes[n.th];n.dx=n.x-t.ox;n.dy=n.y-t.oy}});
  const md=Math.max(...D.nodes.map(n=>Math.hypot(n.dx,n.dy)))||1;let narrow=false;
  function layout(){narrow=box.getBoundingClientRect().width<700;const G=D.groups||[];
    box.style.touchAction=narrow?"pan-y":"none";if(!narrow){box.style.height="760px";const r=box.getBoundingClientRect();const w=r.width,h=r.height,bh=h/G.length,R=36;
      G.forEach((g,gi)=>{g.px=14;g.py=gi*bh+16;const ts=D.themes.filter(t=>t.g===gi);ts.forEach((t,k)=>{const x=24+(k+.5)*(w-48)/ts.length,y=gi*bh+bh/2+8+(ts.length>2?(k%2?20:-14):0);t.x=x/w;t.y=y/h;t._al="c"})});
      D.nodes.forEach(n=>{const t=D.themes[n.th];n.x=t.x+n.dx/md*R/w;n.y=t.y+n.dy/md*R/h})}
    else{const rows=[];G.forEach((g,gi)=>{rows.push({g,gi});D.themes.filter(t=>t.g===gi).forEach(t=>rows.push({t}))});const hh=rows.reduce((s,r)=>s+(r.t?58:34),0)+12;box.style.height=hh+"px";
      const w=box.getBoundingClientRect().width,R=24;let y=8;rows.forEach(r=>{if(r.t){r.t.y=(y+29)/hh;r.t.x=(w-R-14)/w;r.t._al="l";y+=58}else{r.g.px=12;r.g.py=y+20;y+=34}});
      D.nodes.forEach(n=>{const t=D.themes[n.th];n.x=t.x+n.dx/md*R/w;n.y=t.y+n.dy/md*R/hh})}}
  function fit(){layout();const r=box.getBoundingClientRect();dpr=Math.min(2,window.devicePixelRatio||1);W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
  function draw(){const now=performance.now(),k=Math.min(1,(now-t0)/700),ease=1-Math.pow(1-k,3);ctx.clearRect(0,0,W,H);
    const nb=focus>=0?linked(focus):null;
    const maxw=Math.max(...D.links.map(l=>l.w));
    const TOPL=new Set(D.links.slice().sort((p,q)=>q.w-p.w).slice(0,14));
    D.links.forEach(l=>{if(focus<0&&(narrow||!TOPL.has(l)))return;const a=D.themes[l.a],b=D.themes[l.b];const act=focus<0||l.a===focus||l.b===focus;const [x1,y1]=P(a.x,a.y),[x2,y2]=P(b.x,b.y);
      const bend=narrow?Math.min(W*.45,Math.abs(y2-y1)*.5):Math.abs(x2-x1)*.12+30;const mx=narrow?(x1+x2)/2-bend:(x1+x2)/2,my=narrow?(y1+y2)/2:Math.min(y1,y2)-bend;ctx.beginPath();ctx.moveTo(x1,y1);ctx.quadraticCurveTo(mx,my,x2,y2);
      ctx.strokeStyle=act?`rgba(120,130,150,${.18+.5*l.w/maxw})`:"rgba(120,130,150,.05)";ctx.lineWidth=(1+3*l.w/maxw)*(act?1:.6);ctx.stroke()});
    D.nodes.forEach(n=>{if(!on.has(n.k))return;const [x,y]=P(.5+(n.x-.5)*ease,.5+(n.y-.5)*ease);const act=focus<0||n.th===focus||n.th2===focus;
      ctx.globalAlpha=act?(n===hover?1:.85):.08;ctx.beginPath();ctx.arc(x,y,(n.k==="e"?3.6:n.k==="c"?5:2.8)*(n===hover?1.6:1),0,7);ctx.fillStyle=TC[n.k];ctx.fill();
      if(n===hover){ctx.lineWidth=2;ctx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue("--sheet").trim()||"#fff";ctx.stroke()}});
    ctx.globalAlpha=1;
    (D.groups||[]).forEach((g,gi)=>{const [x,y]=P(g.px/W,g.py/H);const act=focus<0||D.themes[focus].g===gi;ctx.globalAlpha=act?.9:.3;ctx.font="600 12px JetBrains Mono, ui-monospace, monospace";ctx.fillStyle=muted;ctx.textAlign="left";ctx.textBaseline="middle";ctx.fillText(g.name.toUpperCase(),x,y)});
    ctx.globalAlpha=1;
    D.themes.forEach((t,j)=>{const [x,y]=P(t.x,t.y);const act=focus<0||j===focus||(nb&&nb.has(j));ctx.font=`${j===focus?"600 ":"500 "}13px Golos Text, system-ui, sans-serif`;
      const w=ctx.measureText(t.name).width+16;ctx.globalAlpha=act?1:.3;ctx.fillStyle=j===focus?ink:"rgba(255,255,255,.92)";ctx.strokeStyle="rgba(20,24,29,.25)";ctx.lineWidth=1;
      const lx=t._al==="l"?12+w/2:Math.max(w/2+6,Math.min(W-w/2-6,x));ctx.beginPath();ctx.roundRect(lx-w/2,y-12,w,24,12);ctx.fill();ctx.stroke();ctx.fillStyle=j===focus?"#fff":ink;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(t.name,lx,y+.5);t._r=[lx-w/2,y-12,w,24]});
    ctx.globalAlpha=1;if(k<1)raf=requestAnimationFrame(draw)}
  function pick(mx,my){for(let j=D.themes.length-1;j>=0;j--){const r=D.themes[j]._r;if(r&&mx>=r[0]&&mx<=r[0]+r[2]&&my>=r[1]&&my<=r[1]+r[3])return {t:j}}
    let best=null,bd=144;D.nodes.forEach(n=>{if(!on.has(n.k))return;if(focus>=0&&n.th!==focus&&n.th2!==focus)return;const [x,y]=P(n.x,n.y);const d=(x-mx)**2+(y-my)**2;if(d<bd){bd=d;best=n}});return best?{n:best}:null}
  function openN(n){if(n.k==="o")app.showObj(n.id);else if(n.k==="c")app.go("msgs:"+n.id);else app.openUnit(n.id)}
  const spark=tl=>{const m=Math.max(1,...tl);return `<svg viewBox="0 0 180 34" style="width:100%;height:34px" role="img" aria-label="Записи темы по месяцам">${tl.map((v,i)=>`<rect x="${i*10}" y="${30-26*v/m}" width="8" height="${Math.max(1,26*v/m)}" rx="2" fill="#2a78d6" opacity="${v?1:.15}"><title>${esc(BL[i])}: ${v}</title></rect>`).join("")}<line x1="0" x2="180" y1="31" y2="31" stroke="var(--line)"/></svg><div style="display:flex;justify-content:space-between;font-family:var(--f-mono);font-size:9.5px;color:var(--muted)"><span>март 2027</span><span>май 2028</span></div>`};
  const BL=(window.BOOKDATA.stats&&window.BOOKDATA.stats.blocks)||[];
  function sideHTML(){if(focus<0)return `<h3>Пять групп, девятнадцать тем</h3><p class="hint">Нажмите на тему на карте или в списке.</p>${(D.groups||[]).map((g,gi)=>`<div class="grp"><b>${esc(g.name)}</b><div class="lk">${D.themes.map((t,j)=>[t,j]).filter(([t])=>t.g===gi).map(([t,j])=>`<button type="button" class="mn-chip" data-th="${j}">${esc(t.name)} · ${t.n}</button>`).join("")}</div></div>`).join("")}`;
    const t=D.themes[focus],ns=D.nodes.filter(n=>n.th===focus).sort((a,b)=>b.sc-a.sc);const nb=[...linked(focus)];
    return `<button type="button" class="mn-chip" data-th="-1">← все темы</button><div class="eyebrow" style="margin-top:12px">${esc((D.groups||[])[t.g]?D.groups[t.g].name:"")}</div><h3>${esc(t.name)}</h3>${t.d?`<p style="font-size:13.5px;line-height:1.5">${esc(t.d)}</p><p class="hint" style="margin-top:-4px">Из документа 2 «Темы и сквозные линии».</p>`:""}
     <div class="grp"><b>Записи по месяцам</b>${spark(t.tl||[])}</div><p class="hint">${ns.length} точек. Соседние темы — по общим записям и вещам:</p>
     <div class="lk">${nb.map(j=>`<button type="button" class="mn-chip" data-th="${j}">${esc(D.themes[j].name)}</button>`).join("")}</div>
     ${TYPES.map(([k,lab])=>{const L=ns.filter(n=>n.k===k).slice(0,12);return L.length?`<div class="grp"><b>${lab}</b>${L.map(n=>`<button type="button" class="it" data-ni="${D.nodes.indexOf(n)}">${esc(n.t)}</button>`).join("")}</div>`:""}).join("")}`}
  function wireSide(){side.innerHTML=sideHTML();side.querySelectorAll("[data-th]").forEach(b=>b.onclick=()=>{focus=+b.dataset.th;wireSide();draw()});side.querySelectorAll("[data-ni]").forEach(b=>b.onclick=()=>openN(D.nodes[+b.dataset.ni]))}
  cv.addEventListener("pointermove",ev=>{const r=cv.getBoundingClientRect(),mx=ev.clientX-r.left,my=ev.clientY-r.top;
    if(drag){cam.x=drag.cx+ev.clientX-drag.x;cam.y=drag.cy+ev.clientY-drag.y;drag.moved=true;draw();return}
    const p=pick(mx,my);hover=p&&p.n||null;cv.style.cursor=p?"pointer":"grab";
    if(p&&p.n){const n=p.n;tip.hidden=false;tip.innerHTML=`${esc(n.t)}<small>${esc(n.s)} · ${esc(D.themes[n.th].name)} / ${esc(D.themes[n.th2].name)}</small>`;tip.style.left=Math.min(mx+14,W-290)+"px";tip.style.top=Math.max(4,my-10)+"px"}else tip.hidden=true;draw()});
  cv.addEventListener("pointerleave",()=>{hover=null;tip.hidden=true;draw()});
  cv.addEventListener("pointerdown",ev=>{drag={x:ev.clientX,y:ev.clientY,cx:cam.x,cy:cam.y,moved:false};cv.setPointerCapture(ev.pointerId)});
  cv.addEventListener("pointerup",ev=>{const d=drag;drag=null;if(d&&d.moved)return;const r=cv.getBoundingClientRect();const p=pick(ev.clientX-r.left,ev.clientY-r.top);
    if(p&&p.t!=null){focus=focus===p.t?-1:p.t;wireSide();draw()}else if(p&&p.n)openN(p.n)});
  cv.addEventListener("wheel",ev=>{ev.preventDefault();const r=cv.getBoundingClientRect(),mx=ev.clientX-r.left-W/2-cam.x,my=ev.clientY-r.top-H/2-cam.y;const f=Math.exp(-ev.deltaY*.0015);const z=Math.max(.7,Math.min(5,cam.z*f));const k=z/cam.z;cam.x-=mx*(k-1);cam.y-=my*(k-1);cam.z=z;draw()},{passive:false});
  app.view.querySelectorAll("[data-tp]").forEach(b=>b.onclick=()=>{const k=b.dataset.tp;on.has(k)?on.delete(k):on.add(k);b.setAttribute("aria-pressed",on.has(k));draw()});
  document.getElementById("mnReset").onclick=()=>{cam={x:0,y:0,z:1};focus=-1;wireSide();draw()};
  fit();wireSide();raf=requestAnimationFrame(draw);const ro=new ResizeObserver(()=>{fit();draw()});ro.observe(box);
  const cl=app.cleanup();cl.push(()=>{cancelAnimationFrame(raf);ro.disconnect()})}
return {show};
})();

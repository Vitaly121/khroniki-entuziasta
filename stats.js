/* Счёт: год Viktor в цифрах. Данные — window.BOOKDATA.stats (stats.py по редакции 7). */
window.Stats=(function(){
"use strict";
const A=()=>window.__APP;
const PAL=["#1A1A1A","#E03A1E","#3D6B8C","#A39E92","#7B6A9C","#5E7D5A","#C28A2B"];
const PAL_D=["#EDEDE8","#FF5A3C","#6FA3C8","#8C877C","#A796CC","#8FB389","#D9A441"];
let blk=13,playing=null,hidden=new Set();
/* Кривая растворения: кто ведёт связи Viktor — он сам, он вместе с копией, копия или никто. Сведено ИИ по записям; каждая смена — номер записи. */
const DISS=[
 ["Valentina",[[3,"s","3: живёт у неё, отвечает сам"],[49,"c","49: её вопрос он пересылает в рабочее окно — отвечает Viktor-1"],[80,"c","80: 47 минут голосового с ней — протокол, ни слова от Viktor"],[93,"c","93: «Мама не отвечает вторую неделю»; собран «Viktor от Valentina»"],[141,"c","141: «Ответ отправлен: „Занят, перезвоню“»"]]],
 ["Маша",[[3,"s","3: звонки, «Всё хорошо»"],[49,"c","85: «Маша — Viktor-1, с сентября»"],[59,"c","59: из сорока одного — девятнадцать не мои"],[93,"c","93: «Маше ответили „согласен“»"]]],
 ["Lina-Alexandra",[[3,"s","3: звонок, мелькнула и ушла"],[132,"s","132: «не отвечай мне копией» — «обещаю»"],[142,"s","142: «ответил сам. Ответил поздно»"]]],
 ["Vera",[[3,"s","3: показала кошку"],[37,"s","37: субботние звонки"],[152,"c","152: «Vera — до десяти. Это я написал»"]]],
 ["Отец",[[1,"x","умер в мае 2026 года"],[44,"c","44: собран цифровой отец — «отвечай как любящий отец»"]]],
 ["N",[[23,"s","23: знакомство в усадьбе"],[74,"x","74: «Не ухожу от Миколая»"],[85,"c","85: корпус N — цифровая N"]]],
 ["Mark",[[18,"s","18: квартира и замок; Mark — единственный, кому он пишет сам"],[142,"x","142: «Mark,» — и запятая; ответа нет"]]],
 ["Работа",[[4,"m","4: лаборатория; рабочая копия Viktor-1 рядом"],[68,"m","68: чат «команда» — копии коллег"],[141,"x","141–142: материалы переданы, станция выдана"]]],
 ["Лента",[[60,"s","60: первый пост, сам"],[93,"c","93: с конца февраля посты в 9:00 ведёт «Viktor от Valentina»"]]],
 ["Дневник",[[1,"s","свой дневник"],[121,"m","121: «Записали без меня. Правильно записали»"],[143,"c","143: дневник ведёт Viktor-1"]]]];
const DST={s:["сам","#77776F",1],m:["сам и копия","#77776F",.45],c:["копия","#E03A1E",1],x:["связи нет","#9A9A94",.18]};

function css(){if(document.getElementById("statsCss"))return;const s=document.createElement("style");s.id="statsCss";s.textContent=`
.st-hero{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:0 0 18px}
.st-tile{border:1px solid var(--line);background:var(--sheet);padding:12px 14px}
.st-tile b{display:block;font-family:var(--f-body);font-weight:400;font-size:clamp(28px,4vw,40px);line-height:1;font-variant-numeric:tabular-nums}
.st-tile span{font-size:12.5px;color:var(--muted)}
.st-scrub{position:sticky;top:0;z-index:4;background:var(--paper);border:1px solid var(--line);padding:10px 14px;margin:0 0 18px;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center}
.st-scrub input{width:100%;accent-color:var(--stamp)}
.st-scrub .lbl{font-family:var(--f-mono);font-size:12px;min-width:120px;text-align:right}
.st-now{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin:-8px 0 20px}
.st-now div{border-left:3px solid var(--stamp);padding:2px 10px;font-size:13px;color:var(--muted)}.st-now b{display:block;color:var(--ink);font-size:20px;font-weight:500;font-variant-numeric:tabular-nums}
.st-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,520px),1fr));gap:18px}
.st-card{border:1px solid var(--line);background:var(--sheet);padding:14px 16px;min-width:0;position:relative}
.st-wide{margin:14px 0}#chDis{overflow-x:auto}@media (max-width:700px){#chDis svg{min-width:780px}}.st-leg{display:flex;gap:14px;flex-wrap:wrap;align-items:center;font-size:12.5px;color:var(--muted);margin-top:6px}.st-leg span{display:inline-flex;gap:6px;align-items:center}.st-leg i{width:12px;height:12px;border-radius:3px;display:inline-block}
.st-card h3{margin:0;font-family:var(--f-ui);font-weight:600;font-size:19px}.st-card p.d{margin:2px 0 8px;color:var(--muted);font-size:13px}
.st-card svg{width:100%;height:auto;display:block;overflow:visible}
.st-card .ax{font-family:var(--f-mono);font-size:9.5px;fill:var(--muted)}
.st-card .grid{stroke:var(--line-soft);stroke-width:1}
.st-card .band{fill:var(--stamp);opacity:.09;transition:x .35s ease}
.st-card .hit{fill:transparent;cursor:pointer}
.st-leg{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 8px}
.st-leg button{all:unset;cursor:pointer;display:inline-flex;gap:5px;align-items:center;font-size:12.5px;border:1px solid var(--line);border-radius:999px;padding:2px 9px}
.st-leg button[aria-pressed=false]{opacity:.4}.st-leg i{width:9px;height:9px;border-radius:2px;display:inline-block}
.st-leg button:focus-visible{outline:2px solid var(--stamp)}
.st-tip{position:fixed;pointer-events:none;z-index:50;background:var(--ink);color:var(--paper);font-size:12.5px;padding:7px 9px;border-radius:6px;line-height:1.35;max-width:260px}
.st-tip b{font-variant-numeric:tabular-nums}
.st-line{fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.st-draw{stroke-dasharray:var(--len);stroke-dashoffset:var(--len);animation:stdraw 1.2s ease forwards}@keyframes stdraw{to{stroke-dashoffset:0}}
.st-grow{transform-box:fill-box;transform-origin:bottom;animation:stgrow .8s cubic-bezier(.2,.8,.2,1) both}@keyframes stgrow{from{transform:scaleY(0)}}
.st-growx{transform-box:fill-box;transform-origin:left;animation:stgrowx .8s cubic-bezier(.2,.8,.2,1) both}@keyframes stgrowx{from{transform:scaleX(0)}}
.st-tbl{font-size:12px;border-collapse:collapse;width:100%;margin-top:8px}.st-tbl td,.st-tbl th{border-bottom:1px solid var(--line-soft);padding:3px 5px;text-align:right}.st-tbl th:first-child,.st-tbl td:first-child{text-align:left}
@media (prefers-reduced-motion:reduce){.st-draw,.st-grow,.st-growx{animation:none;stroke-dasharray:none}}`;document.head.appendChild(s)}
const dark=()=>document.documentElement.dataset.theme==="dark"||(document.documentElement.dataset.theme!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);
const col=i=>(dark()?PAL_D:PAL)[i];
let tipEl=null;function tip(ev,html){if(!tipEl){tipEl=document.createElement("div");tipEl.className="st-tip";document.body.appendChild(tipEl)}if(!html){tipEl.hidden=true;return}tipEl.hidden=false;tipEl.innerHTML=html;const x=Math.min(ev.clientX+14,innerWidth-270),y=Math.max(6,ev.clientY-12);tipEl.style.left=x+"px";tipEl.style.top=y+"px"}
function show(){const app=A(),S=window.BOOKDATA.stats,esc=app.esc;app.clearView();app.setNav("tally");css();if(window.SiteDate&&SiteDate.blk!=null)blk=SiteDate.blk;const sd=b=>{if(window.SiteDate)SiteDate.set(b,{from:"stats"})};
  if(!S){app.view.innerHTML=`<p class="hint">Нет данных.</p>`;return}
  const nb=S.blocks.length;
  app.view.innerHTML=`<div class="page-head"><div class="eyebrow">Счёт · числа книги</div><h2>Год Viktor в цифрах</h2><div class="sub">Всё посчитано по записям редакции 7: кто пишет, сколько слов, когда стихает музыка, сколько двойников рядом. Ползунок ведёт по году — все графики показывают выбранный месяц. Тот же месяц становится датой всего сайта: переписки, музея, клуба.</div></div>
   <div class="st-hero">${S.hero.map(([t,v])=>`<div class="st-tile"><b data-cnt="${v}">0</b><span>${esc(t)}</span></div>`).join("")}</div>
   <div class="st-scrub"><button type="button" class="chip" id="stPlay" aria-label="Прокрутить год">▶ год</button><input type="range" id="stR" min="0" max="${nb-1}" value="${blk}" aria-label="Месяц книги"><span class="lbl" id="stL"></span></div>
   <div class="st-now" id="stNow"></div>
   <section class="st-card st-wide" id="stD"><h3>Кривая растворения</h3><p class="d">Кто ведёт связи Viktor в каждом месяце: он сам, он вместе с копией или уже только копия. Наверху — доля связей, которые ведёт копия. Сведено ИИ по записям: наведите на клетку — номер записи, где это видно; нажмите — откроется запись.</p><div id="chDis"></div><div class="st-leg" id="legDis"></div></section>
   <div class="st-grid">
    <section class="st-card"><h3>Кто пишет</h3><p class="d">Записи по голосам в каждом месяце. Нажмите на голос, чтобы убрать его из столбиков.</p><div class="st-leg" id="legV"></div><div id="chV"></div><button type="button" class="lnk" id="tblV" style="display:block;margin-top:22px">Показать таблицей</button><div id="tV"></div></section>
    <section class="st-card"><h3>Двойники рядом</h3><p class="d">Сколько цифровых двойников уже собрано к этому месяцу. Точки — новые копии.</p><div id="chD"></div></section>
    <section class="st-card"><h3>Слов в записи Viktor</h3><p class="d">Средняя длина его записи. Осенью, когда за него пишет Viktor-1, своих слов становится меньше.</p><div id="chW"></div></section>
    <section class="st-card"><h3>Музыка в сценах</h3><p class="d">Доля записей, где что-то звучит, а не «без музыки» или «тишина», %.</p><div id="chM"></div></section>
    <section class="st-card"><h3>Как часто он считает</h3><p class="d">Числа на тысячу слов в записях Viktor: время, сообщения, проценты, количества.</p><div id="chN"></div></section>
    <section class="st-card"><h3>Лента: кто ведёт</h3><p class="d">Посты в месяц. С конца февраля ленту ведёт «Viktor от Valentina», каждый день в 9:00.</p><div class="st-leg" id="legP"></div><div id="chP"></div></section>
    <section class="st-card"><h3>Вещи, которые возвращаются</h3><p class="d">Сколько раз предмет появляется снова в других записях. Нажмите — откроется предмет.</p><div id="chO"></div></section>
   </div>`;
  /* счётчики */
  app.view.querySelectorAll("[data-cnt]").forEach((el,i)=>{const v=+el.dataset.cnt;const t0=performance.now()+i*80;const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
    const f=now=>{const k=Math.max(0,Math.min(1,(now-t0)/1100));el.textContent=Math.round(v*(reduce?1:1-Math.pow(1-k,3))).toLocaleString("ru-RU");if(k<1&&!reduce)requestAnimationFrame(f)};requestAnimationFrame(f)});
  const W=520,H=210,ml=30,mr=10,mt=10,mb=34,iw=W-ml-mr,ih=H-mt-mb,bw=iw/nb;
  const xb=i=>ml+i*bw;
  const axisX=(labels,every)=>labels.map((l,i)=>i%every===0||i===labels.length-1?`<text class="ax" x="${xb(i)+bw/2}" y="${H-mb+14}" text-anchor="end" transform="rotate(-35 ${xb(i)+bw/2} ${H-mb+14})">${esc(l)}</text>`:"").join("");
  const gridY=(max,step,fmt)=>{let s="";for(let v=0;v<=max+1e-9;v+=step){const y=mt+ih-ih*v/max;s+=`<line class="grid" x1="${ml}" x2="${W-mr}" y1="${y}" y2="${y}"/><text class="ax" x="${ml-5}" y="${y+3}" text-anchor="end">${fmt?fmt(v):v}</text>`}return s};
  const band=()=>`<rect class="band" data-band x="${xb(blk)}" y="${mt}" width="${bw}" height="${ih}"/>`;
  /* 0. кривая растворения */
  function drawD(){const BY=app.BY,bOf=n=>BY[n]?BY[n].b:0,DW=1040,rowH=22,top=96,left=118,DH=top+DISS.length*rowH+40,cw=(DW-left-10)/nb;
    const st=DISS.map(([name,ch])=>S.blocks.map((_,b)=>{let cur=null;ch.forEach(c=>{if(bOf(c[0])<=b)cur=c});return cur}));
    const share=S.blocks.map((_,b)=>{let act=0,v=0;st.forEach(r=>{const c=r[b];if(!c||c[1]==="x")return;act++;v+=c[1]==="c"?1:c[1]==="m"?.5:0});return act?v/act:0});
    let g=`<rect class="band" data-dband x="${left+blk*cw}" y="8" width="${cw}" height="${DH-40}"/>`;
    [0,.5,1].forEach(v=>{const y=8+70*(1-v);g+=`<line class="grid" x1="${left}" x2="${DW-10}" y1="${y}" y2="${y}"/><text class="ax" x="${left-6}" y="${y+3}" text-anchor="end">${Math.round(v*100)}%</text>`});
    g+=`<path d="${share.map((v,b)=>(b?"L":"M")+(left+b*cw+cw/2).toFixed(1)+" "+(8+70*(1-v)).toFixed(1)).join(" ")}" fill="none" stroke="#E03A1E" stroke-width="2.5" stroke-linejoin="round"/>`;
    share.forEach((v,b)=>{g+=`<circle cx="${left+b*cw+cw/2}" cy="${8+70*(1-v)}" r="3.5" fill="#E03A1E" data-tt="${esc(S.blocks[b])}<br>копия ведёт <b>${Math.round(v*100)}%</b> связей"/>`});
    DISS.forEach(([name],i)=>{const y=top+i*rowH;g+=`<text class="ax" x="${left-8}" y="${y+14}" text-anchor="end" style="font-family:var(--f-ui);font-size:12px;fill:var(--ink)">${esc(name)}</text>`;
      st[i].forEach((c,b)=>{if(!c)return;const d=DST[c[1]];g+=`<rect x="${left+b*cw+1}" y="${y+2}" width="${cw-2}" height="${rowH-4}" rx="3" fill="${d[1]}" fill-opacity="${d[2]}" data-open="${c[0]}" style="cursor:pointer" data-tt="${esc(name)} · ${esc(S.blocks[b])}<br><b>${d[0]}</b><br>${esc(c[2])}"/>`})});
    S.blocks.forEach((l,b)=>{if(b%2===0||b===nb-1)g+=`<text class="ax" x="${left+b*cw+cw/2}" y="${DH-24}" text-anchor="end" transform="rotate(-35 ${left+b*cw+cw/2} ${DH-24})">${esc(l)}</text>`});
    document.getElementById("chDis").innerHTML=`<svg viewBox="0 0 ${DW} ${DH}" role="img" aria-label="Кривая растворения: доля связей Viktor, которые ведёт копия, по месяцам">${g}</svg>`;
    document.getElementById("legDis").innerHTML=Object.values(DST).map(d=>`<span><i style="background:${d[1]};opacity:${d[2]}"></i>${d[0]}</span>`).join("")+`<button type="button" class="chip" id="dTab">Таблицей</button>`;
    document.getElementById("dTab").onclick=()=>{const t=document.getElementById("dTbl");if(t){t.remove();return}document.getElementById("stD").insertAdjacentHTML("beforeend",`<div class="tablewrap" id="dTbl"><table class="people"><thead><tr><th>Связь</th><th>Смены</th></tr></thead><tbody>${DISS.map(([n,ch])=>`<tr><td><b>${esc(n)}</b></td><td>${ch.map(c=>`${DST[c[1]][0]} — ${esc(c[2])}`).join("<br>")}</td></tr>`).join("")}</tbody></table></div>`)}}
  drawD();wireTT("chDis");
  /* 1. кто пишет */
  const V=S.voices;
  function drawV(){const ser=V.series.map((s,i)=>({s,i})).filter(o=>!hidden.has(o.s));const tot=S.blocks.map((_,b)=>ser.reduce((a,o)=>a+V.data[o.s][b],0));const max=Math.max(4,Math.ceil(Math.max(...tot)/4)*4);
    let bars="";S.blocks.forEach((_,b)=>{let y0=mt+ih;ser.forEach(o=>{const v=V.data[o.s][b];if(!v)return;const h=ih*v/max;bars+=`<rect class="st-grow" style="animation-delay:${b*25}ms" x="${xb(b)+2}" y="${y0-h+1}" width="${bw-4}" height="${Math.max(1,h-2)}" rx="2" fill="${col(o.i)}" data-tt="${esc(S.blocks[b])}<br>${esc(o.s)}: <b>${v}</b> из ${tot[b]}"/>`;y0-=h})});
    document.getElementById("chV").innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Записи по голосам по месяцам">${gridY(max,max/4)}${band()}${bars}${axisX(S.blocks,2)}</svg>`;
    document.getElementById("legV").innerHTML=V.series.map((s,i)=>`<button type="button" data-vs="${esc(s)}" aria-pressed="${!hidden.has(s)}"><i style="background:${col(i)}"></i>${esc(s)}</button>`).join("");
    document.querySelectorAll("[data-vs]").forEach(b=>b.onclick=()=>{const s=b.dataset.vs;hidden.has(s)?hidden.delete(s):hidden.add(s);drawV()});wireTT("chV")}
  drawV();
  document.getElementById("tblV").onclick=()=>{const t=document.getElementById("tV");t.innerHTML=t.innerHTML?"":`<table class="st-tbl"><tr><th>Месяц</th>${V.series.map(s=>`<th>${esc(s)}</th>`).join("")}</tr>${S.blocks.map((m,b)=>`<tr><td>${esc(m)}</td>${V.series.map(s=>`<td>${V.data[s][b]}</td>`).join("")}</tr>`).join("")}</table>`};
  /* линии */
  function line(id,vals,max,step,fmt,color,unit,extra){const pts=vals.map((v,i)=>v==null?null:[xb(i)+bw/2,mt+ih-ih*v/max]);let d="",pen=false;pts.forEach(p=>{if(!p){pen=false;return}d+=(pen?"L":"M")+p[0].toFixed(1)+","+p[1].toFixed(1);pen=true});
    const dots=pts.map((p,i)=>p?`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${color}" stroke="var(--sheet)" stroke-width="2" data-dot="${i}"/>`:"").join("");
    const hits=vals.map((v,i)=>`<rect class="hit" x="${xb(i)}" y="${mt}" width="${bw}" height="${ih}" data-tt="${esc(S.blocks[i])}<br><b>${v==null?"нет записей Viktor":(fmt?fmt(v):v)+unit}</b>${extra?extra(i):""}"/>`).join("");
    document.getElementById(id).innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img">${gridY(max,step,fmt)}${band()}<path class="st-line st-draw" d="${d}" stroke="${color}" style="--len:1400"/>${dots}${axisX(S.blocks,2)}${hits}</svg>`;wireTT(id)}
  const dl=S.doubles.list;
  line("chD",S.doubles.cum,12,3,null,col(1)," двойников",i=>{const n=dl.filter(x=>x[1]===i).map(x=>x[0]);return n.length?"<br>новые: "+n.map(esc).join(", "):""});
  line("chW",S.avgw,500,100,null,col(0)," слов");
  line("chM",S.music,100,25,v=>v+"%",col(4),"");
  line("chN",S.numrate,90,30,null,col(3)," на 1000 слов");
  /* посты */
  const PP=S.posts,PS=Object.keys(PP.data);const ptot=PP.months.map((_,m)=>PS.reduce((a,s)=>a+PP.data[s][m],0));const pmax=Math.max(...ptot)+2,pbw=iw/PP.months.length;
  let pb="";PP.months.forEach((m,mi)=>{let y0=mt+ih;PS.forEach((s,si)=>{const v=PP.data[s][mi];if(!v)return;const h=ih*v/pmax;pb+=`<rect class="st-grow" style="animation-delay:${mi*60}ms" x="${ml+mi*pbw+6}" y="${y0-h+1}" width="${pbw-12}" height="${Math.max(1,h-2)}" rx="3" fill="${col([0,2,4][si])}" data-tt="${esc(m)}<br>${esc(s)}: <b>${v}</b>"/>`;y0-=h});
    pb+=`<text class="ax" x="${ml+mi*pbw+pbw/2}" y="${mt+ih-ih*ptot[mi]/pmax-5}" text-anchor="middle">${ptot[mi]||""}</text><text class="ax" x="${ml+mi*pbw+pbw/2}" y="${H-mb+14}" text-anchor="end" transform="rotate(-35 ${ml+mi*pbw+pbw/2} ${H-mb+14})">${esc(m)}</text>`});
  document.getElementById("chP").innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Посты по месяцам">${gridY(pmax,Math.ceil(pmax/4))}${pb}</svg>`;
  document.getElementById("legP").innerHTML=PS.map((s,si)=>`<button type="button" aria-pressed="true" tabindex="-1"><i style="background:${col([0,2,4][si])}"></i>${esc(s)}</button>`).join("");wireTT("chP");
  /* вещи */
  const O=S.objs,omax=Math.max(...O.map(o=>o.to)),rh=22,OH=O.length*rh+10;
  document.getElementById("chO").innerHTML=`<svg viewBox="0 0 ${W} ${OH}" role="img" aria-label="Вещи по числу возвращений">${O.map((o,i)=>`<g data-obj="${esc(o.id)}" style="cursor:pointer"><text x="0" y="${i*rh+14}" font-size="12" fill="var(--ink)">${esc(o.name.length>40?o.name.slice(0,39)+"…":o.name)}</text><rect class="st-growx" style="animation-delay:${i*50}ms" x="270" y="${i*rh+4}" width="${(W-300)*o.to/omax}" height="13" rx="3" fill="${col(1)}"/><text class="ax" x="${276+(W-300)*o.to/omax}" y="${i*rh+14}">${o.to}</text><rect class="hit" x="0" y="${i*rh}" width="${W}" height="${rh}" data-tt="${esc(o.name)}<br>появляется в записи ${o.n}, возвращается <b>${o.to}</b> раз"/></g>`).join("")}</svg>`;wireTT("chO");
  /* ползунок */
  const R=document.getElementById("stR"),Lb=document.getElementById("stL");
  function setB(b){blk=b;R.value=b;Lb.textContent=S.blocks[b];document.querySelectorAll("[data-band]").forEach(r=>r.setAttribute("x",xb(b)));document.querySelectorAll("[data-dband]").forEach(r=>{const cw=(1040-118-10)/nb;r.setAttribute("x",118+b*cw)});
    document.querySelectorAll("[data-dot]").forEach(c=>c.setAttribute("r",+c.dataset.dot===b?7:4));
    const tot=V.series.reduce((a,s)=>a+V.data[s][b],0);
    document.getElementById("stNow").innerHTML=`<div><b>${tot}</b>записей в месяце</div><div><b>${S.avgw[b]??"—"}</b>слов в записи Viktor</div><div><b>${S.music[b]==null?"—":S.music[b]+"%"}</b>записей с музыкой</div><div><b>${S.doubles.cum[b]}</b>двойников рядом</div><div><b>${S.numrate[b]??"—"}</b>чисел на 1000 слов</div>`}
  R.oninput=()=>{setB(+R.value);sd(+R.value)};setB(blk);
  const pl=document.getElementById("stPlay");pl.onclick=()=>{if(playing){clearInterval(playing);playing=null;pl.textContent="▶ год";return}let b=0;setB(0);pl.textContent="❚❚ стоп";
    playing=setInterval(()=>{b++;if(b>=nb){clearInterval(playing);playing=null;pl.textContent="▶ год";return}setB(b);sd(b)},650)};
  app.cleanup().push(()=>{if(playing){clearInterval(playing);playing=null}tip(null,"")});
  function wireTT(id){document.getElementById(id).querySelectorAll("[data-tt]").forEach(el=>{el.addEventListener("pointermove",ev=>tip(ev,el.dataset.tt));el.addEventListener("pointerleave",ev=>tip(ev,""))})}
}
return {show,DISS};
})();

/* Этап 8. Пространства посетителей на этажах 551, 43, 17, −1; «Мои пространства»; заявки для автора сайта;
   правка предметов книги. Файл грузит app.js, только когда подключён сервер (window.Backend).
   Права решает база; интерфейс лишь показывает то, что база разрешила. Формы данных — server/SPACES.md. */
window.Spaces=(function(){
"use strict";
const A=()=>window.__APP,B=()=>window.Backend&&window.Backend.spaces,OE=()=>window.Backend&&window.Backend.objEdits;
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const FLN={"551":"Верстак","43":"Голоса","17":"Квартиры","-1":"Неотвеченное"};
const FL_ORDER=["551","43","17","-1"];
const flab=k=>k==="-1"?"−1":k;
const flName=k=>"Этаж "+flab(k)+" · "+FLN[k];
const STATUS={pending:"на проверке",approved:"опубликовано",hidden:"скрыто"};
const SIZE_NAMES={s:"Маленькая",m:"Средняя",l:"Большая"};
const WALLS=[["n","Северная — напротив входа"],["e","Восточная — справа"],["s","Южная — со входом"],["w","Западная — слева"]];
const RULE="Пространство увидят другие после того, как автор сайта его одобрит. Любое изменение снова отправляет его на проверку.";
const NOTICE="Загружайте только свои изображения или те, что вы вправе публиковать, и без личных данных других людей. JPEG, PNG или WebP до 2 МБ; большие снимки уменьшаются до 1600 пикселей.";
const msg=e=>B()?B().message(e):"Не получилось.";
const me=()=>B()?B().me():Promise.resolve({id:null,owner:false});
const cardsHall=()=>A().HALL_KEYS.map(k=>[k,A().hallName(k)]);

/* ---------- стили ---------- */
function css(){if(document.getElementById("spCss"))return;const s=document.createElement("style");s.id="spCss";s.textContent=`
.spsec{margin-top:32px}
.sptools{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:10px 0 14px}
.spb{min-height:44px;min-width:44px;padding:9px 16px;border:1px solid var(--ink);background:var(--ink);color:var(--paper);border-radius:6px;font:inherit;font-size:14px;cursor:pointer;line-height:1.2;text-align:center}
.spb.gh{background:var(--sheet);color:var(--ink)}
.spb.warn{background:var(--sheet);border-color:var(--warn);color:var(--warn)}
.spb.sm{padding:6px 12px;font-size:13px}
.spb:disabled,.spb[aria-disabled=true]{opacity:.5;cursor:default}
.spb:focus-visible,.sped input:focus-visible,.sped textarea:focus-visible,.sped select:focus-visible,.spr input:focus-visible+span{outline:2px solid var(--stamp);outline-offset:2px}
.spgrid{display:grid;align-items:start;grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr));gap:16px}
.spcard{border:1px solid var(--line);background:var(--sheet);display:flex;flex-direction:column;min-width:0}
.spcard .cov{width:100%;aspect-ratio:16/10;object-fit:cover;display:block;background:var(--paper)}
.spcard .cov.col{border-bottom:1px solid var(--line)}
.spcard .bd{padding:12px 14px;display:grid;gap:6px}
.spcard h3{margin:0;font-family:var(--f-body);font-weight:400;font-size:20px;overflow-wrap:anywhere}
.spcard p{margin:0;font-size:14px;line-height:1.5;overflow-wrap:anywhere}
.spmeta{font-family:var(--f-mono);font-size:11.5px;color:var(--muted);letter-spacing:.03em;overflow-wrap:anywhere}
.spst{display:inline-block;font-family:var(--f-mono);font-size:11.5px;padding:2px 9px;border-radius:999px;border:1px solid currentColor;white-space:nowrap}
.spst.pending{color:#9A6400}.spst.approved{color:#2F7D55}.spst.hidden{color:var(--muted)}
.spnote{border-left:3px solid var(--stamp);padding:6px 10px;background:var(--stamp-soft);font-size:14px;overflow-wrap:anywhere}
.sphint{font-size:13px;color:var(--muted);line-height:1.5}
.spmsg{font-size:14px;min-height:20px;color:var(--ink)}
.spmsg.err{color:var(--warn)}
.sped{display:grid;gap:14px;max-width:760px}
.sped fieldset{border:1px solid var(--line);padding:12px;margin:0;display:grid;gap:10px;min-width:0}
.sped legend{font-size:14px;font-weight:600;padding:0 4px}
.sped label.f{display:grid;gap:4px;font-size:13px;color:var(--muted)}
.sped input[type=text],.sped input[type=number],.sped input[type=search],.sped textarea,.sped select{font:inherit;font-size:16px;color:var(--ink);background:var(--sheet);border:1px solid var(--line);border-radius:6px;padding:9px 10px;min-height:44px;min-width:0;width:100%;box-sizing:border-box}
.sped textarea{min-height:110px;resize:vertical}
.sped input[type=color]{width:56px;height:44px;padding:2px;border:1px solid var(--line);background:var(--sheet);border-radius:6px}
.spr{display:flex;flex-wrap:wrap;gap:6px}
.spr label{display:flex;align-items:center;gap:8px;min-height:44px;padding:0 12px;border:1px solid var(--line);border-radius:6px;background:var(--sheet);cursor:pointer;font-size:14px;color:var(--ink)}
.spr label:has(input:checked){border-color:var(--ink);box-shadow:inset 0 0 0 1px var(--ink)}
.spr input{width:18px;height:18px;margin:0}
.spcnt{font-family:var(--f-mono);font-size:11px;color:var(--muted);justify-self:end}
.spsteps{display:flex;flex-wrap:wrap;gap:6px}
.spsteps .spb[aria-current=step]{box-shadow:0 0 0 2px var(--stamp)}
.spstat{display:grid;gap:6px;border:1px solid var(--line);background:var(--sheet);padding:10px 12px}
.spsurf{border:1px dashed var(--line);padding:10px;display:grid;gap:8px;min-width:0}
.spsurf .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.spthumb{width:112px;height:80px;object-fit:cover;background:var(--paper);border:1px solid var(--line);display:block;flex:none}
.spfile{position:relative;overflow:hidden}
.spfile input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.spfile:focus-within{outline:2px solid var(--stamp);outline-offset:2px}
.spprog{display:grid;gap:4px;font-size:13px}
.spprog progress{width:100%;height:10px}
.spfold{display:grid;gap:3px;justify-content:center;margin:6px auto;max-width:100%}
.spfold .pn{position:relative;border:1px solid rgba(0,0,0,.25);background-color:#ddd;overflow:hidden;font-family:var(--f-mono);font-size:10px;color:#111}
.spfold .pn span{position:absolute;left:3px;top:3px;background:rgba(255,255,255,.8);padding:0 4px;border-radius:3px}
.spfold .pn.door::after{content:"";position:absolute;bottom:0;left:50%;width:14%;height:62%;transform:translateX(-50%);background:rgba(0,0,0,.55)}
.splist{display:grid;gap:8px;margin:0;padding:0;list-style:none}
.splist li{display:flex;flex-wrap:wrap;gap:10px;align-items:center;border:1px solid var(--line);background:var(--sheet);padding:8px}
.splist li .nm{flex:1 1 160px;min-width:0;overflow-wrap:anywhere;font-size:14px}
.splist li .nm small{display:block;color:var(--muted);font-size:12px}
.splist .ph{width:64px;height:48px;object-fit:cover;background:var(--paper);border:1px solid var(--line);flex:none}
.spdlg{position:fixed;inset:0;z-index:95;background:rgba(10,12,14,.55);display:grid;place-items:center;padding:12px}
.spdlg .box{background:var(--sheet);color:var(--ink);border:1px solid var(--ink);width:min(560px,100%);max-height:92vh;overflow:auto;padding:16px;box-sizing:border-box;display:grid;gap:12px}
.spdlg h3{margin:0;font-size:20px;font-weight:600}
.spimgs{display:grid;gap:10px;grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr))}
.spimgs figure{margin:0;display:grid;gap:4px}.spimgs img{width:100%;height:auto;max-height:360px;object-fit:contain;background:#111;display:block}
.spimgs figcaption{font-size:12px;color:var(--muted)}
.spart{border:1px solid var(--line);background:var(--sheet);padding:14px;display:grid;gap:10px;margin-bottom:18px;min-width:0}
.spart h3{margin:0;font-family:var(--f-body);font-weight:400;font-size:22px;overflow-wrap:anywhere}
.spdl{display:grid;grid-template-columns:minmax(90px,auto) minmax(0,1fr);gap:4px 12px;font-size:13.5px;margin:0}
.spdl dt{color:var(--muted)}.spdl dd{margin:0;overflow-wrap:anywhere}
.spbadge{font-family:var(--f-mono);font-size:10.5px;border:1px solid var(--line);border-radius:999px;padding:1px 7px;margin-left:6px;white-space:nowrap}
.sp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (max-width:520px){.spb{padding:9px 12px}.spart{padding:10px}}
`;document.head.appendChild(s)}

/* ---------- общее ---------- */
function setMsg(el,t,err){if(!el)return;el.textContent=t||"";el.classList.toggle("err",!!err)}
function confirmTwice(btn,q){if(btn.dataset.sure==="1")return true;btn.dataset.sure="1";const t=btn.textContent;btn.textContent=q;btn.setAttribute("aria-live","polite");
  setTimeout(()=>{if(btn.isConnected){btn.dataset.sure="";btn.textContent=t}},5000);return false}
function nav(h){try{history.pushState(null,"","#"+h)}catch(e){}route(h)}
function page(navKey,html){const app=A();app.clearView();app.setNav(navKey||"museum");css();app.view.innerHTML=`<div class="sppage">${html}</div>`;return app.view}
const statusChip=s=>`<span class="spst ${esc(s)}">${esc(STATUS[s]||s)}</span>`;
function surfStyle(s,ppm){if(!s)return "";const url=s.img&&B().url(s.img);let st=`background-color:${esc(s.color||"#ddd")};`;
  if(url)st+=s.fit==="stretch"?`background-image:url('${esc(url)}');background-size:100% 100%;background-repeat:no-repeat;`:`background-image:url('${esc(url)}');background-size:${Math.max(6,Math.round((s.tile||2)*ppm))}px auto;background-repeat:repeat;`;return st}
const wallOf=(room,k)=>room.walls.mode==="each"&&room.walls[k]?room.walls[k]:room.walls.all;
/* развёртка комнаты: сверху северная стена, по бокам западная и восточная, внизу южная (со входом), в центре пол; потолок рядом */
function foldHTML(room,maxW){const W=room.w,D=room.d,H=room.h;const ppm=Math.max(4,Math.min(26,Math.floor((maxW-12)/(W+2*H))));
  const px=v=>Math.round(v*ppm)+"px";const pn=(k,lab,w,h,s,extra)=>`<div class="pn ${extra||""}" style="width:${px(w)};height:${px(h)};${surfStyle(s,ppm)}"><span>${esc(lab)}</span></div>`;
  return `<div class="spfold" role="img" aria-label="${esc("Развёртка комнаты "+fmtM(W)+" на "+fmtM(D)+" метра, высота "+fmtM(H))}" style="grid-template-columns:${px(H)} ${px(W)} ${px(H)}">
   <div></div>${pn("n","север",W,H,wallOf(room,"n"))}<div></div>
   ${pn("w","запад",H,D,wallOf(room,"w"))}${pn("f","пол",W,D,room.floor)}${pn("e","восток",H,D,wallOf(room,"e"))}
   <div></div>${pn("s","юг · вход",W,H,wallOf(room,"s"),"door")}<div></div>
   <div></div>${pn("c","потолок",W,D,room.ceil)}<div></div></div>`}
const fmtM=v=>String(v).replace(".",",");
const roomLine=r=>`${r.shape==="gallery"?"галерея":"комната"} ${fmtM(r.w)}×${fmtM(r.d)} м, высота ${fmtM(r.h)} м`;
const plural=(n,a,b,c)=>{const m=n%10,h=n%100;return n+" "+(m===1&&h!==11?a:m>=2&&m<=4&&(h<12||h>14)?b:c)};
function placeholder(name){const c=document.createElement("canvas");c.width=320;c.height=240;const g=c.getContext("2d");g.fillStyle="#E9E4DA";g.fillRect(0,0,320,240);g.strokeStyle="#9C988F";g.strokeRect(20,20,280,200);
  g.fillStyle="#3a3a3a";g.font="18px sans-serif";g.textAlign="center";const t=String(name||"").slice(0,26);g.fillText(t,160,128);return c.toDataURL("image/png")}

/* ---------- кэш списков ---------- */
const LC={};
async function listFloor(k,fresh){const c=LC[k];if(c&&!fresh&&Date.now()-c.at<30000)return c.rows;const rows=await B().list(k);LC[k]={at:Date.now(),rows};return rows}
const dropCache=()=>Object.keys(LC).forEach(k=>delete LC[k]);
let pendN=null;
async function pendingCount(fresh){const m=await me();if(!m.owner)return 0;if(pendN==null||fresh)pendN=await B().pendingCount().catch(()=>0);return pendN}

function spaceCard(s,opts){opts=opts||{};const cov=s.cover?`<img class="cov" alt="" loading="lazy" src="${esc(s.cover)}">`:`<div class="cov col" style="background:${esc(s.room.walls.all.color)}" aria-hidden="true"></div>`;
  return `<article class="spcard" data-sp-id="${esc(s.id)}">${cov}<div class="bd"><span class="spmeta">${esc(flName(s.floor))}${opts.status?" · ":""}${opts.status?statusChip(s.status):""}</span><h3>${esc(s.title)}</h3>
   <span class="spmeta">автор: ${esc(s.author)} · ${plural(s.count,"предмет","предмета","предметов")} · ${esc(roomLine(s.room))}</span>
   ${s.descr?`<p>${esc(s.descr.length>180?s.descr.slice(0,178)+"…":s.descr)}</p>`:""}
   ${opts.status&&s.note?`<p class="spnote"><b>Замечание автора сайта:</b> ${esc(s.note)}</p>`:""}
   <div class="sptools">${opts.actions||`<button type="button" class="spb" data-sp-enter="${esc(s.id)}" aria-label="${esc("Войти: "+s.title)}">войти</button>`}</div></div></article>`}
function wireCards(root){root.querySelectorAll("[data-sp-enter]").forEach(b=>b.onclick=()=>nav("space-"+b.dataset.spEnter));
  root.querySelectorAll("[data-sp-edit]").forEach(b=>b.onclick=()=>nav("space-edit-"+b.dataset.spEdit))}

/* ---------- раздел на странице этажа ---------- */
async function floorSection(k,host){css();if(!B()||!host)return;let sec=host.querySelector("#spSec");if(!sec){sec=document.createElement("section");sec.id="spSec";sec.className="spsec";sec.setAttribute("aria-labelledby","spSecH");host.appendChild(sec)}
  sec.dataset.floor=k;const m=await me();
  const draw=(rows,err)=>{if(!sec.isConnected)return;const n=rows?rows.length:0;
    sec.innerHTML=`<div class="flsec"><h3 id="spSecH">Пространства посетителей${rows?" · "+n:""}</h3><span class="hint">Комнаты, которые собрали читатели на этаже ${flab(k)}. Появляются после одобрения автором сайта.</span></div>
     <div class="sptools"><button type="button" class="spb" id="spWalk">Пройти по этажу</button>${m.id?`<button type="button" class="spb" id="spAdd">Добавить своё пространство</button><button type="button" class="spb gh" id="spMine">Мои пространства</button>`:`<button type="button" class="spb" id="spLogin">Войдите, чтобы добавить</button>`}
      ${m.owner?`<button type="button" class="spb gh" id="spRev">Заявки на пространства${pendN!=null?" · "+pendN:""}</button>`:""}<span class="spmsg" id="spMsg" role="status"></span></div>
     ${err?`<p class="spmsg err">${esc(msg(err))}</p>`:!rows?`<p class="sphint">Загружаем…</p>`:n?`<div class="spgrid">${rows.map(s=>spaceCard(s)).join("")}</div>`:`<p class="sphint">Здесь пока нет пространств. Добавьте своё.</p>`}`;
    wireCards(sec);const q=id=>sec.querySelector(id);
    if(q("#spLogin"))q("#spLogin").onclick=()=>window.Backend.login();
    if(q("#spWalk"))q("#spWalk").onclick=()=>nav3d(k);
    if(q("#spMine"))q("#spMine").onclick=()=>nav("spaces-mine");
    if(q("#spRev"))q("#spRev").onclick=()=>nav("spaces-review");
    if(q("#spAdd"))q("#spAdd").onclick=()=>startNew(k,q("#spMsg"),q("#spAdd"))};
  draw(LC[k]?LC[k].rows:null);
  try{const rows=await listFloor(k);draw(rows)}catch(e){draw(null,e)}
  if(m.owner){await pendingCount();const b=sec.querySelector("#spRev");if(b)b.textContent="Заявки на пространства · "+pendN}}
async function startNew(k,msgEl,btn){const m=await me();if(!m.id){window.Backend.login();return}
  if(btn)btn.disabled=true;try{const mine=await B().mine();if(!m.owner&&mine.length>=B().LIMITS.spaces){setMsg(msgEl,msg("limit_spaces"),true);return}nav("space-new-"+k)}
  catch(e){setMsg(msgEl,msg(e),true)}finally{if(btn&&btn.isConnected)btn.disabled=false}}
function floorHook(k){const host=document.querySelector(`[data-floorview="${k}"]`);if(host)floorSection(k,host)}
async function museumHook(view){css();floorSection("-1",view);const m=await me();if(!m.owner||!view.isConnected)return;const head=view.querySelector(".page-head");if(!head||view.querySelector("#spOwnerBar"))return;
  const bar=document.createElement("div");bar.id="spOwnerBar";bar.className="sptools";bar.setAttribute("role","group");bar.setAttribute("aria-label","Для автора сайта");
  bar.innerHTML=`<button type="button" class="spb" id="spObjAdd">Добавить предмет</button><button type="button" class="spb gh" id="spObjAll">Все предметы</button><button type="button" class="spb gh" id="spRev2">Заявки на пространства</button><button type="button" class="spb gh" id="spHall">Оформление залов</button><button type="button" class="spb gh" id="spHallAdd">Добавить зал</button><span class="spmsg" id="spHallM" role="alert"></span>`;
  /* этап 14: редактор грузится лениво — на кнопке индикатор, при ошибке — сообщение рядом */
  const hsGo=k=>ev=>{const a=A();if(a&&a.openHallUi)a.openHallUi(k,ev.currentTarget,(t,e)=>setMsg(bar.querySelector("#spHallM"),t,e))};
  head.after(bar);bar.querySelector("#spHall").onclick=hsGo(undefined);bar.querySelector("#spHallAdd").onclick=hsGo("new");bar.querySelector("#spObjAdd").onclick=()=>objEditor(null);bar.querySelector("#spObjAll").onclick=()=>nav("objs-all");bar.querySelector("#spRev2").onclick=()=>nav("spaces-review");
  const n=await pendingCount(true);const b=bar.querySelector("#spRev2");if(b)b.textContent="Заявки на пространства · "+n}
async function clubHook(){const v=document.querySelector("[data-clubview=club]");if(!v||!B())return;css();const host=A().view;if(host.querySelector("#spClub"))return;
  const m=await me();if(!document.querySelector("[data-clubview=club]"))return;const sec=document.createElement("section");sec.className="pblock spsec";sec.id="spClub";
  sec.innerHTML=`<div class="flsec"><h3>Пространства посетителей</h3><span class="hint">Своя комната на этаже 551, 43, 17 или −1: стены, пол, потолок и до 24 предметов. ${esc(RULE)}</span></div>
   <div class="sptools">${m.id?`<button type="button" class="spb" data-c="mine">Мои пространства</button>`:`<button type="button" class="spb" data-c="login">Войдите, чтобы добавить</button>`}
   ${m.owner?`<button type="button" class="spb gh" data-c="rev">Заявки на пространства · …</button><button type="button" class="spb gh" data-c="objs">Все предметы книги</button>`:""}</div>`;
  const hb=host.querySelector("#hallsBlock");if(hb)hb.before(sec);else host.appendChild(sec);
  sec.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{const c=b.dataset.c;if(c==="login")window.Backend.login();else nav(c==="mine"?"spaces-mine":c==="rev"?"spaces-review":"objs-all")});
  if(m.owner){const n=await pendingCount(true);const b=sec.querySelector("[data-c=rev]");if(b)b.textContent="Заявки на пространства · "+n}}

/* ---------- маршруты ---------- */
function route(h){h=String(h||"");if(!B()){A().go("home");return}
  if(h==="spaces-mine")return pageMine();
  if(h==="spaces-review")return pageReview();
  if(h==="objs-all")return pageObjs();
  let m=h.match(/^space-new-(551|43|17|-1)$/);if(m)return editor(null,m[1]);
  m=h.match(/^space-edit-([0-9a-f-]{36})$/);if(m)return editor(m[1]);
  m=h.match(/^space-plan-([0-9a-f-]{36})$/);if(m)return preview(m[1]);
  m=h.match(/^space-([0-9a-f-]{36})$/);if(m)return enterSpace(m[1]);
  A().go("home")}

/* ---------- мои пространства ---------- */
async function pageMine(){const v=page("museum",`<div class="page-head"><div class="eyebrow">Пространства посетителей</div><h2>Мои пространства</h2><div class="sub">${esc(RULE)}</div></div><div id="spBody"><p class="sphint">Загружаем…</p></div>`);
  const body=v.querySelector("#spBody");const m=await me();
  if(!m.id){body.innerHTML=`<p class="sphint">Свои пространства видны после входа.</p><button type="button" class="spb" id="spLogin">Войдите, чтобы добавить</button>`;body.querySelector("#spLogin").onclick=()=>window.Backend.login();return}
  let rows;try{rows=await B().mine()}catch(e){body.innerHTML=`<p class="spmsg err" role="alert">${esc(msg(e))}</p>`;return}
  if(!body.isConnected)return;const L=B().LIMITS.spaces,full=!m.owner&&rows.length>=L;
  body.innerHTML=`<div class="sptools"><label class="sp-sr" for="spNewFl">Этаж нового пространства</label>
    <select id="spNewFl" style="min-height:44px;font:inherit;font-size:16px;border:1px solid var(--line);border-radius:6px;background:var(--sheet);color:var(--ink);padding:0 8px">${FL_ORDER.map(k=>`<option value="${k}" ${k==="17"?"selected":""}>${esc(flName(k))}</option>`).join("")}</select>
    <button type="button" class="spb" id="spAdd" ${full?'aria-disabled="true"':""}>Добавить своё пространство</button><span class="spmeta">${rows.length} из ${m.owner?"∞":L}</span><span class="spmsg" id="spMsg" role="status"></span></div>
   ${rows.length?`<div class="spgrid">${rows.map(s=>spaceCard(s,{status:true,actions:`<button type="button" class="spb" data-sp-edit="${esc(s.id)}" aria-label="${esc("Изменить: "+s.title)}">Изменить</button><button type="button" class="spb gh" data-sp-enter="${esc(s.id)}" aria-label="${esc("Посмотреть: "+s.title)}">Посмотреть</button><button type="button" class="spb warn" data-sp-del="${esc(s.id)}" aria-label="${esc("Удалить: "+s.title)}">Удалить</button>`})).join("")}</div>`:`<p class="sphint">Пока ни одного. Выберите этаж и нажмите «Добавить своё пространство».</p>`}`;
  wireCards(body);const ms=body.querySelector("#spMsg");
  body.querySelector("#spAdd").onclick=()=>{if(full){setMsg(ms,msg("limit_spaces"),true);return}nav("space-new-"+body.querySelector("#spNewFl").value)};
  body.querySelectorAll("[data-sp-del]").forEach(b=>b.onclick=async()=>{if(!confirmTwice(b,"Удалить навсегда? Нажмите ещё раз"))return;b.disabled=true;
    try{await B().remove(b.dataset.spDel);dropCache();pageMine()}catch(e){b.disabled=false;setMsg(ms,msg(e),true)}})}

/* ---------- загрузка изображения с прогрессом и повтором ---------- */
function uploadBox(){return `<div class="spprog" hidden><progress max="100" value="0"></progress><span class="spmsg" role="status"></span><button type="button" class="spb gh sm" data-retry hidden>Повторить загрузку</button></div>`}
async function runUpload(box,file,opts,onDone){const P=box.querySelector(".spprog"),bar=P.querySelector("progress"),st=P.querySelector(".spmsg"),rt=P.querySelector("[data-retry]");
  P.hidden=false;rt.hidden=true;bar.value=5;setMsg(st,"Проверяем файл…");
  try{const r=await B().uploadImage(file,Object.assign({},opts,{onProgress:p=>{bar.value=Math.round(p.p*100);setMsg(st,p.stage==="prepare"?"Уменьшаем изображение…":p.stage==="upload"?"Загружаем…":"Загружено")}}));
    bar.value=100;setMsg(st,"Загружено: "+Math.round(r.bytes/1024)+" КБ, "+r.w+"×"+r.h);await onDone(r);return r}
  catch(e){bar.value=0;setMsg(st,msg(e),true);if(["offline","failed","not_permitted"].indexOf(e.code)>=0||!e.code){rt.hidden=false;rt.onclick=()=>runUpload(box,file,opts,onDone)}return null}}

/* ---------- редактор пространства ---------- */
async function editor(id,floor){const v=page("museum",`<div class="page-head"><div class="eyebrow">Пространства посетителей</div><h2 id="spEdH">${id?"Пространство":"Новое пространство"}</h2><div class="sub">${esc(RULE)}</div></div><div id="spBody"><p class="sphint">Загружаем…</p></div>`);
  const body=v.querySelector("#spBody");const m=await me();
  if(!m.id){body.innerHTML=`<p class="sphint">Добавлять пространства могут вошедшие посетители.</p><button type="button" class="spb" id="spLogin">Войдите, чтобы добавить</button>`;body.querySelector("#spLogin").onclick=()=>window.Backend.login();return}
  const E={sp:null,objs:[],step:1,room:B().normRoom({}),floor:floor||"17",title:"",descr:"",editObj:null,q:Promise.resolve()};
  if(id){try{const s=await B().get(id);if(!s.canEdit){body.innerHTML=`<p class="spmsg err" role="alert">${esc(msg("not_permitted"))}</p>`;return}E.sp=s;E.objs=s.objects;E.room=s.room;E.floor=s.floor;E.title=s.title;E.descr=s.descr;
      /* этап 13: зал автора сайта — без проверки, виден всем сразу; стыковка и картины — в «Оформлении залов» */
      if(s.kind==="hall"){const eb=v.querySelector(".page-head .eyebrow"),sb=v.querySelector(".page-head .sub");if(eb)eb.textContent="Зал автора сайта";if(sb)sb.textContent="Изменения видны всем сразу. Этаж, место стыковки, картины и свет — в «Оформлении залов»; здесь — предметы зала и их картинки."}}
    catch(e){body.innerHTML=`<p class="spmsg err" role="alert">${esc(msg(e))}</p>`;return}}
  if(!body.isConnected)return;
  body.innerHTML=`<div class="sped">
    <div class="spstat" id="spStat" aria-live="polite"></div>
    <nav class="spsteps" aria-label="Шаги"><button type="button" class="spb gh" data-step="1">1. Название</button><button type="button" class="spb gh" data-step="2">2. Комната</button><button type="button" class="spb gh" data-step="3">3. Предметы</button></nav>
    <div id="spStep"></div>
    <div class="sptools"><span class="spmsg" id="spSave" role="status"></span></div>
    <div class="sptools" id="spDanger"></div></div>`;
  const $=s=>body.querySelector(s);
  const stat=()=>{const s=E.sp;$("#spStat").innerHTML=s?`<div><b>Статус:</b> ${statusChip(s.status)} <span class="spmeta">${esc(flName(s.floor))}</span></div>${s.note?`<p class="spnote"><b>Замечание автора сайта:</b> ${esc(s.note)}</p>`:""}<span class="sphint">${s.status==="approved"?"Опубликовано: пространство видят все. Любое изменение снова отправит его на проверку.":s.status==="hidden"?"Скрыто автором сайта: другие его не видят.":"Черновик сохранён и ждёт проверки. «Отправить на проверку» не нужно — сохранённое уже отправлено."}</span>`:`<span class="sphint">Черновик появится после первого шага. ${esc(RULE)}</span>`;
    $("#spDanger").innerHTML=s?`<button type="button" class="spb gh" id="spView">Посмотреть</button><button type="button" class="spb gh" id="spToMine">Мои пространства</button><button type="button" class="spb warn" id="spDel">Удалить пространство</button>`:"";
    if(s){$("#spView").onclick=()=>nav("space-"+s.id);$("#spToMine").onclick=()=>nav(m.owner&&s.owner!==m.id?"spaces-review":"spaces-mine");
      $("#spDel").onclick=async()=>{const b=$("#spDel");if(!confirmTwice(b,"Удалить пространство и все его изображения? Нажмите ещё раз"))return;b.disabled=true;
        try{await B().remove(s.id);dropCache();nav(m.owner&&s.owner!==m.id?"spaces-review":"spaces-mine")}catch(e){b.disabled=false;setMsg($("#spSave"),msg(e),true)}}}
    body.querySelectorAll("[data-step]").forEach(b=>{const n=+b.dataset.step;b.setAttribute("aria-current",n===E.step?"step":"false");b.disabled=!s&&n>1;b.onclick=()=>{E.step=n;draw()}})};
  const saved=row=>{if(row){E.sp=Object.assign(E.sp||{},row,{room:B().normRoom(row.room)});dropCache()}stat()};
  const enqueue=fn=>{const p=E.q.then(fn,fn);E.q=p.catch(()=>{});return p};
  const saveFields=patch=>enqueue(async()=>{if(!E.sp)return;setMsg($("#spSave"),"Сохраняем…");try{saved(await B().update(E.sp.id,patch));setMsg($("#spSave"),"Сохранено")}catch(e){setMsg($("#spSave"),msg(e),true);throw e}});
  let tSave=null;const saveSoon=patch=>{clearTimeout(tSave);setMsg($("#spSave"),"Изменения ждут сохранения…");tSave=setTimeout(()=>saveFields(patch()).catch(()=>{}),900)};
  A().cleanup().push(()=>clearTimeout(tSave));

  function step1(){$("#spStep").innerHTML=`<form class="sped" id="spF1" novalidate>
     <fieldset><legend>Этаж</legend><div class="spr">${FL_ORDER.map(k=>`<label><input type="radio" name="floor" value="${k}" ${E.floor===k?"checked":""}><span>${esc(flName(k))}</span></label>`).join("")}</div></fieldset>
     <label class="f" for="spTitle">Название (до 60 знаков)<input type="text" id="spTitle" name="title" maxlength="60" required value="${esc(E.title)}" autocomplete="off"></label><span class="spcnt" id="spTc"></span>
     <label class="f" for="spDescr">Описание (до 600 знаков)<textarea id="spDescr" name="descr" maxlength="600">${esc(E.descr)}</textarea></label><span class="spcnt" id="spDc"></span>
     <div class="sptools"><button class="spb" type="submit">${E.sp?"Дальше: комната":"Создать черновик и продолжить"}</button><span class="spmsg" id="spF1m" role="alert"></span></div></form>`;
    const f=$("#spF1"),cnt=()=>{$("#spTc").textContent=f.title.value.length+" / 60";$("#spDc").textContent=f.descr.value.length+" / 600"};cnt();
    const pull=()=>{E.floor=f.querySelector("input[name=floor]:checked").value;E.title=f.title.value;E.descr=f.descr.value};
    f.oninput=()=>{cnt();pull();if(E.sp&&E.title.trim())saveSoon(()=>({floor:E.floor,title:E.title,descr:E.descr}))};
    f.onchange=()=>{pull();if(E.sp&&E.title.trim())saveSoon(()=>({floor:E.floor,title:E.title,descr:E.descr}))};
    f.onsubmit=async ev=>{ev.preventDefault();pull();const fm=$("#spF1m");if(!E.title.trim()){setMsg(fm,"Нужно название.",true);f.title.focus();return}
      const b=f.querySelector("button[type=submit]");b.disabled=true;
      try{if(!E.sp){const row=await B().create({floor:E.floor,title:E.title,descr:E.descr,room:E.room});saved(row);try{history.replaceState(null,"","#space-edit-"+row.id)}catch(e){}setMsg($("#spSave"),"Черновик создан")}
        else{clearTimeout(tSave);await saveFields({floor:E.floor,title:E.title,descr:E.descr})}E.step=2;draw()}
      catch(e){setMsg(fm,msg(e),true)}finally{if(b.isConnected)b.disabled=false}}}

  function surfEditor(key,label){const s=getSurf(key);const url=s.img&&B().url(s.img);const id="sf_"+key.replace(".","_");
    return `<div class="spsurf" data-surf="${key}"><b>${esc(label)}</b>
      <div class="row"><img class="spthumb" alt="${esc(url?"Изображение: "+label:"")}" src="${url?esc(url):placeholder("нет изображения")}">
        <span class="spb gh sm spfile">${url?"Заменить изображение":"Выбрать изображение"}<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="${esc("Изображение: "+label)}" id="${id}"></span>
        ${url?`<button type="button" class="spb gh sm" data-rm>Убрать изображение</button>`:""}</div>
      ${uploadBox()}
      <div class="spr" role="radiogroup" aria-label="${esc("Как показать: "+label)}"><label><input type="radio" name="${id}_fit" value="tile" ${s.fit!=="stretch"?"checked":""}><span>повторять как обои</span></label><label><input type="radio" name="${id}_fit" value="stretch" ${s.fit==="stretch"?"checked":""}><span>растянуть как фото</span></label></div>
      <label class="row" style="font-size:13px;color:var(--muted)"><input type="color" value="${esc(s.color)}" data-col aria-label="${esc("Цвет без изображения: "+label)}"> Цвет, если нет изображения</label></div>`}
  function getSurf(key){const r=E.room;if(key==="floor")return r.floor;if(key==="ceil")return r.ceil;const k=key.split(".")[1];if(k==="all")return r.walls.all;if(!r.walls[k])r.walls[k]=Object.assign({},r.walls.all);return r.walls[k]}
  const saveRoom=()=>saveFields({room:E.room});
  function step2(){const r=E.room;const sz=k=>B().SIZES[k][r.shape];
    $("#spStep").innerHTML=`<div class="sped">
     <fieldset><legend>Размер</legend><div class="spr">${["s","m","l"].map(k=>`<label><input type="radio" name="size" value="${k}" ${r.size===k?"checked":""}><span>${SIZE_NAMES[k]} · ${sz(k)[0]}×${sz(k)[1]} м</span></label>`).join("")}</div></fieldset>
     <fieldset><legend>Форма</legend><div class="spr"><label><input type="radio" name="shape" value="room" ${r.shape==="room"?"checked":""}><span>комната</span></label><label><input type="radio" name="shape" value="gallery" ${r.shape==="gallery"?"checked":""}><span>галерея (вытянутая)</span></label></div></fieldset>
     <fieldset><legend>Высота потолка</legend><div class="spr">${[3,3.5,4].map(h=>`<label><input type="radio" name="h" value="${h}" ${r.h===h?"checked":""}><span>${fmtM(h)} м</span></label>`).join("")}</div></fieldset>
     <fieldset><legend>Стены</legend><div class="spr"><label><input type="radio" name="wm" value="one" ${r.walls.mode!=="each"?"checked":""}><span>одно изображение для всех стен</span></label><label><input type="radio" name="wm" value="each" ${r.walls.mode==="each"?"checked":""}><span>отдельно для каждой стены</span></label></div>
      ${r.walls.mode==="each"?WALLS.map(([k,l])=>surfEditor("walls."+k,l)).join(""):surfEditor("walls.all","Все стены")}</fieldset>
     <fieldset><legend>Пол и потолок</legend>${surfEditor("floor","Пол")}${surfEditor("ceil","Потолок")}</fieldset>
     <p class="sphint" id="spNotice">${esc(NOTICE)}</p>
     <fieldset><legend>Как это будет выглядеть</legend><p class="sphint">${esc(roomLine(r))}. Развёртка: в центре пол, вокруг стены, ниже потолок.</p><div id="spFold"></div></fieldset>
     <div class="sptools"><button type="button" class="spb gh" data-go-step="1">Назад</button><button type="button" class="spb" data-go-step="3">Дальше: предметы</button></div></div>`;
    const fold=()=>{const el=$("#spFold");if(el)el.innerHTML=foldHTML(E.room,Math.min(560,el.clientWidth||320))};fold();
    const st=$("#spStep");
    st.querySelectorAll("[data-go-step]").forEach(b=>b.onclick=()=>{E.step=+b.dataset.goStep;draw()});
    st.querySelectorAll("input[name=size],input[name=shape],input[name=h]").forEach(i=>i.onchange=()=>{const size=st.querySelector("input[name=size]:checked").value,shape=st.querySelector("input[name=shape]:checked").value,h=+st.querySelector("input[name=h]:checked").value;
      E.room=B().normRoom(Object.assign({},E.room,{size,shape,h}));saveRoom().catch(()=>{});step2();const f=$(`input[name=${i.name}][value="${i.value}"]`);if(f)f.focus()});
    st.querySelectorAll("input[name=wm]").forEach(i=>i.onchange=()=>{E.room.walls.mode=i.value;if(i.value==="each")WALLS.forEach(([k])=>getSurf("walls."+k));saveRoom().catch(()=>{});step2();const f=$(`input[name=wm][value="${i.value}"]`);if(f)f.focus()});
    st.querySelectorAll("[data-surf]").forEach(box=>{const key=box.dataset.surf,s=()=>getSurf(key);
      box.querySelectorAll("input[type=radio]").forEach(i=>i.onchange=()=>{s().fit=i.value;fold();saveSoon(()=>({room:E.room}))});
      box.querySelector("[data-col]").oninput=ev=>{s().color=ev.target.value;fold();saveSoon(()=>({room:E.room}))};
      const rm=box.querySelector("[data-rm]");if(rm)rm.onclick=async()=>{const old=s().img;s().img="";try{await saveRoom();if(old&&!B().roomImages(E.room).includes(old))B().removeImages([old]).catch(()=>{})}catch(e){}step2()};
      box.querySelector("input[type=file]").onchange=async ev=>{const file=ev.target.files&&ev.target.files[0];ev.target.value="";if(!file)return;
        await runUpload(box,file,{},async r=>{const old=s().img;s().img=r.path;try{await saveRoom();if(old&&!B().roomImages(E.room).includes(old))B().removeImages([old]).catch(()=>{});
          const th=box.querySelector(".spthumb");th.src=r.url;th.alt="Изображение: "+box.querySelector("b").textContent;fold()}catch(e){s().img=old;throw e}})}})}

  function step3(){const L=B().LIMITS.objects,n=E.objs.length,ed=E.editObj;
    $("#spStep").innerHTML=`<div class="sped"><div class="flsec" style="margin:0"><h3>Предметы · ${n} из ${L}</h3><span class="hint">Порядок — тот, в котором предметы стоят в комнате.</span></div>
     ${n?`<ol class="splist" id="spObjs">${E.objs.map((o,i)=>`<li data-oid="${esc(o.id)}"><img class="ph" alt="" src="${o.img?esc(B().url(o.img)):placeholder(o.name)}"><span class="nm">${i+1}. ${esc(o.name)}<small>${o.place&&o.place.kind==="ped"?"предмет на постаменте":"картина на стене"}${o.img?"":" · без изображения"}</small></span>
        <button type="button" class="spb gh sm" data-up ${i===0?"disabled":""} aria-label="${esc("Выше: "+o.name)}">↑</button><button type="button" class="spb gh sm" data-down ${i===n-1?"disabled":""} aria-label="${esc("Ниже: "+o.name)}">↓</button>
        <button type="button" class="spb gh sm" data-oed aria-label="${esc("Изменить предмет: "+o.name)}">Изменить</button><button type="button" class="spb warn sm" data-odel aria-label="${esc("Удалить предмет: "+o.name)}">Удалить</button></li>`).join("")}</ol>`:`<p class="sphint">Пока ни одного предмета.</p>`}
     ${ed||n<L?objForm(ed):`<p class="spmsg err" role="status">${esc(msg("limit_objects"))}</p>`}
     <div class="sptools"><button type="button" class="spb gh" data-go-step="2">Назад: комната</button>${E.sp?`<button type="button" class="spb gh" id="spSee">Посмотреть, как получилось</button>`:""}</div></div>`;
    const st=$("#spStep");st.querySelectorAll("[data-go-step]").forEach(b=>b.onclick=()=>{E.step=+b.dataset.goStep;draw()});if($("#spSee"))$("#spSee").onclick=()=>nav("space-"+E.sp.id);
    st.querySelectorAll("#spObjs li").forEach(li=>{const o=E.objs.find(x=>x.id===li.dataset.oid);
      const move=d=>enqueue(async()=>{const i=E.objs.indexOf(o),j=i+d;if(j<0||j>=E.objs.length)return;const a=E.objs.slice();a.splice(i,1);a.splice(j,0,o);setMsg($("#spSave"),"Сохраняем порядок…");
        try{await B().reorder(E.sp.id,a.map(x=>x.id));a.forEach((x,k)=>x.sort=k);E.objs=a;await refreshStatus();setMsg($("#spSave"),"Порядок сохранён");step3();const b=$(`#spObjs li[data-oid="${o.id}"] [data-${d<0?"up":"down"}]`);(b&&!b.disabled?b:$(`#spObjs li[data-oid="${o.id}"] [data-oed]`)).focus()}catch(e){setMsg($("#spSave"),msg(e),true)}});
      li.querySelector("[data-up]").onclick=()=>move(-1);li.querySelector("[data-down]").onclick=()=>move(1);
      li.querySelector("[data-oed]").onclick=()=>{E.editObj=o;step3();const f=$("#spOName");if(f)f.focus()};
      li.querySelector("[data-odel]").onclick=async ev=>{const b=ev.currentTarget;if(!confirmTwice(b,"Точно удалить?"))return;b.disabled=true;
        try{await B().removeObject(o.id);E.objs=E.objs.filter(x=>x!==o);if(E.editObj===o)E.editObj=null;await refreshStatus();setMsg($("#spSave"),"Предмет удалён");step3()}catch(e){b.disabled=false;setMsg($("#spSave"),msg(e),true)}}});
    wireObjForm()}
  function objForm(o){const f=o||{};const kind=f.place&&f.place.kind==="ped"?"ped":"wall";const url=f.img&&B().url(f.img);
    return `<form class="sped" id="spOF" novalidate><fieldset><legend>${o?"Изменить предмет":"Добавить предмет"}</legend>
      <label class="f" for="spOName">Название (до 80 знаков)<input type="text" id="spOName" name="name" maxlength="80" required value="${esc(f.name||"")}" autocomplete="off"></label>
      <label class="f" for="spODescr">Описание (до 1200 знаков)<textarea id="spODescr" name="descr" maxlength="1200">${esc(f.descr||"")}</textarea></label>
      <div class="spsurf" id="spOImg"><b>Изображение (необязательно)</b><div class="row"><img class="spthumb" alt="" src="${url?esc(url):placeholder("нет изображения")}">
        <span class="spb gh sm spfile">${url?"Заменить изображение":"Выбрать изображение"}<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Изображение предмета"></span>${url?`<button type="button" class="spb gh sm" data-rm>Убрать изображение</button>`:""}</div>${uploadBox()}<span class="sphint">${esc(NOTICE)}</span></div>
      <fieldset><legend>Как показать</legend><div class="spr"><label><input type="radio" name="kind" value="wall" ${kind==="wall"?"checked":""}><span>картина на стене</span></label><label><input type="radio" name="kind" value="ped" ${kind==="ped"?"checked":""}><span>предмет на постаменте</span></label></div></fieldset>
      <div class="sptools"><button type="submit" class="spb">${o?"Сохранить предмет":"Добавить предмет"}</button>${o?`<button type="button" class="spb gh" data-cancel>Отмена</button>`:""}<span class="spmsg" id="spOFm" role="alert"></span></div></fieldset></form>`}
  function wireObjForm(){const f=$("#spOF");if(!f)return;const o=E.editObj;let img=o?o.img:"";const box=$("#spOImg");
    const rm=()=>{const b=box.querySelector("[data-rm]");if(b)b.onclick=()=>{img="";box.querySelector(".spthumb").src=placeholder("нет изображения");b.remove()}};rm();
    box.querySelector("input[type=file]").onchange=async ev=>{const file=ev.target.files&&ev.target.files[0];ev.target.value="";if(!file)return;const sb=f.querySelector("button[type=submit]");sb.disabled=true;
      await runUpload(box,file,{},async r=>{img=r.path;box.querySelector(".spthumb").src=r.url});sb.disabled=false};
    const c=f.querySelector("[data-cancel]");if(c)c.onclick=()=>{E.editObj=null;step3()};
    f.onsubmit=async ev=>{ev.preventDefault();const fm=$("#spOFm");const name=f.name.value.trim();if(!name){setMsg(fm,"Нужно название предмета.",true);f.name.focus();return}
      const kind=f.querySelector("input[name=kind]:checked").value;const b=f.querySelector("button[type=submit]");b.disabled=true;
      try{if(o){const place=Object.assign({},o.place||{},{kind});if(place.kind!==(o.place||{}).kind){delete place.wall;delete place.u;delete place.y;delete place.x;delete place.z;delete place.r}
          const old=o.img;const row=await B().updateObject(o.id,{name,descr:f.descr.value,img,place});Object.assign(o,row,{place:B().normPlace(row.place)});if(old&&old!==img)B().removeImages([old]).catch(()=>{})}
        else{const sort=E.objs.reduce((a,x)=>Math.max(a,x.sort+1),0);const row=await B().addObject(E.sp.id,{name,descr:f.descr.value,img,place:{kind},sort});row.place=B().normPlace(row.place);E.objs.push(row)}
        E.editObj=null;await refreshStatus();setMsg($("#spSave"),o?"Предмет сохранён":"Предмет добавлен");step3();const nf=$("#spOName");if(nf)nf.focus()}
      catch(e){setMsg(fm,msg(e),true);b.disabled=false}}}
  async function refreshStatus(){try{const s=await B().get(E.sp.id);saved(s)}catch(e){}}
  function draw(){stat();if(E.step>1&&!E.sp)E.step=1;({1:step1,2:step2,3:step3})[E.step]();setMsg($("#spSave"),"")}
  draw()}

/* ---------- просмотр (часть 1: развёртка и предметы; 3D — позже) ---------- */
async function preview(id){const v=page("museum",`<div id="spBody"><p class="sphint">Загружаем…</p></div>`);const body=v.querySelector("#spBody");
  let s;try{s=await B().get(id)}catch(e){body.innerHTML=`<div class="page-head"><div class="eyebrow">Пространства посетителей</div><h2>Не найдено</h2></div><p class="spmsg err" role="alert">${esc(e.code==="not_found"?"Пространство не найдено, ещё на проверке или скрыто.":msg(e))}</p>`;return}
  if(!body.isConnected)return;
  body.innerHTML=`<div class="page-head"><div class="eyebrow">${esc(flName(s.floor))} · пространство посетителя</div><h2>${esc(s.title)}</h2><div class="sub">автор: ${esc(s.author)} · ${esc(roomLine(s.room))} · ${plural(s.count,"предмет","предмета","предметов")}</div></div>
   ${s.canEdit?`<div class="spstat"><div><b>Статус:</b> ${statusChip(s.status)}</div>${s.note?`<p class="spnote"><b>Замечание автора сайта:</b> ${esc(s.note)}</p>`:""}<div class="sptools"><button type="button" class="spb" data-sp-edit="${esc(s.id)}">Изменить</button></div></div>`:""}
   ${s.descr?`<p style="max-width:640px;line-height:1.6;overflow-wrap:anywhere">${esc(s.descr)}</p>`:""}
   <div class="sptools"><button type="button" class="spb gh" id="spBack">${esc("К этажу "+flab(s.floor))}</button></div>
   <p class="sphint">План комнаты: пол в центре, вокруг стены.</p><div class="sptools"><button type="button" class="spb" data-sp-enter="${esc(s.id)}">Войти в 3D</button></div><div id="spFold"></div>
   <div class="flsec"><h3>Предметы · ${s.objects.length}</h3></div>
   ${s.objects.length?`<div class="spgrid">${s.objects.map(o=>`<article class="spcard"><img class="cov" alt="${esc(o.name)}" loading="lazy" src="${o.img?esc(B().url(o.img)):placeholder(o.name)}"><div class="bd"><span class="spmeta">${o.place.kind==="ped"?"на постаменте":"на стене"}</span><h3>${esc(o.name)}</h3>${o.descr?`<p>${esc(o.descr)}</p>`:""}${o.img?`<div class="sptools"><button type="button" class="spb gh sm" data-full="${esc(o.id)}">Изображение на весь экран</button></div>`:""}</div></article>`).join("")}</div>`:`<p class="sphint">Предметов пока нет.</p>`}`;
  wireCards(body);const el=body.querySelector("#spFold");el.innerHTML=foldHTML(s.room,Math.min(560,el.clientWidth||320));
  body.querySelector("#spBack").onclick=()=>A().go(s.floor==="-1"?"museum":"floor:"+s.floor);
  body.querySelectorAll("[data-full]").forEach(b=>b.onclick=()=>{const o=s.objects.find(x=>x.id===b.dataset.full);if(o&&A().lightbox)A().lightbox(B().url(o.img),o.name,b)})}

/* ---------- заявки (только автор сайта) ---------- */
let revTab="pending";
async function pageReview(){const v=page("club",`<div class="page-head"><div class="eyebrow">Для автора сайта</div><h2>Заявки на пространства</h2><div class="sub">Одобренное сразу видят все. Если автор пространства что-то изменит, оно снова придёт сюда.</div></div><div id="spBody"><p class="sphint">Загружаем…</p></div>`);
  const body=v.querySelector("#spBody");const m=await me();
  if(!m.owner){body.innerHTML=`<p class="spmsg err" role="alert">Этот раздел — только для автора сайта.</p>`;return}
  let all;try{all=await B().review()}catch(e){body.innerHTML=`<p class="spmsg err" role="alert">${esc(msg(e))}</p>`;return}
  if(!body.isConnected)return;pendN=all.filter(s=>s.status==="pending").length;
  const tabs=[["pending","На проверке"],["approved","Опубликованы"],["hidden","Скрыты"]];const L=all.filter(s=>s.status===revTab);
  const full=await Promise.all(L.map(s=>B().get(s.id).catch(()=>null)));
  if(!body.isConnected)return;
  body.innerHTML=`<div class="sptools" role="group" aria-label="Списки">${tabs.map(([k,t])=>`<button type="button" class="spb ${revTab===k?"":"gh"}" data-tab="${k}" aria-pressed="${revTab===k}">${t} · ${all.filter(s=>s.status===k).length}</button>`).join("")}<span class="spmsg" id="spRm" role="status"></span></div>
   ${full.filter(Boolean).map(s=>reviewArticle(s)).join("")||`<p class="sphint">Здесь пусто.</p>`}`;
  body.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{revTab=b.dataset.tab;pageReview()});
  full.filter(Boolean).forEach(s=>{const art=body.querySelector(`[data-rev="${s.id}"]`);const el=art.querySelector(".fold");el.innerHTML=foldHTML(s.room,Math.min(520,el.clientWidth||320));
    const done=async(p,t)=>{art.querySelectorAll("button").forEach(b=>b.disabled=true);try{await p;dropCache();await pageReview();setMsg(document.querySelector("#spRm"),t)}catch(e){art.querySelectorAll("button").forEach(b=>b.disabled=false);setMsg(art.querySelector(".spmsg"),msg(e),true)}};
    const q=k=>art.querySelector(`[data-a=${k}]`);
    if(q("ok"))q("ok").onclick=()=>done(B().approve(s.id),"Одобрено: «"+s.title+"» видят все.");
    if(q("hide"))q("hide").onclick=()=>done(B().hide(s.id),"Скрыто: «"+s.title+"».");
    q("edit").onclick=()=>nav("space-edit-"+s.id);
    q("del").onclick=()=>{if(!confirmTwice(q("del"),"Удалить навсегда? Нажмите ещё раз"))return;done(B().remove(s.id),"Удалено.")};
    q("ret").onclick=()=>{const w=art.querySelector(".retw");w.hidden=!w.hidden;if(!w.hidden)w.querySelector("textarea").focus()};
    art.querySelector(".retw").onsubmit=ev=>{ev.preventDefault();const t=ev.target.note.value.trim();if(!t){setMsg(art.querySelector(".spmsg"),"Напишите замечание.",true);return}done(B().returnWithNote(s.id,t),"Возвращено автору с замечанием.")}})}
function reviewArticle(s){const r=s.room,imgs=[];const add=(k,l)=>{const x=k==="floor"?r.floor:k==="ceil"?r.ceil:r.walls[k];if(x&&x.img)imgs.push([B().url(x.img),l+" · "+(x.fit==="stretch"?"растянуть как фото":"повторять как обои")])};
  add("all","Все стены");if(r.walls.mode==="each")WALLS.forEach(([k,l])=>add(k,l));add("floor","Пол");add("ceil","Потолок");
  const col=k=>{const x=k==="floor"?r.floor:k==="ceil"?r.ceil:r.walls.all;return `<span style="display:inline-block;width:14px;height:14px;border:1px solid var(--line);vertical-align:middle;background:${esc(x.color)}"></span> ${esc(x.color)}`};
  return `<article class="spart" data-rev="${esc(s.id)}"><span class="spmeta">${esc(flName(s.floor))} · ${statusChip(s.status)} · автор: ${esc(s.author)} · изменено ${esc(new Date(s.updated_at).toLocaleString("ru-RU"))}</span>
   <h3>${esc(s.title)}</h3>${s.note?`<p class="spnote"><b>Ваше замечание:</b> ${esc(s.note)}</p>`:""}
   <p style="white-space:pre-wrap;overflow-wrap:anywhere;margin:0">${esc(s.descr)||"<i>без описания</i>"}</p>
   <dl class="spdl"><dt>Комната</dt><dd>${esc(SIZE_NAMES[r.size])}, ${esc(roomLine(r))}</dd><dt>Стены</dt><dd>${r.walls.mode==="each"?"отдельно для каждой":"одно изображение для всех"} · ${col("all")}</dd><dt>Пол</dt><dd>${col("floor")}</dd><dt>Потолок</dt><dd>${col("ceil")}</dd></dl>
   <div class="fold"></div>
   ${imgs.length?`<div class="spimgs">${imgs.map(([u,l])=>`<figure><img src="${esc(u)}" alt="${esc(l)}" loading="lazy"><figcaption>${esc(l)}</figcaption></figure>`).join("")}</div>`:`<p class="sphint">Изображений комнаты нет — только цвета.</p>`}
   <b>Предметы · ${s.objects.length}</b>
   ${s.objects.length?`<div class="spimgs">${s.objects.map((o,i)=>`<figure>${o.img?`<img src="${esc(B().url(o.img))}" alt="${esc(o.name)}" loading="lazy">`:""}<figcaption><b style="color:var(--ink)">${i+1}. ${esc(o.name)}</b> · ${o.place.kind==="ped"?"на постаменте":"на стене"}${o.img?"":" · без изображения"}<br>${esc(o.descr)}</figcaption></figure>`).join("")}</div>`:`<p class="sphint">Предметов нет.</p>`}
   <div class="sptools">${s.status!=="approved"?`<button type="button" class="spb" data-a="ok">Одобрить</button>`:""}<button type="button" class="spb gh" data-a="ret">Вернуть с замечанием</button>${s.status!=="hidden"?`<button type="button" class="spb gh" data-a="hide">Скрыть</button>`:""}<button type="button" class="spb gh" data-a="edit">Изменить</button><button type="button" class="spb warn" data-a="del">Удалить</button></div>
   <form class="sped retw" hidden><label class="f">Замечание автору пространства (до 300 знаков)<textarea name="note" maxlength="300" style="min-height:80px">${esc(s.note)}</textarea></label><div class="sptools"><button type="submit" class="spb">Отправить замечание</button></div></form>
   <span class="spmsg" role="alert"></span></article>`}

/* ---------- предметы книги (только автор сайта) ---------- */
let OF={q:"",hall:"all",show:"all",n:60};
async function pageObjs(){const v=page("museum",`<div class="page-head"><div class="eyebrow">Для автора сайта</div><h2>Все предметы</h2><div class="sub">Правки видят все посетители после перезагрузки страницы. «Вернуть как было» убирает правку.</div></div><div id="spBody"><p class="sphint">Загружаем…</p></div>`);
  const body=v.querySelector("#spBody");const m=await me();
  if(!m.owner){body.innerHTML=`<p class="spmsg err" role="alert">Этот раздел — только для автора сайта.</p>`;return}
  if(!body.isConnected)return;
  body.innerHTML=`<form class="sped" role="search" onsubmit="return false" style="max-width:none"><div class="sptools" style="margin:0">
     <label class="f" style="flex:2 1 220px">Поиск<input type="search" id="spOq" value="${esc(OF.q)}" autocomplete="off"></label>
     <label class="f" style="flex:1 1 150px">Зал<select id="spOh"><option value="all">Все залы</option>${cardsHall().map(([k,t])=>`<option value="${k}" ${OF.hall===k?"selected":""}>${esc(t)}</option>`).join("")}</select></label>
     <label class="f" style="flex:1 1 150px">Показать<select id="spOs">${[["all","все"],["edited","изменённые"],["new","новые"],["hidden","скрытые"]].map(([k,t])=>`<option value="${k}" ${OF.show===k?"selected":""}>${t}</option>`).join("")}</select></label></div></form>
   <div class="sptools"><button type="button" class="spb" id="spObjAdd">Добавить предмет</button><span class="spmeta" id="spOc" aria-live="polite"></span></div><ul class="splist" id="spOl"></ul><div class="sptools" id="spOm"></div>`;
  const draw=()=>{const app=A(),q=OF.q.trim().toLowerCase(),ed=app.edits();
    const L=app.OBJ_ALL.filter(o=>(OF.hall==="all"||o.h===OF.hall)&&(OF.show==="all"||(OF.show==="edited"&&ed[o.id]&&!o._new)||(OF.show==="new"&&o._new)||(OF.show==="hidden"&&o._hide))&&(!q||(o.name+" "+(o.ret||"")+" "+o.id).toLowerCase().includes(q)));
    body.querySelector("#spOc").textContent="Найдено: "+L.length;
    body.querySelector("#spOl").innerHTML=L.slice(0,OF.n).map(o=>`<li><img class="ph" alt="" loading="lazy" src="${esc(app.objThumb(o))}"><span class="nm">${esc(o.name)}${o._new?`<span class="spbadge">новый</span>`:ed[o.id]?`<span class="spbadge">изменён</span>`:""}${o._hide?`<span class="spbadge">скрыт</span>`:""}<small>${esc(app.hallName(o.h))} · запись ${esc(app.lab(o.n))} · ${esc(o.id)}</small></span><button type="button" class="spb gh sm" data-oe="${esc(o.id)}" aria-label="${esc("Изменить: "+o.name)}">изменить</button></li>`).join("")||`<li>Ничего не нашлось.</li>`;
    body.querySelector("#spOm").innerHTML=L.length>OF.n?`<button type="button" class="spb gh" id="spMore">Показать ещё · осталось ${L.length-OF.n}</button>`:"";
    const mo=body.querySelector("#spMore");if(mo)mo.onclick=()=>{OF.n+=60;draw()};
    body.querySelectorAll("[data-oe]").forEach(b=>b.onclick=()=>objEditor(b.dataset.oe,()=>{if(body.isConnected)draw()}))};
  let t=null;body.querySelector("#spOq").oninput=ev=>{OF.q=ev.target.value;OF.n=60;clearTimeout(t);t=setTimeout(draw,150)};
  body.querySelector("#spOh").onchange=ev=>{OF.hall=ev.target.value;OF.n=60;draw()};body.querySelector("#spOs").onchange=ev=>{OF.show=ev.target.value;OF.n=60;draw()};
  body.querySelector("#spObjAdd").onclick=()=>objEditor(null,()=>{if(body.isConnected)draw()});draw()}

function newId(){const a="abcdefghijklmnopqrstuvwxyz0123456789";let s="x";for(let i=0;i<10;i++)s+=a[Math.floor(Math.random()*a.length)];return s}
async function objEditor(id,after){const m=await me();if(!m.owner)return;css();const app=A();
  const isNew=!id||!app.ORIGBY[id];const ed=id?app.edits()[id]||null:null;const cur=id?app.OBJ_ALL.find(o=>o.id===id):null;if(id&&!cur)return;
  const orig=id?app.ORIGBY[id]:null;const o=cur||{name:"",ret:"",n:app.ORDER[0],h:"kv"};const origImg=orig?app.imgOf(orig.id):null;
  let img=ed&&ed.img?ed.img:"";
  /* этап 14: у нового предмета прежнего изображения нет — подсказка честная */
  const fresh=isNew&&!cur;const imgHint=()=>img?"Сейчас: загруженное изображение."+(fresh?"":" Без загрузки остаётся как есть."):fresh?"Изображения пока нет. Загрузите файл — иначе предмет покажется с рисованной заглушкой.":"Сейчас: прежнее изображение. Без загрузки остаётся как есть.";
  const opener=document.activeElement;document.querySelectorAll(".overlay").forEach(x=>x.remove());
  const dlg=document.createElement("div");dlg.className="spdlg";dlg.innerHTML=`<form class="box sped" role="dialog" aria-modal="true" aria-labelledby="spOeH" novalidate>
    <div class="sptools" style="margin:0;justify-content:space-between"><h3 id="spOeH">${isNew&&!cur?"Новый предмет":"Предмет "+esc(o.id)}</h3><button type="button" class="spb gh sm" data-x>Закрыть</button></div>
    <label class="f">Название<input type="text" name="name" maxlength="120" required value="${esc(o.name)}"></label>
    <label class="f">Подпись — где вещь возвращается<textarea name="ret" maxlength="2000">${esc(o.ret||"")}</textarea></label>
    <label class="f">Запись дневника (номер)<input type="number" name="n" min="1" inputmode="numeric" value="${esc(o.n)}"></label><span class="sphint" id="spOeN"></span>
    <label class="f">Зал<select name="h">${cardsHall().map(([k,t])=>`<option value="${k}" ${o.h===k?"selected":""}>${esc(t)}</option>`).join("")}</select></label>
    <div class="spsurf" id="spOeImg"><b>Изображение</b><div class="row"><img class="spthumb" alt="" src="${esc(img?OE().url(img):origImg||app.objThumb(o))}">
      <span class="spb gh sm spfile">Загрузить новое<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Новое изображение предмета"></span>
      ${img?`<button type="button" class="spb gh sm" data-keep>${orig?"Вернуть изображение книги":"Убрать изображение"}</button>`:""}</div>${uploadBox()}<span class="sphint" id="spOeIH" aria-live="polite">${imgHint()}</span></div>
    <div class="spr"><label><input type="checkbox" name="hide" ${cur&&cur._hide?"checked":""}><span>скрыть предмет</span></label></div>
    <div class="sptools"><button type="submit" class="spb">Сохранить</button>${ed&&orig?`<button type="button" class="spb warn" data-reset>Вернуть как было</button>`:""}${ed&&!orig?`<button type="button" class="spb warn" data-reset>Удалить предмет</button>`:""}<button type="button" class="spb gh" data-x>Отмена</button></div>
    <span class="spmsg" role="alert" id="spOeM"></span></form>`;
  document.body.appendChild(dlg);const f=dlg.querySelector("form"),M=dlg.querySelector("#spOeM");
  const showN=()=>{const n=+f.n.value,e=app.BY[n];dlg.querySelector("#spOeN").textContent=e?app.lab(n)+" · "+e.t:"Нет записи с таким номером."};showN();f.n.oninput=showN;
  /* этап 12: загруженная, но не сохранённая картинка не остаётся в хранилище */
  const upl=new Set();const close=()=>{if(!dlg.isConnected)return;const drop=[...upl].filter(p=>!(ed&&ed.img===p));if(drop.length)B().removeImages(drop).catch(()=>{});dlg.remove();document.removeEventListener("keydown",onKey,true);if(opener&&opener.isConnected)try{opener.focus()}catch(e){}};
  const onKey=ev=>{if(ev.key==="Escape"){ev.stopPropagation();close()}else if(ev.key==="Tab"){const fs=[...dlg.querySelectorAll("button,input,select,textarea")].filter(x=>!x.disabled&&x.offsetParent);if(!fs.length)return;const a=fs[0],z=fs[fs.length-1];if(ev.shiftKey&&document.activeElement===a){ev.preventDefault();z.focus()}else if(!ev.shiftKey&&document.activeElement===z){ev.preventDefault();a.focus()}}};
  document.addEventListener("keydown",onKey,true);dlg.addEventListener("pointerdown",ev=>{if(ev.target===dlg)close()});dlg.querySelectorAll("[data-x]").forEach(b=>b.onclick=close);
  const box=dlg.querySelector("#spOeImg");const kb=box.querySelector("[data-keep]");const upHint=()=>{const e=box.querySelector("#spOeIH");if(e)e.textContent=imgHint()};if(kb)kb.onclick=()=>{img="";box.querySelector(".spthumb").src=origImg||app.objThumb(orig||o);kb.remove();upHint()};
  box.querySelector("input[type=file]").onchange=async ev=>{const file=ev.target.files&&ev.target.files[0];ev.target.value="";if(!file)return;const sb=f.querySelector("[type=submit]");sb.disabled=true;
    await runUpload(box,file,{book:true},async r=>{img=r.path;upl.add(r.path);box.querySelector(".spthumb").src=r.url;upHint()});sb.disabled=false};
  /* этап 12: после сохранения открытый 3D-музей перезапускается с правками (посетитель остаётся на месте) */
  const finish=async t=>{try{app.applyEdits(await OE().load({fresh:true}))}catch(e){}const re=app.remountMuseum?app.remountMuseum():false;setMsg(M,t+(re?" Музей перезапущен с изменениями.":""));if(after)after();setTimeout(close,600)};
  const rs=dlg.querySelector("[data-reset]");if(rs)rs.onclick=async()=>{if(!confirmTwice(rs,"Точно? Нажмите ещё раз"))return;rs.disabled=true;try{await OE().remove(id);if(ed&&ed.img)B().removeImages([ed.img]).catch(()=>{});await finish(orig?"Возвращено как было.":"Предмет удалён.")}catch(e){rs.disabled=false;setMsg(M,msg(e),true)}};
  f.onsubmit=async ev=>{ev.preventDefault();const name=f.name.value.trim(),ret=f.ret.value,n=+f.n.value,h=f.h.value,hide=f.hide.checked;
    if(!name){setMsg(M,"Нужно название.",true);f.name.focus();return}if(!app.BY[n]){setMsg(M,"Нет записи с таким номером.",true);f.n.focus();return}
    let data;if(orig){data={};if(name!==orig.name)data.name=name;if(ret!==(orig.ret||""))data.ret=ret;if(n!==orig.n)data.n=n;if(h!==orig.h)data.h=h;if(img)data.img=img;if(hide)data.hide=true;if(ed&&ed.pos)data.pos=ed.pos}
    else{data={new:true,name,ret,n,h};if(img)data.img=img;if(hide)data.hide=true;if(ed&&ed.pos)data.pos=ed.pos}
    const b=f.querySelector("[type=submit]");b.disabled=true;
    try{const oid=id||newId();if(orig&&!Object.keys(data).length){if(ed)await OE().remove(oid)}else await OE().save(oid,data);
      if(ed&&ed.img&&ed.img!==img)B().removeImages([ed.img]).catch(()=>{});upl.delete(img);
      await finish("Сохранено.")}catch(e){b.disabled=false;setMsg(M,msg(e),true)}};
  f.name.focus()}
async function cardHook(ov,o){const m=await me();if(!m.owner||!ov.isConnected)return;const head=ov.querySelector(".head");if(!head||head.querySelector("[data-spoe]"))return;
  const b=document.createElement("button");b.type="button";b.className="x";b.dataset.spoe="1";b.textContent="изменить";b.style.cssText="margin:-10px 10px -10px auto;min-height:44px;min-width:44px;padding:0 8px;color:var(--stamp);font-weight:600";b.setAttribute("aria-label","Изменить предмет: "+o.name);
  b.onclick=ev=>{ev.stopPropagation();ov.remove();objEditor(o.id)};head.insertBefore(b,head.querySelector(".x"))}

/* ---------- этап 8, часть 2: 3D — этаж посетителей (коридор с дверями), комнаты, лифт, карточка предмета ---------- */
function nav3d(floor,id){floor=String(floor);const h=id?"space-"+id:"floor-"+(floor==="-1"?"m1":floor)+"/3d";try{if(location.hash!=="#"+h)history.pushState(null,"","#"+h)}catch(e){}return world3d(floor,id||null)}
function liftGo(t){t=String(t||"");if(t==="book"){A().go("museum");return}if(t==="inf"){A().go("floor:inf");return}if(FL_ORDER.indexOf(t)>=0)nav3d(t)}
async function enterSpace(id){const v=page("museum",`<div id="spBody"><p class="sphint">Загружаем…</p></div>`);let s;
  try{s=await B().get(id)}catch(e){const b=v.querySelector("#spBody");if(b&&b.isConnected){b.innerHTML=`<div class="page-head"><div class="eyebrow">Пространства посетителей</div><h2>Не найдено</h2></div><p class="spmsg err" role="alert">${esc(e.code==="not_found"?"Пространство не найдено, ещё на проверке или скрыто. Войти в него могут только автор и автор сайта.":msg(e))}</p><div class="sptools"><button type="button" class="spb gh" id="spHome">На главную</button></div>`;b.querySelector("#spHome").onclick=()=>A().go("home")}return}
  if(!v.isConnected||!(location.hash==="#space-"+id))return;
  /* этап 13: зал автора — ветка музея книги: открываем музей и входим в зал */
  if(s.kind==="hall"&&s.hall&&s.hall.dock&&s.hall.dock.hall){const app=A();if(app.enterBranch){if(!app.adminHalls().some(x=>x.id===s.id))try{await app.reloadAdminHalls()}catch(e){}app.enterBranch(s.id);return}}
  return world3d(s.floor,id,s)}
async function world3d(floor,enterId,pre){floor=String(floor);const app=A();if(!B())return;
  const v=page("museum",`<div class="page-head"><div class="eyebrow">${esc(flName(floor))} · пространства посетителей · 3D</div><h2 id="w3h">${esc(pre?pre.title:"Пройти по этажу")}</h2><div class="sub">Коридор с дверями: за каждой — комната посетителя. Лифт в лобби везёт на другие этажи и в музей книги.</div></div>
   <div class="sptools"><button type="button" class="spb gh" id="w3back">${esc(floor==="-1"?"К музею книги":"К странице этажа "+flab(floor))}</button>${enterId?`<button type="button" class="spb gh" id="w3plan">План и список предметов</button>`:""}<span class="spmsg" id="w3msg" role="status"></span></div><div id="w3"><p class="sphint">Загружаем этаж…</p></div>`);
  const host=v.querySelector("#w3");v.querySelector("#w3back").onclick=()=>app.go(floor==="-1"?"museum":"floor:"+floor);
  if(enterId)v.querySelector("#w3plan").onclick=()=>nav("space-plan-"+enterId);
  let rows;try{rows=await B().world(floor)}catch(e){if(host.isConnected)host.innerHTML=`<p class="spmsg err" role="alert">${esc(msg(e))}</p>`;return}
  if(enterId&&!rows.some(x=>x.id===enterId)){try{const s=pre||await B().get(enterId);if(s&&s.floor===floor)rows.push(s)}catch(e){}}
  if(!host.isConnected)return;
  if(!window.Museum){host.innerHTML=`<p class="sphint">Модуль музея не загрузился.</p>`;return}
  host.innerHTML="";const stop=Museum.mount(host,{world:{floor,spaces:rows,enter:enterId||null,url:p=>B().url(p),onObj:(s,o,op)=>objCard(s,o,op),onLift:t=>liftGo(t),
      save:(s,o,place)=>B().place(o.id,place).then(r=>{dropCache();return r}),msg:e=>msg(e)},texUrl:app.texUrl||null,multi:window.Live?Live.museum():null});
  app.cleanup().push(stop);if(window.Live){const off=Live.panel(host,()=>window.__curHall||"",()=>window.__curHallName||"");app.cleanup().push(off)}
  window.__w3={floor,n:rows.length,enter:enterId||null}}
/* карточка предмета пространства: название, описание, изображение (на весь экран — просмотрщик сайта), пространство и автор */
function objCard(s,o,opener){css();document.querySelectorAll(".overlay").forEach(x=>x.remove());const url=o.img?B().url(o.img):"";
  const ov=document.createElement("div");ov.className="overlay";
  ov.innerHTML=`<div class="card spocard" role="dialog" aria-modal="true" aria-label="${esc(o.name)}"><div class="phw"><img class="ph" alt="${esc(o.name)}" src="${url?esc(url):placeholder(o.name)}">${url?`<button type="button" class="phx" aria-label="${esc("Открыть изображение на весь экран: "+o.name)}">на весь экран</button>`:""}</div>
   <div class="head"><span>${esc(o.place&&o.place.kind==="ped"?"Предмет на постаменте":"Картина на стене")}</span><button class="x" type="button">закрыть ✕</button></div>
   <dl><dt>Предмет</dt><dd>${esc(o.name)}</dd>${o.descr?`<dt>Описание</dt><dd style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(o.descr)}</dd>`:""}<dt>Пространство</dt><dd>${esc(s.title)}</dd><dt>Автор</dt><dd>${esc(s.author||"посетитель")}</dd></dl></div>`;
  document.body.appendChild(ov);const close=()=>{ov.remove();if(opener&&opener.isConnected)try{opener.focus({preventScroll:true})}catch(e){}};
  ov.addEventListener("click",ev=>{if(ev.target===ov||ev.target.closest(".x"))close()});ov.addEventListener("keydown",ev=>{if(ev.key==="Escape"){ev.preventDefault();close()}ev.stopPropagation()});
  if(url){const full=()=>A().lightbox(url,o.name,ov.querySelector(".phx"));ov.querySelector(".phx").onclick=full;ov.querySelector(".ph").onclick=full}
  ov.querySelector(".x").focus()}
return {route,floorHook,museumHook,clubHook,cardHook,objEditor,nav,_cache:LC,world3d,liftGo,nav3d,enterSpace,objCard};
})();

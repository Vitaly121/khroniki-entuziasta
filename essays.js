/* Этап 11 · Г: философские эссе в «Клубе энтузиастов». Данные — essays/index.json и готовые фрагменты essays/NN-slug.html (не правятся).
   Список с лидом и поиском, чтение полного текста (фрагмент грузится лениво и вставляется после очистки: без скриптов, стилей,
   встраиваемых объектов и обработчиков событий), «назад к списку», адреса #club/essay и #club/essay-NN.
   До решения автора всё закрыто флагом window.SITE_FLAGS.essays (по умолчанию false): без него ни раздела, ни кнопки, ни полки в музее. */
window.Essays=(function(){
"use strict";
const on=()=>!!(window.SITE_FLAGS&&window.SITE_FLAGS.essays);
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const KIND={essay:{t:"эссе",c:"#2F6F6A"},scheme:{t:"схема",c:"#27489A"},notes:{t:"записи",c:"#9A6B2E"}};
const kindOf=k=>KIND[k]||KIND.essay;
let idx=null,idxP=null;const body={};
function load(){if(idx)return Promise.resolve(idx);if(!idxP)idxP=fetch("essays/index.json",{cache:"no-cache"}).then(r=>{if(!r.ok)throw new Error("http "+r.status);return r.json()})
  .then(L=>{idx=(Array.isArray(L)?L:[]).filter(e=>e&&e.id&&/^[0-9a-z-]+\.html$/.test(e.file||"")).map(e=>Object.assign({},e,{nn:String(e.id).slice(0,2)}));return idx}).catch(e=>{idxP=null;throw e});return idxP}
const byNN=nn=>(idx||[]).find(e=>e.nn===String(nn).padStart(2,"0"));
/* очистка фрагмента: шаблон не выполняет скрипты; затем вычищаем всё лишнее и вставляем строкой */
const DROP="script,style,link,meta,iframe,object,embed,frame,frameset,form,input,button,textarea,select,svg,math,base,template,noscript,video,audio,source,img,picture";
function clean(html){const t=document.createElement("template");t.innerHTML=String(html||"");const root=t.content;
  root.querySelectorAll(DROP).forEach(n=>n.remove());
  root.querySelectorAll("*").forEach(n=>{[...n.attributes].forEach(a=>{const k=a.name.toLowerCase(),v=a.value;
      if(/^on/.test(k)||k==="style"||k==="srcdoc"||k==="id"||(k==="href"&&!/^(https?:|mailto:|#)/i.test(v.trim()))||!/^(href|title|colspan|rowspan|target|rel)$/.test(k))n.removeAttribute(a.name)});
    if(n.tagName==="A"){if(/^https?:/i.test(n.getAttribute("href")||"")){n.setAttribute("target","_blank");n.setAttribute("rel","noopener noreferrer")}else if(!n.getAttribute("href"))n.replaceWith(...n.childNodes)}});
  const d=document.createElement("div");d.appendChild(root.cloneNode(true));return d.innerHTML}
function css(){if(document.getElementById("esCss"))return;const s=document.createElement("style");s.id="esCss";s.textContent=`
.es-tools{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:0 0 18px}
.es-tools input{flex:1 1 260px;min-width:0;font:inherit;font-size:16px;padding:9px 12px;border:1px solid var(--line);background:var(--sheet);color:var(--ink);border-radius:6px}
.es-tools input:focus-visible,.es-card:focus-visible,.es-back:focus-visible,.es-read a:focus-visible{outline:2px solid var(--stamp);outline-offset:2px}
.es-count{font-family:var(--f-mono);font-size:12px;color:var(--muted)}
.es-grp{margin:26px 0 10px;font-family:var(--f-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.es-list{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr))}
.es-card{display:flex;flex-direction:column;gap:6px;text-align:left;border:1px solid var(--line);border-left:4px solid var(--es-c,#2F6F6A);background:var(--sheet);color:var(--ink);padding:14px 16px;cursor:pointer;font:inherit;text-decoration:none;min-width:0}
.es-card:hover{border-color:var(--stamp);border-left-color:var(--es-c,#2F6F6A)}
.es-card b{font-family:var(--f-body);font-weight:400;font-size:19px;line-height:1.25;overflow-wrap:anywhere}
.es-card span{font-size:14px;line-height:1.5;color:var(--muted)}
.es-meta{font-family:var(--f-mono);font-size:11px;color:var(--muted);letter-spacing:.04em}
.es-meta i{font-style:normal;color:var(--es-c,#2F6F6A)}
.es-back{all:unset;cursor:pointer;font-family:var(--f-mono);font-size:12px;color:var(--stamp);padding:6px 0;display:inline-block}
.es-note{border-left:3px solid var(--line);padding:4px 12px;color:var(--muted);font-size:13.5px;max-width:68ch;margin:6px 0 18px}
.es-read{font-family:var(--f-body);font-size:18px;line-height:1.68;max-width:68ch;color:var(--ink);overflow-wrap:anywhere}
.es-read h2{font-family:var(--f-ui)!important;font-weight:600;font-size:24px;line-height:1.25;margin:1.8em 0 .5em}
.es-read h3{font-family:var(--f-ui);font-weight:600;font-size:19px;line-height:1.3;margin:1.5em 0 .4em}
.es-read h4{font-family:var(--f-ui);font-weight:600;font-size:16px;margin:1.3em 0 .3em}
.es-read p{margin:0 0 1em}.es-read ul,.es-read ol{margin:0 0 1em;padding-left:1.4em}.es-read li{margin:.25em 0}
.es-read blockquote{margin:1em 0;padding:2px 0 2px 16px;border-left:3px solid var(--stamp);color:var(--muted)}
.es-read a{color:var(--stamp);text-underline-offset:2px}
.es-read code,.es-read pre{font-family:var(--f-mono);font-size:.82em;background:var(--line-soft);padding:1px 4px;border-radius:3px}
.es-read pre{padding:10px;overflow:auto;white-space:pre-wrap}
.es-read .es-tw{overflow-x:auto;margin:0 0 1.2em;max-width:100%}
.es-read table{border-collapse:collapse;font-family:var(--f-ui);font-size:14px;line-height:1.45;min-width:100%}
.es-read th,.es-read td{border:1px solid var(--line);padding:6px 8px;vertical-align:top;text-align:left}
.es-read th{background:var(--line-soft);font-weight:600}
.es-read sup{font-size:.7em}
.es-end{display:flex;gap:10px;flex-wrap:wrap;margin:28px 0 8px;padding-top:14px;border-top:1px solid var(--line);max-width:68ch}
.es-btn{border:1px solid var(--ink);background:none;color:var(--ink);border-radius:6px;padding:7px 12px;font:inherit;font-size:13px;cursor:pointer}
.es-btn:focus-visible{outline:2px solid var(--stamp);outline-offset:2px}
#esH:focus{outline:none}
@media (max-width:700px){.es-read{font-size:17px}}`;document.head.appendChild(s)}
const A=()=>window.__APP;
let q="";
function setHash(h){const cur=(location.hash||"").slice(1);if(cur===h)return;try{history.pushState(null,"","#"+h)}catch(e){}}
function head(sub){return `<div class="page-head"><div class="eyebrow">Клуб энтузиастов · философские эссе</div><h2 tabindex="-1" id="esH">${sub?esc(sub):"Эссе"}</h2>`}
function cardHTML(e){const k=kindOf(e.kind);return `<a class="es-card" href="#club/essay-${esc(e.nn)}" data-es="${esc(e.nn)}" style="--es-c:${k.c}"><span class="es-meta">${esc(e.nn)} · <i>${k.t}</i> · ${esc(e.minutes||1)} мин</span><b>${esc(e.title)}</b><span>${esc(e.lede||"")}</span></a>`}
function drawList(el){const words=q.toLowerCase().split(/\s+/).filter(Boolean);
  const L=(idx||[]).filter(e=>{const s=(e.title+" "+(e.lede||"")+" "+(e.group||"")+" "+kindOf(e.kind).t).toLowerCase();return words.every(w=>s.includes(w))});
  const groups=[];L.forEach(e=>{let g=groups.find(x=>x.g===e.group);if(!g)groups.push(g={g:e.group,L:[]});g.L.push(e)});
  el.querySelector(".es-count").textContent=L.length===(idx||[]).length?`всего ${L.length}`:`найдено ${L.length} из ${(idx||[]).length}`;
  el.querySelector("#esList").innerHTML=groups.map(g=>`<div class="es-grp">${esc(g.g||"")}</div><div class="es-list">${g.L.map(cardHTML).join("")}</div>`).join("")||`<p class="hint">Ничего не нашлось. Попробуйте другое слово.</p>`;
  el.querySelectorAll("[data-es]").forEach(a=>a.onclick=ev=>{ev.preventDefault();show(a.dataset.es)})}
function off(){const app=A();app.clearView();app.setNav("club");app.view.innerHTML=`<div class="page-head"><div class="eyebrow">Клуб энтузиастов</div><h2>Эссе пока закрыты</h2><div class="sub">Раздел появится, когда автор его откроет.</div></div><button type="button" class="es-btn" id="esClub">← В клуб</button>`;
  document.getElementById("esClub").onclick=()=>app.go("club")}
/* nn — номер эссе («07») или пусто для списка; focus — куда вернуть фокус в списке */
async function show(nn,focus){const app=A();if(!app)return;if(!on()){off();return}css();
  setHash(nn?"club/essay-"+String(nn).padStart(2,"0"):"club/essay");app.clearView();app.setNav("club");
  app.view.innerHTML=`<div data-essayview="1"></div>${head(nn?"":"")}<div class="sub">Тексты, на которые опирается роман: вера, двойники, мозг и ИИ, поколения, красота.</div></div><p class="hint loading">Загружается список…</p>`;
  try{await load()}catch(e){app.view.querySelector(".loading").textContent="Список эссе не загрузился. Проверьте связь и попробуйте ещё раз.";return}
  if(!document.querySelector('[data-essayview="1"]'))return;
  if(nn){const e=byNN(nn);if(!e){app.view.querySelector(".loading").textContent="Такого эссе нет.";return}return read(e)}
  app.view.innerHTML=`<div data-essayview="1"></div>${head()}<div class="sub">Тексты, на которые опирается роман: вера, двойники, мозг и ИИ, поколения, красота. ${idx.length} текстов; полный текст открывается по щелчку.</div></div>
   <div class="es-tools" role="search"><label class="sr" for="esQ" style="position:absolute;left:-9999px">Поиск по эссе</label><input id="esQ" type="search" placeholder="Поиск: название, тема, слово из лида" value="${esc(q)}" autocomplete="off"><span class="es-count" aria-live="polite"></span><button type="button" class="es-btn" id="esClub">← В клуб</button></div>
   <div id="esList"></div>`;
  const el=app.view;drawList(el);const inp=el.querySelector("#esQ");let t=null;inp.oninput=()=>{q=inp.value;clearTimeout(t);t=setTimeout(()=>drawList(el),140)};
  el.querySelector("#esClub").onclick=()=>app.go("club");
  const f=focus&&el.querySelector(`[data-es="${focus}"]`);if(f){f.focus({preventScroll:true});f.scrollIntoView({block:"center"})}}
async function read(e){const app=A(),k=kindOf(e.kind);const i=idx.indexOf(e),prev=idx[i-1],next=idx[i+1];
  app.view.innerHTML=`<div data-essayview="1"></div><button type="button" class="es-back" id="esBack">← К списку эссе</button>
   <div class="page-head"><div class="eyebrow">${esc(e.group||"")} · <span style="color:${k.c}">${k.t}</span> · ${esc(e.minutes||1)} мин чтения · № ${esc(e.nn)}</div><h2 tabindex="-1" id="esH">${esc(e.title)}</h2></div>
   ${e.note?`<p class="es-note">${esc(e.note)}</p>`:""}
   <article class="es-read" id="esText" aria-busy="true"><p class="hint loading">Загружается текст…</p></article>
   <nav class="es-end" aria-label="Другие эссе"><button type="button" class="es-btn" id="esBack2">← К списку</button>${prev?`<a class="es-btn" href="#club/essay-${prev.nn}" data-es="${prev.nn}">‹ ${esc(prev.title.slice(0,40))}${prev.title.length>40?"…":""}</a>`:""}${next?`<a class="es-btn" href="#club/essay-${next.nn}" data-es="${next.nn}">${esc(next.title.slice(0,40))}${next.title.length>40?"…":""} ›</a>`:""}</nav>`;
  const back=()=>show("",e.nn);app.view.querySelector("#esBack").onclick=back;app.view.querySelector("#esBack2").onclick=back;
  app.view.querySelectorAll(".es-end [data-es]").forEach(a=>a.onclick=ev=>{ev.preventDefault();show(a.dataset.es)});
  const h=app.view.querySelector("#esH");try{h.focus({preventScroll:true})}catch(_){}window.scrollTo(0,0);
  const art=app.view.querySelector("#esText");
  try{if(!(e.file in body)){const r=await fetch("essays/"+e.file);if(!r.ok)throw new Error("http "+r.status);body[e.file]=clean(await r.text())}
    if(!art.isConnected)return;art.innerHTML="";art.insertAdjacentHTML("beforeend",body[e.file]);
    art.querySelectorAll("table").forEach(tb=>{const w=document.createElement("div");w.className="es-tw";w.tabIndex=0;w.setAttribute("role","region");w.setAttribute("aria-label","Таблица");tb.replaceWith(w);w.appendChild(tb)});
    art.removeAttribute("aria-busy")}
  catch(err){if(art.isConnected){art.innerHTML=`<p class="hint">Текст не загрузился. <button type="button" class="es-btn" id="esRetry">Ещё раз</button></p>`;art.querySelector("#esRetry").onclick=()=>read(e)}}}
/* адрес: club/essay, club/essay-07 */
function route(h){const m=String(h||"").match(/^club\/essay(?:-(\d{1,2}))?$/);if(!m)return false;show(m[1]?m[1].padStart(2,"0"):"");return true}
/* Escape в чтении — назад к списку (если фокус не в поле ввода) */
document.addEventListener("keydown",ev=>{if(ev.key!=="Escape"||ev.defaultPrevented)return;const b=document.getElementById("esBack");if(!b||!b.isConnected)return;const t=ev.target;if(t&&/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))return;if(document.querySelector(".lbx,.be-ov"))return;ev.preventDefault();b.click()});
/* кнопка «Эссе» в «Клубе» */
function clubButton(){return on()?`<section class="pblock" id="esBlock"><div class="flsec"><h3>Философские эссе</h3><span class="hint">Двадцать восемь текстов, на которые опирается роман. Их же — на полке в зале «Клуб энтузиастов» музея.</span></div><div class="flrow"><a class="flbtn" href="#club/essay" id="esOpen">Эссе →</a></div></section>`:""}
function wireClub(root){const b=(root||document).querySelector("#esOpen");if(b)b.onclick=ev=>{ev.preventDefault();show("")}}
return {enabled:on,load,show,route,clean,clubButton,wireClub,KIND,get list(){return idx}};
})();

/* Дата сайта: месяц книги как состояние всего сайта (этап 15).
   blk — номер блока из BOOKDATA.stats.blocks (0…17) или null — «весь год», как было раньше.
   От даты зависят: лента, переписка, музей, клуб, «онлайн», чаты с копиями. Ползунок в «Счёте» двигает её же. */
window.SiteDate=(function(){
"use strict";
const KEY="cv2_date";
/* конец блока: год*100+месяц */
const YM=[202703,202703,202704,202705,202705,202706,202707,202708,202709,202710,202712,202802,202803,202804,202804,202805,202805,202805];
const FULL=["15 марта 2027","март 2027","апрель 2027","май 2027","конец мая 2027","июнь 2027","июль 2027","август 2027","сентябрь 2027","октябрь 2027","ноябрь–декабрь 2027","январь–февраль 2028","март 2028","апрель 2028","конец апреля 2028","май 2028","май 2028 · переход","конец мая 2028"];
const NB=YM.length;
let blk=null;
try{const v=localStorage.getItem(KEY);if(v!=null&&v!==""&&isFinite(+v))blk=Math.max(0,Math.min(NB-1,Math.round(+v)))}catch(e){}
const L=new Set();
const book=()=>(window.BOOKDATA||{}).book||[];
const stats=()=>(window.BOOKDATA||{}).stats||{blocks:[]};
let _max=null;
function maxN(b){if(!_max){_max=new Array(NB).fill(0);book().forEach(e=>{if(e.b>=0&&e.b<NB)_max[e.b]=Math.max(_max[e.b],e.n)});for(let i=1;i<NB;i++)_max[i]=Math.max(_max[i],_max[i-1])}return _max[b]||0}
const all=()=>blk==null;
const n=()=>blk==null?Infinity:maxN(blk);
const has=x=>blk==null||+x<=n();
const ym=()=>blk==null?999999:YM[blk];
const label=()=>blk==null?"весь год":FULL[blk];
const short=()=>blk==null?"весь год":(stats().blocks[blk]||FULL[blk]);
/* первая запись, где двойник книги уже собран */
const BORN={v1:4,father:44,team:68,vn:82,ncopy:85,vv:93,v2:107,vm:126,vl:133,vera:152};
const born=k=>!(k in BORN)||has(BORN[k]);
/* кто ведёт связь (строка «Кривой растворения» из stats.js): s — сам, m — сам и копия, c — копия, x — связи нет */
function lead(name){const D=(window.Stats&&window.Stats.DISS)||[];const row=D.find(r=>r[0]===name);if(!row)return null;let st=null;row[1].forEach(([a,k])=>{if(has(a))st=k});return st}
const LEADT={s:"Viktor",m:"Viktor и копия",c:"копия",x:"связи нет"};
function counts(){const D=(window.Stats&&window.Stats.DISS)||[];const c={s:0,m:0,c:0,x:0,none:0};D.forEach(r=>{const k=lead(r[0]);c[k||"none"]++});return c}
/* дата в подписи дня переписки: «сентябрь 2027», «7 апреля 2028», «весна 2027» → год*100+месяц */
const MONS=[["январ",1],["феврал",2],["март",3],["апрел",4],["ма[йя]",5],["июн",6],["июл",7],["август",8],["сентябр",9],["октябр",10],["ноябр",11],["декабр",12],["янв\\.",1],["февр?\\.",2],["апр\\.",4],["сент?\\.",9],["окт\\.",10],["нояб?\\.",11],["дек\\.",12]];
const SEAS=[["весн",5],["лет[оа]",8],["осен",11]];
function ymOf(t){t=String(t||"").toLowerCase();for(const [m,i] of MONS){const r=new RegExp("(?:^|[^а-яё])"+m+"[а-яё]*\\s+(20\\d\\d)").exec(t);if(r)return +r[1]*100+i}
  for(const [m,i] of SEAS){const r=new RegExp(m+"[а-яё]*\\s+(20\\d\\d)").exec(t);if(r)return +r[1]*100+i}return null}
/* обрезать ленту сообщений по дате: всё, что после первой «даты дня» позже выбранного месяца, скрыто. Возвращает {shown,hidden,last,day} */
function cut(root){let vis=true,shown=0,hidden=0,last="",day="";
  [...root.children].forEach(el=>{if(el.classList.contains("day")){const o=el.querySelector("[data-open]");
      if(o&&isFinite(+o.dataset.open))vis=has(+o.dataset.open);else{const y=ymOf(el.textContent);if(y!=null)vis=y<=ym()}
      if(vis)day=el.textContent.split("·")[0].trim()}
    el.hidden=!vis;if(!el.classList.contains("day")){if(vis){shown++;const t=el.cloneNode(true);t.querySelectorAll(".meta,.who").forEach(x=>x.remove());const s=t.textContent.replace(/\s+/g," ").trim();if(s)last=s}else hidden++}});
  return {shown,hidden,last,day}}
function set(b,opt){const nb=b==null||b>=NB?null:Math.max(0,Math.min(NB-1,Math.round(+b)||0));if(nb===blk)return;blk=nb;
  try{if(blk==null)localStorage.removeItem(KEY);else localStorage.setItem(KEY,String(blk))}catch(e){}
  paint();L.forEach(f=>{try{f(blk,opt||{})}catch(e){}})}
const on=f=>{L.add(f);return ()=>L.delete(f)};
/* ---------- шапка: дата на всех страницах ---------- */
function css(){if(document.getElementById("sdCss"))return;const s=document.createElement("style");s.id="sdCss";s.textContent=`
.datebox{position:relative;align-self:center;font-family:var(--f-ui)}
.datebox>button{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line);background:var(--sheet);color:var(--ink);border-radius:4px;padding:5px 10px;font-size:13px;cursor:pointer;white-space:nowrap}
.datebox>button i{width:7px;height:7px;border-radius:50%;background:var(--stamp);display:inline-block}
.datebox>button[data-all="1"] i{background:none;border:1.5px solid var(--muted)}
.datebox>button small{font-family:var(--f-mono);font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.datepop{position:absolute;right:0;top:calc(100% + 8px);z-index:50;width:min(340px,calc(100vw - 32px));background:var(--sheet);border:1px solid var(--line);box-shadow:0 18px 40px -22px rgba(0,0,0,.55);padding:14px 16px;display:grid;gap:10px}
.datepop b{font-size:17px;font-weight:600}
.datepop input[type=range]{width:100%;accent-color:var(--stamp);margin:0}
.datepop .row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.datepop .row button{border:1px solid var(--line);background:var(--paper);color:var(--ink);border-radius:4px;min-width:36px;min-height:34px;padding:4px 10px;font-size:13px;cursor:pointer}
.datepop .row button[aria-pressed="true"]{border-color:var(--stamp);color:var(--stamp)}
.datepop p{margin:0;font-size:12.5px;line-height:1.45;color:var(--muted)}
.sd-strip{font-family:var(--f-mono);font-size:11.5px;letter-spacing:.02em;color:var(--muted);border:1px solid var(--line-soft,var(--line));border-left:3px solid var(--stamp);padding:7px 11px;margin:0 0 14px;display:flex;gap:6px 18px;flex-wrap:wrap}
.sd-strip b{color:var(--ink);font-weight:600}
.datepop[hidden]{display:none}
.disrow{display:flex;align-items:flex-start;gap:12px;padding:9px 14px 5px;font-size:12.5px;color:var(--muted);border-top:1px solid var(--line-soft,var(--line))}
.disrow label{font-family:var(--f-mono);font-size:10.5px;letter-spacing:.07em;text-transform:uppercase;padding-top:2px}
.disw{display:grid;width:min(200px,46vw)}
.disw input{width:100%;accent-color:var(--stamp);margin:0}
.disrow output{font-family:var(--f-mono);font-size:12px;color:var(--ink);min-width:40px}
.disticks{display:flex;justify-content:space-between;font-family:var(--f-mono);font-size:10px;padding:2px 2px 0}
.disticks i{font-style:normal}
.sd-later{margin:18px 0 0;font-size:13px;color:var(--muted)}
@media (max-width:600px){.datebox{position:absolute;left:12px;top:9px}.datebox>button{padding:5px 8px;font-size:12px}.datebox>button small{display:none}.datepop{left:0;right:auto}}`;document.head.appendChild(s)}
let box=null;
function paint(){if(!box)return;const b=box.querySelector("#dateBtn");b.dataset.all=blk==null?"1":"0";b.querySelector("span").textContent=short();
  const r=box.querySelector("#dateR");if(r){r.value=blk==null?NB:blk;box.querySelector("#dateV").textContent=label();box.querySelector("[data-all]").setAttribute("aria-pressed",String(blk==null))}}
function mount(){const nav=document.getElementById("nav");if(!nav||box)return;css();
  box=document.createElement("div");box.className="datebox";box.id="dateBox";
  box.innerHTML=`<button type="button" id="dateBtn" aria-haspopup="dialog" aria-expanded="false" title="Дата сайта: месяц книги, в котором вы находитесь"><i></i><small>дата</small><span></span></button>
   <div class="datepop" id="datePop" role="dialog" aria-label="Дата сайта" hidden><div class="eyebrow">Дата сайта</div><b id="dateV"></b>
    <input type="range" id="dateR" min="0" max="${NB}" step="1" aria-label="Месяц книги">
    <div class="row"><button type="button" data-d="-1" aria-label="Месяц назад">‹</button><button type="button" data-d="1" aria-label="Месяц вперёд">›</button><button type="button" data-all aria-pressed="false">весь год</button></div>
    <p>Переписка, музей, клуб и «онлайн» показывают выбранный месяц. «Весь год» — всё сразу.</p></div>`;
  nav.after(box);
  const btn=box.querySelector("#dateBtn"),pop=box.querySelector("#datePop"),r=box.querySelector("#dateR");
  const close=()=>{pop.hidden=true;btn.setAttribute("aria-expanded","false")};
  btn.onclick=()=>{pop.hidden=!pop.hidden;btn.setAttribute("aria-expanded",String(!pop.hidden));if(!pop.hidden)r.focus()};
  r.oninput=()=>set(+r.value>=NB?null:+r.value);
  box.querySelectorAll("[data-d]").forEach(x=>x.onclick=()=>{const c=blk==null?NB:blk,v=Math.max(0,Math.min(NB,c+ +x.dataset.d));set(v>=NB?null:v)});
  box.querySelector("[data-all]").onclick=()=>set(null);
  document.addEventListener("click",ev=>{if(!pop.hidden&&!box.contains(ev.target))close()});
  document.addEventListener("keydown",ev=>{if(ev.key==="Escape"&&!pop.hidden){close();btn.focus()}});
  paint()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount);else mount();
document.addEventListener("appready",mount);
return {get blk(){return blk},NB,all,n,has,ym,label,short,born,lead,leadText:k=>LEADT[k]||"",counts,ymOf,cut,set,on,css,BORN};
})();

/* Живое присутствие: кто сейчас на сайте, фигуры в музее, чат зала, вход в шапке.
   Комната (room) доступна вошедшим участникам сайта; по публичной ссылке человек ходит один. */
window.Live=(function(){
"use strict";
const L={pos:{},room:null,user:null,uid:null,names:{},me:{},tried:false,msgs:[],listeners:new Set()};
const COLS=["#2a78d6","#eb6834","#1baf7a","#e87ba4","#6250d6","#eda100","#008300","#e34948"];
/* жест посетителя в музее (необязательное поле g): принимаем только известные значения, остальное — «нет жеста» */
const gOf=v=>v==="wave"||v==="sit"?v:"";
/* облик фигуры (необязательное поле k, этап 6): ровно 40 знаков по образцу museum.js, всё прочее — «нет облика» (фигура цвета посетителя) */
const kOf=v=>typeof v==="string"&&/^[mf][sp][tn][hn][0-9a-f]{36}$/.test(v)?v:"";
const colOf=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return COLS[h%COLS.length]};
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const SITE="https://claude.ai/artifact/4RWqffDKeKBBeCbV3auAWo";
async function init(){if(L._p)return L._p;L._p=(async()=>{try{
  if(!(window.claude&&typeof window.claude.use==="function"))return;
  const [room,user]=await Promise.all([window.claude.use("room").catch(()=>null),window.claude.use("user").catch(()=>null)]);
  L.user=user;if(user&&user.id){try{L.uid=await user.id()}catch(e){}}
  if(user&&L.uid&&user.profiles){try{const p=await user.profiles([L.uid]);L.names[L.uid]=(p&&p[L.uid]&&p[L.uid].name)||""}catch(e){}}
  if(room){L.room=room;
    room.onPeers(ch=>{names(ch.peers.map(p=>p.by).filter(Boolean));emit()},()=>{});
    room.on("pos",m=>{if(m.sameTab)return;const d=m.data||{};if(d.place===null){delete L.pos[m.peer];emit();return}if(!isFinite(d.x)||!isFinite(d.z))return;const nw=!L.pos[m.peer];L.pos[m.peer]={peer:m.peer,by:m.by,kind:m.kind,isMe:m.isMe,sameTab:false,presence:{x:+d.x,z:+d.z,yaw:+d.yaw||0,hall:String(d.hall||"").slice(0,40),place:"museum",g:gOf(d.g),k:kOf(d.k),w:typeof d.w==="string"?d.w.slice(0,40):"",hn:typeof d.hn==="string"?d.hn.slice(0,60):""},at:Date.now()};if(m.by)names([m.by]);if(nw)emit()},()=>{});
    room.on("hallchat",m=>{const d=m.data||{};if(typeof d.text!=="string")return;L.msgs.push({peer:m.peer,by:m.by,me:m.sameTab,hall:String(d.hall||"").slice(0,40),text:d.text.slice(0,300),at:Date.now()});L.msgs=L.msgs.slice(-60);emit()},()=>{})}
 }catch(e){}finally{L.tried=true;header();emit()}})();return L._p}
async function names(ids){const need=ids.filter(i=>!(i in L.names));if(!need.length||!L.user||!L.user.profiles)return;try{const p=await L.user.profiles(need);need.forEach(i=>L.names[i]=(p&&p[i]&&p[i].name)||"")}catch(e){need.forEach(i=>L.names[i]="")}emit()}
function emit(){L.listeners.forEach(f=>{try{f()}catch(e){}});header()}
function on(f){L.listeners.add(f);return ()=>L.listeners.delete(f)}
const peers=()=>{if(!L.room)return [];const base=L.room.peers(),have=new Set(base.filter(p=>p.presence&&p.presence.place==="museum").map(p=>p.peer)),now=Date.now();
  Object.keys(L.pos).forEach(k=>{if(now-L.pos[k].at>6000)delete L.pos[k]});
  const extra=Object.values(L.pos).filter(p=>!have.has(p.peer));const out=base.filter(p=>!extra.some(e=>e.peer===p.peer));return out.concat(extra)};
const nameOf=p=>p.sameTab?"вы":(p.by&&L.names[p.by])||(p.presence&&typeof p.presence.nick==="string"&&p.presence.nick.slice(0,24))||"гость";
/* вход в шапке на всех страницах */
function header(){let el=document.getElementById("whoBox");const nav=document.getElementById("nav");if(!nav)return;
  if(!el){el=document.createElement("span");el.id="whoBox";el.className="whobox";nav.after(el)}
  const n=peers().filter(p=>p.kind==="viewer").length;
  if(L.uid){const nm=L.names[L.uid]||"вы";el.innerHTML=`<span class="whodot" style="background:${colOf(L.uid)}"></span><span class="whonm">${esc(nm)}</span>${n>1?`<span class="whon" title="Сейчас на сайте">${n} онлайн</span>`:""}`}
  else el.innerHTML=L.tried?`<a class="whoin" href="${SITE}" target="_blank" rel="noopener" title="${window.Backend?"Войдите или зарегистрируйтесь":"Откройте сайт в Claude и войдите в аккаунт"}: станут доступны агенты, залы, чаты и музей с другими людьми">Войти</a>`:""}
/* музей: что передаём и кого рисуем */
function museum(){init();let last=0,lastSent="",cur=null,lastPos=0;const hb=setInterval(()=>{if(L.room&&cur){L.room.presence(cur).catch(()=>{});L.room.emit("pos",cur).catch(()=>{})}},2000);
  return {
    tick(P,hall,ext){if(!L.room)return;const now=performance.now();if(now-last<110)return;last=now;
      const s={x:+P.x.toFixed(2),z:+P.z.toFixed(2),yaw:+P.yaw.toFixed(2),hall:String(hall||""),place:"museum"};const g=gOf(P.g);if(g)s.g=g;const lk=kOf(P.k);if(lk)s.k=lk;/* этап 8, часть 2: мир (этаж или пространство посетителя) и название зала — необязательные поля, старые клиенты их не знают */if(ext&&ext.w){s.w=String(ext.w).slice(0,40);if(ext.hn)s.hn=String(ext.hn).slice(0,60)}cur=s;if(now-lastPos>240){lastPos=now;L.room.emit("pos",s).catch(()=>{})}const k=JSON.stringify(s);if(k===lastSent)return;lastSent=k;L.room.presence(s).catch(()=>{})},
    leave(){clearInterval(hb);cur=null;if(L.room)L.room.emit("pos",{place:null}).catch(()=>{});if(L.room)L.room.presence({place:null,x:null,z:null,yaw:null,hall:null}).catch(()=>{})},
    others(world){return peers().filter(p=>!p.sameTab&&p.kind==="viewer"&&p.presence&&p.presence.place==="museum"&&isFinite(p.presence.x)&&isFinite(p.presence.z)&&(world===undefined||String(p.presence.w||"")===String(world||""))).map(p=>{
      /* реплика над фигурой (этап 7): последняя фраза посетителя — 30 с от времени сообщения (at); sayAt — это время, чтобы музей гасил пузырь вовремя */
      const say=[...L.msgs].reverse().find(m=>m.peer===p.peer&&Date.now()-m.at<SAY_MS);
      return {id:p.peer,name:nameOf(p),x:+p.presence.x,z:+p.presence.z,yaw:+p.presence.yaw||0,color:colOf(p.by||p.peer),say:say?say.text:"",sayAt:say?say.at:0,g:gOf(p.presence.g),k:kOf(p.presence.k),hall:String(p.presence.hall||""),w:String(p.presence.w||"")}})},
    /* своя последняя фраза (для пузыря над своей фигурой в виде из-за спины) */
    mine(){const m=[...L.msgs].reverse().find(m=>m.me);return m&&Date.now()-m.at<SAY_MS?{text:m.text,at:m.at}:null},
    /* этап 7: чат зала внутри музея (полноэкранный вид) — тот же канал, что и панель под музеем */
    chat(hall,n){const M=L.msgs.filter(m=>!hall||m.hall===hall).slice(-(n||5));
      return {room:!!L.room,note:L.room?"":NOROOM(),msgs:M.map(m=>({who:m.me?"вы":(m.by&&L.names[m.by])||"гость",me:!!m.me,text:m.text,at:m.at}))}},
    async say(hall,text){const t=String(text||"").trim().slice(0,300);if(!t)return {ok:false,note:""};if(!L.room)return {ok:false,note:NOROOM()};
      try{await L.room.emit("hallchat",{hall:String(hall||"").slice(0,40),text:t});return {ok:true}}catch(e){return {ok:false,note:e&&e.code==="not_permitted"?NOPERM:"Сообщение не ушло."}}},
    sub(f){return on(f)}}}
const SAY_MS=30000;
const NOPERM="Писать в чат могут участники, которым автор дал доступ.";
const NOROOM=()=>L.tried?"Других посетителей видят вошедшие участники сайта. Сейчас вы ходите один.":"Подключаемся…";
/* панель под музеем: кто здесь и чат зала */
function panel(host,getHall,getName){init();const box=document.createElement("div");box.className="livepanel";host.after(box);
  const draw=()=>{if(!box.isConnected)return;const P=peers().filter(p=>p.kind==="viewer"&&p.presence&&p.presence.place==="museum");const hall=getHall(),hallN=(getName&&getName())||hall;
    if(!L.room){box.innerHTML=`<div class="lvhead"><b>В музее вместе</b><span class="hint">${L.tried?"Других посетителей видят вошедшие участники сайта. Сейчас вы ходите один.":"Подключаемся…"}</span>${L.tried&&!L.uid?` <a class="whoin" href="${SITE}" target="_blank" rel="noopener">Войти</a>`:""}</div>`;return}
    const M=L.msgs.filter(m=>!hall||m.hall===hall).slice(-12);
    const typing=box.querySelector("input")&&box.querySelector("input").value;const focused=document.activeElement&&box.contains(document.activeElement);
    const people=`<div class="lvpeople">${P.map(p=>`<span class="lvp"><i style="background:${colOf(p.by||p.peer)}"></i>${esc(nameOf(p))}${p.presence.hall&&!p.sameTab?` · ${esc(p.presence.hn||p.presence.hall)}`:""}</span>`).join("")||`<span class="hint">Пока вы одни.</span>`}</div>`;
    if(box.querySelector(".lvlog")){box.querySelector(".lvhead b").textContent="В музее сейчас: "+P.length;box.querySelector(".lvpeople").outerHTML=people;box.querySelector(".lvlog").innerHTML=log(M);box.querySelector(".lvhall").textContent=hall?"Чат зала «"+hallN+"»":"Чат музея";box.querySelector(".lvdbg").textContent=dbg();return}
    box.innerHTML=`<div class="lvhead"><b>В музее сейчас: ${P.length}</b></div>${people}<div class="lvhall">${hall?"Чат зала «"+esc(hallN)+"»":"Чат музея"}</div><div class="lvlog">${log(M)}</div>
     <form class="trform" id="lvF"><input maxlength="300" placeholder="Сказать тем, кто в этом зале" aria-label="Сообщение в чат зала"><button type="submit">Сказать</button></form><span class="hint" id="lvM"></span><div class="lvdbg"></div>`;box.querySelector(".lvdbg").textContent=dbg();
    box.querySelector("#lvF").onsubmit=async ev=>{ev.preventDefault();const inp=box.querySelector("#lvF input"),t=inp.value.trim();if(!t)return;
      try{await L.room.emit("hallchat",{hall:getHall()||"",text:t.slice(0,300)});inp.value=""}catch(e){box.querySelector("#lvM").textContent=e&&e.code==="not_permitted"?NOPERM:"Сообщение не ушло."}}};
  const dbg=()=>{const all=peers();return `связь: ${L.room.connected&&L.room.connected()?"есть":"нет"} · на сайте: ${all.filter(p=>p.kind==="viewer").length} · в музее: ${all.filter(p=>p.presence&&p.presence.place==="museum").length}`};
  const log=M=>M.map(m=>`<div class="lvmsg${m.me?" me":""}"><b>${esc(m.me?"вы":(m.by&&L.names[m.by])||"гость")}</b> ${esc(m.text)}</div>`).join("")||`<div class="hint">Тишина.</div>`;
  draw();const off=on(draw);const t=setInterval(draw,1500);return ()=>{off();clearInterval(t)}}
(function(){const s=document.createElement("style");s.textContent=`
.whobox{display:inline-flex;align-items:center;gap:6px;margin-left:8px;font-size:13px;color:var(--muted);align-self:center}
.whodot{width:9px;height:9px;border-radius:50%}.whonm{color:var(--ink)}.whon{font-family:var(--f-mono);font-size:10.5px;border:1px solid var(--line);border-radius:999px;padding:0 6px}
.whoin{display:inline-flex;align-items:center;border:1px solid #E03A1E;color:#E03A1E;border-radius:999px;padding:3px 11px;font-size:13px;text-decoration:none}
.whoin:hover,.whoin:focus-visible{background:#E03A1E;color:#fff;outline:none}
.livepanel{border:1px solid var(--line);background:var(--sheet);padding:10px 14px;margin-top:12px}
.lvhead{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.lvpeople{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0}
.lvp{display:inline-flex;gap:5px;align-items:center;font-size:13px;border:1px solid var(--line-soft);border-radius:999px;padding:1px 9px}.lvp i{width:8px;height:8px;border-radius:50%}
.lvhall{font-family:var(--f-mono);font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-top:6px}
.lvdbg{font-family:var(--f-mono);font-size:10.5px;color:var(--muted);margin-top:4px}.lvlog{max-height:160px;overflow:auto;font-size:14px;display:grid;gap:3px;margin:6px 0}.lvmsg.me b{color:var(--stamp)}
@media (max-width:700px){.whobox{position:absolute;top:12px;right:12px;z-index:30;margin:0}.whobox .whonm{max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}`;document.head.appendChild(s)})();
document.addEventListener("appready",()=>init());
return {init,museum,panel,header,on,state:()=>L};
})();

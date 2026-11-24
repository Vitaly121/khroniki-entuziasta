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
    room.on("pos",m=>{if(m.sameTab){L.myPeer=m.peer;return}const d=m.data||{};if(d.place===null){delete L.pos[m.peer];emit();return}if(!isFinite(d.x)||!isFinite(d.z))return;const nw=!L.pos[m.peer];L.pos[m.peer]={peer:m.peer,by:m.by,kind:m.kind,isMe:m.isMe,sameTab:false,presence:{x:+d.x,z:+d.z,yaw:+d.yaw||0,hall:String(d.hall||"").slice(0,40),place:"museum",g:gOf(d.g),sy:isFinite(+d.sy)?Math.max(0,Math.min(1.05,+d.sy)):0,k:kOf(d.k),w:typeof d.w==="string"?d.w.slice(0,40):"",hn:typeof d.hn==="string"?d.hn.slice(0,60):"",v:d.v===1?1:0},at:Date.now()};if(m.by)names([m.by]);if(nw)emit()},()=>{});
    room.on("rtc",m=>{if(m.sameTab||!m.data)return;VOICE_RX.forEach(f=>{try{f(m)}catch(e){}})},()=>{});
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
function museum(){init();let last=0,lastSent="",cur=null,lastPos=0;const VO=voice();const hb=setInterval(()=>{if(L.room&&cur){L.room.presence(cur).catch(()=>{});L.room.emit("pos",cur).catch(()=>{})}},2000);
  return {
    tick(P,hall,ext){if(!L.room)return;const now=performance.now();if(now-last<110)return;last=now;
      const s={x:+P.x.toFixed(2),z:+P.z.toFixed(2),yaw:+P.yaw.toFixed(2),hall:String(hall||""),place:"museum"};const g=gOf(P.g);if(g)s.g=g;if(g==="sit"&&P.sy>0)s.sy=+(+P.sy).toFixed(2);const lk=kOf(P.k);if(lk)s.k=lk;/* этап 8, часть 2: мир (этаж или пространство посетителя) и название зала — необязательные поля, старые клиенты их не знают */if(ext&&ext.w){s.w=String(ext.w).slice(0,40);if(ext.hn)s.hn=String(ext.hn).slice(0,60)}if(VO.on)s.v=1;cur=s;if(now-lastPos>240){lastPos=now;L.room.emit("pos",s).catch(()=>{})}const k=JSON.stringify(s);if(k===lastSent)return;lastSent=k;L.room.presence(s).catch(()=>{})},
    voice:VO,
    leave(){clearInterval(hb);VO.stop();cur=null;if(L.room)L.room.emit("pos",{place:null}).catch(()=>{});if(L.room)L.room.presence({place:null,x:null,z:null,yaw:null,hall:null}).catch(()=>{})},
    others(world){return peers().filter(p=>!p.sameTab&&p.kind==="viewer"&&p.presence&&p.presence.place==="museum"&&isFinite(p.presence.x)&&isFinite(p.presence.z)&&(world===undefined||String(p.presence.w||"")===String(world||""))).map(p=>{
      /* реплика над фигурой (этап 7): последняя фраза посетителя — 30 с от времени сообщения (at); sayAt — это время, чтобы музей гасил пузырь вовремя */
      const say=[...L.msgs].reverse().find(m=>m.peer===p.peer&&Date.now()-m.at<SAY_MS);
      return {id:p.peer,v:p.presence.v===1?1:0,name:nameOf(p),x:+p.presence.x,z:+p.presence.z,yaw:+p.presence.yaw||0,color:colOf(p.by||p.peer),say:say?say.text:"",sayAt:say?say.at:0,g:gOf(p.presence.g),sy:isFinite(+p.presence.sy)?Math.max(0,Math.min(1.05,+p.presence.sy)):0,k:kOf(p.presence.k),hall:String(p.presence.hall||""),w:String(p.presence.w||"")}})},
    /* своя последняя фраза (для пузыря над своей фигурой в виде из-за спины) */
    mine(){const m=[...L.msgs].reverse().find(m=>m.me);return m&&Date.now()-m.at<SAY_MS?{text:m.text,at:m.at}:null},
    /* этап 7: чат зала внутри музея (полноэкранный вид) — тот же канал, что и панель под музеем */
    chat(hall,n){const M=L.msgs.filter(m=>!hall||m.hall===hall).slice(-(n||5));
      return {room:!!L.room,note:L.room?"":NOROOM(),msgs:M.map(m=>({who:m.me?"вы":(m.by&&L.names[m.by])||"гость",me:!!m.me,text:m.text,at:m.at}))}},
    async say(hall,text){const t=String(text||"").trim().slice(0,300);if(!t)return {ok:false,note:""};if(!L.room)return {ok:false,note:NOROOM()};
      try{await L.room.emit("hallchat",{hall:String(hall||"").slice(0,40),text:t});return {ok:true}}catch(e){return {ok:false,note:e&&e.code==="not_permitted"?NOPERM:"Сообщение не ушло."}}},
    sub(f){return on(f)}}}
const SAY_MS=30000;
/* ---------- этап 11: голос в музее. WebRTC peer-to-peer, сигналинг — тот же realtime-канал (broadcast «rtc»), STUN — запасной публичный.
   Слышно только тех, кто в том же зале (поле hall) и ближе ~18 м: громкость падает с расстоянием, панорама — по положению относительно камеры.
   Соединения — только с теми, кто рядом и тоже включил микрофон; ушёл из зала или далеко — соединение закрывается. Свой звук не воспроизводится.
   Микрофон запрашивается только по нажатию; скрытая вкладка — микрофон приглушён; выход из музея — треки остановлены. Без TURN в части сетей
   прямого соединения нет: через 12 с пишем нейтрально «нет прямого соединения с …» и больше не пытаемся (повтор — через 30 с). ---------- */
const VOICE_RX=new Set();
const V_R=18,V_HYST=21,V_WAIT=12000,V_RETRY=30000;
const iceServers=()=>Array.isArray(window.__RTC_ICE)?window.__RTC_ICE:(window.SITE_BACKEND&&Array.isArray(window.SITE_BACKEND.iceServers)?window.SITE_BACKEND.iceServers:[{urls:"stun:stun.l.google.com:19302"}]);
function voice(){const V={on:false,busy:false,stream:null,ctx:null,peers:new Map(),fail:new Map(),note:"",level:0,me:null};
  const myId=()=>L.myPeer||((L.room&&L.room.peers().find(p=>p.sameTab))||{}).peer||"";
  const send=(to,d)=>{if(L.room)L.room.emit("rtc",Object.assign({to},d)).catch(()=>{})};
  const quiet=f=>{try{const r=f();if(r&&r.catch)r.catch(()=>{})}catch(e){}};
  function drop(id,tell,why){const p=V.peers.get(id);if(!p)return;V.peers.delete(id);if(tell)send(id,why?{t:"bye",why}:{t:"bye"});
    quiet(()=>p.pc.close());[p.src,p.an,p.gain,p.pan].forEach(n=>{if(n)quiet(()=>n.disconnect())});if(p.el){p.el.srcObject=null}}
  function attach(p,stream){if(p.src||!V.ctx)return;/* Chrome: удалённый поток идёт в Web Audio, только если привязан к элементу (без звука) */
    p.el=new Audio();p.el.muted=true;p.el.srcObject=stream;quiet(()=>p.el.play());
    p.src=V.ctx.createMediaStreamSource(stream);p.an=V.ctx.createAnalyser();p.an.fftSize=512;p.gain=V.ctx.createGain();p.gain.gain.value=0;p.pan=V.ctx.createStereoPanner();
    p.src.connect(p.an);p.src.connect(p.gain);p.gain.connect(p.pan);p.pan.connect(V.ctx.destination);p.buf=new Float32Array(p.an.fftSize)}
  function mk(id,name){const pc=new RTCPeerConnection({iceServers:iceServers()});const p={id,name:name||"",pc,t0:Date.now(),ok:false,q:[],far:0,lvl:0,talkAt:0};
    V.stream.getTracks().forEach(t=>pc.addTrack(t,V.stream));
    pc.onicecandidate=e=>{if(e.candidate)send(id,{t:"ice",c:e.candidate.toJSON()})};
    pc.ontrack=e=>attach(p,e.streams&&e.streams[0]||new MediaStream([e.track]));
    pc.onconnectionstatechange=()=>{const st=pc.connectionState;if(st==="connected"){p.ok=true;V.fail.delete(id)}else if(st==="failed"&&!p.ok){V.fail.set(id,{at:Date.now(),name:p.name});drop(id,false)}else if(st==="closed")drop(id,false)};
    V.peers.set(id,p);return p}
  async function flush(p){const q=p.q.splice(0);for(const c of q)await p.pc.addIceCandidate(c).catch(()=>{})}
  /* входящий сигнал: offer/answer/ice/bye; чужие адресаты и выключенный голос — молча мимо */
  VOICE_RX.add(async m=>{const d=m.data;if(!V.on||!d||d.to!==myId())return;const id=m.peer;let p=V.peers.get(id);
    try{if(d.t==="offer"&&typeof d.sdp==="string"){const o=(V.others||[]).find(x=>x.id===id);if(!o||!near(o))return;if(p&&p.pc.signalingState!=="stable"&&myId()<id)return;if(p&&p.pc.signalingState==="stable"&&p.pc.remoteDescription){drop(id,false);p=null}
        if(!p)p=mk(id,o.name);await p.pc.setRemoteDescription({type:"offer",sdp:d.sdp});await flush(p);const a=await p.pc.createAnswer();await p.pc.setLocalDescription(a);send(id,{t:"answer",sdp:p.pc.localDescription.sdp})}
      else if(d.t==="answer"&&p&&typeof d.sdp==="string"&&p.pc.signalingState==="have-local-offer"){await p.pc.setRemoteDescription({type:"answer",sdp:d.sdp});await flush(p)}
      else if(d.t==="ice"&&p&&d.c){if(p.pc.remoteDescription)await p.pc.addIceCandidate(d.c).catch(()=>{});else p.q.push(d.c)}
      else if(d.t==="bye"&&p){if(!p.ok&&d.why==="t")V.fail.set(id,{at:Date.now(),name:p.name});drop(id,false)}}catch(e){/* сбой согласования — соединение просто не состоится, ниже сработает таймаут */}});
  const dist=o=>V.me?Math.hypot(o.x-V.me.x,o.z-V.me.z):1e9;
  const near=(o,r)=>!!V.me&&o.v===1&&String(o.hall||"")===String(V.me.hall||"")&&String(o.w||"")===String(V.me.w||"")&&dist(o)<=(r||V_R);
  /* каждые ~200 мс: кто рядом, кому звонить, кого закрыть, громкость и панорама */
  function step(me,others){V.me=me;V.others=others||[];if(!V.on)return;const now=Date.now(),mine=myId();
    V.others.forEach(o=>{if(!near(o)||V.peers.has(o.id))return;const f=V.fail.get(o.id);if(f&&now-f.at<V_RETRY)return;
      if(mine&&mine<o.id){const p=mk(o.id,o.name);p.pc.createOffer({offerToReceiveAudio:true}).then(of=>p.pc.setLocalDescription(of)).then(()=>send(o.id,{t:"offer",sdp:p.pc.localDescription.sdp})).catch(()=>{})}});
    V.peers.forEach((p,id)=>{const o=V.others.find(x=>x.id===id);const keep=o&&near(o,V_HYST);if(!keep){p.far=p.far||now;if(now-p.far>1500){drop(id,true);return}}else p.far=0;
      if(!p.ok&&now-p.t0>V_WAIT){V.fail.set(id,{at:now,name:p.name||(o&&o.name)||""});drop(id,true,"t");return}
      if(p.gain&&V.ctx){const d=o?dist(o):1e9,inHall=o&&String(o.hall||"")===String(me.hall||"");const g=inHall&&d<V_R?Math.pow(1-d/V_R,1.6):0;
        const rx=Math.cos(me.yaw||0),rz=-Math.sin(me.yaw||0),dx=o?o.x-me.x:0,dz=o?o.z-me.z:0,pn=d>.05?Math.max(-1,Math.min(1,(dx*rx+dz*rz)/d)):0;
        p.gain.gain.setTargetAtTime(g,V.ctx.currentTime,.08);p.pan.pan.setTargetAtTime(pn*.85,V.ctx.currentTime,.08);p.g=g;p.pn=pn;
        p.an.getFloatTimeDomainData(p.buf);let e=0;for(let i=0;i<p.buf.length;i++)e+=p.buf[i]*p.buf[i];p.lvl=Math.sqrt(e/p.buf.length);if(p.lvl>.015&&g>0)p.talkAt=now}});
    const fl=[...V.fail.values()].filter(f=>now-f.at<V_RETRY).map(f=>f.name||"гостем");V.note=fl.length?"нет прямого соединения с "+fl.join(", "):""}
  function vis(){if(V.stream)V.stream.getAudioTracks().forEach(t=>t.enabled=V.on&&!document.hidden)}
  document.addEventListener("visibilitychange",vis);
  /* включить/выключить: только вошедшим; getUserMedia — только здесь, по нажатию */
  async function toggle(){if(V.busy)return st();if(V.on){off();return st("Микрофон выключен.")}
    if(!L.uid||!L.room)return st("Войдите, чтобы говорить.");
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.RTCPeerConnection)return st("Этот браузер не умеет голос.");
    V.busy=true;try{V.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true},video:false});
      const AC=window.AudioContext||window.webkitAudioContext;V.ctx=new AC();if(V.ctx.state==="suspended")quiet(()=>V.ctx.resume());V.on=true;vis();return st("Микрофон включён: вас слышат те, кто рядом в этом зале.")}
    catch(e){V.stream=null;const n=e&&e.name;return st(n==="NotAllowedError"||n==="SecurityError"?"Доступ к микрофону не дан. Разрешите его в настройках браузера для этого сайта.":n==="NotFoundError"?"Микрофон не найден.":"Микрофон не включился.")}
    finally{V.busy=false}}
  function off(){V.on=false;[...V.peers.keys()].forEach(id=>drop(id,true));V.fail.clear();V.note="";if(V.stream){V.stream.getTracks().forEach(t=>t.stop());V.stream=null}if(V.ctx){quiet(()=>V.ctx.close());V.ctx=null}}
  const st=msg=>({on:V.on,msg:msg||""});
  return {get on(){return V.on},get note(){return V.note},can:()=>!!(L.uid&&L.room),toggle,step,stop(){off();document.removeEventListener("visibilitychange",vis)},
    speaking:id=>{const p=V.peers.get(id);return !!(p&&Date.now()-p.talkAt<600)},
    dbg:()=>({on:V.on,me:myId(),note:V.note,local:V.stream?V.stream.getAudioTracks().map(t=>({enabled:t.enabled,state:t.readyState})):[],ctx:V.ctx?V.ctx.state:null,
      peers:[...V.peers.values()].map(p=>({id:p.id,name:p.name,state:p.pc.connectionState,ok:p.ok,g:p.g==null?null:+p.g.toFixed(3),pan:p.pn==null?null:+p.pn.toFixed(2),lvl:+(p.lvl||0).toFixed(4),talk:Date.now()-p.talkAt<600,audio:!!p.src})),fail:[...V.fail.keys()]})}}
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
.whoin:hover,.whoin:focus-visible{background:#E03A1E;color:#fff;outline:none}.whoin:focus-visible{outline:2px solid var(--stamp,#E03A1E);outline-offset:2px}
.livepanel{border:1px solid var(--line);background:var(--sheet);padding:10px 14px;margin-top:12px}
.lvhead{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.lvpeople{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0}
.lvp{display:inline-flex;gap:5px;align-items:center;font-size:13px;border:1px solid var(--line-soft);border-radius:999px;padding:1px 9px}.lvp i{width:8px;height:8px;border-radius:50%}
.lvhall{font-family:var(--f-mono);font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-top:6px}
.lvdbg{font-family:var(--f-mono);font-size:10.5px;color:var(--muted);margin-top:4px}.lvlog{max-height:160px;overflow:auto;font-size:14px;display:grid;gap:3px;margin:6px 0}.lvmsg.me b{color:var(--stamp)}
@media (max-width:700px){.whobox{position:absolute;top:12px;right:12px;z-index:30;margin:0}.whobox .whonm{max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}`;document.head.appendChild(s)})();
document.addEventListener("appready",()=>init());
return {init,museum,panel,header,on,state:()=>L};
})();

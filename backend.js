/* Сервер сайта вне Claude: тот же интерфейс window.claude.use("user"|"db"|"sample"|"room"),
   но поверх Supabase (вход, база, присутствие) и Cloudflare Worker (ответы двойников).
   Если страница открыта внутри Claude или config.js пуст — файл ничего не делает. */
(function(){
"use strict";
const C=window.SITE_BACKEND||{};
if(window.claude&&typeof window.claude.use==="function")return;
if(!C.supabaseUrl||!C.anonKey)return;
const LIB=["https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js","https://unpkg.com/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js"];
const TAB=Math.random().toString(36).slice(2,10);
let sbP=null;
function lib(){return new Promise((res,rej)=>{let i=0;(function next(){if(window.supabase&&window.supabase.createClient)return res();if(i>=LIB.length)return rej(new Error("lib"));
  const s=document.createElement("script");s.src=LIB[i++];s.onload=()=>res();s.onerror=next;document.head.appendChild(s)})()})}
function client(){if(!sbP)sbP=lib().then(()=>window.supabase.createClient(C.supabaseUrl,C.anonKey,{auth:{persistSession:true,autoRefreshToken:true}}));return sbP}
async function session(){const sb=await client();const {data}=await sb.auth.getSession();return data&&data.session||null}
async function uid(){const s=await session();return s?s.user.id:null}

/* ---------- user ---------- */
const user={
  id:uid,
  async isOwner(){const u=await uid();if(!u)return false;const sb=await client();const {data}=await sb.from("admins").select("id").eq("id",u).maybeSingle();return !!data},
  async profiles(ids){const out={};if(!ids||!ids.length)return out;const sb=await client();const {data}=await sb.from("profiles").select("id,name").in("id",ids.slice(0,200));(data||[]).forEach(r=>out[r.id]={name:r.name||""});return out}
};

/* ---------- db: документы по пути, как в Claude ---------- */
function snapDoc(row){return {id:row.path.split("/").pop(),exists:true,data:()=>row.data}}
function doc(path){return {
  async get(){const sb=await client();const {data,error}=await sb.from("docs").select("path,data").eq("path",path).maybeSingle();if(error)throw error;return data?snapDoc(data):{id:path.split("/").pop(),exists:false,data:()=>undefined}},
  async set(value){const sb=await client();const u=await uid();if(!u){const e=new Error("not_permitted");e.code="not_permitted";throw e}
    const {data:cur}=await sb.from("docs").select("owner").eq("path",path).maybeSingle();
    const q=cur?sb.from("docs").update({data:value,updated_at:new Date().toISOString()}).eq("path",path).select("path"):sb.from("docs").insert({path,owner:u,data:value}).select("path");
    const {data,error}=await q;if(error||!data||!data.length){const e=new Error("not_permitted");e.code="not_permitted";throw e}}
}}
function collection(name){const pre=name+"/";return {
  onSnapshot(cb,onErr){let dead=false,ch=null,t=null;
    const pull=async()=>{try{const sb=await client();const {data,error}=await sb.from("docs").select("path,data").like("path",pre+"%").limit(2000);if(error)throw error;if(!dead)cb({docs:(data||[]).filter(r=>r.path.slice(pre.length).indexOf("/")<0).map(snapDoc)})}catch(e){if(onErr)onErr(e)}};
    const soon=()=>{clearTimeout(t);t=setTimeout(pull,250)};
    pull();client().then(sb=>{if(dead)return;ch=sb.channel("docs-"+name+"-"+TAB).on("postgres_changes",{event:"*",schema:"public",table:"docs"},p=>{const path=(p.new&&p.new.path)||(p.old&&p.old.path)||"";if(!path||path.indexOf(pre)===0)soon()}).subscribe()}).catch(()=>{});
    const poll=setInterval(pull,60000);
    return ()=>{dead=true;clearInterval(poll);clearTimeout(t);if(ch)client().then(sb=>sb.removeChannel(ch))}}
}}
const db={doc,collection};

/* ---------- sample: ответы двойников через Worker ---------- */
async function sample(input,opts){opts=opts||{};
  if(!C.workerUrl)throw new Error("nosample");const s=await session();if(!s){const e=new Error("login");e.code="login";throw e}
  const messages=typeof input==="string"?[{role:"user",content:input}]:input;
  const r=await fetch(C.workerUrl.replace(/\/$/,"")+"/sample",{method:"POST",signal:opts.signal,headers:{"content-type":"application/json","authorization":"Bearer "+s.access_token},body:JSON.stringify({messages,tier:opts.modelTier==="quick"?"quick":"main"})});
  if(!r.ok){let m="";try{m=(await r.json()).error||""}catch(e){}const e=new Error(m||("http "+r.status));e.code=r.status===429?"limit":"failed";throw e}
  const rd=r.body.getReader(),dec=new TextDecoder();let buf="",text="";
  for(;;){const {done,value}=await rd.read();if(done)break;buf+=dec.decode(value,{stream:true});let i;
    while((i=buf.indexOf("\n"))>=0){const line=buf.slice(0,i).trim();buf=buf.slice(i+1);if(line.indexOf("data:")!==0)continue;
      try{const ev=JSON.parse(line.slice(5));if(ev.type==="content_block_delta"&&ev.delta&&typeof ev.delta.text==="string"){text+=ev.delta.text;if(opts.onText)opts.onText({text})}
        if(ev.type==="error")throw new Error("stream")}catch(e){if(e.message==="stream")throw e}}}
  return {text}}

/* ---------- room: кто сейчас на сайте, общий музей ---------- */
function makeRoom(sb,me){const hs={},peerCbs=[];let list=[],ok=false,state={};
  const ch=sb.channel("site",{config:{presence:{key:TAB},broadcast:{self:true}}});
  const wrap=(key,by,presence)=>({peer:key,by:by||null,kind:"viewer",isMe:!!(by&&by===me),sameTab:key===TAB,presence:presence||{}});
  ch.on("presence",{event:"sync"},()=>{const st=ch.presenceState();list=Object.keys(st).map(k=>{const m=st[k][st[k].length-1]||{};return wrap(k,m.by,m.state)});peerCbs.forEach(f=>{try{f({peers:list})}catch(e){}})});
  ch.on("broadcast",{event:"m"},({payload})=>{if(!payload||!hs[payload.e])return;const m={peer:payload.p,by:payload.by||null,kind:"viewer",isMe:!!(payload.by&&payload.by===me),sameTab:payload.p===TAB,data:payload.d};hs[payload.e].forEach(f=>{try{f(m)}catch(e){}})});
  ch.subscribe(async st=>{ok=st==="SUBSCRIBED";if(ok)await ch.track({by:me,state})});
  return {
    onPeers(cb){peerCbs.push(cb);cb({peers:list})},
    on(ev,cb){(hs[ev]=hs[ev]||[]).push(cb)},
    async emit(ev,data){if(ev==="hallchat"&&!me){const e=new Error("not_permitted");e.code="not_permitted";throw e}
      if(ev==="hallchat"&&data&&typeof data.text==="string")data.text=data.text.slice(0,300);
      await ch.send({type:"broadcast",event:"m",payload:{e:ev,p:TAB,by:me,d:data}})},
    async presence(s){state=s||{};if(ok)await ch.track({by:me,state})},
    peers:()=>list,connected:()=>ok}}
let roomP=null;
function room(){if(!roomP)roomP=(async()=>{const sb=await client();return makeRoom(sb,await uid())})();return roomP}

window.claude={use(name){return name==="user"?Promise.resolve(user):name==="db"?Promise.resolve(db):name==="sample"?Promise.resolve(sample):name==="room"?room():Promise.reject(new Error("unknown"))}};

/* ---------- окно входа ---------- */
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function css(){if(document.getElementById("beCss"))return;const s=document.createElement("style");s.id="beCss";s.textContent=`
.be-ov{position:fixed;inset:0;z-index:90;background:rgba(10,10,10,.5);display:grid;place-items:center;padding:16px}
.be-box{background:var(--sheet);color:var(--ink);border:1px solid var(--ink);width:min(400px,100%);padding:22px;display:grid;gap:12px;font-family:var(--f-ui)}
.be-box h3{margin:0;font-size:22px;font-weight:600}
.be-box label{display:grid;gap:4px;font-size:13px;color:var(--muted)}
.be-box input{font:inherit;font-size:16px;padding:9px 10px;border:1px solid var(--line);background:var(--paper);color:var(--ink);border-radius:2px}
.be-box .go{border:0;background:var(--ink);color:var(--paper);padding:11px;font:inherit;font-weight:600;cursor:pointer;border-radius:2px}
.be-box .go:disabled{opacity:.5}
.be-box .sw,.be-box .x{all:unset;cursor:pointer;color:var(--stamp);font-size:14px}
.be-box .row{display:flex;justify-content:space-between;gap:10px;align-items:center}
.be-msg{font-size:13px;color:var(--warn);min-height:18px}
.be-out{all:unset;cursor:pointer;color:var(--stamp)}`;document.head.appendChild(s)}
function login(){css();if(document.querySelector(".be-ov"))return;let mode="in";const ov=document.createElement("div");ov.className="be-ov";document.body.appendChild(ov);
  const draw=()=>{ov.innerHTML=`<form class="be-box" novalidate><div class="row"><h3>${mode==="in"?"Вход":"Регистрация"}</h3><button type="button" class="x" aria-label="Закрыть">Закрыть</button></div>
    ${mode==="up"?`<label>Имя, под которым вас увидят другие<input name="nm" maxlength="32" autocomplete="nickname" required></label>`:""}
    <label>Почта<input name="em" type="email" autocomplete="email" required></label>
    <label>Пароль${mode==="up"?" (не короче 8 знаков)":""}<input name="pw" type="password" minlength="8" autocomplete="${mode==="in"?"current-password":"new-password"}" required></label>
    <div class="be-msg" role="alert"></div><button class="go" type="submit">${mode==="in"?"Войти":"Зарегистрироваться"}</button>
    <button type="button" class="sw">${mode==="in"?"Впервые здесь? Зарегистрироваться":"Уже есть аккаунт? Войти"}</button></form>`;
    const f=ov.querySelector("form"),msg=ov.querySelector(".be-msg");ov.querySelector(".x").onclick=()=>ov.remove();ov.querySelector(".sw").onclick=()=>{mode=mode==="in"?"up":"in";draw()};
    f.querySelector("input").focus();
    f.onsubmit=async ev=>{ev.preventDefault();const em=f.em.value.trim(),pw=f.pw.value,nm=f.nm?f.nm.value.trim():"";msg.textContent="";
      if(!em||pw.length<8||(mode==="up"&&!nm)){msg.textContent=mode==="up"?"Нужны имя, почта и пароль от 8 знаков.":"Нужны почта и пароль.";return}
      const b=f.querySelector(".go");b.disabled=true;try{const sb=await client();
        if(mode==="up"){const {data,error}=await sb.auth.signUp({email:em,password:pw,options:{data:{name:nm}}});if(error)throw error;
          if(!data.session){msg.style.color="var(--ink)";msg.textContent="Мы отправили письмо со ссылкой. Откройте её и вернитесь сюда.";b.disabled=false;return}
          await sb.from("profiles").upsert({id:data.user.id,name:nm.slice(0,32)})}
        else{const {data,error}=await sb.auth.signInWithPassword({email:em,password:pw});if(error)throw error;
          const nm2=data.user.user_metadata&&data.user.user_metadata.name;if(nm2)await sb.from("profiles").upsert({id:data.user.id,name:String(nm2).slice(0,32)})}
        location.reload()}catch(e){b.disabled=false;const m=String(e&&e.message||"");
        msg.textContent=/Invalid login/i.test(m)?"Почта или пароль не подходят.":/already registered/i.test(m)?"Такая почта уже зарегистрирована — войдите.":/rate|limit/i.test(m)?"Слишком много попыток. Подождите минуту.":"Не получилось. Попробуйте ещё раз."}}};
  draw();ov.addEventListener("pointerdown",ev=>{if(ev.target===ov)ov.remove()})}
async function logout(){const sb=await client();await sb.auth.signOut();location.reload()}
window.Backend={login,logout,configured:true};
/* кнопка «Войти» в шапке и в подсказках открывает окно входа, а не Claude */
document.addEventListener("click",ev=>{const a=ev.target.closest&&ev.target.closest(".whoin");if(a){ev.preventDefault();login()}},true);
/* «Выйти» в подвале */
document.addEventListener("DOMContentLoaded",async()=>{try{if(!(await uid()))return;css();const f=document.querySelector(".foot");if(!f)return;const b=document.createElement("button");b.type="button";b.className="be-out";b.textContent="Выйти из аккаунта";b.onclick=logout;f.appendChild(b)}catch(e){}});
})();

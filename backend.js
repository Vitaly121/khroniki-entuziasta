/* Сервер сайта вне Claude: тот же интерфейс window.claude.use("user"|"db"|"sample"|"room"),
   но поверх Supabase (вход, база, присутствие) и Cloudflare Worker (ответы двойников).
   Если страница открыта внутри Claude или config.js пуст — файл ничего не делает. */
(function(){
"use strict";
const C=window.SITE_BACKEND||{};
if(window.claude&&typeof window.claude.use==="function")return;
if(!C.supabaseUrl||!C.anonKey)return;
const LIB=["vendor/supabase.js","https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.119.0/dist/umd/supabase.js"];
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
async function sample(input,opts){try{return await sample0(input,opts)}catch(e){if(e&&e.name==="AbortError"){const x=new Error("cancelled");x.code="cancelled";throw x}throw e}}
async function sample0(input,opts){opts=opts||{};
  if(!C.workerUrl)throw new Error("nosample");const s=await session();if(!s){const e=new Error("login");e.code="login";throw e}
  const messages=typeof input==="string"?[{role:"user",content:input}]:input;
  const r=await fetch(C.workerUrl.replace(/\/$/,"")+"/sample",{method:"POST",signal:opts.signal,headers:{"content-type":"application/json","authorization":"Bearer "+s.access_token,"x-sb-key":C.anonKey},body:JSON.stringify({messages,tier:opts.modelTier==="quick"?"quick":"main"})});
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
    async emit(ev,data){if((ev==="hallchat"||ev==="rtc")&&!me){const e=new Error("not_permitted");e.code="not_permitted";throw e}
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
let hasSes=false;try{hasSes=Object.keys(localStorage).some(k=>/^sb-.+-auth-token$/.test(k))}catch(e){}
/* ---------- этап 8: пространства посетителей и правка предметов книги ----------
   Права решает база (schema2.sql); здесь только запросы и понятные коды ошибок:
   login, limit_spaces, limit_objects, too_large, bad_type, broken_image, not_permitted, offline, not_found, invalid, failed. */
const SP_FLOORS=["551","43","17","-1"];
const SP_LIM={spaces:3,objects:24,fileBytes:2*1024*1024,maxSide:1600,targetBytes:600*1024,types:["image/jpeg","image/png","image/webp"]};
const SP_MSG={
  login:"Войдите, чтобы продолжить.",
  limit_spaces:"У вас уже 3 пространства — это предел. Удалите одно, чтобы создать новое.",
  limit_objects:"В пространстве уже 24 предмета — это предел.",
  too_large:"Файл больше 2 МБ. Уменьшите его и попробуйте снова.",
  bad_type:"Подходят только изображения JPEG, PNG или WebP.",
  broken_image:"Не удалось прочитать изображение. Возможно, файл повреждён.",
  not_permitted:"Нет прав на это действие.",
  offline:"Нет связи с сервером. Проверьте интернет и повторите.",
  not_found:"Пространство не найдено или недоступно.",
  invalid:"Проверьте поля: пустое название или слишком длинный текст.",
  failed:"Не получилось. Попробуйте ещё раз."};
function spFail(code,detail){const e=new Error(code);e.code=code;if(detail)e.detail=String(detail).slice(0,300);return e}
function spMap(err){if(err&&err.code&&SP_MSG[err.code]&&!/^\d/.test(err.code))return err;
  const m=String(err&&(err.message||err.error||err.msg)||err||""),st=+(err&&(err.statusCode||err.status))||0,c=String(err&&err.code||"");
  if((typeof navigator!=="undefined"&&navigator.onLine===false)||/Failed to fetch|NetworkError|Load failed|network|fetch failed|ERR_/i.test(m))return spFail("offline",m);
  if(/limit: 3/.test(m))return spFail("limit_spaces",m);
  if(/limit: 24/.test(m))return spFail("limit_objects",m);
  if(st===413||/maximum allowed size|too large/i.test(m))return spFail("too_large",m);
  if(st===415||/mime type|invalid_mime/i.test(m))return spFail("bad_type",m);
  if(c==="42501"||st===403||/row-level security|permission denied|not_permitted|Unauthorized/i.test(m))return spFail("not_permitted",m);
  if(c==="23514"||c==="22001"||/check constraint|too long/i.test(m))return spFail("invalid",m);
  if(/JWT|not authenticated/i.test(m))return spFail("login",m);
  return spFail("failed",m)}
async function spRun(q){let r;try{r=await q}catch(e){throw spMap(e)}if(r&&r.error)throw spMap(r.error);return r?r.data:null}
const spRand=()=>{const a=new Uint8Array(9);(crypto.getRandomValues?crypto.getRandomValues(a):a.forEach((_,i)=>a[i]=Math.random()*256|0));return Array.from(a,b=>("0"+b.toString(16)).slice(-2)).join("")+Date.now().toString(36)};
const spPathOk=p=>typeof p==="string"&&p.length<=300&&/^(book|[0-9a-f-]{36})\/[A-Za-z0-9_-]{4,80}\.(webp|jpg|png)$/.test(p);
function spUrl(p){return spPathOk(p)?C.supabaseUrl.replace(/\/$/,"")+"/storage/v1/object/public/spaces/"+p:""}
let spMeP=null;
function spMe(){if(!spMeP)spMeP=(async()=>{const id=await uid().catch(()=>null);let owner=false;if(id){try{owner=await user.isOwner()}catch(e){}}return {id,owner}})();return spMeP}
async function spNeedMe(){const me=await spMe();if(!me.id)throw spFail("login");return me}

/* изображение: проверка, уменьшение до 1600 px по длинной стороне, WebP (или JPEG) не больше ~600 КБ, без метаданных */
async function spDecode(file){
  if(window.createImageBitmap){try{return await createImageBitmap(file,{imageOrientation:"from-image"})}catch(e){}}
  return await new Promise((res,rej)=>{const u=URL.createObjectURL(file),im=new Image();im.onload=()=>{URL.revokeObjectURL(u);res(im)};im.onerror=()=>{URL.revokeObjectURL(u);rej(spFail("broken_image"))};im.src=u})}
const spBlob=(c,type,q)=>new Promise(r=>c.toBlob(b=>r(b),type,q));
async function spPrepare(file,onProgress){
  if(!file||typeof file.size!=="number")throw spFail("bad_type");
  if(SP_LIM.types.indexOf(String(file.type).toLowerCase())<0)throw spFail("bad_type");
  if(file.size>SP_LIM.fileBytes)throw spFail("too_large");
  if(onProgress)onProgress({stage:"prepare",p:.1});
  let bm;try{bm=await spDecode(file)}catch(e){throw spFail("broken_image")}
  const W0=bm.width||bm.naturalWidth,H0=bm.height||bm.naturalHeight;if(!W0||!H0)throw spFail("broken_image");
  let k=Math.min(1,SP_LIM.maxSide/Math.max(W0,H0)),out=null,type="image/webp";
  for(let pass=0;pass<5&&!out;pass++){const w=Math.max(1,Math.round(W0*k)),h=Math.max(1,Math.round(H0*k));
    const c=document.createElement("canvas");c.width=w;c.height=h;const g=c.getContext("2d");
    g.fillStyle="#ffffff";g.fillRect(0,0,w,h);g.drawImage(bm,0,0,w,h);
    for(const q of [.86,.76,.64,.52]){let b=await spBlob(c,"image/webp",q);if(!b||b.type!=="image/webp"){b=await spBlob(c,"image/jpeg",q);type="image/jpeg"}else type="image/webp";
      if(b&&b.size<=SP_LIM.targetBytes){out={blob:b,w,h,type};break}}
    k*=.8}
  if(bm.close)try{bm.close()}catch(e){}
  if(!out)throw spFail("too_large");
  if(onProgress)onProgress({stage:"prepare",p:.4});
  return out}
async function spUpload(file,opts){opts=opts||{};const me=await spNeedMe();const onP=opts.onProgress;
  const prep=await spPrepare(file,onP);
  const folder=opts.book?"book":me.id;if(opts.book&&!me.owner)throw spFail("not_permitted");
  const path=folder+"/"+spRand()+(prep.type==="image/webp"?".webp":".jpg");
  if(onP)onP({stage:"upload",p:.5});
  const sb=await client();
  await spRun(sb.storage.from("spaces").upload(path,prep.blob,{contentType:prep.type,cacheControl:"31536000",upsert:false}));
  if(onP)onP({stage:"done",p:1});
  return {path,url:spUrl(path),w:prep.w,h:prep.h,bytes:prep.blob.size,type:prep.type}}
async function spRemoveFiles(paths){const ps=[...new Set((paths||[]).filter(spPathOk))];if(!ps.length)return {requested:0,removed:0};
  const sb=await client();const d=await spRun(sb.storage.from("spaces").remove(ps));return {requested:ps.length,removed:Array.isArray(d)?d.length:0}}

/* room: общие поля комнаты (форма описана в server/SPACES.md) */
const SP_SIZES={s:{room:[6,6],gallery:[10,4]},m:{room:[9,7],gallery:[14,5]},l:{room:[12,9],gallery:[20,6]}};
const SP_HEX=/^#[0-9a-fA-F]{6}$/;
function spSurf(s,defColor){s=s&&typeof s==="object"?s:{};return {img:spPathOk(s.img)?s.img:"",fit:s.fit==="stretch"?"stretch":"tile",color:SP_HEX.test(s.color||"")?s.color:defColor,tile:Math.min(6,Math.max(.5,+s.tile||2))}}
function spRoom(r){r=r&&typeof r==="object"?r:{};const size=SP_SIZES[r.size]?r.size:"m",shape=r.shape==="gallery"?"gallery":"room";const wd=SP_SIZES[size][shape];
  const h=[3,3.5,4].indexOf(+r.h)>=0?+r.h:3.5;const W=r.walls&&typeof r.walls==="object"?r.walls:{};
  const walls={mode:W.mode==="each"?"each":"one",all:spSurf(W.all,"#E9E4DA")};["n","e","s","w"].forEach(k=>{if(W[k])walls[k]=spSurf(W[k],walls.all.color)});
  return {v:1,size,shape,w:wd[0],d:wd[1],h,walls,floor:spSurf(r.floor,"#8B6F55"),ceil:spSurf(r.ceil,"#F4F2EE")}}
function spRoomImgs(r){r=r||{};const W=r.walls||{};return [W.all,W.n,W.e,W.s,W.w,r.floor,r.ceil].map(s=>s&&s.img).filter(spPathOk)}
function spCover(r){r=r||{};const W=r.walls||{};const c=[W.all,W.n,W.e,W.w,W.s].find(s=>s&&spPathOk(s.img));return c?spUrl(c.img):""}
function spPlace(p){p=p&&typeof p==="object"?p:{};const o={kind:p.kind==="ped"?"ped":"wall"};
  if(o.kind==="wall"&&["n","e","s","w"].indexOf(p.wall)>=0&&isFinite(+p.u)){o.wall=p.wall;o.u=+(+p.u).toFixed(2);o.y=isFinite(+p.y)?+(+p.y).toFixed(2):1.5}
  if(o.kind==="ped"&&isFinite(+p.x)&&isFinite(+p.z)){o.x=+(+p.x).toFixed(2);o.z=+(+p.z).toFixed(2);o.r=isFinite(+p.r)?Math.round(+p.r)%360:0}
  return o}
const SP_COLS="id,owner,floor,title,descr,room,status,note,created_at,updated_at";
const OB_COLS="id,space,owner,name,descr,img,place,sort,updated_at";
async function spDecorate(rows){rows=rows||[];if(!rows.length)return rows;const sb=await client();
  const objs=await spRun(sb.from("space_objects").select("space").in("space",rows.map(r=>r.id)));const cnt={};(objs||[]).forEach(o=>cnt[o.space]=(cnt[o.space]||0)+1);
  let names={};try{names=await user.profiles([...new Set(rows.map(r=>r.owner))])}catch(e){}
  return rows.map(r=>Object.assign({},r,{room:spRoom(r.room),count:cnt[r.id]||0,author:(names[r.owner]&&names[r.owner].name)||"посетитель",cover:spCover(r.room)}))}
const spaces={
  FLOORS:SP_FLOORS,LIMITS:SP_LIM,SIZES:SP_SIZES,message:c=>SP_MSG[c&&c.code||c]||SP_MSG.failed,url:spUrl,pathOk:spPathOk,normRoom:spRoom,normPlace:spPlace,roomImages:spRoomImgs,
  me:spMe,
  async list(floor){if(SP_FLOORS.indexOf(String(floor))<0)throw spFail("invalid");const sb=await client();
    return spDecorate(await spRun(sb.from("spaces").select(SP_COLS).eq("floor",String(floor)).eq("status","approved").order("updated_at",{ascending:false}).limit(200)))},
  async mine(){const me=await spNeedMe();const sb=await client();return spDecorate(await spRun(sb.from("spaces").select(SP_COLS).eq("owner",me.id).order("created_at",{ascending:true})))},
  async get(id){const sb=await client();const rows=await spRun(sb.from("spaces").select(SP_COLS).eq("id",String(id)).limit(1));if(!rows||!rows.length)throw spFail("not_found");
    const [s]=await spDecorate(rows);const objs=await spRun(sb.from("space_objects").select(OB_COLS).eq("space",s.id).order("sort",{ascending:true}));
    s.objects=(objs||[]).map(o=>Object.assign({},o,{place:spPlace(o.place),url:spUrl(o.img)})).sort((a,b)=>(a.sort-b.sort)||String(a.id).localeCompare(String(b.id)));
    const me=await spMe();s.mine=!!me.id&&(s.owner===me.id);s.canEdit=s.mine||me.owner;return s},
  async create(f){await spNeedMe();f=f||{};const sb=await client();
    const row={floor:String(f.floor),title:String(f.title||"").trim().slice(0,60),descr:String(f.descr||"").slice(0,600),room:spRoom(f.room)};
    if(SP_FLOORS.indexOf(row.floor)<0||!row.title)throw spFail("invalid");
    const d=await spRun(sb.from("spaces").insert(row).select(SP_COLS));if(!d||!d.length)throw spFail("not_permitted");return d[0]},
  async update(id,patch){const me=await spNeedMe();patch=patch||{};const row={};
    if("floor" in patch){if(SP_FLOORS.indexOf(String(patch.floor))<0)throw spFail("invalid");row.floor=String(patch.floor)}
    if("title" in patch){row.title=String(patch.title||"").trim().slice(0,60);if(!row.title)throw spFail("invalid")}
    if("descr" in patch)row.descr=String(patch.descr||"").slice(0,600);
    if("room" in patch)row.room=spRoom(patch.room);
    if(!me.owner&&("status" in patch&&patch.status!=="pending"||"note" in patch))throw spFail("not_permitted");
    if(me.owner){if("status" in patch&&["pending","approved","hidden"].indexOf(patch.status)>=0)row.status=patch.status;if("note" in patch)row.note=String(patch.note||"").slice(0,300)}
    if(!Object.keys(row).length)throw spFail("invalid");const sb=await client();
    const d=await spRun(sb.from("spaces").update(row).eq("id",String(id)).select(SP_COLS));if(!d||!d.length)throw spFail("not_permitted");return d[0]},
  async remove(id){await spNeedMe();const s=await spaces.get(id);if(!s.canEdit)throw spFail("not_permitted");const sb=await client();
    const files=spRoomImgs(s.room).concat(s.objects.map(o=>o.img));
    const d=await spRun(sb.from("spaces").delete().eq("id",s.id).select("id"));if(!d||!d.length)throw spFail("not_permitted");
    let f={requested:0,removed:0};try{f=await spRemoveFiles(files)}catch(e){f.error=e.code}return {id:s.id,files:f}},
  async addObject(space,o){await spNeedMe();o=o||{};const sb=await client();
    const row={space:String(space),name:String(o.name||"").trim().slice(0,80),descr:String(o.descr||"").slice(0,1200),img:spPathOk(o.img)?o.img:"",place:spPlace(o.place),sort:Number.isFinite(+o.sort)?Math.round(+o.sort):0};
    if(!row.name)throw spFail("invalid");
    const d=await spRun(sb.from("space_objects").insert(row).select(OB_COLS));if(!d||!d.length)throw spFail("not_permitted");return d[0]},
  async updateObject(id,patch){await spNeedMe();patch=patch||{};const row={};
    if("name" in patch){row.name=String(patch.name||"").trim().slice(0,80);if(!row.name)throw spFail("invalid")}
    if("descr" in patch)row.descr=String(patch.descr||"").slice(0,1200);
    if("img" in patch)row.img=spPathOk(patch.img)?patch.img:"";
    if("place" in patch)row.place=spPlace(patch.place);
    if("sort" in patch)row.sort=Math.round(+patch.sort)||0;
    const sb=await client();const d=await spRun(sb.from("space_objects").update(row).eq("id",String(id)).select(OB_COLS));if(!d||!d.length)throw spFail("not_permitted");return d[0]},
  async removeObject(id){const me=await spNeedMe();const sb=await client();
    const cur=await spRun(sb.from("space_objects").select(OB_COLS).eq("id",String(id)).limit(1));if(!cur||!cur.length)throw spFail("not_found");
    const d=await spRun(sb.from("space_objects").delete().eq("id",String(id)).select("id"));if(!d||!d.length)throw spFail("not_permitted");
    /* в базе удаление предмета не возвращает пространство на проверку (триггер только на insert/update) — просим сами */
    if(!me.owner){try{await spRun(sb.from("spaces").update({status:"pending"}).eq("id",cur[0].space).eq("status","approved").select("id"))}catch(e){}}
    try{await spRemoveFiles([cur[0].img])}catch(e){}return {id:String(id)}},
  async reorder(space,ids){await spNeedMe();const sb=await client();
    const cur=await spRun(sb.from("space_objects").select("id,sort").eq("space",String(space)));const by={};(cur||[]).forEach(o=>by[o.id]=o.sort);
    for(let i=0;i<ids.length;i++){if(by[ids[i]]===i)continue;const d=await spRun(sb.from("space_objects").update({sort:i}).eq("id",ids[i]).select("id"));if(!d||!d.length)throw spFail("not_permitted")}return true},
  /* часть 2: всё для 3D-этажа — одобренные пространства этажа и свои (любого статуса), с предметами; порядок — по времени создания */
  async world(floor){floor=String(floor);if(SP_FLOORS.indexOf(floor)<0)throw spFail("invalid");const sb=await client();const me=await spMe();
    const pub=await spRun(sb.from("spaces").select(SP_COLS).eq("floor",floor).eq("status","approved").order("created_at",{ascending:true}).limit(200));
    const own=me.id?await spRun(sb.from("spaces").select(SP_COLS).eq("floor",floor).eq("owner",me.id).order("created_at",{ascending:true})):[];
    const by=new Map();(pub||[]).concat(own||[]).forEach(r=>by.set(r.id,r));
    const rows=(await spDecorate([...by.values()])).sort((a,b)=>String(a.created_at||"").localeCompare(String(b.created_at||""))||String(a.id).localeCompare(String(b.id)));
    if(!rows.length)return [];
    const objs=await spRun(sb.from("space_objects").select(OB_COLS).in("space",rows.map(r=>r.id)));const os={};
    (objs||[]).forEach(o=>(os[o.space]=os[o.space]||[]).push(Object.assign({},o,{place:spPlace(o.place),url:spUrl(o.img)})));
    return rows.map(s=>Object.assign(s,{objects:(os[s.id]||[]).sort((a,b)=>(a.sort-b.sort)||String(a.id).localeCompare(String(b.id))),mine:!!me.id&&s.owner===me.id,canEdit:(!!me.id&&s.owner===me.id)||me.owner}))},
  /* часть 2: расстановка в 3D — записать place предмета и вернуть статус пространства (база сама возвращает на проверку) */
  async place(id,place){const o=await spaces.updateObject(id,{place});const sb=await client();
    const s=await spRun(sb.from("spaces").select("id,status").eq("id",o.space).limit(1));return {obj:Object.assign({},o,{place:spPlace(o.place)}),status:s&&s[0]?s[0].status:""}},
  uploadImage:spUpload,removeImages:spRemoveFiles,prepareImage:spPrepare,
  /* модерация: база пускает только админов, интерфейс лишь отражает */
  async review(status){const me=await spNeedMe();if(!me.owner)throw spFail("not_permitted");const sb=await client();
    let q=sb.from("spaces").select(SP_COLS);if(status)q=q.eq("status",status);return spDecorate(await spRun(q.order("updated_at",{ascending:false}).limit(500)))},
  async pendingCount(){const me=await spMe();if(!me.owner)return 0;const sb=await client();const d=await spRun(sb.from("spaces").select("id").eq("status","pending").limit(500));return (d||[]).length},
  approve(id){return spaces.update(id,{status:"approved",note:""})},
  hide(id,note){return spaces.update(id,note==null?{status:"hidden"}:{status:"hidden",note})},
  returnWithNote(id,note){return spaces.update(id,{status:"pending",note:String(note||"").slice(0,300)})}
};
/* правки предметов книги: читают все, пишут только админы */
let oeP=null;
const objEdits={
  url:spUrl,
  load(opts){opts=opts||{};if(oeP&&!opts.fresh)return oeP;oeP=(async()=>{const sb=await client();const d=await spRun(sb.from("obj_edits").select("id,data,updated_at").limit(5000));const out={};(d||[]).forEach(r=>{if(r&&typeof r.id==="string"&&r.data&&typeof r.data==="object")out[r.id]=r.data});return out})();
    oeP.catch(()=>{oeP=null});return oeP},
  async save(id,data){const me=await spNeedMe();if(!me.owner)throw spFail("not_permitted");id=String(id);if(!id||id.length>40)throw spFail("invalid");
    if(JSON.stringify(data).length>7000)throw spFail("invalid");const sb=await client();
    const ex=await spRun(sb.from("obj_edits").select("id").eq("id",id).limit(1));
    const d=await spRun(ex&&ex.length?sb.from("obj_edits").update({data,updated_by:me.id,updated_at:new Date().toISOString()}).eq("id",id).select("id,data"):sb.from("obj_edits").insert({id,data,updated_by:me.id}).select("id,data"));
    if(!d||!d.length)throw spFail("not_permitted");oeP=null;return d[0]},
  async remove(id){const me=await spNeedMe();if(!me.owner)throw spFail("not_permitted");const sb=await client();
    const d=await spRun(sb.from("obj_edits").delete().eq("id",String(id)).select("id"));oeP=null;return {id:String(id),removed:(d||[]).length}},
  /* часть 2: место предмета книги в 3D-музее (data.pos); pos=null — вернуть автоматическое; остальные правки сохраняются */
  async setPos(id,pos){const me=await spNeedMe();if(!me.owner)throw spFail("not_permitted");id=String(id);const sb=await client();
    const cur=await spRun(sb.from("obj_edits").select("id,data").eq("id",id).limit(1));const data=Object.assign({},cur&&cur[0]&&cur[0].data||{});
    if(pos&&isFinite(+pos.x)&&isFinite(+pos.z)&&typeof pos.h==="string")data.pos={h:pos.h.slice(0,4),x:+(+pos.x).toFixed(2),z:+(+pos.z).toFixed(2),r:isFinite(+pos.r)?Math.round(+pos.r)%360:0};else delete data.pos;
    if(!Object.keys(data).length){if(cur&&cur.length)await objEdits.remove(id);oeP=null;return {id,data:null}}
    const r=await objEdits.save(id,data);return {id,data:r.data}}
};
window.Backend={login,logout,configured:true,guest:!hasSes,spaces,objEdits};
/* кнопка «Войти» в шапке и в подсказках открывает окно входа, а не Claude */
document.addEventListener("click",ev=>{const a=ev.target.closest&&ev.target.closest(".whoin");if(a){ev.preventDefault();login()}},true);
/* «Выйти» в подвале */
document.addEventListener("DOMContentLoaded",async()=>{try{if(!(await uid()))return;css();const f=document.querySelector(".foot");if(!f)return;const b=document.createElement("button");b.type="button";b.className="be-out";b.textContent="Выйти из аккаунта";b.onclick=logout;f.appendChild(b)}catch(e){}});
})();

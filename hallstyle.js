/* «Оформление залов» — редактор вида десяти залов книги и «Базы Героев» для автора сайта (этап 12).
   Данные — таблица hall_styles (server/schema3.sql), форма — server/SPACES.md. Писать может только админ (решает база);
   здесь — форма, загрузка картинок, превью развёртки стены и применение к 3D-музею без перезагрузки страницы.
   Этап 13: «Добавить зал» — залы автора сайта (строки spaces с kind="hall", server/schema4.sql): название, подпись, этаж, размер и форма,
   стыковка (после какой двери коридора и с какой стороны; в музее книги — к какому залу, через какую стену и в каком месте — только свободные места),
   те же поверхности, картины, свет и подпись; удаление — с подтверждением. Предметы зала — редактором пространства (#space-edit-<id>) и «расстановкой» в 3D. */
window.HallStyleUI=(function(){
"use strict";
const A=()=>window.__APP,HB=()=>window.Backend&&Backend.hallStyles,AH=()=>window.Backend&&Backend.halls;
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const msgOf=e=>{try{return Backend.spaces.message(e)}catch(x){return "Не получилось. Попробуйте ещё раз."}};
const PART={wall:"Стены",floor:"Пол",ceil:"Потолок"},WALLN={n:"напротив входа",s:"у входа",e:"справа",w:"слева"},LIGHT=[["","как задумано"],["warm","тёплый"],["cool","холодный"],["neutral","нейтральный"]];
const DOCKW={e:"правая стена",w:"левая стена",s:"торцевая стена у входа"};
const info=br=>{try{return window.Museum&&Museum.hallInfo?Museum.hallInfo(br):{}}catch(e){return {}}};
const clone=o=>JSON.parse(JSON.stringify(o||{}));
const SIZES={s:{room:[6,6],gallery:[10,4]},m:{room:[9,7],gallery:[14,5]},l:{room:[12,9],gallery:[20,6]}};
const HEX=/^#[0-9a-fA-F]{6}$/;
const isA=x=>x==="new"||/^a:/.test(x);
/* этажи сайта (floors.js); «∞» — без 3D, не предлагается. −1 — два варианта: коридор этажа и ветка музея книги */
function floorOpts(){const F=(window.Floors&&Floors.FLOORS)||[{k:"551"},{k:"43"},{k:"17"},{k:"-1"}];const lab=k=>k==="-1"?"−1":k;const o=[];
  F.forEach(f=>{if(f.k==="inf")return;if(f.k==="-1"){o.push(["book","Этаж −1 · Музей книги — ветка от зала"]);o.push(["-1","Этаж −1 · коридор этажа"+(f.who?" («"+f.who+"»)":"")])}else o.push([f.k,"Этаж "+lab(f.k)+(f.who?" · "+f.who:"")])});return o}

function css(){if(document.getElementById("hsCss"))return;const s=document.createElement("style");s.id="hsCss";s.textContent=`
.hsd{position:fixed;inset:0;z-index:96;background:rgba(10,12,14,.55);display:grid;place-items:center;padding:10px}
.hsd .box{background:var(--sheet,#fff);color:var(--ink,#111);border:1px solid var(--ink,#111);width:min(980px,100%);max-height:94vh;overflow:auto;padding:16px;box-sizing:border-box;display:grid;gap:12px}
.hsd h3{margin:0;font-size:20px;font-weight:600}.hsd h4{margin:0;font-size:15px;font-weight:600}
.hsd .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.hsd .cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:start}
@media (max-width:760px){.hsd .cols{grid-template-columns:minmax(0,1fr)}.hsd .pv{order:-1}}
.hsd fieldset{border:1px solid var(--line,#ccc);padding:10px;margin:0;display:grid;gap:8px;min-width:0}
.hsd legend{font-size:14px;font-weight:600;padding:0 4px}
.hsd label.f{display:grid;gap:4px;font-size:13px;color:var(--muted,#666);min-width:0}
.hsd input[type=text],.hsd input[type=number],.hsd textarea,.hsd select{font:inherit;font-size:16px;color:var(--ink,#111);background:var(--sheet,#fff);border:1px solid var(--line,#ccc);border-radius:6px;padding:8px 10px;min-height:44px;min-width:0;width:100%;box-sizing:border-box}
.hsd textarea{min-height:64px;resize:vertical}
.hsd input[type=color]{width:56px;height:44px;padding:2px;border:1px solid var(--line,#ccc);background:var(--sheet,#fff);border-radius:6px;flex:none}
.hsd .chk{display:flex;align-items:center;gap:8px;min-height:44px;font-size:14px;color:var(--ink,#111)}.hsd .chk input{width:20px;height:20px;margin:0}
.hsd .seg{display:flex;flex-wrap:wrap;gap:6px}.hsd .seg label{display:flex;align-items:center;gap:6px;min-height:44px;padding:0 12px;border:1px solid var(--line,#ccc);border-radius:6px;font-size:14px;color:var(--ink,#111);cursor:pointer}
.hsd .seg input{width:18px;height:18px;margin:0}
.hsd .b{min-height:44px;min-width:44px;padding:9px 14px;border:1px solid var(--ink,#111);background:var(--ink,#111);color:var(--paper,#fff);border-radius:6px;font:inherit;font-size:14px;cursor:pointer;line-height:1.2}
.hsd .b.gh{background:var(--sheet,#fff);color:var(--ink,#111)}.hsd .b.warn{background:var(--sheet,#fff);border-color:var(--warn,#B3261E);color:var(--warn,#B3261E)}.hsd .b.sm{padding:6px 10px;font-size:13px}
.hsd .b.del{background:var(--warn,#B3261E);border-color:var(--warn,#B3261E);color:#fff}
.hsd .b:disabled{opacity:.5;cursor:default}
.hsd .b:focus-visible,.hsd input:focus-visible,.hsd select:focus-visible,.hsd textarea:focus-visible,.hsd .file:focus-within{outline:2px solid var(--stamp,#C8102E);outline-offset:2px}
.hsd .file{position:relative;overflow:hidden;display:inline-flex;align-items:center}.hsd .file input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.hsd .th{width:84px;height:60px;object-fit:cover;background:var(--paper,#eee);border:1px solid var(--line,#ccc);flex:none;display:block}
.hsd .th.none{display:grid;place-items:center;font-size:11px;color:var(--muted,#666)}
.hsd .hint{font-size:13px;color:var(--muted,#666);line-height:1.45;margin:0}
.hsd .msg{font-size:14px;min-height:20px}.hsd .msg.err{color:var(--warn,#B3261E)}
.hsd .pl{display:grid;gap:8px;margin:0;padding:0;list-style:none}
.hsd .pl li{border:1px solid var(--line,#ccc);padding:8px;display:grid;gap:8px}
.hsd .pl .g,.hsd .g3{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.hsd .g3{grid-template-columns:repeat(3,minmax(0,1fr))}
@media (max-width:520px){.hsd .pl .g{grid-template-columns:repeat(2,minmax(0,1fr))}.hsd .g3{grid-template-columns:minmax(0,1fr)}.hsd .box{padding:12px}}
.hsd .pv canvas,.hsd canvas.sch{width:100%;height:auto;display:block;border:1px solid var(--line,#ccc);background:#111}
.hsd .badge{font-family:var(--f-mono,monospace);font-size:10.5px;border:1px solid var(--line,#ccc);border-radius:999px;padding:1px 7px;margin-left:6px;white-space:nowrap}
.hsd .order{margin:0;padding-left:22px;font-size:13px;line-height:1.5;color:var(--ink,#111)}.hsd .order .me{font-weight:700;color:var(--stamp,#C8102E)}
.hsd .confirm{border:1px solid var(--warn,#B3261E);padding:10px;display:grid;gap:8px}
`;document.head.appendChild(s)}

let open_=null;
/* открыть редактор; k — код зала книги, "a:<id>" — зал автора, "new" — новый зал. Не админу — ничего не показываем */
async function open(k){if(!HB())return false;if(!(await Backend.isAdmin()))return false;if(open_){open_.pick(k);return true}css();
  const IDS=HB().IDS,app=A();const name=x=>(app&&app.hallName(x))||x;
  let saved={};try{saved=await HB().load({fresh:true})}catch(e){saved=app?clone(app.hallStyles()):{}}
  /* залы автора: строки из базы; черновики {st — вид (как у залов книги), meta — название, этаж, размер, стыковка} */
  let AHL=[];if(AH())try{AHL=await AH().load({fresh:true})}catch(e){AHL=app&&app.adminHalls?app.adminHalls().slice():[]}
  const rowOf=x=>AHL.find(r=>"a:"+r.id===x),bookRows=()=>AHL.filter(r=>r.floor==="-1"&&r.hall&&r.hall.dock&&r.hall.dock.hall);
  const toDraft=r=>{const R=r.room||{},W=(R.walls&&R.walls.all)||{},H=r.hall||{},sf=s=>{if(!s)return undefined;const o={mode:s.fit==="stretch"?"stretch":"tile"};if(HEX.test(s.color||""))o.color=s.color.toUpperCase();if(s.img)o.img=s.img;return o};
    const st={wall:sf(W),floor:sf(R.floor),ceil:sf(R.ceil)};if(H.paintings)st.paintings=clone(H.paintings);if(H.light)st.light=H.light;if(H.note)st.note=H.note;Object.keys(st).forEach(q=>st[q]===undefined&&delete st[q]);
    const book=r.floor==="-1"&&H.dock&&H.dock.hall;return {st,meta:{title:r.title||"",descr:r.descr||"",floor:book?"book":r.floor,size:R.size||"m",shape:R.shape||"room",h:+R.h||3.5,dock:clone(H.dock||{})}}};
  const fresh0=()=>({st:{wall:{color:"#E9E4DA",mode:"tile"},floor:{color:"#8B6F55",mode:"tile"},ceil:{color:"#F4F2EE",mode:"tile"}},meta:{title:"",descr:"",floor:"17",size:"m",shape:"room",h:3.5,dock:{after:null,side:"auto"}}});
  const savedA={};AHL.forEach(r=>savedA["a:"+r.id]=toDraft(r));
  const drafts={},fresh=new Set();let cur=k==="new"?"new":/^a:/.test(k||"")&&savedA[k]?k:IDS.indexOf(k)>=0?k:IDS[0],applied=false,pvWall="n",busy=false;
  const AD=()=>{if(!drafts[cur])drafts[cur]=cur==="new"?fresh0():clone(savedA[cur]||fresh0());return drafts[cur]};
  const D=()=>{if(isA(cur))return AD().st;if(!drafts[cur])drafts[cur]=clone(saved[cur]||{});return drafts[cur]};
  /* нормализация вида зала автора: картинки — из папки автора (или сайта) */
  const anorm=st=>{st=st||{};const o={};["wall","floor","ceil"].forEach(n=>{const s=st[n];if(!s)return;const x={};if(HEX.test(s.color||""))x.color=s.color.toUpperCase();if(s.img&&AH().imgOk(s.img))x.img=s.img;if(x.color||x.img){x.mode=s.mode==="stretch"?"stretch":"tile";o[n]=x}});
    const h=AH().norm({paintings:st.paintings,light:st.light,note:st.note});return Object.assign(o,h)};
  const NORM=(d,x)=>isA(x)?anorm(d):HB().norm(d,x);
  const dirty=x=>{if(isA(x)){if(x==="new")return !!drafts.new;const a=drafts[x];if(!a)return false;return JSON.stringify([anorm(a.st),a.meta])!==JSON.stringify([anorm(savedA[x].st),savedA[x].meta])}
    return JSON.stringify(HB().norm(drafts[x]||saved[x]||{},x))!==JSON.stringify(HB().norm(saved[x]||{},x))};
  /* геометрия для превью: залы книги — Museum.hallInfo (с проёмами веток); зал автора — по размеру и двери */
  const INFB=()=>info(bookRows());let INF=INFB();
  const ainf=()=>{const m=AD().meta,wd=(SIZES[m.size]||SIZES.m)[m.shape==="gallery"?"gallery":"room"],B=(window.Museum&&Museum.BR)||{dw:1.6,dh:2.5},bk=m.floor==="book";
    return {L:{n:wd[0],s:wd[0],e:wd[1],w:wd[1]},H:+m.h||3.5,wall:"#E9E4DA",ceil:"#F4F2EE",floor:"#8B6F55",doors:{s:[bk?B.dw:1.2,bk?B.dh:2.2,0]},w:wd[0],d:wd[1]}};
  const I_=()=>isA(cur)?ainf():(INF[cur]||{L:{n:16,s:16,e:16,w:16},H:4});
  const opener=document.activeElement;
  const dlg=document.createElement("div");dlg.className="hsd";
  dlg.innerHTML=`<div class="box" role="dialog" aria-modal="true" aria-labelledby="hsH">
    <div class="row" style="justify-content:space-between"><h3 id="hsH">Оформление залов</h3><div class="row"><button type="button" class="b sm" data-addhall>Добавить зал</button><button type="button" class="b gh sm" data-x>Закрыть</button></div></div>
    <p class="hint" id="hsIntro"></p>
    <label class="f">Зал<select id="hsK"></select></label>
    <div class="cols"><div class="ed" style="display:grid;gap:12px;min-width:0"></div>
      <div class="pv" style="display:grid;gap:8px;min-width:0"><h4>Превью развёртки</h4><div class="seg" role="radiogroup" aria-label="Какую стену показать">${["n","e","s","w"].map(w=>`<label><input type="radio" name="hsPv" value="${w}" ${w===pvWall?"checked":""}>${WALLN[w]}</label>`).join("")}</div>
        <canvas width="640" height="420" role="img" aria-label="Превью стены, пола и потолка с картинами"></canvas><p class="hint" id="hsPvH"></p></div></div>
    <div class="row" id="hsBtns"></div>
    <div id="hsConf"></div>
    <p class="msg" role="status" aria-live="polite" id="hsM"></p></div>`;
  (document.fullscreenElement||document.body).appendChild(dlg);
  const box=dlg.querySelector(".box"),ed=dlg.querySelector(".ed"),sel=dlg.querySelector("#hsK"),M=dlg.querySelector("#hsM"),cv=dlg.querySelector(".pv canvas"),btns=dlg.querySelector("#hsBtns"),conf=dlg.querySelector("#hsConf");
  const say=(t,err)=>{M.textContent=t||"";M.classList.toggle("err",!!err)};
  const aName=x=>x==="new"?"Новый зал":(rowOf(x)||{}).title||"зал";
  const fillSel=()=>{sel.innerHTML=`<optgroup label="Залы музея книги">${IDS.map(x=>`<option value="${x}" ${x===cur?"selected":""}>${esc(name(x))}${saved[x]?" · изменён":""}${dirty(x)?" · не сохранено":""}</option>`).join("")}</optgroup>
      <optgroup label="Залы автора сайта">${AHL.map(r=>{const x="a:"+r.id,m=(drafts[x]||savedA[x]).meta;return `<option value="${x}" ${x===cur?"selected":""}>${esc(r.title)} · ${m.floor==="book"?"ветка музея книги":"этаж "+(m.floor==="-1"?"−1":m.floor)}${dirty(x)?" · не сохранено":""}</option>`}).join("")}
      <option value="new" ${cur==="new"?"selected":""}>+ Добавить зал…</option></optgroup>`;
    dlg.querySelector("#hsIntro").textContent=isA(cur)?"Зал автора сайта: название, этаж, размер, место стыковки, стены, пол, потолок, картины, свет. Виден всем сразу после сохранения. Предметы зала — кнопкой «Предметы зала» и «расстановкой» в 3D.":"Цвет и картинки стен, пола и потолка, картины на стенах, свет. Видят все посетители после сохранения. Пустое поле — как задумано в книге."};
  /* картинки для превью */
  const IM=new Map();const img=u=>{if(!u)return null;let r=IM.get(u);if(!r){r={im:new Image(),ok:false,bad:false};r.im.crossOrigin="anonymous";r.im.onload=()=>{r.ok=true;draw()};r.im.onerror=()=>{r.bad=true;draw()};r.im.src=u;IM.set(u,r)}return r.ok?r.im:null};
  const U=p=>isA(cur)?AH().url(p):HB().url(p);
  function surfHTML(part){const s=D()[part]||{},I=I_(),def=part==="wall"?I.wall:part==="ceil"?I.ceil:I.floor;const id="hs_"+part;
    return `<fieldset data-part="${part}"><legend>${PART[part]}</legend>
      <div class="row"><label class="chk"><input type="checkbox" data-c ${s.color?"checked":""}>свой цвет</label><input type="color" data-col value="${esc(s.color||def||"#DDDDDD")}" aria-label="${esc(PART[part]+": цвет")}" ${s.color?"":"disabled"}></div>
      <div class="row">${s.img?`<img class="th" alt="" src="${esc(U(s.img))}">`:`<span class="th none" aria-hidden="true">нет</span>`}
        <span class="b gh sm file">${s.img?"Заменить картинку":"Загрузить картинку"}<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="${esc(PART[part]+": загрузить картинку")}" data-file></span>
        ${s.img?`<button type="button" class="b gh sm" data-noimg>Убрать картинку</button>`:""}</div>
      <div class="seg" role="radiogroup" aria-label="${esc(PART[part]+": как показать картинку")}"><label><input type="radio" name="${id}_m" value="tile" ${(s.mode||"tile")==="tile"?"checked":""}>повторять (плитка 2 м)</label><label><input type="radio" name="${id}_m" value="stretch" ${s.mode==="stretch"?"checked":""}>растянуть на всю поверхность</label></div>
      <p class="hint" data-st></p></fieldset>`}
  function paintHTML(){const P=D().paintings||[],I=I_();
    return `<fieldset data-paint><legend>Картины на стенах · ${P.length} из ${HB().LIMITS.paintings}</legend>
      <ul class="pl">${P.map((p,j)=>{const L=(I.L&&I.L[p.wall])||16;return `<li data-j="${j}"><div class="row"><img class="th" alt="" src="${esc(U(p.img))}"><label class="f" style="flex:1 1 180px">Подпись<input type="text" data-k="title" maxlength="120" value="${esc(p.title||"")}"></label>
          <button type="button" class="b warn sm" data-del aria-label="${esc("Удалить картину "+(p.title||j+1))}">Удалить</button></div>
        <div class="g"><label class="f">Стена<select data-k="wall">${["n","s","e","w"].map(w=>`<option value="${w}" ${p.wall===w?"selected":""}>${WALLN[w]}</option>`).join("")}</select></label>
          <label class="f">Сдвиг от середины, м<input type="number" data-k="u" step="0.1" min="${-(L/2).toFixed(1)}" max="${(L/2).toFixed(1)}" value="${p.u}" inputmode="decimal"></label>
          <label class="f">Высота центра, м<input type="number" data-k="y" step="0.1" min="0.3" max="${I.H||8}" value="${p.y}" inputmode="decimal"></label>
          <label class="f">Ширина × высота, м<span class="row" style="flex-wrap:nowrap;gap:4px"><input type="number" data-k="w" step="0.1" min="0.2" max="6" value="${p.w}" aria-label="Ширина картины, м" inputmode="decimal"><input type="number" data-k="h" step="0.1" min="0.2" max="6" value="${p.h}" aria-label="Высота картины, м" inputmode="decimal"></span></label></div></li>`}).join("")||`<li class="hint">Картин нет${cur==="sv"||cur==="se"||cur==="kr"?" — в зале остаются прежние картины":""}.</li>`}</ul>
      <div class="row"><span class="b gh sm file" ${P.length>=HB().LIMITS.paintings?'aria-disabled="true"':""}>Добавить картину<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Добавить картину: выбрать файл" data-addp ${P.length>=HB().LIMITS.paintings?"disabled":""}></span></div>
      <p class="hint">Сдвиг: плюс — вправо, если стоять лицом к стене. Картинка вписывается в размер целиком, пропорции фото сохраняются.${isA(cur)?" Картина, перекрывающая дверь, отодвигается в сторону.":" Если у зала есть свои картины, прежние картины зала (тёмные полотна, пейзажи) не показываются."}</p><p class="hint" data-pst></p></fieldset>`}
  /* ---- этап 13: поля зала автора: название, подпись, этаж, размер, стыковка ---- */
  const WROWS={};/* этаж → строки коридора (Backend.spaces.world) */
  function metaHTML(){const m=AD().meta,F=floorOpts(),R=rowOf(cur);
    return `<fieldset data-meta><legend>Зал</legend>
      <label class="f">Название (до 60 знаков)<input type="text" data-m="title" maxlength="60" value="${esc(m.title)}" required></label>
      <label class="f">Короткая подпись — на табличке у двери<textarea data-m="descr" maxlength="200">${esc(m.descr)}</textarea></label>
      <label class="f">Этаж<select data-m="floor">${F.map(([v,t])=>`<option value="${v}" ${m.floor===v?"selected":""}>${esc(t)}</option>`).join("")}</select></label>
      <div class="g3"><label class="f">Размер<select data-m="size">${[["s","малый"],["m","средний"],["l","большой"]].map(([v,t])=>`<option value="${v}" ${m.size===v?"selected":""}>${t}</option>`).join("")}</select></label>
        <label class="f">Форма<select data-m="shape"><option value="room" ${m.shape!=="gallery"?"selected":""}>комната</option><option value="gallery" ${m.shape==="gallery"?"selected":""}>галерея (вытянутая)</option></select></label>
        <label class="f">Высота, м<select data-m="h">${[3,3.5,4].map(v=>`<option value="${v}" ${+m.h===v?"selected":""}>${String(v).replace(".",",")}</option>`).join("")}</select></label></div>
      <p class="hint" data-msz></p>
      ${R?`<div class="row"><button type="button" class="b gh sm" data-objs>Предметы зала (${(R.objects||[]).length})</button><button type="button" class="b gh sm" data-go3d>Открыть зал в 3D</button></div>`:""}
    </fieldset><fieldset data-dock><legend>Стыковка: с каким помещением соединить</legend><div data-dockbody><p class="hint">Считаем свободные места…</p></div></fieldset>`}
  function wireMeta(){const fs=ed.querySelector("fieldset[data-meta]");if(!fs)return;const m=AD().meta;
    const szH=()=>{const I=ainf();fs.querySelector("[data-msz]").textContent=`${I.w} × ${I.d} м, высота ${String(m.h).replace(".",",")} м. Дверь — в середине стены «у входа».`};szH();
    fs.querySelectorAll("[data-m]").forEach(el=>{el.oninput=el.onchange=ev=>{const k=el.dataset.m;let v=el.value;if(k==="h")v=+v;const before=m[k];m[k]=v;
      if(k==="floor"&&before!==v){m.dock=v==="book"?{}:{after:null,side:"auto"}}
      if(k==="size"||k==="shape"||k==="h"){szH()}
      if((k==="floor"||k==="size"||k==="shape")&&ev.type==="change"){dockRender();draw()}else if(k==="h")draw();changed()}});
    const ob=fs.querySelector("[data-objs]");if(ob)ob.onclick=()=>{const id=cur.slice(2);close();location.hash="space-edit-"+id};
    const g3=fs.querySelector("[data-go3d]");if(g3)g3.onclick=()=>{const id=cur.slice(2);close();location.hash="space-"+id};
    dockRender()}
  /* стыковка: коридор — после какой двери и с какой стороны (мини-схема); музей книги — зал, стена, место (только свободные) */
  async function dockRender(){const host=ed.querySelector("[data-dockbody]");if(!host)return;const m=AD().meta,me_=cur==="new"?"_new":cur.slice(2),I=ainf();
    if(m.floor==="book"){const others=bookRows().filter(r=>r.id!==me_);const sp=window.Museum&&Museum.dockSpots?Museum.dockSpots(others,{w:I.w,d:I.d},me_):[];
      const d=m.dock||{};if(d.hall&&Museum.dockOk&&Museum.dockOk({id:me_,kind:"hall",room:{w:I.w,d:I.d},hall:{dock:d}},others)){let q=sp.find(x=>x.k===d.hall&&x.wall===d.wall);if(!q){q={k:d.hall,wall:d.wall,pos:[]};sp.push(q)}if(q.pos.indexOf(+d.at)<0){q.pos.push(+d.at);q.pos.sort((a,b)=>a-b)}}
      let cs=sp.find(q=>q.k===d.hall&&q.wall===d.wall);if(!cs||cs.pos.indexOf(+d.at)<0){const was=!!d.hall;cs=cs||sp[0];if(cs){m.dock={hall:cs.k,wall:cs.wall,at:cs.pos[Math.floor(cs.pos.length/2)]};if(was)say("Прежнее место не подходит для этого размера — выбрано ближайшее свободное.")}else m.dock={}}
      if(!sp.length){host.innerHTML=`<p class="hint" role="alert">Для зала ${I.w} × ${I.d} м в музее книги нет свободного места. Выберите размер поменьше или форму «комната».</p>`;drawSch();return}
      const halls=[...new Set(sp.map(q=>q.k))],walls=sp.filter(q=>q.k===m.dock.hall),pos=(walls.find(q=>q.wall===m.dock.wall)||walls[0]).pos;
      host.innerHTML=`<p class="hint">Новый зал примыкает боковой веткой: проём в стене выбранного зала, короткий проход и комната. Показаны только свободные места — без стеллажей, витрин, проёмов, других веток и залов.</p>
        <div class="g3"><label class="f">Зал музея книги<select data-d="hall">${halls.map(x=>`<option value="${x}" ${x===m.dock.hall?"selected":""}>${esc(name(x))}</option>`).join("")}</select></label>
          <label class="f">Стена<select data-d="wall">${walls.map(q=>`<option value="${q.wall}" ${q.wall===m.dock.wall?"selected":""}>${DOCKW[q.wall]||q.wall}</option>`).join("")}</select></label>
          <label class="f">Место проёма<select data-d="at">${pos.map(a=>`<option value="${a}" ${+a===+m.dock.at?"selected":""}>${m.dock.wall==="s"?(a===0?"посередине":Math.abs(a).toString().replace(".",",")+" м "+(a<0?"вправо":"влево")+" от середины"):String(a).replace(".",",")+" м от входа в зал"}</option>`).join("")}</select></label></div>
        <canvas class="sch" width="640" height="300" role="img" aria-label="Схема: зал музея книги, его проёмы и место нового зала"></canvas><p class="hint" data-schh></p>`;
      host.querySelectorAll("[data-d]").forEach(el=>el.onchange=()=>{const k=el.dataset.d;if(k==="hall"){const w=sp.find(q=>q.k===el.value);m.dock={hall:el.value,wall:w.wall,at:w.pos[Math.floor(w.pos.length/2)]}}
        else if(k==="wall"){const w=sp.find(q=>q.k===m.dock.hall&&q.wall===el.value);m.dock={hall:m.dock.hall,wall:el.value,at:w.pos[Math.floor(w.pos.length/2)]}}else m.dock.at=+el.value;
        dockRender().then(()=>{const e2=host.querySelector(`[data-d=${k}]`);if(e2)try{e2.focus()}catch(x){}});changed()});drawSch();return}
    const fl=m.floor;if(!WROWS[fl]){host.innerHTML=`<p class="hint">Загружаем двери этажа…</p>`;try{WROWS[fl]=await Backend.spaces.world(fl)}catch(e){WROWS[fl]=[];host.innerHTML=`<p class="hint" role="alert">${esc(msgOf(e))}</p>`}
      if(!ed.isConnected||AD().meta.floor!==fl)return}
    const rows=WROWS[fl].filter(r=>r.id!==me_),d=m.dock&&!m.dock.hall?m.dock:(m.dock={after:null,side:"auto"});if(d.after&&d.after!=="start"&&!rows.some(r=>r.id===d.after))d.after=null;
    host.innerHTML=`<p class="hint">Коридор этажа: двери по обе стороны. Зал встанет после выбранной двери (дальше от лифта) на выбранной стороне.</p>
      <div class="g3"><label class="f">Где в коридоре<select data-c="after"><option value="start" ${d.after==="start"?"selected":""}>в начало, у лифта</option>${plan(rows,null).RS.map(q=>`<option value="${q.s.id}" ${d.after===q.s.id?"selected":""}>после «${esc(q.s.title)}»</option>`).join("")}<option value="" ${!d.after?"selected":""}>в конец коридора</option></select></label>
        <label class="f">Сторона коридора<select data-c="side">${[["auto","по очереди с другими"],["l","слева"],["r","справа"]].map(([v,t])=>`<option value="${v}" ${(d.side||"auto")===v?"selected":""}>${t}</option>`).join("")}</select></label></div>
      <canvas class="sch" width="640" height="220" role="img" aria-label="Схема коридора: лифт, двери слева и справа, место нового зала"></canvas><ol class="order"></ol>`;
    host.querySelectorAll("[data-c]").forEach(el=>el.onchange=()=>{if(el.dataset.c==="after")d.after=el.value||null;else d.side=el.value;drawSch();changed()});drawSch()}
  const meRow=()=>{const m=AD().meta,I=ainf(),id=cur==="new"?"_new":cur.slice(2);return {id,kind:"hall",title:m.title||"Новый зал",room:{w:I.w,d:I.d,h:m.h},hall:{dock:m.dock}}};
  const plan=(rows,me)=>Museum.corrPlan(me?rows.concat([me]):rows);
  function drawSch(){const c=ed.querySelector("canvas.sch");if(!c)return;const g=c.getContext("2d"),W=c.width,H=c.height,m=AD().meta;g.fillStyle="#15171a";g.fillRect(0,0,W,H);g.font="13px Golos Text, sans-serif";g.textBaseline="middle";
    if(m.floor==="book"){const d=m.dock;if(!d||!d.hall)return;const k=d.hall,Iall=info(bookRows().filter(r=>r.id!==(cur==="new"?"_new":cur.slice(2)))),I=Iall[k];if(!I)return;
      const me=meRow(),G=Museum.branchGeo(me);const D_=I.L.e,sc=Math.min((W-40)/(D_+2*12),(H-30)/(16+2*10));const cx=W/2,cy=H/2;
      /* зал: вход — справа, вглубь — влево (как на мини-карте музея) */
      const X=z=>cx+(z)*sc,Y=x=>cy+x*sc;const hz0=D_/2;
      g.fillStyle="rgba(255,255,255,.12)";g.fillRect(X(-hz0),Y(-8),D_*sc,16*sc);g.strokeStyle="rgba(255,255,255,.7)";g.strokeRect(X(-hz0)+.5,Y(-8)+.5,D_*sc,16*sc);
      const da=I.doorsAll||{};g.fillStyle="#7FE3CC";["e","w"].forEach(w=>(da[w]||[]).forEach(dr=>{const u=dr[2],zz=w==="e"?u:-u,y=w==="e"?Y(8):Y(-8);g.fillRect(X(zz)-dr[0]*sc/2,y-3,dr[0]*sc,6)}));
      if(G){/* перевод в координаты схемы: середина зала — 0 */
        const midZ=(()=>{const L=Object.keys(Iall);let z=0;for(const q of L){if(q==="hb")break;const H_=Iall[q];if(q===k)return z-H_.L.e/2;z-=H_.L.e}return 0})();
        const rz=r=>[X(r[2]-midZ),X(r[3]-midZ)],rx=r=>[Y(r[0]),Y(r[1])];
        const st=G.stub,rm=G.room;g.fillStyle="rgba(224,58,30,.75)";{const a=rz(st),b=rx(st);g.fillRect(Math.min(a[0],a[1]),Math.min(b[0],b[1]),Math.abs(a[1]-a[0]),Math.abs(b[1]-b[0]))}
        {const a=rz(rm),b=rx(rm);g.fillStyle="rgba(224,58,30,.35)";g.fillRect(Math.min(a[0],a[1]),Math.min(b[0],b[1]),Math.abs(a[1]-a[0]),Math.abs(b[1]-b[0]));g.strokeStyle="#E03A1E";g.lineWidth=2;g.strokeRect(Math.min(a[0],a[1]),Math.min(b[0],b[1]),Math.abs(a[1]-a[0]),Math.abs(b[1]-b[0]));g.lineWidth=1;
          g.fillStyle="#FFFFFF";g.textAlign="center";g.fillText(String(m.title||"Новый зал").slice(0,28),(a[0]+a[1])/2,(b[0]+b[1])/2)}}
      g.fillStyle="#FFFFFF";g.textAlign="left";g.fillText(name(k)+" · вход →",X(-hz0)+6,Y(-8)+12);g.textAlign="right";g.fillText("вход в зал",X(hz0)-6,Y(8)-12);
      const hh=ed.querySelector("[data-schh]");if(hh)hh.textContent=`Схема сверху: «${name(k)}», бирюзовым — уже существующие проёмы, красным — проход и новый зал (${ainf().w} × ${ainf().d} м).`;return}
    const rows=(WROWS[m.floor]||[]).filter(r=>r.id!==(cur==="new"?"_new":cur.slice(2))),P=plan(rows,meRow()),LC=P.LC,sx=(W-30)/LC,X=z=>20+(-z)*sx,cy=H/2;
    g.fillStyle="rgba(255,255,255,.18)";g.fillRect(X(0),cy-14,X(-LC)-X(0),28);g.fillStyle="#7FE3CC";g.fillRect(X(0),cy-20,6,40);g.fillStyle="#FFFFFF";g.textAlign="left";g.fillText("лифт",X(0)+10,cy);
    const me_=cur==="new"?"_new":cur.slice(2);g.textAlign="center";
    P.RS.forEach((q,i)=>{const x=X(q.zc),bw=Math.max(10,q.w*sx-2),up=q.side===0,y=up?cy-14-60:cy+14,isMe=q.s.id===me_,hall=q.s.kind==="hall";
      g.fillStyle=isMe?"#E03A1E":hall?"rgba(127,227,204,.55)":"rgba(255,255,255,.35)";g.fillRect(x-bw/2,y,bw,60);g.fillStyle=isMe?"#FFFFFF":"#15171a";g.fillText(String(i+1),x,y+30)});
    g.fillStyle="rgba(255,255,255,.7)";g.textAlign="left";g.fillText("слева",4,14);g.fillText("справа",4,H-12);
    const ol=ed.querySelector("ol.order");if(ol)ol.innerHTML=P.RS.map(q=>`<li class="${q.s.id===me_?"me":""}">${esc(q.s.id===me_?(m.title||"Новый зал")+" — этот зал":q.s.title)} · ${q.side===0?"слева":"справа"}${q.s.kind==="hall"&&q.s.id!==me_?" · зал автора":""}</li>`).join("")}
  function render(){const d=D();conf.innerHTML="";
    ed.innerHTML=(isA(cur)?metaHTML():"")+["wall","floor","ceil"].map(surfHTML).join("")+paintHTML()+
      `<fieldset><legend>Свет и подпись</legend><label class="f">Свет зала<select data-light>${LIGHT.map(([v,t])=>`<option value="${v}" ${(d.light||"")===v?"selected":""}>${t}</option>`).join("")}</select></label>
       <label class="f">Подпись под названием зала (при входе)<textarea data-note maxlength="300">${esc(d.note||"")}</textarea></label></fieldset>`;
    btns.innerHTML=isA(cur)?`<button type="button" class="b" data-save>${cur==="new"?"Создать зал":"Сохранить"}</button>${AD().meta.floor==="book"?`<button type="button" class="b gh" data-apply>Применить без перезагрузки</button>`:""}${cur!=="new"?`<button type="button" class="b warn" data-delhall>Удалить зал</button>`:""}`
      :`<button type="button" class="b" data-save>Сохранить</button><button type="button" class="b gh" data-apply>Применить без перезагрузки</button><button type="button" class="b warn" data-reset>Сбросить к исходному</button>`;
    wire();wireBtns();if(isA(cur))wireMeta();fillSel();draw()}
  function wire(){
    ed.querySelectorAll("fieldset[data-part]").forEach(fs=>{const part=fs.dataset.part,st=fs.querySelector("[data-st]");const S=()=>{const d=D();if(!d[part])d[part]={mode:"tile"};return d[part]};
      const clean=()=>{const d=D(),s=d[part];if(s&&!s.color&&!s.img)delete d[part]};
      const c=fs.querySelector("[data-c]"),col=fs.querySelector("[data-col]");
      c.onchange=()=>{col.disabled=!c.checked;if(c.checked)S().color=col.value.toUpperCase();else{const s=D()[part];if(s)delete s.color;clean()}changed()};
      col.oninput=()=>{if(!c.checked)return;S().color=col.value.toUpperCase();changed()};
      fs.querySelectorAll(`input[type=radio]`).forEach(r=>r.onchange=()=>{if(r.checked){S().mode=r.value;clean();changed()}});
      const nb=fs.querySelector("[data-noimg]");if(nb)nb.onclick=()=>{const s=D()[part];if(s)delete s.img;clean();render();changed(true);focusIn(`fieldset[data-part=${part}] [data-file]`)};
      fs.querySelector("[data-file]").onchange=ev=>upload(ev,st,r=>{S().img=r.path;render();focusIn(`fieldset[data-part=${part}] [data-file]`)})});
    const pf=ed.querySelector("fieldset[data-paint]"),pst=pf.querySelector("[data-pst]");
    pf.querySelectorAll("li[data-j]").forEach(li=>{const j=+li.dataset.j;
      li.querySelectorAll("[data-k]").forEach(inp=>{const k=inp.dataset.k;inp.oninput=inp.onchange=()=>{const p=(D().paintings||[])[j];if(!p)return;
        if(k==="title"||k==="wall")p[k]=inp.value;else{const v=parseFloat(String(inp.value).replace(",","."));if(isFinite(v))p[k]=v}changed()}});
      li.querySelector("[data-del]").onclick=()=>{const P=D().paintings||[];P.splice(j,1);if(!P.length)delete D().paintings;render();changed(true);focusIn("[data-addp]")}});
    const ap=pf.querySelector("[data-addp]");if(ap)ap.onchange=ev=>upload(ev,pst,r=>{const d=D();d.paintings=d.paintings||[];const I=I_();
      const asp=r.w/r.h,w=asp>=1?1.4:+(1.05*asp).toFixed(2),h=asp>=1?+(1.4/asp).toFixed(2):1.05;
      const L=(I.L&&I.L[pvWall])||16,dr=I.doors&&I.doors[pvWall],n=d.paintings.filter(x=>x.wall===pvWall).length;
      let u=dr?+(Math.sign(dr[2]||-1)*-1*Math.min(L/2-w/2-.2,(dr[0]+w)/2+.4+n*(w+.4))).toFixed(2):+(((n%2?1:-1)*Math.ceil(n/2))*(w+.4)).toFixed(2);if(Math.abs(u)>L/2-w/2-.1)u=0;
      d.paintings.push({img:r.path,title:"",wall:pvWall,u,w,h,y:Math.min(1.6,+(I.H-h/2-.2).toFixed(2))});render();
      const li=ed.querySelectorAll(".pl li[data-j]");const last=li[li.length-1];if(last)try{last.querySelector("[data-k=title]").focus()}catch(e){}});
    ed.querySelector("[data-light]").onchange=ev=>{const v=ev.target.value;if(v)D().light=v;else delete D().light;changed()};
    ed.querySelector("[data-note]").oninput=ev=>{const v=ev.target.value;if(v.trim())D().note=v;else delete D().note;changed()}}
  const focusIn=q=>{const e=ed.querySelector(q);if(e)try{e.focus()}catch(x){}};
  function changed(){fillSel();draw();say(dirty(cur)?"Есть несохранённые изменения.":"")}
  async function upload(ev,st,done){const file=ev.target.files&&ev.target.files[0];ev.target.value="";if(!file||busy)return;busy=true;setBusy(true);st.textContent="Проверяем и уменьшаем картинку…";st.style.color="";
    const onProgress=p=>{st.textContent=p.stage==="prepare"?"Уменьшаем картинку…":p.stage==="upload"?"Загружаем…":"Загружено"};
    try{const r=isA(cur)?await AH().uploadImage(file,{onProgress}):await HB().uploadImage(file,cur,{onProgress});fresh.add(r.path);
      st.textContent="Загружено: "+Math.round(r.bytes/1024)+" КБ, "+r.w+"×"+r.h+". Не забудьте сохранить.";busy=false;setBusy(false);done(r);changed(true)}
    catch(e){busy=false;setBusy(false);st.textContent=msgOf(e);st.style.color="var(--warn,#B3261E)"}}
  function setBusy(v){dlg.querySelectorAll("[data-save],[data-apply],[data-reset],[data-delhall],[data-addhall]").forEach(b=>b.disabled=v)}
  /* превью: развёртка выбранной стены (с проёмами), полоса пола снизу и потолка сверху; картины — по местам и размерам */
  function draw(){const g=cv.getContext("2d"),I=I_();if(!I||!I.L){g.clearRect(0,0,cv.width,cv.height);return}const d=NORM(D(),cur),L=I.L[pvWall],H=I.H;
    const W=cv.width,band=56;let sc=(W-20)/L;if(H*sc>360)sc=360/H;const need=Math.round(2*band+24+H*sc);if(cv.height!==need)cv.height=need;const ww=L*sc,wh=H*sc,x0=(W-ww)/2,y0=band+10;
    g.fillStyle="#15171a";g.fillRect(0,0,W,cv.height);
    const fillSurf=(s,def,x,y,w,h,mpp)=>{g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.fillStyle=(s&&s.color)||def||"#ccc";g.fillRect(x,y,w,h);
      const im=s&&s.img?img(U(s.img)):null;if(im){if(s.mode==="stretch")g.drawImage(im,x,y,w,h);else{const tw=2*mpp,th=tw*im.naturalHeight/im.naturalWidth;for(let yy=y+h-th;yy>y-th;yy-=th)for(let xx=x;xx<x+w;xx+=tw)g.drawImage(im,xx,yy,tw,th)}}g.restore()};
    fillSurf(d.ceil,I.ceil,x0,10,ww,band-4,sc*.5);fillSurf(d.floor,I.floor,x0,y0+wh+4,ww,band-4,sc*.5);fillSurf(d.wall,I.wall,x0,y0,ww,wh,sc);
    const drs=(I.doorsAll&&I.doorsAll[pvWall])||(I.doors&&I.doors[pvWall]?[I.doors[pvWall]]:[]);g.fillStyle="rgba(0,0,0,.6)";drs.forEach(dr=>g.fillRect(x0+(L/2+dr[2]-dr[0]/2)*sc,y0+wh-dr[1]*sc,dr[0]*sc,dr[1]*sc));
    (d.paintings||[]).forEach(p=>{if(p.wall!==pvWall)return;const ft=Museum.hallPaintFit(p,L,H,drs.length?drs:null),w=ft.w,h=ft.h,u=ft.u,y=ft.y;
      const im=img(U(p.img));let pw=w,ph=h;if(im){const a=im.naturalWidth/im.naturalHeight;if(pw/ph>a)pw=ph*a;else ph=pw/a}
      const cx=x0+(L/2+u)*sc,cy=y0+wh-y*sc;g.fillStyle="#24201C";g.fillRect(cx-pw*sc/2-3,cy-ph*sc/2-3,pw*sc+6,ph*sc+6);
      if(im)g.drawImage(im,cx-pw*sc/2,cy-ph*sc/2,pw*sc,ph*sc);else{g.fillStyle="#E6E1D8";g.fillRect(cx-pw*sc/2,cy-ph*sc/2,pw*sc,ph*sc)}});
    g.font="12px Golos Text, sans-serif";[["потолок",x0+4,24],["пол",x0+4,y0+wh+20]].forEach(([t,x,y])=>{g.fillStyle="rgba(0,0,0,.6)";g.fillRect(x-2,y-12,g.measureText(t).width+6,16);g.fillStyle="#FFFFFF";g.fillText(t,x+1,y)});
    const ph_=dlg.querySelector("#hsPvH");if(ph_)ph_.textContent=`${isA(cur)?(AD().meta.title||aName(cur)):name(cur)} · стена ${WALLN[pvWall]}: ${L.toFixed(1)} × ${H.toFixed(1)} м${drs.length?" · тёмное — проём":""}. Полосы пола и потолка — в том же масштабе плитки.`}
  dlg.querySelectorAll("input[name=hsPv]").forEach(r=>r.onchange=()=>{if(r.checked){pvWall=r.value;draw()}});
  sel.onchange=()=>{cur=sel.value;render();say(dirty(cur)?"Есть несохранённые изменения.":"")};
  /* применить к 3D-музею: сохранённое для всех залов + черновик текущего */
  const applyMap=m=>{if(!app)return false;app.setHallStyles(m);return app.remountMuseum()};
  /* зал автора → строка для базы */
  function toPayload(){const a=AD(),m=a.meta,st=anorm(a.st),orig=rowOf(cur),sv=(s,def)=>({img:s&&s.img||"",fit:s&&s.mode==="stretch"?"stretch":"tile",color:s&&s.color||def,tile:2});
    const ow=orig&&orig.room&&orig.room.walls||{};const room={size:m.size,shape:m.shape,h:+m.h,walls:Object.assign({},ow,{mode:ow.mode==="each"?"each":"one",all:sv(st.wall,"#E9E4DA")}),floor:sv(st.floor,"#8B6F55"),ceil:sv(st.ceil,"#F4F2EE")};
    const hall={dock:m.dock||{}};if(st.paintings)hall.paintings=st.paintings;if(st.light)hall.light=st.light;if(st.note)hall.note=st.note;
    return {floor:m.floor==="book"?"-1":m.floor,title:String(m.title||"").trim(),descr:m.descr||"",room,hall}}
  async function afterAdmin(t,book){let ok=false;try{const r=await app.reloadAdminHalls();AHL=r.slice()}catch(e){}if(book)ok=app.remountMuseum();INF=INFB();say(t+(book&&ok?" Музей перезапущен.":""))}
  async function saveA(){const m=AD().meta;if(!String(m.title||"").trim()){say("Введите название зала.",true);focusIn("[data-m=title]");return}
    const pay=toPayload();if(m.floor==="book"){const others=bookRows().filter(r=>r.id!==(cur==="new"?"_new":cur.slice(2)));const why=Museum.branchClash({id:cur==="new"?"_new":cur.slice(2),kind:"hall",room:{w:ainf().w,d:ainf().d},hall:pay.hall},others);
      if(!pay.hall.dock.hall||why.length){say("Место стыковки занято или не выбрано"+(why.length?": пересекается с "+why.join(", "):"")+". Выберите другое.",true);return}}
    if(JSON.stringify(pay.hall).length>AH().LIMITS.bytes){say("Слишком много данных для одного зала: уберите часть картин или подписей.",true);return}
    setBusy(true);say(cur==="new"?"Создаём зал…":"Сохраняем…");
    try{const r=cur==="new"?await AH().create(pay):await AH().save(cur.slice(2),pay);const x="a:"+r.id;fresh.forEach(p=>fresh.delete(p));delete drafts[cur];delete drafts.new;
      await afterAdmin(cur==="new"?"Зал создан.":"Сохранено.",m.floor==="book"||(rowOf(cur)&&rowOf(cur).floor==="-1"&&rowOf(cur).hall.dock&&rowOf(cur).hall.dock.hall));
      savedA[x]=toDraft(rowOf(x)||r);cur=x;applied=false;setBusy(false);render();
      say((M.textContent||"Сохранено.")+(m.floor==="book"?" Зал виден в музее книги (Этаж −1, «Войти»).":" Зал виден на этаже "+(m.floor==="-1"?"−1":m.floor)+" — «Пройти по этажу» или «Открыть зал в 3D»."))}
    catch(e){setBusy(false);say(msgOf(e),true)}}
  function delAsk(){const r=rowOf(cur);if(!r)return;const n=(r.objects||[]).length;
    conf.innerHTML=`<div class="confirm" role="alertdialog" aria-labelledby="hsDelT"><p class="hint" id="hsDelT" style="color:var(--ink,#111)">Удалить зал «${esc(r.title)}»? Вместе с ним без возврата удалятся его предметы (${n}) и все картинки зала из хранилища.</p>
      <div class="row"><button type="button" class="b del" data-delyes>Удалить навсегда</button><button type="button" class="b gh" data-delno>Отмена</button></div></div>`;
    conf.querySelector("[data-delno]").onclick=()=>{conf.innerHTML="";const b=btns.querySelector("[data-delhall]");if(b)b.focus()};
    conf.querySelector("[data-delyes]").onclick=async()=>{const book=r.floor==="-1"&&r.hall&&r.hall.dock&&r.hall.dock.hall;setBusy(true);say("Удаляем зал…");conf.querySelector("[data-delyes]").disabled=true;
      try{const res=await AH().remove(r.id);delete drafts[cur];delete savedA[cur];await afterAdmin("Зал удалён"+(res&&res.files?" (картинок удалено: "+res.files.removed+")":"")+".",book);cur=IDS[0];setBusy(false);const t=M.textContent;render();say(t);try{sel.focus()}catch(e){}}
      catch(e){setBusy(false);say(msgOf(e),true);const y=conf.querySelector("[data-delyes]");if(y)y.disabled=false}};
    conf.querySelector("[data-delyes]").focus()}
  function wireBtns(){const sv=btns.querySelector("[data-save]"),ap=btns.querySelector("[data-apply]"),rs=btns.querySelector("[data-reset]"),dl=btns.querySelector("[data-delhall]");
    if(isA(cur)){sv.onclick=saveA;if(dl)dl.onclick=delAsk;
      if(ap)ap.onclick=()=>{const pay=toPayload(),id=cur==="new"?"_new":cur.slice(2),list=(app.adminHalls()||[]).filter(r=>r.id!==id),orig=rowOf(cur)||{objects:[]};
        list.push(Object.assign({},orig,{id,kind:"hall",floor:"-1",title:pay.title||"Новый зал",descr:pay.descr,room:Object.assign({w:ainf().w,d:ainf().d},pay.room),hall:pay.hall,objects:orig.objects||[],canEdit:true}));
        applied=true;app.setAdminHalls(list);const ok=app.remountMuseum();say(ok?"Показано в музее, но ещё не сохранено.":"Применено — откройте 3D-музей (Этаж −1, «Войти»), пока без сохранения.")};return}
    sv.onclick=async()=>{const n=HB().norm(D(),cur);if(JSON.stringify(n).length>HB().LIMITS.bytes){say("Слишком много данных для одного зала: уберите часть картин или подписей.",true);return}
      setBusy(true);say("Сохраняем…");
      try{const r=await HB().save(cur,n);if(r&&r.data&&Object.keys(r.data).length)saved[cur]=r.data;else delete saved[cur];drafts[cur]=clone(saved[cur]||{});applied=false;
        const keep=new Set(Object.keys(saved).flatMap(x=>HB().images(saved[x])));fresh.forEach(p=>{if(keep.has(p))fresh.delete(p)});
        const ok=applyMap(clone(saved));setBusy(false);render();say("Сохранено."+(ok?" Музей перезапущен с новым видом.":" Посетители увидят новый вид при входе в музей."))}
      catch(e){setBusy(false);say(msgOf(e),true)}};
    ap.onclick=()=>{const m=clone(saved);const n=HB().norm(D(),cur);if(Object.keys(n).length)m[cur]=n;else delete m[cur];applied=true;
      const ok=applyMap(m);say(ok?"Показано в музее, но ещё не сохранено. «Сохранить» — чтобы увидели все.":"Применено. Откройте 3D-музей (Этаж −1, «Войти»), чтобы увидеть — пока без сохранения.")};
    rs.onclick=async()=>{if(rs.dataset.sure!=="1"){rs.dataset.sure="1";rs.textContent="Точно сбросить? Нажмите ещё раз";setTimeout(()=>{if(!rs.isConnected)return;rs.dataset.sure="";rs.textContent="Сбросить к исходному"},5000);return}
      rs.dataset.sure="";rs.textContent="Сбросить к исходному";setBusy(true);say("Сбрасываем…");
      try{if(saved[cur])await HB().remove(cur);delete saved[cur];drafts[cur]={};applied=false;const ok=applyMap(clone(saved));setBusy(false);render();say("Зал возвращён к исходному виду."+(ok?" Музей перезапущен.":""))}
      catch(e){setBusy(false);say(msgOf(e),true)}}}
  dlg.querySelector("[data-addhall]").onclick=()=>{cur="new";render();focusIn("[data-m=title]")};
  /* закрыть: несохранённые загрузки удаляются из хранилища; показанный без сохранения черновик убирается из музея */
  function close(){if(!dlg.isConnected)return;const keep=new Set(Object.keys(saved).flatMap(x=>HB().images(saved[x])));AHL.forEach(r=>{(r.hall&&r.hall.paintings||[]).forEach(p=>keep.add(p.img));Backend.spaces.roomImages(r.room).forEach(p=>keep.add(p))});
    const gone=[...fresh].filter(p=>!keep.has(p)),gH=gone.filter(p=>/^halls\//.test(p)),gA=gone.filter(p=>!/^halls\//.test(p));if(gH.length)HB().removeImages(gH).catch(()=>{});if(gA.length&&AH())AH().removeImages(gA).catch(()=>{});
    if(applied){if(app.reloadAdminHalls)app.reloadAdminHalls().catch(()=>{}).then(()=>applyMap(clone(saved)));else applyMap(clone(saved))}dlg.remove();document.removeEventListener("keydown",onKey,true);open_=null;const back=opener&&opener.isConnected?opener:document.querySelector("#spHall")||document.querySelector(".hallwrap canvas");if(back)try{back.focus({preventScroll:true})}catch(e){}}
  const onKey=ev=>{if(!dlg.isConnected)return;if(ev.key==="Escape"){ev.preventDefault();ev.stopPropagation();if(conf.innerHTML){conf.innerHTML="";const b=btns.querySelector("[data-delhall]");if(b)b.focus();return}close()}else if(ev.key==="Tab"){const fs=[...box.querySelectorAll("button,input,select,textarea")].filter(x=>!x.disabled&&x.offsetParent!==null);if(!fs.length)return;const a=fs[0],z=fs[fs.length-1];
      if(ev.shiftKey&&document.activeElement===a){ev.preventDefault();z.focus()}else if(!ev.shiftKey&&document.activeElement===z){ev.preventDefault();a.focus()}else if(!box.contains(document.activeElement)){ev.preventDefault();a.focus()}}};
  document.addEventListener("keydown",onKey,true);
  /* клавиши внутри окна не доходят до музея (WASD, пробел) */
  ["keydown","keyup"].forEach(t=>dlg.addEventListener(t,ev=>ev.stopPropagation()));
  dlg.addEventListener("pointerdown",ev=>{if(ev.target===dlg)close()});dlg.querySelector("[data-x]").onclick=close;
  open_={pick:x=>{if(x==="new"||(IDS.indexOf(x)>=0||savedA[x])&&x!==cur){cur=x;render()}},close};
  render();try{(cur==="new"?ed.querySelector("[data-m=title]"):sel).focus()}catch(e){}return true}
return {open,close:()=>{if(open_)open_.close()}};
})();

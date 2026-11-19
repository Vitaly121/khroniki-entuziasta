/* «Оформление залов» — редактор вида десяти залов книги и «Базы Героев» для автора сайта (этап 12).
   Данные — таблица hall_styles (server/schema3.sql), форма — server/SPACES.md. Писать может только админ (решает база);
   здесь — форма, загрузка картинок, превью развёртки стены и применение к 3D-музею без перезагрузки страницы. */
window.HallStyleUI=(function(){
"use strict";
const A=()=>window.__APP,HB=()=>window.Backend&&Backend.hallStyles;
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const msgOf=e=>{try{return Backend.spaces.message(e)}catch(x){return "Не получилось. Попробуйте ещё раз."}};
const PART={wall:"Стены",floor:"Пол",ceil:"Потолок"},WALLN={n:"напротив входа",s:"у входа",e:"справа",w:"слева"},LIGHT=[["","как задумано"],["warm","тёплый"],["cool","холодный"],["neutral","нейтральный"]];
const info=()=>{try{return window.Museum&&Museum.hallInfo?Museum.hallInfo():{}}catch(e){return {}}};
const clone=o=>JSON.parse(JSON.stringify(o||{}));

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
.hsd .b:disabled{opacity:.5;cursor:default}
.hsd .b:focus-visible,.hsd input:focus-visible,.hsd select:focus-visible,.hsd textarea:focus-visible,.hsd .file:focus-within{outline:2px solid var(--stamp,#C8102E);outline-offset:2px}
.hsd .file{position:relative;overflow:hidden;display:inline-flex;align-items:center}.hsd .file input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.hsd .th{width:84px;height:60px;object-fit:cover;background:var(--paper,#eee);border:1px solid var(--line,#ccc);flex:none;display:block}
.hsd .th.none{display:grid;place-items:center;font-size:11px;color:var(--muted,#666)}
.hsd .hint{font-size:13px;color:var(--muted,#666);line-height:1.45;margin:0}
.hsd .msg{font-size:14px;min-height:20px}.hsd .msg.err{color:var(--warn,#B3261E)}
.hsd .pl{display:grid;gap:8px;margin:0;padding:0;list-style:none}
.hsd .pl li{border:1px solid var(--line,#ccc);padding:8px;display:grid;gap:8px}
.hsd .pl .g{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}
@media (max-width:520px){.hsd .pl .g{grid-template-columns:repeat(2,minmax(0,1fr))}.hsd .box{padding:12px}}
.hsd .pv canvas{width:100%;height:auto;display:block;border:1px solid var(--line,#ccc);background:#111}
.hsd .badge{font-family:var(--f-mono,monospace);font-size:10.5px;border:1px solid var(--line,#ccc);border-radius:999px;padding:1px 7px;margin-left:6px;white-space:nowrap}
`;document.head.appendChild(s)}

let open_=null;
/* открыть редактор; k — код зала (по умолчанию первый). Не админу — ничего не показываем */
async function open(k){if(!HB())return false;if(!(await Backend.isAdmin()))return false;if(open_){open_.pick(k);return true}css();
  const IDS=HB().IDS,INF=info(),app=A();const name=x=>(app&&app.hallName(x))||x;
  let saved={};try{saved=await HB().load({fresh:true})}catch(e){saved=app?clone(app.hallStyles()):{}}
  const drafts={},fresh=new Set();let cur=IDS.indexOf(k)>=0?k:IDS[0],applied=false,pvWall="n",busy=false;
  const D=()=>{if(!drafts[cur])drafts[cur]=clone(saved[cur]||{});return drafts[cur]};
  const dirty=x=>JSON.stringify(HB().norm(drafts[x]||saved[x]||{},x))!==JSON.stringify(HB().norm(saved[x]||{},x));
  const opener=document.activeElement;
  const dlg=document.createElement("div");dlg.className="hsd";
  dlg.innerHTML=`<div class="box" role="dialog" aria-modal="true" aria-labelledby="hsH">
    <div class="row" style="justify-content:space-between"><h3 id="hsH">Оформление залов</h3><button type="button" class="b gh sm" data-x>Закрыть</button></div>
    <p class="hint">Цвет и картинки стен, пола и потолка, картины на стенах, свет. Видят все посетители после сохранения. Пустое поле — как задумано в книге.</p>
    <label class="f">Зал<select id="hsK"></select></label>
    <div class="cols"><div class="ed" style="display:grid;gap:12px;min-width:0"></div>
      <div class="pv" style="display:grid;gap:8px;min-width:0"><h4>Превью развёртки</h4><div class="seg" role="radiogroup" aria-label="Какую стену показать">${["n","e","s","w"].map(w=>`<label><input type="radio" name="hsPv" value="${w}" ${w===pvWall?"checked":""}>${WALLN[w]}</label>`).join("")}</div>
        <canvas width="640" height="420" role="img" aria-label="Превью стены, пола и потолка с картинами"></canvas><p class="hint" id="hsPvH"></p></div></div>
    <div class="row"><button type="button" class="b" data-save>Сохранить</button><button type="button" class="b gh" data-apply>Применить без перезагрузки</button><button type="button" class="b warn" data-reset>Сбросить к исходному</button></div>
    <p class="msg" role="status" aria-live="polite" id="hsM"></p></div>`;
  (document.fullscreenElement||document.body).appendChild(dlg);
  const box=dlg.querySelector(".box"),ed=dlg.querySelector(".ed"),sel=dlg.querySelector("#hsK"),M=dlg.querySelector("#hsM"),cv=dlg.querySelector(".pv canvas");
  const say=(t,err)=>{M.textContent=t||"";M.classList.toggle("err",!!err)};
  const fillSel=()=>{sel.innerHTML=IDS.map(x=>`<option value="${x}" ${x===cur?"selected":""}>${esc(name(x))}${saved[x]?" · изменён":""}${dirty(x)?" · не сохранено":""}</option>`).join("")};
  /* картинки для превью */
  const IM=new Map();const img=u=>{if(!u)return null;let r=IM.get(u);if(!r){r={im:new Image(),ok:false,bad:false};r.im.crossOrigin="anonymous";r.im.onload=()=>{r.ok=true;draw()};r.im.onerror=()=>{r.bad=true;draw()};r.im.src=u;IM.set(u,r)}return r.ok?r.im:null};
  const U=p=>HB().url(p);
  function surfHTML(part){const s=D()[part]||{},I=INF[cur]||{},def=part==="wall"?I.wall:part==="ceil"?I.ceil:I.floor;const id="hs_"+part;
    return `<fieldset data-part="${part}"><legend>${PART[part]}</legend>
      <div class="row"><label class="chk"><input type="checkbox" data-c ${s.color?"checked":""}>свой цвет</label><input type="color" data-col value="${esc(s.color||def||"#DDDDDD")}" aria-label="${esc(PART[part]+": цвет")}" ${s.color?"":"disabled"}></div>
      <div class="row">${s.img?`<img class="th" alt="" src="${esc(U(s.img))}">`:`<span class="th none" aria-hidden="true">нет</span>`}
        <span class="b gh sm file">${s.img?"Заменить картинку":"Загрузить картинку"}<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="${esc(PART[part]+": загрузить картинку")}" data-file></span>
        ${s.img?`<button type="button" class="b gh sm" data-noimg>Убрать картинку</button>`:""}</div>
      <div class="seg" role="radiogroup" aria-label="${esc(PART[part]+": как показать картинку")}"><label><input type="radio" name="${id}_m" value="tile" ${(s.mode||"tile")==="tile"?"checked":""}>повторять (плитка 2 м)</label><label><input type="radio" name="${id}_m" value="stretch" ${s.mode==="stretch"?"checked":""}>растянуть на всю поверхность</label></div>
      <p class="hint" data-st></p></fieldset>`}
  function paintHTML(){const P=D().paintings||[],I=INF[cur]||{L:{n:16},H:4};
    return `<fieldset data-paint><legend>Картины на стенах · ${P.length} из ${HB().LIMITS.paintings}</legend>
      <ul class="pl">${P.map((p,j)=>{const L=(I.L&&I.L[p.wall])||16;return `<li data-j="${j}"><div class="row"><img class="th" alt="" src="${esc(U(p.img))}"><label class="f" style="flex:1 1 180px">Подпись<input type="text" data-k="title" maxlength="120" value="${esc(p.title||"")}"></label>
          <button type="button" class="b warn sm" data-del aria-label="${esc("Удалить картину "+(p.title||j+1))}">Удалить</button></div>
        <div class="g"><label class="f">Стена<select data-k="wall">${["n","s","e","w"].map(w=>`<option value="${w}" ${p.wall===w?"selected":""}>${WALLN[w]}</option>`).join("")}</select></label>
          <label class="f">Сдвиг от середины, м<input type="number" data-k="u" step="0.1" min="${-(L/2).toFixed(1)}" max="${(L/2).toFixed(1)}" value="${p.u}" inputmode="decimal"></label>
          <label class="f">Высота центра, м<input type="number" data-k="y" step="0.1" min="0.3" max="${I.H||8}" value="${p.y}" inputmode="decimal"></label>
          <label class="f">Ширина × высота, м<span class="row" style="flex-wrap:nowrap;gap:4px"><input type="number" data-k="w" step="0.1" min="0.2" max="6" value="${p.w}" aria-label="Ширина картины, м" inputmode="decimal"><input type="number" data-k="h" step="0.1" min="0.2" max="6" value="${p.h}" aria-label="Высота картины, м" inputmode="decimal"></span></label></div></li>`}).join("")||`<li class="hint">Картин нет${cur==="sv"||cur==="se"||cur==="kr"?" — в зале остаются прежние картины":""}.</li>`}</ul>
      <div class="row"><span class="b gh sm file" ${P.length>=HB().LIMITS.paintings?'aria-disabled="true"':""}>Добавить картину<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Добавить картину: выбрать файл" data-addp ${P.length>=HB().LIMITS.paintings?"disabled":""}></span></div>
      <p class="hint">Сдвиг: плюс — вправо, если стоять лицом к стене. Картинка вписывается в размер целиком, пропорции фото сохраняются. Если у зала есть свои картины, прежние картины зала (тёмные полотна, пейзажи) не показываются.</p><p class="hint" data-pst></p></fieldset>`}
  function render(){const d=D();
    ed.innerHTML=["wall","floor","ceil"].map(surfHTML).join("")+paintHTML()+
      `<fieldset><legend>Свет и подпись</legend><label class="f">Свет зала<select data-light>${LIGHT.map(([v,t])=>`<option value="${v}" ${(d.light||"")===v?"selected":""}>${t}</option>`).join("")}</select></label>
       <label class="f">Подпись под названием зала (при входе)<textarea data-note maxlength="300">${esc(d.note||"")}</textarea></label></fieldset>`;
    wire();fillSel();draw()}
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
    const ap=pf.querySelector("[data-addp]");if(ap)ap.onchange=ev=>upload(ev,pst,r=>{const d=D();d.paintings=d.paintings||[];const I=INF[cur]||{H:4};
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
    try{const r=await HB().uploadImage(file,cur,{onProgress:p=>{st.textContent=p.stage==="prepare"?"Уменьшаем картинку…":p.stage==="upload"?"Загружаем…":"Загружено"}});fresh.add(r.path);
      st.textContent="Загружено: "+Math.round(r.bytes/1024)+" КБ, "+r.w+"×"+r.h+". Не забудьте сохранить.";busy=false;setBusy(false);done(r);changed(true)}
    catch(e){busy=false;setBusy(false);st.textContent=msgOf(e);st.style.color="var(--warn,#B3261E)"}}
  function setBusy(v){dlg.querySelectorAll("[data-save],[data-apply],[data-reset]").forEach(b=>b.disabled=v)}
  /* превью: развёртка выбранной стены (с проёмами), полоса пола снизу и потолка сверху; картины — по местам и размерам */
  function draw(){const g=cv.getContext("2d"),I=INF[cur];if(!I){g.clearRect(0,0,cv.width,cv.height);return}const d=HB().norm(D(),cur),L=I.L[pvWall],H=I.H;
    const W=cv.width,band=56;let sc=(W-20)/L;if(H*sc>360)sc=360/H;const need=Math.round(2*band+24+H*sc);if(cv.height!==need)cv.height=need;const ww=L*sc,wh=H*sc,x0=(W-ww)/2,y0=band+10;
    g.fillStyle="#15171a";g.fillRect(0,0,W,cv.height);
    const fillSurf=(s,def,x,y,w,h,mpp)=>{g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.fillStyle=(s&&s.color)||def||"#ccc";g.fillRect(x,y,w,h);
      const im=s&&s.img?img(U(s.img)):null;if(im){if(s.mode==="stretch")g.drawImage(im,x,y,w,h);else{const tw=2*mpp,th=tw*im.naturalHeight/im.naturalWidth;for(let yy=y+h-th;yy>y-th;yy-=th)for(let xx=x;xx<x+w;xx+=tw)g.drawImage(im,xx,yy,tw,th)}}g.restore()};
    fillSurf(d.ceil,I.ceil,x0,10,ww,band-4,sc*.5);fillSurf(d.floor,I.floor,x0,y0+wh+4,ww,band-4,sc*.5);fillSurf(d.wall,I.wall,x0,y0,ww,wh,sc);
    const dr=I.doors&&I.doors[pvWall];if(dr){g.fillStyle="rgba(0,0,0,.6)";g.fillRect(x0+(L/2+dr[2]-dr[0]/2)*sc,y0+wh-dr[1]*sc,dr[0]*sc,dr[1]*sc)}
    (d.paintings||[]).forEach(p=>{if(p.wall!==pvWall)return;const ft=Museum.hallPaintFit(p,L,H,dr),w=ft.w,h=ft.h,u=ft.u,y=ft.y;
      const im=img(U(p.img));let pw=w,ph=h;if(im){const a=im.naturalWidth/im.naturalHeight;if(pw/ph>a)pw=ph*a;else ph=pw/a}
      const cx=x0+(L/2+u)*sc,cy=y0+wh-y*sc;g.fillStyle="#24201C";g.fillRect(cx-pw*sc/2-3,cy-ph*sc/2-3,pw*sc+6,ph*sc+6);
      if(im)g.drawImage(im,cx-pw*sc/2,cy-ph*sc/2,pw*sc,ph*sc);else{g.fillStyle="#E6E1D8";g.fillRect(cx-pw*sc/2,cy-ph*sc/2,pw*sc,ph*sc)}});
    g.font="12px Golos Text, sans-serif";[["потолок",x0+4,24],["пол",x0+4,y0+wh+20]].forEach(([t,x,y])=>{g.fillStyle="rgba(0,0,0,.6)";g.fillRect(x-2,y-12,g.measureText(t).width+6,16);g.fillStyle="#FFFFFF";g.fillText(t,x+1,y)});
    const ph_=dlg.querySelector("#hsPvH");if(ph_)ph_.textContent=`${name(cur)} · стена ${WALLN[pvWall]}: ${L.toFixed(1)} × ${H.toFixed(1)} м${dr?" · тёмное — проём":""}. Полосы пола и потолка — в том же масштабе плитки.`}
  dlg.querySelectorAll("input[name=hsPv]").forEach(r=>r.onchange=()=>{if(r.checked){pvWall=r.value;draw()}});
  sel.onchange=()=>{cur=sel.value;render();say(dirty(cur)?"Есть несохранённые изменения.":"")};
  /* применить к 3D-музею: сохранённое для всех залов + черновик текущего */
  const applyMap=m=>{if(!app)return false;app.setHallStyles(m);return app.remountMuseum()};
  dlg.querySelector("[data-apply]").onclick=()=>{const m=clone(saved);const n=HB().norm(D(),cur);if(Object.keys(n).length)m[cur]=n;else delete m[cur];applied=true;
    const ok=applyMap(m);say(ok?"Показано в музее, но ещё не сохранено. «Сохранить» — чтобы увидели все.":"Применено. Откройте 3D-музей (Этаж −1, «Войти»), чтобы увидеть — пока без сохранения.")};
  dlg.querySelector("[data-save]").onclick=async()=>{const n=HB().norm(D(),cur);if(JSON.stringify(n).length>HB().LIMITS.bytes){say("Слишком много данных для одного зала: уберите часть картин или подписей.",true);return}
    setBusy(true);say("Сохраняем…");
    try{const r=await HB().save(cur,n);if(r&&r.data&&Object.keys(r.data).length)saved[cur]=r.data;else delete saved[cur];drafts[cur]=clone(saved[cur]||{});applied=false;
      const keep=new Set(Object.keys(saved).flatMap(x=>HB().images(saved[x])));fresh.forEach(p=>{if(keep.has(p))fresh.delete(p)});
      const ok=applyMap(clone(saved));setBusy(false);render();say("Сохранено."+(ok?" Музей перезапущен с новым видом.":" Посетители увидят новый вид при входе в музей."))}
    catch(e){setBusy(false);say(msgOf(e),true)}};
  const rs=dlg.querySelector("[data-reset]");rs.onclick=async()=>{if(rs.dataset.sure!=="1"){rs.dataset.sure="1";rs.textContent="Точно сбросить? Нажмите ещё раз";setTimeout(()=>{rs.dataset.sure="";rs.textContent="Сбросить к исходному"},5000);return}
    rs.dataset.sure="";rs.textContent="Сбросить к исходному";setBusy(true);say("Сбрасываем…");
    try{if(saved[cur])await HB().remove(cur);delete saved[cur];drafts[cur]={};applied=false;const ok=applyMap(clone(saved));setBusy(false);render();say("Зал возвращён к исходному виду."+(ok?" Музей перезапущен.":""))}
    catch(e){setBusy(false);say(msgOf(e),true)}};
  /* закрыть: несохранённые загрузки удаляются из хранилища; показанный без сохранения черновик убирается из музея */
  function close(){if(!dlg.isConnected)return;const keep=new Set(Object.keys(saved).flatMap(x=>HB().images(saved[x])));const gone=[...fresh].filter(p=>!keep.has(p));if(gone.length)HB().removeImages(gone).catch(()=>{});
    if(applied)applyMap(clone(saved));dlg.remove();document.removeEventListener("keydown",onKey,true);open_=null;const back=opener&&opener.isConnected?opener:document.querySelector("#spHall")||document.querySelector(".hallwrap canvas");if(back)try{back.focus({preventScroll:true})}catch(e){}}
  const onKey=ev=>{if(!dlg.isConnected)return;if(ev.key==="Escape"){ev.preventDefault();ev.stopPropagation();close()}else if(ev.key==="Tab"){const fs=[...box.querySelectorAll("button,input,select,textarea")].filter(x=>!x.disabled&&x.offsetParent!==null);if(!fs.length)return;const a=fs[0],z=fs[fs.length-1];
      if(ev.shiftKey&&document.activeElement===a){ev.preventDefault();z.focus()}else if(!ev.shiftKey&&document.activeElement===z){ev.preventDefault();a.focus()}else if(!box.contains(document.activeElement)){ev.preventDefault();a.focus()}}};
  document.addEventListener("keydown",onKey,true);
  /* клавиши внутри окна не доходят до музея (WASD, пробел) */
  ["keydown","keyup"].forEach(t=>dlg.addEventListener(t,ev=>ev.stopPropagation()));
  dlg.addEventListener("pointerdown",ev=>{if(ev.target===dlg)close()});dlg.querySelector("[data-x]").onclick=close;
  open_={pick:x=>{if(IDS.indexOf(x)>=0&&x!==cur){cur=x;render()}},close};
  render();try{sel.focus()}catch(e){}return true}
return {open,close:()=>{if(open_)open_.close()}};
})();

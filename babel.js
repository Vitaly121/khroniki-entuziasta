/* Этаж ∞: бесконечная библиотека из шестигранных залов (этап 17).
   Залы строятся на лету вокруг посетителя и нигде не хранятся: адрес зала (q, r, ярус) и адрес тома дают одно и то же содержимое всегда.
   В каждом шестиграннике четыре стены с полками (5 полок по 32 тома), две свободные стороны ведут в соседние залы, в центре — шахта,
   у стены — винтовая лестница на ярус выше и ниже. В томе 410 страниц, на странице 40 строк по 80 знаков; знаков 25: 22 буквы, пробел, запятая, точка.
   Тексты книг — только случайные буквы. */
window.Babel=(function(){
"use strict";
const A=4.2,H=3.4,SH=1.3,DW=1.5,DH=2.35,WT=.16;
const W=2*A*Math.tan(Math.PI/6);
const TH=[0,1,2,3,4,5].map(i=>i*Math.PI/3),NX=TH.map(Math.cos),NZ=TH.map(Math.sin);
const DQ=[[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]];
const E0=[2*A,0],E1=[2*A*Math.cos(Math.PI/3),2*A*Math.sin(Math.PI/3)];
const SHELVES=5,NB=32,PAGES=410,LINES=40,COLS=80;
const ABC="абвгдежзиклмнопрстуфхц ,.";
const STA=Math.PI/6,STR=3.15,SX=Math.cos(STA)*STR,SZ=Math.sin(STA)*STR;
/* проходы: у каждого зала открыты две стороны с наименьшим счётом ребра; ребро общее с соседом, поэтому проход открыт,
   если его выбрал хотя бы один из двух залов. Выходит от двух до пяти проходов — лабиринт без края, свой на каждом ярусе */
const DC=new Map();
function edgeH(q,r,i,L){if(i>=3){q+=DQ[i][0];r+=DQ[i][1];i-=3}return hash(q,r,i,L,31)}
function forced(q,r,L){const k=q+","+r+","+L;let v=DC.get(k);if(v!==undefined)return v;const a=[0,1,2,3,4,5].map(i=>[edgeH(q,r,i,L),i]).sort((x,y)=>x[0]-y[0]);v=(1<<a[0][1])|(1<<a[1][1]);if(DC.size>6000)DC.clear();DC.set(k,v);return v}
const isDoor=(q,r,L,i)=>!!(forced(q,r,L)>>i&1)||!!(forced(q+DQ[i][0],r+DQ[i][1],L)>>((i+3)%6)&1);
const dark=(q,r,L)=>hash(q,r,L,5,5)%7===0;
/* детерминированный счёт: адрес → число */
function hash(){let h=2166136261>>>0;for(let i=0;i<arguments.length;i++){let v=arguments[i]|0;for(let k=0;k<4;k++){h^=v&255;h=Math.imul(h,16777619)>>>0;v>>>=8}}h^=h>>>15;h=Math.imul(h,2246822519)>>>0;h^=h>>>13;return h>>>0}
function rng(seed){let s=seed>>>0||1;return ()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296}}
function pageText(q,r,L,w,s,b,p){const R=rng(hash(q,r,L,w*1000+s*100+b,p,7));const out=[];for(let y=0;y<LINES;y++){let ln="";for(let x=0;x<COLS;x++)ln+=ABC[Math.floor(R()*25)];out.push(ln)}return out.join("\n")}
function spine(q,r,L,w,s,b){const R=rng(hash(q,r,L,w*1000+s*100+b,0,99));let t="";const n=6+Math.floor(R()*9);for(let i=0;i<n;i++)t+=ABC[Math.floor(R()*25)];return t.trim()||"а"}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function css(){if(document.getElementById("bbCss"))return;const s=document.createElement("style");s.id="bbCss";s.textContent=`
.bbwrap{position:relative;background:#0C0A08;border-radius:6px;overflow:hidden;margin:0 0 18px;color:#EDE6D8;font-family:var(--f-ui,system-ui)}
.bbwrap canvas{display:block;width:100%;height:min(74vh,700px);outline:none;touch-action:none;cursor:crosshair}
.bbwrap:fullscreen canvas{height:100vh}
.bb-top{position:absolute;left:14px;top:12px;right:14px;display:flex;justify-content:space-between;gap:10px;align-items:flex-start;pointer-events:none}
.bb-addr{font-family:var(--f-mono,monospace);font-size:12px;letter-spacing:.04em;line-height:1.5;text-shadow:0 1px 3px #000}
.bb-addr b{display:block;font-family:var(--f-display,Georgia,serif);font-size:20px;letter-spacing:0;font-weight:500}
.bb-btns{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;pointer-events:auto}
.bbwrap button.bb{min-height:36px;padding:0 13px;border-radius:999px;border:1px solid rgba(255,255,255,.28);background:rgba(14,12,10,.8);color:#EDE6D8;font:500 13px/1 var(--f-ui,system-ui);cursor:pointer}
.bbwrap button.bb:hover{border-color:#fff}
.bb-hint{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);max-width:calc(100% - 28px);background:rgba(14,12,10,.82);border-radius:999px;padding:8px 14px;font-size:13px;text-align:center;pointer-events:none}
.bb-st{position:absolute;right:14px;bottom:60px;display:flex;flex-direction:column;gap:6px}
.bb-st[hidden]{display:none}
.bb-cross{position:absolute;left:50%;top:50%;width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;background:rgba(255,255,255,.75);pointer-events:none}
.bb-start{position:absolute;inset:0;display:grid;place-items:center;background:rgba(10,8,6,.66)}
.bb-start[hidden]{display:none}
.bb-start div{text-align:center;max-width:460px;padding:0 20px}
.bb-start h3{font-family:var(--f-display,Georgia,serif);font-size:30px;font-weight:500;margin:0 0 8px}
.bb-start p{font-size:14px;line-height:1.5;color:#CFC6B4;margin:0 0 16px}
.bb-book{position:absolute;inset:0;background:rgba(8,6,5,.86);display:grid;place-items:center;padding:14px}
.bb-book[hidden]{display:none}
.bb-page{background:#EDE4CF;color:#2A241A;width:min(820px,100%);max-height:100%;display:flex;flex-direction:column;border-radius:3px;box-shadow:0 24px 60px -20px #000}
.bb-ph{display:flex;justify-content:space-between;gap:10px;align-items:baseline;padding:12px 16px 8px;border-bottom:1px solid rgba(42,36,26,.2);flex-wrap:wrap}
.bb-ph b{font-family:var(--f-display,Georgia,serif);font-size:19px;font-weight:500}
.bb-ph small{font-family:var(--f-mono,monospace);font-size:11px;letter-spacing:.04em;color:#6B604C}
.bb-pt{margin:0;padding:12px 16px;overflow:auto;font:12.5px/1.5 var(--f-mono,ui-monospace,Menlo,monospace);white-space:pre;flex:1}
.bb-pf{display:flex;gap:8px;align-items:center;padding:8px 16px 12px;border-top:1px solid rgba(42,36,26,.2);flex-wrap:wrap;font-size:13px}
.bb-pf button{min-height:34px;min-width:38px;border:1px solid rgba(42,36,26,.4);background:none;color:inherit;border-radius:4px;cursor:pointer;font:inherit;padding:0 10px}
.bb-pf input{width:72px;min-height:34px;border:1px solid rgba(42,36,26,.4);background:rgba(255,255,255,.4);color:inherit;border-radius:4px;padding:0 8px;font:inherit}
.bb-pf .sp{flex:1}
@media (max-width:600px){.bbwrap canvas{height:min(70vh,560px)}.bb-pt{font-size:9px}.bb-addr b{font-size:17px}}`;document.head.appendChild(s)}
function mount(host){const T=window.THREE;css();
  if(!T){host.innerHTML=`<p class="hint">Трёхмерный модуль не загрузился.</p>`;return ()=>{}}
  host.innerHTML=`<div class="bbwrap"><canvas tabindex="0" aria-label="Библиотека: шестигранные залы без конца"></canvas><div class="bb-cross" aria-hidden="true"></div>
   <div class="bb-top"><div class="bb-addr"><b>Библиотека</b><span>без карты и без номеров залов</span></div><div class="bb-btns"><button type="button" class="bb" id="bbRnd" title="Перенестись в случайный зал">другой зал</button><button type="button" class="bb" id="bbSnd" aria-pressed="true">звук</button><button type="button" class="bb" id="bbFs">на весь экран</button></div></div>
   <div class="bb-st" id="bbSt" hidden><button type="button" class="bb" data-l="1" aria-label="Подняться на ярус выше">↑ ярус выше</button><button type="button" class="bb" data-l="-1" aria-label="Спуститься на ярус ниже">↓ ярус ниже</button></div>
   <div class="bb-hint" id="bbH"></div>
   <div class="bb-start" id="bbS"><div><h3>Библиотека</h3><p>Шестигранные залы без конца: стены с полками, проходы в соседние залы, шахта в центре и лестница на другие ярусы. Карты нет, залы не пронумерованы. В каждом томе 410 страниц случайных букв.</p><button type="button" class="bb" id="bbGo">Войти</button></div></div>
   <div class="bb-book" id="bbB" hidden role="dialog" aria-modal="true" aria-label="Том"><div class="bb-page"><div class="bb-ph"><b id="bbT"></b><small id="bbW"></small></div><pre class="bb-pt" id="bbP" tabindex="0"></pre>
    <div class="bb-pf"><button type="button" data-p="-1" aria-label="Предыдущая страница">‹</button><button type="button" data-p="1" aria-label="Следующая страница">›</button><label>стр. <input type="number" id="bbN" min="1" max="${PAGES}" aria-label="Номер страницы"></label><span>из ${PAGES}</span><span class="sp"></span><button type="button" id="bbX">Закрыть</button></div></div></div></div>`;
  const wrap=host.firstElementChild,canvas=wrap.querySelector("canvas"),$=s=>wrap.querySelector(s);
  const coarse=matchMedia("(pointer:coarse)").matches;
  let R;try{R=new T.WebGLRenderer({canvas,antialias:!coarse,powerPreference:"high-performance"})}catch(e){host.innerHTML=`<p class="hint">Браузер не дал открыть трёхмерный вид.</p>`;return ()=>{}}
  R.setPixelRatio(Math.min(coarse?1.5:2,devicePixelRatio||1));
  const S=new T.Scene(),FOG=0x120E0A;S.background=new T.Color(FOG);S.fog=new T.FogExp2(FOG,.052);
  const cam=new T.PerspectiveCamera(72,1,.08,90);cam.rotation.order="YXZ";
  S.add(new T.HemisphereLight(0xFFE2B8,0x2A1E14,.62));const lamp=new T.PointLight(0xFFD49A,1.05,15,1.6);S.add(lamp);
  /* общая геометрия и материалы */
  const G={box:new T.BoxGeometry(1,1,1),floor:new T.RingGeometry(SH,A/Math.cos(Math.PI/6),6,1,Math.PI/6),bulb:new T.SphereGeometry(.16,14,10)};
  const M={st:new T.MeshLambertMaterial({color:0xFFFFFF}),bk:new T.MeshLambertMaterial({color:0xFFFFFF}),fl:new T.MeshLambertMaterial({color:0x3A2E24,side:T.DoubleSide}),flD:new T.MeshLambertMaterial({color:0x17120E,side:T.DoubleSide}),bulb:new T.MeshBasicMaterial({color:0xFFE7B0})};
  const m4=new T.Matrix4(),m4b=new T.Matrix4(),m4c=new T.Matrix4(),v3=new T.Vector3(),q4=new T.Quaternion(),e3=new T.Euler(),col=new T.Color();
  const WM=TH.map((t,i)=>new T.Matrix4().makeTranslation(NX[i]*(A-WT/2),0,NZ[i]*(A-WT/2)).multiply(new T.Matrix4().makeRotationY(Math.PI/2-t)));
  const C_WALL=0x4B3828,C_BOARD=0x5E4832,C_RAIL=0x9A7A42,C_STEP=0x35281D,C_COL=0x2A2019;
  const BOOKC=[0x6B2A22,0x7A4A22,0x2F4A38,0x2B3A55,0x8A7A52,0x4A2E3A,0x5A5148,0x9A8A6A,0x3A4A4A,0x7A2E2E];
  function build(q,r,L){const g=new T.Group();g.userData={q,r,L};
    const fl=new T.Mesh(G.floor,dark(q,r,L)?M.flD:M.fl);fl.rotation.x=-Math.PI/2;g.add(fl);
    const st=new T.InstancedMesh(G.box,M.st,96);let n=0;
    const put=(base,x,y,z,sx,sy,sz,c,ry)=>{m4.makeTranslation(x,y,z);if(ry){m4b.makeRotationY(ry);m4.multiply(m4b)}m4b.makeScale(sx,sy,sz);m4.multiply(m4b);if(base){m4c.copy(base).multiply(m4);st.setMatrixAt(n,m4c)}else st.setMatrixAt(n,m4);st.setColorAt(n,col.setHex(sh(c)));n++};
    const walls=[];
    const dk=dark(q,r,L),sh=c=>dk?col.setHex(c).multiplyScalar(.42).getHex():c;g.userData.dark=dk;
    for(let i=0;i<6;i++){if(isDoor(q,r,L,i)){const sw=(W-DW)/2;put(WM[i],-(DW/2+sw/2),H/2,0,sw,H,WT,C_WALL);put(WM[i],DW/2+sw/2,H/2,0,sw,H,WT,C_WALL);put(WM[i],0,DH+(H-DH)/2,0,DW,H-DH,WT,C_WALL)}
      else{walls.push(i);put(WM[i],0,H/2,0,W,H,WT,C_WALL);for(let s=0;s<SHELVES;s++)put(WM[i],0,.28+s*.56,-.24,W-.5,.04,.3,C_BOARD)}}
    for(let k=0;k<6;k++){const t=k*Math.PI/3,ap=SH*Math.cos(Math.PI/6);[1.02,.55].forEach(y=>put(null,Math.cos(t)*ap,y,Math.sin(t)*ap,SH,.05,.05,C_RAIL,Math.PI/2-t));const tv=t+Math.PI/6;put(null,Math.cos(tv)*SH,.52,Math.sin(tv)*SH,.06,1.04,.06,C_RAIL)}
    put(null,SX,H/2,SZ,.16,H,.16,C_COL);const NS=15;for(let k=0;k<NS;k++){const a=k/NS*Math.PI*2;put(null,SX+Math.cos(a)*.42,(k+.5)*H/NS,SZ-Math.sin(a)*.42,.7,.05,.26,C_STEP,a)}
    st.count=n;st.instanceMatrix.needsUpdate=true;if(st.instanceColor)st.instanceColor.needsUpdate=true;g.add(st);
    const bk=new T.InstancedMesh(G.box,M.bk,walls.length*SHELVES*NB);const Rn=rng(hash(q,r,L,1,2,3));let bi=0;
    walls.forEach(wi=>{for(let s=0;s<SHELVES;s++){let x=-(W-.7)/2;const step=(W-.7)/NB,cutB=Rn()<.07?Math.floor(Rn()*NB):NB;for(let b=0;b<NB;b++){const bw=step*(.72+Rn()*.22),bh=.3+Rn()*.14,lean=Rn()<.06?(Rn()-.5)*.3:0,gone=Rn()<.05||b>=cutB;
        m4.makeTranslation(x+step/2,.3+s*.56+bh/2,-.24);if(lean){m4b.makeRotationZ(lean);m4.multiply(m4b)}m4b.makeScale(gone?0:bw,gone?0:bh,.2+Rn()*.05);m4.multiply(m4b);m4c.copy(WM[wi]).multiply(m4);bk.setMatrixAt(bi,m4c);
        col.setHex(BOOKC[Math.floor(Rn()*BOOKC.length)]);col.offsetHSL(0,0,(Rn()-.5)*.08);if(dk)col.multiplyScalar(.42);bk.setColorAt(bi,col);bi++;x+=step}}});
    bk.instanceMatrix.needsUpdate=true;if(bk.instanceColor)bk.instanceColor.needsUpdate=true;bk.userData={books:true,walls,q,r,L};g.add(bk);g.userData.bk=bk;
    if(!dk)[Math.PI*5/6,Math.PI*3/2].forEach(t=>{const b=new T.Mesh(G.bulb,M.bulb);b.position.set(Math.cos(t)*2.6,H-.55,Math.sin(t)*2.6);g.add(b)});
    return g}
  function drop(g){S.remove(g);g.traverse(o=>{if(o.isInstancedMesh)o.dispose()})}
  /* пыль в свете лампы: точки вокруг посетителя, медленно плывут и возвращаются с другой стороны */
  const DN=coarse?120:260,dpos=new Float32Array(DN*3),dvel=new Float32Array(DN*3);for(let i=0;i<DN;i++){dpos[i*3]=(Math.random()-.5)*9;dpos[i*3+1]=Math.random()*3;dpos[i*3+2]=(Math.random()-.5)*9;dvel[i*3]=(Math.random()-.5)*.05;dvel[i*3+1]=(Math.random()-.5)*.03;dvel[i*3+2]=(Math.random()-.5)*.05}
  const dgeo=new T.BufferGeometry();dgeo.setAttribute("position",new T.BufferAttribute(dpos,3));const dust=new T.Points(dgeo,new T.PointsMaterial({color:0xFFE6BE,size:.022,transparent:true,opacity:.55,depthWrite:false}));dust.frustumCulled=false;S.add(dust);
  /* звук: низкий гул шахты, шаги с эхом, шелест страницы. Включается после первого нажатия; кнопка «звук» выключает */
  const AU={ctx:null,out:null,on:true,echo:null};
  function audio(){if(AU.ctx||!AU.on)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;try{const c=AU.ctx=new AC(),out=AU.out=c.createGain();out.gain.value=.9;out.connect(c.destination);
      const lp=c.createBiquadFilter();lp.type="lowpass";lp.frequency.value=160;const hg=c.createGain();hg.gain.value=.05;lp.connect(hg);hg.connect(out);[55,82.4,110.3].forEach((f,i)=>{const o=c.createOscillator();o.type=i?"sine":"triangle";o.frequency.value=f;const g=c.createGain();g.gain.value=i===2?.25:.6;o.connect(g);g.connect(lp);o.start()});
      const nb=c.createBuffer(1,c.sampleRate*2,c.sampleRate),nd_=nb.getChannelData(0);for(let i=0;i<nd_.length;i++)nd_[i]=Math.random()*2-1;AU.noise=nb;
      const air=c.createBufferSource();air.buffer=nb;air.loop=true;const af=c.createBiquadFilter();af.type="bandpass";af.frequency.value=420;af.Q.value=.4;const ag=c.createGain();ag.gain.value=.012;air.connect(af);af.connect(ag);ag.connect(out);air.start();
      const dl=c.createDelay(1);dl.delayTime.value=.27;const fb=c.createGain();fb.gain.value=.42;const dlp=c.createBiquadFilter();dlp.type="lowpass";dlp.frequency.value=900;dl.connect(dlp);dlp.connect(fb);fb.connect(dl);dlp.connect(out);AU.echo=dl}catch(e){AU.ctx=null}}
  function burst(freq,dur,gain,type){const c=AU.ctx;if(!c||!AU.on||c.state!=="running")return;const s=c.createBufferSource();s.buffer=AU.noise;const f=c.createBiquadFilter();f.type=type||"lowpass";f.frequency.value=freq;const g=c.createGain(),t=c.currentTime;g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0008,t+dur);s.connect(f);f.connect(g);g.connect(AU.out);if(AU.echo)g.connect(AU.echo);s.start(t,Math.random(),dur+.02)}
  /* положение: зал (q, r), ярус L и место внутри зала (x, z от его центра) */
  const P={q:0,r:0,L:0,x:0,z:2.4,yaw:Math.PI,pitch:-.05,dy:0};
  const load=()=>{try{const s=JSON.parse(localStorage.getItem("cv2_babel")||"null");if(s&&[s.q,s.r,s.L,s.x,s.z].every(Number.isFinite)){P.q=s.q|0;P.r=s.r|0;P.L=s.L|0;P.x=s.x;P.z=s.z;P.yaw=+s.yaw||0;return true}}catch(e){}return false};
  const save=()=>{try{localStorage.setItem("cv2_babel",JSON.stringify({q:P.q,r:P.r,L:P.L,x:+P.x.toFixed(2),z:+P.z.toFixed(2),yaw:+P.yaw.toFixed(2)}))}catch(e){}};
  function jump(){const rnd=n=>Math.floor((Math.random()*2-1)*n);P.q=rnd(40000);P.r=rnd(40000);P.L=rnd(9000);P.x=0;P.z=2.4;P.yaw=Math.random()*6.28;P.dy=0;sync();save()}
  function valid(x,z){if(Math.hypot(x,z)<SH+.42)return false;if(Math.hypot(x-SX,z-SZ)<.62)return false;
    for(let i=0;i<6;i++){const d=NX[i]*x+NZ[i]*z;if(isDoor(P.q,P.r,P.L,i)){const lat=-NZ[i]*x+NX[i]*z;if(d>A-.5&&Math.abs(lat)>DW/2-.32)return false}else if(d>A-.82)return false}return true}
  const fresh=!load();
  const cells=new Map();
  function sync(){const want=new Map(),add=(q,r,L)=>{const k=q+","+r+","+L;if(want.has(k))return false;want.set(k,[q,r,L]);return true};
    /* видно то, куда можно дойти взглядом через проходы: три зала вглубь на своём ярусе, по одному на соседних ярусах */
    const reach=(L,depth,cap)=>{let fr=[[P.q,P.r]];add(P.q,P.r,L);let n=1;for(let d=0;d<depth&&n<cap;d++){const nx=[];fr.forEach(([q,r])=>{for(let i=0;i<6;i++)if(n<cap&&isDoor(q,r,L,i)){const q2=q+DQ[i][0],r2=r+DQ[i][1];if(add(q2,r2,L)){n++;nx.push([q2,r2])}}});fr=nx}};
    reach(P.L,3,18);reach(P.L+1,1,6);reach(P.L-1,1,6);add(P.q,P.r,P.L+2);add(P.q,P.r,P.L-2);
    cells.forEach((g,k)=>{if(!want.has(k)){drop(g);cells.delete(k)}});
    want.forEach(([q,r,L],k)=>{if(!cells.has(k)){const g=build(q,r,L);cells.set(k,g);S.add(g)}});
    cells.forEach(g=>{const u=g.userData,dq=u.q-P.q,dr=u.r-P.r;g.position.set(dq*E0[0]+dr*E1[0],(u.L-P.L)*H,dq*E0[1]+dr*E1[1])});
    }
  if(fresh)jump();else{if(!valid(P.x,P.z)){P.x=0;P.z=2.4}sync()}
  /* ввод */
  const keys={};let stopped=false,raf=0,last=performance.now(),started=false,climb=null,book=null,nearSt=false;
  const offs=[];const on=(t,e,f,o)=>{t.addEventListener(e,f,o);offs.push(()=>t.removeEventListener(e,f,o))};
  const locked=()=>document.pointerLockElement===canvas;
  const hint=t=>{$("#bbH").textContent=t};
  const baseHint=()=>coarse?"Левая часть экрана — идти, правая — смотреть. Коснитесь тома, чтобы открыть":"WASD — идти · мышь — смотреть · клик по тому или E — открыть · у лестницы R / F — ярус выше и ниже";
  function start(){audio();started=true;$("#bbS").hidden=true;hint(baseHint());try{canvas.focus({preventScroll:true})}catch(e){}if(!coarse)try{canvas.requestPointerLock()}catch(e){}}
  $("#bbGo").onclick=start;
  $("#bbRnd").onclick=()=>{jump();try{canvas.focus({preventScroll:true})}catch(e){}};
  $("#bbSnd").onclick=ev=>{AU.on=!AU.on;ev.currentTarget.setAttribute("aria-pressed",String(AU.on));ev.currentTarget.textContent=AU.on?"звук":"звук выкл.";if(AU.on){audio();if(AU.ctx)AU.ctx.resume()}else if(AU.ctx)AU.ctx.suspend()};
  $("#bbFs").onclick=()=>{const d=document;if(d.fullscreenElement)d.exitFullscreen();else if(wrap.requestFullscreen)wrap.requestFullscreen().catch(()=>{})};
  const look=(dx,dy,k)=>{P.yaw-=dx*k;P.pitch=Math.max(-1.25,Math.min(1.25,P.pitch-dy*k))};
  on(document,"mousemove",ev=>{if(locked())look(ev.movementX||0,ev.movementY||0,.0023)});
  const ray=new T.Raycaster(),nd=new T.Vector2();
  function pick(nx,ny){nd.set(nx,ny);ray.setFromCamera(nd,cam);ray.far=3.6;const list=[];cells.forEach(g=>{if(g.userData.L===P.L)list.push(g.userData.bk)});const h=ray.intersectObjects(list,false)[0];
    if(!h||h.instanceId==null)return null;const u=h.object.userData,id=h.instanceId,wi=Math.floor(id/(SHELVES*NB)),s=Math.floor(id%(SHELVES*NB)/NB),b=id%NB;return {q:u.q,r:u.r,L:u.L,w:u.walls[wi],s,b}}
  function openBook(o){if(!o)return;book=Object.assign({p:1},o);if(locked())document.exitPointerLock();Object.keys(keys).forEach(k=>keys[k]=false);
    $("#bbT").textContent="«"+spine(o.q,o.r,o.L,o.w,o.s,o.b)+"»";$("#bbW").textContent="стена "+(o.w+1)+" · полка "+(o.s+1)+" · том "+(o.b+1);$("#bbB").hidden=false;burst(2600,.32,.05,"highpass");page(1);$("#bbP").focus()}
  function page(p){if(!book)return;book.p=Math.max(1,Math.min(PAGES,Math.round(p)||1));$("#bbP").textContent=pageText(book.q,book.r,book.L,book.w,book.s,book.b,book.p);$("#bbN").value=book.p;$("#bbP").scrollTop=0}
  function closeBook(){book=null;$("#bbB").hidden=true;try{canvas.focus({preventScroll:true})}catch(e){}}
  $("#bbX").onclick=closeBook;wrap.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>page(book.p+ +b.dataset.p));$("#bbN").onchange=ev=>page(+ev.target.value);
  on($("#bbB"),"click",ev=>{if(ev.target===$("#bbB"))closeBook()});
  function stairs(d){if(climb||!nearSt)return;climb={d,t:0};sync()}
  wrap.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>stairs(+b.dataset.l));
  on(window,"keydown",ev=>{if(!wrap.isConnected)return;const tg=ev.target;if(tg&&(tg.tagName==="INPUT"||tg.tagName==="TEXTAREA")&&!wrap.contains(tg))return;
    if(book){if(ev.key==="Escape"){ev.preventDefault();closeBook()}else if(ev.key==="ArrowRight"&&tg.tagName!=="INPUT"){page(book.p+1)}else if(ev.key==="ArrowLeft"&&tg.tagName!=="INPUT"){page(book.p-1)}return}
    if(!(locked()||document.activeElement===canvas))return;const c=ev.code;
    if(["KeyW","KeyA","KeyS","KeyD","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","ShiftLeft","ShiftRight"].includes(c)){keys[c]=true;ev.preventDefault();return}
    if(c==="KeyE"&&!ev.repeat){openBook(pick(0,0)||pick(.02,0)||pick(-.02,0)||pick(0,.04));return}
    if((c==="KeyR"||c==="PageUp")&&!ev.repeat){ev.preventDefault();stairs(1);return}
    if((c==="KeyF"||c==="PageDown")&&!ev.repeat){ev.preventDefault();stairs(-1)}});
  on(window,"keyup",ev=>{keys[ev.code]=false});on(window,"blur",()=>Object.keys(keys).forEach(k=>keys[k]=false));
  /* указатель: мышь без захвата и палец. Палец в левой половине — идти, в правой — смотреть; короткое касание — открыть том */
  const ptr=new Map();let joy=null;
  on(canvas,"pointerdown",ev=>{if(!started)return;try{canvas.focus({preventScroll:true})}catch(e){}
    if(locked()){if(ev.button===0)openBook(pick(0,0)||pick(.02,0)||pick(-.02,0));return}
    const rc=canvas.getBoundingClientRect(),left=ev.pointerType==="touch"&&ev.clientX-rc.left<rc.width*.42;
    ptr.set(ev.pointerId,{x:ev.clientX,y:ev.clientY,x0:ev.clientX,y0:ev.clientY,mv:0,left,type:ev.pointerType});if(left)joy={id:ev.pointerId,dx:0,dy:0};try{canvas.setPointerCapture(ev.pointerId)}catch(e){}});
  on(canvas,"pointermove",ev=>{const p=ptr.get(ev.pointerId);if(!p)return;const dx=ev.clientX-p.x,dy=ev.clientY-p.y;p.mv+=Math.abs(dx)+Math.abs(dy);p.x=ev.clientX;p.y=ev.clientY;
    if(p.left&&joy){joy.dx=Math.max(-1,Math.min(1,(ev.clientX-p.x0)/46));joy.dy=Math.max(-1,Math.min(1,(ev.clientY-p.y0)/46))}else look(dx,dy,.0042)});
  const pend=ev=>{const p=ptr.get(ev.pointerId);if(!p)return;ptr.delete(ev.pointerId);if(joy&&joy.id===ev.pointerId)joy=null;if(p.mv>7)return;
    const rc=canvas.getBoundingClientRect(),o=pick(((ev.clientX-rc.left)/rc.width)*2-1,-((ev.clientY-rc.top)/rc.height)*2+1);if(o){openBook(o);return}
    if(p.type==="mouse"&&!coarse)try{canvas.requestPointerLock()}catch(e){}};
  on(canvas,"pointerup",pend);on(canvas,"pointercancel",ev=>{ptr.delete(ev.pointerId);if(joy&&joy.id===ev.pointerId)joy=null});
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let saveT=0,bob=0;
  function frame(now){if(stopped)return;raf=requestAnimationFrame(frame);const dt=Math.min(.05,(now-last)/1000);last=now;
    const w=canvas.clientWidth,h=canvas.clientHeight;if(w&&h&&(canvas.width!==Math.floor(w*R.getPixelRatio())||canvas.height!==Math.floor(h*R.getPixelRatio()))){R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
    if(climb){climb.t+=dt/(reduce?.35:1.5);const k=Math.min(1,climb.t),e=k*k*(3-2*k);P.dy=climb.d*H*e;if(!reduce)P.yaw+=climb.d*dt*2.2;
      if(k>=1){P.L+=climb.d;P.dy=0;climb=null;if(!valid(P.x,P.z)){const t=STA+Math.PI/2.2;P.x=SX+Math.cos(t)*.95;P.z=SZ+Math.sin(t)*.95}sync();save()}}
    else if(started&&!book){let f=0,s=0;if(keys.KeyW||keys.ArrowUp)f+=1;if(keys.KeyS||keys.ArrowDown)f-=1;if(keys.KeyA)s-=1;if(keys.KeyD)s+=1;if(keys.ArrowLeft)P.yaw+=dt*2;if(keys.ArrowRight)P.yaw-=dt*2;
      if(joy){f-=joy.dy;s+=joy.dx}const m=Math.hypot(f,s);
      if(m>.05){const sp=(keys.ShiftLeft||keys.ShiftRight?5.2:2.9)*Math.min(1,m),fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw),rx=Math.cos(P.yaw),rz=-Math.sin(P.yaw);
        const vx=(fx*f+rx*s)/m*sp*dt,vz=(fz*f+rz*s)/m*sp*dt;
        if(valid(P.x+vx,P.z+vz)){P.x+=vx;P.z+=vz}else if(valid(P.x+vx,P.z))P.x+=vx;else if(valid(P.x,P.z+vz))P.z+=vz;
        const b0=bob;bob+=dt*sp*2.4;if(Math.floor(b0/Math.PI)!==Math.floor(bob/Math.PI))burst(190+Math.random()*60,.16,.16);
        for(let i=0;i<6;i++){if(!isDoor(P.q,P.r,P.L,i))continue;if(NX[i]*P.x+NZ[i]*P.z>A){P.q+=DQ[i][0];P.r+=DQ[i][1];P.x-=NX[i]*2*A;P.z-=NZ[i]*2*A;sync();break}}
        if(now-saveT>1500){saveT=now;save()}}
      const ns=Math.hypot(P.x-SX,P.z-SZ)<1.5;if(ns!==nearSt){nearSt=ns;$("#bbSt").hidden=!ns;hint(ns?(coarse?"Лестница: кнопки справа":"Лестница: R — ярус выше, F — ярус ниже"):baseHint())}}
    const ey=1.62+P.dy+(reduce?0:Math.sin(bob)*.025);cam.position.set(P.x,ey,P.z);cam.rotation.set(P.pitch,P.yaw,0);lamp.position.set(P.x,ey+.5,P.z);
    {const t=now/1000;lamp.intensity=reduce?1.05:1.02+Math.sin(t*7.3)*.03+Math.sin(t*17.1)*.02+(Math.random()<.004?-.25:0);
      for(let i=0;i<DN;i++){const j=i*3;dpos[j]+=dvel[j]*dt;dpos[j+1]+=dvel[j+1]*dt;dpos[j+2]+=dvel[j+2]*dt;if(dpos[j]-P.x>4.5)dpos[j]-=9;else if(dpos[j]-P.x<-4.5)dpos[j]+=9;if(dpos[j+2]-P.z>4.5)dpos[j+2]-=9;else if(dpos[j+2]-P.z<-4.5)dpos[j+2]+=9;if(dpos[j+1]>3.1)dpos[j+1]=.1;else if(dpos[j+1]<.05)dpos[j+1]=3}
      dgeo.attributes.position.needsUpdate=true;dust.position.y=P.dy}
    R.render(S,cam)}
  raf=requestAnimationFrame(frame);
  const stop=()=>{if(stopped)return;stopped=true;cancelAnimationFrame(raf);save();offs.forEach(f=>f());if(locked())document.exitPointerLock();cells.forEach(drop);cells.clear();dgeo.dispose();dust.material.dispose();if(AU.ctx)try{AU.ctx.close()}catch(e){}Object.values(G).forEach(g=>g.dispose());Object.values(M).forEach(m=>m.dispose());R.dispose()};
  wrap.__bb={P,cells,valid,pick,openBook,stairs,sync,jump,pageText,get near(){return nearSt},start};
  return stop}
return {mount,pageText,spine,hash};
})();

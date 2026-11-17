/* Музей всего дорогого: десять залов анфиладой, ходьба от первого лица. */
window.Museum=(function(){
"use strict";
const IDEAS=[
 ["Слепой с тростью","Мозг не принимает решение после анализа фактов. Он упрощает и экономит. «Не CEO на совете директоров, а слепой с тростью за рулём авто в незнакомом городе. Но уверенно»."],
 ["Рассинхрон","Человек несчастен, потому что не может свести картину мира: желания, обязанности, память, чужие голоса и тело показывают разное."],
 ["Место человека после интеллекта","Утрату интеллектуального превосходства придётся пережить не как собственную смерть, а как очередное великое разочарование."],
 ["Четыре разочарования","Коперник, Дарвин, Фрейд — и теперь машина, которая думает быстрее."],
 ["Сознание как сведение моделей","Сознание возникает из необходимости сводить в одну картинку результаты многих моделей."],
 ["Часовщик","Часовщик не боится робота, собранного своими руками. Замечает ли он, когда робот начинает заводить часы ему самому?"],
 ["Моделька","Музыка девяностых — выборка, на которой он обучился. Ему было от шести до одиннадцати."],
 ["Вопрос недели","Что я сделал на этой неделе, чтобы получить сведения, которые могли бы меня удивить, расширить мою модельку, перезаложить базовые гипотезы?"],
 ["Вера в вероятность","«Вероятность» первоначально означала того, кому можно верить."],
 ["Красота обшарпанного","Глупо жалеть о смерти цивилизации. Красота никуда не делась, она в обшарпанном."],
 ["Говорить, думать, помнить","Сначала он позволяет системе говорить за себя. Потом думать за себя. В конце — помнить за себя."],
 ["Кто редактирует историю","Если личность — это история, которую мы рассказываем о себе, тот, кто её редактирует, получает власть над личностью."]
];
const SPEC=[
 {k:"kv",D:24,wall:"#D9CFBF",tex:"paper1",floor:"planks",ceil:"#ECE7DE",lc:0xFFE3BC,sub:"Исторические комнаты: кухня Valentina, съёмная квартира, квартира отца"},
 {k:"pr",D:18,wall:"#2E2925",tex:"plaster",floor:"darkwood",ceil:"#1E1A17",lc:0xFFD08A,sub:"Кунсткамера: витрины с вещами, которые возвращаются"},
 {k:"id",D:18,wall:"#F3F3F1",tex:"plaster",floor:"concrete",ceil:"#F6F6F4",lc:0xFFFFFF,sub:"Белый куб: тезисы Viktor"},
 {k:"sv",D:14,wall:"#1E191B",tex:"plaster",floor:"stone",ceil:"#120F10",lc:0xC9A27A,sub:"Тёмный восьмиугольник. Одна вещь"},
 {k:"dv",D:18,wall:"#15181D",tex:"plaster",floor:"concreteDark",ceil:"#0E1013",lc:0x8FB4FF,sub:"Медиазал: копии и журналы"},
 {k:"ot",D:16,wall:"#3B4838",tex:"paper2",floor:"parquet",ceil:"#E7E1D3",lc:0xFFDDAA,sub:"Дом-музей: стол, тетрадь, дверца"},
 {k:"se",D:16,wall:"#CDBBA4",tex:"paper3",floor:"planks",ceil:"#EFE9DF",lc:0xFFE4C0,sub:"Гостиная: август, сорок два, шестнадцать свечей"},
 {k:"n",D:18,wall:"#F4F4F2",tex:"plaster",floor:"concreteLight",ceil:"#F7F7F5",lc:0xFFFFFF,sub:"Выставка N: письма, кадры, каталог"},
 {k:"kl",D:16,wall:"#C7CED5",tex:"plaster",floor:"tiles",ceil:"#E9EEF2",lc:0xE8F1FF,sub:"Научно-технический зал: прогнозы, рейтинг, станция"},
 {k:"kr",D:64,wall:"#6B2723",tex:"damask",floor:"parquet",ceil:"#EDE6D6",lc:0xFFF0D8,tall:true,sub:"Большая галерея, которая становится супермаркетом"}
];
const HW=8; /* полуширина зала */

/* ---------- процедурные текстуры ---------- */
function cnv(w,h,f){const c=document.createElement("canvas");c.width=w;c.height=h;f(c.getContext("2d"),w,h);return c}
function noise(g,w,h,a){const im=g.getImageData(0,0,w,h),d=im.data;for(let i=0;i<d.length;i+=4){const r=(Math.random()-.5)*a;d[i]+=r;d[i+1]+=r;d[i+2]+=r}g.putImageData(im,0,0)}
function shade(hex,k){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=x=>Math.max(0,Math.min(255,Math.round(x*k)));return `rgb(${f(r)},${f(g)},${f(b)})`}
const TEX={
 planks:()=>cnv(512,512,(g,w,h)=>{for(let i=0;i<8;i++){const y=i*64;g.fillStyle=shade("#9C7A55",.85+Math.random()*.3);g.fillRect(0,y,w,64);for(let k=0;k<30;k++){g.strokeStyle="rgba(60,40,20,.12)";g.beginPath();g.moveTo(0,y+Math.random()*64);g.bezierCurveTo(w*.3,y+Math.random()*64,w*.6,y+Math.random()*64,w,y+Math.random()*64);g.stroke()}g.fillStyle="rgba(40,25,10,.5)";g.fillRect(0,y,w,2);const x=Math.random()*w;g.fillRect(x,y,2,64)}noise(g,w,h,14)}),
 darkwood:()=>cnv(512,512,(g,w,h)=>{for(let i=0;i<8;i++){const y=i*64;g.fillStyle=shade("#4A3424",.8+Math.random()*.3);g.fillRect(0,y,w,64);g.fillStyle="rgba(0,0,0,.45)";g.fillRect(0,y,w,2)}noise(g,w,h,12)}),
 parquet:()=>cnv(512,512,(g,w,h)=>{g.fillStyle="#8E6440";g.fillRect(0,0,w,h);const L=96,W=24;for(let col=-1;col<w/L+2;col++)for(let row=-2;row<h/W+4;row++){const x=col*L,y=row*W*2+(col%2?W:0);
   g.save();g.translate(x,y);g.fillStyle=shade("#A9774A",.78+Math.random()*.34);g.beginPath();g.moveTo(0,0);g.lineTo(L/2,L/2);g.lineTo(L/2,L/2+W);g.lineTo(0,W);g.closePath();g.fill();g.strokeStyle="rgba(50,28,10,.55)";g.stroke();
   g.fillStyle=shade("#A9774A",.78+Math.random()*.34);g.beginPath();g.moveTo(L/2,L/2);g.lineTo(L,0);g.lineTo(L,W);g.lineTo(L/2,L/2+W);g.closePath();g.fill();g.stroke();g.restore()}noise(g,w,h,9)}),
 concrete:()=>cnv(512,512,(g,w,h)=>{g.fillStyle="#BDBCB8";g.fillRect(0,0,w,h);noise(g,w,h,26);g.strokeStyle="rgba(0,0,0,.08)";g.strokeRect(0,0,w,h)}),
 concreteLight:()=>cnv(512,512,(g,w,h)=>{g.fillStyle="#D3D2CE";g.fillRect(0,0,w,h);noise(g,w,h,18)}),
 concreteDark:()=>cnv(512,512,(g,w,h)=>{g.fillStyle="#2A2C30";g.fillRect(0,0,w,h);noise(g,w,h,18);g.strokeStyle="rgba(255,255,255,.04)";g.strokeRect(0,0,w,h)}),
 stone:()=>cnv(512,512,(g,w,h)=>{g.fillStyle="#2A2426";g.fillRect(0,0,w,h);noise(g,w,h,22);g.strokeStyle="rgba(0,0,0,.4)";for(let i=0;i<=4;i++){g.beginPath();g.moveTo(i*128,0);g.lineTo(i*128,h);g.stroke();g.beginPath();g.moveTo(0,i*128);g.lineTo(w,i*128);g.stroke()}}),
 tiles:()=>cnv(512,512,(g,w,h)=>{for(let y=0;y<8;y++)for(let x=0;x<8;x++){g.fillStyle=(x+y)%2?"#D9DDE1":"#CDD2D7";g.fillRect(x*64,y*64,64,64)}g.strokeStyle="rgba(0,0,0,.15)";for(let i=0;i<=8;i++){g.beginPath();g.moveTo(i*64,0);g.lineTo(i*64,h);g.moveTo(0,i*64);g.lineTo(w,i*64);g.stroke()}noise(g,w,h,8)}),
 smtiles:()=>cnv(512,512,(g,w,h)=>{g.fillStyle="#ECECE8";g.fillRect(0,0,w,h);g.strokeStyle="rgba(0,0,0,.12)";for(let i=0;i<=4;i++){g.beginPath();g.moveTo(i*128,0);g.lineTo(i*128,h);g.moveTo(0,i*128);g.lineTo(w,i*128);g.stroke()}noise(g,w,h,6)}),
 plaster:(base)=>cnv(256,256,(g,w,h)=>{g.fillStyle=base;g.fillRect(0,0,w,h);noise(g,w,h,10)}),
 paper1:(base)=>cnv(256,256,(g,w,h)=>{g.fillStyle=base;g.fillRect(0,0,w,h);g.fillStyle="rgba(120,90,60,.12)";for(let y=0;y<h;y+=32)for(let x=(y/32%2)*16;x<w;x+=32){g.beginPath();g.arc(x,y,4,0,7);g.fill()}g.fillStyle="rgba(120,90,60,.07)";for(let x=0;x<w;x+=64)g.fillRect(x,0,10,h);noise(g,w,h,8)}),
 paper2:(base)=>cnv(256,256,(g,w,h)=>{g.fillStyle=base;g.fillRect(0,0,w,h);g.strokeStyle="rgba(210,200,160,.14)";g.lineWidth=2;for(let x=0;x<w;x+=32){g.beginPath();for(let y=0;y<=h;y+=8)g.lineTo(x+Math.sin(y/20)*6,y);g.stroke()}noise(g,w,h,8)}),
 paper3:(base)=>cnv(256,256,(g,w,h)=>{g.fillStyle=base;g.fillRect(0,0,w,h);g.fillStyle="rgba(255,255,255,.18)";for(let x=0;x<w;x+=24)g.fillRect(x,0,8,h);noise(g,w,h,8)}),
 damask:(base)=>cnv(256,256,(g,w,h)=>{g.fillStyle=base;g.fillRect(0,0,w,h);g.fillStyle="rgba(0,0,0,.12)";for(let y=0;y<h;y+=64)for(let x=((y/64)%2)*32;x<w;x+=64){g.beginPath();g.ellipse(x,y,14,24,0,0,7);g.fill();g.beginPath();g.ellipse(x,y,5,9,0,0,7);g.fillStyle="rgba(255,220,180,.06)";g.fill();g.fillStyle="rgba(0,0,0,.12)"}noise(g,w,h,8)})
};
function painting(seed,w=512,h=384){let s=seed;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};
  return cnv(w,h,(g)=>{const sky=g.createLinearGradient(0,0,0,h);const hue=Math.floor(r()*60)+20;sky.addColorStop(0,`hsl(${hue+180},${20+r()*20}%,${55+r()*20}%)`);sky.addColorStop(1,`hsl(${hue},${30+r()*20}%,${70+r()*15}%)`);g.fillStyle=sky;g.fillRect(0,0,w,h);
   const hy=h*(.5+r()*.25);for(let i=0;i<3;i++){g.fillStyle=`hsl(${hue+i*20},${25+r()*20}%,${25+i*10+r()*10}%)`;g.beginPath();g.moveTo(0,hy+i*20);for(let x=0;x<=w;x+=16)g.lineTo(x,hy+i*24+Math.sin(x/(40+r()*60)+r()*6)*(12+r()*16));g.lineTo(w,h);g.lineTo(0,h);g.fill()}
   for(let i=0;i<220;i++){g.fillStyle=`hsla(${hue+r()*60},30%,${30+r()*50}%,.08)`;g.fillRect(r()*w,r()*h,4+r()*16,2+r()*6)}
   g.fillStyle="rgba(0,0,0,.18)";g.fillRect(0,0,w,h*.02);noise(g,w,h,10)})}
function rothko(seed){let s=seed;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};
  return cnv(256,384,(g,w,h)=>{const base=[`#2a1416`,`#1f1a26`,`#2b1d12`,`#141c1c`][Math.floor(r()*4)];g.fillStyle=base;g.fillRect(0,0,w,h);
   for(let i=0;i<2;i++){g.fillStyle=`rgba(${80+r()*60},${20+r()*30},${30+r()*40},.55)`;g.filter="blur(6px)";g.fillRect(20,20+i*h*.48,w-40,h*.42);g.filter="none"}noise(g,w,h,8)})}
function textCanvas(title,body,opt={}){
  const W=opt.w||1024,H=opt.h||640;return cnv(W,H,(g)=>{g.fillStyle=opt.bg||"#FBFBFA";g.fillRect(0,0,W,H);g.fillStyle=opt.fg||"#16191D";
   g.font=`${opt.ts||54}px ${opt.font||"Literata, Georgia, serif"}`;let y=opt.pad||80;const pad=opt.pad||80;
   const wrap=(t,size,lh)=>{g.font=`${size}px ${opt.font||"Literata, Georgia, serif"}`;const words=String(t).split(/\s+/);let line="";words.forEach(wd=>{const test=line?line+" "+wd:wd;if(g.measureText(test).width>W-pad*2){g.fillText(line,pad,y);y+=lh;line=wd}else line=test});if(line){g.fillText(line,pad,y);y+=lh}};
   if(title){wrap(title,opt.ts||54,(opt.ts||54)*1.25);y+=18}
   if(body){g.fillStyle=opt.fg2||opt.fg||"#2A2E33";wrap(body,opt.bs||34,(opt.bs||34)*1.45)}})}
function plaqueCanvas(name,sub){return cnv(512,200,(g,w,h)=>{g.fillStyle="#F5F3EE";g.fillRect(0,0,w,h);g.strokeStyle="rgba(0,0,0,.2)";g.strokeRect(1,1,w-2,h-2);g.fillStyle="#1A1D21";g.font="500 30px Golos Text, sans-serif";
  const words=name.split(" ");let line="",y=52;words.forEach(wd=>{const t=line?line+" "+wd:wd;if(g.measureText(t).width>w-40){g.fillText(line,20,y);y+=36;line=wd}else line=t});g.fillText(line,20,y);
  g.fillStyle="#6A737C";g.font="20px JetBrains Mono, monospace";g.fillText(sub,20,h-22)})}

/* ---------- сборка ---------- */
function mount(host,opt){
  const T=window.THREE;
  host.innerHTML=`<div class="hallwrap"><canvas tabindex="0" aria-label="Музей: трёхмерные залы"></canvas><div class="hud"><div class="where"><small></small><span></span></div><div class="keys">W A S D или стрелки — идти<br>перетаскивание — оглядеться<br>клик по полу — подойти<br>E или клик — рассмотреть</div><div class="cross"></div><div class="near" hidden></div><div class="stick"><i></i></div><div class="hallbar"></div></div>
    <div class="gate"><div><h3>Музей всего дорогого</h3><p>Десять залов анфиладой: от квартир, в которых неуютно, до галереи, которая становится супермаркетом. Предметы ведут в записи.</p><button class="start" type="button">Войти</button></div></div></div>`;
  const wrap=host.querySelector(".hallwrap"),canvas=wrap.querySelector("canvas"),gate=wrap.querySelector(".gate"),hud=wrap.querySelector(".hud");
  const whereEl=hud.querySelector(".where span"),whereSm=hud.querySelector(".where small"),nearEl=hud.querySelector(".near"),bar=hud.querySelector(".hallbar"),stick=hud.querySelector(".stick"),knob=stick.querySelector("i");
  let stopped=false,raf=0,R=null;
  const fail=(msg)=>{wrap.insertAdjacentHTML("beforeend",`<div class="hallmsg">${msg}</div>`)};
  let started=false;
  gate.querySelector("button").onclick=()=>{gate.remove();started=true;canvas.focus();boot()};
  function boot(){
    (window.THREE_READY||Promise.resolve(!!window.THREE)).then(ok=>{if(stopped)return;if(!ok||!window.THREE){fail("Трёхмерная библиотека не загрузилась. Залы доступны в каталоге.");return}try{build(window.THREE)}catch(err){console.error(err);fail("Браузер не смог запустить трёхмерные залы (WebGL). Предметы доступны в каталоге.")}})
  }
  function build(T){
    R=new T.WebGLRenderer({canvas,antialias:true,powerPreference:"high-performance"});R.setPixelRatio(Math.min(1.6,devicePixelRatio));
    const S=new T.Scene();S.background=new T.Color(0x0b0c0e);S.fog=new T.Fog(0x0b0c0e,18,46);
    const cam=new T.PerspectiveCamera(62,1,.05,200);cam.rotation.order="YXZ";
    const hemi=new T.HemisphereLight(0xffffff,0x3a3530,.55);S.add(hemi);
    const amb=new T.AmbientLight(0xffffff,.18);S.add(amb);
    const lights=[0,1,2].map(()=>{const l=new T.PointLight(0xffffff,0.9,16,1.6);S.add(l);return l});
    const texCache={};
    const tex=(name,base,rep)=>{const key=name+base+rep;if(texCache[key])return texCache[key];const c=TEX[name](base);const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;if(rep)t.repeat.set(rep[0],rep[1]);t.anisotropy=4;const u=opt.texUrl&&opt.texUrl(name);if(u){const im=new Image();im.onload=()=>{t.image=im;t.needsUpdate=true};im.src=u}return texCache[key]=t};
    const mat=(c,o={})=>new T.MeshLambertMaterial(Object.assign({color:c},o));
    const clickable=[],floors=[],blockers=[],walk=[],anim=[];
    const add=(m,x,y,z)=>{m.position.set(x,y,z);S.add(m);return m};
    const box=(w,h,d,m,x,y,z,blk)=>{const me=add(new T.Mesh(new T.BoxGeometry(w,h,d),m),x,y,z);if(blk)blockers.push([x-w/2,x+w/2,z-d/2,z+d/2]);return me};
    const cyl=(r1,r2,h,m,x,y,z,seg=24)=>add(new T.Mesh(new T.CylinderGeometry(r1,r2,h,seg),m),x,y,z);
    const shadowTex=new T.CanvasTexture(cnv(128,128,(g)=>{const gr=g.createRadialGradient(64,64,4,64,64,62);gr.addColorStop(0,"rgba(0,0,0,.55)");gr.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=gr;g.fillRect(0,0,128,128)}));
    const contact=(x,z,w,d)=>{const p=new T.Mesh(new T.PlaneGeometry(w,d),new T.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false}));p.rotation.x=-Math.PI/2;p.position.set(x,.012,z);S.add(p)};
    const imgOnto=(c,url)=>{if(!url)return;const im=new Image();im.onload=()=>{const g=c.getContext("2d"),W=c.width,H=c.height,s=Math.max(W/im.width,H/im.height),w=im.width*s,h=im.height*s;g.drawImage(im,(W-w)/2,(H-h)/2,w,h);if(c.__tex)c.__tex.needsUpdate=true};im.src=url};
    const PAINT=opt.paint||{};const pick_=(k,i)=>{const a=PAINT[k]||[];return a.length?a[i%a.length]:null};
const textPlane=(c,w,h,x,y,z,ry=0,basic=true)=>{const t=new T.CanvasTexture(c);c.__tex=t;const m=new T.Mesh(new T.PlaneGeometry(w,h),basic?new T.MeshBasicMaterial({map:t}):new T.MeshLambertMaterial({map:t}));m.position.set(x,y,z);m.rotation.y=ry;S.add(m);return m};

    /* залы */
    let z=0;const HALLZ=[];
    SPEC.forEach((s,i)=>{
      const z0=z,z1=z-s.D,H=s.tall?8.5:(s.k==="pr"||s.k==="sv"||s.k==="dv"?4.6:4.2);HALLZ.push({...s,z0,z1,H,cz:(z0+z1)/2});
      const fl=new T.Mesh(new T.PlaneGeometry(HW*2,s.D),mat(0xffffff,{map:tex(s.floor,"",[HW/2,s.D/4])}));fl.rotation.x=-Math.PI/2;fl.position.set(0,0,(z0+z1)/2);S.add(fl);floors.push(fl);
      const ce=new T.Mesh(new T.PlaneGeometry(HW*2,s.D),new T.MeshBasicMaterial({color:new T.Color(s.ceil).multiplyScalar(s.k==="sv"||s.k==="dv"||s.k==="pr"?.9:.82)}));
      if(!s.tall&&s.k!=="sv"){const fx=new T.MeshBasicMaterial({color:s.k==="dv"?0x6F8FD0:s.k==="kl"||s.k==="id"||s.k==="n"?0xF7FAFF:0xFFF1D6});for(let q=0;q<Math.floor(s.D/5);q++)[-3.5,3.5].forEach(xx=>{const f=new T.Mesh(new T.PlaneGeometry(s.k==="kl"||s.k==="id"||s.k==="n"?2.2:.7,s.k==="kl"||s.k==="id"||s.k==="n"?.35:.7),fx);f.rotation.x=Math.PI/2;f.position.set(xx,H-.01,z0-2.5-q*5);S.add(f)})}ce.rotation.x=Math.PI/2;ce.position.set(0,H,(z0+z1)/2);S.add(ce);
      const wm=mat(0xffffff,{map:tex(s.tex,s.wall,[s.D/3,H/3])});
      const wl=new T.Mesh(new T.PlaneGeometry(s.D,H),wm);wl.rotation.y=Math.PI/2;wl.position.set(-HW,H/2,(z0+z1)/2);S.add(wl);
      const wr=new T.Mesh(new T.PlaneGeometry(s.D,H),wm);wr.rotation.y=-Math.PI/2;wr.position.set(HW,H/2,(z0+z1)/2);S.add(wr);
      const base=mat(0x1d1a17);box(.04,.16,s.D,base,-HW+.02,.08,(z0+z1)/2);box(.04,.16,s.D,base,HW-.02,.08,(z0+z1)/2);
      /* перегородка в конце зала с проёмом */
      const pm=mat(0xffffff,{map:tex(s.tex,s.wall,[2,H/3])});const endFull=i===SPEC.length-1;
      if(endFull){const e=new T.Mesh(new T.PlaneGeometry(HW*2,H),pm);e.position.set(0,H/2,z1);S.add(e)}
      else{const nH=Math.max(H,HALLZ[i]?H:H);[-1,1].forEach(sg=>{const w=HW-1.5;const p=new T.Mesh(new T.BoxGeometry(w,nH,.3),pm);p.position.set(sg*(1.5+w/2),nH/2,z1);S.add(p)});
        const lint=new T.Mesh(new T.BoxGeometry(3,nH-3,.3),pm);lint.position.set(0,3+(nH-3)/2,z1);S.add(lint);
        const fr=mat(0x2a241f);box(.12,3,.36,fr,-1.5,1.5,z1);box(.12,3,.36,fr,1.5,1.5,z1);box(3.2,.12,.36,fr,0,3,z1);
        /* табличка следующего зала */
        textPlane(textCanvas(opt.halls[SPEC[i+1].k],"",{w:512,h:96,ts:40,pad:24,bg:"#141619",fg:"#E9EDF0",font:"Golos Text, sans-serif"}),1.6,.3,0,3.35,z1+.16)}
      if(i===0){const e=new T.Mesh(new T.PlaneGeometry(HW*2,H),pm);e.rotation.y=Math.PI;e.position.set(0,H/2,z0);S.add(e)}
      walk.push([-HW+.45,HW-.45,z1+.45,z0-.45]);if(!endFull)walk.push([-1.1,1.1,z1-.6,z1+.6]);
      /* название зала на стене у входа */
      textPlane(textCanvas(opt.halls[s.k],s.sub,{w:1024,h:300,ts:64,bs:30,pad:40,bg:s.k==="sv"||s.k==="dv"||s.k==="pr"||s.k==="ot"||s.k==="kr"?"#141619":"#FFFFFF",fg:s.k==="sv"||s.k==="dv"||s.k==="pr"||s.k==="ot"||s.k==="kr"?"#E9EDF0":"#16191D",fg2:"#8A939B"}),2.4,.7,-HW+.02,2.3,z0-2.2,Math.PI/2);
      z=z1;
    });
    const hallAt=zz=>{for(let i=0;i<HALLZ.length;i++)if(zz<=HALLZ[i].z0+.1&&zz>=HALLZ[i].z1-.1)return i;return 0};

    /* предметы */
    const byHall={};opt.objs.forEach(o=>(byHall[o.h]=byHall[o.h]||[]).push(o));
    const hasPh=o=>opt.photo&&opt.photo(o.id)?1:0;Object.values(byHall).forEach(a=>a.sort((p,q)=>hasPh(q)-hasPh(p)||(q.to?q.to.length:0)-(p.to?p.to.length:0)||p.n-q.n));
    function thing(o){
      const g=new T.Group();const nm=o.name.toLowerCase();let h=0;for(const ch of o.name)h=(h*31+ch.charCodeAt(0))>>>0;
      const col=new T.Color().setHSL((h%360)/360,.22,.42);const m=mat(col),light=mat(0xF2EEE4),dark=mat(0x1a1c20);
      const put=(geo,mm,x,y,zz,rx=0,ry=0,rz=0)=>{const me=new T.Mesh(geo,mm);me.position.set(x,y,zz);me.rotation.set(rx,ry,rz);g.add(me);return me};
      if(/круж|чашк/.test(nm)){put(new T.CylinderGeometry(.07,.065,.12,24),light,0,.06,0);put(new T.TorusGeometry(.04,.012,8,16),light,.08,.06,0,0,0,Math.PI/2)}
      else if(/стакан|бокал|банк|бутыл/.test(nm)){put(new T.CylinderGeometry(.05,.045,.16,24),new T.MeshLambertMaterial({color:0xDCE8EE,transparent:true,opacity:.55}),0,.08,0)}
      else if(/пакет|сумк|мешк|рюкзак/.test(nm)){put(new T.BoxGeometry(.32,.36,.18),m,0,.18,0);put(new T.TorusGeometry(.07,.01,6,16,Math.PI),m,0,.36,0)}
      else if(/телефон|экран|ноутбук|станци|планшет/.test(nm)){put(new T.BoxGeometry(.08,.16,.012),dark,0,.1,0,-.3);put(new T.PlaneGeometry(.07,.14),new T.MeshBasicMaterial({color:col.clone().offsetHSL(0,.3,.25)}),0,.101,.0065,-.3)}
      else if(/тетрад|книг|каталог/.test(nm)){put(new T.BoxGeometry(.26,.025,.2),m,0,.0125,0);put(new T.BoxGeometry(.25,.018,.19),light,0,.027,0)}
      else if(/письм|лист|открытк|фото|снимок|билет|чек|анкет|форм|бланк|распечат|список|записк|талон|номерок/.test(nm)){for(let i=0;i<3;i++)put(new T.BoxGeometry(.18,.003,.13),light,i*.02,.004+i*.004,i*.015,0,(i-1)*.25)}
      else if(/ключ/.test(nm)){put(new T.TorusGeometry(.03,.007,8,20),mat(0xC9A54A),0,.01,0,Math.PI/2);put(new T.BoxGeometry(.08,.006,.012),mat(0xC9A54A),.06,.01,0)}
      else if(/очк/.test(nm)){[-1,1].forEach(s=>put(new T.TorusGeometry(.03,.005,8,24),dark,s*.035,.03,0));put(new T.BoxGeometry(.02,.004,.004),dark,0,.03,0)}
      else if(/одеял|рубашк|халат|шарф|куртк|бель|носок|кофт|плать/.test(nm)){put(new T.BoxGeometry(.34,.06,.26),m,0,.03,0);put(new T.BoxGeometry(.3,.05,.22),m,0,.08,0,0,.2)}
      else if(/часы|стрелк|табло/.test(nm)){put(new T.CylinderGeometry(.12,.12,.03,32),light,0,.14,0,Math.PI/2)}
      else if(/стул|табурет/.test(nm)){put(new T.BoxGeometry(.3,.03,.3),m,0,.3,0);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>put(new T.BoxGeometry(.025,.3,.025),m,a*.13,.15,b*.13));put(new T.BoxGeometry(.3,.3,.025),m,0,.45,-.14)}
      else if(/отвёрт|отверт|изолент|кабел/.test(nm)){put(new T.CylinderGeometry(.012,.012,.16,8),mat(0xB03A2E),0,.02,0,0,0,Math.PI/2);put(new T.CylinderGeometry(.004,.004,.1,6),mat(0xBBBBBB),.12,.02,0,0,0,Math.PI/2)}
      else if(/кассет|наушник|музык|пластин/.test(nm)){put(new T.TorusGeometry(.06,.014,8,24,Math.PI),dark,0,.07,0);[-1,1].forEach(s=>put(new T.CylinderGeometry(.03,.03,.02,16),dark,s*.06,.03,0,0,0,Math.PI/2))}
      else{put(new T.BoxGeometry(.18,.14,.14),m,0,.07,0)}
      return g;
    }
    function pedestal(o,x,zz,kind){
      const grp=new T.Group();grp.position.set(x,0,zz);
      const pm=kind==="glass"?mat(0x3A2E25):kind==="dark"?mat(0x1B1C1F):mat(0xF0EFEC);
      const ped=new T.Mesh(new T.BoxGeometry(.6,1,.6),pm);ped.position.y=.5;grp.add(ped);
      const th=thing(o);th.position.y=1;grp.add(th);
      const pu=opt.photo&&opt.photo(o.id);if(pu){const tx=new T.TextureLoader().load(pu);if(T.sRGBEncoding)tx.encoding=T.sRGBEncoding;const fr=new T.Mesh(new T.BoxGeometry(.54,.41,.02),mat(0x1a1a1a));fr.position.set(0,1.34,-.2);fr.rotation.x=-.12;grp.add(fr);const pp=new T.Mesh(new T.PlaneGeometry(.5,.375),new T.MeshBasicMaterial({map:tx}));pp.position.set(0,0,.011);fr.add(pp);window.__photoPlanes=(window.__photoPlanes||[]).concat(o.id)}
      if(kind==="glass"){const gl=new T.Mesh(new T.BoxGeometry(.56,.42,.56),new T.MeshLambertMaterial({color:0xE8F2F6,transparent:true,opacity:.14}));gl.position.y=1.21;grp.add(gl)}
      const pl=new T.Mesh(new T.PlaneGeometry(.36,.14),new T.MeshBasicMaterial({map:new T.CanvasTexture(plaqueCanvas(o.name.length>46?o.name.slice(0,44)+"…":o.name,"запись "+o.n))}));pl.position.set(0,.84,.301);pl.rotation.x=-.25;grp.add(pl);
      grp.traverse(m=>{m.userData.id=o.id});S.add(grp);clickable.push(grp);blockers.push([x-.42,x+.42,zz-.42,zz+.42]);contact(x,zz,1.1,1.1);
      grp.userData.label=o.name;grp.userData.n=o.n;return grp;
    }
    const pick=(k,n)=>(byHall[k]||[]).filter(o=>o.id!=="cards").slice(0,n);
    const H_=Object.fromEntries(HALLZ.map(h=>[h.k,h]));

    /* — Квартиры: три комнаты-экспозиции за канатами — */
    (function(){const h=H_.kv;const z0=h.z0;
      const rope=(x1,z1,x2,z2)=>{const pm=mat(0xB8962E);[[x1,z1],[x2,z2]].forEach(([x,zz])=>{cyl(.03,.05,.9,pm,x,.45,zz);cyl(.06,.06,.04,pm,x,.92,zz)});const len=Math.hypot(x2-x1,z2-z1);const r=new T.Mesh(new T.CylinderGeometry(.015,.015,len,8),mat(0x7A1E1E));r.position.set((x1+x2)/2,.8,(z1+z2)/2);r.rotation.z=Math.PI/2;r.rotation.y=-Math.atan2(z2-z1,x2-x1);S.add(r)};
      /* кухня Valentina */
      const kz=z0-6;const wood=mat(0x8A6A48),white=mat(0xF2F0EA),floor2=mat(0xD8CBB4,{map:tex("tiles","",[3,3])});
      const pf=new T.Mesh(new T.PlaneGeometry(6,5),floor2);pf.rotation.x=-Math.PI/2;pf.position.set(-4.6,.015,kz);S.add(pf);
      box(1.4,.06,.9,wood,-4.8,.78,kz,true);[[-.6,-.38],[.6,-.38],[-.6,.38],[.6,.38]].forEach(([a,b])=>box(.05,.76,.05,wood,-4.8+a,.38,kz+b));
      box(.5,.05,.5,wood,-4.8,.46,kz+.85);box(.5,.5,.05,wood,-4.8,.7,kz+1.08);
      box(.7,1.8,.65,white,-7.5,.9,kz-1.6,true);box(.02,.02,.3,mat(0x999999),-7.14,1.1,kz-1.6);
      box(.14,.1,.01,mat(0xC8433A),-7.14,1.5,kz-1.8);
      box(2.4,.9,.6,white,-6.6,.45,kz+2.2,true);box(2.4,.04,.62,mat(0x6E6A64),-6.6,.92,kz+2.2);
      cyl(.11,.1,.02,white,-4.6,.82,kz);/* тарелка */
      const cards=opt.objs.find(o=>o.id==="cards");if(cards){const cg=new T.Group();cg.position.set(-5.1,.81,kz-.1);for(let i=0;i<9;i++){const c=new T.Mesh(new T.BoxGeometry(.15,.003,.1),mat([0xE7C9A0,0xB9D2E6,0xE9B4B4,0xD8E2B0][i%4]));c.position.set((i%3)*.17-.1,i*.003,Math.floor(i/3)*.12-.1);c.rotation.y=(i%5-2)*.18;cg.add(c)}if(opt.photo&&opt.photo("cards")){const tx=new T.TextureLoader().load(opt.photo("cards"));if(T.sRGBEncoding)tx.encoding=T.sRGBEncoding;const fr=new T.Mesh(new T.BoxGeometry(.34,.26,.015),mat(0x1a1a1a));fr.position.set(.38,.15,-.05);fr.rotation.x=-.2;const pp=new T.Mesh(new T.PlaneGeometry(.31,.23),new T.MeshBasicMaterial({map:tx}));pp.position.z=.009;fr.add(pp);cg.add(fr);window.__photoPlanes=(window.__photoPlanes||[]).concat("cards")}
cg.traverse(m=>m.userData.id="cards");cg.userData.label=cards.name;cg.userData.n=3;S.add(cg);clickable.push(cg)}
      const lamp=new T.Mesh(new T.CylinderGeometry(.18,.3,.22,24,1,true),new T.MeshLambertMaterial({color:0xF3D9A0,side:T.DoubleSide,emissive:0x664411}));lamp.position.set(-4.8,2.5,kz);S.add(lamp);
      rope(-1.8,kz-2.6,-1.8,kz+2.6);
      textPlane(textCanvas("Кухня · ночь с 15 на 16 марта 2027","Тарелку она греет под горячей водой сорок секунд. Второе одеяло. Пакет с двойным узлом.",{w:900,h:300,ts:40,bs:26,pad:30}),1.5,.5,-1.75,1.3,kz+2.9,Math.PI/2);
      /* съёмная квартира */
      const rz=z0-15;
      box(2,.45,1.4,mat(0x7F8A94),4.9,.22,rz-1.2,true);box(1.9,.1,1.3,mat(0x8F7C9B),4.9,.5,rz-1.2);
      [[6.8,rz+1.5],[6.2,rz+1.9],[6.9,rz+2.4]].forEach(([x,zz],i)=>box(.6,.45,.5,mat(0xB59A72),x,.22+(i===2?.45:0),zz,true));
      box(1.2,.75,.6,mat(0x6E5A44),3.6,.375,rz+1.8,true);box(.34,.02,.24,mat(0x2a2c30),3.6,.77,rz+1.8);
      box(1.2,1.8,.5,mat(0x8C7356),7.6,.9,rz-2.8,true);box(.02,.6,.02,mat(0xDDDDDD),7.34,1.1,rz-2.7);
      rope(1.8,rz-3,1.8,rz+3);
      textPlane(textCanvas("Своё место · март 2027","Хозяйские коробки, шатающаяся ручка шкафа, свет, в котором хорошо фотографировать ноутбук и плохо жить.",{w:900,h:300,ts:40,bs:26,pad:30}),1.5,.5,1.75,1.3,rz+3.3,-Math.PI/2);
      /* квартира отца */
      const fz=z0-21;box(.5,.05,.5,mat(0x6B5640),-6.8,.46,fz);box(.5,.5,.05,mat(0x6B5640),-6.8,.7,fz-.24);[[-.22,-.22],[.22,-.22],[-.22,.22],[.22,.22]].forEach(([a,b])=>box(.04,.46,.04,mat(0x6B5640),-6.8+a,.23,fz+b));
      box(.9,.6,.6,mat(0xC9B79A),-4.5,.3,fz+.6,true);textPlane(cnv(256,128,(g)=>{g.fillStyle="#F3EEE2";g.fillRect(0,0,256,128);g.fillStyle="#222";g.font="64px Caveat, cursive";g.fillText("96",90,84)}),.3,.15,-4.5,.45,fz+.91);
      textPlane(textCanvas("Квартира отца · август 2027","Закрыта больше года. Стул у стены. Коробка «96». Тетрадь найдена здесь.",{w:900,h:300,ts:40,bs:26,pad:30}),1.5,.5,-1.75,1.3,fz+.8,Math.PI/2);
      rope(-1.8,fz-1.5,-1.8,fz+1.6);
      pick("kv",4).forEach((o,i)=>pedestal(o,5.6-(i%2)*2.2,z0-5-Math.floor(i/2)*2.6));
    })();

    /* — Предметы: витрины рядами — */
    (function(){const h=H_.pr;const a=pick("pr",16);a.forEach((o,i)=>{const row=i%4,col=Math.floor(i/4);pedestal(o,[-5.6,-2.8,2.8,5.6][row],h.z0-3.5-col*3.6,"glass")});
      for(let i=0;i<4;i++){const sp=new T.Mesh(new T.ConeGeometry(.5,1.2,24,1,true),new T.MeshBasicMaterial({color:0xFFD08A,transparent:true,opacity:.05,side:T.DoubleSide,depthWrite:false}));sp.position.set([-5.6,-2.8,2.8,5.6][i],3.8,h.z0-9);S.add(sp)}})();

    /* — Идеи: белый куб с панелями — */
    (function(){const h=H_.id;IDEAS.forEach((it,i)=>{const side=i%2?1:-1;const k=Math.floor(i/2);const zz=h.z0-2.6-k*2.6;
      const c=textCanvas(it[0],it[1],{w:900,h:600,ts:52,bs:30,pad:56,bg:"#FFFFFF",fg:"#121417",fg2:"#3A3F45"});textPlane(c,2.1,1.4,side*(HW-.03),1.8,zz,side>0?-Math.PI/2:Math.PI/2,false)});
      const b=mat(0x2C2C2C);box(2.2,.45,.6,b,0,.22,h.cz,true);pick("id",3).forEach((o,i)=>pedestal(o,(i-1)*2.4,h.z1+3));})();

    /* — Святилище: восьмиугольник, одна вещь, стрелка идёт только под взглядом — */
    let clockHand=null,clockPos=null;
    (function(){const h=H_.sv;const r=5.6;let svN=0;for(let i=0;i<8;i++){const a=i/8*Math.PI*2+Math.PI/8;const x=Math.sin(a)*r,zz=h.cz+Math.cos(a)*r;if(Math.abs(x)<1.6&&Math.abs(zz-h.cz)>4)continue;
        {const c=rothko(i*7919+3);const pp=pick_("sv",svN++);if(pp)imgOnto(c,pp.url);textPlane(c,1.3,1.9,x*.98,2.1,zz,Math.atan2(-x,-(zz-h.cz)),false)}}
      const pl=box(.7,1.05,.7,mat(0x0E0C0D),0,.52,h.cz,true);contact(0,h.cz,1.4,1.4);
      const face=new T.Mesh(new T.CylinderGeometry(.22,.22,.04,48),mat(0xF1EEE6));face.rotation.x=Math.PI/2;face.position.set(0,1.35,h.cz);S.add(face);
      const rim=new T.Mesh(new T.TorusGeometry(.22,.02,10,48),mat(0x222222));rim.position.set(0,1.35,h.cz+.005);S.add(rim);
      for(let i=0;i<12;i++){const t=new T.Mesh(new T.BoxGeometry(.012,.04,.01),mat(0x222222));const a=i/12*Math.PI*2;t.position.set(Math.sin(a)*.18,1.35+Math.cos(a)*.18,h.cz+.025);t.rotation.z=-a;S.add(t)}
      const hand=new T.Group();hand.position.set(0,1.35,h.cz+.03);const hm=new T.Mesh(new T.BoxGeometry(.006,.19,.004),mat(0xB0302A));hm.position.y=.08;hand.add(hm);S.add(hand);clockHand=hand;clockPos=new T.Vector3(0,1.35,h.cz);
      const st=new T.Mesh(new T.CylinderGeometry(.03,.03,.25,8),mat(0x222222));st.position.set(0,1.15,h.cz);S.add(st);
      const clk=opt.objs.find(o=>/секундн/i.test(o.name))||opt.objs.find(o=>/часы/i.test(o.name));
      [pl,face,rim].forEach(m=>{m.userData.id=clk?clk.id:"";});if(clk){pl.userData.label=clk.name;pl.userData.n=clk.n;face.userData.label=clk.name;face.userData.n=clk.n;clickable.push(pl,face)}
      const sp=new T.SpotLight(0xFFE2B8,1.4,9,.35,.6,1.4);sp.position.set(0,4.4,h.cz+.4);sp.target.position.set(0,1.2,h.cz);S.add(sp);S.add(sp.target)})();

    /* — Двойники: экраны с журналами — */
    const screens=[];
    (function(){const h=H_.dv;const lines=[];Object.values(opt.book).filter(e=>e.v==="v1"||e.v==="v1pack").forEach(e=>e.seg.forEach(s=>{if(s.t)s.t.split(/\n|(?<=\.)\s/).forEach(l=>{if(l.trim())lines.push(l.trim())})}));
      const mk=(x,zz,ry,w,hh,title)=>{const c=document.createElement("canvas");c.width=1024;c.height=Math.round(1024*hh/w);const t=new T.CanvasTexture(c);const m=new T.Mesh(new T.PlaneGeometry(w,hh),new T.MeshBasicMaterial({map:t}));m.position.set(x,hh/2+.6,zz);m.rotation.y=ry;S.add(m);screens.push({c,t,title,off:Math.floor(Math.random()*lines.length)});return m};
      mk(-HW+.05,h.z0-5,Math.PI/2,4,2.2,"viktor-1 / журнал");mk(HW-.05,h.z0-5,-Math.PI/2,4,2.2,"пакет / контакты");mk(-HW+.05,h.z0-12,Math.PI/2,4,2.2,"две настройки");
      screens.forEach(s=>s.lines=lines);
      const port=(x,label,sub,go)=>{const c=textCanvas(label,sub,{w:600,h:900,ts:64,bs:30,pad:50,bg:"#0F1318",fg:"#E9EDF0",fg2:"#8FB4FF"});const m=textPlane(c,1.1,1.65,x,1.6,h.z1+.06);m.userData.go=go;m.userData.label=label+" · написать";clickable.push(m);const f=box(1.2,1.75,.06,mat(0x050608),x,1.6,h.z1+.02)};
      port(3.2,"Viktor-1","Рабочая копия, весна 2027. Сейчас — запись в базе. Нажмите, чтобы написать.","msgs:v1");port(5.6,"N · копия","Собрана из переписки. Чьей — не её. Нажмите, чтобы написать.","msgs:ncopy");
      pick("dv",4).forEach((o,i)=>pedestal(o,2.6+(i%2)*2.6,h.z0-4-Math.floor(i/2)*3,"dark"))})();
    function drawScreens(t){screens.forEach((s,i)=>{const g=s.c.getContext("2d"),W=s.c.width,H=s.c.height;g.fillStyle="#08100B";g.fillRect(0,0,W,H);g.fillStyle="#5F8569";g.font="26px JetBrains Mono, monospace";g.fillText("# "+s.title,30,44);
      g.fillStyle="#B6E3C3";g.font="30px JetBrains Mono, monospace";const n=Math.floor(H/44)-2;for(let k=0;k<n;k++){const l=s.lines[(s.off+k+Math.floor(t/1.4)+i*7)%s.lines.length]||"";g.fillText((l.length>52?l.slice(0,51)+"…":l),30,96+k*44)}s.t.needsUpdate=true})}

    /* — Отец: кабинет — */
    (function(){const h=H_.ot;const wood=mat(0x4A3727);
      box(1.8,.06,.9,wood,0,.8,h.z0-6,true);[[-.8,-.38],[.8,-.38],[-.8,.38],[.8,.38]].forEach(([a,b])=>box(.06,.8,.06,wood,a,.4,h.z0-6+b));contact(0,h.z0-6,2.4,1.4);
      const nb=opt.objs.find(o=>o.n===40&&/тетрад/i.test(o.name))||opt.objs.find(o=>/тетрад/i.test(o.name)&&o.h==="ot")||opt.objs.find(o=>/тетрад/i.test(o.name)&&opt.photo&&opt.photo(o.id));
      const book_=box(.42,.03,.3,mat(0x2F4F7F),0,.85,h.z0-6);const pg=box(.4,.012,.28,mat(0xF2EBD8),0,.872,h.z0-6);
      const gl=new T.Mesh(new T.BoxGeometry(.7,.36,.55),new T.MeshLambertMaterial({color:0xDDEEFF,transparent:true,opacity:.16}));gl.position.set(0,1.01,h.z0-6);S.add(gl);
      if(nb){[book_,pg,gl].forEach(m=>{m.userData.id=nb.id;m.userData.label=nb.name;m.userData.n=nb.n});clickable.push(gl)}
      box(.5,.05,.5,wood,-HW+.6,.46,h.z0-9);box(.5,.5,.05,wood,-HW+.6,.7,h.z0-9-.24);/* стул у стены */
      box(.4,2.6,2.6,mat(0x3A2A1C),HW-.2,1.3,h.z0-4,true);for(let s=0;s<4;s++)for(let b=0;b<9;b++)box(.25,.32+Math.random()*.1,.07+Math.random()*.05,mat(new T.Color().setHSL(Math.random(),.25,.3)),HW-.3,.5+s*.6,h.z0-5.1+b*.26);
      box(1.4,1.8,.6,mat(0x6A5440),-HW+.7,.9,h.z0-12,true);const door=box(.62,.8,.03,mat(0x7D6650),-HW+1.05,1.3,h.z0-11.68);door.rotation.y=.25;
      box(1.5,.9,.6,wood,HW-.8,.45,h.z0-11,true);for(let i=0;i<6;i++)cyl(.15,.11,.08,mat(0xF4F1EA),HW-1.3+(i%3)*.38,.95+Math.floor(i/3)*.1,h.z0-11);
      const win=textPlane(cnv(256,384,(g)=>{const gr=g.createLinearGradient(0,0,0,384);gr.addColorStop(0,"#DCE6EE");gr.addColorStop(1,"#F7EBD2");g.fillStyle=gr;g.fillRect(0,0,256,384);g.fillStyle="#3B3329";g.fillRect(124,0,8,384);g.fillRect(0,190,256,8)}),1.2,1.8,4.6,2,h.z1+.04);
      cyl(.18,.18,.04,mat(0x111111),2.6,.86,h.z0-6.2);box(.5,.08,.4,mat(0x5C3B22),2.6,.8,h.z0-6.2,true);box(.04,.8,.04,wood,2.6,.4,h.z0-6.2);
      textPlane(textCanvas("Трофимов и Елизаров","Он поставил своего. Сложно. Красиво. Сам себе не верит. Дослушал до конца.",{w:800,h:360,ts:40,bs:26,pad:30}),.9,.4,2.6,1.25,h.z0-5.9);
      pick("ot",3).forEach((o,i)=>pedestal(o,-3+i*3,h.z1+3))})();

    /* — Семья: гостиная — */
    (function(){const h=H_.se;const fab=mat(0x6B7A86),wood=mat(0x6E5038);
      const rug=new T.Mesh(new T.PlaneGeometry(4.2,3),mat(0xffffff,{map:new T.CanvasTexture(cnv(512,384,(g,w,hh)=>{g.fillStyle="#6E2E2A";g.fillRect(0,0,w,hh);g.strokeStyle="#C9A26A";g.lineWidth=10;g.strokeRect(22,22,w-44,hh-44);g.lineWidth=3;g.strokeRect(44,44,w-88,hh-88);g.fillStyle="#2E3A5C";for(let i=0;i<5;i++){g.beginPath();g.ellipse(w/2,hh/2,180-i*34,120-i*22,0,0,7);g.globalAlpha=.25;g.fill()}g.globalAlpha=1;noise(g,w,hh,16)}))}));rug.rotation.x=-Math.PI/2;rug.position.set(0,.014,h.cz);S.add(rug);
      box(2.6,.45,.9,fab,0,.22,h.cz-2.2,true);box(2.6,.55,.2,fab,0,.6,h.cz-2.6);box(.2,.6,.9,fab,-1.3,.3,h.cz-2.2);box(.2,.6,.9,fab,1.3,.3,h.cz-2.2);
      box(1.3,.42,.7,wood,0,.21,h.cz,true);
      [[-.3,0],[.1,.15],[.35,-.1]].forEach(([a,b],i)=>{cyl(.045,.04,.1,mat([0xF2F2EE,0xD9C26A,0x9AB8D6][i]),a,.47,h.cz+b)});
      cyl(.18,.18,.12,mat(0xF6EAD8),-.1,.48,h.cz-.2);for(let i=0;i<16;i++){const a=i/16*Math.PI*2;const c=cyl(.006,.006,.07,mat(0xFFB7C5),-.1+Math.sin(a)*.13,.58,h.cz-.2+Math.cos(a)*.13,6);const fl=new T.Mesh(new T.SphereGeometry(.012,8,8),new T.MeshBasicMaterial({color:0xFFC870}));fl.position.set(c.position.x,.63,c.position.z);S.add(fl);anim.push(t=>{fl.scale.setScalar(.8+Math.sin(t*9+i)*.25)})}
      for(let i=0;i<6;i++){const x=-HW+.03,zz=h.z0-3-i*1.6;const c=painting(i*104729+17,384,288);{const pp=pick_("se",i);if(pp)imgOnto(c,pp.url)}box(.04,.8,1.02,mat(0x2B2018),x+.02,1.8+(i%2)*.3,zz);textPlane(c,.9,.68,x+.05,1.8+(i%2)*.3,zz,Math.PI/2,false)}
      box(1.6,.9,.08,mat(0x111111),HW-.06,1.4,h.cz,false).rotation.y=0;
      pick("se",6).forEach((o,i)=>pedestal(o,4.2+(i%2)*1.8,h.z0-3-Math.floor(i/2)*3.4))})();

    /* — N: выставка — */
    (function(){const h=H_.n;const lines=[];Object.values(opt.book).filter(e=>e.v==="n").forEach(e=>e.seg.forEach(s=>{if(s.t)s.t.split("\n").forEach(l=>{if(l.length>12&&l.length<90)lines.push(l)})}));
      for(let r=0;r<3;r++)for(let c=0;c<6;c++){const l=lines[(r*6+c)*3%Math.max(1,lines.length)]||"";const cv=cnv(300,400,(g,w,hh)=>{g.fillStyle="#F7F3EA";g.fillRect(0,0,w,hh);g.fillStyle="#2E3A70";g.font="26px Caveat, cursive";const ws=l.split(" ");let line="",y=50;ws.forEach(wd=>{const t=line?line+" "+wd:wd;if(g.measureText(t).width>w-40){g.fillText(line,20,y);y+=34;line=wd}else line=t});g.fillText(line,20,y);noise(g,w,hh,8)});
        textPlane(cv,.45,.6,-HW+.03,1.2+r*.75,h.z0-3-c*.62,Math.PI/2,false)}
      const lb=cnv(1024,512,(g,w,hh)=>{g.fillStyle="#F8F8F2";g.fillRect(0,0,w,hh);for(let i=0;i<8;i++){const x=24+(i%4)*250,y=24+Math.floor(i/4)*240;g.fillStyle="#1E1F21";g.fillRect(x,y,230,220);g.fillStyle="#ECE8DF";g.font="22px Literata, serif";const l=lines[i*5%Math.max(1,lines.length)]||"";const ws=l.split(" ");let line="",yy=y+40;ws.forEach(wd=>{const t=line?line+" "+wd:wd;if(g.measureText(t).width>200){g.fillText(line,x+14,yy);yy+=28;line=wd}else line=t});g.fillText(line,x+14,yy);g.fillStyle="#D9A441";g.font="14px monospace";g.fillText(String(i+1).padStart(2,"0")+"A ▸",x+14,y+206)}});
      const lbm=textPlane(lb,4,2,HW-.05,1.7,h.cz,-Math.PI/2);
      box(2.4,.45,.6,mat(0x2C2C2C),0,.22,h.cz,true);
      pick("n",6).forEach((o,i)=>pedestal(o,-2.4+(i%3)*2.4,h.z0-3.4-Math.floor(i/3)*(h.D-7)))})();

    /* — Клуб: табло прогнозов, станция — */
    const leds=[];
    (function(){const h=H_.kl;
      const board=textCanvas("Прогнозы · среда","Три полные копии умерших близких каждому — через 2–3 года · вероятность 0,35 · Условные 90% переноса — через 5–10 лет · 0,12 · Ответ «Океана» — 1–5 минут · 0,9 · Слово «любое» — не проверено",{w:1200,h:640,ts:60,bs:34,pad:50,bg:"#0E1A2A",fg:"#E9F0F8",fg2:"#9EC2F2",font:"JetBrains Mono, monospace"});
      textPlane(board,4.4,2.35,-4.6,2.2,h.z1+.05);
      const rate=textCanvas("Рейтинг прогнозистов","1 Джон 0,112 · 2 Роман 0,148 · 3 Сергей 0,171 · 4 Anton 0,188 · 5 Джош 0,209 · — Viktor: 0 прогнозов",{w:900,h:600,ts:48,bs:32,pad:40,bg:"#FFFFFF",fg:"#14181D",font:"Golos Text, sans-serif"});
      textPlane(rate,2.4,1.6,-HW+.04,1.8,h.cz,Math.PI/2);
      box(.7,2,.9,mat(0x1A1D21),HW-.6,1,h.cz,true);for(let i=0;i<18;i++){const l=new T.Mesh(new T.BoxGeometry(.02,.02,.02),new T.MeshBasicMaterial({color:0x4CFF8A}));l.position.set(HW-.94,.3+i*.09,h.cz-.3+(i%3)*.12);S.add(l);leds.push(l)}
      textPlane(textCanvas("Домашняя станция","Ночью в пуле кружка. Основание: анкета, отложенная часть, дозаполнена в среду.",{w:800,h:360,ts:40,bs:26,pad:30}),.9,.4,HW-.96,2.25,h.cz,-Math.PI/2);
      box(4,.05,1.2,mat(0xDADDE0),0,.76,h.cz,true);for(let i=0;i<4;i++){box(.34,.02,.24,mat(0x2a2c30),-1.5+i,.79,h.cz);const s=textPlane(cnv(64,48,(g)=>{g.fillStyle="#1E3A5F";g.fillRect(0,0,64,48)}),.32,.2,-1.5+i,.9,h.cz-.12);s.rotation.x=-.3}
      pick("kl",4).forEach((o,i)=>pedestal(o,-5.4+(i%2)*2.2,h.z0-3.5-Math.floor(i/2)*3))})();

    /* — Красота: Большая галерея → супермаркет — */
    (function(){const h=H_.kr;const L=h.D;let krN=0;const pal=[0x6b8fb0,0xb06b4a,0xd2b84a,0x7a9b6a,0x9a6a9b,0x4a6a8a,0xc94a3a,0xe0d6c0];
      const sky=new T.Mesh(new T.PlaneGeometry(3,L*.55),new T.MeshBasicMaterial({color:0xF6F2E8}));sky.rotation.x=Math.PI/2;sky.position.set(0,h.H-.02,h.z0-L*.28);S.add(sky);
      const gold=mat(0x8F7032);
      for(let i=0;i<14;i++){const zz=h.z0-3-i*4.2;const t=(h.z0-zz)/L;
        if(t<.5){[-1,1].forEach(s=>{const ph=1.6+((i*3+s+5)%4)*.35;const c=painting(i*7907+s*31+11);const pp=pick_("kr",krN++);if(pp)imgOnto(c,pp.url);const fr=box(.08,ph+.24,(ph+.24)*1.33,gold,s*(HW-.06),2.6,zz);textPlane(c,ph*1.33,ph,s*(HW-.11),2.6,zz,s>0?-Math.PI/2:Math.PI/2,false);
            textPlane(plaqueCanvas(pp?pp.title:"Без названия · вид "+(i+1),"залы галереи"),.36,.14,s*(HW-.1),1.2,zz+(ph*.67+.3),s>0?-Math.PI/2:Math.PI/2)});
          if(i%2===0){box(1.6,.42,.5,mat(0x6E1C22),0,.21,zz,true);contact(0,zz,2,1)}}
        else{[-1,1].forEach(s=>{for(let k=0;k<5;k++){box(.7,.035,3.8,mat(0xC9CCCF),s*(HW-.45),.35+k*.5,zz);for(let j=0;j<7;j++){const hh=.18+((i+j+k)%3)*.08;box(.22,hh,.22,mat(pal[(i*3+j+k+(s>0?2:0))%8]),s*(HW-.45),.37+k*.5+hh/2,zz-1.6+j*.52)}}
            box(.06,2.8,3.9,mat(0xB9BCC0),s*(HW-.06),1.4,zz)});
          const strip=new T.Mesh(new T.BoxGeometry(.25,.04,3.6),new T.MeshBasicMaterial({color:0xF4F8FF}));strip.position.set(0,h.H-.6,zz);S.add(strip)}}
      const tz=h.z0-L*.52;const tl=new T.Mesh(new T.PlaneGeometry(HW*2,L*.5),mat(0xffffff,{map:tex("smtiles","",[4,L*.5/4])}));tl.rotation.x=-Math.PI/2;tl.position.set(0,.01,h.z1+L*.25);S.add(tl);
      textPlane(textCanvas("Из колонок — то, что он любил в девять лет","Всё сходится: ни одной сбитой ноты, ни одного места, где кассета жевала.",{w:1000,h:300,ts:44,bs:28,pad:36}),2,.6,0,3.4,tz);
      const cz=h.z1+5;box(1.8,1,.8,mat(0x55606A),2.6,.5,cz-1,true);box(1.8,.04,.8,mat(0x22262B),2.6,1.02,cz-1);
      pick("kr",6).forEach((o,i)=>pedestal(o,-2.2+(i%3)*1.6,cz+1.4+Math.floor(i/3)*1.6))})();

    /* ---------- управление ---------- */
    const P={x:opt.multi?+(Math.random()*2.4-1.2).toFixed(2):0,z:opt.multi?-1.2-Math.random()*1.6:-1.6,yaw:0,pitch:-.04};let target=null;const keys={};
    const r=.32;
    function canStand(x,zz){if(!walk.some(w=>x>=w[0]&&x<=w[1]&&zz>=w[2]&&zz<=w[3]))return false;return !blockers.some(b=>x>b[0]-r&&x<b[1]+r&&zz>b[2]-r&&zz<b[3]+r)}
    function moveBy(dx,dz){const nx=P.x+dx,nz=P.z+dz;if(canStand(nx,nz)){P.x=nx;P.z=nz;return true}if(canStand(nx,P.z)){P.x=nx;return true}if(canStand(P.x,nz)){P.z=nz;return true}return false}
    const kd=ev=>{if(ev.target.closest&&ev.target.closest("input,textarea"))return;const k=ev.key.toLowerCase();if(["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d","ц","ф","ы","в","shift"].includes(k)){keys[k]=true;if(document.activeElement===canvas)ev.preventDefault()}
      if((k==="e"||k==="у")&&nearObj)activate(nearObj)};
    const ku=ev=>{keys[ev.key.toLowerCase()]=false};
    window.addEventListener("keydown",kd);window.addEventListener("keyup",ku);
    let drag=null,moved=0;const ray=new T.Raycaster(),mv=new T.Vector2();
    canvas.addEventListener("pointerdown",ev=>{if(ev.pointerType==="touch"&&ev.target!==canvas)return;drag={x:ev.clientX,y:ev.clientY,id:ev.pointerId};moved=0;canvas.setPointerCapture(ev.pointerId);canvas.focus()});
    canvas.addEventListener("pointermove",ev=>{if(!drag||drag.id!==ev.pointerId)return;const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;moved+=Math.abs(dx)+Math.abs(dy);drag.x=ev.clientX;drag.y=ev.clientY;
      P.yaw-=dx*.0042;P.pitch=Math.max(-1.1,Math.min(1.1,P.pitch-dy*.0036))});
    canvas.addEventListener("pointerup",ev=>{if(!drag)return;const was=moved;drag=null;if(was>6)return;
      const rc=canvas.getBoundingClientRect();mv.set(((ev.clientX-rc.left)/rc.width)*2-1,-((ev.clientY-rc.top)/rc.height)*2+1);ray.setFromCamera(mv,cam);
      const hits=ray.intersectObjects(clickable,true);if(hits.length&&hits[0].distance<9){let o=hits[0].object;while(o&&!o.userData.id&&!o.userData.go)o=o.parent;if(o){activate(o);return}}
      const fh=ray.intersectObjects(floors,false)[0];if(fh&&fh.distance<30)target={x:fh.point.x,z:fh.point.z}});
    /* джойстик */
    let joy=null;stick.addEventListener("pointerdown",ev=>{ev.stopPropagation();joy={id:ev.pointerId,cx:stick.getBoundingClientRect().left+55,cy:stick.getBoundingClientRect().top+55,dx:0,dy:0};stick.setPointerCapture(ev.pointerId)});
    stick.addEventListener("pointermove",ev=>{if(!joy||joy.id!==ev.pointerId)return;let dx=ev.clientX-joy.cx,dy=ev.clientY-joy.cy;const d=Math.hypot(dx,dy),m=40;if(d>m){dx*=m/d;dy*=m/d}joy.dx=dx/m;joy.dy=dy/m;knob.style.transform=`translate(${dx}px,${dy}px)`});
    const jend=()=>{joy=null;knob.style.transform=""};stick.addEventListener("pointerup",jend);stick.addEventListener("pointercancel",jend);
    function activate(o){if(o.userData.go){if(window.__goMsgs)window.__goMsgs(o.userData.go);return}if(o.userData.id&&opt.onObj)opt.onObj(o.userData.id)}
    /* кнопки залов */
    bar.innerHTML=HALLZ.map((hz,i)=>`<button type="button" data-h="${i}">${opt.halls[hz.k]}</button>`).join("");
    bar.querySelectorAll("button").forEach(b=>b.onclick=()=>{const hz=HALLZ[+b.dataset.h];P.x=0;P.z=hz.z0-1.4;P.yaw=0;P.pitch=-.04;target=null;canvas.focus()});

    let nearObj=null,lastHall=-1,last=performance.now(),bob=0;
    /* другие посетители: фигура, имя, реплика */
    const AV={};
    function avatar(p){const g=new T.Group();const col=new T.Color(p.color);
      const body=new T.Mesh(new T.CylinderGeometry(.2,.26,1.25,14),new T.MeshStandardMaterial({color:col,roughness:.7}));body.position.y=.63;g.add(body);
      const head=new T.Mesh(new T.SphereGeometry(.17,16,12),new T.MeshStandardMaterial({color:0xE8DCCB,roughness:.8}));head.position.y=1.45;g.add(head);
      const nose=new T.Mesh(new T.BoxGeometry(.06,.06,.1),new T.MeshStandardMaterial({color:col}));nose.position.set(0,1.45,-.17);g.add(nose);
      const lab=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(textCanvas(p.name,"",{w:512,h:96,ts:44,pad:22,bg:"#141619",fg:"#E9EDF0",font:"Golos Text, sans-serif"})),depthTest:false}));lab.scale.set(.9,.17,1);lab.position.y=1.85;g.add(lab);
      g.userData={name:p.name,lab,say:"",bub:null};S.add(g);return g}
    function setSay(a,txt){if(a.userData.say===txt)return;a.userData.say=txt;if(a.userData.bub){a.remove(a.userData.bub);a.userData.bub=null}
      if(txt){const b=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(textCanvas("",txt.slice(0,90),{w:768,h:192,bs:38,pad:26,bg:"#FFFFFF",fg:"#16191D",font:"Golos Text, sans-serif"})),depthTest:false}));b.scale.set(1.5,.38,1);b.position.y=2.25;a.add(b);a.userData.bub=b}}
    function peersStep(dt,hi){const hz=HALLZ[hi];window.__curHall=opt.halls[hz.k]||"";opt.multi.tick(P,window.__curHall);
      const list=opt.multi.others(),seen=new Set();
      list.forEach(p=>{seen.add(p.id);let a=AV[p.id];if(!a){a=AV[p.id]=avatar(p);a.position.set(p.x,0,p.z)}
        if(a.userData.name!==p.name){a.userData.name=p.name;a.userData.lab.material.map=new T.CanvasTexture(textCanvas(p.name,"",{w:512,h:96,ts:44,pad:22,bg:"#141619",fg:"#E9EDF0",font:"Golos Text, sans-serif"}));a.userData.lab.material.needsUpdate=true}
        const k=Math.min(1,dt*8);a.position.x+=(p.x-a.position.x)*k;a.position.z+=(p.z-a.position.z)*k;let dy=p.yaw-a.rotation.y;while(dy>Math.PI)dy-=Math.PI*2;while(dy<-Math.PI)dy+=Math.PI*2;a.rotation.y+=dy*k;setSay(a,p.say)});
      Object.keys(AV).forEach(id=>{if(!seen.has(id)){S.remove(AV[id]);delete AV[id]}})}
    const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tmpV=new T.Vector3(),fwd=new T.Vector3();
    function frame(now){
      if(stopped)return;const dt=Math.min(.05,(now-last)/1000);last=now;
      const W=canvas.clientWidth,H=canvas.clientHeight;if(canvas.width!==Math.floor(W*R.getPixelRatio())||canvas.height!==Math.floor(H*R.getPixelRatio())){R.setSize(W,H,false);cam.aspect=W/H;cam.updateProjectionMatrix()}
      let f=0,s=0,turn=0;if(keys.w||keys.arrowup||keys["ц"])f+=1;if(keys.s||keys.arrowdown||keys["ы"])f-=1;if(keys.a||keys["ф"])s-=1;if(keys.d||keys["в"])s+=1;if(keys.arrowleft)turn+=1;if(keys.arrowright)turn-=1;
      if(joy){f-=joy.dy;P.yaw-=joy.dx*dt*1.8}
      P.yaw+=turn*dt*1.9;
      const sp=(keys.shift?4.4:2.5)*dt;
      if(f||s){target=null;const sin=Math.sin(P.yaw),cos=Math.cos(P.yaw);moveBy((-sin*f+cos*s)*sp,(-cos*f-sin*s)*sp);bob+=dt*9}
      else if(target){const dx=target.x-P.x,dz=target.z-P.z,d=Math.hypot(dx,dz);if(d<.15)target=null;else{const st=Math.min(d,sp);if(!moveBy(dx/d*st,dz/d*st))target=null;bob+=dt*9;const ty=Math.atan2(-dx,-dz);let dy=ty-P.yaw;while(dy>Math.PI)dy-=Math.PI*2;while(dy<-Math.PI)dy+=Math.PI*2;P.yaw+=dy*Math.min(1,dt*3)}}
      cam.position.set(P.x,1.62+(reduce?0:Math.sin(bob)*.025),P.z);cam.rotation.set(P.pitch,P.yaw,0);
      const hi=hallAt(P.z);if(hi!==lastHall){lastHall=hi;const hz=HALLZ[hi];whereEl.textContent=opt.halls[hz.k];whereSm.textContent=`ЗАЛ ${hi+1} ИЗ ${HALLZ.length}`;
        bar.querySelectorAll("button").forEach((b,i)=>b.setAttribute("aria-pressed",i===hi));
        lights.forEach((l,i)=>{l.color.setHex(hz.lc);l.intensity=hz.k==="sv"?.45:hz.k==="dv"?.85:.95;l.distance=hz.tall?26:16;l.position.set(i===1?0:(i?3.5:-3.5),hz.H-.6,hz.z0-hz.D*(i+1)/4)});
        hemi.intensity=hz.k==="sv"?.18:hz.k==="dv"?.34:hz.k==="pr"?.36:.6;amb.intensity=hz.k==="sv"?.08:hz.k==="dv"?.16:.18;
        S.fog.color.set(hz.k==="kr"||hz.k==="id"||hz.k==="n"?0xE9E6DE:0x0b0c0e);S.background.copy(S.fog.color)}
      if(HALLZ[hi].k==="kr"){const hz=HALLZ[hi];const t=(hz.z0-P.z)/hz.D;lights.forEach((l,i)=>{l.position.z=P.z-4-i*5;l.color.setHex(t>.5?0xF4F8FF:0xFFF0D8)})}
      /* стрелка идёт только под взглядом */
      if(clockHand){cam.getWorldDirection(fwd);tmpV.copy(clockPos).sub(cam.position);const d=tmpV.length();tmpV.normalize();if(fwd.dot(tmpV)>.93&&d<8)clockHand.rotation.z-=dt*Math.PI*2/60}
      if(leds.length&&Math.random()<.2)leds[Math.floor(Math.random()*leds.length)].visible=Math.random()>.3;
      anim.forEach(a=>a(now/1000));if(screens.length&&Math.floor(now/700)!==frame._s){frame._s=Math.floor(now/700);drawScreens(now/1000)}
      /* ближайший предмет */
      cam.getWorldDirection(fwd);let best=null,bd=2.6;clickable.forEach(o=>{o.getWorldPosition(tmpV);const d=Math.hypot(tmpV.x-P.x,tmpV.z-P.z);if(d<bd){const dir=tmpV.clone().sub(cam.position).normalize();if(dir.dot(fwd)>.55){bd=d;best=o}}});
      if(best!==nearObj){nearObj=best;if(best){nearEl.hidden=false;nearEl.textContent=(best.userData.label||"Предмет")+(best.userData.n?" · запись "+best.userData.n:"")+" — E или клик"}else nearEl.hidden=true}
      if(opt.multi)peersStep(dt,hi);
      R.render(S,cam);raf=requestAnimationFrame(frame);
    }
    raf=requestAnimationFrame(frame);
    stopFns.push(()=>{window.removeEventListener("keydown",kd);window.removeEventListener("keyup",ku)});
  }
  const stopFns=[];
  return function stop(){if(opt.multi)opt.multi.leave();stopped=true;cancelAnimationFrame(raf);stopFns.forEach(f=>f());try{if(R){R.dispose();R.forceContextLoss&&R.forceContextLoss()}}catch(e){}};
}
return {mount};
})();

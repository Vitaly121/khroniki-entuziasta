/* Музей всего дорогого: десять залов анфиладой; своя фигура, камера от третьего/первого лица. */
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
 {k:"pr",D:18,wall:"#E6E2DA",tex:"plaster",floor:"darkwood",ceil:"#EEECE7",lc:0xFFD08A,sub:"Кунсткамера: витрины с вещами, которые возвращаются"},
 {k:"id",D:18,wall:"#F3F3F1",tex:"plaster",floor:"concrete",ceil:"#F6F6F4",lc:0xFFFFFF,sub:"Белый куб: тезисы Viktor"},
 {k:"sv",D:14,wall:"#2A2224",tex:"plaster",floor:"stone",ceil:"#120F10",lc:0xC9A27A,sub:"Тёмный восьмиугольник. Одна вещь"},
 {k:"dv",D:18,wall:"#1C2628",tex:"plaster",floor:"concreteDark",ceil:"#0E1013",lc:0x8FB4FF,sub:"Медиазал: копии и журналы"},
 {k:"ot",D:16,wall:"#3B4838",tex:"paper2",floor:"parquet",ceil:"#E7E1D3",lc:0xFFDDAA,sub:"Дом-музей: стол, тетрадь, дверца"},
 {k:"se",D:16,wall:"#CDBBA4",tex:"paper3",floor:"planks",ceil:"#EFE9DF",lc:0xFFE4C0,sub:"Гостиная: август, сорок два, шестнадцать свечей"},
 {k:"n",D:18,wall:"#F4F4F2",tex:"plaster",floor:"concreteLight",ceil:"#F7F7F5",lc:0xFFFFFF,sub:"Выставка N: письма, кадры, каталог"},
 {k:"kl",D:16,wall:"#D2D8DE",tex:"plaster",floor:"tiles",ceil:"#E9EEF2",lc:0xE8F1FF,sub:"Научно-технический зал: прогнозы, рейтинг, станция"},
 {k:"kr",D:64,wall:"#6B2723",tex:"damask",floor:"parquet",ceil:"#EDE6D6",lc:0xFFF0D8,tall:true,sub:"Большая галерея, которая становится супермаркетом"}
];
const HW=8; /* полуширина зала */
/* ---------- воздух залов: свет, цвет, туман (этап 2) ----------
   sky/gnd/hi — полусферный свет, amb/ai — рассеянный, fog/fn/ff — туман, lc/li — лампы над экспонатами,
   lo — «запечённый» базовый свет поверхностей, pool — пятна под светильниками, r — радиус пятна,
   fw — вес потолочных светильников, em — самосвечение картин и текстов (читаемость), low — свет снизу (вечер) */
const AIR={
 kv:{sky:0xFFF0DA,gnd:0x7A6650,hi:.72,amb:0xFFE9D0,ai:.22,fog:0xE3D6C2,fn:9,ff:58,lc:0xFFE1B5,li:.75,em:.25,lo:[.68,.61,.52],pool:[.38,.3,.18],r:3.6},
 pr:{sky:0xFFFFFF,gnd:0x6E6A64,hi:.82,amb:0xF4F2EE,ai:.26,fog:0xE6E5E1,fn:10,ff:62,lc:0xFFF6EA,li:.8,em:.2,lo:[.84,.84,.83],pool:[.3,.3,.29],r:2.8},
 id:{sky:0xEEF5FF,gnd:0x7D8794,hi:.86,amb:0xE6EEF8,ai:.27,fog:0xDCE5EE,fn:10,ff:66,lc:0xE8F1FF,li:.75,em:.15,lo:[.72,.78,.88],pool:[.2,.23,.28],r:3.2},
 sv:{sky:0xC9A27A,gnd:0x1A1412,hi:.2,amb:0x6B5040,ai:.08,fog:0x16100D,fn:6,ff:26,lc:0xE8B98A,li:.55,em:.45,lo:[.17,.14,.13],pool:[.85,.6,.38],r:2.0},
 dv:{sky:0x9FE6D2,gnd:0x0A1413,hi:.34,amb:0x6FB8A8,ai:.12,fog:0x0D1B1A,fn:6,ff:30,lc:0x8FE6CC,li:.65,em:.4,lo:[.13,.22,.22],pool:[.12,.42,.36],r:2.6,fw:.4},
 ot:{sky:0xFFC27A,gnd:0x2A1A0E,hi:.42,amb:0xFFB070,ai:.13,fog:0x3A2614,fn:7,ff:34,lc:0xFFB466,li:.85,em:.35,lo:[.36,.25,.15],pool:[.72,.44,.18],r:3.0,fw:.45,low:1},
 se:{sky:0xFFE4C6,gnd:0x5C4636,hi:.62,amb:0xFFDCC0,ai:.2,fog:0xD2BCA4,fn:8,ff:48,lc:0xFFDDB4,li:.75,em:.3,lo:[.62,.52,.43],pool:[.42,.32,.2],r:3.2},
 n:{sky:0xFF4A30,gnd:0x100505,hi:.22,amb:0xFF3A20,ai:.06,fog:0x1C0806,fn:5,ff:24,lc:0xFF3A1E,li:.9,em:.55,lo:[.07,.04,.04],pool:[.85,.11,.07],r:4.2},
 kl:{sky:0xFFFFFF,gnd:0x8A7E7A,hi:.95,amb:0xFFF4F0,ai:.3,fog:0xF4ECE8,fn:12,ff:72,lc:0xFFF1EA,li:.85,em:.1,lo:[.9,.88,.88],pool:[.32,.3,.3],r:2.6},
 kr:{sky:0xFFFCF4,gnd:0x8C847A,hi:.92,amb:0xFFF8EE,ai:.28,fog:0xEFEBE3,fn:14,ff:95,lc:0xFFF2DE,li:.8,em:.22,lo:[.92,.85,.78],lo2:[.84,.89,.92],pool:[.26,.25,.24],r:3.4}
};
const ACC=0xE03A1E;

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
function plaqueCanvas(name,sub,seen,c){return drawPlaque(c||document.createElement("canvas"),name,sub,seen)}
function drawPlaque(c,name,sub,seen){c.width=512;c.height=200;const g=c.getContext("2d"),w=512,h=200;g.fillStyle="#F5F3EE";g.fillRect(0,0,w,h);g.strokeStyle="rgba(0,0,0,.2)";g.strokeRect(1,1,w-2,h-2);g.fillStyle="#1A1D21";g.font="500 30px Golos Text, sans-serif";
  const words=name.split(" ");let line="",y=52;words.forEach(wd=>{const t=line?line+" "+wd:wd;if(g.measureText(t).width>w-76){g.fillText(line,20,y);y+=36;line=wd}else line=t});g.fillText(line,20,y);
  g.fillStyle="#5E666E";g.font="20px JetBrains Mono, monospace";g.fillText(sub+(seen?" · вы видели":""),20,h-22);
  /* отметка «уже видели»: маленький кружок с галочкой в углу таблички */
  if(seen){g.fillStyle="#E03A1E";g.beginPath();g.arc(w-30,32,14,0,7);g.fill();g.strokeStyle="#FFFFFF";g.lineWidth=3.5;g.beginPath();g.moveTo(w-37,32);g.lineTo(w-32,38);g.lineTo(w-22,26);g.stroke()}
  return c}

/* ---------- стили для игрового управления (вставляются из museum.js: index.html у двух сборок разный) ---------- */
const STYLE_ID="museum-play-style";
const CSS=`.hallwrap .mz-pad{position:absolute;right:16px;bottom:66px;display:none;gap:12px;pointer-events:none}
.hallwrap .mz-pad button{pointer-events:auto;touch-action:none;width:64px;height:64px;min-width:48px;min-height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.28);background:rgba(12,14,16,.62);color:#EEF1F3;font:600 10.5px/1.15 system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
.hallwrap .mz-pad button b{font-size:20px;line-height:1;font-weight:600}
.hallwrap .mz-pad .mz-act[data-on="1"]{background:rgba(233,237,240,.92);color:#0E1013;border-color:#fff}
.hallwrap .mz-pad button:active{transform:scale(.94)}
.hallwrap.mz-tp .hud .cross{display:none}
@media (pointer:coarse){.hallwrap .mz-pad{display:flex}.hallwrap.mz .hud .near{bottom:186px;max-width:calc(100% - 32px)}}
@media (prefers-reduced-motion:reduce){.hallwrap .mz-pad button:active{transform:none}}
.hallwrap.mz .hud .where{top:calc(12px + var(--mz-top,0px));max-width:calc(100% - 290px)}
.hallwrap .mz-found{margin-top:4px;font:500 11px/1.3 var(--f-mono,monospace);letter-spacing:.02em;color:#E9EDF0}
.hallwrap .mz-found b{font-weight:600}
.hallwrap .mz-ctl{position:absolute;right:12px;bottom:54px;display:flex;gap:8px;align-items:center;pointer-events:none}
.hallwrap .mz-view{display:flex;gap:2px;padding:3px;pointer-events:auto;background:rgba(12,14,16,.74);border:1px solid rgba(255,255,255,.22);border-radius:999px}
.hallwrap .mz-view button{display:flex;align-items:center;gap:6px;min-height:34px;padding:0 13px;border:0;border-radius:999px;background:transparent;color:#DDE3E8;font:500 12.5px/1.1 var(--f-body,system-ui),sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}
.hallwrap .mz-view button[aria-pressed="true"]{background:#EEF1F3;color:#0E1013}
.hallwrap .mz-view svg{width:16px;height:16px;flex:none}
.hallwrap .mz-ls{display:none}
.hallwrap .mz-help{pointer-events:auto;width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.22);background:rgba(12,14,16,.74);color:#EEF1F3;font:600 15px/1 system-ui,sans-serif;cursor:pointer}
.hallwrap .mz-help[aria-expanded="true"]{background:#EEF1F3;color:#0E1013}
.hallwrap .mz-ctl button:focus-visible,.hallwrap .mz-map button:focus-visible{outline:2px solid #E03A1E;outline-offset:2px}
.hallwrap.mz .hud .keys{display:none;top:auto;right:12px;bottom:100px;padding:8px 12px;border-radius:8px;background:rgba(10,12,14,.78);color:#D5DBE0;text-shadow:none}
.hallwrap.mz.mz-keys .hud .keys{display:block}
.hallwrap .mz-title{position:absolute;left:50%;top:calc(22% + var(--mz-top,0px));transform:translateX(-50%);width:max-content;max-width:80%;text-align:center;color:#FFFFFF;opacity:0;transition:opacity .6s ease;pointer-events:none;text-shadow:0 2px 18px rgba(0,0,0,.6),0 0 2px rgba(0,0,0,.5)}
.hallwrap .mz-title.on{opacity:1}
.hallwrap .mz-title b{display:block;font:500 clamp(30px,4.4vw,52px)/1.1 var(--f-body,Georgia),serif}
.hallwrap .mz-title small{display:block;margin-top:8px;font:600 11.5px/1.3 var(--f-mono,monospace);letter-spacing:.1em;text-transform:uppercase}
.hallwrap .mz-map{position:absolute;right:12px;top:calc(12px + var(--mz-top,0px));pointer-events:auto;background:rgba(10,12,14,.76);border:1px solid rgba(255,255,255,.18);border-radius:8px;overflow:hidden;color:#E9EDF0}
.hallwrap .mz-map-t{display:flex;align-items:center;gap:6px;width:100%;min-height:26px;padding:4px 10px;border:0;background:transparent;color:inherit;font:600 11px/1 var(--f-mono,monospace);letter-spacing:.06em;cursor:pointer;text-align:left}
.hallwrap .mz-map-t i{font-style:normal;opacity:.7;margin-left:auto}
.hallwrap .mz-map canvas{display:block;width:232px;height:94px;cursor:pointer;touch-action:manipulation}
.hallwrap .mz-map[data-mz-open="0"] canvas{display:none}
@media (pointer:coarse){
.hallwrap.mz .hud .where{font-size:17px;max-width:calc(100% - 170px)}
.hallwrap .mz-fh,.hallwrap .mz-lf{display:none}
.hallwrap .mz-ls{display:inline}
.hallwrap .mz-ctl{bottom:auto;top:calc(10px + var(--mz-top,0px));right:10px}
.hallwrap .mz-view{border-radius:14px}
.hallwrap .mz-view button{flex-direction:column;justify-content:center;gap:2px;min-width:60px;min-height:46px;padding:4px 6px;border-radius:11px;font-size:10.5px}
.hallwrap .mz-help,.hallwrap.mz .hud .keys,.hallwrap.mz.mz-keys .hud .keys{display:none}
.hallwrap .mz-map{top:calc(74px + var(--mz-top,0px));right:10px}
.hallwrap .mz-map-t{min-height:44px;min-width:60px;justify-content:center}
.hallwrap .mz-map[data-mz-open="1"] .mz-map-t{justify-content:flex-start}
.hallwrap .mz-map canvas{width:200px}
.hallwrap .mz-title{top:calc(222px + var(--mz-top,0px))}
.hallwrap .mz-title b{font-size:26px}
.hallwrap .mz-title small{margin-top:5px;font-size:10.5px}}
@media (prefers-reduced-motion:reduce){.hallwrap .mz-title{transition:none}}
.hallwrap .mz-snd{pointer-events:auto;display:flex;align-items:center;gap:6px;min-height:36px;padding:0 12px;border-radius:999px;border:1px solid rgba(255,255,255,.22);background:rgba(12,14,16,.74);color:#EEF1F3;font:500 12.5px/1.1 var(--f-body,system-ui),sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}
.hallwrap .mz-snd svg{width:16px;height:16px;flex:none}
.hallwrap .mz-snd[aria-pressed="false"]{color:#9AA4AC;border-style:dashed}
.hallwrap .mz-snd:focus-visible,.hallwrap .mz-gmenu button:focus-visible{outline:2px solid #E03A1E;outline-offset:2px}
.hallwrap .mz-pad .mz-gst{position:absolute;right:6px;bottom:74px;width:52px;height:52px;font-size:10px}
.hallwrap .mz-pad .mz-gst[aria-expanded="true"]{background:rgba(233,237,240,.92);color:#0E1013;border-color:#fff}
.hallwrap .mz-pad .mz-act svg{width:20px;height:20px}
.hallwrap .mz-gmenu{position:absolute;right:16px;bottom:200px;display:none;gap:8px;pointer-events:auto}
.hallwrap .mz-gmenu[data-open="1"]{display:flex}
.hallwrap .mz-gmenu button{min-height:44px;min-width:104px;padding:0 16px;border-radius:999px;border:1px solid rgba(255,255,255,.32);background:rgba(12,14,16,.84);color:#EEF1F3;font:600 13px/1 system-ui,sans-serif;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}
.hallwrap.mz-gopen .hud .near{visibility:hidden}
@media (pointer:coarse){.hallwrap.mz .hud .where{max-width:calc(100% - 236px)}.hallwrap.mz .hud .near{bottom:200px}
.hallwrap .mz-snd{flex-direction:column;justify-content:center;gap:2px;min-width:50px;min-height:46px;padding:4px 6px;border-radius:14px;font-size:10.5px}}`;
let styleUsers=0;
function injectStyle(){styleUsers++;if(document.getElementById(STYLE_ID))return;const st=document.createElement("style");st.id=STYLE_ID;st.textContent=CSS;document.head.appendChild(st)}
function releaseStyle(){styleUsers=Math.max(0,styleUsers-1);if(!styleUsers){const st=document.getElementById(STYLE_ID);if(st)st.remove()}}
const angDiff=(a,b)=>{let d=b-a;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return d};

/* ---------- сборка ---------- */
function mount(host,opt){
  const T=window.THREE;
  host.innerHTML=`<div class="hallwrap"><canvas tabindex="0" aria-label="Музей: трёхмерные залы"></canvas><div class="hud"><div class="where"><small></small><span></span><div class="mz-found"></div></div><div class="mz-title" role="status" aria-live="polite"></div><div class="keys"><span class="mz-k0">клик — управлять мышью</span><br>WASD, ↑/↓ — идти · ←/→ — повернуть камеру<br>Shift — бег<br>пробел — прыжок · E — рассмотреть<br>лавки и низкие тумбы можно перепрыгнуть<br>V или колесо — вид от 1-го / 3-го лица<br>G — помахать · C — сесть / встать</div><div class="cross"></div><div class="near" hidden></div><div class="stick"><i></i></div><div class="mz-gmenu" data-open="0" role="group" aria-label="Жесты"><button type="button" data-g="wave">помахать</button><button type="button" data-g="sit">сесть</button></div><div class="mz-pad"><button type="button" class="mz-gst" aria-expanded="false" aria-label="Жесты: помахать или сесть"><b><svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M4.5 9V4.2a1 1 0 0 1 2 0V8M6.5 7.6V2.6a1 1 0 0 1 2 0v5M8.5 7.6V3.4a1 1 0 0 1 2 0V9M10.5 8.4V5.6a1 1 0 0 1 2 0v3.6c0 3-2 5.3-4.6 5.3-1.9 0-3-1-3.9-2.4L2.4 9.6a1 1 0 0 1 1.6-1.2L4.5 9" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg></b>жест</button><button type="button" class="mz-act" aria-label="Рассмотреть ближайший предмет"><b>◉</b>смотреть</button><button type="button" class="mz-jump" aria-label="Прыжок"><b>↑</b>прыжок</button></div><div class="mz-ctl"><div class="mz-view" role="group" aria-label="Вид камеры"><button type="button" data-v="tp" aria-pressed="true" aria-label="Вид из-за спины"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="10" cy="4" r="2.3" fill="currentColor"/><path d="M6.6 15v-4.3a3.4 3.4 0 0 1 6.8 0V15z" fill="currentColor"/><path d="M1.2 7.5l3 2.2-3 2.2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><span class="mz-lf">из-за спины</span><span class="mz-ls">сзади</span></button><button type="button" data-v="fp" aria-pressed="false" aria-label="Вид от первого лица"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 8s2.6-4.6 7-4.6S15 8 15 8s-2.6 4.6-7 4.6S1 8 1 8z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2.3" fill="currentColor"/></svg><span class="mz-lf">от первого лица</span><span class="mz-ls">глазами</span></button></div><button type="button" class="mz-snd" aria-pressed="true" aria-label="Звук"><svg viewBox="0 0 16 16" aria-hidden="true"></svg><span>звук</span></button><button type="button" class="mz-help" aria-expanded="false" aria-label="Подсказки по управлению">?</button></div><div class="mz-map" data-mz-open="1"><button type="button" class="mz-map-t" aria-expanded="true" aria-label="Карта залов: показать или скрыть">Карта<i aria-hidden="true">▾</i></button><canvas aria-label="Карта залов. Нажмите на зал, чтобы перейти в него" role="img"></canvas></div><div class="hallbar"></div></div>
    <div class="gate"><div><h3>Музей всего дорогого</h3><p>Десять залов анфиладой: от квартир, в которых неуютно, до галереи, которая становится супермаркетом. Предметы ведут в записи.</p><button class="start" type="button">Войти</button></div></div></div>`;
  const wrap=host.querySelector(".hallwrap"),canvas=wrap.querySelector("canvas"),gate=wrap.querySelector(".gate"),hud=wrap.querySelector(".hud");
  const whereEl=hud.querySelector(".where span"),whereSm=hud.querySelector(".where small"),nearEl=hud.querySelector(".near"),bar=hud.querySelector(".hallbar"),stick=hud.querySelector(".stick"),knob=stick.querySelector("i");
  let stopped=false,raf=0,R=null;
  const stopFns=[];
  /* слушатели регистрируются через on(), чтобы stop() снял их все */
  const on=(t,type,fn,o)=>{t.addEventListener(type,fn,o);stopFns.push(()=>t.removeEventListener(type,fn,o))};
  wrap.classList.add("mz","mz-tp");injectStyle();stopFns.push(releaseStyle);
  const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}},lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
  /* подсказки: внизу справа, сворачиваются кнопкой «?» (сверху их закрывала липкая шапка сайта) */
  const helpB=hud.querySelector(".mz-help");
  const setKeys=v=>{wrap.classList.toggle("mz-keys",v);helpB.setAttribute("aria-expanded",v)};
  setKeys(lsGet("cv2_mz_keys")!=="0");
  on(helpB,"click",()=>{const v=!wrap.classList.contains("mz-keys");setKeys(v);lsSet("cv2_mz_keys",v?"1":"0")});
  /* липкая шапка страницы: верхние элементы HUD опускаются ниже неё, когда страница прокручена к музею */
  let topQ=0;
  function updTop(){topQ=0;if(stopped)return;const rc=wrap.getBoundingClientRect();let hb=0;
    try{const x=Math.max(1,Math.min(innerWidth-2,rc.left+rc.width/2));document.elementsFromPoint(x,1).forEach(el=>{if(wrap.contains(el))return;for(let e=el;e&&e!==document.body&&e!==document.documentElement;e=e.parentElement){const ps=getComputedStyle(e).position;if(ps==="sticky"||ps==="fixed"){hb=Math.max(hb,e.getBoundingClientRect().bottom);break}}})}catch(e){}
    /* сдвиг ограничен, чтобы верхние элементы не наехали на нижние (джойстик, кнопки, полоса залов) */
    const room=rc.height-(matchMedia("(pointer:coarse)").matches?470:330);const off=Math.round(Math.max(0,Math.min(room,hb-rc.top)));if(off!==updTop.v){updTop.v=off;wrap.style.setProperty("--mz-top",off+"px")}}
  const qTop=()=>{if(!topQ)topQ=requestAnimationFrame(updTop)};
  on(document,"scroll",qTop,{passive:true,capture:true});on(window,"resize",qTop);stopFns.push(()=>cancelAnimationFrame(topQ));updTop();
  stopFns.push(()=>{[".mz-ctl",".mz-map",".mz-title",".mz-found",".mz-gmenu"].forEach(q=>{const e=hud.querySelector(q);if(e)e.remove()});wrap.classList.remove("mz-keys","mz-lite","mz-gopen");wrap.style.removeProperty("--mz-top")});
  const fail=(msg)=>{wrap.insertAdjacentHTML("beforeend",`<div class="hallmsg">${msg}</div>`)};

  /* ---------- этап 3: звук — только синтез Web Audio, без файлов. Контекст создаётся жестом пользователя,
     выключатель «звук» помнится в localStorage, при скрытой вкладке и уходе из музея — тишина ---------- */
  const snd=(function(){
    const AC=window.AudioContext||window.webkitAudioContext,LEVEL=.5;
    let ctx=null,master=null,amb=null,fxb=null,enabled=lsGet("cv2_mz_snd")!=="0",hid=document.hidden,gone=false,liteA=false,suspT=0,want=null,lastCue=-1e4;
    const beds={},NB={},stat={steps:0,lands:0,cues:0,events:0,bedsMade:0};
    /* постели залов: шумы и тоны на грани слышимости; x — слой, который облегчённый режим не включает */
    const AMB={
     kv:{l:[{n:"brown",ft:"lowpass",ff:380,g:.09},{o:"sine",f:100,g:.005,lfo:[.07,.003],x:1}]},
     pr:{l:[{n:"pink",ft:"lowpass",ff:900,g:.028},{n:"brown",ft:"lowpass",ff:200,g:.04,x:1}]},
     id:{l:[{n:"white",ft:"bandpass",ff:5200,q:.4,g:.012,lfo:[.09,.006]},{n:"pink",ft:"highpass",ff:1800,q:.5,g:.009,x:1}]},
     sv:{l:[{o:"sine",f:55,g:.02,lfo:[.045,.014]},{n:"brown",ft:"lowpass",ff:140,g:.025,x:1}]},
     dv:{l:[{o:"sawtooth",f:60,ft:"lowpass",ff:160,g:.02},{o:"sine",f:120,g:.007,lfo:[.13,.003]},{n:"pink",ft:"bandpass",ff:420,q:.8,g:.03,lfo:[.11,.008],x:1}]},
     ot:{l:[{o:"sine",f:49,g:.018,lfo:[.035,.012]},{n:"brown",ft:"lowpass",ff:260,g:.03,x:1}]},
     se:{l:[{n:"brown",ft:"lowpass",ff:520,g:.08},{n:"pink",ft:"bandpass",ff:900,q:.6,g:.012,lfo:[.05,.006],x:1}]},
     n:{l:[{n:"brown",ft:"lowpass",ff:180,g:.03},{o:"sine",f:100,g:.003,x:1}],ev:{k:"drip",a:2.6,b:6.5}},
     kl:{l:[{n:"pink",ft:"bandpass",ff:700,q:.5,g:.035,lfo:[.23,.02]},{n:"pink",ft:"bandpass",ff:2400,q:.7,g:.008,lfo:[.6,.005],x:1}],ev:{k:"click",a:.5,b:2.4,x:1}},
     kr:{l:[{n:"pink",ft:"lowpass",ff:1300,q:.6,g:.03,lfo:[.04,.01]},{o:"sine",f:100,g:.004,x:1}]}};
    function noiseBuf(kind){if(NB[kind])return NB[kind];const sr=ctx.sampleRate,n=sr*2,b=ctx.createBuffer(1,n,sr),d=b.getChannelData(0);let l=0,b0=0,b1=0,b2=0,pk=1e-6;
      for(let i=0;i<n;i++){const w=Math.random()*2-1;let v=w;if(kind==="brown"){l=(l+.02*w)/1.02;v=l}else if(kind==="pink"){b0=.99765*b0+w*.099;b1=.963*b1+w*.2965;b2=.57*b2+w*1.0526;v=b0+b1+b2+w*.1848}d[i]=v;if(Math.abs(v)>pk)pk=Math.abs(v)}
      /* петля без щелчка: конец плавно переходит в отрезок перед точкой петли */
      const f=Math.min(4000,n>>3);for(let i=0;i<n;i++)d[i]/=pk;for(let i=0;i<f;i++){const a=i/f;d[n-f+i]=d[n-f+i]*(1-a)+d[i]*a}b.__ls=f/sr;return NB[kind]=b}
    const kill=nodes=>nodes.forEach(nd=>{try{if(nd.stop)nd.stop()}catch(e){}try{nd.disconnect()}catch(e){}});
    function layer(bed,L){const g=ctx.createGain();g.gain.value=L.g;let src;
      if(L.n){src=ctx.createBufferSource();src.buffer=noiseBuf(L.n);src.loop=true;src.loopStart=src.buffer.__ls;src.loopEnd=src.buffer.duration;src.playbackRate.value=.94+Math.random()*.12}
      else{src=ctx.createOscillator();src.type=L.o;src.frequency.value=L.f}
      const nodes=[src,g];let node=src;if(L.ft){const fl=ctx.createBiquadFilter();fl.type=L.ft;fl.frequency.value=L.ff;fl.Q.value=L.q||.7;node.connect(fl);node=fl;nodes.push(fl)}
      node.connect(g);g.connect(bed.g);
      if(L.lfo){const lo=ctx.createOscillator(),ld=ctx.createGain();lo.frequency.value=L.lfo[0];ld.gain.value=L.lfo[1];lo.connect(ld);ld.connect(g.gain);lo.start();nodes.push(lo,ld)}
      if(L.n)src.start(ctx.currentTime,src.buffer.__ls+Math.random());else src.start();bed.layers.push({nodes,x:!!L.x})}
    function bed(k){if(beds[k])return beds[k];const D=AMB[k];if(!D)return null;const b={k,g:ctx.createGain(),layers:[],w:0,idle:0,evT:ctx.currentTime+1+Math.random()*2};
      b.g.gain.value=0;b.g.connect(amb);D.l.forEach(L=>{if(!(L.x&&liteA))layer(b,L)});stat.bedsMade++;return beds[k]=b}
    function freeBed(b){b.layers.forEach(L=>kill(L.nodes));try{b.g.disconnect()}catch(e){}delete beds[b.k]}
    /* короткие события: огибающая без резких атак */
    function env(g,t,a,peak,d){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.setTargetAtTime(0,t+a,d/3)}
    function burst(dest,t,o){const s=ctx.createBufferSource();s.buffer=noiseBuf(o.n||"white");s.playbackRate.value=o.rate||1;const fl=ctx.createBiquadFilter();fl.type=o.ft||"bandpass";fl.frequency.value=o.f||1000;fl.Q.value=o.q||.8;
      const g=ctx.createGain();s.connect(fl);fl.connect(g);g.connect(dest);const a=o.a||.004,d=o.d||.1;env(g,t,a,o.peak,d);s.start(t,Math.random()*1.5);s.stop(t+a+d*1.8);s.onended=()=>{try{g.disconnect();fl.disconnect()}catch(e){}}}
    function tone(dest,t,o){const os=ctx.createOscillator();os.type=o.type||"sine";os.frequency.setValueAtTime(o.f,t);const a=o.a||.01,d=o.d||.3;if(o.f2)os.frequency.exponentialRampToValueAtTime(o.f2,t+a+d*.5);
      const g=ctx.createGain();os.connect(g);g.connect(dest);env(g,t,a,o.peak,d);os.start(t);os.stop(t+a+d*1.8);os.onended=()=>{try{g.disconnect()}catch(e){}}}
    function evt(kind,dest){const t=ctx.currentTime+.02;stat.events++;
      if(kind==="drip")tone(dest,t,{f:1250+Math.random()*300,f2:620,peak:.03,a:.004,d:.14});
      else{burst(dest,t,{f:3200+Math.random()*900,q:1.5,peak:.012,d:.03});if(Math.random()<.5)burst(dest,t+.07+Math.random()*.06,{f:2900,q:1.5,peak:.009,d:.03})}}
    const running=()=>!!ctx&&ctx.state==="running";
    const live=()=>running()&&enabled&&!hid&&!gone;
    function ensure(){if(ctx||gone||!AC)return ctx;try{ctx=new AC()}catch(e){ctx=null;return null}
      master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);amb=ctx.createGain();amb.connect(master);fxb=ctx.createGain();fxb.gain.value=.9;fxb.connect(master);
      ctx.onstatechange=()=>{if(running()&&want)mix(want,0)};return ctx}
    function apply(){if(!ctx||ctx.state==="closed")return;const on_=enabled&&!hid&&!gone,t=ctx.currentTime;clearTimeout(suspT);
      master.gain.cancelScheduledValues(t);
      if(on_){master.gain.setValueAtTime(master.gain.value,t);if(ctx.state!=="running")ctx.resume().catch(()=>{});master.gain.setTargetAtTime(LEVEL,t,.35)}
      else if(hid){master.gain.value=0;master.gain.setValueAtTime(0,t);ctx.suspend().catch(()=>{})}
      else{master.gain.setValueAtTime(master.gain.value,t);master.gain.setTargetAtTime(0,t,.04);suspT=setTimeout(()=>{if(ctx&&ctx.state==="running"&&!(enabled&&!hid&&!gone))ctx.suspend().catch(()=>{})},220)}}
    /* жест пользователя (вход, клик, касание, клавиша): только здесь контекст создаётся и будится */
    function gesture(){if(gone||!enabled||hid)return;if(running()&&master.gain.value>0)return;if(!ensure())return;apply()}
    function mix(W,dt){want=W;if(!live())return;const t=ctx.currentTime;Object.keys(W).forEach(k=>{if(W[k]>.001)bed(k)});
      Object.values(beds).forEach(b=>{const w=W[b.k]||0;if(Math.abs(w-b.w)>.002){b.g.gain.setTargetAtTime(w,t,.6);b.w=w}
        if(!w&&b.g.gain.value<.003){b.idle+=dt;if(b.idle>3)freeBed(b)}else b.idle=0;
        const E=AMB[b.k].ev;if(E&&w>.05&&t>=b.evT){if(!(E.x&&liteA))evt(E.k,b.g);b.evT=t+E.a+Math.random()*(E.b-E.a)}})}
    /* шаги: тип пола задаёт окраску, бег — громче и короче; приземление — глухой удар */
    const SURF={planks:[700,.9],darkwood:[650,.9],parquet:[820,1],concrete:[1300,.8],concreteLight:[1300,.8],concreteDark:[1150,.8],stone:[1000,.9],tiles:[1700,.7],smtiles:[1800,.7]};
    function step(run,floor){if(!live())return;const t=ctx.currentTime+.005,sf=SURF[floor]||[900,.9],v=.9+Math.random()*.2;stat.steps++;
      burst(fxb,t,{f:sf[0]*v*(run?1.15:1),q:sf[1],peak:run?.11:.065,a:.003,d:run?.07:.1});tone(fxb,t,{f:(run?95:80)*v,peak:run?.055:.035,a:.004,d:.06})}
    function land(imp){if(!live())return;const t=ctx.currentTime+.005,k=Math.min(1,imp/5);stat.lands++;burst(fxb,t,{ft:"lowpass",f:260,q:.7,peak:.04+.14*k,a:.004,d:.2});tone(fxb,t,{f:62,f2:45,peak:.03+.1*k,a:.005,d:.18})}
    function cue(kind){if(!live())return;const t=ctx.currentTime+.01;stat.cues++;lastCue=performance.now();
      if(kind==="found"){tone(fxb,t,{f:784,peak:.035,a:.02,d:.7});tone(fxb,t+.11,{f:1175,peak:.024,a:.02,d:.8})}
      else{tone(fxb,t,{f:523,peak:.03,a:.03,d:.45});tone(fxb,t+.07,{f:659,peak:.026,a:.03,d:.5});tone(fxb,t,{type:"triangle",f:1046,peak:.005,a:.03,d:.3})}}
    function setLite(v){liteA=!!v;if(liteA)Object.values(beds).forEach(b=>{b.layers=b.layers.filter(L=>{if(L.x){kill(L.nodes);return false}return true})})}
    let btn=null;const ICON_ON='<path d="M2 6h2.6L8 3v10L4.6 10H2z" fill="currentColor"/><path d="M10.4 5.6a3.4 3.4 0 0 1 0 4.8M12.2 3.8a6 6 0 0 1 0 8.4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
      ICON_OFF='<path d="M2 6h2.6L8 3v10L4.6 10H2z" fill="currentColor"/><path d="M10.5 6l4 4M14.5 6l-4 4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>';
    function ui(){if(!btn)return;btn.setAttribute("aria-pressed",String(enabled));btn.setAttribute("aria-label",enabled?"Звук включён. Выключить":"Звук выключен. Включить");btn.title=enabled?"Звук: вкл":"Звук: выкл";btn.querySelector("svg").innerHTML=enabled?ICON_ON:ICON_OFF}
    function bind(b){btn=b;ui()}
    function setOn(v){enabled=!!v;lsSet("cv2_mz_snd",enabled?"1":"0");if(enabled)gesture();else apply();ui()}
    function vis(h){hid=!!h;apply()}
    /* уход из музея: постели гаснут сразу; если только что прозвучал сигнал (открытие чата) — контекст закрывается после него */
    function close(){if(gone)return;gone=true;clearTimeout(suspT);if(!ctx)return;const c=ctx;try{amb.gain.setTargetAtTime(0,c.currentTime,.02)}catch(e){}
      const fin=()=>{try{c.close().catch(()=>{})}catch(e){}};const left=750-(performance.now()-lastCue);if(left>0&&c.state==="running")setTimeout(fin,left);else fin()}
    const dbg=()=>({exists:!!ctx,state:ctx?ctx.state:"none",on:enabled,hidden:hid,gone,lite:liteA,master:master?+master.gain.value.toFixed(4):0,
      beds:Object.fromEntries(Object.values(beds).map(b=>[b.k,+b.g.gain.value.toFixed(4)])),layers:Object.values(beds).reduce((a,b)=>a+b.layers.length,0),...stat,_ctx:ctx,_master:master});
    return {gesture,mix,step,land,cue,setLite,setOn,vis,close,bind,dbg,get on(){return enabled}};
  })();
  stopFns.push(()=>snd.close());
  snd.bind(hud.querySelector(".mz-snd"));
  on(hud.querySelector(".mz-snd"),"click",()=>snd.setOn(!snd.on));
  on(wrap,"pointerdown",()=>snd.gesture(),{capture:true});
  on(document,"visibilitychange",()=>snd.vis(document.hidden));

  let started=false;
  gate.querySelector("button").onclick=()=>{gate.remove();started=true;snd.gesture();canvas.focus();boot()};
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
    const tex=(name,base,rep)=>{const key=name+base+rep;if(texCache[key])return texCache[key];const c=TEX[name](base);const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;if(rep)t.repeat.set(rep[0],rep[1]);t.anisotropy=4;t.__avg=null;t.__cb=[];const u=opt.texUrl&&opt.texUrl(name);
      if(u){const im=new Image();im.onload=()=>{if(stopped)return;t.image=im;t.needsUpdate=true;
        /* средний цвет фотографической текстуры: по нему стена получает задуманный цвет зала */
        try{const d=cnv(16,16,g=>g.drawImage(im,0,0,16,16)).getContext("2d").getImageData(0,0,16,16).data;let a=[0,0,0];for(let i=0;i<d.length;i+=4){a[0]+=d[i];a[1]+=d[i+1];a[2]+=d[i+2]}t.__avg=a.map(v=>v/256);t.__cb.forEach(f=>f())}catch(e){}};im.src=u}return texCache[key]=t};
    /* поверхности залов: несветящийся материал + «запечённый» свет в цветах вершин (без карт теней и лишних ламп) */
    const bmat=o=>new T.MeshBasicMaterial(Object.assign({vertexColors:true},o));
    const tintMat=(m,t,hex)=>{const want=new T.Color(hex);const ap=()=>{const a=t.__avg;if(!a){m.color.setRGB(1,1,1);return}const f=(w,v)=>Math.max(.2,Math.min(1.6,w*255/Math.max(8,v)));m.color.setRGB(f(want.r,a[0]),f(want.g,a[1]),f(want.b,a[2]))};ap();t.__cb.push(ap);return m};
    const sg=n=>Math.max(1,Math.ceil(n/2.4)),surf=[],contacts=[];
    /* найденные предметы: общий список сайта (cv2_found, его ведёт app.js при открытии предмета) + свой ключ музея */
    const OBJ_IDS=new Set(opt.objs.map(o=>o.id)),OBJ_H=Object.fromEntries(opt.objs.map(o=>[o.id,o.h])),TOT={};opt.objs.forEach(o=>TOT[o.h]=(TOT[o.h]||0)+1);
    const readIds=k=>{try{const v=JSON.parse(localStorage.getItem(k)||"[]");return Array.isArray(v)?v:[]}catch(e){return []}};
    const foundS=new Set([...readIds("cv2_found"),...readIds("cv2_mz_found")].filter(id=>OBJ_IDS.has(id)));
    const plaques={};
    const mat=(c,o={})=>new T.MeshLambertMaterial(Object.assign({color:c},o));
    const clickable=[],floors=[],blockers=[],walk=[],anim=[];
    const add=(m,x,y,z)=>{m.position.set(x,y,z);S.add(m);return m};
    const camBlock=[];/* то, сквозь что камера третьего лица не проходит */
    /* этап 4: у препятствия есть верх. Низкое (лавка, коробка, низкая тумба — верх до LOW_TOP) можно перепрыгнуть
       и стоять на нём; всё выше — витрины, столы, шкафы, стены, двойники — держит на любой высоте (верх = ∞) */
    const LOW_TOP=.7,topOf=t=>t<=LOW_TOP?+t.toFixed(3):Infinity;
    const block=(x0,x1,z0,z1,top)=>{blockers.push([x0,x1,z0,z1,topOf(top==null?Infinity:top)])};
    const box=(w,h,d,m,x,y,z,blk)=>{const me=add(new T.Mesh(new T.BoxGeometry(w,h,d),m),x,y,z);if(blk){block(x-w/2,x+w/2,z-d/2,z+d/2,y+h/2);if(h>1.2)camBlock.push(me)}return me};
    const cyl=(r1,r2,h,m,x,y,z,seg=24)=>add(new T.Mesh(new T.CylinderGeometry(r1,r2,h,seg),m),x,y,z);
    const shadowTex=new T.CanvasTexture(cnv(128,128,(g)=>{const gr=g.createRadialGradient(64,64,4,64,64,62);gr.addColorStop(0,"rgba(0,0,0,.55)");gr.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=gr;g.fillRect(0,0,128,128)}));
    const contact=(x,z,w,d)=>{const p=new T.Mesh(new T.PlaneGeometry(w,d),new T.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false}));p.rotation.x=-Math.PI/2;p.position.set(x,.012,z);S.add(p);contacts.push(p)};
    const imgOnto=(c,url)=>{if(!url)return;const im=new Image();im.onload=()=>{const g=c.getContext("2d"),W=c.width,H=c.height,s=Math.max(W/im.width,H/im.height),w=im.width*s,h=im.height*s;g.drawImage(im,(W-w)/2,(H-h)/2,w,h);if(c.__tex)c.__tex.needsUpdate=true};im.src=url};
    const PAINT=opt.paint||{};const pick_=(k,i)=>{const a=PAINT[k]||[];return a.length?a[i%a.length]:null};
/* картины и тексты под светом зала получают немного самосвечения: в тёмных залах они остаются читаемыми */
const textPlane=(c,w,h,x,y,z,ry=0,basic=true)=>{const t=new T.CanvasTexture(c);c.__tex=t;const m=new T.Mesh(new T.PlaneGeometry(w,h),basic?new T.MeshBasicMaterial({map:t}):new T.MeshLambertMaterial({map:t,emissive:0xffffff,emissiveMap:t,emissiveIntensity:AIR[HALLZ[hallAt(z)].k].em}));m.position.set(x,y,z);m.rotation.y=ry;S.add(m);return m};

    /* залы */
    let z=0;const HALLZ=[];
    SPEC.forEach((s,i)=>{
      const z0=z,z1=z-s.D,H=s.tall?8.5:(s.k==="pr"||s.k==="sv"||s.k==="dv"?4.6:4.2),A=AIR[s.k];HALLZ.push({...s,z0,z1,H,cz:(z0+z1)/2,pools:[]});
      const fl=new T.Mesh(new T.PlaneGeometry(HW*2,s.D,sg(HW*2),sg(s.D)),bmat({map:tex(s.floor,"",[HW/2,s.D/4])}));fl.rotation.x=-Math.PI/2;fl.position.set(0,0,(z0+z1)/2);S.add(fl);floors.push(fl);surf.push(fl);
      const ce=new T.Mesh(new T.PlaneGeometry(HW*2,s.D,sg(HW*2),sg(s.D)),bmat({color:new T.Color(s.ceil)}));surf.push(ce);
      /* светильники на потолке: светящиеся панели + пятна света под ними */
      if(!s.tall&&s.k!=="sv"){const wide=s.k==="kl"||s.k==="id"||s.k==="n";const fx=new T.MeshBasicMaterial({color:s.k==="dv"?0x7FE0C8:s.k==="n"?0x2A1614:s.k==="ot"?0xFFCB8E:wide?0xF7FAFF:0xFFF1D6}),fxR=new T.MeshBasicMaterial({color:0xFF5A3C});
        for(let q=0;q<Math.floor(s.D/5);q++)[-3.5,3.5].forEach((xx,j)=>{const red=s.k==="kl"&&(q+j)%2===0;const f=new T.Mesh(new T.PlaneGeometry(wide?2.2:.7,wide?.35:.7),red?fxR:fx);f.rotation.x=Math.PI/2;f.position.set(xx,H-.01,z0-2.5-q*5);S.add(f);
          if(s.k!=="n")HALLZ[i].pools.push({x:xx,z:z0-2.5-q*5,r:A.r,w:A.fw||1,c:red?[.85,.16,.08]:null,lc:red?0xFF8A70:null})})}
      ce.rotation.x=Math.PI/2;ce.position.set(0,H,(z0+z1)/2);S.add(ce);
      const wm=bmat({map:tex(s.tex,s.wall,[s.D/3,H/3])});tintMat(wm,wm.map,s.wall);
      const wl=new T.Mesh(new T.PlaneGeometry(s.D,H,sg(s.D),Math.max(4,sg(H))),wm);wl.rotation.y=Math.PI/2;wl.position.set(-HW,H/2,(z0+z1)/2);S.add(wl);
      const wr=new T.Mesh(new T.PlaneGeometry(s.D,H,sg(s.D),Math.max(4,sg(H))),wm);wr.rotation.y=-Math.PI/2;wr.position.set(HW,H/2,(z0+z1)/2);S.add(wr);camBlock.push(wl,wr);surf.push(wl,wr);
      const base=mat(0x1d1a17);box(.04,.16,s.D,base,-HW+.02,.08,(z0+z1)/2);box(.04,.16,s.D,base,HW-.02,.08,(z0+z1)/2);
      /* перегородка в конце зала с проёмом */
      const pm=bmat({map:tex(s.tex,s.wall,[2,H/3])});tintMat(pm,pm.map,s.wall);const endFull=i===SPEC.length-1;
      if(endFull){const e=new T.Mesh(new T.PlaneGeometry(HW*2,H,sg(HW*2),Math.max(4,sg(H))),pm);e.position.set(0,H/2,z1);S.add(e);camBlock.push(e);surf.push(e)}
      else{const nH=Math.max(H,HALLZ[i]?H:H);[-1,1].forEach(sgn=>{const w=HW-1.5;const p=new T.Mesh(new T.BoxGeometry(w,nH,.3,sg(w),Math.max(4,sg(nH)),1),pm);p.position.set(sgn*(1.5+w/2),nH/2,z1);S.add(p);camBlock.push(p);surf.push(p)});
        const lint=new T.Mesh(new T.BoxGeometry(3,nH-3,.3,2,2,1),pm);lint.position.set(0,3+(nH-3)/2,z1);S.add(lint);camBlock.push(lint);surf.push(lint);
        const fr=mat(0x2a241f);box(.12,3,.36,fr,-1.5,1.5,z1);box(.12,3,.36,fr,1.5,1.5,z1);box(3.2,.12,.36,fr,0,3,z1);
        /* табличка следующего зала */
        textPlane(textCanvas(opt.halls[SPEC[i+1].k],"",{w:512,h:96,ts:40,pad:24,bg:"#141619",fg:"#E9EDF0",font:"Golos Text, sans-serif"}),1.6,.3,0,3.35,z1+.16)}
      if(i===0){const e=new T.Mesh(new T.PlaneGeometry(HW*2,H,sg(HW*2),Math.max(4,sg(H))),pm);e.rotation.y=Math.PI;e.position.set(0,H/2,z0);S.add(e);camBlock.push(e);surf.push(e)}
      walk.push([-HW+.45,HW-.45,z1+.45,z0-.45]);if(!endFull)walk.push([-1.1,1.1,z1-.6,z1+.6]);
      /* название зала на стене у входа */
      textPlane(textCanvas(opt.halls[s.k],s.sub,{w:1024,h:300,ts:64,bs:30,pad:40,bg:/^(sv|dv|ot|n|kr)$/.test(s.k)?"#141619":"#FFFFFF",fg:/^(sv|dv|ot|n|kr)$/.test(s.k)?"#E9EDF0":"#16191D",fg2:"#8A939B"}),2.4,.7,-HW+.02,2.3,z0-2.2,Math.PI/2);
      z=z1;
    });
    const hallAt=zz=>{for(let i=0;i<HALLZ.length;i++)if(zz<=HALLZ[i].z0+.1&&zz>=HALLZ[i].z1-.1)return i;return zz>0?0:HALLZ.length-1};
    const HK=k=>HALLZ.find(h=>h.k===k);
    /* особые источники: святилище — одно пятно; двойники — свечение экранов; отец — вечерний свет из окна; N — красный фонарь и лайтбокс; красота — свет по оси */
    (function(){let h=HK("sv");h.pools.push({x:0,z:h.cz,r:2.2,w:1.3});
      h=HK("dv");[[-HW+.6,h.z0-5],[HW-.6,h.z0-5],[-HW+.6,h.z0-12]].forEach(([x,zz])=>h.pools.push({x,z:zz,r:2.8,w:1}));h.pools.push({x:4.4,z:h.z1+.8,r:2.2,w:.6,c:[.25,.32,.5],lc:0x8FB4FF});
      h=HK("ot");h.pools.push({x:4.6,z:h.z1+1.2,r:3.8,w:1.25},{x:0,z:h.z0-6,r:1.7,w:.7});
      h=HK("n");h.pools.push({x:0,z:h.cz,r:4.2,w:1},{x:HW-.6,z:h.cz,r:2.3,w:1,c:[.42,.4,.36],lc:0xEDE8DC});
      box(.46,.14,.26,new T.MeshBasicMaterial({color:0xFF2A12}),0,h.H-.55,h.cz);cyl(.006,.006,.48,mat(0x111111),0,h.H-.24,h.cz,6);
      h=HK("kr");for(let q=0;q<13;q++)h.pools.push({x:0,z:h.z0-2.5-q*5,r:4.2,w:1});
      HALLZ.forEach(hh=>{if(!hh.pools.length)hh.pools.push({x:0,z:hh.cz,r:4,w:.8})})})();
    const ss=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
    /* свет в точке поверхности: база зала + пятна от источников; пол темнеет к стенам, стены — к полу (или, в «Отце», к потолку) */
    function lightAt(h,x,y,zz,kind,o){const A=AIR[h.k];let lo=A.lo;if(A.lo2){const t=ss(.42,.6,(h.z0-zz)/h.D);lo=[0,1,2].map(c=>A.lo[c]+(A.lo2[c]-A.lo[c])*t)}
      let a0=0,a1=0,a2=0;h.pools.forEach(p=>{const d=Math.hypot(x-p.x,zz-p.z)/(kind===2?p.r*.55:p.r),w=p.w*Math.exp(-d*d),c=p.c||A.pool;a0+=c[0]*w;a1+=c[1]*w;a2+=c[2]*w});
      let f,k;if(kind===0){f=.8+.2*ss(0,1.4,HW-Math.abs(x));k=1}else if(kind===2){f=.92;k=.55}
      else{const yn=Math.max(0,Math.min(1,y/h.H));f=A.low?1.1-.42*ss(.05,.9,yn):.8+.3*ss(0,.55,yn)-.1*ss(.82,1,yn);k=.7}
      o[0]=Math.min(1.6,(lo[0]+a0*k)*f);o[1]=Math.min(1.6,(lo[1]+a1*k)*f);o[2]=Math.min(1.6,(lo[2]+a2*k)*f)}
    function bake(mesh){mesh.updateMatrixWorld(true);const g=mesh.geometry,pos=g.attributes.position,nor=g.attributes.normal,n=pos.count,col=new Float32Array(n*3),nm=new T.Matrix3().getNormalMatrix(mesh.matrixWorld),v=new T.Vector3(),nv=new T.Vector3(),o=[0,0,0];
      for(let i=0;i<n;i++){v.fromBufferAttribute(pos,i).applyMatrix4(mesh.matrixWorld);nv.fromBufferAttribute(nor,i).applyMatrix3(nm).normalize();const h=HALLZ[hallAt(v.z+nv.z*.4)];lightAt(h,v.x,v.y,v.z,nv.y>.7?0:nv.y<-.7?2:1,o);col[i*3]=o[0];col[i*3+1]=o[1];col[i*3+2]=o[2]}
      g.setAttribute("color",new T.BufferAttribute(col,3))}

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
      const pq={name:o.name.length>46?o.name.slice(0,44)+"…":o.name,sub:"запись "+o.n};pq.c=plaqueCanvas(pq.name,pq.sub,foundS.has(o.id));pq.t=new T.CanvasTexture(pq.c);plaques[o.id]=pq;
      const pl=new T.Mesh(new T.PlaneGeometry(.36,.14),new T.MeshBasicMaterial({map:pq.t}));pl.position.set(0,.84,.301);pl.rotation.x=-.25;grp.add(pl);
      grp.traverse(m=>{m.userData.id=o.id});S.add(grp);clickable.push(grp);block(x-.42,x+.42,zz-.42,zz+.42);contact(x,zz,1.1,1.1);
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
      box(2,.45,1.4,mat(0x7F8A94),4.9,.22,rz-1.2,true);box(1.9,.1,1.3,mat(0x8F7C9B),4.9,.5,rz-1.2,true);
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
      box(2.6,.45,.9,fab,0,.22,h.cz-2.2,true);box(2.6,.55,.2,fab,0,.6,h.cz-2.6,true);box(.2,.6,.9,fab,-1.3,.3,h.cz-2.2,true);box(.2,.6,.9,fab,1.3,.3,h.cz-2.2,true);
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
      const tz=h.z0-L*.52;const tl=new T.Mesh(new T.PlaneGeometry(HW*2,L*.5,sg(HW*2),sg(L*.5)),bmat({map:tex("smtiles","",[4,L*.5/4])}));tl.rotation.x=-Math.PI/2;tl.position.set(0,.01,h.z1+L*.25);S.add(tl);surf.push(tl);
      textPlane(textCanvas("Из колонок — то, что он любил в девять лет","Всё сходится: ни одной сбитой ноты, ни одного места, где кассета жевала.",{w:1000,h:300,ts:44,bs:28,pad:36}),2,.6,0,3.4,tz);
      const cz=h.z1+5;box(1.8,1,.8,mat(0x55606A),2.6,.5,cz-1,true);box(1.8,.04,.8,mat(0x22262B),2.6,1.02,cz-1);
      pick("kr",6).forEach((o,i)=>pedestal(o,-2.2+(i%3)*1.6,cz+1.4+Math.floor(i/3)*1.6))})();

    surf.forEach(bake);

    /* ---------- фигура посетителя: коробочный человечек со своей кепкой и бейджем ---------- */
    const FG={head:new T.BoxGeometry(.34,.32,.32),eye:new T.BoxGeometry(.05,.065,.02),cap:new T.BoxGeometry(.37,.08,.35),brim:new T.BoxGeometry(.24,.03,.13),
      torso:new T.BoxGeometry(.46,.54,.26),badge:new T.BoxGeometry(.1,.07,.012),arm:new T.BoxGeometry(.13,.46,.14),hand:new T.BoxGeometry(.12,.1,.12),
      leg:new T.BoxGeometry(.17,.58,.19),shoe:new T.BoxGeometry(.18,.08,.25),blob:new T.PlaneGeometry(.9,.9)};
    const FM={skin:mat(0xE6D2BA),pants:mat(0x2F3438),shoe:mat(0x1B1D20),eye:new T.MeshBasicMaterial({color:0x1A1A1C}),badge:new T.MeshBasicMaterial({color:0xF4F1EA}),
      blob:new T.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false})};
    function figure(color){
      const col=new T.Color(color),cm=mat(col),capm=mat(col.clone().offsetHSL(0,.05,-.16));
      const g=new T.Group(),body=new T.Group();g.add(body);
      const m=(geo,mm,x,y,z,par)=>{const me=new T.Mesh(geo,mm);me.position.set(x,y,z);(par||body).add(me);return me};
      const torso=m(FG.torso,cm,0,.9,0);m(FG.badge,FM.badge,.11,.08,-.136,torso);
      const head=new T.Group();head.position.set(0,1.18,0);body.add(head);
      m(FG.head,FM.skin,0,.17,0,head);m(FG.eye,FM.eye,-.08,.19,-.166,head);m(FG.eye,FM.eye,.08,.19,-.166,head);
      m(FG.cap,capm,0,.36,0,head);m(FG.brim,capm,0,.335,-.22,head);
      const limb=(x,y,geo,mm,ext,extm,ey,ez)=>{const pv=new T.Group();pv.position.set(x,y,0);body.add(pv);m(geo,mm,0,-geo.parameters.height/2,0,pv);m(ext,extm,0,ey,ez,pv);return pv};
      const armL=limb(-.3,1.13,FG.arm,cm,FG.hand,FM.skin,-.5,0),armR=limb(.3,1.13,FG.arm,cm,FG.hand,FM.skin,-.5,0);
      const legL=limb(-.11,.62,FG.leg,FM.pants,FG.shoe,FM.shoe,-.58,-.03),legR=limb(.11,.62,FG.leg,FM.pants,FG.shoe,FM.shoe,-.58,-.03);
      const blob=new T.Mesh(FG.blob,FM.blob);blob.rotation.x=-Math.PI/2;blob.position.y=.013;g.add(blob);
      g.userData.fig={body,head,armL,armR,legL,legR,blob,ph:0,sw:0,air:0,mats:[cm,capm]};return g}
    /* анимация: размах рук и ног от скорости, стойка на месте, поза прыжка */
    function animFig(g,dt,speed,air,t){const f=g.userData.fig,k=1-Math.exp(-dt*14);
      f.ph+=dt*speed*3.3;const amp=(reduce?.25:.62)*Math.min(1.35,speed/2.6);f.sw+=(amp-f.sw)*k;f.air+=((air?1:0)-f.air)*k;
      const s=Math.sin(f.ph)*f.sw,a=f.air*(reduce?.4:1);
      f.legL.rotation.x=s*(1-a)+.55*a;f.legR.rotation.x=-s*(1-a)-.25*a;
      f.armL.rotation.x=-s*.9*(1-a)+2.5*a;f.armR.rotation.x=s*.9*(1-a)+2.5*a;f.armL.rotation.z=-.06-.25*a;f.armR.rotation.z=.06+.25*a;
      f.body.rotation.x=-.12*Math.min(1,speed/5)*(reduce?0:1);
      f.body.position.y=(!reduce&&speed<.15&&!air)?Math.sin(t*2.1)*.008:0;f.head.rotation.y=0}
    /* жесты поверх ходьбы (этап 3): «сесть» — на пол, ноги вперёд, руки на коленях; «помахать» — правая рука над головой */
    function poseFig(g,dt,ge,t){const f=g.userData.fig,k=1-Math.exp(-dt*9),Lr=(a,b,x)=>a+(b-a)*x;
      f.gs=(f.gs||0)+((ge==="sit"?1:0)-(f.gs||0))*k;f.gw=(f.gw||0)+((ge==="wave"?1:0)-(f.gw||0))*k;
      if(f.gs<.002)f.gs=0;if(f.gw<.002)f.gw=0;const s=f.gs,w=f.gw;f.head.rotation.z=.09*w;if(!s&&!w)return;
      if(s){f.body.position.y=Lr(f.body.position.y,-.5,s);f.body.rotation.x=Lr(f.body.rotation.x,.1,s);
        f.legL.rotation.x=Lr(f.legL.rotation.x,1.45,s);f.legR.rotation.x=Lr(f.legR.rotation.x,1.45,s);
        f.armL.rotation.x=Lr(f.armL.rotation.x,.6,s);f.armR.rotation.x=Lr(f.armR.rotation.x,.6,s)}
      if(w){f.armR.rotation.x=Lr(f.armR.rotation.x,0,w);f.armR.rotation.z=Lr(f.armR.rotation.z,2.65+Math.sin(t*9)*(reduce?.1:.32),w)}}

    /* ---------- управление: персонаж, камера, ввод ---------- */
    const coarse=matchMedia("(pointer:coarse)"),reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* P уходит в multi.tick: x, z, yaw (yaw — куда смотрит фигура); y — высота прыжка, только локально */
    const P={x:opt.multi?+(Math.random()*2.4-1.2).toFixed(2):0,z:opt.multi?-1.6-Math.random()*1.2:-2.2,yaw:0,y:0};
    const TP_DIST=coarse.matches?3.8:3.2,MAX_DIST=5.5,PITCH_TP=[-.8,.5],PITCH_FP=[-1.1,1.1];
    const C={yaw:0,pitch:-.26,want:TP_DIST,last:TP_DIST,cur:TP_DIST,d:TP_DIST};
    const V={x:0,z:0,vy:0,ground:true,gy:0};const WALK=2.6,RUN=5.2;
    /* вертикаль (этап 4): прыжок с вершиной ≈0,75 м (точное интегрирование — высота не зависит от частоты кадров),
       ступенька без прыжка до 0,22 м, в воздухе — подхват края до 0,12 м; голова не выше потолка */
    const GRAV=13,JUMP_V=4.4,STEP=.22,AIR_STEP=.12,HEAD=1.75;
    let target=null,jumpQ=false,lastLook=0,plFail=0,plTry=0,bob=0;const keys={};
    const r=.32;
    const inWalk=(x,zz)=>walk.some(w=>x>=w[0]&&x<=w[1]&&zz>=w[2]&&zz<=w[3]);
    const over=(b,x,zz)=>x>b[0]-r&&x<b[1]+r&&zz>b[2]-r&&zz<b[3]+r;
    /* можно ли стоять в (x,z), если ступни на высоте y: всё, что под квадратом фигуры, должно быть не выше y+step */
    function canStand(x,zz,y,step){if(!inWalk(x,zz))return false;const lim=(y||0)+(step==null?STEP:step);for(let i=0;i<blockers.length;i++){const b=blockers[i];if(b[4]>lim&&over(b,x,zz))return false}return true}
    /* опора под фигурой: самый высокий верх среди препятствий под её квадратом (не выше y+step), иначе пол */
    function groundAt(x,zz,y,step){const lim=(y||0)+(step==null?STEP:step);let g=0;for(let i=0;i<blockers.length;i++){const b=blockers[i];if(b[4]<=lim&&b[4]>g&&over(b,x,zz))g=b[4]}return g}
    /* шаг со скольжением вдоль стен: на земле заблокированная ось гасит свою скорость; в воздухе скорость остаётся,
       чтобы прыжок у самой лавки всё равно на неё вынес. Длинный шаг режется на части — сквозь тонкое не проскочить */
    function moveBy(dx,dz){const st=V.ground?STEP:AIR_STEP,n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.12));let ok=false;
      /* если фигура уже оказалась внутри (телепорт, чужая правка), выпускаем её в любую сторону в пределах зала */
      const ok_=(x,zz)=>canStand(x,zz,P.y,st)||(!canStand(P.x,P.z,P.y,st)&&inWalk(x,zz));
      for(let k=0;k<n;k++){const sx=dx/n,sz=dz/n,nx=P.x+sx,nz=P.z+sz;
        if(ok_(nx,nz)){P.x=nx;P.z=nz;ok=true;continue}let m=false;
        if(sx&&ok_(nx,P.z)){P.x=nx;m=true}else if(V.ground)V.x=0;
        if(sz&&ok_(P.x,nz)){P.z=nz;m=true}else if(V.ground)V.z=0;
        ok=ok||m;if(!m)break}
      return ok}
    function stepVert(dt,ceil){const g=groundAt(P.x,P.z,P.y,V.ground?STEP:AIR_STEP);V.gy=g;
      if(V.ground){if(g>P.y+1e-4)P.y=g;/* ступенька вверх */else if(g<P.y-.01){V.ground=false;V.vy=0}/* сошёл с края */else P.y=g;if(V.ground)return}
      let ny=P.y+V.vy*dt-.5*GRAV*dt*dt;V.vy-=GRAV*dt;const top=ceil-.05-HEAD;if(ny>top){ny=top;if(V.vy>0)V.vy=0}
      if(ny<=g){ny=g;if(V.vy<=0){snd.land(-V.vy);V.vy=0;V.ground=true}}
      P.y=ny}
    const fpMode=()=>C.want===0;
    const clampPitch=p=>{const L=fpMode()?PITCH_FP:PITCH_TP;return Math.max(L[0],Math.min(L[1],p))};
    const locked=()=>document.pointerLockElement===canvas;
    const engaged=()=>locked()||document.activeElement===canvas;
    const look=(dx,dy,k)=>{C.yaw-=dx*k;C.pitch=clampPitch(C.pitch-dy*k*.86);lastLook=performance.now()};
    function setView(w){w=Math.max(0,Math.min(MAX_DIST,w));if(w>0)C.last=w;C.want=w;C.pitch=clampPitch(C.pitch);if(w===0){C.cur=C.d=0;P.yaw=C.yaw}wrap.classList.toggle("mz-tp",w>0);syncView()}
    /* видимый переключатель вида: «из-за спины» / «от первого лица»; следует и за V, и за колесом */
    const vBtns=[...hud.querySelectorAll(".mz-view button")];
    function syncView(){const fp=C.want===0;vBtns.forEach(b=>b.setAttribute("aria-pressed",String((b.dataset.v==="fp")===fp)))}
    vBtns.forEach(b=>on(b,"click",ev=>{setView(b.dataset.v==="fp"?0:(C.last||TP_DIST));if(ev.detail>0){try{canvas.focus({preventScroll:true})}catch(e){}}}));
    const toggleView=()=>setView(fpMode()?(C.last||TP_DIST):0);
    function zoom(dy){if(fpMode()){if(dy>0)setView(1.6)}else{const w=C.want+dy*.004;setView(w<1.1?0:w)}}
    const pause=()=>{Object.keys(keys).forEach(k=>keys[k]=false);jumpQ=false;if(joy){joy=null;knob.style.transform=""}drag=null};
    const MOVE=new Set(["KeyW","KeyA","KeyS","KeyD","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","ShiftLeft","ShiftRight"]);
    const typing=t=>!!(t&&t.closest&&t.closest("input,textarea,select,[contenteditable],.overlay,.loupe,[role=dialog]"));
    /* жесты (этап 3): G — помахать, C — сесть / встать; любое движение или прыжок поднимает; помахать — стоя */
    const GS={sit:false,waveT:0};
    const doWave=()=>{GS.sit=false;GS.waveT=reduce?1.6:2.4;syncG()};
    const toggleSit=v=>{GS.sit=v===undefined?!GS.sit:!!v;if(GS.sit)GS.waveT=0;syncG()};
    const gestNow=()=>GS.waveT>0?"wave":GS.sit?"sit":"";
    const gOk=v=>v==="wave"||v==="sit"?v:"";
    const kd=ev=>{if(typing(ev.target)||ev.ctrlKey||ev.metaKey||ev.altKey)return;const c=ev.code;snd.gesture();
      if(MOVE.has(c)){keys[c]=true;if(engaged())ev.preventDefault();return}
      if(c==="Space"){if(!engaged())return;ev.preventDefault();if(!ev.repeat)jumpQ=true;return}
      if(c==="KeyE"){if(nearObj&&!ev.repeat)activate(nearObj);return}
      if(c==="KeyG"){if(!ev.repeat)doWave();return}
      if(c==="KeyC"){if(!ev.repeat)toggleSit();return}
      if(c==="KeyV"){if(!ev.repeat)toggleView()}};
    const ku=ev=>{keys[ev.code]=false};
    on(window,"keydown",kd);on(window,"keyup",ku);
    on(window,"blur",pause);on(document,"visibilitychange",()=>{if(document.hidden)pause()});
    /* мышь: захват указателя (Pointer Lock), запасной вариант — перетаскивание */
    const k0=hud.querySelector(".mz-k0");
    const hint0=()=>{if(k0)k0.textContent=locked()?"Esc — отпустить мышь":plFail>=2?"перетаскивание — оглядеться":"клик — управлять мышью"};
    function requestLock(){if(!canvas.requestPointerLock||plFail>=2)return false;const id=++plTry;let failed=false;const fail_=()=>{if(failed||id!==plTry)return;failed=true;plFail++;hint0()};
      try{const pr=canvas.requestPointerLock();if(pr&&pr.catch)pr.catch(fail_)}catch(e){fail_()}return true}
    on(document,"pointerlockchange",()=>{if(!locked())pause();else plFail=0;hint0()});
    on(document,"pointerlockerror",()=>{plFail++;hint0()});
    on(document,"mousemove",ev=>{if(locked())look(ev.movementX||0,ev.movementY||0,.0024)});
    let drag=null,moved=0;const ray=new T.Raycaster(),mv=new T.Vector2();
    function pickAt(nx,ny){mv.set(nx,ny);ray.setFromCamera(mv,cam);const hits=ray.intersectObjects(clickable,true);if(hits.length&&hits[0].distance<9+C.d){let o=hits[0].object;while(o&&!o.userData.id&&!o.userData.go)o=o.parent;if(o)return o}return null}
    function interact(){const o=nearObj||pickAt(0,0);if(o)activate(o)}
    on(canvas,"pointerdown",ev=>{try{canvas.focus({preventScroll:true})}catch(e){}
      if(locked()){if(ev.button===0)interact();return}
      if(ev.pointerType==="touch"&&ev.target!==canvas)return;drag={x:ev.clientX,y:ev.clientY,id:ev.pointerId,type:ev.pointerType};moved=0;try{canvas.setPointerCapture(ev.pointerId)}catch(e){}});
    on(canvas,"pointermove",ev=>{if(!drag||drag.id!==ev.pointerId||locked())return;const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;moved+=Math.abs(dx)+Math.abs(dy);drag.x=ev.clientX;drag.y=ev.clientY;
      look(dx,dy,.0042)});
    on(canvas,"pointerup",ev=>{if(!drag||drag.id!==ev.pointerId)return;const was=moved,type=drag.type;drag=null;if(was>6)return;
      const rc=canvas.getBoundingClientRect(),nx=((ev.clientX-rc.left)/rc.width)*2-1,ny=-((ev.clientY-rc.top)/rc.height)*2+1;
      const o=pickAt(nx,ny);if(o){activate(o);return}
      if(type==="mouse"&&!coarse.matches&&requestLock())return;
      const fh=ray.intersectObjects(floors,false)[0];if(fh&&fh.distance<30)target={x:fh.point.x,z:fh.point.z}});
    on(canvas,"pointercancel",()=>{drag=null});
    on(canvas,"wheel",ev=>{if(!engaged())return;ev.preventDefault();zoom(ev.deltaMode===1?ev.deltaY*33:ev.deltaY)},{passive:false});
    /* джойстик (телефон): движение относительно камеры */
    let joy=null;on(stick,"pointerdown",ev=>{ev.stopPropagation();const b=stick.getBoundingClientRect();joy={id:ev.pointerId,cx:b.left+b.width/2,cy:b.top+b.height/2,dx:0,dy:0};try{stick.setPointerCapture(ev.pointerId)}catch(e){}});
    on(stick,"pointermove",ev=>{if(!joy||joy.id!==ev.pointerId)return;let dx=ev.clientX-joy.cx,dy=ev.clientY-joy.cy;const d=Math.hypot(dx,dy),m=40;if(d>m){dx*=m/d;dy*=m/d}joy.dx=dx/m;joy.dy=dy/m;knob.style.transform=`translate(${dx}px,${dy}px)`});
    const jend=()=>{joy=null;knob.style.transform=""};on(stick,"pointerup",jend);on(stick,"pointercancel",jend);
    /* кнопки «прыжок» и «смотреть» */
    const pad=hud.querySelector(".mz-pad"),bJump=pad&&pad.querySelector(".mz-jump"),bAct=pad&&pad.querySelector(".mz-act");
    const padBtn=(b,fn)=>{if(!b)return;on(b,"pointerdown",ev=>{ev.preventDefault();ev.stopPropagation();fn()});on(b,"click",ev=>{if(ev.detail===0)fn()})};
    padBtn(bJump,()=>{jumpQ=true});padBtn(bAct,()=>{if(nearObj)activate(nearObj)});
    /* кнопка «жест» (телефон) открывает два варианта; выбор закрывает меню */
    const bG=pad&&pad.querySelector(".mz-gst"),gMenu=hud.querySelector(".mz-gmenu"),gSit=gMenu.querySelector('[data-g="sit"]');
    const setGM=v=>{gMenu.dataset.open=v?"1":"0";if(bG)bG.setAttribute("aria-expanded",String(!!v));wrap.classList.toggle("mz-gopen",!!v)};
    function syncG(){gSit.textContent=GS.sit?"встать":"сесть"}
    padBtn(bG,()=>setGM(gMenu.dataset.open!=="1"));
    gMenu.querySelectorAll("button").forEach(b=>padBtn(b,()=>{if(b.dataset.g==="wave")doWave();else toggleSit();setGM(false)}));
    on(canvas,"pointerdown",()=>setGM(false));on(stick,"pointerdown",()=>setGM(false));
    /* «смотреть» становится «говорить», когда ближе всех — двойник */
    const ACT_LOOK='<b>◉</b>смотреть',ACT_TALK='<b><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 4.5h14v9H9l-4 3v-3H3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg></b>говорить';
    let actMode="look";
    function setAct(mode,name){if(!bAct)return;if(mode!==actMode){actMode=mode;bAct.innerHTML=mode==="talk"?ACT_TALK:ACT_LOOK}bAct.setAttribute("aria-label",mode==="talk"?"Поговорить: "+name:"Рассмотреть ближайший предмет")}
    stopFns.push(()=>{if(locked())document.exitPointerLock();if(pad)pad.remove()});
    function activate(o){if(locked())document.exitPointerLock();pause();if(o.userData.go){snd.cue("chat");const nav=(window.__APP&&window.__APP.go)||window.__goMsgs;if(nav)nav(o.userData.go);return}if(o.userData.id){if(markFound(o.userData.id))snd.cue("found");if(opt.onObj)opt.onObj(o.userData.id)}}
    /* кнопки залов */
    bar.innerHTML=HALLZ.map((hz,i)=>`<button type="button" data-h="${i}">${opt.halls[hz.k]}</button>`).join("");
    function goHall(i){const hz=HALLZ[i];if(!hz)return;P.x=0;P.z=hz.z0-2.2;P.yaw=0;P.y=0;C.yaw=0;C.pitch=clampPitch(-.2);V.x=V.z=V.vy=0;V.ground=true;target=null;piv.set(P.x,1.55,P.z);try{canvas.focus({preventScroll:true})}catch(e){}}
    bar.querySelectorAll("button").forEach(b=>b.onclick=()=>goHall(+b.dataset.h));

    let nearObj=null,lastHall=-1,last=performance.now();
    /* своя фигура */
    const me=figure(0x3F7F8E);me.position.set(P.x,0,P.z);S.add(me);
    const piv=new T.Vector3(P.x,1.55,P.z),pivT=new T.Vector3(),back=new T.Vector3(),cray=new T.Raycaster();
    canvas.__mz={P,C,V,me,get near(){return nearObj},get fp(){return fpMode()}};
    /* другие посетители: та же фигура своего цвета, имя, реплика */
    const AV={};
    const nameTex=n=>new T.CanvasTexture(textCanvas(n,"",{w:512,h:96,ts:44,pad:22,bg:"#141619",fg:"#E9EDF0",font:"Golos Text, sans-serif"}));
    function avatar(p){const g=figure(p.color);
      const lab=new T.Sprite(new T.SpriteMaterial({map:nameTex(p.name),depthTest:false}));lab.scale.set(.9,.17,1);lab.position.y=1.95;g.add(lab);
      Object.assign(g.userData,{name:p.name,lab,say:"",bub:null,spd:0});S.add(g);return g}
    function setSay(a,txt){if(a.userData.say===txt)return;a.userData.say=txt;if(a.userData.bub){a.remove(a.userData.bub);a.userData.bub=null}
      if(txt){const b=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(textCanvas("",txt.slice(0,90),{w:768,h:192,bs:38,pad:26,bg:"#FFFFFF",fg:"#16191D",font:"Golos Text, sans-serif"})),depthTest:false}));b.scale.set(1.5,.38,1);b.position.y=2.35;a.add(b);a.userData.bub=b}}
    function peersStep(dt,hi,t){const hz=HALLZ[hi];window.__curHall=opt.halls[hz.k]||"";opt.multi.tick(P,window.__curHall);
      const list=opt.multi.others(),seen=new Set();
      list.forEach(p=>{seen.add(p.id);let a=AV[p.id];if(!a){a=AV[p.id]=avatar(p);a.position.set(p.x,0,p.z);a.rotation.y=p.yaw||0}
        if(a.userData.name!==p.name){a.userData.name=p.name;a.userData.lab.material.map=nameTex(p.name);a.userData.lab.material.needsUpdate=true}
        const k=Math.min(1,dt*8),ox=a.position.x,oz=a.position.z;a.position.x+=(p.x-a.position.x)*k;a.position.z+=(p.z-a.position.z)*k;a.rotation.y+=angDiff(a.rotation.y,p.yaw||0)*k;
        const sp=dt>0?Math.hypot(a.position.x-ox,a.position.z-oz)/dt:0;a.userData.spd+=(Math.min(6,sp)-a.userData.spd)*Math.min(1,dt*6);animFig(a,dt,a.userData.spd,false,t);poseFig(a,dt,gOk(p.g),t);a.userData.g=gOk(p.g);setSay(a,p.say)});
      Object.keys(AV).forEach(id=>{if(!seen.has(id)){S.remove(AV[id]);AV[id].userData.fig.mats.forEach(m=>m.dispose());delete AV[id]}})}

    /* ---------- этап 3: двойники книги стоят в залах. Та же фигура, но собранная в три меша (тело, голова, визор),
       холодная подсветка «экрана», ромб над головой, имя вблизи. Разговор — чат сайта (msgs:<ключ>) ---------- */
    const DBL0=[
     {k:"v1",name:"Viktor-1",h:"dv",x:-5.3,dz:6.8,c:0x2F7D55},
     {k:"v2",name:"Viktor-2",h:"dv",x:-5.3,dz:10.2,c:0x3E6B4F},
     {k:"team",name:"Команда · Hottie и DA",h:"dv",x:4.3,dz:12.4,c:0x4C5D8A},
     {k:"vm",name:"Viktor от Mark",h:"id",x:-3.3,dz:9.4,c:0x7A5A8C},
     {k:"father",name:"Цифровой отец",h:"ot",x:-2.4,dz:6.3,c:0x1F2A6E},
     {k:"vv",name:"Viktor от Valentina",h:"se",x:-3.4,dz:4.6,c:0xA04A5C},
     {k:"vl",name:"Viktor от Lina-Alexandra",h:"se",x:-3.2,dz:11.2,c:0xC9A24A},
     {k:"ncopy",name:"N · копия",h:"n",x:-4.4,dz:11.6,c:0x5D5D5D},
     {k:"vn",name:"Viktor от N",h:"n",x:4.8,dz:12.6,c:0x6E6E73}];
    const DBL=(Array.isArray(opt.doubles)?opt.doubles:DBL0).filter(d=>d&&d.k&&H_[d.h]);
    function mergeBoxes(parts){let nv=0,ni=0;const gs=parts.map(p=>{const g=p[0].clone();g.translate(p[1],p[2],p[3]);nv+=g.attributes.position.count;ni+=g.index.count;return [g,p[4]]});
      const pos=new Float32Array(nv*3),nor=new Float32Array(nv*3),col=new Float32Array(nv*3),idx=new Uint16Array(ni);let vo=0,io=0;
      gs.forEach(([g,c])=>{const n=g.attributes.position.count;pos.set(g.attributes.position.array,vo*3);nor.set(g.attributes.normal.array,vo*3);for(let i=0;i<n;i++){col[(vo+i)*3]=c.r;col[(vo+i)*3+1]=c.g;col[(vo+i)*3+2]=c.b}
        const ix=g.index.array;for(let i=0;i<ix.length;i++)idx[io+i]=ix[i]+vo;vo+=n;io+=ix.length;g.dispose()});
      const out=new T.BufferGeometry();out.setAttribute("position",new T.BufferAttribute(pos,3));out.setAttribute("normal",new T.BufferAttribute(nor,3));out.setAttribute("color",new T.BufferAttribute(col,3));out.setIndex(new T.BufferAttribute(idx,1));out.computeBoundingSphere();return out}
    const DM={body:new T.MeshLambertMaterial({vertexColors:true,emissive:0x1C4F4A,transparent:true,opacity:.9}),glow:new T.MeshBasicMaterial({color:0xA6F4E2}),mark:new T.MeshBasicMaterial({color:0x7FE3CC,transparent:true,opacity:.92})};
    const DG={visor:new T.BoxGeometry(.28,.055,.02),mark:new T.OctahedronGeometry(.085,0),hair:new T.BoxGeometry(.35,.07,.33)};
    function dblLabel(name){const c=cnv(768,150,(g,w,h)=>{g.fillStyle="rgba(10,24,26,.88)";g.fillRect(0,0,w,h);g.fillStyle="#7FE3CC";g.fillRect(0,0,6,h);let fs=50;g.font=`500 ${fs}px Golos Text, sans-serif`;while(fs>26&&g.measureText(name).width>w-50){fs-=2;g.font=`500 ${fs}px Golos Text, sans-serif`}
        g.fillStyle="#EAF7F4";g.fillText(name,26,70);g.fillStyle="#7FE3CC";g.font="26px JetBrains Mono, monospace";g.fillText("двойник",26,124)});
      return new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),depthTest:false,transparent:true}))}
    const NPC=[];
    DBL.forEach((d,i)=>{const h=H_[d.h];let x=d.x,zz=h.z0-d.dz;
      /* страховка: если место занято (постамент, проём), ищем ближайшее свободное по спирали */
      if(!canStand(x,zz)){let ok=false;for(let rr=.4;rr<3&&!ok;rr+=.4)for(let a=0;a<12&&!ok;a++){const nx=x+Math.cos(a/12*Math.PI*2)*rr,nz=zz+Math.sin(a/12*Math.PI*2)*rr;if(Math.abs(nx)>1.9&&canStand(nx,nz)){x=nx;zz=nz;ok=true}}}
      const base=new T.Color(d.c||0x557788),main=base.clone().lerp(new T.Color(0xA9C2CA),.4),pale=new T.Color(0xD3E2E8),leg=main.clone().multiplyScalar(.55),shoe=new T.Color(0x1A1D22),hair=base.clone().multiplyScalar(.45),glow=new T.Color(0xBFF6EA);
      const bodyG=mergeBoxes([[FG.torso,0,.9,0,main],[FG.badge,.11,.98,-.136,glow],[FG.arm,-.3,.9,0,main],[FG.arm,.3,.9,0,main],[FG.hand,-.3,.63,0,pale],[FG.hand,.3,.63,0,pale],
        [FG.leg,-.11,.33,0,leg],[FG.leg,.11,.33,0,leg],[FG.shoe,-.11,.04,-.03,shoe],[FG.shoe,.11,.04,-.03,shoe]]);
      const headG=mergeBoxes([[FG.head,0,.17,0,pale],[DG.hair,0,.355,0,hair]]);
      const g=new T.Group(),body=new T.Mesh(bodyG,DM.body),head=new T.Group(),hm=new T.Mesh(headG,DM.body),vis=new T.Mesh(DG.visor,DM.glow);
      g.add(body);head.position.set(0,1.18,0);head.add(hm);vis.position.set(0,.19,-.168);head.add(vis);body.add(head);
      const blob=new T.Mesh(FG.blob,FM.blob);blob.rotation.x=-Math.PI/2;blob.position.y=.013;g.add(blob);
      const mk=new T.Mesh(DG.mark,DM.mark);mk.position.y=1.92;g.add(mk);
      const lab=dblLabel(d.name);lab.scale.set(1.38,.27,1);lab.position.y=2.22;lab.visible=false;lab.renderOrder=3;g.add(lab);
      const rest=Math.atan2(-(0-x),-((h.z0-2)-zz));g.position.set(x,0,zz);g.rotation.y=rest;S.add(g);
      Object.assign(g.userData,{go:"msgs:"+d.k,label:d.name,dbl:true,key:d.k,hb:{x,z:zz,top:1.9,r:.55}});
      block(x-.3,x+.3,zz-.3,zz+.3);clickable.push(g);
      NPC.push({k:d.k,name:d.name,h:d.h,hi:HALLZ.indexOf(h),x,z:zz,g,body,head,mk,lab,rest,ph:i*1.7,geos:[bodyG,headG]})});
    stopFns.push(()=>{NPC.forEach(n=>{n.geos.forEach(g=>g.dispose());n.lab.material.map.dispose();n.lab.material.dispose()});Object.values(DM).forEach(m=>m.dispose());Object.values(DG).forEach(g=>g.dispose())});

    /* ---------- этап 5: обстановка залов. Всё из примитивов, слито по материалу в несколько мешей на зал:
       «запечённый» свет зала в цветах вершин (как у стен), один атлас-холст на все надписи и картинки,
       светящееся — просто яркий цвет без света; без ламп и карт теней. Видны только текущий и соседние залы,
       в облегчённом режиме — без мелочей (x). Низкое участвует в прыжках, высокое держит ---------- */
    const PROPS=(function(){
      const AW=1024,U=128;
      /* атлас: ячейки [кол, ряд, ширина, высота] в единицах по 128 px */
      const CELL={winMarch:[0,0,2,2],winDay:[2,0,2,2],clock:[4,0,1,1],drawing:[4,1,1,1],schema1:[5,0,3,2],schema2:[0,2,2,2],call:[2,2,3,2],
        term:[5,2,2,1],chess:[7,2,1,1],schedule:[5,3,1,1],sheet:[6,3,1,1],card:[7,3,1,1],photos:[0,4,4,1],prints:[4,4,4,1],contact:[0,5,2,1],
        lKitchen:[2,5,1,1],lDacha:[3,5,1,1],lTop:[4,5,1,1],lCash:[5,5,2,1],l96:[7,5,1,1],lNotice:[0,6,2,1],glow:[2,6,1,1],nums:[0,7,8,1]};
      const atlas=cnv(AW,AW,(g)=>{g.fillStyle="#808080";g.fillRect(0,0,AW,AW);
        const R=(k,f)=>{const c=CELL[k],x=c[0]*U,y=c[1]*U,w=c[2]*U,h=c[3]*U;g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.translate(x,y);f(w,h);g.restore()};
        let sd=7;const rnd=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};
        /* мартовское окно: серое плоское небо, мокрые крыши, снег пятнами */
        R("winMarch",(w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,"#C9CFD4");gr.addColorStop(1,"#E2E4E2");g.fillStyle=gr;g.fillRect(0,0,w,h);
          g.fillStyle="#6D7378";for(let i=0;i<6;i++){const bx=i*46-8,bh=60+rnd()*70;g.fillRect(bx,h-bh,40,bh)}g.fillStyle="#E9ECEC";for(let i=0;i<6;i++)g.fillRect(i*46-8,h-60-rnd()*70,40,5);
          g.fillStyle="#3E4347";g.fillRect(0,h-26,w,26);g.fillStyle="rgba(240,242,242,.8)";for(let i=0;i<14;i++)g.fillRect(rnd()*w,h-24+rnd()*20,10+rnd()*30,3);noise(g,w,h,10)});
        /* дневное окно: небо, двор, дерево */
        R("winDay",(w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,"#8FB7DA");gr.addColorStop(1,"#DCEAF2");g.fillStyle=gr;g.fillRect(0,0,w,h);
          g.fillStyle="#B9A58C";g.fillRect(150,90,106,166);g.fillStyle="#7E8F9A";for(let r=0;r<4;r++)for(let c=0;c<3;c++)g.fillRect(162+c*32,104+r*36,18,22);
          g.fillStyle="#5B7A4A";g.beginPath();g.ellipse(70,140,62,70,0,0,7);g.fill();g.fillStyle="#4A3A2A";g.fillRect(64,170,12,86);noise(g,w,h,8)});
        /* циферблат: метки без цифр */
        R("clock",(w,h)=>{g.fillStyle="#3A2E25";g.fillRect(0,0,w,h);g.fillStyle="#F2EEE4";g.beginPath();g.arc(64,64,58,0,7);g.fill();g.strokeStyle="#222";g.lineWidth=3;
          for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.beginPath();g.moveTo(64+Math.sin(a)*46,64-Math.cos(a)*46);g.lineTo(64+Math.sin(a)*54,64-Math.cos(a)*54);g.stroke()}
          g.lineWidth=5;g.beginPath();g.moveTo(64,64);g.lineTo(64+26,64-14);g.stroke();g.lineWidth=3;g.beginPath();g.moveTo(64,64);g.lineTo(64-8,64-42);g.stroke();g.strokeStyle="#B0302A";g.lineWidth=1.5;g.beginPath();g.moveTo(64,64);g.lineTo(64+20,64+40);g.stroke()});
        /* детский рисунок: дом, солнце, две фигурки */
        R("drawing",(w,h)=>{g.fillStyle="#FBF8EF";g.fillRect(0,0,w,h);g.lineWidth=4;g.strokeStyle="#E0B020";g.beginPath();g.arc(100,26,14,0,7);g.stroke();
          g.strokeStyle="#C0392B";g.strokeRect(22,62,48,40);g.beginPath();g.moveTo(18,64);g.lineTo(46,36);g.lineTo(74,64);g.stroke();g.strokeStyle="#2E6DB4";[86,104].forEach((x,i)=>{g.beginPath();g.arc(x,74-i*4,6,0,7);g.moveTo(x,80-i*4);g.lineTo(x,104);g.moveTo(x-8,90);g.lineTo(x+8,90);g.stroke()});
          g.strokeStyle="#3C9A4A";g.beginPath();g.moveTo(0,112);g.bezierCurveTo(40,104,80,118,128,108);g.stroke()});
        /* схемы на досках: прямоугольники, круги, стрелки, дерево — без слов */
        const arrow=(x1,y1,x2,y2)=>{g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();const a=Math.atan2(y2-y1,x2-x1);g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-10*Math.cos(a-.4),y2-10*Math.sin(a-.4));g.moveTo(x2,y2);g.lineTo(x2-10*Math.cos(a+.4),y2-10*Math.sin(a+.4));g.stroke()};
        R("schema1",(w,h)=>{g.fillStyle="#F7F8F6";g.fillRect(0,0,w,h);g.lineWidth=3;g.strokeStyle="#22457A";[[30,40],[30,160],[160,100],[290,40],[290,160]].forEach(([x,y])=>g.strokeRect(x,y,70,46));
          arrow(100,63,160,115);arrow(100,183,160,130);arrow(230,115,290,70);arrow(230,130,290,180);g.strokeStyle="#B0302A";g.beginPath();g.arc(195,123,48,0,7);g.stroke();
          g.strokeStyle="#5A5F66";g.lineWidth=2;for(let i=0;i<5;i++){g.beginPath();g.moveTo(34,58+i*0);g.lineTo(34,58);g.stroke()}[[38,56],[38,64],[38,176],[38,184],[298,56],[298,176]].forEach(([x,y])=>{g.beginPath();g.moveTo(x,y);g.lineTo(x+40+rnd()*12,y);g.stroke()});
          g.fillStyle="#2E2E2E";g.fillRect(0,h-10,w,10)});
        R("schema2",(w,h)=>{g.fillStyle="#F7F8F6";g.fillRect(0,0,w,h);g.strokeStyle="#333";g.lineWidth=3;arrow(30,226,30,24);arrow(30,226,236,226);
          g.strokeStyle="#22457A";g.beginPath();g.moveTo(30,200);g.bezierCurveTo(90,190,120,60,226,48);g.stroke();g.strokeStyle="#B0302A";g.setLineDash([8,6]);g.beginPath();g.moveTo(30,210);g.bezierCurveTo(100,206,150,150,226,120);g.stroke();g.setLineDash([]);
          g.strokeStyle="#3C7A4A";g.lineWidth=2;const tr=(x,y,d)=>{if(d>3)return;[-1,1].forEach(s=>{const nx=x+s*(36-d*8),ny=y+30;g.beginPath();g.moveTo(x,y);g.lineTo(nx,ny);g.stroke();tr(nx,ny,d+1)})};tr(150,96,0)});
        /* созвон: сетка 3×3, одна клетка — чёрный квадрат */
        R("call",(w,h)=>{g.fillStyle="#10151B";g.fillRect(0,0,w,h);const cw=(w-16)/3,ch=(h-16)/3;for(let r=0;r<3;r++)for(let c=0;c<3;c++){const x=4+c*(cw+4),y=4+r*(ch+4);
          if(r===1&&c===2){g.fillStyle="#000";g.fillRect(x,y,cw,ch);continue}const hue=[200,30,140,260,90,10,180,320][(r*3+c)%8];g.fillStyle=`hsl(${hue},18%,${30+rnd()*14}%)`;g.fillRect(x,y,cw,ch);
          g.fillStyle=`hsl(${hue},20%,62%)`;g.beginPath();g.arc(x+cw/2,y+ch*.42,ch*.17,0,7);g.fill();g.beginPath();g.ellipse(x+cw/2,y+ch*.95,cw*.26,ch*.32,0,Math.PI,0);g.fill()}});
        /* экран журнала: строки-полоски без букв */
        R("term",(w,h)=>{g.fillStyle="#061210";g.fillRect(0,0,w,h);g.fillStyle="#4F7F6A";g.fillRect(8,8,90,7);for(let i=0;i<9;i++){g.fillStyle=i%4===3?"#8FE6CC":"#B6E3C3";g.globalAlpha=.75;g.fillRect(8,24+i*11,30+rnd()*200,5)}g.globalAlpha=1;g.fillStyle="#7FE3CC";g.fillRect(8+rnd()*120,118,8,4)});
        R("chess",(w,h)=>{for(let r=0;r<8;r++)for(let c=0;c<8;c++){g.fillStyle=(r+c)%2?"#5A3A22":"#E8D6B0";g.fillRect(c*16,r*16,16,16)}});
        /* расписание: таблица с цветными клетками, без слов */
        R("schedule",(w,h)=>{g.fillStyle="#FCFCF8";g.fillRect(0,0,w,h);g.strokeStyle="#9AA";g.lineWidth=1;for(let i=0;i<=7;i++){g.beginPath();g.moveTo(8+i*16,10);g.lineTo(8+i*16,118);g.stroke()}for(let j=0;j<=6;j++){g.beginPath();g.moveTo(8,10+j*18);g.lineTo(120,10+j*18);g.stroke()}
          for(let k=0;k<12;k++){g.fillStyle=["#E9B4B4","#B9D2E6","#D8E2B0","#F0D79A"][k%4];g.fillRect(9+Math.floor(rnd()*7)*16,11+Math.floor(rnd()*6)*18,15,17)}});
        R("sheet",(w,h)=>{g.fillStyle="#FAF8F2";g.fillRect(0,0,w,h);g.fillStyle="#9AA0A6";for(let i=0;i<7;i++)g.fillRect(14,22+i*14,60+rnd()*44,3);g.fillStyle="#C0392B";g.beginPath();g.arc(64,8,5,0,7);g.fill()});
        R("card",(w,h)=>{g.fillStyle="#FFFFFF";g.fillRect(0,0,w,h);g.fillStyle="#E0A030";g.fillRect(0,0,w,18);g.fillStyle="#8A9098";for(let i=0;i<4;i++)g.fillRect(10,36+i*20,50+rnd()*56,4)});
        /* фотографии в рамках: мягкие силуэты, сепия и холодные тона */
        R("photos",(w,h)=>{for(let i=0;i<4;i++){const x=i*128,base=["#C8B08A","#9FB0BC","#D2C2A6","#B7A796"][i];g.fillStyle=base;g.fillRect(x,0,128,128);
          const n=i===2?3:i===3?1:2;for(let k=0;k<n;k++){const cx=x+64+(k-(n-1)/2)*34;g.fillStyle="rgba(60,45,35,.55)";g.beginPath();g.arc(cx,54,13,0,7);g.fill();g.beginPath();g.ellipse(cx,112,22,36,0,Math.PI,0);g.fill()}noise(g,128,128,12)}});
        /* отпечатки N: дворы, рамка, угол окна — ч/б */
        R("prints",(w,h)=>{for(let i=0;i<4;i++){const x=i*128;g.fillStyle="#EFEDE8";g.fillRect(x,0,128,128);g.fillStyle="#1C1C1C";g.fillRect(x+8,8,112,112);
          const gr=g.createLinearGradient(x,8,x,120);gr.addColorStop(0,"#9A9A98");gr.addColorStop(1,"#2A2A2A");g.fillStyle=gr;
          if(i===0){g.fillRect(x+8,8,112,112);g.fillStyle="#141414";g.fillRect(x+20,40,30,80);g.fillRect(x+70,30,40,90);g.fillStyle="#bbb";g.fillRect(x+76,40,8,10)}
          else if(i===1){g.fillRect(x+8,8,112,112);g.strokeStyle="#ddd";g.lineWidth=3;g.strokeRect(x+30,26,66,76)}
          else if(i===2){g.fillRect(x+8,8,112,112);g.strokeStyle="#111";g.lineWidth=2;g.beginPath();g.moveTo(x+50,8);g.lineTo(x+50,70);g.moveTo(x+80,8);g.lineTo(x+80,70);g.stroke();g.fillStyle="#111";g.fillRect(x+44,70,42,6)}
          else{g.fillRect(x+8,8,112,112);g.fillStyle="#d8d8d8";g.fillRect(x+8,8,60,56);g.fillStyle="#222";g.fillRect(x+36,8,4,56);g.fillRect(x+8,34,60,4)}noise(g,128,128,16)}});
        R("contact",(w,h)=>{g.fillStyle="#F2F0EA";g.fillRect(0,0,w,h);for(let r=0;r<3;r++)for(let c=0;c<6;c++){const x=10+c*40,y=10+r*38;g.fillStyle="#141414";g.fillRect(x,y,36,32);g.fillStyle=`rgb(${90+rnd()*90|0},${90+rnd()*90|0},${90+rnd()*90|0})`;g.globalAlpha=.6;g.fillRect(x+3,y+5,30,22);g.globalAlpha=1}
          g.strokeStyle="#C0392B";g.lineWidth=2.5;g.strokeRect(48,46,40,36)});
        /* короткие надписи (их список — в отчёте) */
        const lab=(k,lines,font,col,bg)=>R(k,(w,h)=>{g.fillStyle=bg;g.fillRect(0,0,w,h);g.fillStyle=col;g.textAlign="center";g.textBaseline="middle";lines.forEach((t,i)=>{g.font=font;g.fillText(t,w/2,h/2+(i-(lines.length-1)/2)*(h/lines.length*.82))})});
        lab("lKitchen",["кухня","кухня"],"44px Caveat, cursive","#2B3A70","#C8A878");
        lab("lDacha",["на дачу"],"40px Caveat, cursive","#2B3A70","#C8A878");
        lab("lTop",["верх ↑"],"600 40px Golos Text, sans-serif","#1A1A1A","#B99A6A");
        lab("lCash",["Касса"],"600 64px Golos Text, sans-serif","#FFFFFF","#B8322A");
        lab("l96",["96"],"76px Caveat, cursive","#222","#F3EEE2");
        lab("lNotice",["Объявления"],"600 40px Golos Text, sans-serif","#14181D","#F4F1EA");
        R("glow",(w,h)=>{const gr=g.createRadialGradient(64,84,4,64,84,70);gr.addColorStop(0,"#FFE2A8");gr.addColorStop(.35,"#B8743A");gr.addColorStop(1,"#120C0A");g.fillStyle=gr;g.fillRect(0,0,w,h)});
        R("nums",(w,h)=>{for(let i=0;i<32;i++){const x=(i%8)*128,y=Math.floor(i/8)*32;g.fillStyle="#F1ECE0";g.fillRect(x+2,y+2,124,28);g.fillStyle="#22252A";g.font="600 22px JetBrains Mono, monospace";g.textAlign="center";g.textBaseline="middle";g.fillText(String(i+1).padStart(2,"0"),x+64,y+17)}})});
      const atlasTex=new T.CanvasTexture(atlas);atlasTex.anisotropy=4;
      /* UV ячейки (с отступом в 2 px от краёв); sub — часть ячейки [i, из n по горизонтали, j, из m по вертикали] */
      const uvOf=(k,sub)=>{const c=CELL[k];let x=c[0]*U,y=c[1]*U,w=c[2]*U,h=c[3]*U;if(sub){w/=sub[1];h/=sub[3]||1;x+=sub[0]*w;y+=(sub[2]||0)*h}const p=2;return [(x+p)/AW,1-(y+h-p)/AW,(x+w-p)/AW,1-(y+p)/AW]};
      const M={plain:new T.MeshBasicMaterial({vertexColors:true}),tex:new T.MeshBasicMaterial({vertexColors:true,map:atlasTex}),
        glass:new T.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.2,depthWrite:false}),gtex:new T.MeshBasicMaterial({vertexColors:true,map:atlasTex,transparent:true,blending:T.AdditiveBlending,depthWrite:false}),blink:new T.MeshBasicMaterial({vertexColors:true})};
      /* треугольники экономим: у стоящих на полу коробок нет дна, мелкие цилиндры — шестигранные, индикаторы — плоские */
      const G={box:new T.BoxGeometry(1,1,1),cyl:new T.CylinderGeometry(.5,.5,1,10),cyl6:new T.CylinderGeometry(.5,.5,1,6),cone:new T.ConeGeometry(.5,1,6),sph:new T.SphereGeometry(.5,7,5),plane:new T.PlaneGeometry(1,1)};
      G.box5=G.box.clone();G.box5.setIndex(Array.from(G.box.index.array).filter((_,i)=>i<18||i>=24));
      const halls=[];const v=new T.Vector3(),n=new T.Vector3(),nm=new T.Matrix3(),q=new T.Quaternion(),eu=new T.Euler(),sc=new T.Vector3(),ps=new T.Vector3(),o3=[0,0,0],LD=new T.Vector3(.35,.85,.4).normalize();
      function kit(k){const h=H_[k],hi=HALLZ.indexOf(h),A=AIR[k];const L={c:{plain:[],tex:[]},x:{plain:[],tex:[]},glass:[],gtex:[],blink:[]};const sky=new T.Color(A.sky);
        const put=(geo,x,y,dz,sx,sy,sz,col,o)=>{o=o||{};eu.set(o.rx||0,o.ry||0,o.rz||0,"YXZ");q.setFromEuler(eu);const m=new T.Matrix4().compose(ps.set(x,y,h.z0+dz),q,sc.set(sx,sy,sz));
          const it={geo,m,c:new T.Color(col),uv:o.uv?uvOf(o.uv,o.sub):null,em:o.em||(o.glass&&o.uv?.45:0),blink:o.blink};
          (o.glass?(it.uv?L.gtex:L.glass):o.blink?L.blink:L[o.x?"x":"c"][it.uv?"tex":"plain"]).push(it);return it};
        const K={h,hi,z:dz=>h.z0+dz,
          /* коробка: x, низ y, dz (от входа в зал), размеры */
          box:(x,y,dz,w,hh,d,col,o)=>put(y<=.001&&!(o&&(o.rx||o.rz))?G.box5:G.box,x,y+hh/2,dz,w,hh,d,col,o),
          quad:(x,y,dz,w,hh,col,o)=>put(G.plane,x,y,dz,w,hh,1,col,o),
          cyl:(x,y,dz,r,hh,col,o)=>put((o&&o.seg6)||r<.08?G.cyl6:G.cyl,x,y+hh/2,dz,r*2,hh,r*2,col,o),
          cone:(x,y,dz,r,hh,col,o)=>put(G.cone,x,y+hh/2,dz,r*2,hh,r*2,col,o),
          sph:(x,y,dz,r,col,o)=>put(G.sph,x,y,dz,r*2,r*2,r*2,col,o),
          /* картинка из атласа: центр, ширина, высота; ry — куда смотрит лицевая сторона */
          pic:(x,y,dz,w,hh,cell,o)=>put(G.plane,x,y,dz,w,hh,1,(o&&o.tint)||0xFFFFFF,Object.assign({},o,{uv:cell})),
          /* тонкая палка от точки к точке (верёвка, шнур, растяжка) */
          rod:(x1,y1,z1,x2,y2,z2,t,col,o)=>{const dx=x2-x1,dy=y2-y1,dzz=z2-z1,len=Math.hypot(dx,dy,dzz);const it=put(G.box,(x1+x2)/2,(y1+y2)/2,(z1+z2)/2,t,t,len,col,o);
            const dir=new T.Vector3(dx,dy,dzz).normalize();it.m.compose(ps.set((x1+x2)/2,(y1+y2)/2,h.z0+(z1+z2)/2),new T.Quaternion().setFromUnitVectors(new T.Vector3(0,0,1),dir),sc.set(t,t,len));return it},
          /* препятствие (dz от входа): верх ≤ LOW_TOP — можно встать; иначе держит. Высокое ещё и останавливает камеру */
          solid:(x0,x1,dz0,dz1,top)=>{const za=h.z0+Math.min(dz0,dz1),zb=h.z0+Math.max(dz0,dz1);block(x0,x1,za,zb,top);blockers[blockers.length-1].push(1);if(top>1.2){const p=new T.Mesh(G.box,M.plain);p.visible=false;p.scale.set(x1-x0,top,zb-za);p.position.set((x0+x1)/2,top/2,(za+zb)/2);p.updateMatrixWorld(true);camBlock.push(p);propProxy.push(p)}}};
        halls.push({k,hi,L,A,sky,h});return K}
      /* свет в вершине: база зала и пятна (как у стен) + немного направленности, чтобы грани различались */
      function shadeV(H,x,y,z,nx,ny,nz,o){lightAt(H.h,x,y,z,ny>.7?0:ny<-.7?2:1,o);const d=.8+.2*Math.max(0,nx*LD.x+ny*LD.y+nz*LD.z),ao=.78+.22*ss(0,.35,y);
        const fl=H.A.em*.55;o[0]=Math.max(o[0]*d*ao,H.sky.r*fl);o[1]=Math.max(o[1]*d*ao,H.sky.g*fl);o[2]=Math.max(o[2]*d*ao,H.sky.b*fl)}
      /* слияние: позиции и нормали в мир, цвет вершины = альбедо × свет (или чистый цвет у светящегося), UV в ячейку атласа */
      function merge(H,items,tex){if(!items.length)return null;let nv=0,ni=0;items.forEach(it=>{nv+=it.geo.attributes.position.count;ni+=it.geo.index.count});
        const pos=new Float32Array(nv*3),nor=new Float32Array(nv*3),col=new Float32Array(nv*3),uv=tex?new Float32Array(nv*2):null,idx=nv>65535?new Uint32Array(ni):new Uint16Array(ni);let vo=0,io=0;
        items.forEach(it=>{const g=it.geo,P=g.attributes.position,N=g.attributes.normal,UVa=g.attributes.uv,cnt=P.count;nm.getNormalMatrix(it.m);it.v0=vo;it.vn=cnt;
          for(let i=0;i<cnt;i++){v.fromBufferAttribute(P,i).applyMatrix4(it.m);n.fromBufferAttribute(N,i).applyMatrix3(nm).normalize();const j=(vo+i)*3;pos[j]=v.x;pos[j+1]=v.y;pos[j+2]=v.z;nor[j]=n.x;nor[j+1]=n.y;nor[j+2]=n.z;
            if(it.em){col[j]=it.c.r*it.em;col[j+1]=it.c.g*it.em;col[j+2]=it.c.b*it.em}else{shadeV(H,v.x,v.y,v.z,n.x,n.y,n.z,o3);col[j]=it.c.r*o3[0];col[j+1]=it.c.g*o3[1];col[j+2]=it.c.b*o3[2]}
            if(uv){const u=UVa.getX(i),w=UVa.getY(i),r=it.uv;uv[(vo+i)*2]=r[0]+(r[2]-r[0])*u;uv[(vo+i)*2+1]=r[1]+(r[3]-r[1])*w}}
          const ix=g.index.array;for(let i=0;i<ix.length;i++)idx[io+i]=ix[i]+vo;vo+=cnt;io+=ix.length});
        const out=new T.BufferGeometry();out.setAttribute("position",new T.BufferAttribute(pos,3));out.setAttribute("normal",new T.BufferAttribute(nor,3));out.setAttribute("color",new T.BufferAttribute(col,3));
        if(uv)out.setAttribute("uv",new T.BufferAttribute(uv,2));out.setIndex(new T.BufferAttribute(idx,1));out.computeBoundingSphere();return out}
      const propProxy=[];
      function finish(){const out=[];halls.forEach(H=>{const ms=[],xs=[];const mk=(items,mat,tex,lst)=>{const g=merge(H,items,tex);if(!g)return null;const me=new T.Mesh(g,mat);me.matrixAutoUpdate=false;me.userData.prop=H.k;S.add(me);lst.push(me);return me};
          mk(H.L.c.plain,M.plain,false,ms);mk(H.L.c.tex,M.tex,true,ms);mk(H.L.glass,M.glass,false,ms);mk(H.L.gtex,M.gtex,true,ms);mk(H.L.x.plain,M.plain,false,xs);mk(H.L.x.tex,M.tex,true,xs);
          const bm=mk(H.L.blink,M.blink,false,ms);
          out.push({k:H.k,hi:H.hi,core:ms,extra:xs,blink:bm?{mesh:bm,items:H.L.blink}:null,parts:H.L.c.plain.length+H.L.c.tex.length+H.L.glass.length+H.L.gtex.length+H.L.blink.length+H.L.x.plain.length+H.L.x.tex.length,nx:H.L.x.plain.length+H.L.x.tex.length})});
        return out}
      return {kit,finish,atlasTex,M,G,propProxy,CELL}})();

    /* — обстановка по залам: что именно и почему — в отчёте этапа 5; координаты dz — от входа в зал — */
    const C_={wood:0x7A5A3C,dark:0x24211F,white:0xEDEAE3,steel:0x9AA1A8,paper:0xF2EEE4,card:0xB89468};
    /* Квартиры: мартовское окно над кухней, батарея, часы, чайник и банки, телевизор на холодильнике; крючки с куртками,
       чемодан и обувь у входа; окно и занавески в съёмной; коробки «кухня» и кепка на крючке у квартиры отца */
    (function(){const K=PROPS.kit("kv");
      const win=(x,dz,w,hh,y0,cell,sgn,curt)=>{const xf=x+sgn*.012;K.pic(xf,y0+hh/2,dz,w,hh,cell,{ry:sgn>0?Math.PI/2:-Math.PI/2,em:.95});
        [[0,hh+.06],[0,-.03]].forEach(([_,yy])=>K.box(x+sgn*.03,y0+yy-.03,dz,.06,.06,w+.12,C_.white));[-1,1].forEach(s=>K.box(x+sgn*.03,y0,dz+s*(w/2+.03),.06,hh,.06,C_.white));
        K.box(x+sgn*.03,y0+hh/2-.025,dz,.05,.05,w,C_.white);K.box(x+sgn*.03,y0,dz,.05,hh,.05,C_.white);
        K.box(x+sgn*.11,y0-.06,dz,.24,.05,w+.3,0xE2DDD2);/* подоконник */
        [-1,1].forEach(s=>{for(let f=0;f<3;f++)K.box(x+sgn*(.07+(f%2)*.04),y0-.5,dz+s*(w/2+.12+f*.12),.06,hh+.82,.13,curt)});K.box(x+sgn*.12,y0+hh+.3,dz,.03,.03,w+1.1,0x6B5A48)};
      /* кухня: окно между столешницей и холодильником (3, 5, 19) */
      win(-7.97,-5.6,1.4,1.5,1.05,"winMarch",1,0xC9B9A0);
      K.pic(-6.9,.016,-5.6,1.3,1.4,"glow",{rx:-Math.PI/2,glass:1,tint:0xFFF4DD,x:1});
      for(let i=0;i<8;i++)K.box(-7.9,.18,-5.1-i*.14,.09,.55,.07,0xEDEDEA);K.box(-7.9,.2,-5.6,.05,.04,1.1,0xDADAD6);/* батарея */
      K.cyl(-7.94,3.33,-5.6,.19,.04,0x3A2E25,{rz:Math.PI/2});K.pic(-7.91,3.35,-5.6,.32,.32,"clock",{ry:Math.PI/2});/* часы (14, 34) */
      K.cyl(-7.25,.94,-3.8,.1,.2,0xC9CED2);K.box(-7.12,1.04,-3.8,.12,.03,.03,0x222222);/* чайник */
      [[-6.75,0],[-6.55,1],[-6.35,2]].forEach(([x,i])=>{K.cyl(x,.94,-3.75,.065,.16+i*.02,0xD8E6EA,{x:1});K.cyl(x,1.1+i*.02,-3.75,.068,.025,[0xB03A2E,0xD7B13A,0x5F8B4E][i],{x:1})});/* банки с крышками (19, 20, 22) */
      K.cyl(-5.95,.94,-3.75,.07,.09,0xF2F0EA,{x:1});K.cyl(-5.95,1.03,-3.75,.035,.025,0xF2F0EA,{x:1});/* сахарница (42) */
      K.box(-7.5,1.8,-7.6,.48,.32,.26,0x1B1C1F);K.pic(-7.5,1.96,-7.465,.42,.26,"winDay",{em:.6});/* телевизор без звука на холодильнике (3, 19) */
      /* у входа: крючки, две куртки и шарф (2, 14); чемодан с биркой (2); ботинки носками к выходу (95), тапки для гостей (22) */
      K.box(7.94,1.72,-2.2,.05,.12,1.7,C_.wood);for(let i=0;i<4;i++)K.box(7.86,1.66,-1.6-i*.4,.12,.04,.03,0x9A8A6A);
      K.box(7.8,.85,-1.95,.22,.85,.48,0x3E4A57);K.box(7.82,1.5,-1.95,.16,.2,.36,0x3E4A57);K.box(7.8,.95,-2.75,.2,.75,.44,0x7A5A40);K.box(7.82,1.5,-2.75,.15,.17,.3,0x7A5A40);
      K.box(7.86,1.18,-3.15,.06,.5,.14,0xB4483A);K.solid(7.6,8,-1.6,-3.1,1.8);
      K.box(2.6,.08,-1.2,.44,.62,.26,0x2F4F6F);K.box(2.6,.7,-1.2,.2,.03,.04,0x1A1A1A);[-1,1].forEach(s=>{K.box(2.6+s*.09,.66,-1.2,.025,.05,.025,0x1A1A1A);K.cyl(2.6+s*.17,0,-1.08,.04,.07,0x111111,{rx:Math.PI/2})});
      K.box(2.9,.46,-1.07,.1,.07,.005,0xF4F1EA);K.rod(2.82,.68,-1.12,2.9,.5,-1.07,.008,0xC0392B);K.solid(2.38,2.82,-1.33,-1.07,.7);
      [[1.75,-.75,0x2A2A2A],[1.95,-.75,0x2A2A2A],[3.4,-.7,0x9AA8B8],[3.6,-.7,0x9AA8B8]].forEach(([x,dz,c])=>K.box(x,0,dz,.12,.07,.28,c,{x:1}));
      /* съёмная: окно с другими занавесками, свет пятном (5) */
      win(7.97,-15.2,1.3,1.5,1.0,"winMarch",-1,0x8C9BA5);K.pic(7.1,.017,-15.2,1.4,1.3,"glow",{rx:-Math.PI/2,glass:1,tint:0xFFF4DD,x:1});
      K.cyl(3.25,.77,-13.2,.05,.1,0xE9E2D2,{x:1});/* кружка с неровным дном (5) */
      /* у квартиры отца: коробки «кухня» и «на дачу» (5, 109), кепка на крючке и светлое пятно на обоях (14) */
      K.box(-6.95,0,-22.9,.62,.46,.5,C_.card);K.pic(-6.95,.24,-22.64,.44,.34,"lKitchen",{});K.box(-6.15,0,-22.95,.55,.4,.48,0xA9835A);K.pic(-6.15,.21,-22.70,.42,.2,"lDacha",{});
      K.solid(-7.26,-6.64,-22.65,-23.15,.46);K.solid(-6.43,-5.87,-22.71,-23.19,.4);
      K.box(-7.985,1.1,-18.8,.01,.75,.45,0xF1E9D8);K.box(-7.93,1.62,-18.8,.1,.03,.03,0x8A7A5A);K.box(-7.86,1.52,-18.8,.2,.08,.24,0x3B3F44);K.box(-7.86,1.52,-18.66,.12,.02,.12,0x3B3F44)})();

    /* Предметы: стеллажи с номерными коробками и бирками вдоль стен, каталожный стол с лампой у выхода,
       ящики у входа, часы с секундной стрелкой над дверью (4) */
    (function(){const K=PROPS.kit("pr");let num=0;
      const rack=(sgn,dz0,len)=>{const x=sgn*7.77,f=sgn*7.56;K.box(x,0,dz0-len/2,.42,2.6,len,0x5D5246);
        for(let s=0;s<5;s++)K.box(x-sgn*.02,.08+s*.6,dz0-len/2,.4,.04,len-.04,0x8A7A66);
        for(let s=0;s<4;s++)for(let b=0;b<4;b++){const bz=dz0-.35-b*(len-.2)/4,y=.12+s*.6,c=[0xB89468,0xA9835A,0xC7A57A,0x9C7B55][(b+s+num)%4],hh=.3+((b*7+s)%3)*.04;
          K.box(x-sgn*.04,y,bz,.36,hh,.5,c);K.pic(f-sgn*.046,y+hh*.6,bz,.3,.075,"nums",{ry:sgn>0?-Math.PI/2:Math.PI/2,sub:[num%8,8,Math.floor(num/8)%4,4],x:1});
          if((b+s)%3===0)K.box(f-sgn*.03,y+.04,bz+.18,.005,.07,.05,0xF4F1EA,{x:1});num++}
        K.solid(sgn>0?7.52:-8,sgn>0?8:-7.52,dz0,dz0-len,2.6)};
      rack(1,-3.0,2.6);rack(1,-6.4,2.6);rack(1,-9.8,2.6);rack(-1,-3.8,2.4);rack(-1,-6.8,2.6);rack(-1,-10.2,2.6);
      /* каталожный стол: лампа, раскрытая книга описи, картотека, бирки на шнурке; стул за столом */
      K.box(5.2,.72,-16.4,1.5,.05,.7,C_.wood);[[-.68,-.3],[.68,-.3],[-.68,.3],[.68,.3]].forEach(([a,b])=>K.box(5.2+a,0,-16.4+b,.05,.72,.05,0x4A3727));
      K.cyl(4.68,.77,-16.6,.08,.02,0x222222);K.rod(4.68,.79,-16.6,4.72,1.12,-16.48,.02,0x222222);K.cone(4.74,1.03,-16.36,.12,.14,0x2F4F3F,{rx:-.6});K.sph(4.75,1.04,-16.32,.045,0xFFE8B0,{em:1.25});
      K.pic(4.9,.016,-16.25,1.1,.9,"glow",{rx:-Math.PI/2,glass:1,tint:0xFFE2A0,x:1});
      K.box(5.15,.77,-16.35,.36,.02,.26,0xF2EBD8);K.box(5.15,.775,-16.35,.01,.025,.26,0x6A5A44);K.box(5.65,.77,-16.5,.22,.14,.32,0x6B4A2E);for(let i=0;i<6;i++)K.box(5.65,.8,-16.39-i*.04,.18,.12,.004,0xF4F1EA,{x:1});
      for(let i=0;i<4;i++){K.box(5.45+i*.06,.77,-16.15,.05,.004,.08,0xF1E6C8,{x:1});}K.rod(5.4,.775,-16.12,5.7,.775,-16.12,.004,0xC0392B,{x:1});
      K.solid(4.45,5.95,-16.05,-16.75,.77);
      K.box(5.2,.44,-17.1,.44,.05,.44,C_.wood);K.box(5.2,.48,-17.3,.44,.48,.05,C_.wood);[[-.19,-.19],[.19,-.19],[-.19,.19],[.19,.19]].forEach(([a,b])=>K.box(5.2+a,0,-17.1+b,.04,.44,.04,0x4A3727));K.solid(4.96,5.44,-16.86,-17.34,.96);
      /* ящики у входа — низкие, на них можно встать */
      K.box(-6.8,0,-1.3,.7,.42,.55,0x9C7B55);K.pic(-6.8,.24,-1.022,.3,.075,"nums",{sub:[4,8,1,4]});K.box(-6.05,0,-1.1,.55,.36,.5,0xB89468);K.pic(-6.05,.2,-.847,.3,.075,"nums",{sub:[5,8,1,4]});
      K.solid(-7.15,-6.45,-1.025,-1.575,.42);K.solid(-6.325,-5.775,-.85,-1.35,.36);
      /* часы над дверью в «Идеи» (4: «часы с секундной стрелкой над дверью») */
      K.cyl(0,3.98,-17.83,.24,.04,0x222222,{rx:Math.PI/2});K.pic(0,3.98,-17.805,.42,.42,"clock",{})})();

    /* Идеи: карточки рядами над тезисами с нитками между ними, длинный стол с бумагами и водой, табуреты;
       доска со схемой и пробковая доска на задней стене, передвижная доска со вторым чертежом */
    (function(){const K=PROPS.kit("id");
      [-1,1].forEach(side=>{const x=side*(7.965),ry=side>0?-Math.PI/2:Math.PI/2;for(let k=0;k<6;k++){const zc=-2.6-k*2.6;const pts=[];
        for(let r=0;r<2;r++)for(let c=0;c<3;c++){const y=2.85+r*.42+((k+c)%2)*.05,zz=zc+(c-1)*.62+(r?.12:0);K.pic(x-side*.004,y,zz,.3,.2,"card",{ry,x:1});K.box(x-side*.012,y+.07,zz,.012,.025,.025,0xC0392B,{x:1});pts.push([y+.07,zz])}
        [[0,1],[1,5],[3,4],[0,4],[2,5]].forEach(([a,b])=>K.rod(x-side*.014,pts[a][0],pts[a][1],x-side*.014,pts[b][0],pts[b][1],.008,0xB0302A,{x:1}))}});
      /* длинный стол (4,4 м) вдоль стены тезисов */
      K.box(3.6,.72,-5.4,.9,.05,4.4,0xE8E6E0);[[-.4,-2.1],[.4,-2.1],[-.4,2.1],[.4,2.1]].forEach(([a,b])=>K.box(3.6+a,0,-5.4+b,.05,.72,.05,0x2A2A2A));K.solid(3.15,4.05,-3.2,-7.6,.77);
      for(let i=0;i<7;i++){K.box(3.45+(i%2)*.2,.77,-3.7-i*.55,.21,.012+(i%3)*.012,.3,0xF6F4EE,{ry:(i%3-1)*.15});if(i%2)K.box(3.75,.79,-3.8-i*.55,.15,.006,.006,0xE0B020,{x:1,ry:.4})}
      K.cyl(3.85,.77,-4.6,.035,.24,0xCFE4EE,{x:1});K.cyl(3.85,1.01,-4.6,.016,.03,0x2E6DB4,{x:1});K.cyl(3.4,.77,-6.3,.035,.24,0xCFE4EE,{x:1});K.cyl(3.4,1.01,-6.3,.016,.03,0x2E6DB4,{x:1});K.cyl(3.72,.77,-6.5,.035,.1,0xDCEBF0,{x:1});
      [-4.0,-5.4,-6.8].forEach(dz=>{K.cyl(4.75,.44,dz,.2,.04,0x2C2C2C);K.cyl(4.75,0,dz,.025,.44,0x777777);K.cyl(4.75,0,dz,.16,.02,0x555555);K.solid(4.55,4.95,dz+.2,dz-.2,.48)});
      /* задняя стена: доска со схемой слева, пробковая доска с карточками и нитками справа */
      const zb=-18+.16;K.box(-4.6,1.15,zb-.02,3.1,1.5,.03,0xBFC3C7);K.pic(-4.6,1.9,zb,3.0,1.4,"schema1",{});K.box(-4.6,1.08,zb+.04,2.4,.04,.1,0x9AA1A8);
      K.box(4.6,1.15,zb-.02,3.0,1.45,.03,0xB08A5A);const cp=[];for(let i=0;i<9;i++){const x=3.5+(i%3)*1.05+(i%2)*.1,y=1.45+Math.floor(i/3)*.42;K.pic(x,y,zb+.006,.3,.2,"card",{x:1});K.box(x,y+.07,zb+.015,.025,.025,.012,0xC0392B,{x:1});cp.push([x,y+.07])}
      [[0,4],[4,8],[1,5],[2,4],[3,7],[6,4]].forEach(([a,b])=>K.rod(cp[a][0],cp[a][1],zb+.02,cp[b][0],cp[b][1],zb+.02,.008,0xB0302A,{x:1}));
      /* передвижная доска между тезисами слева */
      K.box(-5.2,1.0,-11.7,1.7,1.15,.04,0xD0D3D6);K.pic(-5.2,1.575,-11.675,1.6,1.05,"schema2",{});[-1,1].forEach(s=>{K.box(-5.2+s*.84,0,-11.7,.04,2.2,.04,0x777777);K.box(-5.2+s*.84,0,-11.7,.06,.04,.5,0x555555)});K.solid(-6.06,-4.34,-11.45,-11.95,2.2)})();

    /* Святилище: лавки рядами к часам, подсвечники по углам, ниши с лампадой, тяжёлые драпировки */
    (function(){const K=PROPS.kit("sv");const cz=-7;
      [[-2.9],[2.9],[-4.0],[4.0]].forEach(([x])=>{K.box(x,.4,cz,.42,.05,1.7,0x3A2A22);[-1,1].forEach(s=>K.box(x,0,cz+s*.7,.36,.4,.06,0x2A1E18));K.solid(x-.21,x+.21,cz+.85,cz-.85,.45)});
      [[-6.6,-1.6],[6.6,-1.6],[-6.6,-12.4],[6.6,-12.4]].forEach(([x,dz],i)=>{K.cyl(x,0,dz,.18,.04,0x2A221C);K.cyl(x,0,dz,.025,1.0,0x5A4632);K.cyl(x,1.0,dz,.24,.03,0x6B5638);
        for(let c=0;c<7;c++){const a=c/7*Math.PI*2,r=c?.15:0,hh=.1+((c+i)%3)*.06,cx=x+Math.sin(a)*r,cz_=dz+Math.cos(a)*r;K.cyl(cx,1.03,cz_,.018,hh,0xEDE3CC);K.cone(cx,1.03+hh,cz_,.014,.045,0xFFC870,{blink:"flame",em:1.4})}
        K.solid(x-.25,x+.25,dz+.25,dz-.25,1.2)});
      [-1,1].forEach(s=>{const x=s*7.96,ry=s>0?-Math.PI/2:Math.PI/2;
        K.box(x,.5,cz,.06,2.0,1.3,0x4A3C34);K.pic(x-s*.035,1.4,cz,.95,1.6,"glow",{ry,em:.9});K.cyl(x-s*.25,.9,cz,.2,.03,0x4A3C34);K.cyl(x-s*.25,.93,cz,.05,.06,0xC9A27A);K.cone(x-s*.25,.99,cz,.02,.06,0xFFD890,{blink:"flame",em:1.5});
        for(let f=0;f<6;f++){const dd=.11+(f%2)*.08,c=f%2?0x4A1418:0x3A0F12;K.box(x-s*dd/2,0,cz+.9+f*.17,dd,4.5,.18,c);K.box(x-s*dd/2,0,cz-.9-f*.17,dd,4.5,.18,c)}});
      [-1,1].forEach(s=>{for(let f=0;f<7;f++)K.box(s*(1.9+f*.18),0,-.3-(f%2)*.06,.18,4.5,.12+(f%2)*.06,f%2?0x4A1418:0x3A0F12)});
      for(let i=0;i<7;i++){const x=-.9+i*.3;K.cyl(x,0,-13.3,.04,.07,0xB8432E,{x:1});K.cone(x,.07,-13.3,.013,.035,0xFFC870,{blink:"flame",em:1.3,x:1})}})();

    /* Двойники: серверная за стеклом (стойки с мигающими индикаторами), кабели по полу к пульту,
       пульт с тремя мониторами и станцией, два операторских кресла */
    (function(){const K=PROPS.kit("dv");
      const rack=(x,dz)=>{K.box(x,0,dz,.62,2.1,.9,0x1A1D21);K.box(x,0,dz+.452,.6,2.08,.006,0x39424B);K.quad(x+.12,1.95,dz+.459,.22,.05,0x7FE0C8,{em:.7});for(let r=0;r<9;r++)K.box(x,.15+r*.21,dz+.456,.54,.03,.004,0x0E1013);
        for(let r=0;r<8;r++)for(let c=0;c<3;c++)K.quad(x-.2+c*.06,.25+r*.21,dz+.459,.025,.025,(r+c)%5?0x4CFF8A:0xFFB347,{blink:"led",em:1.3})};
      [-7.3,-6.62,-5.94,-5.26,-4.58,-3.9].forEach(x=>rack(x,-17.5));[-7.3,-6.62,-5.94,-5.26].forEach(x=>rack(x,-15.55));
      K.box(-5.6,2.12,-17.5,4.1,.06,.3,0x3A3F45);K.box(-5.4,4.45,-16.0,4.2,.05,.12,0x9FF2DC,{em:.85});K.pic(-5.4,.016,-16.3,4.6,3.2,"glow",{rx:-Math.PI/2,glass:1,tint:0x5FD8C0,em:.5});K.box(-5.6,2.12,-15.55,2.8,.06,.3,0x3A3F45);for(let i=0;i<5;i++)K.rod(-7.3+i*.9,2.18,-17.4,-7.3+i*.9,4.6,-17.4,.03,0x101214,{x:1});
      /* стеклянная перегородка с переплётами */
      K.box(-5.49,0,-14.4,4.98,4.6,.04,0x9FD6E6,{glass:1});K.box(-3.0,0,-16.12,.04,4.6,3.45,0x9FD6E6,{glass:1});
      for(let i=0;i<=4;i++)K.box(-7.98+i*1.245,0,-14.4,.05,4.6,.06,0x2A2F35);for(let i=1;i<=2;i++)K.box(-3.0,0,-14.4-i*1.15,.06,4.6,.05,0x2A2F35);K.box(-5.49,2.4,-14.4,4.98,.06,.07,0x2A2F35);
      K.solid(-8,-2.95,-14.35,-14.45,4.6);K.solid(-3.05,-2.95,-14.4,-18,4.6);K.solid(-7.65,-3.55,-17.05,-18,2.1);K.solid(-7.65,-4.9,-15.1,-16,2.1);
      /* кабели по полу от серверной к пульту — плоские, не мешают ходить */
      [[0,0x15181B],[.07,0x2A3B4A],[.13,0x3A2A2A]].forEach(([o,c])=>{K.box(-2.9,0,-15.1-o,.05,.022,.05,c);K.rod(-2.85,.012,-15.1-o,3.2,.012,-15.25-o,.04,c);K.rod(3.2,.012,-15.25-o,6.2,.012,-11.4+o,.04,c);K.rod(6.2,.012,-11.4+o,6.7,.012,-10.9,.04,c)});
      /* пульт оператора: три монитора с журналом, станция с индикатором ожидания (122, 147) */
      K.box(7.05,.72,-9.6,.9,.05,2.4,0x2A2D31);K.box(7.05,0,-9.6,.85,.72,.06,0x1E2124);[-1,1].forEach(s=>K.box(7.05,0,-9.6+s*1.15,.85,.72,.06,0x1E2124));K.solid(6.6,7.5,-8.4,-10.8,.77);
      [-8.85,-9.6,-10.35].forEach((dz,i)=>{K.box(7.25,.77,dz,.18,.02,.22,0x111111);K.box(7.25,.79,dz,.04,.22,.04,0x111111);K.box(7.22,.97,dz,.04,.36,.62,0x0D0F11,{ry:(i-1)*-.18});K.pic(7.195,1.15,dz,.56,.32,"term",{ry:-Math.PI/2+(i-1)*-.18,em:1})});
      K.box(6.75,.77,-8.6,.3,.08,.2,0xEDEFF0);K.box(6.6,.82,-8.6,.004,.015,.015,0x4CFF8A,{blink:"led",em:1.5});K.box(6.8,.77,-10.6,.32,.015,.18,0x2B2E32,{x:1});
      [[5.95,-9.0],[5.95,-10.2]].forEach(([x,dz])=>{K.cyl(x,0,dz,.28,.04,0x222222,{seg6:1});K.cyl(x,0,dz,.03,.46,0x555555);K.box(x,.46,dz,.46,.07,.46,0x2F3338);K.box(x-.21,.53,dz,.06,.55,.44,0x2F3338);K.solid(x-.25,x+.25,dz+.25,dz-.25,1.08)})})();

    /* Отец: на столе фотографии, очки, магнитофон с кассетой, квитанции; кресло у окна, столик с шахматами и
       стаканом с ложкой; витрина с сервизом и листом «96»; часы с маятником над стулом; занавески и вечерний свет из окна */
    (function(){const K=PROPS.kit("ot");const D=-6;
      [[.62,-5.72,0],[.84,-5.86,1]].forEach(([x,dz,i])=>{K.box(x,.83,dz,.18,.22,.02,0x3A2A1C,{rx:-.2,ry:-.3+i*.25});K.pic(x+.004,.94,dz+.016,.14,.17,"photos",{rx:-.2,ry:-.3+i*.25,sub:[i,4]})});
      [-1,1].forEach(s=>K.cyl(.52+s*.06,.84,D-.32,.032,.006,0x1A1A1A,{rx:Math.PI/2}));K.box(.52,.84,D-.32,.03,.008,.008,0x1A1A1A);[-1,1].forEach(s=>K.box(.52+s*.09,.836,D-.24,.005,.005,.12,0x1A1A1A));
      K.box(-.62,.83,D+.2,.34,.12,.2,0x2A2724);[-1,1].forEach(s=>K.cyl(-.62+s*.07,.95,D+.2,.035,.012,0x8A8A88));K.box(-.62,.9,D+.302,.14,.05,.004,0x9AB0B8);
      for(let i=0;i<4;i++)K.box(-.62,.83+i*.004,D-.3,.22,.003,.12,[0xF1E9D6,0xE8DEC6,0xF4EEDF,0xEADFC8][i],{ry:(i-1.5)*.12,x:1});
      /* часы с маятником над стулом у стены (14, 34) */
      K.box(-7.93,1.7,-9,.12,.95,.42,0x5A3A22);K.pic(-7.865,2.42,-9,.3,.3,"clock",{ry:Math.PI/2});K.box(-7.87,1.82,-9,.01,.4,.02,0xC9A54A);K.cyl(-7.87,1.8,-9,.06,.012,0xC9A54A,{rz:Math.PI/2});
      /* кресло у окна (41) — сиденье низкое, спинка и подлокотники держат */
      const ax=6.3,az=-14.95;K.box(ax,0,az,.72,.42,.7,0x6E3B2A);K.box(ax,.42,az+.05,.62,.06,.6,0x7E4632);K.box(ax,0,az-.42,.92,1.0,.2,0x6E3B2A);[-1,1].forEach(s=>K.box(ax+s*.42,0,az,.12,.62,.7,0x6E3B2A));
      K.box(ax,.78,az-.33,.4,.25,.02,0xEDE6D6,{x:1});K.box(ax+.42,.62,az+.05,.13,.02,.5,0x8A6A3A,{x:1});
      K.solid(ax-.3,ax+.3,az+.35,az-.32,.48);K.solid(ax-.48,ax+.48,az-.32,az-.52,1.0);K.solid(ax-.48,ax-.36,az+.35,az-.32,.62);K.solid(ax+.36,ax+.48,az+.35,az-.32,.62);
      /* столик под окном (41): шахматы (39), стакан с ложкой (151) */
      K.cyl(4.6,.58,-15.05,.32,.04,0x5A3A22);K.cyl(4.6,0,-15.05,.03,.58,0x3A2616);K.cyl(4.6,0,-15.05,.18,.03,0x3A2616);K.solid(4.28,4.92,-14.73,-15.37,.62);
      K.pic(4.55,.623,-15.0,.26,.26,"chess",{rx:-Math.PI/2});for(let i=0;i<6;i++)K.cyl(4.45+(i%3)*.08,.623,-14.9-Math.floor(i/3)*.18,.012,.035+(i%2)*.02,i<3?0xF0E6CC:0x2A1E14,{x:1});
      K.cyl(4.82,.623,-15.18,.03,.09,0xD6E6EA,{x:1});K.rod(4.82,.66,-15.18,4.85,.75,-15.16,.006,0xB8B8B8,{x:1});
      /* витрина с сервизом на девяносто шесть предметов (7, 151), лист «96» за стеклом, банка варенья (47) */
      const vx=7.72,vz=-7.9;K.box(vx,0,vz,.5,1.95,1.4,0x4A3020);K.box(vx-.27,.05,vz,.04,1.82,1.32,0xD8E8EE,{glass:1});
      for(let s=0;s<3;s++){const y=.55+s*.45;K.box(vx,y,vz,.44,.02,1.32,0x5A3A26);for(let p=0;p<5;p++)K.cyl(vx+.08,y+.02+.09,vz-.5+p*.25,.09,.012,0xF4F1EA,{rz:Math.PI/2});
        for(let c=0;c<4;c++)K.cyl(vx-.1,y+.02,vz-.45+c*.3,.035,.06,0xF4F1EA,{x:1})}
      K.cyl(vx-.08,.2,vz+.45,.05,.1,0x8A2A2A,{x:1});K.cyl(vx-.08,.3,vz+.45,.052,.015,0xE8E0C8,{x:1});K.pic(vx-.22,.33,vz-.2,.18,.2,"l96",{ry:-Math.PI/2+.15});K.solid(7.45,8,vz+.72,vz-.72,1.95);
      /* занавески по бокам окна и тёплое пятно на полу */
      [-1,1].forEach(s=>{for(let f=0;f<3;f++)K.box(4.6+s*(.78+f*.12),.55,-15.88+(f%2)*.05,.13,2.75,.07,0x7A2E22)});K.box(4.6,3.33,-15.85,2.2,.03,.03,0x3A2A1C);K.box(4.6,1.04,-15.77,1.4,.05,.2,0x4A3727);
      K.pic(4.6,.016,-14.0,1.6,2.4,"glow",{rx:-Math.PI/2,glass:1,tint:0xFFC890});
      /* торшер у кресла */
      K.cyl(6.95,0,-14.0,.13,.03,0x2A2A2A);K.cyl(6.95,0,-14.0,.015,1.45,0x2A2A2A);K.cone(6.95,1.4,-14.0,.2,.26,0xE8C890,{em:.9});K.solid(6.8,7.1,-13.85,-14.15,1.6);
      /* тапки у двери (34, 96) */
      K.box(2.0,0,-.9,.12,.06,.27,0x6A4A3A,{x:1});K.box(2.18,0,-.92,.12,.06,.27,0x6A4A3A,{x:1,ry:.1})})();

    /* Семья: обеденный стол со стульями (один отодвинут), холодильник с рисунком и расписанием, окно с градусником,
       батарея, сушилка с купальником и носками, кубики-город на ковре, спортивная сумка, торшер, гирлянда, фото */
    (function(){const K=PROPS.kit("se");
      K.box(4.9,.72,-13.5,1.6,.05,.9,0x8A6440);[[-.72,-.38],[.72,-.38],[-.72,.38],[.72,.38]].forEach(([a,b])=>K.box(4.9+a,0,-13.5+b,.05,.72,.05,0x5A3E26));K.box(4.9,.775,-13.5,1.5,.004,.82,0xF4EEDF);
      K.solid(4.1,5.7,-13.05,-13.95,.77);
      const chair=(x,dz,fz,ry)=>{K.box(x,.44,dz,.42,.05,.42,0x6E5038,{ry});K.box(x+Math.sin(ry)*.19*fz,.49,dz+Math.cos(ry)*.19*fz,.42,.46,.04,0x6E5038,{ry});[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>K.box(x+a*.18,0,dz+b*.18,.035,.44,.035,0x4E3826));const e=ry?.3:.22;K.solid(x-e,x+e,dz+e,dz-e,.95)};
      chair(4.5,-12.62,1,0);chair(5.3,-12.62,1,0);chair(4.5,-14.38,-1,0);chair(5.3,-14.38,-1,0);chair(6.55,-12.3,1,.55);
      [[4.4,-13.3],[5.0,-13.7],[5.45,-13.25]].forEach(([x,dz],i)=>{K.cyl(x,.78,dz,.045,.09,[0xF2F2EE,0x9AB8D6,0xE8D9B0][i],{x:1});if(i===1)K.box(x+.05,.8,dz,.02,.04,.012,0x9AB8D6,{x:1})});K.cyl(4.75,.78,-13.6,.12,.015,0xF4F1EA,{x:1});K.sph(4.75,.83,-13.6,.06,0xD9A45A,{x:1});
      /* холодильник: рисунок (54) и расписание недели (54, 56), фотография (55) */
      K.box(7.6,0,-14.55,.7,1.75,.7,0xEEEEEA);K.box(7.24,1.05,-14.55,.01,.02,.6,0xBFC3C7);K.pic(7.244,1.4,-14.4,.24,.24,"drawing",{ry:-Math.PI/2});K.pic(7.244,.75,-14.6,.26,.26,"schedule",{ry:-Math.PI/2});K.pic(7.244,1.42,-14.75,.12,.14,"photos",{ry:-Math.PI/2,sub:[2,4]});
      K.solid(7.25,7.95,-14.2,-14.9,1.75);
      /* окно, которое не открывается (132), градусник на подоконнике (130), батарея (54) */
      const zb=-15.84;K.pic(-4.6,1.85,zb,1.4,1.4,"winDay",{em:.95});K.box(-4.6,1.1,zb+.03,1.52,.06,.06,C_.white);K.box(-4.6,2.56,zb+.03,1.52,.06,.06,C_.white);[-1,0,1].forEach(s=>K.box(-4.6+s*.73,1.1,zb+.03,.06,1.5,.06,C_.white));
      K.box(-4.6,1.04,zb+.11,1.7,.05,.24,0xE2DDD2);K.box(-4.1,1.09,zb+.12,.03,.16,.012,0xF4F4F4,{x:1});K.box(-4.1,1.11,zb+.127,.006,.08,.004,0xC0392B,{x:1});
      for(let i=0;i<9;i++)K.box(-5.16+i*.14,.18,zb+.06,.07,.6,.09,0xEDEDEA);[-1,1].forEach(s=>{for(let f=0;f<3;f++)K.box(-4.6+s*(.85+f*.12),.6,zb+.06+(f%2)*.04,.13,2.4,.06,0xC9A9A0)});
      K.pic(-4.6,.017,-14.6,1.4,1.6,"glow",{rx:-Math.PI/2,glass:1,tint:0xFFF0D0,x:1});
      /* сушилка с купальником (34), белыми носками (54, 130), полотенцем */
      const dx=-6.4,dz=-13.6;[-1,1].forEach(s=>{K.rod(dx-.58,0,dz+s*.24,dx-.58,1.0,dz,.025,0xC9CED2);K.rod(dx+.58,0,dz+s*.24,dx+.58,1.0,dz,.025,0xC9CED2)});for(let i=0;i<4;i++)K.rod(dx-.58,1.0-i*.04,dz+(i%2?-.06:.06)*(i+1)/2,dx+.58,1.0-i*.04,dz+(i%2?-.06:.06)*(i+1)/2,.012,0xC9CED2);
      K.box(dx-.25,.6,dz+.03,.28,.4,.02,0x1F8A9A);K.box(dx+.05,.82,dz-.03,.06,.16,.02,0xF8F8F8);K.box(dx+.14,.82,dz-.03,.06,.16,.02,0xF8F8F8);K.box(dx+.38,.45,dz+.05,.3,.55,.02,0xE8B24A);K.solid(dx-.62,dx+.62,dz+.3,dz-.3,1.05);
      /* кубики и «город» на ковре (34) — мелкие, не мешают */
      for(let i=0;i<14;i++){const c=[0xC0392B,0x2E6DB4,0xE0B020,0x3C9A4A][i%4],s=.08+(i%3)*.02,st=i>10?1:0;K.box(1.45+(i%5)*.15,st?.1:0,-7.1-Math.floor(i/5)*.17,s,s,s,c,{ry:i*.4,x:1})}K.box(1.9,0,-7.55,.1,.32,.1,0xE0B020,{x:1});
      /* спортивная сумка у входа (56) — низкая */
      K.box(2.8,0,-1.3,.6,.3,.32,0x23395B);K.rod(2.6,.3,-1.3,2.8,.46,-1.3,.02,0x111111);K.rod(2.8,.46,-1.3,3.0,.3,-1.3,.02,0x111111);K.solid(2.5,3.1,-1.14,-1.46,.3);
      /* торшер у дивана */
      K.cyl(1.95,0,-10.45,.14,.03,0x2A2A2A);K.cyl(1.95,0,-10.45,.015,1.5,0x2A2A2A);K.cone(1.95,1.45,-10.45,.22,.28,0xF3E2C0,{em:.95});K.solid(1.8,2.1,-10.3,-10.6,1.7);
      /* гирлянда флажков над дверью и два шара у отодвинутого стула — праздник (35, 53) */
      const fl=[0xC0392B,0xE0B020,0x2E6DB4,0x3C9A4A,0xE07A9A];let pv=null;for(let i=0;i<=24;i++){const t=i/24,x=-6.4+t*12.8,y=3.9-.42*(1-(2*t-1)*(2*t-1)),z=-15.78;if(pv)K.rod(pv[0],pv[1],z,x,y,z,.01,0xEDE6D6);pv=[x,y];if(i<24)K.box(x+.27,y-.14,z+.01,.14,.14,.01,fl[i%5],{rz:Math.PI/4})}
      [[6.75,-12.1,1.75,0xE07A9A],[6.9,-12.35,1.6,0x2E6DB4]].forEach(([x,dz,y,c])=>{K.sph(x,y,dz,.16,c,{x:1});K.rod(x,y-.16,dz,6.6,.9,-12.3,.005,0xEDEDED,{x:1})});
      /* фотографии на правой стене над постаментами (35 «Фотографии») */
      [[-4.0,2.1,0],[-4.75,2.25,1],[-5.4,2.05,3]].forEach(([dz,y,i])=>{K.box(7.97,y-.2,dz,.03,.4,.32,0x2B2018);K.pic(7.952,y,dz,.26,.34,"photos",{ry:-Math.PI/2,sub:[i,4]})})})();

    /* N: тёмная комната — стол с кюветами и увеличителем, красный фонарь над ним, контактные листы;
       две верёвки с отпечатками на прищепках; штатив с камерой; ящики «верх», уровень и скотч, каталоги в плёнке; пустая рама */
    (function(){const K=PROPS.kit("n");
      K.box(-7.64,0,-8.7,.68,.88,3.0,0x1C1C1E);K.box(-7.64,.88,-8.7,.72,.04,3.04,0x2E2E30);K.solid(-8,-7.28,-7.2,-10.2,.92);
      [-7.5,-8.2,-8.9].forEach((dz,i)=>{K.box(-7.62,.92,dz,.34,.05,.44,[0xEDEDED,0xEDEDED,0xD8D8D8][i]);K.box(-7.62,.955,dz,.3,.004,.4,0x3A1210,{em:.9});if(i===1)K.box(-7.62,.96,dz,.18,.002,.24,0xE8E4DC)});
      K.box(-7.6,.92,-9.75,.42,.03,.5,0x2A2A2A);K.box(-7.75,.95,-9.75,.06,1.05,.06,0x8A8A8A);K.box(-7.6,1.45,-9.75,.3,.24,.26,0x222222);K.cyl(-7.6,1.27,-9.75,.07,.18,0x111111);K.box(-7.6,1.69,-9.75,.22,.12,.2,0x333333);
      K.box(-7.9,2.15,-8.6,.12,.14,.3,0x2A0A08);K.box(-7.83,2.17,-8.6,.02,.1,.24,0xFF2A12,{em:1.6});K.pic(-7.6,.94,-8.6,.8,1.6,"glow",{rx:-Math.PI/2,glass:1,tint:0xFF3A20,x:1});
      [[-7.6,0],[-8.1,1],[-8.6,0],[-9.1,1]].forEach(([dz,i],k)=>K.pic(-7.965,1.55+(k%2)*.36,dz-.4,.42,.26,"contact",{ry:Math.PI/2,x:k>1,em:.65,tint:0xFFA898}));
      /* верёвки с отпечатками на прищепках */
      [-6.6,-11.8].forEach((dz,li)=>{K.rod(-6.9,2.95,dz,6.9,2.95,dz,.008,0xD8D2C6);[-1,1].forEach(s=>K.box(s*6.95,2.9,dz,.04,.1,.04,0x777777));
        for(let i=0;i<9;i++){const x=-5.6+i*1.4+(li?.5:0),port=(i+li)%2===0,w=port?.3:.4,hh=port?.4:.3,sub=[(i+li*2)%4,4];
          const yc=2.91-hh/2;K.pic(x,yc,dz+.003,w,hh,"prints",{sub,em:.75,tint:0xFFA898});K.box(x,yc-hh/2,dz-.003,w,hh,.002,0xEFEDE8,{x:1});K.box(x,2.91,dz,.025,.07,.02,0xB8956A,{x:i%2===1})}});
      /* штатив с камерой */
      const tx=5.8,tz=-5.0;[[0,.35],[2.1,.35],[4.2,.35]].forEach(([a])=>K.rod(tx,1.15,tz,tx+Math.sin(a)*.32,0,tz+Math.cos(a)*.32,.025,0x2A2A2A));K.box(tx,1.15,tz,.1,.08,.1,0x2A2A2A);K.box(tx,1.23,tz,.2,.14,.12,0x151515);K.cyl(tx,1.3,tz+.11,.045,.12,0x0E0E0E,{rx:Math.PI/2});
      K.solid(tx-.3,tx+.3,tz+.3,tz-.3,1.4);
      /* ящики у правой стены: «верх» (ящик «верх»), уровень и скотч, стопка каталогов в плёнке */
      K.box(6.7,0,-16.6,.8,.5,.6,0x9C7B55);K.pic(6.7,.27,-16.297,.34,.1,"lTop",{});K.box(5.95,0,-17.0,.6,.42,.5,0xB89468);K.solid(6.3,7.1,-16.3,-16.9,.5);K.solid(5.65,6.25,-16.75,-17.25,.42);
      K.box(6.6,.5,-16.6,.6,.04,.06,0xE0B020,{x:1});K.cyl(6.95,.5,-16.7,.06,.05,0xC9B98A,{x:1});for(let i=0;i<5;i++)K.box(5.95,.42+i*.03,-17.0,.32,.028,.24,0xE8E8EC,{ry:i*.05,x:1});K.box(5.95,.42,-17.0,.34,.15,.26,0xDCEAF0,{glass:1});
      /* пустая рама, прислонённая к стене */
      K.box(7.86,.05,-14.6,.05,.9,.04,0xDAD6CE,{rz:-.1});K.box(7.86,.05,-15.3,.05,.9,.04,0xDAD6CE,{rz:-.1});K.box(7.82,.06,-14.95,.05,.04,.74,0xDAD6CE,{rz:-.1});K.box(7.9,.88,-14.95,.05,.04,.74,0xDAD6CE,{rz:-.1});K.solid(7.6,8,-14.5,-15.4,1.0)})();

    /* Клуб: сцена-ступенька с экраном (созвон, одна клетка — чёрный квадрат, 136), кафедра с ноутбуком, проектор,
       два ряда стульев, кофейный угол (45), доска объявлений, полка с книгой плашмя (136), ноутбуки на стульях (111) */
    (function(){const K=PROPS.kit("kl");
      K.box(4.6,0,-15.1,4.4,.18,1.8,0x3A3F46);K.box(4.6,.18,-14.2,4.4,.004,.04,0xE8E2D2);K.solid(2.4,6.8,-14.2,-16,.18);
      K.box(4.6,3.5,-15.8,4.2,.12,.12,0x22262B);K.pic(4.6,2.35,-15.83,4.0,2.25,"call",{em:1});
      K.box(6.15,.18,-14.75,.55,1.05,.42,0x2A2D31);K.box(6.15,1.23,-14.7,.6,.03,.5,0x2A2D31,{rx:.15});K.box(6.15,1.26,-14.7,.32,.015,.22,0x2B2E32,{x:1});K.pic(6.15,1.36,-14.82,.3,.18,"term",{rx:-.2,em:.9,x:1});K.solid(5.85,6.45,-14.5,-15.0,1.25);
      K.rod(4.6,4.2,-9.5,4.6,3.9,-9.5,.04,0x333333);K.box(4.6,3.72,-9.5,.42,.16,.36,0xE8E8E8);K.cyl(4.6,3.8,-9.72,.06,.06,0xFFFFFF,{rx:Math.PI/2,em:1.3});
      for(let r=0;r<2;r++)for(let c=0;c<5;c++){const x=3.0+c*.85,dz=-11.2-r*1.2;K.box(x,.44,dz,.44,.05,.44,0x2E4A6B);K.box(x,.49,dz+.2,.44,.42,.04,0x2E4A6B);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>K.box(x+a*.19,0,dz+b*.19,.03,.44,.03,0x777777));
        if((r*5+c)%4===1){K.box(x,.49,dz-.02,.32,.015,.22,0x2B2E32,{x:1});K.box(x,.5,dz+.09,.32,.2,.012,0x2B2E32,{rx:-.3,x:1})}}
      K.solid(2.78,6.62,-10.98,-11.42,.93);K.solid(2.78,6.62,-12.18,-12.62,.93);
      /* кофейный угол */
      K.box(-7.67,0,-11.7,.62,.9,2.2,0x5A4A3C);K.box(-7.67,.9,-11.7,.66,.05,2.24,0xE6E2DA);K.solid(-8,-7.34,-10.6,-12.8,.95);
      K.box(-7.75,.95,-11.0,.36,.45,.34,0x1E2124);K.box(-7.56,1.05,-11.0,.02,.14,.16,0x2A2D31);K.box(-7.56,1.3,-11.12,.004,.03,.03,0xFF5A3C,{em:1.4});K.cyl(-7.7,.95,-11.65,.13,.42,0xB8BCC0);K.cyl(-7.7,1.37,-11.65,.06,.04,0x333333);
      for(let i=0;i<5;i++)K.cyl(-7.62,.95+i*.04,-12.15,.045,.04,0xF4F1EA,{x:1});K.cyl(-7.5,.95,-12.45,.045,.09,0xF4F1EA,{x:1});K.cyl(-7.5,1.04,-12.45,.041,.003,0x3A2214,{x:1});
      /* доска объявлений: пустые листы с полосками, заголовок */
      K.box(7.965,1.05,-3.4,.03,1.25,2.2,0xB08A5A);K.pic(7.945,2.5,-3.4,.9,.22,"lNotice",{ry:-Math.PI/2});for(let i=0;i<6;i++)K.pic(7.945,1.45+Math.floor(i/3)*.5,-2.75-(i%3)*.62+(i%2)*.06,.32,.4,i%2?"sheet":"card",{ry:-Math.PI/2+(i%3-1)*.04,x:i>3});
      /* полка с книгой плашмя (136) */
      K.box(7.78,0,-11.5,.36,1.5,1.8,0x6E5038);for(let s=0;s<3;s++){K.box(7.76,.05+s*.48,-11.5,.32,.03,1.74,0x8A6A4A);for(let b=0;b<9;b++)if(!(s===1&&b>5))K.box(7.78,.08+s*.48,-12.25+b*.17,.24,.3+((b*5+s)%3)*.05,.12,[0x7A2E22,0x2E4A6B,0x3C6A4A,0xB89468,0x4A3A5A][(b+s)%5],{x:s===2})}
      K.box(7.78,.56,-11.25,.26,.05,.34,0xC0392B);K.solid(7.58,8,-10.6,-12.4,1.5)})();

    /* Красота: в галерее — кадки с растениями, столбики с канатами вдоль стен, две лавки лицом к стенам;
       в супермаркете — два стеллажа-острова с безымянным товаром, ценники, корзины, тележка, табличка «Касса»;
       у настенных полок появилась коллизия */
    (function(){const K=PROPS.kit("kr");
      const plant=(x,dz)=>{K.cyl(x,0,dz,.28,.5,0x6A5040);K.cyl(x,.5,dz,.26,.02,0x3A2A1A);for(let i=0;i<5;i++)K.cone(x+Math.sin(i*2.4)*.08,.5+i*.12,dz+Math.cos(i*2.4)*.08,.3-i*.04,.5,[0x3F6A3A,0x4F7A42,0x365E33][i%3]);K.solid(x-.3,x+.3,dz+.3,dz-.3,1.4)};
      plant(-3.0,-1.4);plant(3.0,-1.4);plant(-3.0,-30.4);plant(3.0,-30.4);
      [-1,1].forEach(s=>{const x=s*6.4;let pv=null;for(let i=0;i<8;i++){const dz=-1.2-i*4.2;K.cyl(x,0,dz,.14,.03,0xB8962E);K.cyl(x,0,dz,.03,.92,0xB8962E);K.cyl(x,.92,dz,.05,.06,0xB8962E);
        if(pv!==null){for(let k=0;k<3;k++){const a=pv+(dz-pv)*k/3,b=pv+(dz-pv)*(k+1)/3,ya=.85-.12*Math.sin(Math.PI*k/3),yb=.85-.12*Math.sin(Math.PI*(k+1)/3);K.rod(x,ya,a,x,yb,b,.03,0x7A1E1E)}}pv=dz}
        K.solid(x-.06,x+.06,-1.2,-30.6,.95)});
      [[-4.9,-7.2],[4.9,-24.0]].forEach(([x,dz])=>{K.box(x,.38,dz,.5,.05,1.6,0x6E1C22);[-1,1].forEach(s=>K.box(x,0,dz+s*.65,.44,.38,.08,0x3A2A22));K.solid(x-.25,x+.25,dz+.8,dz-.8,.43)});
      /* настенные полки (уже были) — теперь держат */
      [-1,1].forEach(s=>K.solid(s>0?7.18:-8,s>0?8:-7.18,-30.5,-59.5,2.6));
      for(let i=7;i<14;i++){const dz=-3-i*4.2;[-1,1].forEach(s=>{for(let k=0;k<5;k++)K.quad(s*7.17,.33+k*.5,dz,3.8,.045,0xF4F4F0,{x:1,ry:s>0?-Math.PI/2:Math.PI/2})})}
      /* острова с товаром: коробки и банки без надписей; ценники полосой */
      const pal=[0x6b8fb0,0xb06b4a,0xd2b84a,0x7a9b6a,0x9a6a9b,0x4a6a8a,0xc94a3a,0xe0d6c0,0xF2F2EE];
      [-3.4,3.4].forEach((gx,gi)=>{const len=13,dz0=-42.5;K.box(gx,0,dz0,.5,1.9,len,0xB9BCC0);[-1,1].forEach(s=>{for(let k=0;k<4;k++){const y=.15+k*.46;K.box(gx+s*.38,y,dz0,.3,.03,len,0xC9CCCF);K.quad(gx+s*.54,y,dz0,len,.045,0xF4F4F0,{x:1,ry:s>0?Math.PI/2:-Math.PI/2});
          for(let j=0;j<10;j++){const c=pal[(j*3+k*5+gi*7+(s>0?2:0))%9],hh=.14+((j+k+gi)%4)*.05,bz=dz0-len/2+.65+j*1.3;K.box(gx+s*.36,y+.03,bz,.2+(j%2)*.08,hh,.95+(j%3)*.08,c,{x:j%3===2})}}});
        [-1,1].forEach(e=>K.box(gx,0,dz0+e*(len/2+.05),1.1,1.95,.08,0xA8ACB0));K.solid(gx-.56,gx+.56,dz0+len/2+.1,dz0-len/2-.1,1.95)});
      /* корзины стопкой у входа в магазин — низкие */
      for(let i=0;i<5;i++)K.box(5.4,i*.07,-33.4,.42,.07,.32,0xC0392B);K.rod(5.2,.4,-33.4,5.6,.4,-33.4,.02,0x222222);K.solid(5.19,5.61,-33.24,-33.56,.4);
      /* тележка у кассы */
      const cx=-4.3,cz=-60.0;K.box(cx,.45,cz,.52,.45,.82,0xB8BCC0,{glass:1});[[-1,0],[1,0]].forEach(([s])=>K.box(cx+s*.26,.45,cz,.02,.45,.82,0x9AA1A8));K.box(cx,.45,cz,.52,.02,.82,0x9AA1A8);K.box(cx,.9,cz,.52,.02,.82,0x9AA1A8);K.box(cx,.98,cz+.47,.56,.03,.03,0x2A2A2A);
      [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{K.box(cx+a*.22,.06,cz+b*.36,.02,.4,.02,0x9AA1A8);K.cyl(cx+a*.22,0,cz+b*.36,.05,.03,0x111111,{rz:Math.PI/2})});K.solid(cx-.3,cx+.3,cz+.5,cz-.45,1.0);
      /* табличка «Касса» над кассой */
      K.rod(2.6,8.5,-60.0,2.6,2.95,-60.0,.015,0x333333);K.box(2.6,2.55,-60.0,1.0,.42,.04,0xB8322A);K.pic(2.6,2.76,-59.975,.96,.38,"lCash",{em:.95});K.pic(2.6,2.76,-60.025,.96,.38,"lCash",{ry:Math.PI,em:.95})})();

    const PR=PROPS.finish();
    stopFns.push(()=>{PR.forEach(p=>[...p.core,...p.extra].forEach(m=>m.geometry.dispose()));Object.values(PROPS.M).forEach(m=>m.dispose());Object.values(PROPS.G).forEach(g=>g.dispose());PROPS.atlasTex.dispose()});
    /* видимость: текущий зал и соседние (дальше обстановку прячет туман); в облегчённом режиме — только текущий зал и без мелочей. Мигание индикаторов и огоньков свечей */
    let propHall=-9,propLite=null;
    function stepProps(hi,t,dt){if(hi!==propHall||lite!==propLite){propHall=hi;propLite=lite;PR.forEach(p=>{const d=Math.abs(p.hi-hi);p.core.forEach(m=>m.visible=d<=(lite?0:1));p.extra.forEach(m=>m.visible=d<=1&&!lite)})}
      if(reduce)return;stepProps.acc=(stepProps.acc||0)+dt;if(stepProps.acc<(lite?.5:.12))return;stepProps.acc=0;
      PR.forEach(p=>{if(!p.blink||Math.abs(p.hi-hi)>1)return;const ca=p.blink.mesh.geometry.attributes.color;let ch=false;
        p.blink.items.forEach(it=>{const fl=it.blink==="flame";if(!fl&&Math.random()>.18)return;const k=fl?.72+Math.random()*.38:(Math.random()<.7?it.em:it.em*.18);
          for(let i=0;i<it.vn;i++){const j=(it.v0+i)*3;ca.array[j]=it.c.r*k;ca.array[j+1]=it.c.g*k;ca.array[j+2]=it.c.b*k}ch=true});if(ch)ca.needsUpdate=true})}

    /* стоят и дышат; ближе нескольких метров — поворачивают голову (и, если нужно, корпус) к посетителю.
       Видимы только в своём и соседних залах; в облегчённом режиме следят взглядом только вблизи */
    function stepDbl(dt,t,hi){const trackR=lite?3:6,kh=1-Math.exp(-dt*5);
      NPC.forEach(n=>{const dx=P.x-n.x,dz=P.z-n.z,d=Math.hypot(dx,dz),vis=Math.abs(n.hi-hi)<=1&&d<26;n.g.visible=vis;if(!vis)return;
        const same=n.hi===hi;
        if(!reduce){const b=Math.sin(t*1.5+n.ph);n.body.position.y=b*.01;n.body.scale.set(1+b*.006,1,1+b*.006);n.mk.position.y=1.92+Math.sin(t*2+n.ph)*.04;n.mk.rotation.y=t*1.1+n.ph}
        let hy=0;
        if(same&&d<trackR&&d>.2){const want=Math.atan2(-dx,-dz),rel=angDiff(n.g.rotation.y,want);hy=Math.max(-.9,Math.min(.9,rel));
          if(Math.abs(rel)>.75)n.g.rotation.y+=angDiff(n.g.rotation.y,want)*(1-Math.exp(-dt*1.6))}
        else n.g.rotation.y+=angDiff(n.g.rotation.y,n.rest)*(1-Math.exp(-dt*.8));
        n.head.rotation.y+=(hy-n.head.rotation.y)*kh;
        const lv=same&&d<7;n.lab.visible=lv;if(lv)n.lab.material.opacity=Math.max(0,Math.min(1,(7-d)/2))})}

    /* ---------- этап 2: воздух залов, лампы, найденное, подсветка, карта, название зала ---------- */
    /* воздух: полусферный и рассеянный свет и туман плавно перетекают у проёмов (±2,5 м) и после телепорта */
    const ATG=HALLZ.map(h=>{const A=AIR[h.k];return{sky:new T.Color(A.sky),gnd:new T.Color(A.gnd),hi:A.hi,amb:new T.Color(A.amb),ai:A.ai,fog:new T.Color(A.fog),fn:A.fn,ff:A.ff}});
    const cloneAir=a=>({sky:a.sky.clone(),gnd:a.gnd.clone(),hi:a.hi,amb:a.amb.clone(),ai:a.ai,fog:a.fog.clone(),fn:a.fn,ff:a.ff});
    const AC=cloneAir(ATG[0]),TG=cloneAir(ATG[0]);let airSnap=true;
    function airTarget(zz){const i=hallAt(zz),h=HALLZ[i];let j=i,t=0;const B=2.5;
      if(i<HALLZ.length-1&&zz-h.z1<B){j=i+1;t=.5*(1-(zz-h.z1)/B)}else if(i>0&&h.z0-zz<B){j=i-1;t=.5*(1-(h.z0-zz)/B)}t=Math.max(0,Math.min(1,t));
      const a=ATG[i],b=ATG[j];["sky","gnd","amb","fog"].forEach(c=>TG[c].copy(a[c]).lerp(b[c],t));["hi","ai","fn","ff"].forEach(c=>TG[c]=a[c]+(b[c]-a[c])*t)}
    function stepAir(dt){airTarget(P.z);const k=airSnap?1:1-Math.exp(-dt*3);airSnap=false;
      ["sky","gnd","amb","fog"].forEach(c=>AC[c].lerp(TG[c],k));["hi","ai","fn","ff"].forEach(c=>AC[c]+=(TG[c]-AC[c])*k);
      hemi.color.copy(AC.sky);hemi.groundColor.copy(AC.gnd);hemi.intensity=AC.hi;amb.color.copy(AC.amb);amb.intensity=AC.ai;
      S.fog.color.copy(AC.fog);S.fog.near=AC.fn;S.fog.far=AC.ff;S.background.copy(AC.fog)}
    /* три лампы для экспонатов и фигур: у ближайших светильников; третья гаснет, пока её не сменит четвёртая — без скачков */
    const FX=[];HALLZ.forEach(h=>h.pools.forEach(p=>FX.push({x:p.x,z:p.z,y:h.H-.6,c:new T.Color(p.lc||AIR[h.k].lc),li:AIR[h.k].li*Math.min(1,p.w),dist:h.tall?20:14})));
    const fxd=FX.map((f,i)=>[0,i]);
    function stepLights(){fxd.forEach(e=>{const f=FX[e[1]];e[0]=Math.hypot(f.x-P.x,f.z-P.z)});fxd.sort((a,b)=>a[0]-b[0]);const d4=fxd[3]?fxd[3][0]:fxd[fxd.length-1][0]+5;
      lights.forEach((l,k)=>{const e=fxd[k];if(!e){l.intensity=0;return}const f=FX[e[1]];l.position.set(f.x,f.y,f.z);l.color.copy(f.c);l.distance=f.dist;l.intensity=f.li*Math.max(0,Math.min(1,(d4-e[0])/2.5))})}

    /* найденное: счётчик, отметки на табличках, бледные кольца у просмотренных предметов */
    const foundEl=hud.querySelector(".mz-found"),fc={n:0,h:{}};
    function countFound(){fc.n=foundS.size;fc.h={};foundS.forEach(id=>{const k=OBJ_H[id];fc.h[k]=(fc.h[k]||0)+1})}
    function updFound(){countFound();const k=HALLZ[Math.max(0,lastHall)].k;
      foundEl.innerHTML=`<b>Найдено ${fc.n} из ${opt.objs.length}</b><span class="mz-fh"> · в зале ${fc.h[k]||0} из ${TOT[k]||0}</span>`}
    const bb=new T.Box3(),bc=new T.Vector3(),bs=new T.Vector3();
    function hb(o){if(!o.userData.hb){bb.setFromObject(o);bb.getCenter(bc);bb.getSize(bs);const b={x:bc.x,z:bc.z,top:bb.max.y,r:Math.max(.42,Math.min(1.1,Math.max(bs.x,bs.z)/2+.12))};
        if(bs.z<.15&&bs.x>.3){b.z+=.55;b.r=Math.min(b.r,.7)}else if(bs.x<.15&&bs.z>.3){b.x+=b.x>0?-.55:.55;b.r=Math.min(b.r,.7)}o.userData.hb=b}return o.userData.hb}
    const seenIM=new T.InstancedMesh(new T.RingGeometry(.5,.54,40).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:0xFFFFFF,transparent:true,opacity:.34,depthWrite:false}),Math.max(1,clickable.length));
    seenIM.count=0;seenIM.frustumCulled=false;seenIM.renderOrder=1;S.add(seenIM);
    const m4=new T.Matrix4();
    function updSeen(){let n=0;const done=new Set();clickable.forEach(o=>{const id=o.userData.id;if(!id||o.userData.go||!foundS.has(id)||done.has(id))return;done.add(id);const b=hb(o);m4.makeScale(b.r/.52,1,b.r/.52).setPosition(b.x,.018,b.z);seenIM.setMatrixAt(n++,m4)});
      seenIM.count=n;seenIM.instanceMatrix.needsUpdate=true}
    function markFound(id){if(!OBJ_IDS.has(id)||foundS.has(id))return false;foundS.add(id);
      try{localStorage.setItem("cv2_mz_found",JSON.stringify([...foundS]))}catch(e){}
      const pq=plaques[id];if(pq){drawPlaque(pq.c,pq.name,pq.sub,true);pq.t.needsUpdate=true}
      updFound();updSeen();mapDirty=true;return true}

    /* подсветка ближайшего предмета: красное кольцо на полу и маркер над предметом — всегда один */
    const hlRing=new T.Mesh(new T.RingGeometry(.6,.7,48).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:ACC,transparent:true,opacity:.9,depthWrite:false,fog:false}));
    const hlMark=new T.Mesh(new T.ConeGeometry(.075,.17,4),new T.MeshBasicMaterial({color:ACC,fog:false}));hlMark.rotation.x=Math.PI;
    hlRing.visible=hlMark.visible=false;hlRing.renderOrder=2;S.add(hlRing,hlMark);
    function stepHL(t){const o=nearObj;if(!o){hlRing.visible=hlMark.visible=false;return}const b=hb(o),pulse=!reduce&&!lite;
      const ps=pulse?1+.06*Math.sin(t*4.2):1;hlRing.visible=true;hlMark.visible=!o.userData.dbl;hlRing.position.set(b.x,.022,b.z);hlRing.scale.set(b.r/.6*ps,1,b.r/.6*ps);
      hlRing.material.opacity=pulse?.65+.3*(.5+.5*Math.sin(t*4.2)):.9;hlMark.position.set(b.x,Math.min(HALLZ[hallAt(b.z)].H-.3,b.top+.3+(pulse?Math.sin(t*3)*.05:0)),b.z);hlMark.rotation.y=pulse?t*1.5:0}

    /* название зала при входе: крупно и ненадолго; при «меньше движения» — без анимации */
    const titleEl=hud.querySelector(".mz-title");let titleT=0;stopFns.push(()=>clearTimeout(titleT));
    function showTitle(i){const h=HALLZ[i];titleEl.textContent="";const b=document.createElement("b"),sm=document.createElement("small");b.textContent=opt.halls[h.k]||"";
      sm.textContent=`Зал ${i+1} из ${HALLZ.length} · найдено ${fc.h[h.k]||0} из ${TOT[h.k]||0}`;titleEl.append(b,sm);titleEl.classList.add("on");clearTimeout(titleT);titleT=setTimeout(()=>titleEl.classList.remove("on"),2600)}

    /* мини-карта: сверху — окрестность в масштабе (вперёд по анфиладе — вправо), снизу — все десять залов; нажатие на зал переносит туда */
    const mapEl=hud.querySelector(".mz-map"),mapC=mapEl.querySelector("canvas"),mapT=mapEl.querySelector(".mz-map-t"),mg=mapC.getContext("2d");
    const MLH=64,MGAP=4,MSH=26,MSC=4,MTOT=MLH+MGAP+MSH;let mapOpen=true,mapDirty=true,mapT0=0;
    const setMap=v=>{mapOpen=v;mapEl.dataset.mzOpen=v?"1":"0";mapT.setAttribute("aria-expanded",String(v));mapDirty=true};
    setMap(!coarse.matches&&lsGet("cv2_mz_map")!=="0");
    on(mapT,"click",()=>{setMap(!mapOpen);if(!coarse.matches)lsSet("cv2_mz_map",mapOpen?"1":"0")});
    const MAPC=HALLZ.map(h=>{const c=new T.Color(AIR[h.k].fog);return `rgba(${c.r*255|0},${c.g*255|0},${c.b*255|0},.38)`});
    let MP=null;
    function drawMap(){const W=mapC.clientWidth||232,dpr=Math.min(2,window.devicePixelRatio||1),g=mg;if(!W)return;
      if(mapC.width!==Math.round(W*dpr)||mapC.height!==Math.round(MTOT*dpr)){mapC.width=Math.round(W*dpr);mapC.height=Math.round(MTOT*dpr)}
      if(!MP)MP=clickable.filter(o=>o.userData.id&&!o.userData.go).map(o=>({o,b:hb(o),id:o.userData.id}));
      g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,MTOT);const ox=W*.42,mx=zz=>ox+(P.z-zz)*MSC,my=x=>MLH/2+x*MSC;
      g.save();g.beginPath();g.rect(0,0,W,MLH);g.clip();
      HALLZ.forEach((h,i)=>{const x0=mx(h.z0),x1=mx(h.z1);if(x1<-2||x0>W+2)return;const cur=i===lastHall;g.fillStyle=cur?"rgba(224,58,30,.26)":MAPC[i];g.fillRect(x0,0,x1-x0,MLH);
        g.strokeStyle=cur?"#E03A1E":"rgba(255,255,255,.4)";g.lineWidth=cur?1.6:1;g.beginPath();g.moveTo(x0,.5);g.lineTo(x1,.5);g.moveTo(x0,MLH-.5);g.lineTo(x1,MLH-.5);
        [x0,x1].forEach(xx=>{g.moveTo(xx,0);g.lineTo(xx,my(-1.5));g.moveTo(xx,my(1.5));g.lineTo(xx,MLH)});g.stroke()});
      MP.forEach(m=>{const x=mx(m.b.z),y=my(m.b.x);if(x<-3||x>W+3)return;g.fillStyle=m.o===nearObj?"#E03A1E":foundS.has(m.id)?"#FFFFFF":"rgba(255,255,255,.4)";g.fillRect(x-1.6,y-1.6,3.2,3.2)});
      const dia=(x,y,s,fill)=>{g.fillStyle=fill;g.strokeStyle="#0E1013";g.lineWidth=1;g.beginPath();g.moveTo(x,y-s);g.lineTo(x+s,y);g.lineTo(x,y+s);g.lineTo(x-s,y);g.closePath();g.fill();g.stroke()};
      NPC.forEach(n=>{const x=mx(n.z),y=my(n.x);if(x<-5||x>W+5)return;dia(x,y,4,n.g===nearObj?"#E03A1E":"#7FE3CC")});
      const others=opt.multi?opt.multi.others():[];
      others.forEach(p=>{const x=mx(p.z),y=my(p.x);if(x<-3||x>W+3)return;g.fillStyle=p.color||"#8AB";g.beginPath();g.arc(x,y,3,0,7);g.fill();g.strokeStyle="rgba(0,0,0,.6)";g.lineWidth=1;g.stroke()});
      {const x=mx(P.z),y=my(P.x),c=Math.cos(P.yaw),sn=-Math.sin(P.yaw),px=-sn,py=c;g.fillStyle="#FFFFFF";g.strokeStyle="#0E1013";g.lineWidth=1.2;g.beginPath();
        g.moveTo(x+c*6.5,y+sn*6.5);g.lineTo(x-c*4+px*4,y-sn*4+py*4);g.lineTo(x-c*2,y-sn*2);g.lineTo(x-c*4-px*4,y-sn*4-py*4);g.closePath();g.fill();g.stroke()}
      g.restore();
      const y0=MLH+MGAP,cw=W/HALLZ.length;g.font="600 10px ui-monospace, monospace";g.textAlign="center";g.textBaseline="middle";
      HALLZ.forEach((h,i)=>{const x=i*cw,cur=i===lastHall;g.fillStyle=cur?"#E03A1E":MAPC[i];g.fillRect(x+1,y0,cw-2,MSH);g.fillStyle=cur?"#FFFFFF":"rgba(255,255,255,.85)";g.fillText(String(i+1),x+cw/2,y0+MSH/2-3);
        const fr=(fc.h[h.k]||0)/Math.max(1,TOT[h.k]||1);g.fillStyle="rgba(255,255,255,.22)";g.fillRect(x+3,y0+MSH-5,cw-6,2.5);g.fillStyle=cur?"#FFFFFF":"#E9EDF0";g.fillRect(x+3,y0+MSH-5,(cw-6)*fr,2.5)});
      const cell=(zz,xx)=>{const i=hallAt(zz),h=HALLZ[i];return[i*cw+1+(cw-2)*Math.max(0,Math.min(1,(h.z0-zz)/h.D)),y0+MSH/2+((xx+HW)/(2*HW)-.5)*(MSH-8)]};
      NPC.forEach(n=>{const[x,y]=cell(n.z,n.x);dia(x,y,2.4,"#7FE3CC")});
      others.forEach(p=>{const[x,y]=cell(p.z,p.x);g.fillStyle=p.color||"#8AB";g.beginPath();g.arc(x,y,2.2,0,7);g.fill()});
      {const[x,y]=cell(P.z,P.x);g.fillStyle="#FFFFFF";g.strokeStyle="#0E1013";g.beginPath();g.arc(x,y,2.8,0,7);g.fill();g.stroke()}
      mapDirty=false}
    on(mapC,"pointerdown",ev=>ev.stopPropagation());
    on(mapC,"click",ev=>{const rc=mapC.getBoundingClientRect();if(!rc.width)return;const x=(ev.clientX-rc.left)*(mapC.clientWidth/rc.width),y=(ev.clientY-rc.top)*(MTOT/rc.height),W=mapC.clientWidth;let i=-1;
      if(y>=MLH+MGAP/2)i=Math.floor(x/(W/HALLZ.length));else{const zz=P.z-(x-W*.42)/MSC;i=HALLZ.findIndex(h=>zz<=h.z0&&zz>=h.z1)}
      if(i>=0&&i<HALLZ.length)goHall(i)});

    /* облегчённый режим для слабых устройств: без пульсации, без теней под постаментами, карта реже, пиксели крупнее */
    const forceLite=typeof window.__MZ_LITE==="boolean"?window.__MZ_LITE:null;let lite=false,fpsN=0,fpsT=performance.now(),fpsV=0,lowS=0;const bootT=performance.now();
    function setLite(v){lite=!!v;R.setPixelRatio(lite?1:Math.min(1.6,devicePixelRatio));contacts.forEach(m=>m.visible=!lite);wrap.classList.toggle("mz-lite",lite);snd.setLite(lite)}
    setLite(forceLite!=null?forceLite:((navigator.hardwareConcurrency||8)<=4||(coarse.matches&&navigator.deviceMemory&&navigator.deviceMemory<=4)));
    function stepFps(now){fpsN++;if(now-fpsT<1000)return;fpsV=fpsN*1000/(now-fpsT);fpsN=0;fpsT=now;if(forceLite!=null||lite)return;if(now-bootT>2500&&fpsV<24)lowS++;else lowS=0;if(lowS>=3)setLite(true)}
    let calls=0;
    Object.defineProperties(canvas.__mz,Object.getOwnPropertyDescriptors({hallZ:HALLZ.map(h=>({k:h.k,z0:h.z0,z1:h.z1,H:h.H})),goHall,
      get air(){return{hemi:+hemi.intensity.toFixed(3),hemiSky:"#"+hemi.color.getHexString(),amb:+amb.intensity.toFixed(3),ambColor:"#"+amb.color.getHexString(),fog:"#"+S.fog.color.getHexString(),fogNear:+S.fog.near.toFixed(2),fogFar:+S.fog.far.toFixed(2)}},
      get hall(){return lastHall},get found(){return{n:foundS.size,ids:[...foundS]}},get lite(){return lite},get fps(){return fpsV},get calls(){return calls},get tris(){return R.info.render.triangles},
      get hl(){return{visible:hlRing.visible&&hlMark.visible,id:nearObj?nearObj.userData.id||nearObj.userData.go:null,x:hlRing.position.x,z:hlRing.position.z,n:[hlRing,hlMark].filter(m=>m.visible).length}},
      get seenRings(){return seenIM.count},get map(){return{open:mapOpen}},AIR,
      get doubles(){return NPC.map(n=>({k:n.k,name:n.name,hall:n.h,x:+n.x.toFixed(2),z:+n.z.toFixed(2),yaw:+n.g.rotation.y.toFixed(3),headYaw:+n.head.rotation.y.toFixed(3),visible:n.g.visible,label:n.lab.visible}))},
      get pose(){const f=me.userData.fig;return{g:gestNow(),sit:+(f.gs||0).toFixed(3),wave:+(f.gw||0).toFixed(3),armRz:+f.armR.rotation.z.toFixed(3),legLx:+f.legL.rotation.x.toFixed(3),bodyY:+f.body.position.y.toFixed(3)}},
      peerPose(id){const a=AV[id];if(!a)return null;const f=a.userData.fig;return{g:a.userData.g,sit:+(f.gs||0).toFixed(3),wave:+(f.gw||0).toFixed(3),armRz:+f.armR.rotation.z.toFixed(3),legLx:+f.legL.rotation.x.toFixed(3),bodyY:+f.body.position.y.toFixed(3)}},
      get audio(){return snd.dbg()},get props(){return PR.map(p=>({k:p.k,hi:p.hi,meshes:p.core.length+p.extra.length,core:p.core.length,extra:p.extra.length,parts:p.parts,nx:p.nx,vis:[...p.core,...p.extra].filter(m=>m.visible).length,tris:[...p.core,...p.extra].reduce((a,m)=>a+m.geometry.index.count/3,0)}))},canStand,groundAt,get colliders(){return blockers},get walkRects(){return walk},LOW_TOP,JUMP:{v:JUMP_V,g:GRAV,step:STEP,airStep:AIR_STEP,head:HEAD,r},
      get clickPts(){return clickable.map(o=>{o.getWorldPosition(tmpV);return {id:o.userData.id||o.userData.go||'',dbl:!!o.userData.dbl,x:+tmpV.x.toFixed(3),z:+tmpV.z.toFixed(3)}})}}));
    updSeen();
    const tmpV=new T.Vector3(),fwd=new T.Vector3();
    function frame(now){
      if(stopped)return;const dt=Math.min(.05,(now-last)/1000);last=now;const t=now/1000;
      const W=canvas.clientWidth,H=canvas.clientHeight;if(canvas.width!==Math.floor(W*R.getPixelRatio())||canvas.height!==Math.floor(H*R.getPixelRatio())){R.setSize(W,H,false);cam.aspect=W/H;cam.updateProjectionMatrix()}
      const fp=fpMode();
      /* ввод → желаемая скорость относительно камеры */
      let f=0,s=0,turn=0;if(keys.KeyW||keys.ArrowUp)f+=1;if(keys.KeyS||keys.ArrowDown)f-=1;if(keys.KeyA)s-=1;if(keys.KeyD)s+=1;
      /* ←/→ поворачивают камеру в обоих видах (≈2 рад/с, с плавным разгоном); A/D — шаг вбок */
      if(keys.ArrowLeft)turn+=1;if(keys.ArrowRight)turn-=1;
      if(joy){f-=joy.dy;s+=joy.dx}
      C.tv=(C.tv||0)+(turn*2-(C.tv||0))*(1-Math.exp(-dt*10));if(Math.abs(C.tv)<1e-3)C.tv=0;C.yaw+=C.tv*dt;if(turn)lastLook=now;
      const sy=Math.sin(C.yaw),cy=Math.cos(C.yaw);let ix=-sy*f+cy*s,iz=-cy*f-sy*s,m=Math.hypot(ix,iz);if(m>1){ix/=m;iz/=m;m=1}
      const spd=(keys.ShiftLeft||keys.ShiftRight)?RUN:WALK;let tx=ix*spd,tz=iz*spd;
      if(m>.05)target=null;else if(target){const dx=target.x-P.x,dz=target.z-P.z,d=Math.hypot(dx,dz);if(d<.15){target=null;tx=tz=0}else{const v=WALK*Math.min(1,d/.6);tx=dx/d*v;tz=dz/d*v}}
      if(GS.sit&&(m>.05||target||jumpQ))toggleSit(false);if(GS.waveT>0){GS.waveT-=dt;if(GS.waveT<=0){GS.waveT=0;syncG()}}
      const kk=(1-Math.exp(-dt*((m>.05||target)?9:7)))*(V.ground?1:.35);V.x+=(tx-V.x)*kk;V.z+=(tz-V.z)*kk;
      if(Math.abs(V.x)<.004)V.x=0;if(Math.abs(V.z)<.004)V.z=0;
      if(V.x||V.z){if(!moveBy(V.x*dt,V.z*dt)&&target)target=null}
      /* прыжок и гравитация (этап 4): опора — пол или верх низкого препятствия под фигурой */
      if(jumpQ){jumpQ=false;if(V.ground){V.vy=JUMP_V;V.ground=false}}
      stepVert(dt,HALLZ[hallAt(P.z)].H);
      const sp=Math.hypot(V.x,V.z);
      /* куда смотрит фигура */
      if(fp)P.yaw=C.yaw;else if(sp>.25)P.yaw+=angDiff(P.yaw,Math.atan2(-V.x,-V.z))*(1-Math.exp(-dt*12));
      /* с джойстиком камера понемногу заходит за спину идущей фигуры */
      if(!fp&&joy&&sp>.3&&now-lastLook>900){const d=angDiff(C.yaw,P.yaw);if(Math.abs(d)<2.2)C.yaw+=d*(1-Math.exp(-dt*1.1))*Math.min(1,sp/WALK)}
      const hi=hallAt(P.z);
      /* камера */
      if(fp){C.cur=C.d=0;if(V.ground&&sp>.3)bob+=dt*9*sp/WALK;cam.position.set(P.x,P.y+1.55+(reduce?0:Math.sin(bob)*.022),P.z)}
      else{pivT.set(P.x,P.y+1.55,P.z);if(pivT.distanceTo(piv)>3)piv.copy(pivT);else piv.lerp(pivT,1-Math.exp(-dt*(reduce?30:14)));
        C.cur+=(C.want-C.cur)*(1-Math.exp(-dt*8));
        back.set(Math.sin(C.yaw)*Math.cos(C.pitch),-Math.sin(C.pitch),Math.cos(C.yaw)*Math.cos(C.pitch));
        cray.set(piv,back);cray.near=0;cray.far=C.cur+.3;const hit=cray.intersectObjects(camBlock,false)[0];
        const want=hit?Math.max(.3,hit.distance-.3):C.cur;if(want<C.d)C.d=want;else C.d+=(want-C.d)*(1-Math.exp(-dt*5));
        cam.position.copy(piv).addScaledVector(back,C.d);cam.position.y=Math.max(.25,Math.min(HALLZ[hi].H-.15,cam.position.y))}
      cam.rotation.set(C.pitch,C.yaw,0);
      me.position.set(P.x,P.y,P.z);me.rotation.y=P.yaw;me.visible=!fp&&C.d>.75;animFig(me,dt,sp,!V.ground,t);P.g=gestNow();poseFig(me,dt,P.g,t);
      /* шаги по фазе походки: каждый полупериод — шаг (бег — чаще и громче) */
      {const ss_=Math.sin(me.userData.fig.ph)>=0;if(V.ground&&sp>.6){if(ss_!==frame._ss)snd.step(sp>WALK+.6,HALLZ[hallAt(P.z)].floor)}frame._ss=ss_}
      {const gy=groundAt(P.x,P.z,P.y,0);me.userData.fig.blob.position.y=gy+.013-P.y;me.userData.fig.blob.scale.setScalar(Math.max(.5,1-(P.y-gy)*.6))}
      if(hi!==lastHall){lastHall=hi;const hz=HALLZ[hi];whereEl.textContent=opt.halls[hz.k];whereSm.textContent=`ЗАЛ ${hi+1} ИЗ ${HALLZ.length}`;
        bar.querySelectorAll("button").forEach((b,i)=>b.setAttribute("aria-pressed",i===hi));updFound();showTitle(hi);mapDirty=true}
      stepAir(dt);stepLights();stepDbl(dt,t,hi);stepProps(hi,t,dt);
      /* звуковые постели: тот же переход у проёмов, что и у воздуха залов (±2,5 м) */
      if(now-(frame._am||0)>120){const ddt=(now-(frame._am||now))/1000;frame._am=now;const i=hi,h=HALLZ[i],B=2.5,W={};let j=i,tt=0;
        if(i<HALLZ.length-1&&P.z-h.z1<B){j=i+1;tt=.5*(1-(P.z-h.z1)/B)}else if(i>0&&h.z0-P.z<B){j=i-1;tt=.5*(1-(h.z0-P.z)/B)}
        W[h.k]=1-tt;if(j!==i)W[HALLZ[j].k]=tt;snd.mix(W,ddt)}
      /* стрелка идёт только под взглядом */
      if(clockHand){cam.getWorldDirection(fwd);tmpV.copy(clockPos).sub(cam.position);const d=tmpV.length();tmpV.normalize();if(fwd.dot(tmpV)>.93&&d<8+C.d)clockHand.rotation.z-=dt*Math.PI*2/60}
      if(leds.length&&Math.random()<.2)leds[Math.floor(Math.random()*leds.length)].visible=Math.random()>.3;
      anim.forEach(a=>a(t));if(screens.length&&Math.floor(now/700)!==frame._s){frame._s=Math.floor(now/700);drawScreens(t)}
      /* ближайший предмет: рядом с фигурой и в стороне взгляда камеры */
      const fx=-sy,fz=-cy;let best=null,bd=2.6;clickable.forEach(o=>{o.getWorldPosition(tmpV);const dx=tmpV.x-P.x,dz=tmpV.z-P.z,d=Math.hypot(dx,dz);if(d<bd&&(d<.9||(dx*fx+dz*fz)/d>.5)){bd=d;best=o}});
      const touch=coarse.matches;
      if(best!==nearObj||touch!==frame._t){nearObj=best;frame._t=touch;if(bAct)bAct.dataset.on=best?"1":"0";const dbl=!!(best&&best.userData.dbl);setAct(dbl?"talk":"look",dbl?best.userData.label:"");
        if(best){nearEl.hidden=false;nearEl.textContent=dbl?best.userData.label+" · двойник — "+(touch?"кнопка «говорить»":"E, чтобы поговорить"):(best.userData.label||"Предмет")+(best.userData.n?" · запись "+best.userData.n:"")+(touch?" — кнопка «смотреть»":" — E или клик")}else nearEl.hidden=true}
      if(opt.multi)peersStep(dt,hi,t);
      stepHL(t);if(mapOpen&&(mapDirty||now-mapT0>(lite?250:66))){mapT0=now;drawMap()}stepFps(now);
      R.render(S,cam);calls=R.info.render.calls;raf=requestAnimationFrame(frame);
    }
    hint0();syncView();raf=requestAnimationFrame(frame);
  }
  return function stop(){if(stopped)return;if(opt.multi)opt.multi.leave();stopped=true;cancelAnimationFrame(raf);stopFns.splice(0).forEach(f=>{try{f()}catch(e){}});try{if(R){R.dispose();R.forceContextLoss&&R.forceContextLoss()}}catch(e){}};
}
return {mount};
})();

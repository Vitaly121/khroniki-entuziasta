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
const NH=SPEC.length,IB=NH; /* залы анфилады 0…9; «База Героев» — боковое пространство с индексом 10 */
/* этап 6: «База Героев» — боковой зал за проёмом в правой стене «Квартир» (x>8). Проём: z от −11,1 до −8,9, высота 2,6 м;
   зал: x 8,3…28,3 (20 м), z −2…−16 (14 м), высота 5 м; xm — середина толщины стены, граница пространств */
/* этап 11: вход перенесён на правую (боковую) стену зала «Предметы»: обе арены сдвинуты вдоль анфилады на BZ (проём — z −38,2, между стеллажами и каталожным столом).
   BASE_L/BASE2_L — прежняя «своя» система координат обстановки арен (kit «hb»/«hb2» прибавляет BZ сам); BASE/BASE2 — мировые координаты */
const BZ=-28.2;
const BASE_L={k:"hb",name:"База Героев",x0:8.3,x1:28.3,z0:-2,z1:-16,H:5,DZ:-10,DW:1.1,DH:2.6,xm:8.15};
const BASE=Object.assign({},BASE_L,{z0:BASE_L.z0+BZ,z1:BASE_L.z1+BZ,DZ:BASE_L.DZ+BZ});
/* этап 10: «База Героев» — две арены. Прежний зал — «База А» (вход и арсенал у входа); за проёмом в его восточной стене (z −8,95…−7,05, высота 2,6 м) —
   «База Б»: x 28,6…47,6 (19 м), z −1,5…−14,5 (13 м), высота 5 м; xm — середина толщины стены между аренами */
const BASE2_L={k:"hb2",name:"База Героев · Б",x0:28.6,x1:47.6,z0:-1.5,z1:-14.5,H:5,DZ:-8,DW:.95,DH:2.6,xm:28.45};
const BASE2=Object.assign({},BASE2_L,{z0:BASE2_L.z0+BZ,z1:BASE2_L.z1+BZ,DZ:BASE2_L.DZ+BZ});
const BASE_HALL=1;/* зал анфилады, из которого вход в «Базу» */
const BASE_T={hb:["База Героев · А","База А"],hb2:["База Героев · Б","База Б"]};
/* ---------- этап 9: вторая боковая ветка — жилой коридор за проёмом в ЛЕВОЙ стене «Квартир» и квартиры за его дверями.
   ПРИНЦИП: музей показывает КОНКРЕТНЫЕ, НАСТОЯЩИЕ вещи тех людей, кто их сюда помещает, а не типовые или абстрактные заменители.
   Поэтому мебель и предметы комнаты повторяют фотографии автора так точно, как позволяют примитивы (именно этот диван, стол, стулья,
   комод, кухня, светильники, растения, вазы), а то, что по сути изображение (картины, фотографии на стене), показывается собственной
   фотографией владельца как текстурой (предмет типа "photo": файл, размер, место на стене, подпись, можно рассмотреть) — ничего не выдумываем взамен.
   ФОРМАТ ДАННЫХ (метры; x — поперёк анфилады, z — вдоль, вглубь — минус):
   CORR — коридор: {k, name, x0…x1 (x1 — торец у «Квартир»), z0 (северная стена) … z1 (южная), H, DZ/DW/DH — проём в стене «Квартир», xm — граница пространств}.
   FLATS — список квартир: {id, number — номер на двери, title — название (табличка у двери, полоса залов, карта), side:"n"|"s" — сторона коридора, dx — центр двери по x, rooms:[комната…]};
     пустой rooms — закрытая дверь с табличкой «скоро»; первая комната открывается прямо из коридора.
   комната: {k — ключ пространства (свет, звук, музыка), title — своё название комнаты, name — полное (по умолчанию «квартира · комната»), short, w×d×H — ширина, глубина от двери, высота, dox/dw/dh — дверь из коридора
     (центр по x комнаты, ширина, высота), wall/ceil/skirt/floor — цвета и пол, air/snd — свет и звук (ключи AIR/AMB), lights — пятна света
     [{x,z,r,w,sc — «гребешок» на стене,yc}], doors — двери в стенах ("l"|"r"|"b", at — z центра или x для "b", w, h, to — ключ следующей
     комнаты или null — закрытая скрытая дверь), props — предметы [тип, x, z, {параметры}] в СВОИХ координатах комнаты: x от −w/2 (левая
     стена, если смотреть от двери) до w/2, z от 0 (стена с дверью) до −d. Типы предметов — в ROOMB (сборщики); высоты берутся из геометрии.
     Фотография владельца на стене: ["photo", x, z, {src:"img/….webp", w, h, y — центр по высоте, caption, interactive:true}] — x у стены (±w/2) или z у стены (0/−d).
     Этап 10 — ещё поля комнаты: bar:false — не показывать в полосе залов и на карте (прихожая, через которую входят в квартиру); mus — ключ музыки
     (прихожая играет музыку квартиры); doorc/casec — цвет открытой входной двери и наличника; у двери в стене: leaf:false — проход без полотна,
     style:"panel" — закрытая дверь белая филёнчатая с серебристой ручкой (иначе — скрытая в цвет стены).
     Этап 10 — ещё типы предметов: spots {list:[[x,z]…], sq — квадратные} — накладные споты на потолке; kitchenL — Г-образная кухня (белые фасады без ручек,
     дубовая столешница, зелёный стеклянный фартук с подсветкой, духовка под варочной панелью, мойка, верхние шкафы, колонна, мелочи items);
     bookcase {l,d,h,wall} — открытый дубовый стеллаж с книгами; window {wall,w,h,y0,tr — фрамуга, rv — глубина откоса} — окно с ночным видом;
     sill {wall,a0,a1,y,d,rad:[a0,a1],pots} — длинная полка-подоконник на кронштейнах над батареей; table — ещё legc, decor:[[тип,dx,dz]…];
     chair — ещё legc; chandelier — ещё col, n, L, bulb (размер лампы), rod; sockets — ещё c (цвет рамок).
   Новая квартира или комната — новая запись в данных, код не меняется (для проверки: window.__MZ_FLATS до входа в музей) ---------- */
const CORR={k:"co",name:"Коридор квартир",short:"Коридор квартир",x0:-23.4,lamps:[-9.9,-13.15,-16.4,-19.65,-22.1],x1:-8.3,z0:-11.7,z1:-14.7,H:2.8,DZ:-13.2,DW:1.1,DH:2.6,xm:-8.15,wallT:.15,
  wall:"#E4E1DA",ceil:"#F1F0EC",floor:"ctile",air:"co",snd:"co"};
const FLAT1_ROOM={k:"f1",title:"кухня-гостиная",name:"Headliner · кухня-гостиная",short:"Headliner",w:4.2,d:9.6,H:2.85,dox:.4,dw:1.0,dh:2.12,
  wall:"#6B774C",ceil:"#EEEBE4",skirt:"#56613C",floor:"oak",air:"f1",snd:"f1",
  /* пятна света: «гребешки» трековых спотов на зелёных стенах, свет люстры над столом, кухня */
  lights:[{x:-1.95,z:-1.5,r:1.3,w:1.15,sc:1.7,yc:2.05},{x:-1.95,z:-4.0,r:1.3,w:1.15,sc:1.7,yc:2.05},{x:1.95,z:-2.05,r:1.2,w:.95,sc:1.5,yc:2.25},
    {x:1.95,z:-5.6,r:1.2,w:1.0,sc:1.7,yc:2.0},{x:-.95,z:-9.45,r:1.1,w:1.0,sc:1.8,yc:2.15},{x:.75,z:-9.45,r:1.1,w:.9,sc:1.8,yc:2.15},
    {x:-.1,z:-6.0,r:1.7,w:1.15},{x:0,z:-2.6,r:2.2,w:.55},{x:-.3,z:-8.2,r:1.4,w:.6}],
  doors:[{wall:"l",at:-6.95,w:.86,h:2.1,to:null},{wall:"r",at:-4.05,w:.86,h:2.1,to:null}],
  props:[
   ["sofa",-2.1,-.45,{l:2.85,d:1.0,c:"#D98489",c2:"#E29093",cushion:"#E7E2D7"}],
   ["sideboard",2.1,-1.45,{l:1.45,d:.46,h:.78}],
   ["photo",2.1,-2.18,{src:"img/flat1_picture.webp",w:1.5,h:1.293,y:1.74,caption:"Картина над комодом",interactive:true}],
   ["tree",1.72,-.62,{season:"auto"}],
   ["plant",1.62,-1.12,{h:.95,s:.7}],
   ["table",-.1,-6.0,{w:.82,l:1.32,h:.75}],
   ["chair",-.86,-5.68,{face:"r",c:"#6E4E3E"}],["chair",-.86,-6.32,{face:"r",c:"#6A6E74"}],["chair",.66,-5.68,{face:"l",c:"#6A6E74"}],["chair",.66,-6.32,{face:"l",c:"#7A5A44"}],
   ["chandelier",-.1,-6.0,{y:2.06}],
   ["kitchen",0,0,{run:[-2.1,1.18],ret:-7.62,dep:.62,h:.9,uppers:[-.62,1.18],hood:[-1.79,-8.32],ac:[.32,2.32],col:[1.18,2.1,-8.9]}],
   ["track",0,0,{rails:[[-1.0,-.7,-1.0,-8.7],[1.12,-1.0,1.12,-7.2],[-1.6,-8.45,.95,-8.45],[-1.0,-4.6,1.12,-4.6]],
     spots:[[-1.0,-1.5,-1],[-1.0,-4.0,-1],[1.12,-2.05,1],[1.12,-5.6,1],[-.95,-8.45,-2],[.75,-8.45,-2],[-1.0,-6.9,-1],[1.12,-3.3,1]]}],
   ["sockets",0,0,{list:[["l",-3.4,.32],["l",-5.2,1.05],["r",-3.2,1.05],["r",-6.2,.32],["b",.85,1.08],["b",-1.2,1.08],["l",-.3,1.05]]}]]};
/* этап 10: квартира № 2 «Маршала Захарова» — по фотографиям автора: серая прихожая (дубовый ламинат вдоль, белые филёнчатые двери) ведёт
   в одну комнату — кухню-столовую с тёмно-зелёными стенами: Г-образная кухня в углу против прихожей, напротив — стол у двух окон с ночным видом */
const FLAT2_HALL={k:"f2h",title:"прихожая",name:"Маршала Захарова · прихожая",short:"Маршала Захарова",bar:false,mus:"f2",w:1.3,d:3.6,H:2.75,dox:0,dw:.9,dh:2.1,
  wall:"#C9CCCE",ceil:"#F3F3F1",skirt:"#F4F3EF",floor:"lam",air:"f2h",snd:"f2h",doorc:"#F1EFEA",casec:"#ECEAE4",
  lights:[{x:0,z:-1.0,r:1.0,w:.8},{x:0,z:-2.7,r:1.0,w:.8},{x:.62,z:-1.0,r:.9,w:.7,sc:1.4,yc:2.3},{x:-.62,z:-2.7,r:.9,w:.7,sc:1.4,yc:2.3}],
  doors:[{wall:"r",at:-1.15,w:.8,h:2.05,to:null,style:"panel"},{wall:"l",at:-2.35,w:.8,h:2.05,to:null,style:"panel"},{wall:"b",at:0,w:1.2,h:2.4,to:"f2",leaf:false}],
  props:[["spots",0,0,{sq:1,list:[[0,-1.0],[0,-2.7]]}],["sockets",0,0,{c:"#F2F1EC",list:[["r",-.4,1.05],["l",-3.3,.3]]}]]};
const FLAT2_ROOM={k:"f2",title:"кухня-столовая",name:"Маршала Захарова · кухня-столовая",short:"Маршала Захарова",w:6.4,d:4.2,H:2.95,dox:-1.4,
  wall:"#326D58",ceil:"#F4F3EF",skirt:"#F2F1EC",floor:"lam",air:"f2",snd:"f2",casec:"#F1F0EC",
  /* пятна света: «гребешки» спотов на зелёных стенах у кухни и окон, свет люстры над столом, подсветка фартука */
  lights:[{x:-3.15,z:-1.3,r:1.05,w:.9,sc:1.6,yc:2.25},{x:-3.15,z:-2.5,r:1.05,w:.9,sc:1.6,yc:2.25},{x:-2.2,z:-4.15,r:1.05,w:.9,sc:1.6,yc:2.3},
    {x:-.9,z:-4.15,r:1.05,w:.8,sc:1.6,yc:2.3},{x:3.15,z:-2.0,r:1.0,w:.7,sc:1.6,yc:2.3},{x:1.6,z:-4.15,r:1.0,w:.8,sc:1.6,yc:2.3},
    {x:1.75,z:-3.2,r:1.7,w:1.05},{x:-2.6,z:-3.4,r:1.3,w:.55},{x:-.4,z:-1.8,r:2.4,w:.45},{x:2.0,z:-.9,r:1.4,w:.5}],
  doors:[],
  props:[
   ["spots",0,0,{list:[[-2.6,-1.3],[-2.6,-2.5],[-2.2,-3.5],[-.9,-3.5],[.35,-3.4],[1.6,-3.6],[2.6,-2.0],[1.3,-1.0],[2.6,-.6],[-.9,-1.4]]}],
   ["kitchenL",0,0,{dep:.62,h:.9,runA:[-3.2,-.45],runB:[-4.2,-1.63],upA:[-2.9,-.45],upB:[-3.42,-1.66],uy:[1.45,2.17],col:[-.45,.2,2.2],sink:-1.15,hob:-2.78,
     items:[["fruit",-3.0,-1.95],["plant",-2.95,-2.25],["tray",-3.12,-2.15],["trivet",-2.95,-3.25],["teapot",-2.95,-3.75],["knives",-1.75,-4.05],["kettle",-1.52,-4.0],["jug",-1.32,-3.95],["soap",-.62,-4.05]]}],
   ["bookcase",-3.2,-1.31,{l:.62,d:.34,h:1.9,wall:"l"}],
   ["sockets",0,0,{c:"#F2F1EC",list:[["l",-1.85,1.1],["l",-3.0,1.1],["b",-.7,1.1],["l",-.35,.3]]}],
   ["window",3.2,-2.95,{wall:"r",w:1.15,h:1.35,y0:.95,tr:.55}],
   ["window",3.2,-.85,{wall:"r",w:.78,h:1.4,y0:.98,tr:.55}],
   ["sill",3.2,0,{wall:"r",a0:-3.95,a1:-1.25,y:.84,d:.25,rad:[-3.45,-2.45],pots:[[-3.35,"bowl"],[-2.55,"round"]]}],
   ["tree",2.6,-.62,{season:"auto"}],
   ["table",1.75,-3.2,{w:.8,l:1.3,h:.75,top:"#D3A469",legc:"#E4E5E3",decor:[["plant",0,-.42],["cup",.12,.1],["cup",-.1,.22]]}],
   ["chair",1.02,-2.88,{face:"r",c:"#6E5546",legc:"#8A6440"}],["chair",1.02,-3.52,{face:"r",c:"#6B6C6E",legc:"#8A6440"}],
   ["chair",2.48,-2.88,{face:"l",c:"#6B6C6E",legc:"#8A6440"}],["chair",2.48,-3.52,{face:"l",c:"#73584A",legc:"#8A6440"}],
   ["chandelier",1.75,-3.2,{y:2.2,col:"#C9CDD1",n:8,L:.52,bulb:.034,rod:"#C9CDD1"}]]};
const FLATS=[{id:"f1",number:1,title:"Headliner",side:"n",dx:-11.4,rooms:[FLAT1_ROOM]},
  {id:"f2",number:2,title:"Маршала Захарова",side:"n",dx:-15.6,rooms:[FLAT2_HALL,FLAT2_ROOM]},{id:"f3",number:3,side:"n",dx:-21.9,rooms:[]},
  {id:"f4",number:4,side:"s",dx:-10.2,rooms:[]},{id:"f5",number:5,side:"s",dx:-13.4,rooms:[]},{id:"f6",number:6,side:"s",dx:-17.6,rooms:[]}];
/* ёлка в углу у комода: по часам посетителя с 15 декабря по 15 января, в остальное время — большое комнатное растение */
const treeSeason=(d=new Date())=>{const m=d.getMonth(),dd=d.getDate();return (m===11&&dd>=15)||(m===0&&dd<=15)};
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
 kr:{sky:0xFFFCF4,gnd:0x8C847A,hi:.92,amb:0xFFF8EE,ai:.28,fog:0xEFEBE3,fn:14,ff:95,lc:0xFFF2DE,li:.8,em:.22,lo:[.92,.85,.78],lo2:[.8,.86,.93],pool:[.26,.25,.24],r:3.4},
 /* «База Героев»: ярко, холодно-белый свет, бодро; акценты — синие светодиодные ленты */
 hb:{sky:0xF2F7FF,gnd:0x2A2E36,hi:.95,amb:0xE6F0FF,ai:.3,fog:0xC6D2E0,fn:14,ff:72,lc:0xEEF6FF,li:.9,em:.2,lo:[.62,.66,.74],pool:[.2,.22,.26],r:3.4},
 /* этап 9: коридор — ровный дневной белый свет подъезда; квартира — тёплый вечер (жёлтые споты, люстра), стены темнеют к полу */
 co:{sky:0xF6F8FA,gnd:0x8C8C88,hi:.9,amb:0xF2F4F6,ai:.27,fog:0xDADDDF,fn:9,ff:42,lc:0xF7F8FA,li:.7,em:.2,lo:[.74,.75,.76],pool:[.24,.24,.24],r:1.7},
 f1:{sky:0xFFD7A6,gnd:0x4A3A28,hi:.55,amb:0xFFCF9C,ai:.17,fog:0x3B3427,fn:9,ff:34,lc:0xFFCF94,li:.85,em:.3,lo:[.5,.45,.36],pool:[.62,.47,.28],r:1.4,warm:1},
 /* этап 10: «Маршала Захарова» — вечер чуть холоднее и тише, чем в Headliner (зелёные стены, тёплые споты); прихожая — ровный нейтральный свет */
 f2:{sky:0xF2D8B4,gnd:0x34352C,hi:.5,amb:0xEED3AE,ai:.16,fog:0x2B302A,fn:9,ff:32,lc:0xFFDDB0,li:.8,em:.28,lo:[.45,.44,.38],pool:[.56,.47,.33],r:1.4,warm:1},
 f2h:{sky:0xF4F4F2,gnd:0x77746E,hi:.8,amb:0xEEEEEC,ai:.24,fog:0xC9CACB,fn:8,ff:34,lc:0xF6F4EE,li:.7,em:.2,lo:[.64,.64,.63],pool:[.3,.29,.27],r:1.2},
 /* этап 10: «База Б» — темнее «А», фиолетовое свечение у пола, синие отсветы стен */
 hb2:{sky:0xDCE2FF,gnd:0x2A2436,hi:.82,amb:0xD6DCF6,ai:.26,fog:0x8E8CB0,fn:13,ff:64,lc:0xE6ECFF,li:.85,em:.22,lo:[.58,.58,.7],pool:[.22,.23,.3],r:3.2}
};
/* этап 8, часть 2: воздух этажей посетителей (у каждого свой характер) и комнат посетителей (ровный нейтральный свет — фотографии читаются как есть) */
Object.assign(AIR,{
 w551:{sky:0xFFF4E4,gnd:0x6A5E50,hi:.78,amb:0xF6EEE2,ai:.24,fog:0xD9D2C6,fn:9,ff:46,lc:0xFFF1D6,li:.75,em:.2,lo:[.72,.68,.62],pool:[.34,.3,.24],r:2.2},
 w43:{sky:0xEEF6F6,gnd:0x4E5E60,hi:.7,amb:0xE4F0F0,ai:.22,fog:0xC8D6D8,fn:8,ff:40,lc:0xF2F6FF,li:.65,em:.25,lo:[.6,.66,.66],pool:[.28,.3,.3],r:2.4},
 w17:{sky:0xFFE6C4,gnd:0x5C4A36,hi:.7,amb:0xFFE0BC,ai:.2,fog:0xD8C6AC,fn:8,ff:40,lc:0xFFE1B5,li:.8,em:.28,lo:[.66,.58,.48],pool:[.42,.32,.18],r:2.0},
 wm1:{sky:0x9DB4D8,gnd:0x101418,hi:.32,amb:0x7F96B8,ai:.12,fog:0x141A22,fn:6,ff:28,lc:0xBFD4FF,li:.6,em:.4,lo:[.22,.26,.32],pool:[.3,.38,.52],r:1.8},
 wi:{sky:0xFFE2B8,gnd:0x2A1E14,hi:.6,amb:0xFFD9A8,ai:.2,fog:0x120E0A,fn:5,ff:27,lc:0xFFD49A,li:.9,em:.3,lo:[.3,.25,.2],pool:[.1,.08,.05],r:3},
 vr:{sky:0xFFFFFF,gnd:0x8A8784,hi:.85,amb:0xFFFFFF,ai:.28,fog:0xE8E6E2,fn:14,ff:60,lc:0xFFF8F0,li:.7,em:.2,lo:[.93,.92,.9],pool:[.08,.08,.07],r:3}});
/* этажи: 551 — мастерская (бетон, тёплый белый), 43 — голоса (мягкие приглушённые стены, ковролин), 17 — квартиры (тёплый дом, доски), −1 — неотвеченное (тускло, холодно) */
const WFLOOR={"551":{name:"Верстак",air:"w551",wall:"#CBC4B8",floorTex:"concrete",ceil:"#DAD7D1",trim:0x5A5148,door:0x3B3A38,lamp:0xFFF1D6},
 "43":{name:"Голоса",air:"w43",wall:"#A9B9BC",floorTex:"carpet",ceil:"#E4E8E8",trim:0x3E5A5E,door:0x2F4A4E,lamp:0xF2F6FF},
 "17":{name:"Квартиры",air:"w17",wall:"#D8C8AE",floorTex:"planks",ceil:"#EFE8DC",trim:0x6B5238,door:0x5A4532,lamp:0xFFE1B5},
 "inf":{name:"Библиотека",air:"wi",wall:"#4B3828",floorTex:"concreteDark",ceil:"#2A2019",trim:0x5E4832,door:0x35281D,lamp:0xFFD49A},
 "-1":{name:"Неотвеченное",air:"wm1",wall:"#47505A",floorTex:"concreteDark",ceil:"#2A3038",trim:0x22282F,door:0x1E2329,lamp:0xBFD4FF}};
/* переход между мирами через лифт: следующий мир открывается без заставки и, если был, в полноэкранном виде */
let CARRY=null;
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
 /* этап 7: облицовка стен супермаркета — светлые панели с тонкими швами и серый цоколь */
 smwall:()=>cnv(512,512,(g,w,h)=>{g.fillStyle="#DCE2E7";g.fillRect(0,0,w,h);for(let i=0;i<4;i++){const gr=g.createLinearGradient(i*128,0,i*128+128,0);gr.addColorStop(0,"rgba(255,255,255,.35)");gr.addColorStop(1,"rgba(150,160,170,.12)");g.fillStyle=gr;g.fillRect(i*128,0,128,h)}g.fillStyle="rgba(90,100,110,.35)";for(let i=0;i<=4;i++)g.fillRect(i*128-1,0,2,h);noise(g,w,h,4)}),
 smtiles:()=>cnv(512,512,(g,w,h)=>{g.fillStyle="#ECECE8";g.fillRect(0,0,w,h);g.strokeStyle="rgba(0,0,0,.12)";for(let i=0;i<=4;i++){g.beginPath();g.moveTo(i*128,0);g.lineTo(i*128,h);g.moveTo(0,i*128);g.lineTo(w,i*128);g.stroke()}noise(g,w,h,6)}),
 /* этап 6: резиновое покрытие плитами по метру и синий ковролин входной зоны */
 rubber:()=>cnv(256,256,(g,w,h)=>{g.fillStyle="#26272A";g.fillRect(0,0,w,h);noise(g,w,h,16);g.fillStyle="rgba(255,255,255,.05)";for(let i=0;i<420;i++)g.fillRect(Math.random()*w,Math.random()*h,1.5,1.5);g.strokeStyle="rgba(0,0,0,.55)";g.lineWidth=2;g.strokeRect(1,1,w-2,h-2)}),
 carpet:()=>cnv(256,256,(g,w,h)=>{g.fillStyle="#2E4F9E";g.fillRect(0,0,w,h);noise(g,w,h,26)}),
 /* этап 9: светлый дуб «ёлочкой» (квартира; 512 px ≈ 2,4 м) и светлая каменная плитка 60 см (коридор) */
 oak:()=>cnv(512,512,(g,w,h)=>{g.fillStyle="#C9A273";g.fillRect(0,0,w,h);const L=96,W=24;for(let col=-1;col<w/L+2;col++)for(let row=-2;row<h/W+4;row++){const x=col*L,y=row*W*2+(col%2?W:0);
   g.save();g.translate(x,y);const p=(a,b)=>{g.fillStyle=shade("#D6B184",.86+Math.random()*.2);g.beginPath();a();g.closePath();g.fill();g.strokeStyle="rgba(110,78,44,.42)";g.lineWidth=1.2;g.stroke();
     g.strokeStyle="rgba(140,100,60,.12)";for(let k=0;k<3;k++){g.beginPath();b(k);g.stroke()}};
   p(()=>{g.moveTo(0,0);g.lineTo(L/2,L/2);g.lineTo(L/2,L/2+W);g.lineTo(0,W)},k=>{g.moveTo(2,5+k*6);g.lineTo(L/2-2,L/2+5+k*6)});
   p(()=>{g.moveTo(L/2,L/2);g.lineTo(L,0);g.lineTo(L,W);g.lineTo(L/2,L/2+W)},k=>{g.moveTo(L/2+2,L/2+5+k*6);g.lineTo(L-2,5+k*6)});g.restore()}noise(g,w,h,7)}),
 /* этап 10: тёплый светлый дубовый ламинат прямыми досками (≈20 см × 1,3 м, вдоль v; 512 px ≈ 2,4 м), стыки вразбежку */
 lam:()=>cnv(512,512,(g,w,h)=>{const PW=43;for(let c=0;c<12;c++){const x=c*PW;let y=-((c*173)%280);while(y<h){const L=260+Math.random()*60;
     g.fillStyle=shade("#CDA673",.86+Math.random()*.2);g.fillRect(x,y,PW,L);
     for(let k=0;k<7;k++){g.strokeStyle=`rgba(${Math.random()<.5?"120,82,44":"230,200,150"},${.1+Math.random()*.14})`;g.lineWidth=.8+Math.random()*1.4;const x0=x+3+Math.random()*(PW-6);g.beginPath();g.moveTo(x0,y);g.bezierCurveTo(x0+(Math.random()-.5)*8,y+L*.3,x0+(Math.random()-.5)*8,y+L*.7,x0+(Math.random()-.5)*6,y+L);g.stroke()}
     if(Math.random()<.5){g.fillStyle="rgba(110,70,35,.22)";g.beginPath();g.ellipse(x+PW/2,y+L*Math.random(),3,7,0,0,7);g.fill()}
     g.fillStyle="rgba(90,60,30,.45)";g.fillRect(x,y,PW,1.5);y+=L}
   g.fillStyle="rgba(90,60,30,.35)";g.fillRect(x,0,1.5,h)}noise(g,w,h,6)}),
 ctile:()=>cnv(512,512,(g,w,h)=>{for(let y=0;y<4;y++)for(let x=0;x<4;x++){g.fillStyle=shade("#D8D3CA",.95+Math.random()*.08);g.fillRect(x*128,y*128,128,128);g.fillStyle="rgba(120,110,100,.06)";for(let k=0;k<30;k++)g.fillRect(x*128+Math.random()*120,y*128+Math.random()*120,2+Math.random()*6,1.5)}
   g.strokeStyle="rgba(90,84,76,.38)";g.lineWidth=2;for(let i=0;i<=4;i++){g.beginPath();g.moveTo(i*128,0);g.lineTo(i*128,h);g.moveTo(0,i*128);g.lineTo(w,i*128);g.stroke()}noise(g,w,h,6)}),
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
const CSS=`.hallwrap .mz-lift{position:absolute;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;background:rgba(8,10,12,.55)}
.hallwrap .mz-liftb{display:flex;flex-direction:column;gap:8px;min-width:min(340px,calc(100% - 32px));max-width:calc(100% - 32px);padding:18px;border-radius:12px;background:#14171A;color:#F2F4F6;box-shadow:0 10px 40px rgba(0,0,0,.5)}
.hallwrap .mz-liftb b{font:600 18px/1.2 "Golos Text",system-ui,sans-serif}.hallwrap .mz-liftb>span{font-size:13px;color:#9FB0BA;margin-bottom:4px}
.hallwrap .mz-liftb button{min-height:44px;padding:8px 14px;border:1px solid #3A4046;border-radius:8px;background:#1E2226;color:#F2F4F6;font:500 15px "Golos Text",system-ui,sans-serif;text-align:left;cursor:pointer}
.hallwrap .mz-liftb button[aria-current="true"]{border-color:#7FE3CC;color:#7FE3CC}.hallwrap .mz-liftb button:focus-visible{outline:2px solid #7FE3CC;outline-offset:2px}.hallwrap .mz-liftb .mz-liftx{text-align:center;background:transparent}
.hallwrap .mz-arrp{position:absolute;left:10px;top:calc(64px + var(--mz-top,0px));z-index:12;width:min(330px,calc(100% - 20px));max-height:calc(100% - 190px);overflow:auto;padding:12px;border-radius:10px;background:rgba(20,23,26,.93);color:#F2F4F6;font:14px/1.35 "Golos Text",system-ui,sans-serif;pointer-events:auto}
.hallwrap .mz-arrh{display:flex;justify-content:space-between;align-items:center;gap:8px}.hallwrap .mz-arrh b{font-weight:600}
.hallwrap .mz-arrp button{min-height:44px;border:1px solid #3A4046;border-radius:8px;background:#1E2226;color:#F2F4F6;font:inherit;cursor:pointer;padding:6px 10px}
.hallwrap .mz-arrp button:disabled{opacity:.45;cursor:default}.hallwrap .mz-arrp button:focus-visible{outline:2px solid #7FE3CC;outline-offset:2px}
.hallwrap .mz-arrx{min-width:44px}.hallwrap .mz-arrhint{margin:8px 0;font-size:12.5px;color:#B9C4CA}.hallwrap .mz-arrs{margin:8px 0 0;font-size:13px;color:#7FE3CC;min-height:1.2em}.mz-arrs.err{color:#FF9C8A}
.hallwrap .mz-arrl{display:flex;flex-direction:column;gap:4px;max-height:220px;overflow:auto}.hallwrap .mz-arrl button{text-align:left;display:flex;flex-direction:column;align-items:flex-start}
.hallwrap .mz-arrl button small{color:#9FB0BA;font-size:11.5px}.hallwrap .mz-arrl button[aria-pressed="true"]{border-color:#E03A1E;background:#2A1C19}
.hallwrap .mz-arra{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.hallwrap.mz-world .mz-mus,.hallwrap.mz-world .mz-auth-b,.hallwrap.mz-world .mz-np{display:none!important}
.hallwrap .mz-arr{pointer-events:auto;display:flex;align-items:center;gap:6px;min-height:36px;padding:0 12px;border-radius:999px;border:1px solid rgba(255,255,255,.22);background:rgba(12,14,16,.74);color:#EEF1F3;font:500 12.5px/1.1 var(--f-body,system-ui),sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}
.hallwrap .mz-arr svg{width:16px;height:16px;flex:none}.hallwrap .mz-arr[hidden]{display:none}.hallwrap .mz-arr:focus-visible{outline:2px solid #E03A1E;outline-offset:2px}.hallwrap .mz-arr[aria-expanded="true"]{border-color:#E03A1E}
@media (pointer:coarse){.hallwrap .mz-arr{flex-direction:column;justify-content:center;gap:2px;min-width:50px;min-height:46px;padding:4px 6px;border-radius:14px;font-size:10.5px}.hallwrap .mz-arrp{top:calc(8px + var(--mz-top,0px));max-height:calc(100% - 250px)}}
.hallwrap .mz-pad{position:absolute;right:16px;bottom:66px;display:none;gap:12px;pointer-events:none}
.hallwrap .mz-pad button{pointer-events:auto;touch-action:none;width:64px;height:64px;min-width:48px;min-height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.28);background:rgba(12,14,16,.62);color:#EEF1F3;font:600 10.5px/1.15 system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
.hallwrap .mz-pad button b{font-size:20px;line-height:1;font-weight:600}
.hallwrap .mz-pad .mz-act[data-on="1"]{background:rgba(233,237,240,.92);color:#0E1013;border-color:#fff}
.hallwrap .mz-pad button:active{transform:scale(.94)}
.hallwrap.mz-tp .hud .cross{display:none}
@media (pointer:coarse){.hallwrap .mz-pad{display:flex}.hallwrap.mz .hud .near{bottom:186px;max-width:calc(100% - 32px)}}
@media (prefers-reduced-motion:reduce){.hallwrap .mz-pad button:active{transform:none}}
.hallwrap.mz .hud .where{top:calc(12px + var(--mz-top,0px));max-width:calc(100% - 290px);text-shadow:0 1px 2px rgba(0,0,0,.9),0 0 3px rgba(0,0,0,.6),0 1px 12px rgba(0,0,0,.55)}
.hallwrap .hallbar .mz-branch{border-style:dashed;border-color:rgba(255,255,255,.4)}
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
.hallwrap.mz .hud .keys{display:none;top:auto;left:auto;right:12px;bottom:100px;max-width:calc(100% - 24px);padding:6px 12px 8px;border-radius:8px;background:rgba(10,12,14,.78);color:#D5DBE0;text-shadow:none;text-align:left;overflow-y:auto;overscroll-behavior:contain;box-sizing:border-box}
.hallwrap .mz-kh{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:0 -6px 2px 0;pointer-events:auto;letter-spacing:.06em;text-transform:uppercase;color:#8E99A3}
.hallwrap .mz-kx{pointer-events:auto;min-width:26px;min-height:26px;padding:0;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:transparent;color:#EEF1F3;font:600 12px/1 system-ui,sans-serif;cursor:pointer}
.hallwrap .mz-kx:hover{background:rgba(255,255,255,.12)}.hallwrap .mz-kx:focus-visible{outline:2px solid #E03A1E;outline-offset:2px}
.hallwrap.mz.mz-keys .hud .keys{display:block}
.hallwrap .mz-title{position:absolute;left:50%;top:calc(22% + var(--mz-top,0px));transform:translateX(-50%);width:max-content;max-width:80%;text-align:center;color:#FFFFFF;opacity:0;transition:opacity .6s ease;pointer-events:none;text-shadow:0 2px 18px rgba(0,0,0,.6),0 0 2px rgba(0,0,0,.5)}
.hallwrap .mz-title.on{opacity:1}
.hallwrap .mz-title b{display:block;font:500 clamp(30px,4.4vw,52px)/1.1 var(--f-body,Georgia),serif}
.hallwrap .mz-title small{display:block;margin-top:8px;font:600 11.5px/1.3 var(--f-mono,monospace);letter-spacing:.1em;text-transform:uppercase}
.hallwrap .mz-title small.mz-hsnote{font:400 15px/1.4 var(--f-body,Georgia),serif;letter-spacing:0;text-transform:none;max-width:44ch;margin:8px auto 0}
.hallwrap .mz-fstop{position:absolute;right:12px;top:calc(12px + var(--mz-top,0px))}
.hallwrap .mz-map{position:absolute;right:12px;top:calc(56px + var(--mz-top,0px));pointer-events:auto;background:rgba(10,12,14,.76);border:1px solid rgba(255,255,255,.18);border-radius:8px;overflow:hidden;color:#E9EDF0}
.hallwrap .mz-map-t{display:flex;align-items:center;gap:6px;width:100%;min-height:26px;padding:4px 10px;border:0;background:transparent;color:inherit;font:600 11px/1 var(--f-mono,monospace);letter-spacing:.06em;cursor:pointer;text-align:left}
.hallwrap .mz-map-t i{font-style:normal;opacity:.7;margin-left:auto}
.hallwrap .mz-map canvas{display:block;width:232px;height:128px;cursor:pointer;touch-action:manipulation}
.hallwrap .mz-map[data-mz-open="0"] canvas{display:none}
@media (pointer:coarse){
.hallwrap.mz .hud .where{font-size:17px;max-width:calc(100% - 170px)}
.hallwrap .mz-fh,.hallwrap .mz-lf{display:none}
.hallwrap .mz-ls{display:inline}
.hallwrap .mz-ctl{bottom:auto;top:calc(64px + var(--mz-top,0px));right:10px}
.hallwrap .mz-view{border-radius:14px}
.hallwrap .mz-view button{flex-direction:column;justify-content:center;gap:2px;min-width:60px;min-height:46px;padding:4px 6px;border-radius:11px;font-size:10.5px}
.hallwrap .mz-help,.hallwrap.mz .hud .keys,.hallwrap.mz.mz-keys .hud .keys{display:none}
.hallwrap .mz-map{top:calc(74px + var(--mz-top,0px));right:10px}
.hallwrap .mz-fstop{right:10px;top:calc(10px + var(--mz-top,0px))}
.hallwrap .mz-map-t{min-height:44px;min-width:60px;justify-content:center}
.hallwrap .mz-map[data-mz-open="1"] .mz-map-t{justify-content:flex-start}
.hallwrap .mz-map canvas{width:200px}
.hallwrap .mz-title{top:calc(222px + var(--mz-top,0px))}
.hallwrap .mz-title b{font-size:26px}
.hallwrap .mz-title small{margin-top:5px;font-size:10.5px}}
@media (prefers-reduced-motion:reduce){.hallwrap .mz-title{transition:none}}
.mz-pv{position:fixed;inset:0;z-index:1001;display:grid;place-items:center;padding:16px;background:rgba(8,9,11,.92);overscroll-behavior:contain}
.hallwrap .mz-pv{position:absolute}
.mz-pv figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:10px;max-width:100%}
.mz-pv img{display:block;max-width:min(1160px,100%);max-height:calc(100dvh - 110px);object-fit:contain;box-shadow:0 18px 60px rgba(0,0,0,.6)}
.mz-pv figcaption{color:#E9EDF0;font:500 15px/1.3 var(--f-body,Georgia),serif}
.mz-pv .mz-pvx{position:absolute;top:12px;right:12px;min-width:44px;min-height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:rgba(12,14,16,.8);color:#EEF1F3;font-size:18px;cursor:pointer}
.mz-pv .mz-pvx:focus-visible{outline:2px solid #E03A1E;outline-offset:2px}
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
.hallwrap .mz-snd{flex-direction:column;justify-content:center;gap:2px;min-width:50px;min-height:46px;padding:4px 6px;border-radius:14px;font-size:10.5px}}
.hallwrap .mz-who{pointer-events:auto;display:flex;align-items:center;gap:6px;min-height:36px;padding:0 12px;border-radius:999px;border:1px solid rgba(255,255,255,.22);background:rgba(12,14,16,.74);color:#EEF1F3;font:500 12.5px/1.1 var(--f-body,system-ui),sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}
.hallwrap .mz-who svg{width:16px;height:16px;flex:none}
/* этап 11: микрофон */
.hallwrap .mz-mic{pointer-events:auto;display:flex;align-items:center;gap:6px;min-height:36px;padding:0 12px;border-radius:999px;border:1px dashed rgba(255,255,255,.3);background:rgba(12,14,16,.74);color:#9AA4AC;font:500 12.5px/1.1 var(--f-body,system-ui),sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}
.hallwrap .mz-mic svg{width:16px;height:16px;flex:none}
.hallwrap .mz-mic[aria-pressed="true"]{background:#E03A1E;border:1px solid #E03A1E;color:#fff}
.hallwrap .mz-mic:focus-visible{outline:2px solid #E03A1E;outline-offset:2px}
.hallwrap .mz-vnote{position:absolute;right:0;bottom:calc(100% + 6px);max-width:280px;padding:5px 10px;border-radius:8px;background:rgba(12,14,16,.84);color:#EEF1F3;font:500 12px/1.35 var(--f-body,system-ui),sans-serif;pointer-events:none}
/* на телефоне микрофон — круглая кнопка над «смотреть» (ряд кнопок справа сверху и так полон) */
.hallwrap .mz-pad .mz-mic{position:absolute;right:82px;bottom:74px;width:52px;height:52px;min-width:48px;min-height:48px;padding:0;flex-direction:column;justify-content:center;gap:2px;border-radius:50%;font-size:10px}
@media (pointer:coarse){.hallwrap .mz-vnote{bottom:auto;top:calc(100% + 6px)}}
.hallwrap .mz-who:focus-visible{outline:2px solid #E03A1E;outline-offset:2px}
.mz-cust{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:16px;background:rgba(8,9,11,.72);overscroll-behavior:contain;font:400 14px/1.35 var(--f-body,system-ui),sans-serif;color:#EEF1F3}
.mz-cust .mz-cbox{width:min(640px,100%);max-height:calc(100dvh - 32px);overflow:auto;overscroll-behavior:contain;background:#15181C;border:1px solid rgba(255,255,255,.16);border-radius:12px;padding:18px 20px;box-shadow:0 18px 60px rgba(0,0,0,.5)}
.mz-cust h3{margin:0;font:500 22px/1.2 var(--f-body,Georgia),serif;color:#FFFFFF}
.mz-cust .mz-chead p{margin:4px 0 12px;color:#AEB7BF;font-size:13px}
.mz-cust .mz-cmain{display:flex;gap:16px;align-items:center;margin-bottom:10px}
.mz-cust .mz-cprev{flex:none;width:150px;height:190px;border-radius:10px;background:radial-gradient(70% 60% at 50% 45%,#3A414A,#1B1F24)}
.mz-cust .mz-cprev canvas{display:block;width:100%;height:100%}
.mz-cust .mz-copts{display:flex;flex-direction:column;gap:10px;align-items:flex-start}
.mz-cust .mz-cseg{display:inline-flex;gap:2px;padding:3px;border-radius:999px;background:#0C0E10;border:1px solid rgba(255,255,255,.18)}
.mz-cust .mz-cseg button{min-height:36px;min-width:88px;padding:0 14px;border:0;border-radius:999px;background:transparent;color:#DDE3E8;font:500 13.5px/1 inherit;font-family:inherit;cursor:pointer}
.mz-cust .mz-cseg button[aria-pressed="true"]{background:#EEF1F3;color:#0E1013}
.mz-cust .mz-cchk{display:inline-flex;align-items:center;gap:8px;min-height:36px;cursor:pointer;color:#DDE3E8}
.mz-cust .mz-cchk input{width:20px;height:20px;accent-color:#E03A1E;margin:0}
.mz-cust [hidden]{display:none!important}
.mz-cust .mz-crows{display:grid;gap:8px}
.mz-cust .mz-cline{display:grid;grid-template-columns:118px 1fr;gap:10px;align-items:center}
.mz-cust .mz-clab{font:600 11px/1.2 var(--f-mono,monospace);letter-spacing:.06em;text-transform:uppercase;color:#AEB7BF}
.mz-cust .mz-csw{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.mz-cust .mz-cs,.mz-cust .mz-cnone,.mz-cust .mz-cpick{position:relative;flex:none;width:30px;height:30px;border-radius:50%;border:2px solid rgba(255,255,255,.18);background:var(--c,#333);padding:0;cursor:pointer}
.mz-cust .mz-cnone{width:auto;min-width:44px;border-radius:999px;background:#0C0E10;color:#DDE3E8;font:500 12px/1 inherit;font-family:inherit;padding:0 10px}
.mz-cust .mz-cpick{display:inline-block;overflow:hidden;background:conic-gradient(#E0533D,#E0A030,#5B8C5A,#2E5EAA,#7A4E8C,#E0533D)}
.mz-cust .mz-cpick input{position:absolute;inset:-6px;width:calc(100% + 12px);height:calc(100% + 12px);opacity:0;cursor:pointer;border:0;padding:0}
.mz-cust [aria-pressed="true"].mz-cs,.mz-cust [aria-pressed="true"].mz-cnone,.mz-cust .mz-cpick.on{border-color:#FFFFFF;box-shadow:0 0 0 2px #E03A1E}
.mz-cust button:focus-visible,.mz-cust .mz-cpick:focus-within,.mz-cust .mz-cchk:focus-within{outline:2px solid #E03A1E;outline-offset:2px}
.mz-cust .mz-cbtns{display:flex;justify-content:flex-end;gap:10px;margin-top:14px}
.mz-cust .mz-cbtns button{min-height:40px;padding:0 18px;border-radius:999px;border:1px solid rgba(255,255,255,.3);background:transparent;color:#EEF1F3;font:500 14px/1 inherit;font-family:inherit;cursor:pointer}
.mz-cust .mz-cbtns .mz-cdone{background:#EEF1F3;color:#0E1013;border-color:#EEF1F3}
@media (max-width:560px),(pointer:coarse){
.mz-cust{padding:0;place-items:stretch}
.mz-cust .mz-cbox{width:100%;max-height:100dvh;border-radius:0;border:0;padding:12px 14px calc(12px + env(safe-area-inset-bottom))}
.mz-cust h3{font-size:19px}.mz-cust .mz-chead p{margin:2px 0 8px;font-size:12px}
.mz-cust .mz-cmain{gap:12px;margin-bottom:8px}.mz-cust .mz-cprev{width:112px;height:140px}
.mz-cust .mz-copts{gap:6px}.mz-cust .mz-cseg button{min-height:44px;min-width:84px}.mz-cust .mz-cchk{min-height:44px}
.mz-cust .mz-crows{gap:6px}.mz-cust .mz-cline{grid-template-columns:72px minmax(0,1fr);gap:6px}.mz-cust .mz-clab{font-size:10px;letter-spacing:.03em}
.mz-cust .mz-csw{flex-wrap:nowrap;overflow-x:auto;overscroll-behavior-x:contain;scrollbar-width:none;padding:3px 2px}.mz-cust .mz-csw::-webkit-scrollbar{display:none}
.mz-cust .mz-cs,.mz-cust .mz-cpick{width:44px;height:44px}.mz-cust .mz-cnone{min-height:44px;height:44px}
.mz-cust .mz-cbtns{margin-top:10px}.mz-cust .mz-cbtns button{min-height:48px;flex:1}}
@media (pointer:coarse){.hallwrap .mz-who{flex-direction:column;justify-content:center;gap:2px;min-width:50px;min-height:46px;padding:4px 6px;border-radius:14px;font-size:10.5px}}
.hallwrap .mz-mus,.hallwrap .mz-auth-b{pointer-events:auto;display:flex;align-items:center;gap:6px;min-height:36px;padding:0 12px;border-radius:999px;border:1px solid rgba(255,255,255,.22);background:rgba(12,14,16,.74);color:#EEF1F3;font:500 12.5px/1.1 var(--f-body,system-ui),sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}
.hallwrap .mz-mus svg,.hallwrap .mz-auth-b svg{width:16px;height:16px;flex:none}
.hallwrap .mz-mus[aria-pressed="false"]{color:#9AA4AC;border-style:dashed}
.hallwrap .mz-mus[hidden],.hallwrap .mz-auth-b[hidden],.hallwrap .mz-np[hidden]{display:none}
.hallwrap .mz-mus:focus-visible,.hallwrap .mz-auth-b:focus-visible,.hallwrap .mz-np button:focus-visible{outline:2px solid #E03A1E;outline-offset:2px}
.hallwrap .mz-np{position:absolute;left:12px;bottom:54px;display:flex;align-items:center;gap:4px;max-width:min(380px,calc(100% - 520px));min-width:0;padding:3px;border-radius:999px;background:rgba(12,14,16,.74);border:1px solid rgba(255,255,255,.2);color:#E9EDF0;pointer-events:auto;font:500 12px/1.2 var(--f-body,system-ui),sans-serif}
.hallwrap .mz-np button{flex:none;min-width:30px;height:30px;border:0;border-radius:999px;background:transparent;color:inherit;font:600 15px/1 system-ui,sans-serif;cursor:pointer;padding:0 6px}
.hallwrap .mz-np button:disabled{opacity:.35;cursor:default}
.hallwrap .mz-np .mz-npt{background:rgba(255,255,255,.1)}
.hallwrap .mz-npn{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 4px}
.hallwrap .mz-np[data-c="1"] .mz-npn,.hallwrap .mz-np[data-c="1"] .mz-npb{display:none}
@media (pointer:coarse){
.hallwrap .mz-ctl{flex-wrap:wrap;justify-content:flex-end;max-width:206px}
.hallwrap .mz-mus,.hallwrap .mz-auth-b{flex-direction:column;justify-content:center;gap:2px;min-width:50px;min-height:46px;padding:4px 6px;border-radius:14px;font-size:10.5px}
.hallwrap .mz-map{top:calc(174px + var(--mz-top,0px))}
.hallwrap .mz-np{left:10px;bottom:auto;top:calc(96px + var(--mz-top,0px));max-width:calc(100% - 236px)}
.hallwrap .mz-np button{min-width:44px;height:44px}
.hallwrap .mz-title{top:calc(282px + var(--mz-top,0px))}}
.mz-auth .mz-abox{width:min(760px,100%)}
.mz-auth .mz-ahead{display:flex;align-items:center;justify-content:space-between;gap:12px}
.mz-auth .mz-ax{min-width:40px;min-height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:transparent;color:#EEF1F3;font-size:16px;cursor:pointer}
.mz-auth .mz-anote{margin:6px 0 12px;color:#AEB7BF;font-size:13px}
.mz-auth .mz-asecs{display:grid;gap:10px}
.mz-auth section{border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:10px 12px;background:#101317}
.mz-auth h4{margin:0 0 6px;font:500 15px/1.2 var(--f-body,Georgia),serif}.mz-auth h4 small{font:500 10.5px var(--f-mono,monospace);color:#8E99A3;margin-left:6px}
.mz-auth .mz-alist{margin:0 0 8px;padding:0;list-style:none;display:grid;gap:4px;counter-reset:t}
.mz-auth .mz-alist li{display:flex;align-items:center;gap:8px;justify-content:space-between;padding:4px 6px;border-radius:6px;background:rgba(255,255,255,.04);counter-increment:t}
.mz-auth .mz-alist li::before{content:counter(t) ".";font:500 11px var(--f-mono,monospace);color:#8E99A3}
.mz-auth .mz-alist li.mz-aempty{color:#8E99A3;font-size:12.5px;background:none}.mz-auth .mz-alist li.mz-aempty::before{content:none}
.mz-auth .mz-atn{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mz-auth .mz-abts{display:flex;gap:4px;flex:none}
.mz-auth button{font-family:inherit}
.mz-auth .mz-abts button,.mz-auth .mz-aadd button{min-width:36px;min-height:34px;padding:0 10px;border-radius:8px;border:1px solid rgba(255,255,255,.22);background:#1B2026;color:#EEF1F3;font-size:12.5px;cursor:pointer}
.mz-auth .mz-abts button:disabled{opacity:.35;cursor:default}
.mz-auth .mz-abts button[aria-pressed="true"]{background:#EEF1F3;color:#0E1013}
.mz-auth .mz-aadd{display:flex;gap:6px;margin-bottom:8px}.mz-auth select{flex:1;min-width:0;min-height:34px;border-radius:8px;background:#1B2026;color:#EEF1F3;border:1px solid rgba(255,255,255,.22);font:inherit;font-size:12.5px;padding:0 8px}
.mz-auth .mz-aset{display:flex;flex-wrap:wrap;gap:6px 16px;align-items:center;font-size:12.5px;color:#C7CED5}.mz-auth .mz-aset label{display:inline-flex;align-items:center;gap:6px;min-height:34px}
.mz-auth .mz-aset input[type=range]{width:130px;accent-color:#E03A1E}.mz-auth .mz-aset input[type=checkbox]{width:18px;height:18px;accent-color:#E03A1E;margin:0}.mz-auth output{font:500 11px var(--f-mono,monospace);min-width:3.2em}
.mz-auth .mz-ata{width:100%;height:120px;margin-top:10px;background:#0C0E10;color:#C7CED5;border:1px solid rgba(255,255,255,.2);border-radius:8px;font:11px/1.4 var(--f-mono,monospace)}
.mz-auth .mz-amsg{min-height:1.3em;margin:8px 0 0;font-size:12.5px;color:#9FE6C0}
.mz-auth .mz-cbtns{flex-wrap:wrap;position:sticky;bottom:-18px;background:#15181C;padding:10px 0 4px}
@media (max-width:560px),(pointer:coarse){.mz-auth .mz-abts button,.mz-auth .mz-aadd button,.mz-auth select,.mz-auth .mz-aset label{min-height:44px}.mz-auth .mz-abts button{min-width:44px}.mz-auth .mz-ax{min-width:44px;min-height:44px}.mz-auth .mz-alist li{flex-wrap:wrap}.mz-auth .mz-cbtns{bottom:-12px}}
/* этап 7: на весь экран */
.hallwrap .mz-fsb{pointer-events:auto;display:flex;align-items:center;gap:6px;min-height:36px;padding:0 12px;border-radius:999px;border:1px solid rgba(255,255,255,.22);background:rgba(12,14,16,.74);color:#EEF1F3;font:500 12.5px/1.1 var(--f-body,system-ui),sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}
.hallwrap .mz-fsb svg{width:16px;height:16px;flex:none}
.hallwrap .mz-fsb[aria-pressed="true"]{background:#EEF1F3;color:#0E1013}
.hallwrap .mz-fsb:focus-visible{outline:2px solid #E03A1E;outline-offset:2px}
.hallwrap.mz-full{border-radius:0;width:100%;height:100%}
.hallwrap.mz-full canvas{height:100%}
.hallwrap:fullscreen{width:100vw;height:100vh;background:#0B0C0E}
.hallwrap.mz-fill{position:fixed;inset:0;z-index:900;width:100vw;height:100vh;height:100dvh;overscroll-behavior:contain}
.hallwrap.mz-fill .hud{top:env(safe-area-inset-top,0px);right:env(safe-area-inset-right,0px);bottom:env(safe-area-inset-bottom,0px);left:env(safe-area-inset-left,0px)}
.hallwrap .mz-chat{position:absolute;left:12px;top:calc(118px + var(--mz-top,0px));width:min(330px,calc(100% - 290px));display:flex;flex-direction:column;align-items:flex-start;gap:6px;pointer-events:none;font:400 13px/1.35 var(--f-body,system-ui),sans-serif;color:#EEF1F3}
.hallwrap .mz-chat[hidden]{display:none}
.hallwrap .mz-chatt{pointer-events:auto;display:flex;align-items:center;gap:6px;min-height:32px;max-width:100%;padding:0 12px;border-radius:999px;border:1px solid rgba(255,255,255,.22);background:rgba(12,14,16,.78);color:#EEF1F3;font:500 12.5px/1.1 var(--f-body,system-ui),sans-serif;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hallwrap .mz-chatt i{font-style:normal;transition:transform .2s}.hallwrap .mz-chat[data-mzc="0"] .mz-chatt i{transform:rotate(-90deg)}
.hallwrap .mz-chat[data-mzc="0"] .mz-chatb{display:none}
.hallwrap .mz-chatb{pointer-events:auto;align-self:stretch;background:rgba(12,14,16,.8);border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:8px 10px;user-select:text;-webkit-user-select:text}
.hallwrap .mz-chatl{max-height:132px;overflow:auto;display:grid;gap:3px;margin-bottom:6px;overscroll-behavior:contain}
.hallwrap .mz-chm{overflow-wrap:anywhere}.hallwrap .mz-chm b{font-weight:600;color:#9EC2F2}.hallwrap .mz-chm.me b{color:#FF8A70}.hallwrap .mz-che{color:#9AA4AC}
.hallwrap .mz-chatf{display:flex;gap:6px}
.hallwrap .mz-chatf input{flex:1;min-width:0;min-height:34px;border-radius:8px;border:1px solid rgba(255,255,255,.25);background:#0C0E10;color:#EEF1F3;font:inherit;font-size:16px;padding:0 9px}
.hallwrap .mz-chatf button{min-height:34px;padding:0 12px;border-radius:8px;border:1px solid rgba(255,255,255,.25);background:#EEF1F3;color:#0E1013;font:500 13px var(--f-body,system-ui),sans-serif;cursor:pointer}
.hallwrap .mz-chatf input:focus-visible,.hallwrap .mz-chatf button:focus-visible,.hallwrap .mz-chatt:focus-visible{outline:2px solid #E03A1E;outline-offset:2px}
.hallwrap .mz-chatm{margin:4px 0 0;font-size:12px;color:#F2C7A0;min-height:0}.hallwrap .mz-chatm:empty{display:none}
@media (pointer:coarse){
.hallwrap .mz-fsb{flex-direction:column;justify-content:center;gap:2px;min-width:50px;min-height:46px;padding:4px 6px;border-radius:14px;font-size:10.5px}
.hallwrap .mz-chat{left:10px;width:auto;max-width:calc(100% - 96px);top:calc(176px + var(--mz-top,0px))}
.hallwrap .mz-chat[data-mzc="1"]{right:10px;max-width:none;top:calc(228px + var(--mz-top,0px))}
.hallwrap .mz-chatt{min-height:44px}
.hallwrap .mz-chatl{max-height:min(150px,22vh)}
.hallwrap .mz-chatf input,.hallwrap .mz-chatf button{min-height:44px}}
@media (pointer:coarse) and (max-height:500px){.hallwrap .mz-chat,.hallwrap .mz-chat[data-mzc="1"]{left:140px;right:auto;max-width:none;width:calc(100% - 366px);top:calc(8px + var(--mz-top,0px))}.hallwrap .mz-chatl{max-height:64px}}`;
let styleUsers=0;
function injectStyle(){styleUsers++;if(document.getElementById(STYLE_ID))return;const st=document.createElement("style");st.id=STYLE_ID;st.textContent=CSS;document.head.appendChild(st)}
function releaseStyle(){styleUsers=Math.max(0,styleUsers-1);if(!styleUsers){const st=document.getElementById(STYLE_ID);if(st)st.remove()}}
const angDiff=(a,b)=>{let d=b-a;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return d};

/* ---------- этап 6Б: облик персонажа. Строка облика (поле k присутствия, ключ cv2_mz_look) — ровно 40 знаков:
   [m|f] пресет · [s|p] юбка/брюки · [t|n] хвост · [h|n] головной убор · затем шесть цветов по 6 hex: убор, верх, низ, обувь, волосы, кожа ---------- */
const LOOK_RE=/^[mf][sp][tn][hn][0-9a-f]{36}$/;
const LOOK_KEYS=["hat","top","bot","shoe","hair","skin"];
const PAL={
 hat:[["2a5f6b","морская волна"],["c8553d","терракотовый"],["e0a030","горчичный"],["2e5eaa","синий"],["1e2a3a","тёмно-синий"],["f2f0ea","белый"],["2b2d31","графитовый"],["b23a48","малиновый"],["5b8c5a","зелёный"]],
 top:[["3f7f8e","бирюзовый"],["c8553d","терракотовый"],["e0a030","горчичный"],["2e5eaa","синий"],["5b8c5a","зелёный"],["7a4e8c","сливовый"],["d8d3c8","овсяный"],["2b2d31","графитовый"],["b23a48","малиновый"]],
 bot:[["2f3438","графитовый"],["3b4a6b","деним"],["6b5b4b","коричневый"],["8a8f94","серый"],["1e2a3a","тёмно-синий"],["5e6b3e","оливковый"],["a8743b","песочный"],["7a2e35","винный"],["e9e4da","кремовый"]],
 shoe:[["1b1d20","чёрный"],["f2f0ea","белый"],["7a4a2a","коричневый"],["3b4a6b","синий"],["c8553d","терракотовый"],["8a8f94","серый"],["2e5eaa","ярко-синий"],["d9b44a","жёлтый"]],
 hair:[["1c1a18","чёрный"],["3a2a1e","тёмно-каштановый"],["6b4630","каштановый"],["a0703f","русый"],["d9b46a","светлый"],["b5532e","рыжий"],["8c8c8c","седой"],["ededed","белый"]],
 skin:[["f1dcc6","светлый"],["e6d2ba","светло-бежевый"],["d2ae8c","бежевый"],["b98a63","смуглый"],["8e6043","тёмный"],["5e3e2c","очень тёмный"]]};
const LOOK_DEF={m:{p:"m",b:"p",t:"n",h:"h",c:{hat:"2a5f6b",top:"3f7f8e",bot:"2f3438",shoe:"1b1d20",hair:"3a2a1e",skin:"e6d2ba"}},
  f:{p:"f",b:"s",t:"n",h:"n",c:{hat:"b23a48",top:"c8553d",bot:"1e2a3a",shoe:"1b1d20",hair:"6b4630",skin:"e6d2ba"}}};
const lookStr=L=>L.p+L.b+L.t+L.h+LOOK_KEYS.map(k=>L.c[k]).join("");
function lookParse(s){if(typeof s!=="string"||!LOOK_RE.test(s))return null;const c={};LOOK_KEYS.forEach((k,i)=>c[k]=s.slice(4+i*6,10+i*6));
  return {p:s[0],b:s[0]==="m"?"p":s[1],t:s[0]==="m"?"n":s[2],h:s[3],c}}
const lookCopy=L=>({p:L.p,b:L.b,t:L.t,h:L.h,c:Object.assign({},L.c)});
/* фигура: коробочный человечек. Без облика — как раньше (цвет по посетителю, кепка); с обликом — цвета по частям, волосы, юбка */
function figKit(T,shadowTex){
  const FG={head:new T.BoxGeometry(.34,.32,.32),eye:new T.BoxGeometry(.05,.065,.02),cap:new T.BoxGeometry(.37,.08,.35),brim:new T.BoxGeometry(.24,.03,.13),
    torso:new T.BoxGeometry(.46,.54,.26),badge:new T.BoxGeometry(.1,.07,.012),arm:new T.BoxGeometry(.13,.46,.14),hand:new T.BoxGeometry(.12,.1,.12),
    leg:new T.BoxGeometry(.17,.58,.19),shoe:new T.BoxGeometry(.18,.08,.25),blob:new T.PlaneGeometry(.9,.9),
    hairTop:new T.BoxGeometry(.36,.07,.34),hairBack:new T.BoxGeometry(.36,.2,.06),hairLong:new T.BoxGeometry(.38,.5,.07),hairSide:new T.BoxGeometry(.05,.34,.22),
    tail:new T.BoxGeometry(.1,.3,.1),skirt:new T.CylinderGeometry(.27,.36,.32,4,1).rotateY(Math.PI/4).scale(1,1,.68)};
  const mat=c=>new T.MeshLambertMaterial({color:c});
  const FM={skin:mat(0xE6D2BA),pants:mat(0x2F3438),shoe:mat(0x1B1D20),eye:new T.MeshBasicMaterial({color:0x1A1A1C}),badge:new T.MeshBasicMaterial({color:0xF4F1EA}),
    blob:shadowTex?new T.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false}):null};
  function figure(color,look){
    const L=look&&look.c?look:null,hx=k=>new T.Color("#"+L.c[k]);
    const col=new T.Color(L?"#"+L.c.top:color),cm=mat(col),capm=mat(L?hx("hat"):col.clone().offsetHSL(0,.05,-.16));
    const skin=L?mat(hx("skin")):FM.skin,bot=L?mat(hx("bot")):FM.pants,shoe=L?mat(hx("shoe")):FM.shoe,hair=L?mat(hx("hair")):null;
    const skirt=!!(L&&L.p==="f"&&L.b==="s"),hat=!L||L.h==="h";
    const g=new T.Group(),body=new T.Group();g.add(body);const parts={hair:[],cap:[],skirt:null,tail:null};
    const m=(geo,mm,x,y,z,par)=>{const me=new T.Mesh(geo,mm);me.position.set(x,y,z);(par||body).add(me);return me};
    const torso=m(FG.torso,cm,0,.9,0);m(FG.badge,FM.badge,.11,.08,-.136,torso);
    const head=new T.Group();head.position.set(0,1.18,0);body.add(head);
    m(FG.head,skin,0,.17,0,head);m(FG.eye,FM.eye,-.08,.19,-.166,head);m(FG.eye,FM.eye,.08,.19,-.166,head);
    if(hat){parts.cap.push(m(FG.cap,capm,0,.36,0,head),m(FG.brim,capm,0,.335,-.22,head))}
    if(L){if(!hat)parts.hair.push(m(FG.hairTop,hair,0,.36,.0,head));
      if(L.p==="m")parts.hair.push(m(FG.hairBack,hair,0,.24,.17,head));
      else if(L.t==="t"){parts.hair.push(m(FG.hairBack,hair,0,.24,.17,head));const tl=m(FG.tail,hair,0,.16,.25,head);tl.rotation.x=.35;parts.tail=tl;parts.hair.push(tl)}
      else{parts.hair.push(m(FG.hairLong,hair,0,.1,.175,head));[-1,1].forEach(s=>parts.hair.push(m(FG.hairSide,hair,s*.185,.17,.05,head)))}}
    const limb=(x,y,geo,mm,ext,extm,ey,ez)=>{const pv=new T.Group();pv.position.set(x,y,0);body.add(pv);m(geo,mm,0,-geo.parameters.height/2,0,pv);m(ext,extm,0,ey,ez,pv);return pv};
    const armL=limb(-.3,1.13,FG.arm,cm,FG.hand,skin,-.5,0),armR=limb(.3,1.13,FG.arm,cm,FG.hand,skin,-.5,0);
    const legM=skirt?skin:bot;
    const legL=limb(-.11,.62,FG.leg,legM,FG.shoe,shoe,-.58,-.03),legR=limb(.11,.62,FG.leg,legM,FG.shoe,shoe,-.58,-.03);
    if(skirt)parts.skirt=m(FG.skirt,bot,0,.5,0);
    let blob=null;if(FM.blob){blob=new T.Mesh(FG.blob,FM.blob);blob.rotation.x=-Math.PI/2;blob.position.y=.013;g.add(blob)}
    const mats=[cm,capm];if(L)mats.push(skin,bot,shoe,hair);
    g.userData.fig={body,head,armL,armR,legL,legR,blob,ph:0,sw:0,air:0,mats,parts,look:L?lookStr(L):"",M:{top:cm,cap:capm,skin,bot,shoe,hair}};return g}
  const dispose=()=>{Object.values(FG).forEach(g=>g.dispose());Object.values(FM).forEach(m=>m&&m.dispose())};
  return {FG,FM,figure,dispose}}

/* ---------- сборка ---------- */
/* этап 12: оформление залов книги (данные hall_styles; форма — server/SPACES.md). Проверка при чтении: неверное отбрасывается, зал не ломается */
const HS_K=["kv","pr","id","sv","dv","ot","se","n","kl","kr","hb"];
const hsUrlOk=u=>typeof u==="string"&&u.length<=600&&u.indexOf("..")<0&&/^(https:\/\/[A-Za-z0-9.\-]+(:\d+)?\/[^\s"'<>()\\]*|img\/[A-Za-z0-9_\-\/.]+)$/.test(u);
const hsN=(v,a,b,d)=>{v=+v;return isFinite(v)?Math.max(a,Math.min(b,v)):d};
function hsValid(m){const out={};if(!m||typeof m!=="object")return out;HS_K.forEach(k=>{const d=m[k];if(!d||typeof d!=="object"||Array.isArray(d))return;const o={};
  ["wall","floor","ceil"].forEach(p=>{const s=d[p];if(!s||typeof s!=="object")return;const c=/^#[0-9a-fA-F]{6}$/.test(s.color||"")?s.color:null,img=hsUrlOk(s.img)?s.img:null;if(c||img)o[p]={color:c,img,mode:s.mode==="stretch"?"stretch":"tile"}});
  if(Array.isArray(d.paintings)){const P=d.paintings.filter(p=>p&&typeof p==="object"&&hsUrlOk(p.img)).slice(0,12).map(p=>({img:p.img,title:typeof p.title==="string"?p.title.slice(0,120):"",wall:typeof p.wall==="string"&&p.wall.length===1&&"nsew".indexOf(p.wall)>=0?p.wall:"n",u:hsN(p.u,-40,40,0),w:hsN(p.w,.2,6,1.4),h:hsN(p.h,.2,6,1.05),y:hsN(p.y,.3,8,1.5)}));if(P.length)o.paintings=P}
  if(["warm","cool","neutral"].indexOf(d.light)>=0)o.light=d.light;if(typeof d.note==="string"&&d.note.trim())o.note=d.note.trim().slice(0,300);
  if(Object.keys(o).length)out[k]=o});return out}
/* место картины на стене длиной L и высотой H: размер и сдвиг ограничены стеной; если картина перекрывает проём (dr=[ширина,высота,сдвиг]) — отодвигается вбок, а если сбоку не помещается — поднимается над проёмом */
function hsFit(p,L,H,dr){const w=Math.min(p.w,L-.3),h=Math.min(p.h,H-.4),lo=-L/2+w/2+.1,hi_=L/2-w/2-.1;let u=Math.max(lo,Math.min(hi_,p.u)),y=Math.max(h/2+.1,Math.min(H-h/2-.1,p.y));
  /* этап 13: проёмов в стене может быть несколько (ветки залов автора) — dr: [ш,в,сдвиг] или список таких */
  (!dr?[]:Array.isArray(dr[0])?dr:[dr]).forEach(dr=>{if(Math.abs(u-dr[2])<(w+dr[0])/2+.1&&y-h/2<dr[1]+.05){const a=dr[2]-(dr[0]+w)/2-.15,b=dr[2]+(dr[0]+w)/2+.15,c=[a,b].filter(x=>x>=lo&&x<=hi_).sort((x,z)=>Math.abs(x-u)-Math.abs(z-u));
    if(c.length)u=c[0];else if(dr[1]+h+.2<=H-.1)y=dr[1]+h/2+.1}});return {u,y,w,h}}
/* ---------- этап 13: залы автора сайта (строки spaces с kind="hall", server/SPACES.md) ----------
   На этажах-коридорах — комната за дверью коридора, порядок и сторона — hall.dock {after, side}. В музее книги — боковая ветка:
   проём BR_DW × BR_DH в стене зала анфилады, короткий коридор-стык длиной BR_LS и комната по пресету (дверь — в её южной стене, длинная сторона — вдоль стены зала).
   DOCKF — где в стенах можно сделать проём: допустимые центры проёма, м от входа в зал (для стены «s» зала kv — x центра). Посчитано один раз лучами
   из зала к стене на высотах 0,3…2,9 м (свободно 1,2 м по обе стороны от центра и 1,6 м вглубь зала: без стеллажей, витрин, картин, табличек, лифта, проёмов).
   Свободное место снаружи (не пересечь другие залы, «Базу», ветку квартир с местом под будущие квартиры, другие ветки) проверяет brClash по размеру комнаты */
const BR_DW=1.6,BR_DH=2.5,BR_LS=1.6;
const ZS=(()=>{let z=0;return SPEC.map(s=>{const z0=z;z-=s.D;return [z0,z,s.tall?8.5:(s.k==="pr"||s.k==="sv"||s.k==="dv"?4.6:4.2)]})})();
const DOCKF={kv:{e:[[4.5,11.1],[19.3,22.6]],w:[[9.2,11],[15.6,17.3],[20.3,21.4]],s:[[-2.8,1.1],[4.1,6.7]]},pr:{e:[[1.3,1.7]],w:[[14,16.6]]},sv:{e:[[3.1,3.9],[10.1,10.9]],w:[[10.1,10.9]]},
  dv:{e:[[1.3,1.8],[11.9,16.7]],w:[[8.3,8.8]]},ot:{e:[[1.3,1.5],[12.6,12.6]],w:[[4.7,7.5],[13.6,14.7]]},se:{e:[[1.3,2.6],[9.3,10.7]]},n:{e:[[1.3,5.8],[12.3,13.3],[16.6,16.7]],w:[[11.4,16.7]]},
  kl:{e:[[5.8,6.3],[13.9,14.7]],w:[[4.7,5.5],[14.1,14.7]]}};
const fP=(F,x,z)=>{const c=Math.round(Math.cos(F.rot)),s=Math.round(Math.sin(F.rot));return [F.ox+x*c+z*s,F.oz-x*s+z*c]};
const fR=(F,x0,z0,x1,z1)=>{const a=fP(F,x0,z0),b=fP(F,x1,z1);return [Math.min(a[0],b[0]),Math.max(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[1],b[1])]};
const OCC=[[-HW-.2,HW+.2,ZS[NH-1][1]-.2,.2,"анфилада залов"],[BASE.xm,BASE2.x1+.4,Math.min(BASE.z1,BASE2.z1)-.4,Math.max(BASE.z0,BASE2.z0)+.4,"«База Героев»"],[-26,-HW-.15,-25.5,.3,"ветка квартир"]];
const isHallRow=s=>!!s&&s.kind==="hall"&&!!s.hall&&typeof s.hall==="object";
/* геометрия ветки зала автора по hall.dock {hall, wall, at}: F — система координат комнаты (как у комнат посетителей: начало у двери, −z вглубь) */
function brGeo(s){const d=isHallRow(s)&&s.hall.dock;if(!d||!d.hall)return null;const i=SPEC.findIndex(x=>x.k===d.hall),at=+d.at;if(i<0||!isFinite(at)||d.at===null)return null;
  const [z0,z1,H]=ZS[i],r=s.room||{},w=+r.w||9,dd=+r.d||7,h=+r.h||3.5,m=BR_DW/2+.4;let F,c;
  if(d.wall==="e"||d.wall==="w"){const g=d.wall==="e"?1:-1;c=z0-at;if(c>z0-m||c<z1+m)return null;F={ox:g*(HW+BR_LS),oz:c,rot:-g*Math.PI/2}}
  else if(d.wall==="s"&&i===0&&Math.abs(at)<=HW-m){c=at;F={ox:c,oz:BR_LS,rot:Math.PI}}
  else return null;
  return {s,i,k:d.hall,wall:d.wall,at,c,F,w,d:dd,h,H,room:fR(F,-w/2,0,w/2,-dd),stub:fR(F,-BR_DW/2,BR_LS,BR_DW/2,0)}}
const ovl=(a,b,m)=>a[0]<b[1]+m&&a[1]>b[0]-m&&a[2]<b[3]+m&&a[3]>b[2]-m;
/* с чем пересекается ветка: список названий (пусто — место свободно) */
function brClash(g,others){const why=[];OCC.forEach((o,j)=>{if(ovl(g.room,o,.3)||(j>0&&ovl(g.stub,o,.1)))why.push(o[4])});
  (others||[]).forEach(q=>{if(q&&q.s.id!==g.s.id&&(ovl(g.room,q.room,.3)||ovl(g.room,q.stub,.2)||ovl(g.stub,q.room,.2)||ovl(g.stub,q.stub,.6)))why.push("«"+(q.s.title||"зал автора")+"»")});return why}
/* свободные места для ветки с комнатой room ({w,d}) при уже стоящих залах rows (кроме except): [{k, wall, pos:[at…]}] */
function dockSpots(rows,room,except){const G=(rows||[]).filter(s=>s&&s.id!==except).map(brGeo).filter(Boolean),out=[];
  Object.keys(DOCKF).forEach(k=>Object.keys(DOCKF[k]).forEach(wall=>{const P=[];DOCKF[k][wall].forEach(([a,b])=>{P.push(a);for(let t=Math.ceil(a*2+.01)/2;t<b-.05;t+=.5)P.push(+t.toFixed(1));if(b>a)P.push(b)});
    const ok=P.filter(at=>{const g=brGeo({id:except||"_new",kind:"hall",hall:{dock:{hall:k,wall,at}},room});return g&&!brClash(g,G).length});if(ok.length)out.push({k,wall,pos:ok})}));return out}
/* порядок дверей коридора этажа: пространства посетителей — по времени создания; залы автора — после указанной комнаты (after: id | "start" | null — в конец);
   сторона: l / r — как задано, auto — по очереди с остальными «auto» (без залов раскладка та же, что раньше) */
function corrPlan(sp,CW,LZ,WT){CW=CW||1.5;LZ=LZ||5;WT=WT||.15;sp=(sp||[]).filter(s=>s&&s.id&&s.room&&+s.room.w>0&&+s.room.d>0);
  const dk=s=>isHallRow(s)&&s.hall.dock&&!s.hall.dock.hall?s.hall.dock:null,seq=sp.filter(s=>!dk(s));let rest=sp.filter(dk),nS=0,g=0;
  while(rest.length&&g++<60){const left=[];rest.forEach(h=>{const a=dk(h).after;if(a==="start")seq.splice(nS++,0,h);else if(!a)seq.push(h);else{const j=seq.findIndex(x=>x.id===a);if(j>=0)seq.splice(j+1,0,h);else if(rest.some(x=>x.id===a&&x!==h))left.push(h);else seq.push(h)}});
    if(left.length===rest.length){seq.push(...left);break}rest=left}
  const cur=[-LZ-.8,-LZ-.8];let na=0;
  const RS=seq.map((s,i)=>{const d=dk(s),side=d&&d.side==="l"?0:d&&d.side==="r"?1:(na++)%2,w=+s.room.w,zc=cur[side]-w/2-WT;cur[side]-=w+2*WT+.5;return {s,r:s.room,side,zc,i,w}});
  return {RS,LC:RS.length?Math.max(12,-Math.min(cur[0],cur[1])+1.2):10}}
let LAST_BR=[];
function mount(host,opt){
  const T=window.THREE;
  /* этап 8, часть 2: opt.world — этаж посетителей вместо музея книги (тот же движок); без него — музей книги, как раньше */
  const WORLD=opt&&opt.world&&typeof opt.world==="object"?opt.world:null,BOOK=!WORLD;if(WORLD)opt=Object.assign({objs:[],book:{},halls:{}},opt);if(BOOK)LAST_BR=Array.isArray(opt.branches)?opt.branches.slice():[];
  host.innerHTML=`<div class="hallwrap"><canvas tabindex="0" aria-label="Музей: трёхмерные залы"></canvas><div class="hud"><div class="where"><small></small><span></span><div class="mz-found"></div></div><div class="mz-title" role="status" aria-live="polite"></div><div class="keys" id="mz-keys"><div class="mz-kh"><span>подсказки</span><button type="button" class="mz-kx" aria-label="Закрыть подсказки" title="Закрыть подсказки">✕</button></div><span class="mz-k0">клик — управлять мышью</span><br>WASD, ↑/↓ — идти · ←/→ — повернуть камеру<br>Shift или двойное W — бег<br>пробел — прыжок · E — карточка вещи · T — взять в руку / положить<br>на столы, лавки и тумбы можно запрыгнуть<br>V или колесо — вид от 1-го / 3-го лица<br>G — помахать · C — сесть: у лавки, стола, тумбы — на них<br>M — микрофон: вкл / выкл</div><div class="cross"></div><div class="near" hidden></div><div class="stick"><i></i></div><div class="mz-gmenu" data-open="0" role="group" aria-label="Жесты"><button type="button" data-g="wave">помахать</button><button type="button" data-g="sit">сесть</button><button type="button" data-g="take">взять</button></div><div class="mz-pad"><button type="button" class="mz-gst" aria-expanded="false" aria-label="Жесты: помахать или сесть"><b><svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d="M4.5 9V4.2a1 1 0 0 1 2 0V8M6.5 7.6V2.6a1 1 0 0 1 2 0v5M8.5 7.6V3.4a1 1 0 0 1 2 0V9M10.5 8.4V5.6a1 1 0 0 1 2 0v3.6c0 3-2 5.3-4.6 5.3-1.9 0-3-1-3.9-2.4L2.4 9.6a1 1 0 0 1 1.6-1.2L4.5 9" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg></b>жест</button><button type="button" class="mz-act" aria-label="Рассмотреть ближайший предмет"><b>◉</b>смотреть</button><button type="button" class="mz-jump" aria-label="Прыжок"><b>↑</b>прыжок</button></div><div class="mz-ctl"><div class="mz-view" role="group" aria-label="Вид камеры"><button type="button" data-v="tp" aria-pressed="true" aria-label="Вид из-за спины"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="10" cy="4" r="2.3" fill="currentColor"/><path d="M6.6 15v-4.3a3.4 3.4 0 0 1 6.8 0V15z" fill="currentColor"/><path d="M1.2 7.5l3 2.2-3 2.2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><span class="mz-lf">из-за спины</span><span class="mz-ls">сзади</span></button><button type="button" data-v="fp" aria-pressed="false" aria-label="Вид от первого лица"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 8s2.6-4.6 7-4.6S15 8 15 8s-2.6 4.6-7 4.6S1 8 1 8z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="8" r="2.3" fill="currentColor"/></svg><span class="mz-lf">от первого лица</span><span class="mz-ls">глазами</span></button></div><button type="button" class="mz-who" aria-label="Персонаж: изменить облик"><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="1.5" width="6" height="5.5" rx="1" fill="currentColor"/><path d="M3.5 15v-4.6A2.4 2.4 0 0 1 5.9 8h4.2a2.4 2.4 0 0 1 2.4 2.4V15z" fill="currentColor"/></svg><span>персонаж</span></button><button type="button" class="mz-snd" aria-pressed="true" aria-label="Звук"><svg viewBox="0 0 16 16" aria-hidden="true"></svg><span>звук</span></button><button type="button" class="mz-mus" aria-pressed="true" aria-label="Музыка" hidden><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 12.2V3.4l7-1.6v8.6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="4.3" cy="12.3" r="1.9" fill="currentColor"/><circle cx="11.3" cy="10.6" r="1.9" fill="currentColor"/></svg><span>музыка</span></button><button type="button" class="mz-auth-b" aria-label="Музыка залов: панель автора" hidden><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 4h12M2 8h8M2 12h5M12 9.5v5M9.5 12h5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><span>музыка залов</span></button><button type="button" class="mz-help" aria-expanded="false" aria-controls="mz-keys" aria-label="Подсказки по управлению">?</button></div><button type="button" class="mz-fsb mz-fstop" aria-pressed="false" aria-label="На весь экран" title="На весь экран (F)"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><span class="mz-lf">на весь экран</span><span class="mz-ls">экран</span></button><div class="mz-map" data-mz-open="1"><button type="button" class="mz-map-t" aria-expanded="true" aria-label="Карта залов: показать или скрыть">Карта<i aria-hidden="true">▾</i></button><canvas aria-label="Карта залов. Нажмите на зал, чтобы перейти в него" role="img"></canvas></div><div class="mz-np" hidden role="group" aria-label="Сейчас играет"><button type="button" class="mz-npt" aria-expanded="true" aria-label="Сейчас играет: показать или скрыть">♪</button><span class="mz-npn"></span><button type="button" class="mz-npb mz-npp" aria-label="Предыдущий трек">‹</button><button type="button" class="mz-npb mz-npx" aria-label="Следующий трек">›</button></div><div class="hallbar"></div></div>
    <div class="gate"><div><h3>Музей всего дорогого</h3><p>Десять залов анфиладой: от квартир, в которых неуютно, до галереи, которая становится супермаркетом. Предметы ведут в записи.</p><button class="start" type="button">Войти</button></div></div></div>`;
  const wrap=host.querySelector(".hallwrap"),canvas=wrap.querySelector("canvas"),gate=wrap.querySelector(".gate"),hud=wrap.querySelector(".hud");
  if(WORLD){const f=WFLOOR[WORLD.floor]||WFLOOR["17"];gate.querySelector("h3").textContent="Этаж "+(WORLD.floor==="-1"?"−1":WORLD.floor)+" · "+f.name;gate.querySelector("p").textContent="Коридор с дверями в пространства посетителей. Лифт в лобби везёт на другие этажи и в музей книги.";canvas.setAttribute("aria-label","Этаж посетителей: трёхмерный коридор и комнаты");
    if(WORLD.lib){gate.querySelector("h3").textContent="Этаж ∞ · Библиотека";gate.querySelector("p").textContent="Шестигранные залы без конца: полки, проходы в соседние залы, шахта и лестница на другие ярусы. Карты нет. В каждом томе 410 страниц случайных букв.";canvas.setAttribute("aria-label","Библиотека: шестигранные залы без конца");wrap.classList.add("mz-lib")}}
  const whereEl=hud.querySelector(".where span"),whereSm=hud.querySelector(".where small"),nearEl=hud.querySelector(".near"),bar=hud.querySelector(".hallbar"),stick=hud.querySelector(".stick"),knob=stick.querySelector("i");
  let stopped=false,raf=0,R=null;
  const stopFns=[];
  /* слушатели регистрируются через on(), чтобы stop() снял их все */
  const on=(t,type,fn,o)=>{t.addEventListener(type,fn,o);stopFns.push(()=>t.removeEventListener(type,fn,o))};
  wrap.classList.add("mz","mz-tp");injectStyle();stopFns.push(releaseStyle);
  /* этап 8, часть 2: в мирах посетителей музыка залов не предлагается */if(WORLD&&!WORLD.lib){wrap.classList.add("mz-world");stopFns.push(()=>wrap.classList.remove("mz-world"))}
  const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}},lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
  /* этап 9: квартиры ветки — из данных (FLATS; для проверки — window.__MZ_FLATS). Ключи комнат не совпадают с залами */
  const FL=(Array.isArray(window.__MZ_FLATS)?window.__MZ_FLATS:FLATS).filter(f=>f&&f.id&&isFinite(f.dx)&&(f.side==="n"||f.side==="s"));
  const ROOMS_=[];const usedK=new Set([...SPEC.map(s=>s.k),BASE.k,CORR.k]);
  FL.forEach(f=>(Array.isArray(f.rooms)?f.rooms:[]).forEach(r=>{if(r&&r.k&&!usedK.has(r.k)&&r.w>=1&&r.d>=1.5){usedK.add(r.k);ROOMS_.push(r);if(!AIR[r.k])AIR[r.k]=AIR[r.air]||AIR.f1}}));
  const BRANCH_IDS=()=>[CORR.k,...ROOMS_.filter(r=>!r.mus).map(r=>r.k)];
  const BRANCH_NAME=k=>k===CORR.k?CORR.name:((ROOMS_.find(r=>r.k===k)||{}).name||"");
  const SNDK=Object.fromEntries([[CORR.k,CORR.snd],[BASE2.k,"hb"],...ROOMS_.map(r=>[r.k,r.snd||"f1"])]);
  /* подсказки: внизу справа, сворачиваются кнопкой «?» (сверху их закрывала липкая шапка сайта) */
  const helpB=hud.querySelector(".mz-help");
  const setKeys=v=>{wrap.classList.toggle("mz-keys",v);helpB.setAttribute("aria-expanded",v)};
  setKeys(lsGet("cv2_mz_keys")!=="0");
  on(helpB,"click",()=>{const v=!wrap.classList.contains("mz-keys");setKeys(v);lsSet("cv2_mz_keys",v?"1":"0")});
  /* этап 9: явная кнопка ✕ на блоке подсказок — то же состояние, что у «?» (помнится); «?» открывает снова */
  on(hud.querySelector(".mz-kx"),"click",()=>{setKeys(false);lsSet("cv2_mz_keys","0");try{helpB.focus({preventScroll:true})}catch(e){}});
  /* липкая шапка страницы: верхние элементы HUD опускаются ниже неё, когда страница прокручена к музею */
  let topQ=0;
  function updTop(){topQ=0;if(stopped)return;const rc=wrap.getBoundingClientRect();let hb=0;
    try{const x=Math.max(1,Math.min(innerWidth-2,rc.left+rc.width/2));document.elementsFromPoint(x,1).forEach(el=>{if(wrap.contains(el))return;for(let e=el;e&&e!==document.body&&e!==document.documentElement;e=e.parentElement){const ps=getComputedStyle(e).position;if(ps==="sticky"||ps==="fixed"){hb=Math.max(hb,e.getBoundingClientRect().bottom);break}}})}catch(e){}
    /* сдвиг ограничен, чтобы верхние элементы не наехали на нижние (джойстик, кнопки, полоса залов) */
    const room=rc.height-(matchMedia("(pointer:coarse)").matches?470:330);const off=wrap.classList.contains("mz-full")?0:Math.round(Math.max(0,Math.min(room,hb-rc.top)));if(off!==updTop.v){updTop.v=off;wrap.style.setProperty("--mz-top",off+"px")}}
  const qTop=()=>{if(!topQ)topQ=requestAnimationFrame(updTop)};
  on(document,"scroll",qTop,{passive:true,capture:true});on(window,"resize",qTop);stopFns.push(()=>cancelAnimationFrame(topQ));updTop();
  stopFns.push(()=>{[".mz-ctl",".mz-map",".mz-title",".mz-found",".mz-gmenu",".mz-np"].forEach(q=>{const e=hud.querySelector(q);if(e)e.remove()});wrap.classList.remove("mz-keys","mz-lite","mz-gopen");wrap.style.removeProperty("--mz-top")});
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
     kr:{l:[{n:"pink",ft:"lowpass",ff:1300,q:.6,g:.03,lfo:[.04,.01]},{o:"sine",f:100,g:.004,x:1}]},
     /* «База Героев»: гул большого зала и вентиляция (низкий шум полосой, едва слышный тон, шипение воздуха) — без музыки */
     hb:{l:[{n:"brown",ft:"lowpass",ff:240,g:.085},{n:"pink",ft:"bandpass",ff:190,q:.9,g:.032,lfo:[.07,.006]},{o:"sine",f:58,g:.006,lfo:[.11,.002],x:1},{n:"pink",ft:"highpass",ff:2600,q:.4,g:.004,x:1}]},
     /* этап 9: коридор — тихий тон лестничной клетки (гулкий низ, далёкий шорох); квартира — тишина дома и едва слышный гул холодильника (100 и 150 Гц) */
     co:{l:[{n:"brown",ft:"lowpass",ff:320,g:.055},{n:"pink",ft:"bandpass",ff:520,q:.7,g:.011,lfo:[.05,.004]},{o:"sine",f:47,g:.004,lfo:[.03,.0015],x:1}]},
     f1:{l:[{n:"brown",ft:"lowpass",ff:240,g:.04},{o:"sine",f:100,g:.0032,lfo:[.017,.0012]},{o:"sine",f:150,g:.0011,x:1},{n:"pink",ft:"bandpass",ff:3200,q:.6,g:.0015,x:1}]},
     /* этап 10: «Маршала Захарова» — тише Headliner: тёплая тишина и слабый гул холодильника-колонны (50 и 100 Гц с медленным дыханием); прихожая — почти тишина */
     f2:{l:[{n:"brown",ft:"lowpass",ff:220,g:.034},{o:"sine",f:100,g:.0026,lfo:[.011,.0011]},{o:"sine",f:50,g:.0022,lfo:[.009,.0008],x:1},{n:"pink",ft:"bandpass",ff:2600,q:.6,g:.0011,x:1}]},
     f2h:{l:[{n:"brown",ft:"lowpass",ff:300,g:.03},{n:"pink",ft:"bandpass",ff:700,q:.6,g:.004,x:1}]},
     /* этап 8, часть 2: этажи посетителей — мастерская, мягкая акустика, дом, тихий холод; комната посетителя — спокойный ровный тон комнаты */
     w551:{l:[{n:"brown",ft:"lowpass",ff:300,g:.06},{n:"pink",ft:"bandpass",ff:700,q:.6,g:.01,lfo:[.07,.004],x:1}]},
     w43:{l:[{n:"pink",ft:"lowpass",ff:600,g:.03},{o:"sine",f:80,g:.003,x:1}]},
     w17:{l:[{n:"brown",ft:"lowpass",ff:260,g:.05},{o:"sine",f:100,g:.003,lfo:[.02,.001],x:1}]},
     wm1:{l:[{n:"brown",ft:"lowpass",ff:160,g:.04},{o:"sine",f:52,g:.008,lfo:[.04,.004],x:1}]},
     vr:{l:[{n:"brown",ft:"lowpass",ff:220,g:.035},{n:"pink",ft:"bandpass",ff:1200,q:.5,g:.0025,x:1}]}};
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
    function bed(k){if(beds[k])return beds[k];const D=AMB[k]||AMB[SNDK[k]];if(!D)return null;const b={k,g:ctx.createGain(),layers:[],w:0,idle:0,evT:ctx.currentTime+1+Math.random()*2};
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
        const E=(AMB[b.k]||AMB[SNDK[b.k]]).ev;if(E&&w>.05&&t>=b.evT){if(!(E.x&&liteA))evt(E.k,b.g);b.evT=t+E.a+Math.random()*(E.b-E.a)}})}
    /* шаги: тип пола задаёт окраску, бег — громче и короче; приземление — глухой удар */
    const SURF={lam:[760,1],planks:[700,.9],darkwood:[650,.9],parquet:[820,1],concrete:[1300,.8],concreteLight:[1300,.8],concreteDark:[1150,.8],stone:[1000,.9],tiles:[1700,.7],smtiles:[1800,.7],rubber:[360,.55],ctile:[1650,.75],oak:[780,1],furn:[560,.8]};
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
    /* этап 6В: музыка залов идёт через тот же контекст и общий уровень; постели приглушаются, пока играет музыка (шаги — нет) */
    let duckV=1;function duck(v){if(duckV===v)return;duckV=v;if(!ctx||gone)return;try{amb.gain.setTargetAtTime(v,ctx.currentTime,.45)}catch(e){}}
    const dbg=()=>({exists:!!ctx,state:ctx?ctx.state:"none",on:enabled,hidden:hid,gone,lite:liteA,master:master?+master.gain.value.toFixed(4):0,bed:amb?+amb.gain.value.toFixed(4):0,
      beds:Object.fromEntries(Object.values(beds).map(b=>[b.k,+b.g.gain.value.toFixed(4)])),layers:Object.values(beds).reduce((a,b)=>a+b.layers.length,0),...stat,_ctx:ctx,_master:master});
    return {gesture,mix,step,land,cue,setLite,setOn,vis,close,bind,dbg,duck,ctx:()=>ctx,out:()=>master,get on(){return enabled},get gone(){return gone}};
  })();
  stopFns.push(()=>snd.close());
  snd.bind(hud.querySelector(".mz-snd"));
  on(hud.querySelector(".mz-snd"),"click",()=>snd.setOn(!snd.on));
  on(wrap,"pointerdown",()=>snd.gesture(),{capture:true});
  on(document,"visibilitychange",()=>snd.vis(document.hidden));

  /* ---------- этап 6В: музыка залов. Файлы кладёт автор в music/ (список — tracks.json, раскладка по залам — playlists.json).
     Два элемента <audio> для перекрёстного затухания, звук идёт через контекст и общий уровень «звука»; нет файлов — тишина без ошибок ---------- */
  const mus=(function(){
    const IDS=[...SPEC.map(x=>x.k),BASE.k,BASE2.k,...BRANCH_IDS()],DIR="music/",FADE=1.5,DUCK=.35;
    const FILE_RE=/^[^\/\\?#%"<>:*|]{1,120}\.(mp3|m4a|ogg|oga|wav)$/i;
    let man=null,base=null,pl=null,ok=false,mOn=lsGet("cv2_mz_music")!=="0",space=null,cur=null,hid=document.hidden,gone=false,key="",btn=null,np=null;
    const st={starts:0,switches:0,errors:0,loads:0};const decks=[];const tmr=new Set();
    const later=(f,ms)=>{const id=setTimeout(()=>{tmr.delete(id);f()},ms);tmr.add(id);return id};
    const str=(v,n)=>typeof v==="string"?v.replace(/[\u0000-\u001f]/g,"").trim().slice(0,n):"";
    function vMan(a){if(!Array.isArray(a))return null;const m=new Map();a.forEach(t=>{if(!t||typeof t!=="object")return;const f=str(t.file,130);if(!FILE_RE.test(f)||f.startsWith(".")||m.has(f))return;m.set(f,{file:f,title:str(t.title,80)||f.replace(/\.[^.]+$/,""),artist:str(t.artist,80)})});return m}
    /* раскладка: только известные залы и файлы из списка; громкость 0…1, вперемешку — да/нет, по кругу — по умолчанию да */
    function vPl(o){if(!o||typeof o!=="object"||Array.isArray(o)||!man)return null;const r={};IDS.forEach(id=>{const e=o[id]&&typeof o[id]==="object"?o[id]:{};const v=+e.volume;
      r[id]={tracks:(Array.isArray(e.tracks)?e.tracks:[]).filter(f=>typeof f==="string"&&man.has(f)).slice(0,60),volume:isFinite(v)&&e.volume!==null&&e.volume!==""?Math.max(0,Math.min(1,Math.round(v*100)/100)):.6,shuffle:e.shuffle===true,loop:e.loop!==false}});return r}
    const getJ=u=>fetch(u,{cache:"no-cache"}).then(r=>r.ok?r.json():null).catch(()=>null);
    const ready=Promise.all([getJ(DIR+"tracks.json"),getJ(DIR+"playlists.json")]).then(([t,p])=>{if(gone)return;man=vMan(t);if(!man||!man.size)return;base=vPl(p);if(!base)return;
      let own=null;try{own=vPl(JSON.parse(lsGet("cv2_mz_playlists")||"null"))}catch(e){own=null}pl=own||base;ok=true;ui();key="";sync()}).catch(()=>{});
    const sig=P=>P.tracks.join("|")+"/"+P.shuffle+"/"+P.loop;
    const shuf=n=>{const a=[...Array(n).keys()];for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
    function deck(){const el=new Audio();el.preload="auto";const d={el,g:null,src:null,c:null,space:null,P:null,order:[],i:0,fails:0,stopT:0};
      const H_={ended:()=>{if(d===cur)advance(d,1,true)},error:()=>{if(!el.getAttribute("src"))return;st.errors++;if(d!==cur)return;d.fails++;if(d.fails>=d.order.length){halt(d,0);cur=null;snd.duck(1);ui()}else advance(d,1,true)},playing:()=>{if(d===cur)d.fails=0;ui()}};
      Object.keys(H_).forEach(k=>el.addEventListener(k,H_[k]));d.off=()=>Object.keys(H_).forEach(k=>el.removeEventListener(k,H_[k]));return d}
    function wire(d){const c=snd.ctx();if(!c||c.state==="closed")return false;if(d.c===c)return true;if(d.c)return false;
      try{d.src=c.createMediaElementSource(d.el);d.g=c.createGain();d.g.gain.value=0;d.src.connect(d.g);d.g.connect(snd.out());d.c=c;return true}catch(e){return false}}
    const can=()=>ok&&mOn&&snd.on&&!hid&&!gone&&!snd.gone&&!!snd.ctx()&&snd.ctx().state!=="closed";
    function ramp(d,v,sec){if(!d.g)return;const t=d.c.currentTime,g=d.g.gain;try{g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);if(sec>0)g.linearRampToValueAtTime(v,t+sec);else g.setValueAtTime(v,t)}catch(e){}}
    function halt(d,sec){clearTimeout(d.stopT);ramp(d,0,sec);const go=()=>{if(d!==cur||!can()){try{d.el.pause()}catch(e){}}};if(sec>0)d.stopT=later(go,sec*1000+80);else{try{d.el.pause()}catch(e){}}}
    function load(d){const f=d.P.tracks[d.order[d.i]];st.loads++;d.el.src=DIR+encodeURIComponent(f);try{d.el.currentTime=0}catch(e){}}
    function play(d){const p=d.el.play();if(p&&p.catch)p.catch(()=>{})}
    function start(d,sp,P){clearTimeout(d.stopT);d.space=sp;d.P=P;d.sig=sig(P);d.order=P.shuffle?shuf(P.tracks.length):[...P.tracks.keys()];d.i=0;d.fails=0;load(d);ramp(d,0,0);play(d);ramp(d,P.volume,FADE);st.starts++}
    function advance(d,dir,auto){const n=d.order.length;if(!n)return;d.i+=dir;
      if(d.i>=n){if(auto&&!d.P.loop){halt(d,0);if(d===cur){cur=null;snd.duck(1)}ui();return}if(d.P.shuffle)d.order=shuf(n);d.i=0}if(d.i<0)d.i=n-1;load(d);if(can()&&d===cur){play(d);ramp(d,d.P.volume,auto?0:.25)}ui()}
    /* главное: что должно звучать сейчас. Вызывается при смене зала, переключателях, видимости вкладки */
    function sync(){const P=pl&&space?pl[space]:null,has=!!(P&&P.tracks.length),c=can(),k=[space,c,has?sig(P):"",has?P.volume:""].join("#");if(k===key)return;key=k;
      if(!c){if(cur){if(hid||gone||snd.gone)halt(cur,0);else halt(cur,.4)}snd.duck(1);ui();return}
      if(!has){if(cur){halt(cur,FADE);cur=null}snd.duck(1);ui();return}
      if(!decks.length)decks.push(deck(),deck());
      if(cur&&cur.space===space&&cur.sig===sig(P)){if(!wire(cur))return;cur.P=P;clearTimeout(cur.stopT);if(cur.el.paused)play(cur);ramp(cur,P.volume,.6);snd.duck(DUCK);ui();return}
      const old=cur,d=decks[0]===old?decks[1]:decks[0];if(!wire(d)){key="";return}if(old){halt(old,FADE);st.switches++}cur=d;start(d,space,P);snd.duck(DUCK);ui()}
    function want(k){if(k!==space){space=k;sync()}else if(!key)sync()}
    function setOn(v){mOn=!!v;lsSet("cv2_mz_music",mOn?"1":"0");key="";sync()}
    function vis(h){hid=!!h;key="";sync()}
    function close(){if(gone)return;gone=true;tmr.forEach(clearTimeout);tmr.clear();decks.forEach(d=>{clearTimeout(d.stopT);d.off();try{d.el.pause();d.el.removeAttribute("src");d.el.load()}catch(e){}try{d.src&&d.src.disconnect();d.g&&d.g.disconnect()}catch(e){}});cur=null;if(np)np.hidden=true}
    function apply(own){const v=vPl(own);if(!v)return false;pl=v;key="";sync();ui();return true}
    /* «сейчас играет»: название — исполнитель, назад/вперёд; на телефоне сворачивается в одну кнопку */
    function ui(){if(btn){btn.hidden=!ok;btn.setAttribute("aria-pressed",String(mOn));btn.setAttribute("aria-label",mOn?"Музыка включена. Выключить":"Музыка выключена. Включить");btn.title=mOn?"Музыка: вкл":"Музыка: выкл"}
      if(!np)return;const t=cur&&can()&&cur.P?man.get(cur.P.tracks[cur.order[cur.i]]):null;np.hidden=!t;if(!t)return;
      const nm=np.querySelector(".mz-npn");const txt=t.title+(t.artist?" — "+t.artist:"");if(nm.textContent!==txt){nm.textContent=txt;nm.title=txt}
      const multi=cur.P.tracks.length>1;np.querySelectorAll(".mz-npb").forEach(b=>b.disabled=!multi)}
    function bind(b,el){btn=b;np=el;const t=np.querySelector(".mz-npt");const setC=v=>{np.dataset.c=v?"1":"0";t.setAttribute("aria-expanded",String(!v))};
      setC(lsGet("cv2_mz_np")?lsGet("cv2_mz_np")==="1":matchMedia("(pointer:coarse)").matches);
      on_(t,"click",()=>{const v=np.dataset.c!=="1";setC(v);lsSet("cv2_mz_np",v?"1":"0")});
      on_(np.querySelector(".mz-npp"),"click",()=>{if(cur)advance(cur,-1,false)});on_(np.querySelector(".mz-npx"),"click",()=>{if(cur)advance(cur,1,false)});
      on_(btn,"click",()=>{setOn(!mOn);if(mOn)snd.gesture()});ui()}
    const on_=(t,ty,f)=>on(t,ty,f);
    const dbg=()=>({ok,on:mOn,space,hid,tracks:man?man.size:0,playing:cur?{space:cur.space,file:cur.P.tracks[cur.order[cur.i]],i:cur.i,order:cur.order.slice()}:null,
      decks:decks.map(d=>({space:d.space,paused:d.el.paused,t:+d.el.currentTime.toFixed(2),gain:d.g?+d.g.gain.value.toFixed(3):null,src:(d.el.getAttribute("src")||"").replace(DIR,"")})),bed:snd.dbg().bed,pl,...st});
    return {want,setOn,vis,close,apply,bind,dbg,ready,sync:()=>{key="";sync()},next:()=>{if(cur)advance(cur,1,false)},prev:()=>{if(cur)advance(cur,-1,false)},
      get _els(){return decks.map(d=>d.el)},get man(){return man},get base(){return base},get pl(){return pl},IDS,FILE_RE,vPl,get on(){return mOn},get ok(){return ok}};
  })();
  stopFns.push(()=>mus.close());
  mus.bind(hud.querySelector(".mz-mus"),hud.querySelector(".mz-np"));
  on(document,"visibilitychange",()=>mus.vis(document.hidden));
  on(hud.querySelector(".mz-snd"),"click",()=>mus.sync());
  /* панель автора «Музыка залов»: видна с ?author=1 в адресе или при localStorage.cv2_mz_author === "1".
     Правит раскладку, «применить» сохраняет её у автора; для всех — скачать или скопировать playlists.json и положить в music/ */
  const isAuthor=(()=>{try{if(new URLSearchParams(location.search).get("author")==="1")return true}catch(e){}return lsGet("cv2_mz_author")==="1"})();
  const auth=(function(){
    let el=null,opener=null,draft=null,docOv=null,pv=null,pvF="";const esc_=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
    const NAME=k=>k===BASE.k?BASE.name:((opt.halls&&opt.halls[k])||BRANCH_NAME(k)||k);
    const tName=f=>{const t=mus.man&&mus.man.get(f);return t?t.title+(t.artist?" — "+t.artist:""):f};
    const out=()=>JSON.stringify(draft,null,2)+"\n";
    function sec(id){const P=draft[id],opts=[...mus.man.values()].map(t=>`<option value="${esc_(t.file)}">${esc_(t.title+(t.artist?" — "+t.artist:"")+" · "+t.file)}</option>`).join("");
      return `<h4>${esc_(NAME(id))} <small>${id}</small></h4><ol class="mz-alist">${P.tracks.map((f,i)=>`<li><span class="mz-atn">${esc_(tName(f))}</span><span class="mz-abts">
        <button type="button" data-a="pv" data-i="${i}" aria-pressed="${pv&&pvF===id+"/"+i}" aria-label="${esc_("Слушать: "+tName(f))}">${pv&&pvF===id+"/"+i?"стоп":"слушать"}</button>
        <button type="button" data-a="up" data-i="${i}" ${i?"":"disabled"} aria-label="${esc_("Выше: "+tName(f))}">↑</button><button type="button" data-a="dn" data-i="${i}" ${i<P.tracks.length-1?"":"disabled"} aria-label="${esc_("Ниже: "+tName(f))}">↓</button>
        <button type="button" data-a="rm" data-i="${i}" aria-label="${esc_("Убрать: "+tName(f))}">✕</button></span></li>`).join("")||`<li class="mz-aempty">без музыки</li>`}</ol>
        <div class="mz-aadd"><select aria-label="${esc_("Трек для зала «"+NAME(id)+"»")}"><option value="">— выбрать трек —</option>${opts}</select><button type="button" data-a="add">добавить</button></div>
        <div class="mz-aset"><label>громкость <input type="range" min="0" max="1" step="0.05" value="${P.volume}" data-a="vol"><output>${Math.round(P.volume*100)}%</output></label>
        <label><input type="checkbox" data-a="shuf" ${P.shuffle?"checked":""}> вперемешку</label><label><input type="checkbox" data-a="loop" ${P.loop?"checked":""}> по кругу</label></div>`}
    function redraw(id,focusSel){const s=el.querySelector(`section[data-s="${id}"]`);s.innerHTML=sec(id);if(focusSel){const f=s.querySelector(focusSel)||s.querySelector("select");try{f.focus({preventScroll:true})}catch(e){}}}
    function say(t){const m=el.querySelector(".mz-amsg");m.textContent=t}
    function stopPv(){if(pv){try{pv.pause();pv.removeAttribute("src");pv.load()}catch(e){}pv=null;const id=pvF.split("/")[0];pvF="";if(el&&id)redraw(id)}}
    function onClick(ev){const b=ev.target.closest("button");if(!b)return;const s=b.closest("section"),id=s&&s.dataset.s,a=b.dataset.a,i=+b.dataset.i;
      if(a==="close"){close();return}
      if(a==="apply"){lsSet("cv2_mz_playlists",JSON.stringify(draft));mus.apply(JSON.parse(JSON.stringify(draft)));say("Применено: так музыка звучит у вас. Для всех — скачайте или скопируйте файл.");return}
      if(a==="dl"){try{const u=URL.createObjectURL(new Blob([out()],{type:"application/json"})),x=document.createElement("a");x.href=u;x.download="playlists.json";document.body.appendChild(x);x.click();x.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);say("Файл playlists.json скачан.")}catch(e){say("Не удалось скачать файл.")}return}
      if(a==="copy"){const txt=out(),fb=()=>{const ta=el.querySelector(".mz-ata");ta.hidden=false;ta.value=txt;ta.focus();ta.select();let okc=false;try{okc=document.execCommand("copy")}catch(e){}say(okc?"Скопировано.":"Выделено ниже — скопируйте вручную.")};
        try{if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(txt).then(()=>say("Скопировано."),fb);else fb()}catch(e){fb()}return}
      if(!id)return;const P=draft[id];
      if(a==="pv"){const k=id+"/"+i;if(pvF===k){stopPv();return}stopPv();pv=new Audio(DIRM+encodeURIComponent(P.tracks[i]));pv.volume=Math.max(.05,P.volume);pvF=k;const p_=pv.play();if(p_&&p_.catch)p_.catch(()=>{});pv.onended=()=>stopPv();redraw(id,`[data-a="pv"][data-i="${i}"]`);return}
      if(a==="up"&&i>0){[P.tracks[i-1],P.tracks[i]]=[P.tracks[i],P.tracks[i-1]];stopPv();redraw(id,`[data-a="up"][data-i="${i-1}"]`)}
      else if(a==="dn"&&i<P.tracks.length-1){[P.tracks[i+1],P.tracks[i]]=[P.tracks[i],P.tracks[i+1]];stopPv();redraw(id,`[data-a="dn"][data-i="${i+1}"]`)}
      else if(a==="rm"){P.tracks.splice(i,1);stopPv();redraw(id,`[data-a="rm"][data-i="${Math.min(i,P.tracks.length-1)}"]`)}
      else if(a==="add"){const v=s.querySelector("select").value;if(v&&mus.man.has(v)&&P.tracks.length<60){P.tracks.push(v);redraw(id,'[data-a="add"]')}}}
    function onInput(ev){const t=ev.target,s=t.closest("section");if(!s)return;const P=draft[s.dataset.s];
      if(t.dataset.a==="vol"){P.volume=Math.max(0,Math.min(1,Math.round(+t.value*100)/100));t.nextElementSibling.textContent=Math.round(P.volume*100)+"%"}
      else if(t.dataset.a==="shuf")P.shuffle=t.checked;else if(t.dataset.a==="loop")P.loop=t.checked}
    function onKey(ev){if(ev.key==="Escape"){ev.preventDefault();ev.stopPropagation();close();return}
      if(ev.key==="Tab"){const f=[...el.querySelectorAll("button,input,select,textarea")].filter(e=>!e.disabled&&e.offsetParent!==null);const i=f.indexOf(document.activeElement);
        if(ev.shiftKey&&i<=0){ev.preventDefault();f[f.length-1].focus()}else if(!ev.shiftKey&&i===f.length-1){ev.preventDefault();f[0].focus()}}ev.stopPropagation()}
    function open(from){if(el||stopped)return;opener=from||null;if(!mus.ok){mus.ready.then(()=>{if(mus.ok)open(from)});return}
      draft=JSON.parse(JSON.stringify(mus.pl));el=document.createElement("div");el.className="mz-auth mz-cust";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-labelledby","mz-auth-t");
      el.innerHTML=`<div class="mz-cbox mz-abox"><div class="mz-ahead"><h3 id="mz-auth-t">Музыка залов</h3><button type="button" class="mz-ax" data-a="close" aria-label="Закрыть">✕</button></div>
        <p class="mz-anote">Сайт статический: «применить» меняет музыку только у вас. Чтобы её услышали все, скачайте playlists.json и замените им файл в папке music/ репозитория.</p>
        <div class="mz-asecs">${mus.IDS.map(id=>`<section data-s="${id}" aria-label="${esc_(NAME(id))}">${sec(id)}</section>`).join("")}</div>
        <textarea class="mz-ata" hidden readonly aria-label="Текст playlists.json"></textarea><p class="mz-amsg" role="status" aria-live="polite"></p>
        <div class="mz-cbtns"><button type="button" data-a="dl">Скачать playlists.json</button><button type="button" data-a="copy">Скопировать</button><button type="button" class="mz-cdone" data-a="apply">применить</button></div></div>`;
      document.body.appendChild(el);docOv=document.documentElement.style.overflow;document.documentElement.style.overflow="hidden";
      el.addEventListener("click",onClick);el.addEventListener("input",onInput);el.addEventListener("change",onInput);el.addEventListener("keydown",onKey);el.addEventListener("keyup",e=>e.stopPropagation());
      try{el.querySelector(".mz-ax").focus({preventScroll:true})}catch(e){}}
    function close(){if(!el)return;stopPv();el.remove();el=null;document.documentElement.style.overflow=docOv||"";const b=opener&&opener.isConnected?opener:canvas;try{b.focus({preventScroll:true})}catch(e){}}
    stopFns.push(()=>{stopPv();if(el){el.remove();el=null;document.documentElement.style.overflow=docOv||""}});
    return {open,close,get isOpen(){return !!el},get draft(){return draft},out,get preview(){return pv?{file:pvF,paused:pv.paused}:null}};
  })();
  const DIRM="music/";
  {const ab=hud.querySelector(".mz-auth-b");if(isAuthor){ab.hidden=false;on(ab,"click",ev=>auth.open(ev.currentTarget))}else ab.remove()}
  wrap.__mzm={mus,auth};
  /* ---------- этап 6Б: персонаж. При первом входе — панель облика (до передачи управления); потом — кнопка «персонаж» в HUD.
     Облик хранится в cv2_mz_look; превью — отдельный маленький рендерер, только пока панель открыта ---------- */
  const custReduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let look=lookParse(lsGet("cv2_mz_look"));const hadLook=!!look;if(!look)look=lookCopy(LOOK_DEF.m);
  let onLook=null;/* build() подставляет пересборку своей фигуры */
  const curLook=()=>look;/* в build() имя look занято поворотом камеры */
  const cust=(function(){
    const NAMES={hat:"Головной убор",top:"Верх",bot:"Низ",shoe:"Обувь",hair:"Волосы",skin:"Кожа"};
    let el=null,opener=null,first=false,pv=null,docOv=null,made=0,freed=0;
    const esc_=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
    function html(){const row=k=>`<div class="mz-cline"><span class="mz-clab" id="mz-cl-${k}">${NAMES[k]}</span><div class="mz-csw" role="group" aria-labelledby="mz-cl-${k}">`+
        (k==="hat"?`<button type="button" class="mz-cnone" data-k="hat" data-v="" aria-label="Без головного убора" title="Без головного убора">без</button>`:"")+
        PAL[k].map(([h,n])=>`<button type="button" class="mz-cs" data-k="${k}" data-v="${h}" style="--c:#${h}" aria-label="${esc_(NAMES[k]+": "+n)}" title="${esc_(n)}"></button>`).join("")+
        (k==="skin"?"":`<label class="mz-cpick" title="Свой цвет"><input type="color" data-k="${k}" aria-label="${esc_("Свой цвет: "+NAMES[k].toLowerCase())}"></label>`)+`</div></div>`;
      return `<div class="mz-cbox"><div class="mz-chead"><h3 id="mz-cust-t">Ваш персонаж</h3><p>Так вас увидят другие посетители музея. Изменить можно кнопкой «персонаж».</p></div>
        <div class="mz-cmain"><div class="mz-cprev"><canvas aria-hidden="true"></canvas></div><div class="mz-copts">
        <div class="mz-cseg" role="group" aria-label="Фигура"><button type="button" data-p="m">мужской</button><button type="button" data-p="f">женский</button></div>
        <div class="mz-cseg mz-cfem" role="group" aria-label="Юбка или брюки"><button type="button" data-b="s">юбка</button><button type="button" data-b="p">брюки</button></div>
        <label class="mz-cchk mz-cfem"><input type="checkbox" data-t="1"> хвост</label></div></div>
        <div class="mz-crows">${LOOK_KEYS.map(row).join("")}</div>
        <div class="mz-cbtns"><button type="button" class="mz-crand">Случайно</button><button type="button" class="mz-cdone">Готово</button></div></div>`}
    function sync(){if(!el)return;const L=look;
      el.querySelectorAll("[data-p]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.p===L.p)));
      el.querySelectorAll("[data-b]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.b===L.b)));
      el.querySelector("[data-t]").checked=L.t==="t";el.querySelectorAll(".mz-cfem").forEach(e=>e.hidden=L.p!=="f");
      el.querySelectorAll(".mz-cs,.mz-cnone").forEach(b=>{const k=b.dataset.k,on_=k==="hat"&&b.dataset.v===""?L.h==="n":(L.c[k]===b.dataset.v&&(k!=="hat"||L.h==="h"));b.setAttribute("aria-pressed",String(on_))});
      el.querySelectorAll('input[type="color"]').forEach(i=>{const k=i.dataset.k;i.value="#"+L.c[k];const own=!PAL[k].some(p=>p[0]===L.c[k])&&(k!=="hat"||L.h==="h");i.parentNode.classList.toggle("on",own)});
      prevSet()}
    function setP(p){if(p===look.p)return;const D=LOOK_DEF[p];look={p,b:D.b,t:D.t,h:D.h,c:Object.assign({},look.c,{hair:look.c.hair})};if(p==="m"){look.b="p";look.t="n";look.h="h"}sync()}
    function rnd(){const r=a=>a[Math.floor(Math.random()*a.length)];const p=Math.random()<.5?"m":"f";const c={};LOOK_KEYS.forEach(k=>c[k]=r(PAL[k])[0]);
      look={p,b:p==="f"?(Math.random()<.5?"s":"p"):"p",t:p==="f"&&Math.random()<.35?"t":"n",h:Math.random()<(p==="m"?.75:.35)?"h":"n",c};sync()}
    /* превью: та же фигура, медленный поворот (при «меньше движения» — неподвижно) */
    function prevStart(){const c=el&&el.querySelector(".mz-cprev canvas");if(!c)return;
      (window.THREE_READY||Promise.resolve(!!window.THREE)).then(ok=>{const T=window.THREE;if(!ok||!T||!el||pv||stopped)return;
        let R2;try{R2=new T.WebGLRenderer({canvas:c,antialias:true,alpha:true})}catch(e){return}made++;
        R2.setPixelRatio(Math.min(2,devicePixelRatio||1));const S2=new T.Scene(),cam2=new T.PerspectiveCamera(30,1,.1,20);cam2.position.set(0,1.05,4.1);cam2.lookAt(0,.92,0);
        S2.add(new T.HemisphereLight(0xffffff,0x555049,.9));const dl=new T.DirectionalLight(0xffffff,.55);dl.position.set(2,3,4);S2.add(dl);
        const kit=figKit(T,null);pv={R:R2,S:S2,cam:cam2,kit,fig:null,raf:0,ang:Math.PI-.5,t0:performance.now()};prevSet();
        const loop=now=>{if(!pv)return;const w=c.clientWidth||120,h=c.clientHeight||150;if(c.width!==Math.round(w*R2.getPixelRatio())||c.height!==Math.round(h*R2.getPixelRatio())){R2.setSize(w,h,false);cam2.aspect=w/h;cam2.updateProjectionMatrix()}
          if(!custReduce)pv.ang=Math.PI-.5+(now-pv.t0)/1000*.7;if(pv.fig)pv.fig.rotation.y=pv.ang;R2.render(S2,cam2);pv.raf=requestAnimationFrame(loop)};pv.raf=requestAnimationFrame(loop)})}
    function prevSet(){if(!pv)return;if(pv.fig){pv.S.remove(pv.fig);pv.fig.userData.fig.mats.forEach(m=>m.dispose())}const f=pv.kit.figure(null,look);const u=f.userData.fig;u.armL.rotation.z=-.08;u.armR.rotation.z=.08;pv.fig=f;pv.S.add(f)}
    function prevStop(){if(!pv)return;cancelAnimationFrame(pv.raf);if(pv.fig)pv.fig.userData.fig.mats.forEach(m=>m.dispose());pv.kit.dispose();try{pv.R.dispose();pv.R.forceContextLoss&&pv.R.forceContextLoss()}catch(e){}pv=null;freed++}
    const focusables=()=>[...el.querySelectorAll("button,input,[tabindex]")].filter(e=>!e.disabled&&e.offsetParent!==null);
    function onKey(ev){if(ev.key==="Escape"){ev.preventDefault();ev.stopPropagation();close(true);return}
      if(ev.key==="Tab"){const f=focusables();if(!f.length)return;const i=f.indexOf(document.activeElement);if(ev.shiftKey&&(i<=0)){ev.preventDefault();f[f.length-1].focus()}else if(!ev.shiftKey&&i===f.length-1){ev.preventDefault();f[0].focus()}}
      ev.stopPropagation()}
    function open(isFirst,from){if(el||stopped)return;first=!!isFirst;opener=from||null;
      el=document.createElement("div");el.className="mz-cust";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-labelledby","mz-cust-t");el.innerHTML=html();
      document.body.appendChild(el);docOv=document.documentElement.style.overflow;document.documentElement.style.overflow="hidden";
      el.addEventListener("keydown",onKey);el.addEventListener("keyup",ev=>ev.stopPropagation());
      el.addEventListener("click",ev=>{const b=ev.target.closest("button");if(!b)return;
        if(b.dataset.p)setP(b.dataset.p);else if(b.dataset.b){look.b=b.dataset.b;sync()}
        else if(b.dataset.k){const k=b.dataset.k;if(k==="hat"&&b.dataset.v===""){look.h="n"}else{look.c[k]=b.dataset.v;if(k==="hat")look.h="h"}sync()}
        else if(b.classList.contains("mz-crand"))rnd();else if(b.classList.contains("mz-cdone"))close(true)});
      el.addEventListener("change",ev=>{const i=ev.target;if(i.dataset.t){look.t=i.checked?"t":"n";sync()}});
      el.addEventListener("input",ev=>{const i=ev.target;if(i.type==="color"&&/^#[0-9a-f]{6}$/i.test(i.value)){look.c[i.dataset.k]=i.value.slice(1).toLowerCase();if(i.dataset.k==="hat")look.h="h";sync()}});
      sync();prevStart();const f=el.querySelector('[data-p][aria-pressed="true"]')||el.querySelector(".mz-cdone");try{f.focus({preventScroll:true})}catch(e){}}
    function close(save){if(!el)return;prevStop();el.remove();el=null;document.documentElement.style.overflow=docOv||"";
      if(save){lsSet("cv2_mz_look",lookStr(look));if(onLook)onLook(look)}
      const back=opener&&opener.isConnected?opener:canvas;try{back.focus({preventScroll:true})}catch(e){}}
    stopFns.push(()=>{if(el){prevStop();el.remove();el=null;document.documentElement.style.overflow=docOv||""}});
    return {open,close,get isOpen(){return !!el},_ang:()=>pv&&pv.fig?+pv.fig.rotation.y.toFixed(4):null,dbg:()=>({open:!!el,preview:!!pv,made,freed,look:lookStr(look),fig:pv&&pv.fig?{look:pv.fig.userData.fig.look,hair:pv.fig.userData.fig.parts.hair.length,skirt:!!pv.fig.userData.fig.parts.skirt,tail:!!pv.fig.userData.fig.parts.tail,cap:pv.fig.userData.fig.parts.cap.length,top:"#"+pv.fig.userData.fig.M.top.color.getHexString()}:null})}
  })();
  wrap.__mzc=cust;
  on(hud.querySelector(".mz-who"),"click",ev=>cust.open(false,ev.currentTarget));
  let started=false;
  /* вход: при первом визите — панель облика (управление получает холст после «Готово»), иначе сразу в музей */
  /* этап 14: пока заставка, HUD на телефоне скрыт (CSS .mz-gated); после входа 3D-окно целиком между шапкой и панелью вкладок */
  wrap.classList.add("mz-gated");
  gate.querySelector("button").onclick=()=>{gate.remove();wrap.classList.remove("mz-gated");started=true;snd.gesture();if(hadLook)canvas.focus({preventScroll:true});else cust.open(true);
    try{if(!document.fullscreenElement&&matchMedia("(max-width:600px)").matches)wrap.scrollIntoView({block:"nearest"});else if(hadLook)canvas.focus()}catch(e){}boot()};
  /* этап 8, часть 2: после лифта (или по просьбе хозяина страницы) — сразу внутрь, без заставки */
  const carry=CARRY&&Date.now()-CARRY.at<10000?CARRY:null;CARRY=null;if(opt.autostart||carry)setTimeout(()=>{if(!stopped&&gate.isConnected)gate.querySelector("button").onclick()},0);
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
    /* этап 9: у любого препятствия есть верх — видимая верхняя поверхность, и на неё можно встать, если туда забраться (прыжком, со ступеньки).
       Препятствие держит по горизонтали, пока ступни ниже его верха больше чем на ступеньку. Не встать никогда (верх = ∞, флаг "ns"): стены,
       перегородки, стекло, двойники, ограждения, витрины со стеклом и постаменты с экспонатами. Подвешенное (люстра, вытяжка, верхние шкафы,
       перемычка проёма) имеет низ: под ним проходят, если над головой хватает места. b = [x0,x1,z0,z1, верх для опоры (∞ — нельзя), низ (0 — стоит на полу), верх] */
    const LOW_TOP=.7;
    const block=(x0,x1,z0,z1,top,ns,bot)=>{const t=top==null?Infinity:+(+top).toFixed(3);blockers.push([x0,x1,z0,z1,ns===true||ns==="ns"?Infinity:t,bot>0?+(+bot).toFixed(3):0,t])};
    const box=(w,h,d,m,x,y,z,blk)=>{const me=add(new T.Mesh(new T.BoxGeometry(w,h,d),m),x,y,z);if(blk){block(x-w/2,x+w/2,z-d/2,z+d/2,y+h/2,blk==="ns");if(h>1.2)camBlock.push(me)}return me};
    const cyl=(r1,r2,h,m,x,y,z,seg=24)=>add(new T.Mesh(new T.CylinderGeometry(r1,r2,h,seg),m),x,y,z);
    const shadowTex=new T.CanvasTexture(cnv(128,128,(g)=>{const gr=g.createRadialGradient(64,64,4,64,64,62);gr.addColorStop(0,"rgba(0,0,0,.55)");gr.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=gr;g.fillRect(0,0,128,128)}));
    const contact=(x,z,w,d)=>{const p=new T.Mesh(new T.PlaneGeometry(w,d),new T.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false}));p.rotation.x=-Math.PI/2;p.position.set(x,.012,z);S.add(p);contacts.push(p)};
    const imgOnto=(c,url)=>{if(!url)return;const im=new Image();im.onload=()=>{const g=c.getContext("2d"),W=c.width,H=c.height,s=Math.max(W/im.width,H/im.height),w=im.width*s,h=im.height*s;g.drawImage(im,(W-w)/2,(H-h)/2,w,h);if(c.__tex)c.__tex.needsUpdate=true};im.src=url};
    const PAINT=opt.paint||{};const pick_=(k,i)=>{const a=PAINT[k]||[];return a.length?a[i%a.length]:null};
    /* этап 12: оформление залов. HS — проверенные стили; HSS — поверхности (стены, пол, потолок) зала для замены материала; hsP_(k) — у зала свои картины (прежние картины зала не строятся) */
    /* этап 13: ветки залов автора в музее книги (место проверено: не пересекают залы и друг друга; неверное — не строится) */
    const ABR=[];if(BOOK)(opt.branches||[]).forEach(s=>{const g=brGeo(s);if(g&&!brClash(g,ABR).length)ABR.push(g)});
    const HS=BOOK?hsValid(opt.hallStyles):{},HSS=[],HS_T={};Object.keys(HS).forEach(k=>{const l=HS[k].light;if(l)HS_T[k]=l==="warm"?[1.06,.97,.84]:l==="cool"?[.88,.96,1.08]:"n"});
    const hsSlot=(k,part,mesh,face)=>{if(HS[k]&&HS[k][part])HSS.push({k,part,mesh,face:face==null?-1:face})},hsP_=k=>!!(HS[k]&&HS[k].paintings);
/* картины и тексты под светом зала получают немного самосвечения: в тёмных залах они остаются читаемыми */
const textPlane=(c,w,h,x,y,z,ry=0,basic=true)=>{const t=new T.CanvasTexture(c);c.__tex=t;const m=new T.Mesh(new T.PlaneGeometry(w,h),basic?new T.MeshBasicMaterial({map:t}):new T.MeshLambertMaterial({map:t,emissive:0xffffff,emissiveMap:t,emissiveIntensity:AIR[HALLZ[hallAt(z)].k].em}));m.position.set(x,y,z);m.rotation.y=ry;S.add(m);return m};

    /* залы */
    let z=0;const HALLZ=[];
    (BOOK?SPEC:[]).forEach((s,i)=>{
      const z0=z,z1=z-s.D,H=s.tall?8.5:(s.k==="pr"||s.k==="sv"||s.k==="dv"?4.6:4.2),A=AIR[s.k];HALLZ.push({...s,z0,z1,H,cz:(z0+z1)/2,pools:[]});
      const fl=new T.Mesh(new T.PlaneGeometry(HW*2,s.D,sg(HW*2),sg(s.D)),bmat({map:tex(s.floor,"",[HW/2,s.D/4])}));fl.rotation.x=-Math.PI/2;fl.position.set(0,0,(z0+z1)/2);S.add(fl);floors.push(fl);surf.push(fl);
      const ce=new T.Mesh(new T.PlaneGeometry(HW*2,s.D,sg(HW*2),sg(s.D)),bmat({color:new T.Color(s.ceil)}));surf.push(ce);hsSlot(s.k,"floor",fl);hsSlot(s.k,"ceil",ce);
      /* светильники на потолке: светящиеся панели + пятна света под ними */
      if(!s.tall&&s.k!=="sv"){const wide=s.k==="kl"||s.k==="id"||s.k==="n";const fx=new T.MeshBasicMaterial({color:s.k==="dv"?0x7FE0C8:s.k==="n"?0x2A1614:s.k==="ot"?0xFFCB8E:wide?0xF7FAFF:0xFFF1D6}),fxR=new T.MeshBasicMaterial({color:0xFF5A3C});
        for(let q=0;q<Math.floor(s.D/5);q++)[-3.5,3.5].forEach((xx,j)=>{const red=s.k==="kl"&&(q+j)%2===0;const f=new T.Mesh(new T.PlaneGeometry(wide?2.2:.7,wide?.35:.7),red?fxR:fx);f.rotation.x=Math.PI/2;f.position.set(xx,H-.01,z0-2.5-q*5);S.add(f);
          if(s.k!=="n")HALLZ[i].pools.push({x:xx,z:z0-2.5-q*5,r:A.r,w:A.fw||1,c:red?[.85,.16,.08]:null,lc:red?0xFF8A70:null})})}
      ce.rotation.x=Math.PI/2;ce.position.set(0,H,(z0+z1)/2);S.add(ce);
      const wm=bmat({map:tex(s.tex,s.wall,[s.D/3,H/3])});tintMat(wm,wm.map,s.wall);
      const base=mat(0x1d1a17);
      /* боковые стены: проёмы — в коридор квартир (левая стена «Квартир», этап 9), в «Базу» (правая стена «Предметов», этап 6/11) и в ветки залов автора (этап 13);
         стена с проёмами — куски и перемычки, UV — как у целой стены */
      ["w","e"].forEach(wn=>{const g=wn==="e"?1:-1,hl=[];if(i===0&&wn==="w")hl.push([CORR.DZ-CORR.DW,CORR.DZ+CORR.DW,CORR.DH]);if(i===BASE_HALL&&wn==="e")hl.push([BASE.DZ-BASE.DW,BASE.DZ+BASE.DW,BASE.DH]);
        ABR.forEach(q=>{if(q.i===i&&q.wall===wn)hl.push([q.c-BR_DW/2,q.c+BR_DW/2,BR_DH])});hl.sort((p,q)=>p[0]-q[0]);
        if(!hl.length){const wl=new T.Mesh(new T.PlaneGeometry(s.D,H,sg(s.D),Math.max(4,sg(H))),wm);wl.rotation.y=-g*Math.PI/2;wl.position.set(g*HW,H/2,(z0+z1)/2);S.add(wl);
          camBlock.push(wl);surf.push(wl);hsSlot(s.k,"wall",wl);box(.04,.16,s.D,base,g*(HW-.02),.08,(z0+z1)/2);return}
        const pc=(za,zb,ya,yb)=>{const L=zb-za,hh=yb-ya,gg=new T.PlaneGeometry(L,hh,sg(L),Math.max(2,sg(hh))),uv=gg.attributes.uv;
          for(let q=0;q<uv.count;q++)uv.setXY(q,(g<0?z0-zb:za-z1)/s.D+uv.getX(q)*L/s.D,ya/H+uv.getY(q)*hh/H);
          const p=new T.Mesh(gg,wm);p.rotation.y=-g*Math.PI/2;p.position.set(g*HW,(ya+yb)/2,(za+zb)/2);S.add(p);camBlock.push(p);surf.push(p);hsSlot(s.k,"wall",p)};
        let a=z1;hl.forEach(([ha,hb,hh])=>{if(ha>a){pc(a,ha,0,H);box(.04,.16,ha-a,base,g*(HW-.02),.08,(a+ha)/2)}pc(ha,hb,hh,H);a=Math.max(a,hb)});
        if(z0>a){pc(a,z0,0,H);box(.04,.16,z0-a,base,g*(HW-.02),.08,(a+z0)/2)}});
      /* перегородка в конце зала с проёмом */
      const pm=bmat({map:tex(s.tex,s.wall,[2,H/3])});tintMat(pm,pm.map,s.wall);const endFull=i===SPEC.length-1;
      if(endFull){const e=new T.Mesh(new T.PlaneGeometry(HW*2,H,sg(HW*2),Math.max(4,sg(H))),pm);e.position.set(0,H/2,z1);S.add(e);camBlock.push(e);surf.push(e);hsSlot(s.k,"wall",e)}
      else{const nH=Math.max(H,HALLZ[i]?H:H);[-1,1].forEach(sgn=>{const w=HW-1.5;const p=new T.Mesh(new T.BoxGeometry(w,nH,.3,sg(w),Math.max(4,sg(nH)),1),pm);p.position.set(sgn*(1.5+w/2),nH/2,z1);S.add(p);camBlock.push(p);surf.push(p);hsSlot(s.k,"wall",p,4);hsSlot(SPEC[i+1].k,"wall",p,5)});
        const lint=new T.Mesh(new T.BoxGeometry(3,nH-3,.3,2,2,1),pm);lint.position.set(0,3+(nH-3)/2,z1);S.add(lint);camBlock.push(lint);surf.push(lint);hsSlot(s.k,"wall",lint,4);hsSlot(SPEC[i+1].k,"wall",lint,5);
        const fr=mat(0x2a241f);box(.12,3,.36,fr,-1.5,1.5,z1);box(.12,3,.36,fr,1.5,1.5,z1);box(3.2,.12,.36,fr,0,3,z1);
        /* табличка следующего зала */
        textPlane(textCanvas(opt.halls[SPEC[i+1].k],"",{w:512,h:96,ts:40,pad:24,bg:"#141619",fg:"#E9EDF0",font:"Golos Text, sans-serif"}),1.6,.3,0,3.35,z1+.16)}
      if(i===0){const hl=ABR.filter(q=>q.i===0&&q.wall==="s").map(q=>[q.c-BR_DW/2,q.c+BR_DW/2,BR_DH]).sort((p,q)=>p[0]-q[0]);
        const pc=(xa,xb,ya,yb)=>{const L=xb-xa,hh=yb-ya,gg=new T.PlaneGeometry(L,hh,sg(L),Math.max(hl.length?2:4,sg(hh))),uv=gg.attributes.uv;
          if(hl.length)for(let q=0;q<uv.count;q++)uv.setXY(q,(HW-xb)/(2*HW)+uv.getX(q)*L/(2*HW),ya/H+uv.getY(q)*hh/H);
          const e=new T.Mesh(gg,pm);e.rotation.y=Math.PI;e.position.set((xa+xb)/2,(ya+yb)/2,z0);S.add(e);camBlock.push(e);surf.push(e);hsSlot(s.k,"wall",e)};
        let a=-HW;hl.forEach(([ha,hb,hh])=>{if(ha>a)pc(a,ha,0,H);pc(ha,hb,hh,H);a=hb});if(HW>a)pc(a,HW,0,H)}
      walk.push([-HW+.45,HW-.45,z1+.45,z0-.45]);if(!endFull)walk.push([-1.1,1.1,z1-.6,z1+.6]);
      /* название зала на стене у входа */
      textPlane(textCanvas(opt.halls[s.k],s.sub,{w:1024,h:300,ts:64,bs:30,pad:40,bg:/^(sv|dv|ot|n|kr)$/.test(s.k)?"#141619":"#FFFFFF",fg:/^(sv|dv|ot|n|kr)$/.test(s.k)?"#E9EDF0":"#16191D",fg2:"#8A939B"}),2.4,.7,-HW+.02,2.3,z0-2.2,Math.PI/2);
      z=z1;
    });
    /* — этап 6: «База Героев»: поверхности (пол, ковролин входной зоны, потолок, четыре стены с проёмом), проход, обход — */
    const baseSurf=[];
    BOOK&&(function(){const B=BASE,W=B.x1-B.x0,D=B.z0-B.z1,H=B.H,cx=(B.x0+B.x1)/2,cz=(B.z0+B.z1)/2;
      HALLZ.push({k:"hb",side:true,bz:BZ,sub:"",floor:"rubber",D,z0:B.z0,z1:B.z1,x0:B.x0,x1:B.x1,H,cz,cx,pools:[]});
      /* UV в метрах: текстура повторяется по метру (резина, ковролин) или по три метра (штукатурка) */
      const pl=(w,h,m,uvk)=>{const g=new T.PlaneGeometry(w,h,sg(w),Math.max(2,sg(h))),uv=g.attributes.uv;for(let q=0;q<uv.count;q++)uv.setXY(q,uv.getX(q)*w/uvk,uv.getY(q)*h/uvk);const me=new T.Mesh(g,m);S.add(me);baseSurf.push(me);surf.push(me);return me};
      const CX=12.6;/* граница ковролина и резины */
      const fr=pl(B.x1-CX,D,bmat({map:tex("rubber","",[1,1])}),1);fr.rotation.x=-Math.PI/2;fr.position.set((CX+B.x1)/2,0,cz);floors.push(fr);
      const fc=pl(CX-B.x0,D,bmat({map:tex("carpet","",[1,1])}),1);fc.rotation.x=-Math.PI/2;fc.position.set((B.x0+CX)/2,0,cz);floors.push(fc);
      const ce=pl(W,D,bmat({color:new T.Color(0x2B2E34)}),3);ce.rotation.x=Math.PI/2;ce.position.set(cx,H,cz);hsSlot("hb","floor",fr);hsSlot("hb","floor",fc);hsSlot("hb","ceil",ce);
      const wm=bmat({map:tex("plaster","#B7BDC3",[1,1])});tintMat(wm,wm.map,"#B7BDC3");
      const wall=(w,h,x,y,z,ry)=>{const m=pl(w,h,wm,3);m.rotation.y=ry;m.position.set(x,y,z);camBlock.push(m);hsSlot("hb","wall",m);return m};
      wall(W,H,cx,H/2,B.z0,Math.PI);wall(W,H,cx,H/2,B.z1,0);
      /* этап 10: в восточной стене — проём в «Базу Б» (два куска и перемычка) */
      {const C2=BASE2,ea=C2.DZ-C2.DW,eb=C2.DZ+C2.DW;wall(B.z0-eb,H,B.x1,H/2,(B.z0+eb)/2,-Math.PI/2);wall(ea-B.z1,H,B.x1,H/2,(ea+B.z1)/2,-Math.PI/2);wall(eb-ea,H-C2.DH,B.x1,(C2.DH+H)/2,C2.DZ,-Math.PI/2)}
      const da=B.DZ-B.DW,db=B.DZ+B.DW;wall(B.z0-db,H,B.x0,H/2,(B.z0+db)/2,Math.PI/2);wall(da-B.z1,H,B.x0,H/2,(da+B.z1)/2,Math.PI/2);wall(db-da,H-B.DH,B.x0,(B.DH+H)/2,B.DZ,Math.PI/2);
      walk.push([B.x0+.45,B.x1-.45,B.z1+.45,B.z0-.45]);walk.push([HW-.7,B.x0+.7,B.DZ-B.DW+.42,B.DZ+B.DW-.42])})();
    /* — этап 10: «База Б» — вторая арена за восточной стеной «Базы А»: пол из резиновых плит, тёмный открытый потолок, стены расписаны
       на холсте (синие и серые зигзаги с белым контуром, надпись «БАЗА [Б]»; южная стена — сиреневая), проём из «А», обход — */
    const IB2=BOOK?HALLZ.length:-99,base2Surf=[],B2TEX=[];
    BOOK&&(function(){const B=BASE2,W=B.x1-B.x0,D=B.z0-B.z1,H=B.H,cx=(B.x0+B.x1)/2,cz=(B.z0+B.z1)/2;
      HALLZ.push({k:B.k,side:true,bz:BZ,base2:true,sub:"",floor:"rubber",D,z0:B.z0,z1:B.z1,x0:B.x0,x1:B.x1,H,cz,cx,pools:[],name:B.name,spawn:{x:B.x0+1.3,z:B.DZ,yaw:-Math.PI/2}});
      const pl=(w,h,m,uvk)=>{const g=new T.PlaneGeometry(w,h,sg(w),Math.max(2,sg(h))),uv=g.attributes.uv;if(uvk)for(let q=0;q<uv.count;q++)uv.setXY(q,uv.getX(q)*w/uvk,uv.getY(q)*h/uvk);const me=new T.Mesh(g,m);S.add(me);base2Surf.push(me);surf.push(me);return me};
      const fl=pl(W,D,bmat({map:tex("rubber","",[1,1])}),1);fl.rotation.x=-Math.PI/2;fl.position.set(cx,0,cz);floors.push(fl);
      const ce=pl(W,D,bmat({color:new T.Color(0x1E2025)}),3);ce.rotation.x=Math.PI/2;ce.position.set(cx,H,cz);
      /* роспись стены — холст по метрам (≈100 px/м) */
      const PXM=100,BL="#2B62C9",GR="#C8CCD2",WH="#F4F6F8";
      const zig=(Wm,o)=>cnv(Math.min(2048,Math.round(Wm*PXM)),512,(g,w,h)=>{const sx=w/Wm,sy=h/H,Y=m=>h-m*sy,X=m=>m*sx;g.fillStyle=BL;g.fillRect(0,0,w,h);
        /* серая полоса-молния: верх и низ — ломаные, контур белый, параллельная тонкая белая линия */
        const n=Math.max(2,Math.round(Wm/3.2)),pts=[];for(let i=0;i<=n;i++){const xm=i*Wm/n,up=(i+o.ph)%2;pts.push([xm,up?3.5:1.9])}
        const band=(off,th)=>{g.beginPath();pts.forEach(([xm,ym],i)=>{const x=X(xm),y=Y(ym+off);i?g.lineTo(x,y):g.moveTo(x,y)});for(let i=pts.length-1;i>=0;i--){const [xm,ym]=pts[i];g.lineTo(X(xm),Y(ym+off-th))}g.closePath()};
        band(0,1.45);g.fillStyle=GR;g.fill();g.lineJoin="miter";g.strokeStyle=WH;g.lineWidth=11;g.stroke();
        g.beginPath();pts.forEach(([xm,ym],i)=>{const x=X(xm),y=Y(ym+.32);i?g.lineTo(x,y):g.moveTo(x,y)});g.lineWidth=6;g.stroke();
        /* вложенные «шевроны»-рамки (как на фото) */
        (o.chev||[]).forEach(([xm,ym,sz])=>{g.save();g.translate(X(xm),Y(ym));g.rotate(Math.PI/4);g.strokeStyle=WH;g.lineWidth=9;g.strokeRect(-sz*sx/2,-sz*sx/2,sz*sx,sz*sx);g.lineWidth=5;g.strokeRect(-sz*sx/3,-sz*sx/3,sz*sx*2/3,sz*sx*2/3);g.restore()});
        /* верх у потолка — тёмная полоса, низ — серый цоколь */
        g.fillStyle="#2A2C31";g.fillRect(0,0,w,Y(4.55));g.fillStyle="#9EA3AA";g.fillRect(0,Y(.12),w,h);
        if(o.label){const lx=X(o.label[0]),ly=Y(o.label[1]);g.font="700 46px Golos Text, Arial, sans-serif";const tw=g.measureText(o.label[2]).width;
          g.fillStyle=GR;g.fillRect(lx-tw/2-30,ly-40,tw+60,74);g.strokeStyle=WH;g.lineWidth=6;g.strokeRect(lx-tw/2-30,ly-40,tw+60,74);g.fillStyle=BL;g.textAlign="center";g.textBaseline="middle";g.fillText(o.label[2],lx,ly-2)}
        noise(g,w,h,6)});
      const lilac=Wm=>cnv(Math.min(2048,Math.round(Wm*PXM)),512,(g,w,h)=>{const sy=h/H,Y=m=>h-m*sy;g.fillStyle="#B391DD";g.fillRect(0,0,w,h);g.fillStyle="#C4A9E6";g.fillRect(0,Y(3.1),w,Y(2.9)-Y(3.1));
        g.fillStyle="#2A2C31";g.fillRect(0,0,w,Y(4.55));g.fillStyle="#8E86A0";g.fillRect(0,Y(.12),w,h);noise(g,w,h,6)});
      const tmat=c=>{const t=new T.CanvasTexture(c);t.anisotropy=4;B2TEX.push(t);return bmat({map:t})};
      /* стена с проёмами: куски с UV — своей долей холста */
      const wallT=(L,x,z,ry,m,holes)=>{const pcs=[];let a=0;(holes||[]).forEach(hh=>{pcs.push([a,hh.a,0,H]);pcs.push([hh.a,hh.b,hh.h,H]);a=hh.b});pcs.push([a,L,0,H]);
        pcs.forEach(([a,b,y0,y1])=>{const l=b-a,hh=y1-y0;if(l<.01||hh<.01)return;const g=new T.PlaneGeometry(l,hh,sg(l),Math.max(2,sg(hh))),uv=g.attributes.uv;
          for(let q=0;q<uv.count;q++)uv.setXY(q,(a+uv.getX(q)*l)/L,(y0+uv.getY(q)*hh)/H);const me=new T.Mesh(g,m);const mid=(a+b)/2-L/2,c=Math.cos(ry),sn=Math.sin(ry);
          me.position.set(x+mid*c,(y0+y1)/2,z-mid*sn);me.rotation.y=ry;S.add(me);base2Surf.push(me);surf.push(me);camBlock.push(me)})};
      wallT(W,cx,B.z0,Math.PI,tmat(zig(W,{ph:0,chev:[[3.2,2.6,1.2],[15.6,2.4,1.0]]})));
      wallT(D,B.x1,cz,-Math.PI/2,tmat(zig(D,{ph:1,label:[D/2,4.05,"БАЗА [Б]"],chev:[[2.2,2.7,.9]]})));
      wallT(W,cx,B.z1,0,tmat(lilac(W)));
      /* западная стена (из «А»): проём; доля холста отсчитывается от северного края (u растёт к югу — вправо для смотрящего изнутри) */
      wallT(D,B.x0,cz,Math.PI/2,tmat(zig(D,{ph:0,chev:[[10.6,2.6,.9]]})),[{a:B.z0-(B.DZ+B.DW),b:B.z0-(B.DZ-B.DW),h:B.DH}]);
      walk.push([B.x0+.45,B.x1-.45,B.z1+.45,B.z0-.45]);walk.push([BASE.x1-.75,B.x0+.75,B.DZ-B.DW+.42,B.DZ+B.DW-.42]);
      block(BASE.x1,B.x0,B.DZ-B.DW,B.DZ+B.DW,4.2,"ns",B.DH);/* перемычка проёма */
      stopFns.push(()=>B2TEX.forEach(t=>t.dispose()))})();
    /* — этап 9: ветка у «Квартир»: коридор и комнаты квартир из данных (FL). Здесь — пространства (место в HALLZ, прямоугольник, свет),
       пол с текстурой, обход, проёмы и перемычки; стены, двери и мебель собираются ниже, в обстановке (PROPS.kit с системой координат комнаты) — */
    const IC=HALLZ.length,LINKS=new Set(),PORT=[],BR={rooms:[],closed:[],surf:[],labels:[]};
    const link=(a,b)=>{LINKS.add(a+"-"+b);LINKS.add(b+"-"+a)};if(BOOK){link(BASE_HALL,IB);link(IB,IB2)}
    if(BOOK)PORT.push({a:IB,b:IB2,ax:"x",at:BASE2.xm,c:BASE2.DZ,w:BASE2.DW});
    /* система координат комнаты: x — поперёк (от −w/2 слева, если смотреть от двери), z — вглубь (0 у двери, −d у дальней стены) */
    const frameP=(F,x,z)=>{const c=Math.round(Math.cos(F.rot)),s=Math.round(Math.sin(F.rot));return [F.ox+x*c+z*s,F.oz-x*s+z*c]};
    const rectW=(F,x0,z0,x1,z1)=>{const a=frameP(F,x0,z0),b=frameP(F,x1,z1);return [Math.min(a[0],b[0]),Math.max(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[1],b[1])]};
    BOOK&&(function(){const C=CORR,W=C.x1-C.x0,D=C.z0-C.z1,wt=C.wallT;
      HALLZ.push({k:C.k,side:true,branch:"c",sub:"",floor:C.floor,D:W,z0:C.z0,z1:C.z1,x0:C.x0,x1:C.x1,H:C.H,cz:(C.z0+C.z1)/2,cx:(C.x0+C.x1)/2,
        pools:CORR.lamps.map(x=>({x,z:(C.z0+C.z1)/2,r:1.9,w:1})).concat([{x:C.x0+.4,z:(C.z0+C.z1)/2,r:1.6,w:.7,c:[.3,.32,.34]}]),
        name:C.name,short:C.short,spawn:{x:C.x1-3.4,z:C.DZ,yaw:Math.PI/2},hit:[C.x0-1,C.xm,C.z1-wt/2,C.z0+wt/2]});
      link(0,IC);PORT.push({a:0,b:IC,ax:"x",at:C.xm,c:C.DZ,w:C.DW});
      const flr=(w,d,cx,cz,rot,name,rep,hi)=>{const g=new T.PlaneGeometry(w,d,Math.max(2,Math.ceil(w/.6)),Math.max(2,Math.ceil(d/.6)));const m=new T.Mesh(g,bmat({map:tex(name,"",rep)}));
        m.rotation.set(-Math.PI/2,rot,0,"YXZ");m.position.set(cx,0,cz);S.add(m);floors.push(m);surf.push(m);BR.surf.push({hi,m});return m};
      flr(W,D,(C.x0+C.x1)/2,(C.z0+C.z1)/2,0,C.floor,[W/2.4,D/2.4],IC);
      walk.push([C.x0+.4,C.x1-.4,C.z1+.4,C.z0-.4]);walk.push([C.x1-.7,-HW+.7,C.DZ-C.DW+.42,C.DZ+C.DW-.42]);
      block(C.x1,-HW,C.DZ-C.DW,C.DZ+C.DW,4.2,"ns",C.DH);/* перемычка проёма из «Квартир» */
      /* комната: место по двери (из коридора — сторона и dx квартиры; из другой комнаты — её дверь в стене l/r/b), пространство, пол, обход, проём */
      function addRoom(f,r,F,from){const hi=HALLZ.length,w=r.w,d=r.d,rc=rectW(F,-w/2,0,w/2,-d),sp=frameP(F,r.dox||0,-Math.min(3.4,d*.36));
        const pools=(r.lights||[]).map(L=>{const p=frameP(F,L.x,L.z);return Object.assign({},L,{x:p[0],z:p[1]})});
        HALLZ.push({k:r.k,side:true,branch:"r",room:r,flat:f,F,floor:r.floor||"oak",D:d,x0:rc[0],x1:rc[1],z0:rc[3],z1:rc[2],H:r.H||2.8,cz:(rc[2]+rc[3])/2,cx:(rc[0]+rc[1])/2,
          pools,name:r.name,short:r.short||r.name,spawn:{x:sp[0],z:sp[1],yaw:F.rot},hit:[rc[0]-wt/2,rc[1]+wt/2,rc[2]-wt/2,rc[3]+wt/2]});
        const R_={r,f,hi,F,holes:{d:[],l:[],r:[],b:[]},closed:[]};BR.rooms.push(R_);link(from.hi,hi);
        /* проём, через который вошли: дыра в стене с дверью (z=0), обход сквозь толщу стены, перемычка, переход света */
        const dox=r.dox||0,dw=r.dw||.9,dh=r.dh||2.1;R_.holes.d.push({a:dox-dw/2,b:dox+dw/2,h:dh,entry:1});
        const pr=rectW(F,dox-dw/2+.34,.6,dox+dw/2-.34,-.55);walk.push([pr[0],pr[1],pr[2],pr[3]]);
        const ln=rectW(F,dox-dw/2,wt,dox+dw/2,0);block(ln[0],ln[1],ln[2],ln[3],4.2,"ns",dh);
        const pc=frameP(F,dox,wt/2),ax=Math.abs(Math.round(Math.sin(F.rot)))?"x":"z";PORT.push({a:from.hi,b:hi,ax,at:ax==="x"?pc[0]:pc[1],c:ax==="x"?pc[1]:pc[0],w:dw/2});
        flr(w,d,(rc[0]+rc[1])/2,(rc[2]+rc[3])/2,F.rot,r.floor||"oak",[w/2.4,d/2.4],hi);
        walk.push([rc[0]+.4,rc[1]-.4,rc[2]+.4,rc[3]-.4]);
        /* двери в стенах комнаты: to — соседняя комната той же квартиры (её дверь совпадает с этой), null — закрытая скрытая дверь */
        (r.doors||[]).forEach(dr=>{const nx=(f.rooms||[]).find(q=>q&&q.k===dr.to&&q!==r&&!BR.rooms.some(B=>B.r.k===q.k)&&ROOMS_.includes(q));
          if(!nx){R_.closed.push(dr);return}
          const phi=dr.wall==="l"?Math.PI/2:dr.wall==="r"?-Math.PI/2:0,pL=dr.wall==="l"?[-w/2-wt,dr.at]:dr.wall==="r"?[w/2+wt,dr.at]:[dr.at,-d-wt];
          const cp=Math.round(Math.cos(phi)),spp=Math.round(Math.sin(phi)),ndx=nx.dox||0,o2=[pL[0]-ndx*cp,pL[1]+ndx*spp],ow=frameP(F,o2[0],o2[1]);
          R_.holes[dr.wall].push({a:dr.at-(dr.w||.9)/2,b:dr.at+(dr.w||.9)/2,h:dr.h||2.1});
          addRoom(f,Object.assign({},nx,{dox:ndx,dw:dr.w||nx.dw||.9,dh:dr.h||nx.dh||2.1,nolf:dr.leaf===false}),{ox:ow[0],oz:ow[1],rot:F.rot+phi},{hi})})}
      FL.forEach(f=>{const r=(Array.isArray(f.rooms)?f.rooms:[]).find(q=>q&&ROOMS_.includes(q));const n=f.side==="n";
        if(!r){BR.closed.push(f);return}
        const F={ox:n?f.dx+(r.dox||0):f.dx-(r.dox||0),oz:n?C.z0+wt:C.z1-wt,rot:n?Math.PI:0};f.__open=r;addRoom(f,r,F,{hi:IC})})})();
    /* ---------- этап 8, часть 2: этажи посетителей (мир WORLD) и расстановка предметов в 3D.
       Мир этажа: лобби с лифтом, коридор с дверями по очереди слева и справа, за каждой дверью — комната из настроек пространства (server/SPACES.md).
       Стены, пол и потолок комнаты — собственные фотографии владельца (повторять как обои / растянуть как фото), без них — заданный цвет;
       картинки грузятся, когда посетитель подходит к двери, и освобождаются, когда он далеко. Предметы: «картина на стене» — рамка на высоте глаз
       с табличкой; «предмет на постаменте» — постамент, наклонная карточка с изображением и табличка. Нет картинки или не загрузилась —
       нейтральная карточка с названием (ничего не выдумываем взамен). Тот же движок, что у музея книги: фигура, камеры, управление, чат, карта ---------- */
    let MPX=0,WID=WORLD?"f:"+WORLD.floor:"";
    /* этап 20: этаж ∞ — библиотека как мир того же движка (геометрия и счёт адресов — в babel.js) */
    const LB=WORLD&&WORLD.lib&&window.Babel&&window.Babel.geo?{G:window.Babel.geo,q:0,r:0,L:0,oy:0,cells:new Map(),climb:null,rail:null,railCool:false,seen:new Set(),sk:"",near:false,book:null,ui:null,dlg:null,lamp:null,dust:null}:null;
    if(LB)try{(localStorage.getItem("cv2_babel_seen")||"").split(";").forEach(k=>{if(/^-?\d+,-?\d+,-?\d+$/.test(k))LB.seen.add(k)})}catch(e){}
    const WR=[],WN={},WAIR=[],WTEX=new Set(),WF=WORLD?Object.assign({floor:String(WORLD.floor)},WFLOOR[WORLD.floor]||WFLOOR["17"]):null,WHI={};
    const W_CW=1.5,W_LW=3,W_LZ=5,W_WT=.15,W_DW=1.2,W_DH=2.2,W_H=2.9;let W_LC=10,W_START=0;
    const wLab=k=>k==="-1"?"−1":k==="inf"?"∞":String(k);
    const W_ST={pending:"на проверке",approved:"опубликовано",hidden:"скрыто"};
    /* SPACES.md: начало — центр пола, +z — к двери (юг), x — вправо, если стоять в двери лицом внутрь. Рама комнаты (frameP): z от 0 у двери до −d */
    const wP=(Q,x,zs)=>frameP(Q.F,x,zs-Q.r.d/2);
    const wLocal=(Q,wx,wz)=>{const c=Math.round(Math.cos(Q.F.rot)),s=Math.round(Math.sin(Q.F.rot)),dx=wx-Q.F.ox,dz=wz-Q.F.oz;return [dx*c-dz*s,dx*s+dz*c+Q.r.d/2]};
    const WALLDEF=Q=>{const w=Q.r.w,d=Q.r.d;return {n:{s0:[-w/2,-d/2],t:[1,0],n:[0,1],L:w},e:{s0:[w/2,-d/2],t:[0,1],n:[-1,0],L:d},s:{s0:[w/2,d/2],t:[-1,0],n:[0,-1],L:w},w:{s0:[-w/2,d/2],t:[0,-1],n:[1,0],L:d}}};
    /* этап 13: адрес картинки пространства/зала (в музее книги — opt.spaceUrl); картинки сайта img/… — как есть */
    const WURL=p=>{const f=(WORLD&&WORLD.url)||opt.spaceUrl;let u="";try{u=f?f(p):""}catch(e){}return u||(typeof p==="string"&&/^img\/[A-Za-z0-9_\-\/]+\.(webp|jpg|jpeg|png)$/.test(p)?p:"")};
    const WSAVE=WORLD?WORLD.save:opt.branchSave,WMSG=WORLD?WORLD.msg:opt.spaceMsg;
    /* зал автора: свет зала и картины (hall.paintings) — картины становятся «картинами на стене» с заданным местом и размером (проём обходят, как в залах книги) */
    function wHall(Q){const s=Q.s;if(!isHallRow(s))return;const H=s.hall||{};if(H.light)HS_T[Q.k]=H.light==="warm"?[1.06,.97,.84]:H.light==="cool"?[.88,.96,1.08]:"n";
      const P=(Array.isArray(H.paintings)?H.paintings:[]).slice(0,12).map((p,j)=>({id:"_p"+j,name:p.title||"Картина",descr:"",img:p.img,place:{kind:"wall",wall:p.wall,u:p.u,y:p.y},_p:{w:p.w,h:p.h}}));
      Q.s=Object.assign({},s,{objects:(s.objects||[]).filter(o=>!o._p).concat(P)})}
    const BRQ=[];
    /* ветки залов автора в музее книги: проём в стене зала, коридор-стык, комната по пресету — тем же построителем, что комнаты посетителей */
    function bLayout(){ABR.forEach((g,j)=>{const s=g.s,F=g.F,w=g.w,d=g.d,hi=HALLZ.length,k="ab"+j;
        const Q={s,r:s.room,side:-1,zc:0,i:j,F,br:g,dw:BR_DW,dh:BR_DH,k,hi,on:false,gen:0,meshes:[],surf:{},objs:[],plate:{mesh:null,tex:null}};wHall(Q);
        AIR[k]=AIR.vr;WAIR.push(k);SNDK[k]="vr";WN[k]=s.title;
        const rc=rectW(F,-w/2,0,w/2,-d),st=rectW(F,-BR_DW/2,BR_LS-.01,BR_DW/2,0),u=[Math.min(rc[0],st[0]),Math.max(rc[1],st[1]),Math.min(rc[2],st[2]),Math.max(rc[3],st[3])],sp=frameP(F,0,-Math.min(3.4,d*.55));
        HALLZ.push({k,side:true,branch:"a",abr:g,par:g.i,space:Q.s,Q,F,floor:"vr",D:d,x0:u[0],x1:u[1],z0:u[3],z1:u[2],H:g.h,cz:(rc[2]+rc[3])/2,cx:(rc[0]+rc[1])/2,
          pools:[{x:(rc[0]+rc[1])/2,z:(rc[2]+rc[3])/2,r:Math.max(w,d)*.5,w:.35}],name:s.title,short:s.title,spawn:{x:sp[0],z:sp[1],yaw:F.rot},hit:[Math.min(rc[0]-.1,st[0]),Math.max(rc[1]+.1,st[1]),Math.min(rc[2]-.1,st[2]),Math.max(rc[3]+.1,st[3])]});
        link(g.i,hi);const ax=g.wall==="s"?"z":"x";PORT.push({a:g.i,b:hi,ax,at:ax==="x"?(g.wall==="e"?HW:-HW):0,c:g.c,w:BR_DW/2});
        walk.push([rc[0]+.4,rc[1]-.4,rc[2]+.4,rc[3]-.4]);walk.push(rectW(F,-BR_DW/2+.42,BR_LS+.7,BR_DW/2-.42,-.55));
        const ln=rectW(F,-BR_DW/2,BR_LS+.02,BR_DW/2,-.02);block(ln[0],ln[1],ln[2],ln[3],4.2,"ns",BR_DH);
        /* коридор-стык: пол, потолок, две стены (цвет стен и пола комнаты) */
        const R=s.room||{},wc=(R.walls&&R.walls.all&&R.walls.all.color)||"#E9E4DA",fc=(R.floor&&R.floor.color)||"#8B6F55";
        const sm=(gw,gh,x,y,z,rx,ry,col,fl)=>{const p=frameP(F,x,z),m=new T.Mesh(new T.PlaneGeometry(gw,gh,Math.max(1,Math.ceil(gw/.6)),Math.max(1,Math.ceil(gh/.6))),bmat({color:new T.Color(col)}));
          m.position.set(p[0],y,p[1]);m.rotation.set(rx,F.rot+ry,0,"YXZ");m.visible=false;S.add(m);surf.push(m);Q.meshes.push(m);if(fl)floors.push(m);else if(!rx)camBlock.push(m);return m};
        sm(BR_DW,BR_LS,0,0,BR_LS/2,-Math.PI/2,0,fc,1);sm(BR_DW,BR_LS,0,BR_DH,BR_LS/2,Math.PI/2,0,"#F4F2EE");sm(BR_LS,BR_DH,-BR_DW/2,BR_DH/2,BR_LS/2,0,Math.PI/2,wc);sm(BR_LS,BR_DH,BR_DW/2,BR_DH/2,BR_LS/2,0,-Math.PI/2,wc);
        Q.door=frameP(F,0,BR_LS+.6);const pl=frameP(F,-(BR_DW/2+.55),BR_LS+.012);Q.pl={x:pl[0],z:pl[1],ry:F.rot};
        wShell(Q);BRQ.push(Q)})}
    function stepBranch(hi,now){if(!BRQ.length||now-(stepBranch.t||0)<220)return;stepBranch.t=now;
      BRQ.forEach(Q=>{const p=Q.br.i,dd=Math.hypot(P.x-Q.door[0],P.z-Q.door[1]),want=hi===Q.hi||hi===p||(hi<NH&&Math.abs(hi-p)===1&&dd<14);
        if(want&&!Q.on)wActivate(Q);else if(!want&&Q.on)wDeact(Q);
        const pw=hi===Q.hi||hi===p;if(pw&&!Q.plate.tex)wPlate(Q);else if(!pw&&Q.plate.tex)wPlateOff(Q)})}

    const LBM=LB?{st:new T.MeshLambertMaterial({color:0xFFFFFF}),bk:new T.MeshLambertMaterial({color:0xFFFFFF}),fl:new T.MeshLambertMaterial({color:0x3A2E24,side:T.DoubleSide}),flD:new T.MeshLambertMaterial({color:0x17120E,side:T.DoubleSide}),bulb:new T.MeshBasicMaterial({color:0xFFE7B0})}:null;
    const LB_RI=.3,LB_RO=1.05,LB_NS=16,LB_A0=Math.PI/6+Math.PI;
    /* пол яруса: шестиугольник с шахтой в центре и проёмом лестницы */
    function libFloorGeo(){const G=LB.G,Rv=G.A/Math.cos(Math.PI/6),sh=new T.Shape(),hx=(R,k)=>[Math.cos(Math.PI/6+k*Math.PI/3)*R,-Math.sin(Math.PI/6+k*Math.PI/3)*R];
      for(let k=0;k<6;k++){const p=hx(Rv,k);if(k)sh.lineTo(p[0],p[1]);else sh.moveTo(p[0],p[1])}sh.closePath();
      const h1=new T.Path();for(let k=5;k>=0;k--){const p=hx(G.SH,k);if(k<5)h1.lineTo(p[0],p[1]);else h1.moveTo(p[0],p[1])}h1.closePath();sh.holes.push(h1);
      const h2=new T.Path();h2.absarc(G.SX,-G.SZ,LB_RO+.04,0,Math.PI*2,true);sh.holes.push(h2);return new T.ShapeGeometry(sh,20)}
    const LBG=LB?{box:new T.BoxGeometry(1,1,1),floor:libFloorGeo(),bulb:new T.SphereGeometry(.16,14,10)}:null;
    /* высота ступеней под точкой: −1 — не лестница, Infinity — столб, иначе высота витка */
    function libRamp(x,z){const G=LB.G,dx=x-G.SX,dz=z-G.SZ,r=Math.hypot(dx,dz);if(r<LB_RI)return Infinity;if(r>LB_RO)return -1;let th=(Math.atan2(dz,dx)-LB_A0)%(Math.PI*2);if(th<0)th+=Math.PI*2;return th/(Math.PI*2)*G.H}
    function libStand(x,z,y,step){if(!libValid(x,z))return false;const h=libRamp(x,z);if(h===Infinity)return false;if(h<0)return y<.6;if(h<=y+step)return true;return y<.4&&h>LB.G.H-.5}
    function libGround(x,z,lim){const h=libRamp(x,z);return h>=0&&h<Infinity&&h<=lim?h:0}
    const lbM=[new T.Matrix4(),new T.Matrix4(),new T.Matrix4()],lbC=new T.Color();
    const LBW=LB?LB.G.TH.map((t,i)=>new T.Matrix4().makeTranslation(LB.G.NX[i]*(LB.G.A-LB.G.WT/2),0,LB.G.NZ[i]*(LB.G.A-LB.G.WT/2)).multiply(new T.Matrix4().makeRotationY(Math.PI/2-t))):null;
    const LBBOOK=[0x6B2A22,0x7A4A22,0x2F4A38,0x2B3A55,0x8A7A52,0x4A2E3A,0x5A5148,0x9A8A6A,0x3A4A4A,0x7A2E2E];
    function libBuild(q,r,L){const G=LB.G,g=new T.Group(),[m4,m4b,m4c]=lbM,col=lbC,dk=G.dark(q,r,L),sh=c=>dk?col.setHex(c).multiplyScalar(.42).getHex():c;g.userData={q,r,L,dark:dk};
      const fl=new T.Mesh(LBG.floor,dk?LBM.flD:LBM.fl);fl.rotation.x=-Math.PI/2;g.add(fl);g.userData.fl=fl;
      const st=new T.InstancedMesh(LBG.box,LBM.st,96);let n=0;
      const put=(base,x,y,z,sx,sy,sz,c,ry)=>{m4.makeTranslation(x,y,z);if(ry){m4b.makeRotationY(ry);m4.multiply(m4b)}m4b.makeScale(sx,sy,sz);m4.multiply(m4b);if(base){m4c.copy(base).multiply(m4);st.setMatrixAt(n,m4c)}else st.setMatrixAt(n,m4);st.setColorAt(n,col.setHex(sh(c)));n++};
      const walls=[],W=G.W,H=G.H;
      for(let i=0;i<6;i++){if(G.isDoor(q,r,L,i)){const sw=(W-G.DW)/2;put(LBW[i],-(G.DW/2+sw/2),H/2,0,sw,H,G.WT,0x4B3828);put(LBW[i],G.DW/2+sw/2,H/2,0,sw,H,G.WT,0x4B3828);put(LBW[i],0,G.DH+(H-G.DH)/2,0,G.DW,H-G.DH,G.WT,0x4B3828)}
        else{walls.push(i);put(LBW[i],0,H/2,0,W,H,G.WT,0x4B3828);for(let s=0;s<G.SHELVES;s++)put(LBW[i],0,.28+s*.56,-.24,W-.5,.04,.3,0x5E4832)}}
      for(let k=0;k<6;k++){const t=k*Math.PI/3,ap=G.SH*Math.cos(Math.PI/6);[1.02,.55].forEach(y=>put(null,Math.cos(t)*ap,y,Math.sin(t)*ap,G.SH,.05,.05,0x9A7A42,Math.PI/2-t));const tv=t+Math.PI/6;put(null,Math.cos(tv)*G.SH,.52,Math.sin(tv)*G.SH,.06,1.04,.06,0x9A7A42)}
      /* винтовая лестница: по ней идут ногами; виток — один ярус, верх витка — пол следующего яруса */
      put(null,G.SX,H/2,G.SZ,.22,H,.22,0x2A2019);for(let k=0;k<LB_NS;k++){const th=(k+.5)/LB_NS*Math.PI*2,a=LB_A0+th,rc=(LB_RI+LB_RO)/2;put(null,G.SX+Math.cos(a)*rc,(k+.5)/LB_NS*H-.03,G.SZ+Math.sin(a)*rc,LB_RO-LB_RI,.06,.34,0x35281D,-a);
        if(k%2===0)put(null,G.SX+Math.cos(a)*LB_RO,(k+.5)/LB_NS*H+.5,G.SZ+Math.sin(a)*LB_RO,.04,1,.04,0x9A7A42)}
      st.count=n;st.instanceMatrix.needsUpdate=true;if(st.instanceColor)st.instanceColor.needsUpdate=true;g.add(st);g.userData.st=st;
      const NB=G.NB,bk=new T.InstancedMesh(LBG.box,LBM.bk,Math.max(1,walls.length*G.SHELVES*NB)),Rn=G.rng(G.hash(q,r,L,1,2,3));let bi=0;
      walls.forEach(wi=>{for(let s=0;s<G.SHELVES;s++){let x=-(W-.7)/2;const step=(W-.7)/NB,cutB=Rn()<.07?Math.floor(Rn()*NB):NB;for(let b=0;b<NB;b++){const bw=step*(.72+Rn()*.22),bh=.3+Rn()*.14,lean=Rn()<.06?(Rn()-.5)*.3:0,gone=Rn()<.05||b>=cutB;
          m4.makeTranslation(x+step/2,.3+s*.56+bh/2,-.24);if(lean){m4b.makeRotationZ(lean);m4.multiply(m4b)}m4b.makeScale(gone?0:bw,gone?0:bh,.2+Rn()*.05);m4.multiply(m4b);m4c.copy(LBW[wi]).multiply(m4);bk.setMatrixAt(bi,m4c);
          col.setHex(LBBOOK[Math.floor(Rn()*LBBOOK.length)]);col.offsetHSL(0,0,(Rn()-.5)*.08);if(dk)col.multiplyScalar(.42);bk.setColorAt(bi,col);bi++;x+=step}}});
      bk.count=bi;bk.instanceMatrix.needsUpdate=true;if(bk.instanceColor)bk.instanceColor.needsUpdate=true;bk.userData={walls,q,r,L};g.add(bk);g.userData.bk=bk;
      if(!dk)[Math.PI*5/6,Math.PI*3/2].forEach(t=>{const b=new T.Mesh(LBG.bulb,LBM.bulb);b.position.set(Math.cos(t)*2.6,H-.55,Math.sin(t)*2.6);g.add(b)});
      S.add(g);floors.push(fl);camBlock.push(st);camBlock.push(fl);return g}
    function libDrop(g){S.remove(g);const u=g.userData;let i=floors.indexOf(u.fl);if(i>=0)floors.splice(i,1);i=camBlock.indexOf(u.st);if(i>=0)camBlock.splice(i,1);i=camBlock.indexOf(u.fl);if(i>=0)camBlock.splice(i,1);u.st.dispose();u.bk.dispose()}
    function libValid(x,z){const G=LB.G;if(LB.climb)return false;if(Math.hypot(x,z)<G.SH+.42)return false;
      for(let i=0;i<6;i++){const d=G.NX[i]*x+G.NZ[i]*z;if(G.isDoor(LB.q,LB.r,LB.L,i)){const lat=-G.NZ[i]*x+G.NX[i]*z;if(d>G.A-.5&&Math.abs(lat)>G.DW/2-.34)return false;if(d>G.A+1.2)return false}else if(d>G.A-.82)return false}return true}
    function libWid(){const o=WID;WID="inf:"+LB.q+","+LB.r+","+LB.L;if(o!==WID)delete WHI[o];WHI[WID]=0;if(HALLZ[0])HALLZ[0].wid=WID}
    function libPlace(){const G=LB.G;LB.cells.forEach(g=>{const u=g.userData,dq=u.q-LB.q,dr=u.r-LB.r;g.position.set(dq*G.E0[0]+dr*G.E1[0],(u.L-LB.L)*G.H-LB.oy,dq*G.E0[1]+dr*G.E1[1])})}
    function libSync(){const G=LB.G,want=new Map(),add=(q,r,L)=>{const k=q+","+r+","+L;if(want.has(k))return false;want.set(k,[q,r,L]);return true};
      const reach=(L,depth,cap)=>{let fr=[[LB.q,LB.r]];add(LB.q,LB.r,L);let n=1;for(let d=0;d<depth&&n<cap;d++){const nx=[];fr.forEach(([q,r])=>{for(let i=0;i<6;i++)if(n<cap&&G.isDoor(q,r,L,i)){const q2=q+G.DQ[i][0],r2=r+G.DQ[i][1];if(add(q2,r2,L)){n++;nx.push([q2,r2])}}});fr=nx}};
      reach(LB.L,3,lite?10:18);reach(LB.L+1,1,5);reach(LB.L-1,1,5);
      LB.cells.forEach((g,k)=>{if(!want.has(k)){libDrop(g);LB.cells.delete(k)}});want.forEach(([q,r,L],k)=>{if(!LB.cells.has(k))LB.cells.set(k,libBuild(q,r,L))});libPlace()}
    function libSave(){lsSet("cv2_babel",JSON.stringify({q:LB.q,r:LB.r,L:LB.L,x:+P.x.toFixed(2),z:+P.z.toFixed(2),yaw:+P.yaw.toFixed(2)}))}
    function libLayout(){const G=LB.G;WN.wi="Библиотека";let sp={x:0,z:2.4,yaw:Math.PI};
      try{const s=JSON.parse(lsGet("cv2_babel")||"null");if(s&&[s.q,s.r,s.L,s.x,s.z].every(Number.isFinite)){LB.q=s.q|0;LB.r=s.r|0;LB.L=s.L|0;sp={x:s.x,z:s.z,yaw:+s.yaw||0}}else{const rnd=n=>Math.floor((Math.random()*2-1)*n);LB.q=rnd(40000);LB.r=rnd(40000);LB.L=rnd(9000)}}catch(e){}
      if(!libValid(sp.x,sp.z))sp={x:0,z:2.4,yaw:Math.PI};
      HALLZ.push({k:"wi",side:true,world:"c",wid:WID,floor:"concreteDark",D:G.A*2,z0:1e6,z1:-1e6,x0:-1e6,x1:1e6,H:9,cz:0,cx:0,pools:[{x:2.4,z:0,r:2,w:.02},{x:-1.2,z:2.1,r:2,w:.02},{x:-1.2,z:-2.1,r:2,w:.02}],name:"Библиотека",short:"Библиотека",spawn:sp,hit:[-1e6,1e6,-1e6,1e6]});
      libWid();LB.lamp=new T.PointLight(0xFFD49A,1.0,15,1.6);S.add(LB.lamp);
      const DN=matchMedia("(pointer:coarse)").matches?110:240,dp=new Float32Array(DN*3),dv=new Float32Array(DN*3);for(let i=0;i<DN;i++){dp[i*3]=(Math.random()-.5)*9;dp[i*3+1]=Math.random()*3;dp[i*3+2]=(Math.random()-.5)*9;dv[i*3]=(Math.random()-.5)*.05;dv[i*3+1]=(Math.random()-.5)*.03;dv[i*3+2]=(Math.random()-.5)*.05}
      const dg=new T.BufferGeometry();dg.setAttribute("position",new T.BufferAttribute(dp,3));const pts=new T.Points(dg,new T.PointsMaterial({color:0xFFE6BE,size:.022,transparent:true,opacity:.55,depthWrite:false}));pts.frustumCulled=false;S.add(pts);LB.dust={n:DN,p:dp,v:dv,g:dg,pts};
      /* кнопки библиотеки: лифт — всегда, ярусы — у лестницы; окно тома */
      if(!document.getElementById("mzLibCss")){const st=document.createElement("style");st.id="mzLibCss";st.textContent=`.hallwrap.mz-lib .mz-found{display:none!important}
.mz-libui{position:absolute;left:14px;top:calc(96px + var(--mz-top,0px));display:flex;flex-direction:column;align-items:flex-start;gap:6px;pointer-events:auto;z-index:3}
.mz-libui button{min-height:38px;padding:0 14px;border-radius:999px;border:1px solid rgba(255,255,255,.3);background:rgba(12,14,16,.82);color:#EEF1F3;font:500 13px/1 system-ui,sans-serif;cursor:pointer}
.mz-libui button[hidden]{display:none}.hallwrap .bb-book{z-index:40}`;document.head.appendChild(st)}
      if(window.Babel.css)window.Babel.css();
      {const kh=hud.querySelector("#mz-keys");if(kh)kh.insertAdjacentHTML("beforeend","<br>библиотека: E — открыть том · по лестнице — встаньте к ней лицом: W — вверх по ступеням, S — вниз · R / Z — ярус выше / ниже разом · L — лифт")}
      const ui=LB.ui=document.createElement("div");ui.className="mz-libui";ui.innerHTML=`<button type="button" data-lb="lift" aria-label="Лифт: выбрать этаж">лифт</button><button type="button" data-lb="up" hidden aria-label="Подняться на ярус выше">↑ ярус выше</button><button type="button" data-lb="down" hidden aria-label="Спуститься на ярус ниже">↓ ярус ниже</button>`;hud.appendChild(ui);
      ui.addEventListener("pointerdown",ev=>ev.stopPropagation());ui.addEventListener("click",ev=>{const b=ev.target.closest("[data-lb]");if(!b)return;const k=b.dataset.lb;if(k==="lift")liftOpen();else libStairs(k==="up"?1:-1);if(k!=="lift")try{canvas.focus({preventScroll:true})}catch(e){}});
      const d=LB.dlg=document.createElement("div");d.className="bb-book";d.hidden=true;d.setAttribute("role","dialog");d.setAttribute("aria-modal","true");d.setAttribute("aria-label","Том");
      d.innerHTML=`<div class="bb-page"><div class="bb-ph"><b data-t></b><small data-w></small></div><pre class="bb-pt" tabindex="0"></pre><div class="bb-pf"><button type="button" data-p="-1" aria-label="Предыдущая страница">‹</button><button type="button" data-p="1" aria-label="Следующая страница">›</button><label>стр. <input type="number" min="1" max="${G.PAGES}" aria-label="Номер страницы"></label><span>из ${G.PAGES}</span><span class="sp"></span><button type="button" data-x>Закрыть</button></div></div>`;wrap.appendChild(d);
      d.addEventListener("click",ev=>{if(ev.target===d||ev.target.closest("[data-x]")){libClose();return}const b=ev.target.closest("[data-p]");if(b)libPage(LB.book.p+ +b.dataset.p)});d.querySelector("input").addEventListener("change",ev=>libPage(+ev.target.value));
      d.addEventListener("keydown",ev=>{ev.stopPropagation();if(ev.key==="Escape"){ev.preventDefault();libClose()}else if(ev.target.tagName!=="INPUT"){if(ev.key==="ArrowRight")libPage(LB.book.p+1);else if(ev.key==="ArrowLeft")libPage(LB.book.p-1)}});
      stopFns.push(()=>{libSave();LB.cells.forEach(libDrop);LB.cells.clear();ui.remove();d.remove();S.remove(LB.lamp);S.remove(pts);dg.dispose();pts.material.dispose();Object.values(LBM).forEach(x=>x.dispose());Object.values(LBG).forEach(x=>x.dispose())})}
    const lbRay=LB?new T.Raycaster():null,lbV=new T.Vector2();
    function libPick(nx,ny){if(!LB||LB.climb)return null;lbV.set(nx,ny);lbRay.setFromCamera(lbV,cam);lbRay.far=C.d+3.4;const list=[];LB.cells.forEach(g=>{if(g.userData.L===LB.L)list.push(g.userData.bk)});const h=lbRay.intersectObjects(list,false)[0];
      if(!h||h.instanceId==null)return null;const G=LB.G,u=h.object.userData,id=h.instanceId,per=G.SHELVES*G.NB;lbC.setHex(0x6B2A22);if(h.object.instanceColor)lbC.fromBufferAttribute(h.object.instanceColor,id);return {q:u.q,r:u.r,L:u.L,w:u.walls[Math.floor(id/per)],s:Math.floor(id%per/G.NB),b:id%G.NB,color:lbC.getHex()}}
    const libPickC=()=>libPick(0,0)||libPick(.02,0)||libPick(-.02,0)||libPick(0,.04);
    function libOpen(o){if(!o)return false;LB.book=Object.assign({p:1},o);if(locked())document.exitPointerLock();pause();const d=LB.dlg;d.querySelector("[data-t]").textContent="«"+window.Babel.spine(o.q,o.r,o.L,o.w,o.s,o.b)+"»";d.querySelector("[data-w]").textContent="стена "+(o.w+1)+" · полка "+(o.s+1)+" · том "+(o.b+1);d.hidden=false;snd.cue("chat");libPage(1);d.querySelector("pre").focus();return true}
    function libPage(p){const b=LB.book;if(!b)return;b.p=Math.max(1,Math.min(LB.G.PAGES,Math.round(p)||1));const d=LB.dlg,pre=d.querySelector("pre");pre.textContent=window.Babel.pageText(b.q,b.r,b.L,b.w,b.s,b.b,b.p);pre.scrollTop=0;d.querySelector("input").value=b.p}
    function libClose(){LB.book=null;LB.dlg.hidden=true;try{canvas.focus({preventScroll:true})}catch(e){}}
    /* этап 22: по винтовой лестнице идут просто «вперёд» — фигура встаёт на ступени и поднимается (или спускается) по витку сама.
       Лицом к лестнице: «вперёд» — вверх, «назад» — вниз. */
    const LB_RR=.68;
    function libRailOut(up){const G=LB.G;let best=null;const sg=up?1:-1;
      for(let k=0;k<24&&!best;k++){const da=(k%2?-sg:sg)*(.3+Math.floor(k/2)*.22);for(const rr of [LB_RO+.36,LB_RO+.55]){const a=LB_A0+da,x=G.SX+Math.cos(a)*rr,z=G.SZ+Math.sin(a)*rr;if(libRamp(x,z)<0&&libValid(x,z)){best=[x,z];break}}}
      LB.rail=null;LB.railCool=true;P.y=0;V.x=V.z=V.vy=0;V.ground=true;if(best)LB.glide={x0:P.x,z0:P.z,x1:best[0],z1:best[1],t:0};libSave()}
    function libRail(dt,ix,iz,mm,spd,f){const G=LB.G;if(LB.climb||!LB.cells.size)return false;
      if(mm<.05)LB.railCool=false;
      if(LB.glide){const g_=LB.glide;g_.t+=dt/.32;const b=Math.min(1,g_.t),e=b*b*(3-2*b);P.x=g_.x0+(g_.x1-g_.x0)*e;P.z=g_.z0+(g_.z1-g_.z0)*e;P.y=0;V.x=V.z=V.vy=0;V.ground=true;if(b>=1)LB.glide=null;return true}
      let R_=LB.rail;
      if(!R_){if(LB.railCool||mm<.05||P.y>.3||GS.sit)return false;const dx=G.SX-P.x,dz=G.SZ-P.z,r=Math.hypot(dx,dz);if(r>LB_RO+.5||r<.05)return false;
        /* лицом к лестнице: «вперёд» — вверх, «назад» — вниз (вниз — только вплотную) */
        const look=(-Math.sin(C.yaw)*dx-Math.cos(C.yaw)*dz)/r;if(look<.3)return false;
        const up=f>.3,dn=f<-.3&&r<LB_RO+.3;if(!up&&!dn)return false;
        if(dn){LB.L-=1;piv.y+=G.H;P.y+=G.H;libWid();libSync()}
        const th0=up?.02:Math.PI*2-.02,a_=LB_A0+th0;
        R_=LB.rail={th:th0,s:up?1:-1,t:0,latch:true,ex:P.x,ez:P.z,ey:P.y,bt:Math.max(.25,Math.hypot(G.SX+Math.cos(a_)*LB_RR-P.x,G.SZ+Math.sin(a_)*LB_RR-P.z)/2.6)};target=null;snd.cue("chat")}
      R_.t+=dt;if(mm<.05)R_.latch=false;
      /* знак хода: пока клавишу не отпускали — как вошёл; дальше — по тому, куда жмут относительно ступеней */
      const a0=LB_A0+R_.th,tx=-Math.sin(a0),tz=Math.cos(a0);
      if(!R_.latch&&mm>.05){const pr=(ix*tx+iz*tz)/mm;if(pr>.45)R_.s=1;else if(pr<-.45)R_.s=-1}
      const b=Math.min(1,R_.t/R_.bt),e=b*b*(3-2*b);
      let dth=0;if(mm>.05&&b>=1)dth=R_.s*Math.min(1,mm)*spd*.5/LB_RR*dt;
      R_.th+=dth;
      if(R_.th>=Math.PI*2){LB.L+=1;piv.y-=G.H;P.y=0;libWid();libSync();const a_=LB_A0+.02;P.x=G.SX+Math.cos(a_)*LB_RR;P.z=G.SZ+Math.sin(a_)*LB_RR;libRailOut(true);return true}
      if(R_.th<=0){libRailOut(false);return true}
      const a=LB_A0+R_.th,k=Math.floor(R_.th/(Math.PI*2)*LB_NS),y=(k+.5)/LB_NS*G.H;
      const rx=G.SX+Math.cos(a)*LB_RR,rz=G.SZ+Math.sin(a)*LB_RR;
      P.x=R_.ex+(rx-R_.ex)*e;P.z=R_.ez+(rz-R_.ez)*e;const yy=R_.ey+(y-R_.ey)*e;P.y+=(yy-P.y)*(1-Math.exp(-dt*22));
      V.vy=0;V.ground=true;const vs=b<1?(mm>.05?WALK*.6:0)*R_.s:dth/Math.max(dt,1e-4)*LB_RR;V.x=-Math.sin(a)*vs;V.z=Math.cos(a)*vs;
      /* камера поворачивается вместе с витком; на входе — доворачивается по ходу */
      C.yaw-=dth;if(R_.t<R_.bt+.45&&mm>.05){const yw=Math.atan2(Math.sin(a)*R_.s,-Math.cos(a)*R_.s);C.yaw+=angDiff(C.yaw,yw)*(1-Math.exp(-dt*7))}
      return true}
    function libStairs(d){if(!LB||LB.climb||LB.rail||!LB.near)return;pause();target=null;LB.climb={d,t:0,x:P.x,z:P.z};snd.cue("chat")}
    function libStep(dt,now){const G=LB.G;if(!LB.cells.size)libSync();
      if(LB.climb){const c=LB.climb;c.t+=dt/(reduce?.35:1.5);const k=Math.min(1,c.t),e=k*k*(3-2*k);LB.oy=c.d*G.H*e;P.x=c.x;P.z=c.z;P.y=0;V.x=V.z=V.vy=0;V.ground=true;
        if(k>=1){LB.L+=c.d;LB.oy=0;LB.climb=null;if(!libStand(P.x,P.z,0,.22)){P.x=0;P.z=2.4}libWid();libSync();libSave()}else libPlace()}
      else{{const h=libRamp(P.x,P.z);let d=0;if(!LB.rail&&!LB.glide&&h>=0&&h<Infinity){if(P.y<.4&&h>G.H-.5)d=-1;else if(P.y>G.H-.5&&h<.6)d=1}
          if(d){LB.L+=d;P.y-=d*G.H;piv.y-=d*G.H;libWid();libSync();libSave()}}
        for(let i=0;i<6;i++){if(!G.isDoor(LB.q,LB.r,LB.L,i))continue;if(G.NX[i]*P.x+G.NZ[i]*P.z>G.A){const dx=G.NX[i]*2*G.A,dz=G.NZ[i]*2*G.A;LB.q+=G.DQ[i][0];LB.r+=G.DQ[i][1];P.x-=dx;P.z-=dz;piv.x-=dx;piv.z-=dz;if(target){target.x-=dx;target.z-=dz}libWid();libSync();libSave();break}}
        const ns=Math.hypot(P.x-G.SX,P.z-G.SZ)<1.9&&P.y<.3&&!LB.rail;{const sk=LB.q+","+LB.r+","+LB.L;if(sk!==LB.sk){LB.sk=sk;if(!LB.seen.has(sk)){LB.seen.add(sk);if(LB.seen.size>600)LB.seen.delete(LB.seen.values().next().value);try{localStorage.setItem("cv2_babel_seen",[...LB.seen].join(";"))}catch(e){}}mapDirty=true}}
        if(ns!==LB.near){LB.near=ns;LB.ui.querySelector('[data-lb="up"]').hidden=!ns;LB.ui.querySelector('[data-lb="down"]').hidden=!ns}
        if(now-(libStep.s||0)>4000){libStep.s=now;libSave()}}
      const t=now/1000;LB.lamp.position.set(P.x,2.15,P.z);LB.lamp.intensity=reduce?1:.98+Math.sin(t*7.3)*.03+Math.sin(t*17.1)*.02;
      const D=LB.dust,dp=D.p,dv=D.v;for(let i=0;i<D.n;i++){const j=i*3;dp[j]+=dv[j]*dt;dp[j+1]+=dv[j+1]*dt;dp[j+2]+=dv[j+2]*dt;if(dp[j]-P.x>4.5)dp[j]-=9;else if(dp[j]-P.x<-4.5)dp[j]+=9;if(dp[j+2]-P.z>4.5)dp[j+2]-=9;else if(dp[j+2]-P.z<-4.5)dp[j+2]+=9;if(dp[j+1]>3.1)dp[j+1]=.1;else if(dp[j+1]<.05)dp[j+1]=3}D.g.attributes.position.needsUpdate=true}
    function wLayout(){const sp=(Array.isArray(WORLD.spaces)?WORLD.spaces:[]).filter(s=>s&&s.id&&s.room&&s.room.w>0&&s.room.d>0);
      const k0=WF.air;WN[k0]="Этаж "+wLab(WF.floor)+" · "+WF.name;
      /* этап 13: порядок и стороны дверей — corrPlan (залы автора — после указанной комнаты, на заданной стороне) */
      const CP=corrPlan(sp,W_CW,W_LZ,W_WT),RS=CP.RS;W_LC=CP.LC;
      const pools=[{x:0,z:-2.5,r:2.6,w:1}];for(let z=-W_LZ-1.5;z>-W_LC+.8;z-=4)pools.push({x:0,z,r:2.1,w:1});
      HALLZ.push({k:k0,side:true,world:"c",wid:WID,floor:WF.floorTex,D:W_LC,z0:0,z1:-W_LC,x0:-W_LW,x1:W_LW,H:W_H,cz:-W_LC/2,cx:0,pools,name:WN[k0],short:"Лифт · этаж "+wLab(WF.floor),spawn:{x:0,z:-1.9,yaw:0}});
      WHI[WID]=0;
      /* полы лобби и коридора — настоящие меши (по ним ходят кликом); стены, потолок, рамы — в обстановке (PROPS.kit) */
      const flr=(w,d,cx,cz)=>{const g=new T.PlaneGeometry(w,d,Math.max(2,Math.ceil(w/.6)),Math.max(2,Math.ceil(d/.6))),uv=g.attributes.uv;for(let q=0;q<uv.count;q++)uv.setXY(q,uv.getX(q)*w/2.4,uv.getY(q)*d/2.4);
        const m=new T.Mesh(g,bmat({map:tex(WF.floorTex,"",[1,1])}));m.rotation.x=-Math.PI/2;m.position.set(cx,0,cz);S.add(m);floors.push(m);surf.push(m);return m};
      flr(W_LW*2,W_LZ,0,-W_LZ/2);flr(W_CW*2,W_LC-W_LZ,0,-(W_LZ+W_LC)/2);
      walk.push([-W_LW+.45,W_LW-.45,-W_LZ+.42,-.75]);walk.push([-W_CW+.4,W_CW-.4,-W_LC+.4,-W_LZ+.6]);
      RS.forEach(Q=>{const r=Q.r,w=+r.w,d=+r.d,h=+r.h||3.5,left=Q.side===0;
        Q.F={ox:left?-W_CW-W_WT:W_CW+W_WT,oz:Q.zc,rot:left?Math.PI/2:-Math.PI/2};
        const rc=rectW(Q.F,-w/2,0,w/2,-d),hi=HALLZ.length,k="vr"+Q.i,sp_=frameP(Q.F,0,-Math.min(3.4,d*.55));
        AIR[k]=AIR.vr;WAIR.push(k);SNDK[k]="vr";WN[k]=Q.s.title;Q.hi=hi;Q.k=k;Q.on=false;Q.gen=0;Q.meshes=[];Q.surf={};Q.objs=[];Q.plate={mesh:null,tex:null};wHall(Q);
        HALLZ.push({k,side:true,world:"r",wid:"s:"+Q.s.id,space:Q.s,Q,F:Q.F,floor:"vr",D:d,x0:rc[0],x1:rc[1],z0:rc[3],z1:rc[2],H:h,cz:(rc[2]+rc[3])/2,cx:(rc[0]+rc[1])/2,
          pools:[{x:(rc[0]+rc[1])/2,z:(rc[2]+rc[3])/2,r:Math.max(w,d)*.5,w:.35}],name:Q.s.title,short:Q.s.title,spawn:{x:sp_[0],z:sp_[1],yaw:Q.F.rot},hit:[rc[0]-W_WT,rc[1]+W_WT,rc[2]-W_WT,rc[3]+W_WT]});
        WHI["s:"+Q.s.id]=hi;if(WORLD.enter&&WORLD.enter===Q.s.id)W_START=hi;
        link(0,hi);const pc=frameP(Q.F,0,W_WT/2);PORT.push({a:0,b:hi,ax:"x",at:pc[0],c:pc[1],w:W_DW/2});
        walk.push([rc[0]+.4,rc[1]-.4,rc[2]+.4,rc[3]-.4]);walk.push(rectW(Q.F,-W_DW/2+.3,.62,W_DW/2-.3,-.55));
        const ln=rectW(Q.F,-W_DW/2,W_WT,W_DW/2,0);block(ln[0],ln[1],ln[2],ln[3],4.2,"ns",W_DH);
        Q.door=frameP(Q.F,0,W_WT+.4);wShell(Q);WR.push(Q)})}
    /* оболочка комнаты: куски стен (в южной — проём), пол, потолок; у каждой поверхности свой материал (цвет до загрузки, потом фотография) */
    function wShell(Q){const r=Q.r,w=+r.w,d=+r.d,h=+r.h||3.5,WD=WALLDEF(Q),walls=r.walls||{};
      const surfOf=k=>walls.mode==="each"&&walls[k]?walls[k]:walls.all||{img:"",fit:"tile",color:"#E9E4DA",tile:2};
      const grp=(key,def)=>{if(!Q.surf[key])Q.surf[key]={key,def,mat:bmat({color:new T.Color(def.color||"#DDDDDD")}),meshes:[],state:def.img?"wait":"none",tex:null};return Q.surf[key]};
      const mk=(G,geo,meta,px,py,pz,rx,ry)=>{const m=new T.Mesh(geo,G.mat);meta.uv0=Float32Array.from(geo.attributes.uv.array);m.userData.wm=meta;
        const p=wP(Q,px,pz);m.position.set(p[0],py,p[1]);m.rotation.set(rx,Q.F.rot+ry,0,"YXZ");m.visible=false;S.add(m);surf.push(m);Q.meshes.push(m);G.meshes.push(m);return m};
      ["n","e","s","w"].forEach(k=>{const W=WD[k],def=surfOf(k),G=grp(walls.mode==="each"&&walls[k]?k:"all",def),ry=Math.atan2(W.n[0],W.n[1]);
        const DW=Q.dw||W_DW,DH=Q.dh||W_DH,pcs=k==="s"?[[0,W.L/2-DW/2,0,h],[W.L/2+DW/2,W.L,0,h],[W.L/2-DW/2,W.L/2+DW/2,DH,h]]:[[0,W.L,0,h]];
        pcs.forEach(([a,b,y0,y1])=>{const l=b-a,hh=y1-y0;if(l<.01||hh<.01)return;const g=new T.PlaneGeometry(l,hh,Math.max(1,Math.ceil(l/.6)),Math.max(1,Math.ceil(hh/.6)));
          const m=(a+b)/2,cx=W.s0[0]+W.t[0]*m,cz=W.s0[1]+W.t[1]*m;const me=mk(G,g,{a,b,y0,y1,L:W.L,H:h},cx,(y0+y1)/2,cz,0,ry);camBlock.push(me)})});
      const fd=r.floor||{color:"#8B6F55"},cd=r.ceil||{color:"#F4F2EE"};
      const fg=new T.PlaneGeometry(w,d,Math.max(1,Math.ceil(w/.6)),Math.max(1,Math.ceil(d/.6)));const fm=mk(grp("floor",fd),fg,{a:0,b:w,y0:0,y1:d,L:w,H:d},0,0,0,-Math.PI/2,0);floors.push(fm);
      const cg=new T.PlaneGeometry(w,d,Math.max(1,Math.ceil(w/.8)),Math.max(1,Math.ceil(d/.8)));mk(grp("ceil",cd),cg,{a:0,b:w,y0:0,y1:d,L:w,H:d},0,h,0,Math.PI/2,0)}
    /* UV поверхности: «растянуть» — на всю поверхность; «обои» — повтор шириной tile метров, высота повтора по пропорции картинки */
    function wUV(m,fit,tw,th){const M=m.userData.wm,uv=m.geometry.attributes.uv,u0=M.uv0;
      for(let q=0;q<uv.count;q++){const al=M.a+u0[q*2]*(M.b-M.a),y=M.y0+u0[q*2+1]*(M.y1-M.y0);if(fit==="stretch")uv.setXY(q,al/M.L,y/M.H);else uv.setXY(q,al/tw,y/th)}uv.needsUpdate=true}
    function wLoadTex(url,max,cb){if(!url){cb(null);return}const im=new Image();im.crossOrigin="anonymous";
      im.onload=()=>{if(stopped)return;const iw=im.naturalWidth,ih=im.naturalHeight;if(!iw||!ih){cb(null);return}let t;
        if(Math.max(iw,ih)>max){const k=max/Math.max(iw,ih);t=new T.CanvasTexture(cnv(Math.max(1,Math.round(iw*k)),Math.max(1,Math.round(ih*k)),(g,w,h)=>g.drawImage(im,0,0,w,h)))}
        else{t=new T.Texture(im);t.needsUpdate=true}t.anisotropy=4;t.__px=[t.image.width,t.image.height];WTEX.add(t);cb(t,iw,ih)};
      im.onerror=()=>cb(null);im.src=url}
    const wDrop=t=>{if(t){t.dispose();WTEX.delete(t)}};
    function wLoadSurf(Q,G){if(!G.def.img){G.state="none";return}const url=WURL(G.def.img);if(!url){G.state="fail";return}const gen=Q.gen;G.state="loading";
      wLoadTex(url,(lite||coarse.matches)?1024:2048,(t,iw,ih)=>{if(Q.gen!==gen||!Q.on){wDrop(t);return}if(!t){G.state="fail";return}
        const fit=G.def.fit==="stretch"?"stretch":"tile",tw=Math.min(6,Math.max(.5,+G.def.tile||2)),th=tw*ih/iw;
        t.wrapS=t.wrapT=fit==="tile"?T.RepeatWrapping:T.ClampToEdgeWrapping;G.meshes.forEach(m=>wUV(m,fit,tw,th));
        G.tex=t;G.mat.map=t;G.mat.color.set(0xFFFFFF);G.mat.needsUpdate=true;G.state="ok";G.fit=fit;G.tile=[+tw.toFixed(3),+th.toFixed(3)]})}
    /* карточка-заглушка с названием предмета (нет картинки, грузится или не загрузилась) */
    function wCard(name){return cnv(320,240,(g,w,h)=>{g.fillStyle="#E9E4DA";g.fillRect(0,0,w,h);g.strokeStyle="#A39E95";g.lineWidth=3;g.strokeRect(12,12,w-24,h-24);
      g.fillStyle="#2B2A28";g.font="600 26px Golos Text, sans-serif";g.textAlign="center";g.textBaseline="middle";const ws=String(name).split(/\s+/),L=[];let c="";
      ws.forEach(x=>{const t=c?c+" "+x:x;if(g.measureText(t).width>w-60&&c){L.push(c);c=x}else c=t});if(c)L.push(c);L.length=Math.min(L.length,5);
      L.forEach((l,i)=>g.fillText(l.length>26?l.slice(0,25)+"…":l,w/2,h/2+(i-(L.length-1)/2)*32))})}
    const WG={ped:null,box:null,pl:null},WMT={};
    function wObjBuild(Q,Wo,kind){if(!WG.ped){WG.ped=new T.BoxGeometry(.6,1,.6);WG.box=new T.BoxGeometry(1,1,1);WG.pl=new T.PlaneGeometry(1,1);WMT.ped=mat(0xEDEAE4);WMT.frame=mat(0x2A2622)}
      if(Wo.grp){S.remove(Wo.grp);const i=clickable.indexOf(Wo.grp);if(i>=0)clickable.splice(i,1)}
      if(Wo.blk){Wo.blk[0]=Wo.blk[1]=Wo.blk[2]=Wo.blk[3]=1e6;Wo.blk=null}
      const g=new T.Group(),o=Wo.o;Wo.kind=kind;Wo.imat=Wo.imat||new T.MeshBasicMaterial({color:0xE6E1D8});Wo.pmat=Wo.pmat||new T.MeshBasicMaterial({color:0xF4F2EC});
      if(kind==="ped"){const b=new T.Mesh(WG.ped,WMT.ped);b.position.y=.5;g.add(b);const cg=new T.Group();cg.position.set(0,1.3,-.04);cg.rotation.x=-.3;g.add(cg);
        const fr=new T.Mesh(WG.box,WMT.frame);cg.add(fr);const im=new T.Mesh(WG.pl,Wo.imat);im.position.z=.017;cg.add(im);Wo.fr=fr;Wo.im=im;Wo.max=[.56,.42];
        const pq=new T.Mesh(WG.pl,Wo.pmat);pq.position.set(0,.84,.302);pq.rotation.x=-.25;pq.scale.set(.36,.14,1);g.add(pq);Wo.pq=pq}
      else{const fr=new T.Mesh(WG.box,WMT.frame);fr.position.z=.0175;g.add(fr);const im=new T.Mesh(WG.pl,Wo.imat);im.position.z=.037;g.add(im);Wo.fr=fr;Wo.im=im;
        const pq=new T.Mesh(WG.pl,Wo.pmat);pq.scale.set(.4,.155,1);g.add(pq);Wo.pq=pq;Wo.max=[.9,.7]}
      g.userData.sobj={s:Q.s,o,Q,Wo};g.userData.label=o.name;g.visible=Q.on;Wo.grp=g;S.add(g);clickable.push(g);wSize(Wo)}
    /* размер изображения: целиком в рамке места (пропорции картинки сохраняются) */
    function wSize(Wo){let pw=Wo.max[0],ph=Wo.max[1];const a=Wo.asp||(Wo.kind==="ped"?.56/.42:4/3);if(pw/ph>a)pw=ph*a;else ph=pw/a;
      Wo.im.scale.set(pw,ph,1);Wo.fr.scale.set(pw+.06,ph+.06,.035);if(Wo.kind!=="ped")Wo.pq.position.set(0,-ph/2-.17,.022);Wo.size=[+pw.toFixed(3),+ph.toFixed(3)]}
    function wObjOn(Q,Wo){const o=Wo.o;Wo.pt=new T.CanvasTexture(plaqueCanvas(o.name.length>46?o.name.slice(0,44)+"…":o.name,"",false));Wo.pmat.map=Wo.pt;Wo.pmat.color.set(0xFFFFFF);Wo.pmat.needsUpdate=true;WTEX.add(Wo.pt);
      Wo.ct=new T.CanvasTexture(wCard(o.name));WTEX.add(Wo.ct);Wo.imat.map=Wo.ct;Wo.imat.color.set(0xFFFFFF);Wo.imat.needsUpdate=true;
      const url=o.img?WURL(o.img):"";if(!url){Wo.state=o.img?"fail":"none";return}const gen=Q.gen;Wo.state="loading";
      wLoadTex(url,(lite||coarse.matches)?512:1024,(t,iw,ih)=>{if(Q.gen!==gen||!Q.on){wDrop(t);return}if(!t){Wo.state="fail";return}Wo.tex=t;Wo.asp=iw/ih;Wo.imat.map=t;Wo.imat.needsUpdate=true;Wo.state="ok";wSize(Wo)})}
    function wObjOff(Wo){[Wo.pt,Wo.ct,Wo.tex].forEach(wDrop);Wo.pt=Wo.ct=Wo.tex=null;if(Wo.imat){Wo.imat.map=null;Wo.imat.color.set(0xE6E1D8);Wo.imat.needsUpdate=true}if(Wo.pmat){Wo.pmat.map=null;Wo.pmat.color.set(0xF4F2EC);Wo.pmat.needsUpdate=true}Wo.state=Wo.o.img?"wait":"none"}
    /* автоматические места: картины — по стенам n, e, w, s (в южной — по обе стороны двери) слотами; если не хватает — уже и в два ряда;
       постаменты — сеткой внутри комнаты, не у двери и не вплотную друг к другу (между ними проходит фигура) */
    function wLayoutObjs(Q){const r=Q.r,w=+r.w,d=+r.d,h=+r.h||3.5,out=new Map(),taken={n:[],e:[],s:[],w:[]},peds=[];
      Q.s.objects.forEach(o=>{const p=o.place||{kind:"wall"};
        if(p.kind==="ped"&&isFinite(p.x)&&isFinite(p.z)&&Math.abs(p.x)<=w/2-.45&&Math.abs(p.z)<=d/2-.45){out.set(o.id,{kind:"ped",x:p.x,z:p.z,r:p.r||0,manual:true});peds.push([p.x,p.z])}
        else if(o._p&&p.wall){const L=p.wall==="n"||p.wall==="s"?w:d,f=hsFit({u:+p.u||0,y:+p.y||1.5,w:o._p.w,h:o._p.h},L,h,p.wall==="s"?[Q.dw||W_DW,Q.dh||W_DH,0]:null);out.set(o.id,{kind:"wall",wall:p.wall,u:f.u,y:f.y,maxW:f.w,maxH:f.h,manual:true});taken[p.wall].push(f.u)}
        else if(p.kind!=="ped"&&p.wall&&isFinite(p.u)){const L=p.wall==="n"||p.wall==="s"?w:d;const u=Math.max(-L/2+.45,Math.min(L/2-.45,p.u));out.set(o.id,{kind:"wall",wall:p.wall,u,y:isFinite(p.y)?Math.max(.6,Math.min(h-.5,p.y)):1.5,maxW:.9,maxH:.7,manual:true});taken[p.wall].push(u)}});
      const autoP=Q.s.objects.filter(o=>!out.has(o.id)&&o.place&&o.place.kind==="ped"),autoW=Q.s.objects.filter(o=>!out.has(o.id)&&!(o.place&&o.place.kind==="ped"));
      /* постаменты */
      let left=[];{let best=null;for(const [m,sp] of [[1.3,1.8],[1.1,1.6],[1.0,1.5]]){const C=[];const nx=Math.floor((w-2*m)/sp)+1,nz=Math.floor((d-2*m)/sp)+1;if(nx<1||nz<1)continue;
          const ox=-(nx-1)*sp/2,oz=-(nz-1)*sp/2;for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const x=ox+i*sp,z=oz+j*sp;if(z>d/2-2.1&&Math.abs(x)<1.35)continue;if(peds.some(q=>Math.hypot(q[0]-x,q[1]-z)<1.5))continue;C.push([x,z])}
          best=C;if(C.length>=autoP.length)break}
        best=best||[];autoP.forEach((o,i)=>{if(i<best.length)out.set(o.id,{kind:"ped",x:+best[i][0].toFixed(2),z:+best[i][1].toFixed(2),r:0,manual:false});else left.push(o)})}
      /* картины (и постаменты, которым не хватило места на полу) */
      const W2=autoW.concat(left);if(W2.length){const H2=h>=3.5?[1.2,2.3]:[1.05,2.05];let pick=null;
        for(const [sw,rows] of [[1.5,1],[1.2,1],[1.0,1],[1.2,2],[1.0,2],[.8,2]]){const S_=[];const seg=(k,a,b)=>{const n=Math.floor((b-a)/sw);const off=(b-a-n*sw)/2;for(let j=0;j<n;j++){const u=a+off+sw*(j+.5);if(!taken[k].some(t=>Math.abs(t-u)<sw*.9))S_.push([k,u])}};
          seg("n",-w/2+.35,w/2-.35);seg("e",-d/2+.35,d/2-.35);seg("w",-d/2+.35,d/2-.35);seg("s",-w/2+.35,-(Q.dw||W_DW)/2-.3);seg("s",(Q.dw||W_DW)/2+.3,w/2-.35);
          const slots=[];for(let rI=0;rI<rows;rI++)S_.forEach(q=>slots.push([q[0],q[1],rows===1?1.5:H2[rI]]));pick={slots,sw,rows};if(slots.length>=W2.length)break}
        W2.forEach((o,i)=>{const q=pick.slots[i%Math.max(1,pick.slots.length)]||["n",0,1.5];out.set(o.id,{kind:"wall",wall:q[0],u:+q[1].toFixed(2),y:q[2],maxW:Math.min(.95,pick.sw-.32),maxH:pick.rows===1?.75:.62,manual:false,overflow:left.includes(o)})})}
      return out}
    function wApply(Q,Wo,pl){if(!Wo.grp||Wo.kind!==pl.kind)wObjBuild(Q,Wo,pl.kind);Wo.pl=pl;const g=Wo.grp;g.userData.hb=null;
      if(pl.kind==="ped"){const p=wP(Q,pl.x,pl.z),th=-(pl.r||0)*Math.PI/180;g.position.set(p[0],0,p[1]);g.rotation.set(0,Q.F.rot+th,0);
        if(!Wo.blk){block(p[0]-.36,p[0]+.36,p[1]-.36,p[1]+.36,1.6,"ns");Wo.blk=blockers[blockers.length-1]}else{Wo.blk[0]=p[0]-.36;Wo.blk[1]=p[0]+.36;Wo.blk[2]=p[1]-.36;Wo.blk[3]=p[1]+.36}
        g.userData.hb={x:p[0],z:p[1],top:1.6,r:.6}}
      else{if(Wo.blk){Wo.blk[0]=Wo.blk[1]=Wo.blk[2]=Wo.blk[3]=1e6;Wo.blk=null}const W=WALLDEF(Q)[pl.wall]||WALLDEF(Q).n,al=W.L/2+pl.u,x=W.s0[0]+W.t[0]*al+W.n[0]*.012,z=W.s0[1]+W.t[1]*al+W.n[1]*.012,p=wP(Q,x,z);
        g.position.set(p[0],pl.y,p[1]);g.rotation.set(0,Q.F.rot+Math.atan2(W.n[0],W.n[1]),0);Wo.max=[pl.maxW||.9,pl.maxH||.7];wSize(Wo);const f=wP(Q,x+W.n[0]*.7,z+W.n[1]*.7);g.userData.hb={x:f[0],z:f[1],top:pl.y+.5,r:.6}}
      MPX++}
    function wPlaceAll(Q){const L=wLayoutObjs(Q);if(!Q.objs.length)Q.s.objects.forEach(o=>Q.objs.push({o}));Q.objs.forEach(Wo=>wApply(Q,Wo,L.get(Wo.o.id)))}
    function wActivate(Q){Q.on=true;Q.gen++;Q.meshes.forEach(m=>m.visible=true);Q.objs.forEach(Wo=>{Wo.grp.visible=true;wObjOn(Q,Wo)});Object.values(Q.surf).forEach(G=>wLoadSurf(Q,G))}
    function wDeact(Q){Q.on=false;Q.gen++;Q.meshes.forEach(m=>m.visible=false);Q.objs.forEach(Wo=>{Wo.grp.visible=false;wObjOff(Wo)});
      Object.values(Q.surf).forEach(G=>{wDrop(G.tex);G.tex=null;G.mat.map=null;G.mat.color.set(G.def.color||"#DDDDDD");G.mat.needsUpdate=true;G.state=G.def.img?"wait":"none"})}
    /* табличка у двери: название, автор; своё неодобренное — «на проверке» / «скрыто» (видит только автор) */
    function wPlate(Q){const s=Q.s,c=cnv(512,224,(g,w,h)=>{g.fillStyle="#F4F2EC";g.fillRect(0,0,w,h);g.fillStyle="#2B2A28";g.fillRect(0,0,10,h);
        g.textAlign="left";g.textBaseline="alphabetic";let fs=44;g.font=`600 ${fs}px Golos Text, sans-serif`;const t=String(s.title||"");while(fs>24&&g.measureText(t).width>w-50){fs-=2;g.font=`600 ${fs}px Golos Text, sans-serif`}
        g.fillText(t.length>40?t.slice(0,39)+"…":t,30,74);g.fillStyle="#5A5650";g.font="400 28px Golos Text, sans-serif";const sub=isHallRow(s)?(String(s.descr||"").split("\n")[0]||"зал автора сайта"):"автор: "+String(s.author||"посетитель");g.fillText(sub.length>34?sub.slice(0,33)+"…":sub,30,128);
        if(s.status&&s.status!=="approved"){g.fillStyle=s.status==="hidden"?"#6B6B6B":"#C8553D";g.fillRect(30,152,250,46);g.fillStyle="#FFFFFF";g.font="600 28px Golos Text, sans-serif";g.fillText(W_ST[s.status]||s.status,44,185)}});
      const t=new T.CanvasTexture(c);WTEX.add(t);if(!Q.plate.mesh){const left=Q.side===0,zc=Q.zc+W_DW/2+.55,m=new T.Mesh(new T.PlaneGeometry(.66,.29),new T.MeshBasicMaterial({map:t}));
        if(Q.pl){m.position.set(Q.pl.x,1.6,Q.pl.z);m.rotation.y=Q.pl.ry}else{m.position.set(left?-W_CW+.012:W_CW-.012,1.6,left?zc:zc);m.rotation.y=left?Math.PI/2:-Math.PI/2}S.add(m);Q.plate.mesh=m}else{Q.plate.mesh.material.map=t;Q.plate.mesh.material.needsUpdate=true}
      Q.plate.tex=t;Q.plate.mesh.visible=true}
    function wPlateOff(Q){wDrop(Q.plate.tex);Q.plate.tex=null;if(Q.plate.mesh){Q.plate.mesh.visible=false;Q.plate.mesh.material.map=null}}
    /* обстановка этажа (слито в несколько мешей): стены лобби и коридора с проёмами, потолок, рамы дверей, плафоны, лифт, табло этажа */
    function wDecor(){const K=PROPS.kit(WF.air),G=PROPS.G,wc=new T.Color(WF.wall).getHex(),cc=new T.Color(WF.ceil).getHex(),tg=[];
      const proxy=(x,y,z,sx,sy,sz)=>{const me=new T.Mesh(G.box,PROPS.M.plain);me.visible=false;me.scale.set(sx,sy,sz);me.position.set(x,y,z);me.updateMatrixWorld(true);camBlock.push(me);PROPS.propProxy.push(me)};
      const wall=(s0,t,n,len,H,holes)=>{const ry=Math.atan2(n[0],n[1]),hs=(holes||[]).slice().sort((p,q)=>p.a-q.a),pcs=[];let a=0;
        hs.forEach(hh=>{if(hh.a>a)pcs.push([a,hh.a,0,H]);pcs.push([hh.a,hh.b,hh.h,H]);a=Math.max(a,hh.b)});if(a<len)pcs.push([a,len,0,H]);
        pcs.forEach(([a,b,y0,y1])=>{const L=b-a,hh=y1-y0;if(L<.01||hh<.01)return;const g=new T.PlaneGeometry(L,hh,Math.max(1,Math.ceil(L/.8)),Math.max(1,Math.ceil(hh/.8)));tg.push(g);
          const m=(a+b)/2,cx=s0[0]+t[0]*m,cz=s0[1]+t[1]*m;K.geo(g,cx,(y0+y1)/2,cz,1,1,1,wc,{ry});proxy(cx-n[0]*.07,(y0+y1)/2,cz-n[1]*.07,Math.abs(t[0])*L+Math.abs(n[0])*.12,hh,Math.abs(t[1])*L+Math.abs(n[1])*.12);
          if(y0===0)K.box(cx+n[0]*.01,0,cz+n[1]*.01,Math.abs(t[0])*L+Math.abs(n[0])*.02,.09,Math.abs(t[1])*L+Math.abs(n[1])*.02,WF.trim)})};
      const hL=[],hR=[];WR.forEach(Q=>{const a=(-W_LZ-Q.zc)-W_DW/2;(Q.side===0?hL:hR).push({a,b:a+W_DW,h:W_DH})});
      wall([-W_LW,0],[1,0],[0,-1],W_LW*2,W_H,[]);wall([-W_LW,-W_LZ],[0,1],[1,0],W_LZ,W_H,[]);wall([W_LW,0],[0,-1],[-1,0],W_LZ,W_H,[]);
      wall([-W_LW,-W_LZ],[1,0],[0,1],W_LW-W_CW,W_H,[]);wall([W_CW,-W_LZ],[1,0],[0,1],W_LW-W_CW,W_H,[]);
      wall([-W_CW,-W_LZ],[0,-1],[1,0],W_LC-W_LZ,W_H,hL);wall([W_CW,-W_LZ],[0,-1],[-1,0],W_LC-W_LZ,W_H,hR);wall([-W_CW,-W_LC],[1,0],[0,1],W_CW*2,W_H,[]);
      [[0,-W_LZ/2,W_LW*2,W_LZ],[0,-(W_LZ+W_LC)/2,W_CW*2,W_LC-W_LZ]].forEach(([x,z,w,d])=>{const g=new T.PlaneGeometry(w,d,Math.max(1,Math.ceil(w/.8)),Math.max(1,Math.ceil(d/.8)));tg.push(g);K.geo(g,x,W_H,z,1,1,1,cc,{rx:Math.PI/2})});
      /* рамы дверей (насквозь через толщу стены — видны и из комнаты), коврики */
      WR.forEach(Q=>{const left=Q.side===0,xw=left?-W_CW-W_WT/2:W_CW+W_WT/2,dep=W_WT+.1,z=Q.zc;
        [-1,1].forEach(e=>K.box(xw,0,z+e*(W_DW/2+.04),dep,W_DH+.06,.08,WF.door));K.box(xw,W_DH,z,dep,.07,W_DW+.16,WF.door);
        K.box(left?-W_CW+.45:W_CW-.45,0,z,.6,.012,1.0,WF.trim,{x:1})});
      /* плафоны */
      HALLZ[0].pools.forEach(p=>{K.box(p.x,W_H-.05,p.z,.9,.04,.36,0xDADAD6);K.box(p.x,W_H-.07,p.z,.82,.012,.3,WF.lamp,{em:1.35})});
      tg.forEach(g=>{});stopFns.push(()=>tg.forEach(g=>g.dispose()));
      /* табло этажа на стене лобби и состояние пустого этажа */
      textPlane(textCanvas("Этаж "+wLab(WF.floor)+" · "+WF.name,WR.length?"Пространства посетителей: "+WR.length+". Двери — по обе стороны коридора.":"Пространства посетителей",{w:1024,h:300,ts:60,bs:30,pad:40,bg:"#FFFFFF",fg:"#16191D",fg2:"#5A626A"}),2.4,.7,-W_LW+.02,1.75,-2.6,Math.PI/2);
      if(!WR.length)textPlane(textCanvas("Здесь пока нет пространств.","Добавьте своё.",{w:1024,h:380,ts:64,bs:40,pad:48,bg:"#F4F2EC",fg:"#16191D",fg2:"#5A626A"}),2.2,.82,0,1.55,-W_LC+.02,0);
      liftAt(0,-.02,Math.PI,"Этаж "+wLab(WF.floor)+" · "+WF.name)}
    /* лифт: дверь в стене, табло, кнопка; E / «смотреть» — выбор этажа или музея книги */
    let LIFT=null;
    function liftAt(x,z,ry,label){const g=new T.Group(),st=mat(0xA9AEB3),dk=mat(0x3A3D41);g.position.set(x,0,z);g.rotation.y=ry;
      const fr=new T.Mesh(new T.BoxGeometry(1.9,2.42,.1),dk);fr.position.set(0,1.21,.02);g.add(fr);
      [-1,1].forEach(e=>{const d=new T.Mesh(new T.BoxGeometry(.78,2.16,.04),st);d.position.set(e*.4,1.1,.08);g.add(d)});
      const c=textCanvas("Лифт",label,{w:768,h:200,ts:56,bs:30,pad:28,bg:"#14171A",fg:"#F2F4F6",fg2:"#9FD3C8",font:"Golos Text, sans-serif"}),t=new T.CanvasTexture(c);
      const disp=new T.Mesh(new T.PlaneGeometry(1.3,.34),new T.MeshBasicMaterial({map:t}));disp.position.set(0,2.62,.08);g.add(disp);
      const bt=new T.Mesh(new T.BoxGeometry(.12,.2,.03),dk);bt.position.set(1.12,1.15,.06);g.add(bt);const bl=new T.Mesh(new T.CircleGeometry(.03,12),new T.MeshBasicMaterial({color:0x7FE3CC}));bl.position.set(1.12,1.15,.08);g.add(bl);
      S.add(g);g.updateMatrixWorld(true);const f=new T.Vector3(0,0,.9).applyMatrix4(g.matrixWorld);
      g.userData.lift=true;g.userData.label="Лифт: этажи посетителей и музей книги";g.userData.hb={x:f.x,z:f.z,top:2.4,r:.9};clickable.push(g);
      const a=new T.Vector3(-1,0,0).applyMatrix4(g.matrixWorld),b=new T.Vector3(1,0,.3).applyMatrix4(g.matrixWorld);block(Math.min(a.x,b.x),Math.max(a.x,b.x),Math.min(a.z,b.z),Math.max(a.z,b.z),2.7,"ns");
      stopFns.push(()=>{t.dispose()});LIFT={g,x,z};return g}
    function wPeers(hi){if(!opt.multi)return [];let L=[];try{L=opt.multi.others(WORLD?WID:"")||[]}catch(e){L=[]}
      if(WORLD)L=L.filter(p=>{const j=WHI[p.hall];return j!=null&&adj(j,hi)});return L}
    let PEERS=[];
    function stepWorld(hi,now){if(now-(stepWorld.t||0)<220)return;stepWorld.t=now;
      WR.forEach(Q=>{const dd=Math.hypot(P.x-Q.door[0],P.z-Q.door[1]),inR=hi===Q.hi,want=inR||(hi===0&&dd<11);
        if(want&&!Q.on)wActivate(Q);else if(!want&&Q.on&&dd>16)wDeact(Q);
        const pw=(hi===0&&dd<18)||inR;if(pw&&!Q.plate.tex)wPlate(Q);else if(!pw&&Q.plate.tex&&dd>24)wPlateOff(Q)})}
    function wOpenObj(g){const u=g.userData.sobj;if(u.o._p){openPhoto({src:WURL(u.o.img),caption:u.o.name});return}const f=WORLD?WORLD.onObj:opt.onSpaceObj;if(f)f(u.s,u.o,canvas)}
    /* ---- лифт: выбор этажа (четыре этажа посетителей и музей книги) ---- */
    let liftEl=null;
    function liftClose(){if(!liftEl)return;liftEl.remove();liftEl=null;try{canvas.focus({preventScroll:true})}catch(e){}}
    function liftOpen(){const go=WORLD?WORLD.onLift:(opt.lift&&opt.lift.go);if(!go||liftEl)return;if(locked())document.exitPointerLock();pause();
      const here=WORLD?WF.floor:"book",L=[["551","Этаж 551 · Верстак"],["43","Этаж 43 · Голоса"],["17","Этаж 17 · Квартиры"],["-1","Этаж −1 · Неотвеченное"],["book","Музей книги · десять залов"],["inf","Этаж ∞ · Библиотека"]];
      const el=document.createElement("div");el.className="mz-lift";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Лифт: куда поехать");
      el.innerHTML=`<div class="mz-liftb"><b>Лифт</b><span>Этажи посетителей и музей книги</span>${L.map(([k,t])=>`<button type="button" data-lift="${k}"${k===here?' aria-current="true"':""}>${t}${k===here?" · вы здесь":""}</button>`).join("")}<button type="button" class="mz-liftx" data-lift="">Остаться</button></div>`;
      el.addEventListener("click",ev=>{const b=ev.target.closest("[data-lift]");if(!b){if(ev.target===el)liftClose();return}const k=b.dataset.lift;if(!k||k===here){liftClose();return}
        CARRY={at:Date.now(),fs:FS&&FS.mode?1:0,view:C.want};snd.cue("chat");liftClose();
        /* этап 22: пока собирается следующий этаж, полноэкранный вид закрыт шторкой — страница под ним не мелькает */
        if(CARRY.fs){let cv=document.getElementById("mzCarry");if(!cv){cv=document.createElement("div");cv.id="mzCarry";cv.setAttribute("aria-hidden","true");cv.style.cssText="position:fixed;inset:0;z-index:2147483000;background:#0C0E10;color:#CFC6B4;display:grid;place-items:center;font:500 14px/1 system-ui,sans-serif;letter-spacing:.08em";cv.textContent="лифт · "+(b.textContent||"").trim().slice(0,48);document.body.appendChild(cv)}clearTimeout(window.__mzCarryT);window.__mzCarryT=setTimeout(()=>{const c=document.getElementById("mzCarry");if(c)c.remove()},9000)}try{go(k)}catch(e){}});
      el.addEventListener("keydown",ev=>{if(ev.key==="Escape"){ev.preventDefault();liftClose()}else if(ev.key==="Tab"){const f=[...el.querySelectorAll("button")],i=f.indexOf(document.activeElement);if(ev.shiftKey&&i<=0){ev.preventDefault();f[f.length-1].focus()}else if(!ev.shiftKey&&i===f.length-1){ev.preventDefault();f[0].focus()}}ev.stopPropagation()});
      el.addEventListener("keyup",ev=>ev.stopPropagation());wrap.appendChild(el);liftEl=el;const fb=el.querySelector("[data-lift]:not([aria-current])");if(fb)fb.focus({preventScroll:true})}
    stopFns.push(liftClose);
    /* ---- (а) предметы книги без постамента: новые, переехавшие в другой зал, «База Героев» — свободное место в зале; сохранённое место (pos) — важнее ---- */
    const BOOKPED={},BUILTIN={};/* этап 12: BUILTIN — предметы, которые показывает встроенный экспонат зала: id → код зала */
    function bookFree(hi){const h=HALLZ[hi];if(!h)return null;const side=!!h.side,x0=(side?h.x0:-HW)+1.1,x1=(side?h.x1:HW)-1.1,za=h.z1+(side?1.1:2.7),zb=h.z0-(side?1.1:2.7);
      const near=(x,z,rad)=>blockers.some(b=>b[0]<1e5&&!(b[5]>2.3)&&x>b[0]-rad&&x<b[1]+rad&&z>b[2]-rad&&z<b[3]+rad);
      const ok=(x,z)=>{if(!side&&Math.abs(x)<2.3)return false;if(BRQ.some(Q=>Q.br.i===hi&&Math.hypot(x-Q.door[0],z-Q.door[1])<2.4))return false;if(h.k==="kv"&&(x<-1.5||(x>1.5&&z<h.z0-11)))return false;
        if(h.k==="hb"&&((x<BASE.x0+2.6&&Math.abs(z-BASE.DZ)<2.4)||(x>BASE.x1-2.6&&Math.abs(z-BASE2.DZ)<2.4)))return false;
        if(h.k==="hb2"&&x<BASE2.x0+2.6&&Math.abs(z-BASE2.DZ)<2.4)return false;
        if(near(x,z,.95))return false;if(![[-.9,-.9],[.9,-.9],[-.9,.9],[.9,.9]].every(([a,b])=>inWalk(x+a,z+b)))return false;
        return [[1.05,0],[-1.05,0],[0,1.05],[0,-1.05]].some(([a,b])=>canStand(x+a,z+b))};
      const xs=[];if(side){for(let x=x0;x<=x1+1e-6;x+=.5)xs.push(+x.toFixed(2))}else{for(let a=2.5;a<=x1+1e-6;a+=.5)xs.push(+a.toFixed(2),-(+a.toFixed(2)))}
      for(let z=zb;z>=za-1e-6;z-=.5)for(const x of xs)if(ok(x,z))return {x,z:+z.toFixed(2)};return null}
    function pedMove(g,x,z,r){g.position.set(x,0,z);g.rotation.y=-(r||0)*Math.PI/180;const b=g.userData.blk;if(b){b[0]=x-.42;b[1]=x+.42;b[2]=z-.42;b[3]=z+.42}if(g.userData.ct)g.userData.ct.position.set(x,.012,z);g.userData.hb=null;MPX++;g.userData.r=r||0}
    function bookLate(){if(opt.lift)liftAt(-5,-.02,Math.PI,"Этажи посетителей");
      const H_K=Object.fromEntries(HALLZ.map((h,i)=>[h.k,i]));const has=id=>clickable.some(c=>c.userData.id===id);
      opt.objs.forEach(o=>{let p=o.pos;if(!p||p.h!==o.h||!isFinite(+p.x)||!isFinite(+p.z))return;
        /* этап 11: место, сохранённое до переноса «Базы» (прежние координаты арены), — переводим в новые */
        if((o.h==="hb"||o.h==="hb2")&&+p.z<=BASE_L.z0+.5&&+p.z>=BASE_L.z1-.5&&+p.x>BASE_L.xm)p=Object.assign({},p,{z:+p.z+BZ});const hi=H_K[o.h];if(hi==null||hallAt(+p.z,+p.x)!==hi)return;
        let g=BOOKPED[o.id];if(!g){if(BUILTIN[o.id]===o.h||(has(o.id)&&!o._fresh&&!BUILTIN[o.id]))return;g=pedestal(o,+p.x,+p.z)}pedMove(g,+p.x,+p.z,+p.r||0);g.userData.manual=true});
      /* этап 12: встроенный экспонат (открытки на столе, часы, тетрадь) не мешает предмету, переехавшему в другой зал, получить постамент */
      opt.objs.forEach(o=>{if(BOOKPED[o.id]||BUILTIN[o.id]===o.h||(has(o.id)&&!o._fresh&&!BUILTIN[o.id])||!(o._fresh||o.h==="hb"||o.h==="hb2"))return;const hi=H_K[o.h];if(hi==null)return;const s=bookFree(hi);if(!s){LATE.miss.push(o.id);return}
        const g=pedestal(o,s.x,s.z);g.userData.auto={x:s.x,z:s.z,r:0};g.userData.late=true;LATE.placed.push(o.id)})}
    const LATE={placed:[],miss:[]};
    /* ---- расстановка в 3D: «изменить расстановку» — владелец пространства в своей комнате, автор сайта в залах книги ---- */
    const ARR={can:false,open:false,hi:-1,sel:null,el:null,btn:null,busy:false};
    const arrOk=hi=>{const h=HALLZ[hi];if(!h)return false;if(h.Q)return !!h.Q.s.canEdit&&!!WSAVE;if(WORLD)return false;return ARR.can&&!!opt.placeBook&&(hi<NH||hi===IB||hi===IB2)};
    function arrItems(hi){const h=HALLZ[hi];if(h.Q){const Q=h.Q;return Q.objs.filter(Wo=>!Wo.o._p).map(Wo=>({id:Wo.o.id,name:Wo.o.name,kind:Wo.o.place&&Wo.o.place.kind==="ped"?"ped":"wall",manual:!!(Wo.pl&&Wo.pl.manual),Wo}))}
      return (byHall[h.k]||[]).map(o=>{const g=BOOKPED[o.id];return {id:o.id,name:o.name,kind:"ped",manual:!!(g&&g.userData.manual),shown:!!g,builtin:BUILTIN[o.id]===h.k,miss:LATE.miss.indexOf(o.id)>=0,o}})}
    function arrDraw(msg){if(!ARR.el)return;const it=arrItems(ARR.hi),sel=it.find(x=>x.id===ARR.sel);
      ARR.el.querySelector(".mz-arrt").textContent="Изменить расстановку · "+TN(HALLZ[ARR.hi].k);
      ARR.el.querySelector(".mz-arrl").innerHTML=it.length?it.map(x=>`<button type="button" data-id="${x.id}" aria-pressed="${x.id===ARR.sel}">${String(x.name).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}<small>${x.builtin?"встроенный экспонат зала — стоит на своём месте":(x.kind==="ped"?"на постаменте":"на стене")+" · "+(x.manual?"место выбрано":x.Wo?"автоматически":x.shown?"автоматически":x.miss?"не выставлен: в зале нет свободного места — поставьте вручную":"не выставлен")}</small></button>`).join(""):`<p>Предметов нет.</p>`;
      ARR.el.querySelectorAll("[data-a]").forEach(b=>{const a=b.dataset.a;b.disabled=ARR.busy||!sel||!!sel.builtin||(a==="rot"&&sel.kind!=="ped")||(a==="rot"&&!sel.Wo&&!sel.shown)||(a==="auto"&&!sel.manual)});
      if(msg!=null)ARR.el.querySelector(".mz-arrs").textContent=msg;
      ARR.el.querySelectorAll(".mz-arrl [data-id]").forEach(b=>b.onclick=()=>{ARR.sel=b.dataset.id;arrDraw("");try{canvas.focus({preventScroll:true})}catch(e){}})}
    function arrOpen(v){ARR.open=v;if(ARR.btn)ARR.btn.setAttribute("aria-expanded",String(v));if(!v){if(ARR.el){ARR.el.remove();ARR.el=null}return}
      ARR.hi=lastHall;if(!ARR.el){const el=document.createElement("div");el.className="mz-arrp";el.setAttribute("role","group");el.setAttribute("aria-label","Изменить расстановку");
        el.innerHTML=`<div class="mz-arrh"><b class="mz-arrt"></b><button type="button" class="mz-arrx" aria-label="Закрыть расстановку">✕</button></div><p class="mz-arrhint">${HALLZ[lastHall]&&HALLZ[lastHall].Q?"Выберите предмет, подойдите к месту и нажмите «поставить здесь»: картина встанет на ближайшую стену на высоте глаз, постамент — на шаг впереди вас.":"Выберите предмет, подойдите к месту и нажмите «поставить здесь»: постамент встанет на шаг впереди вас, лицом к вам."}</p>
          <div class="mz-arrl"></div><div class="mz-arra"><button type="button" data-a="here">поставить здесь</button><button type="button" data-a="rot">повернуть</button><button type="button" data-a="auto">вернуть на автоматическое место</button></div>${!WORLD&&opt.hallEdit?'<div class="mz-arra"><button type="button" data-hs>оформление залов</button></div>':""}<p class="mz-arrs" role="status" aria-live="polite"></p>`;
        el.querySelector(".mz-arrx").onclick=()=>arrOpen(false);{const hb_=el.querySelector("[data-hs]");if(hb_)hb_.onclick=()=>{if(locked())document.exitPointerLock();pause();const h_=HALLZ[ARR.hi],st_=el.querySelector(".mz-arrs");/* этап 14: индикатор и ошибка загрузки редактора */Promise.resolve(opt.hallEdit.open(h_.Q?"a:"+h_.Q.s.id:h_.k,hb_,(t,e)=>{if(st_){st_.textContent=t||"";st_.classList.toggle("err",!!e)}})).catch(()=>{})}}el.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>arrAct(b.dataset.a));
        el.addEventListener("pointerdown",ev=>ev.stopPropagation());hud.appendChild(el);ARR.el=el}
      if(HALLZ[ARR.hi].Q){const s=HALLZ[ARR.hi].space;arrDraw(isHallRow(s)?"Зал автора сайта: изменения видны всем сразу.":"Статус пространства: "+(W_ST[s.status]||s.status)+". После изменений его снова проверяет автор сайта.")}else arrDraw("")}
    function arrSync(hi){if(!ARR.btn)return;const ok=arrOk(hi);ARR.btn.hidden=!ok;if(ARR.open&&(!ok||hi!==ARR.hi)){if(ok){ARR.hi=hi;ARR.sel=null;arrDraw("")}else arrOpen(false)}}
    async function arrAct(a){if(ARR.busy)return;const hi=ARR.hi,it=arrItems(hi).find(x=>x.id===ARR.sel);if(!it)return;const say=t=>arrDraw(t);
      const fx=-Math.sin(P.yaw),fz=-Math.cos(P.yaw);
      if(HALLZ[hi].Q){const Q=HALLZ[hi].Q,Wo=it.Wo,o=Wo.o,r=Q.r,w=+r.w,d=+r.d;let place;
        if(a==="auto")place={kind:it.kind};
        else if(a==="rot"){const p=o.place||{};if(!isFinite(p.x)){const c=Wo.pl;place={kind:"ped",x:c.x,z:c.z,r:((c.r||0)+90)%360}}else place={kind:"ped",x:p.x,z:p.z,r:((p.r||0)+90)%360}}
        else{const [lx,lz]=wLocal(Q,P.x,P.z);if(Math.abs(lx)>w/2+.05||Math.abs(lz)>d/2+.05){say("Сначала войдите в комнату.");return}
          if(it.kind==="wall"){const dist={n:lz+d/2,s:d/2-lz,e:w/2-lx,w:lx+w/2};const k=Object.keys(dist).sort((p,q)=>dist[p]-dist[q])[0],L=k==="n"||k==="s"?w:d;
            let u=k==="n"?lx:k==="e"?lz:k==="s"?-lx:-lz;u=Math.max(-L/2+.5,Math.min(L/2-.5,u));const DW_=Q.dw||W_DW;if(k==="s"&&Math.abs(u)<DW_/2+.55)u=(u<0?-1:1)*(DW_/2+.55);place={kind:"wall",wall:k,u:+u.toFixed(2),y:1.5}}
          else{const c=Math.round(Math.cos(Q.F.rot)),s_=Math.round(Math.sin(Q.F.rot)),lf=[fx*c-fz*s_,fx*s_+fz*c];
            const cl=(v,m)=>Math.max(-m,Math.min(m,v)),snap=v=>Math.round(v*2)/2;let x=cl(snap(lx+lf[0]*1.1),w/2-.8),z=cl(snap(lz+lf[1]*1.1),d/2-.8);
            const bad=(x,z)=>(z>d/2-1.9&&Math.abs(x)<1.25)||Q.objs.some(W2=>W2!==Wo&&W2.pl&&W2.pl.kind==="ped"&&Math.hypot(W2.pl.x-x,W2.pl.z-z)<1.4);
            if(bad(x,z)){let f=null;for(let rr=.5;rr<4&&!f;rr+=.5)for(let k=0;k<16&&!f;k++){const nx=cl(snap(x+Math.cos(k/16*Math.PI*2)*rr),w/2-.8),nz=cl(snap(z+Math.sin(k/16*Math.PI*2)*rr),d/2-.8);if(!bad(nx,nz))f=[nx,nz]}
              if(!f){say("Здесь не поместится: рядом дверь или другие постаменты.");return}x=f[0];z=f[1]}
            const th=Math.atan2(lx-x,lz-z);place={kind:"ped",x,z,r:((Math.round(-th*180/Math.PI/15)*15)%360+360)%360}}}
        ARR.busy=true;say("Сохраняем…");try{const res=await WSAVE(Q.s,o,place);if(stopped)return;o.place=res&&res.obj&&res.obj.place||place;if(res&&res.status)Q.s.status=res.status;
          const L=wLayoutObjs(Q);Q.objs.forEach(W2=>wApply(Q,W2,L.get(W2.o.id)));if(Q.on)Q.objs.forEach(W2=>{W2.grp.visible=true;if(!W2.pt)wObjOn(Q,W2)});if(Q.plate.tex){wPlateOff(Q)}
          ARR.busy=false;say(isHallRow(Q.s)?"Сохранено.":"Сохранено. Статус пространства: "+(W_ST[Q.s.status]||Q.s.status||"—")+".")}
        catch(e){ARR.busy=false;say((WMSG&&WMSG(e))||"Не получилось сохранить.")}return}
      /* залы книги: место — в координатах музея (obj_edits.data.pos) */
      const h=HALLZ[hi],o=it.o;let g=BOOKPED[o.id],pos=null;
      if(a==="auto")pos=null;
      else if(a==="rot"){if(!g)return;pos={h:h.k,x:+g.position.x.toFixed(2),z:+g.position.z.toFixed(2),r:((g.userData.r||0)+90)%360}}
      else{const x=Math.round((P.x+fx*1.2)*4)/4,z=Math.round((P.z+fz*1.2)*4)/4;const own=g&&g.userData.blk;
        if(hallAt(z,x)!==hi||![[-.45,-.45],[.45,-.45],[-.45,.45],[.45,.45]].every(([p,q])=>inWalk(x+p,z+q))||blockers.some(b=>b!==own&&b[0]<1e5&&!(b[5]>2.3)&&x>b[0]-.5&&x<b[1]+.5&&z>b[2]-.5&&z<b[3]+.5)){say("Здесь не поместится: отойдите от стен и других предметов.");return}
        const th=Math.atan2(P.x-x,P.z-z);pos={h:h.k,x,z,r:((Math.round(-th*180/Math.PI/15)*15)%360+360)%360}}
      ARR.busy=true;say("Сохраняем…");try{await opt.placeBook.save(o.id,pos);if(stopped)return;
        if(pos){if(!g){g=pedestal(o,pos.x,pos.z);updSeen()}pedMove(g,pos.x,pos.z,pos.r);g.userData.manual=true}
        else if(g){g.userData.manual=false;const au=g.userData.auto;if(au)pedMove(g,au.x,au.z,au.r||0)}
        ARR.busy=false;say(pos?"Сохранено: место предмета в зале.":"Место сброшено: предмет стоит на автоматическом месте"+(g&&!g.userData.auto?" (после перезагрузки — если оно у него есть)":"")+".")}
      catch(e){ARR.busy=false;say((opt.placeBook.msg&&opt.placeBook.msg(e))||"Не получилось сохранить.")}}
    function arrInit(){const ctl=hud.querySelector(".mz-ctl");if(!ctl)return;const b=document.createElement("button");b.type="button";b.className="mz-arr";b.hidden=true;b.setAttribute("aria-expanded","false");b.setAttribute("aria-label","Изменить расстановку предметов");
      b.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 13h12M4 13V8h3v5M9 13V4h3v9" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><span>расстановка</span>';ctl.insertBefore(b,ctl.querySelector(".mz-help"));ARR.btn=b;
      on(b,"click",()=>arrOpen(!ARR.open));stopFns.push(()=>{arrOpen(false);b.remove()});
      if(!WORLD&&opt.placeBook&&opt.placeBook.can)Promise.resolve(opt.placeBook.can()).then(v=>{if(stopped)return;ARR.can=!!v;arrSync(lastHall)}).catch(()=>{})}
    /* карта мира: сверху — окрестность (коридор вправо), снизу — весь коридор с дверями; нажатие на дверь — к двери */
    function drawMapW(){const W=mapC.clientWidth||232,dpr=Math.min(2,window.devicePixelRatio||1),g=mg;if(!W)return;
      if(mapC.width!==Math.round(W*dpr)||mapC.height!==Math.round(MTOT*dpr)){mapC.width=Math.round(W*dpr);mapC.height=Math.round(MTOT*dpr)}
      g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,MTOT);const ox=W*.42,mx=zz=>ox+(P.z-zz)*MSC,my=x=>MLH/2+(x-P.x)*MSC;
      g.save();g.beginPath();g.rect(0,0,W,MLH);g.clip();
      const rr=(x0,x1,z0,z1,cur,i)=>{const a=mx(z1),b=mx(z0),ya=my(x0),yb=my(x1);g.fillStyle=cur?"rgba(224,58,30,.26)":MAPC[i];g.fillRect(Math.min(a,b),ya,Math.abs(b-a),yb-ya);g.strokeStyle=cur?"#E03A1E":"rgba(255,255,255,.4)";g.lineWidth=cur?1.6:1;g.strokeRect(Math.min(a,b)+.5,ya+.5,Math.abs(b-a)-1,yb-ya-1)};
      rr(-W_LW,W_LW,0,-W_LZ,lastHall===0,0);rr(-W_CW,W_CW,-W_LZ,-W_LC,lastHall===0,0);WR.forEach(Q=>{const h=HALLZ[Q.hi];rr(h.x0,h.x1,h.z0,h.z1,lastHall===Q.hi,Q.hi)});
      WR.forEach(Q=>Q.objs.forEach(Wo=>{if(!Wo.grp)return;const b=Wo.grp.userData.hb||{x:Wo.grp.position.x,z:Wo.grp.position.z};const x=mx(b.z),y=my(b.x);if(x<-3||x>W+3)return;g.fillStyle=Wo.grp===nearObj?"#E03A1E":"rgba(255,255,255,.6)";g.fillRect(x-1.6,y-1.6,3.2,3.2)}));
      if(LIFT){g.fillStyle="#7FE3CC";g.fillRect(mx(LIFT.z)-2,my(LIFT.x)-4,4,8)}
      PEERS.forEach(p=>{const x=mx(p.z),y=my(p.x);g.fillStyle=p.color||"#8AB";g.beginPath();g.arc(x,y,3,0,7);g.fill()});
      {const x=mx(P.z),y=my(P.x),c=Math.cos(P.yaw),sn=-Math.sin(P.yaw),px=-sn,py=c;g.fillStyle="#FFFFFF";g.strokeStyle="#0E1013";g.lineWidth=1.2;g.beginPath();g.moveTo(x+c*6.5,y+sn*6.5);g.lineTo(x-c*4+px*4,y-sn*4+py*4);g.lineTo(x-c*2,y-sn*2);g.lineTo(x-c*4-px*4,y-sn*4-py*4);g.closePath();g.fill();g.stroke()}
      g.restore();
      /* весь коридор: полоса, двери слева (сверху) и справа (снизу) с номерами */
      const y0=MLH+MGAP,H2=MTOT-y0,cy=y0+H2/2,sx=(W-14)/W_LC,X=z=>7+(-z)*sx;MP_.wdoors=[];
      g.fillStyle=lastHall===0?"rgba(224,58,30,.35)":"rgba(255,255,255,.18)";g.fillRect(X(0),cy-6,X(-W_LC)-X(0),12);g.fillStyle="#7FE3CC";g.fillRect(X(0),cy-9,4,18);
      g.font="600 9px ui-monospace, monospace";g.textAlign="center";g.textBaseline="middle";
      WR.forEach((Q,i)=>{const x=X(Q.zc),up=Q.side===0,cur=lastHall===Q.hi,bw=Math.max(8,Math.min(26,+Q.r.w*sx)),by=up?cy-6-24:cy+6+2;g.fillStyle=cur?"#E03A1E":Q.s.status!=="approved"?"rgba(200,85,61,.55)":MAPC[Q.hi];g.fillRect(x-bw/2,by,bw,22);
        g.fillStyle="#FFFFFF";g.fillText(String(i+1),x,by+11);MP_.wdoors.push([x-bw/2,by,bw,22,i])});
      PEERS.forEach(p=>{g.fillStyle=p.color||"#8AB";g.beginPath();g.arc(X(p.z),cy,2.2,0,7);g.fill()});
      g.fillStyle="#FFFFFF";g.strokeStyle="#0E1013";g.beginPath();g.arc(X(Math.min(0,P.z)),lastHall===0?cy:cy+(HALLZ[lastHall]&&HALLZ[lastHall].Q&&HALLZ[lastHall].Q.side===0?-17:17),2.8,0,7);g.fill();g.stroke();
      mapDirty=false}
    function mapClickW(ev){const rc=mapC.getBoundingClientRect();if(!rc.width)return;const x=(ev.clientX-rc.left)*(mapC.clientWidth/rc.width),y=(ev.clientY-rc.top)*(MTOT/rc.height);
      if(y<MLH+MGAP)return;const q=(MP_.wdoors||[]).find(q=>x>=q[0]-3&&x<=q[0]+q[2]+3&&y>=q[1]-3&&y<=q[1]+q[3]+3);
      if(q){const Q=WR[q[4]],left=Q.side===0;P.x=left?-W_CW+.75:W_CW-.75;P.z=Q.zc;P.yaw=left?Math.PI/2:-Math.PI/2;P.y=0;C.yaw=P.yaw;C.pitch=clampPitch(-.15);V.x=V.z=V.vy=0;V.ground=true;target=null;piv.set(P.x,1.55,P.z);try{canvas.focus({preventScroll:true})}catch(e){}return}
      if(x<30)goHall(0)}
    function wBar(){return HALLZ.map((h,i)=>`<button type="button" data-h="${i}"${i?` class="mz-branch" title="${String(h.name).replace(/"/g,"&quot;")}"`:""}>${i?"↳ ":""}${String(h.short).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}</button>`).join("")}
    if(LB)libLayout();else if(WORLD)wLayout();else bLayout();
    const hallAt=(zz,xx)=>{if(WORLD){if(xx!=null)for(let i=1;i<HALLZ.length;i++){const q=HALLZ[i].hit;if(xx>=q[0]&&xx<=q[1]&&zz>=q[2]&&zz<=q[3])return i}return 0}if(xx!=null){for(let q=0;q<BRQ.length;q++){const b=HALLZ[BRQ[q].hi].hit;if(xx>=b[0]&&xx<=b[1]&&zz>=b[2]&&zz<=b[3])return BRQ[q].hi}if(xx>BASE.xm)return xx>BASE2.xm?IB2:IB;if(xx<CORR.xm){for(let i=IC+1;i<HALLZ.length;i++){const q=HALLZ[i].hit;if(xx>=q[0]&&xx<=q[1]&&zz>=q[2]&&zz<=q[3])return i}return IC}}
      for(let i=0;i<NH;i++)if(zz<=HALLZ[i].z0+.1&&zz>=HALLZ[i].z1-.1)return i;return zz>0?0:NH-1};
    /* соседство пространств: по анфиладе — через один проём; «База» и коридор — только с «Квартирами»; комнаты — с коридором и друг с другом по дверям */
    const adj=(a,b)=>a===b||(BOOK&&a<NH&&b<NH&&Math.abs(a-b)===1)||LINKS.has(a+"-"+b);
    const HN=k=>WN[k]||(opt.halls&&opt.halls[k])||(k==="hb"?BASE.name:k===BASE2.k?BASE2.name:"")||BRANCH_NAME(k);
    /* этап 10: название пространства для заголовка и строки «где я»: арены «Базы» — «База Героев · А / Б» (чат «А» остаётся под прежним именем) */
    const TN=k=>BASE_T[k]?BASE_T[k][0]:HN(k);
    /* этап 10: что видно из пространства hi: соседнее (adj); комнаты квартиры — из коридора и из любой комнаты той же квартиры; коридор — из любой комнаты квартир */
    const flatOf=i=>HALLZ[i]&&HALLZ[i].flat?HALLZ[i].flat.id:null;
    const seen=(a,hi)=>adj(a,hi)||(HALLZ[a].branch==="r"&&(hi===IC||flatOf(a)===flatOf(hi)))||(a===IC&&HALLZ[hi].branch==="r");
    const HK=k=>HALLZ.find(h=>h.k===k);
    /* особые источники: святилище — одно пятно; двойники — свечение экранов; отец — вечерний свет из окна; N — красный фонарь и лайтбокс; красота — свет по оси */
    BOOK&&(function(){let h=HK("sv");h.pools.push({x:0,z:h.cz,r:2.2,w:1.3});
      h=HK("dv");[[-HW+.6,h.z0-5],[HW-.6,h.z0-5],[-HW+.6,h.z0-12]].forEach(([x,zz])=>h.pools.push({x,z:zz,r:2.8,w:1}));h.pools.push({x:4.4,z:h.z1+.8,r:2.2,w:.6,c:[.25,.32,.5],lc:0x8FB4FF});
      h=HK("ot");h.pools.push({x:4.6,z:h.z1+1.2,r:3.8,w:1.25},{x:0,z:h.z0-6,r:1.7,w:.7});
      h=HK("n");h.pools.push({x:0,z:h.cz,r:4.2,w:1},{x:HW-.6,z:h.cz,r:2.3,w:1,c:[.42,.4,.36],lc:0xEDE8DC});
      box(.46,.14,.26,new T.MeshBasicMaterial({color:0xFF2A12}),0,h.H-.55,h.cz);cyl(.006,.006,.48,mat(0x111111),0,h.H-.24,h.cz,6);
      h=HK("kr");for(let q=0;q<13;q++)h.pools.push(q<7?{x:0,z:h.z0-2.5-q*5,r:4.2,w:1}:{x:0,z:h.z0-2.5-q*5,r:4.6,w:1.1,c:[.2,.24,.3],lc:0xEEF6FF});
      /* «База»: сетка потолочных светильников и холодно-синее пятно светодиодов в комнате праздников */
      h=HK("hb");[[10.4,-5],[10.4,-13],[15,-5],[15,-12.5],[19.6,-5],[19.6,-12.5],[24.6,-4.2],[25.4,-12.8]].forEach(([x,zz])=>h.pools.push({x,z:zz,r:3.4,w:1}));
      h.pools.push({x:25.6,z:-12.8,r:2.6,w:.7,c:[.12,.24,.5],lc:0x7FB4FF});
      /* этап 10: «База Б» — три ряда линейных ламп, фиолетовое свечение светодиодов у пола вдоль стен, синие отсветы росписи */
      h=HK("hb2");[-4.4,-8,-11.6].forEach(zz=>[31.4,36.2,41,45.6].forEach(x=>h.pools.push({x,z:zz,r:3.1,w:.85})));
      [[32,-1.8],[38,-1.8],[44,-1.8],[32,-14.2],[38,-14.2],[44,-14.2],[47.3,-5],[47.3,-11]].forEach(([x,zz])=>h.pools.push({x,z:zz,r:1.7,w:.55,c:[.36,.1,.56],lc:0xB27CFF}));
      [[36,-2.6],[44,-12.8]].forEach(([x,zz])=>h.pools.push({x,z:zz,r:3,w:.3,c:[.08,.16,.42],lc:0x6F96FF}));
      /* этап 11: пятна арен заданы в прежней системе координат — сдвиг на BZ */
      [HK("hb"),HK("hb2")].forEach(hh=>hh.pools.forEach(p=>{p.z+=BZ}));
      HALLZ.forEach(hh=>{if(!hh.pools.length)hh.pools.push({x:0,z:hh.cz,r:4,w:.8})})})();
    const ss=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
    /* свет в точке поверхности: база зала + пятна от источников; пол темнеет к стенам, стены — к полу (или, в «Отце», к потолку) */
    function lightAt(h,x,y,zz,kind,o){const A=AIR[h.k];let lo=A.lo;if(A.lo2){const t=ss(.42,.6,(h.z0-zz)/h.D);lo=[0,1,2].map(c=>A.lo[c]+(A.lo2[c]-A.lo[c])*t)}
      let a0=0,a1=0,a2=0;h.pools.forEach(p=>{const dh=Math.hypot(x-p.x,zz-p.z),d=dh/(kind===2?p.r*.55:p.r),c=p.c||A.pool;let w=p.w*Math.exp(-d*d);
        /* этап 9: «гребешок» спота на стене — светлая арка с чётким верхом (выше всего над спотом), к полу гаснет; на пол — слабее, на потолок — нет */
        if(p.sc){if(kind===1){const e=y+p.sc*dh*dh;w*=1.3*(1-ss(p.yc-.1,p.yc+.12,e))*(.22+.78*ss(p.yc-2.4,p.yc-.3,e))}else w*=kind===0?.35:0}
        a0+=c[0]*w;a1+=c[1]*w;a2+=c[2]*w});
      let f,k;if(kind===0){f=.8+.2*ss(0,1.4,h.side?Math.min(x-h.x0,h.x1-x,h.z0-zz,zz-h.z1):HW-Math.abs(x));k=1}else if(kind===2){f=.92;k=.55}
      else{const yn=Math.max(0,Math.min(1,y/h.H));f=A.low?1.1-.42*ss(.05,.9,yn):.8+.3*ss(0,.55,yn)-.1*ss(.82,1,yn);k=.7}
      o[0]=Math.min(1.6,(lo[0]+a0*k)*f);o[1]=Math.min(1.6,(lo[1]+a1*k)*f);o[2]=Math.min(1.6,(lo[2]+a2*k)*f);
      /* этап 12: свет зала из оформления — тёплый, холодный или нейтральный (приглушает цвет) */
      const tn=HS_T[h.k];if(tn){if(tn==="n"){const m_=(o[0]+o[1]+o[2])/3;for(let c=0;c<3;c++)o[c]+=(m_-o[c])*.6}else for(let c=0;c<3;c++)o[c]=Math.min(1.6,o[c]*tn[c])}}
    function bake(mesh){mesh.updateMatrixWorld(true);const g=mesh.geometry,pos=g.attributes.position,nor=g.attributes.normal,n=pos.count,col=new Float32Array(n*3),nm=new T.Matrix3().getNormalMatrix(mesh.matrixWorld),v=new T.Vector3(),nv=new T.Vector3(),o=[0,0,0];
      for(let i=0;i<n;i++){v.fromBufferAttribute(pos,i).applyMatrix4(mesh.matrixWorld);nv.fromBufferAttribute(nor,i).applyMatrix3(nm).normalize();const h=HALLZ[hallAt(v.z+nv.z*.4,v.x+nv.x*.4)];lightAt(h,v.x,v.y,v.z,nv.y>.7?0:nv.y<-.7?2:1,o);col[i*3]=o[0];col[i*3+1]=o[1];col[i*3+2]=o[2]}
      g.setAttribute("color",new T.BufferAttribute(col,3))}

    /* предметы */
    const byHall={};opt.objs.forEach(o=>(byHall[o.h]=byHall[o.h]||[]).push(o));
    const hasPh=o=>opt.photo&&opt.photo(o.id)?1:0;Object.values(byHall).forEach(a=>a.sort((p,q)=>hasPh(q)-hasPh(p)||(q.to?q.to.length:0)-(p.to?p.to.length:0)||p.n-q.n));
    /* этап 16: три расстояния до вещи — издалека силуэт, с двух шагов подпись, по E вещь берут в руки */
    const LODS=[];
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
      let lodPP=null;const pu=opt.photo&&opt.photo(o.id);if(pu){const tx=new T.TextureLoader().load(pu);if(T.sRGBEncoding)tx.encoding=T.sRGBEncoding;const fr=new T.Mesh(new T.BoxGeometry(.54,.41,.02),mat(0x1a1a1a));fr.position.set(0,1.34,-.2);fr.rotation.x=-.12;grp.add(fr);const pp=new T.Mesh(new T.PlaneGeometry(.5,.375),new T.MeshBasicMaterial({map:tx}));pp.position.set(0,0,.011);fr.add(pp);lodPP=pp;window.__photoPlanes=(window.__photoPlanes||[]).concat(o.id)}
      if(kind==="glass"){const gl=new T.Mesh(new T.BoxGeometry(.56,.42,.56),new T.MeshLambertMaterial({color:0xE8F2F6,transparent:true,opacity:.14}));gl.position.y=1.21;grp.add(gl)}
      const pq=(opt.plaqueOf&&opt.plaqueOf(o))||{name:o.name.length>46?o.name.slice(0,44)+"…":o.name,sub:"запись "+o.n};pq.c=plaqueCanvas(pq.name,pq.sub,foundS.has(o.id));pq.t=new T.CanvasTexture(pq.c);plaques[o.id]=pq;
      const pl=new T.Mesh(new T.PlaneGeometry(.36,.14),new T.MeshBasicMaterial({map:pq.t}));pl.position.set(0,.84,.301);pl.rotation.x=-.25;grp.add(pl);pl.material.transparent=true;LODS.push({grp,th,pl,pp:lodPP,k:-1,a:-1,ms:null});
      grp.traverse(m=>{m.userData.id=o.id});S.add(grp);clickable.push(grp);block(x-.42,x+.42,zz-.42,zz+.42);grp.userData.blk=blockers[blockers.length-1];contact(x,zz,1.1,1.1);grp.userData.ct=contacts[contacts.length-1];
      grp.userData.label=o.name;grp.userData.n=o.n;if(!BOOKPED[o.id])BOOKPED[o.id]=grp;if(!grp.userData.auto)grp.userData.auto={x,z:zz,r:0};return grp;
    }
    const pick=(k,n)=>(byHall[k]||[]).filter(o=>o.id!=="cards").slice(0,n);
    const H_=Object.fromEntries(HALLZ.map(h=>[h.k,h]));

    /* — Квартиры: три комнаты-экспозиции за канатами — */
    BOOK&&(function(){const h=H_.kv;const z0=h.z0;
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
      const cards=opt.objs.find(o=>o.id==="cards"&&o.h==="kv");if(cards){BUILTIN.cards="kv";const cg=new T.Group();cg.position.set(-5.1,.81,kz-.1);for(let i=0;i<9;i++){const c=new T.Mesh(new T.BoxGeometry(.15,.003,.1),mat([0xE7C9A0,0xB9D2E6,0xE9B4B4,0xD8E2B0][i%4]));c.position.set((i%3)*.17-.1,i*.003,Math.floor(i/3)*.12-.1);c.rotation.y=(i%5-2)*.18;cg.add(c)}if(opt.photo&&opt.photo("cards")){const tx=new T.TextureLoader().load(opt.photo("cards"));if(T.sRGBEncoding)tx.encoding=T.sRGBEncoding;const fr=new T.Mesh(new T.BoxGeometry(.34,.26,.015),mat(0x1a1a1a));fr.position.set(.38,.15,-.05);fr.rotation.x=-.2;const pp=new T.Mesh(new T.PlaneGeometry(.31,.23),new T.MeshBasicMaterial({map:tx}));pp.position.z=.009;fr.add(pp);cg.add(fr);window.__photoPlanes=(window.__photoPlanes||[]).concat("cards")}
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
    BOOK&&(function(){const h=H_.pr;const a=pick("pr",16);a.forEach((o,i)=>{const row=i%4,col=Math.floor(i/4);/* этап 11: правые витрины последнего ряда — на 1,4 м ближе к входу, подход к проёму в «Базу» (z −37,1…−39,3) свободен */
      pedestal(o,[-5.6,-2.8,2.8,5.6][row],h.z0-3.5-col*3.6+(col===3&&row>=2?1.4:0),"glass")});
      for(let i=0;i<4;i++){const sp=new T.Mesh(new T.ConeGeometry(.5,1.2,24,1,true),new T.MeshBasicMaterial({color:0xFFD08A,transparent:true,opacity:.05,side:T.DoubleSide,depthWrite:false}));sp.position.set([-5.6,-2.8,2.8,5.6][i],3.8,h.z0-9);S.add(sp)}})();

    /* — Идеи: белый куб с панелями — */
    BOOK&&(function(){const h=H_.id;IDEAS.forEach((it,i)=>{const side=i%2?1:-1;const k=Math.floor(i/2);const zz=h.z0-2.6-k*2.6;
      const c=textCanvas(it[0],it[1],{w:900,h:600,ts:52,bs:30,pad:56,bg:"#FFFFFF",fg:"#121417",fg2:"#3A3F45"});textPlane(c,2.1,1.4,side*(HW-.03),1.8,zz,side>0?-Math.PI/2:Math.PI/2,false)});
      const b=mat(0x2C2C2C);box(2.2,.45,.6,b,0,.22,h.cz,true);pick("id",3).forEach((o,i)=>pedestal(o,(i-1)*2.4,h.z1+3));})();

    /* — Святилище: восьмиугольник, одна вещь, стрелка идёт только под взглядом — */
    let clockHand=null,clockPos=null;
    BOOK&&(function(){const h=H_.sv;const r=5.6;let svN=0;for(let i=0;i<8;i++){const a=i/8*Math.PI*2+Math.PI/8;const x=Math.sin(a)*r,zz=h.cz+Math.cos(a)*r;if(Math.abs(x)<1.6&&Math.abs(zz-h.cz)>4)continue;
        if(!hsP_("sv")){const c=rothko(i*7919+3);const pp=pick_("sv",svN++);if(pp)imgOnto(c,pp.url);textPlane(c,1.3,1.9,x*.98,2.1,zz,Math.atan2(-x,-(zz-h.cz)),false)}}
      const pl=box(.7,1.05,.7,mat(0x0E0C0D),0,.52,h.cz,"ns");contact(0,h.cz,1.4,1.4);
      const face=new T.Mesh(new T.CylinderGeometry(.22,.22,.04,48),mat(0xF1EEE6));face.rotation.x=Math.PI/2;face.position.set(0,1.35,h.cz);S.add(face);
      const rim=new T.Mesh(new T.TorusGeometry(.22,.02,10,48),mat(0x222222));rim.position.set(0,1.35,h.cz+.005);S.add(rim);
      for(let i=0;i<12;i++){const t=new T.Mesh(new T.BoxGeometry(.012,.04,.01),mat(0x222222));const a=i/12*Math.PI*2;t.position.set(Math.sin(a)*.18,1.35+Math.cos(a)*.18,h.cz+.025);t.rotation.z=-a;S.add(t)}
      const hand=new T.Group();hand.position.set(0,1.35,h.cz+.03);const hm=new T.Mesh(new T.BoxGeometry(.006,.19,.004),mat(0xB0302A));hm.position.y=.08;hand.add(hm);S.add(hand);clockHand=hand;clockPos=new T.Vector3(0,1.35,h.cz);
      const st=new T.Mesh(new T.CylinderGeometry(.03,.03,.25,8),mat(0x222222));st.position.set(0,1.15,h.cz);S.add(st);
      const clk=opt.objs.find(o=>o.id==="o19")||opt.objs.find(o=>/секундн/i.test(o.name))||opt.objs.find(o=>/часы/i.test(o.name));if(clk)BUILTIN[clk.id]="sv";
      [pl,face,rim].forEach(m=>{m.userData.id=clk?clk.id:"";});if(clk){pl.userData.label=clk.name;pl.userData.n=clk.n;face.userData.label=clk.name;face.userData.n=clk.n;clickable.push(pl,face)}
      const sp=new T.SpotLight(0xFFE2B8,1.4,9,.35,.6,1.4);sp.position.set(0,4.4,h.cz+.4);sp.target.position.set(0,1.2,h.cz);S.add(sp);S.add(sp.target)})();

    /* — Двойники: экраны с журналами — */
    const screens=[];
    BOOK&&(function(){const h=H_.dv;const lines=[];Object.values(opt.book).filter(e=>e.v==="v1"||e.v==="v1pack").forEach(e=>e.seg.forEach(s=>{if(s.t)s.t.split(/\n|(?<=\.)\s/).forEach(l=>{if(l.trim())lines.push(l.trim())})}));
      const mk=(x,zz,ry,w,hh,title)=>{const c=document.createElement("canvas");c.width=1024;c.height=Math.round(1024*hh/w);const t=new T.CanvasTexture(c);const m=new T.Mesh(new T.PlaneGeometry(w,hh),new T.MeshBasicMaterial({map:t}));m.position.set(x,hh/2+.6,zz);m.rotation.y=ry;S.add(m);screens.push({c,t,title,off:Math.floor(Math.random()*lines.length)});return m};
      mk(-HW+.05,h.z0-5,Math.PI/2,4,2.2,"viktor-1 / журнал");mk(HW-.05,h.z0-5,-Math.PI/2,4,2.2,"пакет / контакты");mk(-HW+.05,h.z0-12,Math.PI/2,4,2.2,"две настройки");
      screens.forEach(s=>s.lines=lines);
      const port=(x,label,sub,go)=>{const c=textCanvas(label,sub,{w:600,h:900,ts:64,bs:30,pad:50,bg:"#0F1318",fg:"#E9EDF0",fg2:"#8FB4FF"});const m=textPlane(c,1.1,1.65,x,1.6,h.z1+.06);m.userData.go=go;m.userData.label=label+" · написать";clickable.push(m);const f=box(1.2,1.75,.06,mat(0x050608),x,1.6,h.z1+.02)};
      port(3.2,"Viktor-1","Рабочая копия, весна 2027. Сейчас — запись в базе. Нажмите, чтобы написать.","msgs:v1");port(5.6,"N · копия","Собрана из переписки. Чьей — не её. Нажмите, чтобы написать.","msgs:ncopy");
      pick("dv",4).forEach((o,i)=>pedestal(o,2.6+(i%2)*2.6,h.z0-4-Math.floor(i/2)*3,"dark"))})();
    function drawScreens(t){screens.forEach((s,i)=>{const g=s.c.getContext("2d"),W=s.c.width,H=s.c.height;g.fillStyle="#08100B";g.fillRect(0,0,W,H);g.fillStyle="#5F8569";g.font="26px JetBrains Mono, monospace";g.fillText("# "+s.title,30,44);
      g.fillStyle="#B6E3C3";g.font="30px JetBrains Mono, monospace";const n=Math.floor(H/44)-2;for(let k=0;k<n;k++){const l=s.lines[(s.off+k+Math.floor(t/1.4)+i*7)%s.lines.length]||"";g.fillText((l.length>52?l.slice(0,51)+"…":l),30,96+k*44)}s.t.needsUpdate=true})}

    /* — Отец: кабинет — */
    BOOK&&(function(){const h=H_.ot;const wood=mat(0x4A3727);
      box(1.8,.06,.9,wood,0,.8,h.z0-6,true);[[-.8,-.38],[.8,-.38],[-.8,.38],[.8,.38]].forEach(([a,b])=>box(.06,.8,.06,wood,a,.4,h.z0-6+b));contact(0,h.z0-6,2.4,1.4);
      const nb=opt.objs.find(o=>o.n===40&&/тетрад/i.test(o.name))||opt.objs.find(o=>/тетрад/i.test(o.name)&&o.h==="ot")||opt.objs.find(o=>/тетрад/i.test(o.name)&&opt.photo&&opt.photo(o.id));
      const book_=box(.42,.03,.3,mat(0x2F4F7F),0,.85,h.z0-6);const pg=box(.4,.012,.28,mat(0xF2EBD8),0,.872,h.z0-6);
      const gl=new T.Mesh(new T.BoxGeometry(.7,.36,.55),new T.MeshLambertMaterial({color:0xDDEEFF,transparent:true,opacity:.16}));gl.position.set(0,1.01,h.z0-6);S.add(gl);block(-.35,.35,h.z0-6.275,h.z0-5.725,1.19,"ns");/* этап 9: на стол встать можно, на стеклянный колпак с тетрадью — нет */
      if(nb){BUILTIN[nb.id]="ot";[book_,pg,gl].forEach(m=>{m.userData.id=nb.id;m.userData.label=nb.name;m.userData.n=nb.n});clickable.push(gl)}
      box(.5,.05,.5,wood,-HW+.6,.46,h.z0-9);box(.5,.5,.05,wood,-HW+.6,.7,h.z0-9-.24);/* стул у стены */
      box(.4,2.6,2.6,mat(0x3A2A1C),HW-.2,1.3,h.z0-4,true);for(let s=0;s<4;s++)for(let b=0;b<9;b++)box(.25,.32+Math.random()*.1,.07+Math.random()*.05,mat(new T.Color().setHSL(Math.random(),.25,.3)),HW-.3,.5+s*.6,h.z0-5.1+b*.26);
      box(1.4,1.8,.6,mat(0x6A5440),-HW+.7,.9,h.z0-12,true);const door=box(.62,.8,.03,mat(0x7D6650),-HW+1.05,1.3,h.z0-11.68);door.rotation.y=.25;
      box(1.5,.9,.6,wood,HW-.8,.45,h.z0-11,true);for(let i=0;i<6;i++)cyl(.15,.11,.08,mat(0xF4F1EA),HW-1.3+(i%3)*.38,.95+Math.floor(i/3)*.1,h.z0-11);
      const win=textPlane(cnv(256,384,(g)=>{const gr=g.createLinearGradient(0,0,0,384);gr.addColorStop(0,"#DCE6EE");gr.addColorStop(1,"#F7EBD2");g.fillStyle=gr;g.fillRect(0,0,256,384);g.fillStyle="#3B3329";g.fillRect(124,0,8,384);g.fillRect(0,190,256,8)}),1.2,1.8,4.6,2,h.z1+.04);
      cyl(.18,.18,.04,mat(0x111111),2.6,.86,h.z0-6.2);box(.5,.08,.4,mat(0x5C3B22),2.6,.8,h.z0-6.2,true);box(.04,.8,.04,wood,2.6,.4,h.z0-6.2);
      textPlane(textCanvas("Трофимов и Елизаров","Он поставил своего. Сложно. Красиво. Сам себе не верит. Дослушал до конца.",{w:800,h:360,ts:40,bs:26,pad:30}),.9,.4,2.6,1.25,h.z0-5.9);
      pick("ot",3).forEach((o,i)=>pedestal(o,-3+i*3,h.z1+3))})();

    /* — Семья: гостиная — */
    BOOK&&(function(){const h=H_.se;const fab=mat(0x6B7A86),wood=mat(0x6E5038);
      const rug=new T.Mesh(new T.PlaneGeometry(4.2,3),mat(0xffffff,{map:new T.CanvasTexture(cnv(512,384,(g,w,hh)=>{g.fillStyle="#6E2E2A";g.fillRect(0,0,w,hh);g.strokeStyle="#C9A26A";g.lineWidth=10;g.strokeRect(22,22,w-44,hh-44);g.lineWidth=3;g.strokeRect(44,44,w-88,hh-88);g.fillStyle="#2E3A5C";for(let i=0;i<5;i++){g.beginPath();g.ellipse(w/2,hh/2,180-i*34,120-i*22,0,0,7);g.globalAlpha=.25;g.fill()}g.globalAlpha=1;noise(g,w,hh,16)}))}));rug.rotation.x=-Math.PI/2;rug.position.set(0,.014,h.cz);S.add(rug);
      box(2.6,.45,.9,fab,0,.22,h.cz-2.2,true);box(2.6,.55,.2,fab,0,.6,h.cz-2.6,true);box(.2,.6,.9,fab,-1.3,.3,h.cz-2.2,true);box(.2,.6,.9,fab,1.3,.3,h.cz-2.2,true);
      box(1.3,.42,.7,wood,0,.21,h.cz,true);
      [[-.3,0],[.1,.15],[.35,-.1]].forEach(([a,b],i)=>{cyl(.045,.04,.1,mat([0xF2F2EE,0xD9C26A,0x9AB8D6][i]),a,.47,h.cz+b)});
      cyl(.18,.18,.12,mat(0xF6EAD8),-.1,.48,h.cz-.2);for(let i=0;i<16;i++){const a=i/16*Math.PI*2;const c=cyl(.006,.006,.07,mat(0xFFB7C5),-.1+Math.sin(a)*.13,.58,h.cz-.2+Math.cos(a)*.13,6);const fl=new T.Mesh(new T.SphereGeometry(.012,8,8),new T.MeshBasicMaterial({color:0xFFC870}));fl.position.set(c.position.x,.63,c.position.z);S.add(fl);anim.push(t=>{fl.scale.setScalar(.8+Math.sin(t*9+i)*.25)})}
      if(!hsP_("se"))for(let i=0;i<6;i++){const x=-HW+.03,zz=h.z0-3-i*1.6;const c=painting(i*104729+17,384,288);{const pp=pick_("se",i);if(pp)imgOnto(c,pp.url)}box(.04,.8,1.02,mat(0x2B2018),x+.02,1.8+(i%2)*.3,zz);textPlane(c,.9,.68,x+.05,1.8+(i%2)*.3,zz,Math.PI/2,false)}
      box(1.6,.9,.08,mat(0x111111),HW-.06,1.4,h.cz,false).rotation.y=0;
      pick("se",6).forEach((o,i)=>pedestal(o,4.2+(i%2)*1.8,h.z0-3-Math.floor(i/2)*3.4))})();

    /* — N: выставка — */
    BOOK&&(function(){const h=H_.n;const lines=[];Object.values(opt.book).filter(e=>e.v==="n").forEach(e=>e.seg.forEach(s=>{if(s.t)s.t.split("\n").forEach(l=>{if(l.length>12&&l.length<90)lines.push(l)})}));
      for(let r=0;r<3;r++)for(let c=0;c<6;c++){const l=lines[(r*6+c)*3%Math.max(1,lines.length)]||"";const cv=cnv(300,400,(g,w,hh)=>{g.fillStyle="#F7F3EA";g.fillRect(0,0,w,hh);g.fillStyle="#2E3A70";g.font="26px Caveat, cursive";const ws=l.split(" ");let line="",y=50;ws.forEach(wd=>{const t=line?line+" "+wd:wd;if(g.measureText(t).width>w-40){g.fillText(line,20,y);y+=34;line=wd}else line=t});g.fillText(line,20,y);noise(g,w,hh,8)});
        textPlane(cv,.45,.6,-HW+.03,1.2+r*.75,h.z0-3-c*.62,Math.PI/2,false)}
      const lb=cnv(1024,512,(g,w,hh)=>{g.fillStyle="#F8F8F2";g.fillRect(0,0,w,hh);for(let i=0;i<8;i++){const x=24+(i%4)*250,y=24+Math.floor(i/4)*240;g.fillStyle="#1E1F21";g.fillRect(x,y,230,220);g.fillStyle="#ECE8DF";g.font="22px Literata, serif";const l=lines[i*5%Math.max(1,lines.length)]||"";const ws=l.split(" ");let line="",yy=y+40;ws.forEach(wd=>{const t=line?line+" "+wd:wd;if(g.measureText(t).width>200){g.fillText(line,x+14,yy);yy+=28;line=wd}else line=t});g.fillText(line,x+14,yy);g.fillStyle="#D9A441";g.font="14px monospace";g.fillText(String(i+1).padStart(2,"0")+"A ▸",x+14,y+206)}});
      const lbm=textPlane(lb,4,2,HW-.05,1.7,h.cz,-Math.PI/2);
      box(2.4,.45,.6,mat(0x2C2C2C),0,.22,h.cz,true);
      pick("n",6).forEach((o,i)=>pedestal(o,-2.4+(i%3)*2.4,h.z0-3.4-Math.floor(i/3)*(h.D-7)))})();

    /* — Клуб: табло прогнозов, станция — */
    const leds=[];
    BOOK&&(function(){const h=H_.kl;
      const board=textCanvas("Прогнозы · среда","Три полные копии умерших близких каждому — через 2–3 года · вероятность 0,35 · Условные 90% переноса — через 5–10 лет · 0,12 · Ответ «Океана» — 1–5 минут · 0,9 · Слово «любое» — не проверено",{w:1200,h:640,ts:60,bs:34,pad:50,bg:"#0E1A2A",fg:"#E9F0F8",fg2:"#9EC2F2",font:"JetBrains Mono, monospace"});
      textPlane(board,4.4,2.35,-4.6,2.2,h.z1+.05);
      const rate=textCanvas("Рейтинг прогнозистов","1 Джон 0,112 · 2 Роман 0,148 · 3 Сергей 0,171 · 4 Anton 0,188 · 5 Джош 0,209 · — Viktor: 0 прогнозов",{w:900,h:600,ts:48,bs:32,pad:40,bg:"#FFFFFF",fg:"#14181D",font:"Golos Text, sans-serif"});
      textPlane(rate,2.4,1.6,-HW+.04,1.8,h.cz,Math.PI/2);
      box(.7,2,.9,mat(0x1A1D21),HW-.6,1,h.cz,true);for(let i=0;i<18;i++){const l=new T.Mesh(new T.BoxGeometry(.02,.02,.02),new T.MeshBasicMaterial({color:0x4CFF8A}));l.position.set(HW-.94,.3+i*.09,h.cz-.3+(i%3)*.12);S.add(l);leds.push(l)}
      textPlane(textCanvas("Домашняя станция","Ночью в пуле кружка. Основание: анкета, отложенная часть, дозаполнена в среду.",{w:800,h:360,ts:40,bs:26,pad:30}),.9,.4,HW-.96,2.25,h.cz,-Math.PI/2);
      box(4,.05,1.2,mat(0xDADDE0),0,.76,h.cz,true);for(let i=0;i<4;i++){box(.34,.02,.24,mat(0x2a2c30),-1.5+i,.79,h.cz);const s=textPlane(cnv(64,48,(g)=>{g.fillStyle="#1E3A5F";g.fillRect(0,0,64,48)}),.32,.2,-1.5+i,.9,h.cz-.12);s.rotation.x=-.3}
      pick("kl",4).forEach((o,i)=>pedestal(o,-5.4+(i%2)*2.2,h.z0-3.5-Math.floor(i/2)*3))})();

    /* — Красота: Большая галерея → супермаркет — */
    BOOK&&(function(){const h=H_.kr;const L=h.D;let krN=0;const pal=[0x6b8fb0,0xb06b4a,0xd2b84a,0x7a9b6a,0x9a6a9b,0x4a6a8a,0xc94a3a,0xe0d6c0];
      const sky=new T.Mesh(new T.PlaneGeometry(3,L*.55),new T.MeshBasicMaterial({color:0xF6F2E8}));sky.rotation.x=Math.PI/2;sky.position.set(0,h.H-.02,h.z0-L*.28);S.add(sky);
      const gold=mat(0x8F7032);
      for(let i=0;i<14;i++){const zz=h.z0-3-i*4.2;const t=(h.z0-zz)/L;
        if(t<.5){if(!hsP_("kr"))[-1,1].forEach(s=>{const ph=1.6+((i*3+s+5)%4)*.35;const c=painting(i*7907+s*31+11);const pp=pick_("kr",krN++);if(pp)imgOnto(c,pp.url);const fr=box(.08,ph+.24,(ph+.24)*1.33,gold,s*(HW-.06),2.6,zz);textPlane(c,ph*1.33,ph,s*(HW-.11),2.6,zz,s>0?-Math.PI/2:Math.PI/2,false);
            textPlane(plaqueCanvas(pp?pp.title:"Без названия · вид "+(i+1),"залы галереи"),.36,.14,s*(HW-.1),1.2,zz+(ph*.67+.3),s>0?-Math.PI/2:Math.PI/2)});
          if(i%2===0){box(1.6,.42,.5,mat(0x6E1C22),0,.21,zz,true);contact(0,zz,2,1)}}
        else{[-1,1].forEach(s=>{for(let k=0;k<5;k++){box(.7,.035,3.8,mat(0xC9CCCF),s*(HW-.45),.35+k*.5,zz);for(let j=0;j<7;j++){const hh=.18+((i+j+k)%3)*.08;box(.22,hh,.22,mat(pal[(i*3+j+k+(s>0?2:0))%8]),s*(HW-.45),.37+k*.5+hh/2,zz-1.6+j*.52)}}
            box(.06,2.8,3.9,mat(0xB9BCC0),s*(HW-.06),1.4,zz)});
          const strip=new T.Mesh(new T.BoxGeometry(.25,.04,3.6),new T.MeshBasicMaterial({color:0xF4F8FF}));strip.position.set(0,h.H-.6,zz);S.add(strip)}}
      const tz=h.z0-L*.52;const tl=new T.Mesh(new T.PlaneGeometry(HW*2,L*.5,sg(HW*2),sg(L*.5)),bmat({map:tex("smtiles","",[4,L*.5/4])}));tl.rotation.x=-Math.PI/2;tl.position.set(0,.01,h.z1+L*.25);S.add(tl);surf.push(tl);
      /* этап 7: магазинная часть — своя холодная облицовка поверх бордового штофа (стены, торец, потолок) и стальной шов на границе с галереей:
         без неё после этапа 2 штоф и тёплый свет тянулись до самой кассы, и супермаркет читался как продолжение галереи */
      {const mz0=h.z0-30.3,mL=mz0-h.z1,HH=h.H,clad=(w,hh,rep)=>bmat({map:tex("smwall","",rep)});
        [-1,1].forEach(s=>{const m=new T.Mesh(new T.PlaneGeometry(mL,HH,sg(mL),Math.max(4,sg(HH))),clad(mL,HH,[mL/2.4,HH/4.25]));m.rotation.y=s>0?-Math.PI/2:Math.PI/2;m.position.set(s*(HW-.012),HH/2,(mz0+h.z1)/2);m.userData.sm=1;S.add(m);surf.push(m);
          box(.05,HH,.14,mat(0xAEB6BD),s*(HW-.03),HH/2,mz0)});
        const e=new T.Mesh(new T.PlaneGeometry(HW*2,HH,sg(HW*2),Math.max(4,sg(HH))),clad(HW*2,HH,[HW*2/2.4,HH/4.25]));e.position.set(0,HH/2,h.z1+.012);e.userData.sm=1;S.add(e);surf.push(e);
        const c=new T.Mesh(new T.PlaneGeometry(HW*2,mL,sg(HW*2),sg(mL)),bmat({color:0xE4E9EE}));c.rotation.x=Math.PI/2;c.position.set(0,HH-.012,(mz0+h.z1)/2);c.userData.sm=1;S.add(c);surf.push(c);
        box(HW*2-.1,.3,.05,mat(0xAEB6BD),0,HH-.15,mz0)}
      textPlane(textCanvas("Из колонок — то, что он любил в девять лет","Всё сходится: ни одной сбитой ноты, ни одного места, где кассета жевала.",{w:1000,h:300,ts:44,bs:28,pad:36}),2,.6,0,3.4,tz);
      const cz=h.z1+5;box(1.8,1,.8,mat(0x55606A),2.6,.5,cz-1,true);box(1.8,.04,.8,mat(0x22262B),2.6,1.02,cz-1);
      pick("kr",6).forEach((o,i)=>pedestal(o,-2.2+(i%3)*1.6,cz+1.4+Math.floor(i/3)*1.6))})();

    surf.forEach(bake);
    /* ---------- этап 12: оформление залов — материалы поверхностей и картины. Цвет — сразу; картинки — лениво (зал и соседние), вдали освобождаются ---------- */
    const HSG={},HSP=[],HSF={};let HSG_=null;
    (function hsInit(){if(!BOOK||!Object.keys(HS).length)return;const H_I={};HALLZ.forEach((h,i)=>{if(!(h.k in H_I))H_I[h.k]=i});
      Object.keys(HS).forEach(k=>{const hi=H_I[k];if(hi==null)return;const h=HALLZ[hi],side=!!h.side,f=side?[1,0]:[0,-1],R=[-f[1],f[0]],cx=side?h.cx:0,cz=h.cz,hx=side?(h.x1-h.x0)/2:HW,hz=h.D/2;
        const ext=d=>Math.abs(d[0])*hx+Math.abs(d[1])*hz;
        const wallF=d=>{const e=ext(d),ua=[-d[1],d[0]],L=2*ext(ua),c=[cx+d[0]*e,cz+d[1]*e];return {o:[c[0]-ua[0]*L/2,0,c[1]-ua[1]*L/2],ua:[ua[0],0,ua[1]],va:[0,1,0],L,Lv:h.H,n:[-d[0],-d[1]],d,c}};
        const Lr=2*ext(R),Lf=2*ext(f),fo=[cx-R[0]*Lr/2-f[0]*Lf/2,0,cz-R[1]*Lr/2-f[1]*Lf/2],flF={o:fo,ua:[R[0],0,R[1]],va:[f[0],0,f[1]],L:Lr,Lv:Lf};
        HSF[k]={hi,h,W:{n:wallF(f),s:wallF([-f[0],-f[1]]),e:wallF(R),w:wallF([-R[0],-R[1]])},floor:flF,ceil:flF}});
      const v=new T.Vector3();
      HSS.forEach(sl=>{const F=HSF[sl.k];if(!F)return;const me=sl.mesh,g=me.geometry;me.updateMatrixWorld(true);
        if(sl.face>=0){const G=g.groups[sl.face]||(g.userData.hsG&&g.userData.hsG[sl.face]);if(!g.userData.hsG)g.userData.hsG=g.groups.map(x=>({start:x.start,count:x.count}));const GG=g.userData.hsG[sl.face];
          const ix=g.index.array,set=new Set();for(let q=GG.start;q<GG.start+GG.count;q++)set.add(ix[q]);sl.vs=[...set]}
        /* стена: ближайшая из четырёх (по центру поверхности) */
        if(sl.part==="wall"){const pos=g.attributes.position;let ax=0,az=0,n=0;const each=sl.vs||Array.from({length:pos.count},(_,q)=>q);each.forEach(q=>{v.fromBufferAttribute(pos,q).applyMatrix4(me.matrixWorld);ax+=v.x;az+=v.z;n++});ax/=n;az/=n;
          let best=null,bd=1e9;Object.values(F.W).forEach(W=>{const dd=Math.abs((ax-W.c[0])*W.d[0]+(az-W.c[1])*W.d[1]);if(dd<bd){bd=dd;best=W}});sl.F=best}
        else sl.F=F[sl.part];
        const key=sl.k+"|"+sl.part;if(!HSG[key]){const def=HS[sl.k][sl.part];HSG[key]={k:sl.k,part:sl.part,def,mat:bmat({color:new T.Color(def.color||"#FFFFFF")}),slots:[],state:def.img?"wait":"none",tex:null,gen:0}}
        HSG[key].slots.push(sl);if(!me.userData.hsOrig)me.userData.hsOrig=Array.isArray(me.material)?me.material[0]:me.material});
      /* цвет без картинки и до её загрузки — сразу */
      Object.values(HSG).forEach(G=>{if(G.def.color)G.slots.forEach(sl=>hsSet(sl,G.mat))});
      /* картины */
      Object.keys(HS).forEach(k=>{const F=HSF[k];if(!F||!HS[k].paintings)return;
        if(!HSG_){HSG_={box:new T.BoxGeometry(1,1,1),pl:new T.PlaneGeometry(1,1),frame:mat(0x24201C)}}
        const I_=hallInfo(opt.branches||[])[k]||{},DRS=I_.doorsAll||I_.doors||{};
        HS[k].paintings.forEach((p,j)=>{const W=F.W[p.wall]||F.W.n,H=F.h.H,L=W.L,ft=hsFit(p,L,H,DRS[p.wall]),w=ft.w,hh=ft.h,u=ft.u,y=ft.y,al=L/2+u;
          const g=new T.Group();g.position.set(W.o[0]+W.ua[0]*al+W.n[0]*.04,y,W.o[2]+W.ua[2]*al+W.n[1]*.04);g.rotation.y=Math.atan2(W.n[0],W.n[1]);
          const fr=new T.Mesh(HSG_.box,HSG_.frame);fr.position.z=-.018;g.add(fr);const imat=new T.MeshBasicMaterial({color:0xE6E1D8}),im=new T.Mesh(HSG_.pl,imat);im.position.z=.006;g.add(im);
          const P={k,j,p,g,fr,im,imat,hi:F.hi,max:[w,hh],asp:w/hh,state:"wait",tex:null,ct:null,pt:null,pq:null,gen:0,on:false};
          if(p.title){const pmat=new T.MeshBasicMaterial({color:0xF4F2EC}),pq=new T.Mesh(HSG_.pl,pmat);pq.scale.set(.4,.155,1);g.add(pq);P.pq=pq;P.pmat=pmat}
          im.userData.photo={src:p.img,caption:p.title||"Картина"};im.userData.label=p.title||"Картина";g.visible=false;S.add(g);hsSize(P);HSP.push(P)})})})();
    /* материал поверхности: у плоскостей — целиком; у перегородок (коробки) — только своя сторона (+z — зал до перегородки, −z — следующий) */
    function hsSet(sl,m){const me=sl.mesh;if(sl.face<0){me.material=m;return}
      if(!Array.isArray(me.material)){const o=me.material,g=me.geometry,G=g.userData.hsG||g.groups.map(x=>({start:x.start,count:x.count}));g.userData.hsG=G;
        if(G.length===6){g.clearGroups();g.addGroup(G[0].start,G[0].count+G[1].count+G[2].count+G[3].count,0);g.addGroup(G[4].start,G[4].count,1);g.addGroup(G[5].start,G[5].count,2)}me.material=[o,o,o]}
      me.material[sl.face===4?1:2]=m}
    /* UV по мировым координатам поверхности: «растянуть» — на всю стену (пол, потолок), «повторять» — плитка 2 м, высота по пропорции картинки */
    function hsUV(sl,mode,tw,th){const g=sl.mesh.geometry,uv=g.attributes.uv,pos=g.attributes.position,F=sl.F;if(!g.userData.uv0)g.userData.uv0=Float32Array.from(uv.array);
      const mw=sl.mesh.matrixWorld,v=new T.Vector3(),one=q=>{v.fromBufferAttribute(pos,q).applyMatrix4(mw);const dx=v.x-F.o[0],dy=v.y-F.o[1],dz=v.z-F.o[2];
        const a=dx*F.ua[0]+dy*F.ua[1]+dz*F.ua[2],b=dx*F.va[0]+dy*F.va[1]+dz*F.va[2];uv.setXY(q,mode==="stretch"?a/F.L:a/tw,mode==="stretch"?b/F.Lv:b/th)};
      if(sl.vs)sl.vs.forEach(one);else for(let q=0;q<uv.count;q++)one(q);uv.needsUpdate=true}
    function hsUV0(sl){const g=sl.mesh.geometry,u0=g.userData.uv0;if(!u0)return;const uv=g.attributes.uv,one=q=>uv.setXY(q,u0[q*2],u0[q*2+1]);if(sl.vs)sl.vs.forEach(one);else for(let q=0;q<uv.count;q++)one(q);uv.needsUpdate=true}
    const hsMax=()=>(lite||coarse.matches)?1024:2048;
    function hsLoad(G){if(!G.def.img||G.state!=="wait")return;const gen=++G.gen;G.state="loading";
      wLoadTex(G.def.img,hsMax(),(t,iw,ih)=>{if(G.gen!==gen||stopped){wDrop(t);return}if(!t){G.state="fail";return}
        const mode=G.def.mode==="stretch"?"stretch":"tile",tw=2,th=tw*ih/iw;t.wrapS=t.wrapT=mode==="tile"?T.RepeatWrapping:T.ClampToEdgeWrapping;
        G.slots.forEach(sl=>{hsUV(sl,mode,tw,th);hsSet(sl,G.mat)});G.tex=t;G.mat.map=t;G.mat.color.set(0xFFFFFF);G.mat.needsUpdate=true;G.state="ok";G.px=t.__px})}
    function hsDrop(G){G.gen++;if(G.state!=="ok"&&G.state!=="loading")return;wDrop(G.tex);G.tex=null;G.mat.map=null;G.mat.color.set(G.def.color||"#FFFFFF");G.mat.needsUpdate=true;
      G.slots.forEach(sl=>{hsUV0(sl);if(!G.def.color)hsSet(sl,sl.mesh.userData.hsOrig)});G.state="wait"}
    function hsSize(P){let pw=P.max[0],ph=P.max[1];const a=P.asp;if(pw/ph>a)pw=ph*a;else ph=pw/a;P.im.scale.set(pw,ph,1);P.fr.scale.set(pw+.08,ph+.08,.035);
      if(P.pq){const below=P.g.position.y-ph/2-.2>.35;P.pq.position.set(below?0:pw/2+.26,below?-ph/2-.17:-ph/2+.08,.01)}P.size=[+pw.toFixed(3),+ph.toFixed(3)]}
    function hsOn(P){P.on=true;P.g.visible=true;if(clickable.indexOf(P.im)<0)clickable.push(P.im);
      if(!P.ct){P.ct=new T.CanvasTexture(wCard(P.p.title||"Картина"));WTEX.add(P.ct)}if(!P.tex){P.imat.map=P.ct;P.imat.color.set(0xFFFFFF);P.imat.needsUpdate=true}
      if(P.pq&&!P.pt){P.pt=new T.CanvasTexture(plaqueCanvas(P.p.title.length>46?P.p.title.slice(0,44)+"…":P.p.title,"",false));WTEX.add(P.pt);P.pmat.map=P.pt;P.pmat.color.set(0xFFFFFF);P.pmat.needsUpdate=true}
      if(P.state!=="wait")return;const gen=++P.gen;P.state="loading";
      wLoadTex(P.p.img,(lite||coarse.matches)?1024:(P.max[0]>2.5?2048:1024),(t,iw,ih)=>{if(P.gen!==gen||!P.on||stopped){wDrop(t);return}if(!t){P.state="fail";return}
        P.tex=t;P.asp=iw/ih;P.imat.map=t;P.imat.needsUpdate=true;P.state="ok";hsSize(P)})}
    function hsOff(P){P.on=false;P.gen++;P.g.visible=false;const i=clickable.indexOf(P.im);if(i>=0)clickable.splice(i,1);[P.tex,P.ct,P.pt].forEach(wDrop);P.tex=P.ct=P.pt=null;
      P.imat.map=null;P.imat.color.set(0xE6E1D8);P.imat.needsUpdate=true;if(P.pmat){P.pmat.map=null;P.pmat.needsUpdate=true}P.state="wait"}
    function hsStep(hi){if(hi===hsStep.h||(!HSP.length&&!Object.keys(HSG).length))return;hsStep.h=hi;const near=j=>j===hi||seen(j,hi);
      Object.values(HSG).forEach(G=>{const j=HSF[G.k].hi;if(near(j))hsLoad(G);else hsDrop(G)});HSP.forEach(P=>{if(near(P.hi)){if(!P.on)hsOn(P)}else if(P.on)hsOff(P)})}
    stopFns.push(()=>{Object.values(HSG).forEach(G=>{wDrop(G.tex);G.mat.dispose()});HSP.forEach(P=>{[P.tex,P.ct,P.pt].forEach(wDrop);P.imat.dispose();if(P.pmat)P.pmat.dispose()});if(HSG_){HSG_.box.dispose();HSG_.pl.dispose();HSG_.frame.dispose()}});

    /* ---------- фигура посетителя: коробочный человечек со своей кепкой и бейджем ---------- */
    /* фигура — общий набор (этап 6Б): тот же строитель рисует превью в панели персонажа */
    const FK=figKit(T,shadowTex),FG=FK.FG,FM=FK.FM,figure=FK.figure;
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
    /* этап 18: в музей книги все — и посетители, и автор сайта — входят в «Святилище» */
    if(BOOK){const s0=HALLZ.find(h=>h.k==="sv");if(s0)P.z+=s0.z0}
    const TP_DIST=coarse.matches?3.8:3.2,MAX_DIST=5.5,PITCH_TP=[-.8,.5],PITCH_FP=[-1.1,1.1];
    const C={yaw:0,pitch:-.26,want:TP_DIST,last:TP_DIST,cur:TP_DIST,d:TP_DIST};
    const V={x:0,z:0,vy:0,ground:true,gy:0};const WALK=2.6,RUN=5.2;
    /* вертикаль (этап 4, этап 9): прыжок с вершиной ≈0,84 м (точное интегрирование — высота не зависит от частоты кадров): со стоящего
       места и с разбега хватает на стол 0,75 м и столешницу 0,9 м; ступенька без прыжка до 0,22 м, в воздухе — подхват края до 0,12 м.
       HEAD — рост фигуры с запасом: над головой (потолок, низ подвешенного) должно оставаться место */
    const GRAV=13,JUMP_V=4.67,STEP=.22,AIR_STEP=.12,HEAD=1.7;
    let target=null,jumpQ=false,lastLook=0,plFail=0,plTry=0,bob=0;const keys={};
    const r=.32;
    const inWalk=(x,zz)=>LB?libValid(x,zz):walk.some(w=>x>=w[0]&&x<=w[1]&&zz>=w[2]&&zz<=w[3]);
    const over=(b,x,zz)=>x>b[0]-r&&x<b[1]+r&&zz>b[2]-r&&zz<b[3]+r;
    /* можно ли стоять в (x,z), если ступни на высоте y: всё, что под квадратом фигуры, должно быть не выше y+step */
    /* этап 9: и над головой должно хватать места — до потолка пространства и до низа подвешенного над квадратом фигуры */
    function canStand(x,zz,y,step){if(LB)return libStand(x,zz,y||0,step==null?STEP:step);if(!inWalk(x,zz))return false;y=y||0;const lim=y+(step==null?STEP:step),hd=y+HEAD;if(hd>HALLZ[hallAt(zz,x)].H+1e-6)return false;
      for(let i=0;i<blockers.length;i++){const b=blockers[i];if(b[5]){if(b[5]<hd-1e-6&&b[6]>y+1e-6&&over(b,x,zz))return false}else if(b[4]>lim&&over(b,x,zz))return false}return true}
    function conflicts(x,zz,y,step){const out=[],lim=y+step,hd=y+HEAD;if(hd>HALLZ[hallAt(zz,x)].H+1e-6)out.push(-1);
      for(let i=0;i<blockers.length;i++){const b=blockers[i];if(!over(b,x,zz))continue;if(b[5]?(b[5]<hd-1e-6&&b[6]>y+1e-6):b[4]>lim)out.push(i)}return out}
    /* опора под фигурой: самый высокий верх среди стоящих на полу препятствий под её квадратом (не выше y+step), иначе пол */
    function groundAt(x,zz,y,step){if(LB)return libGround(x,zz,(y||0)+(step==null?STEP:step));const lim=(y||0)+(step==null?STEP:step);let g=0;for(let i=0;i<blockers.length;i++){const b=blockers[i];if(!b[5]&&b[4]<=lim&&b[4]>g&&over(b,x,zz))g=b[4]}return g}
    /* потолок над фигурой: высота пространства или низ подвешенного над ней (люстра, вытяжка, перемычка проёма) */
    function ceilAt(x,zz,y){let c=HALLZ[hallAt(zz,x)].H;for(let i=0;i<blockers.length;i++){const b=blockers[i];if(b[5]&&b[5]>y&&b[5]<c&&over(b,x,zz))c=b[5]}return c}
    /* шаг со скольжением вдоль стен: на земле заблокированная ось гасит свою скорость; в воздухе скорость остаётся,
       чтобы прыжок у самой лавки всё равно на неё вынес. Длинный шаг режется на части — сквозь тонкое не проскочить */
    function moveBy(dx,dz){const st=V.ground?STEP:AIR_STEP,n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.12));let ok=false;
      /* если фигура уже оказалась внутри (телепорт, чужая правка), выпускаем её в любую сторону в пределах зала */
      /* этап 9: выпускаем, только не заводя в новое препятствие: помехи на новом месте — подмножество помех на старом */
      let bad0=null;const ok_=(x,zz)=>{if(canStand(x,zz,P.y,st))return true;if(!inWalk(x,zz))return false;if(!bad0)bad0=conflicts(P.x,P.z,P.y,st);if(!bad0.length)return false;
        const b1=conflicts(x,zz,P.y,st);return b1.every(i=>bad0.includes(i))};
      for(let k=0;k<n;k++){const sx=dx/n,sz=dz/n,nx=P.x+sx,nz=P.z+sz;
        if(ok_(nx,nz)){P.x=nx;P.z=nz;ok=true;continue}let m=false;
        if(sx&&ok_(nx,P.z)){P.x=nx;m=true}else if(V.ground)V.x=0;
        if(sz&&ok_(P.x,nz)){P.z=nz;m=true}else if(V.ground)V.z=0;
        ok=ok||m;if(!m)break}
      return ok}
    function stepVert(dt){const g=groundAt(P.x,P.z,P.y,V.ground?STEP:AIR_STEP);V.gy=g;
      if(V.ground){if(g>P.y+1e-4)P.y=g;/* ступенька вверх */else if(g<P.y-.01){V.ground=false;V.vy=0}/* сошёл с края */else P.y=g;if(V.ground)return}
      let ny=P.y+V.vy*dt-.5*GRAV*dt*dt;V.vy-=GRAV*dt;const top=ceilAt(P.x,P.z,P.y)-.05-HEAD;if(ny>top){ny=Math.max(top,Math.min(P.y,ny));if(V.vy>0)V.vy=0}
      /* край, подхваченный в воздухе, поднимает ступни на свой верх сразу: фигура никогда не оказывается внутри препятствия */
      if(ny<=g){ny=g;if(V.vy<=0){snd.land(-V.vy);V.vy=0;V.ground=true}}
      P.y=ny}
    const fpMode=()=>C.want===0;
    const clampPitch=p=>{const L=fpMode()?PITCH_FP:PITCH_TP;return Math.max(L[0],Math.min(L[1],p))};
    const locked=()=>document.pointerLockElement===canvas;
    const engaged=()=>locked()||document.activeElement===canvas;
    const look=(dx,dy,k)=>{if(INS.on){insTurn(dx*k/.0042,dy*k/.0042);return}C.yaw-=dx*k;C.pitch=clampPitch(C.pitch-dy*k*.86);lastLook=performance.now()};
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
    /* жесты (этап 3): G — помахать, C — сесть: у лавки, стола, тумбы — на них; любое движение или прыжок поднимает; помахать — стоя */
    const GS={sit:false,waveT:0};
    const doWave=()=>{GS.sit=false;GS.waveT=reduce?1.6:2.4;syncG()};
    /* этап 17: «сесть» рядом с низкой вещью сажает на неё (лавка, стол, тумба, ящик — всё, чей верх от 0,25 до 1,05 м); встать — вернуться туда, откуда сел */
    let SEAT=null;
    function seatNear(){let best=null,bd=1.15;for(let i=0;i<blockers.length;i++){const b=blockers[i],t=b[6];if(b[5]||!(t>=.25&&t<=1.05))continue;const x0=Math.min(b[0],b[1]),x1=Math.max(b[0],b[1]),z0=Math.min(b[2],b[3]),z1=Math.max(b[2],b[3]);
        if(x1-x0<.28||z1-z0<.28)continue;const nx=Math.max(x0,Math.min(x1,P.x)),nz=Math.max(z0,Math.min(z1,P.z)),d=Math.hypot(nx-P.x,nz-P.z);if(d<bd&&Math.abs((P.y||0)-t)<1.2){bd=d;best={x0,x1,z0,z1,t,nx,nz}}}
      if(!best)return null;const cx=(best.x0+best.x1)/2,cz=(best.z0+best.z1)/2;let dx=P.x-best.nx,dz=P.z-best.nz;if(Math.hypot(dx,dz)<.05){dx=P.x-cx;dz=P.z-cz}const dl=Math.hypot(dx,dz)||1;dx/=dl;dz/=dl;
      const inx=Math.min(.2,(best.x1-best.x0)/2),inz=Math.min(.2,(best.z1-best.z0)/2);
      return {x:Math.max(best.x0+inx,Math.min(best.x1-inx,best.nx-dx*.2)),z:Math.max(best.z0+inz,Math.min(best.z1-inz,best.nz-dz*.2)),y:best.t,yaw:Math.atan2(-dx,-dz),fx:P.x,fz:P.z,fy:P.y||0}}
    const toggleSit=v=>{GS.sit=v===undefined?!GS.sit:!!v;if(GS.sit){GS.waveT=0;SEAT=seatNear();if(SEAT){P.yaw=SEAT.yaw;target=null}}syncG()};
    const gestNow=()=>GS.waveT>0?"wave":GS.sit?"sit":"";
    const gOk=v=>v==="wave"||v==="sit"?v:"";
    const kd=ev=>{if(cust.isOpen||typing(ev.target)||ev.ctrlKey||ev.metaKey||ev.altKey)return;const c=ev.code;snd.gesture();
      /* бег: Shift по фактическому состоянию (нажатие могло пройти мимо окна) и двойное нажатие «вперёд» */
      if(c!=="ShiftLeft"&&c!=="ShiftRight"){if(!ev.shiftKey)keys.ShiftLeft=keys.ShiftRight=false;else if(!keys.ShiftLeft&&!keys.ShiftRight)keys.ShiftLeft=true}
      if((c==="KeyW"||c==="ArrowUp")&&!ev.repeat){const n_=performance.now();if(n_-(kd.w||0)<320)keys.RunTap=true;kd.w=n_}
      if(INS.on){if(c==="KeyE"||c==="Enter"){ev.preventDefault();if(!ev.repeat)insCard();return}if(c==="Escape"){ev.preventDefault();insClose();return}
        if(c==="ArrowLeft"||c==="KeyA"){ev.preventDefault();INS.yaw-=.24;return}if(c==="ArrowRight"||c==="KeyD"){ev.preventDefault();INS.yaw+=.24;return}
        if(c==="ArrowUp"){ev.preventDefault();INS.pitch=Math.max(-.75,INS.pitch-.16);return}if(c==="ArrowDown"){ev.preventDefault();INS.pitch=Math.min(.75,INS.pitch+.16);return}
        if(MOVE.has(c)||c==="Space")insClose()}
      if(MOVE.has(c)){keys[c]=true;if(engaged())ev.preventDefault();return}
      if(c==="Space"){if(!engaged())return;ev.preventDefault();if(!ev.repeat)jumpQ=true;return}
      if(LB){if((c==="KeyR"||c==="PageUp")&&!ev.repeat){ev.preventDefault();libStairs(1);return}if((c==="KeyZ"||c==="PageDown")&&!ev.repeat){ev.preventDefault();libStairs(-1);return}if(c==="KeyL"&&!ev.repeat){liftOpen();return}
        if(c==="KeyE"&&!ev.repeat&&!nearObj){libOpen(libPickC());return}}
      if(c==="KeyT"){if(!ev.repeat)holdToggle();return}
      if(c==="KeyE"){if(nearObj&&!ev.repeat)activate(nearObj);return}
      if(c==="KeyG"){if(!ev.repeat)doWave();return}
      if(c==="KeyM"){if(!ev.repeat)micToggle();return}
      if(c==="KeyC"){if(!ev.repeat)toggleSit();return}
      if(c==="KeyV"){if(!ev.repeat)toggleView();return}
      if(c==="KeyF"){if(!ev.repeat)FS.toggle();return}
      if(c==="Escape"&&FS.mode==="fill"&&!locked()){FS.exit()}};
    const ku=ev=>{keys[ev.code]=false;if(ev.code==="KeyW"||ev.code==="ArrowUp")keys.RunTap=false;if(!ev.shiftKey&&ev.code!=="ShiftLeft"&&ev.code!=="ShiftRight")keys.ShiftLeft=keys.ShiftRight=false};
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
    function pickAt(nx,ny){mv.set(nx,ny);ray.setFromCamera(mv,cam);const hits=ray.intersectObjects(clickable,true);if(hits.length&&hits[0].distance<9+C.d){let o=hits[0].object;while(o&&!o.userData.id&&!o.userData.go&&!o.userData.photo&&!o.userData.sobj&&!o.userData.lift)o=o.parent;if(o)return o}return null}
    function interact(){const o=nearObj||pickAt(0,0);if(o)activate(o)}
    on(canvas,"pointerdown",ev=>{try{canvas.focus({preventScroll:true})}catch(e){}
      if(locked()){if(ev.button===0){if(LB&&!nearObj&&libOpen(libPickC()))return;interact()}return}
      if(ev.pointerType==="touch"&&ev.target!==canvas)return;drag={x:ev.clientX,y:ev.clientY,id:ev.pointerId,type:ev.pointerType};moved=0;try{canvas.setPointerCapture(ev.pointerId)}catch(e){}});
    on(canvas,"pointermove",ev=>{if(!drag||drag.id!==ev.pointerId||locked())return;const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;moved+=Math.abs(dx)+Math.abs(dy);drag.x=ev.clientX;drag.y=ev.clientY;
      look(dx,dy,.0042)});
    on(canvas,"pointerup",ev=>{if(!drag||drag.id!==ev.pointerId)return;const was=moved,type=drag.type;drag=null;if(was>6)return;if(INS.on){insClose();return}
      const rc=canvas.getBoundingClientRect(),nx=((ev.clientX-rc.left)/rc.width)*2-1,ny=-((ev.clientY-rc.top)/rc.height)*2+1;
      const o=pickAt(nx,ny);if(o){activate(o);return}
      if(LB&&libOpen(libPick(nx,ny)))return;
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
    gMenu.querySelectorAll("button").forEach(b=>padBtn(b,()=>{if(b.dataset.g==="wave")doWave();else if(b.dataset.g==="take")holdToggle();else toggleSit();setGM(false)}));
    on(canvas,"pointerdown",()=>setGM(false));on(stick,"pointerdown",()=>setGM(false));
    /* «смотреть» становится «говорить», когда ближе всех — двойник */
    const ACT_LOOK='<b>◉</b>смотреть',ACT_TALK='<b><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 4.5h14v9H9l-4 3v-3H3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg></b>говорить';
    let actMode="look";
    function setAct(mode,name){if(!bAct)return;if(mode!==actMode){actMode=mode;bAct.innerHTML=mode==="talk"?ACT_TALK:ACT_LOOK}bAct.setAttribute("aria-label",mode==="talk"?"Поговорить: "+name:"Рассмотреть ближайший предмет")}
    stopFns.push(()=>{if(locked())document.exitPointerLock();if(pad)pad.remove()});

    /* ---------- этап 16: силуэт → подпись → вещь в руках ---------- */
    const LOD_DARK=new T.Color(0x15171B),lodC=new T.Color();
    function stepLOD(){const px=P.x,pz=P.z;for(let i=0;i<LODS.length;i++){const L=LODS[i],g=L.grp;if(!g.parent)continue;const d=Math.hypot(g.position.x-px,g.position.z-pz);
        const k=d<=5.2?0:d>=6.4?1:(d-5.2)/1.2,a=d<=2.3?1:d>=3?0:(3-d)/.7;
        if(k!==L.k&&(Math.abs(k-L.k)>.03||k===0||k===1)){L.k=k;
          if(!L.ms){const seen=new Set();L.ms=[];L.th.traverse(x=>{const mm=x.material;if(mm&&mm.color&&!seen.has(mm)){seen.add(mm);L.ms.push([mm,mm.color.clone()])}})}
          L.ms.forEach(([mm,c0])=>{mm.color.copy(c0).lerp(LOD_DARK,k)});if(L.pp){const v=1-k*.94;L.pp.material.color.setRGB(v,v,v)}}
        if(a!==L.a&&(Math.abs(a-L.a)>.03||a===0||a===1)){L.a=a;L.pl.material.opacity=a;L.pl.visible=a>.01}}}
    const INS={on:false,id:null,S:null,cam:null,hold:null,yaw:0,pitch:0,t0:0};
    const OBJM={};opt.objs.forEach(o=>{OBJM[o.id]=o});
    /* оборот: то, чего нет в подписи. Своё поле o.back важнее; иначе — инвентарный номер, след на вещи по её роду и куда она возвращается */
    function insBackLines(o){if(typeof o.back==="string"&&o.back.trim())return o.back.trim().split(/\n+/).slice(0,7);
      const nm=String(o.name||"").toLowerCase();let h=0;for(const ch of String(o.id||o.name))h=(h*31+ch.charCodeAt(0))>>>0;
      const L=["инв. "+String(o.h||"").toUpperCase()+"-"+(o.n||0)+"/"+(h%900+100)];
      if(/печень|oreo|бутыл|банк|упаков|пакет|короб|чек|билет|этикет|таблет|лекарств|доставк/.test(nm))L.push("цена: "+(h%380+39)+",90","штрихкод наполовину стёрт");
      else if(/круж|чашк|стакан|тарел|блюд|бокал|ваз/.test(nm))L.push("скол на ободке","донышко в мелких царапинах");
      else if(/тетрад|письм|записк|книг|блокнот|фото|снимок|открытк|распечат|лист|конверт|афиш|каталог/.test(nm))L.push("на обороте карандашом — дата, без года","угол загнут");
      else if(/одеял|рубашк|халат|шарф|куртк|бель|носок|кофт|плать|футболк|плед/.test(nm))L.push("ярлык срезан","нитка у шва другого цвета");
      else if(/телефон|ноутбук|наушник|заряд|станц|экран|кабел|датчик|клавиат|камер/.test(nm))L.push("царапина у разъёма","наклейка снята, след остался");
      else if(/ключ|замок|часы|очки|ручк|ножниц|отвёрт|отверт|ложк|вилк|нож/.test(nm))L.push("потёрто там, где держат");
      else if(/ракушк|камен|ветк|лист[ьо]|шишк/.test(nm))L.push("песок в завитке","подписи не было");
      else L.push("потёртость по нижнему краю");
      if(o.ret)L.push("возвращается: "+String(o.ret).replace(/\s+/g," ").slice(0,150));
      return L}
    function insCanvas(lines,head,bg){const c=document.createElement("canvas");c.width=736;c.height=552;const g=c.getContext("2d");g.fillStyle=bg||"#EDE6D6";g.fillRect(0,0,736,552);
      g.strokeStyle="rgba(40,36,30,.22)";g.lineWidth=2;g.strokeRect(18,18,700,516);let y=74;
      if(head){g.fillStyle="#7A7062";g.font="500 22px ui-monospace,Menlo,monospace";g.fillText(head,44,y);y+=46}
      g.fillStyle="#26221C";lines.forEach((ln,i)=>{g.font=(i===0&&!head?"600 30px":"400 28px")+" Georgia,serif";let cur="";String(ln).split(" ").forEach(w=>{const t=cur?cur+" "+w:w;if(g.measureText(t).width>640&&cur){if(y<510)g.fillText(cur,44,y);y+=38;cur=w}else cur=t});if(cur&&y<510)g.fillText(cur,44,y);y+=50});
      return c}
    function insOpen(src){const o=OBJM[src.userData.id];if(!o||WORLD)return false;
      if(!INS.S){INS.S=new T.Scene();INS.cam=new T.PerspectiveCamera(32,cam.aspect,.05,12);INS.S.add(new T.HemisphereLight(0xFFFFFF,0x5A544C,1.05));const dl=new T.DirectionalLight(0xFFFFFF,.75);dl.position.set(.6,1,.9);INS.S.add(dl);
        const dim=new T.Mesh(new T.PlaneGeometry(9,9),new T.MeshBasicMaterial({color:0x07080A,transparent:true,opacity:.64,depthWrite:false}));dim.position.z=-3;INS.S.add(dim)}
      insDrop();const hold=new T.Group();hold.position.set(0,0,-1.08);
      const edge=new T.MeshLambertMaterial({color:0xD9D1C0}),backT=new T.CanvasTexture(insCanvas(insBackLines(o),"оборот"));
      const pu=opt.photo&&opt.photo(o.id);let front,bw=.46,bh=.345,bz=0;
      if(pu){const tx=new T.TextureLoader().load(pu);if(T.sRGBEncoding)tx.encoding=T.sRGBEncoding;front=new T.MeshBasicMaterial({map:tx})}
      else{front=new T.MeshBasicMaterial({map:new T.CanvasTexture(insCanvas([o.name],"",null))});
        const th=thing(o),bb=new T.Box3().setFromObject(th),sz=bb.getSize(new T.Vector3()),ct=bb.getCenter(new T.Vector3()),sc=.2/Math.max(sz.x,sz.y,sz.z,.05);
        th.scale.setScalar(sc);th.position.set(-ct.x*sc,-ct.y*sc,-ct.z*sc+.02);hold.add(th);bw=.34;bh=.255;bz=-(sz.z*sc/2+.07)}
      const bd=new T.Mesh(new T.BoxGeometry(bw,bh,.008),[edge,edge,edge,edge,front,new T.MeshBasicMaterial({map:backT})]);bd.position.z=bz;hold.add(bd);
      INS.S.add(hold);INS.hold=hold;INS.on=true;INS.id=o.id;INS.yaw=pu?0:.5;INS.pitch=pu?0:.12;INS.t0=performance.now();wrap.classList.add("mz-insp");
      const touch=coarse.matches;nearEl.hidden=false;nearEl.textContent="В руках: "+(o.name.length>40?o.name.slice(0,38)+"…":o.name)+(touch?" · ведите пальцем — повернуть · «смотреть» — запись · касание — вернуть":" · тяните мышью или ←/→ — повернуть · E — запись · Esc — вернуть");
      return true}
    function insDrop(){if(!INS.hold)return;INS.S.remove(INS.hold);INS.hold.traverse(x=>{if(x.geometry)x.geometry.dispose();const mm=x.material;(Array.isArray(mm)?mm:mm?[mm]:[]).forEach(q=>{if(q.map)q.map.dispose();q.dispose()})});INS.hold=null}
    function insClose(){if(!INS.on)return;INS.on=false;INS.id=null;insDrop();wrap.classList.remove("mz-insp");nearEl.hidden=true;nearObj=null;frame._t=null}
    function insCard(){const id=INS.id;insClose();if(id&&opt.onObj)opt.onObj(id)}
    function insTurn(dx,dy){INS.yaw+=dx*.009;INS.pitch=Math.max(-.75,Math.min(.75,INS.pitch+dy*.007))}
    function insStep(){if(joy&&Math.abs(joy.dx)+Math.abs(joy.dy)>.25){insClose();return}const k=Math.min(1,(performance.now()-INS.t0)/220),e=1-Math.pow(1-k,3);INS.hold.rotation.set(INS.pitch,INS.yaw,0);INS.hold.scale.setScalar(.72+.28*e);
      if(INS.cam.aspect!==cam.aspect){INS.cam.aspect=cam.aspect;INS.cam.updateProjectionMatrix()}INS.cam.fov=cam.aspect<.8?46:32;INS.cam.updateProjectionMatrix()}
    stopFns.push(()=>{insDrop();INS.on=false});
    /* ---------- этап 20: взять вещь в руку (T): фигура держит её перед собой, в виде от первого лица вещь видна внизу справа; T ещё раз — положить на место ---------- */
    const HOLD={on:false,id:"",g:null,fp:null,S:null,cam:null,lod:null,restore:null};
    function holdMake(id){let g=null;if(id.slice(0,5)==="prop:"){g=new T.Group();g.add(new T.Mesh(new T.CylinderGeometry(.04,.035,.13,16),new T.MeshLambertMaterial({color:parseInt(id.slice(5),16)||0xDCE8EE})))}else if(id.slice(0,5)==="book:"){g=new T.Group();const c=parseInt(id.slice(5),16)||0x6B2A22;const b=new T.Mesh(new T.BoxGeometry(.05,.21,.15),new T.MeshLambertMaterial({color:c})),pg=new T.Mesh(new T.BoxGeometry(.04,.19,.145),new T.MeshLambertMaterial({color:0xE9E0CC}));pg.position.set(.004,0,.004);g.add(b);g.add(pg)}
      else{const o=OBJM[id];if(!o)return null;const th=thing(o),bb=new T.Box3().setFromObject(th),sz=bb.getSize(new T.Vector3()),ct=bb.getCenter(new T.Vector3()),sc=Math.min(1,.24/Math.max(sz.x,sz.y,sz.z,.05));th.scale.setScalar(sc);th.position.set(-ct.x*sc,-ct.y*sc,-ct.z*sc);g=new T.Group();g.add(th)}
      return g}
    /* мелкая вещь обстановки (стакан, бутылка, книга на полке…): то, на что смотрит точка, не больше полуметра. Берётся вместе с соседними частями; на месте исчезает, T возвращает */
    const prRay=new T.Raycaster(),prV=new T.Vector2(),prS=new T.Vector3(),prP=new T.Vector3(),prQ=new T.Quaternion();
    function propTake(){const list=((PROPS&&PROPS.meshes)||[]).filter(me=>me.visible&&me.userData.items);if(!list.length)return null;prV.set(0,0);prRay.layers.enableAll();prRay.setFromCamera(prV,cam);prRay.far=C.d+2.6;const hs_=prRay.intersectObjects(list,false).slice(0,5);let h=null,hit=null;
      const small=it=>{if(it.geo===PROPS.G.plane||it.v0==null||it.taken)return false;it.m.decompose(prP,prQ,prS);return Math.max(Math.abs(prS.x),Math.abs(prS.y),Math.abs(prS.z))<=.8};
      /* ближайшая мелкая вещь на луче: крупное (стол, полка) луч проходит насквозь */
      for(const x of hs_){if(!x.face)continue;const vi=x.face.a,it=x.object.userData.items.find(it=>it.v0!=null&&vi>=it.v0&&vi<it.v0+it.vn);if(it&&small(it)){h=x;hit=it;break}}
      if(!hit)return null;const items=h.object.userData.items;hit.m.decompose(prP,prQ,prS);const c0=prP.clone();
      const cl=items.filter(it=>small(it)&&Math.hypot(prP.x-c0.x,prP.z-c0.z)<.2&&Math.abs(prP.y-c0.y)<.42).slice(0,14);
      const pos=h.object.geometry.attributes.position,save=[],g=new T.Group(),inv=new T.Matrix4().makeTranslation(-c0.x,-c0.y,-c0.z),glass=!!h.object.material.transparent;let ext=.05;
      cl.forEach(it=>{it.taken=true;save.push([it,pos.array.slice(it.v0*3,(it.v0+it.vn)*3)]);for(let i=it.v0;i<it.v0+it.vn;i++)pos.setXYZ(i,c0.x,-50,c0.z);
        const me=new T.Mesh(it.geo,new T.MeshLambertMaterial({color:it.c.getHex(),transparent:glass,opacity:glass?.55:1}));me.matrixAutoUpdate=false;me.matrix.copy(inv).multiply(it.m);g.add(me);
        it.m.decompose(prP,prQ,prS);ext=Math.max(ext,Math.abs(prS.x),Math.abs(prS.y),Math.abs(prS.z),Math.abs(prP.y-c0.y)*2)});
      pos.needsUpdate=true;g.scale.setScalar(Math.min(1,.3/ext));const w=new T.Group();w.userData.shared=true;w.add(g);
      return {group:w,color:hit.c.getHex(),restore(){save.forEach(([it,a])=>{pos.array.set(a,it.v0*3);it.taken=false});pos.needsUpdate=true}}}
    function holdAttach(fig,g){g.position.set(0,-.6,.1);g.rotation.set(-1.15,0,0);fig.armR.add(g)}
    function holdFree(g){if(!g)return;if(g.parent)g.parent.remove(g);const sh=!!g.userData.shared;g.traverse(x=>{if(x.geometry&&!sh)x.geometry.dispose();const mm=x.material;(Array.isArray(mm)?mm:mm?[mm]:[]).forEach(q=>q.dispose())})}
    function holdPut(){if(!HOLD.on)return;holdFree(HOLD.g);holdFree(HOLD.fp);HOLD.g=HOLD.fp=null;if(HOLD.lod)HOLD.lod.th.visible=true;HOLD.lod=null;if(HOLD.restore){HOLD.restore();HOLD.restore=null}HOLD.on=false;HOLD.id="";P.hd="";snd.cue("chat");frame._t=null}
    function holdToggle(){if(HOLD.on){holdPut();return}let id="",pr=null;
      if(INS.on){id=INS.id;insClose()}else if(!WORLD&&nearObj&&nearObj.userData.id&&OBJM[nearObj.userData.id]){id=nearObj.userData.id;if(BOOKPED[id]!==nearObj){const n_=nearObj,bs_=new T.Box3().setFromObject(n_).getSize(new T.Vector3());/* в руку — то, что в руку помещается: не стена, не башня */
          if(Math.max(bs_.x,bs_.y,bs_.z)>1.7)id=null;else{n_.visible=false;HOLD.restore=()=>{n_.visible=true}}}}
      else if(LB){const b=libPickC();if(b)id="book:"+b.color.toString(16)}
      if(!id){pr=propTake();if(pr)id="prop:"+pr.color.toString(16)}
      if(!id){nearEl.hidden=false;nearEl.textContent=LB?"Наведите точку на том и нажмите T":"Подойдите к вещи или наведите на неё точку и нажмите T";frame._t=null;return}
      const g=pr?pr.group:holdMake(id);if(!g){if(HOLD.restore){HOLD.restore();HOLD.restore=null}return}if(pr)HOLD.restore=pr.restore;HOLD.g=g;HOLD.id=id;HOLD.on=true;P.hd=id;holdAttach(me.userData.fig,g);
      HOLD.lod=LODS.find(L=>L.grp===BOOKPED[id])||null;if(HOLD.lod)HOLD.lod.th.visible=false;
      if(!HOLD.S){HOLD.S=new T.Scene();HOLD.cam=new T.PerspectiveCamera(50,cam.aspect,.05,5);HOLD.S.add(new T.HemisphereLight(0xFFFFFF,0x5A544C,1));const dl=new T.DirectionalLight(0xFFFFFF,.6);dl.position.set(.5,1,.8);HOLD.S.add(dl)}
      HOLD.fp=pr?pr.group.clone():holdMake(id);if(pr)HOLD.fp.userData.shared=true;HOLD.fp.position.set(.22,-.14,-.55);HOLD.fp.rotation.set(.1,-.5,0);HOLD.S.add(HOLD.fp);if(markFound(id))snd.cue("found");else snd.cue("chat")}
    window.__mzSmallProps=()=>{const out=[];((PROPS&&PROPS.meshes)||[]).forEach(me=>{if(!me.visible)return;(me.userData.items||[]).forEach(it=>{if(it.geo===PROPS.G.plane||it.v0==null)return;it.m.decompose(prP,prQ,prS);if(Math.max(Math.abs(prS.x),Math.abs(prS.y),Math.abs(prS.z))<=.3&&Math.min(Math.abs(prS.x),Math.abs(prS.y),Math.abs(prS.z))>=.07&&prP.y>.7&&prP.y<1.3)out.push([+prP.x.toFixed(2),+prP.y.toFixed(2),+prP.z.toFixed(2)])})});return out};
    stopFns.push(()=>{holdFree(HOLD.g);holdFree(HOLD.fp);if(HOLD.lod)HOLD.lod.th.visible=true;if(HOLD.restore)try{HOLD.restore()}catch(e){}});
    function activate(o){if(locked())document.exitPointerLock();pause();if(o.userData.lift){liftOpen();return}if(o.userData.sobj){wOpenObj(o);return}if(o.userData.photo){openPhoto(o.userData.photo);return}if(o.userData.go){snd.cue("chat");const nav=(window.__APP&&window.__APP.go)||window.__goMsgs;if(nav)nav(o.userData.go);return}if(o.userData.id){if(INS.on&&INS.id===o.userData.id){insCard();return}if(markFound(o.userData.id))snd.cue("found");if(opt.onObj)opt.onObj(o.userData.id)}}
    /* кнопки залов */
    /* «База Героев» в полосе залов — сразу после «Квартир», как ответвление */
    /* этап 9: ветка у «Квартир» — «↳ Коридор» и квартиры — тоже ответвления после «Базы» */
    const BRI=HALLZ.map((h,i)=>h.branch&&!(h.room&&h.room.bar===false)?i:-1).filter(i=>i>=0);
    /* этап 13: ветка зала автора — сразу после своего зала */
    const ABI=p=>BRQ.filter(Q=>Q.br.i===p).map(Q=>Q.hi);
    bar.innerHTML=LB?'<button type="button" data-h="0">Библиотека</button>':WORLD?wBar():[0,...BRI.filter(i=>!HALLZ[i].abr),...ABI(0),...HALLZ.slice(1,NH).flatMap((_,i)=>(i+1===BASE_HALL?[i+1,IB,IB2]:[i+1]).concat(ABI(i+1)))].map(i=>{const h=HALLZ[i],bs=i===IB||i===IB2,br=bs||h.branch;
      return `<button type="button" data-h="${i}"${br?` class="mz-branch" title="${bs?"Боковой зал у «Предметов» · "+TN(h.k):h.abr?"Зал автора у зала «"+HN(SPEC[h.par].k)+"» · "+HN(h.k):"Боковая ветка у «Квартир» · "+HN(h.k)}"`:""}>${br?"↳ ":""}${h.branch?h.short:bs?BASE_T[h.k][1]:HN(h.k)}</button>`}).join("");
    function goHall(i){const hz=HALLZ[i];if(!hz)return;const sd=!!hz.side,sp=hz.spawn;P.x=sp?sp.x:sd?BASE.x0+1.2:0;P.z=sp?sp.z:sd?BASE.DZ:hz.z0-2.2;P.yaw=sp?sp.yaw:sd?-Math.PI/2:0;P.y=0;C.yaw=P.yaw;C.pitch=clampPitch(-.2);V.x=V.z=V.vy=0;V.ground=true;target=null;piv.set(P.x,1.55,P.z);try{canvas.focus({preventScroll:true})}catch(e){}}
    bar.querySelectorAll("button").forEach(b=>b.onclick=()=>goHall(+b.dataset.h));

    let nearObj=null,lastHall=-1,last=performance.now();
    /* своя фигура */
    let me=figure(0x3F7F8E,curLook());me.position.set(P.x,0,P.z);S.add(me);P.k=lookStr(curLook());
    /* смена облика (панель «персонаж»): фигура пересобирается на месте, облик уходит в присутствие (поле k) */
    onLook=L=>{if(stopped)return;const old=me;me=figure(0x3F7F8E,L);me.position.copy(old.position);me.rotation.y=old.rotation.y;S.remove(old);old.userData.fig.mats.forEach(m=>m.dispose());S.add(me);P.k=lookStr(L);canvas.__mz.me=me};
    const piv=new T.Vector3(P.x,1.55,P.z),pivT=new T.Vector3(),back=new T.Vector3(),cray=new T.Raycaster();
    canvas.__mz={P,C,V,me,get near(){return nearObj},get fp(){return fpMode()}};
    /* другие посетители: та же фигура своего цвета, имя, реплика */
    const AV={};
    const nameTex=n=>new T.CanvasTexture(textCanvas(n,"",{w:512,h:96,ts:44,pad:22,bg:"#141619",fg:"#E9EDF0",font:"Golos Text, sans-serif"}));
    function avatar(p){const lk=lookParse(p.k),g=figure(p.color,lk);g.userData.k=lk?p.k:"";
      const lab=new T.Sprite(new T.SpriteMaterial({map:nameTex(p.name),depthTest:false}));lab.scale.set(.9,.17,1);lab.position.y=1.95;g.add(lab);
      Object.assign(g.userData,{name:p.name,lab,sayT:"",sayAt:0,spd:0});S.add(g);return g}
    /* ---------- этап 7: реплики над головой. Последняя фраза посетителя из чата зала висит над его фигурой 30 с от момента, когда сказана
       (время сообщения — из live.js), последнюю секунду гаснет; новая заменяет старую и запускает отсчёт заново. Своя фраза — над своей фигурой
       в виде из-за спины. Пузырь всегда к камере, не туманится, сидит над именем; рисуется не больше 12 ближайших. Текстура холста делается
       только при смене текста и освобождается, когда реплика истекла или посетитель ушёл. Двойники пузырей не получают ---------- */
    const SAY_MS=30000,BUB_MAX=12,BUB_PX=.0028,BUB_Y=2.12;const BUB={};
    function bubCanvas(txt){let s_=String(txt).replace(/\s+/g," ").trim();if(s_.length>120){let k=s_.lastIndexOf(" ",119);if(k<90)k=119;s_=s_.slice(0,k).replace(/[\s,.;:—-]+$/,"")+"…"}
      const MW=620,pad=20,lh=36,font='500 29px "Golos Text", system-ui, sans-serif',c=document.createElement("canvas"),g=c.getContext("2d");g.font=font;
      const fits=t=>g.measureText(t).width<=MW;const lines=[];let cur="";
      s_.split(" ").forEach(w=>{const t=cur?cur+" "+w:w;if(fits(t)){cur=t;return}if(cur)lines.push(cur);cur=w;while(!fits(cur)){let k=cur.length-1;while(k>1&&!fits(cur.slice(0,k)))k--;lines.push(cur.slice(0,k));cur=cur.slice(k)}});
      if(cur)lines.push(cur);if(lines.length>3){lines.length=3;let l=lines[2].replace(/…$/,"");while(l&&!fits(l+"…"))l=l.slice(0,l.lastIndexOf(" ")>8?l.lastIndexOf(" "):l.length-1);lines[2]=l.replace(/[\s,.;:—-]+$/,"")+"…"}
      const tw=Math.max(...lines.map(l=>g.measureText(l).width)),tail=14,w=Math.ceil(Math.max(96,tw+pad*2))+4,h=lines.length*lh+pad*2-6+tail+4;
      c.width=w;c.height=h;g.font=font;const r=18,x0=2,y0=2,x1=w-2,y1=h-tail-2;
      g.beginPath();g.moveTo(x0+r,y0);g.arcTo(x1,y0,x1,y1,r);g.arcTo(x1,y1,x0,y1,r);g.lineTo(w/2+12,y1);g.lineTo(w/2,h-2);g.lineTo(w/2-12,y1);g.arcTo(x0,y1,x0,y0,r);g.arcTo(x0,y0,x1,y0,r);g.closePath();
      g.fillStyle="#FFFFFF";g.fill();g.lineWidth=2;g.strokeStyle="rgba(20,22,25,.35)";g.stroke();
      g.fillStyle="#16191D";g.textBaseline="alphabetic";lines.forEach((l,i)=>g.fillText(l,pad+2,pad+2+i*lh+27));
      return {c,w,h,lines,shown:lines.join(" ")}}
    function bubDrop(id){const b=BUB[id];if(!b)return;S.remove(b.spr);b.spr.material.map.dispose();b.spr.material.dispose();delete BUB[id]}
    function bubSet(id,txt,at){let b=BUB[id];const key=txt+"\u0001"+at;if(b&&b.key===key)return b;if(b)bubDrop(id);
      const bc=bubCanvas(txt),tx=new T.CanvasTexture(bc.c);tx.minFilter=T.LinearFilter;tx.generateMipmaps=false;if(T.sRGBEncoding)tx.encoding=T.sRGBEncoding;
      const spr=new T.Sprite(new T.SpriteMaterial({map:tx,fog:false,transparent:true,depthWrite:false,toneMapped:false}));spr.center.set(.5,0);spr.renderOrder=6;spr.userData.bub=id;S.add(spr);
      b=BUB[id]={spr,key,at,w:bc.w*BUB_PX,h:bc.h*BUB_PX,text:bc.shown,lines:bc.lines.length};return b}
    const bubV=new T.Vector3();
    function stepBubbles(fp){const now=Date.now(),want=[];
      Object.keys(AV).forEach(id=>{const a=AV[id],sy=a.userData.sayT,at=a.userData.sayAt;if(sy&&now-at<SAY_MS)want.push({id,g:a,text:sy,at})});
      const own=opt.multi&&opt.multi.mine?opt.multi.mine():null;if(own&&own.text&&!fp&&me.visible&&now-own.at<SAY_MS)want.push({id:"__me",g:me,text:own.text,at:own.at});
      want.forEach(w=>{w.d=cam.position.distanceTo(bubV.set(w.g.position.x,w.g.position.y+BUB_Y,w.g.position.z))});want.sort((a,b)=>a.d-b.d);
      const draw=new Set(want.slice(0,BUB_MAX).filter(w=>w.d<40).map(w=>w.id));
      /* истёкшие, ушедшие и вытесненные — убрать (текстура освобождается) */
      Object.keys(BUB).forEach(id=>{if(!draw.has(id))bubDrop(id)});
      /* размер: строка ≈17 css-пикселей на экране от ~3 до ~12 м (ближе — не крупнее, дальше — мельче) */
      const tanH=Math.tan(cam.fov*Math.PI/360),ch=Math.max(200,canvas.clientHeight||600);
      want.forEach(w=>{if(!draw.has(w.id))return;const b=bubSet(w.id,w.text,w.at),k=Math.max(.6,Math.min(4,17*(2*w.d*tanH/ch)/(36*BUB_PX))),age=now-w.at;
        b.spr.position.set(w.g.position.x,w.g.position.y+BUB_Y,w.g.position.z);b.spr.scale.set(b.w*k,b.h*k,1);b.spr.material.opacity=Math.max(0,Math.min(1,(SAY_MS-age)/1000))})}
    stopFns.push(()=>Object.keys(BUB).forEach(bubDrop));
    /* ---------- этап 11: голос. Кнопка-микрофон рядом с видом камеры, M — то же; по умолчанию выключен; только для вошедших.
       Движок — live.js (WebRTC, сигналинг через канал присутствия); здесь — кнопка, строка состояния, раз в 200 мс положение и соседи, «говорит» над фигурой ---------- */
    const VO=opt.multi&&opt.multi.voice||null;let micB=null,vNote=null,vNoteT=0,vStepT=0;
    (function(){const ctl=hud.querySelector(".mz-ctl"),vw=hud.querySelector(".mz-view");if(!ctl||!vw)return;
      micB=document.createElement("button");micB.type="button";micB.className="mz-mic";micB.setAttribute("aria-pressed","false");
      micB.innerHTML='<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5.5" y="1.5" width="5" height="8.5" rx="2.5" fill="currentColor"/><path d="M3 7.5a5 5 0 0 0 10 0M8 12.5V15" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><span class="mz-lf">микрофон</span><span class="mz-ls">голос</span>';
      const pad=hud.querySelector(".mz-pad");const put=()=>{if(coarse.matches&&pad)pad.appendChild(micB);else vw.after(micB)};put();on(coarse,"change",put);
      vNote=document.createElement("div");vNote.className="mz-vnote";vNote.setAttribute("role","status");vNote.setAttribute("aria-live","polite");vNote.hidden=true;ctl.appendChild(vNote);
      on(micB,"click",()=>micToggle());micSync()})();
    function micSync(){if(!micB)return;const v=!!(VO&&VO.on),can=!!(VO&&VO.can());micB.setAttribute("aria-pressed",String(v));
      micB.setAttribute("aria-label",v?"Микрофон включён: выключить (M)":can?"Микрофон выключен: включить (M)":"Микрофон: войдите, чтобы говорить");micB.title=can||v?"Микрофон (M)":"Войдите, чтобы говорить"}
    function vSay(t,ms){if(!vNote)return;vNote.textContent=t||"";vNote.hidden=!t;vNoteT=t&&ms?performance.now()+ms:0}
    async function micToggle(){if(!VO){vSay("Войдите, чтобы говорить.",4000);return}const r=await VO.toggle();micSync();vSay(r.msg,r.on?3500:5000)}
    function voiceStep(now,hi){if(!VO)return;if(vNoteT&&now>vNoteT){vNoteT=0;vSay("")}if(!VO.on||now-vStepT<200)return;vStepT=now;
      VO.step({x:P.x,z:P.z,yaw:C.yaw,hall:String(window.__curHall||""),w:WORLD?WID:""},PEERS);if(!vNoteT){const n=VO.note;if(n!==(vNote&&vNote.textContent))vSay(n)}}
    stopFns.push(()=>{if(micB)micB.remove();if(vNote)vNote.remove()});
    function peersStep(dt,hi,t){const hz=HALLZ[hi];window.__curHall=WORLD?hz.wid:HN(hz.k);window.__curHallName=HN(hz.k);if(WORLD)opt.multi.tick(P,window.__curHall,{w:WID,hn:window.__curHallName});else opt.multi.tick(P,window.__curHall);
      const list=PEERS=wPeers(hi),seen=new Set();
      list.forEach(p=>{seen.add(p.id);let a=AV[p.id];
        /* облик посетителя (поле k) сменился — фигура пересобирается там же; неверный облик — прежняя фигура по цвету */
        if(a&&a.userData.k!==(lookParse(p.k)?p.k:"")){const ps=a.position.clone(),ry=a.rotation.y,sT=a.userData.sayT,sA=a.userData.sayAt;S.remove(a);a.userData.fig.mats.forEach(m=>m.dispose());a.userData.lab.material.map.dispose();a.userData.lab.material.dispose();a=AV[p.id]=avatar(p);a.position.copy(ps);a.rotation.y=ry;a.userData.sayT=sT;a.userData.sayAt=sA}
        if(!a){a=AV[p.id]=avatar(p);a.position.set(p.x,0,p.z);a.rotation.y=p.yaw||0}
        const pn=VO&&VO.on&&VO.speaking(p.id)?p.name+" · говорит":p.name;
        if(a.userData.name!==pn){a.userData.name=pn;a.userData.lab.material.map.dispose();a.userData.lab.material.map=nameTex(pn);a.userData.lab.material.needsUpdate=true}
        const k=Math.min(1,dt*8),ox=a.position.x,oz=a.position.z;a.position.x+=(p.x-a.position.x)*k;a.position.z+=(p.z-a.position.z)*k;a.position.y+=((gOk(p.g)==="sit"&&p.sy>0?Math.min(1.05,p.sy):0)-a.position.y)*k;a.rotation.y+=angDiff(a.rotation.y,p.yaw||0)*k;
        const sp=dt>0?Math.hypot(a.position.x-ox,a.position.z-oz)/dt:0;a.userData.spd+=(Math.min(6,sp)-a.userData.spd)*Math.min(1,dt*6);animFig(a,dt,a.userData.spd,false,t);poseFig(a,dt,gOk(p.g),t);a.userData.g=gOk(p.g);
        {const hd=typeof p.hd==="string"?p.hd:"",u_=a.userData;if(u_.hd!==hd){holdFree(u_.hg);u_.hg=hd?holdMake(hd):null;u_.hd=hd}if(u_.hg){if(u_.hg.parent!==u_.fig.armR)holdAttach(u_.fig,u_.hg);u_.fig.armR.rotation.x=1.15}}
        /* реплика: старый live.js не передаёт sayAt — тогда отсчёт идёт с момента, когда фраза впервые пришла */
        if(p.say!==a.userData.sayT||(p.sayAt&&p.sayAt!==a.userData.sayAt)){a.userData.sayT=p.say||"";a.userData.sayAt=+p.sayAt||Date.now()}});
      Object.keys(AV).forEach(id=>{if(!seen.has(id)){S.remove(AV[id]);AV[id].userData.fig.mats.forEach(m=>m.dispose());const lb=AV[id].userData.lab;lb.material.map.dispose();lb.material.dispose();delete AV[id];bubDrop(id)}})}

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
      const AW=1024,AH=4096,U=128;/* этап 10: атлас вырос до 4096 px (ряды 16…23 — вторая квартира и две арены «Базы») *//* этап 6: атлас вырос вниз на три ряда — ячейки «Базы Героев»; этап 9: ещё на четыре — коридор и квартира */
      /* атлас: ячейки [кол, ряд, ширина, высота] в единицах по 128 px */
      const CELL={winMarch:[0,0,2,2],winDay:[2,0,2,2],clock:[4,0,1,1],drawing:[4,1,1,1],schema1:[5,0,3,2],schema2:[0,2,2,2],call:[2,2,3,2],
        term:[5,2,2,1],chess:[7,2,1,1],schedule:[5,3,1,1],sheet:[6,3,1,1],card:[7,3,1,1],photos:[0,4,4,1],prints:[4,4,4,1],contact:[0,5,2,1],
        lKitchen:[2,5,1,1],lDacha:[3,5,1,1],lTop:[4,5,1,1],lCash:[5,5,2,1],l96:[7,5,1,1],lNotice:[0,6,2,1],glow:[2,6,1,1],nums:[0,7,8,1],
        sign:[0,8,4,1],splash:[4,8,2,2],emblem:[6,8,1,1],hexstar:[7,8,1,1],cloth:[0,9,4,2],target:[6,9,1,1],warn:[7,9,1,1],hazard:[4,10,2,1],darts:[6,10,2,1],screen:[0,11,2,1],soft:[2,11,1,1],
        ftitle:[0,12,3,1],walnut:[3,12,2,1],teak:[5,12,2,1],conc:[7,12,1,1],vase:[3,13,1,1],oven:[4,13,1,1],mat:[5,13,2,1],fab:[7,13,1,1],aptn:[0,14,6,1],soon:[6,14,2,1],csign:[0,15,4,1],kvsign:[4,15,4,1],
        ftitles:[0,16,6,2],night:[6,16,2,3],oakw:[0,18,2,1],glassG:[2,18,2,1],ovenB:[4,18,1,1],tray:[5,18,1,1],books:[0,19,4,1],ledglow:[4,19,1,1],
        ars:[0,20,4,1],arsF:[4,20,4,1],info:[0,21,3,2],peg:[3,21,2,2],labA:[5,21,3,1],exitS:[5,22,2,1],monO:[0,23,2,1],shutter:[2,23,2,2],towA:[4,23,1,2],towB:[5,23,1,2]};
      const atlas=cnv(AW,AH,(g)=>{g.fillStyle="#808080";g.fillRect(0,0,AW,AH);
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
        /* этап 6, «База Героев»: вывеска простым жирным шрифтом; абстрактный плакат-брызги без надписей; звезда в круге;
           маркеры-шестиугольники со звездой и круглые мишени (белые — цвет даёт материал); лента «осторожно»; скатерть с геометрией;
           дротики в ящиках сверху; тёмный экран; мягкое пятно для подсветки ниши */
        R("sign",(w,h)=>{g.fillStyle="#13254F";g.fillRect(0,0,w,h);g.fillStyle="#F08A24";g.fillRect(0,h-12,w,12);g.fillStyle="#FFFFFF";g.textAlign="center";g.textBaseline="middle";g.font="800 66px Golos Text, Arial, sans-serif";g.fillText("База Героев",w/2,h/2-4)});
        R("splash",(w,h)=>{g.fillStyle="#1D3E9C";g.fillRect(0,0,w,h);const bl=(x,y,r,c,a)=>{g.globalAlpha=a;g.fillStyle=c;g.beginPath();for(let i=0;i<=24;i++){const t=i/24*Math.PI*2,rr=r*(.7+.5*rnd());g.lineTo(x+Math.cos(t)*rr,y+Math.sin(t)*rr)}g.fill();g.globalAlpha=1};
          for(let i=0;i<14;i++)bl(rnd()*w,rnd()*h,20+rnd()*60,["#2E63D9","#0F2A70","#4C86F0"][i%3],.6);for(let i=0;i<9;i++)bl(w*(.45+rnd()*.6),h*(.2+rnd()*.8),16+rnd()*46,["#F07A1E","#FF9A3C","#E0601A"][i%3],.85);
          for(let i=0;i<120;i++){g.fillStyle=rnd()<.5?"#F5F7FA":"#FF8A2A";g.globalAlpha=.7;g.beginPath();g.arc(rnd()*w,rnd()*h,1+rnd()*3.5,0,7);g.fill()}g.globalAlpha=1;
          g.strokeStyle="#F5F7FA";g.lineWidth=10;g.beginPath();g.moveTo(10,h*.78);g.lineTo(w-16,h*.62);g.stroke();noise(g,w,h,14)});
        const star=(cx,cy,R1,R2)=>{g.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?R2:R1;g.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}g.closePath()};
        R("emblem",(w,h)=>{g.clearRect(0,0,w,h);g.fillStyle="#B7BDC3";g.fillRect(0,0,w,h);g.fillStyle="#F4F6F8";g.beginPath();g.arc(64,64,60,0,7);g.fill();g.fillStyle="#2445B5";g.beginPath();g.arc(64,64,52,0,7);g.fill();g.fillStyle="#E8642A";star(64,66,40,17);g.fill()});
        R("hexstar",(w,h)=>{g.fillStyle="#000";g.fillRect(0,0,w,h);const hx=r=>{g.beginPath();for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;g.lineTo(64+Math.cos(a)*r,64+Math.sin(a)*r)}g.closePath()};g.strokeStyle="#FFF";g.lineWidth=9;hx(54);g.stroke();g.lineWidth=3;hx(40);g.stroke();g.fillStyle="#FFF";star(64,67,30,13);g.fill()});
        R("target",(w,h)=>{g.fillStyle="#000";g.fillRect(0,0,w,h);const gr=g.createRadialGradient(64,64,10,64,64,62);gr.addColorStop(0,"rgba(255,255,255,0)");gr.addColorStop(.55,"rgba(255,255,255,.95)");gr.addColorStop(.8,"rgba(255,255,255,.7)");gr.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=gr;g.beginPath();g.arc(64,64,62,0,7);g.fill();g.fillStyle="#111";g.beginPath();g.arc(64,64,12,0,7);g.fill()});
        R("warn",(w,h)=>{g.fillStyle="#C9CCCF";g.fillRect(0,0,w,h);g.fillStyle="#F2C21B";g.beginPath();g.moveTo(64,14);g.lineTo(116,110);g.lineTo(12,110);g.closePath();g.fill();g.strokeStyle="#111";g.lineWidth=6;g.stroke();g.fillStyle="#111";g.fillRect(60,46,8,36);g.fillRect(60,90,8,8)});
        R("hazard",(w,h)=>{g.fillStyle="#F2C21B";g.fillRect(0,0,w,h);g.fillStyle="#141414";for(let x=-h;x<w+h;x+=48){g.beginPath();g.moveTo(x,h);g.lineTo(x+24,h);g.lineTo(x+24+h,0);g.lineTo(x+h,0);g.closePath();g.fill()}});
        R("cloth",(w,h)=>{const C=["#1E4FC2","#F2B21E","#E2452C","#2BA36B","#7A3FC9","#18A9D6","#F4F1EA"];const s=48;for(let r=0;r<h/s+1;r++)for(let c=0;c<w/s+1;c++){const x=c*s,y=r*s;
            g.fillStyle=C[(r*3+c*5)%C.length];g.beginPath();g.moveTo(x,y);g.lineTo(x+s,y);g.lineTo(x,y+s);g.fill();g.fillStyle=C[(r*5+c*2+3)%C.length];g.beginPath();g.moveTo(x+s,y);g.lineTo(x+s,y+s);g.lineTo(x,y+s);g.fill();
            if((r+c)%3===0){g.fillStyle="#F4F1EA";g.beginPath();g.arc(x+s/2,y+s/2,7,0,7);g.fill()}}g.strokeStyle="rgba(0,0,0,.25)";g.lineWidth=2;for(let x=0;x<w;x+=s*2){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke()}});
        R("darts",(w,h)=>{[[0,"#2F5FE0","#1A3A9A"],[128,"#F0742A","#C6531A"]].forEach(([x0,c1,c2])=>{g.fillStyle="#1C1D20";g.fillRect(x0,0,128,h);for(let i=0;i<70;i++){const x=x0+8+rnd()*112,y=8+rnd()*112,a=rnd()*Math.PI;g.save();g.translate(x,y);g.rotate(a);g.fillStyle=rnd()<.5?c1:c2;g.fillRect(-14,-3.5,28,7);g.fillStyle="#E8E8E8";g.fillRect(12,-3.5,5,7);g.restore()}})});
        R("screen",(w,h)=>{const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,"#1A1F27");gr.addColorStop(.55,"#0B0D11");gr.addColorStop(1,"#151A21");g.fillStyle=gr;g.fillRect(0,0,w,h);g.fillStyle="rgba(255,255,255,.06)";g.beginPath();g.moveTo(30,0);g.lineTo(110,0);g.lineTo(40,h);g.lineTo(0,h);g.fill()});
        R("soft",(w,h)=>{g.fillStyle="#000";g.fillRect(0,0,w,h);const gr=g.createRadialGradient(64,64,2,64,64,62);gr.addColorStop(0,"#FFFFFF");gr.addColorStop(.45,"rgba(255,255,255,.45)");gr.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=gr;g.fillRect(0,0,w,h)});
        /* этап 9: табличка с названием квартиры у её двери (первая открытая квартира с названием; номер — отдельной латунной табличкой) */
        R("ftitle",(w,h)=>{const f=FL.find(q=>q.title&&(q.rooms||[]).length);g.fillStyle="#2A2622";g.fillRect(0,0,w,h);g.fillStyle="#C9A75A";g.fillRect(8,8,w-16,h-16);g.fillStyle="#2A2622";
          let fs=58;g.font=`600 ${fs}px Golos Text, sans-serif`;const t=f?String(f.title):"";while(fs>24&&g.measureText(t).width>w-40){fs-=2;g.font=`600 ${fs}px Golos Text, sans-serif`}g.textAlign="center";g.textBaseline="middle";g.fillText(t,w/2,h/2+2)});
        /* шпон ореха (верхние шкафы, колонна), тик комода, серый «бетон» фартука, ваза с чешуёй, стекло духовки, коврик, рогожка обивки */
        const grain=(w,h,base,dk,n)=>{g.fillStyle=base;g.fillRect(0,0,w,h);for(let i=0;i<n;i++){const y=rnd()*h;g.strokeStyle=`rgba(${dk},${.1+rnd()*.18})`;g.lineWidth=.8+rnd()*1.6;g.beginPath();g.moveTo(0,y);
          g.bezierCurveTo(w*.3,y+(rnd()-.5)*10,w*.7,y+(rnd()-.5)*10,w,y+(rnd()-.5)*6);g.stroke()}noise(g,w,h,8)};
        R("walnut",(w,h)=>grain(w,h,"#7A5438","40,22,10",60));R("teak",(w,h)=>grain(w,h,"#A9643A","70,30,10",70));
        R("conc",(w,h)=>{g.fillStyle="#B4B2AD";g.fillRect(0,0,w,h);for(let i=0;i<30;i++){g.fillStyle=`rgba(${rnd()<.5?255:60},${rnd()<.5?255:60},${rnd()<.5?255:60},.05)`;g.beginPath();g.arc(rnd()*w,rnd()*h,4+rnd()*20,0,7);g.fill()}noise(g,w,h,14)});
        R("vase",(w,h)=>{g.fillStyle="#9EA4A0";g.fillRect(0,0,w,h);g.strokeStyle="#DCDFDA";g.lineWidth=3;for(let r=0;r<9;r++)for(let c=0;c<7;c++){const x=c*19+(r%2)*9.5,y=r*15;g.beginPath();g.arc(x,y,9,0,Math.PI);g.stroke()}});
        R("oven",(w,h)=>{g.fillStyle="#0C0D0F";g.fillRect(0,0,w,h);g.fillStyle="#1B1D21";g.fillRect(8,30,w-16,h-40);g.fillStyle="rgba(255,255,255,.07)";g.beginPath();g.moveTo(20,30);g.lineTo(60,30);g.lineTo(30,h-10);g.lineTo(8,h-10);g.fill();
          g.fillStyle="#3C7FD0";g.fillRect(20,10,22,6);g.fillStyle="#9AA0A6";g.beginPath();g.arc(70,14,5,0,7);g.fill();g.fillRect(10,24,w-20,2)});
        R("mat",(w,h)=>{g.fillStyle="#3E3A34";g.fillRect(0,0,w,h);g.fillStyle="#8C7254";g.fillRect(10,10,w-20,h-20);for(let i=0;i<900;i++){g.fillStyle=rnd()<.5?"rgba(60,40,20,.25)":"rgba(200,170,120,.18)";g.fillRect(10+rnd()*(w-22),10+rnd()*(h-22),1.5,3)}});
        R("fab",(w,h)=>{g.fillStyle="#C0C0C0";g.fillRect(0,0,w,h);for(let i=0;i<w;i+=3){g.fillStyle="rgba(0,0,0,.06)";g.fillRect(i,0,1,h);g.fillRect(0,i,w,1)}noise(g,w,h,22)});
        /* номера квартир на латунных табличках, «скоро», таблички над проёмами */
        for(let i=0;i<6;i++)R("aptn",(w,h)=>{const x=i*128;g.fillStyle="#2A2622";g.fillRect(x,0,128,128);g.fillStyle="#C9A75A";g.fillRect(x+14,14,100,100);g.fillStyle="#2A2622";g.font="600 64px Golos Text, sans-serif";g.textAlign="center";g.textBaseline="middle";g.fillText(String(i+1),x+64,68)});
        R("soon",(w,h)=>{g.fillStyle="#F4F2EC";g.fillRect(0,0,w,h);g.strokeStyle="#9A958C";g.lineWidth=4;g.strokeRect(4,4,w-8,h-8);g.fillStyle="#3A3D42";g.font="500 56px Golos Text, sans-serif";g.textAlign="center";g.textBaseline="middle";g.fillText("скоро",w/2,h/2+2)});
        R("csign",(w,h)=>{g.fillStyle="#F2F0EA";g.fillRect(0,0,w,h);g.fillStyle="#6B774C";g.fillRect(0,h-10,w,10);g.fillStyle="#22262B";g.font="600 50px Golos Text, sans-serif";g.textAlign="center";g.textBaseline="middle";g.fillText("Коридор квартир",w/2,h/2-4)});
        R("kvsign",(w,h)=>{g.fillStyle="#141619";g.fillRect(0,0,w,h);g.fillStyle="#E9EDF0";g.font="500 52px Golos Text, sans-serif";g.textAlign="center";g.textBaseline="middle";g.fillText((opt.halls&&opt.halls.kv)||"Квартиры",w/2,h/2)});
        /* ---- этап 10 ---- */
        /* таблички с названиями квартир у дверей: до четырёх открытых квартир с названием (сетка 2×2 ячеек 3×1) */
        FL.filter(q=>q.title&&(q.rooms||[]).length).slice(0,4).forEach((f,i)=>R("ftitles",(w,h)=>{const x=(i%2)*384,y=Math.floor(i/2)*128,W=384,Hh=128;g.fillStyle="#2A2622";g.fillRect(x,y,W,Hh);g.fillStyle="#C9A75A";g.fillRect(x+8,y+8,W-16,Hh-16);g.fillStyle="#2A2622";
          let fs=58;const t=String(f.title);g.font=`600 ${fs}px Golos Text, sans-serif`;while(fs>22&&g.measureText(t).width>W-40){fs-=2;g.font=`600 ${fs}px Golos Text, sans-serif`}g.textAlign="center";g.textBaseline="middle";g.fillText(t,x+W/2,y+Hh/2+2)}));
        /* ночной вид из окна: тёмное небо с отсветом города, далёкие многоэтажки, тёплые и редкие холодные огни окон (впечатление, без узнаваемых мест) */
        R("night",(w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,"#070A14");gr.addColorStop(.55,"#121829");gr.addColorStop(1,"#2A2630");g.fillStyle=gr;g.fillRect(0,0,w,h);
          const blk=(x,y,bw,bh,c,dens,ws)=>{g.fillStyle=c;g.fillRect(x,y,bw,h-y);for(let r=y+5;r<h-4;r+=ws+3)for(let cc=x+3;cc<x+bw-ws;cc+=ws+3){if(rnd()<dens){g.fillStyle=rnd()<.82?["#FFC870","#FFDFA0","#F2B860"][Math.floor(rnd()*3)]:"#BFD4FF";g.globalAlpha=.55+rnd()*.45;g.fillRect(cc,r,ws,ws*.8);g.globalAlpha=1}}};
          for(let i=0;i<9;i++)blk(i*30-10+rnd()*8,h*.42+rnd()*h*.12,24+rnd()*14,0,"#1A1F2C",.22,3);
          blk(20,h*.36,92,0,"#20242F",.32,5);blk(150,h*.31,80,0,"#1D212B",.28,5);blk(-20,h*.6,70,0,"#272A33",.4,6);blk(196,h*.55,70,0,"#252831",.35,6);
          g.fillStyle="rgba(255,190,120,.08)";g.fillRect(0,h*.4,w,h*.2)});
        R("oakw",(w,h)=>grain(w,h,"#C99A62","110,70,30",80));
        /* зелёное крашеное стекло фартука: светлее у подсветки сверху, блики */
        R("glassG",(w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,"#9ED9C4");gr.addColorStop(.18,"#5FAE96");gr.addColorStop(1,"#2F7863");g.fillStyle=gr;g.fillRect(0,0,w,h);
          g.fillStyle="rgba(255,255,255,.08)";for(let i=0;i<5;i++){const x=rnd()*w;g.beginPath();g.moveTo(x,0);g.lineTo(x+30,0);g.lineTo(x-10,h);g.lineTo(x-40,h);g.fill()}
          for(let i=0;i<14;i++){g.fillStyle="rgba(255,240,210,.5)";g.beginPath();g.arc(rnd()*w,4+rnd()*20,1.5+rnd()*2,0,7);g.fill()}});
        R("ovenB",(w,h)=>{g.fillStyle="#0B0C0E";g.fillRect(0,0,w,h);g.fillStyle="#17191C";g.fillRect(8,34,w-16,h-44);g.fillStyle="rgba(255,255,255,.07)";g.beginPath();g.moveTo(22,34);g.lineTo(58,34);g.lineTo(30,h-10);g.lineTo(8,h-10);g.fill();
          g.fillStyle="#2B2F33";g.fillRect(10,6,w-20,20);g.fillStyle="#C9CED2";[28,64,100].forEach(x=>{g.beginPath();g.arc(x,16,5,0,7);g.fill()});g.fillStyle="#B9C0C6";g.fillRect(12,28,w-24,3)});
        /* круглый узорный поднос (медь, гравировка) */
        R("tray",(w,h)=>{g.fillStyle="#3A2E25";g.fillRect(0,0,w,h);const gr=g.createRadialGradient(56,52,6,64,64,62);gr.addColorStop(0,"#E9C99A");gr.addColorStop(1,"#A9805A");g.fillStyle=gr;g.beginPath();g.arc(64,64,62,0,7);g.fill();
          g.strokeStyle="rgba(90,60,30,.6)";g.lineWidth=2;for(let r=10;r<60;r+=9){g.beginPath();g.arc(64,64,r,0,7);g.stroke()}for(let i=0;i<24;i++){const a=i/24*Math.PI*2;g.beginPath();g.arc(64+Math.cos(a)*44,64+Math.sin(a)*44,5,0,7);g.stroke()}});
        /* корешки книг без надписей */
        R("books",(w,h)=>{let x=0;while(x<w){const bw=10+rnd()*16,bh=h*(.62+rnd()*.38);g.fillStyle=["#7A2E2A","#2E4A6E","#D8D2C2","#3F5E3A","#C9A04A","#1E1E22","#8A6A9A","#E5E1D6","#B5553A"][Math.floor(rnd()*9)];g.fillRect(x,h-bh,bw-1,bh);g.fillStyle="rgba(255,255,255,.18)";g.fillRect(x+2,h-bh+8,bw-5,3);x+=bw}});
        R("ledglow",(w,h)=>{const gr=g.createLinearGradient(0,h,0,0);gr.addColorStop(0,"#FFFFFF");gr.addColorStop(.25,"rgba(255,255,255,.45)");gr.addColorStop(1,"rgba(0,0,0,1)");g.fillStyle="#000";g.fillRect(0,0,w,h);g.fillStyle=gr;g.fillRect(0,0,w,h)});
        /* «База»: трафаретные надписи (их список — в отчёте), инфодоска, перфопанель, экран, жалюзи, грани башен */
        const sten=(t,col,bg,fs)=>(w,h)=>{g.fillStyle=bg;g.fillRect(0,0,w,h);g.fillStyle=col;g.font=`700 ${fs}px Golos Text, Arial, sans-serif`;g.textAlign="center";g.textBaseline="middle";g.fillText(t,w/2,h/2+2);
          g.fillStyle=bg;for(let i=0;i<6;i++)g.fillRect(w*(.18+i*.13),0,3,h)};
        R("ars",sten("[АРСЕНАЛ]","#E58A2C","#B9BFC5",78));R("arsF",sten("[АРСЕНАЛ]","#D8503A","#2E4F9E",76));R("labA",sten("БАЗА [А]","#2B55C8","#B9BFC5",66));
        R("exitS",(w,h)=>{g.fillStyle="#0E3A1E";g.fillRect(0,0,w,h);g.fillStyle="#48E07A";g.font="700 58px Golos Text, Arial, sans-serif";g.textAlign="center";g.textBaseline="middle";g.fillText("ВЫХОД",w/2,h/2+2)});
        R("info",(w,h)=>{const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,"#6A4FC9");gr.addColorStop(1,"#3B3F9E");g.fillStyle=gr;g.fillRect(0,0,w,h);g.fillStyle="rgba(255,255,255,.12)";g.fillRect(14,14,w-28,30);
          const pts=[];for(let i=0;i<9;i++)pts.push([40+rnd()*(w-80),70+rnd()*(h-100)]);g.strokeStyle="rgba(220,210,255,.7)";g.lineWidth=2;g.setLineDash([6,5]);for(let i=1;i<pts.length;i++){g.beginPath();g.moveTo(...pts[i-1]);g.lineTo(...pts[i]);g.stroke()}g.setLineDash([]);
          pts.forEach(([x,y],i)=>{g.fillStyle=["#F08A2A","#E8E4FF","#2BC3E0"][i%3];g.beginPath();g.arc(x,y,11,0,7);g.fill();g.strokeStyle="#FFFFFF";g.lineWidth=2.5;g.beginPath();g.arc(x,y,16,0,7);g.stroke()});
          g.fillStyle="rgba(255,255,255,.5)";for(let i=0;i<6;i++)g.fillRect(w-110,70+i*22,60+rnd()*30,6)});
        R("peg",(w,h)=>{g.fillStyle="#141518";g.fillRect(0,0,w,h);g.fillStyle="#3E2E7A";g.fillRect(0,h*.55,w*.42,h*.45);g.fillStyle="#000";for(let y=6;y<h;y+=12)for(let x=6;x<w;x+=12){g.beginPath();g.arc(x,y,2.2,0,7);g.fill()}});
        R("monO",(w,h)=>{const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,"#FF7A2E");gr.addColorStop(1,"#E2581C");g.fillStyle=gr;g.fillRect(0,0,w,h)});
        R("shutter",(w,h)=>{g.fillStyle="#C7CACE";g.fillRect(0,0,w,h);for(let y=0;y<h;y+=9){g.fillStyle="rgba(0,0,0,.22)";g.fillRect(0,y,w,2);g.fillStyle="rgba(255,255,255,.35)";g.fillRect(0,y+2,w,1)}});
        const tow=(c)=>(w,h)=>{g.fillStyle="#F2F3F5";g.fillRect(0,0,w,h);g.fillStyle=c;g.fillRect(w*.3,0,w*.4,h);g.fillStyle="#FFFFFF";g.fillRect(w*.27,0,w*.03,h);g.fillRect(w*.7,0,w*.03,h);g.fillStyle=c;g.fillRect(0,h-10,w,10)};
        R("towA",tow("#D12A26"));R("towB",tow("#2450C6"));
        R("nums",(w,h)=>{for(let i=0;i<32;i++){const x=(i%8)*128,y=Math.floor(i/8)*32;g.fillStyle="#F1ECE0";g.fillRect(x+2,y+2,124,28);g.fillStyle="#22252A";g.font="600 22px JetBrains Mono, monospace";g.textAlign="center";g.textBaseline="middle";g.fillText(String(i+1).padStart(2,"0"),x+64,y+17)}})});
      const atlasTex=new T.CanvasTexture(atlas);atlasTex.anisotropy=4;
      /* UV ячейки (с отступом в 2 px от краёв); sub — часть ячейки [i, из n по горизонтали, j, из m по вертикали] */
      const uvOf=(k,sub)=>{const c=CELL[k];let x=c[0]*U,y=c[1]*U,w=c[2]*U,h=c[3]*U;if(sub){w/=sub[1];h/=sub[3]||1;x+=sub[0]*w;y+=(sub[2]||0)*h}const p=2;return [(x+p)/AW,1-(y+h-p)/AH,(x+w-p)/AW,1-(y+p)/AH]};
      const M={plain:new T.MeshBasicMaterial({vertexColors:true}),tex:new T.MeshBasicMaterial({vertexColors:true,map:atlasTex}),
        glass:new T.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.2,depthWrite:false}),gtex:new T.MeshBasicMaterial({vertexColors:true,map:atlasTex,transparent:true,blending:T.AdditiveBlending,depthWrite:false}),blink:new T.MeshBasicMaterial({vertexColors:true})};
      /* этап 6: ниша с мишенями — четыре группы (кольца, центр, маркеры, засветка), у каждой свой цвет материала */
      const CM={nT:new T.MeshBasicMaterial({vertexColors:true,map:atlasTex}),nC:new T.MeshBasicMaterial({vertexColors:true,map:atlasTex}),nM:new T.MeshBasicMaterial({vertexColors:true,map:atlasTex}),
        nW:new T.MeshBasicMaterial({vertexColors:true,map:atlasTex,transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false}),
        /* этап 10: огоньки башен «А» и «Б» — две группы на башню, мигают поочерёдно */
        tA1:new T.MeshBasicMaterial({vertexColors:true}),tA2:new T.MeshBasicMaterial({vertexColors:true}),tB1:new T.MeshBasicMaterial({vertexColors:true}),tB2:new T.MeshBasicMaterial({vertexColors:true})};
      /* треугольники экономим: у стоящих на полу коробок нет дна, мелкие цилиндры — шестигранные, индикаторы — плоские */
      const G={box:new T.BoxGeometry(1,1,1),cyl:new T.CylinderGeometry(.5,.5,1,10),cyl6:new T.CylinderGeometry(.5,.5,1,6),cone:new T.ConeGeometry(.5,1,6),sph:new T.SphereGeometry(.5,7,5),plane:new T.PlaneGeometry(1,1)};
      G.box5=G.box.clone();
      /* этап 6: икосаэдр (крона, облака), треугольная призма (клин-бункер), звезда из фольги; у многогранников нет индекса — даём его */
      const idx=g=>{if(!g.index)g.setIndex([...Array(g.attributes.position.count).keys()]);return g};
      G.ico=idx(new T.IcosahedronGeometry(.5,0));G.tri=new T.CylinderGeometry(.5,.5,1,3,1,false,Math.PI/6);
      G.star=(function(){const sh=new T.Shape();for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,r=i%2?.21:.5;i?sh.lineTo(Math.cos(a)*r,Math.sin(a)*r):sh.moveTo(Math.cos(a)*r,Math.sin(a)*r)}const g=new T.ExtrudeGeometry(sh,{depth:.08,bevelEnabled:true,bevelThickness:.05,bevelSize:.04,bevelSegments:1,curveSegments:1});g.translate(0,0,-.04);return idx(g)})();
G.box5.setIndex(Array.from(G.box.index.array).filter((_,i)=>i<18||i>=24));
      const halls=[];const v=new T.Vector3(),n=new T.Vector3(),nm=new T.Matrix3(),q=new T.Quaternion(),eu=new T.Euler(),sc=new T.Vector3(),ps=new T.Vector3(),o3=[0,0,0],LD=new T.Vector3(.35,.85,.4).normalize();
      /* этап 9: xf — своя система координат комнаты квартиры {ox,oz,rot}: x поперёк от двери, z — вглубь (минус); поворот кратен 90° */
      function kit(k,xf){const h=H_[k],hi=HALLZ.indexOf(h),A=AIR[k],Z0=xf?0:h.side?(h.bz||0):h.z0;
        const XF=xf?new T.Matrix4().makeRotationY(xf.rot).setPosition(xf.ox,0,xf.oz):null,cR=xf?Math.round(Math.cos(xf.rot)):1,sR=xf?Math.round(Math.sin(xf.rot)):0;
        const tp=(x,z)=>xf?[xf.ox+x*cR+z*sR,xf.oz-x*sR+z*cR]:[x,Z0+z];const L={c:{plain:[],tex:[]},x:{plain:[],tex:[]},glass:[],gtex:[],blink:[],cm:{}};const sky=new T.Color(A.sky);
        const put=(geo,x,y,dz,sx,sy,sz,col,o)=>{o=o||{};eu.set(o.rx||0,o.ry||0,o.rz||0,"YXZ");q.setFromEuler(eu);const m=new T.Matrix4().compose(ps.set(x,y,Z0+dz),q,sc.set(sx,sy,sz));if(XF)m.premultiply(XF);
          const it={geo,m,c:new T.Color(col),uv:o.uv?uvOf(o.uv,o.sub):null,em:o.em||(o.glass&&o.uv?.45:0),blink:o.blink};
          (o.cm?(L.cm[o.cm]=L.cm[o.cm]||[]):o.glass?(it.uv?L.gtex:L.glass):o.blink?L.blink:L[o.x?"x":"c"][it.uv?"tex":"plain"]).push(it);return it};
        const K={h,hi,z:dz=>Z0+dz,
          /* любая геометрия по центру (этап 6) и труба вдоль x */
          geo:(g,x,y,dz,sx,sy,sz,col,o)=>put(g,x,y,dz,sx,sy,sz,col,o),
          tube:(x1,x2,y,dz,r,col,o)=>put(r<.08?G.cyl6:G.cyl,(x1+x2)/2,y,dz,r*2,Math.abs(x2-x1),r*2,col,Object.assign({rz:Math.PI/2},o)),
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
            const dir=new T.Vector3(dx,dy,dzz).normalize();it.m.compose(ps.set((x1+x2)/2,(y1+y2)/2,Z0+(z1+z2)/2),new T.Quaternion().setFromUnitVectors(new T.Vector3(0,0,1),dir),sc.set(t,t,len));if(XF)it.m.premultiply(XF);return it},
          /* препятствие (dz от входа): верх ≤ LOW_TOP — можно встать; иначе держит. Высокое ещё и останавливает камеру */
          solid:(x0,x1,dz0,dz1,top,stand,bot)=>{const a=tp(x0,dz0),b=tp(x1,dz1),X0=Math.min(a[0],b[0]),X1=Math.max(a[0],b[0]),za=Math.min(a[1],b[1]),zb=Math.max(a[1],b[1]);block(X0,X1,za,zb,top,stand,bot);
            const y0=bot>0?bot:0;if(top-y0>1.2||(bot>0&&top-y0>.3)){const p=new T.Mesh(G.box,M.plain);p.visible=false;p.scale.set(X1-X0,top-y0,zb-za);p.position.set((X0+X1)/2,(top+y0)/2,(za+zb)/2);p.updateMatrixWorld(true);camBlock.push(p);propProxy.push(p)}return blockers[blockers.length-1]},
          tp,xf};
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
      const propProxy=[],PM=[];
      function finish(){const out=[];halls.forEach(H=>{const ms=[],xs=[];const mk=(items,mat,tex,lst)=>{const g=merge(H,items,tex);if(!g)return null;const me=new T.Mesh(g,mat);me.matrixAutoUpdate=false;me.userData.prop=H.k;me.userData.items=items;PM.push(me);S.add(me);lst.push(me);return me};
          mk(H.L.c.plain,M.plain,false,ms);mk(H.L.c.tex,M.tex,true,ms);mk(H.L.glass,M.glass,false,ms);mk(H.L.gtex,M.gtex,true,ms);mk(H.L.x.plain,M.plain,false,xs);mk(H.L.x.tex,M.tex,true,xs);
          const bm=mk(H.L.blink,M.blink,false,ms);
          /* свои материалы (этап 6: мишени в нише меняют цвет материала — без перезаливки буферов) */
          Object.keys(H.L.cm).forEach(n=>{const cmM=CM[n];if(cmM)mk(H.L.cm[n],cmM,!!cmM.map,ms)});
          out.push({k:H.k,hi:H.hi,core:ms,extra:xs,blink:bm?{mesh:bm,items:H.L.blink}:null,parts:H.L.c.plain.length+H.L.c.tex.length+H.L.glass.length+H.L.gtex.length+H.L.blink.length+H.L.x.plain.length+H.L.x.tex.length,nx:H.L.x.plain.length+H.L.x.tex.length})});
        return out}
      return {kit,finish,atlasTex,M,G,propProxy,CELL,CM,meshes:PM}})();

    /* ---------- этап 10: эмблема «Базы Героев» — только файл автора (img/base_emblem.webp) как текстура: на экранах мониторов, на стене и у вывески над входом.
       Грузится лениво, когда посетитель в «Квартирах» или в «Базе»; пока не загрузилась или если не загрузилась — ровная оранжевая панель. Уходит вместе с музеем ---------- */
    const EMB=[],EMB_SRC="img/base_emblem.webp";let embTex=null,embState="wait";
    const embZ=(x,y,z,s_,ry,hi)=>emb(x,y,z+BZ,s_,ry,hi);/* этап 11: эмблемы арен — в их прежней системе координат */
    function emb(x,y,z,s_,ry,hi){const mt=new T.MeshBasicMaterial({color:0xEE5F1E}),me=new T.Mesh(new T.PlaneGeometry(s_,s_),mt);me.position.set(x,y,z);me.rotation.y=ry;S.add(me);EMB.push({mesh:me,mat:mt,hi});return me}
    function stepEmb(hi){if(embState!=="wait"||!(hi===BASE_HALL||hi===IB||hi===IB2))return;embState="loading";
      new T.TextureLoader().load(EMB_SRC,tx=>{if(stopped){tx.dispose();return}embTex=tx;EMB.forEach(e=>{e.mat.map=tx;e.mat.color.set(0xFFFFFF);e.mat.needsUpdate=true});embState="ok"},undefined,()=>{embState="fail"})}
    stopFns.push(()=>{EMB.forEach(e=>{e.mat.dispose();e.mesh.geometry.dispose()});if(embTex)embTex.dispose()});
    /* — обстановка по залам: что именно и почему — в отчёте этапа 5; координаты dz — от входа в зал — */
    const C_={wood:0x7A5A3C,dark:0x24211F,white:0xEDEAE3,steel:0x9AA1A8,paper:0xF2EEE4,card:0xB89468};
    /* Квартиры: мартовское окно над кухней, батарея, часы, чайник и банки, телевизор на холодильнике; крючки с куртками,
       чемодан и обувь у входа; окно и занавески в съёмной; коробки «кухня» и кепка на крючке у квартиры отца */
    BOOK&&(function(){const K=PROPS.kit("kv");
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
      K.box(7.86,1.18,-3.15,.06,.5,.14,0xB4483A);K.solid(7.6,8,-1.6,-3.1,1.8,"ns");
      K.box(2.6,.08,-1.2,.44,.62,.26,0x2F4F6F);K.box(2.6,.7,-1.2,.2,.03,.04,0x1A1A1A);[-1,1].forEach(s=>{K.box(2.6+s*.09,.66,-1.2,.025,.05,.025,0x1A1A1A);K.cyl(2.6+s*.17,0,-1.08,.04,.07,0x111111,{rx:Math.PI/2})});
      K.box(2.9,.46,-1.07,.1,.07,.005,0xF4F1EA);K.rod(2.82,.68,-1.12,2.9,.5,-1.07,.008,0xC0392B);K.solid(2.38,2.82,-1.33,-1.07,.7);
      [[1.75,-.75,0x2A2A2A],[1.95,-.75,0x2A2A2A],[3.4,-.7,0x9AA8B8],[3.6,-.7,0x9AA8B8]].forEach(([x,dz,c])=>K.box(x,0,dz,.12,.07,.28,c,{x:1}));
      /* съёмная: окно с другими занавесками, свет пятном (5) */
      win(7.97,-15.2,1.3,1.5,1.0,"winMarch",-1,0x8C9BA5);K.pic(7.1,.017,-15.2,1.4,1.3,"glow",{rx:-Math.PI/2,glass:1,tint:0xFFF4DD,x:1});
      K.cyl(3.25,.77,-13.2,.05,.1,0xE9E2D2,{x:1});/* кружка с неровным дном (5) */
      /* у квартиры отца: коробки «кухня» и «на дачу» (5, 109), кепка на крючке и светлое пятно на обоях (14) */
      K.box(-6.95,0,-22.9,.62,.46,.5,C_.card);K.pic(-6.95,.24,-22.64,.44,.34,"lKitchen",{});K.box(-6.15,0,-22.95,.55,.4,.48,0xA9835A);K.pic(-6.15,.21,-22.70,.42,.2,"lDacha",{});
      K.solid(-7.26,-6.64,-22.65,-23.15,.46);K.solid(-6.43,-5.87,-22.71,-23.19,.4);
      K.box(-7.985,1.1,-18.8,.01,.75,.45,0xF1E9D8);K.box(-7.93,1.62,-18.8,.1,.03,.03,0x8A7A5A);K.box(-7.86,1.52,-18.8,.2,.08,.24,0x3B3F44);K.box(-7.86,1.52,-18.66,.12,.02,.12,0x3B3F44);
      /* этап 9: проём в коридор квартир в левой стене — светлая рама сквозь толщу стены и табличка «Коридор · квартиры» над ним */
      {const C=CORR,fx2=(-HW+.04+C.x1-.04)/2,fw2=-C.x1-HW+.08,la=C.DZ-C.DW,lb=C.DZ+C.DW,fc=0xDCD8CF;
        K.box(fx2,0,lb-.05,Math.abs(fw2),C.DH,.1,fc);K.box(fx2,0,la+.05,Math.abs(fw2),C.DH,.1,fc);K.box(fx2,C.DH-.1,C.DZ,Math.abs(fw2),.1,lb-la,fc);
        K.solid(C.x1-.04,-HW+.04,lb-.1,lb,4,"ns");K.solid(C.x1-.04,-HW+.04,la,la+.1,4,"ns");
        K.box(-HW+.03,2.72,C.DZ,.04,.52,1.9,0x2B3122);K.pic(-HW+.055,2.98,C.DZ,1.8,.45,"csign",{ry:Math.PI/2,em:.95})}})();

    /* Предметы: стеллажи с номерными коробками и бирками вдоль стен, каталожный стол с лампой у выхода,
       ящики у входа, часы с секундной стрелкой над дверью (4) */
    /* этап 6/11: проём в «Базу Героев» в правой стене «Предметов» — тёмная рама сквозь толщу стены, вывеска и эмблема над ним; dz — от входа в «Предметы» */
    BOOK&&(function(){const K=PROPS.kit("pr"),Z0=K.z(0),B=BASE,fx=(HW-.04+B.x0+.04)/2,fw=B.x0-HW+.08,dz=B.DZ-Z0,da=dz-B.DW,db=dz+B.DW;
      K.box(fx,0,db-.05,fw,B.DH,.1,0x30353C);K.box(fx,0,da+.05,fw,B.DH,.1,0x30353C);K.box(fx,B.DH-.1,dz,fw,.1,db-da,0x30353C);
      K.solid(HW-.04,B.x0+.04,db-.1,db,4,"ns");K.solid(HW-.04,B.x0+.04,da,da+.1,4,"ns");K.solid(HW-.04,B.x0+.04,da,db,4.2,"ns",B.DH);
      K.box(HW-.03,2.72,dz,.04,.52,1.9,0x0E1A36);K.pic(HW-.055,2.98,dz,1.8,.45,"sign",{ry:-Math.PI/2,em:1});
      K.box(HW-.03,2.7,dz-1.27,.04,.6,.62,0x0E1A36);emb(HW-.056,3.0,B.DZ-1.27,.52,-Math.PI/2,BASE_HALL)})();
    BOOK&&(function(){const K=PROPS.kit("pr");let num=0;
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
      K.box(5.2,.44,-17.1,.44,.05,.44,C_.wood);K.box(5.2,.48,-17.3,.44,.48,.05,C_.wood);[[-.19,-.19],[.19,-.19],[-.19,.19],[.19,.19]].forEach(([a,b])=>K.box(5.2+a,0,-17.1+b,.04,.44,.04,0x4A3727));K.solid(4.98,5.42,-16.88,-17.27,.49);K.solid(4.98,5.42,-17.27,-17.33,.96);
      /* ящики у входа — низкие, на них можно встать */
      K.box(-6.8,0,-1.3,.7,.42,.55,0x9C7B55);K.pic(-6.8,.24,-1.022,.3,.075,"nums",{sub:[4,8,1,4]});K.box(-6.05,0,-1.1,.55,.36,.5,0xB89468);K.pic(-6.05,.2,-.847,.3,.075,"nums",{sub:[5,8,1,4]});
      K.solid(-7.15,-6.45,-1.025,-1.575,.42);K.solid(-6.325,-5.775,-.85,-1.35,.36);
      /* часы над дверью в «Идеи» (4: «часы с секундной стрелкой над дверью») */
      K.cyl(0,3.98,-17.83,.24,.04,0x222222,{rx:Math.PI/2});K.pic(0,3.98,-17.805,.42,.42,"clock",{})})();

    /* Идеи: карточки рядами над тезисами с нитками между ними, длинный стол с бумагами и водой, табуреты;
       доска со схемой и пробковая доска на задней стене, передвижная доска со вторым чертежом */
    BOOK&&(function(){const K=PROPS.kit("id");
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
      K.box(-5.2,1.0,-11.7,1.7,1.15,.04,0xD0D3D6);K.pic(-5.2,1.575,-11.675,1.6,1.05,"schema2",{});[-1,1].forEach(s=>{K.box(-5.2+s*.84,0,-11.7,.04,2.2,.04,0x777777);K.box(-5.2+s*.84,0,-11.7,.06,.04,.5,0x555555)});K.solid(-6.06,-4.34,-11.45,-11.95,2.2,"ns")})();

    /* Святилище: лавки рядами к часам, подсвечники по углам, ниши с лампадой, тяжёлые драпировки */
    BOOK&&(function(){const K=PROPS.kit("sv");const cz=-7;
      [[-2.9],[2.9],[-4.0],[4.0]].forEach(([x])=>{K.box(x,.4,cz,.42,.05,1.7,0x3A2A22);[-1,1].forEach(s=>K.box(x,0,cz+s*.7,.36,.4,.06,0x2A1E18));K.solid(x-.21,x+.21,cz+.85,cz-.85,.45)});
      [[-6.6,-1.6],[6.6,-1.6],[-6.6,-12.4],[6.6,-12.4]].forEach(([x,dz],i)=>{K.cyl(x,0,dz,.18,.04,0x2A221C);K.cyl(x,0,dz,.025,1.0,0x5A4632);K.cyl(x,1.0,dz,.24,.03,0x6B5638);
        for(let c=0;c<7;c++){const a=c/7*Math.PI*2,r=c?.15:0,hh=.1+((c+i)%3)*.06,cx=x+Math.sin(a)*r,cz_=dz+Math.cos(a)*r;K.cyl(cx,1.03,cz_,.018,hh,0xEDE3CC);K.cone(cx,1.03+hh,cz_,.014,.045,0xFFC870,{blink:"flame",em:1.4})}
        K.solid(x-.25,x+.25,dz+.25,dz-.25,1.2,"ns")});
      [-1,1].forEach(s=>{const x=s*7.96,ry=s>0?-Math.PI/2:Math.PI/2;
        K.box(x,.5,cz,.06,2.0,1.3,0x4A3C34);K.pic(x-s*.035,1.4,cz,.95,1.6,"glow",{ry,em:.9});K.cyl(x-s*.25,.9,cz,.2,.03,0x4A3C34);K.cyl(x-s*.25,.93,cz,.05,.06,0xC9A27A);K.cone(x-s*.25,.99,cz,.02,.06,0xFFD890,{blink:"flame",em:1.5});
        for(let f=0;f<6;f++){const dd=.11+(f%2)*.08,c=f%2?0x4A1418:0x3A0F12;K.box(x-s*dd/2,0,cz+.9+f*.17,dd,4.5,.18,c);K.box(x-s*dd/2,0,cz-.9-f*.17,dd,4.5,.18,c)}});
      [-1,1].forEach(s=>{for(let f=0;f<7;f++)K.box(s*(1.9+f*.18),0,-.3-(f%2)*.06,.18,4.5,.12+(f%2)*.06,f%2?0x4A1418:0x3A0F12)});
      for(let i=0;i<7;i++){const x=-.9+i*.3;K.cyl(x,0,-13.3,.04,.07,0xB8432E,{x:1});K.cone(x,.07,-13.3,.013,.035,0xFFC870,{blink:"flame",em:1.3,x:1})}})();

    /* Двойники: серверная за стеклом (стойки с мигающими индикаторами), кабели по полу к пульту,
       пульт с тремя мониторами и станцией, два операторских кресла */
    BOOK&&(function(){const K=PROPS.kit("dv");
      const rack=(x,dz)=>{K.box(x,0,dz,.62,2.1,.9,0x1A1D21);K.box(x,0,dz+.452,.6,2.08,.006,0x39424B);K.quad(x+.12,1.95,dz+.459,.22,.05,0x7FE0C8,{em:.7});for(let r=0;r<9;r++)K.box(x,.15+r*.21,dz+.456,.54,.03,.004,0x0E1013);
        for(let r=0;r<8;r++)for(let c=0;c<3;c++)K.quad(x-.2+c*.06,.25+r*.21,dz+.459,.025,.025,(r+c)%5?0x4CFF8A:0xFFB347,{blink:"led",em:1.3})};
      [-7.3,-6.62,-5.94,-5.26,-4.58,-3.9].forEach(x=>rack(x,-17.5));[-7.3,-6.62,-5.94,-5.26].forEach(x=>rack(x,-15.55));
      K.box(-5.6,2.12,-17.5,4.1,.06,.3,0x3A3F45);K.box(-5.4,4.45,-16.0,4.2,.05,.12,0x9FF2DC,{em:.85});K.pic(-5.4,.016,-16.3,4.6,3.2,"glow",{rx:-Math.PI/2,glass:1,tint:0x5FD8C0,em:.5});K.box(-5.6,2.12,-15.55,2.8,.06,.3,0x3A3F45);for(let i=0;i<5;i++)K.rod(-7.3+i*.9,2.18,-17.4,-7.3+i*.9,4.6,-17.4,.03,0x101214,{x:1});
      /* стеклянная перегородка с переплётами */
      K.box(-5.49,0,-14.4,4.98,4.6,.04,0x9FD6E6,{glass:1});K.box(-3.0,0,-16.12,.04,4.6,3.45,0x9FD6E6,{glass:1});
      for(let i=0;i<=4;i++)K.box(-7.98+i*1.245,0,-14.4,.05,4.6,.06,0x2A2F35);for(let i=1;i<=2;i++)K.box(-3.0,0,-14.4-i*1.15,.06,4.6,.05,0x2A2F35);K.box(-5.49,2.4,-14.4,4.98,.06,.07,0x2A2F35);
      K.solid(-8,-2.95,-14.35,-14.45,4.6,"ns");K.solid(-3.05,-2.95,-14.4,-18,4.6,"ns");K.solid(-7.65,-3.55,-17.05,-18,2.1);K.solid(-7.65,-4.9,-15.1,-16,2.1);
      /* кабели по полу от серверной к пульту — плоские, не мешают ходить */
      [[0,0x15181B],[.07,0x2A3B4A],[.13,0x3A2A2A]].forEach(([o,c])=>{K.box(-2.9,0,-15.1-o,.05,.022,.05,c);K.rod(-2.85,.012,-15.1-o,3.2,.012,-15.25-o,.04,c);K.rod(3.2,.012,-15.25-o,6.2,.012,-11.4+o,.04,c);K.rod(6.2,.012,-11.4+o,6.7,.012,-10.9,.04,c)});
      /* пульт оператора: три монитора с журналом, станция с индикатором ожидания (122, 147) */
      K.box(7.05,.72,-9.6,.9,.05,2.4,0x2A2D31);K.box(7.05,0,-9.6,.85,.72,.06,0x1E2124);[-1,1].forEach(s=>K.box(7.05,0,-9.6+s*1.15,.85,.72,.06,0x1E2124));K.solid(6.6,7.5,-8.4,-10.8,.77);K.solid(7.08,7.36,-8.5,-10.7,1.33,"ns");
      [-8.85,-9.6,-10.35].forEach((dz,i)=>{K.box(7.25,.77,dz,.18,.02,.22,0x111111);K.box(7.25,.79,dz,.04,.22,.04,0x111111);K.box(7.22,.97,dz,.04,.36,.62,0x0D0F11,{ry:(i-1)*-.18});K.pic(7.195,1.15,dz,.56,.32,"term",{ry:-Math.PI/2+(i-1)*-.18,em:1})});
      K.box(6.75,.77,-8.6,.3,.08,.2,0xEDEFF0);K.box(6.6,.82,-8.6,.004,.015,.015,0x4CFF8A,{blink:"led",em:1.5});K.box(6.8,.77,-10.6,.32,.015,.18,0x2B2E32,{x:1});
      [[5.95,-9.0],[5.95,-10.2]].forEach(([x,dz])=>{K.cyl(x,0,dz,.28,.04,0x222222,{seg6:1});K.cyl(x,0,dz,.03,.46,0x555555);K.box(x,.46,dz,.46,.07,.46,0x2F3338);K.box(x-.21,.53,dz,.06,.55,.44,0x2F3338);K.solid(x-.18,x+.25,dz+.25,dz-.25,.53);K.solid(x-.25,x-.18,dz+.25,dz-.25,1.08)})})();

    /* Отец: на столе фотографии, очки, магнитофон с кассетой, квитанции; кресло у окна, столик с шахматами и
       стаканом с ложкой; витрина с сервизом и листом «96»; часы с маятником над стулом; занавески и вечерний свет из окна */
    BOOK&&(function(){const K=PROPS.kit("ot");const D=-6;
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
      K.cyl(vx-.08,.2,vz+.45,.05,.1,0x8A2A2A,{x:1});K.cyl(vx-.08,.3,vz+.45,.052,.015,0xE8E0C8,{x:1});K.pic(vx-.22,.33,vz-.2,.18,.2,"l96",{ry:-Math.PI/2+.15});K.solid(7.45,8,vz+.72,vz-.72,1.95,"ns");
      /* занавески по бокам окна и тёплое пятно на полу */
      [-1,1].forEach(s=>{for(let f=0;f<3;f++)K.box(4.6+s*(.78+f*.12),.55,-15.88+(f%2)*.05,.13,2.75,.07,0x7A2E22)});K.box(4.6,3.33,-15.85,2.2,.03,.03,0x3A2A1C);K.box(4.6,1.04,-15.77,1.4,.05,.2,0x4A3727);
      K.pic(4.6,.016,-14.0,1.6,2.4,"glow",{rx:-Math.PI/2,glass:1,tint:0xFFC890});
      /* торшер у кресла */
      K.cyl(6.95,0,-14.0,.13,.03,0x2A2A2A);K.cyl(6.95,0,-14.0,.015,1.45,0x2A2A2A);K.cone(6.95,1.4,-14.0,.2,.26,0xE8C890,{em:.9});K.solid(6.8,7.1,-13.85,-14.15,1.6,"ns");
      /* тапки у двери (34, 96) */
      K.box(2.0,0,-.9,.12,.06,.27,0x6A4A3A,{x:1});K.box(2.18,0,-.92,.12,.06,.27,0x6A4A3A,{x:1,ry:.1})})();

    /* Семья: обеденный стол со стульями (один отодвинут), холодильник с рисунком и расписанием, окно с градусником,
       батарея, сушилка с купальником и носками, кубики-город на ковре, спортивная сумка, торшер, гирлянда, фото */
    BOOK&&(function(){const K=PROPS.kit("se");
      K.box(4.9,.72,-13.5,1.6,.05,.9,0x8A6440);[[-.72,-.38],[.72,-.38],[-.72,.38],[.72,.38]].forEach(([a,b])=>K.box(4.9+a,0,-13.5+b,.05,.72,.05,0x5A3E26));K.box(4.9,.775,-13.5,1.5,.004,.82,0xF4EEDF);
      K.solid(4.1,5.7,-13.05,-13.95,.77);
      const chair=(x,dz,fz,ry)=>{K.box(x,.44,dz,.42,.05,.42,0x6E5038,{ry});K.box(x+Math.sin(ry)*.19*fz,.49,dz+Math.cos(ry)*.19*fz,.42,.46,.04,0x6E5038,{ry});[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>K.box(x+a*.18,0,dz+b*.18,.035,.44,.035,0x4E3826));const e=ry?.3:.22;K.solid(x-e,x+e,dz+e,dz-e,.49);const bx=x+Math.sin(ry)*.19*fz,bz=dz+Math.cos(ry)*.19*fz;if(ry)K.solid(bx-.1,bx+.1,bz-.1,bz+.1,.95);else K.solid(x-e,x+e,bz-.04,bz+.04,.95)};
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
      K.box(dx-.25,.6,dz+.03,.28,.4,.02,0x1F8A9A);K.box(dx+.05,.82,dz-.03,.06,.16,.02,0xF8F8F8);K.box(dx+.14,.82,dz-.03,.06,.16,.02,0xF8F8F8);K.box(dx+.38,.45,dz+.05,.3,.55,.02,0xE8B24A);K.solid(dx-.62,dx+.62,dz+.3,dz-.3,1.05,"ns");
      /* кубики и «город» на ковре (34) — мелкие, не мешают */
      for(let i=0;i<14;i++){const c=[0xC0392B,0x2E6DB4,0xE0B020,0x3C9A4A][i%4],s=.08+(i%3)*.02,st=i>10?1:0;K.box(1.45+(i%5)*.15,st?.1:0,-7.1-Math.floor(i/5)*.17,s,s,s,c,{ry:i*.4,x:1})}K.box(1.9,0,-7.55,.1,.32,.1,0xE0B020,{x:1});
      /* спортивная сумка у входа (56) — низкая */
      K.box(2.8,0,-1.3,.6,.3,.32,0x23395B);K.rod(2.6,.3,-1.3,2.8,.46,-1.3,.02,0x111111);K.rod(2.8,.46,-1.3,3.0,.3,-1.3,.02,0x111111);K.solid(2.5,3.1,-1.14,-1.46,.3);
      /* торшер у дивана */
      K.cyl(1.95,0,-10.45,.14,.03,0x2A2A2A);K.cyl(1.95,0,-10.45,.015,1.5,0x2A2A2A);K.cone(1.95,1.45,-10.45,.22,.28,0xF3E2C0,{em:.95});K.solid(1.8,2.1,-10.3,-10.6,1.7,"ns");
      /* гирлянда флажков над дверью и два шара у отодвинутого стула — праздник (35, 53) */
      const fl=[0xC0392B,0xE0B020,0x2E6DB4,0x3C9A4A,0xE07A9A];let pv=null;for(let i=0;i<=24;i++){const t=i/24,x=-6.4+t*12.8,y=3.9-.42*(1-(2*t-1)*(2*t-1)),z=-15.78;if(pv)K.rod(pv[0],pv[1],z,x,y,z,.01,0xEDE6D6);pv=[x,y];if(i<24)K.box(x+.27,y-.14,z+.01,.14,.14,.01,fl[i%5],{rz:Math.PI/4})}
      [[6.75,-12.1,1.75,0xE07A9A],[6.9,-12.35,1.6,0x2E6DB4]].forEach(([x,dz,y,c])=>{K.sph(x,y,dz,.16,c,{x:1});K.rod(x,y-.16,dz,6.6,.9,-12.3,.005,0xEDEDED,{x:1})});
      /* фотографии на правой стене над постаментами (35 «Фотографии») */
      [[-4.0,2.1,0],[-4.75,2.25,1],[-5.4,2.05,3]].forEach(([dz,y,i])=>{K.box(7.97,y-.2,dz,.03,.4,.32,0x2B2018);K.pic(7.952,y,dz,.26,.34,"photos",{ry:-Math.PI/2,sub:[i,4]})})})();

    /* N: тёмная комната — стол с кюветами и увеличителем, красный фонарь над ним, контактные листы;
       две верёвки с отпечатками на прищепках; штатив с камерой; ящики «верх», уровень и скотч, каталоги в плёнке; пустая рама */
    BOOK&&(function(){const K=PROPS.kit("n");
      K.box(-7.64,0,-8.7,.68,.88,3.0,0x1C1C1E);K.box(-7.64,.88,-8.7,.72,.04,3.04,0x2E2E30);K.solid(-8,-7.28,-7.2,-10.2,.92);K.solid(-7.82,-7.38,-9.5,-10.0,1.75,"ns");
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
      K.solid(tx-.3,tx+.3,tz+.3,tz-.3,1.4,"ns");
      /* ящики у правой стены: «верх» (ящик «верх»), уровень и скотч, стопка каталогов в плёнке */
      K.box(6.7,0,-16.6,.8,.5,.6,0x9C7B55);K.pic(6.7,.27,-16.297,.34,.1,"lTop",{});K.box(5.95,0,-17.0,.6,.42,.5,0xB89468);K.solid(6.3,7.1,-16.3,-16.9,.5);K.solid(5.65,6.25,-16.75,-17.25,.42);
      K.box(6.6,.5,-16.6,.6,.04,.06,0xE0B020,{x:1});K.cyl(6.95,.5,-16.7,.06,.05,0xC9B98A,{x:1});for(let i=0;i<5;i++)K.box(5.95,.42+i*.03,-17.0,.32,.028,.24,0xE8E8EC,{ry:i*.05,x:1});K.box(5.95,.42,-17.0,.34,.15,.26,0xDCEAF0,{glass:1});
      /* пустая рама, прислонённая к стене */
      K.box(7.86,.05,-14.6,.05,.9,.04,0xDAD6CE,{rz:-.1});K.box(7.86,.05,-15.3,.05,.9,.04,0xDAD6CE,{rz:-.1});K.box(7.82,.06,-14.95,.05,.04,.74,0xDAD6CE,{rz:-.1});K.box(7.9,.88,-14.95,.05,.04,.74,0xDAD6CE,{rz:-.1});K.solid(7.6,8,-14.5,-15.4,1.0,"ns")})();

    /* Клуб: сцена-ступенька с экраном (созвон, одна клетка — чёрный квадрат, 136), кафедра с ноутбуком, проектор,
       два ряда стульев, кофейный угол (45), доска объявлений, полка с книгой плашмя (136), ноутбуки на стульях (111) */
    BOOK&&(function(){const K=PROPS.kit("kl");
      K.box(4.6,0,-15.1,4.4,.18,1.8,0x3A3F46);K.box(4.6,.18,-14.2,4.4,.004,.04,0xE8E2D2);K.solid(2.4,6.8,-14.2,-16,.18);
      K.box(4.6,3.5,-15.8,4.2,.12,.12,0x22262B);K.pic(4.6,2.35,-15.83,4.0,2.25,"call",{em:1});
      K.box(6.15,.18,-14.75,.55,1.05,.42,0x2A2D31);K.box(6.15,1.23,-14.7,.6,.03,.5,0x2A2D31,{rx:.15});K.box(6.15,1.26,-14.7,.32,.015,.22,0x2B2E32,{x:1});K.pic(6.15,1.36,-14.82,.3,.18,"term",{rx:-.2,em:.9,x:1});K.solid(5.85,6.45,-14.5,-15.0,1.25,"ns");
      K.rod(4.6,4.2,-9.5,4.6,3.9,-9.5,.04,0x333333);K.box(4.6,3.72,-9.5,.42,.16,.36,0xE8E8E8);K.cyl(4.6,3.8,-9.72,.06,.06,0xFFFFFF,{rx:Math.PI/2,em:1.3});
      for(let r=0;r<2;r++)for(let c=0;c<5;c++){const x=3.0+c*.85,dz=-11.2-r*1.2;K.box(x,.44,dz,.44,.05,.44,0x2E4A6B);K.box(x,.49,dz+.2,.44,.42,.04,0x2E4A6B);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>K.box(x+a*.19,0,dz+b*.19,.03,.44,.03,0x777777));
        if((r*5+c)%4===1){K.box(x,.49,dz-.02,.32,.015,.22,0x2B2E32,{x:1});K.box(x,.5,dz+.09,.32,.2,.012,0x2B2E32,{rx:-.3,x:1})}}
      K.solid(2.78,6.62,-11.02,-11.42,.49);K.solid(2.78,6.62,-10.98,-11.02,.93);K.solid(2.78,6.62,-12.22,-12.62,.49);K.solid(2.78,6.62,-12.18,-12.22,.93);
      /* кофейный угол */
      K.box(-7.67,0,-11.7,.62,.9,2.2,0x5A4A3C);K.box(-7.67,.9,-11.7,.66,.05,2.24,0xE6E2DA);K.solid(-8,-7.34,-10.6,-12.8,.95);K.solid(-7.93,-7.57,-10.83,-11.17,1.4,"ns");K.solid(-7.83,-7.57,-11.52,-11.78,1.4,"ns");
      K.box(-7.75,.95,-11.0,.36,.45,.34,0x1E2124);K.box(-7.56,1.05,-11.0,.02,.14,.16,0x2A2D31);K.box(-7.56,1.3,-11.12,.004,.03,.03,0xFF5A3C,{em:1.4});K.cyl(-7.7,.95,-11.65,.13,.42,0xB8BCC0);K.cyl(-7.7,1.37,-11.65,.06,.04,0x333333);
      for(let i=0;i<5;i++)K.cyl(-7.62,.95+i*.04,-12.15,.045,.04,0xF4F1EA,{x:1});K.cyl(-7.5,.95,-12.45,.045,.09,0xF4F1EA,{x:1});K.cyl(-7.5,1.04,-12.45,.041,.003,0x3A2214,{x:1});
      /* доска объявлений: пустые листы с полосками, заголовок */
      K.box(7.965,1.05,-3.4,.03,1.25,2.2,0xB08A5A);K.pic(7.945,2.5,-3.4,.9,.22,"lNotice",{ry:-Math.PI/2});for(let i=0;i<6;i++)K.pic(7.945,1.45+Math.floor(i/3)*.5,-2.75-(i%3)*.62+(i%2)*.06,.32,.4,i%2?"sheet":"card",{ry:-Math.PI/2+(i%3-1)*.04,x:i>3});
      /* полка с книгой плашмя (136) */
      K.box(7.78,0,-11.5,.36,1.5,1.8,0x6E5038);for(let s=0;s<3;s++){K.box(7.76,.05+s*.48,-11.5,.32,.03,1.74,0x8A6A4A);for(let b=0;b<9;b++)if(!(s===1&&b>5))K.box(7.78,.08+s*.48,-12.25+b*.17,.24,.3+((b*5+s)%3)*.05,.12,[0x7A2E22,0x2E4A6B,0x3C6A4A,0xB89468,0x4A3A5A][(b+s)%5],{x:s===2})}
      K.box(7.78,.56,-11.25,.26,.05,.34,0xC0392B);K.solid(7.58,8,-10.6,-12.4,1.5)})();
    /* этап 11: полка «Философские эссе» у левой стены «Клуба энтузиастов» — только при window.SITE_FLAGS.essays.
       Каркас — в обстановке зала; 28 корешков — один InstancedMesh (цвет по виду: эссе, схема, записи), названия и порядок — из essays/index.json
       (грузится лениво). У каждого корешка — невидимая «рамка» для выбора: E/клик открывают #club/essay-NN, как у других предметов */
    const ESH={on:false,n:0,books:[]};
    BOOK&&window.SITE_FLAGS&&window.SITE_FLAGS.essays&&window.Essays&&(function(){const h=H_.kl,K=PROPS.kit("kl"),xw=-HW,dep=.34,xc=xw+.02+dep/2,d0=-3.6,L=3.0,Hs=1.9,dzc=d0-L/2,wood=0x5B4636,COL={essay:0x2F6F6A,scheme:0x27489A,notes:0x9A6B2E};
      ESH.on=true;K.box(xw+.03,0,dzc,.04,Hs,L,0x3E3027);[-1,1].forEach(e=>K.box(xc,0,dzc+e*(L/2-.02),dep,Hs,.04,wood));
      [0,.62,1.3,Hs-.04].forEach(y=>K.box(xc,y,dzc,dep,.04,L-.04,0x6E5442));K.solid(xw,xw+.04+dep,d0,d0-L,Hs,"ns");
      textPlane(textCanvas("Философские эссе","28 текстов · подойдите к корешку: E или клик — читать",{w:900,h:220,ts:52,bs:28,pad:30,bg:"#1E2A2A",fg:"#F2EFE6",fg2:"#B8C9C4"}),1.9,.46,xw+.025,2.28,h.z0+dzc,Math.PI/2);
      Essays.load().then(list=>{if(stopped||!list||!list.length)return;const n=Math.min(28,list.length),per=Math.ceil(n/2),slot=(L-.12)/(per+.5),geo=new T.BoxGeometry(1,1,1),mt=new T.MeshLambertMaterial({color:0xFFFFFF}),im=new T.InstancedMesh(geo,mt,n),mm=new T.Matrix4(),cc=new T.Color(),hid=new T.MeshBasicMaterial({visible:false});
        list.slice(0,n).forEach((e,i)=>{const row=i<per?0:1,j=row?i-per:i,hh=.36+((i*7)%4)*.035,th=slot*.82,y=(row?.66:.04)+hh/2,z=h.z0+d0-.06-slot*(j+.5+row*.5),x=xc+.02;
          mm.makeScale(dep*.78,hh,th);mm.setPosition(x,y,z);im.setMatrixAt(i,mm);cc.setHex(COL[e.kind]||COL.essay).offsetHSL(0,0,((i*5)%3-1)*.05);im.setColorAt(i,cc);
          const px=new T.Mesh(geo,hid);px.scale.set(dep*.8,hh,th);px.position.set(x,y,z);px.userData.go="essay:"+e.nn;px.userData.label="Эссе · "+e.title;px.userData.hb={x:x+.2,z,top:y+hh/2,r:.42};S.add(px);clickable.push(px);ESH.books.push(px)});
        im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.layers.set(1);S.add(im);ESH.n=n;ESH.im=im;MPX++;
        stopFns.push(()=>{geo.dispose();mt.dispose();hid.dispose()})}).catch(()=>{})})();

    /* Красота: в галерее — кадки с растениями, столбики с канатами вдоль стен, две лавки лицом к стенам;
       в супермаркете — два стеллажа-острова с безымянным товаром, ценники, корзины, тележка, табличка «Касса»;
       у настенных полок появилась коллизия */
    BOOK&&(function(){const K=PROPS.kit("kr");
      const plant=(x,dz)=>{K.cyl(x,0,dz,.28,.5,0x6A5040);K.cyl(x,.5,dz,.26,.02,0x3A2A1A);for(let i=0;i<5;i++)K.cone(x+Math.sin(i*2.4)*.08,.5+i*.12,dz+Math.cos(i*2.4)*.08,.3-i*.04,.5,[0x3F6A3A,0x4F7A42,0x365E33][i%3]);K.solid(x-.3,x+.3,dz+.3,dz-.3,1.4,"ns")};
      plant(-3.0,-1.4);plant(3.0,-1.4);plant(-3.0,-30.4);plant(3.0,-30.4);
      [-1,1].forEach(s=>{const x=s*6.4;let pv=null;for(let i=0;i<8;i++){const dz=-1.2-i*4.2;K.cyl(x,0,dz,.14,.03,0xB8962E);K.cyl(x,0,dz,.03,.92,0xB8962E);K.cyl(x,.92,dz,.05,.06,0xB8962E);
        if(pv!==null){for(let k=0;k<3;k++){const a=pv+(dz-pv)*k/3,b=pv+(dz-pv)*(k+1)/3,ya=.85-.12*Math.sin(Math.PI*k/3),yb=.85-.12*Math.sin(Math.PI*(k+1)/3);K.rod(x,ya,a,x,yb,b,.03,0x7A1E1E)}}pv=dz}
        K.solid(x-.06,x+.06,-1.2,-30.6,.95,"ns")});
      [[-4.9,-7.2],[4.9,-24.0]].forEach(([x,dz])=>{K.box(x,.38,dz,.5,.05,1.6,0x6E1C22);[-1,1].forEach(s=>K.box(x,0,dz+s*.65,.44,.38,.08,0x3A2A22));K.solid(x-.25,x+.25,dz+.8,dz-.8,.43)});
      /* настенные полки (уже были) — теперь держат */
      [-1,1].forEach(s=>K.solid(s>0?7.18:-8,s>0?8:-7.18,-30.5,-59.5,2.6,"ns"));
      for(let i=7;i<14;i++){const dz=-3-i*4.2;[-1,1].forEach(s=>{for(let k=0;k<5;k++)K.quad(s*7.17,.33+k*.5,dz,3.8,.045,0xF4F4F0,{x:1,ry:s>0?-Math.PI/2:Math.PI/2})})}
      /* острова с товаром: коробки и банки без надписей; ценники полосой */
      const pal=[0x6b8fb0,0xb06b4a,0xd2b84a,0x7a9b6a,0x9a6a9b,0x4a6a8a,0xc94a3a,0xe0d6c0,0xF2F2EE];
      [-3.4,3.4].forEach((gx,gi)=>{const len=13,dz0=-42.5;K.box(gx,0,dz0,.5,1.9,len,0xB9BCC0);[-1,1].forEach(s=>{for(let k=0;k<4;k++){const y=.15+k*.46;K.box(gx+s*.38,y,dz0,.3,.03,len,0xC9CCCF);K.quad(gx+s*.54,y,dz0,len,.045,0xF4F4F0,{x:1,ry:s>0?Math.PI/2:-Math.PI/2});
          for(let j=0;j<10;j++){const c=pal[(j*3+k*5+gi*7+(s>0?2:0))%9],hh=.14+((j+k+gi)%4)*.05,bz=dz0-len/2+.65+j*1.3;K.box(gx+s*.36,y+.03,bz,.2+(j%2)*.08,hh,.95+(j%3)*.08,c,{x:j%3===2})}}});
        [-1,1].forEach(e=>K.box(gx,0,dz0+e*(len/2+.05),1.1,1.95,.08,0xA8ACB0));K.solid(gx-.56,gx+.56,dz0+len/2+.1,dz0-len/2-.1,1.95,"ns")});
      /* корзины стопкой у входа в магазин — низкие */
      for(let i=0;i<5;i++)K.box(5.4,i*.07,-33.4,.42,.07,.32,0xC0392B);K.rod(5.2,.4,-33.4,5.6,.4,-33.4,.02,0x222222);K.solid(5.19,5.61,-33.24,-33.56,.4);
      /* тележка у кассы */
      const cx=-4.3,cz=-60.0;K.box(cx,.45,cz,.52,.45,.82,0xB8BCC0,{glass:1});[[-1,0],[1,0]].forEach(([s])=>K.box(cx+s*.26,.45,cz,.02,.45,.82,0x9AA1A8));K.box(cx,.45,cz,.52,.02,.82,0x9AA1A8);K.box(cx,.9,cz,.52,.02,.82,0x9AA1A8);K.box(cx,.98,cz+.47,.56,.03,.03,0x2A2A2A);
      [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>{K.box(cx+a*.22,.06,cz+b*.36,.02,.4,.02,0x9AA1A8);K.cyl(cx+a*.22,0,cz+b*.36,.05,.03,0x111111,{rz:Math.PI/2})});K.solid(cx-.3,cx+.3,cz+.5,cz-.45,1.0,"ns");
      /* табличка «Касса» над кассой */
      K.rod(2.6,8.5,-60.0,2.6,2.95,-60.0,.015,0x333333);K.box(2.6,2.55,-60.0,1.0,.42,.04,0xB8322A);K.pic(2.6,2.76,-59.975,.96,.38,"lCash",{em:.95});K.pic(2.6,2.76,-60.025,.96,.38,"lCash",{ry:Math.PI,em:.95})})();

    /* — этап 6: «База Героев» — игровая арена по фотографиям автора, без торговых марок и персонажей.
       Зоны: вход (синий ковролин x 8,3…12,6): ниша с мишенями, монитор, щиток, ящики с дротиками, стойка с игрушечными бластерами;
       арена (x 12,6…22,4): стенки из оранжевых блоков ступенями, надувные бункеры, дерево, облака, жёлтые рамки, пунктир на полу;
       северо-восток: лестница в пять ступеней и площадка 1 м с парапетом; юго-восток: комната праздников. Координаты — абсолютные — */
    const NICHE={};
    BOOK&&(function(){const K=PROPS.kit("hb"),B=BASE_L,BASE2=BASE2_L,emb=embZ;
      const OR=[0xE8722A,0xEE7C34,0xDF6A22,0xF08038,0xE5772F],STEEL=0xB9BFC5,YEL=0xF2C21B,GREY=0xB7BDC3;
      /* стенка из блоков: от (x,z) вдоль +x (dir "x") или вдоль −z (dir "z"); cols — высота столбцов (в рядах по 0,2 м); holes — выпавшие блоки [столбец, ряд].
         Каждый столбец — отдельное препятствие со своим верхом: до 0,7 м — можно встать, выше — держит */
      const BR=.4,RH=.2,BT=.22;
      const bricks=(x,z,dir,cols,o)=>{o=o||{};const holes=o.holes||[],y0=o.y0||0;let n=0;
        cols.forEach((hc,c)=>{const cx=dir==="x"?x+BR*(c+.5):x,cz=dir==="x"?z:z-BR*(c+.5);
          for(let r=0;r<hc;r++){n++;if(holes.some(h=>h[0]===c&&h[1]===r))continue;K.box(cx,y0+r*RH,cz,dir==="x"?BR-.014:BT,RH-.01,dir==="x"?BT:BR-.014,OR[(c*7+r*3+n)%OR.length])}
          const ty=y0+hc*RH;[-1,1].forEach(s=>K.cyl(cx+(dir==="x"?s*.1:0),ty-.005,cz+(dir==="z"?s*.1:0),.055,.045,OR[(c+r0(c))%OR.length],{seg6:1}));
          const hx=dir==="x"?BR/2:BT/2,hz=dir==="x"?BT/2:BR/2;K.solid(cx-hx,cx+hx,cz+hz,cz-hz,ty,o.ns?"ns":0)})};
      const r0=c=>c%3;
      /* — арена: стенки ступенями (низ — встать, верх — укрытие), отдельные столбики, чтобы прыгать с блока на блок — */
      bricks(14.4,-3.0,"z",[2,4,6,6,6,6],{holes:[[3,2],[4,4]]});
      bricks(13.4,-13.4,"x",[1,2,3,3,6,7,7,5,2],{holes:[[5,3]]});
      bricks(16.6,-8.4,"x",[5,6,7,7,6,6],{holes:[[2,5],[4,1]]});
      
      bricks(17.6,-4.4,"x",[2,6,6,6,6,5,3,1],{holes:[[3,3]]});
      /* проход: низкие парные вставки убраны, чтобы между стенками оставались проходы шире фигуры */
      /* надувные бункеры: барабан, клин (серые скаты, синие торцы), большая подушка */
      const drum=(x,z)=>{K.cyl(x,0,z,.72,1.08,0x2C4FB8);K.cyl(x,1.08,z,.74,.16,0xC9CDD2);K.cyl(x,1.24,z,.6,.04,0x2C4FB8);K.solid(x-.66,x+.66,z+.66,z-.66,1.3)};
      drum(15.3,-6.2);drum(21.2,-14.6);
      const wedge=(x,z,len,h,w,ry)=>{const sx=h/.75,sz=w/.866;K.geo(PROPS.G.tri,x,.25*sx,z,sx,len,sz,0xBCC2C8,{rz:-Math.PI/2,ry});[-1,1].forEach(e=>K.geo(PROPS.G.tri,x+Math.cos(ry||0)*e*(len/2+.03),.25*sx*1.04,z-Math.sin(ry||0)*e*(len/2+.03),sx*1.04,.07,sz*1.04,0x2C4FB8,{rz:-Math.PI/2,ry}))};
      wedge(18.6,-14.7,1.8,1.05,1.4,0);K.solid(17.65,19.55,-14.05,-15.35,1.05);
      K.box(21.3,0,-8.6,1.2,1.0,1.1,0x2C4FB8);K.box(21.3,1.0,-8.6,1.24,.05,1.14,0xC9CDD2);K.solid(20.68,21.92,-8.03,-9.17,1.05);
      /* дерево: чёрный ствол, низкополигональная зелёная крона на круглом зелёном основании */
      const tx=18.2,tz=-10.8;K.cyl(tx,0,tz,.62,.05,0x3E8A3A);K.cyl(tx,.05,tz,.17,2.25,0x151515);K.cyl(tx,.05,tz,.22,.5,0x1C1C1C);K.geo(PROPS.G.ico,tx,2.86,tz,1.75,1.6,1.75,0x3F8B34,{ry:.4});K.solid(tx-.2,tx+.2,tz+.2,tz-.2,3,"ns");
      /* жёлтые рамки-ворота и пунктир на полу */
      const gate=(x,z,alongZ)=>{const ox=alongZ?0:.48,oz=alongZ?.48:0;[-1,1].forEach(e=>{K.box(x+e*ox,0,z+e*oz,.06,2.1,.06,YEL);K.solid(x+e*ox-.03,x+e*ox+.03,z+e*oz+.03,z+e*oz-.03,2.1,"ns")});K.box(x,2.07,z,alongZ?.06:1.02,.06,alongZ?1.02:.06,YEL)};
      gate(22.0,-6.9,true);gate(16.4,-14.9,false);
      for(let x=12.9;x<22.1;x+=.55)K.box(x,0,-9.75,.3,.006,.05,YEL,{x:x>20});
      /* облака под потолком: несколько икосаэдров, белые и серые, на тонких подвесах */
      const cloud=(x,y,z,s,col,xo)=>{[[0,0,0,1],[-.55,-.08,.1,.72],[.6,-.1,-.05,.76],[.15,.12,-.25,.6]].forEach(([a,b,c,k])=>K.geo(PROPS.G.ico,x+a*s,y+b*s,z+c*s,1.25*s*k,.82*s*k,1.0*s*k,col,{ry:a*2+x,x:xo}));K.rod(x,y+.3*s,z,x,B.H,z,.008,0x555A60,{x:1})};
      cloud(11.4,4.05,-6.2,1.0,0xF4F5F7);cloud(15.6,3.85,-4.2,1.25,0xF4F5F7);cloud(19.2,4.15,-7.6,1.1,0xEDEFF2,1);cloud(16.4,3.95,-13.4,1.0,0x9EA4AC);cloud(21.3,3.75,-11.9,.9,0xA8AEB5,1);cloud(26.4,4.1,-7.9,.95,0xF4F5F7,1);
      /* потолок: серебристые воздуховоды с хомутами и диффузорами, плафоны */
      [[-5.0,.28],[-12.5,.24]].forEach(([z,r])=>{K.tube(8.5,28.1,4.55,z,r,0xBFC4C9);for(let x=9.6;x<28;x+=2.2){K.tube(x-.05,x+.05,4.55,z,r+.025,0xA2A8AE,{x:1});K.rod(x,4.55+r,z,x,B.H,z,.02,0x6A7076,{x:1})}
        for(let x=11;x<27;x+=4.4)K.cyl(x,4.55-r-.22,z,.13,.22,0xD2D6DA,{x:1})});
      HALLZ[IB].pools.forEach(p=>{if(!p.c)K.cyl(p.x,B.H-.05,p.z-BZ,.22,.04,0xFFFFFF,{em:1.3})});
      /* стены: синий пояс под потолком, оранжевый кабель-канал, опуски кабеля */
      K.quad(18.3,4.55,B.z0-.012,20,.9,0x2445B5,{ry:Math.PI});K.quad(18.3,4.55,B.z1+.012,20,.9,0x2445B5);K.quad(B.x1-.012,4.55,-9,14,.9,0x2445B5,{ry:-Math.PI/2});K.quad(B.x0+.012,4.55,-9,14,.9,0x2445B5,{ry:Math.PI/2});
      K.box(18.3,3.96,B.z0-.03,20,.04,.04,0xE8622A);K.box(18.3,3.96,B.z1+.03,20,.04,.04,0xE8622A);K.box(B.x1-.03,3.96,-9,.04,.04,14,0xE8622A);K.box(B.x0+.03,3.96,-9,.04,.04,14,0xE8622A);
      [[12.45,B.z0-.03],[17.2,B.z0-.03],[23.0,B.z1+.03]].forEach(([x,z])=>K.box(x,.3,z,.035,3.66,.035,0xE8622A));
      /* — вход: проём изнутри, вывеска «База Героев» над ним, ковролин, низкая белая стенка с проходом на арену — */
      K.box(B.x0+.02,2.72,B.DZ,.04,.52,1.9,0x0E1A36);K.pic(B.x0+.045,2.98,B.DZ,1.8,.45,"sign",{ry:Math.PI/2,em:1});
      K.box(B.x0+.02,2.7,B.DZ+1.27,.04,.6,.62,0x0E1A36);emb(B.x0+.046,3.0,B.DZ+1.27,.52,Math.PI/2,IB);
      [[-4.1,4.2],[-14.9,2.2]].forEach(([z,d])=>{K.box(12.6,0,z,.12,1.1,d,0xE9EBED);K.box(12.6,1.1,z,.18,.04,d+.04,0xC9CDD2);K.solid(12.54,12.66,z+d/2,z-d/2,1.14,"ns")});
      /* ниша-шестиугольник: оранжевая рама, чёрное нутро, светящиеся мишени и маркеры (цвета меняются) */
      const nx=10.3,ny=1.95,nzF=B.z0-.5,R=.95,ap=R*Math.cos(Math.PI/6);NICHE.c=[nx,ny,nzF+BZ];
      for(let k=0;k<6;k++){const a=Math.PI/2+k*Math.PI/3,b=a+Math.PI/3,mx=(Math.cos(a)+Math.cos(b))/2*R,my=(Math.sin(a)+Math.sin(b))/2*R,ang=Math.atan2(Math.sin(b)-Math.sin(a),Math.cos(b)-Math.cos(a)),u=[mx/ap,my/ap];
        K.geo(PROPS.G.box,nx+u[0]*(ap+.08),ny+u[1]*(ap+.08),B.z0-.25,R+.2,.16,.5,0xF0801E,{rz:ang});
        K.geo(PROPS.G.box,nx+u[0]*(ap-.006),ny+u[1]*(ap-.006),B.z0-.25,R,.012,.48,0x0B0B0C,{rz:ang})}
      K.geo(PROPS.G.cyl6,nx,ny,B.z0-.02,2*R,.03,2*R,0x070708,{rx:Math.PI/2});
      K.box(nx+.55,0,B.z0-.2,.5,ny-ap-.06,.38,0xF0801E);K.box(nx-.45,0,B.z0-.15,.7,.62,.28,0xD5D9DD);K.solid(nx-R-.1,nx+R+.1,B.z0-.55,B.z0,3,"ns");
      [[0,-.12,.44,"nC"],[-.36,-.06,.24,"nT"],[.36,-.06,.24,"nT"],[0,.3,.24,"nT"],[0,.58,.2,"nT"]].forEach(([a,b,sz,m])=>K.pic(nx+a,ny+b,B.z0-.05,sz,sz,"target",{ry:Math.PI,em:1,cm:m}));
      [[-.56,.3],[.56,.3],[0,-.6]].forEach(([a,b])=>K.pic(nx+a,ny+b,B.z0-.05,.34,.34,"hexstar",{ry:Math.PI,em:1,cm:"nM"}));
      [[-.5,.35,.0],[.45,-.3,0],[0,-.55,0],[.1,.55,0]].forEach(([a,b])=>K.pic(nx+a,ny+b,B.z0-.06,.9,.9,"soft",{ry:Math.PI,em:.8,cm:"nW"}));
      /* монитор, щиток с лентой «осторожно» и треугольником, ящики с дротиками */
      K.box(11.95,1.84,B.z0-.04,.92,.56,.06,0xD8DCE0);K.pic(11.95,2.12,B.z0-.072,.84,.48,"screen",{ry:Math.PI,em:.8});K.box(11.95,1.7,B.z0-.03,.04,.14,.04,0x333333);
      K.box(11.95,0,B.z0-.17,.08,.36,.08,STEEL);K.box(11.95,.36,B.z0-.17,.6,1.0,.3,0xC9CCCF);K.pic(12.21,.86,B.z0-.322,.07,.98,"hazard",{ry:Math.PI});K.pic(11.84,1.18,B.z0-.322,.11,.1,"warn",{ry:Math.PI});
      K.solid(11.6,12.3,B.z0-.33,B.z0,1.36,"ns");
      [[11.0,0x1A1A1C,0],[11.62,YEL,1]].forEach(([x,c,i])=>{K.box(x,0,-3.35,.58,.82,.52,c);K.box(x,.62,-3.35,.5,.18,.44,0xDDE6EA,{glass:1});K.pic(x,.8,-3.35,.46,.4,"darts",{rx:-Math.PI/2,sub:[i,2]});K.solid(x-.29,x+.29,-3.09,-3.61,.84,"ns");
        for(let d=0;d<5;d++)K.cyl(x-.15+d*.07,.81,-3.3+(d%2)*.06,.022,.1,i?0xF0742A:0x2F5FE0,{rz:1.2+d*.3,x:1})});
      /* этап 10: арсенал у входа (южная стена входной зоны; прежняя стойка с бластерами влилась сюда): трафарет «[АРСЕНАЛ]», чёрная перфопанель
         с игрушечными бластерами (обобщённые формы — без марок, названий и надписей), под ней информационная доска (абстрактная схема),
         высокий оранжевый шкаф с открытыми ячейками, ящиками и белой панелью, вешалка с чёрными плечиками, чёрный кейс на полу, трафарет на полу */
      const blaster=(x,y,z,c1,c2,s)=>{K.geo(PROPS.G.box,x,y,z,.44*s,.11*s,.05,c1);K.geo(PROPS.G.box,x+.29*s,y+.025*s,z,.16*s,.05*s,.04,c2);K.geo(PROPS.G.box,x-.13*s,y-.1*s,z,.06*s,.15*s,.045,c2,{rz:-.28});
        K.geo(PROPS.G.box,x+.04*s,y-.09*s,z,.06*s,.12*s,.04,0x2A2A2C);K.geo(PROPS.G.box,x-.02*s,y+.07*s,z,.2*s,.03*s,.03,c2);K.geo(PROPS.G.box,x-.27*s,y-.01*s,z,.1*s,.08*s,.045,c1)};
      const AZ=B.z1+.012;
      K.pic(10.1,2.88,AZ+.002,1.25,.31,"ars",{});
      K.box(10.1,1.32,AZ+.012,1.22,1.22,.024,0x101114);K.pic(10.1,1.93,AZ+.026,1.18,1.18,"peg",{});
      [[1.18,0xF2D21E,0xF07A1E,1.25,9.85],[1.48,0xF2D21E,0xF07A1E,1.25,9.85],[1.78,0xE8481E,0xF4F4F4,1.15,9.88],[2.1,0xE8481E,0x2A2A2C,1.15,9.88]].forEach(([y,c1,c2,s_,x])=>blaster(x,y+.2,AZ+.06,c1,c2,s_));
      K.geo(PROPS.G.box,10.55,1.95,AZ+.06,.1,.62,.06,0x2C5BD8);K.geo(PROPS.G.box,10.55,1.95,AZ+.07,.05,.5,.05,0xF4F4F4);K.geo(PROPS.G.box,10.55,1.62,AZ+.06,.12,.12,.05,0x2A2A2C);
      K.box(10.1,.5,AZ+.015,1.3,.84,.03,0xA9AEB4);K.pic(10.1,.92,AZ+.032,1.22,.76,"info",{em:.2});
      /* шкаф: оранжевый корпус 1,4 × 0,6 × 2,4 м */
      const CX0=10.85,CX1=12.25,CZ0=AZ+.02,CZ1=CZ0+.6,OR_=0xF08A1E,cz_=(CZ0+CZ1)/2,fz_=CZ1;
      K.box((CX0+CX1)/2,0,cz_,CX1-CX0,.08,.6,0xC96A12);K.box((CX0+CX1)/2,2.34,cz_,CX1-CX0,.06,.6,OR_);[CX0+.03,CX1-.03,11.3].forEach(x=>K.box(x,.08,cz_,.06,2.26,.6,OR_));
      K.box(11.075,1.2,cz_-.04,.4,1.1,.5,0x111214);K.box(11.075,.12,fz_-.03,.4,1.0,.02,0xF2F2F0);
      [[11.06,2.05,0xE8481E],[11.06,1.75,0xF07A1E],[11.06,1.45,0xF2D21E]].forEach(([x,y,c])=>blaster(x,y,fz_-.06,c,0x2A2A2C,.62));
      [[11.0,.85,0x2C5BD8],[11.12,.55,0xF07A1E],[11.0,.3,0xF2D21E]].forEach(([x,y,c])=>K.geo(PROPS.G.box,x,y,fz_-.05,.06,.22,.05,c,{rz:.5}));
      [[1.55,2.3],[1.0,1.5]].forEach(([y0,y1])=>{K.box(11.775,y1,cz_,.95,.04,.6,OR_);K.box(11.775,y0-.04,cz_,.95,.04,.6,OR_);K.box(11.775,y0,cz_,.04,y1-y0,.6,OR_);
        [11.54,12.01].forEach(x=>{K.box(x,y0,cz_-.06,.42,y1-y0,.46,0x111214);blaster(x,y0+(y1-y0)*.55,fz_-.12,[0xE8481E,0xF07A1E][Math.round(x)%2],0xF4F4F4,.75)})});
      K.box(11.525,.1,fz_-.01,.44,.9,.02,0xF4A040);[.4,.7].forEach(y=>K.box(11.525,y,fz_+.001,.42,.006,.004,0x8A4A10,{x:1}));K.box(12.0,.1,fz_-.01,.5,.9,.02,0xF2F2F0);K.box(11.3,.55,fz_+.005,.03,.04,.01,0x111111);
      K.solid(CX0,CX1,CZ0-.02,CZ1,2.4,"ns");
      /* вешалка: хромированная рама, чёрные плечики */
      const RX=8.95,RZ=AZ+.48;[-1,1].forEach(e=>{K.box(RX+e*.42,0,RZ,.03,1.62,.03,0xC9CDD1);K.box(RX+e*.42,0,RZ,.04,.03,.5,0xC9CDD1)});K.box(RX,1.6,RZ,.88,.025,.025,0xC9CDD1);
      for(let i=0;i<6;i++)K.box(RX-.3+i*.05,1.42,RZ,.012,.18,.38,0x141414,{rx:.05,x:1});K.solid(RX-.45,RX+.45,RZ-.25,RZ+.25,1.62,"ns");
      /* чёрный кейс и трафарет на полу */
      K.box(11.5,0,CZ1+.45,.78,.36,.5,0x151618);[-.2,0,.2].forEach(a=>K.box(11.5+a,.36,CZ1+.45,.06,.02,.52,0x222326,{x:1}));K.box(11.5,.38,CZ1+.45,.6,.06,.3,0x7A6A5A,{uv:"fab",tint:0x8A6A5A,rz:.1,x:1});K.solid(11.11,11.89,CZ1+.2,CZ1+.7,.38);
      K.pic(10.4,.004,AZ+1.55,1.3,.32,"arsF",{rx:-Math.PI/2});
      /* «База А» по новым фото: красные бочки с жёлтыми крышками, башня с огоньками, монитор с эмблемой, надписи «БАЗА [А]»,
         двойные серые двери «ВЫХОД», лента «осторожно» вокруг проёмов, чёрные шестиугольные таблички с белой звездой */
      const barrel=(K2,x,z)=>{K2.cyl(x,0,z,.29,.86,0xC8261E);[.2,.43,.66].forEach(y=>K2.cyl(x,y,z,.3,.03,0xA81E18,{x:1}));K2.cyl(x,.86,z,.29,.02,0xF2C21B);K2.solid(x-.29,x+.29,z+.29,z-.29,.88)};
      const tower=(K2,x,z,cell,c,cmA,cmB,lit)=>{K2.cyl(x,0,z,.52,.12,0x1A1B1E);K2.box(x,.12,z,.44,1.42,.36,0xFFFFFF,{uv:cell});
        K2.geo(PROPS.G.box,x,1.62,z-.06,.46,.36,.04,0xF2F3F5,{rx:-.5});K2.geo(PROPS.G.tri,x,1.62,z-.04,.44,.06,.42,c,{rx:Math.PI/2-.5});
        [[0,1.7],[-.1,1.62],[.1,1.62],[-.05,1.54],[.05,1.54],[0,1.46]].forEach(([a,b],i)=>K2.sph(x+a,b,z-.09-(1.7-b)*.55,.036,lit,{cm:i%2?cmB:cmA,em:1.5}));
        K2.solid(x-.22,x+.22,z+.18,z-.24,1.8,"ns");K2.solid(x-.52,x+.52,z+.52,z-.52,.12)};
      barrel(K,13.6,-7.3);/* этап 14: бочка у щели между клином и барабаном отодвинута — проход в карман у южной стены честный (≈1 м) */barrel(K,19.0,-12.55);barrel(K,24.0,-9.0);tower(K,17.3,-9.0,"towA",0xD12A26,"tA1","tA2",0xFFF0D8);
      K.box(19.5,1.86,B.z0-.04,1.0,.6,.06,0x151618);K.pic(19.5,2.16,B.z0-.072,.92,.52,"monO",{ry:Math.PI,em:1});emb(19.5,2.16,B.z0-.08,.44,Math.PI,IB);
      K.pic(B.x1-.014,3.25,BASE2.DZ,2.0,.5,"labA",{ry:-Math.PI/2});K.pic(15.2,3.3,B.z1+.014,2.0,.5,"labA",{});
      /* проём в «Базу Б»: откосы с лентой «осторожно» */
      [-1,1].forEach(e=>{const zz=BASE2.DZ+e*BASE2.DW;K.box(B.x1+.15,0,zz,.3,BASE2.DH,.02,0x9EA3AA);K.pic(B.x1-.013,BASE2.DH/2,zz+e*.06,.12,BASE2.DH,"hazard",{ry:-Math.PI/2})});
      K.pic(B.x1-.013,BASE2.DH+.06,BASE2.DZ,BASE2.DW*2+.24,.12,"hazard",{ry:-Math.PI/2});
      [-1,1].forEach(e=>K.pic(B.x0+.013,B.DH/2,B.DZ+e*(B.DW+.06),.12,B.DH,"hazard",{ry:Math.PI/2}));K.pic(B.x0+.013,B.DH+.06,B.DZ,B.DW*2+.24,.12,"hazard",{ry:Math.PI/2});
      /* двойные серые двери выхода (закрыты, на стене) и зелёная табличка */
      const EX=16.9,EZ=B.z0-.012;K.box(EX,0,EZ-.02,1.56,2.16,.04,0x6E7378);[-1,1].forEach(e=>{K.box(EX+e*.37,0,EZ-.045,.72,2.08,.03,0xA9AEB3);K.box(EX+e*.12,1.02,EZ-.07,.16,.03,.03,0x2A2A2A)});
      [-1,1].forEach(e=>K.pic(EX+e*.84,1.1,EZ-.004,.1,2.2,"hazard",{ry:Math.PI}));K.pic(EX,2.25,EZ-.004,1.78,.1,"hazard",{ry:Math.PI});K.box(EX,2.38,EZ-.04,.6,.18,.04,0x0E3A1E);K.pic(EX,2.47,EZ-.065,.56,.15,"exitS",{ry:Math.PI,em:1.2});
      /* шестиугольные таблички со звездой */
      const plaque=(K2,x,y,z,ry)=>{const dx=Math.sin(ry),dz=Math.cos(ry);K2.geo(PROPS.G.cyl6,x,y,z,.5,.03,.5,0x0E0E10,{rx:Math.PI/2,ry});K2.pic(x+dx*.02,y,z+dz*.02,.34,.34,"hexstar",{ry,em:.6})};
      plaque(K,13.2,3.05,B.z0-.02,Math.PI);plaque(K,23.4,3.05,B.z0-.02,Math.PI);plaque(K,B.x1-.02,3.05,-12.4,-Math.PI/2);plaque(K,B.x1-.02,3.05,-3.6,-Math.PI/2);plaque(K,18.5,3.05,B.z1+.02,0);
      PROPS.base={barrel,tower,plaque,blaster};

      /* — северо-восток: лестница (пять ступеней по 0,2 м, оранжевые проступи, стальные поручни) и площадка высотой 1 м — */
      const PX0=24.4,PZ1=-6.6,PH=1.0,SX0=22.4,SZ0=-3.0,SZ1=-4.8;
      K.box((PX0+B.x1)/2,0,(B.z0+PZ1)/2,B.x1-PX0,PH-.04,B.z0-PZ1,0x8F959C);K.box((PX0+B.x1)/2,PH-.04,(B.z0+PZ1)/2,B.x1-PX0+.02,.04,B.z0-PZ1+.02,0xC4532E);K.solid(PX0,B.x1,PZ1,B.z0,PH,1);
      for(let k=1;k<=5;k++){const x0=SX0+(k-1)*.4,top=.2*k;K.box(x0+.2,0,(SZ0+SZ1)/2,.4,top-.035,SZ0-SZ1,0x9AA0A6);K.box(x0+.2,top-.035,(SZ0+SZ1)/2,.42,.035,SZ0-SZ1+.01,0xD0582F);K.solid(x0,x0+.4,SZ1,SZ0,top,1)}
      [SZ0,SZ1].forEach(z=>{K.cyl(SX0+.05,0,z,.025,1.12,STEEL);K.cyl(PX0-.02,0,z,.025,1.92,STEEL);K.rod(SX0+.05,1.1,z,PX0-.02,1.9,z,.045,STEEL);K.solid(SX0,PX0,z+.04,z-.04,3,"ns")});
      bricks(PX0-.05,PZ1+.11,"x",[3,3,3,3,3,3,3,3,3,3],{y0:PH,ns:1});bricks(PX0+.11,B.z0,"z",[3,3],{y0:PH,ns:1});
      K.pic(PX0+.07,PH+.003,(SZ1+PZ1+.22)/2,.14,SZ1-PZ1-.24,"hazard",{rx:-Math.PI/2});
      K.box(22.9,0,-2.45,.55,.9,.5,0x1A1A1C);K.box(22.9,.66,-2.45,.46,.2,.4,0xDDE6EA,{glass:1});K.solid(22.62,23.18,-2.2,-2.7,.92,"ns");
      K.box(22.0,0,-5.5,.5,.92,.5,0xF2B01E);K.solid(21.75,22.25,-5.25,-5.75,.92);
      /* плакат-брызги над площадкой и звезда в круге на стене */
      K.box(B.x1-.03,1.95,-4.3,.03,1.9,2.7,0xD8DCE0);K.pic(B.x1-.05,2.9,-4.3,2.6,1.8,"splash",{ry:-Math.PI/2,em:.85});
      emb(21.0,2.9,B.z0-.014,.9,Math.PI,IB);
      /* — комната праздников: белые перегородки, синяя светодиодная лента, длинный стол со скатертью, тарелки и стаканы, жёлтые пуфы, звёзды из фольги — */
      const QX=22.8,QZ=-9.4,QH=2.8;K.box((QX+B.x1)/2,0,QZ,B.x1-QX,QH,.1,0xEEF0F2);K.solid(QX,B.x1,QZ+.05,QZ-.05,QH,"ns");
      [[QZ,-11.6],[-13.4,B.z1]].forEach(([a,b])=>{K.box(QX,0,(a+b)/2,.1,QH,a-b,0xEEF0F2);K.solid(QX-.05,QX+.05,a,b,QH,"ns")});
      K.box((QX+B.x1)/2,QH,QZ,B.x1-QX,.04,.12,0xD5D9DD);K.box(QX,QH,(QZ+B.z1)/2,.12,.04,QZ-B.z1,0xD5D9DD);
      K.box((QX+B.x1)/2,2.55,QZ-.065,B.x1-QX-.1,.03,.02,0x3FB8FF,{em:1.5});K.box(QX+.065,2.55,(QZ+B.z1)/2,.02,.03,QZ-B.z1,0x3FB8FF,{em:1.5});K.box(B.x1-.03,2.55,(QZ+B.z1)/2,.02,.03,QZ-B.z1,0x3FB8FF,{em:1.5});K.box((QX+B.x1)/2,2.55,B.z1+.03,B.x1-QX,.03,.02,0x3FB8FF,{em:1.5});
      for(let i=0;i<8;i++)K.box(QX-.3,0,-11.75-i*.2,.12,.006,.1,i%2?0x141414:YEL,{x:1});
      const tcx=25.8,tcz=-12.9;K.box(tcx,.71,tcz,1.0,.04,2.4,0xEDEDED);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>K.box(tcx+a*.44,0,tcz+b*1.1,.05,.71,.05,0x9AA0A6));
      K.pic(tcx,.755,tcz,1.12,2.52,"cloth",{rx:-Math.PI/2});[-1,1].forEach(e=>{K.pic(tcx+e*.565,.55,tcz,2.52,.42,"cloth",{ry:e*Math.PI/2,sub:[0,1,0,2]});K.pic(tcx,.55,tcz+e*1.265,1.12,.42,"cloth",{ry:e>0?0:Math.PI,sub:[0,1,1,2]})});
      K.solid(tcx-.57,tcx+.57,tcz+1.27,tcz-1.27,.76);
      for(let i=0;i<6;i++){const px=tcx+(i%2?.27:-.27),pz=tcz-.8+Math.floor(i/2)*.8;K.cyl(px,.756,pz,.11,.012,0xF6F6F6,{x:1});K.cyl(px,.762,pz,.07,.006,[0x2C5BD8,0xE2452C,0x2BA36B][i%3],{x:1});K.cyl(px+(i%2?-.15:.15),.756,pz+.16,.04,.1,[0x2C5BD8,0xF2B21E,0x2BA36B][(i+1)%3],{x:1})}
      [[24.75,-12.2],[24.75,-13.6],[26.85,-12.2],[26.85,-13.6]].forEach(([x,z])=>{K.cyl(x,0,z,.26,.42,0xF2B61E);K.cyl(x,.42,z,.24,.012,0xE0A417);K.solid(x-.24,x+.24,z+.24,z-.24,.42)});
      [[23.7,1.95,-10.2,0x2B53D6,.62,.2],[24.3,1.7,-10.0,0xD9A62A,.5,-.3],[27.6,1.9,-10.2,0x2B53D6,.55,.4],[27.8,1.65,-15.2,0xD9A62A,.6,-.2],[23.5,1.8,-15.3,0xD9A62A,.5,.1]].forEach(([x,y,z,c,s,r])=>{
        K.geo(PROPS.G.star,x,y,z,s,s,s,c,{ry:r,rz:r*.3});K.rod(x,y-.24*s,z,x+.06,0,z+.04,.006,0xC9D6F0,{x:1})});
      K.sph(23.4,.13,-14.9,.13,0x2E5BD8,{x:1})})();
    /* — этап 10: «База Б» по фото: симметричная расстановка блоков (П-образный форт у входа со ступенчатыми столбиками, пары стенок слева и справа,
       задняя стенка), бело-синяя башня с огоньками, стопка красно-коричневых кирпичей у правой (северной) стены, монитор с эмблемой, красные бочки,
       две серые рулонные шторы на сиреневой стене, фиолетовая светодиодная лента вдоль пола, серебристые воздуховоды и ряды линейных ламп,
       жёлтый пунктир на полу, шестиугольные таблички. Блоки — те же, что в «А»: столбец — препятствие со своим верхом (до 0,96 м достаётся прыжком) — */
    BOOK&&(function(){const K=PROPS.kit("hb2"),B=BASE2_L,BASE=BASE_L,emb=embZ,Q=PROPS.base,OR=[0xE8722A,0xEE7C34,0xDF6A22,0xF08038,0xE5772F],YEL=0xF2C21B,BR=.4,RH=.2,BT=.22;
      const bricks=(x,z,dir,cols)=>{let n=0;cols.forEach((hc,c)=>{const cx=dir==="x"?x+BR*(c+.5):x,cz=dir==="x"?z:z-BR*(c+.5);
          for(let r=0;r<hc;r++){n++;K.box(cx,r*RH,cz,dir==="x"?BR-.014:BT,RH-.01,dir==="x"?BT:BR-.014,OR[(c*7+r*3+n)%OR.length])}
          K.box(cx,0,cz,dir==="x"?BR+.002:BT-.06,hc*RH-.03,dir==="x"?BT-.06:BR+.002,0xB8561C,{x:1});/* сердцевина: щели между блоками не просвечивают */
          const ty=hc*RH;[-1,1].forEach(s_=>K.cyl(cx+(dir==="x"?s_*.1:0),ty-.005,cz+(dir==="z"?s_*.1:0),.055,.045,OR[c%OR.length],{seg6:1}));
          const hx_=dir==="x"?BR/2:BT/2,hz_=dir==="x"?BT/2:BR/2;K.solid(cx-hx_,cx+hx_,cz+hz_,cz-hz_,ty)})};
      /* П-образный форт: стенка поперёк оси и два крыла со ступенями к входу */
      bricks(32.6,-6.8,"z",[7,7,7,7,7,7]);bricks(31.0,-6.69,"x",[1,2,4,7]);bricks(31.0,-9.31,"x",[1,2,4,7]);
      /* пары стенок справа (север) и слева (юг) — зеркально относительно оси z = −8 */
      [1,-1].forEach(e=>{bricks(35.0,-8+e*3.4,"x",[2,4,5,5,5,4,2]);bricks(35.8,-8+e*4.4,"x",[6,6,6,6])});
      bricks(41.6,-6.8,"z",[5,6,7,7,6,5]);
      Q.tower(K,38.6,-8,"towB",0x2450C6,"tB1","tB2",0xFFFFFF);
      Q.barrel(K,34.2,-2.6);Q.barrel(K,44.6,-12.9);Q.barrel(K,39.9,-10.7);
      /* стопка красно-коричневых кирпичей у северной стены */
      const RB=[0x8E3A2E,0x9C4434,0x7E3226,0xA04A38];for(let r=0;r<5;r++)for(let c=0;c<2;c++)for(let k=0;k<2;k++)K.box(43.75+c*.42,r*.22,-2.05-k*.3,.4,.21,.28,RB[(r+c*2+k)%4]);K.solid(43.54,44.38,-1.9,-2.5,1.1);
      /* монитор с эмблемой (северная стена), дверь «ВЫХОД» (восточная стена) */
      K.box(45.2,1.9,B.z0-.04,1.1,.64,.06,0x151618);K.pic(45.2,2.22,B.z0-.072,1.02,.56,"monO",{ry:Math.PI,em:1});emb(45.2,2.22,B.z0-.08,.48,Math.PI,IB2);
      const DZ_=-3.4;K.box(B.x1-.02,0,DZ_,.04,2.12,1.0,0x6E7378);K.box(B.x1-.045,0,DZ_,.03,2.06,.9,0xA9AEB3);K.box(B.x1-.07,1.0,DZ_+.3,.03,.03,.14,0x2A2A2A);
      [-1,1].forEach(e=>K.pic(B.x1-.004,1.1,DZ_+e*.56,.1,2.2,"hazard",{ry:-Math.PI/2}));K.box(B.x1-.04,2.3,DZ_,.04,.18,.6,0x0E3A1E);K.pic(B.x1-.065,2.39,DZ_,.56,.15,"exitS",{ry:-Math.PI/2,em:1.2});
      /* две рулонные шторы на сиреневой (южной) стене, на каждой — эмблема, как на фото */
      [31.6,34.9].forEach(x=>{K.box(x,2.65,B.z1+.12,2.7,.32,.24,0xB9BDC2);K.pic(x,1.33,B.z1+.016,2.5,2.62,"shutter",{});[-1,1].forEach(e=>K.box(x+e*1.27,0,B.z1+.04,.06,2.65,.08,0x9EA3AA));emb(x,1.6,B.z1+.03,.9,0,IB2)});
      /* откосы проёма из «А» — лента «осторожно» */
      [-1,1].forEach(e=>K.pic(B.x0+.013,B.DH/2,B.DZ+e*(B.DW+.06),.12,B.DH,"hazard",{ry:Math.PI/2}));K.pic(B.x0+.013,B.DH+.06,B.DZ,B.DW*2+.24,.12,"hazard",{ry:Math.PI/2});
      /* фиолетовая светодиодная лента вдоль пола и её отсвет на полу */
      const PU=0xB45CFF,W=B.x1-B.x0,D=B.z0-B.z1,cx=(B.x0+B.x1)/2,cz=(B.z0+B.z1)/2;
      K.box(cx,.03,B.z0-.02,W,.025,.02,PU,{em:1.7});K.box(cx,.03,B.z1+.02,W,.025,.02,PU,{em:1.7});K.box(B.x1-.02,.03,cz,.02,.025,D,PU,{em:1.7});
      [[B.z0-B.DZ-B.DW,B.z0],[B.DZ-B.DW,B.z1]].forEach(([a,b])=>{});K.box(B.x0+.02,.03,(B.z0+B.DZ+B.DW)/2,.02,.025,B.z0-B.DZ-B.DW,PU,{em:1.7});K.box(B.x0+.02,.03,(B.z1+B.DZ-B.DW)/2,.02,.025,B.DZ-B.DW-B.z1,PU,{em:1.7});
      K.pic(cx,.006,B.z0-.3,W,.6,"ledglow",{rx:-Math.PI/2,glass:1,tint:0x7A30C8});K.pic(cx,.006,B.z1+.3,W,.6,"ledglow",{rx:-Math.PI/2,ry:Math.PI,glass:1,tint:0x7A30C8});K.pic(B.x1-.3,.006,cz,D,.6,"ledglow",{rx:-Math.PI/2,ry:Math.PI/2,glass:1,tint:0x7A30C8});
      /* потолок: воздуховоды, линейные лампы */
      [-6.2,-9.8].forEach((z,i)=>{K.tube(B.x0+.1,B.x1-.1,4.45,z,.27-i*.04,0xC4C9CE);for(let x=B.x0+1.2;x<B.x1;x+=2.4){K.tube(x-.05,x+.05,4.45,z,.3-i*.04,0xA2A8AE,{x:1});K.rod(x,4.6,z,x,B.H,z,.02,0x6A7076,{x:1})}});
      HALLZ[IB2].pools.forEach(p=>{if(!p.c){p={x:p.x,z:p.z-BZ};K.box(p.x,4.82,p.z,1.5,.05,.12,0xD5D9DD);K.box(p.x,4.815,p.z,1.42,.01,.08,0xFFFFFF,{em:1.4});K.rod(p.x-.6,4.87,p.z,p.x-.6,B.H,p.z,.008,0x555A60,{x:1});K.rod(p.x+.6,4.87,p.z,p.x+.6,B.H,p.z,.008,0x555A60,{x:1})}});
      /* жёлтый пунктир */
      for(let x=33.2;x<41.2;x+=.55)K.box(x,0,-5.6,.3,.006,.05,YEL,{x:x>37});for(let x=33.2;x<41.2;x+=.55)K.box(x,0,-10.4,.3,.006,.05,YEL,{x:x>37});
      for(let z=-3;z>-13.2;z-=.55)K.box(43.2,0,z,.05,.006,.3,YEL,{x:z<-8});
      /* шестиугольные таблички со звездой */
      Q.plaque(K,33.5,3.1,B.z0-.02,Math.PI);Q.plaque(K,40.5,3.1,B.z0-.02,Math.PI);Q.plaque(K,B.x1-.02,3.1,-11.2,-Math.PI/2);Q.plaque(K,B.x0+.02,3.1,-3.4,Math.PI/2);Q.plaque(K,40.0,3.1,B.z1+.02,0)})();

    /* ---- сборщики предметов комнаты (ROOMB): (K — набор комнаты, R_ — комната, x, z, параметры). Препятствия — по видимым поверхностям;
       многоуровневые (диван со спинкой и подлокотниками, стул) — несколькими коробками; R_.list — перечень с высотами (для отчёта и проверок) ---- */
    const PHOTOS=[];
    const ROOMB=(function(){const G=PROPS.G,hx=c=>new T.Color(c).getHex();
      const sol=(K,R_,lab,x0,x1,z0,z1,top,ns,bot)=>{K.solid(Math.min(x0,x1),Math.max(x0,x1),z0,z1,top,ns?"ns":0,bot);R_.list.push([lab,+top.toFixed(3),bot||0,ns?"нельзя встать":"можно встать"])};
      const leaf=(K,x,y,z,s,c,ry,rx)=>K.geo(G.sph,x,y,z,s*.42,s*.05,s*.22,c,{ry,rx,x:1});
      return {
      /* диван вдоль стены: x — стена, z — ближний край, l — длина вдоль стены, d — глубина */
      sofa(K,R_,x,z,o){const l=o.l||2.6,d=o.d||.95,c=o.c||"#D88878",c2=o.c2||c,sg=x<0?1:-1,xm=x+sg*d/2,zc=z-l/2,sl=(l-.5)/2;
        K.box(xm,0,zc,d,.28,l,c);K.box(x+sg*.13,0,zc,.26,.85,l,c);[z-.125,z-l+.125].forEach(az=>K.box(xm,0,az,d,.62,.25,c));
        [0,1].forEach(i=>{const cz=z-.25-sl/2-i*sl;K.box(x+sg*(.26+(d-.26)/2),.28,cz,d-.28,.17,sl-.02,c2);K.box(x+sg*.36,.42,cz,.18,.4,sl-.04,c2,{rz:-sg*.13})});
        K.box(x+sg*.48,.45,z-.48,.14,.42,.42,o.cushion||"#E7E2D7",{rz:-sg*.3,ry:.25});K.box(x+sg*.47,.45,z-.48,.15,.004,.43,0xC9B9A6,{rz:-sg*.3,ry:.25,x:1});
        sol(K,R_,"диван: сиденье",x+sg*.26,x+sg*d,z-.25,z-l+.25,.45);sol(K,R_,"диван: спинка",x,x+sg*.26,z,z-l,.85);
        sol(K,R_,"диван: подлокотник",x,x+sg*d,z,z-.25,.62);sol(K,R_,"диван: подлокотник",x,x+sg*d,z-l+.25,z-l,.62)},
      /* комод на ножках у стены x: две дверцы, колонка из четырёх ящиков, на нём пальма, горшочки, свеча, ваза с узором */
      sideboard(K,R_,x,z,o){const l=o.l||1.45,d=o.d||.46,h=o.h||.78,sg=x>0?-1:1,xm=x+sg*d/2,zc=z-l/2,fx=x+sg*d,TK=0xFFFFFF;
        [[.08,.08],[.08,l-.08],[d-.08,.08],[d-.08,l-.08]].forEach(([a,b])=>K.box(x+sg*a,0,z-b,.035,.21,.035,0x6A3A1C,{rz:sg*(a<.1?.06:-.06)}));
        K.box(xm,.2,zc,d,h-.22,l,0xC7835A,{uv:"teak"});K.box(xm,h-.02,zc,d+.02,.02,l+.02,0xC9875C,{uv:"teak"});
        const dW=(l-.5)/2;[[z-dW/2],[z-l+dW/2]].forEach(([cz])=>K.pic(fx+sg*.002,.2+(h-.22)/2,cz,dW-.02,h-.26,"teak",{ry:sg>0?Math.PI/2:-Math.PI/2,tint:0xE2A070}));
        for(let i=0;i<4;i++){const y=.22+i*(h-.24)/4;K.box(fx+sg*.004,y,zc,.006,.006,.48,0x4A2A14,{x:1});K.box(fx+sg*.006,y+(h-.24)/8,zc,.006,.018,.12,0x2A1608)}
        [z-dW,z-l+dW].forEach(sz=>K.box(fx+sg*.004,.2,sz,.006,h-.22,.006,0x4A2A14));
        const top=h,ix=x+sg*d/2;
        K.cyl(ix,top,z-.2,.09,.17,0x8E9296);for(let i=0;i<9;i++)leaf(K,ix+Math.sin(i*.7)*.05,top+.3+i%3*.06,z-.2+Math.cos(i*.7)*.05,1.0,[0x4E8A3E,0x5E9A48,0x3E7A34][i%3],i*.7,.5+i%3*.25);
        K.cyl(ix,top,z-.42,.045,.07,0xEDEDEA,{x:1});K.cone(ix,top+.07,z-.42,.04,.08,0x5E8A4E,{x:1});K.cyl(ix-.02*sg,top,z-.56,.04,.06,0xF0E6E6,{x:1});K.cyl(ix-.02*sg,top+.04,z-.56,.038,.02,0xD87A8A,{x:1});
        K.cyl(ix,top,z-l+.55,.06,.16,0x6E7A5E);K.cyl(ix,top,z-l+.25,.12,.26,0xFFFFFF,{uv:"vase",tint:0xE8EAE6});
        sol(K,R_,"комод",x,x+sg*d,z,z-l,h)},
      /* фотография владельца на стене (картина, снимок): своя текстура из файла, грузится лениво, когда посетитель в коридоре или в комнате;
         пока не загрузилась или если не загрузилась — тёмная панель. interactive — подсветка ближайшего и E / «смотреть» открывают крупно */
      photo(K,R_,x,z,o){const F=R_.F,w=R_.r.w,d=R_.r.d,W_=o.w||1,H_=o.h||1,y=o.y||1.6;let nx=0,nz=0;
        if(Math.abs(x)>=w/2-.05)nx=x>0?-1:1;else if(z>=-.05)nz=-1;else nz=1;
        const p=frameP(F,x+nx*.032,z+nz*.032),ry=F.rot+Math.atan2(nx,nz),mat=new T.MeshBasicMaterial({color:0x26221E}),me=new T.Mesh(new T.PlaneGeometry(W_,H_),mat);
        me.position.set(p[0],y,p[1]);me.rotation.y=ry;S.add(me);K.box(x+nx*.015,y-H_/2,z+nz*.015,nx?.03:W_,H_,nx?W_:.03,0x1E1A16);
        const ph={src:String(o.src||""),caption:String(o.caption||""),mesh:me,mat,tex:null,state:o.src?"wait":"none",hi:R_.hi};PHOTOS.push(ph);BR.surf.push({hi:R_.hi,m:me});
        const q=frameP(F,x+nx*.62,z+nz*.62);me.userData.hb={x:q[0],z:q[1],top:y+H_/2,r:.7};
        if(o.interactive!==false&&o.src){me.userData.photo=ph;me.userData.label=ph.caption||"Фотография";clickable.push(me)}
        R_.list.push(["фотография: "+(ph.caption||ph.src),+(y+H_/2).toFixed(2),+(y-H_/2).toFixed(2),"на стене"])},
      /* ёлка (по дате) или большое растение в углу */
      tree(K,R_,x,z,o){const on=o.season===true||(o.season!==false&&treeSeason());R_.tree=on;
        if(on){K.cyl(x,0,z,.5,.12,0x1D3A2A);K.cyl(x,.1,z,.06,.2,0x2A2018);
          const lv=[[.58,.25,.62],[.5,.62,.55],[.4,.98,.5],[.3,1.3,.45],[.2,1.58,.4],[.11,1.82,.3]];
          lv.forEach(([rr,y,hh],i)=>{K.cone(x,y,z,rr,hh,i%2?0x18251D:0x1C2A21);K.cone(x+.02,y+.02,z-.02,rr*.92,hh*.95,0x121C16,{ry:.5,x:1})});
          K.cone(x,2.08,z,.025,.2,0xE8E4DC);K.sph(x,2.1,z,.035,0xE8E4DC);
          const BC=[0x2E5ECC,0x2A9A9A,0xC98A30,0xB8403A,0xC9CED4,0x3A7AD0,0xD8B04A];
          for(let i=0;i<16;i++){const t=(i*.618)%1,y=.4+t*1.45,rr=.6*(1-t*.78)+.02,a=i*2.4;K.sph(x+Math.sin(a)*rr,y,z+Math.cos(a)*rr,.04+(i%3)*.012,BC[i%BC.length])}
          const LC=[0x4FA8FF,0x55E8C8,0xFFD27A,0xFF7AC8,0x8AE860,0x6A8CFF];
          for(let i=0;i<46;i++){const t=(i*.381)%1,y=.32+t*1.6,rr=.62*(1-t*.8)+.03,a=i*1.7;K.sph(x+Math.sin(a)*rr,y,z+Math.cos(a)*rr,.016,LC[i%LC.length],{blink:"led",em:1.6})}
          sol(K,R_,"ёлка",x-.55,x+.55,z-.55,z+.55,2.1,1)}
        else{K.cyl(x,0,z,.27,.48,0x3C3B39);K.cyl(x,.48,z,.25,.02,0x2E2418);
          for(let i=0;i<14;i++){const a=i*2.39,rr=.12+(i%4)*.06,y=.62+(i%5)*.18;leaf(K,x+Math.sin(a)*rr,y,z+Math.cos(a)*rr,1.55-(i%4)*.15,[0x2E6B34,0x3C7E3E,0x285E2E,0x4A8C46][i%4],a,.35+(i%3)*.3);K.rod(x,.5,z,x+Math.sin(a)*rr*.8,y-.05,z+Math.cos(a)*rr*.8,.012,0x3C5E30,{x:1})}
          sol(K,R_,"большое растение",x-.45,x+.45,z-.45,z+.45,1.55,1)}},
      plant(K,R_,x,z,o){const h=o.h||.9,s=o.s||.7;K.cyl(x,0,z,.17,.32,0xDCD9D2);K.cyl(x,.32,z,.15,.02,0x2E2418);
        for(let i=0;i<9;i++){const a=i*2.39,rr=.05+(i%3)*.05;leaf(K,x+Math.sin(a)*rr,.4+(i%4)*(h-.4)/4,z+Math.cos(a)*rr,s+.25,[0x3E7E3A,0x4E8E42,0x346E30][i%3],a,.4+(i%3)*.25)}
        sol(K,R_,"растение в горшке",x-.22,x+.22,z-.22,z+.22,h,1)},
      /* обеденный стол светлого дуба на расставленных ножках */
      table(K,R_,x,z,o){const w=o.w||.8,l=o.l||1.3,h=o.h||.75,tc=o.top?hx(o.top):0xD2A066;K.box(x,h-.035,z,w,.035,l,tc);K.box(x,h-.1,z,w-.12,.065,l-.2,o.top?new T.Color(tc).multiplyScalar(.86).getHex():0xB8874F);
        [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>K.box(x+a*(w/2-.1),0,z+b*(l/2-.14),o.legc?.035:.045,h-.06,o.legc?.035:.045,o.legc?hx(o.legc):0xC99A60,{rz:-a*.07,rx:b*.05}));
        /* этап 10: мелочи на столе — растение в сером горшке, чашки */
        (o.decor||[]).forEach(([t,a,b])=>{const X=x+a,Z=z+b;if(t==="plant"){K.cyl(X,h,Z,.085,.09,0x8E9296);for(let i=0;i<7;i++)leaf(K,X+Math.sin(i*2.4)*.04,h+.13+(i%3)*.03,Z+Math.cos(i*2.4)*.04,.55,[0x4E8A3E,0x5E9A48][i%2],i*2.4,.6)}
          else if(t==="cup")K.cyl(X,h,Z,.04,.07,0xE9E1CF,{x:1});else if(t==="bowl")K.cyl(X,h,Z,.06,.035,0xD9D2C2,{x:1})});
        sol(K,R_,"обеденный стол",x-w/2,x+w/2,z-l/2,z+l/2,h)},
      /* стул: мягкая чаша-сиденье, спинка, тонкие тёмные ножки; face — куда смотрит сидящий (r — +x, l — −x) */
      chair(K,R_,x,z,o){const f=o.face==="l"?-1:1,c=o.c||"#6A6E74",bx=x-f*.2;
        [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>K.box(x+a*.17,0,z+b*.17,o.legc?.03:.022,.41,o.legc?.03:.022,o.legc?hx(o.legc):0x1E1E20,{rz:-a*.06,rx:b*.06}));
        K.box(x,.39,z,.46,.08,.44,c,{uv:"fab",tint:c});K.box(bx,.45,z,.07,.4,.44,c,{rz:f*.12,uv:"fab",tint:c});
        sol(K,R_,"стул: сиденье",x-.23,x+.23,z-.22,z+.22,.47);sol(K,R_,"стул: спинка",bx-.05,bx+.05,z-.22,z+.22,.85)},
      /* люстра-«спутник»: латунная втулка, лучи с тёплыми лампочками; висит — под ней проходят, если хватает места над головой */
      chandelier(K,R_,x,z,o){const y=o.y||2.06,H=R_.r.H||2.8,br=o.col?hx(o.col):0xB89A5A,n=o.n||10,L0=o.L||.32,bs=o.bulb||.025;K.rod(x,y,z,x,H,z,.012,o.rod?hx(o.rod):0x2A2A2A);K.sph(x,y,z,.05,br);
        if(o.rod)K.cyl(x,H-.03,z,.06,.03,br);
        for(let i=0;i<n;i++){const a=i/n*Math.PI*2+.2,L=L0+(i%3)*.08,dy=((i*7)%5-2)*.04,ex=x+Math.cos(a)*L,ez=z+Math.sin(a)*L;K.rod(x,y,z,ex,y+dy,ez,.01,br);
          K.cyl(ex,y+dy-.015,ez,.014,.03,br,{x:1});K.sph(ex,y+dy+.015+bs,ez,bs,0xFFE2B0,{em:1.4})}
        if(o.L)sol(K,R_,"люстра (висит)",x-.42,x+.42,z-.42,z+.42,H,1,y-.07);else sol(K,R_,"люстра (висит)",x-.2,x+.2,z-.38,z+.38,H,1,y-.07)},
      /* кухня буквой Г: графитовые нижние шкафы, чёрная столешница, фартук «бетон», мойка и смеситель, ореховые верхние шкафы,
         чёрная вытяжка-цилиндр, кондиционер, колонна с духовкой; мелочи на столешнице */
      kitchen(K,R_,x_,z_,o){const r=R_.r,w=r.w,d=r.d,H=r.H||2.8,dep=o.dep||.62,h=o.h||.9,r0=o.run[0],r1=o.run[1],rz=o.ret,GR=0x3B3F44,WT=0x161719;
        const base=(cx,cz,lx,lz,fr)=>{K.box(cx,0,cz,lx,.1,lz,0x17181A);K.box(cx,.1,cz,lx,h-.14,lz,GR);K.box(cx,h-.04,cz,lx+.02,.04,lz+.02,WT)};
        base((r0+r1)/2,-d+dep/2,r1-r0,dep);base(-w/2+dep/2,(rz+(-d+dep))/2,dep,(-d+dep)-rz);
        const fz=-d+dep+.003;for(let xx=r0+dep;xx<r1-.05;xx+=.6)K.box(xx,.1,fz,.008,h-.14,.004,0x24272B,{x:1});[.48,.7].forEach(y=>K.box((r0+dep+r1)/2,y,fz,r1-r0-dep-.02,.006,.004,0x24272B,{x:1}));
        const fxr=-w/2+dep+.003;[.48,.7].forEach(y=>K.box(fxr,y,(rz-d+dep)/2,.004,.006,(-d+dep)-rz-.02,0x24272B,{x:1}));
        for(let xx=r0;xx<r1-.05;xx+=1.1){const ww=Math.min(1.1,r1-xx);K.pic(xx+ww/2,h+.31,-d+.012,ww-.01,.6,"conc",{})}
        K.pic(-w/2+.012,h+.31,(rz-d)/2,Math.abs(rz+d),.6,"conc",{ry:Math.PI/2});
        /* мойка и смеситель, варочная панель */
        const sx=-.05;K.box(sx,h,-d+.32,.52,.004,.4,0x0B0B0C);K.rod(sx,h,-d+.08,sx,h+.3,-d+.08,.016,0x111111);K.rod(sx,h+.3,-d+.08,sx,h+.27,-d+.25,.014,0x111111);
        K.box(-w/2+dep/2,h,(rz-d+dep)/2,.5,.006,.56,0x0A0A0B);
        /* верхние шкафы ореха (три дверцы) и швы */
        const u0=o.uppers[0],u1=o.uppers[1];K.box((u0+u1)/2,1.52,-d+.15,u1-u0,.45,.3,0xFFFFFF,{uv:"walnut"});for(let i=1;i<3;i++)K.box(u0+(u1-u0)*i/3,1.52,-d+.302,.006,.45,.004,0x2A1A10,{x:1});
        sol(K,R_,"верхние шкафы (висят)",u0,u1,-d,-d+.3,1.97,1,1.52);
        /* вытяжка-цилиндр */
        const hx_=o.hood[0],hz_=o.hood[1];K.cyl(hx_,1.62,hz_,.17,H-1.62,0x151617);sol(K,R_,"вытяжка (висит)",hx_-.18,hx_+.18,hz_-.18,hz_+.18,H,1,1.62);
        /* кондиционер */
        const ax=o.ac[0],ay=o.ac[1];K.box(ax,ay,-d+.11,.92,.3,.22,0xF2F3F1);K.box(ax,ay+.03,-d+.222,.84,.02,.004,0xC9CCCC,{x:1});sol(K,R_,"кондиционер (висит)",ax-.46,ax+.46,-d,-d+.22,ay+.3,1,ay);
        /* колонна с духовкой до потолка */
        const c0=o.col[0],c1=o.col[1],cz=o.col[2];K.box((c0+c1)/2,0,(cz-d)/2,c1-c0,H,cz+d,0xFFFFFF,{uv:"walnut"});
        [.9,1.55,2.1,2.5].forEach(y=>K.box((c0+c1)/2,y,cz+.003,c1-c0-.02,.006,.004,0x2A1A10,{x:1}));K.box((c0+c1)/2,.9,cz+.003,.006,H-.92,.004,0x2A1A10,{x:1});
        K.pic(c0+(c1-c0)*.27,1.2,cz+.006,(c1-c0)*.46,.56,"oven",{em:.35});sol(K,R_,"колонна с духовкой",c0,c1,-d,cz,H,1);
        sol(K,R_,"кухня: столешница",r0,r1,-d,-d+dep,h);sol(K,R_,"кухня: столешница (угол)",-w/2,-w/2+dep,rz,-d+dep,h);
        /* мелочи: гортензии в вазе, тостер, чайник, кувшин, дозатор, подставка с ножами, розовый горшок с растением, тарелка с апельсинами */
        const tz=-d+.28,hy=h;K.cyl(-w/2+.3,hy,rz+.18,.06,.2,0xDCE8EC,{glass:1,x:1});[[0,0],[.08,.05],[-.07,.06],[.03,-.08],[-.05,-.05]].forEach(([a,b],i)=>K.sph(-w/2+.3+a,hy+.32+(i%2)*.06,rz+.18+b,.085,[0xE7B8C0,0xB8C8A0,0xD9A0B0,0xC8D6B2,0xE0C0C8][i],{x:1}));
        K.box(-1.25,hy,tz,.28,.18,.17,0xB9BCBF);K.cyl(-.8,hy,tz,.075,.22,0xC9CDD0);K.cyl(-.55,hy,tz,.06,.18,0xDCE8EC,{glass:1,x:1});K.cyl(.22,hy,tz-.05,.03,.14,0xF2F2F0,{x:1});
        K.box(.55,hy,tz-.04,.11,.2,.13,0x141414);for(let i=0;i<4;i++)K.box(.52+i*.022,hy+.2,tz-.04,.012,.08,.03,0x2A2A2A,{x:1});
        K.cyl(.92,hy,tz,.07,.12,0xE8A0B0,{x:1});K.cone(.92,hy+.12,tz,.07,.14,0x4E8A44,{x:1});K.cyl(1.04,hy,tz+.12,.11,.012,0xF4F2EE,{x:1});[[0,0],[.05,.03],[-.04,.04]].forEach(([a,b])=>K.sph(1.04+a,hy+.04,tz+.12+b,.035,0xF08A2A,{x:1}))},
      /* треки: чёрные шинопроводы на потолке, споты-цилиндры, развёрнутые к стенам */
      track(K,R_,x_,z_,o){const H=R_.r.H||2.8;(o.rails||[]).forEach(([x1,z1,x2,z2])=>{const L=Math.hypot(x2-x1,z2-z1);K.box((x1+x2)/2,H-.035,(z1+z2)/2,Math.abs(x2-x1)+.035,.035,Math.abs(z2-z1)+.035,0x111112)});
        (o.spots||[]).forEach(([x,z,dir])=>{const rz=dir===-1?.6:dir===1?-.6:0,rx=dir===-2?-.6:0;K.box(x,H-.1,z,.025,.07,.025,0x111112);K.cyl(x,H-.27,z,.045,.15,0x111112,{rz,rx});
          K.sph(x-(dir===-1?.07:dir===1?-.07:0),H-.32,z-(dir===-2?.07:0),.018,0xFFEBC4,{em:1.3,x:1})})},
      /* розетки и выключатели (чёрные рамки) */
      sockets(K,R_,x_,z_,o){const w=R_.r.w,d=R_.r.d,c=o.c?hx(o.c):0x161616;(o.list||[]).forEach(([wl,u,y])=>{if(wl==="l")K.box(-w/2+.008,y,u,.012,.085,.085,c,{x:1});else if(wl==="r")K.box(w/2-.008,y,u,.012,.085,.085,c,{x:1});else K.box(u,y,-d+.008,.085,.085,.012,c,{x:1})})},
      /* ---- этап 10: «Маршала Захарова» ---- */
      /* накладные споты на потолке: белые цилиндры (или квадраты — sq) со светящимся низом */
      spots(K,R_,x_,z_,o){const H=R_.r.H||2.8;(o.list||[]).forEach(([x,z])=>{if(o.sq){K.box(x,H-.07,z,.11,.07,.11,0xF2F2F0);K.box(x,H-.074,z,.07,.004,.07,0xFFF4E0,{em:1.4})}
        else{K.cyl(x,H-.1,z,.045,.1,0xF2F2F0);K.cyl(x,H-.104,z,.03,.005,0xFFEBC4,{em:1.4})}})},
      /* Г-образная кухня: нога A вдоль дальней стены (x runA, угол у левой стены), нога B вдоль левой стены (z runB от угла к двери);
         матовые светлые фасады без ручек (швы ящиков), дубовая столешница, зелёный стеклянный фартук с подсветкой под верхними шкафами,
         варочная панель над чёрной духовкой со стальной ручкой, белая мойка и белый смеситель, верхние шкафы двумя группами, колонна; мелочи — items */
      kitchenL(K,R_,x_,z_,o){const r=R_.r,w=r.w,d=r.d,dep=o.dep||.62,h=o.h||.9,a0=o.runA[0],a1=o.runA[1],b1=o.runB[1],L=-w/2,FR=0xEEEBE3,SEAM=0xB9B5AC,PL=0xD3D0C8,uy0=o.uy[0],uy1=o.uy[1];
        const fzA=-d+dep,fxB=L+dep;
        /* корпуса и цоколь */
        K.box((a0+a1)/2,0,-d+(dep-.06)/2,a1-a0,.1,dep-.06,PL);K.box((a0+a1)/2,.1,-d+dep/2,a1-a0,h-.14,dep,FR);
        K.box(L+(dep-.06)/2,0,(fzA+b1)/2,dep-.06,.1,b1-fzA,PL);K.box(L+dep/2,.1,(fzA+b1)/2,dep,h-.14,b1-fzA,FR);
        K.box((a0+a1)/2,h-.04,-d+dep/2+.01,a1-a0,.04,dep+.02,0xFFFFFF,{uv:"oakw"});K.box(L+dep/2+.01,h-.04,(fzA+b1)/2,dep+.02,.04,b1-fzA,0xFFFFFF,{uv:"oakw"});
        /* швы фасадов: нога A */
        const segA=[fxB,fxB+.6,o.sink-.3,o.sink+.3,a1];segA.forEach(xx=>K.box(xx,.1,fzA+.003,.006,h-.14,.004,SEAM,{x:1}));
        [[.42,.64],[.42,.64]].slice(0,1).forEach(([y1,y2])=>{[y1,y2].forEach(y=>K.box((o.sink+.3+a1)/2,y,fzA+.003,a1-o.sink-.32,.006,.004,SEAM,{x:1}))});
        K.box((fxB+.6+o.sink-.3)/2,.5,fzA+.003,o.sink-.3-fxB-.62,.006,.004,SEAM,{x:1});
        /* нога B: дверца у угла, духовка под варочной панелью, ящики */
        const oz0=o.hob-.3,oz1=o.hob+.3;[fzA,oz0,oz1,b1].forEach(zz=>K.box(fxB+.003,.1,zz,.004,h-.14,.006,SEAM,{x:1}));
        [.3,.5,.7].forEach(y=>K.box(fxB+.003,y,(oz1+b1)/2,.004,.006,b1-oz1-.02,SEAM,{x:1}));K.box(fxB+.003,.2,o.hob,.004,.006,.58,SEAM,{x:1});
        K.pic(fxB+.004,.5,o.hob,.58,.56,"ovenB",{ry:Math.PI/2,em:.4});K.box(fxB+.03,.74,o.hob,.03,.025,.48,0xC9CED2);[-1,1].forEach(e=>K.box(fxB+.015,.735,o.hob+e*.22,.03,.02,.02,0xB0B5BA));
        K.box(L+dep/2,h,o.hob,.52,.006,.58,0x0A0A0B);[[-.12,-.14],[.12,.14],[-.12,.14],[.12,-.14]].forEach(([a,b])=>K.cyl(L+dep/2+a,h+.006,o.hob+b,.07,.001,0x1E1F22,{x:1}));
        /* фартук: зелёное крашеное стекло между столешницей и верхними шкафами, по обеим ногам; светодиодная лента под шкафами */
        K.pic((a0+a1)/2,(h+uy0)/2,-d+.008,a1-a0,uy0-h,"glassG",{em:.85});K.pic(L+.008,(h+uy0)/2,(-d+b1)/2,b1+d,uy0-h,"glassG",{ry:Math.PI/2,em:.85});
        /* верхние шкафы: группа A (дальняя стена) и группа B (левая стена); швы дверец; стена над ними остаётся зелёной */
        const uA0=o.upA[0],uA1=o.upA[1],uB0=o.upB[0],uB1=o.upB[1],ud=.34;
        K.box((uA0+uA1)/2,uy0,-d+ud/2,uA1-uA0,uy1-uy0,ud,FR);const nA=Math.max(1,Math.round((uA1-uA0)/.5));for(let i=1;i<nA;i++)K.box(uA0+(uA1-uA0)*i/nA,uy0,-d+ud+.002,.006,uy1-uy0,.004,SEAM,{x:1});
        K.box(L+ud/2,uy0,(uB0+uB1)/2,ud,uy1-uy0,uB1-uB0,FR);const nB=Math.max(1,Math.round((uB1-uB0)/.58));for(let i=1;i<nB;i++)K.box(L+ud+.002,uy0,uB0+(uB1-uB0)*i/nB,.004,uy1-uy0,.006,SEAM,{x:1});
        K.box((uA0+uA1)/2,uy0-.012,-d+.06,uA1-uA0-.04,.01,.03,0xFFF2DA,{em:1.6});K.box(L+.06,uy0-.012,(uB0+uB1)/2,.03,.01,uB1-uB0-.04,0xFFF2DA,{em:1.6});
        sol(K,R_,"верхние шкафы у дальней стены (висят)",uA0,uA1,-d,-d+ud,uy1,1,uy0);sol(K,R_,"верхние шкафы у левой стены (висят)",L,L+ud,uB0,uB1,uy1,1,uy0);
        /* колонна (холодильник) до верха шкафов */
        const c0=o.col[0],c1=o.col[1],cH=o.col[2];K.box((c0+c1)/2,0,-d+.32,c1-c0,cH,.64,FR);K.box((c0+c1)/2,.1,-d+.643,c1-c0-.02,.006,.004,SEAM,{x:1});K.box((c0+c1)/2,1.0,-d+.643,c1-c0-.02,.006,.004,SEAM,{x:1});
        K.box(c0+.004,.1,-d+.643,.006,cH-.1,.004,SEAM,{x:1});sol(K,R_,"колонна-холодильник",c0,c1,-d,-d+.64,cH,1);
        /* мойка (белый композит) и высокий белый смеситель */
        const sx=o.sink,sz=-d+.32;K.box(sx,h,sz,.56,.012,.46,0xE6E3DC);K.box(sx-.04,h+.002,sz+.01,.4,.012,.34,0xC9C5BC);K.cyl(sx+.25,h,-d+.09,.024,.34,0xF4F3EF);K.rod(sx+.25,h+.33,-d+.09,sx+.2,h+.3,-d+.26,.018,0xF4F3EF);
        sol(K,R_,"кухня: столешница у дальней стены",a0,a1,-d,fzA,h);sol(K,R_,"кухня: столешница у левой стены",L,fxB,fzA,b1,h);
        /* мелочи на столешнице */
        (o.items||[]).forEach(([t,x,z])=>{const y=h;
          if(t==="kettle"){K.cyl(x,y,z,.075,.03,0x1A1A1A);K.cyl(x,y+.03,z,.07,.2,0xB9BEC3);K.box(x+.08,y+.08,z,.03,.13,.03,0x1A1A1A)}
          else if(t==="knives"){K.box(x,y,z,.11,.2,.13,0x141414);for(let i=0;i<4;i++)K.box(x-.03+i*.02,y+.2,z,.012,.08,.03,0x2A2A2A,{x:1})}
          else if(t==="jug")K.cyl(x,y,z,.06,.2,0xDCE8EC,{glass:1});
          else if(t==="soap")K.cyl(x,y,z,.03,.13,0xF2F2EE,{x:1});
          else if(t==="fruit"){K.cyl(x,y,z,.13,.015,0xF4F2EE,{x:1});[[0,0],[.05,.04],[-.05,.03]].forEach(([a,b],i)=>K.sph(x+a,y+.05,z+b,.04,i?0xF0A030:0xE8D24A,{x:1}))}
          else if(t==="plant"){K.cyl(x,y,z,.09,.12,0x8E9296);for(let i=0;i<9;i++)leaf(K,x+Math.sin(i*2.4)*.06,y+.18+(i%3)*.05,z+Math.cos(i*2.4)*.06,.7,[0x4E8A3E,0x5E9A48,0x3E7A34][i%3],i*2.4,.5)}
          else if(t==="tray")K.geo(PROPS.G.cyl,x,y+.2,z,.4,.012,.4,0xFFFFFF,{uv:"tray",rz:Math.PI/2-.2});
          else if(t==="trivet")K.box(x,y,z,.18,.008,.18,0xC0302A,{x:1});
          else if(t==="teapot"){K.sph(x,y+.08,z,.08,0xDCE8EC,{glass:1});K.cyl(x,y+.15,z,.02,.03,0x8A8E92,{x:1})}})},
      /* открытый дубовый стеллаж у стены: боковины, полки, книги, сложенный плед внизу, диффузор с палочками наверху */
      bookcase(K,R_,x,z,o){const w=R_.r.w,l=o.l||.6,d=o.d||.34,h=o.h||1.9,L=-w/2,cx=L+d/2,OK_=0xFFFFFF,sh=[.04,.42,.8,1.18,1.54];
        [-1,1].forEach(e=>K.box(cx,0,z+e*(l/2-.012),d,h,.024,OK_,{uv:"oakw"}));K.box(cx,h-.025,z,d,.025,l,OK_,{uv:"oakw"});K.box(L+.006,0,z,.012,h,l-.04,0x8E6A44);
        sh.forEach((y,i)=>{K.box(cx,y,z,d,.022,l-.04,OK_,{uv:"oakw"});if(i>0&&i!==2)K.pic(L+d*.55,y+.022+.13,z,l-.07,.26,"books",{ry:Math.PI/2,sub:[i%4,4]})});
        K.box(cx+.02,.062,z,d-.08,.18,l-.12,0x7A5A40,{uv:"fab",tint:0x9A7458});K.box(cx,.8+.022,z+.12,.12,.08,.1,0x2A2A2A,{x:1});
        K.cyl(cx,h,z+.12,.035,.1,0xD8D2C8,{x:1});for(let i=0;i<5;i++)K.rod(cx,h+.08,z+.12,cx+(i-2)*.025,h+.32,z+.12+((i*3)%5-2)*.02,.004,0x5A4630,{x:1});
        sol(K,R_,"стеллаж с книгами",L,L+d,z-l/2,z+l/2,h,1)},
      /* окно с ночным видом: стекло — холст атласа (ночное небо, огни домов), белые рамы, фрамуга сверху; rv — откос (ниша в стене) */
      window(K,R_,x,z,o){const w=R_.r.w,sg=o.wall==="l"?1:-1,X=sg>0?-w/2:w/2,ww=o.w||1,h=o.h||1.3,y0=o.y0||.9,tr=o.tr||0,rv=o.rv||0,ry=sg>0?Math.PI/2:-Math.PI/2,top=y0+h+(tr?tr+.05:0),fw=.065,WH=0xF2F2EF;
        K.pic(X+sg*.006,(y0+top)/2,z,ww,top-y0,"night",{ry,em:.95});
        const fb=(y,hh,zz,ln)=>K.box(X+sg*.03,y,zz,.05,hh,ln,WH);fb(y0-fw/2,fw,z,ww+fw*2);fb(top-fw/2,fw,z,ww+fw*2);[-1,1].forEach(e=>fb(y0-fw/2,top-y0+fw,z+e*(ww/2+fw/2),fw));
        if(tr)fb(y0+h,.06,z,ww);K.box(X+sg*.035,y0+.05,z+ww*.18,.04,h-.08,.04,WH,{x:1});
        if(rv){const wc=hx(R_.r.wall);[-1,1].forEach(e=>K.box(X+sg*rv/2,0,z+e*(ww/2+fw+.06),rv,R_.r.H||2.8,.12,wc));sol(K,R_,"откос окна",Math.min(X,X+sg*rv),Math.max(X,X+sg*rv),z-ww/2-fw-.12,z-ww/2-fw,R_.r.H||2.8,1);sol(K,R_,"откос окна",Math.min(X,X+sg*rv),Math.max(X,X+sg*rv),z+ww/2+fw,z+ww/2+fw+.12,R_.r.H||2.8,1)}
        K.box(X+sg*(rv+.06),y0-.035,z,.12+rv,.03,ww+.1,WH);
        R_.list.push(["окно с ночным видом",+top.toFixed(2),+y0.toFixed(2),"в стене"])},
      /* длинная полка-подоконник светлого дуба на кронштейнах над белой батареей; на ней горшки (round — тёмный круглый с растением, bowl — серая чаша с суккулентами) */
      sill(K,R_,x_,z_,o){const w=R_.r.w,sg=o.wall==="l"?1:-1,X=sg>0?-w/2:w/2,a0=o.a0,a1=o.a1,y=o.y||.84,dd=o.d||.25,cx=X+sg*dd/2;
        K.box(cx,y-.04,(a0+a1)/2,dd,.04,a1-a0,0xFFFFFF,{uv:"oakw"});for(let zz=a0+.2;zz<a1;zz+=.6)K.box(X+sg*.08,y-.2,zz,.14,.16,.03,0x2A2A2A,{x:1});
        if(o.rad){const r0=o.rad[0],r1=o.rad[1];K.box(X+sg*.07,.16,(r0+r1)/2,.08,y-.34,r1-r0,0xEDEDEA);for(let zz=r0+.05;zz<r1;zz+=.1)K.box(X+sg*.115,.17,zz,.01,y-.36,.015,0xD9D9D5,{x:1})}
        sol(K,R_,"полка-подоконник",Math.min(X,X+sg*dd),Math.max(X,X+sg*dd),a0,a1,y);
        (o.pots||[]).forEach(([zz,t])=>{const px=X+sg*.13;if(t==="round"){K.sph(px,y+.1,zz,.11,0x2A2B2D);for(let i=0;i<10;i++)leaf(K,px+Math.sin(i*2.4)*.05,y+.26+(i%4)*.06,zz+Math.cos(i*2.4)*.05,.75,[0x3E7E3A,0x4E8E42,0x2E6A30][i%3],i*2.4,.4);sol(K,R_,"горшок с растением",px-.12,px+.12,zz-.12,zz+.12,y+.45,1)}
          else{K.cyl(px,y,zz,.15,.09,0x8F9396);for(let i=0;i<9;i++)K.cone(px+Math.sin(i*2.1)*.07,y+.09,zz+Math.cos(i*2.1)*.07,.03,.1+(i%3)*.03,[0x5E8E5A,0x7AA06A,0x4A7A4A][i%3]);sol(K,R_,"чаша с суккулентами",px-.15,px+.15,zz-.15,zz+.15,y+.2,1)}})},
      /* простая коробка: [ "box", x, z, {w,h,d,y,c,top} ] — для будущих комнат */
      box(K,R_,x,z,o){const w=o.w||.5,h=o.h||.5,d=o.d||.5,y=o.y||0;K.box(x,y,z,w,h,d,o.c||0x888888);if(o.solid!==false)sol(K,R_,o.lab||"коробка",x-w/2,x+w/2,z-d/2,z+d/2,y+h,!!o.ns,y>0?y:0)}}})();
    /* — этап 9: ветка — стены с проёмами, двери, обстановка коридора и комнат квартир (по данным CORR / FLATS). Всё слито по материалу, как в залах;
       стены — частая сетка вершин, чтобы «запечённые» гребешки света спотов легли на зелёные стены. Сборщики предметов комнаты — ROOMB — */
    const tmpGeo=[];
    BOOK&&(function(){const G=PROPS.G;
      const proxy=(K,x,y,z,sx,sy,sz)=>{const p=K.tp(x,z),sw=K.xf&&Math.abs(Math.round(Math.sin(K.xf.rot)))===1,me=new T.Mesh(G.box,PROPS.M.plain);me.visible=false;me.scale.set(sw?sz:sx,sy,sw?sx:sz);me.position.set(p[0],y,p[1]);me.updateMatrixWorld(true);camBlock.push(me);PROPS.propProxy.push(me)};
      /* стена: s0 — начало (x,z), t — вдоль, n — внутрь помещения; holes [{a,b,h}] — проёмы по длине от s0; step — шаг сетки вершин */
      function wall(K,s0,t,n,len,H,holes,col,step,skirt){const ry=Math.atan2(n[0],n[1]),hs=(holes||[]).slice().sort((p,q)=>p.a-q.a),pcs=[];let a=0;
        hs.forEach(h=>{if(h.a>a)pcs.push([a,h.a,0,H]);pcs.push([h.a,h.b,h.h,H]);a=Math.max(a,h.b)});if(a<len)pcs.push([a,len,0,H]);
        pcs.forEach(([a,b,y0,y1])=>{const L=b-a,hh=y1-y0;if(L<.01||hh<.01)return;const g=new T.PlaneGeometry(L,hh,Math.max(1,Math.ceil(L/step)),Math.max(1,Math.ceil(hh/step)));tmpGeo.push(g);
          const m=(a+b)/2,cx=s0[0]+t[0]*m,cz=s0[1]+t[1]*m;K.geo(g,cx,(y0+y1)/2,cz,1,1,1,col,{ry});
          proxy(K,cx-n[0]*.07,(y0+y1)/2,cz-n[1]*.07,Math.abs(t[0])*L+Math.abs(n[0])*.12,hh,Math.abs(t[1])*L+Math.abs(n[1])*.12);
          if(skirt&&y0===0)K.box(cx+n[0]*.008,0,cz+n[1]*.008,Math.abs(t[0])*L+Math.abs(n[0])*.016,.085,Math.abs(t[1])*L+Math.abs(n[1])*.016,skirt)})}
      const ceil=(K,cx,cz,w,d,H,col,step)=>{const g=new T.PlaneGeometry(w,d,Math.max(1,Math.ceil(w/step)),Math.max(1,Math.ceil(d/step)));tmpGeo.push(g);K.geo(g,cx,H,cz,1,1,1,col,{rx:Math.PI/2})};
      const hx=c=>new T.Color(c).getHex();
      /* ---- коридор: светлые стены, плитка и ковровая дорожка, плафоны, коврики у дверей, растения в кадках, окно в торце ---- */
      {const C=CORR,K=PROPS.kit(C.k),H=C.H,wc=hx(C.wall),zc=(C.z0+C.z1)/2,W=C.x1-C.x0,D=C.z0-C.z1,sk=0xB9B4AA;
        const hN=[],hS=[];FL.forEach(f=>{if(!f.__open)return;const r=f.__open,dw=r.dw||.9,dh=r.dh||2.1;if(f.side==="n")hN.push({a:C.x1-(f.dx+dw/2),b:C.x1-(f.dx-dw/2),h:dh});else hS.push({a:f.dx-dw/2-C.x0,b:f.dx+dw/2-C.x0,h:dh})});
        wall(K,[C.x1,C.z0],[-1,0],[0,-1],W,H,hN,wc,.6,sk);wall(K,[C.x0,C.z1],[1,0],[0,1],W,H,hS,wc,.6,sk);
        wall(K,[C.x1,C.z1],[0,1],[-1,0],D,H,[{a:C.DZ-C.DW-C.z1,b:C.DZ+C.DW-C.z1,h:C.DH}],wc,.6,sk);wall(K,[C.x0,C.z0],[0,-1],[1,0],D,H,[],wc,.6,sk);
        ceil(K,(C.x0+C.x1)/2,zc,W,D,H,hx(C.ceil),.8);
        /* дорожка с каймой */
        K.box((C.x0+C.x1)/2-.2,0,zc,W-1.4,.008,1.15,0x4C5A66);[-1,1].forEach(e=>K.box((C.x0+C.x1)/2-.2,.008,zc+e*.5,W-1.5,.002,.05,0xC9C2B0));
        /* плафоны */
        HALLZ[IC].pools.slice(0,CORR.lamps.length).forEach(p=>{K.cyl(p.x,H-.04,p.z,.24,.04,0xE9E9E6);K.cyl(p.x,H-.055,p.z,.2,.016,0xFFFFFF,{em:1.35})});
        /* окно в торце, батарея, подоконник */
        K.pic(C.x0+.012,1.6,zc,1.1,1.25,"winDay",{ry:Math.PI/2,em:.95});[[0,1.6+.66],[0,1.6-.66]].forEach(([_,y])=>K.box(C.x0+.03,y-.03,zc,.05,.06,1.22,0xF1F0EC));[-1,0,1].forEach(e=>K.box(C.x0+.03,1.6-.63,zc+e*.58,.05,1.26,.05,0xF1F0EC));
        K.box(C.x0+.1,.95,zc,.2,.04,1.4,0xEDEBE6);for(let i=0;i<9;i++)K.box(C.x0+.06,.2,zc-.56+i*.14,.08,.55,.07,0xECECE8);
        /* кадки с растениями у окна */
        [[C.x0+.48,C.z0-.45],[C.x0+.48,C.z1+.45]].forEach(([x,z],i)=>{K.cyl(x,0,z,.22,.46,0x5B6670);K.cyl(x,.46,z,.2,.02,0x3A2A1A);
          for(let k=0;k<6;k++){const a=k*1.05+i;K.cone(x+Math.sin(a)*.1,.5+k*.13,z+Math.cos(a)*.1,.26-k*.03,.55,[0x3F6E3A,0x4E7E44,0x355F31][k%3],{rx:Math.sin(a)*.25,rz:Math.cos(a)*.25})}
          K.solid(x-.25,x+.25,z-.25,z+.25,1.45,"ns")});
        /* выключатели у проёма, щиток на южной стене */
        K.box(C.x1-.03,1.05,C.DZ+C.DW+.25,.02,.09,.09,0xF4F4F2);K.box(-15.0,1.45,C.z1+.025,.5,.62,.05,0xD7D5CF);K.box(-15.0,1.45,C.z1+.052,.46,.004,.004,0xA8A59E,{x:1});
        /* табличка «Квартиры» над проёмом изнутри */
        K.box(C.x1-.02,2.62,C.DZ,.03,.16,1.0,0x141619);K.pic(C.x1-.04,2.7,C.DZ,.9,.14,"kvsign",{ry:-Math.PI/2,em:1});
        /* двери квартир: рама, полотно, ручка, глазок, номер; у закрытых — табличка «скоро»; перед каждой — коврик */
        const DC=[0x4E4741,0x5A4838,0x3F4752,0x56514B,0x66574A,0x4A4E46];
        FL.forEach((f,i)=>{const n=f.side==="n",zw=n?C.z0:C.z1,sg=n?-1:1,ry=n?Math.PI:0,x=f.dx,r=f.__open,dw=r?(r.dw||.9):.9,dh=r?(r.dh||2.1):2.08,num=Math.max(1,Math.min(6,+f.number||i+1));
          [-1,1].forEach(e=>K.box(x+e*(dw/2+.035),0,zw+sg*.025,.07,dh+.07,.05,0x2E2B28));K.box(x,dh,zw+sg*.025,dw+.14,.07,.05,0x2E2B28);
          K.pic(x,.014,zw+sg*.42,.86,.5,"mat",{rx:-Math.PI/2,ry:ry,x:0});
          if(!r){K.box(x,0,zw+sg*.03,dw,dh,.05,DC[i%DC.length]);const fz=zw+sg*.057;
            K.box(x+.32*(n?-1:1),1.0,fz+sg*.02,.13,.025,.04,0xC9C3B8);K.cyl(x+.32*(n?-1:1),1.0,fz+sg*.004,.03,.01,0xC9C3B8,{rx:Math.PI/2});K.cyl(x,1.55,fz,.012,.01,0x111111,{rx:Math.PI/2,x:1});
            K.pic(x,1.78,fz+sg*.002,.14,.14,"aptn",{ry,sub:[num-1,6]});K.pic(x,1.36,fz+sg*.002,.24,.12,"soon",{ry});
            K.solid(x-dw/2,x+dw/2,zw,zw+sg*.06,dh,"ns")}
          else{const xp=x+(dw/2+.32)*(n?-1:1);K.pic(xp,1.62,zw+sg*.012,.14,.14,"aptn",{ry,sub:[num-1,6]});const ti=FL.filter(q=>q.title&&(q.rooms||[]).length).indexOf(f);if(f.title&&ti>=0&&ti<4)K.pic(x,dh+.27,zw+sg*.012,.66,.22,"ftitles",{ry,sub:[ti%2,2,Math.floor(ti/2),2]})}})}
      /* ---- комнаты квартир ---- */
      BR.rooms.forEach(R_=>{const r=R_.r,K=PROPS.kit(r.k,R_.F),w=r.w,d=r.d,H=r.H||2.8,wc=hx(r.wall||"#BBB"),sk=hx(r.skirt||r.wall||"#999");R_.list=[];
        const ho=k=>R_.holes[k].map(h=>k==="l"||k==="r"?{a:-h.b,b:-h.a,h:h.h}:{a:h.a+w/2,b:h.b+w/2,h:h.h});
        wall(K,[-w/2,0],[1,0],[0,-1],w,H,ho("d"),wc,.25,sk);wall(K,[-w/2,-d],[1,0],[0,1],w,H,ho("b"),wc,.25,sk);
        wall(K,[-w/2,0],[0,-1],[1,0],d,H,ho("l"),wc,.25,sk);wall(K,[w/2,0],[0,-1],[-1,0],d,H,ho("r"),wc,.25,sk);
        ceil(K,0,-d/2,w,d,H,hx(r.ceil||"#EEE"),.5);
        /* входная дверь: открытое полотно вдоль петель (внутрь комнаты, вправо), наличник */
        const dox=r.dox||0,dw=r.dw||.9,dh=r.dh||2.1,hz=dox+dw/2,cc=r.casec?hx(r.casec):0x3E4630;
        /* этап 10: проход без полотна (из прихожей в комнату) — только наличник */
        if(!r.nolf){K.box(hz-.025,0,-dw/2-.01,.045,dh-.02,dw,r.doorc?hx(r.doorc):0x4E4741);K.box(hz-.06,1.0,-dw+.1,.03,.025,.12,r.doorc?0xC9CDD1:0x1A1A1A);K.solid(hz-.06,hz,-dw-.02,0,dh,"ns")}
        [-1,1].forEach(e=>K.box(dox+e*(dw/2+.02),0,-.012,.04,dh+.04,.025,cc));K.box(dox,dh,-.012,dw+.08,.04,.025,cc);
        /* этап 10: порог в толще стены — без него между полами двух пространств виден фон */
        K.box(dox,0,.075,dw,.006,.17,0xC9A273);
        /* скрытые двери в цвет стены: тонкий контур и чёрная ручка; to:null — закрыты (будущие комнаты) */
        R_.closed.forEach(dr=>{const dw2=dr.w||.86,dh2=dr.h||2.1,dk=new T.Color(wc).multiplyScalar(.72).getHex(),hc=0x151515;
          const onW=(u,y,ww,hh,c,o,t)=>{t=t||.012;if(dr.wall==="l")K.box(-w/2+t/2,y,dr.at+u,t,hh,ww,c,o);else if(dr.wall==="r")K.box(w/2-t/2,y,dr.at-u,t,hh,ww,c,o);else K.box(dr.at+u,y,-d+t/2,ww,hh,t,c,o)};
          /* этап 10: белая филёнчатая дверь с наличником и серебристой ручкой-нажимом */
          if(dr.style==="panel"){const WD=0xF1EFEA,PN=0xF7F6F2,SL=0xC9CDD1;[-1,1].forEach(e=>onW(e*(dw2/2+.035),0,.07,dh2+.07,0xF4F3EF,null,.02));onW(0,dh2+.035,dw2+.14,.07,0xF4F3EF,null,.02);
            onW(0,0,dw2,dh2,WD,null,.035);onW(0,1.12,dw2-.2,.8,PN,null,.045);onW(0,.14,dw2-.2,.82,PN,null,.045);
            onW(dw2/2-.09,1.0,.05,.05,SL,null,.06);onW(dw2/2-.15,1.0,.12,.022,SL,null,.085);R_.list.push(["белая филёнчатая дверь (закрыта)",dr.wall,0]);return}
          [-1,1].forEach(e=>onW(e*dw2/2,0,.012,dh2,dk));onW(0,dh2,dw2,.012,dk);onW(.33,1.0,.12,.022,hc);onW(.33,.94,.03,.03,hc);
          R_.list.push(["скрытая дверь (закрыта)",dr.wall,0])});
        const L=ROOMB;(r.props||[]).forEach(p=>{const f=L[p[0]];if(f)f(K,R_,p[1],p[2],p[3]||{})})});
    })();
    if(WORLD&&!LB)wDecor();
    const PR=PROPS.finish();
    if(BOOK)bookLate();
    /* этап 9: фотографии владельца — ленивая загрузка, крупный просмотр (просмотрщик сайта, если он доступен как window.__lightbox(src, подпись, opener); иначе — свой) */
    function stepPhotos(hi){PHOTOS.forEach(ph=>{if(ph.state!=="wait"||!seen(ph.hi,hi))return;ph.state="loading";
      new T.TextureLoader().load(ph.src,tx=>{if(stopped){tx.dispose();return}ph.tex=tx;ph.mat.map=tx;ph.mat.color.set(0xF7EFE6);ph.mat.needsUpdate=true;ph.state="ok"},undefined,()=>{ph.state="fail"})})}
    let pvEl=null;
    function pvClose(){if(!pvEl)return;pvEl.remove();pvEl=null;try{canvas.focus({preventScroll:true})}catch(e){}}
    function openPhoto(ph){let used=false;const before=document.querySelector(".lbx");
      try{if(typeof window.__lightbox==="function"){window.__lightbox(ph.src,ph.caption,canvas);const now=document.querySelector(".lbx");used=!!now&&now!==before}}catch(e){used=false}
      if(used)return;pvClose();const el=document.createElement("div");el.className="mz-pv";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Изображение: "+ph.caption);
      el.innerHTML='<figure><img alt=""><figcaption></figcaption></figure><button type="button" class="mz-pvx" aria-label="Закрыть">✕</button>';const im=el.querySelector("img");im.src=ph.src;im.alt=ph.caption;el.querySelector("figcaption").textContent=ph.caption;
      el.addEventListener("click",ev=>{if(ev.target===el||ev.target.closest(".mz-pvx"))pvClose()});el.addEventListener("keydown",ev=>{if(ev.key==="Escape"||ev.key==="Tab"){ev.preventDefault();if(ev.key==="Escape")pvClose()}ev.stopPropagation()});el.addEventListener("keyup",ev=>ev.stopPropagation());
      (FS&&FS.mode?wrap:document.body).appendChild(el);pvEl=el;try{el.querySelector(".mz-pvx").focus({preventScroll:true})}catch(e){}}
    stopFns.push(()=>{pvClose();PHOTOS.forEach(ph=>{if(ph.tex)ph.tex.dispose();ph.mat.dispose();ph.mesh.geometry.dispose()})});
    tmpGeo.forEach(g=>g.dispose());
    stopFns.push(()=>{PR.forEach(p=>[...p.core,...p.extra].forEach(m=>m.geometry.dispose()));Object.values(PROPS.M).forEach(m=>m.dispose());Object.values(PROPS.CM).forEach(m=>m.dispose());Object.values(PROPS.G).forEach(g=>g.dispose());PROPS.atlasTex.dispose()});
    /* видимость: текущий зал и соседние (дальше обстановку прячет туман); в облегчённом режиме — только текущий зал и без мелочей. Мигание индикаторов и огоньков свечей */
    let propHall=-9,propLite=null;
    function stepProps(hi,t,dt){if(hi!==propHall||lite!==propLite){propHall=hi;propLite=lite;PR.forEach(p=>{const near_=seen(p.hi,hi),same=p.hi===hi;p.core.forEach(m=>m.visible=lite?same:near_);p.extra.forEach(m=>m.visible=near_&&!lite)});
        /* «База»: её стены и пол рисуются, только когда посетитель в ней или в «Квартирах» */
        const bv=hi===BASE_HALL||hi===IB||hi===IB2;baseSurf.forEach(m=>m.visible=bv);
        /* этап 10: «База Б» — только из «А» и «Б» */
        const bv2=hi===IB||hi===IB2;base2Surf.forEach(m=>m.visible=bv2);EMB.forEach(e=>e.mesh.visible=e.hi===BASE_HALL||(e.hi===IB2?bv2:bv));
        /* этап 9: пол коридора — из «Квартир», коридора и квартир; пол комнаты — из неё, коридора и соседних комнат */
        BR.surf.forEach(e=>e.m.visible=seen(e.hi,hi))}
      if(reduce)return;stepProps.acc=(stepProps.acc||0)+dt;if(stepProps.acc<(lite?.5:.12))return;stepProps.acc=0;
      PR.forEach(p=>{if(!p.blink||!seen(p.hi,hi))return;const ca=p.blink.mesh.geometry.attributes.color;let ch=false;
        p.blink.items.forEach(it=>{const fl=it.blink==="flame";if(!fl&&Math.random()>.18)return;const k=fl?.72+Math.random()*.38:(Math.random()<.7?it.em:it.em*.18);
          for(let i=0;i<it.vn;i++){const j=(it.v0+i)*3;ca.array[j]=it.c.r*k;ca.array[j+1]=it.c.g*k;ca.array[j+2]=it.c.b*k}ch=true});if(ch)ca.needsUpdate=true})}

    /* этап 6: ниша с мишенями — цвета групп перетекают по кругу (зелёный → красный → синий → белый); при «меньше движения» и в облегчённом режиме — неподвижно */
    const NPAL=[0x37F07A,0xFF3B5C,0x3A6BFF,0xF2F5FF].map(c=>new T.Color(c)),NOFF={nT:0,nC:3,nM:1,nW:0},NSTAT={nT:0x37F07A,nC:0xF2F5FF,nM:0x37F07A,nW:0x37F07A};
    let nicheStatic=null;
    function stepNiche(t,hi){if(hi!==BASE_HALL&&hi!==IB)return;const st=reduce||lite;
      if(st){if(nicheStatic!==true){nicheStatic=true;Object.keys(NOFF).forEach(n=>PROPS.CM[n].color.setHex(NSTAT[n]))}return}nicheStatic=false;
      const ph=t/1.8;Object.keys(NOFF).forEach(n=>{const f=ph+NOFF[n]*.5,i=Math.floor(f),a=ss(.7,1,f-i);PROPS.CM[n].color.copy(NPAL[(i+NOFF[n])%4]).lerp(NPAL[(i+1+NOFF[n])%4],a)})}

    /* этап 10: огоньки башен «А» и «Б» мигают поочерёдно двумя группами; при «меньше движения» и в облегчённом режиме — горят ровно */
    let towerStatic=null;const TW=new T.Color(1,1,1),TD=new T.Color(.16,.16,.18);
    function stepTower(t,hi){if(hi!==IB&&hi!==IB2)return;const st=reduce||lite;
      if(st){if(towerStatic!==true){towerStatic=true;["tA1","tA2","tB1","tB2"].forEach(n=>PROPS.CM[n].color.copy(TW))}return}towerStatic=false;
      const k=.5+.5*Math.sin(t*4.2);PROPS.CM.tA1.color.copy(TD).lerp(TW,k);PROPS.CM.tA2.color.copy(TD).lerp(TW,1-k);PROPS.CM.tB1.color.copy(TD).lerp(TW,1-k);PROPS.CM.tB2.color.copy(TD).lerp(TW,k)}

    /* стоят и дышат; ближе нескольких метров — поворачивают голову (и, если нужно, корпус) к посетителю.
       Видимы только в своём и соседних залах; в облегчённом режиме следят взглядом только вблизи */
    function stepDbl(dt,t,hi){const trackR=lite?3:6,kh=1-Math.exp(-dt*5);
      NPC.forEach(n=>{const dx=P.x-n.x,dz=P.z-n.z,d=Math.hypot(dx,dz),vis=adj(n.hi,hi)&&d<26;n.g.visible=vis;if(!vis)return;
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
    /* переход у проёма: i — где посетитель, j — соседнее пространство, t — доля соседнего (0…0,5). Боковой проём в «Базу» — по x, затухает вдоль стены */
    function blendAt(xx,zz){const i=hallAt(zz,xx),h=HALLZ[i];let j=i,t=0;const B=2.5,bz=1-ss(BASE.DW,BASE.DW+1.6,Math.abs(zz-BASE.DZ));
      if(WORLD){}else if(i===IB){const d=xx-BASE.xm;if(d<B&&bz>0){j=BASE_HALL;t=.5*(1-d/B)*bz}}
      else if(i<NH){if(i<NH-1&&zz-h.z1<B){j=i+1;t=.5*(1-(zz-h.z1)/B)}else if(i>0&&h.z0-zz<B){j=i-1;t=.5*(1-(h.z0-zz)/B)}
        if(i===BASE_HALL&&bz>0){const d=BASE.xm-xx;if(d<B){const tb=.5*(1-d/B)*bz;if(tb>t){j=IB;t=tb}}}}
      /* этап 9: проёмы ветки (коридор у «Квартир», двери квартир) — тот же переход, затухает вдоль стены */
      for(let q=0;q<PORT.length;q++){const p=PORT[q];if(p.a!==i&&p.b!==i)continue;const d=Math.abs((p.ax==="x"?xx:zz)-p.at),al=Math.abs((p.ax==="x"?zz:xx)-p.c);
        if(d<B){const tb=.5*(1-d/B)*(1-ss(p.w,p.w+1.6,al));if(tb>t){j=p.a===i?p.b:p.a;t=tb}}}
      blendAt.r={i,j,t:Math.max(0,Math.min(1,t))};return blendAt.r}
    function airTarget(xx,zz){const {i,j,t}=blendAt(xx,zz);
      const a=ATG[i],b=ATG[j];["sky","gnd","amb","fog"].forEach(c=>TG[c].copy(a[c]).lerp(b[c],t));["hi","ai","fn","ff"].forEach(c=>TG[c]=a[c]+(b[c]-a[c])*t);
      /* этап 7: в «Красоте» за галереей — холодный яркий воздух супермаркета */
      if(i===KRI){const u=ss(HALLZ[i].z0-29,HALLZ[i].z0-37,zz);if(u>0){["sky","gnd","amb","fog"].forEach(c=>TG[c].lerp(MKT[c],u));["hi","ai","fn","ff"].forEach(c=>TG[c]+=(MKT[c]-TG[c])*u)}}}
    const KRI=HALLZ.findIndex(h=>h.k==="kr"),MKT={sky:new T.Color(0xF4F8FF),gnd:new T.Color(0x8A9098),hi:.9,amb:new T.Color(0xEEF4FF),ai:.28,fog:new T.Color(0xDFE6EC),fn:16,ff:95};
    function stepAir(dt){airTarget(P.x,P.z);const k=airSnap?1:1-Math.exp(-dt*3);airSnap=false;
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
    function updFound(){if(WORLD){foundEl.hidden=true;return}countFound();const k=HALLZ[Math.max(0,lastHall)].k;
      foundEl.innerHTML=`<b>Найдено ${fc.n} из ${opt.objs.length}</b>`+(HALLZ[Math.max(0,lastHall)].side?"":`<span class="mz-fh"> · в зале ${fc.h[k]||0} из ${TOT[k]||0}</span>`)}
    const bb=new T.Box3(),bc=new T.Vector3(),bs=new T.Vector3();
    function hb(o){if(!o.userData.hb){bb.setFromObject(o);bb.getCenter(bc);bb.getSize(bs);const b={x:bc.x,z:bc.z,top:bb.max.y,r:Math.max(.42,Math.min(1.1,Math.max(bs.x,bs.z)/2+.12))};
        if(bs.z<.15&&bs.x>.3){b.z+=.55;b.r=Math.min(b.r,.7)}else if(bs.x<.15&&bs.z>.3){b.x+=b.x>0?-.55:.55;b.r=Math.min(b.r,.7)}o.userData.hb=b}return o.userData.hb}
    const seenIM=new T.InstancedMesh(new T.RingGeometry(.5,.54,40).rotateX(-Math.PI/2),new T.MeshBasicMaterial({color:0xFFFFFF,transparent:true,opacity:.34,depthWrite:false}),Math.max(1,clickable.length)+64);
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
      hlRing.material.opacity=pulse?.65+.3*(.5+.5*Math.sin(t*4.2)):.9;hlMark.position.set(b.x,Math.min(HALLZ[hallAt(b.z,b.x)].H-.3,b.top+.3+(pulse?Math.sin(t*3)*.05:0)),b.z);hlMark.rotation.y=pulse?t*1.5:0}

    /* название зала при входе: крупно и ненадолго; при «меньше движения» — без анимации */
    const titleEl=hud.querySelector(".mz-title");let titleT=0;stopFns.push(()=>clearTimeout(titleT));
    function showTitle(i){const h=HALLZ[i];titleEl.textContent="";const b=document.createElement("b"),sm=document.createElement("small");b.textContent=TN(h.k);
      if(WORLD){sm.textContent=h.world==="r"?(isHallRow(h.space)?"зал автора сайта"+(h.space.descr?" · "+String(h.space.descr).slice(0,120):""):"пространство посетителя · автор: "+(h.space.author||"посетитель")+(h.space.status!=="approved"?" · "+(W_ST[h.space.status]||h.space.status):"")):(WR.length?"пространства посетителей: "+WR.length:"здесь пока нет пространств");titleEl.append(b,sm);titleEl.classList.add("on");clearTimeout(titleT);titleT=setTimeout(()=>titleEl.classList.remove("on"),2600);return}
      sm.textContent=h.abr?"Зал автора сайта · вход из зала «"+HN(SPEC[h.par].k)+"»":h.branch?"Боковая ветка у «Квартир»":h.side?"Боковой зал у «Предметов» · бегать, лазать, прыгать":`Зал ${i+1} из ${NH} · найдено ${fc.h[h.k]||0} из ${TOT[h.k]||0}`;titleEl.append(b,sm);
      /* этап 12: подпись автора из оформления зала */{const nt_=h.Q?(h.Q.s.hall&&h.Q.s.hall.note)||h.Q.s.descr:HS[h.k]&&HS[h.k].note;if(nt_){const nt=document.createElement("small");nt.className="mz-hsnote";nt.textContent=String(nt_).slice(0,300);titleEl.append(nt)}}titleEl.classList.add("on");clearTimeout(titleT);titleT=setTimeout(()=>titleEl.classList.remove("on"),2600)}

    /* мини-карта: сверху — окрестность в масштабе (вперёд по анфиладе — вправо), снизу — все десять залов; нажатие на зал переносит туда */
    const mapEl=hud.querySelector(".mz-map"),mapC=mapEl.querySelector("canvas"),mapT=mapEl.querySelector(".mz-map-t"),mg=mapC.getContext("2d");
    const MLH=64,MGAP=4,MSH=26,MSC=4,MBR=34,MTOT=MLH+MGAP+MSH+MBR;/* MBR — ряды ответвлений: «База Героев» под «Предметами», ветка квартир под «Квартирами» */let mapOpen=true,mapDirty=true,mapT0=0;
    const setMap=v=>{mapOpen=v;mapEl.dataset.mzOpen=v?"1":"0";mapT.setAttribute("aria-expanded",String(v));mapDirty=true};
    setMap(!coarse.matches&&lsGet("cv2_mz_map")!=="0");
    on(mapT,"click",()=>{setMap(!mapOpen);if(!coarse.matches)lsSet("cv2_mz_map",mapOpen?"1":"0")});
    const MAPC=HALLZ.map(h=>{const c=new T.Color(AIR[h.k].fog);return `rgba(${c.r*255|0},${c.g*255|0},${c.b*255|0},.38)`});
    let MP=null;const MP_={mcx:0,br:[0,0,0,0],bb:[]};
    function libMap(){const W=mapC.clientWidth||232,dpr=Math.min(2,window.devicePixelRatio||1),Hh=MTOT,g=mg,G=LB.G;if(!W)return;if(mapC.width!==Math.round(W*dpr)||mapC.height!==Math.round(Hh*dpr)){mapC.width=Math.round(W*dpr);mapC.height=Math.round(Hh*dpr);mapC.style.height=Hh+"px"}
      /* этап 22: карта библиотеки — только пройденные залы этого яруса и двери из них; непройденное за дверью — пунктир */
      g.setTransform(dpr,0,0,dpr,0,0);g.fillStyle="#15110D";g.fillRect(0,0,W,Hh);const SC=6,MH=Hh-18,ox=W/2,oy=MH/2,mx=z=>ox+(P.z-z)*SC,my=x=>oy+(x-P.x)*SC,tn=Math.tan(Math.PI/6);
      g.save();g.beginPath();g.rect(0,0,W,MH);g.clip();
      const hexP=(cx,cz)=>{g.beginPath();for(let i=0;i<6;i++){const ex=cx+G.NX[i]*G.A,ez=cz+G.NZ[i]*G.A,ux=-G.NZ[i]*G.A*tn,uz=G.NX[i]*G.A*tn;if(!i)g.moveTo(mx(ez-uz),my(ex-ux));g.lineTo(mx(ez+uz),my(ex+ux))}g.closePath()};
      const todo=[];
      for(let dq=-4;dq<=4;dq++)for(let dr=-4;dr<=4;dr++){const q=LB.q+dq,r=LB.r+dr;if(!LB.seen.has(q+","+r+","+LB.L))continue;const cx=dq*G.E0[0]+dr*G.E1[0],cz=dq*G.E0[1]+dr*G.E1[1];if(Math.abs(mx(cz)-ox)>W/2+30||Math.abs(my(cx)-oy)>MH/2+30)continue;
        const cur=!dq&&!dr;hexP(cx,cz);g.fillStyle=cur?"rgba(224,58,30,.24)":G.dark(q,r,LB.L)?"rgba(255,255,255,.05)":"rgba(214,190,140,.16)";g.fill();
        for(let i=0;i<6;i++){const ex=cx+G.NX[i]*G.A,ez=cz+G.NZ[i]*G.A,ux=-G.NZ[i],uz=G.NX[i],hl=G.A*tn,door=G.isDoor(q,r,LB.L,i);g.strokeStyle=cur?"#E8A08E":"rgba(255,255,255,.5)";g.lineWidth=cur?1.5:1;
          const seg=(s0,s1)=>{g.beginPath();g.moveTo(mx(ez+uz*s0),my(ex+ux*s0));g.lineTo(mx(ez+uz*s1),my(ex+ux*s1));g.stroke()};
          if(door){seg(-hl,-G.DW/2-.25);seg(G.DW/2+.25,hl);const q2=q+G.DQ[i][0],r2=r+G.DQ[i][1];if(!LB.seen.has(q2+","+r2+","+LB.L))todo.push([cx+G.NX[i]*2*G.A,cz+G.NZ[i]*2*G.A])}else seg(-hl,hl)}
        g.fillStyle="#9A7A42";g.beginPath();g.arc(mx(cz+G.SZ),my(cx+G.SX),2.6,0,7);g.fill();g.fillStyle="rgba(0,0,0,.5)";g.beginPath();g.arc(mx(cz),my(cx),G.SH*SC*.8,0,7);g.fill()}
      g.setLineDash([3,3]);g.strokeStyle="rgba(255,255,255,.22)";g.lineWidth=1;todo.forEach(([cx,cz])=>{hexP(cx,cz);g.stroke()});g.setLineDash([]);
      PEERS.forEach(p=>{const x=mx(p.z),y=my(p.x);g.fillStyle=p.color||"#8AB";g.beginPath();g.arc(x,y,3,0,7);g.fill()});
      {const x=ox,y=oy,c=Math.cos(P.yaw),sn=-Math.sin(P.yaw),px=-sn,py=c;g.fillStyle="#FFFFFF";g.strokeStyle="#0E1013";g.lineWidth=1.2;g.beginPath();g.moveTo(x+c*6.5,y+sn*6.5);g.lineTo(x-c*4+px*4,y-sn*4+py*4);g.lineTo(x-c*2,y-sn*2);g.lineTo(x-c*4-px*4,y-sn*4-py*4);g.closePath();g.fill();g.stroke()}
      g.restore();
      g.fillStyle="#0E0B08";g.fillRect(0,MH,W,18);g.fillStyle="#CFC6B4";g.font="11px ui-monospace,Menlo,monospace";g.textBaseline="middle";g.textAlign="left";g.fillText("ярус "+LB.L+" · зал "+LB.q+", "+LB.r,8,MH+9);g.textAlign="left";g.textBaseline="alphabetic";mapDirty=false}
    function drawMap(){if(LB){libMap();return}if(WORLD){drawMapW();return}if(MPX!==drawMap.mpx){drawMap.mpx=MPX;MP=null}const W=mapC.clientWidth||232,dpr=Math.min(2,window.devicePixelRatio||1),g=mg;if(!W)return;
      if(mapC.width!==Math.round(W*dpr)||mapC.height!==Math.round(MTOT*dpr)){mapC.width=Math.round(W*dpr);mapC.height=Math.round(MTOT*dpr)}
      if(!MP)MP=clickable.filter(o=>o.userData.id&&!o.userData.go).map(o=>({o,b:hb(o),id:o.userData.id}));
      /* в «Базе» окрестность сдвигается поперёк, чтобы зал был виден целиком */
      const mcx=lastHall===IB||lastHall===IB2?Math.max(15,Math.min(40,P.x)):HALLZ[Math.max(0,lastHall)].abr?HALLZ[lastHall].cx:HALLZ[Math.max(0,lastHall)].branch?(CORR.x0+CORR.x1)/2:0;MP_.mcx=mcx;
      g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,MTOT);const ox=W*.42,mx=zz=>ox+(P.z-zz)*MSC,my=x=>MLH/2+(x-mcx)*MSC;
      g.save();g.beginPath();g.rect(0,0,W,MLH);g.clip();
      HALLZ.forEach((h,i)=>{if(h.side)return;const x0=mx(h.z0),x1=mx(h.z1);if(x1<-2||x0>W+2)return;const cur=i===lastHall,ya=my(-HW),yb=my(HW);g.fillStyle=cur?"rgba(224,58,30,.26)":MAPC[i];g.fillRect(x0,ya,x1-x0,yb-ya);
        g.strokeStyle=cur?"#E03A1E":"rgba(255,255,255,.4)";g.lineWidth=cur?1.6:1;g.beginPath();
        if(i===0){const c0=mx(CORR.DZ+CORR.DW),c1=mx(CORR.DZ-CORR.DW);g.moveTo(x0,ya+.5);g.lineTo(c0,ya+.5);g.moveTo(c1,ya+.5);g.lineTo(x1,ya+.5)}else{g.moveTo(x0,ya+.5);g.lineTo(x1,ya+.5)}
        if(i===BASE_HALL){const d0=mx(BASE.DZ+BASE.DW),d1=mx(BASE.DZ-BASE.DW);g.moveTo(x0,yb-.5);g.lineTo(d0,yb-.5);g.moveTo(d1,yb-.5);g.lineTo(x1,yb-.5)}else{g.moveTo(x0,yb-.5);g.lineTo(x1,yb-.5)}
        [x0,x1].forEach(xx=>{g.moveTo(xx,ya);g.lineTo(xx,my(-1.5));g.moveTo(xx,my(1.5));g.lineTo(xx,yb)});g.stroke()});
      {const h=HALLZ[IB],x0=mx(h.z0),x1=mx(h.z1),ya=my(h.x0),yb=my(h.x1),cur=lastHall===IB;g.fillStyle=cur?"rgba(224,58,30,.26)":MAPC[IB];g.fillRect(x0,ya,x1-x0,yb-ya);
        g.strokeStyle=cur?"#E03A1E":"rgba(255,255,255,.4)";g.lineWidth=cur?1.6:1;g.strokeRect(x0+.5,ya+.5,x1-x0-1,yb-ya-1);
        const d0=mx(BASE.DZ+BASE.DW),d1=mx(BASE.DZ-BASE.DW);g.fillStyle=cur?"rgba(224,58,30,.5)":"rgba(255,255,255,.55)";g.fillRect(d0,my(HW)-1,d1-d0,my(h.x0)-my(HW)+2);
        if(!cur&&yb>MLH){g.fillStyle="#FFFFFF";g.beginPath();const cx_=(d0+d1)/2;g.moveTo(cx_-4,MLH-7);g.lineTo(cx_+4,MLH-7);g.lineTo(cx_,MLH-2);g.closePath();g.fill()}}
      /* этап 10: «База Б» за восточной стеной «А», проём между ними */
      {const h=HALLZ[IB2],x0=mx(h.z0),x1=mx(h.z1),ya=my(h.x0),yb=my(h.x1),cur=lastHall===IB2;if(ya<MLH+2){g.fillStyle=cur?"rgba(224,58,30,.26)":MAPC[IB2];g.fillRect(x0,ya,x1-x0,yb-ya);
        g.strokeStyle=cur?"#E03A1E":"rgba(255,255,255,.4)";g.lineWidth=cur?1.6:1;g.strokeRect(x0+.5,ya+.5,x1-x0-1,yb-ya-1);
        const d0=mx(BASE2.DZ+BASE2.DW),d1=mx(BASE2.DZ-BASE2.DW);g.fillStyle=cur?"rgba(224,58,30,.5)":"rgba(255,255,255,.55)";g.fillRect(d0,my(BASE.x1)-1,d1-d0,my(h.x0)-my(BASE.x1)+2)}}
      /* этап 9: ветка — коридор и комнаты квартир (видна, когда окрестность до неё дотягивается) */
      HALLZ.forEach((h,i)=>{if(!h.branch)return;const xa=mx(h.z0),xb=mx(h.z1),ya=my(h.x0),yb=my(h.x1);if(yb<-2||ya>MLH+2||xb<-2||xa>W+2)return;const cur=i===lastHall;
        g.fillStyle=cur?"rgba(224,58,30,.26)":MAPC[i];g.fillRect(xa,ya,xb-xa,yb-ya);g.strokeStyle=cur?"#E03A1E":"rgba(255,255,255,.4)";g.lineWidth=cur?1.6:1;g.strokeRect(xa+.5,ya+.5,xb-xa-1,yb-ya-1)});
      MP.forEach(m=>{const x=mx(m.b.z),y=my(m.b.x);if(x<-3||x>W+3)return;g.fillStyle=m.o===nearObj?"#E03A1E":foundS.has(m.id)?"#FFFFFF":"rgba(255,255,255,.4)";g.fillRect(x-1.6,y-1.6,3.2,3.2)});
      const dia=(x,y,s,fill)=>{g.fillStyle=fill;g.strokeStyle="#0E1013";g.lineWidth=1;g.beginPath();g.moveTo(x,y-s);g.lineTo(x+s,y);g.lineTo(x,y+s);g.lineTo(x-s,y);g.closePath();g.fill();g.stroke()};
      NPC.forEach(n=>{const x=mx(n.z),y=my(n.x);if(x<-5||x>W+5)return;dia(x,y,4,n.g===nearObj?"#E03A1E":"#7FE3CC")});
      const others=PEERS;
      others.forEach(p=>{const x=mx(p.z),y=my(p.x);if(x<-3||x>W+3)return;g.fillStyle=p.color||"#8AB";g.beginPath();g.arc(x,y,3,0,7);g.fill();g.strokeStyle="rgba(0,0,0,.6)";g.lineWidth=1;g.stroke()});
      {const x=mx(P.z),y=my(P.x),c=Math.cos(P.yaw),sn=-Math.sin(P.yaw),px=-sn,py=c;g.fillStyle="#FFFFFF";g.strokeStyle="#0E1013";g.lineWidth=1.2;g.beginPath();
        g.moveTo(x+c*6.5,y+sn*6.5);g.lineTo(x-c*4+px*4,y-sn*4+py*4);g.lineTo(x-c*2,y-sn*2);g.lineTo(x-c*4-px*4,y-sn*4-py*4);g.closePath();g.fill();g.stroke()}
      g.restore();
      const y0=MLH+MGAP,cw=W/NH;g.font="600 10px ui-monospace, monospace";g.textAlign="center";g.textBaseline="middle";
      HALLZ.forEach((h,i)=>{if(h.side)return;const x=i*cw,cur=i===lastHall;g.fillStyle=cur?"#E03A1E":MAPC[i];g.fillRect(x+1,y0,cw-2,MSH);g.fillStyle=cur?"#FFFFFF":"rgba(255,255,255,.85)";g.fillText(String(i+1),x+cw/2,y0+MSH/2-3);
        const fr=(fc.h[h.k]||0)/Math.max(1,TOT[h.k]||1);g.fillStyle="rgba(255,255,255,.22)";g.fillRect(x+3,y0+MSH-5,cw-6,2.5);g.fillStyle=cur?"#FFFFFF":"#E9EDF0";g.fillRect(x+3,y0+MSH-5,(cw-6)*fr,2.5)});
      /* ряд ответвлений: «База Героев» — плашки под «Предметами» (этап 11), соединены с её клеткой; ветка «Квартир» — второй ряд под «Квартирами» */
      {const by=y0+MSH+3,by2=by+16,cur=lastHall===IB,bx0=Math.min(W-90,BASE_HALL*cw+1),lx=BASE_HALL*cw+cw*.5;g.strokeStyle="rgba(255,255,255,.55)";g.lineWidth=1;g.beginPath();g.moveTo(lx,y0+MSH);g.lineTo(lx,by);g.moveTo(cw*.5,y0+MSH);g.lineTo(cw*.5,by2);g.stroke();
        g.font="600 9.5px ui-monospace, monospace";g.textAlign="left";
        const bw1=Math.min(W-2,g.measureText("↳ База А").width+16);g.fillStyle=cur?"#E03A1E":MAPC[IB];g.fillRect(bx0,by,bw1,12);g.fillStyle=cur?"#FFFFFF":"rgba(255,255,255,.9)";g.fillText("↳ База А",bx0+4,by+6.5);MP_.br=[bx0,by,bw1,12];
        {const c2=lastHall===IB2,bx2=bx0+bw1+4,bw2=Math.min(W-bx2-1,g.measureText("↳ База Б").width+12);g.fillStyle=c2?"#E03A1E":MAPC[IB2];g.fillRect(bx2,by,bw2,12);g.fillStyle=c2?"#FFFFFF":"rgba(255,255,255,.9)";g.fillText("↳ База Б",bx2+5,by+6.5);MP_.br2=[bx2,by,bw2,12]}
        /* этап 9/10/11: плашки ветки — «↳ Коридор», «↳ Кв. N» — потоком во втором ряду; не поместились — в первом, после «Базы» */
        MP_.bb=[];let bx=1,ry=by2;BRI.forEach(i=>{const h=HALLZ[i];let lb="↳ "+(i===IC?"Коридор":h.short),tw=Math.min(W-2,g.measureText(lb).width+10);
          /* не помещается целиком — подпись с многоточием, если остаётся хотя бы 44 px; иначе — в первый ряд после «Базы» */
          const fit=()=>{const av=W-1-bx;if(bx+tw>W&&av>=44){while(lb.length>3&&g.measureText(lb+"…").width+10>av)lb=lb.slice(0,-1);lb+="…";tw=g.measureText(lb).width+10}};fit();
          if(bx+tw>W&&ry===by2){bx=MP_.br2[0]+MP_.br2[2]+3;ry=by;lb="↳ "+(i===IC?"Коридор":h.short);tw=Math.min(W-2,g.measureText(lb).width+10);fit()}if(bx+tw>W)return;const cu=i===lastHall;
          g.fillStyle=cu?"#E03A1E":MAPC[i];g.fillRect(bx,ry,tw,12);g.fillStyle=cu?"#FFFFFF":"rgba(255,255,255,.9)";g.fillText(lb,bx+5,ry+6.5);MP_.bb.push([bx,ry,tw,12,i]);bx+=tw+3})}
      const cell=(zz,xx)=>{const i=hallAt(zz,xx),h=HALLZ[i];const bq=h.branch&&MP_.bb.find(q=>q[4]===i);if(bq)return[bq[0]+bq[2]*(.2+.6*Math.max(0,Math.min(1,(xx-h.x0)/(h.x1-h.x0)))),bq[1]+bq[3]*.5];if(i===IB||i===IB2){const b=i===IB?MP_.br:MP_.br2;return[b[0]+b[2]*(.55+.42*Math.max(0,Math.min(1,(xx-h.x0)/(h.x1-h.x0)))),b[1]+(b[3])*Math.max(.15,Math.min(.85,(h.z0-zz)/h.D))]}return[i*cw+1+(cw-2)*Math.max(0,Math.min(1,(h.z0-zz)/h.D)),y0+MSH/2+((xx+HW)/(2*HW)-.5)*(MSH-8)]};
      NPC.forEach(n=>{const[x,y]=cell(n.z,n.x);dia(x,y,2.4,"#7FE3CC")});
      others.forEach(p=>{const[x,y]=cell(p.z,p.x);g.fillStyle=p.color||"#8AB";g.beginPath();g.arc(x,y,2.2,0,7);g.fill()});
      {const[x,y]=cell(P.z,P.x);g.fillStyle="#FFFFFF";g.strokeStyle="#0E1013";g.beginPath();g.arc(x,y,2.8,0,7);g.fill();g.stroke()}
      mapDirty=false}
    on(mapC,"pointerdown",ev=>ev.stopPropagation());
    on(mapC,"click",ev=>{if(LB)return;if(WORLD){mapClickW(ev);return}const rc=mapC.getBoundingClientRect();if(!rc.width)return;const x=(ev.clientX-rc.left)*(mapC.clientWidth/rc.width),y=(ev.clientY-rc.top)*(MTOT/rc.height),W=mapC.clientWidth;let i=-1;
      if(y>=MLH+MGAP+MSH+1){const row1=y<MP_.br[1]+MP_.br[3]+2;if(row1&&x>=MP_.br[0]-1&&x<=MP_.br[0]+MP_.br[2]+1)i=IB;else if(row1&&MP_.br2&&x>=MP_.br2[0]-1&&x<=MP_.br2[0]+MP_.br2[2]+1)i=IB2;else{const q=(MP_.bb||[]).find(q=>x>=q[0]-1&&x<=q[0]+q[2]+1&&(row1?q[1]===MP_.br[1]:q[1]!==MP_.br[1]));if(q)i=q[4]}}
      else if(y>=MLH+MGAP/2)i=Math.floor(x/(W/NH));else{const zz=P.z-(x-W*.42)/MSC,xx=(y-MLH/2)/MSC+MP_.mcx,ab=BRQ.find(Q=>{const b=HALLZ[Q.hi].hit;return xx>=b[0]&&xx<=b[1]&&zz>=b[2]&&zz<=b[3]});i=ab?ab.hi:xx>BASE.xm&&zz<=BASE.z0&&zz>=BASE.z1&&xx<=BASE.x1+.2?IB:xx>BASE2.xm&&zz<=BASE2.z0&&zz>=BASE2.z1&&xx<=BASE2.x1?IB2:xx<CORR.xm?(k=>{const h=HALLZ[k];return xx>=h.x0-.3&&xx<=h.x1+.3&&zz<=h.z0+.3&&zz>=h.z1-.3?k:-1})(hallAt(zz,xx)):HALLZ.findIndex(h=>!h.side&&zz<=h.z0&&zz>=h.z1)}
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
      get seenRings(){return seenIM.count},get bubbles(){return Object.keys(BUB).map(id=>{const b=BUB[id],m=b.spr.material;return{id,text:b.text,lines:b.lines,at:b.at,opacity:+m.opacity.toFixed(3),fog:m.fog,depthTest:m.depthTest,visible:b.spr.visible,y:+b.spr.position.y.toFixed(3),sw:+b.spr.scale.x.toFixed(3),sh:+b.spr.scale.y.toFixed(3),tex:m.map.uuid,img:[m.map.image.width,m.map.image.height]}})},get map(){return{open:mapOpen}},AIR,
      get doubles(){return NPC.map(n=>({k:n.k,name:n.name,hall:n.h,x:+n.x.toFixed(2),z:+n.z.toFixed(2),yaw:+n.g.rotation.y.toFixed(3),headYaw:+n.head.rotation.y.toFixed(3),visible:n.g.visible,label:n.lab.visible}))},
      get pose(){const f=me.userData.fig;return{g:gestNow(),sit:+(f.gs||0).toFixed(3),wave:+(f.gw||0).toFixed(3),armRz:+f.armR.rotation.z.toFixed(3),legLx:+f.legL.rotation.x.toFixed(3),bodyY:+f.body.position.y.toFixed(3)}},
      get look(){const f=me.userData.fig;return{look:f.look,top:"#"+f.M.top.color.getHexString(),bot:"#"+f.M.bot.color.getHexString(),hair:f.parts.hair.length,skirt:!!f.parts.skirt,tail:!!f.parts.tail,cap:f.parts.cap.length,k:P.k}},
      peerLook(id){const a=AV[id];if(!a)return null;const f=a.userData.fig;return{k:a.userData.k,look:f.look,top:"#"+f.M.top.color.getHexString(),hair:f.parts.hair.length,skirt:!!f.parts.skirt,cap:f.parts.cap.length}},
      peerPose(id){const a=AV[id];if(!a)return null;const f=a.userData.fig;return{g:a.userData.g,sit:+(f.gs||0).toFixed(3),wave:+(f.gw||0).toFixed(3),armRz:+f.armR.rotation.z.toFixed(3),legLx:+f.legL.rotation.x.toFixed(3),bodyY:+f.body.position.y.toFixed(3)}},
      get audio(){return snd.dbg()},get niche(){return Object.fromEntries(Object.keys(PROPS.CM).map(n=>[n,"#"+PROPS.CM[n].color.getHexString()]))},BASE,BASE2,IB,IB2,adj,seen,hallAt,
      get emblem(){return{state:embState,n:EMB.length,vis:EMB.filter(e=>e.mesh.visible).length,mapped:EMB.filter(e=>!!e.mat.map).length}},get base2Vis(){return{surf:base2Surf.filter(m=>m.visible).length,props:PR.filter(p=>p.k==="hb2").reduce((a,p)=>a+[...p.core,...p.extra].filter(m=>m.visible).length,0)}},
      get mapHit(){return {bb:MP_.bb,br:MP_.br,br2:MP_.br2,H:MTOT}},get bar(){return [...bar.querySelectorAll("button")].map(b=>({h:+b.dataset.h,t:b.textContent}))},get title(){return titleEl.textContent},get where(){return whereEl.textContent},
      get baseVis(){return{surf:baseSurf.filter(m=>m.visible).length,props:PR.filter(p=>p.k==="hb").reduce((a,p)=>a+[...p.core,...p.extra].filter(m=>m.visible).length,0)}},get props(){return PR.map(p=>({k:p.k,hi:p.hi,meshes:p.core.length+p.extra.length,core:p.core.length,extra:p.extra.length,parts:p.parts,nx:p.nx,vis:[...p.core,...p.extra].filter(m=>m.visible).length,tris:[...p.core,...p.extra].reduce((a,m)=>a+m.geometry.index.count/3,0)}))},canStand,groundAt,get colliders(){return blockers},get walkRects(){return walk},LOW_TOP,JUMP:{v:JUMP_V,g:GRAV,step:STEP,airStep:AIR_STEP,head:HEAD,r},
      get branch(){return{IC,spaces:HALLZ.map((h,i)=>h.branch?{i,k:h.k,name:HN(h.k),short:h.short,x0:+h.x0.toFixed(2),x1:+h.x1.toFixed(2),z0:+h.z0.toFixed(2),z1:+h.z1.toFixed(2),H:h.H,spawn:h.spawn}:null).filter(Boolean),
        rooms:BR.rooms.map(R_=>({k:R_.r.k,hi:R_.hi,flat:R_.f.id,tree:!!R_.tree,F:R_.F,list:R_.list})),closed:BR.closed.map(f=>({id:f.id,number:f.number,side:f.side,dx:f.dx})),
        surf:BR.surf.map(e=>({hi:e.hi,vis:e.m.visible})),links:[...LINKS],ports:PORT,layers:{far:farOff,near:nearOff}}},ceilAt,
      get clickPts(){return clickable.map(o=>{o.getWorldPosition(tmpV);return {id:o.userData.id||o.userData.go||'',dbl:!!o.userData.dbl,x:+tmpV.x.toFixed(3),z:+tmpV.z.toFixed(3)}})}}));
    updSeen();
    /* этап 6: из «Базы» залы дальше «Предметов» не видны (их закрывают стены «Квартир»), но в усечённую пирамиду камеры попадают —
       такие объекты переносятся на слой 1, который камера в «Базе» не рисует. Лампы не трогаем (иначе пересборка шейдеров); лучи видят все слои */
    const FAR=1,NEAR=2,MID=3;/* этап 11: MID — зал сразу за «Предметами»: из «Базы» его видно сквозь «Предметы», из ветки квартир — нет */
    if(BOOK)S.children.forEach(o=>{if(o.isLight||o===me||o===hlRing||o===hlMark||o===seenIM)return;let h_=-1;
      if(o.userData.prop)h_=HALLZ.findIndex(h=>h.k===o.userData.prop);
      else if(o.geometry){if(!o.geometry.boundingSphere)o.geometry.computeBoundingSphere();o.updateMatrixWorld(true);const c=o.geometry.boundingSphere.center.clone().applyMatrix4(o.matrixWorld);h_=hallAt(c.z,c.x)}
      else{o.updateMatrixWorld(true);const c=new T.Vector3().setFromMatrixPosition(o.matrixWorld);h_=hallAt(c.z,c.x)}
      if(h_===BASE_HALL+1)o.traverse(c=>c.layers.set(MID));else if(h_>=2&&h_<NH)o.traverse(c=>c.layers.set(FAR));else if(h_===0||h_===1)o.traverse(c=>c.layers.set(NEAR))});
    /* этап 9: из коридора залы дальше «Предметов» тоже не видны (слой FAR); из комнат квартир не видны и «Квартиры» с «Предметами» (слой NEAR) */
    cam.layers.enable(FAR);cam.layers.enable(NEAR);cam.layers.enable(MID);ray.layers.enableAll();cray.layers.enableAll();let farOff=false,nearOff=false,midOff=false;
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
      const spd=(keys.ShiftLeft||keys.ShiftRight||keys.RunTap)?RUN:WALK;let tx=ix*spd,tz=iz*spd;
      const rail_=LB?libRail(dt,ix,iz,m,spd,f):false;
      if(m>.05)target=null;else if(target){const dx=target.x-P.x,dz=target.z-P.z,d=Math.hypot(dx,dz);if(d<.15){target=null;tx=tz=0}else{const v=WALK*Math.min(1,d/.6);tx=dx/d*v;tz=dz/d*v}}
      if(GS.sit&&(m>.05||target||jumpQ))toggleSit(false);if(GS.waveT>0){GS.waveT-=dt;if(GS.waveT<=0){GS.waveT=0;syncG()}}
      const kk=(1-Math.exp(-dt*((m>.05||target)?9:7)))*(V.ground?1:.35);if(!rail_){V.x+=(tx-V.x)*kk;V.z+=(tz-V.z)*kk}
      if(Math.abs(V.x)<.004)V.x=0;if(Math.abs(V.z)<.004)V.z=0;
      if(!rail_&&(V.x||V.z)){if(!moveBy(V.x*dt,V.z*dt)&&target)target=null}
      /* прыжок и гравитация (этап 4): опора — пол или верх низкого препятствия под фигурой */
      if(jumpQ){jumpQ=false;if(V.ground&&!rail_){V.vy=JUMP_V;V.ground=false}}
      if(!rail_)stepVert(dt);
      const sp=Math.hypot(V.x,V.z);
      /* куда смотрит фигура */
      if(fp)P.yaw=C.yaw;else if(sp>.25)P.yaw+=angDiff(P.yaw,Math.atan2(-V.x,-V.z))*(1-Math.exp(-dt*12));
      /* с джойстиком камера понемногу заходит за спину идущей фигуры */
      if(!fp&&joy&&sp>.3&&now-lastLook>900){const d=angDiff(C.yaw,P.yaw);if(Math.abs(d)<2.2)C.yaw+=d*(1-Math.exp(-dt*1.1))*Math.min(1,sp/WALK)}
      const hi=hallAt(P.z,P.x);
      /* камера */
      if(fp){C.cur=C.d=0;if(V.ground&&sp>.3)bob+=dt*9*sp/WALK;cam.position.set(P.x,P.y+1.55+(reduce?0:Math.sin(bob)*.022),P.z)}
      else{pivT.set(P.x,P.y+1.55,P.z);if(pivT.distanceTo(piv)>3)piv.copy(pivT);else piv.lerp(pivT,1-Math.exp(-dt*(reduce?30:14)));
        C.cur+=(C.want-C.cur)*(1-Math.exp(-dt*8));
        back.set(Math.sin(C.yaw)*Math.cos(C.pitch),-Math.sin(C.pitch),Math.cos(C.yaw)*Math.cos(C.pitch));
        cray.set(piv,back);cray.near=0;cray.far=C.cur+.3;const hit=cray.intersectObjects(camBlock,false)[0];
        const want=hit?Math.max(.3,hit.distance-.3):C.cur;if(want<C.d)C.d=want;else C.d+=(want-C.d)*(1-Math.exp(-dt*5));
        cam.position.copy(piv).addScaledVector(back,C.d);cam.position.y=Math.max(.25,Math.min(HALLZ[hi].H-.15,cam.position.y))}
      cam.rotation.set(C.pitch,C.yaw,0);
      if(SEAT){if(GS.sit){P.x=SEAT.x;P.z=SEAT.z;P.y=SEAT.y;P.sy=SEAT.y;P.yaw=SEAT.yaw;V.x=V.z=V.vy=0;V.ground=true}else{P.x=SEAT.fx;P.z=SEAT.fz;P.y=SEAT.fy;P.sy=0;V.x=V.z=V.vy=0;V.ground=true;SEAT=null}}
        me.position.set(P.x,P.y,P.z);me.rotation.y=P.yaw;me.visible=!fp&&C.d>.75;animFig(me,dt,sp,!V.ground,t);P.g=gestNow();poseFig(me,dt,P.g,t);if(HOLD.on){const f_=me.userData.fig;if(HOLD.g.parent!==f_.armR)holdAttach(f_,HOLD.g);f_.armR.rotation.x=1.15;f_.armR.rotation.z=0}
      /* шаги по фазе походки: каждый полупериод — шаг (бег — чаще и громче) */
      {const ss_=Math.sin(me.userData.fig.ph)>=0;if(V.ground&&sp>.6){if(ss_!==frame._ss)snd.step(sp>WALK+.6,V.gy>.05?"furn":HALLZ[hi].floor)}frame._ss=ss_}
      {const gy=groundAt(P.x,P.z,P.y,0);me.userData.fig.blob.position.y=gy+.013-P.y;me.userData.fig.blob.scale.setScalar(Math.max(.5,1-(P.y-gy)*.6))}
      if(hi!==lastHall){lastHall=hi;const hz=HALLZ[hi];whereEl.textContent=TN(hz.k);whereSm.textContent=WORLD?(hz.world==="r"?(isHallRow(hz.space)?"ЗАЛ АВТОРА":"ПРОСТРАНСТВО ПОСЕТИТЕЛЯ"):"ЭТАЖ "+wLab(WF.floor)):hz.abr?"ЗАЛ АВТОРА":hz.branch?"БОКОВАЯ ВЕТКА":hz.side?"БОКОВОЙ ЗАЛ":`ЗАЛ ${hi+1} ИЗ ${NH}`;
        bar.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed",String(+b.dataset.h===hi)));updFound();showTitle(hi);mapDirty=true}
      /* этап 13: из ветки зала автора видны её зал и соседи — дальние слои не отключаются */
      const ab_=!!HALLZ[hi].abr;if(BOOK&&(hi>=IB&&!ab_)!==farOff){farOff=hi>=IB&&!ab_;if(farOff)cam.layers.disable(FAR);else cam.layers.enable(FAR)}
      {const mo=BOOK&&hi>=IB&&hi!==IB&&!ab_;if(mo!==midOff){midOff=mo;if(mo)cam.layers.disable(MID);else cam.layers.enable(MID)}}
      {const no=HALLZ[hi].branch==="r"||hi===IB2;if(no!==nearOff){nearOff=no;if(no)cam.layers.disable(NEAR);else cam.layers.enable(NEAR)}}
      stepAir(dt);stepLights();stepDbl(dt,t,hi);stepProps(hi,t,dt);if(BOOK){stepNiche(t,hi);stepTower(t,hi);stepEmb(hi)}stepPhotos(hi);if(BOOK)hsStep(hi);if(LB)libStep(dt,now);else if(WORLD)stepWorld(hi,now);else stepBranch(hi,now);if(hi!==arrSync.h){arrSync.h=hi;arrSync(hi)}mus.want(HALLZ[hi].room&&HALLZ[hi].room.mus||HALLZ[hi].k);
      /* звуковые постели: тот же переход у проёмов, что и у воздуха залов (±2,5 м) */
      if(now-(frame._am||0)>120){const ddt=(now-(frame._am||now))/1000;frame._am=now;const {i,j,t:tt}=blendAt(P.x,P.z),W={};
        W[HALLZ[i].k]=1-tt;if(j!==i)W[HALLZ[j].k]=tt;snd.mix(W,ddt)}
      /* стрелка идёт только под взглядом */
      if(clockHand){cam.getWorldDirection(fwd);tmpV.copy(clockPos).sub(cam.position);const d=tmpV.length();tmpV.normalize();if(fwd.dot(tmpV)>.93&&d<8+C.d)clockHand.rotation.z-=dt*Math.PI*2/60}
      if(leds.length&&Math.random()<.2)leds[Math.floor(Math.random()*leds.length)].visible=Math.random()>.3;
      anim.forEach(a=>a(t));if(screens.length&&Math.floor(now/700)!==frame._s){frame._s=Math.floor(now/700);drawScreens(t)}
      /* ближайший предмет: рядом с фигурой и в стороне взгляда камеры */
      const fx=-sy,fz=-cy;let best=null,bd=2.6;clickable.forEach(o=>{o.getWorldPosition(tmpV);const dx=tmpV.x-P.x,dz=tmpV.z-P.z,d=Math.hypot(dx,dz);if(d<bd&&(d<.9||(dx*fx+dz*fz)/d>.5)){bd=d;best=o}});
      const touch=coarse.matches;
      if(!INS.on&&(best!==nearObj||touch!==frame._t)){nearObj=best;frame._t=touch;if(bAct)bAct.dataset.on=best?"1":"0";const dbl=!!(best&&best.userData.dbl);setAct(dbl?"talk":"look",dbl?best.userData.label:"");
        if(best){nearEl.hidden=false;nearEl.textContent=dbl?best.userData.label+" · двойник — "+(touch?"кнопка «говорить»":"E, чтобы поговорить"):(best.userData.label||"Предмет")+(best.userData.n?" · запись "+best.userData.n:"")+(touch?" — кнопка «смотреть»":best.userData.id&&!WORLD&&OBJM[best.userData.id]?" — E: карточка · T: взять":" — E или клик")}else nearEl.hidden=true}
      if(opt.multi){peersStep(dt,hi,t);stepBubbles(fp);voiceStep(now,hi)}
      stepHL(t);if(now-(frame._lh||0)>350){frame._lh=now;layHud()}if(mapOpen&&(mapDirty||now-mapT0>(lite?250:66))){mapT0=now;drawMap()}stepFps(now);
      stepLOD();if(INS.on)insStep();R.render(S,cam);calls=R.info.render.calls;if(INS.on&&INS.hold){const ac=R.autoClear;R.autoClear=false;R.clearDepth();R.render(INS.S,INS.cam);R.autoClear=ac}
      else if(HOLD.on&&HOLD.fp&&fp){if(HOLD.cam.aspect!==cam.aspect){HOLD.cam.aspect=cam.aspect;HOLD.cam.updateProjectionMatrix()}const ac=R.autoClear;R.autoClear=false;R.clearDepth();R.render(HOLD.S,HOLD.cam);R.autoClear=ac}raf=requestAnimationFrame(frame);
    }

    /* этап 9: раскладка HUD без наложений: «сейчас играет» поднимается над рядом кнопок, если они встретились (узкий вид ~800 px);
       блок подсказок не выше карты — иначе прокручивается */
    function layHud(){if(stopped)return;const np=hud.querySelector(".mz-np"),ctl=hud.querySelector(".mz-ctl"),keys=hud.querySelector(".keys"),map=hud.querySelector(".mz-map");if(!ctl||!np)return;
      const W=wrap.getBoundingClientRect(),ph=coarse.matches;np.style.bottom="";
      if(!ph&&!np.hidden){const a=np.getBoundingClientRect(),c=ctl.getBoundingClientRect();if(a.width&&a.right>c.left-8&&a.bottom>c.top-4)np.style.bottom=Math.round(W.bottom-c.top+8)+"px"}
      if(keys&&map&&!ph){const c=ctl.getBoundingClientRect(),m=map.getBoundingClientRect(),avail=Math.round((W.bottom-100)-(m.bottom+8));keys.style.maxHeight=Math.max(60,avail)+"px"}}
    stopFns.push(()=>{const k=hud.querySelector(".keys"),n=hud.querySelector(".mz-np");if(k)k.style.maxHeight="";if(n)n.style.bottom=""});
    /* чат зала в полноэкранном виде: последние реплики зала и поле ввода; пишет через тот же канал Live (room.emit("hallchat")) */
    const chat=(function(){
      const M=opt.multi,ok=!!(M&&M.chat&&M.say);const el=document.createElement("div");el.className="mz-chat";el.hidden=true;
      el.innerHTML=`<button type="button" class="mz-chatt" aria-expanded="true" aria-controls="mz-chatb">Чат зала<i aria-hidden="true">▾</i></button><div class="mz-chatb" id="mz-chatb"><div class="mz-chatl" role="log" aria-live="polite"></div><form class="mz-chatf"><input maxlength="300" placeholder="Сказать тем, кто в этом зале" aria-label="Сообщение в чат зала" enterkeyhint="send"><button type="submit">Сказать</button></form><p class="mz-chatm" role="status"></p></div>`;
      if(ok)hud.appendChild(el);
      const tg=el.querySelector(".mz-chatt"),lg=el.querySelector(".mz-chatl"),fm=el.querySelector("form"),inp=el.querySelector("input"),msg=el.querySelector(".mz-chatm");
      let open_=!coarse.matches,iv=0,off_=null,noteT=0,lastH="";
      const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
      const setOpen=v=>{open_=v;el.dataset.mzc=v?"1":"0";tg.setAttribute("aria-expanded",String(v))};setOpen(open_);
      const note=t=>{msg.textContent=t||"";clearTimeout(noteT);if(t)noteT=setTimeout(()=>{msg.textContent=""},6000)};
      function draw(){if(el.hidden||!ok)return;const h=window.__curHall||"";const c=M.chat(h,5);const k=h+"|"+c.msgs.map(m=>m.at+m.text).join("|");if(k===lastH)return;lastH=k;
        tg.firstChild.textContent=h?"Чат зала «"+(window.__curHallName||h)+"»":"Чат музея";
        lg.innerHTML=c.msgs.map(m=>`<div class="mz-chm${m.me?" me":""}"><b>${esc(m.who)}</b> ${esc(m.text)}</div>`).join("")||`<div class="mz-chm mz-che">Тишина.</div>`;lg.scrollTop=lg.scrollHeight}
      on(tg,"click",()=>{setOpen(!open_);if(open_)draw()});
      on(fm,"submit",async ev=>{ev.preventDefault();const t=inp.value.trim();if(!t)return;const r=await M.say(window.__curHall||"",t);if(r&&r.ok){inp.value="";note("")}else note(r&&r.note||"Сообщение не ушло.")});
      on(inp,"focus",()=>{const c=M.chat(window.__curHall||"",1);if(!c.room)note(c.note||"")});
      /* клавиши в поле не управляют фигурой (kd пропускает input); Esc — вернуть управление сцене */
      on(inp,"keydown",ev=>{if(ev.key==="Escape"){ev.preventDefault();inp.blur();try{canvas.focus({preventScroll:true})}catch(e){}}ev.stopPropagation()});
      on(inp,"keyup",ev=>ev.stopPropagation());
      return {show(v){if(!ok)return;el.hidden=!v;clearInterval(iv);if(off_){off_();off_=null}if(v){lastH="";draw();iv=setInterval(draw,1500);if(M.sub)off_=M.sub(draw)}else{note("");if(document.activeElement===inp)inp.blur()}},
        dispose(){clearInterval(iv);clearTimeout(noteT);if(off_)off_();el.remove()},el}
    })();

    /* ---------- этап 7: «на весь экран». Fullscreen API на .hallwrap; где его нет или он отклонён (iPhone) — заливка окна средствами CSS.
       Всё, что сайт и музей кладут в body поверх музея (карточка предмета .overlay, просмотр .lbx, лупа, панели «персонаж» и «музыка залов»),
       на время полноэкранного вида переносится внутрь .hallwrap и возвращается обратно. Чат зала — компактная панель внутри музея ---------- */
    const FS=(function(){
      const btn=hud.querySelector(".mz-fsb"),d=document,B=d.body;
      const fsEl=()=>d.fullscreenElement||d.webkitFullscreenElement||null;
      const api=!!((wrap.requestFullscreen||wrap.webkitRequestFullscreen)&&(d.fullscreenEnabled||d.webkitFullscreenEnabled));
      const SEL=".overlay,.lbx,.loupe,.mz-cust,.mz-pv";
      let mode="",scrollY0=0,bodySt=null,mo=null,pendT=0;
      const move=(n,to)=>{const a=d.activeElement,had=a&&n.contains(a);to.appendChild(n);if(had)try{a.focus({preventScroll:true})}catch(e){}};
      const adopt=n=>{if(n&&n.nodeType===1&&n.parentNode===B&&n.matches(SEL))move(n,wrap)};
      /* этап 9: кнопка наверху; в полноэкранном виде — «свернуть» и значок выхода */
      const IC_IN='<path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" fill="none" stroke="currentColor" stroke-width="1.6"/>',IC_OUT='<path d="M6 2v4H2M14 6h-4V2M10 14v-4h4M2 10h4v4" fill="none" stroke="currentColor" stroke-width="1.6"/>';
      const ui=v=>{btn.setAttribute("aria-pressed",String(v));btn.setAttribute("aria-label",v?"Свернуть: выйти из полноэкранного вида":"На весь экран");btn.title=v?"Свернуть (F)":"На весь экран (F)";
        btn.querySelector("svg").innerHTML=v?IC_OUT:IC_IN;btn.querySelector(".mz-lf").textContent=v?"свернуть":"на весь экран";btn.querySelector(".mz-ls").textContent=v?"свернуть":"экран"};
      function on_(m){mode=m;wrap.classList.add("mz-full");wrap.classList.toggle("mz-fill",m==="fill");ui(true);
        [...B.children].forEach(adopt);B.appendChild=function(n){return n&&n.nodeType===1&&n.matches(SEL)?wrap.appendChild(n):Node.prototype.appendChild.call(B,n)};mo=new MutationObserver(rs=>rs.forEach(r=>r.addedNodes.forEach(adopt)));mo.observe(B,{childList:true});
        chat.show(true);qTop();try{canvas.focus({preventScroll:true})}catch(e){}{const c=d.getElementById("mzCarry");if(c)setTimeout(()=>c.remove(),120)}}
      function off(){if(!mode)return;const m=mode;mode="";clearTimeout(pendT);if(mo){mo.disconnect();mo=null}if(Object.prototype.hasOwnProperty.call(B,"appendChild"))delete B.appendChild;
        [...wrap.children].filter(n=>n.matches(SEL)).forEach(n=>move(n,B));
        wrap.classList.remove("mz-full","mz-fill");ui(false);chat.show(false);
        if(m==="fill"&&bodySt){Object.assign(B.style,bodySt);bodySt=null}
        if(m!=="pending")try{window.scrollTo(0,scrollY0)}catch(e){}qTop()}
      function fill(){bodySt={position:B.style.position,top:B.style.top,left:B.style.left,right:B.style.right,overflow:B.style.overflow};
        Object.assign(B.style,{position:"fixed",top:-scrollY0+"px",left:"0",right:"0",overflow:"hidden"});on_("fill")}
      /* этап 22: настоящий полноэкранный режим берётся на корне страницы, а окно музея растягивается поверх (mz-fill). Корень переживает смену мира в лифте — экран не мигает */
      const ROOT=d.documentElement;let nat=false;
      function enter(){if(mode||stopped)return;scrollY0=window.scrollY||0;
        if(api){if(fsEl()===ROOT){nat=true;fill();return}mode="pending";let r;try{r=(ROOT.requestFullscreen||ROOT.webkitRequestFullscreen).call(ROOT,{navigationUI:"hide"})}catch(e){mode="";fill();return}
          if(r&&r.catch)r.catch(()=>{if(mode==="pending"){mode="";fill()}});
          pendT=setTimeout(()=>{if(mode==="pending"&&fsEl()!==ROOT){mode="";fill()}},1500);return}
        fill()}
      function exit(){if(mode==="fill"){if(nat&&fsEl()===ROOT){nat=false;try{const r=(d.exitFullscreen||d.webkitExitFullscreen).call(d);if(r&&r.catch)r.catch(()=>{})}catch(e){}}off();return}if(mode)off()}
      const onChange=()=>{const f=fsEl();if(f===ROOT){if(mode==="pending"){clearTimeout(pendT);mode="";nat=true;const y=scrollY0;fill();scrollY0=y}}else if(mode==="pending"||(mode==="fill"&&nat)){nat=false;off()}};
      on(d,"fullscreenchange",onChange);on(d,"webkitfullscreenchange",onChange);
      on(btn,"click",()=>{mode?exit():enter()});
      stopFns.push(()=>{const b=hud.querySelector(".mz-fstop");if(b)b.remove()});
      stopFns.push(()=>{const keep=CARRY&&CARRY.fs&&Date.now()-CARRY.at<10000;if(nat&&fsEl()===ROOT&&!keep)try{(d.exitFullscreen||d.webkitExitFullscreen).call(d)}catch(e){}off();chat.dispose()});
      return {toggle(){mode?exit():enter()},exit,get mode(){return mode},get api(){return api}};
    })();
    canvas.__mz.fs=FS;canvas.__mz.chat=chat;
    /* этап 8, часть 2: предметы комнат посетителей, кнопка расстановки, старт мира, отладка; уход — освободить всё своё */
    if(WORLD){WR.forEach(wPlaceAll);goHall(W_START)}
    /* этап 13: ветки залов автора — предметы и картины; адрес зала (#space-<id>) — сразу в него */
    BRQ.forEach(wPlaceAll);if(BOOK&&opt.enterBranch){const Q=BRQ.find(q=>q.s.id===opt.enterBranch);if(Q)goHall(Q.hi)}
    /* этап 12: после «Применить без перезагрузки» — туда же, где стоял посетитель */
    if(BOOK&&opt.resume&&isFinite(+opt.resume.x)&&isFinite(+opt.resume.z)&&inWalk(+opt.resume.x,+opt.resume.z)){P.x=+opt.resume.x;P.z=+opt.resume.z;P.yaw=C.yaw=+opt.resume.yaw||0;piv.set(P.x,1.55,P.z)}
    canvas.__mz.hs=()=>({styles:Object.keys(HS),light:Object.assign({},HS_T),surf:Object.values(HSG).map(G=>({k:G.k,part:G.part,state:G.state,map:!!G.mat.map,color:G.def.color,slots:G.slots.length,applied:G.slots.filter(sl=>{const m=sl.mesh.material;return (Array.isArray(m)?m[sl.face===4?1:2]:m)===G.mat}).length,px:G.px||null})),
      paint:HSP.map(P=>({k:P.k,j:P.j,title:P.p.title,on:P.on,vis:P.g.visible,state:P.state,map:!!P.tex,size:P.size,x:+P.g.position.x.toFixed(2),y:+P.g.position.y.toFixed(2),z:+P.g.position.z.toFixed(2),click:clickable.indexOf(P.im)>=0}))});
    arrInit();
    if(carry&&carry.fs)setTimeout(()=>{if(!stopped&&!FS.mode)FS.toggle()},60);
    stopFns.push(()=>{WTEX.forEach(t=>t.dispose());WTEX.clear();Object.values(WG).forEach(g=>g&&g.dispose());Object.values(WMT).forEach(m=>m.dispose());WR.concat(BRQ).forEach(Q=>{Object.values(Q.surf).forEach(G=>G.mat.dispose());Q.objs.forEach(Wo=>{if(Wo.imat)Wo.imat.dispose();if(Wo.pmat)Wo.pmat.dispose()});Q.meshes.forEach(m=>m.geometry.dispose());if(Q.plate.mesh){Q.plate.mesh.geometry.dispose();Q.plate.mesh.material.dispose()}});WAIR.forEach(k=>{delete AIR[k];delete SNDK[k]});window.__curHallName=""});
    Object.defineProperty(canvas.__mz,"world",{get(){return WORLD?{floor:WF.floor,id:WID,lc:W_LC,rooms:WR.map(Q=>({id:Q.s.id,title:Q.s.title,status:Q.s.status,hi:Q.hi,side:Q.side,zc:Q.zc,door:Q.door,on:Q.on,F:Q.F,w:+Q.r.w,d:+Q.r.d,h:+Q.r.h,canEdit:!!Q.s.canEdit,plate:!!Q.plate.tex,
      surf:Object.values(Q.surf).map(G=>({key:G.key,state:G.state,img:G.def.img||"",fit:G.fit||G.def.fit,tile:G.tile||null,map:!!G.mat.map,wrap:G.mat.map?G.mat.map.wrapS:null,color:"#"+G.mat.color.getHexString(),px:G.mat.map&&G.mat.map.__px||null,meshes:G.meshes.length,vis:G.meshes.filter(m=>m.visible).length})),
      objs:Q.objs.map(Wo=>({id:Wo.o.id,name:Wo.o.name,kind:Wo.kind,pl:Wo.pl,state:Wo.state||"",map:!!(Wo.imat&&Wo.imat.map),size:Wo.size,x:+Wo.grp.position.x.toFixed(3),z:+Wo.grp.position.z.toFixed(3),y:+Wo.grp.position.y.toFixed(3),vis:Wo.grp.visible,blk:Wo.blk?Wo.blk.slice(0,4):null}))})),lift:LIFT&&{x:LIFT.x,z:LIFT.z},start:W_START}:{lift:LIFT&&{x:LIFT.x,z:LIFT.z},late:LATE,bookPed:Object.keys(BOOKPED).length}}});
    /* этап 13: ветки залов автора (для проверок) */
    Object.defineProperty(canvas.__mz,"abr",{get(){return BRQ.map(Q=>({id:Q.s.id,title:Q.s.title,hi:Q.hi,k:Q.k,par:Q.br.i,parK:Q.br.k,wall:Q.br.wall,at:Q.br.at,c:Q.br.c,F:Q.F,door:Q.door,on:Q.on,plate:!!Q.plate.tex,
      hit:HALLZ[Q.hi].hit,spawn:HALLZ[Q.hi].spawn,meshes:Q.meshes.length,vis:Q.meshes.filter(m=>m.visible).length,light:HS_T[Q.k]||null,
      objs:Q.objs.map(Wo=>({id:Wo.o.id,name:Wo.o.name,p:!!Wo.o._p,kind:Wo.kind,state:Wo.state,vis:!!(Wo.grp&&Wo.grp.visible),pl:Wo.pl,size:Wo.size,x:Wo.grp?+Wo.grp.position.x.toFixed(2):null,z:Wo.grp?+Wo.grp.position.z.toFixed(2):null})),
      surf:Object.values(Q.surf).map(G=>({key:G.key,state:G.state,color:G.def.color,fit:G.fit||null}))}))}});
    Object.defineProperty(canvas.__mz,"arr",{get(){return {can:ARR.can,open:ARR.open,hi:ARR.hi,sel:ARR.sel,btn:ARR.btn?!ARR.btn.hidden:false,msg:ARR.el?ARR.el.querySelector(".mz-arrs").textContent:""}}});
    canvas.__mz.act=o=>activate(o);Object.defineProperty(canvas.__mz,"voice",{get(){return VO?Object.assign(VO.dbg(),{btn:micB?micB.getAttribute("aria-pressed"):null,note:vNote&&!vNote.hidden?vNote.textContent:""}):null}});canvas.__mz.mic=()=>micToggle();Object.defineProperty(canvas.__mz,"essays",{get(){return {on:ESH.on,n:ESH.n,books:ESH.books.map(b=>({go:b.userData.go,label:b.userData.label,x:+b.position.x.toFixed(2),y:+b.position.y.toFixed(2),z:+b.position.z.toFixed(2)}))}}});canvas.__mz.clickables=()=>clickable;Object.defineProperty(canvas.__mz,"mem",{get(){return {geo:R.info.memory.geometries,tex:R.info.memory.textures,prog:(R.info.programs||[]).length}}});canvas.__mz.arrAct=arrAct;canvas.__mz.arrOpen=arrOpen;canvas.__mz.arrSel=id=>{ARR.sel=id;arrDraw("")};canvas.__mz.liftOpen=liftOpen;canvas.__mz.bookPed=id=>{const g=BOOKPED[id];return g?{x:g.position.x,z:g.position.z,r:g.userData.r||0,manual:!!g.userData.manual,hall:hallAt(g.position.z,g.position.x)}:null};canvas.__mz.peers=()=>PEERS.map(p=>({id:p.id,hall:p.hall}));canvas.__mz.avatars=()=>Object.keys(AV);
    hint0();syncView();raf=requestAnimationFrame(frame);
  }
  return function stop(){if(stopped)return;if(opt.multi)opt.multi.leave();stopped=true;cancelAnimationFrame(raf);stopFns.splice(0).forEach(f=>{try{f()}catch(e){}});try{if(R){R.dispose();R.forceContextLoss&&R.forceContextLoss()}}catch(e){}};
}
/* этап 12: размеры залов для редактора оформления (метры): длины стен n/s/e/w, высота, исходные цвета, проёмы {стена:[ширина,высота,смещение]} */
function hallInfo(br){const o={};let z=0;SPEC.forEach((s,i)=>{const H=s.tall?8.5:(s.k==="pr"||s.k==="sv"||s.k==="dv"?4.6:4.2),d={},z0=z,z1=z-s.D;z=z1;if(i>0)d.s=[3,3,0];if(i<SPEC.length-1)d.n=[3,3,0];
    if(i===0)d.w=[CORR.DW*2,CORR.DH,+((z0-CORR.DZ)-s.D/2).toFixed(2)];if(i===BASE_HALL)d.e=[BASE.DW*2,BASE.DH,+((BASE.DZ-z1)-s.D/2).toFixed(2)];
    o[s.k]={L:{n:HW*2,s:HW*2,e:s.D,w:s.D},H,wall:s.wall,ceil:s.ceil,floor:"#8B6F55",doors:d,doorsAll:Object.fromEntries(Object.keys(d).map(w=>[w,[d[w]]]))}});
  /* этап 13: проёмы веток залов автора (br — строки залов; по умолчанию — из последнего запуска музея) */
  (br||LAST_BR).map(brGeo).filter(Boolean).forEach(g=>{const I=o[g.k],cz=(ZS[g.i][0]+ZS[g.i][1])/2,u=+(g.wall==="e"?g.c-cz:g.wall==="w"?cz-g.c:g.wall==="s"?-g.c:g.c).toFixed(2),dr=[BR_DW,BR_DH,u];
    (I.doorsAll[g.wall]=I.doorsAll[g.wall]||[]).push(dr);if(!I.doors[g.wall])I.doors[g.wall]=dr});
  const W=+(BASE.x1-BASE.x0).toFixed(2),D=+(BASE.z0-BASE.z1).toFixed(2);o.hb={L:{n:D,s:D,e:W,w:W},H:BASE.H,wall:"#B7BDC3",ceil:"#2B2E34",floor:"#3A3D42",doors:{s:[BASE.DW*2,BASE.DH,+((BASE.z0-BASE.DZ)-D/2).toFixed(2)],n:[BASE2.DW*2,BASE2.DH,+((BASE2.DZ-BASE.z1)-D/2).toFixed(2)]}};return o}
return {mount,FLATS,CORR,treeSeason,hallInfo,hallStyleValid:hsValid,hallPaintFit:hsFit,dockSpots,corrPlan,branchGeo:brGeo,dockOk:(s,rows)=>{const g=brGeo(s);if(!g)return false;const R=(DOCKF[g.k]||{})[g.wall]||[];return R.some(([a,b])=>g.at>=a-1e-6&&g.at<=b+1e-6)&&!brClash(g,(rows||[]).map(brGeo).filter(Boolean)).length},branchClash:(s,rows)=>{const g=brGeo(s);return g?brClash(g,(rows||[]).map(brGeo).filter(Boolean)):["место не задано"]},DOCKF,BR:{dw:BR_DW,dh:BR_DH,ls:BR_LS}};
})();

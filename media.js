/* Звук и кадр: блоки YouTube, Vimeo, Яндекс Музыки, Spotify.
   Чтобы добавить блок, допишите объект в ITEMS: {id, url, title, by, year, kw, note}.
   url — обычная ссылка на видео или трек; kw — слова, по которым блок сам находит записи книги. */
window.Media=(function(){
"use strict";
const ITEMS=[
 /* девяностые Viktor — «моделька, на которой он обучился» */
 {id:"whatislove",url:"https://www.youtube.com/watch?v=HEXWRTEbj1I",title:"What Is Love",by:"Haddaway",year:1993,g:"viktor",kw:/What Is Love|Haddaway|девяност/i},
 {id:"itsmylife",url:"https://www.youtube.com/watch?v=oW0VovnyjPY",title:"It's My Life",by:"Dr. Alban",year:1992,g:"viktor",kw:/Dr\.? Alban|It's My Life|девяносто втор/i},
 {id:"mrvain",url:"https://www.youtube.com/watch?v=ZMtf_ouMTHw",title:"Mr. Vain",by:"Culture Beat",year:1993,g:"viktor",kw:/Mr\.? Vain|Culture Beat/i},
 {id:"nolimit",url:"https://www.youtube.com/watch?v=r6FVk2k4qsM",title:"No Limit",by:"2 Unlimited",year:1993,g:"viktor",kw:/No Limit|2 Unlimited/i},
 {id:"thesign",url:"https://www.youtube.com/watch?v=iqu132vTl5Y",title:"The Sign",by:"Ace of Base",year:1993,g:"viktor",kw:/Ace of Base|The Sign/i},
 {id:"rhythm",url:"https://www.youtube.com/watch?v=JYIaWeVL1JM",title:"Rhythm Is a Dancer",by:"Snap!",year:1992,g:"viktor",kw:/Rhythm Is a Dancer|Snap!/i},
 {id:"scatman",url:"https://www.youtube.com/watch?v=Hy8kmNEo1i8",title:"Scatman",by:"Scatman John",year:1994,g:"viktor",kw:/Scatman/i},
 {id:"tehnologiya",url:"https://www.youtube.com/watch?v=0bshk2Ithlk",title:"Нажми на кнопку",by:"Технология",year:1991,g:"viktor",kw:/Технологи[яи]/},
 {id:"karmen",url:"https://www.youtube.com/watch?v=ylpNEb31k4U",title:"Лондон, гуд бай",by:"Кар-Мэн",year:1990,g:"viktor",kw:/Кар-Мэн/},
 {id:"agata",url:"https://www.youtube.com/watch?v=1fm1XCJAY0s",title:"Как на войне",by:"Агата Кристи",year:1993,g:"viktor",kw:/Агата Кристи/},
 /* N и то, что Viktor-1 показал ему из тех же лет */
 {id:"teardrop",url:"https://www.youtube.com/watch?v=u7K72X4eo_s",title:"Teardrop",by:"Massive Attack",year:1998,g:"n",kw:/Teardrop/i},
 {id:"bluelines",url:"https://www.youtube.com/watch?v=ZWmrfgj0MZI",title:"Unfinished Sympathy",by:"Massive Attack · Blue Lines",year:1991,g:"n",kw:/Blue Lines|Massive Attack/i},
 {id:"protection",url:"https://www.youtube.com/watch?v=Epgo8ixX6Wo",title:"Protection",by:"Massive Attack",year:1994,g:"n",kw:/Protection/},
 {id:"paradise",url:"https://www.youtube.com/watch?v=6hUkyKBsGtQ",title:"Paradise Circus",by:"Massive Attack",year:2010,g:"n",kw:/Paradise Circus/i},
 {id:"portishead",url:"https://www.youtube.com/watch?v=4qQyUi4zfDs",title:"Glory Box",by:"Portishead · Dummy",year:1994,g:"n",kw:/Portishead/i},
 {id:"aphex",url:"https://www.youtube.com/watch?v=uXpKC8TIAxE",title:"Xtal",by:"Aphex Twin · Selected Ambient Works 85–92",year:1992,g:"n",kw:/Aphex/i},
 {id:"sysoev",url:"https://www.youtube.com/watch?v=S3LxQVoiZ9w",title:"Не жди покоя в странствиях ночных",by:"Алексей Сысоев",year:"",g:"n",kw:/Сысоев/,year:2025},
 {id:"ligeti",url:"https://www.youtube.com/watch?v=EZ3svyRqNd4",title:"Poème symphonique для 100 метрономов",by:"Дьёрдь Лигети",year:1962,g:"n",kw:/метроном|Лигети/i},
 /* отец */
 {id:"trofimov",url:"https://www.youtube.com/watch?v=__trofimov__",title:"Мужчина и женщина",by:"Трофимов",year:"",g:"father",kw:/Трофимов/},
 {id:"elizarov",url:"https://www.youtube.com/watch?v=__elizarov__",title:"Любовь",by:"Елизаров",year:"",g:"father",kw:/Елизаров/},
 /* дочь */
 {id:"tank",url:"https://www.youtube.com/watch?v=bYEbdZ6_mp0",title:"Радио огонь",by:"Дайте танк (!)",year:"",g:"lina",kw:/танк на повторе|Дайте танк/i},
 /* фильмы */
 {id:"solaris",url:"https://www.youtube.com/watch?v=A-Wr3eyEoLo",title:"Солярис",by:"Андрей Тарковский",year:1972,g:"film",kw:/Солярис|Хари|Кельвин/},
 {id:"treeoflife",url:"https://www.youtube.com/watch?v=RrAz1YLh8nY",title:"Древо жизни",by:"Терренс Малик",year:2011,g:"film",kw:/Древо жизни|Малик/},
 {id:"jack",url:"https://www.youtube.com/watch?v=c6DuLPGZIoQ",title:"Дом, который построил Джек",by:"Ларс фон Триер",year:2018,g:"film",kw:/Дом, который построил Джек|Джек/},
 {id:"juliet",url:"https://www.youtube.com/watch?v=SN0eS2LEd_s",title:"Джульетта и духи",by:"Федерико Феллини",year:1965,g:"film",kw:/Джульетт/},
 {id:"dancer",url:"https://www.youtube.com/watch?v=53vr9EiOH7g",title:"Танцующая в темноте",by:"Ларс фон Триер",year:2000,g:"film",kw:/Танцующ/},
 {id:"synecdoche",url:"https://www.youtube.com/watch?v=i2q8F0yRmrs",title:"Синекдоха, Нью-Йорк",by:"Чарли Кауфман",year:2008,g:"film",kw:/Синекдох/}
];
const GROUPS=[
 {g:"viktor",title:"Девяностые Viktor",note:"Музыка, на которой он обучился: ему было от шести до одиннадцати лет. В финальном супермаркете она звучит гармонизированной."},
 {g:"n",title:"N и то, чего в его выборке не было",note:"Massive Attack — группа N. Её первые альбомы вышли в его детстве, просто его на них не обучали. Сысоев и метрономы Лигети — несовпадение, которое можно слушать."},
 {g:"father",title:"Отец",note:"Спор «Мужчины и женщины» с «Любовью» в последний майский вечер 2026 года."},
 {g:"lina",title:"Lina-Alexandra",note:"Источник идей, не цитат: тексты песен в книге не приводятся."},
 {g:"film",title:"Фильмы",note:"Три фильма движения мысли и те, что всплывают в переписке."}
];
const BY=Object.fromEntries(ITEMS.map(x=>[x.id,x]));
function parse(url){
  if(!url)return null;let m;
  if((m=url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/)))return {kind:"yt",id:m[1],embed:`https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0`,open:`https://www.youtube.com/watch?v=${m[1]}`};
  if((m=url.match(/vimeo\.com\/(\d+)/)))return {kind:"vimeo",id:m[1],embed:`https://player.vimeo.com/video/${m[1]}?autoplay=1`,open:url};
  if((m=url.match(/music\.yandex\.\w+\/album\/(\d+)\/track\/(\d+)/)))return {kind:"yandex",audio:true,embed:`https://music.yandex.ru/iframe/#track/${m[2]}/${m[1]}`,open:url};
  if((m=url.match(/open\.spotify\.com\/(track|album|playlist)\/(\w+)/)))return {kind:"spotify",audio:true,embed:`https://open.spotify.com/embed/${m[1]}/${m[2]}`,open:url};
  return {kind:"link",open:url};
}
function ready(x){return x&&x.url&&!/__\w+__/.test(x.url)}
function openUrl(x){if(ready(x))return parse(x.url).open;return "https://www.youtube.com/results?search_query="+encodeURIComponent(x.by+" "+x.title)}
/* в окне артефакта Claude сторонние плееры заблокированы — по умолчанию показываем ссылку */
const inArtifact=(()=>{try{const a=location.ancestorOrigins?[...location.ancestorOrigins].join(" "):"";return window.top!==window&&(/claude|anthropic/.test(a)||/claude|anthropic/.test(document.referrer)||!a)}catch(e){return true}})();
const store={get(){try{const v=localStorage.getItem("cv2_embed");return v==null?null:v==="1"}catch(e){return null}},set(v){try{localStorage.setItem("cv2_embed",v?"1":"0")}catch(e){}}};
let embed=store.get();if(embed==null)embed=!inArtifact;
function hue(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h%360}
function block(id,compact,book){
  const x=BY[id];if(!x)return "";const p=ready(x)?parse(x.url):null;const hh=hue(x.title);
  const refs=book?book.filter(e=>x.kw&&x.kw.test(e.seg.map(s=>s.t||"").join(" "))).map(e=>e.n):[];
  const canEmbed=embed&&p&&p.embed;
  return `<div class="media${p&&p.audio?" audio":""}" data-mid="${id}">
   <div class="frame16"><button type="button" class="poster" data-play="${id}" style="--mc1:hsl(${hh},30%,30%);--mc2:hsl(${(hh+40)%360},25%,8%)" aria-label="${canEmbed?"Смотреть":"Открыть на YouTube"}: ${x.by} — ${x.title}">
     <span class="pl">▶</span><span class="ttl">${x.title}<small>${x.by}${x.year?" · "+x.year:""}</small></span></button></div>
   <div class="cap"><span><b>${x.by}</b> — ${x.title}</span><a href="${openUrl(x)}" target="_blank" rel="noopener">${p?({yt:"YouTube",vimeo:"Vimeo",yandex:"Яндекс Музыка",spotify:"Spotify",link:"Ссылка"})[p.kind]:"Поиск на YouTube"} ↗</a>
   ${refs.length?`<span style="width:100%">Звучит в записях: ${refs.slice(0,8).map(n=>`<button type="button" class="chip" style="padding:0 7px;font-size:11.5px" data-open="${n}">${n}</button>`).join(" ")}</span>`:""}</div></div>`;
}
function wire(root){root.querySelectorAll("[data-play]").forEach(b=>{if(b._w)return;b._w=1;b.onclick=()=>{const x=BY[b.dataset.play];const p=ready(x)?parse(x.url):null;
  if(embed&&p&&p.embed){const f=b.parentElement;f.innerHTML=`<iframe src="${p.embed}" title="${x.by} — ${x.title}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`}
  else{const a=document.createElement("a");a.href=openUrl(x);a.target="_blank";a.rel="noopener";document.body.appendChild(a);a.click();a.remove()}}})}
function forText(t){return ITEMS.filter(x=>x.kw&&x.kw.test(t)).map(x=>x.id).slice(0,4)}
return {
  block,wire,forText,count:()=>ITEMS.length,items:()=>ITEMS.slice(),
  groups:()=>GROUPS.map(g=>({...g,items:ITEMS.filter(x=>x.g===g.g).map(x=>x.id)})),
  embedOn:()=>embed,setEmbed:v=>{embed=!!v;store.set(embed)},
  modeNote:()=>embed?"Плееры встраиваются прямо в страницу. Если блок остался пустым, площадка не пускает сторонние плееры — откройте ссылку под блоком.":"Здесь страница открыта внутри Claude, где сторонние плееры заблокированы, поэтому блоки открывают видео в новой вкладке. На собственном хостинге (например, GitHub Pages) включите «встраивать плееры» внизу — видео будут играть прямо в записи.",
  add:x=>{ITEMS.push(x);BY[x.id]=x}
};
})();

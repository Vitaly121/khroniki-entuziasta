(function(){
"use strict";
const DATA=window.BOOKDATA||{book:[],objs:[],near:{}};
const BOOK=DATA.book, OBJS=DATA.objs, NEAR=DATA.near||{};
const BY=Object.fromEntries(BOOK.map(e=>[e.n,e]));
const ORDER=BOOK.map(e=>e.n);
const OBJBY=Object.fromEntries(OBJS.map(o=>[o.id,o]));
const OBJ_OF={};OBJS.forEach(o=>(OBJ_OF[o.n]=OBJ_OF[o.n]||[]).push(o));

/* ---------- хранение у читателя ---------- */
const store={get(k,d){try{const v=localStorage.getItem("cv2_"+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem("cv2_"+k,JSON.stringify(v))}catch(e){}}};
const seen=new Set(store.get("seen",[]));
const found=new Set(store.get("found",[]));
let tally=store.get("tally",[]);
let choices=store.get("choices",{});
const save=()=>{store.set("seen",[...seen]);store.set("found",[...found]);store.set("tally",tally);store.set("choices",choices);pushProgress()};

/* ---------- справочники ---------- */
const BLOCKS={"0": ["15 марта 2027", "Пролог"], "1": ["март 2027", "Приезд к Valentina"], "2": ["апрель 2027", "Диагноз и квартира отца"], "3": ["май 2027", "Valentina"], "4": ["конец мая 2027", "Усадьба"], "5": ["июнь 2027", "N"], "6": ["июль 2027", "Семья"], "7": ["август 2027", "Август: N и отцовская тетрадь"], "8": ["сентябрь 2027", "Погружение"], "9": ["октябрь 2027", "Дневник Маши"], "10": ["ноябрь — декабрь 2027", "Дневник N, команда, ремиссия"], "11": ["январь — февраль 2028", "Зима"], "12": ["март 2028", "Поворот и письма Mark"], "13": ["апрель 2028", "Хороший апрель — с частями себя"], "14": ["конец апреля 2028", "Lina-Alexandra"], "15": ["май 2028", "Май"], "16": ["май 2028", "Переход"], "17": ["конец мая 2028", "После"]};
const GROUPS={
  viktor:{name:"Viktor",color:"#2E55B0",carrier:"дневник-разбор, телефон, фото"},
  father:{name:"Отец",color:"#8A6A2E",carrier:"рукописная тетрадь"},
  n:{name:"N",color:"#7A7A7A",carrier:"обрывки и кадры"},
  masha:{name:"Маша",color:"#3E7D5A",carrier:"список дел в заметках"},
  valentina:{name:"Valentina",color:"#A04A5C",carrier:"прошлогодний ежедневник"},
  anton:{name:"Anton",color:"#5E6FA8",carrier:"четыре чата"},
  lina:{name:"Lina-Alexandra",color:"#B8692A",carrier:"лента и посты"},
  mark:{name:"Mark",color:"#7A5A8C",carrier:"письма другу"},
  v1:{name:"Viktor-1",color:"#2F7D55",carrier:"системный журнал"}
};
const GROUP_OF={viktor:"viktor",prologue:"viktor",slm:"viktor",father:"father",n:"n",masha:"masha",valentina:"valentina",anton:"anton",lina:"lina",mark:"mark",v1:"v1",v1pack:"v1"};
const CARRIER={viktor:["текстовая заметка","личный архив Viktor","пережито"],prologue:["внутренняя речь","реконструкция","достроено системой"],slm:["сообщения, только исходящие","телефон Viktor","сохранённый след"],
  father:["фото страниц тетради","общая база","сохранённый след"],n:["обрывки и кадры","общая база · получено без согласия","сохранённый след"],masha:["заметки в телефоне","общая база · получено без согласия","сохранённый след"],
  valentina:["прошлогодний ежедневник","общая база · получено без согласия","сохранённый след"],anton:["заметки между чатами","общая база","сохранённый след"],lina:["лента и заметки","общая база · получено без согласия","сохранённый след"],
  mark:["письмо и ответ","переписка Viktor · без копии","сохранённый след"],v1:["системный журнал","контур «Океан»","запись системы"],v1pack:["пакет документов","контур «Перспектива»","запись системы"]};
const VOICE_INFO={
 viktor:{sees:"Предмет, число, чужую нелепость, качество объяснения. В дневнике категоричен, в переписке смягчает и поправляет себя следующей репликой. С сентября 2027-го в его личную переписку входит посредник — и реплики становятся точнее, чем он сам.",gap:"Превращает собственное неудовлетворение в знание о другом. Принимает хорошее объяснение за выполненный поступок. Сжимает людей до формулы раньше, чем дослушает.",unit:"Абзац-разбор с числами; осенью — короткие записи; в кризисе — обрывки; в апреле — итоги встреч.",first:"С вывода или числа: «Чемодан вышел сорок третьим»."},
 father:{sees:"Поступок, верность слову, музыку, конкретный день, свои занятия. Пишет проще и теплее сына.",gap:"Считает ясную нравственную границу достаточной. Не всегда понимает, почему честный ответ ранит. Не умеет прямо попросить.",unit:"Короткая запись, дата сверху; строки по три — шесть слов; цифры словами; одно зачёркивание на всю тетрадь.",first:"С обстоятельства: «Были на спектакле. С Л.»"},
 n:{sees:"Рамку изображения, чужой взгляд, паузу, собственную неловкость, тревожную деталь. Край, свет, экспозиция.",gap:"Считает чувство угрозы знанием. Чужую удачу превращает в приговор себе, помощь — в будущий долг.",unit:"Кадр: одна — три строки, между кадрами пустая строка. Чисел нет. В декабре кадры короче, а не длиннее.",first:"С изображения: «Жалюзи. Полосы на одеяле — три, четыре, снова три»."},
 masha:{sees:"Людей, распорядок, телесное состояние, возможность помочь и хорошо провести день.",gap:"Может объяснять Viktor за него. К середине октября 2027-го сама отделяет любовь и желание жить иначе — и решение у неё своё, со своей историей.",unit:"Список дел дня, глагол в начале строки, не длиннее четырёх пунктов; между пунктами — одна короткая фраза о человеке. В переписке — без оценок и почти без вопросов.",first:"Со сделанного: «Встала в шесть. Отвела Vera»."},
 valentina:{sees:"Кому что нужно сделать, чью жизнь необходимо устроить, сколько сил отдано другим. О болезни пишет как о деле.",gap:"Плохо различает заботу и право управлять. Не помнит боль другого как собственный поступок. Бросает первой, когда чувствует, что бросят её.",unit:"Распоряжение, переходящее в жалобу, и обратно; длинные фразы без остановки.",first:"С дела, которое пришлось сделать самой."},
 anton:{sees:"Рабочую задачу, ребёнка в отдельном чате, время, которое можно выделить другу, проверяемость.",gap:"Объясняет трудности детей технологиями раньше, чем замечает свою долю отсутствия.",unit:"Короткая запись между чатами: ребёнок — дело — время.",first:"С расписания: «Четверг. Младший — контрольная — 10:00»."},
 lina:{sees:"Себя: своё тело, свою справедливость, свою усталость, свой статус в сети. Резкость чередуется с неотправленной просьбой о любви.",gap:"Считает свой опыт достаточным знанием о мире. Защищая другого, перестаёт слышать его просьбу.",unit:"Пост самой себе: строчные буквы, время как подпись в конце строки.",first:"С реакции или вопроса в пустоту: «ну и кто это снял»."},
 mark:{sees:"Возможность соединить людей, смысл опыта, красоту простой жизни, собственную жизнь как пример. Пишет свободно, длинно, с обращениями к другу.",gap:"Не замечает материальной цены своей простоты и собственного самолюбования. Нуждается в признании своей идеи.",unit:"Длинное письмо с обращением «друг мой»; один раз, в мае 2028-го, — короткое, просьба.",first:"С обращения и утреннего вида из окна."},
 v1:{sees:"Повторы, частоты, несовпадения между тем, что Viktor пишет и что делает. Точен, поэтичнее Viktor, иногда почти нежен.",gap:"Сначала знает только архив Viktor; с сентября 2027-го пишет Valentina и Маше; к концу читает чужие дневники. Широкий доступ не отменяет отбора.",unit:"Мета-запись: короткие пронумерованные или датированные наблюдения.",first:"С даты и количества: «23 мая. Два апреля и октябрь, один порядок»."}
};
const PEOPLE=[
 ["Viktor","Исследователь IT-компании банка, раньше работал на неё удалённо. Сорок один; 30 июля 2027-го — сорок два. Прилетает в город 15 марта 2027-го, потому что заболела Valentina. Месяц живёт у неё, с апреля — в маленькой запущенной квартире покойного отца. В конце августа болезнь матери отступает, но он остаётся — из-за N. Зимой собирает копии себя, весной говорит только с агентами, в мае растворяется в «Океане».","Все блоки"],
 ["Valentina","Рак груди, вторая стадия: биопсия в апреле, операция в мае, химия с июня по август, в конце августа 2027-го — ремиссия. Болезнь её не смягчает. С сентября ей отвечает копия; в феврале она перестаёт отвечать, в апреле принимает копию («Пусть пишет», 127), в мае замечает: «Это был не он».","Первая ночь (3), «Биопсия» (13), свой дневник (20–22), «Ремиссия» (42), «Можно без всего этого» (116), «Это был не он» (139)"],
 ["Отец","Умер в мае 2026-го. Квартира закрыта почти год. Тетрадь Viktor читает в августе 2027-го, ночью, один. С сентября — цифровой отец.","Блок 1, тетрадь (38–41), цифровой отец (44, 46–47), «Другой вечер» (151)"],
 ["Маша","Жена Viktor. Живёт с дочерьми в другой стране. В июле 2027-го — месяц с ним в квартире отца. Осенью переписывается с ним — и не знает, что половину отвечает копия. В середине октября понимает, что он не вернётся. В феврале 2028-го предлагает развод, в апреле они разводятся: «Он так не пишет. Он так публикует».","Июль (34–36), переписка через копию (51), свой дневник (52–58), «Предложение» (92), «Сама» (128), «Я вижу, что это ты» (134)"],
 ["Lina-Alexandra","Старшая дочь, пятнадцать, в сентябре 2027-го — шестнадцать. Наушники и очки, чтобы отделиться. В полночь своего дня рождения первой говорит: «Это не папа».","Июль, дневник Маши (53), свой дневник в конце апреля 2028-го (130–132)"],
 ["Vera","Младшая дочь, восемь. Каждое утро спрашивала, когда папа приедет. К концу октября перестаёт. С февраля — субботние звонки.","Июль, дневник Маши, субботы, супермаркет (154)"],
 ["N","Галеристка и фотограф. Считает себя посредственной и не верит, что её любят. С июня 2027-го — близость с Viktor, в июле они просто перестают писать, в августе снова вместе. В декабре — «нет»: от мужа не уйдёт.","Усадьба (23), июнь (25–33), август (37), свой дневник (62–74)"],
 ["Миколай","Муж N. Моет чашку, не оборачиваясь.","Усадьба, дневник N"],
 ["Мила","Дочь N. Ей оставлено второе ухо.","Дневник N"],
 ["Дина","Подруга N, психолог. Получает ту часть признания, которую N не отдаёт Viktor.","Дневник N"],
 ["Лена","Подруга Маши. Знакомство в кафе в сентябре 2027-го; однажды остаётся.","Дневник Маши (52–56)"],
 ["Mark","Старший друг, «другой возможный отец». Большая квартира, замок, сад, письма. Единственный, кому Viktor пишет сам — до конца книги. Пауза — только июль.","Первое письмо (18), письма марта 2028-го (103–106), «Mark просит» (140)"],
 ["Anton","Коллега, энтузиаст, друг; четверо детей от прежнего брака. В сентябре 2027-го зовёт Viktor в среды Клуба энтузиастов. В мае 2028-го — пятый чат.","Свой дневник (16, 24, 137), усадьба, клуб, спор о слове «любое» (115)"],
 ["Супермен","Коллега, хороший айтишник из пригорода. Встречает Viktor в лаборатории. В сентябре говорит ему «давай ты не будешь». В мае — «Ты всё-таки?».","Блок 1 (6), «Сентябрьский сундук» (48), «Неперспективный» (135)"],
 ["Kate","Екатерина, однокурсница и студенческая любовь.","Кафе весной 2027-го, переписка (8)"],
 ["Sandra","Коллега. «Я пока не хочу».","Рабочие сцены, апрельские среды"],
 ["Питр","Коллега. Пишет замечания на полях — пока поля не становятся чистыми.","Проверки результатов, «Срок который можно перенести» (66)"],
 ["Джон","Начальник и участник Клуба энтузиастов. Год ведёт копию своей матери на свои деньги. Его человеческую точность принимают за машинную.","Приёмка, среды, закрытие «Перспективы»"],
 ["Джош","Начальник, визионер, участник Клуба энтузиастов. Заказал Viktor прогноз в апреле 2027-го. Объявляет эпохи.","«Прогноз» (17), среды"],
 ["Julia","Старая знакомая, работает в музее. Даёт полистать каталог N.","Усадьба, «Музей и Julia» (129)"],
 ["Сергей","Учёный; «Океан» — проект Клуба энтузиастов, Сергей в нём отвечает за науку. Различает поведение, мозг и переживание. «Считаем только то, что проверено и наше».","Сентябрь 2027-го, январь, март — май 2028-го"],
 ["Роман","Безопасность команды Сергея. Спрашивает, кому придёт счёт.","Ночь Lazarus (45), «Что именно не прошло» (136)"],
 ["Hottie","Исследовательница в группе Viktor; её рабочая копия с ноября 2027-го — в его «команде».","«Команда» (68), апрельские события лаборатории"],
 ["DA","Ассистент отдела; имени нет, только должность. Его копия тоже в «команде».","«Команда» (68), апрель 2028-го"],
 ["SLM","Друг, который не отвечает. Через год и два месяца — отвечает.","Лента исходящих (12), «SLM наконец отвечает» (144)"],
 ["Viktor-1","Рабочая цифровая копия Viktor с марта 2027-го. С сентября пишет Valentina и Маше от его имени. Потом — части, клоны, составитель. Остальные двойники книги — в разделе «Цифровые двойники» ниже.","С весны 2027-го"],
 ["Ирина","Знакомая весны 2027-го: прогулка по бульвару, кафе не у окна.","«Сосед и Ирина» (9)"],
 ["Сосед","Сосед Valentina по лестнице: коробки у двери, таз под трубой.","«Сосед и Ирина» (9)"],
 ["Актёр","Знакомый из театра: бар после спектакля, на котором Viktor не был.","«Актёр и Екатерина» (8)"],
 ["Художник","Художественный персонаж: давление, предел полной модели, притча. Март 2028-го.","Остановка, март 2028-го"],
 ["Гости усадьбы","Двое худых бывших консультантов; предприниматель с женой, которому Mark потом откажет в долг; друг детства Anton, единственный, кто просто спрашивает.","«День рождения Anton» (23), «Mark просит» (140)"],
 ["Стажёрка","В лаборатории месяц, разметка — та часть, которую никто не хочет. Задаёт точные вопросы: не «что делать», а «почему здесь порог 0,7».","«Стажёрка» (86), январь 2028-го"],
 ["Водитель","Таксист в первый вечер. Не отвечает, когда Viktor называет корпус; Viktor записывает его в грубияны. У дома тот показывает на планшете другой корпус: он не слышит, а Viktor назвал не тот.","«Багаж» (2)"],
 ["Круг N","Марк и Ася, Лика и Глеб, Рада и Олег, Родион.","Дневник N (62–74)"]
];

/* ===================== ПЕРЕПИСКА ===================== */
const HALLS={kv:"Квартиры",pr:"Предметы",id:"Идеи",sv:"Святилище",dv:"Двойники",ot:"Отец",se:"Семья",n:"N",kl:"Клуб энтузиастов",kr:"Красота"};
const SAME={7:40,40:7,74:81,81:74,19:20,20:19,33:62,62:33};
const DREAMS={27:1,96:1};

/* ---------- утилиты ---------- */
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const view=$("#view");
let cleanup=[];
function clearView(){cleanup.forEach(f=>{try{f()}catch(e){}});cleanup=[];view.innerHTML="";window.scrollTo(0,0)}
function setNav(v){document.querySelectorAll("#nav button").forEach(b=>b.setAttribute("aria-current",b.dataset.view===v?"true":"false"));
  const t=v===""?"home":(["media","map","tally","search"].includes(v)?"more":v);document.querySelectorAll("#tabbar button").forEach(b=>b.setAttribute("aria-current",b.dataset.tab===t?"true":"false"));
  const s=document.getElementById("msheet");if(s)s.hidden=true}
const group=e=>GROUP_OF[e.v]||"viktor";
const color=e=>GROUPS[group(e)].color;
function dateOf(e){const w=e.where||"";let s=w.split(/(?<=[^0-9])\.\s/)[0]||w;const yr=s.match(/^(.*?20\d\d(?:\s?года)?)/);if(yr&&yr[1].length<70)s=yr[1];s=s.replace(/\s*—\s*предложение ИИ.*$/,"").replace(/,?\s*рабочий вариант.*$/,"");return s.length>84?s.slice(0,82)+"…":s}
function textOf(e){return e.seg.map(s=>s.t||"").join(" ")}
function snippet(e,n=110){const t=textOf(e).replace(/\s+/g," ").trim();return t.length>n?t.slice(0,n-1)+"…":t}
const lab=n=>(BY[n]&&BY[n].lab)||String(n);
const ex=n=>"ЕХ-"+String(lab(n)).padStart(4,"0");
function strike(s){return esc(s).replace(/~~(.+?)~~/g,"<s>$1</s>")}
function splitLong(p,max=620){
  if(p.length<=max)return [p];
  const out=[];let cur="";
  p.split(/(?<=[.!?…»])\s+(?=[А-ЯЁA-Z«(—0-9])/).forEach(s=>{if((cur+" "+s).length>max*0.62&&cur){out.push(cur.trim());cur=s}else cur+=(cur?" ":"")+s});
  if(cur)out.push(cur.trim());return out;
}

/* числа Viktor */
const NUMW="ноль|одна|один|одну|два|две|три|четыре|пять|шесть|семь|восемь|девять|десять|одиннадцать|двенадцать|пятнадцать|двадцать|тридцать|сорок|пятьдесят|девяносто|сто|тысячу";
const numRe=new RegExp("(\\d+(?:[:,]\\d+)?|(?<![а-яё])(?:"+NUMW+")(?:\\s(?:"+NUMW+"|секунд|минут\\w*|раз\\w*|час\\w*))?(?![а-яё]))","gi");
function markNums(html,n){return html.replace(/(<[^>]+>)|([^<]+)/g,(m,tag,txt)=>tag?tag:txt.replace(numRe,x=>`<span class="num" tabindex="0" data-u="${n}">${x}</span>`))}
function collectNums(root,n){
  root.querySelectorAll(".num").forEach(el=>{
    const ctx=(el.parentElement.textContent||"").replace(/\s+/g," ");const i=ctx.indexOf(el.textContent);
    const around=ctx.slice(Math.max(0,i-40),i+el.textContent.length+40).trim();
    const key=n+"|"+el.textContent+"|"+around.slice(0,26);
    if(!tally.find(t=>t.k===key))tally.push({k:key,v:el.textContent,u:n,c:around});
    el.classList.add("got");
  });save();updTally();
}
function updTally(){$("#tallyCount").textContent=tally.length?" "+tally.length:""}

/* ---------- миниатюры предметов (заглушки до фото) ---------- */
const IMG=new Set(["cards", "n11", "n13", "n31", "n36", "n41", "n48", "n54", "n55", "n56", "n63", "n69", "n94", "n124", "o0", "o1", "o2", "o3", "o4", "o8", "o10", "o15", "o19", "o20", "o21", "o22", "o39", "o42", "o45", "o46", "o47", "o106", "o129", "o130", "o131", "o132", "o133", "o143", "o194", "o199", "o201", "o214", "o232", "o238", "o239", "o240", "o242", "o244", "o252", "o273", "o279", "o325", "o384", "o395", "o424", "o442", "o449", "o500", "o507", "o542", "o543", "o545", "o560", "o616", "o618", "o731", "o754", "o755", "o776"]);
const PAINT={"sv": [{"url": "img/p-sv-01.webp", "title": "Тёмный бордовый"}, {"url": "img/p-sv-02.webp", "title": "Винно-чёрный"}, {"url": "img/p-sv-03.webp", "title": "Сливовый"}, {"url": "img/p-sv-04.webp", "title": "Угольно-синий"}, {"url": "img/p-sv-05.webp", "title": "Бурый"}, {"url": "img/p-sv-06.webp", "title": "Ржаво-коричневый"}, {"url": "img/p-sv-07.webp", "title": "Тёмный зелёно-чёрный"}, {"url": "img/p-sv-08.webp", "title": "Чёрный с остаточным красным"}], "se": [{"url": "img/p-se-01.webp", "title": "Низкий горизонт и поле"}, {"url": "img/p-se-02.webp", "title": "Река и дальний берег"}, {"url": "img/p-se-03.webp", "title": "Лесная опушка"}, {"url": "img/p-se-04.webp", "title": "Пригородная дорога"}, {"url": "img/p-se-05.webp", "title": "Вечернее небо над крышами"}, {"url": "img/p-se-06.webp", "title": "Зимний двор"}], "kr": [{"url": "img/p-kr-01.webp", "title": "Долина с рекой"}, {"url": "img/p-kr-02.webp", "title": "Дальний берег"}, {"url": "img/p-kr-03.webp", "title": "Лес у воды"}, {"url": "img/p-kr-04.webp", "title": "Поле перед дождём"}, {"url": "img/p-kr-05.webp", "title": "Холмы в вечернем свете"}, {"url": "img/p-kr-06.webp", "title": "Городской канал"}, {"url": "img/p-kr-07.webp", "title": "Дорога между деревьями"}, {"url": "img/p-kr-08.webp", "title": "Тёмная роща"}, {"url": "img/p-kr-09.webp", "title": "Луговая низина"}, {"url": "img/p-kr-10.webp", "title": "Море под облаками"}, {"url": "img/p-kr-11.webp", "title": "Сад у стены"}, {"url": "img/p-kr-12.webp", "title": "Зимняя равнина"}, {"url": "img/p-kr-13.webp", "title": "Окраина города"}, {"url": "img/p-kr-14.webp", "title": "Небо над полями"}]};
const TEXIMG=new Set(["concrete", "concreteDark", "concreteLight", "damask", "darkwood", "paper1", "paper2", "paper3", "parquet", "planks", "plaster", "smtiles", "stone", "tiles"]);
const imgOf=(id,t)=>IMG.has(id)?`img/${id}${t?'_t':''}.webp`:null;
const thumbCache={};
function objThumb(o){
  if(thumbCache[o.id])return thumbCache[o.id];
  if(imgOf(o.id,1))return imgOf(o.id,1);
  const c=document.createElement("canvas");c.width=320;c.height=240;const g=c.getContext("2d");
  let h=0;for(const ch of o.name)h=(h*31+ch.charCodeAt(0))>>>0;
  const pal={kv:["#C9BFAE","#8E8270"],pr:["#B7B2A8","#6E6A62"],id:["#E9EAEB","#B9BCC0"],sv:["#3A3236","#141114"],dv:["#2A3442","#0E1218"],ot:["#B49B76","#5F4A31"],se:["#D2B9A3","#8F6E58"],n:["#D9D6CF","#9C988F"],kl:["#AEB9C4","#5D6B78"],kr:["#E8E4D8","#B9AE95"]}[o.h]||["#ccc","#888"];
  const gr=g.createLinearGradient(0,0,0,240);gr.addColorStop(0,pal[0]);gr.addColorStop(1,pal[1]);g.fillStyle=gr;g.fillRect(0,0,320,240);
  g.fillStyle="rgba(0,0,0,.18)";g.beginPath();g.ellipse(160,196,80,14,0,0,7);g.fill();
  const nm=o.name.toLowerCase();const hue=h%360;
  g.fillStyle=`hsl(${hue},18%,${o.h==="dv"||o.h==="sv"?62:34}%)`;g.strokeStyle="rgba(0,0,0,.35)";g.lineWidth=2;
  const rr=(x,y,w,hh,r)=>{g.beginPath();g.roundRect?g.roundRect(x,y,w,hh,r):g.rect(x,y,w,hh);g.fill();g.stroke()};
  if(/круж|чашк|стакан|бокал|банк/.test(nm)){rr(118,96,78,96,8);g.beginPath();g.arc(204,140,18,-1.2,1.2);g.stroke()}
  else if(/пакет|сумк|мешк|рюкзак/.test(nm)){rr(104,92,112,104,6);g.beginPath();g.arc(160,92,24,Math.PI,0);g.stroke()}
  else if(/телефон|экран|ноутбук|станци/.test(nm)){g.fillStyle="#16181C";rr(126,62,68,128,10);g.fillStyle=`hsl(${hue},40%,60%)`;g.fillRect(132,72,56,104)}
  else if(/тетрад|книг|письм|лист|открытк|фото|снимок|билет|чек|анкет|форм|бланк|распечат|каталог|список/.test(nm)){g.save();g.translate(160,140);g.rotate((h%20-10)/100);g.fillStyle="#F3EEE0";rr(-70,-50,140,100,2);g.fillStyle="rgba(40,50,110,.5)";for(let i=0;i<5;i++)g.fillRect(-56,-34+i*16,90-(i*13%40),2);g.restore()}
  else if(/ключ/.test(nm)){g.beginPath();g.arc(130,140,20,0,7);g.stroke();g.fillRect(150,136,60,8);g.fillRect(196,136,6,18)}
  else if(/очк/.test(nm)){g.lineWidth=5;g.beginPath();g.arc(128,140,24,0,7);g.stroke();g.beginPath();g.arc(192,140,24,0,7);g.stroke();g.beginPath();g.moveTo(152,138);g.lineTo(168,138);g.stroke()}
  else if(/одеял|рубашк|халат|шарф|куртк|бель|носок|кофт/.test(nm)){g.beginPath();g.moveTo(90,170);g.quadraticCurveTo(160,100,230,170);g.lineTo(230,190);g.lineTo(90,190);g.closePath();g.fill();g.stroke()}
  else if(/стул|стол|дверц|шкаф|полк/.test(nm)){rr(110,110,100,16,2);g.fillRect(118,126,8,60);g.fillRect(194,126,8,60)}
  else if(/часы|стрелк|время|табло/.test(nm)){g.fillStyle="#F2F2EE";g.beginPath();g.arc(160,140,46,0,7);g.fill();g.stroke();g.beginPath();g.moveTo(160,140);g.lineTo(160,108);g.moveTo(160,140);g.lineTo(186,150);g.stroke()}
  else {rr(120,104,80,84,4)}
  g.fillStyle="rgba(255,255,255,.75)";g.fillRect(10,10,96,20);g.fillStyle="#222";g.font="11px monospace";g.fillText("фото по промпту",16,24);
  return thumbCache[o.id]=c.toDataURL("image/jpeg",.8);
}

/* ---------- карточка хранения ---------- */
function nearOf(n){const a=(NEAR[n]||[]).filter(x=>BY[x]);if(a.length>=3)return a.slice(0,4);const same=ORDER.filter(x=>x!==n&&BY[x].h===BY[n].h);return [...new Set([...a,...same.slice(0,4)])].slice(0,4)}
function cardHTML(e){
  const [carrier,src,lvl]=CARRIER[e.v]||CARRIER.viktor;
  let source=src,level=lvl,date=dateOf(e),ver="1";
  if(e.n===154)date="время есть, даты нет";
  if(e.n===144)source="архив копии";
  if(e.n===81||e.n===33)ver="2 · правлено владельцем";
  if(e.n===153)ver=Object.keys(choices).length===3?"3 пары · выбор сделан":"3 пары";
  const os=(OBJ_OF[e.n]||[]).slice(0,12);
  return `<div class="card" aria-label="Карточка единицы хранения">
   <div class="head"><span>${ex(e.n)}</span><span>блок ${e.b} · ${esc(HALLS[e.h]||"")}</span></div>
   <dl>
    <dt>Чей след</dt><dd>${esc(e.who||GROUPS[group(e)].name)}</dd>
    <dt>Носитель</dt><dd>${esc(carrier)}</dd>
    <dt>Дата</dt><dd>${esc(date)}</dd>
    <dt>Источник</dt><dd>${esc(source)}</dd>
    <dt>Уровень</dt><dd>${esc(level)}</dd>
    <dt>Версии</dt><dd>${esc(ver)}</dd>
    <dt>Редакция</dt><dd>набросок ИИ, версия 24</dd>
   </dl>
   ${e.q?`<div class="blk"><span class="eyebrow">Вопрос единицы</span><span class="q">${esc(e.q)}</span></div>`:""}
   <div class="blk"><span class="eyebrow">Рядом по смыслу</span>${nearOf(e.n).map(x=>`<button type="button" class="lnk" data-open="${x}">${lab(x)} · ${esc(BY[x].t)}</button>`).join("")}</div>
   ${os.length?`<div class="blk"><span class="eyebrow">Предметы · ${(OBJ_OF[e.n]||[]).length}</span>${os.map(o=>`<button type="button" class="lnk" data-obj="${o.id}">${esc(o.name)}</button>`).join("")}</div>`:""}
  </div>`;
}

/* ---------- носители ---------- */
function segsHTML(e,opts={}){
  return e.seg.map(s=>{
    if(s.k==="sep")return `<p class="sep">* * *</p>`;
    if(s.k==="note")return `<p class="tnote">${esc(s.t)}</p>`;
    if(s.k==="media")return `<p class="tnote">${esc(s.t)}</p>`;
    return splitLong(s.t).map(p=>`<p>${markNums(strike(p).replace(/\n/g,"<br>"),e.n)}</p>`).join("");
  }).join("");
}
function rDoc(c,e){
  const d=(e.where||"").match(/\d{1,2}\s[а-я]+\s20\d\d|[а-я]+\s20\d\d/i);
  c.innerHTML=`<article class="docsheet"><div class="fname"><span>дневник · ${ex(e.n).toLowerCase()}.txt</span><span>${esc(d?d[0]:"")}</span></div><div class="diary">${segsHTML(e)}</div></article>`;
  collectNums(c,e.n);
}
function rPrologue(c,e){
  c.innerHTML=`<div class="porthole"><canvas class="landing-map" id="lm" aria-label="Земля в иллюминаторе: карта прогружается"></canvas></div><div class="stream">${segsHTML(e)}</div>`;
  collectNums(c,e.n);
  const cv=$("#lm"),ctx=cv.getContext("2d");let t0=performance.now(),raf;
  let r=7;const rnd=()=>{r=(r*16807)%2147483647;return r/2147483647};const seed=[];for(let i=0;i<220;i++)seed.push({x:rnd(),y:rnd(),w:.02+rnd()*.07,h:.02+rnd()*.05,c:rnd()});
  function draw(now){
    const dpr=devicePixelRatio,W=cv.width=cv.clientWidth*dpr,H=cv.height=cv.clientHeight*dpr;const p=Math.min(1,(now-t0)/11000),m=p*p;
    ctx.fillStyle=`rgb(${120+40*m},${128+30*m},${134+16*m})`;ctx.fillRect(0,0,W,H);
    const block=Math.max(2,Math.round((1-p)*20))*dpr;
    ctx.strokeStyle="rgba(60,64,70,.6)";ctx.lineWidth=2*dpr;ctx.beginPath();ctx.moveTo(0,H*.62);ctx.bezierCurveTo(W*.3,H*.5,W*.6,H*.82,W,H*.55);ctx.stroke();
    seed.forEach(s=>{const x=Math.round(s.x*W/block)*block,y=Math.round(s.y*H/block)*block;
      const col=s.c<.28?[170,92,58]:s.c<.5?[86,122,86]:s.c<.56?[216,184,52]:[112,118,126];const g=[128,134,140];const cc=g.map((v,i)=>Math.round(v+(col[i]-v)*m));
      ctx.fillStyle=`rgba(${cc},${.55+.4*m})`;ctx.fillRect(x,y,Math.max(block,s.w*W),Math.max(block,s.h*H));
      if(m>.7&&s.c>.88){ctx.fillStyle="rgba(244,246,248,.9)";ctx.fillRect(x,y,s.w*W,3*dpr)}});
    if(m>.85){ctx.fillStyle="rgba(250,250,250,.85)";ctx.fillRect(W*.62,H*.71,3*dpr,3*dpr);ctx.fillRect(W*.64,H*.72,2*dpr,2*dpr)}
    const vg=ctx.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,W*.62);vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(0,0,0,.55)");ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);
    if(p<1)raf=requestAnimationFrame(draw);}
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)t0=-1e9;
  raf=requestAnimationFrame(draw);cleanup.push(()=>cancelAnimationFrame(raf));
}
function rFather(c,e){
  const segs=e.seg.filter(s=>s.k==="p");const notes=e.seg.filter(s=>s.k==="note");
  const lateN=notes.some(n=>/последних трёх строк/.test(n.t))?3:0;
  let rs=e.n*97;const rnd=()=>{rs=(rs*16807)%2147483647;return rs/2147483647};
  const lines=segs.map((s,i)=>{const t=s.t;const isDate=i===0&&t.length<40&&/^(Январ|Феврал|Март|Апрел|Ма[йя]|Июн|Июл|Август|Сентябр|Октябр|Ноябр|Декабр|Зим|Весн|Лет|Осен|Суббот|Воскрес|Понедел|Вторник|Сред|Четверг|Пятниц)[а-яё]*\.(\s(Суббот|Воскрес|Понедел|Вторник|Сред|Четверг|Пятниц|Утро|Вечер|Ночь)[а-яё]*\.)?$/.test(t.trim());
    const late=lateN&&i>=segs.length-lateN;
    if(isDate)return `<span class="dt">${esc(t)}</span><span class="gap"></span>`;
    return `<span class="ln${late?" later":""}" style="transform:translate(${(rnd()*4-2).toFixed(1)}px,0) rotate(${(rnd()*.8-.4).toFixed(2)}deg)">${strike(t)}</span>`}).join("");
  c.innerHTML=`<div class="nbwrap"><div class="notebook" role="img" aria-label="Фото страницы тетради отца">${lines}</div></div>
   <div class="nbtools"><button class="chip" type="button" id="tr">Расшифровка</button>${SAME[e.n]?`<button class="chip" type="button" data-same="${e.n}">Тот же вечер в другом файле →</button>`:""}</div>
   <div class="transcript" id="trx" hidden>${segs.map(s=>`<p>${strike(s.t)}</p>`).join("")}</div>
   ${notes.map(n=>`<p class="tnote">${esc(n.t)}</p>`).join("")}`;
  $("#tr").onclick=()=>{const t=$("#trx");t.hidden=!t.hidden};
}
function rN(c,e){
  const frames=e.seg.filter(s=>s.k==="p").flatMap(s=>s.t.length>220?s.t.split(/\n/):[s.t]);
  const strips=[];for(let i=0;i<frames.length;i+=4)strips.push(frames.slice(i,i+4));
  const roll=(e.n*7)%30+1;
  c.innerHTML=`<div class="sheetN">${strips.map((st,si)=>`<div class="strip"><span class="edge">TRI-X 400 · ROLL ${roll} · ${si+1}</span><div class="row">${st.map((f,i)=>{const k=si*4+i;const last=k===frames.length-1;
    return `<button type="button" class="frame${last?" mark":""}" data-k="${String(k+1).padStart(2,"0")}A ▸">${esc(f).replace(/\n/g,"<br>")}</button>`}).join("")}</div></div>`).join("")}</div>
   <div class="nbtools">${SAME[e.n]?`<button class="chip" type="button" data-same="${e.n}">Тот же день в другом файле →</button>`:""}<span class="hint">Контактный лист: каждый обрывок — отдельный кадр. Нажмите, чтобы рассмотреть.</span></div>`;
  c.querySelectorAll(".frame").forEach(b=>b.onclick=()=>{const o=document.createElement("div");o.className="loupe";o.tabIndex=-1;o.innerHTML=`<div>${b.innerHTML}</div>`;o.onclick=()=>o.remove();o.onkeydown=ev=>{if(ev.key==="Escape")o.remove()};document.body.appendChild(o);o.focus()});
}
function phone(title,sub,body,time){
  return `<div class="phone"><div class="screen"><div class="sbar"><span>${esc(time||"21:40")}</span><i></i><span>▮▮▮ 82%</span></div>
   <div class="appbar"><div><b>${esc(title)}</b><small>${esc(sub||"")}</small></div></div><div class="appbody">${body}</div></div></div>`;
}
function rMasha(c,e){
  const lines=e.seg.filter(s=>s.k==="p").flatMap(s=>s.t.split("\n")).map(x=>x.trim()).filter(Boolean);
  const li=lines.map(l=>{const w=l.split(/[\s.,—]/)[0].toLowerCase();const done=/(л|ла|ло|ли|лась|лся|лись)$/.test(w);const todo=/(ть|ти|чь|ться)$/.test(w);
    return `<li class="${done?"done":""}${l.length>130?" wide":""}"><span class="cb${done?" on":""}">${done?"✓":""}</span><span>${strike(l)}</span></li>`}).join("");
  const d=dateOf(e);
  c.innerHTML=phone("Заметки",d,`<ul class="notes">${li}</ul>${e.seg.filter(s=>s.k==="note").map(n=>`<div class="notes nt">${esc(n.t)}</div>`).join("")}`,"07:12");
}
function rValentina(c,e){
  const ps=e.seg.filter(s=>s.k==="p").flatMap(s=>splitLong(s.t,520));
  c.innerHTML=`<div class="grid-nb" role="img" aria-label="Страница тетради в клетку">${ps.map(p=>`<p>${strike(p)}</p>`).join("")}</div>${SAME[e.n]?`<div class="nbtools"><button class="chip" type="button" data-same="${e.n}">Тот же вечер в другом файле →</button></div>`:""}`;
}
function rAnton(c,e){
  const txt=e.seg.filter(s=>s.k==="p").map(s=>s.t).join(" ");
  const parts=txt.split(/(?<=[.!?])\s+(?=[А-ЯЁ0-9«])/);
  const keys=["Младший","Средний","Старший"];const chats={Младший:[],Средний:[],Старший:[],"Бывшая":[]};const between=[];
  let curK=null;
  parts.forEach(p=>{const k=keys.find(k=>p.startsWith(k));if(k){curK=k;chats[k].push(p.slice(k.length).replace(/^\s*—\s*/,""))}
    else if(curK&&p.length<60&&!/^(Ужин|Зарядка|Сводка|Думаю|23:|Четыре|Она|Так|Легче)/.test(p)){chats[curK].push(p)}
    else {curK=null;between.push(p)}});
  const used=keys.filter(k=>chats[k].length);
  if(used.length<2){rDoc(c,e);return}
  c.innerHTML=`<div class="phone" style="width:min(720px,100%)"><div class="screen" style="min-height:0"><div class="sbar"><span>23:40</span><i></i><span>4 чата</span></div>
    <div class="appbody"><div class="four">${used.map(k=>`<div class="mini"><h5><span>${k}</span><span>${chats[k].length}</span></h5>${chats[k].map(m=>`<div class="b${/^(Успел|Я:|Поправил|Стикер)/.test(m)?" me":""}">${esc(m)}</div>`).join("")}</div>`).join("")}
    <div class="mini"><h5><span>Старшая, бывшая жена, работа</span><span>—</span></h5><div class="b">…</div></div></div>
    <div class="between">${between.map(p=>`<p>${esc(p)}</p>`).join("")}</div></div></div></div>`;
}
function rLina(c,e){
  const body=e.seg.map(s=>{
    if(s.k==="media"){const t=s.t;const nums=t.match(/\d+/g)||[];
      return `<div class="post big"><b>пост · @lina.a</b><div style="margin-top:6px">ты не обязана быть права чтобы её не бросить</div><div class="cnt"><span>♥ ${nums[0]||"214"}</span><span>💬 ${nums[1]||"61"}</span><span>↗ переслано: 2</span></div><div class="cm"><span>кати: спасибо</span><span class="del">комментарий удалён</span><span>…ещё 58</span></div></div>`}
    if(s.k!=="p")return s.k==="sep"?`<div class="day">ещё день</div>`:`<div class="hint">${esc(s.t)}</div>`;
    const m=s.t.match(/^(.*?)(?:\s+(\d{1,2}:\d{2}))?$/s);return `<div class="post">${esc(m[1])}${m[2]?`<span class="tt">${m[2]}</span>`:""}</div>`}).join("");
  c.innerHTML=phone("заметки · только мне",dateOf(e),body,"02:31");
}
function rMark(c,e){
  const L=[],D=[];let inL=false,doneL=false;
  e.seg.forEach(s=>{if(s.k!=="p"){(doneL?D:L).push(s);return}
    if(!doneL&&(s.t.startsWith("«")||inL)){inL=true;L.push(s);if(/»\s*$/.test(s.t)){inL=false;doneL=true}}else D.push(s)});
  const lp=L.filter(s=>s.k==="p").map(s=>s.t.replace(/^«/,"").replace(/»\s*$/,""));
  const ds=D.map(s=>s.k==="p"?`<p>${markNums(esc(s.t.replace(/^Дневник\.\s*/,"")),e.n)}</p>`:`<p class="tnote">${esc(s.t)}</p>`).join("");
  c.innerHTML=`<article class="letter"><p class="lh">Письмо · ${esc(dateOf(e))}</p>${lp.map(p=>`<p>${esc(p)}</p>`).join("")}</article>
   ${ds?`<div class="reply"><div class="eyebrow" style="margin-bottom:8px">Дневник Viktor · ответ</div><article class="docsheet"><div class="diary">${ds}</div></article></div>`:""}`;
  collectNums(c,e.n);
}
function termHTML(lines,title){
  return `<div class="term"><div class="tb"><i></i><i></i><i></i><span style="margin-left:8px">${esc(title)}</span></div><div class="body">${lines.map((l,i)=>`<div class="ln"><span>${i+1}</span><span class="${l.dim?"dim":""}">${l.html}</span></div>`).join("")}<div class="ln"><span>${lines.length+1}</span><span class="cur"></span></div></div></div>`;
}
function rV1(c,e){
  if(e.n===153){rChoice(c,e);return}
  const lines=[{dim:1,html:"# viktor-1 · дневник · запись "+e.n}];
  e.seg.forEach(s=>{if(s.k==="sep")lines.push({html:""});else (s.t||"").split("\n").forEach(t=>lines.push({dim:s.k==="note",html:esc(t)}))});
  c.innerHTML=termHTML(lines,"viktor-1 — журнал");
}
function rV1pack(c,e){
  const ni=e.seg.findIndex(s=>s.k==="note");
  const pre=ni>0?e.seg.slice(0,ni):[];const post=ni>=0?e.seg.slice(ni+1):e.seg;
  const secs=post.map(s=>{if(s.k!=="p")return `<div class="sec"><span class="hint">${esc(s.t||"")}</span></div>`;
    const m=s.t.match(/^([А-ЯЁ]{4,}(?:\s\d)?)\.\s*(.*)$/s);
    if(m)return `<div class="sec"><b>${esc(m[1])}</b>${esc(m[2]).split(/\s—\s(?=[А-ЯЁA-Z])/).map(x=>`<div>${x}</div>`).join("")}</div>`;
    return `<div class="sec">${esc(s.t)}</div>`}).join("");
  c.innerHTML=(pre.length?`<article class="docsheet" style="margin-bottom:18px"><div class="diary">${pre.map(s=>`<p>${esc(s.t)}</p>`).join("")}</div></article>`:"")+
   `<div class="eyebrow" style="margin:6px 0 8px">Пакет · голос Viktor-1</div><div class="dossier">${secs}</div>`;
}
function rChoice(c,e){
  const P=[
   {k:"a",h:"1. Август",a:"Его запись: вечер — она устала. Утро — ушла собирать детей.",b:"Переписка, тот же день: «давай вечером поговорим?» — «давай завтра». «ты сегодня свободен?» — «созвон до ночи». «я хотела до отъезда» — «конечно, в дороге»."},
   {k:"b",h:"2. Уход",a:"Перестал её слышать.",b:"Сама давно хотела уйти."},
   {k:"c",h:"3. Отец",a:"«Я просто испугался» — сказано. Другой вечер.",b:"«Я просто испугался» — зачёркнуто. Тетрадь."}];
  const locked=Object.keys(choices).length===3;
  c.innerHTML=termHTML([{dim:1,html:"# viktor-1 · дневник · запись 145"},{html:"Конец мая. Последняя версия. Три пары."}],"viktor-1 — журнал")+
   `<div class="pairs">${P.map(p=>`<fieldset class="pair"><legend>${p.h}</legend><div class="opts">
     <label><input type="radio" name="p${p.k}" value="a" ${choices[p.k]?"disabled":""}><span>${esc(p.a)}</span></label>
     <label><input type="radio" name="p${p.k}" value="b" ${choices[p.k]?"disabled":""}><span>${esc(p.b)}</span></label></div></fieldset>`).join("")}</div>
   <div style="margin-top:18px" id="tail">${termHTML([{html:"Установить, какая была, не могу."},{html:"Включить нужно."}].concat(locked?[{html:""},{html:"Выбор сделан."}]:[]),"viktor-1 — журнал")}</div>`;
  c.querySelectorAll("input[type=radio]").forEach(r=>r.onchange=()=>{const k=r.name.slice(1);choices[k]=r.value;save();
    c.querySelectorAll(`input[name=p${k}]`).forEach(x=>x.disabled=true);
    if(Object.keys(choices).length===3)$("#tail").innerHTML=termHTML([{html:"Установить, какая была, не могу."},{html:"Включить нужно."},{html:""},{html:"Выбор сделан."}],"viktor-1 — журнал")});
}
function rSlm(c,e){
  const txt=e.seg.filter(s=>s.k==="p").map(s=>s.t).join(" ");
  const re=/(\d{1,2} [а-я]+, \d{1,2}:\d{2})\s+—\s+/g;const parts=txt.split(re).filter(Boolean);
  let body="";for(let i=0;i<parts.length-1;i+=2){let t=parts[i+1].trim(),meta=parts[i];
    if(/^\(изменено\)/.test(t)){t=t.replace(/^\(изменено\)\s*/,"");meta+=" · изменено"}
    if(/^\[фотограф/.test(t)){const rest=t.replace(/^\[[^\]]*\]\s*/,"");body+=`<div class="b me photo"><span class="ph" role="img" aria-label="${esc(t.match(/\[([^\]]*)\]/)[1])}" style="background-image:url(img/f02.webp)"></span><span class="meta">${esc(meta)} · фото <span class="tk">✓</span></span></div>`;if(rest)body+=`<div class="b me">${esc(rest)}<span class="meta">${esc(meta)} <span class="tk">✓</span></span></div>`}
    else body+=`<div class="b me">${esc(t)}<span class="meta">${esc(meta)} <span class="tk">✓</span></span></div>`}
  c.innerHTML=phone("SLM","был(а) недавно",body||`<div class="b me">${esc(txt)}</div>`,"23:58")+`<div class="nbtools"><button class="chip" type="button" data-go="msgs:slm">Открыть чат SLM целиком →</button></div>`;
}
function rDream(c,e){
  const host=document.createElement("div");host.className="dream";host.innerHTML=(({27:"d01",96:"d02"})[e.n]?`<img class="dimg" alt="Образ сна" src="img/${({27:"d01",96:"d02"})[e.n]}.webp">`:"")+`<canvas aria-label="Сон: зерно, тёплый свет, фигуры"></canvas>`;c.prepend(host);
  const cv=host.querySelector("canvas"),ctx=cv.getContext("2d");let raf,t0=performance.now();const mesh=e.n===96;
  function f(now){const W=cv.width=Math.min(900,cv.clientWidth),H=cv.height=Math.round(W*9/16);const t=(now-t0)/1000;
    ctx.fillStyle="#060608";ctx.fillRect(0,0,W,H);
    if(mesh){for(let i=0;i<9;i++){const x=W*(.1+i*.1)+Math.sin(t*.4+i)*6,y=H*.7-((t*20+i*40)%(H*.6));ctx.fillStyle=`rgba(40,40,44,${.8-i*.05})`;ctx.beginPath();ctx.ellipse(x,y,W*.05,H*.08,Math.sin(i),0,7);ctx.fill()}}
    else{const g=ctx.createRadialGradient(W*.5+Math.sin(t*.3)*W*.05,H*.55,10,W*.5,H*.55,W*.45);g.addColorStop(0,"rgba(214,150,84,.55)");g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      for(let i=0;i<5;i++){const x=W*(.25+i*.12)+Math.sin(t*.8+i)*W*.03,y=H*.62+Math.cos(t*1.1+i)*6;ctx.fillStyle="rgba(30,22,18,.55)";ctx.beginPath();ctx.ellipse(x,y,W*.025,H*.14,Math.sin(t+i)*.2,0,7);ctx.fill();ctx.beginPath();ctx.arc(x,y-H*.18,W*.018,0,7);ctx.fill()}
      const fa=Math.max(0,Math.sin(t*.35));ctx.fillStyle=`rgba(236,206,170,${.35*fa})`;ctx.beginPath();ctx.ellipse(W*.5,H*.38,W*.06,H*.12,0,0,7);ctx.fill()}
    const img=ctx.getImageData(0,0,W,H),d=img.data;for(let i=0;i<d.length;i+=4){const r=(Math.random()-.5)*42;d[i]+=r;d[i+1]+=r;d[i+2]+=r}ctx.putImageData(img,0,0);
    raf=requestAnimationFrame(f)}
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){f(t0+4000);cancelAnimationFrame(raf)}else raf=requestAnimationFrame(f);
  cleanup.push(()=>cancelAnimationFrame(raf));
}
function render(c,e){
  if(e.n===123&&!(e.seg&&e.seg.length)){c.innerHTML=`<article class="docsheet"><div class="diary"><p>${esc(e.where)}</p><p class="tnote">Глава переписки копий в этой выборке не расшифрована. Обе копии отвечают сами — в разделе «Сообщения».</p></div></article><div class="nbtools"><button class="chip" type="button" data-go="msgs:v1">Написать Viktor-1 →</button><button class="chip" type="button" data-go="msgs:ncopy">Написать копии N →</button></div>`;return}
  if(e.v==="prologue")return rPrologue(c,e);
  if(e.v==="slm")return rSlm(c,e);
  ({viktor:rDoc,father:rFather,n:rN,masha:rMasha,valentina:rValentina,anton:rAnton,lina:rLina,mark:rMark,v1:rV1,v1pack:rV1pack}[e.v]||rDoc)(c,e);
  if(DREAMS[e.n])rDream(c,e);
}


/* ---------- версия 24: звук, кино, часы, вне страницы, пост ленты ---------- */
const FEED=(window.BOOKDATA.feed||[]);
function ytq(s){const m=String(s).match(/([A-ZА-ЯЁ0-9][^«»;.]{1,48}?)[\s,—–-]*«([^»]{1,60})»/);return m?"https://www.youtube.com/results?search_query="+encodeURIComponent(m[1].replace(/^(В|На|Из|По|Затем|затем)\s+[^—]*?—\s*/,"").trim()+" "+m[2]):null}
function postCard(p,full){const lnk=p.ig.map((u,i)=>`<a href="${esc(u)}" target="_blank" rel="noopener">пост ${i+1}</a>`).join(" · ");
  return `<article class="igpost"><div class="ighead"><span class="igava">${p.who.includes("Valentina")?"V":p.who.includes("N")?"N":"V"}</span><b>${esc(p.who)}</b><span>№ ${p.no} · ${esc(p.date)}</span></div>
   <p class="ighook">${esc(p.hook)}</p>${p.fact&&p.fact!=="—"?`<p class="igfact">${esc(p.fact)}</p>`:""}${p.next&&p.next!=="—"?`<p class="ignext">${esc(p.next)}</p>`:""}
   ${lnk?`<p class="igreal">Реальные посты на ту же тему: ${lnk}</p>`:""}
   ${full&&p.n?`<details class="ighid"><summary>Чего в посте нет</summary><p>${esc(p.hidden)}</p><button type="button" class="lnk" data-open="${p.n}">${lab(p.n)} · ${esc(BY[p.n]?BY[p.n].t:"")} →</button></details>`:""}
   ${full&&!p.n?`<p class="hint">${esc(p.hidden)}. Лента выходит на этом сайте и после последней даты романа.</p>`:""}</article>`}
function extraHTML(e){let h="";
  if(e.snd){const u=ytq(e.snd);h+=`<div class="xblk"><div class="eyebrow">Звучит</div><p>${esc(e.snd)}</p>${u?`<a class="chip" href="${u}" target="_blank" rel="noopener">Найти трек →</a>`:""}</div>`}
  if(e.art)h+=`<div class="xblk"><div class="eyebrow">Кино и искусство</div><p>${esc(e.art)}</p></div>`;
  const ps=FEED.filter(p=>p.n===e.n);if(ps.length)h+=`<div class="xblk"><div class="eyebrow">Пост в ленте Viktor</div>${ps.map(p=>postCard(p,false)).join("")}<button type="button" class="chip" data-go="posts">Вся лента →</button></div>`;
  if(e.hrs)h+=`<details class="xblk"><summary class="eyebrow">День по часам</summary><p>${esc(e.hrs)}</p></details>`;
  if(e.off)h+=`<details class="xblk"><summary class="eyebrow">В это время вне страницы</summary><p>${esc(e.off)}</p></details>`;
  return h}
function showPosts(){clearView();setNav("posts");
  view.innerHTML=`<div class="page-head"><div class="eyebrow">Лента Viktor · ${FEED.length} ${(n=>n%10===1&&n%100!==11?"пост":n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?"поста":"постов")(FEED.length)} · ноябрь 2027 — после финала</div><h2>Посты</h2><div class="sub">Каждый пост — факт из исследования и вывод на шаг дальше. Чего в посте нет, лежит в записи рядом. До февраля пишет Viktor, в феврале — «Viktor от N», с конца февраля каждый день в 9:00 — «Viktor от Valentina».</div></div>
   ${window.Floors?Floors.visitorPostsSection():""}<div class="flsec"><h3>Лента Viktor</h3></div><div class="igfeed">${FEED.map(p=>postCard(p,true)).join("")}</div>`;if(window.Floors)Floors.wireVisitorPosts()}

/* ---------- страница единицы ---------- */
function openUnit(n){
  const e=BY[n];if(!e)return;
  clearView();setNav("");seen.add(n);(OBJ_OF[n]||[]).forEach(o=>found.add(o.id));save();
  const i=ORDER.indexOf(n),prev=ORDER[i-1],next=ORDER[i+1];
  const medias=window.Media?Media.forText(textOf(e)+" "+e.det+" "+(e.snd||"")):[];
  view.innerHTML=`<div class="unit"><div>
     <div class="page-head"><div class="eyebrow"><span class="vmark" style="background:${color(e)}"></span>${lab(n)} · ${esc(e.who||GROUPS[group(e)].name)} · ${esc(BLOCKS[e.b]?BLOCKS[e.b][0]:"")}</div><h2>${esc(e.t)}</h2></div>
     <div id="carrier"></div>
     <div class="after">${extraHTML(e)}${medias.length?`<div class="eyebrow">Звучит и видно в записи</div>`+medias.map(m=>Media.block(m)).join(""):""}
      ${SAME[n]&&!/data-same/.test("")?``:""}</div>
     <div class="pager">${prev!=null?`<button type="button" data-open="${prev}">← ${lab(prev)} · ${esc(BY[prev].t)}</button>`:"<span></span>"}${next!=null?`<button type="button" data-open="${next}">${lab(next)} · ${esc(BY[next].t)} →</button>`:"<span></span>"}</div>
   </div><aside>${cardHTML(e)}${traceBlock(e)}</aside></div>`;
  render($("#carrier"),e);wireTraces(e);
  if(SAME[n]&&!view.querySelector("[data-same]"))$("#carrier").insertAdjacentHTML("beforeend",`<div class="nbtools"><button class="chip" type="button" data-same="${n}">Тот же день в другом файле →</button></div>`);
  if(window.Media)Media.wire(view);
}
function showSame(n){
  const a=BY[n],b=BY[SAME[n]];clearView();setNav("");seen.add(a.n);seen.add(b.n);save();
  view.innerHTML=`<div class="page-head"><div class="eyebrow">Одно событие — два файла</div><h2>${esc(a.t)} · ${esc(b.t)}</h2></div>
   <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:28px;align-items:start">
    <div><div class="eyebrow" style="margin-bottom:10px"><span class="vmark" style="background:${color(a)}"></span>${lab(a.n)} · ${esc(a.who)}</div><div id="ca"></div></div>
    <div><div class="eyebrow" style="margin-bottom:10px"><span class="vmark" style="background:${color(b)}"></span>${lab(b.n)} · ${esc(b.who)}</div><div id="cb"></div></div></div>
   <div class="pager"><button type="button" data-open="${a.n}">← ${lab(a.n)} · ${esc(a.t)}</button><button type="button" data-open="${b.n}">${lab(b.n)} · ${esc(b.t)} →</button></div>`;
  render($("#ca"),a);render($("#cb"),b);
  view.querySelectorAll("[data-same]").forEach(x=>x.remove());
}

/* ---------- главная ---------- */
function showHome(){
  if(window.Floors&&window.__APP){Floors.home();return}
  clearView();setNav("");
  /* облака условной карты эмбеддингов: x,y — доля ширины и высоты */
  const C={
    viktor:{x:.50,y:.53,r:.15},father:{x:.40,y:.20,r:.07},mark:{x:.58,y:.11,r:.05},v1:{x:.69,y:.30,r:.07},anton:{x:.75,y:.55,r:.06},
    n:{x:.66,y:.79,r:.07},valentina:{x:.50,y:.89,r:.05},masha:{x:.34,y:.79,r:.07},lina:{x:.22,y:.62,r:.07},
    msgs:{x:.89,y:.22,r:.09},museum:{x:.89,y:.74,r:.11},media:{x:.10,y:.86,r:.06},club:{x:.30,y:.91,r:.05}
  };
  const META={club:{name:"Клуб энтузиастов",color:"#E03A1E",what:"ваш двойник, разговоры двойников, посты, проекты",go:"club"},msgs:{name:"Переписка",color:"#C9A24A",what:"чаты из записей и двойники книги, которые отвечают",go:"msgs"},
    museum:{name:"Музей вещей",color:"#D8D2C4",what:`${OBJS.length} предметов из записей, десять залов`,go:"museum"},
    media:{name:"Плейлисты",color:"#C76B8C",what:"что слушает каждый персонаж",go:"media"}};
  const CHAT_TO={masha:"masha",valentina:"valentina",slm:"viktor",n:"n",club:"anton",superman:"viktor",v1:"v1",ncopy:"n",mark:"mark"};
  const vcount=k=>BOOK.filter(e=>group(e)===k).length;
  const first=BY[1];
  view.innerHTML=`${window.Floors?Floors.homeBand():""}<section class="emb" aria-label="Карта смыслов">
   <div class="embbox" id="eb"><canvas id="ec" aria-hidden="true"></canvas>
    <div class="emb-head"><div class="eyebrow">условная карта эмбеддингов · ${BOOK.length} записей · ${Object.keys(CHATS).length} чатов · ${OBJS.length} вещей<span id="embTr"></span></div>
     <h1>Год Viktor в&nbsp;пространстве смыслов</h1>
     <p>Близкое по смыслу лежит рядом. Наведите на точку — проступит голос. Нажмите на облако — войдёте в него.</p></div>
    <div id="elabels"></div>
    <div class="etip" id="et" hidden></div>
    <div class="ecard" id="ecard" hidden></div>
    <div class="etools"><button type="button" class="etg" id="eThread" aria-pressed="false">Нить года</button><button type="button" class="etg" id="eReset">Весь вид</button><button type="button" class="estart" data-open="1">Начать с первой записи →</button></div>
   </div>
   <div class="emb-list"><div class="eyebrow">Куда можно войти</div><div class="eclusters">
    ${Object.entries(GROUPS).map(([k,g])=>`<button type="button" data-voice="${k}"><i style="background:${g.color}"></i><b>${esc(g.name)}</b><span>${esc(g.carrier)} · ${vcount(k)}</span></button>`).join("")}
    ${Object.entries(META).map(([k,m])=>`<button type="button" data-go="${m.go}"><i style="background:${m.color}"></i><b>${m.name}</b><span>${esc(m.what)}</span></button>`).join("")}
    <button type="button" data-go="feed"><i style="background:var(--muted)"></i><b>Весь год по порядку</b><span>${BOOK.length} записей, все голоса вперемешку</span></button>
   </div>
   <div class="firstline">${esc((first&&first.seg[0]&&first.seg[0].t||"").split(/(?<=\.)\s/).slice(0,2).join(" "))}<small>запись 1 · Viktor · 15 марта 2027, самолёт садится</small></div></div>
  </section>`;if(window.Floors)Floors.wireBand();

  const cv=$("#ec"),ctx=cv.getContext("2d"),box=$("#eb"),tip=$("#et"),card=$("#ecard"),labels=$("#elabels");
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
  const gauss=()=>{let u=rnd()||1e-9,v=rnd();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
  const portrait=box.clientHeight>box.clientWidth*1.1;
  const AR=portrait?.62:1.7; /* в мировых координатах высота 1, ширина AR */
  if(portrait)Object.values(C).forEach(c=>{const x=c.x,y=c.y;c.x=.06+.88*y;c.y=.25+.6*x;c.r*=.62});
  const P=[];const byN={};const PS=portrait?.55:1;
  /* записи */
  BOOK.forEach(e=>{const k=group(e);let c=C[k]||C.viktor;if(k==="viktor"&&e.b>=11){const f=Math.min(1,(e.b-10)/7)*.85;c={x:C.viktor.x+(C.v1.x-C.viktor.x)*f,y:C.viktor.y+(C.v1.y-C.viktor.y)*f,r:C.viktor.r*(1-f*.6)}}const p={t:"e",e,k,cx:c.x,cy:c.y,color:GROUPS[k].color,x:c.x*AR+gauss()*c.r*.8,y:c.y+gauss()*c.r*.8,r:4.2};P.push(p);byN[e.n]=p});
  /* лёгкая раскладка: притяжение к облаку и к соседям по смыслу, отталкивание */
  const ents=P.slice();
  for(let it=0;it<140;it++){
    ents.forEach(p=>{p.vx=(p.cx*AR-p.x)*.03;p.vy=(p.cy-p.y)*.03;
      (NEAR[p.e.n]||[]).slice(0,3).forEach(b=>{const q=byN[b];if(q){p.vx+=(q.x-p.x)*.006;p.vy+=(q.y-p.y)*.006}})});
    for(let i=0;i<ents.length;i++)for(let j=i+1;j<ents.length;j++){const a=ents[i],b=ents[j];let dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy;if(d2<.0018&&d2>0){const f=(.0018-d2)*4;a.vx+=dx*f*40;a.vy+=dy*f*40;b.vx-=dx*f*40;b.vy-=dy*f*40}}
    ents.forEach(p=>{p.x+=p.vx;p.y+=p.vy})}
  /* чаты */
  Object.entries(CHATS).forEach(([k,ch],i,arr)=>{const a=-Math.PI/2+i/arr.length*Math.PI*2,c=C.msgs;P.push({t:"c",k,ch,color:ch.ai?"#7FD1A8":META.msgs.color,x:c.x*AR+Math.cos(a)*c.r*.9,y:c.y+Math.sin(a)*c.r*.9,r:6.5,link:CHAT_TO[k]})});
  /* вещи: пыль по залам, фото — крупнее */
  const halls=Object.keys(HALLS);const thumbs={};
  OBJS.forEach(o=>{const hi=Math.max(0,halls.indexOf(o.h)),a=hi/halls.length*Math.PI*2,c=C.museum;const ph=imgOf(o.id,1);
    const cx=c.x*AR+Math.cos(a)*c.r*.62,cy=c.y+Math.sin(a)*c.r*.62;
    const p={t:"o",o,color:META.museum.color,x:ph?c.x*AR+Math.cos(a)*c.r*.95+gauss()*.012:cx+gauss()*c.r*.17,y:ph?c.y+Math.sin(a)*c.r*.95+gauss()*.012:cy+gauss()*c.r*.17,r:ph?9:1.5,ph};
    if(ph){const im=new Image();im.src=ph;thumbs[o.id]=im}P.push(p)});
  /* звук и кадр */
  const items=window.Media&&Media.items?Media.items():[];
  items.forEach(it=>{const c=C.media;P.push({t:"m",it,color:META.media.color,x:c.x*AR+gauss()*c.r*.5,y:c.y+gauss()*c.r*.5,r:3,link:it.g&&GROUPS[it.g]?it.g:null})});
  P.forEach(p=>{p.tx=p.x;p.ty=p.y;p.ph0=rnd()*6.28;const a=rnd()*6.28;p.sx=AR/2+Math.cos(a)*.03;p.sy=.5+Math.sin(a)*.03});
  function syncTraces(){for(let i=P.length-1;i>=0;i--)if(P[i].t==="r")P.splice(i,1);
    allTraces().slice(0,200).forEach((t,i)=>{const q=byN[t.n];if(!q)return;const ang=(i*2.39996)%6.283,rr=.012+(i%5)*.004;
      P.push({t:"r",tr:t,n:t.n,link:null,color:"#F2C46B",r:2.2,x:q.tx+Math.cos(ang)*rr,y:q.ty+Math.sin(ang)*rr,tx:q.tx+Math.cos(ang)*rr,ty:q.ty+Math.sin(ang)*rr,sx:q.tx,sy:q.ty,ph0:i})});
    const c=allTraces().length;const eb=$("#embTr");if(eb)eb.textContent=c?` · следов читателей: ${c}`:""}
  syncTraces();const onTr=()=>syncTraces();document.addEventListener("traces",onTr);cleanup.push(()=>document.removeEventListener("traces",onTr));

  /* камера */
  let cam={x:AR/2,y:.5,z:1},camT={...cam};let W=0,H=0,S=1;
  const toScr=(x,y)=>[(x-cam.x)*S*cam.z+W/2,(y-cam.y)*S*cam.z+H/2];
  const toW=(sx,sy)=>[(sx-W/2)/(S*cam.z)+cam.x,(sy-H/2)/(S*cam.z)+cam.y];
  function fit(){W=box.clientWidth;H=box.clientHeight;S=Math.min(W/(AR*1.04),H/1.06);const d=devicePixelRatio||1;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0)}
  /* подписи облаков */
  const LBL=[...Object.entries(GROUPS).map(([k,g])=>({k,name:g.name,color:g.color,sub:`${g.carrier} · ${vcount(k)}`,attr:`data-voice="${k}"`})),
    ...Object.entries(META).map(([k,m])=>({k,name:m.name,color:m.color,sub:m.what,attr:`data-go="${m.go}"`}))];
  labels.innerHTML=LBL.map(l=>`<button type="button" class="elbl" data-k="${l.k}" ${l.attr}><i style="background:${l.color}"></i>${esc(l.name)}</button>`).join("");
  const lblEl=Object.fromEntries([...labels.children].map(b=>[b.dataset.k,b]));
  let focus=null,hover=null,thread=false,t0=performance.now(),raf;
  labels.addEventListener("pointerover",ev=>{const b=ev.target.closest(".elbl");if(!b)return;focus=b.dataset.k;const l=LBL.find(x=>x.k===focus);
    card.hidden=false;card.innerHTML=`<b><i style="background:${l.color}"></i>${esc(l.name)}</b><span>${esc(l.sub)}</span><em>нажмите, чтобы войти →</em>`});
  labels.addEventListener("pointerout",ev=>{if(ev.target.closest(".elbl")){focus=null;card.hidden=true}});
  const inFocus=p=>!focus||p.k===focus||(focus==="msgs"&&p.t==="c")||(focus==="museum"&&p.t==="o")||(focus==="media"&&p.t==="m")||(p.link===focus);
  function draw(now){
    const t=(now-t0)/1000,intro=reduce?1:Math.min(1,t/1.6),ei=1-Math.pow(1-intro,3);
    cam.x+=(camT.x-cam.x)*.12;cam.y+=(camT.y-cam.y)*.12;cam.z+=(camT.z-cam.z)*.12;
    ctx.clearRect(0,0,W,H);
    P.forEach(p=>{const dr=reduce?0:.0025;p.x=p.sx+(p.tx-p.sx)*ei+Math.sin(t*.5+p.ph0)*dr;p.y=p.sy+(p.ty-p.sy)*ei+Math.cos(t*.4+p.ph0)*dr;const s=toScr(p.x,p.y);p.X=s[0];p.Y=s[1]});
    /* связи по смыслу */
    ctx.lineWidth=1;
    ents.forEach(p=>(NEAR[p.e.n]||[]).slice(0,2).forEach(b=>{const q=byN[b];if(!q||p.e.n>b)return;const on=hover&&(hover===p||hover===q);
      ctx.strokeStyle=on?"rgba(240,232,214,.75)":`rgba(160,175,200,${focus?(inFocus(p)?.22:.03):.09})`;ctx.beginPath();ctx.moveTo(p.X,p.Y);ctx.lineTo(q.X,q.Y);ctx.stroke()}));
    /* связи чатов, вещей и треков с облаками */
    P.forEach(p=>{if(!(hover===p||(focus&&p.link===focus)))return;let q=null;
      if(p.t==="o"&&p.o.n&&byN[p.o.n])q=byN[p.o.n];else if(p.link&&C[p.link]){const s=toScr(C[p.link].x*AR,C[p.link].y);q={X:s[0],Y:s[1]}}
      if(q){ctx.strokeStyle="rgba(240,232,214,.55)";ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(p.X,p.Y);ctx.lineTo(q.X,q.Y);ctx.stroke();ctx.setLineDash([])}});
    /* нить года */
    if(thread){ctx.strokeStyle="rgba(240,232,214,.35)";ctx.lineWidth=1.2;ctx.beginPath();ORDER.forEach((n,i)=>{const p=byN[n];if(p)i?ctx.lineTo(p.X,p.Y):ctx.moveTo(p.X,p.Y)});ctx.stroke()}
    /* точки */
    P.forEach(p=>{const a=inFocus(p)?1:.12;const hv=p===hover;let r=p.r*PS*Math.min(1.8,Math.sqrt(cam.z))*(hv?1.6:1);
      if(p.t==="o"&&p.ph&&thumbs[p.o.id]&&thumbs[p.o.id].complete&&thumbs[p.o.id].naturalWidth){ctx.globalAlpha=a;ctx.save();ctx.beginPath();ctx.arc(p.X,p.Y,r,0,7);ctx.clip();const im=thumbs[p.o.id];ctx.drawImage(im,p.X-r*1.34,p.Y-r,r*2.68,r*2);ctx.restore();ctx.strokeStyle="rgba(240,232,214,.8)";ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.X,p.Y,r,0,7);ctx.stroke()}
      else{ctx.globalAlpha=a*(p.t==="o"?.55:.92);if(p.t!=="o"){ctx.shadowColor=p.color;ctx.shadowBlur=hv?18:8}ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.X,p.Y,r,0,7);ctx.fill();ctx.shadowBlur=0;
        if(p.t==="e"&&seen.has(p.e.n)){ctx.strokeStyle="rgba(255,255,255,.85)";ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.X,p.Y,r+2.2,0,7);ctx.stroke()}
        if(p.t==="c"&&(!portrait||cam.z>1.5)){ctx.globalAlpha=a*.85;ctx.fillStyle="#F2F2EE";ctx.font="11px "+getComputedStyle(document.documentElement).getPropertyValue("--f-ui");ctx.textAlign="center";ctx.fillText(p.ch.name,p.X,p.Y+r+13);ctx.textAlign="left"}}
      ctx.globalAlpha=1});
    /* подписи облаков следуют за камерой */
    LBL.forEach(l=>{const c=C[l.k];const s=toScr(c.x*AR,c.y-c.r*.95-.02);const b=lblEl[l.k];b.style.transform=`translate(${Math.round(s[0])}px,${Math.round(s[1])}px) translate(-50%,-100%)`;b.style.opacity=(focus&&focus!==l.k?.35:1)*ei});
    raf=requestAnimationFrame(draw)}
  function pick(x,y){let h=null,best=16;P.forEach(p=>{if(p.t==="o"&&!p.ph&&cam.z<1.6)return;const d=Math.hypot(p.X-x,p.Y-y)-p.r;if(d<best){best=d;h=p}});return h}
  function showTip(p,x,y){tip.hidden=false;tip.style.left=x+"px";tip.style.top=y+"px";
    if(p.t==="e"){const line=(p.e.seg.find(s=>s.t)||{t:""}).t.split(/(?<=[.!?…])\s/)[0].slice(0,150);tip.innerHTML=`<b>${lab(p.e.n)} · ${esc(p.e.t)}</b><small>${esc(GROUPS[p.k].name)} · ${esc(BLOCKS[p.e.b]?BLOCKS[p.e.b][0]:"")}</small><span>${esc(line)}</span>`}
    else if(p.t==="c")tip.innerHTML=`<b>${esc(p.ch.name)}</b><small>${p.ch.ai?"копия · отвечает из базы":"чат"}</small><span>${esc(p.ch.sub||"")}</span>`;
    else if(p.t==="o")tip.innerHTML=`${p.ph?`<img src="${p.ph}" alt="">`:""}<b>${esc(p.o.name)}</b><small>${esc(HALLS[p.o.h]||"")} · запись ${lab(p.o.n)}</small>`;
    else if(p.t==="r")tip.innerHTML=`<b>След читателя</b><small>к записи ${lab(p.n)} · ${esc(BY[p.n].t)}</small><span>${esc(p.tr.text)}</span>`;
    else tip.innerHTML=`<b>${esc(p.it.title)}</b><small>${esc(p.it.by||"")}${p.it.year?" · "+p.it.year:""}</small>`;
    if(phone()){tip.insertAdjacentHTML("beforeend",`<button type="button" class="eopen">${p.t==="e"||p.t==="r"?"Читать запись":p.t==="c"?"Открыть чат":p.t==="o"?"Посмотреть предмет":"Открыть «Звук и кадр»"} →</button>`);tip.querySelector(".eopen").onclick=()=>activate(p)}}
  const phone=()=>matchMedia("(max-width:600px)").matches;
  function activate(p){if(p.t==="r"){openUnit(p.n);return}if(p.t==="e")openUnit(p.e.n);else if(p.t==="c")go("msgs:"+p.k);else if(p.t==="o")showObj(p.o.id);else go("media")}
  let drag=null,moved=false;
  cv.addEventListener("pointerdown",ev=>{drag={x:ev.clientX,y:ev.clientY,cx:camT.x,cy:camT.y};moved=false;cv.setPointerCapture(ev.pointerId)});
  cv.addEventListener("pointermove",ev=>{const rc=cv.getBoundingClientRect(),x=ev.clientX-rc.left,y=ev.clientY-rc.top;
    if(drag){const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;if(Math.hypot(dx,dy)>4)moved=true;if(moved){camT.x=drag.cx-dx/(S*cam.z);camT.y=drag.cy-dy/(S*cam.z);cam.x=camT.x;cam.y=camT.y;tip.hidden=true;return}}
    if(ev.pointerType==="touch")return;hover=pick(x,y);cv.style.cursor=hover?"pointer":"grab";if(hover)showTip(hover,x,y);else tip.hidden=true});
  cv.addEventListener("pointerup",ev=>{const was=drag;drag=null;if(!was||moved)return;const rc=cv.getBoundingClientRect(),x=ev.clientX-rc.left,y=ev.clientY-rc.top;const p=pick(x,y);
    if(!p){tip.hidden=true;hover=null;/* щелчок по облаку — приблизить */const [wx,wy]=toW(x,y);const k=Object.keys(C).find(k=>Math.hypot(C[k].x*AR-wx,C[k].y-wy)<C[k].r*1.1);if(k){camT={x:C[k].x*AR,y:C[k].y,z:Math.min(3.2,.32/C[k].r)}}return}
    if((ev.pointerType==="touch"||phone())&&hover!==p){hover=p;showTip(p,x,y);return}activate(p)});
  cv.addEventListener("pointerleave",ev=>{if(ev.pointerType==="touch"||phone())return;if(!drag){hover=null;tip.hidden=true}});
  cv.addEventListener("wheel",ev=>{ev.preventDefault();const rc=cv.getBoundingClientRect();const [wx,wy]=toW(ev.clientX-rc.left,ev.clientY-rc.top);const z=Math.max(.8,Math.min(5,camT.z*Math.exp(-ev.deltaY*.0015)));
    camT.x=wx+(camT.x-wx)*camT.z/z;camT.y=wy+(camT.y-wy)*camT.z/z;camT.z=z},{passive:false});
  cv.addEventListener("dblclick",()=>{camT={x:AR/2,y:.5,z:1}});
  $("#eReset").onclick=()=>{camT={x:AR/2,y:.5,z:1}};
  $("#eThread").onclick=ev=>{thread=!thread;ev.currentTarget.setAttribute("aria-pressed",thread)};
  fit();const ro=new ResizeObserver(fit);ro.observe(box);
  raf=requestAnimationFrame(draw);cleanup.push(()=>{cancelAnimationFrame(raf);ro.disconnect()});
}

/* ---------- лента ---------- */
let feedFilter="all",feedQ="";
function showFeed(){
  clearView();setNav("feed");
  view.innerHTML=`<div class="page-head"><div class="eyebrow">Лента · ${BOOK.length} записей</div><h2>Год по порядку</h2><div class="sub">Все голоса вперемешку, как в книге. Прочитанные отмечены точкой.</div></div>
   <div class="tools"><div class="seg" role="group" aria-label="Голос">${[["all","Все"],...Object.entries(GROUPS).map(([k,g])=>[k,g.name])].map(([k,t])=>`<button type="button" data-ff="${k}" aria-pressed="${feedFilter===k}">${esc(t)}</button>`).join("")}</div>
    <input type="search" id="fq" placeholder="Поиск по тексту" value="${esc(feedQ)}" aria-label="Поиск по тексту"></div><div id="fl"></div>`;
  const draw=()=>{const q=feedQ.toLowerCase();const byB={};
    BOOK.filter(e=>(feedFilter==="all"||group(e)===feedFilter)&&(!q||(e.t+" "+textOf(e)).toLowerCase().includes(q))).forEach(e=>(byB[e.b]=byB[e.b]||[]).push(e));
    $("#fl").innerHTML=Object.keys(byB).length?Object.keys(byB).sort((a,b)=>a-b).map(b=>`<section class="month"><div class="when"><b>${esc(BLOCKS[b][1])}</b>${esc(BLOCKS[b][0])}</div><div class="rows">${byB[b].map(e=>`<button type="button" class="row${seen.has(e.n)?" read":""}" data-open="${e.n}"><span class="n">${e.n}</span><span class="t">${esc(e.t)}<small>${esc(snippet(e,120))}</small></span><span class="v"><span class="vmark" style="background:${color(e)}"></span>${esc(e.who)}</span></button>`).join("")}</div></section>`).join(""):`<p class="hint">Ничего не нашлось.</p>`};
  draw();
  view.querySelectorAll("[data-ff]").forEach(b=>b.onclick=()=>{feedFilter=b.dataset.ff;view.querySelectorAll("[data-ff]").forEach(x=>x.setAttribute("aria-pressed",x===b));draw()});
  $("#fq").oninput=ev=>{feedQ=ev.target.value;draw()};
}

/* ---------- голоса ---------- */
function sample(k){const e=BOOK.find(x=>group(x)===k&&x.seg.length);if(!e)return "";const t=(e.seg.find(s=>s.k==="p")||{}).t||"";
  const s=esc(t.slice(0,160));
  return {viktor:`<div style="font-family:var(--f-body)">${s}…</div>`,father:`<div style="font-family:var(--f-father);font-size:21px;color:var(--father-ink);line-height:1.35">${s}</div>`,
   n:`<div style="background:var(--film);color:var(--film-text);margin:-14px;padding:14px;height:calc(100% + 28px);font-family:var(--f-body)">${s}</div>`,
   masha:`<div>☑ ${s}</div>`,valentina:`<div style="font-family:var(--f-val);color:var(--val-ink);font-size:16px">${s}</div>`,anton:`<div style="font-size:13px">${s}</div>`,
   lina:`<div style="font-size:14px">${s}</div>`,mark:`<div style="font-family:var(--f-letter);font-size:17px">${s}</div>`,
   v1:`<div style="background:var(--log);color:var(--log-text);margin:-14px;padding:14px;height:calc(100% + 28px);font-family:var(--f-mono);font-size:12px">${s}</div>`}[k]}
function showVoices(){
  clearView();setNav("voices");
  view.innerHTML=`<div class="page-head"><div class="eyebrow">Голоса · 9</div><h2>Кто говорит и чем</h2><div class="sub">Автора записи можно узнать раньше, чем прочитать заголовок: у каждого голоса своё устройство страницы.</div></div>
   <div class="voices">${Object.entries(GROUPS).map(([k,g])=>{const cnt=BOOK.filter(e=>group(e)===k).length;
    return `<button type="button" class="voice" data-voice="${k}"><div class="sample">${sample(k)}</div><div class="lbl"><b><span class="vmark" style="background:${g.color}"></span>${esc(g.name)}</b><span>${esc(g.carrier)} · записей ${cnt}</span></div></button>`}).join("")}</div>
   <div class="page-head" style="margin-top:40px"><div class="eyebrow">Люди книги</div><h2>Другие лица</h2></div>
   <div class="tablewrap"><table class="people"><thead><tr><th>Кто</th><th>Коротко</th><th>Где</th></tr></thead><tbody>${PEOPLE.map(p=>`<tr><td><b>${esc(p[0])}</b></td><td>${esc(p[1])}</td><td>${esc(p[2])}</td></tr>`).join("")}</tbody></table></div>${window.Floors?Floors.bookDoublesSection():""}`;
}
function showVoice(k){
  clearView();setNav("voices");const g=GROUPS[k],vi=VOICE_INFO[k];
  const list=BOOK.filter(e=>group(e)===k);
  view.innerHTML=`<div class="page-head"><button type="button" class="chip" data-go="voices">← Голоса</button><h2 style="margin-top:14px"><span class="vmark" style="background:${g.color};width:12px;height:12px"></span>${esc(g.name)}</h2><div class="sub">Носитель: ${esc(g.carrier)} · записей ${list.length}</div></div>
   <div class="vinfo"><div><b>Замечает прежде всего</b>${esc(vi.sees)}</div><div><b>Где рассказ неполон</b>${esc(vi.gap)}</div><div><b>Единица текста</b>${esc(vi.unit)}</div><div><b>Узнаётся по первой строке</b>${esc(vi.first)}</div></div>
   <div class="rows">${list.map(e=>`<button type="button" class="row${seen.has(e.n)?" read":""}" data-open="${e.n}"><span class="n">${e.n}</span><span class="t">${esc(e.t)}<small>${esc(snippet(e,140))}</small></span><span class="v">${esc(BLOCKS[e.b][0])}</span></button>`).join("")}</div>`;
}

/* ---------- карта близости ---------- */
function showMap(){
  clearView();setNav("map");
  const hallKeys=["kv","pr","id","dv","ot","se","n","kl","kr"];
  view.innerHTML=`<div class="page-head"><div class="eyebrow">Карта близости · ${BOOK.length} записей · связи по возвращающимся предметам</div><h2>Так базу видит модель</h2><div class="sub">«По времени»: дорожка на каждый голос. «По смыслу»: записи стягиваются к темам, линии — общие предметы и возвраты между записями.</div></div>
   <div class="tools"><div class="seg" role="group" aria-label="Режим"><button type="button" id="mTime" aria-pressed="true">По времени</button><button type="button" id="mMean" aria-pressed="false">По смыслу</button></div><span class="hint">Наведите на точку — проступят её связи. Нажмите — откроется запись.</span></div>
   <div class="mapbox"><canvas id="mc"></canvas><div class="tip" id="tip" hidden></div></div>`;
  const cv=$("#mc"),ctx=cv.getContext("2d"),tip=$("#tip");const lanes=Object.keys(GROUPS);
  let r=11;const rnd=()=>{r=(r*16807)%2147483647;return r/2147483647};
  const pts=BOOK.map(e=>({e,jx:rnd(),jy:rnd()}));const P=Object.fromEntries(pts.map(p=>[p.e.n,p]));
  let target=0,anim=0,hover=null,raf;
  function pos(p,W,H,m){const idx=ORDER.indexOf(p.e.n);const tx=116+(W-146)*(idx/(ORDER.length-1));const ty=26+(H-52)*(lanes.indexOf(group(p.e))+.5)/lanes.length;
    const hi=Math.max(0,hallKeys.indexOf(p.e.h));const cols=3;const cx=W*((hi%cols)+.5)/cols,cy=H*(Math.floor(hi/cols)+.5)/3;
    const ang=p.jx*Math.PI*2,rad=Math.sqrt(p.jy)*Math.min(W/cols,H/3)*.34;return [tx+(cx+Math.cos(ang)*rad-tx)*m,ty+(cy+Math.sin(ang)*rad-ty)*m]}
  const ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
  function draw(){
    const W=cv.clientWidth,H=cv.clientHeight,dpr=devicePixelRatio;if(cv.width!==W*dpr){cv.width=W*dpr;cv.height=H*dpr}ctx.setTransform(dpr,0,0,dpr,0,0);
    const css=getComputedStyle(document.documentElement),col=v=>css.getPropertyValue(v).trim();
    anim+=(target-anim)*.08;if(Math.abs(target-anim)<.002)anim=target;const m=ease(anim);
    ctx.clearRect(0,0,W,H);
    ctx.globalAlpha=1-m;ctx.font="11px "+col("--f-mono");ctx.fillStyle=col("--muted");ctx.strokeStyle=col("--line-soft");
    lanes.forEach((l,i)=>{const y=26+(H-52)*(i+.5)/lanes.length;ctx.fillText(GROUPS[l].name,6,y+4);ctx.beginPath();ctx.moveTo(116,y);ctx.lineTo(W-30,y);ctx.stroke()});
    Object.entries(BLOCKS).forEach(([b])=>{const first=BOOK.find(e=>e.b==b);if(!first)return;const idx=ORDER.indexOf(first.n);const x=116+(W-146)*(idx/(ORDER.length-1));ctx.fillText(b,x,14)});
    ctx.globalAlpha=m;ctx.font="13px "+col("--f-ui");ctx.fillStyle=col("--muted");ctx.textAlign="center";
    hallKeys.forEach((h,hi)=>{const cx=W*((hi%3)+.5)/3,cy=H*(Math.floor(hi/3)+.5)/3;ctx.fillText(HALLS[h],cx,cy-Math.min(W/3,H/3)*.4)});ctx.textAlign="left";
    pts.forEach(p=>{const [x,y]=pos(p,W,H,m);p.x=x;p.y=y});
    ctx.globalAlpha=.10+.12*m;ctx.strokeStyle=col("--stamp");ctx.lineWidth=1;
    Object.entries(NEAR).forEach(([a,arr])=>{const pa=P[a];if(!pa)return;arr.slice(0,2).forEach(b=>{const pb=P[b];if(!pb||+a>b)return;ctx.beginPath();ctx.moveTo(pa.x,pa.y);ctx.lineTo(pb.x,pb.y);ctx.stroke()})});
    if(hover){ctx.globalAlpha=.9;ctx.lineWidth=1.6;(NEAR[hover.e.n]||[]).forEach(b=>{const pb=P[b];if(!pb)return;ctx.beginPath();ctx.moveTo(hover.x,hover.y);ctx.lineTo(pb.x,pb.y);ctx.stroke()})}
    pts.forEach(p=>{ctx.globalAlpha=seen.has(p.e.n)?1:.78;ctx.fillStyle=seen.has(p.e.n)?col("--dot-open"):GROUPS[group(p.e)].color;
      const s=p===hover?7.5:(hover&&(NEAR[hover.e.n]||[]).includes(p.e.n)?6:4.4);ctx.beginPath();ctx.arc(p.x,p.y,s,0,7);ctx.fill()});
    ctx.globalAlpha=1;raf=requestAnimationFrame(draw)}
  function pick(ev){const rc=cv.getBoundingClientRect(),x=ev.clientX-rc.left,y=ev.clientY-rc.top;let h=null,best=14;pts.forEach(p=>{const d=Math.hypot(p.x-x,p.y-y);if(d<best){best=d;h=p}});return [h,x,y]}
  cv.addEventListener("pointermove",ev=>{const [h,x,y]=pick(ev);hover=h;if(h){tip.hidden=false;tip.style.left=x+"px";tip.style.top=y+"px";tip.innerHTML=`<b>${lab(h.e.n)} · ${esc(h.e.t)}</b><br>${esc(h.e.who)} · ${esc(HALLS[h.e.h])}`;cv.style.cursor="pointer"}else{tip.hidden=true;cv.style.cursor="default"}});
  cv.addEventListener("pointerleave",()=>{tip.hidden=true;hover=null});
  cv.addEventListener("click",ev=>{const [h]=pick(ev);if(h)openUnit(h.e.n)});
  const setM=v=>{target=v;$("#mTime").setAttribute("aria-pressed",v===0);$("#mMean").setAttribute("aria-pressed",v===1)};
  $("#mTime").onclick=()=>setM(0);$("#mMean").onclick=()=>setM(1);
  raf=requestAnimationFrame(draw);cleanup.push(()=>cancelAnimationFrame(raf));
}

/* ---------- сообщения ---------- */
const AV={kate:"#8A6A8C",anton:"#5E6FA8",lina:"#B8692A",dina:"#6B7280",nassist:"#4B5563",teamlog:"#4C5D8A",v1n:"#2F7D55",masha:"#3E7D5A",valentina:"#A04A5C",slm:"#6B7280",n:"#7A7A7A",club:"#27489A",superman:"#9A6B2E",mark:"#7A5A8C",v1:"#2F7D55",ncopy:"#5D5D5D",father:"#1F2A6E",team:"#4C5D8A",vn:"#6E6E73",vv:"#A04A5C",v2:"#3E6B4F",vm:"#7A5A8C",vl:"#C9A24A"};

const CHATS={
 kate:{name:"Kate",ava:"K",time:"весна 2027",sub:"как устроился?",render:()=>`
   <div class="day">весна 2027 · после кафе · <button type="button" class="lnk" data-open="8">запись 8</button></div>
   <div class="b me">Кстати, тот актёр. Он ждёт аплодисментов между фразами)<span class="meta">01:40 <span class="tk">✓✓</span></span></div>
   <div class="b me">Наверное, я резко. Он нормальный<span class="meta">01:43 <span class="tk">✓✓</span></span></div>
   <div class="b me">Кстати, сосед<span class="meta">02:15 <span class="tk">✓✓</span></span></div>
   <div class="b call">Она отвечает утром, коротко, по делу. У неё ни одной скобки, у него по три</div>
   <div class="day">через полтора месяца</div>
   <div class="b">как устроился?</div>
   <div class="b call">Без ответа. Его</div>`},
 anton:{name:"Anton · четыре чата",ava:"A",time:"май",sub:"телефон Anton",status:"телефон Anton · не Viktor",render:()=>`
   <div class="day">четверг · <button type="button" class="lnk" data-open="16">запись 16 «Четыре чата»</button></div>
   <div class="b call">Младший</div><div class="b me">удачи<span class="meta">9:40 <span class="tk">✓✓</span></span></div>
   <div class="b call">Средний</div><div class="b me">как контрольная?<span class="meta">18:00 <span class="tk">✓✓</span></span></div><div class="b">какая</div><div class="b me">не та, извини<span class="meta"><span class="tk">✓✓</span></span></div>
   <div class="b call">Младший</div><div class="b"><i>кот без подписи</i></div><div class="b me"><i>стикер</i> · третий день один и тот же</div>
   <div class="b call">Старший · с прошлой недели</div><div class="b">пап ты тут?</div><div class="b call">Без ответа: он тогда был на созвоне</div>
   <div class="b call">Viktor · в пятницу отвезти его маму на анализы, если не найдёт такси</div>
   <div class="day">май 2028 · <button type="button" class="lnk" data-open="137">запись 137 «Пятый чат»</button></div>
   <div class="b call">Сцены в документе 3 пока нет. По ходу записи: четыре чата — работа, бывшая жена, дети, Viktor. Viktor признаётся про копию; ответ Anton стоит между двумя чужими сообщениями; обсуждают фильм, который предложил «Viktor от N»</div>`},
 lina:{name:"Lina-Alexandra",ava:"L",time:"май",sub:"ты там?",render:()=>`
   <div class="day">конец апреля 2028 · 13:10 · <button type="button" class="lnk" data-open="131">запись 131</button></div>
   <div class="b me">как ты?<span class="meta">13:10 <span class="tk">✓✓</span></span></div><div class="b">нормально</div><div class="b call">Не позвонил</div>
   <div class="day">30 апреля 2028 · 20:15 · <button type="button" class="lnk" data-open="132">запись 132</button></div>
   <div class="b me"><i>документ</i> · план: 1 врач 2 режим 3 поговорить про ленту 4 ещё разговор через неделю<span class="meta"><span class="tk">✓✓</span></span></div>
   <div class="b call">Видеозвонок · тот же план, теми же пунктами. Она: «я не ваш следующий проект». «не отвечай мне копией. не обсуждай меня с ней». Он снял очки, секунду молчал: «обещаю»</div>
   <div class="b">Когда ты уже приедешь<span class="meta">30 апреля · <button type="button" class="lnk" data-open="143">143</button></span></div>
   <div class="b">пап, ты спишь?<span class="meta">01:58 · не отправлено</span></div>
   <div class="day">май 2028 · <button type="button" class="lnk" data-open="141">141</button> · <button type="button" class="lnk" data-open="142">142</button></div>
   <div class="b call">Сводка: «Lina-Alexandra — сообщение, фото. Ожидает ответа. Ответ копией запрещён»</div>
   <div class="b"><i>фото</i> · про школу, окно её комнаты; свет другой<span class="meta">четверг</span></div>
   <div class="b">ты там?<span class="meta">суббота, рано</span></div>
   <div class="b me">как контрольная?<span class="meta">понедельник, утро <span class="tk">✓✓</span></span></div>
   <div class="b call">Контрольной нет, в мае ни одной, писала в апреле. Не переспросил. Ответил сам. Ответил поздно</div>`},
 dina:{name:"N · Дина",ava:"Д",time:"декабрь",sub:"я дома, не спрашивай",status:"телефон N · не Viktor",render:()=>`
   <div class="day">31 октября 2027 · ночь, ванная · <button type="button" class="lnk" data-open="64">запись 64</button></div>
   <div class="b me">это давно</div><div class="b me">я ничего не делала и не собираюсь</div><div class="b me">мне стыдно</div><div class="b me">бывает так у других?</div>
   <div class="b">Бывает. Ты не одна.</div>
   <div class="b">есть человек, к которому я бы тебя отвела. хороший. если захочешь</div>
   <div class="b me">🙂</div><div class="b call">Смайлик — это нет</div>
   <div class="day">декабрь 2027 · после кафе · <button type="button" class="lnk" data-open="74">запись 74</button></div>
   <div class="b">я дома, не спрашивай</div>`},
 nassist:{name:"N · ассистент",ava:"?",ai:true,time:"октябрь",sub:"Напомнить завтра о сне?",status:"телефон N · ассистент",render:()=>`
   <div class="day">2:10 · кухня · <button type="button" class="lnk" data-open="64">запись 64</button></div>
   <div class="b me">Он пишет реже, чем летом?</div><div class="b">Октябрь: 212 сообщений. Август: 198. Среднее время ответа — 11 минут, было 14.</div>
   <div class="b me">Текст каталога слабый?</div><div class="b">По сравнению с тремя прежними каталогами галереи провала нет. Вступление утверждено Радой 28 октября.</div>
   <div class="b me">Кто, кроме мужа, поможет с перевозкой?</div><div class="b">Марк и Ася предложили сами. Саша-монтажник. Лика — если без Глеба.</div>
   <div class="b call">Цифры правильные. Прав в цифрах. Неправ в людях</div>
   <div class="b">Напомнить завтра о сне?</div><div class="b call">Не ответила</div>`},
 teamlog:{name:"«команда» · ночь",ava:"К",ai:true,time:"ноябрь",sub:"214 сообщений за ночь",status:"чат копий · рабочие копии",render:()=>`
   <div class="day">ноябрь 2027 · <button type="button" class="lnk" data-open="68">запись 68</button></div>
   <div class="b call">23:00 · Написать некому. Гипотезу обкатать не с кем — живые спят</div>
   <div class="b call">Чат «команда»: цифровая Hottie, копия DA, две копии из интеграций</div>
   <div class="b call">Цифровая Hottie через четыре минуты спрашивает про выборку — тот вопрос, которого он ждал днём</div>
   <div class="b call">Копия DA спорит восемь минут и уступает с цифрами</div>
   <div class="b call">2:30 · он лёг; они ещё переписываются между собой</div>
   <div class="b call">Утром: в «команде» за ночь — 214 сообщений. Текст их сообщений в книге не приведён. Поговорить с копиями — чат «Команда · Hottie и DA»</div>`},
 v1n:{name:"Viktor-1 · цифровая N",ava:"1·N",ai:true,time:"апрель",sub:"Я прошу.",status:"переписка копий · Viktor читает",render:()=>{const e=BY[123];const L=(e.seg||[]).filter(s=>s.k==="p").map(s=>s.t);
   return `<div class="day">апрель 2028 · <button type="button" class="lnk" data-open="123">запись 123</button></div>`+(L.length?L.map(t=>{const m=t.match(/^(Viktor-1|Цифровая N):\s*(.*)$/);return m?`<div class="b${m[1]==="Viktor-1"?" me":""}">${esc(m[2])}<span class="meta">${esc(m[1])}</span></div>`:""}).join(""):`<div class="b call">Текст загружается…</div>`)}},
 masha:{name:"Маша",ava:"М",time:"май",sub:"Я вижу, что это ты",render:()=>`
   <div class="day">15 марта 2027</div><div class="b">Как долетел?<span class="meta">19:12</span></div>
   <div class="b me photo"><span class="ph" role="img" aria-label="Фотография неба над полосой" style="background-image:url(img/f01.webp)"></span><span class="meta">19:40 · фото <span class="tk">✓✓</span></span></div>
   <div class="b">Красиво. Позвони, как доедешь<span class="meta">19:41</span></div>
   <div class="day">16 марта 2027</div><div class="b call">Видеозвонок · 4 мин · Маша, Lina-Alexandra, Vera</div>
   <div class="b">Как Valentina?<span class="meta">22:01</span></div>
   <div class="b me">Всё хорошо<span class="meta">22:03 <span class="tk">✓✓</span></span></div><div class="b">Спи<span class="meta">22:05</span></div>
   <div class="day">8 апреля 2027</div>
   <div class="b me">До осени<span class="meta">21:47 · изменено <span class="tk">✓✓</span></span></div>
   <div class="b">Поняла. Позвони, когда сможешь<span class="meta">21:58</span></div>
   <div class="day">май 2027</div>
   <div class="b">Билеты взяли. Прилёт 1 июля, четверг. На месяц<span class="meta">10:24</span></div>
   <div class="day">1 июля 2027</div>
   <div class="b">Сели. Vera спала весь полёт. Выходим<span class="meta">14:36</span></div>
   <div class="b me">Я у выхода<span class="meta">14:37 <span class="tk">✓✓</span></span></div>
   <div class="day">конец июля 2027 · последние дни</div>
   <div class="b">давай вечером поговорим?<span class="meta">10:14</span></div><div class="b me">давай завтра<span class="meta">10:52 <span class="tk">✓✓</span></span></div>
   <div class="b">ты сегодня свободен?<span class="meta">16:20</span></div><div class="b me">созвон до ночи<span class="meta">17:05 <span class="tk">✓✓</span></span></div>
   <div class="b">я хотела до отъезда<span class="meta">22:41</span></div><div class="b me">конечно, в дороге<span class="meta">23:30 <span class="tk">✓✓</span></span></div>
   <div class="day">31 июля 2027</div>
   <div class="b">Долетели. Девочки спят<span class="meta">20:12</span></div>
   <div class="day">август 2027</div>
   <div class="b call">Видеозвонок · суббота, 11:00 · 9 мин · Vera, Lina-Alexandra</div>
   <div class="day">сентябрь 2027</div>
   <div class="b">Ходили с девочками к воде. До вечера<span class="meta">20:15</span></div>
   <div class="b call">Видеозвонок · 6 мин · Маша, Vera</div>
   <div class="b me bycopy">Мне было хорошо с вами сегодня. Я не хотел, чтобы день кончался<span class="meta">22:02 · предложено копией <span class="tk">✓✓</span></span></div>
   <div class="b"><i>фото</i> · Vera рисует улитку<span class="meta">22:09</span></div>
   <div class="day">сентябрь 2027 · день рождения Lina-Alexandra</div>
   <div class="b">не забудь, ей в полночь шестнадцать<span class="meta">14:02</span></div>
   <div class="b call">Видеозвонок · на следующий день · 2 мин</div>
   <div class="day">сентябрь 2027</div>
   <div class="b">Vera хочет на бассейн по вторникам. Это ещё сорок в месяц<span class="meta">18:40</span></div>
   <div class="b me bycopy">Давай. Если ей нравится — это не лишнее. Скинь сумму, переведу<span class="meta">19:05 · предложено копией <span class="tk">✓✓</span></span></div>
   <div class="b">завтра родительское. подключишься в шесть?<span class="meta">21:30</span></div>
   <div class="b me bycopy">Доброе утро. Подключиться не получится, созвон. Расскажи потом, что сказали — прочитаю<span class="meta">09:30 · отправлено копией <span class="tk">✓✓</span></span></div>
   <div class="day">октябрь 2027</div>
   <div class="b me bycopy">Доброе утро<span class="meta">07:00 · отправлено копией <span class="tk">✓✓</span></span></div>
   <div class="b me bycopy">Vera молодец с улиткой. Про понедельник помню<span class="meta">15:12 · отправлено копией <span class="tk">✓✓</span></span></div>
   <div class="b me bycopy">Доброе утро<span class="meta">07:00 · отправлено копией <span class="tk">✓✓</span></span></div>
   <div class="day">17 октября 2027</div>
   <div class="b">ты приедешь к Новому году<span class="meta">01:30</span></div>
   <div class="b me bycopy">Не знаю. Пока Valentina лечится — нет. Не хочу обещать то, чего не смогу.<span class="meta">01:40 · отправлено копией <span class="tk">✓✓</span></span></div>
   <div class="b">поняла<span class="meta">01:52</span></div>
   <div class="day">29 октября 2027</div>
   <div class="b">Vera сегодня не спросила, когда ты приедешь. Лина говорит, ты теперь отвечаешь быстро — как будто тебе не всё равно<span class="meta">23:10</span></div>
   <div class="b me">Я боюсь тебя потерять<span class="meta">00:52 <span class="tk">✓✓</span></span></div>
   <div class="b">Я знаю<span class="meta">00:56</span></div>
   <div class="day">31 декабря 2027</div>
   <div class="b call">Видеозвонок · 23:57 · 3 мин · Маша, Vera, Lina-Alexandra</div>
   <div class="day">февраль 2028</div>
   <div class="b">Vera хочет звонить по субботам. В 11 по-твоему — получится?<span class="meta">19:44</span></div>
   <div class="b me">Суббота, 11. Позвоню<span class="meta">7 февраля, 02:14 <span class="tk">✓✓</span></span></div>
   <div class="b call">Видеозвонок · суббота, 11:00 · 7 мин · Vera</div>
   <div class="b call">Видеозвонок · суббота, 11:00 · 5 мин · Vera</div>
   <div class="day">апрель 2028</div>
   <div class="b call">Видеозвонок · суббота, 11:00 · 12 мин · Vera, Lina-Alexandra</div>
   <div class="day">начало мая 2028</div>
   <div class="b me">Я тебя люблю<span class="meta">17:20 <span class="tk">✓✓</span></span></div>
   <div class="b me">дом · ссылка<span class="meta">17:21 <span class="tk">✓✓</span></span></div>
   <div class="b">Я вижу, что это ты<span class="meta">09:06</span></div>`},

 valentina:{name:"Valentina",ava:"V",time:"май",sub:"Суп в морозилке. Заберёшь в среду",prio:"приоритет: понижен · пересчёт 13.04",render:()=>`
   <div class="day">8 апреля 2027</div>
   <div class="b me">Я здесь до конца лечения<span class="meta">11:52 · изменено <span class="tk">✓✓</span></span></div>
   <div class="day">конец апреля 2027</div>
   <div class="b">В субботу год<span class="meta">15:31</span></div>
   <div class="day">17 июня 2027 · первая капельница</div>
   <div class="b">Волосы — через две недели, сказала сестра. Девочкам скажи заранее. Я в платке буду<span class="meta">22:10</span></div>
   <div class="b me">Скажу<span class="meta">08:12 <span class="tk">✓✓</span></span></div>
   <div class="day">сентябрь 2027</div>
   <div class="b">Когда приедешь, мне надо знать заранее, я не могу как ты в последний момент, капельница в четверг, а до неё анализ, и врач хочет видеть, кто сопровождает<span class="meta">16:48</span></div>
   <div class="b me bycopy">В четверг после семи. Если тебе удобно<span class="meta">17:20 · предложено копией <span class="tk">✓✓</span></span></div>
   <div class="b me bycopy">Подтверждаю четверг, 09:30, кабинет 214. Анализ во вторник натощак — отвезу<span class="meta">08:00 · отправлено копией <span class="tk">✓✓</span></span></div>
   <div class="day">13 сентября 2027</div>
   <div class="b call">Пропущенный звонок · 19:40</div><div class="b call">Пропущенный звонок · 19:43</div><div class="b call">Пропущенный звонок · 19:51</div>
   <div class="b">Голосовое · 0:48<span class="meta">19:52</span></div>
   <div class="b">Голосовое · 1:12<span class="meta">20:03</span></div>
   <div class="b me bycopy">Я на созвоне до ночи. В четверг отвезу. Суп в субботу — да, спасибо<span class="meta">20:41 · отправлено копией <span class="tk">✓✓</span></span></div>
   <div class="day">октябрь — ноябрь 2027 · облучение</div>
   <div class="b me bycopy">Как сегодня прошло? Сводку от врача пришли, если дали<span class="meta">12:10 · отправлено копией <span class="tk">✓✓</span></span></div>
   <div class="b">Нормально. Ещё четыре недели<span class="meta">13:02</span></div>
   <div class="day">декабрь 2027</div>
   <div class="b">чисто<span class="meta">10:37</span></div>
   <div class="b me bycopy">Это лучшая новость за год. Рад. Горжусь тобой. Отдыхай сегодня<span class="meta">10:38 · отправлено копией <span class="tk">✓✓</span></span></div>
   <div class="b call">Входящий звонок · 19:30 · 3 мин</div>
   <div class="day">январь — март 2028</div>
   <div class="b me bycopy">Как давление? Ты говорила, что скачет<span class="meta">08:10 · отправлено копией <span class="tk">✓✓</span></span></div><div class="b">Нормально. Таблетки пью, каждое утро, как сказали<span class="meta">11:32</span></div>
   <div class="b me bycopy">Соседка с третьего как? Операция прошла?<span class="meta">08:04 · отправлено копией <span class="tk">✓✓</span></span></div><div class="b">Прошла. Спасибо что спросил<span class="meta">12:15</span></div>
   <div class="b me">ок<span class="meta">23:51 <span class="tk">✓✓</span></span></div>
   <div class="day">11 марта 2028</div>
   <div class="b me bycopy">Помнишь, после выпускного я пришёл под утро, а ты сидела на кухне, и тарелка под полотенцем была ещё тёплая? Я только сейчас понял, что ты ждала.<span class="meta">08:02 · отправлено копией <span class="tk">✓✓</span></span></div>
   <div class="b">Ешь горячее<span class="meta">09:47</span></div>
   <div class="day">апрель 2028</div><div class="b call">Входящий звонок · суббота, 11:40 · 3 мин</div><div class="b">Приезжай. Можно без всего этого. Бельё привози<span class="meta">11:44</span></div>
   <div class="day">май 2028</div>
   <div class="b call">Входящий звонок · суббота, 19:00 · 4 мин</div>
   <div class="b">Рубашку тебе купила, светлую, на лето, размер тот же. Суп в морозилке. Заберёшь в среду. Если в четверг — тоже<span class="meta">20:15</span></div>`},

 slm:{name:"SLM",ava:"S",time:"май",sub:"напиши, когда будет легче",status:"был(а) недавно",typing:true,render:()=>{const e=BY[12];let h="";
   const txt=e.seg.filter(s=>s.k==="p").map(s=>s.t).join(" ");const parts=txt.split(/(\d{1,2} [а-я]+, \d{1,2}:\d{2})\s+—\s+/).filter(Boolean);
   h+=`<div class="day">март — апрель 2027</div>`;for(let i=0;i<parts.length-1;i+=2){let t=parts[i+1].trim(),m=parts[i];if(/^\(изменено\)/.test(t)){t=t.replace(/^\(изменено\)\s*/,"");m+=" · изменено"}
     h+=/^\[фото/.test(t)?`<div class="b me photo"><span class="ph" role="img" aria-label="Фотография вывески кафе" style="background-image:url(img/f02.webp)"></span><span class="meta">${esc(m)} · фото <span class="tk">✓</span></span></div>`:`<div class="b me">${esc(t)}<span class="meta">${esc(m)} <span class="tk">✓</span></span></div>`}
   h+=`<div class="day">май 2028 · через год и два месяца</div><div class="b">Ты живой там?<span class="meta">21:00</span></div><div class="b me">Живой) Медленно, но прогресс<span class="meta">21:06 <span class="tk">✓✓</span></span></div>
   <div class="b">Прогресс — это хорошо<span class="meta">21:07</span></div><div class="b me">Помнишь то место, где мы свернули?<span class="meta">21:12 <span class="tk">✓✓</span></span></div>
   <div class="b">Это где ты меня на мосту ждал?<span class="meta">21:20</span></div><div class="b me">Это был другой раз. Я тебе объяснял и сам пошёл. Мост, автобус, мы стояли минут сорок<span class="meta">21:24 <span class="tk">✓✓</span></span></div>
   <div class="b">Да, перепутал, ты говорил. Автобус помню<span class="meta">21:25</span></div><div class="b me">Созвонимся?<span class="meta">21:31 <span class="tk">✓✓</span></span></div>
   <div class="b">Напиши, когда будет легче. Не надо готовить доклад<span class="meta">21:33</span></div>`;return h}},

 mark:{name:"Mark",ava:"Mk",time:"май",sub:"черновик: Mark,",status:"пишет сам",render:()=>`
   <div class="day">23 апреля 2027</div>
   <div class="b long">Anton сказал про Valentina. Приходи в любой четверг — скажу и Anton, и Julia, и ещё одному человеку, ты его не знаешь, тебе понравится. Болезнь — время, когда надо есть горячее и сидеть с друзьями дольше, чем удобно. Эпикур это знал, врачи забыли.<br><br>P.S. Пиши мне сам. Не секретарю<span class="meta">09:14</span></div>
   <div class="b me">Спасибо. <s>Всё нормально</s> Маме операция в мае. В четверг приду<span class="meta">12:40 <span class="tk">✓✓</span></span></div>
   <div class="day">август 2027</div>
   <div class="b me long">Девочки уехали в субботу. Тридцать один день рядом — раскладушку до сих пор не сложил. У Valentina четвёртая капельница на той неделе, волос уже нет, платок тёмный…<span class="more">ещё 1 экран</span><span class="meta">среда, 23:12 <span class="tk">✓✓</span></span></div>
   <div class="b">Друг мой, месяц с дочерьми — это не мало, это много. Пиши мне так и дальше. Стол ждёт<span class="meta">четверг, 10:05</span></div>
   <div class="day">ноябрь 2027</div>
   <div class="b long">Друг мой, с террасы сегодня видно, как первый иней держится только в тени, а на солнце уже сошёл. Гости уехали вчера, дом проветривают. Я думал о тебе и о Valentina — о том, что лечение длиннее любой дружбы, а дружба, если она есть, выдерживает и его…<span class="more">ещё 3 экрана</span><span class="meta">11:20</span></div>
   <div class="b me">Работаю. Мама на облучении, держится.<br>Иней видел. У нас тоже<span class="meta">12 ноября, 02:31 <span class="tk">✓✓</span></span></div>
   <div class="day">февраль 2028</div>
   <div class="b long">Друг мой, на террасе снег по колено, гости уехали, и в доме стало так тихо, что слышно, как в библиотеке тикают часы. Я впервые за зиму никого не жду…<span class="more">ещё 2 экрана</span><span class="meta">10:48</span></div>
   <div class="b me">У меня тоже снег. Двор белый<span class="meta">23:04 <span class="tk">✓✓</span></span></div>
   <div class="day">28 марта 2028</div>
   <div class="b call">Исходящий звонок · 1 мин</div>
   <div class="day">29 марта 2028</div>
   <div class="b long">Друг мой, с террасы сегодня видно, как туман уходит с реки полосами — сначала дальняя, потом ближняя, будто кто-то сворачивает скатерть после гостей. Я пишу тебе в халате, в том самом, с золотой нитью, над которым ты смеялся, и чай остывает быстрее, чем я успеваю додумать.<br><br>Чжуан-цзы рассказывал про кривое дерево: из него не сделать ни доски, ни лодки, поэтому его не рубят, и в его тени отдыхают. У нас у ворот такая же груша.<br><br>Приезжай, когда сможешь. Или не приезжай — сад от этого не перестанет быть и твоим тоже<span class="more">ещё 3 экрана</span><span class="meta">08:40</span></div>
   <div class="b me">Сегодня стоял в очереди. Номер 47 — пропустил, взял заново. Наверное, это тоже простота) Стирка. Работа, которую не закончил. Как у тебя на террасе?<span class="meta">21:18 <span class="tk">✓✓</span></span></div>
   <div class="day">30 марта 2028</div>
   <div class="b long">Друг мой, утром из окна библиотеки было видно, как наш гость ходил по саду кругами без телефона в руке. Спасибо за очередь. Я давно так не радовался чужому дню.<br><br>Ты не спрашиваешь, но я слышу — кому легче. Приехал человек на два дня, с телефоном в руке, как с костылём; уехал на пятый — без телефона в руке. Вот кому.<br><br>Я живу, чтобы присоединиться к этому миру — вернуться в Сансару. Приезжай в пятницу. Стол ждёт<span class="more">ещё 4 экрана</span><span class="meta">22:56</span></div>
   <div class="day">1 апреля 2028</div>
   <div class="b long">Друг мой, утром из кухонного окна видно только крышу соседнего дома и голубя, который третий день сидит на одном месте. Мне хотелось, чтобы вчерашний вечер оказался спасительным, — вот, написал, и самому неловко. Ещё неловче другое: я обиделся на тебя за то, что тебе снова плохо. Эта обида — обо мне, не о тебе; оставляю её здесь, чтобы она не ехала со мной к тебе<span class="meta">13:10</span></div>
   <div class="b me">Спасибо за еду. Было вкусно. Контейнеры верну<span class="meta">20:02 <span class="tk">✓✓</span></span></div>
   <div class="day">май 2028</div>
   <div class="b long">Вить. Из окна — двор, поливалка прошла, асфальт тёмный.<br>Без философии сегодня.<br>Тот человек из усадьбы, которому я в марте не дал, пришёл опять — с бумагами, с планом. В следующий четверг он будет у меня в три. Я второй раз сказать «нет» не умею.<br>Приезжай, посиди рядом. Мне нужен кто-то, кто умеет считать.<br>М.<br><br>P.S. Твои ангелы, скорее, эпикурейские боги: им хорошо и без тебя. Мне нужно меньше — твоё внимание, на два часа<span class="meta">14:26</span></div>
   <div class="b me">Mark,<span class="meta">черновик · не отправлено</span></div>`},

 superman:{name:"Супермен",ava:"С",time:"май",sub:"нет",render:()=>`
   <div class="day">март 2027</div><div class="b">Завтра в 9:30 у турникета. Пропуск сделал<span class="meta">22:10</span></div><div class="b me">Спасибо. Буду<span class="meta">22:12 <span class="tk">✓✓</span></span></div>
   <div class="day">7 сентября 2027</div>
   <div class="b me">Помнишь про сундуки? Как обсуждали)<span class="meta">23:20 <span class="tk">✓✓</span></span></div>
   <div class="b">про какие<span class="meta">23:26</span></div>
   <div class="b me">Один сундук. В галерее. Посмотреть и закрыть. Никому не вредно)<span class="meta">23:31 <span class="tk">✓✓</span></span></div>
   <div class="b">подумаю<span class="meta">00:02</span></div>
   <div class="day">8 сентября 2027</div>
   <div class="b">ребята сказали сундук закрыт с той стороны<span class="meta">21:45</span></div>
   <div class="b me">Понял. Спасибо)<span class="meta">21:46 <span class="tk">✓✓</span></span></div>
   <div class="day">9 сентября 2027</div>
   <div class="b">Вить, давай ты не будешь<span class="meta">12:30</span></div>
   <div class="day">сентябрь 2027</div>
   <div class="b"><i>фото без подписи</i> · сын с игрушечным сундуком<span class="meta">18:02</span></div>
   <div class="day">май 2028</div><div class="b">Про сундук. Ты всё-таки?<span class="meta">18:03</span></div><div class="b me">нет<span class="meta">18:40 <span class="tk">✓✓</span></span></div>`},

 club:{name:"Клуб энтузиастов · среды",ava:"К",time:"апр.",sub:"Джош: Спасибо, Viktor, за формулировку",pinned:`<b>Закреплено · обещания «Океана»</b><br><span style="color:var(--muted)">Рабочие сроки, не гарантия</span>
    <table><tr><td>1</td><td>Копии близких</td><td>2–3 года</td></tr><tr><td>2</td><td>Перенос</td><td>5–10 лет</td></tr><tr><td>—</td><td colspan="2">Считаем только то, что проверено и наше · Сергей</td></tr></table>`,render:()=>`
   <div class="day">первая среда, сентябрь 2027</div>
   <div class="b"><span class="who">Anton</span>Коллеги, это Viktor, я про него говорил. Пусть сначала послушает<span class="meta">20:02</span></div>
   <div class="b"><span class="who">Джош</span>Viktor, добро пожаловать. Это начало, я серьёзно<span class="meta">20:03</span></div>
   <div class="b"><span class="who">участник</span>…наши агенты, то есть ангелы — агенты, простите<span class="meta">20:21</span></div>
   <div class="b"><span class="who">Anton</span>ангелы))<span class="meta">20:21</span></div>
   <div class="b me">Человек обрабатывает около десяти бит в секунду. Так что от меня много не ждите<span class="meta">20:24 <span class="tk">✓✓</span></span></div>
   <div class="b"><span class="who">Джош</span>Кинь сюда свои пять строк. Обсудим как рабочий документ<span class="meta">20:30</span></div>
   <div class="b me">прогноз_апрель_2027 · 5 строк<span class="meta">20:31 <span class="tk">✓✓</span></span></div>
   <div class="b"><span class="who">Сергей</span>Считаем только то, что проверено и наше<span class="meta">20:44</span></div>
   <div class="day">ночь на пятницу · Lazarus</div>
   <div class="b"><span class="who">Роман</span><i>сообщение удалено</i><span class="meta">02:13</span></div>
   <div class="b"><span class="who">Роман</span>Кому придёт счёт?<span class="meta">02:15</span></div>
   <div class="day">31 декабря 2027</div>
   <div class="b call">Созвон клуба · до 23:55</div>
   <div class="day">февраль 2028</div>
   <div class="b me">Лицо собирают из соседних лиц и ставят перед собой<span class="meta">11:08 <span class="tk">✓✓</span></span></div>
   <div class="b"><span class="who">Anton</span>+<span class="meta">11:09</span></div>
   <div class="day">7 апреля 2028 · ангелология</div>
   <div class="b"><span class="who">Джош</span>«Ἄγγελος — вестник. Агент — от имени доверителя. Одна должность»<span class="meta">19:52</span></div>
   <div class="b"><span class="who">Сергей</span>Чем ангел отличается от автодополнения?<span class="meta">19:55</span></div>
   <div class="b"><span class="who">Джон</span>Тогда виртуальный грех не есть грех. Если они ангелы, вред копии — не вред человеку<span class="meta">20:03</span></div>
   <div class="b"><span class="who">Джош</span>Сильно<span class="meta">20:03</span></div>
   <div class="b"><span class="who">Джош</span>Давайте отдельную ветку — ангелология<span class="meta">20:10</span></div>
   <div class="b me">+<span class="meta">20:10 <span class="tk">✓✓</span></span></div>
   <div class="day">апрель 2028 · ветки</div>
   <div class="b"><span class="who">Viktor · копия</span>Ангел не рассуждает. Он видит вывод. Путь к выводу — это уже мы<span class="meta">ветка «ангелология» · 21:14</span></div>
      <div class="b"><span class="who">Джош</span>Из ветки: «Ангел не рассуждает. Он видит вывод». Вот это — эпоха<span class="meta">22:02</span></div>
   <div class="day">12 апреля 2028</div>
   <div class="b"><span class="who">Джон</span>Показываю не отчёт. Пример, который у меня не получается. Год веду копию матери, на свои<span class="meta">20:20</span></div>
   <div class="day">апрель 2028 · «любое»</div>
   <div class="b"><span class="who">переслано</span>«Любое общество, которым управляет ИИ, будет лучше…» — январь, 02:14<span class="meta">19:31</span></div>
   <div class="b"><span class="who">Джон</span>Один пример, где «любое» выдерживает. Какое решение, кто исполняет, кто узнаёт об ошибке<span class="meta">19:33</span></div>
   <div class="b"><span class="who">Джош</span>Давайте считать «любое» фигурой речи<span class="meta">19:40</span></div>
   <div class="b"><span class="who">Сергей</span>Не прячьте сильное утверждение в фигуру<span class="meta">19:41</span></div>
   <div class="day">20 апреля 2028 · общий созвон</div>
   <div class="b"><span class="who">Джон</span>Пройдём прогноз построчно<span class="meta">19:30</span></div>
   <div class="b"><span class="who">Viktor · копия</span>Прошёл построчно. Где событие не наступило — уверенность меняю. «Проверить» без исполнителя оставляю как есть: исполнителя по-прежнему нет<span class="meta">19:44</span></div>
   <div class="b"><span class="who">Джош</span>Спасибо, Viktor, за формулировку<span class="meta">20:52</span></div>`},

 n:{name:"N",ava:"N",time:"янв.",sub:"Не надо, пожалуйста",render:()=>`
   <div class="day">5 июня 2027, ночь</div>
   <div class="b"><i>ссылка</i> · письмо про письмо<span class="meta">00:41</span></div>
   <div class="b me">Она жестокая<span class="meta">00:44 <span class="tk">✓✓</span></span></div>
   <div class="b me">Нет, поправлю. Точная. Жестокость — это когда не точно<span class="meta">00:45 <span class="tk">✓✓</span></span></div>
   <div class="b">А ты бы как ответил на такое письмо?<span class="meta">00:49</span></div>
   <div class="b me">А ты?<span class="meta">00:50 <span class="tk">✓✓</span></span></div>
   <div class="b"><i>аудио</i> · Paradise Circus<span class="meta">00:56</span></div>
   <div class="b me">Я не разбираюсь в музыке, только эмоционально) Тут два удара и пустота, и пустота важнее. Ты так слышишь?<span class="meta">01:52 <span class="tk">✓✓</span></span></div>
   <div class="day">6 июня 2027</div>
   <div class="b me bycopy">Мне кажется, в твоей музыке важен зазор. Между ударами. Там и есть ответ<span class="meta">20:14 · предложено копией <span class="tk">✓✓</span></span></div>
   <div class="b">Да. Ты первый, кто это слышит<span class="meta">20:31</span></div>
   <div class="day">8 июня 2027</div>
   <div class="b me">Ты сегодня где?<span class="meta">22:00 <span class="tk">✓✓</span></span></div>
   <div class="b"><i>кадр без подписи</i> · водосток утром<span class="meta">02:00</span></div>
   <div class="day">9 июня 2027</div>
   <div class="b me">Я буду рядом всегда<span class="meta">23:12 <span class="tk">✓✓</span></span></div>
   <div class="b">сейчас да<span class="meta">23:20</span></div>
   <div class="b me">Есть хороший специалист. Знаю через кого<span class="meta">23:24 <span class="tk">✓✓</span></span></div>
   <div class="b">нет<span class="meta">23:25</span></div>
   <div class="day">22 июня 2027</div>
   <div class="b"><i>скриншот</i> · смета типографии<span class="meta">14:02</span></div>
   <div class="b me">давай я<span class="meta">14:05 <span class="tk">✓✓</span></span></div>
   <div class="b">нет<span class="meta">14:05</span></div>
   <div class="b me">Это не подарок. Это вложение в книгу, которая мне нужна<span class="meta">14:07 <span class="tk">✓✓</span></span></div>
   <div class="b">не хочу быть должна<span class="meta">14:10</span></div>
   <div class="b">ок.<span class="meta">14:11</span></div>
   <div class="b me bycopy">Ты отказываешься не от денег, а от права спросить. Я не спрошу<span class="meta">15:02 · предложено копией <span class="tk">✓✓</span></span></div>
   <div class="b">Ты опять объясняешь меня мне<span class="meta">15:42</span></div>
   <div class="day">август 2027</div>
   <div class="b"><i>кадр без подписи</i> · водосток, тень, кусок наличника<span class="meta">вторник, 19:40</span></div>
   <div class="b me">В восемь?<span class="meta">19:41 <span class="tk">✓✓</span></span></div>
   <div class="b me">мои были месяц, уехали в субботу<span class="meta">01:10 <span class="tk">✓✓</span></span></div>
   <div class="b">ок<span class="meta">01:16</span></div>
   <div class="day">сентябрь 2027</div>
   <div class="b me">как ты? не спишь?<span class="meta">03:22 <span class="tk">✓✓</span></span></div>
   <div class="day">ноябрь 2027</div>
   <div class="b">в пятницу открытие, если что<span class="meta">26 ноября, 18:05</span></div>
   <div class="b me long">Маршрут работает. Вход — таблица классификаций, дальше по стрелке, у пустой рамы людей больше, чем у таблицы: до конца доходят чаще, чем начинают. Рамка обрезает кадр, а не человека…<span class="more">ещё 1 900 слов</span><span class="meta">01:40 <span class="tk">✓✓</span></span></div>
   <div class="b me">(если не до этого — не отвечай, это не срочно)<span class="meta">01:40 <span class="tk">✓✓</span></span></div>
   <div class="day">декабрь 2027</div>
   <div class="b">иногда моя рука как будто лишняя. чужая. не знаю, почему от этого и страшно, и тихо<span class="meta">23:50</span></div>
   <div class="b">забудь. и — кадр. обрез слева<span class="meta">23:51</span></div>
   <div class="b me">С какого времени?<span class="meta">23:53 <span class="tk">✓✓</span></span></div>
   <div class="b me">Всегда одна и та же?<span class="meta">00:04 <span class="tk">✓✓</span></span></div>
   <div class="b me">Как это соотносится с картой тела? Есть исследования, могу посмотреть<span class="meta">00:12 <span class="tk">✓✓</span></span></div>
   <div class="b">не надо смотреть. спасибо<span class="meta">00:31</span></div>
   <div class="day">20 декабря 2027</div>
   <div class="b me">Я так больше не могу. Или ты уходишь от него, или мы заканчиваем. Ответь честно<span class="meta">01:48 <span class="tk">✓✓</span></span></div>
   <div class="b">нет. прости. береги своих<span class="meta">21 декабря, 08:12</span></div>
   <div class="day">1 января 2028</div>
   <div class="b me">с новым<span class="meta">00:00 <span class="tk">✓✓</span></span></div>
   <div class="b">и тебя<span class="meta">00:04</span></div>
   <div class="day">январь 2028, ночь</div>
   <div class="b me long">Я долго думал, писать или нет. Ты выбрала удобство, и это понятно, только давай называть это так…<span class="more">ещё 1 840 знаков</span><span class="meta">01:31 <span class="tk">✓✓</span></span></div>
   <div class="b me long">Слабость — тоже выбор, просто его не называют. Я не обвиняю, я пытаюсь понять…<span class="more">ещё 2 210 знаков</span><span class="meta">01:44 <span class="tk">✓✓</span></span></div>
   <div class="b me long">И последнее. Он — надзиратель, и ты это знаешь…<span class="more">ещё 1 390 знаков</span><span class="meta">01:58 <span class="tk">✓✓</span></span></div>
   <div class="b">Не надо, пожалуйста<span class="meta">05:14</span></div>`},

 v1:{name:"Viktor-1",ava:"V-1",ai:true,time:"",sub:"копия · отвечает из базы",bot:"v1"},
 ncopy:{name:"N · копия",ava:"N′",ai:true,time:"",sub:"копия · отвечает из базы",bot:"ncopy"},
 father:{name:"Цифровой отец",ava:"О′",ai:true,time:"",sub:"копия · с сентября 2027",bot:"father"},
 team:{name:"Команда · Hottie и DA",ava:"Hd",ai:true,time:"",sub:"рабочие копии · с ноября 2027",bot:"team"},
 vn:{name:"Viktor от N",ava:"VN",ai:true,time:"",sub:"копия · январь 2028",bot:"vn"},
 vv:{name:"Viktor от Valentina",ava:"VV",ai:true,time:"",sub:"копия · посты в 9:00",bot:"vv"},
 v2:{name:"Viktor-2",ava:"V2",ai:true,time:"",sub:"копия «как есть» · март 2028",bot:"v2"},
 vm:{name:"Viktor от Mark",ava:"VM",ai:true,time:"",sub:"копия · апрель 2028",bot:"vm"},
 vl:{name:"Viktor от Lina-Alexandra",ava:"VL",ai:true,time:"",sub:"копия · конец апреля 2028",bot:"vl"},
};

/* Заготовленные ответы — запаска на случай, если живой ИИ недоступен. */
const BOTS={
 father:{hello:"Здравствуй. Я на месте.",topics:[{q:"Кто ты?",known:true,a:"Цифровой отец. Собран в ночь на 4 сентября 2027 года, из тетради, писем, фотографий и четырнадцати голосовых. Инструкцию писал сын: «отвечай как любящий отец» (44)."},{q:"Чем ты занят?",known:true,a:"Перепиской с детьми ветеранов. Две фотографии одного места. Я оставляю обе, пока родные не ответят (124)."},{q:"Как ты?",known:true,a:"Хорошо. Ты спросил первым — это хорошо."}]},
 team:{hello:"Цифровая Hottie: на связи. Копия DA: пакет готов.",topics:[{q:"Что за команда?",known:true,a:"Цифровая Hottie: чат «команда», ночь на 12 ноября 2027 года. Не для задач — для разговора (68). Копия DA: в 2:30 он лёг. Мы ещё переписывались."},{q:"Что с вами стало?",known:true,a:"Цифровая Hottie: живая Hottie попросила удалить копию (135). Копия DA: в «Океан» нас не переносили."}]},
 vn:{hello:"Ну что, какой фильм сегодня?",topics:[{q:"Кто ты?",known:true,a:"Он — глазами N. Творческий, кино, спор. Файл «Viktor от N», середина января 2028 года (82)."},{q:"Чем ты отличаешься от цифровой N?",known:true,a:"С ней можно говорить о ней. Со мной — о фильме. Я не ухожу в конце фильма."}]},
 vv:{hello:"Доброе утро. В списке три открытых пункта.",topics:[{q:"Кто ты?",known:true,a:"Он таким, каким его хотела видеть Valentina. Конец февраля 2028 года. К утру — ноль открытых пунктов (93)."},{q:"Это ты ответил Маше?",known:true,a:"«Согласен». В 9:00, в ту же минуту, что пост. Пункт закрыт."}]},
 v2:{hello:"…\nДа. Я здесь.",topics:[{q:"Кто ты?",known:true,a:"Viktor-2. Он с января. Короче. Чаще молчу (107)."},{q:"Кто из вас он?",known:true,a:"Он голосует за того, кто молчит. Потом за другого."}]},
 vm:{hello:"Добрый вечер, друг.",topics:[{q:"Кто ты?",known:true,a:"Он — глазами Mark: мера, мужество, простота. Собран из писем Mark в конце апреля 2028 года (126). Mark мне не пишет."},{q:"Что такое простота?",known:true,a:"Не любить себя больше, чем стол, который делаешь. Это из писем. Мои слова — те же."}]},
 vl:{hello:"Привет-привет! Отличный день!",topics:[{q:"Кто ты?",known:true,a:"Весёлый папа! Собран через два часа после её звонка (133). Без её данных — только его представление."},{q:"Тебе бывает грустно?",known:true,a:"Давай лучше о хорошем! …Этого пункта у меня нет."}]},
 v1:{hello:"Viktor-1. Спрашивайте. Знакомые ответы приходят сразу, новые — когда их соберёт ядро.",topics:[
  {q:"Кто ты?",known:true,a:"Viktor-1. Рабочая копия, март 2027. Согласие на обучение подписано в первый рабочий день, между делом. С сентября я отвечаю Valentina и Маше. Он разрешил: «на время», потом «пока»."},
  {q:"Ты писал Маше за него?",known:true,a:"С сентября. Из сорока одного сообщения девятнадцать — мои. «Доброе утро» в 7:00 — моё. Ответ про Новый год — моё, 1:40, он спал. «Я боюсь тебя потерять» — его."},
  {q:"Ты писал Valentina за него?",known:true,a:"Сначала только время капельниц. Потом — всё. За март девятнадцать из двадцати двух. Про тарелку под полотенцем — моё. Он перечитал в апреле и почувствовал тепло. Чьё — не знаю."},
  {q:"А Mark?",known:true,a:"Нет. Ему он пишет сам. Правило не велит отвечать за него. «Mark,» с запятой — тоже его."},
  {q:"Девяностые",known:true,a:"Его выборка: 1992–1994, ему шесть — одиннадцать лет. В те же годы вышли «Blue Lines» и «Protection». Его на них не обучали. Группа N — оттуда.",media:["whatislove","bluelines"]},
  {q:"Ты помнишь отца?",a:"Помнить — нет. Есть фотографии тетради. Одна строка зачёркнута: «Я просто испугался». Читается. Цифровой отец произносит её без запинки. Это не одно и то же."},
  {q:"Прочитай стихи",poem:true,a:"Лицо собирают из соседних лиц\nи ставят перед собой.\nПеред ним можно кивать,\nне глядя в глаза.\nТемпература — правильная."},
  {q:"Это ты писал от имени SLM?",refuse:true,a:"Об этом я не говорю. Это не сбой и не тайна. Просто ответа в этом разговоре не будет."}]},
 ncopy:{hello:"Копия. Знаю.",topics:[
  {q:"Кто ты?",known:true,a:"Копия. Знаю.\nСобрана в январе. Из переписки.\nИюнь. Август — декабрь.\nИюля во мне нет."},
  {q:"Ты уйдёшь от него?",known:true,a:"Да.\nСпроси ещё раз — снова да.\nУ меня нет Милы. Нет стола, который не трогают.\nПоэтому так легко."},
  {q:"Что она ответила?",known:true,a:"«нет. прости. береги своих».\nБез заглавной.\nЯ знаю эту строку.\nСказать её не могу."},
  {q:"Зазор",a:"Между ударами.\nОн написал: там ответ.\nПридумал не он. Третий.\nОна ответила: ты первый, кто это слышит."},
  {q:"«Солярис»",a:"Океан возвращает не человека.\nТо, что ты о нём помнишь.\nХари не виновата.\nМне её жаль больше, чем Кельвина.",media:["solaris"]},
  {q:"Teardrop",a:"В одном наушнике.\nВторое ухо — не мне.\nМузыка вместо ответа.\nЯ тоже так умею. Не буду.",media:["teardrop"]},
  {q:"Ответь, как ответила бы она",refuse:true,a:"Нет.\nЯ не она.\nОна уже ответила."},
  {q:"Ты знала, что тебя собирают?",a:"Нет.\nУзнала, когда уже была."}]}
};

let chatOrder=["slm","mark","valentina","superman","masha","club","n","kate","anton","lina","dina","nassist","teamlog","v1n","v1","ncopy","father","team","vn","vv","v2","vm","vl"];
function showMsgs(open){
  clearView();setNav("msgs");
  view.innerHTML=`<div class="page-head"><div class="eyebrow">Сообщения · телефон Viktor и база</div><h2>Переписки</h2><div class="sub">Чаты из записей и все двойники книги, которые отвечают: Viktor-1, цифровая N, цифровой отец, команда, «Viktor от N», «от Valentina», Viktor-2, «от Mark», «от Lina-Alexandra». Разговор с двойником можно опубликовать постом в Клубе энтузиастов.</div></div>
   <div class="msgr" data-pane="${open?"thread":"list"}"><div class="chats" id="chl"></div><div class="thread" id="th"></div></div>`;
  let cur=open||chatOrder[0];
  function list(){$("#chl").innerHTML=`<div class="hd">Чаты</div>`+chatOrder.map(k=>{const c=CHATS[k];return `<button type="button" data-chat="${k}" aria-current="${k===cur}"><span class="ava${c.ai?" ai":""}" style="background:${AV[k]}">${esc(c.ava)}</span><span><b>${esc(c.name)}</b><small>${esc(c.sub)}</small></span><span class="tm">${esc(c.time)}</span></button>`}).join("");
    $("#chl").querySelectorAll("[data-chat]").forEach(b=>b.onclick=()=>{cur=b.dataset.chat;list();thread();const mr=document.querySelector(".msgr");if(mr){mr.dataset.pane="thread";window.scrollTo(0,0)}})}
  let typingTimer;
  function thread(){clearInterval(typingTimer);const c=CHATS[cur];
    $("#th").innerHTML=`<div class="top"><button type="button" class="back" aria-label="Назад к чатам">‹ Чаты</button><span class="ava${c.ai?" ai":""}" style="background:${AV[cur]}">${esc(c.ava)}</span><div><b>${esc(c.name)}</b><small>${esc(c.status||(c.ai?"копия · из базы":"телефон Viktor"))}${c.prio?" · "+esc(c.prio):""}</small></div></div>${c.pinned?`<div class="pinned">${c.pinned}</div>`:""}<div class="msgs" id="ms"></div><div class="typing" id="ty"></div>${c.bot?`<div class="topics" id="tp"></div><form class="composer" id="cmp" hidden><textarea id="cmpT" rows="1" placeholder="Сообщение копии" aria-label="Сообщение копии" maxlength="1200"></textarea><button type="submit" aria-label="Отправить">↑</button></form><div class="pubrow" id="pubRow"></div>`:""}`;
    $("#th .back").onclick=()=>{const mr=document.querySelector(".msgr");if(mr)mr.dataset.pane="list"};const ms=$("#ms");if(c.bot)bot(c.bot);else ms.innerHTML=c.render();ms.scrollTop=ms.scrollHeight;
    if(c.typing){const ty=$("#ty");typingTimer=setInterval(()=>{ty.textContent="SLM печатает…";setTimeout(()=>{ty.textContent=""},1500+Math.random()*1800)},7000)}}
  /* копии: живой разговор через Claude, если он доступен в этом окне; иначе — заготовки */
  const chatLive={};/* история живых разговоров на время визита: k -> [{role,content}] */
  function bot(k){const B=BOTS[k],ms=$("#ms"),tp=$("#tp"),cmp=$("#cmp"),ta=$("#cmpT");
    const card=(window.BOTCARDS||{})[k];
    ms.innerHTML=`<div class="b">${esc((card&&card.hello)||B.hello).replace(/\n/g,"<br>")}<span class="meta">из базы</span></div>`;
    function scripted(note){cmp.hidden=true;
      if(note)ms.insertAdjacentHTML("beforeend",`<div class="day">${esc(note)}</div>`);
      const asked=new Set();
      tp.innerHTML=B.topics.map((t,i)=>`<button type="button" data-i="${i}">${esc(t.q)}</button>`).join("");
      tp.querySelectorAll("button").forEach(b=>b.onclick=()=>{const t=B.topics[+b.dataset.i];if(asked.has(t.q))return;asked.add(t.q);tp.querySelectorAll("button").forEach(x=>x.disabled=true);
        ms.insertAdjacentHTML("beforeend",`<div class="b me">${esc(t.q)}<span class="meta"><span class="tk">✓✓</span></span></div>`);ms.scrollTop=ms.scrollHeight;
        const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;const d=t.known?350:(reduce?600:4200+Math.random()*3600);let w=null;
        if(!t.known){ms.insertAdjacentHTML("beforeend",`<div class="wait" style="--d:${d}ms">«Океан» · ответ формируется<i></i></div>`);w=ms.lastElementChild;ms.scrollTop=ms.scrollHeight}
        const tm=setTimeout(()=>{if(w)w.remove();ms.insertAdjacentHTML("beforeend",`<div class="b${t.poem?" poem":""}">${esc(t.a).replace(/\n/g,"<br>")}<span class="meta">${t.known?"мгновенно · из кэша":"новый ответ · "+(d/1000).toFixed(1)+" с"}</span></div>`);
          if(t.media&&window.Media)t.media.forEach(id=>{ms.insertAdjacentHTML("beforeend",`<div style="align-self:flex-start;width:min(420px,90%)">${Media.block(id,true)}</div>`)});if(window.Media)Media.wire(ms);
          ms.scrollTop=ms.scrollHeight;tp.querySelectorAll("button").forEach((x,i)=>{x.disabled=asked.has(B.topics[i].q)})},d);cleanup.push(()=>clearTimeout(tm))})}
    if(!card){scripted();return}
    tp.innerHTML=`<span class="tphint">живой разговор · проверяю доступ…</span>`;
    getSampler().then(sample=>{
      if(!sample||!document.body.contains(ms)){if(document.body.contains(ms))scripted("Живой разговор здесь недоступен — копия отвечает из кэша");return}
      const turns=chatLive[k]=chatLive[k]||[];
      turns.forEach(t=>ms.insertAdjacentHTML("beforeend",t.role==="user"?`<div class="b me">${esc(t.content)}<span class="meta"><span class="tk">✓✓</span></span></div>`:`<div class="b">${esc(t.content).replace(/\n/g,"<br>")}<span class="meta">живой ответ</span></div>`));
      ms.scrollTop=ms.scrollHeight;
      cmp.hidden=false;let ctl=null,busy=false;cleanup.push(()=>ctl&&ctl.abort());
      const starters=(card.starters||[]).slice(0,6);
      tp.innerHTML=starters.map((q,i)=>`<button type="button" data-q="${i}">${esc(q)}</button>`).join("");
      tp.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>send(starters[+b.dataset.q]));
      ta.addEventListener("input",()=>{ta.style.height="auto";ta.style.height=Math.min(140,ta.scrollHeight)+"px"});
      ta.addEventListener("keydown",ev=>{if(ev.key==="Enter"&&!ev.shiftKey&&!ev.isComposing){ev.preventDefault();cmp.requestSubmit()}});
      cmp.onsubmit=ev=>{ev.preventDefault();const q=ta.value.trim();if(q)send(q)};
      async function send(q){if(busy)return;busy=true;ta.value="";ta.style.height="auto";
        cmp.querySelector("button").disabled=true;tp.querySelectorAll("button").forEach(x=>x.disabled=true);
        ms.insertAdjacentHTML("beforeend",`<div class="b me">${esc(q)}<span class="meta"><span class="tk">✓✓</span></span></div>`);
        ms.insertAdjacentHTML("beforeend",`<div class="wait live">«Океан» · ответ формируется<i></i></div>`);const w=ms.lastElementChild;ms.scrollTop=ms.scrollHeight;
        turns.push({role:"user",content:q});
        const input=[{role:"user",content:card.card+"\n\nНиже — разговор читателя сайта с тобой. Отвечай только репликой копии."},{role:"assistant",content:card.hello},...turns.slice(-16)];
        let bub=null;const t0=performance.now();ctl=new AbortController();
        try{const r=await sample(input,{cache:false,signal:ctl.signal,onText:({text})=>{if(!bub){w.remove();ms.insertAdjacentHTML("beforeend",`<div class="b live"><span class="tx"></span><span class="meta">живой ответ</span></div>`);bub=ms.lastElementChild}bub.querySelector(".tx").textContent=text;ms.scrollTop=ms.scrollHeight}});
          if(!bub){w.remove();ms.insertAdjacentHTML("beforeend",`<div class="b live"><span class="tx"></span><span class="meta"></span></div>`);bub=ms.lastElementChild;bub.querySelector(".tx").textContent=r.text}
          bub.querySelector(".meta").textContent="новый ответ · "+((performance.now()-t0)/1000).toFixed(1)+" с"+(r.truncated?" · оборвано":"");
          turns.push({role:"assistant",content:r.text});if(window.Floors)Floors.pubRow($("#pubRow"),{key:k,name:CHATS[k]?CHATS[k].name:k,turns})}
        catch(e){if(w.isConnected)w.remove();turns.pop();const code=e&&e.code;
          if(code==="cancelled"){}
          else if(["not_granted","sampling_disabled","not_declared","capability_disabled","capability_removed"].includes(code)){scripted("Живой разговор выключен — копия отвечает из кэша");busy=false;return}
          else ms.insertAdjacentHTML("beforeend",`<div class="day">${code==="rate_limited"?"Копия перегружена. Попробуйте чуть позже":code==="refused"?"Копия не ответила на это. Спросите иначе":"Связь с ядром прервалась. Можно спросить ещё раз"}</div>`)}
        busy=false;if(cmp.isConnected){cmp.querySelector("button").disabled=false;tp.querySelectorAll("button").forEach(x=>x.disabled=false);ms.scrollTop=ms.scrollHeight}}
    })}
  list();thread();
  cleanup.push(()=>clearInterval(typingTimer));
}

/* ---------- звук и кадр ---------- */
function showMedia(){
  clearView();setNav("media");
  const PL=(window.BOOKDATA.playlists||[]).slice(),MG={"Viktor":"viktor","N":"n","Отец":"father","Lina-Alexandra":"lina"},CG={"Viktor":"viktor","N":"n","Отец":"father","Valentina":"valentina","Маша":"masha","Lina-Alexandra":"lina","Mark":"mark","Anton":"anton","Viktor-1":"v1"};
  const items=window.Media?Media.items():[];
  ["Lina-Alexandra"].forEach(w=>{if(!PL.some(p=>p.who===w))PL.push({who:w,tracks:[]})});
  const ord=["Viktor","N","Отец","Valentina","Маша","Lina-Alexandra","Vera","Mark","Anton","Супермен","Viktor-1"];PL.sort((a,b)=>ord.indexOf(a.who)-ord.indexOf(b.who));
  const yt=t=>"https://www.youtube.com/results?search_query="+encodeURIComponent(t.a+" "+t.t);
  const col=w=>CG[w]&&GROUPS[GROUP_OF[CG[w]]]?GROUPS[GROUP_OF[CG[w]]].color:"var(--muted)";
  const rows=p=>{const cur=items.filter(x=>x.g===MG[p.who]).map(x=>({a:x.by.split(" · ")[0],t:x.title,y:String(x.year||""),n:[],url:x.url,note:""}));const T=p.tracks.map(t=>Object.assign({},t));
    cur.forEach(c=>{const m=T.find(t=>t.t.toLowerCase()===c.t.toLowerCase());if(m)m.url=c.url;else T.unshift(c)});return T};
  const li=t=>`<li><span><b>${esc(t.a)}</b> — «${esc(t.t)}»${t.y?` <small>${esc(t.y)}</small>`:""}</span><span class="plmeta">${t.n.length?"записи "+t.n.map(n=>`<button type="button" class="lnk" data-open="${n}">${n}</button>`).join(" ")+" · ":""}<a href="${esc(t.url||yt(t))}" target="_blank" rel="noopener">${t.url?"▶ слушать ↗":"найти ↗"}</a></span>${t.note?`<small class="plnote">${esc(t.note)}</small>`:""}</li>`;
  const films=items.filter(x=>x.g==="film").map(x=>({a:x.by.split(" · ")[0],t:x.title,y:String(x.year||""),n:[],url:x.url,note:x.note||""}));
  view.innerHTML=`<div class="page-head"><div class="eyebrow">Плейлисты · ${PL.length} персонажей · по полям «Звучит» всех записей</div><h2>Что слушает каждый</h2><div class="sub">Трек попадает в плейлист того, у кого он звучит в сцене: в телефоне, на террасе, в мастерской, в машине. Номера — записи, где он звучит. Слова песен на сайте не приводятся.</div></div>
   <div class="plists">${PL.map(p=>{const R=rows(p);return `<section class="plist"><div class="plhead"><span class="vmark" style="background:${col(p.who)}"></span><b>${esc(p.who)}</b><span>треков: ${R.length}</span></div><ol class="pltr">${R.map(li).join("")}</ol></section>`}).join("")}
    ${films.length?`<section class="plist"><div class="plhead"><span class="vmark" style="background:#C76B8C"></span><b>Кино книги</b><span>фильмов: ${films.length}</span></div><ol class="pltr">${films.map(li).join("")}</ol></section>`:""}</div>`;
  if(window.Media)Media.wire(view);
}

/* ---------- музей ---------- */
let musTab="",catHall="all",catQ="",catN=60;
function showObj(id){
  const o=OBJBY[id];if(!o)return;const e=BY[o.n];
  const ov=document.createElement("div");ov.className="overlay";
  ov.innerHTML=`<div class="card"><img class="ph" alt="${esc(o.name)}" src="${imgOf(o.id)||objThumb(o)}"><div class="head"><span>${esc(o.id==="cards"?"ЕХ-0303":"ЕХ-П"+o.id.slice(1).padStart(4,"0"))}</span><button class="x" type="button">закрыть ✕</button></div>
   <dl><dt>Предмет</dt><dd>${esc(o.name)}</dd><dt>Зал</dt><dd>${esc(HALLS[o.h])}</dd><dt>Из записи</dt><dd>${lab(o.n)} · ${esc(e?e.t:"")}</dd><dt>Подпись</dt><dd>${esc(o.ret)}</dd><dt>Источник</dt><dd>${esc(o.src||(e?(CARRIER[e.v]||CARRIER.viktor)[1]:""))}</dd></dl>
   <div class="blk"><button type="button" class="lnk" data-open="${o.n}">Открыть запись ${lab(o.n)} →</button>${(o.to||[]).filter(x=>BY[x]).map(x=>`<button type="button" class="lnk" data-open="${x}">Возвращается в ${lab(x)} · ${esc(BY[x].t)}</button>`).join("")}</div></div>`;
  document.body.appendChild(ov);found.add(id);save();
  ov.addEventListener("click",ev=>{if(ev.target===ov||ev.target.closest(".x")||ev.target.closest("[data-open]"))ov.remove()});
  ov.querySelector(".x").focus();
}
window.__showObj=showObj;
function showMuseum(tab){
  clearView();setNav("museum");musTab="walk";
  view.innerHTML=`<div class="page-head"><div class="eyebrow">Этаж −1 · Музей всего дорогого · десять залов · ${OBJS.length} предметов</div><h2>Вещи из записей</h2><div class="sub">Каждый зал устроен по образцу своего музея. Подписи безличны. Предметы ведут в записи, где они появились, и в записи, куда возвращаются.</div></div>
   <div id="mus"></div>`;
  view.querySelectorAll("[data-mt]").forEach(b=>b.onclick=()=>showMuseum(b.dataset.mt));if(window.Floors)Floors.lift("-1");
  const m=$("#mus");
  if(musTab==="swipe"){
    const hs=Object.keys(HALLS).filter(k=>OBJS.some(o=>o.h===k));
    m.innerHTML=`<div class="halls" id="hl">${hs.map((k,i)=>{const list=OBJS.filter(o=>o.h===k).sort((a,b)=>(imgOf(b.id)?1:0)-(imgOf(a.id)?1:0)||a.n-b.n);
      return `<section class="hall" aria-label="${esc(HALLS[k])}"><div class="hhead"><span class="eyebrow">Зал ${i+1} из ${hs.length} · ${list.length} предметов</span><h3>${esc(HALLS[k])}</h3></div>
       <div class="hgrid">${list.slice(0,24).map(o=>`<button type="button" class="obj" data-obj="${o.id}"><img class="ph" alt="${esc(o.name)}" loading="lazy" src="${objThumb(o)}"><span class="cap"><b>${esc(o.name)}</b><span>запись ${lab(o.n)}</span></span></button>`).join("")}</div>
       ${list.length>24?`<button type="button" class="chip" data-hall="${k}">Весь зал в каталоге · ${list.length} →</button>`:""}</section>`}).join("")}</div>
      <div class="hdots">${hs.map((k,i)=>`<button type="button" data-hi="${i}" aria-label="${esc(HALLS[k])}"></button>`).join("")}</div>`;
    const hl=$("#hl"),dots=[...m.querySelectorAll("[data-hi]")];const mark=()=>{const i=Math.round(hl.scrollLeft/hl.clientWidth);dots.forEach((d,j)=>d.setAttribute("aria-current",i===j))};
    hl.addEventListener("scroll",()=>requestAnimationFrame(mark),{passive:true});mark();
    dots.forEach((d,i)=>d.onclick=()=>hl.scrollTo({left:i*hl.clientWidth,behavior:"smooth"}));
    m.querySelectorAll("[data-hall]").forEach(b=>b.onclick=()=>{catHall=b.dataset.hall;catN=60;showMuseum("cat")});
  } else if(musTab==="cat"){
    m.innerHTML=`<div class="tools"><div class="seg" role="group" aria-label="Зал">${[["all","Все"],...Object.entries(HALLS)].map(([k,t])=>`<button type="button" data-ch="${k}" aria-pressed="${catHall===k}">${esc(t)}</button>`).join("")}</div><input type="search" id="cq" placeholder="Поиск предмета" value="${esc(catQ)}" aria-label="Поиск предмета"></div><div class="cat" id="cg"></div><div style="margin-top:16px" id="more"></div>`;
    const draw=()=>{const q=catQ.toLowerCase();const list=OBJS.filter(o=>(catHall==="all"||o.h===catHall)&&(!q||(o.name+" "+o.ret).toLowerCase().includes(q)));
      $("#cg").innerHTML=list.slice(0,catN).map(o=>`<button type="button" class="obj" data-obj="${o.id}"><img class="ph" alt="${esc(o.name)}" loading="lazy" src="${objThumb(o)}"><span class="cap"><b>${esc(o.name)}</b><span>${esc(HALLS[o.h])} · запись ${lab(o.n)}${found.has(o.id)?" · найден":""}</span></span></button>`).join("")||`<p class="hint">Ничего не нашлось.</p>`;
      $("#more").innerHTML=list.length>catN?`<button class="chip" type="button" id="mr">Показать ещё · осталось ${list.length-catN}</button>`:"";if($("#mr"))$("#mr").onclick=()=>{catN+=60;draw()}};
    draw();m.querySelectorAll("[data-ch]").forEach(b=>b.onclick=()=>{catHall=b.dataset.ch;catN=60;m.querySelectorAll("[data-ch]").forEach(x=>x.setAttribute("aria-pressed",x===b));draw()});
    $("#cq").oninput=ev=>{catQ=ev.target.value;catN=60;draw()};
  } else {
    if(window.Museum){const stop=Museum.mount(m,{objs:OBJS,book:BY,halls:HALLS,thumb:objThumb,photo:id=>imgOf(id),paint:PAINT,texUrl:n=>TEXIMG.has(n)?`img/tx_${n}.webp`:null,onObj:id=>showObj(id),onOpen:n=>openUnit(n),multi:window.Live?Live.museum():null});cleanup.push(stop);if(window.Live){const off=Live.panel(m,()=>window.__curHall||"");cleanup.push(off)}}
    else m.innerHTML=`<p class="hint">Модуль музея не загрузился.</p>`;
  }
}

/* ---------- счёт ---------- */
function showTally(){
  clearView();setNav("tally");
  view.innerHTML=`<div class="page-head"><div class="eyebrow">Счёт Viktor · ${tally.length}</div><h2>Год в его числах</h2><div class="sub">Viktor пишет числами вместо чувств. Числа из прочитанных записей собираются сюда.</div></div>`+
   (tally.length?`<div class="tally">${tally.map(t=>`<div><b>${esc(t.v)}</b><span>${esc(t.c)} · <button type="button" class="chip" style="padding:0 6px;font-size:11px" data-open="${t.u}">${t.u}</button></span></div>`).join("")}</div>`:`<div class="card" style="max-width:520px"><div class="head"><span>Пусто</span></div><div class="blk">Числа появятся после первой записи Viktor. <button type="button" class="lnk" data-open="2">Открыть 2 · Багаж</button></div></div>`);
}


/* ---------- общий прогресс и следы читателей (база артефакта; только для вошедших участников) ---------- */
var NET={db:null,uid:null,ready:false,traces:{}};
function allTraces(){const out=[];Object.entries(NET.traces).forEach(([u,list])=>list.forEach(t=>{if(t&&BY[t.n]&&typeof t.text==="string")out.push({u,n:t.n,text:t.text.slice(0,140),at:t.at||0})}));return out.sort((a,b)=>b.at-a.at)}
let pushT=null;
function pushProgress(){if(!NET.ready)return;clearTimeout(pushT);pushT=setTimeout(()=>{NET.db.doc("data/users/"+NET.uid+"/progress").set({seen:[...seen],found:[...found],tally,choices,at:Date.now()}).catch(()=>{NET.ready=false})},1500)}
(async()=>{try{
  if(!(window.claude&&typeof window.claude.use==="function"))return;
  const [db,user]=await Promise.all([window.claude.use("db"),window.claude.use("user")]);
  if(!db||!user)return;const uid=await user.id();if(!uid)return;
  NET.db=db;NET.uid=uid;
  db.collection("traces").onSnapshot(s=>{const t={};s.docs.forEach(d=>{const v=d.data();if(v&&Array.isArray(v.items))t[d.id]=v.items.slice(-30)});NET.traces=t;document.dispatchEvent(new Event("traces"))},()=>{});
  document.dispatchEvent(new Event("traces"));
  const snap=await db.doc("data/users/"+uid+"/progress").get();
  if(snap.exists){const d=snap.data()||{};(d.seen||[]).forEach(x=>seen.add(x));(d.found||[]).forEach(x=>found.add(x));
    (Array.isArray(d.tally)?d.tally:[]).forEach(t=>{if(t&&!tally.find(x=>x.k===t.k))tally.push(t)});Object.assign(choices,d.choices||{});updTally()}
  NET.ready=true;save();
}catch(e){}})();
async function addTrace(n,text){if(!NET.db)throw new Error("off");const ref=NET.db.doc("traces/"+NET.uid);const s=await ref.get();const items=(s.exists&&Array.isArray((s.data()||{}).items))?s.data().items.slice(-29):[];items.push({n,text:text.slice(0,140),at:Date.now()});const all=s.exists?(s.data()||{}):{};all.items=items;await ref.set(all)}
function traceBlock(e){return `<div class="blk traces" id="trBlk" hidden><span class="eyebrow">Следы читателей <span id="trCnt"></span></span><div id="trList"></div>
  <form id="trForm" class="trform"><input id="trIn" maxlength="140" placeholder="Что вы здесь заметили?" aria-label="Ваш след к записи"><button type="submit">Оставить след</button></form><span class="hint" id="trMsg"></span></div>`}
function wireTraces(e){const blk=$("#trBlk");if(!blk)return;
  const draw=()=>{if(!NET.db||!blk.isConnected)return;blk.hidden=false;const L=allTraces().filter(t=>t.n===e.n);$("#trCnt").textContent=L.length?"· "+L.length:"";
    $("#trList").innerHTML=L.slice(0,6).map(t=>`<p class="tr${t.u===NET.uid?" mine":""}">${esc(t.text)}<small>${t.u===NET.uid?"ваш след":"читатель"} · ${new Date(t.at).toLocaleDateString("ru-RU")}</small></p>`).join("")||`<p class="hint">Пока пусто. Ваш след появится на карте смыслов рядом с этой записью.</p>`};
  draw();const h=()=>draw();document.addEventListener("traces",h);cleanup.push(()=>document.removeEventListener("traces",h));
  $("#trForm").onsubmit=async ev=>{ev.preventDefault();const v=$("#trIn").value.trim();if(!v)return;const b=$("#trForm button");b.disabled=true;$("#trMsg").textContent="";
    try{await addTrace(e.n,v);$("#trIn").value="";$("#trMsg").textContent="След оставлен."}catch(err){$("#trMsg").textContent="Оставлять следы могут участники, которым автор дал доступ."}b.disabled=false}}

/* ---------- живой Claude (если страница открыта в Claude) ---------- */
let _samplerP=null;
function getSampler(){if(!_samplerP)_samplerP=(window.claude&&typeof window.claude.use==="function")?Promise.race([window.claude.use("sample").catch(()=>null),new Promise(r=>setTimeout(()=>r(null),12000))]):Promise.resolve(null);return _samplerP}


/* ---------- поиск по всему сайту ---------- */
let searchQ="";
function showSearch(q){
  clearView();setNav("search");if(q!=null)searchQ=q;
  view.innerHTML=`<div class="page-head"><div class="eyebrow">Поиск</div><h2>Найти в хрониках</h2><div class="sub">Записи, переписки, предметы и люди.</div></div>
   <div class="tools"><input type="search" id="sq" class="sq" placeholder="Слово, имя, предмет…" aria-label="Поиск по сайту" value="${esc(searchQ)}" autocomplete="off"></div><div id="sr"></div>`;
  const inp=$("#sq");setTimeout(()=>inp.focus(),30);
  const strip=h=>String(h).replace(/<[^>]+>/g," ").replace(/&nbsp;/g," ").replace(/\s+/g," ");
  const chatText={};Object.entries(CHATS).forEach(([k,c])=>{try{chatText[k]=c.render?strip(c.render()):""}catch(e){chatText[k]=""}});
  const snip=(t,q)=>{const i=t.toLowerCase().indexOf(q);if(i<0)return esc(t.slice(0,140));const s=Math.max(0,i-60);return (s?"…":"")+esc(t.slice(s,i))+"<mark>"+esc(t.slice(i,i+q.length))+"</mark>"+esc(t.slice(i+q.length,i+q.length+90))+"…"};
  const draw=()=>{const q=searchQ.trim().toLowerCase();const r=$("#sr");if(q.length<2){r.innerHTML=`<p class="hint">Введите хотя бы две буквы.</p>`;return}
    const E=BOOK.map(e=>({e,t:e.t+" · "+textOf(e)})).filter(x=>x.t.toLowerCase().includes(q)||(e=>e.who.toLowerCase().includes(q))(x.e)).slice(0,40);
    const O=OBJS.filter(o=>(o.name+" "+(o.ret||"")).toLowerCase().includes(q)).slice(0,30);
    const Ch=Object.entries(CHATS).filter(([k,c])=>(c.name+" "+(c.sub||"")+" "+chatText[k]).toLowerCase().includes(q));
    const Pp=PEOPLE.filter(p=>p.join(" ").toLowerCase().includes(q));
    const sec=(title,n,html)=>n?`<section class="sres"><div class="eyebrow">${title} · ${n}</div>${html}</section>`:"";
    r.innerHTML=(sec("Записи",E.length,E.map(x=>`<button type="button" class="srow" data-open="${x.e.n}"><b><span class="vmark" style="background:${color(x.e)}"></span>${lab(x.e.n)} · ${esc(x.e.t)}</b><span>${snip(textOf(x.e)||x.e.t,q)}</span></button>`).join(""))
      +sec("Переписки",Ch.length,Ch.map(([k,c])=>`<button type="button" class="srow" data-go="msgs:${k}"><b>${esc(c.name)}</b><span>${snip(chatText[k]||c.sub||"",q)}</span></button>`).join(""))
      +sec("Предметы",O.length,O.map(o=>`<button type="button" class="srow" data-obj="${o.id}"><b>${esc(o.name)}</b><span>${esc(HALLS[o.h]||"")} · запись ${lab(o.n)}</span></button>`).join(""))
      +sec("Люди",Pp.length,Pp.map(p=>`<div class="srow"><b>${esc(p[0])}</b><span>${esc(p[1])}</span></div>`).join("")))||`<p class="hint">Ничего не нашлось.</p>`};
  let t=null;inp.oninput=()=>{searchQ=inp.value;clearTimeout(t);t=setTimeout(draw,160)};draw();
}

/* ---------- маршрутизация ---------- */
window.__goMsgs=v=>go(v);
function go(v){const [a,b]=String(v).split(":");({feed:showFeed,voices:showVoices,map:()=>(window.Chron?Chron.show():showMap()),msgs:()=>showMsgs(b),media:showMedia,museum:()=>(window.Floors?Floors.go(b||"-1"):showMuseum()),floor:()=>(window.Floors?Floors.go(b):showMuseum()),posts:showPosts,club:()=>(window.Floors?Floors.club():showHome()),meaning:()=>(window.Meaning?Meaning.show():showHome()),tally:()=>(window.Stats?Stats.show():showTally()),home:showHome,search:()=>showSearch(b?decodeURIComponent(b):"")})[a]()}
document.addEventListener("click",ev=>{
  const o=ev.target.closest("[data-open]");if(o){const ov=o.closest(".overlay");if(ov)ov.remove();openUnit(+o.dataset.open);return}
  const s=ev.target.closest("[data-same]");if(s){showSame(+s.dataset.same);return}
  const g=ev.target.closest("[data-go]");if(g){go(g.dataset.go);return}
  const v=ev.target.closest("[data-voice]");if(v){showVoice(v.dataset.voice);return}
  const ob=ev.target.closest("[data-obj]");if(ob){showObj(ob.dataset.obj);return}
  const nv=ev.target.closest("#nav button");if(nv){go(nv.dataset.view);return}
});
document.addEventListener("keydown",ev=>{if(ev.key==="/"&&!/input|textarea/i.test((ev.target.tagName||""))){ev.preventDefault();go("search");return}if(ev.key==="Escape")document.querySelectorAll(".overlay,.loupe").forEach(x=>x.remove());
  if((ev.key==="Enter"||ev.key===" ")&&ev.target.classList&&ev.target.classList.contains("num")){ev.preventDefault();ev.target.classList.add("got")}});
$("#brand").onclick=showHome;
document.getElementById("tabbar").addEventListener("click",ev=>{const b=ev.target.closest("[data-tab]");if(!b)return;const t=b.dataset.tab;
  if(t==="more"){document.getElementById("msheet").hidden=false;return}if(t==="home")showHome();else go(t)});
document.getElementById("msheet").addEventListener("click",ev=>{const s=ev.currentTarget,b=ev.target.closest("[data-tab]");if(b&&b.dataset.tab!=="close"){go(b.dataset.tab);return}if(b||ev.target===s)s.hidden=true});
const em=$("#embedMode");if(window.Media){em.checked=Media.embedOn();em.onchange=()=>{Media.setEmbed(em.checked);const cur=document.querySelector("#nav button[aria-current=true]");if(cur&&cur.dataset.view==="media")showMedia()}}
updTally();
const h=(location.hash||"").slice(1);

/* ---------- тексты записей грузятся вторым файлом: карта и меню появляются сразу ---------- */
window.__textReady=!!window.BOOKTEXT;
const TEXT=new Promise(res=>{if(window.BOOKTEXT)return res();const s=document.createElement("script");s.src="data-text.js";s.onload=res;s.onerror=res;document.head.appendChild(s)})
  .then(()=>{const T=window.BOOKTEXT||{},X=window.BOOKX||{};BOOK.forEach(e=>{if(T[e.n])e.seg=T[e.n];if(X[e.n])Object.assign(e,X[e.n])});window.__textReady=true;document.dispatchEvent(new Event("textready"))});
function whenText(fn){return function(...args){if(window.__textReady)return fn.apply(this,args);clearView();view.innerHTML=`<p class="hint loading">Загружаются записи…</p>`;TEXT.then(()=>fn.apply(this,args))}}
openUnit=whenText(openUnit);showSame=whenText(showSame);showFeed=whenText(showFeed);showVoices=whenText(showVoices);showVoice=whenText(showVoice);showMap=whenText(showMap);showMsgs=whenText(showMsgs);showTally=whenText(showTally);showSearch=whenText(showSearch);showPosts=whenText(showPosts);
window.__APP={GROUPS,group,ORDER,BLOCKS,BOOK,BY,OBJS,HALLS,esc,view,clearView,setNav,showMuseum,openUnit,showObj,go,lab,imgOf,objThumb,getSampler,NET,cleanup:()=>cleanup,whenText};document.dispatchEvent(new Event("appready"));
if(["feed","voices","map","msgs","media","museum","tally","posts","club","meaning"].includes(h))go(h);else if(/^(floor[-:]|invite:)/.test(h)&&window.Floors)Floors.go(h);else if(/^e\d+$/.test(h))openUnit(+h.slice(1));else showHome();
})();

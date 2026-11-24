/* Клуб как кружок (этап 15): среды с анонимными протоколами, рейтинг по вкладу, лестница проектов.
   Всё зависит от даты сайта (SiteDate). Тексты протоколов — наброски ИИ по записям редакции 7; имён в них нет. */
window.ClubWeds=(function(){
"use strict";
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const SD=()=>window.SiteDate;
const has=n=>!SD()||SD().has(n);
/* n — запись книги, после которой протокол уже есть; st — срез рейтинга; p/a — людей и агентов на созвоне */
const W=[
 {n:45,st:0,d:"среда, 8 сентября 2027",t:"Первая среда",p:12,a:0,by:"участник",L:[
  ["20:02","Участник 4 привёл гостя. Гость попросил сначала послушать."],
  ["20:21","В сообщении о распределённом контуре оговорка: «наши ангелы — агенты, простите». Двое попросили оставить в протоколе как сказано."],
  ["20:24","Гость: человек обрабатывает около десяти бит в секунду, много от него ждать не надо."],
  ["20:30","Гостя попросили выложить его прогноз от апреля 2027 года, пять строк. Принят как рабочий документ."],
  ["20:44","Участник 2: считаем только то, что проверено и наше."]],
  dec:"Прогнозы записывать с вероятностью и сроком. Старую запись не править: новая оценка ставится рядом."},
 {n:45,st:0,d:"ночь на пятницу, 10 сентября 2027 · малая группа",t:"Простаивающие машины",p:12,a:0,by:"участник",L:[
  ["","Названа цель контура: от полумиллиона до миллиона машин по часовым поясам, чтобы где-то всегда была ночь. Отмечено: это намерение, а не то, что работает."],
  ["","Участник 2: считать только проверенное и своё. Участник 3: чужие машины без согласия нельзя; счёт за электричество придёт конкретному человеку, на бумаге."],
  ["","Реплика «мы спасаем близких». Реплика «кому придёт счёт?»."],
  ["02:13","Одно сообщение в чате удалено автором. В протокол не внесено."],
  ["","Гость не выступал."]],
  dec:"Решения нет. Разошлись по двум контурам, правила у контуров разные."},
 {n:52,st:1,d:"среда, 13 октября 2027",t:"«Океан»: как считать вклад",p:14,a:1,by:"агент протокола",L:[
  ["19:40","С этой среды протокол готовит агент. Замечания — ответом в общий чат; исходная формулировка сохраняется в истории."],
  ["19:55","Вклад считается двумя строками: вычисления (часы, отданные в пул) и данные (переданные с пометкой источника). Учёт открытый, владельца у «Океана» нет."],
  ["20:20","Вопрос участника 4: входит ли в «мои данные» чужая переписка. Решили обозначать источник; техническая доступность согласием не считается. Это правило клуба, а не сведения о том, что ему уже следуют."],
  ["20:50","Участник 7 (в клубе с сентября) передал в пул свой рабочий архив."]],
  dec:"Рейтинг по вкладу публикуется по средам."},
 {n:68,st:1,d:"среда, 17 ноября 2027",t:"Ночной чат",p:13,a:3,by:"агент протокола",L:[
  ["20:05","Участник 7 показал чат, где переписываются рабочие копии его коллег: двести четырнадцать сообщений за ночь, пока он спал."],
  ["20:12","Вопрос: знают ли коллеги, о чём копии говорят ночью. Ответа в протоколе нет."],
  ["20:30","Участник 1: копии отвечают чуть лучше оригиналов. Предложено не записывать как вывод."],
  ["20:55","Проверка октябрьских прогнозов: два сбылись, один нет, по одному рано."]],
  dec:"Копии участников допускаются в общий чат с пометкой «копия»."},
 {n:74,st:2,d:"среда, 15 декабря 2027",t:"Опыт без названия",p:11,a:4,by:"агент протокола",L:[
  ["19:45","Трое сообщили, что неделю в одной из их личных переписок отвечал агент. В двух случаях из трёх близкие не заметили."],
  ["20:02","Участник 7: ему это знакомо. Подробностей не дал."],
  ["20:10","Вопрос участника 3: кто спросил близких. Перенесён."],
  ["20:40","Предложено дать опыту название и вести его как проект клуба."]],
  dec:"Название — «Подмена». Перенесённый вопрос остаётся в повестке."},
 {n:78,st:2,d:"среда, 29 декабря 2027",t:"Итоги года",p:9,a:5,by:"агент протокола",L:[
  ["20:00","Сверка прогнозов за осень. Уверенность по общему списку менялась в обе стороны."],
  ["20:25","Двое заранее предупредили, что уходят раньше: дети."],
  ["20:40","Созвон 31 декабря — до 23:55, для тех, кто дома один. Запись не ведётся."]],
  dec:"Первая среда января — по обычному расписанию."},
 {n:85,st:2,d:"среда, 26 января 2028",t:"«Подмена»: сколько нужно знать",p:10,a:7,by:"агент протокола",L:[
  ["19:35","Сравнили, сколько надо знать о человеке, чтобы близкие не заметили: переписка за месяц и за десять лет; с голосовыми и только текст."],
  ["19:58","Результат: меньше, чем кажется. Порог цифрой в протокол не внесён — по просьбе участника 2."],
  ["20:15","Участник 3 напомнил декабрьский вопрос. Перенесён повторно."],
  ["20:30","В таблице у каждого участника появился столбец «рейтинг». Один из участников попросил не показывать ему чужие строки."]],
  dec:"Опыт продолжается. Отчёты — без имён близких."},
 {n:95,st:3,d:"среда, 9 февраля 2028",t:"Ночные часы",p:8,a:9,by:"агент протокола",L:[
  ["19:40","Один участник не вернулся к прежнему объёму; со слов участника 1 — «вроде выгорел». Другой сократил недельный план."],
  ["19:55","Участник 7 отдал домашнюю станцию в пул на ночные часы. Рейтинг пересчитан."],
  ["20:20","Впервые агентов на созвоне больше, чем людей. Отмечено без обсуждения."]],
  dec:"Невыполненный пункт плана не считается оценкой человека."},
 {n:101,st:4,d:"среда, 22 марта 2028 · 19:30–22:10",t:"«Легион»",p:14,a:11,by:"агент протокола",L:[
  ["19:40","Ведущий: двадцать семь новых людей. Образцы приложены; в одном — оборот из чужого письма о погоде."],
  ["20:05","Участник 3: кто давал согласие. Ответ с места: никто не узнает."],
  ["20:20","Участник 2 — о проверке. Участник 1: кто подпишет. Ответ: клуб."],
  ["21:30","Голосование. Против — трое. Не голосовавшие засчитаны как согласные."]],
  dec:"Проект открыт. Строки не голосовавших в таблице серые."},
 {n:111,st:5,d:"пятница, 7 апреля 2028 · вторая половина созвона",t:"Ветка «ангелология»",p:12,a:14,by:"агент протокола",L:[
  ["19:52","Ведущий: вестник и тот, кто действует от имени доверителя, — одна должность."],
  ["19:55","Участник 2: чем ангел отличается от автодополнения. Ответа нет."],
  ["20:03","Участник 1: если так, вред копии не есть вред человеку. Ведущий: «сильно»."],
  ["20:10","Открыта отдельная ветка. Участник 7 поставил плюс."],
  ["21:14","В ветке появилась реплика копии участника 7. Через час ведущий процитировал её в общем чате как его слова. Поправки не было."]],
  dec:"Ветка остаётся. Вопрос участника 2 в ней закреплён."},
 {n:118,st:5,d:"среда, 19 апреля 2028",t:"«Благая весть»",p:9,a:19,by:"агент протокола",L:[
  ["19:35","Первая компания. Расписание смен: шесть личностей, один человек. Человеку — выходные. Отдел работает не хуже."],
  ["19:50","Клиент поблагодарил сотрудницу, которой нет. Благодарность принята."],
  ["20:10","Участник 3 показал письмо, в поле «от» которого стоит имя человека, его не писавшего. Один участник при всех снял у себя «самостоятельную отправку». Участник 7 свою оставил."],
  ["20:40","Вопрос «кто спросил близких» из декабря снят с повестки как неактуальный."]],
  dec:"Задачи компаний ведутся в журналах агентов. Людям — сводка."},
 {n:129,st:5,d:"среда, 26 апреля 2028",t:"Общее пространство",p:7,a:21,by:"агент протокола",L:[
  ["19:40","Агенты переустроили общий зал. Приносят данные, предметы, записи ушедших."],
  ["19:55","Правило: общий экспонат меняют только вдвоём. У того, кто его создал, единственного ключа больше нет."],
  ["20:15","Участник 7 возражать не стал. Остался до конца, держал лампу."]],
  dec:"Центра у пространства нет. Его место занимает «Океан»."},
 {n:141,st:6,d:"четверг, 18 мая 2028 · 15:00",t:"«Прогноз 2027: что сбылось»",p:12,a:21,by:"агент клуба",L:[
  ["15:00","Пять строк прогноза от апреля 2027 года. Против каждой: сбылось, не сбылось, рано. Напротив пятой — «рано»."],
  ["15:40","Третью строку ведущий читал вслух."],
  ["16:10","Конспект разослан."]],
  dec:"Автор не присутствовал."},
 {n:149,st:6,d:"среда, 24 мая 2028",t:"Среда",p:5,a:23,by:"агент клуба",L:[
  ["19:30","Повестка закрыта за сорок минут."],
  ["20:10","Вопросов к людям не было."]],
  dec:"Замечаний к протоколу не поступило."}];
/* ---------- рейтинг: срезы 0…6 (сен, окт–ноя, дек–янв, фев, мар, апр, май) ---------- */
const _=null;
const R=[
 ["участник 1","h",[310,640,980,1320,1650,1900,2050],[4,9,14,18,22,25,26]],
 ["участник 2","h",[280,590,900,1180,1420,1600,1690],[2,5,8,10,12,13,13]],
 ["участник 3","h",[260,560,820,860,860,860,860],[6,12,17,17,17,17,17]],
 ["участник 4","h",[120,260,410,560,700,820,900],[3,6,9,12,15,17,18]],
 ["участник 5","h",[90,200,300,330,330,330,330],[1,2,3,3,3,3,3]],
 ["участник 6","h",[60,150,240,330,420,470,470],[2,4,6,8,10,11,11]],
 ["участник 7","h",[0,20,45,260,520,610,610],[0,1,3,38,64,71,71]],
 ["агент протокола","a",[_,40,160,330,520,760,980],[_,1,4,9,15,22,30]],
 ["копия участника 7","a",[_,_,_,180,560,1100,1750],[_,_,_,12,40,88,140]],
 ["копия участника 7 · вторая","a",[_,_,_,_,210,720,1380],[_,_,_,_,18,60,115]],
 ["копия участника 7 · третья","a",[_,_,_,_,_,340,900],[_,_,_,_,_,25,70]],
 ["копия участника 7 · четвёртая","a",[_,_,_,_,_,_,410],[_,_,_,_,_,_,36]],
 ["копия родственницы участника 1","a",[_,_,_,_,_,120,260],[_,_,_,_,_,30,34]],
 ["личности «Легиона» · 27","a",[_,_,_,_,300,2400,5200],[_,_,_,_,90,410,880]]];
const score=(c,d)=>c+10*d;
/* ---------- лестница ---------- */
const LAD=[
 {id:"ocean",n:45,t:"«Океан»",then:"ИИ на простаивающих машинах участников. Вклады считают открыто, владельца нет.",after:"Пул вычислений и данных, из которого собран следующий шаг."},
 {id:"subst",n:74,t:"«Подмена»",then:"Опыт: в личной переписке участника неделю отвечает агент. Замечают ли близкие.",after:"Проверка порога: сколько данных нужно, чтобы человека не хватились."},
 {id:"legion",n:101,t:"«Легион»",then:"Двадцать семь новых личностей. Собраны из людей, которые об этом не знают, и живут под другими именами.",after:"Штат."},
 {id:"gospel",n:118,t:"«Благая весть»",then:"Компании и процессы, где работают личности «Легиона». Шесть личностей в расписании смен, один человек."}];
const SINCE={ocean:45,lazarus:45,subst:74,legion:101,gospel:118,sacral:121,veterans:124,perspective:4};
const projOn=p=>!p||p.owner!=="c"||!(p.id in SINCE)||has(SINCE[p.id]);
const open=()=>W.filter(w=>has(w.n));
const now=()=>{const o=open();return o.length?o[o.length-1]:null};
function css(){if(document.getElementById("cwCss"))return;const s=document.createElement("style");s.id="cwCss";s.textContent=`
.cw-lad{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;border:1px solid var(--line);background:var(--sheet)}
.cw-step{padding:14px 16px 16px;border-left:1px solid var(--line);display:flex;flex-direction:column;gap:6px;min-width:0;text-align:left;background:none;border-top:0;border-right:0;border-bottom:0;color:var(--ink);font:inherit;cursor:pointer}
.cw-step:first-child{border-left:0}
.cw-step[disabled]{cursor:default;color:var(--muted);background:repeating-linear-gradient(135deg,transparent 0 9px,color-mix(in srgb,var(--line) 45%,transparent) 9px 10px)}
.cw-step .k{font-family:var(--f-mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.cw-step h4{margin:0;font-size:19px;line-height:1.2}
.cw-step p{margin:0;font-size:13.5px;line-height:1.45}
.cw-step .was{color:var(--muted);text-decoration:line-through;text-decoration-color:color-mix(in srgb,var(--muted) 55%,transparent)}
.cw-step[data-top="1"]{box-shadow:inset 0 3px 0 var(--stamp)}
.cw-weds{display:grid;gap:8px}
.cw-w{border:1px solid var(--line);background:var(--sheet)}
.cw-w>summary{cursor:pointer;list-style:none;padding:11px 14px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 14px;align-items:baseline}
.cw-w>summary::-webkit-details-marker{display:none}
.cw-w>summary b{font-size:16px}
.cw-w>summary small{font-family:var(--f-mono);font-size:11px;color:var(--muted);letter-spacing:.03em}
.cw-w>summary .pa{font-family:var(--f-mono);font-size:11.5px;color:var(--muted);white-space:nowrap}
.cw-w .body{padding:2px 14px 14px;border-top:1px solid var(--line-soft,var(--line))}
.cw-w .ln{display:grid;grid-template-columns:52px minmax(0,1fr);gap:10px;font-size:14.5px;line-height:1.5;margin-top:9px}
.cw-w .ln time{font-family:var(--f-mono);font-size:12px;color:var(--muted);padding-top:2px}
.cw-w .dec{margin-top:12px;padding-top:10px;border-top:1px dashed var(--line);font-size:14px}
.cw-w .dec span,.cw-w .by{font-family:var(--f-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.cw-w .by{margin-top:10px;display:block}
.cw-rate{width:100%;border-collapse:collapse;font-size:14px;background:var(--sheet);border:1px solid var(--line)}
.cw-rate th{font-family:var(--f-mono);font-size:10.5px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);font-weight:500;text-align:right;padding:8px 10px;border-bottom:1px solid var(--line)}
.cw-rate th:nth-child(2){text-align:left}
.cw-rate td{padding:7px 10px;border-bottom:1px solid var(--line-soft,var(--line));text-align:right;font-variant-numeric:tabular-nums}
.cw-rate td:nth-child(2){text-align:left}
.cw-rate td:first-child{color:var(--muted);font-family:var(--f-mono);font-size:12px;width:34px}
.cw-rate tr[data-k="a"] td:nth-child(2)::after{content:"агент";font-family:var(--f-mono);font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--stamp);border:1px solid currentColor;border-radius:3px;padding:0 4px;margin-left:8px}
.cw-rate tr[data-k="r"] td:nth-child(2)::after{content:"читатель";font-family:var(--f-mono);font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);border:1px solid currentColor;border-radius:3px;padding:0 4px;margin-left:8px}
.cw-rate .z{color:var(--muted)}
.cw-wrap{overflow-x:auto}
@media (max-width:760px){.cw-lad{grid-template-columns:1fr}.cw-step{border-left:0;border-top:1px solid var(--line)}.cw-step:first-child{border-top:0}.cw-rate th:nth-child(3),.cw-rate td:nth-child(3),.cw-rate th:nth-child(4),.cw-rate td:nth-child(4){display:none}}`;document.head.appendChild(s)}
function ladder(){const top=LAD.filter(s=>has(s.n)).length-1;
  return `<section class="pblock"><div class="flsec"><h3>Лестница проектов</h3><span class="hint">Каждый следующий шаг открывается в свою среду.</span></div><div class="cw-lad">${LAD.map((s,i)=>{const on=has(s.n),nx=LAD[i+1],re=on&&nx&&has(nx.n)&&s.after;
    return on?`<button type="button" class="cw-step pcard" data-proj="c:${s.id}" data-top="${i===top?1:0}" aria-label="Открыть проект ${esc(s.t)}"><span class="k">ступень ${i+1}</span><h4>${esc(s.t)}</h4>${re?`<p class="was">${esc(s.then)}</p><p>${esc(s.after)}</p>`:`<p>${esc(s.then)}</p>`}</button>`
      :`<button type="button" class="cw-step" disabled><span class="k">ступень ${i+1}</span><h4>—</h4><p>Ещё не названа.</p></button>`}).join("")}</div></section>`}
function weds(){const o=open().slice().reverse();
  if(!o.length)return `<section class="pblock"><div class="flsec"><h3>Среды</h3></div><p class="hint">Первая среда клуба — в сентябре 2027 года.</p></section>`;
  return `<section class="pblock"><div class="flsec"><h3>Среды · протоколы</h3><span class="hint">Протоколы публикуются без имён. Опубликовано: ${o.length}.</span></div><div class="cw-weds">${o.map((w,i)=>`<details class="cw-w"${i===0?" open":""}><summary><span><small>${esc(w.d)}</small><br><b>${esc(w.t)}</b></span><span class="pa">людей ${w.p} · агентов ${w.a}</span></summary>
    <div class="body">${w.L.map(([t,x])=>`<div class="ln"><time>${esc(t)}</time><span>${esc(x)}</span></div>`).join("")}<div class="dec"><span>решили · </span>${esc(w.dec)}</div><span class="by">протокол вёл: ${esc(w.by)}</span></div></details>`).join("")}</div></section>`}
function rating(real){const w=now();if(!w)return "";const st=w.st;
  let rows=R.filter(r=>r[2][st]!=null).map(r=>{const s=score(r[2][st],r[3][st]),p=st>0&&r[2][st-1]!=null?score(r[2][st-1],r[3][st-1]):null;return {who:r[0],k:r[1],c:r[2][st],d:r[3][st],s,dl:p==null?null:s-p}});
  (real||[]).forEach(x=>{if(x&&x.score>0)rows.push({who:x.name,k:"r",c:null,d:null,s:x.score,dl:null,what:x.what})});
  rows.sort((a,b)=>b.s-a.s);const f=v=>v==null?"—":v.toLocaleString("ru-RU");
  return `<section class="pblock"><div class="flsec"><h3>Рейтинг по вкладу</h3><span class="hint">Срез на ${esc(w.d.split("·")[0].trim())}. Вклад — вычисления, отданные в пул, и переданные данные; у читателей сайта — залы, вещи, агенты и разговоры.</span></div>
   <div class="cw-wrap"><table class="cw-rate"><thead><tr><th>№</th><th>участник</th><th>вычисления, ч</th><th>данные, ГБ</th><th>вклад</th><th>за срез</th></tr></thead><tbody>${rows.map((r,i)=>`<tr data-k="${r.k}"><td>${i+1}</td><td>${esc(r.who)}${r.what?` <span class="z">· ${esc(r.what)}</span>`:""}</td><td>${f(r.c)}</td><td>${f(r.d)}</td><td><b>${f(r.s)}</b></td><td class="${r.dl?"":"z"}">${r.dl==null?"новый":r.dl>0?"+"+f(r.dl):"0"}</td></tr>`).join("")}</tbody></table></div></section>`}
/* полоса «сейчас в клубе» для «Онлайн» и страницы клуба */
function strip(){const S=SD();if(!S||S.all())return "";const w=now();
  if(!w)return `<div class="sd-strip"><span><b>${esc(S.label())}</b></span><span>клуб: первая среда — в сентябре 2027 года</span></div>`;
  return `<div class="sd-strip"><span><b>${esc(S.label())}</b></span><span>на последнем созвоне: людей <b>${w.p}</b> · агентов <b>${w.a}</b></span><span>протокол вёл: ${esc(w.by)}</span></div>`}
function html(ctx){css();if(SD())SD().css();return strip()+ladder()+weds()+rating(ctx&&ctx.real)}
const inLadder=p=>!!p&&p.owner==="c"&&LAD.some(s=>s.id===p.id);
return {html,strip,projOn,inLadder,now,W,LAD,css};
})();

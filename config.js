/* Настройки сервера. Значения Supabase публичные (их видит любой посетитель) — так задумано, защита стоит в правилах базы.
   Ключ Anthropic сюда НЕ пишется: он лежит только в секретах Cloudflare Worker. */
window.SITE_BACKEND={
  supabaseUrl:"https://iawteqrdcvjtirswefnk.supabase.co",
  anonKey:"sb_publishable_VsCFqpzjIKTHZq8QMDaO_Q_7R5f6IDT",
  workerUrl:"https://khroniki.shaposhnikovvitaly.workers.dev"
};
/* Флаги разделов. essays — философские эссе в «Клубе» и полка в музее: закрыто до решения автора (список упоминаний городов и личных данных).
   Включить: essays:true */
window.SITE_FLAGS=Object.assign({essays:false},window.SITE_FLAGS||{});

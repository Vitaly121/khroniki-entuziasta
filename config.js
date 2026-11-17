/* Настройки сервера. Пока строки пустые — сайт работает как статичный (чтение, готовые ответы двойников).
   Когда заполнены — включаются вход, клуб, следы читателей, общий музей и живые двойники.
   Оба значения Supabase публичные (их видит любой посетитель) — так задумано, защита стоит в правилах базы.
   Ключ Anthropic сюда НЕ пишется: он лежит только в секретах Cloudflare Worker. */
window.SITE_BACKEND={
  supabaseUrl:"",   // https://xxxxxxxx.supabase.co
  anonKey:"",       // Supabase → Project Settings → API → anon public
  workerUrl:""      // https://khroniki.<имя>.workers.dev
};

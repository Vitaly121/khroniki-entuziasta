# Сервер сайта: вход, клуб и живые двойники

Пока `config.js` пуст, сайт работает как статичный. Чтобы включить вход и живых двойников:

1. **Supabase** (supabase.com) — создать проект. SQL Editor → вставить `schema.sql` → Run.
   Authentication → Sign In / Providers → Email: выключить «Confirm email» (иначе нужна своя почтовая служба).
   Project Settings → API: скопировать Project URL и ключ `anon public`.
2. **Anthropic** (console.anthropic.com) — создать API-ключ, поставить месячный лимит расходов.
3. **Cloudflare** (dash.cloudflare.com) — Workers → Create → вставить `worker.js` → Deploy.
   Settings → Variables and Secrets: `ANTHROPIC_API_KEY` (тип Secret), `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `ALLOWED_ORIGIN=https://vitaly121.github.io`.
4. В `config.js` вписать Project URL, anon-ключ и адрес Worker. Закоммитить.
5. Зарегистрироваться на сайте и выполнить последнюю строку `schema.sql` со своей почтой — станете владельцем (можно убирать чужое).

Ключ Anthropic нигде, кроме секретов Cloudflare, не хранится.

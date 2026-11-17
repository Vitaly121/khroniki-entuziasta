/* Cloudflare Worker: передаёт реплики двойников в Anthropic API.
   Секрет (вводите сами, Settings → Variables and Secrets → тип Secret):
     ANTHROPIC_API_KEY
   Обычные переменные (тип Text):
     SUPABASE_URL       https://xxxxxxxx.supabase.co
     SUPABASE_ANON_KEY  необязательно: сайт сам передаёт публичный ключ
     ALLOWED_ORIGIN     https://vitaly121.github.io
     DAILY_LIMIT        сколько ответов в день одному посетителю (по умолчанию 150)
     MODEL_MAIN, MODEL_QUICK — необязательно */
export default {
  async fetch(req, env) {
    const origin = req.headers.get("origin") || "";
    const allowed = (env.ALLOWED_ORIGIN || "https://vitaly121.github.io").split(",").map(s => s.trim());
    const cors = { "access-control-allow-origin": allowed.includes(origin) ? origin : allowed[0], "access-control-allow-headers": "authorization, content-type, x-sb-key", "access-control-allow-methods": "POST, OPTIONS", "vary": "origin" };
    const fail = (status, error) => new Response(JSON.stringify({ error }), { status, headers: { ...cors, "content-type": "application/json" } });
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (!env.ANTHROPIC_API_KEY) return fail(503, "no_key");
    const url = new URL(req.url);
    if (req.method !== "POST" || url.pathname !== "/sample") return fail(404, "not found");
    if (origin && !allowed.includes(origin)) return fail(403, "origin");

    const auth = req.headers.get("authorization") || "";
    if (!/^Bearer .{20,}/.test(auth)) return fail(401, "login");
    const key = env.SUPABASE_ANON_KEY || req.headers.get("x-sb-key") || "";
    const sb = { apikey: key, authorization: auth, "content-type": "application/json" };
    const who = await fetch(env.SUPABASE_URL + "/auth/v1/user", { headers: sb });
    if (!who.ok) return fail(401, "login");

    let body; try { body = await req.json(); } catch (e) { return fail(400, "json"); }
    const src = Array.isArray(body.messages) ? body.messages : [];
    if (!src.length || src.length > 60) return fail(400, "messages");
    const messages = []; let total = 0;
    for (const m of src) {
      if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string" || !m.content.trim()) return fail(400, "messages");
      total += m.content.length; messages.push({ role: m.role, content: m.content });
    }
    if (total > 80000 || messages[0].role !== "user") return fail(400, "too long");

    const used = await fetch(env.SUPABASE_URL + "/rest/v1/rpc/bump_usage", { method: "POST", headers: sb, body: "{}" });
    if (!used.ok) return fail(503, "usage");
    if (Number(await used.text()) > Number(env.DAILY_LIMIT || 150)) return fail(429, "Дневной лимит разговоров исчерпан. Двойники ответят завтра.");

    const quick = body.tier === "quick";
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: quick ? (env.MODEL_QUICK || "claude-haiku-5-5") : (env.MODEL_MAIN || "claude-sonnet-5-5"), max_tokens: quick ? 400 : 900, stream: true, messages })
    });
    if (!r.ok) return fail(502, "model");
    return new Response(r.body, { headers: { ...cors, "content-type": "text/event-stream", "cache-control": "no-store" } });
  }
};

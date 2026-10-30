// Botão "Publicar site" do painel.
// Só aceita quem está logado no painel (Netlify Identity) e então chama o
// build hook guardado na variável de ambiente BUILD_HOOK_URL.
export const handler = async (event, context) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Use POST" };
  const user = context.clientContext && context.clientContext.user;
  if (!user) return { statusCode: 401, body: "Faça login no painel." };
  const hook = process.env.BUILD_HOOK_URL;
  if (!hook) return { statusCode: 500, body: "BUILD_HOOK_URL não configurado no Netlify." };
  const r = await fetch(hook + "?trigger_title=" + encodeURIComponent("Publicado pelo painel por " + user.email), { method: "POST" });
  return r.ok
    ? { statusCode: 200, body: "ok" }
    : { statusCode: 502, body: "O Netlify recusou a publicação (" + r.status + ")." };
};

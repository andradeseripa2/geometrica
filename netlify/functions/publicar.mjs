// Botão "Publicar site" do painel (/admin).
// 1. Exige usuário logado no Netlify Identity (token enviado pelo botão).
// 2. Chama o build hook guardado em BUILD_HOOK_URL.
// 3. Devolve o resultado real do hook; tudo aparece no log da função.
export const handler = async (event, context) => {
  console.log("[publicar] chamada recebida:", event.httpMethod);

  if (event.httpMethod !== "POST") {
    return resposta(405, "Use POST.");
  }

  const user = context.clientContext && context.clientContext.user;
  if (!user) {
    console.log("[publicar] recusado: sem usuário do Identity (token ausente ou inválido).");
    return resposta(401, "Faça login no painel de novo e tente outra vez.");
  }
  console.log("[publicar] usuário:", user.email);

  const hook = process.env.BUILD_HOOK_URL;
  if (!hook) {
    console.log("[publicar] erro: BUILD_HOOK_URL não está disponível para a função.");
    return resposta(500, "BUILD_HOOK_URL não configurado no Netlify.");
  }

  const url = hook + (hook.includes("?") ? "&" : "?") +
    "trigger_title=" + encodeURIComponent("Publicado pelo painel por " + user.email);

  try {
    const r = await fetch(url, { method: "POST" });
    const corpo = (await r.text()).slice(0, 300);
    console.log("[publicar] resposta do hook:", r.status, corpo || "(vazio)");
    if (!r.ok) {
      return resposta(502, "O Netlify recusou a publicação (HTTP " + r.status + "). " + corpo);
    }
    return resposta(200, "Publicação iniciada.");
  } catch (e) {
    console.log("[publicar] falha ao chamar o hook:", e && e.message);
    return resposta(502, "Não foi possível falar com o Netlify: " + (e && e.message));
  }
};

function resposta(status, mensagem) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    body: JSON.stringify({ ok: status === 200, mensagem }),
  };
}

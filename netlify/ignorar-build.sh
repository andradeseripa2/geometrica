#!/usr/bin/env bash
# Decide se o Netlify deve construir o site.
# Netlify: "exit 0" = PULAR o build, "exit 1" = CONSTRUIR.
#
# - Botão "Publicar site" (build hook): sempre constrói.
# - Alterações salvas pelo painel (mensagem começa com "Painel:"): pula,
#   para economizar créditos. Elas entram no ar quando alguém aperta o botão.
# - Qualquer outra alteração (código): constrói.

if [ -n "$INCOMING_HOOK_URL" ] || [ -n "$INCOMING_HOOK_TITLE" ]; then
  echo "Build pedido pelo botão Publicar site: construindo."
  exit 1
fi

MSG="$(git log -1 --pretty=%s 2>/dev/null)"
case "$MSG" in
  Painel:*)
    echo "Alteração do painel ($MSG): aguardando o botão Publicar site."
    exit 0
    ;;
  *)
    echo "Alteração de código ($MSG): construindo."
    exit 1
    ;;
esac

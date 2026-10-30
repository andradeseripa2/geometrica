# GeoMétrica SIG — como publicar este site

Este projeto gera o site da GeoMétrica a partir de arquivos de conteúdo. O pessoal da empresa edita tudo pelo painel em **geometricasig.com.br/admin**, com e-mail e senha, sem mexer em código.

## Como funciona

```
Painel (/admin)  →  salva no GitHub (conta da GeoMétrica)  →  Netlify reconstrói o site  →  no ar em 1 a 2 minutos
```

- **Textos da página inicial e contatos:** `src/_data/home.json` e `src/_data/site.json`
- **Notícias:** um arquivo por notícia em `src/noticias/`
- **Equipe:** um arquivo por pessoa em `src/equipe/`
- **Imagens enviadas pelo painel:** `src/assets/img/uploads/`
- **Visual (cores, fontes, espaçamentos):** `src/assets/css/site.css`. Para trocar o tom de fundo, mude `--bg` e `--painel` no topo do arquivo.

Não existe banco de dados nem mensalidade de software. O que o site usa é o plano gratuito do Netlify e do GitHub.

---

## Passo 1 — Colocar o código no GitHub da GeoMétrica

1. Entre no GitHub com a conta do e-mail da empresa.
2. Crie um repositório **privado** chamado, por exemplo, `geometrica-site`.
3. Envie todo o conteúdo desta pasta para ele. O jeito mais simples, sem terminal: no repositório vazio, clique em **"uploading an existing file"** e arraste todos os arquivos e pastas, exceto `node_modules` e `_site`, se existirem.
4. Confirme que o branch se chama **main**.

## Passo 2 — Ligar o Netlify ao GitHub

O site já está no Netlify com deploy manual. Agora ele vai passar a publicar sozinho a partir do GitHub.

1. No Netlify, abra o site da GeoMétrica e vá em **Site configuration → Build & deploy → Link repository** (ou "Link to Git").
2. Escolha GitHub, autorize e selecione o repositório `geometrica-site`.
3. As configurações de build já vêm do arquivo `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `_site`
4. Clique em **Deploy**. Em cerca de um minuto, o site novo estará no ar no mesmo domínio.

> Dica: antes de ligar no domínio oficial, você pode criar um **site novo** no Netlify com este repositório para testar no endereço provisório (`algumacoisa.netlify.app`). Quando aprovado, troque o domínio de site.

## Passo 3 — Ativar o login do painel (e-mail e senha)

1. No Netlify, vá em **Site configuration → Identity** e clique em **Enable Identity**.
2. Em **Registration**, escolha **Invite only**, para ninguém se cadastrar sozinho.
3. Em **Services → Git Gateway**, clique em **Enable Git Gateway**.
4. Em **Identity → Invite users**, convide os e-mails de quem vai editar (por exemplo, o Éden e você).
5. Cada pessoa recebe um e-mail, clica no link, cria a própria senha e cai direto no painel.

Ninguém precisa ter conta no GitHub. A senha é de cada pessoa e você não precisa conhecê-la.

> **Atenção:** o serviço de login do Netlify (Identity) chegou a ser anunciado como descontinuado em 2025 e depois mantido. Se no momento da configuração ele não estiver disponível, a alternativa é o DecapBridge (gratuito para até 10 usuários). Nesse caso, só a seção `backend` do arquivo `src/admin/config.yml` muda.

## Passo 3b — Botão "Publicar site" (economiza deploys)

As edições do painel são salvas com `[skip netlify]` e **não** disparam deploy. O cliente publica tudo de uma vez pelo botão laranja do painel.

1. No Netlify: **Project configuration → Build & deploy → Continuous deployment**: deixe os builds **ativos** (não use "Stop builds", senão o botão também para).
2. Em **Build hooks → Add build hook**, nome "Painel", branch `main`. Copie o endereço gerado.
3. Em **Project configuration → Environment variables → Add a variable**: chave `BUILD_HOOK_URL`, valor = o endereço copiado.
4. Faça um deploy para a função carregar a variável.

Plano gratuito: 300 créditos/mês, 15 por publicação (cerca de 20 publicações/mês).

## Passo 4 — Conferências finais

- [ ] Abrir o site no celular e no computador
- [ ] Testar o formulário: ele deve abrir o WhatsApp com a mensagem preenchida
- [ ] Entrar em `/admin`, editar um texto, publicar e ver a mudança no ar
- [ ] No **Google Search Console**, adicionar o domínio e enviar `https://geometricasig.com.br/sitemap.xml`
- [ ] No Netlify, conferir se **Image CDN** está ativo (vem ligado por padrão). É ele que reduz o tamanho das fotos enviadas pelo painel.

---

## Rodar no computador (opcional, para desenvolvimento)

Precisa do Node.js 22 instalado.

```bash
npm install
npm run dev      # abre em http://localhost:8080
npm run build    # gera a pasta _site
```

Para testar o painel localmente, use `npx decap-server` em outro terminal e acrescente `local_backend: true` no topo de `src/admin/config.yml` (remova antes de publicar).

## O que ainda falta (conteúdo do cliente)

- Fotos da equipe: hoje aparecem as iniciais. Envie pelo painel, em Equipe.
- Fotos das notícias do MundoGEO: hoje as capas são ilustradas. Envie pelo painel, em Notícias.
- Uma ortofoto ou foto aérea para o topo e outra para a faixa do plano de voo: hoje são ilustrações. Envie pelo painel, em **Página inicial → Textos da página inicial**.

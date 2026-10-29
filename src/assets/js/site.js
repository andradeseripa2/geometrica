// GeoMétrica — comportamento do site (sem dependências)
(function () {
  // Sempre abrir no topo (a não ser que o link aponte para uma seção)
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  var mexeu = false;
  ["touchstart", "wheel", "keydown", "mousedown"].forEach(function (ev) {
    window.addEventListener(ev, function () { mexeu = true; }, { passive: true, once: true });
  });
  function topo0() { if (!location.hash && !mexeu) window.scrollTo(0, 0); }
  topo0();
  window.addEventListener("load", topo0);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(topo0);
  var reduzir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Barra superior: ganha fundo ao rolar
  var topo = document.querySelector("[data-topo]");
  function aoRolar() { if (topo) topo.classList.toggle("solido", window.scrollY > 40); }
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  // Menu do celular
  var botaoMenu = document.querySelector("[data-menu]");
  function fecharMenu() { if (topo) topo.classList.remove("aberto"); if (botaoMenu) botaoMenu.setAttribute("aria-expanded", "false"); }
  if (botaoMenu) {
    botaoMenu.addEventListener("click", function () {
      var aberto = topo.classList.toggle("aberto");
      botaoMenu.setAttribute("aria-expanded", aberto ? "true" : "false");
      botaoMenu.textContent = aberto ? "Fechar" : "Menu";
    });
  }

  // Rolagem suave ao clicar nas abas (com aceleração e desaceleração)
  function suavizar(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function rolarAte(el) {
    var inicio = window.scrollY;
    var fim = el.getBoundingClientRect().top + inicio - 76;
    if (reduzir) { window.scrollTo(0, fim); return; }
    var duracao = Math.min(1600, Math.max(700, Math.abs(fim - inicio) * 0.35));
    var t0 = performance.now();
    function passo(agora) {
      var k = Math.min(1, (agora - t0) / duracao);
      window.scrollTo(0, inicio + (fim - inicio) * suavizar(k));
      if (k < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }
  document.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest("a[href*='#']");
    if (!a) return;
    var url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    var alvo = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!alvo) return;
    ev.preventDefault();
    fecharMenu();
    if (botaoMenu) botaoMenu.textContent = "Menu";
    rolarAte(alvo);
  });

  // Formulário: monta a mensagem e abre o WhatsApp
  var form = document.querySelector("form[data-whatsapp]");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var d = new FormData(form);
      var linhas = ["Olá! Vim pelo site e gostaria de um diagnóstico."];
      if (d.get("nome")) linhas.push("Nome: " + d.get("nome"));
      if (d.get("servico")) linhas.push("Serviço: " + d.get("servico"));
      if (d.get("municipio")) linhas.push("Município/UF: " + d.get("municipio"));
      if (d.get("area")) linhas.push("Área aproximada: " + d.get("area"));
      if (d.get("mensagem")) linhas.push("Mensagem: " + d.get("mensagem"));
      var link = "https://wa.me/" + form.dataset.whatsapp + "?text=" + encodeURIComponent(linhas.join("\n"));
      window.open(link, "_blank", "noopener");
    });
  }

  // Entradas e contadores: acontecem uma única vez, na primeira aparição
  if (reduzir || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("js");
  var contadores = Array.prototype.slice.call(document.querySelectorAll("[data-contar]"));
  contadores.forEach(function (c) { c.textContent = "0"; });
  function contar(c) {
    var alvo = Number(c.dataset.contar);
    var t0 = performance.now();
    function tique(agora) {
      var k = Math.min(1, (agora - t0) / 1800);
      c.textContent = String(Math.round(alvo * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(tique);
    }
    requestAnimationFrame(tique);
  }
  var obs = new IntersectionObserver(function (entradas) {
    var i = 0;
    entradas.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      obs.unobserve(el);
      if (el.dataset.contar) { contar(el); return; }
      el.style.transitionDelay = (i * 0.09) + "s";
      i += 1;
      el.classList.add("is-in");
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".fl, .fr, .fu, .plan").forEach(function (el) { obs.observe(el); });
  contadores.forEach(function (c) { obs.observe(c); });
})();

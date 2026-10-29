// Configuração do Eleventy: gera HTML estático a partir de src/ em _site/.
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin/config.yml": "admin/config.yml" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  // Coleções editadas pelo painel
  eleventyConfig.addCollection("noticias", (api) =>
    api.getFilteredByGlob("src/noticias/*.md").sort((a, b) => b.date - a.date)
  );
  eleventyConfig.addCollection("equipe", (api) =>
    api.getFilteredByGlob("src/equipe/*.md").sort((a, b) => (a.data.ordem ?? 99) - (b.data.ordem ?? 99))
  );

  // Data no formato brasileiro
  eleventyConfig.addFilter("dataBR", (d) =>
    new Date(d).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));

  // Iniciais para quando o membro da equipe ainda não tem foto
  eleventyConfig.addFilter("iniciais", (nome = "") => {
    const partes = nome.trim().split(/\s+/);
    return ((partes[0]?.[0] ?? "") + (partes.length > 1 ? partes[partes.length - 1][0] : "")).toUpperCase();
  });

  // Imagens: no Netlify, passa pela Image CDN (redimensiona e converte para WebP/AVIF).
  // Localmente, usa o arquivo original.
  eleventyConfig.addFilter("img", (url, largura = 1200) => {
    if (!url) return "";
    if (!process.env.NETLIFY || /^https?:/.test(url)) return url;
    return `/.netlify/images?url=${encodeURIComponent(url)}&w=${largura}&fm=webp&q=78`;
  });

  eleventyConfig.addFilter("head", (arr = [], n = 1) => arr.slice(0, n));

  // Número de WhatsApp só com dígitos
  eleventyConfig.addFilter("soDigitos", (t = "") => String(t).replace(/\D/g, ""));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}

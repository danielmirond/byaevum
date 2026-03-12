/**
 * build-speeches.js
 * 
 * Genera:
 *   1. /discurso/<slug>/index.html — página estática para cada discurso publicado
 *   2. /news-sitemap.xml            — Google News Sitemap
 *   3. /sitemap.xml                 — Sitemap general actualizado
 * 
 * Lógica de publicación escalonada:
 *   - Lee queue.json (lista ordenada de todos los discursos pendientes)
 *   - Publica el siguiente de la cola si han pasado >= 10 min desde el último
 *   - Actualiza published.json con el historial real de publicación
 *   - GitHub Actions corre este script cada 10 min via cron
 */

const fs   = require('fs');
const path = require('path');

// ── Config ──────────────────────────────────────────────────────────────────
const DOMAIN       = process.env.SITE_DOMAIN || 'https://premios-oscar.com';
const PUBLISH_GAP  = 10 * 60 * 1000; // 10 minutos en ms
const ROOT         = path.resolve(__dirname, '..');
const QUEUE_FILE   = path.join(ROOT, 'data', 'queue.json');
const PUB_FILE     = path.join(ROOT, 'data', 'published.json');
const OUT_DIR      = path.join(ROOT, 'discurso');
const SITEMAP_NEWS = path.join(ROOT, 'news-sitemap.xml');
const SITEMAP_MAIN = path.join(ROOT, 'sitemap.xml');

// ── Datos de discursos ───────────────────────────────────────────────────────
// Importados directamente — única fuente de verdad
const SPEECHES = require('../data/speeches.json');

// ── Helpers ──────────────────────────────────────────────────────────────────
function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function speechSlug(sp) {
  // byline: "Mejor Actor · Leonardo DiCaprio"  → "leonardo-dicaprio-2016"
  // byline: "Mejor Película · Sean Baker"       → "sean-baker-2025"
  const parts = sp.byline.split('·').map(s => s.trim());
  const name  = parts.length >= 2 ? parts[1].split('·')[0].trim() : parts[0];
  const year  = (sp.edition.match(/(\d{4})/) || [])[1] || '';
  return slugify(`${name}-${year}`);
}

function formatISO(date) {
  return date.toISOString();
}

function fmtDateHuman(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

// ── Cargar / inicializar estado ───────────────────────────────────────────────
function loadJSON(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function saveJSON(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ── Generar HTML de página de discurso ───────────────────────────────────────
function generateSpeechHTML(sp, slug, publishedAt) {
  const url         = `${DOMAIN}/discurso/${slug}`;
  const pubISO      = formatISO(new Date(publishedAt));
  const pubHuman    = fmtDateHuman(publishedAt);
  const imageUrl    = `${DOMAIN}/og-default.jpg`; // imagen OG por defecto
  const wordCount   = sp.body.join(' ').split(/\s+/).length + sp.lead.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // NewsArticle JSON-LD — spec Google News
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": sp.headline,
    "description": sp.lead,
    "articleBody": [sp.lead, ...sp.body].join(' '),
    "url": url,
    "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    "datePublished": pubISO,
    "dateModified":  pubISO,
    "author": {
      "@type": "Organization",
      "name": "THE OSCAR",
      "url": DOMAIN
    },
    "publisher": {
      "@type": "Organization",
      "name": "THE OSCAR",
      "url": DOMAIN,
      "logo": {
        "@type": "ImageObject",
        "url": `${DOMAIN}/logo.png`,
        "width": 600,
        "height": 60
      }
    },
    "image": {
      "@type": "ImageObject",
      "url": imageUrl,
      "width": 1200,
      "height": 630
    },
    "articleSection": "Premios Oscar",
    "keywords": sp.tags.join(', ') + ', Oscar, Academy Awards, discurso',
    "inLanguage": "es",
    "about": {
      "@type": "Event",
      "name": `${sp.edition} Academy Awards`,
      "description": sp.byline
    }
  };

  // BreadcrumbList JSON-LD
  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "THE OSCAR", "item": DOMAIN },
      { "@type": "ListItem", "position": 2, "name": "Discursos", "item": `${DOMAIN}/#discursos` },
      { "@type": "ListItem", "position": 3, "name": sp.headline, "item": url }
    ]
  };

  const bodyHTML = sp.body.map(p => `    <p>${p}</p>`).join('\n');
  const tagsHTML = sp.tags.map(t =>
    `<span class="tag">${t}</span>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${sp.headline} | THE OSCAR</title>
<meta name="description" content="${sp.lead.substring(0, 155).replace(/"/g, '&quot;')}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="${url}">

<!-- Open Graph / Google Discover -->
<meta property="og:type"        content="article">
<meta property="og:url"         content="${url}">
<meta property="og:title"       content="${sp.headline.replace(/"/g, '&quot;')}">
<meta property="og:description" content="${sp.lead.substring(0, 155).replace(/"/g, '&quot;')}">
<meta property="og:image"       content="${imageUrl}">
<meta property="og:image:width"  content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name"   content="THE OSCAR">
<meta property="og:locale"      content="es_ES">
<meta property="article:published_time" content="${pubISO}">
<meta property="article:modified_time"  content="${pubISO}">
<meta property="article:section"        content="Premios Oscar">
${sp.tags.map(t => `<meta property="article:tag" content="${t}">`).join('\n')}

<!-- Twitter Card -->
<meta name="twitter:card"        content="summary_large_image">
<meta name="twitter:title"       content="${sp.headline.replace(/"/g, '&quot;')}">
<meta name="twitter:description" content="${sp.lead.substring(0, 155).replace(/"/g, '&quot;')}">
<meta name="twitter:image"       content="${imageUrl}">

<!-- JSON-LD Structured Data -->
<script type="application/ld+json">${JSON.stringify(jsonLD, null, 2)}</script>
<script type="application/ld+json">${JSON.stringify(breadcrumbLD, null, 2)}</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">

<style>
:root{--ink:#0d0d0d;--paper:#f5f0e8;--cream:#ede8dc;--gold:#c9a84c;--gold-light:#e8c96a;--gray:#6b6b6b;--gray-light:#c2bdb4;--border:#2a2a2a;--border-light:rgba(194,189,180,0.4)}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{background:var(--paper);color:var(--ink);font-family:'Cormorant Garamond',serif;font-size:19px;line-height:1.7;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}

/* NAV */
nav{background:var(--ink);border-bottom:2px solid var(--gold);padding:.7rem 3rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
.nav-logo{font-family:'Playfair Display',serif;font-weight:900;font-size:1.1rem;color:var(--gold);letter-spacing:.05em}
.nav-back{font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gray-light);transition:color .2s}
.nav-back:hover{color:var(--gold)}

/* ARTICLE LAYOUT */
.article-wrap{max-width:780px;margin:0 auto;padding:4rem 2rem 6rem}

/* BREADCRUMB */
.breadcrumb{font-family:'DM Mono',monospace;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;color:var(--gray);margin-bottom:2.5rem;display:flex;gap:.6rem;align-items:center}
.breadcrumb span{color:var(--border-light)}

/* EDITION + CATEGORY */
.art-edition-tag{font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);border:1px solid var(--gold);padding:.3rem .7rem;display:inline-block;margin-bottom:1.2rem}
.art-category{font-family:'DM Mono',monospace;font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gray);margin-bottom:1rem}

/* HEADLINE */
h1{font-family:'Playfair Display',serif;font-size:clamp(1.9rem,4vw,2.8rem);font-weight:900;line-height:1.1;letter-spacing:-.02em;margin-bottom:1.2rem}

/* META */
.art-meta{display:flex;align-items:center;gap:1.5rem;padding:1rem 0;border-top:1px solid var(--border-light);border-bottom:1px solid var(--border-light);margin-bottom:2.5rem;flex-wrap:wrap}
.art-meta-item{font-family:'DM Mono',monospace;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;color:var(--gray)}
.art-meta-item strong{color:var(--ink)}

/* LEAD */
.art-lead{font-size:1.2rem;font-weight:600;line-height:1.6;color:var(--ink);margin-bottom:2rem;font-style:italic}

/* PULL QUOTE */
.pull{border-left:3px solid var(--gold);padding:1.5rem 2rem;margin:2.5rem 0;background:var(--cream)}
.pull-text{font-family:'Playfair Display',serif;font-size:1.35rem;font-style:italic;line-height:1.4;color:var(--ink);margin-bottom:.8rem}
.pull-attr{font-family:'DM Mono',monospace;font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gray)}

/* BODY */
.art-body p{margin-bottom:1.4rem;font-size:1rem;line-height:1.8}

/* TAGS */
.tags{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid var(--border-light)}
.tag{font-family:'DM Mono',monospace;font-size:.55rem;letter-spacing:.12em;text-transform:uppercase;border:1px solid var(--border-light);padding:.2rem .6rem;color:var(--gray)}

/* FOOTER NAV */
.article-footer{margin-top:4rem;padding-top:2rem;border-top:2px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:gap}
.footer-logo{font-family:'Playfair Display',serif;font-weight:900;font-size:1.5rem;color:var(--gold)}
.footer-link{font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);border:1px solid var(--gold);padding:.4rem 1rem}
.footer-link:hover{background:var(--gold);color:var(--ink)}

/* SHARE */
.share-row{margin:2rem 0;display:flex;gap:.8rem;align-items:center;flex-wrap:wrap}
.share-label{font-family:'DM Mono',monospace;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;color:var(--gray)}
.share-btn{font-family:'DM Mono',monospace;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;background:transparent;border:1px solid var(--border-light);color:var(--gray);padding:.3rem .8rem;cursor:pointer;transition:all .2s}
.share-btn:hover{border-color:var(--gold);color:var(--gold)}

@media(max-width:600px){
  nav{padding:.7rem 1.2rem}
  .article-wrap{padding:2.5rem 1.2rem 4rem}
  h1{font-size:1.7rem}
  .pull{padding:1rem 1.2rem}
}
</style>
</head>
<body>

<nav>
  <a href="${DOMAIN}" class="nav-logo">THE OSCAR</a>
  <a href="${DOMAIN}/#discursos" class="nav-back">← Todos los discursos</a>
</nav>

<main class="article-wrap">
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="${DOMAIN}">THE OSCAR</a>
    <span>/</span>
    <a href="${DOMAIN}/#discursos">Discursos</a>
    <span>/</span>
    <span>${sp.byline}</span>
  </nav>

  <div class="art-edition-tag">${sp.edition}</div>
  <p class="art-category">${sp.byline}</p>

  <h1>${sp.headline}</h1>

  <div class="art-meta">
    <div class="art-meta-item">Publicado <strong>${pubHuman}</strong></div>
    <div class="art-meta-item">⏱ <strong>${readingTime} min</strong> lectura</div>
    <div class="art-meta-item">THE OSCAR — Historia de los Academy Awards</div>
  </div>

  <p class="art-lead">${sp.lead}</p>

  <div class="pull">
    <div class="pull-text">«${sp.pullQuote}»</div>
    <div class="pull-attr">${sp.pullAttr}</div>
  </div>

  <div class="art-body">
    ${bodyHTML}
  </div>

  <div class="share-row">
    <span class="share-label">Compartir:</span>
    <button class="share-btn" onclick="navigator.clipboard.writeText(window.location.href).then(()=>{this.textContent='✓ Copiado';setTimeout(()=>this.textContent='🔗 Copiar enlace',2000)})">🔗 Copiar enlace</button>
    <a class="share-btn" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(sp.headline)}" target="_blank" rel="noopener">Twitter/X</a>
  </div>

  <div class="tags">
    ${tagsHTML}
  </div>

  <footer class="article-footer">
    <div class="footer-logo">THE OSCAR</div>
    <a href="${DOMAIN}/#discursos" class="footer-link">Ver todos los discursos →</a>
  </footer>
</main>

<!-- SPA fallback: si el usuario llega a esta página directamente, la SPA también funciona -->
<script>
  // Preload de la SPA para navegación interna
  if(document.referrer.includes('${DOMAIN}') === false) {
    // Usuario viene de Google — está en la página estática correcta, no hacer nada
  }
</script>

</body>
</html>`;
}

// ── Generar News Sitemap XML ──────────────────────────────────────────────────
function generateNewsSitemap(published) {
  // Google News Sitemap solo indexa artículos de los últimos 2 días para noticias nuevas
  // pero mantener todos para que Google los recuerde
  const entries = published.map(p => {
    const sp  = SPEECHES.find(s => s.id === p.id);
    if (!sp) return '';
    const slug = speechSlug(sp);
    const url  = `${DOMAIN}/discurso/${slug}`;
    const pub  = new Date(p.publishedAt).toISOString();

    return `  <url>
    <loc>${url}</loc>
    <news:news>
      <news:publication>
        <news:name>THE OSCAR</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${pub}</news:publication_date>
      <news:title>${escapeXML(sp.headline)}</news:title>
      <news:keywords>${escapeXML(sp.tags.join(', ') + ', Oscar, Academy Awards')}</news:keywords>
    </news:news>
    <lastmod>${pub}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).filter(Boolean).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${entries}
</urlset>`;
}

// ── Generar Sitemap General ──────────────────────────────────────────────────
function generateMainSitemap(published) {
  const now = new Date().toISOString();

  // URLs estáticas base
  const staticURLs = [
    { url: DOMAIN, priority: '1.0', changefreq: 'daily' },
    { url: `${DOMAIN}/#ceremonias`, priority: '0.9', changefreq: 'monthly' },
    { url: `${DOMAIN}/#discursos`, priority: '0.9', changefreq: 'daily' },
    { url: `${DOMAIN}/#datos`, priority: '0.7', changefreq: 'monthly' },
  ];

  const staticEntries = staticURLs.map(s => `  <url>
    <loc>${s.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${s.changefreq}</changefreq>
    <priority>${s.priority}</priority>
  </url>`).join('\n');

  // URLs de discursos publicados
  const speechEntries = published.map(p => {
    const sp = SPEECHES.find(s => s.id === p.id);
    if (!sp) return '';
    const slug = speechSlug(sp);
    const pub  = new Date(p.publishedAt).toISOString();
    return `  <url>
    <loc>${DOMAIN}/discurso/${slug}</loc>
    <lastmod>${pub}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).filter(Boolean).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${speechEntries}
</urlset>`;
}

function escapeXML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ── Main ─────────────────────────────────────────────────────────────────────
function main() {
  console.log('🎬 THE OSCAR — Build de discursos iniciado');

  // 1. Cargar estado actual
  const queue    = loadJSON(QUEUE_FILE, SPEECHES.map(s => s.id));
  const published = loadJSON(PUB_FILE, []);

  const publishedIds = new Set(published.map(p => p.id));
  const now = Date.now();

  // 2. Determinar si publicar el siguiente
  const lastPub = published.length > 0
    ? new Date(published[published.length - 1].publishedAt).getTime()
    : 0;

  const pending = queue.filter(id => !publishedIds.has(id));

  let newlyPublished = false;

  if (pending.length > 0 && (now - lastPub) >= PUBLISH_GAP) {
    const nextId = pending[0];
    const sp = SPEECHES.find(s => s.id === nextId);

    if (sp) {
      const slug = speechSlug(sp);
      const publishedAt = new Date().toISOString();

      // Generar página HTML
      const outDir = path.join(OUT_DIR, slug);
      fs.mkdirSync(outDir, { recursive: true });
      const html = generateSpeechHTML(sp, slug, publishedAt);
      fs.writeFileSync(path.join(outDir, 'index.html'), html);

      // Actualizar published.json
      published.push({ id: nextId, slug, publishedAt, headline: sp.headline });
      saveJSON(PUB_FILE, published);

      newlyPublished = true;
      console.log(`✅ Publicado: [${nextId}] "${sp.headline}"`);
      console.log(`   URL: ${DOMAIN}/discurso/${slug}`);
      console.log(`   Pendientes: ${pending.length - 1}`);
    }
  } else if (pending.length === 0) {
    console.log('ℹ️  Todos los discursos ya están publicados');
  } else {
    const minutesLeft = Math.ceil((PUBLISH_GAP - (now - lastPub)) / 60000);
    console.log(`⏳ Próxima publicación en ~${minutesLeft} min`);
  }

  // 3. Regenerar páginas de todos los publicados (asegurar consistencia)
  published.forEach(p => {
    const sp = SPEECHES.find(s => s.id === p.id);
    if (!sp) return;
    const outDir = path.join(OUT_DIR, p.slug);
    if (!fs.existsSync(path.join(outDir, 'index.html')) || newlyPublished) {
      fs.mkdirSync(outDir, { recursive: true });
      const html = generateSpeechHTML(sp, p.slug, p.publishedAt);
      fs.writeFileSync(path.join(outDir, 'index.html'), html);
    }
  });

  // 4. Generar sitemaps
  const newsSitemap = generateNewsSitemap(published);
  fs.writeFileSync(SITEMAP_NEWS, newsSitemap);

  const mainSitemap = generateMainSitemap(published);
  fs.writeFileSync(SITEMAP_MAIN, mainSitemap);

  console.log(`📍 Sitemap News: ${published.length} URLs → /news-sitemap.xml`);
  console.log(`📍 Sitemap General actualizado → /sitemap.xml`);
  console.log('✨ Build completado');
}

main();

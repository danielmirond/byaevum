/**
 * build-static.js
 * Genera ~433 páginas estáticas:
 *   /ceremonia/:n/index.html         → Event + ItemList JSON-LD
 *   /pelicula/:slug/index.html       → Movie + BreadcrumbList JSON-LD
 *   /actor/:slug/index.html          → Person + ItemList JSON-LD
 *   /directora/:slug/index.html      → Person + ItemList JSON-LD
 * Actualiza sitemap.xml con todas las URLs
 */

const fs   = require('fs');
const path = require('path');

const DOMAIN = process.env.SITE_DOMAIN || 'https://theoscar.vercel.app';
const ROOT   = path.resolve(__dirname, '..');
const DB     = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/db.json')));

// ── Helpers ──────────────────────────────────────────────────────────────────
function slugify(str) {
  return (str || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').replace(/-+/g, '-');
}
function esc(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function imdbMovieUrl(id) { return id ? `https://www.imdb.com/title/${id}/` : null; }
function imdbPersonUrl(id){ return id ? `https://www.imdb.com/name/${id}/` : null; }
function write(filePath, html) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html);
}

// Fecha estimada de la ceremonia (siempre en marzo/abril del año siguiente)
function ceremonyDate(year) {
  return `${parseInt(year) + 1}-03-15`;
}

// ── CSS compartido ────────────────────────────────────────────────────────────
const SHARED_CSS = `
:root{--ink:#0d0d0d;--paper:#f5f0e8;--cream:#ede8dc;--gold:#c9a84c;--gold-light:#e8c96a;--gray:#6b6b6b;--gray-light:#c2bdb4;--border:#2a2a2a;--border-light:rgba(194,189,180,0.4)}
*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
body{background:var(--paper);color:var(--ink);font-family:'Cormorant Garamond',serif;font-size:18px;line-height:1.7;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
nav{background:var(--ink);border-bottom:2px solid var(--gold);padding:.7rem 3rem;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
.nav-logo{font-family:'Playfair Display',serif;font-weight:900;font-size:1.1rem;color:var(--gold);letter-spacing:.05em}
.nav-back{font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gray-light);transition:color .2s}
.nav-back:hover{color:var(--gold)}
.page-wrap{max-width:900px;margin:0 auto;padding:4rem 2rem 6rem}
.breadcrumb{font-family:'DM Mono',monospace;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;color:var(--gray);margin-bottom:2.5rem;display:flex;gap:.6rem;align-items:center;flex-wrap:wrap}
.breadcrumb span{color:var(--border-light)}
.edition-tag{font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);border:1px solid var(--gold);padding:.3rem .7rem;display:inline-block;margin-bottom:1.2rem}
.page-cat{font-family:'DM Mono',monospace;font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gray);margin-bottom:1rem}
h1{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,2.8rem);font-weight:900;line-height:1.1;letter-spacing:-.02em;margin-bottom:1.2rem}
h2{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;margin:2.5rem 0 1rem;padding-bottom:.5rem;border-bottom:1px solid var(--border-light)}
.meta-row{display:flex;align-items:center;gap:1.5rem;padding:1rem 0;border-top:1px solid var(--border-light);border-bottom:1px solid var(--border-light);margin-bottom:2.5rem;flex-wrap:wrap}
.meta-item{font-family:'DM Mono',monospace;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;color:var(--gray)}
.meta-item strong{color:var(--ink)}
.winner-card{background:var(--cream);border-left:3px solid var(--gold);padding:1.2rem 1.5rem;margin-bottom:1rem}
.winner-cat{font-family:'DM Mono',monospace;font-size:.55rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);margin-bottom:.3rem}
.winner-name{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;margin-bottom:.2rem}
.winner-film{font-family:'Cormorant Garamond',serif;font-size:.9rem;font-style:italic;color:var(--gray)}
.speech-block{background:#f0ebe0;border-left:2px solid var(--border-light);padding:1rem 1.5rem;margin-top:.8rem;font-style:italic;font-size:.9rem;color:var(--gray)}
.award-item{padding:.8rem 0;border-bottom:1px solid var(--border-light);display:grid;grid-template-columns:80px 1fr;gap:1rem;align-items:start}
.award-year{font-family:'DM Mono',monospace;font-size:.7rem;color:var(--gold);font-weight:600}
.award-detail{font-size:.95rem}
.award-cat{font-family:'DM Mono',monospace;font-size:.55rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gray);margin-bottom:.2rem}
.imdb-link{font-family:'DM Mono',monospace;font-size:.5rem;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);border:1px solid var(--gold);padding:.15rem .5rem;display:inline-block;margin-top:.4rem}
.imdb-link:hover{background:var(--gold);color:var(--ink)}
.note-box{background:var(--cream);padding:1.2rem 1.5rem;margin:2rem 0;border-top:2px solid var(--ink)}
.note-box p{font-size:.95rem;color:var(--gray)}
.tags{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:2rem;padding-top:1.5rem;border-top:1px solid var(--border-light)}
.tag{font-family:'DM Mono',monospace;font-size:.55rem;letter-spacing:.12em;text-transform:uppercase;border:1px solid var(--border-light);padding:.2rem .6rem;color:var(--gray)}
.article-footer{margin-top:4rem;padding-top:2rem;border-top:2px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
.footer-logo{font-family:'Playfair Display',serif;font-weight:900;font-size:1.5rem;color:var(--gold)}
.footer-link{font-family:'DM Mono',monospace;font-size:.6rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);border:1px solid var(--gold);padding:.4rem 1rem;transition:all .2s}
.footer-link:hover{background:var(--gold);color:var(--ink)}
.nav-prev-next{display:flex;gap:1rem;margin-bottom:2rem;flex-wrap:wrap}
.nav-adj{font-family:'DM Mono',monospace;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);border:1px solid rgba(201,168,76,.4);padding:.3rem .8rem}
.nav-adj:hover{background:var(--gold);color:var(--ink)}
@media(max-width:600px){nav{padding:.7rem 1.2rem}.page-wrap{padding:2.5rem 1.2rem 4rem}h1{font-size:1.6rem}.award-item{grid-template-columns:1fr}}
`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">`;

function navHTML(backHref, backLabel) {
  return `<nav>
  <a href="${DOMAIN}" class="nav-logo">THE OSCAR</a>
  <a href="${backHref}" class="nav-back">← ${backLabel}</a>
</nav>`;
}
function footerHTML(label, href) {
  return `<footer class="article-footer">
  <div class="footer-logo">THE OSCAR</div>
  <a href="${href}" class="footer-link">${label} →</a>
</footer>`;
}
function shareBtn(url, title) {
  return `<div style="margin-top:2rem;display:flex;gap:.8rem;flex-wrap:wrap;align-items:center">
  <span style="font-family:'DM Mono',monospace;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;color:var(--gray)">Compartir:</span>
  <button onclick="navigator.clipboard.writeText('${url}').then(()=>{this.textContent='✓ Copiado';setTimeout(()=>this.textContent='🔗 Copiar enlace',2000)})" style="font-family:'DM Mono',monospace;font-size:.58rem;letter-spacing:.1em;background:transparent;border:1px solid rgba(194,189,180,0.4);color:var(--gray);padding:.3rem .8rem;cursor:pointer">🔗 Copiar enlace</button>
  <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}" target="_blank" rel="noopener" style="font-family:'DM Mono',monospace;font-size:.58rem;letter-spacing:.1em;text-transform:uppercase;border:1px solid rgba(194,189,180,0.4);color:var(--gray);padding:.3rem .8rem">Twitter/X</a>
</div>`;
}

// ── 1. PÁGINAS DE CEREMONIA (/ceremonia/:n) ───────────────────────────────────
function buildCeremonyPage(c) {
  const url      = `${DOMAIN}/ceremonia/${c.n}`;
  const title    = `${c.n}ª Ceremonia de los Oscar (${parseInt(c.year)+1}) | THE OSCAR`;
  const desc     = `Ganadores de la ${c.n}ª entrega de los Academy Awards (${parseInt(c.year)+1}): ${c.picture?.film} como Mejor Película, ${c.actor?.name} como Mejor Actor y ${c.actress?.name} como Mejor Actriz.`;
  const dateISO  = ceremonyDate(c.year);
  const prevUrl  = c.n > 1  ? `${DOMAIN}/ceremonia/${c.n - 1}` : null;
  const nextUrl  = c.n < 97 ? `${DOMAIN}/ceremonia/${c.n + 1}` : null;

  // JSON-LD: Event + ItemList
  const eventLD = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": `${c.n}ª Ceremonia de los Premios Oscar`,
    "alternateName": `${c.n}th Academy Awards`,
    "startDate": dateISO,
    "endDate": dateISO,
    "url": url,
    "location": {
      "@type": "Place",
      "name": c.venue,
      "address": { "@type": "PostalAddress", "addressLocality": "Los Angeles", "addressCountry": "US" }
    },
    "organizer": { "@type": "Organization", "name": "Academy of Motion Picture Arts and Sciences", "url": "https://www.oscars.org" },
    "description": desc,
    "about": { "@type": "Thing", "name": "Academy Awards" }
  };

  const itemListLD = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Ganadores de la ${c.n}ª Ceremonia de los Oscar`,
    "url": url,
    "numberOfItems": 4,
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Mejor Película", "item": { "@type": "Movie", "name": c.picture?.film, "url": imdbMovieUrl(c.picture?.imdb) || url } },
      { "@type": "ListItem", "position": 2, "name": "Mejor Director", "item": { "@type": "Person", "name": c.director?.name } },
      { "@type": "ListItem", "position": 3, "name": "Mejor Actor",    "item": { "@type": "Person", "name": c.actor?.name, "url": imdbPersonUrl(c.actor?.imdb) || url } },
      { "@type": "ListItem", "position": 4, "name": "Mejor Actriz",   "item": { "@type": "Person", "name": c.actress?.name, "url": imdbPersonUrl(c.actress?.imdb) || url } }
    ]
  };

  const breadLD = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "THE OSCAR", "item": DOMAIN },
      { "@type": "ListItem", "position": 2, "name": "Ceremonias", "item": `${DOMAIN}/#ceremonias` },
      { "@type": "ListItem", "position": 3, "name": `${c.n}ª Ceremonia`, "item": url }
    ]
  };

  const pelSlug   = `${slugify(c.picture?.film)}-${c.year}`;
  const actorSlug = slugify(c.actor?.name);
  const actressSlug = slugify(c.actress?.name);
  const dirSlug   = slugify(c.director?.name);

  const adjNav = [
    prevUrl ? `<a href="${prevUrl}" class="nav-adj">← ${c.n-1}ª Ceremonia</a>` : '',
    nextUrl ? `<a href="${nextUrl}" class="nav-adj">${c.n+1}ª Ceremonia →</a>` : ''
  ].filter(Boolean).join('');

  const speechBlock = (speech) => speech
    ? `<div class="speech-block">«${esc(speech)}»</div>` : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="${url}">
<meta property="og:type"        content="website">
<meta property="og:url"         content="${url}">
<meta property="og:title"       content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:site_name"   content="THE OSCAR">
<meta property="og:locale"      content="es_ES">
<meta name="twitter:card"        content="summary">
<meta name="twitter:title"       content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<script type="application/ld+json">${JSON.stringify(eventLD)}</script>
<script type="application/ld+json">${JSON.stringify(itemListLD)}</script>
<script type="application/ld+json">${JSON.stringify(breadLD)}</script>
${FONTS}
<style>${SHARED_CSS}</style>
</head>
<body>
${navHTML(`${DOMAIN}/#ceremonias`, 'Todas las ceremonias')}
<main class="page-wrap">
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="${DOMAIN}">THE OSCAR</a><span>/</span>
    <a href="${DOMAIN}/#ceremonias">Ceremonias</a><span>/</span>
    <span>${c.n}ª Ceremonia</span>
  </nav>
  ${adjNav ? `<div class="nav-prev-next">${adjNav}</div>` : ''}
  <div class="edition-tag">${c.n}ª Ceremonia · ${parseInt(c.year)+1}</div>
  <p class="page-cat">Academy Awards · ${c.year} (películas) · ${c.venue}</p>
  <h1>${c.n}ª Entrega de los Premios Oscar</h1>
  <div class="meta-row">
    <div class="meta-item">Año de películas <strong>${c.year}</strong></div>
    <div class="meta-item">Sede <strong>${c.venue?.split(',')[0]}</strong></div>
    <div class="meta-item">Edición <strong>${c.n}ª</strong></div>
  </div>

  <h2>Mejor Película</h2>
  <div class="winner-card">
    <div class="winner-cat">Mejor Película</div>
    <div class="winner-name"><a href="${DOMAIN}/pelicula/${pelSlug}">${esc(c.picture?.film)}</a></div>
    <div class="winner-film">Dirigida por ${esc(c.picture?.dir)}</div>
    ${c.picture?.note ? `<p style="margin-top:.5rem;font-size:.9rem;color:var(--gray)">${esc(c.picture.note)}</p>` : ''}
    ${c.picture?.imdb ? `<a href="${imdbMovieUrl(c.picture.imdb)}" class="imdb-link" target="_blank" rel="noopener">Ver en IMDb ↗</a>` : ''}
  </div>

  <h2>Interpretación</h2>
  <div class="winner-card">
    <div class="winner-cat">Mejor Actor</div>
    <div class="winner-name"><a href="${DOMAIN}/actor/${actorSlug}">${esc(c.actor?.name)}</a></div>
    <div class="winner-film">por <em>${esc(c.actor?.film)}</em></div>
    ${speechBlock(c.actor?.speech)}
    ${c.actor?.imdb ? `<a href="${imdbPersonUrl(c.actor.imdb)}" class="imdb-link" target="_blank" rel="noopener">Ver en IMDb ↗</a>` : ''}
  </div>
  <div class="winner-card">
    <div class="winner-cat">Mejor Actriz</div>
    <div class="winner-name"><a href="${DOMAIN}/actor/${actressSlug}">${esc(c.actress?.name)}</a></div>
    <div class="winner-film">por <em>${esc(c.actress?.film)}</em></div>
    ${speechBlock(c.actress?.speech)}
    ${c.actress?.imdb ? `<a href="${imdbPersonUrl(c.actress.imdb)}" class="imdb-link" target="_blank" rel="noopener">Ver en IMDb ↗</a>` : ''}
  </div>
  <div class="winner-card">
    <div class="winner-cat">Mejor Director</div>
    <div class="winner-name"><a href="${DOMAIN}/director/${dirSlug}">${esc(c.director?.name)}</a></div>
    <div class="winner-film">por <em>${esc(c.director?.film)}</em></div>
  </div>

  ${c.tags?.length ? `<div class="tags">${c.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>` : ''}
  ${shareBtn(url, `${c.n}ª Ceremonia Oscar (${parseInt(c.year)+1}) — ganadores y discursos`)}
  ${footerHTML('Ver todas las ceremonias', `${DOMAIN}/#ceremonias`)}
</main>
</body></html>`;
}

// ── 2. PÁGINAS DE PELÍCULA (/pelicula/:slug) ───────────────────────────────────
function buildMoviePage(c) {
  const slug = `${slugify(c.picture.film)}-${c.year}`;
  const url  = `${DOMAIN}/pelicula/${slug}`;
  const title = `${c.picture.film} (${c.year}) — Ganadora del Oscar | THE OSCAR`;
  const desc  = `${c.picture.film} ganó el Oscar a Mejor Película en la ${c.n}ª ceremonia (${parseInt(c.year)+1}). Dirigida por ${c.picture.dir}.${c.picture.note ? ' ' + c.picture.note : ''}`;

  const movieLD = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": c.picture.film,
    "url": url,
    "description": desc,
    "dateCreated": c.year,
    "director": { "@type": "Person", "name": c.director?.name || c.picture.dir },
    ...(c.picture.imdb ? { "sameAs": imdbMovieUrl(c.picture.imdb) } : {}),
    "award": `Oscar a Mejor Película — ${c.n}ª Ceremonia (${parseInt(c.year)+1})`,
    "inLanguage": "en",
    "countryOfOrigin": { "@type": "Country", "name": "United States" }
  };

  const breadLD = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "THE OSCAR", "item": DOMAIN },
      { "@type": "ListItem", "position": 2, "name": "Ceremonias", "item": `${DOMAIN}/#ceremonias` },
      { "@type": "ListItem", "position": 3, "name": `${c.n}ª Ceremonia`, "item": `${DOMAIN}/ceremonia/${c.n}` },
      { "@type": "ListItem", "position": 4, "name": c.picture.film, "item": url }
    ]
  };

  const actorSlug   = slugify(c.actor?.name);
  const actressSlug = slugify(c.actress?.name);
  const dirSlug     = slugify(c.director?.name);

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="${url}">
<meta property="og:type"        content="video.movie">
<meta property="og:url"         content="${url}">
<meta property="og:title"       content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:site_name"   content="THE OSCAR">
<meta property="og:locale"      content="es_ES">
<meta name="twitter:card"       content="summary">
<meta name="twitter:title"      content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<script type="application/ld+json">${JSON.stringify(movieLD)}</script>
<script type="application/ld+json">${JSON.stringify(breadLD)}</script>
${FONTS}
<style>${SHARED_CSS}</style>
</head>
<body>
${navHTML(`${DOMAIN}/ceremonia/${c.n}`, `${c.n}ª Ceremonia`)}
<main class="page-wrap">
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="${DOMAIN}">THE OSCAR</a><span>/</span>
    <a href="${DOMAIN}/ceremonia/${c.n}">${c.n}ª Ceremonia</a><span>/</span>
    <span>${esc(c.picture.film)}</span>
  </nav>
  <div class="edition-tag">Mejor Película · ${c.n}ª Ceremonia · ${parseInt(c.year)+1}</div>
  <p class="page-cat">Oscar a Mejor Película · ${c.year}</p>
  <h1>${esc(c.picture.film)}</h1>
  <div class="meta-row">
    <div class="meta-item">Año <strong>${c.year}</strong></div>
    <div class="meta-item">Director <strong><a href="${DOMAIN}/director/${dirSlug}">${esc(c.director?.name || c.picture.dir)}</a></strong></div>
    <div class="meta-item">Ceremonia <strong><a href="${DOMAIN}/ceremonia/${c.n}">${c.n}ª</a></strong></div>
    ${c.picture.imdb ? `<div class="meta-item"><a href="${imdbMovieUrl(c.picture.imdb)}" target="_blank" rel="noopener" style="color:var(--gold)">IMDb ↗</a></div>` : ''}
  </div>
  ${c.picture.note ? `<div class="note-box"><p>${esc(c.picture.note)}</p></div>` : ''}

  <h2>Ganadores de la misma ceremonia</h2>
  ${c.director?.name ? `<div class="winner-card">
    <div class="winner-cat">Mejor Director</div>
    <div class="winner-name"><a href="${DOMAIN}/director/${dirSlug}">${esc(c.director.name)}</a></div>
    <div class="winner-film">por <em>${esc(c.director.film)}</em></div>
  </div>` : ''}
  ${c.actor?.name ? `<div class="winner-card">
    <div class="winner-cat">Mejor Actor</div>
    <div class="winner-name"><a href="${DOMAIN}/actor/${actorSlug}">${esc(c.actor.name)}</a></div>
    <div class="winner-film">por <em>${esc(c.actor.film)}</em></div>
    ${c.actor.speech ? `<div class="speech-block">«${esc(c.actor.speech)}»</div>` : ''}
  </div>` : ''}
  ${c.actress?.name ? `<div class="winner-card">
    <div class="winner-cat">Mejor Actriz</div>
    <div class="winner-name"><a href="${DOMAIN}/actor/${actressSlug}">${esc(c.actress.name)}</a></div>
    <div class="winner-film">por <em>${esc(c.actress.film)}</em></div>
    ${c.actress.speech ? `<div class="speech-block">«${esc(c.actress.speech)}»</div>` : ''}
  </div>` : ''}

  ${shareBtn(url, `${c.picture.film} — Oscar a Mejor Película ${parseInt(c.year)+1}`)}
  ${footerHTML(`Ver ${c.n}ª Ceremonia completa`, `${DOMAIN}/ceremonia/${c.n}`)}
</main>
</body></html>`;
}

// ── 3. PÁGINAS DE PERSONA (actor/actriz/director) ─────────────────────────────
function buildPersonPage(name, wins, role) {
  const slug     = slugify(name);
  const basePath = role === 'director' ? 'director' : 'actor';
  const url      = `${DOMAIN}/${basePath}/${slug}`;
  const roleLabel = role === 'director' ? 'Director' : (role === 'actress' ? 'Actriz' : 'Actor');
  const firstImdb = wins.find(w => w.imdb)?.imdb;
  const yearsStr  = wins.map(w => w.year).join(', ');
  const films     = wins.map(w => w.film).filter(Boolean).join(', ');
  const title     = `${name} — Ganador/a del Oscar | THE OSCAR`;
  const desc      = `${name} ganó ${wins.length > 1 ? wins.length + ' veces' : 'el'} Oscar a Mejor ${roleLabel}${films ? ' por ' + films.split(',')[0] : ''} (${yearsStr}).`;

  const personLD = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "url": url,
    ...(firstImdb ? { "sameAs": imdbPersonUrl(firstImdb) } : {}),
    "award": wins.map(w => `Oscar a Mejor ${roleLabel} (${parseInt(w.year)+1})`),
    "knowsAbout": "Cine",
  };

  const itemListLD = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Premios Oscar de ${name}`,
    "url": url,
    "numberOfItems": wins.length,
    "itemListElement": wins.map((w, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": `Oscar a Mejor ${roleLabel} — ${c_by_year(w.year)?.n}ª Ceremonia (${parseInt(w.year)+1})`,
      "item": { "@type": "Movie", "name": w.film, "url": `${DOMAIN}/pelicula/${slugify(w.film)}-${w.year}` }
    }))
  };

  const breadLD = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "THE OSCAR", "item": DOMAIN },
      { "@type": "ListItem", "position": 2, "name": roleLabel + 's', "item": DOMAIN },
      { "@type": "ListItem", "position": 3, "name": name, "item": url }
    ]
  };

  const winsHTML = wins.map(w => {
    const c = c_by_year(w.year);
    return `<div class="award-item">
      <div class="award-year">${parseInt(w.year)+1}<br><span style="font-size:.5rem;opacity:.6">${c?.n}ª</span></div>
      <div class="award-detail">
        <div class="award-cat">Oscar · Mejor ${roleLabel}</div>
        <div style="font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700">
          <a href="${DOMAIN}/pelicula/${slugify(w.film)}-${w.year}">${esc(w.film)}</a>
        </div>
        ${w.speech ? `<div class="speech-block" style="margin-top:.5rem">«${esc(w.speech)}»</div>` : ''}
        ${c ? `<a href="${DOMAIN}/ceremonia/${c.n}" style="font-family:'DM Mono',monospace;font-size:.5rem;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin-top:.5rem;display:inline-block">Ver ceremonia ${c.n}ª →</a>` : ''}
      </div>
    </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="${url}">
<meta property="og:type"        content="profile">
<meta property="og:url"         content="${url}">
<meta property="og:title"       content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:site_name"   content="THE OSCAR">
<meta property="og:locale"      content="es_ES">
<meta name="twitter:card"       content="summary">
<meta name="twitter:title"      content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<script type="application/ld+json">${JSON.stringify(personLD)}</script>
<script type="application/ld+json">${JSON.stringify(itemListLD)}</script>
<script type="application/ld+json">${JSON.stringify(breadLD)}</script>
${FONTS}
<style>${SHARED_CSS}</style>
</head>
<body>
${navHTML(`${DOMAIN}/#ceremonias`, 'Todas las ceremonias')}
<main class="page-wrap">
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="${DOMAIN}">THE OSCAR</a><span>/</span>
    <span>${roleLabel}es</span><span>/</span>
    <span>${esc(name)}</span>
  </nav>
  <div class="edition-tag">${wins.length} Oscar${wins.length > 1 ? 's' : ''} · Mejor ${roleLabel}</div>
  <p class="page-cat">Ganador/a del Oscar · ${roleLabel}</p>
  <h1>${esc(name)}</h1>
  <div class="meta-row">
    <div class="meta-item">Premios <strong>${wins.length} Oscar${wins.length > 1 ? 's' : ''}</strong></div>
    <div class="meta-item">Años <strong>${yearsStr}</strong></div>
    <div class="meta-item">Categoría <strong>Mejor ${roleLabel}</strong></div>
    ${firstImdb ? `<div class="meta-item"><a href="${imdbPersonUrl(firstImdb)}" target="_blank" rel="noopener" style="color:var(--gold)">IMDb ↗</a></div>` : ''}
  </div>

  <h2>Premios Oscar</h2>
  ${winsHTML}

  ${shareBtn(url, `${name} — ${wins.length} Oscar${wins.length > 1 ? 's' : ''} a Mejor ${roleLabel}`)}
  ${footerHTML('Ver todas las ceremonias', `${DOMAIN}/#ceremonias`)}
</main>
</body></html>`;
}

// Lookup rápido por año
const dbByYear = {};
DB.forEach(c => { dbByYear[c.year] = c; });
function c_by_year(year) { return dbByYear[year]; }

// ── MAIN BUILD ────────────────────────────────────────────────────────────────
console.log('🎬 THE OSCAR — Build de páginas estáticas\n');

let count = 0;
const allUrls = [];

// 1. Ceremonias
DB.forEach(c => {
  const html = buildCeremonyPage(c);
  write(path.join(ROOT, 'ceremonia', String(c.n), 'index.html'), html);
  allUrls.push({ url: `${DOMAIN}/ceremonia/${c.n}`, pri: '0.9', freq: 'yearly' });
  count++;
});
console.log(`✅ ${DB.length} páginas de ceremonia`);

// 2. Películas
DB.filter(c => c.picture?.film).forEach(c => {
  const slug = `${slugify(c.picture.film)}-${c.year}`;
  const html = buildMoviePage(c);
  write(path.join(ROOT, 'pelicula', slug, 'index.html'), html);
  allUrls.push({ url: `${DOMAIN}/pelicula/${slug}`, pri: '0.8', freq: 'never' });
  count++;
});
console.log(`✅ ${DB.filter(c=>c.picture?.film).length} páginas de película`);

// 3. Actores (agrupa múltiples victorias)
const actorWins = {};
DB.forEach(c => {
  if (!c.actor?.name) return;
  const n = c.actor.name;
  if (!actorWins[n]) actorWins[n] = [];
  actorWins[n].push({ year: c.year, film: c.actor.film, speech: c.actor.speech, imdb: c.actor.imdb });
});
Object.entries(actorWins).forEach(([name, wins]) => {
  const slug = slugify(name);
  const html = buildPersonPage(name, wins, 'actor');
  write(path.join(ROOT, 'actor', slug, 'index.html'), html);
  allUrls.push({ url: `${DOMAIN}/actor/${slug}`, pri: '0.7', freq: 'never' });
  count++;
});
console.log(`✅ ${Object.keys(actorWins).length} páginas de actor`);

// 4. Actrices
const actressWins = {};
DB.forEach(c => {
  if (!c.actress?.name) return;
  const n = c.actress.name;
  if (!actressWins[n]) actressWins[n] = [];
  actressWins[n].push({ year: c.year, film: c.actress.film, speech: c.actress.speech, imdb: c.actress.imdb });
});
Object.entries(actressWins).forEach(([name, wins]) => {
  const slug = slugify(name);
  // Guardar en /actor/ (URL unificada para personas)
  const html = buildPersonPage(name, wins, 'actress');
  write(path.join(ROOT, 'actor', slug, 'index.html'), html);
  allUrls.push({ url: `${DOMAIN}/actor/${slug}`, pri: '0.7', freq: 'never' });
  count++;
});
console.log(`✅ ${Object.keys(actressWins).length} páginas de actriz`);

// 5. Directores
const dirWins = {};
DB.forEach(c => {
  if (!c.director?.name) return;
  const n = c.director.name;
  if (!dirWins[n]) dirWins[n] = [];
  dirWins[n].push({ year: c.year, film: c.director.film, speech: null, imdb: null });
});
Object.entries(dirWins).forEach(([name, wins]) => {
  const slug = slugify(name);
  const html = buildPersonPage(name, wins, 'director');
  write(path.join(ROOT, 'director', slug, 'index.html'), html);
  allUrls.push({ url: `${DOMAIN}/director/${slug}`, pri: '0.7', freq: 'never' });
  count++;
});
console.log(`✅ ${Object.keys(dirWins).length} páginas de director`);

// 6. Actualizar sitemap.xml con todas las URLs
const published = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/published.json'), 'utf8'));
const now = new Date().toISOString();

const speechEntries = published.map(p =>
  `  <url><loc>${DOMAIN}/discurso/${p.slug}</loc><lastmod>${new Date(p.publishedAt).toISOString()}</lastmod><changefreq>never</changefreq><priority>0.8</priority></url>`
).join('\n');

const staticEntries = [
  `  <url><loc>${DOMAIN}</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
  `  <url><loc>${DOMAIN}/#ceremonias</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>`,
  `  <url><loc>${DOMAIN}/#discursos</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>0.9</priority></url>`,
].join('\n');

const dynamicEntries = allUrls.map(u =>
  `  <url><loc>${u.url}</loc><lastmod>${now}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.pri}</priority></url>`
).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${speechEntries}
${dynamicEntries}
</urlset>`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
console.log(`\n🗺️  sitemap.xml actualizado: ${3 + published.length + allUrls.length} URLs`);
console.log(`\n✨ Build completo: ${count} páginas estáticas generadas`);

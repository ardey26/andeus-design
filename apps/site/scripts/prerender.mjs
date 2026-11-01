// Runs after `vite build`. Renders every public page to static HTML so crawlers and
// link previews see real content, adds per-page meta tags, and writes robots.txt +
// sitemap.xml. The browser bundle then hydrates the pre-rendered markup.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const SITE = 'https://andeus.design';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const require = createRequire(path.join(root, 'package.json'));
const React = require('react');
const { renderToString } = require('react-dom/server');

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const fontFile = fs
  .readdirSync(path.join(dist, 'assets'))
  .find((f) => /^archivo-normal-latin-[\w-]+\.woff2$/.test(f));

function head({ title, description, url, jsonld }) {
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`,
    fontFile
      ? `<link rel="preload" href="/assets/${fontFile}" as="font" type="font/woff2" crossorigin />`
      : '',
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Andeus Design" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE}/og.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${SITE}/og.png" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, '\\u003c')}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ');
}

function page(template, meta, html) {
  const out = template
    .replace(/<title>[\s\S]*?<\/title>/, head(meta))
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  if (!out.includes(`<div id="root">${html.slice(0, 40)}`))
    throw new Error('Could not inject into ' + meta.url);
  return out;
}

function write(rel, content) {
  const file = path.join(dist, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

const WEBSITE = { '@type': 'WebSite', name: 'Andeus Design', url: SITE + '/' };
const server = await createServer({
  root,
  configFile: path.join(root, 'vite.config.js'),
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});
const urls = [];

// Silence React's server-side useLayoutEffect warning; it is expected and harmless here.
const warn = console.error;
console.error = (msg, ...rest) => (String(msg).includes('useLayoutEffect') ? undefined : warn(msg, ...rest));

try {
  // Showcase
  const { Showcase } = await server.ssrLoadModule('/src/showcase/Showcase.jsx');
  const scTpl = fs.readFileSync(path.join(dist, 'showcase/index.html'), 'utf8');
  const scUrl = SITE + '/showcase/';
  write(
    'showcase/index.html',
    page(
      scTpl,
      {
        title: 'Andeus Design — React components with a hardware-instrument look',
        description:
          'A React component library modelled on Braun, Teenage Engineering and the classic Mac. Twelve working rooms, one set of tokens, one typeface.',
        url: scUrl,
        jsonld: {
          '@context': 'https://schema.org',
          '@graph': [
            WEBSITE,
            {
              '@type': 'SoftwareSourceCode',
              name: '@andeus/ui',
              description: 'React component library with a hardware-instrument look.',
              programmingLanguage: 'JavaScript',
              runtimePlatform: 'React',
              url: scUrl,
            },
          ],
        },
      },
      renderToString(React.createElement(Showcase)),
    ),
  );
  urls.push(scUrl);

  // Docs: one static page per route
  const docs = await server.ssrLoadModule('/src/docs/Docs.jsx');
  const dcTpl = fs.readFileSync(path.join(dist, 'docs/index.html'), 'utf8');
  for (const id of docs.DOC_IDS()) {
    const rel = docs.docPath(id); // '/docs/' or '/docs/<id>/'
    const url = SITE + rel;
    const title = docs.docTitle(id);
    write(
      path.join(rel, 'index.html'),
      page(
        dcTpl,
        {
          title,
          description: docs.docDescription(id),
          url,
          jsonld: {
            '@context': 'https://schema.org',
            '@graph': [
              WEBSITE,
              {
                '@type': 'TechArticle',
                headline: title,
                description: docs.docDescription(id),
                url,
                isPartOf: { '@type': 'WebSite', name: 'Andeus Design', url: SITE + '/' },
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Docs', item: SITE + '/docs/' },
                  ...(id === 'philosophy'
                    ? []
                    : [{ '@type': 'ListItem', position: 2, name: title.split(' — ')[0], item: url }]),
                ],
              },
            ],
          },
        },
        renderToString(React.createElement(docs.Docs, { initialRoute: id })),
      ),
    );
    urls.push(url);
  }
} finally {
  console.error = warn;
  await server.close();
}

write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u}</loc></url>`)
    .join('\n')}\n</urlset>\n`,
);
console.log(`prerendered ${urls.length} pages`);

import React from 'react';
import { Badge, Button, Toast } from '@andeus/ui';
import { Code, H1, H2, Table, C, philMd } from './kit';
import { DOC_PAGES as PAGES } from './kit';
import { DOC_COMPONENTS as COMPS } from './demos';
import { DOCS_DATA } from './docs-data';
import * as NS from '@andeus/ui';

const T = DOCS_DATA.tok;
const PKG = '@andeus/ui';
const SITE_URL = 'https://andeus.design';
// Every docs page has a real, crawlable path. Philosophy is the docs index.
export const docPath = (id) => (id === 'philosophy' ? '/docs/' : '/docs/' + id + '/');
const docUrl = (id) => SITE_URL + docPath(id);
export const routeFromPath = (path) => {
  const m = /^\/docs\/([a-z0-9-]+)\/?$/.exec(path || '');
  return m ? m[1] : 'philosophy';
};
const RULES = [
  'Use tokens (CSS custom properties) for every colour, space, radius and shadow. Never hard-code hex values.',
  'Sentence case everywhere, including buttons and labels. No all caps.',
  'One primary (orange) action per view. The default ring marks what Return does.',
  'Labels sit under controls.',
  'No rotary knobs: continuous values use Slider, stepped values use Segmented or − and + keys.',
  'Live values go on a Screen. Lit elements are flat colour, never glowing.',
  'Liquid glass only for things floating over content (menu bar, toast, tooltip).',
  'Typeface is Archivo only. No monospace.',
];
const fence = (lang, s) => '```' + lang + '\n' + s + '\n```';
const tokMd = (list) => list.map(([n, v]) => '- `' + n + '`: `' + v + '`').join('\n');
function compMd(c) {
  return [
    '# ' + c.name + ' — ' + PKG,
    'Docs: ' + docUrl(c.id),
    '',
    c.desc,
    '',
    '## Import',
    fence('jsx', 'import { ' + c.name + (c.id === 'block' ? ', Token' : '') + " } from '" + PKG + "';"),
    '',
    '## Examples',
    ...c.demos.flatMap((x) => ['### ' + x.t, fence('jsx', x.code), '']),
    '## Props',
    '| Prop | Type | Default | Notes |',
    '| --- | --- | --- | --- |',
    ...c.props.map(
      ([n, t, df, s]) =>
        '| `' + n + '` | `' + t.replace(/\|/g, '\\|') + '` | ' + df + ' | ' + (s || '') + ' |',
    ),
    '',
    '## Rules',
    ...RULES.map((r) => '- ' + r),
  ].join('\n');
}
const PAGE_TOK = {
  color: ['colors'],
  typography: ['typography'],
  spacing: ['spacing', 'effects'],
  theming: ['colors'],
};
function pageMd(id) {
  const p = PAGES[id];
  const head = ['# ' + p.title + ' — ' + PKG, 'Docs: ' + docUrl(id), ''];
  if (id === 'philosophy') return philMd() + '\n\nDocs: ' + docUrl('philosophy');
  if (id === 'installation')
    return head.concat([setupMd(), '', '## Rules', ...RULES.map((r) => '- ' + r)]).join('\n');
  if (id === 'icons')
    return head
      .concat([
        'Usage: `<Icon name="folder" size={24} />`. 1-bit pixel icons on a 24px grid; use multiples of 8 for size.',
        '',
        '## Names',
        Object.keys(NS.ICON_PATHS || {})
          .map((n) => '`' + n + '`')
          .join(', '),
      ])
      .join('\n');
  return head
    .concat((PAGE_TOK[id] || []).flatMap((k) => ['## ' + k + ' tokens', tokMd(T[k]), '']))
    .join('\n');
}
function setupMd() {
  return [
    '## Setup (React 18+)',
    fence('bash', 'npm install ' + PKG),
    fence('jsx', "// src/main.jsx — once, at the app root\nimport '" + PKG + "/styles.css';"),
  ].join('\n');
}
function allMd() {
  return [
    '# Andeus Design (' + PKG + ') — complete reference',
    'Docs: ' + docUrl('philosophy'),
    '',
    'React 18+ component library. Controls are controlled (`value`/`checked` + `onChange`) or uncontrolled (`defaultValue`); slots are props that take React nodes (`toolbar`, `footer`, `actions`, `summary`). The philosophy comes first because it decides the cases the components do not cover.',
    '',
    philMd()
      .replace(/^# /, '## ')
      .replace(/\n## /g, '\n### ')
      .replace(/\n### (\d)/g, '\n#### $1'),
    '',
    setupMd(),
    '',
    '## Rules',
    ...RULES.map((r) => '- ' + r),
    '',
    '## Tokens',
    ...['colors', 'typography', 'spacing', 'effects'].flatMap((k) => ['### ' + k, tokMd(T[k]), '']),
    '## Icons',
    Object.keys(NS.ICON_PATHS || {})
      .map((n) => '`' + n + '`')
      .join(', '),
    '',
    '## Components',
    ...COMPS.map(
      (c) =>
        compMd(c)
          .replace(/^# /, '### ')
          .replace(/\n## /g, '\n#### ')
          .replace(/\n### (?!\w+ —)/g, '\n##### ')
          .split('\n## Rules')[0]
          .split('\n#### Rules')[0] + '\n',
    ),
  ].join('\n');
}
function useCopy() {
  const [msg, setMsg] = React.useState(null);
  const copy = (text, label) => {
    const done = () => {
      setMsg(label);
      setTimeout(() => setMsg(null), 2200);
    };
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(done, () => {
      const t = document.createElement('textarea');
      t.value = text;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      t.remove();
      done();
    });
  };
  return [msg, copy];
}
const ORDER = ['Actions', 'Forms', 'Feedback', 'Surfaces', 'Layout', 'Data', 'Media'];

const NAV = [
  { g: 'Start here', items: ['philosophy', 'installation', 'theming'].map((id) => [id, PAGES[id].title]) },
  { g: 'Foundations', items: ['color', 'typography', 'spacing', 'icons'].map((id) => [id, PAGES[id].title]) },
  ...ORDER.map((g) => ({ g, items: COMPS.filter((c) => c.group === g).map((c) => [c.id, c.name]) })),
];
const FLAT = NAV.flatMap((s) => s.items);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

function useRoute(initial) {
  const [r, setR] = React.useState(initial || 'philosophy');
  React.useEffect(() => {
    // Old #/id links still work: move them onto the real path.
    const legacy = /^#\/([a-z0-9-]+)/.exec(location.hash);
    if (legacy) {
      history.replaceState(null, '', docPath(legacy[1]));
      setR(legacy[1]);
    }
    const onPop = () => setR(routeFromPath(location.pathname));
    // Internal docs links navigate in place instead of reloading the page.
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest('a[href^="/docs/"]');
      if (!a || a.target) return;
      e.preventDefault();
      const next = routeFromPath(a.getAttribute('href'));
      history.pushState(null, '', docPath(next));
      setR(next);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', onPop);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('click', onClick);
    };
  }, []);
  return r;
}

const PAGE_DESC = {
  philosophy:
    'The rules behind Andeus Design, a React component library modelled on Braun, Teenage Engineering and the classic Mac.',
  installation: 'Install @andeus/ui, import the stylesheet once, and start using the React components.',
  theming:
    'Retheme Andeus Design by overriding a few CSS custom properties. Components only read semantic tokens.',
  color:
    'The Andeus Design colour tokens: warm platinum greys, two signal colours, and screen hues with one job each.',
  typography: 'Andeus Design typography: one typeface (Archivo), tabular numbers, and a small type scale.',
  spacing: 'Spacing, radius and shadow tokens used by every Andeus Design component.',
  icons:
    'The Andeus Design icon set: 1-bit pixel icons on a 24px grid, available through the Icon component.',
};

export function docTitle(id) {
  const comp = COMPS.find((c) => c.id === id);
  const name = comp ? comp.name : (PAGES[id] || PAGES.philosophy).title;
  return name + ' — Andeus Design React components';
}
export function docDescription(id) {
  const comp = COMPS.find((c) => c.id === id);
  if (comp) return comp.desc.replace(/`/g, '');
  return PAGE_DESC[id] || PAGE_DESC.philosophy;
}
export const DOC_IDS = () => [...Object.keys(PAGES), ...COMPS.map((c) => c.id)];

class DemoGuard extends React.Component {
  constructor(p) {
    super(p);
    this.state = { err: null };
  }
  static getDerivedStateFromError(err) {
    return { err };
  }
  componentDidUpdate(prev) {
    if (prev.k !== this.props.k && this.state.err) this.setState({ err: null });
  }
  render() {
    if (this.state.err)
      return (
        <div style={{ font: '400 14px/1.4 var(--font-sans)', color: 'var(--text-2)', textAlign: 'center' }}>
          Preview unavailable. Reload once the component library has rebuilt.
        </div>
      );
    return this.props.children;
  }
}

function Demo({ el }) {
  return el();
}

function ComponentPage({ c }) {
  return (
    <>
      <H1 kicker={'Components · ' + c.group} lead={c.desc}>
        {c.name}
      </H1>
      <Code code={`import { ${c.name}${c.id === 'block' ? ', Token' : ''} } from '@andeus/ui';`} />
      {c.demos.map((d) => (
        <section key={d.t}>
          <H2 id={slug(d.t)}>{d.t}</H2>
          <div style={{ border: '1px solid var(--border-ink)', borderRadius: 8, overflow: 'hidden' }}>
            <div className="dc-stage">
              <DemoGuard k={c.id + d.t}>
                <Demo el={d.el} />
              </DemoGuard>
            </div>
            <div style={{ borderTop: '1px solid var(--border-ink)' }}>
              <Code code={d.code} />
            </div>
          </div>
        </section>
      ))}
      <H2 id="props">Props</H2>
      <Table
        head={['Prop', 'Type', 'Default', '']}
        rows={c.props.map(([n, t, d, s]) => [
          n,
          <C key="t">{t}</C>,
          d === 'required' ? (
            <Badge key="d" tone="accent">
              Required
            </Badge>
          ) : (
            d
          ),
          s,
        ])}
      />
    </>
  );
}

function useSidePill(id) {
  const sideRef = React.useRef(null);
  const pillRef = React.useRef(null);
  const first = React.useRef(true);
  React.useLayoutEffect(() => {
    const side = sideRef.current,
      pill = pillRef.current;
    if (!side || !pill) return;
    const place = () => {
      const a = side.querySelector('.dc-link.on');
      if (!a) {
        pill.style.opacity = '0';
        return;
      }
      const sr = side.getBoundingClientRect(),
        ar = a.getBoundingClientRect();
      if (first.current) pill.style.transition = 'none';
      pill.style.opacity = '1';
      pill.style.transform =
        'translate(' + (ar.left - sr.left) + 'px,' + (ar.top - sr.top + side.scrollTop) + 'px)';
      pill.style.width = ar.width + 'px';
      pill.style.height = ar.height + 'px';
      if (first.current) {
        pill.getBoundingClientRect();
        pill.style.transition = '';
        first.current = false;
      }
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(side);
    return () => ro.disconnect();
  }, [id]);
  return [sideRef, pillRef];
}

function Docs({ initialRoute }) {
  const route = useRoute(initialRoute);
  const [q, setQ] = React.useState('');
  const [menu, setMenu] = React.useState(false);
  const comp = COMPS.find((c) => c.id === route);
  const [sideRef, pillRef] = useSidePill(route + '|' + q);
  const page = PAGES[route] || (comp ? null : PAGES.philosophy);
  const id = comp ? comp.id : PAGES[route] ? route : 'philosophy';
  const toc = comp
    ? [...comp.demos.map((d) => [slug(d.t), d.t]), ['props', 'Props']]
    : typeof page.toc === 'function'
      ? page.toc()
      : page.toc;
  const idx = FLAT.findIndex(([k]) => k === id),
    prev = FLAT[idx - 1],
    next = FLAT[idx + 1];
  const nav = NAV.map((s) => ({
    ...s,
    items: s.items.filter(([, t]) => t.toLowerCase().includes(q.toLowerCase())),
  })).filter((s) => s.items.length);
  React.useEffect(() => {
    setMenu(false);
    document.title = docTitle(id);
  }, [route, id]);
  React.useEffect(() => {
    const k = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('dc-search').focus();
      }
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);
  const [msg, copy] = useCopy();
  const copyPage = () =>
    copy(comp ? compMd(comp) : pageMd(id), (comp ? comp.name : PAGES[id].title) + ' copied as Markdown.');
  const copyAll = () =>
    copy(
      allMd(),
      'Full library copied: setup, rules, tokens, icons and all ' + COMPS.length + ' components.',
    );
  const jump = (h) => (e) => {
    e.preventDefault();
    const el = document.getElementById(h);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 72, behavior: 'smooth' });
  };

  return (
    <>
      <header className="dc-top">
        <button className="dc-burger" onClick={() => setMenu((m) => !m)} aria-label="Menu">
          ☰
        </button>
        <a
          href="/docs/"
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 10,
            textDecoration: 'none',
            color: 'var(--text-1)',
          }}
        >
          <span style={{ font: '300 22px/1 var(--font-display)', letterSpacing: '-0.02em' }}>
            Andeus Design
          </span>
          <span style={{ font: '500 12px/1 var(--font-sans)', color: 'var(--text-2)' }}>for React</span>
        </a>
        <Badge tone="ink">v0.1</Badge>
        <div style={{ flex: 1 }}></div>
        <Button size="s" variant="ink" icon="copy" onClick={copyAll}>
          Copy all as Markdown
        </Button>
        <nav className="dc-toplinks">
          <a href="/docs/">Philosophy</a>
          <a href="/docs/installation/">Install</a>
          <a href="/docs/color/">Foundations</a>
          <a href="/docs/button/">Components</a>
          <a href="/showcase/">Showroom</a>
        </nav>
      </header>
      <div className="dc-grid">
        <aside ref={sideRef} className={'dc-side' + (menu ? ' open' : '')}>
          <i ref={pillRef} className="dc-pill" style={{ opacity: 0 }}></i>
          <label style={{ position: 'relative', display: 'block', marginBottom: 20 }}>
            <input
              id="dc-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="dc-search"
            />
            <span
              style={{
                position: 'absolute',
                right: 10,
                top: 8,
                font: '500 12px/18px var(--font-sans)',
                color: 'var(--text-2)',
                border: '1px solid var(--border-1)',
                borderRadius: 3,
                padding: '0 6px',
              }}
            >
              /
            </span>
          </label>
          {nav.map((s) => (
            <div key={s.g} style={{ marginBottom: 22 }}>
              <div style={{ font: 'var(--type-label)', color: 'var(--text-label)', marginBottom: 8 }}>
                {s.g}
              </div>
              {s.items.map(([k, t]) => (
                <a key={k} href={docPath(k)} className={'dc-link' + (k === id ? ' on' : '')}>
                  {t}
                </a>
              ))}
            </div>
          ))}
        </aside>
        <main key={id} className="dc-main dc-enter" data-screen-label={'Docs ' + id}>
          <div
            style={{
              display: id === 'philosophy' ? 'none' : 'flex',
              justifyContent: 'flex-end',
              gap: 8,
              marginBottom: -24,
            }}
          >
            <Button size="s" icon="copy" onClick={copyPage}>
              Copy Markdown
            </Button>
          </div>
          {comp ? <ComponentPage c={comp} /> : page.render(null, { copyPage, copyAll })}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginTop: 64,
              paddingTop: 24,
              borderTop: '1px solid var(--border-ink)',
            }}
          >
            {prev ? (
              <a href={docPath(prev[0])} className="dc-pn">
                <span>Previous</span>
                <b>{prev[1]}</b>
              </a>
            ) : (
              <span></span>
            )}
            {next ? (
              <a href={docPath(next[0])} className="dc-pn" style={{ textAlign: 'right' }}>
                <span>Next</span>
                <b>{next[1]}</b>
              </a>
            ) : (
              <span></span>
            )}
          </div>
        </main>
        {msg ? (
          <div
            style={{ position: 'fixed', left: '50%', bottom: 28, transform: 'translateX(-50%)', zIndex: 40 }}
          >
            <Toast tone="positive" icon="check">
              {msg}
            </Toast>
          </div>
        ) : null}
        <nav className="dc-toc">
          {toc && toc.length ? (
            <>
              <div style={{ font: 'var(--type-label)', color: 'var(--text-label)', marginBottom: 10 }}>
                On this page
              </div>
              {toc.map(([h, t]) => (
                <a key={h} href={'#' + h} onClick={jump(h)} className="dc-toclink">
                  {t}
                </a>
              ))}
            </>
          ) : null}
        </nav>
      </div>
    </>
  );
}

export { Docs };

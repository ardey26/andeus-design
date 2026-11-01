import React from 'react';
import * as NS from '@andeus/ui';
import { Icon, Input } from '@andeus/ui';
import { DOCS_DATA } from './docs-data';

const D = DOCS_DATA.tok;

function Code({ code, lang = 'jsx' }) {
  const [copied, setCopied] = React.useState(false);
  const parts = [];
  const re =
    /(=>|<!--[\s\S]*?-->|\/\/[^\n]*|"[^"]*"|'[^']*'|<\/?[\w:.-]+|\/?>|\{[#/:@][^}]*\}|\b(?:import|from|let|const|export|function|return|npm|install)\b|\b(?:useState|useEffect)\b)/g;
  let last = 0,
    m;
  while ((m = re.exec(code))) {
    if (m.index > last) parts.push(code.slice(last, m.index));
    const t = m[0];
    const c =
      t === '=>'
        ? 'var(--screen-ink)'
        : /^<!--|^\/\//.test(t)
          ? 'var(--screen-dim)'
          : /^["']/.test(t)
            ? 'var(--screen-green)'
            : /^<|^\/?>/.test(t)
              ? 'var(--screen-orange)'
              : /^\{/.test(t)
                ? 'var(--screen-blue)'
                : /^use[A-Z]/.test(t)
                  ? 'var(--screen-blue)'
                  : 'var(--screen-yellow)';
    parts.push(
      <span key={m.index} style={{ color: c }}>
        {t}
      </span>,
    );
    last = m.index + t.length;
  }
  parts.push(code.slice(last));
  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--surface-screen)',
        borderRadius: 8,
        boxShadow: 'inset 0 0 0 2px var(--platinum-900)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 14px',
          borderBottom: '1px solid var(--screen-grid)',
          font: '500 12px/1 var(--font-sans)',
          color: 'var(--screen-dim)',
        }}
      >
        <span>{lang}</span>
        <button
          onClick={() => {
            navigator.clipboard && navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
          style={{
            all: 'unset',
            cursor: 'pointer',
            color: copied ? 'var(--screen-green)' : 'var(--screen-ink)',
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '14px 16px',
          overflowX: 'auto',
          font: '400 14px/1.6 var(--font-sans)',
          color: 'var(--screen-ink)',
          whiteSpace: 'pre',
          tabSize: 2,
        }}
      >
        {parts}
      </pre>
    </div>
  );
}

function H1({ kicker, children, lead }) {
  return (
    <header style={{ marginBottom: 40 }}>
      {kicker ? (
        <div style={{ font: 'var(--type-label)', color: 'var(--text-label)', marginBottom: 12 }}>
          {kicker}
        </div>
      ) : null}
      <h1
        style={{
          font: '200 clamp(44px,5vw,64px)/1 var(--font-display)',
          letterSpacing: '-0.035em',
          margin: 0,
        }}
      >
        {children}
      </h1>
      {lead ? (
        <p
          style={{
            font: '400 19px/1.5 var(--font-sans)',
            color: 'var(--text-2)',
            margin: '16px 0 0',
            maxWidth: 640,
            textWrap: 'pretty',
          }}
        >
          {lead}
        </p>
      ) : null}
    </header>
  );
}
function H2({ id, children }) {
  return (
    <h2
      id={id}
      style={{
        font: '400 26px/1.2 var(--font-display)',
        letterSpacing: '-0.02em',
        margin: '48px 0 16px',
        paddingTop: 8,
        scrollMarginTop: 80,
      }}
    >
      {children}
    </h2>
  );
}
function P({ children }) {
  return (
    <p
      style={{
        font: '400 16px/1.6 var(--font-sans)',
        color: 'var(--text-1)',
        margin: '0 0 16px',
        maxWidth: 680,
        textWrap: 'pretty',
      }}
    >
      {children}
    </p>
  );
}
function C({ children }) {
  return (
    <code
      style={{
        font: '500 14px/1 var(--font-sans)',
        background: 'var(--platinum-200)',
        padding: '2px 6px',
        borderRadius: 3,
      }}
    >
      {children}
    </code>
  );
}
function Table({ head, rows }) {
  return (
    <div
      style={{
        overflowX: 'auto',
        border: '1px solid var(--border-ink)',
        borderRadius: 6,
        background: 'var(--surface-raised)',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', font: '400 14px/1.45 var(--font-sans)' }}>
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'left',
                  padding: '10px 14px',
                  font: 'var(--type-label)',
                  color: 'var(--text-label)',
                  borderBottom: '1px solid var(--border-ink)',
                  background: 'var(--platinum-100)',
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td
                  key={j}
                  style={{
                    padding: '10px 14px',
                    borderBottom: i < rows.length - 1 ? '1px solid var(--border-hair)' : 'none',
                    verticalAlign: 'top',
                    color: j === 0 ? 'var(--text-1)' : 'var(--text-2)',
                    fontWeight: j === 0 ? 500 : 400,
                  }}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Resolve token values from the shipped token table (not the live DOM), so the
// page renders the same at build time and in the browser.
const TOK_MAP = Object.fromEntries(Object.values(DOCS_DATA.tok).flat());
const tokVal = (n, depth = 0) => {
  const v = TOK_MAP[n];
  if (!v || depth > 8) return v || '';
  return v.replace(/var\((--[\w-]+)\)/g, (_, ref) => tokVal(ref, depth + 1) || 'var(' + ref + ')');
};

const PHIL = {
  lead: 'How Andeus Design thinks. Every rule has a reason attached, so cases the components do not cover can still be decided.',
  lineage: [
    [
      'Dieter Rams / Braun',
      'Less, but better. A warm platinum grey, one or two signal colours, and a label printed under every control.',
    ],
    [
      'Teenage Engineering',
      'A small live screen for each job. Colour that does a job. Playful without being cute. Its monospace and all caps were left out.',
    ],
    ['Classic Mac', 'Striped title bars, 1-bit pixel icons, and one clear default button.'],
    [
      'Composer',
      'Logic you can read as blocks: when, if, then, until. Every strategy is measured against a benchmark.',
    ],
  ],
  principles: [
    {
      t: 'Less, but better',
      why: 'Every element costs the user attention.',
      do: 'Remove until the screen breaks, then put one thing back.',
      dont: 'Add sections, stats, icons or copy to fill space.',
    },
    {
      t: 'Every control says what it does',
      why: 'An instrument is learned by reading its panel.',
      do: 'Print a short sentence-case label under each control (Labeled).',
      dont: 'Ship icon-only controls without a label or tooltip.',
    },
    {
      t: 'Colour does a job',
      why: 'If everything is coloured, nothing stands out.',
      do: 'Orange is the one action. Blue and yellow tie a screen line to its control. Green and red are state.',
      dont: 'Use colour for decoration, gradients, or tinted section backgrounds.',
    },
    {
      t: 'One screen, one job',
      why: 'Live values need one place to be read at a glance.',
      do: 'Put changing numbers on a Screen, big and light. Lit elements are flat colour.',
      dont: 'Add glow, mix several jobs on one screen, or build dashboards of identical cards.',
    },
    {
      t: 'Physical, not flat',
      why: 'A control should look pressable before it is touched.',
      do: 'Raised keys, hard offset shadows, pressed states that sink 2px.',
      dont: 'Soft blurry shadows, ghost-only interfaces, rotary knobs.',
    },
    {
      t: 'Playful, not cute',
      why: 'Delight comes from craft and scale, not decoration.',
      do: 'Oversized numbers, one well-placed orange key, real working interaction.',
      dont: 'Emoji, mascots, exclamation marks, bubbly shapes.',
    },
    {
      t: 'Logic you can read aloud',
      why: 'People trust what they can say back in a sentence.',
      do: 'Express rules as when, if, then, until blocks. Show results against a benchmark.',
      dont: 'Hide behaviour in settings or unexplained toggles.',
    },
  ],
  doubt: [
    ['Two options look equally good', 'Pick the one with fewer elements.'],
    [
      'A component is missing',
      'Compose existing components first. If you must build one, use tokens only and give it a label.',
    ],
    ['Unsure which colour', 'Platinum. Colour must earn its place.'],
    ['Unsure which word', 'Shorter. Sentence case. Buttons start with a verb.'],
    ['A value is continuous', 'Slider.'],
    ['Two to four exclusive options', 'Segmented. Five or more: Select.'],
    ['A destructive action', 'Dialog. The safe answer is ghost; the action has the default ring.'],
    ['A live number', 'Screen with Metric, light weight, tabular numerals.'],
  ],
  voice: [
    ['Run backtest', 'Submit'],
    ['Delete strategy?', 'Are you sure you want to delete?'],
    ['Saved', 'Your changes have been saved successfully!'],
    ['14.2% a year', '14.2'],
    ['Not yet', 'Cancel'],
  ],
  check: [
    'Exactly one primary (orange) action is visible.',
    'Every control has a label under it or an accessible name.',
    'No hard-coded colours, sizes or shadows: tokens only.',
    'All text is sentence case. No emoji, no exclamation marks.',
    'Changing numbers sit on a Screen and use tabular numerals.',
    'Nothing glows. Liquid glass only on floating elements.',
    'At least one thing was removed before shipping.',
  ],
};
function philMd() {
  return [
    '# Philosophy',
    PHIL.lead,
    '',
    '## Lineage',
    ...PHIL.lineage.map(([a, b]) => '- **' + a + '**: ' + b),
    '',
    '## Principles',
    ...PHIL.principles.flatMap((x, i) => [
      '### ' + (i + 1) + '. ' + x.t,
      'Why: ' + x.why,
      'Do: ' + x.do,
      "Don't: " + x.dont,
      '',
    ]),
    '## When in doubt',
    ...PHIL.doubt.map(([a, b]) => '- ' + a + ' → ' + b),
    '',
    '## Voice',
    '| Write | Not |',
    '| --- | --- |',
    ...PHIL.voice.map(([a, b]) => '| ' + a + ' | ' + b + ' |'),
    '',
    '## Before you ship',
    ...PHIL.check.map((c) => '- [ ] ' + c),
  ].join('\n');
}
function Philosophy({ copyPage, copyAll }) {
  const { Button } = NS;
  return (
    <>
      <H1 kicker="Start here" lead={PHIL.lead}>
        Philosophy
      </H1>
      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          padding: 18,
          marginBottom: 8,
          background: 'var(--surface-screen)',
          borderRadius: 8,
          alignItems: 'center',
        }}
      >
        <span
          style={{
            flex: 1,
            minWidth: 220,
            font: '400 15px/1.4 var(--font-sans)',
            color: 'var(--screen-ink)',
          }}
        >
          Markdown, with every reference included.
        </span>
        <Button size="s" variant="primary" icon="copy" onClick={copyPage}>
          Copy Markdown
        </Button>
        <Button size="s" icon="copy" onClick={copyAll}>
          Copy all as Markdown
        </Button>
      </div>
      <H2 id="lineage">Lineage</H2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))',
          gap: 0,
          borderTop: '1px solid var(--border-ink)',
          borderLeft: '1px solid var(--border-ink)',
        }}
      >
        {PHIL.lineage.map(([a, b]) => (
          <div
            key={a}
            style={{
              padding: 18,
              borderRight: '1px solid var(--border-ink)',
              borderBottom: '1px solid var(--border-ink)',
              background: 'var(--surface-raised)',
            }}
          >
            <div style={{ font: '400 19px/1.2 var(--font-display)', marginBottom: 8 }}>{a}</div>
            <div
              style={{ font: '400 15px/1.5 var(--font-sans)', color: 'var(--text-2)', textWrap: 'pretty' }}
            >
              {b}
            </div>
          </div>
        ))}
      </div>
      <H2 id="principles">Principles</H2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {PHIL.principles.map((x, i) => (
          <div
            key={x.t}
            style={{
              display: 'grid',
              gridTemplateColumns: '72px minmax(0,1fr)',
              gap: 16,
              padding: '22px 0',
              borderTop: '1px solid var(--border-ink)',
            }}
          >
            <span
              style={{
                font: '200 56px/0.8 var(--font-display)',
                letterSpacing: '-0.04em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {i + 1}
            </span>
            <div>
              <div style={{ font: '400 24px/1.2 var(--font-display)', letterSpacing: '-0.02em' }}>{x.t}</div>
              <div
                style={{
                  font: '400 16px/1.5 var(--font-sans)',
                  color: 'var(--text-2)',
                  margin: '6px 0 14px',
                }}
              >
                {x.why}
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    padding: 14,
                    background: 'var(--surface-raised)',
                    border: '1px solid var(--border-hair)',
                    borderRadius: 6,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                      font: 'var(--type-label)',
                      color: 'var(--text-label)',
                      marginBottom: 6,
                    }}
                  >
                    <i
                      style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--signal-green)' }}
                    ></i>
                    Do
                  </div>
                  <div style={{ font: '400 15px/1.5 var(--font-sans)' }}>{x.do}</div>
                </div>
                <div
                  style={{
                    padding: 14,
                    background: 'var(--surface-raised)',
                    border: '1px solid var(--border-hair)',
                    borderRadius: 6,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                      font: 'var(--type-label)',
                      color: 'var(--text-label)',
                      marginBottom: 6,
                    }}
                  >
                    <i
                      style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--signal-orange)' }}
                    ></i>
                    Don’t
                  </div>
                  <div style={{ font: '400 15px/1.5 var(--font-sans)' }}>{x.dont}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <H2 id="doubt">When in doubt</H2>
      <Table head={['Situation', 'Decision']} rows={PHIL.doubt} />
      <H2 id="voice">Voice</H2>
      <Table head={['Write', 'Not']} rows={PHIL.voice} />
      <H2 id="check">Before you ship</H2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PHIL.check.map((c) => (
          <label
            key={c}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              font: '400 16px/1.4 var(--font-sans)',
            }}
          >
            <input type="checkbox" style={{ marginTop: 4, accentColor: 'var(--signal-orange)' }} />
            {c}
          </label>
        ))}
      </div>
    </>
  );
}

const PAGES = {};
PAGES.philosophy = {
  title: 'Philosophy',
  group: 'Start here',
  toc: [
    ['lineage', 'Lineage'],
    ['principles', 'Principles'],
    ['doubt', 'When in doubt'],
    ['voice', 'Voice'],
    ['check', 'Before you ship'],
  ],
  render: (go, ctx) => <Philosophy {...ctx} />,
};
PAGES.installation = {
  title: 'Installation',
  group: 'Start here',
  toc: [
    ['install', 'Install'],
    ['styles', 'Add the styles'],
    ['use', 'Use a component'],
  ],
  render: () => (
    <>
      <H1
        kicker="Start here"
        lead="Andeus Design is a React 18+ library. Components are plain function components: controlled via value/onChange, uncontrolled via defaultValue."
      >
        Installation
      </H1>
      <H2 id="install">Install</H2>
      <Code lang="terminal" code={`npm install @andeus/ui`} />
      <H2 id="styles">Add the styles</H2>
      <P>Import the stylesheet once in your root layout. It loads the tokens and the Archivo typeface.</P>
      <Code
        code={`// src/main.jsx — import the styles once, at the app root\nimport '@andeus/ui/styles.css';`}
      />
      <H2 id="use">Use a component</H2>
      <Code
        code={`import { useState } from 'react';\nimport { Button, Switch } from '@andeus/ui';\n\nexport function RunControls() {\n  const [live, setLive] = useState(false);\n  return (\n    <>\n      <Switch label="Live" checked={live} onChange={setLive} />\n      <Button variant="primary" disabled={!live}>Run</Button>\n    </>\n  );\n}`}
      />
    </>
  ),
};

PAGES.theming = {
  title: 'Theming',
  group: 'Start here',
  toc: [
    ['tokens', 'Tokens'],
    ['override', 'Override'],
  ],
  render: () => (
    <>
      <H1
        kicker="Start here"
        lead="Every value is a CSS custom property on :root. Components only read semantic aliases, so you can retheme without touching them."
      >
        Theming
      </H1>
      <H2 id="tokens">Semantic tokens</H2>
      <Table
        head={['Token', 'Role', 'Value']}
        rows={[
          ['--surface-body', 'Page background'],
          ['--surface-raised', 'Controls and cards'],
          ['--surface-screen', 'Live screens'],
          ['--text-1', 'Primary text'],
          ['--text-2', 'Secondary text'],
          ['--accent', 'The one action colour'],
          ['--border-ink', 'Hard edges'],
          ['--focus-ring', 'Keyboard focus'],
        ].map(([n, r]) => [<C key="n">{n}</C>, r, tokVal(n) || '—'])}
      />
      <H2 id="override">Override</H2>
      <Code
        lang="css"
        code={`/* src/app.css */\n:root {\n  --accent: var(--screen-blue);\n  --surface-body: var(--platinum-100);\n}`}
      />
    </>
  ),
};

function Swatch({ n }) {
  const [c, setC] = React.useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard && navigator.clipboard.writeText('var(' + n + ')');
        setC(true);
        setTimeout(() => setC(false), 1000);
      }}
      style={{ all: 'unset', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <span
        style={{
          height: 64,
          borderRadius: 6,
          background: 'var(' + n + ')',
          boxShadow: 'inset 0 0 0 1px rgba(27,26,24,.15)',
        }}
      ></span>
      <span style={{ font: '500 13px/1.3 var(--font-sans)' }}>{c ? 'Copied' : n.replace('--', '')}</span>
      <span style={{ font: '400 12px/1 var(--font-sans)', color: 'var(--text-2)' }}>{tokVal(n)}</span>
    </button>
  );
}
const colorGroups = () => {
  const g = {};
  D.colors.forEach(([n, v]) => {
    if (/var\(/.test(v)) return;
    const k = n.replace(/^--/, '').split('-')[0];
    (g[k] = g[k] || []).push(n);
  });
  return g;
};
PAGES.color = {
  title: 'Colour',
  group: 'Foundations',
  toc: () =>
    Object.keys(colorGroups())
      .map((k) => [k, k[0].toUpperCase() + k.slice(1)])
      .concat([['aliases', 'Aliases']]),
  render: () => {
    const g = colorGroups();
    return (
      <>
        <H1
          kicker="Foundations"
          lead="Warm platinum greys carry almost everything. One signal orange means act. Screen colours only appear on dark screens. Click a swatch to copy it."
        >
          Colour
        </H1>
        {Object.entries(g).map(([k, list]) => (
          <section key={k}>
            <H2 id={k}>{k[0].toUpperCase() + k.slice(1)}</H2>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(110px,1fr))', gap: 16 }}
            >
              {list.map((n) => (
                <Swatch key={n} n={n} />
              ))}
            </div>
          </section>
        ))}
        <H2 id="aliases">Aliases</H2>
        <Table
          head={['Token', 'Points to']}
          rows={D.colors.filter(([, v]) => /var\(/.test(v)).map(([n, v]) => [<C key="n">{n}</C>, v])}
        />
      </>
    );
  },
};

PAGES.typography = {
  title: 'Typography',
  group: 'Foundations',
  toc: [
    ['scale', 'Scale'],
    ['rules', 'Rules'],
  ],
  render: () => {
    const styles = D.typography.filter(([n]) => n.startsWith('--type-'));
    return (
      <>
        <H1
          kicker="Foundations"
          lead="One typeface, Archivo, standing in for Univers. Light at display sizes, regular for reading, medium for labels. No monospace, no all caps."
        >
          Typography
        </H1>
        <H2 id="scale">Scale</H2>
        <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-ink)' }}>
          {styles.map(([n, v]) => (
            <div
              key={n}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px minmax(0,1fr)',
                gap: 20,
                padding: '18px 0',
                borderBottom: '1px solid var(--border-hair)',
                alignItems: 'baseline',
              }}
            >
              <div>
                <C>{n}</C>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 6 }}>
                  {tokVal(n)
                    .replace(/var\(--font-\w+\)/, '')
                    .trim()}
                </div>
              </div>
              <span
                style={{
                  font: 'var(' + n + ')',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                Less, but better
              </span>
            </div>
          ))}
        </div>
        <H2 id="rules">Rules</H2>
        <Table
          head={['Rule', '']}
          rows={[
            ['Sentence case', 'Everywhere, including buttons and labels.'],
            ['Tabular numerals', 'Wherever numbers change or line up.'],
            ['Light for big', 'Display, H1 and big screen numbers are 200–300.'],
            ['Labels', '11–13px, medium, printed under controls.'],
          ]}
        />
      </>
    );
  },
};

PAGES.spacing = {
  title: 'Spacing and shape',
  group: 'Foundations',
  toc: [
    ['space', 'Space'],
    ['radius', 'Radius'],
    ['elevation', 'Elevation'],
    ['motion', 'Motion'],
  ],
  render: () => (
    <>
      <H1
        kicker="Foundations"
        lead="Space comes in a short scale. Corners are small. Depth comes from hard offset shadows, like a moulded part."
      >
        Spacing and shape
      </H1>
      <H2 id="space">Space</H2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {D.spacing
          .filter(([n]) => /^--space-/.test(n))
          .map(([n, v]) => (
            <div
              key={n}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 60px 1fr',
                gap: 16,
                alignItems: 'center',
              }}
            >
              <C>{n}</C>
              <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{v}</span>
              <i style={{ height: 14, width: 'var(' + n + ')', background: 'var(--signal-orange)' }}></i>
            </div>
          ))}
      </div>
      <H2 id="radius">Radius</H2>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {D.spacing
          .filter(([n]) => /^--radius-/.test(n))
          .map(([n, v]) => (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              <i
                style={{
                  width: 72,
                  height: 72,
                  background: 'var(--surface-raised)',
                  border: '1px solid var(--border-ink)',
                  borderRadius: 'var(' + n + ')',
                }}
              ></i>
              <C>{n}</C>
              <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{v}</span>
            </div>
          ))}
      </div>
      <H2 id="elevation">Elevation</H2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 24 }}>
        {D.effects
          .filter(([n]) => /^--shadow-/.test(n))
          .map(([n]) => (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <i
                style={{
                  height: 72,
                  background: 'var(--surface-raised)',
                  borderRadius: 6,
                  boxShadow: 'var(' + n + ')',
                }}
              ></i>
              <C>{n}</C>
            </div>
          ))}
      </div>
      <H2 id="motion">Motion</H2>
      <Table
        head={['Token', 'Value']}
        rows={D.effects.filter(([n]) => /^--(dur|ease)-/.test(n)).map(([n, v]) => [<C key="n">{n}</C>, v])}
      />
    </>
  ),
};

function IconsPage() {
  const [q, setQ] = React.useState('');
  const [copied, setCopied] = React.useState(null);
  const names = Object.keys(NS.ICON_PATHS || {}).filter((n) => n.includes(q.toLowerCase()));
  return (
    <>
      <H1
        kicker="Foundations"
        lead="1-bit pixel icons on a 24-pixel grid, in the spirit of the classic Mac. Filled shapes, no strokes. Click one to copy its name."
      >
        Icons
      </H1>
      <div style={{ maxWidth: 320, marginBottom: 24 }}>
        <Input
          icon="search"
          placeholder={'Search ' + Object.keys(NS.ICON_PATHS || {}).length + ' icons'}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(112px,1fr))',
          gap: 0,
          borderTop: '1px solid var(--border-hair)',
          borderLeft: '1px solid var(--border-hair)',
        }}
      >
        {names.map((n) => (
          <button
            key={n}
            onClick={() => {
              navigator.clipboard && navigator.clipboard.writeText(n);
              setCopied(n);
              setTimeout(() => setCopied(null), 1000);
            }}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              padding: '22px 8px 14px',
              borderRight: '1px solid var(--border-hair)',
              borderBottom: '1px solid var(--border-hair)',
              background: copied === n ? 'var(--signal-orange-tint)' : 'var(--surface-raised)',
            }}
          >
            <Icon name={n} size={24} />
            <span
              style={{ font: '400 12px/1.2 var(--font-sans)', color: 'var(--text-2)', textAlign: 'center' }}
            >
              {copied === n ? 'Copied' : n}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
PAGES.icons = { title: 'Icons', group: 'Foundations', toc: [], render: () => <IconsPage /> };

export { Code, H1, H2, P, C, Table, philMd };
export { PAGES as DOC_PAGES };

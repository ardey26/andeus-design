import React from 'react';
import { Icon } from '@andeus/ui';
import { Body, Plate, Lcd, Key, Led, Grille, Big, Tiny, Mark } from './hw-kit';

const row = (gap = 16, extra) => ({ display: 'flex', gap, alignItems: 'center', ...extra });
const col = (gap = 16, extra) => ({ display: 'flex', flexDirection: 'column', gap, ...extra });

/* ---------- C-1 Calendar ---------- */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const EV = [
  [
    { s: 9, l: 1, t: 'Standup', c: 'var(--screen-blue)' },
    { s: 13, l: 2, t: 'Design review', c: 'var(--screen-orange)' },
  ],
  [{ s: 10, l: 1.5, t: 'Dentist', c: 'var(--screen-green)' }],
  [
    { s: 9, l: 1, t: 'Standup', c: 'var(--screen-blue)' },
    { s: 11, l: 3, t: 'Pricing workshop', c: 'var(--screen-orange)' },
  ],
  [{ s: 15, l: 1, t: 'Call with Marek', c: 'var(--screen-yellow)' }],
  [
    { s: 9, l: 1, t: 'Standup', c: 'var(--screen-blue)' },
    { s: 12, l: 1.5, t: 'Lunch', c: 'var(--screen-green)' },
  ],
];
const hm = (h) => String(Math.floor(h)).padStart(2, '0') + ':' + (h % 1 ? '30' : '00');
function CalendarRoom() {
  const [d, setD] = React.useState(2);
  const [e, setE] = React.useState(1);
  const ev = EV[d],
    cur = ev[Math.min(e, ev.length - 1)];
  return (
    <Body>
      <Lcd style={{ ...col(20), padding: 30 }}>
        <div style={row(24, { justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap' })}>
          <Big size={170} color="var(--screen-orange)">
            {hm(cur.s)}
          </Big>
          <div style={col(10, { alignItems: 'flex-end' })}>
            <Big size={56} weight={300}>
              {DAYS[d]} {d + 2}
            </Big>
            <Tiny>November 2026</Tiny>
          </div>
        </div>
        <span style={{ font: '300 32px/1.1 var(--font-display)', color: 'var(--screen-ink)' }}>
          {cur.t} <span style={{ color: 'var(--screen-dim)' }}>until {hm(cur.s + cur.l)}</span>
        </span>
        <div style={{ position: 'relative', height: 40, background: 'var(--screen-grid)' }}>
          {ev.map((x, i) => (
            <button
              key={i}
              onClick={() => setE(i)}
              aria-label={x.t}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: ((x.s - 8) / 10) * 100 + '%',
                width: (x.l / 10) * 100 + '%',
                background: x.c,
                border: 'none',
                cursor: 'pointer',
                outline: x === cur ? '3px solid var(--screen-ink)' : 'none',
                outlineOffset: 2,
              }}
            ></button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11,1fr)' }}>
          {Array.from({ length: 11 }, (_, i) => (
            <Tiny key={i} color="var(--screen-dim)">
              {8 + i}
            </Tiny>
          ))}
        </div>
      </Lcd>
      <div style={row(14, { marginTop: 22, flexWrap: 'wrap' })}>
        {DAYS.map((x, i) => (
          <div key={x} style={col(8, { alignItems: 'center' })}>
            <Led on={d === i} />
            <Key
              w={80}
              h={64}
              on={d === i}
              onClick={() => {
                setD(i);
                setE(0);
              }}
              label={x}
            >
              <span style={{ font: '300 26px/1 var(--font-display)' }}>{i + 2}</span>
            </Key>
          </div>
        ))}
        <div style={{ flex: 1 }}></div>
        <Key
          tone="dark"
          w={64}
          h={64}
          onClick={() => setE((v) => (v + ev.length - 1) % ev.length)}
          label="Earlier"
        >
          <Icon name="arrow-left" size={26} color="var(--text-on-ink)" />
        </Key>
        <Key tone="dark" w={64} h={64} onClick={() => setE((v) => (v + 1) % ev.length)} label="Later">
          <Icon name="arrow-right" size={26} color="var(--text-on-ink)" />
        </Key>
        <Key
          tone="orange"
          round
          w={76}
          h={76}
          onClick={() => {
            setD(2);
            setE(0);
          }}
          label="Today"
        ></Key>
        <Mark>C-1</Mark>
      </div>
    </Body>
  );
}

/* ---------- F-1 Files ---------- */
const CARTS = [
  { n: 'Brand', gb: 2.4, c: 'var(--signal-orange)' },
  { n: 'Field recordings', gb: 9.1, c: 'var(--screen-blue)' },
  { n: 'Quarter plan', gb: 0.4, c: 'var(--screen-yellow)' },
  { n: 'Invoices', gb: 0.8, c: 'var(--signal-green)' },
  { n: 'Moodboard', gb: 3.1, c: 'var(--platinum-700)' },
  { n: 'Old exports', gb: 5.8, c: 'var(--screen-red)' },
];
const CAP = 40;
function FilesRoom() {
  const [list, setList] = React.useState(CARTS);
  const [sel, setSel] = React.useState(1);
  const [bin, setBin] = React.useState([]);
  const used = list.reduce((a, x) => a + x.gb, 0);
  let acc = 0;
  const cells = Array.from({ length: 40 }, (_, i) => {
    const gb = (i + 0.5) * (CAP / 40);
    let a = 0;
    for (const x of list) {
      a += x.gb;
      if (gb <= a) return x.c;
    }
    return null;
  });
  const eject = () => {
    if (sel == null || !list[sel]) return;
    setBin((b) => [list[sel], ...b]);
    setList((l) => l.filter((_, i) => i !== sel));
    setSel(null);
  };
  const undo = () => {
    if (!bin.length) return;
    setList((l) => [...l, bin[0]]);
    setBin((b) => b.slice(1));
  };
  return (
    <Body>
      <div
        className="hw-cols"
        style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 120px', gap: 20, marginBottom: 22 }}
      >
        <Lcd style={col(16)}>
          <div style={row(20, { justifyContent: 'space-between', alignItems: 'flex-end' })}>
            <Big size={110}>{(CAP - used).toFixed(1)}</Big>
            <div style={col(8, { alignItems: 'flex-end' })}>
              <Tiny>GB free</Tiny>
              <Tiny color="var(--screen-orange)">
                {sel != null && list[sel] ? list[sel].n + ' · ' + list[sel].gb + ' GB' : '—'}
              </Tiny>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(40,1fr)', gap: 2 }}>
            {cells.map((c, i) => (
              <i key={i} style={{ height: 22, background: c || 'var(--screen-grid)' }}></i>
            ))}
          </div>
        </Lcd>
        <div style={col(14, { alignItems: 'center', justifyContent: 'center' })}>
          <Key tone="orange" w={100} h={80} onClick={eject} label="Eject">
            <Icon name="upload" size={28} color="var(--text-on-signal)" />
          </Key>
          <Key tone="dark" w={100} h={56} onClick={undo} label="Undo">
            <Icon name="reload" size={22} color="var(--text-on-ink)" />
          </Key>
        </div>
      </div>
      <Plate
        style={{
          padding: '20px 20px 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(6,minmax(0,1fr))',
          gap: 14,
          alignItems: 'end',
          minHeight: 280,
          background: 'var(--platinum-800)',
          boxShadow: 'inset 0 6px 12px rgba(0,0,0,.5)',
        }}
      >
        {list.map((x, i) => (
          <button
            key={x.n}
            className="hw-key"
            onClick={() => setSel(i)}
            aria-label={x.n}
            style={{
              height: 250,
              border: '1px solid rgba(27,26,24,.5)',
              borderBottom: 'none',
              borderRadius: '10px 10px 0 0',
              cursor: 'pointer',
              padding: 14,
              background: 'var(--platinum-50)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              transform: sel === i ? 'translateY(-28px)' : 'none',
              transition: 'transform var(--dur-move) var(--ease-detent)',
              boxShadow: 'inset 0 2px 0 rgba(255,255,255,.8), inset -3px 0 0 rgba(27,26,24,.08)',
            }}
          >
            <i style={{ width: '100%', height: 46, background: x.c, borderRadius: 4 }}></i>
            <span
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                font: '300 20px/1 var(--font-display)',
                color: 'var(--text-1)',
                whiteSpace: 'nowrap',
              }}
            >
              {x.n}
            </span>
            <span style={{ font: '500 13px/1 var(--font-sans)', color: 'var(--text-2)' }}>{x.gb} GB</span>
          </button>
        ))}
      </Plate>
      <div style={row(16, { marginTop: 20, justifyContent: 'flex-end' })}>
        <Mark>F-1</Mark>
      </div>
    </Body>
  );
}

/* ---------- D-1 Analytics ---------- */
const MET = [
  { n: 'Visitors', tone: 'blue', c: 'var(--screen-blue)', v: ['3,120', '12,804', '36,550'], seed: 3 },
  { n: 'Sign-ups', tone: 'yellow', c: 'var(--screen-yellow)', v: ['4.1%', '3.8%', '3.6%'], seed: 7 },
  { n: 'Revenue', tone: 'green', c: 'var(--signal-green)', v: ['$8.9k', '$36.2k', '$101k'], seed: 11 },
];
const RNG = [
  { k: '7d', len: 7 },
  { k: '30d', len: 15 },
  { k: '90d', len: 13 },
];
function AnalyticsRoom() {
  const [mi, setMi] = React.useState(0);
  const [ri, setRi] = React.useState(1);
  const [live, setLive] = React.useState(14);
  const [cur, setCur] = React.useState(null);
  React.useEffect(() => {
    const id = setInterval(
      () => setLive((l) => Math.max(4, Math.min(24, l + Math.round(Math.random() * 4 - 2)))),
      900,
    );
    return () => clearInterval(id);
  }, []);
  const m = MET[mi],
    r = RNG[ri];
  const s = Array.from({ length: r.len }, (_, i) =>
    Math.max(1, Math.round(3 + (i / r.len) * 4 + (Math.sin((i + 1) * m.seed * 0.7) * 0.5 + 0.5) * 4)),
  );
  return (
    <Body>
      <div
        className="hw-cols"
        style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 130px', gap: 20 }}
      >
        <Lcd style={{ ...col(18), padding: 26 }}>
          <div style={row(20, { justifyContent: 'space-between', alignItems: 'flex-end' })}>
            <Big size={128} color={m.c}>
              {cur == null ? m.v[ri] : s[cur] * 10}
            </Big>
            <div style={col(8, { alignItems: 'flex-end' })}>
              <Tiny>{m.n}</Tiny>
              <Tiny color="var(--screen-dim)">{cur == null ? r.k : 'Point ' + (cur + 1)}</Tiny>
            </div>
          </div>
          <div
            onMouseLeave={() => setCur(null)}
            style={{ display: 'grid', gridTemplateColumns: `repeat(${s.length},minmax(0,1fr))`, gap: 5 }}
          >
            {s.map((v, i) => (
              <div
                key={i}
                onMouseEnter={() => setCur(i)}
                style={{
                  display: 'grid',
                  gridTemplateRows: 'repeat(10,1fr)',
                  gap: 4,
                  height: 190,
                  cursor: 'crosshair',
                }}
              >
                {Array.from({ length: 10 }, (_, j) => (
                  <i
                    key={j}
                    style={{
                      borderRadius: 99,
                      background:
                        10 - j <= v
                          ? i === s.length - 1 || cur === i
                            ? 'var(--screen-orange)'
                            : m.c
                          : 'var(--screen-grid)',
                    }}
                  ></i>
                ))}
              </div>
            ))}
          </div>
        </Lcd>
        <Plate style={{ padding: 16, ...col(14, { alignItems: 'center', justifyContent: 'space-between' }) }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,10px)', gap: 5 }}>
            {Array.from({ length: 12 }, (_, i) => (
              <Led
                key={i}
                size={10}
                on={i < Math.round(live / 2)}
                color={i > 9 ? 'var(--signal-orange)' : 'var(--signal-green)'}
              />
            ))}
          </div>
          <Big size={52} color="var(--text-1)">
            {live}
          </Big>
          <span style={{ font: '500 14px/1 var(--font-sans)' }}>Live</span>
        </Plate>
      </div>
      <div style={row(18, { marginTop: 22, flexWrap: 'wrap', alignItems: 'flex-end' })}>
        {MET.map((x, i) => (
          <Key
            key={x.n}
            tone={x.tone}
            round
            w={72}
            h={72}
            on={mi === i}
            onClick={() => setMi(i)}
            label={x.n}
          ></Key>
        ))}
        <div style={{ flex: 1 }}></div>
        {RNG.map((x, i) => (
          <div key={x.k} style={col(8, { alignItems: 'center' })}>
            <Led on={ri === i} />
            <Key w={72} h={56} on={ri === i} onClick={() => setRi(i)} aria={x.k}>
              <span style={{ font: '300 22px/1 var(--font-display)' }}>{x.k}</span>
            </Key>
          </div>
        ))}
        <Mark>D-1</Mark>
      </div>
    </Body>
  );
}

/* ---------- V-1 Health ---------- */
const VMODE = [
  {
    n: 'Steps',
    v: (g) => '8,412',
    sub: (g) => 'of ' + g.toLocaleString('en-US'),
    p: (g) => 8412 / g,
    c: 'var(--screen-green)',
  },
  { n: 'Sleep', v: () => '7:20', sub: () => 'of 8:00', p: () => 0.92, c: 'var(--screen-blue)' },
  { n: 'Pulse', v: () => '58', sub: () => 'resting', p: () => 0.58, c: 'var(--screen-orange)' },
];
const HAB = ['Walk', 'Water', 'Stretch', 'Screens off'];
function HealthRoom() {
  const [mi, setMi] = React.useState(0);
  const [goal, setGoal] = React.useState(10000);
  const [done, setDone] = React.useState([true, false, true, false]);
  const m = VMODE[mi],
    p = Math.min(1, m.p(goal)),
    N = 36;
  return (
    <Body style={{ borderRadius: 140, padding: 40, maxWidth: 980, margin: '0 auto' }}>
      <div
        className="hw-cols"
        style={{ display: 'grid', gridTemplateColumns: '380px minmax(0,1fr)', gap: 40, alignItems: 'center' }}
      >
        <div
          style={{
            width: 380,
            height: 380,
            borderRadius: '50%',
            position: 'relative',
            background: 'var(--surface-screen)',
            boxShadow:
              'inset 0 0 0 4px var(--platinum-900), inset 0 2px 10px rgba(0,0,0,.6), 0 0 0 10px var(--platinum-50), 0 0 0 11px var(--platinum-400)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {Array.from({ length: N }, (_, i) => (
            <i
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 6,
                height: 26,
                marginLeft: -3,
                marginTop: -13,
                borderRadius: 3,
                background: i < Math.round(p * N) ? m.c : 'var(--screen-grid)',
                transform: `rotate(${(i / N) * 360}deg) translateY(-160px)`,
              }}
            ></i>
          ))}
          <div style={col(10, { alignItems: 'center' })}>
            <Tiny>{m.n}</Tiny>
            <Big size={96}>{m.v(goal)}</Big>
            <Tiny color="var(--screen-dim)">{m.sub(goal)}</Tiny>
          </div>
        </div>
        <div style={col(26)}>
          <div style={row(18, { alignItems: 'flex-end' })}>
            <Key
              tone="orange"
              round
              w={120}
              h={120}
              onClick={() => setMi((v) => (v + 1) % 3)}
              label="Mode"
            ></Key>
            <div style={col(12)}>
              <Key
                tone="dark"
                w={64}
                h={52}
                onClick={() => setGoal((g) => Math.min(16000, g + 500))}
                aria="Raise goal"
              >
                +
              </Key>
              <Key
                tone="dark"
                w={64}
                h={52}
                onClick={() => setGoal((g) => Math.max(4000, g - 500))}
                label="Goal"
                aria="Lower goal"
              >
                −
              </Key>
            </div>
            <div style={{ flex: 1 }}></div>
            <Mark>V-1</Mark>
          </div>
          <div style={row(16, { flexWrap: 'wrap' })}>
            {HAB.map((h, i) => (
              <div key={h} style={col(8, { alignItems: 'center' })}>
                <Led on={done[i]} color="var(--signal-green)" size={10} />
                <Key
                  w={76}
                  h={56}
                  on={done[i]}
                  onClick={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
                  label={h}
                ></Key>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Body>
  );
}

export { CalendarRoom, FilesRoom, AnalyticsRoom, HealthRoom };

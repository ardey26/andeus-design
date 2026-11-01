import React from 'react';
import { Icon } from '@andeus/ui';
import { Body, Plate, Lcd, Key, Led, Grille, Big, Tiny, Mark, Step } from './hw-kit';

const row = (gap = 16, extra) => ({ display: 'flex', gap, alignItems: 'center', ...extra });
const col = (gap = 16, extra) => ({ display: 'flex', flexDirection: 'column', gap, ...extra });

/* ---------- I-1 Invest ---------- */
const BLOCKS = [
  { k: 'when', c: 'var(--screen-blue)', t: 'Every Monday' },
  { k: 'if', c: 'var(--screen-yellow)', t: 'SPY above 200-day' },
  { k: 'then', c: 'var(--signal-green)', t: 'QQQ 60 · TLT 40' },
  { k: 'until', c: 'var(--signal-orange)', t: 'Drawdown −15%' },
];
const PERIODS = [
  { k: '1y', n: 12 },
  { k: '5y', n: 30 },
  { k: '10y', n: 48 },
];

function InvestRoom() {
  const [on, setOn] = React.useState([true, true, true, true]);
  const [pi, setPi] = React.useState(2);
  const [prog, setProg] = React.useState(1);
  const n = PERIODS[pi].n,
    act = on.filter(Boolean).length;
  const bench = [],
    strat = [];
  let b = 100,
    s = 100;
  for (let i = 0; i < n; i++) {
    const r = 0.006 + 0.03 * Math.sin(i * 1.7) * Math.cos(i * 0.4);
    b *= 1 + r;
    s *= 1 + r * (on[3] ? 0.55 : 1) + 0.0016 * act + (on[1] && r < 0 ? -r * 0.6 : 0);
    bench.push(b);
    strat.push(s);
  }
  const shown = Math.max(2, Math.round(n * prog));
  const ret = ((strat[n - 1] / 100) ** (12 / n) - 1) * 100,
    bret = ((bench[n - 1] / 100) ** (12 / n) - 1) * 100;
  const run = () => {
    setProg(0);
    let p = 0;
    const id = setInterval(() => {
      p += 0.04;
      setProg(Math.min(1, p));
      if (p >= 1) clearInterval(id);
    }, 30);
  };
  const W = 600,
    H = 220,
    all = [...bench, ...strat];
  const pathOf = (pts) =>
    Step(
      [...pts.slice(0, shown), Math.min(...all), Math.max(...all)].slice(0, shown).concat([]),
      (W * (shown - 1)) / (n - 1),
      H,
    );
  const norm = (pts) => {
    const mn = Math.min(...all),
      mx = Math.max(...all),
      dx = W / (n - 1),
      y = (v) => H - 6 - ((v - mn) / (mx - mn)) * (H - 12);
    return pts
      .slice(0, shown)
      .map((v, i) => (i ? `H${(i * dx).toFixed(1)}V${y(v).toFixed(1)}` : `M0 ${y(v).toFixed(1)}`))
      .join('');
  };
  return (
    <Body>
      <div
        className="hw-cols"
        style={{ display: 'grid', gridTemplateColumns: '330px minmax(0,1fr)', gap: 20 }}
      >
        <Plate style={{ padding: 16, ...col(12) }}>
          {BLOCKS.map((x, i) => (
            <button
              key={x.k}
              className="hw-key"
              onClick={() => setOn((o) => o.map((v, j) => (j === i ? !v : v)))}
              style={{
                all: 'unset',
                boxSizing: 'border-box',
                cursor: 'pointer',
                display: 'grid',
                gridTemplateColumns: '64px minmax(0,1fr) auto',
                alignItems: 'stretch',
                height: 72,
                marginLeft: i === 0 ? 0 : 24,
                borderRadius: 10,
                overflow: 'hidden',
                border: '1px solid rgba(27,26,24,.35)',
                background: 'var(--platinum-50)',
                boxShadow: on[i]
                  ? 'inset 0 3px 6px rgba(0,0,0,.18)'
                  : 'inset 0 -4px 0 rgba(27,26,24,.12), 0 3px 0 rgba(27,26,24,.3)',
                opacity: on[i] ? 1 : 0.55,
              }}
            >
              <span
                style={{
                  background: x.c,
                  display: 'grid',
                  placeItems: 'center',
                  font: '500 15px/1 var(--font-sans)',
                  color: x.k === 'if' ? 'var(--text-1)' : 'var(--text-on-ink)',
                }}
              >
                {x.k}
              </span>
              <span style={{ alignSelf: 'center', padding: '0 14px', font: '400 17px/1.2 var(--font-sans)' }}>
                {x.t}
              </span>
              <span style={{ alignSelf: 'center', paddingRight: 14 }}>
                <Led on={on[i]} color={x.c} size={10} />
              </span>
            </button>
          ))}
        </Plate>
        <div style={col(16)}>
          <Lcd style={{ ...col(14), flex: 1 }}>
            <div style={row(20, { justifyContent: 'space-between', alignItems: 'flex-end' })}>
              <Big size={92} color="var(--screen-blue)">
                {ret.toFixed(1)}%
              </Big>
              <div style={col(8, { alignItems: 'flex-end' })}>
                <Tiny color="var(--screen-yellow)">SPY {bret.toFixed(1)}%</Tiny>
                <Tiny>{act} of 4 blocks</Tiny>
              </div>
            </div>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              style={{ width: '100%', height: 200, display: 'block' }}
            >
              {[0.25, 0.5, 0.75].map((g) => (
                <line
                  key={g}
                  x1="0"
                  x2={W}
                  y1={H * g}
                  y2={H * g}
                  stroke="var(--screen-grid)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                ></line>
              ))}
              <path
                d={norm(bench)}
                fill="none"
                stroke="var(--screen-yellow)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                shapeRendering="geometricPrecision"
              ></path>
              <path
                d={norm(strat)}
                fill="none"
                stroke="var(--screen-blue)"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
                shapeRendering="geometricPrecision"
              ></path>
            </svg>
          </Lcd>
          <div style={row(18, { justifyContent: 'space-between', flexWrap: 'wrap' })}>
            <div style={row(14)}>
              {PERIODS.map((p, i) => (
                <div key={p.k} style={col(8, { alignItems: 'center' })}>
                  <Led on={pi === i} />
                  <Key w={64} h={52} on={pi === i} onClick={() => setPi(i)} label={p.k}>
                    <span style={{ font: '300 20px/1 var(--font-display)' }}>{p.k}</span>
                  </Key>
                </div>
              ))}
            </div>
            <Key tone="orange" round w={84} h={84} onClick={run} label="Run" aria="Run backtest">
              <Icon name="play" size={28} color="var(--text-on-signal)" />
            </Key>
          </div>
        </div>
      </div>
    </Body>
  );
}

/* ---------- S-1 Studio ---------- */
const TR = [
  {
    n: 'Kick',
    c: 'var(--screen-blue)',
    tone: 'blue',
    init: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0],
  },
  {
    n: 'Snare',
    c: 'var(--screen-yellow)',
    tone: 'yellow',
    init: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  },
  {
    n: 'Hat',
    c: 'var(--signal-green)',
    tone: 'green',
    init: [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
  },
];
function StudioRoom() {
  const [grid, setGrid] = React.useState(() => TR.map((t) => t.init.map(Boolean)));
  const [tr, setTr] = React.useState(0);
  const [play, setPlay] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [bpm, setBpm] = React.useState(112);
  const ctx = React.useRef(null);
  React.useEffect(() => {
    if (!play) return;
    const id = setInterval(() => setStep((s) => (s + 1) % 16), 60000 / bpm / 4);
    return () => clearInterval(id);
  }, [play, bpm]);
  const hit = (r) => {
    try {
      const c = ctx.current || (ctx.current = new (window.AudioContext || window.webkitAudioContext)()),
        t = c.currentTime;
      if (r === 0) {
        const o = c.createOscillator(),
          g = c.createGain();
        o.frequency.setValueAtTime(150, t);
        o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
        g.gain.setValueAtTime(0.5, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        o.connect(g).connect(c.destination);
        o.start(t);
        o.stop(t + 0.2);
        return;
      }
      const len = r === 1 ? 0.15 : 0.04,
        b = c.createBuffer(1, Math.floor(c.sampleRate * len), c.sampleRate),
        d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      const s = c.createBufferSource(),
        f = c.createBiquadFilter(),
        g = c.createGain();
      s.buffer = b;
      f.type = 'highpass';
      f.frequency.value = r === 1 ? 1200 : 7000;
      g.gain.value = r === 1 ? 0.35 : 0.15;
      s.connect(f).connect(g).connect(c.destination);
      s.start(t);
    } catch (e) {}
  };
  React.useEffect(() => {
    if (play) grid.forEach((rw, r) => rw[step] && hit(r));
  }, [step, play]);
  const flip = (c) =>
    setGrid((g) => g.map((rw, i) => (i !== tr ? rw : rw.map((v, j) => (j === c ? !v : v)))));
  return (
    <Body>
      <div
        className="hw-cols"
        style={{
          display: 'grid',
          gridTemplateColumns: '150px minmax(0,1fr) 110px',
          gap: 20,
          marginBottom: 22,
        }}
      >
        <Grille style={{ minHeight: 180 }} />
        <Lcd style={col(14)}>
          <div style={row(16, { justifyContent: 'space-between', alignItems: 'flex-end' })}>
            <Big size={88} color="var(--screen-orange)">
              {bpm}
            </Big>
            <Tiny>
              {TR[tr].n} · step {step + 1}
            </Tiny>
          </div>
          {TR.map((t, r) => (
            <div key={t.n} style={{ display: 'grid', gridTemplateColumns: 'repeat(16,1fr)', gap: 3 }}>
              {grid[r].map((v, c) => (
                <i
                  key={c}
                  style={{
                    height: r === tr ? 12 : 7,
                    background: v ? t.c : 'var(--screen-grid)',
                    outline: play && c === step ? '2px solid var(--screen-ink)' : 'none',
                  }}
                ></i>
              ))}
            </div>
          ))}
        </Lcd>
        <Plate style={{ padding: 14, ...col(12, { alignItems: 'center', justifyContent: 'space-between' }) }}>
          {TR.map((t, i) => (
            <Key
              key={t.n}
              tone={t.tone}
              round
              w={56}
              h={56}
              on={tr === i}
              onClick={() => setTr(i)}
              aria={t.n}
            ></Key>
          ))}
        </Plate>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16,minmax(0,1fr))', gap: 8 }}>
        {grid[tr].map((v, c) => (
          <div key={c} style={col(10, { alignItems: 'center', marginLeft: c % 4 === 0 && c ? 8 : 0 })}>
            <Led on={play && c === step} color="var(--signal-orange)" />
            <Key
              w="100%"
              h={64}
              tone={v ? TR[tr].tone : c % 4 === 0 ? 'light' : 'light'}
              on={v}
              onClick={() => flip(c)}
              aria={'Step ' + (c + 1)}
              style={
                v ? undefined : { background: c % 4 === 0 ? 'var(--platinum-100)' : 'var(--platinum-50)' }
              }
            ></Key>
            <span style={{ font: '500 13px/1 var(--font-sans)', color: 'var(--text-2)' }}>{c + 1}</span>
          </div>
        ))}
      </div>
      <div style={row(18, { marginTop: 22, flexWrap: 'wrap' })}>
        <Key
          tone="orange"
          round
          w={84}
          h={84}
          on={play}
          onClick={() => setPlay((p) => !p)}
          label={play ? 'Stop' : 'Play'}
        >
          <Icon name={play ? 'pause' : 'play'} size={30} color="var(--text-on-signal)" />
        </Key>
        <Key tone="dark" w={64} h={64} onClick={() => setBpm((b) => Math.max(60, b - 2))} label="Slower">
          −
        </Key>
        <Key tone="dark" w={64} h={64} onClick={() => setBpm((b) => Math.min(180, b + 2))} label="Faster">
          +
        </Key>
        <div style={{ flex: 1 }}></div>
        <Key
          tone="grey"
          w={110}
          h={64}
          onClick={() => setGrid((g) => g.map((rw, i) => (i === tr ? rw.map(() => false) : rw)))}
          label="Clear track"
        >
          <Icon name="reload" size={24} color="var(--text-on-ink)" />
        </Key>
        <Mark>S-1</Mark>
      </div>
    </Body>
  );
}

/* ---------- H-1 Home ---------- */
function Rocker({ on, onClick, label, color }) {
  return (
    <div style={col(12, { alignItems: 'center' })}>
      <Led on={on} color={color} size={10} />
      <button
        className="hw-key"
        aria-label={label}
        onClick={onClick}
        style={{
          width: 110,
          height: 150,
          borderRadius: 14,
          border: '1px solid rgba(27,26,24,.35)',
          padding: 0,
          cursor: 'pointer',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateRows: '1fr 1fr',
          background: 'var(--platinum-50)',
          boxShadow: '0 3px 0 rgba(27,26,24,.3)',
        }}
      >
        <span
          style={{
            background: on ? 'var(--platinum-200)' : 'var(--platinum-50)',
            boxShadow: on ? 'inset 0 4px 6px rgba(0,0,0,.18)' : 'inset 0 -2px 0 rgba(27,26,24,.1)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <i
            style={{ width: 22, height: 3, background: on ? color : 'var(--platinum-400)', borderRadius: 2 }}
          ></i>
        </span>
        <span
          style={{
            background: on ? 'var(--platinum-50)' : 'var(--platinum-200)',
            boxShadow: on ? 'inset 0 -4px 0 rgba(27,26,24,.12)' : 'inset 0 4px 6px rgba(0,0,0,.18)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <i
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              border: '2px solid ' + (on ? 'var(--platinum-400)' : 'var(--text-1)'),
            }}
          ></i>
        </span>
      </button>
      <span style={{ font: '500 14px/1 var(--font-sans)' }}>{label}</span>
    </div>
  );
}
const MODES = ['Heat', 'Cool', 'Off'];
function HomeRoom() {
  const [t, setT] = React.useState(21.5);
  const [mode, setMode] = React.useState(0);
  const [lights, setLights] = React.useState(true);
  const [fan, setFan] = React.useState(false);
  const [lock, setLock] = React.useState(true);
  const col2 = mode === 0 ? 'var(--screen-orange)' : mode === 1 ? 'var(--screen-blue)' : 'var(--screen-dim)';
  return (
    <Body style={{ maxWidth: 900, margin: '0 auto' }}>
      <div
        className="hw-cols"
        style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 96px', gap: 20, marginBottom: 24 }}
      >
        <Lcd style={{ ...col(16), padding: 28 }}>
          <div style={row(20, { justifyContent: 'space-between', alignItems: 'flex-start' })}>
            <Big size={168} color={col2}>
              {mode === 2 ? '––.–' : t.toFixed(1)}°
            </Big>
            <div style={col(10, { alignItems: 'flex-end' })}>
              {MODES.map((m, i) => (
                <Tiny key={m} color={i === mode ? 'var(--screen-ink)' : 'var(--screen-grid)'}>
                  {m}
                </Tiny>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24,1fr)', gap: 3 }}>
            {Array.from({ length: 24 }, (_, i) => (
              <i
                key={i}
                style={{
                  height: 10,
                  background: mode !== 2 && i < Math.round((t - 15) * 2) ? col2 : 'var(--screen-grid)',
                }}
              ></i>
            ))}
          </div>
          <div style={row(28)}>
            <Tiny>Inside 19.4°</Tiny>
            <Tiny>Outside 7°</Tiny>
            <Tiny color={lock ? 'var(--screen-green)' : 'var(--screen-red)'}>
              {lock ? 'Locked' : 'Unlocked'}
            </Tiny>
          </div>
        </Lcd>
        <div style={col(12, { justifyContent: 'space-between' })}>
          <Key
            tone="dark"
            w="100%"
            h={96}
            onClick={() => setT((v) => Math.min(28, +(v + 0.5).toFixed(1)))}
            aria="Warmer"
          >
            +
          </Key>
          <Key tone="orange" w="100%" h={56} onClick={() => setMode((m) => (m + 1) % 3)} aria="Mode">
            <span style={{ font: '500 15px/1 var(--font-sans)' }}>{MODES[mode]}</span>
          </Key>
          <Key
            tone="dark"
            w="100%"
            h={96}
            onClick={() => setT((v) => Math.max(15, +(v - 0.5).toFixed(1)))}
            aria="Cooler"
          >
            −
          </Key>
        </div>
      </div>
      <div style={row(24, { justifyContent: 'space-between', flexWrap: 'wrap', alignItems: 'flex-end' })}>
        <Rocker
          on={lights}
          onClick={() => setLights((v) => !v)}
          label="Lights"
          color="var(--screen-yellow)"
        />
        <Rocker on={fan} onClick={() => setFan((v) => !v)} label="Fan" color="var(--screen-blue)" />
        <Rocker on={lock} onClick={() => setLock((v) => !v)} label="Door" color="var(--signal-green)" />
        <Grille style={{ width: 160, height: 150 }} />
        <Mark>H-1</Mark>
      </div>
    </Body>
  );
}

/* ---------- M-1 Inbox ---------- */
const MAIL = [
  {
    f: 'Ines',
    s: 'Quarter plan, second draft',
    b: 'Cut hiring to one page. Budget moved to the end. Read before Thursday?',
  },
  { f: 'Studio Halden', s: 'Prints ready', b: 'All twelve framed. Open until six.' },
  { f: 'Marek', s: 'Lunch Friday', b: 'The corner place reopened. One o’clock?' },
  { f: 'Bank', s: 'October statement', b: 'Available now. Nothing to do.' },
];
function InboxRoom() {
  const [i, setI] = React.useState(0);
  const [read, setRead] = React.useState([false, false, false, true]);
  const [sent, setSent] = React.useState(false);
  const go = (d) => {
    const n = (i + d + MAIL.length) % MAIL.length;
    setI(n);
    setSent(false);
    setRead((r) => r.map((v, j) => (j === n ? true : v)));
  };
  React.useEffect(() => {
    setRead((r) => r.map((v, j) => (j === 0 ? true : v)));
  }, []);
  const m = MAIL[i],
    unread = read.filter((r) => !r).length;
  return (
    <Body>
      <div
        className="hw-cols"
        style={{ display: 'grid', gridTemplateColumns: '170px minmax(0,1fr) 120px', gap: 20 }}
      >
        <Plate style={{ padding: 18, ...col(16, { alignItems: 'center', justifyContent: 'space-between' }) }}>
          <Big size={120} color="var(--text-1)" weight={200}>
            {unread}
          </Big>
          <div style={row(8)}>
            {read.map((r, j) => (
              <Led key={j} on={!r} />
            ))}
          </div>
          <span style={{ font: '500 14px/1 var(--font-sans)' }}>Unread</span>
        </Plate>
        <Lcd style={{ ...col(14), padding: 26, minHeight: 260 }}>
          <div style={row(12, { justifyContent: 'space-between' })}>
            <Tiny>
              {i + 1} / {MAIL.length}
            </Tiny>
            <Tiny color={sent ? 'var(--screen-green)' : 'var(--screen-dim)'}>
              {sent ? 'Reply sent' : 'Inbox'}
            </Tiny>
          </div>
          <Big size={72} color="var(--screen-orange)" weight={300}>
            {m.f}
          </Big>
          <span style={{ font: '400 24px/1.25 var(--font-sans)', color: 'var(--screen-ink)' }}>{m.s}</span>
          <span
            style={{
              font: '400 17px/1.45 var(--font-sans)',
              color: 'var(--screen-ink)',
              opacity: 0.8,
              textWrap: 'pretty',
            }}
          >
            {m.b}
          </span>
        </Lcd>
        <div style={col(14, { alignItems: 'center' })}>
          <Key tone="dark" w={96} h={80} onClick={() => go(-1)} aria="Previous">
            <Icon name="arrow-up" size={28} color="var(--text-on-ink)" />
          </Key>
          <Key tone="dark" w={96} h={80} onClick={() => go(1)} aria="Next">
            <Icon name="chevron-down" size={28} color="var(--text-on-ink)" />
          </Key>
          <Key tone="orange" w={96} h={80} on={sent} onClick={() => setSent(true)} label="Reply">
            <Icon name="arrow-left" size={28} color="var(--text-on-signal)" />
          </Key>
        </div>
      </div>
      <div style={row(16, { marginTop: 20, justifyContent: 'space-between' })}>
        <Grille style={{ height: 44, flex: 1 }} pitch={9} dot={2} />
        <Mark>M-1</Mark>
      </div>
    </Body>
  );
}

export { InvestRoom, StudioRoom, HomeRoom, InboxRoom };

import React from 'react';
import { Button, Icon } from '@andeus/ui';

const WHITE = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23];
const BLACK_AFTER = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12];
const NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const TRACKS = [
  { c: 'var(--screen-blue)', wave: 'triangle', n: 'Soft' },
  { c: 'var(--screen-yellow)', wave: 'square', n: 'Reed' },
  { c: 'var(--platinum-400)', wave: 'sine', n: 'Pure' },
  { c: 'var(--signal-orange)', wave: 'sawtooth', n: 'Buzz' },
];
const ROW2 = [
  { i: 'zap' },
  { i: 'clock' },
  { i: 'list' },
  { i: 'chart-bar' },
  { big: '1' },
  { big: '2' },
  { big: '3' },
  { big: '4' },
  { n: '1', s: 'in' },
  { n: '2', s: 'out' },
  { n: '3', s: 'loop' },
  { n: '4', s: 'tape' },
  { n: '5', s: 'rev' },
  { n: '6', s: 'rate' },
  { n: '7', s: 'm1' },
  { n: '8', s: 'm2' },
  { s: '···' },
];
const KEYMAP = 'asdfghjkl';
const U = 'var(--u)';
const cell = {
  border: 'none',
  padding: 0,
  margin: 0,
  cursor: 'pointer',
  background: 'var(--platinum-50)',
  borderRadius: 'calc(var(--u) * .1)',
  display: 'grid',
  placeItems: 'center',
  color: 'var(--text-1)',
  fontFamily: 'var(--font-sans)',
  boxShadow: 'inset 0 -3px 0 rgba(27,26,24,.1), 0 1px 0 rgba(27,26,24,.18)',
  position: 'relative',
};
const at = (c, r, cs = 1, rs = 1) => ({ gridColumn: `${c} / span ${cs}`, gridRow: `${r} / span ${rs}` });

function HK({ c, r, cs, rs, onDown, down, children, style }) {
  return (
    <button
      className="hw-key"
      onPointerDown={onDown}
      style={{
        ...cell,
        ...at(c, r, cs, rs),
        ...(down
          ? { background: 'var(--platinum-200)', boxShadow: 'inset 0 2px 3px rgba(27,26,24,.2)' }
          : null),
        ...style,
      }}
    >
      {children}
    </button>
  );
}

const WORDMARK = {
  font: '200 clamp(56px,15.5vw,300px)/0.78 var(--font-display)',
  letterSpacing: '-0.065em',
  whiteSpace: 'nowrap',
  marginLeft: '-1.5vw',
  userSelect: 'none',
};
const SR_ONLY = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
};

function ShowHero({ go, count, rooms }) {
  const [track, setTrack] = React.useState(3);
  const [note, setNote] = React.useState(null);
  const [hit, setHit] = React.useState(0);
  const [play, setPlay] = React.useState(false);
  const [rec, setRec] = React.useState(false);
  const [pos, setPos] = React.useState(0);
  const [marks, setMarks] = React.useState([
    { t: 3, x: 12 },
    { t: 3, x: 30 },
    { t: 0, x: 22 },
    { t: 1, x: 55 },
    { t: 3, x: 64 },
    { t: 2, x: 80 },
  ]);
  const [down, setDown] = React.useState(null);
  const actx = React.useRef(null);
  const posRef = React.useRef(0);
  posRef.current = pos;

  React.useEffect(() => {
    if (!play) return;
    const id = setInterval(() => setPos((p) => (p + 0.6) % 100), 30);
    return () => clearInterval(id);
  }, [play]);

  const sound = (semi, id) => {
    try {
      const c = actx.current || (actx.current = new (window.AudioContext || window.webkitAudioContext)());
      const o = c.createOscillator(),
        g = c.createGain(),
        t = c.currentTime;
      o.type = TRACKS[track].wave;
      o.frequency.value = 261.63 * Math.pow(2, semi / 12);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
      o.connect(g).connect(c.destination);
      o.start(t);
      o.stop(t + 0.75);
    } catch (e) {}
    setNote(NAMES[semi % 12] + (4 + Math.floor(semi / 12)));
    setHit((h) => h + 1);
    setDown(id);
    setTimeout(() => setDown((d) => (d === id ? null : d)), 160);
    if (rec) setMarks((m) => [...m.slice(-40), { t: track, x: posRef.current }]);
  };

  React.useEffect(() => {
    const k = (e) => {
      if (
        e.repeat ||
        /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) ||
        e.target.isContentEditable ||
        (e.target.closest && e.target.closest('[data-typer]'))
      )
        return;
      const i = KEYMAP.indexOf(e.key.toLowerCase());
      if (i >= 0) sound(WHITE[i], 'w' + i);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });

  const accent = TRACKS[track].c;
  const bars = Array.from(
    { length: 36 },
    (_, i) => 0.18 + 0.82 * Math.abs(Math.sin((i + 1) * (0.35 + track * 0.21) + hit * 1.7)),
  );

  return (
    <section
      data-screen-label="Hero"
      style={{ position: 'relative', overflow: 'hidden', paddingTop: 'clamp(24px,4vw,56px)' }}
    >
      <h1 style={SR_ONLY}>Andeus Design</h1>
      <div aria-hidden="true" style={{ ...WORDMARK, color: 'var(--platinum-400)' }}>
        Andeus Design
      </div>

      <div
        style={{
          position: 'relative',
          '--u': 'min(calc((100vw - 96px) / 19.2), 80px)',
          width: 'max-content',
          margin: 'calc(var(--u) * -1.9) auto 0',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            background: 'linear-gradient(180deg,var(--platinum-100),var(--platinum-300))',
            borderRadius: 'calc(var(--u) * .22)',
            padding: 'calc(var(--u) * .22)',
            paddingRight: 0,
            boxShadow:
              'inset 0 2px 0 rgba(255,255,255,.8), inset 0 -2px 0 rgba(27,26,24,.12), 0 2px 0 var(--platinum-500), 0 60px 80px -40px rgba(27,26,24,.55)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(17, ${U})`,
              gridAutoRows: U,
              gap: 2,
              padding: 2,
              background: 'var(--platinum-400)',
              borderRadius: 'calc(var(--u) * .12)',
            }}
          >
            <div
              style={{
                ...at(1, 1, 2, 2),
                background:
                  'radial-gradient(circle,var(--platinum-800) 1.6px,transparent 2px) 0 0/7px 7px, var(--platinum-50)',
                backgroundClip: 'content-box',
                padding: 'calc(var(--u) * .22)',
                borderRadius: 'calc(var(--u) * .1)',
                backgroundColor: 'var(--platinum-50)',
              }}
            ></div>
            <HK c={3} r={1}>
              <Icon name="sliders" size={22} />
            </HK>
            <HK c={4} r={1}>
              <span
                style={{
                  width: '46%',
                  height: '46%',
                  borderRadius: 6,
                  background: 'var(--platinum-100)',
                  boxShadow: 'inset 0 -2px 0 rgba(27,26,24,.12), 0 0 0 1px var(--platinum-300)',
                }}
              ></span>
            </HK>
            <HK c={3} r={2} onDown={() => setPos(0)}>
              <Icon name="reload" size={22} />
            </HK>
            <HK c={4} r={2}>
              <Icon name="clock" size={22} />
            </HK>

            <div
              style={{
                ...at(5, 1, 4, 2),
                background: 'var(--surface-screen)',
                borderRadius: 'calc(var(--u) * .08)',
                padding: 'calc(var(--u) * .18) calc(var(--u) * .22)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'calc(var(--u) * .1)',
                boxShadow: 'inset 0 0 0 3px var(--platinum-900)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  color: 'var(--screen-ink)',
                }}
              >
                <span style={{ font: `200 calc(var(--u) * .5)/1 var(--font-display)`, color: accent }}>
                  {track + 1}
                </span>
                <span
                  style={{
                    font: `300 calc(var(--u) * .3)/1 var(--font-display)`,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {note || '—'}
                </span>
                <span style={{ font: `500 calc(var(--u) * .16)/1 var(--font-sans)` }}>
                  {TRACKS[track].n} · 120 bpm
                </span>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, minHeight: 0 }}>
                {bars.map((b, i) => (
                  <i
                    key={i}
                    style={{
                      flex: 1,
                      height: (note ? b * 100 : 6) + '%',
                      background: i % 9 === 0 ? 'var(--screen-ink)' : accent,
                      transition: 'height 140ms var(--ease-detent)',
                    }}
                  ></i>
                ))}
              </div>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {TRACKS.map((t, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'relative',
                      height: 'calc(var(--u) * .055)',
                      background: 'var(--screen-grid)',
                    }}
                  >
                    {marks
                      .filter((m) => m.t === i)
                      .map((m, j) => (
                        <i
                          key={j}
                          style={{
                            position: 'absolute',
                            left: m.x + '%',
                            width: '6%',
                            top: 0,
                            bottom: 0,
                            background: t.c,
                          }}
                        ></i>
                      ))}
                  </div>
                ))}
                <i
                  style={{
                    position: 'absolute',
                    left: pos + '%',
                    top: -4,
                    bottom: -4,
                    width: 2,
                    background: rec ? 'var(--screen-red)' : 'var(--screen-ink)',
                  }}
                ></i>
              </div>
            </div>

            {TRACKS.map((t, i) => (
              <HK key={i} c={9 + i * 2} r={1} cs={2} rs={2} onDown={() => setTrack(i)} down={track === i}>
                <span
                  style={{
                    width: 'calc(var(--u) * .78)',
                    height: 'calc(var(--u) * .78)',
                    borderRadius: 'calc(var(--u) * .16)',
                    background: t.c,
                    boxShadow:
                      track === i
                        ? 'inset 0 3px 4px rgba(0,0,0,.3)'
                        : 'inset 0 -4px 0 rgba(0,0,0,.18), 0 3px 0 rgba(27,26,24,.25)',
                    transform: track === i ? 'translateY(2px)' : 'none',
                    transition: 'transform 60ms var(--ease-detent)',
                  }}
                ></span>
              </HK>
            ))}
            <HK c={17} r={1}>
              <span
                style={{
                  width: 3,
                  height: '34%',
                  background: 'var(--signal-orange)',
                  transform: 'rotate(35deg)',
                  borderRadius: 2,
                }}
              ></span>
            </HK>
            <HK c={17} r={2}>
              <span style={{ font: '500 calc(var(--u) * .17)/1 var(--font-sans)' }}>com</span>
            </HK>

            {ROW2.map((k, i) => (
              <HK key={i} c={i + 1} r={3}>
                {k.i ? (
                  <Icon name={k.i} size={22} />
                ) : k.big ? (
                  <span style={{ font: '200 calc(var(--u) * .5)/1 var(--font-display)' }}>{k.big}</span>
                ) : (
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    {k.n ? (
                      <span style={{ font: '300 calc(var(--u) * .28)/1 var(--font-display)' }}>{k.n}</span>
                    ) : null}
                    <span style={{ font: '500 calc(var(--u) * .15)/1 var(--font-sans)' }}>{k.s}</span>
                  </span>
                )}
              </HK>
            ))}

            <HK c={1} r={4}>
              <Icon name="upload" size={22} />
            </HK>
            <HK c={2} r={4}>
              <Icon name="download" size={22} />
            </HK>
            <HK c={3} r={4} onDown={() => setMarks([])}>
              <Icon name="trash" size={22} />
            </HK>
            <HK c={1} r={5} onDown={() => setRec((r) => !r)} down={rec}>
              <span
                style={{
                  width: 'calc(var(--u) * .2)',
                  height: 'calc(var(--u) * .2)',
                  borderRadius: 99,
                  background: 'var(--signal-orange)',
                }}
              ></span>
            </HK>
            <HK c={2} r={5} onDown={() => setPlay(true)} down={play}>
              <Icon name="play" size={22} />
            </HK>
            <HK
              c={3}
              r={5}
              onDown={() => {
                setPlay(false);
                setRec(false);
              }}
            >
              <span
                style={{
                  width: 'calc(var(--u) * .18)',
                  height: 'calc(var(--u) * .18)',
                  background: 'var(--text-1)',
                }}
              ></span>
            </HK>
            <HK c={1} r={6} onDown={() => setTrack((t) => (t + 3) % 4)}>
              <Icon name="arrow-left" size={22} />
            </HK>
            <HK c={2} r={6} onDown={() => setTrack((t) => (t + 1) % 4)}>
              <Icon name="arrow-right" size={22} />
            </HK>
            <HK c={3} r={6}>
              <span style={{ font: '500 calc(var(--u) * .2)/1 var(--font-sans)' }}>shift</span>
            </HK>

            <div
              style={{
                ...at(4, 4, 14, 1),
                position: 'relative',
                background: 'var(--platinum-50)',
                borderRadius: 'calc(var(--u) * .1)',
                boxShadow: 'inset 0 -3px 0 rgba(27,26,24,.1)',
              }}
            >
              {BLACK_AFTER.map((w, i) => (
                <button
                  key={i}
                  className="hw-key"
                  aria-label={'Sharp ' + (i + 1)}
                  onPointerDown={() => sound(WHITE[w] + 1, 'b' + i)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: `calc(${((w + 1) / 14) * 100}% - var(--u) * .3)`,
                    marginTop: 'calc(var(--u) * -.3)',
                    width: 'calc(var(--u) * .6)',
                    height: 'calc(var(--u) * .6)',
                    borderRadius: 99,
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    background: down === 'b' + i ? accent : 'var(--platinum-900)',
                    boxShadow: 'inset 0 2px 0 rgba(255,255,255,.18), 0 3px 0 rgba(27,26,24,.35)',
                  }}
                ></button>
              ))}
            </div>
            {WHITE.map((s, i) => (
              <HK key={i} c={4 + i} r={5} rs={2} onDown={() => sound(s, 'w' + i)} down={down === 'w' + i}>
                <span
                  style={{
                    width: '64%',
                    height: '84%',
                    borderRadius: 99,
                    background: down === 'w' + i ? accent : 'var(--platinum-50)',
                    boxShadow:
                      'inset 0 -3px 0 rgba(27,26,24,.12), 0 0 0 1px var(--platinum-300), 0 3px 4px rgba(27,26,24,.12)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingBottom: 8,
                    boxSizing: 'border-box',
                    font: '500 calc(var(--u) * .15)/1 var(--font-sans)',
                    color: 'var(--text-2)',
                  }}
                >
                  {KEYMAP[i] || ''}
                </span>
              </HK>
            ))}
          </div>
          <div
            style={{
              width: 'calc(var(--u) * 1.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'calc(var(--u) * .2) 0',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                background: play ? 'var(--signal-green)' : 'var(--platinum-700)',
              }}
            ></span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  font: '200 calc(var(--u) * .6)/1 var(--font-display)',
                  letterSpacing: '-0.03em',
                }}
              >
                A-1
              </span>
              <span
                style={{
                  font: '500 calc(var(--u) * .15)/1 var(--font-sans)',
                  border: '1px solid var(--text-1)',
                  borderRadius: 3,
                  padding: '3px 5px',
                }}
              >
                andeus
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="sc-wrap"
        style={{
          paddingTop: 'clamp(72px,9vw,140px)',
          paddingBottom: 72,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 32,
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button variant="primary" size="l" icon="chevron-down" onClick={() => go('rooms')}>
            Walk the rooms
          </Button>
          <Button size="l" onClick={() => go('parts')}>
            See the parts
          </Button>
        </div>
      </div>
    </section>
  );
}

export { ShowHero };

import React from 'react';
import { Segmented, Icon } from '@andeus/ui';
import { Body, Plate, Lcd, Grille, Led, Mark } from './hw-kit';

const TONE = {
  dark: { bg: 'var(--platinum-900)', fg: 'var(--text-on-ink)' },
  light: { bg: 'var(--platinum-50)', fg: 'var(--text-1)' },
  orange: { bg: 'var(--signal-orange)', fg: 'var(--text-on-signal)' },
  grey: { bg: 'var(--platinum-600)', fg: 'var(--text-on-ink)' },
};
const keyBase = {
  width: '100%',
  aspectRatio: '1',
  borderRadius: 10,
  border: '1px solid rgba(27,26,24,.35)',
  cursor: 'pointer',
  boxSizing: 'border-box',
  boxShadow:
    'inset 0 1px 0 rgba(255,255,255,.3), inset 0 -4px 0 rgba(27,26,24,.15), 0 3px 0 rgba(27,26,24,.3)',
  padding: 0,
  overflow: 'hidden',
  fontFamily: 'var(--font-sans)',
};

function Key({ tone = 'dark', label, glyph, onClick, aria }) {
  const t = TONE[tone];
  return (
    <button
      className="hw-key"
      aria-label={aria || label}
      onClick={onClick}
      style={{
        ...keyBase,
        background: t.bg,
        color: t.fg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '8px 9px',
        textAlign: 'left',
      }}
    >
      <span
        style={{
          font: label && label.length > 2 ? '500 13px/1 var(--font-sans)' : '300 26px/1 var(--font-sans)',
        }}
      >
        {label}
      </span>
      {glyph ? <span style={{ alignSelf: 'center', fontSize: 15, opacity: 0.7 }}>{glyph}</span> : null}
    </button>
  );
}

function Duo({ top, bottom, tone = 'dark', shift, onClick }) {
  const t = TONE[tone];
  return (
    <button
      className="hw-key"
      aria-label={shift ? bottom : top}
      onClick={onClick}
      style={{ ...keyBase, display: 'grid', gridTemplateRows: '1fr 1fr', background: t.bg }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: t.fg,
          font: '500 13px/1 var(--font-sans)',
          opacity: shift ? 0.45 : 1,
        }}
      >
        {top}
      </span>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--platinum-100)',
          color: 'var(--text-1)',
          font: (shift ? '600' : '500') + ' 13px/1 var(--font-sans)',
          opacity: shift ? 1 : 0.7,
        }}
      >
        {bottom}
      </span>
    </button>
  );
}

function Cap({ led, on, children }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 6,
        alignItems: 'center',
        height: 16,
        marginTop: 10,
        font: '500 13px/1 var(--font-sans)',
        color: 'var(--text-1)',
        whiteSpace: 'nowrap',
      }}
    >
      {led ? <Led on={on} size={7} /> : null}
      {children}
    </div>
  );
}

function Side({ label, on, onClick }) {
  return (
    <button
      className="hw-key"
      onClick={onClick}
      style={{
        ...keyBase,
        aspectRatio: 'auto',
        height: 34,
        alignSelf: 'center',
        background: on ? 'var(--platinum-700)' : 'var(--platinum-900)',
        color: 'var(--text-on-ink)',
        font: '500 13px/1 var(--font-sans)',
      }}
    >
      {label}
    </button>
  );
}

function Marker({ n, show }) {
  return show ? (
    <span
      style={{
        position: 'absolute',
        top: -11,
        left: -11,
        width: 22,
        height: 22,
        borderRadius: 11,
        background: 'var(--signal-orange)',
        color: 'var(--text-on-signal)',
        font: '600 12px/22px var(--font-sans)',
        textAlign: 'center',
        zIndex: 3,
        boxShadow: '0 0 0 2px var(--platinum-50)',
      }}
    >
      {n}
    </span>
  ) : null;
}

const SPEC = [
  ['Port strip', 'Colour-coded tabs. Each colour has one job.', '--signal-orange'],
  ['Name plate', 'Bead-blasted aluminium, printed in Archivo Light.', '--font-sans'],
  ['Speaker grille', 'Perforated steel, 3 mm holes on a 5 mm pitch.', '--dots-grille'],
  ['Display', 'Black glass. Big light numerals, small sentence-case labels.', '--surface-screen'],
  ['Function keys', 'Two legends: top by default, bottom while Shift is held.', '--platinum-900'],
  ['Pads', 'Light keys pick a pattern. Dark keys type numbers.', '--platinum-50'],
  ['Fader', 'Volume. Steel slot, grey cap, no detents.', '--platinum-600'],
  ['Transport', 'Record is the only orange pad on the front.', '--accent'],
];
const PATS = ['A', 'B', 'C', 'D'];
const PORTS = [
  ['Output', 'var(--platinum-50)', 'var(--text-1)'],
  ['Input', 'var(--signal-orange)', 'var(--text-on-signal)'],
  ['Sync · MIDI', 'var(--platinum-900)', 'var(--text-on-ink)'],
  ['USB', 'var(--platinum-600)', 'var(--text-on-ink)'],
  ['Power', 'var(--platinum-100)', 'var(--text-1)'],
];
const CAPS = {
  7: 'Level',
  8: 'Pitch',
  9: 'Time',
  4: 'Attack',
  5: 'Release',
  6: 'Pan',
  1: 'Tune',
  2: 'Velocity',
  3: 'Mod',
};

function HardwareRoom() {
  const [view, setView] = React.useState('Parts');
  const [bpm, setBpm] = React.useState(120);
  const [buf, setBuf] = React.useState('');
  const [play, setPlay] = React.useState(false);
  const [rec, setRec] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [pat, setPat] = React.useState(0);
  const [shift, setShift] = React.useState(false);
  const [lit, setLit] = React.useState(null);
  const [vol, setVol] = React.useState(0.65);
  const [mode, setMode] = React.useState('Keys');
  const track = React.useRef(null);
  const show = view === 'Parts';

  React.useEffect(() => {
    if (!play) return;
    const id = setInterval(() => setStep((s) => (s + 1) % 16), 60000 / bpm / 4);
    return () => clearInterval(id);
  }, [play, bpm]);

  const commit = () => {
    if (buf) setBpm(Math.max(60, Math.min(200, parseInt(buf, 10))));
    setBuf('');
  };
  const digit = (d) => {
    setLit(d);
    setBuf((b) => (b.length >= 3 ? String(d) : b + d));
  };
  const drag = (e) => {
    const r = track.current.getBoundingClientRect();
    setVol(Math.max(0, Math.min(1, 1 - (e.clientY - r.top - 14) / (r.height - 28))));
  };
  const shown = buf || String(bpm);
  const meter = Math.round(vol * 10);

  const num = (d) => (
    <div key={d}>
      <Key label={String(d)} onClick={() => digit(d)} />
      {CAPS[d] ? (
        <Cap led on={lit === d}>
          {CAPS[d]}
        </Cap>
      ) : (
        <Cap></Cap>
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div style={{ font: '300 28px/1.1 var(--font-display)', letterSpacing: 'var(--tracking-display)' }}>
            Andeus T-1
          </div>
          <div style={{ fontSize: 15, color: 'var(--text-2)', marginTop: 4 }}>Pocket sequencer · concept</div>
        </div>
        <Segmented size="s" options={['Product', 'Parts']} value={view} onChange={setView} label="View" />
      </div>

      <div
        className="sc-hw"
        style={{
          display: 'grid',
          gridTemplateColumns: show ? 'minmax(0,540px) minmax(0,1fr)' : 'minmax(0,540px)',
          justifyContent: show ? 'stretch' : 'center',
          gap: 40,
          alignItems: 'start',
        }}
      >
        <Body
          style={{ position: 'relative', padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          <div
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1.4fr 1fr 1fr',
              gap: 6,
            }}
          >
            {PORTS.map(([name, bg, fg]) => (
              <span
                key={name}
                style={{
                  height: 30,
                  borderRadius: 8,
                  background: bg,
                  color: fg,
                  font: '500 13px/30px var(--font-sans)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  boxShadow: 'inset 0 -3px 0 rgba(27,26,24,.12), 0 0 0 1px rgba(27,26,24,.2)',
                }}
              >
                {name}
              </span>
            ))}
            <Marker n={1} show={show} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.9fr 1fr', gap: 14 }}>
            <Plate
              style={{
                position: 'relative',
                padding: '20px 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 24,
                minHeight: 132,
              }}
            >
              <div style={{ font: '400 20px/1.2 var(--font-sans)', color: 'var(--signal-orange)' }}>
                Pocket sequencer
              </div>
              <div style={{ font: '300 19px/1.2 var(--font-sans)', color: 'var(--text-1)' }}>
                16 steps · 4 patterns · 1 speaker
              </div>
              <Marker n={2} show={show} />
            </Plate>
            <div style={{ position: 'relative' }}>
              <Grille style={{ height: '100%' }} />
              <Marker n={3} show={show} />
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <Lcd
              style={{
                padding: '18px 22px',
                display: 'grid',
                gridTemplateColumns: 'auto minmax(0,1fr) auto',
                gap: 22,
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,26px)', gap: 5 }}>
                  {PATS.map((p, i) => (
                    <span
                      key={p}
                      style={{
                        width: 26,
                        height: 26,
                        display: 'grid',
                        placeItems: 'center',
                        font: '500 13px/1 var(--font-sans)',
                        background: i === pat ? 'var(--screen-ink)' : 'transparent',
                        color: i === pat ? 'var(--surface-screen)' : 'var(--screen-ink)',
                        borderRadius: 4,
                        border: '1px solid ' + (i === pat ? 'var(--screen-ink)' : 'var(--screen-grid)'),
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
                <span
                  style={{
                    font: '500 12px/1 var(--font-sans)',
                    color: 'var(--screen-ink)',
                    border: '1px solid var(--screen-ink)',
                    borderRadius: 4,
                    padding: '4px 6px',
                    textAlign: 'center',
                  }}
                >
                  {mode}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14 }}>
                  <div
                    style={{
                      position: 'relative',
                      font: '200 62px/0.85 var(--font-display)',
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    <span style={{ color: 'var(--screen-grid)' }}>888</span>
                    <span
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        color: buf ? 'var(--screen-orange)' : 'var(--screen-ink)',
                      }}
                    >
                      {shown}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 2 }}>
                    <span style={{ font: '500 13px/1 var(--font-sans)', color: 'var(--screen-ink)' }}>
                      {buf ? 'Enter to set' : 'Bpm'}
                    </span>
                    <span style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <i
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 8,
                          background: rec ? 'var(--screen-red)' : 'var(--screen-grid)',
                        }}
                      ></i>
                      <Icon name="play" size={18} color={play ? 'var(--screen-ink)' : 'var(--screen-grid)'} />
                    </span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16,minmax(0,1fr))', gap: 3 }}>
                  {Array.from({ length: 16 }, (_, i) => (
                    <i
                      key={i}
                      style={{
                        height: 8,
                        background:
                          i === step && play
                            ? 'var(--screen-orange)'
                            : i % 4 === 0
                              ? 'var(--screen-blue)'
                              : 'var(--screen-grid)',
                      }}
                    ></i>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 3 }}>
                  {Array.from({ length: 10 }, (_, i) => (
                    <i
                      key={i}
                      style={{
                        width: 16,
                        height: 5,
                        background:
                          i < meter
                            ? i > 7
                              ? 'var(--screen-red)'
                              : 'var(--screen-green)'
                            : 'var(--screen-grid)',
                      }}
                    ></i>
                  ))}
                </div>
                <span style={{ font: '500 12px/1 var(--font-sans)', color: 'var(--screen-ink)' }}>Vol</span>
              </div>
            </Lcd>
            <Marker n={4} show={show} />
          </div>

          <div
            style={{
              padding: '10px 4px 0',
              display: 'grid',
              gridTemplateColumns: 'repeat(7,minmax(0,1fr))',
              columnGap: 12,
              rowGap: 14,
            }}
          >
            <Side label="Keys" on={mode === 'Keys'} onClick={() => setMode('Keys')} />
            <div style={{ position: 'relative' }}>
              <Duo top="Sound" bottom="Edit" shift={shift} />
              <Marker n={5} show={show} />
              <Cap></Cap>
            </div>
            <div>
              <Duo top="Main" bottom="Commit" tone="orange" shift={shift} onClick={commit} />
              <Cap></Cap>
            </div>
            <div>
              <Duo top="Tempo" bottom="Loop" tone="grey" shift={shift} onClick={() => setBuf('')} />
              <Cap></Cap>
            </div>
            <div></div>
            <div>
              <Duo top="Sample" bottom="Chop" tone="orange" shift={shift} />
              <Cap></Cap>
            </div>
            <div>
              <Duo top="Timing" bottom="Correct" shift={shift} />
              <Cap></Cap>
            </div>

            <Side label="Fader" on={mode === 'Fader'} onClick={() => setMode('Fader')} />
            <div style={{ position: 'relative' }}>
              <Key tone="light" label="A" glyph="✳" onClick={() => setPat(0)} />
              <Marker n={6} show={show} />
              <Cap led on={pat === 0}></Cap>
            </div>
            {[7, 8, 9].map(num)}
            <div>
              <Duo top="FX" bottom="Output" shift={shift} />
              <Cap></Cap>
            </div>
            <div>
              <Duo
                top="Erase"
                bottom="System"
                tone="light"
                shift={shift}
                onClick={() => {
                  setBuf('');
                  setRec(false);
                }}
              />
              <Cap></Cap>
            </div>

            <div
              ref={track}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                drag(e);
              }}
              onPointerMove={(e) => {
                if (e.buttons) drag(e);
              }}
              style={{ position: 'relative', gridRow: 'span 2', cursor: 'ns-resize', touchAction: 'none' }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 6,
                  bottom: 6,
                  width: 8,
                  marginLeft: -4,
                  borderRadius: 4,
                  background: 'var(--platinum-900)',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,.6)',
                }}
              ></div>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  marginLeft: -20,
                  width: 40,
                  height: 28,
                  borderRadius: 14,
                  top: `calc(${(1 - vol) * 100}% - ${(1 - vol) * 28}px)`,
                  background: 'var(--platinum-600)',
                  border: '1px solid var(--platinum-800)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,.3), 0 2px 0 var(--platinum-800)',
                }}
              ></div>
              <Marker n={7} show={show} />
            </div>
            <div>
              <Key tone="light" label="B" glyph="↩" onClick={() => setPat(1)} />
              <Cap led on={pat === 1}></Cap>
            </div>
            {[4, 5, 6].map(num)}
            <div>
              <Key tone="light" label="−" aria="Slower" onClick={() => setBpm((b) => Math.max(60, b - 1))} />
              <Cap></Cap>
            </div>
            <div>
              <Key tone="light" label="+" aria="Faster" onClick={() => setBpm((b) => Math.min(200, b + 1))} />
              <Cap></Cap>
            </div>

            <div>
              <Key tone="light" label="C" glyph="↑" onClick={() => setPat(2)} />
              <Cap led on={pat === 2}></Cap>
            </div>
            {[1, 2, 3].map(num)}
            <div style={{ position: 'relative' }}>
              <Key tone="orange" label="Record" onClick={() => setRec((r) => !r)} />
              <Marker n={8} show={show} />
              <Cap led on={rec}></Cap>
            </div>
            <div>
              <Key tone="grey" label={play ? 'Stop' : 'Play'} onClick={() => setPlay((p) => !p)} />
              <Cap led on={play}></Cap>
            </div>

            <button
              className="hw-key"
              onClick={() => setShift((s) => !s)}
              style={{
                ...keyBase,
                aspectRatio: 'auto',
                height: 34,
                alignSelf: 'start',
                marginTop: 'calc(50% - 17px)',
                background: shift ? 'var(--platinum-300)' : 'var(--platinum-50)',
                color: 'var(--text-1)',
                font: '500 13px/1 var(--font-sans)',
              }}
            >
              Shift
            </button>
            <div>
              <Key tone="light" label="D" glyph="↓" onClick={() => setPat(3)} />
            </div>
            <div>
              <Key label="." onClick={() => setBuf('')} aria="Clear" />
            </div>
            <div>
              <Key label="0" onClick={() => digit(0)} />
            </div>
            <div>
              <Key label="Enter" onClick={commit} />
            </div>
            <div
              style={{
                gridColumn: 'span 2',
                display: 'flex',
                alignItems: 'center',
                font: '400 13px/1.35 var(--font-sans)',
                color: 'var(--text-2)',
                textWrap: 'pretty',
              }}
            >
              Type a tempo, press Enter, then Play.
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 4px' }}>
            <Mark>T-1</Mark>
          </div>
        </Body>

        {show ? (
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-ink)' }}>
            {SPEC.map(([name, cmf, tok], i) => (
              <div
                key={name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '28px minmax(0,1fr)',
                  gap: 12,
                  padding: '14px 0',
                  borderBottom: '1px solid var(--border-hair)',
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    background: 'var(--signal-orange)',
                    color: 'var(--text-on-signal)',
                    font: '600 12px/22px var(--font-sans)',
                    textAlign: 'center',
                  }}
                >
                  {i + 1}
                </span>
                <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ font: '500 16px/1.3 var(--font-sans)', color: 'var(--text-1)' }}>{name}</div>
                  <div
                    style={{
                      font: '400 15px/1.45 var(--font-sans)',
                      color: 'var(--text-2)',
                      textWrap: 'pretty',
                    }}
                  >
                    {cmf}
                  </div>
                  <code style={{ font: '500 13px/1.3 var(--font-sans)', color: 'var(--text-1)' }}>{tok}</code>
                </div>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '14px 0',
                font: '400 15px/1.3 var(--font-sans)',
                color: 'var(--text-2)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <span>Size</span>
              <span style={{ color: 'var(--text-1)' }}>156 × 220 × 18 mm</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { HardwareRoom };

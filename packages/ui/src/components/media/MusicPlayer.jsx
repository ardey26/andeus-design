import React from 'react';
import { Icon } from '../core/Icon';
import { Slider } from '../forms/Slider';
import { Labeled } from '../core/Labeled';
import { IconButton } from '../core/IconButton';

const { useEffect, useRef, useState } = React;
const SAMPLE = [
  {
    title: 'Platinum hours',
    artist: 'Halden Ensemble',
    duration: 214,
    color: 'var(--screen-orange)',
  },
  {
    title: 'Less, but better',
    artist: 'Ines Okafor',
    duration: 187,
    color: 'var(--screen-blue)',
  },
  {
    title: 'Default button',
    artist: 'The Stripes',
    duration: 242,
    color: 'var(--screen-yellow)',
  },
  {
    title: 'Field recording 44',
    artist: 'Marek Lind',
    duration: 163,
    color: 'var(--screen-green)',
  },
];
const mmss = (s) => {
  s = Math.max(0, Math.floor(s));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
};
const SEG = 48,
  BARS = 14;
const pad = (s) => {
  s = Math.max(0, Math.floor(s));
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
};
const SCR = {
  background: 'var(--surface-screen)',
  borderRadius: 4,
  boxShadow: 'inset 0 0 0 2px var(--platinum-900), var(--shadow-inset)',
  color: 'var(--screen-ink)',
  overflow: 'hidden',
  boxSizing: 'border-box',
};
const BANDS = ['60', '170', '310', '600', '1k', '3k', '6k', '12k', '14k', '16k'];
const PRESETS = {
  Flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  Rock: [5, 4, 2, -1, -2, -1, 2, 4, 5, 5],
  Voice: [-3, -2, 0, 3, 5, 5, 3, 1, -1, -2],
};
function useTick(on, ms) {
  const [k, setK] = useState(0);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setK((x) => x + 1), ms);
    return () => clearInterval(id);
  }, [on, ms]);
  return k;
}
function Marquee({ text, tick, color, size = 13 }) {
  const off = (tick * 0.35) % 50;
  return (
    <div
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        minWidth: 0,
        flex: 1,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          transform: 'translateX(-' + off + '%)',
          font: '500 ' + size + 'px/1.25 var(--font-sans)',
          color,
        }}
      >
        {text + '\u2003·\u2003'}
        {text + '\u2003·\u2003'}
      </span>
    </div>
  );
}
function DKey({ children, onClick, on, tone = 'light', w = 38, h = 28, aria, led }) {
  const bg =
    tone === 'orange'
      ? 'var(--signal-orange)'
      : tone === 'dark'
        ? 'var(--platinum-900)'
        : 'var(--platinum-50)';
  const fg =
    tone === 'orange' ? 'var(--text-on-signal)' : tone === 'dark' ? 'var(--text-on-ink)' : 'var(--text-1)';
  return (
    <button
      type="button"
      aria-label={aria}
      aria-pressed={on}
      onClick={onClick}
      style={{
        width: w,
        height: h,
        flex: 'none',
        padding: '0 8px',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        border: '1px solid var(--platinum-900)',
        borderRadius: 4,
        background: bg,
        color: fg,
        cursor: 'pointer',
        font: '500 12px/1 var(--font-sans)',
        whiteSpace: 'nowrap',
        boxShadow: on
          ? 'inset 0 2px 3px rgba(0,0,0,.25)'
          : 'inset 0 1px 0 rgba(255,255,255,.5), 0 2px 0 var(--platinum-900)',
        transform: on ? 'translateY(2px)' : 'none',
        transition: 'transform 60ms var(--ease-detent)',
      }}
    >
      {led !== undefined ? (
        <i
          style={{
            width: 6,
            height: 6,
            borderRadius: 3,
            flex: 'none',
            background: led ? 'var(--signal-orange)' : 'var(--platinum-400)',
          }}
        />
      ) : null}
      {children}
    </button>
  );
}
function Win({ title, right, children }) {
  return (
    <div
      style={{
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-ink)',
        borderRadius: 6,
        boxShadow: 'var(--shadow-window)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          height: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid var(--border-ink)',
          background: 'var(--stripes-titlebar)',
        }}
      >
        <span
          style={{
            padding: '0 8px',
            background: 'var(--surface-raised)',
            font: '600 11px/20px var(--font-sans)',
            color: 'var(--text-1)',
          }}
        >
          {title}
        </span>
        {right ? (
          <span
            style={{
              position: 'absolute',
              right: 4,
              top: 2,
            }}
          >
            {right}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}
function Seek({ p, seek, accent, dur, t, n = 48, h = 6 }) {
  const lit = Math.round(p * n);
  return (
    <div
      role="slider"
      aria-label="Position"
      aria-valuemin={0}
      aria-valuemax={Math.round(dur)}
      aria-valuenow={Math.round(t)}
      onPointerDown={seek}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(' + n + ',1fr)',
        gap: 2,
        cursor: 'pointer',
        padding: '3px 0',
      }}
    >
      {Array.from(
        {
          length: n,
        },
        (_, s) => (
          <i
            key={s}
            style={{
              height: h,
              background: s < lit ? accent : s === lit ? 'var(--screen-ink)' : 'var(--screen-grid)',
            }}
          />
        ),
      )}
    </div>
  );
}
function VFader({ value, onChange, min = -12, max = 12, h = 84, label, dim }) {
  const ref = useRef(null);
  const set = (y) => {
    const r = ref.current.getBoundingClientRect();
    const q = 1 - Math.min(1, Math.max(0, (y - r.top - 6) / (r.height - 12)));
    onChange(Math.round(min + q * (max - min)));
  };
  const q = (value - min) / (max - min);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        opacity: dim ? 0.45 : 1,
      }}
    >
      <div
        ref={ref}
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          set(e.clientY);
        }}
        onPointerMove={(e) => {
          if (e.buttons) set(e.clientY);
        }}
        style={{
          position: 'relative',
          width: 20,
          height: h,
          cursor: 'ns-resize',
          touchAction: 'none',
        }}
      >
        <i
          style={{
            position: 'absolute',
            left: 7,
            width: 6,
            top: 0,
            bottom: 0,
            background: 'var(--platinum-900)',
            borderRadius: 3,
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,.5)',
          }}
        />
        <i
          style={{
            position: 'absolute',
            left: 1,
            right: 1,
            top: '50%',
            height: 1,
            background: 'var(--platinum-400)',
          }}
        />
        <i
          style={{
            position: 'absolute',
            left: 0,
            width: 20,
            height: 12,
            boxSizing: 'border-box',
            top: 'calc(' + (1 - q) * 100 + '% - ' + (1 - q) * 12 + 'px)',
            background: 'linear-gradient(var(--platinum-50),var(--platinum-200))',
            border: '1px solid var(--platinum-700)',
            borderRadius: 2,
            boxShadow: '0 1px 0 rgba(0,0,0,.3)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <i
            style={{
              width: 10,
              height: 2,
              background: 'var(--signal-orange)',
            }}
          />
        </i>
      </div>
      <span
        style={{
          font: '500 10px/1 var(--font-sans)',
          color: 'var(--text-label)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {label}
      </span>
    </div>
  );
}
function Mini(c) {
  const tick = useTick(c.playing, 120);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: 6,
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-ink)',
        borderRadius: 6,
        boxShadow: 'var(--shadow-window)',
      }}
    >
      <div
        style={{
          ...SCR,
          position: 'relative',
          flex: 1,
          minWidth: 0,
          height: 30,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 10px',
        }}
      >
        {c.playing ? (
          <Icon name="play" size={12} color={c.accent} />
        ) : (
          <i
            style={{
              width: 8,
              height: 8,
              flex: 'none',
              background: 'var(--screen-dim)',
            }}
          />
        )}
        <Marquee
          text={c.i + 1 + '. ' + c.track.title + ' — ' + c.track.artist}
          tick={tick}
          color="var(--screen-ink)"
        />
        <span
          style={{
            font: '300 18px/1 var(--font-display)',
            color: c.accent,
            fontVariantNumeric: 'tabular-nums',
            flex: 'none',
          }}
        >
          {pad(c.t)}
        </span>
        <i
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: 2,
            width: c.p * 100 + '%',
            background: c.accent,
          }}
        />
      </div>
      <DKey w={28} h={26} aria="Previous" onClick={c.back}>
        <Icon name="arrow-left" size={14} />
      </DKey>
      <DKey
        w={32}
        h={26}
        tone="orange"
        aria={c.playing ? 'Pause' : 'Play'}
        on={c.playing}
        onClick={() => c.setPlaying((v) => !v)}
      >
        <Icon name={c.playing ? 'pause' : 'play'} size={14} color="var(--text-on-signal)" />
      </DKey>
      <DKey w={28} h={26} aria="Stop" onClick={c.stop}>
        <i
          style={{
            width: 9,
            height: 9,
            background: 'var(--text-1)',
          }}
        />
      </DKey>
      <DKey w={28} h={26} aria="Next" onClick={c.next}>
        <Icon name="arrow-right" size={14} />
      </DKey>
      {c.onExpand ? (
        <DKey w={28} h={26} aria="Expand" onClick={c.onExpand}>
          <Icon name="chevron-down" size={14} />
        </DKey>
      ) : null}
    </div>
  );
}
function Deck(c) {
  const [shade, setShade] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [remain, setRemain] = useState(false);
  const [bal, setBal] = useState(0);
  const [eq, setEq] = useState(PRESETS.Rock);
  const [pre, setPre] = useState(0);
  const [eqOn, setEqOn] = useState(true);
  const [preset, setPreset] = useState('Rock');
  const [sel, setSel] = useState(null);
  const tick = useTick(c.playing, 90);
  const peaks = useRef(Array(24).fill(0));
  const next = () =>
    shuffle && c.tracks.length > 1
      ? c.go((c.i + 1 + Math.floor(Math.random() * (c.tracks.length - 1))) % c.tracks.length)
      : c.go(c.i + 1);
  const cc = {
    ...c,
    next,
  };
  if (shade) return <Mini {...cc} onExpand={() => setShade(false)} />;
  const levels = Array.from(
    {
      length: 24,
    },
    (_, b) => {
      if (!c.playing) return 0;
      const g = eqOn ? 1 + (eq[Math.floor((b * 10) / 24)] + pre) / 24 : 1;
      const v =
        (0.55 + 0.45 * Math.sin(tick * 0.9 + b * 1.7)) *
        (0.4 + 0.6 * Math.abs(Math.sin(b * 0.37 + tick * 0.21))) *
        c.vol *
        g;
      return Math.max(0, Math.min(10, Math.round(v * 11)));
    },
  );
  levels.forEach((l, b) => {
    peaks.current[b] = Math.max(l, peaks.current[b] - 0.34);
  });
  const total = c.tracks.reduce((a, x) => a + (x.duration || 0), 0);
  const before = c.tracks.slice(0, c.i).reduce((a, x) => a + (x.duration || 0), 0);
  const curve =
    eq
      .map(
        (v, k) => (k ? 'H' + (k * 10).toFixed(1) + 'V' : 'M0 ') + (15 - ((v + pre / 2) / 12) * 13).toFixed(1),
      )
      .join('') + 'H100';
  const small = {
    font: '500 11px/1 var(--font-sans)',
    fontVariantNumeric: 'tabular-nums',
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <Win
        title={c.title}
        right={
          <button
            type="button"
            aria-label="Shade"
            onClick={() => setShade(true)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              width: 14,
              height: 14,
              background: 'var(--surface-raised)',
              border: '1px solid var(--border-ink)',
            }}
          >
            <i
              style={{
                width: 8,
                height: 2,
                background: 'var(--text-1)',
              }}
            />
          </button>
        }
      >
        <div
          style={{
            padding: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.15fr)',
              gap: 8,
            }}
          >
            <div
              style={{
                ...SCR,
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <div
                style={{
                  ...small,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                {c.playing ? (
                  <Icon name="play" size={12} color={c.accent} />
                ) : c.t > 0 ? (
                  <Icon name="pause" size={12} color="var(--screen-dim)" />
                ) : (
                  <i
                    style={{
                      width: 8,
                      height: 8,
                      background: 'var(--screen-dim)',
                    }}
                  />
                )}
                <span
                  style={{
                    marginLeft: 'auto',
                    color: 'var(--screen-ink)',
                  }}
                >
                  Stereo
                </span>
                <span
                  style={{
                    color: 'var(--screen-grid)',
                  }}
                >
                  Mono
                </span>
              </div>
              <button
                type="button"
                onClick={() => setRemain((r) => !r)}
                aria-label="Elapsed or remaining"
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  font: '200 40px/0.9 var(--font-display)',
                  letterSpacing: '-0.03em',
                  color: c.accent,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {remain ? '−' + pad(c.dur - c.t) : pad(c.t)}
              </button>
              <div
                aria-hidden="true"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(24,1fr)',
                  gap: 2,
                  height: 42,
                }}
              >
                {levels.map((l, b) => (
                  <div
                    key={b}
                    style={{
                      display: 'flex',
                      flexDirection: 'column-reverse',
                      gap: 1,
                    }}
                  >
                    {Array.from(
                      {
                        length: 10,
                      },
                      (_, k) => {
                        const pk = Math.round(peaks.current[b]);
                        const on = k < l;
                        const peak = c.playing && k === pk && pk >= l && pk > 0;
                        return (
                          <i
                            key={k}
                            style={{
                              flex: 1,
                              background: on
                                ? k < 6
                                  ? c.accent
                                  : k < 8
                                    ? 'var(--screen-yellow)'
                                    : 'var(--screen-red)'
                                : peak
                                  ? 'var(--screen-ink)'
                                  : 'transparent',
                            }}
                          />
                        );
                      },
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                ...SCR,
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                justifyContent: 'space-between',
                minWidth: 0,
              }}
            >
              <Marquee
                text={
                  c.i +
                  1 +
                  '. ' +
                  c.track.artist +
                  ' — ' +
                  c.track.title +
                  ' (' +
                  mmss(c.track.duration || c.dur) +
                  ')'
                }
                tick={tick}
                color="var(--screen-ink)"
                size={14}
              />
              <div
                style={{
                  ...small,
                  display: 'flex',
                  gap: 12,
                  color: 'var(--screen-dim)',
                }}
              >
                <span>
                  <b
                    style={{
                      color: 'var(--screen-ink)',
                      fontWeight: 500,
                    }}
                  >
                    {c.track.kbps || 320}
                  </b>
                  {' kbps'}
                </span>
                <span>
                  <b
                    style={{
                      color: 'var(--screen-ink)',
                      fontWeight: 500,
                    }}
                  >
                    {c.track.khz || 44}
                  </b>
                  {' kHz'}
                </span>
                <span
                  style={{
                    marginLeft: 'auto',
                    color: eqOn ? 'var(--screen-green)' : 'var(--screen-grid)',
                  }}
                >
                  EQ
                </span>
                <span
                  style={{
                    color: shuffle ? 'var(--screen-orange)' : 'var(--screen-grid)',
                  }}
                >
                  Shuffle
                </span>
                <span
                  style={{
                    color: c.loop ? 'var(--screen-orange)' : 'var(--screen-grid)',
                  }}
                >
                  Repeat
                </span>
              </div>
              <Seek p={c.p} seek={c.seek} accent={c.accent} dur={c.dur} t={c.t} n={40} h={6} />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 4,
                paddingBottom: 2,
              }}
            >
              <DKey aria="Previous" onClick={c.back}>
                <Icon name="arrow-left" size={14} />
              </DKey>
              <DKey aria="Play" tone="orange" on={c.playing} onClick={() => c.setPlaying(true)}>
                <Icon name="play" size={14} color="var(--text-on-signal)" />
              </DKey>
              <DKey aria="Pause" on={!c.playing && c.t > 0} onClick={() => c.setPlaying(false)}>
                <Icon name="pause" size={14} />
              </DKey>
              <DKey aria="Stop" onClick={c.stop}>
                <i
                  style={{
                    width: 9,
                    height: 9,
                    background: 'var(--text-1)',
                  }}
                />
              </DKey>
              <DKey aria="Next" onClick={next}>
                <Icon name="arrow-right" size={14} />
              </DKey>
              <DKey
                aria="Eject"
                tone="dark"
                onClick={() => {
                  c.stop();
                  c.go(0);
                }}
              >
                <Icon name="upload" size={14} color="var(--text-on-ink)" />
              </DKey>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 4,
                paddingBottom: 2,
              }}
            >
              <DKey w="auto" led={shuffle} on={shuffle} onClick={() => setShuffle((v) => !v)} aria="Shuffle">
                Shuffle
              </DKey>
              <DKey w="auto" led={c.loop} on={c.loop} onClick={() => c.setLoop((v) => !v)} aria="Repeat">
                Repeat
              </DKey>
            </div>
            <div
              style={{
                flex: 1,
              }}
            />
            <Slider
              label="Volume"
              value={c.vol}
              onChange={c.setVol}
              format={(v) => Math.round(v * 100) + '%'}
              width={96}
            />
            <Slider
              label="Balance"
              min={-1}
              max={1}
              value={bal}
              onChange={setBal}
              format={(v) =>
                Math.abs(v) < 0.08 ? 'Centre' : (v < 0 ? 'L ' : 'R ') + Math.round(Math.abs(v) * 100)
              }
              width={84}
            />
          </div>
        </div>
      </Win>
      {c.showEqualizer ? (
        <Win title="Equalizer">
          <div
            style={{
              padding: 10,
              display: 'flex',
              gap: 14,
              alignItems: 'stretch',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <DKey w={68} led={eqOn} on={eqOn} onClick={() => setEqOn((v) => !v)} aria="Equalizer on">
                On
              </DKey>
              {Object.keys(PRESETS).map((k) => (
                <DKey
                  key={k}
                  w={68}
                  led={preset === k}
                  onClick={() => {
                    setPreset(k);
                    setEq(PRESETS[k]);
                  }}
                  aria={'Preset ' + k}
                >
                  {k}
                </DKey>
              ))}
            </div>
            <VFader
              label="Pre"
              value={pre}
              onChange={(v) => {
                setPre(v);
                setPreset(null);
              }}
              dim={!eqOn}
            />
            <i
              style={{
                width: 1,
                background: 'var(--border-hair)',
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                flex: 1,
                minWidth: 260,
              }}
            >
              <div
                style={{
                  ...SCR,
                  height: 34,
                  padding: '4px 6px',
                }}
              >
                <svg
                  viewBox="0 0 100 30"
                  preserveAspectRatio="none"
                  width="100%"
                  height="100%"
                  style={{
                    display: 'block',
                  }}
                >
                  <line
                    x1="0"
                    x2="100"
                    y1="15"
                    y2="15"
                    stroke="var(--screen-grid)"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                    strokeDasharray="1 4"
                  />
                  <path
                    d={curve}
                    fill="none"
                    stroke={eqOn ? c.accent : 'var(--screen-dim)'}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    shapeRendering="crispEdges"
                  />
                </svg>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                {BANDS.map((b, k) => (
                  <VFader
                    key={b}
                    label={b}
                    value={eq[k]}
                    dim={!eqOn}
                    onChange={(v) => {
                      setPreset(null);
                      setEq((e) => e.map((x, j) => (j === k ? v : x)));
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Win>
      ) : null}
      {c.showPlaylist ? (
        <Win title="Playlist">
          <div
            style={{
              padding: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div
              style={{
                ...SCR,
                padding: 4,
                maxHeight: 180,
                overflowY: 'auto',
              }}
            >
              {c.tracks.map((x, k) => (
                <div
                  key={k}
                  onClick={() => setSel(k)}
                  onDoubleClick={() => {
                    c.go(k);
                    c.setPlaying(true);
                  }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '24px minmax(0,1fr) auto',
                    gap: 8,
                    padding: '5px 8px',
                    cursor: 'pointer',
                    borderRadius: 2,
                    font: '400 13px/1.2 var(--font-sans)',
                    fontVariantNumeric: 'tabular-nums',
                    color: k === c.i ? x.color || c.accent : 'var(--screen-ink)',
                    background: sel === k ? 'var(--screen-grid)' : 'transparent',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--screen-dim)',
                    }}
                  >
                    {k + 1}.
                  </span>
                  <span
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {x.artist}
                    {' \u2014 '}
                    {x.title}
                  </span>
                  <span>{mmss(x.duration || 0)}</span>
                </div>
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                gap: 6,
                alignItems: 'center',
              }}
            >
              <DKey
                w="auto"
                aria="Play selected"
                onClick={() => {
                  if (sel != null) {
                    c.go(sel);
                    c.setPlaying(true);
                  }
                }}
              >
                Play selected
              </DKey>
              <span
                style={{
                  flex: 1,
                }}
              />
              <span
                style={{
                  ...small,
                  color: 'var(--text-2)',
                }}
              >
                {mmss(before + c.t)}
                {' / '}
                {mmss(total)}
              </span>
            </div>
          </div>
        </Win>
      ) : null}
    </div>
  );
}

/** A music player built like a small instrument: one screen, three keys, a fader. */
function MusicPlayer({
  tracks = SAMPLE,
  defaultIndex = 0,
  autoPlay = false,
  showPlaylist = true,
  showEqualizer = true,
  title = 'Andeus player',
  variant = 'full',
  onTrackChange,
  width,
  style,
}) {
  const [i, setI] = useState(defaultIndex);
  const [playing, setPlaying] = useState(autoPlay);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(tracks[defaultIndex] ? tracks[defaultIndex].duration || 0 : 0);
  const [vol, setVol] = useState(0.7);
  const [loop, setLoop] = useState(false);
  const audio = useRef(null);
  const track = tracks[i] || {};
  const accent = track.color || 'var(--screen-orange)';
  const compact = variant === 'compact';
  const go = (n) => {
    const k = (n + tracks.length) % tracks.length;
    setI(k);
    setT(0);
    setDur(tracks[k].duration || 0);
    onTrackChange && onTrackChange(k, tracks[k]);
  };
  const end = () => {
    if (loop) {
      setT(0);
      if (audio.current) audio.current.currentTime = 0;
    } else if (i < tracks.length - 1) go(i + 1);
    else {
      setPlaying(false);
      setT(0);
    }
  };
  useEffect(() => {
    if (audio.current) audio.current.volume = vol;
  }, [vol]);
  useEffect(() => {
    const a = audio.current;
    if (a && track.src) {
      if (playing) a.play().catch(() => setPlaying(false));
      else a.pause();
      return;
    }
    if (!playing) return;
    const id = setInterval(
      () =>
        setT((x) => {
          if (x + 0.25 >= dur) {
            end();
            return x;
          }
          return x + 0.25;
        }),
      250,
    );
    return () => clearInterval(id);
  }, [playing, i, dur, loop]);
  const seek = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const n = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * dur;
    setT(n);
    if (audio.current && track.src) audio.current.currentTime = n;
  };
  const p = dur ? t / dur : 0;
  const lit = Math.round(p * SEG);
  const back = () => (t > 3 ? (setT(0), audio.current && (audio.current.currentTime = 0)) : go(i - 1));
  const stop = () => {
    setPlaying(false);
    setT(0);
    if (audio.current) audio.current.currentTime = 0;
  };
  if (variant === 'deck' || variant === 'mini') {
    const ctx = {
      tracks,
      i,
      track,
      accent,
      playing,
      setPlaying,
      t,
      dur,
      p,
      seek,
      vol,
      setVol,
      loop,
      setLoop,
      go,
      back,
      stop,
      next: () => go(i + 1),
      title,
      showEqualizer,
      showPlaylist,
    };
    return (
      <div
        style={{
          width,
          ...style,
        }}
      >
        {track.src ? (
          <audio
            ref={audio}
            src={track.src}
            loop={loop}
            onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
            onEnded={end}
          />
        ) : null}
        {variant === 'deck' ? <Deck {...ctx} /> : <Mini {...ctx} />}
      </div>
    );
  }
  const label = {
    font: 'var(--type-label)',
    letterSpacing: 'var(--tracking-label)',
    color: 'var(--text-label)',
  };
  const transport = (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: compact ? 10 : 16,
      }}
    >
      <Labeled label="Back">
        <IconButton
          round
          icon="arrow-left"
          label="Previous track"
          onClick={() => (t > 3 ? (setT(0), audio.current && (audio.current.currentTime = 0)) : go(i - 1))}
        />
      </Labeled>
      <Labeled label={playing ? 'Pause' : 'Play'}>
        <button
          type="button"
          aria-label={playing ? 'Pause' : 'Play'}
          onClick={() => setPlaying((v) => !v)}
          style={{
            width: compact ? 44 : 56,
            height: compact ? 44 : 56,
            borderRadius: 999,
            border: '1px solid var(--border-ink)',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
            padding: 0,
            background: 'var(--signal-orange)',
            boxShadow: playing ? 'var(--shadow-control-press)' : 'var(--shadow-control)',
            transform: playing ? 'translateY(1px)' : 'none',
            transition: 'transform var(--dur-quick) var(--ease-detent)',
          }}
        >
          <Icon name={playing ? 'pause' : 'play'} size={compact ? 20 : 24} color="var(--text-on-signal)" />
        </button>
      </Labeled>
      <Labeled label="Next">
        <IconButton round icon="arrow-right" label="Next track" onClick={() => go(i + 1)} />
      </Labeled>
    </div>
  );
  return (
    <div
      style={{
        width,
        boxSizing: 'border-box',
        background: 'var(--surface-raised)',
        border: '1px solid var(--border-ink)',
        borderRadius: 'var(--radius-4)',
        boxShadow: 'var(--shadow-window)',
        padding: compact ? 12 : 18,
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 12 : 18,
        ...style,
      }}
    >
      {track.src ? (
        <audio
          ref={audio}
          src={track.src}
          loop={loop}
          onTimeUpdate={(e) => setT(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
          onEnded={end}
        />
      ) : null}
      <div
        style={{
          display: 'flex',
          gap: compact ? 12 : 16,
          alignItems: 'stretch',
          flexWrap: compact ? 'nowrap' : 'wrap',
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: compact ? 0 : 260,
            background: 'var(--surface-screen)',
            borderRadius: 'var(--radius-2)',
            boxShadow: 'inset 0 0 0 2px var(--platinum-900), var(--shadow-inset)',
            padding: compact ? '10px 12px' : '14px 16px',
            color: 'var(--screen-ink)',
            display: 'flex',
            flexDirection: 'column',
            gap: compact ? 8 : 12,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              font: '500 12px/1 var(--font-sans)',
              color: 'var(--screen-dim)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <span>
              {String(i + 1).padStart(2, '0')}
              {' / '}
              {String(tracks.length).padStart(2, '0')}
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 2,
                height: 12,
              }}
              aria-hidden="true"
            >
              {Array.from(
                {
                  length: BARS,
                },
                (_, b) => (
                  <i
                    key={b}
                    style={{
                      width: 3,
                      height: playing ? 2 + Math.abs(Math.sin(t * 3.1 + b * 0.9)) * 10 * vol : 2,
                      background: accent,
                      transition: 'height 240ms linear',
                    }}
                  />
                ),
              )}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: 12,
              minWidth: 0,
            }}
          >
            <div
              style={{
                minWidth: 0,
              }}
            >
              <div
                style={{
                  font: `300 ${compact ? 18 : 26}px/1.1 var(--font-display)`,
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {track.title}
              </div>
              <div
                style={{
                  font: '400 13px/1.3 var(--font-sans)',
                  color: 'var(--screen-dim)',
                  marginTop: 4,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {track.artist}
              </div>
            </div>
            <div
              style={{
                textAlign: 'right',
                flex: 'none',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <div
                style={{
                  font: `200 ${compact ? 28 : 40}px/0.9 var(--font-display)`,
                  letterSpacing: '-0.03em',
                  color: accent,
                }}
              >
                {mmss(t)}
              </div>
              <div
                style={{
                  font: '400 12px/1 var(--font-sans)',
                  color: 'var(--screen-dim)',
                  marginTop: 6,
                }}
              >
                −{mmss(dur - t)}
              </div>
            </div>
          </div>
          <div
            role="slider"
            aria-label="Position"
            aria-valuemin={0}
            aria-valuemax={Math.round(dur)}
            aria-valuenow={Math.round(t)}
            onPointerDown={seek}
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${SEG},1fr)`,
              gap: 2,
              cursor: 'pointer',
              padding: '3px 0',
            }}
          >
            {Array.from(
              {
                length: SEG,
              },
              (_, s) => (
                <i
                  key={s}
                  style={{
                    height: compact ? 5 : 7,
                    background: s < lit ? accent : s === lit ? 'var(--screen-ink)' : 'var(--screen-grid)',
                  }}
                />
              ),
            )}
          </div>
        </div>
        {compact ? transport : null}
      </div>
      {!compact ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          {transport}
          <Labeled label="Repeat">
            <IconButton round icon="repeat" label="Repeat" active={loop} onClick={() => setLoop((v) => !v)} />
          </Labeled>
          <div
            style={{
              flex: 1,
              minWidth: 140,
            }}
          >
            <Slider
              label="Volume"
              value={vol}
              onChange={setVol}
              format={(v) => Math.round(v * 10)}
              width="100%"
            />
          </div>
        </div>
      ) : null}
      {showPlaylist && !compact ? (
        <div
          role="list"
          style={{
            borderTop: '1px solid var(--border-ink)',
          }}
        >
          {tracks.map((x, k) => (
            <div
              key={k}
              role="listitem"
              onClick={() => {
                go(k);
                setPlaying(true);
              }}
              style={{
                display: 'grid',
                gridTemplateColumns: '28px 10px minmax(0,1fr) auto',
                gap: 10,
                alignItems: 'center',
                padding: '9px 8px',
                cursor: 'pointer',
                borderBottom: '1px solid var(--border-hair)',
                background: k === i ? 'var(--surface-paper)' : 'transparent',
                boxShadow: k === i ? 'inset 3px 0 0 var(--signal-orange)' : 'none',
              }}
            >
              <span
                style={{
                  ...label,
                  fontVariantNumeric: 'tabular-nums',
                  paddingLeft: 4,
                }}
              >
                {String(k + 1).padStart(2, '0')}
              </span>
              <i
                style={{
                  width: 8,
                  height: 8,
                  background: x.color || 'var(--platinum-400)',
                }}
              />
              <span
                style={{
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  font: `${k === i ? 500 : 400} 14px/1.3 var(--font-sans)`,
                  color: 'var(--text-1)',
                }}
              >
                {x.title}{' '}
                <span
                  style={{
                    color: 'var(--text-2)',
                    fontWeight: 400,
                  }}
                >
                  {'\xB7 '}
                  {x.artist}
                </span>
              </span>
              <span
                style={{
                  font: '400 13px/1 var(--font-sans)',
                  color: 'var(--text-2)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {k === i && playing ? (
                  <Icon name="play" size={12} color="var(--signal-orange)" />
                ) : (
                  mmss(x.duration || 0)
                )}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export { MusicPlayer };

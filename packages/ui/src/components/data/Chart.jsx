import React from 'react';

const { useMemo, useRef, useState } = React;
const PALETTE = [
  'var(--screen-blue)',
  'var(--screen-yellow)',
  'var(--screen-green)',
  'var(--screen-orange)',
  'var(--screen-red)',
];
function gen(seed, n, drift, vol) {
  let s = seed,
    v = 100;
  const out = [v];
  for (let i = 1; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    v *= 1 + drift + (s / 233280 - 0.5) * vol;
    out.push(v);
  }
  return out;
}
const SAMPLE_SERIES = [
  {
    label: 'This year',
    values: gen(7, 120, 0.011, 0.07),
  },
  {
    label: 'Last year',
    values: gen(3, 120, 0.007, 0.055),
  },
];
const pctFmt = (a, b) => {
  const x = (b / a - 1) * 100;
  return (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(1) + '%';
};
const numFmt = (v) =>
  Math.abs(v) >= 1000 ? Math.round(v).toLocaleString('en-US') : (+v.toFixed(2)).toString();

/** Any series on a screen: step, line or bar. Up to five series, optional band strip, hover cursor, printed scale. */
function Chart({
  series = SAMPLE_SERIES,
  type = 'step',
  band,
  height = 240,
  startLabel,
  endLabel,
  summary = 'change',
  format = numFmt,
  cursorLabel,
  scale = true,
  grid = true,
  label,
  style,
}) {
  const ref = useRef(null);
  const [hi, setHi] = useState(null);
  const S = series.map((s, k) => ({
    ...s,
    color: s.color || PALETTE[k % PALETTE.length],
  }));
  const n = Math.max(2, ...S.map((s) => s.values.length));
  const W = 600,
    H = height,
    P = 10,
    TOP = 34,
    DD = band ? 22 : 0,
    BOT = DD + 8;
  const geo = useMemo(() => {
    const all = S.flatMap((s) => s.values);
    let mn = Math.min(...all),
      mx = Math.max(...all);
    if (type === 'bar' && mn > 0) mn = 0;
    const x = (i) => P + (i / (n - 1)) * (W - 2 * P);
    const y = (v) => H - BOT - ((v - mn) / (mx - mn || 1)) * (H - TOP - BOT);
    const k = Math.max(1, Math.round(n / (type === 'bar' ? 40 : 90)));
    const paths = S.map((s) => {
      if (type === 'bar') return null;
      let d = '';
      for (let i = 0; i < s.values.length; i += k) {
        const X = Math.round(x(i)),
          Y = Math.round(y(s.values[i]));
        d += i === 0 ? 'M' + X + ' ' + Y : type === 'step' ? ' H' + X + ' V' + Y : ' L' + X + ' ' + Y;
      }
      return d;
    });
    const bars = [];
    if (type === 'bar') {
      const groups = Math.ceil(n / k),
        gw = (W - 2 * P) / groups,
        bw = Math.max(1, (gw * 0.78) / S.length);
      for (let g = 0; g < groups; g++)
        S.forEach((s, j) => {
          const v = s.values[g * k];
          if (v == null) return;
          const top = y(v),
            base = y(mn);
          bars.push({
            x: P + g * gw + (gw - bw * S.length) / 2 + j * bw,
            y: Math.min(top, base),
            w: bw,
            h: Math.max(1, Math.abs(base - top)),
            c: s.color,
          });
        });
    }
    let bandBars = [];
    if (band) {
      const bm = Math.max(...band.values.map(Math.abs), 1e-9);
      for (let i = 0; i < band.values.length; i += k) {
        const h = Math.round((Math.abs(band.values[i]) / bm) * DD);
        if (h > 0) bandBars.push([Math.round(x(i)) - 1, h]);
      }
    }
    return {
      paths,
      bars,
      bandBars,
    };
  }, [series, band, type, H]);
  const i = hi ?? n - 1;
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    setHi(Math.round(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * (n - 1)));
  };
  const readout = (s) => {
    const v = s.values[Math.min(i, s.values.length - 1)];
    return summary === 'change' ? pctFmt(s.values[0], v) : summary === 'last' ? format(v) : null;
  };
  const ticks = Array.from(
    {
      length: 41,
    },
    (_, t) => t,
  );
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--label-gap)',
        ...style,
      }}
    >
      <div
        style={{
          padding: 5,
          borderRadius: 8,
          background: 'var(--surface-inset)',
          boxShadow: 'var(--shadow-bezel)',
        }}
      >
        <div
          ref={ref}
          onMouseMove={move}
          onMouseLeave={() => setHi(null)}
          style={{
            position: 'relative',
            height: H,
            background: 'var(--screen-glass), var(--screen-pixels), var(--surface-screen)',
            borderRadius: 3,
            boxShadow: 'var(--shadow-screen)',
            overflow: 'hidden',
            cursor: 'crosshair',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            width="100%"
            height="100%"
            shapeRendering="crispEdges"
            style={{
              position: 'absolute',
              inset: 0,
            }}
          >
            {grid
              ? [0.25, 0.5, 0.75].map((g) => {
                  const Y = Math.round(TOP + (H - TOP - BOT) * g);
                  return (
                    <line
                      key={g}
                      x1="0"
                      x2={W}
                      y1={Y}
                      y2={Y}
                      stroke="var(--screen-grid)"
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                      strokeDasharray="1 5"
                    />
                  );
                })
              : null}
            {geo.bandBars.map(([bx, h], j) => (
              <rect
                key={'b' + j}
                x={bx}
                y={H - h}
                width="3"
                height={h}
                fill={band.color || 'var(--screen-red)'}
                opacity="0.75"
              />
            ))}
            {geo.bars.map((b, j) => (
              <rect key={'r' + j} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.c} />
            ))}
            {geo.paths
              .map((d, j) =>
                d ? (
                  <path
                    key={'p' + j}
                    d={d}
                    fill="none"
                    stroke={S[j].color}
                    strokeWidth={j === 0 ? 2 : 1.5}
                    vectorEffect="non-scaling-stroke"
                    shapeRendering={type === 'line' ? 'geometricPrecision' : 'crispEdges'}
                  />
                ) : null,
              )
              .reverse()}
          </svg>
          {hi != null ? (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: 1,
                background: 'var(--screen-orange)',
                left: `calc(${(P / W) * 100}% + ${hi / (n - 1)} * (100% - ${((2 * P) / W) * 100}%))`,
              }}
            />
          ) : null}
          <div
            style={{
              position: 'absolute',
              left: 12,
              top: 10,
              right: 12,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              font: '500 12px/1 var(--font-sans)',
              color: 'var(--screen-ink)',
            }}
          >
            {S.map((s) => (
              <span
                key={s.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <i
                  style={{
                    width: 8,
                    height: 8,
                    background: s.color,
                  }}
                />
                {s.label}
                {summary !== 'none' ? (
                  <b
                    style={{
                      color: s.color,
                      fontWeight: 600,
                    }}
                  >
                    {readout(s)}
                  </b>
                ) : null}
              </span>
            ))}
            {band && band.label ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <i
                  style={{
                    width: 8,
                    height: 8,
                    background: band.color || 'var(--screen-red)',
                  }}
                />
                {band.label}
              </span>
            ) : null}
            <span
              style={{
                marginLeft: 'auto',
                color: hi != null ? 'var(--screen-orange)' : 'var(--screen-dim)',
              }}
            >
              {hi != null ? (cursorLabel ? cursorLabel(hi) : hi + 1 + ' / ' + n) : endLabel}
            </span>
          </div>
        </div>
      </div>
      {scale ? (
        <div
          aria-hidden="true"
          style={{
            position: 'relative',
            height: 22,
            margin: '0 15px',
          }}
        >
          {ticks.map((t) => {
            const major = t % 10 === 0,
              mid = t % 5 === 0;
            return (
              <i
                key={t}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: (t / 40) * 100 + '%',
                  width: 1,
                  height: major ? 8 : mid ? 6 : 3,
                  background: major ? 'var(--text-1)' : 'var(--text-3)',
                }}
              />
            );
          })}
          {startLabel ? (
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: 10,
                font: '500 10px/1 var(--font-sans)',
                color: 'var(--text-label)',
                transform: 'translateX(-50%)',
              }}
            >
              {startLabel}
            </span>
          ) : null}
          {endLabel ? (
            <span
              style={{
                position: 'absolute',
                right: 0,
                top: 10,
                font: '500 10px/1 var(--font-sans)',
                color: 'var(--text-label)',
                transform: 'translateX(50%)',
              }}
            >
              {endLabel}
            </span>
          ) : null}
        </div>
      ) : null}
      {label ? (
        <span
          style={{
            font: 'var(--type-label)',
            color: 'var(--text-label)',
            textAlign: 'center',
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

export { SAMPLE_SERIES, Chart };

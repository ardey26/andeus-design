import React from 'react';

const TONE = {
  light: ['var(--platinum-50)', 'var(--text-1)'],
  dark: ['var(--platinum-900)', 'var(--text-on-ink)'],
  orange: ['var(--signal-orange)', 'var(--text-on-signal)'],
  grey: ['var(--platinum-600)', 'var(--text-on-ink)'],
  yellow: ['var(--screen-yellow)', 'var(--text-1)'],
  blue: ['var(--screen-blue)', 'var(--text-on-ink)'],
  green: ['var(--signal-green)', 'var(--text-on-ink)'],
  red: ['var(--screen-red)', 'var(--text-on-ink)'],
};

function Body({ children, style, className }) {
  return (
    <div
      className={className}
      style={{
        background: 'linear-gradient(180deg,var(--platinum-100),var(--platinum-300))',
        borderRadius: 26,
        padding: 24,
        boxShadow:
          'inset 0 2px 0 rgba(255,255,255,.85), inset 0 -2px 0 rgba(27,26,24,.12), 0 2px 0 var(--platinum-500), 0 60px 80px -40px rgba(27,26,24,.5)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
function Plate({ children, style }) {
  return (
    <div
      style={{
        background: 'var(--platinum-50)',
        borderRadius: 14,
        boxShadow: 'inset 0 -3px 0 rgba(27,26,24,.08), 0 0 0 1px var(--platinum-400)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
function Lcd({ children, style }) {
  return (
    <div
      style={{
        background: 'linear-gradient(160deg,rgba(255,255,255,.07),transparent 40%), var(--surface-screen)',
        borderRadius: 12,
        padding: 20,
        color: 'var(--screen-ink)',
        boxShadow: 'inset 0 0 0 3px var(--platinum-900), inset 0 2px 8px rgba(0,0,0,.5)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
function Key({ tone = 'light', w = 72, h = 72, round, on, onClick, label, children, aria, style }) {
  const [bg, fg] = TONE[tone];
  const btn = (
    <button
      className="hw-key"
      aria-label={aria || label}
      onClick={onClick}
      style={{
        width: w,
        height: h,
        flex: 'none',
        borderRadius: round ? 999 : 10,
        border: '1px solid rgba(27,26,24,.35)',
        background: bg,
        color: fg,
        cursor: 'pointer',
        padding: 0,
        display: 'grid',
        placeItems: 'center',
        font: '300 26px/1 var(--font-display)',
        boxShadow: on
          ? 'inset 0 3px 6px rgba(0,0,0,.32)'
          : 'inset 0 1px 0 rgba(255,255,255,.3), inset 0 -4px 0 rgba(27,26,24,.15), 0 3px 0 rgba(27,26,24,.3)',
        transform: on ? 'translateY(2px)' : 'none',
        ...style,
      }}
    >
      {children}
    </button>
  );
  if (!label) return btn;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {btn}
      <span style={{ font: '500 14px/1 var(--font-sans)', color: 'var(--text-1)', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </div>
  );
}
function Led({ on, color = 'var(--signal-orange)', size = 9 }) {
  return (
    <i
      style={{
        display: 'inline-block',
        flex: 'none',
        width: size,
        height: size,
        borderRadius: size,
        background: on ? color : 'var(--platinum-400)',
        boxShadow: 'inset 0 1px 1px rgba(0,0,0,.25)',
      }}
    ></i>
  );
}
function Grille({ style, dot = 2.4, pitch = 10 }) {
  return (
    <div
      style={{
        borderRadius: 14,
        background: `radial-gradient(circle,var(--platinum-800) ${dot}px,transparent ${dot + 0.5}px) 0 0/${pitch}px ${pitch}px, var(--platinum-50)`,
        boxShadow: 'inset 0 1px 3px rgba(27,26,24,.25), 0 0 0 1px var(--platinum-400)',
        ...style,
      }}
    ></div>
  );
}
function Big({ children, size = 96, color = 'var(--screen-ink)', weight = 200, style }) {
  return (
    <span
      style={{
        font: `${weight} ${size}px/0.85 var(--font-display)`,
        letterSpacing: '-0.04em',
        fontVariantNumeric: 'tabular-nums',
        color,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
function Tiny({ children, color = 'var(--screen-ink)', style }) {
  return <span style={{ font: '500 14px/1.2 var(--font-sans)', color, ...style }}>{children}</span>;
}
function Mark({ children, style }) {
  return (
    <span
      style={{
        font: '200 56px/1 var(--font-display)',
        letterSpacing: '-0.04em',
        color: 'var(--text-1)',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
function Step(pts, w, h) {
  const mn = Math.min(...pts),
    mx = Math.max(...pts),
    dx = w / (pts.length - 1);
  const y = (v) => h - 6 - ((v - mn) / (mx - mn || 1)) * (h - 12);
  return pts
    .map((v, i) => (i ? `H${(i * dx).toFixed(1)}V${y(v).toFixed(1)}` : `M0 ${y(v).toFixed(1)}`))
    .join('');
}

export { Body, Plate, Lcd, Key, Led, Grille, Big, Tiny, Mark, Step };

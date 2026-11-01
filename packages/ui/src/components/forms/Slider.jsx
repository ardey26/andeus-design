import React from 'react';

const { useRef, useState } = React;
/** Fader: recessed slot + raised cap with an orange index line. */
function Slider({
  value,
  defaultValue = 0.5,
  min = 0,
  max = 1,
  step = 0,
  onChange,
  label,
  format,
  width = 200,
  style,
}) {
  const [inner, setInner] = useState(defaultValue);
  const v = value ?? inner;
  const ref = useRef(null);
  const pct = (v - min) / (max - min);
  const set = (clientX) => {
    const r = ref.current.getBoundingClientRect();
    let n = min + Math.min(1, Math.max(0, (clientX - r.left) / r.width)) * (max - min);
    if (step) n = Math.round(n / step) * step;
    if (value === undefined) setInner(n);
    onChange && onChange(n);
  };
  const down = (e) => {
    set(e.clientX);
    const mv = (ev) => set(ev.clientX);
    const up = () => {
      window.removeEventListener('pointermove', mv);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', mv);
    window.addEventListener('pointerup', up);
  };
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 'var(--label-gap)',
        width,
        ...style,
      }}
    >
      <div
        ref={ref}
        onPointerDown={down}
        style={{
          position: 'relative',
          height: 24,
          cursor: 'pointer',
          touchAction: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 10,
            height: 4,
            borderRadius: 2,
            background: 'var(--platinum-800)',
            boxShadow: 'inset 0 1px 1px #000',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: `calc(${pct * 100}% - 7px)`,
            top: 0,
            width: 14,
            height: 24,
            boxSizing: 'border-box',
            borderRadius: 3,
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-ink)',
            boxShadow: 'var(--shadow-control)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              width: 2,
              height: '100%',
              background: 'var(--signal-orange)',
            }}
          />
        </div>
      </div>
      {label ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            font: 'var(--type-label)',
            color: 'var(--text-label)',
          }}
        >
          <span>{label}</span>
          <span
            style={{
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--text-1)',
            }}
          >
            {format ? format(v) : v.toFixed(2)}
          </span>
        </div>
      ) : null}
    </div>
  );
}

export { Slider };

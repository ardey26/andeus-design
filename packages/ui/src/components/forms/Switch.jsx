import React from 'react';

const { useState } = React;
/** Braun slide switch with a status LED. */
function Switch({ checked, defaultChecked = false, onChange, label, led = true, disabled, style }) {
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;
  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInner(!on);
    onChange && onChange(!on);
  };
  return (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--label-gap)',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <button
          type="button"
          role="switch"
          aria-checked={on}
          onClick={toggle}
          style={{
            position: 'relative',
            width: 40,
            height: 20,
            padding: 0,
            border: '1px solid var(--border-ink)',
            borderRadius: 'var(--radius-2)',
            background: 'var(--surface-inset)',
            boxShadow: 'var(--shadow-inset)',
            cursor: disabled ? 'default' : 'pointer',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 1,
              left: on ? 19 : 1,
              width: 18,
              height: 16,
              boxSizing: 'border-box',
              borderRadius: 3,
              background: 'var(--surface-raised)',
              border: '1px solid var(--platinum-500)',
              boxShadow: 'var(--shadow-control)',
              transition: 'left var(--dur-move) var(--ease-detent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <i
              style={{
                width: 1,
                height: 8,
                background: 'var(--platinum-400)',
              }}
            />
            <i
              style={{
                width: 1,
                height: 8,
                background: 'var(--platinum-400)',
              }}
            />
            <i
              style={{
                width: 1,
                height: 8,
                background: 'var(--platinum-400)',
              }}
            />
          </span>
        </button>
        {led ? (
          <span
            aria-hidden="true"
            style={{
              width: 6,
              height: 6,
              borderRadius: 6,
              background: on ? 'var(--signal-green)' : 'var(--platinum-400)',
              boxShadow: on ? '0 0 0 2px var(--signal-green-tint)' : 'inset 0 1px 1px rgba(0,0,0,.25)',
              transition: 'background var(--dur-quick)',
            }}
          />
        ) : null}
      </span>
      {label ? (
        <span
          style={{
            font: 'var(--type-label)',
            letterSpacing: 'var(--tracking-label)',
            color: 'var(--text-label)',
          }}
        >
          {label}
        </span>
      ) : null}
    </span>
  );
}

export { Switch };

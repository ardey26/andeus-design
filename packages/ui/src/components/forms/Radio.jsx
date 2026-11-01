import React from 'react';

const { useState } = React;
function Radio({ options = [], value, defaultValue, onChange, name, direction = 'column', style }) {
  const [inner, setInner] = useState(defaultValue);
  const cur = value ?? inner;
  return (
    <div
      role="radiogroup"
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: direction === 'row' ? 16 : 8,
        ...style,
      }}
    >
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value;
        const l = typeof o === 'string' ? o : o.label;
        const on = cur === v;
        return (
          <label
            key={v}
            onClick={() => {
              if (value === undefined) setInner(v);
              onChange && onChange(v);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              font: 'var(--type-body-s)',
              color: 'var(--text-1)',
            }}
          >
            <span
              role="radio"
              aria-checked={on}
              style={{
                width: 16,
                height: 16,
                boxSizing: 'border-box',
                borderRadius: 999,
                border: '1px solid var(--border-ink)',
                background: 'var(--surface-paper)',
                boxShadow: 'var(--shadow-inset)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {on ? (
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: 'var(--platinum-900)',
                  }}
                />
              ) : null}
            </span>
            {l}
          </label>
        );
      })}
    </div>
  );
}

export { Radio };

import React from 'react';
import { Icon } from '../core/Icon';

const { useState } = React;
/** Row of interlocking keys; the selected key stays pressed in with an orange pip. */
function Segmented({ options = [], value, defaultValue, onChange, size = 'm', label, style }) {
  const [inner, setInner] = useState(defaultValue ?? (options[0] && (options[0].value ?? options[0])));
  const cur = value ?? inner;
  const h = size === 's' ? 24 : 32;
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--label-gap)',
        ...style,
      }}
    >
      <div
        role="tablist"
        style={{
          display: 'inline-flex',
          border: '1px solid var(--border-ink)',
          borderRadius: 'var(--radius-control)',
          overflow: 'hidden',
          boxShadow: '0 1px 0 rgba(27,26,24,.18)',
        }}
      >
        {options.map((o, i) => {
          const v = o.value ?? o;
          const l = o.label ?? (o.icon ? null : o);
          const on = v === cur;
          return (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => {
                if (value === undefined) setInner(v);
                onChange && onChange(v);
              }}
              style={{
                position: 'relative',
                height: h,
                padding: `0 ${size === 's' ? 10 : 14}px`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                font: `${on ? 600 : 500} ${size === 's' ? 12 : 13}px/1 var(--font-sans)`,
                color: 'var(--text-1)',
                border: 0,
                borderLeft: i ? '1px solid var(--border-ink)' : 0,
                cursor: 'pointer',
                background: on ? 'var(--platinum-300)' : 'var(--surface-raised)',
                boxShadow: on ? 'var(--shadow-control-press)' : 'inset 0 1px 0 rgba(255,255,255,.75)',
              }}
            >
              {o.icon ? <Icon name={o.icon} size={16} /> : null}
              {l}
              {on ? (
                <span
                  style={{
                    position: 'absolute',
                    top: 3,
                    right: 3,
                    width: 4,
                    height: 4,
                    borderRadius: 4,
                    background: 'var(--signal-orange)',
                  }}
                />
              ) : null}
            </button>
          );
        })}
      </div>
      {label ? (
        <span
          style={{
            font: 'var(--type-label)',
            color: 'var(--text-label)',
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

export { Segmented };

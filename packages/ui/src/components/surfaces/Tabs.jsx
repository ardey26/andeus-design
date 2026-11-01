import React from 'react';

const { useState } = React;
/** Folder tabs that sit on top of a panel edge. */
function Tabs({ tabs = [], value, defaultValue, onChange, style }) {
  const [inner, setInner] = useState(defaultValue ?? (tabs[0] && (tabs[0].value ?? tabs[0])));
  const cur = value ?? inner;
  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 2,
        borderBottom: '1px solid var(--border-ink)',
        padding: '0 8px',
        ...style,
      }}
    >
      {tabs.map((t) => {
        const v = t.value ?? t;
        const l = t.label ?? t;
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
              top: 1,
              height: on ? 30 : 27,
              padding: '0 14px',
              border: '1px solid var(--border-ink)',
              borderBottom: on ? '1px solid var(--surface-panel)' : '1px solid var(--border-ink)',
              borderRadius: '6px 6px 0 0',
              background: on ? 'var(--surface-panel)' : 'var(--platinum-300)',
              color: on ? 'var(--text-1)' : 'var(--text-2)',
              font: `${on ? 600 : 500} 13px/1 var(--font-sans)`,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {l}
            {t.count != null ? (
              <span
                style={{
                  font: '500 11px/1 var(--font-sans)',
                  color: 'var(--text-3)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {t.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export { Tabs };

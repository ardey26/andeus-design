import React from 'react';
import { Icon } from '../core/Icon';

const { useState } = React;
function Checkbox({ checked, defaultChecked = false, onChange, label, disabled, style }) {
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;
  const toggle = () => {
    if (disabled) return;
    if (checked === undefined) setInner(!on);
    onChange && onChange(!on);
  };
  return (
    <label
      onClick={(e) => {
        e.preventDefault();
        toggle();
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        font: 'var(--type-body-s)',
        color: 'var(--text-1)',
        ...style,
      }}
    >
      <span
        role="checkbox"
        aria-checked={on}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ') {
            e.preventDefault();
            toggle();
          }
        }}
        style={{
          width: 16,
          height: 16,
          boxSizing: 'border-box',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border-ink)',
          borderRadius: 'var(--radius-1)',
          background: on ? 'var(--platinum-900)' : 'var(--surface-paper)',
          boxShadow: on ? 'none' : 'var(--shadow-inset)',
          color: 'var(--text-on-ink)',
        }}
      >
        {on ? <Icon name="check" size={16} /> : null}
      </span>
      {label}
    </label>
  );
}

export { Checkbox };

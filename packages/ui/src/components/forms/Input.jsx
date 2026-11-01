import React from 'react';
import { Icon } from '../core/Icon';

const { useState } = React;
function Input({
  label,
  hint,
  error,
  icon,
  suffix,
  size = 'm',
  value,
  defaultValue,
  placeholder,
  onChange,
  disabled,
  numeric = false,
  style,
  inputStyle,
  ...rest
}) {
  const [focus, setFocus] = useState(false);
  const h = size === 's' ? 24 : size === 'l' ? 44 : 32;
  return (
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--label-gap)',
        minWidth: 0,
        ...style,
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          height: h,
          padding: '0 10px',
          boxSizing: 'border-box',
          background: disabled ? 'var(--platinum-100)' : 'var(--surface-paper)',
          border: `1px solid ${error ? 'var(--negative)' : focus ? 'var(--border-ink)' : 'var(--border-1)'}`,
          borderRadius: 'var(--radius-2)',
          boxShadow: focus ? '0 0 0 2px var(--accent-tint), var(--shadow-inset)' : 'var(--shadow-inset)',
          color: 'var(--text-3)',
          transition: 'box-shadow var(--dur-quick) var(--ease-out)',
        }}
      >
        {icon ? <Icon name={icon} size={16} /> : null}
        <input
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1,
            minWidth: 0,
            border: 0,
            outline: 0,
            background: 'transparent',
            padding: 0,
            color: 'var(--text-1)',
            font: `400 ${size === 'l' ? 15 : 13}px/1 var(--font-sans)`,
            fontVariantNumeric: numeric ? 'tabular-nums' : undefined,
            textAlign: numeric ? 'right' : 'left',
            ...inputStyle,
          }}
          {...rest}
        />
        {suffix ? (
          <span
            style={{
              font: 'var(--type-label)',
              color: 'var(--text-3)',
            }}
          >
            {suffix}
          </span>
        ) : null}
      </span>
      {label || hint ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <span
            style={{
              font: 'var(--type-label)',
              letterSpacing: 'var(--tracking-label)',
              color: error ? 'var(--negative)' : 'var(--text-label)',
            }}
          >
            {label}
          </span>
          {hint || error ? (
            <span
              style={{
                font: 'var(--type-label)',
                color: error ? 'var(--negative)' : 'var(--text-3)',
              }}
            >
              {error || hint}
            </span>
          ) : null}
        </div>
      ) : null}
    </label>
  );
}

export { Input };

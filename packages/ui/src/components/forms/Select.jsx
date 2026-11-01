import { Icon } from '../core/Icon';

function Select({
  label,
  hint,
  error,
  options = [],
  value,
  defaultValue,
  onChange,
  size = 'm',
  disabled,
  style,
}) {
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
          position: 'relative',
          display: 'flex',
        }}
      >
        <select
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          style={{
            appearance: 'none',
            WebkitAppearance: 'none',
            width: '100%',
            height: h,
            padding: '0 32px 0 10px',
            boxSizing: 'border-box',
            font: `500 ${size === 'l' ? 15 : 13}px/1 var(--font-sans)`,
            color: 'var(--text-1)',
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-ink)',
            borderRadius: 'var(--radius-control)',
            boxShadow: 'var(--shadow-control)',
            cursor: 'pointer',
            opacity: disabled ? 0.5 : 1,
          }}
        >
          {options.map((o) => {
            const v = typeof o === 'string' ? o : o.value;
            const l = typeof o === 'string' ? o : o.label;
            return (
              <option key={v} value={v}>
                {l}
              </option>
            );
          })}
        </select>
        <span
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 26,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderLeft: '1px solid var(--border-1)',
            pointerEvents: 'none',
          }}
        >
          <Icon name="chevron-down" size={16} />
        </span>
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

export { Select };

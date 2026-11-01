import { Icon } from '../core/Icon';

/** Ticker / asset chip. Square-ish, 1px ink frame. */
function Tag({ children, color, onRemove, style }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 22,
        padding: onRemove ? '0 2px 0 7px' : '0 7px',
        boxSizing: 'border-box',
        border: '1px solid var(--border-ink)',
        borderRadius: 'var(--radius-1)',
        background: 'var(--surface-paper)',
        color: 'var(--text-1)',
        font: '600 12px/1 var(--font-sans)',
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {color ? (
        <span
          style={{
            width: 8,
            height: 8,
            background: color,
            border: '1px solid rgba(0,0,0,.2)',
          }}
        />
      ) : null}
      {children}
      {onRemove ? (
        <button
          type="button"
          aria-label="Remove"
          onClick={onRemove}
          style={{
            width: 16,
            height: 16,
            padding: 0,
            border: 0,
            background: 'transparent',
            color: 'var(--text-2)',
            cursor: 'pointer',
            display: 'inline-flex',
          }}
        >
          <Icon name="close" size={16} />
        </button>
      ) : null}
    </span>
  );
}

export { Tag };

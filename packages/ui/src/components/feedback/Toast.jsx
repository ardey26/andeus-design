import { Icon } from '../core/Icon';

const LED = {
  neutral: 'var(--platinum-400)',
  positive: 'var(--screen-green)',
  negative: 'var(--screen-red)',
  accent: 'var(--screen-orange)',
};
function Toast({ tone = 'neutral', icon, title, children, action, onAction, onClose, style }) {
  return (
    <div
      role="status"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        width: 340,
        maxWidth: '100%',
        boxSizing: 'border-box',
        padding: '10px 10px 10px 12px',
        background: 'var(--glass-dark)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        color: 'var(--text-on-ink)',
        borderRadius: 'var(--radius-3)',
        boxShadow: 'var(--glass-edge-dark)',
        ...style,
      }}
    >
      {icon ? (
        <span
          style={{
            color: LED[tone],
            paddingTop: 1,
          }}
        >
          <Icon name={icon} size={16} />
        </span>
      ) : (
        <span
          style={{
            width: 6,
            height: 6,
            marginTop: 6,
            borderRadius: 6,
            background: LED[tone],
            flexShrink: 0,
          }}
        />
      )}
      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {title ? (
          <div
            style={{
              font: '600 13px/1.35 var(--font-sans)',
            }}
          >
            {title}
          </div>
        ) : null}
        {children ? (
          <div
            style={{
              font: '400 13px/1.4 var(--font-sans)',
              color: 'var(--platinum-200)',
            }}
          >
            {children}
          </div>
        ) : null}
      </div>
      {action ? (
        <button
          type="button"
          onClick={onAction}
          style={{
            border: 0,
            background: 'transparent',
            color: 'var(--screen-orange)',
            font: '600 13px/1.35 var(--font-sans)',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {action}
        </button>
      ) : null}
      {onClose ? (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onClose}
          style={{
            border: 0,
            background: 'transparent',
            color: 'var(--platinum-400)',
            cursor: 'pointer',
            padding: 0,
            display: 'inline-flex',
          }}
        >
          <Icon name="close" size={16} />
        </button>
      ) : null}
    </div>
  );
}

export { Toast };

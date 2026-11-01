function Card({ title, label, action, variant = 'raised', padding = 16, children, style }) {
  const v =
    variant === 'inset'
      ? {
          background: 'var(--surface-inset)',
          border: '1px solid transparent',
          boxShadow: 'var(--shadow-inset)',
        }
      : variant === 'outline'
        ? {
            background: 'transparent',
            border: '1px solid var(--border-1)',
            boxShadow: 'none',
          }
        : {
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-hair)',
            boxShadow: '0 1px 0 rgba(27,26,24,.12)',
          };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding,
        borderRadius: 'var(--radius-4)',
        boxSizing: 'border-box',
        ...v,
        ...style,
      }}
    >
      {title || action ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <h3
            style={{
              margin: 0,
              font: '600 15px/1.3 var(--font-sans)',
              color: 'var(--text-1)',
            }}
          >
            {title}
          </h3>
          {action}
        </div>
      ) : null}
      {children}
      {label ? (
        <div
          style={{
            font: 'var(--type-label)',
            color: 'var(--text-label)',
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
}

export { Card };

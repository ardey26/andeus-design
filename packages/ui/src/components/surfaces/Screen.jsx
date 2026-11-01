/** A small live display set into a recessed bezel. One screen = one job. */
function Screen({ label, children, width, height, padding = 12, style }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 'var(--label-gap)',
        width,
      }}
    >
      <div
        style={{
          padding: 5,
          borderRadius: 8,
          background: 'var(--surface-inset)',
          boxShadow: 'var(--shadow-bezel)',
        }}
      >
        <div
          style={{
            position: 'relative',
            height,
            padding,
            boxSizing: 'border-box',
            background: 'var(--screen-glass), var(--screen-pixels), var(--surface-screen)',
            color: 'var(--screen-ink)',
            borderRadius: 3,
            boxShadow: 'var(--shadow-screen)',
            font: '500 12px/1.3 var(--font-sans)',
            fontVariantNumeric: 'tabular-nums',
            overflow: 'hidden',
            ...style,
          }}
        >
          {children}
        </div>
      </div>
      {label ? (
        <span
          style={{
            font: 'var(--type-label)',
            letterSpacing: 'var(--tracking-label)',
            color: 'var(--text-label)',
            textAlign: 'center',
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

export { Screen };

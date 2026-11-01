/** Wraps any control and puts its label UNDER it, Braun-style. */
function Labeled({ label, sub, align = 'center', children, style }) {
  const ai = align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : 'center';
  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: ai,
        gap: 'var(--label-gap)',
        ...style,
      }}
    >
      {children}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: ai,
          gap: 1,
        }}
      >
        <span
          style={{
            font: 'var(--type-label)',
            letterSpacing: 'var(--tracking-label)',
            color: 'var(--text-label)',
            textAlign: align,
          }}
        >
          {label}
        </span>
        {sub ? (
          <span
            style={{
              font: '400 10px/1.2 var(--font-sans)',
              color: 'var(--text-3)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {sub}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export { Labeled };

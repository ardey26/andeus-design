const ON = {
  neutral: 'var(--screen-ink)',
  positive: 'var(--screen-green)',
  negative: 'var(--screen-red)',
  accent: 'var(--screen-orange)',
};
const OFF = {
  neutral: 'var(--text-1)',
  positive: 'var(--positive)',
  negative: 'var(--negative)',
  accent: 'var(--accent)',
};
const LED = {
  positive: 'var(--signal-green)',
  negative: 'var(--negative)',
  accent: 'var(--signal-orange)',
};

/** One number, its label underneath. Off-screen, positive/negative/accent get a status LED by the label. */
function Metric({
  value,
  label,
  delta,
  tone = 'neutral',
  color,
  onScreen = false,
  size = 'm',
  align = 'start',
  style,
}) {
  const fs = size === 'l' ? 36 : size === 's' ? 18 : 26;
  const c = color || (onScreen ? ON : OFF)[tone] || (onScreen ? ON : OFF).neutral;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align === 'center' ? 'center' : 'flex-start',
        gap: 4,
        minWidth: 0,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 6,
        }}
      >
        <span
          style={{
            font: `${size === 's' ? 500 : 300} ${fs}px/1 var(--font-sans)`,
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
            color: c,
          }}
        >
          {value}
        </span>
        {delta ? (
          <span
            style={{
              font: '600 12px/1 var(--font-sans)',
              fontVariantNumeric: 'tabular-nums',
              color: onScreen ? 'var(--screen-dim)' : 'var(--text-3)',
            }}
          >
            {delta}
          </span>
        ) : null}
      </div>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          font: 'var(--type-label)',
          letterSpacing: 'var(--tracking-label)',
          color: onScreen ? 'var(--screen-dim)' : 'var(--text-label)',
        }}
      >
        {!onScreen && LED[tone] ? (
          <i
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              background: LED[tone],
              boxShadow: 'inset 0 -1px 0 rgba(0,0,0,.2)',
            }}
          />
        ) : null}
        {label}
      </span>
    </div>
  );
}

export { Metric };

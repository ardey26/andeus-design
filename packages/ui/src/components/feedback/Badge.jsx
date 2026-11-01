const TONES = {
  neutral: {
    bg: 'var(--platinum-300)',
    fg: 'var(--text-1)',
    led: 'var(--platinum-500)',
  },
  ink: {
    bg: 'var(--platinum-900)',
    fg: 'var(--text-on-ink)',
    led: 'var(--platinum-400)',
  },
  accent: {
    bg: 'var(--accent-tint)',
    fg: 'var(--signal-orange-press)',
    led: 'var(--signal-orange)',
  },
  positive: {
    bg: 'var(--positive-tint)',
    fg: '#1F6B40',
    led: 'var(--signal-green)',
  },
  negative: {
    bg: 'var(--negative-tint)',
    fg: '#9A2A20',
    led: 'var(--negative)',
  },
};
function Badge({ tone = 'neutral', led = false, children, style }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        height: 18,
        padding: '0 7px',
        borderRadius: 999,
        background: t.bg,
        color: t.fg,
        font: '600 11px/1 var(--font-sans)',
        fontVariantNumeric: 'tabular-nums',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {led ? (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 6,
            background: t.led,
          }}
        />
      ) : null}
      {children}
    </span>
  );
}

export { Badge };

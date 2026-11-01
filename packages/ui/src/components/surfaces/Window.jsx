/** Platinum window with a striped title bar (classic Mac). */
function Window({
  title,
  active = true,
  onClose,
  toolbar,
  footer,
  children,
  width,
  height,
  bodyStyle,
  style,
}) {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        width,
        height,
        boxSizing: 'border-box',
        background: 'var(--surface-panel)',
        border: '1px solid var(--border-ink)',
        borderRadius: 'var(--radius-window)',
        boxShadow: active ? 'var(--shadow-window)' : 'none',
        overflow: 'hidden',
        ...style,
      }}
    >
      <header
        style={{
          position: 'relative',
          flexShrink: 0,
          height: 'var(--titlebar-h)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 6px',
          borderBottom: '1px solid var(--border-ink)',
          background: 'var(--surface-raised)',
        }}
      >
        {active ? (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: '5px 4px 4px',
              background: 'var(--stripes-titlebar)',
            }}
          />
        ) : null}
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          style={{
            position: 'relative',
            width: 12,
            height: 12,
            padding: 0,
            flexShrink: 0,
            border: '1px solid var(--border-ink)',
            background: 'var(--surface-raised)',
            boxShadow: '0 0 0 2px var(--surface-raised)',
            cursor: 'pointer',
            visibility: active ? 'visible' : 'hidden',
          }}
        />
        <h2
          style={{
            position: 'relative',
            margin: '0 auto',
            padding: '0 8px',
            background: 'var(--surface-raised)',
            font: '600 13px/1 var(--font-sans)',
            color: active ? 'var(--text-1)' : 'var(--text-3)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </h2>
        <span
          style={{
            width: 12,
            flexShrink: 0,
          }}
        />
      </header>
      {toolbar ? (
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 10px',
            borderBottom: '1px solid var(--border-1)',
            background: 'var(--surface-panel)',
          }}
        >
          {toolbar}
        </div>
      ) : null}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          ...bodyStyle,
        }}
      >
        {children}
      </div>
      {footer ? (
        <div
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 10px',
            borderTop: '1px solid var(--border-1)',
            font: 'var(--type-label)',
            color: 'var(--text-label)',
          }}
        >
          {footer}
        </div>
      ) : null}
    </section>
  );
}

export { Window };

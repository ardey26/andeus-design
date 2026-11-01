import React from 'react';

function MenuBar({ onAbout }) {
  const [t, setT] = React.useState('9:41');
  React.useEffect(() => {
    const f = () =>
      setT(
        new Date().toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        }),
      );
    f();
    const id = setInterval(f, 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <div
      style={{
        height: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 14px',
        background: 'var(--surface-paper)',
        borderBottom: '1px solid var(--border-ink)',
        font: '500 13px/1 var(--font-sans)',
      }}
    >
      <span
        onClick={onAbout}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 8,
            background: 'var(--signal-orange)',
          }}
        />
        Andeus Design
      </span>
      {['File', 'Edit', 'Strategy', 'View', 'Window'].map((m) => (
        <span key={m}>{m}</span>
      ))}
      <span
        style={{
          marginLeft: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: 'var(--text-2)',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 6,
            background: 'var(--signal-green)',
          }}
        />
        Market open
      </span>
      <span
        style={{
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {t}
      </span>
    </div>
  );
}
export { MenuBar };

import React from 'react';

const { useState } = React;
function Tooltip({ content, placement = 'top', children, style }) {
  const [show, setShow] = useState(false);
  const top = placement === 'top';
  return (
    <span
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        ...style,
      }}
    >
      {children}
      {show ? (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            [top ? 'bottom' : 'top']: 'calc(100% + 6px)',
            padding: '5px 8px',
            background: 'var(--glass-dark)',
            backdropFilter: 'var(--glass-blur)',
            WebkitBackdropFilter: 'var(--glass-blur)',
            color: 'var(--text-on-ink)',
            borderRadius: 'var(--radius-2)',
            font: '500 12px/1.3 var(--font-sans)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 50,
            boxShadow: 'var(--glass-edge-dark)',
          }}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}

export { Tooltip };

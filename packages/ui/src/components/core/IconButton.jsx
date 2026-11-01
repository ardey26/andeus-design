import React from 'react';
import { Icon } from './Icon';

const { useState } = React;
const DIM = {
  s: 24,
  m: 32,
  l: 44,
};
function IconButton({
  icon,
  label,
  size = 'm',
  variant = 'secondary',
  round = false,
  active = false,
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const d = DIM[size] || 32;
  const pressed = down || active;
  const bg =
    variant === 'ghost'
      ? pressed
        ? 'rgba(27,26,24,.12)'
        : hover
          ? 'rgba(27,26,24,.06)'
          : 'transparent'
      : variant === 'ink'
        ? pressed
          ? '#000'
          : 'var(--platinum-900)'
        : pressed
          ? 'var(--platinum-200)'
          : hover
            ? 'var(--surface-paper)'
            : 'var(--surface-raised)';
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      aria-pressed={active || undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setDown(false);
      }}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      style={{
        position: 'relative',
        width: d,
        height: d,
        padding: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: variant === 'ink' ? 'var(--text-on-ink)' : 'var(--text-1)',
        background: bg,
        border: variant === 'ghost' ? '1px solid transparent' : '1px solid var(--border-ink)',
        borderRadius: round ? 999 : 'var(--radius-control)',
        boxShadow:
          variant === 'ghost' ? 'none' : pressed ? 'var(--shadow-control-press)' : 'var(--shadow-control)',
        transform: down ? 'translateY(1px)' : 'none',
        transition: 'transform var(--dur-press) var(--ease-detent)',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={size === 'l' ? 24 : 16} />
      {active ? (
        <span
          style={{
            position: 'absolute',
            top: 3,
            right: 3,
            width: 4,
            height: 4,
            borderRadius: 4,
            background: 'var(--signal-orange)',
          }}
        />
      ) : null}
    </button>
  );
}

export { IconButton };

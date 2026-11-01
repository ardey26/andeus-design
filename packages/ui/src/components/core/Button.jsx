import React from 'react';
import { Icon } from './Icon';

const { useState } = React;
const SIZES = {
  s: {
    h: 24,
    px: 10,
    fs: 12,
    ic: 14,
  },
  m: {
    h: 32,
    px: 14,
    fs: 13,
    ic: 16,
  },
  l: {
    h: 44,
    px: 20,
    fs: 15,
    ic: 18,
  },
};
const VARIANTS = {
  primary: {
    bg: 'var(--signal-orange)',
    hover: '#EC6430',
    press: 'var(--signal-orange-press)',
    fg: 'var(--text-on-signal)',
    border: 'var(--signal-orange-press)',
  },
  secondary: {
    bg: 'var(--surface-raised)',
    hover: 'var(--surface-paper)',
    press: 'var(--platinum-200)',
    fg: 'var(--text-1)',
    border: 'var(--border-ink)',
  },
  ink: {
    bg: 'var(--platinum-900)',
    hover: 'var(--platinum-800)',
    press: '#000',
    fg: 'var(--text-on-ink)',
    border: 'var(--platinum-900)',
  },
  ghost: {
    bg: 'transparent',
    hover: 'rgba(27,26,24,.06)',
    press: 'rgba(27,26,24,.12)',
    fg: 'var(--text-1)',
    border: 'transparent',
  },
};
function Button({
  variant = 'secondary',
  size = 'm',
  isDefault = false,
  round = false,
  icon,
  iconRight,
  fullWidth = false,
  disabled = false,
  children,
  style,
  onClick,
  type = 'button',
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const s = SIZES[size] || SIZES.m;
  const v = VARIANTS[variant] || VARIANTS.secondary;
  const flat = variant === 'ghost';
  const btn = (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setDown(false);
      }}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: s.h,
        minWidth: round ? s.h : undefined,
        padding: round && !children ? 0 : `0 ${s.px}px`,
        width: fullWidth ? '100%' : round && !children ? s.h : undefined,
        font: `600 ${s.fs}px/1 var(--font-sans)`,
        letterSpacing: '0.005em',
        whiteSpace: 'nowrap',
        color: v.fg,
        background: disabled ? 'var(--platinum-100)' : down ? v.press : hover ? v.hover : v.bg,
        border: `1px solid ${disabled ? 'var(--border-1)' : v.border}`,
        borderRadius: round ? 'var(--radius-round)' : 'var(--radius-control)',
        boxShadow: flat || disabled ? 'none' : down ? 'var(--shadow-control-press)' : 'var(--shadow-control)',
        transform: down && !disabled ? 'translateY(1px)' : 'none',
        transition:
          'background var(--dur-quick) var(--ease-out), transform var(--dur-press) var(--ease-detent)',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        ...(disabled
          ? {
              color: 'var(--text-3)',
            }
          : null),
        ...(isDefault ? null : style),
      }}
      {...rest}
    >
      {icon ? <Icon name={icon} size={s.ic} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={s.ic} /> : null}
    </button>
  );
  if (!isDefault) return btn;
  // Classic default button: a heavy ink ring sits outside the button.
  return (
    <span
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        padding: 2,
        border: '3px solid var(--border-ink)',
        borderRadius: round ? 999 : 10,
        ...style,
      }}
    >
      {btn}
    </span>
  );
}

export { Button };

import React from 'react';
import { Icon } from '../core/Icon';

const TONES = {
  ink: {
    bg: 'var(--block-when)',
    fg: 'var(--text-on-ink)',
    border: 'var(--border-ink)',
  },
  plain: {
    bg: 'var(--block-if)',
    fg: 'var(--text-1)',
    border: 'var(--border-ink)',
  },
  muted: {
    bg: 'var(--block-if)',
    fg: 'var(--text-2)',
    border: 'var(--border-1)',
  },
  accent: {
    bg: 'var(--block-then)',
    fg: 'var(--text-on-signal)',
    border: 'var(--signal-orange-press)',
  },
  grey: {
    bg: 'var(--block-until)',
    fg: 'var(--text-1)',
    border: 'var(--platinum-600)',
  },
};

/** Inline value inside a Block sentence: an entity (ink frame), an editable value (orange underline), or plain text. */
function Token({ kind = 'value', color, children, onClick, style }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    height: 22,
    padding: '0 7px',
    boxSizing: 'border-box',
    borderRadius: 'var(--radius-1)',
    font: '600 13px/1 var(--font-sans)',
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
    cursor: onClick ? 'pointer' : 'default',
  };
  if (kind === 'text')
    return (
      <span
        style={{
          font: '400 13px/22px var(--font-sans)',
          color: 'var(--text-2)',
          ...style,
        }}
      >
        {children}
      </span>
    );
  const k =
    kind === 'entity'
      ? {
          background: 'var(--surface-paper)',
          border: '1px solid var(--border-ink)',
          letterSpacing: '0.02em',
        }
      : {
          background: 'var(--surface-paper)',
          border: '1px solid var(--border-1)',
          boxShadow: 'inset 0 -2px 0 var(--accent-tint)',
        };
  return (
    <span
      onClick={onClick}
      style={{
        ...base,
        ...k,
        ...style,
      }}
    >
      {color ? (
        <span
          style={{
            width: 8,
            height: 8,
            background: color,
          }}
        />
      ) : null}
      <span>{children}</span>
    </span>
  );
}

/** One readable step of any rule, workflow or automation. A keyword tab, a sentence, an optional value; nest children to build a tree. */
function Block({
  keyword = 'If',
  tone = 'plain',
  summary,
  aside,
  children,
  selected = false,
  collapsed = false,
  onToggle,
  style,
}) {
  const k = TONES[tone] || TONES.plain;
  const hasKids = React.Children.count(children) > 0;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          minHeight: 36,
          padding: '6px 8px 6px 6px',
          boxSizing: 'border-box',
          background: 'var(--surface-raised)',
          border: `1px solid ${selected ? 'var(--border-ink)' : 'var(--border-hair)'}`,
          borderRadius: 'var(--radius-3)',
          boxShadow: selected ? '0 0 0 2px var(--accent-tint)' : '0 1px 0 rgba(27,26,24,.1)',
        }}
      >
        <span
          style={{
            minWidth: 52,
            height: 24,
            padding: '0 8px',
            boxSizing: 'border-box',
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-2)',
            background: k.bg,
            color: k.fg,
            border: `1px solid ${k.border}`,
            font: '600 12px/1 var(--font-sans)',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            boxShadow:
              tone === 'plain' || tone === 'muted'
                ? 'var(--shadow-control)'
                : 'inset 0 1px 0 rgba(255,255,255,.18)',
          }}
        >
          {keyword}
        </span>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 6,
            font: '400 13px/1.4 var(--font-sans)',
            color: 'var(--text-1)',
          }}
        >
          {summary}
        </div>
        {aside ? (
          <div
            style={{
              flexShrink: 0,
              font: '600 13px/1 var(--font-sans)',
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--text-2)',
            }}
          >
            {aside}
          </div>
        ) : null}
        {hasKids && onToggle ? (
          <button
            type="button"
            aria-label={collapsed ? 'Expand' : 'Collapse'}
            onClick={onToggle}
            style={{
              border: 0,
              background: 'transparent',
              padding: 0,
              color: 'var(--text-2)',
              cursor: 'pointer',
              display: 'inline-flex',
            }}
          >
            <Icon name={collapsed ? 'chevron-right' : 'chevron-down'} size={16} />
          </button>
        ) : null}
      </div>
      {hasKids && !collapsed ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            marginLeft: 31,
            paddingLeft: 14,
            borderLeft: '1px solid var(--border-ink)',
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export { Token, Block };

import React from 'react';
import { Icon } from '../core/Icon';

const { useEffect, useMemo, useRef, useState } = React;
const norm = (o) =>
  typeof o === 'string'
    ? {
        value: o,
        label: o,
      }
    : o;

/** Pick several from a list. Chips in the field, a checklist below, type to filter. */
function MultiSelect({
  label,
  hint,
  error,
  options = [],
  value,
  defaultValue = [],
  onChange,
  placeholder = 'Choose',
  size = 'm',
  max,
  searchable = true,
  disabled,
  width,
  style,
}) {
  const [inner, setInner] = useState(defaultValue);
  const sel = value ?? inner;
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [act, setAct] = useState(0);
  const root = useRef(null);
  const input = useRef(null);
  const opts = useMemo(() => options.map(norm), [options]);
  const shown = opts.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()));
  const full = max != null && sel.length >= max;
  const h = size === 's' ? 24 : size === 'l' ? 44 : 32;
  const fs = size === 'l' ? 15 : 13;
  const set = (next) => {
    if (value === undefined) setInner(next);
    onChange && onChange(next);
  };
  const toggle = (v) => {
    if (sel.includes(v)) set(sel.filter((x) => x !== v));
    else if (!full) set([...sel, v]);
  };
  useEffect(() => {
    if (!open) return;
    const off = (e) => {
      if (root.current && !root.current.contains(e.target)) {
        setOpen(false);
        setQ('');
      }
    };
    document.addEventListener('pointerdown', off);
    return () => document.removeEventListener('pointerdown', off);
  }, [open]);
  useEffect(() => {
    setAct(0);
  }, [q]);
  const key = (e) => {
    if (disabled) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setAct((a) => Math.min(shown.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setAct((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (!open) setOpen(true);
      else if (shown[act]) toggle(shown[act].value);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQ('');
    } else if (e.key === 'Backspace' && !q && sel.length) set(sel.slice(0, -1));
  };
  return (
    <div
      ref={root}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--label-gap)',
        minWidth: 0,
        width,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => {
          if (disabled) return;
          setOpen(true);
          input.current && input.current.focus();
        }}
        style={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 4,
          minHeight: h,
          padding: '3px 32px 3px 4px',
          boxSizing: 'border-box',
          cursor: disabled ? 'default' : 'text',
          background: 'var(--surface-raised)',
          border: '1px solid ' + (error ? 'var(--negative)' : 'var(--border-ink)'),
          borderRadius: 'var(--radius-control)',
          boxShadow: open ? '0 0 0 2px var(--focus-ring)' : 'var(--shadow-control)',
        }}
      >
        {sel.map((v) => {
          const o = opts.find((x) => x.value === v) || {
            value: v,
            label: v,
          };
          return (
            <span
              key={v}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                height: Math.max(18, h - 10),
                padding: '0 2px 0 6px',
                font: `500 ${fs - 1}px/1 var(--font-sans)`,
                color: 'var(--text-1)',
                background: 'var(--platinum-100)',
                border: '1px solid var(--border-1)',
                borderRadius: 3,
              }}
            >
              {o.color ? (
                <i
                  style={{
                    width: 8,
                    height: 8,
                    background: o.color,
                  }}
                />
              ) : null}
              {o.label}
              <button
                type="button"
                aria-label={'Remove ' + o.label}
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(v);
                }}
                disabled={disabled}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'grid',
                  placeItems: 'center',
                  width: 16,
                  height: 16,
                  borderRadius: 2,
                }}
              >
                <Icon name="close" size={12} />
              </button>
            </span>
          );
        })}
        <input
          ref={input}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onKeyDown={key}
          onFocus={() => !disabled && setOpen(true)}
          readOnly={!searchable}
          disabled={disabled}
          placeholder={sel.length ? '' : placeholder}
          aria-label={typeof label === 'string' ? label : placeholder}
          style={{
            all: 'unset',
            flex: 1,
            minWidth: 60,
            height: h - 8,
            padding: '0 6px',
            font: `400 ${fs}px/1 var(--font-sans)`,
            color: 'var(--text-1)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 26,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderLeft: '1px solid var(--border-1)',
            pointerEvents: 'none',
          }}
        >
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
        </span>
      </div>
      {open ? (
        <div
          role="listbox"
          aria-multiselectable="true"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: h + 4,
            zIndex: 40,
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-ink)',
            borderRadius: 'var(--radius-control)',
            boxShadow: 'var(--shadow-float)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              maxHeight: 232,
              overflowY: 'auto',
              padding: 4,
            }}
          >
            {shown.length ? (
              shown.map((o, i) => {
                const on = sel.includes(o.value),
                  dis = !on && full;
                return (
                  <div
                    key={o.value}
                    role="option"
                    aria-selected={on}
                    onMouseEnter={() => setAct(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => !dis && toggle(o.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      height: 30,
                      padding: '0 8px',
                      borderRadius: 3,
                      cursor: dis ? 'default' : 'pointer',
                      opacity: dis ? 0.4 : 1,
                      background: i === act ? 'var(--platinum-100)' : 'transparent',
                      font: `400 ${fs}px/1 var(--font-sans)`,
                      color: 'var(--text-1)',
                    }}
                  >
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        flex: 'none',
                        boxSizing: 'border-box',
                        borderRadius: 2,
                        border: '1px solid var(--border-ink)',
                        background: on ? 'var(--platinum-900)' : 'var(--surface-raised)',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {on ? <Icon name="check" size={12} color="var(--text-on-ink)" /> : null}
                    </span>
                    {o.color ? (
                      <i
                        style={{
                          width: 8,
                          height: 8,
                          flex: 'none',
                          background: o.color,
                        }}
                      />
                    ) : null}
                    <span
                      style={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {o.label}
                    </span>
                    {o.hint ? (
                      <span
                        style={{
                          font: 'var(--type-label)',
                          color: 'var(--text-3)',
                        }}
                      >
                        {o.hint}
                      </span>
                    ) : null}
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  padding: '10px 8px',
                  font: `400 ${fs}px/1.3 var(--font-sans)`,
                  color: 'var(--text-2)',
                }}
              >
                Nothing matches “{q}”
              </div>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              borderTop: '1px solid var(--border-hair)',
              background: 'var(--platinum-50)',
              font: 'var(--type-label)',
              color: 'var(--text-label)',
            }}
          >
            <span
              style={{
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {sel.length}
              {max != null ? ' of ' + max : ''}
              {' selected'}
            </span>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => set([])}
              disabled={!sel.length}
              style={{
                all: 'unset',
                cursor: sel.length ? 'pointer' : 'default',
                color: sel.length ? 'var(--text-1)' : 'var(--text-3)',
                font: 'var(--type-label)',
              }}
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}
      {label || hint || error ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <span
            style={{
              font: 'var(--type-label)',
              letterSpacing: 'var(--tracking-label)',
              color: error ? 'var(--negative)' : 'var(--text-label)',
            }}
          >
            {label}
          </span>
          {hint || error ? (
            <span
              style={{
                font: 'var(--type-label)',
                color: error ? 'var(--negative)' : 'var(--text-3)',
              }}
            >
              {error || hint}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export { MultiSelect };

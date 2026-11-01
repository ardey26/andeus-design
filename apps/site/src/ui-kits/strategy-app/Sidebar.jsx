import React from 'react';
import { Badge, Button, Input } from '@andeus/ui';
function Sidebar({ strategies, current, onPick, onNew }) {
  const tone = {
    live: 'positive',
    draft: 'neutral',
    paused: 'ink',
  };
  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--border-ink)',
        background: 'var(--platinum-100)',
      }}
    >
      <div
        style={{
          padding: 10,
        }}
      >
        <Input icon="search" placeholder="Find a strategy" size="s" />
      </div>
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {strategies.map((s) => {
          const on = s.id === current;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onPick(s.id)}
              style={{
                textAlign: 'left',
                border: 0,
                borderTop: '1px solid var(--border-hair)',
                padding: '10px 12px',
                cursor: 'pointer',
                background: on ? 'var(--platinum-900)' : 'transparent',
                color: on ? 'var(--text-on-ink)' : 'var(--text-1)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    font: '600 13px/1.2 var(--font-sans)',
                  }}
                >
                  {s.name}
                </span>
                <Badge tone={tone[s.status]} led={s.status === 'live'}>
                  {s.status === 'live' ? 'Live' : s.status === 'draft' ? 'Draft' : 'Paused'}
                </Badge>
              </span>
              <span
                style={{
                  font: '500 11px/1 var(--font-sans)',
                  color: on ? 'var(--platinum-400)' : 'var(--text-label)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {s.cagr}
                {' a year \xB7 vs '}
                {s.bench}
                {' \xB7 '}
                {s.blocks}
                {' blocks'}
              </span>
            </button>
          );
        })}
      </div>
      <div
        style={{
          padding: 10,
          borderTop: '1px solid var(--border-ink)',
        }}
      >
        <Button icon="plus" fullWidth onClick={onNew}>
          New strategy
        </Button>
      </div>
    </aside>
  );
}
export { Sidebar };

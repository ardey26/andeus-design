import React from 'react';
import { Tag, Screen, Metric } from '@andeus/ui';
import { ANDEUS_DATA } from './data';
function HoldingsView() {
  const { holdings } = ANDEUS_DATA;
  return (
    <div
      style={{
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 14,
        }}
      >
        <Screen label="Value" width={180}>
          <Metric onScreen value="$12,481" label="Today +$104" tone="positive" />
        </Screen>
        <Screen label="Next rebalance" width={180}>
          <Metric onScreen value="Mon 9:30" label="in 2 days" />
        </Screen>
      </div>
      <div
        style={{
          border: '1px solid var(--border-ink)',
          borderRadius: 'var(--radius-2)',
          background: 'var(--surface-paper)',
        }}
      >
        {holdings.map((h, i) => (
          <div
            key={h.t}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 200px 80px',
              alignItems: 'center',
              gap: 16,
              padding: '12px 14px',
              borderTop: i ? '1px solid var(--border-hair)' : 0,
            }}
          >
            <Tag color={h.color}>{h.t}</Tag>
            <span
              style={{
                font: 'var(--type-body-s)',
                color: 'var(--text-2)',
              }}
            >
              {h.name}
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span
                style={{
                  flex: 1,
                  height: 6,
                  background: 'var(--surface-inset)',
                  borderRadius: 3,
                  boxShadow: 'var(--shadow-inset)',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    width: h.w + '%',
                    height: '100%',
                    borderRadius: 3,
                    background: 'var(--platinum-900)',
                  }}
                />
              </span>
              <span
                style={{
                  font: '600 13px/1 var(--font-sans)',
                  fontVariantNumeric: 'tabular-nums',
                  width: 34,
                  textAlign: 'right',
                }}
              >
                {h.w}%
              </span>
            </span>
            <span
              style={{
                font: '600 13px/1 var(--font-sans)',
                fontVariantNumeric: 'tabular-nums',
                textAlign: 'right',
                color: h.up ? 'var(--positive)' : 'var(--negative)',
              }}
            >
              {h.today}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
export { HoldingsView };

import React from 'react';
import { Chart, Segmented, Select, Screen, Metric, Card } from '@andeus/ui';
import { ANDEUS_DATA } from './data';
import { andeusSeries } from './data';

function BacktestView({ strategy }) {
  const [range, setRange] = React.useState('5Y');
  const [bench, setBench] = React.useState(strategy.bench);
  const n = {
    '1Y': 52,
    '3Y': 90,
    '5Y': 120,
    Max: 160,
  }[range];
  const s = React.useMemo(() => andeusSeries(strategy.seed, n, 0.011, 0.07), [strategy.seed, n]);
  const b = React.useMemo(() => andeusSeries(bench.length * 3, n, 0.007, 0.055), [bench, n]);
  const { years } = ANDEUS_DATA;
  return (
    <div
      style={{
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        overflow: 'auto',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 20,
        }}
      >
        <Segmented options={['1Y', '3Y', '5Y', 'Max']} value={range} onChange={setRange} label="Range" />
        <Select
          options={['SPY', 'QQQ', '60/40']}
          value={bench}
          onChange={(e) => setBench(e.target.value)}
          label="Benchmark"
          style={{
            width: 140,
          }}
        />
      </div>
      <Chart
        series={[
          {
            label: strategy.name,
            values: s,
            color: 'var(--screen-blue)',
          },
          {
            label: bench,
            values: b,
            color: 'var(--screen-yellow)',
          },
        ]}
        band={{
          values: (() => {
            let pk = -Infinity;
            return s.map((v) => {
              pk = Math.max(pk, v);
              return v / pk - 1;
            });
          })(),
          label: 'Drawdown',
        }}
        cursorLabel={(i) => 'Day ' + (i + 1)}
        endLabel="Today"
        height={260}
        startLabel={
          {
            '1Y': '2025',
            '3Y': '2023',
            '5Y': '2021',
            Max: '2016',
          }[range]
        }
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 14,
        }}
      >
        <Screen label="Annual return">
          <Metric onScreen value={strategy.cagr} label={'vs 10.1% ' + bench} color="var(--screen-blue)" />
        </Screen>
        <Screen label="Risk-adjusted">
          <Metric onScreen value="1.21" label="Sharpe ratio" />
        </Screen>
        <Screen label="Worst fall">
          <Metric onScreen value="−12.8%" label="Max drawdown" tone="negative" />
        </Screen>
        <Screen label="Beat benchmark">
          <Metric onScreen value="4 of 5" label="Calendar years" tone="positive" />
        </Screen>
      </div>
      <Card title="By year" padding={14}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            font: '500 13px/1 var(--font-sans)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {[['Year', 'Strategy', bench], ...years].map((r, i) =>
            r.map((c, j) => (
              <div
                key={i + '-' + j}
                style={{
                  padding: '8px 0',
                  borderTop: i ? '1px solid var(--border-hair)' : 0,
                  textAlign: j ? 'right' : 'left',
                  color:
                    i === 0
                      ? 'var(--text-label)'
                      : j && c.startsWith('−')
                        ? 'var(--negative)'
                        : 'var(--text-1)',
                  font: i === 0 ? 'var(--type-label)' : undefined,
                }}
              >
                {c}
              </div>
            )),
          )}
        </div>
      </Card>
    </div>
  );
}
export { BacktestView };

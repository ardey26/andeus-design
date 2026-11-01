import React from 'react';
import { Block, Token, Input, Select, Slider, Labeled, Screen, Metric, Button, Card } from '@andeus/ui';

function LogicView() {
  const [sel, setSel] = React.useState('if');
  const [weight, setWeight] = React.useState(60);
  const [look, setLook] = React.useState(200);
  const [collapsed, setCollapsed] = React.useState(false);
  const pick = (id) => (e) => {
    e.stopPropagation();
    setSel(id);
  };
  const wrap = (id, el) => (
    <div
      onClick={pick(id)}
      style={{
        cursor: 'pointer',
      }}
    >
      {el}
    </div>
  );
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
          overflow: 'auto',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {wrap(
          'when',
          <Block
            keyword="When"
            tone="ink"
            selected={sel === 'when'}
            summary={
              <>
                {'Every '}
                <Token>Monday</Token>
                {' at market open'}
              </>
            }
          />,
        )}
        <div
          style={{
            marginLeft: 31,
            paddingLeft: 14,
            borderLeft: '1px solid var(--border-ink)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {wrap(
            'if',
            <Block
              keyword="If"
              tone="plain"
              selected={sel === 'if'}
              collapsed={collapsed}
              onToggle={() => setCollapsed(!collapsed)}
              summary={
                <>
                  <Token kind="entity" color="var(--screen-yellow)">
                    SPY
                  </Token>
                  {' is above its '}
                  <Token>{look}-day average</Token>
                </>
              }
            >
              {wrap(
                't1',
                <Block
                  keyword="Then"
                  tone="accent"
                  selected={sel === 't1'}
                  summary={
                    <>
                      {'Hold '}
                      <Token kind="entity" color="var(--screen-blue)">
                        QQQ
                      </Token>
                    </>
                  }
                  aside={weight + '%'}
                />,
              )}
              {wrap(
                't2',
                <Block
                  keyword="Then"
                  tone="accent"
                  selected={sel === 't2'}
                  summary={
                    <>
                      {'Hold '}
                      <Token kind="entity">GLD</Token>
                    </>
                  }
                  aside={100 - weight + '%'}
                />,
              )}
            </Block>,
          )}
          {wrap(
            'else',
            <Block keyword="Else" tone="muted" selected={sel === 'else'} summary="Otherwise">
              {wrap(
                't3',
                <Block
                  keyword="Then"
                  tone="accent"
                  selected={sel === 't3'}
                  summary={
                    <>
                      {'Hold '}
                      <Token kind="entity">TLT</Token>
                    </>
                  }
                  aside="100%"
                />,
              )}
            </Block>,
          )}
        </div>
        {wrap(
          'until',
          <Block
            keyword="Until"
            tone="grey"
            selected={sel === 'until'}
            summary={
              <>
                {'Drawdown passes '}
                <Token>15%</Token>, then move to cash
              </>
            }
          />,
        )}
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 10,
          }}
        >
          <Button size="s" icon="plus">
            If
          </Button>
          <Button size="s" icon="plus">
            Then
          </Button>
          <Button size="s" icon="plus">
            Until
          </Button>
        </div>
      </div>
      <aside
        style={{
          width: 260,
          flexShrink: 0,
          borderLeft: '1px solid var(--border-ink)',
          background: 'var(--platinum-100)',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            font: '600 13px/1 var(--font-sans)',
          }}
        >
          {sel === 'if'
            ? 'If block'
            : sel.startsWith('t')
              ? 'Then block'
              : sel === 'when'
                ? 'When block'
                : sel === 'until'
                  ? 'Until block'
                  : 'Else block'}
        </div>
        <Screen label="This block, last 5 years">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Metric onScreen size="s" value="71%" label="Time true" color="var(--screen-blue)" />
            <Metric onScreen size="s" value="9" label="Switches" />
          </div>
        </Screen>
        <Select
          label="Indicator"
          options={['Moving average', 'Relative strength', 'Volatility']}
          defaultValue="Moving average"
        />
        <Slider
          label="Lookback"
          min={20}
          max={400}
          step={10}
          value={look}
          onChange={setLook}
          format={(v) => Math.round(v) + 'd'}
          width="100%"
        />
        <Select label="Benchmark" options={['SPY', 'QQQ', '60/40', 'Cash']} defaultValue="SPY" />
        <Slider
          label="QQQ weight"
          min={0}
          max={100}
          step={5}
          value={weight}
          onChange={setWeight}
          format={(v) => Math.round(v) + '%'}
          width="100%"
        />
        <Input label="Rebalance band" numeric suffix="%" defaultValue={5} />
      </aside>
    </div>
  );
}
export { LogicView };

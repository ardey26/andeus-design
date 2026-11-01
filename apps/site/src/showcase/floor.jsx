import React from 'react';
import {
  Badge,
  Block,
  Button,
  Card,
  Chart,
  Checkbox,
  Dialog,
  Icon,
  IconButton,
  Input,
  Labeled,
  Metric,
  Radio,
  Screen,
  Segmented,
  Select,
  Slider,
  Switch,
  Tabs,
  Tag,
  Toast,
  Token,
  Tooltip,
  Window,
} from '@andeus/ui';
import { Body, Lcd, Grille, Led, Mark, Tiny } from './hw-kit';

const keyFace = {
  width: '100%',
  height: 104,
  borderRadius: 10,
  border: '1px solid rgba(27,26,24,.35)',
  cursor: 'pointer',
  padding: '10px 12px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  textAlign: 'left',
  boxSizing: 'border-box',
  boxShadow:
    'inset 0 1px 0 rgba(255,255,255,.3), inset 0 -4px 0 rgba(27,26,24,.15), 0 3px 0 rgba(27,26,24,.3)',
};

/* ---------- Floor plan: a building directory panel ---------- */
export function FloorPlan({ rooms, total, go, nn }) {
  const [cur, setCur] = React.useState(null);
  const r = cur == null ? null : rooms[cur];

  return (
    <section id="rooms" className="sc-wrap" style={{ paddingBottom: 96 }} data-screen-label="Floor plan">
      <h2 style={{ font: 'var(--type-h2)', margin: '0 0 20px' }}>Floor plan</h2>
      <Body style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="sc-dir-top">
          <Lcd
            style={{
              minHeight: 168,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <Tiny color="var(--screen-dim)">{r ? 'Room ' + nn(cur) + ' · ' + r.kind : 'Directory'}</Tiny>
              <Tiny color="var(--screen-dim)">{r ? r.parts.length + ' parts' : rooms.length + ' rooms'}</Tiny>
            </div>
            <div>
              <div
                style={{
                  font: '200 clamp(40px,6vw,64px)/0.9 var(--font-display)',
                  letterSpacing: '-0.04em',
                  color: r ? 'var(--screen-ink)' : 'var(--screen-orange)',
                }}
              >
                {r ? r.name : 'Pick a room'}
              </div>
              <div
                style={{
                  font: '400 15px/1.4 var(--font-sans)',
                  color: 'var(--screen-ink)',
                  marginTop: 10,
                  minHeight: 21,
                }}
              >
                {r ? r.line : 'Every room is a working app built from the same ' + total + ' parts.'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', minHeight: 22 }}>
              {(r ? r.parts : []).map((p) => (
                <span
                  key={p}
                  style={{
                    font: '500 12px/1 var(--font-sans)',
                    color: 'var(--screen-blue)',
                    border: '1px solid var(--screen-grid)',
                    borderRadius: 4,
                    padding: '4px 6px',
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </Lcd>
          <div className="sc-dir-grille">
            <Grille style={{ height: '100%', minHeight: 168 }} />
          </div>
        </div>

        <div className="sc-dir-keys" onMouseLeave={() => setCur(null)}>
          {rooms.map((room, i) => {
            const on = cur === i;
            return (
              <button
                key={room.id}
                className="hw-key"
                aria-label={'Go to ' + room.name}
                onMouseEnter={() => setCur(i)}
                onFocus={() => setCur(i)}
                onClick={() => go(room.id)}
                style={{
                  ...keyFace,
                  background: on ? 'var(--platinum-0)' : 'var(--platinum-50)',
                  color: 'var(--text-1)',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <span
                    style={{
                      font: '600 12px/1 var(--font-sans)',
                      color: 'var(--text-3)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {nn(i)}
                  </span>
                  <Led on={on} size={7} />
                </span>
                <Icon name={room.icon} size={20} />
                <span style={{ font: '500 15px/1 var(--font-sans)' }}>{room.name}</span>
              </button>
            );
          })}
          <button
            className="hw-key sc-dir-exit"
            aria-label="Go to the parts"
            onClick={() => go('parts')}
            style={{ ...keyFace, background: 'var(--signal-orange)', color: 'var(--text-on-signal)' }}
          >
            <span style={{ font: '600 12px/1 var(--font-sans)', opacity: 0.8 }}>Exit</span>
            <Icon name="grid" size={20} color="var(--text-on-signal)" />
            <span style={{ font: '500 15px/1 var(--font-sans)' }}>All {total} parts</span>
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            padding: '0 4px',
          }}
        >
          <span style={{ font: '500 14px/1.2 var(--font-sans)', color: 'var(--text-2)' }}>
            Hover to read. Press to go.
          </span>
          <Mark>D-1</Mark>
        </div>
      </Body>
    </section>
  );
}

/* ---------- Parts: a cabinet of live specimens ---------- */
const SPECIMEN = {
  Button: () => (
    <Button variant="primary" icon="play">
      Run
    </Button>
  ),
  IconButton: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <IconButton icon="play" label="Play" />
      <IconButton icon="edit" label="Edit" variant="ink" />
    </div>
  ),
  Icon: () => (
    <div style={{ display: 'flex', gap: 14 }}>
      {['folder', 'calendar', 'coin', 'clock'].map((n) => (
        <Icon key={n} name={n} size={24} />
      ))}
    </div>
  ),
  Labeled: () => (
    <Labeled label="Rebalance" sub="Monthly">
      <Switch led={false} defaultChecked />
    </Labeled>
  ),
  Input: () => <Input placeholder="Ticker" icon="search" style={{ width: 170 }} />,
  Select: () => <Select options={['SPY', 'QQQ', '60/40']} defaultValue="SPY" style={{ width: 150 }} />,
  Checkbox: () => <Checkbox label="Dividends" defaultChecked />,
  Radio: () => <Radio direction="row" options={['Week', 'Month']} defaultValue="Month" />,
  Switch: () => <Switch label="Live" defaultChecked />,
  Slider: () => <Slider defaultValue={0.62} width={160} />,
  Segmented: () => <Segmented options={['7d', '30d', '90d']} defaultValue="30d" />,
  Badge: () => (
    <div style={{ display: 'flex', gap: 6 }}>
      <Badge tone="positive" led>
        Live
      </Badge>
      <Badge tone="accent">Draft</Badge>
    </div>
  ),
  Tag: () => (
    <div style={{ display: 'flex', gap: 6 }}>
      <Tag color="var(--screen-blue)">QQQ</Tag>
      <Tag color="var(--screen-yellow)" onRemove={() => {}}>
        SPY
      </Tag>
    </div>
  ),
  Toast: () => (
    <Toast tone="positive" icon="check">
      Saved
    </Toast>
  ),
  Tooltip: () => (
    <Tooltip content="Hold to repeat">
      <Button size="s">Hover me</Button>
    </Tooltip>
  ),
  Window: () => (
    <Window title="Notes" width={200}>
      <div style={{ padding: 12, fontSize: 13 }}>Fewer screens.</div>
    </Window>
  ),
  Card: () => (
    <Card title="Heat" style={{ width: 170 }}>
      <span style={{ font: '200 32px/1 var(--font-display)' }}>21.5°</span>
    </Card>
  ),
  Dialog: () => (
    <div style={{ zoom: 0.62 }}>
      <Dialog
        inline
        title="Delete?"
        icon="warning-box"
        width={300}
        actions={
          <>
            <Button variant="ghost">Not yet</Button>
            <Button isDefault>Delete</Button>
          </>
        }
      >
        Gone in 30 days.
      </Dialog>
    </div>
  ),
  Screen: () => (
    <Screen width={170} height={64} label="Bpm">
      <span style={{ font: '200 40px/1 var(--font-display)', color: 'var(--screen-ink)' }}>120</span>
    </Screen>
  ),
  Tabs: () => <Tabs tabs={['Logic', 'Backtest', 'Runs']} style={{ width: 210 }} />,
  Block: () => (
    <div style={{ zoom: 0.8, width: 280 }}>
      <Block
        keyword="If"
        summary={
          <>
            SPY above <Token>200-day</Token>
          </>
        }
      />
    </div>
  ),
  Token: () => (
    <div style={{ display: 'flex', gap: 6 }}>
      <Token kind="entity" color="var(--screen-yellow)">
        SPY
      </Token>
      <Token>200-day</Token>
    </div>
  ),
  Chart: () => (
    <div style={{ zoom: 0.5, width: 400 }}>
      <Chart height={200} />
    </div>
  ),
  Metric: () => <Metric value="+18.4%" label="Per year" delta="vs 11.2%" tone="positive" />,
};

export function Parts({ rooms, all, go, nn }) {
  const [room, setRoom] = React.useState(null);
  const used = (p) => rooms.map((r, i) => (r.parts.includes(p) ? i : -1)).filter((i) => i >= 0);

  return (
    <section
      id="parts"
      className="sc-wrap"
      style={{ paddingTop: 96, paddingBottom: 96 }}
      data-screen-label="Parts"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 16,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}
      >
        <h2 style={{ font: 'var(--type-h1)', letterSpacing: 'var(--tracking-display)', margin: 0 }}>
          The parts
        </h2>
        <span style={{ color: 'var(--text-2)' }}>
          {all.length} components, all live. The lights are the rooms that use each one.
        </span>
      </div>

      <Body style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div className="sc-cabinet">
          {all.map((p) => {
            const u = used(p);
            const S = SPECIMEN[p];
            const dim = room != null && !u.includes(room);
            return (
              <div key={p} className="sc-drawer" style={{ opacity: dim ? 0.35 : 1 }}>
                <div className="sc-tray">{S ? <S /> : null}</div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}
                >
                  <span style={{ font: '600 15px/1 var(--font-sans)' }}>{p}</span>
                  <span
                    style={{
                      font: '500 12px/1 var(--font-sans)',
                      color: 'var(--text-3)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {u.length ? '×' + u.length : 'Hero'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {rooms.map((r, i) => (
                    <button
                      key={r.id}
                      className="sc-led"
                      title={nn(i) + ' ' + r.name}
                      aria-label={p + ' in ' + r.name}
                      disabled={!u.includes(i)}
                      onClick={() => go(r.id)}
                    >
                      <Led
                        on={u.includes(i)}
                        size={8}
                        color={room === i ? 'var(--signal-green)' : 'var(--signal-orange)'}
                      />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="sc-cab-foot">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ font: '500 14px/1 var(--font-sans)', color: 'var(--text-2)', marginRight: 6 }}>
              Light up a room
            </span>
            {rooms.map((r, i) => (
              <button
                key={r.id}
                className="hw-key"
                aria-pressed={room === i}
                title={r.name}
                onClick={() => setRoom(room === i ? null : i)}
                style={{
                  ...keyFace,
                  width: 40,
                  height: 32,
                  padding: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  font: '600 12px/1 var(--font-sans)',
                  fontVariantNumeric: 'tabular-nums',
                  background: room === i ? 'var(--platinum-900)' : 'var(--platinum-50)',
                  color: room === i ? 'var(--text-on-ink)' : 'var(--text-1)',
                }}
              >
                {nn(i)}
              </button>
            ))}
          </div>
          <Mark>K-{all.length}</Mark>
        </div>
      </Body>
    </section>
  );
}

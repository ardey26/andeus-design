import React from 'react';
import * as NS from '@andeus/ui';
import {
  Button,
  IconButton,
  Icon,
  Labeled,
  Input,
  Select,
  MultiSelect,
  MusicPlayer,
  Checkbox,
  Radio,
  Switch,
  Slider,
  Segmented,
  Badge,
  Tag,
  Toast,
  Tooltip,
  Card,
  Dialog,
  Screen,
  Tabs,
  Window,
  Metric,
  Chart,
  Block,
  Token,
} from '@andeus/ui';

const row = { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' };

function DialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete strategy</Button>
      <Dialog
        open={open}
        title="Delete this strategy?"
        icon="warning-box"
        onClose={() => setOpen(false)}
        actions={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Not yet
            </Button>
            <Button isDefault onClick={() => setOpen(false)}>
              Delete
            </Button>
          </>
        }
      >
        Backtests stay in the archive for 30 days.
      </Dialog>
    </>
  );
}
function SliderDemo() {
  const [v, setV] = React.useState(200);
  return (
    <Slider
      label="Lookback"
      min={20}
      max={400}
      step={10}
      value={v}
      onChange={setV}
      format={(x) => Math.round(x) + 'd'}
      width={280}
    />
  );
}
function SwitchDemo() {
  const [on, setOn] = React.useState(true);
  return (
    <div style={row}>
      <Switch label="Rebalance" led={false} checked={on} onChange={setOn} />
    </div>
  );
}
function ToastDemo() {
  const [n, setN] = React.useState(true);
  return n ? (
    <Toast
      tone="positive"
      icon="check"
      action="Undo"
      onAction={() => setN(false)}
      onClose={() => setN(false)}
    >
      Strategy saved.
    </Toast>
  ) : (
    <Button size="s" onClick={() => setN(true)}>
      Show again
    </Button>
  );
}

const C = [
  {
    id: 'button',
    name: 'Button',
    group: 'Actions',
    desc: 'A physical push button. One or two words, sentence case. One primary per view; the default ring marks what Return does.',
    demos: [
      {
        t: 'Variants',
        el: () => (
          <div style={row}>
            <Button variant="primary">Run</Button>
            <Button>Save</Button>
            <Button variant="ink">Export</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        ),
        code: `<Button variant="primary">Run</Button>\n<Button>Save</Button>\n<Button variant="ink">Export</Button>\n<Button variant="ghost">Cancel</Button>`,
      },
      {
        t: 'Default ring',
        el: () => (
          <div style={row}>
            <Button variant="ghost">Not yet</Button>
            <Button isDefault>Delete</Button>
          </div>
        ),
        code: `<Button variant="ghost">Not yet</Button>\n<Button isDefault>Delete</Button>`,
      },
      {
        t: 'Sizes and icons',
        el: () => (
          <div style={row}>
            <Button size="s" icon="plus">
              Add
            </Button>
            <Button icon="play">Backtest</Button>
            <Button size="l" iconRight="arrow-right">
              Continue
            </Button>
            <Button disabled>Disabled</Button>
          </div>
        ),
        code: `<Button size="s" icon="plus">Add</Button>\n<Button icon="play">Backtest</Button>\n<Button size="l" iconRight="arrow-right">Continue</Button>\n<Button disabled>Disabled</Button>`,
      },
    ],
    props: [
      ['variant', "'primary' | 'secondary' | 'ink' | 'ghost'", "'secondary'", 'Visual weight.'],
      ['size', "'s' | 'm' | 'l'", "'m'", 'Height 28 / 36 / 44.'],
      ['isDefault', 'boolean', 'false', 'Draws the default-button ring.'],
      ['round', 'boolean', 'false', 'Circular key.'],
      ['icon', 'IconName', '—', 'Icon before the label.'],
      ['iconRight', 'IconName', '—', 'Icon after the label.'],
      ['fullWidth', 'boolean', 'false', 'Stretch to container.'],
      ['disabled', 'boolean', 'false', ''],
      ['type', "'button' | 'submit' | 'reset'", "'button'", ''],
      ['onClick', '(e: React.MouseEvent) => void', '—', ''],
      ['children', 'ReactNode', '—', 'Label.'],
    ],
  },
  {
    id: 'icon-button',
    name: 'IconButton',
    group: 'Actions',
    desc: 'A key with a single icon. Always give it a label; it becomes the accessible name and tooltip.',
    demos: [
      {
        t: 'Variants and states',
        el: () => (
          <div style={row}>
            <IconButton icon="edit" label="Edit" />
            <IconButton icon="trash" label="Delete" variant="ink" />
            <IconButton icon="more-horizontal" label="More" variant="ghost" />
            <IconButton icon="reload" label="Reset" round />
            <IconButton icon="eye" label="Focus" active />
            <IconButton icon="lock" label="Locked" disabled />
          </div>
        ),
        code: `<IconButton icon="edit" label="Edit" />\n<IconButton icon="trash" label="Delete" variant="ink" />\n<IconButton icon="reload" label="Reset" round />\n<IconButton icon="eye" label="Focus" active />`,
      },
    ],
    props: [
      ['icon', 'IconName', 'required', ''],
      ['label', 'string', 'required', 'Accessible name.'],
      ['size', "'s' | 'm' | 'l'", "'m'", ''],
      ['variant', "'secondary' | 'ink' | 'ghost'", "'secondary'", ''],
      ['round', 'boolean', 'false', ''],
      ['active', 'boolean', 'false', 'Latched (pressed-in) state.'],
      ['disabled', 'boolean', 'false', ''],
      ['onClick', '(e: React.MouseEvent) => void', '—', ''],
    ],
  },
  {
    id: 'input',
    name: 'Input',
    group: 'Forms',
    desc: 'Single-line text field with a label above and an optional hint or error below.',
    demos: [
      {
        t: 'Field',
        el: () => (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
              gap: 16,
              width: '100%',
            }}
          >
            <Input label="Name" placeholder="Trend follower" />
            <Input label="Search" icon="search" placeholder="Ticker" />
            <Input label="Allocation" numeric defaultValue="60" suffix="%" hint="Of the portfolio" />
            <Input label="Ticker" defaultValue="SPYY" error="No such ticker" />
          </div>
        ),
        code: `const [name, setName] = useState('');\n\n<Input label="Name" placeholder="Trend follower" value={name} onChange={(e) => setName(e.target.value)} />\n<Input label="Search" icon="search" placeholder="Ticker" />\n<Input label="Allocation" numeric suffix="%" hint="Of the portfolio" />\n<Input label="Ticker" error="No such ticker" />`,
      },
    ],
    props: [
      ['value', 'string | number', '—', 'Controlled with onChange; or pass defaultValue / defaultChecked.'],
      ['label', 'string | ReactNode', '—', ''],
      ['hint', 'string | ReactNode', '—', ''],
      ['error', 'string | ReactNode', '—', 'Replaces the hint and marks the field invalid.'],
      ['icon', 'IconName', '—', 'Leading icon.'],
      ['suffix', 'string | ReactNode', '—', 'Unit after the value.'],
      ['size', "'s' | 'm' | 'l'", "'m'", ''],
      ['numeric', 'boolean', 'false', 'Right-aligned tabular numerals.'],
      ['placeholder', 'string', '—', ''],
      ['disabled', 'boolean', 'false', ''],
    ],
  },
  {
    id: 'select',
    name: 'Select',
    group: 'Forms',
    desc: 'Pick one from a list of six or more. For two to four choices use Segmented or Radio.',
    demos: [
      {
        t: 'Select',
        el: () => (
          <div style={{ width: 260 }}>
            <Select label="Benchmark" options={['SPY', 'QQQ', '60/40', 'Cash']} defaultValue="SPY" />
          </div>
        ),
        code: `const [benchmark, setBenchmark] = useState('SPY');\n\n<Select label="Benchmark" options={['SPY', 'QQQ', '60/40', 'Cash']}\n  value={benchmark} onChange={(e) => setBenchmark(e.target.value)} />`,
      },
    ],
    props: [
      ['options', 'Array<string | { value, label }>', 'required', ''],
      ['value', 'string', '—', 'Controlled with onChange; or pass defaultValue / defaultChecked.'],
      ['label', 'string', '—', ''],
      ['hint', 'string', '—', ''],
      ['error', 'string', '—', ''],
      ['size', "'s' | 'm' | 'l'", "'m'", ''],
      ['disabled', 'boolean', 'false', ''],
    ],
  },
  {
    id: 'multiselect',
    name: 'MultiSelect',
    group: 'Forms',
    desc: 'Pick several values from a list. Chips sit in the field, a checklist opens below, and typing filters it. Backspace removes the last chip.',
    demos: [
      {
        t: 'With colour and a cap',
        el: () => (
          <div style={{ width: 340 }}>
            <MultiSelect
              label="Holdings"
              hint="Up to 4"
              max={4}
              options={[
                { value: 'SPY', label: 'SPY', color: 'var(--screen-yellow)' },
                { value: 'QQQ', label: 'QQQ', color: 'var(--screen-blue)' },
                { value: 'TLT', label: 'TLT', color: 'var(--screen-green)' },
                'GLD',
                'BIL',
                'VNQ',
              ]}
              defaultValue={['SPY', 'QQQ']}
            />
          </div>
        ),
        code: `const [holdings, setHoldings] = useState(['SPY', 'QQQ']);\n\n<MultiSelect label="Holdings" hint="Up to 4" max={4} value={holdings} onChange={setHoldings}\n  options={[\n    { value: 'SPY', label: 'SPY', color: 'var(--screen-yellow)' },\n    { value: 'QQQ', label: 'QQQ', color: 'var(--screen-blue)' },\n    'TLT', 'GLD', 'BIL'\n  ]} />`,
      },
      {
        t: 'Empty and error',
        el: () => (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
              gap: 16,
              width: '100%',
            }}
          >
            <MultiSelect label="Tags" options={['Momentum', 'Defensive', 'Income']} placeholder="Add tags" />
            <MultiSelect label="Recipients" options={['Ines', 'Marek', 'Sana']} error="Pick at least one" />
          </div>
        ),
        code: `<MultiSelect label="Tags" options={['Momentum', 'Defensive', 'Income']} placeholder="Add tags" />\n<MultiSelect label="Recipients" options={['Ines', 'Marek', 'Sana']} error="Pick at least one" />`,
      },
    ],
    props: [
      ['options', 'Array<string | { value, label, color?, hint? }>', 'required', ''],
      ['value', 'string[]', '[]', 'Controlled with onChange; or pass defaultValue / defaultChecked.'],
      ['label', 'string | ReactNode', '—', 'Printed under the field.'],
      ['hint', 'string', '—', ''],
      ['error', 'string', '—', ''],
      ['placeholder', 'string', "'Choose'", ''],
      ['max', 'number', '—', 'Caps the picks and disables the rest.'],
      ['searchable', 'boolean', 'true', 'Type to filter.'],
      ['size', "'s' | 'm' | 'l'", "'m'", ''],
      ['disabled', 'boolean', 'false', ''],
    ],
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    group: 'Forms',
    desc: 'Independent on/off choices in a list. For a setting that applies immediately, use Switch.',
    demos: [
      {
        t: 'Checkbox',
        el: () => (
          <div style={row}>
            <Checkbox label="Include dividends" defaultChecked />
            <Checkbox label="Fees" />
            <Checkbox label="Locked" disabled />
          </div>
        ),
        code: `const [dividends, setDividends] = useState(true);\n\n<Checkbox label="Include dividends" checked={dividends} onChange={setDividends} />\n<Checkbox label="Fees" />\n<Checkbox label="Locked" disabled />`,
      },
    ],
    props: [
      ['checked', 'boolean', 'false', 'Controlled with onChange; or pass defaultValue / defaultChecked.'],
      ['label', 'string | ReactNode', '—', ''],
      ['disabled', 'boolean', 'false', ''],
    ],
  },
  {
    id: 'radio',
    name: 'Radio',
    group: 'Forms',
    desc: 'One choice from a short visible list.',
    demos: [
      {
        t: 'Row',
        el: () => (
          <Radio direction="row" options={['Weekly', 'Monthly', 'Quarterly']} defaultValue="Monthly" />
        ),
        code: `<Radio direction="row" options={['Weekly', 'Monthly', 'Quarterly']} value={rebalance} onChange={setRebalance} />`,
      },
    ],
    props: [
      ['options', 'Array<string | { value, label }>', 'required', ''],
      ['value', 'string', '—', 'Controlled with onChange; or pass defaultValue / defaultChecked.'],
      ['name', 'string', 'auto', ''],
      ['direction', "'row' | 'column'", "'column'", ''],
    ],
  },
  {
    id: 'switch',
    name: 'Switch',
    group: 'Forms',
    desc: 'A slide switch for settings that take effect at once. The label sits beside it.',
    demos: [
      {
        t: 'Switch',
        el: () => <SwitchDemo />,
        code: `const [rebalance, setRebalance] = useState(true);\n\n<Switch label="Rebalance" led={false} checked={rebalance} onChange={setRebalance} />`,
      },
    ],
    props: [
      ['checked', 'boolean', 'false', 'Controlled with onChange; or pass defaultValue / defaultChecked.'],
      ['label', 'string | ReactNode', '—', ''],
      ['led', 'boolean', 'true', 'Status light beside the switch.'],
      ['disabled', 'boolean', 'false', ''],
    ],
  },
  {
    id: 'slider',
    name: 'Slider',
    group: 'Forms',
    desc: 'A fader for continuous values. The current value is printed beside the label. There are no rotary knobs in Andeus Design.',
    demos: [
      {
        t: 'Fader',
        el: () => <SliderDemo />,
        code: `const [lookback, setLookback] = useState(200);\n\n<Slider label="Lookback" min={20} max={400} step={10}\n  value={lookback} onChange={setLookback} format={(v) => v + 'd'} width={280} />`,
      },
    ],
    props: [
      ['value', 'number', '0.5', 'Controlled with onChange; or pass defaultValue / defaultChecked.'],
      ['min', 'number', '0', ''],
      ['max', 'number', '1', ''],
      ['step', 'number', '—', 'Snaps when set.'],
      ['label', 'string', '—', ''],
      ['format', '(v: number) => string', '—', 'Formats the printed value.'],
      ['width', 'number | string', '200', ''],
    ],
  },
  {
    id: 'segmented',
    name: 'Segmented',
    group: 'Forms',
    desc: 'A row of latched keys for two to four mutually exclusive options. Accepts text or icons.',
    demos: [
      {
        t: 'Text and icons',
        el: () => (
          <div style={row}>
            <Segmented options={['7d', '30d', '90d']} defaultValue="30d" />
            <Segmented
              size="s"
              options={[
                { value: 'list', icon: 'list' },
                { value: 'grid', icon: 'grid' },
              ]}
              defaultValue="list"
              label="View"
            />
          </div>
        ),
        code: `<Segmented options={['7d', '30d', '90d']} value={range} onChange={setRange} />\n<Segmented size="s" label="View" value={view} onChange={setView}\n  options={[{ value: 'list', icon: 'list' }, { value: 'grid', icon: 'grid' }]} />`,
      },
    ],
    props: [
      ['options', 'Array<string | { value, label?, icon? }>', 'required', ''],
      ['value', 'string', 'first option', 'Controlled with onChange; or pass defaultValue / defaultChecked.'],
      ['size', "'s' | 'm'", "'m'", ''],
      ['label', 'string', '—', 'Printed under the control.'],
    ],
  },
  {
    id: 'badge',
    name: 'Badge',
    group: 'Feedback',
    desc: 'A short status. Add an LED for live state.',
    demos: [
      {
        t: 'Tones',
        el: () => (
          <div style={row}>
            <Badge>Draft</Badge>
            <Badge tone="ink">v2</Badge>
            <Badge tone="accent">New</Badge>
            <Badge tone="positive" led>
              Live
            </Badge>
            <Badge tone="negative" led>
              Stopped
            </Badge>
          </div>
        ),
        code: `<Badge>Draft</Badge>\n<Badge tone="accent">New</Badge>\n<Badge tone="positive" led>Live</Badge>\n<Badge tone="negative" led>Stopped</Badge>`,
      },
    ],
    props: [
      ['tone', "'neutral' | 'ink' | 'accent' | 'positive' | 'negative'", "'neutral'", ''],
      ['led', 'boolean', 'false', 'Shows a status light.'],
      ['children', 'ReactNode', '—', ''],
    ],
  },
  {
    id: 'tag',
    name: 'Tag',
    group: 'Feedback',
    desc: 'A label for an object, such as a ticker or category. A colour square ties it to a chart line.',
    demos: [
      {
        t: 'Tags',
        el: () => (
          <div style={row}>
            <Tag>Research</Tag>
            <Tag color="var(--screen-blue)">QQQ</Tag>
            <Tag color="var(--screen-yellow)" onRemove={() => {}}>
              SPY
            </Tag>
          </div>
        ),
        code: `<Tag>Research</Tag>\n<Tag color="var(--screen-blue)">QQQ</Tag>\n<Tag color="var(--screen-yellow)" onremove={() => remove('SPY')}>SPY</Tag>`,
      },
    ],
    props: [
      ['color', 'string', '—', 'Colour square before the text.'],
      ['onRemove', '() => void', '—', 'Shows a remove key.'],
      ['children', 'ReactNode', '—', ''],
    ],
  },
  {
    id: 'toast',
    name: 'Toast',
    group: 'Feedback',
    desc: 'One quiet confirmation after an action, with an optional undo. Uses liquid glass because it floats over content.',
    demos: [
      {
        t: 'Toast',
        el: () => <ToastDemo />,
        code: `<Toast tone="positive" icon="check" action="Undo" onaction={undo} onclose={dismiss}>\n  Strategy saved.\n</Toast>`,
      },
    ],
    props: [
      ['tone', "'neutral' | 'positive' | 'negative' | 'accent'", "'neutral'", ''],
      ['icon', 'IconName', '—', ''],
      ['title', 'string', '—', ''],
      ['action', 'string', '—', 'Label for the action key.'],
      ['onAction', '() => void', '—', ''],
      ['onClose', '() => void', '—', ''],
      ['children', 'ReactNode', '—', ''],
    ],
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    group: 'Feedback',
    desc: 'A short explanation on hover or focus. Never put essential information only in a tooltip.',
    demos: [
      {
        t: 'Tooltip',
        el: () => (
          <div style={{ ...row, paddingTop: 40 }}>
            <Tooltip content="Measured from the last peak">
              <Button variant="ghost" icon="info-box">
                Max drawdown
              </Button>
            </Tooltip>
          </div>
        ),
        code: `<Tooltip content="Measured from the last peak">\n  <Button variant="ghost" icon="info-box">Max drawdown</Button>\n</Tooltip>`,
      },
    ],
    props: [
      ['content', 'string | ReactNode', 'required', ''],
      ['placement', "'top' | 'bottom'", "'top'", ''],
      ['children', 'ReactNode', 'required', 'The trigger.'],
    ],
  },
  {
    id: 'card',
    name: 'Card',
    group: 'Surfaces',
    desc: 'A raised panel with a title and a printed label. Inset and outline variants sit lower.',
    demos: [
      {
        t: 'Variants',
        el: () => (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))',
              gap: 16,
              width: '100%',
            }}
          >
            <Card title="Raised" label="Default">
              Content
            </Card>
            <Card title="Inset" label="Recessed" variant="inset">
              Content
            </Card>
            <Card title="Outline" label="Flat" variant="outline">
              Content
            </Card>
          </div>
        ),
        code: `<Card title="Raised" label="Default">Content</Card>\n<Card title="Inset" label="Recessed" variant="inset">Content</Card>\n<Card title="Outline" label="Flat" variant="outline">Content</Card>`,
      },
    ],
    props: [
      ['title', 'string | ReactNode', '—', ''],
      ['label', 'string | ReactNode', '—', 'Printed under the card.'],
      ['action', 'ReactNode', '—', 'Top-right slot.'],
      ['variant', "'raised' | 'inset' | 'outline'", "'raised'", ''],
      ['padding', 'number | string', '16', ''],
      ['children', 'ReactNode', '—', ''],
    ],
  },
  {
    id: 'window',
    name: 'Window',
    group: 'Surfaces',
    desc: 'A desktop window with a striped title bar, optional toolbar and footer.',
    demos: [
      {
        t: 'Window',
        el: () => (
          <div style={{ width: '100%' }}>
            <Window
              title="Trend follower"
              toolbar={
                <div style={row}>
                  <Button size="s" icon="play">
                    Run
                  </Button>
                </div>
              }
              footer={<span>Saved</span>}
            >
              <div style={{ padding: 20 }}>Body</div>
            </Window>
          </div>
        ),
        code: `<Window\n  title="Trend follower"\n  toolbar={<Button size="s" icon="play">Run</Button>}\n  footer="Saved"\n>\n  <div className="body">Body</div>\n</Window>`,
      },
    ],
    props: [
      ['title', 'string | ReactNode', 'required', ''],
      ['active', 'boolean', 'true', 'Inactive windows lose their stripes.'],
      ['onClose', '() => void', '—', 'Shows the close box.'],
      ['toolbar', 'ReactNode', '—', ''],
      ['footer', 'ReactNode', '—', ''],
      ['width', 'number | string', '—', ''],
      ['height', 'number | string', '—', ''],
      ['children', 'ReactNode', '—', ''],
    ],
  },
  {
    id: 'dialog',
    name: 'Dialog',
    group: 'Surfaces',
    desc: 'A modal question with two answers. The safe answer is ghost; the one Return triggers has the default ring.',
    demos: [
      {
        t: 'Dialog',
        el: () => <DialogDemo />,
        code: `const [open, setOpen] = useState(false);\n\n<Button onClick={() => setOpen(true)}>Delete strategy</Button>\n<Dialog\n  open={open}\n  onClose={() => setOpen(false)}\n  title="Delete this strategy?"\n  icon="warning-box"\n  actions={<>\n    <Button variant="ghost" onClick={() => setOpen(false)}>Not yet</Button>\n    <Button isDefault onClick={remove}>Delete</Button>\n  </>}\n>\n  Backtests stay in the archive for 30 days.\n</Dialog>`,
      },
    ],
    props: [
      ['open', 'boolean', 'true', 'Render or hide; pair with onClose.'],
      ['title', 'string | ReactNode', 'required', ''],
      ['icon', 'IconName', '—', ''],
      ['actions', 'ReactNode', '—', ''],
      ['onClose', '() => void', '—', 'Escape and backdrop click.'],
      ['width', 'number | string', '420', ''],
      ['inline', 'boolean', 'false', 'Render in place, without backdrop.'],
      ['children', 'ReactNode', '—', ''],
    ],
  },
  {
    id: 'screen',
    name: 'Screen',
    group: 'Surfaces',
    desc: 'A small live display set into the surface. One job per screen. Lit elements are flat colour, never glowing.',
    demos: [
      {
        t: 'Screen',
        el: () => (
          <Screen label="Yearly return" width={280} padding={16}>
            <Metric onScreen value="14.2%" label="Strategy" delta="vs 10.1%" color="var(--screen-blue)" />
          </Screen>
        ),
        code: `<Screen label="Yearly return" width={280} padding={16}>\n  <Metric onScreen value="14.2%" label="Strategy" delta="vs 10.1%" color="var(--screen-blue)" />\n</Screen>`,
      },
    ],
    props: [
      ['label', 'string', '—', 'Printed under the bezel.'],
      ['width', 'number | string', '—', ''],
      ['height', 'number | string', '—', ''],
      ['padding', 'number | string', '12', ''],
      ['children', 'ReactNode', '—', ''],
    ],
  },
  {
    id: 'tabs',
    name: 'Tabs',
    group: 'Surfaces',
    desc: 'Switch between views of the same object. Counts are optional.',
    demos: [
      {
        t: 'Tabs',
        el: () => (
          <Tabs
            tabs={['Logic', 'Backtest', { value: 'runs', label: 'Runs', count: 12 }]}
            defaultValue="Logic"
          />
        ),
        code: `<Tabs value={tab} onChange={setTab} tabs={['Logic', 'Backtest', { value: 'runs', label: 'Runs', count: 12 }]} />`,
      },
    ],
    props: [
      ['tabs', 'Array<string | { value, label, count? }>', 'required', ''],
      ['value', 'string', 'first tab', 'Controlled with onChange; or pass defaultValue / defaultChecked.'],
    ],
  },
  {
    id: 'labeled',
    name: 'Labeled',
    group: 'Layout',
    desc: 'Prints a label under any control, the way a Braun panel does.',
    demos: [
      {
        t: 'Labeled',
        el: () => (
          <div style={{ ...row, gap: 24 }}>
            <Labeled label="Reset">
              <IconButton round icon="reload" label="Reset" />
            </Labeled>
            <Labeled label="Power" sub="On">
              <Switch defaultChecked />
            </Labeled>
          </div>
        ),
        code: `<Labeled label="Reset">\n  <IconButton round icon="reload" label="Reset" />\n</Labeled>\n<Labeled label="Power" sub="On">\n  <Switch checked />\n</Labeled>`,
      },
    ],
    props: [
      ['label', 'string | ReactNode', 'required', ''],
      ['sub', 'string | ReactNode', '—', 'Second line.'],
      ['align', "'start' | 'center' | 'end'", "'center'", ''],
      ['children', 'ReactNode', 'required', ''],
    ],
  },
  {
    id: 'icon',
    name: 'Icon',
    group: 'Layout',
    desc: 'A 1-bit pixel icon drawn on a 24-pixel grid. See Foundations › Icons for the full set.',
    demos: [
      {
        t: 'Sizes',
        el: () => (
          <div style={{ ...row, gap: 20 }}>
            <Icon name="folder" size={16} />
            <Icon name="folder" size={24} />
            <Icon name="folder" size={48} />
            <Icon name="warning-box" size={48} color="var(--signal-orange)" />
          </div>
        ),
        code: `<Icon name="folder" size={16} />\n<Icon name="folder" size={24} />\n<Icon name="warning-box" size={48} color="var(--signal-orange)" />`,
      },
    ],
    props: [
      ['name', 'IconName', 'required', ''],
      ['size', 'number', '24', 'Multiples of 8 stay crisp.'],
      ['color', 'string', 'currentColor', ''],
      ['title', 'string', '—', 'Makes the icon announced.'],
    ],
  },
  {
    id: 'chart',
    name: 'Chart',
    group: 'Data',
    desc: 'Any series on a live screen: stepped line, smooth line or grouped bars. Legend with a readout per series, hover cursor, optional band strip and a printed scale.',
    demos: [
      {
        t: 'Step (default)',
        el: () => (
          <div style={{ width: '100%' }}>
            <Chart height={220} startLabel="Jan" endLabel="Dec" label="Revenue, this year against last" />
          </div>
        ),
        code: `<Chart startLabel="Jan" endLabel="Dec" label="Revenue, this year against last"\n  series={[\n    { label: 'This year', values: thisYear },\n    { label: 'Last year', values: lastYear }\n  ]} />`,
      },
      {
        t: 'Bars',
        el: () => (
          <div style={{ width: '100%' }}>
            <Chart
              type="bar"
              height={200}
              summary="last"
              startLabel="Mon"
              endLabel="Sun"
              cursorLabel={(i) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
              series={[
                { label: 'Visitors', values: [42, 51, 47, 60, 58, 31, 28] },
                { label: 'Sign-ups', values: [12, 15, 11, 19, 17, 8, 6] },
              ]}
            />
          </div>
        ),
        code: `<Chart type="bar" summary="last" startLabel="Mon" endLabel="Sun"\n  cursorLabel={(i) => days[i]}\n  series={[{ label: 'Visitors', values: visitors }, { label: 'Sign-ups', values: signups }]} />`,
      },
      {
        t: 'With a band',
        el: () => (
          <div style={{ width: '100%' }}>
            <Chart
              height={220}
              band={{
                values: Array.from({ length: 120 }, (_, i) => Math.max(0, Math.sin(i / 7)) * (i % 11)),
                label: 'Errors',
              }}
              series={[
                {
                  label: 'Requests',
                  values: Array.from({ length: 120 }, (_, i) => 200 + Math.sin(i / 9) * 60 + i),
                  color: 'var(--screen-green)',
                },
              ]}
              summary="last"
              startLabel="00:00"
              endLabel="Now"
            />
          </div>
        ),
        code: `<Chart summary="last" startLabel="00:00" endLabel="Now"\n  series={[{ label: 'Requests', values: requests, color: 'var(--screen-green)' }]}\n  band={{ values: errors, label: 'Errors' }} />`,
      },
    ],
    props: [
      [
        'series',
        'Array<{ label, values: number[], color? }>',
        'sample',
        'Colours cycle blue, yellow, green, orange, red.',
      ],
      ['type', "'step' | 'line' | 'bar'", "'step'", ''],
      ['band', '{ values, label?, color? }', '—', 'Strip along the bottom.'],
      ['summary', "'change' | 'last' | 'none'", "'change'", 'Legend readout.'],
      ['format', '(v: number) => string', '—', "For summary 'last'."],
      ['cursorLabel', '(i: number) => string', '—', 'Top-right while hovering.'],
      ['startLabel', 'string', '—', ''],
      ['endLabel', 'string', '—', ''],
      ['height', 'number', '240', ''],
      ['scale', 'boolean', 'true', 'Printed ticks under the bezel.'],
      ['grid', 'boolean', 'true', ''],
      ['label', 'string', '—', 'Caption.'],
    ],
  },
  {
    id: 'metric',
    name: 'Metric',
    group: 'Data',
    desc: 'One number with its label underneath. Set onScreen inside a Screen; color matches a Chart series.',
    demos: [
      {
        t: 'On paper and on screen',
        el: () => (
          <div style={{ ...row, gap: 32 }}>
            <Metric value="12,804" label="Visitors" delta="+8%" tone="positive" />
            <Metric value="−4" label="Errors" tone="negative" />
            <Metric value="21.5°" label="Target" tone="accent" />
            <Screen padding={14}>
              <Metric onScreen value="1.21" label="Sharpe" color="var(--screen-yellow)" />
            </Screen>
          </div>
        ),
        code: `<Metric value="12,804" label="Visitors" delta="+8%" tone="positive" />\n<Metric value="−4" label="Errors" tone="negative" />\n<Screen>\n  <Metric onScreen value="1.21" label="Sharpe" color="var(--screen-yellow)" />\n</Screen>`,
      },
    ],
    props: [
      ['value', 'string | ReactNode', 'required', ''],
      ['label', 'string | ReactNode', 'required', ''],
      ['delta', 'string | ReactNode', '—', ''],
      ['tone', "'neutral' | 'positive' | 'negative' | 'accent'", "'neutral'", ''],
      ['color', 'string', '—', 'Overrides the value colour.'],
      ['onScreen', 'boolean', 'false', 'Screen colours.'],
      ['size', "'s' | 'm' | 'l'", "'m'", ''],
      ['align', "'start' | 'center'", "'start'", ''],
    ],
  },
  {
    id: 'block',
    name: 'Block',
    group: 'Data',
    desc: 'Logic people can read out loud: trading rules, automations, workflows, alerts. A keyword tab, a sentence, an optional value. Blocks nest; Token marks the parts that change.',
    demos: [
      {
        t: 'Automation',
        el: () => (
          <div style={{ width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Block
              keyword="When"
              tone="ink"
              summary={
                <span>
                  A file lands in <Token kind="entity">Inbox</Token>
                </span>
              }
            >
              <Block
                keyword="If"
                summary={
                  <span>
                    It is a <Token>PDF</Token>
                  </span>
                }
                selected
              >
                <Block
                  keyword="Then"
                  tone="accent"
                  summary={
                    <span>
                      Move it to{' '}
                      <Token kind="entity" color="var(--screen-blue)">
                        Invoices
                      </Token>
                    </span>
                  }
                />
              </Block>
              <Block keyword="Else" tone="muted" summary="Leave it" />
            </Block>
            <Block
              keyword="Until"
              tone="grey"
              summary={
                <span>
                  It is older than <Token>30 days</Token>
                </span>
              }
            />
          </div>
        ),
        code: `<Block keyword="When" tone="ink" summary={<>A file lands in <Token kind="entity">Inbox</Token></>}>\n  <Block keyword="If" selected summary={<>It is a <Token>PDF</Token></>}>\n    <Block keyword="Then" tone="accent" summary={<>Move it to <Token kind="entity">Invoices</Token></>} />\n  </Block>\n  <Block keyword="Else" tone="muted" summary="Leave it" />\n</Block>`,
      },
      {
        t: 'Trading rule',
        el: () => (
          <div style={{ width: '100%', maxWidth: 520 }}>
            <Block
              keyword="If"
              summary={
                <span>
                  <Token kind="entity" color="var(--screen-yellow)">
                    SPY
                  </Token>{' '}
                  is above its <Token>200-day</Token> average
                </span>
              }
            >
              <Block
                keyword="Then"
                tone="accent"
                summary={
                  <span>
                    Hold{' '}
                    <Token kind="entity" color="var(--screen-blue)">
                      QQQ
                    </Token>
                  </span>
                }
                aside="60%"
              />
            </Block>
          </div>
        ),
        code: `<Block\n  keyword="If"\n  summary={<>\n    <Token kind="entity" color="var(--screen-yellow)">SPY</Token> is above its <Token>200-day</Token> average\n  </>}\n>\n  <Block keyword="Then" tone="accent" aside="60%" summary={<>Hold <Token kind="entity">QQQ</Token></>} />\n</Block>`,
      },
    ],
    props: [
      ['keyword', 'string', "'If'", 'One word, sentence case.'],
      [
        'tone',
        "'ink' | 'plain' | 'muted' | 'accent' | 'grey'",
        "'plain'",
        'Trigger, condition, fallback, action, exit.',
      ],
      ['summary', 'string | ReactNode', 'required', ''],
      ['aside', 'string | ReactNode', '—', 'Right-hand value.'],
      ['selected', 'boolean', 'false', ''],
      ['collapsed', 'boolean', 'false', ''],
      ['onToggle', '() => void', '—', ''],
      ['children', 'ReactNode', '—', 'Nested blocks.'],
    ],
  },
  {
    id: 'music-player',
    name: 'MusicPlayer',
    group: 'Media',
    desc: 'A player built like a small instrument: one screen with title, big time, segmented progress and a level meter; three labelled keys; a repeat key and a volume fader. Without src it simulates playback, so mocks work.',
    demos: [
      {
        t: 'Full',
        el: () => (
          <div style={{ width: '100%', maxWidth: 620 }}>
            <MusicPlayer defaultIndex={2} />
          </div>
        ),
        code: `<script>\n  const tracks = [\n    { title: 'Platinum hours', artist: 'Halden Ensemble', src: '/audio/01.mp3', color: 'var(--screen-orange)' },\n    { title: 'Less, but better', artist: 'Ines Okafor', src: '/audio/02.mp3', color: 'var(--screen-blue)' }\n  ];\n</script>\n\n<MusicPlayer {tracks} ontrackchange={(i, t) => console.log(t.title)} />`,
      },
      {
        t: 'Compact',
        el: () => (
          <div style={{ width: '100%', maxWidth: 560 }}>
            <MusicPlayer variant="compact" defaultIndex={1} />
          </div>
        ),
        code: `<MusicPlayer {tracks} variant="compact" />`,
      },
      {
        t: 'Deck',
        el: () => (
          <div style={{ width: '100%', maxWidth: 620 }}>
            <MusicPlayer variant="deck" defaultIndex={2} />
          </div>
        ),
        code: `<MusicPlayer {tracks} variant="deck" title="Andeus player" />`,
      },
      {
        t: 'Mini',
        el: () => (
          <div style={{ width: '100%', maxWidth: 520 }}>
            <MusicPlayer variant="mini" />
          </div>
        ),
        code: `<MusicPlayer {tracks} variant="mini" />`,
      },
    ],
    props: [
      [
        'tracks',
        'Array<{ title, artist?, duration?, src?, color? }>',
        'sample',
        'color tints the screen for that track.',
      ],
      ['defaultIndex', 'number', '0', ''],
      ['autoPlay', 'boolean', 'false', ''],
      ['showPlaylist', 'boolean', 'true', 'Full and deck.'],
      [
        'variant',
        "'full' | 'compact' | 'deck' | 'mini'",
        "'full'",
        'Deck: main, equalizer and playlist windows. Mini: one-line strip.',
      ],
      ['title', 'string', "'Andeus player'", 'Deck title bar.'],
      ['showEqualizer', 'boolean', 'true', 'Deck only.'],
      ['onTrackChange', '(index, track) => void', '—', ''],
      ['width', 'number | string', '—', ''],
    ],
  },
];

export { C as DOC_COMPONENTS };

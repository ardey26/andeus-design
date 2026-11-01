import React from 'react';
import { ShowHero } from './hero';
import { HardwareRoom } from './hardware';
import { FloorPlan, Parts } from './floor';
import { InvestRoom, StudioRoom, HomeRoom, InboxRoom } from './rooms-a';
import { CalendarRoom, FilesRoom, AnalyticsRoom, HealthRoom } from './rooms-b';
import { ShopRoom, SettingsRoom, WriterRoom } from './rooms-c';

const ROOM_COMPONENTS = {
  InvestRoom,
  StudioRoom,
  HomeRoom,
  InboxRoom,
  CalendarRoom,
  FilesRoom,
  AnalyticsRoom,
  HealthRoom,
  ShopRoom,
  SettingsRoom,
  WriterRoom,
  HardwareRoom,
};
import { Button, Icon, Badge, Screen, Switch, Slider, Labeled, IconButton } from '@andeus/ui';

const ROOMS = [
  {
    id: 'invest',
    name: 'Invest',
    kind: 'Fintech & trading',
    icon: 'trending-up',
    C: 'InvestRoom',
    line: 'Rules you can read out loud, tested against the market.',
    parts: ['Window', 'Block', 'Token', 'Chart', 'Metric', 'Badge', 'Button'],
  },
  {
    id: 'studio',
    name: 'Studio',
    kind: 'Music & creative tools',
    icon: 'zap',
    C: 'StudioRoom',
    line: 'A step sequencer. Press play, then press the keys.',
    parts: ['Screen', 'Slider', 'Button', 'Segmented'],
  },
  {
    id: 'home',
    name: 'Home',
    kind: 'Smart home & IoT',
    icon: 'home',
    C: 'HomeRoom',
    line: 'Lights, heat and the front door, each on its own card.',
    parts: [
      'Card',
      'Switch',
      'Slider',
      'IconButton',
      'Labeled',
      'Screen',
      'Segmented',
      'Badge',
      'Icon',
      'Button',
    ],
  },
  {
    id: 'inbox',
    name: 'Inbox',
    kind: 'Email & messaging',
    icon: 'list',
    C: 'InboxRoom',
    line: 'Read a message, reply, and get one quiet confirmation.',
    parts: ['Window', 'Input', 'IconButton', 'Button', 'Toast'],
  },
  {
    id: 'calendar',
    name: 'Calendar',
    kind: 'Scheduling',
    icon: 'calendar',
    C: 'CalendarRoom',
    line: 'A working week. Click an event to see its time.',
    parts: ['Window', 'Segmented', 'IconButton', 'Button'],
  },
  {
    id: 'files',
    name: 'Files',
    kind: 'Storage & admin',
    icon: 'folder',
    C: 'FilesRoom',
    line: 'Pick some files and delete them. It asks first.',
    parts: ['Window', 'Checkbox', 'Icon', 'Segmented', 'IconButton', 'Button', 'Dialog'],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    kind: 'Dashboards',
    icon: 'chart-bar',
    C: 'AnalyticsRoom',
    line: 'One screen, three keys. Pick a number, switch the range, hover the dots.',
    parts: ['Screen', 'Metric', 'IconButton', 'Segmented', 'Labeled'],
  },
  {
    id: 'health',
    name: 'Health',
    kind: 'Fitness & habits',
    icon: 'clock',
    C: 'HealthRoom',
    line: 'A step goal on a fader, and four habits to tick off.',
    parts: ['Screen', 'Metric', 'Slider', 'Card', 'Checkbox'],
  },
  {
    id: 'shop',
    name: 'Shop',
    kind: 'E-commerce',
    icon: 'coin',
    C: 'ShopRoom',
    line: 'Change a quantity or the shipping, then pay.',
    parts: ['Window', 'Input', 'Tag', 'Radio', 'Tooltip', 'Badge', 'Button'],
  },
  {
    id: 'settings',
    name: 'Settings',
    kind: 'Preferences & SaaS admin',
    icon: 'sliders',
    C: 'SettingsRoom',
    line: 'Every control a preferences pane needs, and a clear save.',
    parts: ['Window', 'Tabs', 'Select', 'Radio', 'Switch', 'Checkbox', 'IconButton', 'Button'],
  },
  {
    id: 'writer',
    name: 'Notes',
    kind: 'Writing & documents',
    icon: 'edit',
    C: 'WriterRoom',
    line: 'A quiet page with a live word count. Type into it.',
    parts: ['Window', 'IconButton', 'Screen', 'Tag', 'Badge'],
  },
  {
    id: 'hardware',
    name: 'Hardware',
    kind: 'Industrial & product design',
    icon: 'layout',
    C: 'HardwareRoom',
    line: 'A pocket sequencer drawn with the same tokens. Type a tempo, press Enter, then Play.',
    parts: ['Segmented', 'Icon'],
  },
];
const ALL = [
  'Button',
  'IconButton',
  'Icon',
  'Labeled',
  'Input',
  'Select',
  'Checkbox',
  'Radio',
  'Switch',
  'Slider',
  'Segmented',
  'Badge',
  'Tag',
  'Toast',
  'Tooltip',
  'Window',
  'Card',
  'Dialog',
  'Screen',
  'Tabs',
  'Block',
  'Token',
  'Chart',
  'Metric',
];
const SR_ONLY = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
};
const nn = (i) => String(i + 1).padStart(2, '0');
const go = (id) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 40, behavior: 'smooth' });
};

function MenuBar() {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: 32,
        background: 'var(--glass-light)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        boxShadow: 'var(--glass-edge)',
        borderBottom: '1px solid rgba(27,26,24,.3)',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '0 20px',
        fontSize: 13,
      }}
    >
      <b style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>Andeus Design</b>
      <nav style={{ display: 'flex', gap: 16 }}>
        <a className="sc-nav" onClick={() => go('rooms')}>
          Rooms
        </a>
        <a className="sc-nav" onClick={() => go('parts')}>
          Parts
        </a>
        <a className="sc-nav" onClick={() => go('kit')}>
          Get the kit
        </a>
        <a className="sc-nav" href="../docs/index.html">
          Docs
        </a>
      </nav>
      <div style={{ flex: 1 }}></div>
      <span style={{ color: 'var(--text-2)' }}>andeus.design</span>
    </header>
  );
}

function Hero() {
  const H = ShowHero;
  return H ? <H go={go} count={ALL.length} rooms={ROOMS.length} /> : null;
}

function Room({ r, i }) {
  const C = ROOM_COMPONENTS[r.C];
  const inner = C ? <C /> : null;
  return (
    <section id={r.id} className="sc-room" data-screen-label={nn(i) + ' ' + r.name}>
      <h2 className="sc-giant" style={{ textAlign: i % 2 ? 'right' : 'left' }}>
        <span aria-hidden="true" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {nn(i)}
        </span>{' '}
        {r.name}
        <span style={SR_ONLY}> — {r.kind}</span>
      </h2>
      <div className="sc-exhibit">{inner}</div>
    </section>
  );
}

function Kit() {
  return (
    <section
      id="kit"
      style={{ background: 'var(--surface-ink)', color: 'var(--text-on-ink)' }}
      data-screen-label="Get the kit"
    >
      <div
        className="sc-wrap"
        style={{
          paddingTop: 96,
          paddingBottom: 64,
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)',
          gap: 48,
          alignItems: 'end',
        }}
      >
        <div>
          <h2
            style={{
              font: 'var(--type-display)',
              fontSize: 'clamp(40px,5vw,64px)',
              letterSpacing: 'var(--tracking-display)',
              margin: 0,
              textWrap: 'balance',
            }}
          >
            Take the box home.
          </h2>
          <p
            style={{
              color: 'var(--platinum-300)',
              fontSize: 18,
              maxWidth: 520,
              margin: '20px 0 0',
              textWrap: 'pretty',
            }}
          >
            Tokens, one typeface, a 1-bit icon set and {ALL.length} React components. Build the thirteenth
            room yourself.
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Button variant="primary" size="l" isDefault icon="download">
            Get the kit
          </Button>
          <Button variant="secondary" size="l" onClick={() => go('rooms')}>
            Back to the rooms
          </Button>
        </div>
      </div>
      <div
        className="sc-wrap"
        style={{
          borderTop: '1px solid var(--platinum-700)',
          padding: '20px 0 28px',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 16,
          fontSize: 13,
          color: 'var(--platinum-400)',
          flexWrap: 'wrap',
        }}
      >
        <span>
          <b style={{ color: 'var(--text-on-ink)', fontWeight: 600 }}>Andeus Design</b> · andeus.design
        </span>
        <span>Less, but better.</span>
      </div>
    </section>
  );
}

function Showcase() {
  return (
    <>
      <MenuBar />
      <Hero />
      <FloorPlan rooms={ROOMS} total={ALL.length} go={go} nn={nn} />
      {ROOMS.map((r, i) => (
        <Room key={r.id} r={r} i={i} />
      ))}
      <Parts rooms={ROOMS} all={ALL} go={go} nn={nn} />
      <Kit />
    </>
  );
}

export { Showcase };

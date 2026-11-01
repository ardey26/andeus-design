import React from 'react';
import { Icon } from '@andeus/ui';
import { Body, Plate, Lcd, Key, Led, Grille, Big, Tiny, Mark } from './hw-kit';

const row = (gap = 16, extra) => ({ display: 'flex', gap, alignItems: 'center', ...extra });
const col = (gap = 16, extra) => ({ display: 'flex', flexDirection: 'column', gap, ...extra });

/* ---------- P-1 Shop ---------- */
const ITEMS = [
  { n: 'Lamp', p: 189, tone: 'orange' },
  { n: 'Throw', p: 96, tone: 'yellow' },
  { n: 'Notebook', p: 14, tone: 'blue' },
];
function ShopRoom() {
  const [q, setQ] = React.useState([1, 2, 3]);
  const [it, setIt] = React.useState(0);
  const [buf, setBuf] = React.useState('');
  const [paid, setPaid] = React.useState(false);
  const total = q.reduce((a, v, i) => a + v * ITEMS[i].p, 0);
  const type = (d) => {
    setPaid(false);
    setBuf((b) => (b + d).slice(-2));
  };
  const enter = () => {
    if (buf === '') return;
    setQ((a) => a.map((v, i) => (i === it ? parseInt(buf, 10) : v)));
    setBuf('');
  };
  return (
    <Body>
      <div
        className="hw-cols"
        style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 22 }}
      >
        <div style={col(18)}>
          <Lcd style={{ ...col(12), padding: 26 }}>
            {ITEMS.map((x, i) => (
              <div
                key={x.n}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 70px 110px',
                  alignItems: 'baseline',
                  font: '300 26px/1.2 var(--font-display)',
                  color: i === it ? 'var(--screen-orange)' : 'var(--screen-ink)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                <span>{x.n}</span>
                <span>×{i === it && buf ? buf : q[i]}</span>
                <span style={{ textAlign: 'right' }}>${(q[i] * x.p).toLocaleString('en-US')}</span>
              </div>
            ))}
            <div
              style={{
                borderTop: '2px dashed var(--screen-grid)',
                marginTop: 6,
                paddingTop: 14,
                ...row(12, { justifyContent: 'space-between', alignItems: 'flex-end' }),
              }}
            >
              <Tiny color={paid ? 'var(--screen-green)' : 'var(--screen-ink)'}>
                {paid ? 'Paid · thank you' : 'Total'}
              </Tiny>
              <Big size={110} color={paid ? 'var(--screen-green)' : 'var(--screen-ink)'}>
                ${total.toLocaleString('en-US')}
              </Big>
            </div>
          </Lcd>
          <div style={row(16, { flexWrap: 'wrap' })}>
            {ITEMS.map((x, i) => (
              <div key={x.n} style={col(8, { alignItems: 'center' })}>
                <Led on={it === i} />
                <Key
                  tone={x.tone}
                  w={96}
                  h={64}
                  on={it === i}
                  onClick={() => {
                    setIt(i);
                    setBuf('');
                  }}
                  label={x.n}
                ></Key>
              </div>
            ))}
            <div style={{ flex: 1 }}></div>
            <Mark>P-1</Mark>
          </div>
        </div>
        <Plate
          style={{
            padding: 18,
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 12,
            alignContent: 'start',
          }}
        >
          {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((d) => (
            <Key key={d} tone="dark" w="100%" h={66} onClick={() => type(String(d))}>
              {d}
            </Key>
          ))}
          <Key tone="grey" w="100%" h={66} onClick={() => setBuf('')} aria="Clear">
            <span style={{ font: '500 15px/1 var(--font-sans)' }}>Clear</span>
          </Key>
          <Key tone="dark" w="100%" h={66} onClick={() => type('0')}>
            0
          </Key>
          <Key tone="light" w="100%" h={66} onClick={enter} aria="Enter">
            <span style={{ font: '500 15px/1 var(--font-sans)' }}>Enter</span>
          </Key>
          <div style={{ gridColumn: 'span 3' }}>
            <Key
              tone="green"
              w="100%"
              h={80}
              on={paid}
              onClick={() => {
                enter();
                setPaid(true);
              }}
              aria="Pay"
            >
              <span style={{ font: '300 30px/1 var(--font-display)' }}>Pay</span>
            </Key>
          </div>
        </Plate>
      </div>
    </Body>
  );
}

/* ---------- O-1 Settings ---------- */
function Slide({ on, onClick, label }) {
  return (
    <div style={col(12, { alignItems: 'center' })}>
      <button
        onClick={onClick}
        aria-label={label}
        style={{
          position: 'relative',
          width: 46,
          height: 120,
          borderRadius: 23,
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          background: 'var(--platinum-800)',
          boxShadow: 'inset 0 2px 5px rgba(0,0,0,.6)',
        }}
      >
        <i
          style={{
            position: 'absolute',
            left: 4,
            right: 4,
            height: 54,
            borderRadius: 19,
            top: on ? 4 : 62,
            background: 'linear-gradient(180deg,var(--platinum-50),var(--platinum-200))',
            boxShadow: 'inset 0 1px 0 #fff, 0 2px 0 rgba(0,0,0,.35)',
            transition: 'top var(--dur-move) var(--ease-detent)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <i
            style={{
              width: 18,
              height: 3,
              borderRadius: 2,
              background: on ? 'var(--signal-orange)' : 'var(--platinum-400)',
            }}
          ></i>
        </i>
      </button>
      <span style={{ font: '500 14px/1.2 var(--font-sans)', textAlign: 'center', maxWidth: 90 }}>
        {label}
      </span>
    </div>
  );
}
const LANGS = ['EN', 'DE', 'FR', 'NL'];
function SettingsRoom() {
  const [sw, setSw] = React.useState([true, false, true, true, false]);
  const [lang, setLang] = React.useState(0);
  const [dense, setDense] = React.useState(0);
  const [dirty, setDirty] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const touch = () => {
    setDirty(true);
    setSaved(false);
  };
  const NAMES = ['Start at login', 'Mentions', 'Daily summary', 'Sound', 'Banners'];
  return (
    <Body>
      <div
        className="hw-cols"
        style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 22, marginBottom: 22 }}
      >
        <Plate
          style={{
            padding: '26px 22px',
            ...row(18, { justifyContent: 'space-around', flexWrap: 'wrap', alignItems: 'flex-start' }),
          }}
        >
          {NAMES.map((n, i) => (
            <Slide
              key={n}
              on={sw[i]}
              label={n}
              onClick={() => {
                setSw((s) => s.map((v, j) => (j === i ? !v : v)));
                touch();
              }}
            />
          ))}
        </Plate>
        <Lcd style={{ ...col(14), justifyContent: 'space-between' }}>
          <Big size={110} color={dirty ? 'var(--screen-orange)' : 'var(--screen-green)'}>
            {sw.filter(Boolean).length}/5
          </Big>
          <Tiny>
            {LANGS[lang]} · {dense ? 'Compact' : 'Comfortable'}
          </Tiny>
          <Tiny color={dirty ? 'var(--screen-orange)' : 'var(--screen-green)'}>
            {dirty ? 'Unsaved' : saved ? 'Saved' : 'All saved'}
          </Tiny>
        </Lcd>
      </div>
      <div style={row(14, { flexWrap: 'wrap', alignItems: 'flex-end' })}>
        {LANGS.map((l, i) => (
          <div key={l} style={col(8, { alignItems: 'center' })}>
            <Led on={lang === i} />
            <Key
              w={64}
              h={56}
              on={lang === i}
              onClick={() => {
                setLang(i);
                touch();
              }}
              aria={l}
            >
              <span style={{ font: '300 22px/1 var(--font-display)' }}>{l}</span>
            </Key>
          </div>
        ))}
        <i style={{ width: 1, height: 60, background: 'var(--platinum-500)', margin: '0 8px' }}></i>
        {['Comfortable', 'Compact'].map((l, i) => (
          <div key={l} style={col(8, { alignItems: 'center' })}>
            <Led on={dense === i} color="var(--screen-blue)" />
            <Key
              tone="grey"
              w={64}
              h={56}
              on={dense === i}
              onClick={() => {
                setDense(i);
                touch();
              }}
              label={l}
            >
              <i
                style={{
                  width: 22,
                  height: i ? 16 : 22,
                  borderTop: '2px solid #fff',
                  borderBottom: '2px solid #fff',
                }}
              ></i>
            </Key>
          </div>
        ))}
        <div style={{ flex: 1 }}></div>
        <Key
          tone="orange"
          w={120}
          h={80}
          on={!dirty}
          onClick={() => {
            setDirty(false);
            setSaved(true);
          }}
          label="Save"
        >
          <Icon name="check" size={30} color="var(--text-on-signal)" />
        </Key>
        <Mark>O-1</Mark>
      </div>
    </Body>
  );
}

/* ---------- N-1 Notes ---------- */
const ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
function WriterRoom() {
  const [txt, setTxt] = React.useState('Fewer screens. Controls that say what they do.');
  const [shift, setShift] = React.useState(false);
  const [down, setDown] = React.useState(null);
  const press = (k) => {
    setDown(k);
    setTimeout(() => setDown((d) => (d === k ? null : d)), 120);
  };
  const type = (ch) => {
    setTxt((t) => (t + (shift ? ch.toUpperCase() : ch)).slice(-140));
    setShift(false);
    press(ch);
  };
  const onKey = (e) => {
    if (e.metaKey || e.ctrlKey) return;
    if (e.key === 'Backspace') {
      setTxt((t) => t.slice(0, -1));
      press('del');
      e.preventDefault();
    } else if (e.key === 'Enter') {
      setTxt((t) => t + ' / ');
      press('ret');
      e.preventDefault();
    } else if (e.key.length === 1) {
      setTxt((t) => (t + e.key).slice(-140));
      press(e.key.toLowerCase() === ' ' ? 'space' : e.key.toLowerCase());
      e.preventDefault();
    }
  };
  const words = (txt.trim().match(/\S+/g) || []).length;
  const K = (ch, w = '100%', tone = 'light', label, fn) => (
    <Key
      key={ch}
      tone={tone}
      w={w}
      h={60}
      on={down === ch}
      onClick={fn || (() => type(ch))}
      aria={label || ch}
    >
      <span style={{ font: label ? '500 15px/1 var(--font-sans)' : '300 24px/1 var(--font-display)' }}>
        {label || ch}
      </span>
    </Key>
  );
  return (
    <Body>
      <div tabIndex={0} data-typer onKeyDown={onKey} style={{ outline: 'none' }}>
        <div
          className="hw-cols"
          style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 170px', gap: 20, marginBottom: 22 }}
        >
          <Lcd style={{ padding: 28, minHeight: 170 }}>
            <span
              style={{
                font: '300 36px/1.25 var(--font-display)',
                color: 'var(--screen-ink)',
                wordBreak: 'break-word',
              }}
            >
              {txt}
              <i
                style={{
                  display: 'inline-block',
                  width: 3,
                  height: 36,
                  marginLeft: 3,
                  verticalAlign: 'text-bottom',
                  background: 'var(--screen-orange)',
                }}
              ></i>
            </span>
          </Lcd>
          <Plate style={{ padding: 18, ...col(10, { alignItems: 'center', justifyContent: 'center' }) }}>
            <Big size={88} color="var(--text-1)">
              {words}
            </Big>
            <span style={{ font: '500 14px/1 var(--font-sans)' }}>Words</span>
          </Plate>
        </div>
        <div style={col(10)}>
          {ROWS.map((r, ri) => (
            <div
              key={r}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${ri === 2 ? 10 : 10},minmax(0,1fr))`,
                gap: 10,
                paddingLeft: ri * 30,
              }}
            >
              {ri === 2
                ? K('shift', '100%', shift ? 'grey' : 'dark', 'Shift', () => setShift((s) => !s))
                : null}
              {r.split('').map((ch) => K(ch))}
              {ri === 1
                ? K('ret', '100%', 'orange', 'Return', () => {
                    setTxt((t) => t + ' / ');
                    press('ret');
                  })
                : null}
              {ri === 2
                ? K('del', '100%', 'dark', 'Delete', () => {
                    setTxt((t) => t.slice(0, -1));
                    press('del');
                  })
                : null}
            </div>
          ))}
          <div style={row(10)}>
            <div style={{ flex: 1 }}>{K('space', '100%', 'light', ' ', () => type(' '))}</div>
            <Mark style={{ marginLeft: 12 }}>N-1</Mark>
          </div>
        </div>
      </div>
    </Body>
  );
}

export { ShopRoom, SettingsRoom, WriterRoom };

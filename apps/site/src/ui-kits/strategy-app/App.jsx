import React from 'react';
import { Window, Tabs, Button, IconButton, Badge, Dialog, Toast } from '@andeus/ui';
import { ANDEUS_DATA } from './data';
import { MenuBar } from './MenuBar';
import { Sidebar } from './Sidebar';
import { LogicView } from './LogicView';
import { BacktestView } from './BacktestView';
import { HoldingsView } from './HoldingsView';

function App() {
  const [list, setList] = React.useState(ANDEUS_DATA.strategies);
  const [cur, setCur] = React.useState(localStorage.getItem('andeus.cur') || 'mom');
  const [tab, setTab] = React.useState(localStorage.getItem('andeus.tab') || 'logic');
  const [running, setRunning] = React.useState(false);
  const [confirm, setConfirm] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  React.useEffect(() => {
    localStorage.setItem('andeus.cur', cur);
    localStorage.setItem('andeus.tab', tab);
  }, [cur, tab]);
  React.useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);
  const s = list.find((x) => x.id === cur) || list[0];
  const run = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setTab('backtest');
      setToast({
        tone: 'positive',
        title: 'Backtest finished',
        body: 'Beat ' + s.bench + ' by 4.1% a year.',
      });
    }, 900);
  };
  const goLive = () => {
    setConfirm(false);
    setList(
      list.map((x) =>
        x.id === s.id
          ? {
              ...x,
              status: 'live',
            }
          : x,
      ),
    );
    setToast({
      tone: 'positive',
      title: s.name + ' is live',
      body: 'First trade at the next market open.',
    });
  };
  const newStrat = () => {
    const id = 'n' + Date.now();
    setList([
      ...list,
      {
        id,
        name: 'Untitled strategy',
        status: 'draft',
        cagr: '—',
        bench: 'SPY',
        blocks: 0,
        seed: 31,
      },
    ]);
    setCur(id);
    setTab('logic');
  };
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--dots-grille), var(--surface-body)',
      }}
    >
      <MenuBar />
      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: 16,
        }}
      >
        <Window
          title={s.name}
          height="100%"
          toolbar={
            <>
              <Button variant="primary" icon="play" size="s" onClick={run} disabled={running}>
                {running ? 'Running…' : 'Run backtest'}
              </Button>
              <Button size="s" icon="copy">
                Duplicate
              </Button>
              {running ? (
                <Badge tone="accent" led>
                  Running
                </Badge>
              ) : null}
              <span
                style={{
                  flex: 1,
                }}
              />
              {s.status === 'live' ? (
                <Badge tone="positive" led>
                  Live
                </Badge>
              ) : (
                <Button size="s" variant="ink" icon="zap" onClick={() => setConfirm(true)}>
                  Go live
                </Button>
              )}
              <IconButton icon="more-horizontal" label="More" size="s" variant="ghost" />
            </>
          }
          footer={
            <>
              <span>
                {s.blocks}
                {' blocks'}
              </span>
              <span>·</span>
              <span>
                {'Benchmark '}
                {s.bench}
              </span>
              <span
                style={{
                  marginLeft: 'auto',
                }}
              >
                Data through yesterday's close
              </span>
            </>
          }
          bodyStyle={{
            display: 'flex',
          }}
        >
          <Sidebar strategies={list} current={cur} onPick={setCur} onNew={newStrat} />
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Tabs
              tabs={[
                {
                  value: 'logic',
                  label: 'Logic',
                },
                {
                  value: 'backtest',
                  label: 'Backtest',
                },
                {
                  value: 'holdings',
                  label: 'Holdings',
                  count: 3,
                },
              ]}
              value={tab}
              onChange={setTab}
              style={{
                paddingTop: 10,
                background: 'var(--platinum-200)',
              }}
            />
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflow: 'auto',
              }}
            >
              {tab === 'logic' ? (
                <LogicView key={s.id} />
              ) : tab === 'backtest' ? (
                <BacktestView strategy={s} key={s.id} />
              ) : (
                <HoldingsView />
              )}
            </div>
          </div>
        </Window>
      </div>
      <Dialog
        open={confirm}
        title="Go live"
        icon="warning-box"
        onClose={() => setConfirm(false)}
        actions={
          <>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Not yet
            </Button>
            <Button isDefault variant="primary" onClick={goLive}>
              Go live
            </Button>
          </>
        }
      >
        <b
          style={{
            color: 'var(--text-1)',
          }}
        >
          {s.name}
        </b>
        {' will trade '}
        <b
          style={{
            color: 'var(--text-1)',
          }}
        >
          $10,000
        </b>
        {' starting at the next market open. You can pause it at any time.'}
      </Dialog>
      {toast ? (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            bottom: 24,
            transform: 'translateX(-50%)',
            zIndex: 200,
          }}
        >
          <Toast tone={toast.tone} title={toast.title} onClose={() => setToast(null)}>
            {toast.body}
          </Toast>
        </div>
      ) : null}
    </div>
  );
}
export { App };

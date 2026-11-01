export const ANDEUS_DATA = {
  strategies: [
    {
      id: 'mom',
      name: 'Momentum rotation',
      status: 'live',
      cagr: '14.2%',
      bench: 'SPY',
      blocks: 6,
      seed: 7,
    },
    {
      id: 'aw',
      name: 'All-weather',
      status: 'live',
      cagr: '8.1%',
      bench: '60/40',
      blocks: 5,
      seed: 11,
    },
    {
      id: 'dip',
      name: 'Dip buyer',
      status: 'draft',
      cagr: '11.6%',
      bench: 'QQQ',
      blocks: 4,
      seed: 19,
    },
    {
      id: 'sec',
      name: 'Sector leaders',
      status: 'paused',
      cagr: '9.4%',
      bench: 'SPY',
      blocks: 7,
      seed: 23,
    },
  ],
  holdings: [
    {
      t: 'QQQ',
      name: 'Invesco QQQ Trust',
      w: 60,
      today: '+0.84%',
      up: true,
      color: 'var(--screen-blue)',
    },
    {
      t: 'GLD',
      name: 'SPDR Gold Shares',
      w: 25,
      today: '−0.21%',
      up: false,
    },
    {
      t: 'TLT',
      name: 'iShares 20+ Year Treasury',
      w: 15,
      today: '+0.12%',
      up: true,
    },
  ],
  years: [
    ['2021', '+24.1%', '+28.7%'],
    ['2022', '−6.3%', '−18.2%'],
    ['2023', '+31.0%', '+26.3%'],
    ['2024', '+19.8%', '+25.0%'],
    ['2025', '+16.4%', '+17.9%'],
  ],
};
export const andeusSeries = function (seed, n, drift, vol) {
  let s = seed,
    v = 100;
  const out = [v];
  for (let i = 1; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    v *= 1 + drift + (s / 233280 - 0.5) * vol;
    out.push(v);
  }
  return out;
};

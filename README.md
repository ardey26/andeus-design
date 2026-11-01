# Andeus Design

React component library with a hardware-instrument look (Braun / Teenage Engineering / Classic Mac).

```
packages/ui      @andeus/ui: 28 components, tokens.css, Archivo fonts
apps/site        docs + showcase + strategy-app kit (Vite multi-page, static)
```

## Commands

```bash
pnpm install
pnpm dev        # site at http://localhost:5173/showcase/  (/docs/, /kits/strategy-app/)
pnpm build      # builds packages/ui/dist then apps/site/dist
```

## Using the library

```jsx
import '@andeus/ui/styles.css'; // once, at the app root
import { Button, Switch } from '@andeus/ui';
```

## Deploy

`apps/site/dist` is a static site. Netlify / Cloudflare Pages / Vercel:
build command `pnpm build`, output `apps/site/dist`.

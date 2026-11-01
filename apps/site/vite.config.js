import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

// In dev, serve the docs app for every /docs/<page>/ path (the build pre-renders each one).
const docsRoutes = {
  name: 'docs-routes',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (/^\/docs\/[a-z0-9-]+\/?(\?.*)?$/.test(req.url)) req.url = '/docs/index.html';
      next();
    });
  },
};

export default defineConfig({
  plugins: [react(), docsRoutes],
  // Develop against library source so edits hot-reload; the published package ships dist/.
  resolve: { alias: [{ find: /^@andeus\/ui$/, replacement: r('../../packages/ui/src/index.js') }] },
  build: {
    rollupOptions: {
      input: {
        root: r('index.html'),
        showcase: r('showcase/index.html'),
        docs: r('docs/index.html'),
        strategy: r('kits/strategy-app/index.html'),
      },
    },
  },
});

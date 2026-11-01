import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './docs.css';
import { Docs, routeFromPath } from './Docs';

const root = document.getElementById('root');
const app = <Docs initialRoute={routeFromPath(location.pathname)} />;
// Pages are pre-rendered at build time; hydrate them, or render fresh in dev.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);

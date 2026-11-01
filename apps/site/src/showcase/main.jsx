import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './showcase.css';
import { Showcase } from './Showcase';

const root = document.getElementById('root');
// Pre-rendered at build time; hydrate it, or render fresh in dev.
if (root.hasChildNodes()) hydrateRoot(root, <Showcase />);
else createRoot(root).render(<Showcase />);

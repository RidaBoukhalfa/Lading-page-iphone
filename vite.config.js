import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: import.meta.env.MODE === 'production' && import.meta.env.VITE_DEPLOY_TARGET === 'gh-pages'
    ? '/Lading-page-iphone/' // for GitHub Pages
    : '/',                   // for Netlify
  server: {
    host: true,
    port: 5173
  }
});


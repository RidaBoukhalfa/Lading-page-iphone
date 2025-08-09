import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Lading-page-iphone/', // Adjust the base path if needed
  server: {
    host: true,      // Enables access from other devices on your network
    port: 5173       // Optional (default is 5173)
  }
});

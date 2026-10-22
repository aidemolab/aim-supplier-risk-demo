import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

// Served from https://aidemolab.github.io/aim-supplier-risk-demo/
export default defineConfig({
  base: '/aim-supplier-risk-demo/',
  plugins: [react(), tailwindcss()],
});

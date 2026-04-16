import { tanstackRouter as router } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const config = defineConfig({
  plugins: [
    router({ target: 'react', autoCodeSplitting: true }),
    react(),
  ],
});

export default config;

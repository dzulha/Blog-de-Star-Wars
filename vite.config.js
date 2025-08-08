// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy DEV: /vg/* -> http://starwars-visualguide.com/*
      '/vg': {
        target: 'http://starwars-visualguide.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/vg/, ''),
      },
    },
  },
})

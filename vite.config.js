import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // allow access via localhost / 127.0.0.1
    port: 5173,
    strictPort: true,     // fail if 5173 is taken (avoid random port => HMR mismatch)
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
  },
})

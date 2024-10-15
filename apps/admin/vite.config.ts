import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({}), react()],
  server: {
    proxy: {
      "/api/trpc": {
        target: process.env.SERVER_URL ?? "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  // Exclude API directory from Vite's dependency scanning
  optimizeDeps: {
    exclude: ['@google-analytics/data']
  },
  // Exclude API routes from being processed
  build: {
    rollupOptions: {
      // Only include files from src directory
      input: {
        main: './index.html'
      }
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // v-- ADD THIS 'server' SECTION --v
  server: {
    proxy: {
      // string shorthand: http://localhost:5173/api -> http://127.0.0.1:8000/api
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    }
  }
})
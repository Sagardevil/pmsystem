// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ tailwindcss(),react()],
  server: {
    port: 5173,
    host: true,
    // Proxy configuration to handle CORS and SSL issues
    proxy: {
      '/api': {
        target: 'https://localhost:5051',
        changeOrigin: true,
        secure: false, // Ignore SSL certificate validation
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
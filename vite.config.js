import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // Proxy all requests starting with /api to your backend
      '/api': {
        target: 'http://localhost:8080/ContactCRUD-final', // Your backend server URL
        changeOrigin: true, // Changes the origin of the host header to the target URL
      }
    }
  }
})

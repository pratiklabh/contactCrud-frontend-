import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevtools from 'vite-plugin-vue-devtools';



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevtools(),
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
        target: 'http://localhost:8080/ContactCRUD-final', // backend server URL
        changeOrigin: true, // Changes the origin of the host header to the target URL
      },
      '/month':{
        target:'http://103.94.159.197:7071',
        changeOrigin: true,
      },

    }

  }
})

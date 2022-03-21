import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // hostname: '0.0.0.0',
    host: "localhost",
    port: 3012,
  }
})

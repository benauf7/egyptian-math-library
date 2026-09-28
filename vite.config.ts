import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { emailServerPlugin } from './server/vite-email-plugin.js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    emailServerPlugin()
  ],
  server: {
    port: 3000,
    open: false
  }
})

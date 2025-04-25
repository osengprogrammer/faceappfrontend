import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // Allow access from external devices
    port: 5173,        // Keep the default Vite port
    cors: true,        // Allow all CORS requests (you can tighten later)
    strictPort: true,  // Avoid auto-switching ports
    hmr: {
      clientPort: 443  // Fixes HMR with ngrok's https
    },
    origin:"https://e295-103-179-182-19.ngrok-free.app"
  }
})

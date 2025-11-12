import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.config/
export default defineConfig({
  plugins: [react()],
  define: {
    'global': 'window'
  }
})
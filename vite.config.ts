import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base path for the public GitHub Pages URL: /web-perros/
export default defineConfig({
  base: '/web-perros/',
  plugins: [react()],
})

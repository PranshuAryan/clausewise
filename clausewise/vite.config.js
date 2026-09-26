import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // For GitHub Pages, you might need base: '/clausewise/' if deploying to a subpath.
  // Using relative base for static hosting versatility.
  base: './',
})

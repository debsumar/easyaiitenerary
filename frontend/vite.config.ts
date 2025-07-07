import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: { // Add this server configuration block
    port: 3000, // Set the default port to 3000
  },
  css: {
    postcss: './postcss.config.ts', // Point to TypeScript PostCSS config
  },
  // Ensure TypeScript config files are properly handled
  optimizeDeps: {
    include: ['tailwindcss'],
  },
})

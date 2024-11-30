import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      utils: resolve(__dirname, 'src/utils'),
      app: resolve(__dirname, 'src/app'),
      assets: resolve(__dirname, 'src/assets'),
      Components: resolve(__dirname, 'src/Components'),
      Lotties: resolve(__dirname, 'src/Lotties'),
      Pages: resolve(__dirname, 'src/Pages'),
      Private: resolve(__dirname, 'src/Private'),
    },
  },
})

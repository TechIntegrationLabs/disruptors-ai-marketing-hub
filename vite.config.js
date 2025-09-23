import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['cloudinary'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
      define: {
        global: 'globalThis'
      }
    },
  },
  build: {
    rollupOptions: {
      external: ['url', 'fs', 'path'],
      output: {
        globals: {
          'url': 'URL',
        }
      }
    }
  }
}) 
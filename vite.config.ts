/// <reference types="vitest" />
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// FORCE CACHE CLEAR - Version 1.0.15 - MODULE LOADING FIX
const TIMESTAMP = Date.now().toString();


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
  },
  server: {
    fs: {
      strict: false
    },
    hmr: {
      overlay: false  // Disable error overlay
    }
  },
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  define: {
    __BUILD_TIME__: JSON.stringify(TIMESTAMP),
  },
  optimizeDeps: {
    force: true,  // Force dependency re-optimization
    exclude: [],
    include: ['react', 'react-dom']  // Pre-bundle core dependencies
  },
  cacheDir: '.vite',  // Use default cache location
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Optimize chunk size and splitting
    rollupOptions: {
      output: {
        manualChunks: undefined,  // Disable manual chunking to fix module loading
      },
    },
    // Increase chunk size warning limit to 1000kb
    chunkSizeWarningLimit: 1000,
    // Use esbuild for faster minification (default, built into Vite)
    minify: 'esbuild',
    // Enable source maps for production debugging (optional)
    sourcemap: false,
    // Target modern browsers
    target: 'esnext',
  },
})
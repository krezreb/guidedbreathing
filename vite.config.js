import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      // 'prompt' rather than 'autoUpdate': autoUpdate reloads the page as soon
      // as a new worker takes control, which would destroy a session mid-breath.
      // src/services/appUpdate.js applies the update once the app is idle.
      registerType: 'prompt',
      includeAssets: ['icons/*.png', 'icons/favicon.svg'],
      manifest: {
        name: 'Guided Breathing',
        short_name: 'Breathe',
        description: 'Simple guided breathing exercises to help you relax.',
        lang: 'en',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#060d1a',
        theme_color: '#060d1a',
        categories: ['health', 'lifestyle'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // The completion sound must be precached: it plays at the end of an
        // offline session, long after the network may have gone away.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest,wav}'],
        // No runtime caching rules: the application makes no network requests
        // of its own once the shell is cached.
        navigateFallback: 'index.html',
      },
      devOptions: {
        // Enabled so the dev server serves a real manifest and service worker.
        // Without these Chromium (Brave/Edge/Chrome) has nothing to install and
        // offers no install prompt at all on http://localhost (TECH_SPECS §15).
        enabled: true,
        // The dev worker is emitted as an ES module, unlike the bundled build.
        type: 'module',
        navigateFallback: 'index.html',
      },
    }),
  ],
  server: {
    // Bind on all interfaces so the mobile UI can be tested from a phone on
    // the same network (TECH_SPECS §15).
    host: true,
    port: 5173,
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    cssMinify: true,
    minify: 'esbuild',
  },
})

import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.css'

createApp(App).mount('#app')

// Registered by vite-plugin-pwa. Failure is not fatal: the app runs as an
// ordinary web page when service workers are unavailable (TECH_SPECS §22).
if ('serviceWorker' in navigator) {
  import('virtual:pwa-register')
    .then(async ({ registerSW }) => {
      const { applyWhenIdle } = await import('./services/appUpdate.js')
      const updateSW = registerSW({
        immediate: true,
        // A new build waits rather than reloading mid-session.
        onNeedRefresh: () => applyWhenIdle(updateSW),
      })
    })
    .catch(() => {})
}

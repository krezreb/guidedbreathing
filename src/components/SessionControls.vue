<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { t } from '../services/i18n.js'
import { muted, toggleMute } from '../services/sounds.js'

defineProps({
  paused: { type: Boolean, required: true },
})
defineEmits(['toggle', 'exit'])

/* -- Fullscreen ----------------------------------------------------------- */

/**
 * iOS Safari has no Fullscreen API for ordinary elements, so the button is
 * hidden there rather than offered and doing nothing (TECH_SPECS §22).
 */
const fullscreenSupported = typeof document.documentElement.requestFullscreen === 'function'

const isFullscreen = ref(false)

/** The user can also leave fullscreen with Escape or a system gesture, so the
 *  button follows the document rather than its own last click. */
function syncFullscreen() {
  isFullscreen.value = document.fullscreenElement != null
}

onMounted(() => {
  syncFullscreen()
  document.addEventListener('fullscreenchange', syncFullscreen)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', syncFullscreen)
})

function toggleFullscreen() {
  const request = document.fullscreenElement
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen()
  // Rejected when the browser refuses — permissions policy, an untrusted
  // gesture. Nothing in the session depends on it.
  Promise.resolve(request).catch(() => {})
}
</script>

<template>
  <div class="controls">
    <div class="controls__row">
      <button type="button" class="controls__primary" @click="$emit('toggle')">
        {{ paused ? t('session.resume') : t('session.pause') }}
      </button>

      <button
        type="button"
        class="controls__icon"
        :aria-pressed="muted"
        :aria-label="muted ? t('session.unmute') : t('session.mute')"
        :title="muted ? t('session.unmute') : t('session.mute')"
        @click="toggleMute"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path class="controls__icon-solid" d="M4 9h3l4.5-4.5v15L7 15H4z" />
          <template v-if="muted">
            <path d="M15.5 9.5l5 5M20.5 9.5l-5 5" />
          </template>
          <template v-else>
            <path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" />
          </template>
        </svg>
      </button>

      <button
        v-if="fullscreenSupported"
        type="button"
        class="controls__icon controls__icon--accent"
        :aria-pressed="isFullscreen"
        :aria-label="isFullscreen ? t('session.exitFullscreen') : t('session.fullscreen')"
        :title="isFullscreen ? t('session.exitFullscreen') : t('session.fullscreen')"
        @click="toggleFullscreen"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <template v-if="isFullscreen">
            <path d="M9 4v5H4M15 4v5h5M15 20v-5h5M9 20v-5H4" />
            <path d="M4 4l5 5M20 4l-5 5M20 20l-5-5M4 20l5-5" />
          </template>
          <template v-else>
            <path d="M4 9V4h5M20 9V4h-5M20 15v5h-5M4 15v5h5" />
            <path d="M4 4l6 6M20 4l-6 6M20 20l-6-6M4 20l6-6" />
          </template>
        </svg>
      </button>
    </div>

    <button type="button" class="controls__exit" @click="$emit('exit')">
      {{ t('session.exit') }}
    </button>
  </div>
</template>

<style scoped>
.controls {
  display: grid;
  justify-items: center;
  gap: var(--space-sm);
}

/* The icons sit beside the primary button rather than under it: they are
   session settings, not steps in the session. */
.controls__row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  max-width: 100%;
}

.controls__primary {
  min-width: min(16rem, 100%);
  min-height: 3.5rem;
  padding: 0 var(--space-xl);
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-text);
  background: var(--color-primary);
  border: 1px solid var(--color-secondary);
  border-radius: var(--radius-pill);
  transition: background 200ms var(--ease-calm);
}

.controls__primary:active {
  background: var(--color-secondary);
}

.controls__icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  color: var(--color-text-muted);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition:
    color 200ms var(--ease-calm),
    background 200ms var(--ease-calm);
}

.controls__icon:active {
  background: var(--color-primary);
}

.controls__icon--accent {
  color: var(--color-accent);
}

.controls__icon svg {
  width: 1.5rem;
  height: 1.5rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* The speaker cone reads as a solid shape; the waves and the cross as lines. */
.controls__icon-solid {
  fill: currentColor;
}

/* Landscape phones have little height to spare: shrink the row rather than
   let it push the guide. */
@media (orientation: landscape) and (max-height: 30rem) {
  .controls__icon {
    width: var(--touch-min);
    height: var(--touch-min);
  }
}
</style>

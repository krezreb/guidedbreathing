<script setup>
import { t } from '../services/i18n.js'

defineProps({
  label: { type: String, required: true },
  /**
   * The clock is a distraction while breathing, so it only appears when the
   * session is paused (SPECS §5.3). It keeps its space either way: revealing
   * it must not shift the guide underneath.
   */
  visible: { type: Boolean, default: true },
})
</script>

<template>
  <p
    class="timer"
    :class="{ 'timer--hidden': !visible }"
    role="timer"
    aria-live="off"
    :aria-hidden="visible ? undefined : 'true'"
  >
    <span class="timer__value">{{ label }}</span>
    <span class="timer__unit">{{ t('session.remaining') }}</span>
  </p>
</template>

<style scoped>
.timer {
  margin: 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5ch;
  color: var(--color-text-muted);
  transition: opacity 400ms var(--ease-calm);
}

.timer--hidden {
  opacity: 0;
  visibility: hidden;
}

.timer__value {
  font-size: 1.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
}

.timer__unit {
  font-size: 0.875rem;
  letter-spacing: 0.04em;
}
</style>

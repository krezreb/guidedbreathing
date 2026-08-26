<script setup>
import { t } from '../services/i18n.js'

defineProps({
  paused: { type: Boolean, required: true },
})
defineEmits(['toggle', 'exit'])
</script>

<template>
  <div class="controls">
    <button type="button" class="controls__primary" @click="$emit('toggle')">
      {{ paused ? t('session.resume') : t('session.pause') }}
    </button>
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

.controls__exit {
  min-height: var(--touch-min);
  padding: 0 var(--space-lg);
  font-size: 1rem;
  color: var(--color-text-muted);
  border-radius: var(--radius-pill);
}
</style>

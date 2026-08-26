<script setup>
/** Guards against accidental exits (SPECS §6.3). */
import { onMounted, ref } from 'vue'
import { t } from '../services/i18n.js'

defineProps({
  /** The dialog carries the clock: the screen behind it is dimmed (SPECS §5.3). */
  remainingLabel: { type: String, required: true },
})

defineEmits(['cancel', 'confirm'])

const cancelButton = ref(null)

onMounted(() => {
  // Focus the safe option, so a stray Enter cannot discard the session.
  cancelButton.value?.focus()
})
</script>

<template>
  <div class="backdrop" @click.self="$emit('cancel')">
    <div
      class="dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-title"
      aria-describedby="exit-body"
    >
      <h2 id="exit-title" class="dialog__title">{{ t('exitDialog.title') }}</h2>
      <p id="exit-body" class="dialog__body">{{ t('exitDialog.body') }}</p>
      <p class="dialog__remaining">
        <span class="dialog__remaining-value">{{ remainingLabel }}</span>
        <span>{{ t('session.remaining') }}</span>
      </p>
      <div class="dialog__actions">
        <button ref="cancelButton" type="button" class="dialog__cancel" @click="$emit('cancel')">
          {{ t('exitDialog.cancel') }}
        </button>
        <button type="button" class="dialog__confirm" @click="$emit('confirm')">
          {{ t('exitDialog.confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: var(--space-lg);
  background: rgb(3 8 16 / 78%);
  z-index: 10;
}

.dialog {
  width: min(24rem, 100%);
  padding: var(--space-lg);
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-align: center;
}

.dialog__title {
  font-size: 1.25rem;
}

.dialog__body {
  margin: var(--space-sm) 0 var(--space-sm);
  color: var(--color-text-muted);
}

.dialog__remaining {
  margin: 0 0 var(--space-lg);
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5ch;
  font-size: 0.875rem;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.dialog__remaining-value {
  font-size: 1.375rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--color-text);
}

.dialog__actions {
  display: grid;
  gap: var(--space-sm);
}

.dialog__cancel,
.dialog__confirm {
  min-height: 3.25rem;
  border-radius: var(--radius-pill);
  font-size: 1.0625rem;
  font-weight: 600;
}

.dialog__cancel {
  background: var(--color-primary);
  border: 1px solid var(--color-secondary);
}

.dialog__confirm {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}
</style>

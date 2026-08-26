<script setup>
import { DURATION_PRESETS_MINUTES } from '../data/durations.js'

const props = defineProps({
  modelValue: { type: Number, required: true },
})
const emit = defineEmits(['update:modelValue'])

function label(minutes) {
  return minutes === 1 ? '1 min' : `${minutes} min`
}
</script>

<template>
  <fieldset class="selector">
    <legend class="selector__legend">Duration</legend>
    <div class="selector__grid" role="group" aria-label="Session duration">
      <button
        v-for="minutes in DURATION_PRESETS_MINUTES"
        :key="minutes"
        type="button"
        class="duration"
        :class="{ 'duration--selected': minutes === props.modelValue }"
        :aria-pressed="minutes === props.modelValue"
        :aria-label="`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`"
        @click="emit('update:modelValue', minutes)"
      >
        {{ label(minutes) }}
      </button>
    </div>
  </fieldset>
</template>

<style scoped>
.selector {
  border: none;
  margin: 0;
  padding: 0;
  min-width: 0;
}

.selector__legend {
  padding: 0 0 var(--space-sm);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.selector__grid {
  display: grid;
  /* Two rows of four on a phone; the grid reflows on its own if the preset list
     changes length. */
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-sm);
}

.duration {
  min-height: var(--touch-min);
  padding: var(--space-sm) var(--space-xs);
  font-size: 0.9375rem;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  transition: background 200ms var(--ease-calm), border-color 200ms var(--ease-calm);
}

.duration--selected {
  background: var(--color-surface-raised);
  border-color: var(--color-accent);
  color: var(--color-accent-soft);
  font-weight: 600;
  box-shadow: inset 0 0 0 1px var(--color-accent);
}
</style>

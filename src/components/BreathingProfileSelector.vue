<script setup>
import { BREATHING_PROFILES } from '../data/breathingProfiles.js'

const props = defineProps({
  modelValue: { type: String, required: true },
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <fieldset class="selector">
    <legend class="selector__legend">Breathing profile</legend>
    <div class="selector__options" role="group" aria-label="Breathing profile">
      <button
        v-for="profile in BREATHING_PROFILES"
        :key="profile.id"
        type="button"
        class="option"
        :class="{ 'option--selected': profile.id === props.modelValue }"
        :aria-pressed="profile.id === props.modelValue"
        @click="emit('update:modelValue', profile.id)"
      >
        <span class="option__name">{{ profile.name }}</span>
        <span class="option__timing">
          {{ profile.inhaleSeconds }}s in &middot; {{ profile.exhaleSeconds }}s out
        </span>
        <span class="option__description">{{ profile.description }}</span>
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

.selector__options {
  display: grid;
  gap: var(--space-sm);
}

.option {
  display: grid;
  gap: 0.125rem;
  padding: var(--space-md);
  min-height: var(--touch-min);
  text-align: left;
  background: var(--color-surface);
  /* Selection is marked by border and a left bar as well as colour, so it does
     not rely on colour alone (SPECS §14). */
  border: 1px solid var(--color-border);
  border-left: 4px solid transparent;
  border-radius: var(--radius-md);
  transition: background 200ms var(--ease-calm), border-color 200ms var(--ease-calm);
}

.option--selected {
  background: var(--color-surface-raised);
  border-color: var(--color-secondary);
  border-left-color: var(--color-accent);
}

.option__name {
  font-size: 1.0625rem;
  font-weight: 600;
}

.option__timing {
  font-size: 0.9375rem;
  color: var(--color-accent-soft);
  font-variant-numeric: tabular-nums;
}

.option__description {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}
</style>

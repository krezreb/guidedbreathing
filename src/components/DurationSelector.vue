<script setup>
import { DEV_DURATION_MINUTES, DURATION_PRESETS_MINUTES } from '../data/durations.js'
import { isDevDurationEnabled } from '../services/featureFlags.js'
import { t, tp } from '../services/i18n.js'

const props = defineProps({
  modelValue: { type: Number, required: true },
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <fieldset class="selector">
    <legend class="selector__legend">{{ t('duration.legend') }}</legend>
    <div class="selector__grid" role="group" :aria-label="t('duration.legend')">
      <button
        v-for="minutes in DURATION_PRESETS_MINUTES"
        :key="minutes"
        type="button"
        class="duration"
        :class="{ 'duration--selected': minutes === props.modelValue }"
        :aria-pressed="minutes === props.modelValue"
        :aria-label="tp('duration.long', minutes, { minutes })"
        @click="emit('update:modelValue', minutes)"
      >
        {{ t('duration.short', { minutes }) }}
      </button>
    </div>

    <!-- Behind the `?devduration=1` flag: one inhale, one exhale, then the
         session completes — enough to exercise the end-of-session animation,
         sound and message without sitting through a real session. Deliberately
         not translated; the catalogues hold copy that ships to users, and
         nobody reaches this without putting the flag in the URL themselves. -->
    <button
      v-if="isDevDurationEnabled()"
      type="button"
      class="duration duration--dev"
      :class="{ 'duration--selected': DEV_DURATION_MINUTES === props.modelValue }"
      :aria-pressed="DEV_DURATION_MINUTES === props.modelValue"
      aria-label="Developer duration: a single breath in and out"
      @click="emit('update:modelValue', DEV_DURATION_MINUTES)"
    >
      Dev &middot; 1 breath
    </button>
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
  /* As many presets per row as the column can hold: four across a phone,
     two in the narrow side column beside the profiles. No breakpoint of its
     own, and it reflows on its own if the preset list changes length. */
  grid-template-columns: repeat(auto-fit, minmax(4.5rem, 1fr));
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

/* Visibly not one of the presets: a debugging affordance that happens to live
   in the same panel. */
.duration--dev {
  width: 100%;
  margin-top: var(--space-sm);
  border-style: dashed;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
}

.duration--selected {
  background: var(--color-surface-raised);
  border-color: var(--color-accent);
  color: var(--color-accent-soft);
  font-weight: 600;
  box-shadow: inset 0 0 0 1px var(--color-accent);
}
</style>

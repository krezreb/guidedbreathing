<script setup>
defineProps({
  label: { type: String, required: true },
})
</script>

<template>
  <p class="timer" role="timer" aria-live="off">
    <span class="timer__value">{{ label }}</span>
    <span class="timer__unit">remaining</span>
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

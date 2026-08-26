<script setup>
import { t, tp } from '../services/i18n.js'

defineProps({
  profileId: { type: String, required: true },
  durationMinutes: { type: Number, required: true },
})
defineEmits(['done'])
</script>

<template>
  <section class="completion" aria-labelledby="completion-heading">
    <div class="completion__mark" aria-hidden="true"></div>
    <h1 id="completion-heading" class="completion__title">{{ t('completion.title') }}</h1>
    <p class="completion__body">{{ t('completion.body') }}</p>
    <p class="completion__detail">
      {{ t(`profile.${profileId}.name`) }} &middot;
      {{ tp('duration.long', durationMinutes, { minutes: durationMinutes }) }}
    </p>
    <button type="button" class="completion__action" @click="$emit('done')">
      {{ t('completion.action') }}
    </button>
  </section>
</template>

<style scoped>
.completion {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  text-align: center;
  padding: var(--space-lg);
}

.completion__mark {
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 45%, var(--color-accent-soft), var(--color-primary) 70%);
  box-shadow: 0 0 3rem -0.5rem var(--color-accent);
  margin-bottom: var(--space-sm);
}

.completion__title {
  font-size: 2rem;
}

.completion__body {
  margin: 0;
  font-size: 1.0625rem;
  color: var(--color-text);
}

.completion__detail {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--color-text-muted);
}

.completion__action {
  margin-top: var(--space-md);
  min-height: 3.5rem;
  min-width: min(16rem, 100%);
  padding: 0 var(--space-xl);
  font-size: 1.125rem;
  font-weight: 600;
  background: var(--color-primary);
  border: 1px solid var(--color-secondary);
  border-radius: var(--radius-pill);
}
</style>

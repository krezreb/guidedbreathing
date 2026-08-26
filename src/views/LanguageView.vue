<script setup>
/** Language picker, reached from the main screen. */
import { LOCALES } from '../i18n/index.js'
import { locale, setLocale, t } from '../services/i18n.js'

defineEmits(['back'])
</script>

<template>
  <main class="language">
    <header class="language__header">
      <button type="button" class="language__back" @click="$emit('back')">
        &larr; {{ t('language.back') }}
      </button>
      <h1 class="language__title">{{ t('language.title') }}</h1>
      <p class="language__hint">{{ t('language.hint') }}</p>
    </header>

    <div class="language__options" role="group" :aria-label="t('language.title')">
      <!-- Each language is named in itself, so the list stays readable to
           someone who cannot read the current interface language. -->
      <button
        v-for="entry in LOCALES"
        :key="entry.code"
        type="button"
        class="option"
        :class="{ 'option--selected': entry.code === locale }"
        :aria-pressed="entry.code === locale"
        :lang="entry.code"
        @click="setLocale(entry.code)"
      >
        <span class="option__label">{{ entry.label }}</span>
        <span class="option__check" aria-hidden="true">{{
          entry.code === locale ? '✓' : ''
        }}</span>
      </button>
    </div>

    <!-- The header's back link is easy to miss; this repeats the same exit at
         the foot of the list, where the eye lands after choosing. -->
    <button type="button" class="language__done" @click="$emit('back')">
      {{ t('language.done') }}
    </button>
  </main>
</template>

<style scoped>
.language {
  flex: 1;
  display: grid;
  align-content: start;
  max-width: 34rem;
  width: 100%;
  margin: 0 auto;
}

.language__header {
  display: grid;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.language__back {
  justify-self: start;
  min-height: var(--touch-min);
  padding: 0 var(--space-md) 0 0;
  font-size: 1rem;
  color: var(--color-accent);
  border-radius: var(--radius-sm);
}

.language__title {
  font-size: 1.5rem;
}

.language__hint {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.language__options {
  display: grid;
  gap: var(--space-sm);
}

.option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  min-height: 3.5rem;
  padding: 0 var(--space-md);
  text-align: left;
  font-size: 1.0625rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 4px solid transparent;
  border-radius: var(--radius-md);
  transition: background 200ms var(--ease-calm), border-color 200ms var(--ease-calm);
}

.option--selected {
  background: var(--color-surface-raised);
  border-color: var(--color-secondary);
  border-left-color: var(--color-accent);
  font-weight: 600;
}

.language__done {
  justify-self: center;
  width: min(20rem, 100%);
  min-height: 3.5rem;
  margin-top: var(--space-lg);
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: linear-gradient(180deg, var(--color-secondary), var(--color-primary));
  border: 1px solid var(--color-secondary);
  border-radius: var(--radius-pill);
  transition: filter 200ms var(--ease-calm);
}

.language__done:active {
  filter: brightness(1.15);
}

.option__check {
  color: var(--color-accent);
  font-size: 1.125rem;
}
</style>

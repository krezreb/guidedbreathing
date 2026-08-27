<script setup>
import { computed } from 'vue'
import { EXTERNAL_RESOURCES } from '../data/resources.js'
import { t } from '../services/i18n.js'

defineEmits(['back'])

/**
 * Two passages name a breathing profile. Interpolating the translated name
 * keeps the prose correct in every language without embedding markup in the
 * catalogues.
 */
const chillName = computed(() => t('profile.chill.name'))
const beginnerName = computed(() => t('profile.beginner.name'))
</script>

<template>
  <main class="info">
    <header class="info__header">
      <button type="button" class="info__back" @click="$emit('back')">
        &larr; {{ t('info.back') }}
      </button>
      <h1 class="info__title">{{ t('info.title') }}</h1>
    </header>

    <section class="info__section">
      <h2 class="info__heading">{{ t('info.whatHeading') }}</h2>
      <p>{{ t('info.whatBody') }}</p>
    </section>

    <section class="info__section">
      <h2 class="info__heading">{{ t('info.whyHeading') }}</h2>
      <p>{{ t('info.whyBody', { profile: chillName }) }}</p>
      <p class="info__caveat">{{ t('info.caveat') }}</p>
    </section>

    <section class="info__section">
      <h2 class="info__heading">{{ t('info.tipsHeading') }}</h2>
      <ul class="info__list">
        <li v-for="(tip, index) in t('info.tips', { profile: beginnerName })" :key="index">
          {{ tip }}
        </li>
      </ul>
    </section>

    <section class="info__section">
      <h2 class="info__heading">{{ t('info.resourcesHeading') }}</h2>
      <ul class="info__resources">
        <li v-for="resource in EXTERNAL_RESOURCES" :key="resource.id" class="resource">
          <a
            v-if="resource.url"
            class="resource__link"
            :href="resource.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ t(`resources.${resource.id}.title`) }}
          </a>
          <span v-else class="resource__placeholder">
            {{ t(`resources.${resource.id}.title`) }}
            <span class="resource__badge">{{ t('info.comingSoon') }}</span>
          </span>
          <span class="resource__note">{{ t(`resources.${resource.id}.note`) }}</span>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.info {
  flex: 1;
  max-width: 42rem;
  width: 100%;
  margin: 0 auto;
  padding-bottom: var(--space-xl);
  overflow-y: auto;
}

.info__header {
  display: grid;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.info__back {
  justify-self: start;
  min-height: var(--touch-min);
  padding: 0 var(--space-md) 0 0;
  font-size: 1rem;
  color: var(--color-accent);
  border-radius: var(--radius-sm);
}

.info__title {
  font-size: 1.5rem;
}

.info__section {
  margin-bottom: var(--space-lg);
}

.info__heading {
  font-size: 1.0625rem;
  color: var(--color-accent-soft);
  margin-bottom: var(--space-sm);
}

.info p {
  margin: 0 0 var(--space-sm);
  color: var(--color-text);
}

.info__caveat {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  border-left: 3px solid var(--color-border);
  padding-left: var(--space-md);
}

.info__list,
.info__resources {
  margin: 0;
  padding-left: var(--space-lg);
  display: grid;
  gap: var(--space-sm);
}

.info__resources {
  list-style: none;
  padding-left: 0;
}

.resource {
  display: grid;
  gap: 0.125rem;
  padding: var(--space-sm) 0;
  border-top: 1px solid var(--color-border);
}

.resource__link {
  min-height: var(--touch-min);
  display: flex;
  align-items: center;
  font-weight: 600;
}

.resource__placeholder {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-text-muted);
  font-weight: 600;
}

.resource__badge {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-text-muted);
}

.resource__note {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
</style>

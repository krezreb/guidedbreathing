<script setup>
import { EXTERNAL_RESOURCES } from '../data/resources.js'

defineEmits(['back'])
</script>

<template>
  <main class="info">
    <header class="info__header">
      <button type="button" class="info__back" @click="$emit('back')">&larr; Back</button>
      <h1 class="info__title">About breathing exercises</h1>
    </header>

    <section class="info__section">
      <h2 class="info__heading">What this is</h2>
      <p>
        Guided breathing simply means following a steady, deliberate rhythm of breathing in and
        breathing out. This app shows you that rhythm: a bubble rises while you breathe in and
        falls while you breathe out, so you can follow along without counting.
      </p>
    </section>

    <section class="info__section">
      <h2 class="info__heading">Why people do it</h2>
      <p>
        Many people find that slow, paced breathing feels calming and helps them settle before
        sleep, between tasks, or after something stressful. Longer exhalations, as in the
        <em>Chill</em> profile, are a common choice for winding down.
      </p>
      <p class="info__caveat">
        This app is for relaxation only. It is not medical advice and is not a treatment for any
        condition. If you have concerns about your breathing or your health, speak to a qualified
        healthcare professional.
      </p>
    </section>

    <section class="info__section">
      <h2 class="info__heading">Getting the most from a session</h2>
      <ul class="info__list">
        <li>Sit or lie somewhere comfortable where you will not be interrupted.</li>
        <li>Breathe through your nose if that feels natural, into your belly rather than your chest.</li>
        <li>Start with the <em>Beginner</em> profile and a short session; longer is not better.</li>
        <li>Do not strain. If a pace feels uncomfortable, switch to a gentler profile.</li>
        <li>Let the bubble set the pace rather than trying to get ahead of it.</li>
      </ul>
    </section>

    <section class="info__section">
      <h2 class="info__heading">Learn more</h2>
      <ul class="info__resources">
        <li v-for="resource in EXTERNAL_RESOURCES" :key="resource.id" class="resource">
          <a
            v-if="resource.url"
            class="resource__link"
            :href="resource.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ resource.title }}
          </a>
          <span v-else class="resource__placeholder">
            {{ resource.title }}
            <span class="resource__badge">link coming soon</span>
          </span>
          <span class="resource__note">{{ resource.note }}</span>
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

<script setup>
import BreathingProfileSelector from '../components/BreathingProfileSelector.vue'
import DurationSelector from '../components/DurationSelector.vue'
import {
  begin,
  homeScreen,
  selectDuration,
  selectProfile,
  selectedDurationMinutes,
  selectedProfileId,
} from '../services/useSession.js'
</script>

<template>
  <main class="home">
    <header class="home__header">
      <h1 class="home__title">Breathe</h1>
      <p class="home__subtitle">A few quiet minutes, guided.</p>
    </header>

    <div class="home__panels">
      <BreathingProfileSelector
        :model-value="selectedProfileId"
        @update:model-value="selectProfile"
      />
      <DurationSelector
        :model-value="selectedDurationMinutes"
        @update:model-value="selectDuration"
      />
    </div>

    <div class="home__actions">
      <!-- Always enabled: a profile and duration are always selected. -->
      <button type="button" class="home__begin" @click="begin">Begin</button>
      <button type="button" class="home__info" @click="homeScreen = 'info'">
        About breathing exercises
      </button>
    </div>
  </main>
</template>

<style scoped>
.home {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  max-width: 60rem;
  width: 100%;
  margin: 0 auto;
}

.home__header {
  text-align: center;
  padding-top: var(--space-sm);
}

.home__title {
  font-size: 1.75rem;
  letter-spacing: 0.02em;
}

.home__subtitle {
  margin: var(--space-xs) 0 0;
  color: var(--color-text-muted);
  font-size: 0.9375rem;
}

.home__panels {
  display: grid;
  gap: var(--space-lg);
  align-content: start;
}

.home__actions {
  margin-top: auto;
  display: grid;
  justify-items: center;
  gap: var(--space-sm);
  padding-top: var(--space-md);
}

.home__begin {
  width: min(20rem, 100%);
  min-height: 3.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: linear-gradient(180deg, var(--color-secondary), var(--color-primary));
  border: 1px solid var(--color-secondary);
  border-radius: var(--radius-pill);
  box-shadow: 0 0 2.5rem -1rem var(--color-accent);
  transition: filter 200ms var(--ease-calm);
}

.home__begin:active {
  filter: brightness(1.15);
}

.home__info {
  min-height: var(--touch-min);
  padding: 0 var(--space-md);
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  text-decoration: underline;
  text-underline-offset: 0.25em;
  border-radius: var(--radius-pill);
}

/* Two columns once there is room (SPECS §12). Mobile-first: this is the
   enhancement, not the baseline. */
@media (min-width: 40rem) {
  .home__panels {
    grid-template-columns: 1.4fr 1fr;
    gap: var(--space-xl);
  }
}
</style>

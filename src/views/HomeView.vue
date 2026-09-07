<script setup>
import BreathingProfileSelector from '../components/BreathingProfileSelector.vue'
import DurationSelector from '../components/DurationSelector.vue'
import { currentLocale, t } from '../services/i18n.js'
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
      <h1 class="home__title">{{ t('app.name') }}</h1>
      <p class="home__subtitle">{{ t('app.tagline') }}</p>
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
      <button type="button" class="home__begin" @click="begin">{{ t('home.begin') }}</button>

      <nav class="home__menu" :aria-label="t('app.name')">
        <button type="button" class="home__menu-item" @click="homeScreen = 'info'">
          {{ t('home.about') }}
        </button>
        <button type="button" class="home__menu-item" @click="homeScreen = 'language'">
          <!-- Shows the current language in its own name, so the way back is
               recognisable whatever the interface is currently set to. -->
          {{ t('home.language') }} &middot;
          <span :lang="currentLocale.code">{{ currentLocale.label }}</span>
        </button>
      </nav>
    </div>
  </main>
</template>

<style scoped>
.home {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  max-width: 40rem;
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

/* Sits directly under the panels rather than being pushed to the bottom of the
   window: the choices and the action they confirm read as one block. */
.home__actions {
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

.home__menu {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-xs) var(--space-md);
}

.home__menu-item {
  min-height: var(--touch-min);
  padding: 0 var(--space-sm);
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  text-decoration: underline;
  text-underline-offset: 0.25em;
  border-radius: var(--radius-pill);
}

/* Two columns once there is room (SPECS §13). Mobile-first: this is the
   enhancement, not the baseline. The duration column is given a fixed narrow
   track so the preset buttons stay compact and the profile cards take the
   remaining width rather than both stretching across the screen. */
@media (min-width: 34rem) {
  .home__panels {
    grid-template-columns: minmax(0, 1fr) 12rem;
    gap: var(--space-lg);
  }
}
</style>

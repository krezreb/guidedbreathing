<script setup>
import { computed } from 'vue'
import BreathingCanvas from '../components/BreathingCanvas.vue'
import SessionControls from '../components/SessionControls.vue'
import SessionTimer from '../components/SessionTimer.vue'
import { t } from '../services/i18n.js'
import { PHASE } from '../services/sessionController.js'
import {
  controller,
  isPaused,
  pausedWhileAway,
  phase,
  remainingLabel,
  requestExit,
  togglePause,
} from '../services/useSession.js'

/**
 * The phase is conveyed in text as well as by the animation, so the breathing
 * state never depends on the visual alone (SPECS §15).
 */
const phaseLabel = computed(() =>
  phase.value === PHASE.EXHALE ? t('session.exhale') : t('session.inhale'),
)
</script>

<template>
  <main class="session">
    <SessionTimer :label="remainingLabel" :visible="isPaused" />

    <div class="session__guide">
      <BreathingCanvas v-if="controller" :controller="controller" />

      <div class="session__phase" :class="{ 'session__phase--paused': isPaused }">
        <p class="session__phase-text" aria-live="polite">
          {{ isPaused ? t('session.paused') : phaseLabel }}
        </p>
        <p v-if="pausedWhileAway" class="session__phase-note">
          {{ t('session.pausedAway') }}
        </p>
      </div>
    </div>

    <SessionControls :paused="isPaused" @toggle="togglePause" @exit="requestExit" />
  </main>
</template>

<style scoped>
.session {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  max-width: 34rem;
  width: 100%;
  margin: 0 auto;
  padding: var(--space-sm) 0;
}

/* The guide takes all the room left over: the breathing animation is the
   screen, the controls are the margin (TECH_SPECS §11). */
.session__guide {
  position: relative;
  flex: 1;
  min-height: 12rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.session__phase {
  position: absolute;
  inset: auto 0 0;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  gap: var(--space-xs);
  justify-items: center;
  pointer-events: none;
  padding: 0 var(--space-md);
}

.session__phase-text {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  text-shadow: 0 0 1.5rem var(--color-background);
  transition: color 400ms var(--ease-calm);
}

.session__phase--paused .session__phase-text {
  color: var(--color-text);
}

.session__phase-note {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  text-align: center;
  text-shadow: 0 0 1.5rem var(--color-background);
}

/* In landscape the guide would be squat; give the controls less room and let
   the guide keep as much height as possible. */
@media (orientation: landscape) and (max-height: 30rem) {
  .session {
    max-width: 46rem;
  }

  .session__guide {
    min-height: 8rem;
  }
}
</style>

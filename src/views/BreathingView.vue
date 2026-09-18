<script setup>
import { computed } from 'vue'
import BreathingCanvas from '../components/BreathingCanvas.vue'
import CompletionMessage from '../components/CompletionMessage.vue'
import SessionControls from '../components/SessionControls.vue'
import SessionTimer from '../components/SessionTimer.vue'
import { t } from '../services/i18n.js'
import { PHASE } from '../services/sessionController.js'
import {
  controller,
  isCompleted,
  isPaused,
  pausedWhileAway,
  phase,
  remainingLabel,
  requestExit,
  returnHome,
  togglePause,
} from '../services/useSession.js'

/**
 * The session's own chrome stays in the layout once the session completes, only
 * hidden and inert: removing it would resize the stage, and the particle field
 * carrying on behind the completion message is measured against that stage.
 */

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
    <div
      class="session__phase session__chrome"
      :class="{ 'session__phase--paused': isPaused }"
      :inert="isCompleted"
    >
      <p class="session__phase-text" aria-live="polite">
        {{ isPaused ? t('session.paused') : phaseLabel }}
      </p>
      <p v-if="pausedWhileAway" class="session__phase-note">
        {{ t('session.pausedAway') }}
      </p>
    </div>

    <div class="session__stage">
      <SessionTimer
        class="session__chrome session__timer"
        :label="remainingLabel"
        :visible="isPaused"
        :inert="isCompleted"
      />

      <BreathingCanvas v-if="controller" :controller="controller" :settling="isCompleted" />

      <CompletionMessage
        v-if="isCompleted && controller"
        :profile-id="controller.profile.id"
        :duration-minutes="controller.durationMinutes"
        @done="returnHome"
      />
    </div>

    <SessionControls
      class="session__chrome session__controls"
      :paused="isPaused"
      :inert="isCompleted"
      @toggle="togglePause"
      @exit="requestExit"
    />
  </main>
</template>

<style scoped>
.session {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 50rem;
  width: 100%;
  margin: 0 auto;
  /* One line of breathing room above the prompt, and none below it: the stage
     starts right under the text and takes everything that is left. */
  padding: 1em 0 var(--space-sm);
}

.session__controls {
  margin-top: var(--space-md);
}

/* Over the stage, not above it: in the flow it would hold a block of empty
   space open for the whole session, since it only appears while paused. */
.session__timer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  /* The canvas is a later sibling and paints the opaque track over anything
     underneath it, so the clock needs a layer of its own. */
  z-index: 1;
}

/* Hidden but still taking up its space, so the stage — and with it the
   particle field's coordinate space — is the same size before and after the
   session completes. `inert` takes it out of the tab order and the
   accessibility tree at the same time. */
.session__chrome[inert] {
  visibility: hidden;
}

/* The guide takes all the height left over: the breathing animation is the
   screen, the controls are the margin (TECH_SPECS §11). The stage spans the
   full session column — the narrow track and the halo that spills past it are
   both drawn on the canvas, so nothing here clips them. */
.session__stage {
  position: relative;
  flex: 1;
  width: 100%;
  min-height: 12rem;
}

/* Above the stage, not over it: the prompt reads as a heading for the
   animation and never sits behind the travelling bubble. */
.session__phase {
  display: grid;
  gap: var(--space-xs);
  justify-items: center;
  text-align: center;
  pointer-events: none;
}

.session__phase-text {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  transition: color 400ms var(--ease-calm);
}

.session__phase--paused .session__phase-text {
  color: var(--color-text);
}

.session__phase-note {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

/* In landscape the guide would be squat; give the controls less room and let
   the guide keep as much height as possible. */
@media (orientation: landscape) and (max-height: 30rem) {
  .session__stage {
    min-height: 8rem;
  }
}
</style>

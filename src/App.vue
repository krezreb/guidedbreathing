<script setup>
/**
 * Screen selection is derived from the session state machine — the state is the
 * single source of truth for both behaviour and what is on screen
 * (TECH_SPECS §6). No router: three screens and no shareable URLs.
 */
import { computed } from 'vue'
import BreathingView from './views/BreathingView.vue'
import ExitConfirmDialog from './components/ExitConfirmDialog.vue'
import HomeView from './views/HomeView.vue'
import InformationView from './views/InformationView.vue'
import LanguageView from './views/LanguageView.vue'
import { initLocale } from './services/i18n.js'
import {
  cancelExit,
  confirmExit,
  exitConfirmVisible,
  homeScreen,
  installLifecycleHandlers,
  isCompleted,
  isSessionActive,
  remainingLabel,
} from './services/useSession.js'

installLifecycleHandlers()
initLocale()

const screen = computed(() => {
  if (isSessionActive.value) return 'session'
  if (isCompleted.value) return 'completed'
  if (homeScreen.value === 'info') return 'info'
  if (homeScreen.value === 'language') return 'language'
  return 'home'
})
</script>

<template>
  <div class="app-shell">
    <!-- The completion message is shown over the breathing screen rather than
         instead of it: the particle field is mid-flight when the session ends
         and carries on falling behind the message, which it cannot do if the
         canvas is torn down and rebuilt at a different size. -->
    <BreathingView v-if="screen === 'session' || screen === 'completed'" />

    <InformationView v-else-if="screen === 'info'" @back="homeScreen = 'home'" />

    <LanguageView v-else-if="screen === 'language'" @back="homeScreen = 'home'" />

    <HomeView v-else />

    <ExitConfirmDialog
      v-if="exitConfirmVisible"
      :remaining-label="remainingLabel"
      @cancel="cancelExit"
      @confirm="confirmExit"
    />
  </div>
</template>

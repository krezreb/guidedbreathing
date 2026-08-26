<script setup>
/**
 * Screen selection is derived from the session state machine — the state is the
 * single source of truth for both behaviour and what is on screen
 * (TECH_SPECS §6). No router: three screens and no shareable URLs.
 */
import { computed } from 'vue'
import BreathingView from './views/BreathingView.vue'
import CompletionMessage from './components/CompletionMessage.vue'
import ExitConfirmDialog from './components/ExitConfirmDialog.vue'
import HomeView from './views/HomeView.vue'
import InformationView from './views/InformationView.vue'
import LanguageView from './views/LanguageView.vue'
import { initLocale } from './services/i18n.js'
import {
  cancelExit,
  confirmExit,
  controller,
  exitConfirmVisible,
  homeScreen,
  installLifecycleHandlers,
  isCompleted,
  isSessionActive,
  remainingLabel,
  returnHome,
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
    <BreathingView v-if="screen === 'session'" />

    <CompletionMessage
      v-else-if="screen === 'completed' && controller"
      :profile-id="controller.profile.id"
      :duration-minutes="controller.durationMinutes"
      @done="returnHome"
    />

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

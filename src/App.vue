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
import {
  cancelExit,
  confirmExit,
  controller,
  exitConfirmVisible,
  homeScreen,
  installLifecycleHandlers,
  isCompleted,
  isSessionActive,
  returnHome,
} from './services/useSession.js'

installLifecycleHandlers()

const screen = computed(() => {
  if (isSessionActive.value) return 'session'
  if (isCompleted.value) return 'completed'
  return homeScreen.value === 'info' ? 'info' : 'home'
})
</script>

<template>
  <div class="app-shell">
    <BreathingView v-if="screen === 'session'" />

    <CompletionMessage
      v-else-if="screen === 'completed' && controller"
      :profile-name="controller.profile.name"
      :duration-minutes="controller.durationMinutes"
      @done="returnHome"
    />

    <InformationView v-else-if="screen === 'info'" @back="homeScreen = 'home'" />

    <HomeView v-else />

    <ExitConfirmDialog
      v-if="exitConfirmVisible"
      @cancel="cancelExit"
      @confirm="confirmExit"
    />
  </div>
</template>

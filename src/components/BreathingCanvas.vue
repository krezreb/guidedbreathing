<script setup>
/**
 * The p5.js breathing animation (TECH_SPECS §4).
 *
 * p5 renders only. Every frame it asks the controller where the bubble should
 * be, so position derives from real elapsed time rather than frame count and
 * dropped frames cannot desynchronise the animation from the timer.
 *
 * Instance mode with an explicit remove() on unmount: p5 installs its own
 * animation loop and global listeners, and leaks a running sketch per session
 * otherwise.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { PHASE } from '../services/sessionController.js'

const props = defineProps({
  controller: { type: Object, required: true },
})

const host = ref(null)
let sketch = null
let observer = null

/** Colours come from the central CSS variables, never from literals here. */
function palette() {
  const styles = getComputedStyle(document.documentElement)
  const read = (name) => styles.getPropertyValue(name).trim()
  return {
    accent: read('--color-accent'),
    accentSoft: read('--color-accent-soft'),
  }
}

onMounted(async () => {
  // Lazily imported so the main screen paints without waiting for p5.
  const p5 = (await import('p5')).default
  if (!host.value) return

  const colors = palette()

  sketch = new p5((p) => {
    let width = 0
    let height = 0

    const measure = () => {
      const rect = host.value.getBoundingClientRect()
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
    }

    p.setup = () => {
      measure()
      p.createCanvas(width, height)
      p.noStroke()
    }

    p.draw = () => {
      const snapshot = props.controller.snapshot()
      const inset = Math.min(width, height) * 0.06
      const trackTop = inset
      const trackBottom = height - inset
      const travel = trackBottom - trackTop

      // Bubble grows slightly toward the top: fuller lungs, gentler read.
      const baseRadius = Math.min(width, height) * 0.125
      const radius = baseRadius * (0.85 + 0.3 * snapshot.position)

      // position 0 = bottom of the guide, 1 = top.
      const y = trackBottom - snapshot.position * travel
      const x = width / 2

      p.clear()

      // Soft halo, brighter while inhaling.
      const haloStrength = snapshot.phase === PHASE.INHALE ? 26 : 18
      for (let ring = 4; ring >= 1; ring -= 1) {
        const halo = p.color(colors.accent)
        halo.setAlpha(haloStrength / ring)
        p.fill(halo)
        p.circle(x, y, radius * 2 * (1 + ring * 0.42))
      }

      p.fill(colors.accentSoft)
      p.circle(x, y, radius * 2)
    }

    p.windowResized = () => {
      measure()
      p.resizeCanvas(width, height)
    }

    // Container size changes on address-bar collapse and rotation, which
    // windowResized alone does not always catch.
    observer = new ResizeObserver(() => {
      if (!sketch) return
      measure()
      p.resizeCanvas(width, height)
    })
    observer.observe(host.value)
  }, host.value)
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (sketch) {
    sketch.remove()
    sketch = null
  }
})
</script>

<template>
  <div ref="host" class="canvas-host" aria-hidden="true"></div>
</template>

<style scoped>
.canvas-host {
  position: absolute;
  inset: 0;
  /* The guide's corners are rounded but no longer clip their children, so the
     bubble's halo is clipped here instead. */
  border-radius: inherit;
  overflow: hidden;
}

.canvas-host :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>

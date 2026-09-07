<script setup>
/**
 * The p5.js breathing animation (TECH_SPECS §4).
 *
 * p5 renders only. Every frame it asks the controller where the bubble should
 * be, so position derives from real elapsed time rather than frame count and
 * dropped frames cannot desynchronise the animation from the timer.
 *
 * The guide track is drawn by p5 rather than by a DOM box behind it: the halo
 * is wider than the track on purpose, and a DOM box would either clip it or
 * need its geometry duplicated in CSS and here.
 *
 * Instance mode with an explicit remove() on unmount: p5 installs its own
 * animation loop and global listeners, and leaks a running sketch per session
 * otherwise.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { makeParticles, stepParticles } from '../services/particles.js'

const props = defineProps({
  controller: { type: Object, required: true },
})

/** Halo geometry, shared by the draw loop and the travel inset. */
const HALO_RINGS = 4
const HALO_SPREAD = 0.42

/** Track width as a share of the stage, capped so it stays a narrow column. */
const TRACK_RATIO = 0.34
const TRACK_MAX = 240

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
    surface: read('--color-surface'),
    border: read('--color-border'),
    radius: parseFloat(read('--radius-lg')) || 24,
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
    const particles = makeParticles()

    const measure = () => {
      const rect = host.value.getBoundingClientRect()
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
    }

    p.setup = () => {
      measure()
      p.createCanvas(width, height)
    }

    p.draw = () => {
      const snapshot = props.controller.snapshot()

      const trackWidth = Math.min(width * TRACK_RATIO, TRACK_MAX)
      const x = width / 2

      // Bubble grows slightly toward the top: fuller lungs, gentler read.
      const baseRadius = Math.min(trackWidth * 0.26, height * 0.11)
      const radius = baseRadius * (0.85 + 0.3 * snapshot.position)

      // The halo spills past the track sideways, but must stay inside the
      // canvas vertically, so the travel is inset by its widest reach.
      const haloReach = baseRadius * 1.15 * (1 + HALO_RINGS * HALO_SPREAD)
      const travelTop = haloReach
      const travelBottom = height - haloReach

      // position 0 = bottom of the guide, 1 = top.
      const y = travelBottom - snapshot.position * (travelBottom - travelTop)

      p.clear()

      // The track: a still column the bubble travels along.
      p.stroke(colors.border)
      p.strokeWeight(1)
      p.fill(colors.surface)
      p.rect(x - trackWidth / 2, 0.5, trackWidth, height - 1, colors.radius)
      p.noStroke()

      // Background field, over the track but under the bubble and its halo.
      // deltaTime is capped: a backgrounded tab hands back one huge frame,
      // which would otherwise teleport the whole field.
      const dtSeconds = Math.min(p.deltaTime, 100) / 1000
      stepParticles(particles, snapshot.phase, dtSeconds)
      const particleScale = Math.min(width, height)
      for (const particle of particles) {
        const dot = p.color(colors.accentSoft)
        dot.setAlpha(particle.opacity)
        p.fill(dot)
        p.circle(particle.x * width, particle.y * height, particle.radius * particleScale * 2)
      }

      // Soft halo. Constant strength: the bubble sits on top of it, so any
      // phase-dependent alpha reads as the bubble changing colour.
      const haloStrength = 22
      for (let ring = HALO_RINGS; ring >= 1; ring -= 1) {
        const halo = p.color(colors.accent)
        halo.setAlpha(haloStrength / ring)
        p.fill(halo)
        p.circle(x, y, radius * 2 * (1 + ring * HALO_SPREAD))
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
}

.canvas-host :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>

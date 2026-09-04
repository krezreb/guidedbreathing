/**
 * The background particle field (TECH_SPECS §4).
 *
 * Pure geometry, no p5: positions are unit fractions of the canvas (x 0 = left,
 * y 0 = top) so a resize needs no rescaling, and the drift is driven by elapsed
 * seconds rather than frames so it cannot speed up on a faster display.
 *
 * Particles rise while the breath comes in and settle back down more slowly
 * while it goes out, which is what makes the field read as breath rather than
 * as weather.
 */
import { PHASE } from './sessionController.js'

/** Unit heights per second. Exhale is gentler than inhale: it falls, it does
 *  not drop. */
const RISE_PER_SECOND = 0.07
const FALL_PER_SECOND = 0.028

export function makeParticles(count, rand = Math.random) {
  return Array.from({ length: count }, () => ({
    x: rand(),
    y: rand(),
    // Radius in unit terms; scaled to pixels at draw time.
    radius: 0.002 + rand() * 0.004,
    alpha: 10 + rand() * 26,
    // Per-particle speed jitter, so the field never moves as one sheet.
    speed: 0.6 + rand() * 0.8,
  }))
}

/**
 * Advance the field in place by dtSeconds. Particles that leave one edge
 * re-enter at the other, so the field never empties out during a long session.
 */
export function stepParticles(particles, phase, dtSeconds) {
  const perSecond = phase === PHASE.INHALE ? -RISE_PER_SECOND : FALL_PER_SECOND
  for (const particle of particles) {
    particle.y += perSecond * particle.speed * dtSeconds
    if (particle.y < 0) particle.y += 1
    else if (particle.y > 1) particle.y -= 1
  }
  return particles
}
